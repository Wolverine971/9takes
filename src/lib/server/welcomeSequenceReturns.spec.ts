// src/lib/server/welcomeSequenceReturns.spec.ts
import { describe, expect, it } from 'vitest';

import { buildReturnVisitsByUser } from './welcomeSequenceReturns';

describe('buildReturnVisitsByUser', () => {
	it('includes direct authenticated sessions', () => {
		const result = buildReturnVisitsByUser(
			[
				{
					id: 'session-1',
					user_id: 'user-1',
					fingerprint: 'fp-1',
					last_seen_at: '2026-04-07T10:00:00.000Z'
				}
			],
			[]
		);

		expect(result).toEqual({
			'user-1': {
				last_visit: '2026-04-07T10:00:00.000Z',
				session_count: 1
			}
		});
	});

	it('attributes anonymous sessions to the known browser fingerprint owner', () => {
		const result = buildReturnVisitsByUser(
			[
				{
					id: 'session-1',
					user_id: 'user-1',
					fingerprint: 'fp-1',
					last_seen_at: '2026-04-07T10:00:00.000Z'
				}
			],
			[
				{
					id: 'session-2',
					user_id: null,
					fingerprint: 'fp-1',
					last_seen_at: '2026-04-08T10:00:00.000Z'
				}
			]
		);

		expect(result['user-1']).toEqual({
			last_visit: '2026-04-08T10:00:00.000Z',
			session_count: 2
		});
	});

	it('does not attribute shared fingerprints across multiple users', () => {
		const result = buildReturnVisitsByUser(
			[
				{
					id: 'session-1',
					user_id: 'user-1',
					fingerprint: 'shared-fp',
					last_seen_at: '2026-04-07T10:00:00.000Z'
				},
				{
					id: 'session-2',
					user_id: 'user-2',
					fingerprint: 'shared-fp',
					last_seen_at: '2026-04-07T11:00:00.000Z'
				}
			],
			[
				{
					id: 'session-3',
					user_id: null,
					fingerprint: 'shared-fp',
					last_seen_at: '2026-04-08T10:00:00.000Z'
				}
			]
		);

		expect(result['user-1']).toEqual({
			last_visit: '2026-04-07T10:00:00.000Z',
			session_count: 1
		});
		expect(result['user-2']).toEqual({
			last_visit: '2026-04-07T11:00:00.000Z',
			session_count: 1
		});
	});
});
