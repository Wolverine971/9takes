// src/lib/components/molecules/SuggestFamousPerson.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { warningMock, dangerMock, successMock, fetchMock } = vi.hoisted(() => ({
	warningMock: vi.fn(),
	dangerMock: vi.fn(),
	successMock: vi.fn(),
	fetchMock: vi.fn()
}));

vi.mock('./notifications', () => ({
	notifications: {
		warning: warningMock,
		danger: dangerMock,
		success: successMock
	}
}));

import SuggestFamousPerson from './SuggestFamousPerson.svelte';

describe('SuggestFamousPerson', () => {
	beforeEach(() => {
		const storage = new Map<string, string>();
		vi.stubGlobal('localStorage', {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, value: string) => storage.set(key, value),
			removeItem: (key: string) => storage.delete(key),
			clear: () => storage.clear()
		});
		warningMock.mockReset();
		dangerMock.mockReset();
		successMock.mockReset();
		fetchMock.mockReset();
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('identifies the invalid field with a persistent label and inline error', async () => {
		render(SuggestFamousPerson);

		const personInput = screen.getByRole('textbox', { name: 'Person to cover' });
		await fireEvent.input(personInput, { target: { value: '123' } });
		await fireEvent.input(screen.getByRole('textbox', { name: 'Your email address' }), {
			target: { value: 'reader@example.com' }
		});
		await fireEvent.submit(screen.getByRole('form', { name: 'Suggest a person for 9takes' }));

		const alert = screen.getByRole('alert');
		expect(alert.textContent).toContain('Please enter a valid name');
		expect(personInput.getAttribute('aria-invalid')).toBe('true');
		expect(personInput.getAttribute('aria-describedby')).toBe(alert.id);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('keeps an API failure visible after the supplemental toast', async () => {
		fetchMock.mockResolvedValue({
			json: vi.fn().mockResolvedValue({ ok: false, message: 'Please try again later.' })
		});
		render(SuggestFamousPerson);

		await fireEvent.input(screen.getByRole('textbox', { name: 'Person to cover' }), {
			target: { value: 'Taylor Swift' }
		});
		await fireEvent.input(screen.getByRole('textbox', { name: 'Your email address' }), {
			target: { value: 'reader@example.com' }
		});
		await fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

		await waitFor(() => {
			expect(screen.getByRole('alert').textContent).toContain(
				'Suggestion failed: Please try again later.'
			);
		});
		expect(warningMock).toHaveBeenCalledWith('Suggestion failed: Please try again later.', 4000);
	});
});
