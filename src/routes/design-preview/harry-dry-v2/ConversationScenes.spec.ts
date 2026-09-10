// src/routes/design-preview/harry-dry-v2/ConversationScenes.spec.ts
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { reducedMotion } = vi.hoisted(() => ({ reducedMotion: { current: false } }));
vi.mock('svelte/motion', () => ({ prefersReducedMotion: reducedMotion }));
import ConversationScenes from './ConversationScenes.svelte';

let intersection: (entries: Partial<IntersectionObserverEntry>[]) => void;
const disconnect = vi.fn();
let originalHidden: PropertyDescriptor | undefined;

beforeEach(() => {
	vi.useFakeTimers();
	reducedMotion.current = false;
	disconnect.mockClear();
	originalHidden = Object.getOwnPropertyDescriptor(document, 'hidden');
	Object.defineProperty(document, 'hidden', { configurable: true, value: false });
	vi.stubGlobal(
		'IntersectionObserver',
		class {
			constructor(callback: typeof intersection) {
				intersection = callback;
			}
			observe() {}
			disconnect = disconnect;
		}
	);
});

afterEach(() => {
	cleanup();
	vi.useRealTimers();
	vi.unstubAllGlobals();
	if (originalHidden) Object.defineProperty(document, 'hidden', originalHidden);
	else Reflect.deleteProperty(document, 'hidden');
});

async function setVisible(visible: boolean) {
	intersection([{ isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }]);
	await tick();
}

async function loadAll(container: HTMLElement) {
	for (const image of container.querySelectorAll('img')) await fireEvent.load(image);
}

const showing = () => screen.getByRole('img').getAttribute('src');

describe('conversation scene slideshow', () => {
	it('loops every two seconds with Vienna before Athens, without visible metadata or controls', async () => {
		const { container, unmount } = render(ConversationScenes);
		await loadAll(container);
		await vi.advanceTimersByTimeAsync(4000);
		expect(showing()).toContain('community-circle-neo-noir-v2');
		await setVisible(true);
		await vi.advanceTimersByTimeAsync(1999);
		expect(showing()).toContain('community-circle-neo-noir-v2');
		await vi.advanceTimersByTimeAsync(1);
		expect(showing()).toContain('01-gen-z');
		for (const scene of [
			'02-older-adults',
			'04-vienna-1910',
			'03-athens-statues',
			'community-circle-neo-noir-v2',
			'01-gen-z'
		]) {
			await vi.advanceTimersByTimeAsync(2000);
			expect(showing()).toContain(scene);
		}
		expect(container.textContent?.trim()).toBe('');
		expect(screen.queryAllByRole('button')).toHaveLength(0);
		await setVisible(false);
		await vi.advanceTimersByTimeAsync(4000);
		expect(showing()).toContain('01-gen-z');
		await setVisible(true);
		Object.defineProperty(document, 'hidden', { configurable: true, value: true });
		await fireEvent(document, new Event('visibilitychange'));
		await vi.advanceTimersByTimeAsync(4000);
		expect(showing()).toContain('01-gen-z');
		Object.defineProperty(document, 'hidden', { configurable: true, value: false });
		await fireEvent(document, new Event('visibilitychange'));
		await vi.advanceTimersByTimeAsync(2000);
		expect(showing()).toContain('02-older-adults');
		unmount();
		expect(disconnect).toHaveBeenCalledOnce();
		expect(vi.getTimerCount()).toBe(0);
	});

	it('keeps the current picture until the next image has loaded', async () => {
		const { container } = render(ConversationScenes);
		const images = container.querySelectorAll('img');
		await fireEvent.load(images[0]);
		await setVisible(true);
		await vi.advanceTimersByTimeAsync(6000);
		expect(showing()).toContain('community-circle-neo-noir-v2');
		await fireEvent.load(images[1]);
		await vi.advanceTimersByTimeAsync(1999);
		expect(showing()).toContain('community-circle-neo-noir-v2');
		await vi.advanceTimersByTimeAsync(1);
		expect(showing()).toContain('01-gen-z');
	});

	it('shows a still illustration when reduced motion is preferred', async () => {
		reducedMotion.current = true;
		const { container } = render(ConversationScenes);
		await loadAll(container);
		await setVisible(true);
		await vi.advanceTimersByTimeAsync(20000);
		expect(showing()).toContain('community-circle-neo-noir-v2');
		expect(container.querySelectorAll('img:not([aria-hidden="true"])')).toHaveLength(1);
	});

	it('skips a failed image instead of fading to an empty frame', async () => {
		const { container } = render(ConversationScenes);
		const images = container.querySelectorAll('img');
		await fireEvent.load(images[0]);
		await fireEvent.error(images[1]);
		await fireEvent.load(images[2]);
		await setVisible(true);
		await vi.advanceTimersByTimeAsync(2000);
		expect(showing()).toContain('02-older-adults');
	});
});
