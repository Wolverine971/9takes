import { describe, expect, it } from 'vitest';
import { buildAdminDataStatus } from './adminDataStatus';

describe('buildAdminDataStatus', () => {
	it('reports a complete dashboard when every source succeeds', () => {
		expect(
			buildAdminDataStatus(
				[
					{ key: 'users', label: 'User totals', error: null },
					{ key: 'activity', label: 'Recent activity', error: undefined }
				],
				'2026-07-09T12:00:00.000Z'
			)
		).toEqual({
			state: 'complete',
			generatedAt: '2026-07-09T12:00:00.000Z',
			warnings: []
		});
	});

	it('identifies failed sources without exposing database errors to the browser', () => {
		expect(
			buildAdminDataStatus(
				[
					{ key: 'users', label: 'User totals', error: new Error('database credentials') },
					{ key: 'activity', label: 'Recent activity', error: null }
				],
				'2026-07-09T12:00:00.000Z'
			)
		).toEqual({
			state: 'degraded',
			generatedAt: '2026-07-09T12:00:00.000Z',
			warnings: [{ key: 'users', label: 'User totals' }]
		});
	});
});
