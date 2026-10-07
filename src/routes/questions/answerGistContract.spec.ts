// src/routes/questions/answerGistContract.spec.ts
//
// Static guards for the gated "gist so far" (T-43). The loader serves a
// Googlebot-only variant of /questions/[slug], so:
//   * the route must never be shared-cached (an ISR or s-maxage entry would
//     replay the crawler variant to humans, or a locked page to Googlebot);
//   * the gist text must never reach JSON-LD (structured data ignores
//     data-nosnippet, so it could surface in search results);
//   * the block must keep the class the paywall cssSelector targets and its
//     server-rendered data-nosnippet;
//   * the summaries table must stay unreadable from the browser.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	ANSWER_GIST_CLASS,
	ANSWER_GIST_SELECTOR,
	buildGatedContentFlags
} from '$lib/components/questions/answerGist';

const ROOT = process.cwd();
const read = (relative: string) => readFileSync(path.join(ROOT, relative), 'utf8');
const stripComments = (source: string) =>
	source
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/^\s*\/\/.*$/gm, '');

const pageServer = stripComments(read('src/routes/questions/[slug]/+page.server.ts'));
const page = read('src/routes/questions/[slug]/+page.svelte');
const pageScript = stripComments(page.slice(0, page.indexOf('</script>')));
const gistComponent = read('src/lib/components/questions/AnswerGist.svelte');
const migration = read('supabase/migrations/20261007120000_question_answer_summaries.sql');

describe('answer gist contract (T-43)', () => {
	it('keeps /questions/[slug] out of every shared cache', () => {
		expect(pageServer).not.toMatch(/export const config\b/);
		expect(pageServer).not.toMatch(/\bisr\s*:/);
		expect(pageServer).not.toMatch(/s-maxage/);
		expect(pageServer).not.toMatch(/['"`]public,/);
		// The crawler variant is marked private.
		expect(pageServer).toMatch(
			/setHeaders\(\{\s*'cache-control':\s*CONTENT_GUARD_CACHE_CONTROL\s*\}\)/
		);
	});

	it('never puts the gist or take text into structured data', () => {
		expect(pageScript).not.toMatch(/answerSummary\??\.summary/);
		expect(pageScript).not.toMatch(/'@type':\s*'(Answer|Comment|QAPage|Question)'/);
		expect(pageScript).toMatch(/buildGatedContentFlags\(data\.answerSummaryAvailable === true\)/);
	});

	it('paywall flags point at the gist block by class, and only when a gist exists', () => {
		expect(ANSWER_GIST_SELECTOR).toBe(`.${ANSWER_GIST_CLASS}`);
		expect(buildGatedContentFlags(false)).toEqual({});
		expect(buildGatedContentFlags(true)).toEqual({
			isAccessibleForFree: false,
			hasPart: {
				'@type': 'WebPageElement',
				isAccessibleForFree: false,
				cssSelector: '.answer-gist'
			}
		});
	});

	it('renders the gist with a static class and server-side data-nosnippet', () => {
		expect(gistComponent).toMatch(
			new RegExp(`<section class="${ANSWER_GIST_CLASS}" data-nosnippet[\\s>]`)
		);
		// No CSS hiding: Googlebot must see what an unlocked reader sees.
		expect(gistComponent).not.toMatch(/display:\s*none|visibility:\s*hidden|opacity:\s*0[;\s]/);
	});

	it('keeps the summaries table service-role only', () => {
		const sql = stripComments(migration.replace(/^\s*--.*$/gm, ''));
		expect(sql).toMatch(/ENABLE ROW LEVEL SECURITY/);
		expect(sql).not.toMatch(/CREATE POLICY/i);
		expect(sql).toMatch(
			/REVOKE ALL ON public\.question_answer_summaries FROM PUBLIC, anon, authenticated/
		);
	});
});
