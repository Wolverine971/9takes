// src/routes/questions/[slug]/+page.server.ts
import { supabase } from '$lib/supabase';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { TAKE_FETCH_LIMIT } from '$lib/components/questions/commentRanking';
import { getQuestionTakes, isCommentRankingEnabled } from '$lib/server/questionTakes';
import { isVerifiedGooglebot } from '$lib/server/verifiedGooglebot';
import {
	getQuestionAnswerSummary,
	hasQuestionAnswerSummary
} from '$lib/server/questionAnswerSummary';
import { CONTENT_GUARD_CACHE_CONTROL } from '$lib/server/contentAccessGuard';
import type { AnswerSummary } from '$lib/types/questions';

import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { error, fail } from '@sveltejs/kit';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';
import { recordGiveFirstEvent } from '$lib/server/giveFirstFunnel';
import {
	PUBLIC_COMMENT_FIELDS,
	assertCommentAccess,
	checkRateLimit,
	checkUserAnswered,
	createCommentData,
	getQuestion,
	handleCommentCreation,
	parseUrls
} from '$lib/server/questionComments';
import { checkDemoTime } from '../../../utils/api';
import { loadRouteDemoTime } from '$lib/server/demoTime';
import { mapDemoValues } from '../../../utils/demo';
import {
	createCommentSchema,
	flagCommentSchema,
	likeCommentSchema,
	replyOptInSchema,
	subscribeSchema,
	updateQuestionImgSchema
} from '$lib/validation/questionSchemas';
import { uploadQuestionImage } from '$lib/server/questionImages';
import { buildQuestionCategorySlug } from '$lib/utils/questionCategorySlug';
import {
	REPLY_RETURN_COOKIE,
	REPLY_RETURN_COOKIE_PATH,
	verifyReplyNotificationReturn
} from '$lib/server/replyNotificationReturn';
import type {
	Comment as PublicComment,
	ReplyNotificationReturnContext,
	ReplyNotificationThread
} from '$lib/types/questions';
import {
	normalizePinnedCommentIds,
	type NextStarterLink
} from '$lib/components/questions/curatedReveal';
import type { ReplyFocusThread } from '$lib/components/questions/newReplyTreatment';
import { z } from 'zod';

// =============================================================================
// Constants
// =============================================================================
// Comment rate limit (5 per minute) and PUBLIC_COMMENT_FIELDS live in
// $lib/server/questionComments, shared with POST /api/homepage/answer.

// Pagination defaults
const DEFAULT_COMMENTS_LIMIT = 10;
const DEFAULT_LINKS_LIMIT = 10;
// ?reply=<id> deep links pre-load the parent take's replies so the reply exists on first paint.
const REPLY_FOCUS_REPLIES_LIMIT = 50;

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const TAGGABLE_LEAF_LEVEL = 3;
const MAX_CATEGORIES_PER_QUESTION = 3;
const NEW_CATEGORY_MIN_LENGTH = 2;
const NEW_CATEGORY_MAX_LENGTH = 60;

function queueGiveFirstEvent(
	event: Parameters<typeof runBestEffortTelemetry>[0],
	payload: Parameters<typeof recordGiveFirstEvent>[0]
) {
	runBestEffortTelemetry(event, recordGiveFirstEvent(payload), (telemetryError) => {
		logBestEffortTelemetryFailure('Failed to record give-first funnel event', telemetryError, {
			eventType: payload.eventType,
			questionId: payload.questionId
		});
	});
}

const updateQuestionCategoriesSchema = z.object({
	questionId: z
		.string()
		.regex(/^\d+$/, 'Invalid question id')
		.transform((value) => Number.parseInt(value, 10)),
	tagIds: z.string().transform((value, ctx) => {
		try {
			const parsed = JSON.parse(value);
			if (!Array.isArray(parsed)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'tagIds must be an array'
				});
				return z.NEVER;
			}
			const numericIds = parsed
				.map((item) => Number.parseInt(String(item), 10))
				.filter((id) => Number.isFinite(id));
			return Array.from(new Set(numericIds));
		} catch {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invalid tagIds payload'
			});
			return z.NEVER;
		}
	})
});

const createLeafCategorySchema = z.object({
	questionId: z
		.string()
		.regex(/^\d+$/, 'Invalid question id')
		.transform((value) => Number.parseInt(value, 10)),
	parentId: z
		.string()
		.regex(/^\d+$/, 'Invalid parent id')
		.transform((value) => Number.parseInt(value, 10)),
	categoryName: z
		.string()
		.trim()
		.min(NEW_CATEGORY_MIN_LENGTH)
		.max(NEW_CATEGORY_MAX_LENGTH)
		.transform((value) => value.replace(/\s+/g, ' '))
});

export const load: PageServerLoad = async (event) => {
	// Read the (memory-cached) demo switch directly instead of awaiting
	// event.parent(): parent() also waits on the root layout's profile query,
	// which would serialize a signed-in viewer's whole load behind it. This
	// load reruns on every post-answer reveal, so each round trip is felt.
	const isDemoTime = (await loadRouteDemoTime(event.locals.supabase)) === true;
	const session = event.locals.session;
	const cookie = event.cookies.get('9tfingerprint');

	const question = await getQuestion(event.params.slug, isDemoTime, event.locals.supabase);
	if (!question) {
		throw error(404, { message: 'No question found' });
	}

	const replyNotificationReturn = consumeReplyNotificationReturn(event, question.id);
	const canEditTags =
		!isDemoTime && Boolean(session?.user?.id && question.author_id === session?.user?.id);
	// T-43: started now so a crawler's DNS verification overlaps the gate reads.
	// Anything without a Googlebot user agent resolves false at once, no DNS.
	const verifiedCrawler: Promise<boolean> = isDemoTime
		? Promise.resolve(false)
		: isVerifiedGooglebot({
				userAgent: event.request?.headers.get('user-agent'),
				ip: getRequestIp(event)
			});
	const [viewerHasAnswered, questionTags, replyNotificationThread, categoryEditor] =
		await Promise.all([
			checkUserAnswered(cookie, question.id, session?.user?.id, event.locals.supabase),
			getQuestionTags(question.id),
			replyNotificationReturn
				? getReplyNotificationThread(replyNotificationReturn, isDemoTime)
				: null,
			canEditTags ? getCategoryEditorData() : null
		]);
	const userHasAnswered = Boolean(viewerHasAnswered || replyNotificationReturn);

	if (!userHasAnswered) {
		// Give-first wall is being shown to a not-yet-answered visitor. Log the
		// gate hit (fingerprint-keyed) so we can measure wall-hit -> contribution.
		if (!isDemoTime && cookie) {
			queueGiveFirstEvent(event, {
				fingerprint: cookie,
				eventType: 'gate_shown',
				questionId: question.id,
				path: event.url.pathname,
				userId: session?.user?.id ?? null,
				userAgent: event.request?.headers.get('user-agent')
			});
		}

		const [commentCount, aiComments, { curation, nextStarter }, lockedGist] = await Promise.all([
			getCommentCount(question.id, isDemoTime),
			isDemoTime ? null : getAIComments(question.id),
			getCurationWithNextStarter(question.id, isDemoTime),
			getLockedAnswerSummary(question.id, isDemoTime, verifiedCrawler)
		]);
		if (lockedGist.verifiedCrawler) {
			// The crawler variant carries gated content: never let a shared
			// cache replay it to a human (or a locked page to the crawler).
			event.setHeaders({ 'cache-control': CONTENT_GUARD_CACHE_CONTROL });
		}
		// Give-first integrity: pinned human takes are never sent before the
		// visitor answers. Only the starter position (for the next-question
		// nudge) travels with the locked payload. The gist travels only to
		// IP-verified Googlebot (T-43); humans get just whether one exists.
		return {
			...createBaseResponse(
				question,
				[],
				commentCount ?? 0,
				0,
				questionTags,
				session,
				userHasAnswered,
				event,
				aiComments,
				undefined,
				canEditTags,
				categoryEditor
			),
			replyNotificationReturn,
			replyNotificationThread,
			starterRank: curation.starterRank,
			nextStarter,
			replyFocus: null as ReplyFocusThread | null,
			answerSummary: lockedGist.answerSummary,
			answerSummaryAvailable: lockedGist.answerSummaryAvailable
		};
	}

	// The gist joins the reveal batch below without changing its shape.
	const answerSummaryRead = isDemoTime ? Promise.resolve(null) : readAnswerSummary(question.id);

	// One parallel batch: this is the payload the post-answer reveal waits on.
	const [comments, links, aiComments, flagReasons, { curation, nextStarter }, replyFocus] =
		await Promise.all([
			isDemoTime
				? getComments(question.id, true, false)
				: getQuestionTakes(question.id, { viewerId: session?.user?.id, fingerprint: cookie }),
			getQuestionLinks(question.id),
			isDemoTime ? null : getAIComments(question.id),
			getFlagReasons(),
			getCurationWithNextStarter(question.id, isDemoTime),
			getReplyFocusThread(
				question.id,
				parseReplyFocusParam(event.url.searchParams.get('reply')),
				isDemoTime
			)
		]);

	return {
		...createFullResponse(
			question,
			comments.data ?? [],
			comments.count ?? 0,
			// Removed takes are never sent (the old read always returned [] under RLS).
			[],
			0,
			links.data,
			links.count ?? 0,
			questionTags,
			session,
			userHasAnswered,
			event,
			aiComments,
			isDemoTime,
			flagReasons?.data || [],
			canEditTags,
			categoryEditor
		),
		replyNotificationReturn,
		replyNotificationThread,
		starterRank: curation.starterRank,
		nextStarter,
		replyFocus,
		pinnedCommentIds: curation.pinnedCommentIds,
		ownComments: 'ownComments' in comments ? comments.ownComments : [],
		commentViewsEnabled: !isDemoTime,
		commentRankingEnabled: !isDemoTime && isCommentRankingEnabled(),
		...(await answeredGist(answerSummaryRead))
	};
};

// =============================================================================
// "The gist so far" (T-43): gated AI paraphrase of how people answered
// =============================================================================
type GistPayload = {
	answerSummary: AnswerSummary | null;
	answerSummaryAvailable: boolean;
};

function getRequestIp(event: { getClientAddress?: () => string }): string | null {
	try {
		return event.getClientAddress?.() ?? null;
	} catch {
		return null;
	}
}

/** Service-role read; null on any failure (e.g. before the migration lands). */
async function readAnswerSummary(questionId: number): Promise<AnswerSummary | null> {
	try {
		return await getQuestionAnswerSummary(getSupabaseAdminClient(), questionId);
	} catch {
		return null;
	}
}

async function answeredGist(read: Promise<AnswerSummary | null>): Promise<GistPayload> {
	const answerSummary = await read;
	return { answerSummary, answerSummaryAvailable: Boolean(answerSummary) };
}

/**
 * The locked page. Only IP-verified Googlebot gets the summary text; every
 * other visitor gets just whether one exists, so the paywall JSON-LD is the
 * same on every version of the page while the gated text stays server-side.
 */
async function getLockedAnswerSummary(
	questionId: number,
	isDemoTime: boolean,
	verifiedCrawler: Promise<boolean>
): Promise<GistPayload & { verifiedCrawler: boolean }> {
	if (isDemoTime) {
		return { answerSummary: null, answerSummaryAvailable: false, verifiedCrawler: false };
	}
	if (await verifiedCrawler) {
		const answerSummary = await readAnswerSummary(questionId);
		return { answerSummary, answerSummaryAvailable: Boolean(answerSummary), verifiedCrawler: true };
	}
	return {
		answerSummary: null,
		answerSummaryAvailable: await answerSummaryExists(questionId),
		verifiedCrawler: false
	};
}

/** Existence only (never the text); false on any failure. */
async function answerSummaryExists(questionId: number): Promise<boolean> {
	try {
		return await hasQuestionAnswerSummary(getSupabaseAdminClient(), questionId);
	} catch {
		return false;
	}
}

function consumeReplyNotificationReturn(
	event: RequestEvent,
	questionId: number
): ReplyNotificationReturnContext | null {
	const signed = event.cookies.get(REPLY_RETURN_COOKIE);
	if (!signed) return null;

	event.cookies.delete(REPLY_RETURN_COOKIE, { path: REPLY_RETURN_COOKIE_PATH });
	try {
		const context = verifyReplyNotificationReturn(signed);
		return context?.questionId === questionId ? context : null;
	} catch (returnError) {
		console.warn('Could not verify reply notification return context', returnError);
		return null;
	}
}

async function getReplyNotificationThread(
	context: ReplyNotificationReturnContext,
	isDemoTime: boolean
): Promise<ReplyNotificationThread | null> {
	if (isDemoTime) return null;
	// Take text is service-role only; the signed return cookie is the gate here.
	const { data, error: threadError } = await getSupabaseAdminClient()
		.from('comments')
		.select(
			`${PUBLIC_COMMENT_FIELDS}, removed, profiles:public_profiles (external_id, enneagram), comment_like (id, comment_id, user_id)`
		)
		.in('id', [context.commentId, context.replyCommentId]);

	if (threadError) {
		console.warn('Could not load reply notification thread');
		return null;
	}

	const rows = (data ?? []) as unknown as PublicComment[];
	const parent =
		rows.find(
			(comment) =>
				comment.id === context.commentId &&
				comment.parent_type === 'question' &&
				comment.parent_id === context.questionId &&
				comment.removed !== true
		) ?? null;
	const reply =
		context.targetStatus === 'available'
			? (rows.find(
					(comment) =>
						comment.id === context.replyCommentId &&
						comment.parent_type === 'comment' &&
						comment.parent_id === context.commentId &&
						comment.removed !== true
				) ?? null)
			: null;

	return { parent, reply };
}

async function createQuestionComment(event: RequestEvent) {
	const { request, getClientAddress, locals } = event;
	const { body, demo_time } = await getRequestData(request);
	const ip = getClientAddress();
	const db = locals.supabase as any;
	const sessionUserId = locals.session?.user?.id ?? null;

	const validationResult = createCommentSchema.safeParse(body);
	if (!validationResult.success) {
		const firstError = validationResult.error.errors[0]?.message || 'Invalid comment data';
		throw error(400, { message: firstError });
	}
	const commentInput = validationResult.data;

	// The rate limit and the give-first access check are independent reads, so
	// they share one round trip. The rate-limit rejection still wins when both fail.
	const [rateLimit, access] = await Promise.allSettled([
		demo_time ? Promise.resolve(true) : checkRateLimit(commentInput.fingerprint, ip),
		assertCommentAccess(commentInput, sessionUserId, demo_time)
	]);
	if (rateLimit.status === 'fulfilled' && !rateLimit.value) {
		throw error(429, {
			message: 'Too many comments. Please wait a minute before trying again.'
		});
	}
	if (access.status === 'rejected') throw access.reason;
	const commentData = await createCommentData(commentInput, ip, sessionUserId);
	const record = await handleCommentCreation(db, commentData, commentInput.parent_type, demo_time);
	if (!demo_time && commentInput.parent_type === 'question') {
		// Enrich only an accepted comment, using its validated parent question.
		void parseUrls(commentInput.comment, commentInput.parent_id).catch(() => {
			console.warn('Background URL parsing failed');
		});
	}

	// Give-first contribution: log it (fingerprint-keyed) so it joins to the
	// gate_shown event for the wall-hit -> contribution funnel.
	if (!demo_time && commentInput.parent_type === 'question' && commentInput.fingerprint) {
		queueGiveFirstEvent(event, {
			fingerprint: commentInput.fingerprint,
			eventType: 'contribution',
			questionId: Number(commentInput.parent_id),
			path: event.url.pathname,
			userId: sessionUserId
		});
	}

	return mapDemoValues(record as Record<string, unknown> | null);
}

export const actions: Actions = {
	// Keep both action names as aliases while older clients migrate. Their
	// validation, authorization, side effects, and response shape stay identical.
	createComment: createQuestionComment,
	createCommentRando: createQuestionComment,

	subscribeToCommentReplies: async ({ request, locals }) => {
		if ((await checkDemoTime()) === true) {
			return fail(422, { replyOptIn: { status: 'ineligible' } });
		}
		const formData = await request.formData();
		const validationResult = replyOptInSchema.safeParse(Object.fromEntries(formData));
		if (!validationResult.success) {
			return fail(400, { replyOptIn: { status: 'invalid' } });
		}

		const input = validationResult.data;
		const { data, error: subscriptionError } = await (locals.supabase as any).rpc(
			'create_comment_reply_subscription',
			{
				p_comment_id: Number.parseInt(input.comment_id, 10),
				p_question_id: Number.parseInt(input.question_id, 10),
				p_fingerprint: input.fingerprint,
				p_email: input.email
			}
		);

		if (subscriptionError) {
			console.error('Failed to create comment reply subscription', subscriptionError);
			return fail(500, { replyOptIn: { status: 'failed' } });
		}

		const status =
			typeof data?.status === 'string' ? data.status : typeof data === 'string' ? data : 'failed';
		if (status === 'subscribed' || status === 'already_subscribed') {
			return { replyOptIn: { status } };
		}

		return fail(status === 'invalid' ? 400 : 422, { replyOptIn: { status } });
	},

	likeComment: async ({ request, locals }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const db = locals.supabase as any;
		const { body, demo_time } = await getRequestData(request);
		const validationResult = likeCommentSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.errors[0]?.message || 'Invalid like data';
			throw error(400, { message: firstError });
		}

		const { parent_id, user_id, operation } = validationResult.data;
		const sessionUserId = resolveSessionBoundUserId(user_id, session.user.id, 'like comments');

		if (operation === 'add') {
			return await addLike(db, parent_id, sessionUserId);
		}
		return await removeLike(db, parent_id, sessionUserId, demo_time);
	},

	subscribe: async ({ request, locals }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const db = locals.supabase as any;
		const { body, demo_time } = await getRequestData(request);
		const validationResult = subscribeSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.errors[0]?.message || 'Invalid subscription data';
			throw error(400, { message: firstError });
		}

		const { parent_id, user_id, operation } = validationResult.data;
		const sessionUserId = resolveSessionBoundUserId(
			user_id,
			session.user.id,
			'manage subscriptions'
		);

		if (operation === 'add') {
			return await addSubscription(db, parent_id, sessionUserId, demo_time);
		}
		return await removeSubscription(db, parent_id, sessionUserId, demo_time);
	},

	saveLinkClick: async ({ request }) => {
		const { linkId } = Object.fromEntries(await request.formData());
		await incrementLinkClicks(linkId as string);
		return true;
	},

	flagComment: async ({ request, locals }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const body = Object.fromEntries(await request.formData());

		// Validate input
		const validationResult = flagCommentSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.errors[0]?.message || 'Invalid flag data';
			throw error(400, { message: firstError });
		}

		const { comment_id, reason_id, description } = validationResult.data;
		await flagComment(locals.supabase, session.user.id, comment_id, reason_id, description || '');

		return { success: true };
	},

	updateQuestionImg: async ({ request, locals, params }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const db = locals.supabase as any;
		const demoTime = (await checkDemoTime(db)) === true;
		if (demoTime) {
			throw error(403, 'Image updates are unavailable in demo mode');
		}

		const formData = Object.fromEntries(await request.formData());
		const parsed = updateQuestionImgSchema.safeParse(formData);
		if (!parsed.success) {
			throw error(400, parsed.error.errors[0]?.message || 'Invalid image update payload');
		}

		const question = await getQuestionForMutation(db, params.slug, demoTime);
		if (!question) {
			throw error(404, 'Question not found');
		}
		if (question.author_id !== session.user.id) {
			throw error(403, 'Only the question owner can update the image');
		}

		const upload = await uploadQuestionImage({
			supabase: db,
			dataUrl: parsed.data.img_url,
			questionUrl: question.url || String(question.id),
			maxBytes: MAX_IMAGE_SIZE_BYTES
		});
		await updateQuestionImageById(db, question.id, upload.path);
		return true;
	},

	updateCategories: async ({ request, locals, params }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const db = locals.supabase as any;
		const demoTime = (await checkDemoTime(db)) === true;
		if (demoTime) {
			throw error(403, 'Tag editing is unavailable in demo mode');
		}

		const formData = Object.fromEntries(await request.formData());
		const parsed = updateQuestionCategoriesSchema.safeParse(formData);
		if (!parsed.success) {
			throw error(400, parsed.error.errors[0]?.message || 'Invalid category update payload');
		}

		const { questionId, tagIds } = parsed.data;
		if (!tagIds.length) {
			throw error(400, 'Select at least one category');
		}
		if (tagIds.length > MAX_CATEGORIES_PER_QUESTION) {
			throw error(
				400,
				`You can select up to ${MAX_CATEGORIES_PER_QUESTION} categories per question`
			);
		}

		const question = await getQuestionForMutation(db, params.slug, demoTime);
		if (!question || question.id !== questionId) {
			throw error(404, 'Question not found');
		}
		if (question.author_id !== session.user.id) {
			throw error(403, 'Only the question owner can edit categories');
		}

		await validateLeafCategories(db, tagIds);

		const { error: deleteTagError } = await db
			.from('question_category_tags')
			.delete()
			.eq('question_id', questionId);
		if (deleteTagError) {
			throw error(500, 'Failed to clear existing categories');
		}

		const { error: insertTagError } = await db.from('question_category_tags').insert(
			tagIds.map((tagId) => ({
				question_id: questionId,
				tag_id: tagId
			}))
		);
		if (insertTagError) {
			throw error(500, 'Failed to save categories');
		}

		await syncLegacyTagMappings(db, tagIds);

		const { error: removeLegacyQuestionTagsError } = await db
			.from('question_tags')
			.delete()
			.eq('question_id', questionId);
		if (removeLegacyQuestionTagsError) {
			throw error(500, 'Failed to clear legacy tags');
		}

		const { error: insertLegacyQuestionTagsError } = await db.from('question_tags').insert(
			tagIds.map((tagId) => ({
				question_id: questionId,
				tag_id: tagId
			}))
		);
		if (insertLegacyQuestionTagsError) {
			throw error(500, 'Failed to update legacy tags');
		}

		const { error: updateQuestionError } = await db
			.from('questions')
			.update({
				tagged: true,
				flagged: false,
				updated_at: new Date().toISOString()
			})
			.eq('id', questionId);
		if (updateQuestionError) {
			throw error(500, 'Failed to update question metadata');
		}

		return {
			success: true,
			tagIds
		};
	},

	createLeafCategory: async ({ request, locals, params }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const db = locals.supabase as any;
		const demoTime = (await checkDemoTime(db)) === true;
		if (demoTime) {
			throw error(403, 'Category creation is unavailable in demo mode');
		}

		const formData = Object.fromEntries(await request.formData());
		const parsed = createLeafCategorySchema.safeParse(formData);
		if (!parsed.success) {
			throw error(400, parsed.error.errors[0]?.message || 'Invalid category create payload');
		}

		const { questionId, parentId, categoryName } = parsed.data;

		const question = await getQuestionForMutation(db, params.slug, demoTime);
		if (!question || question.id !== questionId) {
			throw error(404, 'Question not found');
		}
		if (question.author_id !== session.user.id) {
			throw error(403, 'Only the question owner can create categories here');
		}

		const { data: parentCategory, error: parentError } = await db
			.from('question_categories')
			.select('id, level')
			.eq('id', parentId)
			.maybeSingle();
		if (parentError || !parentCategory) {
			throw error(400, 'Parent category not found');
		}
		if (parentCategory.level !== TAGGABLE_LEAF_LEVEL - 1) {
			throw error(400, 'New categories must be created under a level 2 parent');
		}

		const { data: existingCategory, error: existingCategoryError } = await db
			.from('question_categories')
			.select('id, category_name, slug, parent_id, level')
			.eq('parent_id', parentId)
			.ilike('category_name', categoryName)
			.maybeSingle();
		if (existingCategoryError) {
			throw error(500, 'Failed to validate category uniqueness');
		}
		if (existingCategory) {
			return { success: true, category: existingCategory, created: false };
		}

		const category = await createLeafCategoryWithRetry(db, parentId, categoryName);
		await syncLegacyTagMappings(db, [category.id]);
		return { success: true, category, created: true };
	}
};

interface RequestData {
	body: Record<string, FormDataEntryValue>;
	demo_time: boolean;
}

async function getRequestData(request: Request): Promise<RequestData> {
	const body = Object.fromEntries(await request.formData());
	const demo_time = (await checkDemoTime()) === true;
	return { body, demo_time };
}

function resolveSessionBoundUserId(
	claimedUserId: string | undefined,
	sessionUserId: string,
	action: string
): string {
	if (claimedUserId && claimedUserId !== sessionUserId) {
		throw error(403, { message: `Cannot ${action} as another user` });
	}

	return sessionUserId;
}

async function addLike(db: any, parent_id: string, user_id: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data: record, error: addLikeError } = await (db.from('comment_like') as any)
		.insert({ comment_id: parseInt(parent_id), user_id })
		.select('id, comment_id, user_id')
		.single();

	if (addLikeError) {
		console.error(addLikeError);
		throw error(500, { message: 'Failed to add like' });
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// Like counts are maintained atomically by the database trigger.
	return record;
}

async function removeLike(db: any, parent_id: string, user_id: string, demo_time: boolean) {
	const { error: removeLikeError } = await db
		.from(demo_time ? 'comment_like_demo' : 'comment_like')
		.delete()
		.eq('user_id', user_id)
		.eq('comment_id', parent_id);

	if (removeLikeError) {
		console.error(removeLikeError);
		throw error(500, { message: 'Failed to remove like' });
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// Like counts are maintained atomically by the database trigger.
	return null;
}

async function addSubscription(db: any, parent_id: string, user_id: string, demo_time: boolean) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data: subscriptionRecord, error: addSubscriptionError } = await (
		db.from(demo_time ? 'subscriptions_demo' : 'subscriptions') as any
	)
		.insert({ question_id: parseInt(parent_id), user_id })
		.select('id, question_id, user_id')
		.single();

	if (addSubscriptionError) {
		console.error(addSubscriptionError);
		throw error(500, { message: 'Failed to add subscription' });
	}

	return subscriptionRecord;
}

async function removeSubscription(db: any, parent_id: string, user_id: string, demo_time: boolean) {
	const { error: removeSubscriptionError } = await db
		.from(demo_time ? 'subscriptions_demo' : 'subscriptions')
		.delete()
		.eq('user_id', user_id)
		.eq('question_id', parent_id);

	if (removeSubscriptionError) {
		console.error(removeSubscriptionError);
		throw error(500, { message: 'Failed to remove subscription' });
	}

	return null;
}

async function incrementLinkClicks(linkId: string) {
	const id = Number.parseInt(linkId, 10);
	if (!Number.isSafeInteger(id) || id <= 0) return;
	// links is service-role only (it holds URLs lifted from takes). Under the
	// anon client this UPDATE matched nothing (no anon UPDATE policy).
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { error: incrementError } = await (getSupabaseAdminClient().rpc as any)(
		'increment_clicks',
		{ link_id: id }
	);

	if (incrementError) {
		console.error('Failed to increment link clicks:', incrementError);
		// Don't throw - link click tracking is non-critical
	}
}

async function flagComment(
	db: any,
	userId: string,
	commentId: string,
	reasonId: string,
	description: string
) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { error: flagCommentError } = await (db.from('flagged_comments') as any).insert({
		flagged_by: userId,
		comment_id: parseInt(commentId),
		reason_id: parseInt(reasonId),
		description: description || null
	});

	if (flagCommentError) {
		console.error(flagCommentError);
		throw error(500, { message: 'Failed to flag comment' });
	}
}

async function updateQuestionImageById(db: any, questionId: number, imgPath: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { error: updateError } = await (db.from('questions') as any)
		.update({ img_url: imgPath })
		.eq('id', questionId);

	if (updateError) {
		console.error('Error updating question image URL:', updateError);
	}
}

async function getQuestionTags(questionId: number) {
	const { data, error } = await supabase
		.from('question_category_tags')
		.select('question_id, tag_id, question_categories(id, category_name, slug, parent_id, level)')
		.eq('question_id', questionId);

	if (error) {
		console.log('No question tags for question', error);
	}
	return data;
}

async function getCommentCount(questionId: number, demo_time: boolean) {
	const { count } = await supabase
		.from(demo_time ? 'comments_demo' : 'comments')
		.select('id', { count: 'exact', head: true })
		.eq('parent_type', 'question')
		.eq('parent_id', questionId)
		.eq('removed', false);
	return count;
}

async function getComments(questionId: number, demo_time: boolean, removed: boolean) {
	// Removed takes never render here: under RLS this read always returned [],
	// so it is short-circuited rather than queried with the service role.
	if (removed) return { data: [], count: 0 };

	const table = demo_time ? 'comments_demo' : 'comments';
	const profiles = demo_time ? 'profiles_demo' : 'profiles';
	const commentLike = demo_time ? 'comment_like_demo' : 'comment_like';

	// Answered branch only (demo mode). Take text is service-role only.
	const { data, count, error } = await getSupabaseAdminClient()
		.from(table)
		.select(
			`${PUBLIC_COMMENT_FIELDS}, ${profiles}:public_${profiles} (external_id, enneagram), ${commentLike} (id, comment_id, user_id)`,
			{
				count: 'exact'
			}
		)
		.eq('parent_id', questionId)
		.eq('parent_type', 'question')
		.eq('removed', removed)
		.limit(removed ? DEFAULT_COMMENTS_LIMIT : TAKE_FETCH_LIMIT)
		.order('created_at', { ascending: false });

	if (error) {
		console.log(`No ${removed ? 'removed ' : ''}comments for question`, error);
	}
	return { data, count };
}

// =============================================================================
// Curation: "Start here" starters + boosted takes (default-order head)
// (columns added in supabase/migrations/20260906120100_question_starters_and_pins.sql)
// =============================================================================
type QuestionCuration = {
	starterRank: number | null;
	pinnedCommentIds: number[];
};

const EMPTY_CURATION: QuestionCuration = { starterRank: null, pinnedCommentIds: [] };

/**
 * Best-effort read of the curation columns. Kept as its own small query so
 * the question page keeps working exactly as before if the schema migration
 * has not been applied yet (the select fails, we return the empty state).
 */
async function getQuestionCuration(
	questionId: number,
	demo_time: boolean
): Promise<QuestionCuration> {
	if (demo_time) return EMPTY_CURATION;

	const { data, error: curationError } = await (supabase.from('questions') as any)
		.select('starter_rank, pinned_comment_ids')
		.eq('id', questionId)
		.maybeSingle();

	if (curationError || !data) {
		if (curationError) {
			console.warn('Question curation unavailable', curationError.message ?? curationError);
		}
		return EMPTY_CURATION;
	}

	const rank = Number(data.starter_rank);
	return {
		starterRank: Number.isInteger(rank) && rank > 0 ? rank : null,
		pinnedCommentIds: normalizePinnedCommentIds(data.pinned_comment_ids)
	};
}

/** The next starter by rank, for the "Try another" nudge after the reveal. */
async function getNextStarter(starterRank: number | null): Promise<NextStarterLink | null> {
	if (starterRank === null) return null;

	const { data, error: nextError } = await (supabase.from('questions') as any)
		.select('id, question, question_formatted, url, starter_rank')
		.gt('starter_rank', starterRank)
		.not('removed', 'is', true)
		.not('flagged', 'is', true)
		.order('starter_rank', { ascending: true })
		.limit(1)
		.maybeSingle();

	if (nextError || !data?.url) return null;

	return {
		id: Number(data.id),
		url: String(data.url),
		question: String(data.question_formatted || data.question || '').trim(),
		starter_rank: Number(data.starter_rank)
	};
}

/**
 * Curation plus the dependent next-starter lookup as one chain, so the pair
 * can join the load's parallel batch instead of adding a sequential round trip.
 */
async function getCurationWithNextStarter(questionId: number, demo_time: boolean) {
	const curation = await getQuestionCuration(questionId, demo_time);
	return { curation, nextStarter: await getNextStarter(curation.starterRank) };
}

// =============================================================================
// ?reply=<id> deep link (signed-in reply-notification email)
// =============================================================================
function parseReplyFocusParam(raw: string | null): number | null {
	if (!raw || !/^\d{1,15}$/.test(raw.trim())) return null;
	const id = Number.parseInt(raw, 10);
	return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/**
 * Resolve a reply id to its parent take on this question. Anything that does
 * not line up (unknown id, removed reply or parent, parent on another
 * question) resolves to null and the param is ignored silently.
 */
async function getReplyFocusThread(
	questionId: number,
	replyId: number | null,
	demo_time: boolean
): Promise<ReplyFocusThread | null> {
	if (replyId === null || demo_time) return null;

	const replySelect = `${PUBLIC_COMMENT_FIELDS}, profiles:public_profiles (external_id, enneagram)`;
	// Only called once the viewer has answered; take text is service-role only.
	const db = getSupabaseAdminClient();

	const { data: reply, error: replyError } = await db
		.from('comments')
		.select(replySelect)
		.eq('id', replyId)
		.eq('parent_type', 'comment')
		.eq('removed', false)
		.maybeSingle();
	if (replyError || !reply?.parent_id) return null;

	const { data: parent, error: parentError } = await db
		.from('comments')
		.select(
			`${PUBLIC_COMMENT_FIELDS}, profiles:public_profiles (external_id, enneagram), comment_like (id, comment_id, user_id)`
		)
		.eq('id', reply.parent_id)
		.eq('parent_type', 'question')
		.eq('parent_id', questionId)
		.eq('removed', false)
		.maybeSingle();
	if (parentError || !parent) return null;

	const { data: replies, error: repliesError } = await db
		.from('comments')
		.select(replySelect)
		.eq('parent_type', 'comment')
		.eq('parent_id', parent.id)
		.eq('removed', false)
		.order('created_at', { ascending: false })
		.limit(REPLY_FOCUS_REPLIES_LIMIT);
	if (repliesError) return null;

	const rows = (replies ?? []) as unknown as PublicComment[];
	if (!rows.some((row) => row.id === replyId)) {
		// Older than the pre-loaded window: still make sure the anchor exists.
		rows.push(reply as unknown as PublicComment);
	}

	return {
		replyId,
		parent: { ...(parent as unknown as PublicComment), comments: rows }
	};
}

async function getQuestionLinks(questionId: number) {
	// Answered branch only; links (URLs lifted from takes) are service-role only.
	const { data, count, error } = await getSupabaseAdminClient()
		.from('links')
		.select(
			'id, url, domain_id, question_id, meta_title, meta_description, meta_image, clicks, created_at, updated_at',
			{ count: 'exact' }
		)
		.eq('question_id', questionId)
		.limit(DEFAULT_LINKS_LIMIT);

	if (error) {
		console.log('No links for question', error);
	}
	return { data, count };
}

async function getFlagReasons() {
	const { data, error } = await supabase.from('flag_reasons').select('id, reason');
	if (error) {
		console.log('No links for question', error);
	}
	return { data };
}

// comments_ai is admin-only under RLS (20260903 security migration), so the
// anon client always got []. These are AI-written takes, not user content,
// so the server reads them with the service-role client.
async function getAIComments(questionId: number) {
	const { data, error } = await getSupabaseAdminClient()
		.from('comments_ai')
		.select('id, question_id, enneagram_type, comment, created_at')
		.eq('question_id', questionId);

	if (error) {
		console.log('No AI comments for question', error);
	}
	return data;
}

function createBaseResponse(
	question: any,
	comments: any[],
	commentCount: number,
	removedCommentCount: number,
	questionTags: any,
	session: any,
	userHasAnswered: boolean,
	event: any,
	aiComments: any,
	flagReasons?: any[],
	canEditTags?: boolean,
	categoryEditor?: { maxTagsPerQuestion: number; categories: any[] } | null
) {
	return {
		question,
		comments,
		removedComments: [],
		comment_count: commentCount,
		removed_comment_count: removedCommentCount,
		questionTags,
		user: session?.user ? { id: session?.user?.id, email: session?.user?.email } : null,
		flags: {
			userHasAnswered,
			userSignedIn: event?.locals?.session?.user?.aud
		},
		aiComments,
		flagReasons,
		canEditTags: Boolean(canEditTags),
		categoryEditor: categoryEditor ?? null
	};
}

function createFullResponse(
	question: any,
	comments: any[],
	commentCount: number,
	removedComments: any[],
	removedCommentCount: number,
	links: any,
	linksCount: number,
	questionTags: any,
	session: any,
	userHasAnswered: boolean,
	event: any,
	aiComments: any,
	demo_time: boolean,
	flagReasons: any[],
	canEditTags?: boolean,
	categoryEditor?: { maxTagsPerQuestion: number; categories: any[] } | null
) {
	const baseResponse = createBaseResponse(
		question,
		comments,
		commentCount,
		removedCommentCount,
		questionTags,
		session,
		userHasAnswered,
		event,
		aiComments,
		flagReasons,
		canEditTags,
		categoryEditor
	);

	if (demo_time) {
		return {
			...baseResponse,
			question: { ...question, subscriptions: question?.subscriptions_demo },
			comments: comments?.map(mapDemoComment),
			removedComments: removedComments?.map(mapDemoComment),
			links,
			links_count: linksCount
		};
	}

	return {
		...baseResponse,
		removedComments: removedComments?.map(mapDemoComment),
		links,
		links_count: linksCount
	};
}

function mapDemoComment(comment: any) {
	return {
		...comment,
		profiles: comment.profiles_demo,
		comment_like: comment.comment_like_demo
	};
}

async function getCategoryEditorData() {
	const { data, error: categoryError } = await supabase
		.from('question_categories')
		.select('id, category_name, slug, parent_id, level')
		.in('level', [1, 2, TAGGABLE_LEAF_LEVEL])
		.order('category_name', { ascending: true });

	if (categoryError) {
		console.error('Failed to load categories for editor', categoryError);
		return {
			maxTagsPerQuestion: MAX_CATEGORIES_PER_QUESTION,
			categories: []
		};
	}

	return {
		maxTagsPerQuestion: MAX_CATEGORIES_PER_QUESTION,
		categories: data ?? []
	};
}

async function getQuestionForMutation(db: any, slug: string, demoTime: boolean) {
	const questionTable = demoTime ? 'questions_demo' : 'questions';
	const idAsNumber = Number.parseInt(slug, 10);
	const query = db.from(questionTable).select('id, author_id, url');
	const { data, error: findQuestionError } = await (Number.isInteger(idAsNumber)
		? query.eq('id', idAsNumber).maybeSingle()
		: query.eq('url', slug).maybeSingle());

	if (findQuestionError) {
		console.error('Failed to resolve question for mutation', findQuestionError);
		return null;
	}

	return data;
}

async function validateLeafCategories(db: any, tagIds: number[]) {
	const { data: categories, error: categoryError } = await db
		.from('question_categories')
		.select('id, level')
		.in('id', tagIds);

	if (categoryError) {
		throw error(500, 'Failed to validate categories');
	}
	if (!categories || categories.length !== tagIds.length) {
		throw error(400, 'One or more selected categories are invalid');
	}

	const invalidLevels = categories.filter(
		(category: any) => category.level !== TAGGABLE_LEAF_LEVEL
	);
	if (invalidLevels.length) {
		throw error(400, 'Only leaf categories can be selected');
	}
}

async function createLeafCategoryWithRetry(db: any, parentId: number, categoryName: string) {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const { data: highestCategory, error: highestCategoryError } = await db
			.from('question_categories')
			.select('id')
			.order('id', { ascending: false })
			.limit(1)
			.maybeSingle();
		if (highestCategoryError) {
			throw error(500, 'Failed to generate category id');
		}

		const nextCategoryId = (highestCategory?.id ?? 0) + 1;
		const { data: insertedCategory, error: insertCategoryError } = await db
			.from('question_categories')
			.insert({
				id: nextCategoryId,
				category_name: categoryName,
				slug: buildQuestionCategorySlug(categoryName),
				parent_id: parentId,
				level: TAGGABLE_LEAF_LEVEL
			})
			.select('id, category_name, slug, parent_id, level')
			.maybeSingle();

		if (!insertCategoryError && insertedCategory) {
			return insertedCategory;
		}

		if (insertCategoryError?.code !== '23505') {
			throw error(500, 'Failed to create category');
		}
	}

	throw error(500, 'Failed to create category, please try again');
}

async function syncLegacyTagMappings(db: any, tagIds: number[]) {
	const uniqueTagIds = Array.from(new Set(tagIds));
	if (!uniqueTagIds.length) {
		return;
	}

	const { data: categories, error: categoriesError } = await db
		.from('question_categories')
		.select('id, category_name')
		.in('id', uniqueTagIds);
	if (categoriesError || !categories?.length) {
		throw error(500, 'Failed to resolve categories for legacy mapping');
	}

	const { error: legacyUpsertError } = await db.from('question_tag').upsert(
		categories.map((category: any) => ({
			tag_id: category.id,
			tag_name: category.category_name,
			subcategory_id: null
		})),
		{ onConflict: 'tag_id' }
	);
	if (legacyUpsertError) {
		throw error(500, 'Failed to sync legacy category metadata');
	}
}
