// src/routes/enneagram-corner/subtopic/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { CORNER_SECTIONS } from '$lib/data/enneagramCornerTaxonomy.js';
import { buildSectionView, loadCornerPosts } from '$lib/server/enneagramCornerSections';

// Sections come from the taxonomy; mental-health has its own route. Must stay
// in sync with ENNEAGRAM_SUBTOPIC_SLUGS in scripts/generate-sitemap.js (the
// taxonomy spec checks it). Unknown slugs 404 so arbitrary URLs never index.
const SUBTOPIC_SECTIONS = new Set(
	CORNER_SECTIONS.map((section) => section.slug).filter((slug) => slug !== 'mental-health')
);

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;

	if (slug === 'mental-health') throw redirect(301, '/enneagram-corner/mental-health');
	if (!SUBTOPIC_SECTIONS.has(slug)) throw error(404, 'Subtopic not found');

	const posts = await loadCornerPosts();
	return { slug, view: buildSectionView(posts, slug) };
};
