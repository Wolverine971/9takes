// src/lib/server/provenChorusQuestions.ts
//
// The fallback give-first question for personality pages.
//
// Each /personality-analysis/[slug] page was built around its own chorus
// question, but DJ deliberately hid the 358 AI-seeded questions on 2026-08-14
// (356 of them are the ones these pages link to). Never unflag them. Pages
// whose own question is not public show one of these proven live questions
// instead, so the answer-first entry point keeps working.
//
// Chosen 2026-10-02 from read-only production data: unflagged, unremoved,
// publicly eligible questions ranked by real human takes and by gate ->
// contribution conversion in give_first_funnel_events over the last 90 days.
//
//   q567  what's something you do every day to seem fine...  34 human takes, all
//         in the last 90 days; 298 gate visitors -> 33 contributors; 24/140 (17%)
//         on the homepage. The only candidate with its nine-take chorus seeded.
//   q118  what were you like as a kid in 3 words?  42 human takes (most of any
//         public question); 8/34 (24%) on its question page.
//   q203  what are your criteria for considering someone a friend?  8 human
//         takes; 3/31 (10%) on its question page.
//
// /api/nine/mirror can only accept an answer once a question has its nine
// cached takes (nine_takes, subject_type 'question'). q118 and q203 have none
// yet, so the page loader skips them until DJ seeds them
// (scripts/seed-strategic-question.mjs); until then every page gets q567.
// Order is strongest first and only matters as the walk order after the
// per-person starting point.
export const PROVEN_CHORUS_QUESTION_URLS: readonly string[] = [
	'whats-something-every-day-seem-fine-nobody-knows-costing-effort',
	'what-were-you-like-as-a-kid-in-3-words',
	'whats-criteria-considering-someone-friend'
];

/** 32-bit FNV-1a: small, fast, and identical on every server instance. */
export function stableSlugHash(value: string): number {
	let hash = 0x811c9dc5;
	for (let i = 0; i < value.length; i++) {
		hash ^= value.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return hash >>> 0;
}

/**
 * The pool in the order this page should try it: a per-person starting point
 * (so different pages show different questions) then the rest of the pool, so
 * an ineligible question falls through to the next one. Same slug, same order,
 * which keeps a page stable across ISR re-renders.
 */
export function orderProvenChorusCandidates(
	pageSlug: string,
	pool: readonly string[] = PROVEN_CHORUS_QUESTION_URLS
): string[] {
	if (pool.length === 0) return [];
	const start = stableSlugHash(pageSlug) % pool.length;
	return [...pool.slice(start), ...pool.slice(0, start)];
}
