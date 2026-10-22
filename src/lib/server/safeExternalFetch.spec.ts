// src/lib/server/safeExternalFetch.spec.ts
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import zlib from 'node:zlib';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isPublicIpv4, validatePublicWebUrl, fetchPublicHtml } from './safeExternalFetch';
import axios from 'axios';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

beforeEach(() => vi.mocked(axios.get).mockReset());

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

// CVE-2026-111497: a hostile server could send a Brotli body crafted to corrupt
// memory in Node's decoder. Link previews must never decode untrusted bodies.
describe('link preview never decompresses untrusted bodies', () => {
	const html = '<html><head><meta property="og:title" content="ok"></head></html>';

	it('asks for a plain body and turns off axios decompression', async () => {
		vi.mocked(axios.get).mockResolvedValueOnce({
			status: 200,
			headers: { 'content-type': 'text/html; charset=utf-8' },
			data: html
		});
		await expect(fetchPublicHtml('https://example.com/')).resolves.toBe(html);
		expect(vi.mocked(axios.get).mock.lastCall?.[1]).toMatchObject({
			decompress: false,
			headers: { 'Accept-Encoding': 'identity' }
		});
	});

	it.each(['br', 'gzip', 'deflate', 'gzip, br', ' BR '])(
		'refuses a body encoded as %s',
		async (encoding) => {
			vi.mocked(axios.get).mockResolvedValueOnce({
				status: 200,
				headers: { 'content-type': 'text/html', 'content-encoding': encoding },
				data: 'compressed bytes'
			});
			await expect(fetchPublicHtml('https://example.com/')).rejects.toThrow(
				'Link preview response is compressed'
			);
		}
	);

	it('accepts an explicit identity encoding', async () => {
		vi.mocked(axios.get).mockResolvedValueOnce({
			status: 200,
			headers: { 'content-type': 'text/html', 'content-encoding': 'identity' },
			data: html
		});
		await expect(fetchPublicHtml('https://example.com/')).resolves.toBe(html);
	});

	// Uses the real axios against a local server that ignores Accept-Encoding and
	// sends a benign Brotli body. The first request is the control: it proves the
	// spy sees axios's decoder calls, so the second request's zero is meaningful.
	it('real axios with decompress: false never calls the Brotli decoder', async () => {
		const { default: realAxios } = await vi.importActual<typeof import('axios')>('axios');
		const body = zlib.brotliCompressSync(Buffer.from(html));
		const server = createServer((_req, res) => {
			res.writeHead(200, { 'content-type': 'text/html', 'content-encoding': 'br' });
			res.end(body);
		});
		await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
		const decoder = vi.spyOn(zlib, 'createBrotliDecompress');
		try {
			const target = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;

			const decoded = await realAxios.get<string>(target, { proxy: false, responseType: 'text' });
			expect(decoder).toHaveBeenCalledTimes(1);
			expect(decoded.data).toBe(html);

			decoder.mockClear();
			const raw = await realAxios.get<ArrayBuffer>(target, {
				proxy: false,
				decompress: false,
				responseType: 'arraybuffer'
			});
			expect(decoder).not.toHaveBeenCalled();
			expect(Buffer.from(raw.data).equals(body)).toBe(true);
		} finally {
			decoder.mockRestore();
			await new Promise((resolve) => server.close(resolve));
		}
	});
});
