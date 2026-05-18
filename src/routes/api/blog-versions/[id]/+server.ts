// src/routes/api/blog-versions/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { loadPeopleDraftVersion } from '$lib/server/peopleDraftVersion';

export const GET: RequestHandler = async ({ params, locals }) => {
	const blogId = parseInt(params.id as string);
	const { supabase } = await requireAdmin(locals);

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
					.select('id, new_content, changed_at, changed_by')
					.eq('famous_people_id', blogId)
					.order('changed_at', { ascending: false })
			]);

		// Handle errors after parallel execution
		if (currentError) {
			console.error('Error fetching current blog:', currentError);
			return json({ error: 'Blog not found' }, { status: 404 });
		}
		if (!currentBlog?.person) {
			return json({ error: 'Invalid blog data' }, { status: 400 });
		}

		if (historyError) {
			console.error('Error fetching blog history:', historyError);
			return json({ error: 'Failed to fetch version history' }, { status: 500 });
		}

		const historyRows = history ?? [];
		const draft = await loadPeopleDraftVersion(currentBlog.person);

		// Build versions array with current version, draft, and history
		const versions = [];

		// Add current version as the most recent (unless draft is newer)
		const currentVersionNumber = historyRows.length + (draft ? 2 : 1);
		versions.push({
			id: 'current',
			content: currentBlog.content,
			changed_at: currentBlog.lastmod,
			changed_by: null,
			version_number: draft ? currentVersionNumber - 1 : currentVersionNumber,
			is_current: !draft,
			source: 'database'
		});

		// Add draft version if it exists (as the most recent)
		if (draft) {
			versions.unshift({
				id: 'draft',
				content: draft.content,
				changed_at: draft.modifiedAt?.toISOString() || new Date().toISOString(),
				changed_by: null,
				version_number: currentVersionNumber,
				is_current: true,
				source: 'draft'
			});
		}

		// Add historical versions
		historyRows.forEach((historyItem, index) => {
			versions.push({
				id: historyItem.id,
				content: historyItem.new_content,
				changed_at: historyItem.changed_at,
				changed_by: historyItem.changed_by,
				version_number: historyRows.length - index,
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
			hasDraft: !!draft
		});
	} catch (error) {
		console.error('Unexpected error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
