// src/lib/components/marketing/TimeMirror.spec.ts
// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { reducedMotion } = vi.hoisted(() => ({
	reducedMotion: { current: false }
}));

vi.mock('svelte/motion', () => ({
	prefersReducedMotion: reducedMotion
}));

import TimeMirror from './TimeMirror.svelte';

describe('TimeMirror', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		reducedMotion.current = false;
	});

	afterEach(() => {
		cleanup();
		vi.useRealTimers();
	});

	it('advances immediately when clicked instead of pausing', async () => {
		render(TimeMirror);

		const frame = screen.getByRole('button', { name: /showing nine modern people/i });
		expect(frame.dataset.era).toBe('modern');

		await fireEvent.click(frame);

		expect(frame.dataset.era).toBe('ancient');
		expect(frame.getAttribute('aria-label')).toMatch(/activate to show nine modern people/i);
	});

	it('advances automatically every six seconds and resets the cadence after a click', async () => {
		render(TimeMirror);

		const frame = screen.getByRole('button', { name: /showing nine modern people/i });

		await vi.advanceTimersByTimeAsync(3000);
		await fireEvent.click(frame);
		expect(frame.dataset.era).toBe('ancient');

		await vi.advanceTimersByTimeAsync(5999);
		expect(frame.dataset.era).toBe('ancient');

		await vi.advanceTimersByTimeAsync(1);
		await tick();
		expect(frame.dataset.era).toBe('modern');
	});

	it('holds on mouse hover and resumes a full cadence after the pointer leaves', async () => {
		render(TimeMirror);

		const frame = screen.getByRole('button', { name: /showing nine modern people/i });
		const pointerEnter = new Event('pointerenter');
		Object.defineProperty(pointerEnter, 'pointerType', { value: 'mouse' });
		frame.dispatchEvent(pointerEnter);
		await tick();

		await vi.advanceTimersByTimeAsync(12000);
		expect(frame.dataset.era).toBe('modern');

		const pointerLeave = new Event('pointerleave');
		Object.defineProperty(pointerLeave, 'pointerType', { value: 'mouse' });
		frame.dispatchEvent(pointerLeave);
		await tick();

		await vi.advanceTimersByTimeAsync(6000);
		await tick();
		expect(frame.dataset.era).toBe('ancient');
	});

	it('disables autoplay but keeps manual switching when reduced motion is enabled', async () => {
		reducedMotion.current = true;
		render(TimeMirror);

		const frame = screen.getByRole('button', { name: /showing nine modern people/i });

		await vi.advanceTimersByTimeAsync(12000);
		expect(frame.dataset.era).toBe('modern');

		await fireEvent.click(frame);
		expect(frame.dataset.era).toBe('ancient');
		expect(frame.getAttribute('aria-label')).toMatch(/automatic transitions are off/i);
	});
});
