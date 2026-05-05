// src/lib/data/enneagramTypeProfiles.ts
//
// Universal dossier profile for each Enneagram type.
//
// Each profile carries identity, classifications, movement, and stat axes.
// Re-tune values here — every type page reads from this file.
//
// Classifications (categorical, three options each):
//   • Triad         — Anger (1/8/9) · Shame (2/3/4) · Fear (5/6/7)
//   • Intelligence  — Instinctual · Emotional · Intellectual
//   • Hornevian     — Compliant (1/2/6) · Withdrawn (4/5/9) · Assertive (3/7/8)
//   • Harmonic      — Positive Outlook (2/7/9) · Competency (1/3/5) · Reactive (4/6/8)
//
// Movement (lines on the Enneagram symbol):
//   • stressLine — disintegration direction; behavior under pressure
//   • growthLine — integration direction; behavior in security/growth
//
// Stat axes (5 bars, mix of behavioral + Enneagram-native):
//   DIRECTNESS      — assertion/bluntness in communication (Big-5 Extraversion-assertion)
//   OUTWARD PULL    — Hornevian stance encoded numerically. Withdrawn (4/5/9) low;
//                     Compliant (1/2/6) and Assertive (3/7/8) mid-to-high.
//   STRUCTURE NEED  — pull toward order, rules, frameworks. 1/6 highest; 4/7 lowest.
//   VOLATILITY      — emotional reactivity and amplitude (Big-5 Neuroticism)
//   CURIOSITY       — openness to novelty and ideas (Big-5 Openness)

export type DossierStat = { label: string; value: number };
export type CoreEmotion = 'Anger' | 'Fear' | 'Shame';
export type Intelligence = 'Instinctual' | 'Intellectual' | 'Emotional';
export type Hornevian = 'Compliant' | 'Withdrawn' | 'Assertive';
export type Harmonic = 'Positive Outlook' | 'Competency' | 'Reactive';
export type MovementLine = { type: number; archetype: string };

export type EnneagramTypeProfile = {
	number: string;
	type: number;
	archetype: string;
	title: string;
	coreFear: string;
	coreDesire: string;
	coreEmotion: CoreEmotion;
	intelligence: Intelligence;
	hornevian: Hornevian;
	harmonic: Harmonic;
	stressLine: MovementLine;
	growthLine: MovementLine;
	akaArchetypes: [string, string];
	stats: DossierStat[];
	specimenLine: string;
	ctaHref: string;
	ctaLabel: string;
	lastObserved: string;
};

const STAT_LABELS = [
	'DIRECTNESS',
	'OUTWARD PULL',
	'STRUCTURE NEED',
	'VOLATILITY',
	'CURIOSITY'
] as const;

const buildStats = (values: [number, number, number, number, number]): DossierStat[] =>
	STAT_LABELS.map((label, i) => ({ label, value: values[i] }));

const LAST_OBSERVED = '2026-05-03';
const CTA_LABEL = 'Read the full breakdown';

export const enneagramTypeProfiles: Record<number, EnneagramTypeProfile> = {
	1: {
		number: '0001',
		type: 1,
		archetype: 'The Reformer',
		title: 'The Reformer.',
		coreFear: 'Being defective or corrupt',
		coreDesire: 'Integrity and goodness',
		coreEmotion: 'Anger',
		intelligence: 'Instinctual',
		hornevian: 'Compliant',
		harmonic: 'Competency',
		stressLine: { type: 4, archetype: 'The Individualist' },
		growthLine: { type: 7, archetype: 'The Enthusiast' },
		akaArchetypes: ['The Idealist', 'The Advocate'],
		stats: buildStats([78, 65, 95, 65, 35]),
		specimenLine:
			'ORDER · INTEGRITY · DISCIPLINE · TRUTH · STANDARDS · IMPROVEMENT · JUSTICE · PRECISION · PRINCIPLE',
		ctaHref: '#the-internal-courtroom',
		ctaLabel: CTA_LABEL,
		lastObserved: LAST_OBSERVED
	},
	2: {
		number: '0002',
		type: 2,
		archetype: 'The Helper',
		title: 'The Helper.',
		coreFear: 'Being unloved or unwanted',
		coreDesire: 'To feel deeply loved',
		coreEmotion: 'Shame',
		intelligence: 'Emotional',
		hornevian: 'Compliant',
		harmonic: 'Positive Outlook',
		stressLine: { type: 8, archetype: 'The Challenger' },
		growthLine: { type: 4, archetype: 'The Individualist' },
		akaArchetypes: ['The Servant', 'The Host'],
		stats: buildStats([35, 95, 45, 65, 50]),
		specimenLine:
			'LOVE · CONNECTION · SERVICE · WARMTH · GENEROSITY · COMPASSION · DEVOTION · EMPATHY · NURTURE',
		ctaHref: '#the-one-way-mirror',
		ctaLabel: CTA_LABEL,
		lastObserved: LAST_OBSERVED
	},
	3: {
		number: '0003',
		type: 3,
		archetype: 'The Achiever',
		title: 'The Achiever.',
		coreFear: 'Being worthless without success',
		coreDesire: 'To feel valuable',
		coreEmotion: 'Shame',
		intelligence: 'Emotional',
		hornevian: 'Assertive',
		harmonic: 'Competency',
		stressLine: { type: 9, archetype: 'The Peacemaker' },
		growthLine: { type: 6, archetype: 'The Loyalist' },
		akaArchetypes: ['The Charmer', 'The Professional'],
		stats: buildStats([75, 80, 70, 45, 60]),
		specimenLine:
			'ACHIEVEMENT · DRIVE · SUCCESS · AMBITION · EXCELLENCE · RECOGNITION · IMAGE · PERFORMANCE · CHARISMA',
		ctaHref: '#the-shape-shifting-self',
		ctaLabel: CTA_LABEL,
		lastObserved: LAST_OBSERVED
	},
	4: {
		number: '0004',
		type: 4,
		archetype: 'The Individualist',
		title: 'The Individualist.',
		coreFear: 'Having no identity or significance',
		coreDesire: 'To find an authentic self',
		coreEmotion: 'Shame',
		intelligence: 'Emotional',
		hornevian: 'Withdrawn',
		harmonic: 'Reactive',
		stressLine: { type: 2, archetype: 'The Helper' },
		growthLine: { type: 1, archetype: 'The Reformer' },
		akaArchetypes: ['The Aristocrat', 'The Bohemian'],
		stats: buildStats([65, 25, 25, 90, 80]),
		specimenLine:
			'AUTHENTICITY · DEPTH · IDENTITY · BEAUTY · EXPRESSION · UNIQUENESS · MEANING · LONGING · NUANCE',
		ctaHref: '#the-missing-piece',
		ctaLabel: CTA_LABEL,
		lastObserved: LAST_OBSERVED
	},
	5: {
		number: '0005',
		type: 5,
		archetype: 'The Investigator',
		title: 'The Investigator.',
		coreFear: 'Being helpless or incompetent',
		coreDesire: 'Mastery and understanding',
		coreEmotion: 'Fear',
		intelligence: 'Intellectual',
		hornevian: 'Withdrawn',
		harmonic: 'Competency',
		stressLine: { type: 7, archetype: 'The Enthusiast' },
		growthLine: { type: 8, archetype: 'The Challenger' },
		akaArchetypes: ['The Iconoclast', 'The Problem Solver'],
		stats: buildStats([50, 15, 60, 40, 90]),
		specimenLine:
			'KNOWLEDGE · MASTERY · INSIGHT · PRIVACY · INDEPENDENCE · OBSERVATION · ANALYSIS · DETACHMENT · COMPETENCE',
		ctaHref: '#the-fortress-mind',
		ctaLabel: CTA_LABEL,
		lastObserved: LAST_OBSERVED
	},
	6: {
		number: '0006',
		type: 6,
		archetype: 'The Loyalist',
		title: 'The Loyalist.',
		coreFear: 'Being without support or security',
		coreDesire: 'Security and certainty',
		coreEmotion: 'Fear',
		intelligence: 'Intellectual',
		hornevian: 'Compliant',
		harmonic: 'Reactive',
		stressLine: { type: 3, archetype: 'The Achiever' },
		growthLine: { type: 9, archetype: 'The Peacemaker' },
		akaArchetypes: ['The Defender', 'The Buddy'],
		stats: buildStats([50, 70, 90, 85, 40]),
		specimenLine:
			'LOYALTY · SECURITY · TRUST · VIGILANCE · COMMITMENT · PREPARATION · DUTY · COURAGE · FORESIGHT',
		ctaHref: '#the-trust-equation',
		ctaLabel: CTA_LABEL,
		lastObserved: LAST_OBSERVED
	},
	7: {
		number: '0007',
		type: 7,
		archetype: 'The Enthusiast',
		title: 'The Enthusiast.',
		coreFear: 'Being trapped in pain or deprivation',
		coreDesire: 'Freedom and satisfaction',
		coreEmotion: 'Fear',
		intelligence: 'Intellectual',
		hornevian: 'Assertive',
		harmonic: 'Positive Outlook',
		stressLine: { type: 1, archetype: 'The Reformer' },
		growthLine: { type: 5, archetype: 'The Investigator' },
		akaArchetypes: ['The Entertainer', 'The Realist'],
		stats: buildStats([70, 75, 20, 55, 95]),
		specimenLine:
			'FREEDOM · POSSIBILITY · ADVENTURE · JOY · VARIETY · OPTIMISM · EXPLORATION · SPONTANEITY · NOVELTY',
		ctaHref: '#how-your-possibility-engine-works',
		ctaLabel: CTA_LABEL,
		lastObserved: LAST_OBSERVED
	},
	8: {
		number: '0008',
		type: 8,
		archetype: 'The Challenger',
		title: 'The Challenger.',
		coreFear: 'Being controlled',
		coreDesire: 'Self-mastery',
		coreEmotion: 'Anger',
		intelligence: 'Instinctual',
		hornevian: 'Assertive',
		harmonic: 'Reactive',
		stressLine: { type: 5, archetype: 'The Investigator' },
		growthLine: { type: 2, archetype: 'The Helper' },
		akaArchetypes: ['The Maverick', 'The Bear'],
		stats: buildStats([100, 85, 45, 75, 55]),
		specimenLine:
			'POWER · STRENGTH · AUTONOMY · JUSTICE · CONTROL · PROTECTION · DECISIVENESS · COMMAND · INTENSITY',
		ctaHref: '#the-wound-that-creates-the-warrior',
		ctaLabel: CTA_LABEL,
		lastObserved: LAST_OBSERVED
	},
	9: {
		number: '0009',
		type: 9,
		archetype: 'The Peacemaker',
		title: 'The Peacemaker.',
		coreFear: 'Loss and disconnection',
		coreDesire: 'Inner and outer peace',
		coreEmotion: 'Anger',
		intelligence: 'Instinctual',
		hornevian: 'Withdrawn',
		harmonic: 'Positive Outlook',
		stressLine: { type: 6, archetype: 'The Loyalist' },
		growthLine: { type: 3, archetype: 'The Achiever' },
		akaArchetypes: ['The Referee', 'The Dreamer'],
		stats: buildStats([25, 40, 35, 25, 50]),
		specimenLine:
			'PEACE · HARMONY · STABILITY · UNITY · ACCEPTANCE · PATIENCE · INCLUSION · MEDIATION · EASE',
		ctaHref: '#how-nines-navigate-the-world',
		ctaLabel: CTA_LABEL,
		lastObserved: LAST_OBSERVED
	}
};
