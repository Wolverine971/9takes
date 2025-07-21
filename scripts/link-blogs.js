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

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Enneagram types available on the site
const ENNEAGRAM_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
		// Names to skip (these will not be linked automatically)
		let namesToSkip = ['Prince', 'Prince-Harry', 'Queen-Elizabeth-II'];

		const peopleMap = {};
		for (const blog of blogs) {
			const displayName = blog.person.replace(/-/g, ' ').trim();
			const link = `/personality-analysis/${blog.person}`;
			if (!namesToSkip.includes(blog.person)) {
				peopleMap[displayName] = { link, slug: blog.person };
			}
		}

		// Sort names by length (descending) to prioritize longer matches first
		// This helps with the "Prince" vs "Prince Harry" problem
		const sortedNames = Object.keys(peopleMap).sort((a, b) => b.length - a.length);

		// 4. Linkify the content for each blog
		for (const [index, blog] of blogs.entries()) {
			let newContent = blog.content || '';
			const blogAuthorName = blog.person.replace(/-/g, ' ').trim();

			// Process famous people links
			newContent = addPeopleLinks(newContent, blogAuthorName, sortedNames, peopleMap);

			// Process enneagram type links
			newContent = addEnneagramLinks(newContent);

			// 5. If content changed, update the row in Supabase
			if (newContent !== blog.content) {
				// if (index < 30) {
				console.log(`blog: ${blog.person}`);
				// Uncomment the following lines to enable actual database updates
				const { error: updateError } = await supabase
					.from('blogs_famous_people')
					.update({ content: newContent })
					.eq('id', blog.id);

				if (updateError) {
					console.error(`Error updating blog ${blog.id} (${blog.person}):`, updateError);
				} else {
					console.log(`Updated blog ${blog.id} (${blog.person})`);
				}
				// }
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

/**
 * Adds links to references of famous people in the content
 * Only adds one link per person per blog post
 */
function addPeopleLinks(content, blogAuthorName, sortedNames, peopleMap) {
	// Parse and extract HTML structure first
	const { htmlRegions, htmlTags } = parseHtmlStructure(content);

	let updatedContent = content;

	// Keep track of which people have already been linked in this blog post
	const linkedPeople = new Set();

	// Process names in order from longest to shortest to avoid partial matches
	for (const displayName of sortedNames) {
		// Skip linking references to itself
		if (displayName === blogAuthorName) {
			continue;
		}

		// Skip if this person has already been linked in this post
		if (linkedPeople.has(displayName)) {
			continue;
		}

		// Escape special regex characters in the name
		const escapedName = displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		// Match the name with word boundaries to ensure full name matches
		const regex = new RegExp(`\\b${escapedName}\\b`, 'g');

		// Collect all potential matches
		const matches = [];
		let match;
		while ((match = regex.exec(updatedContent)) !== null) {
			matches.push({
				start: match.index,
				end: match.index + match[0].length,
				text: match[0]
			});
		}

		// Process matches one by one, starting from the beginning
		for (const match of matches) {
			// Check if this match is inside an HTML tag or element
			if (isInsideHtmlRegion(match.start, htmlRegions)) {
				continue;
			}

			// Check if this match is already inside a markdown link
			if (isInsideMarkdownLink(updatedContent, match.start)) {
				continue;
			}

			// Replace with markdown link
			const link = peopleMap[displayName].link;
			const replacement = `[${displayName}](${link})`;

			// Calculate the difference in length to adjust indices
			const lengthDiff = replacement.length - match.text.length;

			// Create the updated content
			updatedContent =
				updatedContent.substring(0, match.start) +
				replacement +
				updatedContent.substring(match.end);

			// Mark this person as linked
			linkedPeople.add(displayName);
			console.log(`person ${displayName}`);

			// Update HTML regions indices for any that come after this replacement
			for (let i = 0; i < htmlRegions.length; i++) {
				if (htmlRegions[i].start > match.start) {
					htmlRegions[i].start += lengthDiff;
					htmlRegions[i].end += lengthDiff;
				} else if (htmlRegions[i].end > match.start) {
					// Region spans our replacement point
					htmlRegions[i].end += lengthDiff;
				}
			}

			// Only link the first occurrence of a person
			break;
		}
	}

	return updatedContent;
}

/**
 * Adds links to enneagram types in the content if they don't already exist
 * Only adds one enneagram link per blog post
 */
function addEnneagramLinks(content) {
	// Parse and extract HTML structure first
	const { htmlRegions, htmlTags } = parseHtmlStructure(content);

	let updatedContent = content;

	// Check if an enneagram link already exists
	const hasEnneagramLink = /\[.*\]\(\/enneagram-corner\/enneagram-type-\d\)/.test(updatedContent);

	if (!hasEnneagramLink) {
		// Look for enneagram type references and add a link to the first one found
		for (const typeNum of ENNEAGRAM_TYPES) {
			// First, check for "enneagram type X" pattern
			const enneagramTypeRegex = new RegExp(`\\benneagram\\s+type\\s+${typeNum}\\b`, 'i');
			let match = enneagramTypeRegex.exec(updatedContent);

			if (match) {
				const start = match.index;
				const end = start + match[0].length;

				// Check if this match is inside an HTML region
				if (isInsideHtmlRegion(start, htmlRegions)) {
					continue;
				}

				// Check if this match is already inside a markdown link
				if (isInsideMarkdownLink(updatedContent, start)) {
					continue;
				}

				const matchText = match[0];
				const link = `[${matchText}](/enneagram-corner/enneagram-type-${typeNum})`;
				updatedContent = updatedContent.substring(0, start) + link + updatedContent.substring(end);
				console.log(`enneagramLink-${matchText}`);
				return updatedContent; // Add only one link and return
			}

			// If no "enneagram type X" match, look for "type X" pattern
			const typeRegex = new RegExp(`\\btype\\s+${typeNum}\\b`, 'i');
			match = typeRegex.exec(updatedContent);

			if (match) {
				const start = match.index;
				const end = start + match[0].length;

				// Check if this match is inside an HTML region
				if (isInsideHtmlRegion(start, htmlRegions)) {
					continue;
				}

				// Check if this match is already inside a markdown link
				if (isInsideMarkdownLink(updatedContent, start)) {
					continue;
				}

				const matchText = match[0];
				const link = `[${matchText}](/enneagram-corner/enneagram-type-${typeNum})`;
				updatedContent = updatedContent.substring(0, start) + link + updatedContent.substring(end);
				console.log(`enneagramLink-${matchText}`);
				return updatedContent; // Add only one link and return
			}
		}
	}

	return updatedContent;
}

/**
 * Parse HTML structure and identify all HTML regions (both tags and content)
 * @param {string} content - The content to parse
 * @returns {Object} - Object containing arrays of HTML regions and tags
 */
function parseHtmlStructure(content) {
	const htmlTags = [];
	const htmlRegions = [];

	// First pass - identify all HTML tags
	// This improved regex handles tags, attributes, and comments
	const tagRegex = /<(!--|\/?\w+(?:\s+[\w\-:.]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))?)*\s*\/?)>/g;

	const tags = [];
	let match;

	// First collect all tags
	while ((match = tagRegex.exec(content)) !== null) {
		const fullTag = match[0];
		const tagContent = match[1];
		const startPos = match.index;
		const endPos = startPos + fullTag.length;

		let tagType = 'regular';
		let tagName = '';

		if (tagContent.startsWith('!--')) {
			// Comment tag
			tagType = 'comment';

			// Find the end of comment if this is only the start
			if (!fullTag.endsWith('-->')) {
				const commentEnd = content.indexOf('-->', endPos);
				if (commentEnd !== -1) {
					// Add the entire comment as an HTML region
					htmlRegions.push({
						start: startPos,
						end: commentEnd + 3,
						isComment: true
					});
				}
			}
		} else if (tagContent.startsWith('/')) {
			// Closing tag
			tagType = 'closing';
			tagName = tagContent.substring(1).split(/\s+/)[0].toLowerCase();
		} else if (tagContent.endsWith('/')) {
			// Self-closing tag
			tagType = 'selfClosing';
			tagName = tagContent.split(/\s+/)[0].toLowerCase();
		} else {
			// Opening tag
			tagType = 'opening';
			tagName = tagContent.split(/\s+/)[0].toLowerCase();
		}

		tags.push({
			tagName,
			tagType,
			start: startPos,
			end: endPos
		});

		// Add the tag itself as an HTML region
		htmlRegions.push({
			start: startPos,
			end: endPos,
			isTag: true
		});
	}

	// Second pass - match opening and closing tags and mark regions
	// We'll use a more robust approach to handle nested tags correctly
	const openTagsByName = {};

	// First, organize tags by their position
	const sortedTags = [...tags].sort((a, b) => a.start - b.start);

	// Process tags in order
	for (const tag of sortedTags) {
		if (tag.tagType === 'opening') {
			// Initialize array for this tag name if it doesn't exist
			if (!openTagsByName[tag.tagName]) {
				openTagsByName[tag.tagName] = [];
			}
			// Add this opening tag to stack
			openTagsByName[tag.tagName].push(tag);
		} else if (tag.tagType === 'closing') {
			// Find matching opening tag
			const openTags = openTagsByName[tag.tagName];
			if (openTags && openTags.length > 0) {
				// Get the most recent opening tag
				const openTag = openTags.pop();

				// Mark the entire region between opening and closing tags
				htmlRegions.push({
					start: openTag.start,
					end: tag.end,
					tagName: tag.tagName
				});
			}
		}
	}

	// Store the HTML tags for reference
	htmlTags.push(...tags);

	// Combine overlapping regions and return
	return {
		htmlRegions: combineOverlappingRegions(htmlRegions),
		htmlTags
	};
}

/**
 * Check if a position is inside any HTML region
 * @param {number} position - Position to check
 * @param {Array} htmlRegions - Array of HTML regions
 * @returns {boolean} - True if position is inside any HTML region
 */
function isInsideHtmlRegion(position, htmlRegions) {
	return htmlRegions.some((region) => position >= region.start && position < region.end);
}

/**
 * Check if a position is inside a markdown link
 * @param {string} content - The content to check
 * @param {number} position - Position to check
 * @returns {boolean} - True if position is inside a markdown link
 */
function isInsideMarkdownLink(content, position) {
	// Get the content before this position
	const before = content.substring(0, position);
	// Get the content after this position
	const after = content.substring(position);

	// Look for markdown link pattern:
	// Content is inside a link if there's a '[' before it and a '](...)' after it
	// without a closing ']' in between

	// Find the last '[' before position
	const lastOpenBracket = before.lastIndexOf('[');
	if (lastOpenBracket === -1) return false;

	// Find the last ']' before position
	const lastCloseBracket = before.lastIndexOf(']');
	if (lastCloseBracket > lastOpenBracket) return false;

	// Check if there's a '](...)' after position
	const linkPattern = /\][^[\]]*\([^()]*\)/;
	const hasLinkEnd = linkPattern.test(after);

	return hasLinkEnd;
}

/**
 * Combines overlapping regions
 * For example, if we have regions [1-5] and [3-8], they'll be combined into [1-8]
 */
function combineOverlappingRegions(regions) {
	if (regions.length === 0) return [];

	// Sort regions by start position
	const sortedRegions = [...regions].sort((a, b) => a.start - b.start);

	const result = [sortedRegions[0]];

	for (let i = 1; i < sortedRegions.length; i++) {
		const currentRegion = sortedRegions[i];
		const lastRegion = result[result.length - 1];

		// If current region starts before last region ends, they overlap
		if (currentRegion.start <= lastRegion.end) {
			// Extend the last region if needed
			lastRegion.end = Math.max(lastRegion.end, currentRegion.end);

			// Preserve tag information if available
			if (currentRegion.tagName && !lastRegion.tagName) {
				lastRegion.tagName = currentRegion.tagName;
			}
		} else {
			// No overlap, add as a new region
			result.push(currentRegion);
		}
	}

	return result;
}

// Test function to verify HTML detection
function testHtmlDetection() {
	console.log('Testing HTML detection with sample content');

	const testContent = `<li><b>The Inner World:</b> Beneath the public persona, Portnoy is an individual who marches to the beat of his drum. Whether hosting the BFFs podcast or being a fan of Taylor Swift, he does what he finds genuinely interesting. This reflects the Type 8's desire for autonomy and control over their lives.
</li>`;

	const { htmlRegions, htmlTags } = parseHtmlStructure(testContent);
	console.log('HTML regions:', htmlRegions);
	console.log('HTML tags:', htmlTags);

	// Test if "Taylor Swift" would be detected as inside HTML
	const taylorIndex = testContent.indexOf('Taylor Swift');
	const isInsideHtml = isInsideHtmlRegion(taylorIndex, htmlRegions);

	console.log(`"Taylor Swift" is at index ${taylorIndex}`);
	console.log(`Is "Taylor Swift" inside HTML? ${isInsideHtml ? 'YES' : 'NO'}`);

	// Test adding people links
	const peopleMap = {
		'Taylor Swift': { link: '/personality-analysis/Taylor-Swift', slug: 'Taylor-Swift' }
	};
	const sortedNames = ['Taylor Swift'];
	const linkedContent = addPeopleLinks(testContent, 'Dave Portnoy', sortedNames, peopleMap);

	console.log('\nOriginal content:');
	console.log(testContent);
	console.log('\nAfter linking:');
	console.log(linkedContent);
	console.log('\nShould not have changed since Taylor Swift is inside HTML');

	// Test another example
	const testContent2 = `This is a paragraph with Taylor Swift mentioned outside of HTML.
<div>This is Taylor Swift inside HTML which should not be linked.</div>
<p>Type 8 individuals are assertive and direct.</p>`;

	console.log('\nTesting second example:');
	console.log('Original:');
	console.log(testContent2);

	// First add people links
	const linkedContent2 = addPeopleLinks(testContent2, 'Dave Portnoy', sortedNames, peopleMap);
	// Then add enneagram links
	const finalContent = addEnneagramLinks(linkedContent2);

	console.log('\nAfter linking:');
	console.log(finalContent);
	console.log('\nShould have linked Taylor Swift in first line and Type 8 in third line');
}

// Test markdown link detection
function testMarkdownLinkDetection() {
	console.log('\nTesting markdown link detection:');

	const testContent = `This is about [Taylor Swift](/personality-analysis/Taylor-Swift) and her music.
This mentions Taylor Swift again which should be linked.
This is about [Type 8](/enneagram-corner/enneagram-type-8) personalities.
This mentions Type 8 again which should be linked.`;

	console.log('Original:');
	console.log(testContent);

	// Test people links
	const peopleMap = {
		'Taylor Swift': { link: '/personality-analysis/Taylor-Swift', slug: 'Taylor-Swift' }
	};
	const sortedNames = ['Taylor Swift'];
	const linkedContent = addPeopleLinks(testContent, 'Dave Portnoy', sortedNames, peopleMap);

	// Test enneagram links
	const finalContent = addEnneagramLinks(linkedContent);

	console.log('\nAfter linking:');
	console.log(finalContent);
	console.log(
		'\nShould have linked the second "Taylor Swift" and not the first, and not linked "Type 8" again'
	);
}

// Test nested HTML detection
function testNestedHtml() {
	console.log('\nTesting nested HTML detection:');

	const testContent = `
<div class="panel">
<ul>
<li><b>The Inner World:</b> Beneath the public persona, Portnoy is an individual who marches to the beat of his drum. Whether hosting the BFFs podcast or being a fan of Taylor Swift, he does what he finds genuinely interesting.</li>
</ul>
</div>

## What is Dave Portnoy's Personality Type?

The Enneagram Type 8 is often described as self-confident, decisive, and willful.
`;

	const { htmlRegions } = parseHtmlStructure(testContent);

	// Check Taylor Swift (should be inside HTML)
	const taylorIndex = testContent.indexOf('Taylor Swift');
	const isTaylorInHtml = isInsideHtmlRegion(taylorIndex, htmlRegions);

	// Check Type 8 (should be outside HTML)
	const type8Index = testContent.lastIndexOf('Type 8');
	const isType8InHtml = isInsideHtmlRegion(type8Index, htmlRegions);

	console.log(
		`"Taylor Swift" is at index ${taylorIndex}, inside HTML? ${isTaylorInHtml ? 'YES' : 'NO'}`
	);
	console.log(`"Type 8" is at index ${type8Index}, inside HTML? ${isType8InHtml ? 'YES' : 'NO'}`);

	// Test adding links
	const peopleMap = {
		'Taylor Swift': { link: '/personality-analysis/Taylor-Swift', slug: 'Taylor-Swift' }
	};
	const sortedNames = ['Taylor Swift'];

	// First add people links
	const linkedContent = addPeopleLinks(testContent, 'Dave Portnoy', sortedNames, peopleMap);
	// Then add enneagram links
	const finalContent = addEnneagramLinks(linkedContent);

	console.log('\nAfter linking:');
	console.log(finalContent);
	console.log('\nShould not link Taylor Swift (in HTML) but should link Type 8 (outside HTML)');
}

// Uncomment to run tests
// testHtmlDetection();
// testMarkdownLinkDetection();
// testNestedHtml();

// Run the script
main();
