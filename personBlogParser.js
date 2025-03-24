import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Recursively finds all markdown files in a directory
 * @param {string} dir - Directory to search
 * @param {Array} fileList - Accumulator for found files
 * @returns {Promise<Array>} - List of markdown file paths
 */
async function findMarkdownFiles(dir, fileList = []) {
	const files = await fs.readdir(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = await fs.stat(filePath);

		if (stat.isDirectory()) {
			// Recurse into subdirectories
			await findMarkdownFiles(filePath, fileList);
		} else if (file.endsWith('.md') || file.endsWith('.mdx')) {
			fileList.push(filePath);
		}
	}

	return fileList;
}

/**
 * Extract JSON-LD from HTML content
 * @param {string} content - HTML content
 * @returns {string|null} - JSON-LD string or null if not found
 */
function extractJsonLd(content) {
	const ldJsonRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
	const match = content.match(ldJsonRegex);

	if (match && match[1]) {
		return match[1].trim();
	}

	return null;
}

/**
 * Clean up HTML content by removing imported components and their HTML
 * @param {string} content - HTML content
 * @returns {string} - Cleaned HTML content
 */
function cleanupContent(content) {
	// Remove import statements
	let cleanedContent = content.replace(/<script>[\s\S]*?<\/script>/g, '');

	// Remove PopCard and other component HTML
	cleanedContent = cleanedContent.replace(/<div\s+style="display: flex;[\s\S]*?<\/div>/g, '');

	// Remove BlogPurpose component
	cleanedContent = cleanedContent.replace(/<BlogPurpose\s*\/>/g, '');

	// Remove HTML comments
	cleanedContent = cleanedContent.replace(/<!--[\s\S]*?-->/g, '');

	// Remove svelte:head tags and content
	cleanedContent = cleanedContent.replace(/<svelte:head>[\s\S]*?<\/svelte:head>/g, '');

	return cleanedContent;
}

/**
 * Parse a markdown file and extract necessary data
 * @param {string} filePath - Path to markdown file
 * @returns {Object} - Parsed blog data
 */
async function parseMarkdownFile(filePath) {
	const fileContent = await fs.readFile(filePath, 'utf8');
	const { data, content } = matter(fileContent);

	// Extract JSON-LD
	const jsonLdSnippet = extractJsonLd(content);

	// Clean up content
	const cleanedContent = cleanupContent(content);

	// Create the database record
	return {
		title: data.title || '',
		description: data.description || '',
		author: data.author || '',
		date: data.date || '',
		loc: data.loc || '',
		lastmod: data.lastmod || '',
		changefreq: data.changefreq || '',
		priority: data.priority || '',
		published: data.published !== undefined ? data.published : true,
		enneagram: data.enneagram || null,
		type: Array.isArray(data.type) ? data.type : [],
		person: data.person || '',
		suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
		wikipedia: data.wikipedia || '',
		twitter: data.twitter || '',
		instagram: data.instagram || '',
		tiktok: data.tiktok || '',
		content: cleanedContent,
		jsonLdSnippet: jsonLdSnippet || ''
	};
}

/**
 * Main function to process all markdown files and prepare for database
 * @param {string} rootDir - Root directory to start searching
 * @returns {Promise<Array>} - Array of parsed blog entries
 */
async function processBlogEntries(rootDir) {
	const markdownFiles = await findMarkdownFiles(rootDir);
	const blogEntries = [];

	for (const filePath of markdownFiles) {
		try {
			const blogData = await parseMarkdownFile(filePath);
			blogEntries.push(blogData);
			console.log(`Processed: ${filePath}`);
		} catch (error) {
			console.error(`Error processing ${filePath}:`, error);
		}
	}

	return blogEntries;
}

/**
 * Save blog entries to a JSON file (for review before DB insertion)
 * @param {Array} entries - Blog entries
 * @param {string} outputPath - Path to save JSON file
 */
async function saveBlogEntriesToJson(entries, outputPath) {
	await fs.writeFile(outputPath, JSON.stringify(entries, null, 2));
	console.log(`Saved ${entries.length} blog entries to ${outputPath}`);
}

/**
 * Example usage
 */
async function main() {
	try {
		const rootDir = 'src/blog/people'; // Adjust this to your blog content directory
		const blogEntries = await processBlogEntries(rootDir);

		// Save to JSON for review before inserting into database
		// await saveBlogEntriesToJson(blogEntries, './blog-entries.json');

		// Here you would add code to insert into Supabase
		// For example:
		await insertIntoSupabase(blogEntries);

		console.log('Processing complete!');
	} catch (error) {
		console.error('Error processing blog entries:', error);
	}
}

main();

import { createClient } from '@supabase/supabase-js';

/**
 * Function to insert blog entries into Supabase (implement as needed)
 * @param {Array} entries - Blog entries to insert
 */
async function insertIntoSupabase(entries) {
	// Import the Supabase client

	// Initialize Supabase client
	const supabaseUrl = 'https://nhjjzcsnmyotyhykbajc.supabase.co';
	const supabaseKey =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oamp6Y3NubXlvdHloeWtiYWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk3ODUwNjQsImV4cCI6MTk4NTM2MTA2NH0.tMBlWDt9uKRq19iKtsMtxRdYPOisOOGY-cLUpncHHrU';
	const supabase = createClient(supabaseUrl, supabaseKey);

	console.log('Inserting blog entries into Supabase...');

	for (const entry of entries) {
		try {
			// Insert into your blogs table
			const { data, error } = await supabase.from('blogs_famous_people').upsert({
				title: entry.title,
				description: entry.description,
				author: entry.author,
				date: entry.date,
				loc: entry.loc,
				lastmod: entry.lastmod,
				changefreq: entry.changefreq,
				priority: entry.priority,
				published: entry.published,
				enneagram: entry.enneagram,
				type: entry.type,
				person: entry.person,
				suggestions: entry.suggestions,
				wikipedia: entry.wikipedia,
				twitter: entry.twitter,
				instagram: entry.instagram,
				tiktok: entry.tiktok,
				content: entry.content,
				jsonLdSnippet: entry.jsonLdSnippet
			}); // Assuming 'loc' is a unique identifier

			if (error) {
				console.error(`Error inserting ${entry.title}:`, error);
			} else {
				console.log(`Inserted: ${entry.title}`);
			}
		} catch (error) {
			console.error(`Error processing ${entry.title}:`, error);
		}
	}

	console.log('Insertion complete!');
}
