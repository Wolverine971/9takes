// src/lib/utils/navOffer.ts
//
// The /book-session link in the mobile menu (DJ asked for a better one than
// "Talk it through", 2026-10-06). Picked from a sales review and a simulated
// 12-reader first-click panel:
//   - "Talk it through" read as a forum or an AI chat; 1 in 12 found what they
//     expected on the page.
//   - "Experimental therapy" pulled the most taps and matched nobody's
//     expectation: readers expected licensed (or AI) therapy, then hit the
//     page's "not clinical therapy" line. Same verdict as the 2026-10-04 beta
//     card test. It stays as the page's section heading, where it's explained.
//   - "Free 1-on-1" + a BETA badge: the most taps that land on what was
//     promised. "1-on-1" says a real person, "Free" removes the price question,
//     BETA says why it's free.
//
// Menu opens and taps are counted per label in cta_experiment_events, so a new
// label gets a new id and the readout on /admin/consulting/notes compares them.

export const NAV_OFFER_EXPERIMENT = 'mobile_nav_offer';

export type NavOffer = { id: string; label: string; badge?: string };

export const NAV_OFFER: NavOffer = { id: 'free_1on1_beta', label: 'Free 1-on-1', badge: 'Beta' };

/** Every label that has run, newest first, for the admin readout. */
export const NAV_OFFER_HISTORY: readonly NavOffer[] = [NAV_OFFER];

export function isNavOfferVariantId(value: unknown): value is string {
	return typeof value === 'string' && NAV_OFFER_HISTORY.some((offer) => offer.id === value);
}

export function navOfferDisplayName(offer: NavOffer): string {
	return offer.badge ? `${offer.label} · ${offer.badge}` : offer.label;
}
