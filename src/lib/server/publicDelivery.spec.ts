// src/lib/server/publicDelivery.spec.ts
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const PRIVATE_ROUTES = [
	'/account',
	'/admin',
	'/forgotPassword',
	'/login',
	'/register',
	'/resetPassword',
	'/users'
];
const SEARCH_AND_USER_CRAWLERS = [
	'OAI-SearchBot',
	'Claude-SearchBot',
	'PerplexityBot',
	'meta-webindexer',
	'ChatGPT-User',
	'Claude-User',
	'Perplexity-User',
	'meta-externalfetcher'
];
const TRAINING_CRAWLERS = [
	'GPTBot',
	'ClaudeBot',
	'anthropic-ai',
	'CCBot',
	'Google-Extended',
	'Applebot-Extended',
	'meta-externalagent'
];

describe('public delivery policy', () => {
	it('keeps search and user-directed AI retrieval open while excluding private routes', () => {
		const robots = readFileSync(path.join(ROOT, 'static', 'robots.txt'), 'utf8');
		const blocks = robots.split(/\n\s*\n/);

		for (const crawler of SEARCH_AND_USER_CRAWLERS) {
			const block = blocks.find((candidate) =>
				candidate.split('\n').some((line) => line.trim() === `User-agent: ${crawler}`)
			);
			expect(block, `missing robots group for ${crawler}`).toBeDefined();

			for (const route of PRIVATE_ROUTES) {
				expect(block).toContain(`Disallow: ${route}`);
			}
			expect(block).toContain('Allow: /');
		}
	});

	it('disallows named model-training and bulk-corpus crawlers', () => {
		const robots = readFileSync(path.join(ROOT, 'static', 'robots.txt'), 'utf8');
		const blocks = robots.split(/\n\s*\n/);

		for (const crawler of TRAINING_CRAWLERS) {
			const block = blocks.find((candidate) =>
				candidate.split('\n').some((line) => line.trim() === `User-agent: ${crawler}`)
			);
			expect(block, `missing robots group for ${crawler}`).toBeDefined();
			expect(block).toContain('Disallow: /');
		}
	});

	it('publishes a no-training license without exposing a full LLM corpus manifest', () => {
		const robots = readFileSync(path.join(ROOT, 'static', 'robots.txt'), 'utf8');
		const license = readFileSync(path.join(ROOT, 'static', 'license.xml'), 'utf8');
		const llms = readFileSync(path.join(ROOT, 'static', 'llms.txt'), 'utf8');

		expect(robots).toContain('License: https://9takes.com/license.xml');
		expect(license).toContain('<prohibits type="usage">ai-train</prohibits>');
		expect(llms).toContain('https://9takes.com/ai-use-policy.txt');
		expect(llms).not.toContain('llms-full.txt');
		expect(existsSync(path.join(ROOT, 'static', 'llms-full.txt'))).toBe(false);
	});

	it('gives stable media a bounded browser cache and fonts an immutable cache', () => {
		const config = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')) as {
			headers?: Array<{
				source: string;
				headers: Array<{ key: string; value: string }>;
			}>;
		};
		const policies = new Map(
			(config.headers ?? []).map((entry) => [
				entry.source,
				entry.headers.find((header) => header.key.toLowerCase() === 'cache-control')?.value
			])
		);

		expect(policies.get('/fonts/:path*')).toBe('public, max-age=31536000, immutable');

		for (const source of [
			'/blogs/:path*',
			'/books/:path*',
			'/brand/:path*',
			'/icons/:path*',
			'/types/:path*'
		]) {
			const policy = policies.get(source);
			expect(policy, `missing cache policy for ${source}`).toContain('max-age=86400');
			expect(policy).toContain('stale-while-revalidate=604800');
			expect(policy).not.toContain('immutable');
		}
	});

	it('redirects the retired embedded preview SVG to the equivalent PNG', () => {
		const config = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')) as {
			redirects?: Array<{ source: string; destination: string; permanent?: boolean }>;
		};
		const redirect = (config.redirects ?? []).find(
			(entry) => entry.source === '/9takes-preview.svg'
		);

		expect(redirect).toEqual({
			source: '/9takes-preview.svg',
			destination: '/9takes-preview.png',
			permanent: true
		});
	});

	it('redirects archived source masters to their reviewed delivery files', () => {
		const config = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')) as {
			redirects?: Array<{ source: string; destination: string; permanent?: boolean }>;
		};
		const redirects = new Map((config.redirects ?? []).map((entry) => [entry.source, entry]));
		const expected = new Map([
			['/books/48-laws-of-power.PNG', '/books/48-laws-of-power.webp'],
			['/books/michelle-book-becoming.PNG', '/books/michelle-book-becoming.webp'],
			['/books/spare.PNG', '/books/spare.webp'],
			['/brand/dj-profile-pic.jpg', '/brand/dj-profile-pic.webp']
		]);

		for (const [source, destination] of expected) {
			expect(redirects.get(source)).toEqual({ source, destination, permanent: true });
		}
	});

	it('recovers apostrophe slugs normalized by the Vercel edge', () => {
		const config = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')) as {
			redirects?: Array<{ source: string; destination: string; permanent?: boolean }>;
		};
		const redirects = new Map((config.redirects ?? []).map((entry) => [entry.source, entry]));
		const expected = new Map([
			['/personality-analysis/charli-d-27amelio', '/personality-analysis/charli-damelio'],
			['/personality-analysis/dixie-d-27amelio', '/personality-analysis/dixie-damelio']
		]);

		for (const [source, destination] of expected) {
			expect(redirects.get(source)).toEqual({ source, destination, permanent: true });
		}
	});
});
