// src/lib/analytics/marketingEvents.ts
import { capture, getPostHogRequestContext } from '$lib/analytics/posthog';
import { parseEmailSignupAnalytics, type EmailSignupSurface } from './emailSignupContext';
export type { EmailSignupSurface } from './emailSignupContext';

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

type EmailSignupInput = SharedMarketingContext & {
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

/** Completion is emitted only by the server after insertion, never from an HTTP success response. */
export async function prepareEmailSignup(body: FormData, input: EmailSignupInput): Promise<void> {
	let timeout: ReturnType<typeof setTimeout> | undefined;
	try {
		// Analytics must not hold up a signup when the SDK or auth resolution is unavailable.
		const identity = await Promise.race([
			getPostHogRequestContext(),
			new Promise<null>((resolve) => {
				timeout = setTimeout(() => resolve(null), 800);
			})
		]);
		const context = parseEmailSignupAnalytics({ ...identity, ...input });
		if (!context) return;
		body.set('analytics', JSON.stringify(context));
		await captureEmailSignupStep({ ...input, step: 'submitted' });
	} catch {
		// Missing analytics must never prevent the signup request.
	} finally {
		clearTimeout(timeout);
	}
}

/** Bounded funnel labels only; never send drafts, email addresses or exception messages. */
export function captureChorusInteraction(input: {
	step: 'shown' | 'started' | 'submitted' | 'failed' | 'revealed';
	questionUrl: string;
	sourcePath?: string | null;
	errorCategory?: 'http_error' | 'network_error' | 'invalid_response';
}): Promise<void> {
	return capture(`chorus_${input.step}`, {
		surface: 'personality_chorus',
		question_url: input.questionUrl,
		source_path: input.sourcePath,
		error_category: input.errorCategory,
		prompt_version:
			input.questionUrl === 'what-were-you-like-as-a-kid-in-3-words'
				? 'three_words_v1'
				: 'chorus_v2'
	});
}

export function captureEmailSignupStep(
	input: EmailSignupInput & {
		step: 'shown' | 'started' | 'submitted' | 'failed';
		errorCategory?: 'validation' | 'http_error' | 'network_error' | 'invalid_response';
	}
): Promise<void> {
	return capture(`email_signup_${input.step}`, {
		...sharedProperties(input),
		signup_tracking_version: 2,
		error_category: input.errorCategory
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

// Beta card copy experiment: seen, opened (first focus on the email field),
// submitted (server saved the email). Never send the email itself.
export type BetaInviteStep = 'viewed' | 'opened' | 'submitted';

type BetaInviteInput = SharedMarketingContext & {
	step: BetaInviteStep;
	placement: 'rail' | 'inline';
	/** Copy variant in the running experiment ($lib/utils/betaCardCopy). */
	variant: string;
};

export function captureBetaInvite(input: BetaInviteInput): Promise<void> {
	return capture(`beta_invite_${input.step}`, {
		...sharedProperties(input),
		placement: input.placement,
		variant: input.variant
	});
}
