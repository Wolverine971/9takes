// src/lib/server/emailAdminSequences.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getWelcomeSequenceOverview } from './emailAdminSequences';

function makeCountResult(count: number) {
	return { count, error: null };
}

function makeMaybeSingle(result: unknown) {
	return {
		eq: vi.fn().mockReturnThis(),
		maybeSingle: vi.fn().mockResolvedValue({ data: result, error: null })
	};
}

function makeCountQuery(count: number) {
	const result = makeCountResult(count);
	const query = {
		eq: vi.fn().mockReturnThis(),
		not: vi.fn().mockReturnThis(),
		lte: vi.fn().mockResolvedValue(result),
		then: (
			onFulfilled: (value: typeof result) => unknown,
			onRejected?: (reason: unknown) => unknown
		) => Promise.resolve(result).then(onFulfilled, onRejected),
		catch: (onRejected: (reason: unknown) => unknown) => Promise.resolve(result).catch(onRejected),
		finally: (onFinally: () => void) => Promise.resolve(result).finally(onFinally)
	};

	query.eq.mockImplementation(() => query);
	query.not.mockImplementation(() => query);

	return query;
}

function createSupabaseMock(options?: {
	sequence?: Record<string, unknown> | null;
	stepCount?: number;
	counts?: Partial<
		Record<
			'total' | 'active' | 'processing' | 'paused' | 'completed' | 'exited' | 'errored' | 'dueNow',
			number
		>
	>;
	recentEnrollments?: Record<string, unknown>[];
}) {
	const sequence =
		options?.sequence === undefined
			? {
					id: 'seq-1',
					key: 'welcome_sequence',
					display_name: 'Registered User Welcome Sequence',
					status: 'active',
					trigger_type: 'user_registration'
				}
			: options.sequence;

	const counts = {
		total: 12,
		active: 3,
		processing: 1,
		paused: 0,
		completed: 5,
		exited: 2,
		errored: 1,
		dueNow: 2,
		...options?.counts
	};

	const recentEnrollments = options?.recentEnrollments ?? [
		{
			id: 'enrollment-1',
			recipient_email: 'alice@example.com',
			recipient_source: 'profiles',
			status: 'active',
			current_step_number: 1,
			next_step_number: 2,
			enrolled_at: '2026-03-16T00:00:00.000Z',
			next_send_at: '2026-03-18T00:00:00.000Z',
			last_sent_at: '2026-03-16T00:00:00.000Z',
			exit_reason: null,
			failure_count: 0,
			last_error: null,
			updated_at: '2026-03-16T00:05:00.000Z'
		}
	];

	let enrollmentCountIndex = 0;

	const from = vi.fn((table: string) => {
		if (table === 'email_sequences') {
			return {
				select: vi.fn().mockReturnValue(makeMaybeSingle(sequence))
			};
		}

		if (table === 'email_sequence_steps') {
			const result = makeCountResult(options?.stepCount ?? 4);
			const query = {
				eq: vi.fn().mockReturnThis(),
				then: (
					onFulfilled: (value: typeof result) => unknown,
					onRejected?: (reason: unknown) => unknown
				) => Promise.resolve(result).then(onFulfilled, onRejected),
				catch: (onRejected: (reason: unknown) => unknown) =>
					Promise.resolve(result).catch(onRejected),
				finally: (onFinally: () => void) => Promise.resolve(result).finally(onFinally)
			};
			query.eq.mockImplementation(() => query);

			return {
				select: vi.fn().mockReturnValue(query)
			};
		}

		if (table === 'email_sequence_enrollments') {
			return {
				select: vi.fn((columns: string, config?: { count?: string; head?: boolean }) => {
					if (config?.head) {
						const countQueries = [
							counts.total,
							counts.active,
							counts.processing,
							counts.paused,
							counts.completed,
							counts.exited,
							counts.errored,
							counts.dueNow
						];
						const count = countQueries[enrollmentCountIndex] ?? 0;
						enrollmentCountIndex += 1;
						return makeCountQuery(count);
					}

					const recentQuery = {
						eq: vi.fn().mockReturnThis(),
						order: vi.fn().mockReturnThis(),
						limit: vi.fn().mockResolvedValue({ data: recentEnrollments, error: null })
					};

					recentQuery.eq.mockImplementation(() => recentQuery);
					recentQuery.order.mockImplementation(() => recentQuery);

					return recentQuery;
				})
			};
		}

		throw new Error(`Unexpected table: ${table}`);
	});

	return { from };
}

describe('getWelcomeSequenceOverview', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns null when the welcome sequence is not present', async () => {
		const supabase = createSupabaseMock({ sequence: null });

		const result = await getWelcomeSequenceOverview(supabase as any);

		expect(result).toBeNull();
	});

	it('returns summary counts and recent enrollments for the welcome sequence', async () => {
		const supabase = createSupabaseMock();

		const result = await getWelcomeSequenceOverview(supabase as any);

		expect(result).toMatchObject({
			sequence: {
				key: 'welcome_sequence',
				status: 'active'
			},
			stepCount: 4,
			counts: {
				total: 12,
				active: 3,
				completed: 5,
				exited: 2,
				errored: 1,
				dueNow: 2
			}
		});
		expect(result?.recentEnrollments).toHaveLength(1);
		expect(result?.recentEnrollments[0]?.recipient_email).toBe('alice@example.com');
	});
});
