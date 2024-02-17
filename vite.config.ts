import { sveltekit } from '@sveltejs/kit/vite';
import { join } from 'path';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import injectSocketIO from './src/utils/socket';
import { partytownVite } from '@builder.io/partytown/utils';
import { enhancedImages } from '@sveltejs/enhanced-img';

const dev = process.env.NODE_ENV === 'development';

let webSocketServer;
if (dev) {
	webSocketServer = {
		name: 'webSocketServer',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		configureServer(server: any) {
			injectSocketIO(server.httpServer);
		}
	};
}

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		enhancedImages(),
		sveltekit(),
		nodeLoaderPlugin(),
		dev && webSocketServer,
		partytownVite({
			// `dest` specifies where files are copied to in production
			dest: join(process.cwd(), 'static', '~partytown')
		})
	],

	define: {
		'import.meta.env.VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
		'import.meta.env.PUBLIC_GOOGLE': JSON.stringify(process.env.PUBLIC_GOOGLE),
		'import.meta.env.PRIVATE_gmail_private_key': JSON.stringify(
			process.env.PRIVATE_gmail_private_key
		),
		'import.meta.env.PRIVATE_GOOGLE_MAPS_API_KEY': process.env.PRIVATE_GOOGLE_MAPS_API_KEY,

		'import.meta.env.PRIVATE_ELASTIC_GENERAL': process.env.PRIVATE_ELASTIC_GENERAL,
		'import.meta.env.PRIVATE_AI_API_KEY': process.env.PRIVATE_AI_API_KEY,
		'import.meta.env.PRIVATE_WEBHOOK_AUTH': process.env.PRIVATE_WEBHOOK_AUTH,
		'import.meta.env.VITE_UNSECURE_SECRET': process.env.VITE_UNSECURE_SECRET,
		'import.meta.env.PRIVATE_SIGNUP_KEY': process.env.PRIVATE_SIGNUP_KEY
	},
	test: {
		include: [
			'src/**/*.{test,spec}.{js,ts}',
			'src/**/**/*.{test,spec}.{js,ts}',
			'src/**/**/**/*.{test,spec}.{js,ts}'
		]
	}
};

export default config;
