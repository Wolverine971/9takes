// vite.config.ts
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [enhancedImages(), sveltekit(), nodeLoaderPlugin()],
	resolve: {
		preserveSymlinks: false
	},

	define: {
		// Public variables (accessible in client-side code)
		'import.meta.env.VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
		'import.meta.env.PUBLIC_GOOGLE': JSON.stringify(process.env.PUBLIC_GOOGLE),
		'import.meta.env.VITE_UNSECURE_SECRET': JSON.stringify(process.env.VITE_UNSECURE_SECRET)
	},
	test: {
		include: [
			'src/**/*.{test,spec}.{js,ts}',
			'src/**/**/*.{test,spec}.{js,ts}',
			'src/**/**/**/*.{test,spec}.{js,ts}'
		]
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern'
			}
		}
	}
};

export default config;
