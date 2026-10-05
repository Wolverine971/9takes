// src/lib/server/betaSignups.ts
//
// Beta card signups: "Want to try experimental therapy, 9takes style?"
//
// The visitor leaves only an email. It lands on coaching_waitlist (the beta
// roster /admin/consulting already shows, with its bot flags), plus a
// coaching_waitlist_metadata row saying which card and page it came from. DJ
// gets an alert with a one-click Gmail draft of the details email. The visitor
// gets nothing automatically, so the card can't be used to fill a stranger's
// inbox (see $lib/utils/betaDetailsEmail).
import { env } from '$env/dynamic/private';
import { sendEmail, type SendEmailOptions, type SendEmailResult } from '$lib/email/sender';
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
	{ ok: true; alerted: boolean } | { ok: false; status: number; message: string };

type WaitlistMatch = { id: string; flagged_reason: string | null; created_at: string | null };

async function findWaitlistRow(supabase: any, email: string): Promise<WaitlistMatch | null> {
	const { data, error } = await supabase
		.from('coaching_waitlist')
		.select('id, flagged_reason, created_at')
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
	if (existing?.flagged_reason) return { ok: true, alerted: false, recorded: false };

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

	if (!alertAddress) return { ok: true, alerted: false, recorded: true };

	const draft = buildBetaDetailsEmail({ bookingUrl });
	const composeUrl = buildGmailComposeUrl({ to: email, subject: draft.subject, body: draft.body });
	const from = sourcePath
		? `${escapeHtml(sourcePath)} (${PLACEMENT_LABELS[input.placement]})`
		: PLACEMENT_LABELS[input.placement];
	const repeatLine = existing
		? `<p>They were already on the waitlist${
				existing.created_at ? ` (since ${escapeHtml(existing.created_at.slice(0, 10))})` : ''
			}, and just asked again.</p>`
		: '';
	const bookingWarning = bookingUrl
		? ''
		: '<p><strong>Heads-up:</strong> PRIVATE_BETA_BOOKING_URL isn’t set, so paste your booking link into the draft before you send it.</p>';

	try {
		const result = await send({
			to: alertAddress,
			subject: `Beta signup: ${email}`.slice(0, 200),
			htmlContent: `
<h1>Someone wants the experimental therapy details</h1>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>From:</strong> ${from}</p>
${input.variant ? `<p><strong>Card copy:</strong> ${escapeHtml(input.variant)}</p>` : ''}
${repeatLine}
<p><a class="button" href="${escapeHtml(composeUrl)}">Email them the details</a></p>
<p>That opens a Gmail draft from ${BETA_SENDER_ADDRESS} with the details email already written. Nothing is sent until you press Send.</p>
${bookingWarning}
<p><a href="https://9takes.com/admin/consulting#waitlist-section">Open the waitlist</a></p>
			`.trim(),
			emailKind: 'transactional'
		});
		if (!result.success) {
			logger.warn('Beta signup alert failed', { error: result.error });
			return { ok: true, alerted: false, recorded: true };
		}
	} catch (error) {
		// The signup is already saved; a failed alert never loses it.
		logger.warn('Beta signup alert failed', { error: String(error) });
		return { ok: true, alerted: false, recorded: true };
	}

	return { ok: true, alerted: true, recorded: true };
}
