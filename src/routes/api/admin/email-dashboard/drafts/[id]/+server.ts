// src/routes/api/admin/email-dashboard/drafts/[id]/+server.ts
// Delete a draft

import { error, isHttpError, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { supabase } = await requireAdmin(locals);

	const { id } = params;

	if (!id) {
		throw error(400, 'Draft ID is required');
	}

	try {
		const { error: deleteError } = await supabase.from('email_drafts').delete().eq('id', id);

		if (deleteError) {
			console.error('Error deleting draft:', deleteError);
			throw error(500, 'Failed to delete draft');
		}

		return json({ success: true });
	} catch (e) {
		if (isHttpError(e)) throw e;
		console.error('Error in draft DELETE:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};

// GET - Fetch a single draft
export const GET: RequestHandler = async ({ params, locals }) => {
	const { supabase } = await requireAdmin(locals);

	const { id } = params;

	if (!id) {
		throw error(400, 'Draft ID is required');
	}

	try {
		const { data: draft, error: fetchError } = await supabase
			.from('email_drafts')
			.select(
				'id, subject, html_content, recipients, scheduled_for, created_by, created_at, updated_at'
			)
			.eq('id', id)
			.single();

		if (fetchError) {
			console.error('Error fetching draft:', fetchError);
			throw error(404, 'Draft not found');
		}

		return json({ draft });
	} catch (e) {
		if (isHttpError(e)) throw e;
		console.error('Error in draft GET:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
