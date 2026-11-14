// scripts/lib/imageVariants.spec.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	BLOG_HERO_PHONE,
	PORTRAIT_PHONE,
	blogHeroPhoneSrc,
	portraitPhoneSrc
} from '../../src/lib/imageVariants.js';
import {
	MANIFEST_PATH,
	diffVariants,
	generateVariants,
	planVariants,
	readPic
} from './imageVariants.mjs';

describe('readPic', () => {
	it('reads quoted, double-quoted and bare values from frontmatter only', () => {
		expect(readPic("---\ntitle: 'A'\npic: 'greek-statue'\n---\nbody")).toBe('greek-statue');
		expect(readPic('---\npic: "two words"\n---\n')).toBe('two words');
		expect(readPic('---\npic: bare_name # note\n---\n')).toBe('bare_name');
		expect(readPic("---\ntitle: 'A'\n---\npic: 'in-body'\n")).toBe('');
		expect(readPic("---\npic: ''\n---\n")).toBe('');
		expect(readPic('no frontmatter')).toBe('');
	});
});

describe('variant URLs', () => {
	it('mirrors the hero and portrait paths under /variants', () => {
		expect(blogHeroPhoneSrc('greek-statue')).toBe('/variants/blogs/800/greek-statue.avif');
		expect(blogHeroPhoneSrc(' ')).toBe('');
		expect(blogHeroPhoneSrc(undefined)).toBe('');
		expect(portraitPhoneSrc('/types/6s/Zendaya.webp')).toBe('/variants/types/640/6s/Zendaya.avif');
		expect(portraitPhoneSrc('/types/9s/Marcus-Aurelius.webp?v=20260830')).toBe(
			'/variants/types/640/9s/Marcus-Aurelius.avif?v=20260830'
		);
	});

	it('gives thumbnails and non-portrait paths no variant', () => {
		expect(portraitPhoneSrc('/types/6s/s-Zendaya.webp')).toBe('');
		expect(portraitPhoneSrc('/blogs/greek-statue.webp')).toBe('');
		expect(portraitPhoneSrc('')).toBe('');
	});

	it('writes each variant where its URL points', () => {
		expect(`/${BLOG_HERO_PHONE.outputDir}/x.avif`).toBe(`/static${blogHeroPhoneSrc('x')}`);
		expect(`/${PORTRAIT_PHONE.outputDir}/6s/X.avif`).toBe(
			`/static${portraitPhoneSrc('/types/6s/X.webp')}`
		);
	});
});

describe('plan, generate and check', () => {
	let root;
	const write = (file, data) => {
		fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
		fs.writeFileSync(path.join(root, file), data);
	};
	const image = (width, color) =>
		sharp({ create: { width, height: width, channels: 3, background: color } })
			.webp()
			.toBuffer();

	beforeEach(async () => {
		root = fs.mkdtempSync(path.join(os.tmpdir(), 'image-variants-'));
		fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
		write('src/blog/enneagram/post.md', "---\npic: 'hero'\n---\n");
		write('src/blog/enneagram/drafts/draft.md', "---\npic: 'no-file-yet'\n---\n");
		write('static/blogs/hero.webp', await image(1600, '#445566'));
		write('static/blogs/s-hero.webp', await image(480, '#445566'));
		write('static/blogs/unreferenced.webp', await image(1600, '#000000'));
		write('static/types/6s/Zendaya.webp', await image(1080, '#888888'));
		write('static/types/6s/s-Zendaya.webp', await image(480, '#888888'));
		write('static/types/dave-approval.webp', await image(300, '#ffffff'));
	});

	afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

	it('plans one variant per referenced hero and per full portrait', () => {
		expect(planVariants(root).map((item) => [item.source, item.output])).toEqual([
			['static/blogs/hero.webp', 'static/variants/blogs/800/hero.avif'],
			['static/types/6s/Zendaya.webp', 'static/variants/types/640/6s/Zendaya.avif']
		]);
	});

	it('writes resized AVIFs once, then has nothing to do', async () => {
		const first = await generateVariants(root);
		expect(first.written.map((item) => item.reason)).toEqual(['missing', 'missing']);

		const hero = await sharp(path.join(root, 'static/variants/blogs/800/hero.avif')).metadata();
		expect([hero.format, hero.width]).toEqual(['heif', 800]);
		const portrait = await sharp(
			path.join(root, 'static/variants/types/640/6s/Zendaya.avif')
		).metadata();
		expect(portrait.width).toBe(640);

		expect(Object.keys(JSON.parse(fs.readFileSync(path.join(root, MANIFEST_PATH), 'utf8')))).toEqual(
			['static/variants/blogs/800/hero.avif', 'static/variants/types/640/6s/Zendaya.avif']
		);
		expect((await generateVariants(root)).written).toEqual([]);
		expect(diffVariants(root)).toEqual({ todo: [], orphans: [], heavy: [] });
	});

	it('rebuilds a variant when its source image changes', async () => {
		await generateVariants(root);
		write('static/blogs/hero.webp', await image(1600, '#aa0000'));

		expect(diffVariants(root).todo.map((item) => [item.output, item.reason])).toEqual([
			['static/variants/blogs/800/hero.avif', 'stale']
		]);
		expect((await generateVariants(root)).written).toHaveLength(1);
		expect(diffVariants(root).todo).toEqual([]);
	});

	it('flags and removes a variant whose source is gone', async () => {
		await generateVariants(root);
		fs.rmSync(path.join(root, 'static/types/6s/Zendaya.webp'));

		expect(diffVariants(root).orphans).toEqual(['static/variants/types/640/6s/Zendaya.avif']);
		expect((await generateVariants(root)).removed).toEqual([
			'static/variants/types/640/6s/Zendaya.avif'
		]);
		expect(fs.existsSync(path.join(root, 'static/variants/types/640/6s/Zendaya.avif'))).toBe(false);
		expect(Object.keys(JSON.parse(fs.readFileSync(path.join(root, MANIFEST_PATH), 'utf8')))).toEqual(
			['static/variants/blogs/800/hero.avif']
		);
	});
});
