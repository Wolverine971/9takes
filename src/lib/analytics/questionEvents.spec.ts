// src/lib/analytics/questionEvents.spec.ts
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { captureMock } = vi.hoisted(() => ({ captureMock: vi.fn() }));

vi.mock('$lib/analytics/posthog', () => ({
	capture: captureMock
}));

import {
	captureQuestionCreated,
	captureQuestionImpression,
	observeQualifiedQuestionImpression,
	resetQuestionImpressionDedupeForTests
} from './questionEvents';

type ObserverCallback = IntersectionObserverCallback;

class FakeIntersectionObserver {
	static instances: FakeIntersectionObserver[] = [];

	readonly callback: ObserverCallback;
	disconnected = false;
	element: Element | null = null;

	constructor(callback: ObserverCallback) {
		this.callback = callback;
		FakeIntersectionObserver.instances.push(this);
	}

	disconnect() {
		this.disconnected = true;
	}

	observe(element: Element) {
		this.element = element;
	}

	unobserve() {}

	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}

	trigger(intersectionRatio: number) {
		if (!this.element) throw new Error('No observed element');
		this.callback(
			[
				{
					boundingClientRect: {} as DOMRectReadOnly,
					intersectionRatio,
					intersectionRect: {} as DOMRectReadOnly,
					isIntersecting: intersectionRatio > 0,
					rootBounds: null,
					target: this.element,
					time: 0
				}
			],
			this as unknown as IntersectionObserver
		);
	}
}

function createMemoryStorage(): Pick<Storage, 'getItem' | 'setItem'> {
	const values = new Map<string, string>();
	return {
		getItem: (key) => values.get(key) ?? null,
		setItem: (key, value) => {
			values.set(key, value);
		}
	};
}

describe('question analytics', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		captureMock.mockReset();
		captureMock.mockResolvedValue(undefined);
		FakeIntersectionObserver.instances = [];
		resetQuestionImpressionDedupeForTests();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('captures a confirmed question without question text or identity data', async () => {
		await captureQuestionCreated({
			questionId: 901,
			questionUrl: 'what-changed-your-mind',
			sourcePath: '/questions/create',
			hasContext: true
		});

		expect(captureMock).toHaveBeenCalledWith('question_created', {
			question_id: 901,
			question_url: 'what-changed-your-mind',
			surface: 'question_create',
			source_path: '/questions/create',
			has_context: true,
			server_confirmed: true,
			is_demo: false
		});
		expect(captureMock.mock.calls[0]?.[1]).not.toHaveProperty('question');
		expect(captureMock.mock.calls[0]?.[1]).not.toHaveProperty('email');
		expect(captureMock.mock.calls[0]?.[1]).not.toHaveProperty('fingerprint');
	});

	it('does not capture an unconfirmed or demo question', async () => {
		await captureQuestionCreated({
			questionId: null,
			questionUrl: 'missing-id',
			hasContext: false
		});
		await captureQuestionCreated({
			questionId: 2,
			questionUrl: 'demo-question',
			hasContext: false,
			isDemo: true
		});

		expect(captureMock).not.toHaveBeenCalled();
	});

	it('forwards an available campaign without leaking the landing query', async () => {
		await captureQuestionImpression({
			questionId: 12,
			questionUrl: 'a-question',
			surface: 'question_page',
			sourcePath: '/questions/a-question',
			campaign: 'welcome-sequence'
		});

		expect(captureMock).toHaveBeenCalledWith('question_impression', {
			question_id: 12,
			question_url: 'a-question',
			surface: 'question_page',
			source_path: '/questions/a-question',
			campaign: 'welcome-sequence'
		});
	});

	it('attributes homepage impressions to a feature run when one is active', async () => {
		await captureQuestionImpression({
			questionId: 812,
			questionUrl: 'a-featured-question',
			surface: 'homepage',
			featureRunId: 44
		});

		expect(captureMock).toHaveBeenCalledWith('question_impression', {
			question_id: 812,
			question_url: 'a-featured-question',
			surface: 'homepage',
			feature_run_id: 44
		});
	});

	it('requires half visibility for the full qualification duration', async () => {
		const element = document.createElement('article');
		const cleanup = observeQualifiedQuestionImpression(
			element,
			{
				questionId: 567,
				questionUrl: 'what-costs-you-effort',
				surface: 'homepage',
				responsesVisibleBeforeImpression: 9
			},
			{
				Observer: FakeIntersectionObserver as unknown as typeof IntersectionObserver,
				storage: createMemoryStorage()
			}
		);

		const observer = FakeIntersectionObserver.instances[0];
		observer.trigger(0.49);
		await vi.advanceTimersByTimeAsync(1000);
		expect(captureMock).not.toHaveBeenCalled();

		observer.trigger(0.5);
		await vi.advanceTimersByTimeAsync(749);
		expect(captureMock).not.toHaveBeenCalled();
		await vi.advanceTimersByTimeAsync(1);

		expect(captureMock).toHaveBeenCalledWith('question_impression', {
			question_id: 567,
			question_url: 'what-costs-you-effort',
			surface: 'homepage',
			responses_visible_before_impression: 9
		});
		expect(observer.disconnected).toBe(true);
		cleanup();
	});

	it('cancels qualification when visibility drops and dedupes the session', async () => {
		const storage = createMemoryStorage();
		const input = {
			questionId: 10,
			questionUrl: 'a-question',
			surface: 'question_page' as const
		};
		const firstElement = document.createElement('div');
		observeQualifiedQuestionImpression(firstElement, input, {
			Observer: FakeIntersectionObserver as unknown as typeof IntersectionObserver,
			storage
		});

		const firstObserver = FakeIntersectionObserver.instances[0];
		firstObserver.trigger(1);
		await vi.advanceTimersByTimeAsync(500);
		firstObserver.trigger(0.2);
		await vi.advanceTimersByTimeAsync(500);
		expect(captureMock).not.toHaveBeenCalled();

		firstObserver.trigger(1);
		await vi.advanceTimersByTimeAsync(750);
		expect(captureMock).toHaveBeenCalledTimes(1);

		observeQualifiedQuestionImpression(document.createElement('div'), input, {
			Observer: FakeIntersectionObserver as unknown as typeof IntersectionObserver,
			storage
		});
		expect(FakeIntersectionObserver.instances).toHaveLength(1);
	});

	it('counts the same question separately on two surfaces', async () => {
		const storage = createMemoryStorage();
		const baseInput = {
			questionId: 10,
			questionUrl: 'a-question'
		};

		observeQualifiedQuestionImpression(
			document.createElement('div'),
			{ ...baseInput, surface: 'homepage' },
			{
				Observer: FakeIntersectionObserver as unknown as typeof IntersectionObserver,
				storage
			}
		);
		observeQualifiedQuestionImpression(
			document.createElement('div'),
			{ ...baseInput, surface: 'question_page' },
			{
				Observer: FakeIntersectionObserver as unknown as typeof IntersectionObserver,
				storage
			}
		);

		for (const observer of FakeIntersectionObserver.instances) observer.trigger(1);
		await vi.advanceTimersByTimeAsync(750);

		expect(captureMock).toHaveBeenCalledTimes(2);
		expect(captureMock).toHaveBeenNthCalledWith(
			1,
			'question_impression',
			expect.objectContaining({ surface: 'homepage' })
		);
		expect(captureMock).toHaveBeenNthCalledWith(
			2,
			'question_impression',
			expect.objectContaining({ surface: 'question_page' })
		);
	});
});
