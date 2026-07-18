// src/lib/server/socialCards/renderQuestionSocialCard.ts
import path from 'path';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import * as opentype from 'opentype.js';
import { calculateQuestionCardTextLayout } from '$lib/socialCards/questionCardTextLayout';
import {
	QUESTION_SOCIAL_CARD_HEIGHT,
	QUESTION_SOCIAL_CARD_WIDTH
} from '$lib/socialCards/questionSocialCard';

const ASSET_FETCH_TIMEOUT_MS = 5000;
const DEFAULT_FONT_BOLD_URL = 'https://9takes.com/fonts/inter/Inter-Bold.ttf';
const FONT_BOLD_PATH = path.resolve('static/fonts/inter/Inter-Bold.ttf');

// Streetlamp Symposium V5 palette. Hardcoded because the SVG output cannot
// resolve the app's CSS custom properties.
const NIGHT_DEEP = '#0a0807';
const STONE_EDGE = '#5c4f47';
const LAMP_GLOW = '#f59e0b';
const INK_BRIGHT = '#faf8f4';
const INK_MID = '#a8a095';
const INK_DIM = '#948578';

const BRACKET_INSET = 32;
const BRACKET_ARM = 64;
const QUESTION_MAX_LINE_WIDTH = 1040;
const FOOTER_MAX_WIDTH = 960;
const URL_FONT_SIZES = [20, 18, 16, 14];

let cachedBoldFontBuffer: Buffer | null = null;
let cachedBoldFont: opentype.Font | null = null;

const toArrayBuffer = (buffer: Buffer): ArrayBuffer =>
	buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;

const escapeSvgAttribute = (value: string): string =>
	value.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const fetchBufferWithTimeout = async (url: string): Promise<Buffer> => {
	const controller = new AbortController();
	const timeoutRef = setTimeout(() => controller.abort(), ASSET_FETCH_TIMEOUT_MS);
	try {
		const response = await fetch(url, { signal: controller.signal });
		if (!response.ok) {
			throw new Error(`Failed to fetch asset (${response.status})`);
		}
		const arrayBuffer = await response.arrayBuffer();
		return Buffer.from(arrayBuffer);
	} finally {
		clearTimeout(timeoutRef);
	}
};

export interface RenderQuestionSocialCardOptions {
	questionText: string;
	questionUrl: string;
	/** Legacy option; the V5 card paints its own night-deep background. */
	backgroundUrl?: string;
	/** Legacy option; the V5 card renders everything with bundled Inter. */
	fontRegularUrl?: string;
	/** Legacy option; the V5 card renders everything with bundled Inter. */
	fontBoldUrl?: string;
}

const loadBoldFont = async (): Promise<opentype.Font> => {
	if (cachedBoldFont) {
		return cachedBoldFont;
	}
	if (!cachedBoldFontBuffer) {
		try {
			cachedBoldFontBuffer = await readFile(FONT_BOLD_PATH);
		} catch {
			// Vercel serverless runtime does not always include /static files in function filesystem.
			cachedBoldFontBuffer = await fetchBufferWithTimeout(DEFAULT_FONT_BOLD_URL);
		}
	}
	cachedBoldFont = opentype.parse(toArrayBuffer(cachedBoldFontBuffer));
	return cachedBoldFont;
};

const getAdvanceWidth = (
	font: opentype.Font,
	text: string,
	size: number,
	letterSpacing = 0
): number => font.getAdvanceWidth(text, size, { kerning: true, letterSpacing });

const buildTextPath = ({
	font,
	text,
	size,
	x,
	y,
	color,
	anchor,
	letterSpacing = 0
}: {
	font: opentype.Font;
	text: string;
	size: number;
	x: number;
	y: number;
	color: string;
	anchor: 'left' | 'center' | 'right';
	letterSpacing?: number;
}): string => {
	if (!text) {
		return '';
	}
	let startX = x;
	if (anchor === 'center') {
		startX -= getAdvanceWidth(font, text, size, letterSpacing) / 2;
	} else if (anchor === 'right') {
		startX -= getAdvanceWidth(font, text, size, letterSpacing);
	}
	const pathData = font
		.getPath(text, startX, y, size, { kerning: true, letterSpacing })
		.toPathData(3);
	return `<path d="${escapeSvgAttribute(pathData)}" fill="${color}" />`;
};

export const renderQuestionSocialCard = async ({
	questionText,
	questionUrl
}: RenderQuestionSocialCardOptions): Promise<Buffer> => {
	const boldFont = await loadBoldFont();
	const textLayout = calculateQuestionCardTextLayout(questionText);

	// The wrap estimate is font-agnostic; scale down if Inter renders any line wider than the safe area.
	const widestLine = Math.max(
		...textLayout.lines.map((line) => getAdvanceWidth(boldFont, line, textLayout.fontSize))
	);
	const fitScale = widestLine > QUESTION_MAX_LINE_WIDTH ? QUESTION_MAX_LINE_WIDTH / widestLine : 1;
	const questionFontSize = textLayout.fontSize * fitScale;
	const lineHeightPx = questionFontSize * textLayout.lineHeight;
	const textAreaTop = 120;
	const textAreaHeight = 384;
	const textBlockHeight = textLayout.lines.length * lineHeightPx;
	const firstLineY = textAreaTop + (textAreaHeight - textBlockHeight) / 2 + questionFontSize;

	const questionPaths = textLayout.lines
		.map((line, index) =>
			buildTextPath({
				font: boldFont,
				text: line,
				size: questionFontSize,
				x: 600,
				y: firstLineY + lineHeightPx * index,
				color: INK_BRIGHT,
				anchor: 'center'
			})
		)
		.join('');

	const brandPath = buildTextPath({
		font: boldFont,
		text: '9TAKES',
		size: 23,
		x: 58,
		y: 79,
		color: LAMP_GLOW,
		anchor: 'left',
		letterSpacing: 0.18
	});

	const taglinePath = buildTextPath({
		font: boldFont,
		text: 'ONE QUESTION · NINE WAYS TO SEE IT',
		size: 17,
		x: 1142,
		y: 77,
		color: INK_DIM,
		anchor: 'right',
		letterSpacing: 0.14
	});

	const displayUrl = questionUrl.replace(/^https?:\/\//, '');
	const urlFontSize =
		URL_FONT_SIZES.find(
			(size) => getAdvanceWidth(boldFont, displayUrl, size) <= FOOTER_MAX_WIDTH
		) ?? URL_FONT_SIZES[URL_FONT_SIZES.length - 1];
	const questionUrlPath = buildTextPath({
		font: boldFont,
		text: displayUrl,
		size: urlFontSize,
		x: 600,
		y: 566,
		color: INK_MID,
		anchor: 'center'
	});

	const footerStripPath = buildTextPath({
		font: boldFont,
		text: 'ANSWER FIRST · SEE ALL 9 TAKES',
		size: 15,
		x: 600,
		y: 602,
		color: INK_DIM,
		anchor: 'center',
		letterSpacing: 0.18
	});

	const width = QUESTION_SOCIAL_CARD_WIDTH;
	const height = QUESTION_SOCIAL_CARD_HEIGHT;
	const bracketTopLeft = `M ${BRACKET_INSET} ${BRACKET_INSET + BRACKET_ARM} L ${BRACKET_INSET} ${BRACKET_INSET} L ${BRACKET_INSET + BRACKET_ARM} ${BRACKET_INSET}`;
	const bracketBottomRight = `M ${width - BRACKET_INSET - BRACKET_ARM} ${height - BRACKET_INSET} L ${width - BRACKET_INSET} ${height - BRACKET_INSET} L ${width - BRACKET_INSET} ${height - BRACKET_INSET - BRACKET_ARM}`;

	const cardSvg = Buffer.from(
		`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<radialGradient id="lampPool" cx="0.5" cy="0.14" r="0.72">
					<stop offset="0%" stop-color="${LAMP_GLOW}" stop-opacity="0.16" />
					<stop offset="45%" stop-color="${LAMP_GLOW}" stop-opacity="0.05" />
					<stop offset="100%" stop-color="${LAMP_GLOW}" stop-opacity="0" />
				</radialGradient>
				<linearGradient id="floorShade" x1="0" y1="0" x2="0" y2="1">
					<stop offset="55%" stop-color="#000000" stop-opacity="0" />
					<stop offset="100%" stop-color="#000000" stop-opacity="0.28" />
				</linearGradient>
			</defs>
			<rect x="0" y="0" width="${width}" height="${height}" fill="${NIGHT_DEEP}" />
			<rect x="0" y="0" width="${width}" height="${height}" fill="url(#lampPool)" />
			<rect x="0" y="0" width="${width}" height="${height}" fill="url(#floorShade)" />
			<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="${STONE_EDGE}" stroke-opacity="0.5" />
			<path d="${bracketTopLeft}" fill="none" stroke="${LAMP_GLOW}" stroke-opacity="0.6" stroke-width="2" />
			<path d="${bracketBottomRight}" fill="none" stroke="${LAMP_GLOW}" stroke-opacity="0.6" stroke-width="2" />
			<rect x="572" y="524" width="56" height="3" rx="1.5" fill="${LAMP_GLOW}" fill-opacity="0.85" />
			${brandPath}
			${taglinePath}
			${questionPaths}
			${questionUrlPath}
			${footerStripPath}
		</svg>`
	);

	return sharp(cardSvg).png().toBuffer();
};
