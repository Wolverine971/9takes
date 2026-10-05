// src/lib/components/blog/betaInviteState.svelte.ts
//
// One state for every beta card in the tab. The desktop side card and the
// in-article card swap when the window crosses the rail breakpoint, and the
// side card remounts whenever its rail hides on scroll, so a half-typed email,
// the visitor's copy variant, and a finished signup all have to outlive any
// single card. Only browser code writes here, never a server render.
import { assignBetaCardVariant, type BetaCardCopy } from '$lib/utils/betaCardCopy';

export type BetaCardStage = 'form' | 'done';

export const betaCard = $state({
	stage: 'form' as BetaCardStage,
	email: '',
	/** When the visitor first focused the email field, for the server's fill-time check. */
	openedAt: 0
});

let assigned: BetaCardCopy | null = null;

/** This visitor's experiment variant, assigned once per tab (and kept in storage). */
export function betaCardVariant(): BetaCardCopy {
	assigned ??= assignBetaCardVariant();
	return assigned;
}

/**
 * Keys of card events already reported (`${event}:${placement}:${path}`), so a
 * card that remounts doesn't count twice. Bookkeeping only; nothing renders from it.
 */
const reportedKeys: Record<string, true> = {};

export const reportedBetaEvents = {
	has: (key: string): boolean => reportedKeys[key] === true,
	add: (key: string): void => {
		reportedKeys[key] = true;
	}
};
