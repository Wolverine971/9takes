// src/lib/components/blog/EnneagramCTASidebar.spec.ts
// @vitest-environment jsdom

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

const { pageStore } = vi.hoisted(() => ({
	pageStore: {
		subscribe(run: (value: { url: URL }) => void) {
			run({ url: new URL('https://9takes.com/enneagram-corner/enneagram-and-mental-illness') });
			return () => {};
		}
	}
}));

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/stores', () => ({ page: pageStore }));
vi.mock('$lib/analytics/marketingEvents', () => ({ captureEmailSignupCompleted: vi.fn() }));

import EnneagramCTASidebar from './EnneagramCTASidebar.svelte';

describe('EnneagramCTASidebar', () => {
	it('renders the page-inferred copy (title, body, button) on first render', () => {
		render(EnneagramCTASidebar, { variant: 'embedded' });

		expect(screen.getByRole('heading', { name: 'Get Enneagram notes' })).toBeTruthy();
		expect(screen.getByText(/Short guides on type patterns/)).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Send it to me' })).toBeTruthy();
		expect(document.body.textContent).not.toContain('undefined');
	});

	it('prefers explicit copy over the inferred copy', () => {
		render(EnneagramCTASidebar, {
			variant: 'embedded',
			ctaTitle: 'Custom title',
			ctaCopy: 'Custom copy',
			ctaButtonLabel: 'Custom button'
		});

		expect(screen.getByRole('heading', { name: 'Custom title' })).toBeTruthy();
		expect(screen.getByText('Custom copy')).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Custom button' })).toBeTruthy();
	});
});
