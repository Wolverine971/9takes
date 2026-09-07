// src/routes/host-desk/[token]/+page.server.ts
//
// One-tap host reply page. The signed token in the URL is the only credential
// (DJ opens this from the digest email, often logged out, on his phone).
//
// GET never writes anything: email prefetchers and link scanners hit this URL,
// so it only renders the draft. Posting and skipping are POST form actions
// that re-verify the token and call the service-role RPCs, which are
// idempotent per draft.
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	describeAuthorType,
	enrichHostDrafts,
	HOST_REPLY_MAX_CHARS,
	resolveHostUserId,
	verifyHostDeskToken,
	type HostDeskDraft,
	type HostDeskVariant,
	type HostReplyDraftRow
} from '$lib/server/hostDigest';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

export type HostDeskPageDraft = {
	id: number;
	status: HostDeskDraft['status'];
	draftA: string;
	draftB: string;
	postedText: string | null;
	postedCommentId: number | null;
	take: HostDeskDraft['take'];
	authorLabel: string;
	question: HostDeskDraft['question'];
	questionHref: string | null;
};

type HostDeskPageData =
	| { state: 'invalid' }
	| { state: 'missing' }
	| { state: 'ready'; variant: HostDeskVariant; draft: HostDeskPageDraft; initialText: string };

async function loadDraft(draftId: number): Promise<HostDeskDraft | null> {
	const admin = getSupabaseAdminClient() as any;
	const { data, error } = await admin
		.from('host_reply_drafts')
		.select('*')
		.eq('id', draftId)
		.maybeSingle();
	if (error || !data) return null;
	const [draft] = await enrichHostDrafts(admin, [data as HostReplyDraftRow]);
	return draft ?? null;
}

function toPageDraft(draft: HostDeskDraft): HostDeskPageDraft {
	return {
		id: draft.id,
		status: draft.status,
		draftA: draft.draft_a,
		draftB: draft.draft_b,
		postedText: draft.posted_text,
		postedCommentId: draft.posted_comment_id,
		take: draft.take,
		authorLabel: draft.take ? describeAuthorType(draft.take) : 'unknown',
		question: draft.question,
		questionHref: draft.question?.url
			? `/questions/${encodeURIComponent(draft.question.url)}`
			: null
	};
}

function initialTextFor(draft: HostDeskDraft, variant: HostDeskVariant): string {
	if (variant === 'a') return draft.draft_a;
	if (variant === 'b') return draft.draft_b;
	return '';
}

export const load: PageServerLoad = async ({ params, setHeaders }): Promise<HostDeskPageData> => {
	setHeaders({ 'Cache-Control': 'private, no-store' });

	const payload = verifyHostDeskToken(params.token);
	if (!payload) return { state: 'invalid' };

	const draft = await loadDraft(payload.draftId);
	if (!draft) return { state: 'missing' };

	return {
		state: 'ready',
		variant: payload.variant,
		draft: toPageDraft(draft),
		initialText: initialTextFor(draft, payload.variant)
	};
};

// Same normalization the question page's createCommentSchema applies: trim
// and cap at 5000 characters. The RPC enforces the same bounds server-side.
function normalizeReplyText(value: FormDataEntryValue | null): string {
	return typeof value === 'string' ? value.trim() : '';
}

export const actions: Actions = {
	post: async ({ params, request, getClientAddress, setHeaders }) => {
		setHeaders({ 'Cache-Control': 'private, no-store' });
		const payload = verifyHostDeskToken(params.token);
		if (!payload) return fail(403, { action: 'post', message: 'This link is no longer valid.' });

		const formData = await request.formData();
		const text = normalizeReplyText(formData.get('text'));
		if (!text) return fail(400, { action: 'post', message: 'Write something first.', text });
		if (text.length > HOST_REPLY_MAX_CHARS) {
			return fail(400, {
				action: 'post',
				message: `Keep it under ${HOST_REPLY_MAX_CHARS} characters.`,
				text
			});
		}

		let ip: string | null;
		try {
			ip = getClientAddress();
		} catch {
			ip = null;
		}

		const admin = getSupabaseAdminClient() as any;
		const { data: commentId, error } = await admin.rpc('post_host_reply', {
			p_draft_id: payload.draftId,
			p_host_user_id: resolveHostUserId(),
			p_text: text,
			p_ip: ip
		});
		if (error || !commentId) {
			console.error('Host reply post failed', { draftId: payload.draftId, error });
			return fail(500, {
				action: 'post',
				message: 'Could not post that reply. Nothing was published.',
				text
			});
		}

		const draft = await loadDraft(payload.draftId);
		return {
			action: 'post',
			success: true,
			postedCommentId: Number(commentId),
			draft: draft ? toPageDraft(draft) : null
		};
	},

	skip: async ({ params, setHeaders }) => {
		setHeaders({ 'Cache-Control': 'private, no-store' });
		const payload = verifyHostDeskToken(params.token);
		if (!payload) return fail(403, { action: 'skip', message: 'This link is no longer valid.' });

		const admin = getSupabaseAdminClient() as any;
		const { data: status, error } = await admin.rpc('skip_host_reply', {
			p_draft_id: payload.draftId
		});
		if (error) {
			console.error('Host reply skip failed', { draftId: payload.draftId, error });
			return fail(500, { action: 'skip', message: 'Could not skip that one.' });
		}

		const draft = await loadDraft(payload.draftId);
		return {
			action: 'skip',
			success: true,
			status: String(status ?? 'skipped'),
			draft: draft ? toPageDraft(draft) : null
		};
	}
};
