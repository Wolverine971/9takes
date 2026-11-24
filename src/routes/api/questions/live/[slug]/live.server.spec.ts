// src/routes/api/questions/live/[slug]/live.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { postLiveTakeMock, loadLiveTakeMock, getLiveTakeTypesMock } = vi.hoisted(() => ({
	postLiveTakeMock: vi.fn(),
	loadLiveTakeMock: vi.fn(),
	getLiveTakeTypesMock: vi.fn()
}));

vi.mock('$lib/server/liveTakeAnswer', () => ({ postLiveTake: postLiveTakeMock }));
vi.mock('$lib/server/homepageLiveTake', () => ({ loadLiveTake: loadLiveTakeMock }));
vi.mock('$lib/server/homepageLiveTypes', () => ({ getLiveTakeTypes: getLiveTakeTypesMock }));

import { GET, POST } from './+server';

const SLUG = 'whats-your-biggest-fear';
const LIVE = { questionId: 9, slug: SLUG, title: 'What’s your biggest fear?', answered: false };

function event(options: { slug?: string; from?: string; body?: unknown; method?: string }) {
	const url = new URL(`http://localhost/api/questions/live/${options.slug ?? SLUG}`);
	if (options.from !== undefined) url.searchParams.set('from', options.from);
	return {
		params: { slug: options.slug ?? SLUG },
		url,
		request: new Request(url, {
			method: options.method ?? 'POST',
			headers: { 'content-type': 'application/json' },
			body: options.method === 'GET' ? undefined : JSON.stringify(options.body ?? {})
		})
	} as never;
}

beforeEach(() => {
	vi.clearAllMocks();
	loadLiveTakeMock.mockResolvedValue(LIVE);
	getLiveTakeTypesMock.mockResolvedValue({ answered: [3], recent: [3], newestAt: null });
	postLiveTakeMock.mockResolvedValue({ ok: true, result: { ok: true, answers: [] } });
});

describe('GET /api/questions/live/[slug]', () => {
	it('loads the card and attributes the gate to the page being read', async () => {
		const response = await GET(
			event({ method: 'GET', from: '/personality-analysis/taylor-swift' })
		);
		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ live: LIVE, types: { answered: [3] } });
		expect(loadLiveTakeMock).toHaveBeenCalledWith(expect.anything(), {
			slug: SLUG,
			gatePath: '/personality-analysis/taylor-swift'
		});
	});

	it('falls back to /questions for a missing or malformed page path', async () => {
		await GET(event({ method: 'GET', from: 'https://evil.example/x' }));
		expect(loadLiveTakeMock).toHaveBeenCalledWith(expect.anything(), {
			slug: SLUG,
			gatePath: '/questions'
		});
	});

	it('404s a question that does not resolve', async () => {
		loadLiveTakeMock.mockResolvedValueOnce(null);
		const response = await GET(event({ method: 'GET' }));
		expect(response.status).toBe(404);
	});
});

describe('POST /api/questions/live/[slug]', () => {
	it('posts through postLiveTake with the page path as attribution', async () => {
		const response = await POST(
			event({
				from: '/',
				body: { slug: SLUG, comment: 'Being boring.', fingerprint: 'visitor-1' }
			})
		);
		expect(response.status).toBe(200);
		expect(postLiveTakeMock).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				slug: SLUG,
				comment: 'Being boring.',
				fingerprint: 'visitor-1',
				path: '/'
			})
		);
	});

	it('rejects a body for a different question than the route', async () => {
		const response = await POST(event({ body: { slug: 'other-question', comment: 'Hi there' } }));
		expect(response.status).toBe(400);
		expect(postLiveTakeMock).not.toHaveBeenCalled();
	});

	it('passes postLiveTake errors through', async () => {
		postLiveTakeMock.mockResolvedValueOnce({ ok: false, status: 429, error: 'Too many' });
		const response = await POST(event({ body: { slug: SLUG, comment: 'Being boring.' } }));
		expect(response.status).toBe(429);
		expect(await response.json()).toEqual({ error: 'Too many' });
	});
});
