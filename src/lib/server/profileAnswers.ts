// src/lib/server/profileAnswers.ts
//
// The "answered questions" list on /users/[externalId].
//
// Give-first rule: a take's text is only for people who answered the same
// question, so a public profile must not become a side door to it. Visitors
// get the questions a user answered (titles that link to the question, where
// the wall applies as usual). The profile owner and admins also get the text.
//
// Take text is readable only by the service role, so callers pass the
// service-role client and must decide `includeText` from the verified session,
// never from request input.
import type { SupabaseClient } from '@supabase/supabase-js';

type DynamicClient = any;

/** Generous cap; the most active account has a few dozen takes. */
export const PROFILE_ANSWER_LIMIT = 200;

export interface ProfileAnswer {
	id: number;
	url: string;
	question: string;
	question_formatted: string | null;
	/** Only present when the viewer may read the text (owner or admin). */
	comment?: string;
}

interface TakeRow {
	id: number;
	parent_id: number | null;
	comment?: string | null;
}

interface QuestionRow {
	id: number;
	question: string | null;
	question_formatted: string | null;
	url: string | null;
}

export interface ProfileViewer {
	id?: string | null;
	admin?: boolean | null;
}

/** The owner and admins may read a profile's take text; nobody else. */
export function canSeeProfileTakeText(
	viewer: ProfileViewer | null | undefined,
	profileUserId: string
): boolean {
	if (!viewer?.id || !profileUserId) return false;
	return viewer.id === profileUserId || viewer.admin === true;
}

/**
 * Pure assembly, kept separate from the queries so the give-first shape is
 * unit-testable: newest first, only takes on live questions, text only when
 * `includeText`, and one row per question for visitors.
 */
export function buildProfileAnswers(
	takes: TakeRow[],
	questionsById: Map<number, QuestionRow>,
	includeText: boolean
): ProfileAnswer[] {
	const seenQuestions = new Set<number>();
	const answers: ProfileAnswer[] = [];

	for (const take of takes) {
		if (take.parent_id == null) continue;
		const question = questionsById.get(take.parent_id);
		if (!question?.url) continue;

		const title = (question.question_formatted || question.question || '').trim();
		if (!title) continue;

		if (!includeText) {
			// A visitor sees which questions were answered, not how often.
			if (seenQuestions.has(question.id)) continue;
			seenQuestions.add(question.id);
		}

		const answer: ProfileAnswer = {
			id: take.id,
			url: question.url,
			question: question.question ?? title,
			question_formatted: question.question_formatted
		};
		if (includeText) {
			answer.comment = take.comment ?? '';
		}
		answers.push(answer);
	}

	return answers;
}

export async function loadProfileAnswers(
	serviceClient: SupabaseClient,
	options: { authorId: string; demoTime: boolean; includeText: boolean }
): Promise<ProfileAnswer[]> {
	const { authorId, demoTime, includeText } = options;
	if (!authorId) return [];

	const db = serviceClient as DynamicClient;
	const commentsTable = demoTime ? 'comments_demo' : 'comments';
	const questionsTable = demoTime ? 'questions_demo' : 'questions';

	// The text column is only selected when the viewer may see it, so a
	// visitor's payload never carries it, even by accident.
	const { data: takes, error: takesError } = await db
		.from(commentsTable)
		.select(includeText ? 'id, parent_id, created_at, comment' : 'id, parent_id, created_at')
		.eq('author_id', authorId)
		.eq('parent_type', 'question')
		.eq('removed', false)
		.order('created_at', { ascending: false })
		.limit(PROFILE_ANSWER_LIMIT);

	if (takesError) {
		console.warn('Failed to load profile answers', takesError);
		return [];
	}

	const takeRows = (takes ?? []) as TakeRow[];
	const questionIds = [
		...new Set(takeRows.map((row) => row.parent_id).filter((id): id is number => id != null))
	];
	if (!questionIds.length) return [];

	// The service role bypasses RLS, so the live-question filters are explicit.
	const { data: questions, error: questionsError } = await db
		.from(questionsTable)
		.select('id, question, question_formatted, url')
		.in('id', questionIds)
		.not('removed', 'is', true)
		.not('flagged', 'is', true);

	if (questionsError) {
		console.warn('Failed to load profile answer questions', questionsError);
		return [];
	}

	const questionsById = new Map(
		((questions ?? []) as QuestionRow[]).map((question) => [question.id, question])
	);

	return buildProfileAnswers(takeRows, questionsById, includeText);
}
