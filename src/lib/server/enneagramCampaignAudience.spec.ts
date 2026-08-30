// src/lib/server/enneagramCampaignAudience.spec.ts
import { describe, expect, it } from 'vitest';
import type { User } from '@supabase/supabase-js';

import {
	buildEnneagramCampaignAudience,
	hasValidEnneagramType,
	type EnneagramCampaignProfile
} from './enneagramCampaignAudience';

const NOW = new Date('2026-08-12T12:00:00.000Z');

function profile(
	id: string,
	overrides: Partial<EnneagramCampaignProfile> = {}
): EnneagramCampaignProfile {
	return {
		id,
		email: `${id}@example.com`,
		first_name: id,
		last_name: null,
		username: null,
		enneagram: 'unknown',
		created_at: '2025-01-01T00:00:00.000Z',
		admin: false,
		...overrides
	};
}

function authUser(id: string, confirmed = true): User {
	return {
		id,
		aud: 'authenticated',
		role: 'authenticated',
		email: `${id}@example.com`,
		email_confirmed_at: confirmed ? '2025-01-01T00:00:00.000Z' : undefined,
		phone: '',
		confirmed_at: confirmed ? '2025-01-01T00:00:00.000Z' : undefined,
		last_sign_in_at: '',
		app_metadata: {},
		user_metadata: {},
		identities: [],
		created_at: '2025-01-01T00:00:00.000Z',
		updated_at: '2025-01-01T00:00:00.000Z',
		is_anonymous: false
	};
}

describe('Enneagram campaign audience', () => {
	it('treats only the digits 1 through 9 as completed types', () => {
		expect(hasValidEnneagramType('5')).toBe(true);
		expect(hasValidEnneagramType(' 9 ')).toBe(true);
		expect(hasValidEnneagramType('unknown')).toBe(false);
		expect(hasValidEnneagramType('')).toBe(false);
		expect(hasValidEnneagramType(null)).toBe(false);
	});

	it('builds a mutually exclusive, safety-first campaign audience', () => {
		const profiles = [
			profile('ready'),
			profile('typed', { enneagram: '4' }),
			profile('suppressed'),
			profile('unconfirmed'),
			profile('admin', { admin: true }),
			profile('recent', { created_at: '2026-08-10T00:00:00.000Z' }),
			profile('sequenced'),
			profile('recent-email'),
			profile('invalid', { email: 'not-an-email' }),
			profile('duplicate-a', { email: 'duplicate@example.com' }),
			profile('duplicate-b', {
				email: 'DUPLICATE@example.com',
				created_at: '2024-01-01T00:00:00.000Z'
			})
		];
		const authUsers = profiles.map((row) => authUser(row.id, row.id !== 'unconfirmed'));

		const result = buildEnneagramCampaignAudience({
			profiles,
			authUsers,
			unsubscribes: [{ email: 'SUPPRESSED@example.com' }],
			legacyOptOuts: [],
			sequenceEnrollments: [{ user_id: 'sequenced', status: 'active' }],
			emailSends: [
				{ recipient_email: 'recent-email@example.com', sent_at: '2026-08-10T12:00:00.000Z' },
				{ recipient_email: 'ready@example.com', sent_at: '2026-08-05T12:00:00.000Z' }
			],
			now: NOW
		});

		expect(result.totalProfiles).toBe(11);
		expect(result.totalWithType).toBe(1);
		expect(result.totalMissingType).toBe(10);
		expect(result.counts).toEqual({
			ready: 2,
			suppressed: 1,
			unconfirmed: 1,
			admin: 1,
			recent: 1,
			active_sequence: 1,
			recent_email: 1,
			invalid_email: 1,
			duplicate_email: 1
		});
		expect(result.totalHeld).toBe(8);
		expect(result.rows.find((row) => row.id === 'recent-email')).toMatchObject({
			status: 'recent_email',
			lastEmailSentAt: '2026-08-10T12:00:00.000Z'
		});
		expect(result.rows.find((row) => row.id === 'ready')?.status).toBe('ready');
		expect(result.rows.find((row) => row.id === 'duplicate-b')?.status).toBe('duplicate_email');
	});
});
