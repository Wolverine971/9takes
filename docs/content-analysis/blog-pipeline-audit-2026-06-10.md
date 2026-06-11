<!-- docs/content-analysis/blog-pipeline-audit-2026-06-10.md -->

# Blog Pipeline Audit — 2026-06-10

Full audit of the personality-analysis blog pipeline: `scripts/run-blog-pipeline.sh`, its seven
stage commands, the external playbooks (`docs/blogs-famous-people/`), the grading rubric, the
daily cron path (`/daily-blog-creator`), the publish gate, and the actual draft corpus
(430 drafts in `src/blog/people/drafts/`).

**Verdict:** The writing system is genuinely sophisticated — the seven-stage separation,
enumerated hard gates, and the v2 rubric reweighting are best-practice moves. But:
(1) the core 9takes goal — emotions and motivation — is the one thing the system never
explicitly requires; (2) the daily cron bypasses 5 of the 7 stages; (3) several rules exist
on paper but are demonstrably unenforced in output, including a math bug in the grading
formula itself.

---

## Part 1: The psychoanalysis question

### What's working

The **lore-mining is the strongest part of the system.** Prep-prompt-1's signature-detail
hunt, the central-contradiction requirement, the childhood→adult thread, the public/private
gap, transcript gathering, and the testimony gate (≥2 named third-party quotes) reliably
produce real depth. Evidence: the John Ternus draft — the CNC machine nicknamed "Crash,"
the screw-groove story _with the observation that the story has no external payoff_, the
Penn swim "award for showing up," the failed VR startup foreshadowing Vision Pro skepticism.

### The gap: emotion and empathy are aspirational, not required

The empathy emphasis decays stage by stage through the governing documents:

| Document                           | Emotional layer                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| prep-prompt-1 (research)           | **Strong** — "what did love, approval, or safety feel like in their household?"                  |
| prep-prompt-2 (Enneagram analysis) | **Diluted** — motivation-centric; emotion survives as one buried line under "Evidence Standards" |
| writing-prompt-1 (prose)           | **Implicit** — emotional immersion is a prose technique, not a mandate                           |
| blog-grading-rubric v2             | **Absent** — no dimension scores whether the reader _feels_ the person's interior                |

A blog can score 9.1 while staying entirely behavioral. Ternus is the proof case: the piece
nails the _pattern_ ("trust built through verification") but never renders the Six's
underlying **fear** in felt terms. The Enneagram's actual engine — core fear, core desire,
the childhood message internalized — is required nowhere. "Core tension `[X] vs. [Y]`" is
required; the _feeling driving the tension_ is not.

**Fixes (implemented 2026-06-10, see Part 3):**

1. **Emotional thesis** (creator Step 2): name the core fear and core desire _as this person
   experiences them_, in their vocabulary, sourced from their quotes — not the textbook type
   description.
2. **Empathy turn** (creator + checklist): take the person's most criticized or mocked
   behavior and show the motivation that makes it make sense — without excusing it. Pairs
   with the existing critic-pressure anchor (Gate 6): critic pressure brings the judgment,
   the empathy turn resolves it via motivation. This is the brand promise ("see the emotions
   behind every take") turned into a structural requirement.
3. **Interior beat** (creator + checklist): one moment rendered from _inside_ the person's
   feeling (the `<p class="inner-thought">` furniture exists but was never required).
4. **Grader criteria** (rubric + grade_blog, inside Enneagram Integration): "Can the reader
   answer: what does this person fear, want, and feel? Does at least one criticized behavior
   become understandable?"

---

## Part 2: System integrity findings

### 2.1 The daily cron runs 2 of 7 stages — HIGH

`/daily-blog-creator` runs `create → grade` only. No fresh eyes, no second pass, no
cohesion, no editor pass, **no frontmatter enrichment**. Confirmed in output:
`Andrew-Garfield.md` (cron, 2026-06-09) has no `faqs`, no `wikidata_qid`, no `knows_about` —
yet was graded Discoverability 8, when the rubric says thin/missing FAQ is a 5-6. The most
automated path produces the least-finished blogs, and the grader forgives it.
**Fix:** wire the cron to the full pipeline (implemented — see Part 3).

### 2.2 Grading formula divides by 6.0; weights sum to 7.0 — HIGH

`grade_blog.md` (Step 3.5 and the Step 5 summary line) and
`docs/content-analysis/blog-grading-rubric.md:168` both said divide by **6.0**, but
1.5+1.5+1.5+1.0+1.0+0.5 = **7.0**. At /6.0 a straight-9s blog would score 10.5. In practice
recent grading runs quietly divided by 7 (Andrew Garfield's 8.7 only reproduces at /7);
one pipeline log (PinkPantheress, 2026-05-29) flagged the discrepancy.
**Fix:** `/ 7.0` in both files (implemented).

### 2.3 Publish gate runs on stale v1 grades — HIGH

Only **5 of 430** drafts carry rubric-v2 grades; 383 carry v1 grades — the same v1 the
rubric doc says "clustered 8.5–9.4 and lost all discriminating power" and was
discoverability-blind. The publish command checked `overall >= 8.5` only. Recent publishes
(e.g. noah-kahan "9/10", 2026-06-09) cleared the gate on v1 scores. Separately: the v2
discoverability gate caps the _letter_ at B, but publish read the _number_ — a disc-6 blog
with overall 8.6 would still publish.
**Fix:** publish gate now requires `rubric_version: 2` and `discoverability >= 7`
(implemented).

### 2.4 196 drafts carry templated FAQ garbage in live JSON-LD — HIGH (deferred)

The assembled-from-occupation-list filler pattern ("…with supporting context from
Entrepreneurship, Business Executive, Manager") appears in **196 drafts**. Same family of
problems: `knows_about: ['Business Executive', 'Manager']` (vagueness the enrich command
itself bans), `citations` that are copies of `same_as` including famousbirthdays.com. Some
bulk backfill bypassed `blog_content_frontmatter_enrich_people`'s rules, and this is emitted
as FAQPage schema on published pages — working against the AEO the rubric was reweighted
around.
**REMEDIATED 2026-06-11.** The enrich command now carries a "templated backfill FAQs"
exception to its faqs idempotency rule. All 196 drafts were re-processed (14 parallel
agents): templated `faqs` blocks replaced with 3-5 FAQs derived from each article body
(979 FAQs total; first FAQ always the type answer with wing + body-sourced evidence), and
occupation-copied `knows_about` values replaced with real expertise areas (genuinely good
values like Marie Curie's were left untouched). Verified corpus-wide: zero occurrences of
the filler string, all 196 frontmatters parse as valid YAML, all FAQs carry
question/answer/anchor, no `lastmod`/`content_quality`/body/comment changes anywhere.
**Remaining step: DB re-sync.** 148 of the 196 are published — live JSON-LD renders from
Supabase, so the fixed FAQs go live only after `node scripts/personBlogParser.js` re-syncs
those rows. Awaiting DJ's go (mass production-DB write).

### 2.5 The em-dash ban is unenforced — MEDIUM

Three stages (cohesion-check, second*pass, editor_pass) ban em-dashes; editor_pass lists
"Remove all em-dashes" as priority fix #1. Output: PinkPantheress (full 7-stage pipeline)
has 36, Andrew Garfield 71, John Ternus 76. The creator command — which writes 95% of the
words — never mentions the ban, so downstream passes face a saturated draft and don't
realistically comply. Either delete the ban (the graded-A drafts are full of em-dashes) or
put the rule in the creator command \_and* enforce mechanically.
**RESOLVED 2026-06-10: banned in prose, enforced mechanically.** The canonical AI Language
Ban (em-dashes + banned words/structures) now lives in creator v2 so the patterns aren't
generated in the first place; editor_pass must verify with `blog-lint.sh` instead of editing
by feel; `blog-lint.sh` now **fails** on prose em-dashes. Exemptions: quote-attribution lines
(`"…" — Person, source, year`) and HTML comments. Verified: Nicholas-Galitzine passes (its
32 file-wide em-dashes are all attributions/comments); John-Ternus fails with 38 genuine
prose em-dashes.

### 2.6 Deterministic rules need a lint script, not LLM willpower — MEDIUM

Mechanically checkable rules were enforced only by hoping seven separate fresh-context
models remember them. Corpus evidence they don't: rabbit hole present in only **50/430**
drafts (creator says it's required); Ternus has wing/subtype content in the TL;DR (banned),
no rabbit hole, `published: true` with `production_pretext.status: draft`.
**Fix:** `scripts/blog-lint.sh` (implemented) checks: ledger comments, rabbit hole presence,
banned phrases, description length, FAQ presence, self-loop links, required type-section
headings, em-dash count (warn). Added to the pipeline as a stage.

### 2.7 No feedback loop after grading — MEDIUM

The pipeline is linear: a 7.9 grade with the grader's actionable "TO REACH B+" feedback is
consumed by nobody.
**Fixed 2026-06-10:** new command `/blog_content_revision_pass_people` consumes the
grader's QUALITY GRADE comment + `blog-lint.sh` failures and applies targeted fixes
(rejections must be justified; lint FAILs cannot be rejected; never touches `lastmod` or
`content_quality`). The pipeline now runs stages 8/9 conditionally — revise → re-lint →
strip grade → re-grade — when `overall < 8.5`, `discoverability < 7`, or lint failed.
**At most one iteration**; a draft still below the bar after one loop goes to a human.
The final summary prints `GRADE: first → final`.

### 2.8 Doc drift between playbooks and the creator command — LOW

Creator v2 deliberately inlines the playbook rules, but the external docs drifted:
writing-prompt-1 still implied wings/subtypes could appear in the body, and — worse — held
up the `"A Six, doing what Sixes do"` ending as **gold standard**, the exact cadence Gate 4
bans.
**Fixed 2026-06-10:** source-of-truth headers on all three playbooks ("where this document
and the command disagree, the command wins," with the known deltas named); anti-imitation
warning attached to the gold-standard-endings excerpt; Rabbit Hole placement notes in
prep-prompt-2 (wing/stress/counter-typing output = Rabbit Hole material); emotional-thesis
section added to prep-prompt-2 (core fear/desire/childhood message in the person's own
vocabulary, feeding creator Step 2 #4); AI-ban lists in second_pass, cohesion-check, and
writing-prompt-1 now point at the canonical list in creator v2 (lint enforces the
mechanical parts).

### 2.9 Smaller findings

- Pipeline script's final grade-summary grep misses `discoverability` and `rubric_version`
  (fixed alongside the lint work).
- Fresh-eyes block format drift: older drafts carry `FRESH-EYES ASSESSMENT` blocks that
  `second_pass` (which greps for `FRESH EYES REVIEW` exactly) silently ignores.
- `John-Ternus.md` frontmatter: `person: 'john-ternus'` (spec says `First-Last`),
  `content_quality` has no `discoverability`/`rubric_version` (stale v1 grade dated
  2026-04-21 on a 2026-06-05 file).
- Persona-vocabulary table means every Type 6 trends toward "vigilant/sentinel" language —
  at 430 drafts, consider a corpus-level repetition check someday.

---

## Part 3: Action plan and status

| #   | Action                                                                                                    | Status                                                                     |
| --- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | Fix grading formula (/6.0 → /7.0) in `grade_blog.md` + rubric                                             | ✅ Done 2026-06-10                                                         |
| 2   | Add emotional thesis + empathy turn + interior beat to creator v2; grader criteria to rubric + grade_blog | ✅ Done 2026-06-10                                                         |
| 3   | Wire daily cron to the full 7-stage pipeline                                                              | ✅ Done 2026-06-10                                                         |
| 4   | Tighten publish gate (`rubric_version: 2` + `discoverability >= 7`)                                       | ✅ Done 2026-06-10                                                         |
| 5   | Build `scripts/blog-lint.sh` + add as pipeline stage                                                      | ✅ Done 2026-06-10                                                         |
| 6   | Remediate 196 templated-FAQ drafts                                                                        | ✅ Files done 2026-06-11 — DB re-sync of 148 published rows awaits DJ's go |
| 7   | Conditional revise-and-regrade loop (stages 8/9 + `/blog_content_revision_pass_people`)                   | ✅ Done 2026-06-10                                                         |
| 8   | De-dupe playbooks vs. creator command; unify AI-ban lists                                                 | ✅ Done 2026-06-10                                                         |
| 9   | Resolve em-dash policy → **banned in prose**, lint fails, attribution lines exempt                        | ✅ Done 2026-06-10                                                         |

---

## Appendix: Evidence quick-reference

- Rabbit hole present: 50/430 drafts
- Rubric-v2 grades: 5/430 (Andrew-Garfield 8.7, greta-gerwig 8.5, Nicholas-Galitzine 8.7,
  PinkPantheress 8.8, victoria-justice 9.0)
- Graded at all: 383/430
- Templated FAQ filler ("with supporting context from"): 196 drafts
- Em-dashes in recent full-pipeline outputs: PinkPantheress 36, Nicholas-Galitzine 32
- Daily cron: max 5 blogs/week (`docs/blog-automation/override.json`), runs ~2:00 AM,
  logs to `logs/blog-automation/cron-YYYY-MM-DD.log`
- Recent cron runs: 2026-06-09 andrew-garfield SUCCESS 8.7; 2026-06-08 carina-zavline
  BLOCKED (thin_collaborator_testimony — gate working as designed); 2026-06-06 ayo-edebiri
  FAILED (socket closed)
- Publish logs confirm the 8.5 gate is checked (noah-kahan, ana-de-armas, alex-lieberman)
  but against v1 grades
