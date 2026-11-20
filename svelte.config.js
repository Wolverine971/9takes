// svelte.config.js
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';

import mdsvexConfig from './mdsvex.config.js';
import { isBlogEmbedComponent } from './src/lib/blogEmbedCss.js';
import { buildCorpusTokenTable, resolveCorpusTokens } from './src/lib/corpusTokens.js';
import { pruneLegacyJsonLdFromMarkdown } from './src/lib/rehype-prune-legacy-jsonld.js';

/** @param {string | undefined} filename */
const isBlogContentFile = (filename) =>
	!!filename &&
	/\.(?:md|svx|svelte\.md)$/.test(filename) &&
	(filename.includes('/src/blog/') || filename.includes('\\src\\blog\\'));

// Live corpus numbers: `{{corpus.domain.music.type.4.share}}` becomes the current value from
// corpus-stats.json before mdsvex runs, so body, frontmatter and inline JSON-LD all get it.
// Read per file (not cached) and declared as a dependency so a regenerated file shows up in dev.
const corpusStatsPath = fileURLToPath(new URL('./src/lib/data/corpus-stats.json', import.meta.url));
const corpusTokensPreprocess = {
	name: 'corpus-tokens',
	markup({ content, filename }) {
		if (!isBlogContentFile(filename) || !content.includes('{{')) {
			return;
		}

		const table = buildCorpusTokenTable(JSON.parse(readFileSync(corpusStatsPath, 'utf8')));
		const code = resolveCorpusTokens(content, table, { source: filename });
		return code === content ? undefined : { code, dependencies: [corpusStatsPath] };
	}
};

const pruneLegacyJsonLdPreprocess = {
	name: 'prune-legacy-jsonld',
	markup({ content, filename }) {
		if (!isBlogContentFile(filename)) {
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
		corpusTokensPreprocess,
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

	compilerOptions: {
		// Every component compiles in runes mode, so Svelte 4 syntax (`export let`, `$:`, `<slot>`,
		// `on:click`, createEventDispatcher) fails the build instead of creeping back in. Two exceptions
		// infer their own mode: libraries in node_modules, and mdsvex markdown, whose generated
		// wrapper uses `$$props`. Components that posts embed must keep taking plain props + children.
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') || /\.(?:md|svx)$/.test(filename)
				? undefined
				: true
	},

	vitePlugin: {
		// Blog posts load through a lazy import.meta.glob in each [slug]/+page.ts. SvelteKit links
		// the CSS of every dynamic import a page can reach, because it cannot know which one a
		// request will render. With external CSS, every post page shipped every sibling post's
		// stylesheet (48 render-blocking sheets on /enneagram-corner/*). Injected CSS ships with
		// the post's own JS, so SSR inlines only the rendered post's styles. The handle hook
		// (src/lib/server/injectedStyleOrder.ts) keeps those styles after the stylesheet links so
		// the cascade order matches the old linked CSS. The components posts embed (callouts,
		// diagrams, the strategic question) get the same treatment: see src/lib/blogEmbedCss.js.
		dynamicCompileOptions({ filename }) {
			if (isBlogContentFile(filename) || isBlogEmbedComponent(filename)) {
				return { css: 'injected' };
			}
		}
	},

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
		// Ship each page's CSS inside the HTML instead of as 6 to 14 render-blocking files. On
		// a slow phone the page could not paint until those files arrived (1.3 to 1.9 s, while
		// the HTML itself was in at about 0.35 s); inlined, the same bytes ride in the HTML
		// (+20 to 31 KB compressed). The cascade is unchanged: SvelteKit merges the files in
		// their link order and keeps the links, disabled, so client-side navigation does not
		// load them again. Measured 2026-11-14: docs/taskers/T-41-assets/M-critical-css-plan.md.
		// Kill switch: set INLINE_PAGE_CSS=0 in the build environment and redeploy.
		inlineStyleThreshold: process.env.INLINE_PAGE_CSS === '0' ? 0 : Infinity,
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
					'https://challenges.cloudflare.com',
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
					'https://challenges.cloudflare.com',
					'https://www.google.com',
					'https://www.youtube.com',
					'https://www.youtube-nocookie.com',
					'https://open.spotify.com',
					'https://player.vimeo.com',
					'https://www.tiktok.com'
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
