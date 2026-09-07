import { isOwnTake } from '$lib/components/questions/commentRanking';
import type { Comment } from '$lib/types/questions';

export const VIEW_STORAGE_PREFIX = '9takes:comment-views:';
const MAX_STORED = 500;
const BATCH_SIZE = 40;

/** Post-render, best-effort impressions. No state here participates in rendering or ranking. */
export function createCommentViewTracker(options: {
	questionId: number;
	unlocked: boolean;
	viewerId?: string | null;
	viewerFingerprint?: string | null;
}) {
	const storageKey = `${VIEW_STORAGE_PREFIX}${options.questionId}`;
	const counted = new Set<number>();
	const pending = new Set<number>();
	const cards = new Map<
		Element,
		{ take: Comment; visible: boolean; timer?: ReturnType<typeof setTimeout> }
	>();
	let destroyed = false;
	let active = true;
	let sending = false;

	function readStored(): number[] {
		try {
			const ids: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
			return Array.isArray(ids)
				? ids.filter((id) => Number.isSafeInteger(id) && id > 0).slice(-MAX_STORED)
				: [];
		} catch {
			return [];
		}
	}
	readStored().forEach((id) => counted.add(id));

	function remember(id: number) {
		counted.add(id);
		try {
			const merged = [...new Set([...readStored(), ...counted])].slice(-MAX_STORED);
			localStorage.setItem(storageKey, JSON.stringify(merged));
		} catch {
			/* Private browsing/storage limits still allow per-visit dedupe. */
		}
	}

	function cancel(card: { timer?: ReturnType<typeof setTimeout> }) {
		if (card.timer !== undefined) clearTimeout(card.timer);
		card.timer = undefined;
	}

	function start(node: Element) {
		const card = cards.get(node);
		if (
			!card ||
			!active ||
			!card.visible ||
			document.visibilityState === 'hidden' ||
			counted.has(card.take.id) ||
			card.timer !== undefined
		)
			return;
		card.timer = setTimeout(() => {
			card.timer = undefined;
			if (destroyed || !active || !card.visible || document.visibilityState === 'hidden') return;
			// Merge other tabs just before qualification; do not leak fingerprints into storage.
			readStored().forEach((id) => counted.add(id));
			if (counted.has(card.take.id)) return;
			remember(card.take.id);
			pending.add(card.take.id);
			observer?.unobserve(node);
		}, 1000);
	}

	const observer =
		options.unlocked && typeof IntersectionObserver !== 'undefined'
			? new IntersectionObserver(
					(entries) => {
						for (const entry of entries) {
							const card = cards.get(entry.target);
							if (!card) continue;
							card.visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
							if (card.visible) start(entry.target);
							else cancel(card);
						}
					},
					{ threshold: 0.5 }
				)
			: null;

	async function flush(beacon = false) {
		if (!pending.size || (!beacon && sending)) return;
		const batches: number[][] = [];
		const ids = [...pending];
		for (let i = 0; i < ids.length; i += BATCH_SIZE) batches.push(ids.slice(i, i + BATCH_SIZE));
		sending = true;
		try {
			for (const commentIds of batches) {
				commentIds.forEach((id) => pending.delete(id));
				const body = JSON.stringify({ questionId: options.questionId, commentIds });
				if (
					beacon &&
					navigator.sendBeacon?.(
						'/api/comments/views',
						new Blob([body], { type: 'application/json' })
					)
				)
					continue;
				try {
					const response = await fetch('/api/comments/views', {
						method: 'POST',
						body,
						headers: { 'Content-Type': 'application/json' },
						keepalive: true
					});
					// A known rejection is safe to retry; an uncertain transport failure isn't.
					if (!response.ok && response.status >= 429) commentIds.forEach((id) => pending.add(id));
				} catch {
					/* A beacon must never break the discussion. */
				}
			}
		} finally {
			sending = false;
		}
	}
	function visibilityChanged() {
		for (const [node, card] of cards) {
			if (document.visibilityState === 'hidden') cancel(card);
			else start(node);
		}
	}
	function pageHidden() {
		active = false;
		cards.forEach(cancel);
		void flush(true);
	}
	function pageShown() {
		active = true;
		visibilityChanged();
	}
	const interval = observer
		? setInterval(() => {
				void flush();
			}, 2000)
		: null;
	document.addEventListener('visibilitychange', visibilityChanged);
	window.addEventListener('pagehide', pageHidden);
	window.addEventListener('pageshow', pageShown);

	return {
		observe(node: Element, take: Comment) {
			if (
				!observer ||
				destroyed ||
				take.parent_type !== 'question' ||
				take.parent_id !== options.questionId ||
				take.removed ||
				isOwnTake(take, options) ||
				counted.has(take.id)
			)
				return () => {};
			cards.set(node, { take, visible: false });
			observer.observe(node);
			return () => {
				const card = cards.get(node);
				if (card) cancel(card);
				cards.delete(node);
				observer.unobserve(node);
			};
		},
		destroy() {
			destroyed = true;
			cards.forEach(cancel);
			cards.clear();
			observer?.disconnect();
			if (interval !== null) clearInterval(interval);
			document.removeEventListener('visibilitychange', visibilityChanged);
			window.removeEventListener('pagehide', pageHidden);
			window.removeEventListener('pageshow', pageShown);
			void flush(true);
		}
	};
}
