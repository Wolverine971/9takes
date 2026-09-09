# ADÉLA refresh: writing and verification handoff

**The requested refresh pipeline and its single revision are complete. The draft is not production-ready: two independent grades of the same final text were 7.6 and 8.5, a 0.9 delta against the permitted 0.3. Human editorial review and grade adjudication remain required. No database write was performed.**

## Draft and evidence

- [Canonical draft](../../../../src/blog/people/drafts/Adela.md)
- [Durable research and source register](../../research/Adela.md)
- [Independent current research](../../research/Adela-2026-09-09-independent.md)
- [Independent legacy audit](../../research/Adela-2026-09-09-legacy-audit.md)
- [Independent source checks of editor and revision additions](../../research/Adela-2026-09-09-editor-source-audit.md)
- [Entity and search-intent brief](../../entity-gaps/Adela.md)
- [Six-reviewer synthesis](../../perspective-reviews/Adela/2026-09-09_121156/synthesis.md)
- [Final independent verification](../../perspective-reviews/Adela/2026-09-09_121156/verification-final.md)
- [Latest perspective manifest](../../perspective-reviews/Adela/latest.json)
- [Final grade feedback](../../grades/Adela.review.md)

The subject is Adéla Jergová / ADÉLA, not Adele. The indexed `/personality-analysis/adela` URL and identity are preserved.

## Actual execution and grade record

The unchanged `scripts/run-blog-pipeline.sh` ran in refresh mode with a process-local model override:

```sh
ANTHROPIC_MODEL=sonnet ./scripts/run-blog-pipeline.sh Adela --refresh
```

The isolated availability check identified the model as Claude Sonnet 5. Earlier actual attempts at 11:30 and 12:10 failed on the default model's session limit and then exhausted usage credits. Those failures are retained in sibling log directories. No credits were purchased or reset, no saved model settings changed, and no shared pipeline or queue file was edited.

The final run completed September 9, 2026 at 13:41 ET. It included the entity brief, actual refresh, fresh-eyes and cohesion passes, one frozen snapshot and shared evidence packet, six separate reviewers, synthesis, editor resolution, frontmatter enrichment, independent verification, deterministic reports, grading, one targeted revision, independent re-verification, two final grades, stability recording, and final perspective binding.

| Grade stage | Evidence | Originality | Discoverability | Enneagram | Writing | Hook | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| First fresh grade, before revision | 8 | 7 | 9 | 7.5 | 7.5 | 7 | 7.8 |
| First grade of final revised text | 7.5 | 7.5 | 8 | 7.5 | 7.5 | 7 | 7.6 |
| Independent grade of identical final text | 8.5 | 8.5 | 9 | 8 | 8.5 | 7.5 | 8.5 |

The weighted arithmetic was independently recomputed and matches all three totals. The historical 8.8 was removed before fresh grading and was not reused. The final pair's reader-sensitive hashes match each other and the verifier:

`d377748e06f23c45baa8259ec21e9234e8fd291708ebbc00bd40d4188c93e948`

The stability comparison is **7.6 versus 8.5**, not 7.8 versus 8.5. The two final graders disagree substantially about evidence, writing, originality, and discoverability. Their preserved reports are [first final grade](observed-grade-13.review.md) and [second final grade](observed-grade-16.review.md). The current frontmatter records `first_overall: 7.6`, `regrade_overall: 8.5`, `grade_stability_delta: 0.9`. The grader-authored `needs_review: false` does not override the failed stability gate or human-review flags.

`summary.json` says `completed: true`, which describes process completion only. Its `has_stage_warnings: true` retains the initial same-type trip. The final scan clears, but the independently run [publish check](final-publish-check.txt) still blocks on `grade_unstable:0.9_delta`. No further grading was run to seek a passing pair.

## Word budget and editorial result

- Original article: **2,483 prose words**.
- Prepared input to the final pipeline invocation: **2,321**.
- First-graded version: **2,318**.
- Final revised article: **2,374**, a reduction of **109** from the original and below the 4,500 ceiling.

The script truthfully reports 2,321 → 2,374 (+53) for its own invocation. The complete refresh remains 109 words below the original baseline; no ceiling override was used. SEO audit's larger raw word count includes material excluded by the prose lint counter and is not the refresh budget measure.

The final thesis distinguishes her wish for a supplied schedule from her wish to own the creative direction. The Google Doc, English/feet/timetable inventory, handmade gloves, Manon accountability, contrasting PRIMA reviews, and family/poster ending remain. Type 3 stays the lead hypothesis, with serious Type 4 counterevidence and no firm wing, subtype, or connecting-line diagnosis.

**Admitted:** T1 collaboration and audience-pressure evidence; her defense of personal taste before approval; corrected self-expression testimony; family participation and distance; opposing critical judgments; source corrections that change the personality reading. T2 release, EP date, and historically attributed tour plans are concise context.

**Cut:** repeated rank/scoreboard explanations; the invented apartment scene; categorical private-shame, family-role, and subtype claims; unsupported speculation that solo applause could not feel personal; an unsourced Missy Paramo attribution. Later audits removed invented viewer-footage chronology, ballet sensations/instructions, control over attention, and necessary psychological rejection. These corrections are disclosed in the operative resolution logs and independent source audit.

**Rejected:** T3 promotional superlatives, chart speculation, full itineraries, track-by-track reporting, unrelated allegations, literal family or medical claims inferred from lyrics, and an assertion that the Detroit show had already occurred.

## Review and deterministic checks

- All six reviewers are bound to frozen full-file SHA `e5826421633c8cd5b7eb46818d6f2ce8fdc6bc844e4046bea3da8a7d3e764af8`.
- Final independent verification: **pass**, **0 open P0**, **0 protected-hit regressions**; all nine protected insights survive.
- P1 disposition: nine completed; P1-03 explicitly rejected with a source-based reason because the attempted audience-specific account invented chronology.
- Lint: **0 failures**, one preserved warning for `published: true` alongside local `production_pretext.status: draft`.
- Quality report: **pass**, zero contrast-pair engines, 39-word extractable type answer, no corpus-count drift.
- Source audit: **3 inline load-bearing quotes, 0 vague, 0 untagged**. Independent factual checks also reviewed the newly added material outside those automated slots.
- Same-type scan: final **clear**; the initial generic “public record” trip is fixed.
- [SEO audit](final-seo-audit.json): **0 issues**, four FAQs, four internal links. FAQ anchors were checked against the actual renderer's accent-stripping behavior.
- Final reader hash and perspective manifest: **valid/current** after comment-only handoff updates.
- Existing full and thumbnail image files are present.
- YAML parses; `git diff --check` passes. Changes are confined to the Adela draft, research, grade, intent, review, and execution artifacts.

Two interventions paused only this task's scheduler, let the active CLI writer exit, archived its original output, and applied independently reviewed source repairs before resuming the unchanged script. No other task or lock was killed or removed. See [recovery chronology](../2026-09-09_113022_Adela/preflight-and-recovery.md). Raw CLI editor/revision drafts and resolutions remain in the final review directory; operative root amendments are clearly labeled.

## Exact dry-run handoff

The final [single-person dry run](final-dry-run.txt) exited 0 and performed no write. The live row is still **1122**, published, with unchanged content:

```text
--expected-content-hash=5c7476c1c3b84f293cb396cdcc3614f7
--approve-fields=description,content,content_quality,faqs,citations
```

Local parsed content MD5: `ff0168bc542e975f77d4a3db86581e3e`.

These are review tokens for the current preview, not authorization to execute an update. Any subsequent content or live-row change requires a fresh dry run. Protected fields show no drift. `date` and `lastmod` remain `2026-08-14`; `published: true`; categories remain the live musician/dancer values. Local human-review state remains `status: draft`, `reviewed: false`, `ready_for_production: false`.

The publish check also reports `already_published`, expected for this existing page. After human review and resolution of the unstable grade, use the existing-row update workflow; never `--publish` on this live article. No database sync, listing regeneration, commit, or release occurred in this writing task. Production follow-through still includes row verification, famous-types regeneration, and image verification under the separate production workflow.

## Remaining editorial decision and measurement limit

Human adjudication must resolve the **0.9 grade delta**. Both graders identify a slow opening and insufficiently immediate interior writing. The 7.6 grader additionally asks to reduce theory exposition and qualifications; that must be reconciled with the jury's explicit protection of uncertainty and the source audit's rejection of invented internal experience. A future edit can tighten those passages without converting a hypothesis into a fact. The final verifier also notes a non-blocking repetition between two adjacent Google Doc sentences. Reader-facing edits would require fresh verification and grading.

The available Search Console export ends August 11, before this page's August 14 publication. There is no post-publication traffic baseline, not a zero-traffic result. After an approved sync, evaluate exact-page impressions, clicks, CTR, position, and query mix over 28 days. No numeric forecast or monitoring automation was invented.
