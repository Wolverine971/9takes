// scripts/generate-sitemap.js

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createClient } from '@supabase/supabase-js';
import pkg from 'fast-glob';
const { glob } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	console.error('❌ Missing Supabase environment variables');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getAllPosts() {
	const categories = [
		'community',
		'guides',
		'enneagram',
		'generational',
		'historical',
		'life-situations',
		'people',
		'pop-culture',
		'situational',
		'topical'
	];

	const posts = [];

	for (const category of categories) {
		const files = await glob(`src/blog/${category}/*.{md,svx,svelte.md}`, {
			cwd: path.join(__dirname, '..'),
			absolute: true
		});

		for (const file of files) {
			try {
				// Read the file content
				const content = await fs.readFile(file, 'utf-8');

				// Extract frontmatter metadata using regex
				const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

				if (frontmatterMatch) {
					// Parse the frontmatter YAML-like content manually
					const frontmatter = frontmatterMatch[1];
					const metadata = {};

					// Parse each line of frontmatter
					const lines = frontmatter.split('\n');
					for (const line of lines) {
						const colonIndex = line.indexOf(':');
						if (colonIndex > 0) {
							const key = line.substring(0, colonIndex).trim();
							let value = line.substring(colonIndex + 1).trim();

							// Remove quotes if present
							if (
								(value.startsWith('"') && value.endsWith('"')) ||
								(value.startsWith("'") && value.endsWith("'"))
							) {
								value = value.slice(1, -1);
							}

							// Convert 'true'/'false' strings to booleans
							if (value === 'true') value = true;
							else if (value === 'false') value = false;

							metadata[key] = value;
						}
					}

					if (metadata.published && metadata.loc) {
						posts.push({
							...metadata,
							path: file
						});
					}
				}
			} catch (error) {
				console.warn(`⚠️  Could not read ${path.basename(file)}: ${error.message}`);
			}
		}
	}

	return posts;
}

async function getQuestions() {
	const { data: questions, error } = await supabase
		.from('questions')
		.select('url, created_at')
		.eq('flagged', false)
		.eq('removed', false)
		.eq('tagged', true);

	if (error) {
		console.warn('⚠️  Error fetching questions:', error.message);
		return [];
	}

	return questions || [];
}

async function getFamousPeople() {
	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true)
		.order('lastmod')
		.order('person');

	if (personDataError) {
		console.warn('⚠️  Error fetching famous people posts:', personDataError.message);
		return [];
	}

	return (personData || []).map((e) => ({
		...e,
		slug: e.person
	}));
}

async function generateSitemap() {
	try {
		console.log('🚀 Generating sitemap...');

		const [posts, peoplePosts, questions] = await Promise.all([
			getAllPosts(),
			getFamousPeople(),
			getQuestions()
		]);

		const allPosts = [...posts, ...peoplePosts];

		console.log(`📝 Found ${posts.length} blog posts`);
		console.log(`👥 Found ${peoplePosts.length} famous people posts`);
		console.log(`❓ Found ${questions.length} questions`);

		const sitemapContent = `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
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
${allPosts
	.map((post) => {
		if (post.loc.includes('personality-analysis')) {
			if (post.person && post.enneagram) {
				return `<url>
    <loc>${post.loc}</loc>
    <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>0.7</priority>
    <image:image>
        <image:loc>https://9takes.com/types/${post.enneagram}s/${post.person}.webp</image:loc>
    </image:image>
</url>`;
			} else {
				return `<url>
    <loc>${post.loc}</loc>
    <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>0.7</priority>
</url>`;
			}
		}

		if (
			post.loc.includes('enneagram') ||
			post.loc.includes('guides') ||
			post.loc.includes('community')
		) {
			if (post.pic) {
				return `<url>
    <loc>${post.loc}</loc>
    <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>0.7</priority>
    <image:image>
        <image:loc>https://9takes.com/blogs/${post.pic}.webp</image:loc>
    </image:image>
</url>`;
			} else {
				return `<url>
    <loc>${post.loc}</loc>
    <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>0.7</priority>
</url>`;
			}
		} else {
			return `<url>
    <loc>${post.loc}</loc>
    <lastmod>${post.lastmod && new Date(post.lastmod).toISOString()}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>0.7</priority>
</url>`;
		}
	})
	.join('\n')}
<url>
    <loc>https://9takes.com/questions</loc>
    <lastmod>2024-09-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
</url>
${
	questions
		?.map((q) => {
			return `<url>
    <loc>https://9takes.com/questions/${q.url}</loc>
    <lastmod>${new Date(q.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
</url>`;
		})
		.join('\n') || ''
}
</urlset>`;

		// Write to static/sitemap.xml
		const sitemapPath = path.join(__dirname, '..', 'static', 'sitemap.xml');
		await fs.writeFile(sitemapPath, sitemapContent.trim(), 'utf-8');

		console.log('✅ Sitemap generated successfully at static/sitemap.xml');

		// Get file size for verification
		const stats = await fs.stat(sitemapPath);
		const fileSizeInKb = (stats.size / 1024).toFixed(2);
		console.log(`📄 Sitemap size: ${fileSizeInKb} KB`);

		// Count URLs in sitemap for verification
		const urlCount = (sitemapContent.match(/<url>/g) || []).length;
		console.log(`🔗 Total URLs in sitemap: ${urlCount}`);
	} catch (error) {
		console.error('❌ Error generating sitemap:', error);
		process.exit(1);
	}
}

// Run the script
generateSitemap();
