// svelte.config.js
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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

// Hash the existing theme bootstraps so cached editorial pages need no reusable nonce.
const themeScripts = [
	...readFileSync(new URL('./src/app.html', import.meta.url), 'utf8').matchAll(
		/<script>([\s\S]*?)<\/script>/g
	),
	...readFileSync(new URL('./src/routes/+layout.svelte', import.meta.url), 'utf8').matchAll(
		/\{@html `<script>([\s\S]*?)<\/script>`\}/g
	)
].map((match) => `sha256-${createHash('sha256').update(match[1]).digest('base64')}`);

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
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': [
					'self',
					...themeScripts,
					'https://www.googletagmanager.com',
					'https://www.google.com/recaptcha/',
					'https://www.gstatic.com/recaptcha/',
					'https://us-assets.i.posthog.com',
					'https://api.mapbox.com',
					'https://cdn.ampproject.org',
					'https://cdn.jsdelivr.net/npm/medium-editor@5.23.3/dist/js/medium-editor.min.js'
				],
				'script-src-attr': ['none'],
				'style-src': ['self', 'unsafe-inline', 'https:'],
				'img-src': ['self', 'data:', 'blob:', 'https:'],
				'font-src': ['self', 'data:', 'https:'],
				'connect-src': [
					'self',
					'https://nhjjzcsnmyotyhykbajc.supabase.co',
					'wss://nhjjzcsnmyotyhykbajc.supabase.co',
					'https://*.posthog.com',
					'https://*.i.posthog.com',
					'https://*.google-analytics.com',
					'https://*.analytics.google.com',
					'https://www.google.com',
					'https://www.googletagmanager.com',
					'https://api.mapbox.com',
					'https://events.mapbox.com',
					'https://vitals.vercel-insights.com'
				],
				'frame-src': [
					'self',
					'https://www.google.com',
					'https://www.youtube.com',
					'https://www.youtube-nocookie.com',
					'https://open.spotify.com',
					'https://player.vimeo.com'
				],
				'media-src': ['self', 'blob:', 'https:'],
				'worker-src': ['self', 'blob:'],
				'frame-ancestors': ['self'],
				'object-src': ['none'],
				'base-uri': ['none'],
				'form-action': ['self']
			}
		},
		csrf: {
			trustedOrigins: []
		}
	}
};

export default config;
