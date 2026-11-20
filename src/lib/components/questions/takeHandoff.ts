// src/lib/components/questions/takeHandoff.ts
//
// The give-first handoff. When a visitor posts their first answer, the text
// they typed travels from the composer into the "Your take" slot while the
// room opens, so the payoff reads as one continuous motion instead of a
// composer vanishing and a card appearing somewhere below.
//
// Built on a same-document View Transition: the composer textarea is the
// "old" element, the visitor's own take card (`data-own-take="<id>"`, rendered
// by RankedComments) is the "new" one, and the browser morphs between them.
// Everything else on the page stays live (see the `take-handoff-active` rules
// in app.scss), so the composer's slide and the room's fade keep playing.
//
// Browsers without View Transitions, reduced motion, and missing elements all
// fall back to running the update directly: the handoff is decoration only.

export const TAKE_HANDOFF_NAME = 'take-handoff';
export const TAKE_HANDOFF_ROOT_CLASS = 'take-handoff-active';

type ViewTransitionLike = { finished: Promise<unknown> };
type StartViewTransition = (update: () => Promise<void>) => ViewTransitionLike;

export interface TakeHandoffOptions {
	/** The element the take leaves from (the composer textarea). */
	source: HTMLElement | null;
	/** The created take's id; its own-take card is the landing spot. */
	takeId: number | null | undefined;
	/** Applies the state change and resolves once the DOM reflects it (await tick()). */
	update: () => void | Promise<void>;
	reduceMotion: boolean;
}

let current: Promise<boolean> = Promise.resolve(false);

/** Resolves when the running handoff (if any) has finished: true if one played. */
export function waitForTakeHandoff(): Promise<boolean> {
	return current;
}

export function ownTakeSelector(takeId: number): string {
	return `[data-own-take="${takeId}"]`;
}

/** Runs `update`, morphing the source into the take's card where supported. */
export function handOffTake({ source, takeId, update, reduceMotion }: TakeHandoffOptions): void {
	const start = getStartViewTransition();
	if (!start || !source || takeId == null || reduceMotion) {
		current = Promise.resolve(update()).then(
			() => false,
			() => false
		);
		return;
	}

	const root = document.documentElement;
	let target: HTMLElement | null = null;

	source.style.viewTransitionName = TAKE_HANDOFF_NAME;
	root.classList.add(TAKE_HANDOFF_ROOT_CLASS);

	let transition: ViewTransitionLike;
	try {
		transition = start(async () => {
			// The old snapshot is taken; hand the name to the landing card.
			source.style.viewTransitionName = '';
			await update();
			target = document.querySelector<HTMLElement>(ownTakeSelector(takeId));
			if (target) target.style.viewTransitionName = TAKE_HANDOFF_NAME;
		});
	} catch {
		// startViewTransition itself threw (it should not); never lose the update.
		source.style.viewTransitionName = '';
		root.classList.remove(TAKE_HANDOFF_ROOT_CLASS);
		current = Promise.resolve(update()).then(
			() => false,
			() => false
		);
		return;
	}

	current = transition.finished.then(
		() => true,
		() => false
	);
	void current.then(() => {
		source.style.viewTransitionName = '';
		if (target) target.style.viewTransitionName = '';
		root.classList.remove(TAKE_HANDOFF_ROOT_CLASS);
	});
}

function getStartViewTransition(): StartViewTransition | null {
	if (typeof document === 'undefined') return null;
	const doc = document as Document & { startViewTransition?: StartViewTransition };
	return typeof doc.startViewTransition === 'function' ? doc.startViewTransition.bind(doc) : null;
}
