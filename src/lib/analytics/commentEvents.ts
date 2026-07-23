// src/lib/analytics/commentEvents.ts
import { capture } from '$lib/analytics/posthog';

export type CommentCreatedSurface = 'homepage' | 'question_page' | 'strategic_question';
export type CommentCreatedKind = 'answer' | 'comment' | 'reply';

type CaptureCommentCreatedInput = {
	commentId: unknown;
	questionId: number;
	questionUrl?: string;
	parentType: 'question' | 'comment';
	commentKind: CommentCreatedKind;
	surface: CommentCreatedSurface;
	sourcePath?: string;
	campaign?: string;
	isAnonymous: boolean;
};

function normalizeCommentId(value: unknown): number | string | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim()) return value.trim();
	return null;
}

/**
 * Records a canonical comment conversion only after the server has returned
 * the inserted comment id. No comment text, fingerprint, email, or IP is sent.
 */
export function captureCommentCreated(input: CaptureCommentCreatedInput): Promise<void> {
	const commentId = normalizeCommentId(input.commentId);
	if (commentId === null) return Promise.resolve();

	const properties: Record<string, unknown> = {
		comment_id: commentId,
		question_id: input.questionId,
		parent_type: input.parentType,
		comment_kind: input.commentKind,
		surface: input.surface,
		is_first_contribution: input.commentKind === 'answer',
		is_anonymous: input.isAnonymous,
		server_confirmed: true
	};

	if (input.questionUrl) properties.question_url = input.questionUrl;
	if (input.sourcePath) properties.source_path = input.sourcePath;
	if (input.campaign) properties.campaign = input.campaign;

	return capture('comment_created', properties);
}
