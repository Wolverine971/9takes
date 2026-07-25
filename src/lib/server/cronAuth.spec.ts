// src/lib/server/cronAuth.spec.ts
import { describe, expect, it } from 'vitest';
import { isAuthorizedCronRequest } from './cronAuth';

describe('isAuthorizedCronRequest', () => {
	it('fails closed when no cron secret is configured', () => {
		// These endpoints send real email. A missing secret must break the job,
		// not turn it into a public trigger.
		expect(isAuthorizedCronRequest(null, [undefined, null, ''])).toBe(false);
		expect(isAuthorizedCronRequest('Bearer anything', [undefined, null, ''])).toBe(false);
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

	it('rejects a malformed or empty authorization header', () => {
		expect(isAuthorizedCronRequest('expected-secret', ['expected-secret'])).toBe(false);
		expect(isAuthorizedCronRequest('Bearer ', ['expected-secret'])).toBe(false);
		expect(isAuthorizedCronRequest('Basic expected-secret', ['expected-secret'])).toBe(false);
	});

	it('rejects a token that merely shares a prefix with the secret', () => {
		expect(isAuthorizedCronRequest('Bearer expected', ['expected-secret'])).toBe(false);
		expect(isAuthorizedCronRequest('Bearer expected-secret-extra', ['expected-secret'])).toBe(
			false
		);
	});
});
