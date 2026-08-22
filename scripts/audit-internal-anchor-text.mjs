#!/usr/bin/env node
// scripts/audit-internal-anchor-text.mjs

/**
 * Audit public-facing internal links for anchor quality and canonical destinations.
 *
 * Usage:
 *   node scripts/audit-internal-anchor-text.mjs
 *   node scripts/audit-internal-anchor-text.mjs --write
 *   node scripts/audit-internal-anchor-text.mjs --fix-redirects
 */

import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';

const REPO_ROOT = process.cwd();
const SITE_ORIGIN = 'https://9takes.com';
const WRITE_REPORT = process.argv.includes('--write');
const FIX_REDIRECTS = process.argv.includes('--fix-redirects');
const REPORT_PATH = path.join(REPO_ROOT, 'docs/content-analysis/internal-link-anchor-audit.md');

const CONTENT_GLOBS = [
	'src/blog/enneagram/**/*.{md,svx,svelte.md}',
	'src/blog/guides/*.{md,svx,svelte.md}',
	'src/blog/community/*.{md,svx,svelte.md}',
	'src/blog/pop-culture/*.{md,svx,svelte.md}',
	'src/blog/people/drafts/*.{md,svx,svelte.md}'
];

const CONTENT_IGNORE = [
	'**/enneagram/drafts/**',
	'**/guides/drafts/**',
	'**/*.instagram.md',
	'**/*.twitter.md',
	'**/*.reddit.md',
	'**/*.review.md',
	'**/template.md',
	'**/blog-optimization-strategies.md',
	'**/personality-maxing-notes.md',
	'**/societal-ticking-time-bombs-fact-check.md',
	'**/incel-exit-post.md'
];

const PUBLIC_SVELTE_GLOBS = ['src/routes/**/*.svelte', 'src/lib/components/**/*.svelte'];

const PUBLIC_SVELTE_IGNORE = [
	'src/routes/account/**',
	'src/routes/admin/**',
	'src/routes/auth/**',
	'src/routes/design-preview/**',
	'src/routes/dev/**',
	'src/routes/intake/**',
	'src/routes/login/**',
	'src/routes/questionPrint/**',
	'src/routes/styleguide/**',
	'src/routes/test-*/**'
];

const GENERIC_ANCHORS = new Set([
	'check it out',
	'check this out',
	'click here',
	'details',
	'full article',
	'full post',
	'go here',
	'here',
	'learn more',
	'link',
	'more',
	'read more',
	'read this',
	'see more',
	'source',
	'start here',
	'this',
	'this article',
	'this guide',
	'this page',
	'this post',
	'view details'
]);

const TOPIC_STOP_WORDS = new Set([
	'a',
	'about',
	'an',
	'and',
	'are',
	'article',
	'complete',
	'comprehensive',
	'each',
	'enneagram',
	'for',
	'from',
	'guide',
	'how',
	'in',
	'is',
	'learn',
	'more',
	'of',
	'on',
	'our',
	'part',
	'profile',
	'read',
	'the',
	'this',
	'to',
	'type',
	'types',
	'what',
	'why',
	'with',
	'your'
]);

const KNOWN_NON_INDEX_PATHS = new Set([
	'/admin',
	'/corpus-stats.json',
	'/forgotPassword',
	'/login',
	'/questions/create',
	'/register',
	'/resetPassword',
	'/search',
	'/signup'
]);

const KNOWN_REDIRECTS = new Map([
	[
		'/enneagram-corner/enneagram-communication-overview',
		'/enneagram-corner/relationship-communication-guide'
	],
	[
		'/enneagram-corner/enneagram-communication-in-relationships',
		'/enneagram-corner/relationship-communication-guide'
	],
	[
		'/enneagram-corner/enneagram-communication-guide',
		'/enneagram-corner/relationship-communication-guide'
	],
	[
		'/enneagram-corner/enneagram-communication-styles',
		'/enneagram-corner/relationship-communication-guide'
	],
	[
		'/enneagram-corner/enneagram-communication-tips',
		'/enneagram-corner/relationship-communication-guide'
	],
	[
		'/enneagram-corner/enneagram-compatibility-guide',
		'/enneagram-corner/enneagram-compatibility-matrix'
	],
	[
		'/enneagram-corner/enneagram-types-being-direct',
		'/enneagram-corner/relationship-communication-guide'
	],
	['/enneagram-corner/enneagram-types-overview', '/enneagram-corner/enneagram-tldr'],
	['/enneagram-corner/enneagram-test', '/enneagram-corner/enneagram-test-comparison-2026'],
	[
		'/enneagram-corner/enneagram-anxiety-management-guide',
		'/enneagram-corner/mental-health/enneagram-anxiety-complete-guide'
	],
	[
		'/enneagram-corner/anxiety-and-enneagram-types-guide',
		'/enneagram-corner/mental-health/enneagram-anxiety-complete-guide'
	]
]);

function normalizeSlug(value) {
	return String(value ?? '')
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’.]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function normalizePathname(value) {
	try {
		const cleanedValue = String(value).replace(/^</, '').replace(/>$/, '');
		const url = new URL(cleanedValue, SITE_ORIGIN);
		if (!['9takes.com', 'www.9takes.com'].includes(url.hostname)) return null;
		return url.pathname.replace(/\/+$/, '') || '/';
	} catch {
		return null;
	}
}

function cleanAnchorText(value) {
	return value
		.replace(/<[^>]+>/g, ' ')
		.replace(/\{[^}]+\}/g, ' ')
		.replace(/[*_`~]/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function literalAttribute(markup, name) {
	const match = markup.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]+)"|'([^']+)')`, 'i'));
	return match ? match[1] || match[2] : '';
}

function accessibleAnchorText(attributes, body) {
	const visibleText = cleanAnchorText(body);
	if (visibleText) return visibleText;

	const accessibleText =
		literalAttribute(attributes, 'aria-label') ||
		literalAttribute(body, 'displayText') ||
		literalAttribute(body, 'alt') ||
		literalAttribute(body, 'aria-label') ||
		literalAttribute(body, 'title');
	if (accessibleText) return cleanAnchorText(accessibleText);

	const hasDynamicAccessibleName =
		/\baria-label\s*=\s*\{/.test(attributes) ||
		/\b(?:alt|aria-label|displayText|title)\s*=\s*\{/.test(body) ||
		/\{[^}]+\}/.test(body);
	return hasDynamicAccessibleName ? '(dynamic accessible name)' : '';
}

function lineNumberAt(content, index, lineOffset = 0) {
	return lineOffset + content.slice(0, index).split('\n').length;
}

function maskHtmlComments(content) {
	return content.replace(/<!--[\s\S]*?-->/g, (comment) => comment.replace(/[^\n]/g, ' '));
}

function stemTopicToken(token) {
	const numberWords = {
		one: '1',
		two: '2',
		three: '3',
		four: '4',
		five: '5',
		six: '6',
		seven: '7',
		eight: '8',
		nine: '9'
	};
	if (numberWords[token]) return numberWords[token];
	if (/^\d+$/.test(token)) return token;
	if (token.length > 5 && token.endsWith('ies')) return `${token.slice(0, -3)}y`;
	if (token.length > 5 && token.endsWith('ing')) return token.slice(0, -3);
	if (token.length > 4 && token.endsWith('ed')) return token.slice(0, -2);
	if (token.length > 4 && token.endsWith('s')) return token.slice(0, -1);
	return token;
}

function topicTokens(value) {
	return new Set(
		normalizeSlug(value)
			.split('-')
			.filter((token) => token && !TOPIC_STOP_WORDS.has(token))
			.map(stemTopicToken)
	);
}

function routeForContentFile(file, metadata) {
	const slug = normalizeSlug(
		metadata.person || path.basename(file).replace(/\.(?:svelte\.)?(?:md|svx)$/, '')
	);
	if (file.includes('/people/drafts/')) return `/personality-analysis/${slug}`;
	if (file.includes('/enneagram/mental-health/')) {
		return `/enneagram-corner/mental-health/${slug}`;
	}
	if (file.includes('/enneagram/')) return `/enneagram-corner/${slug}`;
	if (file.includes('/guides/')) return `/how-to-guides/${slug}`;
	if (file.includes('/community/')) return `/community/${slug}`;
	if (file.includes('/pop-culture/')) return `/pop-culture/${slug}`;
	return null;
}

function extractLinks(content, file, sourceRoute, sourceTitle, lineOffset = 0) {
	const links = [];
	const visibleContent = maskHtmlComments(content);
	const markdownPattern = /(?<!!)\[([^\]\n]+)\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g;
	const htmlPattern = /<a\b([^>]*?)\bhref=(?:"([^"]+)"|'([^']+)')([^>]*)>([\s\S]*?)<\/a>/gi;

	for (const match of visibleContent.matchAll(markdownPattern)) {
		const anchor = cleanAnchorText(match[1]);
		const href = match[2];
		if (/[{}]/.test(href)) continue;
		const target = normalizePathname(href);
		if (!target) continue;
		links.push({
			anchor,
			anchorSource: 'visible',
			href,
			target,
			file,
			line: lineNumberAt(content, match.index, lineOffset),
			sourceRoute,
			sourceTitle,
			kind: 'markdown'
		});
	}

	for (const match of visibleContent.matchAll(htmlPattern)) {
		const href = match[2] || match[3];
		if (/[{}]/.test(href)) continue;
		const target = normalizePathname(href);
		if (!target) continue;
		const attributes = `${match[1]} ${match[4]}`;
		const visibleAnchor = cleanAnchorText(match[5]);
		links.push({
			anchor: visibleAnchor || accessibleAnchorText(attributes, match[5]),
			anchorSource: visibleAnchor ? 'visible' : 'accessible-fallback',
			href,
			target,
			file,
			line: lineNumberAt(content, match.index, lineOffset),
			sourceRoute,
			sourceTitle,
			kind: 'html'
		});
	}

	return links;
}

function readSitemapPaths() {
	const sitemapPath = path.join(REPO_ROOT, 'static/sitemap.xml');
	const sitemap = fs.readFileSync(sitemapPath, 'utf8');
	return new Set(
		[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
			.map((match) => normalizePathname(match[1]))
			.filter(Boolean)
	);
}

function canonicalTargetFor(target, sitemapPaths) {
	if (KNOWN_REDIRECTS.has(target)) return KNOWN_REDIRECTS.get(target);

	const personalityMatch = target.match(/^\/personality-analysis\/([^/]+)$/);
	if (personalityMatch) {
		const normalizedPersonalityTarget = `/personality-analysis/${normalizeSlug(personalityMatch[1])}`;
		if (normalizedPersonalityTarget !== target) return normalizedPersonalityTarget;
	}

	const legacyBlogMatch = target.match(/^\/blog\/(enneagram|guides|community)(\/.*)?$/);
	if (legacyBlogMatch) {
		const prefix = {
			enneagram: '/enneagram-corner',
			guides: '/how-to-guides',
			community: '/community'
		}[legacyBlogMatch[1]];
		return `${prefix}${legacyBlogMatch[2] || ''}`;
	}

	const rootEnneagramMatch = target.match(/^\/enneagram-corner\/([^/]+)$/);
	if (rootEnneagramMatch) {
		const mentalHealthTarget = `/enneagram-corner/mental-health/${rootEnneagramMatch[1]}`;
		if (sitemapPaths.has(mentalHealthTarget)) return mentalHealthTarget;
	}

	return null;
}

function classifyLink(link, sitemapPaths, targetTitles) {
	const normalizedAnchor = link.anchor
		.toLowerCase()
		.replace(/[.!?]+$/, '')
		.trim();
	const issues = [];

	if (!link.anchor) {
		issues.push({
			severity: 'high',
			code: 'empty-anchor',
			detail: 'The link has no readable text.'
		});
	} else if (GENERIC_ANCHORS.has(normalizedAnchor)) {
		issues.push({
			severity: 'high',
			code: 'generic-anchor',
			detail: `“${link.anchor}” does not describe the destination.`
		});
	} else if (/^part\s+\d+$/i.test(normalizedAnchor)) {
		issues.push({
			severity: 'medium',
			code: 'series-only-anchor',
			detail: `“${link.anchor}” needs the series topic in the clickable text.`
		});
	} else if (/^https?:\/\//i.test(link.anchor) || /^www\./i.test(link.anchor)) {
		issues.push({
			severity: 'medium',
			code: 'raw-url-anchor',
			detail: 'Use a human-readable description instead of a raw URL.'
		});
	}

	const canonicalTarget = canonicalTargetFor(link.target, sitemapPaths);
	if (canonicalTarget && canonicalTarget !== link.target) {
		issues.push({
			severity: 'high',
			code: 'redirecting-target',
			detail: `Link directly to ${canonicalTarget}.`,
			canonicalTarget
		});
	} else if (
		!sitemapPaths.has(link.target) &&
		!KNOWN_NON_INDEX_PATHS.has(link.target) &&
		!link.target.startsWith('/account/') &&
		!link.target.startsWith('/questions/')
	) {
		issues.push({
			severity: 'review',
			code: 'not-in-sitemap',
			detail: 'The destination is not present in the generated sitemap; verify that it is public.'
		});
	}

	const targetTitle = targetTitles.get(link.target);
	if (
		targetTitle &&
		link.anchor !== '(dynamic accessible name)' &&
		link.anchor.split(/\s+/).length <= 6 &&
		!issues.some((issue) => issue.code === 'generic-anchor' || issue.code === 'series-only-anchor')
	) {
		const anchorTopics = topicTokens(link.anchor);
		const targetTopics = topicTokens(`${targetTitle} ${link.target}`);
		const hasOverlap = [...anchorTopics].some((token) => targetTopics.has(token));
		const hasWeakPointerLanguage =
			/\b(?:here|this|that|it|one|in depth|full comparison|what we're building)\b/i.test(
				link.anchor
			);
		if (
			anchorTopics.size > 0 &&
			targetTopics.size > 0 &&
			!hasOverlap &&
			(link.anchorSource === 'accessible-fallback' || hasWeakPointerLanguage)
		) {
			issues.push({
				severity: 'review',
				code: 'low-topic-overlap',
				detail: `Compare this wording with the destination title: “${targetTitle}”.`
			});
		}
	}

	return issues;
}

function markdownEscape(value) {
	return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function formatIssueTable(rows) {
	if (rows.length === 0) return '_None._';
	const lines = [
		'| Severity | Issue | Source | Anchor | Destination | Detail |',
		'| --- | --- | --- | --- | --- | --- |'
	];
	for (const row of rows) {
		lines.push(
			`| ${row.severity} | ${row.code} | \`${markdownEscape(row.file)}:${row.line}\` | ${markdownEscape(row.anchor || '(empty)')} | \`${markdownEscape(row.target)}\` | ${markdownEscape(row.detail)} |`
		);
	}
	return lines.join('\n');
}

const sitemapPaths = readSitemapPaths();
const contentFiles = await fg(CONTENT_GLOBS, {
	cwd: REPO_ROOT,
	absolute: false,
	onlyFiles: true,
	ignore: CONTENT_IGNORE
});
const svelteFiles = await fg(PUBLIC_SVELTE_GLOBS, {
	cwd: REPO_ROOT,
	absolute: false,
	onlyFiles: true,
	ignore: PUBLIC_SVELTE_IGNORE
});

const links = [];
const targetTitles = new Map();
let publishedContentFiles = 0;

for (const file of contentFiles.sort()) {
	const raw = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
	const parsed = matter(raw);
	if (parsed.data.published !== true) continue;
	publishedContentFiles += 1;
	const sourceRoute = routeForContentFile(file, parsed.data);
	if (sourceRoute) targetTitles.set(sourceRoute, String(parsed.data.title || sourceRoute));
	const contentStart = raw.indexOf(parsed.content);
	const lineOffset = contentStart > 0 ? raw.slice(0, contentStart).split('\n').length - 1 : 0;
	links.push(
		...extractLinks(
			parsed.content,
			file,
			sourceRoute,
			String(parsed.data.title || sourceRoute || file),
			lineOffset
		)
	);
}

for (const file of svelteFiles.sort()) {
	const raw = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
	links.push(...extractLinks(raw, file, null, file));
}

const issues = links
	.flatMap((link) =>
		classifyLink(link, sitemapPaths, targetTitles).map((issue) => ({
			...link,
			...issue
		}))
	)
	.sort((left, right) => {
		const rank = { high: 0, medium: 1, review: 2 };
		return (
			rank[left.severity] - rank[right.severity] ||
			left.file.localeCompare(right.file) ||
			left.line - right.line
		);
	});

const highIssues = issues.filter((issue) => issue.severity === 'high');
const mediumIssues = issues.filter((issue) => issue.severity === 'medium');
const reviewIssues = issues.filter((issue) => issue.severity === 'review');
const uniqueDestinations = new Set(links.map((link) => link.target));

if (FIX_REDIRECTS) {
	const redirectIssuesByFile = new Map();
	for (const issue of issues.filter((item) => item.code === 'redirecting-target')) {
		if (!redirectIssuesByFile.has(issue.file)) redirectIssuesByFile.set(issue.file, []);
		redirectIssuesByFile.get(issue.file).push(issue);
	}

	let changedFiles = 0;
	let changedLinks = 0;
	for (const [file, fileIssues] of redirectIssuesByFile) {
		const absolutePath = path.join(REPO_ROOT, file);
		const original = fs.readFileSync(absolutePath, 'utf8');
		let updated = original;

		for (const issue of fileIssues) {
			const replacement = /^https?:\/\//i.test(issue.href)
				? `${SITE_ORIGIN}${issue.canonicalTarget}`
				: issue.canonicalTarget;
			const occurrences = updated.split(issue.href).length - 1;
			if (occurrences === 0) continue;
			updated = updated.split(issue.href).join(replacement);
			changedLinks += occurrences;
		}

		if (updated !== original) {
			fs.writeFileSync(absolutePath, updated, 'utf8');
			changedFiles += 1;
		}
	}

	console.log(`Fixed ${changedLinks} redirecting link occurrences across ${changedFiles} files.`);
}

const report = `# Internal link anchor audit

_Generated: ${new Date().toISOString().slice(0, 10)}_

## Scope

- ${publishedContentFiles} published Markdown content files
- ${svelteFiles.length} public-facing Svelte components and pages
- ${links.length} literal internal links
- ${uniqueDestinations.size} unique internal destinations

This audit flags generic or context-poor anchor text, links that point through a known redirect, and destinations absent from the generated sitemap. Sitemap warnings require manual review because some useful product routes are intentionally not indexed.

## Summary

| Priority | Count |
| --- | ---: |
| High | ${highIssues.length} |
| Medium | ${mediumIssues.length} |
| Review | ${reviewIssues.length} |

## High-priority issues

${formatIssueTable(highIssues)}

## Medium-priority issues

${formatIssueTable(mediumIssues)}

## Manual-review issues

${formatIssueTable(reviewIssues)}
`;

console.log(
	`Audited ${links.length} internal links across ${publishedContentFiles} published content files and ${svelteFiles.length} public Svelte files.`
);
console.log(
	`Issues: ${highIssues.length} high, ${mediumIssues.length} medium, ${reviewIssues.length} review.`
);

for (const issue of [...highIssues, ...mediumIssues]) {
	console.log(
		`${issue.severity.toUpperCase()} ${issue.file}:${issue.line} [${issue.anchor || '(empty)'}](${issue.target}) — ${issue.detail}`
	);
}

if (WRITE_REPORT && !FIX_REDIRECTS) {
	fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
	fs.writeFileSync(REPORT_PATH, report, 'utf8');
	console.log(`Wrote ${path.relative(REPO_ROOT, REPORT_PATH)}`);
} else if (WRITE_REPORT && FIX_REDIRECTS) {
	console.log('Skipped the report because links changed; rerun with --write for fresh results.');
}
