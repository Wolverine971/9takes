import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { logger } from '$lib/utils/logger';

type VerificationResult = 'verified' | 'invalid' | 'unavailable';

/** A token is redeemed once, on the server, before saving a suggestion. */
export async function verifyPersonSuggestionToken(
	token: unknown,
	clientAddress: string
): Promise<VerificationResult> {
	if (typeof token !== 'string' || !token.trim() || token.length > 2048) return 'invalid';
	const secret = env.TURNSTILE_SECRET_KEY;
	if (!secret) {
		logger.error('Person suggestion verification is not configured');
		return 'unavailable';
	}

	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ secret, response: token, remoteip: clientAddress }),
			signal: AbortSignal.timeout(10_000)
		});
		if (!response.ok) return 'unavailable';
		const result: unknown = await response.json();
		if (!result || typeof result !== 'object') return 'unavailable';
		const { success, action, hostname } = result as Record<string, unknown>;
		const hostnames = dev ? ['localhost', '127.0.0.1'] : ['9takes.com', 'www.9takes.com'];
		return success === true &&
			action === 'person_suggestion' &&
			typeof hostname === 'string' &&
			hostnames.includes(hostname)
			? 'verified'
			: 'invalid';
	} catch {
		// Never allow a provider outage (or an invalid response) to bypass the gate.
		logger.warn('Person suggestion verification unavailable');
		return 'unavailable';
	}
}
