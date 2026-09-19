// src/lib/server/waitUntilUsage.spec.ts
import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import fastGlob from 'fast-glob';

// @sveltejs/adapter-vercel's Node runtime never passes `platform`, so
// `event.platform.context.waitUntil` is always undefined in production and the
// fallback fire-and-forget promise gets frozen when the response returns. This
// silently killed question post-processing, admin tagging, and content-access
// telemetry. Background work must go through runBestEffortTelemetry or
// `waitUntil` from @vercel/functions.
const PLATFORM_WAIT_UNTIL = /\.context\??\.waitUntil|platform\??\.waitUntil/;
const ALLOWED_FILES = new Set(['src/lib/server/bestEffortTelemetry.ts']);

describe('background work on Vercel', () => {
	it('never reads waitUntil from event.platform directly', async () => {
		const files = await fastGlob(['src/**/*.ts'], { ignore: ['src/**/*.spec.ts'] });
		const offenders: string[] = [];

		for (const file of files) {
			if (ALLOWED_FILES.has(file)) continue;
			const source = await fs.readFile(file, 'utf8');
			if (PLATFORM_WAIT_UNTIL.test(source)) offenders.push(file);
		}

		expect(offenders).toEqual([]);
	});
});
