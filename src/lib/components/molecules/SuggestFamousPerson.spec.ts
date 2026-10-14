// src/lib/components/molecules/SuggestFamousPerson.spec.ts
// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TurnstileOptions } from '$lib/utils/turnstile';

const {
	warningMock,
	dangerMock,
	successMock,
	fetchMock,
	loadMock,
	renderMock,
	resetMock,
	removeMock
} = vi.hoisted(() => ({
	warningMock: vi.fn(),
	dangerMock: vi.fn(),
	successMock: vi.fn(),
	fetchMock: vi.fn(),
	loadMock: vi.fn(),
	renderMock: vi.fn(),
	resetMock: vi.fn(),
	removeMock: vi.fn()
}));

vi.mock('$env/dynamic/public', () => ({ env: { PUBLIC_TURNSTILE_SITE_KEY: 'test-site-key' } }));
vi.mock('$lib/utils/turnstile', () => ({ loadTurnstile: loadMock }));

vi.mock('./notifications', () => ({
	notifications: {
		warning: warningMock,
		danger: dangerMock,
		success: successMock
	}
}));

import SuggestFamousPerson from './SuggestFamousPerson.svelte';

function verificationOptions(): TurnstileOptions {
	return renderMock.mock.calls.at(-1)![1];
}

async function fillSuggestion() {
	await fireEvent.input(screen.getByRole('textbox', { name: 'Person to cover' }), {
		target: { value: 'Taylor Swift' }
	});
	await fireEvent.input(screen.getByRole('textbox', { name: 'Your email address' }), {
		target: { value: 'reader@example.com' }
	});
}

async function verify(token = 'verified-token') {
	await fireEvent.focusIn(screen.getByRole('textbox', { name: 'Person to cover' }));
	await waitFor(() => expect(renderMock).toHaveBeenCalled());
	verificationOptions().callback(token);
	await waitFor(() =>
		expect((screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement).disabled).toBe(
			false
		)
	);
}

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
		loadMock.mockReset();
		renderMock.mockReset().mockReturnValue('suggestion-widget');
		resetMock.mockReset();
		removeMock.mockReset();
		loadMock.mockResolvedValue({ render: renderMock, reset: resetMock, remove: removeMock });
		vi.stubGlobal('IntersectionObserver', undefined);
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		cleanup();
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
		await verify();
		await fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

		await waitFor(() => {
			expect(screen.getByRole('alert').textContent).toContain(
				'Suggestion failed: Please try again later.'
			);
		});
		expect(warningMock).toHaveBeenCalledWith('Suggestion failed: Please try again later.', 4000);
		expect(resetMock).toHaveBeenCalledWith('suggestion-widget');
	});

	it('loads verification on interaction and blocks submission until a token exists', async () => {
		render(SuggestFamousPerson);
		await fillSuggestion();
		expect(loadMock).not.toHaveBeenCalled();
		expect((screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement).disabled).toBe(
			true
		);
		await fireEvent.submit(screen.getByRole('form', { name: 'Suggest a person for 9takes' }));
		expect(fetchMock).not.toHaveBeenCalled();
		await verify();
		expect(verificationOptions()).toMatchObject({
			sitekey: 'test-site-key',
			action: 'person_suggestion'
		});
	});

	it('starts verification when the form becomes visible and disconnects its observer', async () => {
		let notify!: (entries: Array<{ isIntersecting: boolean }>) => void;
		const disconnect = vi.fn();
		vi.stubGlobal(
			'IntersectionObserver',
			class {
				constructor(callback: typeof notify) {
					notify = callback;
				}
				observe = vi.fn();
				disconnect = disconnect;
			}
		);
		render(SuggestFamousPerson);
		notify([{ isIntersecting: false }]);
		expect(loadMock).not.toHaveBeenCalled();
		notify([{ isIntersecting: true }]);
		await waitFor(() => expect(renderMock).toHaveBeenCalledOnce());
		expect(disconnect).toHaveBeenCalledOnce();
		await fireEvent.focusIn(screen.getByRole('textbox', { name: 'Person to cover' }));
		expect(loadMock).toHaveBeenCalledOnce();
	});

	it('sends the token and honeypot, then resets only this widget after a successful request', async () => {
		fetchMock.mockResolvedValue({ json: async () => ({ ok: true }) });
		const { unmount } = render(SuggestFamousPerson);
		await fillSuggestion();
		await verify();
		await fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
		await waitFor(() => expect(resetMock).toHaveBeenCalledWith('suggestion-widget'));
		const body = fetchMock.mock.calls[0][1].body as FormData;
		expect(body.get('cf-turnstile-response')).toBe('verified-token');
		expect(body.get('form_extra')).toBe('');
		expect(screen.getByText('Your suggestion for Taylor Swift has been saved.')).toBeTruthy();
		await fillSuggestion();
		expect((screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement).disabled).toBe(
			true
		);
		unmount();
		expect(removeMock).toHaveBeenCalledWith('suggestion-widget');
	});

	it('invalidates expired tokens and lets the visitor retry verification', async () => {
		render(SuggestFamousPerson);
		await fillSuggestion();
		await verify();
		verificationOptions()['expired-callback']();
		await waitFor(() =>
			expect(screen.getByRole('alert').textContent).toContain('Verification expired')
		);
		expect((screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement).disabled).toBe(
			true
		);
		await fireEvent.click(screen.getByRole('button', { name: 'Retry verification' }));
		expect(resetMock).toHaveBeenCalledWith('suggestion-widget');
		verificationOptions().callback('fresh-token');
		await waitFor(() =>
			expect((screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement).disabled).toBe(
				false
			)
		);
	});

	it('offers a working retry when the script fails to load', async () => {
		loadMock.mockRejectedValueOnce(new Error('Network unavailable'));
		render(SuggestFamousPerson);
		await fireEvent.focusIn(screen.getByRole('textbox', { name: 'Person to cover' }));
		await waitFor(() =>
			expect(screen.getByRole('alert').textContent).toContain('Verification could not load')
		);
		await fireEvent.click(screen.getByRole('button', { name: 'Retry verification' }));
		await waitFor(() => expect(renderMock).toHaveBeenCalledOnce());
		expect(loadMock).toHaveBeenCalledTimes(2);
	});

	it.each(['error-callback', 'timeout-callback'] as const)(
		'clears a token when Turnstile reports %s',
		async (callback) => {
			render(SuggestFamousPerson);
			await fillSuggestion();
			await verify();
			verificationOptions()[callback]();
			await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Please retry.'));
			expect((screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement).disabled).toBe(
				true
			);
			expect(fetchMock).not.toHaveBeenCalled();
		}
	);

	it('preserves a successful submission when browser storage is blocked', async () => {
		vi.stubGlobal('localStorage', {
			getItem: () => {
				throw new Error('Storage disabled');
			},
			setItem: () => {
				throw new Error('Storage disabled');
			}
		});
		fetchMock.mockResolvedValue({ json: async () => ({ ok: true }) });
		render(SuggestFamousPerson);
		await fillSuggestion();
		await verify();
		await fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
		await waitFor(() =>
			expect(screen.getByText('Your suggestion for Taylor Swift has been saved.')).toBeTruthy()
		);
		expect(dangerMock).not.toHaveBeenCalled();
	});

	it('does not render a widget after its form is unmounted during script loading', async () => {
		let resolveLoad!: (api: object) => void;
		loadMock.mockReturnValue(
			new Promise((resolve) => {
				resolveLoad = resolve;
			})
		);
		const { unmount } = render(SuggestFamousPerson);
		await fireEvent.focusIn(screen.getByRole('textbox', { name: 'Person to cover' }));
		unmount();
		resolveLoad({ render: renderMock, reset: resetMock, remove: removeMock });
		await Promise.resolve();
		expect(renderMock).not.toHaveBeenCalled();
	});
});
