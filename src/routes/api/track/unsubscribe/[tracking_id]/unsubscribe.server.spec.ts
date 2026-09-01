// src/routes/api/track/unsubscribe/[tracking_id]/unsubscribe.server.spec.ts
import { describe, expect, it, vi } from 'vitest';

const {
	exitWelcomeSequenceForEmailMock,
	exitReactivationSequencesForEmailMock,
	getSupabaseAdminClientMock
} = vi.hoisted(() => ({
	exitWelcomeSequenceForEmailMock: vi.fn(),
	exitReactivationSequencesForEmailMock: vi.fn(),
	getSupabaseAdminClientMock: vi.fn()
}));

vi.mock('$lib/server/emailSequences', () => ({
	exitWelcomeSequenceForEmail: exitWelcomeSequenceForEmailMock,
	exitReactivationSequencesForEmail: exitReactivationSequencesForEmailMock
}));
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: getSupabaseAdminClientMock
}));

import { GET, POST } from './+server';

function createSupabaseStub() {
	return {
		from: vi.fn(),
		rpc: vi.fn()
	};
}

describe('/api/track/unsubscribe/[tracking_id]', () => {
	it('returns 404 for malformed tracking IDs without querying Supabase on GET', async () => {
		const supabase = createSupabaseStub();
		getSupabaseAdminClientMock.mockReturnValue(supabase);

		await expect(
			GET({
				params: { tracking_id: 'YmU2ZTI1Yz' },
				locals: { supabase }
			} as any)
		).rejects.toMatchObject({ status: 404 });

		expect(supabase.from).not.toHaveBeenCalled();
		expect(supabase.rpc).not.toHaveBeenCalled();
	});

	it('returns 404 for malformed tracking IDs without calling the unsubscribe RPC on POST', async () => {
		const supabase = createSupabaseStub();
		getSupabaseAdminClientMock.mockReturnValue(supabase);

		await expect(
			POST({
				params: { tracking_id: 'NDNmMjgwYj' },
				request: new Request('https://9takes.com/api/track/unsubscribe/NDNmMjgwYj', {
					method: 'POST'
				}),
				locals: { supabase }
			} as any)
		).rejects.toMatchObject({ status: 404 });

		expect(supabase.from).not.toHaveBeenCalled();
		expect(supabase.rpc).not.toHaveBeenCalled();
		expect(exitWelcomeSequenceForEmailMock).not.toHaveBeenCalled();
		expect(exitReactivationSequencesForEmailMock).not.toHaveBeenCalled();
	});

	it('exits welcome and reactivation flows immediately after an unsubscribe', async () => {
		const recipientEmail = 'person@example.com';
		const supabase = {
			from: vi.fn(),
			rpc: vi.fn().mockResolvedValue({ data: recipientEmail, error: null })
		};
		getSupabaseAdminClientMock.mockReturnValue(supabase);
		exitWelcomeSequenceForEmailMock.mockResolvedValue(1);
		exitReactivationSequencesForEmailMock.mockResolvedValue(1);

		const response = await POST({
			params: { tracking_id: '43f280b0-1234-4abc-9def-123456789abc' },
			request: new Request(
				'https://9takes.com/api/track/unsubscribe/43f280b0-1234-4abc-9def-123456789abc',
				{ method: 'POST', headers: { accept: 'application/json' } }
			),
			locals: { supabase }
		} as any);

		expect(response.status).toBe(200);
		expect(exitWelcomeSequenceForEmailMock).toHaveBeenCalledWith(recipientEmail, 'unsubscribed');
		expect(exitReactivationSequencesForEmailMock).toHaveBeenCalledWith(
			recipientEmail,
			'unsubscribed'
		);
	});

	it('treats missing valid tracking IDs as 404 without logging a lookup error', async () => {
		const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
		const lookupQuery = {
			select: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			maybeSingle
		};
		const supabase = {
			from: vi.fn(() => lookupQuery),
			rpc: vi.fn()
		};
		getSupabaseAdminClientMock.mockReturnValue(supabase);
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		try {
			await expect(
				GET({
					params: { tracking_id: '43f280b0-1234-4abc-9def-123456789abc' },
					locals: { supabase }
				} as any)
			).rejects.toMatchObject({ status: 404 });
		} finally {
			consoleError.mockRestore();
		}

		expect(supabase.from).toHaveBeenCalledWith('email_sends');
		expect(lookupQuery.eq).toHaveBeenCalledWith(
			'tracking_id',
			'43f280b0-1234-4abc-9def-123456789abc'
		);
		expect(maybeSingle).toHaveBeenCalled();
		expect(consoleError).not.toHaveBeenCalled();
	});
});
