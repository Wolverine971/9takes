// src/lib/server/emailRedirect.ts
//
// Click tracking decodes a target URL out of the request path and redirects to
// it. Validating only the protocol leaves an open redirect: any attacker can
// wrap their own destination in a 9takes.com link, which is exactly the shape
// a phishing campaign wants. Our own emails only link back to our own hosts,
// so an allowlist costs nothing.

/** Hosts our own emails link to. Anything else is not ours to forward to. */
const ALLOWED_REDIRECT_HOSTS = new Set(['9takes.com', 'www.9takes.com']);

export function isAllowedRedirectTarget(targetUrl: string): boolean {
	let url: URL;
	try {
		url = new URL(targetUrl);
	} catch {
		return false;
	}

	if (url.protocol !== 'https:' && url.protocol !== 'http:') {
		return false;
	}
	if (url.username || url.password || url.port) return false;

	return ALLOWED_REDIRECT_HOSTS.has(url.hostname.toLowerCase());
}
