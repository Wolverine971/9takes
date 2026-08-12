import { beforeEach, describe, expect, it, vi } from 'vitest';

const { gmailSend, gmailFactory, jwtConstructor } = vi.hoisted(() => ({
	gmailSend: vi.fn().mockResolvedValue({ data: { id: 'gmail-message-1' } }),
	gmailFactory: vi.fn(),
	jwtConstructor: vi.fn(function MockJwt() {})
}));

vi.mock('$env/static/private', () => ({
	PRIVATE_gmail_private_key: JSON.stringify({ privateKey: 'test-private-key' })
}));

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
});
