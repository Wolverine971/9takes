// src/lib/server/contentAccessGuard.spec.ts
import { describe, expect, it } from 'vitest';
import {
	CONTENT_ACCESS_ANON_COOKIE_NAME,
	CONTENT_GUARD_CACHE_CONTROL,
	createAnonymousContentAccessId,
	getContentAccessDecision,
	getContentRequestKind,
	getContentRequester,
	getHardBlockedReason,
	getProtectedContentPath,
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
				total_10m: 80,
				unique_10m: 40,
				total_1h: 120,
				unique_1h: 90,
				total_24h: 1001,
				unique_24h: 450
			})
		).toEqual({
			action: 'throttle',
			reason: 'allowed_ai_crawler_24h_total_limit',
			retryAfterSeconds: 86400
		});
	});

	it('exports the expected cookie name and cache policy', () => {
		expect(CONTENT_ACCESS_ANON_COOKIE_NAME).toBe('9tanon');
		expect(CONTENT_GUARD_CACHE_CONTROL).toBe('private, no-store');
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
