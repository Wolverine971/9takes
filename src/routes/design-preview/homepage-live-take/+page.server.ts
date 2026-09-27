// src/routes/design-preview/homepage-live-take/+page.server.ts
import type { PageServerLoad } from './$types';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { getQuestionTakes } from '$lib/server/questionTakes';
import { LIVE_TAKE_SLUG, toLiveTakeAnswers, type LiveTake } from '$lib/data/homepageLiveTake';

async function isAdmin(locals: App.Locals): Promise<boolean> {
	const userId = locals.session?.user?.id;
	if (!userId) return false;
	const { data } = await locals.supabase.from('profiles').select('admin').eq('id', userId).single();
	return Boolean(data?.admin);
}

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	// Admin reviewers see real answers, so the response must never be shared from a cache.
	setHeaders({ 'cache-control': 'private, no-store' });

	const { data: question } = await getSupabaseAdminClient()
		.from('questions')
		.select('id, question, question_formatted, url, comment_count')
		.eq('url', LIVE_TAKE_SLUG)
		.not('removed', 'is', true)
		.not('flagged', 'is', true)
		.maybeSingle();

	const title = question?.question_formatted?.trim() || question?.question?.trim();
	if (!question?.url || !title) return { live: null };

	const canPreviewAnswers = await isAdmin(locals);
	// getQuestionTakes bypasses the give-first gate, so it only runs for admins.
	const answers = canPreviewAnswers
		? toLiveTakeAnswers((await getQuestionTakes(question.id, { limit: 12 })).data)
		: [];

	const live: LiveTake = {
		slug: question.url,
		title,
		responses: question.comment_count ?? 0,
		answers
	};
	return { live };
};
