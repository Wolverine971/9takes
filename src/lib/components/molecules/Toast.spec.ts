// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { notifications } from './notifications';
import Toast from './Toast.svelte';

const animateDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'animate');
const getAnimationsDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'getAnimations');

function createAnimationStub(): Animation {
	let cancelled = false;
	let finishHandler: Animation['onfinish'] = null;
	let animation: Animation;

	animation = {
		cancel: vi.fn(() => {
			cancelled = true;
		}),
		currentTime: 0,
		effect: null,
		get onfinish() {
			return finishHandler;
		},
		set onfinish(handler) {
			finishHandler = handler;
			if (handler) {
				queueMicrotask(() => {
					if (!cancelled && finishHandler === handler) {
						handler.call(animation, new Event('finish') as AnimationPlaybackEvent);
					}
				});
			}
		},
		playState: 'finished'
	} as unknown as Animation;

	return animation;
}

describe('Toast', () => {
	beforeAll(() => {
		Object.defineProperty(Element.prototype, 'animate', {
			configurable: true,
			value: vi.fn(() => createAnimationStub())
		});
		Object.defineProperty(Element.prototype, 'getAnimations', {
			configurable: true,
			value: vi.fn(() => [])
		});
	});

	afterEach(() => {
		notifications.clearAll();
		cleanup();
	});

	afterAll(() => {
		if (animateDescriptor) {
			Object.defineProperty(Element.prototype, 'animate', animateDescriptor);
		} else {
			Reflect.deleteProperty(Element.prototype, 'animate');
		}
		if (getAnimationsDescriptor) {
			Object.defineProperty(Element.prototype, 'getAnimations', getAnimationsDescriptor);
		} else {
			Reflect.deleteProperty(Element.prototype, 'getAnimations');
		}
	});

	it('owns its notification variant and accessible alert semantics', async () => {
		render(Toast);
		notifications.warning('Check the date range', 60_000);
		await tick();

		const alert = screen.getByRole('alert');
		expect(alert.textContent).toContain('Check the date range');
		expect(alert.getAttribute('data-type')).toBe('warning');
		expect(alert.getAttribute('aria-atomic')).toBe('true');
	});
});
