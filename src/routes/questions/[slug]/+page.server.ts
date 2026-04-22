// src/routes/questions/[slug]/+page.server.ts
import { supabase } from '$lib/supabase';

import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { safelyExitWelcomeSequenceForCommentCreation } from '$lib/server/welcomeSequenceGuards';
import { checkDemoTime } from '../../../utils/api';
import { mapDemoValues } from '../../../utils/demo';
import { extractFirstURL } from '../../../utils/StringUtils';
import { createCommentSchema, flagCommentSchema } from '$lib/validation/questionSchemas';
import { uploadQuestionImage } from '$lib/server/questionImages';
import { buildQuestionCategorySlug } from '$lib/utils/questionCategorySlug';
import { z } from 'zod';

import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';

// =============================================================================
// Constants
// =============================================================================
// Rate limit configuration: 5 comments per minute
const RATE_LIMIT_MAX_COMMENTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60;

// Pagination defaults
const DEFAULT_COMMENTS_LIMIT = 10;
const DEFAULT_LINKS_LIMIT = 10;

// Request timeout for external fetches (ms)
const EXTERNAL_FETCH_TIMEOUT = 5000;
const MAX_CONTENT_LENGTH = 1024 * 1024; // 1MB
const MAX_REDIRECTS = 3;
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const TAGGABLE_LEAF_LEVEL = 3;
const MAX_CATEGORIES_PER_QUESTION = 3;
const NEW_CATEGORY_MIN_LENGTH = 2;
const NEW_CATEGORY_MAX_LENGTH = 60;

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
	const { demo_time } = await event.parent();
	const isDemoTime = demo_time === true;
	const session = event.locals.session;
	const cookie = event.cookies.get('9tfingerprint');

	const question = await getQuestion(event.params.slug, isDemoTime);
	if (!question) {
		throw error(400, { message: 'No question found' });
	}

	const [userHasAnswered, questionTags] = await Promise.all([
		checkUserAnswered(cookie, question.id, session?.user?.id),
		getQuestionTags(question.id)
	]);
	const canEditTags =
		!isDemoTime && Boolean(session?.user?.id && question.author_id === session?.user?.id);
	const categoryEditor = canEditTags ? await getCategoryEditorData() : null;

	if (!userHasAnswered) {
		const commentCount = await getCommentCount(question.id, isDemoTime);
		const aiComments = isDemoTime ? null : await getAIComments(question.id);
		return createBaseResponse(
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
		);
	}

	const [comments, removedComments, links, aiComments, flagReasons] = await Promise.all([
		getComments(question.id, isDemoTime, false),
		getComments(question.id, isDemoTime, true),
		getQuestionLinks(question.id),
		isDemoTime ? null : getAIComments(question.id),
		getFlagReasons()
	]);

	return createFullResponse(
		question,
		comments.data ?? [],
		comments.count ?? 0,
		removedComments.data ?? [],
		removedComments.count ?? 0,
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
	);
};

export const actions: Actions = {
	createComment: async ({ request, getClientAddress }) => {
		const { body, demo_time } = await getRequestData(request);
		const ip = getClientAddress();

		// Validate input
		const validationResult = createCommentSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.errors[0]?.message || 'Invalid comment data';
			throw error(400, { message: firstError });
		}

		// Check rate limit (skip in demo mode)
		if (!demo_time) {
			const isAllowed = await checkRateLimit(body.fingerprint as string, ip);
			if (!isAllowed) {
				throw error(429, {
					message: 'Too many comments. Please wait a minute before trying again.'
				});
			}
		}

		const commentData = await createCommentData(body, ip, demo_time);
		const record = await handleCommentCreation(commentData, body.parent_type as string, demo_time);

		if (!demo_time && commentData.author_id) {
			await safelyExitWelcomeSequenceForCommentCreation({
				userId: commentData.author_id,
				parentType: commentData.parent_type,
				onError: (sequenceError) => {
					console.error('Failed to exit welcome sequence after comment creation:', sequenceError);
				}
			});
		}

		return record;
	},

	createCommentRando: async ({ request, getClientAddress }) => {
		const { body, demo_time } = await getRequestData(request);
		const ip = getClientAddress();

		// Validate input
		const validationResult = createCommentSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.errors[0]?.message || 'Invalid comment data';
			throw error(400, { message: firstError });
		}

		// Check rate limit (skip in demo mode)
		if (!demo_time) {
			const isAllowed = await checkRateLimit(body.fingerprint as string, ip);
			if (!isAllowed) {
				throw error(429, {
					message: 'Too many comments. Please wait a minute before trying again.'
				});
			}
		}

		const commentData = await createCommentData(body, ip, demo_time);
		const record = await handleCommentCreation(commentData, body.parent_type as string, demo_time);
		return mapDemoValues(record as Record<string, unknown> | null);
	},

	likeComment: async ({ request, locals }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const { body, demo_time } = await getRequestData(request);
		const { parent_id, user_id, operation } = body;

		if (operation === 'add') {
			return await addLike(parent_id as string, user_id as string);
		} else {
			return await removeLike(parent_id as string, user_id as string, demo_time);
		}
	},

	subscribe: async ({ request, locals }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const { body, demo_time } = await getRequestData(request);
		const { parent_id, user_id, operation } = body;

		if (operation === 'add') {
			return await addSubscription(parent_id as string, user_id as string, demo_time);
		} else {
			return await removeSubscription(parent_id as string, user_id as string, demo_time);
		}
	},

	sortComments: async ({ request, locals, cookies }) => {
		const { body, demo_time } = await getRequestData(request);

		const questionId = Number(body.questionId);
		if (!Number.isFinite(questionId)) {
			throw error(400, { message: 'Invalid questionId' });
		}

		const cookie = cookies.get('9tfingerprint');
		const userHasAnswered = await checkUserAnswered(cookie, questionId, locals.session?.user?.id);
		if (!userHasAnswered) {
			throw error(403, { message: 'You must answer the question before sorting comments.' });
		}

		const sortByRaw = (body.sortBy as string) || 'newest';
		const sortBy: 'newest' | 'oldest' | 'likes' =
			sortByRaw === 'oldest' || sortByRaw === 'likes' ? sortByRaw : 'newest';

		const enneagramTypesRaw = (body.enneagramTypes as string) || '';
		const selectedTypes = parseEnneagramTypes(enneagramTypesRaw);

		const comments = await getSortableComments(questionId, demo_time);
		const filtered = filterCommentsByEnneagram(comments, selectedTypes);
		const sorted = sortCommentsBy(filtered, sortBy);

		return sorted;
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
		await flagComment(session.user.id, comment_id, reason_id, description || '');

		return { success: true };
	},

	updateQuestionImg: async ({ request }) => {
		const { img_url, url } = Object.fromEntries(await request.formData());
		const upload = await uploadQuestionImage({
			supabase,
			dataUrl: img_url as string,
			questionUrl: url as string,
			maxBytes: MAX_IMAGE_SIZE_BYTES
		});
		await updateQuestionImageUrl(url as string, upload.path);
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

/**
 * Check if the user has exceeded the rate limit for comments
 * Returns true if allowed to comment, false if rate limited
 */
async function checkRateLimit(fingerprint: string | undefined, ip: string): Promise<boolean> {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { data, error: rpcError } = await (supabase.rpc as any)('check_comment_rate_limit', {
			p_fingerprint: fingerprint || null,
			p_ip: ip,
			p_max_comments: RATE_LIMIT_MAX_COMMENTS,
			p_window_seconds: RATE_LIMIT_WINDOW_SECONDS
		});

		if (rpcError) {
			// Log error but allow the comment (fail open for availability)
			console.error('Rate limit check failed:', rpcError);
			return true;
		}

		return data === true;
	} catch (err) {
		// Fail open - if rate limiting is broken, still allow comments
		console.error('Rate limit check error:', err);
		return true;
	}
}

interface CommentData {
	comment: string;
	parent_id: number;
	author_id: string | null;
	comment_count: number;
	ip: string;
	parent_type: string;
	fingerprint: string | null;
}

async function createCommentData(
	body: Record<string, FormDataEntryValue>,
	ip: string,
	demo_time: boolean
): Promise<CommentData> {
	const question_id = body.question_id as string;
	const comment = body.comment as string;
	const parent_id = body.parent_id as string;
	const author_id = body.author_id as string;
	const parent_type = body.parent_type as string;
	const fingerprint = body.fingerprint as string;

	// Parse URLs in background - don't block comment creation on external HTTP fetch
	parseUrls(comment, question_id).catch((err) => {
		console.error('Background URL parsing failed:', err);
	});

	return {
		comment,
		parent_id: parseInt(parent_id),
		author_id: author_id !== 'undefined' ? author_id.toString() : null,
		comment_count: 0,
		ip,
		parent_type,
		fingerprint: fingerprint || null
	};
}

async function handleCommentCreation(
	commentData: CommentData,
	parent_type: string,
	demo_time: boolean
): Promise<unknown> {
	// For demo mode, use regular insert (demo tables don't have the atomic RPC)
	if (demo_time) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { data: record, error: addCommentError } = await (supabase.from('comments_demo') as any)
			.insert(commentData)
			.select()
			.single();

		if (addCommentError) {
			console.error(addCommentError);
			throw error(500, { message: 'Failed to add comment' });
		}

		return record;
	}

	// For production, use atomic RPC that handles insert + count increment in one transaction
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data: record, error: rpcError } = await (supabase.rpc as any)('create_comment_atomic', {
		p_comment: commentData.comment,
		p_parent_id: commentData.parent_id,
		p_author_id: commentData.author_id || null,
		p_parent_type: parent_type,
		p_fingerprint: commentData.fingerprint || null,
		p_ip: commentData.ip
	});

	if (rpcError) {
		console.error('Atomic comment creation failed:', rpcError);
		throw error(500, { message: 'Failed to add comment' });
	}

	return record;
}

async function addLike(parent_id: string, user_id: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data: record, error: addLikeError } = await (supabase.from('comment_like') as any)
		.insert({ comment_id: parseInt(parent_id), user_id })
		.select()
		.single();

	if (addLikeError) {
		console.error(addLikeError);
		throw error(500, { message: 'Failed to add like' });
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await (supabase.rpc as any)('increment_like_count', { comment_id: parent_id });
	return record;
}

async function removeLike(parent_id: string, user_id: string, demo_time: boolean) {
	const { error: removeLikeError } = await supabase
		.from(demo_time ? 'comment_like_demo' : 'comment_like')
		.delete()
		.eq('user_id', user_id)
		.eq('comment_id', parent_id);

	if (removeLikeError) {
		console.error(removeLikeError);
		throw error(500, { message: 'Failed to remove like' });
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await (supabase.rpc as any)('decrement_like_count', { comment_id: parent_id });
	return null;
}

async function addSubscription(parent_id: string, user_id: string, demo_time: boolean) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data: subscriptionRecord, error: addSubscriptionError } = await (
		supabase.from(demo_time ? 'subscriptions_demo' : 'subscriptions') as any
	)
		.insert({ question_id: parseInt(parent_id), user_id })
		.select()
		.single();

	if (addSubscriptionError) {
		console.error(addSubscriptionError);
		throw error(500, { message: 'Failed to add subscription' });
	}

	return subscriptionRecord;
}

async function removeSubscription(parent_id: string, user_id: string, demo_time: boolean) {
	const { error: removeSubscriptionError } = await supabase
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { error: incrementError } = await (supabase.rpc as any)('increment_clicks', {
		link_id: parseInt(linkId)
	});

	if (incrementError) {
		console.error('Failed to increment link clicks:', incrementError);
		// Don't throw - link click tracking is non-critical
	}
}

async function flagComment(
	userId: string,
	commentId: string,
	reasonId: string,
	description: string
) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { error: flagCommentError } = await (supabase.from('flagged_comments') as any).insert({
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

async function updateQuestionImageUrl(url: string, imgPath: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { error: updateError } = await (supabase.from('questions') as any)
		.update({ img_url: imgPath })
		.eq('url', url);

	if (updateError) {
		console.error('Error updating question image URL:', updateError);
	}
}

interface OGData {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
}

async function fetchOGData(url: string): Promise<OGData> {
	try {
		// Validate URL to prevent SSRF attacks
		const parsedUrl = new URL(url);

		// Block internal IPs and localhost
		const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254'];
		const hostname = parsedUrl.hostname.toLowerCase();

		if (blockedHosts.includes(hostname)) {
			console.warn('Blocked request to internal host:', hostname);
			return {};
		}

		// Block private IP ranges (basic check)
		if (
			hostname.startsWith('10.') ||
			hostname.startsWith('192.168.') ||
			hostname.startsWith('172.')
		) {
			console.warn('Blocked request to private IP range:', hostname);
			return {};
		}

		// Only allow HTTP/HTTPS
		if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
			console.warn('Blocked non-HTTP(S) protocol:', parsedUrl.protocol);
			return {};
		}

		const response = await axios.get(url, {
			timeout: EXTERNAL_FETCH_TIMEOUT,
			maxContentLength: MAX_CONTENT_LENGTH,
			maxRedirects: MAX_REDIRECTS,
			headers: {
				'User-Agent': '9takes-bot/1.0'
			}
		});
		const $ = cheerioLoad(response.data);

		const ogData: OGData = {};
		$('meta[property^="og:"]').each((_, element) => {
			const property = $(element).attr('property')?.slice(3);
			const content = $(element).attr('content');
			if (property && content) {
				ogData[property as keyof OGData] = content;
			}
		});

		return ogData;
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error(`Error fetching OG data: ${message}`);
		return {};
	}
}

async function parseUrls(comment: string, questionId: string): Promise<void> {
	const { url, domain } = extractFirstURL(comment);
	if (!domain || !url) return;

	try {
		const ogData = await fetchOGData(url);
		const domainId = await upsertDomain(domain);
		await upsertLink(url, domainId, questionId, ogData);
	} catch (err) {
		console.error('Error parsing URLs:', err);
		// Consider how you want to handle errors here
	}
}

async function upsertDomain(domain: string): Promise<number> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data, error: upsertError } = await (supabase.from('link_domains') as any)
		.upsert({ domain, updated_at: new Date().toISOString() })
		.select('id')
		.single();

	if (upsertError) throw new Error(`Failed to upsert domain: ${upsertError.message}`);
	if (!data) throw new Error('No data returned from domain upsert');

	return data.id;
}

async function upsertLink(
	url: string,
	domainId: number,
	questionId: string,
	ogData: OGData
): Promise<void> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { error: upsertError } = await (supabase.from('links') as any).upsert({
		url,
		domain_id: domainId,
		updated_at: new Date().toISOString(),
		question_id: questionId,
		meta_title: ogData.title,
		meta_description: ogData.description,
		meta_image: ogData.image
	});

	if (upsertError) throw new Error(`Failed to upsert link: ${upsertError.message}`);
}

async function getQuestion(slug: string, demo_time: boolean) {
	const table = demo_time ? 'questions_demo' : 'questions';
	const subscriptions = demo_time ? 'subscriptions_demo' : 'subscriptions';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const query = (supabase.from(table) as any).select(
		`*, ${subscriptions} (id, question_id, user_id)`
	);

	const { data, error: findQuestionError } = await (Number.isInteger(parseInt(slug))
		? query.eq('id', slug).single()
		: query.eq('url', slug).single());

	if (!data || findQuestionError) {
		return null;
	}
	return data;
}

async function checkUserAnswered(
	cookie: string | undefined,
	questionId: number,
	userId: string | undefined
) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data } = await (supabase.rpc as any)('can_see_comments_3', {
		userfingerprint: cookie,
		questionid: questionId,
		userid: userId || null
	});
	return data;
}

async function getQuestionTags(questionId: number) {
	const { data, error } = await supabase
		.from('question_category_tags')
		.select(`*, question_categories(*)`, { count: 'exact' })
		.eq('question_id', questionId);

	if (error) {
		console.log('No question tags for question', error);
	}
	return data;
}

async function getCommentCount(questionId: number, demo_time: boolean) {
	const { count } = await supabase
		.from(demo_time ? 'comments_demo' : 'comments')
		.select('*', { count: 'exact' })
		.eq('parent_type', 'question')
		.eq('parent_id', questionId)
		.eq('removed', false);
	return count;
}

async function getComments(questionId: number, demo_time: boolean, removed: boolean) {
	const table = demo_time ? 'comments_demo' : 'comments';
	const profiles = demo_time ? 'profiles_demo' : 'profiles';
	const commentLike = demo_time ? 'comment_like_demo' : 'comment_like';

	const { data, count, error } = await supabase
		.from(table)
		.select(`*, ${profiles} (external_id, enneagram), ${commentLike} (id, comment_id, user_id)`, {
			count: 'exact'
		})
		.eq('parent_id', questionId)
		.eq('parent_type', 'question')
		.eq('removed', removed)
		.limit(DEFAULT_COMMENTS_LIMIT)
		.order('created_at', { ascending: false });

	if (error) {
		console.log(`No ${removed ? 'removed ' : ''}comments for question`, error);
	}
	return { data, count };
}

const DEFAULT_ENNEAGRAM_TYPES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'unknown', 'rando'];

function parseEnneagramTypes(raw: string): string[] {
	const normalized = raw
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean);

	if (!normalized.length) {
		return [...DEFAULT_ENNEAGRAM_TYPES];
	}

	const allowed = new Set(DEFAULT_ENNEAGRAM_TYPES);
	const filtered = normalized.filter((value) => allowed.has(value));
	return filtered.length ? filtered : [...DEFAULT_ENNEAGRAM_TYPES];
}

async function getSortableComments(questionId: number, demo_time: boolean) {
	const table = demo_time ? 'comments_demo' : 'comments';
	const profiles = demo_time ? 'profiles_demo' : 'profiles';
	const commentLike = demo_time ? 'comment_like_demo' : 'comment_like';

	const { data, error: commentsError } = await supabase
		.from(table)
		.select(`*, ${profiles} (external_id, enneagram), ${commentLike} (id, comment_id, user_id)`)
		.eq('parent_id', questionId)
		.eq('parent_type', 'question')
		.eq('removed', false);

	if (commentsError) {
		console.error('Failed to fetch comments for sorting', commentsError);
		throw error(500, { message: 'Failed to load comments for sorting' });
	}

	const comments = data ?? [];
	return demo_time ? comments.map(mapDemoComment) : comments;
}

function getCommentTypeKey(comment: any): string {
	if (!comment?.author_id) {
		return 'rando';
	}

	const enneagram = comment?.profiles?.enneagram?.toString();
	if (!enneagram) {
		return 'unknown';
	}

	return enneagram;
}

function filterCommentsByEnneagram(comments: any[], selectedTypes: string[]) {
	if (!selectedTypes.length) {
		return comments;
	}

	const selected = new Set(selectedTypes);
	return comments.filter((comment) => selected.has(getCommentTypeKey(comment)));
}

function sortCommentsBy(comments: any[], sortBy: 'newest' | 'oldest' | 'likes') {
	const getTime = (comment: any) =>
		comment?.created_at ? new Date(comment.created_at).getTime() : 0;
	const getLikes = (comment: any) => comment?.like_count ?? 0;

	const sorted = [...comments];

	if (sortBy === 'oldest') {
		sorted.sort((a, b) => getTime(a) - getTime(b));
		return sorted;
	}

	if (sortBy === 'likes') {
		sorted.sort((a, b) => {
			const likeDiff = getLikes(b) - getLikes(a);
			return likeDiff !== 0 ? likeDiff : getTime(b) - getTime(a);
		});
		return sorted;
	}

	sorted.sort((a, b) => getTime(b) - getTime(a));
	return sorted;
}

async function getQuestionLinks(questionId: number) {
	const { data, count, error } = await supabase
		.from('links')
		.select(`*`, { count: 'exact' })
		.eq('question_id', questionId)
		.limit(DEFAULT_LINKS_LIMIT);

	if (error) {
		console.log('No links for question', error);
	}
	return { data, count };
}

async function getFlagReasons() {
	const { data, error } = await supabase.from('flag_reasons').select(`*`);
	if (error) {
		console.log('No links for question', error);
	}
	return { data };
}

async function getAIComments(questionId: number) {
	const { data, error } = await supabase
		.from('comments_ai')
		.select('*')
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
	const query = db.from(questionTable).select('id, author_id');
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
