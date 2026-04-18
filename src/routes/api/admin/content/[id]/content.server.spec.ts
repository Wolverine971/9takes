// src/routes/api/admin/content/[id]/content.server.spec.ts
import { describe, expect, it, vi } from 'vitest';

import { PUT } from './+server';

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
		expect(capturedUpdate?.published_at).toEqual(expect.any(String));
		expect(capturedUpdate?.first_published_at).toBe(capturedUpdate?.published_at);
		expect(rpc).toHaveBeenCalledWith('record_content_release_event', {
			p_content_type: 'people',
			p_content_slug: 'test-person',
			p_event_type: 'published',
			p_event_at: capturedUpdate?.published_at,
			p_source: 'admin-content-api',
			p_path: '/personality-analysis/test-person',
			p_metadata: {
				blog_id: 7,
				title: 'New Title'
			}
		});
		expect(body.data.published_at).toBe(capturedUpdate?.published_at);
	});
});
