// src/routes/api/cta-event/cta-event.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { recordCtaExperimentEventMock } = vi.hoisted(() => ({
	recordCtaExperimentEventMock: vi.fn()
}));

vi.mock('$lib/server/ctaExperiments', () => ({
	recordCtaExperimentEvent: recordCtaExperimentEventMock
}));
vi.mock('$env/dynamic/private', () => ({ env: {} }));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: vi.fn() }));
vi.mock('$lib/email/sender', () => ({ sendEmail: vi.fn() }));
vi.mock('$lib/utils/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() } }));

import { POST } from './+server';
import { BETA_CARD_EXPERIMENT, BETA_CARD_VARIANTS } from '$lib/utils/betaCardCopy';
import { TALK_SITUATIONS_EXPERIMENT } from '$lib/utils/talkSituations';

const BROWSER_UA =
	'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';

function call(body: unknown, userAgent = BROWSER_UA) {
	return POST({
		request: new Request('http://localhost/api/cta-event', {
			method: 'POST',
			headers: { 'content-type': 'application/json', 'user-agent': userAgent },
			body: JSON.stringify(body)
		}),
		cookies: { get: () => 'fp-9' }
	} as unknown as Parameters<typeof POST>[0]);
}

const valid = {
	experiment: BETA_CARD_EXPERIMENT,
	variant: BETA_CARD_VARIANTS[0].id,
	event: 'viewed',
	surface: 'celebrity',
	placement: 'inline',
	sourcePath: '/personality-analysis/taylor-swift'
};

describe('POST /api/cta-event', () => {
	beforeEach(() => vi.clearAllMocks());

	it('records a view with the visitor fingerprint and never caches', async () => {
		const response = await call(valid);

		expect(response.status).toBe(204);
		expect(response.headers.get('cache-control')).toContain('no-store');
		expect(recordCtaExperimentEventMock).toHaveBeenCalledWith(
			expect.objectContaining({ event: 'viewed', fingerprint: 'fp-9', surface: 'celebrity' })
		);
	});

	it('records a tap on a /book-session situation door', async () => {
		const door = {
			experiment: TALK_SITUATIONS_EXPERIMENT,
			variant: 'fight',
			event: 'opened',
			surface: 'book_session',
			placement: 'door',
			sourcePath: '/book-session'
		};

		expect((await call(door)).status).toBe(204);
		expect(recordCtaExperimentEventMock).toHaveBeenCalledWith(
			expect.objectContaining({ experiment: TALK_SITUATIONS_EXPERIMENT, variant: 'fight' })
		);

		vi.clearAllMocks();
		expect((await call({ ...door, variant: 'made-up' })).status).toBe(400);
		expect((await call({ ...door, event: 'submitted' })).status).toBe(400);
		expect((await call({ ...door, variant: BETA_CARD_VARIANTS[0].id })).status).toBe(400);
		expect(recordCtaExperimentEventMock).not.toHaveBeenCalled();
	});

	it('refuses submits from the browser: only the signup endpoint writes those', async () => {
		expect((await call({ ...valid, event: 'submitted' })).status).toBe(400);
		expect(recordCtaExperimentEventMock).not.toHaveBeenCalled();
	});

	it('rejects unknown experiments and variants', async () => {
		expect((await call({ ...valid, experiment: 'other' })).status).toBe(400);
		expect((await call({ ...valid, variant: 'made_up' })).status).toBe(400);
		expect(recordCtaExperimentEventMock).not.toHaveBeenCalled();
	});

	it('ignores crawlers without telling them', async () => {
		const response = await call(valid, 'Mozilla/5.0 (compatible; Googlebot/2.1)');

		expect(response.status).toBe(204);
		expect(recordCtaExperimentEventMock).not.toHaveBeenCalled();
	});
});
