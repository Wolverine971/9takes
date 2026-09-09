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
});
