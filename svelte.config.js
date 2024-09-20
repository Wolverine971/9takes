import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig),
		{
			postcss: true,
			preserve: ['ld+json'],
			scss: {
				prependData: `@import './src/scss/index.scss';`
			},
			typescript: true
		}
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
