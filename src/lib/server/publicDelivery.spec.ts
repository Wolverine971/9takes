// src/lib/server/publicDelivery.spec.ts
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	getContentAccessDecision,
	getContentRequester,
	getProtectedContentPath,
	isTrackableContentRequester
} from './contentAccessGuard';

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
const NAMED_CRAWLERS = [
	'OAI-SearchBot',
	'Claude-SearchBot',
	'PerplexityBot',
	'meta-webindexer',
	'GPTBot',
	'ClaudeBot',
	'anthropic-ai',
	'CCBot',
	'Google-Extended'
];

describe('public delivery policy', () => {
	it('lets a named crawler complete the current protected sitemap in one pass', () => {
		const sitemap = readFileSync(path.join(ROOT, 'static', 'sitemap.xml'), 'utf8');
		const protectedUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
			.map((match) => getProtectedContentPath(new URL(match[1]).pathname))
			.filter((pathname): pathname is string => Boolean(pathname));
		const requestCount = new Set(protectedUrls).size;
		const requester = getContentRequester({
			method: 'GET',
			pathname: protectedUrls[0],
			userAgent: 'GPTBot/1.0',
			clientIp: '203.0.113.30',
			anonymousId: null,
			isAuthenticated: false
		});

		if (!requester || !isTrackableContentRequester(requester)) {
			throw new Error('Expected a trackable named crawler');
		}

		expect(requestCount).toBeGreaterThan(500);
		expect(
			getContentAccessDecision(requester, {
				total_10m: requestCount,
				unique_10m: requestCount,
				total_1h: requestCount,
				unique_1h: requestCount,
				total_24h: requestCount,
				unique_24h: requestCount
			})
		).toEqual({ action: 'allow' });
	});

	it('repeats private-route exclusions for every named crawler group', () => {
		const robots = readFileSync(path.join(ROOT, 'static', 'robots.txt'), 'utf8');
		const blocks = robots.split(/\n\s*\n/);

		for (const crawler of NAMED_CRAWLERS) {
			const block = blocks.find((candidate) =>
				candidate.split('\n').some((line) => line.trim() === `User-agent: ${crawler}`)
			);
			expect(block, `missing robots group for ${crawler}`).toBeDefined();

			for (const route of PRIVATE_ROUTES) {
				expect(block).toContain(`Disallow: ${route}`);
			}
		}
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
});
