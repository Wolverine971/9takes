// src/routes/personality-analysis/type/[slug]/typeHubPatterns.spec.ts
import { describe, expect, it } from 'vitest';
import { descriptionHook, findTitlePatterns, titleWords } from './typeHubPatterns';

describe('titleWords', () => {
	it('drops possessive field prefixes, filler, type names and fixed-phrase halves', () => {
		expect(titleWords("Cinema's Armored Brawler")).toEqual(['armored', 'brawler']);
		expect(titleWords("Silicon Valley's Self-Made Challenger")).toEqual(['self-made']);
		expect(titleWords("Politics' Restless Escape Artist")).toEqual(['restless', 'escape']);
		expect(titleWords('The Mute Who Built the Loudest Empire')).toEqual([
			'mute',
			'built',
			'loudest',
			'empire'
		]);
	});

	it('counts a word once per title', () => {
		expect(titleWords('Restless, Restless Heart')).toEqual(['restless', 'heart']);
	});
});

describe('findTitlePatterns', () => {
	const people = [
		{ slug: 'tom-hardy', personaTitle: "Cinema's Armored Brawler" },
		{ slug: 'nicki-minaj', personaTitle: "Rap's Armored Queen" },
		{ slug: 'tyler1', personaTitle: "Streaming's Disciplined Brawler" },
		{ slug: 'duke-dennis', personaTitle: "Streaming's Unbossable Titan" },
		{ slug: 'nara-smith', personaTitle: 'The Whisper That Never Asks' },
		{ slug: 'no-title', personaTitle: null },
		{ slug: 'khabib', personaTitle: "MMA's Armored Titan" }
	];

	it('ranks repeated words by how many people share them, keeping fame order', () => {
		// Only "armored" clears 3, so two-person words fill the strip to three.
		expect(findTitlePatterns(people)).toEqual([
			{
				word: 'armored',
				label: 'Armored',
				count: 3,
				slugs: ['tom-hardy', 'nicki-minaj', 'khabib']
			},
			{ word: 'brawler', label: 'Brawler', count: 2, slugs: ['tom-hardy', 'tyler1'] },
			{ word: 'titan', label: 'Titan', count: 2, slugs: ['duke-dennis', 'khabib'] }
		]);
	});

	it('drops two-person coincidences once enough strong words exist', () => {
		expect(findTitlePatterns(people, { minPatterns: 1 }).map((p) => p.word)).toEqual(['armored']);
		expect(findTitlePatterns(people, { limit: 1 }).map((p) => p.word)).toEqual(['armored']);
		expect(findTitlePatterns([])).toEqual([]);
	});

	it('title-cases labels whatever case the title used', () => {
		const [pattern] = findTitlePatterns([
			{ slug: 'a', personaTitle: "Hollywood's pressure-tested architect" },
			{ slug: 'b', personaTitle: 'The Quiet Architect' }
		]);
		expect(pattern.label).toBe('Architect');
	});
});

describe('descriptionHook', () => {
	it('returns the first sentence', () => {
		expect(
			descriptionHook(
				'Why does Gordon Ramsay rage in the kitchen? His abusive childhood reveals a Type 8 pattern.'
			)
		).toBe('Why does Gordon Ramsay rage in the kitchen?');
	});

	it('trims a long first sentence at a word boundary', () => {
		const hook = descriptionHook(`${'word '.repeat(60)}end.`, 40);
		expect(hook.length).toBeLessThanOrEqual(40);
		expect(hook.endsWith('…')).toBe(true);
	});

	it('handles empty input', () => {
		expect(descriptionHook(null)).toBe('');
		expect(descriptionHook('   ')).toBe('');
	});
});
