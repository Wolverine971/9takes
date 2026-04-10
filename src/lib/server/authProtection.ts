// src/lib/server/authProtection.ts
import { createHash } from 'node:crypto';

import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

export type AuthFlow = 'login' | 'register' | 'forgot_password';
export type AuthFlowOutcome = 'success' | 'failed' | 'captcha_failed' | 'rate_limited' | 'honeypot';

type AuthFlowRule = {
	windowMs: number;
	alwaysRequireCaptcha?: boolean;
	captchaThresholds?: {
		ip: number;
		identifier?: number;
	};
	rateLimitThresholds: {
		ip: number;
		identifier?: number;
	};
	countedOutcomes: AuthFlowOutcome[];
};

export type AuthProtectionState = {
	captchaRequired: boolean;
	rateLimited: boolean;
	retryAfterSeconds?: number;
};

const AUTH_SECURITY_EVENTS_TABLE = 'auth_security_events';

const AUTH_FLOW_RULES: Record<AuthFlow, AuthFlowRule> = {
	login: {
		windowMs: 15 * 60 * 1000,
		captchaThresholds: {
			ip: 3,
			identifier: 3
		},
		rateLimitThresholds: {
			ip: 10,
			identifier: 8
		},
		countedOutcomes: ['failed', 'captcha_failed', 'rate_limited']
	},
	register: {
		windowMs: 60 * 60 * 1000,
		captchaThresholds: {
			ip: 2,
			identifier: 2
		},
		rateLimitThresholds: {
			ip: 5,
			identifier: 3
		},
		countedOutcomes: ['success', 'failed', 'captcha_failed', 'rate_limited']
	},
	forgot_password: {
		windowMs: 60 * 60 * 1000,
		alwaysRequireCaptcha: true,
		rateLimitThresholds: {
			ip: 5,
			identifier: 3
		},
		countedOutcomes: ['success', 'captcha_failed', 'rate_limited']
	}
};

function hashValue(value: string): string {
	return createHash('sha256').update(value).digest('hex');
}

function normalizeIdentifier(identifier?: string | null): string | null {
	const normalized = identifier?.trim().toLowerCase();
	return normalized ? normalized : null;
}

async function countRecentEvents({
	flow,
	column,
	hash,
	since,
	outcomes
}: {
	flow: AuthFlow;
	column: 'ip_hash' | 'identifier_hash';
	hash: string | null;
	since: string;
	outcomes: AuthFlowOutcome[];
}): Promise<number> {
	if (!hash) {
		return 0;
	}

	const adminClient = getSupabaseAdminClient() as any;
	const { count, error } = await adminClient
		.from(AUTH_SECURITY_EVENTS_TABLE)
		.select('*', { count: 'exact', head: true })
		.eq('flow', flow)
		.eq(column, hash)
		.gte('created_at', since)
		.in('outcome', outcomes);

	if (error) {
		throw error;
	}

	return count ?? 0;
}

export async function getAuthProtectionState({
	flow,
	ipAddress,
	identifier
}: {
	flow: AuthFlow;
	ipAddress: string;
	identifier?: string | null;
}): Promise<AuthProtectionState> {
	const rule = AUTH_FLOW_RULES[flow];
	const since = new Date(Date.now() - rule.windowMs).toISOString();
	const ipHash = hashValue(ipAddress);
	const identifierHash = normalizeIdentifier(identifier);

	try {
		const [recentIpEvents, recentIdentifierEvents] = await Promise.all([
			countRecentEvents({
				flow,
				column: 'ip_hash',
				hash: ipHash,
				since,
				outcomes: rule.countedOutcomes
			}),
			countRecentEvents({
				flow,
				column: 'identifier_hash',
				hash: identifierHash ? hashValue(identifierHash) : null,
				since,
				outcomes: rule.countedOutcomes
			})
		]);

		const rateLimitedByIp = recentIpEvents >= rule.rateLimitThresholds.ip;
		const rateLimitedByIdentifier =
			typeof rule.rateLimitThresholds.identifier === 'number' &&
			recentIdentifierEvents >= rule.rateLimitThresholds.identifier;
		const rateLimited = rateLimitedByIp || rateLimitedByIdentifier;

		const captchaRequired =
			rule.alwaysRequireCaptcha ||
			(!rateLimited &&
				((typeof rule.captchaThresholds?.ip === 'number' &&
					recentIpEvents >= rule.captchaThresholds.ip) ||
					(typeof rule.captchaThresholds?.identifier === 'number' &&
						recentIdentifierEvents >= rule.captchaThresholds.identifier)));

		return {
			captchaRequired,
			rateLimited,
			retryAfterSeconds: rateLimited ? Math.ceil(rule.windowMs / 1000) : undefined
		};
	} catch (error) {
		logger.error('Failed to evaluate auth protection state', error as Error, {
			flow
		});

		return {
			captchaRequired: !!rule.alwaysRequireCaptcha,
			rateLimited: false
		};
	}
}

export async function recordAuthProtectionEvent({
	flow,
	outcome,
	ipAddress,
	identifier,
	context = {}
}: {
	flow: AuthFlow;
	outcome: AuthFlowOutcome;
	ipAddress: string;
	identifier?: string | null;
	context?: Record<string, unknown>;
}): Promise<void> {
	const normalizedIdentifier = normalizeIdentifier(identifier);

	try {
		const adminClient = getSupabaseAdminClient() as any;
		const { error } = await adminClient.from(AUTH_SECURITY_EVENTS_TABLE).insert({
			flow,
			outcome,
			ip_hash: hashValue(ipAddress),
			identifier_hash: normalizedIdentifier ? hashValue(normalizedIdentifier) : null,
			context
		});

		if (error) {
			throw error;
		}
	} catch (error) {
		logger.error('Failed to record auth protection event', error as Error, {
			flow,
			outcome
		});
	}
}
