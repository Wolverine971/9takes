import type { PageLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import { error } from '@sveltejs/kit';

const MAX_POSTS = 6;

export const load: PageLoad = async ({
	params
}): Promise<{
	component: any;
	frontmatter: any;
	slug: string;
	posts: App.BlogPost[];
}> => {
	const pposts: { post: any; posts: any[] } = await getAllPosts(params.slug);
	let group: any = null;
	switch (pposts.post.type[0]) {
		case 'celebrity':
			group = import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`);
			break;
		case 'commedian':
			group = import.meta.glob(`/src/blog/people/commedians/*.{md,svx,svelte.md}`);
			break;
		case 'creator':
			group = import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`);
			break;
		case 'lifestyleInfluencers':
			group = import.meta.glob(`/src/blog/people/lifestyle-influencers/*.{md,svx,svelte.md}`);
			break;
		case 'movieStar':
			group = import.meta.glob(`/src/blog/people/movie-stars/*.{md,svx,svelte.md}`);
			break;
		case 'musician':
			group = import.meta.glob(`/src/blog/people/musicians/*.{md,svx,svelte.md}`);
			break;
		case 'politician':
			group = import.meta.glob(`/src/blog/people/politicians/*.{md,svx,svelte.md}`);
			break;
		case 'techie':
			group = import.meta.glob(`/src/blog/people/techies/*.{md,svx,svelte.md}`);
			break;
		case 'tiktoker':
			group = import.meta.glob(`/src/blog/people/tiktokers/*.{md,svx,svelte.md}`);
			break;
		case 'historical':
			group = import.meta.glob(`/src/blog/people/historical/*.{md,svx,svelte.md}`);
			break;

		default:
			break;
	}

	let match: { path?: string; resolver?: App.MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(group)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as App.MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();

	const postPromises = Object.entries(group).map(
		([path, resolver]: [path: string, resolver: any]) =>
			resolver().then(
				(post: any) =>
					({
						slug: slugFromPath(path),
						...(post as unknown as App.MdsvexFile).metadata
					} as App.BlogPost)
			)
	);

	const posts = await Promise.all(postPromises);
	const publishedPosts = posts
		.filter((p) => p.published)
		.filter(
			(p) =>
				(post?.metadata.enneagram &&
					p?.enneagram === parseInt(post?.metadata.enneagram as string)) ||
				(post?.metadata.type[0] && p.type?.includes(post?.metadata.type[0]))
		)
		.filter((p) => params.slug !== p.slug)
		.slice(0, MAX_POSTS);

	publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	if (!post || !post.metadata.published) {
		// throw error(404); // Couldn't resolve the post
		throw error(404, {
			message: `Couldn't resolve the post`
		});
	}

	return {
		component: post.default,
		frontmatter: post.metadata as App.BlogPost,
		slug: params.slug,
		posts: publishedPosts
	};
};

const getAllPosts = async (pslug: any) => {
	const celebrities = import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`);
	const commedians = import.meta.glob(`/src/blog/people/commedians/*.{md,svx,svelte.md}`);
	const creators = import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`);
	const lifestyleInfluencers = import.meta.glob(
		`/src/blog/people/lifestyle-influencers/*.{md,svx,svelte.md}`
	);
	const movieStars = import.meta.glob(`/src/blog/people/movie-stars/*.{md,svx,svelte.md}`);
	const historical = import.meta.glob(`/src/blog/people/historical/*.{md,svx,svelte.md}`);
	const musicians = import.meta.glob(`/src/blog/people/musicians/*.{md,svx,svelte.md}`);
	const politicians = import.meta.glob(`/src/blog/people/politicians/*.{md,svx,svelte.md}`);
	const techies = import.meta.glob(`/src/blog/people/techies/*.{md,svx,svelte.md}`);
	const tiktokers = import.meta.glob(`/src/blog/people/tiktokers/*.{md,svx,svelte.md}`);

	const imports = [
		celebrities,
		commedians,
		creators,
		lifestyleInfluencers,
		movieStars,
		historical,
		musicians,
		politicians,
		techies,
		tiktokers
	];

	const body = [];
	let post = null;

	for (const category in imports) {
		for (const path in imports[category]) {
			body.push(
				imports[category][path]().then(({ metadata }: any) => {
					const parts = path.split('/');
					const slug = slugFromPath(parts[parts.length - 1]);
					if (slug === pslug) {
						post = {
							...metadata, // may not be required for sitemap
							path,
							slug
						};
					}
					if (metadata) {
						return {
							...metadata, // may not be required for sitemap
							path,
							slug
						};
					}
				})
			);
		}
	}
	const posts = await Promise.all(body);

	return {
		posts: posts.filter((p) => {
			if (p?.published && p?.loc) {
				return true;
			}
		}),
		post
	};
};
