// eslint.config.js
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';

const browserGlobals = {
	window: 'readonly',
	document: 'readonly',
	navigator: 'readonly',
	console: 'readonly',
	fetch: 'readonly',
	FormData: 'readonly',
	File: 'readonly',
	FileReader: 'readonly',
	Blob: 'readonly',
	URL: 'readonly',
	URLSearchParams: 'readonly',
	CustomEvent: 'readonly',
	Event: 'readonly',
	HTMLElement: 'readonly',
	HTMLInputElement: 'readonly',
	HTMLTextAreaElement: 'readonly',
	HTMLSelectElement: 'readonly',
	HTMLButtonElement: 'readonly',
	MutationObserver: 'readonly',
	setTimeout: 'readonly',
	clearTimeout: 'readonly',
	setInterval: 'readonly',
	clearInterval: 'readonly',
	sessionStorage: 'readonly',
	localStorage: 'readonly',
	crypto: 'readonly'
};

const nodeGlobals = {
	process: 'readonly',
	Buffer: 'readonly',
	__dirname: 'readonly',
	__filename: 'readonly'
};

// Phase 7c (2026-05-05): banned raw Tailwind color/grayscale class roots.
// Use semantic V5 tokens (`var(--lamp-glow)`, `var(--ink-bright)`, `var(--stone-warm)`,
// `var(--data-teal)`) or Tailwind's `bg-[var(--…)]` arbitrary-value escape hatch instead.
// See docs/design-system.md §5 for the canonical palette.
const BANNED_TW_COLOR_ROOTS = [
	'slate',
	'gray',
	'zinc',
	'neutral',
	'stone',
	'red',
	'orange',
	'yellow',
	'green',
	'blue',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink'
].join('|');
const TW_SHADES = '50|100|200|300|400|500|600|700|800|900|950';
// Pattern catches `bg-gray-500`, `text-blue-700`, etc. as standalone class tokens.
// Doesn't try to match opacity-suffix variants (`bg-gray-500/50`) — PR review handles those.
const BANNED_TW_RE = new RegExp(
	`\\b(?:bg|text|border|ring|fill|stroke|from|via|to|outline|divide|placeholder|caret|accent|decoration|shadow)-(?:${BANNED_TW_COLOR_ROOTS})-(?:${TW_SHADES})\\b`
);

export default [
	{
		ignores: [
			'.svelte-kit/**',
			'.vercel/**',
			'build/**',
			'node_modules/**',
			'package/**',
			'public/**',
			'static/**',
			'logs/**',
			'test-results/**',
			'Freshies12/**',
			'Freshies13/**',
			'youtube-transcript-research/**',
			'youtube-transcripts/**',
			'youtube-transcripts-people/**',
			'database.types.ts',
			'src/lib/components/molecules/famousTypes.ts',
			'src/lib/generated/**',
			// Design preview routes intentionally inline raw Tailwind for documentation purposes.
			'src/routes/design-preview/**',
			// Styleguide is the canonical visual spec; raw Tailwind utilities used to demo what NOT to do.
			'src/routes/styleguide/**',
			// svelte-eslint-parser chokes on <script> tags inside template literals
			// (e.g. JSON-LD blobs in {@html `<script type="application/ld+json">…`}).
			// Skip these files until the parser ships a fix.
			'src/lib/components/SEOHead.svelte',
			'src/lib/components/blog/BlogPageHead.svelte',
			'src/lib/components/blog/PeopleBlogPageHead.svelte',
			'src/lib/components/blog/SuggestionsBlog.svelte',
			'src/lib/components/blog/SuggestionsPeople.svelte',
			'src/lib/components/blog/EnneagramCategoryIntro.svelte',
			'src/lib/components/atoms/MarqueeHorizontal.svelte',
			'src/routes/+layout.svelte',
			'src/routes/how-to-guides/**/+page.svelte',
			'src/routes/personality-analysis/type/**/+page.svelte',
			'src/routes/questions/categories/**/+page.svelte'
		]
	},
	js.configs.recommended,
	{
		files: ['**/*.{js,ts}'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			parser: tsParser,
			globals: {
				...browserGlobals,
				...nodeGlobals
			}
		},
		plugins: {
			'@typescript-eslint': tsPlugin
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'no-empty': 'off',
			'no-control-regex': 'off',
			'no-useless-escape': 'off',
			'no-dupe-class-members': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-var-requires': 'off'
		}
	},
	{
		files: ['**/*.cjs'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'commonjs',
			globals: nodeGlobals
		},
		rules: {
			'no-undef': 'off'
		}
	},
	// Svelte files — Phase 7c (2026-05-05): finally lintable. Raw Tailwind color/grayscale
	// classes are banned to enforce the V5 token palette; use semantic V5 tokens or
	// `bg-[var(--…)]` arbitrary-value classes instead.
	...sveltePlugin.configs['flat/recommended'].map((cfg) => {
		if (!cfg.files) return cfg;
		return {
			...cfg,
			languageOptions: {
				...cfg.languageOptions,
				parser: svelteParser,
				parserOptions: {
					...(cfg.languageOptions?.parserOptions ?? {}),
					parser: tsParser,
					ecmaVersion: 2022,
					sourceType: 'module',
					extraFileExtensions: ['.svelte']
				},
				globals: {
					...(cfg.languageOptions?.globals ?? {}),
					...browserGlobals,
					...nodeGlobals
				}
			}
		};
	}),
	{
		files: ['**/*.svelte'],
		rules: {
			// Most svelte/* defaults flag pre-existing legacy code. Keep the parser running
			// (which catches genuine syntax errors) but disable the rules that are noise
			// against today's codebase. Fold them in over time as they get cleaned up.
			'svelte/valid-compile': 'off',
			'svelte/no-at-html-tags': 'off',
			'svelte/no-unused-svelte-ignore': 'off',
			'svelte/require-each-key': 'off',
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/no-useless-mustaches': 'off',
			'svelte/prefer-svelte-reactivity': 'off',
			'svelte/infinite-reactive-loop': 'off',
			'svelte/no-reactive-reassign': 'off',
			'svelte/require-event-dispatcher-types': 'off',
			'svelte/no-immutable-reactive-statements': 'off',
			'svelte/no-not-function-handler': 'off',
			'svelte/no-object-in-text-mustaches': 'off',
			'svelte/no-shorthand-style-property-overrides': 'off',
			'svelte/no-trailing-spaces': 'off',
			'svelte/require-store-callbacks-use-set-param': 'off',
			'svelte/no-raw-special-elements': 'off',
			'svelte/prefer-writable-derived': 'off',
			'svelte/no-dom-manipulating': 'off',
			'svelte/no-reactive-functions': 'off',
			'no-self-assign': 'off',
			'no-inner-declarations': 'off',
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'no-control-regex': 'off',
			'no-empty': 'off',
			'no-useless-escape': 'off',
			'no-case-declarations': 'off',
			// Phase 7c (2026-05-05): ban raw Tailwind color/grayscale class roots in
			// static class="…" attrs. Use V5 tokens or `bg-[var(--token)]` instead.
			// Dynamic class={...} expressions can't be caught; PR review is the net there.
			'no-restricted-syntax': [
				'error',
				{
					selector: `SvelteAttribute[key.name='class'] SvelteLiteral[value=/${BANNED_TW_RE.source}/]`,
					message:
						'Raw Tailwind color/grayscale classes are banned. Use V5 tokens (--lamp-glow, --ink-*, --stone-*, --night-*, --data-teal) or `bg-[var(--token)]` arbitrary-value classes. See docs/design-system.md §5.'
				}
			]
		}
	},
	// Phase 7c (2026-05-05) — pre-existing raw Tailwind class violations.
	// These files were NOT cleaned up during the migration; the ban is active
	// for everything else. As each file migrates to V5 tokens, remove it from
	// this list. (10 files, ~57 violations as of 2026-05-05.)
	{
		files: [
			'src/lib/amp-stories/EnneagramMentalIllnessPromo.svelte',
			'src/lib/components/admin/BlogDiffViewer.svelte',
			'src/lib/components/error/ErrorBoundary.svelte',
			'src/lib/components/molecules/CategoryTree.svelte',
			'src/lib/components/molecules/Comment.svelte',
			'src/lib/components/molecules/WordCloud.svelte',
			'src/routes/admin/content-board/ContentEditorModal.svelte',
			'src/routes/admin/content-board/MetadataSidebar.svelte',
			'src/routes/email/+page.svelte',
			'src/routes/enneagram-test/+page.svelte'
		],
		rules: {
			'no-restricted-syntax': 'off'
		}
	},
	prettier
];
