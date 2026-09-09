// src/lib/server/emailDeliveryHealth.spec.ts
import { describe, expect, it, vi } from 'vitest';
import { getEmailDeliveryConfiguration, loadEmailDeliveryHealth } from './emailDeliveryHealth';

describe('email delivery health', () => {
	it('does not consider a provider configured without a mailing address', () => {
		expect(
			getEmailDeliveryConfiguration({
				PRIVATE_gmail_private_key: 'configured',
				EMAIL_FOOTER_ADDRESS: ' '
			})
		).toMatchObject({ configured: false, provider: 'gmail' });
	});

	it('requires credentials for the selected provider', () => {
		expect(
			getEmailDeliveryConfiguration({
				EMAIL_FOOTER_ADDRESS: 'A valid mailing address',
				EMAIL_MARKETING_PROVIDER: 'resend',
				RESEND_MARKETING_FROM: 'DJ <usersup@9takes.com>'
			}).configured
		).toBe(false);
		expect(
			getEmailDeliveryConfiguration({
				EMAIL_FOOTER_ADDRESS: 'A valid mailing address',
				EMAIL_MARKETING_PROVIDER: 'resend',
				RESEND_API_KEY: 'configured',
				RESEND_MARKETING_FROM: 'DJ <usersup@9takes.com>'
			}).configured
		).toBe(true);
		expect(
			getEmailDeliveryConfiguration({
				EMAIL_FOOTER_ADDRESS: 'A valid mailing address',
				PRIVATE_gmail_private_key: 'configured'
			}).configured
		).toBe(true);
	});

	it('reports only stopped enrollments in active sequences', async () => {
		const query: any = {
			select: vi.fn(() => query),
			eq: vi.fn(() => query),
			then: (resolve: (value: unknown) => unknown) =>
				Promise.resolve({ count: 4, error: null }).then(resolve)
		};
		const supabase = { from: vi.fn(() => query) };
		expect(await loadEmailDeliveryHealth(supabase)).toMatchObject({ stoppedEnrollments: 4 });
		expect(query.eq).toHaveBeenCalledWith('status', 'errored');
		expect(query.eq).toHaveBeenCalledWith('email_sequences.status', 'active');
	});
});
