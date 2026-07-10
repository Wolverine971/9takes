// src/lib/server/contentAccessGuard.spec.ts
import { describe, expect, it } from 'vitest';
import {
	CONTENT_ACCESS_ANON_COOKIE_NAME,
	CONTENT_GUARD_CACHE_CONTROL,
	CONTENT_SEARCH_PREVIEW_CACHE_CONTROL,
	PUBLIC_EDITORIAL_CACHE_CONTROL,
	createAnonymousContentAccessId,
	getContentAccessDecision,
	getContentRequestKind,
	getContentResponseCacheControl,
	getContentRequester,
	getHardBlockedReason,
	getProtectedContentPath,
	getPublicEditorialCachePath,
	isTrackableContentRequester
} from './contentAccessGuard';

describe('contentAccessGuard', () => {
	it('normalizes protected article paths and SvelteKit data requests', () => {
		expect(getProtectedContentPath('/pop-culture/breaking-points-enneagram-analysis')).toBe(
			'/pop-culture/breaking-points-enneagram-analysis'
		);
		expect(
			getProtectedContentPath('/pop-culture/breaking-points-enneagram-analysis/__data.json')
		).toBe('/pop-culture/breaking-points-enneagram-analysis');
		expect(getProtectedContentPath('/pop-culture')).toBeNull();
		expect(getContentRequestKind('/pop-culture/post/__data.json')).toBe('data');
	});

	it('separates cacheable editorial routes from personalized personality pages', () => {
		expect(getPublicEditorialCachePath('/community/kantian-filters-and-nine-perspectives')).toBe(
			'/community/kantian-filters-and-nine-perspectives'
		);
		expect(
			getPublicEditorialCachePath('/enneagram-corner/mental-health/types-and-anxiety/__data.json')
		).toBe('/enneagram-corner/mental-health/types-and-anxiety');
		expect(getPublicEditorialCachePath('/personality-analysis/scott-galloway')).toBeNull();
		expect(getPublicEditorialCachePath('/personality-analysis/type/enneagram-type-5')).toBeNull();
		expect(getPublicEditorialCachePath('/community')).toBeNull();
	});

	it('allows named AI crawlers while still classifying them for tracking', () => {
		expect(
			getHardBlockedReason({
				method: 'GET',
				pathname: '/enneagram-corner/enneagram-type-9',
				userAgent: 'GPTBot/1.0'
			})
		).toBeNull();

		const requester = getContentRequester({
			method: 'GET',
			pathname: '/enneagram-corner/enneagram-type-9',
			userAgent: 'ClaudeBot/1.0',
			clientIp: '203.0.113.1',
			anonymousId: null,
			isAuthenticated: false
		});

		expect(requester).toEqual({
			kind: 'allowed_ai_crawler',
			name: 'ClaudeBot',
			actorKey: 'crawler:claudebot',
			actorType: 'allowed_ai_crawler'
		});
		expect(isTrackableContentRequester(requester)).toBe(true);
	});

	it('allows Google-Extended when AI crawling is enabled', () => {
		expect(
			getHardBlockedReason({
				method: 'GET',
				pathname: '/personality-analysis/scott-galloway',
				userAgent: 'Google-Extended/1.0'
			})
		).toBeNull();
	});

	it('classifies Meta-WebIndexer as an allowed AI crawler', () => {
		expect(
			getHardBlockedReason({
				method: 'GET',
				pathname: '/personality-analysis/jennifer-lopez',
				userAgent:
					'meta-webindexer/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)'
			})
		).toBeNull();

		const requester = getContentRequester({
			method: 'GET',
			pathname: '/personality-analysis/jennifer-lopez',
			userAgent:
				'meta-webindexer/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)',
			clientIp: '57.141.4.57',
			anonymousId: null,
			isAuthenticated: false
		});

		expect(requester).toEqual({
			kind: 'allowed_ai_crawler',
			name: 'Meta-WebIndexer',
			actorKey: 'crawler:meta-webindexer',
			actorType: 'allowed_ai_crawler'
		});
	});

	it('allows Meta external sharing crawler as a search preview bot', () => {
		const userAgent =
			'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)';

		expect(
			getHardBlockedReason({
				method: 'GET',
				pathname: '/personality-analysis/jake-shane',
				userAgent
			})
		).toBeNull();

		const requester = getContentRequester({
			method: 'GET',
			pathname: '/personality-analysis/jake-shane',
			userAgent,
			clientIp: '57.141.0.15',
			anonymousId: null,
			isAuthenticated: false
		});

		expect(requester).toEqual({
			kind: 'search_preview_bot',
			name: 'MetaExternalAgent'
		});
	});

	it('does not block HEAD requests used by audits and link checks', () => {
		expect(
			getHardBlockedReason({
				method: 'HEAD',
				pathname: '/personality-analysis/scott-galloway',
				userAgent: 'curl/8.7.1'
			})
		).toBeNull();
	});

	it('allows plain HTTP clients but blocks unknown bot user agents', () => {
		expect(
			getHardBlockedReason({
				method: 'GET',
				pathname: '/community/kantian-filters-and-nine-perspectives',
				userAgent: 'curl/8.7.1'
			})
		).toBeNull();
		expect(
			getHardBlockedReason({
				method: 'GET',
				pathname: '/community/kantian-filters-and-nine-perspectives',
				userAgent: 'crawler/1.0'
			})
		).toBe('unknown_bot_user_agent');
	});

	it('treats normal anonymous browsers as trackable humans', () => {
		const anonymousId = createAnonymousContentAccessId();
		const requester = getContentRequester({
			method: 'GET',
			pathname: '/personality-analysis/scott-galloway',
			userAgent: 'Mozilla/5.0',
			clientIp: '203.0.113.9',
			anonymousId,
			isAuthenticated: false
		});

		expect(requester).toEqual({
			kind: 'anonymous_human',
			name: 'anonymous_human',
			actorKey: `anon:${anonymousId}`,
			actorType: 'anonymous_human',
			anonymousId
		});
		expect(isTrackableContentRequester(requester)).toBe(true);
	});

	it('does not throttle anonymous humans for a small number of article reads', () => {
		const requester = getContentRequester({
			method: 'GET',
			pathname: '/how-to-guides/article-1',
			userAgent: 'Mozilla/5.0',
			clientIp: '203.0.113.10',
			anonymousId: 'anon-123',
			isAuthenticated: false
		});

		if (!requester || !isTrackableContentRequester(requester)) {
			throw new Error('Expected anonymous human requester');
		}

		expect(
			getContentAccessDecision(requester, {
				total_10m: 5,
				unique_10m: 5,
				total_1h: 12,
				unique_1h: 12,
				total_24h: 20,
				unique_24h: 20
			})
		).toEqual({ action: 'allow' });
	});

	it('throttles anonymous humans only after high unique-page volume', () => {
		const requester = getContentRequester({
			method: 'GET',
			pathname: '/how-to-guides/article-1',
			userAgent: 'Mozilla/5.0',
			clientIp: '203.0.113.10',
			anonymousId: 'anon-123',
			isAuthenticated: false
		});

		if (!requester || !isTrackableContentRequester(requester)) {
			throw new Error('Expected anonymous human requester');
		}

		expect(
			getContentAccessDecision(requester, {
				total_10m: 25,
				unique_10m: 25,
				total_1h: 25,
				unique_1h: 25,
				total_24h: 25,
				unique_24h: 25
			})
		).toEqual({
			action: 'throttle',
			reason: 'anonymous_human_10m_unique_limit',
			retryAfterSeconds: 600
		});
	});

	it('throttles allowed AI crawlers only after large daily crawl volume', () => {
		const requester = getContentRequester({
			method: 'GET',
			pathname: '/pop-culture/tech-titans-ai-wars',
			userAgent: 'GPTBot/1.0',
			clientIp: '203.0.113.11',
			anonymousId: null,
			isAuthenticated: false
		});

		if (!requester || !isTrackableContentRequester(requester)) {
			throw new Error('Expected allowed AI crawler requester');
		}

		expect(
			getContentAccessDecision(requester, {
				total_10m: 555,
				unique_10m: 555,
				total_1h: 900,
				unique_1h: 555,
				total_24h: 1501,
				unique_24h: 555
			})
		).toEqual({
			action: 'throttle',
			reason: 'allowed_ai_crawler_24h_total_limit',
			retryAfterSeconds: 86400
		});
	});

	it('allows one complete pass over the current protected sitemap corpus', () => {
		const requester = getContentRequester({
			method: 'GET',
			pathname: '/pop-culture/tech-titans-ai-wars',
			userAgent: 'GPTBot/1.0',
			clientIp: '203.0.113.11',
			anonymousId: null,
			isAuthenticated: false
		});

		if (!requester || !isTrackableContentRequester(requester)) {
			throw new Error('Expected allowed AI crawler requester');
		}

		expect(
			getContentAccessDecision(requester, {
				total_10m: 555,
				unique_10m: 555,
				total_1h: 555,
				unique_1h: 555,
				total_24h: 555,
				unique_24h: 555
			})
		).toEqual({ action: 'allow' });
	});

	it('exports the expected cookie name and cache policy', () => {
		expect(CONTENT_ACCESS_ANON_COOKIE_NAME).toBe('9tanon');
		expect(CONTENT_GUARD_CACHE_CONTROL).toBe('private, no-store');
		expect(CONTENT_SEARCH_PREVIEW_CACHE_CONTROL).toContain('s-maxage=3600');
		expect(PUBLIC_EDITORIAL_CACHE_CONTROL).toContain('stale-while-revalidate=86400');
	});

	it('uses crawl-friendly cache headers only for search preview bots', () => {
		const googlebot = getContentRequester({
			method: 'GET',
			pathname: '/personality-analysis/scott-galloway',
			userAgent: 'Googlebot/2.1',
			clientIp: '66.249.66.1',
			anonymousId: null,
			isAuthenticated: false
		});
		const human = getContentRequester({
			method: 'GET',
			pathname: '/personality-analysis/scott-galloway',
			userAgent: 'Mozilla/5.0',
			clientIp: '203.0.113.20',
			anonymousId: 'anon-456',
			isAuthenticated: false
		});
		const aiCrawler = getContentRequester({
			method: 'GET',
			pathname: '/personality-analysis/scott-galloway',
			userAgent: 'GPTBot/1.0',
			clientIp: '203.0.113.21',
			anonymousId: null,
			isAuthenticated: false
		});
		const authenticatedGooglebot = getContentRequester({
			method: 'GET',
			pathname: '/personality-analysis/scott-galloway',
			userAgent: 'Googlebot/2.1',
			clientIp: '203.0.113.22',
			anonymousId: null,
			isAuthenticated: true
		});

		expect(getContentResponseCacheControl(googlebot)).toBe(CONTENT_SEARCH_PREVIEW_CACHE_CONTROL);
		expect(getContentResponseCacheControl(human)).toBe(CONTENT_GUARD_CACHE_CONTROL);
		expect(getContentResponseCacheControl(aiCrawler)).toBe(CONTENT_GUARD_CACHE_CONTROL);
		expect(getContentResponseCacheControl(authenticatedGooglebot)).toBe(
			CONTENT_GUARD_CACHE_CONTROL
		);
		expect(
			getContentResponseCacheControl(human, '/community/kantian-filters-and-nine-perspectives')
		).toBe(PUBLIC_EDITORIAL_CACHE_CONTROL);
		expect(getContentResponseCacheControl(human, '/personality-analysis/scott-galloway')).toBe(
			CONTENT_GUARD_CACHE_CONTROL
		);
	});

	it('uses a stable bootstrap key when no anon cookie exists yet', () => {
		const firstRequester = getContentRequester({
			method: 'GET',
			pathname: '/community/kantian-filters-and-nine-perspectives',
			userAgent: 'Mozilla/5.0',
			clientIp: '198.51.100.10',
			anonymousId: null,
			isAuthenticated: false
		});
		const secondRequester = getContentRequester({
			method: 'GET',
			pathname: '/community/fear-triad-intellectual-fortress-or-prison',
			userAgent: 'Mozilla/5.0',
			clientIp: '198.51.100.10',
			anonymousId: null,
			isAuthenticated: false
		});

		expect(firstRequester).not.toBeNull();
		expect(secondRequester).not.toBeNull();
		if (!firstRequester || !secondRequester) {
			throw new Error('Expected bootstrap requesters');
		}
		if (firstRequester.kind !== 'anonymous_human' || secondRequester.kind !== 'anonymous_human') {
			throw new Error('Expected anonymous human requesters');
		}

		expect(firstRequester.actorKey).toBe(secondRequester.actorKey);
		expect(firstRequester.actorKey.startsWith('bootstrap:')).toBe(true);
	});
});
