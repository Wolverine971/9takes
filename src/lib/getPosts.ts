import { slugFromPath } from './slugFromPath';
import { supabase } from './supabase';

export const getPosts = async () => {
	const enneagramModules = import.meta.glob(`/src/blog/enneagram/*.{md,svx,svelte.md}`);
	const enneagramPromises = Object.entries(enneagramModules).map(([path, resolver]) =>
		resolver().then((post) => ({
			...(post as unknown as App.MdsvexFile).metadata,
			slug: slugFromPath(path),
			rssDate: buildRFC822Date((post as unknown as App.MdsvexFile)?.metadata?.date),
			rssUpdateDate: buildRFC822Date((post as unknown as App.MdsvexFile)?.metadata?.lastmod)
		}))
	);
	const enneagramPosts = (await Promise.all(enneagramPromises)).filter((post) => post.published);
	// const publishedPosts = posts.filter((post) => post.published); //.slice(0, MAX_POSTS);

	const communityModules = import.meta.glob(`/src/blog/community/*.{md,svx,svelte.md}`);

	const communityPromises = Object.entries(communityModules).map(([path, resolver]) =>
		resolver().then((post) => ({
			...(post as unknown as App.MdsvexFile).metadata,
			slug: slugFromPath(path),
			rssDate: buildRFC822Date((post as unknown as App.MdsvexFile)?.metadata?.date),
			rssUpdateDate: buildRFC822Date((post as unknown as App.MdsvexFile)?.metadata?.lastmod)
		}))
	);

	const communityPosts = (await Promise.all(communityPromises)).filter((post) => post?.published);

	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true)
	if (personDataError) {
		console.log(personDataError)

		throw error(404, { message: 'Error getting posts' });
	}
	const peoplePosts: any = personData.map(e => { return { ...e, slug: e.person } })

	const posts = [...enneagramPosts, ...communityPosts, ...peoplePosts]
		// get post metadata
		.filter((post) => post?.published)
		// sort by date
		.sort((a, b) => (a.date < b.date ? 1 : -1));

	return posts;
};

const getAllPosts = async (): Promise<App.BlogPost[]> => {
	const celebrities = import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`);
	const comedians = import.meta.glob(`/src/blog/people/comedians/*.{md,svx,svelte.md}`);
	const creators = import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`);
	const lifestyleInfluencers = import.meta.glob(
		`/src/blog/people/lifestyle-influencers/*.{md,svx,svelte.md}`
	);
	const movieStars = import.meta.glob(`/src/blog/people/movie-stars/*.{md,svx,svelte.md}`);
	const newMovieStars = import.meta.glob(`/src/blog/people/new-movie-stars/*.{md,svx,svelte.md}`);
	const historical = import.meta.glob(`/src/blog/people/historical/*.{md,svx,svelte.md}`);
	const musicians = import.meta.glob(`/src/blog/people/musicians/*.{md,svx,svelte.md}`);
	const politicians = import.meta.glob(`/src/blog/people/politicians/*.{md,svx,svelte.md}`);
	const techies = import.meta.glob(`/src/blog/people/techies/*.{md,svx,svelte.md}`);
	const tiktokers = import.meta.glob(`/src/blog/people/tiktokers/*.{md,svx,svelte.md}`);

	const imports = [
		celebrities,
		comedians,
		creators,
		lifestyleInfluencers,
		movieStars,
		newMovieStars,
		historical,
		musicians,
		politicians,
		techies,
		tiktokers
	];

	const body = [];

	for (const category in imports) {
		for (const path in imports[category]) {
			body.push(
				imports[category][path]().then(({ metadata }) => {
					const parts = path.split('/');
					const slug = slugFromPath(parts[parts.length - 1]);
					if (metadata && metadata.published) {
						return {
							...metadata, // may not be required for sitemap
							rssDate: buildRFC822Date(metadata.date),
							rssUpdateDate: buildRFC822Date(metadata?.lastmod),
							path,
							slug
						};
					}
				})
			);
		}
	}
	const posts = await Promise.all(body);

	return posts.filter((p) => {
		if (p?.published && p?.loc) {
			return true;
		}
	});
};

function addLeadingZero(num) {
	num = num.toString();
	while (num.length < 2) num = '0' + num;
	return num;
}

function buildRFC822Date(dateString) {
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
