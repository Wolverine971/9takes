// src/routes/social-image.png/social-image.server.spec.ts
import { describe, expect, it } from 'vitest';
import { GET } from './+server';

const PNG_SIGNATURE = '89504e470d0a1a0a';

describe('GET /social-image.png', () => {
	it('converts type portrait webp assets to png', async () => {
		const response = await GET({
			url: new URL('https://9takes.com/social-image.png?path=%2Ftypes%2F2s%2FJoe-Biden.webp'),
			request: new Request(
				'https://9takes.com/social-image.png?path=%2Ftypes%2F2s%2FJoe-Biden.webp'
			)
		} as any);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('image/png');

		const buffer = Buffer.from(await response.arrayBuffer());
		expect(buffer.subarray(0, 8).toString('hex')).toBe(PNG_SIGNATURE);
	});

	it('falls back to the site mark for invalid paths', async () => {
		const response = await GET({
			url: new URL('https://9takes.com/social-image.png?path=%2F..%2Fsecret.txt'),
			request: new Request('https://9takes.com/social-image.png?path=%2F..%2Fsecret.txt')
		} as any);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('image/png');

		const buffer = Buffer.from(await response.arrayBuffer());
		expect(buffer.subarray(0, 8).toString('hex')).toBe(PNG_SIGNATURE);
	});
});
