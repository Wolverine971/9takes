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
				primary: {
					900: '#000000', // Black
					800: '#1A0033', // Dark Purple
					700: '#833BFF', // Medium Purple
					600: '#BC96FD', // Light Purple
					500: '#B3A6C9', // Lavender
					400: '#1A1A1A', // Dark Grey
					300: '#A0A0A0', // Medium Grey
					200: '#C0C0C0', // Light Grey
					100: '#F0F0F0', // Very Light Grey (added for completeness)
					50: '#FAFAFA' // Almost White (added for completeness)
				},
				// You can keep or modify these additional color schemes as needed
				secondary: {
					// ... (keep or modify as desired)
				},
				accent: {
					// ... (keep or modify as desired)
				},
				tertiary: {
					// ... (keep or modify as desired)
				},
				neutral: {
					// ... (keep or modify as desired)
				}
			}
		}
	}
} as Config;
