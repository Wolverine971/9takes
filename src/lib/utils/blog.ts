// lib/utils/blog.ts
import { slugFromPath } from '../slugFromPath';

function addLeadingZero(num: number): string {
	let numStr = num.toString();
	while (numStr.length < 2) numStr = '0' + numStr;
	return numStr;
}

function buildRFC822Date(dateString: string): string {
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
	const date = new Date(timeStamp);

	const day = dayStrings[date.getDay()];
	const dayNumber = addLeadingZero(date.getDate());
	const month = monthStrings[date.getMonth()];
	const year = date.getFullYear();
	const time = `${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}:00`;
	const timezone = date.getTimezoneOffset() === 0 ? 'GMT' : 'BST';

	//Wed, 02 Oct 2002 13:00:00 GMT
	return `${day}, ${dayNumber} ${month} ${year} ${time} ${timezone}`;
}

export const getBlogPosts = async (): Promise<App.BlogPost[]> => {
	// Get all enneagram blog posts including subdirectories
	const enneagramModules = import.meta.glob(`/src/blog/enneagram/**/*.{md,svx,svelte.md}`);
	const enneagramPromises = Object.entries(enneagramModules).map(([path, resolver]) =>
		resolver().then((post) => ({
			...(post as unknown as App.MdsvexFile).metadata,
			slug: slugFromPath(path),
			path,
			rssDate: buildRFC822Date((post as unknown as App.MdsvexFile)?.metadata?.date),
			rssUpdateDate: buildRFC822Date((post as unknown as App.MdsvexFile)?.metadata?.lastmod)
		}))
	);
	const enneagramPosts = (await Promise.all(enneagramPromises)).filter((post) => post.published);

	// Get community posts
	const communityModules = import.meta.glob(`/src/blog/community/*.{md,svx,svelte.md}`);
	const communityPromises = Object.entries(communityModules).map(([path, resolver]) =>
		resolver().then((post) => ({
			...(post as unknown as App.MdsvexFile).metadata,
			slug: slugFromPath(path),
			path,
			rssDate: buildRFC822Date((post as unknown as App.MdsvexFile)?.metadata?.date),
			rssUpdateDate: buildRFC822Date((post as unknown as App.MdsvexFile)?.metadata?.lastmod)
		}))
	);
	const communityPosts = (await Promise.all(communityPromises)).filter((post) => post?.published);

	// Combine all posts
	const allPosts = [...enneagramPosts, ...communityPosts]
		.filter((post) => post?.published)
		.sort((a, b) => (a.date < b.date ? 1 : -1));

	return allPosts;
};

export const getMentalHealthPosts = async (): Promise<App.BlogPost[]> => {
	const allPosts = await getBlogPosts();

	// Filter for mental health posts
	return allPosts.filter((post) => {
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
