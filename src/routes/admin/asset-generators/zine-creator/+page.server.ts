// src/routes/admin/asset-generators/zine-creator/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import matter from 'gray-matter';
import { marked } from 'marked';
import { load as parseHtml } from 'cheerio';
import { slugFromPath } from '$lib/slugFromPath';
import type { Database } from '../../../../../database.types';
import {
	normalizeEnneagram,
	slugify,
	type ImportedZineBlog,
	type ZineImageAsset,
	type ZineSection,
	type ZineSource
} from './zine-utils';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];

type ParsedSupportedUrl = {
	source: ZineSource;
	slug: string;
	canonicalUrl: string;
};

type RecentEnneagramBlog = {
	source: Extract<ZineSource, 'enneagram-main' | 'enneagram-mental-health'>;
	slug: string;
	title: string;
	description: string;
	date: string;
	lastmod: string;
	enneagram: number | null;
	url: string;
};

const RAW_ENNEAGRAM_MODULES = import.meta.glob('/src/blog/enneagram/**/*.{md,svx,svelte.md}', {
	query: '?raw',
	import: 'default'
});

const BLOCKED_PATH_SEGMENTS = new Set(['subtopic']);
const SOCIAL_VARIANTS = ['.instagram.', '.twitter.', '.reddit.', '.review.'];

const MARKDOWN_COMPONENTS = ['QuickAnswer', 'InsightBox'];
const COMPONENT_TAGS_TO_REMOVE = [
	'quickanswer',
	'insightbox',
	'popcard',
	'blogpurpose',
	'marqueehorizontal',
	'famoustypes'
];

export const load: PageServerLoad = async ({ locals }) => {
	const [enneagramBlogs, peopleQuery] = await Promise.all([
		getRecentEnneagramBlogs(20),
		locals.supabase
			.from('blogs_famous_people')
			.select('person, title, description, lastmod, date, enneagram, loc, published')
			.eq('published', true)
			.order('lastmod', { ascending: false, nullsFirst: false })
			.limit(20)
	]);

	const peopleBlogs = (peopleQuery.data ?? []).map((row) => {
		const typedRow = row as Pick<
			FamousPersonRow,
			'person' | 'title' | 'description' | 'lastmod' | 'date' | 'enneagram' | 'loc'
		>;
		const slug = typedRow.person ?? '';
		const fallbackUrl = slug
			? `https://9takes.com/personality-analysis/${slug}`
			: 'https://9takes.com';
		return {
			source: 'personality-analysis' as const,
			slug,
			title: typedRow.title ?? slug,
			description: typedRow.description ?? '',
			date: typedRow.date ?? '',
			lastmod: typedRow.lastmod ?? typedRow.date ?? '',
			enneagram: normalizeEnneagram(typedRow.enneagram),
			url: typedRow.loc ?? fallbackUrl
		};
	});

	return {
		enneagramBlogs,
		peopleBlogs
	};
};

export const actions: Actions = {
	fetchBlog: async ({ request, locals }) => {
		try {
			const formData = await request.formData();
			const rawUrl = String(formData.get('url') ?? '').trim();
			if (!rawUrl) {
				return fail(400, {
					error: 'Please enter a blog URL from 9takes.com.'
				});
			}

			const parsedUrl = parseSupportedBlogUrl(rawUrl);
			const blog = await loadBlogFromSource(parsedUrl, locals.supabase);

			return {
				success: true,
				blog
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to load blog content.';
			return fail(400, {
				error: message
			});
		}
	}
};

function normalizeInputUrl(input: string): URL {
	const trimmed = input.trim();
	if (!trimmed) {
		throw new Error('URL is required.');
	}

	let normalized = trimmed;
	if (trimmed.startsWith('/')) {
		normalized = `https://9takes.com${trimmed}`;
	} else if (!/^https?:\/\//i.test(trimmed)) {
		normalized = `https://${trimmed}`;
	}

	try {
		return new URL(normalized);
	} catch {
		throw new Error('Invalid URL format.');
	}
}

function parseSupportedBlogUrl(input: string): ParsedSupportedUrl {
	const url = normalizeInputUrl(input);
	const hostname = url.hostname.toLowerCase();
	if (hostname !== '9takes.com' && hostname !== 'www.9takes.com') {
		throw new Error('Only URLs from 9takes.com are supported.');
	}

	const pathname = url.pathname.replace(/\/+$/, '') || '/';

	const mentalHealthMatch = pathname.match(/^\/enneagram-corner\/mental-health\/([^/]+)$/i);
	if (mentalHealthMatch?.[1]) {
		const slug = decodeURIComponent(mentalHealthMatch[1]);
		return {
			source: 'enneagram-mental-health',
			slug,
			canonicalUrl: `https://9takes.com/enneagram-corner/mental-health/${slug}`
		};
	}

	const enneagramMatch = pathname.match(/^\/enneagram-corner\/([^/]+)$/i);
	if (enneagramMatch?.[1]) {
		const slug = decodeURIComponent(enneagramMatch[1]);
		if (BLOCKED_PATH_SEGMENTS.has(slug.toLowerCase()) || slug.toLowerCase() === 'mental-health') {
			throw new Error('This Enneagram route is not supported in zine creator v1.');
		}

		return {
			source: 'enneagram-main',
			slug,
			canonicalUrl: `https://9takes.com/enneagram-corner/${slug}`
		};
	}

	const peopleMatch = pathname.match(/^\/personality-analysis\/([^/]+)$/i);
	if (peopleMatch?.[1]) {
		const slug = decodeURIComponent(peopleMatch[1]);
		return {
			source: 'personality-analysis',
			slug,
			canonicalUrl: `https://9takes.com/personality-analysis/${slug}`
		};
	}

	throw new Error(
		'Unsupported blog path. Use /enneagram-corner/* or /personality-analysis/* URLs.'
	);
}

async function loadBlogFromSource(
	parsed: ParsedSupportedUrl,
	supabase: App.Locals['supabase']
): Promise<ImportedZineBlog> {
	if (parsed.source === 'personality-analysis') {
		return loadPersonalityAnalysisBlog(parsed.slug, parsed.canonicalUrl, supabase);
	}

	return loadEnneagramBlog(parsed.slug, parsed.source);
}

async function loadPersonalityAnalysisBlog(
	slug: string,
	fallbackUrl: string,
	supabase: App.Locals['supabase']
): Promise<ImportedZineBlog> {
	const { data, error } = await supabase
		.from('blogs_famous_people')
		.select('person, title, author, date, lastmod, description, enneagram, content, loc, published')
		.ilike('person', slug)
		.eq('published', true)
		.maybeSingle();

	if (error) {
		throw new Error(`Failed to load personality-analysis post: ${error.message}`);
	}

	if (!data) {
		throw new Error(`No published personality-analysis post found for slug "${slug}".`);
	}

	const row = data as Pick<
		FamousPersonRow,
		| 'person'
		| 'title'
		| 'author'
		| 'date'
		| 'lastmod'
		| 'description'
		| 'enneagram'
		| 'content'
		| 'loc'
	>;
	const markdown = row.content ?? '';
	const renderedHtml = String(await marked.parse(markdown));

	const extracted = extractContentData(renderedHtml, markdown);
	const postSlug = row.person ?? slug;
	const sourceUrl = row.loc ?? fallbackUrl;

	return {
		source: 'personality-analysis',
		slug: postSlug,
		title: row.title ?? postSlug,
		author: row.author ?? '9takes',
		date: row.date ?? row.lastmod ?? '',
		description: row.description ?? '',
		enneagram: normalizeEnneagram(row.enneagram),
		sourceUrl,
		bodyHtml: extracted.bodyHtml,
		headings: extracted.headings,
		images: extracted.images,
		sections: extracted.sections,
		pullQuotes: extracted.pullQuotes
	};
}

async function loadEnneagramBlog(
	slug: string,
	source: Extract<ZineSource, 'enneagram-main' | 'enneagram-mental-health'>
): Promise<ImportedZineBlog> {
	const expectedMentalHealth = source === 'enneagram-mental-health';

	for (const [path, resolver] of Object.entries(RAW_ENNEAGRAM_MODULES)) {
		if (isExcludedEnneagramPath(path)) continue;
		if (slugFromPath(path) !== slug) continue;

		const isMentalHealthPath = path.includes('/mental-health/');
		if (expectedMentalHealth !== isMentalHealthPath) continue;

		const raw = String((await resolver()) as string);
		const { data: metadata, content } = matter(raw);
		const frontmatter = metadata as Partial<App.BlogPost>;
		if (frontmatter.published === false) {
			continue;
		}

		const renderedHtml = String(await marked.parse(content));
		const extracted = extractContentData(renderedHtml, content);

		const sourceUrl =
			typeof frontmatter.loc === 'string' && frontmatter.loc
				? frontmatter.loc
				: expectedMentalHealth
					? `https://9takes.com/enneagram-corner/mental-health/${slug}`
					: `https://9takes.com/enneagram-corner/${slug}`;

		const fallbackType =
			inferTypeNumberFromSlug(slug) ?? inferTypeNumberFromTitle(frontmatter.title);

		return {
			source,
			slug,
			title: frontmatter.title ?? slug,
			author: frontmatter.author ?? '9takes',
			date: frontmatter.date ?? frontmatter.lastmod ?? '',
			description: frontmatter.description ?? '',
			enneagram:
				normalizeEnneagram((frontmatter as { enneagram?: unknown }).enneagram) ?? fallbackType,
			sourceUrl,
			bodyHtml: extracted.bodyHtml,
			headings: extracted.headings,
			images: extracted.images,
			sections: extracted.sections,
			pullQuotes: extracted.pullQuotes
		};
	}

	throw new Error(`No published Enneagram post found for slug "${slug}".`);
}

function isExcludedEnneagramPath(path: string): boolean {
	if (path.includes('/drafts/')) return true;
	if (path.includes('/subtopic/')) return true;
	if (SOCIAL_VARIANTS.some((marker) => path.includes(marker))) return true;
	return false;
}

function inferTypeNumberFromSlug(slug: string): number | null {
	const match = slug.match(/enneagram-type-(\d)$/i);
	if (!match?.[1]) return null;
	const value = Number.parseInt(match[1], 10);
	return Number.isInteger(value) && value >= 1 && value <= 9 ? value : null;
}

function inferTypeNumberFromTitle(title?: string | null): number | null {
	if (!title) return null;
	const match = title.match(/type\s*(\d)/i);
	if (!match?.[1]) return null;
	const value = Number.parseInt(match[1], 10);
	return Number.isInteger(value) && value >= 1 && value <= 9 ? value : null;
}

function sanitizeHtmlForZine(renderedHtml: string): string {
	const $ = parseHtml(`<article>${renderedHtml}</article>`);
	const article = $('article');

	article
		.find('script,style,iframe,form,button,input,select,textarea,video,audio,noscript,template')
		.remove();

	for (const tag of COMPONENT_TAGS_TO_REMOVE) {
		article.find(tag).remove();
	}

	article.find('[id^="component-"]').remove();

	return (article.html() ?? '').trim();
}

function extractSectionsFromHtml(bodyHtml: string): ZineSection[] {
	const headingRegex = /<h2[^>]*>[\s\S]*?<\/h2>/gi;
	const matches = [...bodyHtml.matchAll(headingRegex)];

	if (matches.length === 0) {
		return [buildSection('Main', bodyHtml, 0)];
	}

	const sections: ZineSection[] = [];
	for (let index = 0; index < matches.length; index++) {
		const current = matches[index];
		const next = matches[index + 1];
		const start = current.index ?? 0;
		const end = next?.index ?? bodyHtml.length;
		const sectionHtml = bodyHtml.slice(start, end).trim();
		const sectionTitle = htmlToText(current[0]).trim() || `Section ${index + 1}`;
		sections.push(buildSection(sectionTitle, sectionHtml, index));
	}

	return sections;
}

function buildSection(title: string, html: string, index: number): ZineSection {
	const sectionRoot = parseHtml(`<section>${html}</section>`);
	const paragraphs = sectionRoot('section p, section li, section h3, section h4')
		.toArray()
		.map((element) => sectionRoot(element).text().replace(/\s+/g, ' ').trim())
		.filter(Boolean);

	const sectionText = sectionRoot('section').text().replace(/\s+/g, ' ').trim();
	const fallbackParagraphs = sectionText
		? sectionText
				.split(/(?<=[.!?])\s+/)
				.map((entry) => entry.trim())
				.filter(Boolean)
		: [];

	return {
		id: `section-${index + 1}-${slugify(title)}`,
		title,
		html,
		text: sectionText,
		paragraphs: paragraphs.length ? paragraphs : fallbackParagraphs,
		include: true,
		order: index
	};
}

function extractImagesFromHtml(bodyHtml: string): ZineImageAsset[] {
	const $ = parseHtml(`<article>${bodyHtml}</article>`);
	const images: ZineImageAsset[] = [];

	$('img').each((_index, element) => {
		const src = $(element).attr('src')?.trim() ?? '';
		if (!src) return;
		const alt = $(element).attr('alt')?.trim() ?? '';
		const caption = $(element).attr('title')?.trim() ?? '';
		images.push({ src, alt, caption });
	});

	return images;
}

function extractHeadingsFromHtml(bodyHtml: string): string[] {
	const $ = parseHtml(`<article>${bodyHtml}</article>`);
	return $('h2')
		.toArray()
		.map((element) => $(element).text().replace(/\s+/g, ' ').trim())
		.filter(Boolean);
}

function extractPullQuotes(markdown: string, bodyHtml: string): string[] {
	const quotes = new Set<string>();
	const $ = parseHtml(`<article>${bodyHtml}</article>`);

	$('blockquote').each((_index, element) => {
		const value = $(element).text().replace(/\s+/g, ' ').trim();
		if (value.length >= 20) {
			quotes.add(value);
		}
	});

	for (const tag of MARKDOWN_COMPONENTS) {
		const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
		for (const match of markdown.matchAll(regex)) {
			const raw = (match[1] ?? '').trim();
			if (!raw) continue;
			const cleaned = markdownToText(raw).replace(/\s+/g, ' ').trim();
			if (cleaned.length >= 20) {
				quotes.add(cleaned);
			}
		}
	}

	return [...quotes].slice(0, 12);
}

function extractContentData(
	renderedHtml: string,
	markdown: string
): {
	bodyHtml: string;
	headings: string[];
	images: ZineImageAsset[];
	sections: ZineSection[];
	pullQuotes: string[];
} {
	const bodyHtml = sanitizeHtmlForZine(renderedHtml);
	const headings = extractHeadingsFromHtml(bodyHtml);
	const images = extractImagesFromHtml(bodyHtml);
	const sections = extractSectionsFromHtml(bodyHtml);
	const pullQuotes = extractPullQuotes(markdown, bodyHtml);

	return {
		bodyHtml,
		headings,
		images,
		sections,
		pullQuotes
	};
}

function htmlToText(html: string): string {
	const $ = parseHtml(`<div>${html}</div>`);
	return $('div').text();
}

function markdownToText(markdown: string): string {
	return markdown
		.replace(/<[^>]*>/g, ' ')
		.replace(/\[(.*?)\]\((.*?)\)/g, '$1')
		.replace(/[_*`>#-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

async function getRecentEnneagramBlogs(limit: number): Promise<RecentEnneagramBlog[]> {
	const blogs: RecentEnneagramBlog[] = [];

	for (const [path, resolver] of Object.entries(RAW_ENNEAGRAM_MODULES)) {
		if (isExcludedEnneagramPath(path)) continue;

		const raw = String((await resolver()) as string);
		const { data } = matter(raw);
		const frontmatter = data as Partial<App.BlogPost>;
		if (frontmatter.published === false) continue;
		if (frontmatter.blog === false) continue;

		const isMentalHealth = path.includes('/mental-health/');
		const source = isMentalHealth ? 'enneagram-mental-health' : 'enneagram-main';
		const slug = slugFromPath(path);
		const fallbackUrl = isMentalHealth
			? `https://9takes.com/enneagram-corner/mental-health/${slug}`
			: `https://9takes.com/enneagram-corner/${slug}`;
		const title = frontmatter.title ?? slug;

		blogs.push({
			source,
			slug,
			title,
			description: frontmatter.description ?? '',
			date: frontmatter.date ?? '',
			lastmod: frontmatter.lastmod ?? frontmatter.date ?? '',
			enneagram:
				normalizeEnneagram((frontmatter as { enneagram?: unknown }).enneagram) ??
				inferTypeNumberFromSlug(slug) ??
				inferTypeNumberFromTitle(title),
			url: (typeof frontmatter.loc === 'string' && frontmatter.loc) || fallbackUrl
		});
	}

	return blogs
		.sort((a, b) => sortByDateDesc(a.lastmod || a.date, b.lastmod || b.date))
		.slice(0, limit);
}

function sortByDateDesc(a: string, b: string): number {
	const aTime = Date.parse(a || '') || 0;
	const bTime = Date.parse(b || '') || 0;
	return bTime - aTime;
}
