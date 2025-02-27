import type { Config } from 'tailwindcss';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./src/routes/**/*.{html,js,svelte,ts}',
		'./src/routes/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin'), require('@tailwindcss/typography')],
	darkMode: 'selector',

	theme: {
		extend: {
			colors: {
				// Modern purple-focused palette
				primary: {
					50: '#f7f7ff',     // Very light purple tint
					100: '#e9e4ff',    // Light purple background
					200: '#d1c9ff',    // Soft light purple
					300: '#b2a8ff',    // Medium light purple
					400: '#a29bfe',    // Light purple
					500: '#8c7ae6',    // Main accent
					600: '#7158e2',    // Medium purple
					700: '#6c5ce7',    // Main primary color
					800: '#4834d4',    // Dark purple
					900: '#382bb3',    // Very dark purple
				},
				// Gray scale with slight purple tint
				neutral: {
					50: '#f9f9ff',     // Off-white with purple tint
					100: '#f0f2f5',    // Lightest gray
					200: '#e4e6eb',    // Light gray
					300: '#e3e1f0',    // Light purplish gray
					400: '#c1c5d0',    // Medium gray
					500: '#9ca3af',    // Standard gray
					600: '#65676b',    // Dark gray
					700: '#4b5563',    // Darker gray
					800: '#2a2d34',    // Very dark gray
					900: '#18191a',    // Off-black
				},
				// Functional colors
				success: {
					50: '#ecfdf5',
					100: '#d1fae5',
					500: '#00b894',    // Main success
					700: '#047857',
				},
				warning: {
					50: '#fffbeb',
					100: '#fef3c7',
					500: '#fdcb6e',    // Main warning
					700: '#b45309',
				},
				error: {
					50: '#fdf2f8',
					100: '#fce7f3',
					500: '#e84393',    // Main error - pinkish purple
					700: '#be185d',
				},
				info: {
					50: '#eff6ff',
					100: '#dbeafe',
					500: '#74b9ff',    // Main info
					700: '#1d4ed8',
				},
			},
			boxShadow: {
				sm: '0 1px 3px rgba(108, 92, 231, 0.08)',
				md: '0 4px 6px rgba(108, 92, 231, 0.1)',
				lg: '0 10px 15px rgba(108, 92, 231, 0.1)',
				xl: '0 20px 25px rgba(108, 92, 231, 0.1)',
			},
			borderRadius: {
				'sm': '0.25rem',
				DEFAULT: '0.5rem',
				'lg': '0.75rem',
				'xl': '1rem',
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						a: {
							color: theme('colors.primary.700'),
							'&:hover': {
								color: theme('colors.primary.800'),
							},
						},
						h1: {
							color: theme('colors.neutral.900'),
						},
						h2: {
							color: theme('colors.neutral.900'),
						},
						h3: {
							color: theme('colors.neutral.800'),
						},
						h4: {
							color: theme('colors.neutral.800'),
						},
					},
				},
			}),
		},
	},
} as Config;