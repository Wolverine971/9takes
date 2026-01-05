// src/lib/stores/viewport.ts
// Shared viewport store to eliminate redundant resize listeners across components

import { readable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface ViewportDimensions {
	width: number;
	height: number;
}

/**
 * Shared viewport store that provides window dimensions.
 * Uses a single resize listener instead of each component having its own.
 */
export const viewport = readable<ViewportDimensions>({ width: 0, height: 0 }, (set) => {
	if (!browser) return;

	const update = () => {
		set({
			width: window.innerWidth,
			height: window.innerHeight
		});
	};

	// Initial update
	update();

	// Throttled resize handler for better performance
	let rafId: number | null = null;
	const handleResize = () => {
		if (rafId) return;
		rafId = requestAnimationFrame(() => {
			update();
			rafId = null;
		});
	};

	window.addEventListener('resize', handleResize, { passive: true });

	return () => {
		window.removeEventListener('resize', handleResize);
		if (rafId) cancelAnimationFrame(rafId);
	};
});

/**
 * Derived store for common viewport breakpoints
 */
export const viewportBreakpoints = derived(viewport, ($viewport) => ({
	isMobile: $viewport.width < 576,
	isTablet: $viewport.width >= 576 && $viewport.width < 1024,
	isDesktop: $viewport.width >= 1024,
	isLargeDesktop: $viewport.width >= 1440,
	// Specific breakpoints used in the codebase
	isAbove400: $viewport.width > 400,
	isAbove500: $viewport.width > 500,
	isAbove576: $viewport.width > 576,
	isAbove768: $viewport.width > 768,
	isAbove1024: $viewport.width > 1024
}));

/**
 * Get just the width for simpler reactivity
 */
export const viewportWidth = derived(viewport, ($viewport) => $viewport.width);
