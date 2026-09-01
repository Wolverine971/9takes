// src/lib/components/email/EmailComposeModal.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

import EmailComposeModal from './EmailComposeModal.svelte';

describe('EmailComposeModal', () => {
	afterEach(() => {
		document.body.style.overflow = '';
	});

	it('uses stacked accessible dialogs and keeps the compose dialog active after closing AI generation', async () => {
		const { unmount } = render(EmailComposeModal, {
			props: {
				open: true,
				recipients: [
					{
						id: 'reader-1',
						email: 'reader@example.com',
						name: 'Reader',
						source: 'profiles',
						source_id: 'reader-1'
					}
				]
			}
		});

		const composeDialog = await screen.findByRole('dialog', { name: 'Compose Email' });
		const subject = screen.getByRole('textbox', { name: /Subject/ });

		await waitFor(() => expect(document.activeElement).toBe(subject));
		expect(document.body.style.overflow).toBe('hidden');

		await fireEvent.click(screen.getByRole('button', { name: 'Generate with AI' }));
		const generateDialog = await screen.findByRole('dialog', { name: 'Generate with AI' });

		expect(composeDialog.hasAttribute('inert')).toBe(true);
		expect(generateDialog.hasAttribute('inert')).toBe(false);

		await fireEvent.keyDown(window, { key: 'Escape' });
		await waitFor(() => expect(composeDialog.hasAttribute('inert')).toBe(false));
		expect(document.body.style.overflow).toBe('hidden');

		await fireEvent.keyDown(window, { key: 'Escape' });
		await waitFor(() => expect(composeDialog.getAttribute('aria-hidden')).toBe('true'));
		expect(document.body.style.overflow).toBe('');

		unmount();
	});
});
