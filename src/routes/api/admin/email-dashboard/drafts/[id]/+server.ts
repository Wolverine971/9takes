// DELETE /api/admin/email-dashboard/drafts/[id]
// Delete a draft

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
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
		console.error('Error in draft DELETE:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};

// GET - Fetch a single draft
export const GET: RequestHandler = async ({ params, locals }) => {
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

	const { id } = params;

	if (!id) {
		throw error(400, 'Draft ID is required');
	}

	try {
		const { data: draft, error: fetchError } = await supabase
			.from('email_drafts')
			.select('*')
			.eq('id', id)
			.single();

		if (fetchError) {
			console.error('Error fetching draft:', fetchError);
			throw error(404, 'Draft not found');
		}

		return json({ draft });
	} catch (e) {
		console.error('Error in draft GET:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
