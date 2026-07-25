// src/lib/server/apiRateLimit.ts
//
// Rate limiting for metered endpoints — the ones that spend money per call
// (OpenRouter transcription, the chorus mirror).
//
// Two rules make this different from the old in-memory limiter:
//
//   1. The subject is server-derived (session user id, else client IP). It is
//      never a client-supplied fingerprint, because a caller can rotate a
//      cookie or a request-body field to mint themselves a fresh budget.
//   2. The counter lives in Postgres, so it is shared across the concurrent
//      serverless instances a burst of traffic spreads over, and it survives
//      cold starts.
//
// The in-memory tier is kept in front of the database as a cheap fast path and
// as the fallback if the database is unreachable, so a blip degrades to
// per-instance limiting rather than to no limiting at all.

import { createHash } from 'node:crypto';

import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

export type RateLimitBucket = 'transcribe' | 'chorus_mirror';

export type RateLimitRule = {
	limit: number;
	windowMs: number;
};

export const RATE_LIMIT_RULES: Record<RateLimitBucket, RateLimitRule> = {
	transcribe: { limit: 8, windowMs: 5 * 60 * 1000 },
	chorus_mirror: { limit: 20, windowMs: 10 * 60 * 1000 }
};

export type RateLimitDecision = {
	allowed: boolean;
	retryAfterSeconds: number;
	/** True when the database was unreachable and only the local tier ran. */
	degraded: boolean;
};

type LocalEntry = {
	count: number;
	windowStartedAt: number;
};

const localCounters = new Map<string, LocalEntry>();
const LOCAL_MAX_ENTRIES = 5000;

/**
 * Identify the caller from data the caller cannot choose.
 *
 * A signed-in user is identified by their session id. Everyone else is
 * identified by IP, which on Vercel comes from the platform rather than from a
 * header the client controls.
 */
export function resolveRateLimitSubject({
	userId,
	clientAddress
}: {
	userId?: string | null;
	clientAddress: string;
}): string {
	return userId ? `user:${userId}` : `ip:${clientAddress}`;
}

function hashSubject(subject: string): string {
	return createHash('sha256').update(subject).digest('hex');
}

function pruneLocal(now: number, windowMs: number): void {
	if (localCounters.size <= LOCAL_MAX_ENTRIES) return;

	for (const [key, entry] of localCounters) {
		if (now - entry.windowStartedAt >= windowMs) {
			localCounters.delete(key);
		}
	}
}

/**
 * Consume one unit from the local (per-instance) tier.
 *
 * Returns the running count for this window so the caller can tell whether the
 * local tier alone already exceeded the limit.
 */
function consumeLocal(key: string, windowMs: number): number {
	const now = Date.now();
	pruneLocal(now, windowMs);

	const current = localCounters.get(key);

	if (!current || now - current.windowStartedAt >= windowMs) {
		localCounters.set(key, { count: 1, windowStartedAt: now });
		return 1;
	}

	current.count += 1;
	return current.count;
}

/**
 * Record one call against `subject` and report whether it may proceed.
 *
 * Call this immediately before spending money, and only once per request.
 */
export async function consumeApiRateLimit({
	bucket,
	subject
}: {
	bucket: RateLimitBucket;
	subject: string;
}): Promise<RateLimitDecision> {
	const rule = RATE_LIMIT_RULES[bucket];
	const retryAfterSeconds = Math.ceil(rule.windowMs / 1000);
	const localKey = `${bucket}:${subject}`;

	const localUsed = consumeLocal(localKey, rule.windowMs);
	if (localUsed > rule.limit) {
		// This instance alone has already seen too many. No need to ask the DB.
		return { allowed: false, retryAfterSeconds, degraded: false };
	}

	try {
		const adminClient = getSupabaseAdminClient() as any;
		const { data, error } = await adminClient.rpc('consume_api_rate_limit', {
			p_bucket: bucket,
			p_subject_hash: hashSubject(subject),
			p_window_seconds: Math.ceil(rule.windowMs / 1000)
		});

		if (error) throw error;

		const used = Number(data ?? 0);
		return { allowed: used <= rule.limit, retryAfterSeconds, degraded: false };
	} catch (error) {
		// Degrade to the local tier rather than to unlimited spending.
		logger.error('Durable rate limit unavailable, falling back to local tier', error as Error, {
			bucket
		});

		return { allowed: localUsed <= rule.limit, retryAfterSeconds, degraded: true };
	}
}

/** Test seam: drops the per-instance tier between cases. */
export function resetLocalRateLimitState(): void {
	localCounters.clear();
}
