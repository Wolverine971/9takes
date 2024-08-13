import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';
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
				prependData: `@import './src/scss/index.scss';`
			}
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
		// Uncomment and adjust as needed:
		// prerender: {
		//   entries: ['/enneagram-corner/1', '/enneagram-corner/2']
		// },
		// csp: {
		//   directives: {
		//     'script-src': ['self']
		//   }
		// }
	}
};

export default config;
