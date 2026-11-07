// src/lib/server/brandCards/renderBrandCard.spec.ts
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { renderBrandCard, type BrandCardInput } from './renderBrandCard';
import { BRAND_CARD_PRESETS } from '$lib/brand/brandCardPresets';
import { CARD_FORMATS, type CardFormat } from '$lib/brand/brandTokens';

describe('renderBrandCard', () => {
	it.each(BRAND_CARD_PRESETS.map((p) => [p.id, p] as const))(
		'renders preset %s at its declared size',
		async (_id, preset) => {
			const buffer = await renderBrandCard(preset.card as BrandCardInput, {
				format: preset.format
			});
			const meta = await sharp(buffer).metadata();
			expect(meta).toMatchObject({
				format: 'png',
				width: CARD_FORMATS[preset.format].width,
				height: CARD_FORMATS[preset.format].height
			});
		},
		20_000
	);

	it.each(Object.keys(CARD_FORMATS) as CardFormat[])(
		'renders a long question at %s without throwing',
		async (format) => {
			const question = 'Why does '.repeat(40) + 'this keep happening?';
			const buffer = await renderBrandCard({ template: 'question', question }, { format });
			expect((await sharp(buffer).metadata()).width).toBe(CARD_FORMATS[format].width);
		},
		20_000
	);

	it('writes JPEG when asked', async () => {
		const buffer = await renderBrandCard(
			{ template: 'statement', headline: 'Answer before the crowd', art: 'none' },
			{ output: 'jpeg' }
		);
		expect((await sharp(buffer).metadata()).format).toBe('jpeg');
	});
});
