// src/lib/components/molecules/Email-Signup.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { successMock, infoMock, warningMock, fetchMock } = vi.hoisted(() => ({
	successMock: vi.fn(),
	infoMock: vi.fn(),
	warningMock: vi.fn(),
	fetchMock: vi.fn()
}));

vi.mock('./notifications', () => ({
	notifications: {
		success: successMock,
		info: infoMock,
		warning: warningMock
	}
}));

import EmailSignup from './Email-Signup.svelte';

describe('Email-Signup', () => {
	beforeEach(() => {
		successMock.mockReset();
		infoMock.mockReset();
		warningMock.mockReset();
		fetchMock.mockReset();
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('associates a persistent label and inline validation error with the email input', async () => {
		render(EmailSignup);

		const input = screen.getByRole('textbox', { name: 'Email address' });
		await fireEvent.input(input, { target: { value: 'not-an-email' } });
		await fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));

		const alert = screen.getByRole('alert');
		expect(alert.textContent).toContain('Enter a valid email address');
		expect(input.getAttribute('aria-invalid')).toBe('true');
		expect(input.getAttribute('aria-describedby')).toBe(alert.id);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('keeps a server failure visible after the supplemental toast', async () => {
		fetchMock.mockResolvedValue({
			json: vi.fn().mockResolvedValue({
				ok: false,
				message: 'Subscriptions are temporarily unavailable.'
			})
		});
		render(EmailSignup);

		await fireEvent.input(screen.getByRole('textbox', { name: 'Email address' }), {
			target: { value: 'reader@example.com' }
		});
		await fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));

		await waitFor(() => {
			expect(screen.getByRole('alert').textContent).toContain(
				'Subscriptions are temporarily unavailable.'
			);
		});
		expect(warningMock).toHaveBeenCalledWith('Signup failed', 3000);
	});
});
