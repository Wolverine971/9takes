// routes/blog/famous-enneagram-types/[slug]/+page.ts
import { slugFromPath } from '$lib/slugFromPath';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async (
	event: any
): Promise<{
	component: any;
	comments: any[];
	metadata: App.BlogPost;
	slug: string;
	suggestions: {
		niche: { type: string; posts: App.BlogPost[] };
		sameEnneagram: { type: string; posts: App.BlogPost[] };
	};
	flags: {
		userHasAnswered: boolean;
		userSignedIn: boolean;
	};
}> => {
	const params = event.params;

	const { data: personData } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('person', params.slug)
		.maybeSingle()

	const { data: personsData } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true)


	const pposts: { post: any; posts: any[] } = {
		posts: personsData,
		post: personData
	};

	let group: any = null;
	switch (pposts.post.type[0]) {
		case 'celebrity':
			group = import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`);
			break;
		case 'comedians':
			group = import.meta.glob(`/src/blog/people/comedians/*.{md,svx,svelte.md}`);
			break;
		case 'creator':
			group = import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`);
			break;
		case 'lifestyleInfluencer':
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

	if (!post || !post.metadata.published) {
		throw error(404, {
			message: `Couldn't find the blog`
		});
	}

	const sameEnneagramPosts = pposts.posts
		.filter((p) => p.published)
		.filter(
			(p) =>
				post?.metadata.enneagram && p?.enneagram === parseInt(post?.metadata.enneagram as string)
		)
		.filter((p) => params.slug !== p.slug)
		.sort(() => 0.5 - Math.random());

	const sameNichePosts = pposts.posts
		.filter((p) => p.published)
		.filter((p) => post?.metadata.type?.length && p?.type?.includes(post?.metadata.type[0]))
		.filter((p) => params.slug !== p.slug)
		.sort(() => 0.5 - Math.random());

	return {
		component: post.default,
		comments: event.data.comments,
		metadata: post.metadata as App.BlogPost,
		slug: params.slug,
		suggestions: {
			niche: { posts: sameNichePosts, type: post.metadata.type ? post.metadata.type[0] : '' },
			sameEnneagram: {
				posts: sameEnneagramPosts,
				type: post.metadata.enneagram ? post.metadata.enneagram.toString() : ''
			}
		},
		flags: event.data.flags
	};
};


