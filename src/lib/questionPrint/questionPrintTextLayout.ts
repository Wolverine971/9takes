// src/lib/questionPrint/questionPrintTextLayout.ts
export interface QuestionPrintTextLayout {
	lines: string[];
	fontSize: number;
	lineHeight: number;
	text: string;
}

export interface QuestionPrintTextLayoutOptions {
	text: string;
	maxWidth: number;
	maxHeight: number;
	maxLines?: number;
}

export const QUESTION_PRINT_FONT_FAMILY = '"Noticia Text", Georgia, serif';
export const QUESTION_PRINT_LINE_HEIGHT = 1.4;
export const QUESTION_PRINT_AUTO_FONT_SIZES = [
	56, 54, 52, 50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14
];

const normalizeQuestionPrintText = (text: string): string =>
	text.replace(/\s+/g, ' ').trim().toUpperCase();

const estimateCharWidth = (fontSize: number): number => fontSize * 0.6;

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

const emptyLayout = (): QuestionPrintTextLayout => ({
	lines: [],
	fontSize: 32,
	lineHeight: QUESTION_PRINT_LINE_HEIGHT,
	text: ''
});

export const estimateQuestionPrintTextLayout = (
	options: QuestionPrintTextLayoutOptions
): QuestionPrintTextLayout => {
	const text = normalizeQuestionPrintText(options.text);
	if (!text) {
		return emptyLayout();
	}

	for (const fontSize of QUESTION_PRINT_AUTO_FONT_SIZES) {
		const maxCharsPerLine = Math.max(8, Math.floor(options.maxWidth / estimateCharWidth(fontSize)));
		const lines = wrapLine(text, maxCharsPerLine);
		const totalHeight = lines.length * fontSize * QUESTION_PRINT_LINE_HEIGHT;
		if (
			totalHeight <= options.maxHeight &&
			(options.maxLines === undefined || lines.length <= options.maxLines)
		) {
			return {
				lines,
				fontSize,
				lineHeight: QUESTION_PRINT_LINE_HEIGHT,
				text
			};
		}
	}

	const fallbackSize = QUESTION_PRINT_AUTO_FONT_SIZES[QUESTION_PRINT_AUTO_FONT_SIZES.length - 1];

	return {
		lines: wrapLine(
			text,
			Math.max(8, Math.floor(options.maxWidth / estimateCharWidth(fallbackSize)))
		),
		fontSize: fallbackSize,
		lineHeight: QUESTION_PRINT_LINE_HEIGHT,
		text
	};
};

export const calculateQuestionPrintTextLayoutClient = async (
	options: QuestionPrintTextLayoutOptions
): Promise<QuestionPrintTextLayout> => {
	const text = normalizeQuestionPrintText(options.text);
	if (!text) {
		return emptyLayout();
	}

	const { fitTextBlockClient } = await import('$lib/browser/fitTextBlockClient');
	const layout = await fitTextBlockClient({
		text,
		maxWidth: options.maxWidth,
		maxHeight: options.maxHeight,
		maxLines: options.maxLines,
		fontFamily: QUESTION_PRINT_FONT_FAMILY,
		fontSizes: QUESTION_PRINT_AUTO_FONT_SIZES,
		fontWeight: 700,
		lineHeight: QUESTION_PRINT_LINE_HEIGHT
	});

	if (layout === null) {
		return estimateQuestionPrintTextLayout(options);
	}

	return {
		lines: layout.lines,
		fontSize: layout.fontSize,
		lineHeight: layout.lineHeight,
		text
	};
};
