// src/lib/server/adminAnalytics.spec.ts
import { describe, expect, it } from 'vitest';

import {
	buildEnneagramDistribution,
	countUniqueContributors,
	getContributorKey
} from './adminAnalytics';

describe('adminAnalytics', () => {
	it('prefers authenticated ids over anonymous identifiers', () => {
		expect(
			getContributorKey({
				author_id: 'user-1',
				fingerprint: 'fp-1',
				ip: '127.0.0.1'
			})
		).toBe('user:user-1');
	});

	it('falls back to fingerprint and then ip for anonymous contributors', () => {
		expect(getContributorKey({ fingerprint: 'fp-1', ip: '127.0.0.1' })).toBe('fingerprint:fp-1');
		expect(getContributorKey({ ip: '127.0.0.1' })).toBe('ip:127.0.0.1');
	});

	it('counts unique contributors across mixed logged-in and anonymous records', () => {
		expect(
			countUniqueContributors([
				{ author_id: 'user-1', fingerprint: 'fp-a' },
				{ author_id: 'user-1', fingerprint: 'fp-b' },
				{ fingerprint: 'fp-c' },
				{ fingerprint: 'fp-c', ip: '127.0.0.1' },
				{ ip: '127.0.0.2' }
			])
		).toBe(3);
	});

	it('normalizes database enneagram distribution rows for chart consumption', () => {
		expect(
			buildEnneagramDistribution([
				{ enneagram: '1', user_count: 3 },
				{ enneagram: 2, user_count: '4' },
				{ enneagram: 'unknown', user_count: 10 },
				{ enneagram: '3', count: 2 },
				{ enneagram: '4', user_count: 'not-a-number' }
			])
		).toEqual({
			'1': 3,
			'2': 4,
			'3': 2,
			'4': 0
		});
	});
});
