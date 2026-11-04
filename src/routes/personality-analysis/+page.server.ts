// src/routes/personality-analysis/+page.server.ts
import type { PageServerLoad } from './$types';
import type { Database } from '../../../database.types';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';
import { roundedCorpusCount } from '$lib/utils/talkSituations';
import corpusStats from '$lib/data/corpus-stats.json';
import personalityFame from '$lib/generated/personalityFame.json';
import { buildCelebrityHub, buildJustAdded } from './celebrityHub';
import type { FameViews } from './type/[slug]/typeHubOrder';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];
type PersonPost = Pick<
	FamousPersonRow,
	'person' | 'enneagram' | 'persona_title' | 'lastmod' | 'date'
> & {
	slug: string;
};

const INDEX_QUERY_TIMEOUT_MS = 2500;

const FALLBACK_POSTS: PersonPost[] = [
	{
		person: 'Morgan Freeman',
		enneagram: '1',
		persona_title: "Cinema's Voice of Conscience",
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'morgan-freeman'
	},
	{
		person: 'Princess Diana',
		enneagram: '2',
		persona_title: "The People's Wounded Caretaker",
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'princess-diana'
	},
	{
		person: 'Taylor Swift',
		enneagram: '3',
		persona_title: "Pop's Strategic Alchemist",
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'taylor-swift'
	},
	{
		person: 'Lady Gaga',
		enneagram: '4',
		persona_title: "Pop's Avant-Garde Mother",
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'lady-gaga'
	},
	{
		person: 'Elon Musk',
		enneagram: '5',
		persona_title: "Technology's Apocalyptic Engineer",
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'elon-musk'
	},
	{
		person: 'Marilyn Monroe',
		enneagram: '6',
		persona_title: "Hollywood's Armored Icon",
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'marilyn-monroe'
	},
	{
		person: 'Cathie Wood',
		enneagram: '7',
		persona_title: "Disruption's Pulpit Pioneer",
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'cathie-wood'
	},
	{
		person: 'Rihanna',
		enneagram: '8',
		persona_title: "Pop's Unbothered Mogul",
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'rihanna'
	},
	{
		person: 'Barack Obama',
		enneagram: '9',
		persona_title: "America's Composed Colossus",
		lastmod: '2026-06-01',
		date: '2026-06-01',
		slug: 'barack-obama'
	},
	{
		person: 'Michelle Obama',
		enneagram: '1',
		persona_title: 'The First Lady of Controlled Fire',
		lastmod: '2026-05-25',
		date: '2026-05-25',
		slug: 'michelle-obama'
	},
	{
		person: 'Sabrina Carpenter',
		enneagram: '3',
		persona_title: "Pop's Winking Machine",
		lastmod: '2026-05-25',
		date: '2026-05-25',
		slug: 'sabrina-carpenter'
	},
	{
		person: 'Agatha Christie',
		enneagram: '5',
		persona_title: "Crime's Private Observer",
		lastmod: '2026-05-25',
		date: '2026-05-25',
		slug: 'agatha-christie'
	},
	{
		person: 'Mr Beast',
		enneagram: '8',
		persona_title: "The Algorithm Monk Who Can't Stop Building",
		lastmod: '2026-05-25',
		date: '2026-05-25',
		slug: 'mr-beast'
	},
	{
		person: 'Paul Rudd',
		enneagram: '9',
		persona_title: "Hollywood's Perpetual Nice Guy",
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
	let personData:
		Pick<FamousPersonRow, 'person' | 'enneagram' | 'persona_title' | 'lastmod' | 'date'>[] | null =
		null;

	try {
		const result = await withTimeout(
			supabase
				.from('blogs_famous_people')
				.select('person,enneagram,persona_title,lastmod,date')
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

	const usingFallback = !personData?.length;
	const posts: PersonPost[] = (usingFallback ? FALLBACK_POSTS : personData!).map((e) => ({
		...e,
		slug: normalizePersonalitySlug(e.person)
	}));

	// The nine portrait rows: live counts and best-known people. If the live
	// query failed, the fallback list is only a handful of people, so the
	// counts come from the build-time corpus snapshot instead.
	const celebrityHub = buildCelebrityHub(posts, personalityFame.views as FameViews, {
		counts: usingFallback ? corpusStats.enneagram_distribution.counts : undefined
	});

	return {
		justAdded: buildJustAdded(posts),
		celebrityHub,
		// "450+": rounded down from corpus-stats.json so the title never overstates.
		publicFigureCount: roundedCorpusCount(corpusStats.totals.published)
	};
};
