// src/lib/server/welcomeSequenceGuards.ts
import {
	enrollUserInWelcomeSequence,
	exitWelcomeSequenceForUser,
	processSequenceEnrollmentNow
} from './emailSequences';

export async function safelyEnrollUserInWelcomeSequence({
	userId,
	email,
	onError
}: {
	userId?: string | null;
	email: string;
	onError?: (error: unknown) => void;
}): Promise<string | null> {
	if (!userId) {
		return null;
	}

	try {
		return await enrollUserInWelcomeSequence(userId, email);
	} catch (error) {
		onError?.(error);
		return null;
	}
}

export async function safelyProcessWelcomeSequenceEnrollmentNow({
	enrollmentId,
	onError
}: {
	enrollmentId?: string | null;
	onError?: (error: unknown) => void;
}): Promise<boolean> {
	if (!enrollmentId) {
		return false;
	}

	try {
		const summary = await processSequenceEnrollmentNow(enrollmentId);
		return summary.sent > 0;
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
