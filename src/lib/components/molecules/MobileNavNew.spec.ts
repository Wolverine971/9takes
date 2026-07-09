// src/lib/components/molecules/MobileNavNew.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { afterNavigateMock, pageStore } = vi.hoisted(() => ({
	afterNavigateMock: vi.fn(),
	pageStore: {
		subscribe(run: (value: { url: URL; data: { user: null } }) => void) {
			run({ url: new URL('https://9takes.com/'), data: { user: null } });
			return () => {};
		}
	}
}));

vi.mock('$app/navigation', () => ({
	afterNavigate: afterNavigateMock
}));

vi.mock('$app/stores', () => ({
	page: pageStore
}));

import MobileNavNew from './MobileNavNew.svelte';

describe('MobileNavNew', () => {
	beforeEach(() => {
		Element.prototype.animate = vi.fn((_, options) => {
			let finishHandler: Animation['onfinish'] = null;
			const animation = {
				cancel: vi.fn(),
				currentTime: typeof options === 'number' ? options : (options?.duration ?? 0),
				effect: null,
				playState: 'finished',
				get onfinish() {
					return finishHandler;
				},
				set onfinish(handler: Animation['onfinish']) {
					finishHandler = handler;
					queueMicrotask(() =>
						handler?.call(
							animation as unknown as Animation,
							new Event('finish') as AnimationPlaybackEvent
						)
					);
				}
			};

			return animation as unknown as Animation;
		});
		document.body.innerHTML = '<main id="page-content"></main>';
		document.body.style.overflow = '';
		afterNavigateMock.mockReset();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		document.body.style.overflow = '';
	});

	it('traps focus, inerts the page, closes on Escape, and restores the toggle', async () => {
		const { unmount } = render(MobileNavNew, {
			props: {
				navItems: [
					{ href: '/', label: 'Home' },
					{ href: '/questions', label: 'Questions' }
				],
				libraryItems: [{ href: '/community', label: 'Community' }]
			}
		});

		const toggle = screen.getByRole('button', { name: 'Open navigation menu' });
		toggle.focus();
		await fireEvent.click(toggle);

		const dialog = await screen.findByRole('dialog', { name: 'Menu' });
		const closeButton = within(dialog).getByRole('button', { name: 'Close navigation' });
		const loginLink = within(dialog).getByRole('link', { name: 'Login / Register' });
		const pageContent = document.querySelector('#page-content');

		await waitFor(() => expect(document.activeElement).toBe(closeButton));
		expect(document.body.style.overflow).toBe('hidden');
		expect(pageContent?.hasAttribute('inert')).toBe(true);

		loginLink.focus();
		await fireEvent.keyDown(window, { key: 'Tab' });
		expect(document.activeElement).toBe(closeButton);

		closeButton.focus();
		await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
		expect(document.activeElement).toBe(loginLink);

		await fireEvent.keyDown(window, { key: 'Escape' });
		await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull());

		expect(document.body.style.overflow).toBe('');
		expect(pageContent?.hasAttribute('inert')).toBe(false);
		expect(document.activeElement).toBe(toggle);
		unmount();
	});
});
