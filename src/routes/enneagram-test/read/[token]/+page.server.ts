// src/routes/enneagram-test/read/[token]/+page.server.ts
//
// The link a test-taker sends to someone who knows them. Loads only the name
// they chose; their picks stay hidden until the friend answers (the POST to
// /api/enneagram-test/reads/[token] reveals them).
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getReadContext, isReadToken } from '$lib/server/enneagramTest';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' });
	if (!isReadToken(params.token)) error(404, 'This link isn’t valid');

	let context;
	try {
		context = await getReadContext(getSupabaseAdminClient(), params.token);
	} catch (loadError) {
		logger.error('Failed to load Enneagram test friend link', loadError as Error);
		error(503, 'We couldn’t load this link. Please try again.');
	}
	if (!context) error(404, 'This link isn’t valid');

	return { readToken: params.token, displayName: context.displayName };
};
