// src/lib/server/giveFirstFunnel.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpc, maybeSingle } = vi.hoisted(() => ({
	rpc: vi.fn(),
	maybeSingle: vi.fn()
}));

vi.mock('./supabaseAdmin', () => {
	const query: Record<string, unknown> = {};
	for (const method of ['select', 'eq', 'not']) query[method] = () => query;
	query.maybeSingle = maybeSingle;
	return { getSupabaseAdminClient: () => ({ rpc, from: () => query }) };
});

import {
	isLikelyCrawlerUserAgent,
	recordGiveFirstEvent,
	recordStrategicQuestionImpression
} from './giveFirstFunnel';

const CHROME_DESKTOP =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const SAFARI_IPHONE =
	'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const FIREFOX_ANDROID = 'Mozilla/5.0 (Android 14; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0';
const INSTAGRAM_IN_APP =
	'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 345.0.0.0.0';

const GOOGLEBOT =
	'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const AHREFS = 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)';
const HEADLESS_CHROME =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/128.0.0.0 Safari/537.36';
const FACEBOOK_PREVIEW =
	'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';
const LIGHTHOUSE =
	'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse';
const CHATGPT_USER =
	'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot';
const PYTHON_REQUESTS = 'python-requests/2.32.3 (Linux x86_64 automation client)';

beforeEach(() => {
	vi.clearAllMocks();
	rpc.mockResolvedValue({ data: null, error: null });
});

describe('isLikelyCrawlerUserAgent', () => {
	it.each([CHROME_DESKTOP, SAFARI_IPHONE, FIREFOX_ANDROID, INSTAGRAM_IN_APP])(
		'treats a real browser as a person: %s',
		(userAgent) => {
			expect(isLikelyCrawlerUserAgent(userAgent)).toBe(false);
		}
	);

	it.each([
		GOOGLEBOT,
		AHREFS,
		HEADLESS_CHROME,
		FACEBOOK_PREVIEW,
		LIGHTHOUSE,
		CHATGPT_USER,
		PYTHON_REQUESTS,
		'curl/8.7.1',
		'',
		null,
		undefined
	])('flags crawlers and missing user agents: %s', (userAgent) => {
		expect(isLikelyCrawlerUserAgent(userAgent)).toBe(true);
	});
});

describe('recordGiveFirstEvent', () => {
	it('records gate_shown for a real browser with its path', async () => {
		await recordGiveFirstEvent({
			fingerprint: 'visitor-1',
			eventType: 'gate_shown',
			questionId: 42,
			path: '/questions/what-do-you-need',
			userId: null,
			userAgent: SAFARI_IPHONE
		});

		expect(rpc).toHaveBeenCalledOnce();
		expect(rpc).toHaveBeenCalledWith('record_give_first_event', {
			p_fingerprint: 'visitor-1',
			p_event_type: 'gate_shown',
			p_question_id: 42,
			p_path: '/questions/what-do-you-need',
			p_user_id: null
		});
	});

	it.each([GOOGLEBOT, HEADLESS_CHROME, null, undefined])(
		'skips gate_shown for a crawler or a missing user agent: %s',
		async (userAgent) => {
			await recordGiveFirstEvent({
				fingerprint: 'crawler-render',
				eventType: 'gate_shown',
				questionId: 42,
				path: '/questions/what-do-you-need',
				userAgent
			});

			expect(rpc).not.toHaveBeenCalled();
		}
	);

	it('always records a contribution, with its path, whatever the user agent', async () => {
		await recordGiveFirstEvent({
			fingerprint: 'visitor-1',
			eventType: 'contribution',
			questionId: 42,
			path: '/questions/what-do-you-need',
			userId: 'user-1'
		});

		expect(rpc).toHaveBeenCalledWith('record_give_first_event', {
			p_fingerprint: 'visitor-1',
			p_event_type: 'contribution',
			p_question_id: 42,
			p_path: '/questions/what-do-you-need',
			p_user_id: 'user-1'
		});
	});

	it('skips events without a fingerprint or question id', async () => {
		await recordGiveFirstEvent({
			fingerprint: null,
			eventType: 'contribution',
			questionId: 42
		});
		await recordGiveFirstEvent({
			fingerprint: 'visitor-1',
			eventType: 'gate_shown',
			questionId: undefined,
			userAgent: CHROME_DESKTOP
		});

		expect(rpc).not.toHaveBeenCalled();
	});

	it('swallows RPC failures so telemetry never breaks a request', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		rpc.mockRejectedValueOnce(new Error('network down'));

		await expect(
			recordGiveFirstEvent({
				fingerprint: 'visitor-1',
				eventType: 'contribution',
				questionId: 42
			})
		).resolves.toBeUndefined();

		consoleError.mockRestore();
	});
});

describe('recordStrategicQuestionImpression', () => {
	it('skips crawlers before looking up the question', async () => {
		await recordStrategicQuestionImpression({
			questionUrl: 'crawler-only-question',
			fingerprint: 'crawler-render',
			path: '/enneagram-corner/enneagram-type-5',
			userAgent: AHREFS
		});

		expect(maybeSingle).not.toHaveBeenCalled();
		expect(rpc).not.toHaveBeenCalled();
	});

	it('records a widget impression for a real browser, attributed to the blog path', async () => {
		maybeSingle.mockResolvedValueOnce({ data: { id: 7 }, error: null });

		await recordStrategicQuestionImpression({
			questionUrl: 'browser-question',
			fingerprint: 'visitor-1',
			path: '/enneagram-corner/enneagram-type-5',
			userAgent: CHROME_DESKTOP
		});

		expect(rpc).toHaveBeenCalledWith('record_give_first_event', {
			p_fingerprint: 'visitor-1',
			p_event_type: 'gate_shown',
			p_question_id: 7,
			p_path: '/enneagram-corner/enneagram-type-5',
			p_user_id: null
		});
	});
});
