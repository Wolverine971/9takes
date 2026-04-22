// src/lib/email/sequences.ts
import type { EmailRecipient } from '$lib/types/email';
import {
	getManagedSequenceContent,
	WELCOME_SEQUENCE_KEY,
	type WelcomeSequenceContent
} from './welcome-sequence-content';
import { TRACKING_ID_PLACEHOLDER } from './base-template';
import {
	getReactivationStep,
	isReactivationSequenceKey,
	REACTIVATION_HERO_URL,
	type ReactivationSequenceContent
} from './reactivation-sequence-content';

export { WELCOME_SEQUENCE_KEY };
export {
	getReactivationSequenceKeyForBucket,
	REACTIVATION_COLD_KEY,
	REACTIVATION_DORMANT_KEY,
	REACTIVATION_ZOMBIES_KEY,
	REACTIVATION_SEQUENCE_KEYS,
	type ReactivationBucket,
	type ReactivationSequenceKey
} from './reactivation-sequence-content';

const QUESTIONS_URL = 'https://9takes.com/questions';
const ASK_QUESTION_URL = 'https://9takes.com/questions/create';
const BASE_URL = 'https://9takes.com';
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
	enrolled_at?: string | null;
	recipient_created_at?: string | null;
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

function getEffectiveManagedSequenceContent(
	sequenceKey: string,
	stepNumber: number
): WelcomeSequenceContent | ReactivationSequenceContent | null {
	if (isReactivationSequenceKey(sequenceKey)) {
		return getReactivationStep(sequenceKey, stepNumber);
	}

	return getManagedSequenceContent(sequenceKey, stepNumber);
}

function parseDate(value: string | null | undefined): Date | null {
	if (!value) {
		return null;
	}

	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatMonthYear(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(date);
}

function formatYear(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		timeZone: 'UTC'
	}).format(date);
}

function monthsBetween(startDate: Date, endDate: Date): number {
	const startYear = startDate.getUTCFullYear();
	const startMonth = startDate.getUTCMonth();
	const startDay = startDate.getUTCDate();
	const endYear = endDate.getUTCFullYear();
	const endMonth = endDate.getUTCMonth();
	const endDay = endDate.getUTCDate();
	const rawMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
	const adjustedMonths = endDay < startDay ? rawMonths - 1 : rawMonths;
	return Math.max(adjustedMonths, 0);
}

export function prepareSequenceSend(row: SequenceSendRow) {
	const managedContent = getEffectiveManagedSequenceContent(row.sequence_key, row.step_number);
	const firstName = row.recipient_name?.trim() || 'there';
	const trimmedRecipientName = row.recipient_name?.trim() || undefined;
	const trimmedEnneagram = row.enneagram?.trim() || undefined;
	const signupDate =
		parseDate(row.recipient_created_at) ?? parseDate(row.enrolled_at) ?? new Date();
	const tokens = {
		first_name: firstName,
		email: row.recipient_email,
		questions_url: QUESTIONS_URL,
		ask_question_url: ASK_QUESTION_URL,
		enneagram: trimmedEnneagram || '',
		signup_month_year: formatMonthYear(signupDate),
		signup_year: formatYear(signupDate),
		signup_months_ago: String(monthsBetween(signupDate, new Date())),
		hero_url: REACTIVATION_HERO_URL,
		re_permission_yes_url: `${BASE_URL}/api/email/re-permission/yes/${TRACKING_ID_PLACEHOLDER}`,
		re_permission_no_url: `${BASE_URL}/api/email/re-permission/no/${TRACKING_ID_PLACEHOLDER}`
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
	managedContent: WelcomeSequenceContent | ReactivationSequenceContent | null,
	dbPlainText: string | null
) {
	return managedContent?.plainText ?? dbPlainText ?? undefined;
}
