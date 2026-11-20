// src/utils/cookies.spec.ts
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getCookie, setCookie } from './cookies';

function stubBrowser(protocol: 'http:' | 'https:') {
	const written: string[] = [];
	const doc = {
		get cookie() {
			return written.map((entry) => entry.split(';')[0]).join('; ');
		},
		set cookie(value: string) {
			written.push(value);
		}
	};
	vi.stubGlobal('document', doc);
	vi.stubGlobal('location', { protocol });
	return written;
}

describe('setCookie', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('marks the cookie Secure and SameSite=Lax on https', () => {
		const written = stubBrowser('https:');
		setCookie('9tfingerprint', 'visitor-1', 365);

		expect(written).toHaveLength(1);
		expect(written[0]).toMatch(
			/^9tfingerprint=visitor-1; expires=[^;]+; path=\/; SameSite=Lax; Secure$/
		);
		expect(getCookie('9tfingerprint')).toBe('visitor-1');
	});

	it('leaves Secure off over plain http so local development keeps working', () => {
		const written = stubBrowser('http:');
		setCookie('9tfingerprint', 'visitor-1');

		expect(written[0]).toBe('9tfingerprint=visitor-1; path=/; SameSite=Lax');
	});
});
