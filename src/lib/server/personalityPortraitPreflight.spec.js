// src/lib/server/personalityPortraitPreflight.spec.js
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
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
		expect(result.full).toMatchObject({
			format: 'webp',
			width: 1080,
			height: 1080,
			hasAlpha: true
		});
		expect(result.thumbnail).toMatchObject({
			format: 'webp',
			width: 480,
			height: 480,
			hasAlpha: true
		});
	});

	it('rejects opaque portrait pairs', async () => {
		const portraitRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'portrait-preflight-'));
		const typeDirectory = path.join(portraitRoot, '5s');
		await fs.mkdir(typeDirectory);

		try {
			await Promise.all([
				sharp({
					create: { width: 1080, height: 1080, channels: 3, background: '#000000' }
				})
					.webp()
					.toFile(path.join(typeDirectory, 'Opaque-Portrait.webp')),
				sharp({
					create: { width: 480, height: 480, channels: 3, background: '#000000' }
				})
					.webp()
					.toFile(path.join(typeDirectory, 's-Opaque-Portrait.webp'))
			]);

			const result = await inspectPortraitPair({
				type: 5,
				slug: 'Opaque-Portrait',
				portraitRoot
			});

			expect(result.ok).toBe(false);
			expect(result.errors).toEqual([
				'Full portrait must preserve alpha transparency',
				'Thumbnail must preserve alpha transparency'
			]);
		} finally {
			await fs.rm(portraitRoot, { recursive: true, force: true });
		}
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
