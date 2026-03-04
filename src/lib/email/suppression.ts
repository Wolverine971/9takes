// src/lib/email/suppression.ts
// Shared helpers for email suppression checks (unsubscribe safety)

export function normalizeEmail(email: string | null | undefined): string {
	return (email || '').trim().toLowerCase();
}

function uniqueNormalizedEmails(emails: Array<string | null | undefined>): string[] {
	return [...new Set(emails.map((email) => normalizeEmail(email)).filter(Boolean))];
}

export async function getSuppressedEmailSet(
	supabase: any,
	emails: Array<string | null | undefined>
): Promise<Set<string>> {
	const normalized = uniqueNormalizedEmails(emails);
	if (normalized.length === 0) {
		return new Set<string>();
	}

	// Preferred path: DB helper function with normalized matching across suppression sources.
	try {
		const { data, error } = await supabase.rpc('get_suppressed_emails', {
			p_emails: normalized
		});

		if (!error && Array.isArray(data)) {
			return new Set(
				data
					.map((row: { email?: string | null }) => normalizeEmail(row.email))
					.filter((email) => email.length > 0)
			);
		}
	} catch (e) {
		console.warn('Suppression RPC unavailable, falling back to direct suppression lookup', e);
	}

	// Fallback path if migration/function is not yet applied.
	const targetSet = new Set(normalized);
	const suppressed = new Set<string>();

	const [unsubscribesResult, legacySignupsResult] = await Promise.all([
		supabase.from('email_unsubscribes').select('email'),
		supabase.from('signups').select('email').not('unsubscribed_date', 'is', null)
	]);

	for (const row of unsubscribesResult.data || []) {
		const email = normalizeEmail((row as { email?: string | null }).email);
		if (targetSet.has(email)) {
			suppressed.add(email);
		}
	}

	for (const row of legacySignupsResult.data || []) {
		const email = normalizeEmail((row as { email?: string | null }).email);
		if (targetSet.has(email)) {
			suppressed.add(email);
		}
	}

	return suppressed;
}
