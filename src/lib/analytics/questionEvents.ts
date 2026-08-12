// src/lib/analytics/questionEvents.ts
import { capture } from '$lib/analytics/posthog';

export type QuestionImpressionSurface =
	'homepage' | 'question_page' | 'questions_index' | 'strategic_blog';

export type CaptureQuestionCreatedInput = {
	questionId: unknown;
	questionUrl: string;
	sourcePath?: string;
	hasContext: boolean;
	isDemo?: boolean;
};

export type CaptureQuestionImpressionInput = {
	questionId: unknown;
	questionUrl: string;
	surface: QuestionImpressionSurface;
	sourcePath?: string;
	position?: number;
	campaign?: string;
	questionCreatedAt?: string;
	responsesVisibleBeforeImpression?: number;
	isAnsweredByViewer?: boolean;
};

type QuestionImpressionObserverOptions = {
	threshold?: number;
	durationMs?: number;
	storage?: Pick<Storage, 'getItem' | 'setItem'> | null;
	Observer?: typeof IntersectionObserver;
	onCaptured?: () => void;
};

const DEFAULT_IMPRESSION_THRESHOLD = 0.5;
const DEFAULT_IMPRESSION_DURATION_MS = 750;
const SESSION_STORAGE_PREFIX = '9t-question-impression:';

const capturedImpressions = new Set<string>();
const pendingImpressions = new Set<string>();

function normalizeQuestionId(value: unknown): number | string | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim()) return value.trim();
	return null;
}

function normalizeQuestionUrl(value: string): string | null {
	const normalized = value.trim();
	return normalized || null;
}

function normalizeCount(value: number | undefined): number | undefined {
	if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
	return Math.max(0, Math.trunc(value));
}

function getSessionStorage(): Pick<Storage, 'getItem' | 'setItem'> | null {
	if (typeof sessionStorage === 'undefined') return null;
	return sessionStorage;
}

function getImpressionKey(input: CaptureQuestionImpressionInput): string | null {
	const questionId = normalizeQuestionId(input.questionId);
	if (questionId === null) return null;
	return `${String(questionId)}:${input.surface}`;
}

function wasCaptured(key: string, storage: Pick<Storage, 'getItem' | 'setItem'> | null): boolean {
	if (capturedImpressions.has(key)) return true;

	try {
		if (storage?.getItem(`${SESSION_STORAGE_PREFIX}${key}`) === '1') {
			capturedImpressions.add(key);
			return true;
		}
	} catch {
		// In-memory dedupe still works when storage is unavailable.
	}

	return false;
}

function markCaptured(key: string, storage: Pick<Storage, 'getItem' | 'setItem'> | null): void {
	capturedImpressions.add(key);
	try {
		storage?.setItem(`${SESSION_STORAGE_PREFIX}${key}`, '1');
	} catch {
		// Capture should not fail because a browser blocks session storage.
	}
}

export function captureQuestionCreated(input: CaptureQuestionCreatedInput): Promise<void> {
	const questionId = normalizeQuestionId(input.questionId);
	const questionUrl = normalizeQuestionUrl(input.questionUrl);
	if (questionId === null || !questionUrl || input.isDemo) return Promise.resolve();

	return capture('question_created', {
		question_id: questionId,
		question_url: questionUrl,
		surface: 'question_create',
		source_path: input.sourcePath,
		has_context: input.hasContext,
		server_confirmed: true,
		is_demo: false
	});
}

export function captureQuestionImpression(input: CaptureQuestionImpressionInput): Promise<void> {
	const questionId = normalizeQuestionId(input.questionId);
	const questionUrl = normalizeQuestionUrl(input.questionUrl);
	if (questionId === null || !questionUrl) return Promise.resolve();

	const properties: Record<string, unknown> = {
		question_id: questionId,
		question_url: questionUrl,
		surface: input.surface
	};

	if (input.sourcePath) properties.source_path = input.sourcePath;
	if (input.position !== undefined && Number.isFinite(input.position)) {
		properties.position = Math.max(0, Math.trunc(input.position));
	}
	if (input.campaign) properties.campaign = input.campaign;
	if (input.questionCreatedAt) properties.question_created_at = input.questionCreatedAt;

	const responseCount = normalizeCount(input.responsesVisibleBeforeImpression);
	if (responseCount !== undefined) {
		properties.responses_visible_before_impression = responseCount;
	}
	if (input.isAnsweredByViewer !== undefined) {
		properties.is_answered_by_viewer = input.isAnsweredByViewer;
	}

	return capture('question_impression', properties);
}

/**
 * Records a qualified impression after the target remains at least half visible
 * for 750ms. The event is deduped per question and surface for the browser tab.
 */
export function observeQualifiedQuestionImpression(
	element: Element,
	input: CaptureQuestionImpressionInput,
	options: QuestionImpressionObserverOptions = {}
): () => void {
	const key = getImpressionKey(input);
	const storage = options.storage === undefined ? getSessionStorage() : options.storage;
	const Observer = options.Observer ?? globalThis.IntersectionObserver;
	const threshold = options.threshold ?? DEFAULT_IMPRESSION_THRESHOLD;
	const durationMs = options.durationMs ?? DEFAULT_IMPRESSION_DURATION_MS;

	if (!key || !Observer || wasCaptured(key, storage)) return () => undefined;

	let timer: ReturnType<typeof setTimeout> | null = null;
	let disconnected = false;

	const clearPendingTimer = () => {
		if (timer) clearTimeout(timer);
		timer = null;
		pendingImpressions.delete(key);
	};

	const observer = new Observer(
		(entries) => {
			const entry = entries.find((candidate) => candidate.target === element);
			const qualifies = Boolean(
				entry && entry.isIntersecting && entry.intersectionRatio >= threshold
			);

			if (!qualifies) {
				clearPendingTimer();
				return;
			}

			if (timer || pendingImpressions.has(key) || wasCaptured(key, storage)) return;

			pendingImpressions.add(key);
			timer = setTimeout(() => {
				timer = null;
				pendingImpressions.delete(key);
				if (disconnected || wasCaptured(key, storage)) return;

				markCaptured(key, storage);
				observer.disconnect();
				void captureQuestionImpression(input);
				options.onCaptured?.();
			}, durationMs);
		},
		{ threshold: [threshold] }
	);

	observer.observe(element);

	return () => {
		disconnected = true;
		clearPendingTimer();
		observer.disconnect();
	};
}

export function resetQuestionImpressionDedupeForTests(): void {
	capturedImpressions.clear();
	pendingImpressions.clear();
}
