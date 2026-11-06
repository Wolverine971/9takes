// scripts/lib/coldLightRamp.spec.mjs
import { describe, expect, it } from 'vitest';
import {
	COLD_LIGHT_STOPS,
	autoLevels,
	buildLevelsLut,
	buildRampLut,
	hexToRgb,
	rampAt
} from './coldLightRamp.mjs';

describe('Cold Light ramp', () => {
	it('hits every stop exactly', () => {
		for (const s of COLD_LIGHT_STOPS) expect(rampAt(s.at)).toEqual(hexToRgb(s.hex));
	});

	it('interpolates linearly between stops', () => {
		// halfway between 0.62 #6331FB and 0.88 #BEAAFF
		expect(rampAt(0.75)).toEqual([
			Math.round((0x63 + 0xbe) / 2),
			Math.round((0x31 + 0xaa) / 2),
			Math.round((0xfb + 0xff) / 2)
		]);
	});

	it('builds a 256-entry LUT whose ends are Night and the brightest highlight', () => {
		const lut = buildRampLut();
		expect(lut.length).toBe(768);
		expect([...lut.slice(0, 3)]).toEqual(hexToRgb('#01010D'));
		expect([...lut.slice(765, 768)]).toEqual(hexToRgb('#ECE6FF'));
	});

	it('is monotonic in green (the luminance-dominant channel)', () => {
		const lut = buildRampLut();
		for (let v = 1; v < 256; v++)
			expect(lut[v * 3 + 1]).toBeGreaterThanOrEqual(lut[(v - 1) * 3 + 1]);
	});
});

describe('levels', () => {
	it('is identity at defaults', () => {
		const lut = buildLevelsLut();
		for (let v = 0; v < 256; v++) expect(lut[v]).toBe(v);
	});

	it('stretches lo..hi to 0..255', () => {
		const lut = buildLevelsLut({ lo: 20, hi: 220 });
		expect(lut[20]).toBe(0);
		expect(lut[220]).toBe(255);
		expect(lut[10]).toBe(0);
	});

	it('caps the stretch for flat, dark images', () => {
		const hist = new Array(256).fill(0);
		for (let v = 60; v <= 120; v++) hist[v] = 100;
		const { lo, hi } = autoLevels(hist);
		expect(lo).toBe(40);
		expect(hi).toBe(200);
	});
});
