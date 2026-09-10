// src/routes/design-preview/harry-dry-v2/community/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseCommunityProof } from '../communityProof';

export const GET: RequestHandler = async ({ locals }) => {
	// Same public index as /questions. Return only titles, slugs, and counts.
	// The practice answer is never submitted to this endpoint.
	try {
		const { data, error } = await locals.supabase
			.rpc('get_questions_page_data', { p_limit: 6, p_offset: 0 })
			.abortSignal(AbortSignal.timeout(3000));
		return json(error ? null : parseCommunityProof(data));
	} catch {
		return json(null);
	}
};
