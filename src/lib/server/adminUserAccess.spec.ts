import { describe, expect, it, vi } from 'vitest';

import { setAdminStatusSafely } from './adminUserAccess';

function createSupabaseRpcResult(result: { data: unknown; error: unknown }) {
	return {
		rpc: vi.fn().mockResolvedValue(result)
	};
}

describe('setAdminStatusSafely', () => {
	it('updates by immutable user id through the atomic RPC', async () => {
		const supabase = createSupabaseRpcResult({
			data: [{ id: 'user-1', email: 'user@example.com', admin: true }],
			error: null
		});

		await expect(setAdminStatusSafely(supabase as never, 'user-1', true)).resolves.toEqual({
			ok: true,
			user: { id: 'user-1', email: 'user@example.com', admin: true }
		});
		expect(supabase.rpc).toHaveBeenCalledWith('set_admin_status_safely', {
			p_target_user_id: 'user-1',
			p_is_admin: true
		});
	});

	it.each([
		['22023', 400, 'You cannot remove your own administrator access.'],
		['23514', 409, 'At least one administrator account must remain.'],
		['42501', 403, 'Administrator access is required.'],
		['P0002', 404, 'The selected user no longer exists.']
	])('maps database error %s to an actionable failure', async (code, status, message) => {
		const supabase = createSupabaseRpcResult({
			data: null,
			error: { code, message: 'database detail' }
		});

		await expect(setAdminStatusSafely(supabase as never, 'user-1', false)).resolves.toEqual({
			ok: false,
			status,
			message
		});
	});
});
