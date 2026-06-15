// src/lib/constants/enneagramColors.ts
/**
 * Canonical Enneagram type colors — single source of truth.
 *
 * These match the CSS custom properties --type-1-color … --type-9-color
 * defined in src/scss/index.scss.  When you need a type color in JS/TS,
 * import from here instead of defining your own palette.
 */

export interface EnneagramTypeColor {
	/** Primary display color (works on both light and dark backgrounds) */
	color: string;
	/** Classic archetypal name of the Enneagram type */
	name: string;
}

export const ENNEAGRAM_TYPE_COLORS: Record<number, EnneagramTypeColor> = {
	1: { color: '#6366F1', name: 'The Perfectionist' },
	2: { color: '#F472B6', name: 'The Helper' },
	3: { color: '#F59E0B', name: 'The Achiever' },
	4: { color: '#A855F7', name: 'The Individualist' },
	5: { color: '#0EA5E9', name: 'The Investigator' },
	6: { color: '#22C55E', name: 'The Loyalist' },
	7: { color: '#FBBF24', name: 'The Enthusiast' },
	8: { color: '#DC2626', name: 'The Challenger' },
	9: { color: '#34D399', name: 'The Peacemaker' }
};

/** Quick lookup: type number → hex color string */
export const TYPE_COLOR_MAP: Record<number, string> = Object.fromEntries(
	Object.entries(ENNEAGRAM_TYPE_COLORS).map(([k, v]) => [Number(k), v.color])
);

/**
 * Get a bg/text/border color set for a given type, useful for cards and badges.
 * Works on dark backgrounds by default.
 */
export function getTypeColorSet(type: number): { bg: string; text: string; border: string } {
	const color = TYPE_COLOR_MAP[type] || TYPE_COLOR_MAP[1];
	return {
		bg: `color-mix(in srgb, ${color} 15%, transparent)`,
		text: color,
		border: color
	};
}

/** Primary + common-alternate archetype name for each type. */
export interface EnneagramTypeLabel {
	name: string;
	alt: string;
}

export const ENNEAGRAM_TYPE_LABELS: Record<number, EnneagramTypeLabel> = {
	1: { name: 'The Perfectionist', alt: 'The Reformer' },
	2: { name: 'The Helper', alt: 'The Giver' },
	3: { name: 'The Achiever', alt: 'The Performer' },
	4: { name: 'The Individualist', alt: 'The Romantic' },
	5: { name: 'The Investigator', alt: 'The Observer' },
	6: { name: 'The Loyalist', alt: 'The Skeptic' },
	7: { name: 'The Enthusiast', alt: 'The Epicure' },
	8: { name: 'The Challenger', alt: 'The Protector' },
	9: { name: 'The Peacemaker', alt: 'The Mediator' }
};

/** Display label like "Type 1 · The Perfectionist or Reformer". */
export function formatTypeLabel(type: number): string {
	const label = ENNEAGRAM_TYPE_LABELS[type];
	return label ? `Type ${type} · ${label.name} or ${label.alt}` : `Type ${type}`;
}
