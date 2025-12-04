// src/lib/getPosts.ts
import { slugFromPath } from './slugFromPath';
import { supabase } from './supabase';

// Helper to safely process Mdsvex modules
function processMdsvexModule(path: string, resolver: App.MdsvexResolver) {
	return resolver().then((post) => {
		const mdsvexFile = post as App.MdsvexFile;
		const metadata = mdsvexFile.metadata as App.BlogPost;
		return {
			...metadata,
			slug: slugFromPath(path),
			rssDate: buildRFC822Date(metadata.date),
			rssUpdateDate: buildRFC822Date(metadata.lastmod)
		};
	});
}

export const getPosts = async (): Promise<App.BlogPost[]> => {
	const enneagramModules = import.meta.glob(`/src/blog/enneagram/**/*.{md,svx,svelte.md}`);
	const enneagramPromises = Object.entries(enneagramModules).map(([path, resolver]) =>
		processMdsvexModule(path, resolver)
	);
	const enneagramPosts = (await Promise.all(enneagramPromises)).filter((post) => post.published);

	const communityModules = import.meta.glob(`/src/blog/community/*.{md,svx,svelte.md}`);

	const communityPromises = Object.entries(communityModules).map(([path, resolver]) =>
		processMdsvexModule(path, resolver)
	);

	const communityPosts = (await Promise.all(communityPromises)).filter((post) => post?.published);

	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true);
	if (personDataError) {
		console.error('Failed to fetch blogs_famous_people:', personDataError);
		throw new Error(`Error getting posts: ${personDataError.message}`);
	}
	const peoplePosts: App.BlogPost[] = personData.map((e) => {
		return { ...e, slug: e.person } as App.BlogPost;
	});

	const posts = [...enneagramPosts, ...communityPosts, ...peoplePosts]
		// get post metadata
		.filter((post) => post?.published)
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
