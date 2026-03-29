// src/lib/stores/theme.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = '9takes-theme';

function getInitialTheme(): ThemePreference {
	if (!browser) return 'system';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	return 'system';
}

function getEffectiveTheme(preference: ThemePreference): 'light' | 'dark' {
	if (preference !== 'system') return preference;
	if (!browser) return 'dark';
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export const themePreference = writable<ThemePreference>(getInitialTheme());

export function applyTheme(preference: ThemePreference) {
	if (!browser) return;
	const effective = getEffectiveTheme(preference);
	const root = document.documentElement;

	root.classList.toggle('light', effective === 'light');
	root.classList.toggle('dark', effective === 'dark');
	root.dataset.theme = effective;
	root.style.colorScheme = effective;

	localStorage.setItem(STORAGE_KEY, preference);

	// Update meta tags
	const themeColor = effective === 'light' ? '#FAFAF9' : '#0C0A09';
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) meta.setAttribute('content', themeColor);

	const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
	if (colorSchemeMeta) colorSchemeMeta.setAttribute('content', 'dark light');
}

/** Cycle through: system → light → dark → system */
export function cycleTheme(current: ThemePreference): ThemePreference {
	if (current === 'system') return 'light';
	if (current === 'light') return 'dark';
	return 'system';
}
