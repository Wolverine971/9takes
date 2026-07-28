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

	const [unsubscribesResult, legacySignupsResult] = await Promise.all([
		supabase
			.from('email_unsubscribes')
			.select('email, reason, source, source_id, unsubscribed_at')
			.in('email', normalizedEmails),
		supabase
			.from('signups')
			.select('email, unsubscribed_date')
			.in('email', normalizedEmails)
			.not('unsubscribed_date', 'is', null)
	]);

	const byEmail = new Map<string, EmailSuppressionStatus>();

	for (const row of (legacySignupsResult.data ?? []) as LegacySignupRow[]) {
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

	for (const row of (unsubscribesResult.data ?? []) as EmailUnsubscribeRow[]) {
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
		error: unsubscribesResult.error || legacySignupsResult.error || null
	};
}
