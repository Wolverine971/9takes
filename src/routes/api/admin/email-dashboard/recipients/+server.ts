// src/routes/api/admin/email-dashboard/recipients/+server.ts
// Fetch full recipient batches for selected sources (deduped by email)

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { EmailRecipient, RecipientSource } from '$lib/types/email';

const ALL_SOURCES: RecipientSource[] = ['profiles', 'signups', 'coaching_waitlist'];
const PAGE_SIZE = 1000;

type DashboardUserRow = {
	id: string;
	email: string;
	name: string | null;
	source: RecipientSource;
	created_at: string;
	enneagram: string | null;
	unsubscribed: boolean;
};

async function fetchAllSourceRecipients(
	supabase: any,
	source: RecipientSource
): Promise<DashboardUserRow[]> {
	const rows: DashboardUserRow[] = [];
	let offset = 0;
	let hasMore = true;

	while (hasMore) {
		const { data, error: usersError } = await supabase.rpc('get_email_dashboard_users', {
			p_source: source,
			p_search: undefined,
			p_limit: PAGE_SIZE,
			p_offset: offset
		});

		if (usersError) {
			console.error(`Error fetching recipients for ${source}:`, usersError);
			throw error(500, 'Failed to fetch recipients');
		}

		const batch = (data || []) as DashboardUserRow[];
		rows.push(...batch);
		hasMore = batch.length === PAGE_SIZE;
		offset += PAGE_SIZE;
	}

	return rows;
}

function parseRequestedSources(raw: string | null): RecipientSource[] {
	if (!raw || !raw.trim()) {
		return [...ALL_SOURCES];
	}

	const parsed = raw
		.split(',')
		.map((value) => value.trim())
		.filter((value): value is RecipientSource => ALL_SOURCES.includes(value as RecipientSource));

	if (parsed.length === 0) {
		return [...ALL_SOURCES];
	}

	return [...new Set(parsed)];
}

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	const requestedSources = parseRequestedSources(url.searchParams.get('sources'));

	try {
		const sourceResults = await Promise.all(
			requestedSources.map((source) => fetchAllSourceRecipients(supabase, source))
		);
		const allRows = sourceResults.flat();

		let unsubscribedExcluded = 0;
		let activeRows = 0;
		const dedupedByEmail = new Map<string, EmailRecipient>();

		for (const row of allRows) {
			if (row.unsubscribed) {
				unsubscribedExcluded++;
				continue;
			}

			activeRows++;
			const normalizedEmail = row.email?.trim().toLowerCase();
			if (!normalizedEmail) continue;

			if (dedupedByEmail.has(normalizedEmail)) {
				continue;
			}

			dedupedByEmail.set(normalizedEmail, {
				id: row.id,
				email: row.email,
				name: row.name || undefined,
				source: row.source,
				source_id: row.id,
				enneagram: row.enneagram || undefined,
				unsubscribed: false,
				created_at: row.created_at
			});
		}

		const recipients = [...dedupedByEmail.values()];
		const duplicatesRemoved = activeRows - recipients.length;

		return json({
			recipients,
			meta: {
				requested_sources: requestedSources,
				total_rows: allRows.length,
				active_rows: activeRows,
				unsubscribed_excluded: unsubscribedExcluded,
				duplicates_removed: duplicatesRemoved,
				final_recipients: recipients.length
			}
		});
	} catch (e) {
		console.error('Error in batch recipients GET:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Failed to fetch recipients');
	}
};
