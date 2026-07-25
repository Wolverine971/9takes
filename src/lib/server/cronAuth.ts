// src/lib/server/cronAuth.ts
import { timingSafeEqual } from 'node:crypto';

function safeEquals(a: string, b: string): boolean {
	const bufferA = Buffer.from(a, 'utf8');
	const bufferB = Buffer.from(b, 'utf8');

	// timingSafeEqual throws on a length mismatch, so compare lengths first and
	// still burn an equal-length comparison to keep the timing profile flat.
	if (bufferA.length !== bufferB.length) {
		timingSafeEqual(bufferA, bufferA);
		return false;
	}

	return timingSafeEqual(bufferA, bufferB);
}

/**
 * Authorize a cron invocation.
 *
 * Fails closed: when no secret is configured, nothing is authorized. These
 * endpoints send real email and advance sequence state, so an unset or
 * mistyped `CRON_SECRET` must break the job rather than open it to the world.
 */
export function isAuthorizedCronRequest(
	authHeader: string | null,
	secrets: Array<string | null | undefined>
) {
	const allowedSecrets = [...new Set(secrets.map((secret) => secret?.trim()).filter(Boolean))];

	if (allowedSecrets.length === 0) {
		return false;
	}

	if (!authHeader?.startsWith('Bearer ')) {
		return false;
	}

	const token = authHeader.slice('Bearer '.length).trim();
	if (!token) {
		return false;
	}

	return allowedSecrets.some((secret) => safeEquals(token, secret as string));
}
