// src/lib/server/questionEditorial.ts
type QuestionEditorialMetadata = Record<string, unknown> | null;

export type EditorialQuestionState = {
	data?: unknown;
	flagged?: boolean | null;
	removed?: boolean | null;
};

export function questionEditorialMetadata(data: unknown): QuestionEditorialMetadata {
	return data && typeof data === 'object' && !Array.isArray(data)
		? (data as Record<string, unknown>)
		: null;
}

export function isQuestionEditoriallyApproved(data: unknown): boolean {
	const metadata = questionEditorialMetadata(data);
	return metadata?.source !== 'chorus' || metadata.editorial_status === 'approved';
}

export function isQuestionPubliclyEligible(question: EditorialQuestionState): boolean {
	return (
		question.removed !== true &&
		question.flagged !== true &&
		isQuestionEditoriallyApproved(question.data)
	);
}
