// src/routes/admin/welcome-sequence/welcome-sequence.page.server.spec.ts
import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/email/sender', () => ({ sendEmail: vi.fn() }));

import { load } from './+page.server';

type QueryCall = {
	table: string;
	options?: { count?: string; head?: boolean };
	filters: Array<[string, ...unknown[]]>;
};

const SEND_COUNTS: Record<number, { sent: number; opened: number; clicked: number }> = {
	1: { sent: 4, opened: 2, clicked: 1 }
};

function hasFilter(call: QueryCall, method: string, column: string) {
	return call.filters.some(([name, field]) => name === method && field === column);
}

function enrollment(id: string, userId: string | null) {
	return {
		id,
		user_id: userId,
		recipient_email: `${id}@example.com`,
		recipient_source: 'profiles',
		status: 'active',
		current_step_number: 1,
		next_step_number: 2,
		enrolled_at: '2026-09-01T00:00:00.000Z',
		next_send_at: '2026-10-05T00:00:00.000Z',
		last_sent_at: '2026-09-01T00:00:00.000Z',
		exit_reason: null,
		failure_count: 0,
		last_error: null
	};
}

function step(stepNumber: number) {
	return {
		step_number: stepNumber,
		subject: `Step ${stepNumber}`,
		html_content: `<p>Step ${stepNumber}</p>`,
		plain_text: null,
		delay_days_after_previous: stepNumber === 1 ? 0 : 2
	};
}

function resolveQuery(call: QueryCall) {
	switch (call.table) {
		case 'email_sequences':
			return {
				data: {
					id: 'seq-1',
					key: 'welcome_sequence',
					display_name: 'Welcome',
					status: 'active',
					trigger_type: 'signup'
				},
				error: null
			};
		case 'email_sequence_steps':
			return { data: [step(1), step(2)], error: null };
		case 'email_sequence_enrollments':
			if (call.options?.head) return { count: 3, error: null };
			if (hasFilter(call, 'in', 'status')) return { data: [], error: null };
			return {
				data: [enrollment('e1', 'user-1'), enrollment('e2', 'user-2'), enrollment('e3', null)],
				error: null
			};
		case 'scheduled_emails':
			return { data: [], error: null };
		case 'email_sends': {
			const stepNumber = call.filters.find(
				([name, field]) => name === 'eq' && field === 'sequence_step_number'
			)?.[2] as number;
			const counts = SEND_COUNTS[stepNumber] ?? { sent: 0, opened: 0, clicked: 0 };
			if (hasFilter(call, 'in', 'status')) return { count: counts.sent, error: null };
			if (hasFilter(call, 'not', 'opened_at')) return { count: counts.opened, error: null };
			return { count: counts.clicked, error: null };
		}
		case 'page_analytics_sessions':
			if (hasFilter(call, 'in', 'user_id')) {
				return {
					data: [
						{
							id: 's1',
							user_id: 'user-1',
							fingerprint: 'fp-1',
							last_seen_at: '2026-09-20T00:00:00.000Z'
						}
					],
					error: null
				};
			}
			return {
				data: [
					{
						id: 's2',
						user_id: null,
						fingerprint: 'fp-1',
						last_seen_at: '2026-09-25T00:00:00.000Z'
					},
					{
						id: 's1',
						user_id: 'user-1',
						fingerprint: 'fp-1',
						last_seen_at: '2026-09-20T00:00:00.000Z'
					}
				],
				error: null
			};
		default:
			throw new Error(`Unexpected table ${call.table}`);
	}
}

function buildEvent(options: { rpcError?: unknown; parent?: () => Promise<unknown> } = {}) {
	const calls: QueryCall[] = [];
	const from = vi.fn((table: string) => {
		const call: QueryCall = { table, filters: [] };
		calls.push(call);
		const query: any = {
			select: (_columns: string, selectOptions?: QueryCall['options']) => {
				call.options = selectOptions;
				return query;
			},
			maybeSingle: () => query,
			then: (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
				Promise.resolve(resolveQuery(call)).then(resolve, reject)
		};
		for (const method of ['eq', 'gte', 'in', 'not', 'order', 'limit']) {
			query[method] = (...args: unknown[]) => {
				call.filters.push([method, ...args]);
				return query;
			};
		}
		return query;
	});
	const rpc = vi.fn(async () =>
		options.rpcError
			? { data: null, error: options.rpcError }
			: {
					data: [{ step_number: 1, total_sent: '4', total_opened: '2', total_clicked: '1' }],
					error: null
				}
	);
	const parent = vi.fn(options.parent ?? (async () => ({})));
	const event = {
		locals: {
			supabase: { from, rpc },
			session: { user: { id: 'admin-1', email: 'dj@9takes.com' } }
		},
		parent
	};

	return { event: event as any, calls, rpc, parent };
}

const EXPECTED_STEP_COUNTS = [
	{
		step_number: 1,
		total_sent: 4,
		total_opened: 2,
		total_clicked: 1,
		open_rate: 50,
		click_rate: 25
	},
	{ step_number: 2, total_sent: 0, total_opened: 0, total_clicked: 0, open_rate: 0, click_rate: 0 }
];

describe('/admin/welcome-sequence load', () => {
	it('reads step metrics from one grouped RPC and awaits the admin layout guard', async () => {
		const { event, calls, rpc, parent } = buildEvent();
		const result: any = await load(event);

		expect(parent).toHaveBeenCalledTimes(1);
		expect(rpc).toHaveBeenCalledWith('admin_sequence_step_metrics', { p_sequence_id: 'seq-1' });
		expect(calls.some((call) => call.table === 'email_sends')).toBe(false);
		expect(result.stepMetrics).toEqual(
			EXPECTED_STEP_COUNTS.map((counts, index) => ({
				...counts,
				subject: result.steps[index].subject
			}))
		);
	});

	it('falls back to per-step counts with identical numbers while the migration is pending', async () => {
		const { event, calls } = buildEvent({
			rpcError: { code: 'PGRST202', message: 'Could not find the function' }
		});
		const result: any = await load(event);

		expect(calls.filter((call) => call.table === 'email_sends')).toHaveLength(6);
		expect(result.stepMetrics).toEqual(
			EXPECTED_STEP_COUNTS.map((counts, index) => ({
				...counts,
				subject: result.steps[index].subject
			}))
		);
	});

	it('surfaces other step-metric errors instead of showing zeros', async () => {
		const { event } = buildEvent({ rpcError: { code: '42501', message: 'denied' } });
		await expect(load(event)).rejects.toMatchObject({ code: '42501' });
	});

	it('joins return visits by user and by fingerprint', async () => {
		const { event } = buildEvent();
		const result: any = await load(event);
		const byId = Object.fromEntries(
			result.enrollments.map((row: { id: string; return_data: unknown }) => [
				row.id,
				row.return_data
			])
		);

		expect(byId.e1).toEqual({ last_visit: '2026-09-25T00:00:00.000Z', session_count: 2 });
		expect(byId.e2).toBeNull();
		expect(byId.e3).toBeNull();
		expect(result.funnelCounts.total_enrolled).toBe(3);
		expect(result.queuedEnrollments).toEqual([]);
	});

	it('rejects when the admin layout guard rejects', async () => {
		const { event } = buildEvent({
			parent: async () => {
				throw new Error('redirect to /login');
			}
		});
		await expect(load(event)).rejects.toThrow('redirect to /login');
	});
});
