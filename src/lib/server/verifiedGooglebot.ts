// src/lib/server/verifiedGooglebot.ts
//
// Verified-Googlebot check for gated content (T-43). A user agent is a claim,
// not proof: anyone can send "Googlebot". Google's documented check is a
// reverse DNS lookup on the requesting IP, a hostname under a Google crawler
// domain, then a forward lookup that resolves back to the same IP:
// https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests
//
// Scope is deliberately narrow:
//   * Only Googlebot (all its variants) and Google-InspectionTool (GSC URL
//     Inspection and the Rich Results Test) are admitted. Both are Google
//     "common crawlers", which resolve to *.googlebot.com.
//   * googleusercontent.com is NOT accepted even though Google's doc lists it:
//     that domain is where Google's user-triggered fetchers live, but it is
//     also the default PTR for every Google Cloud customer VM
//     (x.x.x.x.bc.googleusercontent.com), so a GCP box with a Googlebot UA
//     would pass. No crawler we admit uses it.
//   * Fails closed. Missing IP, odd IP, DNS error or timeout all mean "not
//     Googlebot"; the caller then serves the normal human page.
//
// Results are memoized per IP in this instance with a TTL, so a crawl burst
// costs one lookup pair per IP instead of one per page.
import { Resolver } from 'node:dns/promises';
import { isIP } from 'node:net';

const GOOGLE_CRAWLER_USER_AGENT = /\b(?:googlebot|google-inspectiontool)\b/i;
const GOOGLE_CRAWLER_HOST_SUFFIXES = ['.googlebot.com', '.google.com'];

export const VERIFIED_TTL_MS = 6 * 60 * 60 * 1000;
export const NOT_GOOGLE_TTL_MS = 60 * 60 * 1000;
export const LOOKUP_ERROR_TTL_MS = 5 * 60 * 1000;
export const VERIFY_TIMEOUT_MS = 1500;
const MAX_CACHE_ENTRIES = 2000;

export type GooglebotDns = {
	reverse(ip: string): Promise<string[]>;
	resolve4(hostname: string): Promise<string[]>;
	resolve6(hostname: string): Promise<string[]>;
};

export type GooglebotRequest = {
	userAgent: string | null | undefined;
	ip: string | null | undefined;
};

type CacheEntry = { verified: boolean; expiresAt: number };
type LookupOutcome = 'verified' | 'not_google' | 'lookup_error';

/** Cheap first gate: does the request even claim to be a crawler we admit? */
export function isGoogleCrawlerUserAgent(userAgent: string | null | undefined): boolean {
	return Boolean(userAgent && GOOGLE_CRAWLER_USER_AGENT.test(userAgent));
}

export function isGoogleCrawlerHostname(hostname: string): boolean {
	const host = hostname.trim().toLowerCase().replace(/\.$/, '');
	return GOOGLE_CRAWLER_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

/**
 * Canonical text form of an IP so "2001:4860:4801:10::1" and its expanded
 * spelling compare equal, and "::ffff:66.249.66.1" (an IPv4-mapped IPv6
 * address, which some proxies report) compares as plain IPv4.
 */
export function canonicalIp(raw: string | null | undefined): string | null {
	if (!raw) return null;
	let value = raw.trim();
	if (!value) return null;
	// Strip an IPv6 zone index and surrounding brackets.
	value = value.replace(/^\[|\]$/g, '').replace(/%.*$/, '');

	const mapped = value.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
	if (mapped) value = mapped[1];

	const family = isIP(value);
	if (family === 4) return value;
	if (family !== 6) return null;
	return expandIpv6(value);
}

function expandIpv6(value: string): string | null {
	let address = value.toLowerCase();
	// An embedded dotted IPv4 tail becomes two hex groups.
	const ipv4Tail = address.match(/(\d{1,3}(?:\.\d{1,3}){3})$/);
	if (ipv4Tail) {
		const octets = ipv4Tail[1].split('.').map(Number);
		const high = ((octets[0] << 8) | octets[1]).toString(16);
		const low = ((octets[2] << 8) | octets[3]).toString(16);
		address = `${address.slice(0, -ipv4Tail[1].length)}${high}:${low}`;
	}

	const halves = address.split('::');
	if (halves.length > 2) return null;
	const head = halves[0] ? halves[0].split(':') : [];
	const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
	const missing = 8 - head.length - tail.length;
	if (halves.length === 1 && missing !== 0) return null;
	if (missing < 0) return null;

	const groups = [...head, ...Array(halves.length === 2 ? missing : 0).fill('0'), ...tail];
	if (groups.length !== 8) return null;
	return groups.map((group) => group.padStart(4, '0')).join(':');
}

function createSystemDns(timeoutMs: number): GooglebotDns {
	// c-ares resolver (not getaddrinfo), with its own timeout, so a slow DNS
	// server can't tie up libuv's thread pool.
	const resolver = new Resolver({ timeout: Math.max(250, Math.floor(timeoutMs / 2)), tries: 1 });
	return {
		reverse: (ip) => resolver.reverse(ip),
		resolve4: (hostname) => resolver.resolve4(hostname),
		resolve6: (hostname) => resolver.resolve6(hostname)
	};
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error('verification timed out')), timeoutMs);
		(timer as { unref?: () => void }).unref?.();
		promise.then(
			(value) => {
				clearTimeout(timer);
				resolve(value);
			},
			(reason) => {
				clearTimeout(timer);
				reject(reason);
			}
		);
	});
}

export function createGooglebotVerifier(
	options: {
		dns?: GooglebotDns;
		now?: () => number;
		timeoutMs?: number;
		maxEntries?: number;
	} = {}
) {
	const timeoutMs = options.timeoutMs ?? VERIFY_TIMEOUT_MS;
	const now = options.now ?? Date.now;
	const maxEntries = options.maxEntries ?? MAX_CACHE_ENTRIES;
	let dns = options.dns;
	const cache = new Map<string, CacheEntry>();
	const inflight = new Map<string, Promise<boolean>>();

	async function lookup(ip: string): Promise<LookupOutcome> {
		dns ??= createSystemDns(timeoutMs);
		const family = isIP(ip);
		const hostnames = await dns.reverse(ip);
		for (const hostname of hostnames) {
			if (!isGoogleCrawlerHostname(hostname)) continue;
			const host = hostname.trim().toLowerCase().replace(/\.$/, '');
			const addresses = family === 6 ? await dns.resolve6(host) : await dns.resolve4(host);
			if (addresses.some((address) => canonicalIp(address) === ip)) return 'verified';
		}
		return 'not_google';
	}

	function remember(ip: string, outcome: LookupOutcome) {
		const ttl =
			outcome === 'verified'
				? VERIFIED_TTL_MS
				: outcome === 'not_google'
					? NOT_GOOGLE_TTL_MS
					: LOOKUP_ERROR_TTL_MS;
		cache.delete(ip);
		cache.set(ip, { verified: outcome === 'verified', expiresAt: now() + ttl });
		// Map keeps insertion order, so the first key is the oldest entry.
		while (cache.size > maxEntries) {
			const oldest = cache.keys().next().value;
			if (oldest === undefined) break;
			cache.delete(oldest);
		}
	}

	async function isVerifiedGooglebot({ userAgent, ip }: GooglebotRequest): Promise<boolean> {
		if (!isGoogleCrawlerUserAgent(userAgent)) return false;
		const address = canonicalIp(ip);
		if (!address) return false;

		const cached = cache.get(address);
		if (cached && cached.expiresAt > now()) return cached.verified;

		const pending = inflight.get(address);
		if (pending) return pending;

		const check = withTimeout(lookup(address), timeoutMs)
			.catch((): LookupOutcome => 'lookup_error')
			.then((outcome) => {
				remember(address, outcome);
				return outcome === 'verified';
			})
			.finally(() => inflight.delete(address));
		inflight.set(address, check);
		return check;
	}

	return {
		isVerifiedGooglebot,
		clear() {
			cache.clear();
			inflight.clear();
		}
	};
}

const defaultVerifier = createGooglebotVerifier();

/**
 * True only for a request whose user agent claims Googlebot (or Google's URL
 * Inspection tool) AND whose IP reverse-resolves to a Google crawler host that
 * forward-resolves back to the same IP. Never throws.
 */
export function isVerifiedGooglebot(request: GooglebotRequest): Promise<boolean> {
	return defaultVerifier.isVerifiedGooglebot(request);
}
