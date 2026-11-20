// src/lib/server/corpusTokens.spec.ts
import { describe, expect, it, vi } from 'vitest';
import corpusStats from '$lib/data/corpus-stats.json';
import { resolveCorpusFaqs, resolveCorpusText } from './corpusTokens';

describe('people-page corpus tokens', () => {
	it('resolves tokens in DB content against the bundled corpus stats', () => {
		expect(resolveCorpusText('Of {{corpus.total}} profiles')).toBe(
			`Of ${corpusStats.totals.published} profiles`
		);
	});

	it('keeps an unknown token visible and logs instead of failing the page', () => {
		const log = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(resolveCorpusText('x {{corpus.nope}} y', 'person test')).toBe('x {{corpus.nope}} y');
		expect(log).toHaveBeenCalledWith(expect.stringContaining('person test'));
		log.mockRestore();
	});

	it('resolves FAQ questions and answers, leaving other shapes alone', () => {
		const faqs = [{ question: 'How many?', answer: '{{corpus.total}}' }, null, 'raw'];
		expect(resolveCorpusFaqs(faqs)).toEqual([
			{ question: 'How many?', answer: String(corpusStats.totals.published) },
			null,
			'raw'
		]);
		expect(resolveCorpusFaqs(null)).toBeNull();
	});
});
