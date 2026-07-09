// src/routes/admin/questions/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
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

		const questionsWithKeywords = (questions ?? []).map((question: any) => {
			const keywordRow = questionKeywordsMap[question.id];
			if (keywordRow) {
				return {
					...question,
					keywords: (keywordRow.keywords ?? '').split(',').filter(Boolean)
				};
			}
			return question;
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
