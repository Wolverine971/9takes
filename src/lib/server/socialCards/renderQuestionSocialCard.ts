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

const BACKGROUND_PATH = path.resolve('static/greek_pantheon.png');
const DEFAULT_BACKGROUND_URL = 'https://9takes.com/greek_pantheon.png';
const BACKGROUND_FETCH_TIMEOUT_MS = 5000;
const DEFAULT_FONT_REGULAR_URL = 'https://9takes.com/fonts/NoticiaText-Regular.ttf';
const DEFAULT_FONT_BOLD_URL = 'https://9takes.com/fonts/NoticiaText-Bold.ttf';
const FONT_REGULAR_PATH = path.resolve('static/fonts/NoticiaText-Regular.ttf');
const FONT_BOLD_PATH = path.resolve('static/fonts/NoticiaText-Bold.ttf');

let cachedBackgroundBuffer: Buffer | null = null;
let cachedRegularFontBuffer: Buffer | null = null;
let cachedBoldFontBuffer: Buffer | null = null;
let cachedRegularFont: opentype.Font | null = null;
let cachedBoldFont: opentype.Font | null = null;

const toArrayBuffer = (buffer: Buffer): ArrayBuffer =>
	buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;

const escapeSvgAttribute = (value: string): string =>
	value.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const fetchBufferWithTimeout = async (url: string): Promise<Buffer> => {
	const controller = new AbortController();
	const timeoutRef = setTimeout(() => controller.abort(), BACKGROUND_FETCH_TIMEOUT_MS);
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
	backgroundUrl?: string;
	fontRegularUrl?: string;
	fontBoldUrl?: string;
}

const loadBackgroundBuffer = async (backgroundUrl?: string): Promise<Buffer> => {
	if (cachedBackgroundBuffer) {
		return cachedBackgroundBuffer;
	}

	try {
		cachedBackgroundBuffer = await readFile(BACKGROUND_PATH);
		return cachedBackgroundBuffer;
	} catch {
		// Vercel serverless runtime does not always include /static files in function filesystem.
	}

	const fetchUrl = backgroundUrl || DEFAULT_BACKGROUND_URL;
	cachedBackgroundBuffer = await fetchBufferWithTimeout(fetchUrl);
	return cachedBackgroundBuffer;
};

const loadFontBuffer = async ({
	localPath,
	remoteUrl,
	cached
}: {
	localPath: string;
	remoteUrl: string;
	cached: Buffer | null;
}): Promise<Buffer> => {
	if (cached) {
		return cached;
	}
	try {
		return await readFile(localPath);
	} catch {
		return await fetchBufferWithTimeout(remoteUrl);
	}
};

const loadRegularFont = async (fontRegularUrl?: string): Promise<opentype.Font> => {
	if (cachedRegularFont) {
		return cachedRegularFont;
	}
	cachedRegularFontBuffer = await loadFontBuffer({
		localPath: FONT_REGULAR_PATH,
		remoteUrl: fontRegularUrl || DEFAULT_FONT_REGULAR_URL,
		cached: cachedRegularFontBuffer
	});
	cachedRegularFont = opentype.parse(toArrayBuffer(cachedRegularFontBuffer));
	return cachedRegularFont;
};

const loadBoldFont = async (fontBoldUrl?: string): Promise<opentype.Font> => {
	if (cachedBoldFont) {
		return cachedBoldFont;
	}
	cachedBoldFontBuffer = await loadFontBuffer({
		localPath: FONT_BOLD_PATH,
		remoteUrl: fontBoldUrl || DEFAULT_FONT_BOLD_URL,
		cached: cachedBoldFontBuffer
	});
	cachedBoldFont = opentype.parse(toArrayBuffer(cachedBoldFontBuffer));
	return cachedBoldFont;
};

const getAdvanceWidth = (font: opentype.Font, text: string, size: number): number =>
	font.getAdvanceWidth(text, size, { kerning: true });

const buildTextPath = ({
	font,
	text,
	size,
	x,
	y,
	color,
	anchor
}: {
	font: opentype.Font;
	text: string;
	size: number;
	x: number;
	y: number;
	color: string;
	anchor: 'left' | 'center';
}): string => {
	if (!text) {
		return '';
	}
	let startX = x;
	if (anchor === 'center') {
		startX -= getAdvanceWidth(font, text, size) / 2;
	}
	const pathData = font.getPath(text, startX, y, size, { kerning: true }).toPathData(3);
	return `<path d="${escapeSvgAttribute(pathData)}" fill="${color}" />`;
};

export const renderQuestionSocialCard = async ({
	questionText,
	questionUrl,
	backgroundUrl,
	fontRegularUrl,
	fontBoldUrl
}: RenderQuestionSocialCardOptions): Promise<Buffer> => {
	const textLayout = calculateQuestionCardTextLayout(questionText);
	const lineHeightPx = textLayout.fontSize * textLayout.lineHeight;
	const textAreaTop = 125;
	const textAreaHeight = 335;
	const textBlockHeight = textLayout.lines.length * lineHeightPx;
	const firstLineY = textAreaTop + (textAreaHeight - textBlockHeight) / 2 + textLayout.fontSize;
	const regularFont = await loadRegularFont(fontRegularUrl);
	const boldFont = await loadBoldFont(fontBoldUrl);

	const questionPaths = textLayout.lines
		.map((line, index) =>
			buildTextPath({
				font: boldFont,
				text: line,
				size: textLayout.fontSize,
				x: 600,
				y: firstLineY + lineHeightPx * index,
				color: '#fdf8ff',
				anchor: 'center'
			})
		)
		.join('');

	const brandPath = buildTextPath({
		font: boldFont,
		text: '9takes',
		size: 26,
		x: 62,
		y: 74,
		color: '#f6f3ff',
		anchor: 'left'
	});

	const questionUrlPath = buildTextPath({
		font: regularFont,
		text: questionUrl,
		size: 24,
		x: 600,
		y: 590,
		color: '#f5ecff',
		anchor: 'center'
	});

	const overlaySvg = Buffer.from(
		`<svg width="${QUESTION_SOCIAL_CARD_WIDTH}" height="${QUESTION_SOCIAL_CARD_HEIGHT}" viewBox="0 0 ${QUESTION_SOCIAL_CARD_WIDTH} ${QUESTION_SOCIAL_CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="overlayGradient" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="rgba(10, 13, 32, 0.68)" />
					<stop offset="62%" stop-color="rgba(9, 10, 20, 0.82)" />
					<stop offset="100%" stop-color="rgba(8, 9, 18, 0.90)" />
				</linearGradient>
				<radialGradient id="glow" cx="0.5" cy="0.2" r="0.56">
					<stop offset="0%" stop-color="rgba(162, 105, 255, 0.24)" />
					<stop offset="100%" stop-color="rgba(162, 105, 255, 0)" />
				</radialGradient>
			</defs>
			<rect x="0" y="0" width="${QUESTION_SOCIAL_CARD_WIDTH}" height="${QUESTION_SOCIAL_CARD_HEIGHT}" fill="url(#overlayGradient)" />
			<rect x="0" y="0" width="${QUESTION_SOCIAL_CARD_WIDTH}" height="${QUESTION_SOCIAL_CARD_HEIGHT}" fill="url(#glow)" />
			${brandPath}
			${questionPaths}
			${questionUrlPath}
		</svg>`
	);

	const backgroundBuffer = await loadBackgroundBuffer(backgroundUrl);

	const base = await sharp(backgroundBuffer)
		.resize(QUESTION_SOCIAL_CARD_WIDTH, QUESTION_SOCIAL_CARD_HEIGHT, {
			fit: 'cover',
			position: 'attention'
		})
		.png()
		.toBuffer();

	return sharp(base)
		.composite([{ input: overlaySvg, blend: 'over' }])
		.png()
		.toBuffer();
};
