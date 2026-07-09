// src/routes/api/admin/email-dashboard/drafts/+server.ts
// Manage email drafts

import { error, isHttpError, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { EmailDraft } from '$lib/types/email';
import { requireAdmin } from '$lib/server/adminAuth';
import { adminSaveEmailDraftSchema } from '$lib/validation/adminEmailSchemas';

// GET - List all drafts
export const GET: RequestHandler = async ({ locals }) => {
	const { supabase } = await requireAdmin(locals);

	try {
		const { data: drafts, error: draftsError } = await supabase
			.from('email_drafts')
			.select('id, subject, recipients, scheduled_for, created_by, created_at, updated_at')
			.order('updated_at', { ascending: false });

		if (draftsError) {
			console.error('Error fetching drafts:', draftsError);
			throw error(500, 'Failed to fetch drafts');
		}

		return json({ drafts: drafts || [] });
	} catch (e) {
		if (isHttpError(e)) throw e;
		console.error('Error in drafts GET:', e);
		throw error(500, 'Internal server error');
	}
};

// POST - Create or update draft
export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, supabase } = await requireAdmin(locals);

	try {
		const parsed = adminSaveEmailDraftSchema.safeParse(await request.json().catch(() => null));
		if (!parsed.success) {
			throw error(400, 'Invalid email draft payload');
		}
		const body = parsed.data;
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
				.update(draftData as any)
				.eq('id', id)
				.select(
					'id, subject, html_content, recipients, scheduled_for, created_by, created_at, updated_at'
				)
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
				} as any)
				.select(
					'id, subject, html_content, recipients, scheduled_for, created_by, created_at, updated_at'
				)
				.single();

			if (insertError) {
				console.error('Error creating draft:', insertError);
				throw error(500, 'Failed to create draft');
			}
			result = data;
		}

		return json({ draft: result as EmailDraft });
	} catch (e) {
		if (isHttpError(e)) throw e;
		console.error('Error in drafts POST:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
