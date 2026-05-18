// src/lib/server/blogPerformanceDiagnostics.ts
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export interface BlogLinkTarget {
	href: string;
	label: string;
}

export interface BlogIncomingLink {
	slug: string;
	title: string;
	href: string;
}

export interface BlogPerformanceDiagnosticsRow {
	slug: string;
	file_path: string;
	frontmatter: {
		title: string;
		meta_title: string;
		persona_title: string;
		description: string;
		date: string;
		lastmod: string;
		published: boolean | string | null;
		enneagram: string;
		type: string[];
		person: string;
		suggestions: string[];
		content_quality: {
			hook: number | null;
			enneagram: number | null;
			evidence: number | null;
			writing: number | null;
			originality: number | null;
			overall: number | null;
			letter: string;
			graded_at: string;
		};
		keywords: string[];
		citations: string[];
		faq_count: number;
		same_as_count: number;
	};
	content_stats: {
		word_count: number;
		h2_count: number;
		h3_count: number;
		title_chars: number;
		meta_title_chars: number;
		description_chars: number;
		has_tldr: boolean;
		has_testimony_ledger: boolean;
		has_heading_mix_ledger: boolean;
		has_distribution_ledger: boolean;
		has_faq_schema: boolean;
	};
	link_stats: {
		outgoing_internal_count: number;
		outgoing_personality_count: number;
		outgoing_enneagram_count: number;
		outgoing_category_count: number;
		external_link_count: number;
		incoming_internal_count: number;
		suggestion_count: number;
		suggestions_existing_count: number;
		missing_suggestions: string[];
		outgoing_targets: BlogLinkTarget[];
		incoming_sources: BlogIncomingLink[];
	};
	diagnostic_scores: {
		seo: number;
		internal_links: number;
		content_depth: number;
		frontmatter: number;
	};
	action_notes: string[];
	replication_notes: string[];
}

interface ParsedBlog {
	slug: string;
	filePath: string;
	data: Record<string, unknown>;
	content: string;
	outgoingInternalHrefs: Set<string>;
	outgoingExternalHrefs: Set<string>;
}

const DEFAULT_PEOPLE_DRAFTS_DIR = path.join(process.cwd(), 'src/blog/people/drafts');
const RAW_PEOPLE_DRAFT_MODULES = import.meta.glob('/src/blog/people/drafts/*.{md,svx,svelte.md}', {
	query: '?raw',
	import: 'default'
}) as Record<string, () => Promise<string>>;

function toString(value: unknown): string {
	return typeof value === 'string'
		? value.trim()
		: value === null || value === undefined
			? ''
			: String(value);
}

function toNullableNumber(value: unknown): number | null {
	const numeric = Number(value);
	return Number.isFinite(numeric) ? numeric : null;
}

function toStringArray(value: unknown): string[] {
	if (Array.isArray(value)) return value.map(toString).filter(Boolean);
	if (typeof value === 'string' && value.trim()) return [value.trim()];
	return [];
}

function normalizeSlug(value: string): string {
	return value
		.trim()
		.replace(/\.md$/i, '')
		.replace(/^https?:\/\/(?:www\.)?9takes\.com\/personality-analysis\//i, '')
		.replace(/^\/personality-analysis\//i, '')
		.replace(/[?#].*$/, '')
		.replace(/_/g, '-')
		.replace(/\s+/g, '-')
		.toLowerCase();
}

function slugFromPath(filePath: string, data: Record<string, unknown>): string {
	const loc = toString(data.loc);
	if (loc) return normalizeSlug(loc);
	const person = toString(data.person);
	if (person) return normalizeSlug(person);
	return normalizeSlug(path.basename(filePath));
}

function stripMarkdown(content: string): string {
	return content
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
		.replace(/[#>*_`~\-|]/g, ' ');
}

function countWords(content: string): number {
	const words = stripMarkdown(content).match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?/g);
	return words?.length ?? 0;
}

function extractInternalHref(rawHref: string): string | null {
	const href = rawHref.trim();
	if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:'))
		return null;

	if (/^https?:\/\/(?:www\.)?9takes\.com\//i.test(href)) {
		return href.replace(/^https?:\/\/(?:www\.)?9takes\.com/i, '').replace(/[?#].*$/, '');
	}

	if (href.startsWith('/')) return href.replace(/[?#].*$/, '');
	return null;
}

function extractLinks(content: string): {
	internal: Set<string>;
	external: Set<string>;
} {
	const internal = new Set<string>();
	const external = new Set<string>();
	const markdownLinkPattern = /\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
	const hrefPattern = /\bhref=["']([^"']+)["']/gi;

	for (const pattern of [markdownLinkPattern, hrefPattern]) {
		let match: RegExpExecArray | null;
		while ((match = pattern.exec(content)) !== null) {
			const href = match[1] ?? '';
			const internalHref = extractInternalHref(href);
			if (internalHref) {
				internal.add(internalHref);
				continue;
			}
			if (/^https?:\/\//i.test(href) && !/^https?:\/\/(?:www\.)?9takes\.com\//i.test(href)) {
				external.add(href.replace(/[?#].*$/, ''));
			}
		}
	}

	return { internal, external };
}

function getHeadingCount(content: string, level: 2 | 3): number {
	const pattern = new RegExp(`^#{${level}}\\s+`, 'gm');
	return content.match(pattern)?.length ?? 0;
}

function getContentQuality(
	data: Record<string, unknown>
): BlogPerformanceDiagnosticsRow['frontmatter']['content_quality'] {
	const quality =
		data.content_quality && typeof data.content_quality === 'object'
			? (data.content_quality as Record<string, unknown>)
			: {};

	return {
		hook: toNullableNumber(quality.hook),
		enneagram: toNullableNumber(quality.enneagram),
		evidence: toNullableNumber(quality.evidence),
		writing: toNullableNumber(quality.writing),
		originality: toNullableNumber(quality.originality),
		overall: toNullableNumber(quality.overall),
		letter: toString(quality.letter),
		graded_at: toString(quality.graded_at)
	};
}

function scoreRange(value: number, min: number, max: number): number {
	if (value >= min && value <= max) return 100;
	if (value < min) return Math.max(0, Math.round((value / min) * 100));
	return Math.max(0, Math.round((max / value) * 100));
}

function buildScores(
	row: Omit<
		BlogPerformanceDiagnosticsRow,
		'diagnostic_scores' | 'action_notes' | 'replication_notes'
	>
): BlogPerformanceDiagnosticsRow['diagnostic_scores'] {
	const seoParts = [
		scoreRange(row.content_stats.meta_title_chars, 35, 65),
		scoreRange(row.content_stats.description_chars, 120, 170),
		row.frontmatter.keywords.length > 0 ? 100 : 35,
		row.content_stats.has_faq_schema ? 100 : 65
	];
	const linkParts = [
		Math.min(100, row.link_stats.outgoing_internal_count * 20),
		Math.min(100, row.link_stats.incoming_internal_count * 25),
		Math.min(100, row.link_stats.suggestions_existing_count * 25)
	];
	const contentParts = [
		scoreRange(row.content_stats.word_count, 1800, 4500),
		scoreRange(row.content_stats.h2_count, 5, 10),
		row.content_stats.has_tldr ? 100 : 60,
		row.content_stats.has_testimony_ledger ? 100 : 70,
		row.frontmatter.content_quality.overall
			? Math.round(row.frontmatter.content_quality.overall * 10)
			: 50
	];
	const frontmatterParts = [
		row.frontmatter.title ? 100 : 0,
		row.frontmatter.meta_title ? 100 : 40,
		row.frontmatter.description ? 100 : 0,
		row.frontmatter.enneagram ? 100 : 30,
		row.frontmatter.type.length > 0 ? 100 : 50
	];

	const average = (values: number[]) =>
		Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

	return {
		seo: average(seoParts),
		internal_links: average(linkParts),
		content_depth: average(contentParts),
		frontmatter: average(frontmatterParts)
	};
}

function buildActionNotes(
	row: Omit<
		BlogPerformanceDiagnosticsRow,
		'diagnostic_scores' | 'action_notes' | 'replication_notes'
	>
): string[] {
	const notes: string[] = [];

	if (row.link_stats.outgoing_internal_count < 4) {
		notes.push('Add more contextual internal links inside the body, not just suggestions.');
	}
	if (row.link_stats.incoming_internal_count === 0) {
		notes.push('No incoming personality-analysis links found; add this post to related articles.');
	}
	if (row.link_stats.missing_suggestions.length > 0) {
		notes.push(
			`Suggestion slugs missing local drafts: ${row.link_stats.missing_suggestions.slice(0, 3).join(', ')}.`
		);
	}
	if (row.content_stats.meta_title_chars < 35 || row.content_stats.meta_title_chars > 65) {
		notes.push(
			`Meta title length is ${row.content_stats.meta_title_chars}; target roughly 35-65 chars.`
		);
	}
	if (row.content_stats.description_chars < 120 || row.content_stats.description_chars > 170) {
		notes.push(
			`Description length is ${row.content_stats.description_chars}; target roughly 120-170 chars.`
		);
	}
	if (!row.content_stats.has_tldr) {
		notes.push('No TL;DR accordion detected.');
	}
	if (!row.content_stats.has_faq_schema) {
		notes.push('No FAQ schema frontmatter detected.');
	}
	if ((row.frontmatter.content_quality.overall ?? 0) < 8.5) {
		notes.push('Content-quality grade is below the current strongest posts.');
	}

	return notes.slice(0, 6);
}

function buildReplicationNotes(
	row: Omit<
		BlogPerformanceDiagnosticsRow,
		'diagnostic_scores' | 'action_notes' | 'replication_notes'
	>
): string[] {
	const notes: string[] = [];

	if (row.link_stats.outgoing_internal_count >= 6) {
		notes.push('Strong body cross-linking footprint.');
	}
	if (row.link_stats.incoming_internal_count >= 3) {
		notes.push('Good incoming-link support from the personality graph.');
	}
	if (row.content_stats.has_testimony_ledger) {
		notes.push('Evidence ledger gives the article a reusable research structure.');
	}
	if (row.content_stats.has_tldr) {
		notes.push('TL;DR accordion creates a fast answer path for scanners.');
	}
	if ((row.frontmatter.content_quality.overall ?? 0) >= 9) {
		notes.push(
			'High content-quality grade; compare hook and evidence style against underperformers.'
		);
	}
	if (row.content_stats.description_chars >= 120 && row.content_stats.description_chars <= 170) {
		notes.push('Search snippet length is in a healthy range.');
	}

	return notes.slice(0, 5);
}

async function parsePeopleDrafts(rootDir: string): Promise<ParsedBlog[]> {
	try {
		return await parsePeopleDraftsFromFs(rootDir);
	} catch (err) {
		if (
			isMissingDefaultDraftsDir(rootDir, err) &&
			Object.keys(RAW_PEOPLE_DRAFT_MODULES).length > 0
		) {
			return parsePeopleDraftsFromModules(RAW_PEOPLE_DRAFT_MODULES);
		}

		throw err;
	}
}

async function parsePeopleDraftsFromFs(rootDir: string): Promise<ParsedBlog[]> {
	const entries = await readdir(rootDir, { withFileTypes: true });
	const markdownFiles = entries
		.filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
		.map((entry) => path.join(rootDir, entry.name))
		.sort((a, b) => a.localeCompare(b));

	const parsed: ParsedBlog[] = [];
	for (const filePath of markdownFiles) {
		const raw = await readFile(filePath, 'utf8');
		const { data, content } = matter(raw);
		const links = extractLinks(content);
		parsed.push({
			slug: slugFromPath(filePath, data),
			filePath,
			data,
			content,
			outgoingInternalHrefs: links.internal,
			outgoingExternalHrefs: links.external
		});
	}

	return parsed;
}

async function parsePeopleDraftsFromModules(
	modules: Record<string, () => Promise<string>>
): Promise<ParsedBlog[]> {
	const parsed: ParsedBlog[] = [];
	const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b));

	for (const [filePath, resolver] of entries) {
		const raw = await resolver();
		const { data, content } = matter(raw);
		const links = extractLinks(content);
		parsed.push({
			slug: slugFromPath(filePath, data),
			filePath: filePath.replace(/^\//, ''),
			data,
			content,
			outgoingInternalHrefs: links.internal,
			outgoingExternalHrefs: links.external
		});
	}

	return parsed;
}

function isMissingDefaultDraftsDir(rootDir: string, err: unknown): boolean {
	if (path.resolve(rootDir) !== path.resolve(DEFAULT_PEOPLE_DRAFTS_DIR)) return false;
	return typeof err === 'object' && err !== null && 'code' in err && err.code === 'ENOENT';
}

export async function loadPeopleBlogPerformanceDiagnostics(
	rootDir = DEFAULT_PEOPLE_DRAFTS_DIR
): Promise<BlogPerformanceDiagnosticsRow[]> {
	const parsedBlogs = await parsePeopleDrafts(rootDir);
	const knownSlugs = new Set(parsedBlogs.map((blog) => blog.slug));
	const blogsBySlug = new Map(parsedBlogs.map((blog) => [blog.slug, blog]));
	const incomingBySlug = new Map<string, BlogIncomingLink[]>();

	for (const blog of parsedBlogs) {
		for (const href of blog.outgoingInternalHrefs) {
			if (!href.startsWith('/personality-analysis/')) continue;
			if (href.startsWith('/personality-analysis/categories/')) continue;
			if (href.startsWith('/personality-analysis/type/')) continue;

			const targetSlug = normalizeSlug(href.replace(/^\/personality-analysis\//, ''));
			if (!targetSlug || targetSlug === blog.slug || !blogsBySlug.has(targetSlug)) continue;

			if (!incomingBySlug.has(targetSlug)) incomingBySlug.set(targetSlug, []);
			incomingBySlug.get(targetSlug)?.push({
				slug: blog.slug,
				title: toString(blog.data.title) || blog.slug,
				href: `/personality-analysis/${blog.slug}`
			});
		}
	}

	return parsedBlogs.map((blog) => {
		const data = blog.data;
		const suggestions = toStringArray(data.suggestions);
		const outgoingTargets = [...blog.outgoingInternalHrefs]
			.sort((a, b) => a.localeCompare(b))
			.map((href) => ({ href, label: href.replace(/^\//, '') }));
		const missingSuggestions = suggestions
			.map(normalizeSlug)
			.filter((slug) => slug && !knownSlugs.has(slug));
		const contentQuality = getContentQuality(data);

		const baseRow: Omit<
			BlogPerformanceDiagnosticsRow,
			'diagnostic_scores' | 'action_notes' | 'replication_notes'
		> = {
			slug: blog.slug,
			file_path: path.relative(process.cwd(), blog.filePath),
			frontmatter: {
				title: toString(data.title),
				meta_title: toString(data.meta_title),
				persona_title: toString(data.persona_title),
				description: toString(data.description),
				date: toString(data.date),
				lastmod: toString(data.lastmod),
				published:
					typeof data.published === 'boolean' || typeof data.published === 'string'
						? data.published
						: null,
				enneagram: toString(data.enneagram),
				type: toStringArray(data.type),
				person: toString(data.person),
				suggestions,
				content_quality: contentQuality,
				keywords: toStringArray(data.keywords),
				citations: toStringArray(data.citations),
				faq_count: Array.isArray(data.faqs) ? data.faqs.length : 0,
				same_as_count: Array.isArray(data.same_as) ? data.same_as.length : 0
			},
			content_stats: {
				word_count: countWords(blog.content),
				h2_count: getHeadingCount(blog.content, 2),
				h3_count: getHeadingCount(blog.content, 3),
				title_chars: toString(data.title).length,
				meta_title_chars: toString(data.meta_title).length,
				description_chars: toString(data.description).length,
				has_tldr: /<summary[^>]*>\s*TL;DR/i.test(blog.content),
				has_testimony_ledger: /TESTIMONY LEDGER/i.test(blog.content),
				has_heading_mix_ledger: /HEADING MIX LEDGER/i.test(blog.content),
				has_distribution_ledger: /DISTRIBUTION LEDGER/i.test(blog.content),
				has_faq_schema: Array.isArray(data.faqs) && data.faqs.length > 0
			},
			link_stats: {
				outgoing_internal_count: blog.outgoingInternalHrefs.size,
				outgoing_personality_count: [...blog.outgoingInternalHrefs].filter(
					(href) =>
						href.startsWith('/personality-analysis/') &&
						!href.startsWith('/personality-analysis/categories/') &&
						!href.startsWith('/personality-analysis/type/')
				).length,
				outgoing_enneagram_count: [...blog.outgoingInternalHrefs].filter((href) =>
					href.startsWith('/enneagram-corner/')
				).length,
				outgoing_category_count: [...blog.outgoingInternalHrefs].filter((href) =>
					href.startsWith('/personality-analysis/categories/')
				).length,
				external_link_count: blog.outgoingExternalHrefs.size,
				incoming_internal_count: incomingBySlug.get(blog.slug)?.length ?? 0,
				suggestion_count: suggestions.length,
				suggestions_existing_count: suggestions.filter((suggestion) =>
					knownSlugs.has(normalizeSlug(suggestion))
				).length,
				missing_suggestions: missingSuggestions,
				outgoing_targets: outgoingTargets,
				incoming_sources: (incomingBySlug.get(blog.slug) ?? []).slice(0, 12)
			}
		};

		return {
			...baseRow,
			diagnostic_scores: buildScores(baseRow),
			action_notes: buildActionNotes(baseRow),
			replication_notes: buildReplicationNotes(baseRow)
		};
	});
}
