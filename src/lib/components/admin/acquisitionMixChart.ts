// src/lib/components/admin/acquisitionMixChart.ts
export interface AcquisitionMixRow {
	cohort_week: string;
	acquisition_source: string;
	new_visitors: number;
}

export interface AcquisitionSourceSummary {
	key: string;
	label: string;
	shortLabel: string;
	count: number;
	sharePct: number;
	color: string;
	weeksActive: number;
}

export interface AcquisitionWeekSegment {
	key: string;
	label: string;
	shortLabel: string;
	count: number;
	sharePct: number;
	color: string;
}

export interface AcquisitionWeekChartRow {
	cohortWeek: string;
	total: number;
	dominantLabel: string;
	dominantSharePct: number;
	segments: AcquisitionWeekSegment[];
}

export interface AcquisitionMixChartData {
	totalVisitors: number;
	totalSources: number;
	rolledUpSourceCount: number;
	leadSource: AcquisitionSourceSummary | null;
	sources: AcquisitionSourceSummary[];
	weeks: AcquisitionWeekChartRow[];
}

const OTHER_GROUP_KEY = '__other_group__';
const MAX_VISIBLE_SOURCES = 8;
const ACQUISITION_COLORS = [
	'var(--primary)',
	'#7dd3fc',
	'#fbbf24',
	'#fdba74',
	'#86efac',
	'#fca5a5',
	'#67e8f9',
	'#f9a8d4'
];

const SPECIAL_LABELS: Record<string, string> = {
	x: 'X',
	youtube: 'YouTube',
	linkedin: 'LinkedIn',
	duckduckgo: 'DuckDuckGo',
	substack: 'Substack',
	tiktok: 'TikTok'
};

function formatBrand(value: string): string {
	const normalized = value.trim().toLowerCase();
	if (!normalized) return 'Unknown';
	if (SPECIAL_LABELS[normalized]) return SPECIAL_LABELS[normalized];

	return normalized
		.split(/[-_ ]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function formatAcquisitionSourceLabel(source: string): string {
	const normalized = source.trim().toLowerCase();
	if (!normalized) return 'Direct';
	if (normalized === 'direct') return 'Direct';
	if (normalized === 'internal') return 'Internal';
	if (normalized === 'other') return 'Other';
	if (normalized === OTHER_GROUP_KEY) return 'Other';
	if (normalized === 'email') return 'Email';

	const [channel, detail] = normalized.split('/');
	if (!detail) {
		return formatBrand(channel);
	}

	if (channel === 'search') {
		return `${formatBrand(detail)} Search`;
	}
	if (channel === 'paid') {
		return `${formatBrand(detail)} Ads`;
	}
	if (channel === 'social') {
		return formatBrand(detail);
	}
	if (channel === 'email') {
		return `${formatBrand(detail)} Email`;
	}

	return normalized.split('/').map(formatBrand).join(' / ');
}

export function formatAcquisitionSourceShortLabel(source: string): string {
	const normalized = source.trim().toLowerCase();
	if (!normalized || normalized === OTHER_GROUP_KEY) return 'Other';
	if (normalized === 'direct') return 'Direct';
	if (normalized === 'internal') return 'Internal';
	if (normalized === 'other') return 'Other';
	if (normalized === 'email') return 'Email';

	const [channel, detail] = normalized.split('/');
	if (!detail) {
		return formatBrand(channel);
	}

	if (channel === 'paid') {
		return `${formatBrand(detail)} Ads`;
	}

	return formatBrand(detail);
}

export function buildAcquisitionMixChart(rows: AcquisitionMixRow[]): AcquisitionMixChartData {
	const totalsBySource = new Map<string, number>();
	const weeksBySource = new Map<string, Map<string, number>>();
	let totalVisitors = 0;

	for (const row of rows) {
		const sourceKey = row.acquisition_source?.trim() || 'direct';
		const count = Number(row.new_visitors || 0);
		totalVisitors += count;
		totalsBySource.set(sourceKey, (totalsBySource.get(sourceKey) ?? 0) + count);

		const weekKey = row.cohort_week;
		if (!weeksBySource.has(weekKey)) {
			weeksBySource.set(weekKey, new Map<string, number>());
		}

		const sourceCounts = weeksBySource.get(weekKey)!;
		sourceCounts.set(sourceKey, (sourceCounts.get(sourceKey) ?? 0) + count);
	}

	const rankedSources = [...totalsBySource.entries()]
		.map(([key, count]) => ({ key, count }))
		.sort((left, right) => right.count - left.count || left.key.localeCompare(right.key));

	const visibleSourceGroups =
		rankedSources.length > MAX_VISIBLE_SOURCES
			? [
					...rankedSources
						.slice(0, MAX_VISIBLE_SOURCES - 1)
						.map((source) => ({ key: source.key, count: source.count, rawKeys: [source.key] })),
					{
						key: OTHER_GROUP_KEY,
						count: rankedSources
							.slice(MAX_VISIBLE_SOURCES - 1)
							.reduce((sum, source) => sum + source.count, 0),
						rawKeys: rankedSources.slice(MAX_VISIBLE_SOURCES - 1).map((source) => source.key)
					}
				]
			: rankedSources.map((source) => ({
					key: source.key,
					count: source.count,
					rawKeys: [source.key]
				}));

	const sourceLookup = new Map<string, string>();
	for (const source of visibleSourceGroups) {
		for (const rawKey of source.rawKeys) {
			sourceLookup.set(rawKey, source.key);
		}
	}

	const weeksActiveByKey = new Map<string, number>();
	const sources = visibleSourceGroups.map((source, index) => ({
		key: source.key,
		label: formatAcquisitionSourceLabel(source.key),
		shortLabel: formatAcquisitionSourceShortLabel(source.key),
		count: source.count,
		sharePct: totalVisitors > 0 ? (source.count / totalVisitors) * 100 : 0,
		color: ACQUISITION_COLORS[index % ACQUISITION_COLORS.length],
		weeksActive: 0
	}));

	const weeks = [...weeksBySource.entries()]
		.sort(([leftWeek], [rightWeek]) => leftWeek.localeCompare(rightWeek))
		.map(([cohortWeek, sourceCounts]) => {
			const total = [...sourceCounts.values()].reduce((sum, count) => sum + count, 0);
			const groupedCounts = new Map<string, number>();

			for (const [rawKey, count] of sourceCounts) {
				const visibleKey = sourceLookup.get(rawKey) ?? rawKey;
				groupedCounts.set(visibleKey, (groupedCounts.get(visibleKey) ?? 0) + count);
			}

			const segments = sources
				.map((source) => {
					const count = groupedCounts.get(source.key) ?? 0;
					if (count > 0) {
						weeksActiveByKey.set(source.key, (weeksActiveByKey.get(source.key) ?? 0) + 1);
					}

					return {
						key: source.key,
						label: source.label,
						shortLabel: source.shortLabel,
						count,
						sharePct: total > 0 ? (count / total) * 100 : 0,
						color: source.color
					};
				})
				.filter((segment) => segment.count > 0);

			const dominantSegment = segments.reduce<AcquisitionWeekSegment | null>((best, segment) => {
				if (!best || segment.count > best.count) {
					return segment;
				}
				return best;
			}, null);

			return {
				cohortWeek,
				total,
				dominantLabel: dominantSegment?.label ?? 'No data',
				dominantSharePct: dominantSegment?.sharePct ?? 0,
				segments
			};
		});

	for (const source of sources) {
		source.weeksActive = weeksActiveByKey.get(source.key) ?? 0;
	}

	return {
		totalVisitors,
		totalSources: rankedSources.length,
		rolledUpSourceCount:
			rankedSources.length > MAX_VISIBLE_SOURCES
				? rankedSources.length - (MAX_VISIBLE_SOURCES - 1)
				: 0,
		leadSource: sources[0] ?? null,
		sources,
		weeks
	};
}
