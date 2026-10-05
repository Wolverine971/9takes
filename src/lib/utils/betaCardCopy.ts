// src/lib/utils/betaCardCopy.ts
//
// Copy for the beta card, run as an experiment (DJ, 2026-10-04: "too wordy...
// lead with the benefits, what it is, and one succinct thing"). Every headline
// is held to DJ's three rules: can you picture it, could it be proven wrong,
// and could nobody but 9takes say it. No founder name and no "I"; the founder
// writes back personally, the card doesn't need to say so.
//
// Each visitor is assigned one variant, kept in their browser, so the side card
// and the in-article card always agree. /book-session isn't part of the
// experiment and always shows DETAILS_COPY. To change the test, edit
// BETA_CARD_VARIANTS and bump BETA_CARD_EXPERIMENT so old assignments and
// events don't mix with the new ones.

export const BETA_CARD_EXPERIMENT = 'beta_card_v1';

export type BetaCardCopy = {
	id: string;
	kicker: string;
	/** May contain {name}: the famous person the page is about. */
	headline: string;
	/** Used when the page isn't about a person. Defaults to `headline`. */
	headlineFallback?: string;
	sub: string;
	button: string;
};

// Three different bets, not three wordings of one idea. Stress-tested
// 2026-10-04 by a conversion review and a simulated nine-reader panel. Both
// cut the "Experimental therapy" kicker (it read as unlicensed and fought the
// fine print), plus "decode", "fight", and "9takes lens". Readers needed to
// hear "call" (several expected an instant document) and "private".
const KICKER = 'Free 1-on-1 · Real person replies';

export const BETA_CARD_VARIANTS: readonly BetaCardCopy[] = [
	{
		// Mirror the page: the breakdown they're reading is the proof.
		id: 'read_like_this',
		kicker: KICKER,
		headline: 'We read {name}’s patterns. Now bring us yours.',
		headlineFallback: 'We’ve read 450 famous people. Now bring us yours.',
		sub: 'A free 30-minute call about the pattern you keep repeating. Private write-up after.',
		button: 'Read my pattern'
	},
	{
		// Relief from self-blame: the brand promise, "someone else's alarm".
		id: 'flaw_or_alarm',
		kicker: KICKER,
		headline: 'Your flaw, or their alarm going off?',
		sub: 'A free 30-minute call on the conflict you keep replaying. Leave with it in writing.',
		button: 'Find out which'
	},
	{
		// Nine perspectives: the one thing only 9takes is built around.
		id: 'nine_eyes',
		kicker: KICKER,
		headline: 'See your pattern through nine sets of eyes.',
		sub: 'A free 30-minute call, then a private write-up of what all nine see.',
		button: 'Show me'
	}
];

/** /book-session: the reader is already on the details, so no hook needed. */
export const DETAILS_COPY: BetaCardCopy = {
	id: 'details',
	kicker: '1-on-1 · Real person replies',
	headline: 'Start with a free 30-minute call.',
	sub: 'Leave your email. The details land in your inbox within a day.',
	button: 'Send details'
};

export const BETA_VARIANT_STORAGE_KEY = `9takes:beta-invite:variant:${BETA_CARD_EXPERIMENT}`;

const VARIANT_IDS = new Set([...BETA_CARD_VARIANTS.map((variant) => variant.id), DETAILS_COPY.id]);

export function isBetaCardVariantId(value: unknown): value is string {
	return typeof value === 'string' && VARIANT_IDS.has(value);
}

export function betaCardCopyById(id: string): BetaCardCopy {
	return (
		BETA_CARD_VARIANTS.find((variant) => variant.id === id) ??
		(id === DETAILS_COPY.id ? DETAILS_COPY : BETA_CARD_VARIANTS[0])
	);
}

export function renderBetaHeadline(copy: BetaCardCopy, personName?: string | null): string {
	const name = personName?.trim();
	if (copy.headline.includes('{name}')) {
		return name
			? copy.headline.replaceAll('{name}', name)
			: (copy.headlineFallback ?? copy.headline);
	}
	return copy.headline;
}

/**
 * This browser's variant: the one it was given before, or a fresh random pick
 * that's remembered. If storage is blocked, a pick for this page only.
 */
export function assignBetaCardVariant(random: () => number = Math.random): BetaCardCopy {
	try {
		const saved = localStorage.getItem(BETA_VARIANT_STORAGE_KEY);
		const known = BETA_CARD_VARIANTS.find((variant) => variant.id === saved);
		if (known) return known;
	} catch {
		// Fall through to a page-only pick.
	}

	const picked = BETA_CARD_VARIANTS[Math.floor(random() * BETA_CARD_VARIANTS.length)];
	try {
		localStorage.setItem(BETA_VARIANT_STORAGE_KEY, picked.id);
	} catch {
		// Private mode or blocked storage: this page only.
	}
	return picked;
}
