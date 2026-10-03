// src/routes/design-preview/homepage-live-take/+page.server.ts
// Design sandbox for the live-take homepage (now live on `/`). Posting here stays
// simulated: nothing is saved and no give-first events are recorded.
import type { PageServerLoad } from './$types';
import { getQuestionTakes } from '$lib/server/questionTakes';
import { getLiveQuestion } from '$lib/server/homepageLiveTake';
import { toLiveTakeAnswers, type LiveTake } from '$lib/data/homepageLiveTake';

async function isAdmin(locals: App.Locals): Promise<boolean> {
	const userId = locals.session?.user?.id;
	if (!userId) return false;
	const { data } = await locals.supabase.from('profiles').select('admin').eq('id', userId).single();
	return Boolean(data?.admin);
}

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	// Admin reviewers see real answers, so the response must never be shared from a cache.
	setHeaders({ 'cache-control': 'private, no-store' });

	const question = await getLiveQuestion(locals.supabase);
	if (!question) return { live: null };

	const canPreviewAnswers = await isAdmin(locals);
	// getQuestionTakes bypasses the give-first gate, so it only runs for admins.
	const answers = canPreviewAnswers
		? toLiveTakeAnswers((await getQuestionTakes(question.id, { limit: 12 })).data)
		: [];

	const live: LiveTake = {
		questionId: question.id,
		slug: question.url,
		title: question.title,
		responses: question.responses,
		signedIn: Boolean(locals.session?.user?.id),
		answered: false,
		ownTake: null,
		answers
	};
	return { live };
};
