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
	/** Name of the Enneagram type */
	name: string;
	/** Short title / archetype label */
	title: string;
}

export const ENNEAGRAM_TYPE_COLORS: Record<number, EnneagramTypeColor> = {
	1: { color: '#6366F1', name: 'The Perfectionist', title: 'Knight of Order' },
	2: { color: '#F472B6', name: 'The Helper', title: 'Heart Guardian' },
	3: { color: '#F59E0B', name: 'The Achiever', title: 'Victory Blade' },
	4: { color: '#A855F7', name: 'The Individualist', title: 'Soul Weaver' },
	5: { color: '#0EA5E9', name: 'The Investigator', title: 'Mind Phantom' },
	6: { color: '#22C55E', name: 'The Loyalist', title: 'Iron Guard' },
	7: { color: '#FBBF24', name: 'The Enthusiast', title: 'Storm Rider' },
	8: { color: '#DC2626', name: 'The Challenger', title: 'War Commander' },
	9: { color: '#34D399', name: 'The Peacemaker', title: 'Harmony Sage' }
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
