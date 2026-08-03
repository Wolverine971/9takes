#!/usr/bin/env node
// Generates the reactivation-email people wall from the same curated data used
// by /personality-analysis/map. The output is a compatibility-first JPEG: the
// full image remains the route preview, while per-person JPEG cards assemble
// into an email-safe table where every public figure has an independent link.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = path.join(ROOT, 'src/lib/data/people-wall.json');
const SLUG_MAP_PATH = path.join(ROOT, 'src/lib/generated/personalityImageSlugMap.json');
const OUTPUT_PATH = path.join(ROOT, 'static/email/reactivation/people-wall-v1.jpg');
const CARD_OUTPUT_DIR = path.join(ROOT, 'static/email/reactivation/people-wall/cards');

const WIDTH = 1400;
const HEIGHT = 1980;
const MARGIN_X = 48;
const HEADER_HEIGHT = 278;
const ROW_HEIGHT = 160;
const ROW_GAP = 12;
const TYPE_RAIL_WIDTH = 106;
const TYPE_RAIL_GAP = 12;
const CARD_WIDTH = 388;
const CARD_GAP = 10;
const PORTRAIT_SIZE = ROW_HEIGHT;

const COLORS = {
	nightDeep: '#0a0807',
	nightMid: '#16110d',
	stoneWarm: '#241D17',
	stoneMid: '#3a302a',
	stoneEdge: '#5C4F47',
	inkBright: '#FAF8F4',
	inkMid: '#A8A095',
	inkDim: '#786B62',
	lampGlow: '#F59E0B',
	lampLight: '#FBBF24'
};

const TYPE_COLORS = {
	1: '#6366F1',
	2: '#F472B6',
	3: '#F59E0B',
	4: '#A855F7',
	5: '#0EA5E9',
	6: '#22C55E',
	7: '#FBBF24',
	8: '#DC2626',
	9: '#34D399'
};

function escapeXml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function svg(fragment, width = WIDTH, height = HEIGHT) {
	return Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${fragment}</svg>`
	);
}

function wrapTitle(value, maxCharacters = 23) {
	const lines = [];
	let currentLine = '';

	for (const word of String(value).split(/\s+/)) {
		const candidate = currentLine ? `${currentLine} ${word}` : word;
		if (candidate.length <= maxCharacters || !currentLine) {
			currentLine = candidate;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}

	if (currentLine) lines.push(currentLine);
	return lines;
}

function backgroundSvg(data) {
	return svg(`
		<defs>
			<radialGradient id="lamp" cx="18%" cy="0%" r="72%">
				<stop offset="0%" stop-color="${COLORS.lampGlow}" stop-opacity="0.13" />
				<stop offset="48%" stop-color="${COLORS.nightDeep}" stop-opacity="0" />
			</radialGradient>
		</defs>
		<rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.nightDeep}" />
		<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#lamp)" />
		<text x="${MARGIN_X}" y="72" fill="${COLORS.lampGlow}" font-family="JetBrains Mono, monospace" font-size="22" font-weight="700" letter-spacing="2.4">§01 · ${escapeXml(data.kicker.toUpperCase())}</text>
		<text x="${MARGIN_X}" y="148" fill="${COLORS.inkBright}" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="800" letter-spacing="-2">${escapeXml(data.headline)}</text>
		<text x="${MARGIN_X}" y="208" fill="${COLORS.inkMid}" font-family="Inter, Arial, sans-serif" font-size="27">27 public figures · 9 emotional patterns · 400+ in-depth reads</text>
		<g transform="translate(1135 54)">
			<rect width="217" height="166" rx="16" fill="${COLORS.nightMid}" stroke="${COLORS.stoneEdge}" />
			<text x="24" y="47" fill="${COLORS.inkDim}" font-family="JetBrains Mono, monospace" font-size="17" letter-spacing="1.6">THE INDEX</text>
			<text x="24" y="111" fill="${COLORS.lampLight}" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="800">9 × 3</text>
			<text x="24" y="142" fill="${COLORS.inkMid}" font-family="Inter, Arial, sans-serif" font-size="17">THREE PEOPLE PER TYPE</text>
		</g>
	`);
}

function typeRailSvg(row, typeColor) {
	return svg(
		`<rect width="${TYPE_RAIL_WIDTH}" height="${ROW_HEIGHT}" fill="${COLORS.nightMid}" stroke="${COLORS.stoneEdge}" />
		<rect width="7" height="${ROW_HEIGHT}" fill="${typeColor}" />
		<text x="24" y="36" fill="${COLORS.inkDim}" font-family="JetBrains Mono, monospace" font-size="15" letter-spacing="1.4">TYPE</text>
		<text x="22" y="96" fill="${typeColor}" font-family="Inter, Arial, sans-serif" font-size="62" font-weight="800">${row.type}</text>
		<text x="22" y="132" fill="${COLORS.inkBright}" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="700">${escapeXml(row.name.toUpperCase())}</text>`,
		TYPE_RAIL_WIDTH,
		ROW_HEIGHT
	);
}

function cardChromeSvg(person, typeColor) {
	const nameFontSize = person.name.length >= 18 ? 20 : person.name.length >= 15 ? 22 : 25;
	const titleLines = wrapTitle(person.personaTitle);
	const titleSpans = titleLines
		.map(
			(line, index) =>
				`<tspan x="${PORTRAIT_SIZE + 24}" y="${99 + index * 20}">${escapeXml(line)}</tspan>`
		)
		.join('');
	return svg(
		`<rect width="${CARD_WIDTH}" height="${ROW_HEIGHT}" fill="${COLORS.stoneWarm}" stroke="${COLORS.stoneEdge}" />
		<rect width="${CARD_WIDTH}" height="5" fill="${typeColor}" />
		<line x1="${PORTRAIT_SIZE}" y1="0" x2="${PORTRAIT_SIZE}" y2="${ROW_HEIGHT}" stroke="${COLORS.stoneEdge}" />
		<text x="${PORTRAIT_SIZE + 24}" y="69" fill="${COLORS.inkBright}" font-family="Inter, Arial, sans-serif" font-size="${nameFontSize}" font-weight="750">${escapeXml(person.name)}</text>
		<text fill="${COLORS.inkMid}" font-family="Inter, Arial, sans-serif" font-size="15.5" font-style="italic">${titleSpans}</text>`,
		CARD_WIDTH,
		ROW_HEIGHT
	);
}

function footerSvg() {
	const footerY = HEADER_HEIGHT + 9 * ROW_HEIGHT + 8 * ROW_GAP + 38;
	return svg(`
		<line x1="${MARGIN_X}" y1="${footerY - 28}" x2="${WIDTH - MARGIN_X}" y2="${footerY - 28}" stroke="${COLORS.stoneEdge}" />
		<text x="${MARGIN_X}" y="${footerY + 24}" fill="${COLORS.inkBright}" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="750">See what drives them</text>
		<text x="${MARGIN_X}" y="${footerY + 62}" fill="${COLORS.inkMid}" font-family="Inter, Arial, sans-serif" font-size="20">Open the people index and explore every full breakdown.</text>
		<text x="${WIDTH - MARGIN_X}" y="${footerY + 37}" text-anchor="end" fill="${COLORS.lampGlow}" font-family="JetBrains Mono, monospace" font-size="19" font-weight="700" letter-spacing="1">9TAKES.COM/PERSONALITY-ANALYSIS/MAP →</text>
	`);
}

async function portraitBuffer(type, person, slugMap) {
	const resolvedSlug = slugMap[person.slug];
	if (!resolvedSlug) throw new Error(`Missing image slug mapping for ${person.slug}`);
	const imagePath = path.join(ROOT, 'static', 'types', `${type}s`, `s-${resolvedSlug}.webp`);
	await fs.access(imagePath);
	return sharp(imagePath)
		.resize(PORTRAIT_SIZE, PORTRAIT_SIZE, { fit: 'cover', position: 'attention' })
		.modulate({ brightness: 0.93, saturation: 0.72 })
		.sharpen({ sigma: 0.6 })
		.toBuffer();
}

async function personCardBuffer(type, person, typeColor, slugMap) {
	const portrait = await portraitBuffer(type, person, slugMap);
	return sharp({
		create: {
			width: CARD_WIDTH,
			height: ROW_HEIGHT,
			channels: 3,
			background: COLORS.stoneWarm
		}
	})
		.composite([
			{ input: cardChromeSvg(person, typeColor), left: 0, top: 0 },
			{ input: portrait, left: 0, top: 0 }
		])
		.png()
		.toBuffer();
}

const [data, slugMap] = await Promise.all([
	fs.readFile(DATA_PATH, 'utf8').then(JSON.parse),
	fs.readFile(SLUG_MAP_PATH, 'utf8').then(JSON.parse)
]);

if (
	data.types.length !== 9 ||
	data.types.some(
		(row) =>
			row.people.length !== 3 || row.people.some((person) => !person.name || !person.personaTitle)
	)
) {
	throw new Error(
		'People wall must contain exactly nine type rows with three named people and persona titles per row'
	);
}

const composites = [
	{ input: backgroundSvg(data), left: 0, top: 0 },
	{ input: footerSvg(), left: 0, top: 0 }
];

await fs.mkdir(CARD_OUTPUT_DIR, { recursive: true });

for (const [rowIndex, row] of data.types.entries()) {
	const y = HEADER_HEIGHT + rowIndex * (ROW_HEIGHT + ROW_GAP);
	const typeColor = TYPE_COLORS[row.type];
	composites.push({ input: typeRailSvg(row, typeColor), left: MARGIN_X, top: y });

	for (const [columnIndex, person] of row.people.entries()) {
		const x = MARGIN_X + TYPE_RAIL_WIDTH + TYPE_RAIL_GAP + columnIndex * (CARD_WIDTH + CARD_GAP);
		const card = await personCardBuffer(row.type, person, typeColor, slugMap);
		composites.push({ input: card, left: x, top: y });
		await sharp(card)
			.jpeg({ quality: 80, progressive: true, chromaSubsampling: '4:2:0', mozjpeg: true })
			.toFile(path.join(CARD_OUTPUT_DIR, `${person.slug}.jpg`));
	}
}

await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
await sharp({
	create: {
		width: WIDTH,
		height: HEIGHT,
		channels: 3,
		background: COLORS.nightDeep
	}
})
	.composite(composites)
	.jpeg({ quality: 76, progressive: true, chromaSubsampling: '4:2:0', mozjpeg: true })
	.toFile(OUTPUT_PATH);

const { size } = await fs.stat(OUTPUT_PATH);
console.log(
	`People wall written: ${path.relative(ROOT, OUTPUT_PATH)} (${WIDTH}×${HEIGHT}, ${Math.round(size / 1024)} KB) plus 27 linked card assets`
);
