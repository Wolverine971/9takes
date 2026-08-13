<!-- docs/taskers/T-34-larry-page-profile-refresh.md -->

# Tasker: Audit and Refresh the Larry Page Personality Analysis

**For:** Public-figure research and personality-analysis editorial agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Done 2026-08-13  
**Related:** `docs/seo/2026-08-13-indexation-recovery-audit.md`, `docs/content-analysis/2026-07-18_people-corpus-audit.json`, `src/blog/people/drafts/Larry-Page.md`

## 0. What and why

The Larry Page page earned 3 clicks from 265 impressions at 1.13 percent CTR and average position 13.4 in the clean 98-day indexation audit, but recent visibility fell to zero impressions in the compared 28-day window. The July audit found live/local parity, an old A-minus grade, roughly 45 prose em dashes, a load-bearing source gap, and repeated Type 5 language shared with other profiles.

The current page makes strong claims about Page vanishing, private islands, board participation, vocal-cord health, secret projects, and his motives. Audit every one, update what materially changed, and rebuild the personality argument around traceable behavior rather than the generic idea that private billionaire equals Type 5.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/seo/2026-08-13-indexation-recovery-audit.md` and Larry Page's inventory row
4. Larry Page's row in `docs/content-analysis/2026-07-18_people-corpus-audit.json`
5. `docs/taskers/news-refresh-2026-07/README.md`
6. The complete current `src/blog/people/drafts/Larry-Page.md`
7. Current GSC page-query data and current live database parity

Run `git status --short` first. Re-run live/local parity before editing. Never modify `lastmod`.

## 2. Research assignments

Use current primary and authoritative sources to determine:

1. Larry Page's current formal role, board status, voting control, and public involvement with Alphabet.
2. Which private-island and residence claims are documented, which are estimates, and which are sensational repetition.
3. What happened to Page's aviation ventures and whether the article's flying-car framing is still accurate.
4. The current medical facts Page himself disclosed about his voice, without speculating beyond his disclosure.
5. Which quotes establish his management philosophy, privacy preference, 10x thinking, and relationship to public leadership.
6. Whether withdrawal is the page's strongest psychological throughline or merely the easiest public narrative.
7. Which evidence supports Type 5, which complicates it, and whether Type 1, Type 9, or another reading explains key behavior better.

Prefer Alphabet and Google filings, founder letters, PageRank research, Stanford or official institutional sources, full interviews, public records, and high-quality original reporting. Do not cite scraped billionaire biographies or property claims that simply repeat another article.

## 3. Editorial contract

The page must distinguish:

- what Page built or said;
- what a filing or reporter establishes;
- what is unknown because Page is private;
- what 9takes interprets through Type 5; and
- what evidence cuts against that interpretation.

Do not convert absence from the press into proof of emotional withdrawal. Do not state that Page hated being CEO unless a traceable source supports the narrower behavior being described. Avoid mind reading about health, family, privacy, or residence.

Keep the best distinctive mechanisms, including information control, systems leverage, technical depth, and delegation of public-facing roles, only when they are evidenced. Remove generic Type 5 doctrine, duplicated corpus phrases, stale résumé chronology, untraceable quotes, internal quality notes, and all em dashes.

Do not retitle toward keywords. Preserve the persona promise unless the audit shows the current "vanished" framing is materially misleading.

## 4. Publishing workflow

Edit the canonical draft, then:

1. Run `node scripts/blog-source-audit.mjs src/blog/people/drafts/Larry-Page.md --fail-on-untagged-load-bearing`.
2. Run relevant people lint and project checks.
3. Preview with `node scripts/personBlogParser.js Larry-Page`.
4. Review the exact changed fields and expected content hash.
5. Apply only those fields with `--apply`, `--expected-content-hash`, and `--approve-fields`.
6. Never use `--publish`.
7. Verify live/local parity, publication state, and unchanged `lastmod` after the write.

Stop if the live row changes during the task.

## 5. Deliverable

Update the page and create `docs/content-analysis/2026-08-13-larry-page-profile-refresh.md` with the source packet, corrected claim ledger, current-role findings, rejected developments, Type 5 evidence and counterevidence, structural changes, applied database fields, parity proof, and GSC measurement plan.

## Verification checklist

- [x] Current Alphabet role and control claims are verified through current official material.
- [x] Island, residence, health, and aviation claims are accurately scoped.
- [x] Every load-bearing quote is traceable.
- [x] Privacy is not treated as proof of motive.
- [x] Alternative type evidence is included.
- [x] Generic corpus language, internal quality comments, and em dashes are removed. The four mechanical ledgers required by `blog-lint` remain.
- [x] Title strategy, URL, publication state, canonical, and `lastmod` are preserved unless an approved exception is documented.
- [x] Source audit, lint, project check, and production compilation pass. The separate portrait-library budget remains over its pre-existing fixed baseline by 364.61 KiB and two files; Larry's refresh changes no assets.
- [x] Guarded parser dry run and apply complete with post-write parity.

## Risks and gotchas

Larry Page's privacy creates a vacuum that secondary outlets fill with confident stories. Absence of evidence is not evidence of a hidden motive. Current corporate role and property claims can change, so verify them at the time of writing. A newer fact belongs only if it strengthens or corrects the psychological argument.

## Definition of done

The Larry Page profile is current, skeptical about unknowable claims, source-traceable, distinct from generic Type 5 profiles, and safely synchronized to the live row without changing `lastmod`.

## Completion note

Completed the current-role, property, aviation, health, quote, and personality-evidence audit; rewrote the canonical profile; and documented the source packet and corrected claim ledger in `docs/content-analysis/2026-08-13-larry-page-profile-refresh.md`. The reviewed fields were applied atomically to existing row `1040` using expected content hash `fd5e0179d3c1c0f2378de258d659456f`. Post-write content, metadata, and `lastmod` parity pass; `published` remains `true`; `lastmod` remains `2026-05-07`; and `--publish` was never used.
