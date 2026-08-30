#!/usr/bin/env node
// scripts/audit-people-crosslinks.mjs

/**
 * Audit the published personality-profile cross-link graph.
 *
 * The graph has two explicit edge types:
 *   1. contextual links in article prose
 *   2. curated `suggestions` links in frontmatter
 *
 * Usage:
 *   node scripts/audit-people-crosslinks.mjs
 *   node scripts/audit-people-crosslinks.mjs --write
 *   node scripts/audit-people-crosslinks.mjs --write --recent-days 21
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const REPO_ROOT = process.cwd();
const PEOPLE_DIR = path.join(REPO_ROOT, 'src/blog/people/drafts');
const REPORT_DIR = path.join(REPO_ROOT, 'docs/content-analysis/crosslink-reports');
const WRITE_REPORT = process.argv.includes('--write');

const NON_PROFILE_ROUTES = new Set(['categories']);

function readNumberFlag(name, fallback) {
	const index = process.argv.indexOf(name);
	if (index === -1) return fallback;
	const value = Number(process.argv[index + 1]);
	return Number.isFinite(value) && value > 0 ? value : fallback;
}

const RECENT_DAYS = readNumberFlag('--recent-days', 21);
const REPORT_DATE = new Date().toISOString().slice(0, 10);

const CATEGORY_TYPES = new Set([
	'moviestar',
	'newmoviestar',
	'celebrity',
	'creator',
	'influencer',
	'tiktoker',
	'lifestyleinfluencer',
	'journalist',
	'musician',
	'politician',
	'historical',
	'activist',
	'techie',
	'entrepreneur',
	'business',
	'comedian',
	'author',
	'athlete',
	'psychology',
	'essay'
]);

const CLUSTER_TAGS = new Set([
	'screenicon',
	'risingstar',
	'tvcomedycrossover',
	'celebrityimage',
	'podcaster',
	'newscommentator',
	'businesscreator',
	'streamer',
	'viralentertainer',
	'lifestylebuilder',
	'popstar',
	'rapper',
	'alternativeartist',
	'singersongwriter',
	'musiccrossover',
	'modernleader',
	'historicalleader',
	'movementleader',
	'royalty',
	'politicalspouse',
	'campaignpolitician',
	'historicalscientist',
	'historicalartist',
	'bigtechfounder',
	'investor',
	'frontierbuilder',
	'businessoperator',
	'techinterpreter',
	'standup',
	'sketchcomic',
	'satirehost',
	'internetcomic',
	'novelist',
	'strategywriter',
	'businessinterpreter'
]);

function normalizeSlug(value) {
	return String(value ?? '')
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/['’.]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function normalizeType(value) {
	return String(value ?? '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '');
}

function toTypes(value) {
	if (Array.isArray(value)) return value.map(String).filter(Boolean);
	if (typeof value === 'string') {
		return value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	}
	return [];
}

function displayName(data, slug) {
	const title = String(data.title ?? '').trim();
	const titleName = title.split(/:|\s+Enneagram\b|\s+Personality\b/i)[0].trim();
	if (titleName) return titleName;
	return slug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function stripComments(content) {
	return content.replace(/<!--[\s\S]*?-->/g, ' ');
}

function extractPersonalityLinks(content, selfSlug) {
	const links = new Set();
	const urls = [];
	const htmlPattern = /<a\b[^>]*\bhref=(?:"([^"]+)"|'([^']+)')/gi;
	const markdownPattern = /\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g;
	for (const match of content.matchAll(htmlPattern)) urls.push(match[1] || match[2]);
	for (const match of content.matchAll(markdownPattern)) urls.push(match[1]);

	for (const url of urls) {
		const match = String(url).match(
			/^(?:https?:\/\/(?:www\.)?9takes\.com)?\/personality-analysis\/([^/?#]+)/i
		);
		if (!match) continue;
		const slug = normalizeSlug(match[1]);
		if (slug && slug !== selfSlug && !NON_PROFILE_ROUTES.has(slug)) links.add(slug);
	}
	return [...links];
}

function parseDate(value) {
	const timestamp = Date.parse(String(value ?? ''));
	return Number.isFinite(timestamp) ? timestamp : 0;
}

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mentionsName(content, name) {
	if (name.length < 6) return false;
	return new RegExp(`(^|[^A-Za-z0-9])${escapeRegex(name)}([^A-Za-z0-9]|$)`, 'i').test(content);
}

function intersection(left, right) {
	const rightSet = new Set(right);
	return [...new Set(left.filter((value) => rightSet.has(value)))];
}

const profiles = new Map();
for (const file of fs.readdirSync(PEOPLE_DIR).filter((entry) => entry.endsWith('.md'))) {
	const absolutePath = path.join(PEOPLE_DIR, file);
	const parsed = matter(fs.readFileSync(absolutePath, 'utf8'));
	if (parsed.data.published !== true) continue;

	const slug = normalizeSlug(parsed.data.person || path.basename(file, '.md'));
	if (!slug || profiles.has(slug)) continue;
	const visibleContent = stripComments(parsed.content);
	const types = toTypes(parsed.data.type);

	profiles.set(slug, {
		slug,
		name: displayName(parsed.data, slug),
		file: path.relative(REPO_ROOT, absolutePath),
		date: String(parsed.data.date ?? ''),
		lastmod: String(parsed.data.lastmod ?? ''),
		enneagram: String(parsed.data.enneagram ?? ''),
		types,
		typeKeys: types.map(normalizeType),
		clusterTags: types.map(normalizeType).filter((type) => CLUSTER_TAGS.has(type)),
		hasCategoryType: types.map(normalizeType).some((type) => CATEGORY_TYPES.has(type)),
		body: visibleContent,
		bodyLinksRaw: extractPersonalityLinks(visibleContent, slug),
		suggestionsRaw: Array.isArray(parsed.data.suggestions)
			? parsed.data.suggestions.map(normalizeSlug).filter(Boolean)
			: []
	});
}

const inboundBody = new Map([...profiles.keys()].map((slug) => [slug, new Set()]));
const inboundSuggestions = new Map([...profiles.keys()].map((slug) => [slug, new Set()]));
const brokenBodyLinks = [];
const unavailableSuggestions = [];

for (const profile of profiles.values()) {
	profile.bodyLinks = profile.bodyLinksRaw.filter((target) => {
		if (!profiles.has(target)) {
			brokenBodyLinks.push({ source: profile.slug, target });
			return false;
		}
		inboundBody.get(target).add(profile.slug);
		return true;
	});

	profile.suggestions = profile.suggestionsRaw.filter((target) => {
		if (!profiles.has(target)) {
			unavailableSuggestions.push({ source: profile.slug, target });
			return false;
		}
		inboundSuggestions.get(target).add(profile.slug);
		return true;
	});
}

const rows = [...profiles.values()].map((profile) => {
	const incomingBody = [...inboundBody.get(profile.slug)];
	const incomingSuggestions = [...inboundSuggestions.get(profile.slug)];
	const reciprocalSuggestions = profile.suggestions.filter((target) =>
		profiles.get(target).suggestions.includes(profile.slug)
	);
	const neighbors = new Set([
		...profile.bodyLinks,
		...profile.suggestions,
		...incomingBody,
		...incomingSuggestions
	]);
	const inbound = new Set([...incomingBody, ...incomingSuggestions]);
	const outbound = new Set([...profile.bodyLinks, ...profile.suggestions]);

	return {
		...profile,
		incomingBody,
		incomingSuggestions,
		reciprocalSuggestions,
		neighborCount: neighbors.size,
		inboundCount: inbound.size,
		outboundCount: outbound.size,
		completeIsolation: neighbors.size === 0,
		drasticIsolation: inbound.size === 0 && reciprocalSuggestions.length === 0,
		noDetailedClusterTag: profile.clusterTags.length === 0
	};
});

const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
const recentPublished = rows.filter((row) => parseDate(row.date) >= cutoff);
const recentlyTouched = rows.filter(
	(row) => parseDate(row.lastmod) >= cutoff && parseDate(row.date) < cutoff
);
const drasticallyIsolated = rows
	.filter((row) => row.drasticIsolation)
	.sort((a, b) => a.inboundCount - b.inboundCount || a.neighborCount - b.neighborCount);
const inboundOrphans = rows
	.filter((row) => row.inboundCount === 0)
	.sort((a, b) => a.neighborCount - b.neighborCount || a.name.localeCompare(b.name));
const clusterless = rows
	.filter((row) => row.noDetailedClusterTag)
	.sort((a, b) => a.name.localeCompare(b.name));

function candidateLinks(row) {
	const existingNeighbors = new Set([
		row.slug,
		...row.bodyLinks,
		...row.suggestions,
		...row.incomingBody,
		...row.incomingSuggestions
	]);
	return rows
		.filter((candidate) => !existingNeighbors.has(candidate.slug))
		.map((candidate) => {
			const sharedTypes = intersection(row.typeKeys, candidate.typeKeys);
			const sharedClusters = intersection(row.clusterTags, candidate.clusterTags);
			const sourceMentionsCandidate = mentionsName(row.body, candidate.name);
			const candidateMentionsSource = mentionsName(candidate.body, row.name);
			const candidateSuggestsSource = candidate.suggestions.includes(row.slug);
			const sameEnneagram = Boolean(
				row.enneagram && candidate.enneagram && row.enneagram === candidate.enneagram
			);
			const score =
				(sourceMentionsCandidate ? 50 : 0) +
				(candidateMentionsSource ? 40 : 0) +
				(candidateSuggestsSource ? 30 : 0) +
				sharedClusters.length * 12 +
				sharedTypes.length * 4 +
				(sameEnneagram ? 2 : 0);
			const reasons = [];
			if (sourceMentionsCandidate) reasons.push('name appears in source');
			if (candidateMentionsSource) reasons.push('source appears in candidate');
			if (candidateSuggestsSource) reasons.push('one-way suggestion already exists');
			if (sharedClusters.length) reasons.push(`shared cluster: ${sharedClusters.join(', ')}`);
			else if (sharedTypes.length) reasons.push(`shared type: ${sharedTypes.join(', ')}`);
			if (sameEnneagram) reasons.push(`same Enneagram ${row.enneagram}`);
			return { slug: candidate.slug, name: candidate.name, score, reasons };
		})
		.filter((candidate) => candidate.score > 0)
		.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
		.slice(0, 5);
}

function markdownTable(headers, records) {
	const lines = [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`];
	for (const record of records) {
		lines.push(`| ${record.map((value) => String(value).replace(/\|/g, '\\|')).join(' | ')} |`);
	}
	return lines.join('\n');
}

function profileLink(row) {
	return `[${row.name}](../../../${row.file})`;
}

function buildMarkdown() {
	const bodyEdgeCount = rows.reduce((sum, row) => sum + row.bodyLinks.length, 0);
	const suggestionEdgeCount = rows.reduce((sum, row) => sum + row.suggestions.length, 0);
	const reciprocalPairCount =
		rows.reduce((sum, row) => sum + row.reciprocalSuggestions.length, 0) / 2;
	const completeIsolates = rows.filter((row) => row.completeIsolation);
	const lines = [
		`# People Cross-Link Report — ${REPORT_DATE}`,
		'',
		`_Generated by \`node scripts/audit-people-crosslinks.mjs --write\`. Recent window: ${RECENT_DAYS} days._`,
		'',
		'## Summary',
		'',
		`- Published personality profiles: **${rows.length}**`,
		`- Contextual body-link edges: **${bodyEdgeCount}**`,
		`- Valid suggestion edges: **${suggestionEdgeCount}**`,
		`- Reciprocal suggestion pairs: **${reciprocalPairCount}**`,
		`- Completely isolated profiles (no links in either direction): **${completeIsolates.length}**`,
		`- Inbound orphans (nothing links or suggests them): **${inboundOrphans.length}**`,
		`- Drastically isolated (zero inbound and no reciprocal suggestion): **${drasticallyIsolated.length}**`,
		`- Missing a detailed cluster tag: **${clusterless.length}**`,
		`- Broken body-link targets: **${brokenBodyLinks.length}**`,
		`- Suggestions that do not resolve to a published local profile: **${unavailableSuggestions.length}**`,
		'',
		'## Newly Published Profiles',
		'',
		recentPublished.length
			? markdownTable(
					['Published', 'Profile', 'Body out/in', 'Suggestions out/in', 'Reciprocal', 'Neighbors'],
					recentPublished
						.sort((a, b) => parseDate(b.date) - parseDate(a.date))
						.map((row) => [
							row.date,
							profileLink(row),
							`${row.bodyLinks.length}/${row.incomingBody.length}`,
							`${row.suggestions.length}/${row.incomingSuggestions.length}`,
							row.reciprocalSuggestions.length,
							row.neighborCount
						])
				)
			: '_No published profiles fall inside the current recent window._',
		'',
		'## Recently Refreshed Older Profiles',
		'',
		recentlyTouched.length
			? markdownTable(
					['Last modified', 'Profile', 'Inbound', 'Reciprocal suggestions', 'Neighbors'],
					recentlyTouched
						.sort((a, b) => parseDate(b.lastmod) - parseDate(a.lastmod))
						.map((row) => [
							row.lastmod,
							profileLink(row),
							row.inboundCount,
							row.reciprocalSuggestions.length,
							row.neighborCount
						])
				)
			: '_No refreshed older profiles fall inside the current recent window._',
		'',
		'## Drastically Isolated Profiles',
		'',
		'These profiles have no inbound contextual/suggestion links and no reciprocal suggestion relationship. Outgoing suggestions alone do not make them discoverable from the rest of the graph.',
		'',
		drasticallyIsolated.length
			? markdownTable(
					['Profile', 'Body out', 'Suggestions out', 'Neighbors', 'Cluster tags'],
					drasticallyIsolated
						.slice(0, 60)
						.map((row) => [
							profileLink(row),
							row.bodyLinks.length,
							row.suggestions.length,
							row.neighborCount,
							row.clusterTags.join(', ') || 'none'
						])
				)
			: '_No drastically isolated profiles._',
		'',
		'## Structural Cross-Link Candidates',
		'',
		'These are scanner candidates, not automatic edit instructions. A name mention, real relationship, collaboration, shared show/podcast, teammate/cast link, or genuinely close niche is required before adding a link.',
		''
	];

	for (const row of drasticallyIsolated.slice(0, 30)) {
		const candidates = candidateLinks(row);
		lines.push(`### ${row.name}`);
		lines.push('');
		if (!candidates.length) {
			lines.push(
				'_No strong structural candidate. Editorial review must decide whether this profile should remain intentionally isolated._'
			);
		} else {
			for (const candidate of candidates) {
				lines.push(`- ${candidate.name}: ${candidate.reasons.join('; ')}`);
			}
		}
		lines.push('');
	}

	lines.push('## Missing Detailed Cluster Tags');
	lines.push('');
	lines.push(
		clusterless.length
			? clusterless
					.map((row) => `- ${row.name}: \`${row.types.join(', ') || 'no types'}\``)
					.join('\n')
			: '_All published profiles have at least one detailed cluster tag._'
	);
	lines.push('');
	lines.push('## Broken or Unavailable Targets');
	lines.push('');
	if (!brokenBodyLinks.length && !unavailableSuggestions.length) {
		lines.push('_All contextual links and suggestions resolve to published local profiles._');
	} else {
		for (const item of brokenBodyLinks)
			lines.push(`- Broken body link: ${item.source} → ${item.target}`);
		for (const item of unavailableSuggestions)
			lines.push(`- Unavailable suggestion: ${item.source} → ${item.target}`);
	}
	lines.push('');
	lines.push('## Editorial Review Required');
	lines.push('');
	lines.push(
		'The scanner can identify graph gaps and plausible neighbors, but it cannot prove that a prose link is organic. Review the drastically isolated list and record either a specific placement supported by the article, or “no organic opportunity” with the reason.'
	);
	lines.push('');
	return `${lines.join('\n')}\n`;
}

const snapshot = {
	reportDate: REPORT_DATE,
	recentDays: RECENT_DAYS,
	totals: {
		profiles: rows.length,
		bodyEdges: rows.reduce((sum, row) => sum + row.bodyLinks.length, 0),
		suggestionEdges: rows.reduce((sum, row) => sum + row.suggestions.length, 0),
		completeIsolates: rows.filter((row) => row.completeIsolation).length,
		inboundOrphans: inboundOrphans.length,
		drasticallyIsolated: drasticallyIsolated.length,
		clusterless: clusterless.length,
		brokenBodyLinks: brokenBodyLinks.length,
		unavailableSuggestions: unavailableSuggestions.length
	},
	recentPublished: recentPublished.map((row) => row.slug),
	drasticallyIsolated: drasticallyIsolated.map((row) => row.slug),
	clusterless: clusterless.map((row) => row.slug),
	brokenBodyLinks,
	unavailableSuggestions
};

const markdown = buildMarkdown();
if (WRITE_REPORT) {
	fs.mkdirSync(REPORT_DIR, { recursive: true });
	const markdownPath = path.join(REPORT_DIR, `${REPORT_DATE}.md`);
	const jsonPath = path.join(REPORT_DIR, `${REPORT_DATE}.json`);
	fs.writeFileSync(markdownPath, markdown);
	fs.writeFileSync(jsonPath, `${JSON.stringify(snapshot, null, 2)}\n`);
	console.log(`Wrote ${path.relative(REPO_ROOT, markdownPath)}`);
	console.log(`Wrote ${path.relative(REPO_ROOT, jsonPath)}`);
} else {
	process.stdout.write(markdown);
}
