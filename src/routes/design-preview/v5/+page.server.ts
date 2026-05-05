// src/routes/design-preview/v5/+page.server.ts
// Mirrors the production homepage's question-of-the-day rotation so V5 can
// wire §06 (THE FLOOR IS OPEN) to real data — not stub copy.
//
// Why mirror instead of share: V5 is still a prototype route. Keeping the
// load fn here means the prototype can evolve independently without nudging
// the production homepage's load contract.
import type { PageServerLoad } from './$types';

interface TopQuestion {
	url: string | null;
	question_formatted: string | null;
	comment_count: number | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const { data: topQuestions, error: topQuestionsError } = await locals.supabase
		.from('questions')
		.select('url,question_formatted,comment_count')
		.order('comment_count', { ascending: false })
		.eq('removed', false)
		.neq('id', 168)
		.limit(9);

	if (topQuestionsError) {
		console.error('[v5] Error fetching questions:', topQuestionsError);
	}

	const today = new Date();
	const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
	const typed = (topQuestions ?? []) as TopQuestion[];
	const idx = typed.length > 0 ? daysSinceEpoch % typed.length : 0;
	const questionOfTheDay = typed.length > 0 ? typed[idx] : null;

	return { questionOfTheDay };
};
