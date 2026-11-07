// src/lib/brand/brandTokens.ts
// Cold Light visual tokens shared by the card renderer (server + CLI) and the /admin/brand page.
// Spec: docs/brand/cold-light.md. Keep this file dependency-free and use relative imports only,
// so `pnpm brand:card` (tsx) can load it outside SvelteKit.

export const COLORS = {
	night: '#01010D',
	surface: '#0C0B22',
	surfaceRaised: '#131133',
	indigo: '#6331FB',
	indigoDeep: '#24127A',
	lavender: '#CFC2FF',
	mint: '#88F9C0',
	text: '#F4F2FF',
	textMuted: '#BDB8DA',
	textFaint: '#8D88AE',
	rule: 'rgba(207, 194, 255, 0.14)'
} as const;

/** Card output sizes. Every template renders at any of these. */
export const CARD_FORMATS = {
	og: { width: 1200, height: 630, label: 'Link preview (OG / X card)' },
	'ig-post': { width: 1080, height: 1350, label: 'Instagram post / carousel slide (4:5)' },
	'ig-story': { width: 1080, height: 1920, label: 'Instagram Story / Reel cover (9:16)' },
	'x-post': { width: 1600, height: 900, label: 'X post image (16:9)' },
	'x-header': { width: 1500, height: 500, label: 'X profile header (3:1)' },
	square: { width: 1080, height: 1080, label: 'Square (LinkedIn, X, avatar-safe)' }
} as const;

export type CardFormat = keyof typeof CARD_FORMATS;

/**
 * The statue library. All files are already in the Cold Light tint, so they can sit on Night
 * without a second treatment. `focus` is where the faces are (0 = left/top, 1 = right/bottom),
 * used when a template crops the statue.
 */
export const STATUES = {
	whisper: {
		file: 'static/brand/statues/whisper.webp',
		label: 'The whisper (homepage hero)',
		emotion: 'curiosity, the secret take',
		focusY: 0.3
	},
	friends: {
		file: 'static/brand/statues/friends.webp',
		label: 'Two friends whispering',
		emotion: 'trust, the honest version',
		focusY: 0.35
	},
	smirk: {
		file: 'static/brand/statues/smirk.webp',
		label: 'He whispers, she smirks',
		emotion: 'the take you did not expect',
		focusY: 0.3
	},
	anger: {
		file: 'static/brand/statues/anger.webp',
		label: 'Anger (body triad: 8, 9, 1)',
		emotion: 'anger',
		focusY: 0.35
	},
	fear: {
		file: 'static/brand/statues/fear.webp',
		label: 'Fear (head triad: 5, 6, 7)',
		emotion: 'fear',
		focusY: 0.35
	},
	shame: {
		file: 'static/brand/statues/shame.webp',
		label: 'Shame (heart triad: 2, 3, 4)',
		emotion: 'shame',
		focusY: 0.3
	},
	dialogue: {
		file: 'static/brand/statues/dialogue.webp',
		label: 'Two philosophers in dialogue',
		emotion: 'one conversation, two readings',
		focusY: 0.45
	}
} as const;

export type StatueId = keyof typeof STATUES;

export const LOGO_MARK_FILE = 'static/brand/9takes-nine-mask-logo.png';

export const FONT_FILES = {
	shout: 'static/fonts/cold-light/anton-latin-400-normal.woff',
	talk: 'static/fonts/cold-light/archivo-latin-600-normal.woff',
	talkBold: 'static/fonts/cold-light/archivo-latin-700-normal.woff',
	talkRegular: 'static/fonts/cold-light/archivo-latin-400-normal.woff',
	voice: 'static/fonts/cold-light/playfair-display-latin-500-italic.woff'
} as const;

export type FontRole = keyof typeof FONT_FILES;
