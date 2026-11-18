// src/lib/utils/backNavigation.spec.ts
import { describe, expect, it } from 'vitest';
import { getBackNavParent, getBackNavSteps } from './backNavigation';

describe('getBackNavSteps', () => {
	it('lists ancestors nearest last', () => {
		expect(getBackNavSteps('/personality-analysis/stella-lefty')).toEqual([
			{ name: 'personality analysis', url: '/personality-analysis' }
		]);
	});

	it('drops type/subtopic segments outside admin', () => {
		expect(getBackNavSteps('/personality-analysis/type/9')).toEqual([
			{ name: 'personality analysis', url: '/personality-analysis' }
		]);
	});
});

describe('getBackNavParent', () => {
	it('points a personality page at the hub', () => {
		expect(getBackNavParent('/personality-analysis/stella-lefty')?.url).toBe(
			'/personality-analysis'
		);
	});

	it.each([
		'/',
		'/questions',
		'/admin/users',
		'/questions/some-question',
		'/questions/categories/x'
	])('hides the arrow on %s', (pathname) => {
		expect(getBackNavParent(pathname)).toBeNull();
	});

	it('keeps the arrow on question create', () => {
		expect(getBackNavParent('/questions/create')?.url).toBe('/questions');
	});
});
