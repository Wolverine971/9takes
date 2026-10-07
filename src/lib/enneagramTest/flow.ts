// src/lib/enneagramTest/flow.ts
//
// Pure state machine for the test-taker's walk through the Enneagram test
// (T-42). The component dispatches actions; everything that decides where a
// person goes next lives here so it can be unit tested without a browser.
//
// Steps: intro → groundwork → emotion → strength (→ strengthOther → mismatch)
//        → ways → types (→ tiebreak) → done

import { EMOTION_ORDER, isEmotion, isTestType, typesForEmotion } from './content';
import type { Emotion, TestType } from './content';

export type Screen =
	| 'intro'
	| 'groundwork'
	| 'emotion'
	| 'strength'
	| 'strengthOther'
	| 'mismatch'
	| 'ways'
	| 'types'
	| 'tiebreak'
	| 'done';

export type TestPath = {
	/** Opened the "which person do you understand best?" prompt. */
	altPrompt: boolean;
	/** Strength pointed to a different emotion, and what they did about it. */
	mismatch: 'repick' | 'both' | null;
	/** Tapped "None of these" and saw all nine types. */
	noneFit: boolean;
	/** How a two-type pick was resolved. */
	tiebreak: 'one' | 'both' | null;
};

export type TestState = {
	screen: Screen;
	emotion: Emotion | null;
	altPrompt: boolean;
	/** The emotion whose strength they confirmed. Equals `emotion` unless they picked another strength. */
	strengthEmotion: Emotion | null;
	/** Emotion groups whose types are on the table (1, or 2 after "show me both"). */
	groups: Emotion[];
	allNine: boolean;
	picks: TestType[];
	pickLimitHit: boolean;
	result: TestType[];
	path: TestPath;
};

export type TestAction =
	| { type: 'start' }
	| { type: 'groundworkDone' }
	| { type: 'toggleAlt' }
	| { type: 'pickEmotion'; emotion: Emotion }
	| { type: 'confirmStrength' }
	| { type: 'otherStrength' }
	| { type: 'pickStrength'; emotion: Emotion }
	| { type: 'showBoth' }
	| { type: 'repickEmotion' }
	| { type: 'meetTypes' }
	| { type: 'togglePick'; pick: TestType }
	| { type: 'noneFit' }
	| { type: 'continueTypes' }
	| { type: 'tiebreak'; pick: TestType }
	| { type: 'tiebreakBoth' }
	| { type: 'back' }
	| { type: 'restart' };

export const MAX_PICKS = 2;

/** The six numbered steps shown in the progress bar. */
export const STEP_LABELS = [
	'Groundwork',
	'Your emotion',
	'Strength check',
	'Three ways to carry it',
	'Meet the types',
	'Tiebreak'
] as const;

const STEP_INDEX: Partial<Record<Screen, number>> = {
	groundwork: 0,
	emotion: 1,
	strength: 2,
	strengthOther: 2,
	mismatch: 2,
	ways: 3,
	types: 4,
	tiebreak: 5
};

export function stepIndex(screen: Screen): number | null {
	return STEP_INDEX[screen] ?? null;
}

export function initialTestState(): TestState {
	return {
		screen: 'intro',
		emotion: null,
		altPrompt: false,
		strengthEmotion: null,
		groups: [],
		allNine: false,
		picks: [],
		pickLimitHit: false,
		result: [],
		path: { altPrompt: false, mismatch: null, noneFit: false, tiebreak: null }
	};
}

/** Emotion groups whose type cards are on screen. */
export function groupsInPlay(state: TestState): Emotion[] {
	if (state.allNine) return [...EMOTION_ORDER];
	return state.groups;
}

/** Type cards on screen, in group order. */
export function typesInPlay(state: TestState): TestType[] {
	return groupsInPlay(state).flatMap(typesForEmotion);
}

function go(state: TestState, screen: Screen): TestState {
	return { ...state, screen, pickLimitHit: false };
}

function sortTypes(types: TestType[]): TestType[] {
	return [...types].sort((a, b) => a - b);
}

function backTarget(state: TestState): Screen {
	switch (state.screen) {
		case 'groundwork':
			return 'intro';
		case 'emotion':
			return 'groundwork';
		case 'strength':
			return 'emotion';
		case 'strengthOther':
			return 'strength';
		case 'mismatch':
			return 'strengthOther';
		case 'ways':
			return state.groups.length > 1 ? 'mismatch' : 'strength';
		case 'types':
			return 'ways';
		case 'tiebreak':
			return 'types';
		default:
			return state.screen;
	}
}

export function reduce(state: TestState, action: TestAction): TestState {
	switch (action.type) {
		case 'start':
			return go(state, 'groundwork');
		case 'groundworkDone':
			return go(state, 'emotion');
		case 'toggleAlt':
			return {
				...state,
				altPrompt: !state.altPrompt,
				path: { ...state.path, altPrompt: true }
			};
		case 'pickEmotion':
			return go(
				{
					...state,
					emotion: action.emotion,
					strengthEmotion: null,
					groups: [action.emotion],
					allNine: false,
					picks: [],
					result: []
				},
				'strength'
			);
		case 'confirmStrength':
			if (!state.emotion) return go(state, 'emotion');
			return go({ ...state, strengthEmotion: state.emotion, groups: [state.emotion] }, 'ways');
		case 'otherStrength':
			return go(state, 'strengthOther');
		case 'pickStrength':
			if (!state.emotion) return go(state, 'emotion');
			if (action.emotion === state.emotion) {
				return go({ ...state, strengthEmotion: state.emotion, groups: [state.emotion] }, 'ways');
			}
			return go({ ...state, strengthEmotion: action.emotion }, 'mismatch');
		case 'showBoth':
			if (!state.emotion || !state.strengthEmotion) return go(state, 'emotion');
			return go(
				{
					...state,
					groups: [state.emotion, state.strengthEmotion],
					picks: [],
					path: { ...state.path, mismatch: 'both' }
				},
				'ways'
			);
		case 'repickEmotion':
			return go({ ...state, path: { ...state.path, mismatch: 'repick' } }, 'emotion');
		case 'meetTypes':
			return go(state, 'types');
		case 'togglePick': {
			if (!typesInPlay(state).includes(action.pick)) return state;
			if (state.picks.includes(action.pick)) {
				return {
					...state,
					picks: state.picks.filter((pick) => pick !== action.pick),
					pickLimitHit: false
				};
			}
			if (state.picks.length >= MAX_PICKS) return { ...state, pickLimitHit: true };
			return { ...state, picks: [...state.picks, action.pick], pickLimitHit: false };
		}
		case 'noneFit':
			return {
				...state,
				allNine: true,
				picks: [],
				pickLimitHit: false,
				path: { ...state.path, noneFit: true }
			};
		case 'continueTypes':
			if (state.picks.length === 1) return go({ ...state, result: [...state.picks] }, 'done');
			if (state.picks.length === 2) return go(state, 'tiebreak');
			return state;
		case 'tiebreak':
			if (!state.picks.includes(action.pick)) return state;
			return go(
				{ ...state, result: [action.pick], path: { ...state.path, tiebreak: 'one' } },
				'done'
			);
		case 'tiebreakBoth':
			if (state.picks.length !== 2) return state;
			return go(
				{ ...state, result: sortTypes(state.picks), path: { ...state.path, tiebreak: 'both' } },
				'done'
			);
		case 'back':
			return go(state, backTarget(state));
		case 'restart':
			return initialTestState();
	}
}

/**
 * Accept a state restored from browser storage only when it is internally
 * consistent; anything else starts fresh. Storage is user-editable.
 */
export function restoreTestState(value: unknown): TestState | null {
	if (!value || typeof value !== 'object') return null;
	const raw = value as Partial<TestState>;
	const screens: Screen[] = [
		'groundwork',
		'emotion',
		'strength',
		'strengthOther',
		'mismatch',
		'ways',
		'types',
		'tiebreak'
	];
	if (!raw.screen || !screens.includes(raw.screen)) return null;
	const emotion = raw.emotion ?? null;
	if (emotion !== null && !isEmotion(emotion)) return null;
	const strengthEmotion = raw.strengthEmotion ?? null;
	if (strengthEmotion !== null && !isEmotion(strengthEmotion)) return null;
	const groups = Array.isArray(raw.groups) ? raw.groups.filter(isEmotion).slice(0, 2) : [];
	const picks = Array.isArray(raw.picks) ? raw.picks.filter(isTestType).slice(0, MAX_PICKS) : [];
	const needsEmotion = raw.screen !== 'groundwork' && raw.screen !== 'emotion';
	if (needsEmotion && (!emotion || groups.length === 0)) return null;
	if (raw.screen === 'mismatch' && !strengthEmotion) return null;
	if (raw.screen === 'tiebreak' && picks.length !== 2) return null;
	const path = raw.path ?? initialTestState().path;

	return {
		...initialTestState(),
		screen: raw.screen,
		emotion,
		altPrompt: Boolean(raw.altPrompt),
		strengthEmotion,
		groups,
		allNine: Boolean(raw.allNine),
		picks,
		path: {
			altPrompt: Boolean(path.altPrompt),
			mismatch: path.mismatch === 'repick' || path.mismatch === 'both' ? path.mismatch : null,
			noneFit: Boolean(path.noneFit),
			tiebreak: null
		}
	};
}
