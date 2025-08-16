// routes/poopmap/+server.ts
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

// const SITE_URL = '9takes.com';
const getAllPosts = async () => {
	// const imports = import.meta.glob('/posts/**/*.md'); // make sure you get files from the right place
	const community = import.meta.glob(`/src/blog/community/*.{md,svx,svelte.md}`);

	const guides = import.meta.glob(`/src/blog/guides/*.{md,svx,svelte.md}`);
	const enneagram = import.meta.glob(`/src/blog/enneagram/**/*.{md,svx,svelte.md}`);
	const generational = import.meta.glob(`/src/blog/generational/*.{md,svx,svelte.md}`);
	const historical = import.meta.glob(`/src/blog/historical/*.{md,svx,svelte.md}`);
	const lifesituations = import.meta.glob(`/src/blog/life-situations/*.{md,svx,svelte.md}`);
	const people = import.meta.glob(`/src/blog/people/*.{md,svx,svelte.md}`);
	const popculture = import.meta.glob(`/src/blog/pop-culture/*.{md,svx,svelte.md}`);
	const situational = import.meta.glob(`/src/blog/situational/*.{md,svx,svelte.md}`);
	const topical = import.meta.glob(`/src/blog/topical/*.{md,svx,svelte.md}`);

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
		topical
	];

	const body = [];

	for (const category in imports) {
		for (const path in imports[category]) {
			body.push(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const getQuestions = async () => {
	const { data: questions } = await supabase
		.from('questions')
		.select('url, created_at')
		.eq('flagged', false)
		.eq('removed', false)
		.eq('tagged', true);

	return questions;
};

export async function GET() {
	// return new Response();

	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true)
		.order('lastmod')
		.order('person');
	if (personDataError) {
		console.log(personDataError);

		throw error(404, { message: 'Error getting posts' });
	}
	const peoplePosts: any = personData.map((e) => {
		return { ...e, slug: e.person };
	});

	const posts = [...(await getAllPosts()), ...peoplePosts];

	const questions = await getQuestions();

	return new Response(
		`
	<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    	xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

	<url>
	    <loc>https://9takes.com</loc>
	    <lastmod>2025-05-22</lastmod>
	    <changefreq>monthly</changefreq>
	    <priority>1.0</priority>
	</url>
	<url>
	    <loc>https://9takes.com/blog</loc>
	    <lastmod>2024-05-04</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>1.0</priority>
	</url>
	<url>
	    <loc>https://9takes.com/about</loc>
	    <lastmod>2025-05-22</lastmod>
	    <changefreq>monthly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/book-session</loc>
	    <lastmod>2025-05-22</lastmod>
	    <changefreq>monthly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/enneagram-corner</loc>
	    <lastmod>2024-07-14</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/enneagram-corner/subtopic/overview</loc>
	    <lastmod>2024-05-04</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/enneagram-corner/subtopic/nine-types</loc>
	    <lastmod>2024-05-04</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/enneagram-corner/subtopic/development</loc>
	    <lastmod>2024-05-04</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/enneagram-corner/subtopic/relationships</loc>
	    <lastmod>2024-05-04</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/enneagram-corner/subtopic/workplace</loc>
	    <lastmod>2024-05-04</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/enneagram-corner/subtopic/resources</loc>
	    <lastmod>2024-05-04</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/enneagram-corner/subtopic/situational</loc>
	    <lastmod>2024-05-04</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/how-to-guides</loc>
	    <lastmod>2024-04-07</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/community</loc>
	    <lastmod>2024-04-13</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/personality-analysis</loc>
	    <lastmod>2024-08-16</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/personality-analysis/type/1</loc>
	    <lastmod>2024-08-29</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/personality-analysis/type/2</loc>
	    <lastmod>2024-08-29</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/personality-analysis/type/3</loc>
	    <lastmod>2024-08-29</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/personality-analysis/type/4</loc>
	    <lastmod>2024-08-29</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/personality-analysis/type/5</loc>
	    <lastmod>2024-08-29</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/personality-analysis/type/6</loc>
	    <lastmod>2024-08-29</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/personality-analysis/type/7</loc>
	    <lastmod>2024-08-29</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/personality-analysis/type/8</loc>
	    <lastmod>2024-08-29</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/personality-analysis/type/9</loc>
	    <lastmod>2024-08-29</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	</url>
	<url>
	    <loc>https://9takes.com/blog/experiment</loc>
	    <lastmod>2024-09-13</lastmod>
	    <changefreq>yearly</changefreq>
	    <priority>0.5</priority>
	</url>

	  ${posts
			.map((post) => {
				if (post.loc.includes('personality-analysis')) {
					if (post.person && post.enneagram) {
						return `		
	  <url>
	    <loc>${post.loc}</loc>
	    <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
	    <changefreq>${post.changefreq}</changefreq>
	    <priority>0.7</priority>
		<image:image>
			<image:loc>https://9takes.com/types/${post.enneagram}s/${post.person}.webp</image:loc>
		</image:image>
	  </url>
	  `;
					} else {
						return `
	  <url>
	    <loc>${post.loc}</loc>
	    <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
	    <changefreq>${post.changefreq}</changefreq>
	    <priority>0.7</priority>
	  </url>
	  `;
					}
				}

				if (
					post.loc.includes('enneagram') ||
					post.loc.includes('guides') ||
					post.loc.includes('community')
				) {
					if (post.pic) {
						return `
	  <url>
	    <loc>${post.loc}</loc>
	    <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
	    <changefreq>${post.changefreq}</changefreq>
	    <priority>0.7</priority>
		<image:image>
			<image:loc>https://9takes.com/blogs/${post.pic}.webp</image:loc>
		</image:image>
	  </url>
	  `;
					} else {
						return `
	  <url>
	    <loc>${post.loc}</loc>
	    <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
	    <changefreq>${post.changefreq}</changefreq>
	    <priority>0.7</priority>
	  </url>
	  `;
					}
				} else {
					return `
							<url>
							  <loc>${post.loc}</loc>
							  <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
							  <changefreq>${post.changefreq}</changefreq>
							  <priority>0.7</priority>
							</url>
							`;
				}
			})
			.join('')}

				<url>
					<loc>https://9takes.com/questions</loc>
					<lastmod>2024-09-01</lastmod>
					<changefreq>weekly</changefreq>
					<priority>0.7</priority>
				</url>

				${questions
					?.map((q) => {
						return `<url>
	    <loc>https://9takes.com/questions/${q.url}</loc>
	    <lastmod>${new Date(q.created_at).toISOString()}</lastmod>
	    <changefreq>weekly</changefreq>
	    <priority>0.7</priority>
	  </url>`;
					})
					.join('')}
			

	</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
