// src/routes/social-image.png/social-image.server.spec.ts
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { GET } from './+server';

const PNG_SIGNATURE = '89504e470d0a1a0a';
const JPEG_SIGNATURE = 'ffd8ff';

function get(query: string) {
	const href = `https://9takes.com/social-image.png?${query}`;
	return GET({ url: new URL(href), request: new Request(href) } as any);
}

async function bodyOf(response: Response) {
	return Buffer.from(await response.arrayBuffer());
}

describe('GET /social-image.png', () => {
	it('converts type portrait webp assets to png', async () => {
		const response = await get('path=%2Ftypes%2F2s%2FJoe-Biden.webp');

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('image/png');

		const buffer = await bodyOf(response);
		expect(buffer.subarray(0, 8).toString('hex')).toBe(PNG_SIGNATURE);
	});

	it('falls back to the Cold Light default card for invalid paths', async () => {
		const response = await get('path=%2F..%2Fsecret.txt');

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('image/jpeg');

		const buffer = await bodyOf(response);
		expect(buffer.subarray(0, 3).toString('hex')).toBe(JPEG_SIGNATURE);
		expect(await sharp(buffer).metadata()).toMatchObject({ width: 1200, height: 630 });
	});

	it('renders a 1200x630 person card when a name is passed with a /types/ portrait', async () => {
		const response = await get(
			new URLSearchParams({
				path: '/types/9s/Adam-Sandler.webp',
				name: 'Adam Sandler',
				type: '9'
			}).toString()
		);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('image/jpeg');
		expect(response.headers.get('cache-control')).toContain('s-maxage=604800');

		const buffer = await bodyOf(response);
		expect(buffer.subarray(0, 3).toString('hex')).toBe(JPEG_SIGNATURE);
		expect(await sharp(buffer).metadata()).toMatchObject({
			format: 'jpeg',
			width: 1200,
			height: 630
		});
	});

	it('still renders the person card when type is missing or out of range', async () => {
		const response = await get(
			new URLSearchParams({
				path: '/types/9s/Adam-Sandler.webp',
				name: 'Adam Sandler',
				type: '12'
			}).toString()
		);

		expect(response.headers.get('content-type')).toBe('image/jpeg');
		expect(await sharp(await bodyOf(response)).metadata()).toMatchObject({ width: 1200 });
	});

	it('keeps the plain portrait when the name is too long', async () => {
		const response = await get(
			new URLSearchParams({
				path: '/types/9s/Adam-Sandler.webp',
				name: 'A'.repeat(81)
			}).toString()
		);

		expect(response.headers.get('content-type')).toBe('image/png');
	});

	it('falls back to the default card when a name comes with an invalid path', async () => {
		const response = await get(
			new URLSearchParams({ path: '/brand/og/home.jpg', name: 'Adam Sandler' }).toString()
		);

		expect(response.headers.get('content-type')).toBe('image/jpeg');
		expect(await sharp(await bodyOf(response)).metadata()).toMatchObject({
			width: 1200,
			height: 630
		});
	});
});
