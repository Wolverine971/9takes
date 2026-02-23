// src/routes/blog/+page.server.ts
import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	type BlogCardPost = Pick<App.BlogPost, 'slug' | 'title' | 'description' | 'date' | 'pic'>;
	type BlogCardPerson = {
		slug: string;
		enneagram: number | null;
	};

	const popCultureModules = import.meta.glob(`/src/blog/pop-culture/*.{md,svx,svelte.md}`);
	const enneagramModules = import.meta.glob(`/src/blog/enneagram/**/*.{md,svx,svelte.md}`);
	const guidesModules = import.meta.glob(`/src/blog/guides/*.{md,svx,svelte.md}`);
	const communityModules = import.meta.glob(`/src/blog/community/*.{md,svx,svelte.md}`);

	const resolveModules = async (
		modules: Record<string, () => Promise<unknown>>,
		limit: number
	): Promise<BlogCardPost[]> => {
		const promises = Object.entries(modules).map(async ([path, resolver]) => {
			const post = await resolver();
			const metadata = (post as Partial<App.MdsvexFile>).metadata;
			if (!metadata?.published || !metadata?.title || !metadata?.date) {
				return null;
			}

			return {
				slug: slugFromPath(path),
				title: metadata.title,
				description: metadata.description ?? '',
				date: metadata.date,
				pic: metadata.pic
			} as BlogCardPost;
		});

		const posts = (await Promise.all(promises)).filter(
			(post): post is BlogCardPost => post !== null
		);
		return posts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1)).slice(0, limit);
	};

	const peoplePromise = supabase
		.from('blogs_famous_people')
		.select('person,enneagram')
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

	const people: BlogCardPerson[] = (peopleResult.data ?? []).map((e) => ({
		slug: e.person ?? '',
		enneagram: e.enneagram ? Number(e.enneagram) : null
	}));

	return {
		popCulture,
		people,
		enneagram,
		guides,
		community
	};
};
