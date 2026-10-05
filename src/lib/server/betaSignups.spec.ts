// src/lib/server/betaSignups.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SendEmailOptions, SendEmailResult } from '$lib/email/sender';

const { loggerMocks } = vi.hoisted(() => ({
	loggerMocks: { error: vi.fn(), warn: vi.fn(), info: vi.fn() }
}));

vi.mock('$env/dynamic/private', () => ({
	env: { PRIVATE_ADMIN_EMAIL: 'admin@9takes.com', PRIVATE_SIGNUP_KEY: 'test-salt' }
}));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: vi.fn() }));
vi.mock('$lib/email/sender', () => ({ sendEmail: vi.fn() }));
vi.mock('$lib/utils/logger', () => ({ logger: loggerMocks }));

import { createBetaSignup, type CreateBetaSignupInput } from './betaSignups';

type Row = Record<string, any>;

// Just enough of the PostgREST builder for betaSignups.ts.
function createFakeSupabase(
	options: {
		waitlist?: Row[];
		insertError?: { code?: string; message?: string } | null;
		metadataError?: { message: string } | null;
	} = {}
) {
	const waitlist = [...(options.waitlist ?? [])];
	const metadata: Row[] = [];
	const supabase = {
		from(table: string) {
			if (table === 'coaching_waitlist') {
				return {
					select: () => ({
						eq: (_column: string, email: string) => ({
							maybeSingle: async () => ({
								data: waitlist.find((row) => row.email === email) ?? null,
								error: null
							})
						})
					}),
					insert: (row: Row) => ({
						select: () => ({
							single: async () => {
								if (options.insertError) return { data: null, error: options.insertError };
								const saved = { id: `w-${waitlist.length + 1}`, flagged_reason: null, ...row };
								waitlist.push(saved);
								return { data: { id: saved.id }, error: null };
							}
						})
					})
				};
			}
			if (table === 'coaching_waitlist_metadata') {
				return {
					insert: async (row: Row) => {
						if (options.metadataError) return { error: options.metadataError };
						metadata.push(row);
						return { error: null };
					}
				};
			}
			throw new Error(`unexpected table ${table}`);
		}
	};
	return { supabase, waitlist, metadata };
}

function input(overrides: Partial<CreateBetaSignupInput> = {}): CreateBetaSignupInput {
	return {
		email: 'Reader@Example.com ',
		surface: 'celebrity',
		placement: 'inline',
		sourcePath: '/personality-analysis/taylor-swift',
		userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15',
		clientAddress: '203.0.113.7',
		...overrides
	};
}

describe('createBetaSignup', () => {
	let send: ReturnType<typeof vi.fn<(options: SendEmailOptions) => Promise<SendEmailResult>>>;

	beforeEach(() => {
		vi.clearAllMocks();
		send = vi.fn(async () => ({ success: true }) as SendEmailResult);
	});

	it('adds a new person to the waitlist, records the card and page, and alerts DJ', async () => {
		const fake = createFakeSupabase();

		const result = await createBetaSignup(input(), {
			supabase: fake.supabase,
			sendEmail: send,
			bookingUrl: 'https://booking.example/beta'
		});

		expect(result).toEqual({ ok: true, alerted: true, recorded: true });
		expect(fake.waitlist).toEqual([
			expect.objectContaining({ email: 'reader@example.com', name: '' })
		]);
		expect(fake.metadata).toEqual([
			expect.objectContaining({
				waitlist_id: 'w-1',
				source: 'beta_card',
				utm_campaign: 'experimental_therapy',
				utm_medium: 'inline',
				utm_content: '/personality-analysis/taylor-swift'
			})
		]);
		// The raw IP is never stored.
		expect(fake.metadata[0].ip_address).not.toContain('203.0.113.7');

		expect(send).toHaveBeenCalledTimes(1);
		const alert = send.mock.calls[0][0];
		expect(alert.to).toBe('admin@9takes.com');
		expect(alert.subject).toBe('Beta signup: reader@example.com');
		expect(alert.emailKind).toBe('transactional');
		expect(alert.htmlContent).toContain('https://mail.google.com/mail/?');
		expect(alert.htmlContent).toContain(encodeURIComponent('reader@example.com'));
		expect(alert.htmlContent).not.toContain('PRIVATE_BETA_BOOKING_URL');
	});

	it('tags the signup with the card copy they saw', async () => {
		const fake = createFakeSupabase();

		await createBetaSignup(input({ variant: 'read_like_this' }), {
			supabase: fake.supabase,
			sendEmail: send
		});

		expect(fake.metadata[0].utm_campaign).toBe('experimental_therapy:read_like_this');
		expect(send.mock.calls[0][0].htmlContent).toContain('read_like_this');
	});

	it('never emails the visitor: the only message goes to DJ', async () => {
		const fake = createFakeSupabase();
		await createBetaSignup(input(), { supabase: fake.supabase, sendEmail: send });

		for (const [options] of send.mock.calls) {
			expect(options.to).toBe('admin@9takes.com');
		}
	});

	it('warns DJ in the alert when the booking link is not configured', async () => {
		const fake = createFakeSupabase();
		await createBetaSignup(input(), { supabase: fake.supabase, sendEmail: send, bookingUrl: null });

		expect(send.mock.calls[0][0].htmlContent).toContain('PRIVATE_BETA_BOOKING_URL');
	});

	it('alerts again, marked as a repeat, when someone already on the waitlist asks', async () => {
		const fake = createFakeSupabase({
			waitlist: [
				{
					id: 'w-ryan',
					email: 'reader@example.com',
					flagged_reason: null,
					created_at: '2026-04-06T10:00:00Z'
				}
			]
		});

		const result = await createBetaSignup(input(), { supabase: fake.supabase, sendEmail: send });

		expect(result).toEqual({ ok: true, alerted: true, recorded: true });
		expect(fake.waitlist).toHaveLength(1);
		expect(fake.metadata[0].waitlist_id).toBe('w-ryan');
		expect(send.mock.calls[0][0].htmlContent).toContain(
			'already on the waitlist (since 2026-04-06)'
		);
	});

	it('answers bot-flagged addresses the same way but records and alerts nothing', async () => {
		const fake = createFakeSupabase({
			waitlist: [
				{ id: 'w-bot', email: 'reader@example.com', flagged_reason: 'bot_signup_wave_2025_11' }
			]
		});

		const result = await createBetaSignup(input(), { supabase: fake.supabase, sendEmail: send });

		expect(result).toEqual({ ok: true, alerted: false, recorded: false });
		expect(fake.metadata).toHaveLength(0);
		expect(send).not.toHaveBeenCalled();
	});

	it('rejects malformed and throwaway addresses before touching the database', async () => {
		const fake = createFakeSupabase();

		const bad = await createBetaSignup(input({ email: 'not-an-email' }), {
			supabase: fake.supabase,
			sendEmail: send
		});
		const disposable = await createBetaSignup(input({ email: 'x@mailinator.com' }), {
			supabase: fake.supabase,
			sendEmail: send
		});

		expect(bad).toMatchObject({ ok: false, status: 400 });
		expect(disposable).toMatchObject({ ok: false, status: 400 });
		expect(fake.waitlist).toHaveLength(0);
		expect(send).not.toHaveBeenCalled();
	});

	it('keeps the signup when the alert email fails', async () => {
		const fake = createFakeSupabase();
		send.mockResolvedValueOnce({ success: false, error: 'gmail down' } as SendEmailResult);

		const result = await createBetaSignup(input(), { supabase: fake.supabase, sendEmail: send });

		expect(result).toEqual({ ok: true, alerted: false, recorded: true });
		expect(fake.waitlist).toHaveLength(1);
	});

	it('keeps the signup when the metadata row fails to save', async () => {
		const fake = createFakeSupabase({ metadataError: { message: 'boom' } });

		const result = await createBetaSignup(input(), { supabase: fake.supabase, sendEmail: send });

		expect(result).toEqual({ ok: true, alerted: true, recorded: true });
		expect(fake.waitlist).toHaveLength(1);
	});

	it('reports a failure when the waitlist row cannot be saved', async () => {
		const fake = createFakeSupabase({ insertError: { code: '500', message: 'db down' } });

		const result = await createBetaSignup(input(), { supabase: fake.supabase, sendEmail: send });

		expect(result).toMatchObject({ ok: false, status: 500 });
		expect(send).not.toHaveBeenCalled();
	});

	it('skips the alert quietly when no admin address is configured', async () => {
		const fake = createFakeSupabase();

		const result = await createBetaSignup(input(), {
			supabase: fake.supabase,
			sendEmail: send,
			alertAddress: null
		});

		expect(result).toEqual({ ok: true, alerted: false, recorded: true });
		expect(send).not.toHaveBeenCalled();
	});
});
