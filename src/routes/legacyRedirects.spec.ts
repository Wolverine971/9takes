// src/routes/legacyRedirects.spec.ts
import { describe, expect, it } from 'vitest';
import { load as loadFollowMe } from './followme/+page.server';
import { load as loadSignup } from './signup/+page.server';

async function expectRedirect(load: (event: never) => unknown, location: string) {
	try {
		await load({} as never);
		throw new Error('Expected the route to redirect');
	} catch (error) {
		expect(error).toMatchObject({ status: 308, location });
	}
}

describe('legacy public routes', () => {
	it('permanently redirects the retired signup page to registration', async () => {
		await expectRedirect(loadSignup as (event: never) => unknown, '/register');
	});

	it('permanently redirects followme to the maintained about page', async () => {
		await expectRedirect(loadFollowMe as (event: never) => unknown, '/about');
	});
});
