// src/routes/api/admin/content/[id]/+server.ts
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET - Fetch full content including markdown and history
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

	// Fetch the content with history
	const { data, error: fetchError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('id', id)
		.single();

	if (fetchError) {
		console.error('Error fetching content:', fetchError);
		throw error(404, 'Content not found');
	}

	// Fetch history separately (last 5 changes)
	const { data: history } = await supabase
		.from('blogs_famous_people_history')
		.select('id, changed_at, old_content, new_content')
		.eq('famous_people_id', id)
		.order('changed_at', { ascending: false })
		.limit(5);

	// Fetch stage from content_people
	const { data: stageData } = await supabase
		.from('content_people')
		.select('stageName')
		.eq('loc', data.loc)
		.single();

	return json({
		...data,
		history: history || [],
		stageName: stageData?.stageName || null
	});
};

// PUT - Update content
export const PUT: RequestHandler = async ({ params, request, locals }) => {
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

	const updates = await request.json();

	// Whitelist of allowed fields to update
	const allowedFields = new Set([
		'title',
		'meta_title',
		'description',
		'content',
		'type',
		'category',
		'published',
		'enneagram',
		'author',
		'twitter',
		'instagram',
		'tiktok',
		'wikipedia',
		'suggestions',
		'pic',
		'tags'
	]);

	// Filter to only allowed fields
	const safeUpdates: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(updates)) {
		if (allowedFields.has(key)) {
			safeUpdates[key] = value;
		}
	}

	// Auto-update lastmod
	safeUpdates.lastmod = new Date().toISOString().split('T')[0];

	const { data, error: updateError } = await supabase
		.from('blogs_famous_people')
		.update(safeUpdates)
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		console.error('Error updating content:', updateError);
		throw error(400, updateError.message);
	}

	return json({ data });
};
