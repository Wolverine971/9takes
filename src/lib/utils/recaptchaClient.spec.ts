// src/lib/utils/recaptchaClient.spec.ts
// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	ensureRecaptchaLoaded,
	reloadRecaptchaWidget,
	renderRecaptchaWidget
} from './recaptchaClient';

describe('recaptchaClient', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
		document.body.innerHTML = '';
		window.grecaptcha = {
			reset: vi.fn(),
			getResponse: vi.fn(),
			execute: vi.fn(),
			render: vi.fn((container: string | HTMLElement) => {
				const element =
					typeof container === 'string'
						? (document.querySelector(container) as HTMLElement | null)
						: container;

				element?.insertAdjacentHTML('beforeend', '<iframe title="recaptcha"></iframe>');

				return 7;
			})
		};
	});

	it('renders a widget into an empty container', () => {
		const container = document.createElement('div');

		const widgetId = renderRecaptchaWidget({
			container,
			siteKey: 'site-key',
			theme: 'light'
		});

		expect(widgetId).toBe(7);
		expect(window.grecaptcha?.render).toHaveBeenCalledTimes(1);
		expect(container.querySelector('iframe')).not.toBeNull();
	});

	it('reloads a widget by clearing the old DOM and rendering again', async () => {
		const container = document.createElement('div');
		container.innerHTML = '<iframe title="stale"></iframe>';

		const widgetId = await reloadRecaptchaWidget({
			container,
			siteKey: 'site-key',
			theme: 'dark'
		});

		expect(widgetId).toBe(7);
		expect(window.grecaptcha?.render).toHaveBeenCalledTimes(1);
		expect(container.innerHTML).toContain('title="recaptcha"');
		expect(container.innerHTML).not.toContain('title="stale"');
	});

	it('treats an already-loaded grecaptcha instance as ready', async () => {
		await expect(ensureRecaptchaLoaded()).resolves.toBeUndefined();
	});

	it('retries with a fresh script tag after a load error', async () => {
		// Simulate a not-yet-loaded global and trigger script loading.
		window.grecaptcha = undefined;

		const firstLoad = ensureRecaptchaLoaded();
		const firstScript = document.getElementById('recaptcha-script') as HTMLScriptElement | null;
		expect(firstScript).not.toBeNull();

		firstScript?.dispatchEvent(new Event('error'));
		await expect(firstLoad).rejects.toThrow('Failed to load reCAPTCHA');
		expect(document.getElementById('recaptcha-script')).toBeNull();

		const secondLoad = ensureRecaptchaLoaded();
		const secondScript = document.getElementById('recaptcha-script') as HTMLScriptElement | null;
		expect(secondScript).not.toBeNull();
		expect(secondScript).not.toBe(firstScript);

		window.grecaptcha = fullGrecaptcha();
		secondScript?.dispatchEvent(new Event('load'));
		await expect(secondLoad).resolves.toBeUndefined();
	});

	describe('waiting for the library behind api.js', () => {
		// api.js defines only grecaptcha.ready when its load event fires; render
		// arrives later. Each test gets fresh module state.
		async function freshClient() {
			vi.resetModules();
			return import('./recaptchaClient');
		}

		function readyOnlyGrecaptcha() {
			let onReady: (() => void) | undefined;
			const stub = {
				ready: (callback: () => void) => {
					onReady = callback;
				}
			};
			return { stub, fireReady: () => onReady?.() };
		}

		it('waits for grecaptcha.ready after the script load event', async () => {
			window.grecaptcha = undefined;
			const { ensureRecaptchaLoaded: ensure } = await freshClient();
			const load = ensure();
			const script = document.getElementById('recaptcha-script') as HTMLScriptElement;

			const { stub, fireReady } = readyOnlyGrecaptcha();
			window.grecaptcha = stub as unknown as Window['grecaptcha'];
			script.dispatchEvent(new Event('load'));

			let settled = false;
			void load.then(() => (settled = true));
			await Promise.resolve();
			await Promise.resolve();
			expect(settled).toBe(false);

			window.grecaptcha = { ...fullGrecaptcha(), ready: stub.ready };
			fireReady();
			await expect(load).resolves.toBeUndefined();
			expect(typeof window.grecaptcha?.render).toBe('function');
		});

		it('waits when the script already loaded but render is not defined yet', async () => {
			const { stub, fireReady } = readyOnlyGrecaptcha();
			window.grecaptcha = stub as unknown as Window['grecaptcha'];
			const { ensureRecaptchaLoaded: ensure } = await freshClient();

			const load = ensure();
			expect(document.getElementById('recaptcha-script')).toBeNull();

			window.grecaptcha = { ...fullGrecaptcha(), ready: stub.ready };
			fireReady();
			await expect(load).resolves.toBeUndefined();
		});

		it('rejects, then retries, when the script loads without defining grecaptcha', async () => {
			window.grecaptcha = undefined;
			const { ensureRecaptchaLoaded: ensure } = await freshClient();
			const load = ensure();
			(document.getElementById('recaptcha-script') as HTMLScriptElement).dispatchEvent(
				new Event('load')
			);
			await expect(load).rejects.toThrow('reCAPTCHA did not initialize');

			const retry = ensure();
			window.grecaptcha = fullGrecaptcha();
			(document.getElementById('recaptcha-script') as HTMLScriptElement).dispatchEvent(
				new Event('load')
			);
			await expect(retry).resolves.toBeUndefined();
		});
	});
});

function fullGrecaptcha(): NonNullable<Window['grecaptcha']> {
	return {
		reset: vi.fn(),
		getResponse: vi.fn(),
		execute: vi.fn(),
		render: vi.fn(() => 1)
	};
}
