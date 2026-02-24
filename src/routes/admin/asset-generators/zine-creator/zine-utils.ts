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

export function estimateCharsPerPage(format: ZineFormatId, bodyFontSizePt: 9 | 10 | 11): number {
	const base = format === 'half' ? 2200 : format === 'quarter' ? 1100 : 550;

	const fontMultiplier = bodyFontSizePt === 9 ? 1.14 : bodyFontSizePt === 11 ? 0.86 : 1;
	return Math.max(250, Math.floor(base * fontMultiplier));
}

export function estimateTotalPages(
	sections: Array<Pick<ZineSection, 'text'>>,
	format: ZineFormatId,
	bodyFontSizePt: 9 | 10 | 11
): number {
	const chars = sections.reduce((sum, section) => sum + (section.text?.length ?? 0), 0);
	const contentPages = Math.max(1, Math.ceil(chars / estimateCharsPerPage(format, bodyFontSizePt)));
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
	bodyFontSizePt: 9 | 10 | 11
): PaginatedSectionPage[] {
	const maxChars = estimateCharsPerPage(format, bodyFontSizePt);
	const pages: PaginatedSectionPage[] = [];

	for (const section of sections) {
		const sourceParagraphs = section.paragraphs?.length
			? section.paragraphs
			: section.text
				? section.text.split(/(?<=[.!?])\s+/)
				: [];
		const paragraphs = sourceParagraphs.map((p) => p.trim()).filter(Boolean);

		if (paragraphs.length === 0) continue;

		let buffer = '';
		for (const paragraph of paragraphs) {
			const chunk = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
			if (chunk.length > maxChars && buffer) {
				pages.push({ sectionTitle: section.title, text: buffer });
				buffer = paragraph;
			} else {
				buffer = chunk;
			}
		}

		if (buffer) {
			pages.push({ sectionTitle: section.title, text: buffer });
		}
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
