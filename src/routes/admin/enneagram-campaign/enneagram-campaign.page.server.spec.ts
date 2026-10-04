// src/routes/admin/enneagram-campaign/enneagram-campaign.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireAdminMock, loadAudienceMock, loadDeliveryMock } = vi.hoisted(() => ({
	requireAdminMock: vi.fn(),
	loadAudienceMock: vi.fn(),
	loadDeliveryMock: vi.fn()
}));

vi.mock('$lib/server/adminAuth', () => ({ requireAdmin: requireAdminMock }));
vi.mock('$lib/server/enneagramCampaignAudience', () => ({
	loadEnneagramCampaignAudience: loadAudienceMock
}));
vi.mock('$lib/server/emailDeliveryHealth', () => ({ loadEmailDeliveryHealth: loadDeliveryMock }));
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => {
		const query: any = {
			select: () => query,
			eq: () => query,
			maybeSingle: async () => ({ data: { id: 'seq-1', status: 'draft' }, error: null })
		};
		return { from: () => query };
	}
}));

import { load } from './+page.server';

const AUDIENCE = { rows: [], counts: { ready: 0 } };

function buildEvent(isDataRequest: boolean) {
	return {
		locals: {},
		isDataRequest,
		depends: vi.fn()
	} as any;
}

describe('/admin/enneagram-campaign load', () => {
	beforeEach(() => {
		requireAdminMock.mockReset().mockResolvedValue({});
		loadAudienceMock.mockReset().mockResolvedValue(AUDIENCE);
		loadDeliveryMock.mockReset().mockResolvedValue({ configured: true, blockers: [] });
	});

	it('sends the shell without the audience on a full page load', async () => {
		const event = buildEvent(false);
		const result: any = await load(event);

		expect(event.depends).toHaveBeenCalledWith('admin:enneagram-campaign-audience');
		expect(result.audience).toBeNull();
		expect(result.sequence).toEqual({ id: 'seq-1', status: 'draft' });
		expect(loadAudienceMock).not.toHaveBeenCalled();
	});

	it('streams the audience on a data request', async () => {
		const result: any = await load(buildEvent(true));

		expect(result.audience).toBeInstanceOf(Promise);
		await expect(result.audience).resolves.toBe(AUDIENCE);
	});

	it('never starts the audience lookup for a non-admin', async () => {
		requireAdminMock.mockRejectedValue(new Error('Forbidden - Admin access required'));

		await expect(load(buildEvent(true))).rejects.toThrow('Forbidden');
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(loadAudienceMock).not.toHaveBeenCalled();
	});
});
