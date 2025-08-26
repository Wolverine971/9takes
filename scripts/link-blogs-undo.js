// scripts/link-blogs-undo.js
/*******************************************************
 * cleanup-blogs.js
 *
 * Node script to clean up "content" fields in your
 * Supabase "blogs_famous_people" table according to:
 *   1) Remove/strip markdown links inside <a>...</a>.
 *   2) Remove markdown links inside any # heading lines.
 *   3) Remove markdown links inside any other HTML tags.
 *******************************************************/

import { createClient } from '@supabase/supabase-js';

/**
 * Configure Supabase
 */
const SUPABASE_URL = ''; // e.g. "https://xyzcompany.supabase.co"
const SUPABASE_ANON_KEY = ''; // e.g. "your-public-anon-key"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Removes markdown links [text](url) that appear:
 *   1) Inside <a>...</a>.
 *   2) Inside Markdown headings (# ...).
 *   3) Inside any HTML element <tag>...</tag> (other than <a>).
 *
 * @param {string} originalContent - The blog post's markdown/HTML content
 * @returns {string} - Cleaned content
 */
function cleanupContent(originalContent) {
	let content = originalContent || '';

	/**
	 * Pass A: Remove markdown links inside <a>...</a>.
	 *   We capture the entire <a>...</a> block and strip out
	 *   any [text](url) from its inner content, leaving just "text".
	 *
	 *   Regex Explanation:
	 *   1. (<a\b[^>]*>) - Opening <a> tag (capture as `openTag`)
	 *   2. ([\s\S]*?)  - Non-greedy capture of inner text (as `anchorContent`)
	 *   3. (<\/a>)     - Closing </a> tag (capture as `closeTag`)
	 *
	 *   Inside `anchorContent`, we remove all [text](url) with a separate regex.
	 */
	content = content.replace(
		/(<a\b[^>]*>)([\s\S]*?)(<\/a>)/gi,
		(match, openTag, anchorContent, closeTag) => {
			// Remove any markdown link [text](url) in the anchorContent
			const newAnchorContent = anchorContent.replace(
				/\[([^\]]+)\]\(([^)]+)\)/g,
				'$1' // Keep just the display text
			);
			return openTag + newAnchorContent + closeTag;
		}
	);

	/**
	 * Pass B: Remove markdown links inside any Markdown heading line.
	 *   - Match lines starting with 1-6 '#' characters, e.g. `## Heading`.
	 *   - Then remove [text](url) from that line.
	 *
	 *   Regex Explanation (for the line):
	 *   1. ^(#{1,6}\s.*)$  - A heading line: up to 6 '#' plus a space, then any text
	 */
	content = content.replace(/^(#{1,6}\s.*)$/gm, (headingLine) => {
		// Within this heading line, remove markdown links [text](url)
		return headingLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
	});

	/**
	 * Pass C: Remove markdown links inside ANY other HTML element, e.g. <div>, <p>, <span>, <h2> if not captured above, etc.
	 *   - We skip <a> tags here because we handled them in Pass A.
	 *
	 *   Regex Explanation:
	 *   1. (<(?!a)([a-zA-Z0-9]+)[^>]*>) - Opening tag with name != 'a'
	 *   2. ([\s\S]*?)                  - Capture all content non-greedily
	 *   3. (<\/\2>)                     - Corresponding closing tag
	 *
	 *   Then, inside the captured content, remove [text](url) patterns.
	 *
	 *   Note: This naive approach might miss nested tags or multiline tags,
	 *   but often works if your HTML blocks are well-formed.
	 */
	content = content.replace(
		/(<(?!a)([a-zA-Z0-9]+)[^>]*>)([\s\S]*?)(<\/\2>)/g,
		(match, openTag, tagName, innerContent, closeTag) => {
			// Remove markdown links from the inner content
			const newInner = innerContent.replace(
				/\[([^\]]+)\]\(([^)]+)\)/g,
				'$1' // keep just the display text
			);
			return openTag + newInner + closeTag;
		}
	);

	return content;
}

/**
 * Main function: fetch the published blogs, run cleanup, and update
 * content in Supabase if any changes were made.
 */
async function main() {
	try {
		// 1. Fetch all published blogs
		const { data: blogs, error: fetchError } = await supabase
			.from('blogs_famous_people')
			.select('*')
			.eq('published', true);

		if (fetchError) {
			console.error('Error fetching blogs:', fetchError);
			process.exit(1);
		}

		// 2. Iterate through each blog, clean up its content, and update if changed
		for (const blog of blogs) {
			const originalContent = blog.content || '';
			const cleaned = cleanupContent(originalContent);

			if (cleaned !== originalContent) {
				// Update the row in Supabase
				const { error: updateError } = await supabase
					.from('blogs_famous_people')
					.update({ content: cleaned })
					.eq('id', blog.id);

				if (updateError) {
					console.error(`Error updating blog ID ${blog.id}:`, updateError);
				} else {
					console.log(`Blog ID ${blog.id} updated successfully.`);
				}
			} else {
				console.log(`Blog ID ${blog.id} had no changes.`);
			}
		}

		console.log('Cleanup complete!');
	} catch (error) {
		console.error('Unexpected error:', error);
		process.exit(1);
	}
}

// Run the script
main();
