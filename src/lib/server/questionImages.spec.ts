// src/lib/server/questionImages.spec.ts
import { describe, expect, it, vi } from 'vitest';
import sharp from 'sharp';
import {
	buildQuestionImagePath,
	parseImageDataUrl,
	uploadQuestionImageBuffer
} from './questionImages';

describe('question image validation', () => {
	it.each(['../another-question', '/absolute', 'one/two', 'one%2ftwo'])(
		'rejects storage path %s',
		(questionUrl) => {
			expect(() => buildQuestionImagePath({ questionUrl, extension: 'png' })).toThrow();
		}
	);
	it('rejects SVG and invalid base64 data', () => {
		expect(() => parseImageDataUrl('data:image/svg+xml;base64,PHN2Zz4=')).toThrow();
		expect(() => parseImageDataUrl('data:image/png;base64,%%%%')).toThrow();
	});
	it('rejects a MIME-spoofed non-image before uploading', async () => {
		const storage = { from: vi.fn() };
		await expect(
			uploadQuestionImageBuffer({
				supabase: { storage },
				buffer: Buffer.from('<script>alert(1)</script>'),
				contentType: 'image/png',
				questionUrl: 'test-question'
			})
		).rejects.toThrow();
		expect(storage.from).not.toHaveBeenCalled();
	});
	it('uploads re-encoded PNG pixels', async () => {
		const buffer = await sharp({
			create: { width: 2, height: 2, channels: 3, background: '#ffffff' }
		})
			.jpeg()
			.toBuffer();
		const upload = vi.fn().mockResolvedValue({ error: null });
		const result = await uploadQuestionImageBuffer({
			supabase: { storage: { from: () => ({ upload }) } },
			buffer,
			contentType: 'image/jpeg',
			questionUrl: 'test-question'
		});
		expect(result.contentType).toBe('image/png');
		expect(result.path).toMatch(/\.png$/);
		expect((await sharp(upload.mock.calls[0][1]).metadata()).format).toBe('png');
	});
});
