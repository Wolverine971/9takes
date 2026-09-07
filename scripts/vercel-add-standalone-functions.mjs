// scripts/vercel-add-standalone-functions.mjs
//
// Adds standalone (non-SvelteKit) serverless functions to the Vercel Build
// Output that adapter-vercel already wrote to .vercel/output.
//
// Why this exists: the RFC 8058 one-click unsubscribe endpoint must accept a
// form-encoded POST from mail providers that carry no Origin header, which
// SvelteKit's CSRF guard rejects before any hook runs. The obvious workaround,
// a root-level api/ folder, makes Vercel treat /api/* as its own function
// namespace and silently 404 every dynamic SvelteKit route under /api/
// (click tracking, open pixel, unsubscribe, reply-return links). That broke
// every email link from 2026-09-01 to 2026-09-07. So instead we bundle the
// handler here and register it in the same Build Output the adapter produces.
//
// Runs after `vite build` in `build:vercel`. Safe no-op outside a Vercel build
// (no .vercel/output directory).

import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(root, '.vercel', 'output');
const configPath = join(outputDir, 'config.json');

const FUNCTIONS = [
	{
		// Public URL: https://9takes.com/api/one-click-unsubscribe?tracking_id=...
		name: 'api/one-click-unsubscribe',
		entry: join(root, 'vercel-functions', 'one-click-unsubscribe.ts'),
		exportName: 'handleOneClickUnsubscribe',
		routeSrc: '^/api/one-click-unsubscribe/?$'
	}
];

if (!existsSync(configPath)) {
	console.log('[vercel-add-standalone-functions] no .vercel/output/config.json; skipping');
	process.exit(0);
}

// esbuild is not hoisted under pnpm; resolve it through vite's dependency tree.
const esbuildPath = require.resolve('esbuild', {
	paths: [dirname(require.resolve('vite/package.json'))]
});
const esbuild = require(esbuildPath);

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const adapterConfig = JSON.parse(
	readFileSync(
		join(outputDir, 'functions', firstAdapterFunction(outputDir), '.vc-config.json'),
		'utf8'
	)
);

for (const fn of FUNCTIONS) {
	const funcDir = join(outputDir, 'functions', `${fn.name}.func`);
	mkdirSync(funcDir, { recursive: true });

	const entrySource = `import { ${fn.exportName} as handler } from ${JSON.stringify(fn.entry)};
export default { fetch(request) { return handler(request); } };
`;

	await esbuild.build({
		stdin: { contents: entrySource, resolveDir: root, loader: 'js', sourcefile: 'entry.mjs' },
		bundle: true,
		platform: 'node',
		format: 'esm',
		target: 'node22',
		outfile: join(funcDir, 'index.mjs'),
		logLevel: 'warning',
		// Same runtime as the adapter's functions; nothing external so the
		// function is self-contained.
		external: []
	});

	writeFileSync(join(funcDir, 'package.json'), JSON.stringify({ type: 'module' }));
	writeFileSync(
		join(funcDir, '.vc-config.json'),
		JSON.stringify(
			{
				runtime: adapterConfig.runtime ?? 'nodejs22.x',
				regions: adapterConfig.regions,
				handler: 'index.mjs',
				launcherType: 'Nodejs',
				experimentalResponseStreaming: true
			},
			null,
			'\t'
		)
	);

	// Register the route ahead of the adapter's routes so it wins over the
	// catch-all. Idempotent: rebuilds don't duplicate it.
	config.routes = (config.routes ?? []).filter((r) => r.dest !== `/${fn.name}`);
	config.routes.unshift({ src: fn.routeSrc, dest: `/${fn.name}` });

	console.log(`[vercel-add-standalone-functions] wrote ${fn.name}.func and route ${fn.routeSrc}`);
}

writeFileSync(configPath, JSON.stringify(config, null, '\t'));

function firstAdapterFunction(dir) {
	// Any adapter-written function will do as the template for runtime/regions.
	const candidates = ['about.func', 'account.func', 'questions.func'];
	for (const c of candidates) {
		if (existsSync(join(dir, 'functions', c, '.vc-config.json'))) return c;
	}
	throw new Error('No adapter-vercel function found in .vercel/output/functions');
}
