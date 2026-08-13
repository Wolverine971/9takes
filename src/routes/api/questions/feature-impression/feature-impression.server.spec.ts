// src/routes/api/questions/feature-impression/feature-impression.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { recordMock } = vi.hoisted(() => ({ recordMock: vi.fn() }));

vi.mock('$lib/server/questionDistribution', () => ({
	recordHomepageFeatureImpression: recordMock
}));

import { POST } from './+server';

describe('/api/questions/feature-impression', () => {
	beforeEach(() => vi.clearAllMocks());

	it('records a qualified run impression with the server cookie', async () => {
		recordMock.mockResolvedValueOnce(true);
		const response = await POST({
			request: new Request('https://9takes.com/api/questions/feature-impression', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ featureRunId: 44, questionId: 812 })
			}),
			cookies: { get: vi.fn().mockReturnValue('browser-fingerprint') }
		} as any);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ recorded: true });
		expect(recordMock).toHaveBeenCalledWith({
			featureRunId: 44,
			questionId: 812,
			fingerprint: 'browser-fingerprint'
		});
	});

	it('rejects malformed input and missing fingerprints', async () => {
		const response = await POST({
			request: new Request('https://9takes.com/api/questions/feature-impression', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ featureRunId: -1, questionId: 812 })
			}),
			cookies: { get: vi.fn() }
		} as any);

		expect(response.status).toBe(400);
		expect(recordMock).not.toHaveBeenCalled();
	});
});
