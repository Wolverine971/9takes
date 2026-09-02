// scripts/generate-chorus.mjs
//
// Generates editorial candidates for the personality-analysis Chorus: one
// evergreen question per person plus the nine takes that answer it. Candidate
// runs are read-only. An exact human-reviewed question and --publish are both
// required before it writes the question and takes to the database. Nothing is
// generated live on page view.
// See docs/product/the-chorus-vision.md.
//
// Usage:
//   node scripts/generate-chorus.mjs --slug=khloe-kardashian
//       # Generate an editorial candidate and print it. No database writes.
//   node scripts/generate-chorus.mjs --slug=khloe-kardashian \
//     --question="What's a favor you say yes to, then resent later?" \
//     --publish
//       # Publish exact human-reviewed copy and generate its nine takes.
//   node scripts/generate-chorus.mjs --limit=20       # dry-run candidate batch
//   CHORUS_QUESTION_MODEL=anthropic/claude-sonnet-4 node scripts/generate-chorus.mjs

import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
	FAILED_PATTERN_EXAMPLES,
	RESPONSE_PROVEN_EXAMPLES,
	assertQuestionQuality,
	inspectQuestion,
	sceneSeedsFor
} from './question-quality.mjs';

dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OPENROUTER_KEY = process.env.PRIVATE_OPENROUTER_API_KEY;
const QUESTION_MODEL = process.env.CHORUS_QUESTION_MODEL || 'anthropic/claude-sonnet-4';
const REVIEW_MODEL = process.env.CHORUS_REVIEW_MODEL || QUESTION_MODEL;
const TAKES_MODEL = process.env.CHORUS_MODEL || 'google/gemini-2.5-flash';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) throw new Error('Supabase env not set');
if (!OPENROUTER_KEY) throw new Error('PRIVATE_OPENROUTER_API_KEY not set');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const SLUG = args.find((a) => a.startsWith('--slug='))?.split('=')[1];
const REVIEWED_QUESTION = args
	.find((a) => a.startsWith('--question='))
	?.slice('--question='.length);
const PUBLISH = args.includes('--publish');
const LIMIT = Number(args.find((a) => a.startsWith('--limit='))?.split('=')[1]) || Infinity;
// Restrict a batch run to an explicit set, so a partially-completed backfill can
// be resumed without regenerating the people already done.
const ONLY = (args.find((a) => a.startsWith('--only='))?.slice('--only='.length) || '')
	.split(',')
	.map((slug) => slug.trim())
	.filter(Boolean);
// Extra questions the model must not reproduce, one per line. Used to carry
// already-chosen copy from a previous partial run into this one's avoid-list.
const AVOID_FILE = args.find((a) => a.startsWith('--avoid-file='))?.slice('--avoid-file='.length);
const CONCURRENCY = Number(process.env.CHORUS_CONCURRENCY) || 3;

if (PUBLISH && (!SLUG || !REVIEWED_QUESTION?.trim())) {
	throw new Error('--publish requires one --slug and the exact human-reviewed --question copy');
}
if (REVIEWED_QUESTION && !SLUG) {
	throw new Error('--question requires exactly one --slug');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ARCHETYPES = {
	1: 'The Reformer',
	2: 'The Helper',
	3: 'The Achiever',
	4: 'The Individualist',
	5: 'The Investigator',
	6: 'The Loyalist',
	7: 'The Enthusiast',
	8: 'The Challenger',
	9: 'The Peacemaker'
};

const TYPE_REFERENCE = `Type 1 (The Reformer): wants integrity; fears being corrupt or wrong.
Type 2 (The Helper): wants to be loved; fears being unwanted.
Type 3 (The Achiever): wants to be valuable; fears being worthless without success.
Type 4 (The Individualist): wants a unique identity; fears being ordinary or insignificant.
Type 5 (The Investigator): wants competence and clarity; fears being depleted or overwhelmed.
Type 6 (The Loyalist): wants security; fears being without support.
Type 7 (The Enthusiast): wants freedom and good experiences; fears being trapped in pain.
Type 8 (The Challenger): wants control and self-protection; fears being controlled or vulnerable.
Type 9 (The Peacemaker): wants peace and harmony; fears conflict and loss of connection.`;

function buildQuestionSystemPrompt() {
	return `You are the senior question editor for 9takes: "one question, nine perspectives."

Write questions that make people remember a real moment before they start explaining themselves. You will receive eight ordinary social scenes. Write exactly one candidate per scene; do not make eight paraphrases of one idea.

A publishable 9takes question:
- creates an instant answer: the reader can begin with a specific thing, person, memory, first thought, or action within three seconds;
- has a concrete foothold in ordinary life while leaving the meaning open;
- is lightly exposing without demanding trauma or a polished life lesson;
- allows several emotionally different answers without suggesting which one is mature or correct;
- reveals personality through the answers, never by assigning a personality to the reader;
- sounds natural enough to text to a friend and uses everyday words instead of workplace, coaching, or editorial language;
- uses 7 to 22 words and asks one clean question ending in "?".

Reject candidates that:
- ask "How do you decide...", "How do you navigate...", "What guides your decision...", or "What does ... look like?";
- use a forced choice with "whether to", "would you rather", or a list of options;
- ask for advice, a theory, a value statement, or a generalized personality rule;
- sound philosophical, therapeutic, inspirational, corporate, or poetic;
- assume unusual success, sacrifice, status, trauma, or a type-coded fixation;
- mention a celebrity, personality system, Enneagram type, or archetype;
- have one obviously admirable answer.

For each candidate, write three short sample answers that are genuinely different from one another. If the samples collapse into the same moral or personality stereotype, reject that candidate. Name one specific risk or weakness; "none" is not an acceptable self-critique. Score each surviving candidate from 1 to 5 on instant_answer, specificity, perspective_spread, and natural_voice. The winner must score at least 4 in every category.

Generate eight substantially different candidates, then choose the strongest. Return strict JSON only:
{"candidates":[{"scene_number":number,"question":string,"sample_answers":[string,string,string],"scores":{"instant_answer":number,"specificity":number,"perspective_spread":number,"natural_voice":number},"risk":string}],"question":string}

Response-proven examples and what they teach (learn the shape; do not reuse the wording):
${RESPONSE_PROVEN_EXAMPLES.map((example) => `- "${example.question}" — ${example.lesson}`).join('\n')}

Failed examples (do not imitate or lightly paraphrase them):
${FAILED_PATTERN_EXAMPLES.map((example) => `- "${example.question}" — ${example.reason}`).join('\n')}`;
}

function buildQuestionUserPrompt(person, avoidQuestions = []) {
	// The model never sees the profile name, biography, occupation, persona title,
	// or Enneagram type. The old generator leaked those signals into the premise.
	const sceneDeck = sceneSeedsFor(person.person)
		.map((scene, index) => `${index + 1}. ${scene}`)
		.join('\n');
	// The model never sees who the subject is, and the scene deck is drawn from a
	// fixed pool, so without this list separate runs converge on the same wording.
	// A 2026-09-01 batch of 87 returned 22 word-for-word duplicates and put 23 of
	// 87 behind the same "What do you..." opening. These questions are the only
	// call to action on their pages and readers meet them serially, so repeats
	// read as a canned mechanic.
	const avoidBlock = avoidQuestions.length
		? `\n\nAlready in use on other pages. Do NOT reproduce any of these, and do not
open with the same first four words as any of them. Vary the opening verb and the
grammatical shape, not just the noun:\n${avoidQuestions.map((q) => `- ${q}`).join('\n')}`
		: '';

	return `Ordinary scene seeds:
${sceneDeck}

Write exactly one candidate for each numbered scene. Each question may zoom in on one detail or adjacent behavior, but it must remain ordinary, specific, and open. JSON only.${avoidBlock}`;
}

function buildQuestionReviewSystemPrompt() {
	return `You are the veto editor for 9takes question candidates. You did not write these candidates. Be skeptical and do not preserve a candidate merely because it is grammatical.

Pass a question only when:
- a reader can begin a real answer within three seconds;
- it creates a concrete foothold but opens an emotionally revealing angle;
- the three sample answers differ in motive, assumption, feeling, or reaction, not merely in their nouns;
- no answer is framed as more mature, kind, brave, or correct;
- the premise does not assign the reader a personality, wound, achievement, or Enneagram fixation;
- it sounds like something a perceptive friend would actually text.

Reject a question when:
- it merely repeats the supplied scene or asks when the scene last happened;
- it asks for a general rule, advice, decision framework, theory, or life lesson;
- its sample answers are interchangeable examples of the same emotional response;
- it is generic enough to belong on any engagement-bait account;
- it sounds like HR, therapy, coaching, philosophy, or AI copy;
- it relies on a forced choice, unusual status, or one admirable answer.

Score each candidate from 1 to 5 on instant_answer, specificity, perspective_spread, and natural_voice. Passing requires at least 4 in every category. Choose one winner only from passing candidates. It is valid for every candidate to fail.

Return strict JSON only:
{"reviews":[{"scene_number":number,"pass":boolean,"reason":string,"scores":{"instant_answer":number,"specificity":number,"perspective_spread":number,"natural_voice":number}}],"winner_scene_number":number|null}`;
}

function buildQuestionReviewUserPrompt(candidates, scenes) {
	return JSON.stringify({
		scenes: scenes.map((scene, index) => ({ scene_number: index + 1, scene })),
		candidates: candidates.map((candidate) => ({
			scene_number: candidate.sceneNumber,
			question: candidate.question,
			sample_answers: candidate.sampleAnswers,
			claimed_risk: candidate.risk
		}))
	});
}

function buildTakesSystemPrompt() {
	return `You write the nine distinct answer perspectives for 9takes.

The exact public question has already been approved by a human editor. Do not revise it.

Write one answer per Enneagram emotional logic (types 1 through 9). Reference:
${TYPE_REFERENCE}

- Each answer is first person, 1 to 2 sentences, and directly answers the exact question.
- Ground the answer in a concrete reaction or decision. Sound like a real person talking, not a poet or therapist.
- Never name the type or archetype inside the answer.
- Do not simply paraphrase the core fear/desire. Let the logic shape the response naturally.
- Make all nine distinct enough that the reader feels a genuine spread of human responses.

Return strict JSON only:
{"takes":[{"type":1,"take":string},{"type":2,"take":string},... all nine in order]}`;
}

function buildTakesUserPrompt(question) {
	return `Exact approved question: ${question}\n\nWrite the nine answers. JSON only.`;
}

function parseJson(content) {
	let text = (content || '').trim();
	// strip code fences if present
	text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
	const start = text.indexOf('{');
	const end = text.lastIndexOf('}');
	if (start >= 0 && end > start) text = text.slice(start, end + 1);
	return JSON.parse(text);
}

async function callOpenRouter(
	systemPrompt,
	userPrompt,
	{ temperature, maxTokens, model = QUESTION_MODEL }
) {
	const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${OPENROUTER_KEY}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': 'https://9takes.com',
			'X-Title': '9takes Chorus Pregen'
		},
		body: JSON.stringify({
			model,
			temperature,
			max_tokens: maxTokens,
			response_format: { type: 'json_object' },
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userPrompt }
			]
		}),
		signal: AbortSignal.timeout(120000)
	});

	if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 200)}`);
	const data = await res.json();
	const content = data?.choices?.[0]?.message?.content;
	return parseJson(content);
}

// Retry transient failures (rate limits, network) with exponential backoff.
async function withRetries(operation) {
	const delays = [0, 2000, 5000, 12000];
	let lastErr;
	for (let attempt = 0; attempt < delays.length; attempt++) {
		if (delays[attempt]) await sleep(delays[attempt]);
		try {
			return await operation();
		} catch (e) {
			lastErr = e;
		}
	}
	throw lastErr;
}

async function reviewQuestionCandidates(candidates, scenes) {
	const parsed = await withRetries(() =>
		callOpenRouter(
			buildQuestionReviewSystemPrompt(),
			buildQuestionReviewUserPrompt(candidates, scenes),
			{
				temperature: 0.15,
				maxTokens: 2600,
				model: REVIEW_MODEL
			}
		)
	);
	const reviews = (parsed.reviews || []).map((review) => ({
		sceneNumber: Number(review.scene_number) || 0,
		passed: review.pass === true,
		reason: String(review.reason || '').trim(),
		scores: {
			instant_answer: Number(review.scores?.instant_answer) || 0,
			specificity: Number(review.scores?.specificity) || 0,
			perspective_spread: Number(review.scores?.perspective_spread) || 0,
			natural_voice: Number(review.scores?.natural_voice) || 0
		}
	}));
	const reviewSceneNumbers = new Set(reviews.map((review) => review.sceneNumber));
	if (
		reviews.length !== 8 ||
		reviewSceneNumbers.size !== 8 ||
		[...reviewSceneNumbers].some((number) => number < 1 || number > 8)
	) {
		throw new Error('veto editor must review exactly one candidate for each of eight scenes');
	}

	return {
		reviewsByScene: new Map(reviews.map((review) => [review.sceneNumber, review])),
		winnerSceneNumber: Number(parsed.winner_scene_number) || null
	};
}

async function generateQuestion(person, avoidQuestions = []) {
	const scenes = sceneSeedsFor(person.person);
	const parsed = await withRetries(() =>
		callOpenRouter(buildQuestionSystemPrompt(), buildQuestionUserPrompt(person, avoidQuestions), {
			temperature: 0.7,
			maxTokens: 3600,
			model: QUESTION_MODEL
		})
	);
	const candidates = (parsed.candidates || []).map((candidate) => {
		const question = (candidate.question || '').toString().replace(/\s+/g, ' ').trim();
		const sampleAnswers = (candidate.sample_answers || [])
			.map((answer) =>
				String(answer || '')
					.replace(/\s+/g, ' ')
					.trim()
			)
			.filter(Boolean)
			.slice(0, 3);
		const scores = {
			instant_answer: Number(candidate.scores?.instant_answer) || 0,
			specificity: Number(candidate.scores?.specificity) || 0,
			perspective_spread: Number(candidate.scores?.perspective_spread) || 0,
			natural_voice: Number(candidate.scores?.natural_voice) || 0
		};

		return {
			sceneNumber: Number(candidate.scene_number) || 0,
			question,
			sampleAnswers,
			scores,
			risk: String(candidate.risk || '').trim(),
			quality: inspectQuestion(question)
		};
	});
	const sceneNumbers = new Set(candidates.map((candidate) => candidate.sceneNumber));
	if (
		candidates.length !== 8 ||
		sceneNumbers.size !== 8 ||
		[...sceneNumbers].some((number) => number < 1 || number > 8)
	) {
		throw new Error('candidate slate must contain exactly one question for each of eight scenes');
	}
	const { reviewsByScene, winnerSceneNumber } = await reviewQuestionCandidates(candidates, scenes);
	for (const candidate of candidates) {
		candidate.editorialReview = reviewsByScene.get(candidate.sceneNumber);
	}

	const eligible = candidates
		.filter(
			(candidate) =>
				candidate.quality.passed &&
				candidate.sampleAnswers.length === 3 &&
				new Set(candidate.sampleAnswers.map((answer) => answer.toLowerCase())).size === 3 &&
				candidate.risk &&
				!/^no(?:ne| specific risk)?\.?$/i.test(candidate.risk) &&
				candidate.editorialReview?.passed &&
				Object.values(candidate.editorialReview.scores).every((score) => score >= 4 && score <= 5)
		)
		.sort(
			(a, b) =>
				Object.values(b.editorialReview.scores).reduce((sum, score) => sum + score, 0) -
				Object.values(a.editorialReview.scores).reduce((sum, score) => sum + score, 0)
		);

	if (!eligible.length) throw new Error('no candidate passed the response-first quality gate');

	const winner =
		eligible.find((candidate) => candidate.sceneNumber === winnerSceneNumber) || eligible[0];
	return { question: winner.question, candidates, scenes };
}

async function generateTakes(question) {
	const parsed = await withRetries(() =>
		callOpenRouter(buildTakesSystemPrompt(), buildTakesUserPrompt(question), {
			temperature: 0.75,
			maxTokens: 1800,
			model: TAKES_MODEL
		})
	);

	const byType = new Map();
	for (const takeRow of parsed.takes || []) {
		const type = Number(takeRow.type);
		const take = (takeRow.take || '').toString().replace(/\s+/g, ' ').trim();
		if (type >= 1 && type <= 9 && take) byType.set(type, take);
	}

	const takes = [];
	for (let type = 1; type <= 9; type++) {
		const take = byType.get(type);
		if (!take) throw new Error(`missing take for type ${type}`);
		takes.push({ type, archetype: ARCHETYPES[type], take, source: 'ai' });
	}
	return takes;
}

async function generate(person, reviewedQuestion = null, avoidQuestions = []) {
	if (!reviewedQuestion)
		return { ...(await generateQuestion(person, avoidQuestions)), takes: null };

	const question = reviewedQuestion.trim();
	assertQuestionQuality(question);
	const takes = await generateTakes(question);
	return { question, takes, candidates: null, scenes: null };
}

function slugify(text) {
	const words = (text || '').toLowerCase().match(/[a-z0-9]+/g) || [];
	const slug = words.slice(0, 10).join('-').slice(0, 80).replace(/-+$/g, '');
	return slug || 'question';
}

async function ensureUniqueSlug(base) {
	let candidate = base;
	let n = 1;
	// Cap attempts; collisions are rare.
	while (n < 50) {
		const { data } = await supabase
			.from('questions')
			.select('id')
			.eq('url', candidate)
			.maybeSingle();
		if (!data) return candidate;
		n++;
		candidate = `${base.slice(0, 76)}-${n}`;
	}
	return `${base.slice(0, 72)}-${Date.now().toString(36)}`;
}

// Create (or reuse) the real `questions` row backing this chorus; return its slug.
async function ensureQuestion(person, questionText, authorId) {
	const payloadData = {
		source: 'chorus',
		subject_type: 'personality-analysis',
		subject_slug: person.person,
		enneagram: person.enneagram ?? null,
		editorial_status: 'approved',
		editorial_review_version: 3,
		editorial_standard: 'response_first_v1',
		editorial_reviewed_at: new Date().toISOString(),
		editorial_model: QUESTION_MODEL,
		editorial_review_model: REVIEW_MODEL,
		takes_model: TAKES_MODEL
	};

	if (person.chorus_question_url) {
		const { data: existing } = await supabase
			.from('questions')
			.select('id, url, data')
			.eq('url', person.chorus_question_url)
			.maybeSingle();
		if (existing) {
			if (PUBLISH && REVIEWED_QUESTION) {
				await supabase
					.from('questions')
					.update({
						question_formatted: questionText,
						data: { ...(existing.data || {}), ...payloadData },
						flagged: false,
						removed: false,
						updated_at: new Date().toISOString()
					})
					.eq('id', existing.id);
			}
			return { id: existing.id, url: existing.url };
		}
	}

	const url = await ensureUniqueSlug(slugify(questionText));
	const { data, error } = await supabase
		.from('questions')
		.insert({
			question: questionText,
			question_formatted: questionText,
			url,
			author_id: authorId,
			data: payloadData,
			flagged: false,
			removed: false
		})
		.select('id, url')
		.single();
	if (error) throw new Error(`question insert: ${error.message}`);
	return { id: data.id, url: data.url };
}

async function persist(person, questionText, takes, authorId) {
	const { id: questionId, url } = await ensureQuestion(person, questionText, authorId);

	const { error: blogErr } = await supabase
		.from('blogs_famous_people')
		.update({ chorus_question: questionText, chorus_question_url: url })
		.eq('person', person.person);
	if (blogErr) throw new Error(`blog update: ${blogErr.message}`);

	// Only rewrite the nine takes when we generated fresh ones this run.
	if (takes) {
		const { error: takesErr } = await supabase.from('nine_takes').upsert(
			{
				subject_type: 'personality-analysis',
				subject_slug: person.person,
				situation: questionText,
				takes,
				model: MODEL,
				updated_at: new Date().toISOString()
			},
			{ onConflict: 'subject_type,subject_slug' }
		);
		if (takesErr) throw new Error(`takes upsert: ${takesErr.message}`);

		// Keep the question page's AI takes (comments_ai) in sync with the chorus
		// takes — /questions/[slug] reads only comments_ai (2026-08-13 audit).
		const aiRows = (takes || [])
			.filter((t) => t && typeof t.take === 'string' && t.take.trim() && Number.isInteger(t.type))
			.map((t) => ({
				question_id: questionId,
				enneagram_type: String(t.type),
				comment: t.take.trim()
			}));
		if (aiRows.length === 9) {
			const { error: delErr } = await supabase
				.from('comments_ai')
				.delete()
				.eq('question_id', questionId);
			if (delErr) throw new Error(`comments_ai delete: ${delErr.message}`);
			const { error: aiErr } = await supabase.from('comments_ai').insert(aiRows);
			if (aiErr) throw new Error(`comments_ai insert: ${aiErr.message}`);
		}
	}

	return url;
}

async function getAuthorId() {
	if (process.env.CHORUS_AUTHOR_ID) return process.env.CHORUS_AUTHOR_ID;
	const { data } = await supabase
		.from('profiles')
		.select('id')
		.eq('admin', true)
		.limit(1)
		.maybeSingle();
	return data?.id ?? null;
}

async function main() {
	let query = supabase
		.from('blogs_famous_people')
		.select('person, enneagram, chorus_question, chorus_question_url')
		.eq('published', true);

	if (SLUG) query = query.eq('person', SLUG);

	const { data, error } = await query;
	if (error) throw error;

	let people = (data || []).filter((p) => p.person);

	// Default run: people who do not yet have a backing question page.
	if (!FORCE && !SLUG) people = people.filter((p) => !p.chorus_question_url);
	if (ONLY.length) {
		const wanted = new Set(ONLY);
		people = people.filter((p) => wanted.has(p.person));
		const missing = ONLY.filter((slug) => !people.some((p) => p.person === slug));
		if (missing.length) console.warn(`--only: no eligible row for ${missing.join(', ')}`);
	}
	people = people.slice(0, LIMIT);

	const authorId = await getAuthorId();

	// Seed the avoid-list with every question already in use, then accumulate the
	// ones chosen during this run so later people in the batch cannot repeat
	// earlier ones. Capped because the prompt has to stay readable; the most
	// recent are the ones most likely to collide with the current scene pool.
	const { data: liveQuestions } = await supabase
		.from('blogs_famous_people')
		.select('chorus_question')
		.eq('published', true)
		.not('chorus_question', 'is', null);
	const avoidQuestions = (liveQuestions || [])
		.map((row) => String(row.chorus_question || '').trim())
		.filter(Boolean);
	if (AVOID_FILE) {
		const extra = readFileSync(AVOID_FILE, 'utf8')
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);
		avoidQuestions.push(...extra);
		console.log(`Avoid-list extended with ${extra.length} question(s) from ${AVOID_FILE}.`);
	}
	const AVOID_PROMPT_CAP = Number(process.env.CHORUS_AVOID_CAP) || 60;
	const recentAvoid = () => avoidQuestions.slice(-AVOID_PROMPT_CAP);
	console.log(`Avoid-list seeded with ${avoidQuestions.length} question(s) already in use.`);

	console.log(
		`Chorus editorial generation — ${people.length} person(s)` +
			` [question: ${QUESTION_MODEL}; review: ${REVIEW_MODEL}; takes: ${TAKES_MODEL}]` +
			(FORCE ? ' [force]' : '') +
			(PUBLISH ? ' [publishing reviewed copy]' : ' [dry run; no database writes]') +
			(authorId ? '' : ' [no author profile found; questions would be authorless]')
	);
	if (!people.length) return;

	let ok = 0;
	let failed = 0;
	/** @type {Map<string, string>} person slug -> chosen question, dry runs only */
	const chosen = new Map();
	for (let i = 0; i < people.length; i += CONCURRENCY) {
		const batch = people.slice(i, i + CONCURRENCY);
		await Promise.all(
			batch.map(async (person) => {
				try {
					const reviewedQuestion = SLUG === person.person ? REVIEWED_QUESTION : null;
					const needGen =
						Boolean(reviewedQuestion) || FORCE || Boolean(SLUG) || !person.chorus_question;
					let questionText = reviewedQuestion?.trim() || person.chorus_question;
					let takes = null;
					let candidates = null;
					let scenes = null;
					if (needGen) {
						const chorus = await generate(person, reviewedQuestion, recentAvoid());
						questionText = chorus.question;
						if (chorus.question) avoidQuestions.push(chorus.question);
						takes = chorus.takes;
						candidates = chorus.candidates;
						scenes = chorus.scenes;
					}
					if (!PUBLISH) {
						ok++;
						if (candidates) {
							console.log(`  SCENE DECK ${person.person}`);
							for (const [index, scene] of scenes.entries())
								console.log(`     ${index + 1}. ${scene}`);
							for (const [index, candidate] of candidates.entries()) {
								const score = Object.values(candidate.editorialReview.scores).reduce(
									(sum, value) => sum + value,
									0
								);
								const passed = candidate.quality.passed && candidate.editorialReview.passed;
								const status = passed ? `EDITOR PASS ${score}/20` : `REJECT ${score}/20`;
								console.log(
									`     C${index + 1}/S${candidate.sceneNumber}. [${status}] ${candidate.question}`
								);
								for (const answer of candidate.sampleAnswers) console.log(`        - ${answer}`);
								for (const issue of candidate.quality.errors)
									console.log(`        ! ${issue.message}`);
								console.log(`        Editor: ${candidate.editorialReview.reason}`);
								if (candidate.risk) console.log(`        Risk: ${candidate.risk}`);
							}
						}
						chosen.set(person.person, questionText);
						console.log(`  REVIEW ${person.person}\n     Q: ${questionText}`);
						return;
					}
					const url = await persist(person, questionText, takes, authorId);
					ok++;
					console.log(`  ✓ ${person.person}  →  /questions/${url}\n     Q: ${questionText}`);
				} catch (e) {
					failed++;
					console.error(`  ✗ ${person.person}: ${e.message}`);
				}
			})
		);
	}

	// Concurrency means everyone in a wave sees the same avoid-list snapshot, so
	// same-wave collisions survive the prompt-level guard. Sweep them up here:
	// regenerate one at a time, with the full accumulated list, until the batch is
	// distinct. Dry runs only — a --publish run handles one reviewed slug.
	if (!PUBLISH && chosen.size > 1) {
		// Two checks, because they catch different failures. Matching openings make
		// the corpus feel templated even when the questions differ. Matching content
		// words mean two pages are literally asking the same thing, which happens
		// when both subjects drew the same scene seed — the reworded result passes
		// an opening check while still being the same question.
		const STOPWORDS = new Set(
			'a an the you your yours do does did doing done what when where who whom how why is are was were be been being to of in on at for with about after before that this it its as and or but if then so from they them their there here just really actually first thing things something someone else out up down off over under again more most some any not no yes i me my we us our'.split(
				' '
			)
		);
		const tokensOf = (q) =>
			String(q || '')
				.toLowerCase()
				.replace(/[^a-z ]/g, '')
				.split(' ')
				.filter((w) => w && !STOPWORDS.has(w));
		const openingOf = (q) =>
			String(q || '')
				.toLowerCase()
				.replace(/[^a-z ]/g, '')
				.split(' ')
				.filter(Boolean)
				.slice(0, 4)
				.join(' ');
		const jaccard = (a, b) => {
			const setA = new Set(a);
			const setB = new Set(b);
			if (!setA.size || !setB.size) return 0;
			let shared = 0;
			for (const token of setA) if (setB.has(token)) shared += 1;
			return shared / (setA.size + setB.size - shared);
		};
		const NEAR_DUPLICATE = Number(process.env.CHORUS_NEAR_DUPLICATE) || 0.6;

		for (let round = 1; round <= 3; round += 1) {
			const seen = new Map();
			const keptTokens = [];
			const collided = [];
			for (const [slug, question] of chosen) {
				const key = openingOf(question);
				const tokens = tokensOf(question);
				const nearDuplicate = keptTokens.some((prior) => jaccard(prior, tokens) >= NEAR_DUPLICATE);
				if (seen.has(key) || nearDuplicate) {
					collided.push(slug);
				} else {
					seen.set(key, slug);
					keptTokens.push(tokens);
				}
			}
			if (!collided.length) break;
			console.log(
				`\nDedupe round ${round}: ${collided.length} question(s) share an opening with another in this batch. Regenerating.`
			);
			for (const slug of collided) {
				const person = people.find((p) => p.person === slug);
				if (!person) continue;
				try {
					const regenerated = await generate(person, null, avoidQuestions.slice(-AVOID_PROMPT_CAP));
					if (!regenerated.question) continue;
					chosen.set(slug, regenerated.question);
					avoidQuestions.push(regenerated.question);
					console.log(`  REVIEW ${slug}\n     Q: ${regenerated.question}`);
				} catch (e) {
					console.error(`  ✗ dedupe ${slug}: ${e.message}`);
				}
			}
		}
	}

	console.log(`\nDone. ${ok} succeeded, ${failed} failed.`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
