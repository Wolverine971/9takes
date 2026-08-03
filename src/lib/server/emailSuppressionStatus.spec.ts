import { describe, expect, it, vi } from 'vitest';
import { loadEmailSuppressionStatus } from './emailSuppressionStatus';

describe('loadEmailSuppressionStatus', () => {
	it('batches large recipient lists and combines every suppression row', async () => {
		const emails = Array.from({ length: 201 }, (_, index) => `person-${index}@example.com`);
		const queryBatches: Array<{ table: string; emails: string[] }> = [];
		const supabase = {
			from: vi.fn((table: string) => ({
				select: vi.fn(() => ({
					in: vi.fn((_column: string, emailBatch: string[]) => {
						queryBatches.push({ table, emails: emailBatch });
						if (table === 'email_unsubscribes') {
							return Promise.resolve({
								data: emailBatch.map((email) => ({
									email,
									reason: 'recipient request',
									source: 'profiles',
									source_id: null,
									unsubscribed_at: '2026-08-01T00:00:00.000Z'
								})),
								error: null
							});
						}

						return {
							not: vi.fn().mockResolvedValue({ data: [], error: null })
						};
					})
				}))
			}))
		};

		const result = await loadEmailSuppressionStatus(supabase, [...emails, 'PERSON-0@EXAMPLE.COM']);

		expect(result.error).toBeNull();
		expect(result.byEmail).toHaveLength(201);
		expect(queryBatches).toHaveLength(4);
		expect(queryBatches.map((batch) => batch.emails.length)).toEqual([200, 200, 1, 1]);
	});
});
