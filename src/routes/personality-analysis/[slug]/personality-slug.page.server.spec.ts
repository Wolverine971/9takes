// src/routes/personality-analysis/[slug]/personality-slug.page.server.spec.ts
//
// This page is served from Vercel's ISR cache, which stores 404s and replays
// them to everyone. A database hiccup must therefore never look like "not
// found": query errors answer 503, which ISR does not store (the last good copy
// keeps serving and the render is retried).
import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ dev: false, browser: false, building: false }));
vi.mock('@vercel/functions', () => ({ waitUntil: vi.fn() }));
vi.mock('$lib/server/blogContentProcessor', () => ({
	processBlogContent: vi.fn(async () => ({
		content: '<p>Zendaya prepares for everything.</p>',
		placeholders: [],
		headings: []
	}))
}));

import { config, load } from './+page.server';

type QueryResult = { data: unknown; error: { code?: string; message: string } | null };

const PUBLISHED_PERSON = {
	id: 7,
	person: 'zendaya',
	title: 'Why Zendaya Cannot Stop Preparing',
	description: 'Type 6',
	enneagram: '6',
	type: ['celebrity'],
	content: 'Zendaya prepares for everything.',
	published: true,
	chorus_question: null,
	chorus_question_url: null,
	suggestions: [],
	faqs: [],
	date: '2026-09-01',
	lastmod: '2026-09-20'
};

/** Chainable PostgREST stand-in; every call is recorded for assertions. */
function queryBuilder(single: QueryResult, list: QueryResult = { data: [], error: null }) {
	const calls: Array<[string, unknown[]]> = [];
	const builder: Record<string, unknown> = {};
	for (const method of ['select', 'eq', 'order', 'limit', 'abortSignal']) {
		builder[method] = (...args: unknown[]) => {
			calls.push([method, args]);
			return builder;
		};
	}
	builder.maybeSingle = () => {
		calls.push(['maybeSingle', []]);
		return Promise.resolve(single);
	};
	// The similarity refresh awaits the builder itself.
	builder.then = (resolve: (value: QueryResult) => unknown, reject: (reason: unknown) => unknown) =>
		Promise.resolve(list).then(resolve, reject);
	return { builder, calls };
}

function setup({
	person,
	question = { data: null, error: null }
}: {
	person: QueryResult;
	question?: QueryResult;
}) {
	const people = queryBuilder(person);
	const questions = queryBuilder(question);
	const supabase = {
		from: vi.fn((table: string) => (table === 'questions' ? questions.builder : people.builder))
	};
	const event = {
		params: { slug: 'zendaya' },
		url: new URL('https://9takes.com/personality-analysis/zendaya'),
		locals: { supabase },
		setHeaders: vi.fn()
	};
	return { event, peopleCalls: people.calls, questionCalls: questions.calls };
}

async function loadPage(event: ReturnType<typeof setup>['event']) {
	return (load as unknown as (event: unknown) => Promise<Record<string, any>>)(event);
}

describe('/personality-analysis/[slug] load', () => {
	it('answers 503, not 404, when the person query fails', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { event } = setup({
			person: {
				data: null,
				error: { code: '57014', message: 'canceling statement due to timeout' }
			}
		});

		await expect(loadPage(event)).rejects.toMatchObject({ status: 503 });
		expect(consoleError).toHaveBeenCalled();
		consoleError.mockRestore();
	});

	it('still answers 404 when the person genuinely does not exist', async () => {
		const { event } = setup({ person: { data: null, error: null } });

		await expect(loadPage(event)).rejects.toMatchObject({ status: 404 });
	});

	it('still answers 404 for an unpublished person', async () => {
		const { event } = setup({
			person: { data: { ...PUBLISHED_PERSON, published: false }, error: null }
		});

		await expect(loadPage(event)).rejects.toMatchObject({ status: 404 });
	});

	it('picks one row, published first, so a duplicate person row cannot error', async () => {
		const { event, peopleCalls } = setup({ person: { data: PUBLISHED_PERSON, error: null } });

		const result = await loadPage(event);

		expect(result.post.slug).toBe('zendaya');
		const lookup = peopleCalls.slice(
			0,
			peopleCalls.findIndex(([method]) => method === 'maybeSingle') + 1
		);
		expect(lookup).toContainEqual(['eq', ['person', 'zendaya']]);
		expect(lookup).toContainEqual([
			'order',
			['published', { ascending: false, nullsFirst: false }]
		]);
		expect(lookup).toContainEqual(['limit', [1]]);
	});

	it('answers 503 when the chorus question lookup fails instead of caching the page without it', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { event } = setup({
			person: {
				data: { ...PUBLISHED_PERSON, chorus_question_url: 'what-does-zendaya-prepare-for' },
				error: null
			},
			question: { data: null, error: { message: 'TypeError: fetch failed' } }
		});

		await expect(loadPage(event)).rejects.toMatchObject({ status: 503 });
		consoleError.mockRestore();
	});

	it('renders without the chorus prompt when the linked question is simply gone', async () => {
		const { event, questionCalls } = setup({
			person: {
				data: { ...PUBLISHED_PERSON, chorus_question_url: 'deleted-question' },
				error: null
			},
			question: { data: null, error: null }
		});

		const result = await loadPage(event);

		expect(result.post.chorus_question).toBeNull();
		expect(result.post.chorus_question_url).toBeNull();
		// One row at most, so a duplicate question url cannot surface as an error.
		expect(questionCalls).toContainEqual(['limit', [1]]);
	});

	it('keeps the ISR config that the rest of this contract depends on', () => {
		expect(config.isr).toMatchObject({ expiration: 86_400, allowQuery: [] });
	});
});
