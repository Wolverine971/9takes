// src/lib/analytics/marketingEvents.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureMock, requestContextMock } = vi.hoisted(() => ({
	captureMock: vi.fn(),
	requestContextMock: vi.fn()
}));

vi.mock('$lib/analytics/posthog', () => ({
	capture: captureMock,
	getPostHogRequestContext: requestContextMock
}));

import {
	captureChorusInteraction,
	captureEmailSignupStep,
	prepareEmailSignup,
	captureHomepageLinkClicked,
	captureHomepagePractice,
	captureRevealCompleted,
	captureTypeSelected
} from './marketingEvents';

describe('marketing conversion events', () => {
	beforeEach(() => vi.clearAllMocks());

	it('records prompt and signup drop-offs without copying submitted content', async () => {
		await captureChorusInteraction({
			step: 'failed',
			questionUrl: 'what-were-you-like-as-a-kid-in-3-words',
			sourcePath: '/personality-analysis/jack-black',
			errorCategory: 'http_error',
			...({ answer: 'private answer' } as {})
		});
		await captureEmailSignupStep({
			step: 'started',
			surface: 'blog_purpose',
			sourcePath: '/personality-analysis/jack-black',
			...({ email: 'private@example.com' } as {})
		});
		expect(captureMock.mock.calls[0]).toEqual([
			'chorus_failed',
			expect.objectContaining({
				prompt_version: 'three_words_v1',
				question_url: 'what-were-you-like-as-a-kid-in-3-words',
				error_category: 'http_error'
			})
		]);
		expect(captureMock.mock.calls[1][0]).toBe('email_signup_started');
		expect(JSON.stringify(captureMock.mock.calls)).not.toContain('private');
	});

	it('captures a server-confirmed reveal without submitted text', async () => {
		await captureRevealCompleted({
			surface: 'strategic_question',
			sourcePath: '/enneagram-corner/example',
			campaign: 'embedded-chorus',
			questionId: 567,
			questionUrl: 'example-question'
		});

		expect(captureMock).toHaveBeenCalledWith('reveal_completed', {
			surface: 'strategic_question',
			source_path: '/enneagram-corner/example',
			campaign: 'embedded-chorus',
			question_id: 567,
			question_url: 'example-question',
			already_answered: false,
			server_confirmed: true
		});
	});

	it('passes the browser identity and captures submission, never completion', async () => {
		requestContextMock.mockResolvedValue({
			distinctId: '019a0000-0000-7000-8000-000000000001',
			sessionId: '019a0000-0000-7000-8000-000000000002'
		});
		const body = new FormData();
		body.set('email', 'private@example.com');
		await prepareEmailSignup(body, {
			surface: 'blog_purpose',
			sourcePath: '/enneagram-corner/example'
		});

		expect(captureMock).toHaveBeenCalledWith('email_signup_submitted', {
			surface: 'blog_purpose',
			source_path: '/enneagram-corner/example',
			signup_tracking_version: 2,
			error_category: undefined
		});
		expect(JSON.parse(String(body.get('analytics')))).toMatchObject({
			distinctId: '019a0000-0000-7000-8000-000000000001',
			sessionId: '019a0000-0000-7000-8000-000000000002'
		});
		expect(String(body.get('analytics'))).not.toContain('private@example.com');
		expect(captureMock).toHaveBeenCalledTimes(1);
	});

	it('does not pass analytics identity when tracking is opted out', async () => {
		requestContextMock.mockResolvedValue(null);
		const body = new FormData();
		await prepareEmailSignup(body, { surface: 'email_signup' });
		expect(body.has('analytics')).toBe(false);
		expect(captureMock).not.toHaveBeenCalled();
	});

	it('lets the signup proceed if analytics never becomes ready', async () => {
		vi.useFakeTimers();
		try {
			requestContextMock.mockReturnValue(new Promise(() => {}));
			const body = new FormData();
			const pending = prepareEmailSignup(body, { surface: 'email_signup' });
			await vi.advanceTimersByTimeAsync(800);
			await pending;
			expect(body.has('analytics')).toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});

	it('captures valid self-reported type selection and ignores invalid types', async () => {
		await captureTypeSelected({
			surface: 'strategic_question_reveal',
			enneagramType: 5,
			questionId: 567,
			questionUrl: 'example-question',
			postContribution: true
		});
		await captureTypeSelected({ surface: 'register', enneagramType: 10 });

		expect(captureMock).toHaveBeenCalledTimes(1);
		expect(captureMock).toHaveBeenCalledWith('type_selected', {
			surface: 'strategic_question_reveal',
			enneagram_type: 5,
			selection_method: 'self_reported',
			post_contribution: true,
			question_id: 567,
			question_url: 'example-question'
		});
	});

	it('captures homepage practice steps without answer text', async () => {
		await captureHomepagePractice({
			surface: 'homepage',
			step: 'handoff_clicked',
			practiceId: 'friendship',
			liveSlug: 'whats-criteria-considering-someone-friend',
			placement: 'reveal'
		});

		expect(captureMock).toHaveBeenCalledWith('homepage_practice_handoff_clicked', {
			surface: 'homepage',
			practice_id: 'friendship',
			live_slug: 'whats-criteria-considering-someone-friend',
			placement: 'reveal'
		});
		expect(captureMock.mock.calls[0][1]).not.toHaveProperty('answer');
	});

	it('only captures in-site homepage link destinations', async () => {
		await captureHomepageLinkClicked({
			surface: 'homepage',
			placement: 'people_row',
			destination: 'https://example.com'
		});
		expect(captureMock).not.toHaveBeenCalled();

		await captureHomepageLinkClicked({
			surface: 'homepage',
			placement: 'people_row',
			destination: '/personality-analysis/jack-black'
		});
		expect(captureMock).toHaveBeenCalledWith('homepage_link_clicked', {
			surface: 'homepage',
			placement: 'people_row',
			destination: '/personality-analysis/jack-black'
		});
	});
});
