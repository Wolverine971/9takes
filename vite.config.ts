import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import injectSocketIO from './src/utils/socket';
import { enhancedImages } from '@sveltejs/enhanced-img';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		enhancedImages(),
		sveltekit(),
		nodeLoaderPlugin(),
		dev && {
			name: 'webSocketServer',
			configureServer(server) {
				injectSocketIO(server.httpServer);
			}
		}
	],

	define: {
		// Public variables (accessible in client-side code)
		'import.meta.env.VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
		'import.meta.env.PUBLIC_GOOGLE': JSON.stringify(process.env.PUBLIC_GOOGLE),
		'import.meta.env.VITE_UNSECURE_SECRET': JSON.stringify(process.env.VITE_UNSECURE_SECRET),

		// Private variables (should only be used in server-side code)
		'process.env.PRIVATE_gmail_private_key': JSON.stringify(process.env.PRIVATE_gmail_private_key),
		'process.env.PRIVATE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.PRIVATE_GOOGLE_MAPS_API_KEY),
		'process.env.PRIVATE_ELASTIC_GENERAL': JSON.stringify(process.env.PRIVATE_ELASTIC_GENERAL),
		'process.env.PRIVATE_AI_API_KEY': JSON.stringify(process.env.PRIVATE_AI_API_KEY),
		'process.env.PRIVATE_WEBHOOK_AUTH': JSON.stringify(process.env.PRIVATE_WEBHOOK_AUTH),
		'process.env.PRIVATE_SIGNUP_KEY': JSON.stringify(process.env.PRIVATE_SIGNUP_KEY),
		'process.env.PRIVATE_ADMIN_EMAIL': JSON.stringify(process.env.PRIVATE_ADMIN_EMAIL),
		'process.env.PRIVATE_S3_BUCKET': JSON.stringify(process.env.PRIVATE_S3_BUCKET),
		'process.env.PRIVATE_S3_ACCESS_KEY_ID': JSON.stringify(process.env.PRIVATE_S3_ACCESS_KEY_ID),
		'process.env.PRIVATE_S3_SECRET_ACCESS_KEY': JSON.stringify(process.env.PRIVATE_S3_SECRET_ACCESS_KEY)
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
				javascriptEnabled: true,
				// silenceDeprecations: ['legacy-js-api']
				api: 'modern-compiler',
			}
		}
	}
};

export default config;