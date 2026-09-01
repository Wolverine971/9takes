// src/routes/api/email/re-permission/no/[tracking_id]/repermission-no.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { lookupMock, declineMock } = vi.hoisted(() => ({
	lookupMock: vi.fn(),
	declineMock: vi.fn()
}));

vi.mock('$lib/server/reactivationRepermission', () => ({
	getReactivationRepermissionRecipient: lookupMock,
	declineReactivationRepermission: declineMock
}));

import { GET, POST } from './+server';

const TRACKING_ID = '550e8400-e29b-41d4-a716-446655440000';
const RECIPIENT = {
	recipient_email: 'person@example.com',
	recipient_source: 'profiles',
	recipient_source_id: TRACKING_ID
};

describe('reactivation no confirmation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		lookupMock.mockResolvedValue(RECIPIENT);
		declineMock.mockResolvedValue(RECIPIENT);
	});

	it('renders a POST confirmation without unsubscribing on GET', async () => {
		const response = await GET({ params: { tracking_id: TRACKING_ID } } as never);
		const html = await response.text();

		expect(response.status).toBe(200);
		expect(html).toContain('method="POST"');
		expect(html).toContain(`/api/email/re-permission/no/${TRACKING_ID}`);
		expect(declineMock).not.toHaveBeenCalled();
	});

	it('unsubscribes only after the confirmation POST', async () => {
		await expect(POST({ params: { tracking_id: TRACKING_ID } } as never)).rejects.toMatchObject({
			status: 302,
			location: '/goodbye'
		});
		expect(declineMock).toHaveBeenCalledWith(TRACKING_ID);
	});
});
