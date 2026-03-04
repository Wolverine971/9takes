// src/lib/server/socialCards/renderQuestionSocialCard.ts
import path from 'path';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { calculateQuestionCardTextLayout } from '$lib/socialCards/questionCardTextLayout';
import {
	QUESTION_SOCIAL_CARD_HEIGHT,
	QUESTION_SOCIAL_CARD_WIDTH
} from '$lib/socialCards/questionSocialCard';

const BACKGROUND_PATH = path.resolve('static/greek_pantheon.png');
const DEFAULT_BACKGROUND_URL = 'https://9takes.com/greek_pantheon.png';
const BACKGROUND_FETCH_TIMEOUT_MS = 5000;

let cachedBackgroundBuffer: Buffer | null = null;

const escapeXml = (value: string): string =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

export interface RenderQuestionSocialCardOptions {
	questionText: string;
	questionUrl: string;
	backgroundUrl?: string;
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
	const controller = new AbortController();
	const timeoutRef = setTimeout(() => controller.abort(), BACKGROUND_FETCH_TIMEOUT_MS);

	try {
		const response = await fetch(fetchUrl, { signal: controller.signal });
		if (!response.ok) {
			throw new Error(`Failed to fetch background image (${response.status})`);
		}
		const arrayBuffer = await response.arrayBuffer();
		cachedBackgroundBuffer = Buffer.from(arrayBuffer);
		return cachedBackgroundBuffer;
	} finally {
		clearTimeout(timeoutRef);
	}
};

export const renderQuestionSocialCard = async ({
	questionText,
	questionUrl,
	backgroundUrl
}: RenderQuestionSocialCardOptions): Promise<Buffer> => {
	const textLayout = calculateQuestionCardTextLayout(questionText);
	const lineHeightPx = textLayout.fontSize * textLayout.lineHeight;
	const textAreaTop = 125;
	const textAreaHeight = 335;
	const textBlockHeight = textLayout.lines.length * lineHeightPx;
	const firstLineY = textAreaTop + (textAreaHeight - textBlockHeight) / 2 + textLayout.fontSize;

	const tspans = textLayout.lines
		.map((line, index) => {
			if (index === 0) {
				return `<tspan x="600" y="${firstLineY}">${escapeXml(line)}</tspan>`;
			}
			return `<tspan x="600" dy="${lineHeightPx}">${escapeXml(line)}</tspan>`;
		})
		.join('');

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
			<text x="62" y="74" fill="#f6f3ff" font-size="26" font-family="Space Grotesk, Helvetica, Arial, sans-serif" font-weight="700" letter-spacing="1.1">9takes</text>
			<text x="600" text-anchor="middle" fill="#fdf8ff" font-size="${textLayout.fontSize}" font-family="Noticia Text, Georgia, Times New Roman, serif" font-weight="700" letter-spacing="-0.35">
				${tspans}
			</text>
			<text x="600" y="590" text-anchor="middle" fill="rgba(245,236,255,0.95)" font-size="24" font-family="Space Grotesk, Helvetica, Arial, sans-serif" font-weight="600">${escapeXml(questionUrl)}</text>
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
