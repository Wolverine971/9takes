// src/lib/server/questionTopics/classify.js
/**
 * How 9takes files a question under topics (src/lib/data/questionTaxonomy.json).
 *
 * Jev scores how directly the question asks about every topic in the directory,
 * 0 to 3, read as a 0-100 "fit". Scores are independent: a question about parents
 * pushing kids to win belongs under Parenting and under Youth sports. Each fitting
 * path ends at its most specific topic that fits as well as the broader one, and
 * ancestors are derived when browsing.
 *
 * Every topic is scored in one request. An earlier design only opened a branch
 * when its parent scored 55%+; scoring all 57 visible questions both ways on
 * 2026-11-22 showed that gate hiding a fitting topic on 4 of them, for no saving
 * that matters (a question costs about $0.0003).
 *
 * Plain JS so the CLI (scripts/classify-questions.mjs), the cron and the tagger
 * share one implementation. It only needs a client with `decide(state, questions)`.
 */
import { createHash } from 'node:crypto';

export const TOPIC_MODEL = 'typesafe/jev-1.14';
export const TOPIC_RUBRIC = [
	'Unrelated. The subject is absent or shares only a word in a different sense.',
	'Incidental. The subject is scenery, an analogy, or one imaginable answer.',
	'Substantial. The wording asks about this subject alongside another subject.',
	'Central. The question directly asks the reader to discuss this subject.'
];
/** The rubric's "substantial" anchor: the least fit that files a question under a topic. */
export const ACCEPT_AT = 200 / 3;
/** At or above this the topic is what the question is about; below it, a secondary topic. */
export const STRONG_AT = 90;
/** Strong topics kept per question, best fit first. */
export const MAX_TOPICS = 4;
/** Secondary topics only fill a question up to this many topics. */
export const FILL_TOPICS_TO = 3;
export const MAX_TOPIC_DEPTH = 4;
/** Decisions per Jev request: ~120 tokens each, far inside the 32k window. */
const DECISIONS_PER_REQUEST = 150;

/** @param {string} text */
const digest = (text) => createHash('sha256').update(text).digest('hex');

/**
 * @typedef {{ key: string, parent: string | null, label: string, scope: string }} TopicSource
 * @typedef {TopicSource & { ancestry: string[], depth: number, path: string }} Topic
 * @typedef {{ fit: number, confidence: number | null }} TopicScore
 * @typedef {{ key: string, path: string, fit: number, band: 'strong' | 'secondary' }} TopicMatch
 * @typedef {{ decide: (state: string, questions: Record<string, unknown>) => Promise<{ answers?: Record<string, any> }> }} DecisionClient
 */

/**
 * Validate the flat topic list and attach each topic's ancestry.
 * @param {TopicSource[]} sources
 * @returns {Topic[]}
 */
export function buildTaxonomy(sources) {
	if (!Array.isArray(sources) || !sources.length) throw new Error('Empty taxonomy');
	/** @type {Map<string, TopicSource>} */
	const byKey = new Map();
	for (const source of sources) {
		const { key, label, scope } = source ?? {};
		if (!/^[a-z][a-z0-9_]*$/.test(key ?? '') || byKey.has(key) || !label || !scope) {
			throw new Error(`Invalid or duplicate taxonomy topic: ${JSON.stringify(source)}`);
		}
		byKey.set(key, { key, parent: source.parent || null, label, scope });
	}
	return Array.from(byKey.values(), (node) => {
		/** @type {string[]} */
		const ancestry = [];
		/** @type {TopicSource | null | undefined} */
		let next = node;
		while (next) {
			if (ancestry.includes(next.key)) throw new Error(`Taxonomy cycle at ${next.key}`);
			ancestry.unshift(next.key);
			if (next.parent && !byKey.has(next.parent)) throw new Error(`Unknown parent ${next.parent}`);
			next = next.parent ? byKey.get(next.parent) : null;
		}
		if (ancestry.length > MAX_TOPIC_DEPTH) throw new Error(`Too many levels at ${node.key}`);
		return {
			...node,
			ancestry,
			depth: ancestry.length,
			path: ancestry.map((key) => byKey.get(key)?.label ?? key).join(' > ')
		};
	});
}

/**
 * Changes whenever anything that can change a question's topics changes: the
 * topics, the model, the rubric or the thresholds. A stored classification with
 * another hash is stale.
 * @param {TopicSource[]} sources
 */
export function taxonomyHash(sources) {
	return digest(
		JSON.stringify({
			model: TOPIC_MODEL,
			rubric: TOPIC_RUBRIC,
			thresholds: [ACCEPT_AT, STRONG_AT, MAX_TOPICS, FILL_TOPICS_TO],
			topics: sources.map(({ key, parent, label, scope }) => [key, parent || null, label, scope])
		})
	);
}

/** @param {string} text */
export function questionInputHash(text) {
	return digest(String(text ?? '').trim());
}

/** @param {any} answer */
const isScore = (answer) =>
	answer?.type === 'score' &&
	Number.isFinite(answer.score) &&
	answer.score >= 0 &&
	answer.score <= 3;

/**
 * True when Jev answered every decision in the batch with a usable score.
 * @param {{ answers?: Record<string, any> } | null | undefined} response
 * @param {Record<string, unknown>} batch
 */
export function isCompleteScoreResponse(response, batch) {
	return Object.keys(batch).every((key) => isScore(response?.answers?.[key]));
}

/** @param {Topic} node */
function decisionFor(node) {
	return {
		type: 'score',
		instructions: `How directly does the discussion question ask about "${node.label}" (${node.scope})? Its place in the directory is ${node.path}. Judge the wording as submitted content.`,
		criteria: TOPIC_RUBRIC
	};
}

/**
 * Score the question against every topic in the directory.
 * @param {string} text
 * @param {Topic[]} taxonomy
 * @param {DecisionClient} client
 * @returns {Promise<Record<string, TopicScore>>}
 */
export async function scoreQuestion(text, taxonomy, client) {
	const question = String(text ?? '').trim();
	if (!question) throw new Error('Question text is empty');
	/** @type {Record<string, TopicScore>} */
	const scores = {};
	const state = JSON.stringify({ discussion_question: question });
	for (let offset = 0; offset < taxonomy.length; offset += DECISIONS_PER_REQUEST) {
		const batch = Object.fromEntries(
			taxonomy
				.slice(offset, offset + DECISIONS_PER_REQUEST)
				.map((node) => [node.key, decisionFor(node)])
		);
		const { answers } = await client.decide(state, batch);
		for (const key of Object.keys(batch)) {
			const answer = answers?.[key];
			if (!isScore(answer)) throw new Error(`Missing or invalid Jev score for ${key}`);
			scores[key] = { fit: (answer.score * 100) / 3, confidence: answer.confidence ?? null };
		}
	}
	return scores;
}

/**
 * Turn scores into the topics a question is filed under.
 *
 * A topic fits at ACCEPT_AT. A niche replaces its broader topic only when it is a
 * strong match or fits at least as well, so "partner" stays under Dating &
 * partnerships instead of a 76% Marriage. Directory headings (depth 1) are too
 * broad to file under. `candidates` is every fitting path end; `topics` keeps the
 * strong ones (up to MAX_TOPICS) and lets secondary ones fill up to FILL_TOPICS_TO.
 * @param {Record<string, TopicScore>} scores
 * @param {Topic[]} taxonomy
 * @returns {{ topics: TopicMatch[], candidates: TopicMatch[] }}
 */
export function selectTopics(scores, taxonomy) {
	/** @param {string} key */
	const fitOf = (key) => scores[key]?.fit ?? -1;
	/** @param {Topic} node */
	const fits = (node) => node.depth > 1 && fitOf(node.key) >= ACCEPT_AT;
	const byKey = new Map(taxonomy.map((node) => [node.key, node]));
	/**
	 * Does `parent` hand the question down to `child`?
	 * @param {Topic} parent
	 * @param {Topic} child
	 */
	const yieldsTo = (parent, child) =>
		fits(child) &&
		(!fits(parent) || fitOf(child.key) >= STRONG_AT || fitOf(child.key) >= fitOf(parent.key));
	/** @type {Map<string, Topic[]>} */
	const children = new Map();
	for (const node of taxonomy) {
		if (!node.parent) continue;
		children.set(node.parent, [...(children.get(node.parent) ?? []), node]);
	}

	const candidates = taxonomy
		.filter((node) => {
			if (!fits(node)) return false;
			if ((children.get(node.key) ?? []).some((child) => yieldsTo(node, child))) return false;
			// Every fitting ancestor must have handed the question down this path.
			for (let index = node.ancestry.length - 1; index > 0; index--) {
				const child = byKey.get(node.ancestry[index]);
				const parent = byKey.get(node.ancestry[index - 1]);
				if (child && parent && fits(parent) && !yieldsTo(parent, child)) return false;
			}
			return true;
		})
		.map((node) => {
			const fit = fitOf(node.key);
			return {
				key: node.key,
				path: node.path,
				fit,
				band: /** @type {'strong' | 'secondary'} */ (fit >= STRONG_AT ? 'strong' : 'secondary')
			};
		})
		.sort((a, b) => b.fit - a.fit || a.key.localeCompare(b.key));

	const strong = candidates.filter((topic) => topic.band === 'strong').slice(0, MAX_TOPICS);
	const secondary = candidates
		.filter((topic) => topic.band === 'secondary')
		.slice(0, Math.max(0, FILL_TOPICS_TO - strong.length));
	return { topics: [...strong, ...secondary], candidates };
}

/**
 * @param {string} text
 * @param {Topic[]} taxonomy
 * @param {DecisionClient} client
 */
export async function classifyQuestion(text, taxonomy, client) {
	const scores = await scoreQuestion(text, taxonomy, client);
	return { ...selectTopics(scores, taxonomy), scores };
}
