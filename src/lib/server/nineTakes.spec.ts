// src/lib/server/nineTakes.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ lookup: vi.fn() }));
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({
		from: (table: string) => {
			const chain = {
				select: () => chain,
				eq: () => chain,
				maybeSingle: () => mocks.lookup(table)
			};
			return chain;
		}
	})
}));
vi.mock('../../utils/server/smart-llm-service', () => ({ SmartLLMService: class {} }));
import { getChorusForQuestion } from './nineTakes';
import { CHORUS_STARTER_SLUG } from '$lib/data/chorusStarter';

describe('starter chorus availability', () => {
	beforeEach(() => {
		mocks.lookup.mockImplementation(async (table: string) => ({
			data:
				table === 'questions'
					? { id: 118, question: 'What were you like as a kid in 3 words?' }
					: null
		}));
	});
	it('accepts the starter question without a separate database seed', async () => {
		const chorus = await getChorusForQuestion(CHORUS_STARTER_SLUG);
		expect(chorus?.questionId).toBe(118);
		expect(chorus?.takes.map((take) => take.type)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		expect(chorus?.takes.every((take) => take.source === 'ai')).toBe(true);
	});
	it.each([
		{ flagged: true },
		{ removed: true },
		{ data: { source: 'chorus', editorial_status: 'draft' } }
	])('never revives an ineligible question: %o', async (state) => {
		mocks.lookup.mockResolvedValue({ data: { id: 118, question: 'Hidden', ...state } });
		expect(await getChorusForQuestion(CHORUS_STARTER_SLUG)).toBeNull();
	});
	it('does not invent a chorus for other unseeded questions', async () => {
		expect(await getChorusForQuestion('another-question')).toBeNull();
	});
});
