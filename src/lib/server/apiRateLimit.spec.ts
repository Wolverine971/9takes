// src/lib/server/apiRateLimit.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const rpc = vi.fn();

vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ rpc })
}));

vi.mock('$lib/utils/logger', () => ({
	logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() }
}));

import {
	RATE_LIMIT_RULES,
	consumeApiRateLimit,
	resetLocalRateLimitState,
	resolveRateLimitSubject
} from './apiRateLimit';

beforeEach(() => {
	rpc.mockReset();
	resetLocalRateLimitState();
});

describe('resolveRateLimitSubject', () => {
	it('prefers the session user so one account cannot fan out across IPs', () => {
		expect(resolveRateLimitSubject({ userId: 'abc', clientAddress: '1.2.3.4' })).toBe('user:abc');
	});

	it('falls back to the platform-provided client address for anonymous callers', () => {
		expect(resolveRateLimitSubject({ userId: null, clientAddress: '1.2.3.4' })).toBe('ip:1.2.3.4');
	});

	it('ignores client-supplied identity entirely', () => {
		// There is no parameter through which a caller could pass a fingerprint.
		const subject = resolveRateLimitSubject({ userId: undefined, clientAddress: '9.9.9.9' });
		expect(subject).toBe('ip:9.9.9.9');
	});
});

describe('consumeApiRateLimit', () => {
	it('allows a call while the durable count is within the limit', async () => {
		rpc.mockResolvedValue({ data: 1, error: null });

		const decision = await consumeApiRateLimit({ bucket: 'transcribe', subject: 'ip:1.1.1.1' });

		expect(decision.allowed).toBe(true);
		expect(decision.degraded).toBe(false);
	});

	it('rejects once the durable count exceeds the limit', async () => {
		rpc.mockResolvedValue({ data: RATE_LIMIT_RULES.transcribe.limit + 1, error: null });

		const decision = await consumeApiRateLimit({ bucket: 'transcribe', subject: 'ip:1.1.1.1' });

		expect(decision.allowed).toBe(false);
		expect(decision.retryAfterSeconds).toBe(RATE_LIMIT_RULES.transcribe.windowMs / 1000);
	});

	it('hashes the subject rather than sending it in the clear', async () => {
		rpc.mockResolvedValue({ data: 1, error: null });

		await consumeApiRateLimit({ bucket: 'transcribe', subject: 'ip:1.2.3.4' });

		const [, args] = rpc.mock.calls[0];
		expect(args.p_subject_hash).toMatch(/^[a-f0-9]{64}$/);
		expect(args.p_subject_hash).not.toContain('1.2.3.4');
	});

	it('degrades to per-instance limiting instead of unlimited spend when the DB fails', async () => {
		rpc.mockResolvedValue({ data: null, error: new Error('unreachable') });

		const rule = RATE_LIMIT_RULES.transcribe;
		const results = [];
		for (let i = 0; i < rule.limit + 2; i += 1) {
			results.push(await consumeApiRateLimit({ bucket: 'transcribe', subject: 'ip:5.5.5.5' }));
		}

		// Calls that reached the failing DB report the degraded fallback...
		expect(results.slice(0, rule.limit).every((r) => r.degraded)).toBe(true);
		expect(results.slice(0, rule.limit).every((r) => r.allowed)).toBe(true);
		// ...and past the limit the local tier denies without consulting the DB,
		// so those decisions are not "degraded" — they are simply over budget.
		expect(results[rule.limit].allowed).toBe(false);
		expect(results[rule.limit].degraded).toBe(false);
	});

	it('short-circuits without a DB round trip once the local tier is exhausted', async () => {
		rpc.mockResolvedValue({ data: 1, error: null });

		const rule = RATE_LIMIT_RULES.chorus_mirror;
		for (let i = 0; i < rule.limit; i += 1) {
			await consumeApiRateLimit({ bucket: 'chorus_mirror', subject: 'ip:7.7.7.7' });
		}
		const callsBefore = rpc.mock.calls.length;

		const decision = await consumeApiRateLimit({ bucket: 'chorus_mirror', subject: 'ip:7.7.7.7' });

		expect(decision.allowed).toBe(false);
		expect(rpc.mock.calls.length).toBe(callsBefore);
	});

	it('tracks buckets and subjects independently', async () => {
		rpc.mockResolvedValue({ data: 1, error: null });

		await consumeApiRateLimit({ bucket: 'transcribe', subject: 'ip:1.1.1.1' });
		await consumeApiRateLimit({ bucket: 'chorus_mirror', subject: 'ip:1.1.1.1' });

		const buckets = rpc.mock.calls.map(([, args]) => args.p_bucket);
		expect(buckets).toEqual(['transcribe', 'chorus_mirror']);
	});
});
