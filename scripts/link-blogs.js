/*******************************************************
 * link-blogs.js
 *
 * Node script to update blog "content" fields by
 * automatically linking references to other people.
 *******************************************************/

import { createClient } from '@supabase/supabase-js';

// 1. Provide your Supabase credentials
const SUPABASE_URL = ''; // e.g. "https://xyzcompany.supabase.co"
const SUPABASE_ANON_KEY = ''; // e.g. "your-public-anon-key"

// PUBLIC_SUPABASE_URL=https://nhjjzcsnmyotyhykbajc.supabase.co
// PUBLIC_SUPABASE_ANON_KEY=
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
	try {
		// 2. Fetch all published blogs
		const { data: blogs, error: fetchError } = await supabase
			.from('blogs_famous_people')
			.select('*')
			.eq('published', true);

		if (fetchError) {
			console.error('Error fetching blogs:', fetchError);
			process.exit(1);
		}

		// 3. Build a name → link map from the fetched data
		//    For example, "Jennifer-Garner" => "Jennifer Garner"
		//    => /personality-analysis/Jennifer-Garner
		const peopleMap = {};
		for (const blog of blogs) {
			const displayName = blog.person.replace(/-/g, ' ').trim();
			const link = `/personality-analysis/${blog.person}`;
			peopleMap[displayName] = link;
		}

		// 4. Linkify the content for each blog
		for (const blog of blogs) {
			let newContent = blog.content || '';
			const blogAuthorName = blog.person.replace(/-/g, ' ').trim();

			// For every known person in our map,
			// replace references in this blog’s content (if not already linked).
			for (const [displayName, linkUrl] of Object.entries(peopleMap)) {
				// Skip linking references to itself if you don’t want self-links
				if (displayName === blogAuthorName) {
					continue;
				}

				// Escape special regex characters in the name
				const escapedName = displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

				// Negative lookbehind/lookahead to avoid capturing text already in Markdown link form
				//  - `(?<!\\[)` ensures we aren't inside `[`
				//  - `(?!\\]\\()` ensures we aren't immediately followed by `](`
				const regex = new RegExp(`(?<!\\[)${escapedName}(?!\\]\\()`, 'g');

				// Replace any standalone "displayName" with a Markdown link
				newContent = newContent.replace(regex, `[${displayName}](${linkUrl})`);
			}

			// 5. If content changed, update the row in Supabase
			if (newContent !== blog.content) {
				console.log(`blog: ${blog.person}`);
				// if (blog.person === 'Jon-Stewart') {
				// 	console.log(newContent);
				// }
				const { error: updateError } = await supabase
					.from('blogs_famous_people')
					.update({ content: newContent })
					.eq('id', blog.id);

				if (updateError) {
					console.error(`Error updating blog ${blog.id} (${blog.person}):`, updateError);
				} else {
					console.log(`Updated blog ${blog.id} (${blog.person})`);
				}
			} else {
				console.log(`No changes needed for blog ${blog.id} (${blog.person})`);
			}
		}

		console.log('All done!');
	} catch (error) {
		console.error('Unexpected error:', error);
		process.exit(1);
	}
}

// Run the script
main();
