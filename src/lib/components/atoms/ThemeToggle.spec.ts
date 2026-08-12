// src/lib/components/atoms/ThemeToggle.spec.ts
// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: false }));

import { themePreference } from '$lib/stores/theme';
import ThemeToggle from './ThemeToggle.svelte';

describe('ThemeToggle', () => {
	afterEach(() => {
		cleanup();
		themePreference.set('dark');
	});

	it('toggles directly between dark and light modes', async () => {
		themePreference.set('dark');
		render(ThemeToggle);

		const toggle = screen.getByRole('button', { name: 'Switch to light mode' });
		await fireEvent.click(toggle);

		expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBe(toggle);
		await fireEvent.click(toggle);

		expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBe(toggle);
	});
});
