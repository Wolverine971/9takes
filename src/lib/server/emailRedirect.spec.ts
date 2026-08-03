// src/lib/server/emailRedirect.spec.ts
import { describe, expect, it } from 'vitest';
import { isAllowedRedirectTarget } from './emailRedirect';

describe('isAllowedRedirectTarget', () => {
	it('allows our own hosts', () => {
		expect(isAllowedRedirectTarget('https://9takes.com/questions/some-slug')).toBe(true);
		expect(isAllowedRedirectTarget('https://www.9takes.com/')).toBe(true);
	});

	it('refuses to forward to an attacker-chosen host', () => {
		expect(isAllowedRedirectTarget('https://evil.example.com/phish')).toBe(false);
	});

	it('refuses lookalike hosts that merely contain our domain', () => {
		expect(isAllowedRedirectTarget('https://9takes.com.evil.example')).toBe(false);
		expect(isAllowedRedirectTarget('https://evil.example/9takes.com')).toBe(false);
		expect(isAllowedRedirectTarget('https://not-9takes.com/')).toBe(false);
	});

	it('ignores userinfo tricks that put our domain before the real host', () => {
		expect(isAllowedRedirectTarget('https://9takes.com@evil.example/')).toBe(false);
		expect(isAllowedRedirectTarget('https://user:password@9takes.com/')).toBe(false);
	});

	it('rejects nonstandard ports', () => {
		expect(isAllowedRedirectTarget('https://9takes.com:444/questions')).toBe(false);
	});

	it('rejects non-http protocols', () => {
		expect(isAllowedRedirectTarget('javascript:alert(1)')).toBe(false);
		expect(isAllowedRedirectTarget('data:text/html,<script>alert(1)</script>')).toBe(false);
		expect(isAllowedRedirectTarget('file:///etc/passwd')).toBe(false);
	});

	it('rejects malformed input', () => {
		expect(isAllowedRedirectTarget('')).toBe(false);
		expect(isAllowedRedirectTarget('not a url')).toBe(false);
		expect(isAllowedRedirectTarget('/questions/relative')).toBe(false);
	});

	it('matches the host case-insensitively', () => {
		expect(isAllowedRedirectTarget('https://9TAKES.com/x')).toBe(true);
	});
});
