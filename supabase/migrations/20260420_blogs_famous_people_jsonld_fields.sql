-- supabase/migrations/20260420_blogs_famous_people_jsonld_fields.sql
-- Purpose: Add per-post structured-data fields that feed deterministic JSON-LD
--          rendering for /personality-analysis/[slug]. See
--          docs/planning/people-jsonld-unification-2026-04-19.md (Phase 1).
--
-- These columns replace the monolithic `jsonld_snippet` JSONB override with
-- a small set of typed inputs. The renderer composes the @graph at request
-- time from these fields plus site-wide constants. `jsonld_snippet` stays in
-- place during the rollout and is dropped in Phase 4.

ALTER TABLE public.blogs_famous_people
	ADD COLUMN IF NOT EXISTS keywords      text[],
	ADD COLUMN IF NOT EXISTS same_as       text[],
	ADD COLUMN IF NOT EXISTS faqs          jsonb,      -- array of { question, answer, anchor? }
	ADD COLUMN IF NOT EXISTS wikidata_qid  text,
	ADD COLUMN IF NOT EXISTS imdb_id       text,
	ADD COLUMN IF NOT EXISTS birth_date    date,
	ADD COLUMN IF NOT EXISTS birth_place   text,
	ADD COLUMN IF NOT EXISTS nationality   text,
	ADD COLUMN IF NOT EXISTS occupation    text[],
	ADD COLUMN IF NOT EXISTS knows_about   text[],
	ADD COLUMN IF NOT EXISTS citations     text[];

-- Shape guardrails: regex checks on the structured-ID fields catch typos at
-- the DB layer. Kept as NOT VALID first so the migration is safe for existing
-- rows with NULL values; then validated (no-op for empty values).
ALTER TABLE public.blogs_famous_people
	DROP CONSTRAINT IF EXISTS blogs_famous_people_wikidata_qid_format,
	ADD CONSTRAINT blogs_famous_people_wikidata_qid_format
		CHECK (wikidata_qid IS NULL OR wikidata_qid ~ '^Q[1-9][0-9]*$');

ALTER TABLE public.blogs_famous_people
	DROP CONSTRAINT IF EXISTS blogs_famous_people_imdb_id_format,
	ADD CONSTRAINT blogs_famous_people_imdb_id_format
		CHECK (imdb_id IS NULL OR imdb_id ~ '^nm[0-9]+$');

COMMENT ON COLUMN public.blogs_famous_people.keywords     IS 'Per-post SEO keywords rendered as Article.keywords.';
COMMENT ON COLUMN public.blogs_famous_people.same_as      IS 'HTTPS URLs for the person (social, official, Wikipedia, etc.). Rendered as Person.sameAs.';
COMMENT ON COLUMN public.blogs_famous_people.faqs         IS 'Array of {question, answer, anchor?} objects. Only visible-source-backed items are emitted as FAQPage.';
COMMENT ON COLUMN public.blogs_famous_people.wikidata_qid IS 'Wikidata QID (e.g. Q26876). Expands to sameAs URL and identifier PropertyValue.';
COMMENT ON COLUMN public.blogs_famous_people.imdb_id      IS 'IMDb nconst (e.g. nm1728342). Expands to sameAs URL and identifier PropertyValue.';
COMMENT ON COLUMN public.blogs_famous_people.birth_date   IS 'ISO 8601 birth date. Rendered as Person.birthDate.';
COMMENT ON COLUMN public.blogs_famous_people.birth_place  IS 'Free-text birth location. Rendered as Person.birthPlace.name.';
COMMENT ON COLUMN public.blogs_famous_people.nationality  IS 'Person nationality adjective (e.g. American). Rendered as Person.nationality.name.';
COMMENT ON COLUMN public.blogs_famous_people.occupation   IS 'Occupation roles. First becomes Person.jobTitle; full list becomes Person.hasOccupation.';
COMMENT ON COLUMN public.blogs_famous_people.knows_about  IS 'Topics the person is authoritative on. Rendered as Person.knowsAbout.';
COMMENT ON COLUMN public.blogs_famous_people.citations    IS 'HTTPS URLs to sources the article quotes. Rendered as Article.citation.';
