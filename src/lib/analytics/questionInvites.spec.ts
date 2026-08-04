// src/lib/analytics/questionInvites.spec.ts
// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureMock } = vi.hoisted(() => ({ captureMock: vi.fn() }));

vi.mock('$lib/analytics/posthog', () => ({
	capture: captureMock
}));

import {
	buildQuestionInviteUrl,
	captureQuestionInvitePageView,
	getQuestionInviteId,
	getRecipientQuestionInviteId,
	markQuestionInvitePromptSeen,
	questionInvitePromptWasSeen,
	recordQuestionInviteCreated,
	rememberOwnedQuestionInvite,
	shareQuestionInvite,
	shouldUseNativeQuestionShare
} from './questionInvites';

const INVITE_ID = '11111111-1111-4111-8111-111111111111';
const QUESTION_URL = 'what-keeps-you-grounded';
const BASE_URL = `https://9takes.com/questions/${QUESTION_URL}`;

describe('question invite sharing', () => {
	beforeEach(() => {
		captureMock.mockReset();
		captureMock.mockResolvedValue(undefined);
		window.localStorage.clear();
		window.sessionStorage.clear();
	});

	it('shows the polite inline prompt once per answered question', () => {
		expect(questionInvitePromptWasSeen(QUESTION_URL, window.localStorage)).toBe(false);

		markQuestionInvitePromptSeen(QUESTION_URL, window.localStorage);

		expect(questionInvitePromptWasSeen(QUESTION_URL, window.localStorage)).toBe(true);
		expect(questionInvitePromptWasSeen('a-different-question', window.localStorage)).toBe(false);
	});

	it('uses native sharing on mobile and clipboard sharing on desktop', () => {
		expect(
			shouldUseNativeQuestionShare({
				canNativeShare: true,
				coarsePointer: true,
				viewportWidth: 1024
			})
		).toBe(true);
		expect(
			shouldUseNativeQuestionShare({
				canNativeShare: true,
				coarsePointer: false,
				viewportWidth: 390
			})
		).toBe(true);
		expect(
			shouldUseNativeQuestionShare({
				canNativeShare: true,
				coarsePointer: false,
				viewportWidth: 1280
			})
		).toBe(false);
	});

	it('builds a privacy-safe attributed URL and rejects malformed attribution', () => {
		const inviteUrl = buildQuestionInviteUrl(BASE_URL, INVITE_ID);

		expect(inviteUrl).toBe(`${BASE_URL}?via=${INVITE_ID}`);
		expect(getQuestionInviteId(inviteUrl)).toBe(INVITE_ID);
		expect(getQuestionInviteId(`${BASE_URL}?via=not-a-valid-id`)).toBeNull();
	});

	it('uses native sharing with the attributed URL when available', async () => {
		const share = vi.fn().mockResolvedValue(undefined);
		const writeClipboard = vi.fn();

		const result = await shareQuestionInvite({
			baseUrl: BASE_URL,
			title: 'A question from 9takes',
			text: 'What keeps you grounded?',
			inviteId: INVITE_ID,
			share,
			writeClipboard
		});

		expect(result).toEqual({
			status: 'shared',
			method: 'native',
			inviteId: INVITE_ID,
			inviteUrl: `${BASE_URL}?via=${INVITE_ID}`
		});
		expect(share).toHaveBeenCalledWith({
			title: 'A question from 9takes',
			text: 'What keeps you grounded?',
			url: `${BASE_URL}?via=${INVITE_ID}`
		});
		expect(writeClipboard).not.toHaveBeenCalled();
	});

	it('does not turn a cancelled native share into a clipboard write', async () => {
		const share = vi.fn().mockRejectedValue({ name: 'AbortError' });
		const writeClipboard = vi.fn();

		const result = await shareQuestionInvite({
			baseUrl: BASE_URL,
			title: 'A question from 9takes',
			text: 'What keeps you grounded?',
			inviteId: INVITE_ID,
			share,
			writeClipboard
		});

		expect(result.status).toBe('aborted');
		expect(writeClipboard).not.toHaveBeenCalled();
	});

	it('falls back to copying the attributed URL when native sharing fails', async () => {
		const share = vi.fn().mockRejectedValue(new Error('Native share unavailable'));
		const writeClipboard = vi.fn().mockResolvedValue(undefined);

		const result = await shareQuestionInvite({
			baseUrl: BASE_URL,
			title: 'A question from 9takes',
			text: 'What keeps you grounded?',
			inviteId: INVITE_ID,
			share,
			writeClipboard
		});

		expect(result.status).toBe('shared');
		expect(result).toHaveProperty('method', 'clipboard');
		expect(writeClipboard).toHaveBeenCalledWith(`${BASE_URL}?via=${INVITE_ID}`);
	});

	it('distinguishes a recipient from the browser that created the invite', () => {
		const inviteUrl = `${BASE_URL}?via=${INVITE_ID}`;

		expect(getRecipientQuestionInviteId(inviteUrl, window.localStorage)).toBe(INVITE_ID);

		rememberOwnedQuestionInvite(
			{
				inviteId: INVITE_ID,
				questionUrl: QUESTION_URL,
				source: 'question-answer',
				sharedAt: Date.now()
			},
			window.localStorage
		);

		expect(getRecipientQuestionInviteId(inviteUrl, window.localStorage)).toBeNull();
	});

	it('records an attributed invite as both analytics and local ownership', async () => {
		await recordQuestionInviteCreated({
			inviteId: INVITE_ID,
			questionId: 9,
			questionUrl: QUESTION_URL,
			source: 'question-toolbar',
			method: 'qr',
			storage: window.localStorage
		});

		expect(captureMock).toHaveBeenCalledWith('question_invite_created', {
			invite_id: INVITE_ID,
			question_id: 9,
			question_url: QUESTION_URL,
			method: 'qr',
			source: 'question-toolbar'
		});
		expect(
			getRecipientQuestionInviteId(`${BASE_URL}?via=${INVITE_ID}`, window.localStorage)
		).toBeNull();
	});

	it('captures one recipient landing per browser session', async () => {
		const input = {
			currentUrl: `${BASE_URL}?via=${INVITE_ID}`,
			questionId: 9,
			questionUrl: QUESTION_URL,
			localStorage: window.localStorage,
			sessionStorage: window.sessionStorage,
			now: 2_000
		};

		await captureQuestionInvitePageView(input);
		await captureQuestionInvitePageView(input);

		expect(captureMock).toHaveBeenCalledTimes(1);
		expect(captureMock).toHaveBeenCalledWith('question_invite_recipient_landed', {
			invite_id: INVITE_ID,
			question_id: 9,
			question_url: QUESTION_URL,
			landing_path: `/questions/${QUESTION_URL}`
		});
	});

	it('captures the invite creator returning to the question only once', async () => {
		rememberOwnedQuestionInvite(
			{
				inviteId: INVITE_ID,
				questionUrl: QUESTION_URL,
				source: 'homepage-answer',
				sharedAt: 1_000
			},
			window.localStorage
		);

		const input = {
			currentUrl: BASE_URL,
			questionId: 9,
			questionUrl: QUESTION_URL,
			localStorage: window.localStorage,
			sessionStorage: window.sessionStorage,
			now: 2_000
		};

		await captureQuestionInvitePageView(input);
		await captureQuestionInvitePageView({ ...input, now: 3_000 });

		expect(captureMock).toHaveBeenCalledTimes(1);
		expect(captureMock).toHaveBeenCalledWith('question_invite_sharer_returned', {
			invite_id: INVITE_ID,
			question_id: 9,
			question_url: QUESTION_URL,
			source: 'homepage-answer'
		});
	});
});
