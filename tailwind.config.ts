// tailwind.config.ts
import type { Config } from 'tailwindcss';

const fontSans = ['"Space Grotesk"', 'system-ui', 'sans-serif'];
const fontDisplay = ['"Rajdhani"', 'system-ui', 'sans-serif'];
const fontMono = ['"JetBrains Mono"', 'ui-monospace', 'monospace'];

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'!./src/**/*.scss'
	],

	plugins: [require('flowbite/plugin'), require('@tailwindcss/typography')],
	darkMode: 'selector',

	theme: {
		extend: {
			colors: {
				// Teal primary palette
				primary: {
					50: '#F0FDFA',
					100: '#CCFBF1',
					200: '#99F6E4',
					300: '#5EEAD4',
					400: '#2DD4BF',
					500: '#14B8A6',
					600: '#0D9488',
					700: '#0F766E',
					800: '#115E59',
					900: '#134E4A'
				},
				// Rose secondary palette
				secondary: {
					50: '#FFF1F2',
					100: '#FFE4E6',
					200: '#FECDD3',
					300: '#FDA4AF',
					400: '#FB7185',
					500: '#F43F5E',
					600: '#E11D48',
					700: '#BE123C',
					800: '#9F1239',
					900: '#881337'
				},
				// Purple accent palette
				accent: {
					50: '#F5F3FF',
					100: '#EDE9FE',
					200: '#DDD6FE',
					300: '#C4B5FD',
					400: '#A78BFA',
					500: '#8B5CF6',
					600: '#7C3AED',
					700: '#6D28D9',
					800: '#5B21B6',
					900: '#4C1D95'
				},
				// Warm stone neutral palette
				neutral: {
					50: '#FAFAF9',
					100: '#F5F5F4',
					200: '#E7E5E4',
					300: '#D6D3D1',
					400: '#A8A29E',
					500: '#78716C',
					600: '#57534E',
					700: '#44403C',
					800: '#292524',
					900: '#1C1917',
					950: '#0C0A09'
				},
				// Functional colors
				success: {
					50: '#ECFDF5',
					100: '#D1FAE5',
					500: '#22C55E',
					700: '#15803D'
				},
				warning: {
					50: '#FFFBEB',
					100: '#FEF3C7',
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
					50: '#F0FDFA',
					100: '#CCFBF1',
					500: '#14B8A6',
					700: '#0F766E'
				},
				brand: {
					teal: '#2DD4BF',
					tealDark: '#0D9488',
					rose: '#FB7185',
					roseDark: '#E11D48',
					gold: '#D4AF37'
				}
			},
			boxShadow: {
				sm: '0 1px 3px rgba(12, 10, 9, 0.15)',
				md: '0 4px 6px rgba(12, 10, 9, 0.2)',
				lg: '0 10px 15px rgba(12, 10, 9, 0.25)',
				xl: '0 20px 25px rgba(12, 10, 9, 0.3)',
				'glow-teal': '0 0 20px rgba(45, 212, 191, 0.3)',
				'glow-rose': '0 0 20px rgba(251, 113, 133, 0.3)'
			},
			borderRadius: {
				sm: '0.25rem',
				DEFAULT: '0.5rem',
				lg: '0.75rem',
				xl: '1rem'
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
				sans: fontSans,
				heading: fontDisplay,
				display: fontDisplay,
				mono: fontMono
			},
			maxWidth: {
				'7xl': '72rem',
				'8xl': '88rem'
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: 'var(--text-primary)',
						fontSize: '1rem',
						lineHeight: '1.5',
						maxWidth: '68ch',
						'> *': {
							marginTop: '0.75em',
							marginBottom: '0.75em'
						},
						a: {
							color: 'var(--primary)',
							fontWeight: 600,
							textDecoration: 'none',
							'&:hover': {
								color: 'var(--primary-light)',
								textDecoration: 'underline'
							}
						},
						h1: {
							color: 'var(--text-primary)',
							fontFamily: theme('fontFamily.heading').join(','),
							fontSize: '2.25rem',
							lineHeight: '1.2',
							marginBottom: '0.75em'
						},
						h2: {
							color: 'var(--text-primary)',
							fontFamily: theme('fontFamily.heading').join(','),
							fontSize: '1.75rem',
							lineHeight: '1.25',
							marginTop: '1.5em'
						},
						h3: {
							color: 'var(--text-primary)',
							fontFamily: theme('fontFamily.heading').join(','),
							fontSize: '1.375rem',
							lineHeight: '1.3'
						},
						h4: {
							color: 'var(--text-primary)',
							fontWeight: 600
						},
						p: {
							marginTop: '0.5em',
							marginBottom: '0.5em'
						},
						strong: {
							color: 'var(--text-primary)'
						},
						blockquote: {
							borderLeftColor: 'var(--primary)',
							fontStyle: 'normal',
							paddingLeft: '1rem',
							color: 'var(--text-secondary)'
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
							backgroundColor: 'var(--bg-elevated)'
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
