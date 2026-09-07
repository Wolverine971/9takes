// src/lib/components/questions/newReplyTreatment.ts
//
// The QC-05 "New reply" return treatment, shared by the anonymous token
// return (ReplyNotificationReturn) and the signed-in `?reply=<id>` deep link
// (ReplyFocusThread): scroll to the target without animation under reduced
// motion, mark it once it has been at least half visible, and soften the
// label/highlight afterwards (immediately under reduced motion, else after a
// short delay). Keep both flows on these helpers so they never drift.

import type { Comment } from '$lib/types/questions';

/** Server-resolved `?reply=<id>` target: the reply id and its parent take with replies pre-loaded. */
export type ReplyFocusThread = {
	replyId: number;
	parent: Comment & { comments: Comment[] };
};

export const NEW_REPLY_SOFTEN_DELAY_MS = 4_000;
export const NEW_REPLY_VISIBLE_RATIO = 0.5;

export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function scrollToNewReply(
	target: HTMLElement | null | undefined,
	reduceMotion: boolean
): void {
	target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
}

/**
 * Calls `onVisible` once the target has been at least half visible (or right
 * away when IntersectionObserver is unavailable). Returns a cleanup function.
 */
export function whenNewReplyVisible(
	target: HTMLElement | null | undefined,
	onVisible: () => void
): () => void {
	if (!target || typeof IntersectionObserver !== 'function') {
		onVisible();
		return () => {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			if (
				entries.some(
					(entry) => entry.isIntersecting && entry.intersectionRatio >= NEW_REPLY_VISIBLE_RATIO
				)
			) {
				onVisible();
				observer.disconnect();
			}
		},
		{ threshold: [NEW_REPLY_VISIBLE_RATIO] }
	);
	observer.observe(target);
	return () => observer.disconnect();
}

/**
 * Softens the "New reply" treatment: immediately under reduced motion (no
 * timed change), otherwise after NEW_REPLY_SOFTEN_DELAY_MS. Returns a cleanup
 * function that cancels a pending soften.
 */
export function softenNewReply(reduceMotion: boolean, onSoften: () => void): () => void {
	if (reduceMotion) {
		onSoften();
		return () => {};
	}
	const timer = setTimeout(onSoften, NEW_REPLY_SOFTEN_DELAY_MS);
	return () => clearTimeout(timer);
}
