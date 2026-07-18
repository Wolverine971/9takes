// src/lib/server/nineTakesGenerator.ts
//
// Generates the nine AI-seeded takes for a question as NINE SEPARATE per-type
// LLM calls, each carrying only that type's voice pack (nineTakesVoices.ts),
// plus one cheap "director" call up front that plans the spread: how much each
// pattern would even say to this question (engagement), a hidden persona, and
// a distinct concrete angle so the nine takes never collapse into paraphrases.
//
// Transport-agnostic: callers inject a JSON-returning LLM function, so this
// module is shared by the SvelteKit server (SmartLLMService adapter in
// src/utils/server/openai.ts) and scripts/regen-nine-takes.ts (raw OpenRouter
// fetch). Keep it free of $env, $lib aliases, and SvelteKit imports.

import {
	ENGAGEMENT_LENGTH,
	PROPENSITY_REFERENCE,
	SHARED_CRAFT_RULES,
	TAKE_VOICE_PACKS,
	type EngagementLevel,
	type TakeVoicePack
} from './nineTakesVoices';

export type TakesJsonCaller = (args: {
	systemPrompt: string;
	userPrompt: string;
	temperature: number;
	operationType: string;
	taskId?: string;
}) => Promise<unknown>;

export type TakePlan = {
	type: number;
	engagement: EngagementLevel;
	/** Hidden writing persona: job, age bracket, one situational detail. Never displayed. */
	persona: string;
	/** Concrete angle seed, distinct across the nine. */
	angle: string;
};

export type NineTakesResult = {
	/** Keyed '1'..'9' to match replaceQuestionAiOutputs / comments_ai. */
	answers: Record<string, string>;
	plans: TakePlan[];
	/** Types that failed generation after retries (absent from answers). */
	failedTypes: number[];
	/** Last failure reason per failed type, for logging. */
	failureReasons: Record<number, string>;
};

const ALL_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Honest static spread used when the director call fails: 4 has the most to
// say to almost anything, 5 and 8 the least.
const FALLBACK_ENGAGEMENT: Record<number, EngagementLevel> = {
	1: 'medium',
	2: 'medium',
	3: 'medium',
	4: 'high',
	5: 'low',
	6: 'medium',
	7: 'medium',
	8: 'low',
	9: 'high'
};

function clean(text: unknown): string {
	return (text ?? '').toString().replace(/\s+/g, ' ').trim();
}

/**
 * Em dashes are banned platform-wide and takes render as plain text, so scrub
 * both dashes and any markdown emphasis that slips through the prompt rules.
 */
function scrubTake(text: string): string {
	return clean(text)
		.replace(/\s*[—–]\s*/g, ', ')
		.replace(/\*/g, '')
		.replace(/^["'“‘]+|["'”’]+$/g, '')
		.trim();
}

/** The machinery must never show: no Enneagram vocabulary in a published take. */
function leaksMachinery(text: string): boolean {
	return (
		/enneagram/i.test(text) ||
		/\bas an? type\b/i.test(text) ||
		/\b(the )?(reformer|peacemaker|individualist|loyalist)\b/i.test(text) ||
		/\barchetype\b/i.test(text)
	);
}

function compactTypeReference(): string {
	return ALL_TYPES.map((t) => {
		const p = TAKE_VOICE_PACKS[t];
		return `${t} (${p.archetype}): ${p.attention}`;
	}).join('\n');
}

function normalizeEngagement(value: unknown): EngagementLevel | null {
	const v = clean(value).toLowerCase();
	return v === 'high' || v === 'medium' || v === 'low' ? v : null;
}

/**
 * Director pass: one cheap call that plans engagement, persona, and a distinct
 * angle per type for THIS question. Falls back to a static spread on failure so
 * the writer calls can always run.
 */
export async function planNineTakes(
	question: string,
	callJson: TakesJsonCaller,
	taskId?: string
): Promise<TakePlan[]> {
	const systemPrompt = [
		'You are the casting director for 9takes ("one situation, nine ways to see it").',
		'Given one question, plan nine anonymous answers, one per Enneagram pattern (1 through 9).',
		'',
		'For each pattern decide three things:',
		'1. engagement: "high", "medium", or "low". Be honest about how much THIS pattern would',
		'   actually have to say to THIS question. The spread must vary: at least one "low" and at',
		'   least one "high", never all nine the same. Reference:',
		PROPENSITY_REFERENCE,
		'',
		'2. persona: a hidden writing persona in the form "job, age bracket, one situational detail"',
		'   (e.g. "night-shift ER tech, late 20s, typing on a break"). Make the nine personas',
		'   genuinely diverse in occupation, age, and life situation. Personas are never displayed.',
		'',
		'3. angle: ONE concrete scenario, object, or detail this person builds their answer around.',
		'   All nine angles must be clearly distinct: no two answers may land on the same place, scene,',
		'   or object, even by different routes (if one picks a library, nobody else picks a library).',
		'   If two patterns would reach for the same obvious answer, send them somewhere different.',
		'',
		'What each pattern notices first:',
		compactTypeReference(),
		'',
		'Return STRICT JSON only:',
		'{"plans": [{"type": 1, "engagement": "medium", "persona": string, "angle": string}, ... all nine in order]}'
	].join('\n');

	const raw = await callJson({
		systemPrompt,
		userPrompt: `Question: ${question}\n\nPlan the nine answers. JSON only.`,
		temperature: 0.8,
		operationType: 'nine_takes_director',
		taskId
	});

	const rawPlans = Array.isArray((raw as any)?.plans) ? (raw as any).plans : [];
	const byType = new Map<number, TakePlan>();
	for (const p of rawPlans) {
		const type = Number(p?.type);
		const engagement = normalizeEngagement(p?.engagement);
		if (!ALL_TYPES.includes(type) || !engagement) continue;
		byType.set(type, {
			type,
			engagement,
			persona: clean(p.persona) || 'an ordinary adult with a job and a full life',
			angle: clean(p.angle)
		});
	}

	return ALL_TYPES.map(
		(type) =>
			byType.get(type) ?? {
				type,
				engagement: FALLBACK_ENGAGEMENT[type],
				persona: 'an ordinary adult with a job and a full life',
				angle: ''
			}
	);
}

function buildWriterSystemPrompt(pack: TakeVoicePack, engagement: EngagementLevel): string {
	return [
		SHARED_CRAFT_RULES,
		'',
		'THE WAY THIS PERSON SEES THE WORLD (interior logic; never name or explain it):',
		pack.worldview,
		'',
		'WHAT THEY NOTICE FIRST IN ANY QUESTION:',
		pack.attention,
		'',
		'HOW THEY TYPE (rhythm, texture, formatting):',
		pack.voice,
		'',
		'WHAT THEY HAVE A LOT OR A LITTLE TO SAY ABOUT:',
		pack.propensity,
		'',
		'NEVER DO:',
		pack.avoid,
		'',
		ENGAGEMENT_LENGTH[engagement]
	].join('\n');
}

/** One per-type writer call. Retries once if the answer leaks type machinery. */
export async function writeTake(
	question: string,
	plan: TakePlan,
	callJson: TakesJsonCaller,
	taskId?: string,
	takenAngles: string[] = []
): Promise<string> {
	const pack = TAKE_VOICE_PACKS[plan.type];
	if (!pack) throw new Error(`no voice pack for type ${plan.type}`);

	const systemPrompt = buildWriterSystemPrompt(pack, plan.engagement);
	const userPrompt = [
		`Question this person is answering: ${question}`,
		'',
		`Hidden persona (scaffolding only, never shown or introduced): ${plan.persona}`,
		plan.angle ? `Angle seed (adapt freely; it is a seed, not a script): ${plan.angle}` : '',
		takenAngles.length
			? `Other people answering this question are already building on these, so stay away from them: ${takenAngles.join('; ')}`
			: '',
		'',
		'Write this one person\'s answer. Return STRICT JSON only: {"take": string}'
	]
		.filter(Boolean)
		.join('\n');

	let lastReason = 'unknown';
	for (let attempt = 0; attempt < 2; attempt++) {
		let raw: unknown;
		try {
			raw = await callJson({
				systemPrompt,
				userPrompt:
					attempt === 0
						? userPrompt
						: `${userPrompt}\n\nYour previous attempt was rejected (${lastReason}). Write the answer as this one person talking; never reference a personality system or archetype.`,
				temperature: 0.9,
				operationType: 'nine_takes_writer',
				taskId: taskId ? `${taskId}:type${plan.type}` : undefined
			});
		} catch (e) {
			lastReason = (e as Error)?.message ?? 'LLM call failed';
			continue;
		}

		const take = scrubTake((raw as any)?.take);
		if (!take || take.length < 10) {
			lastReason = `empty or too short: "${take}"`;
			continue;
		}
		if (take.length > 1500) {
			lastReason = `too long (${take.length} chars)`;
			continue;
		}
		if (leaksMachinery(take)) {
			lastReason = 'mentioned a personality system or archetype';
			continue;
		}
		return take;
	}

	throw new Error(`type ${plan.type} take failed validation: ${lastReason}`);
}

/**
 * Full pipeline: director pass, then nine per-type writer calls in parallel,
 * with one sequential retry round for stragglers. Returns whatever succeeded;
 * callers decide how to treat a partial nine.
 */
export async function generateNineTakes(
	question: string,
	callJson: TakesJsonCaller,
	taskId?: string
): Promise<NineTakesResult> {
	const trimmed = clean(question);
	if (!trimmed) throw new Error('generateNineTakes: empty question');

	let plans: TakePlan[];
	try {
		plans = await planNineTakes(trimmed, callJson, taskId);
	} catch {
		plans = ALL_TYPES.map((type) => ({
			type,
			engagement: FALLBACK_ENGAGEMENT[type],
			persona: 'an ordinary adult with a job and a full life',
			angle: ''
		}));
	}

	const answers: Record<string, string> = {};
	const failedTypes: number[] = [];
	const failureReasons: Record<number, string> = {};

	const settled = await Promise.allSettled(
		plans.map((plan) =>
			writeTake(
				trimmed,
				plan,
				callJson,
				taskId,
				plans.filter((p) => p.type !== plan.type && p.angle).map((p) => p.angle)
			)
		)
	);
	settled.forEach((result, i) => {
		if (result.status === 'fulfilled') answers[String(plans[i].type)] = result.value;
		else {
			failedTypes.push(plans[i].type);
			failureReasons[plans[i].type] = (result.reason as Error)?.message ?? 'unknown';
		}
	});

	// One quieter retry round for anything that failed the parallel pass.
	for (const type of [...failedTypes]) {
		const plan = plans.find((p) => p.type === type);
		if (!plan) continue;
		try {
			answers[String(type)] = await writeTake(
				trimmed,
				plan,
				callJson,
				taskId,
				plans.filter((p) => p.type !== type && p.angle).map((p) => p.angle)
			);
			failedTypes.splice(failedTypes.indexOf(type), 1);
			delete failureReasons[type];
		} catch (e) {
			failureReasons[type] = (e as Error)?.message ?? 'unknown';
		}
	}

	return { answers, plans, failedTypes: failedTypes.sort((a, b) => a - b), failureReasons };
}
