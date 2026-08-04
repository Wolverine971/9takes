// src/lib/components/questions/QuestionInviteCard.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	captureMock,
	markPromptSeenMock,
	recordInviteMock,
	shareInviteMock,
	shouldUseNativeShareMock,
	createInviteIdMock,
	qrToDataUrlMock
} = vi.hoisted(() => ({
	captureMock: vi.fn(),
	markPromptSeenMock: vi.fn(),
	recordInviteMock: vi.fn(),
	shareInviteMock: vi.fn(),
	shouldUseNativeShareMock: vi.fn(),
	createInviteIdMock: vi.fn(),
	qrToDataUrlMock: vi.fn()
}));

vi.mock('$lib/analytics/posthog', () => ({
	capture: captureMock
}));

vi.mock('$lib/analytics/questionInvites', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/analytics/questionInvites')>();
	return {
		...actual,
		createQuestionInviteId: createInviteIdMock,
		markQuestionInvitePromptSeen: markPromptSeenMock,
		recordQuestionInviteCreated: recordInviteMock,
		shareQuestionInvite: shareInviteMock,
		shouldUseNativeQuestionShare: shouldUseNativeShareMock
	};
});

vi.mock('qrcode', () => ({
	default: { toDataURL: qrToDataUrlMock }
}));

import QuestionInviteCard from './QuestionInviteCard.svelte';

const QUESTION_ID = 9;
const QUESTION_URL = 'what-keeps-you-grounded';
const QUESTION_TEXT = 'What keeps you grounded?';
const INVITE_ID = '11111111-1111-4111-8111-111111111111';

function renderCard(onclose = vi.fn()) {
	return {
		onclose,
		...render(QuestionInviteCard, {
			props: {
				questionId: QUESTION_ID,
				questionUrl: QUESTION_URL,
				questionText: QUESTION_TEXT,
				source: 'question-answer',
				onclose
			}
		})
	};
}

describe('QuestionInviteCard', () => {
	beforeEach(() => {
		captureMock.mockReset();
		captureMock.mockResolvedValue(undefined);
		markPromptSeenMock.mockReset();
		recordInviteMock.mockReset();
		recordInviteMock.mockResolvedValue(undefined);
		shareInviteMock.mockReset();
		shareInviteMock.mockResolvedValue({
			status: 'shared',
			method: 'clipboard',
			inviteId: INVITE_ID,
			inviteUrl: `https://9takes.com/questions/${QUESTION_URL}?via=${INVITE_ID}`
		});
		shouldUseNativeShareMock.mockReset();
		shouldUseNativeShareMock.mockReturnValue(false);
		createInviteIdMock.mockReset();
		createInviteIdMock.mockReturnValue(INVITE_ID);
		qrToDataUrlMock.mockReset();
		qrToDataUrlMock.mockResolvedValue('data:image/png;base64,invite');
		Object.defineProperty(window, 'matchMedia', {
			configurable: true,
			value: vi.fn(() => ({ matches: false }))
		});
	});

	it('marks the once-per-question prompt as seen and uses polite comparison copy', async () => {
		const { getByRole, getByText, onclose } = renderCard();

		expect(getByRole('heading', { name: 'Who would answer this differently?' })).toBeTruthy();
		expect(getByText(/they’ll answer before seeing the room, then you can compare/i)).toBeTruthy();
		await waitFor(() => {
			expect(markPromptSeenMock).toHaveBeenCalledWith(QUESTION_URL);
		});

		await fireEvent.click(getByRole('button', { name: 'Maybe later' }));
		expect(onclose).toHaveBeenCalledTimes(1);
		expect(captureMock).toHaveBeenCalledWith(
			'question_invite_prompt_closed',
			expect.objectContaining({ action: 'maybe_later' })
		);
	});

	it('copies an attributed invite on desktop and records the growth-loop event', async () => {
		const { getByRole, getByText } = renderCard();

		await fireEvent.click(getByRole('button', { name: 'Ask one person' }));

		expect(shareInviteMock).toHaveBeenCalledWith(
			expect.objectContaining({
				baseUrl: `https://9takes.com/questions/${QUESTION_URL}`,
				share: undefined
			})
		);
		expect(recordInviteMock).toHaveBeenCalledWith({
			inviteId: INVITE_ID,
			questionId: QUESTION_ID,
			questionUrl: QUESTION_URL,
			source: 'question-answer',
			method: 'clipboard'
		});
		expect(getByText('Invite link copied. Send it to one person.')).toBeTruthy();
	});

	it('generates attributed QR only after the secondary action is chosen', async () => {
		const { getByRole, getByAltText } = renderCard();

		expect(qrToDataUrlMock).not.toHaveBeenCalled();
		await fireEvent.click(getByRole('button', { name: 'Show QR' }));

		await waitFor(() => {
			expect(qrToDataUrlMock).toHaveBeenCalledWith(
				`https://9takes.com/questions/${QUESTION_URL}?via=${INVITE_ID}`,
				expect.any(Object)
			);
		});
		expect(getByAltText('Invite someone to answer this question')).toBeTruthy();
		expect(recordInviteMock).toHaveBeenCalledWith({
			inviteId: INVITE_ID,
			questionId: QUESTION_ID,
			questionUrl: QUESTION_URL,
			source: 'question-answer',
			method: 'qr'
		});
	});
});
