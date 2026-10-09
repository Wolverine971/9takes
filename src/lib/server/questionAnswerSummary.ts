// src/lib/server/questionAnswerSummary.ts
//
// "The gist so far": one AI-written paraphrase per question of how people
// answered it (T-43, DJ's 2026-10-07 decision). It is the gated content of a
// question page:
//   * humans see it only AFTER they post their own take (top of the revealed
//     thread), never before;
//   * IP-verified Googlebot gets the same block so the page has indexable
//     substance, under Google's paywall / content-gating pattern.
// Because the block is indexable, it must never expose anyone's words: no
// quotes, no verbatim runs (enforced in code below, not just in the prompt),
// no names or identifying details, no claims about a specific person.
//
// Transport-agnostic like nineTakesGenerator.ts: callers inject the Supabase
// client and the LLM caller, so scripts/gen-question-summaries.ts can share
// this module. Keep it free of $env, $lib aliases and SvelteKit imports.

export const ANSWER_SUMMARY_TABLE = 'question_answer_summaries';

/** Primary model first; OpenRouter falls through the list on provider errors. */
export const SUMMARY_MODELS = [
	'anthropic/claude-sonnet-5.5',
	'anthropic/claude-haiku-4.5'
] as const;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SUMMARY_TEMPERATURE = 0.5;
// Reasoning tokens count against max_tokens, so leave room beyond the ~300
// words of JSON the summary itself needs.
const SUMMARY_MAX_TOKENS = 3000;
const SUMMARY_CALL_TIMEOUT_MS = 60_000;

export const SUMMARY_TARGET_WORDS = { min: 80, max: 200 } as const;
// Validation is a little looser than the prompt target so a 78-word summary
// of a one-answer question isn't thrown away.
const SUMMARY_MIN_WORDS = 50;
const SUMMARY_MAX_WORDS = 230;
/** Any run of this many words shared with a source take rejects the summary. */
export const VERBATIM_SPAN_WORDS = 6;
const MAX_TAKES_IN_PROMPT = 80;
const MAX_TAKE_CHARS = 700;
const MAX_AI_TAKE_CHARS = 500;
// Three tries: the guards reject a fair share of first drafts on long threads
// (usually for singling out one answer), and a failure is remembered per take
// count, so a stubborn thread costs three calls once, not every hour.
export const DEFAULT_SUMMARY_ATTEMPTS = 3;
const PAGE_SIZE = 1000;
const IN_CHUNK = 150;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal shape of the Supabase client this module uses. */
export type SummaryDb = { from: (table: string) => any };

export type SummaryQuestion = {
	id: number;
	url: string | null;
	text: string;
	/** Asker-provided context, only when the page shows it publicly. */
	context: string | null;
};

export type SummaryTake = {
	id: number;
	text: string;
	/** Opaque per-person key so the model can count people, not posts. */
	personKey: string;
	/** Enneagram type from the author's profile, when set. */
	type: number | null;
	createdAt: string;
};

export type AiReferenceTake = { type: number; text: string };

/** What a page load returns. Never includes the model or anything per-user. */
export type PublicAnswerSummary = {
	summary: string;
	sourceCommentCount: number;
	generatedAt: string;
};

export type SummaryLlmRequest = {
	systemPrompt: string;
	userPrompt: string;
	temperature: number;
	attempt: number;
};

export type SummaryLlmUsage = {
	promptTokens: number;
	completionTokens: number;
	/** USD, when OpenRouter reports it. */
	cost: number | null;
};

export type SummaryLlm = (
	request: SummaryLlmRequest
) => Promise<{ content: string; model: string | null; usage?: SummaryLlmUsage | null }>;

/**
 * `reason` is safe to log (no user text). `feedback` may quote the offending
 * words back to the model on the retry and is never logged or stored.
 */
export type SummaryValidation =
	{ ok: true; text: string } | { ok: false; reason: string; feedback?: string };

export type GenerateSummaryResult =
	| {
			ok: true;
			summary: string;
			model: string | null;
			attempts: number;
			/** Loggable reasons earlier drafts were rejected (no user text). */
			rejected: string[];
	  }
	| { ok: false; reason: string; attempts: number };

// ---------------------------------------------------------------------------
// Page reads (service-role client; table is RLS-locked with no policies)
// ---------------------------------------------------------------------------

/**
 * The stored summary for one question, or null. Never throws: a missing table
 * (code deployed before the migration) or any read error just means "no gist".
 * Call only for a viewer who has answered or a verified crawler.
 */
export async function getQuestionAnswerSummary(
	db: SummaryDb,
	questionId: number
): Promise<PublicAnswerSummary | null> {
	try {
		const { data, error } = await db
			.from(ANSWER_SUMMARY_TABLE)
			.select('summary, source_comment_count, generated_at')
			.eq('question_id', questionId)
			.not('summary', 'is', null)
			.maybeSingle();
		if (error || !data) return null;
		const summary = typeof data.summary === 'string' ? data.summary.trim() : '';
		if (!summary) return null;
		return {
			summary,
			sourceCommentCount: Math.max(0, Number(data.source_comment_count) || 0),
			generatedAt: String(data.generated_at ?? '')
		};
	} catch {
		return null;
	}
}

/**
 * Whether a summary exists, without reading its text. Used for the paywall
 * structured data on the locked page so every version of the page carries the
 * same markup while the gated text itself never leaves the server.
 */
export async function hasQuestionAnswerSummary(
	db: SummaryDb,
	questionId: number
): Promise<boolean> {
	try {
		const { data, error } = await db
			.from(ANSWER_SUMMARY_TABLE)
			.select('question_id')
			.eq('question_id', questionId)
			.not('summary', 'is', null)
			.maybeSingle();
		return !error && Boolean(data);
	} catch {
		return false;
	}
}

// ---------------------------------------------------------------------------
// Source data
// ---------------------------------------------------------------------------

function cleanText(value: unknown): string {
	return String(value ?? '')
		.replace(/\s+/g, ' ')
		.trim();
}

function truncate(value: string, max: number): string {
	return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;
}

function chunk<T>(items: T[], size: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
	return out;
}

/** Live = not flagged and not removed (flagged questions 404 on the page). */
export async function loadLiveQuestions(
	db: SummaryDb,
	questionIds?: number[] | null
): Promise<SummaryQuestion[]> {
	let query = db
		.from('questions')
		.select('id, url, question, question_formatted, context, data')
		.not('flagged', 'is', true)
		.not('removed', 'is', true);
	if (questionIds?.length) query = query.in('id', questionIds);
	const { data, error } = await query.order('id', { ascending: true });
	if (error) throw new Error(`Could not load questions: ${error.message ?? error}`);

	return ((data ?? []) as any[])
		.map((row) => {
			const userProvidedContext = Boolean(
				row.data && typeof row.data === 'object' && row.data.userProvidedContext === true
			);
			return {
				id: Number(row.id),
				url: row.url ?? null,
				text: cleanText(row.question_formatted || row.question),
				context: userProvidedContext ? cleanText(row.context) || null : null
			};
		})
		.filter((question) => question.text);
}

/**
 * Human takes per question. A human take is a top-level answer
 * (parent_type 'question') in the real `comments` table (never the demo or AI
 * tables) that is not removed, has text, and has no open user report
 * (flagged_comments row not yet cleared). Replies are conversation, not
 * answers, so they don't count. The host's own takes do count: they are real
 * answers and show in the revealed thread like any other.
 */
export async function loadHumanTakes(
	db: SummaryDb,
	questionIds: number[]
): Promise<Map<number, SummaryTake[]>> {
	const byQuestion = new Map<number, SummaryTake[]>();
	if (!questionIds.length) return byQuestion;

	const rows: any[] = [];
	for (const ids of chunk(questionIds, IN_CHUNK)) {
		for (let from = 0; ; from += PAGE_SIZE) {
			const { data, error } = await db
				.from('comments')
				.select('id, parent_id, comment, author_id, fingerprint, created_at')
				.eq('parent_type', 'question')
				.in('parent_id', ids)
				.not('removed', 'is', true)
				.order('id', { ascending: true })
				.range(from, from + PAGE_SIZE - 1);
			if (error) throw new Error(`Could not load takes: ${error.message ?? error}`);
			rows.push(...(data ?? []));
			if (!data || data.length < PAGE_SIZE) break;
		}
	}

	const withText = rows.filter((row) => cleanText(row.comment));
	const reported = new Set<number>();
	for (const ids of chunk(
		withText.map((row) => Number(row.id)),
		IN_CHUNK
	)) {
		const { data, error } = await db
			.from('flagged_comments')
			.select('comment_id, cleared_at')
			.in('comment_id', ids);
		if (error) throw new Error(`Could not load take reports: ${error.message ?? error}`);
		for (const flag of data ?? []) {
			if (!flag.cleared_at) reported.add(Number(flag.comment_id));
		}
	}

	const authorIds = [...new Set(withText.map((row) => row.author_id).filter(Boolean))] as string[];
	const typeByAuthor = new Map<string, number>();
	const adminAuthors = new Set<string>();
	for (const ids of chunk(authorIds, IN_CHUNK)) {
		const { data, error } = await db.from('profiles').select('id, enneagram, admin').in('id', ids);
		if (error) throw new Error(`Could not load author types: ${error.message ?? error}`);
		for (const profile of data ?? []) {
			const type = String(profile.enneagram ?? '').trim();
			if (/^[1-9]$/.test(type)) typeByAuthor.set(String(profile.id), Number(type));
			if (profile.admin === true) adminAuthors.add(String(profile.id));
		}
	}

	for (const row of withText) {
		const id = Number(row.id);
		if (reported.has(id)) continue;
		const questionId = Number(row.parent_id);
		const take: SummaryTake = {
			id,
			text: cleanText(row.comment),
			// Every admin account is the host (DJ has more than one), so his
			// takes can't pass the two-people bar for naming a type alone.
			personKey: row.author_id
				? adminAuthors.has(String(row.author_id))
					? 'host'
					: `a:${row.author_id}`
				: row.fingerprint
					? `f:${row.fingerprint}`
					: `c:${id}`,
			type: row.author_id ? (typeByAuthor.get(String(row.author_id)) ?? null) : null,
			createdAt: String(row.created_at ?? '')
		};
		const list = byQuestion.get(questionId) ?? [];
		list.push(take);
		byQuestion.set(questionId, list);
	}
	return byQuestion;
}

/** The nine AI per-type takes, used only as context for each type's angle. */
export async function loadAiReferenceTakes(
	db: SummaryDb,
	questionId: number
): Promise<AiReferenceTake[]> {
	const { data, error } = await db
		.from('comments_ai')
		.select('enneagram_type, comment')
		.eq('question_id', questionId);
	if (error) return [];
	const byType = new Map<number, string>();
	for (const row of (data ?? []) as any[]) {
		const type = Number(String(row.enneagram_type ?? '').trim());
		const text = cleanText(row.comment);
		if (Number.isInteger(type) && type >= 1 && type <= 9 && text && !byType.has(type)) {
			byType.set(type, text);
		}
	}
	return [...byType.entries()].sort(([a], [b]) => a - b).map(([type, text]) => ({ type, text }));
}

export type ExistingSummaryState = {
	/** Human takes the stored summary covers; null when no summary is stored. */
	summaryCount: number | null;
	/** Live take count at the last failed generation, if any. */
	failedCount: number | null;
};

export async function loadExistingSummaries(
	db: SummaryDb,
	questionIds: number[]
): Promise<Map<number, ExistingSummaryState>> {
	const states = new Map<number, ExistingSummaryState>();
	for (const ids of chunk(questionIds, IN_CHUNK)) {
		const { data, error } = await db
			.from(ANSWER_SUMMARY_TABLE)
			.select('question_id, summary, source_comment_count, failed_comment_count')
			.in('question_id', ids);
		if (error) throw new Error(`Could not load existing summaries: ${error.message ?? error}`);
		for (const row of data ?? []) {
			const hasSummary = typeof row.summary === 'string' && row.summary.trim().length > 0;
			const failed = row.failed_comment_count;
			states.set(Number(row.question_id), {
				summaryCount: hasSummary ? Number(row.source_comment_count) || 0 : null,
				failedCount: failed === null || failed === undefined ? null : Number(failed)
			});
		}
	}
	return states;
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

const BANNED_PHRASES = [
	'delve',
	'tapestry',
	'testament',
	'multifaceted',
	'nuanced',
	'landscape',
	'resonates',
	'navigate the complexities',
	'at its core',
	'shed light',
	'in summary',
	'in conclusion',
	"it's important to note",
	'interestingly',
	'as an ai',
	'language model',
	'childhood wound',
	'core wound',
	// Prompt plumbing the reader can't see.
	'reference take',
	'nameable',
	'gist so far',
	'9takes'
];

// Phrasings that describe one specific answer. On a thread of 3+ takes there is
// always a broader way to say it; on a thinner thread "one answer" is just
// the count, so the check only runs from 3 takes up.
const SINGLES_OUT =
	/\b(?:the outlier|one person|a single (?:answer|take|person)|the only one|(?:only|just) one (?:answer|take|person)|one (?:answer|take) \w+(?:s|ed)|another (?:one |answer |take |person )?\w+(?:s|ed))\b/i;
const SINGLES_OUT_MIN_TAKES = 3;

export function buildSummarySystemPrompt(): string {
	return `You write "The gist so far" for 9takes, an anonymous Q&A site built on one rule: you answer a question before you can see anyone else's answer. The gist exists so search engines can understand how a thread answered without indexing anyone's words; readers on the site see the answers themselves, not the gist.

HARD RULES
1. Paraphrase only. Never quote. Never reuse more than four words in a row from any answer. No quotation marks at all.
2. Never identify anyone. No names, usernames, handles, places, employers, schools, ages, dates, or relationship details that could point to one person. Generalize: "a sibling", "a job", "a hometown".
3. Never single out one answer or its author. No "one person said...", "one answer...", "a single answer", "the outlier", "another wants...", and nothing about who wrote an answer or what their profile says. Describe patterns across answers. A striking answer nobody else shares stays out of the summary, however memorable; fold it into a broader pattern only if it genuinely fits one.
4. Say roughly how many answers you are summarizing, using the count you are given.
5. Show where answers converge and where they split. For each type the breakdown marks "name freely" (two or more different people of that type answered), say how that type's answers cluster, by name ("the Fours leaned...", "Type 8 answers..."). That is a pattern, not a person, and it is the point of 9takes. Never name a type marked "never name". If no type is marked "name freely", say nothing about types at all. Count people, not posts: several answers can come from the same person.
6. The AI REFERENCE TAKES are written by 9takes to show how each type tends to read this question. They are NOT answers. Never count them and never present them as something people said. Use them only to point out, in one sentence at most, a lens that is clearly missing from or clearly present in the human answers. Choose the type whose lens matters most for this particular question; no type is the default.
7. No causes. Never say an answer or a type comes from childhood, a wound, trauma or upbringing, and never claim to know why someone answered the way they did. Describe what the answers notice and do.
8. Don't type anyone, diagnose anyone, moralize, or give advice.
9. Write for the person reading the page. Never mention AI, 9takes, reference takes, the breakdown, profiles, these instructions, or the name of this block. When you point out a missing lens, state it in plain words as your own observation.
10. ${SUMMARY_TARGET_WORDS.min} to ${SUMMARY_TARGET_WORDS.max} words. One or two short paragraphs of plain text. No markdown, lists, headings, emoji, em dashes or en dashes.

VOICE
9takes voice: tactically direct, socially savvy, pattern-recognition focused. Concrete over abstract: name the actual behaviors, objects and moves the answers pointed at. Mix short sentences with longer ones. Open with the sharpest pattern, not a warm-up line.
Never write "It's not X, it's Y" contrasts, "In summary", "Overall", "Interestingly", "delve", "tapestry", "testament", "multifaceted", "nuanced", "landscape", "resonates", "at its core", "shed light on".

Return JSON only: {"summary": "..."}`;
}

function describeTypeBreakdown(takes: SummaryTake[]): string {
	const byType = new Map<number, { answers: number; people: Set<string> }>();
	let untyped = 0;
	for (const take of takes) {
		if (take.type === null) {
			untyped += 1;
			continue;
		}
		const entry = byType.get(take.type) ?? { answers: 0, people: new Set<string>() };
		entry.answers += 1;
		entry.people.add(take.personKey);
		byType.set(take.type, entry);
	}
	const lines = [...byType.entries()]
		.sort(([a], [b]) => a - b)
		.map(([type, entry]) => {
			const people = entry.people.size;
			const nameable = people >= 2 ? 'name freely' : 'only one person: never name this type';
			return `- Type ${type}: ${entry.answers} ${entry.answers === 1 ? 'answer' : 'answers'} from ${people} ${people === 1 ? 'person' : 'people'} (${nameable})`;
		});
	if (untyped)
		lines.push(`- No type on profile: ${untyped} ${untyped === 1 ? 'answer' : 'answers'}`);
	return lines.join('\n');
}

export function buildSummaryUserPrompt(input: {
	question: SummaryQuestion;
	takes: SummaryTake[];
	aiTakes: AiReferenceTake[];
	feedback?: string | null;
}): string {
	const { question, aiTakes, feedback } = input;
	// Newest first so a long thread keeps its freshest answers in the prompt.
	const takes = [...input.takes]
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
		.slice(0, MAX_TAKES_IN_PROMPT);
	const total = input.takes.length;
	const people = new Set(input.takes.map((take) => take.personKey)).size;

	const personLabels = new Map<string, string>();
	const label = (key: string) => {
		if (!personLabels.has(key)) personLabels.set(key, `P${personLabels.size + 1}`);
		return personLabels.get(key)!;
	};

	const parts = [`QUESTION: ${question.text}`];
	if (question.context) parts.push(`CONTEXT FROM THE ASKER: ${question.context}`);
	parts.push(
		`HUMAN ANSWERS: ${total} ${total === 1 ? 'answer' : 'answers'} from ${people} different ${people === 1 ? 'person' : 'people'}.${
			total > takes.length ? ` The ${takes.length} newest are listed.` : ''
		}`
	);
	const breakdown = describeTypeBreakdown(input.takes);
	if (breakdown) parts.push(`TYPE BREAKDOWN:\n${breakdown}`);
	parts.push(
		`ANSWERS (answer | type | person):\n${takes
			.map(
				(take, index) =>
					`A${index + 1} | ${take.type ? `Type ${take.type}` : 'no type'} | ${label(take.personKey)} | ${truncate(take.text, MAX_TAKE_CHARS)}`
			)
			.join('\n')}`
	);
	if (aiTakes.length) {
		parts.push(
			`AI REFERENCE TAKES (not answers; context for each type's lens only):\n${aiTakes
				.map((take) => `Type ${take.type}: ${truncate(take.text, MAX_AI_TAKE_CHARS)}`)
				.join('\n')}`
		);
	}
	if (total <= 2) {
		parts.push(
			`THIN THREAD: with only ${total} ${total === 1 ? 'answer' : 'answers'}, do not retell or characterize any answer in detail, and say nothing about who wrote it. Name the general direction in one short abstract clause, then spend the rest on which lenses this question usually draws (from the AI reference takes) that have not shown up yet.`
		);
	}
	if (feedback) {
		parts.push(
			`YOUR LAST DRAFT WAS REJECTED: ${feedback}. Write a new summary from scratch that fixes this.`
		);
	}
	parts.push('Return JSON only: {"summary": "..."}');
	return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

/** Lowercased word tokens with punctuation and apostrophes dropped. */
export function overlapTokens(text: string): string[] {
	return text
		.toLowerCase()
		.replace(/[’'`]/g, '')
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.split(' ')
		.filter(Boolean);
}

function ngrams(tokens: string[], size: number): string[] {
	const out: string[] = [];
	for (let i = 0; i + size <= tokens.length; i += 1) out.push(tokens.slice(i, i + size).join(' '));
	return out;
}

/**
 * The first run of `spanWords` words the summary shares with any source take,
 * after normalizing case and punctuation, or null. Runs that also appear in
 * `allowedTexts` (the public question and its context) don't count: echoing
 * the question's own wording exposes nobody.
 */
export function findVerbatimSpan(
	summary: string,
	sources: string[],
	options: { spanWords?: number; allowedTexts?: string[] } = {}
): string | null {
	const size = options.spanWords ?? VERBATIM_SPAN_WORDS;
	const allowed = new Set(
		(options.allowedTexts ?? []).flatMap((text) => ngrams(overlapTokens(text), size))
	);
	const sourceGrams = new Set<string>();
	for (const source of sources) {
		for (const gram of ngrams(overlapTokens(source), size)) {
			if (!allowed.has(gram)) sourceGrams.add(gram);
		}
	}
	if (!sourceGrams.size) return null;
	return ngrams(overlapTokens(summary), size).find((gram) => sourceGrams.has(gram)) ?? null;
}

// Capitalized words that are not identifying when they show up mid-sentence.
const COMMON_CAPITALIZED = new Set(
	[
		'i',
		"i'm",
		"i've",
		"i'd",
		"i'll",
		'im',
		'ive',
		'type',
		'types',
		'enneagram',
		'god',
		'jesus',
		'bible',
		'christmas',
		'easter',
		'thanksgiving',
		'mom',
		'dad',
		'mum',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'sunday',
		'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december',
		'english',
		'american',
		'internet',
		'google',
		'youtube',
		'instagram',
		'tiktok',
		'reddit',
		'covid',
		'ok',
		'okay',
		'tv',
		'ai',
		'ones',
		'twos',
		'threes',
		'fours',
		'fives',
		'sixes',
		'sevens',
		'eights',
		'nines'
	].map((word) => word.toLowerCase())
);

/** Capitalized words that are not the first word of a sentence. */
function midSentenceCapitalized(text: string): string[] {
	const out: string[] = [];
	const pattern = /[A-Za-z][A-Za-z'’-]*/g;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(text))) {
		const word = match[0].replace(/['’-]+$/, '');
		if (!/^[A-Z][a-z]/.test(word) || word.length < 3) continue;
		const before = text.slice(0, match.index).trimEnd();
		if (!before || /[.!?:;"“(\n]$/.test(before)) continue;
		out.push(word);
	}
	return out;
}

/**
 * A proper noun (name, place, employer, brand) copied from a take into the
 * summary, or null. Only mid-sentence capitalized words count on both sides,
 * so "Quiet came up a lot." doesn't trip on a take that wrote "Curious, Quiet".
 */
export function findCopiedProperNoun(
	summary: string,
	sources: string[],
	allowedTexts: string[] = []
): string | null {
	const allowed = new Set(allowedTexts.flatMap((text) => overlapTokens(text)));
	const candidates = new Set<string>();
	for (const source of sources) {
		for (const word of midSentenceCapitalized(source)) {
			const key = word.toLowerCase().replace(/['’]/g, '');
			if (COMMON_CAPITALIZED.has(word.toLowerCase()) || allowed.has(key)) continue;
			candidates.add(word);
		}
	}
	if (!candidates.size) return null;
	return midSentenceCapitalized(summary).find((word) => candidates.has(word)) ?? null;
}

function countWords(text: string): number {
	return text.split(/\s+/).filter(Boolean).length;
}

/** Normalizes what the model returned: dashes out, whitespace tidy. */
export function scrubSummary(text: string): string {
	return text
		.replace(/\r/g, '')
		.replace(/\s*[—–]\s*/g, ', ')
		.replace(/\*+/g, '')
		.replace(/[ \t]+/g, ' ')
		.replace(/ *\n */g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

export function validateSummary(
	value: unknown,
	context: { takes: string[]; question: SummaryQuestion }
): SummaryValidation {
	if (typeof value !== 'string') return { ok: false, reason: 'summary was not a string' };
	const text = scrubSummary(value);
	if (!text) return { ok: false, reason: 'summary was empty' };

	const words = countWords(text);
	if (words < SUMMARY_MIN_WORDS) return { ok: false, reason: `too short (${words} words)` };
	if (words > SUMMARY_MAX_WORDS) return { ok: false, reason: `too long (${words} words)` };
	if (/["“”«»]/.test(text)) return { ok: false, reason: 'it used quotation marks' };
	if (/https?:\/\/|www\.|\b[\w.+-]+@[\w-]+\.[\w.]+\b/i.test(text)) {
		return { ok: false, reason: 'it contained a link or an email address' };
	}
	if (/(^|\s)@\w/.test(text)) return { ok: false, reason: 'it contained a handle' };
	if (/^\s*([-*•]|\d+[.)])\s+/m.test(text) || /^#/m.test(text)) {
		return { ok: false, reason: 'it used markdown or a list' };
	}
	const lowered = text.toLowerCase();
	const banned = BANNED_PHRASES.find((phrase) => lowered.includes(phrase));
	if (banned) return { ok: false, reason: `it used the banned phrase "${banned}"` };

	if (context.takes.length >= SINGLES_OUT_MIN_TAKES && SINGLES_OUT.test(text)) {
		return {
			ok: false,
			reason: 'singled out one answer',
			feedback:
				'it described one specific answer (e.g. "the outlier", "one person", "the only one"); fold it into a broader pattern or leave it out'
		};
	}

	const allowedTexts = [context.question.text, context.question.context ?? ''];
	const span = findVerbatimSpan(text, context.takes, { allowedTexts });
	if (span) {
		return {
			ok: false,
			reason: `reused ${VERBATIM_SPAN_WORDS}+ words verbatim from an answer`,
			feedback: `it reused the exact wording "${span}" from an answer (paraphrase instead)`
		};
	}
	const properNoun = findCopiedProperNoun(text, context.takes, allowedTexts);
	if (properNoun) {
		return {
			ok: false,
			reason: 'repeated a proper noun from an answer',
			feedback: `it repeated the name "${properNoun}" from an answer (generalize it)`
		};
	}
	return { ok: true, text };
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

/** Parse a model's JSON reply, tolerating ```json fences and stray text. */
export function parseSummaryJson(content: string): unknown {
	const unfenced = content
		.trim()
		.replace(/^```(?:json)?\s*/i, '')
		.replace(/\s*```$/, '');
	const start = unfenced.indexOf('{');
	const end = unfenced.lastIndexOf('}');
	if (start === -1 || end <= start) throw new Error('model reply had no JSON object');
	try {
		return JSON.parse(unfenced.slice(start, end + 1));
	} catch {
		throw new Error('model reply was not valid JSON');
	}
}

function errorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	return typeof error === 'string' ? error : JSON.stringify(error);
}

/**
 * Generate and guard one summary. A draft that breaks a rule is retried once
 * with the reason as feedback; a second failure returns ok: false and the
 * caller writes nothing.
 */
export async function generateAnswerSummary(input: {
	question: SummaryQuestion;
	takes: SummaryTake[];
	aiTakes: AiReferenceTake[];
	llm: SummaryLlm;
	maxAttempts?: number;
}): Promise<GenerateSummaryResult> {
	const maxAttempts = Math.max(1, input.maxAttempts ?? DEFAULT_SUMMARY_ATTEMPTS);
	if (!input.takes.length) return { ok: false, reason: 'no human takes', attempts: 0 };

	const systemPrompt = buildSummarySystemPrompt();
	const sourceTexts = input.takes.map((take) => take.text);
	let feedback: string | null = null;
	let lastReason = 'no attempt made';
	const rejected: string[] = [];

	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		try {
			const response = await input.llm({
				systemPrompt,
				userPrompt: buildSummaryUserPrompt({
					question: input.question,
					takes: input.takes,
					aiTakes: input.aiTakes,
					feedback
				}),
				temperature: SUMMARY_TEMPERATURE,
				attempt
			});
			const parsed = parseSummaryJson(response.content) as { summary?: unknown } | null;
			const validation = validateSummary(parsed?.summary, {
				takes: sourceTexts,
				question: input.question
			});
			if (validation.ok) {
				return {
					ok: true,
					summary: validation.text,
					model: response.model,
					attempts: attempt + 1,
					rejected
				};
			}
			lastReason = validation.reason;
			feedback = validation.feedback ?? validation.reason;
		} catch (error) {
			lastReason = errorMessage(error);
			feedback = null;
		}
		rejected.push(lastReason);
	}
	return { ok: false, reason: lastReason, attempts: maxAttempts };
}

/**
 * Direct OpenRouter caller, same transport as hostDigest.ts except reasoning:
 * Sonnet 5.5 rejects `reasoning: { enabled: false }` ("Reasoning is
 * mandatory for this endpoint"), so this asks for low effort instead.
 */
export function createOpenRouterSummaryLlm(options: {
	apiKey: string | undefined;
	fetchImpl?: typeof fetch;
	models?: readonly string[];
	timeoutMs?: number;
	title?: string;
}): SummaryLlm {
	const fetchImpl = options.fetchImpl ?? fetch;
	const models = [...(options.models ?? SUMMARY_MODELS)];
	return async (request) => {
		if (!options.apiKey) throw new Error('PRIVATE_OPENROUTER_API_KEY is not configured');
		const response = await fetchImpl(OPENROUTER_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${options.apiKey}`,
				'Content-Type': 'application/json',
				'HTTP-Referer': 'https://9takes.com',
				'X-Title': options.title ?? '9takes Answer Summaries'
			},
			body: JSON.stringify({
				models,
				messages: [
					{ role: 'system', content: request.systemPrompt },
					{ role: 'user', content: request.userPrompt }
				],
				temperature: request.temperature,
				max_tokens: SUMMARY_MAX_TOKENS,
				response_format: { type: 'json_object' },
				reasoning: { effort: 'low' },
				usage: { include: true }
			}),
			signal: AbortSignal.timeout(options.timeoutMs ?? SUMMARY_CALL_TIMEOUT_MS)
		});
		const bodyText = await response.text();
		if (!response.ok) {
			throw new Error(`OpenRouter ${response.status}: ${truncate(bodyText, 160)}`);
		}
		let data: any;
		try {
			data = JSON.parse(bodyText);
		} catch {
			throw new Error('OpenRouter returned a non-JSON body');
		}
		if (data?.error) {
			throw new Error(`OpenRouter error: ${String(data.error.message ?? data.error.code)}`);
		}
		const choice = data?.choices?.[0];
		const content = choice?.message?.content;
		const model = typeof data?.model === 'string' ? data.model : (models[0] ?? null);
		if (typeof content !== 'string' || !content.trim()) {
			throw new Error(
				`${model ?? 'model'} returned empty content (finish_reason ${choice?.finish_reason ?? 'unknown'})`
			);
		}
		const usage = data?.usage
			? {
					promptTokens: Number(data.usage.prompt_tokens) || 0,
					completionTokens: Number(data.usage.completion_tokens) || 0,
					cost: Number.isFinite(Number(data.usage.cost)) ? Number(data.usage.cost) : null
				}
			: null;
		return { content, model, usage };
	};
}

// ---------------------------------------------------------------------------
// Refresh run (cron + backfill script)
// ---------------------------------------------------------------------------

export type RefreshReport = {
	dryRun: boolean;
	liveQuestions: number;
	needingWork: number;
	attempted: number;
	generated: Array<{ questionId: number; sourceCommentCount: number; model: string | null }>;
	failed: Array<{ questionId: number; reason: string }>;
	deleted: number[];
	deferred: number;
};

export type GeneratedSummary = {
	question: SummaryQuestion;
	summary: string;
	sourceCommentCount: number;
	model: string | null;
	attempts: number;
	rejected: string[];
};

/**
 * Bring summaries in line with the current human takes:
 *   * a question whose human-take count differs from the stored
 *     source_comment_count (or that has none yet) is regenerated;
 *   * a stored summary whose question has no human takes left is deleted;
 *   * if a regeneration after a take removal fails, the old summary is
 *     deleted rather than left paraphrasing a removed take;
 *   * any other failure is recorded (failed_comment_count) and not retried
 *     until the question's take count changes, so a thread the guards keep
 *     rejecting costs a few calls once, not a few calls every hour.
 * At most `limit` generations per run, newest activity first, and no new
 * generation starts once `budgetMs` has elapsed. `dryRun` reads only.
 */
export async function refreshQuestionSummaries(options: {
	db: SummaryDb;
	llm: SummaryLlm;
	limit?: number;
	questionIds?: number[] | null;
	force?: boolean;
	dryRun?: boolean;
	budgetMs?: number;
	now?: () => number;
	onGenerated?: (result: GeneratedSummary) => void | Promise<void>;
	log?: (message: string, details?: Record<string, unknown>) => void;
}): Promise<RefreshReport> {
	const { db, llm } = options;
	const dryRun = options.dryRun === true;
	const now = options.now ?? Date.now;
	const startedAt = now();
	const limit = Math.max(0, options.limit ?? 10);
	const log = options.log ?? (() => {});

	const questions = await loadLiveQuestions(db, options.questionIds);
	const ids = questions.map((question) => question.id);
	const takesByQuestion = await loadHumanTakes(db, ids);

	let existing: Map<number, ExistingSummaryState>;
	try {
		existing = await loadExistingSummaries(db, ids);
	} catch (error) {
		// Only a dry run may continue without the table (e.g. before the
		// migration is applied); a real run must not regenerate blindly.
		if (!dryRun) throw error;
		log('Existing summaries unavailable; treating all as missing', {
			error: errorMessage(error)
		});
		existing = new Map();
	}

	const report: RefreshReport = {
		dryRun,
		liveQuestions: questions.length,
		needingWork: 0,
		attempted: 0,
		generated: [],
		failed: [],
		deleted: [],
		deferred: 0
	};

	const deleteSummary = async (questionId: number) => {
		if (dryRun) return;
		const { error } = await db.from(ANSWER_SUMMARY_TABLE).delete().eq('question_id', questionId);
		if (error) throw new Error(`Could not delete summary: ${error.message ?? error}`);
		report.deleted.push(questionId);
	};

	for (const question of questions) {
		const count = takesByQuestion.get(question.id)?.length ?? 0;
		if (count === 0 && existing.has(question.id)) await deleteSummary(question.id);
	}

	const latest = (questionId: number) =>
		(takesByQuestion.get(questionId) ?? []).reduce(
			(max, take) => (take.createdAt > max ? take.createdAt : max),
			''
		);
	const work = questions
		.filter((question) => {
			const count = takesByQuestion.get(question.id)?.length ?? 0;
			if (count < 1) return false;
			if (options.force === true) return true;
			const state = existing.get(question.id);
			// Already failed at this exact count: wait for the next take
			// instead of paying for the same rejection every hour.
			if (state?.failedCount === count) return false;
			return state?.summaryCount !== count;
		})
		.sort((a, b) => latest(b.id).localeCompare(latest(a.id)) || b.id - a.id);
	report.needingWork = work.length;

	for (const question of work.slice(0, limit)) {
		if (options.budgetMs !== undefined && now() - startedAt >= options.budgetMs) {
			break;
		}
		const takes = takesByQuestion.get(question.id) ?? [];
		report.attempted += 1;
		const aiTakes = await loadAiReferenceTakes(db, question.id);
		const result = await generateAnswerSummary({ question, takes, aiTakes, llm });

		if (!result.ok) {
			report.failed.push({ questionId: question.id, reason: result.reason });
			log('Answer summary generation failed', { questionId: question.id, reason: result.reason });
			const previous = existing.get(question.id)?.summaryCount;
			if (previous !== null && previous !== undefined && takes.length < previous) {
				// A take was removed: never leave a summary that may paraphrase it.
				await deleteSummary(question.id);
			} else if (!dryRun) {
				// Remember the failure (keeping any older summary) so the cron
				// waits for the count to change before trying again.
				const { error } = await db.from(ANSWER_SUMMARY_TABLE).upsert(
					{
						question_id: question.id,
						failed_comment_count: takes.length,
						failed_at: new Date(now()).toISOString()
					},
					{ onConflict: 'question_id' }
				);
				if (error) log('Could not record summary failure', { questionId: question.id });
			}
			continue;
		}

		if (!dryRun) {
			const { error } = await db.from(ANSWER_SUMMARY_TABLE).upsert(
				{
					question_id: question.id,
					summary: result.summary,
					source_comment_count: takes.length,
					model: result.model,
					generated_at: new Date(now()).toISOString(),
					failed_comment_count: null,
					failed_at: null
				},
				{ onConflict: 'question_id' }
			);
			if (error) {
				report.failed.push({
					questionId: question.id,
					reason: `write failed: ${error.message ?? error}`
				});
				continue;
			}
		}
		report.generated.push({
			questionId: question.id,
			sourceCommentCount: takes.length,
			model: result.model
		});
		await options.onGenerated?.({
			question,
			summary: result.summary,
			sourceCommentCount: takes.length,
			model: result.model,
			attempts: result.attempts,
			rejected: result.rejected
		});
	}
	report.deferred = work.length - report.attempted;
	return report;
}
