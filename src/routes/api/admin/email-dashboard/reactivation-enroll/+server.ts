// src/routes/api/admin/email-dashboard/reactivation-enroll/+server.ts
// Profiles-only reactivation enrollment dry-run and execution endpoint.

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { enrollDormantCandidatesInReactivationSequence } from '$lib/server/emailSequences';
import type { ReactivationBucket } from '$lib/email/sequences';

const ALLOWED_BUCKETS = new Set<ReactivationBucket>(['cold', 'dormant', 'zombies']);

function parseBuckets(value: unknown): ReactivationBucket[] | undefined {
	if (!Array.isArray(value)) {
		return undefined;
	}

	const buckets = value.filter((bucket): bucket is ReactivationBucket => {
		return typeof bucket === 'string' && ALLOWED_BUCKETS.has(bucket as ReactivationBucket);
	});

	return buckets.length > 0 ? [...new Set(buckets)] : undefined;
}

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

	const body = await request.json().catch(() => ({}));
	const limit =
		typeof body.limit === 'number' && Number.isFinite(body.limit)
			? Math.floor(body.limit)
			: undefined;
	const dryRun = body.dryRun !== false;
	const buckets = parseBuckets(body.buckets);

	const summary = await enrollDormantCandidatesInReactivationSequence({
		dryRun,
		limit,
		buckets
	});

	return json(summary);
};
