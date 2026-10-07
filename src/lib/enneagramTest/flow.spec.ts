// src/lib/enneagramTest/flow.spec.ts
import { describe, expect, it } from 'vitest';

import { EMOTIONS, TEST_TYPES, typesForEmotion, withArticle } from './content';
import {
	initialTestState,
	reduce,
	restoreTestState,
	stepIndex,
	typesInPlay,
	type TestAction,
	type TestState
} from './flow';

function run(...actions: TestAction[]): TestState {
	return actions.reduce(reduce, initialTestState());
}

const toTypes: TestAction[] = [
	{ type: 'start' },
	{ type: 'groundworkDone' },
	{ type: 'pickEmotion', emotion: 'fear' },
	{ type: 'confirmStrength' },
	{ type: 'meetTypes' }
];

describe('content', () => {
	it('keeps DJ’s triad map: uses 8/4/6, pushes down 1/2/7, unaware 9/3/5', () => {
		expect(typesForEmotion('anger')).toEqual([8, 1, 9]);
		expect(typesForEmotion('shame')).toEqual([4, 2, 3]);
		expect(typesForEmotion('fear')).toEqual([6, 7, 5]);
	});

	it('gives every type a card that agrees with its group', () => {
		for (const emotion of Object.keys(EMOTIONS) as (keyof typeof EMOTIONS)[]) {
			for (const [relation, type] of Object.entries(EMOTIONS[emotion].ways)) {
				expect(TEST_TYPES[type].emotion).toBe(emotion);
				expect(TEST_TYPES[type].relation).toBe(relation);
			}
		}
	});

	it('uses "an" for 8 only', () => {
		expect(withArticle(8)).toBe('an 8');
		expect(withArticle(6)).toBe('a 6');
	});
});

describe('test flow', () => {
	it('walks the straight path to one type', () => {
		const state = run(...toTypes, { type: 'togglePick', pick: 6 }, { type: 'continueTypes' });
		expect(state.screen).toBe('done');
		expect(state.result).toEqual([6]);
		expect(state.path).toEqual({
			altPrompt: false,
			mismatch: null,
			noneFit: false,
			tiebreak: null
		});
	});

	it('sends two picks to the tiebreak, then to one type', () => {
		const picked = run(
			...toTypes,
			{ type: 'togglePick', pick: 6 },
			{ type: 'togglePick', pick: 5 },
			{ type: 'continueTypes' }
		);
		expect(picked.screen).toBe('tiebreak');

		const settled = reduce(picked, { type: 'tiebreak', pick: 5 });
		expect(settled.result).toEqual([5]);
		expect(settled.path.tiebreak).toBe('one');
	});

	it('keeps both types, sorted, when the tiebreak does not settle it', () => {
		const state = run(
			...toTypes,
			{ type: 'togglePick', pick: 6 },
			{ type: 'togglePick', pick: 5 },
			{ type: 'continueTypes' },
			{ type: 'tiebreakBoth' }
		);
		expect(state.screen).toBe('done');
		expect(state.result).toEqual([5, 6]);
		expect(state.path.tiebreak).toBe('both');
	});

	it('caps picks at two and flags the attempt', () => {
		const state = run(
			...toTypes,
			{ type: 'togglePick', pick: 6 },
			{ type: 'togglePick', pick: 7 },
			{ type: 'togglePick', pick: 5 }
		);
		expect(state.picks).toEqual([6, 7]);
		expect(state.pickLimitHit).toBe(true);
	});

	it('ignores picks for types that are not on screen', () => {
		const state = run(...toTypes, { type: 'togglePick', pick: 8 });
		expect(state.picks).toEqual([]);
	});

	it('does not continue with zero picks', () => {
		const state = run(...toTypes, { type: 'continueTypes' });
		expect(state.screen).toBe('types');
	});

	it('opens both groups when emotion and strength disagree', () => {
		const state = run(
			{ type: 'start' },
			{ type: 'groundworkDone' },
			{ type: 'pickEmotion', emotion: 'fear' },
			{ type: 'otherStrength' },
			{ type: 'pickStrength', emotion: 'anger' }
		);
		expect(state.screen).toBe('mismatch');

		const both = reduce(state, { type: 'showBoth' });
		expect(both.screen).toBe('ways');
		expect(both.groups).toEqual(['fear', 'anger']);
		expect(typesInPlay(both)).toEqual([6, 7, 5, 8, 1, 9]);
		expect(both.path.mismatch).toBe('both');
		expect(reduce(both, { type: 'back' }).screen).toBe('mismatch');
	});

	it('goes straight on when the "other" strength is their own emotion’s', () => {
		const state = run(
			{ type: 'start' },
			{ type: 'groundworkDone' },
			{ type: 'pickEmotion', emotion: 'shame' },
			{ type: 'otherStrength' },
			{ type: 'pickStrength', emotion: 'shame' }
		);
		expect(state.screen).toBe('ways');
		expect(state.groups).toEqual(['shame']);
	});

	it('sends a re-pick back to the emotion step and records it', () => {
		const state = run(
			{ type: 'start' },
			{ type: 'groundworkDone' },
			{ type: 'pickEmotion', emotion: 'fear' },
			{ type: 'otherStrength' },
			{ type: 'pickStrength', emotion: 'anger' },
			{ type: 'repickEmotion' }
		);
		expect(state.screen).toBe('emotion');
		expect(state.path.mismatch).toBe('repick');
	});

	it('shows all nine after "None of these" and clears picks', () => {
		const state = run(...toTypes, { type: 'togglePick', pick: 6 }, { type: 'noneFit' });
		expect(typesInPlay(state)).toHaveLength(9);
		expect(state.picks).toEqual([]);
		expect(state.path.noneFit).toBe(true);
	});

	it('records the alternate prompt even after toggling back', () => {
		const state = run(
			{ type: 'start' },
			{ type: 'groundworkDone' },
			{ type: 'toggleAlt' },
			{ type: 'toggleAlt' }
		);
		expect(state.altPrompt).toBe(false);
		expect(state.path.altPrompt).toBe(true);
	});

	it('maps screens to the six progress steps', () => {
		expect(stepIndex('intro')).toBeNull();
		expect(stepIndex('mismatch')).toBe(2);
		expect(stepIndex('tiebreak')).toBe(5);
		expect(stepIndex('done')).toBeNull();
	});
});

describe('restoreTestState', () => {
	it('restores a consistent mid-test state', () => {
		const saved = run(...toTypes, { type: 'togglePick', pick: 6 });
		const restored = restoreTestState(JSON.parse(JSON.stringify(saved)));
		expect(restored?.screen).toBe('types');
		expect(restored?.picks).toEqual([6]);
	});

	it('rejects tampered or finished states', () => {
		expect(restoreTestState(null)).toBeNull();
		expect(restoreTestState({ screen: 'done' })).toBeNull();
		expect(restoreTestState({ screen: 'types', emotion: 'joy', groups: ['fear'] })).toBeNull();
		expect(restoreTestState({ screen: 'types', emotion: 'fear', groups: [] })).toBeNull();
		expect(
			restoreTestState({ screen: 'tiebreak', emotion: 'fear', groups: ['fear'], picks: [6] })
		).toBeNull();
	});

	it('drops picks that are not real types', () => {
		const restored = restoreTestState({
			screen: 'types',
			emotion: 'fear',
			groups: ['fear'],
			picks: [6, 42, 'x']
		});
		expect(restored?.picks).toEqual([6]);
	});
});
