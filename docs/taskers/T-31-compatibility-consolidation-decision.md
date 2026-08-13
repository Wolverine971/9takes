<!-- docs/taskers/T-31-compatibility-consolidation-decision.md -->

# Tasker: Decide the Compatibility Guide and Matrix Consolidation

**For:** SEO consolidation, evidence, and editorial decision agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Ready for decision research, no redirect authorized  
**Related:** `docs/taskers/T-05-compatibility-matrix-ctr-fix.md`, `docs/taskers/T-07-merge-and-301-consolidation-plan.md`, `docs/taskers/T-26-compatibility-content-helper-brief.md`, `docs/seo/2026-08-13-indexation-recovery-audit.md`

## 0. What and why

The compatibility matrix is the clear search winner. Fresh T-26 evidence showed 30 clicks, 2,857 impressions, 1.05 percent CTR, and position 12.8 in the latest 28-day window, while the core chart query improved. The separate compatibility guide is an indexation merge candidate with little or no demonstrated search value.

An older plan proposed salvaging a 457-couple study and pairing percentages from the guide. That source no longer supports the claim. The 457-couple data, 73.4 percent figure, pairing frequencies, and derived multipliers are withdrawn and must not be reused.

This task decides whether to keep both pages, merge only evidence-safe unique material into the matrix, or retire the guide without salvage. It does not implement a redirect, canonical change, publication change, title change, or content merge.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/taskers/T-05-compatibility-matrix-ctr-fix.md`
4. `docs/taskers/T-07-merge-and-301-consolidation-plan.md`
5. `docs/taskers/T-26-compatibility-content-helper-brief.md`
6. `docs/seo/2026-08-13-compatibility-content-brief.md` and bounded change log
7. `docs/seo/2026-08-13-indexation-recovery-audit.md` and inventory CSV
8. `docs/seo/2026-08-13-winners-and-declines-refresh.md`
9. `docs/seo/2026-08-13-backlink-hygiene-baseline.md`
10. The complete current matrix and guide, including FAQs and structured data
11. Current redirects, canonicals, sitemap state, internal links, and GSC page-query data

Run `git status --short` first. This task is decision-only.

## 2. Re-verify current state

Record for both URLs:

- indexed and canonical state;
- clicks, impressions, CTR, position, and query overlap;
- internal and external inlinks;
- search-visible anchors and passages;
- word count and structural overlap;
- unique reader jobs;
- factual and evidence liabilities; and
- any changes already deployed by T-26.

Do not inherit old traffic numbers or source conclusions without checking the current data.

## 3. Evidence-safe salvage audit

Create a paragraph-level map of material unique to the guide. For each candidate, classify it as:

- supported and useful to the matrix reader;
- ordinary Enneagram editorial doctrine already covered elsewhere;
- duplicative;
- unsupported or misleading;
- incompatible with the matrix's current thesis; or
- valuable only as a separate search intent.

The withdrawn couple study and all associated percentages are automatically excluded. Re-check any health-level table, childhood-wound table, pairing claim, or research-sounding passage before calling it salvageable.

## 4. Compare three decisions

Evaluate:

### Option A: Keep both

Require a distinct query intent, a clear reader job for each page, and enough unique value to prevent ongoing cannibalization.

### Option B: Merge evidence-safe material, then redirect

Name every paragraph or table to preserve, its destination in the matrix, the claims that must be rewritten or removed, affected internal links, redirect implementation point, and post-merge verification.

### Option C: Retire the guide without content salvage

Use this when the unique material is unsupported, redundant, or lower quality than the matrix. Still inventory internal links, inbound links, and any user-facing navigation before recommending the redirect.

Recommend exactly one primary option. Include a fallback only if a named uncertainty cannot be resolved.

## 5. Deliverable

Create `docs/seo/2026-08-13-compatibility-consolidation-decision.md` containing:

1. executive decision;
2. current performance and index state;
3. query and content-overlap map;
4. paragraph-level salvage ledger;
5. evidence failures;
6. keep-versus-merge-versus-retire comparison;
7. exact implementation plan if merge or retirement is recommended;
8. redirect, internal-link, sitemap, canonical, and analytics checks;
9. expected upside and downside without fabricated click projections; and
10. the explicit approval DJ would need to give.

Do not edit either article or any redirect file in this task.

## Verification checklist

- [ ] Current GSC and live technical state are recorded.
- [ ] Every unique guide asset is classified.
- [ ] Withdrawn couple data appears only in the rejection record, never as usable evidence.
- [ ] Inbound and internal links are checked immediately before the recommendation.
- [ ] One primary decision is made.
- [ ] The implementation sequence preserves useful material before any redirect.
- [ ] No production file, article, metadata, sitemap, canonical, or redirect is changed.
- [ ] The report states the exact DJ approval required.

## Risks and gotchas

The matrix is already winning the chart query, so a broad rewrite can damage the stronger page. A weak page does not automatically deserve a redirect if it serves a different intent. Conversely, keeping two pages because one contains a large table is not justified when that table is unsupported or redundant.

## Definition of done

DJ receives one evidence-backed consolidation decision, a complete salvage and link-impact ledger, and an implementation plan that can be approved or rejected without redoing the research.
