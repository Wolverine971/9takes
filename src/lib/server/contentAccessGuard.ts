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
	| 'Twitterbot'
	| 'FacebookExternalHit'
	| 'Slackbot'
	| 'LinkedInBot'
	| 'Discordbot'
	| 'WhatsApp'
	| 'TelegramBot'
	| 'OAI-SearchBot'
	| 'Claude-SearchBot'
	| 'PerplexityBot';

export type UserFetchBotName = 'ChatGPT-User' | 'Claude-User' | 'Perplexity-User';
export type AllowedAiCrawlerName = 'GPTBot' | 'ClaudeBot' | 'CCBot';
export type HardBlockedReason = 'automated_http_client' | 'unknown_bot_user_agent';
export type ContentActorType = 'anonymous_human' | 'allowed_ai_crawler';
export type ContentRequestKind = 'page' | 'data';

export type ContentAccessCounters = {
	total_10m: number;
	unique_10m: number;
	total_1h: number;
	unique_1h: number;
	total_24h: number;
	unique_24h: number;
};

export type TrackableContentRequester =
	| {
			kind: 'anonymous_human';
			name: 'anonymous_human';
			actorKey: string;
			actorType: 'anonymous_human';
			anonymousId: string;
	  }
	| {
			kind: 'allowed_ai_crawler';
			name: AllowedAiCrawlerName;
			actorKey: string;
			actorType: 'allowed_ai_crawler';
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
	| TrackableContentRequester;

export type ContentAccessDecision =
	| { action: 'allow' }
	| {
			action: 'throttle';
			reason:
				| 'anonymous_human_10m_unique_limit'
				| 'anonymous_human_1h_unique_limit'
				| 'anonymous_human_24h_unique_limit'
				| 'allowed_ai_crawler_10m_unique_limit'
				| 'allowed_ai_crawler_10m_total_limit'
				| 'allowed_ai_crawler_24h_unique_limit'
				| 'allowed_ai_crawler_24h_total_limit';
			retryAfterSeconds: number;
	  };

export const CONTENT_GUARD_CACHE_CONTROL = 'private, no-store';
export const CONTENT_ACCESS_ANON_COOKIE_NAME = '9tanon';
export const CONTENT_ACCESS_ANON_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const CONTENT_METHODS = new Set(['GET', 'HEAD']);
const DATA_SUFFIX = '/__data.json';
const ANONYMOUS_HUMAN_UNIQUE_LIMIT_10M = 24;
const ANONYMOUS_HUMAN_UNIQUE_LIMIT_1H = 60;
const ANONYMOUS_HUMAN_UNIQUE_LIMIT_24H = 120;
const ALLOWED_AI_CRAWLER_UNIQUE_LIMIT_10M = 3;
const ALLOWED_AI_CRAWLER_TOTAL_LIMIT_10M = 4;
const ALLOWED_AI_CRAWLER_UNIQUE_LIMIT_24H = 5;
const ALLOWED_AI_CRAWLER_TOTAL_LIMIT_24H = 8;

const SEARCH_PREVIEW_BOTS: BotDefinition<SearchPreviewBotName>[] = [
	{ name: 'Googlebot', pattern: /googlebot/i },
	{ name: 'Bingbot', pattern: /bingbot/i },
	{ name: 'DuckDuckBot', pattern: /duckduckbot/i },
	{ name: 'Applebot', pattern: /applebot/i },
	{ name: 'Twitterbot', pattern: /twitterbot/i },
	{ name: 'FacebookExternalHit', pattern: /facebookexternalhit/i },
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
	{ name: 'Perplexity-User', pattern: /perplexity-user/i }
];

const ALLOWED_AI_CRAWLERS: BotDefinition<AllowedAiCrawlerName>[] = [
	{ name: 'GPTBot', pattern: /gptbot/i },
	{ name: 'ClaudeBot', pattern: /claudebot/i },
	{ name: 'CCBot', pattern: /\bccbot\b/i }
];

const AUTOMATED_HTTP_CLIENT_PATTERNS = [
	/\bcurl\b/i,
	/\bwget\b/i,
	/\bpython-requests\b/i,
	/\bpython-urllib\b/i,
	/\bhttpx\b/i,
	/\baiohttp\b/i,
	/\bgo-http-client\b/i,
	/\bokhttp\b/i,
	/\blibwww-perl\b/i,
	/\bnode-fetch\b/i,
	/\bundici\b/i,
	/\baxios\b/i,
	/\bscrapy\b/i
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

	if (
		matchBotDefinition(normalizedUserAgent, SEARCH_PREVIEW_BOTS) ||
		matchBotDefinition(normalizedUserAgent, USER_FETCH_BOTS) ||
		matchBotDefinition(normalizedUserAgent, ALLOWED_AI_CRAWLERS)
	) {
		return null;
	}

	if (matchesAny(normalizedUserAgent, AUTOMATED_HTTP_CLIENT_PATTERNS)) {
		return 'automated_http_client';
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

	const allowedAiCrawler = matchBotDefinition(normalizedUserAgent, ALLOWED_AI_CRAWLERS);

	if (allowedAiCrawler) {
		return {
			kind: 'allowed_ai_crawler',
			name: allowedAiCrawler.name,
			actorKey: `crawler:${allowedAiCrawler.name.toLowerCase()}`,
			actorType: 'allowed_ai_crawler'
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
	return requester?.kind === 'anonymous_human' || requester?.kind === 'allowed_ai_crawler';
}

export function getContentAccessDecision(
	requester: TrackableContentRequester,
	counters: ContentAccessCounters
): ContentAccessDecision {
	if (requester.kind === 'anonymous_human') {
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

	if (counters.unique_10m > ALLOWED_AI_CRAWLER_UNIQUE_LIMIT_10M) {
		return {
			action: 'throttle',
			reason: 'allowed_ai_crawler_10m_unique_limit',
			retryAfterSeconds: 60 * 60
		};
	}

	if (counters.total_10m > ALLOWED_AI_CRAWLER_TOTAL_LIMIT_10M) {
		return {
			action: 'throttle',
			reason: 'allowed_ai_crawler_10m_total_limit',
			retryAfterSeconds: 60 * 60
		};
	}

	if (counters.unique_24h > ALLOWED_AI_CRAWLER_UNIQUE_LIMIT_24H) {
		return {
			action: 'throttle',
			reason: 'allowed_ai_crawler_24h_unique_limit',
			retryAfterSeconds: 24 * 60 * 60
		};
	}

	if (counters.total_24h > ALLOWED_AI_CRAWLER_TOTAL_LIMIT_24H) {
		return {
			action: 'throttle',
			reason: 'allowed_ai_crawler_24h_total_limit',
			retryAfterSeconds: 24 * 60 * 60
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
