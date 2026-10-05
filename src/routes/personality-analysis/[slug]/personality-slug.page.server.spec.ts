// src/routes/personality-analysis/[slug]/personality-slug.page.server.spec.ts
//
// This page is served from Vercel's ISR cache, which stores 404s and replays
// them to everyone. A database hiccup must therefore never look like "not
// found": query errors answer 503, which ISR does not store (the last good copy
// keeps serving and the render is retried).
import { beforeEach, describe, expect, it, vi } from 'vitest';

type QueryResult = { data: unknown; error: { code?: string; message: string } | null };

// nine_takes has no public RLS policy, so chorus readiness is read with the
// service-role client. Tests swap in the result per case.
const admin = vi.hoisted(() => ({
	nineTakes: { data: [], error: null } as {
		data: unknown;
		error: { code?: string; message: string } | null;
	},
	calls: [] as Array<[string, unknown[]]>
}));

vi.mock('$app/environment', () => ({ dev: false, browser: false, building: false }));
vi.mock('@vercel/functions', () => ({ waitUntil: vi.fn() }));
vi.mock('$lib/server/blogContentProcessor', () => ({
	processBlogContent: vi.fn(async () => ({
		content: '<p>Zendaya prepares for everything.</p>',
		placeholders: [],
		headings: []
	}))
}));
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => {
		const builder: Record<string, unknown> = {};
		for (const method of ['select', 'eq', 'in']) {
			builder[method] = (...args: unknown[]) => {
				admin.calls.push([method, args]);
				return builder;
			};
		}
		builder.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
			Promise.resolve(admin.nineTakes).then(resolve, reject);
		return {
			from: (table: string) => {
				admin.calls.push(['from', [table]]);
				return builder;
			}
		};
	}
}));

import { config, load } from './+page.server';
import {
	PROVEN_CHORUS_QUESTION_URLS,
	orderProvenChorusCandidates
} from '$lib/server/provenChorusQuestions';

beforeEach(() => {
	admin.nineTakes = { data: [], error: null };
	admin.calls = [];
});

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
	for (const method of ['select', 'eq', 'in', 'order', 'limit', 'abortSignal']) {
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
	question = { data: null, error: null },
	pool = { data: [], error: null },
	slug = 'zendaya'
}: {
	person: QueryResult;
	/** The person's own chorus question lookup (maybeSingle). */
	question?: QueryResult;
	/** The proven-question pool lookup (awaited list). */
	pool?: QueryResult;
	slug?: string;
}) {
	const people = queryBuilder(person);
	const questions = queryBuilder(question, pool);
	const supabase = {
		from: vi.fn((table: string) => (table === 'questions' ? questions.builder : people.builder))
	};
	const event = {
		params: { slug },
		url: new URL(`https://9takes.com/personality-analysis/${slug}`),
		locals: { supabase },
		setHeaders: vi.fn()
	};
	return { event, peopleCalls: people.calls, questionCalls: questions.calls };
}

const NINE_TAKES = Array.from({ length: 9 }, (_, index) => ({
	type: index + 1,
	take: `Take ${index + 1}`
}));

/** A public pool row per proven url, ids in pool order. */
function poolRows(overrides: Record<string, Record<string, unknown>> = {}) {
	return PROVEN_CHORUS_QUESTION_URLS.map((url, index) => ({
		id: 500 + index,
		url,
		question: url.replaceAll('-', ' '),
		question_formatted: `Question ${index + 1}?`,
		flagged: false,
		removed: false,
		data: null,
		...overrides[url]
	}));
}

function readyChoruses(urls: readonly string[]) {
	return urls.map((subject_slug) => ({ subject_slug, takes: NINE_TAKES }));
}

const HIDDEN_OWN_QUESTION = {
	question: 'What does it feel like to constantly prepare for something?',
	question_formatted: 'What does it feel like to constantly prepare for something?',
	flagged: true,
	removed: false,
	data: { source: 'chorus' }
};

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

	it('flags open-case profiles without shipping the pipeline record', async () => {
		const { event, peopleCalls } = setup({
			person: {
				data: {
					...PUBLISHED_PERSON,
					content_quality: { profile_format: 'open_case', overall_grade: 8.6 }
				},
				error: null
			}
		});

		const result = await loadPage(event);

		expect(result.isOpenCase).toBe(true);
		expect(result.post).not.toHaveProperty('content_quality');
		const personSelect = peopleCalls.find(([method]) => method === 'select');
		expect(String(personSelect?.[1][0]).split(/,\s*/)).toContain('content_quality');
	});

	it('leaves standard profiles unflagged', async () => {
		for (const content_quality of [
			undefined,
			null,
			{},
			{ overall_grade: 9 },
			{ profile_format: 'standard' },
			['open_case'],
			'open_case'
		]) {
			const { event } = setup({
				person: { data: { ...PUBLISHED_PERSON, content_quality }, error: null }
			});

			const result = await loadPage(event);

			expect(result.isOpenCase).toBe(false);
			expect(result.post).not.toHaveProperty('content_quality');
		}
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

	it('falls back to a proven live question when the own question is hidden', async () => {
		admin.nineTakes = { data: readyChoruses(PROVEN_CHORUS_QUESTION_URLS), error: null };
		const { event } = setup({
			person: {
				data: { ...PUBLISHED_PERSON, chorus_question_url: 'what-does-it-feel-like-to-prepare' },
				error: null
			},
			question: { data: HIDDEN_OWN_QUESTION, error: null },
			pool: { data: poolRows(), error: null }
		});

		const result = await loadPage(event);
		const expectedUrl = orderProvenChorusCandidates('zendaya')[0];
		const expectedIndex = PROVEN_CHORUS_QUESTION_URLS.indexOf(expectedUrl);

		// The hidden question stays hidden; the page asks a proven one instead.
		expect(result.post.chorus_question).toBeNull();
		expect(result.post.chorus_question_url).toBeNull();
		expect(result.chorus).toEqual({
			question: `Question ${expectedIndex + 1}?`,
			questionUrl: expectedUrl,
			subjectType: 'question',
			source: 'proven'
		});
		expect(admin.calls).toContainEqual(['from', ['nine_takes']]);
		expect(admin.calls).toContainEqual(['eq', ['subject_type', 'question']]);
	});

	it('falls back to a proven question when the person has no chorus question at all', async () => {
		admin.nineTakes = { data: readyChoruses(PROVEN_CHORUS_QUESTION_URLS), error: null };
		const { event, questionCalls } = setup({
			person: { data: PUBLISHED_PERSON, error: null },
			pool: { data: poolRows(), error: null }
		});

		const result = await loadPage(event);

		expect(result.chorus).toMatchObject({ subjectType: 'question', source: 'proven' });
		expect(questionCalls).toContainEqual(['in', ['url', [...PROVEN_CHORUS_QUESTION_URLS]]]);
	});

	it('picks per person, and the same person always gets the same question', async () => {
		admin.nineTakes = { data: readyChoruses(PROVEN_CHORUS_QUESTION_URLS), error: null };
		const pickFor = async (slug: string) => {
			const { event } = setup({
				slug,
				person: { data: { ...PUBLISHED_PERSON, person: slug }, error: null },
				pool: { data: poolRows(), error: null }
			});
			return (await loadPage(event)).chorus.questionUrl as string;
		};

		const slugs = Array.from({ length: 24 }, (_, i) => `person-${i}`);
		const picks = await Promise.all(slugs.map(pickFor));

		slugs.forEach((slug, i) => expect(picks[i]).toBe(orderProvenChorusCandidates(slug)[0]));
		expect(new Set(picks).size).toBeGreaterThan(1);
		expect(await pickFor('person-3')).toBe(picks[3]);
	});

	it('skips a pool question that is no longer public', async () => {
		const [first] = orderProvenChorusCandidates('zendaya');
		admin.nineTakes = { data: readyChoruses(PROVEN_CHORUS_QUESTION_URLS), error: null };
		const { event } = setup({
			person: { data: PUBLISHED_PERSON, error: null },
			pool: { data: poolRows({ [first]: { flagged: true } }), error: null }
		});

		const result = await loadPage(event);

		expect(result.chorus.questionUrl).toBe(orderProvenChorusCandidates('zendaya')[1]);
	});

	it('skips a pool question whose nine takes are not seeded yet', async () => {
		const order = orderProvenChorusCandidates('zendaya');
		// Only the last candidate in this page's order can accept an answer.
		admin.nineTakes = {
			data: [
				{ subject_slug: order[0], takes: NINE_TAKES.slice(0, 8) },
				{ subject_slug: order[order.length - 1], takes: NINE_TAKES }
			],
			error: null
		};
		const { event } = setup({
			person: { data: PUBLISHED_PERSON, error: null },
			pool: { data: poolRows(), error: null }
		});

		const result = await loadPage(event);

		expect(result.chorus.questionUrl).toBe(order[order.length - 1]);
	});

	it('renders no chorus when no pool question is eligible and answerable', async () => {
		admin.nineTakes = { data: [], error: null };
		const { event } = setup({
			person: { data: PUBLISHED_PERSON, error: null },
			pool: { data: poolRows(), error: null }
		});

		expect((await loadPage(event)).chorus).toBeNull();
	});

	it('keeps the own question when it is public and its chorus is ready', async () => {
		admin.nineTakes = {
			data: [{ subject_slug: 'zendaya', takes: NINE_TAKES }],
			error: null
		};
		const { event } = setup({
			person: {
				data: { ...PUBLISHED_PERSON, chorus_question_url: 'what-does-zendaya-prepare-for' },
				error: null
			},
			question: { data: { ...HIDDEN_OWN_QUESTION, flagged: false, data: null }, error: null },
			pool: { data: poolRows(), error: null }
		});

		const result = await loadPage(event);

		expect(result.post.chorus_question_url).toBe('what-does-zendaya-prepare-for');
		expect(result.chorus).toEqual({
			question: HIDDEN_OWN_QUESTION.question_formatted,
			questionUrl: 'what-does-zendaya-prepare-for',
			subjectType: 'personality-analysis',
			source: 'person'
		});
		expect(admin.calls).toContainEqual(['eq', ['subject_type', 'personality-analysis']]);
	});

	it('answers 503 when the proven pool lookup fails', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { event } = setup({
			person: { data: PUBLISHED_PERSON, error: null },
			pool: { data: null, error: { message: 'TypeError: fetch failed' } }
		});

		await expect(loadPage(event)).rejects.toMatchObject({ status: 503 });
		consoleError.mockRestore();
	});

	it('answers 503 when the chorus readiness lookup fails', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		admin.nineTakes = { data: null, error: { code: '57014', message: 'statement timeout' } };
		const { event } = setup({
			person: { data: PUBLISHED_PERSON, error: null },
			pool: { data: poolRows(), error: null }
		});

		await expect(loadPage(event)).rejects.toMatchObject({ status: 503 });
		consoleError.mockRestore();
	});

	it('keeps the ISR config that the rest of this contract depends on', () => {
		expect(config.isr).toMatchObject({ expiration: 86_400, allowQuery: [] });
	});
});
