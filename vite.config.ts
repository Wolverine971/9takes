// vite.config.ts
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scssMixinsPath = path.resolve(__dirname, 'src/scss/_mixins.scss').replace(/\\/g, '/');
const scssMixinsUse = `@use '${scssMixinsPath}' as *;`;

function normalizeScssFilename(filename?: string): string {
	if (!filename) return '';

	let normalized = filename.split(/[?#]/)[0].replace(/\\/g, '/');
	if (normalized.startsWith('/@fs/')) {
		normalized = normalized.replace(/^\/@fs\/+/, '/');
	}

	return (path.isAbsolute(normalized) ? normalized : path.resolve(__dirname, normalized)).replace(
		/\\/g,
		'/'
	);
}

function injectGlobalScssMixins(source: string, filename?: string): string {
	if (normalizeScssFilename(filename) === scssMixinsPath) {
		return source;
	}

	return `${scssMixinsUse}\n${source}`;
}

const logger = createLogger();
const originalWarn = logger.warn.bind(logger);
logger.warn = (msg, options) => {
	// Suppress unactionable third-party sourcemap/annotation warnings.
	if (msg.includes('sourcemap for reporting an error') && msg.includes('node_modules')) return;
	if (
		msg.includes('contains an annotation that Rollup cannot interpret') &&
		msg.includes('node_modules')
	)
		return;
	originalWarn(msg, options);
};

/** @type {import('vite').UserConfig} */
const config = {
	customLogger: logger,
	plugins: [enhancedImages(), sveltekit(), svelteTesting()],
	resolve: {
		preserveSymlinks: false
	},

	define: {
		// Public variables (accessible in client-side code)
		'import.meta.env.VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
		'import.meta.env.PUBLIC_GOOGLE': JSON.stringify(process.env.PUBLIC_GOOGLE)
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
				api: 'modern',
				additionalData: injectGlobalScssMixins
			}
		}
	}
};

export default config;
