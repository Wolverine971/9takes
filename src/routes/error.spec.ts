// src/routes/error.spec.ts
// @vitest-environment jsdom

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

const { pageState, updatedState } = vi.hoisted(() => ({
	pageState: { status: 404, error: { message: 'Not found' } },
	updatedState: { current: false, check: async () => false }
}));

vi.mock('$app/state', () => ({ page: pageState, updated: updatedState }));

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
