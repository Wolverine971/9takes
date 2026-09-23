// src/lib/components/questions/ReplyOptInTray.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { captureMock, deserializeMock, fetchMock } = vi.hoisted(() => ({
	captureMock: vi.fn(),
	deserializeMock: vi.fn(),
	fetchMock: vi.fn()
}));

vi.mock('$app/forms', () => ({ deserialize: deserializeMock }));
vi.mock('$lib/analytics/posthog', () => ({ capture: captureMock }));

import ReplyOptInTray from './ReplyOptInTray.svelte';

const offer = {
	fingerprint: 'visitor-123',
	context: {
		questionId: 85,
		questionUrl: 'what-are-you-thinking-about-these-days',
		commentId: 123,
		surface: 'question_page' as const,
		isFirstCommentEver: true as const
	}
};

describe('ReplyOptInTray', () => {
	beforeEach(() => {
		window.sessionStorage.clear();
		captureMock.mockReset();
		captureMock.mockResolvedValue(undefined);
		deserializeMock.mockReset();
		fetchMock.mockReset();
		fetchMock.mockResolvedValue({ text: vi.fn().mockResolvedValue('{}') });
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('announces itself politely, records one impression, and never steals focus', () => {
		const { getByRole } = render(ReplyOptInTray, { props: { offer } });

		const tray = getByRole('region', { name: 'Want a note if someone replies?' });
		expect(tray.getAttribute('aria-live')).toBe('polite');
		expect(document.activeElement).not.toBe(getByRole('textbox', { name: 'Email' }));
		expect(captureMock).toHaveBeenCalledWith(
			'reply_opt_in_shown',
			expect.objectContaining({ question_id: 85, comment_id: 123, is_first_comment_ever: true })
		);
	});

	it('saves a valid reply email separately from the already-posted answer', async () => {
		const onstatechange = vi.fn();
		deserializeMock.mockReturnValueOnce({
			type: 'success',
			data: { replyOptIn: { status: 'subscribed' } }
		});
		const { getByRole, getByText } = render(ReplyOptInTray, { props: { offer, onstatechange } });

		const emailInput = getByRole('textbox', { name: 'Email' });
		await fireEvent.focus(emailInput);
		await fireEvent.input(emailInput, { target: { value: 'Reader@Example.com' } });
		await fireEvent.click(getByRole('button', { name: 'Keep me posted' }));

		await waitFor(() => {
			expect(getByText(/we’ll only email if someone replies/i)).toBeTruthy();
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('?/subscribeToCommentReplies');
		expect((init?.body as FormData).get('email')).toBe('Reader@Example.com');
		expect((init?.body as FormData).get('comment_id')).toBe('123');
		expect((init?.body as FormData).get('fingerprint')).toBe('visitor-123');
		expect(onstatechange).toHaveBeenCalledWith('subscribed');
		expect(captureMock).toHaveBeenCalledWith(
			'reply_opt_in_focused',
			expect.objectContaining({ comment_id: 123 })
		);
		expect(captureMock).toHaveBeenCalledWith(
			'reply_opt_in_succeeded',
			expect.objectContaining({ comment_id: 123 })
		);
		expect(JSON.stringify(captureMock.mock.calls)).not.toContain('Reader@Example.com');
	});

	it('rejects an invalid email without a request', async () => {
		const { getByRole, getByText } = render(ReplyOptInTray, { props: { offer } });

		await fireEvent.input(getByRole('textbox', { name: 'Email' }), {
			target: { value: 'not-an-email' }
		});
		await fireEvent.click(getByRole('button', { name: 'Keep me posted' }));

		expect(getByText('Enter a valid email address.')).toBeTruthy();
		expect(fetchMock).not.toHaveBeenCalled();
		expect(captureMock).toHaveBeenCalledWith(
			'reply_opt_in_failed',
			expect.objectContaining({ failure_category: 'invalid_email' })
		);
	});

	it('remembers a dismissal for the session and tells the page', async () => {
		const onstatechange = vi.fn();
		const { getByRole } = render(ReplyOptInTray, { props: { offer, onstatechange } });

		await fireEvent.click(getByRole('button', { name: 'Not now' }));

		expect(onstatechange).toHaveBeenCalledWith('dismissed');
		expect(window.sessionStorage.getItem('9t-reply-opt-in-dismissed')).toBe('1');
		expect(captureMock).toHaveBeenCalledWith(
			'reply_opt_in_dismissed',
			expect.objectContaining({ comment_id: 123 })
		);
	});
});
