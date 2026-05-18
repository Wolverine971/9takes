// src/routes/api/blog-versions/[id]/blog-versions.server.spec.ts
import { describe, expect, it, vi } from 'vitest';

import { GET } from './+server';

function buildSupabaseStub() {
	const profileSingle = vi.fn().mockResolvedValue({
		data: { id: 'admin-user', admin: true, email: 'admin@example.com' },
		error: null
	});
	const blogSingle = vi.fn().mockResolvedValue({
		data: {
			id: 42,
			person: "charli-d'amelio",
			title: "Charli D'Amelio",
			content: 'Published content',
			lastmod: '2026-02-18T00:00:00.000Z'
		},
		error: null
	});
	const historyOrder = vi.fn().mockResolvedValue({
		data: [],
		error: null
	});

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
						eq: vi.fn(() => ({ single: blogSingle }))
					}))
				};
			}

			if (table === 'blogs_famous_people_history') {
				return {
					select: vi.fn(() => ({
						eq: vi.fn(() => ({ order: historyOrder }))
					}))
				};
			}

			throw new Error(`Unexpected table: ${table}`);
		})
	};
}

describe('/api/blog-versions/[id]', () => {
	it('requires an admin session', async () => {
		await expect(
			GET({
				params: { id: '42' },
				locals: {
					session: null,
					supabase: {}
				}
			} as any)
		).rejects.toMatchObject({ status: 401 });
	});

	it('includes matching local drafts for normalized people slugs with punctuation', async () => {
		const response = await GET({
			params: { id: '42' },
			locals: {
				session: { user: { id: 'admin-user' } },
				supabase: buildSupabaseStub()
			}
		} as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.hasDraft).toBe(true);
		expect(body.versions[0]).toMatchObject({
			id: 'draft',
			source: 'draft',
			is_current: true
		});
		expect(body.versions[0].content).not.toContain('---');
		expect(body.versions[0].content).toContain("I'm not even Charli anymore");
	});
});
