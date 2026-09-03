// src/lib/server/securityHeaders.ts
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
	headers.set('X-Frame-Options', 'SAMEORIGIN');
	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	headers.set(
		'Permissions-Policy',
		'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(self), payment=(), usb=()'
	);
	if (!development) headers.set('Strict-Transport-Security', 'max-age=63072000');
}
