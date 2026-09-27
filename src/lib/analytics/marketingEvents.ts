// src/lib/analytics/marketingEvents.ts
import { capture } from '$lib/analytics/posthog';

export type EmailSignupSurface =
	'strategic_question' | 'email_signup' | 'email_invite' | 'enneagram_sidebar' | 'blog_purpose';

type SharedMarketingContext = {
	surface: string;
	sourcePath?: string;
	campaign?: string;
};

type RevealCompletedInput = SharedMarketingContext & {
	questionId: number;
	questionUrl: string;
	alreadyAnswered?: boolean;
};

type EmailSignupCompletedInput = SharedMarketingContext & {
	surface: EmailSignupSurface;
};

type TypeSelectedInput = SharedMarketingContext & {
	enneagramType: number;
	questionId?: number;
	questionUrl?: string;
	postContribution?: boolean;
	persistence?: 'profile' | 'take' | 'browser' | 'failed';
};

function sharedProperties(input: SharedMarketingContext): Record<string, unknown> {
	const properties: Record<string, unknown> = { surface: input.surface };
	if (input.sourcePath) properties.source_path = input.sourcePath;
	if (input.campaign) properties.campaign = input.campaign;
	return properties;
}

export function captureRevealCompleted(input: RevealCompletedInput): Promise<void> {
	if (
		!Number.isSafeInteger(input.questionId) ||
		input.questionId <= 0 ||
		!input.questionUrl.trim()
	) {
		return Promise.resolve();
	}

	return capture('reveal_completed', {
		...sharedProperties(input),
		question_id: input.questionId,
		question_url: input.questionUrl.trim(),
		already_answered: Boolean(input.alreadyAnswered),
		server_confirmed: true
	});
}

export function captureEmailSignupCompleted(input: EmailSignupCompletedInput): Promise<void> {
	return capture('email_signup_completed', {
		...sharedProperties(input),
		server_confirmed: true
	});
}

export function captureTypeSelected(input: TypeSelectedInput): Promise<void> {
	if (
		!Number.isSafeInteger(input.enneagramType) ||
		input.enneagramType < 1 ||
		input.enneagramType > 9
	) {
		return Promise.resolve();
	}

	const properties: Record<string, unknown> = {
		...sharedProperties(input),
		enneagram_type: input.enneagramType,
		selection_method: 'self_reported',
		post_contribution: Boolean(input.postContribution)
	};
	if (input.questionId && Number.isSafeInteger(input.questionId)) {
		properties.question_id = input.questionId;
	}
	if (input.questionUrl?.trim()) properties.question_url = input.questionUrl.trim();
	if (input.persistence) properties.persistence = input.persistence;

	return capture('type_selected', properties);
}

export type HomepagePracticeStep =
	| 'started'
	| 'revealed'
	| 'handoff_clicked'
	| 'next_question'
	| 'live_post_clicked'
	| 'live_kept_private';

type HomepagePracticeInput = SharedMarketingContext & {
	step: HomepagePracticeStep;
	practiceId: string;
	liveSlug?: string | null;
	placement?: string;
};

type HomepageLinkClickedInput = SharedMarketingContext & {
	placement: string;
	destination: string;
};

// Homepage practice funnel. Never send the visitor's answer text.
export function captureHomepagePractice(input: HomepagePracticeInput): Promise<void> {
	if (!input.practiceId.trim()) return Promise.resolve();

	const properties: Record<string, unknown> = {
		...sharedProperties(input),
		practice_id: input.practiceId.trim()
	};
	if (input.liveSlug?.trim()) properties.live_slug = input.liveSlug.trim();
	if (input.placement?.trim()) properties.placement = input.placement.trim();

	return capture(`homepage_practice_${input.step}`, properties);
}

export function captureHomepageLinkClicked(input: HomepageLinkClickedInput): Promise<void> {
	if (!/^\/(?!\/)/.test(input.destination)) return Promise.resolve();

	return capture('homepage_link_clicked', {
		...sharedProperties(input),
		placement: input.placement,
		destination: input.destination
	});
}
