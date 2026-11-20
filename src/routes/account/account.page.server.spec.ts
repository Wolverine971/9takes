// src/routes/account/account.page.server.spec.ts
import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/accountDashboard', () => ({}));
vi.mock('../../utils/api', () => ({ checkDemoTime: vi.fn().mockResolvedValue(false) }));

import { actions, load } from './+page.server';

describe('account email destination', () => {
	it('preserves attribution while sending a logged-out recipient to login', async () => {
		await expect(
			load({
				locals: { session: null },
				url: new URL(
					'https://9takes.com/account?utm_source=email&utm_campaign=enneagram-type-prompt'
				)
			} as any)
		).rejects.toMatchObject({
			status: 303,
			location:
				'/login?returnTo=%2Faccount%3Futm_source%3Demail%26utm_campaign%3Denneagram-type-prompt'
		});
	});

	it.each(['5', 'not-a-type'])(
		'only persists a valid self-reported type: %s',
		async (enneagram) => {
			const eq = vi.fn().mockResolvedValue({ error: null });
			const update = vi.fn().mockReturnValue({ eq });
			const body = new FormData();
			for (const [key, value] of Object.entries({
				firstName: 'Alex',
				lastName: '',
				email: 'alex@example.com',
				enneagram
			}))
				body.set(key, value);
			const event = {
				request: new Request('https://9takes.com/account?/updateAccount', { method: 'POST', body }),
				locals: {
					session: { user: { id: 'user-1', email: 'alex@example.com' } },
					supabase: { from: vi.fn().mockReturnValue({ update }) }
				}
			};
			if (enneagram === '5') {
				await expect(actions.updateAccount(event as any)).resolves.toEqual({ success: true });
				expect(update).toHaveBeenCalledWith({ first_name: 'Alex', last_name: '', enneagram: '5' });
				expect(eq).toHaveBeenCalledWith('id', 'user-1');
			} else {
				await expect(actions.updateAccount(event as any)).rejects.toMatchObject({ status: 400 });
				expect(update).not.toHaveBeenCalled();
			}
		}
	);

	function buildUpdateEvent(
		fields: Record<string, string>,
		updateResult: { error: unknown } = { error: null }
	) {
		const eq = vi.fn().mockResolvedValue(updateResult);
		const update = vi.fn().mockReturnValue({ eq });
		const body = new FormData();
		for (const [key, value] of Object.entries(fields)) body.set(key, value);
		return {
			eq,
			update,
			event: {
				request: new Request('https://9takes.com/account?/updateAccount', { method: 'POST', body }),
				locals: {
					session: { user: { id: 'user-1', email: 'alex@example.com' } },
					supabase: { from: vi.fn().mockReturnValue({ update }) }
				}
			}
		};
	}

	it('updates the signed-in profile whatever email the form carries', async () => {
		const { event, update, eq } = buildUpdateEvent({
			firstName: '  Alex ',
			lastName: 'Rivera',
			enneagram: '',
			email: 'someone-else@example.com'
		});

		await expect(actions.updateAccount(event as any)).resolves.toEqual({ success: true });
		expect(update).toHaveBeenCalledWith({ first_name: 'Alex', last_name: 'Rivera', enneagram: '' });
		expect(eq).toHaveBeenCalledTimes(1);
		expect(eq).toHaveBeenCalledWith('id', 'user-1');
	});

	it('rejects a name longer than 80 characters', async () => {
		const { event, update } = buildUpdateEvent({ firstName: 'a'.repeat(81), enneagram: '5' });

		await expect(actions.updateAccount(event as any)).rejects.toMatchObject({ status: 400 });
		expect(update).not.toHaveBeenCalled();
	});

	it('rejects a signed-out request', async () => {
		const { event, update } = buildUpdateEvent({ firstName: 'Alex' });
		(event.locals as { session: unknown }).session = null;

		await expect(actions.updateAccount(event as any)).rejects.toMatchObject({ status: 401 });
		expect(update).not.toHaveBeenCalled();
	});

	it('keeps database error details out of the response', async () => {
		const { event } = buildUpdateEvent(
			{ firstName: 'Alex' },
			{ error: { message: 'permission denied for table profiles', code: '42501' } }
		);

		const failure = await Promise.resolve(actions.updateAccount(event as any)).catch(
			(e: unknown) => e
		);

		expect(failure).toMatchObject({ status: 500, body: { message: 'Failed to update account' } });
		expect(JSON.stringify(failure)).not.toContain('permission denied');
	});
});
