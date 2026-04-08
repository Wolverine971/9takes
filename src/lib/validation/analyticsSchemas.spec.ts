// src/lib/validation/analyticsSchemas.spec.ts
import { describe, expect, it } from 'vitest';

import { ANALYTICS_MAX_DELTA_MS } from '$lib/analytics/pageAnalytics';
import { pageExitSchema, pagePingSchema, pageViewSchema } from './analyticsSchemas';

describe('analyticsSchemas', () => {
	it('accepts page-view payloads with first-touch attribution fields', () => {
		expect(
			pageViewSchema.parse({
				visit_key: '550e8400-e29b-41d4-a716-446655440000',
				session_key: 'session-123',
				fingerprint: 'visitor-123',
				path: '/personality-analysis/john-doe',
				route_id: '/personality-analysis/[slug]',
				path_group: '/personality-analysis/[slug]',
				content_type: 'people',
				content_slug: 'john-doe',
				referrer_host: 'www.google.com',
				landing_query: 'utm_source=reddit&utm_medium=social',
				utm_source: 'reddit',
				utm_medium: 'social',
				utm_campaign: 'launch',
				utm_term: 'enneagram',
				utm_content: 'hero',
				click_id_type: 'gclid',
				click_id_value: 'abc123'
			})
		).toEqual({
			visit_key: '550e8400-e29b-41d4-a716-446655440000',
			session_key: 'session-123',
			fingerprint: 'visitor-123',
			path: '/personality-analysis/john-doe',
			route_id: '/personality-analysis/[slug]',
			path_group: '/personality-analysis/[slug]',
			content_type: 'people',
			content_slug: 'john-doe',
			referrer_host: 'www.google.com',
			landing_query: 'utm_source=reddit&utm_medium=social',
			utm_source: 'reddit',
			utm_medium: 'social',
			utm_campaign: 'launch',
			utm_term: 'enneagram',
			utm_content: 'hero',
			click_id_type: 'gclid',
			click_id_value: 'abc123'
		});
	});

	it('accepts ping payloads up to the configured max engaged delta', () => {
		expect(
			pagePingSchema.parse({
				visit_key: '550e8400-e29b-41d4-a716-446655440000',
				engaged_ms_delta: ANALYTICS_MAX_DELTA_MS,
				max_scroll_pct: 62
			})
		).toEqual({
			visit_key: '550e8400-e29b-41d4-a716-446655440000',
			engaged_ms_delta: ANALYTICS_MAX_DELTA_MS,
			max_scroll_pct: 62
		});
	});

	it('rejects ping payloads above the configured max engaged delta', () => {
		expect(() =>
			pagePingSchema.parse({
				visit_key: '550e8400-e29b-41d4-a716-446655440000',
				engaged_ms_delta: ANALYTICS_MAX_DELTA_MS + 1
			})
		).toThrow();
	});

	it('reuses the same engaged delta limit for page exits', () => {
		expect(
			pageExitSchema.parse({
				visit_key: '550e8400-e29b-41d4-a716-446655440000',
				engaged_ms_delta: ANALYTICS_MAX_DELTA_MS,
				max_scroll_pct: 80,
				ended_at: '2026-03-29T12:00:00.000Z',
				is_exit: true
			})
		).toEqual({
			visit_key: '550e8400-e29b-41d4-a716-446655440000',
			engaged_ms_delta: ANALYTICS_MAX_DELTA_MS,
			max_scroll_pct: 80,
			ended_at: '2026-03-29T12:00:00.000Z',
			is_exit: true
		});
	});
});
