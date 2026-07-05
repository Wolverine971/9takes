<!-- docs/content-analysis/blog-pipeline-audit-2026-07-04.md -->

# Blog Pipeline Audit — 2026-07-04

Executed from the research handoff (`blog-pipeline-research-handoff-2026-07-04.md`) by a five-agent
audit: corpus fingerprint scan (17 recent + 469 total drafts), full pipeline-log extraction (~30
runs), automation-integrity review, editorial deep audit (lanes 1-4, six recent drafts read in
full), and grading/review/growth audit (lanes 5-8). Full evidence reports with tables, quotes, and
file:line citations live in `docs/content-analysis/pipeline-audit-2026-07-04/`:
`fingerprint-report.md`, `logs-report.md`, `automation-report.md`, `editorial-report.md`,
`grading-growth-report.md`.

**Verdict.** The problem has moved twice. The 2026-06-10 audit fixed a dishonest _process_ (cron
bypassing stages, math bug, stale gates). The 2026-07-01 recalibration fixed dishonest
_measurement_ — and it worked: first-pass grade mean dropped 8.80 → 8.31, the ≥8.5 cluster is
broken, caps are applied with named rationale, zero A grades since. What honesty reveals is a
**structural ceiling at ~8.2–8.5**: the pipeline reliably manufactures one excellent artifact —
same furniture, same empathy-turn grammar, same monocausal engine, same untagged-quote pattern.
Mira Murati's 8.8 was substrate (court testimony, viral clips, live drama), not structural
reinvention. The path to A runs through four levers, none of which is "execute the template
better": **(1) subject substrate/selection, (2) forced bespoke form, (3) source rigor at the
load-bearing layer, (4) automation trustworthy enough that humans review only what needs review.**
Plus one verified production bug bigger than any editorial issue: **the entire FAQ/AEO layer is
dark** (Finding 2).

---

## Part 1: Ranked findings

### F1 — Automation lies in both directions — HIGH (safe fixes applied today)

Two opposite failure modes, confirmed across all ~30 run logs:

- **False failure (since 2026-07-02):** `run-blog-pipeline.sh:68` sets `PIPELINE_COMPLETED=0` and
  nothing ever set it to 1, so the EXIT trap wrote a `FAILED_AT_STAGE` sentinel on _every_ run,
  including clean ones (Steve Martin: B+ 8.5, lint 0/0, `stage=9_regrade exit=0`). Consequences:
  cron (`nightly-blog-cron.sh:211-215`) forced `needsReview=true` on publication-ready drafts
  (it was the _only_ reason Steve Martin got flagged), and the watchdog fired a **false Telegram
  failure alert every night**.
- **Silent true failure (before 2026-07-02):** 14 genuinely failed runs left _no_ sentinel —
  12 zero-byte orphan runs, one mid-stream death, one run where all 7 stages were 401 auth
  failures (Maisy-Stella: no draft exists anywhere, yet nothing alerted). One run
  (zac-efron 07-02_020000) was 100% session-limit refusals with exit=0 everywhere — every stage
  "succeeded" and produced zero work.
- `run_stage` (`run-blog-pipeline.sh:98-107`) captured stage exit codes and discarded them
  (`return 0` always, no record).

**Applied today (verified):** `PIPELINE_COMPLETED=1` at end-of-run; per-stage
`stage-summary.tsv` + `STAGE_WARNINGS` file; cron now reads `STAGE_WARNINGS` as a needsReview
trigger. See Part 10. **Not yet fixed:** no stage timeout — a hung `claude -p` holds the lock and
the watchdog reads the live lock as _healthy_, i.e. a multi-day silent stall is possible (backlog,
needs care: a blind `timeout` can leave half-written drafts).

### F2 — The FAQ/AEO layer emits nothing — HIGH (verified live)

`PeopleBlogPageHead.svelte:111` gates FAQPage JSON-LD on `data?.include_faq_schema === true`.
Nothing sets that flag: 0 of 469 drafts carry it, `personBlogParser.js` never extracts it, no
admin path writes it. Verified live on `9takes.com/personality-analysis/matt-smith` and
`/tobey-maguire`: Article/Person/Breadcrumb schema present, **zero FAQPage**. The 979
body-derived FAQs from the June remediation — and the rubric's discoverability reweighting around
AEO — currently produce no answer-engine schema at all. (`blogPerformanceDiagnostics.ts:487`
even checks for the flag, so diagnostics knows.) Companion finding: on-page `<FAQSection>` is
referenced only in a stale comment and is not rendered — FAQs were _only_ ever schema, and the
schema is off.

**Fix path:** enrich command sets `include_faq_schema: true` when ≥2 real FAQs exist; parser
carries it to the DB; lint fails when FAQs exist but the flag is absent; re-sync published rows
(folds into the pending 148-row DB re-sync from June).

### F3 — Honest grader, one artifact: the 8.2–8.5 structural ceiling — HIGH

Post-recalibration first-pass grades: 8.0, 8.4, 8.3, 7.9, 7.9 (median 8.0, no A anywhere,
final post-revision mean 8.50). The editorial audit's conclusion: this is now an accurate
measurement of a real ceiling. All six recent drafts share the furniture inventory, the
empathy-turn grammar (`[behavior] wasn't [cruelty], it was [armor] from childhood`), and the
diagnosis shape. The handoff's name-redaction test **does not discriminate** — all six drafts
pass 5/5 on subject-specific detail density; swappability lives one layer up, at
scaffolding + analytical moves. Structural-uniqueness scores (/5): Goldblum 4, Mira 4, Rosé 3.5,
Steve 3, **Tobey 2, Zac 2**. The two Type 9s (Zac ↔ Mira) share a nearly verbatim 3-vs-9
counter-typing tiebreaker ("a Type 3 always knows whether they're winning") — type-colored
Mad Libs confirmed at the argument layer.

### F4 — Load-bearing claims are under-sourced; one published legal risk — HIGH

Worst first: **Tobey Maguire (published) states his father was convicted of bank robbery with no
source** — a criminal claim about a living person's family. Others: Jeff Goldblum's thesis-spine
quote ("he explained decades later" — no outlet/date); Zac Efron's three untagged load-bearing
quotes (depression, jaw, addiction) with disclosed `no_raw_transcripts`; Rosé's diagnosis rests
on four untagged quotes; Mira's coup-arming/Zoph-firing claims are hearsay-grade ("per a rival's
internal memo"). Pattern: **revision tags only the quotes the grader names, then stops** (Jeff:
grader named 5 → revision tagged 5 → regrade found the 6th → Evidence stayed 8). The `citations`
frontmatter launders: mostly Wikipedia lists that don't map to inline outlets.

### F5 — Formula fingerprint: real, but localized and partly self-admitted — MED-HIGH

The 100%-shared macro-skeleton (epigraph → firstLetter cold open → TL;DR → type-question H2 →
Rabbit Hole → return-to-opening close) is _deliberately codified_ house style — not drift. The
genuine template artifacts are narrower and countable:

- **TL;DR label skeleton:** 9-10 of 17 recent drafts share the same 4-slot skeleton; "The type:"
  is the literal first label in 7. Zac Efron's own revision notes admit the skeleton was "reused
  near-verbatim from Alex-Warren" — a documented copy left standing in 9 sibling drafts. The 7
  bespoke-label drafts are all the newest: improvement is happening, but per-draft/reactive.
- **"X is the tell"** appears in 94 of 469 drafts corpus-wide (20%), as the same diagnostic beat.
- **Type-vocabulary Mad Libs:** "core wound" in 44% of Type 4 drafts vs 5-6% of Types 5/6 (8-9x
  concentration); "the mask" concentrated in Types 3/4.
- **Persona-title reuse:** "Escape Artist" as the epithet for three different people across two
  types (Efron, Carrey, Smith).
- **Same-type closings:** 7 of the last 17 subjects are Type 9 (see F8) and all 7 closings
  resolve on the identical hushed self-erasure beat.
- **Policy conflict driving it:** the editorial-standards skill bans negative parallelism
  outright ("THIS FILE WINS"), but creator v2 licenses ≤2 "load-bearing" contrast pairs. That
  license is why every draft ships 5+, why the editor's one job (contrast cleanup) fails in
  every draft, and why Writing sits permanently capped at 8. The Formula Fingerprint Ledger is
  self-reported and was stale on Steve Martin twice.

### F6 — Grader variance swamps the revision signal — MED

±0.5-1.0 swings on dimensions the revision never touched: Steve's Hook went 8→9 on an opening
revision explicitly refused to change; Tobey went _down_ 8.3→8.2 after sourcing all four flagged
claims. The regrade delta is noise, not a quality measure. Root cause: the grader works from
remembered anchors — it never `Read`s an actual anchor text. Revision verdict split: substantive
for sameness-capped C's (Zac 7.9→8.3, Rosé 7.9→8.4 — removing named near-verbatim moves genuinely
lifts; Steve's loop also caught a real misattribution), tactical/noise for B-band Evidence/Writing
nudges.

### F7 — The reader-to-platform bridge exists but is disconnected — MED

The bridge correctly lives in the page template, not the body: NineChorus give-first is the
instrumented primary action (`give_first_funnel_events`), plus type-pillar CTA, test link,
related profiles. **"Seed one question per profile" already exists** — `scripts/generate-chorus.mjs`
writes `chorus_question`/`nine_takes` and NineChorus consumes it — but it is wired into nothing:
0 drafts carry it, so every profile ships the generic fallback. Recommendation (adopted): wire
`gen:chorus` into the publish path; do **not** add a "self-reflection hook" rubric criterion
(grade doesn't drive traffic, r=0.11; it's a new gaming vector; the emotional-interior criterion
already is the self-recognition proxy).

### F8 — Queue and bookkeeping drift — MED

41% of the last 17 pipeline subjects are Type 9 — subject-type clustering feeds the same-type
sameness in F5 directly. `backlog-queue.json` misses 8 of 18 tracked people entirely (all
manual/daytime runs), its `failed` array has never had an entry (true failures just bump
`retryCount`), and Matt-Smith carries an undocumented off-pipeline regrade: frontmatter says
9.0/A, its own `7_grade.log` says 8.6/B+. Also noted by a grader log: a corpus-wide data bug
("138 vs 373 people profiled" disagreement across drafts).

### F9 — Type rigor: genuine counter-typing, but it defends a verdict — MED

Counter-typing is real, falsifiable work (Steve 5-vs-3, Rosé 4-vs-9, Mira 9-vs-5), but the type
is preassigned in the queue, the strongest counter-case is quarantined to the Rabbit Hole, and
zero drafts state a confidence level (the command offers one). Monocausality is systemic — 5 of 6
drafts route too much through one childhood wound; worst: Tobey, "Every adult habit that people
find eccentric grows from that root." Steve proves the fix costs one paragraph (revision added a
non-Glenn thread).

### F10 — What's genuinely strong (don't break it)

Emotional interior is the best dimension: all six drafts have person-specific empathy turns and
interior beats that survive to final (best: Zac's jaw-accident reframe, Mira's double turn). The
one weakness is the shared turn-sentence _grammar_ (see F5). Fresh-eyes reliably catches the
expensive superfan misses (The Fly, Vanessa Hudgens, Only-Murders, BLACKPINK context). FAQs are
real search questions, not schema filler. Lore-mining/research depth remains the system's spine.

---

## Part 2: Stage-by-stage keep / change / remove

| Stage         | Verdict                          | What changes                                                                                                                                                                                                                                                 |
| ------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Creator     | **KEEP + CHANGE**                | It mandates the furniture it's trying to escape. Make ledgers _generated_ (script counts, not self-report). Kill the ≤2 contrast-pair license (skill wins). Require bespoke TL;DR labels + one bespoke section form. Add pre-write type-challenge memo (F9). |
| 2 Fresh-eyes  | **KEEP (highest value)**         | Add personas (Part 6). Don't touch otherwise.                                                                                                                                                                                                                |
| 3 Second-pass | **KEEP**                         | Biggest quality lift. Add source-audit-first ordering so sourcing is fixed wholesale, not per-grader-callout.                                                                                                                                                |
| 4 Cohesion    | **CHANGE / SCRUTINIZE**          | Largest logs, no distinct artifact detectable in final drafts, overlaps editor. Run a stage-delta test on 3 runs; likely merge into editor.                                                                                                                  |
| 5 Editor      | **KEEP but failing its one job** | Contrast-pair fingerprint survives it in every draft. Give it the lint-generated contrast count and require ≤ target before exit. This is also what un-caps Writing.                                                                                         |
| 6 Enrich      | **KEEP + FIX**                   | Must set `include_faq_schema: true` (F2). Deterministic meta_title head-term rule (Part 7).                                                                                                                                                                  |
| 6.5 Lint      | **KEEP + EXTEND**                | Comment-strip fix applied today. Add: contrast-pair counter, head-term check, FAQ-flag check, answer-block check.                                                                                                                                            |
| 7 Grade       | **KEEP + CHANGE**                | Closest-anchor `Read` + per-dimension diff; name ALL load-bearing quotes in the first grade; `caps_applied[]`/`confidence`/`anchor` fields; monocausal cap; must quote the interior line and the turn sentence.                                              |
| 8 Revision    | **KEEP**                         | Works when caps name specific defects. Feed it the full source-audit list (not just grader-named quotes) to kill whack-a-mole.                                                                                                                               |
| 9 Regrade     | **KEEP**                         | Grade-stability (first vs regrade delta) becomes a publish-gate input, not a score overwrite.                                                                                                                                                                |
| Nightly cron  | **KEEP + FIXED TODAY**           | Now reads STAGE_WARNINGS. Backlog: stage timeout, cron-level lock, queue completeness (F8).                                                                                                                                                                  |

---

## Part 3: A testable definition of "one-of-one"

The handoff's name-redaction test is necessary but non-discriminating (all drafts pass). Adopted
three-part definition — a draft is one-of-one when:

1. **Detail floor** — ≥5 subject-specific details that survive name redaction. (All current
   drafts pass; keep as floor.)
2. **Argument non-transfer** — no same-type draft in the last N shares its counter-typing
   tiebreaker or diagnosis logic. _Scriptable_: same-type argument-similarity scan over recent
   drafts. (Zac↔Mira fail today.)
3. **One bespoke section form** — at least one section whose _form_ arises from the person's
   world and collapses if transplanted to another subject. (Goldblum/Mira pass; Tobey/Zac fail.)

---

## Part 4: Source-quality standard (grade eligibility)

Load-bearing = quotes/claims in {epigraph, cold-open, diagnosis cluster, empathy turn, close}.

- **B+:** ≥3 inline-dated source tags; zero untagged quotes in epigraph/cold-open; no unsourced
  sensitive claim (crime, addiction, health, sexuality, lawsuits, abuse) anywhere.
- **A:** every load-bearing quote carries inline outlet+year (≥5 total); every sensitive claim
  sourced to a top-tier named outlet inline.
- **A+:** adds ≥1 primary source (raw transcript, court record, first-party writing) and a
  machine-checkable evidence packet (`docs/content-analysis/research/<person>.md`).

Sensitive claims without qualifying sources → `production_pretext.status: blocked` + human review,
regardless of overall score. **Immediate action item: the published Tobey Maguire bank-robbery
claim needs a source or a cut.**

---

## Part 5: Revised grading and publish policy

The recalibration stands — no re-recalibration. Changes target variance and incentives:

1. **Auto-publish is a composite gate, not a bare 8.5:** overall ≥8.5 AND no active
   Writing/Originality/Evidence cap AND discoverability ≥7 AND grade-stable
   (|first − regrade| ≤ 0.3).
2. **B+ with any active cap, 8.0–8.4 finals, or unstable grades → publish-with-human-review.**
   Adjudication of the two agents' disagreement: the _nightly_ flag stays low-noise (true stage
   failures, lint fails, sub-8.5 finals — flagging every capped B+ nightly would recreate the
   always-on-flag pathology), while **the publish command enforces the caps** — a capped draft
   cannot auto-publish no matter its overall. Steve Martin (published B+ with a live fingerprint
   cap) is the proof case for why.
3. **A (≥9.0) is the brand bar, not the publish gate.** Grade doesn't drive traffic (r=0.11);
   gating publishes on A starves throughput for no traffic gain. Grade is a floor + review
   trigger; subject selection is the traffic lever.
4. **Grader mechanics:** `Read` the closest-letter anchor text and emit a per-dimension diff
   (highest-leverage variance fix); name ALL load-bearing quotes in the first grade; add
   `caps_applied[]`, `confidence`, `anchor`, `needs_review` to `content_quality`; run summary
   records "tactical source fix" vs "substantive editorial lift."

---

## Part 6: Review persona plan (fresh-eyes)

Fresh-eyes catches superfan misses; it is blind to sourcing gaps, cross-draft sameness,
head-term/meta misses, and monocausal theses (all currently caught late, by the grader).

- **Always run:** Superfan + Skeptic/fact-checker (2 reviewers minimum).
- **Rotate in (3rd reviewer):** Search-visitor for high-demand subjects; Type-curious newcomer
  for surprising type calls.
- **One synthesis step** dedupes and ranks all comments by weighted-dimension leverage before
  second-pass (prevents overfitting to every note).
- **Pre-draft fan-expectation checklist** for high-recognition subjects (defining relationship /
  defining role / current anchor / biggest controversy / fandom lore) — the highest-leverage
  change because it _prevents_ the expensive misses instead of catching them.

---

## Part 7: Discoverability / AEO deterministic checks

Found: `meta_title` trades the head term for a curiosity hook in **5 of 6** recent drafts; the
grader enforces the rule by mood (penalized Steve, ignored the identical miss on four others).
Zac's post-revision "Zac Efron, Enneagram Type 9: The Body He Fled" (45 chars) proves head term +
hook coexist.

1. **Head-term lint:** `meta_title` must contain the person's name AND one of
   {enneagram, type N, personality type}, or frontmatter must carry an explicit
   `head_term_exception` justification.
2. **FAQ schema:** enrich sets `include_faq_schema: true` when ≥2 real FAQs; lint fails when
   FAQs exist without the flag (F2).
3. **Answer block:** the type-answer section must open with an extractable ≤60-word block
   (name, type+wing, core motivation, one evidence clause) — lint-checkable by position/length.
4. **FAQ realness policy:** ≤1 narrow body-thesis FAQ; the rest must be plausible standalone
   queries. (Current FAQs already largely comply.)

---

## Part 8: Bridge and post-publish measurement plan

Bridge work happens in the **template**, not the body or rubric (body keeps the cut-to-black
ending; rubric stays un-gameable).

- **Wire `gen:chorus` into publish** so every profile ships a person-specific
  `chorus_question`/`nine_takes` instead of the generic fallback (0/469 today).
- **Per-profile funnel** off existing instrumentation: `gate_shown → contributed`
  (give-first events), scroll-to-Chorus, test-CTA clicks, related-profile clicks, email capture.
- **Correlate against grade and demand.** Expected result given r=0.11 on traffic: demand drives
  arrivals; the open question the funnel answers is whether editorial quality drives _conversion_
  (contribution, test starts). That determines whether A-level polish pays anywhere in the
  product loop, which sets how much to invest in Parts 3-5.
- Fold the FAQ-schema fix (F2) and the pending 148-row DB re-sync into one production re-sync.

---

## Part 9: Implementation backlog

### Applied today (2026-07-04)

1. `run-blog-pipeline.sh`: `PIPELINE_COMPLETED=1` at end-of-run — kills false `FAILED_AT_STAGE`
   - nightly false Telegram alerts.
2. `run-blog-pipeline.sh`: per-stage `stage-summary.tsv` + `STAGE_WARNINGS` on non-zero exit.
3. `nightly-blog-cron.sh`: reads `STAGE_WARNINGS` → `needsReview=true` + WARN log.
4. `blog-lint.sh`: 9 structural checks now read a comment-stripped body (`BODY_NOCOMMENT`);
   ledger/em-dash/banned-phrase checks untouched. Synthetic repro of the Rose-Blackpink false
   positive confirmed fixed; `blog-lint.sh Steve-Martin` → 0 fail, 0 warn.

### Quick fixes (small, next)

- Enrich sets `include_faq_schema`; parser carries it; lint checks it (F2).
- Reconcile Matt-Smith frontmatter grade (9.0/A) vs its own grade log (8.6/B+).
- Fix the corpus-stat count bug ("138 vs 373 people profiled").
- Resolve the contrast-pair policy conflict in creator v2 (recommend: skill wins, license removed).

### Prompt/spec changes

- Creator: generated ledgers; bespoke TL;DR labels + bespoke-section requirement; type-challenge
  memo (case-for / case-against / named tiebreaker / one unexplained behavior / confidence);
  empathy-turn rebuilt from the person's own wound-vocabulary (ban the house grammar).
- Fresh-eyes: persona support + synthesis step + fan-expectation checklist (Part 6).
- Second-pass: source-audit-first ordering.
- grade_blog: closest-anchor Read + dimension diff; name all load-bearing quotes; new
  `content_quality` fields; monocausal cap; quote the interior line + turn sentence.
- Editor: lint-generated contrast count with a hard ≤ target exit condition.
- Publish command: composite gate (Part 5) + source-quality standard (Part 4).

### Deterministic scripts

- Contrast-pair/negative-parallelism counter in lint (replaces self-reported ledger).
- Load-bearing quote/source audit report (pre-grade).
- Same-type argument-similarity scan over last N drafts (one-of-one test #2).
- Citations-vs-inline reconciliation.
- Head-term meta_title lint + answer-block check + FAQ-flag check (Part 7).
- Per-run `summary.json` assembler + stage `timeout` with safe cleanup (design in
  `automation-report.md`; not a tonight change).
- Corpus phrase-frequency-by-type report feeding a dynamic banned-phrase table.

### Analytics / research projects

- Per-profile bridge funnel + grade-vs-conversion correlation (Part 8).
- Stage-delta audit of cohesion (merge decision).
- Queue refresh with demand signals + type diversification (F8; also the traffic lever).

### Human editorial policy decisions (DJ)

- Source-or-cut the published Tobey Maguire bank-robbery claim (legal exposure, do first).
- Adopt the composite publish gate + B+/A policy (Part 5).
- Sensitive-claim source classes (Part 4) as hard policy.
- Approve the production DB re-sync (148 FAQ-remediated rows + FAQ-schema flag).
- Type-9 queue diversification target.

---

## Part 10: What changed on disk today

```
scripts/blog-lint.sh          | 27 ++++++++++++++--------
scripts/nightly-blog-cron.sh  |  4 ++++
scripts/run-blog-pipeline.sh  | 22 +++++++++++++++---
```

All three pass `bash -n`; lint verified against Steve-Martin (0 fail / 0 warn) and a synthetic
rabbit-hole-in-comment repro; ledger presence checks unregressed. No commits made. Everything
else in this audit is recommendation, not applied change.
