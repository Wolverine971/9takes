// src/lib/stores/theme.svelte.ts
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

// Shared app-wide theme. The server never writes it (only click handlers do), so it can't leak
// between requests: server renders always see the 'dark' default.
class ThemeState {
	preference = $state<ThemePreference>(getInitialTheme());

	/** Switch the theme and apply it to the document (classes, storage, meta tags). */
	set(next: ThemePreference) {
		this.preference = next;
		applyTheme(next);
	}
}

export const theme = new ThemeState();

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
