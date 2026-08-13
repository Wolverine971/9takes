// src/lib/server/questionDistribution.ts
import { createHash } from 'node:crypto';

import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

export const EMERGENCY_HOMEPAGE_QUESTION = {
	id: 567,
	question:
		"What's something you do every day to seem 'fine' that nobody knows is costing you effort?",
	url: 'whats-something-every-day-seem-fine-nobody-knows-costing-effort',
	featureRunId: null,
	featureEndsAt: null,
	targetUniqueImpressions: 30,
	qualifiedUniqueImpressions: 0,
	selectionMode: 'fallback',
	isFallback: true
} as const;

type HomepageFeatureRow = {
	run_id: number | string | null;
	question_id: number | string;
	question_text: string;
	question_url: string;
	started_at: string | null;
	ends_at: string | null;
	target_unique_impressions: number;
	qualified_unique_impressions: number;
	selection_mode: 'manual' | 'queue' | 'fallback';
	is_fallback: boolean;
};

export type HomepageFeaturedQuestion = {
	id: number;
	question: string;
	url: string;
	featureRunId: number | null;
	featureEndsAt: string | null;
	targetUniqueImpressions: number;
	qualifiedUniqueImpressions: number;
	selectionMode: 'manual' | 'queue' | 'fallback';
	isFallback: boolean;
};

function asFiniteInteger(value: number | string | null): number | null {
	const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : value;
	return typeof parsed === 'number' && Number.isSafeInteger(parsed) ? parsed : null;
}

function mapHomepageFeature(row: HomepageFeatureRow): HomepageFeaturedQuestion | null {
	const id = asFiniteInteger(row.question_id);
	const featureRunId = asFiniteInteger(row.run_id);
	const question = row.question_text?.trim();
	const url = row.question_url?.trim();

	if (id === null || !question || !url) return null;

	return {
		id,
		question,
		url,
		featureRunId,
		featureEndsAt: row.ends_at ?? null,
		targetUniqueImpressions: Math.max(1, Math.trunc(row.target_unique_impressions || 30)),
		qualifiedUniqueImpressions: Math.max(0, Math.trunc(row.qualified_unique_impressions || 0)),
		selectionMode: row.selection_mode,
		isFallback: Boolean(row.is_fallback)
	};
}

export async function getHomepageFeaturedQuestion(): Promise<HomepageFeaturedQuestion> {
	try {
		const supabaseAdmin = getSupabaseAdminClient() as any;
		const { data, error } = (await supabaseAdmin.rpc('get_current_homepage_feature')) as {
			data: HomepageFeatureRow[] | HomepageFeatureRow | null;
			error: unknown;
		};

		if (error) {
			console.error('Failed to load homepage feature run', { error });
			return EMERGENCY_HOMEPAGE_QUESTION;
		}

		const row = Array.isArray(data) ? data[0] : data;
		return (row && mapHomepageFeature(row)) || EMERGENCY_HOMEPAGE_QUESTION;
	} catch (error) {
		console.error('Failed to load homepage feature run', { error });
		return EMERGENCY_HOMEPAGE_QUESTION;
	}
}

export async function recordHomepageFeatureImpression({
	featureRunId,
	questionId,
	fingerprint
}: {
	featureRunId: number;
	questionId: number;
	fingerprint: string;
}): Promise<boolean> {
	if (
		!Number.isSafeInteger(featureRunId) ||
		featureRunId <= 0 ||
		!Number.isSafeInteger(questionId) ||
		questionId <= 0 ||
		!fingerprint.trim()
	) {
		return false;
	}

	const fingerprintHash = createHash('sha256').update(fingerprint.trim()).digest('hex');
	const supabaseAdmin = getSupabaseAdminClient() as any;
	const { data, error } = await supabaseAdmin.rpc('record_question_feature_impression', {
		p_run_id: featureRunId,
		p_question_id: questionId,
		p_fingerprint_hash: fingerprintHash
	});

	if (error) {
		console.error('Failed to record homepage feature impression', {
			featureRunId,
			questionId,
			error
		});
		return false;
	}

	return data === true;
}
