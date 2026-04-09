// src/lib/server/retentionAnalytics.spec.ts
import { describe, expect, it } from 'vitest';

import { filterOverviewByEntrySurface } from './retentionAnalytics';

describe('filterOverviewByEntrySurface', () => {
	const overviewRows = [
		{ entry_surface: 'home', new_visitors: 120 },
		{ entry_surface: 'community', new_visitors: 48 },
		{ entry_surface: 'guides', new_visitors: 16 }
	];

	it('returns all rows when no entry-surface filter is provided', () => {
		expect(filterOverviewByEntrySurface(overviewRows, '')).toEqual(overviewRows);
		expect(filterOverviewByEntrySurface(overviewRows, null)).toEqual(overviewRows);
	});

	it('returns only the matching entry-surface row when a filter is provided', () => {
		expect(filterOverviewByEntrySurface(overviewRows, 'community')).toEqual([
			{ entry_surface: 'community', new_visitors: 48 }
		]);
	});

	it('normalizes whitespace and casing on the selected entry surface', () => {
		expect(filterOverviewByEntrySurface(overviewRows, '  HOME  ')).toEqual([
			{ entry_surface: 'home', new_visitors: 120 }
		]);
	});
});
