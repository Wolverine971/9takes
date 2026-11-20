// src/lib/server/securityHeaders.spec.ts
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { STATIC_FILE_SECURITY_HEADERS, applySecurityHeaders } from './securityHeaders';

type HeaderRule = { source: string; headers: Array<{ key: string; value: string }> };
type VercelConfig = {
	headers?: HeaderRule[];
	rewrites?: Array<{ source: string; destination: string }>;
};

const vercelConfig = JSON.parse(
	readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')
) as VercelConfig;

/** Vercel anchors a `source` pattern to the whole path. */
const matchesSource = (source: string, pathname: string) =>
	new RegExp(`^${source}$`).test(pathname);

describe('security response headers', () => {
	it('preserves SvelteKit script hashes and sets transport/framing headers', () => {
		const headers = new Headers({
			'Content-Security-Policy': "script-src 'self' 'sha256-example'"
		});
		applySecurityHeaders(headers);
		expect(headers.get('Content-Security-Policy')).toContain('sha256-example');
		expect(headers.get('Strict-Transport-Security')).toContain('63072000');
		expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
		expect(headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
		expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
	});
	it('protects raw endpoint responses', () => {
		const headers = new Headers();
		applySecurityHeaders(headers, true);
		expect(headers.get('Content-Security-Policy')).toContain("object-src 'none'");
		expect(headers.has('Strict-Transport-Security')).toBe(false);
	});

	it.each(['no-referrer', 'same-origin', 'strict-origin', 'No-Referrer'])(
		'keeps the stricter referrer policy %s chosen by a response',
		(policy) => {
			const headers = new Headers({ 'Referrer-Policy': policy });
			applySecurityHeaders(headers);
			expect(headers.get('Referrer-Policy')).toBe(policy);
		}
	);

	it.each(['unsafe-url', 'no-referrer-when-downgrade', 'origin', '', 'nonsense'])(
		'replaces the looser or unknown referrer policy %j with the default',
		(policy) => {
			const headers = new Headers({ 'Referrer-Policy': policy });
			applySecurityHeaders(headers);
			expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
		}
	);
});

describe('static file headers in vercel.json', () => {
	const rules = vercelConfig.headers ?? [];
	const headersFor = (pathname: string) => {
		const applied = new Map<string, string[]>();
		for (const rule of rules) {
			if (!matchesSource(rule.source.replace(/:path\*/g, '.*'), pathname)) continue;
			for (const { key, value } of rule.headers) {
				applied.set(key.toLowerCase(), [...(applied.get(key.toLowerCase()) ?? []), value]);
			}
		}
		return applied;
	};

	it.each([
		'/',
		'/robots.txt',
		'/blogs/example.webp',
		'/fonts/example.woff2',
		'/types/portrait-credits.html',
		'/_app/immutable/chunks/example.js'
	])('sends the same framing, sniffing and referrer headers as the server hook for %s', (file) => {
		const applied = headersFor(file);
		for (const [key, value] of Object.entries(STATIC_FILE_SECURITY_HEADERS)) {
			expect(applied.get(key.toLowerCase()), `${key} on ${file}`).toEqual([value]);
		}
	});

	it('leaves the referrer policy of API responses to the endpoint', () => {
		const applied = headersFor('/api/notifications/email-unsubscribe/example-token');
		expect(applied.get('x-content-type-options')).toEqual(['nosniff']);
		expect(applied.get('x-frame-options')).toEqual(['SAMEORIGIN']);
		expect(applied.has('referrer-policy')).toBe(false);
	});

	it('never sets one header twice for a path, so cache rules stay untouched', () => {
		for (const file of ['/fonts/example.woff2', '/blogs/example.webp', '/variants/a/b.avif']) {
			const applied = headersFor(file);
			expect(applied.get('cache-control'), file).toHaveLength(1);
			for (const [key, values] of applied) {
				expect(values, `${key} on ${file}`).toHaveLength(1);
			}
		}
		expect(headersFor('/robots.txt').has('cache-control')).toBe(false);
	});

	it('does not proxy another origin through this one', () => {
		for (const rewrite of vercelConfig.rewrites ?? []) {
			expect(rewrite.destination, rewrite.source).toMatch(/^\/(?!\/)/);
		}
	});
});
