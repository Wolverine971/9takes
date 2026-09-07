// src/routes/admin/host-desk/+page.server.ts
//
// Admin view of the host reply desk: every pending draft with inline post and
// skip, the last 30 days of history, and a "Run digest now" button that calls
// runHostDigest directly so DJ can test the whole loop from the browser.
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { guardAdminActions, requireAdmin } from '$lib/server/adminAuth';
import {
	describeAuthorType,
	enrichHostDrafts,
	HOST_REPLY_MAX_CHARS,
	resolveHostUserId,
	runHostDigest,
	type HostDeskDraft,
	type HostReplyDraftRow
} from '$lib/server/hostDigest';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

const HISTORY_DAYS = 30;

export type AdminHostDeskDraft = HostDeskDraft & {
	authorLabel: string;
	questionHref: string | null;
};

function decorate(draft: HostDeskDraft): AdminHostDeskDraft {
	return {
		...draft,
		authorLabel: draft.take ? describeAuthorType(draft.take) : 'unknown',
		questionHref: draft.question?.url
			? `/questions/${encodeURIComponent(draft.question.url)}`
			: null
	};
}

function requiredInteger(value: FormDataEntryValue | null): number | null {
	if (typeof value !== 'string') return null;
	const parsed = Number.parseInt(value, 10);
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event.locals);
	const admin = getSupabaseAdminClient() as any;
	const historySince = new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000).toISOString();

	const [pendingResult, historyResult] = await Promise.all([
		admin
			.from('host_reply_drafts')
			.select('*')
			.eq('status', 'pending')
			.order('created_at', { ascending: false })
			.limit(100),
		admin
			.from('host_reply_drafts')
			.select('*')
			.neq('status', 'pending')
			.gte('updated_at', historySince)
			.order('updated_at', { ascending: false })
			.limit(100)
	]);

	const firstError = [pendingResult.error, historyResult.error].find(Boolean);
	if (firstError) {
		console.error('Failed to load host desk', { error: firstError });
		throw error(500, 'Failed to load the host desk');
	}

	const pendingRows = (pendingResult.data ?? []) as HostReplyDraftRow[];
	const historyRows = (historyResult.data ?? []) as HostReplyDraftRow[];
	const enriched = await enrichHostDrafts(admin, [...pendingRows, ...historyRows]);
	const byId = new Map(enriched.map((draft) => [draft.id, decorate(draft)]));

	return {
		pending: pendingRows.map((row) => byId.get(row.id)).filter(Boolean) as AdminHostDeskDraft[],
		history: historyRows.map((row) => byId.get(row.id)).filter(Boolean) as AdminHostDeskDraft[],
		hostUserId: resolveHostUserId(),
		historyDays: HISTORY_DAYS
	};
};

const actionHandlers: Actions = {
	markLowEffort: async ({ request }) => {
		const form = await request.formData();
		const draftId = requiredInteger(form.get('draftId'));
		if (!draftId) return fail(400, { action: 'markLowEffort', message: 'Missing draft id.' });
		const { error: updateError } = await (getSupabaseAdminClient() as any)
			.from('host_reply_drafts')
			.update({
				low_effort: form.get('lowEffort') === 'true',
				updated_at: new Date().toISOString()
			})
			.eq('id', draftId);
		if (updateError)
			return fail(500, { action: 'markLowEffort', message: 'Could not update the quality flag.' });
		return { action: 'markLowEffort', success: true, message: 'Quality flag updated.' };
	},
	post: async ({ request, getClientAddress }) => {
		const formData = await request.formData();
		const draftId = requiredInteger(formData.get('draftId'));
		const text =
			typeof formData.get('text') === 'string' ? String(formData.get('text')).trim() : '';

		if (!draftId) return fail(400, { action: 'post', message: 'Missing draft id.' });
		if (!text) return fail(400, { action: 'post', draftId, message: 'Write something first.' });
		if (text.length > HOST_REPLY_MAX_CHARS) {
			return fail(400, {
				action: 'post',
				draftId,
				message: `Keep it under ${HOST_REPLY_MAX_CHARS} characters.`
			});
		}

		let ip: string | null;
		try {
			ip = getClientAddress();
		} catch {
			ip = null;
		}

		const admin = getSupabaseAdminClient() as any;
		const { data: commentId, error: rpcError } = await admin.rpc('post_host_reply', {
			p_draft_id: draftId,
			p_host_user_id: resolveHostUserId(),
			p_text: text,
			p_ip: ip
		});
		if (rpcError || !commentId) {
			console.error('Admin host reply post failed', { draftId, error: rpcError });
			return fail(500, { action: 'post', draftId, message: 'Could not post that reply.' });
		}

		return {
			action: 'post',
			success: true,
			draftId,
			message: `Posted as comment #${commentId}.`
		};
	},

	skip: async ({ request }) => {
		const formData = await request.formData();
		const draftId = requiredInteger(formData.get('draftId'));
		if (!draftId) return fail(400, { action: 'skip', message: 'Missing draft id.' });

		const admin = getSupabaseAdminClient() as any;
		const { error: rpcError } = await admin.rpc('skip_host_reply', { p_draft_id: draftId });
		if (rpcError) {
			console.error('Admin host reply skip failed', { draftId, error: rpcError });
			return fail(500, { action: 'skip', draftId, message: 'Could not skip that draft.' });
		}

		return { action: 'skip', success: true, draftId, message: 'Skipped.' };
	},

	runDigest: async () => {
		try {
			const summary = await runHostDigest();
			const message = summary.sent
				? `Digest sent to ${summary.recipient}: ${summary.drafted} new draft${summary.drafted === 1 ? '' : 's'}${summary.carriedOver ? `, ${summary.carriedOver} carried over` : ''}.`
				: summary.error
					? `Digest not sent: ${summary.error}`
					: `No new takes since ${summary.since}. Nothing sent.`;
			return { action: 'runDigest', success: summary.sent || !summary.error, message, summary };
		} catch (runError) {
			console.error('Manual host digest run failed', runError);
			return fail(500, { action: 'runDigest', message: 'Digest run failed. Check the logs.' });
		}
	}
};

export const actions = guardAdminActions(actionHandlers);
