// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('loadTurnstile', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.useFakeTimers();
	});

	afterEach(() => {
		document.getElementById('9takes-turnstile')?.remove();
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	it('shares one async script and resolves after load without calling the sync-only ready API', async () => {
		const { loadTurnstile } = await import('./turnstile');
		const first = loadTurnstile();
		expect(loadTurnstile()).toBe(first);
		const script = document.getElementById('9takes-turnstile') as HTMLScriptElement;
		expect(script.src).toBe(
			'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
		);
		const api = {
			render: vi.fn(),
			ready: vi.fn(() => {
				throw new Error('Remove async/defer before calling turnstile.ready()');
			})
		};
		vi.stubGlobal('turnstile', api);
		script.dispatchEvent(new Event('load'));
		await expect(first).resolves.toBe(api);
		expect(api.ready).not.toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(0);
	});

	it('removes a failed script and allows a fresh retry', async () => {
		const { loadTurnstile } = await import('./turnstile');
		const first = loadTurnstile();
		const failedScript = document.getElementById('9takes-turnstile')!;
		failedScript.dispatchEvent(new Event('error'));
		await expect(first).rejects.toThrow('Unable to load verification.');
		expect(failedScript.isConnected).toBe(false);
		const retry = loadTurnstile();
		const nextScript = document.getElementById('9takes-turnstile')!;
		expect(nextScript).not.toBe(failedScript);
		const api = { render: vi.fn() };
		vi.stubGlobal('turnstile', api);
		nextScript.dispatchEvent(new Event('load'));
		await expect(retry).resolves.toBe(api);
	});

	it('times out a stalled request instead of leaving the form waiting indefinitely', async () => {
		const { loadTurnstile } = await import('./turnstile');
		const promise = loadTurnstile();
		const result = expect(promise).rejects.toThrow('Unable to load verification.');
		await vi.advanceTimersByTimeAsync(15_000);
		await result;
		expect(document.getElementById('9takes-turnstile')).toBeNull();
		expect(vi.getTimerCount()).toBe(0);
	});
});
