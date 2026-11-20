// src/lib/server/securityHeaders.ts

// vercel.json repeats these three for static files, which never reach the server hook.
export const STATIC_FILE_SECURITY_HEADERS = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
	'Referrer-Policy': 'strict-origin-when-cross-origin'
} as const;

const DEFAULT_REFERRER_POLICY = STATIC_FILE_SECURITY_HEADERS['Referrer-Policy'];
const STRICTER_REFERRER_POLICIES = new Set(['no-referrer', 'same-origin', 'strict-origin']);

/** Keep header coverage consistent for pages, endpoints, redirects and errors. */
export function applySecurityHeaders(headers: Headers, development = false) {
	// SvelteKit supplies the full script policy with hashes for its inline code.
	// Raw endpoint responses still need framing and object restrictions.
	if (!headers.has('Content-Security-Policy')) {
		headers.set(
			'Content-Security-Policy',
			"default-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'; form-action 'self'"
		);
	}
	headers.set('X-Frame-Options', STATIC_FILE_SECURITY_HEADERS['X-Frame-Options']);
	headers.set('X-Content-Type-Options', STATIC_FILE_SECURITY_HEADERS['X-Content-Type-Options']);
	// Endpoints behind a token link ask for `no-referrer`; a response may tighten the default,
	// never loosen it.
	const referrerPolicy = headers.get('Referrer-Policy')?.trim().toLowerCase() ?? '';
	if (!STRICTER_REFERRER_POLICIES.has(referrerPolicy)) {
		headers.set('Referrer-Policy', DEFAULT_REFERRER_POLICY);
	}
	headers.set(
		'Permissions-Policy',
		'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(self), payment=(), usb=()'
	);
	if (!development) headers.set('Strict-Transport-Security', 'max-age=63072000');
}
