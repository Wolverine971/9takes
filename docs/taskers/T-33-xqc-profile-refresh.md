<!-- docs/taskers/T-33-xqc-profile-refresh.md -->

# Tasker: Audit and Refresh the xQc Personality Analysis

**For:** Public-figure research and personality-analysis editorial agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Done (2026-08-13)  
**Related:** `docs/seo/2026-08-13-indexation-recovery-audit.md`, `docs/content-analysis/2026-07-18_people-corpus-audit.json`, `src/blog/people/drafts/xQc.md`

## 0. What and why

The xQc page had 1 click from 347 impressions at 0.29 percent CTR and average position 7.5 in the clean 98-day indexation audit, yet it is currently in Google's crawled-not-indexed cohort. The draft and live database row matched in the July parity audit, but the article was last substantively dated February 23, 2026.

The older article carries a strong Type 7 thesis, but the July audit found roughly 40 prose em dashes, no clean answer block, and load-bearing quotes with incomplete or missing attribution. It is centered heavily on 2023 events. Audit the entire page, verify what still holds, research meaningful developments since the last edit, and update the live row only through the guarded people-pipeline workflow.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/seo/2026-08-13-indexation-recovery-audit.md` and the xQc inventory row
4. The xQc row in `docs/content-analysis/2026-07-18_people-corpus-audit.json`
5. `docs/taskers/news-refresh-2026-07/README.md` for the people-refresh doctrine
6. A completed people refresh tasker, especially the mechanics section
7. The complete current `src/blog/people/drafts/xQc.md`
8. Current GSC page-query data and current live database parity

Run `git status --short` first. Re-run live/local parity before editing. Never modify `lastmod`.

## 2. Research assignments

Browse current sources and answer:

1. What materially changed in xQc's public arc after February 23, 2026?
2. Which developments alter, support, or complicate the Type 7 interpretation?
3. What evidence exists for stillness, responsibility, loyalty, follow-through, or sustained focus that counters the chaos thesis?
4. Which claims about gambling, health, relationships, lawsuits, platform contracts, or money are still accurate?
5. Which quotes in the cold open, diagnosis, empathy turn, and close can be traced to an original video, stream, interview, legal record, or named publication?
6. What is the strongest alternative type reading, and what evidence would change the verdict?

Use direct interviews, full clips or transcripts, official records, original announcements, and reputable reporting. Do not use clip farms, unsourced fan accounts, scraped biographies, or articles that merely quote one another.

## 3. Editorial contract

News is the door; psychology is the room. Add only developments that change the emotional or personality arc. Do not staple a chronological news section onto the existing ending.

Preserve the distinctive will scene only if every load-bearing quote and fact is traceable. Treat xQc's self-described gambling addiction as an attributed self-report, not a clinical diagnosis by 9takes. Do not diagnose mental illness, infer private feelings as facts, moralize, or reduce him to chaos.

Separate:

- observed behavior;
- xQc's own words;
- third-party reporting;
- the Enneagram interpretation; and
- counterevidence.

Do not retitle toward keywords. The tested people-corpus result showed keyword-oriented titles converted worse. Preserve the persona promise unless the audit proves it false or stale.

Remove formula repetition, generic Type 7 doctrine, stale résumé material, untraceable quotes, internal quality comments, and all em dashes. Add a concise direct answer block if the current page still lacks one.

## 4. Publishing workflow

Edit the canonical local draft. Then:

1. Run `node scripts/blog-source-audit.mjs src/blog/people/drafts/xQc.md --fail-on-untagged-load-bearing`.
2. Run the relevant people lint and project checks.
3. Preview the database diff with `node scripts/personBlogParser.js xQc`.
4. Review every changed field and capture the expected content hash.
5. Apply only the reviewed fields using `--apply`, `--expected-content-hash`, and `--approve-fields`.
6. Never use `--publish`.
7. Re-fetch or query the row and verify live/local parity, publication state, and unchanged `lastmod`.

If the live row changed after the initial parity check, stop and reconcile rather than overwriting it.

## 5. Deliverable

Update the page and create `docs/content-analysis/2026-08-13-xqc-profile-refresh.md` with:

1. source packet;
2. stale, unsupported, and retained claim ledger;
3. developments considered and rejected;
4. personality evidence for, against, and complicating Type 7;
5. structural and search changes;
6. dry-run and applied field list;
7. post-write parity evidence; and
8. post-deploy GSC measurement plan.

## Verification checklist

- [x] Current live/local parity checked before editing.
- [x] Every load-bearing quote is traceable.
- [x] Material claims about gambling, contracts, health, money, and relationships are current and sourced.
- [x] Counterevidence and an alternative type reading are present.
- [x] No armchair diagnosis or private feeling is stated as fact.
- [x] No em dashes or quality-comment blocks remain.
- [x] Title strategy, slug, canonical, publication state, and `lastmod` are preserved unless the report records an approved exception.
- [x] Source audit, lint, checks, and production compilation pass.
- [x] Parser dry run reviewed before guarded apply.
- [x] Live/local parity verified after apply.

## Risks and gotchas

Streaming coverage is full of repeated claims that originate in a single clipped moment. Trace claims backward. Legal and relationship material needs restraint and primary records where available. A new event does not belong merely because it is recent. The page should become more accurate and coherent, not longer by default.

## Definition of done

The xQc analysis is current, source-traceable, less formulaic, psychologically fair, and synchronized safely to the existing live row without changing `lastmod` or publication state.

## Completion note (2026-08-13)

Rebuilt the article around a traceable Type 7w6 case with Type 6 as the strongest alternative. Corrected the will and relationship framing with the April 2026 Texas appellate opinion, corrected the HealthyGamer quote date, separated xQc's gambling self-report from diagnosis, and added the March 2026 paid-session disclosure as a commercial complication. Reduced the body to about 2,640 words, removed 40 prose em dashes and the internal quality block, and added the direct answer, TL;DR, counterevidence, rabbit hole, and falsifier required by current people-profile doctrine.

Source audit, people lint, same-type similarity, environment-aware project check, and production Vite compilation passed. The separate build-budget audit found two unrelated portrait files already over the current budget; T-33 did not touch portrait or budget files.

The guarded parser updated row 863 using expected hash `6b4c63f803aaf720ef7d251f1ad979d3` and the exact approved field set `meta_title,description,content,faqs,citations`. `--publish` was not used. Post-write live/local hash is `3921b1ecd810fb7f1d183082e0bd903c`; `published` remains `true` and `lastmod` remains `2026-02-23`.

Deployment, recrawl, Search Console indexing request, and the 7, 14, and 28-day GSC measurement plan remain DJ-gated. Full evidence is in `docs/content-analysis/2026-08-13-xqc-profile-refresh.md`.
