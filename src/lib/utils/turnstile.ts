// Load Turnstile only when a protected form needs it, sharing one script across client navigations.
export type TurnstileOptions = {
	sitekey: string;
	action: string;
	theme?: 'auto' | 'light' | 'dark';
	size?: 'normal' | 'compact' | 'flexible';
	'response-field'?: boolean;
	callback: (token: string) => void;
	'expired-callback': () => void;
	'error-callback': () => void;
	'timeout-callback': () => void;
};

export type TurnstileApi = {
	render: (container: HTMLElement, options: TurnstileOptions) => string | undefined;
	reset: (widgetId: string) => void;
	remove: (widgetId: string) => void;
};

const SCRIPT_ID = '9takes-turnstile';
let scriptPromise: Promise<TurnstileApi> | undefined;

function getApi(): TurnstileApi | undefined {
	return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

export function loadTurnstile(): Promise<TurnstileApi> {
	if (scriptPromise) return scriptPromise;

	scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
		let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
		let settled = false;
		const timeout = window.setTimeout(fail, 15_000);

		function cleanup() {
			window.clearTimeout(timeout);
			script?.removeEventListener('load', ready);
			script?.removeEventListener('error', fail);
		}

		function fail() {
			if (settled) return;
			settled = true;
			cleanup();
			script?.remove();
			reject(new Error('Unable to load verification.'));
		}

		function ready() {
			const api = getApi();
			if (!api || typeof api.render !== 'function') return fail();
			if (settled) return;
			// The script's load event guarantees that the explicit-rendering API is
			// available. turnstile.ready() rejects async/defer script loading.
			settled = true;
			cleanup();
			resolve(api);
		}

		if (getApi()) {
			ready();
			return;
		}

		const isNewScript = !script;
		if (!script) {
			script = document.createElement('script');
			script.id = SCRIPT_ID;
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
			script.async = true;
			script.defer = true;
		}
		script.addEventListener('load', ready);
		script.addEventListener('error', fail);
		if (isNewScript) document.head.appendChild(script);
	}).catch((error) => {
		scriptPromise = undefined;
		throw error;
	});

	return scriptPromise;
}
