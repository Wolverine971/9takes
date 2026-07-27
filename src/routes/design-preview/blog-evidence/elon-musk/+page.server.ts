// src/routes/design-preview/blog-evidence/elon-musk/+page.server.ts
import matter from 'gray-matter';
import elonDraft from '../../../../blog/people/drafts/Elon-Musk.md?raw';
import { processBlogContent } from '$lib/server/blogContentProcessor';

export async function load() {
	const parsed = matter(elonDraft);
	const processed = await processBlogContent(parsed.content);

	return {
		title: String(parsed.data.title ?? 'Elon Musk personality analysis'),
		description: String(parsed.data.description ?? ''),
		lastmod: String(parsed.data.lastmod ?? ''),
		content: processed.content,
		evidenceCount: processed.placeholders.filter(
			(placeholder) => placeholder.type === 'EvidenceFigure'
		).length
	};
}
