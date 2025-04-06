import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';

import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig),
		preprocess({
			postcss: true,
			preserve: ['ld+json'],
			scss: {
				prependData: `@use './src/scss/index.scss' as *;`
			},
			typescript: true
		})
	],

	extensions: ['.svelte', ...mdsvexConfig.extensions],

	onwarn: (warning, handler) => {
		if (warning.code !== 'css-unused-selector') {
			handler(warning);
		}
	},

	kit: {
		adapter: adapter(),
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
