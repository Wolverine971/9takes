// src/routes/api/cron/host-digest/host-digest.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { runHostDigestMock } = vi.hoisted(() => ({ runHostDigestMock: vi.fn() }));

vi.mock('$env/static/private', () => ({ CRON_SECRET: 'cron-test-secret' }));
vi.mock('$lib/server/hostDigest', () => ({
	CRON_DRAFT_BUDGET_MS: 200_000,
	runHostDigest: runHostDigestMock
}));

import { config, GET } from './+server';

function cronRequest(secret = 'cron-test-secret') {
	return {
		request: new Request('https://9takes.com/api/cron/host-digest', {
			headers: { authorization: `Bearer ${secret}` }
		})
	} as never;
}

describe('/api/cron/host-digest', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		runHostDigestMock.mockResolvedValue({ status: 'sent', sent: true, alarm: false });
	});

	it('gets its own 300 s limit instead of the 15 s project default', () => {
		expect(config).toEqual({ maxDuration: 300 });
	});

	it('rejects requests without the cron secret', async () => {
		await expect(GET(cronRequest('wrong'))).rejects.toMatchObject({ status: 401 });
		expect(runHostDigestMock).not.toHaveBeenCalled();
	});

	it('runs the digest as the cron with the long drafting budget', async () => {
		const response = await GET(cronRequest());
		expect(response.status).toBe(200);
		expect(runHostDigestMock).toHaveBeenCalledWith({
			trigger: 'cron',
			draftBudgetMs: 200_000
		});
	});

	it('stays 200 when the email went out even if drafts failed (the email says so)', async () => {
		runHostDigestMock.mockResolvedValue({ status: 'sent', sent: true, alarm: true });
		const response = await GET(cronRequest());
		expect(response.status).toBe(200);
	});

	it('fails the invocation when takes existed but no email went out', async () => {
		runHostDigestMock.mockResolvedValue({ status: 'send_failed', sent: false, alarm: true });
		expect((await GET(cronRequest())).status).toBe(500);

		runHostDigestMock.mockResolvedValue({ status: 'no_recipient', sent: false, alarm: true });
		expect((await GET(cronRequest())).status).toBe(500);
	});

	it('returns 500 when the run crashes', async () => {
		runHostDigestMock.mockRejectedValue(new Error('db down'));
		await expect(GET(cronRequest())).rejects.toMatchObject({ status: 500 });
	});
});
