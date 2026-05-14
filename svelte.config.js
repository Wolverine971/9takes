// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';

import mdsvexConfig from './mdsvex.config.js';
import { pruneLegacyJsonLdFromMarkdown } from './src/lib/rehype-prune-legacy-jsonld.js';

const pruneLegacyJsonLdPreprocess = {
	name: 'prune-legacy-jsonld',
	markup({ content, filename }) {
		if (
			!filename ||
			!/\.(?:md|svx|svelte\.md)$/.test(filename) ||
			!(filename.includes('/src/blog/') || filename.includes('\\src\\blog\\'))
		) {
			return;
		}

		const code = pruneLegacyJsonLdFromMarkdown(content);
		return code === content ? undefined : { code };
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		pruneLegacyJsonLdPreprocess,
		vitePreprocess(),
		mdsvex(mdsvexConfig),
		preprocess({
			postcss: true,
			preserve: ['ld+json'],
			typescript: true
		})
	],

	extensions: ['.svelte', ...mdsvexConfig.extensions],

	onwarn: (warning, handler) => {
		if (warning.code !== 'css-unused-selector' && warning.code !== 'css_unused_selector') {
			handler(warning);
		}
	},

	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x',
			regions: ['iad1']
		}),
		paths: {
			relative: false
		},
		csrf: {
			trustedOrigins: []
		}
	}
};

export default config;
