const SITE_URL = '9takes.com';
const getAllPosts = async () => {
	// const imports = import.meta.glob('/posts/**/*.md'); // make sure you get files from the right place
	const community = import.meta.glob(`/src/blog/community/*.{md,svx,svelte.md}`);

	const guides = import.meta.glob(`/src/blog/guides/*.{md,svx,svelte.md}`);
	const enneagram = import.meta.glob(`/src/blog/enneagram/*.{md,svx,svelte.md}`);
	const generational = import.meta.glob(`/src/blog/generational/*.{md,svx,svelte.md}`);
	const historical = import.meta.glob(`/src/blog/historical/*.{md,svx,svelte.md}`);
	const lifesituations = import.meta.glob(`/src/blog/life-situations/*.{md,svx,svelte.md}`);
	const people = import.meta.glob(`/src/blog/people/*.{md,svx,svelte.md}`);
	const popculture = import.meta.glob(`/src/blog/pop-culture/*.{md,svx,svelte.md}`);
	const situational = import.meta.glob(`/src/blog/situational/*.{md,svx,svelte.md}`);
	const topical = import.meta.glob(`/src/blog/topical/*.{md,svx,svelte.md}`);
	const celebrities = import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`);
	const comedians = import.meta.glob(`/src/blog/people/comedians/*.{md,svx,svelte.md}`);
	const creators = import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`);
	const lifestyleInfluencers = import.meta.glob(
		`/src/blog/people/lifestyle-influencers/*.{md,svx,svelte.md}`
	);
	const movieStars = import.meta.glob(`/src/blog/people/movie-stars/*.{md,svx,svelte.md}`);

	const historicals = import.meta.glob(`/src/blog/people/historical/*.{md,svx,svelte.md}`);
	const musicians = import.meta.glob(`/src/blog/people/musicians/*.{md,svx,svelte.md}`);
	const politicians = import.meta.glob(`/src/blog/people/politicians/*.{md,svx,svelte.md}`);
	const techies = import.meta.glob(`/src/blog/people/techies/*.{md,svx,svelte.md}`);
	const tiktokers = import.meta.glob(`/src/blog/people/tiktokers/*.{md,svx,svelte.md}`);

	const imports = [
		community,
		guides,
		enneagram,
		generational,
		historical,
		lifesituations,
		people,
		popculture,
		situational,
		topical,
		celebrities,
		comedians,
		creators,
		lifestyleInfluencers,
		movieStars,
		historicals,
		musicians,
		politicians,
		techies,
		tiktokers
	];

	const body = [];

	for (const category in imports) {
		for (const path in imports[category]) {
			body.push(
				imports[category][path]().then(({ metadata }: any) => {
					return {
						...metadata, // may not be required for sitemap
						path
					};
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

export async function GET() {
	// return new Response();
	const posts = await getAllPosts();

	return new Response(
		`
	<?xml version="1.0" encoding="UTF-8" ?>
	<urlset
	  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
	  xmlns:xhtml="https://www.w3.org/1999/xhtml"
	  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
	  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
	  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
	  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
	>

	  <!-- this is where all the urls go -->

	<url>
	    <loc>https://9takes.com/</loc>
	    <lastmod>2023-09-22</lastmod>
	    <changefreq>monthly</changefreq>
	    <priority>1.0</priority>
	</url>
	<url>
	    <loc>https://9takes.com/blog</loc>
	    <lastmod>2023-08-29</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>1.0</priority>
	</url>
	<url>
	    <loc>https://9takes.com/about</loc>
	    <lastmod>2023-09-15</lastmod>
	    <changefreq>monthly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/blog/enneagram</loc>
	    <lastmod>2023-08-09</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/blog/guides</loc>
	    <lastmod>2023-08-24</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/blog/famous-enneagram-types</loc>
	    <lastmod>2023-09-03</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>

	  ${posts
			.map(
				(post) =>
					`
	  <url>
	    <loc>${post.loc}</loc>
	    <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
	    <changefreq>${post.changefreq}</changefreq>
	    <priority>0.7</priority>
	  </url>
	  `
			)
			.join('')}

	</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
