// src/routes/error.spec.ts
// @vitest-environment jsdom

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

const { pageStore } = vi.hoisted(() => ({
	pageStore: {
		subscribe(run: (value: { status: number; error: { message: string } }) => void) {
			run({ status: 404, error: { message: 'Not found' } });
			return () => {};
		}
	}
}));

vi.mock('$app/stores', () => ({ page: pageStore }));

import ErrorPage from './+error.svelte';

describe('global error page', () => {
	it('offers clear, accessible recovery paths without placeholder copy', () => {
		const { container } = render(ErrorPage);

		expect(screen.getByRole('heading', { level: 1, name: 'That page is not here' })).toBeTruthy();
		expect(screen.getByRole('navigation', { name: 'Error recovery' })).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Go home' }).getAttribute('href')).toBe('/');
		expect(screen.getByRole('link', { name: 'Browse questions' }).getAttribute('href')).toBe(
			'/questions'
		);
		expect(screen.getByRole('link', { name: 'Search 9takes' }).getAttribute('href')).toBe(
			'/search'
		);
		expect(container.textContent).not.toContain('The 9takes questions??');
		expect(container.querySelector('main')).toBeNull();
	});
});
