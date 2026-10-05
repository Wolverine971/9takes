// src/lib/components/blog/TableOfContents.spec.ts
// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { reducedMotion, replaceStateMock } = vi.hoisted(() => ({
	reducedMotion: { current: false },
	replaceStateMock: vi.fn()
}));

// jsdom has no matchMedia, which svelte/motion's MediaQuery calls at import.
vi.mock('svelte/motion', () => ({ prefersReducedMotion: reducedMotion }));
vi.mock('$app/navigation', () => ({ replaceState: replaceStateMock }));
vi.mock('$app/state', () => ({ page: { state: {} } }));

import TableOfContents from './TableOfContents.svelte';

function dispatchMousePointerEvent(element: Element, type: 'pointerover' | 'pointerout') {
	const event = new Event(type, { bubbles: true });
	Object.defineProperty(event, 'pointerType', { value: 'mouse' });
	element.dispatchEvent(event);
}

describe('TableOfContents title marquee', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
	});

	afterEach(() => {
		cleanup();
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('starts a seamless loop after 500ms only when the title is clipped', async () => {
		render(TableOfContents, {
			props: {
				contentStore: writable(''),
				headings: [
					{
						level: 2,
						id: 'long-heading',
						text: 'A deliberately long table of contents title that cannot fit'
					},
					{ level: 2, id: 'short-heading', text: 'Short title' }
				],
				renderMode: 'accordion-only'
			}
		});

		const longLink = screen.getByRole('link', {
			name: 'A deliberately long table of contents title that cannot fit'
		});
		const shortLink = screen.getByRole('link', { name: 'Short title' });

		Object.defineProperties(longLink, {
			clientWidth: { configurable: true, value: 160 },
			scrollWidth: { configurable: true, value: 340 }
		});
		Object.defineProperties(shortLink, {
			clientWidth: { configurable: true, value: 160 },
			scrollWidth: { configurable: true, value: 100 }
		});

		dispatchMousePointerEvent(longLink, 'pointerover');
		await vi.advanceTimersByTimeAsync(499);
		expect(longLink.classList.contains('toc-marquee-active')).toBe(false);

		await vi.advanceTimersByTimeAsync(1);
		expect(longLink.classList.contains('toc-marquee-active')).toBe(true);
		expect(longLink.querySelectorAll('.toc-link-marquee-copy')).toHaveLength(2);
		expect(longLink.querySelector('[aria-hidden="true"]')).not.toBeNull();

		dispatchMousePointerEvent(shortLink, 'pointerover');
		await vi.advanceTimersByTimeAsync(500);
		expect(shortLink.classList.contains('toc-marquee-active')).toBe(false);

		dispatchMousePointerEvent(longLink, 'pointerout');
		expect(longLink.classList.contains('toc-marquee-active')).toBe(false);
		expect(longLink.textContent).toBe(
			'A deliberately long table of contents title that cannot fit'
		);
		expect(longLink.getAttribute('title')).toBe(
			'A deliberately long table of contents title that cannot fit'
		);
	});
});

describe('TableOfContents link activation', () => {
	afterEach(() => {
		cleanup();
		document.body.innerHTML = '';
		reducedMotion.current = false;
		replaceStateMock.mockReset();
		vi.restoreAllMocks();
	});

	it('moves focus to the target heading, syncs the hash, and honors reduced motion', async () => {
		reducedMotion.current = true;
		const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

		const article = document.createElement('article');
		article.innerHTML = '<h2 id="first">First</h2><h2 id="second">Second</h2>';
		document.body.appendChild(article);

		render(TableOfContents, {
			props: {
				contentStore: writable(''),
				headings: [
					{ level: 2, id: 'first', text: 'First' },
					{ level: 2, id: 'second', text: 'Second' }
				],
				renderMode: 'accordion-only'
			}
		});

		const details = document.querySelector('details.toc-accordion') as HTMLDetailsElement;
		details.open = true;
		const link = screen.getByRole('link', { name: 'Second' });
		link.focus();

		await fireEvent.click(link);

		const heading = document.getElementById('second') as HTMLElement;
		expect(document.activeElement).toBe(heading);
		expect(heading.getAttribute('tabindex')).toBe('-1');
		expect(replaceStateMock).toHaveBeenCalledWith('#second', {});
		expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }));
		// jsdom's innerWidth (1024) is below the desktop breakpoint: accordion collapses.
		expect(details.open).toBe(false);

		heading.blur();
		expect(heading.hasAttribute('tabindex')).toBe(false);
	});
});
