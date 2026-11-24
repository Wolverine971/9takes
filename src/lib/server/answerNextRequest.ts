// src/lib/server/answerNextRequest.ts
//
// Shared request parsing for the "answer the next one" endpoints
// (/api/questions/next, /api/questions/live/[slug]).
import { z } from 'zod';

const slugSchema = z
	.string()
	.trim()
	.min(1)
	.max(160)
	.regex(/^[a-z0-9-]+$/i);

// Same-site path of the page the card sits on (funnel attribution), the same
// shape the Chorus mirror accepts. Never a private URL: callers pass a public page.
const pathSchema = z
	.string()
	.max(300)
	.regex(/^\/[a-zA-Z0-9\-_/]*$/);

/** Where gate_shown and contributions land when the page path is missing or invalid. */
export const ANSWER_NEXT_FALLBACK_PATH = '/questions';

/** Cap on how many slugs the client may ask to skip (its chain so far). */
const SKIP_LIMIT = 10;

export function parseQuestionSlug(value: unknown): string | null {
	const parsed = slugSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}

export function parseSourcePath(value: unknown): string {
	const parsed = pathSchema.safeParse(value);
	return parsed.success ? parsed.data : ANSWER_NEXT_FALLBACK_PATH;
}

/** `skip=a,b,c`: valid slugs only, deduped, capped. */
export function parseSkipList(value: string | null): string[] {
	if (!value) return [];
	const slugs = value
		.split(',')
		.map(parseQuestionSlug)
		.filter((slug): slug is string => slug !== null);
	return [...new Set(slugs)].slice(0, SKIP_LIMIT);
}
