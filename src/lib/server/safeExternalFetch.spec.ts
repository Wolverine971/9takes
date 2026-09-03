// src/lib/server/safeExternalFetch.spec.ts
import { describe, expect, it, vi } from 'vitest';
import { isPublicIpv4, validatePublicWebUrl, fetchPublicHtml } from './safeExternalFetch';
import axios from 'axios';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

describe('link preview SSRF protection', () => {
	it.each([
		'127.0.0.2',
		'10.2.3.4',
		'169.254.169.254',
		'172.16.2.1',
		'192.168.1.1',
		'100.64.0.1',
		'198.18.0.1',
		'0.0.0.0',
		'224.0.0.1',
		'::1',
		'::ffff:127.0.0.1'
	])('rejects non-public address %s', (address) => expect(isPublicIpv4(address)).toBe(false));
	it('accepts public IPv4 addresses', () => expect(isPublicIpv4('8.8.8.8')).toBe(true));
	it.each([
		'http://2130706433/',
		'http://0177.0.0.1/',
		'http://[::1]/',
		'http://user:pass@example.com/',
		'file:///etc/passwd',
		'http://example.com:22/'
	])('rejects unsafe URL %s', (url) => expect(() => validatePublicWebUrl(url)).toThrow());
	it('validates redirects before opening the destination', async () => {
		vi.mocked(axios.get).mockResolvedValueOnce({
			status: 302,
			headers: { location: 'http://169.254.169.254/' }
		});
		await expect(fetchPublicHtml('https://example.com/')).rejects.toThrow();
		expect(axios.get).toHaveBeenCalledTimes(1);
	});
});
