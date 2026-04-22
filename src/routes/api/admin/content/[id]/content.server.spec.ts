// src/routes/api/admin/content/[id]/content.server.spec.ts
import { describe, expect, it, vi } from 'vitest';

import { PUT } from './+server';

interface CapturedUpdate {
	payload: Record<string, unknown> | null;
}

function buildSupabaseStub(
	captured: CapturedUpdate,
	options: {
		existing?: Record<string, unknown>;
	} = {}
) {
	const profileSingle = vi.fn().mockResolvedValue({
		data: { admin: true },
		error: null
	});
	const existingSingle = vi.fn().mockResolvedValue({
		data: options.existing ?? {
			id: 42,
			person: 'Taylor Swift',
			title: 'Old Title',
			published: true,
			published_at: '2026-01-17T00:00:00Z',
			first_published_at: '2026-01-17T00:00:00Z'
		},
		error: null
	});
	const updateSingle = vi.fn().mockImplementation(() =>
		Promise.resolve({
			data: {
				id: 42,
				person: 'Taylor Swift',
				title: 'Old Title',
				published: true,
				...captured.payload
			},
			error: null
		})
	);
	const rpc = vi.fn().mockResolvedValue({ data: null, error: null });
	return {
		from: vi.fn((table: string) => {
			if (table === 'profiles') {
				return {
					select: vi.fn(() => ({
						eq: vi.fn(() => ({ single: profileSingle }))
					}))
				};
			}
			if (table === 'blogs_famous_people') {
				return {
					select: vi.fn(() => ({
						eq: vi.fn(() => ({ single: existingSingle }))
					})),
					update: vi.fn((payload: Record<string, unknown>) => {
						captured.payload = payload;
						return {
							eq: vi.fn(() => ({
								select: vi.fn(() => ({ single: updateSingle }))
							}))
						};
					})
				};
			}
			throw new Error(`Unexpected table: ${table}`);
		}),
		rpc
	};
}

describe('/api/admin/content/[id]', () => {
	it('stamps publish metadata and records a release event when a draft is published', async () => {
		let capturedUpdate: Record<string, unknown> | null = null;
		const profileSingle = vi.fn().mockResolvedValue({
			data: { admin: true },
			error: null
		});
		const existingSingle = vi.fn().mockResolvedValue({
			data: {
				id: 7,
				person: 'Test Person',
				title: 'Old Title',
				published: false,
				published_at: null,
				first_published_at: null
			},
			error: null
		});
		const updateSingle = vi.fn().mockImplementation(() =>
			Promise.resolve({
				data: {
					id: 7,
					person: 'Test Person',
					title: 'New Title',
					published: true,
					...capturedUpdate
				},
				error: null
			})
		);
		const rpc = vi.fn().mockResolvedValue({
			data: 99,
			error: null
		});
		const supabase = {
			from: vi.fn((table: string) => {
				if (table === 'profiles') {
					return {
						select: vi.fn(() => ({
							eq: vi.fn(() => ({
								single: profileSingle
							}))
						}))
					};
				}

				if (table === 'blogs_famous_people') {
					return {
						select: vi.fn(() => ({
							eq: vi.fn(() => ({
								single: existingSingle
							}))
						})),
						update: vi.fn((payload: Record<string, unknown>) => {
							capturedUpdate = payload;
							return {
								eq: vi.fn(() => ({
									select: vi.fn(() => ({
										single: updateSingle
									}))
								}))
							};
						})
					};
				}

				throw new Error(`Unexpected table: ${table}`);
			}),
			rpc
		};

		const response = await PUT({
			params: { id: '7' },
			request: new Request('https://9takes.test/api/admin/content/7', {
				method: 'PUT',
				body: JSON.stringify({
					title: 'New Title',
					published: true
				})
			}),
			locals: {
				session: { user: { id: 'admin-user' } },
				supabase
			}
		} as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(capturedUpdate).toMatchObject({
			title: 'New Title',
			published: true
		});
		const update = capturedUpdate as unknown as Record<string, unknown>;
		expect(update.published_at).toEqual(expect.any(String));
		expect(update.first_published_at).toBe(update.published_at);
		expect(rpc).toHaveBeenCalledWith('record_content_release_event', {
			p_content_type: 'people',
			p_content_slug: 'test-person',
			p_event_type: 'published',
			p_event_at: update.published_at,
			p_source: 'admin-content-api',
			p_path: '/personality-analysis/test-person',
			p_metadata: {
				blog_id: 7,
				title: 'New Title'
			}
		});
		expect(body.data.published_at).toBe(update.published_at);
	});

	it('persists every structured-data whitelist field through the PUT handler', async () => {
		const captured: CapturedUpdate = { payload: null };
		const supabase = buildSupabaseStub(captured);

		const payload = {
			keywords: ['Taylor Swift personality type', 'Taylor Swift Enneagram'],
			same_as: ['https://en.wikipedia.org/wiki/Taylor_Swift'],
			faqs: [{ question: 'Q?', answer: 'A.', anchor: 'q' }],
			wikidata_qid: 'Q26876',
			imdb_id: 'nm1728342',
			birth_date: '1989-12-13',
			birth_place: 'West Reading, Pennsylvania, USA',
			nationality: 'American',
			occupation: ['Singer-songwriter', 'Record producer'],
			knows_about: ['Pop music', 'Songwriting'],
			citations: ['https://en.wikipedia.org/wiki/Taylor_Swift']
		};

		const response = await PUT({
			params: { id: '42' },
			request: new Request('https://9takes.test/api/admin/content/42', {
				method: 'PUT',
				body: JSON.stringify(payload)
			}),
			locals: {
				session: { user: { id: 'admin-user' } },
				supabase
			}
		} as any);

		expect(response.status).toBe(200);
		expect(captured.payload).toMatchObject(payload);
		expect(captured.payload?.lastmod).toEqual(expect.any(String));
	});

	it('rejects malformed wikidata_qid with a 400 before writing', async () => {
		const captured: CapturedUpdate = { payload: null };
		const supabase = buildSupabaseStub(captured);

		await expect(
			PUT({
				params: { id: '42' },
				request: new Request('https://9takes.test/api/admin/content/42', {
					method: 'PUT',
					body: JSON.stringify({ wikidata_qid: 'q26876' })
				}),
				locals: {
					session: { user: { id: 'admin-user' } },
					supabase
				}
			} as any)
		).rejects.toMatchObject({ status: 400 });

		expect(captured.payload).toBeNull();
	});

	it('rejects malformed imdb_id with a 400 before writing', async () => {
		const captured: CapturedUpdate = { payload: null };
		const supabase = buildSupabaseStub(captured);

		await expect(
			PUT({
				params: { id: '42' },
				request: new Request('https://9takes.test/api/admin/content/42', {
					method: 'PUT',
					body: JSON.stringify({ imdb_id: 'tt1234567' })
				}),
				locals: {
					session: { user: { id: 'admin-user' } },
					supabase
				}
			} as any)
		).rejects.toMatchObject({ status: 400 });

		expect(captured.payload).toBeNull();
	});

	it('coerces blank wikidata_qid and imdb_id strings to null for clearing', async () => {
		const captured: CapturedUpdate = { payload: null };
		const supabase = buildSupabaseStub(captured);

		const response = await PUT({
			params: { id: '42' },
			request: new Request('https://9takes.test/api/admin/content/42', {
				method: 'PUT',
				body: JSON.stringify({ wikidata_qid: '   ', imdb_id: '  ' })
			}),
			locals: {
				session: { user: { id: 'admin-user' } },
				supabase
			}
		} as any);

		expect(response.status).toBe(200);
		expect(captured.payload).toMatchObject({
			wikidata_qid: null,
			imdb_id: null
		});
	});
});
