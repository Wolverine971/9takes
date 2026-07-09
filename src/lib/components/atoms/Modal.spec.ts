// src/lib/components/atoms/Modal.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import Modal, { getModal } from './Modal.svelte';

describe('Modal', () => {
	beforeEach(() => {
		document.body.innerHTML = '<main><button id="modal-trigger">Open modal</button></main>';
		document.body.style.overflow = '';
	});

	afterEach(() => {
		document.body.innerHTML = '';
		document.body.style.overflow = '';
	});

	it('removes the modal overlay when the component unmounts while open', () => {
		const { unmount } = render(Modal, {
			props: {
				id: 'question-create',
				name: 'create question'
			}
		});

		const modal = getModal('question-create');
		expect(modal).toBeDefined();

		modal?.open();

		expect(document.querySelector('[role="dialog"]')).not.toBeNull();
		expect(document.body.style.overflow).toBe('hidden');

		unmount();

		expect(document.querySelector('[role="dialog"]')).toBeNull();
		expect(document.body.style.overflow).toBe('');
		expect(getModal('question-create')).toBeUndefined();
	});

	it('keeps body scroll locked until every open modal has closed', () => {
		const background = document.querySelector('main');
		const firstRender = render(Modal, {
			props: {
				id: 'first-modal',
				name: 'first modal'
			}
		});
		const secondRender = render(Modal, {
			props: {
				id: 'second-modal',
				name: 'second modal'
			}
		});

		const firstModal = getModal('first-modal');
		const secondModal = getModal('second-modal');

		firstModal?.open();
		secondModal?.open();

		expect(document.body.style.overflow).toBe('hidden');
		expect(background?.hasAttribute('inert')).toBe(true);

		firstModal?.close(null);

		expect(document.body.style.overflow).toBe('hidden');
		expect(background?.hasAttribute('inert')).toBe(true);

		secondModal?.close(null);

		expect(document.body.style.overflow).toBe('');
		expect(background?.hasAttribute('inert')).toBe(false);

		firstRender.unmount();
		secondRender.unmount();
	});

	it('keeps only the top stacked dialog interactive and reactivates the previous dialog', () => {
		const background = document.querySelector('main');
		const firstRender = render(Modal, {
			props: { id: 'stack-first-modal', name: 'Stack first modal' }
		});
		const secondRender = render(Modal, {
			props: { id: 'stack-second-modal', name: 'Stack second modal' }
		});
		const firstDialog = document.querySelector<HTMLElement>('[aria-label="Stack first modal"]');
		const secondDialog = document.querySelector<HTMLElement>('[aria-label="Stack second modal"]');

		getModal('stack-first-modal')?.open();
		expect(firstDialog?.hasAttribute('inert')).toBe(false);

		getModal('stack-second-modal')?.open();
		expect(firstDialog?.hasAttribute('inert')).toBe(true);
		expect(secondDialog?.hasAttribute('inert')).toBe(false);
		expect(background?.hasAttribute('inert')).toBe(true);

		getModal('stack-second-modal')?.close(null);
		expect(firstDialog?.hasAttribute('inert')).toBe(false);
		expect(background?.hasAttribute('inert')).toBe(true);

		getModal('stack-first-modal')?.close(null);
		expect(background?.hasAttribute('inert')).toBe(false);

		firstRender.unmount();
		secondRender.unmount();
	});

	it('provides an accessible name, moves focus inside, traps Tab, and restores focus', async () => {
		const trigger = document.querySelector<HTMLButtonElement>('#modal-trigger');
		trigger?.focus();

		const { unmount } = render(Modal, {
			props: {
				id: 'accessible-modal',
				name: 'Create question'
			}
		});

		getModal('accessible-modal')?.open();

		const dialog = await screen.findByRole('dialog', { name: 'Create question' });
		const closeButton = screen.getByRole('button', { name: 'Close dialog' });
		const background = document.querySelector('main');

		await waitFor(() => expect(document.activeElement).toBe(closeButton));
		expect(background?.hasAttribute('inert')).toBe(true);

		trigger?.focus();
		await fireEvent.keyDown(window, { key: 'Tab' });
		expect(document.activeElement).toBe(closeButton);
		expect(dialog.getAttribute('aria-modal')).toBe('true');

		getModal('accessible-modal')?.close(null);

		expect(background?.hasAttribute('inert')).toBe(false);
		expect(document.activeElement).toBe(trigger);
		unmount();
	});

	it('closes the top dialog on Escape and preserves an existing inert background state', async () => {
		const background = document.querySelector('main');
		background?.setAttribute('inert', '');

		const { unmount } = render(Modal, {
			props: {
				id: 'escape-modal',
				name: 'Escape test'
			}
		});

		getModal('escape-modal')?.open();
		await screen.findByRole('dialog', { name: 'Escape test' });
		await fireEvent.keyDown(window, { key: 'Escape' });

		await waitFor(() => {
			expect(screen.queryByRole('dialog', { name: 'Escape test' })).toBeNull();
		});
		expect(background?.hasAttribute('inert')).toBe(true);
		unmount();
	});
});
