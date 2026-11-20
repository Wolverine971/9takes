// src/routes/users/[externalId]/updateAccount.page.server.spec.ts
import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: vi.fn() }));
vi.mock('$lib/server/profileAnswers', () => ({
	canSeeProfileTakeText: vi.fn(),
	loadProfileAnswers: vi.fn()
}));
vi.mock('../../../utils/api', () => ({ checkDemoTime: vi.fn().mockResolvedValue(false) }));
vi.mock('$lib/utils/logger', () => ({
	logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}));

import { actions } from './+page.server';

function buildEvent(
	fields: Record<string, string>,
	options: { signedIn?: boolean; updateError?: unknown } = {}
) {
	const eq = vi.fn().mockResolvedValue({ error: options.updateError ?? null });
	const update = vi.fn().mockReturnValue({ eq });
	const from = vi.fn().mockReturnValue({ update });
	const body = new FormData();
	for (const [key, value] of Object.entries(fields)) body.set(key, value);

	return {
		from,
		update,
		eq,
		event: {
			request: new Request('http://localhost/users/someone-else?/updateAccount', {
				method: 'POST',
				body
			}),
			params: { externalId: 'someone-else' },
			locals: {
				session: options.signedIn === false ? null : { user: { id: 'user-1' } },
				supabase: { from }
			}
		}
	};
}

describe('/users/[externalId] updateAccount', () => {
	it('edits only the signed-in profile, whichever profile page it is posted from', async () => {
		const { event, from, update, eq } = buildEvent({
			firstName: ' Alex ',
			lastName: 'Rivera',
			enneagram: '5',
			email: 'someone-else@example.com',
			admin: 'true'
		});

		await expect(actions.updateAccount(event as any)).resolves.toEqual({ success: true });
		expect(from).toHaveBeenCalledWith('profiles');
		expect(update).toHaveBeenCalledWith({
			first_name: 'Alex',
			last_name: 'Rivera',
			enneagram: '5'
		});
		expect(eq).toHaveBeenCalledTimes(1);
		expect(eq).toHaveBeenCalledWith('id', 'user-1');
	});

	it.each<Record<string, string>>([
		{ enneagram: '12' },
		{ firstName: 'a'.repeat(81) },
		{ lastName: 'b'.repeat(81) }
	])('rejects invalid input: %o', async (fields) => {
		const { event, update } = buildEvent(fields);

		await expect(actions.updateAccount(event as any)).rejects.toMatchObject({ status: 400 });
		expect(update).not.toHaveBeenCalled();
	});

	it('rejects a signed-out request', async () => {
		const { event, update } = buildEvent({ firstName: 'Alex' }, { signedIn: false });

		await expect(actions.updateAccount(event as any)).rejects.toMatchObject({ status: 401 });
		expect(update).not.toHaveBeenCalled();
	});

	it('keeps database error details out of the response', async () => {
		const { event } = buildEvent(
			{ firstName: 'Alex' },
			{ updateError: { message: 'permission denied for table profiles' } }
		);

		const failure = await Promise.resolve(actions.updateAccount(event as any)).catch(
			(e: unknown) => e
		);

		expect(failure).toMatchObject({ status: 500, body: { message: 'Failed to update account' } });
		expect(JSON.stringify(failure)).not.toContain('permission denied');
	});
});
