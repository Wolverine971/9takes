// src/lib/browser/fitTextBlockClient.ts
export interface FitTextBlockOptions {
	text: string;
	maxWidth: number;
	maxHeight: number;
	fontFamily: string;
	fontSizes: number[];
	fontWeight?: number | string;
	fontStyle?: string;
	lineHeight?: number;
	maxLines?: number;
	whiteSpace?: 'normal' | 'pre-wrap';
}

export interface FitTextBlockResult {
	lines: string[];
	fontSize: number;
	lineHeight: number;
	lineHeightPx: number;
	lineCount: number;
	width: number;
	height: number;
}

type PretextModule = typeof import('@chenglou/pretext');

let pretextPromise: Promise<PretextModule> | null = null;

const loadPretext = async (): Promise<PretextModule> => {
	if (pretextPromise === null) {
		pretextPromise = import('@chenglou/pretext');
	}

	return pretextPromise;
};

const normalizeFontSizes = (fontSizes: number[]): number[] =>
	[...new Set(fontSizes.filter((value) => Number.isFinite(value) && value > 0))]
		.map((value) => Math.round(value))
		.sort((a, b) => b - a);

const buildCanvasFont = ({
	fontFamily,
	fontSize,
	fontStyle,
	fontWeight
}: {
	fontFamily: string;
	fontSize: number;
	fontStyle?: string;
	fontWeight?: number | string;
}): string => [fontStyle, fontWeight, `${fontSize}px`, fontFamily].filter(Boolean).join(' ');

export async function fitTextBlockClient(
	options: FitTextBlockOptions
): Promise<FitTextBlockResult | null> {
	if (typeof document === 'undefined') {
		return null;
	}

	const text = options.text.trim();
	const fontSizes = normalizeFontSizes(options.fontSizes);

	if (
		!text ||
		!fontSizes.length ||
		!Number.isFinite(options.maxWidth) ||
		!Number.isFinite(options.maxHeight) ||
		options.maxWidth <= 0 ||
		options.maxHeight <= 0
	) {
		return null;
	}

	try {
		await document.fonts?.ready;
	} catch {
		// Ignore font loading failures and fall back to the best effort layout.
	}

	try {
		const { layoutWithLines, prepareWithSegments } = await loadPretext();
		let fallbackResult: FitTextBlockResult | null = null;

		for (const fontSize of fontSizes) {
			const lineHeight = options.lineHeight ?? 1.2;
			const lineHeightPx = fontSize * lineHeight;
			const prepared = prepareWithSegments(
				text,
				buildCanvasFont({
					fontFamily: options.fontFamily,
					fontSize,
					fontStyle: options.fontStyle,
					fontWeight: options.fontWeight
				}),
				options.whiteSpace ? { whiteSpace: options.whiteSpace } : undefined
			);
			const layout = layoutWithLines(prepared, options.maxWidth, lineHeightPx);
			const result: FitTextBlockResult = {
				lines: layout.lines.map((line) => line.text),
				fontSize,
				lineHeight,
				lineHeightPx,
				lineCount: layout.lineCount,
				width: layout.lines.reduce((maxWidth, line) => Math.max(maxWidth, line.width), 0),
				height: layout.height
			};

			fallbackResult = result;

			if (
				result.height <= options.maxHeight &&
				(options.maxLines === undefined || result.lineCount <= options.maxLines)
			) {
				return result;
			}
		}

		return fallbackResult;
	} catch {
		return null;
	}
}
