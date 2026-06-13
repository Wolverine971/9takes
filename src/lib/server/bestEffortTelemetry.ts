// src/lib/server/bestEffortTelemetry.ts
import { logger } from '$lib/utils/logger';

type WaitUntilPlatform = {
	context?: {
		waitUntil?: (promise: Promise<unknown>) => void;
	};
};

export type BestEffortTelemetryEvent = {
	platform?: WaitUntilPlatform;
};

export function toLoggableError(error: unknown): Record<string, unknown> {
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
			stack: error.stack ?? null
		};
	}

	if (error && typeof error === 'object') {
		const result: Record<string, unknown> = {};

		for (const key of ['name', 'message', 'details', 'hint', 'code', 'status']) {
			const value = (error as Record<string, unknown>)[key];
			if (
				typeof value === 'string' ||
				typeof value === 'number' ||
				typeof value === 'boolean' ||
				value === null
			) {
				result[key] = value;
			}
		}

		return Object.keys(result).length ? result : { message: String(error) };
	}

	return { message: String(error) };
}

export function logBestEffortTelemetryFailure(
	message: string,
	error: unknown,
	context: Record<string, unknown> = {}
) {
	logger.warn(message, {
		...context,
		error: toLoggableError(error)
	});
}

export function runBestEffortTelemetry(
	event: BestEffortTelemetryEvent,
	promise: Promise<unknown>,
	onFailure: (error: unknown) => void
) {
	const handledPromise = promise.catch(onFailure);
	const waitUntil = event.platform?.context?.waitUntil;

	if (waitUntil) {
		waitUntil(handledPromise);
		return;
	}

	void handledPromise;
}
