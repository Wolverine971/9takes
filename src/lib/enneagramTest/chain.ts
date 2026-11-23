// src/lib/enneagramTest/chain.ts
//
// Shared shapes for the Enneagram test result's answer chain (growth bet #1,
// 2026-11-23): up to three questions answered in a row on the result page, with
// an email capture after the second take. Server side: $lib/server/enneagramTestChain.
import type { LiveTake } from '$lib/data/homepageLiveTake';
import type { LiveTakeTypes } from '$lib/data/homepageLiveTypes';
import type { TestType } from './content';

/** Questions in a result's answer chain. */
export const CHAIN_LENGTH = 3;
/** The email capture shows once this many chain questions are answered. */
export const CHAIN_CAPTURE_AFTER = 2;

export type ChainQuestion = {
	id: number | null;
	url: string;
	question: string;
	/** The type this question is asked "as". Null on a two-type result's shared questions. */
	answeredAs: TestType | null;
};

export type ChainStep = ChainQuestion & {
	/** Answered from this result (a follow exists), or answered before on this device. */
	done: boolean;
	/** Loaded for done steps and the current step; later steps load on "Next question". */
	live: LiveTake | null;
	types: LiveTakeTypes | null;
};

export type ChainView = {
	steps: ChainStep[];
	/** Index of the first unanswered step; steps.length when all are done. */
	current: number;
};

/** GET /api/enneagram-test/results/[token]/chain/[step] success body. */
export type ChainStepResponse = {
	step: number;
	question: string;
	answeredAs: TestType | null;
	live: LiveTake;
	types: LiveTakeTypes | null;
};
