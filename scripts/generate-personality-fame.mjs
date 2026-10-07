#!/usr/bin/env node
// scripts/generate-personality-fame.mjs
//
// Fame snapshot for ordering the type hubs (/personality-analysis/type/[slug]).
// Sums Wikipedia pageviews (all-access, user agents, daily) over the last 365
// complete days for every published profile and writes
// src/lib/generated/personalityFame.json:
//
//   { generatedAt, windowDays, views: { "<normalized slug>": number } }
//
// Keys use the same normalizePersonalitySlug the hub uses to build its slugs.
// Fail-soft per person: no article, no data, or an API error counts as 0, and
// the hub falls back to date order for anyone without a positive count.
//
// Profiles without a `wikipedia` URL get one guess from their display name. The
// guess is kept only when the article exists, is not a disambiguation page, and
// its short description reads like a person ("American actress (born 1996)").
// Accepted guesses are printed so they can be eyeballed.
//
// Run: pnpm gen:personality-fame (manual refresh; NOT part of the build).

import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { normalizePersonalitySlug, resolvePersonalityImageSlug } from './lib/personalitySeo.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'lib', 'generated', 'personalityFame.json');

const USER_AGENT = '9takes-fame-snapshot/1.0 (https://9takes.com)';
// A full year so a single news spike (a trial, a viral week) doesn't outrank
// lasting fame. Daily data for 365 days is still one request per person.
const WINDOW_DAYS = 365;
const CONCURRENCY = 5;
const PAGE_SIZE = 1000;
// The MediaWiki action API rate-limits bursts; one request per second keeps it quiet.
const ACTION_API_DELAY_MS = 1100;
const TITLES_PER_ACTION_QUERY = 50;
const PERSON_DESCRIPTION =
	/\((born|b\.)\s?\d{4}\)|\(\d{4}\s?[–-]\s?\d{4}\)|\b(actor|actress|singer|rapper|songwriter|musician|comedian|streamer|youtuber|internet personality|influencer|podcaster|entrepreneur|businessman|businesswoman|executive|investor|author|writer|journalist|politician|athlete|player|model|presenter|host|director|producer|socialite|personality)\b/i;

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function getJson(url, { retries = 4 } = {}) {
	let status = 0;
	for (let attempt = 0; attempt <= retries; attempt += 1) {
		try {
			const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
			status = response.status;
			if (status === 404) return { status, body: null };
			if (status === 429 || status >= 500) {
				// Throttled or flaky: honor Retry-After when present, else back off exponentially.
				const retryAfter = Number(response.headers.get('retry-after'));
				await response.text().catch(() => '');
				if (attempt === retries) return { status, body: null };
				await sleep(
					Number.isFinite(retryAfter) && retryAfter > 0
						? retryAfter * 1000
						: ACTION_API_DELAY_MS * 2 ** (attempt + 1)
				);
				continue;
			}
			const text = await response.text();
			try {
				return { status, body: JSON.parse(text) };
			} catch {
				// Rate-limit responses can come back as plain text; back off and retry.
				if (attempt === retries) return { status, body: null };
				await sleep(ACTION_API_DELAY_MS * 2 ** (attempt + 1));
			}
		} catch {
			if (attempt === retries) return { status: 0, body: null };
			await sleep(ACTION_API_DELAY_MS * 2 ** (attempt + 1));
		}
	}
	return { status, body: null };
}

async function fetchPublishedPeople() {
	const url = process.env.PUBLIC_SUPABASE_URL;
	const key = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
	if (!url || !key) {
		throw new Error('Missing PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_PUBLISHABLE_KEY');
	}
	const supabase = createClient(url, key);
	const rows = [];
	for (let from = 0; ; from += PAGE_SIZE) {
		const { data, error } = await supabase
			.from('blogs_famous_people')
			.select('person, wikipedia')
			.eq('published', true)
			.order('person', { ascending: true })
			.range(from, from + PAGE_SIZE - 1);
		if (error) throw new Error(`Supabase fetch failed: ${error.message}`);
		rows.push(...(data ?? []));
		if (!data || data.length < PAGE_SIZE) break;
	}

	// `person` is not unique; keep one entry per normalized slug, preferring a row
	// that carries a Wikipedia URL.
	const bySlug = new Map();
	for (const row of rows) {
		const slug = normalizePersonalitySlug(row.person);
		if (!slug) continue;
		const wikipedia = typeof row.wikipedia === 'string' ? row.wikipedia.trim() : '';
		const existing = bySlug.get(slug);
		if (!existing || (!existing.wikipedia && wikipedia)) bySlug.set(slug, { slug, wikipedia });
	}
	return [...bySlug.values()];
}

/** "https://en.m.wikipedia.org/wiki/Beyonc%C3%A9#Life" -> { project, title: "Beyoncé" } */
function parseWikipediaUrl(raw) {
	try {
		const url = new URL(raw);
		const host = url.hostname.toLowerCase().replace('.m.wikipedia.org', '.wikipedia.org');
		if (!host.endsWith('.wikipedia.org') || !url.pathname.startsWith('/wiki/')) return null;
		const title = decodeURIComponent(url.pathname.slice('/wiki/'.length)).replace(/_/g, ' ');
		return title ? { project: host, title } : null;
	} catch {
		return null;
	}
}

function guessTitle(slug) {
	const base = resolvePersonalityImageSlug(slug) || slug;
	return base
		.split('-')
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(' ');
}

/**
 * Resolve titles to canonical articles via the action API (follows redirects,
 * reports missing pages, disambiguation flags, and short descriptions).
 * Returns Map<inputTitle, { title, missing, disambiguation, description }>.
 */
async function resolveTitles(project, titles) {
	const resolved = new Map();
	for (let index = 0; index < titles.length; index += TITLES_PER_ACTION_QUERY) {
		const batch = titles.slice(index, index + TITLES_PER_ACTION_QUERY);
		const query = new URLSearchParams({
			action: 'query',
			format: 'json',
			formatversion: '2',
			redirects: '1',
			prop: 'pageprops|description',
			ppprop: 'disambiguation',
			titles: batch.join('|')
		});
		await sleep(ACTION_API_DELAY_MS);
		const { body } = await getJson(`https://${project}/w/api.php?${query}`);
		const result = body?.query;
		if (!result) continue;

		const follow = new Map();
		for (const step of [...(result.normalized ?? []), ...(result.redirects ?? [])]) {
			follow.set(step.from, step.to);
		}
		const pages = new Map((result.pages ?? []).map((page) => [page.title, page]));

		for (const input of batch) {
			let title = input;
			for (let hops = 0; hops < 5 && follow.has(title); hops += 1) title = follow.get(title);
			const page = pages.get(title);
			if (!page) continue;
			resolved.set(input, {
				title: page.title,
				missing: Boolean(page.missing || page.invalid),
				disambiguation: Boolean(page.pageprops && 'disambiguation' in page.pageprops),
				description: page.description ?? ''
			});
		}
	}
	return resolved;
}

const ymd = (date) => date.toISOString().slice(0, 10).replace(/-/g, '');

function pageviewsWindow(now = new Date()) {
	const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
	const start = new Date(end.getTime() - (WINDOW_DAYS - 1) * 86400000);
	return { start: ymd(start), end: ymd(end) };
}

/** Returns { views, ok }. ok=false means the request failed (not "no article"). */
async function sumPageviews(project, title, window) {
	const article = encodeURIComponent(title.replace(/ /g, '_'));
	const url =
		`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${project}` +
		`/all-access/user/${article}/daily/${window.start}/${window.end}`;
	const { status, body } = await getJson(url);
	if (status === 404) return { views: 0, ok: true };
	if (!Array.isArray(body?.items)) return { views: 0, ok: false };
	return { views: body.items.reduce((sum, item) => sum + (Number(item.views) || 0), 0), ok: true };
}

async function mapWithConcurrency(items, limit, worker) {
	const results = new Array(items.length);
	let next = 0;
	async function run() {
		while (next < items.length) {
			const index = next++;
			results[index] = await worker(items[index], index);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
	return results;
}

async function main() {
	console.log('Generating personality fame snapshot...');
	const people = await fetchPublishedPeople();
	console.log(`Fetched ${people.length} published people`);

	// 1. Work out which article each person maps to.
	const targets = people.map((person) => {
		const parsed = person.wikipedia ? parseWikipediaUrl(person.wikipedia) : null;
		if (parsed) return { ...person, ...parsed, guessed: false };
		return {
			...person,
			project: 'en.wikipedia.org',
			title: guessTitle(person.slug),
			guessed: true
		};
	});

	// 2. Resolve redirects (and vet guesses) per project.
	const byProject = new Map();
	for (const target of targets) {
		if (!byProject.has(target.project)) byProject.set(target.project, new Set());
		byProject.get(target.project).add(target.title);
	}
	const resolvedByProject = new Map();
	for (const [project, titles] of byProject) {
		resolvedByProject.set(project, await resolveTitles(project, [...titles]));
	}

	const accepted = [];
	const rejected = [];
	for (const target of targets) {
		const info = resolvedByProject.get(target.project)?.get(target.title);
		if (!target.guessed) {
			if (info && !info.missing) target.title = info.title;
			continue;
		}
		// A guess that redirects to a differently named page (e.g. a friend's article
		// or a relative) is a different subject; only keep same-name articles.
		const ok =
			info &&
			!info.missing &&
			!info.disambiguation &&
			normalizePersonalitySlug(info.title) === normalizePersonalitySlug(target.title) &&
			PERSON_DESCRIPTION.test(info.description);
		if (!ok) {
			const reason =
				!info || info.missing
					? 'no article'
					: info.disambiguation
						? 'disambiguation'
						: info.title !== target.title
							? `redirects to "${info.title}"`
							: `"${info.description}"`;
			rejected.push(`${target.slug} (${reason})`);
			target.title = null;
			continue;
		}
		accepted.push(`${target.slug} -> ${info.title} (${info.description})`);
		target.title = info.title;
	}

	// 3. Sum pageviews.
	const window = pageviewsWindow();
	console.log(`Pageviews window: ${window.start}..${window.end} (${WINDOW_DAYS} days)`);
	const results = await mapWithConcurrency(targets, CONCURRENCY, async (target) =>
		target.title ? sumPageviews(target.project, target.title, window) : { views: 0, ok: true }
	);
	// Second, sequential pass for anything the API throttled or dropped.
	const failedIndexes = results.flatMap((result, index) => (result.ok ? [] : [index]));
	if (failedIndexes.length) {
		console.log(`Retrying ${failedIndexes.length} failed pageview requests sequentially...`);
		for (const index of failedIndexes) {
			await sleep(ACTION_API_DELAY_MS);
			results[index] = await sumPageviews(targets[index].project, targets[index].title, window);
		}
	}
	const totals = results.map((result) => result.views);
	const stillFailed = targets.filter((_, index) => !results[index].ok).map((t) => t.slug);

	const views = {};
	targets
		.map((target, index) => [target.slug, totals[index]])
		.sort((a, b) => a[0].localeCompare(b[0]))
		.forEach(([slug, total]) => {
			views[slug] = total;
		});

	const snapshot = { generatedAt: new Date().toISOString(), windowDays: WINDOW_DAYS, views };
	await fsp.mkdir(path.dirname(OUT), { recursive: true });
	await fsp.writeFile(OUT, JSON.stringify(snapshot, null, '\t') + '\n', 'utf-8');

	const zero = Object.entries(views).filter(([, total]) => total === 0);
	console.log(`Wrote ${path.relative(process.cwd(), OUT)}`);
	console.log(`  ${people.length - zero.length} with views, ${zero.length} at 0`);
	if (accepted.length) console.log(`  Guessed titles accepted:\n    ${accepted.join('\n    ')}`);
	if (rejected.length) console.log(`  No article found (0 views):\n    ${rejected.join('\n    ')}`);
	if (stillFailed.length) {
		console.log(`  Request failed, recorded as 0 (re-run later):\n    ${stillFailed.join(', ')}`);
	}
	const zeroWithUrl = zero.filter(
		([slug]) => !stillFailed.includes(slug) && targets.find((t) => t.slug === slug && !t.guessed)
	);
	if (zeroWithUrl.length) {
		console.log(
			`  URL present but 0 views (check the link):\n    ${zeroWithUrl.map(([slug]) => slug).join(', ')}`
		);
	}
}

main().catch((err) => {
	console.error('Error generating personality fame snapshot:', err.message);
	process.exit(1);
});
