// src/lib/server/accountReturnTo.ts
// Account email links may carry attribution through sign-in. Keep the return
// destination scoped to this page; never accept an arbitrary redirect URL.
export function getAccountReturnTo(value: unknown): string | null {
	if (typeof value !== 'string' || !/^\/account(?:[?#]|$)/.test(value)) return null;
	if (/[\\\u0000-\u0020\u007f]/.test(value)) return null;
	const url = new URL(value, 'https://9takes.com');
	if (url.pathname !== '/account') return null;
	return `${url.pathname}${url.search}${url.hash}`;
}
