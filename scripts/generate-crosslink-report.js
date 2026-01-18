// scripts/generate-crosslink-report.js
// #!/usr/bin/env node

/**
 * Blog Crosslink Analysis Script
 * Generates accurate cross-linking statistics for blog posts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '..', 'src', 'blog');
const OUTPUT_FILE = path.join(__dirname, '..', 'docs', 'BLOG-CROSSLINK-INDEX.md');

// Individual type pages to exclude from link counting (per original doc spec)
const TYPE_PAGES = [
	'enneagram-type-1',
	'enneagram-type-2',
	'enneagram-type-3',
	'enneagram-type-4',
	'enneagram-type-5',
	'enneagram-type-6',
	'enneagram-type-7',
	'enneagram-type-8',
	'enneagram-type-9'
];

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
	const files = fs.readdirSync(dirPath);

	files.forEach((file) => {
		const fullPath = path.join(dirPath, file);
		if (fs.statSync(fullPath).isDirectory()) {
			getAllFiles(fullPath, arrayOfFiles);
		} else {
			arrayOfFiles.push(fullPath);
		}
	});

	return arrayOfFiles;
}

/**
 * Get all published blog post files
 */
function getBlogFiles() {
	const allFiles = getAllFiles(BLOG_DIR);

	return allFiles
		.filter((file) => file.endsWith('.md'))
		.map((file) => path.relative(BLOG_DIR, file))
		.filter((file) => {
			// Exclude patterns
			if (file.includes('/drafts/') || file.includes('\\drafts\\')) return false;
			if (file.endsWith('template.md')) return false;
			if (file.endsWith('.instagram.md')) return false;
			if (file.endsWith('.reddit.md')) return false;
			if (file.endsWith('.twitter.md')) return false;
			if (file.endsWith('.review.md')) return false;
			if (file.includes('topic-map.md')) return false;
			if (file.includes('blog-optimization-strategies.md')) return false;
			if (file.includes('personality-maxing-notes.md')) return false;
			if (file.includes('psychology-ideas.md')) return false;
			if (file.includes('person-template.md')) return false;

			return true;
		});
}

/**
 * Extract the slug from a file path
 */
function getSlugFromPath(filePath) {
	return path.basename(filePath, '.md');
}

/**
 * Check if a slug is an individual type page
 */
function isTypePage(slug) {
	return TYPE_PAGES.includes(slug);
}

/**
 * Extract all internal blog links from file content
 */
function extractLinks(content, currentSlug) {
	const links = new Set();

	// Pattern 1: Markdown links to blog sections (including mental-health subdirectory)
	const mdLinkPattern =
		/\[([^\]]*)\]\((?:https?:\/\/(?:www\.)?9takes\.com)?\/(?:enneagram-corner|how-to-guides|community|pop-culture|life-situations|guides)(?:\/mental-health)?\/([a-z0-9-]+)(?:\/)?(?:[?#][^)]+)?\)/gi;
	let match;
	while ((match = mdLinkPattern.exec(content)) !== null) {
		const slug = match[2];
		if (slug !== currentSlug && !isTypePage(slug)) {
			links.add(slug);
		}
	}

	// Pattern 2: MarqueeHorizontal component links (including mental-health subdirectory)
	const marqueePattern =
		/link:\s*['"]\/(?:enneagram-corner|how-to-guides|community|pop-culture|life-situations|guides)(?:\/mental-health)?\/([a-z0-9-]+)['"]/gi;
	while ((match = marqueePattern.exec(content)) !== null) {
		const slug = match[1];
		if (slug !== currentSlug && !isTypePage(slug)) {
			links.add(slug);
		}
	}

	// Pattern 3: HTML anchor tags (including mental-health subdirectory)
	const anchorPattern =
		/<a[^>]+href=['"](?:https?:\/\/(?:www\.)?9takes\.com)?\/(?:enneagram-corner|how-to-guides|community|pop-culture|life-situations|guides)(?:\/mental-health)?\/([a-z0-9-]+)(?:\/)?(?:[#?][^'"]+)?['"]/gi;
	while ((match = anchorPattern.exec(content)) !== null) {
		const slug = match[1];
		if (slug !== currentSlug && !isTypePage(slug)) {
			links.add(slug);
		}
	}

	return Array.from(links);
}

/**
 * Extract title from frontmatter
 */
function extractTitle(content) {
	const titleMatch = content.match(/^title:\s*['"](.+?)['"]/m);
	if (titleMatch) {
		return titleMatch[1];
	}
	const titleMatch2 = content.match(/^title:\s*(.+)$/m);
	if (titleMatch2) {
		return titleMatch2[1].trim();
	}
	return 'Untitled';
}

/**
 * Check if post is published
 */
function isPublished(content) {
	const publishedMatch = content.match(/^published:\s*(true|false)/m);
	if (publishedMatch) {
		return publishedMatch[1] === 'true';
	}
	return true;
}

/**
 * Main analysis function
 */
function analyzeBlogs() {
	const files = getBlogFiles();
	const posts = new Map();

	console.log(`Found ${files.length} blog files to analyze...\n`);

	// First pass: collect all posts and their outgoing links
	for (const file of files) {
		const fullPath = path.join(BLOG_DIR, file);
		const content = fs.readFileSync(fullPath, 'utf-8');

		if (!isPublished(content)) {
			continue;
		}

		const slug = getSlugFromPath(file);
		const title = extractTitle(content);
		const outgoingLinks = extractLinks(content, slug);

		posts.set(slug, {
			path: file,
			title: title.substring(0, 60) + (title.length > 60 ? '...' : ''),
			fullTitle: title,
			outgoing: outgoingLinks,
			incoming: []
		});
	}

	// Second pass: calculate incoming links
	for (const [slug, data] of posts) {
		for (const targetSlug of data.outgoing) {
			if (posts.has(targetSlug)) {
				posts.get(targetSlug).incoming.push(slug);
			}
		}
	}

	return posts;
}

/**
 * Generate the markdown report
 */
function generateReport(posts) {
	const totalPosts = posts.size;
	const postsWithNoOutgoing = [...posts.values()].filter((p) => p.outgoing.length === 0);
	const postsWithNoIncoming = [...posts.values()].filter((p) => p.incoming.length === 0);
	const totalLinks = [...posts.values()].reduce((sum, p) => sum + p.outgoing.length, 0);
	const avgOutgoing = (totalLinks / totalPosts).toFixed(1);
	const isolated = [...posts.entries()].filter(
		([_, p]) => p.outgoing.length === 0 && p.incoming.length === 0
	);

	let md = `# Blog Cross-Link Index

_Generated: ${new Date().toISOString().split('T')[0]}_
_Total Published Posts Analyzed: ${totalPosts}_
_Note: Individual type pages (enneagram-type-1 through 9) excluded from link counts_

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total published posts | ${totalPosts} |
| Posts with 0 outgoing links | ${postsWithNoOutgoing.length} |
| Posts with 0 incoming links | ${postsWithNoIncoming.length} |
| Completely isolated (0 in, 0 out) | ${isolated.length} |
| Total internal cross-links | ${totalLinks} |
| Average outgoing links per post | ${avgOutgoing} |

---

## Priority 1: Completely Isolated Posts (${isolated.length} posts)

These posts have NO links in or out. Fix these first!

| Post Title | Path | Action |
|------------|------|--------|
`;

	for (const [slug, data] of isolated.sort((a, b) => a[1].title.localeCompare(b[1].title))) {
		md += `| ${data.title} | \`${data.path}\` | Add 3+ outgoing links |\n`;
	}

	md += `
---

## Priority 2: Posts with NO Outgoing Links (${postsWithNoOutgoing.length} posts)

These posts don't link to any other content.

| Post Title | Path | Incoming Links |
|------------|------|----------------|
`;

	const sortedNoOutgoing = postsWithNoOutgoing.sort(
		(a, b) => b.incoming.length - a.incoming.length
	);

	for (const data of sortedNoOutgoing) {
		md += `| ${data.title} | \`${data.path}\` | ${data.incoming.length} |\n`;
	}

	md += `
---

## Priority 3: Posts with NO Incoming Links (${postsWithNoIncoming.length} posts)

These posts are "orphaned" - no other content links to them.

| Post Title | Path | Outgoing Links |
|------------|------|----------------|
`;

	const sortedNoIncoming = postsWithNoIncoming
		.filter((p) => p.outgoing.length > 0)
		.sort((a, b) => b.outgoing.length - a.outgoing.length);

	for (const data of sortedNoIncoming) {
		md += `| ${data.title} | \`${data.path}\` | ${data.outgoing.length} |\n`;
	}

	md += `
---

## Well-Connected Posts (Hub Posts)

### Most Linked TO (receive the most incoming links)

| Incoming | Outgoing | Post Title | Path |
|----------|----------|------------|------|
`;

	const sortedByIncoming = [...posts.entries()]
		.sort((a, b) => b[1].incoming.length - a[1].incoming.length)
		.slice(0, 25);

	for (const [slug, data] of sortedByIncoming) {
		md += `| ${data.incoming.length} | ${data.outgoing.length} | ${data.title} | \`${data.path}\` |\n`;
	}

	md += `
### Most Links OUT (link to the most other posts)

| Outgoing | Incoming | Post Title | Path |
|----------|----------|------------|------|
`;

	const sortedByOutgoing = [...posts.entries()]
		.sort((a, b) => b[1].outgoing.length - a[1].outgoing.length)
		.slice(0, 25);

	for (const [slug, data] of sortedByOutgoing) {
		md += `| ${data.outgoing.length} | ${data.incoming.length} | ${data.title} | \`${data.path}\` |\n`;
	}

	md += `
---

## Complete Post Index

Sorted by total connections (incoming + outgoing).

| Total | In | Out | Post Title | Path |
|-------|----|----|------------|------|
`;

	const sortedByTotal = [...posts.entries()].sort((a, b) => {
		const totalA = a[1].incoming.length + a[1].outgoing.length;
		const totalB = b[1].incoming.length + b[1].outgoing.length;
		return totalB - totalA;
	});

	for (const [slug, data] of sortedByTotal) {
		const total = data.incoming.length + data.outgoing.length;
		md += `| ${total} | ${data.incoming.length} | ${data.outgoing.length} | ${data.title} | \`${data.path}\` |\n`;
	}

	md += `
---

_Generated by scripts/generate-crosslink-report.js_
`;

	return md;
}

// Main execution
console.log('🔍 Analyzing blog crosslinks...\n');

const posts = analyzeBlogs();
const report = generateReport(posts);

fs.writeFileSync(OUTPUT_FILE, report);
console.log(`✅ Report generated: ${OUTPUT_FILE}`);
console.log(`\n📊 Quick Stats:`);
console.log(`   Total posts: ${posts.size}`);
console.log(
	`   Posts with 0 outgoing: ${[...posts.values()].filter((p) => p.outgoing.length === 0).length}`
);
console.log(
	`   Posts with 0 incoming: ${[...posts.values()].filter((p) => p.incoming.length === 0).length}`
);
console.log(
	`   Isolated (0/0): ${[...posts.values()].filter((p) => p.outgoing.length === 0 && p.incoming.length === 0).length}`
);
