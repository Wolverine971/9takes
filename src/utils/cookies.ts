// src/utils/cookies.ts
export const setCookie = (name: string, value: string, days?: number): void => {
	let expires = '';
	if (typeof days === 'number') {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	// Secure only on https, so the cookie still sets on http://localhost in dev.
	const secure =
		typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
	document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax' + secure;
};
export const getCookie = (name: string): string | null => {
	const nameEQ = name + '=';
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
};
export const eraseCookie = (name: string): void => {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
