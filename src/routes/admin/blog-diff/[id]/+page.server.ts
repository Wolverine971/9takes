// src/routes/admin/blog-diff/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, isHttpError } from '@sveltejs/kit';
import type { Database } from '../../../../../database.types';
import { loadPeopleDraftVersion } from '$lib/server/peopleDraftVersion';

type BlogRow = Pick<
	Database['public']['Tables']['blogs_famous_people']['Row'],
	'id' | 'person' | 'title' | 'content' | 'lastmod' | 'enneagram' | 'description'
>;
type BlogHistoryRow = Pick<
	Database['public']['Tables']['blogs_famous_people_history']['Row'],
	'id' | 'new_content' | 'changed_at' | 'changed_by'
>;
type VersionEntry = {
	id: number | string;
	content: string;
	changed_at: string;
	changed_by: string | null;
	version_number: number;
	is_current: boolean;
	source: 'database' | 'draft' | 'history';
};

export const load: PageServerLoad = async ({ params, locals }) => {
	const blogId = parseInt(params.id as string);

	if (isNaN(blogId)) {
		throw error(400, 'Invalid blog ID');
	}

	try {
		// Get the current blog post
		const { data: currentBlog, error: currentError } = (await locals.supabase
			.from('blogs_famous_people')
			.select('id, person, title, content, lastmod, enneagram, description')
			.eq('id', blogId)
			.single()) as { data: BlogRow | null; error: unknown };

		if (currentError || !currentBlog) {
			console.error('Error fetching current blog:', currentError);
			throw error(404, 'Blog not found');
		}

		// Get the version history
		const { data: history, error: historyError } = (await locals.supabase
			.from('blogs_famous_people_history')
			.select('id, new_content, changed_at, changed_by')
			.eq('famous_people_id', blogId)
			.order('changed_at', { ascending: false })) as {
			data: BlogHistoryRow[] | null;
			error: unknown;
		};

		if (historyError) {
			console.error('Error fetching blog history:', historyError);
			throw error(500, 'Failed to fetch version history');
		}

		const draft = await loadPeopleDraftVersion(currentBlog.person ?? String(currentBlog.id));

		// Build versions array with current version, draft, and history
		const versions: VersionEntry[] = [];
		const historyRows = history ?? [];

		// Add current version as the most recent (unless draft is newer)
		const currentVersionNumber = historyRows.length + (draft ? 2 : 1);
		versions.push({
			id: 'current',
			content: currentBlog.content ?? '',
			changed_at: currentBlog.lastmod ?? new Date().toISOString(),
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
				content: historyItem.new_content ?? '',
				changed_at: historyItem.changed_at ?? new Date().toISOString(),
				changed_by: historyItem.changed_by,
				version_number: historyRows.length - index,
				is_current: false,
				source: 'history'
			});
		});

		return {
			blog: {
				id: currentBlog.id,
				person: currentBlog.person ?? '',
				title: currentBlog.title ?? '',
				enneagram: currentBlog.enneagram ?? '',
				description: currentBlog.description ?? ''
			},
			versions,
			hasDraft: !!draft
		};
	} catch (err) {
		if (isHttpError(err)) {
			throw err;
		}

		console.error('Unexpected error:', err);
		throw error(500, 'Internal server error');
	}
};
