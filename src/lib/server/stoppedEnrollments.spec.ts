// src/lib/server/stoppedEnrollments.spec.ts
import { describe, expect, it, vi } from 'vitest';
import {
	ADMIN_END_EXIT_REASON,
	endStoppedEnrollment,
	loadStoppedEnrollments,
	resumeStoppedEnrollment
} from './stoppedEnrollments';

function mockQuery(result: unknown) {
	const query: any = {
		select: vi.fn(() => query),
		update: vi.fn(() => query),
		eq: vi.fn(() => query),
		in: vi.fn(() => query),
		order: vi.fn(() => query),
		limit: vi.fn(() => query),
		then: (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve)
	};
	return query;
}

describe('stopped enrollments', () => {
	it('lists the same set the cron alarms on, with the email that failed', async () => {
		const enrollments = mockQuery({
			data: [
				{
					id: 'enrollment-1',
					sequence_id: 'welcome',
					user_id: 'user-1',
					recipient_email: 'reader@example.com',
					next_step_number: 2,
					last_error: 'EMAIL_FOOTER_ADDRESS is required for marketing email delivery',
					last_sent_at: '2026-08-31T06:06:11.000Z',
					updated_at: '2026-09-02T07:45:05.000Z',
					email_sequences: { display_name: 'Welcome Sequence', status: 'active' }
				},
				{
					id: 'enrollment-2',
					sequence_id: 'welcome',
					user_id: null,
					recipient_email: 'signup@example.com',
					next_step_number: 9,
					last_error: null,
					last_sent_at: null,
					updated_at: '2026-09-01T00:00:00.000Z',
					email_sequences: { display_name: 'Welcome Sequence', status: 'active' }
				}
			],
			error: null
		});
		const steps = mockQuery({
			data: [{ sequence_id: 'welcome', step_number: 2, subject: "He thinks she's cold." }],
			error: null
		});
		const getUserById = vi.fn(async () => ({
			data: { user: { email_confirmed_at: '2026-08-31T06:07:00.000Z' } },
			error: null
		}));
		const supabase = {
			from: vi.fn((table: string) =>
				table === 'email_sequence_enrollments' ? enrollments : steps
			),
			auth: { admin: { getUserById } }
		};

		const rows = await loadStoppedEnrollments(supabase);

		expect(enrollments.eq).toHaveBeenCalledWith('status', 'errored');
		expect(enrollments.eq).toHaveBeenCalledWith('email_sequences.status', 'active');
		expect(getUserById).toHaveBeenCalledTimes(1);
		expect(rows).toEqual([
			expect.objectContaining({
				id: 'enrollment-1',
				emailConfirmed: true,
				nextSubject: "He thinks she's cold.",
				stoppedAt: '2026-09-02T07:45:05.000Z'
			}),
			expect.objectContaining({ id: 'enrollment-2', emailConfirmed: null, nextSubject: null })
		]);
	});

	it('skips the follow-up lookups when nothing is stopped', async () => {
		const supabase = { from: vi.fn(() => mockQuery({ data: [], error: null })) };
		expect(await loadStoppedEnrollments(supabase)).toEqual([]);
		expect(supabase.from).toHaveBeenCalledTimes(1);
	});

	it('resumes with a fresh retry budget, only from errored', async () => {
		const query = mockQuery({ data: [{ id: 'enrollment-1' }], error: null });
		const supabase = { from: vi.fn(() => query) };

		expect(await resumeStoppedEnrollment(supabase, 'enrollment-1')).toBe(true);
		expect(query.update).toHaveBeenCalledWith(
			expect.objectContaining({
				status: 'active',
				failure_count: 0,
				last_error: null,
				processing_started_at: null,
				next_send_at: expect.any(String)
			})
		);
		expect(query.eq).toHaveBeenCalledWith('id', 'enrollment-1');
		expect(query.eq).toHaveBeenCalledWith('status', 'errored');
	});

	it('reports when the enrollment was already resolved', async () => {
		const supabase = { from: vi.fn(() => mockQuery({ data: [], error: null })) };
		expect(await resumeStoppedEnrollment(supabase, 'enrollment-1')).toBe(false);
		expect(await endStoppedEnrollment(supabase, 'enrollment-1')).toBe(false);
	});

	it('ends without clearing the error that stopped it', async () => {
		const query = mockQuery({ data: [{ id: 'enrollment-1' }], error: null });
		const supabase = { from: vi.fn(() => query) };

		expect(await endStoppedEnrollment(supabase, 'enrollment-1')).toBe(true);
		const changes = query.update.mock.calls[0][0];
		expect(changes).toMatchObject({
			status: 'exited',
			exit_reason: ADMIN_END_EXIT_REASON,
			next_send_at: null
		});
		expect(changes).not.toHaveProperty('last_error');
		expect(query.eq).toHaveBeenCalledWith('status', 'errored');
	});
});
