#!/usr/bin/env node
// scripts/emerging-entity-gap-candidates.mjs

// Prefilter published personality pages for an Emerging Entity Gap review.
//
// This script uses only local, observed signals. It does not pretend to know
// whether a SERP is weak; the companion Claude command verifies that manually.
// Its job is to shrink hundreds of pages into a useful review queue using the
// latest GSC export, rolling-window momentum, ranking position, CTR headroom,
// exact-name query evidence, niche strength, and page freshness.
//
// Usage:
//   node scripts/emerging-entity-gap-candidates.mjs
//   node scripts/emerging-entity-gap-candidates.mjs --limit 30
//   node scripts/emerging-entity-gap-candidates.mjs --json

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GSC_DIR = resolve(REPO_ROOT, 'docs/data/gsc');
const FAMOUS_TYPES_PATH = resolve(REPO_ROOT, 'src/lib/components/molecules/famousTypes.ts');

const STRONG_NICHES = new Set([
	'frontier-builder',
	'alternative-artist',
	'rising-star',
	'streamer',
	'newMovieStar',
	'big-tech-founder',
	'pop-star',
	'podcaster',
	'lifestyleInfluencer',
	'business-creator',
	'business-operator',
	'tech-interpreter',
	'news-commentator'
]);

// Keep only cases where the ranking slug intentionally differs from the
// person's searched public name. Most profiles use slug.replaceAll('-', ' ').
const EXACT_NAME_QUERY_OVERRIDES = new Map([['ashby', 'ashby florence']]);

function parseArgs(argv) {
	const json = argv.includes('--json');
	const limitIndex = argv.indexOf('--limit');
	const inlineLimit = argv.find((argument) => argument.startsWith('--limit='));
	const limit = inlineLimit
		? Number(inlineLimit.slice('--limit='.length))
		: limitIndex >= 0
			? Number(argv[limitIndex + 1])
			: 25;
	if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
		throw new Error('--limit must be an integer from 1 to 500');
	}
	return { json, limit };
}

function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = '';
	let quoted = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		if (quoted) {
			if (char === '"' && text[index + 1] === '"') {
				field += '"';
				index += 1;
			} else if (char === '"') {
				quoted = false;
			} else {
				field += char;
			}
		} else if (char === '"') {
			quoted = true;
		} else if (char === ',') {
			row.push(field);
			field = '';
		} else if (char === '\n') {
			row.push(field);
			if (row.some((value) => value !== '')) rows.push(row);
			row = [];
			field = '';
		} else if (char !== '\r') {
			field += char;
		}
	}

	if (field || row.length) {
		row.push(field);
		rows.push(row);
	}

	const [header, ...body] = rows;
	return body.map((values) =>
		Object.fromEntries(header.map((key, index) => [key, values[index] ?? '']))
	);
}

function loadFamousTypes() {
	const source = readFileSync(FAMOUS_TYPES_PATH, 'utf8');
	const people = new Map();
	const rowPattern =
		/\{ name: '([^']+)', link: true, hasImage: (?:true|false), lastmod: '([^']*)',[^\n]*?types: \[([^\]]*)\]/g;
	let match;

	while ((match = rowPattern.exec(source)) !== null) {
		const types = [...match[3].matchAll(/'([^']+)'/g)].map((typeMatch) => typeMatch[1]);
		people.set(match[1].toLowerCase(), { lastmod: match[2], types });
	}
	return people;
}

function personalityRows(fileName) {
	const grouped = new Map();
	for (const row of parseCsv(readFileSync(resolve(GSC_DIR, fileName), 'utf8'))) {
		if (!/^https:\/\/9takes\.com\/personality-analysis\/[^/#]+$/.test(row.page)) continue;
		const slug = new URL(row.page).pathname.split('/').at(-1).toLowerCase();
		const current = grouped.get(slug) ?? {
			slug,
			clicks: 0,
			impressions: 0,
			weightedPosition: 0
		};
		const impressions = Number(row.impressions);
		current.clicks += Number(row.clicks);
		current.impressions += impressions;
		current.weightedPosition += Number(row.position) * impressions;
		grouped.set(slug, current);
	}

	return [...grouped.values()].map((row) => ({
		slug: row.slug,
		clicks: row.clicks,
		impressions: row.impressions,
		ctr: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : 0,
		position: row.impressions > 0 ? row.weightedPosition / row.impressions : 0
	}));
}

function median(values) {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);
	return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

function exactNameQueryBySlug(fileName) {
	const output = new Map();
	for (const row of parseCsv(readFileSync(resolve(GSC_DIR, fileName), 'utf8'))) {
		if (!/^https:\/\/9takes\.com\/personality-analysis\/[^/#]+$/.test(row.page)) continue;
		const slug = new URL(row.page).pathname.split('/').at(-1).toLowerCase();
		const exactNameQuery = EXACT_NAME_QUERY_OVERRIDES.get(slug) ?? slug.replaceAll('-', ' ');
		if (row.query.trim().toLowerCase() !== exactNameQuery) continue;
		const current = output.get(slug) ?? { clicks: 0, impressions: 0, weightedPosition: 0 };
		const impressions = Number(row.impressions);
		current.clicks += Number(row.clicks);
		current.impressions += impressions;
		current.weightedPosition += Number(row.position) * impressions;
		output.set(slug, current);
	}
	return new Map(
		[...output.entries()].map(([slug, row]) => [
			slug,
			{
				clicks: row.clicks,
				impressions: row.impressions,
				ctr: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : 0,
				position: row.impressions > 0 ? row.weightedPosition / row.impressions : 0
			}
		])
	);
}

function scoreCandidate({ latest, previous, exactName, meta, cohortCtr }) {
	const impressionSignal = clamp(Math.log10(latest.impressions + 1) * 7, 0, 24);
	const positionSignal = clamp(20 - Math.abs(latest.position - 8) * 2, 0, 20);
	const ctrRatio = cohortCtr > 0 ? latest.ctr / cohortCtr : 1;
	const ctrHeadroom = clamp((1 - ctrRatio) * 16, 0, 16);
	const momentumRatio = previous?.impressions ? latest.impressions / previous.impressions : 1;
	const momentumQualified = (previous?.impressions ?? 0) >= 50;
	const momentumSignal = momentumQualified ? clamp((momentumRatio - 1) * 18, 0, 15) : 0;
	const exactNameSignal = exactName ? clamp(Math.log10(exactName.impressions + 1) * 5, 0, 12) : 0;
	const nicheSignal = meta.types.some((type) => STRONG_NICHES.has(type)) ? 8 : 0;
	const freshnessDays = meta.lastmod
		? Math.max(0, Math.floor((Date.now() - Date.parse(`${meta.lastmod}T00:00:00Z`)) / 86_400_000))
		: null;
	const staleIndexAdvantage = freshnessDays !== null ? clamp((freshnessDays - 90) / 45, 0, 5) : 0;

	return {
		score: Math.round(
			impressionSignal +
				positionSignal +
				ctrHeadroom +
				momentumSignal +
				exactNameSignal +
				nicheSignal +
				staleIndexAdvantage
		),
		momentumRatio,
		momentumQualified,
		cohortCtr,
		freshnessDays
	};
}

function formatNumber(value) {
	return new Intl.NumberFormat('en-US').format(value);
}

const args = parseArgs(process.argv.slice(2));
const latestPointer = JSON.parse(readFileSync(resolve(GSC_DIR, 'latest.json'), 'utf8'));
const pageFiles = readdirSync(GSC_DIR)
	.filter((file) => /^\d{4}-\d{2}-\d{2}-pages\.csv$/.test(file))
	.sort();
const latestPagesFile = latestPointer.files.pages;
const latestIndex = pageFiles.indexOf(latestPagesFile);
const previousPagesFile = latestIndex > 0 ? pageFiles[latestIndex - 1] : null;
const latestRows = personalityRows(latestPagesFile);
const previousRows = previousPagesFile ? personalityRows(previousPagesFile) : [];
const previousBySlug = new Map(previousRows.map((row) => [row.slug, row]));
const exactNames = exactNameQueryBySlug(latestPointer.files.pageQuery);
const famousTypes = loadFamousTypes();

const comparableCtrs = latestRows
	.filter((row) => row.impressions >= 100 && row.position >= 4 && row.position <= 20)
	.map((row) => row.ctr);
const globalCohortCtr = median(comparableCtrs);

const candidates = latestRows
	.map((latest) => {
		const meta = famousTypes.get(latest.slug) ?? { lastmod: '', types: [] };
		const score = scoreCandidate({
			latest,
			previous: previousBySlug.get(latest.slug),
			exactName: exactNames.get(latest.slug),
			meta,
			cohortCtr: globalCohortCtr
		});
		return {
			slug: latest.slug,
			local_signal_score: score.score,
			clicks: latest.clicks,
			impressions: latest.impressions,
			ctr_pct: latest.ctr,
			position: latest.position,
			rolling_impression_ratio: Number(score.momentumRatio.toFixed(2)),
			momentum_qualified: score.momentumQualified,
			exact_name_clicks: exactNames.get(latest.slug)?.clicks ?? 0,
			exact_name_impressions: exactNames.get(latest.slug)?.impressions ?? 0,
			exact_name_ctr_pct: exactNames.get(latest.slug)?.ctr ?? 0,
			exact_name_position: exactNames.get(latest.slug)?.position ?? null,
			lastmod: meta.lastmod || null,
			freshness_days: score.freshnessDays,
			types: meta.types
		};
	})
	.filter((candidate) => candidate.impressions >= 100)
	.sort((a, b) => b.local_signal_score - a.local_signal_score || b.impressions - a.impressions)
	.slice(0, args.limit);

if (args.json) {
	console.log(
		JSON.stringify(
			{
				generated_at: new Date().toISOString(),
				latest_window: latestPointer.window,
				latest_pages_file: latestPagesFile,
				previous_pages_file: previousPagesFile,
				comparable_median_ctr_pct: globalCohortCtr,
				warning:
					'Prefilter only. Manually verify exact-name demand, SERP weakness, biography intent, source depth, and entity ambiguity before selecting a subject.',
				candidates
			},
			null,
			2
		)
	);
} else {
	console.log('Emerging Entity Gap candidate prefilter');
	console.log(`GSC window: ${latestPointer.window.startDate} to ${latestPointer.window.endDate}`);
	console.log(`Comparable personality-page median CTR: ${globalCohortCtr.toFixed(2)}%`);
	console.log('Scores are local prefilter signals, not proof of a weak SERP.');
	console.log('');
	console.log(
		[
			'score',
			'slug',
			'clicks',
			'impressions',
			'ctr',
			'pos',
			'roll ratio',
			'exact-name imp',
			'exact pos',
			'lastmod',
			'types'
		].join('\t')
	);
	for (const candidate of candidates) {
		console.log(
			[
				candidate.local_signal_score,
				candidate.slug,
				candidate.clicks,
				formatNumber(candidate.impressions),
				`${candidate.ctr_pct.toFixed(2)}%`,
				candidate.position.toFixed(1),
				`${candidate.rolling_impression_ratio.toFixed(2)}x${candidate.momentum_qualified ? '' : '*'}`,
				formatNumber(candidate.exact_name_impressions),
				candidate.exact_name_position?.toFixed(1) ?? '-',
				candidate.lastmod ?? 'unknown',
				candidate.types.join('|') || '-'
			].join('\t')
		);
	}
	console.log('');
	console.log(
		'* Momentum is displayed but scores only when the previous snapshot had >=50 impressions.'
	);
	console.log(
		'Next: run /find-emerging-entity-gaps and manually score SERP weakness and biography intent.'
	);
}
