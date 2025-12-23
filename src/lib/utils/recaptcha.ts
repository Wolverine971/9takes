// src/lib/utils/recaptcha.ts
import { RECAPTCHA_SECRET_KEY } from '$env/static/private';
import { dev } from '$app/environment';

interface RecaptchaVerifyResponse {
	success: boolean;
	'error-codes'?: string[];
	challenge_ts?: string;
	hostname?: string;
	score?: number; // For reCAPTCHA v3
	action?: string; // For reCAPTCHA v3
}

// Google's test secret key that always passes (for localhost development)
// See: https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
const RECAPTCHA_TEST_SECRET_KEY = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

/**
 * Verify a reCAPTCHA token with Google's API
 * @param token - The g-recaptcha-response token from the form
 * @param ip - Optional IP address of the user (for additional security)
 * @returns Promise<boolean> - true if verification passed
 */
export async function verifyRecaptcha(token: string, ip?: string): Promise<boolean> {
	if (!token) {
		// In dev mode without a token, allow through for easier testing
		if (dev) {
			console.warn('[DEV] No reCAPTCHA token provided, allowing through in development mode');
			return true;
		}
		return false;
	}

	// Use test key in development if no real key is configured
	const secretKey = RECAPTCHA_SECRET_KEY || (dev ? RECAPTCHA_TEST_SECRET_KEY : null);

	if (!secretKey) {
		console.error('RECAPTCHA_SECRET_KEY is not configured');
		return false;
	}

	try {
		const params = new URLSearchParams();
		params.append('secret', secretKey);
		params.append('response', token);
		if (ip) {
			params.append('remoteip', ip);
		}

		const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: params.toString()
		});

		const result: RecaptchaVerifyResponse = await response.json();

		if (!result.success) {
			console.warn('reCAPTCHA verification failed:', result['error-codes']);
		}

		return result.success;
	} catch (error) {
		console.error('reCAPTCHA verification error:', error);
		return false;
	}
}

// Legacy alias for backward compatibility during migration
export const verifyTurnstile = verifyRecaptcha;

/**
 * Check if honeypot field was filled (indicates bot)
 * @param value - The honeypot field value
 * @returns true if it's a bot (field was filled)
 */
export function isHoneypotTriggered(value: string | null | undefined): boolean {
	return !!value && value.length > 0;
}
