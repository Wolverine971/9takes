// src/lib/server/giveFirstFunnel.ts
// Records give-first wall funnel events (gate_shown, contribution) so the
// lurker -> contributor conversion is queryable. See migration
// 20260613_give_first_funnel_events.sql for the table + canonical funnel query.
//
// Every write is fire-and-forget safe: failures are logged and swallowed so
// instrumentation can never break a page load or a comment submission.
import { getSupabaseAdminClient } from './supabaseAdmin';

export type GiveFirstEventType = 'gate_shown' | 'contribution';

type GiveFirstEventBase = {
	fingerprint: string | undefined | null;
	questionId: number | null | undefined;
	path?: string | null;
	userId?: string | null;
};

/**
 * gate_shown must pass the request's user agent (null/undefined counts as a
 * crawler) so crawler renders never inflate the wall's denominator.
 * Contributions are real comments and are never filtered.
 */
export type GiveFirstEventInput = GiveFirstEventBase &
	(
		| { eventType: 'gate_shown'; userAgent: string | null | undefined }
		| { eventType: 'contribution'; userAgent?: string | null }
	);

// Self-identified crawlers and automation clients. The first block is the same
// list the signup and Talk-to-DJ bot gates use (src/routes/api/signups and
// src/lib/server/talkNotes.ts); the second covers crawlers and fetchers whose
// user agent never says "bot". Crawlers that spoof a normal browser can't be
// caught here, so funnel analysis should still prefer browser-verified
// fingerprints (a client-side page visit near the gate event).
const CRAWLER_USER_AGENT_PATTERNS: RegExp[] = [
	/bot/i,
	/crawl/i,
	/spider/i,
	/scraper/i,
	/curl/i,
	/wget/i,
	/python-requests/i,
	/axios/i,
	/node-fetch/i,
	/headless/i,
	/phantom/i,
	/selenium/i,
	/puppeteer/i,
	/playwright/i,
	/slurp/i,
	/facebookexternalhit/i,
	/meta-external/i,
	/mediapartners-google/i,
	/google-inspectiontool/i,
	/googleother/i,
	/lighthouse/i,
	/pagespeed/i,
	/gtmetrix/i,
	/chatgpt-user/i,
	/claude-user/i,
	/perplexity-user/i,
	/anthropic-ai/i,
	/cohere-ai/i,
	/whatsapp/i,
	/ia_archiver/i,
	/prerender/i,
	/scrapy/i,
	/go-http-client/i,
	/okhttp/i,
	/libwww/i,
	/httpclient/i,
	/^java\//i
];

/** True for missing/implausibly short user agents and self-identified crawlers. */
export function isLikelyCrawlerUserAgent(userAgent: string | null | undefined): boolean {
	const value = userAgent?.trim() ?? '';
	if (value.length < 20) return true;
	return CRAWLER_USER_AGENT_PATTERNS.some((pattern) => pattern.test(value));
}

export async function recordGiveFirstEvent(input: GiveFirstEventInput): Promise<void> {
	const { fingerprint, eventType, questionId, path = null, userId = null } = input;

	// No fingerprint means no join key (e.g. bots / cookie-less clients) — skip.
	if (!fingerprint || questionId == null || !Number.isFinite(questionId)) {
		return;
	}

	// A gate impression only counts when a person could have seen the wall.
	// Crawlers render question pages server-side (some carry the fingerprint
	// cookie from a JS render), which inflated gate_shown.
	if (eventType === 'gate_shown' && isLikelyCrawlerUserAgent(input.userAgent)) {
		return;
	}

	try {
		const supabaseAdmin = getSupabaseAdminClient() as any;
		const { error } = await supabaseAdmin.rpc('record_give_first_event', {
			p_fingerprint: fingerprint,
			p_event_type: eventType,
			p_question_id: questionId,
			p_path: path,
			p_user_id: userId
		});

		if (error) {
			console.error('Failed to record give-first funnel event', {
				eventType,
				questionId,
				error
			});
		}
	} catch (error) {
		console.error('Failed to record give-first funnel event', {
			eventType,
			questionId,
			error
		});
	}
}

// Small in-memory cache so blog pageviews do not pay a questions lookup on
// every request. Serverless instances each keep their own copy; that is fine
// because the funnel RPC dedupes on (fingerprint, event_type, question_id).
const questionIdByUrl = new Map<string, { id: number | null; expiresAt: number }>();
const QUESTION_ID_CACHE_MS = 5 * 60 * 1000;

async function resolveQuestionIdByUrl(questionUrl: string): Promise<number | null> {
	const cached = questionIdByUrl.get(questionUrl);
	if (cached && cached.expiresAt > Date.now()) return cached.id;

	const supabaseAdmin = getSupabaseAdminClient() as any;
	const { data } = await supabaseAdmin
		.from('questions')
		.select('id')
		.eq('url', questionUrl)
		.not('removed', 'is', true)
		.not('flagged', 'is', true)
		.maybeSingle();

	const id = typeof data?.id === 'number' ? data.id : null;
	questionIdByUrl.set(questionUrl, { id, expiresAt: Date.now() + QUESTION_ID_CACHE_MS });
	return id;
}

/**
 * Strategic-question widget impression: a blog page that embeds the widget was
 * served to a fingerprinted visitor. Reuses gate_shown semantics so the funnel
 * reads widget served -> contribution, attributed per source page via `path`.
 * The table's unique constraint keeps this at one row per visitor per question
 * (earliest occurrence wins), matching the funnel grain. Crawlers are skipped
 * before the question lookup.
 */
export async function recordStrategicQuestionImpression({
	questionUrl,
	fingerprint,
	path,
	userId = null,
	userAgent
}: {
	questionUrl: string;
	fingerprint: string | undefined | null;
	path: string | null;
	userId?: string | null;
	userAgent: string | null | undefined;
}): Promise<void> {
	if (!fingerprint || !questionUrl) return;
	if (isLikelyCrawlerUserAgent(userAgent)) return;

	try {
		const questionId = await resolveQuestionIdByUrl(questionUrl);
		if (questionId == null) return;

		await recordGiveFirstEvent({
			fingerprint,
			eventType: 'gate_shown',
			questionId,
			path,
			userId,
			userAgent
		});
	} catch (error) {
		console.error('Failed to record strategic question impression', { questionUrl, error });
	}
}
