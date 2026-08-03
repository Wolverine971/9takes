// src/lib/server/emailSuppressionStatus.ts
import { normalizeEmail } from '$lib/email/suppression';

export type EmailSuppressionStatus = {
	email: string;
	reason: string | null;
	source: string | null;
	sourceId: string | null;
	unsubscribedAt: string | null;
};

export type EmailSuppressionLookup = {
	byEmail: Map<string, EmailSuppressionStatus>;
	error: unknown | null;
};

type EmailUnsubscribeRow = {
	email: string | null;
	reason: string | null;
	source: string | null;
	source_id: string | null;
	unsubscribed_at: string | null;
};

type LegacySignupRow = {
	email: string | null;
	unsubscribed_date: string | null;
};

const QUERY_BATCH_SIZE = 200;

function isLater(candidate: string | null, current: string | null): boolean {
	if (!candidate) return false;
	if (!current) return true;
	return new Date(candidate).getTime() > new Date(current).getTime();
}

export async function loadEmailSuppressionStatus(
	supabase: any,
	emails: Array<string | null | undefined>
): Promise<EmailSuppressionLookup> {
	const normalizedEmails = [
		...new Set(emails.map((email) => normalizeEmail(email)).filter(Boolean))
	];

	if (normalizedEmails.length === 0) {
		return { byEmail: new Map(), error: null };
	}

	const unsubscribeRows: EmailUnsubscribeRow[] = [];
	const legacySignupRows: LegacySignupRow[] = [];
	let queryError: unknown | null = null;

	for (let index = 0; index < normalizedEmails.length; index += QUERY_BATCH_SIZE) {
		const emailBatch = normalizedEmails.slice(index, index + QUERY_BATCH_SIZE);
		const [unsubscribesResult, legacySignupsResult] = await Promise.all([
			supabase
				.from('email_unsubscribes')
				.select('email, reason, source, source_id, unsubscribed_at')
				.in('email', emailBatch),
			supabase
				.from('signups')
				.select('email, unsubscribed_date')
				.in('email', emailBatch)
				.not('unsubscribed_date', 'is', null)
		]);

		queryError = unsubscribesResult.error || legacySignupsResult.error || null;
		if (queryError) break;

		unsubscribeRows.push(...((unsubscribesResult.data ?? []) as EmailUnsubscribeRow[]));
		legacySignupRows.push(...((legacySignupsResult.data ?? []) as LegacySignupRow[]));
	}

	const byEmail = new Map<string, EmailSuppressionStatus>();

	for (const row of legacySignupRows) {
		const email = normalizeEmail(row.email);
		if (!email || !row.unsubscribed_date) continue;

		byEmail.set(email, {
			email,
			reason: 'Legacy signup opt-out',
			source: 'signups',
			sourceId: null,
			unsubscribedAt: row.unsubscribed_date
		});
	}

	for (const row of unsubscribeRows) {
		const email = normalizeEmail(row.email);
		if (!email) continue;

		const current = byEmail.get(email);
		if (current && !isLater(row.unsubscribed_at, current.unsubscribedAt)) continue;

		byEmail.set(email, {
			email,
			reason: row.reason,
			source: row.source,
			sourceId: row.source_id,
			unsubscribedAt: row.unsubscribed_at
		});
	}

	return {
		byEmail,
		error: queryError
	};
}
