// src/lib/components/questions/questionMorph.ts
//
// List → question continuity. The site already runs every client navigation
// through a View Transition (src/lib/page-transition.ts); this gives the
// question you tapped a shared name so its text glides into the headline on
// /questions/[slug] (`.q-headline` carries the same name) instead of
// cross-fading with the rest of the page.
//
// View Transition names must be unique on the page or the browser skips the
// whole transition, so a list never names every row up front: the name goes
// on the tapped row only, and comes off whatever row held it before.

import type { Attachment } from 'svelte/attachments';

export const QUESTION_TITLE_TRANSITION = 'question-title';

let tagged: HTMLElement | null = null;

function isPlainPrimaryClick(event: MouseEvent): boolean {
	return (
		event.button === 0 &&
		!event.defaultPrevented &&
		!event.metaKey &&
		!event.ctrlKey &&
		!event.shiftKey &&
		!event.altKey
	);
}

/** Moves the shared name onto `node` (and off the last tagged element). */
export function tagQuestionMorph(node: HTMLElement): void {
	if (tagged && tagged !== node) tagged.style.viewTransitionName = '';
	node.style.viewTransitionName = QUESTION_TITLE_TRANSITION;
	tagged = node;
}

/**
 * On a link or button that opens a question: a plain click hands the shared
 * name to `target(trigger)` (the question's text), else to the trigger itself.
 */
export function questionMorphOnClick(
	target?: (trigger: HTMLElement) => HTMLElement | null
): Attachment<HTMLElement> {
	return (trigger) => {
		const onclick = (event: MouseEvent) => {
			if (!isPlainPrimaryClick(event)) return;
			tagQuestionMorph(target?.(trigger) ?? trigger);
		};
		trigger.addEventListener('click', onclick);
		return () => {
			trigger.removeEventListener('click', onclick);
			if (tagged && !tagged.isConnected) tagged = null;
		};
	};
}

/** The question text inside a row link (`data-question-text`). */
export function questionTextIn(trigger: HTMLElement): HTMLElement | null {
	return trigger.querySelector<HTMLElement>('[data-question-text]');
}
