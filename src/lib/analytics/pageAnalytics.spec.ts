// src/lib/analytics/pageAnalytics.spec.ts
import { describe, expect, it } from 'vitest';

import { classifyPath, normalizePath } from './pageAnalytics';

describe('page analytics path normalization', () => {
	it('canonicalizes personality analysis detail paths before tracking', () => {
		expect(normalizePath('/personality-analysis/Alex-Karp')).toBe(
			'/personality-analysis/alex-karp'
		);
		expect(normalizePath('/personality-analysis/Alex Karp?utm_source=x#bio')).toBe(
			'/personality-analysis/alex-karp'
		);

		expect(
			classifyPath('/personality-analysis/Alex-Karp', '/personality-analysis/[slug]')
		).toMatchObject({
			path: '/personality-analysis/alex-karp',
			pathGroup: '/personality-analysis/[slug]',
			contentType: 'people',
			contentSlug: 'alex-karp'
		});
	});

	it('does not collapse personality index subroutes into person detail pages', () => {
		expect(normalizePath('/personality-analysis/type/8')).toBe('/personality-analysis/type/8');
		expect(normalizePath('/personality-analysis/categories/tech-founders')).toBe(
			'/personality-analysis/categories/tech-founders'
		);
		expect(classifyPath('/personality-analysis/categories', null)).toMatchObject({
			pathGroup: '/personality-analysis/categories',
			contentSlug: null
		});
		expect(classifyPath('/personality-analysis/type', null)).toMatchObject({
			pathGroup: '/personality-analysis/type',
			contentSlug: null
		});
	});
});
