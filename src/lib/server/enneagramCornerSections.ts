// src/lib/server/enneagramCornerSections.ts
// Builds an Enneagram Corner section page (Relationships, Mental Health, ...)
// as lanes of posts, one lane per subtopic in $lib/data/enneagramCornerTaxonomy.
import matter from 'gray-matter';
import {
	CORNER_SECTIONS,
	getCornerSection,
	getPostLane,
	getPostSections,
	toStringList
} from '$lib/data/enneagramCornerTaxonomy.js';
import { slugFromPath } from '$lib/slugFromPath';
import type {
	CornerCard,
	CornerLane,
	CornerPost,
	CornerSectionView
} from '$lib/types/enneagramCorner';

export type { CornerCard, CornerLane, CornerPost, CornerSectionView };

const RAW_CORNER_MODULES = import.meta.glob(
	[
		'/src/blog/enneagram/**/*.{md,svx,svelte.md}',
		'!**/drafts/**',
		'!**/*.instagram.md',
		'!**/*.twitter.md',
		'!**/*.reddit.md',
		'!**/*.review.md',
		'!**/blog-optimization-strategies.md'
	],
	{ query: '?raw', import: 'default' }
);

const asString = (value: unknown): string | null =>
	typeof value === 'string' && value ? value : value instanceof Date ? value.toISOString() : null;

/** Frontmatter + file path -> post. Mental-health folder posts live under /mental-health/. */
export function toCornerPost(path: string, data: Record<string, unknown>): CornerPost | null {
	const slug = slugFromPath(path);
	const title = asString(data.title);
	if (!slug || !title) return null;
	const inMentalHealthFolder = path.includes('/mental-health/');
	return {
		slug,
		href: inMentalHealthFolder
			? `/enneagram-corner/mental-health/${slug}`
			: `/enneagram-corner/${slug}`,
		title,
		description: asString(data.description) ?? '',
		pic: asString(data.pic),
		date: asString(data.date),
		lastmod: asString(data.lastmod) ?? asString(data.date),
		published: data.published === true,
		type: toStringList(data.type),
		subtopics: toStringList(data.subtopics)
	};
}

let cornerPostsPromise: Promise<CornerPost[]> | null = null;

export function loadCornerPosts(): Promise<CornerPost[]> {
	cornerPostsPromise ??= Promise.all(
		Object.entries(RAW_CORNER_MODULES).map(async ([path, resolver]) => {
			const raw = await resolver();
			if (typeof raw !== 'string') return null;
			return toCornerPost(path, matter(raw).data);
		})
	).then((posts) => posts.filter((post): post is CornerPost => post !== null));
	return cornerPostsPromise;
}

const sortTime = (post: Pick<CornerPost, 'lastmod' | 'date'>): number => {
	const time = new Date(post.lastmod ?? post.date ?? 0).getTime();
	return Number.isFinite(time) ? time : 0;
};

/** enneagram-type-8 -> 8, so the nine-types lanes read in type order. */
const typeNumber = (slug: string): number => Number(slug.match(/type-(\d)$/)?.[1] ?? 99);

function toCard({ slug, href, title, description, pic, date, lastmod }: CornerPost): CornerCard {
	return { slug, href, title, description, pic, date, lastmod };
}

export function buildSectionView(posts: CornerPost[], sectionSlug: string): CornerSectionView {
	const section = getCornerSection(sectionSlug);
	if (!section) throw new Error(`Unknown Enneagram Corner section: ${sectionSlug}`);

	const published = posts.filter((post) => post.published);
	const members = published.filter((post) => getPostSections(post).includes(sectionSlug));
	const order =
		sectionSlug === 'nine-types'
			? (a: CornerPost, b: CornerPost) => typeNumber(a.slug) - typeNumber(b.slug)
			: (a: CornerPost, b: CornerPost) => sortTime(b) - sortTime(a);

	const lanes: CornerLane[] = section.subtopics.map((subtopic) => ({
		slug: subtopic.slug,
		title: subtopic.title,
		descriptor: subtopic.descriptor,
		posts: members
			.filter((post) => getPostLane(post, sectionSlug)?.slug === subtopic.slug)
			.sort(order)
			.map(toCard)
	}));

	// The audit keeps this empty; if a post slips through untagged it still shows.
	const untagged = members.filter((post) => !getPostLane(post, sectionSlug));
	if (untagged.length > 0) {
		lanes.push({
			slug: 'more',
			title: 'More reads',
			descriptor: `Everything else in ${section.title}.`,
			posts: untagged.sort(order).map(toCard)
		});
	}

	const latestUpdate = [...members].sort((a, b) => sortTime(b) - sortTime(a))[0];

	const otherSections = CORNER_SECTIONS.filter((other) => other.slug !== sectionSlug).map(
		(other) => ({
			slug: other.slug,
			title: other.title,
			href: other.href,
			descriptor: other.descriptor,
			count: published.filter((post) => getPostSections(post).includes(other.slug)).length
		})
	);

	return {
		section: {
			slug: section.slug,
			title: section.title,
			href: section.href,
			descriptor: section.descriptor
		},
		lanes: lanes.filter((lane) => lane.posts.length > 0),
		emptyLanes: lanes.filter((lane) => lane.posts.length === 0).map((lane) => lane.slug),
		total: members.length,
		latestUpdate: latestUpdate ? (latestUpdate.lastmod ?? latestUpdate.date) : null,
		otherSections
	};
}

/** Lane chips for the hub: published-post counts per subtopic, per section. */
export function buildSubtopicCounts(
	posts: { published?: unknown; type?: unknown; subtopics?: unknown }[]
): Record<string, { total: number; subtopics: { slug: string; title: string; count: number }[] }> {
	const published = posts.filter((post) => post.published);
	return Object.fromEntries(
		CORNER_SECTIONS.map((section) => {
			const members = published.filter((post) => getPostSections(post).includes(section.slug));
			return [
				section.slug,
				{
					total: members.length,
					subtopics: section.subtopics
						.map((subtopic) => ({
							slug: subtopic.slug,
							title: subtopic.title,
							count: members.filter(
								(post) => getPostLane(post, section.slug)?.slug === subtopic.slug
							).length
						}))
						.filter((subtopic) => subtopic.count > 0)
				}
			];
		})
	);
}
