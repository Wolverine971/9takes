// src/lib/email/sequences.spec.ts
import { describe, expect, it } from 'vitest';
import { prepareSequenceSend, type SequenceSendRow } from './sequences';

function makeSequenceRow(overrides: Partial<SequenceSendRow> = {}): SequenceSendRow {
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
		subject: 'Welcome, {{first_name}}',
		html_content:
			'<p>Hello {{first_name}}</p><a href="{{questions_url}}">Browse</a><p>{{unknown_token}}</p>',
		plain_text: 'Hi {{first_name}} - {{ask_question_url}}',
		...overrides
	};
}

describe('prepareSequenceSend', () => {
	it('renders supported tokens into outbound message content', () => {
		const prepared = prepareSequenceSend(makeSequenceRow());

		expect(prepared.subject).toBe('Welcome, Alice');
		expect(prepared.htmlContent).toContain('<p>Hello Alice</p>');
		expect(prepared.htmlContent).toContain('https://9takes.com/questions');
		expect(prepared.plainText).toBe('Hi Alice - https://9takes.com/questions/create');
		expect(prepared.recipient).toEqual(
			expect.objectContaining({
				email: 'alice@example.com',
				name: 'Alice',
				source: 'profiles',
				source_id: 'user-1',
				enneagram: '5'
			})
		);
	});

	it('escapes injected html values and preserves unknown tokens', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				recipient_name: '<script>alert(1)</script>'
			})
		);

		expect(prepared.subject).toBe('Welcome, <script>alert(1)</script>');
		expect(prepared.htmlContent).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
		expect(prepared.htmlContent).toContain('{{unknown_token}}');
	});

	it('falls back to "there" when no recipient name is available', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				recipient_name: null
			})
		);

		expect(prepared.subject).toBe('Welcome, there');
		expect(prepared.recipient.name).toBeUndefined();
	});

	it('treats whitespace-only names as missing recipient metadata', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				recipient_name: '   '
			})
		);

		expect(prepared.subject).toBe('Welcome, there');
		expect(prepared.recipient.name).toBeUndefined();
	});
});
