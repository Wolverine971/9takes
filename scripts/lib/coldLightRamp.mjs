// scripts/lib/coldLightRamp.mjs
// Pure helpers for the Cold Light tint ramp (docs/brand/cold-light.md, "The tint ramp").
// Greyscale luminance 0..255 is mapped through five stops, interpolated linearly in sRGB.
// No sharp import here so the LUT can be unit-tested without touching pixels.

/** The canonical ramp. Position 0..1 → sRGB hex. Do not hand-tune per image. */
export const COLD_LIGHT_STOPS = Object.freeze([
	{ at: 0, hex: '#01010D' }, // Night
	{ at: 0.3, hex: '#160A46' }, // Shadow
	{ at: 0.62, hex: '#6331FB' }, // Indigo midtones
	{ at: 0.88, hex: '#BEAAFF' }, // Lavender highlights
	{ at: 1, hex: '#ECE6FF' } // Brightest highlight
]);

/** '#RRGGBB' → [r, g, b] */
export function hexToRgb(hex) {
	const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
	if (!m) throw new Error(`Bad hex color: ${hex}`);
	return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

/** Ramp color at position t (0..1), linear in sRGB between the surrounding stops. */
export function rampAt(t, stops = COLD_LIGHT_STOPS) {
	const x = Math.min(1, Math.max(0, t));
	for (let i = 1; i < stops.length; i++) {
		const a = stops[i - 1];
		const b = stops[i];
		if (x <= b.at) {
			const span = b.at - a.at || 1;
			const f = (x - a.at) / span;
			const ca = hexToRgb(a.hex);
			const cb = hexToRgb(b.hex);
			return [0, 1, 2].map((k) => Math.round(ca[k] + (cb[k] - ca[k]) * f));
		}
	}
	return hexToRgb(stops[stops.length - 1].hex);
}

/**
 * 256-entry LUT as a flat Uint8Array of length 768 ([r0,g0,b0, r1,g1,b1, ...]).
 * Index = greyscale luminance 0..255.
 */
export function buildRampLut(stops = COLD_LIGHT_STOPS) {
	const lut = new Uint8Array(256 * 3);
	for (let v = 0; v < 256; v++) {
		const [r, g, b] = rampAt(v / 255, stops);
		lut[v * 3] = r;
		lut[v * 3 + 1] = g;
		lut[v * 3 + 2] = b;
	}
	return lut;
}

/**
 * Levels normalization applied to greyscale values before the LUT.
 * Stretches [lo, hi] (from the image's own percentiles) to [0, 255], then applies gamma.
 * gamma < 1 lifts the midtones. Identity when lo=0, hi=255, gamma=1.
 */
export function buildLevelsLut({ lo = 0, hi = 255, gamma = 1 } = {}) {
	const lut = new Uint8Array(256);
	const range = Math.max(1, hi - lo);
	for (let v = 0; v < 256; v++) {
		const n = Math.min(1, Math.max(0, (v - lo) / range));
		lut[v] = Math.round(Math.pow(n, gamma) * 255);
	}
	return lut;
}

/** Value at percentile p (0..1) of a 256-bin histogram. */
export function histogramPercentile(hist, p) {
	let total = 0;
	for (let i = 0; i < 256; i++) total += hist[i];
	const target = total * p;
	let acc = 0;
	for (let i = 0; i < 256; i++) {
		acc += hist[i];
		if (acc >= target) return i;
	}
	return 255;
}

/**
 * Levels parameters for one image from its greyscale histogram.
 * Clips the darkest/brightest 0.5%, caps the stretch so already-full-range images are
 * nearly untouched, and lifts midtones (gamma 0.85) because the ramp puts 0..30% luminance
 * into near-black indigo, which would otherwise crush shadow detail on faces.
 */
export function autoLevels(hist, { clip = 0.005, gamma = 0.85, maxLo = 40, minHi = 200 } = {}) {
	const lo = Math.min(maxLo, histogramPercentile(hist, clip));
	const hi = Math.max(minHi, histogramPercentile(hist, 1 - clip));
	return { lo, hi: Math.max(hi, lo + 1), gamma };
}
