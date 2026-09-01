// src/routes/api/email/re-permission/yes/[tracking_id]/repermission-yes.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { lookupMock, confirmMock } = vi.hoisted(() => ({
	lookupMock: vi.fn(),
	confirmMock: vi.fn()
}));

vi.mock('$lib/server/reactivationRepermission', () => ({
	getReactivationRepermissionRecipient: lookupMock,
	confirmReactivationRepermission: confirmMock
}));

import { GET, POST } from './+server';

const TRACKING_ID = '550e8400-e29b-41d4-a716-446655440000';
const RECIPIENT = {
	recipient_email: 'person@example.com',
	recipient_source: 'profiles',
	recipient_source_id: TRACKING_ID
};

describe('reactivation yes confirmation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		lookupMock.mockResolvedValue(RECIPIENT);
		confirmMock.mockResolvedValue(RECIPIENT);
	});

	it('renders a POST confirmation without changing subscription state on GET', async () => {
		const response = await GET({ params: { tracking_id: TRACKING_ID } } as never);
		const html = await response.text();

		expect(response.status).toBe(200);
		expect(html).toContain('method="POST"');
		expect(html).toContain(`/api/email/re-permission/yes/${TRACKING_ID}`);
		expect(confirmMock).not.toHaveBeenCalled();
	});

	it('changes state only after the confirmation POST', async () => {
		await expect(POST({ params: { tracking_id: TRACKING_ID } } as never)).rejects.toMatchObject({
			status: 302,
			location: '/thanks-for-staying'
		});
		expect(confirmMock).toHaveBeenCalledWith(TRACKING_ID);
	});
});
