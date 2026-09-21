#!/usr/bin/env node
// scripts/revalidate-personality.mjs
//
// Refresh the ISR cache for /personality-analysis/[slug] pages.
//
// Those pages are served from one stored copy per path, so content pushed
// straight to Supabase (pnpm push:people, SQL, a backfill) stays invisible
// until the copy is replaced. Editing through /admin/content-board already
// revalidates itself; this is the CLI for everything else.
//
//   node scripts/revalidate-personality.mjs pedro-pascal zendaya
//   node scripts/revalidate-personality.mjs --all
//   node scripts/revalidate-personality.mjs --all --dry-run
//
// Env: BYPASS_TOKEN (required to send), SITE_ORIGIN (default https://9takes.com).
// Always exits 0: a missed refresh only means the page serves its previous copy
// until the 24h expiration, which must never fail a content push.

import { readFileSync } from 'node:fs';
import path from 'node:path';

const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://9takes.com').replace(/\/+$/, '');
const SITEMAP_PATH = path.join(process.cwd(), 'static/sitemap.xml');
const CONCURRENCY = 5;
const REQUEST_TIMEOUT_MS = 15_000;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const wantsAll = args.includes('--all');
const slugArgs = args.filter((arg) => !arg.startsWith('-'));

/** Personality slugs currently in the sitemap (published pages only). */
function slugsFromSitemap() {
	let xml;
	try {
		xml = readFileSync(SITEMAP_PATH, 'utf8');
	} catch {
		console.error(
			`[revalidate] Could not read ${SITEMAP_PATH}. Run \`pnpm gen:sitemap\` first, or pass slugs explicitly.`
		);
		return [];
	}

	const slugs = new Set();
	for (const match of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
		const loc = match[1];
		const personality = loc.match(/\/personality-analysis\/([^/<]+)$/);
		if (!personality) continue;
		const slug = personality[1];
		// Skip the hub's own sub-sections; only slug pages are ISR-cached.
		if (slug === 'categories' || slug === 'type') continue;
		slugs.add(slug);
	}

	return [...slugs];
}

async function revalidate(slug, token) {
	const url = `${SITE_ORIGIN}/personality-analysis/${encodeURIComponent(slug)}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: { 'x-prerender-revalidate': token, Accept: 'text/html' },
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
		});

		return { slug, ok: response.ok, status: response.status };
	} catch (error) {
		return { slug, ok: false, status: 0, error: error?.message ?? String(error) };
	}
}

async function main() {
	const slugs = wantsAll ? slugsFromSitemap() : slugArgs;

	if (!slugs.length) {
		console.log(
			'[revalidate] Nothing to do. Pass one or more slugs, or --all to refresh every published personality page.'
		);
		return;
	}

	console.log(`[revalidate] ${slugs.length} page(s) at ${SITE_ORIGIN}`);

	if (dryRun) {
		for (const slug of slugs) console.log(`  would refresh /personality-analysis/${slug}`);
		console.log('[revalidate] DRY RUN — nothing sent.');
		return;
	}

	const token = process.env.BYPASS_TOKEN;
	if (!token) {
		console.log(
			'[revalidate] BYPASS_TOKEN is not set — nothing sent.\n' +
				'  1. Vercel → Project Settings → Environment Variables → add BYPASS_TOKEN (32+ random chars).\n' +
				'  2. Redeploy so the build picks it up (it is read at build time by the isr config).\n' +
				'  3. Locally: vercel env pull .env.development.local, or export BYPASS_TOKEN=...'
		);
		return;
	}

	const queue = [...slugs];
	const results = [];

	await Promise.all(
		Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
			while (queue.length) {
				const slug = queue.shift();
				if (!slug) return;
				results.push(await revalidate(slug, token));
			}
		})
	);

	const failed = results.filter((result) => !result.ok);
	console.log(`[revalidate] refreshed ${results.length - failed.length}/${results.length}`);

	for (const failure of failed) {
		console.warn(
			`  failed: ${failure.slug} (status ${failure.status}${failure.error ? `, ${failure.error}` : ''})`
		);
	}
}

main().catch((error) => {
	// Never fail a content push over a cache refresh.
	console.error('[revalidate] Unexpected failure:', error?.message ?? error);
});
