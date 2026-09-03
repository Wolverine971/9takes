// src/lib/server/safeExternalFetch.ts
import { lookup } from 'node:dns';
import { Agent as HttpAgent } from 'node:http';
import { Agent as HttpsAgent } from 'node:https';
import { isIP } from 'node:net';
import axios from 'axios';

/** Link previews need public web pages only. IPv6 literals are deliberately
 * unsupported; DNS is resolved to IPv4 and checked at connection time. */
export function isPublicIpv4(address: string): boolean {
	if (isIP(address) !== 4) return false;
	const [a, b, c] = address.split('.').map(Number);
	return !(
		a === 0 ||
		a === 10 ||
		a === 127 ||
		a >= 224 ||
		(a === 100 && b >= 64 && b <= 127) ||
		(a === 169 && b === 254) ||
		(a === 172 && b >= 16 && b <= 31) ||
		(a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) ||
		(a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
		(a === 203 && b === 0 && c === 113)
	);
}

export function validatePublicWebUrl(input: string): URL {
	const url = new URL(input);
	const host = url.hostname.toLowerCase();
	if (
		!['http:', 'https:'].includes(url.protocol) ||
		url.username ||
		url.password ||
		(url.port && !['80', '443'].includes(url.port)) ||
		host === 'localhost' ||
		host.endsWith('.localhost') ||
		host.endsWith('.local') ||
		host.includes(':') ||
		(isIP(host) !== 0 && !isPublicIpv4(host))
	) {
		throw new Error('Link preview requires a public HTTP(S) URL');
	}
	return url;
}

// Validate the address actually used by the socket, not a separate preflight
// DNS result that can change before the HTTP connection (DNS rebinding).
const publicLookup: typeof lookup = ((hostname: string, options: any, callback: any) => {
	lookup(hostname, { all: true, family: 4 }, (error, addresses) => {
		if (error) return callback(error);
		if (!addresses.length || addresses.some(({ address }) => !isPublicIpv4(address))) {
			return callback(new Error('Link preview resolved to a non-public address'));
		}
		if (options?.all) return callback(null, addresses);
		callback(null, addresses[0].address, 4);
	});
}) as typeof lookup;

const httpAgent = new HttpAgent({ lookup: publicLookup });
const httpsAgent = new HttpsAgent({ lookup: publicLookup });

export async function fetchPublicHtml(input: string): Promise<string> {
	let url = validatePublicWebUrl(input);
	const signal = AbortSignal.timeout(5000);
	for (let redirects = 0; redirects <= 3; redirects++) {
		const response = await axios.get<string>(url.toString(), {
			httpAgent,
			httpsAgent,
			proxy: false,
			signal,
			timeout: 5000,
			maxContentLength: 1024 * 1024,
			maxRedirects: 0,
			responseType: 'text',
			validateStatus: (status) => status >= 200 && status < 400,
			headers: { 'User-Agent': '9takes-bot/1.0', Accept: 'text/html' }
		});
		if (response.status >= 300 && response.headers.location) {
			url = validatePublicWebUrl(new URL(response.headers.location, url).toString());
			continue;
		}
		if (!/^text\/html\b/i.test(String(response.headers['content-type'] ?? ''))) {
			throw new Error('Link preview response is not HTML');
		}
		return response.data;
	}
	throw new Error('Too many link preview redirects');
}
