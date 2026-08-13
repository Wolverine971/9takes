// src/routes/homepage.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getFeaturedMock, recordLegacyMock, runTelemetryMock } = vi.hoisted(() => ({
	getFeaturedMock: vi.fn(),
	recordLegacyMock: vi.fn().mockResolvedValue(undefined),
	runTelemetryMock: vi.fn()
}));

vi.mock('$lib/server/questionDistribution', () => ({
	getHomepageFeaturedQuestion: getFeaturedMock
}));
vi.mock('$lib/server/giveFirstFunnel', () => ({
	recordStrategicQuestionImpression: recordLegacyMock
}));
vi.mock('$lib/server/bestEffortTelemetry', () => ({
	runBestEffortTelemetry: runTelemetryMock,
	logBestEffortTelemetryFailure: vi.fn()
}));

import { load } from './+page.server';

describe('homepage server load', () => {
	beforeEach(() => vi.clearAllMocks());

	it('loads the featured question from distribution state and preserves legacy telemetry', async () => {
		const featuredQuestion = {
			id: 812,
			question: 'What would make today feel less automatic?',
			url: 'what-would-make-today-feel-less-automatic',
			featureRunId: 44
		};
		getFeaturedMock.mockResolvedValueOnce(featuredQuestion);

		const result = await load({
			cookies: { get: vi.fn().mockReturnValue('fingerprint-1') },
			locals: { session: null },
			url: new URL('https://9takes.com/')
		} as any);

		expect(result).toEqual({ featuredQuestion });
		expect(recordLegacyMock).toHaveBeenCalledWith({
			questionUrl: featuredQuestion.url,
			fingerprint: 'fingerprint-1',
			path: '/',
			userId: null
		});
		expect(runTelemetryMock).toHaveBeenCalledTimes(1);
	});
});
