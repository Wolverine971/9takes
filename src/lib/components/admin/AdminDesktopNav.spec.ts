// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/navigation', () => ({ afterNavigate: vi.fn() }));

import AdminDesktopNav from './AdminDesktopNav.svelte';

describe('admin navigation menus', () => {
	it('reveals one group at a time and dismisses it on an outside click', async () => {
		render(AdminDesktopNav, { pathname: '/admin' });
		expect(screen.getByRole('link', { name: 'Host desk' }).getAttribute('href')).toBe(
			'/admin/host-desk'
		);
		expect(screen.queryByRole('link', { name: 'Content board' })).toBeNull();

		await fireEvent.click(screen.getByRole('button', { name: 'Content' }));
		expect(screen.getByRole('link', { name: 'Content board' })).toBeTruthy();
		await fireEvent.click(screen.getByRole('button', { name: 'Community' }));
		expect(screen.queryByRole('link', { name: 'Content board' })).toBeNull();
		expect(screen.getByRole('link', { name: 'Users' })).toBeTruthy();

		await fireEvent.pointerDown(document.body);
		expect(screen.queryByRole('link', { name: 'Users' })).toBeNull();
	});

	it('closes on Escape and returns focus to the group button', async () => {
		render(AdminDesktopNav, { pathname: '/admin/content-board' });
		const content = screen.getByRole('button', { name: 'Content' });
		await fireEvent.click(content);
		screen.getByRole('link', { name: 'Content board' }).focus();
		await fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
		expect(content.getAttribute('aria-expanded')).toBe('false');
		expect(document.activeElement).toBe(content);
	});

	it('dismisses the menu when keyboard focus leaves its group', async () => {
		render(AdminDesktopNav, { pathname: '/admin' });
		const community = screen.getByRole('button', { name: 'Community' });
		await fireEvent.click(community);
		await fireEvent.focusIn(screen.getByRole('button', { name: 'Content' }));
		expect(community.getAttribute('aria-expanded')).toBe('false');
	});

	it('keeps unread notes visible and highlights the most specific destination', async () => {
		render(AdminDesktopNav, { pathname: '/admin/consulting/notes', newTalkNotes: 3 });
		const consulting = screen.getByRole('button', { name: /Consulting/ });
		expect(consulting.textContent).toContain('3');
		await fireEvent.click(consulting);
		expect(screen.getByRole('link', { name: /Notes/ }).getAttribute('aria-current')).toBe('page');
		expect(
			screen.getByRole('link', { name: 'Consulting' }).getAttribute('aria-current')
		).toBeNull();
	});
});
