// src/routes/admin/drafts/+page.server.ts
import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

type DraftListItem = Pick<
	App.BlogPost,
	'title' | 'description' | 'enneagram' | 'date' | 'lastmod'
> & {
	slug: string;
	path: string;
};

// Server-only on purpose. As a universal +page.ts this load re-ran in the browser
// during hydration and downloaded all ~540 compiled drafts (~17MB of JS) just to
// read their frontmatter. Drafts only change on deploy, so the list is built once
// per server instance. Only the fields the list renders are sent: full frontmatter
// (faqs, citations, keywords...) serializes to ~3MB.
let draftsPromise: Promise<DraftListItem[]> | null = null;

async function loadDraftList(): Promise<DraftListItem[]> {
	const modules = import.meta.glob(`/src/blog/people/drafts/*.{md,svx,svelte.md}`);

	const posts = await Promise.all(
		Object.entries(modules).map(([path, resolver]) =>
			resolver().then((post): DraftListItem => {
				const { title, description, enneagram, date, lastmod } = (post as unknown as App.MdsvexFile)
					.metadata as App.BlogPost;
				return { title, description, enneagram, date, lastmod, slug: slugFromPath(path), path };
			})
		)
	);

	// Sort by last modified date, most recent first
	posts.sort((a, b) => (new Date(a.lastmod || a.date) > new Date(b.lastmod || b.date) ? -1 : 1));

	return posts;
}

export const load: PageServerLoad = async ({ parent }) => {
	draftsPromise ??= loadDraftList().catch((err) => {
		draftsPromise = null;
		throw err;
	});

	// The admin layout is the guard. Crafted __data.json requests can skip layout loads;
	// awaiting parent() forces it to run, so non-admins get its redirect, not the list.
	const [, drafts] = await Promise.all([parent(), draftsPromise]);
	return { drafts };
};
