// scripts/generate-chorus.mjs
//
// Pre-generates "The Chorus" for personality-analysis blogs: one evergreen,
// timeless question per person plus the nine takes that answer it. Writes the
// question to blogs_famous_people.chorus_question (attached to the blog) and the
// nine takes to nine_takes. Nothing is generated live on page view.
// See docs/product/the-chorus-vision.md.
//
// Usage:
//   node scripts/generate-chorus.mjs                 # fill people missing a question
//   node scripts/generate-chorus.mjs --force         # regenerate everyone
//   node scripts/generate-chorus.mjs --slug=khloe-kardashian
//   node scripts/generate-chorus.mjs --limit=20
//   CHORUS_MODEL=anthropic/claude-sonnet-4 node scripts/generate-chorus.mjs

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OPENROUTER_KEY = process.env.PRIVATE_OPENROUTER_API_KEY;
const MODEL = process.env.CHORUS_MODEL || 'google/gemini-2.5-flash';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) throw new Error('Supabase env not set');
if (!OPENROUTER_KEY) throw new Error('PRIVATE_OPENROUTER_API_KEY not set');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const SLUG = args.find((a) => a.startsWith('--slug='))?.split('=')[1];
const LIMIT = Number(args.find((a) => a.startsWith('--limit='))?.split('=')[1]) || Infinity;
const CONCURRENCY = Number(process.env.CHORUS_CONCURRENCY) || 3;

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

function buildSystemPrompt() {
	return `You write for 9takes: "one situation, nine ways to see it."

You are given a well-known person. You do two things.

FIRST, write ONE question.
- It must be a genuine question ending in "?".
- It must be EVERGREEN and TIMELESS: no current events, ages, dates, recent news, or the words "today" or "right now". It should read just as well in ten years.
- It must be UNIVERSAL: any stranger can answer it about their own life.
- It must NOT presume the reader's situation, feelings, or past. Do not say "you are standing in...", "like you have...", or assume they have lived anything.
- Draw it from the single deepest human tension this person's life is known for, but DO NOT name the person in the question. The question stands on its own.
- Plain, warm, direct language. 12 to 30 words. No em dashes. No purple prose, no metaphors like "wreckage", "sacred", "suffocating".
- It should make a thoughtful person pause and actually want to answer.

SECOND, write NINE answers to that exact question, one per Enneagram emotional logic (types 1 through 9). Reference:
${TYPE_REFERENCE}
- Each answer is first person ("I would...", "Honestly, I..."), 1 to 2 sentences, how a person led by that logic would truly answer.
- Grounded and concrete. No melodrama, no purple metaphors. Sound like a real person talking, not a poet.
- Never name the type or its archetype inside the answer.
- Make all nine clearly distinct so a reader feels the real spread of human responses.

Return STRICT JSON only:
{"question": string, "takes": [{"type": 1, "take": string}, {"type": 2, "take": string}, ... all nine in order]}

Examples of the QUESTION style (do not reuse, match the calibre):
- "How many second chances does someone get before forgiving them becomes a way of abandoning yourself?"
- "When you finally get the thing you worked years for, why can it still feel empty?"
- "If you changed completely but everyone still treated you like your old self, would you keep proving them wrong or stop caring?"`;
}

function buildUserPrompt(person) {
	const descriptor = person.persona_title || person.occupation || '';
	const desc = (person.description || '').toString().slice(0, 600);
	return [
		`Person: ${person.displayName}${descriptor ? ` (${descriptor})` : ''}.`,
		person.enneagram ? `They read as Enneagram type ${person.enneagram}.` : '',
		desc ? `Context about them: ${desc}` : '',
		'',
		'Write the one evergreen question and the nine answers as specified. JSON only.'
	]
		.filter(Boolean)
		.join('\n');
}

function displayNameFromSlug(slug) {
	return (slug || '')
		.split('-')
		.map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
		.join(' ');
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

async function callOpenRouter(person) {
	const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${OPENROUTER_KEY}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': 'https://9takes.com',
			'X-Title': '9takes Chorus Pregen'
		},
		body: JSON.stringify({
			model: MODEL,
			temperature: 0.85,
			max_tokens: 1600,
			response_format: { type: 'json_object' },
			messages: [
				{ role: 'system', content: buildSystemPrompt() },
				{ role: 'user', content: buildUserPrompt(person) }
			]
		}),
		signal: AbortSignal.timeout(120000)
	});

	if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 200)}`);
	const data = await res.json();
	const content = data?.choices?.[0]?.message?.content;
	const parsed = parseJson(content);

	const question = (parsed.question || '').toString().replace(/\s+/g, ' ').trim();
	if (!question || !question.includes('?')) throw new Error('no valid question returned');

	const byType = new Map();
	for (const t of parsed.takes || []) {
		const n = Number(t.type);
		if (n >= 1 && n <= 9 && t.take) byType.set(n, t.take.toString().replace(/\s+/g, ' ').trim());
	}
	const takes = [];
	for (let type = 1; type <= 9; type++) {
		const take = byType.get(type);
		if (!take) throw new Error(`missing take for type ${type}`);
		takes.push({ type, archetype: ARCHETYPES[type], take, source: 'ai' });
	}

	return { question, takes };
}

// Retry transient failures (rate limits, network) with exponential backoff.
async function generate(person) {
	const delays = [0, 2000, 5000, 12000];
	let lastErr;
	for (let attempt = 0; attempt < delays.length; attempt++) {
		if (delays[attempt]) await sleep(delays[attempt]);
		try {
			return await callOpenRouter(person);
		} catch (e) {
			lastErr = e;
		}
	}
	throw lastErr;
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
		enneagram: person.enneagram ?? null
	};

	if (person.chorus_question_url) {
		const { data: existing } = await supabase
			.from('questions')
			.select('id, url')
			.eq('url', person.chorus_question_url)
			.maybeSingle();
		if (existing) {
			if (FORCE) {
				await supabase
					.from('questions')
					.update({
						question: questionText,
						data: payloadData,
						updated_at: new Date().toISOString()
					})
					.eq('id', existing.id);
			}
			return existing.url;
		}
	}

	const url = await ensureUniqueSlug(slugify(questionText));
	const { data, error } = await supabase
		.from('questions')
		.insert({ question: questionText, url, author_id: authorId, data: payloadData })
		.select('id, url')
		.single();
	if (error) throw new Error(`question insert: ${error.message}`);
	return data.url;
}

async function persist(person, questionText, takes, authorId) {
	const url = await ensureQuestion(person, questionText, authorId);

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
		.select(
			'person, enneagram, persona_title, occupation, description, chorus_question, chorus_question_url'
		)
		.eq('published', true);

	if (SLUG) query = query.eq('person', SLUG);

	const { data, error } = await query;
	if (error) throw error;

	let people = (data || [])
		.filter((p) => p.person)
		.map((p) => ({ ...p, displayName: displayNameFromSlug(p.person) }));

	// Default run: people who do not yet have a backing question page.
	if (!FORCE && !SLUG) people = people.filter((p) => !p.chorus_question_url);
	people = people.slice(0, LIMIT);

	const authorId = await getAuthorId();

	console.log(
		`Chorus pregen — ${people.length} person(s) with ${MODEL}` +
			(FORCE ? ' [force]' : '') +
			(authorId ? '' : ' [no author profile found; questions will be authorless]')
	);
	if (!people.length) return;

	let ok = 0;
	let failed = 0;
	for (let i = 0; i < people.length; i += CONCURRENCY) {
		const batch = people.slice(i, i + CONCURRENCY);
		await Promise.all(
			batch.map(async (person) => {
				try {
					const needGen = FORCE || !person.chorus_question;
					let questionText = person.chorus_question;
					let takes = null;
					if (needGen) {
						const chorus = await generate(person);
						questionText = chorus.question;
						takes = chorus.takes;
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

	console.log(`\nDone. ${ok} succeeded, ${failed} failed.`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
