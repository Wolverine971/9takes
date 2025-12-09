// src/lib/utils/blog.ts
import { slugFromPath } from '../slugFromPath';

// Helper to safely process Mdsvex modules
function processMdsvexModule(path: string, resolver: App.MdsvexResolver) {
	return resolver().then((post) => {
		const mdsvexFile = post as App.MdsvexFile;
		const metadata = mdsvexFile.metadata as App.BlogPost;
		return {
			...metadata,
			slug: slugFromPath(path),
			path,
			rssDate: buildRFC822Date(metadata?.date),
			rssUpdateDate: buildRFC822Date(metadata?.lastmod)
		};
	});
}

function addLeadingZero(num: number): string {
	let numStr = num.toString();
	while (numStr.length < 2) numStr = '0' + numStr;
	return numStr;
}

function buildRFC822Date(dateString: string | undefined): string {
	// Handle undefined or empty date strings
	if (!dateString) {
		return new Date().toUTCString();
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

export const getBlogPosts = async (): Promise<App.BlogPost[]> => {
	// Get all enneagram blog posts including subdirectories
	const enneagramModules = import.meta.glob(`/src/blog/enneagram/**/*.{md,svx,svelte.md}`);
	const enneagramPromises = Object.entries(enneagramModules).map(([path, resolver]) =>
		processMdsvexModule(path, resolver)
	);
	const enneagramPosts = (await Promise.all(enneagramPromises)).filter((post) => post.published);

	// Get community posts
	const communityModules = import.meta.glob(`/src/blog/community/*.{md,svx,svelte.md}`);
	const communityPromises = Object.entries(communityModules).map(([path, resolver]) =>
		processMdsvexModule(path, resolver)
	);
	const communityPosts = (await Promise.all(communityPromises)).filter((post) => post?.published);

	// Combine all posts
	const allPosts = [...enneagramPosts, ...communityPosts]
		.filter((post) => post?.published)
		.sort((a, b) => (a?.date < b?.date ? 1 : -1));

	return allPosts;
};

export const getMentalHealthPosts = async (): Promise<App.BlogPost[]> => {
	const allPosts = await getBlogPosts();

	// Filter for mental health posts (excluding social media versions)
	return allPosts.filter((post) => {
		// Skip social media versions
		if (
			post.slug?.includes('-instagram') ||
			post.slug?.includes('-twitter') ||
			post.slug?.includes('-reddit') ||
			post.slug?.includes('-review')
		) {
			return false;
		}
		// Check if the post is in the mental-health directory or has mental-health type
		return (
			post.loc?.includes('/mental-health/') ||
			(post.type && post.type.includes('mental-health')) ||
			post.loc?.includes('enneagram-and-mental-illness')
		);
	});
};

export const getEnneagramPosts = async (): Promise<App.BlogPost[]> => {
	const allPosts = await getBlogPosts();

	// Filter for enneagram posts (excluding mental health unless specifically tagged)
	return allPosts.filter((post) => {
		return post.loc?.includes('/enneagram-corner/') && !post.loc?.includes('/mental-health/');
	});
};
