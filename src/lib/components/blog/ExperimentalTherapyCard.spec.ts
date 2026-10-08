// src/lib/components/blog/ExperimentalTherapyCard.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/analytics/marketingEvents', () => ({
	captureBetaInvite: vi.fn()
}));

import ExperimentalTherapyCard from './ExperimentalTherapyCard.svelte';

function ctaEvents(fetchMock: ReturnType<typeof vi.fn>) {
	return fetchMock.mock.calls
		.filter(([url]) => url === '/api/cta-event')
		.map(([, init]) => JSON.parse((init as RequestInit).body as string));
}

describe('ExperimentalTherapyCard', () => {
	let fetchMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		fetchMock = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })));
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('counts a tap on the button before the field is touched as opened', async () => {
		render(ExperimentalTherapyCard, { placement: 'rail', surface: 'celebrity' });

		await fireEvent.click(screen.getByRole('button'));

		expect(screen.getByRole('alert').textContent).toContain('valid email');
		expect(ctaEvents(fetchMock)).toEqual([
			expect.objectContaining({ experiment: 'beta_card_v1', event: 'opened', placement: 'rail' })
		]);
		expect(fetchMock.mock.calls.some(([url]) => url === '/api/beta-signup')).toBe(false);
	});

	it('reports opened once when the field is focused and the button tapped', async () => {
		render(ExperimentalTherapyCard, { placement: 'inline', surface: 'enneagram' });

		await fireEvent.focus(screen.getByLabelText('Email address'));
		await fireEvent.click(screen.getByRole('button'));

		expect(ctaEvents(fetchMock).filter((body) => body.event === 'opened')).toHaveLength(1);
	});
});
