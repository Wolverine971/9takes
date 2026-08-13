// src/lib/analytics/commentEvents.ts
import { capture } from '$lib/analytics/posthog';
import { normalizeQuestionInviteId } from '$lib/analytics/questionInvites';

export type CommentCreatedSurface = 'homepage' | 'question_page' | 'strategic_question';
export type CommentCreatedKind = 'answer' | 'comment' | 'reply';
export type CommentFailureStage = 'request' | 'response' | 'server_action';
export type CommentFailureCategory =
	'network_error' | 'http_error' | 'action_failure' | 'invalid_response' | 'unknown';

export type CommentEventContext = {
	questionId: number;
	questionUrl?: string;
	commentKind: CommentCreatedKind;
	surface: CommentCreatedSurface;
	sourcePath?: string;
	campaign?: string;
	featureRunId?: number | null;
	isAnonymous: boolean;
};

type CaptureCommentCreatedInput = CommentEventContext & {
	commentId: unknown;
	parentType: 'question' | 'comment';
	inviteId?: string | null;
	isFirstCommentEver?: boolean;
	isFirstCommentOnQuestion?: boolean;
	isReply?: boolean;
	questionAgeHours?: number;
	responsesBeforeComment?: number;
};

type CaptureCommentFailedInput = CommentEventContext & {
	failureStage: CommentFailureStage;
	errorCategory: CommentFailureCategory;
};

export type ServerCommentAnalytics = {
	isFirstCommentEver?: boolean;
	isFirstCommentOnQuestion?: boolean;
	isReply?: boolean;
	questionAgeHours?: number;
	responsesBeforeComment?: number;
};

function normalizeCommentId(value: unknown): number | string | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim()) return value.trim();
	return null;
}

function normalizeNonNegativeNumber(value: number | undefined): number | undefined {
	if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
	return Math.max(0, value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Reads the additive `_analytics` object returned by the atomic comment RPC.
 * Passing the nested object itself is also supported for API proxy responses.
 */
export function normalizeServerCommentAnalytics(value: unknown): ServerCommentAnalytics {
	if (!isRecord(value)) return {};
	const candidate = isRecord(value._analytics) ? value._analytics : value;
	const normalized: ServerCommentAnalytics = {};

	if (typeof candidate.is_first_comment_ever === 'boolean') {
		normalized.isFirstCommentEver = candidate.is_first_comment_ever;
	}
	if (typeof candidate.is_first_comment_on_question === 'boolean') {
		normalized.isFirstCommentOnQuestion = candidate.is_first_comment_on_question;
	}
	if (typeof candidate.is_reply === 'boolean') normalized.isReply = candidate.is_reply;

	const questionAgeHours =
		typeof candidate.question_age_hours === 'number' &&
		Number.isFinite(candidate.question_age_hours) &&
		candidate.question_age_hours >= 0
			? candidate.question_age_hours
			: undefined;
	if (questionAgeHours !== undefined) normalized.questionAgeHours = questionAgeHours;

	const responsesBeforeComment =
		typeof candidate.responses_before_comment === 'number' &&
		Number.isFinite(candidate.responses_before_comment) &&
		candidate.responses_before_comment >= 0
			? candidate.responses_before_comment
			: undefined;
	if (responsesBeforeComment !== undefined) {
		normalized.responsesBeforeComment = Math.trunc(responsesBeforeComment);
	}

	return normalized;
}

function stableCommentContext(input: CommentEventContext): Record<string, unknown> {
	const properties: Record<string, unknown> = {
		question_id: input.questionId,
		comment_kind: input.commentKind,
		surface: input.surface,
		is_anonymous: input.isAnonymous
	};

	if (input.questionUrl) properties.question_url = input.questionUrl;
	if (input.sourcePath) properties.source_path = input.sourcePath;
	if (input.campaign) properties.campaign = input.campaign;
	if (typeof input.featureRunId === 'number' && Number.isSafeInteger(input.featureRunId)) {
		properties.feature_run_id = input.featureRunId;
	}

	return properties;
}

/** Records the first non-whitespace edit in one composer lifecycle. */
export function captureCommentStarted(input: CommentEventContext): Promise<void> {
	return capture('comment_started', stableCommentContext(input));
}

/** Records only bounded failure labels, never exceptions or submitted text. */
export function captureCommentFailed(input: CaptureCommentFailedInput): Promise<void> {
	return capture('comment_failed', {
		...stableCommentContext(input),
		failure_stage: input.failureStage,
		error_category: input.errorCategory
	});
}

/**
 * Records a canonical comment conversion only after the server has returned
 * the inserted comment id. No comment text, fingerprint, email, or IP is sent.
 */
export function captureCommentCreated(input: CaptureCommentCreatedInput): Promise<void> {
	const commentId = normalizeCommentId(input.commentId);
	if (commentId === null) return Promise.resolve();
	const inviteId = normalizeQuestionInviteId(input.inviteId);

	const properties: Record<string, unknown> = {
		...stableCommentContext(input),
		comment_id: commentId,
		parent_type: input.parentType,
		is_first_contribution: input.commentKind === 'answer',
		server_confirmed: true
	};

	if (input.isFirstCommentEver !== undefined) {
		properties.is_first_comment_ever = input.isFirstCommentEver;
	}
	if (input.isFirstCommentOnQuestion !== undefined) {
		properties.is_first_comment_on_question = input.isFirstCommentOnQuestion;
	}
	if (input.isReply !== undefined) properties.is_reply = input.isReply;

	const questionAgeHours = normalizeNonNegativeNumber(input.questionAgeHours);
	if (questionAgeHours !== undefined) properties.question_age_hours = questionAgeHours;

	const responsesBeforeComment = normalizeNonNegativeNumber(input.responsesBeforeComment);
	if (responsesBeforeComment !== undefined) {
		properties.responses_before_comment = Math.trunc(responsesBeforeComment);
	}
	if (inviteId) {
		properties.invite_id = inviteId;
		properties.acquisition_source = 'question_invite';
	}

	const events = [capture('comment_created', properties)];
	if (inviteId && input.commentKind === 'answer') {
		events.push(
			capture('question_invite_recipient_answered', {
				invite_id: inviteId,
				comment_id: commentId,
				question_id: input.questionId,
				question_url: input.questionUrl,
				surface: input.surface,
				is_anonymous: input.isAnonymous,
				server_confirmed: true
			})
		);
	}

	return Promise.all(events).then(() => undefined);
}
