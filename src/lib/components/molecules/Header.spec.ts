// src/lib/components/molecules/Header.spec.ts
// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { authUserStore, notificationCount, pageStore } = vi.hoisted(() => ({
	authUserStore: {
		subscribe(run: (value: { id: string; admin: boolean }) => void) {
			run({ id: 'user-1', admin: false });
			return () => {};
		}
	},
	notificationCount: {
		unread: 4,
		setUnread(value: number) {
			this.unread = value;
		}
	},
	pageStore: {
		subscribe(run: (value: { url: URL; data: { user: { id: string } } }) => void) {
			run({
				url: new URL('https://9takes.com/account'),
				data: { user: { id: 'user-1' } }
			});
			return () => {};
		}
	}
}));

vi.mock('$app/navigation', () => ({ afterNavigate: vi.fn(), goto: vi.fn() }));
vi.mock('$app/paths', () => ({ resolve: (path: string) => path }));
vi.mock('$app/stores', () => ({ page: pageStore }));
vi.mock('$lib/authShell', () => ({ getAuthShellUser: () => authUserStore }));
vi.mock('$lib/notificationCount.svelte', () => ({
	useNotificationCount: () => notificationCount
}));

import Header from './Header.svelte';

describe('Header notification bell', () => {
	beforeEach(() => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({ unread: 4 })
			})
		);
		vi.stubGlobal(
			'matchMedia',
			vi.fn().mockReturnValue({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn()
			})
		);
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
	});

	it('targets the notification feed on desktop and mobile', () => {
		render(Header);

		const bells = screen.getAllByRole('link', { name: 'View notifications — 4 unread' });
		expect(bells).toHaveLength(2);
		for (const bell of bells) {
			expect(bell.getAttribute('href')).toBe('/account#notifications');
		}
	});
});
