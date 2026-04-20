// src/routes/api/admin/content/[id]/+server.ts
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';

// GET - Fetch full content including markdown and history
export const GET: RequestHandler = async ({ params, locals }) => {
	const contentId = Number(params.id);
	if (!Number.isFinite(contentId)) {
		throw error(400, 'Invalid content ID');
	}
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
		.eq('id', contentId)
		.single();

	if (fetchError) {
		console.error('Error fetching content:', fetchError);
		throw error(404, 'Content not found');
	}

	// Fetch history separately (last 3 changes)
	const { data: history } = await supabase
		.from('blogs_famous_people_history')
		.select('id, changed_at, new_content')
		.eq('famous_people_id', contentId)
		.order('changed_at', { ascending: false })
		.limit(3);

	// Fetch stage from content_people
	const { data: stageData } = data.loc
		? await supabase.from('content_people').select('stageName').eq('loc', data.loc).single()
		: { data: null };

	return json({
		...data,
		history: history || [],
		stageName: stageData?.stageName || null
	});
};

// PUT - Update content
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const contentId = Number(params.id);
	if (!Number.isFinite(contentId)) {
		throw error(400, 'Invalid content ID');
	}
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
		'tags',
		// Structured-data fields — see docs/planning/people-jsonld-unification-2026-04-19.md
		'keywords',
		'same_as',
		'faqs',
		'wikidata_qid',
		'imdb_id',
		'birth_date',
		'birth_place',
		'nationality',
		'occupation',
		'knows_about',
		'citations'
	]);

	const WIKIDATA_QID_PATTERN = /^Q[1-9]\d*$/;
	const IMDB_NCONST_PATTERN = /^nm\d+$/;

	// Filter to only allowed fields
	const safeUpdates: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(updates)) {
		if (!allowedFields.has(key)) continue;

		if (key === 'wikidata_qid' && typeof value === 'string' && value.trim() !== '') {
			if (!WIKIDATA_QID_PATTERN.test(value.trim())) {
				throw error(400, 'wikidata_qid must match /^Q[1-9]\\d*$/ (e.g. "Q26876")');
			}
			safeUpdates[key] = value.trim();
			continue;
		}

		if (key === 'imdb_id' && typeof value === 'string' && value.trim() !== '') {
			if (!IMDB_NCONST_PATTERN.test(value.trim())) {
				throw error(400, 'imdb_id must match /^nm\\d+$/ (e.g. "nm1728342")');
			}
			safeUpdates[key] = value.trim();
			continue;
		}

		safeUpdates[key] = value;
	}

	// Auto-update lastmod
	safeUpdates.lastmod = new Date().toISOString().split('T')[0];

	const { data: existingContent, error: existingContentError } = await supabase
		.from('blogs_famous_people')
		.select('id, person, title, published, published_at, first_published_at')
		.eq('id', contentId)
		.single();

	if (existingContentError) {
		console.error('Error fetching existing content:', existingContentError);
		throw error(404, 'Content not found');
	}

	const isPublishingNow =
		Object.prototype.hasOwnProperty.call(safeUpdates, 'published') &&
		safeUpdates.published === true &&
		existingContent?.published !== true;
	const publishedAt = isPublishingNow ? new Date().toISOString() : null;

	if (isPublishingNow && publishedAt) {
		safeUpdates.published_at = publishedAt;
		safeUpdates.first_published_at =
			existingContent.first_published_at || existingContent.published_at || publishedAt;
	}

	const { data, error: updateError } = await supabase
		.from('blogs_famous_people')
		.update(safeUpdates)
		.eq('id', contentId)
		.select()
		.single();

	if (updateError) {
		console.error('Error updating content:', updateError);
		throw error(400, updateError.message);
	}

	if (isPublishingNow && publishedAt) {
		const contentSlug = normalizePersonalitySlug(data.person || existingContent.person);
		const supabaseAny = supabase as any;
		const { error: eventError } = await supabaseAny.rpc('record_content_release_event', {
			p_content_type: 'people',
			p_content_slug: contentSlug,
			p_event_type: 'published',
			p_event_at: publishedAt,
			p_source: 'admin-content-api',
			p_path: `/personality-analysis/${contentSlug}`,
			p_metadata: {
				blog_id: data.id,
				title: data.title || existingContent.title || null
			}
		});

		if (eventError) {
			console.error('Error recording content release event:', eventError);
			throw error(400, eventError.message || 'Failed to record release event');
		}
	}

	return json({ data });
};
