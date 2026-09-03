// src/lib/server/securityHeaders.spec.ts
import { describe, expect, it } from 'vitest';
import { applySecurityHeaders } from './securityHeaders';

describe('security response headers', () => {
	it('preserves SvelteKit script hashes and sets transport/framing headers', () => {
		const headers = new Headers({
			'Content-Security-Policy': "script-src 'self' 'sha256-example'"
		});
		applySecurityHeaders(headers);
		expect(headers.get('Content-Security-Policy')).toContain('sha256-example');
		expect(headers.get('Strict-Transport-Security')).toContain('63072000');
		expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
	});
	it('protects raw endpoint responses', () => {
		const headers = new Headers();
		applySecurityHeaders(headers, true);
		expect(headers.get('Content-Security-Policy')).toContain("object-src 'none'");
		expect(headers.has('Strict-Transport-Security')).toBe(false);
	});
});
