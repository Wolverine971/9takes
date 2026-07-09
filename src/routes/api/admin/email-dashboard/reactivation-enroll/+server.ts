// src/routes/api/admin/email-dashboard/reactivation-enroll/+server.ts
// Profiles-only reactivation enrollment dry-run and execution endpoint.

import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { enrollDormantCandidatesInReactivationSequence } from '$lib/server/emailSequences';
import { requireAdmin } from '$lib/server/adminAuth';
import { adminReactivationEnrollmentSchema } from '$lib/validation/adminEmailSchemas';

export const POST: RequestHandler = async ({ request, locals }) => {
	await requireAdmin(locals);

	const parsed = adminReactivationEnrollmentSchema.safeParse(
		await request.json().catch(() => null)
	);
	if (!parsed.success) {
		throw error(400, 'Invalid reactivation enrollment payload');
	}
	const { dryRun, limit, buckets } = parsed.data;

	const summary = await enrollDormantCandidatesInReactivationSequence({
		dryRun,
		limit,
		buckets
	});

	return json(summary);
};
