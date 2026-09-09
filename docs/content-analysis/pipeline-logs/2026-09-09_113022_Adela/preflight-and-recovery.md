# Adéla refresh: preflight and runtime recovery

Date: 2026-09-09. Subject: Slovak artist ADÉLA / Adéla Jergová, canonical draft `src/blog/people/drafts/Adela.md`.

## Baseline

- Read `CLAUDE.md`, the entire draft, durable research, `scripts/run-blog-pipeline.sh`, and the actual refresh command before edits.
- Original deterministic body count: **2,483 words**. Ceiling: 4,500; this refresh must also stay at or below its original count.
- Initial lint: 0 failures, 1 pre-existing warning (`published: true` / production status `draft`). Initial quality report: searchable head term, extractable answer, zero contrast pairs. Initial load-bearing source audit: 2 inline, 0 vague, 0 untagged quotations.
- Initial same-type comparison failed on the generic private-motivation disclaimer. This is a pre-existing wording issue to resolve in the actual edit, not a reason to weaken the similarity gate.
- Read-only parser preview: local parsed body and live body both MD5 `5c7476c1c3b84f293cb396cdcc3614f7`. No parser-managed field differences. Pre-existing protected-field drift: local `type` includes `pop-star`; live categories are `musician`, `dancer`.
- Live row 1122 remains published. `date` / `lastmod`: `2026-08-14`; `published_at`: `2026-08-14T04:01:09.865+00:00`. Exact metadata captured in `live-baseline.json`.
- The inherited 8.8 grade describes the August version. It is not a refreshed result. The script removed it before its attempted grade stage, as designed.
- The current GSC export ends 2026-08-11, before this page's publication. No exact Adela row was found. This cannot serve as a current page-performance baseline.
- Existing full and thumbnail images are present: `static/types/3s/Adela.webp`, `static/types/3s/s-Adela.webp`.

## Actual first pipeline execution

Executed `./scripts/run-blog-pipeline.sh Adela --refresh` unchanged. All `claude -p` stages returned the account session-limit error, with reset reported as 12:10 p.m. America/New_York. Missing evidence packet and grades are consequences of that runtime failure. The independent perspective jury never started.

The script finished and removed its own worktree lock normally. No process or lock belonging to another task was touched. `summary.json` says `completed: true`, but this run **did not pass**: the warnings, missing packet, missing grades, and missing binding are authoritative. Logs remain intact.

Routine local prerequisites were supplied through ignored symlinks to the main checkout's existing `node_modules` and `.env`. Secrets were not printed, copied into artifacts, or sent to researchers. Database operations were read-only.

Recovery: continue independent research and source repairs during the quota window, then run the provided script again after the reported reset. Do not fabricate successful stage results or substitute the inherited grade.

## Independent work completed during the quota window

- Two separate research agents audited new material and inherited evidence. A third agent prepared a complete replacement candidate within the existing word budget; the legacy auditor then verified four narrow corrections against that candidate's exact hash.
- The candidate was applied to the real draft. Root corrected two pre-existing broken FAQ anchors using the actual server renderer and confirmed live heading IDs: `what-is-adlas-personality-type`, `why-adla-is-a-character`. The display name retains its accent.
- Local `type` now matches the verified live protected categories, `musician` and `dancer`; this resolves the pre-existing `pop-star` drift without changing the database.
- Root added an appropriate Type 4 reference link and replaced the unlabelled documentary transcript as the attribution source for Adéla's Manon comments with Sheldon Pearce's April 27, 2026 NPR reporting, syndicated by GPB. Reporting establishes speaker attribution, not the fairness of the statement.
- Deterministic checks on the applied candidate passed: lint (only the preserved production-state warning), source audit, quality signals, and same-type similarity. The separate SEO audit found only the intentionally absent fresh grade after the anchor/link repairs.
- A pre-grade dry run preserved all protected fields and reported the expected stale-perspective blocker. This is correct: the August binding cannot authorize the new body. Its approval token is provisional and must be regenerated after final reviews and grades.
- The queued process restarted the unchanged pipeline after the reset at 12:10 ET. Retry logs: `docs/content-analysis/pipeline-logs/2026-09-09_121005_Adela/`. The frozen pre-retry body had 2,321 words and complete-file SHA-256 `612d71cd4ddd4b3ffe6a8d375815a8303ef445874acfc1459f6a3d777ba34e9d`. This is a continuation of the active task, not a recurring automation. No existing process or worktree lock was removed to arrange it.

## Cut list, before additions

1. Repeated proof/rank/scoreboard explanations that make every choice confirm the same thesis.
2. The invented empty-apartment interior scene and categorical assertions about shame.
3. The implication that the bedroom manifesto followed immediately after elimination.
4. The Manon passage's incomplete account of when trainees learned the selection format.
5. The unsupported implication that a separate stage character makes applause feel unreal to her.
6. Repeated speculation about family being unmoved by her career, and generic growth/subtype claims.
7. Future album language and stale review comments/ledgers.

## Candidate admission decisions

- **T1:** Different creative process on PRIMA, including accepting specialist help and negotiating audience expectations. This tests the limits of the earlier self-directed plan.
- **T1:** Her own account of defending “Ain't in LA,” and the return of Slovak family imagery. This complicates a simple approval-seeking reading.
- **T1:** First-person limits on what the public character reveals; the article must incorporate evidence that resists its own interpretation.
- **T1:** Contrasting reviews of PRIMA, tightly attributed. They test whether professional control delivers distinctive work, without diagnosing the person.
- **T1 correction:** Rachel Sennott's title credit. Adéla's embrace of the ballet meaning remains relevant, but originating the title cannot be asserted.
- **T2:** September 4 album release and September 9 North American tour opening. Brief context, with sellout claims attributed to the label and no claim the Detroit performance has already occurred.
- **T3:** Track-by-track recap, unverified chart peaks, every tour stop, promotional superlatives, unrelated celebrity or collaborator controversies.

Independent research and the legacy audit are saved under `docs/content-analysis/research/Adela-2026-09-09-*.md`. They are evidence and editorial working files, not production approval or quality certification.

## Production boundary

Preserve publication state and `lastmod`. Keep local human-review flags unapproved. Finish writing, exact-version independent quality checks, parser dry run, and a concrete production handoff before seeking any final production decision. No database write, generated listing mutation, shared queue change, pipeline-code edit, or unrelated blog edit is part of this task.

## Post-reset runtime recovery

The 12:10 ET default-model retry reached the script's end but failed all Claude stages with “You're out of usage credits.” See `docs/content-analysis/pipeline-logs/2026-09-09_121005_Adela/`. Its snapshot and deterministic reports passed; the evidence packet, six-reviewer jury, grades, and final binding did not run successfully. `completed: true` still does not mean quality passed.

A read-only inspection of model-only settings identified the saved default as `claude-fable-5-1[1m]`. No authentication values were printed or changed. An isolated `claude --model sonnet` check succeeded. A second check verified that the process-local `ANTHROPIC_MODEL=sonnet` override selects `claude-sonnet-5` and completes successfully. No purchase, credit reset, or saved-setting change was made.

The unchanged script then restarted with `ANTHROPIC_MODEL=sonnet ./scripts/run-blog-pipeline.sh Adela --refresh`. Logs: `docs/content-analysis/pipeline-logs/2026-09-09_121156_Adela/`. Any successful reviews or grades from this run must be identified as Claude Sonnet 5 results, with their actual artifact and gate outcomes inspected before handoff.

During evidence-packet preparation, after the frozen snapshot was created, root removed one new cohesion bridge from the live draft. It incorrectly described all three childhood-section topics as assignments she had set herself as a child; the timetable passage is explicitly her later interview account. No draft-writing stage was active during this narrow removal. The frozen snapshot was preserved, so later editorial verification must compare the live text against it normally. The other two cohesion transitions remain for editorial review. Stage 1's summary also misstated the subtraction: 2,483 to 2,321 is a 162-word reduction, not 174. Final counts must come from lint rather than that prose summary.

## Coordinated source repair after the editor

All six CLI jury reviews and the synthesis passed their structural gates. The synthesis accepted two mandatory framing repairs, ten P1 items, and nine protected insights. The editor's output reached 2,659 words and introduced an unsupported claim that the 2023 voting audience had seen months of documentary footage. A separate source reviewer also identified imprecise indie-rock duration, joined quote fragments, and wording implying a pre-existing Google Doc.

Root verified this task's own scheduler PID 55924, paused only that scheduler, and let the active editor finish. The editor process exited before root edited the draft. Its original outputs are preserved as `draft-after-cli-editor.md` and `editor-resolution-cli.md` in `docs/content-analysis/perspective-reviews/Adela/2026-09-09_121156/`.

Root then repaired the source errors, made the EP date explicit, anchored tour plans to the release announcement, and cut repeated theory and transitions. The revised body measured 2,318 words: 165 below the original article and 3 below the prepared pipeline input. Both mandatory framing repairs and all nine protected insights remain. P1-03 was explicitly rejected with its source-based reason in the operative `editor-resolution.md`; the unsupported replacement was not represented as a successful repair. The independent verifier will assess that decision under its normal contract.

The same unchanged script resumed at 13:08:55 ET, passed stage 5.05 on the amended resolution artifact, and entered frontmatter enrichment. No other task's process or lock was touched. The stage-5 elapsed time includes this coordinated pause; the CLI editor's final prose report describes its pre-root version, not the corrected draft. No fresh grade was represented at this point.

## Initial verification and first fresh grade

The corrected 2,318-word draft passed independent perspective verification and the deterministic current-draft binding gate on September 9, 2026 at 13:14 ET. Both P0s were resolved, nine protected hits retained, and P1-03 explicitly rejected with a source-based reason. The reader-sensitive SHA-256 was `e1bdedb0a72e5f3bec0f89f0720f0efd9ce9a399a85d0bce8fb2f952cf30ea67`.

Lint passed with the preserved published/local-draft warning. Quality and source reports passed. The new same-type scan tripped on the generic phrase “the public record” in the root-condensed deceit paragraph. That report is a real stage failure; it is not suppressed.

Stage 7 returned a fresh 7.8 (C): Evidence 8, Originality 7, Discoverability 9, Enneagram 7.5, Writing 7.5, Hook 7. Weighted arithmetic gives 7.7857, rounded 7.8. The score is not the historical 8.8. Stage 8 began at 13:18:45 ET, triggered by the score and deterministic warning. Revision must preserve sourcing and the resolved feet-framing P0; a request for a stronger interior scene does not authorize invented thoughts or a return to the reversed wound narrative.

A separate read-only monitor records observed grades, feedback sidecars, and reader hashes in the active Sonnet-run log directory. The first grader briefly changed reader-sensitive content while placing frontmatter, then restored the exact pre-grade hash before its score and sidecar were finalized. The completed first grade is bound to the correct unchanged reader version. Later revision and same-version grade results remain pending at this entry.

## Source repair before post-revision verification

Stage 8 introduced three unsupported additions while trying to address the 7.8 grade. The independent source reviewer identified the controlled-attention claim, invented ballet sensations/instructions, and a necessary-total-rejection claim. Root paused only scheduler PID 55924, allowed revision writer PID 894 to exit, and archived its raw 2,395-word draft and resolution. No other task, process, or lock was stopped or removed.

The source reviewer then checked the proposed repairs. Root applied them, sharpened the thesis using the supplied-schedule/creative-authorship distinction, kept a sourced retrospective close-up, and replaced the generic clause that tripped same-type similarity. The operative revision-resolution.md transparently supersedes the raw CLI resolution. It explicitly rejects invented interiority and corrects the CLI claim that the refresh budget had stopped applying.

Corrected draft: 2,374 words, 109 below the original 2,483 and 53 above the prepared 2,321-word pipeline input. Reader-sensitive SHA-256: `d377748e06f23c45baa8259ec21e9234e8fd291708ebbc00bd40d4188c93e948`. Lint, quality report, source audit, same-type scan, and resolution gate pass. A trailing blank line added by the CLI was removed; it does not change the reader hash. The scheduler resumes from stage 8 to run its actual re-verification and two independent grades on this corrected version.

## Final outcome

The actual Sonnet run completed at 13:41:02 ET on September 9. Final independent verification and manifest binding pass with zero open P0s and zero protected-hit regressions. All final content reports pass; the initial same-type trip was corrected. Final prose length is 2,374, down 109 from the original, while the script's prepared-input comparison is +53.

Fresh grades were 7.8 before revision, then 7.6 and 8.5 on identical final reader-visible text. Weighted arithmetic was checked. The recorded 0.9 stability delta fails the permitted 0.3; process completion is not publication readiness. Final publish-check returned exit 2 with `grade_unstable:0.9_delta` and `already_published`. The first sandboxed read failed on network access; the network-enabled read-only retry succeeded. This was not an approval-review rejection.

The final dry run exited 0. The live content hash is still `5c7476c1c3b84f293cb396cdcc3614f7`; local parsed content is `ff0168bc542e975f77d4a3db86581e3e`. Changed-field token: `--approve-fields=description,content,content_quality,faqs,citations`. No protected drift, no DB write. Human flags remain draft/false/false and lastmod remains 2026-08-14. The final handoff is in `../2026-09-09_121156_Adela/writing-handoff.md`.
