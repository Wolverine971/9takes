// src/lib/utils/betaDetailsEmail.ts
//
// The details email for experimental therapy. Since 2026-11-06 the site sends
// it automatically, from dj@9takes.com, right after someone signs up on the
// beta card ($lib/server/betaSignups), so replies land in DJ's inbox. The same
// text prefills the "Send details" Gmail draft in /admin/consulting for anyone
// who signed up another way.
//
// It has two jobs: get them to book the intro call, or get them to reply with
// what's going on.
//
// The booking link is not in this file on purpose: the repo is public and the
// link is meant to travel by email only. Callers pass it in from
// PRIVATE_BETA_BOOKING_URL; without it the draft keeps a visible placeholder.

export const BETA_SENDER_ADDRESS = 'dj@9takes.com';
export const BETA_BOOKING_PLACEHOLDER = '[paste your booking link]';

export type BetaDetailsEmail = { subject: string; body: string };

export function buildBetaDetailsEmail({
	name,
	bookingUrl
}: {
	name?: string | null;
	bookingUrl?: string | null;
}): BetaDetailsEmail {
	const firstName = name?.trim().split(/\s+/)[0] ?? '';
	const greeting = firstName ? `Hey ${firstName},` : 'Hey,';
	const link = bookingUrl?.trim() || BETA_BOOKING_PLACEHOLDER;

	return {
		subject: 'Your free 1-on-1 call on 9takes (the details)',
		body: [
			greeting,
			'Thanks for signing up for experimental therapy, 9takes style. Experimental because it’s an attempt: I know a few things about how people work, and we’re going to try them on your life.',
			'You know the moments. You snap at someone and can’t explain why. A conversation goes sideways and you replay it for days. Someone you care about shuts down and you can’t reach them. We figure out what’s driving those moments, in you and in the people around you. The goal is to make you the most self-aware, emotionally intelligent person you know.',
			'Here’s what to expect:\n1. A free 30-minute intro call. You tell me what’s going on, and you decide if it’s for you.\n2. If it is, we keep going. You leave every session with something to try that week, and we talk through what happened.',
			'It’s free, with no commitment. All I ask is honest feedback.',
			`Book your intro call here: ${link}`,
			'If none of the times work in your time zone, just reply and we’ll find one.',
			'P.S. Not ready to book? Hit reply and tell me why you signed up, or what’s going on right now. I read every reply, and I’ll write back.',
			'DJ',
			'This is coaching, not clinical therapy. If you’re ever in crisis, call or text 988 (US) or your local emergency number. Didn’t sign up for this? Ignore it, and you won’t hear from me again.'
		].join('\n\n')
	};
}

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

/**
 * The same email as simple HTML: one paragraph per block, line breaks kept,
 * links clickable. Plain on purpose, so it reads like a note from DJ.
 */
export function betaDetailsEmailHtml(body: string): string {
	return body
		.split('\n\n')
		.map((block) => {
			const html = escapeHtml(block)
				.replace(/https?:\/\/[^\s<]+/g, (url) => `<a href="${url}">${url}</a>`)
				.replaceAll('\n', '<br>');
			return `<p>${html}</p>`;
		})
		.join('\n');
}

/**
 * A Gmail compose window, opened in DJ's dj@9takes.com account, with the
 * recipient, subject, and body already filled in. Nothing is sent until DJ
 * presses Send.
 */
export function buildGmailComposeUrl({
	to,
	subject,
	body,
	from = BETA_SENDER_ADDRESS
}: {
	to: string;
	subject: string;
	body: string;
	from?: string;
}): string {
	const params = new URLSearchParams({
		authuser: from,
		view: 'cm',
		fs: '1',
		to,
		su: subject,
		body
	});
	return `https://mail.google.com/mail/?${params.toString()}`;
}
