import { describe, expect, it } from 'vitest';
import { GET } from './+server';

function buildEvent(code: string) {
	return {
		params: { code },
		url: new URL(`https://9takes.com/link/${code}`)
	};
}

describe('GET /link/[code]', () => {
	it('redirects the Reddit short link to question 567 with attribution', async () => {
		const response = await GET(buildEvent('567') as never);

		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe(
			'https://9takes.com/questions/whats-something-every-day-seem-fine-nobody-knows-costing-effort?utm_source=reddit&utm_medium=organic&utm_campaign=alpha_beta_answer_first_20260831'
		);
		expect(response.headers.get('cache-control')).toBe('no-store');
		expect(response.headers.get('x-robots-tag')).toBe('noindex, noarchive');
	});

	it('returns 404 for an unknown short-link code', () => {
		expect(() => GET(buildEvent('missing') as never)).toThrowError(
			expect.objectContaining({
				status: 404,
				body: { message: 'Short link not found' }
			})
		);
	});
});
