// src/lib/utils/semanticContrast.spec.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const stylesheet = readFileSync(new URL('../../scss/index.scss', import.meta.url), 'utf8');
const darkTokens = stylesheet.slice(
	stylesheet.indexOf(':root {'),
	stylesheet.indexOf('/*==============================================\n  LIGHT MODE OVERRIDES')
);
const lightTokens = stylesheet.slice(
	stylesheet.indexOf(':root.light {'),
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
	it('keeps destructive button text AA-compliant in dark and light themes', () => {
		expect(
			contrast(token(darkTokens, 'danger-surface'), token(darkTokens, 'text-on-danger'))
		).toBeGreaterThanOrEqual(4.5);
		expect(
			contrast(token(lightTokens, 'danger-surface'), token(lightTokens, 'text-on-danger'))
		).toBeGreaterThanOrEqual(4.5);
	});

	it('keeps status text AA-compliant on the primary theme surfaces', () => {
		for (const name of ['success-text', 'warning-text', 'error-text']) {
			expect(contrast(token(darkTokens, name), '#0a0807')).toBeGreaterThanOrEqual(4.5);
			expect(contrast(token(lightTokens, name), '#ffffff')).toBeGreaterThanOrEqual(4.5);
		}
	});
});
