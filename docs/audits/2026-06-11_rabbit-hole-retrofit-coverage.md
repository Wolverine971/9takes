<!-- docs/audits/2026-06-11_rabbit-hole-retrofit-coverage.md -->

# Rabbit-Hole Retrofit — Coverage Audit (2026-06-11)

Read-only audit of how far the retrofit actually got. Spec sources: `docs/development/enneagram-rabbit-hole-furniture-task.md`, `docs/development/rabbit-hole-retrofit-tasker.md`.

## TL;DR

Infrastructure is 100% shipped (CSS, furniture spec, all three enneagram-corner pillar pages). Content coverage is the gap: **51 of 358 published analyses (~14%) have the rabbit hole in local drafts; 0 verified in the production DB** (parser claimed 29 row updates on 2026-04-17, never visually confirmed). Visual QA has never happened. The Phase 3 decision gate (2026-05-01 CTR measurement on Elon) came and went with no recorded decision.

## Status checklist

| Element                                                                                | Status                                 | Coverage                                         |
| -------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| CSS (`.enneagram-rabbit-hole`, `src/scss/blog.scss:679`)                               | SHIPPED                                | 100%                                             |
| Furniture spec + HTML template (`docs/content-generation/blog-furniture-guide.md:647`) | SHIPPED                                | 100%                                             |
| Pillar pages (wings / subtypes / connecting-lines)                                     | SHIPPED                                | 100%                                             |
| Local draft retrofits                                                                  | BUILT                                  | 51 drafts (43 marked published)                  |
| DB sync                                                                                | **UNVERIFIED**                         | 29 claimed (2026-04-17), 0 confirmed             |
| Visual QA (desktop + 375px mobile)                                                     | **NOT STARTED**                        | 0%                                               |
| URL-case 301 redirect (`+page.server.ts`)                                              | MERGED, DEPLOY PENDING                 | blocked on GSC baseline snapshot                 |
| Phase 3 Class B pages (7 high-traffic, thin material)                                  | GATED                                  | blocked on unrecorded 2026-05-01 CTR measurement |
| FAQPage JSON-LD (separate tasker)                                                      | QUEUED                                 | ~5 drafts only                                   |
| Title/meta intent rewrites                                                             | NOT PART OF RETROFIT SPEC; NOT STARTED | 0%                                               |

## Remaining work, ranked

**Blocking (do first):**

1. **Verify DB sync** (1–2 h): spot-check 4–5 high-traffic rows in `/admin/content-board` (ishowspeed, elon-musk, etc.) — does `blogs_famous_people.content` contain the block?
2. **Dev render QA** (2–3 h): collapsed/open states, mobile 375px, link colors — per furniture spec §3c. None of the retrofits have ever been rendered in a browser.
3. **Fresh GSC 28-day baseline** (10 min) → `docs/analytics/` (also required by the funnel campaign).
4. **Deploy the 301 redirect code** (30 min incl. curl verification) — merged but undeployed.

**High-leverage next:** 5. Commit the 51 modified local drafts (one clean commit). 6. LLM-citation baseline rerun (`docs/development/llm-citation-baseline-tasker.md`). 7. Phase 3 go/no-go: the Elon CTR measurement window (2026-05-01) closed with no recorded decision — measure now with fresh GSC, then decide on the 7 Class B pages (~12 h authoring).

**Deferred:** Tier-3 gaps (J.K. Rowling, MrBeast), FAQPage JSON-LD workstream, measurement calendar.

## Gotchas

- **DB/draft divergence is real**: Elon's DB row is confirmed AHEAD of the local draft. Several drafts (Jack-Black, Hasan-Piker, xQc) are `published: false` locally but have published DB rows. Diff before pushing — relates to the open "DB re-sync of 148 published rows" item from the blog pipeline audit.
- Original spec referenced a nonexistent pillar URL (`enneagram-integration-disintegration`); retrofits correctly use `enneagram-connecting-lines` — update the spec.
