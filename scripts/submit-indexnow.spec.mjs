// scripts/submit-indexnow.spec.mjs
import { describe, expect, it, vi } from 'vitest';
import {
	buildPayload,
	mergeState,
	parseArgs,
	parseSitemap,
	planSubmission,
	runIndexNow
} from './submit-indexnow.mjs';

const DAY = 24 * 60 * 60 * 1000;
// 2026-09-20T00:00:00Z — sitemap lastmods are date-only, so anchoring "now" to
// UTC midnight keeps the window arithmetic obvious.
const NOW = Date.parse('2026-09-20');

/** @param {[string, string | null][]} pairs */
function sitemap(pairs) {
	const urls = pairs
		.map(
			([loc, lastmod]) =>
				`  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

describe('parseSitemap', () => {
	it('pulls loc + lastmod out of the generated sitemap', () => {
		const xml = sitemap([
			['https://9takes.com/a', '2026-09-19'],
			['https://9takes.com/b', null]
		]);

		expect(parseSitemap(xml)).toEqual([
			{ loc: 'https://9takes.com/a', lastmod: '2026-09-19' },
			{ loc: 'https://9takes.com/b', lastmod: null }
		]);
	});

	it('ignores the image blocks the sitemap nests inside <url>', () => {
		const xml = `<urlset>
  <url>
    <loc>https://9takes.com/personality-analysis/zendaya</loc>
    <lastmod>2026-09-18</lastmod>
    <image:image>
      <image:loc>https://9takes.com/portraits/zendaya.webp</image:loc>
    </image:image>
  </url>
</urlset>`;

		expect(parseSitemap(xml)).toEqual([
			{ loc: 'https://9takes.com/personality-analysis/zendaya', lastmod: '2026-09-18' }
		]);
	});
});

describe('planSubmission — lastmod cutoff', () => {
	const entries = [
		{ loc: 'https://9takes.com/fresh', lastmod: '2026-09-19' },
		{ loc: 'https://9takes.com/edge', lastmod: '2026-09-13' },
		{ loc: 'https://9takes.com/stale', lastmod: '2026-09-01' },
		{ loc: 'https://9takes.com/undated', lastmod: null }
	];

	it('keeps only URLs changed inside the window', () => {
		const plan = planSubmission({ entries, now: NOW, days: 7 });

		expect(plan.urls).toEqual(['https://9takes.com/fresh', 'https://9takes.com/edge']);
		expect(plan.skippedStale).toBe(2);
	});

	it('treats an entry with no lastmod as unjudgeable, not fresh', () => {
		const plan = planSubmission({ entries, now: NOW, days: 3650 });

		expect(plan.urls).not.toContain('https://9takes.com/undated');
	});

	it('widens with --days', () => {
		const plan = planSubmission({ entries, now: NOW, days: 30 });

		expect(plan.urls).toHaveLength(3);
		expect(plan.urls).toContain('https://9takes.com/stale');
	});

	it('returns the newest changes first so a cap drops the least urgent', () => {
		const plan = planSubmission({ entries, now: NOW, days: 30 });

		expect(plan.urls[0]).toBe('https://9takes.com/fresh');
	});

	it('counts whole UTC days, so --days=1 still catches a page edited today', () => {
		// Sitemap lastmods are date-only. A rolling 24h cutoff would drop today's
		// edits the moment the clock passed midnight UTC — the exact case that
		// matters, since this runs right after a deploy.
		const today = [{ loc: 'https://9takes.com/today', lastmod: '2026-09-20' }];
		const lateInTheDay = Date.parse('2026-09-20T23:59:00Z');

		expect(planSubmission({ entries: today, now: lateInTheDay, days: 1 }).urls).toEqual([
			'https://9takes.com/today'
		]);
	});
});

describe('planSubmission — the 10,000 URL cap', () => {
	// One more than the spec allows in a single POST: 10,000 edited yesterday
	// plus one older page, all inside the 7 day window.
	const entries = [
		...Array.from({ length: 10_000 }, (_, index) => ({
			loc: `https://9takes.com/p/${String(index).padStart(5, '0')}`,
			lastmod: '2026-09-19'
		})),
		{ loc: 'https://9takes.com/p/oldest', lastmod: '2026-09-14' }
	];

	it('never sends more than one request can carry', () => {
		const plan = planSubmission({ entries, now: NOW, days: 7 });

		expect(plan.eligible).toBe(10_001);
		expect(plan.urls).toHaveLength(10_000);
		expect(plan.overCap).toBe(1);
	});

	it('drops the oldest page, not a fresh one', () => {
		const plan = planSubmission({ entries, now: NOW, days: 7 });

		expect(plan.urls).toContain('https://9takes.com/p/00000');
		expect(plan.urls).not.toContain('https://9takes.com/p/oldest');
	});

	it('only records state for the URLs it actually sent', () => {
		const plan = planSubmission({ entries, now: NOW, days: 7 });

		expect(Object.keys(plan.lastmodByUrl)).toHaveLength(10_000);
		expect(plan.lastmodByUrl['https://9takes.com/p/oldest']).toBeUndefined();
	});
});

describe('planSubmission — skip unchanged', () => {
	const entries = [
		{ loc: 'https://9takes.com/unchanged', lastmod: '2026-09-18' },
		{ loc: 'https://9takes.com/edited', lastmod: '2026-09-19' },
		{ loc: 'https://9takes.com/brand-new', lastmod: '2026-09-19' }
	];

	const state = {
		lastRunAt: '2026-09-18T12:00:00.000Z',
		urls: {
			'https://9takes.com/unchanged': '2026-09-18',
			'https://9takes.com/edited': '2026-09-15'
		}
	};

	it('skips a URL already submitted at the same lastmod', () => {
		const plan = planSubmission({ entries, state, now: NOW, days: 7 });

		expect(plan.urls).not.toContain('https://9takes.com/unchanged');
		expect(plan.skippedUnchanged).toBe(1);
	});

	it('resubmits a URL whose lastmod moved', () => {
		const plan = planSubmission({ entries, state, now: NOW, days: 7 });

		expect(plan.urls).toContain('https://9takes.com/edited');
	});

	it('submits URLs the state file has never seen', () => {
		const plan = planSubmission({ entries, state, now: NOW, days: 7 });

		expect(plan.urls).toContain('https://9takes.com/brand-new');
	});

	it('sends everything in the window on a first run with no state file', () => {
		const plan = planSubmission({ entries, now: NOW, days: 7 });

		expect(plan.urls).toHaveLength(3);
		expect(plan.skippedUnchanged).toBe(0);
	});

	it('--force ignores the state file', () => {
		const plan = planSubmission({ entries, state, now: NOW, days: 7, force: true });

		expect(plan.urls).toHaveLength(3);
		expect(plan.skippedUnchanged).toBe(0);
	});
});

describe('mergeState', () => {
	it('records what was sent and prunes URLs that left the sitemap', () => {
		const next = mergeState({
			state: {
				lastRunAt: '2026-09-18T12:00:00.000Z',
				urls: {
					'https://9takes.com/kept': '2026-09-10',
					'https://9takes.com/deleted': '2026-09-02'
				}
			},
			submitted: { 'https://9takes.com/kept': '2026-09-19' },
			knownUrls: new Set(['https://9takes.com/kept']),
			submittedAt: '2026-09-20T00:00:00.000Z'
		});

		expect(next).toEqual({
			lastRunAt: '2026-09-20T00:00:00.000Z',
			urls: { 'https://9takes.com/kept': '2026-09-19' }
		});
	});
});

describe('buildPayload', () => {
	it('matches the IndexNow request shape', () => {
		expect(
			buildPayload({
				key: 'abc123',
				keyLocation: 'https://9takes.com/abc123.txt',
				urls: ['https://9takes.com/a']
			})
		).toEqual({
			host: '9takes.com',
			key: 'abc123',
			keyLocation: 'https://9takes.com/abc123.txt',
			urlList: ['https://9takes.com/a']
		});
	});
});

describe('runIndexNow', () => {
	const sitemapXml = sitemap([
		['https://9takes.com/a', '2026-09-19'],
		['https://9takes.com/b', '2026-09-01']
	]);

	const ok = () => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('') });

	it('never calls the network when INDEXNOW_KEY is missing', async () => {
		const fetchImpl = vi.fn();

		const result = await runIndexNow({ sitemapXml, key: null, now: NOW, fetchImpl });

		expect(result.outcome).toBe('missing-key');
		expect(fetchImpl).not.toHaveBeenCalled();
		expect(result.nextState).toBeNull();
	});

	it('previews without a key so --dry-run works before setup', async () => {
		const fetchImpl = vi.fn();

		const result = await runIndexNow({
			sitemapXml,
			key: null,
			dryRun: true,
			now: NOW,
			fetchImpl
		});

		expect(result.outcome).toBe('dry-run');
		expect(result.missingKey).toBe(true);
		expect(result.plan.urls).toEqual(['https://9takes.com/a']);
		expect(fetchImpl).not.toHaveBeenCalled();
	});

	it('--dry-run sends nothing even with a key', async () => {
		const fetchImpl = vi.fn();

		const result = await runIndexNow({
			sitemapXml,
			key: 'testkey',
			dryRun: true,
			now: NOW,
			fetchImpl
		});

		expect(result.outcome).toBe('dry-run');
		expect(fetchImpl).not.toHaveBeenCalled();
		expect(result.nextState).toBeNull();
	});

	it('POSTs the spec payload to the shared endpoint', async () => {
		const fetchImpl = vi.fn(ok);

		const result = await runIndexNow({ sitemapXml, key: 'testkey', now: NOW, fetchImpl });

		expect(result.outcome).toBe('submitted');
		expect(result.httpStatus).toBe(200);

		const [url, init] = fetchImpl.mock.calls[0];
		expect(url).toBe('https://api.indexnow.org/indexnow');
		expect(init.method).toBe('POST');
		expect(init.headers['Content-Type']).toBe('application/json; charset=utf-8');
		expect(JSON.parse(init.body)).toEqual({
			host: '9takes.com',
			key: 'testkey',
			keyLocation: 'https://9takes.com/testkey.txt',
			urlList: ['https://9takes.com/a']
		});
	});

	it('records submitted URLs so the next run skips them', async () => {
		const result = await runIndexNow({ sitemapXml, key: 'testkey', now: NOW, fetchImpl: ok });

		expect(result.nextState?.urls).toEqual({ 'https://9takes.com/a': '2026-09-19' });

		const second = planSubmission({
			entries: parseSitemap(sitemapXml),
			state: result.nextState,
			now: NOW,
			days: 7
		});
		expect(second.urls).toEqual([]);
	});

	it('does not send an empty request when nothing changed', async () => {
		const fetchImpl = vi.fn(ok);

		const result = await runIndexNow({
			sitemapXml,
			key: 'testkey',
			state: { lastRunAt: null, urls: { 'https://9takes.com/a': '2026-09-19' } },
			now: NOW,
			fetchImpl
		});

		expect(result.outcome).toBe('nothing-to-submit');
		expect(fetchImpl).not.toHaveBeenCalled();
	});

	it('reports an HTTP failure without throwing and leaves state untouched', async () => {
		const fetchImpl = vi.fn(() =>
			Promise.resolve({ ok: false, status: 403, text: () => Promise.resolve('Forbidden') })
		);

		const result = await runIndexNow({ sitemapXml, key: 'badkey', now: NOW, fetchImpl });

		expect(result.outcome).toBe('http-error');
		expect(result.httpStatus).toBe(403);
		expect(result.nextState).toBeNull();
	});

	it('swallows a network error so a cron or deploy never fails', async () => {
		const fetchImpl = vi.fn(() => Promise.reject(new Error('ECONNRESET')));

		const result = await runIndexNow({ sitemapXml, key: 'testkey', now: NOW, fetchImpl });

		expect(result.outcome).toBe('network-error');
		expect(result.error).toContain('ECONNRESET');
		expect(result.nextState).toBeNull();
	});
});

describe('parseArgs', () => {
	it('defaults to a 7 day window and a real submission', () => {
		expect(parseArgs([])).toEqual({ days: 7, dryRun: false, force: false });
	});

	it('reads --days, --dry-run and --force', () => {
		expect(parseArgs(['--days=30', '--dry-run', '--force'])).toEqual({
			days: 30,
			dryRun: true,
			force: true
		});
	});

	it('ignores a nonsense --days rather than submitting nothing', () => {
		expect(parseArgs(['--days=banana']).days).toBe(7);
		expect(parseArgs(['--days=0']).days).toBe(7);
	});
});
