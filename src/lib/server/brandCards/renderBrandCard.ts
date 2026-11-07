// src/lib/server/brandCards/renderBrandCard.ts
// One Cold Light card renderer for every branded image: link previews (OG), question cards,
// people cards, and the Instagram / X templates on /admin/brand.
// Text is drawn as opentype.js outlines inside an SVG (librsvg on Vercel has no Anton), then
// sharp composites the statue, the nine-mask mark and the text layer.
// Relative imports only: scripts/brand-card.ts loads this through tsx, outside SvelteKit.
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import sharp, { type OverlayOptions } from 'sharp';
import opentype, { type Font, type Path } from 'opentype.js';
import {
	CARD_FORMATS,
	COLORS,
	FONT_FILES,
	LOGO_MARK_FILE,
	STATUES,
	type CardFormat,
	type FontRole,
	type StatueId
} from '../../brand/brandTokens';

const SITE_ORIGIN = 'https://9takes.com';
const FETCH_TIMEOUT_MS = 5000;

// ---------------------------------------------------------------------------
// Inputs

export type CardArt = 'statue' | 'masks' | 'none';

export interface StatementCard {
	template: 'statement';
	/** Loud line. Anton, uppercase, 2 to 5 words. Never a full sentence. */
	headline: string;
	/** Quiet line. Playfair italic in lavender. */
	voice?: string;
	/** Small uppercase label above the headline. */
	kicker?: string;
	art?: CardArt;
	statue?: StatueId;
	footer?: string;
}

export interface QuestionCard {
	template: 'question';
	question: string;
	kicker?: string;
	/** Mint pill: the one action on the card. */
	action?: string;
	footer?: string;
}

export interface PersonCard {
	template: 'person';
	name: string;
	/** Enneagram type 1 to 9. */
	type?: number | null;
	voice?: string;
	kicker?: string;
	/** Site-relative path to the portrait, e.g. /types/9s/Adam-Sandler.webp */
	portrait?: string | null;
	footer?: string;
}

export interface SlideCard {
	template: 'slide';
	/** e.g. "02 / 07" */
	index?: string;
	headline?: string;
	body: string;
	voice?: string;
	footer?: string;
}

export type BrandCardInput = StatementCard | QuestionCard | PersonCard | SlideCard;

export interface RenderBrandCardOptions {
	format?: CardFormat;
	output?: 'png' | 'jpeg';
}

// ---------------------------------------------------------------------------
// Asset loading (local file first, then the live site; Vercel functions may not ship /static)

const bufferCache = new Map<string, Buffer>();
const fontCache = new Map<FontRole, Font>();

const toArrayBuffer = (buffer: Buffer): ArrayBuffer =>
	buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;

async function fetchWithTimeout(url: string): Promise<Buffer> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	try {
		const response = await fetch(url, { signal: controller.signal });
		if (!response.ok) throw new Error(`Failed to fetch ${url} (${response.status})`);
		return Buffer.from(await response.arrayBuffer());
	} finally {
		clearTimeout(timer);
	}
}

/** `repoPath` is relative to the repo root and lives under static/. */
export async function loadStaticAsset(repoPath: string): Promise<Buffer> {
	const cached = bufferCache.get(repoPath);
	if (cached) return cached;
	let buffer: Buffer;
	try {
		buffer = await readFile(path.resolve(repoPath));
	} catch {
		const publicPath = repoPath.replace(/^static\//, '');
		buffer = await fetchWithTimeout(`${SITE_ORIGIN}/${publicPath}`);
	}
	bufferCache.set(repoPath, buffer);
	return buffer;
}

async function loadFont(role: FontRole): Promise<Font> {
	const cached = fontCache.get(role);
	if (cached) return cached;
	const font = opentype.parse(toArrayBuffer(await loadStaticAsset(FONT_FILES[role])));
	// opentype.js cannot run some GSUB lookups in these fonts (contextual ligatures). The cards
	// need outlines, metrics and kerning only.
	delete (font.tables as Record<string, unknown>).gsub;
	fontCache.set(role, font);
	return font;
}

type Fonts = Record<FontRole, Font>;

async function loadFonts(): Promise<Fonts> {
	const [shout, talk, talkBold, talkRegular, voice] = await Promise.all([
		loadFont('shout'),
		loadFont('talk'),
		loadFont('talkBold'),
		loadFont('talkRegular'),
		loadFont('voice')
	]);
	return { shout, talk, talkBold, talkRegular, voice };
}

// ---------------------------------------------------------------------------
// Text

const escapeAttr = (value: string): string =>
	value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

interface TextStyle {
	font: Font;
	size: number;
	/** em units, like CSS letter-spacing in em */
	tracking?: number;
}

function measure(text: string, { font, size, tracking = 0 }: TextStyle): number {
	return font.getAdvanceWidth(text, size, { kerning: true, letterSpacing: tracking });
}

/**
 * Space-separated path data. opentype's toPathData() packs numbers ("0.56Q2.96-1.08"), and
 * librsvg stops drawing partway through some of those strings, which cut words off mid-glyph.
 */
function serializePath(glyphPath: Path): string {
	const n = (v: number) => (Number.isFinite(v) ? v.toFixed(2) : '0');
	return glyphPath.commands
		.map((c) => {
			switch (c.type) {
				case 'M':
				case 'L':
					return `${c.type} ${n(c.x)} ${n(c.y)}`;
				case 'Q':
					return `Q ${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
				case 'C':
					return `C ${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
				default:
					return 'Z';
			}
		})
		.join(' ');
}

function textPath(
	text: string,
	style: TextStyle,
	x: number,
	baseline: number,
	color: string,
	anchor: 'left' | 'center' | 'right' = 'left',
	opacity = 1
): string {
	if (!text) return '';
	let startX = x;
	const width = measure(text, style);
	if (anchor === 'center') startX -= width / 2;
	if (anchor === 'right') startX -= width;
	const d = serializePath(
		style.font.getPath(text, startX, baseline, style.size, {
			kerning: true,
			letterSpacing: style.tracking ?? 0
		})
	);
	const op = opacity < 1 ? ` fill-opacity="${opacity}"` : '';
	return `<path d="${escapeAttr(d)}" fill="${color}"${op}/>`;
}

function wrap(text: string, style: TextStyle, maxWidth: number): string[] {
	const paragraphs = text.split(/\n/);
	const lines: string[] = [];
	for (const paragraph of paragraphs) {
		const words = paragraph.trim().split(/\s+/).filter(Boolean);
		let line = '';
		for (const word of words) {
			const next = line ? `${line} ${word}` : word;
			if (!line || measure(next, style) <= maxWidth) {
				line = next;
			} else {
				lines.push(line);
				line = word;
			}
		}
		if (line) lines.push(line);
	}
	return lines;
}

interface FittedText {
	lines: string[];
	size: number;
}

/** Largest size (stepping down) at which the text wraps into maxLines and every line fits. */
function fit(
	text: string,
	font: Font,
	opts: { maxWidth: number; maxLines: number; start: number; min: number; tracking?: number }
): FittedText {
	const { maxWidth, maxLines, start, min, tracking = 0 } = opts;
	for (let size = start; size >= min; size -= Math.max(1, start * 0.03)) {
		const style = { font, size, tracking };
		const lines = wrap(text, style, maxWidth);
		if (lines.length <= maxLines && lines.every((l) => measure(l, style) <= maxWidth)) {
			return { lines, size };
		}
	}
	// Floor: keep min size, truncate overflow with an ellipsis.
	const style = { font, size: min, tracking };
	let lines = wrap(text, style, maxWidth);
	if (lines.length > maxLines) {
		lines = lines.slice(0, maxLines);
		lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[\s,.;:]+$/, '')}…`;
	}
	// A single word wider than the column: scale it down to fit.
	const widest = Math.max(...lines.map((l) => measure(l, style)));
	const size = widest > maxWidth ? (min * maxWidth) / widest : min;
	return { lines, size };
}

// ---------------------------------------------------------------------------
// Shared pieces

interface Frame {
	w: number;
	h: number;
	/** type scale relative to the 1200x630 / 1080-wide baseline */
	s: number;
	shape: 'landscape' | 'portrait' | 'square';
	pad: number;
	/** vertical band text must stay inside (Story safe zones) */
	safeTop: number;
	safeBottom: number;
	/** label scale: small caps need to be bigger on phone-first formats */
	lab: number;
	/** X header: the profile photo covers the bottom-left, so text moves right and the brand row goes */
	isHeader: boolean;
}

function frameFor(format: CardFormat): Frame {
	const { width: w, height: h } = CARD_FORMATS[format];
	const ratio = w / h;
	const shape = ratio >= 1.4 ? 'landscape' : ratio <= 0.9 ? 'portrait' : 'square';
	const s = shape === 'landscape' ? Math.min(h / 630, w / 1200) : w / 1080;
	const pad = Math.round((shape === 'landscape' ? 64 : 84) * s);
	const isStory = format === 'ig-story';
	return {
		w,
		h,
		s,
		shape,
		pad,
		safeTop: isStory ? 250 : pad,
		safeBottom: isStory ? h - 340 : h - pad,
		lab: shape === 'landscape' ? 1 : 1.3,
		isHeader: format === 'x-header'
	};
}

function backgroundSvg({ w, h }: Frame, glow = 0.22): string {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<defs>
<radialGradient id="g" cx="0.08" cy="0" r="1.1" gradientUnits="objectBoundingBox">
<stop offset="0" stop-color="${COLORS.indigo}" stop-opacity="${glow}"/>
<stop offset="0.55" stop-color="${COLORS.indigoDeep}" stop-opacity="${glow * 0.35}"/>
<stop offset="1" stop-color="${COLORS.night}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="100%" height="100%" fill="${COLORS.night}"/>
<rect width="100%" height="100%" fill="url(#g)"/>
</svg>`;
}

/** Statue cropped to a region, faded into Night on the edge that faces the text. */
async function statueLayer(
	statue: StatueId,
	region: { left: number; top: number; width: number; height: number },
	fade: 'left' | 'bottom' | 'both'
): Promise<OverlayOptions> {
	const meta = STATUES[statue];
	const source = await loadStaticAsset(meta.file);
	const { width, height } = region;
	const srcMeta = await sharp(source).metadata();
	const scale = Math.max(width / (srcMeta.width ?? width), height / (srcMeta.height ?? height));
	const scaledW = Math.round((srcMeta.width ?? width) * scale);
	const scaledH = Math.round((srcMeta.height ?? height) * scale);
	const left = Math.round((scaledW - width) / 2);
	const top = Math.round(
		Math.min(Math.max(0, scaledH * meta.focusY - height * 0.3), scaledH - height)
	);

	const stops =
		fade === 'left'
			? `<linearGradient id="m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.42" stop-color="#fff" stop-opacity="1"/></linearGradient>`
			: `<linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0.5" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
	const bottomFade =
		fade === 'both'
			? `<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0.72" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`
			: '';
	const mask = Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs>${
			fade === 'both'
				? `<linearGradient id="m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.42" stop-color="#fff" stop-opacity="1"/></linearGradient>${bottomFade}<mask id="mm"><rect width="100%" height="100%" fill="url(#b)"/></mask>`
				: stops
		}</defs><rect width="100%" height="100%" fill="url(#m)"${fade === 'both' ? ' mask="url(#mm)"' : ''}/></svg>`
	);

	const input = await sharp(source)
		.resize(scaledW, scaledH)
		.extract({ left, top, width, height })
		.ensureAlpha()
		.composite([{ input: mask, blend: 'dest-in' }])
		.png()
		.toBuffer();
	return { input, left: Math.round(region.left), top: Math.round(region.top) };
}

async function markLayer(size: number, left: number, top: number): Promise<OverlayOptions> {
	const input = await sharp(await loadStaticAsset(LOGO_MARK_FILE))
		.resize(Math.round(size), Math.round(size))
		.png()
		.toBuffer();
	return { input, left: Math.round(left), top: Math.round(top) };
}

/** Nine-mask mark + "9takes" wordmark (Archivo bold, like the site header). */
async function brandRow(
	fonts: Fonts,
	f: Frame,
	top: number
): Promise<{ layers: OverlayOptions[]; svg: string; bottom: number }> {
	const mark = Math.round(52 * f.s);
	const wordSize = 30 * f.s;
	const layers = [await markLayer(mark, f.pad, top)];
	const svg = textPath(
		'9takes',
		{ font: fonts.talkBold, size: wordSize },
		f.pad + mark + 14 * f.s,
		top + mark / 2 + wordSize * 0.36,
		COLORS.text
	);
	return { layers, svg, bottom: top + mark };
}

function kickerPath(
	fonts: Fonts,
	f: Frame,
	text: string,
	x: number,
	baseline: number,
	color = COLORS.lavender
) {
	return textPath(
		text.toUpperCase(),
		{ font: fonts.talk, size: 19 * f.s * f.lab, tracking: 0.16 },
		x,
		baseline,
		color
	);
}

function footerPath(
	fonts: Fonts,
	f: Frame,
	text: string,
	x: number,
	baseline: number,
	anchor: 'left' | 'right' = 'left'
) {
	return textPath(
		text.toUpperCase(),
		{ font: fonts.talk, size: 17 * f.s * f.lab, tracking: 0.18 },
		x,
		baseline,
		COLORS.textFaint,
		anchor
	);
}

interface Block {
	svg: string;
	height: number;
}

/** Stacks kicker, headline, voice into one block at (x, top); returns svg + height. */
function headlineBlock(
	fonts: Fonts,
	f: Frame,
	x: number,
	top: number,
	maxWidth: number,
	parts: { kicker?: string; headline?: string; voice?: string },
	sizes: { headline: number; headlineLines: number; voice: number }
): Block {
	let y = top;
	let svg = '';
	if (parts.kicker) {
		const ks = 19 * f.s * f.lab;
		y += ks;
		svg += kickerPath(fonts, f, parts.kicker, x, y);
		y += ks * 1.3;
	}
	if (parts.headline) {
		const fitted = fit(parts.headline.toUpperCase(), fonts.shout, {
			maxWidth,
			maxLines: sizes.headlineLines,
			start: sizes.headline,
			min: sizes.headline * 0.5
		});
		const lh = fitted.size * 1.02;
		for (const line of fitted.lines) {
			y += lh;
			svg += textPath(
				line,
				{ font: fonts.shout, size: fitted.size },
				x,
				y - fitted.size * 0.06,
				COLORS.text
			);
		}
		y += fitted.size * 0.12;
	}
	if (parts.voice) {
		const fitted = fit(parts.voice, fonts.voice, {
			maxWidth,
			maxLines: 3,
			start: sizes.voice,
			min: sizes.voice * 0.6
		});
		const lh = fitted.size * 1.22;
		y += fitted.size * 0.35;
		for (const line of fitted.lines) {
			y += lh;
			svg += textPath(
				line,
				{ font: fonts.voice, size: fitted.size },
				x,
				y - fitted.size * 0.22,
				COLORS.lavender
			);
		}
	}
	return { svg, height: y - top };
}

/** Measures a block without keeping it, so callers can center it. */
const blockHeight = (...args: Parameters<typeof headlineBlock>) => headlineBlock(...args).height;

type BlockSizes = Parameters<typeof headlineBlock>[6];

/** Shrinks the type scale until the block fits the available height. */
function sizesToFit(
	fonts: Fonts,
	f: Frame,
	width: number,
	parts: Parameters<typeof headlineBlock>[5],
	sizes: BlockSizes,
	maxHeight: number
): { sizes: BlockSizes; height: number } {
	let scale = 1;
	let current = sizes;
	let height = blockHeight(fonts, f, 0, 0, width, parts, current);
	while (height > maxHeight && scale > 0.55) {
		scale -= 0.05;
		current = {
			...sizes,
			headline: sizes.headline * scale,
			voice: sizes.voice * Math.max(scale, 0.75)
		};
		height = blockHeight(fonts, f, 0, 0, width, parts, current);
	}
	return { sizes: current, height };
}

// ---------------------------------------------------------------------------
// Templates

interface Composition {
	layers: OverlayOptions[];
	svg: string;
	glow?: number;
}

async function composeStatement(card: StatementCard, f: Frame, fonts: Fonts): Promise<Composition> {
	const art: CardArt = card.art ?? (card.statue ? 'statue' : 'masks');
	const statue = card.statue ?? 'whisper';
	const layers: OverlayOptions[] = [];
	let svg = '';

	const brand = f.isHeader
		? { layers: [] as OverlayOptions[], svg: '', bottom: f.pad }
		: await brandRow(fonts, f, f.safeTop);
	const footer = card.footer ?? '9takes.com';

	if (f.shape === 'landscape') {
		const textLeft = f.isHeader ? Math.round(f.w * 0.3) : f.pad;
		const artWidth = Math.round(art === 'none' ? 0 : Math.min(f.w * 0.5, f.h * 1.05));
		if (art === 'statue') {
			layers.push(
				await statueLayer(
					statue,
					{ left: f.w - artWidth, top: 0, width: artWidth, height: f.h },
					'left'
				)
			);
		} else if (art === 'masks') {
			const size = Math.round(Math.min(f.h * 0.78, artWidth * 0.86));
			layers.push(await markLayer(size, f.w - f.pad - size, (f.h - size) / 2));
		}
		const artShare = art === 'none' ? 0 : art === 'statue' ? 0.72 : 1;
		const textWidth = f.w - textLeft - artWidth * artShare - f.pad;
		const parts = { kicker: card.kicker, headline: card.headline, voice: card.voice };
		const bandTop = f.isHeader ? f.pad : brand.bottom + 24 * f.s;
		const bandBottom = f.h - f.pad - 34 * f.s;
		const { sizes, height: h } = sizesToFit(
			fonts,
			f,
			textWidth,
			parts,
			{ headline: 100 * f.s, headlineLines: 3, voice: 42 * f.s },
			bandBottom - bandTop
		);
		const top = bandTop + Math.max(0, (bandBottom - bandTop - h) / 2);
		svg += headlineBlock(fonts, f, textLeft, top, textWidth, parts, sizes).svg;
		svg += footerPath(fonts, f, footer, textLeft, f.h - f.pad + 4 * f.s);
	} else {
		const artHeight = Math.round(
			art === 'none' ? 0 : f.h * (f.shape === 'square' ? 0.5 : f.h / f.w > 1.6 ? 0.56 : 0.55)
		);
		if (art === 'statue') {
			layers.push(
				await statueLayer(statue, { left: 0, top: 0, width: f.w, height: artHeight }, 'bottom')
			);
			// Darken the top edge so the brand row reads over the statue.
			svg += `<rect width="${f.w}" height="${Math.round(f.safeTop + 120 * f.s)}" fill="url(#topShade)"/>`;
		} else if (art === 'masks') {
			const size = Math.round(Math.min(artHeight * 0.8, f.w * 0.62));
			layers.push(
				await markLayer(size, (f.w - size) / 2, f.safeTop + (artHeight - size) / 2 + 30 * f.s)
			);
		}
		const textWidth = f.w - f.pad * 2;
		const parts = { kicker: card.kicker, headline: card.headline, voice: card.voice };
		const bandTop =
			art === 'none'
				? brand.bottom + 40 * f.s
				: art === 'statue'
					? artHeight - 90 * f.s
					: f.safeTop + artHeight;
		const bandBottom = f.safeBottom - 60 * f.s;
		const { sizes, height: h } = sizesToFit(
			fonts,
			f,
			textWidth,
			parts,
			{ headline: (f.shape === 'square' ? 112 : 128) * f.s, headlineLines: 4, voice: 54 * f.s },
			bandBottom - brand.bottom - 40 * f.s
		);
		const top =
			art === 'none'
				? bandTop + Math.max(0, (bandBottom - bandTop - h) / 2)
				: Math.min(bandTop, bandBottom - h);
		svg += headlineBlock(fonts, f, f.pad, top, textWidth, parts, sizes).svg;
		svg += footerPath(fonts, f, '@9takesdotcom', f.pad, f.safeBottom);
		svg += footerPath(fonts, f, footer, f.w - f.pad, f.safeBottom, 'right');
	}

	return { layers: [...layers, ...brand.layers], svg: brand.svg + svg };
}

/** Nine type chips: the takes exist, but stay closed until you answer. */
function hiddenTakes(
	fonts: Fonts,
	f: Frame,
	x: number,
	centerY: number,
	chip: number
): { svg: string; width: number } {
	const gap = chip * 0.28;
	let svg = '';
	for (let i = 0; i < 9; i++) {
		const cx = x + i * (chip + gap);
		svg += `<rect x="${cx}" y="${centerY - chip / 2}" width="${chip}" height="${chip}" rx="${Math.round(10 * f.s)}" fill="${COLORS.surfaceRaised}" stroke="${COLORS.lavender}" stroke-opacity="0.28" stroke-width="${Math.max(1, 1.5 * f.s)}"/>`;
		svg += textPath(
			String(i + 1),
			{ font: fonts.talkBold, size: chip * 0.42 },
			cx + chip / 2,
			centerY + chip * 0.15,
			COLORS.textMuted,
			'center'
		);
	}
	return { svg, width: 9 * chip + 8 * gap };
}

function mintPill(
	fonts: Fonts,
	f: Frame,
	text: string,
	right: number,
	centerY: number,
	fixedWidth?: number
): { svg: string; width: number } {
	const style = { font: fonts.talkBold, size: 20 * f.s * f.lab, tracking: 0.08 };
	const label = text.toUpperCase();
	const width = fixedWidth ?? measure(label, style) + 44 * f.s;
	const height = 54 * f.s * (f.lab > 1 ? 1.4 : 1);
	const x = right - width;
	return {
		width,
		svg:
			`<rect x="${x}" y="${centerY - height / 2}" width="${width}" height="${height}" rx="${height / 2}" fill="${COLORS.mint}"/>` +
			textPath(label, style, x + width / 2, centerY + style.size * 0.36, COLORS.night, 'center')
	};
}

async function composeQuestion(card: QuestionCard, f: Frame, fonts: Fonts): Promise<Composition> {
	const brand = await brandRow(fonts, f, f.safeTop);
	let svg = '';
	const kicker = card.kicker ?? 'One question, nine perspectives';
	const action = card.action ?? 'Answer before the crowd';
	const landscape = f.shape === 'landscape';

	// Bottom row: nine closed takes + the one mint action.
	const bottomY = f.safeBottom - 27 * f.s;
	const pill = landscape
		? mintPill(fonts, f, action, f.w - f.pad, bottomY)
		: mintPill(fonts, f, action, f.w - f.pad, bottomY, f.w - f.pad * 2);
	const chipSize = landscape
		? Math.min(44 * f.s, (f.w - f.pad * 3 - pill.width) / 11.3)
		: (f.w - f.pad * 2) / 11.24;
	const chipsY = landscape ? bottomY : bottomY - 60 * f.s - chipSize;
	const chipsSvg = hiddenTakes(fonts, f, f.pad, chipsY, chipSize).svg;
	const pillSvg = pill.svg;

	const bandTop = brand.bottom + (landscape ? 30 : 70) * f.s;
	const bandBottom = bottomY - (landscape ? 56 : 300) * f.s;
	const ks = 19 * f.s * f.lab;
	const textWidth = f.w - f.pad * 2;
	const fitted = fit(card.question.trim(), fonts.talk, {
		maxWidth: textWidth,
		maxLines: landscape ? 4 : 7,
		start: (landscape ? 62 : 84) * f.s,
		min: (landscape ? 34 : 44) * f.s
	});
	const lh = fitted.size * 1.16;
	const blockH = ks * 2.6 + fitted.lines.length * lh;
	let y = bandTop + Math.max(0, (bandBottom - bandTop - blockH) / 2);
	y += ks;
	svg += kickerPath(fonts, f, kicker, f.pad, y);
	y += ks * 1.6;
	for (const line of fitted.lines) {
		y += lh;
		svg += textPath(
			line,
			{ font: fonts.talk, size: fitted.size },
			f.pad,
			y - fitted.size * 0.2,
			COLORS.text
		);
	}
	if (card.footer)
		svg += footerPath(fonts, f, card.footer, f.w - f.pad, brand.bottom - 16 * f.s, 'right');

	return { layers: brand.layers, svg: brand.svg + svg + chipsSvg + pillSvg, glow: 0.3 };
}

async function portraitLayer(
	portrait: string,
	size: number,
	left: number,
	top: number,
	radius: number
) {
	const source = await loadStaticAsset(`static${portrait.startsWith('/') ? '' : '/'}${portrait}`);
	const rounded = Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`
	);
	const input = await sharp(source)
		.resize(size, size, { fit: 'cover', position: 'top' })
		.flatten({ background: '#ffffff' })
		.ensureAlpha()
		.composite([{ input: rounded, blend: 'dest-in' }])
		.png()
		.toBuffer();
	return { input, left: Math.round(left), top: Math.round(top) };
}

async function composePerson(card: PersonCard, f: Frame, fonts: Fonts): Promise<Composition> {
	const brand = await brandRow(fonts, f, f.safeTop);
	const layers: OverlayOptions[] = [];
	let svg = '';
	const radius = Math.round(16 * f.s);
	const typeLine = card.type ? `Enneagram Type ${card.type}` : '';
	const kicker = card.kicker ?? 'Personality analysis';
	const voice = card.voice ?? 'See the emotions behind every take.';
	const landscape = f.shape === 'landscape';

	let textWidth: number;
	let textLeft = f.pad;
	let bandTop: number;
	let bandBottom: number;
	if (landscape) {
		const size = Math.round(f.h - f.pad * 2);
		const left = f.w - f.pad - size;
		if (card.portrait) layers.push(await portraitLayer(card.portrait, size, left, f.pad, radius));
		svg += `<rect x="${left - 0.75}" y="${f.pad - 0.75}" width="${size + 1.5}" height="${size + 1.5}" rx="${radius}" fill="none" stroke="${COLORS.lavender}" stroke-opacity="0.35" stroke-width="1.5"/>`;
		textWidth = left - f.pad * 2;
		bandTop = brand.bottom + 24 * f.s;
		bandBottom = f.h - f.pad - 30 * f.s;
	} else {
		const size = Math.round(Math.min(f.w - f.pad * 2, f.h * 0.5));
		const top = brand.bottom + 40 * f.s;
		const left = (f.w - size) / 2;
		if (card.portrait) layers.push(await portraitLayer(card.portrait, size, left, top, radius));
		textWidth = f.w - f.pad * 2;
		bandTop = top + size + 50 * f.s;
		bandBottom = f.safeBottom - 60 * f.s;
		textLeft = f.pad;
	}

	const sizes = {
		headline: (landscape ? 92 : 112) * f.s,
		headlineLines: 2,
		voice: (landscape ? 36 : 48) * f.s
	};
	const parts = { kicker, headline: card.name, voice };
	let typeSvg = '';
	const typeSize = (landscape ? 26 : 34) * f.s;
	const h =
		blockHeight(fonts, f, textLeft, 0, textWidth, parts, sizes) + (typeLine ? typeSize * 1.9 : 0);
	const top = landscape ? bandTop + Math.max(0, (bandBottom - bandTop - h) / 2) : bandTop;
	const block = headlineBlock(
		fonts,
		f,
		textLeft,
		top,
		textWidth,
		{ kicker, headline: card.name },
		sizes
	);
	svg += block.svg;
	let y = top + block.height;
	if (typeLine) {
		y += typeSize * 1.25;
		typeSvg = textPath(
			typeLine.toUpperCase(),
			{ font: fonts.talkBold, size: typeSize, tracking: 0.1 },
			textLeft,
			y,
			COLORS.lavender
		);
		y += typeSize * 0.3;
	}
	const voiceBlock = headlineBlock(fonts, f, textLeft, y, textWidth, { voice }, sizes);
	svg += typeSvg + voiceBlock.svg;
	svg += footerPath(
		fonts,
		f,
		card.footer ?? '9takes.com',
		textLeft,
		landscape ? f.h - f.pad + 4 * f.s : f.safeBottom
	);
	if (!landscape) svg += footerPath(fonts, f, '@9takesdotcom', f.w - f.pad, f.safeBottom, 'right');

	return { layers: [...layers, ...brand.layers], svg: brand.svg + svg };
}

async function composeSlide(card: SlideCard, f: Frame, fonts: Fonts): Promise<Composition> {
	const brand = await brandRow(fonts, f, f.safeTop);
	let svg = '';
	const textWidth = f.w - f.pad * 2;
	if (card.index) {
		const width = measure(card.index.toUpperCase(), {
			font: fonts.talk,
			size: 19 * f.s * f.lab,
			tracking: 0.16
		});
		svg += kickerPath(fonts, f, card.index, f.w - f.pad - width, brand.bottom - 16 * f.s);
	}

	const landscape = f.shape === 'landscape';
	const bodySize = (landscape ? 30 : 40) * f.s;
	const headSizes = {
		headline: (landscape ? 72 : 96) * f.s,
		headlineLines: 3,
		voice: (landscape ? 34 : 46) * f.s
	};
	const bandTop = brand.bottom + 60 * f.s;
	const bandBottom = f.safeBottom - 70 * f.s;

	const head = card.headline
		? headlineBlock(fonts, f, f.pad, 0, textWidth, { headline: card.headline }, headSizes)
		: null;
	const headH = head ? head.height + bodySize * 0.9 : 0;
	const bodyFit = fit(card.body, fonts.talkRegular, {
		maxWidth: textWidth,
		maxLines: Math.max(
			3,
			Math.floor((bandBottom - bandTop - headH) / (bodySize * 1.42)) - (card.voice ? 2 : 0)
		),
		start: bodySize,
		min: bodySize * 0.7
	});
	const blh = bodyFit.size * 1.42;
	const voiceH = card.voice
		? blockHeight(fonts, f, f.pad, 0, textWidth, { voice: card.voice }, headSizes) + bodyFit.size
		: 0;
	const total = headH + bodyFit.lines.length * blh + voiceH;
	let y = bandTop + Math.max(0, (bandBottom - bandTop - total) / 2);
	if (card.headline) {
		svg += headlineBlock(fonts, f, f.pad, y, textWidth, { headline: card.headline }, headSizes).svg;
		y += headH;
	}
	for (const line of bodyFit.lines) {
		y += blh;
		svg += textPath(
			line,
			{ font: fonts.talkRegular, size: bodyFit.size },
			f.pad,
			y - bodyFit.size * 0.3,
			COLORS.text
		);
	}
	if (card.voice) {
		y += bodyFit.size * 0.6;
		svg += headlineBlock(fonts, f, f.pad, y, textWidth, { voice: card.voice }, headSizes).svg;
	}
	svg += footerPath(fonts, f, '@9takesdotcom', f.pad, f.safeBottom);
	svg += footerPath(fonts, f, card.footer ?? '9takes.com', f.w - f.pad, f.safeBottom, 'right');
	return { layers: brand.layers, svg: brand.svg + svg };
}

// ---------------------------------------------------------------------------
// Entry point

export async function renderBrandCard(
	card: BrandCardInput,
	{ format = 'og', output = 'png' }: RenderBrandCardOptions = {}
): Promise<Buffer> {
	const f = frameFor(format);
	const fonts = await loadFonts();

	const composition =
		card.template === 'statement'
			? await composeStatement(card, f, fonts)
			: card.template === 'question'
				? await composeQuestion(card, f, fonts)
				: card.template === 'person'
					? await composePerson(card, f, fonts)
					: await composeSlide(card, f, fonts);

	const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${f.w}" height="${f.h}">
<defs><linearGradient id="topShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${COLORS.night}" stop-opacity="0.85"/><stop offset="1" stop-color="${COLORS.night}" stop-opacity="0"/></linearGradient></defs>
${composition.svg}
</svg>`;

	// Statue and art go under the text; the brand mark sits with the text on top.
	const image = sharp(Buffer.from(backgroundSvg(f, composition.glow))).composite([
		...composition.layers.slice(0, -1),
		{ input: Buffer.from(overlay), left: 0, top: 0 },
		...composition.layers.slice(-1)
	]);

	return output === 'jpeg'
		? image.jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer()
		: image.png({ compressionLevel: 9, palette: false }).toBuffer();
}
