// src/lib/server/contentAccessGuard.ts
import { createHash } from 'node:crypto';

type ProtectedContentRequest = {
	method: string;
	pathname: string;
	userAgent: string | null;
};

type ContentRequesterInput = ProtectedContentRequest & {
	anonymousId: string | null;
	clientIp: string | null;
	isAuthenticated: boolean;
};

type BotDefinition<Name extends string> = {
	name: Name;
	pattern: RegExp;
};

export type SearchPreviewBotName =
	| 'Googlebot'
	| 'Bingbot'
	| 'DuckDuckBot'
	| 'Applebot'
	| 'YandexBot'
	| 'Twitterbot'
	| 'FacebookExternalHit'
	| 'MetaWebIndexer'
	| 'Slackbot'
	| 'LinkedInBot'
	| 'Discordbot'
	| 'WhatsApp'
	| 'TelegramBot'
	| 'OAI-SearchBot'
	| 'Claude-SearchBot'
	| 'PerplexityBot';

export type UserFetchBotName =
	'ChatGPT-User' | 'Claude-User' | 'Perplexity-User' | 'Meta-ExternalFetcher';
export type TrainingCrawlerName =
	| 'GPTBot'
	| 'ClaudeBot'
	| 'anthropic-ai'
	| 'CCBot'
	| 'Google-Extended'
	| 'Applebot-Extended'
	| 'Meta-ExternalAgent';
export type HardBlockedReason = 'disallowed_ai_training_crawler' | 'unknown_bot_user_agent';
export type ContentActorType = 'anonymous_human';
export type ContentRequestKind = 'page' | 'data';

export type ContentAccessCounters = {
	total_10m: number;
	unique_10m: number;
	total_1h: number;
	unique_1h: number;
	total_24h: number;
	unique_24h: number;
};

export type TrackableContentRequester = {
	kind: 'anonymous_human';
	name: 'anonymous_human';
	actorKey: string;
	actorType: 'anonymous_human';
	anonymousId: string;
};

export type ContentRequester =
	| {
			kind: 'authenticated_human';
			name: 'authenticated_human';
	  }
	| {
			kind: 'search_preview_bot';
			name: SearchPreviewBotName;
	  }
	| {
			kind: 'user_fetch_bot';
			name: UserFetchBotName;
	  }
	| {
			kind: 'training_crawler';
			name: TrainingCrawlerName;
	  }
	| TrackableContentRequester;

export type ContentAccessDecision =
	| { action: 'allow' }
	| {
			action: 'throttle';
			reason:
				| 'anonymous_human_10m_unique_limit'
				| 'anonymous_human_1h_unique_limit'
				| 'anonymous_human_24h_unique_limit';
			retryAfterSeconds: number;
	  };

export const CONTENT_GUARD_CACHE_CONTROL = 'private, no-store';
export const CONTENT_SEARCH_PREVIEW_CACHE_CONTROL =
	'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';
export const PUBLIC_EDITORIAL_CACHE_CONTROL =
	'public, max-age=0, s-maxage=300, stale-while-revalidate=86400, stale-if-error=86400';
export const CONTENT_ACCESS_ANON_COOKIE_NAME = '9tanon';
export const CONTENT_ACCESS_ANON_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const CONTENT_METHODS = new Set(['GET']);
const DATA_SUFFIX = '/__data.json';
const ANONYMOUS_HUMAN_UNIQUE_LIMIT_10M = 24;
const ANONYMOUS_HUMAN_UNIQUE_LIMIT_1H = 60;
const ANONYMOUS_HUMAN_UNIQUE_LIMIT_24H = 120;

const SEARCH_PREVIEW_BOTS: BotDefinition<SearchPreviewBotName>[] = [
	{ name: 'Googlebot', pattern: /googlebot/i },
	{ name: 'Bingbot', pattern: /bingbot/i },
	{ name: 'DuckDuckBot', pattern: /duckduckbot/i },
	{ name: 'Applebot', pattern: /applebot/i },
	{ name: 'YandexBot', pattern: /yandex(bot)?/i },
	{ name: 'Twitterbot', pattern: /twitterbot/i },
	{ name: 'FacebookExternalHit', pattern: /facebookexternalhit/i },
	{ name: 'MetaWebIndexer', pattern: /meta-webindexer/i },
	{ name: 'Slackbot', pattern: /slackbot/i },
	{ name: 'LinkedInBot', pattern: /linkedinbot/i },
	{ name: 'Discordbot', pattern: /discordbot/i },
	{ name: 'WhatsApp', pattern: /whatsapp/i },
	{ name: 'TelegramBot', pattern: /telegrambot/i },
	{ name: 'OAI-SearchBot', pattern: /oai-searchbot/i },
	{ name: 'Claude-SearchBot', pattern: /claude-searchbot/i },
	{ name: 'PerplexityBot', pattern: /perplexitybot/i }
];

const USER_FETCH_BOTS: BotDefinition<UserFetchBotName>[] = [
	{ name: 'ChatGPT-User', pattern: /chatgpt-user/i },
	{ name: 'Claude-User', pattern: /claude-user/i },
	{ name: 'Perplexity-User', pattern: /perplexity-user/i },
	{ name: 'Meta-ExternalFetcher', pattern: /meta-externalfetcher/i }
];

const TRAINING_CRAWLERS: BotDefinition<TrainingCrawlerName>[] = [
	{ name: 'GPTBot', pattern: /gptbot/i },
	{ name: 'ClaudeBot', pattern: /claudebot/i },
	{ name: 'anthropic-ai', pattern: /anthropic-ai/i },
	{ name: 'CCBot', pattern: /\bccbot\b/i },
	{ name: 'Google-Extended', pattern: /google-extended/i },
	{ name: 'Applebot-Extended', pattern: /applebot-extended/i },
	{ name: 'Meta-ExternalAgent', pattern: /meta-externalagent/i }
];

const GENERIC_BOT_PATTERNS = [/\bbot\b/i, /\bcrawler\b/i, /\bspider\b/i, /\bscraper\b/i];

export function getProtectedContentPath(pathname: string): string | null {
	const normalizedPath = normalizePath(pathname);
	const segments = normalizedPath.split('/').filter(Boolean);

	if (segments.length === 0) {
		return null;
	}

	if (segments[0] === 'pop-culture' && segments.length === 2) {
		return normalizedPath;
	}

	if (segments[0] === 'community' && segments.length === 2) {
		return normalizedPath;
	}

	if (segments[0] === 'how-to-guides' && segments.length === 2) {
		return normalizedPath;
	}

	if (
		segments[0] === 'personality-analysis' &&
		segments.length === 2 &&
		segments[1] !== 'categories'
	) {
		return normalizedPath;
	}

	if (segments[0] === 'personality-analysis' && segments[1] === 'type' && segments.length === 3) {
		return normalizedPath;
	}

	if (
		segments[0] === 'enneagram-corner' &&
		segments.length === 2 &&
		segments[1] !== 'mental-health' &&
		segments[1] !== 'subtopic'
	) {
		return normalizedPath;
	}

	if (
		segments[0] === 'enneagram-corner' &&
		(segments[1] === 'mental-health' || segments[1] === 'subtopic') &&
		segments.length === 3
	) {
		return normalizedPath;
	}

	return null;
}

/**
 * Editorial routes whose server-rendered payload is intentionally identical
 * for every visitor. Authenticated header state is hydrated separately in the
 * browser, so these responses can use a short shared-cache policy.
 *
 * Personality analysis stays private because its answer gate and comments are
 * selected from the authenticated user or fingerprint on the server.
 */
export function getPublicEditorialCachePath(pathname: string): string | null {
	const protectedPath = getProtectedContentPath(pathname);

	if (!protectedPath || protectedPath.startsWith('/personality-analysis/')) {
		return null;
	}

	return protectedPath;
}

export function getHardBlockedReason({
	method,
	pathname,
	userAgent
}: ProtectedContentRequest): HardBlockedReason | null {
	if (!isInspectableContentRequest(method, pathname)) {
		return null;
	}

	const normalizedUserAgent = normalizeUserAgent(userAgent);

	if (!normalizedUserAgent) {
		return null;
	}

	if (matchBotDefinition(normalizedUserAgent, TRAINING_CRAWLERS)) {
		return 'disallowed_ai_training_crawler';
	}

	if (
		matchBotDefinition(normalizedUserAgent, SEARCH_PREVIEW_BOTS) ||
		matchBotDefinition(normalizedUserAgent, USER_FETCH_BOTS)
	) {
		return null;
	}

	if (matchesAny(normalizedUserAgent, GENERIC_BOT_PATTERNS)) {
		return 'unknown_bot_user_agent';
	}

	return null;
}

export function getContentRequester({
	method,
	pathname,
	userAgent,
	anonymousId,
	clientIp,
	isAuthenticated
}: ContentRequesterInput): ContentRequester | null {
	if (!isInspectableContentRequest(method, pathname)) {
		return null;
	}

	if (isAuthenticated) {
		return {
			kind: 'authenticated_human',
			name: 'authenticated_human'
		};
	}

	const normalizedUserAgent = normalizeUserAgent(userAgent);
	const trainingCrawler = matchBotDefinition(normalizedUserAgent, TRAINING_CRAWLERS);

	if (trainingCrawler) {
		return {
			kind: 'training_crawler',
			name: trainingCrawler.name
		};
	}

	const searchPreviewBot = matchBotDefinition(normalizedUserAgent, SEARCH_PREVIEW_BOTS);

	if (searchPreviewBot) {
		return {
			kind: 'search_preview_bot',
			name: searchPreviewBot.name
		};
	}

	const userFetchBot = matchBotDefinition(normalizedUserAgent, USER_FETCH_BOTS);

	if (userFetchBot) {
		return {
			kind: 'user_fetch_bot',
			name: userFetchBot.name
		};
	}

	if (!anonymousId) {
		const bootstrapActorKey = buildAnonymousBootstrapActorKey(clientIp, normalizedUserAgent);

		return {
			kind: 'anonymous_human',
			name: 'anonymous_human',
			actorKey: bootstrapActorKey,
			actorType: 'anonymous_human',
			anonymousId: bootstrapActorKey
		};
	}

	return {
		kind: 'anonymous_human',
		name: 'anonymous_human',
		actorKey: `anon:${anonymousId}`,
		actorType: 'anonymous_human',
		anonymousId
	};
}

export function isTrackableContentRequester(
	requester: ContentRequester | null
): requester is TrackableContentRequester {
	return requester?.kind === 'anonymous_human';
}

export function getContentResponseCacheControl(
	requester: ContentRequester | null,
	pathname?: string
): string {
	if (pathname && getPublicEditorialCachePath(pathname)) {
		return PUBLIC_EDITORIAL_CACHE_CONTROL;
	}

	return requester?.kind === 'search_preview_bot'
		? CONTENT_SEARCH_PREVIEW_CACHE_CONTROL
		: CONTENT_GUARD_CACHE_CONTROL;
}

export function getContentAccessDecision(
	_requester: TrackableContentRequester,
	counters: ContentAccessCounters
): ContentAccessDecision {
	if (counters.unique_10m > ANONYMOUS_HUMAN_UNIQUE_LIMIT_10M) {
		return {
			action: 'throttle',
			reason: 'anonymous_human_10m_unique_limit',
			retryAfterSeconds: 10 * 60
		};
	}

	if (counters.unique_1h > ANONYMOUS_HUMAN_UNIQUE_LIMIT_1H) {
		return {
			action: 'throttle',
			reason: 'anonymous_human_1h_unique_limit',
			retryAfterSeconds: 60 * 60
		};
	}

	if (counters.unique_24h > ANONYMOUS_HUMAN_UNIQUE_LIMIT_24H) {
		return {
			action: 'throttle',
			reason: 'anonymous_human_24h_unique_limit',
			retryAfterSeconds: 6 * 60 * 60
		};
	}

	return { action: 'allow' };
}

export function getContentRequestKind(pathname: string): ContentRequestKind {
	return pathname.endsWith(DATA_SUFFIX) ? 'data' : 'page';
}

export function createAnonymousContentAccessId(): string {
	return crypto.randomUUID();
}

function isInspectableContentRequest(method: string, pathname: string): boolean {
	return CONTENT_METHODS.has(method.toUpperCase()) && !!getProtectedContentPath(pathname);
}

function normalizePath(pathname: string): string {
	const withoutDataSuffix = pathname.endsWith(DATA_SUFFIX)
		? pathname.slice(0, -DATA_SUFFIX.length)
		: pathname;
	const trimmed = withoutDataSuffix.replace(/\/+$/, '');

	return trimmed.length === 0 ? '/' : trimmed;
}

function normalizeUserAgent(userAgent: string | null): string {
	return userAgent?.trim() ?? '';
}

function matchesAny(value: string, patterns: RegExp[]): boolean {
	return patterns.some((pattern) => pattern.test(value));
}

function matchBotDefinition<Name extends string>(
	value: string,
	definitions: BotDefinition<Name>[]
): BotDefinition<Name> | null {
	return definitions.find((definition) => definition.pattern.test(value)) ?? null;
}

function buildAnonymousBootstrapActorKey(clientIp: string | null, userAgent: string): string {
	const normalizedIp = clientIp?.trim() || 'unknown';
	const normalizedUserAgent = userAgent.trim() || 'unknown';
	const hash = createHash('sha256')
		.update(normalizedIp)
		.update('|')
		.update(normalizedUserAgent)
		.digest('hex')
		.slice(0, 24);

	return `bootstrap:${hash}`;
}
