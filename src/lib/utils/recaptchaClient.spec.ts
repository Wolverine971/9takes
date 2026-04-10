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
		// @ts-expect-error test override
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

		secondScript?.dispatchEvent(new Event('load'));
		await expect(secondLoad).resolves.toBeUndefined();
	});
});
