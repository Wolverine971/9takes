// src/lib/server/nineTakes.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ lookup: vi.fn(), getJSONResponse: vi.fn() }));
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
vi.mock('../../utils/server/smart-llm-service', () => ({
	SmartLLMService: class {
		getJSONResponse = mocks.getJSONResponse;
	}
}));
import { generateMirror, getChorusForQuestion } from './nineTakes';
import { CHORUS_STARTER_SLUG } from '$lib/data/chorusStarter';

describe('starter chorus availability', () => {
	beforeEach(() => {
		mocks.lookup.mockImplementation(async (table: string) => ({
			data:
				table === 'questions'
					? { id: 573, question: 'What do people get wrong about you when they first meet you?' }
					: null
		}));
	});
	it('accepts the starter question without a separate database seed', async () => {
		const chorus = await getChorusForQuestion(CHORUS_STARTER_SLUG);
		expect(chorus?.questionId).toBe(573);
		expect(chorus?.takes.map((take) => take.type)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		expect(chorus?.takes.every((take) => take.source === 'ai')).toBe(true);
	});
	it.each([
		{ flagged: true },
		{ removed: true },
		{ data: { source: 'chorus', editorial_status: 'draft' } }
	])('never revives an ineligible question: %o', async (state) => {
		mocks.lookup.mockResolvedValue({ data: { id: 573, question: 'Hidden', ...state } });
		expect(await getChorusForQuestion(CHORUS_STARTER_SLUG)).toBeNull();
	});
	it('keeps the retired kid question answerable for cached pages', async () => {
		const chorus = await getChorusForQuestion('what-were-you-like-as-a-kid-in-3-words');
		expect(chorus?.takes).toHaveLength(9);
	});
	it('does not invent a chorus for other unseeded questions', async () => {
		expect(await getChorusForQuestion('another-question')).toBeNull();
		expect(await getChorusForQuestion('constructor')).toBeNull();
	});
});

describe('mirror reflection', () => {
	it('uses the fast model tier so it lands inside the 8-second answer deadline', async () => {
		mocks.getJSONResponse.mockResolvedValue({
			reflection: 'You want to be read right.',
			resonantType: 5
		});
		const mirror = await generateMirror('What do people get wrong about you?', 'That I am cold.');
		expect(mocks.getJSONResponse).toHaveBeenCalledWith(
			expect.objectContaining({ profile: 'fast' })
		);
		expect(mirror.resonantType).toBe(5);
	});
});
