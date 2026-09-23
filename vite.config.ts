// vite.config.ts
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger, type ConfigEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// A package plus everything it depends on, resolved the way Node would (pnpm nests deps).
function dependencyClosure(name: string, fromDir: string, found = new Set<string>()): string[] {
	if (found.has(name)) return [...found];
	for (let dir = fromDir; ; dir = path.dirname(dir)) {
		const manifest = path.join(dir, 'node_modules', name, 'package.json');
		if (fs.existsSync(manifest)) {
			found.add(name);
			const pkgDir = fs.realpathSync(path.dirname(manifest));
			const { dependencies = {} } = JSON.parse(fs.readFileSync(manifest, 'utf8'));
			for (const dep of Object.keys(dependencies)) dependencyClosure(dep, pkgDir, found);
			return [...found];
		}
		if (dir === path.dirname(dir)) return [...found];
	}
}
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

const config = ({ command }: ConfigEnv) => ({
	customLogger: logger,
	plugins: [enhancedImages(), sveltekit(), svelteTesting()],
	resolve: {
		preserveSymlinks: false
	},
	ssr: {
		// Vercel's runtime cannot require htmlparser2's ESM entry from sanitize-html, so
		// sanitize-html is bundled. Rolldown leaves a bundled CommonJS module's require()
		// calls as runtime requires that Vercel's file tracer never sees, so everything
		// sanitize-html reaches must be bundled with it (bundling it alone 500'd every
		// personality page on 2026-09-22). check:server-runtime guards this.
		// Build-only: the dev SSR runner can't evaluate CommonJS, so inlining it there
		// throws `require is not defined` on every page that sanitizes HTML.
		noExternal: command === 'build' ? dependencyClosure('sanitize-html', __dirname) : []
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
			'src/**/**/**/*.{test,spec}.{js,ts}',
			// Standalone Vercel functions live outside src/ so they bypass
			// SvelteKit's CSRF guard. They must NOT live in a root api/ folder:
			// Vercel treats that as its own functions dir and 404s every dynamic
			// /api/* SvelteKit route (see scripts/vercel-add-standalone-functions.mjs).
			'vercel-functions/**/*.{test,spec}.{js,ts}',
			'scripts/**/*.{test,spec}.{js,mjs,ts}'
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
});

export default config;
