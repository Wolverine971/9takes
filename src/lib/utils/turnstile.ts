// src/lib/utils/turnstile.ts
import { TURNSTILE_SECRET_KEY } from '$env/static/private';
import { dev } from '$app/environment';

interface TurnstileVerifyResponse {
	success: boolean;
	'error-codes'?: string[];
	challenge_ts?: string;
	hostname?: string;
}

// Cloudflare's test secret key that always passes (for localhost development)
// See: https://developers.cloudflare.com/turnstile/troubleshooting/testing/
const TURNSTILE_TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';

/**
 * Verify a Turnstile token with Cloudflare's API
 * @param token - The cf-turnstile-response token from the form
 * @param ip - Optional IP address of the user (for additional security)
 * @returns Promise<boolean> - true if verification passed
 */
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
	if (!token) {
		// In dev mode without a token, allow through for easier testing
		if (dev) {
			console.warn('[DEV] No Turnstile token provided, allowing through in development mode');
			return true;
		}
		return false;
	}

	// Use test key in development if no real key is configured
	const secretKey = TURNSTILE_SECRET_KEY || (dev ? TURNSTILE_TEST_SECRET_KEY : null);

	if (!secretKey) {
		console.error('TURNSTILE_SECRET_KEY is not configured');
		return false;
	}

	try {
		const formData = new FormData();
		formData.append('secret', secretKey);
		formData.append('response', token);
		if (ip) {
			formData.append('remoteip', ip);
		}

		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			body: formData
		});

		const result: TurnstileVerifyResponse = await response.json();

		if (!result.success) {
			console.warn('Turnstile verification failed:', result['error-codes']);
		}

		return result.success;
	} catch (error) {
		console.error('Turnstile verification error:', error);
		return false;
	}
}

/**
 * Check if honeypot field was filled (indicates bot)
 * @param value - The honeypot field value
 * @returns true if it's a bot (field was filled)
 */
export function isHoneypotTriggered(value: string | null | undefined): boolean {
	return !!value && value.length > 0;
}
