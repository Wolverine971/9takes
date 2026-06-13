// src/lib/server/bestEffortTelemetry.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { loggerMocks } = vi.hoisted(() => ({
	loggerMocks: {
		warn: vi.fn()
	}
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry,
	toLoggableError
} from './bestEffortTelemetry';

describe('bestEffortTelemetry', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('normalizes Error instances for logging', () => {
		const error = new TypeError('fetch failed');

		expect(toLoggableError(error)).toMatchObject({
			name: 'TypeError',
			message: 'fetch failed'
		});
	});

	it('passes handled telemetry promises to waitUntil', async () => {
		const failure = new Error('network down');
		const onFailure = vi.fn();
		const waitUntil = vi.fn();

		runBestEffortTelemetry(
			{ platform: { context: { waitUntil } } },
			Promise.reject(failure),
			onFailure
		);

		expect(waitUntil).toHaveBeenCalledTimes(1);
		await waitUntil.mock.calls[0][0];
		expect(onFailure).toHaveBeenCalledWith(failure);
	});

	it('logs telemetry failures as warnings with sanitized error details', () => {
		logBestEffortTelemetryFailure(
			'Telemetry write failed',
			{ message: 'fetch failed' },
			{
				path: '/personality-analysis/example'
			}
		);

		expect(loggerMocks.warn).toHaveBeenCalledWith('Telemetry write failed', {
			path: '/personality-analysis/example',
			error: {
				message: 'fetch failed'
			}
		});
	});
});
