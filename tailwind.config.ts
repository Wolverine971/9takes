import type { Config } from 'tailwindcss';

const fontSans = ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'];
const fontSerif = ['"Noticia Text"', 'Georgia', 'serif'];
const fontMono = ['"Fira Mono"', 'monospace'];

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		// Exclude SCSS files from purging as they use CSS variables
		'!./src/**/*.scss'
	],

	plugins: [require('flowbite/plugin'), require('@tailwindcss/typography')],
	darkMode: 'selector',

	theme: {
		extend: {
			colors: {
				// Modern purple-focused palette
				primary: {
					50: '#f7f7ff',
					100: '#e9e4ff',
					200: '#d1c9ff',
					300: '#b2a8ff',
					400: '#a29bfe',
					500: '#8c7ae6',
					600: '#7158e2',
					700: '#6c5ce7',
					800: '#4834d4',
					900: '#382bb3'
				},
				// Gray scale with slight purple tint
				neutral: {
					50: '#f9f9ff',
					100: '#f0f2f5',
					200: '#e4e6eb',
					300: '#e3e1f0',
					400: '#c1c5d0',
					500: '#9ca3af',
					600: '#65676b',
					700: '#4b5563',
					800: '#2a2d34',
					900: '#18191a'
				},
				// Functional colors
				success: {
					50: '#ecfdf5',
					100: '#d1fae5',
					500: '#00b894',
					700: '#047857'
				},
				warning: {
					50: '#fffbeb',
					100: '#fef3c7',
					500: '#fdcb6e',
					700: '#b45309'
				},
				error: {
					50: '#fdf2f8',
					100: '#fce7f3',
					500: '#e84393',
					700: '#be185d'
				},
				info: {
					50: '#eff6ff',
					100: '#dbeafe',
					500: '#74b9ff',
					700: '#1d4ed8'
				},
				brand: {
					purple: '#6c5ce7',
					purpleDark: '#4834d4',
					purpleLight: '#a29bfe',
					gold: '#d4af37'
				},
				accent: {
					marble: '#f5f5f0',
					parchment: '#f2ebd8',
					aegean: '#1a5276',
					olive: '#71723c'
				},
				semantic: {
					success: '#00b894',
					warning: '#fdcb6e',
					info: '#74b9ff',
					danger: '#e84393'
				}
			},
			boxShadow: {
				sm: '0 1px 3px rgba(108, 92, 231, 0.08)',
				md: '0 4px 6px rgba(108, 92, 231, 0.1)',
				lg: '0 10px 15px rgba(108, 92, 231, 0.1)',
				xl: '0 20px 25px rgba(108, 92, 231, 0.1)'
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
				heading: fontSans,
				serif: fontSerif,
				mono: fontMono
			},
			maxWidth: {
				'7xl': '72rem',
				'8xl': '88rem'
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme('colors.neutral.800'),
						fontSize: '1rem',
						lineHeight: '1.5',
						maxWidth: '68ch',
						'> *': {
							marginTop: '0.75em',
							marginBottom: '0.75em'
						},
						a: {
							color: theme('colors.primary.700'),
							fontWeight: 600,
							textDecoration: 'none',
							'&:hover': {
								color: theme('colors.primary.800'),
								textDecoration: 'underline'
							}
						},
						h1: {
							color: theme('colors.neutral.900'),
							fontFamily: theme('fontFamily.heading').join(','),
							fontSize: '2.25rem',
							lineHeight: '1.2',
							marginBottom: '0.75em'
						},
						h2: {
							color: theme('colors.neutral.900'),
							fontFamily: theme('fontFamily.heading').join(','),
							fontSize: '1.75rem',
							lineHeight: '1.25',
							marginTop: '1.5em'
						},
						h3: {
							color: theme('colors.neutral.800'),
							fontFamily: theme('fontFamily.heading').join(','),
							fontSize: '1.375rem',
							lineHeight: '1.3'
						},
						h4: {
							color: theme('colors.neutral.800'),
							fontWeight: 600
						},
						p: {
							marginTop: '0.5em',
							marginBottom: '0.5em'
						},
						strong: {
							color: theme('colors.neutral.900')
						},
						blockquote: {
							borderLeftColor: theme('colors.primary.500'),
							fontStyle: 'normal',
							paddingLeft: '1rem',
							color: theme('colors.neutral.800')
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
							backgroundColor: theme('colors.neutral.100')
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
