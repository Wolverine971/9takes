// src/routes/blog/+page.server.ts
import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	const popCultureModules = import.meta.glob(`/src/blog/pop-culture/*.{md,svx,svelte.md}`);
	const enneagramModules = import.meta.glob(`/src/blog/enneagram/**/*.{md,svx,svelte.md}`);
	const guidesModules = import.meta.glob(`/src/blog/guides/*.{md,svx,svelte.md}`);
	const communityModules = import.meta.glob(`/src/blog/community/*.{md,svx,svelte.md}`);

	const resolveModules = async (
		modules: Record<string, () => Promise<unknown>>,
		limit: number
	): Promise<App.BlogPost[]> => {
		const promises = Object.entries(modules).map(([path, resolver]) =>
			resolver().then(
				(post) =>
					({
						...(post as unknown as App.MdsvexFile).metadata,
						slug: slugFromPath(path)
					}) as App.BlogPost
			)
		);
		const posts = await Promise.all(promises);
		return posts
			.filter((post) => post.published)
			.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
			.slice(0, limit);
	};

	const peoplePromise = supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true)
		.limit(6)
		.order('date', { ascending: false });

	const [popCulture, enneagram, guides, community, peopleResult] = await Promise.all([
		resolveModules(popCultureModules, 3),
		resolveModules(enneagramModules, 6),
		resolveModules(guidesModules, 3),
		resolveModules(communityModules, 3),
		peoplePromise
	]);

	if (peopleResult.error) {
		console.error('Error fetching personality analysis:', peopleResult.error);
	}

	const people = (peopleResult.data ?? []).map((e) => ({
		...e,
		slug: e.person
	}));

	return {
		popCulture,
		people,
		enneagram,
		guides,
		community
	};
};
