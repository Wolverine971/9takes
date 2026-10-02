// src/lib/utils/recaptchaClient.ts
const RECAPTCHA_SCRIPT_ID = 'recaptcha-script';
const RECAPTCHA_READY_TIMEOUT_MS = 15_000;
let recaptchaScriptPromise: Promise<void> | null = null;

/**
 * api.js fires its load event once it has defined `grecaptcha.ready`, then loads
 * the real library asynchronously, so `grecaptcha.render` does not exist yet.
 * Rendering at that point threw "grecaptcha.render is not a function" and left
 * login, register and forgot-password with no CAPTCHA on a fresh visit, so the
 * first submit always failed (seen live 2026-10-02).
 */
function waitForRecaptchaReady(): Promise<void> {
	const grecaptcha = window.grecaptcha;
	if (typeof grecaptcha?.render === 'function') {
		return Promise.resolve();
	}
	if (typeof grecaptcha?.ready !== 'function') {
		return Promise.reject(new Error('reCAPTCHA did not initialize'));
	}

	return new Promise<void>((resolve, reject) => {
		const timeout = setTimeout(
			() => reject(new Error('reCAPTCHA did not become ready')),
			RECAPTCHA_READY_TIMEOUT_MS
		);
		grecaptcha.ready!(() => {
			clearTimeout(timeout);
			resolve();
		});
	});
}

function settleWhenReady(resolve: () => void, reject: (reason: Error) => void): void {
	waitForRecaptchaReady().then(resolve, (readyError: Error) => {
		recaptchaScriptPromise = null;
		reject(readyError);
	});
}

export async function ensureRecaptchaLoaded(): Promise<void> {
	if (typeof window === 'undefined') {
		return;
	}

	if (typeof window.grecaptcha?.render === 'function') {
		return;
	}

	if (recaptchaScriptPromise) {
		return recaptchaScriptPromise;
	}

	if (typeof window.grecaptcha?.ready === 'function') {
		// The script already loaded but the library is still initializing.
		recaptchaScriptPromise = waitForRecaptchaReady().catch((readyError) => {
			recaptchaScriptPromise = null;
			throw readyError;
		});
		return recaptchaScriptPromise;
	}

	recaptchaScriptPromise = new Promise<void>((resolve, reject) => {
		const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID) as HTMLScriptElement | null;

		if (existingScript) {
			// If a previous attempt failed or finished without exposing grecaptcha, recreate the tag.
			if (existingScript.dataset.loadState !== 'loading') {
				existingScript.remove();
			} else {
				existingScript.addEventListener(
					'load',
					() => {
						existingScript.dataset.loadState = 'loaded';
						settleWhenReady(resolve, reject);
					},
					{ once: true }
				);
				existingScript.addEventListener(
					'error',
					() => {
						existingScript.dataset.loadState = 'error';
						existingScript.remove();
						recaptchaScriptPromise = null;
						reject(new Error('Failed to load reCAPTCHA'));
					},
					{ once: true }
				);
				return;
			}
		}

		const script = document.createElement('script');
		script.id = RECAPTCHA_SCRIPT_ID;
		script.dataset.loadState = 'loading';
		script.src = 'https://www.google.com/recaptcha/api.js';
		script.async = true;
		script.defer = true;
		script.onload = () => {
			script.dataset.loadState = 'loaded';
			settleWhenReady(resolve, reject);
		};
		script.onerror = () => {
			script.dataset.loadState = 'error';
			script.remove();
			recaptchaScriptPromise = null;
			reject(new Error('Failed to load reCAPTCHA'));
		};
		document.head.appendChild(script);
	});

	return recaptchaScriptPromise;
}

export function renderRecaptchaWidget({
	container,
	siteKey,
	theme
}: {
	container: HTMLElement;
	siteKey: string;
	theme: 'light' | 'dark';
}): number | null {
	if (typeof window === 'undefined' || !window.grecaptcha) {
		return null;
	}

	if (container.querySelector('iframe, textarea[name="g-recaptcha-response"]')) {
		return null;
	}

	return window.grecaptcha.render(container, {
		sitekey: siteKey,
		theme
	});
}

export function resetRecaptchaWidget(widgetId: number | null): void {
	if (typeof window === 'undefined' || !window.grecaptcha) {
		return;
	}

	if (widgetId !== null) {
		window.grecaptcha.reset(widgetId);
		return;
	}

	window.grecaptcha.reset();
}

export async function reloadRecaptchaWidget({
	container,
	siteKey,
	theme
}: {
	container: HTMLElement | null;
	siteKey: string;
	theme: 'light' | 'dark';
}): Promise<number | null> {
	if (typeof window === 'undefined' || !container) {
		return null;
	}

	await ensureRecaptchaLoaded();
	container.innerHTML = '';

	return renderRecaptchaWidget({
		container,
		siteKey,
		theme
	});
}
