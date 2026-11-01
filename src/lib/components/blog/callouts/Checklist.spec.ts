// src/lib/components/blog/callouts/Checklist.spec.ts
// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Checklist from './Checklist.svelte';

describe('Checklist', () => {
	afterEach(() => cleanup());

	it('marks an item checked when its box is ticked', async () => {
		render(Checklist, {
			props: { title: 'Are you a Six?', items: ['You plan for the worst', 'Loyalty matters'] }
		});

		const [first, second] = screen.getAllByRole('checkbox') as HTMLInputElement[];
		const row = (input: HTMLInputElement) => input.closest('.checklist__item');

		expect(row(first)?.classList.contains('checklist__item--checked')).toBe(false);

		await fireEvent.click(first);

		expect(first.checked).toBe(true);
		expect(row(first)?.classList.contains('checklist__item--checked')).toBe(true);
		expect(row(second)?.classList.contains('checklist__item--checked')).toBe(false);
	});
});
