<!-- .claude/commands/daily-blog-creator.md -->

# Daily Blog Creator

Use the deterministic scripts as the source of truth. Do not duplicate their queue logic, invent a second stage sequence, or call the old creator/editor/grader commands around the pipeline. Read `docs/writing-system/people-profile-standard.md` for the v3 editorial contract.

## Choose the authorized scope

- For a queued daily run, use `scripts/nightly-blog-cron.sh`. It owns override checks, selection, retries, queue reconciliation and configured notifications. `--dry-run` previews selection without changing the queue or launching the pipeline.
- For a specifically named person, use `scripts/run-blog-pipeline.sh <Person>`. Use `--resume` for an interrupted run or `--refresh` to make an existing draft the new baseline. Add `--expanded-review` for an explicitly requested calibration/full-jury run.
- Do not turn a named-person request into a queued daily run. Follow the user's authorization for notifications and production.

The shell entry point changes to the repository root itself. The ordinary workflow is research → draft → two independent reviews → edit body and metadata → independent verification. Explicit risk flags require the expanded jury. One targeted repair and reverification is allowed; unresolved evidence or review concerns become holds.

## Wait and inspect the actual result

Use the available process/session tools to keep the run attached and wait with bounded polls. Do not infer process lifetime by matching `run-blog-pipeline.sh`: the launcher uses `exec` and the running process is Node. Do not launch a second pipeline while the recorded lock PID is alive.

Each model stage has a timeout and turn ceiling, and the runner terminates dependent work on operational failure. Keep the scheduler/session alive for the selected workflow's budget; do not impose the old seven-stage, 120-minute assumptions.

Read the run's `summary.json` and `run.json`, or inspect the latest state with:

```sh
node scripts/blog-pipeline-status.mjs <Person>
```

- Exit **0**, `editorial_status: eligible`: the exact candidate passed editorial review. Images and publishing remain separate responsibilities.
- Exit **2**, `run_status: held`: inspect the named blockers/research tasks. This may intentionally produce no draft. The nightly wrapper records it in `held`, with `needsReview`, instead of automatically retrying inadequate evidence.
- Exit **1**, `run_status: failed`: inspect the failed stage and logs. `--resume` reuses valid checkpoints. Do not discard a partial draft or treat draft existence as success.

The nightly wrapper owns queue updates. For direct named-person runs, report the result without editing queue entries unless requested. Never start production merely because a draft exists or a numeric grade exceeds 7.

## Quality and production handoff

Do not run `/grade_blog` after v3 verification. The runner computes the weighted grade from the independent verifier and binds it to the content hash. Report overall, discoverability and any unresolved findings from the final result; do not describe a hold as ready.

For an authorized production handoff, require `node scripts/blog-editorial-check.mjs <draft-path> --release` to pass, then follow `/blog_content_production_people` or `/blog_content_publish_people` as appropriate. Those commands own image, database and Chorus responsibilities. This command does not publish by itself.

Legacy runs remain available through an explicit `--legacy` invocation for legacy drafts. Do not remove a v3 marker to bypass its release contract.
