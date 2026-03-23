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

	it('blocks generic bot user agents and scraping clients', () => {
		expect(
			getHardBlockedReason({
				method: 'GET',
				pathname: '/community/kantian-filters-and-nine-perspectives',
				userAgent: 'curl/8.7.1'
			})
		).toBe('automated_http_client');
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

	it('throttles allowed AI crawlers after the sixth unique article in a day', () => {
		const requester = getContentRequester({
			method: 'GET',
			pathname: '/pop-culture/tech-titans-ai-wars',
			userAgent: 'GPTBot/1.0',
			anonymousId: null,
			isAuthenticated: false
		});

		if (!requester || !isTrackableContentRequester(requester)) {
			throw new Error('Expected allowed AI crawler requester');
		}

		expect(
			getContentAccessDecision(requester, {
				total_10m: 4,
				unique_10m: 3,
				total_1h: 6,
				unique_1h: 5,
				total_24h: 6,
				unique_24h: 6
			})
		).toEqual({
			action: 'throttle',
			reason: 'allowed_ai_crawler_24h_unique_limit',
			retryAfterSeconds: 86400
		});
	});

	it('exports the expected cookie name and cache policy', () => {
		expect(CONTENT_ACCESS_ANON_COOKIE_NAME).toBe('9tanon');
		expect(CONTENT_GUARD_CACHE_CONTROL).toBe('private, no-store');
	});
});
