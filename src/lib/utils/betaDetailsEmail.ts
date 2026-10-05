// src/lib/utils/betaDetailsEmail.ts
//
// The "here are the details" email DJ sends, by hand, to someone who asked about
// experimental therapy from the beta card. Nothing sends it automatically: the
// site never emails a visitor-supplied address (the Nov 2025 waitlist bot wave
// typed strangers' emails into our forms). DJ gets an alert with a Gmail compose
// link prefilled from this template, reads it, and presses Send.
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
			'You asked about the free 1-on-1 call on 9takes. Thanks for raising your hand. Here’s what it is. I call it experimental therapy, 9takes style.',
			'Traditional therapy gets treated like something shameful. People process their heaviest stuff behind a closed door, and too often they walk out without getting anywhere. I want to flip that. Going deep on your inner world should feel like leveling up. You should come out stronger and proud of the work you did.',
			'We use the Enneagram as a map. I ask questions, tell you what I hear underneath your answers, and we look at the pattern you keep repeating through all nine types. After each session you get a private write-up of what you figured out, and it’s yours to keep.',
			'It starts with a free 30-minute call so I can hear what’s going on and you can decide if it’s for you. The whole beta is free while I shape how I run these. All I ask is honest feedback on what’s working and what isn’t.',
			`Grab a time here: ${link}`,
			'If none of the times work in your time zone, just reply and we’ll find one.',
			'One note: this is coaching, not clinical therapy or medical care. If you’re ever in crisis, call or text 988 (US) or your local emergency number.',
			'DJ'
		].join('\n\n')
	};
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
