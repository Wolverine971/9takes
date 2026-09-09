# Elizabeth Holmes refresh handoff, September 9, 2026

**Status: researched and revised; blocked before pipeline certification and production.** No production database mutation, publish operation, commit, queue change, pipeline-code change or unrelated blog edit was made.

## Artifacts

All paths below are relative to this worktree, `/Users/djwayne/.codex/worktrees/f793/9takes`.

| Purpose | Exact path |
| --- | --- |
| Refreshed manuscript | `src/blog/people/drafts/Elizabeth-Holmes.md` |
| Canonical source/cut/triage ledger | `docs/content-analysis/research/Elizabeth-Holmes.md` |
| Independent documentary/Trends research | `docs/content-analysis/research/Elizabeth-Holmes-documentary-independent-2026-09-09.md` |
| Independent legal/custody/relationship research | `docs/content-analysis/research/Elizabeth-Holmes-legal-independent-2026-09-09.md` |
| Independent editor's initial critique and reread | `docs/content-analysis/research/Elizabeth-Holmes-independent-editor-2026-09-09.md` |
| Actual pipeline attempt | `docs/content-analysis/pipeline-logs/2026-09-09_112933_Elizabeth-Holmes/` |
| Baseline, final checks and DB previews | `docs/content-analysis/pipeline-logs/2026-09-09_Elizabeth-Holmes-preflight/` |
| Earlier pipeline snapshot (NOT reviewed final copy) | `docs/content-analysis/perspective-reviews/Elizabeth-Holmes/2026-09-09_112933/` |

Final manuscript SHA-256: `efd29607bf19032fd6393784fedfd141a5ef04a116263371d364070d5928b789`.
Final parsed reader-content MD5: `84a25980407795ceb0ab7d17227de37a`.

## Result and editorial decisions

- **3,547 → 2,967 prose words**, 580 fewer (16.4%), under both the starting length and 4,500 ceiling.
- Retained Type 3 at moderate confidence. Replaced the old empty-self/costume thesis with a specific argument about founder identity and borrowed credibility, supported by court evidence of logos and lab concerns omitted from investor materials.
- Integrated the documentary with the public-presentation argument. Corrected the screening date to September 6 and used the official October window without promoting a secondary exact date. No researcher claims to have watched the full film.
- Qualified the disputed 2023 profile, abuse testimony, private relationships and voice history. Removed invented pregnancy/grief motives, victim-blaming, inaccurate suicide chronology and certainty about internal mental states.
- Updated appeal, sentence, custody and commutation facts with dated sources; kept useful prison work alongside the interview's continuing innocence assertion. Ordinary improvement is compatible with Type 3.
- Preserved exact `title`, `date`, `loc`, `lastmod`, `published`, `enneagram`, `type` and `person`. No silent retyping or publication-date bump.

The independent editor's reread found no new substantive factual error in the sources it checked. Its final two wording corrections (growth example and audience interpretation instead of assumed editorial control) were then applied, along with clearer Tevanian context. The root independently verified the PEOPLE byline and corrected it to Danielle Bacher in the source records. These critiques are not six-perspective certificates or numerical grades.

## Verification and gates

| Check | Final state |
| --- | --- |
| `blog-lint.sh` | PASS, 0 failures / 0 warnings; 2,967 words |
| `blog-quality-report.mjs` | PASS, 0 strong / 0 comparative contrast patterns, extractable answer 52 words, searchable head term |
| `blog-source-audit.mjs --fail-on-untagged-load-bearing` | PASS, one load-bearing epigraph inline sourced; 0 untagged. This tool checks designated slots, not every factual claim. |
| `same-type-similarity.mjs --n 8` | Clear, max 0.038 against threshold 0.04; nearest Tate-McRae and michael-jordan |
| Repository-configured MDsveX compile | PASS |
| FAQ anchors / YAML / citation inventory | PASS, 5/5 anchors in compiled markup; 20 distinct linked sources represented in citations |
| Protected fields and stale grades | Preserved; old `content_quality` and grade comments removed |
| Read-only DB parser preview | Succeeded; perspective gate refuses the proposed visible changes |
| Emerging entity-gap pipeline packet | Missing: external stage failed authentication; measurement limitation recorded |
| Six-perspective evidence packet/jury/final verification | **Not completed / no valid review** |
| First grade / independent same-version regrade / stability | **Unavailable / unavailable / unavailable**; previous 8.6/B+ does not grade this version |
| Production readiness | **Blocked**, reviewed false, ready_for_production false |

The real pipeline was run with `./scripts/run-blog-pipeline.sh Elizabeth-Holmes --refresh`. All attempted external Claude editorial/research/grade stages failed with `Not logged in · Please run /login`. Its `summary.json` says `completed: true`, but also records `perspective_final_status: packet_invalid`, null grades and stage warnings. “Completed” means the run-all-then-report script exited; it does not mean the content passed. The six jury reviewers did not run because the evidence-packet gate failed. The snapshot is the pre-rewrite article and must not be bound to this copy.

## Exact read-only preview

Source: `docs/content-analysis/pipeline-logs/2026-09-09_Elizabeth-Holmes-preflight/final-dry-run.log`.

- Existing row: `blogs_famous` person `elizabeth-holmes`, id `1044`, already published.
- Expected current live-content hash: `ee470da3f839a308c011995f58371946`.
- Proposed local parsed-content hash: `84a25980407795ceb0ab7d17227de37a`.
- Exact diff fields: `meta_title`, `persona_title`, `description`, `content`, `keywords`, `faqs`, `citations`.
- Preview approval token: `--approve-fields=meta_title,persona_title,description,content,keywords,faqs,citations`.
- Expected-hash argument, when eventually appropriate: `--expected-content-hash=ee470da3f839a308c011995f58371946`.

**These are review data, not permission to apply.** The current preview is correctly blocked by `missing_perspective_review`. Fresh pipeline grades will add grade metadata and may alter copy, hashes and the approval token. Rerun the dry preview after all stages, approve its final exact diff, and recheck live state before any authorized apply. Do not use `--publish` on this live page or bypass its perspective gate. The pre-existing unrelated `alexandr-wang` date warning appears because the parser scans candidates; that article was not changed.

## Remaining action and approval boundary

1. Obtain the pending explicit approval for running the real pipeline with external Claude login/network access. The request names the disclosure of this article and relevant repository context, and its authority to edit this worktree's article/review artifacts. Production remains a separate action.
2. Once approved, run the actual refresh command in this worktree, respecting the script's existing lock behavior. Its source file already contains verified research, cut reasons and limits. Inspect every stage outcome; a zero process exit or `completed: true` alone is insufficient.
3. Require a valid frozen-copy evidence packet and six isolated subject/fan/critic/unfamiliar/Enneagram/future reviews, synthesis and final hash binding, fresh independent same-version grades, discoverability and stability gates. Resolve actual findings, then repeat only invalidated checks. Overall must meet 8.5, discoverability 7.0, and all perspective requirements; do not fabricate scores to fill the gap.
4. Rerun the parser preview, review the exact final diff/hash/token, then request the separate production approval. After an authorized apply, verify the row, required generated artifact and image checks under the repository's production workflow.

Automatic approval review rejected the elevated pipeline rerun because it would send private article/repository context to external Claude sessions and permit multi-stage writes without the specific trusted authorization the reviewer required. An authentication-only check confirmed an existing login; the issue is not simply a missing account. The approval request remains unanswered. No indirect Claude invocation, permission workaround, lock removal or other-process termination was used.

## Source and measurement limits to preserve

The complete March 2026 sentence-reduction order was not obtained from a court-hosted PDF; partial primary text plus independent reporting and reproduced court excerpts support the narrow 123-month update. The canonical NYT documentary article could not be opened directly; returned NYT search text supports the bounded quotation-dispute attribution. The precise disputed sentence is unresolved. BOP and DOJ status are dated database observations and can change.

GSC's latest local export is a sparse 98-day window ending August 11. It cannot supply a current 28-day page baseline or defensible numerical traffic prediction. The direct-name Google Trends cluster was independently observed, but does not measure personality-type intent. The canonical ledger preserves these limitations rather than inventing an entity-gap result.
