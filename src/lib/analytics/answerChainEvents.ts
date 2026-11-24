// src/lib/analytics/answerChainEvents.ts
//
// PostHog events for "Answer the next one" (AnswerNext.svelte), the step after a
// reveal on celebrity pages and the homepage. Funnel: answer_next_shown →
// answer_next_opened → comment_created (surface 'answer_chain', from the card).
// `host` is the surface the reveal sat on; `step` is 1 for the first extra question.
import { capture } from '$lib/analytics/posthog';

export type AnswerNextHost = 'personality_chorus' | 'homepage';

type Input = { host: AnswerNextHost; step: number; sourcePath: string };

export function captureAnswerNextShown(input: Input): Promise<void> {
	return capture('answer_next_shown', { surface: 'answer_chain', ...input });
}

export function captureAnswerNextOpened(input: Input): Promise<void> {
	return capture('answer_next_opened', { surface: 'answer_chain', ...input });
}

export function captureAnswerNextSkipped(input: Input): Promise<void> {
	return capture('answer_next_skipped', { surface: 'answer_chain', ...input });
}
