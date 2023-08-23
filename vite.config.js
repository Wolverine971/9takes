import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), nodeLoaderPlugin()],
	define: {
		'import.meta.env.VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
		'import.meta.env.PUBLIC_GOOGLE': JSON.stringify(process.env.PUBLIC_GOOGLE),
		'import.meta.env.PRIVATE_gmail_private_key': JSON.stringify(
			process.env.PRIVATE_gmail_private_key
		),
		'import.meta.env.PRIVATE_ELASTIC_GENERAL': process.env.PRIVATE_ELASTIC_GENERAL,
		'import.meta.env.PRIVATE_AI_API_KEY': process.env.PRIVATE_AI_API_KEY,
		'import.meta.env.PRIVATE_DEMO': process.env.PRIVATE_DEMO === 'true'
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
