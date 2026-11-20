// src/lib/components/questions/takeHandoff.spec.ts
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	TAKE_HANDOFF_NAME,
	TAKE_HANDOFF_ROOT_CLASS,
	handOffTake,
	waitForTakeHandoff
} from './takeHandoff';

// Loose on purpose: the specs stand in partial fakes for startViewTransition.
type Doc = { startViewTransition?: unknown };

function mountLandingCard(takeId: number): HTMLElement {
	const card = document.createElement('div');
	card.dataset.ownTake = String(takeId);
	document.body.append(card);
	return card;
}

afterEach(() => {
	delete (document as unknown as Doc).startViewTransition;
	document.body.innerHTML = '';
	document.documentElement.className = '';
});

describe('handOffTake', () => {
	it('runs the update directly when View Transitions are unsupported', async () => {
		const update = vi.fn();
		handOffTake({
			source: document.createElement('textarea'),
			takeId: 7,
			update,
			reduceMotion: false
		});
		expect(update).toHaveBeenCalledTimes(1);
		await expect(waitForTakeHandoff()).resolves.toBe(false);
	});

	it('skips the morph under reduced motion', async () => {
		const start = vi.fn();
		(document as unknown as Doc).startViewTransition = start;
		const update = vi.fn();
		handOffTake({
			source: document.createElement('textarea'),
			takeId: 7,
			update,
			reduceMotion: true
		});
		expect(start).not.toHaveBeenCalled();
		expect(update).toHaveBeenCalledTimes(1);
		await expect(waitForTakeHandoff()).resolves.toBe(false);
	});

	it('moves the transition name from the composer to the landing card, then cleans up', async () => {
		const source = document.createElement('textarea');
		document.body.append(source);
		let namesDuringUpdate: { source: string; card: string } | null = null;
		let finish!: () => void;
		const finished = new Promise<void>((resolve) => (finish = resolve));

		(document as unknown as Doc).startViewTransition = (callback: () => Promise<void>) => {
			// The browser snapshots the old state before invoking the callback.
			expect(source.style.viewTransitionName).toBe(TAKE_HANDOFF_NAME);
			expect(document.documentElement.classList.contains(TAKE_HANDOFF_ROOT_CLASS)).toBe(true);
			void callback().then(() => {
				const card = document.querySelector<HTMLElement>('[data-own-take="7"]');
				namesDuringUpdate = {
					source: source.style.viewTransitionName,
					card: card?.style.viewTransitionName ?? ''
				};
				finish();
			});
			return { finished };
		};

		const update = vi.fn(() => {
			mountLandingCard(7);
		});
		handOffTake({ source, takeId: 7, update, reduceMotion: false });

		await expect(waitForTakeHandoff()).resolves.toBe(true);
		expect(update).toHaveBeenCalledTimes(1);
		expect(namesDuringUpdate).toEqual({ source: '', card: TAKE_HANDOFF_NAME });

		await Promise.resolve();
		const card = document.querySelector<HTMLElement>('[data-own-take="7"]');
		expect(card?.style.viewTransitionName).toBe('');
		expect(document.documentElement.classList.contains(TAKE_HANDOFF_ROOT_CLASS)).toBe(false);
	});

	it('still applies the update when there is no source element', async () => {
		(document as unknown as Doc).startViewTransition = vi.fn();
		const update = vi.fn();
		handOffTake({ source: null, takeId: 7, update, reduceMotion: false });
		expect(update).toHaveBeenCalledTimes(1);
		await expect(waitForTakeHandoff()).resolves.toBe(false);
	});
});
