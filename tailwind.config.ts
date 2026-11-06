// tailwind.config.ts
import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';
import typographyPlugin from '@tailwindcss/typography';

// Cold Light (2026-11-05): Archivo talks (body, UI, default headings), Playfair
// Display italic is the voice, Anton shouts (uppercase posters only, opt-in).
// Stacks mirror --font-talk / --font-voice / --font-shout in src/scss/index.scss.
const fontTalk = ['"Archivo"', '"Archivo Fallback"', '"Helvetica Neue"', 'Arial', 'sans-serif'];
const fontVoice = ['"Playfair Display"', '"Playfair Display Fallback"', 'Georgia', 'serif'];
const fontShout = ['"Anton"', '"Anton Fallback"', 'Impact', '"Arial Narrow"', 'sans-serif'];
const fontMono = ['"JetBrains Mono"', 'ui-monospace', 'monospace'];

export default {
	content: ['./src/**/*.{html,js,svelte,ts,md}', '!./src/**/*.scss'],

	plugins: [flowbitePlugin, typographyPlugin],
	darkMode: 'selector',

	theme: {
		extend: {
			colors: {
				// Cold Light primary ramp (2026-11-05; was sodium amber). Lightest →
				// darkest: 300 = --highlight (lavender), 600 = --accent (indigo),
				// 900 = --accent-deep. 50–500 are readable as text on the dark
				// surfaces (500 = 7.6:1); 600–900 are fills that carry light text.
				// Indigo (600) is never text or a focus ring — `focus:ring-primary-500`
				// therefore resolves to lavender-violet, not indigo.
				primary: {
					50: '#F5F2FF',
					100: '#EBE5FF',
					200: '#DCD3FF',
					300: '#CFC2FF',
					400: '#B3A3FF',
					500: '#A08CFF',
					600: '#6331FB',
					700: '#4A22C9',
					800: '#34179A',
					900: '#24127A'
				},
				// Data / dossier accent. Was teal; now the same violet family as
				// --data-teal (#A08CFF) so stat panels stay on-palette.
				data: {
					50: '#F5F2FF',
					100: '#EBE5FF',
					200: '#DCD3FF',
					300: '#CFC2FF',
					400: '#B3A3FF',
					500: '#A08CFF',
					600: '#8670F0',
					700: '#6331FB',
					800: '#34179A',
					900: '#24127A'
				},
				// Cool ink-violet neutrals (was warm stone). 950 = --bg,
				// 900 = --surface, 800 = --surface-raised, 400 = --text-faint,
				// 300 = --text-muted, 50 = --text.
				neutral: {
					50: '#F4F2FF',
					100: '#E7E4F6',
					200: '#D3CFE8',
					300: '#BDB8DA',
					400: '#8D88AE',
					500: '#6B6790',
					600: '#4D4970',
					700: '#383360',
					800: '#131133',
					900: '#0C0B22',
					950: '#01010D'
				},
				// Mint "action" — rationed: about one element in view (the main
				// give-your-take CTA). Pair with text-action-ink.
				action: {
					DEFAULT: '#88F9C0',
					ink: '#01010D'
				},
				// Functional colors
				success: {
					50: '#ECFDF5',
					100: '#D1FAE5',
					500: '#22C55E',
					700: '#15803D'
				},
				warning: {
					50: '#FEFCE8',
					100: '#FEF9C3',
					500: '#EAB308',
					700: '#A16207'
				},
				error: {
					50: '#FEF2F2',
					100: '#FEE2E2',
					500: '#EF4444',
					700: '#B91C1C'
				},
				info: {
					50: '#F5F2FF',
					100: '#EBE5FF',
					500: '#A08CFF',
					700: '#6331FB'
				}
			},
			boxShadow: {
				// Defined in src/scss/index.scss (Cold Light is dark only).
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)'
				// glow-teal / glow-rose removed 2026-05-04 — see design-system.md §5.
			},
			borderRadius: {
				// Standardized radius scale. Kole's recipe: 10px for small components.
				// Mapping: rounded-md → buttons/inputs/chips · rounded-xl → cards/modals · rounded-full → pills/avatars only.
				// rounded-lg, rounded-2xl, rounded-3xl are deprecated — see pnpm lint:radius.
				sm: '0.25rem', // 4px — tiny inline things
				DEFAULT: '0.5rem', // 8px — legacy fallback
				md: '0.625rem', // 10px — buttons, inputs, chips (Kole's pick)
				lg: '0.75rem', // 12px — DEPRECATED, use md or xl
				xl: '1rem' // 16px — cards, modals, banners
			},
			spacing: {
				xs: '0.25rem',
				sm: '0.5rem',
				md: '0.75rem',
				lg: '1rem',
				xl: '1.5rem',
				'2xl': '2rem',
				'3xl': '3rem'
			},
			fontFamily: {
				sans: fontTalk,
				talk: fontTalk,
				heading: fontTalk,
				display: fontTalk,
				voice: fontVoice,
				shout: fontShout,
				mono: fontMono
			},
			maxWidth: {
				'7xl': '72rem',
				'8xl': '88rem'
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						// Cold Light prose: body --text-muted, headings/strong --text.
						color: 'var(--text-muted)',
						fontSize: '1rem',
						lineHeight: '1.5',
						maxWidth: '68ch',
						'> *': {
							marginTop: '0.75em',
							marginBottom: '0.75em'
						},
						a: {
							color: 'var(--highlight)',
							fontWeight: 600,
							textDecoration: 'underline',
							textUnderlineOffset: '3px',
							'&:hover': {
								color: 'var(--text)'
							}
						},
						h1: {
							color: 'var(--text)',
							fontFamily: theme('fontFamily.heading').join(','),
							fontSize: '2.25rem',
							lineHeight: '1.2',
							marginBottom: '0.75em'
						},
						h2: {
							color: 'var(--text)',
							fontFamily: theme('fontFamily.heading').join(','),
							fontSize: '1.75rem',
							lineHeight: '1.25',
							marginTop: '1.5em'
						},
						h3: {
							color: 'var(--text)',
							fontFamily: theme('fontFamily.heading').join(','),
							fontSize: '1.375rem',
							lineHeight: '1.3'
						},
						h4: {
							color: 'var(--text)',
							fontWeight: 600
						},
						p: {
							marginTop: '0.5em',
							marginBottom: '0.5em'
						},
						strong: {
							color: 'var(--text)'
						},
						blockquote: {
							borderLeftColor: 'var(--accent)',
							backgroundColor: 'var(--surface)',
							fontStyle: 'italic',
							paddingLeft: '1rem',
							color: 'var(--text)'
						},
						ul: {
							marginTop: '0.5em',
							marginBottom: '0.5em',
							paddingLeft: '1.25em'
						},
						ol: {
							marginTop: '0.5em',
							marginBottom: '0.5em',
							paddingLeft: '1.25em'
						},
						code: {
							fontFamily: theme('fontFamily.mono').join(','),
							padding: '0.1rem 0.25rem',
							borderRadius: theme('borderRadius.sm'),
							backgroundColor: 'var(--surface)'
						}
					}
				},
				sm: {
					css: {
						fontSize: '0.95rem',
						lineHeight: '1.45'
					}
				},
				lg: {
					css: {
						fontSize: '1.05rem',
						lineHeight: '1.55'
					}
				}
			})
		}
	}
} as Config;
