// scripts/blog-enrichment-status.mjs
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const root = fileURLToPath(new URL('..', import.meta.url));
const trackerPath = join(root, 'docs/blog-enrichment/tracker.json');
const registryPath = join(root, 'src/lib/data/blog-evidence-media.json');
const draftsDir = join(root, 'src/blog/people/drafts');

const tracker = JSON.parse(readFileSync(trackerPath, 'utf8'));
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const errors = [];
const warnings = [];
const validStatuses = new Set([
	'needs-enrichment-review',
	'researched',
	'assets-ready',
	'enriched-local',
	'published',
	'blocked'
]);

const evidenceById = new Map();
for (const item of registry.items) {
	if (evidenceById.has(item.id)) errors.push(`Duplicate evidence ID: ${item.id}`);
	evidenceById.set(item.id, item);

	const assetPath = join(root, 'static', item.image.src.replace(/^\//, ''));
	if (!existsSync(assetPath)) errors.push(`Missing asset for ${item.id}: ${item.image.src}`);
	if (!item.image.source?.url) errors.push(`Missing image source URL: ${item.id}`);
	if (!item.image.rights?.attribution) errors.push(`Missing image attribution: ${item.id}`);

	if (item.image.rights?.status === 'fair-use') {
		const record = item.image.rights.fair_use;
		for (const factor of ['purpose', 'nature', 'amount', 'market_effect']) {
			if (!record?.[factor]) errors.push(`Missing fair-use ${factor}: ${item.id}`);
		}
		if (!record?.risk || !record?.legal_review) {
			errors.push(`Missing fair-use risk/review decision: ${item.id}`);
		}
	}
}

const trackedBySlug = new Map();
for (const blog of tracker.blogs) {
	if (trackedBySlug.has(blog.slug)) errors.push(`Duplicate tracked blog: ${blog.slug}`);
	trackedBySlug.set(blog.slug, blog);
	if (!validStatuses.has(blog.status))
		errors.push(`Invalid status for ${blog.slug}: ${blog.status}`);

	const draftPath = join(root, blog.draft_path);
	if (!existsSync(draftPath)) {
		errors.push(`Missing tracked draft: ${blog.draft_path}`);
		continue;
	}
	const draft = readFileSync(draftPath, 'utf8');
	for (const evidenceId of blog.evidence_ids) {
		const item = evidenceById.get(evidenceId);
		if (!item) {
			errors.push(`Unknown evidence ID in ${blog.slug}: ${evidenceId}`);
			continue;
		}
		if (item.blog_slug !== blog.slug) {
			errors.push(`Evidence ${evidenceId} belongs to ${item.blog_slug}, not ${blog.slug}`);
		}
		if (!draft.includes(`<EvidenceFigure evidenceId="${evidenceId}" />`)) {
			errors.push(`Draft ${blog.slug} does not contain tag for ${evidenceId}`);
		}
	}
	if (blog.status === 'published' && blog.publication_status !== 'published-verified') {
		warnings.push(`${blog.slug} is marked published without publication_status=published-verified`);
	}
}

const canonicalDrafts = readdirSync(draftsDir)
	.filter((name) => extname(name) === '.md')
	.map((name) => {
		const path = join(draftsDir, name);
		const parsed = matter(readFileSync(path, 'utf8'));
		const slug = parsed.data.person || basename(name, '.md').toLowerCase();
		return { name, slug, published: parsed.data.published === true };
	})
	.filter((draft) => draft.published);
const untracked = canonicalDrafts.filter((draft) => !trackedBySlug.has(draft.slug));
const statusCounts = new Map();
for (const blog of tracker.blogs) {
	statusCounts.set(blog.status, (statusCounts.get(blog.status) ?? 0) + 1);
}
statusCounts.set(
	tracker.unlisted_default,
	(statusCounts.get(tracker.unlisted_default) ?? 0) + untracked.length
);

console.log('Personality blog evidence enrichment');
console.log(`Published local drafts: ${canonicalDrafts.length}`);
console.log(`Explicitly tracked: ${tracker.blogs.length}`);
for (const status of validStatuses) console.log(`${status}: ${statusCounts.get(status) ?? 0}`);
console.log(`Evidence items: ${registry.items.length}`);
console.log(
	`Rights: ${registry.items.filter((item) => item.image.rights.status === 'licensed').length} licensed, ${registry.items.filter((item) => item.image.rights.status === 'fair-use').length} fair-use`
);

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (errors.length) {
	for (const error of errors) console.error(`ERROR: ${error}`);
	process.exitCode = 1;
} else {
	console.log('Validation: pass');
}
