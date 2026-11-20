// src/lib/server/newsletterSignupProtection.spec.ts
import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/utils/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() } }));

import { getNewsletterSignupProtectionState } from './newsletterSignupProtection';

type CountResult = { count: number | null; error: unknown };
type CountQuery = { table: string; filters: Array<[string, string, unknown]> };

/** Head-count stand-in: every query resolves to whatever `answer` returns for it. */
function fakeSupabase(answer: (query: CountQuery) => CountResult) {
	const queries: CountQuery[] = [];
	return {
		queries,
		client: {
			from(table: string) {
				const query: CountQuery = { table, filters: [] };
				queries.push(query);
				const builder: Record<string, unknown> = {};
				for (const method of ['eq', 'gte', 'in']) {
					builder[method] = (column: string, value: unknown) => {
						query.filters.push([method, column, value]);
						return builder;
					};
				}
				builder.select = () => builder;
				builder.then = (resolve: (value: CountResult) => unknown) => resolve(answer(query));
				return builder;
			}
		}
	};
}

const input = { ipAddress: '203.0.113.7', identifier: 'Reader@Example.com' };

describe('getNewsletterSignupProtectionState', () => {
	it('lets a signup through when every count is under its limit', async () => {
		const db = fakeSupabase(() => ({ count: 0, error: null }));
		expect(await getNewsletterSignupProtectionState({ supabase: db.client, ...input })).toEqual({
			authAbuse: false,
			rateLimited: false
		});
	});

	it('rate limits an IP at three counted signups an hour', async () => {
		const db = fakeSupabase((query) => ({
			count:
				query.table === 'newsletter_signup_security_events' &&
				query.filters.some(([, column]) => column === 'ip_hash')
					? 3
					: 0,
			error: null
		}));
		expect(
			await getNewsletterSignupProtectionState({ supabase: db.client, ...input })
		).toMatchObject({ rateLimited: true, reason: 'ip_rate_limit' });
	});

	it('counts repeat signups for an address that is already on the list', async () => {
		const db = fakeSupabase(() => ({ count: 0, error: null }));
		await getNewsletterSignupProtectionState({ supabase: db.client, ...input });

		const newsletterQueries = db.queries.filter(
			(query) => query.table === 'newsletter_signup_security_events'
		);
		expect(newsletterQueries).toHaveLength(2);
		for (const query of newsletterQueries) {
			const outcomes = query.filters.find(([method]) => method === 'in')?.[2];
			expect(outcomes).toEqual(expect.arrayContaining(['success', 'already_exists']));
			expect(outcomes).not.toContain('invalid_email');
		}
	});

	it.each(['newsletter_signup_security_events', 'auth_security_events'])(
		'refuses the signup when %s cannot be counted',
		async (failingTable) => {
			const db = fakeSupabase((query) =>
				query.table === failingTable
					? { count: null, error: { message: 'database unavailable' } }
					: { count: 0, error: null }
			);
			expect(
				await getNewsletterSignupProtectionState({ supabase: db.client, ...input })
			).toMatchObject({
				authAbuse: false,
				rateLimited: true,
				reason: 'protection_unavailable'
			});
		}
	);
});
