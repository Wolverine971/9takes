// src/routes/admin/enneagram-campaign/enneagram-campaign.page.spec.ts
// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { invalidateMock } = vi.hoisted(() => ({
	invalidateMock: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('$app/navigation', () => ({ invalidate: invalidateMock }));

import EnneagramCampaignPage from './+page.svelte';

const audience = {
	rows: [
		{
			id: 'p1',
			email: 'ready@example.com',
			name: 'Ready Person',
			createdAt: '2025-01-01T00:00:00.000Z',
			storedEnneagram: null,
			lastEmailSentAt: null,
			status: 'ready',
			statusLabel: 'Ready now'
		}
	],
	counts: {
		ready: 1,
		suppressed: 0,
		unconfirmed: 0,
		admin: 0,
		recent: 0,
		active_sequence: 0,
		errored_sequence: 0,
		recent_email: 0,
		invalid_email: 0,
		duplicate_email: 0
	},
	totalProfiles: 5,
	totalWithType: 4,
	totalMissingType: 1,
	totalHeld: 0
};

function pageData(audienceValue: unknown) {
	return {
		audience: audienceValue,
		delivery: { configured: true, blockers: [], stoppedEnrollments: 0, provider: 'gmail' },
		sequence: { status: 'draft' },
		sequenceLoadError: null,
		campaign: { subject: 'Add your type', preheader: 'One tap' },
		previewHtml: '<p>preview</p>'
	} as any;
}

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

describe('/admin/enneagram-campaign page', () => {
	it('renders the shell with a skeleton and requests the audience after a full load', () => {
		render(EnneagramCampaignPage, { data: pageData(null) });

		expect(screen.getByRole('heading', { name: 'Enneagram Type Campaign' })).toBeTruthy();
		expect(screen.getByText('Loading profiles…')).toBeTruthy();
		expect(invalidateMock).toHaveBeenCalledWith('admin:enneagram-campaign-audience');
	});

	it('fills in the audience when the streamed promise resolves', async () => {
		render(EnneagramCampaignPage, { data: pageData(Promise.resolve(audience)) });

		expect(await screen.findByText('1 profiles')).toBeTruthy();
		expect(screen.getByText('Ready Person')).toBeTruthy();
		expect(invalidateMock).not.toHaveBeenCalled();
	});

	it('fails closed when the audience lookup rejects', async () => {
		const failed = Promise.reject({ message: 'Email suppression lookup failed' });
		render(EnneagramCampaignPage, { data: pageData(failed) });

		expect(await screen.findByText('Audience unavailable', { selector: 'h2' })).toBeTruthy();
		expect(screen.queryByText('Ready Person')).toBeNull();
	});
});
