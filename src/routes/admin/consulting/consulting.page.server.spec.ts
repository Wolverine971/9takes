// src/routes/admin/consulting/consulting.page.server.spec.ts
import { describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';

vi.mock('$lib/server/betaSignups', () => ({ betaBookingUrl: vi.fn() }));
vi.mock('$lib/server/ctaExperiments', () => ({
	loadCtaExperimentResults: vi.fn(async () => [
		{ variant: 'a', viewed: 40, opened: 6, submitted: 2 }
	])
}));

import { loadCtaExperimentResults } from '$lib/server/ctaExperiments';

function eventFor(admin: boolean | null) {
	const from = vi.fn((table: string) => {
		const builder: any = {
			select: () => builder,
			eq: () => builder,
			gte: () => builder,
			lte: () => builder,
			in: () => builder,
			order: () => builder,
			limit: async () => ({ data: [] }),
			single: async () => ({ data: { id: 'user-1', admin }, error: null })
		};
		if (!['profiles', 'consulting_sessions', 'coaching_waitlist'].includes(table)) {
			throw new Error(`Unexpected table ${table}`);
		}
		return builder;
	});
	const rpc = vi.fn(async () => ({ data: {}, error: null }));
	return {
		locals: { session: admin === null ? null : { user: { id: 'user-1' } }, supabase: { from, rpc } }
	};
}

describe('consulting dashboard authorization', () => {
	it.each([null, false])('blocks admin report queries for admin=%s', async (admin) => {
		vi.clearAllMocks();
		const event = eventFor(admin);
		await expect(load(event as any)).rejects.toMatchObject({ status: admin === null ? 401 : 403 });
		expect(event.locals.supabase.rpc).not.toHaveBeenCalled();
		expect(event.locals.supabase.from.mock.calls.map(([table]) => table)).toEqual(
			admin === null ? [] : ['profiles']
		);
		expect(loadCtaExperimentResults).not.toHaveBeenCalled();
	});

	it('uses the authorized session client and returns experiment totals', async () => {
		vi.clearAllMocks();
		const event = eventFor(true);
		const result = await load(event as any);
		expect(loadCtaExperimentResults).toHaveBeenCalledWith(
			event.locals.supabase,
			'beta_card_v1',
			expect.any(Array)
		);
		expect(result).toMatchObject({
			betaCardResults: [{ variant: 'a', viewed: 40, opened: 6, submitted: 2 }]
		});
	});
});
