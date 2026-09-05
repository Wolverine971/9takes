// scripts/check-server-runtime.mjs
// Newer local Node versions can require ESM, masking Vercel runtime failures.
// Import the built article processor with that feature disabled before deploying.
import assert from 'node:assert/strict';

assert.equal(
	process.features.require_module,
	false,
	'Run this check with node --no-experimental-require-module'
);

await import('../.svelte-kit/output/server/chunks/blogContentProcessor.js');
console.log('✓ Built article processor loads without require(ESM) support.');
