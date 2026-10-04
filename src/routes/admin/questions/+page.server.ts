// src/routes/admin/questions/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { guardAdminActions } from '$lib/server/adminAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { loadRouteDemoTime } from '$lib/server/demoTime';
import {
	MAX_PINNED_COMMENTS,
	normalizePinnedCommentIds
} from '$lib/components/questions/curatedReveal';
import { mapDemoValues } from '../../../utils/demo';
import { getQuestionTakes, isCommentRankingEnabled } from '$lib/server/questionTakes';
import { rankTakes, takeRankingMetrics } from '$lib/components/questions/commentRanking';
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

// Columns shared by the live and demo question tables.
const QUESTION_COLUMNS =
	'id, author_id, comment_count, context, created_at, data, es_id, flagged, img_url, last_comment_date, name, question, question_formatted, removed, tagged, updated_at, url, question_tag(*)';

/** Coerce a `starter_rank` column value into a positive rank or null. */
function normalizeStarterRank(raw: unknown): number | null {
	const rank = Number(raw);
	return Number.isInteger(rank) && rank > 0 ? rank : null;
}

/** Return a settled value, or rethrow its rejection (redirects and errors pass through). */
function unwrapSettled<T>(result: PromiseSettledResult<T>): T {
	if (result.status === 'rejected') throw result.reason;
	return result.value;
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
		// Same cached switch the admin layout reads; resolving it here lets the
		// guard and every query below start together instead of after the layout.
		const isDemo = (await loadRouteDemoTime(supabase)) === true;
		const db = supabase as any;
		const requestedPage = Number.parseInt(event.url.searchParams.get('page') ?? '1', 10);
		const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
		const offset = (page - 1) * QUESTION_PAGE_SIZE;

		// Live questions carry the curation columns and an FK to question_keywords,
		// so both ride along in the main select. Demo rows have neither.
		const questionColumns = isDemo
			? `${QUESTION_COLUMNS}, profiles_demo ( external_id, email, enneagram )`
			: `${QUESTION_COLUMNS}, profiles ( external_id, email, enneagram ), starter_rank, pinned_comment_ids, question_keywords ( question_id, keywords )`;

		// The layout guard (parent) and the admin check run alongside the queries.
		// Results unwrap in the old sequential order, so a non-admin still gets the
		// same redirect and the fetched rows are discarded.
		const [parentResult, adminResult, questionsResult, categoriesResult] = await Promise.allSettled(
			[
				event.parent(),
				validateAdmin(session, isDemo, supabase),
				db
					.from(isDemo ? 'questions_demo' : 'questions')
					.select(questionColumns, { count: 'exact' })
					.order('created_at', { ascending: false })
					.range(offset, offset + QUESTION_PAGE_SIZE - 1),
				// Load the current leaf-category taxonomy so manual admin edits match AI tagging.
				supabase
					.from('question_categories')
					.select('id, category_name')
					.eq('level', 3)
					.order('category_name', { ascending: true })
			]
		);
		unwrapSettled(parentResult);
		const user = unwrapSettled(adminResult);

		// Get questions with related data
		const {
			data: questions,
			error: questionsError,
			count: questionCount
		} = unwrapSettled(questionsResult);

		if (questionsError) {
			console.error('Error fetching questions:', questionsError);
			throw error(500, { message: 'Failed to load questions' });
		}

		const { data: questionCategories, error: tagsError } = unwrapSettled(categoriesResult);

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

		let questionKeywords: QuestionKeywordRow[] = [];
		if (isDemo) {
			const questionIds = ((questions ?? []) as Array<{ id: number }>).map(
				(question) => question.id
			);
			const { data, error: questionKeywordsError } = questionIds.length
				? await supabase
						.from(`question_keywords`)
						.select('question_id, keywords')
						.in('question_id', questionIds)
				: { data: [], error: null };

			if (questionKeywordsError) {
				console.error('Error fetching keywords:', questionKeywordsError);
			}
			questionKeywords = data ?? [];
		} else {
			questionKeywords = (
				(questions ?? []) as Array<{ question_keywords?: QuestionKeywordRow[] }>
			).flatMap((question) => question.question_keywords ?? []);
		}

		// Map keywords to questions
		const questionKeywordsMap = questionKeywords.reduce(
			(map: Record<number, QuestionKeywordRow>, content) => {
				if (content.question_id !== null) {
					map[content.question_id] = content;
				}
				return map;
			},
			{}
		);

		const questionsWithKeywords = (questions ?? []).map((row: any) => {
			// The embedded keyword rows are folded into `keywords` below, not returned.
			const { question_keywords, ...question } = row;
			const keywordRow = questionKeywordsMap[question.id];
			const decorated = {
				...question,
				starter_rank: normalizeStarterRank(question.starter_rank),
				pinned_comment_ids: normalizePinnedCommentIds(question.pinned_comment_ids)
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
	resetViews: async ({ request, locals }) => {
		const parsed = listAnswersSchema.safeParse(Object.fromEntries(await request.formData()));
		if (!parsed.success) return fail(400, { resetViews: { error: 'Invalid question id' } });
		const { data, error: resetError } = await (getSupabaseAdminClient().rpc as any)(
			'reset_question_comment_views',
			{
				p_question_id: parsed.data.questionId,
				p_actor_id: locals.session?.user?.id
			}
		);
		if (resetError) return fail(500, { resetViews: { error: 'Could not reset views' } });
		return { resetViews: { questionId: parsed.data.questionId, count: data } };
	},
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

		let rows;
		let pinnedIds: number[];
		let totalCount: number;
		try {
			const [page, curation] = await Promise.all([
				getQuestionTakes(parsed.data.questionId),
				(getSupabaseAdminClient() as any)
					.from('questions')
					.select('pinned_comment_ids')
					.eq('id', parsed.data.questionId)
					.single()
			]);
			if (curation.error) throw curation.error;
			rows = page.data;
			totalCount = page.count;
			pinnedIds = normalizePinnedCommentIds(curation.data?.pinned_comment_ids);
			const ranked = rankTakes(rows, { boostedIds: pinnedIds, totalCount });
			// Match the public cap: rank the newest 100, then append overflow by date.
			while (rows.length < totalCount) {
				const last = rows.at(-1);
				if (!last) break;
				const next = await getQuestionTakes(parsed.data.questionId, {
					before: last.created_at,
					beforeId: last.id
				});
				if (!next.data.length) break;
				rows = [...rows, ...next.data];
				ranked.push(...next.data);
			}
			rows = ranked;
		} catch (answersError) {
			console.error('Could not list answers for boosts', answersError);
			return fail(500, { answers: { error: 'Could not load answers' } });
		}

		return {
			answers: {
				questionId: parsed.data.questionId,
				rankingEnabled: isCommentRankingEnabled(),
				items: rows.map((row, index) => {
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
						reply_count: row.comment_count ?? 0,
						view_count: row.view_count ?? 0,
						rank: index + 1,
						...takeRankingMetrics(row, { boostedIds: pinnedIds, totalCount })
					};
				})
			}
		};
	}
});
