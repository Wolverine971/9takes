// src/lib/components/atoms/PopCard.spec.ts
// @vitest-environment jsdom

import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: false }));

import PopCard from './PopCard.svelte';

const base = { image: '/blogs/test.webp', displayText: 'Test Person', scramble: false };

function card(container: HTMLElement) {
	return container.querySelector('.image-card-base') as HTMLElement;
}

describe('PopCard', () => {
	beforeEach(() => {
		// jsdom has no Web Animations API; the title's fly-in transition needs one.
		Element.prototype.animate = vi.fn(() => {
			const animation = {
				cancel: vi.fn(),
				currentTime: 0,
				playState: 'finished',
				set onfinish(handler: Animation['onfinish']) {
					queueMicrotask(() => handler?.call(animation as unknown as Animation, {} as never));
				}
			};
			return animation as unknown as Animation;
		});
	});

	afterEach(() => {
		cleanup();
		document.body.innerHTML = '';
	});

	it('is a plain, unfocusable card when it has no overlay to reveal', async () => {
		const { container } = render(PopCard, base);
		await tick();

		expect(card(container).getAttribute('role')).toBeNull();
		expect(card(container).getAttribute('tabindex')).toBeNull();
	});

	it('leaves keyboard control to the link when it sits inside one', async () => {
		const link = document.createElement('a');
		link.href = '/enneagram-corner/enneagram-type-4';
		document.body.append(link);

		const { container } = render(PopCard, { target: link, props: { ...base, enneagramType: 4 } });
		await tick();

		expect(card(container).getAttribute('role')).toBeNull();
		expect(card(container).getAttribute('tabindex')).toBeNull();

		// Focusing the link reveals the overlay, the same as hovering the card.
		const overlay = container.querySelector('.enneagram-overlay') as HTMLElement;
		expect(overlay.classList.contains('enneagram-overlay--visible')).toBe(false);
		await fireEvent.focusIn(link);
		expect(overlay.classList.contains('enneagram-overlay--visible')).toBe(true);
		await fireEvent.focusOut(link);
		expect(overlay.classList.contains('enneagram-overlay--visible')).toBe(false);
	});

	it('is its own toggle button when it stands alone with an overlay', async () => {
		const { container } = render(PopCard, { ...base, enneagramType: 4 });
		await tick();

		const el = card(container);
		expect(el.getAttribute('role')).toBe('button');
		expect(el.getAttribute('tabindex')).toBe('0');

		const overlay = container.querySelector('.enneagram-overlay') as HTMLElement;
		await fireEvent.keyDown(el, { key: 'Enter' });
		expect(overlay.classList.contains('enneagram-overlay--visible')).toBe(true);
		await fireEvent.keyDown(el, { key: ' ' });
		expect(overlay.classList.contains('enneagram-overlay--visible')).toBe(false);
	});
});
