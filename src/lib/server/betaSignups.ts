// src/lib/server/betaSignups.ts
//
// Beta card signups: "Want to try experimental therapy, 9takes style?"
//
// The visitor leaves only an email. It lands on coaching_waitlist (the beta
// roster /admin/consulting already shows, with its bot flags), plus a
// coaching_waitlist_metadata row saying which card and page it came from.
//
// Since 2026-11-06 (DJ) the visitor gets the details email right away, from
// dj@9takes.com, so they can book or reply. A bot can type a stranger's
// address (the Nov 2025 wave did), so the auto-send is fenced in: the
// endpoint's bot filters run first, flagged and unsubscribed addresses get
// nothing, each address gets it at most once (details_sent_at is claimed
// before sending), and at most BETA_AUTO_SEND_DAILY_CAP go out per 24 hours.
// Anything that doesn't auto-send falls back to DJ's alert with a one-click
// Gmail draft. DJ is alerted either way.
import { env } from '$env/dynamic/private';
import { sendEmail, type SendEmailOptions, type SendEmailResult } from '$lib/email/sender';
import { getSuppressedEmailSet } from '$lib/email/suppression';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import {
	escapeHtml,
	hashClientAddress,
	isDisposableEmail,
	isValidEmail,
	normalizeEmail,
	talkNoteAlertAddress
} from '$lib/server/talkNotes';
import {
	BETA_SENDER_ADDRESS,
	betaDetailsEmailHtml,
	buildBetaDetailsEmail,
	buildGmailComposeUrl
} from '$lib/utils/betaDetailsEmail';
import {
	BETA_PLACEMENTS,
	BETA_SURFACES,
	type BetaPlacement,
	type BetaSurface
} from '$lib/utils/betaInvite';
import { logger } from '$lib/utils/logger';

export const BETA_SIGNUP_SOURCE = 'beta_card';
export const BETA_SIGNUP_CAMPAIGN = 'experimental_therapy';
/** Time between opening the email field and submitting it. People need more. */
export const BETA_SIGNUP_MIN_FORM_MS = 1500;
/** Most details emails the site sends on its own per 24 hours. A bot wave stops here. */
export const BETA_AUTO_SEND_DAILY_CAP = 20;

export { BETA_PLACEMENTS, BETA_SURFACES, type BetaPlacement, type BetaSurface };

const PLACEMENT_LABELS: Record<BetaPlacement, string> = {
	rail: 'side card (desktop)',
	inline: 'in-article card'
};

/** The unlisted discovery-call link. Kept out of the public repo. */
export function betaBookingUrl(): string | null {
	return env.PRIVATE_BETA_BOOKING_URL?.trim() || null;
}

export type BetaSignupsDeps = {
	// The generated Database types lag the metadata table's use here, same as
	// talkNotes, so the client is untyped.
	supabase?: any;
	sendEmail?: (options: SendEmailOptions) => Promise<SendEmailResult>;
	alertAddress?: string | null;
	bookingUrl?: string | null;
	now?: () => Date;
};

export type CreateBetaSignupInput = {
	email: string;
	surface: BetaSurface;
	placement: BetaPlacement;
	sourcePath?: string | null;
	/** Which card copy they saw (betaCardCopy.ts), for the experiment readout. */
	variant?: string | null;
	userAgent: string;
	clientAddress: string;
};

export type CreateBetaSignupResult =
	// recorded is false only for bot-flagged addresses, which get the same answer.
	| { ok: true; alerted: boolean; recorded: boolean; detailsSent: boolean }
	| { ok: false; status: number; message: string };

type WaitlistMatch = {
	id: string;
	flagged_reason: string | null;
	created_at: string | null;
	details_sent_at: string | null;
};

async function findWaitlistRow(supabase: any, email: string): Promise<WaitlistMatch | null> {
	const { data, error } = await supabase
		.from('coaching_waitlist')
		.select('id, flagged_reason, created_at, details_sent_at')
		.eq('email', email)
		.maybeSingle();
	if (error) throw error;
	return (data as WaitlistMatch | null) ?? null;
}

export async function createBetaSignup(
	input: CreateBetaSignupInput,
	deps: BetaSignupsDeps = {}
): Promise<CreateBetaSignupResult> {
	const supabase = deps.supabase ?? (getSupabaseAdminClient() as any);
	const send = deps.sendEmail ?? sendEmail;
	const alertAddress = deps.alertAddress !== undefined ? deps.alertAddress : talkNoteAlertAddress();
	const bookingUrl = deps.bookingUrl !== undefined ? deps.bookingUrl : betaBookingUrl();

	const email = normalizeEmail(input.email);
	if (!isValidEmail(email)) {
		return { ok: false, status: 400, message: 'That email doesn’t look right.' };
	}
	if (isDisposableEmail(email)) {
		return {
			ok: false,
			status: 400,
			message: 'Please use a permanent email, not a temporary one.'
		};
	}

	let existing: WaitlistMatch | null;
	let waitlistId: string;
	try {
		existing = await findWaitlistRow(supabase, email);
		if (existing) {
			waitlistId = existing.id;
		} else {
			const { data, error } = await supabase
				.from('coaching_waitlist')
				.insert({ name: '', email })
				.select('id')
				.single();
			if (error?.code === '23505') {
				// Lost a race with another submit for the same address.
				existing = await findWaitlistRow(supabase, email);
				if (!existing) throw error;
				waitlistId = existing.id;
			} else if (error || !data?.id) {
				throw error ?? new Error('Waitlist insert returned no id');
			} else {
				waitlistId = data.id as string;
			}
		}
	} catch (error) {
		logger.error('Beta signup save failed', error as Error);
		return { ok: false, status: 500, message: 'Something went wrong. Please try again.' };
	}

	// Addresses from the Nov 2025 bot wave belong to people who never signed
	// up. Answer the same way (so the form can't probe the list) but record and
	// alert nothing.
	if (existing?.flagged_reason) {
		return { ok: true, alerted: false, recorded: false, detailsSent: false };
	}

	const sourcePath = input.sourcePath?.slice(0, 300) || null;
	const { error: metadataError } = await supabase.from('coaching_waitlist_metadata').insert({
		waitlist_id: waitlistId,
		source: BETA_SIGNUP_SOURCE,
		utm_campaign: input.variant
			? `${BETA_SIGNUP_CAMPAIGN}:${input.variant}`.slice(0, 120)
			: BETA_SIGNUP_CAMPAIGN,
		utm_medium: input.placement,
		utm_content: sourcePath,
		user_agent: input.userAgent.slice(0, 500),
		// Hashed, like talk notes: the beta is meant to feel private.
		ip_address: hashClientAddress(input.clientAddress)
	});
	if (metadataError)
		logger.warn('Beta signup metadata not saved', { error: metadataError.message });

	const draft = buildBetaDetailsEmail({ bookingUrl });
	const autoSend = await sendDetailsAutomatically({
		supabase,
		send,
		waitlistId,
		email,
		alreadySentAt: existing?.details_sent_at ?? null,
		bookingUrl,
		draft,
		now: deps.now ?? (() => new Date())
	});
	const detailsSent = autoSend.status === 'sent';

	if (!alertAddress) return { ok: true, alerted: false, recorded: true, detailsSent };

	const composeUrl = buildGmailComposeUrl({ to: email, subject: draft.subject, body: draft.body });
	const from = sourcePath
		? `${escapeHtml(sourcePath)} (${PLACEMENT_LABELS[input.placement]})`
		: PLACEMENT_LABELS[input.placement];
	const repeatLine = existing
		? `<p>They were already on the waitlist${
				existing.created_at ? ` (since ${escapeHtml(existing.created_at.slice(0, 10))})` : ''
			}, and just asked again.</p>`
		: '';
	const detailsLine = detailsSent
		? `<p><strong>The details email went out automatically</strong> from ${BETA_SENDER_ADDRESS}. It's in your Sent folder, and their reply will land in your inbox.</p>`
		: autoSend.status === 'already_sent'
			? `<p>They already got the details email (${escapeHtml(autoSend.detail)}), so it wasn't sent again. <a href="${escapeHtml(composeUrl)}">Resend it</a> if they need it.</p>`
			: `<p><strong>The details email did NOT go out automatically</strong> (${escapeHtml(autoSend.detail)}).</p>
<p><a class="button" href="${escapeHtml(composeUrl)}">Email them the details</a></p>
<p>That opens a Gmail draft from ${BETA_SENDER_ADDRESS} with the details email already written. Nothing is sent until you press Send. Mark it sent on the waitlist afterward.</p>`;
	const bookingWarning = bookingUrl
		? ''
		: '<p><strong>Heads-up:</strong> PRIVATE_BETA_BOOKING_URL isn’t set, so paste your booking link into the draft before you send it.</p>';

	try {
		const result = await send({
			to: alertAddress,
			subject: `Beta signup: ${email}`.slice(0, 200),
			htmlContent: `
<h1>Someone signed up for experimental therapy</h1>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>From:</strong> ${from}</p>
${input.variant ? `<p><strong>Card copy:</strong> ${escapeHtml(input.variant)}</p>` : ''}
${repeatLine}
${detailsLine}
${bookingWarning}
<p><a href="https://9takes.com/admin/consulting#waitlist-section">Open the waitlist</a></p>
			`.trim(),
			emailKind: 'transactional'
		});
		if (!result.success) {
			logger.warn('Beta signup alert failed', { error: result.error });
			return { ok: true, alerted: false, recorded: true, detailsSent };
		}
	} catch (error) {
		// The signup is already saved; a failed alert never loses it.
		logger.warn('Beta signup alert failed', { error: String(error) });
		return { ok: true, alerted: false, recorded: true, detailsSent };
	}

	return { ok: true, alerted: true, recorded: true, detailsSent };
}

type AutoSendOutcome =
	| { status: 'sent' }
	| { status: 'already_sent'; detail: string }
	| { status: 'skipped'; detail: string };

/**
 * Sends the details email to the person who just signed up, if it's safe to.
 * Claims details_sent_at first so two quick submits can't both send, and gives
 * the claim back if the send fails.
 */
async function sendDetailsAutomatically({
	supabase,
	send,
	waitlistId,
	email,
	alreadySentAt,
	bookingUrl,
	draft,
	now
}: {
	supabase: any;
	send: (options: SendEmailOptions) => Promise<SendEmailResult>;
	waitlistId: string;
	email: string;
	alreadySentAt: string | null;
	bookingUrl: string | null;
	draft: { subject: string; body: string };
	now: () => Date;
}): Promise<AutoSendOutcome> {
	if (alreadySentAt)
		return { status: 'already_sent', detail: `sent ${alreadySentAt.slice(0, 10)}` };
	if (!bookingUrl) return { status: 'skipped', detail: 'no booking link configured' };

	try {
		const suppressed = await getSuppressedEmailSet(supabase, [email]);
		if (suppressed.has(email)) return { status: 'skipped', detail: 'they unsubscribed before' };

		const since = new Date(now().getTime() - 24 * 60 * 60 * 1000).toISOString();
		const { count, error: countError } = await supabase
			.from('coaching_waitlist')
			.select('id', { count: 'exact', head: true })
			.gte('details_sent_at', since);
		if (countError) throw countError;
		if ((count ?? 0) >= BETA_AUTO_SEND_DAILY_CAP) {
			logger.warn('Beta details auto-send hit the daily cap', { cap: BETA_AUTO_SEND_DAILY_CAP });
			return {
				status: 'skipped',
				detail: `daily limit of ${BETA_AUTO_SEND_DAILY_CAP} auto-sends reached, which can mean a bot wave`
			};
		}

		const sentAt = now().toISOString();
		const { data: claimed, error: claimError } = await supabase
			.from('coaching_waitlist')
			.update({ details_sent_at: sentAt })
			.eq('id', waitlistId)
			.is('details_sent_at', null)
			.is('flagged_reason', null)
			.select('id')
			.maybeSingle();
		if (claimError) throw claimError;
		if (!claimed) return { status: 'already_sent', detail: 'sent a moment ago' };

		const result = await send({
			to: email,
			subject: draft.subject,
			htmlContent: betaDetailsEmailHtml(draft.body),
			plainTextContent: draft.body,
			includeFooter: false,
			emailKind: 'transactional',
			senderAddress: BETA_SENDER_ADDRESS
		});
		if (result.success) return { status: 'sent' };

		await supabase
			.from('coaching_waitlist')
			.update({ details_sent_at: null })
			.eq('id', waitlistId)
			.eq('details_sent_at', sentAt);
		logger.warn('Beta details auto-send failed', { error: result.error });
		return { status: 'skipped', detail: 'the send failed, see logs' };
	} catch (error) {
		logger.warn('Beta details auto-send errored', { error: String(error) });
		return { status: 'skipped', detail: 'something errored, see logs' };
	}
}
