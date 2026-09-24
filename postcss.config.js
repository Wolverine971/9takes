// postcss.config.js
export default {
	plugins: {
		'postcss-simple-vars': {},
		tailwindcss: {},
		autoprefixer: {},
		'postcss-preset-env': {
			stage: 1,
			// Its :has() polyfill emits an escaped attribute selector that
			// Lightning CSS cannot minify. Keep the native selector instead.
			features: { 'has-pseudo-class': false }
		}
	}
};
