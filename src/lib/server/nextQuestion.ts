// src/lib/server/nextQuestion.ts
//
// "Answer the next one": after a visitor's take unlocks a reveal (a celebrity
// page's Chorus, the homepage card), offer one more question they haven't
// answered, answerable in place. The 2026-11-20 baseline found 0 of 21 people
// who answered went on to a second question; this is the step after the reveal.
//
// Candidates are DJ's curated starter questions (questions.starter_rank) first,
// then other open questions with a real room behind them (MIN_TAKES or more).
// The raw most-answered list has weak and political questions in its tail, and
// a chain only needs a few. Each tier is rotated by the question just answered
// so different pages lead to different next questions. "Not answered yet" is
// the give-first gate's own rule (can_see_comments_3), checked a few at a time.
import { checkUserAnswered } from '$lib/server/questionComments';
import type { LiveViewer } from '$lib/server/homepageLiveTake';

/** Most candidates read per pick. */
export const NEXT_QUESTION_POOL_SIZE = 16;
/** A non-starter question needs this many takes to be offered. */
export const MIN_TAKES = 10;
/** Gate checks run this many candidates at a time. */
const CHECK_BATCH = 4;

export type NextQuestion = {
	url: string;
	title: string;
	responses: number;
};

type QuestionRow = {
	url: string | null;
	question: string | null;
	question_formatted: string | null;
	comment_count: number | null;
	starter_rank: number | null;
	id: number;
};

// The generated database types lag the questions columns used here.
type Db = any;

/** Stable small hash so a page always leads to the same next question first. */
export function rotationOffset(seed: string, size: number): number {
	if (size <= 0) return 0;
	let hash = 0;
	for (let index = 0; index < seed.length; index += 1) {
		hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
	}
	return hash % size;
}

function rotate<T>(items: readonly T[], seed: string): T[] {
	const offset = rotationOffset(seed, items.length);
	return [...items.slice(offset), ...items.slice(0, offset)];
}

/**
 * The pool in visiting order: starters first, then the rest, each tier rotated
 * by the question just answered, minus that question and anything skipped.
 */
export function orderCandidates<T extends { url: string; starter: boolean }>(
	pool: readonly T[],
	afterSlug: string | null,
	skip: ReadonlySet<string>
): T[] {
	const seed = afterSlug ?? '';
	const ordered = [
		...rotate(
			pool.filter((item) => item.starter),
			seed
		),
		...rotate(
			pool.filter((item) => !item.starter),
			seed
		)
	];
	return ordered.filter((item) => item.url !== afterSlug && !skip.has(item.url));
}

async function loadPool(db: Db): Promise<(NextQuestion & { id: number; starter: boolean })[]> {
	const { data, error } = await db
		.from('questions')
		.select('id, url, question, question_formatted, comment_count, starter_rank')
		.not('url', 'is', null)
		.not('flagged', 'is', true)
		.not('removed', 'is', true)
		.or(`starter_rank.not.is.null,comment_count.gte.${MIN_TAKES}`)
		.order('starter_rank', { ascending: true, nullsFirst: false })
		.order('comment_count', { ascending: false })
		.limit(NEXT_QUESTION_POOL_SIZE);
	if (error) throw new Error(error.message ?? 'Failed to load questions');
	return ((data ?? []) as QuestionRow[]).flatMap((row) => {
		const title = row.question_formatted?.trim() || row.question?.trim();
		if (!row.url || !title) return [];
		return [
			{
				id: row.id,
				url: row.url,
				title,
				responses: row.comment_count ?? 0,
				starter: row.starter_rank != null
			}
		];
	});
}

/**
 * The next question this viewer hasn't answered, or null when every candidate
 * is answered (or none can be read). A viewer with no identity yet gets the
 * first candidate: they can't have answered anything the gate would know about.
 */
export async function pickNextQuestion(
	db: Db,
	options: { afterSlug: string | null; skip?: readonly string[]; viewer: LiveViewer }
): Promise<NextQuestion | null> {
	const candidates = orderCandidates(
		await loadPool(db),
		options.afterSlug,
		new Set(options.skip ?? [])
	);
	const { fingerprint, userId } = options.viewer;
	if (!fingerprint && !userId) {
		const first = candidates[0];
		return first ? { url: first.url, title: first.title, responses: first.responses } : null;
	}

	for (let start = 0; start < candidates.length; start += CHECK_BATCH) {
		const batch = candidates.slice(start, start + CHECK_BATCH);
		const answered = await Promise.all(
			batch.map((candidate) =>
				checkUserAnswered(fingerprint ?? undefined, candidate.id, userId ?? undefined, db).then(
					Boolean,
					// An unreadable gate counts as answered: never offer a question we can't vouch for.
					() => true
				)
			)
		);
		const open = batch.find((_, index) => !answered[index]);
		if (open) return { url: open.url, title: open.title, responses: open.responses };
	}
	return null;
}
