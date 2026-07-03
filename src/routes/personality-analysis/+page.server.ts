// src/routes/personality-analysis/+page.server.ts
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import type { Database } from '../../../database.types';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];
type PersonPost = Pick<FamousPersonRow, 'person' | 'enneagram' | 'lastmod' | 'date'> & {
	slug: string;
};

const INDEX_QUERY_TIMEOUT_MS = 2500;

const FALLBACK_POSTS: PersonPost[] = [
	{
		person: 'Morgan Freeman',
		enneagram: '1',
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'morgan-freeman'
	},
	{
		person: 'Princess Diana',
		enneagram: '2',
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'princess-diana'
	},
	{
		person: 'Taylor Swift',
		enneagram: '3',
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'taylor-swift'
	},
	{
		person: 'Lady Gaga',
		enneagram: '4',
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'lady-gaga'
	},
	{
		person: 'Elon Musk',
		enneagram: '5',
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'elon-musk'
	},
	{
		person: 'Marilyn Monroe',
		enneagram: '6',
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'marilyn-monroe'
	},
	{
		person: 'Cathie Wood',
		enneagram: '7',
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'cathie-wood'
	},
	{ person: 'Rihanna', enneagram: '8', lastmod: '2026-06-01', date: '2026-06-01', slug: 'rihanna' },
	{
		person: 'Barack Obama',
		enneagram: '9',
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'barack-obama'
	},
	{
		person: 'Michelle Obama',
		enneagram: '1',
		lastmod: '2026-05-25',
		date: '2026-05-25',
		slug: 'michelle-obama'
	},
	{
		person: 'Sabrina Carpenter',
		enneagram: '3',
		lastmod: '2026-05-25',
		date: '2026-05-25',
		slug: 'sabrina-carpenter'
	},
	{
		person: 'Agatha Christie',
		enneagram: '5',
		lastmod: '2026-05-25',
		date: '2026-05-25',
		slug: 'agatha-christie'
	},
	{
		person: 'Mr Beast',
		enneagram: '8',
		lastmod: '2026-05-25',
		date: '2026-05-25',
		slug: 'mr-beast'
	},
	{
		person: 'Paul Rudd',
		enneagram: '9',
		lastmod: '2026-05-25',
		date: '2026-05-25',
		slug: 'paul-rudd'
	}
];

function withTimeout<T>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> {
	return Promise.race([
		Promise.resolve(promise),
		new Promise<T>((_, reject) => {
			setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
		})
	]);
}

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;
	let personData: Pick<FamousPersonRow, 'person' | 'enneagram' | 'lastmod' | 'date'>[] | null =
		null;

	try {
		const result = await withTimeout(
			supabase
				.from('blogs_famous_people')
				.select('person,enneagram,lastmod,date')
				.eq('published', true),
			INDEX_QUERY_TIMEOUT_MS,
			'personality-analysis index query'
		);

		if (result.error) {
			throw result.error;
		}

		personData = result.data ?? [];
	} catch (err) {
		console.warn('[personality-analysis] using fallback index data', err);
	}

	const posts: PersonPost[] = (personData?.length ? personData : FALLBACK_POSTS).map((e) => ({
		...e,
		slug: normalizePersonalitySlug(e.person)
	}));

	const uniqueTypes = Array.from(new Set(posts.map((obj) => obj.enneagram)));

	// Store objects of unique types
	const uniqueObjects: PersonPost[] = [];
	const typeCounts: Record<string, number> = {};

	// Iterate through unique types
	uniqueTypes.forEach((enneagram) => {
		// Find objects with current type
		const objectsWithType = posts.filter((obj) => obj.enneagram === enneagram);

		if (enneagram) {
			typeCounts[enneagram] = objectsWithType.length;
		}

		// Sort objects by date_created
		objectsWithType.sort(
			(a, b) =>
				new Date(b.lastmod ?? b.date ?? 0).getTime() - new Date(a.lastmod ?? a.date ?? 0).getTime()
		);

		// Push first 6 objects (two clean rows of 3) to uniqueObjects
		uniqueObjects.push(...objectsWithType.slice(0, 6));
	});

	const sortedByLastmod = [...posts].sort(
		(a, b) =>
			new Date(b.lastmod ?? b.date ?? 0).getTime() - new Date(a.lastmod ?? a.date ?? 0).getTime()
	);
	const featured = sortedByLastmod.slice(0, 2);
	const featuredSlugs = new Set(featured.map((p) => p.slug));
	const recentlyUpdated = sortedByLastmod.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 6);

	return {
		people: uniqueObjects,
		featured,
		recentlyUpdated,
		totalPeople: posts.length,
		typeCounts
	};
};

export const actions: Actions = {
	createComment: async ({ request, getClientAddress, locals }) => {
		try {
			const supabase = locals.supabase as any;
			const body = Object.fromEntries(await request.formData());

			const comment = String(body.comment ?? '');
			const rawAuthorId = String(body.author_id ?? '');
			const author_id = rawAuthorId && rawAuthorId !== 'undefined' ? rawAuthorId : null;
			const blog_link = String(body.blog_link ?? '');
			const blog_type = 'personality-analysis';
			const ip = getClientAddress();
			const fingerprint = String(body.fingerprint ?? '');

			if (fingerprint) {
				await supabase.from('visitors').upsert(
					{
						fingerprint,
						updated_at: new Date().toISOString()
					},
					{ onConflict: 'fingerprint' }
				);
			}

			const { data: insertedComment, error: insertedCommentError } = await supabase
				.from('blog_comments')
				.insert({
					comment,
					blog_link,
					blog_type,
					author_id,
					ip,
					fingerprint
				})
				.select('id, blog_link, blog_type, comment, created_at, author_id');

			if (insertedCommentError) {
				console.log(insertedCommentError);
			}
			return insertedComment;
		} catch (e) {
			console.log(e);
			return null;
		}
	}
};
