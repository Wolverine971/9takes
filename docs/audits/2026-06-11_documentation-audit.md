<!-- docs/audits/2026-06-11_documentation-audit.md -->

# Documentation Audit — 2026-06-11

Full-repo docs index + triage, prepped for the 9takes evaluation push.
Four parallel audits: brand/vision, root clutter, marketing/social tree, product/eng/coaching.

> **Status 2026-06-11 (same day):** Sections 1–3 executed. Evicted files live in `~/evicted-from-9takes-2026-06-11/` (not deleted). Brand color conflict in `brand-positioning.md` fixed. Growth-log funnel bugs re-verified — see dated entry in `docs/growth/growth-log.md` (2 of 3 fixed; EnneagramCTASidebar still orphaned; Experiment A unshipped but unblocked). Still open: founder story, VISION.md, coaching decision doc, outreach/distribution-assets merge, spec status badges.

## State of the docs in one paragraph

The brand voice/positioning docs are coherent and current. The design system is locked (amber Streetlamp V5, Phase 7 token cleanup done 2026-06-11). The council system is fully built and documented. The blog production pipeline commands are active and current. The big problems: **no founder story exists anywhere**, the **vision statement is buried in a tactical annual-strategy doc**, the **coaching offer has open pricing/structure questions frozen since 2026-05-03**, ~10 root-level files **belong to other projects entirely**, and ~130 session-log files are cluttering active marketing directories.

---

## 1. DELETE / EVICT (not 9takes)

| Item                                                                                                    | Why                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `ai-president-policy-platform.md` + `breaking-points-pitch-strategy.md`                                 | AI President project — move to its own repo/folder                                                                                           |
| `tinytribe-design-system.md`                                                                            | Tiny Tribe project                                                                                                                           |
| `debate-prep-left-leaning.md`, `debate-prep-right-leaning.md`                                           | Personal political debate prep                                                                                                               |
| `Companies-Graph-of-Algorithms.md`, `Hierarchy-Intelligence.md`                                         | Personal essays                                                                                                                              |
| ~~Council BuildOS + rifle-shooting sessions~~                                                           | **Revised per DJ:** kept in repo at `docs/council/sessions/other-ventures/`; council command updated to write there for non-9takes questions |
| `elon-altman-courtroom-5-1.md` (3 lines), `youtube-design.md` (link stub), `thoughts/`, `test-results/` | Orphaned stubs                                                                                                                               |
| `shaping-art-series-plan.md`, `succession-blog.md`                                                      | Orphaned, zero references                                                                                                                    |

## 2. ARCHIVE WHOLESALE (session logs, done work)

| Item                                                                                                             | Destination                                              |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `docs/instagram/daily-engagement/` (63 files)                                                                    | `docs/archives/instagram-daily-engagement-feb-jun-2026/` |
| `docs/quora/sessions/` (53 files; keep `question-log.md`)                                                        | `docs/archives/quora-sessions-apr-may-2026/`             |
| `docs/polls/` (Apr 25–26 only, dead since)                                                                       | `docs/archives/polls-apr-2026/`                          |
| `docs/domain-authority/` (12 files, dead since Feb 18)                                                           | `docs/archives/` — verify gaps folded into seo/ first    |
| `docs/validation/` (dead since Dec)                                                                              | `docs/archives/`                                         |
| `docs/daily-progress/`                                                                                           | duplicate of archives copy — delete one                  |
| `seo-audit-9takes-2026-03-24.md`, `-03-27.md` (root)                                                             | `docs/audits/`                                           |
| `blog-creator-restructure-plan.md` (root, executed)                                                              | archive                                                  |
| `docs/security/` + `docs/migrations/` (stale since 2025-12)                                                      | update or archive with a note                            |
| Dead commands: `.claude/commands/design-update.md` (teal/rose, contradicts amber brand), `twitter-warmup-old.md` | delete                                                   |

## 3. MOVE from root into docs/

- `insta-warmup.md`, `instagram-poster.md` → `docs/instagram/`
- `enneagram-competitive-landscape.md`, `enneagram-how-to-think-about-it.md`, `debate-prep-enneagram-validity.md` → `docs/positioning/` (new)
- `youtube-design-principles-guide.md`, `design-walkthrough-template.md` → `docs/design/`
- `celebs-that-lost-respect.md`, `eddie-murphy-quotes-research.md`, `clavicular-logan-paul-podcast.md` → `docs/content-research/` or transcripts dirs

**Relocated from root in 2026-07 cleanup:** `docs/planning/9takes-strat.md`, `docs/outreach/outreach-plan.md`, `docs/outreach/cold-outreach-system.md`. Keep `youtube-transcripts-people/` and `youtube-transcripts/` under review because they are active asset libraries for blog commands.

## 4. CONFLICTS to resolve

1. **Brand colors**: `docs/brand/brand-positioning.md` (lines ~234–244) still specifies purple `#7c3aed` primary; `docs/brand/9takes-style-guide-for-assets.md` still references Teal & Rose with no deprecation banner. Truth is `docs/design-system.md` (amber, locked 2026-05-04). Fix the positioning doc, banner the asset guide, banner/delete `BRAND-KIT.md`.
2. **Outreach duplication**: `docs/outreach/` and `docs/distribution-assets/` cover the same people (Chris Williamson exists in both). Merge into `docs/outreach/`.
3. **Channel strategy scattered**: `docs/growth/quora-strategy.md` → `docs/quora/`; `docs/reddit/reddit-plan.md` → `docs/outreach/`; growth/ becomes experiments-only.
4. **Marketing state fragmented across 6 docs** (START-HERE, annual strategy, marketing-log, blog-distribution-strategy, growth-log, legacy "Comprehensive Marketing Plan"). No single dashboard. Legacy comprehensive plan → archive.

## 5. GAPS (what doesn't exist and should)

1. **Founder story** — nowhere documented. No origin story, no why-Enneagram, no DJ profile/type doc. Only pitch-template self-intros in the outreach positioning doc. This is the biggest brand gap.
2. **Canonical vision doc** — the one-sentence vision lives inside `docs/planning/2026-annual-strategy.md`. Needs a standalone `docs/VISION.md` combining vision + why-Enneagram + founder story + what 9takes refuses to become (Neil Strauss's red-line doc from the council session).
3. **Coaching decision doc** — `docs/monetization/2026-05-02_decode-a-person-offering.md` pivoted to 1:1 sessions on 2026-05-03 and left pricing/length/deliverable/intake-flow as open questions. Nothing since. "Personality maxing" and "Meflow" appear in zero docs or code.
4. **Spec implementation status** — `docs/specs/` and `docs/development/` files have no SHIPPED/IN-PROGRESS/BACKLOG markers.
5. **3–5 year horizon** — planning stops at Dec 2026.

## 6. What's healthy (don't touch)

- `docs/brand/` voice/positioning content (coherent, modulo colors)
- `docs/design-system.md` + `docs/design/` rollout docs (model citizens)
- `docs/seo/` (well-organized, current), `docs/content-analysis/`, `docs/content-research/`, `docs/blog-automation/`, `docs/blogs-famous-people/`
- `docs/twitter/` (best-organized channel dir)
- `docs/council/` architecture + 9takes sessions
- `.claude/commands/` blog pipeline (current as of 2026-06-10/11)
