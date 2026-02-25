// src/routes/admin/asset-generators/zine-creator/zine-utils.ts

export type ZineFormatId = 'half' | 'quarter' | 'mini';
export type ZineSource = 'enneagram-main' | 'enneagram-mental-health' | 'personality-analysis';

export interface ZineImageAsset {
	src: string;
	alt: string;
	caption?: string;
}

export interface ZineSection {
	id: string;
	title: string;
	html: string;
	text: string;
	paragraphs: string[];
	include: boolean;
	order: number;
}

export interface ImportedZineBlog {
	source: ZineSource;
	slug: string;
	title: string;
	author: string;
	date: string;
	description: string;
	enneagram: number | null;
	sourceUrl: string;
	bodyHtml: string;
	headings: string[];
	images: ZineImageAsset[];
	sections: ZineSection[];
	pullQuotes: string[];
}

export interface ZineFormatDefinition {
	id: ZineFormatId;
	label: string;
	pageWidthIn: number;
	pageHeightIn: number;
	validPageCounts: number[];
	defaultPageCount: number;
	sheetsPerBooklet: (pages: number) => number;
}

export interface ColorScheme {
	primary: string;
	accent: string;
	background: string;
}

export interface PaginatedSectionPage {
	sectionTitle: string;
	text: string;
}

export interface PaginationOptions {
	includeInteriorImages?: boolean;
	imageFrequency?: number;
	imageOffset?: number;
	safetyFactor?: number;
}

export interface HalfSheetImposition {
	front: { left: number; right: number };
	back: { left: number; right: number };
}

export interface QuarterSheetImposition {
	front: {
		topLeft: number;
		topRight: number;
		bottomLeft: number;
		bottomRight: number;
	};
	back: {
		topLeft: number;
		topRight: number;
		bottomLeft: number;
		bottomRight: number;
	};
}

export interface MiniZineSlot {
	row: number;
	col: number;
	page: number;
	rotation: 0 | 180;
}

export const ZINE_FORMATS: Record<ZineFormatId, ZineFormatDefinition> = {
	half: {
		id: 'half',
		label: 'Half-Page (5.5" x 8.5")',
		pageWidthIn: 5.5,
		pageHeightIn: 8.5,
		validPageCounts: [8, 12, 16, 20, 24],
		defaultPageCount: 12,
		sheetsPerBooklet: (pages) => pages / 4
	},
	quarter: {
		id: 'quarter',
		label: 'Quarter-Page (4.25" x 5.5")',
		pageWidthIn: 4.25,
		pageHeightIn: 5.5,
		validPageCounts: [8, 16, 24],
		defaultPageCount: 8,
		sheetsPerBooklet: (pages) => pages / 8
	},
	mini: {
		id: 'mini',
		label: 'Mini Zine (2.75" x 4.25")',
		pageWidthIn: 2.75,
		pageHeightIn: 4.25,
		validPageCounts: [8],
		defaultPageCount: 8,
		sheetsPerBooklet: () => 1
	}
};

export const ENNEAGRAM_COLOR_SCHEMES: Record<number, ColorScheme> = {
	1: { primary: '#1e3a5f', accent: '#4a90d9', background: '#f0f4f8' },
	2: { primary: '#8b2252', accent: '#d4637a', background: '#fdf2f4' },
	3: { primary: '#b8860b', accent: '#f0c040', background: '#fffdf0' },
	4: { primary: '#4a0e4e', accent: '#9b59b6', background: '#f8f0fc' },
	5: { primary: '#1a3c34', accent: '#2e8b57', background: '#f0f8f4' },
	6: { primary: '#8b4513', accent: '#cd853f', background: '#fdf6f0' },
	7: { primary: '#cc5500', accent: '#ff8c42', background: '#fff8f0' },
	8: { primary: '#8b0000', accent: '#dc3545', background: '#fdf0f0' },
	9: { primary: '#2f4f4f', accent: '#5f9ea0', background: '#f0f8f8' }
};

const FALLBACK_COLOR_SCHEME: ColorScheme = {
	primary: '#0f172a',
	accent: '#475569',
	background: '#f8fafc'
};

const DEFAULT_PAGINATION_OPTIONS: Required<PaginationOptions> = {
	includeInteriorImages: false,
	imageFrequency: 3,
	imageOffset: 1,
	safetyFactor: 0.8
};
const MIN_CHARS_PER_SLICE = 36;
const SENTENCE_SPLIT_REGEX = /(?<=[.!?])\s+/;

export function normalizeEnneagram(value: unknown): number | null {
	if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 9) {
		return value;
	}

	if (typeof value === 'string') {
		const num = Number.parseInt(value.trim(), 10);
		if (Number.isInteger(num) && num >= 1 && num <= 9) {
			return num;
		}
	}

	return null;
}

export function getDefaultColorScheme(enneagram: number | null): ColorScheme {
	if (!enneagram) return FALLBACK_COLOR_SCHEME;
	return ENNEAGRAM_COLOR_SCHEMES[enneagram] ?? FALLBACK_COLOR_SCHEME;
}

export function getValidPageCounts(format: ZineFormatId): number[] {
	return ZINE_FORMATS[format].validPageCounts;
}

function clampNumber(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function resolvePaginationOptions(options?: PaginationOptions): Required<PaginationOptions> {
	const imageFrequency = Number.isFinite(options?.imageFrequency)
		? Math.max(1, Math.floor(options?.imageFrequency ?? DEFAULT_PAGINATION_OPTIONS.imageFrequency))
		: DEFAULT_PAGINATION_OPTIONS.imageFrequency;
	const imageOffset = Number.isFinite(options?.imageOffset)
		? Math.max(0, Math.floor(options?.imageOffset ?? DEFAULT_PAGINATION_OPTIONS.imageOffset))
		: DEFAULT_PAGINATION_OPTIONS.imageOffset;
	const safetyFactor =
		typeof options?.safetyFactor === 'number'
			? clampNumber(options.safetyFactor, 0.55, 1)
			: DEFAULT_PAGINATION_OPTIONS.safetyFactor;

	return {
		includeInteriorImages:
			options?.includeInteriorImages ?? DEFAULT_PAGINATION_OPTIONS.includeInteriorImages,
		imageFrequency,
		imageOffset,
		safetyFactor
	};
}

function shouldReserveImageSpace(
	pageIndex: number,
	options: Required<PaginationOptions>
): boolean {
	if (!options.includeInteriorImages) return false;
	return pageIndex % options.imageFrequency === options.imageOffset % options.imageFrequency;
}

function pageCharBudget(
	pageIndex: number,
	format: ZineFormatId,
	bodyFontSizePt: 9 | 10 | 11,
	options: Required<PaginationOptions>
): number {
	const hasImage = shouldReserveImageSpace(pageIndex, options);
	const rawBudget = estimateCharsPerPage(format, bodyFontSizePt, hasImage);
	return Math.max(140, Math.floor(rawBudget * options.safetyFactor));
}

function takeTextSlice(input: string, maxChars: number): { chunk: string; remainder: string } {
	const text = input.trim();
	if (!text) return { chunk: '', remainder: '' };

	if (text.length <= maxChars) {
		return { chunk: text, remainder: '' };
	}

	if (maxChars <= 12) {
		return {
			chunk: text.slice(0, maxChars),
			remainder: text.slice(maxChars).trimStart()
		};
	}

	let cutAt = text.lastIndexOf(' ', maxChars);
	if (cutAt < Math.floor(maxChars * 0.45)) {
		cutAt = maxChars;
	}

	const chunk = text.slice(0, cutAt).trimEnd();
	const remainder = text.slice(cutAt).trimStart();

	if (!chunk) {
		return {
			chunk: text.slice(0, maxChars),
			remainder: text.slice(maxChars).trimStart()
		};
	}

	return { chunk, remainder };
}

function getSourceParagraphs(section: Pick<ZineSection, 'paragraphs' | 'text'>): string[] {
	if (section.paragraphs?.length) {
		return section.paragraphs;
	}

	if (!section.text) {
		return [];
	}

	return section.text.split(SENTENCE_SPLIT_REGEX);
}

export function estimateCharsPerPage(
	format: ZineFormatId,
	bodyFontSizePt: 9 | 10 | 11,
	hasInteriorImage = false
): number {
	const base = format === 'half' ? 2200 : format === 'quarter' ? 1100 : 550;

	const fontMultiplier = bodyFontSizePt === 9 ? 1.14 : bodyFontSizePt === 11 ? 0.86 : 1;
	const imageMultiplier = format === 'half' ? 0.62 : format === 'quarter' ? 0.58 : 0.52;
	const imageAdjustment = hasInteriorImage ? imageMultiplier : 1;

	return Math.max(hasInteriorImage ? 140 : 250, Math.floor(base * fontMultiplier * imageAdjustment));
}

export function estimateTotalPages(
	sections: Array<Pick<ZineSection, 'text'>>,
	format: ZineFormatId,
	bodyFontSizePt: 9 | 10 | 11,
	options?: PaginationOptions
): number {
	const resolvedOptions = resolvePaginationOptions(options);
	const chars = sections.reduce((sum, section) => sum + (section.text?.length ?? 0), 0);
	let remainingChars = Math.max(0, chars);
	let contentPages = 0;

	while (remainingChars > 0 && contentPages < 2000) {
		remainingChars -= pageCharBudget(contentPages, format, bodyFontSizePt, resolvedOptions);
		contentPages += 1;
	}

	contentPages = Math.max(1, contentPages);
	return contentPages + 2;
}

export function recommendPageCount(format: ZineFormatId, estimatedPages: number): number {
	const valid = getValidPageCounts(format);
	if (valid.length === 1) return valid[0];

	let best = valid[0];
	let bestDistance = Math.abs(best - estimatedPages);

	for (const candidate of valid) {
		const distance = Math.abs(candidate - estimatedPages);
		if (distance < bestDistance || (distance === bestDistance && candidate > best)) {
			best = candidate;
			bestDistance = distance;
		}
	}

	return best;
}

export function paginateSections(
	sections: Array<Pick<ZineSection, 'title' | 'paragraphs' | 'text'>>,
	format: ZineFormatId,
	bodyFontSizePt: 9 | 10 | 11,
	options?: PaginationOptions
): PaginatedSectionPage[] {
	const resolvedOptions = resolvePaginationOptions(options);
	const pages: PaginatedSectionPage[] = [];
	let pageIndex = 0;

	for (const section of sections) {
		const paragraphs = getSourceParagraphs(section)
			.map((entry) => entry.replace(/\s+/g, ' ').trim())
			.filter(Boolean);

		if (paragraphs.length === 0) continue;

		let bufferParts: string[] = [];
		let bufferChars = 0;

		const flushBuffer = () => {
			if (bufferParts.length === 0) return;
			pages.push({
				sectionTitle: section.title,
				text: bufferParts.join('\n\n').trim()
			});
			pageIndex += 1;
			bufferParts = [];
			bufferChars = 0;
		};

		for (const paragraph of paragraphs) {
			let remainingParagraph = paragraph;
			while (remainingParagraph) {
				const maxChars = pageCharBudget(pageIndex, format, bodyFontSizePt, resolvedOptions);
				const separatorChars = bufferParts.length > 0 ? 2 : 0;
				const availableChars = maxChars - bufferChars - separatorChars;

				if (availableChars < MIN_CHARS_PER_SLICE) {
					flushBuffer();
					continue;
				}

				const { chunk, remainder } = takeTextSlice(remainingParagraph, availableChars);
				if (!chunk) {
					flushBuffer();
					continue;
				}

				bufferParts.push(chunk);
				bufferChars += chunk.length + separatorChars;
				remainingParagraph = remainder;

				if (remainingParagraph) {
					flushBuffer();
				}
			}
		}

		flushBuffer();
	}

	if (pages.length === 0) {
		pages.push({ sectionTitle: 'Overview', text: '' });
	}

	return pages;
}

export function generateHalfPageImposition(totalPages: number): HalfSheetImposition[] {
	if (totalPages % 4 !== 0) {
		throw new Error(
			`Half-page imposition requires page count divisible by 4. Received ${totalPages}.`
		);
	}

	const sheets: HalfSheetImposition[] = [];
	for (let i = 0; i < totalPages / 4; i++) {
		sheets.push({
			front: { left: totalPages - 2 * i, right: 2 * i + 1 },
			back: { left: 2 * i + 2, right: totalPages - 2 * i - 1 }
		});
	}

	return sheets;
}

export function generateQuarterPageImposition(totalPages: number): QuarterSheetImposition[] {
	if (totalPages % 8 !== 0) {
		throw new Error(
			`Quarter-page imposition requires page count divisible by 8. Received ${totalPages}.`
		);
	}

	const sheets: QuarterSheetImposition[] = [];
	for (let i = 0; i < totalPages / 8; i++) {
		sheets.push({
			front: {
				topLeft: totalPages - 4 * i,
				topRight: 4 * i + 1,
				bottomLeft: totalPages - 4 * i - 2,
				bottomRight: 4 * i + 3
			},
			back: {
				topLeft: 4 * i + 2,
				topRight: totalPages - 4 * i - 1,
				bottomLeft: 4 * i + 4,
				bottomRight: totalPages - 4 * i - 3
			}
		});
	}

	return sheets;
}

export function getMiniZineLayout(): MiniZineSlot[] {
	return [
		{ row: 0, col: 0, page: 8, rotation: 180 },
		{ row: 0, col: 1, page: 1, rotation: 0 },
		{ row: 0, col: 2, page: 2, rotation: 0 },
		{ row: 0, col: 3, page: 7, rotation: 180 },
		{ row: 1, col: 0, page: 5, rotation: 180 },
		{ row: 1, col: 1, page: 4, rotation: 0 },
		{ row: 1, col: 2, page: 3, rotation: 0 },
		{ row: 1, col: 3, page: 6, rotation: 180 }
	];
}

export function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}
