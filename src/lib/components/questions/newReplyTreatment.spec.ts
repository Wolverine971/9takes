// src/lib/components/questions/newReplyTreatment.spec.ts
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
	NEW_REPLY_SOFTEN_DELAY_MS,
	scrollToNewReply,
	softenNewReply,
	whenNewReplyVisible
} from './newReplyTreatment';

describe('newReplyTreatment', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('softens immediately under reduced motion and after the delay otherwise', () => {
		vi.useFakeTimers();

		const reduced = vi.fn();
		softenNewReply(true, reduced);
		expect(reduced).toHaveBeenCalledTimes(1);

		const animated = vi.fn();
		const cancel = softenNewReply(false, animated);
		expect(animated).not.toHaveBeenCalled();
		vi.advanceTimersByTime(NEW_REPLY_SOFTEN_DELAY_MS - 1);
		expect(animated).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(animated).toHaveBeenCalledTimes(1);
		cancel();
	});

	it('cancels a pending soften on cleanup', () => {
		vi.useFakeTimers();
		const onSoften = vi.fn();
		const cancel = softenNewReply(false, onSoften);
		cancel();
		vi.advanceTimersByTime(NEW_REPLY_SOFTEN_DELAY_MS * 2);
		expect(onSoften).not.toHaveBeenCalled();
	});

	it('scrolls without animation under reduced motion', () => {
		const scrollIntoView = vi.fn();
		const target = { scrollIntoView } as unknown as HTMLElement;
		scrollToNewReply(target, true);
		expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'center' });
		scrollToNewReply(target, false);
		expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
		expect(() => scrollToNewReply(null, false)).not.toThrow();
	});

	it('marks visible right away when IntersectionObserver is unavailable', () => {
		const onVisible = vi.fn();
		const cleanup = whenNewReplyVisible({} as HTMLElement, onVisible);
		expect(onVisible).toHaveBeenCalledTimes(1);
		expect(() => cleanup()).not.toThrow();
	});
});
