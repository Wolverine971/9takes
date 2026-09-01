// src/lib/email/sender.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { gmailSend, gmailFactory, jwtConstructor, privateEnv } = vi.hoisted(() => ({
	gmailSend: vi.fn().mockResolvedValue({ data: { id: 'gmail-message-1' } }),
	gmailFactory: vi.fn(),
	jwtConstructor: vi.fn(function MockJwt() {}),
	privateEnv: {
		EMAIL_FOOTER_ADDRESS: '123 Example Street, New York, NY 10001',
		EMAIL_MARKETING_PROVIDER: 'gmail'
	}
}));

vi.mock('$env/static/private', () => ({
	PRIVATE_gmail_private_key: JSON.stringify({ privateKey: 'test-private-key' })
}));
vi.mock('$env/dynamic/private', () => ({ env: privateEnv }));

vi.mock('googleapis', () => {
	gmailFactory.mockReturnValue({ users: { messages: { send: gmailSend } } });
	return {
		google: {
			auth: { JWT: jwtConstructor },
			gmail: gmailFactory
		}
	};
});

import { sendEmail } from './sender';

const TRACKING_ID = '550e8400-e29b-41d4-a716-446655440000';
const LINK_ATTRIBUTION = {
	source: 'reactivation',
	medium: 'email',
	campaign: 'reactivation-sequence',
	content: 'reactivation_dormant_step_3'
};

function lastRawMessage(): string {
	const raw = gmailSend.mock.calls.at(-1)?.[0]?.requestBody?.raw;
	if (!raw) throw new Error('Expected Gmail raw message');
	return Buffer.from(raw, 'base64url').toString();
}

describe('sendEmail link handling', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		gmailSend.mockResolvedValue({ data: { id: 'gmail-message-1' } });
		gmailFactory.mockReturnValue({ users: { messages: { send: gmailSend } } });
		privateEnv.EMAIL_FOOTER_ADDRESS = '123 Example Street, New York, NY 10001';
		privateEnv.EMAIL_MARKETING_PROVIDER = 'gmail';
	});

	it('applies production-equivalent UTMs to untracked admin test sends', async () => {
		const result = await sendEmail({
			to: 'admin@example.com',
			subject: 'Test reactivation message',
			htmlContent: '<p><a href="/questions/example">Open</a></p>',
			plainTextContent: 'Open: https://9takes.com/questions/example',
			linkAttribution: LINK_ATTRIBUTION,
			includeFooter: false
		});
		const rawMessage = lastRawMessage();

		expect(result.success).toBe(true);
		expect(rawMessage).toContain('utm_source=reactivation');
		expect(rawMessage).toContain('utm_medium=email');
		expect(rawMessage).toContain('utm_campaign=reactivation-sequence');
		expect(rawMessage).toContain('utm_content=reactivation_dormant_step_3_link_1');
		expect(rawMessage).not.toContain('/api/track/click/');
	});

	it('wraps both HTML and plain-text destinations for production sends', async () => {
		const result = await sendEmail({
			to: 'recipient@example.com',
			subject: 'Reactivation message',
			htmlContent: '<p><a href="https://9takes.com/questions/example">Open</a></p>',
			plainTextContent: 'Open: https://9takes.com/questions/example',
			trackingId: TRACKING_ID,
			linkAttribution: LINK_ATTRIBUTION,
			includeFooter: false
		});
		const rawMessage = lastRawMessage();

		expect(result.success).toBe(true);
		expect(rawMessage.match(new RegExp(`/api/track/click/${TRACKING_ID}/`, 'g'))).toHaveLength(2);
	});

	it('leaves the template brand link direct and outside sequence-link conclusions', async () => {
		await sendEmail({
			to: 'recipient@example.com',
			subject: 'Welcome message',
			htmlContent: '<p><a href="https://9takes.com/questions/example">Answer</a></p>',
			plainTextContent: 'Answer: https://9takes.com/questions/example',
			trackingId: TRACKING_ID,
			linkAttribution: {
				source: 'welcome',
				medium: 'email',
				campaign: 'welcome-sequence',
				content: 'welcome_sequence_step_1'
			}
		});
		const rawMessage = lastRawMessage();

		expect(rawMessage).toContain('<a href="https://9takes.com"');
		expect(rawMessage).not.toContain('<a href="https://9takes.com?utm_source=welcome');
	});

	it('preserves a conversation-level unsubscribe URL on a tracked transactional email', async () => {
		const unsubscribeUrl =
			'https://9takes.com/api/reply-notifications/unsubscribe/43f280b0-1234-4abc-9def-123456789abc';

		const result = await sendEmail({
			to: 'recipient@example.com',
			subject: 'Someone replied to your take on 9takes',
			htmlContent: '<p><a href="https://9takes.com/questions/example">Read the reply</a></p>',
			plainTextContent: 'Read the reply: https://9takes.com/questions/example',
			trackingId: TRACKING_ID,
			unsubscribeUrl,
			includeFooter: false
		});
		const rawMessage = lastRawMessage();

		expect(result.success).toBe(true);
		expect(rawMessage).toContain(`List-Unsubscribe: <${unsubscribeUrl}>`);
		expect(rawMessage).not.toContain(`/api/track/unsubscribe/${TRACKING_ID}`);
	});

	it('uses the isolated endpoint for marketing one-click headers and keeps the human footer URL', async () => {
		const result = await sendEmail({
			to: 'recipient@example.com',
			subject: 'One question worth answering',
			htmlContent: '<p><a href="https://9takes.com/questions/example">Answer</a></p>',
			trackingId: TRACKING_ID,
			emailKind: 'marketing',
			idempotencyKey: `email-send/${TRACKING_ID}`,
			providerCorrelationId: TRACKING_ID
		});
		const rawMessage = lastRawMessage();

		expect(result.success).toBe(true);
		expect(rawMessage).toContain(
			`List-Unsubscribe: <https://9takes.com/api/one-click-unsubscribe?tracking_id=${TRACKING_ID}>`
		);
		expect(rawMessage).toContain('List-Unsubscribe-Post: List-Unsubscribe=One-Click');
		expect(rawMessage).toContain(`/api/track/unsubscribe/${TRACKING_ID}`);
		expect(rawMessage).toContain(privateEnv.EMAIL_FOOTER_ADDRESS);
	});

	it('fails closed before provider delivery when the marketing postal address is absent', async () => {
		privateEnv.EMAIL_FOOTER_ADDRESS = '';

		const result = await sendEmail({
			to: 'recipient@example.com',
			subject: 'Marketing message',
			htmlContent: '<p>Body</p>',
			trackingId: TRACKING_ID,
			emailKind: 'marketing',
			idempotencyKey: `email-send/${TRACKING_ID}`,
			providerCorrelationId: TRACKING_ID
		});

		expect(result).toMatchObject({
			success: false,
			errorCategory: 'configuration',
			providerAttempted: false
		});
		expect(gmailSend).not.toHaveBeenCalled();
	});

	it('marks rate limiting as a safe retry but treats provider 5xx responses as ambiguous', async () => {
		gmailSend.mockRejectedValueOnce(Object.assign(new Error('rate limited'), { code: 429 }));
		const rateLimited = await sendEmail({
			to: 'recipient@example.com',
			subject: 'Reply',
			htmlContent: '<p>Reply</p>'
		});

		expect(rateLimited).toMatchObject({
			success: false,
			errorCategory: 'provider_rate_limited',
			providerAttempted: true,
			retrySafe: true
		});

		gmailSend.mockRejectedValueOnce(Object.assign(new Error('unavailable'), { code: 503 }));
		const unavailable = await sendEmail({
			to: 'recipient@example.com',
			subject: 'Reply',
			htmlContent: '<p>Reply</p>'
		});

		expect(unavailable).toMatchObject({
			success: false,
			errorCategory: 'provider_unavailable',
			providerAttempted: true,
			retrySafe: false
		});
	});
});
