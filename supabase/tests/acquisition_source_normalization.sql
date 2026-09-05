-- supabase/tests/acquisition_source_normalization.sql
-- Run with psql after applying migrations. The checks do not mutate data.
\set ON_ERROR_STOP on

DO $$
BEGIN
	IF public.normalize_acquisition_source('example.com', 'mystery-network', 'paid', NULL) <> 'other' THEN
		RAISE EXCEPTION 'Unknown paid UTM sources must fall through to referrer classification';
	END IF;

	IF public.normalize_acquisition_source('google.com', 'mystery-source', 'organic', 'dclid') <> 'search/google' THEN
		RAISE EXCEPTION 'Unknown UTM and click-id values must fall through to referrer classification';
	END IF;

	IF public.normalize_acquisition_source(NULL, 'newsletter-partner', 'email', NULL) <> 'email' THEN
		RAISE EXCEPTION 'Known medium-only email classification regressed';
	END IF;

	IF public.normalize_acquisition_source(NULL, 'google', 'cpc', NULL) <> 'paid/google' THEN
		RAISE EXCEPTION 'Known paid classification regressed';
	END IF;
END;
$$;
