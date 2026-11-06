// src/lib/utils/semanticContrast.spec.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const stylesheet = readFileSync(new URL('../../scss/index.scss', import.meta.url), 'utf8');
// Cold Light is dark only (2026-11-05): one first-level :root block.
const darkTokens = stylesheet.slice(
	stylesheet.indexOf(':root {'),
	stylesheet.indexOf('/*==============================================\n  COMPONENT LIBRARY')
);

function token(block: string, name: string): string {
	const value = block.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
	if (!value) throw new Error(`Missing hexadecimal --${name} token`);
	return value;
}

function luminance(hex: string): number {
	const channels = hex
		.match(/\w\w/g)!
		.map((channel) => Number.parseInt(channel, 16) / 255)
		.map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));

	return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first: string, second: string): number {
	const firstLuminance = luminance(first);
	const secondLuminance = luminance(second);
	return (
		(Math.max(firstLuminance, secondLuminance) + 0.05) /
		(Math.min(firstLuminance, secondLuminance) + 0.05)
	);
}

describe('semantic contrast tokens', () => {
	it('keeps destructive button text AA-compliant', () => {
		expect(
			contrast(token(darkTokens, 'danger-surface'), token(darkTokens, 'text-on-danger'))
		).toBeGreaterThanOrEqual(4.5);
	});

	it('keeps status text AA-compliant on every Cold Light surface', () => {
		for (const surface of ['bg', 'surface', 'surface-raised']) {
			for (const name of ['success-text', 'warning-text', 'error-text']) {
				expect(
					contrast(token(darkTokens, name), token(darkTokens, surface))
				).toBeGreaterThanOrEqual(4.5);
			}
		}
	});

	it('keeps the Cold Light contract pairs legible', () => {
		for (const surface of ['bg', 'surface', 'surface-raised']) {
			for (const name of ['text', 'text-muted', 'text-faint', 'highlight']) {
				expect(
					contrast(token(darkTokens, name), token(darkTokens, surface))
				).toBeGreaterThanOrEqual(4.5);
			}
		}
		// Mint and lavender fills carry dark text; indigo fills carry light text.
		expect(
			contrast(token(darkTokens, 'text-on-action'), token(darkTokens, 'action'))
		).toBeGreaterThanOrEqual(4.5);
		expect(
			contrast(token(darkTokens, 'text-on-action'), token(darkTokens, 'highlight'))
		).toBeGreaterThanOrEqual(4.5);
		expect(contrast(token(darkTokens, 'text'), token(darkTokens, 'accent'))).toBeGreaterThanOrEqual(
			4.5
		);
		// Legacy aliases that components still use as text must stay readable.
		for (const name of ['lamp-deep', 'data-teal']) {
			expect(
				contrast(token(darkTokens, name), token(darkTokens, 'surface'))
			).toBeGreaterThanOrEqual(4.5);
		}
		// Indigo is never text: guard that it stays below AA so nobody "fixes" the rule away.
		expect(contrast(token(darkTokens, 'accent'), token(darkTokens, 'bg'))).toBeLessThan(4.5);
	});
});
