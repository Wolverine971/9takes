/*******************************************************
 * link-blogs.js
 *
 * Node script to update blog "content" fields by
 * automatically linking references to other people and enneagram types.
 *******************************************************/

import { createClient } from '@supabase/supabase-js';

// 1. Provide your Supabase credentials
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

// PUBLIC_SUPABASE_URL=https://nhjjzcsnmyotyhykbajc.supabase.co
// PUBLIC_SUPABASE_ANON_KEY=
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Enneagram types available on the site
const ENNEAGRAM_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

async function main() {
	// 2. Fetch all published blogs
	const { data: blogs, error: fetchError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true);

	if (fetchError) {
		console.error('Error fetching blogs:', fetchError);
		process.exit(1);
	}

	for await (const blog of blogs) {
		if (!blog.jsonld_snippet) return;

		if (typeof blog.jsonld_snippet === 'string') {
			const { error: updateError } = await supabase
				.from('blogs_famous_people')
				.update({ jsonld_snippet: JSON.parse(blog.jsonld_snippet) })
				.eq('id', blog.id);

			if (updateError) {
				console.error(`Error updating blog ${blog.id} (${blog.person}):`, updateError);
			} else {
				console.log(`Updated blog ${blog.id} (${blog.person})`);
			}
		}
	}
}

// Uncomment to run tests
// testHtmlDetection();
// testMarkdownLinkDetection();
// testNestedHtml();

// Run the script
main();
