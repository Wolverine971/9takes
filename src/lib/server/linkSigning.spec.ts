// src/lib/server/linkSigning.spec.ts
import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { environment, LEGACY_SECRET } = vi.hoisted(() => ({
	environment: {} as Record<string, string | undefined>,
	LEGACY_SECRET: 'legacy-service-key-used-only-in-this-spec'
}));
vi.mock('$env/dynamic/private', () => ({ env: environment }));
vi.mock('$env/static/private', () => ({ SUPABASE_SERVICE_KEY: LEGACY_SECRET }));

import {
	LINK_SIGNING_SECRET_MIN_LENGTH,
	getLinkSigningSecrets,
	signLinkPayload,
	verifyLinkSignature
} from './linkSigning';

const DEDICATED_SECRET = 'dedicated-link-signing-secret-0123456789';
const PAYLOAD = 'eyJ2IjoxfQ';

const hmac = (payload: string, secret: string) =>
	createHmac('sha256', secret).update(payload).digest('base64url');

describe('link signing', () => {
	beforeEach(() => {
		delete environment.PRIVATE_LINK_SIGNING_SECRET;
	});

	it('signs with the dedicated secret when it is set', () => {
		environment.PRIVATE_LINK_SIGNING_SECRET = DEDICATED_SECRET;

		expect(DEDICATED_SECRET.length).toBeGreaterThanOrEqual(LINK_SIGNING_SECRET_MIN_LENGTH);
		expect(signLinkPayload(PAYLOAD)).toBe(hmac(PAYLOAD, DEDICATED_SECRET));
		expect(signLinkPayload(PAYLOAD)).not.toBe(hmac(PAYLOAD, LEGACY_SECRET));
		expect(verifyLinkSignature(PAYLOAD, signLinkPayload(PAYLOAD))).toBe(true);
	});

	it('ignores surrounding whitespace on the dedicated secret', () => {
		environment.PRIVATE_LINK_SIGNING_SECRET = `  ${DEDICATED_SECRET}\n`;

		expect(signLinkPayload(PAYLOAD)).toBe(hmac(PAYLOAD, DEDICATED_SECRET));
	});

	it('still verifies links signed with the service key after the dedicated secret is added', () => {
		const sentBefore = signLinkPayload(PAYLOAD);
		expect(sentBefore).toBe(hmac(PAYLOAD, LEGACY_SECRET));

		environment.PRIVATE_LINK_SIGNING_SECRET = DEDICATED_SECRET;

		expect(verifyLinkSignature(PAYLOAD, sentBefore)).toBe(true);
		expect(getLinkSigningSecrets()).toEqual([DEDICATED_SECRET, LEGACY_SECRET]);
	});

	it.each([
		['unset', undefined],
		['empty', ''],
		['blank', '   '],
		['one character short', 'x'.repeat(LINK_SIGNING_SECRET_MIN_LENGTH - 1)],
		['short once trimmed', ` ${'x'.repeat(LINK_SIGNING_SECRET_MIN_LENGTH - 1)} `]
	])('falls back to the service key when the dedicated secret is %s', (_label, value) => {
		if (value === undefined) delete environment.PRIVATE_LINK_SIGNING_SECRET;
		else environment.PRIVATE_LINK_SIGNING_SECRET = value;

		expect(getLinkSigningSecrets()).toEqual([LEGACY_SECRET]);
		expect(signLinkPayload(PAYLOAD)).toBe(hmac(PAYLOAD, LEGACY_SECRET));
		expect(verifyLinkSignature(PAYLOAD, hmac(PAYLOAD, LEGACY_SECRET))).toBe(true);
		if (value) expect(verifyLinkSignature(PAYLOAD, hmac(PAYLOAD, value.trim()))).toBe(false);
	});

	it('accepts a secret of exactly the minimum length', () => {
		const minimal = 'm'.repeat(LINK_SIGNING_SECRET_MIN_LENGTH);
		environment.PRIVATE_LINK_SIGNING_SECRET = minimal;

		expect(signLinkPayload(PAYLOAD)).toBe(hmac(PAYLOAD, minimal));
	});

	it('rejects wrong, altered and malformed signatures', () => {
		environment.PRIVATE_LINK_SIGNING_SECRET = DEDICATED_SECRET;
		const signature = signLinkPayload(PAYLOAD);

		expect(
			verifyLinkSignature(PAYLOAD, hmac(PAYLOAD, 'some-other-secret-that-is-long-enough'))
		).toBe(false);
		expect(verifyLinkSignature(`${PAYLOAD}x`, signature)).toBe(false);
		expect(verifyLinkSignature(PAYLOAD, `${signature}x`)).toBe(false);
		expect(verifyLinkSignature(PAYLOAD, signature.slice(0, -1))).toBe(false);
		expect(verifyLinkSignature(PAYLOAD, '')).toBe(false);
	});

	it('uses only the pinned secret when one is passed', () => {
		environment.PRIVATE_LINK_SIGNING_SECRET = DEDICATED_SECRET;
		const pinned = 'pinned';

		expect(getLinkSigningSecrets(pinned)).toEqual([pinned]);
		expect(signLinkPayload(PAYLOAD, { secret: pinned })).toBe(hmac(PAYLOAD, pinned));
		expect(verifyLinkSignature(PAYLOAD, hmac(PAYLOAD, pinned), { secret: pinned })).toBe(true);
		expect(verifyLinkSignature(PAYLOAD, hmac(PAYLOAD, DEDICATED_SECRET), { secret: pinned })).toBe(
			false
		);
		expect(verifyLinkSignature(PAYLOAD, hmac(PAYLOAD, LEGACY_SECRET), { secret: pinned })).toBe(
			false
		);
	});
});
