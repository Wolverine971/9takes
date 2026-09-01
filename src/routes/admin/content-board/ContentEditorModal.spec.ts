// src/routes/admin/content-board/ContentEditorModal.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { notifications } from '$lib/components/molecules/notifications';
import ContentEditorModal from './ContentEditorModal.svelte';

vi.mock('$lib/components/molecules/notifications', () => ({
	notifications: {
		success: vi.fn(),
		danger: vi.fn()
	}
}));

const loadedContent = {
	id: 42,
	person: 'ada-lovelace',
	content: 'Original draft',
	history: [],
	stageName: 'Written'
};

describe('ContentEditorModal', () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.unstubAllGlobals();
		document.body.innerHTML = '';
		document.body.style.overflow = '';
	});

	it('keeps the editor open when save and close fails', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, json: async () => loadedContent })
			.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Save failed' }) });
		vi.stubGlobal('fetch', fetchMock);
		vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
			callback(0);
			return 1;
		});

		const { unmount } = render(ContentEditorModal, {
			props: { open: true, blogId: 42, contentType: 'people' }
		});

		const dialog = await screen.findByRole('dialog', { name: 'ada lovelace' });
		const editor = document.querySelector<HTMLTextAreaElement>('.editor-textarea');
		await waitFor(() => expect(editor?.value).toBe('Original draft'));

		await fireEvent.input(editor!, { target: { value: 'Changed draft' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Done' }));

		await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
		expect(dialog.getAttribute('aria-hidden')).toBeNull();
		expect(notifications.danger).toHaveBeenCalledWith('Failed to save content');

		unmount();
	});

	it('stacks the unsaved warning and restores the editor after Escape', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({ ok: true, json: async () => loadedContent })
		);
		vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
			callback(0);
			return 1;
		});
		const onclose = vi.fn();

		const { unmount } = render(ContentEditorModal, {
			props: { open: true, blogId: 42, contentType: 'people', onclose }
		});

		const editorDialog = await screen.findByRole('dialog', { name: 'ada lovelace' });
		const editor = document.querySelector<HTMLTextAreaElement>('.editor-textarea');
		await waitFor(() => expect(editor?.value).toBe('Original draft'));
		await fireEvent.input(editor!, { target: { value: 'Changed draft' } });

		await fireEvent.click(screen.getByRole('button', { name: 'Close content editor' }));
		const warningDialog = await screen.findByRole('dialog', { name: 'Keep your changes?' });
		expect(editorDialog.hasAttribute('inert')).toBe(true);
		expect(warningDialog.hasAttribute('inert')).toBe(false);

		await fireEvent.keyDown(window, { key: 'Escape' });
		await waitFor(() => expect(editorDialog.hasAttribute('inert')).toBe(false));
		expect(document.body.style.overflow).toBe('hidden');
		expect(onclose).not.toHaveBeenCalled();

		unmount();
	});
});
