// src/lib/server/generateSitemap.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('child_process', () => ({
	execFileSync: vi.fn()
}));

async function loadModuleWithGitDates(gitDates: Record<string, string>) {
	vi.resetModules();

	const childProcess = await import('child_process');
	const execFileSyncMock = vi.mocked(childProcess.execFileSync);
	execFileSyncMock.mockReset();
	execFileSyncMock.mockImplementation((command, args) => {
		if (command !== 'git' || !Array.isArray(args)) {
			throw new Error(`Unexpected command: ${String(command)}`);
		}

		const pathArgs = args.slice(4).filter((value): value is string => typeof value === 'string');
		const key = pathArgs.join('|');
		const date = gitDates[key];

		if (!date) {
			throw new Error(`Missing mock git date for ${key}`);
		}

		return `${date}\n`;
	});

	return import('../../../scripts/generate-sitemap.js');
}

describe('buildStaticPages', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('keeps the homepage lastmod tied to homepage route changes', async () => {
		const { buildStaticPages } = await loadModuleWithGitDates({
			'src/routes/+page.svelte|src/routes/+page.server.ts|src/routes/+page.ts': '2025-01-02',
			'src/routes/blog/+page.svelte|src/routes/blog/+page.server.ts|src/routes/blog/+layout.svelte':
				'2025-01-01',
			'src/routes/about/+page.svelte|src/routes/about/+page.server.ts': '2025-01-01',
			'src/routes/book-session/+page.svelte|src/routes/book-session/+page.server.ts|src/routes/book-session/+page.ts':
				'2025-01-01',
			'src/routes/community/+page.svelte|src/routes/community/+page.server.ts': '2025-01-01',
			'src/routes/enneagram-corner/+page.svelte|src/routes/enneagram-corner/+page.server.ts':
				'2025-01-01',
			'src/routes/enneagram-corner/mental-health/+page.svelte|src/routes/enneagram-corner/mental-health/+page.server.ts':
				'2025-01-01',
			'src/routes/enneagram-corner/subtopic/[slug]/+page.svelte|src/routes/enneagram-corner/subtopic/[slug]/+page.server.ts':
				'2025-01-01',
			'src/routes/how-to-guides/+page.svelte|src/routes/how-to-guides/+page.server.ts':
				'2025-01-01',
			'src/routes/personality-analysis/+page.svelte|src/routes/personality-analysis/+page.server.ts':
				'2025-01-01',
			'src/routes/personality-analysis/categories/+page.svelte|src/routes/personality-analysis/categories/+page.server.ts':
				'2025-01-01',
			'src/routes/personality-analysis/categories/[slug]/+page.svelte|src/routes/personality-analysis/categories/[slug]/+page.server.ts':
				'2025-01-01',
			'src/routes/questions/+page.svelte|src/routes/questions/+page.server.ts|src/routes/questions/+page.ts':
				'2025-01-01',
			'src/routes/personality-analysis/type/[slug]/+page.svelte|src/routes/personality-analysis/type/[slug]/+page.server.ts':
				'2025-01-01',
			'src/routes': '2024-12-31'
		});

		const pages = buildStaticPages({
			posts: [],
			peoplePosts: [{ lastmod: '2026-04-06', date: '2026-04-06' }],
			questions: [{ updated_at: '2026-04-05' }]
		});

		const homePage = pages.find((page) => page.loc === 'https://9takes.com');
		expect(homePage?.lastmod).toBe('2025-01-02');
	});

	it('still uses content freshness for the personality analysis index', async () => {
		const { buildStaticPages } = await loadModuleWithGitDates({
			'src/routes/+page.svelte|src/routes/+page.server.ts|src/routes/+page.ts': '2025-01-02',
			'src/routes/blog/+page.svelte|src/routes/blog/+page.server.ts|src/routes/blog/+layout.svelte':
				'2025-01-01',
			'src/routes/about/+page.svelte|src/routes/about/+page.server.ts': '2025-01-01',
			'src/routes/book-session/+page.svelte|src/routes/book-session/+page.server.ts|src/routes/book-session/+page.ts':
				'2025-01-01',
			'src/routes/community/+page.svelte|src/routes/community/+page.server.ts': '2025-01-01',
			'src/routes/enneagram-corner/+page.svelte|src/routes/enneagram-corner/+page.server.ts':
				'2025-01-01',
			'src/routes/enneagram-corner/mental-health/+page.svelte|src/routes/enneagram-corner/mental-health/+page.server.ts':
				'2025-01-01',
			'src/routes/enneagram-corner/subtopic/[slug]/+page.svelte|src/routes/enneagram-corner/subtopic/[slug]/+page.server.ts':
				'2025-01-01',
			'src/routes/how-to-guides/+page.svelte|src/routes/how-to-guides/+page.server.ts':
				'2025-01-01',
			'src/routes/personality-analysis/+page.svelte|src/routes/personality-analysis/+page.server.ts':
				'2025-01-01',
			'src/routes/personality-analysis/categories/+page.svelte|src/routes/personality-analysis/categories/+page.server.ts':
				'2025-01-01',
			'src/routes/personality-analysis/categories/[slug]/+page.svelte|src/routes/personality-analysis/categories/[slug]/+page.server.ts':
				'2025-01-01',
			'src/routes/questions/+page.svelte|src/routes/questions/+page.server.ts|src/routes/questions/+page.ts':
				'2025-01-01',
			'src/routes/personality-analysis/type/[slug]/+page.svelte|src/routes/personality-analysis/type/[slug]/+page.server.ts':
				'2025-01-01',
			'src/routes': '2024-12-31'
		});

		const pages = buildStaticPages({
			posts: [],
			peoplePosts: [{ lastmod: '2026-04-06', date: '2026-04-06' }],
			questions: []
		});

		const personalityIndex = pages.find(
			(page) => page.loc === 'https://9takes.com/personality-analysis'
		);
		expect(personalityIndex?.lastmod).toBe('2026-04-06');
	});
});

describe('buildQuestionCategoryEntries', () => {
	it('excludes thin categories while retaining indexable descendants and category freshness', async () => {
		const { buildQuestionCategoryEntries } = await loadModuleWithGitDates({});
		const result = buildQuestionCategoryEntries(
			[
				{
					id: 1,
					category_name: 'Relationships',
					slug: 'relationships',
					parent_id: null,
					intro_markdown: null,
					intro_updated_at: null
				},
				{
					id: 2,
					category_name: 'Friendships',
					slug: 'friendships',
					parent_id: 1,
					intro_markdown: 'Questions about building and maintaining friendships.',
					intro_updated_at: '2026-07-17'
				},
				{
					id: 3,
					category_name: 'Acquaintances',
					slug: 'acquaintances',
					parent_id: 1,
					intro_markdown: ' \n ',
					intro_updated_at: '2026-07-18'
				}
			],
			[
				{ question_id: 101, tag_id: 2 },
				{ question_id: 102, tag_id: 3 }
			],
			[
				{ id: 101, updated_at: '2026-07-17' },
				{ id: 102, updated_at: '2026-07-19' }
			]
		);

		expect(result.entries).toEqual([
			{
				loc: 'https://9takes.com/questions/categories/friendships',
				lastmod: '2026-07-17'
			}
		]);
		expect(result.latestLastmod).toBe('2026-07-19');
	});
});
