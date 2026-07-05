<!-- docs/content-analysis/blog-pipeline-fix-plan-2026-07-04.md -->

# Blog Pipeline Fix Plan — 2026-07-04

Execution plan for the findings in `blog-pipeline-audit-2026-07-04.md` (evidence in
`pipeline-audit-2026-07-04/`). Status boxes get checked as work lands; this doc is the tracker.

**Sequencing logic (why this order):**

1. **Truth before quality.** Automation must report honestly before anything else changes, or we
   can't tell whether later fixes worked (mostly done 07-04; Phase 1 finishes it).
2. **Instruments before prompts.** Every prior prompt-only fix decayed into self-reported
   compliance (stale ledgers, editor claiming cuts it didn't make). Build the deterministic
   counters FIRST (Phase 2), then make prompt changes that cite those counters as their exit
   condition (Phase 3). Never again ask an LLM stage to grade its own homework.
3. **Production bugs outrank editorial polish.** The dark FAQ schema and the Tobey legal claim
   affect the live site today; the structural ceiling affects future drafts.
4. **One command change at a time, each proven by a supervised run.** The nightly cron consumes
   these commands directly — every prompt edit is live at the next 2 AM run. No batch rewrites.

**Execution model:** Fable orchestrates and reviews diffs; Opus (deep-reasoner) designs anything
with judgment (timeout semantics, prompt rewrites, similarity heuristics); Sonnet (grunt-worker)
executes specs mechanically; DJ makes the decisions below, approves DB writes, and publishes.
Standing rules: never touch `lastmod`; commands stay self-sufficient (inline context, no
load-bearing out-links); no bulk operations that could clobber parallel uncommitted work.

---

## Decisions needed from DJ (with recommendations)

Phases 1–2 proceed without any of these. Each decision unblocks the marked items.

| #   | Decision                                                                                                                            | Recommendation                                                                                                                                     | Unblocks |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| D1  | Contrast-pair policy: skill ban vs creator's ≤2 license                                                                             | **Skill wins; delete the license.** The ≤2 allowance is why drafts ship 5+ and Writing is perma-capped. Editor gets a numeric lint target instead. | 3.1, 3.2 |
| D2  | Publish policy: composite auto-publish gate; B+ = publish-with-review; A = brand bar                                                | **Adopt as specced in audit Part 5.** Caps block auto-publish at the publish command; nightly flag stays low-noise.                                | 3.6      |
| D3  | Sensitive-claim source classes (crime/addiction/health/sexuality/lawsuits/abuse require named top-tier inline source, else blocked) | **Adopt as hard policy** (audit Part 4).                                                                                                           | 1.1, 3.6 |
| D4  | Production DB re-sync: 148 FAQ-remediated rows + `include_faq_schema` + Tobey fix                                                   | **Go, as one batch after 1.1/1.2 land.** Single re-sync beats three.                                                                               | 1.4      |
| D5  | Queue diversification: cap same-type share of upcoming subjects (41% T9 today)                                                      | **Cap at ~2 of any 5 consecutive subjects; refresh priority with demand signals** (`/find-surging-people`).                                        | 4.3      |

## DJ SAYS DO NOT DO THE "Sensitive-claim source classes"

## Phase 1 — Stop the bleeding (production + trust) — target: 1–2 days

### 1.1 ☐ Tobey Maguire bank-robbery claim: source or cut — URGENT

- **What:** The published post states his father was convicted of bank robbery, unsourced.
- **How:** research-analyst agent hunts a top-tier source (major-outlet profile/interview with
  named attribution). If found → inline attribution in the draft. If not → cut or soften to what
  IS sourceable. Same treatment for the draft's other flagged claims while in there.
- **Then:** file fix immediately; live fix ships via single-row DB sync (DJ approval — smaller
  ask than D4, can't wait for the batch if no source exists).
- **Verify:** live page no longer carries the unsourced claim.
- **Owner:** research-analyst → Sonnet edit → DJ approves DB write. **Size:** ~1 hour.

### 1.2 ☐ Light up the FAQ/AEO layer

- **What:** `include_faq_schema` end-to-end (audit F2).
- **How, in order:** (a) enrich command sets `include_faq_schema: true` when ≥2 real FAQs;
  (b) `personBlogParser.js` carries the field to the DB row; (c) `blog-lint.sh` fails when
  `faqs` exist without the flag; (d) backfill script sets the flag on all drafts with ≥2 real
  FAQs (mechanical, ~469 files — script, not agent, so it's reviewable as one diff);
  (e) local verify: build one page, confirm FAQPage JSON-LD emits.
- **Verify:** local render shows FAQPage; lint green corpus-wide; after D4 re-sync, live pages
  emit FAQPage (re-run the curl check from the audit).
- **Owner:** Sonnet (spec is fully mechanical), Fable reviews the backfill diff. **Size:** one session.

### 1.3 ☐ Automation phase 2 (the not-tonight items from 07-04)

- **What:** stage `timeout` with safe cleanup (the multi-day silent-stall hole), per-run
  `summary.json` assembler, cron-level lock, lint-fail → `needsReview` wiring, queue completeness
  (log true failures to `failed[]`, track manual runs).
- **How:** Opus finalizes the timeout design (must not leave half-written drafts — kill process
  group, mark stage failed in summary, release lock, sentinel true) building on
  `pipeline-audit-2026-07-04/automation-report.md`; Sonnet implements; test with a deliberately
  hung dummy stage before the nightly picks it up.
- **Verify:** simulated hang → clean abort + true sentinel + Telegram alert; 7 consecutive
  nights with zero false alerts and zero silent anomalies.
- **Owner:** Opus design → Sonnet execute → Fable review. **Size:** one session.

### 1.4 ☐ Bookkeeping cleanup (grunt batch)

- Reconcile Matt-Smith grade (frontmatter 9.0/A vs log 8.6/B+) — keep the log-backed grade
  unless DJ says otherwise. Fix the corpus-stat count bug (138 vs 373 "people profiled" —
  find the generator, fix the source of truth). **Owner:** Sonnet. **Size:** <1 hour.

---

## Phase 2 — Deterministic instrumentation — target: 2–3 days

Build all five checks as scripts with report output BEFORE any prompt changes. Each has known
ground truth from the audit to validate against.

### 2.1 ☐ Contrast-pair / negative-parallelism counter

- In `blog-lint.sh` (or a `blog-quality-report.sh` sibling): count the constructions from
  `fingerprint-report.md` (`not X, it was Y` family, `wasn't X. It was Y`, `looked like X`
  - reversal). Emits count + line numbers. Replaces the self-reported Formula Fingerprint Ledger.
- **Ground truth:** Steve Martin final must count ≥5 (grader found 5+ where the ledger said less).

### 2.2 ☐ Load-bearing source audit

- Script extracts quotes/claims in the five load-bearing slots (epigraph, cold open, diagnosis
  cluster, empathy turn, close) and classifies attribution: inline outlet+year / vague /
  untagged. Report feeds second-pass (3.3) and grader (3.4).
- **Ground truth:** Jeff Goldblum's shower-glass spine quote must classify untagged.

### 2.3 ☐ Same-type argument-similarity scan

- Compare a new draft's counter-typing tiebreaker + diagnosis sentences against the last N
  same-type drafts (n-gram or sentence-similarity; Opus picks the cheapest reliable method).
  This is one-of-one test #2 made executable.
- **Ground truth:** Zac ↔ Mira's near-verbatim 3-vs-9 tiebreaker must trip it.

### 2.4 ☐ Head-term + answer-block + FAQ-flag lint

- `meta_title` must contain name + one of {enneagram, type N, personality type} or an explicit
  `head_term_exception`; type-answer section opens with an extractable ≤60-word block; FAQ flag
  present when FAQs exist (from 1.2).
- **Ground truth:** 5 of the 6 recent drafts must fail head-term as-is; Zac's revised meta_title
  must pass.

### 2.5 ☐ Corpus phrase-frequency-by-type report

- Extends the fingerprint scan into a rerunnable script: signature-phrase counts grouped by
  type, top-K overused phrases per type → emits a dynamic avoid-list file the creator command
  references (3.1). **Ground truth:** "core wound" at ~44% of Type 4 drafts.

**Owner for all of 2.x:** specs exist in the evidence reports; Opus tightens each spec's edge
cases, Sonnet implements, validate against ground truth before moving on. **Size:** ~1 session
per check; 2.1 + 2.4 first (they gate Phase 3's editor/enrich changes).

---

## Phase 3 — Prompt/spec changes — target: 1 week, one command per day, supervised

Rule for every item: edit the command → run a supervised manual pipeline on a fresh test subject
→ review output + instrument readings → keep or revert same day (never leave an unproven prompt
for the 2 AM cron). Commands stay self-sufficient.

### 3.1 ☐ Creator v2 (biggest change, do after 2.1/2.3/2.5 exist) — needs D1

- Delete the ≤2 contrast-pair license (D1); point at the lint counter as the standard.
- Ledgers become references to generated reports, not self-reported counts.
- Bespoke TL;DR labels (ban the 4-slot skeleton labels by name) + one bespoke section form
  requirement (one-of-one test #3).
- Pre-write **type-challenge memo**: strongest case for assigned type / strongest case against /
  named tiebreaker / one behavior the type does NOT explain / explicit confidence. Low
  confidence or missing tiebreaker → flag for human type decision before drafting.
- Empathy-turn grammar: ban the house template (`wasn't [cruelty], it was [armor]`); require the
  turn built from the person's own wound-vocabulary.
- Reference the dynamic avoid-list from 2.5 for the subject's type.

### 3.2 ☐ Editor pass — needs D1, 2.1

- One hard exit condition: lint contrast count ≤ target (0 prose contrast-pairs under D1) —
  editor may not exit claiming cleanup the counter contradicts.

### 3.3 ☐ Second pass — needs 2.2

- Source-audit-first ordering: consume the 2.2 report and fix ALL untagged load-bearing slots
  wholesale before addressing fresh-eyes notes (kills grader-named whack-a-mole).

### 3.4 ☐ grade_blog — needs 2.1–2.4

- `Read` the closest-letter anchor text; emit per-dimension diff vs that anchor (top variance fix).
- Name ALL load-bearing quotes in the FIRST grade (feed from 2.2 report).
- New `content_quality` fields: `caps_applied[]`, `confidence`, `anchor`, `needs_review`.
- Monocausal cap (single wound explaining every major behavior → Enneagram Integration capped).
- Must quote the exact interior line + empathy-turn sentence; house-grammar turn → capped.

### 3.5 ☐ Fresh-eyes personas

- Always: Superfan + Skeptic/fact-checker. Rotate third: Search-visitor (high-demand subjects) /
  Type-curious newcomer (surprising type calls). One synthesis step ranks notes by
  weighted-dimension leverage. Pre-draft fan-expectation checklist (defining relationship /
  defining role / current anchor / biggest controversy / fandom lore) added to creator prep for
  high-recognition subjects.

### 3.6 ☐ Publish command composite gate — needs D2, D3

- Extend the existing gate block (`blog_content_publish_people.md:46-48,96-99`): auto-publish
  requires overall ≥8.5 AND no active Writing/Originality/Evidence cap (`caps_applied[]` empty)
  AND disc ≥7 AND grade-stable (|first − regrade| ≤ 0.3) AND source standard met (2.2 report:
  zero untagged epigraph/cold-open, no unsourced sensitive claim). Anything else → hold with a
  named reason for DJ.

### 3.7 ☐ Cohesion stage: measure, then merge or keep

- Stage-delta test on 3 supervised runs (diff draft before/after stage 4). No detectable
  distinct artifact → merge its through-line checklist into the editor pass and drop the stage
  (saves a full `claude -p` per run). **Owner:** Sonnet runs diffs, Opus judges, DJ signs off on
  removal.

**Phase 3 acceptance (measured on the next 5 pipeline drafts):** bespoke TL;DR labels 5/5;
prose contrast-pairs ≤ target 5/5; zero untagged load-bearing slots 5/5; no similarity-scan
trips; grade variance |first−regrade| ≤ 0.3 on ≥4/5; at least one draft with an honest shot at
A on a substrate-rich subject.

---

## Phase 4 — Product loop & queue — target: week 2

### 4.1 ☐ Wire `gen:chorus` into publish

- `pnpm gen:chorus` exists and NineChorus consumes its output; 0/469 drafts carry
  `chorus_question`. Add it to the publish command flow (and backfill published profiles in the
  D4 re-sync batch if output quality holds — spot-check 5 outputs first).

### 4.2 ☐ Per-profile bridge funnel

- growth-analyst builds the queries off existing instrumentation: `gate_shown → contributed`
  per profile slug, scroll-to-Chorus, test-CTA clicks, related-profile clicks, email capture.
  Correlate vs grade and demand. **This answers the strategic question that sizes all future
  editorial investment:** does quality drive conversion where it doesn't drive traffic?

### 4.3 ☐ Queue refresh — needs D5

- Demand-signal refresh of `backlog-queue.json` priority (via `/find-surging-people`), same-type
  spacing cap, and substrate scoring: prefer subjects with rich primary-source availability
  (court records, long-form interviews, memoirs) — the audit's clearest path to A grades.

---

## Success metrics (program-level)

1. 7 consecutive nights: zero false Telegram alerts, zero silent failures, queue state accurate.
2. FAQPage JSON-LD live on published personality-analysis pages (curl check).
3. No unsourced sensitive claims live; next 5 drafts pass the source standard at B+ level.
4. Next 5 drafts: bespoke TL;DRs, contrast count at target, no similarity-scan trips.
5. Grade variance ≤0.3 between grade and regrade on untouched dimensions.
6. First honest A (≥9.0) within ~10 substrate-rich subjects.
7. Funnel report exists answering "does grade predict contribution/test-start conversion?"

## Standing safety rules for all phases

- Nightly cron is always one edit away: prompt/script changes land only with a same-day
  supervised verification run, or get reverted before 2 AM.
- No `lastmod` changes, ever. No bulk draft edits without a reviewable script diff.
- DB writes (single-row or batch) are DJ-approved, each time.
- Every fix that claims to work must cite its instrument reading (lint output, report, live curl),
  not stage self-report.
