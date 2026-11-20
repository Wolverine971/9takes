// src/lib/server/corpusTokens.ts
// Server-side resolver for `{{corpus.*}}` tokens in DB-backed copy (people pages). MDsvex posts
// resolve at build time in svelte.config.js instead; both share src/lib/corpusTokens.js.
// corpus-stats.json is bundled at build, and `build:vercel` regenerates it first, so a deploy
// serves the numbers it was built with.

import corpusStats from '$lib/data/corpus-stats.json';
import { buildCorpusTokenTable, resolveCorpusTokens } from '$lib/corpusTokens.js';

let table: Map<string, string> | null = null;

/**
 * Swaps corpus tokens for current values. At runtime an unknown token stays visible and is
 * logged rather than failing the page: `pnpm lint` and push:people catch them before publish.
 */
export function resolveCorpusText(text: string, source = 'db content'): string {
	if (!text || !text.includes('{{')) return text;
	table ??= buildCorpusTokenTable(corpusStats);
	return resolveCorpusTokens(text, table, {
		source,
		onMissing: (path) => {
			console.error(`[corpusTokens] unknown token {{corpus.${path}}} in ${source}`);
			return `{{corpus.${path}}}`;
		}
	});
}

/** Resolves tokens in the `question` / `answer` strings of a people-page FAQ array. */
export function resolveCorpusFaqs<T>(faqs: T, source = 'faqs'): T {
	if (!Array.isArray(faqs)) return faqs;
	return faqs.map((faq) => {
		if (!faq || typeof faq !== 'object' || Array.isArray(faq)) return faq;
		const record = faq as Record<string, unknown>;
		return {
			...record,
			...(typeof record.question === 'string' && {
				question: resolveCorpusText(record.question, source)
			}),
			...(typeof record.answer === 'string' && { answer: resolveCorpusText(record.answer, source) })
		};
	}) as T;
}
