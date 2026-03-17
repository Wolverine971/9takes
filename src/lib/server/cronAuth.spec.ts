// src/lib/server/cronAuth.spec.ts
import { describe, expect, it } from 'vitest';
import { isAuthorizedCronRequest } from './cronAuth';

describe('isAuthorizedCronRequest', () => {
	it('allows requests when no cron secret is configured', () => {
		expect(isAuthorizedCronRequest(null, [undefined, null, ''])).toBe(true);
	});

	it('accepts a bearer token matching either configured secret', () => {
		expect(isAuthorizedCronRequest('Bearer from-runtime', ['from-static', 'from-runtime'])).toBe(
			true
		);
		expect(isAuthorizedCronRequest('Bearer from-static', ['from-static', 'from-runtime'])).toBe(
			true
		);
	});

	it('rejects missing or mismatched bearer tokens when secrets exist', () => {
		expect(isAuthorizedCronRequest(null, ['expected-secret'])).toBe(false);
		expect(isAuthorizedCronRequest('Bearer wrong-secret', ['expected-secret'])).toBe(false);
	});
});
