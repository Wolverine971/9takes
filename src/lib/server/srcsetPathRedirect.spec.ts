// src/lib/server/srcsetPathRedirect.spec.ts
import { describe, expect, it } from 'vitest';
import { getSrcsetCandidatePath } from './srcsetPathRedirect';

describe('getSrcsetCandidatePath', () => {
	it('resolves a srcset requested as one URL to its first image', () => {
		expect(
			getSrcsetCandidatePath(
				'/blogs/s-greeks-debating-human-nature.webp%20218w,%20/blogs/greeks-debating-human-nature.webp%20560w'
			)
		).toBe('/blogs/s-greeks-debating-human-nature.webp');
		expect(getSrcsetCandidatePath('/types/4s/s-Taylor-Swift.webp%201x,%20/x.webp%202x')).toBe(
			'/types/4s/s-Taylor-Swift.webp'
		);
		expect(getSrcsetCandidatePath('/blogs/a.webp%20560w')).toBe('/blogs/a.webp');
	});

	it('leaves ordinary paths alone', () => {
		expect(getSrcsetCandidatePath('/blogs/greeks-debating-human-nature.webp')).toBeNull();
		expect(getSrcsetCandidatePath('/questions/what%20is%20love')).toBeNull();
		expect(getSrcsetCandidatePath('/blogs/a%20b.webp')).toBeNull();
		expect(getSrcsetCandidatePath('/community/post%20218w,%20/x.webp%20560w')).toBeNull();
		expect(getSrcsetCandidatePath('/blogs/%E0%A4%A.webp%20218w')).toBeNull();
	});

	it('never redirects off-site', () => {
		expect(getSrcsetCandidatePath('//evil.example/a.webp%20218w')).toBeNull();
		expect(getSrcsetCandidatePath('/%5Cevil.example/a.webp%20218w')).toBeNull();
		expect(getSrcsetCandidatePath('/%2F%2Fevil.example/a.webp%20218w')).toBeNull();
		expect(getSrcsetCandidatePath('https://evil.example/a.webp%20218w')).toBeNull();
	});
});
