// src/routes/admin/blog-diff/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

export const load: PageServerLoad = async ({ params }) => {
	const blogId = parseInt(params.id as string);

	if (isNaN(blogId)) {
		throw error(400, 'Invalid blog ID');
	}

	try {
		// Get the current blog post
		const { data: currentBlog, error: currentError } = await supabase
			.from('blogs_famous_people')
			.select('id, person, title, content, lastmod')
			.eq('id', blogId)
			.single();

		if (currentError) {
			console.error('Error fetching current blog:', currentError);
			throw error(404, 'Blog not found');
		}

		// Get the version history
		const { data: history, error: historyError } = await supabase
			.from('blogs_famous_people_history')
			.select('id, old_content, new_content, changed_at, changed_by')
			.eq('famous_people_id', blogId)
			.order('changed_at', { ascending: false });

		if (historyError) {
			console.error('Error fetching blog history:', historyError);
			throw error(500, 'Failed to fetch version history');
		}

		// Check for draft file
		let draftContent: string | null = null;
		let draftModified: Date | null = null;

		const draftPath = join(
			process.cwd(),
			'src',
			'blog',
			'people',
			'drafts',
			`${currentBlog.person}.md`
		);

		if (existsSync(draftPath)) {
			try {
				draftContent = readFileSync(draftPath, 'utf-8');
				const stats = statSync(draftPath);
				draftModified = stats.mtime;

				// Extract content after frontmatter
				const frontmatterEnd = draftContent.indexOf('---', 4);
				if (frontmatterEnd !== -1) {
					draftContent = draftContent.substring(frontmatterEnd + 3).trim();
				}
			} catch (err) {
				console.error('Error reading draft file:', err);
				// Continue without draft if file can't be read
			}
		}

		// Build versions array with current version, draft, and history
		const versions = [];

		// Add current version as the most recent (unless draft is newer)
		const currentVersionNumber = history.length + (draftContent ? 2 : 1);
		versions.push({
			id: 'current',
			content: currentBlog.content,
			changed_at: currentBlog.lastmod,
			changed_by: null,
			version_number: draftContent ? currentVersionNumber - 1 : currentVersionNumber,
			is_current: !draftContent,
			source: 'database'
		});

		// Add draft version if it exists (as the most recent)
		if (draftContent) {
			versions.unshift({
				id: 'draft',
				content: draftContent,
				changed_at: draftModified?.toISOString() || new Date().toISOString(),
				changed_by: null,
				version_number: currentVersionNumber,
				is_current: true,
				source: 'draft'
			});
		}

		// Add historical versions
		history.forEach((historyItem, index) => {
			versions.push({
				id: historyItem.id,
				content: historyItem.new_content,
				changed_at: historyItem.changed_at,
				changed_by: historyItem.changed_by,
				version_number: history.length - index,
				is_current: false,
				source: 'history'
			});
		});

		return {
			blog: {
				id: currentBlog.id,
				person: currentBlog.person,
				title: currentBlog.title
			},
			versions,
			hasDraft: !!draftContent
		};
	} catch (err) {
		console.error('Unexpected error:', err);
		throw error(500, 'Internal server error');
	}
};
