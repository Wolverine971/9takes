// src/lib/enneagramTest/content.ts
//
// Copy bank for the 9takes Enneagram test (T-42). The flow is DJ's spoken
// typing conversation: three hard emotions, the strength each one builds,
// and the three ways a type can carry its emotion. Source of truth for the
// wording: docs/taskers/T-42-assets/user-flow.md §6. Edit copy here, not in
// the components.
//
// DJ's triad map (2026-10-06) is deliberate and differs from the Enneagram
// Institute's outward/inward/out-of-touch split. Do not "correct" it:
//   uses it 8 / 4 / 6 · pushes it down 1 / 2 / 7 · doesn't notice it 9 / 3 / 5

export type Emotion = 'anger' | 'shame' | 'fear';
export type Relation = 'uses' | 'down' | 'unaware';
export type TestType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type EmotionContent = {
	name: string;
	color: string;
	words: string[];
	/** Line for the type in this group who doesn't notice the emotion (9, 3, 5). */
	hiddenYou: string;
	hiddenThey: string;
	/** DJ's alternate prompt: which person do you understand best? */
	empathy: string;
	strength: { name: string; you: string; they: string };
	ways: Record<Relation, TestType>;
};

export type RelationContent = {
	label: string;
	line: string;
	you: string;
	tag: string;
};

export type TypeContent = {
	name: string;
	emotion: Emotion;
	relation: Relation;
	carries: string;
	fear: string;
	chasing: string;
	patterns: [string, string, string];
	strength: string;
	say: string;
};

export const EMOTION_ORDER: Emotion[] = ['anger', 'shame', 'fear'];
export const RELATION_ORDER: Relation[] = ['uses', 'down', 'unaware'];

export const EMOTIONS: Record<Emotion, EmotionContent> = {
	anger: {
		name: 'Anger',
		color: '#DC2626',
		words: ['frustrated', 'resentful', 'irritated', 'impatient', 'pissed off'],
		hiddenYou: 'Or you rarely get angry, but you go numb, go along, or quietly dig in.',
		hiddenThey: 'Or they rarely get angry, but they go numb, go along, or quietly dig in.',
		empathy: 'The one who’s fed up',
		strength: {
			name: 'Instinct',
			you: 'You go with your gut. You feel what’s right in your body and act on it.',
			they: 'They go with their gut. They feel what’s right and act on it.'
		},
		ways: { uses: 8, down: 1, unaware: 9 }
	},
	shame: {
		name: 'Shame',
		color: '#F472B6',
		words: ['insecure', 'less than', 'not good enough', 'on the outside', 'embarrassed'],
		hiddenYou: 'Or you don’t feel insecure. You just stay busy proving yourself.',
		hiddenThey: 'Or they don’t seem insecure. They just stay busy proving themselves.',
		empathy: 'The one who feels not good enough',
		strength: {
			name: 'Emotional intelligence',
			you: 'You read people. You pick up what someone feels, often before they do.',
			they: 'They read people. They pick up what someone feels, often before that person does.'
		},
		ways: { uses: 4, down: 2, unaware: 3 }
	},
	fear: {
		name: 'Fear',
		color: '#0EA5E9',
		words: ['anxious', 'worried', 'stressed', 'on edge', 'overwhelmed'],
		hiddenYou:
			'Or you wouldn’t call it fear. You just pull back into your head and save your energy.',
		hiddenThey:
			'Or they wouldn’t call it fear. They just pull back into their head and save their energy.',
		empathy: 'The one who’s scared of what’s coming',
		strength: {
			name: 'Intellect',
			you: 'You think it through. You plan, analyze, and spot problems and options early.',
			they: 'They think it through. They plan, analyze, and spot problems and options early.'
		},
		ways: { uses: 6, down: 7, unaware: 5 }
	}
};

export const RELATIONS: Record<Relation, RelationContent> = {
	uses: {
		label: 'Uses it',
		line: 'It gives you energy. It gets you moving.',
		you: 'You use it.',
		tag: 'Uses'
	},
	down: {
		label: 'Pushes it down',
		line: 'You feel it and shove it away. “Not right now.”',
		you: 'You push it down.',
		tag: 'Pushes down'
	},
	unaware: {
		label: 'Doesn’t notice it',
		line: 'It runs in the background and steers you without asking.',
		you: 'You don’t notice it. It steers from the background.',
		tag: 'Doesn’t notice'
	}
};

export const TEST_TYPES: Record<TestType, TypeContent> = {
	8: {
		name: 'The Challenger',
		emotion: 'anger',
		relation: 'uses',
		carries:
			'Anger is fuel. You feel it fast, say it out loud, and act on it. It’s how you protect yourself and the people you love.',
		fear: 'Being controlled, harmed, or at someone else’s mercy',
		chasing: 'Staying in control of your own life',
		patterns: [
			'You’d rather be respected than liked',
			'You push to find out what people are made of',
			'Showing soft spots feels dangerous'
		],
		strength: 'Instinct for power. You read who’s really in charge and move first.',
		say: 'Just tell me straight.'
	},
	1: {
		name: 'The Perfectionist',
		emotion: 'anger',
		relation: 'down',
		carries:
			'You feel anger, but showing it doesn’t feel right. So it leaks out as correcting, criticizing, and “I’m not mad, I’m frustrated.”',
		fear: 'Being wrong, bad, or corrupt',
		chasing: 'Being good and doing it right',
		patterns: [
			'You spot the mistake before anything else',
			'Your inner critic grades you hardest',
			'“Good enough” feels like giving up'
		],
		strength: 'Instinct for right and wrong. You sense what’s off and how to fix it.',
		say: 'It’s not about me. It’s just not right.'
	},
	9: {
		name: 'The Peacemaker',
		emotion: 'anger',
		relation: 'unaware',
		carries:
			'You rarely feel angry. It stays underneath and shows up as going numb, going along, digging in your heels, or putting off what you want.',
		fear: 'Conflict, and losing connection with the people around you',
		chasing: 'Peace, inside and out',
		patterns: [
			'You see everyone’s side, sometimes except your own',
			'Conflict makes your body tense up',
			'“I’m good with whatever,” even when you aren’t'
		],
		strength: 'Instinct for harmony. You feel what a group needs to get along.',
		say: 'I’m fine with whatever.'
	},
	4: {
		name: 'The Individualist',
		emotion: 'shame',
		relation: 'uses',
		carries:
			'The “something is missing in me” feeling sits front and center. You feel it fully and turn it into depth, expression and identity.',
		fear: 'Having no real identity, or being ordinary',
		chasing: 'Being fully, uniquely yourself',
		patterns: [
			'You feel things other people don’t have names for',
			'Ordinary feels like a slow death',
			'You compare and come up missing something'
		],
		strength: 'Emotional depth. You can sit with feelings other people run from.',
		say: 'Nobody really gets it.'
	},
	2: {
		name: 'The Helper',
		emotion: 'shame',
		relation: 'down',
		carries:
			'You feel “I’m not enough” and push it away by focusing on other people. Being needed keeps it quiet. Your own needs get filed under later.',
		fear: 'Being unwanted or unloved',
		chasing: 'Being loved and needed',
		patterns: [
			'You know what someone needs before they ask',
			'Receiving help feels awkward',
			'You give until you’re empty, then feel unappreciated'
		],
		strength: 'Reading needs. You notice what someone feels before they say it.',
		say: 'Don’t worry about me.'
	},
	3: {
		name: 'The Achiever',
		emotion: 'shame',
		relation: 'unaware',
		carries:
			'You don’t feel insecure. You feel busy. The shame runs in the background and keeps you proving, performing and winning.',
		fear: 'Being worthless without your accomplishments',
		chasing: 'Being valued and admired',
		patterns: [
			'You become whoever the room rewards',
			'Stillness makes you restless',
			'Failing feels like an identity problem, not a bad day'
		],
		strength: 'Reading the room. You know what will land and adjust in real time.',
		say: 'What’s next?'
	},
	6: {
		name: 'The Loyalist',
		emotion: 'fear',
		relation: 'uses',
		carries:
			'You feel the fear and put it to work: preparing, scanning for problems, testing who you can trust. Worry is how you stay safe.',
		fear: 'Being without support or guidance when it counts',
		chasing: 'Security, and people you can count on',
		patterns: [
			'You see what could go wrong before anyone else',
			'You trust slowly, then stay loyal for life',
			'You argue with your own decisions'
		],
		strength: 'Troubleshooting. You think through the worst case so nobody gets blindsided.',
		say: 'But what if…?'
	},
	7: {
		name: 'The Enthusiast',
		emotion: 'fear',
		relation: 'down',
		carries:
			'You feel the fear and go “not now.” You reframe it, plan the next good thing, and keep your options open so nothing can trap you.',
		fear: 'Being trapped in pain, or missing out',
		chasing: 'Freedom and satisfaction',
		patterns: [
			'You plan tomorrow while today is happening',
			'Bad feelings get reframed fast',
			'Boredom feels like a threat'
		],
		strength: 'Possibilities. You connect ideas and see options other people miss.',
		say: 'Let’s keep our options open.'
	},
	5: {
		name: 'The Investigator',
		emotion: 'fear',
		relation: 'unaware',
		carries:
			'You wouldn’t call it fear. It runs in the background and pulls you into your head: save your energy, learn more, get ready before you engage.',
		fear: 'Being helpless, incapable, or overwhelmed',
		chasing: 'Being capable and understanding how things work',
		patterns: [
			'People drain you, even ones you love',
			'You want to understand before you take part',
			'Privacy is oxygen'
		],
		strength: 'Understanding. You dig until you know how it really works.',
		say: 'I need to think about it.'
	}
};

/**
 * DJ's per-type pick for the "answer a question as your type" exit, keyed by
 * type, valued by the question's `url` slug. Empty slots fall back to the
 * most-answered unflagged question (see src/lib/server/enneagramTest.ts).
 */
export const CURATED_QUESTION_SLUGS: Partial<Record<TestType, string>> = {};

export function isTestType(value: unknown): value is TestType {
	return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 9;
}

export function isEmotion(value: unknown): value is Emotion {
	return value === 'anger' || value === 'shame' || value === 'fear';
}

/** The three types that share an emotion, in uses / pushes down / unaware order. */
export function typesForEmotion(emotion: Emotion): TestType[] {
	const { ways } = EMOTIONS[emotion];
	return RELATION_ORDER.map((relation) => ways[relation]);
}

/** "a 6", "an 8". */
export function withArticle(type: number): string {
	return `${type === 8 ? 'an' : 'a'} ${type}`;
}

/** "6", "5 or 6". */
export function typeList(types: readonly number[]): string {
	return types.join(' or ');
}

/** "a 6", "a 5 or a 6". */
export function typeListWithArticles(types: readonly number[]): string {
	return types.map(withArticle).join(' or ');
}

/** "Uses fear", "Doesn’t notice anger". */
export function relationTag(type: TestType): string {
	const content = TEST_TYPES[type];
	return `${RELATIONS[content.relation].tag} ${EMOTIONS[content.emotion].name.toLowerCase()}`;
}
