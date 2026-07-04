<!-- docs/content-analysis/pipeline-audit-2026-07-04/automation-report.md -->
# 9takes Nightly Blog Pipeline — Automation Integrity Audit

Read-only audit of failure semantics across the four automation scripts. Every
claim below is grounded in the code and in live run artifacts. Line citations are
against the files as read on 2026-07-04.

Files audited:

- `/Users/djwayne/9takes/scripts/run-blog-pipeline.sh` (wrapper)
- `/Users/djwayne/9takes/scripts/nightly-blog-cron.sh` (orchestrator)
- `/Users/djwayne/9takes/scripts/blog-lint.sh` (deterministic lint)
- `/Users/djwayne/9takes/scripts/nightly-blog-watchdog.sh` (3:30 AM alerting)

---

## A. Confirmed bugs (with evidence)

### BUG 1 — `PIPELINE_COMPLETED` is never set to 1 → false `FAILED_AT_STAGE` on every clean run (HIGH)

- **Where:** `run-blog-pipeline.sh:68` sets `PIPELINE_COMPLETED=0`; the EXIT trap
  `on_exit` at `run-blog-pipeline.sh:69-75` writes `FAILED_AT_STAGE` whenever
  `PIPELINE_COMPLETED -ne 1`. Nothing anywhere in the script sets it to 1. The
  script has no `exit` between the trap install (`:76`) and the natural end
  (`:265`), so it always falls off the end with the value still 0.
- **Mechanism:** `CURRENT_STAGE` holds the name of the last stage that ran, so the
  trap writes `stage=<last-stage> exit=0`. On a revision run the last stage is
  `9_regrade`; on a no-revision run it is `7_grade`.
- **Live proof:** the _clean B+_ Steve Martin run
  (`docs/content-analysis/pipeline-logs/2026-07-04_020000_steve-martin/`) —
  overall 8.5, discoverability 8, lint `0 fail 0 warn`, stage 9 exit 0 — still
  wrote `FAILED_AT_STAGE`: `stage=9_regrade exit=0 died_at=2026-07-04 02:38:52`.
  Every run since 2026-07-02 shows the same false sentinel; runs on 2026-07-01
  (Alex-Warren, Mira-Murati) have none, so this is a **recently-introduced
  regression** (the sentinel mechanism landed ~2026-07-02).
- **Downstream consumer 1 (cron):** `nightly-blog-cron.sh:211-215` finds the
  person's latest log dir and, if `FAILED_AT_STAGE` exists, forces
  `needs_review="true"` and logs a WARN. For Steve Martin, the grade-based check
  (`:208`, `overall < 8.5`) left `needs_review=false`; the false sentinel is the
  **only** reason `needsReview=true` was written to the queue for a clean B+.
- **Downstream consumer 2 (watchdog):** `nightly-blog-watchdog.sh:70-73` (Case 3)
  inspects the single newest dir across all runs and alerts via Telegram if
  `FAILED_AT_STAGE` exists. Because every successful run leaves one, **the 3:30 AM
  watchdog fires a false "FAILED_AT_STAGE" alert every single night.** This is the
  worst part of the bug: it trains the operator to ignore the one channel meant to
  catch real silent deaths.
- **Fix:** BUG-1 is fixed entirely in the wrapper (Fix 1). No cron/watchdog edit
  is needed — the consumers are correct; the producer was lying.

### BUG 2 — `run_stage` discards every stage exit code; no structured stage record (MEDIUM)

- **Where:** `run-blog-pipeline.sh:98-107`. It captures `exit_code=${PIPESTATUS[0]}`,
  echoes it to stdout (`:103`), then unconditionally `return 0` (`:107`).
- **What is lost:** the only record of a stage's `claude -p` exit is a single line
  interleaved into the giant appended cron log (`nightly-blog-cron.sh:191` sends
  pipeline stdout to `$LOG`). There is no machine-readable per-run artifact, no
  duration, and no way for the cron or watchdog to tell "all stages clean" from
  "stage 5 errored but the run limped to a graded draft." A stage can fail, the
  pipeline continues by design (`:106` "run-all-then-report"), and if the later
  grade stage still writes a passing score, the upstream failure is invisible.
- **Interaction with BUG 1:** today the always-on false sentinel accidentally
  flags _every_ run for review, so a real mid-pipeline stage error is "caught" by
  noise. Once Fix 1 removes the noise, that class of failure would become
  invisible unless a real stage-error signal exists — which is exactly what Fix 2
  (+ Fix 2b) provides. Fix 1 and Fix 2/2b should ship together.

### BUG 3 — lint counts structural markers inside HTML comments (MEDIUM; confirmed false positive)

- **Where:** `blog-lint.sh:106`
  `RH_COUNT=$(grep -c 'enneagram-rabbit-hole' <<<"$BODY" || true)`. `$BODY`
  (`:50`) is the whole post body including HTML comments. The QUALITY GRADE block
  and reviewer notes are HTML comments containing **arbitrary prose** (including
  CSS class names). Rose Blackpink: a grader comment mentioned the
  `enneagram-rabbit-hole` class → `RH_COUNT=2` → `FAIL "multiple ... blocks"` on a
  draft with exactly one real block.
- **Other checks fooled by comment content (all read raw `$BODY`):**
  - **False-positive FAIL risk** (comment prose can trip a hard fail):
    - `:140-141` self-loop links — a grade note that cites the self-slug
      `/personality-analysis/<person>` → false "self-loop" FAIL.
    - `:148` visible FAQ section — a comment line like `## FAQ` → false FAIL.
    - `:162` unfinished markers — grade/"TO REACH" notes routinely contain
      `TODO`/`[TBD]` → false "unfinished marker" FAIL.
  - **Masking / false-negative risk** (comment prose can falsely _satisfy_ a
    presence check, hiding a genuinely missing element): `:94` H2, `:99` H3,
    `:116` TL;DR accordion, `:123` firstLetter, `:176` internal-link count.
- **Checks that MUST keep reading comments (do not strip):** the gate-ledger
  checks at `:130-136` read the raw `$FILE` because the ledgers (TESTIMONY /
  HEADING MIX / DISTRIBUTION / FORMULA FINGERPRINT) **are** HTML comments. And the
  em-dash (`:193`) and banned-phrase (`:219`) checks already operate on a
  comment-stripped `BODY_PROSE` (`:193`). So the strip must be applied per-check,
  never globally.
- **Non-regression checked:** on the current Steve Martin draft, stripping
  comments leaves link-count (5→5), rabbit-hole (1→1), self-slug (0→0), and
  TODO (0→0) identical. The strip only changes results when a comment actually
  contains the tripping pattern (the Rose Blackpink case).

---

## Additional integrity holes found (beyond the three known bugs)

### HOLE 4 — No stage/pipeline timeout → a hung `claude -p` silently freezes all automation (HIGH severity, but NOT a mechanical tonight fix)

- `run-blog-pipeline.sh:98` runs `claude -p ... | tee` with **no timeout**. If any
  stage hangs, the pipeline hangs holding the lock.
- The watchdog treats a live lock as healthy and stays silent
  (`nightly-blog-watchdog.sh:42-46`), and the next night's cron sees the live lock
  and skips (`nightly-blog-cron.sh:99-105`). So a single hung stage blocks _every_
  future run and suppresses the watchdog — the exact silent-death class the
  watchdog was built to catch. Recommend a max-runtime guard (see Design §C).

### HOLE 5 — Cron ignores lint results entirely when deciding `needsReview` (MEDIUM)

- `nightly-blog-cron.sh:200-222` computes `needs_review` from grade + FAILED_AT_STAGE
  only. A draft that **fails lint** but grades ≥ 8.5 gets `needsReview=false` and is
  eligible downstream. The lint pass/fail never leaves the wrapper in a form the
  cron can read. Closed by the `summary.json` in Design §C (or, cheaply tonight, by
  Fix 2b once STAGE_WARNINGS/lint signal exists).

### HOLE 6 — No cron-level lock; possible double-fire queue race (LOW)

- The wrapper is locked (`run-blog-pipeline.sh:51-64`), but `nightly-blog-cron.sh`
  itself has no lock. If OpenClaw double-fires the job, two crons can both pass
  Preflight 2 (no `inProgress` yet), both select the same top-priority person
  (draft not yet on disk), and both `queue_update`. The second's _pipeline_ is
  blocked by the wrapper lock (exits 2), so no double content is generated, but the
  queue JSON can be written by both. Low probability; note only.

### NON-ISSUES (verified intentional, leave alone)

- **Telegram failures are swallowed on purpose.** `notify()`
  (`nightly-blog-cron.sh:49-60`) and `alert()` (`watchdog:24-33`) both `|| log WARN`
  / `|| true`. Correct — comms must never fail the run. Residual risk: if Telegram
  is down the operator gets no push, but the local log is the fallback.
- **Lock release on crash is correct.** `on_exit` always `rm -rf "$LOCK_DIR"`
  (`run-blog-pipeline.sh:74`), so even a crashed run frees the lock for retry.
- **Pre-trap early exits are safe.** Usage/lock exits at `:44-45,56-58,61` happen
  before the trap installs at `:76`, so they never write a sentinel.
- **"No draft at all" is handled by the cron,** not the sentinel: missing draft →
  retry/failed path (`nightly-blog-cron.sh:223-238`). This is the right split and
  Fix 1 does not change it (see Design §C).

---

## B. Minimal fix specs (mechanical; apply verbatim)

> Safety verdict up front:
>
> - **Fix 1 (wrapper completion flag): SAFE tonight.** One assignment at end-of-run,
>   no control-flow change. Highest value: fixes both the cron false-review and the
>   nightly watchdog false-alarm at once.
> - **Fix 2 (per-stage summary): SAFE tonight.** Pure appends, no control-flow change.
> - **Fix 2b (cron reads STAGE_WARNINGS): SAFE tonight but touches the orchestrator.**
>   3-line addition mirroring an existing block. Ship with Fix 1+2 to avoid a small
>   coverage regression (real stage errors becoming invisible once BUG-1 noise is
>   removed).
> - **Fix 3 (lint comment strip): SAFE tonight, verify after applying.** Reuses the
>   exact awk already running in production for `BODY_PROSE`; non-regression confirmed
>   on a good draft. Run the verification command before considering it done.
> - **HOLE 4 (timeout) and the summary.json design: NOT a mechanical tonight fix** —
>   see Design §C for why and what to do instead.

### Fix 1 — set `PIPELINE_COMPLETED=1` at the single correct point

File: `/Users/djwayne/9takes/scripts/run-blog-pipeline.sh`

There are no early exits between the trap install (`:76`) and end-of-script, and
the revision branch (`:221-235`) contains no exit, so the one correct place is the
very end, after all reporting. Anchor on the unique final-report block.

Anchor (current, ends the file):

```bash
    echo "  (no content_quality block found — grade stage may have failed)"
fi

echo "═════════════════════════════════════════════════════"
```

Replace with:

```bash
    echo "  (no content_quality block found — grade stage may have failed)"
fi

# Clean, full completion — the EXIT trap must NOT write a false FAILED_AT_STAGE.
# Any death before this line is a real failure and should leave the sentinel.
PIPELINE_COMPLETED=1

echo "═════════════════════════════════════════════════════"
```

The anchor's first line (`echo "  (no content_quality block found...`) is unique
in the file, so the match is unambiguous (the `fi` + banner pattern also appears at
`:235-237`, hence anchoring on the unique line above it).

Verify:

```bash
bash -n /Users/djwayne/9takes/scripts/run-blog-pipeline.sh && \
grep -n 'PIPELINE_COMPLETED=1' /Users/djwayne/9takes/scripts/run-blog-pipeline.sh
# expect: syntax ok, and the match is the LAST occurrence, below the final-report block.
```

### Fix 2 — `run_stage` appends a machine-readable line per stage (+ STAGE_WARNINGS)

File: `/Users/djwayne/9takes/scripts/run-blog-pipeline.sh`

**Edit 2a — capture a start epoch.**
Anchor (current, `:87-90`):

```bash
  local started_at
  started_at="$(date +%H:%M:%S)"

  CURRENT_STAGE="${stage_num}_${stage_name}"
```

Replace with:

```bash
  local started_at start_epoch
  started_at="$(date +%H:%M:%S)"
  start_epoch="$(date +%s)"

  CURRENT_STAGE="${stage_num}_${stage_name}"
```

**Edit 2b — write the record after the exit code is known.**
Anchor (current, `:101-107`):

```bash
  local finished_at
  finished_at="$(date +%H:%M:%S)"
  echo "[Stage $stage_num] $stage_name finished $finished_at (exit=$exit_code)"
  echo

  # Always continue — user chose run-all-then-report.
  return 0
```

Replace with:

```bash
  local finished_at dur
  finished_at="$(date +%H:%M:%S)"
  dur=$(( $(date +%s) - start_epoch ))
  echo "[Stage $stage_num] $stage_name finished $finished_at (exit=$exit_code, ${dur}s)"
  echo

  # Structured per-stage record: one tab-separated line per stage.
  printf '%s\t%s\t%s\t%ss\n' "$stage_num" "$stage_name" "$exit_code" "$dur" \
    >> "$LOG_DIR/stage-summary.tsv"
  # A stage that errored but did NOT kill the run is a warning, not a crash.
  if [[ "$exit_code" -ne 0 ]]; then
    printf 'stage=%s_%s exit=%s dur=%ss at=%s\n' \
      "$stage_num" "$stage_name" "$exit_code" "$dur" "$(date '+%Y-%m-%d %H:%M:%S')" \
      >> "$LOG_DIR/STAGE_WARNINGS"
  fi

  # Always continue — user chose run-all-then-report.
  return 0
```

Both anchors are unique (the `CURRENT_STAGE=` assignment and the "Always continue"
comment each appear once).

Verify:

```bash
bash -n /Users/djwayne/9takes/scripts/run-blog-pipeline.sh
# After the next pipeline run: cat "<run-dir>/stage-summary.tsv" shows 7 or 9 rows;
# STAGE_WARNINGS exists only if some stage exited non-zero.
```

### Fix 2b — cron consumes STAGE_WARNINGS (ship with Fix 1+2)

File: `/Users/djwayne/9takes/scripts/nightly-blog-cron.sh`

Anchor (current, `:211-215`):

```bash
  latest_log_dir="$(ls -dt "$REPO/docs/content-analysis/pipeline-logs/"*"_$person" 2>/dev/null | head -1)"
  if [[ -n "$latest_log_dir" && -f "$latest_log_dir/FAILED_AT_STAGE" ]]; then
    needs_review="true"
    log WARN "Pipeline left a FAILED_AT_STAGE sentinel: $(cat "$latest_log_dir/FAILED_AT_STAGE")"
  fi
```

Replace with:

```bash
  latest_log_dir="$(ls -dt "$REPO/docs/content-analysis/pipeline-logs/"*"_$person" 2>/dev/null | head -1)"
  if [[ -n "$latest_log_dir" && -f "$latest_log_dir/FAILED_AT_STAGE" ]]; then
    needs_review="true"
    log WARN "Pipeline left a FAILED_AT_STAGE sentinel: $(cat "$latest_log_dir/FAILED_AT_STAGE")"
  fi
  if [[ -n "$latest_log_dir" && -f "$latest_log_dir/STAGE_WARNINGS" ]]; then
    needs_review="true"
    log WARN "Pipeline left STAGE_WARNINGS (a stage errored but the run continued): $(cat "$latest_log_dir/STAGE_WARNINGS")"
  fi
```

Verify:

```bash
bash -n /Users/djwayne/9takes/scripts/nightly-blog-cron.sh
```

### Fix 3 — strip HTML comments before STRUCTURAL lint checks (per-check, not global)

File: `/Users/djwayne/9takes/scripts/blog-lint.sh`

**Edit 3a — define a comment-stripped body once, right after `$BODY`.**
Anchor (current, `:49-50`):

```bash
FM="$(awk '/^---$/{c++; next} c==1' "$FILE")"
BODY="$(awk '/^---$/{c++; next} c>=2' "$FILE")"
```

Replace with:

```bash
FM="$(awk '/^---$/{c++; next} c==1' "$FILE")"
BODY="$(awk '/^---$/{c++; next} c>=2' "$FILE")"
# HTML-comment-stripped body, for STRUCTURAL checks only. Grade/review comments and
# the QUALITY GRADE block contain arbitrary prose (CSS class names, TODO/FAQ words,
# self-slugs) that must not fool presence/count checks. The gate-LEDGER checks below
# deliberately read raw $FILE because the ledgers ARE comments; the em-dash and
# banned-phrase checks already use their own stripped BODY_PROSE. Reuses the exact
# awk transform already proven in production for BODY_PROSE.
BODY_NOCOMMENT="$(awk 'BEGIN{inc=0} /<!--/{inc=1} inc{if (/-->/) inc=0; next} {print}' <<<"$BODY")"
```

**Edits 3b–3j — swap the herestring on each structural check** (`<<<"$BODY"` →
`<<<"$BODY_NOCOMMENT"`). Each full line is unique, so exact-string replacement is
safe. Do NOT touch the ledger loop (`:130-136`, reads `$FILE`), the em-dash check
(`:193`, uses `BODY_PROSE`), or the banned-phrase check (`:219`, uses `BODY_PROSE`).

Load-bearing (fixes confirmed / high false-positive-FAIL risk):

- `:106` `RH_COUNT=$(grep -c 'enneagram-rabbit-hole' <<<"$BODY" || true)`
  → `RH_COUNT=$(grep -c 'enneagram-rabbit-hole' <<<"$BODY_NOCOMMENT" || true)`
- `:140` `if grep -qiE "/personality-analysis/${BASE}([)\"'/#]|$)" <<<"$BODY" || \`
  → `...<<<"$BODY_NOCOMMENT" || \`
- `:141` `   grep -qiE "/personality-analysis/${BASE_LOWER}([)\"'/#]|$)" <<<"$BODY"; then`
  → `   grep -qiE "/personality-analysis/${BASE_LOWER}([)\"'/#]|$)" <<<"$BODY_NOCOMMENT"; then`
- `:148` `if grep -qiE "^##+ +FAQs?( |$)" <<<"$BODY"; then`
  → `...<<<"$BODY_NOCOMMENT"; then`
- `:162` `if grep -qE "TODO|\[PLACEHOLDER|Lorem ipsum|\[TBD\]" <<<"$BODY"; then`
  → `...<<<"$BODY_NOCOMMENT"; then`

Defensive (prevents comment prose from falsely satisfying a presence check):

- `:94` `if grep -qiE "^## What is .*personality type\?" <<<"$BODY"; then`
  → `...<<<"$BODY_NOCOMMENT"; then`
- `:99` `if grep -qiE "^### .* is an Enneagram Type [1-9]" <<<"$BODY"; then`
  → `...<<<"$BODY_NOCOMMENT"; then`
- `:116` `if grep -q 'summary class="accordion"' <<<"$BODY"; then`
  → `...<<<"$BODY_NOCOMMENT"; then`
- `:123` `if grep -q 'class="firstLetter"' <<<"$BODY"; then`
  → `...<<<"$BODY_NOCOMMENT"; then`
- `:176` `LINK_COUNT=$(grep -oE 'href="/(personality-analysis|enneagram-corner|community|how-to-guides|pop-culture)/[^"]+"|\]\(/(personality-analysis|enneagram-corner|community|how-to-guides|pop-culture)/[^)]+\)' <<<"$BODY" | wc -l | tr -d ' ')`
  → same line with `<<<"$BODY_NOCOMMENT"`.

Recommend applying all ten swaps (uniformly safe). At minimum apply the five
load-bearing ones.

Verify (real functional non-regression):

```bash
bash -n /Users/djwayne/9takes/scripts/blog-lint.sh && \
/Users/djwayne/9takes/scripts/blog-lint.sh steve-martin; echo "exit=$?"
# expect: exit=0, and the line "ok    Enneagram Rabbit Hole block present (exactly one)"
# (steve-martin currently passes 0 fail / 0 warn; the strip must not change that).
```

---

## C. Failure-semantics design (minimal; solo-founder bash pipeline)

### What should count as "pipeline success"

Split the two axes that the current design conflates:

1. **Wrapper success** = the wrapper ran all stages to completion without being
   killed. This is the _only_ thing `FAILED_AT_STAGE` should mean. Fix 1 makes it
   truthful. Content quality is not part of this axis.
2. **Content outcome** = did we get a gradeable draft, above bar, lint-clean, with
   no stage errors. This is decided by the cron from artifacts (draft on disk,
   grade in frontmatter, lint result, stage summary), not by the wrapper's exit.

### `FAILED_AT_STAGE` vs `STAGE_WARNINGS` (two distinct files)

- **`FAILED_AT_STAGE`** — the wrapper died before completion (signal, machine
  sleep, group kill, unexpected error). True hard failure → incomplete run →
  needs review and likely retry. After Fix 1 this appears _only_ on real crashes.
- **`STAGE_WARNINGS`** — one line per stage that exited non-zero while the run
  continued (Fix 2). This is the "run-all-then-report" surface: recoverable stage
  errors that did not stop the pipeline but may have left work undone. Non-empty →
  needs review, but not a crash.

This cleanly separates "the run crashed" from "the run finished but a stage
misbehaved," which the single sentinel cannot express today.

### When the nightly cron should set `needsReview=true`

Set it if ANY of:

1. `FAILED_AT_STAGE` present (real crash / incomplete run). _[already wired,
   `:211-215`; becomes meaningful after Fix 1]_
2. `STAGE_WARNINGS` present (a stage errored). _[Fix 2b]_
3. No grade parsed from the draft (grade stage failed). _[already, `:208`]_
4. Final `overall < 8.5` (below publish bar). _[already, `:208`]_
5. Final lint FAILED. _[HOLE 5 — needs the lint result exposed; via `summary.json`]_

**Reject: auto-flagging on capped Writing/Originality in the nightly path.**
Evaluated and declined. "Capped" is a grader judgment, not a machine fact; the only
mechanical proxy (writing ≤ 8 or originality ≤ 8) would flag essentially every B+,
and the realistic ceiling for these drafts _is_ B+ (per the project's own traffic
finding that grade barely correlates with traffic). Flagging every B+ recreates the
BUG-1 pathology — an always-on review flag that the operator learns to ignore.
Instead: record the subscores in `summary.json` and let a **weekly** human pass look
at capped-Writing/Originality B+ drafts. `needsReview` should mean "automation isn't
sure this is complete/safe," not "this could be better."

### Machine-readable `summary.json` per run (next iteration, not tonight)

Write one file at end-of-run and have the cron read _it_ instead of re-parsing the
draft with awk in three places (`nightly-blog-cron.sh:203-205`). Minimal schema:

```json
{
	"person": "steve-martin",
	"startedAt": "2026-07-04T02:00:00Z",
	"finishedAt": "2026-07-04T02:38:52Z",
	"durationMin": 38,
	"completed": true,
	"draftExists": true,
	"stages": [
		{ "stage": "1_create", "exit": 0, "durationSec": 120 },
		{ "stage": "9_regrade", "exit": 0, "durationSec": 150 }
	],
	"stageFailures": [],
	"lint": { "first": { "fail": 0, "warn": 0 }, "final": { "fail": 0, "warn": 0 } },
	"grade": {
		"first": 8.5,
		"final": 8.5,
		"letter": "B+",
		"discoverability": 8,
		"writing": 8,
		"originality": 8.5,
		"evidence": 9,
		"enneagram": 9,
		"hook": 9
	},
	"revision": { "ran": true, "reasons": ["overall 8.4 < 8.5"] },
	"reviewFlags": ["capped_writing"],
	"needsReview": false
}
```

`stages`/`stageFailures` come free from Fix 2's `stage-summary.tsv`. This is more than
a verbatim edit (it needs an end-of-run assembler in the wrapper plus a cron reader),
so it is the **next iteration**, not a tonight change. The Fix 1 + Fix 2 + Fix 2b
bundle is the tonight-safe subset that already delivers correct success/failure
semantics; `summary.json` is the clean follow-up that also closes HOLE 5.

### HOLE 4 (timeout) — recommended, NOT a mechanical tonight fix

A hung `claude -p` freezes all automation and silences the watchdog. Do not bolt a
`timeout` onto `claude -p` blindly tonight — a mid-generation kill can leave a
half-written draft that then flows through grading and looks "complete," and getting
the timeout value wrong (some stages legitimately run many minutes) would abort good
runs. Correct approach, next iteration: (a) wrap each stage in `timeout <N>m` with a
generous per-stage budget and treat timeout as a STAGE_WARNINGS entry, and/or (b) add
a watchdog branch that alerts when the lock has been held beyond a max wall-clock
(compare `.pipeline.lock` mtime / a `startedAt` marker against now) instead of
treating any live lock as healthy (`nightly-blog-watchdog.sh:42-46`). Flag for design,
not for tonight.

### Optional housekeeping

The stale false `FAILED_AT_STAGE` files in existing run dirs
(`2026-07-02`…`2026-07-04`) are harmless post-Fix-1 (cron and watchdog only inspect
the newest dir, which after tonight won't have one). No cleanup required; delete only
if you want a tidy history.

---

## Apply-tonight summary

- **Fix 1** (wrapper `PIPELINE_COMPLETED=1`): SAFE — do it; single highest-value fix.
- **Fix 2** (`run_stage` → `stage-summary.tsv` + `STAGE_WARNINGS`): SAFE.
- **Fix 2b** (cron reads `STAGE_WARNINGS`): SAFE; ship with 1+2 to avoid a coverage gap.
- **Fix 3** (lint per-check comment strip): SAFE with the verification run.
- **HOLE 4 timeout + `summary.json` + lint-into-needsReview (HOLE 5): NOT tonight** —
  design items for the next iteration.
