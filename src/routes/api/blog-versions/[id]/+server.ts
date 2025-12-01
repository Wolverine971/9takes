// src/routes/api/blog-versions/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

export const GET: RequestHandler = async ({ params, locals }) => {
	const blogId = parseInt(params.id as string);
	const supabase = locals.supabase;

	if (isNaN(blogId)) {
		return json({ error: 'Invalid blog ID' }, { status: 400 });
	}

	try {
		// Parallelize blog and history queries for better performance
		const [{ data: currentBlog, error: currentError }, { data: history, error: historyError }] =
			await Promise.all([
				supabase
					.from('blogs_famous_people')
					.select('id, person, title, content, lastmod')
					.eq('id', blogId)
					.single(),
				supabase
					.from('blogs_famous_people_history')
					.select('id, old_content, new_content, changed_at, changed_by')
					.eq('famous_people_id', blogId)
					.order('changed_at', { ascending: false })
			]);

		// Handle errors after parallel execution
		if (currentError) {
			console.error('Error fetching current blog:', currentError);
			return json({ error: 'Blog not found' }, { status: 404 });
		}

		if (historyError) {
			console.error('Error fetching blog history:', historyError);
			return json({ error: 'Failed to fetch version history' }, { status: 500 });
		}

		// Check for draft file
		let draftContent: string | null = null;
		let draftModified: Date | null = null;

		// Sanitize person name to prevent path traversal
		const sanitizedPerson = currentBlog.person.replace(/[^a-zA-Z0-9-_]/g, '');
		if (sanitizedPerson !== currentBlog.person) {
			console.warn('Invalid person identifier detected:', currentBlog.person);
			return json({ error: 'Invalid person identifier' }, { status: 400 });
		}

		const draftPath = join(
			process.cwd(),
			'src',
			'blog',
			'people',
			'drafts',
			`${sanitizedPerson}.md`
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

		return json({
			blog: {
				id: currentBlog.id,
				person: currentBlog.person,
				title: currentBlog.title
			},
			versions,
			hasDraft: !!draftContent
		});
	} catch (error) {
		console.error('Unexpected error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
