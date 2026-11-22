// src/lib/data/superlativeRankings.js
//
// Every "Which Enneagram type is the most…" pick 9takes makes, for the hub at
// /enneagram-corner/enneagram-type-rankings. Each row restates the pick its
// post makes; when a post changes its pick, change it here too. A row only
// shows once its post is published, so the hub fills in as posts go live.
//
// Reader votes are keyed by `trait`. Never rename a live trait: add a new one.
// Plain JS so scripts/generate-sitemap.js can read it.
//
// Left out on purpose (2026-11-21): posts that decline to name a type
// (worst, manipulative, depressed, autistic, addiction, dependent PD), and ADHD,
// where the ADHD post (Type 7) and the neurodivergence guide (no type) disagree.

/** @typedef {'relationships' | 'mind' | 'shadow' | 'mental-health' | 'rarity'} SuperlativeGroup */

/**
 * @typedef {object} SuperlativeTrait
 * @property {string} trait Vote key. Stable forever.
 * @property {SuperlativeGroup} group
 * @property {string} label Short row label, e.g. "Most jealous".
 * @property {string} question The search question the row answers.
 * @property {number} pick
 * @property {number | null} runnerUp
 * @property {number | null} least
 * @property {string} reason One sentence on why, in the post's framing.
 * @property {string} postPath The post that makes the case.
 * @property {boolean} selfReport Whether "This is me" makes sense for this trait.
 */

/** @type {{ slug: SuperlativeGroup; title: string }[]} */
export const SUPERLATIVE_GROUPS = [
	{ slug: 'relationships', title: 'Love and other people' },
	{ slug: 'mind', title: 'Feelings, mind and success' },
	{ slug: 'shadow', title: 'The shadow side' },
	{ slug: 'mental-health', title: 'Mental health' },
	{ slug: 'rarity', title: 'Rare and common' }
];

/** @type {SuperlativeTrait[]} */
export const SUPERLATIVE_TRAITS = [
	{
		trait: 'jealous',
		group: 'relationships',
		label: 'Most jealous',
		question: 'Which Enneagram type is the most jealous?',
		pick: 4,
		runnerUp: 2,
		least: 9,
		reason:
			"Envy is the Four's core passion. Twos get jealous in love; Nines least, because their whole strategy is to want less.",
		postPath: '/enneagram-corner/which-enneagram-type-is-the-most-jealous',
		selfReport: true
	},
	{
		trait: 'hardest-to-love',
		group: 'relationships',
		label: 'Hardest to love',
		question: 'Which Enneagram type is the hardest to love?',
		pick: 4,
		runnerUp: 5,
		least: 2,
		reason:
			"A Four's attention goes to what's missing, so the love already in front of them can feel less real.",
		postPath: '/enneagram-corner/which-enneagram-type-is-the-hardest-to-love',
		selfReport: true
	},
	{
		trait: 'most-difficult',
		group: 'relationships',
		label: 'Most difficult to deal with',
		question: 'Which Enneagram type is the most difficult to deal with?',
		pick: 8,
		runnerUp: 1,
		least: 9,
		reason:
			"An Eight pushes, takes over and says the blunt thing. A One's standard is never quite met.",
		postPath: '/enneagram-corner/which-enneagram-type-is-the-hardest-to-love',
		selfReport: true
	},
	{
		trait: 'emotional',
		group: 'mind',
		label: 'Most emotional',
		question: 'Which Enneagram type is the most emotional?',
		pick: 4,
		runnerUp: 6,
		least: 8,
		reason:
			'Fours scored higher on neuroticism in 8 of 9 Big Five studies. Sixes matched them, mostly as anxiety. Eights tested lower.',
		postPath: '/enneagram-corner/which-enneagram-type-is-the-most-emotional',
		selfReport: true
	},
	{
		trait: 'intelligent',
		group: 'mind',
		label: 'Most intelligent',
		question: 'Which Enneagram type is the most intelligent?',
		pick: 5,
		runnerUp: 7,
		least: null,
		reason:
			'Not a higher IQ: the Five is the type built around its mind. We won\'t name a "least" type, and Nines are the most underestimated.',
		postPath: '/enneagram-corner/which-enneagram-type-is-the-most-intelligent',
		selfReport: true
	},
	{
		trait: 'successful',
		group: 'mind',
		label: 'Most successful',
		question: 'Which Enneagram type is the most successful?',
		pick: 3,
		runnerUp: 8,
		least: 4,
		reason:
			"Threes reported the highest income in Truity's 81,683-person survey and lead the business figures we've profiled.",
		postPath: '/enneagram-corner/which-enneagram-type-is-the-most-successful',
		selfReport: true
	},
	{
		trait: 'richest',
		group: 'mind',
		label: 'Richest',
		question: 'Which Enneagram type is the richest?',
		pick: 5,
		runnerUp: null,
		least: null,
		reason:
			"Most of the world's ten richest people we've typed are Fives. A tiny sample, not a law.",
		postPath: '/enneagram-corner/which-enneagram-type-is-the-most-successful',
		selfReport: false
	},
	{
		trait: 'ceo',
		group: 'mind',
		label: 'Most common among CEOs',
		question: 'What Enneagram type are most CEOs?',
		pick: 5,
		runnerUp: 3,
		least: 2,
		reason:
			"Fives lead the company leaders we've profiled by a wide margin. Threes come second, and there are no Twos at all.",
		postPath: '/enneagram-corner/what-enneagram-type-are-most-ceos',
		selfReport: false
	},
	{
		trait: 'selfish',
		group: 'shadow',
		label: 'Most selfish',
		question: 'Which Enneagram type is the most selfish?',
		pick: 7,
		runnerUp: 4,
		least: 9,
		reason:
			"A Seven protects its own options first; a Four's attention circles back to its own feelings.",
		postPath: '/enneagram-corner/which-enneagram-type-is-the-most-selfish',
		selfReport: true
	},
	{
		trait: 'narcissist',
		group: 'shadow',
		label: 'Most likely to be a narcissist',
		question: 'Which Enneagram type is most likely to be a narcissist?',
		pick: 3,
		runnerUp: 8,
		least: null,
		reason:
			'No type is the narcissist type, but if you force a pick, the thin evidence leans Three, then Eight.',
		postPath: '/enneagram-corner/which-enneagram-type-is-most-likely-to-be-a-narcissist',
		selfReport: false
	},
	{
		trait: 'anxious',
		group: 'mental-health',
		label: 'Most anxious',
		question: 'Which Enneagram type has the most anxiety?',
		pick: 6,
		runnerUp: null,
		least: null,
		reason:
			"The Six's worst-case scanning looks the most like anxiety, but every type has a high-anxiety version.",
		postPath: '/enneagram-corner/mental-health/enneagram-anxiety-complete-guide',
		selfReport: false
	},
	{
		trait: 'borderline',
		group: 'mental-health',
		label: 'Most likely to have BPD',
		question: 'Which Enneagram type is most likely to have BPD?',
		pick: 4,
		runnerUp: 7,
		least: null,
		reason:
			'The Type 4 scale had the strongest borderline correlation in the one clinic study. No type causes a disorder.',
		postPath: '/enneagram-corner/enneagram-and-personality-disorders',
		selfReport: false
	},
	{
		trait: 'histrionic',
		group: 'mental-health',
		label: 'Most likely to have HPD',
		question: 'Which Enneagram type is most likely to have histrionic personality disorder?',
		pick: 2,
		runnerUp: 4,
		least: null,
		reason: 'One of the few calls the clinic data, Naranjo and the Enneagram Institute all share.',
		postPath: '/enneagram-corner/enneagram-and-personality-disorders',
		selfReport: false
	},
	{
		trait: 'psychopath',
		group: 'mental-health',
		label: 'Most likely to be a psychopath',
		question: 'Which Enneagram type is most likely to be a psychopath?',
		pick: 8,
		runnerUp: null,
		least: 9,
		reason:
			'If you force a pick: only the Type 8 scale tracked antisocial symptoms in the clinic study, and both traditions agree.',
		postPath: '/enneagram-corner/enneagram-and-personality-disorders',
		selfReport: false
	},
	{
		trait: 'most-common',
		group: 'rarity',
		label: 'Most common',
		question: 'What is the most common Enneagram type?',
		pick: 9,
		runnerUp: null,
		least: null,
		reason:
			"Nines lead the largest public sample of test-takers, but Truity's puts Eights first. Neither describes everyone.",
		postPath: '/enneagram-corner/how-common-is-each-enneagram-type',
		selfReport: false
	},
	{
		trait: 'rarest',
		group: 'rarity',
		label: 'Rarest',
		question: 'What is the rarest Enneagram type?',
		pick: 5,
		runnerUp: null,
		least: null,
		reason:
			"Fives are named rarest most often, but Truity's rarest is Seven and no representative study settles it.",
		postPath: '/enneagram-corner/how-common-is-each-enneagram-type',
		selfReport: false
	}
];

/** Hub stays out of Google (noindex, no sitemap entry) below this many live rows. */
export const MIN_LIVE_ROWS_FOR_INDEX = 8;
/** Reader picks stay hidden until a trait has this many. */
export const MIN_PICK_VOTES = 10;
/** "x% of 4s say this is them" shows once that type has this many voters across the hub. */
export const MIN_TYPE_BASE = 5;

const TRAIT_KEYS = new Set(SUPERLATIVE_TRAITS.map((row) => row.trait));

/** @param {string} value */
export function isSuperlativeTrait(value) {
	return TRAIT_KEYS.has(value);
}

/** @param {string} trait */
export function getSuperlativeTrait(trait) {
	return SUPERLATIVE_TRAITS.find((row) => row.trait === trait) ?? null;
}
