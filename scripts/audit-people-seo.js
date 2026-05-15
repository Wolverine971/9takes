// scripts/audit-people-seo.js
//
// Usage:
//   node scripts/audit-people-seo.js
//   node scripts/audit-people-seo.js --limit 20
//   node scripts/audit-people-seo.js --changed
//   node scripts/audit-people-seo.js --json
//
import { execFileSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const PEOPLE_DRAFTS_DIR = path.join(ROOT, 'src/blog/people/drafts');
const INTERNAL_PREFIXES = [
	'/personality-analysis',
	'/enneagram-corner',
	'/pop-culture',
	'/community',
	'/how-to-guides',
	'/corpus-stats',
	'/enneagram-test'
];
const EXCLUDED_FILE_BASENAMES = new Set([
	'person-template.md',
	'POLITICIAN_FACT_CHECK_REPORT.md',
	'david-perrel-thiel-essay.md'
]);
const EXCLUDED_FILE_SUFFIXES = ['-research.md', '-updated-sections.md'];
const GENERIC_TITLE_PATTERNS = [
	/\ban in-depth enneagram type\b/i,
	/\ban enneagram type \d\b/i,
	/\bthe psychology behind\b/i,
	/\binside the mind\b/i,
	/\bexplained\b/i
];

const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const changedOnly = args.includes('--changed');
const limitArg = args.find((arg) => arg.startsWith('--limit='));
const spacedLimitIndex = args.indexOf('--limit');
const limit = Number.parseInt(
	limitArg?.split('=')[1] ?? (spacedLimitIndex >= 0 ? args[spacedLimitIndex + 1] : '25'),
	10
);

const changedDrafts = changedOnly ? getChangedDraftPaths() : null;
const files = await listDraftFiles();
const audits = [];

for (const filePath of files) {
	if (changedDrafts && !changedDrafts.has(filePath)) continue;
	const raw = await fs.readFile(filePath, 'utf8');
	const parsed = matter(raw);
	audits.push(auditDraft(filePath, parsed.data || {}, parsed.content || ''));
}

audits.sort((a, b) => b.score - a.score || a.relativePath.localeCompare(b.relativePath));

if (jsonOutput) {
	console.log(JSON.stringify({ filesAudited: audits.length, audits }, null, 2));
} else {
	printTextReport(audits, Number.isFinite(limit) ? limit : 25);
}

async function listDraftFiles() {
	const entries = await fs.readdir(PEOPLE_DRAFTS_DIR, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isFile())
		.map((entry) => entry.name)
		.filter((name) => name.endsWith('.md'))
		.filter((name) => !EXCLUDED_FILE_BASENAMES.has(name))
		.filter((name) => !EXCLUDED_FILE_SUFFIXES.some((suffix) => name.endsWith(suffix)))
		.map((name) => path.join(PEOPLE_DRAFTS_DIR, name))
		.sort();
}

function auditDraft(filePath, data, content) {
	const issues = [];
	const relativePath = path.relative(ROOT, filePath);
	const title = stringValue(data.title);
	const metaTitle = stringValue(data.meta_title);
	const description = stringValue(data.description);
	const slug = stringValue(data.person) || path.basename(filePath, '.md');
	const enneagram = parseEnneagramNumber(data.enneagram);
	const faqs = Array.isArray(data.faqs) ? data.faqs : [];
	const keywords = Array.isArray(data.keywords) ? data.keywords : [];
	const sameAs = Array.isArray(data.same_as) ? data.same_as : [];
	const citations = Array.isArray(data.citations) ? data.citations : [];
	const occupation = Array.isArray(data.occupation) ? data.occupation : [];
	const knowsAbout = Array.isArray(data.knows_about) ? data.knows_about : [];
	const headings = extractHeadingAnchors(content);
	const links = extractInternalLinks(content);
	const peopleLinks = links.filter((link) => link.startsWith('/personality-analysis/'));
	const wordCount = countWords(content);
	const qualityOverall = Number(data.content_quality?.overall);

	if (!metaTitle) {
		addIssue(issues, 8, 'Missing meta_title.');
	} else {
		if (metaTitle.length > 62) {
			addIssue(issues, 3, `meta_title is ${metaTitle.length} characters; keep it near 50-60.`);
		}
		if (metaTitle.length < 35) {
			addIssue(issues, 2, `meta_title is only ${metaTitle.length} characters; it may be too thin.`);
		}
		if (GENERIC_TITLE_PATTERNS.some((pattern) => pattern.test(metaTitle))) {
			addIssue(
				issues,
				2,
				'meta_title uses a generic repeated pattern; make the search angle more specific.'
			);
		}
	}

	if (!description) {
		addIssue(issues, 8, 'Missing description.');
	} else {
		if (description.length > 160) {
			addIssue(
				issues,
				3,
				`Description is ${description.length} characters; trim for SERP display.`
			);
		}
		if (description.length < 110) {
			addIssue(
				issues,
				2,
				`Description is only ${description.length} characters; add a clearer search promise.`
			);
		}
	}

	if (faqs.length === 0) {
		addIssue(issues, 10, 'Missing FAQ schema content.');
	} else if (faqs.length < 2) {
		addIssue(issues, 6, 'FAQ list has fewer than 2 entries.');
	}

	for (const [index, faq] of faqs.entries()) {
		if (!stringValue(faq.question) || !stringValue(faq.answer)) {
			addIssue(issues, 4, `FAQ ${index + 1} is missing a question or answer.`);
		}

		const anchor = stringValue(faq.anchor);
		if (!anchor) {
			addIssue(issues, 1, `FAQ ${index + 1} has no anchor for jump links.`);
		} else if (!headings.has(anchor)) {
			addIssue(issues, 3, `FAQ anchor "${anchor}" does not match a content heading.`);
		}
	}

	if (keywords.length < 4) {
		addIssue(issues, 4, `Only ${keywords.length} keywords; add 4-6 focused topical keywords.`);
	}

	if (links.length < 4) {
		addIssue(issues, 8 - links.length, `Only ${links.length} internal links in body content.`);
	}

	if (peopleLinks.length === 0) {
		addIssue(issues, 4, 'No body links to other personality-analysis pages.');
	}

	if (enneagram && !links.includes(`/enneagram-corner/enneagram-type-${enneagram}`)) {
		addIssue(issues, 4, `No body link to the Type ${enneagram} pillar.`);
	}

	if (sameAs.length < 2) {
		addIssue(issues, 5, 'Missing or thin same_as entity links.');
	}

	if (!stringValue(data.wikidata_qid)) {
		addIssue(issues, 5, 'Missing wikidata_qid.');
	}

	if (citations.length < 2) {
		addIssue(issues, 5, 'Missing citations for entity/evidence trust.');
	}

	if (occupation.length === 0) {
		addIssue(issues, 2, 'Missing occupation entity field.');
	}

	if (knowsAbout.length < 2) {
		addIssue(issues, 2, 'Missing or thin knows_about entity field.');
	}

	if (!Number.isFinite(qualityOverall)) {
		addIssue(issues, 3, 'Missing content_quality.overall score.');
	} else if (qualityOverall < 8.5) {
		addIssue(
			issues,
			6,
			`content_quality.overall is ${qualityOverall}; review depth/evidence/originality.`
		);
	}

	if (wordCount < 1200) {
		addIssue(issues, 10, `Only ${wordCount} words; likely too thin for a competitive profile.`);
	}

	if (title && GENERIC_TITLE_PATTERNS.some((pattern) => pattern.test(title))) {
		addIssue(
			issues,
			2,
			'H1/title repeats a generic pattern; consider a sharper human-specific angle.'
		);
	}

	return {
		relativePath,
		slug,
		score: issues.reduce((sum, issue) => sum + issue.weight, 0),
		wordCount,
		internalLinks: links.length,
		peopleLinks: peopleLinks.length,
		faqCount: faqs.length,
		qualityOverall: Number.isFinite(qualityOverall) ? qualityOverall : null,
		issues: issues.sort((a, b) => b.weight - a.weight)
	};
}

function addIssue(issues, weight, message) {
	issues.push({ weight, message });
}

function stringValue(value) {
	return typeof value === 'string' ? value.trim() : '';
}

function parseEnneagramNumber(value) {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

function countWords(content) {
	return (
		content
			.replace(/```[\s\S]*?```/g, ' ')
			.replace(/<[^>]+>/g, ' ')
			.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g)?.length ?? 0
	);
}

function extractHeadingAnchors(content) {
	const anchors = new Set();
	const headingRe = /^#{2,6}\s+(.+)$/gm;
	let match;

	while ((match = headingRe.exec(content)) !== null) {
		anchors.add(slugifyHeading(match[1]));
	}

	return anchors;
}

function slugifyHeading(text) {
	return text
		.replace(/<[^>]+>/g, '')
		.replace(/\[[^\]]+\]\(([^)]+)\)/g, '$1')
		.replace(/[^\w\s-]/g, '')
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

function extractInternalLinks(content) {
	const links = new Set();
	const prefixPattern = INTERNAL_PREFIXES.map((prefix) => escapeRegExp(prefix)).join('|');
	const markdownRe = new RegExp(`\\[[^\\]]+\\]\\(((${prefixPattern})[^)\\s]*)`, 'g');
	const htmlRe = new RegExp(`href=["']((${prefixPattern})[^"']*)["']`, 'g');
	let match;

	while ((match = markdownRe.exec(content)) !== null) {
		links.add(cleanPath(match[1]));
	}

	while ((match = htmlRe.exec(content)) !== null) {
		links.add(cleanPath(match[1]));
	}

	return [...links].filter(Boolean);
}

function cleanPath(link) {
	return link.split('?')[0].replace(/#.*$/, '').replace(/\/$/, '');
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getChangedDraftPaths() {
	try {
		const changed = new Set();
		for (const mode of [[], ['--cached']]) {
			const output = execFileSync(
				'git',
				['diff', ...mode, '--name-only', '--', 'src/blog/people/drafts'],
				{ cwd: ROOT, encoding: 'utf8' }
			);
			for (const line of output.split('\n')) {
				if (line.trim().endsWith('.md')) {
					changed.add(path.join(ROOT, line.trim()));
				}
			}
		}
		return changed;
	} catch {
		return new Set();
	}
}

function printTextReport(audits, maxItems) {
	const totalIssues = new Map();

	for (const audit of audits) {
		for (const issue of audit.issues) {
			const key = issue.message.replace(/\d+/g, '#');
			totalIssues.set(key, (totalIssues.get(key) ?? 0) + 1);
		}
	}

	const issueCounts = [...totalIssues.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

	console.log(`People SEO audit`);
	console.log(`Files audited: ${audits.length}`);
	console.log(`Files with issues: ${audits.filter((audit) => audit.score > 0).length}`);
	console.log('');
	console.log('Most common issues:');

	for (const [issue, count] of issueCounts) {
		console.log(`- ${count}x ${issue}`);
	}

	console.log('');
	console.log(`Highest-priority drafts:`);

	for (const [index, audit] of audits.slice(0, maxItems).entries()) {
		console.log(
			`${index + 1}. ${audit.relativePath} - score ${audit.score}, FAQs ${audit.faqCount}, links ${audit.internalLinks}, words ${audit.wordCount}`
		);

		for (const issue of audit.issues.slice(0, 5)) {
			console.log(`   - [${issue.weight}] ${issue.message}`);
		}
	}
}
