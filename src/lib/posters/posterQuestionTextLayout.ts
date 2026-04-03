// src/lib/posters/posterQuestionTextLayout.ts

export interface PosterQuestionTextLayout {
	lines: string[];
	fontSize: number;
	lineHeight: number;
}

export interface PosterQuestionBounds {
	maxWidth: number;
	maxHeight: number;
}

export interface PosterQuestionTextLayoutOptions {
	text: string;
	width: number;
	height: number;
	showLogo: boolean;
	showQrCode: boolean;
}

export const POSTER_QUESTION_FONT_FAMILY = '"Space Grotesk", "Helvetica Neue", sans-serif';
export const POSTER_QUESTION_LINE_HEIGHT = 1.25;
export const POSTER_QUESTION_AUTO_FONT_SIZES = [
	128, 120, 112, 104, 96, 88, 80, 72, 64, 56, 48, 44, 40, 36, 32, 28
];
export const POSTER_QUESTION_MANUAL_FONT_SIZES = {
	'text-2xl': 24,
	'text-3xl': 30,
	'text-4xl': 36,
	'text-5xl': 48
} as const;

const DEFAULT_TEXT = 'Share your perspective';
const CONTENT_PADDING_PX = 32;
const QUESTION_VERTICAL_PADDING_PX = 64;
const LOGO_RESERVED_HEIGHT_PX = 72;
const FOOTER_RESERVED_HEIGHT_WITH_QR_PX = 132;
const FOOTER_RESERVED_HEIGHT_NO_QR_PX = 96;

const normalizePosterQuestionText = (text: string): string => text.replace(/\s+/g, ' ').trim();

const estimateCharWidth = (fontSize: number): number => fontSize * 0.58;

const wrapLine = (text: string, maxCharsPerLine: number): string[] => {
	const words = text.split(' ');
	const lines: string[] = [];
	let current = '';

	const pushLongWord = (word: string) => {
		for (let index = 0; index < word.length; index += maxCharsPerLine) {
			lines.push(word.slice(index, index + maxCharsPerLine));
		}
	};

	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word;
		if (candidate.length <= maxCharsPerLine) {
			current = candidate;
			continue;
		}

		if (current) {
			lines.push(current);
		}

		if (word.length > maxCharsPerLine) {
			pushLongWord(word);
			current = '';
			continue;
		}

		current = word;
	}

	if (current) {
		lines.push(current);
	}

	return lines;
};

export const dimensionToPixels = (value: string): number => {
	const normalized = value.trim().toLowerCase();

	if (normalized.endsWith('px')) {
		return Math.round(Number.parseFloat(normalized));
	}

	if (normalized.endsWith('in')) {
		return Math.round(Number.parseFloat(normalized) * 96);
	}

	return Math.round(Number.parseFloat(normalized));
};

export const getPosterQuestionBounds = ({
	width,
	height,
	showLogo,
	showQrCode
}: {
	width: number;
	height: number;
	showLogo: boolean;
	showQrCode: boolean;
}): PosterQuestionBounds => {
	const contentWidth = Math.max(120, width - CONTENT_PADDING_PX * 2);
	const footerHeight = showQrCode
		? FOOTER_RESERVED_HEIGHT_WITH_QR_PX
		: FOOTER_RESERVED_HEIGHT_NO_QR_PX;
	const reservedHeight =
		QUESTION_VERTICAL_PADDING_PX +
		footerHeight +
		(showLogo ? LOGO_RESERVED_HEIGHT_PX : 0) +
		CONTENT_PADDING_PX * 2;

	return {
		maxWidth: Math.floor(contentWidth * 0.9),
		maxHeight: Math.max(140, height - reservedHeight)
	};
};

export const estimatePosterQuestionTextLayout = (
	text: string,
	bounds: PosterQuestionBounds
): PosterQuestionTextLayout => {
	const normalized = normalizePosterQuestionText(text);
	const safeText = normalized || DEFAULT_TEXT;

	for (const fontSize of POSTER_QUESTION_AUTO_FONT_SIZES) {
		const maxCharsPerLine = Math.max(8, Math.floor(bounds.maxWidth / estimateCharWidth(fontSize)));
		const lines = wrapLine(safeText, maxCharsPerLine);
		const totalHeight = lines.length * fontSize * POSTER_QUESTION_LINE_HEIGHT;
		if (totalHeight <= bounds.maxHeight) {
			return {
				lines,
				fontSize,
				lineHeight: POSTER_QUESTION_LINE_HEIGHT
			};
		}
	}

	const fallbackSize = POSTER_QUESTION_AUTO_FONT_SIZES[POSTER_QUESTION_AUTO_FONT_SIZES.length - 1];
	return {
		lines: wrapLine(
			safeText,
			Math.max(8, Math.floor(bounds.maxWidth / estimateCharWidth(fallbackSize)))
		),
		fontSize: fallbackSize,
		lineHeight: POSTER_QUESTION_LINE_HEIGHT
	};
};

export const calculatePosterQuestionTextLayoutClient = async (
	options: PosterQuestionTextLayoutOptions
): Promise<PosterQuestionTextLayout> => {
	const bounds = getPosterQuestionBounds(options);
	const normalized = normalizePosterQuestionText(options.text);
	const safeText = normalized || DEFAULT_TEXT;
	const { fitTextBlockClient } = await import('$lib/browser/fitTextBlockClient');
	const layout = await fitTextBlockClient({
		text: safeText,
		maxWidth: bounds.maxWidth,
		maxHeight: bounds.maxHeight,
		fontFamily: POSTER_QUESTION_FONT_FAMILY,
		fontSizes: POSTER_QUESTION_AUTO_FONT_SIZES,
		fontWeight: 700,
		lineHeight: POSTER_QUESTION_LINE_HEIGHT
	});

	if (layout === null) {
		return estimatePosterQuestionTextLayout(safeText, bounds);
	}

	return {
		lines: layout.lines,
		fontSize: layout.fontSize,
		lineHeight: layout.lineHeight
	};
};
