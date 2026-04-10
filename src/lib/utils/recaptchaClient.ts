// src/lib/utils/recaptchaClient.ts
const RECAPTCHA_SCRIPT_ID = 'recaptcha-script';
let recaptchaScriptPromise: Promise<void> | null = null;

export async function ensureRecaptchaLoaded(): Promise<void> {
	if (typeof window === 'undefined') {
		return;
	}

	if (window.grecaptcha) {
		return;
	}

	if (recaptchaScriptPromise) {
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
						resolve();
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
			resolve();
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
