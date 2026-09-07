import { env } from '$env/dynamic/private';
import { getSupabaseAdminClient } from './supabaseAdmin';
import { resolveHostUserId } from './hostIdentity';
import { TAKE_FETCH_LIMIT } from '$lib/components/questions/commentRanking';
import type { Comment } from '$lib/types/questions';

export function isCommentRankingEnabled(): boolean {
	return env.PRIVATE_COMMENT_RANKING_ENABLED === 'true';
}

/** Call only after checking the discussion gate (or admin authorization). */
export async function getQuestionTakes(
	questionId: number,
	options: {
		viewerId?: string | null;
		fingerprint?: string | null;
		limit?: number;
		before?: string | null;
		beforeId?: number | null;
	} = {}
) {
	const { data, error } = await (getSupabaseAdminClient().rpc as any)('get_question_take_data', {
		p_question_id: questionId,
		p_viewer_id: options.viewerId ?? null,
		p_fingerprint: options.fingerprint ?? null,
		p_host_user_id: resolveHostUserId(),
		p_limit: options.limit ?? TAKE_FETCH_LIMIT,
		p_before: options.before ?? null,
		p_before_id: options.beforeId ?? null
	});
	if (error) throw new Error('Could not load question takes', { cause: error });
	return {
		data: (data?.takes ?? []) as Comment[],
		ownComments: (data?.own_takes ?? []) as Comment[],
		count: Number(data?.total_count ?? 0)
	};
}
