// src/lib/server/newsletterSignupProtection.ts
import { createHash } from 'node:crypto';

import { logger } from '$lib/utils/logger';

export type NewsletterSignupOutcome =
	| 'success'
	| 'invalid_email'
	| 'already_exists'
	| 'honeypot'
	| 'too_fast'
	| 'bot_user_agent'
	| 'rate_limited'
	| 'auth_abuse'
	| 'blocked_email_pattern'
	| 'failed';

export type NewsletterSignupProtectionState = {
	authAbuse: boolean;
	rateLimited: boolean;
	retryAfterSeconds?: number;
	reason?: 'identifier_auth_abuse' | 'ip_auth_abuse' | 'ip_rate_limit' | 'identifier_rate_limit';
};

const NEWSLETTER_SIGNUP_EVENTS_TABLE = 'newsletter_signup_security_events';
const AUTH_SECURITY_EVENTS_TABLE = 'auth_security_events';
const NEWSLETTER_WINDOW_MS = 60 * 60 * 1000;
const AUTH_ABUSE_WINDOW_MS = 30 * 60 * 1000;
const NEWSLETTER_IP_LIMIT = 3;
const NEWSLETTER_IDENTIFIER_LIMIT = 2;
const AUTH_IP_ABUSE_LIMIT = 8;
const AUTH_IDENTIFIER_LOGIN_FAILURE_LIMIT = 2;

function hashValue(value: string): string {
	return createHash('sha256').update(value).digest('hex');
}

function normalizeIdentifier(identifier?: string | null): string | null {
	const normalized = identifier?.trim().toLowerCase();
	return normalized ? normalized : null;
}

function recentIso(windowMs: number): string {
	return new Date(Date.now() - windowMs).toISOString();
}

async function countNewsletterEvents({
	supabase,
	column,
	hash,
	since,
	outcomes
}: {
	supabase: any;
	column: 'ip_hash' | 'identifier_hash';
	hash: string | null;
	since: string;
	outcomes: NewsletterSignupOutcome[];
}): Promise<number> {
	if (!hash) return 0;

	const { count, error } = await supabase
		.from(NEWSLETTER_SIGNUP_EVENTS_TABLE)
		.select('*', { count: 'exact', head: true })
		.eq(column, hash)
		.gte('created_at', since)
		.in('outcome', outcomes);

	if (error) throw error;
	return count ?? 0;
}

async function countAuthEvents({
	supabase,
	column,
	hash,
	since,
	flow,
	outcome
}: {
	supabase: any;
	column: 'ip_hash' | 'identifier_hash';
	hash: string | null;
	since: string;
	flow?: string;
	outcome?: string | string[];
}): Promise<number> {
	if (!hash) return 0;

	let query = supabase
		.from(AUTH_SECURITY_EVENTS_TABLE)
		.select('*', { count: 'exact', head: true })
		.eq(column, hash)
		.gte('created_at', since);

	if (flow) {
		query = query.eq('flow', flow);
	}
	if (Array.isArray(outcome)) {
		query = query.in('outcome', outcome);
	} else if (outcome) {
		query = query.eq('outcome', outcome);
	}

	const { count, error } = await query;
	if (error) throw error;
	return count ?? 0;
}

async function countBestEffort(label: string, operation: Promise<number>): Promise<number> {
	try {
		return await operation;
	} catch (error) {
		logger.warn('Newsletter signup protection count failed', {
			label,
			error
		});
		return 0;
	}
}

export async function getNewsletterSignupProtectionState({
	supabase,
	ipAddress,
	identifier
}: {
	supabase: any;
	ipAddress: string;
	identifier?: string | null;
}): Promise<NewsletterSignupProtectionState> {
	const ipHash = hashValue(ipAddress);
	const normalizedIdentifier = normalizeIdentifier(identifier);
	const identifierHash = normalizedIdentifier ? hashValue(normalizedIdentifier) : null;
	const newsletterSince = recentIso(NEWSLETTER_WINDOW_MS);
	const authSince = recentIso(AUTH_ABUSE_WINDOW_MS);
	const countedNewsletterOutcomes: NewsletterSignupOutcome[] = [
		'success',
		'honeypot',
		'too_fast',
		'bot_user_agent',
		'rate_limited',
		'auth_abuse',
		'blocked_email_pattern',
		'failed'
	];

	const [
		recentNewsletterIpEvents,
		recentNewsletterIdentifierEvents,
		registerHoneypotByIdentifier,
		forgotBlockedByIdentifier,
		loginFailuresByIdentifier,
		recentAuthIpEvents
	] = await Promise.all([
		countBestEffort(
			'newsletter_ip',
			countNewsletterEvents({
				supabase,
				column: 'ip_hash',
				hash: ipHash,
				since: newsletterSince,
				outcomes: countedNewsletterOutcomes
			})
		),
		countBestEffort(
			'newsletter_identifier',
			countNewsletterEvents({
				supabase,
				column: 'identifier_hash',
				hash: identifierHash,
				since: newsletterSince,
				outcomes: countedNewsletterOutcomes
			})
		),
		countBestEffort(
			'auth_register_honeypot_identifier',
			countAuthEvents({
				supabase,
				column: 'identifier_hash',
				hash: identifierHash,
				since: authSince,
				flow: 'register',
				outcome: 'honeypot'
			})
		),
		countBestEffort(
			'auth_forgot_blocked_identifier',
			countAuthEvents({
				supabase,
				column: 'identifier_hash',
				hash: identifierHash,
				since: authSince,
				flow: 'forgot_password',
				outcome: ['captcha_failed', 'honeypot', 'rate_limited']
			})
		),
		countBestEffort(
			'auth_login_failed_identifier',
			countAuthEvents({
				supabase,
				column: 'identifier_hash',
				hash: identifierHash,
				since: authSince,
				flow: 'login',
				outcome: 'failed'
			})
		),
		countBestEffort(
			'auth_ip',
			countAuthEvents({
				supabase,
				column: 'ip_hash',
				hash: ipHash,
				since: authSince
			})
		)
	]);

	if (
		registerHoneypotByIdentifier > 0 ||
		forgotBlockedByIdentifier > 0 ||
		loginFailuresByIdentifier >= AUTH_IDENTIFIER_LOGIN_FAILURE_LIMIT
	) {
		return {
			authAbuse: true,
			rateLimited: false,
			reason: 'identifier_auth_abuse'
		};
	}

	if (recentAuthIpEvents >= AUTH_IP_ABUSE_LIMIT) {
		return {
			authAbuse: true,
			rateLimited: false,
			reason: 'ip_auth_abuse'
		};
	}

	if (recentNewsletterIpEvents >= NEWSLETTER_IP_LIMIT) {
		return {
			authAbuse: false,
			rateLimited: true,
			retryAfterSeconds: Math.ceil(NEWSLETTER_WINDOW_MS / 1000),
			reason: 'ip_rate_limit'
		};
	}

	if (recentNewsletterIdentifierEvents >= NEWSLETTER_IDENTIFIER_LIMIT) {
		return {
			authAbuse: false,
			rateLimited: true,
			retryAfterSeconds: Math.ceil(NEWSLETTER_WINDOW_MS / 1000),
			reason: 'identifier_rate_limit'
		};
	}

	return {
		authAbuse: false,
		rateLimited: false
	};
}

export async function recordNewsletterSignupSecurityEvent({
	supabase,
	outcome,
	ipAddress,
	identifier,
	fingerprint,
	userAgent,
	context = {}
}: {
	supabase: any;
	outcome: NewsletterSignupOutcome;
	ipAddress: string;
	identifier?: string | null;
	fingerprint?: string | null;
	userAgent?: string | null;
	context?: Record<string, unknown>;
}): Promise<void> {
	const normalizedIdentifier = normalizeIdentifier(identifier);
	const normalizedUserAgent = userAgent?.trim();

	try {
		const { error } = await supabase.from(NEWSLETTER_SIGNUP_EVENTS_TABLE).insert({
			outcome,
			ip_hash: hashValue(ipAddress),
			identifier_hash: normalizedIdentifier ? hashValue(normalizedIdentifier) : null,
			fingerprint: fingerprint?.trim() || null,
			user_agent_hash: normalizedUserAgent ? hashValue(normalizedUserAgent) : null,
			context
		});

		if (error) throw error;
	} catch (error) {
		logger.warn('Failed to record newsletter signup security event', {
			outcome,
			error
		});
	}
}
