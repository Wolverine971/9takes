// src/lib/getPosts.ts
import { slugFromPath } from './slugFromPath';
import { supabase } from './supabase';
import { normalizePersonalitySlug } from './utils/personalityAnalysis';
import type { Database } from '../../database.types';

type MdsvexModuleResolver = () => Promise<App.MdsvexFile>;
type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];

// Helper to safely process Mdsvex modules
function processMdsvexModule(
	path: string,
	resolver: MdsvexModuleResolver
): Promise<App.BlogPost | null> {
	return resolver().then((post) => {
		const metadata = post.metadata;

		// Guard against missing or incomplete metadata
		if (!metadata || !metadata.date) {
			return null;
		}

		return {
			...metadata,
			slug: slugFromPath(path),
			rssDate: buildRFC822Date(metadata.date),
			rssUpdateDate: buildRFC822Date(metadata.lastmod)
		};
	});
}

export const getPosts = async (): Promise<App.BlogPost[]> => {
	const enneagramModules = import.meta.glob<App.MdsvexFile>([
		`/src/blog/enneagram/**/*.{md,svx,svelte.md}`,
		'!**/drafts/**',
		'!**/*.instagram.md',
		'!**/*.twitter.md',
		'!**/*.reddit.md',
		'!**/*.review.md',
		'!**/blog-optimization-strategies.md'
	]);
	const enneagramPromises = Object.entries(enneagramModules).map(([path, resolver]) =>
		processMdsvexModule(path, resolver)
	);
	const enneagramPosts = (await Promise.all(enneagramPromises)).filter(
		(post): post is NonNullable<typeof post> => post !== null && post.published
	);

	const communityModules = import.meta.glob<App.MdsvexFile>([
		`/src/blog/community/*.{md,svx,svelte.md}`,
		'!**/societal-ticking-time-bombs-fact-check.md'
	]);

	const communityPromises = Object.entries(communityModules).map(([path, resolver]) =>
		processMdsvexModule(path, resolver)
	);

	const communityPosts = (await Promise.all(communityPromises)).filter(
		(post): post is NonNullable<typeof post> => post !== null && post.published
	);

	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true);
	if (personDataError) {
		console.error('Failed to fetch blogs_famous_people:', personDataError);
		throw new Error(`Error getting posts: ${personDataError.message}`);
	}

	const peopleRows = (personData ?? []) as FamousPersonRow[];
	const peoplePosts: App.BlogPost[] = peopleRows.map((row) => {
		const fallbackSlugSource = row.loc ?? row.title ?? `person-${row.id}.md`;
		return {
			...(row as unknown as App.BlogPost),
			slug: normalizePersonalitySlug(row.person) || slugFromPath(fallbackSlugSource),
			title: row.title ?? '',
			author: row.author ?? '',
			description: row.description ?? '',
			date: row.date ?? row.created_at,
			loc: row.loc ?? '',
			lastmod: row.lastmod ?? row.created_at,
			changefreq: row.changefreq ?? 'weekly',
			priority: row.priority ?? '0.6',
			published: row.published ?? false,
			jsonld: ''
		};
	});

	const posts = [...enneagramPosts, ...communityPosts, ...peoplePosts]
		// get post metadata - filter out entries with missing dates
		.filter((post) => post?.published && post?.date)
		// sort by date
		.sort((a, b) => (a.date < b.date ? 1 : -1));

	return posts;
};

function addLeadingZero(num: number | string): string {
	let numStr = num.toString();
	while (numStr.length < 2) numStr = '0' + numStr;
	return numStr;
}

function buildRFC822Date(dateString: string | undefined): string {
	// Handle undefined or empty date strings
	if (!dateString) {
		const now = new Date();
		return now.toUTCString();
	}

	const dayStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const monthStrings = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	const timeStamp = Date.parse(dateString);

	// Validate date parsing
	if (isNaN(timeStamp)) {
		console.warn(`Invalid date string: ${dateString}, using current date`);
		return new Date().toUTCString();
	}

	const date = new Date(timeStamp);

	const day = dayStrings[date.getDay()];
	const dayNumber = addLeadingZero(date.getDate());
	const month = monthStrings[date.getMonth()];
	const year = date.getFullYear();
	const time = `${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}:00`;

	// Fix timezone calculation - use proper RFC822 format
	const offset = -date.getTimezoneOffset();
	const sign = offset >= 0 ? '+' : '-';
	const hours = Math.floor(Math.abs(offset) / 60);
	const minutes = Math.abs(offset) % 60;
	const timezone = `${sign}${addLeadingZero(hours)}${addLeadingZero(minutes)}`;

	//Wed, 02 Oct 2002 13:00:00 +0000
	return `${day}, ${dayNumber} ${month} ${year} ${time} ${timezone}`;
}
