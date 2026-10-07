// src/routes/personality-analysis/personality-analysis.page.server.spec.ts
import { describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';
import type { CelebrityHubPerson, CelebrityHubType } from './celebrityHub';

describe('/personality-analysis page server load', () => {
	it('loads and preserves the authored persona title for each card', async () => {
		const rows = [
			{
				person: 'Liang Wenfeng',
				enneagram: '5',
				persona_title: "AI's Quiet Systems Architect",
				lastmod: '2026-08-24',
				date: '2026-08-24'
			},
			{
				person: 'Yang Zhilin',
				enneagram: '5',
				persona_title: "China's Patient Model Builder",
				lastmod: '2026-08-23',
				date: '2026-08-23'
			}
		];
		const eq = vi.fn().mockResolvedValue({ data: rows, error: null });
		const select = vi.fn(() => ({ eq }));
		const from = vi.fn(() => ({ select }));

		const result = await load({ locals: { supabase: { from } } } as any);
		if (!result) throw new Error('Expected personality-analysis page data');

		expect(from).toHaveBeenCalledWith('blogs_famous_people');
		expect(select).toHaveBeenCalledWith('person,enneagram,persona_title,lastmod,date');
		expect(eq).toHaveBeenCalledWith('published', true);
		expect(
			result.featured.map((person: { persona_title: string | null }) => person.persona_title)
		).toEqual(["AI's Quiet Systems Architect", "China's Patient Model Builder"]);
	});

	it('builds the all-nine-types celebrity hub from the same single query', async () => {
		const rows = [
			{ person: 'Taylor Swift', enneagram: '3', persona_title: null, lastmod: null, date: null },
			{ person: 'Tom Cruise', enneagram: '3', persona_title: null, lastmod: null, date: null },
			{ person: 'Elon Musk', enneagram: '5', persona_title: null, lastmod: null, date: null }
		];
		const eq = vi.fn().mockResolvedValue({ data: rows, error: null });
		const select = vi.fn(() => ({ eq }));
		const from = vi.fn(() => ({ select }));

		const result = await load({ locals: { supabase: { from } } } as any);
		if (!result) throw new Error('Expected personality-analysis page data');

		expect(from).toHaveBeenCalledTimes(1);
		expect(result.celebrityHub.map((group: CelebrityHubType) => group.type)).toEqual([
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9'
		]);
		const type3 = result.celebrityHub.find((group: CelebrityHubType) => group.type === '3')!;
		expect(type3.count).toBe(2);
		expect(type3.sharePct).toBe('66.7%');
		// Fame order from the Wikipedia pageview snapshot, as on the type hubs.
		expect(type3.people.map((person: CelebrityHubPerson) => person.name)).toEqual(
			expect.arrayContaining(['Taylor Swift', 'Tom Cruise'])
		);
		// "450+"-style count, rounded down from corpus-stats.json, never hardcoded.
		expect(result.publicFigureCount).toMatch(/^\d+0\+$/);
	});

	it('falls back to corpus-snapshot counts when the live query fails', async () => {
		const eq = vi.fn().mockResolvedValue({ data: null, error: new Error('db down') });
		const select = vi.fn(() => ({ eq }));
		const from = vi.fn(() => ({ select }));
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await load({ locals: { supabase: { from } } } as any);
		warn.mockRestore();
		if (!result) throw new Error('Expected personality-analysis page data');

		const corpusStats = (await import('$lib/data/corpus-stats.json')).default;
		for (const group of result.celebrityHub) {
			expect(group.count).toBe(
				corpusStats.enneagram_distribution.counts[
					group.type as keyof typeof corpusStats.enneagram_distribution.counts
				]
			);
			expect(group.people.length).toBeGreaterThan(0);
		}
	});
});
