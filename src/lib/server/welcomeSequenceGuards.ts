import { enrollUserInWelcomeSequence, exitWelcomeSequenceForUser } from './emailSequences';

export type WelcomeSequenceExitReason =
	| 'created_question'
	| 'answered_question'
	| 'created_comment';

export function getWelcomeSequenceExitReasonForComment(parentType: string): WelcomeSequenceExitReason {
	return parentType === 'question' ? 'answered_question' : 'created_comment';
}

export async function safelyEnrollUserInWelcomeSequence({
	userId,
	email,
	onError
}: {
	userId?: string | null;
	email: string;
	onError?: (error: unknown) => void;
}): Promise<boolean> {
	if (!userId) {
		return false;
	}

	try {
		await enrollUserInWelcomeSequence(userId, email);
		return true;
	} catch (error) {
		onError?.(error);
		return false;
	}
}

export async function safelyExitWelcomeSequenceForQuestionCreation({
	userId,
	onError
}: {
	userId?: string | null;
	onError?: (error: unknown) => void;
}): Promise<boolean> {
	if (!userId) {
		return false;
	}

	try {
		await exitWelcomeSequenceForUser(userId, 'created_question');
		return true;
	} catch (error) {
		onError?.(error);
		return false;
	}
}

export async function safelyExitWelcomeSequenceForCommentCreation({
	userId,
	parentType,
	onError
}: {
	userId?: string | null;
	parentType: string;
	onError?: (error: unknown, exitReason: WelcomeSequenceExitReason) => void;
}): Promise<WelcomeSequenceExitReason | null> {
	if (!userId) {
		return null;
	}

	const exitReason = getWelcomeSequenceExitReasonForComment(parentType);

	try {
		await exitWelcomeSequenceForUser(userId, exitReason);
		return exitReason;
	} catch (error) {
		onError?.(error, exitReason);
		return null;
	}
}
