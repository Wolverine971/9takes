<!-- docs/content-analysis/blog-pipeline-research-handoff-2026-07-04.md -->
# Blog Pipeline Research Handoff - 2026-07-04

This is a research and audit brief for improving the 9takes personality-analysis blog pipeline. The goal is not "make the pipeline pass more rules." The goal is to make the pipeline reliably produce one-of-one, deeply sourced, on-brand personality profiles that do not read like AI-assisted house-template content.

The current implementation is sophisticated. It has a full staged pipeline, hard gates, frontmatter enrichment, linting, grading, and a revision loop. The remaining risk is subtler: the system can now produce technically compliant B/B+ drafts that still share too much furniture, overuse the same contrast engine, under-source load-bearing quotes, and optimize for publishability rather than unmistakable editorial excellence.

## Executive Summary

Highest-value research questions:

1. Are recent outputs actually "one-of-one," or are they becoming formula-compliant versions of the same profile?
2. Is the research phase producing enough primary-source evidence, or are later stages laundering thin or vaguely attributed material into confident prose?
3. Do the hard gates and ledgers detect real quality, or do they create self-reported artifacts that drift from the body?
4. Does the grader reliably penalize formula fingerprint, source gaps, and weak discoverability, or does the 8.5 threshold encourage small tactical edits instead of real elevation?
5. Does the pipeline create blogs that pull readers into 9takes, or only well-crafted standalone essays?
6. Is the automation trustworthy enough to run unattended, given current sentinel and stage-exit handling bugs?

Recent logs suggest the pipeline is working as an editorial assembly line, but not yet as an originality engine. Steve Martin, Jeff Goldblum, Tobey Maguire, Zac Efron, and Rose Blackpink all show strong craft plus repeated issues: visible house furniture, contrast-pair fingerprints, missing inline attribution on load-bearing quotes, and revision passes that sometimes lift a draft only to a marginal B/B+.

## Source Files To Read First

Read these before making recommendations:

- `scripts/run-blog-pipeline.sh` - full stage wrapper and revision loop
- `scripts/nightly-blog-cron.sh` - deterministic nightly orchestrator
- `scripts/blog-lint.sh` - mechanical quality checks
- `.claude/commands/blog_content_creator_people_v2.md` - primary creation command
- `.claude/commands/blog_content_fresh_eyes_people.md` - first reader-response pass
- `.claude/commands/blog_content_second_pass_people.md` - substantive revision pass
- `.claude/commands/cohesion-check.md` - through-line and transition pass
- `.claude/commands/blog_content_editor_pass_people.md` - de-AI and polish pass
- `.claude/commands/blog_content_frontmatter_enrich_people.md` - SEO/schema enrichment
- `.claude/commands/grade_blog.md` - scoring and reviewer feedback
- `.claude/commands/blog_content_revision_pass_people.md` - conditional grade-feedback revision
- `.claude/skills/9takes-editorial-standards/SKILL.md` - voice and AI-tell rulebook
- `docs/blogs-famous-people/prep-prompt-1.md` - research framework
- `docs/blogs-famous-people/prep-prompt-2.md` - Enneagram analysis framework
- `docs/content-analysis/blog-grading-rubric.md` - rubric v2
- `docs/content-analysis/blog-pipeline-audit-2026-06-10.md` - last major audit
- `docs/content-analysis/blog-flow-audit-2026-05-17.md` - prior flow audit and improvement ideas
- Recent pipeline logs under `docs/content-analysis/pipeline-logs/`, especially:
  - `2026-07-04_020000_steve-martin`
  - `2026-07-03_021118_jeff-goldblum`
  - `2026-07-03_110352_tobey-maguire`
  - `2026-07-02_114347_Zac-Efron`
  - `2026-07-02_145417_Rose-Blackpink`
  - `2026-07-01_133636_Mira-Murati`

## Current Flow

`scripts/run-blog-pipeline.sh <Person-Name>` runs:

| Stage | Command                                   | Purpose                                                                                |
| ----- | ----------------------------------------- | -------------------------------------------------------------------------------------- |
| 1     | `/blog_content_creator_people_v2`         | Research, Enneagram analysis, draft, internal links, body structure, hard-gate ledgers |
| 2     | `/blog_content_fresh_eyes_people`         | Reader-response comments only                                                          |
| 3     | `/blog_content_second_pass_people`        | Targeted revision from fresh-eyes feedback                                             |
| 4     | `/cohesion-check`                         | Narrative through-line and transitions                                                 |
| 5     | `/blog_content_editor_pass_people`        | Human rhythm, de-AI, repetition, contrast-pair cleanup                                 |
| 6     | `/blog_content_frontmatter_enrich_people` | Entity metadata, citations list, keywords, FAQ schema                                  |
| 6.5   | `scripts/blog-lint.sh`                    | Deterministic lint                                                                     |
| 7     | `/grade_blog`                             | Rubric v2 grade and reviewer comment                                                   |
| 8     | `/blog_content_revision_pass_people`      | Conditional targeted revision if grade/lint fails                                      |
| 8.5   | `scripts/blog-lint.sh`                    | Re-lint after revision                                                                 |
| 9     | `/grade_blog`                             | Regrade after stripping prior grade                                                    |

The nightly path is `scripts/nightly-blog-cron.sh`, which selects a person from `docs/blog-automation/backlog-queue.json`, runs the same pipeline, captures grade/discoverability, updates queue state, and notifies Telegram.

## What Is Already Strong

- The pipeline has real separation of concerns. Creator, fresh eyes, second pass, cohesion, editor, frontmatter, grader, and revision are separate contexts.
- The research and analysis prompts explicitly hunt for central contradiction, signature details, direct quotes, third-party testimony, public/private gap, crisis response, childhood thread, emotional thesis, and counter-typing.
- The rubric weights Evidence, Originality, and Discoverability highest, which is directionally correct for non-slop content.
- The Rabbit Hole rule keeps advanced typology out of the main body while still serving power readers and long-tail queries.
- `scripts/blog-lint.sh` catches mechanical drift that LLM stages used to miss: missing rabbit hole, visible FAQ body sections, self-links, em-dashes, missing ledgers, missing required headings, bad frontmatter lengths, and templated FAQ filler.
- Recent grader logs are much stricter than older v1 scoring. They call out formula fingerprint, source tags, sameness, and discoverability misses.

## Current Risk Pattern From Recent Runs

Recent runs show strong but clustered output:

| Draft          | Result                                    | Main Issues                                                                                                                                                         |
| -------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Steve Martin   | 8.0 -> 8.5 after revision                 | Contrast-pair engine persisted 5+ times after editor and revision; formula ledger undercounted; title/meta missed the head term "enneagram/personality type/type 5" |
| Jeff Goldblum  | 8.4 after revision                        | Most load-bearing opening/threading quote still lacked inline source tag; visible shared furniture; Evidence held at 8                                              |
| Tobey Maguire  | 8.3 -> 8.2 after revision                 | Contrast-pair fingerprint cap; thesis restated multiple times; minor sourcing gaps; still a B after revision                                                        |
| Zac Efron      | 7.9 initially                             | Originality capped by near-verbatim house moves: TL;DR skeleton, epigraph-to-cold-open furniture, reader-command tic                                                |
| Rose Blackpink | 7.9 initially, 8.4 after recovery regrade | Initial sameness cap; lint false positive from `enneagram-rabbit-hole` appearing in a grade comment; remaining attribution/furniture issues                         |
| Mira Murati    | 8.8                                       | Best recent counterexample: high evidence and strong person-first analysis; remaining issue was mostly meta title search phrasing                                   |

This suggests the pipeline can produce good-to-very-good work, but the modal output is still "strong pipeline draft," not "unmistakable top-of-corpus profile."

## Priority Audit Lanes

### 1. One-Of-One Originality And Formula Fingerprint

Core question: Are outputs structurally unique because the person demands it, or are they variations on the pipeline's preferred profile skeleton?

What to inspect:

- Compare the last 10 full-pipeline drafts side by side.
- Track repeated structures: epigraph -> firstLetter cold open -> reframe, TL;DR accordion labels, empathy-turn shape, current/legacy anchor, two-column contrast panel, return-to-opening close.
- Search for repeated tics: `The tell:`, `Sit with`, `Read that`, `Add it up`, `not X, it was Y`, `looked like X, was really Y`, `the machinery`, `the wound`, `the mask`, `the body`, `scar tissue`.
- Compare Type 4 drafts against each other, Type 7 drafts against each other, and Type 9 drafts against each other. Same-type clustering is where formula will be most visible.

Questions to answer:

- Which recurring moves are legitimate brand voice, and which are becoming template artifacts?
- Is the "Formula Fingerprint Ledger" accurate, or does it undercount after later edits?
- Should formula detection be deterministic rather than self-reported by the creator/revision pass?
- Does the one-pass revision loop remove near-verbatim sameness, or only enough to escape the cap?
- What would a "one-of-one" proof look like? For example: "If the person's name were removed, five subject-specific details still make the draft identifiable."

Possible interventions to evaluate:

- Add a deterministic cross-draft fingerprint scan before grading.
- Add a "recent-output diff" stage that compares against the last 3-5 graded drafts.
- Require each draft to use one bespoke section form that arises from the person's world, not the house template.
- Change the Formula Fingerprint Ledger from self-report to generated counts from the final body.

### 2. Evidence Quality, Source Traceability, And Research Depth

Core question: Does the pipeline actually ground the best claims in checkable primary or high-authority sources?

What to inspect:

- For each recent draft, identify the 5 load-bearing claims and trace them to inline source tags.
- Compare `citations` frontmatter against body links and quote attributions.
- Check whether subject quotes come from raw transcripts/primary interviews or from research-brief paraphrase.
- Audit testimony quality, not just count. Gate 1 requires at least 2 named third-party quotes, but 2 weak quotes can pass.

Questions to answer:

- Are the best quotes source-tagged with outlet/title/date close enough for a skeptical reader or AI answer engine to verify?
- Does frontmatter `citations` create a false sense of sourcing when the body itself lacks inline attribution?
- Should load-bearing quotes require a URL, outlet, and year in the prose?
- How often does the creator use synthesized research notes instead of primary-source pulls?
- Are legally sensitive claims handled with enough sourcing, hedging, and production blocking?
- Should the research phase output a durable evidence packet file that later stages must preserve, instead of relying on the draft body as the only state?

Possible interventions to evaluate:

- Add a "source audit" lint/report: list top claims, current attribution, URL presence, source type, and risk level.
- Require at least 3-5 inline-dated source tags for A/B+ eligibility.
- Add a hard blocker for untagged cold-open or thesis-spine quotes.
- Store research packets under `docs/content-analysis/research/<person>.md` so later stages can verify instead of infer.

### 3. Enneagram Rigor Without Forced Typing

Core question: Is the type analysis illuminating the person, or is the pipeline forcing a preselected type into a plausible narrative?

What to inspect:

- Queue entries include a preassigned `type`. Audit whether the creator ever challenges that type.
- Read Rabbit Hole sections for serious counterarguments vs. perfunctory "why not Type X" handling.
- Compare drafts where the type is surprising but convincing (Mira Murati, Zac Efron) against drafts where a single wound explains too much.
- Look for typology explanations in the body that should be quarantined.

Questions to answer:

- Should every draft have an explicit confidence level for the type call?
- Should there be a pre-draft "type challenge" step before writing?
- Does the pipeline overuse childhood wound as the universal explanatory engine?
- Are wings/subtypes/arrows helping the analysis, or just filling the Rabbit Hole requirement?
- What evidence would be sufficient to change the assigned type before drafting?

Possible interventions to evaluate:

- Add a pre-write "typing challenge memo" with strongest case for the assigned type and strongest case against it.
- Require one "behavior this type does not explain well" in the research/analysis notes.
- Add a rubric cap for monocausal typing that routes every major behavior to one childhood wound.

### 4. Emotional Interior And 9takes Brand Promise

Core question: Does the reader feel what the person fears, wants, and protects, or only understand the pattern intellectually?

What to inspect:

- For recent drafts, mark the empathy turn, interior beat, and emotional thesis.
- Judge whether those moments feel person-specific or inserted to satisfy the gate.
- Compare behavioral analysis sections against lines where the reader can inhabit the person's inner pressure.

Questions to answer:

- Are empathy turns revealing, or are they becoming a formulaic "the mocked behavior was scar tissue" move?
- Does each draft make one criticized behavior understandable without excusing it?
- Is the interior beat grounded in the person's own vocabulary and sources?
- Does the emotional thesis survive editor and revision passes, or get polished into abstraction?

Possible interventions to evaluate:

- Add a "felt interior" reviewer persona in fresh-eyes.
- Make the grader cite the exact line/paragraph that proves emotional interior.
- Penalize empathy turns that use generic therapeutic language rather than subject-specific evidence.

### 5. Review Process Quality

Core question: Is one generic fresh-eyes pass enough to catch what actual readers, fans, skeptics, and search visitors will notice?

What to inspect:

- Fresh-eyes logs from recent drafts. They often catch obvious missing material: Vanessa Hudgens in Zac Efron, The Fly in Jeff Goldblum.
- Whether second-pass addresses the highest-value notes or overfits to all comments.
- Whether editor/revision stages claim to fix issues that remain in the final grade.

Questions to answer:

- Should fresh-eyes rotate personas by subject: superfan, skeptic, type-curious newcomer, SEO/search visitor, 9takes community member?
- Which persona catches the most expensive misses?
- Does fresh-eyes need access to target audience/search context before reading?
- Should second-pass run before or after a lightweight source audit?
- Should grader feedback that remains unresolved after revision create a second loop or mandatory human review?

Possible interventions to evaluate:

- Add `--persona` support to fresh-eyes and run 2 reviewers for high-priority subjects.
- Add a synthesis step that prioritizes reviewer comments by impact.
- Require a "fan expectation checklist" before drafting for public figures with known defining relationships, roles, controversies, or fandom lore.

### 6. Grading Calibration And Incentives

Core question: Does the 8.5 threshold encourage genuinely excellent work, or tactical edits that lift one weighted dimension just enough?

What to inspect:

- Regrade logs where the revision loop lifts from B/C to B+. Did the piece become meaningfully better, or just source-tag enough quotes?
- Cases where the revision pass rejected grader feedback.
- Whether `/grade_blog` reads actual calibration anchor texts or relies on remembered anchors.
- Score distribution over the last 20 pipeline runs.

Questions to answer:

- Is B+ the right publish threshold, or should it be "publish with human review" while A/A+ is the actual brand bar?
- Should one-of-one originality require a higher threshold than 8.5?
- Does the grader apply formula caps consistently across drafts?
- Should the grader have to produce evidence for every 9 it awards?
- Should any draft that still has capped Writing or Originality after revision remain `needsReview: true` even if overall reaches 8.5?

Possible interventions to evaluate:

- Add a "closest anchor diff" inside `/grade_blog`, reading actual anchor drafts.
- Add score confidence and cap rationale fields to `content_quality`.
- Track "cleared by tactical source fix" vs. "cleared by substantive editorial lift."

### 7. Discoverability, AEO, And Search Intent

Core question: Are these profiles findable and quotable by search visitors and AI answer engines without becoming keyword-stuffed?

What to inspect:

- `title`, `meta_title`, `description`, `faqs`, `same_as`, `citations`, and early type answer in recent drafts.
- Cases where logs say discoverability is strong but title/meta miss the head term.
- Whether FAQ anchors match real body headings.
- Whether subject selection is driven by current demand or an old static queue.

Questions to answer:

- Should `title` or `meta_title` always include `[Person] Enneagram` or `[Person] personality type` unless there is a deliberate exception?
- Are FAQs real search questions or just schema filler derived from the body?
- Which head terms matter by subject: "enneagram," "personality type," "MBTI," "type," "zodiac," "why is X like that"?
- Does the early answer work as an extractable block for AI citations?
- Is the queue priority using current trend/search/news/social signals or stale assumptions?

Possible interventions to evaluate:

- Add a SERP/query research pre-step for each person.
- Add a deterministic title/meta check that flags missing head terms.
- Add a "citation-ready answer block" check for the first type-answer section.
- Refresh queue priority weekly with trend pull, not just static priority.

### 8. Reader-To-Platform Bridge

Core question: Does a great celebrity profile create curiosity about the reader's own type and pull them into 9takes?

This was raised in `docs/content-analysis/blog-flow-audit-2026-05-17.md` and is still mostly not represented in the pipeline.

What to inspect:

- On-page CTAs in `/personality-analysis/[slug]`.
- Blog analytics: clicks to type pages, Enneagram test, questions, comments, email signup, related profiles.
- Whether drafts include self-reflection moments without becoming cheesy or breaking the cut-to-black ending.
- Whether there is a corresponding 9takes question generated from each profile.

Questions to answer:

- What is the desired reader action after a personality profile?
- Should the rubric include "Self-reflection hook" or "9takes bridge"?
- Can the blog create self-recognition inside the body without adding a generic CTA ending?
- Should each published blog seed one related 9takes question?
- Which profile sections correlate with clickthrough or scroll depth?

Possible interventions to evaluate:

- Add a non-visible or subtle related question seed to production workflow.
- Add rubric criteria for "reader sees themselves in the pattern."
- Add post-publish audit: grade vs. traffic vs. conversion vs. engagement.

### 9. Automation Integrity And Failure Semantics

Core question: Can the unattended pipeline be trusted to tell the truth about success, failure, and review need?

Known issue found during this handoff:

- `scripts/run-blog-pipeline.sh` initializes `PIPELINE_COMPLETED=0` but never sets it to `1` before exit. Recent successful runs therefore leave `FAILED_AT_STAGE` files like `stage=9_regrade exit=0`. The nightly cron then marks `needsReview=true` even when the grade is B+ and the pipeline exited 0.

Other issues to audit:

- `run_stage` captures each `claude -p` exit code but always returns 0, and there is no structured stage-exit summary.
- A stage can fail and the pipeline will continue. That is intentional, but the final grade may mask missing work unless each stage failure is surfaced clearly.
- `blog-lint.sh` counted `enneagram-rabbit-hole` inside a grader comment as a second block in Rose Blackpink. That indicates lint should strip HTML comments for some structural checks.

Questions to answer:

- What should count as pipeline success: draft created, lint clean, grade written, no stage errors, no failed sentinel, publish threshold met?
- Should stage failures block grading or only mark `needsReview`?
- Should `FAILED_AT_STAGE` be renamed to true failure only, with a separate `STAGE_WARNINGS` file?
- Should the nightly queue set `needsReview=true` for any B/B+ with residual capped Writing/Originality?
- Does the watchdog alert on false failure sentinels today?

Possible interventions to evaluate:

- Set `PIPELINE_COMPLETED=1` at the end of `run-blog-pipeline.sh`.
- Record a machine-readable `summary.json` per run with stage exits, lint result, first grade, final grade, revision reasons, final blockers, and review flags.
- Make lint strip comments for rabbit-hole counting.
- Consider returning non-zero when no draft or no final grade exists, while preserving run-all-then-report for recoverable stage errors.

### 10. Corpus-Level Repetition And Type Vocabulary Drift

Core question: Across hundreds of profiles, is the brand building a distinctive library or a set of type-colored Mad Libs?

What to inspect:

- Repeated persona-title vocabulary by type: Type 6 as vigilant/sentinel, Type 4 as wounded/individualist, Type 7 as appetite/escape, Type 3 as performance/mask.
- Repeated section and TL;DR labels by type.
- Similarity between final paragraphs across same-type profiles.
- Same archetype names, same "core wound" language, same "mask" language.

Questions to answer:

- Which phrases are overrepresented by type?
- Which profiles are most swappable?
- Are same-type profiles differentiated by person-specific vocabulary, domain metaphors, and real scenes?
- Should the creator command get a "type vocabulary avoidance" table based on corpus counts?

Possible interventions to evaluate:

- Build a corpus phrase-frequency report by Enneagram type.
- Add a banned-overused-phrase list that is dynamic, not static.
- Require each profile to define a subject-specific vocabulary set before drafting.

### 11. Legal, Ethical, And Reputation Risk

Core question: Are speculative personality claims about living people responsibly sourced and framed?

What to inspect:

- Disclaimers in recent drafts.
- Claims about trauma, addiction, sexuality, lawsuits, abuse, health, politics, and crime.
- Whether "may not reflect actual personality type" is present but not used as cover for weak sourcing.
- Whether the pipeline blocks high-risk claims without primary sourcing.

Questions to answer:

- Which claim categories should require primary or top-tier sources?
- Should living-person sensitive claims have a separate lint/review lane?
- Does the current `production_pretext.status: blocked` mechanism trigger reliably for defamation-risk gaps?
- Are direct quotes altered or over-contextualized in a way that changes meaning?

Possible interventions to evaluate:

- Add a high-risk-claim ledger.
- Add mandatory source class tags for sensitive claims.
- Require human review for public accusations, medical/mental-health speculation, and contested allegations.

## Specific Tests The Research Agent Should Run

1. Stage-delta audit:
   - Pick 5 recent pipeline runs.
   - Diff draft after create, second pass, cohesion, editor, revision if possible from git/log artifacts.
   - Identify which stages create actual quality lift vs. cosmetic compliance.

2. Source traceability audit:
   - For 10 drafts, list the 5 load-bearing claims.
   - Mark each as inline sourced, frontmatter-only sourced, vaguely attributed, unsourced, or risky.
   - Compare against Evidence score.

3. Formula fingerprint audit:
   - For 20 recent drafts, count repeated contrast engines, reader-command tics, TL;DR label reuse, epigraph/cold-open pattern, two-column panels, and ending structures.
   - Compare against Originality/Writing scores.

4. Grader consistency audit:
   - Regrade 3 drafts in separate fresh contexts.
   - Check score variance and cap consistency.
   - Force the grader to read one calibration anchor text, then compare variance.

5. Fan expectation audit:
   - For 5 high-recognition subjects, ask: "What would a real fan be surprised is missing?"
   - Compare with fresh-eyes comments.

6. Search intent audit:
   - For 10 drafts, map title/meta/FAQ/headings to likely queries.
   - Check whether the early answer is extractable.

7. Funnel audit:
   - For published profiles, compare content grade against traffic, scroll, clicks to related pages, signups, comments, and email capture.
   - Identify whether the best editorial pieces are also helping the product.

8. Automation audit:
   - Verify false `FAILED_AT_STAGE` sentinels.
   - Audit stage exit handling.
   - Propose a per-run structured summary artifact.

## Deliverables Expected From The Research Agent

The research agent should produce:

1. A ranked findings report with evidence from files/logs/drafts.
2. A "keep / change / remove" recommendation for each pipeline stage.
3. A proposed definition of "one-of-one" that can be tested.
4. A minimum viable set of new deterministic checks, if any.
5. A revised grading proposal if the current rubric incentivizes threshold-chasing.
6. A source-quality standard for B+, A, and A+ profiles.
7. A review-persona plan for fresh-eyes and second-pass.
8. A post-publish measurement plan tying editorial quality to 9takes growth.
9. A short implementation backlog split into:
   - quick fixes
   - prompt/spec changes
   - deterministic scripts
   - analytics/research projects
   - human editorial policy decisions

## Recommended Research-Agent Prompt

Use this as the handoff prompt:

```text
Audit the 9takes personality-analysis blog pipeline for editorial excellence, not just rule compliance.

The goal is to make `scripts/run-blog-pipeline.sh` produce one-of-one, deeply sourced, on-brand personality profiles that do not read like AI slop or a reusable template.

Read `docs/content-analysis/blog-pipeline-research-handoff-2026-07-04.md` first, then inspect the listed commands, rubric, prior audits, recent pipeline logs, and recent generated drafts.

Focus on:
- originality and formula fingerprint
- source traceability and research depth
- Enneagram rigor without forced typing
- emotional interior and 9takes brand voice
- freshness of review personas
- grading calibration and incentive problems
- discoverability/AEO
- reader-to-platform bridge
- automation reliability

Do not rewrite prompts immediately. Produce a ranked audit with concrete evidence, the right research questions, recommended experiments, and an implementation backlog. Separate quick bug fixes from deeper editorial-system changes.
```

## Quick Fixes Already Worth Considering

These are not substitutes for the larger research audit, but they are concrete issues surfaced while preparing this handoff:

1. In `scripts/run-blog-pipeline.sh`, set `PIPELINE_COMPLETED=1` before the final exit so successful runs stop writing false `FAILED_AT_STAGE` sentinels.
2. Make `run_stage` record stage exit codes in a per-run summary, even if the wrapper continues.
3. Update `blog-lint.sh` rabbit-hole counting to ignore HTML comments.
4. Add a deterministic contrast-pair count to `blog-lint.sh` or a separate quality report, because recent ledgers undercounted final-body occurrences.
5. Add a source-tag report for load-bearing quotes before grading.
6. Add a recent-draft similarity check before grading or inside `/grade_blog`.
7. Require title/meta to explicitly justify missing head terms like "enneagram" or "personality type."
8. Add a human-review flag for B+ drafts that still have capped Writing or Originality due to formula fingerprint.

## Bottom Line

The pipeline has moved past basic prompt engineering. The next level is editorial instrumentation: prove the draft is source-traceable, structurally non-swapable, emotionally specific, search-answerable, and connected to the 9takes product loop. The biggest remaining risk is that the system gets very good at manufacturing B+ compliance while the brand wants A-level originality.
