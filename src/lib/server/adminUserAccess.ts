// src/lib/server/adminUserAccess.ts
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../../database.types';

type AdminStatusUser = {
	id: string;
	email: string | null;
	admin: boolean;
};

type AdminStatusResult =
	| { ok: true; user: AdminStatusUser }
	| { ok: false; status: number; message: string };

const adminStatusErrors: Record<string, { status: number; message: string }> = {
	'22023': { status: 400, message: 'You cannot remove your own administrator access.' },
	'23514': { status: 409, message: 'At least one administrator account must remain.' },
	'42501': { status: 403, message: 'Administrator access is required.' },
	P0002: { status: 404, message: 'The selected user no longer exists.' }
};

export async function setAdminStatusSafely(
	supabase: SupabaseClient<Database>,
	targetUserId: string,
	isAdmin: boolean
): Promise<AdminStatusResult> {
	const { data, error } = await supabase.rpc('set_admin_status_safely', {
		p_target_user_id: targetUserId,
		p_is_admin: isAdmin
	});

	if (error) {
		const mapped = adminStatusErrors[error.code ?? ''];
		return {
			ok: false,
			status: mapped?.status ?? 500,
			message: mapped?.message ?? 'Failed to update administrator status.'
		};
	}

	const user = data?.[0];
	if (!user) {
		return { ok: false, status: 500, message: 'Administrator status update returned no user.' };
	}

	return { ok: true, user };
}
