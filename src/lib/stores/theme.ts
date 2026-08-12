// src/lib/stores/theme.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ThemePreference = 'light' | 'dark';

const STORAGE_KEY = '9takes-theme';

function getInitialTheme(): ThemePreference {
	if (!browser) return 'dark';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	return typeof window.matchMedia === 'function' &&
		window.matchMedia('(prefers-color-scheme: light)').matches
		? 'light'
		: 'dark';
}

export const themePreference = writable<ThemePreference>(getInitialTheme());

export function applyTheme(preference: ThemePreference) {
	if (!browser) return;
	const root = document.documentElement;

	root.classList.toggle('light', preference === 'light');
	root.classList.toggle('dark', preference === 'dark');
	root.dataset.theme = preference;
	root.style.colorScheme = preference;

	localStorage.setItem(STORAGE_KEY, preference);

	// Update meta tags
	const themeColor = preference === 'light' ? '#FAFAF9' : '#0C0A09';
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) meta.setAttribute('content', themeColor);

	const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
	if (colorSchemeMeta) colorSchemeMeta.setAttribute('content', 'dark light');
}

/** Toggle directly between the two visible themes. */
export function cycleTheme(current: ThemePreference): ThemePreference {
	return current === 'light' ? 'dark' : 'light';
}
