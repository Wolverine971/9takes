// src/lib/server/linkSigning.ts
//
// One place for the HMAC key behind signed email links (host desk one-tap
// links, reply-return links, reply-email unsubscribe links).
//
// New links are signed with PRIVATE_LINK_SIGNING_SECRET once it is set. Until
// then, and for links that were sent before it was set, the service key signs
// and verifies as it always has, so adding the variable never breaks a link
// that is already in someone's inbox.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';

export const LINK_SIGNING_SECRET_MIN_LENGTH = 32;

export type LinkSigningOptions = {
	/** Pins a single secret for both signing and verifying. Used by tests. */
	secret?: string;
};

function getDedicatedSecret(): string | null {
	const value = env.PRIVATE_LINK_SIGNING_SECRET?.trim() ?? '';
	return value.length >= LINK_SIGNING_SECRET_MIN_LENGTH ? value : null;
}

/** The signing secret first, followed by any other secret a live link may still carry. */
export function getLinkSigningSecrets(explicitSecret?: string): string[] {
	if (explicitSecret) return [explicitSecret];

	const secrets = [getDedicatedSecret(), SUPABASE_SERVICE_KEY || null].filter(
		(secret): secret is string => Boolean(secret)
	);
	if (secrets.length === 0) throw new Error('Link signing secret is not configured');

	return [...new Set(secrets)];
}

function computeSignature(payload: string, secret: string): string {
	return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function signLinkPayload(payload: string, options: LinkSigningOptions = {}): string {
	return computeSignature(payload, getLinkSigningSecrets(options.secret)[0]);
}

export function verifyLinkSignature(
	payload: string,
	signature: string,
	options: LinkSigningOptions = {}
): boolean {
	const provided = Buffer.from(signature);
	let valid = false;

	// Every candidate is checked, so timing does not depend on which secret matched.
	for (const secret of getLinkSigningSecrets(options.secret)) {
		const expected = Buffer.from(computeSignature(payload, secret));
		if (provided.length === expected.length && timingSafeEqual(provided, expected)) {
			valid = true;
		}
	}

	return valid;
}
