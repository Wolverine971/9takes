// src/lib/analytics/marketingEvents.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureMock } = vi.hoisted(() => ({ captureMock: vi.fn() }));

vi.mock('$lib/analytics/posthog', () => ({ capture: captureMock }));

import {
	captureEmailSignupCompleted,
	captureHomepageLinkClicked,
	captureHomepagePractice,
	captureRevealCompleted,
	captureTypeSelected
} from './marketingEvents';

describe('marketing conversion events', () => {
	beforeEach(() => vi.clearAllMocks());

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

	it('captures canonical email signup completion with a bounded surface', async () => {
		await captureEmailSignupCompleted({
			surface: 'blog_purpose',
			sourcePath: '/enneagram-corner/example'
		});

		expect(captureMock).toHaveBeenCalledWith('email_signup_completed', {
			surface: 'blog_purpose',
			source_path: '/enneagram-corner/example',
			server_confirmed: true
		});
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
