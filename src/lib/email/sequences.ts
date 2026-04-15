// src/lib/email/sequences.ts
import type { EmailRecipient } from '$lib/types/email';
import {
	getManagedSequenceContent,
	WELCOME_SEQUENCE_KEY,
	type WelcomeSequenceContent
} from './welcome-sequence-content';

export { WELCOME_SEQUENCE_KEY };

const QUESTIONS_URL = 'https://9takes.com/questions';
const ASK_QUESTION_URL = 'https://9takes.com/questions/create';
const TOKEN_PATTERN = /{{\s*([a-z0-9_]+)\s*}}/gi;

export type SequenceSendRow = {
	enrollment_id: string;
	sequence_key: string;
	user_id: string;
	recipient_email: string;
	recipient_source: EmailRecipient['source'];
	recipient_source_id: string;
	recipient_name: string | null;
	enneagram: string | null;
	step_number: number;
	subject: string;
	html_content: string;
	plain_text: string | null;
};

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => {
		switch (char) {
			case '&':
				return '&amp;';
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '"':
				return '&quot;';
			case "'":
				return '&#39;';
			default:
				return char;
		}
	});
}

function renderSequenceTemplate(
	template: string,
	values: Record<string, string>,
	options?: { escapeHtmlValues?: boolean }
) {
	const { escapeHtmlValues = false } = options ?? {};

	return template.replace(TOKEN_PATTERN, (match, tokenName: string) => {
		const value = values[tokenName];
		if (value === undefined) {
			return match;
		}

		return escapeHtmlValues ? escapeHtml(value) : value;
	});
}

export function prepareSequenceSend(row: SequenceSendRow) {
	const managedContent = getManagedSequenceContent(row.sequence_key, row.step_number);
	const firstName = row.recipient_name?.trim() || 'there';
	const trimmedRecipientName = row.recipient_name?.trim() || undefined;
	const trimmedEnneagram = row.enneagram?.trim() || undefined;
	const tokens = {
		first_name: firstName,
		email: row.recipient_email,
		questions_url: QUESTIONS_URL,
		ask_question_url: ASK_QUESTION_URL,
		enneagram: trimmedEnneagram || ''
	};
	const subjectTemplate = managedContent?.subject ?? row.subject;
	const htmlTemplate = managedContent?.htmlContent ?? row.html_content;
	const plainTextTemplate = getPlainTextTemplate(managedContent, row.plain_text);

	return {
		recipient: {
			id: row.recipient_source_id,
			email: row.recipient_email,
			name: trimmedRecipientName,
			source: row.recipient_source,
			source_id: row.recipient_source_id,
			enneagram: trimmedEnneagram
		} satisfies EmailRecipient,
		subject: renderSequenceTemplate(subjectTemplate, tokens),
		preheader: managedContent?.preheader
			? renderSequenceTemplate(managedContent.preheader, tokens)
			: undefined,
		htmlContent: renderSequenceTemplate(htmlTemplate, tokens, {
			escapeHtmlValues: true
		}),
		plainText: plainTextTemplate ? renderSequenceTemplate(plainTextTemplate, tokens) : undefined
	};
}

function getPlainTextTemplate(
	managedContent: WelcomeSequenceContent | null,
	dbPlainText: string | null
) {
	return managedContent?.plainText ?? dbPlainText ?? undefined;
}
