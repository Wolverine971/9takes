<!-- docs/development/rabbit-hole-retrofit-candidates.md -->

# Rabbit Hole Retrofit — Prioritized Candidate List

**Scanned:** 2026-04-17
**Last updated:** 2026-04-17 (after Phase 2g retrofit extension)
**Source:** `src/blog/people/drafts/` (326 files) + GSC data (past 3mo + past 1mo)
**Method:** grep for four signals — Wings, Instinctual Subtypes, Counter-Typing, Arrows (integration/disintegration) — cross-referenced against real-world traffic from GSC. Traffic data normalizes this list: raw-material richness sets the effort floor, impression volume sets the payoff ceiling.

> **DB is the source of truth.** Published content lives in `blogs_famous_people`. For several high-traffic pages the DB version has diverged from the local draft — most notably **Elon Musk**, where the rabbit hole is live in the DB but the local draft is outdated. Always verify each page against the DB via `/admin/content-board/personality-analysis/[slug]` before editing. Drafts with suffixes like `-research`, `-updated-sections`, `-essay` are fragments — skip.

---

## How to read this document

This list is organized in two passes:

1. **§1 — Prioritized retrofit queue** (use this to pick the next page). Sorted by merged traffic + signal-tier priority after the GSC analysis. This is the work order.
2. **§2–5 — Signal-tier reference** (the raw scan output). Kept because it surfaces low-traffic pages with rich raw material that will matter for Phase 3+ of the rollout, or that should be prioritized if/when their traffic grows.

Traffic analysis details live in `rabbit-hole-retrofit-traffic-analysis.md`. This doc is the _list_; that doc is the _reasoning_.

---

## §1. Prioritized retrofit queue (work order)

### 1.1 Already has rabbit hole in DB — validation targets

| Page               | Status                                   | Notes                                                                                                                                                                   |
| ------------------ | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Elon-Musk**      | ✅ **Live in DB** (confirmed 2026-04-17) | Local draft outdated; do not edit the draft. Primary CTR-measurement target — 22,870 impressions in past 3 months. Baseline GSC snapshot required for 2-week follow-up. |
| Taylor-Swift       | ⚠ Unverified                            | Draft has rabbit hole; unclear if DB matches. Low traffic in GSC data. Not a measurement target.                                                                        |
| Anna-Kendrick      | ⚠ Unverified                            | Same — verify DB state; low traffic.                                                                                                                                    |
| Jeremy-Allen-White | ⚠ Draft only                            | v2-cron auto-generated, not published per pickup brief.                                                                                                                 |

### 1.2 Phase 2 — Class A quick wins (raw material exists AND has traffic) — local drafts done

This queue has been retrofitted in local drafts. `node scripts/personBlogParser.js --changed` later reported Supabase updates for the changed draft rows; verify DB state in `/admin/content-board`.

| #   | Page             | Tier | 3mo clicks  | 3mo impr | Notes                                                                                  |
| --- | ---------------- | ---- | ----------- | -------- | -------------------------------------------------------------------------------------- |
| 1   | **IShowSpeed**   | 3/4  | 20 (merged) | 8,398    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update.              |
| 2   | **Madison-Beer** | 2/4  | 18          | 3,823    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update.              |
| 3   | **Jack-Black**   | 2/4  | 14          | 1,886    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify. |
| 4   | **Hasan-Piker**  | 2/4  | 7 (merged)  | 1,281    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify. |
| 5   | **Caleb-Hearon** | 4/4  | 3           | 102      | ✅ Local draft retrofit added 2026-04-17; draft-only.                                  |
| 6   | **Dario-Amodei** | 4/4  | 4 (merged)  | 595      | ✅ Local draft retrofit added 2026-04-17; draft-only.                                  |

**Gate before Phase 3:** snapshot Elon CTR + re-measure in 2 weeks. Only commit Phase 3 authoring budget if Phase 1/2 show a CTR lift.

### 1.3 Phase 3 — Class B high-value authoring (big traffic, thin raw material)

These need rabbit holes authored from behavioral evidence in the existing body, not lifted from existing typology prose. 2× the per-page effort of Class A, but much bigger CTR payoff. Gated on Phase 1 Elon measurement.

| #   | Page              | Tier | 3mo clicks  | 3mo impr | Trajectory                                                               |
| --- | ----------------- | ---- | ----------- | -------- | ------------------------------------------------------------------------ |
| 1   | Tom-Hiddleston    | 0/4  | 21 (merged) | 4,793    | Steady                                                                   |
| 2   | Dua-Lipa          | 0/4  | 21          | 4,190    | Steady                                                                   |
| 3   | Sydney-Sweeney    | 1/4  | 18 (merged) | 4,805    | Soft decel                                                               |
| 4   | Jennifer-Lopez    | 1/4  | 16 (merged) | 3,557    | Decel                                                                    |
| 5   | Ryan-Gosling      | 0/4  | 23          | 3,139    | **Accelerating** ⬆                                                      |
| 6   | Druski            | 0/4  | 14          | 2,815    | **Accelerating** ⬆                                                      |
| 7   | Timothee-Chalamet | 2/4  | 25          | 2,379    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update |
| 8   | Gwyneth-Paltrow   | 1/4  | 20          | 3,965    | **Decelerating** — lowest Class B priority                               |

### 1.4 Phase 4 — Class C watchlist (re-evaluate in ~4 weeks)

Rising but small current traffic. If any crosses ~1,500 impressions/month, promote to Class B.

| Page                | Tier | 1mo clicks | 1mo impr | Notes                                                                                        |
| ------------------- | ---- | ---------- | -------- | -------------------------------------------------------------------------------------------- |
| Jordi-Hays          | 1/4  | 16         | 552      | 🔥 100% from past month; CTR 2.9% (anomalously high — may not benefit from retrofit)         |
| Kara-Swisher        | 0/4  | 6          | 311      | Not in drafts folder — authored in DB? Reconcile first.                                      |
| Alex-Karp           | 0/4  | 5          | 330      | New.                                                                                         |
| Agatha-Christie     | —    | 5          | 283      | Not in drafts folder.                                                                        |
| Peter-Thiel         | 0/4  | 1          | 479      | Furniture-spec validation candidate — may still be worth retrofitting for strategic reasons. |
| Emma-Watson         | 1/4  | 1          | 1,003    | High impressions for a single click.                                                         |
| Palmer-Luckey       | 0/4  | 1          | 848      | Same.                                                                                        |
| Friedrich-Nietzsche | —    | 1          | 708      | Not in drafts folder.                                                                        |
| Chappell-Roan       | 0/4  | 1          | 599      | Same shape.                                                                                  |

### 1.5 De-prioritized from the raw candidate list

These were Tier 3/4 by raw-material richness but have zero meaningful GSC traffic. Not worth retrofitting until/unless traffic materializes. Keep on the reference list (§3 below) for future promotion.

- `Pete-Davidson.md` (Tier 4, no GSC signal)
- `Johnny-Depp.md` (Tier 4, 2 clicks / 54 impr past month — negligible)
- `Henry-Cavill.md` (Tier 3, 1 click past month) — ✅ local draft retrofit added 2026-04-17; parser sync reported DB update
- `xQc.md` (Tier 3, 370 impr past month) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Sam-Altman.md` (Tier 3, 881 impr past month — rising; watch) — ✅ local draft retrofit added 2026-04-17; parser sync reported DB update
- `Shawn-Ryan.md` (Tier 3, 410 impr) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Gavin-Newsom.md` (Tier 3, 134 impr) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Tara-Yummy.md` (Tier 2 w/ 5 wing codes, 128 impr) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Andrew-Schulz.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Bobbi-Althoff.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Scarlett-Johansson.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser sync reported DB update
- `Xi-Jinping.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser sync reported DB update
- `Billie-Eilish.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser sync reported DB update
- `Princess-Diana.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Alexandria-Ocasio-Cortez.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser sync reported DB update
- `Napoleon-Bonaparte.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Pedro-Pascal.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser sync reported DB update
- `Saagar-Enjeti.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `JD-Vance.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Bella-Hadid.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Marilyn-Monroe.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser sync reported DB update
- `Cillian-Murphy.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser reported DB `published=true`; verify
- `Meghan-Markle.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser sync reported DB update
- `Abraham-Lincoln.md` (Tier 3) — ✅ local draft retrofit added 2026-04-17; parser sync reported DB update
- `Clavicular.md` (Tier 3 — likely fragment file, skip regardless)

---

## §2. Signal-tier reference (raw scan output)

This is the output of the original signal scan, preserved for reference. The work order lives in §1 above — use this section only when §1 has been exhausted or when deciding whether to promote a page from the watchlist.

### Tier 4 — All four signals present (richest material)

Cleanest retrofits. Each page already discusses Wing + Subtype + Counter-Typing + Arrows inline. Lift the existing prose into a rabbit hole block, enforce the four-section structure, apply the Distribution Rule (strip wing/subtype/arrow jargon from the main body once it's sealed in the block).

| Page               | Wing code | Wing word | Subtype | Counter-typing | Arrows |
| ------------------ | --------- | --------- | ------- | -------------- | ------ |
| `Caleb-Hearon.md`  | 3         | 3         | 1       | 1              | 2      |
| `Dario-Amodei.md`  | 1         | 5         | 1       | 2              | 3      |
| `Pete-Davidson.md` | 2         | 5         | 2       | 1              | 1      |
| `Johnny-Depp.md`   | 1         | 1         | 2       | 1              | 1      |

### Tier 3 — Three of four signals (strong candidates)

Signals legend: `[Wing | Subtype | Counter | Arrows]` — `Y` present, `.` absent.

Ranked by richness (weighted total of explicit wing codes + counter-typing mentions + subtype/arrow mentions).

| Page                          | Signals | Notes                                                                         |
| ----------------------------- | ------- | ----------------------------------------------------------------------------- |
| `Andrew-Schulz.md`            | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true` |
| `Bobbi-Althoff.md`            | YY.Y    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true` |
| `Scarlett-Johansson.md`       | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `Xi-Jinping.md`               | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `xQc.md`                      | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true` |
| `Henry-Cavill.md`             | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `Billie-Eilish.md`            | YY.Y    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `IShowSpeed.md`               | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `Princess-Diana.md`           | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true` |
| `Alexandria-Ocasio-Cortez.md` | YY.Y    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `Donald-Trump.md`             | .YYY    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `Napoleon-Bonaparte.md`       | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true` |
| `Pedro-Pascal.md`             | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `Saagar-Enjeti.md`            | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true` |
| `Sam-Altman-research.md`      | .YYY    | ⚠ `-research` fragment — check if `Sam-Altman.md` is the real draft          |
| `Sam-Altman.md`               | .YYY    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `JD-Vance.md`                 | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true` |
| `Clavicular.md`               | YYY.    | ⚠ unusual filename — verify what this is                                     |
| `Bella-Hadid.md`              | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true` |
| `Marilyn-Monroe.md`           | .YYY    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `Cillian-Murphy.md`           | .YYY    | ✅ Local draft retrofit added 2026-04-17; parser reported DB `published=true` |
| `Meghan-Markle.md`            | Y.YY    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `Abraham-Lincoln.md`          | YY.Y    | ✅ Local draft retrofit added 2026-04-17; parser sync reported DB update      |
| `Gavin-Newsom.md`             | YY.Y    | ✅ Local draft retrofit added 2026-04-17                                      |
| `J.K.-Rowling.md`             | .YYY    |                                                                               |
| `Shawn-Ryan.md`               | Y.YY    | ✅ Local draft retrofit added 2026-04-17                                      |
| `Mr-Beast.md`                 | YY.Y    |                                                                               |

### Tier 2 — Two of four signals (medium candidates)

82 pages total. Top 30 by richness:

| Page                             | Signals |
| -------------------------------- | ------- | ---------------------------------------- |
| `Greta-Thunberg.md`              | Y..Y    |
| `Gary-Vee.md`                    | Y..Y    |
| `Justin-Trudeau.md`              | YY..    |
| `Tim-Dillon.md`                  | Y..Y    |
| `Kylie-Jenner.md`                | Y.Y.    |
| `Doja-Cat.md`                    | Y..Y    |
| `Madison-Beer.md`                | Y..Y    |
| `Tara-Yummy.md`                  | YY..    | ✅ Local draft retrofit added 2026-04-17 |
| `Hasan-Piker.md`                 | YY..    |
| `Napoleon-Bonaparte-research.md` | Y..Y    | ⚠ fragment                              |
| `Jeff-Bezos.md`                  | Y..Y    |
| `Jennifer-Garner.md`             | Y.Y.    |
| `Dolly-Parton.md`                | Y..Y    |
| `Hozier.md`                      | Y..Y    |
| `Joe-Biden.md`                   | Y..Y    |
| `Brittany-Broski.md`             | Y..Y    |
| `Jacob-Elordi.md`                | Y..Y    |
| `Kai-Cenat.md`                   | Y.Y.    |
| `Rihanna.md`                     | Y.Y.    |
| `Alexis-Bledel.md`               | Y..Y    |
| `Satya-Nadella.md`               | ..YY    |
| `Stephen-King.md`                | Y..Y    |
| `Steven-Bartlett.md`             | Y..Y    |
| `Will-Smith.md`                  | YY..    |
| `Conor-McGregor.md`              | Y..Y    |
| `Dax-Shepard.md`                 | Y..Y    |
| `Kamala-Harris.md`               | Y..Y    |
| `Rachel-Brosnahan.md`            | .YY.    |
| `Keke-Palmer.md`                 | ..YY    |
| `Kyle-Forgeard.md`               | Y..Y    |

(Remaining 52 Tier-2 pages available on request — the curve drops sharply after this.)

### Tier 1 — Single signal (132 pages — low priority)

Skipped. A single mention usually indicates a drive-by reference ("her wing is unclear") rather than enough raw material for a 400–700 word rabbit hole.

---

## §3. Methodology / reproducibility

Scan script is ad-hoc (inline Python with Grep). If we want to re-run this against the live DB content:

1. Pull all `blogs_famous_people.content` for `published=true` rows.
2. Apply the same four regex patterns.
3. Rank by signal coverage.

Patterns used:

- Wing code: `\b[1-9]w[1-9]\b`
- Wing word: `(?i)\bwing\b|\bwings\b`
- Subtype: `(?i)subtype|instinctual|\b(sp|sx|so)/(sp|sx|so)\b`
- Counter-typing: `(?i)counter-typ|countertyp|counter typ|mistyp`
- Arrows: `(?i)integration|disintegration|stress arrow|growth arrow|connecting line`

Arrow signal has some false-positive risk ("integration" outside Enneagram context) — a quick eyeball of each Tier 3+ page before editing is advised.
