// src/lib/server/emailClickRequest.ts
const AUTOMATED_CLICK_USER_AGENT_PATTERNS = [
	/bot\b/i,
	/crawl/i,
	/spider/i,
	/scraper/i,
	/scanner/i,
	/link(?:check|scan|expand|preview)/i,
	/urlscan/i,
	/safe.?links/i,
	/proofpoint/i,
	/mimecast/i,
	/barracuda/i,
	/sophos/i,
	/symantec/i,
	/trend.?micro/i,
	/fireeye/i,
	/forcepoint/i,
	/fortiguard/i,
	/avanan/i,
	/ironscales/i,
	/googleimageproxy/i,
	/facebookexternalhit/i,
	/slackbot/i,
	/discordbot/i,
	/telegrambot/i,
	/whatsapp/i,
	/curl/i,
	/wget/i,
	/python-requests/i,
	/axios/i,
	/node-fetch/i,
	/headless/i,
	/phantom/i,
	/selenium/i,
	/puppeteer/i,
	/playwright/i
];

const AUTOMATED_PURPOSE_PATTERN = /\b(prefetch|prerender|preview)\b/i;
const PURPOSE_HEADERS = ['purpose', 'sec-purpose', 'x-purpose', 'x-moz'];

/**
 * Suppresses obvious link scanners and prefetchers before they affect click
 * analytics or reactivation state. A normal browser navigation is allowed.
 */
export function isLikelyAutomatedEmailClick(request: Request): boolean {
	const userAgent = request.headers.get('user-agent')?.trim() ?? '';
	if (!userAgent) return true;

	if (AUTOMATED_CLICK_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
		return true;
	}

	return PURPOSE_HEADERS.some((header) => {
		const value = request.headers.get(header);
		return Boolean(value && AUTOMATED_PURPOSE_PATTERN.test(value));
	});
}

export function classifyEmailRequest(request: Request): {
	classification: 'automated' | 'unknown';
	reason: string;
} {
	const userAgent = request.headers.get('user-agent')?.trim() ?? '';
	if (!userAgent) {
		return { classification: 'automated', reason: 'missing_user_agent' };
	}

	if (AUTOMATED_CLICK_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
		return { classification: 'automated', reason: 'known_automation_user_agent' };
	}

	const purposeHeader = PURPOSE_HEADERS.find((header) => {
		const value = request.headers.get(header);
		return Boolean(value && AUTOMATED_PURPOSE_PATTERN.test(value));
	});
	if (purposeHeader) {
		return { classification: 'automated', reason: `automation_${purposeHeader}` };
	}

	return { classification: 'unknown', reason: 'awaiting_behavioral_holdback' };
}
