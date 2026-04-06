// src/lib/server/consultingResource.ts
import { load as parseHtml } from 'cheerio';
import { marked } from 'marked';

export const consultingResourceCategories = [
	'playbook',
	'framework',
	'script',
	'reference',
	'exercise'
] as const;

export type ConsultingResourceCategory = (typeof consultingResourceCategories)[number];

const allowedTags = new Set([
	'h1',
	'h2',
	'h3',
	'h4',
	'p',
	'ul',
	'ol',
	'li',
	'strong',
	'em',
	'code',
	'pre',
	'blockquote',
	'hr',
	'a',
	'table',
	'thead',
	'tbody',
	'tr',
	'th',
	'td',
	'br'
]);

export function normalizeConsultingResourceSlug(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, '-');
}

export function normalizeConsultingResourceRelatedBlogSlug(
	value: string | null | undefined
): string | null {
	const collapsed = collapseWhitespace(value ?? '');
	if (!collapsed) {
		return null;
	}

	if (/^https?:\/\//i.test(collapsed)) {
		return collapsed;
	}

	return collapsed.replace(/^\/+/, '');
}

export function renderConsultingResourceMarkdown(markdown: string | null | undefined): string {
	const normalized = normalizeMarkdown(markdown ?? '');
	if (!normalized) {
		return '';
	}

	const renderedHtml = marked.parse(normalized, { async: false }) as string;
	return sanitizeConsultingResourceHtml(renderedHtml);
}

function normalizeMarkdown(markdown: string): string {
	return markdown.replace(/\r\n/g, '\n').trim();
}

function collapseWhitespace(input: string): string {
	return input.replace(/\s+/g, ' ').trim();
}

function sanitizeConsultingResourceHtml(renderedHtml: string): string {
	const $ = parseHtml(`<article data-root="resource-root">${renderedHtml}</article>`);
	const root = $('[data-root="resource-root"]');

	root.find('*').each((_, element) => {
		const tag = element.tagName?.toLowerCase();
		if (!tag) return;

		if (!allowedTags.has(tag)) {
			const text = collapseWhitespace($(element).text());
			if (text) {
				$(element).replaceWith($('<p></p>').text(text));
			} else {
				$(element).remove();
			}
			return;
		}

		for (const attribute of Object.keys(element.attribs ?? {})) {
			if (tag === 'a' && attribute === 'href') continue;
			$(element).removeAttr(attribute);
		}

		if (tag === 'a') {
			const href = $(element).attr('href') ?? '';
			if (!isSafeHref(href)) {
				$(element).replaceWith($(element).text());
				return;
			}

			$(element).attr('rel', 'nofollow noopener noreferrer');
			if (/^https?:\/\//i.test(href)) {
				$(element).attr('target', '_blank');
			}
		}
	});

	root.find('p, blockquote').each((_, element) => {
		if (!collapseWhitespace($(element).text())) {
			$(element).remove();
		}
	});

	root.find('ul, ol').each((_, element) => {
		if ($(element).find('li').length === 0) {
			$(element).remove();
		}
	});

	root.find('pre').each((_, element) => {
		if (!collapseWhitespace($(element).text())) {
			$(element).remove();
		}
	});

	root.find('table').each((_, element) => {
		if ($(element).find('tr').length === 0) {
			$(element).remove();
		}
	});

	return root.html() ?? '';
}

function isSafeHref(href: string): boolean {
	return /^(https?:\/\/|\/|#)/i.test(href);
}
