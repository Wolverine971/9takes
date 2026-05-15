-- supabase/migrations/20260514_ai_acquisition_sources.sql
-- Classify AI-answer/search referrers separately from generic referral/search traffic.

CREATE OR REPLACE FUNCTION public.normalize_acquisition_source(
	p_referrer_host TEXT DEFAULT NULL,
	p_utm_source TEXT DEFAULT NULL,
	p_utm_medium TEXT DEFAULT NULL,
	p_click_id_type TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
	v_referrer_host TEXT := LOWER(COALESCE(NULLIF(BTRIM(p_referrer_host), ''), ''));
	v_utm_source TEXT := LOWER(COALESCE(NULLIF(BTRIM(p_utm_source), ''), ''));
	v_utm_medium TEXT := LOWER(COALESCE(NULLIF(BTRIM(p_utm_medium), ''), ''));
	v_click_id_type TEXT := LOWER(COALESCE(NULLIF(BTRIM(p_click_id_type), ''), ''));
BEGIN
	IF v_utm_source <> '' THEN
		IF v_utm_medium IN ('cpc', 'ppc', 'paid', 'paid-search', 'paid_social', 'paid-social') THEN
			CASE
				WHEN v_utm_source IN ('google', 'googleads', 'adwords') THEN
					RETURN 'paid/google';
				WHEN v_utm_source IN ('bing', 'microsoft', 'msn') THEN
					RETURN 'paid/bing';
				WHEN v_utm_source IN ('facebook', 'fb', 'instagram', 'meta') THEN
					RETURN 'paid/meta';
				WHEN v_utm_source IN ('tiktok', 'tt') THEN
					RETURN 'paid/tiktok';
				WHEN v_utm_source = 'reddit' THEN
					RETURN 'paid/reddit';
			END CASE;
		END IF;

		CASE
			WHEN v_utm_source IN ('chatgpt', 'openai', 'oai-searchbot') THEN
				RETURN 'ai/openai';
			WHEN v_utm_source IN ('perplexity', 'perplexitybot') THEN
				RETURN 'ai/perplexity';
			WHEN v_utm_source IN ('claude', 'anthropic') THEN
				RETURN 'ai/anthropic';
			WHEN v_utm_source IN ('gemini', 'bard', 'google-ai') THEN
				RETURN 'ai/google';
			WHEN v_utm_source IN ('copilot', 'microsoft-copilot') THEN
				RETURN 'ai/microsoft';
			WHEN v_utm_source IN ('grok', 'xai', 'x-ai') THEN
				RETURN 'ai/xai';
			WHEN v_utm_source IN ('poe', 'you', 'phind', 'mistral', 'meta-ai', 'iask', 'felo', 'komo', 'andi') THEN
				RETURN 'ai/other';
			WHEN v_utm_source IN ('google', 'bing', 'duckduckgo') THEN
				RETURN 'search/' || v_utm_source;
			WHEN v_utm_source IN ('twitter', 'x', 't.co') THEN
				RETURN 'social/x';
			WHEN v_utm_source = 'reddit' THEN
				RETURN 'social/reddit';
			WHEN v_utm_source IN ('facebook', 'fb') THEN
				RETURN 'social/facebook';
			WHEN v_utm_source = 'instagram' THEN
				RETURN 'social/instagram';
			WHEN v_utm_source = 'linkedin' THEN
				RETURN 'social/linkedin';
			WHEN v_utm_source = 'youtube' THEN
				RETURN 'social/youtube';
			WHEN v_utm_source = 'substack' AND v_utm_medium = 'email' THEN
				RETURN 'email/substack';
			WHEN v_utm_medium = 'email' THEN
				RETURN 'email';
		END CASE;
	END IF;

	IF v_click_id_type <> '' THEN
		CASE v_click_id_type
			WHEN 'gclid' THEN RETURN 'paid/google';
			WHEN 'msclkid' THEN RETURN 'paid/bing';
			WHEN 'fbclid' THEN RETURN 'social/meta';
			WHEN 'ttclid' THEN RETURN 'social/tiktok';
		END CASE;
	END IF;

	IF v_referrer_host = '' THEN
		RETURN 'direct';
	END IF;

	IF v_referrer_host LIKE '%9takes.com%' OR v_referrer_host IN ('localhost', '127.0.0.1') THEN
		RETURN 'internal';
	END IF;

	IF v_referrer_host LIKE '%chatgpt.%' OR v_referrer_host LIKE '%openai.%' THEN RETURN 'ai/openai'; END IF;
	IF v_referrer_host LIKE '%perplexity.%' THEN RETURN 'ai/perplexity'; END IF;
	IF v_referrer_host LIKE '%claude.ai%' OR v_referrer_host LIKE '%anthropic.%' THEN RETURN 'ai/anthropic'; END IF;
	IF v_referrer_host LIKE '%gemini.google.%' OR v_referrer_host LIKE '%bard.google.%' THEN RETURN 'ai/google'; END IF;
	IF v_referrer_host LIKE '%copilot.microsoft.%' THEN RETURN 'ai/microsoft'; END IF;
	IF v_referrer_host LIKE '%grok.%' OR v_referrer_host LIKE '%x.ai%' THEN RETURN 'ai/xai'; END IF;
	IF v_referrer_host LIKE '%poe.com%' OR v_referrer_host LIKE '%you.com%' OR v_referrer_host LIKE '%phind.com%' THEN RETURN 'ai/other'; END IF;
	IF v_referrer_host LIKE '%meta.ai%' OR v_referrer_host LIKE '%mistral.ai%' THEN RETURN 'ai/other'; END IF;
	IF v_referrer_host LIKE '%iask.ai%' OR v_referrer_host LIKE '%felo.ai%' OR v_referrer_host LIKE '%komo.ai%' THEN RETURN 'ai/other'; END IF;
	IF v_referrer_host LIKE '%andisearch.com%' THEN RETURN 'ai/other'; END IF;

	IF v_referrer_host LIKE '%google.%' THEN RETURN 'search/google'; END IF;
	IF v_referrer_host LIKE '%bing.%' THEN RETURN 'search/bing'; END IF;
	IF v_referrer_host LIKE '%duckduckgo.%' THEN RETURN 'search/duckduckgo'; END IF;
	IF v_referrer_host LIKE '%reddit.%' THEN RETURN 'social/reddit'; END IF;
	IF v_referrer_host LIKE '%twitter.%' OR v_referrer_host LIKE '%x.com%' OR v_referrer_host LIKE '%t.co%' THEN RETURN 'social/x'; END IF;
	IF v_referrer_host LIKE '%facebook.%' OR v_referrer_host LIKE '%fb.%' THEN RETURN 'social/facebook'; END IF;
	IF v_referrer_host LIKE '%instagram.%' THEN RETURN 'social/instagram'; END IF;
	IF v_referrer_host LIKE '%linkedin.%' THEN RETURN 'social/linkedin'; END IF;
	IF v_referrer_host LIKE '%youtube.%' OR v_referrer_host LIKE '%youtu.be%' THEN RETURN 'social/youtube'; END IF;
	IF v_referrer_host LIKE '%substack.%' THEN RETURN 'email/substack'; END IF;
	IF v_referrer_host LIKE '%mail.%' OR v_referrer_host LIKE '%outlook.%' OR v_referrer_host LIKE '%gmail.%' THEN RETURN 'email'; END IF;

	RETURN 'other';
END;
$$;

UPDATE public.page_analytics_visits
SET acquisition_source = public.normalize_acquisition_source(
	referrer_host,
	utm_source,
	utm_medium,
	click_id_type
)
WHERE started_at >= NOW() - INTERVAL '180 days'
	AND (
		LOWER(COALESCE(referrer_host, '')) ~ '(chatgpt|openai|perplexity|claude[.]ai|anthropic|gemini|bard|copilot|grok|x[.]ai|poe[.]com|you[.]com|phind[.]com|meta[.]ai|mistral[.]ai|iask[.]ai|felo[.]ai|komo[.]ai|andisearch[.]com)'
		OR LOWER(COALESCE(utm_source, '')) IN (
			'chatgpt',
			'openai',
			'oai-searchbot',
			'perplexity',
			'perplexitybot',
			'claude',
			'anthropic',
			'gemini',
			'bard',
			'google-ai',
			'copilot',
			'microsoft-copilot',
			'grok',
			'xai',
			'x-ai',
			'poe',
			'you',
			'phind',
			'mistral',
			'meta-ai',
			'iask',
			'felo',
			'komo',
			'andi'
		)
	);

UPDATE public.visitor_first_touch
SET first_acquisition_source = public.normalize_acquisition_source(
	first_referrer_host,
	first_utm_source,
	first_utm_medium,
	first_click_id_type
)
WHERE first_visit_at >= NOW() - INTERVAL '180 days'
	AND (
		LOWER(COALESCE(first_referrer_host, '')) ~ '(chatgpt|openai|perplexity|claude[.]ai|anthropic|gemini|bard|copilot|grok|x[.]ai|poe[.]com|you[.]com|phind[.]com|meta[.]ai|mistral[.]ai|iask[.]ai|felo[.]ai|komo[.]ai|andisearch[.]com)'
		OR LOWER(COALESCE(first_utm_source, '')) IN (
			'chatgpt',
			'openai',
			'oai-searchbot',
			'perplexity',
			'perplexitybot',
			'claude',
			'anthropic',
			'gemini',
			'bard',
			'google-ai',
			'copilot',
			'microsoft-copilot',
			'grok',
			'xai',
			'x-ai',
			'poe',
			'you',
			'phind',
			'mistral',
			'meta-ai',
			'iask',
			'felo',
			'komo',
			'andi'
		)
	);
