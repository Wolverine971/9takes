import { z } from 'zod';

import type { ReactivationBucket } from '$lib/email/sequences';

const reactivationBucketSchema = z.enum(['cold', 'dormant', 'zombies']);
const bucketCountsSchema = z.object({
	cold: z.number().int().nonnegative(),
	dormant: z.number().int().nonnegative(),
	zombies: z.number().int().nonnegative()
});

const candidateSummarySchema = z.object({
	limit: z.number().int().min(0).max(1000),
	candidates: z.array(
		z.object({
			userId: z.string().uuid(),
			email: z.string().email(),
			name: z.string().min(1),
			bucket: reactivationBucketSchema,
			createdAt: z.string().datetime({ offset: true }),
			ageDays: z.number().int().nonnegative()
		})
	),
	counts: bucketCountsSchema,
	skipped: z.array(
		z.object({
			reason: z.string().min(1),
			count: z.number().int().nonnegative()
		})
	),
	totalEligible: z.number().int().nonnegative(),
	totalProfilesChecked: z.number().int().nonnegative()
});

export type ReactivationCandidateSummary = z.infer<typeof candidateSummarySchema>;
export type ReactivationCandidateClient = Pick<App.Locals['supabase'], 'rpc'>;

export function parseReactivationCandidateSummary(value: unknown): ReactivationCandidateSummary {
	return candidateSummarySchema.parse(value);
}

export async function loadReactivationCandidateSummary(
	supabase: ReactivationCandidateClient,
	options: { limit: number; buckets?: ReactivationBucket[] }
): Promise<ReactivationCandidateSummary> {
	const limit = Number.isFinite(options.limit)
		? Math.min(1000, Math.max(0, Math.floor(options.limit)))
		: 200;
	const args: { p_limit: number; p_buckets?: ReactivationBucket[] } = { p_limit: limit };

	if (options.buckets?.length) {
		args.p_buckets = [...new Set(options.buckets)];
	}

	const { data, error } = await supabase.rpc('get_reactivation_candidate_summary', args);

	if (error) {
		throw error;
	}

	return parseReactivationCandidateSummary(data);
}
