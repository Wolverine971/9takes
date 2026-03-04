// src/lib/socialCards/questionCardTextLayout.ts
const DEFAULT_LINE_HEIGHT = 1.18;
const MAX_TEXT_WIDTH = 980;
const MAX_TEXT_HEIGHT = 360;

const FONT_SIZES = [72, 68, 64, 60, 56, 52, 48, 44, 40, 36, 34, 32, 30, 28];

export interface QuestionCardTextLayout {
	lines: string[];
	fontSize: number;
	lineHeight: number;
}

const normalizeQuestionText = (text: string): string => text.replace(/\s+/g, ' ').trim();

const estimateCharWidth = (fontSize: number): number => fontSize * 0.56;

const wrapLine = (text: string, maxCharsPerLine: number): string[] => {
	const words = text.split(' ');
	const lines: string[] = [];
	let current = '';

	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word;
		if (candidate.length <= maxCharsPerLine) {
			current = candidate;
			continue;
		}

		if (current) {
			lines.push(current);
		}
		current = word;
	}

	if (current) {
		lines.push(current);
	}

	return lines;
};

export const calculateQuestionCardTextLayout = (text: string): QuestionCardTextLayout => {
	const normalized = normalizeQuestionText(text);
	const safeText = normalized || 'Share your perspective';

	for (const fontSize of FONT_SIZES) {
		const maxCharsPerLine = Math.max(12, Math.floor(MAX_TEXT_WIDTH / estimateCharWidth(fontSize)));
		const lines = wrapLine(safeText, maxCharsPerLine);
		const totalHeight = lines.length * fontSize * DEFAULT_LINE_HEIGHT;
		if (totalHeight <= MAX_TEXT_HEIGHT) {
			return {
				lines,
				fontSize,
				lineHeight: DEFAULT_LINE_HEIGHT
			};
		}
	}

	const fallbackSize = FONT_SIZES[FONT_SIZES.length - 1];
	const maxCharsPerLine = Math.max(
		10,
		Math.floor(MAX_TEXT_WIDTH / estimateCharWidth(fallbackSize))
	);
	return {
		lines: wrapLine(safeText, maxCharsPerLine),
		fontSize: fallbackSize,
		lineHeight: DEFAULT_LINE_HEIGHT
	};
};
