// src/lib/utils/articleSlots.ts
export const ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER =
	'<div data-article-slot="enneagram-type-dossier"></div>';

export type ArticleSlotSplit = {
	before: string;
	after: string;
	hasSlot: boolean;
};

/**
 * Split rendered article HTML at the explicit Enneagram dossier slot.
 * Articles without the slot stay intact and do not receive a dossier.
 */
export function splitAtEnneagramTypeDossierSlot(html: string): ArticleSlotSplit {
	if (!html) return { before: '', after: '', hasSlot: false };

	const slotIndex = html.indexOf(ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER);
	if (slotIndex === -1) return { before: html, after: '', hasSlot: false };

	return {
		before: html.slice(0, slotIndex),
		after: html.slice(slotIndex + ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER.length),
		hasSlot: true
	};
}
