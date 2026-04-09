// src/lib/server/retentionAnalytics.ts
export interface EntrySurfaceOverviewRow {
	entry_surface: string;
}

function normalizeEntrySurface(value: string | null | undefined): string {
	return value?.trim().toLowerCase() ?? '';
}

export function filterOverviewByEntrySurface<T extends EntrySurfaceOverviewRow>(
	rows: T[],
	entrySurface: string | null | undefined
): T[] {
	const normalizedEntrySurface = normalizeEntrySurface(entrySurface);
	if (!normalizedEntrySurface) {
		return rows;
	}

	return rows.filter((row) => normalizeEntrySurface(row.entry_surface) === normalizedEntrySurface);
}
