// GET/POST /api/admin/email-dashboard/drafts
// Manage email drafts

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { EmailDraft, SaveDraftRequest } from '$lib/types/email';

// GET - List all drafts
export const GET: RequestHandler = async ({ locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	try {
		const { data: drafts, error: draftsError } = await supabase
			.from('email_drafts')
			.select('*')
			.order('updated_at', { ascending: false });

		if (draftsError) {
			console.error('Error fetching drafts:', draftsError);
			throw error(500, 'Failed to fetch drafts');
		}

		return json({ drafts: drafts || [] });
	} catch (e) {
		console.error('Error in drafts GET:', e);
		throw error(500, 'Internal server error');
	}
};

// POST - Create or update draft
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	try {
		const body: SaveDraftRequest = await request.json();
		const { id, subject, html_content, recipients, scheduled_for } = body;

		const draftData = {
			subject: subject || null,
			html_content: html_content || null,
			recipients: recipients || [],
			scheduled_for: scheduled_for || null,
			updated_at: new Date().toISOString()
		};

		let result;

		if (id) {
			// Update existing draft
			const { data, error: updateError } = await supabase
				.from('email_drafts')
				.update(draftData)
				.eq('id', id)
				.select()
				.single();

			if (updateError) {
				console.error('Error updating draft:', updateError);
				throw error(500, 'Failed to update draft');
			}
			result = data;
		} else {
			// Create new draft
			const { data, error: insertError } = await supabase
				.from('email_drafts')
				.insert({
					...draftData,
					created_by: session.user.id
				})
				.select()
				.single();

			if (insertError) {
				console.error('Error creating draft:', insertError);
				throw error(500, 'Failed to create draft');
			}
			result = data;
		}

		return json({ draft: result as EmailDraft });
	} catch (e) {
		console.error('Error in drafts POST:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
