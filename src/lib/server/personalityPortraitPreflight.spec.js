// src/lib/server/personalityPortraitPreflight.spec.js
import { describe, expect, it } from 'vitest';
import {
	buildPortraitPreviewUrl,
	inspectPortraitPair,
	parsePortraitArgs
} from '../../../scripts/check-personality-portrait.mjs';

describe('personality portrait publishing preflight', () => {
	it('accepts positional and named portrait arguments', () => {
		expect(parsePortraitArgs(['2', 'Benny-Blanco'])).toMatchObject({
			type: 2,
			slug: 'Benny-Blanco'
		});
		expect(parsePortraitArgs(['--type=7', '--slug=Anna-Kendrick'])).toMatchObject({
			type: 7,
			slug: 'Anna-Kendrick'
		});
	});

	it('rejects thumbnail prefixes and path-like slugs', () => {
		expect(() => parsePortraitArgs(['2', 's-Benny-Blanco'])).toThrow(/must not begin with s-/);
		expect(() => parsePortraitArgs(['2', '../Benny-Blanco'])).toThrow(/filename-safe/);
	});

	it('validates a generated full and thumbnail pair', async () => {
		const result = await inspectPortraitPair({ type: 2, slug: 'Benny-Blanco' });

		expect(result.ok).toBe(true);
		expect(result.errors).toEqual([]);
		expect(result.full).toMatchObject({ format: 'webp', width: 1080, height: 1080 });
		expect(result.thumbnail).toMatchObject({ format: 'webp', width: 480, height: 480 });
	});

	it('builds an encoded styleguide preview URL', () => {
		expect(
			buildPortraitPreviewUrl({
				type: 2,
				slug: 'Benny-Blanco',
				origin: 'http://127.0.0.1:5173'
			})
		).toBe(
			'http://127.0.0.1:5173/styleguide?portraitType=2&portraitSlug=Benny-Blanco#portrait-preflight'
		);
	});
});
