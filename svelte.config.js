import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import mdsvexConfig from './mdsvex.config.js';
import { mdsvex } from 'mdsvex';
// import svelte from 'rollup-plugin-svelte'
// + import sveltePreprocess from 'svelte-preprocess';

const filePath = dirname(fileURLToPath(import.meta.url));
const sassPath = `${filePath}\\src\\scss\\`;

// C:\Users\djway\Desktop\svelte\9takes\src\scss\index.scss
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig),
		preprocess({
			postcss: true,
			preserve: ['ld+json'],
			// scss: {
			// 	prependData: `@import '${sassPath}index.scss';`
			// }
			scss: {
				prependData: `@import './src/scss/index.scss';`
			}
		})
	],
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	css: (css) => {
		css.write('public/bundle.css');
	},
	// scss: { includePaths: ['./src/scss/index'] },

	kit: {
		adapter: adapter(),
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;

// import adapter from '@sveltejs/adapter-auto';
// import preprocess from 'svelte-preprocess';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	// Consult https://github.com/sveltejs/svelte-preprocess
// 	// for more information about preprocessors
// 	preprocess: [
// 		vitePreprocess(),
// 		preprocess({
// 			postcss: true
// 		})
// 	],

// 	kit: {
// 		adapter: adapter(),
// 		serviceWorker: {
// 			register: true
// 		},
// 		vite: {
// 			optimizeDeps: {}
// 		}
// 	}
// };

// export default config;
