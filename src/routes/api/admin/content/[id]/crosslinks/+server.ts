// src/routes/api/admin/content/[id]/crosslinks/+server.ts
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface CrossLinkItem {
	id: number;
	person: string;
	title: string | null;
	enneagram: string | null;
	category: string | null;
}

interface CrossLinkMention extends CrossLinkItem {
	mentionCount: number;
	isInSuggestions: boolean;
}

interface CrossLinkResponse {
	person: string;
	displayName: string;
	incomingSuggestions: CrossLinkItem[];
	contentMentions: CrossLinkMention[];
	potentialLinks: CrossLinkMention[];
	duplicates: {
		inSuggestions: boolean;
		excessiveMentions: CrossLinkMention[];
	};
	stats: {
		totalIncoming: number;
		totalMentions: number;
		totalPotential: number;
		hasDuplicateWarnings: boolean;
	};
}

// Convert slug to display name (e.g., "cristiano-ronaldo" -> "Cristiano Ronaldo")
function slugToDisplayName(slug: string): string {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

// Count occurrences of a substring (case-insensitive)
function countOccurrences(text: string, search: string): number {
	if (!text || !search) return 0;
	const lowerText = text.toLowerCase();
	const lowerSearch = search.toLowerCase();
	let count = 0;
	let pos = 0;
	while ((pos = lowerText.indexOf(lowerSearch, pos)) !== -1) {
		count++;
		pos += lowerSearch.length;
	}
	return count;
}

// Normalize a name/slug for comparison (handles both "Taylor Swift" and "taylor-swift")
function normalizeName(name: string): string {
	return name
		.toLowerCase()
		.replace(/-/g, ' ') // Convert slug hyphens to spaces
		.replace(/\s+/g, ' ') // Normalize multiple spaces
		.trim();
}

// Check if suggestions array contains a person (handles both display names and slugs)
function suggestionsContains(suggestions: unknown, personSlug: string): boolean {
	if (!suggestions) return false;

	let arr: string[] = [];
	if (Array.isArray(suggestions)) {
		arr = suggestions;
	} else if (typeof suggestions === 'string') {
		try {
			arr = JSON.parse(suggestions);
		} catch {
			return false;
		}
	}

	// Normalize the slug we're looking for
	const normalizedSlug = normalizeName(personSlug);

	// Check if any suggestion matches (normalized comparison)
	return arr.some((suggestion) => {
		const normalizedSuggestion = normalizeName(suggestion);
		return normalizedSuggestion === normalizedSlug;
	});
}

// Check for duplicate entries in suggestions array
function hasDuplicatesInSuggestions(suggestions: unknown): boolean {
	if (!suggestions) return false;
	let arr: string[] = [];
	if (Array.isArray(suggestions)) {
		arr = suggestions;
	} else if (typeof suggestions === 'string') {
		try {
			arr = JSON.parse(suggestions);
		} catch {
			return false;
		}
	}
	const seen = new Set<string>();
	for (const item of arr) {
		const normalized = normalizeName(item);
		if (seen.has(normalized)) return true;
		seen.add(normalized);
	}
	return false;
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const { id } = params;
	const supabase = locals.supabase;
	const session = locals.session;

	// Ensure user is authenticated
	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	// Check if user is admin
	const { data: profile } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!profile?.admin) {
		throw error(403, 'Forbidden - Admin access required');
	}

	// 1. Get current blog to find person slug and suggestions
	const { data: currentBlog, error: fetchError } = await supabase
		.from('blogs_famous_people')
		.select('person, title, suggestions')
		.eq('id', id)
		.single();

	if (fetchError || !currentBlog?.person) {
		throw error(404, 'Blog not found');
	}

	const personSlug = currentBlog.person;
	const displayName = slugToDisplayName(personSlug);

	// Check for duplicates in current blog's suggestions
	const currentHasDuplicates = hasDuplicatesInSuggestions(currentBlog.suggestions);

	// 2. Fetch all published famous people blogs (except current one)
	// We'll process in JS since Supabase doesn't support complex text search with counts
	const { data: allBlogs, error: blogsError } = await supabase
		.from('blogs_famous_people')
		.select('id, person, title, enneagram, category, content, suggestions')
		.neq('person', personSlug)
		.eq('published', true);

	if (blogsError) {
		console.error('Error fetching blogs:', blogsError);
		throw error(500, 'Failed to fetch blogs');
	}

	const blogs = allBlogs || [];

	// 3. Process blogs to find incoming suggestions
	const incomingSuggestions: CrossLinkItem[] = blogs
		.filter((blog) => suggestionsContains(blog.suggestions, personSlug))
		.map((blog) => ({
			id: blog.id,
			person: blog.person,
			title: blog.title,
			enneagram: blog.enneagram,
			category: blog.category
		}));

	// 4. Process blogs to find content mentions
	const contentMentions: CrossLinkMention[] = [];

	for (const blog of blogs) {
		if (!blog.content) continue;

		// Count mentions of display name and slug
		const nameCount = countOccurrences(blog.content, displayName);
		const slugCount = countOccurrences(blog.content, personSlug);

		// Use the higher count (they might overlap, but this gives a reasonable estimate)
		const mentionCount = Math.max(nameCount, slugCount);

		if (mentionCount > 0) {
			const isInSuggestions = suggestionsContains(blog.suggestions, personSlug);
			contentMentions.push({
				id: blog.id,
				person: blog.person,
				title: blog.title,
				enneagram: blog.enneagram,
				category: blog.category,
				mentionCount,
				isInSuggestions
			});
		}
	}

	// Sort by mention count descending
	contentMentions.sort((a, b) => b.mentionCount - a.mentionCount);

	// 5. Derive potential links (mentions not in suggestions)
	const potentialLinks = contentMentions.filter((m) => !m.isInSuggestions);

	// 6. Find excessive mentions (>5 times)
	const excessiveMentions = contentMentions.filter((m) => m.mentionCount > 5);

	// 7. Build response
	const response: CrossLinkResponse = {
		person: personSlug,
		displayName,
		incomingSuggestions,
		contentMentions,
		potentialLinks,
		duplicates: {
			inSuggestions: currentHasDuplicates,
			excessiveMentions
		},
		stats: {
			totalIncoming: incomingSuggestions.length,
			totalMentions: contentMentions.length,
			totalPotential: potentialLinks.length,
			hasDuplicateWarnings: currentHasDuplicates || excessiveMentions.length > 0
		}
	};

	return json(response);
};
