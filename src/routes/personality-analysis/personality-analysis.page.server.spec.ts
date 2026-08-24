import { describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';

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
});
