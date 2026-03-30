// src/lib/validation/analyticsSchemas.spec.ts
import { describe, expect, it } from 'vitest';

import { ANALYTICS_MAX_DELTA_MS } from '$lib/analytics/pageAnalytics';
import { pageExitSchema, pagePingSchema } from './analyticsSchemas';

describe('analyticsSchemas', () => {
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
