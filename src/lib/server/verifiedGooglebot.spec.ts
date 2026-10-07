// src/lib/server/verifiedGooglebot.spec.ts
import { describe, expect, it, vi } from 'vitest';
import {
	LOOKUP_ERROR_TTL_MS,
	NOT_GOOGLE_TTL_MS,
	VERIFIED_TTL_MS,
	canonicalIp,
	createGooglebotVerifier,
	isGoogleCrawlerHostname,
	isGoogleCrawlerUserAgent,
	type GooglebotDns
} from './verifiedGooglebot';

const GOOGLEBOT_UA =
	'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const INSPECTION_UA =
	'Mozilla/5.0 (compatible; Google-InspectionTool/1.0;) AppleWebKit/537.36 Chrome/141.0.0.0 Safari/537.36';
const CHROME_UA =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const GOOGLE_OTHER_UA = 'Mozilla/5.0 (compatible; GoogleOther)';

const GOOGLE_IP = '66.249.66.1';
const GOOGLE_HOST = 'crawl-66-249-66-1.googlebot.com';
const GOOGLE_IPV6 = '2001:4860:4801:10::1';
const GOOGLE_IPV6_HOST = 'crawl-2001-4860-4801-10--1.googlebot.com';

function fakeDns(overrides: Partial<GooglebotDns> = {}) {
	const dns = {
		reverse: vi.fn(async (ip: string) => {
			if (ip === GOOGLE_IP) return [`${GOOGLE_HOST}.`];
			if (canonicalIp(ip) === canonicalIp(GOOGLE_IPV6)) return [GOOGLE_IPV6_HOST];
			return ['ec2-203-0-113-9.compute-1.amazonaws.com'];
		}),
		resolve4: vi.fn(async (host: string) => (host === GOOGLE_HOST ? [GOOGLE_IP] : [])),
		resolve6: vi.fn(async (host: string) => (host === GOOGLE_IPV6_HOST ? [GOOGLE_IPV6] : [])),
		...overrides
	};
	return dns;
}

describe('verifiedGooglebot', () => {
	it('verifies Googlebot by reverse DNS then forward-confirmed IP', async () => {
		const dns = fakeDns();
		const verifier = createGooglebotVerifier({ dns });
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: GOOGLE_IP })
		).resolves.toBe(true);
		expect(dns.reverse).toHaveBeenCalledWith(GOOGLE_IP);
		expect(dns.resolve4).toHaveBeenCalledWith(GOOGLE_HOST);
	});

	it('verifies IPv6 Googlebot even when the address is spelled differently', async () => {
		const verifier = createGooglebotVerifier({ dns: fakeDns() });
		await expect(
			verifier.isVerifiedGooglebot({
				userAgent: GOOGLEBOT_UA,
				ip: '2001:4860:4801:0010:0000:0000:0000:0001'
			})
		).resolves.toBe(true);
	});

	it('admits Google-InspectionTool (GSC URL Inspection) from a Google IP', async () => {
		const verifier = createGooglebotVerifier({ dns: fakeDns() });
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: INSPECTION_UA, ip: GOOGLE_IP })
		).resolves.toBe(true);
	});

	it('rejects a spoofed Googlebot user agent from a non-Google IP', async () => {
		const verifier = createGooglebotVerifier({ dns: fakeDns() });
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: '203.0.113.9' })
		).resolves.toBe(false);
	});

	it('rejects a forged PTR record that does not forward-resolve to the same IP', async () => {
		const dns = fakeDns({
			reverse: vi.fn(async () => ['crawl-1-2-3-4.googlebot.com']),
			resolve4: vi.fn(async () => ['66.249.66.200'])
		});
		const verifier = createGooglebotVerifier({ dns });
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: '198.51.100.4' })
		).resolves.toBe(false);
	});

	it('rejects googleusercontent.com hosts (any Google Cloud VM has one)', async () => {
		const dns = fakeDns({
			reverse: vi.fn(async () => ['4.100.51.198.bc.googleusercontent.com']),
			resolve4: vi.fn(async () => ['198.51.100.4'])
		});
		const verifier = createGooglebotVerifier({ dns });
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: '198.51.100.4' })
		).resolves.toBe(false);
		expect(dns.resolve4).not.toHaveBeenCalled();
	});

	it('never does DNS for browsers or other Google agents', async () => {
		const dns = fakeDns();
		const verifier = createGooglebotVerifier({ dns });
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: CHROME_UA, ip: GOOGLE_IP })
		).resolves.toBe(false);
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: GOOGLE_OTHER_UA, ip: GOOGLE_IP })
		).resolves.toBe(false);
		await expect(verifier.isVerifiedGooglebot({ userAgent: null, ip: GOOGLE_IP })).resolves.toBe(
			false
		);
		expect(dns.reverse).not.toHaveBeenCalled();
	});

	it('fails closed on a missing or malformed IP', async () => {
		const dns = fakeDns();
		const verifier = createGooglebotVerifier({ dns });
		for (const ip of [null, undefined, '', 'unknown', '999.1.1.1', 'not-an-ip']) {
			await expect(verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip })).resolves.toBe(
				false
			);
		}
		expect(dns.reverse).not.toHaveBeenCalled();
	});

	it('fails closed when DNS errors', async () => {
		const verifier = createGooglebotVerifier({
			dns: fakeDns({
				reverse: vi.fn(async () => {
					throw Object.assign(new Error('queryPtr ENOTFOUND'), { code: 'ENOTFOUND' });
				})
			})
		});
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: GOOGLE_IP })
		).resolves.toBe(false);
	});

	it('fails closed when DNS hangs past the timeout', async () => {
		const verifier = createGooglebotVerifier({
			timeoutMs: 20,
			dns: fakeDns({ reverse: vi.fn(() => new Promise<string[]>(() => {})) })
		});
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: GOOGLE_IP })
		).resolves.toBe(false);
	});

	it('caches per IP: a crawl burst costs one lookup, until the TTL runs out', async () => {
		let clock = 1_000;
		const dns = fakeDns();
		const verifier = createGooglebotVerifier({ dns, now: () => clock });
		const request = { userAgent: GOOGLEBOT_UA, ip: GOOGLE_IP };

		await expect(
			Promise.all([verifier.isVerifiedGooglebot(request), verifier.isVerifiedGooglebot(request)])
		).resolves.toEqual([true, true]);
		await expect(verifier.isVerifiedGooglebot(request)).resolves.toBe(true);
		expect(dns.reverse).toHaveBeenCalledTimes(1);

		clock += VERIFIED_TTL_MS + 1;
		await expect(verifier.isVerifiedGooglebot(request)).resolves.toBe(true);
		expect(dns.reverse).toHaveBeenCalledTimes(2);
	});

	it('caches negatives too, and retries lookup errors sooner than definite misses', async () => {
		let clock = 0;
		let failing = true;
		const reverse = vi.fn(async (ip: string) => {
			if (failing) throw new Error('SERVFAIL');
			return ip === GOOGLE_IP ? [GOOGLE_HOST] : ['host.example.net'];
		});
		const verifier = createGooglebotVerifier({ dns: fakeDns({ reverse }), now: () => clock });

		await expect(
			verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: GOOGLE_IP })
		).resolves.toBe(false);
		failing = false;
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: GOOGLE_IP })
		).resolves.toBe(false);
		clock += LOOKUP_ERROR_TTL_MS + 1;
		await expect(
			verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: GOOGLE_IP })
		).resolves.toBe(true);

		await verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: '203.0.113.9' });
		const callsAfterMiss = reverse.mock.calls.length;
		clock += LOOKUP_ERROR_TTL_MS + 1;
		await verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: '203.0.113.9' });
		expect(reverse.mock.calls.length).toBe(callsAfterMiss);
		clock += NOT_GOOGLE_TTL_MS;
		await verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: '203.0.113.9' });
		expect(reverse.mock.calls.length).toBe(callsAfterMiss + 1);
	});

	it('bounds the cache size', async () => {
		const dns = fakeDns();
		const verifier = createGooglebotVerifier({ dns, maxEntries: 2 });
		for (const ip of ['203.0.113.1', '203.0.113.2', '203.0.113.3']) {
			await verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip });
		}
		await verifier.isVerifiedGooglebot({ userAgent: GOOGLEBOT_UA, ip: '203.0.113.1' });
		expect(dns.reverse).toHaveBeenCalledTimes(4);
	});

	it('normalizes IPs and classifies hosts and agents', () => {
		expect(canonicalIp('::ffff:66.249.66.1')).toBe('66.249.66.1');
		expect(canonicalIp('2001:4860:4801:10::1')).toBe(
			canonicalIp('2001:4860:4801:0010:0000:0000:0000:0001')
		);
		expect(canonicalIp('::')).toBe('0000:0000:0000:0000:0000:0000:0000:0000');
		expect(canonicalIp('garbage')).toBeNull();

		expect(isGoogleCrawlerHostname('crawl-66-249-66-1.googlebot.com.')).toBe(true);
		expect(isGoogleCrawlerHostname('geo-crawl-1.geo.googlebot.com')).toBe(true);
		expect(isGoogleCrawlerHostname('rate-limited-proxy-66-249-90-1.google.com')).toBe(true);
		expect(isGoogleCrawlerHostname('evil-googlebot.com')).toBe(false);
		expect(isGoogleCrawlerHostname('googlebot.com.evil.net')).toBe(false);
		expect(isGoogleCrawlerHostname('1.2.3.4.bc.googleusercontent.com')).toBe(false);

		expect(isGoogleCrawlerUserAgent(GOOGLEBOT_UA)).toBe(true);
		expect(isGoogleCrawlerUserAgent('Googlebot-Image/1.0')).toBe(true);
		expect(isGoogleCrawlerUserAgent(INSPECTION_UA)).toBe(true);
		expect(isGoogleCrawlerUserAgent(GOOGLE_OTHER_UA)).toBe(false);
		expect(isGoogleCrawlerUserAgent('AdsBot-Google (+http://www.google.com/adsbot.html)')).toBe(
			false
		);
		expect(isGoogleCrawlerUserAgent(CHROME_UA)).toBe(false);
	});
});
