<!-- docs/taskers/T-36-christian-bale-profile-refresh.md -->

# Tasker: Audit and Refresh the Christian Bale Personality Analysis

**For:** Public-figure research and personality-analysis editorial agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Done  
**Related:** `docs/seo/2026-08-13-indexation-recovery-audit.md`, `docs/content-analysis/2026-07-18_people-corpus-audit.json`, `src/blog/people/drafts/Christian-Bale.md`

**Completion note (2026-08-13):** Rebuilt the profile around primary interviews and authoritative Together California, public-body, CPS, and California child-welfare sources; corrected unsafe transformation claims, neutralized the Dorchester account, removed unsupported family and internal-dialogue claims, scoped the sibling statistic, and integrated the village's 2026 construction update. Anger, public advocacy, early family duty, repeat collaborations, and long institutional work now complicate the retained 5w4 reading through explicit Type 1, 4, 6, and 8 alternatives. Source audit, people lint, environment-backed Svelte check, Vite production compilation, guarded six-field apply, and live/local parity passed at `cc6aff346e49f408cede8bb61b114a0a`; `published=true` and `lastmod=2026-04-21` are unchanged. The enclosing build command still reports an unrelated portrait-library budget overage of 364.61 KiB and two files, which this task did not modify.

## 0. What and why

The Christian Bale page earned 1 click from 179 impressions at 0.56 percent CTR and average position 9.7 in the clean 98-day indexation audit. The July corpus review found live/local parity, a pre-v2 B-plus grade, limited citation coverage, two untagged load-bearing quotes, and generic Type 5 language overlapping other profiles.

The article has a potentially strong thesis around disappearing into roles, bodily transformation, privacy, and the foster-care village. Audit the evidence before expanding it. The goal is not a new filmography. It is a sourced psychological analysis that distinguishes Bale's reported behavior from the page's Type 5 interpretation.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/seo/2026-08-13-indexation-recovery-audit.md` and Christian Bale's inventory row
4. Christian Bale's row in `docs/content-analysis/2026-07-18_people-corpus-audit.json`
5. `docs/taskers/news-refresh-2026-07/README.md`
6. The complete current `src/blog/people/drafts/Christian-Bale.md`
7. Current GSC page-query data and current live database parity

Run `git status --short` first. Re-run live/local parity before editing. Never modify `lastmod`.

## 2. Research assignments

Verify through primary or authoritative sources:

1. the exact physical-transformation figures, timelines, diets, medical warnings, and Bale's own later comments;
2. the current status of Together California and the Village for Brothers and Sisters through the organization or responsible public bodies;
3. the foster-sibling separation statistic and its actual source and scope;
4. the documented facts of the 2008 Dorchester incident, without implying guilt, innocence, or motive beyond the record;
5. any claim about estrangement or reconciliation with family;
6. the internal-dialogue, accent, privacy, and on-set craft claims in Bale's own interviews;
7. the childhood provider or "family ATM" framing and its source;
8. developments since April 21, 2026 that materially alter the existing arc; and
9. evidence for Type 5 versus Type 1, Type 4, Type 6, or another plausible interpretation.

Prefer Bale's full interviews, official Together California material, public records, reputable original profiles, and film-production sources. Use entertainment reporting only when it traces to a direct statement.

## 3. Editorial contract

Do not romanticize dangerous weight change or turn it into health guidance. Attribute every medical or dietary claim and preserve uncertainty. Treat the Dorchester incident neutrally and avoid using an unresolved family conflict as psychological proof.

The "vanishing" thesis must be tested against counterevidence: public advocacy, collaboration, anger, ambition, family commitments, and long-term project work. A Type 5 reading must explain those facts, not ignore them.

Keep the foster-care work only if its timeline, funding, status, and statistics verify. Do not turn charity into proof of a type. Remove generic Five doctrine shared with Warren Buffett, PinkPantheress, or other corpus entries. Replace it with Bale-specific observation and an explicit alternative reading.

Do not retitle toward keywords or append a film-news section. Remove untraceable quotes, stale claims, internal comments, formula fingerprints, and all em dashes.

## 4. Publishing workflow

Edit the canonical draft, then:

1. Run `node scripts/blog-source-audit.mjs src/blog/people/drafts/Christian-Bale.md --fail-on-untagged-load-bearing`.
2. Run relevant people lint and project checks.
3. Preview with `node scripts/personBlogParser.js Christian-Bale`.
4. Review the exact changed fields and expected content hash.
5. Apply only those fields with `--apply`, `--expected-content-hash`, and `--approve-fields`.
6. Never use `--publish`.
7. Verify live/local parity, publication state, and unchanged `lastmod` after the write.

Stop if concurrent live changes invalidate the preview.

## 5. Deliverable

Update the page and create `docs/content-analysis/2026-08-13-christian-bale-profile-refresh.md` containing the source packet, corrected factual ledger, safety treatment of physical transformations, neutral incident summary, charity-status verification, personality evidence and counterevidence, structural changes, applied fields, parity proof, and GSC measurement plan.

## Verification checklist

- [ ] Physical-transformation numbers and health statements are traced to reliable sources.
- [ ] Together California status and sibling-separation statistics are current and scoped.
- [ ] Dorchester and family claims are neutral and sourced.
- [ ] Every load-bearing quote is traceable.
- [ ] Type 5 reasoning addresses counterevidence and avoids corpus boilerplate.
- [ ] No health advice, diagnosis, or motive is invented.
- [ ] No em dashes or internal quality comments remain.
- [ ] Title strategy, URL, canonical, publication state, and `lastmod` remain unchanged unless an approved exception is recorded.
- [ ] Source audit, lint, checks, production compilation, guarded apply, and parity verification pass.

## Risks and gotchas

Bale's transformation stories are repeatedly rounded, sensationalized, and detached from their original interviews. Charity statistics also travel without scope. Verify both. The current page is relatively new, so the update may appropriately be a source repair and structural tightening rather than a large expansion.

## Definition of done

The Christian Bale profile is fully sourced where it matters, safe and neutral around health and family claims, distinct from generic Type 5 copy, current enough to stand for the next year, and synchronized through the guarded live workflow without altering `lastmod`.
