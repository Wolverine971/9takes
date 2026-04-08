// src/lib/socialCards/questionCardTextLayout.ts

export const QUESTION_CARD_LINE_HEIGHT = 1.18;
export const QUESTION_CARD_MAX_TEXT_WIDTH = 980;
export const QUESTION_CARD_MAX_TEXT_HEIGHT = 360;
export const QUESTION_CARD_FONT_FAMILY = '"Noticia Text", "Georgia", "Times New Roman", serif';
export const QUESTION_CARD_FONT_SIZES = [72, 68, 64, 60, 56, 52, 48, 44, 40, 36, 34, 32, 30, 28];

export interface QuestionCardTextLayout {
	lines: string[];
	fontSize: number;
	lineHeight: number;
}

const normalizeQuestionText = (text: string): string => text?.replace(/\s+/g, ' ')?.trim();

const estimateCharWidth = (fontSize: number): number => fontSize * 0.56;

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

export const calculateQuestionCardTextLayout = (text: string): QuestionCardTextLayout => {
	const normalized = normalizeQuestionText(text);
	const safeText = normalized || 'Share your perspective';

	for (const fontSize of QUESTION_CARD_FONT_SIZES) {
		const maxCharsPerLine = Math.max(
			12,
			Math.floor(QUESTION_CARD_MAX_TEXT_WIDTH / estimateCharWidth(fontSize))
		);
		const lines = wrapLine(safeText, maxCharsPerLine);
		const totalHeight = lines.length * fontSize * QUESTION_CARD_LINE_HEIGHT;
		if (totalHeight <= QUESTION_CARD_MAX_TEXT_HEIGHT) {
			return {
				lines,
				fontSize,
				lineHeight: QUESTION_CARD_LINE_HEIGHT
			};
		}
	}

	const fallbackSize = QUESTION_CARD_FONT_SIZES[QUESTION_CARD_FONT_SIZES.length - 1];
	const maxCharsPerLine = Math.max(
		10,
		Math.floor(QUESTION_CARD_MAX_TEXT_WIDTH / estimateCharWidth(fallbackSize))
	);
	return {
		lines: wrapLine(safeText, maxCharsPerLine),
		fontSize: fallbackSize,
		lineHeight: QUESTION_CARD_LINE_HEIGHT
	};
};

export const calculateQuestionCardTextLayoutClient = async (
	text: string
): Promise<QuestionCardTextLayout> => {
	const normalized = normalizeQuestionText(text);
	const safeText = normalized || 'Share your perspective';
	const { fitTextBlockClient } = await import('$lib/browser/fitTextBlockClient');
	const layout = await fitTextBlockClient({
		text: safeText,
		maxWidth: QUESTION_CARD_MAX_TEXT_WIDTH,
		maxHeight: QUESTION_CARD_MAX_TEXT_HEIGHT,
		fontFamily: QUESTION_CARD_FONT_FAMILY,
		fontSizes: QUESTION_CARD_FONT_SIZES,
		fontWeight: 700,
		lineHeight: QUESTION_CARD_LINE_HEIGHT
	});

	if (layout === null) {
		return calculateQuestionCardTextLayout(safeText);
	}

	return {
		lines: layout.lines,
		fontSize: layout.fontSize,
		lineHeight: layout.lineHeight
	};
};
