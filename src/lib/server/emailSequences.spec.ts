// src/lib/server/emailSequences.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	getSupabaseAdminClientMock,
	getSuppressedEmailSetMock,
	sendEmailWithTrackingMock,
	prepareSequenceSendMock
} = vi.hoisted(() => ({
	getSupabaseAdminClientMock: vi.fn(),
	getSuppressedEmailSetMock: vi.fn(),
	sendEmailWithTrackingMock: vi.fn(),
	prepareSequenceSendMock: vi.fn()
}));

vi.mock('./supabaseAdmin', () => ({
	getSupabaseAdminClient: getSupabaseAdminClientMock
}));

vi.mock('$lib/email/suppression', () => ({
	getSuppressedEmailSet: getSuppressedEmailSetMock,
	normalizeEmail: (email: string | null | undefined) => (email || '').trim().toLowerCase()
}));

vi.mock('$lib/email/sender', () => ({
	sendEmailWithTracking: sendEmailWithTrackingMock
}));

vi.mock('$lib/email/sequences', () => ({
	WELCOME_SEQUENCE_KEY: 'welcome_sequence',
	REACTIVATION_SEQUENCE_KEYS: ['reactivation_cold', 'reactivation_dormant', 'reactivation_zombies'],
	getReactivationSequenceKeyForBucket: (bucket: string) => `reactivation_${bucket}`,
	prepareSequenceSend: prepareSequenceSendMock
}));

import { processPendingSequenceSends, processSequenceEnrollmentNow } from './emailSequences';

function makeRow(overrides: Record<string, unknown> = {}) {
	return {
		enrollment_id: 'enrollment-1',
		sequence_key: 'welcome_sequence',
		user_id: 'user-1',
		recipient_email: 'alice@example.com',
		recipient_source: 'profiles',
		recipient_source_id: 'user-1',
		recipient_name: 'Alice',
		enneagram: '5',
		step_number: 1,
		subject: 'Welcome',
		html_content: '<p>Hello</p>',
		plain_text: 'Hello',
		...overrides
	};
}

function createSupabaseMock(options?: {
	claimedRows?: Array<Record<string, unknown>>;
	specificClaimedRows?: Array<Record<string, unknown>>;
	completeError?: { message: string } | null;
	exitEmailError?: { message: string } | null;
	promptGuard?: Record<string, unknown>;
}) {
	const claimedRows = options?.claimedRows ?? [];
	const specificClaimedRows = options?.specificClaimedRows ?? [];
	const completeError = options?.completeError ?? null;
	const exitEmailError = options?.exitEmailError ?? null;
	const promptGuard = options?.promptGuard ?? {
		eligible: true,
		reason: 'eligible',
		enneagram: 'unknown',
		last_email_sent_at: null,
		next_eligible_at: null
	};

	const eqStatus = vi.fn().mockResolvedValue({ error: null });
	const eqId = vi.fn().mockReturnValue({ eq: eqStatus });
	const update = vi.fn().mockReturnValue({ eq: eqId });
	const from = vi.fn().mockReturnValue({ update });

	const rpc = vi.fn(async (fn: string) => {
		switch (fn) {
			case 'claim_pending_sequence_sends':
				return { data: claimedRows, error: null };
			case 'claim_specific_sequence_send':
				return { data: specificClaimedRows, error: null };
			case 'complete_sequence_send':
				return { data: null, error: completeError };
			case 'retry_or_fail_sequence_send':
				return { data: null, error: null };
			case 'exit_email_from_sequence':
				return { data: exitEmailError ? null : 1, error: exitEmailError };
			case 'exit_user_from_sequence':
				return { data: 1, error: null };
			case 'get_enneagram_type_prompt_send_guard':
				return { data: promptGuard, error: null };
			default:
				return { data: null, error: null };
		}
	});

	return {
		rpc,
		from,
		_mocks: { update, eqId, eqStatus }
	};
}

describe('processPendingSequenceSends', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		getSuppressedEmailSetMock.mockResolvedValue(new Set<string>());
		prepareSequenceSendMock.mockReturnValue({
			recipient: {
				id: 'user-1',
				email: 'alice@example.com',
				name: 'Alice',
				source: 'profiles',
				source_id: 'user-1'
			},
			subject: 'Welcome',
			htmlContent: '<p>Hello</p>',
			plainText: 'Hello'
		});
	});

	it('skips suppressed recipients and exits them before sending', async () => {
		const supabase = createSupabaseMock({
			claimedRows: [makeRow()]
		});
		getSupabaseAdminClientMock.mockReturnValue(supabase);
		getSuppressedEmailSetMock.mockResolvedValue(new Set(['alice@example.com']));

		const result = await processPendingSequenceSends(10);

		expect(result).toEqual({
			claimed: 1,
			sent: 0,
			skipped: 1,
			errors: 0
		});
		expect(sendEmailWithTrackingMock).not.toHaveBeenCalled();
		expect(supabase.rpc).toHaveBeenCalledWith('exit_email_from_sequence', {
			p_email: 'alice@example.com',
			p_sequence_key: 'welcome_sequence',
			p_reason: 'unsubscribed'
		});
	});

	it('skips the type prompt if the recipient has added a type before send time', async () => {
		const supabase = createSupabaseMock({
			claimedRows: [
				makeRow({
					sequence_key: 'enneagram_type_prompt',
					enneagram: '7'
				})
			],
			promptGuard: {
				eligible: false,
				reason: 'enneagram_added',
				enneagram: '7',
				last_email_sent_at: null,
				next_eligible_at: null
			}
		});
		getSupabaseAdminClientMock.mockReturnValue(supabase);

		const result = await processPendingSequenceSends(10);

		expect(result).toEqual({
			claimed: 1,
			sent: 0,
			skipped: 1,
			errors: 0
		});
		expect(sendEmailWithTrackingMock).not.toHaveBeenCalled();
		expect(supabase.rpc).toHaveBeenCalledWith('exit_user_from_sequence', {
			p_user_id: 'user-1',
			p_sequence_key: 'enneagram_type_prompt',
			p_reason: 'enneagram_added'
		});
	});

	it('defers the type prompt until the seven-day email buffer clears', async () => {
		const supabase = createSupabaseMock({
			claimedRows: [makeRow({ sequence_key: 'enneagram_type_prompt', enneagram: 'unknown' })],
			promptGuard: {
				eligible: false,
				reason: 'recent_email',
				enneagram: 'unknown',
				last_email_sent_at: '2026-08-10T12:00:00.000Z',
				next_eligible_at: '2026-08-17T12:00:00.000Z'
			}
		});
		getSupabaseAdminClientMock.mockReturnValue(supabase);

		const result = await processPendingSequenceSends(10);

		expect(result).toEqual({
			claimed: 1,
			sent: 0,
			skipped: 1,
			errors: 0
		});
		expect(sendEmailWithTrackingMock).not.toHaveBeenCalled();
		expect(supabase._mocks.update).toHaveBeenCalledWith(
			expect.objectContaining({
				status: 'active',
				next_send_at: '2026-08-17T12:00:00.000Z',
				processing_started_at: null
			})
		);
	});

	it('finalizes successful sends with the tracked email id', async () => {
		const supabase = createSupabaseMock({
			claimedRows: [makeRow()]
		});
		getSupabaseAdminClientMock.mockReturnValue(supabase);
		sendEmailWithTrackingMock.mockResolvedValue({
			success: true,
			emailSend: { id: 'send-1' }
		});

		const result = await processPendingSequenceSends(10);

		expect(result).toEqual({
			claimed: 1,
			sent: 1,
			skipped: 0,
			errors: 0
		});
		expect(sendEmailWithTrackingMock).toHaveBeenCalledWith(
			supabase,
			expect.objectContaining({
				plainTextContent: 'Hello',
				sequenceEnrollmentId: 'enrollment-1',
				sequenceStepNumber: 1,
				includeFooter: true
			})
		);
		expect(supabase.rpc).toHaveBeenCalledWith('complete_sequence_send', {
			p_enrollment_id: 'enrollment-1',
			p_email_send_id: 'send-1'
		});
	});

	it('can claim and send a specific enrollment immediately', async () => {
		const supabase = createSupabaseMock({
			specificClaimedRows: [makeRow()]
		});
		getSupabaseAdminClientMock.mockReturnValue(supabase);
		sendEmailWithTrackingMock.mockResolvedValue({
			success: true,
			emailSend: { id: 'send-1' }
		});

		const result = await processSequenceEnrollmentNow('enrollment-1');

		expect(result).toEqual({
			claimed: 1,
			sent: 1,
			skipped: 0,
			errors: 0
		});
		expect(supabase.rpc).toHaveBeenCalledWith('claim_specific_sequence_send', {
			p_enrollment_id: 'enrollment-1'
		});
	});

	it('retries failed sends instead of leaving enrollments stuck in processing', async () => {
		const supabase = createSupabaseMock({
			claimedRows: [makeRow()]
		});
		getSupabaseAdminClientMock.mockReturnValue(supabase);
		sendEmailWithTrackingMock.mockResolvedValue({
			success: false,
			error: 'gmail send failed'
		});

		const result = await processPendingSequenceSends(10);

		expect(result).toEqual({
			claimed: 1,
			sent: 0,
			skipped: 0,
			errors: 1
		});
		expect(supabase.rpc).toHaveBeenCalledWith('retry_or_fail_sequence_send', {
			p_enrollment_id: 'enrollment-1',
			p_error: 'gmail send failed'
		});
	});

	it('marks the enrollment errored if delivery succeeded but sequence advancement failed', async () => {
		const supabase = createSupabaseMock({
			claimedRows: [makeRow()],
			completeError: { message: 'advance failed' }
		});
		getSupabaseAdminClientMock.mockReturnValue(supabase);
		sendEmailWithTrackingMock.mockResolvedValue({
			success: true,
			emailSend: { id: 'send-1' }
		});

		const result = await processPendingSequenceSends(10);

		expect(result).toEqual({
			claimed: 1,
			sent: 0,
			skipped: 0,
			errors: 1
		});
		expect(supabase.from).toHaveBeenCalledWith('email_sequence_enrollments');
		expect(supabase._mocks.update).toHaveBeenCalledWith(
			expect.objectContaining({
				status: 'errored',
				next_send_at: null,
				processing_started_at: null
			})
		);
	});
});
