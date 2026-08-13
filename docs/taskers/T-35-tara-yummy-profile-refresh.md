<!-- docs/taskers/T-35-tara-yummy-profile-refresh.md -->

# Tasker: Audit and Refresh the Tara Yummy Personality Analysis

**For:** Public-figure research and personality-analysis editorial agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Done  
**Completed:** 2026-08-13  
**Related:** `docs/seo/2026-08-13-indexation-recovery-audit.md`, `docs/content-analysis/2026-07-18_people-corpus-audit.json`, `src/blog/people/drafts/Tara-Yummy.md`

## 0. What and why

The user referred to "Terra Yummy"; the canonical person and URL are **Tara Yummy** and `/personality-analysis/tara-yummy`.

The page earned 2 clicks from 242 impressions at 0.83 percent CTR and average position 8.1 in the clean 98-day indexation audit. The older review called it one of the stronger people articles, but the July corpus audit still found 15 prose em dashes, 17 quotes with 10 untagged load-bearing or supporting uses, weak citation coverage, and generic Type 2 sentences duplicated across other profiles.

This is not permission to rewrite a good page into a generic SEO article. Preserve its distinctive material, repair source traceability, verify identity and career claims, add only meaningful developments, and pressure-test the Type 2 conclusion.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/seo/2026-08-13-indexation-recovery-audit.md` and Tara Yummy's inventory row
4. Tara Yummy's row in `docs/content-analysis/2026-07-18_people-corpus-audit.json`
5. `docs/content-analysis/blog-quality-review.md`
6. `docs/taskers/news-refresh-2026-07/README.md`
7. The complete current `src/blog/people/drafts/Tara-Yummy.md`
8. Current GSC page-query data and current live database parity

Run `git status --short` first. Re-run live/local parity before editing. Never modify `lastmod`.

## 2. Research assignments

Find primary or direct evidence for:

1. meaningful changes in Tara Yummy's work, public identity, interviews, tours, podcasts, comedy, music, or representation since February 22, 2026;
2. the origin and meaning of the "Tara Yummy Mindset" in her own words;
3. her account of leaving Dropouts, if she has given one directly;
4. the party-networking origin story and what she says success means to her;
5. Iranian or Persian identity, language, family, and Freddie Mercury claims, using her own statements rather than biography sites;
6. external observations from named collaborators that genuinely test the warmth thesis; and
7. evidence for Type 2 versus Type 3, Type 7, or another plausible reading.

Prefer full podcast episodes, her own long-form videos, direct interviews, official representation announcements, and named collaborator interviews. Social profiles establish account identity, not biographical facts by themselves. Do not use low-quality celebrity biography sites as load-bearing evidence.

## 3. Editorial contract

Preserve the best distinctive images and contradictions, such as warmth as both connection and ambition, only when their details are verified. Replace generic Type 2 statements shared with Khloe Kardashian, Hilary Duff, Bill Clinton, or other profiles with Tara-specific observation.

Separate public persona from inferred motive. Do not state that she cared, feared, or needed something as fact unless she said it. Treat cultural identity respectfully and precisely. Do not use ethnicity as evidence of personality type.

Add new material only when it changes the arc. The page should not become a list of 2026 appearances. Preserve the persona title and non-keyword search promise unless the audit demonstrates that they are inaccurate.

Remove untraceable quotes, weak biography citations, internal quality comments, repeated formulas, and all em dashes.

## 4. Publishing workflow

Edit the canonical draft, then:

1. Run `node scripts/blog-source-audit.mjs src/blog/people/drafts/Tara-Yummy.md --fail-on-untagged-load-bearing`.
2. Run relevant people lint and project checks.
3. Preview with `node scripts/personBlogParser.js Tara-Yummy`.
4. Review the exact changed fields and expected content hash.
5. Apply only those fields with `--apply`, `--expected-content-hash`, and `--approve-fields`.
6. Never use `--publish`.
7. Verify live/local parity, publication state, and unchanged `lastmod` after the write.

If current research does not justify expansion, perform the source and prose repair without manufacturing a news section.

## 5. Deliverable

Update the page and create `docs/content-analysis/2026-08-13-tara-yummy-profile-refresh.md` with the source packet, attribution repair, identity-claim verification, developments considered, personality counterevidence, structural decisions, changed database fields, parity proof, and GSC measurement plan.

## Verification checklist

- [x] Canonical identity is Tara Yummy and the URL remains lowercase `tara-yummy`.
- [x] Every load-bearing quote is traceable to a direct or named source.
- [x] Persian or Iranian identity and family claims come from reliable self-report.
- [x] Low-quality biography sources are removed from load-bearing use.
- [x] Type 2 doctrine is Tara-specific and includes counterevidence.
- [x] Public persona and inferred motive are separate.
- [x] No em dashes or internal quality comments remain.
- [x] Title strategy, slug, canonical, publication state, and `lastmod` remain unchanged unless an approved exception is recorded.
- [x] Source audit, lint, checks, production compilation, guarded apply, and parity verification pass.

## Risks and gotchas

The existing article scored well because it contains specific human detail. Do not flatten it while cleaning sources. Direct creator content can still be performative, so describe it as self-report rather than objective proof. The page's low visibility may be an indexing delay rather than an editorial failure, so quality repair matters more than a speculative title experiment.

## Definition of done

The Tara Yummy profile retains its strongest distinctive material, every important quote and identity claim is traceable, generic Type 2 language is replaced with person-specific reasoning, and the guarded live update preserves `lastmod` and publication state.

## Completion record

- Updated the canonical draft and wrote `docs/content-analysis/2026-08-13-tara-yummy-profile-refresh.md`.
- Source audit passed with 1 inline, 0 vague, and 0 untagged load-bearing quotes.
- People lint passed with 0 failures and 0 warnings. Project type check passed with 0 errors. Production compilation completed successfully.
- Applied only `meta_title,content,faqs,citations` to existing live row 887 with the expected content hash. No `--publish` command was used.
- Post-write live/local content hashes both equal `aca2e9eab6474e945a16b306a80b43e9`; `published=true`; `lastmod=2026-02-22` unchanged.
- A separate build-budget check remains red because the unrelated protected portrait library is 364.61 KiB and 2 files above budget. No portrait or other asset was changed by T-35.
