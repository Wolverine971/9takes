// src/routes/admin/questions/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { guardAdminActions } from '$lib/server/adminAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import {
	MAX_PINNED_COMMENTS,
	normalizePinnedCommentIds
} from '$lib/components/questions/curatedReveal';
import { mapDemoValues } from '../../../utils/demo';
import type { Database } from '../../../../database.types';

// Helper functions to reduce repetition
type AdminProfile = Pick<
	Database['public']['Tables']['profiles']['Row'],
	'id' | 'admin' | 'external_id'
>;
type QuestionKeywordRow = Pick<
	Database['public']['Tables']['question_keywords']['Row'],
	'question_id' | 'keywords'
>;
type AdminTagOption = {
	tag_id: number;
	tag_name: string;
};

const QUESTION_PAGE_SIZE = 100;
const ANSWER_SNIPPET_LENGTH = 60;

type QuestionCurationRow = {
	id: number;
	starter_rank: number | null;
	pinned_comment_ids: number[];
};

/**
 * Best-effort read of the curation columns (starter_rank, pinned_comment_ids)
 * for the loaded page of questions. Isolated from the main select so the admin
 * page still loads if 20260906120100_question_starters_and_pins.sql has not
 * been applied yet.
 */
async function loadCurationByQuestionId(
	db: any,
	questionIds: number[]
): Promise<Map<number, QuestionCurationRow>> {
	const curationById = new Map<number, QuestionCurationRow>();
	if (!questionIds.length) return curationById;

	const { data, error: curationError } = await db
		.from('questions')
		.select('id, starter_rank, pinned_comment_ids')
		.in('id', questionIds);

	if (curationError) {
		console.warn('Question curation columns unavailable', curationError.message ?? curationError);
		return curationById;
	}

	for (const row of (data ?? []) as Array<{
		id: number;
		starter_rank: number | null;
		pinned_comment_ids: unknown;
	}>) {
		const rank = Number(row.starter_rank);
		curationById.set(row.id, {
			id: row.id,
			starter_rank: Number.isInteger(rank) && rank > 0 ? rank : null,
			pinned_comment_ids: normalizePinnedCommentIds(row.pinned_comment_ids)
		});
	}

	return curationById;
}

async function validateAdmin(
	session: App.Locals['session'],
	demoTime: boolean | null | undefined,
	supabase: App.Locals['supabase']
): Promise<AdminProfile> {
	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const db = supabase as any;
	const { data: user, error: findUserError } = (await db
		.from(demoTime ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session.user.id)
		.single()) as { data: AdminProfile | null; error: unknown };

	if (findUserError) {
		console.error('Error finding user:', findUserError);
		throw error(404, { message: 'Error searching for user' });
	}

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	return user;
}

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	try {
		const session = event.locals.session;
		const supabase = event.locals.supabase;
		const { demo_time } = await event.parent();
		const isDemo = demo_time === true;
		const db = supabase as any;
		const requestedPage = Number.parseInt(event.url.searchParams.get('page') ?? '1', 10);
		const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
		const offset = (page - 1) * QUESTION_PAGE_SIZE;

		// Validate user is an admin
		const user = await validateAdmin(session, isDemo, supabase);

		// Get questions with related data
		const {
			data: questions,
			error: questionsError,
			count: questionCount
		} = await db
			.from(isDemo ? 'questions_demo' : 'questions')
			.select(
				`id, author_id, comment_count, context, created_at, data, es_id, flagged, img_url, last_comment_date, name, question, question_formatted, removed, tagged, updated_at, url, question_tag(*), ${isDemo ? 'profiles_demo' : 'profiles'} ( external_id, email, enneagram )`,
				{ count: 'exact' }
			)
			.order('created_at', { ascending: false })
			.range(offset, offset + QUESTION_PAGE_SIZE - 1);

		if (questionsError) {
			console.error('Error fetching questions:', questionsError);
			throw error(500, { message: 'Failed to load questions' });
		}

		// Load the current leaf-category taxonomy so manual admin edits match AI tagging.
		const { data: questionCategories, error: tagsError } = await supabase
			.from('question_categories')
			.select('id, category_name')
			.eq('level', 3)
			.order('category_name', { ascending: true });

		if (tagsError) {
			console.error('Error fetching tags:', tagsError);
		}

		const tags: AdminTagOption[] =
			questionCategories
				?.filter(
					(category): category is { id: number; category_name: string } =>
						Number.isFinite(category.id) && typeof category.category_name === 'string'
				)
				.map((category) => ({
					tag_id: category.id,
					tag_name: category.category_name
				})) ?? [];

		const questionIds = ((questions ?? []) as Array<{ id: number }>).map((question) => question.id);
		const { data: questionKeywords, error: questionKeywordsError } = questionIds.length
			? await supabase
					.from(`question_keywords`)
					.select('question_id, keywords')
					.in('question_id', questionIds)
			: { data: [], error: null };

		if (questionKeywordsError) {
			console.error('Error fetching keywords:', questionKeywordsError);
		}

		// Map keywords to questions
		const questionKeywordsMap = (questionKeywords ?? []).reduce(
			(map: Record<number, QuestionKeywordRow>, content) => {
				if (content.question_id !== null) {
					map[content.question_id] = content;
				}
				return map;
			},
			{}
		);

		const curationById = isDemo
			? new Map<number, QuestionCurationRow>()
			: await loadCurationByQuestionId(db, questionIds);

		const questionsWithKeywords = (questions ?? []).map((question: any) => {
			const keywordRow = questionKeywordsMap[question.id];
			const curation = curationById.get(question.id);
			const decorated = {
				...question,
				starter_rank: curation?.starter_rank ?? null,
				pinned_comment_ids: curation?.pinned_comment_ids ?? []
			};
			if (keywordRow) {
				return {
					...decorated,
					keywords: (keywordRow.keywords ?? '').split(',').filter(Boolean)
				};
			}
			return decorated;
		});

		return {
			user: mapDemoValues(user),
			questions: mapDemoValues(questionsWithKeywords),
			demoTime: isDemo,
			tags,
			pagination: {
				page,
				limit: QUESTION_PAGE_SIZE,
				total: questionCount ?? 0,
				totalPages: Math.max(1, Math.ceil((questionCount ?? 0) / QUESTION_PAGE_SIZE))
			}
		};
	} catch (err) {
		// Pass through redirects and errors
		if (err && typeof err === 'object' && 'status' in err) throw err;

		console.error('Unexpected error in load function:', err);
		throw error(500, { message: 'An unexpected error occurred' });
	}
};

// =============================================================================
// Curation actions ("Start here" rank + pinned reveal trio)
// Guarded by guardAdminActions (requireAdmin runs before any handler).
// =============================================================================
const questionIdSchema = z
	.string()
	.regex(/^\d+$/, 'Invalid question id')
	.transform((value) => Number.parseInt(value, 10));

const curateSchema = z.object({
	questionId: questionIdSchema,
	starterRank: z
		.string()
		.trim()
		.transform((value) => (value === '' ? null : Number.parseInt(value, 10)))
		.refine(
			(value) => value === null || (Number.isInteger(value) && value >= 1 && value <= 999),
			'Starter rank must be blank or a whole number from 1 to 999'
		),
	pinnedCommentIds: z.string().transform((value) =>
		normalizePinnedCommentIds(
			value
				.split(/[,\s]+/)
				.map((part) => part.trim())
				.filter(Boolean)
		)
	)
});

const listAnswersSchema = z.object({ questionId: questionIdSchema });

export const actions: Actions = guardAdminActions({
	/** Save starter_rank + pinned_comment_ids through the service-role RPC. */
	curate: async ({ request }) => {
		const parsed = curateSchema.safeParse(Object.fromEntries(await request.formData()));
		if (!parsed.success) {
			return fail(400, {
				curation: { error: parsed.error.errors[0]?.message ?? 'Invalid curation payload' }
			});
		}

		const { questionId, starterRank, pinnedCommentIds } = parsed.data;
		const { data, error: rpcError } = await (getSupabaseAdminClient().rpc as any)(
			'set_question_curation',
			{
				p_question_id: questionId,
				p_starter_rank: starterRank,
				p_pinned_comment_ids: pinnedCommentIds.slice(0, MAX_PINNED_COMMENTS)
			}
		);

		if (rpcError) {
			console.error('set_question_curation failed', rpcError);
			return fail(500, {
				curation: { error: rpcError.message ?? 'Could not save curation' }
			});
		}

		const saved = (data ?? {}) as { starter_rank?: number | null; pinned_comment_ids?: unknown };
		const savedPinned = normalizePinnedCommentIds(saved.pinned_comment_ids);
		const dropped = pinnedCommentIds.filter((id) => !savedPinned.includes(id));

		return {
			curation: {
				questionId,
				starterRank: saved.starter_rank ?? null,
				pinnedCommentIds: savedPinned,
				droppedCommentIds: dropped
			}
		};
	},

	/** Top-level, non-removed answers on a question with a short snippet, for picking pins. */
	listAnswers: async ({ request }) => {
		const parsed = listAnswersSchema.safeParse(Object.fromEntries(await request.formData()));
		if (!parsed.success) {
			return fail(400, { answers: { error: 'Invalid question id' } });
		}

		const { data, error: answersError } = await getSupabaseAdminClient()
			.from('comments')
			.select('id, comment, author_id, created_at, like_count, comment_count')
			.eq('parent_type', 'question')
			.eq('parent_id', parsed.data.questionId)
			.eq('removed', false)
			.order('created_at', { ascending: false })
			.limit(200);

		if (answersError) {
			console.error('Could not list answers for curation', answersError);
			return fail(500, { answers: { error: 'Could not load answers' } });
		}

		return {
			answers: {
				questionId: parsed.data.questionId,
				items: (data ?? []).map((row) => {
					const text = String(row.comment ?? '')
						.replace(/\s+/g, ' ')
						.trim();
					return {
						id: row.id,
						snippet:
							text.length > ANSWER_SNIPPET_LENGTH
								? `${text.slice(0, ANSWER_SNIPPET_LENGTH - 1).trimEnd()}…`
								: text,
						anonymous: !row.author_id,
						created_at: row.created_at,
						like_count: row.like_count ?? 0,
						reply_count: row.comment_count ?? 0
					};
				})
			}
		};
	}
});
