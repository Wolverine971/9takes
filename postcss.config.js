// postcss.config.js
export default {
	plugins: {
		'postcss-simple-vars': {},
		tailwindcss: {},
		autoprefixer: {},
		'postcss-preset-env': {
			stage: 1,
			features: {
				// Its :has() polyfill emits an escaped attribute selector that
				// Lightning CSS cannot minify. Keep the native selector instead.
				'has-pseudo-class': false,
				// These polyfills emit `.x.focus-visible` / `.x[focus-within]` twins that
				// only match with their JS runtime (never loaded) — dead bytes in every
				// component, and 100+ false css_unused_selector warnings.
				'focus-visible-pseudo-class': false,
				'focus-within-pseudo-class': false,
				// These rewrite `margin-inline-start`, `text-align: start`, etc. into
				// `[dir="ltr"] …` rules. <html> carries no dir attribute, so the rewritten
				// rules never matched and the declarations silently vanished. Every
				// supported browser handles logical properties natively.
				'logical-properties-and-values': false,
				'dir-pseudo-class': false
			}
		}
	}
};
