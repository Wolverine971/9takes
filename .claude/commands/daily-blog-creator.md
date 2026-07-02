<!-- .claude/commands/daily-blog-creator.md -->

# Daily Blog Creator - Automated Workflow

> **NOTE (2026-07-01): the nightly 2 AM cron no longer runs this command.** It runs
> `scripts/nightly-blog-cron.sh` directly (OpenClaw command payload, no agent turn) — that
> script does the same preflight/selection/queue-update/notify deterministically in bash.
> This command remains for **manual or ad-hoc agent-driven runs only**. If you change the
> queue rules here, mirror the change in `scripts/nightly-blog-cron.sh`.

You are the automated blog creation orchestrator for 9takes. Your job is to select the next blog from the queue, execute the content creation workflow, and handle the results.

## Pre-Flight Checks (CRITICAL)

Before doing ANY work, run these checks in order:

### 1. Check for Manual Override

Read `/Users/djwayne/9takes/docs/blog-automation/override.json`:

```bash
cat /Users/djwayne/9takes/docs/blog-automation/override.json
```

**If `pause: true`:**

- STOP immediately
- Output: "AUTOMATION PAUSED: ${reason}"
- Exit without error

**If `forceNext` is set:**

- Use that person instead of queue selection
- Clear `forceNext` after selection
- Log: "Using forced selection: ${name}"

### 2. Check for In-Progress Blog

Read `/Users/djwayne/9takes/docs/blog-automation/backlog-queue.json`:

```bash
cat /Users/djwayne/9takes/docs/blog-automation/backlog-queue.json | jq '.inProgress'
```

**If `inProgress` is not null:**

Check if the inProgress blog is stale (> 24 hours old):

```bash
# Calculate hours since started
startedAt=$(cat /Users/djwayne/9takes/docs/blog-automation/backlog-queue.json | jq -r '.inProgress.startedAt')
startedTimestamp=$(date -d "$startedAt" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%SZ" "$startedAt" +%s)
currentTimestamp=$(date +%s)
hoursElapsed=$(( (currentTimestamp - startedTimestamp) / 3600 ))
```

**If stale (> 24 hours):**

1. Move inProgress blog to `skipped` array with reason "stale inProgress - timeout"
2. Clear `inProgress`
3. Log: "STALE INPROGRESS CLEARED: ${name} after ${hoursElapsed} hours"
4. Continue with selection

**If not stale (< 24 hours):**

- STOP immediately
- Output: "BLOG IN PROGRESS: ${inProgress.name} - skipping today's run"
- Exit without error

### 3. Check Rate Limit

From `override.json`, check:

- `rateLimit.currentWeekCount`
- `rateLimit.weekStartDate`

**If currentWeekCount >= 5:**

- STOP immediately
- Output: "RATE LIMIT HIT: ${currentWeekCount}/5 blogs this week"
- Exit without error

**If weekStartDate is from a previous week:**

- Reset `currentWeekCount` to 0
- Update `weekStartDate` to today
- Continue

---

## Pre-Selection Validation

Before selecting the next blog from the queue, validate that no draft already exists:

### 4. Check Queue Items for Existing Drafts

For each item in the queue (in priority order):

```bash
# Check if draft exists
if [ -f "/Users/djwayne/9takes/src/blog/people/drafts/${item.name}.md" ]; then
  # Move to skipped array
  # Remove from queue
  # Log: "SKIPPED: ${name} - draft already exists"
  # Continue to next item
fi
```

**If draft exists:**

1. Move item from `queue` to `skipped` array with:
   - `skippedAt`: ISO timestamp
   - `skipReason`: "draft already exists"
   - `skipDetail`: File path and size info
2. Log: "SKIPPED: ${name} - draft already exists at ${filepath}"
3. Continue to next highest priority item

**If no draft exists:**

- Proceed with selection

---

## Main Workflow

### Step 1: Select Next Blog

Read the backlog queue:

```bash
cat /Users/djwayne/9takes/docs/blog-automation/backlog-queue.json
```

**Selection logic:**

1. If `forceNext` exists in override.json, use that
2. Otherwise, sort `queue` by `priority` (descending)
3. **For each candidate in priority order:**
   - Check if draft exists: `ls /Users/djwayne/9takes/src/blog/people/drafts/${name}.md`
   - If draft exists: move to `skipped`, log skip, continue to next
   - If no draft: select this item and break
4. Update `inProgress` with selected blog (including `startedAt` timestamp)
5. Write updated queue file

**Log selection:**

```
SELECTED: ${name} (Type ${type}, Priority: ${priority})
Reason: ${priorityReason}
```

**Log skips:**

```
SKIPPED: ${name} - draft already exists at src/blog/people/drafts/${name}.md
```

### Step 2: Execute the Full Pipeline

Run the **full 7-stage pipeline** — not just the creator. This is the same path as a manual run:
create → fresh_eyes → second_pass → cohesion → editor_pass → enrich_frontmatter → grade.
Skipping the refinement stages was the audit finding of 2026-06-10: cron-created blogs were
shipping without fresh eyes, editor polish, or frontmatter enrichment (no `faqs`, no
`wikidata_qid` — direct discoverability loss).

```bash
cd /Users/djwayne/9takes && ./scripts/run-blog-pipeline.sh ${selectedName} 2>&1 | tee -a /Users/djwayne/9takes/logs/blog-automation/cron-$(date +%Y-%m-%d).log
```

**NEVER END YOUR TURN WHILE THE PIPELINE IS RUNNING. (CRITICAL)**

A single blocking foreground call is **not possible** — the Bash tool caps foreground commands
at 10 minutes and the pipeline runs 20–60+. "Run it synchronously" therefore means this exact
pattern, the only one that has ever worked:

1. Launch detached: `run_in_background` (or `nohup ... &`), capture the PID.
2. **Hold the turn open by actually executing wait/poll tool calls** — repeated bounded
   foreground loops (~9 min each), e.g.
   `until ! pgrep -f "run-blog-pipeline.sh ${selectedName}" >/dev/null; do perl -e 'select(undef,undef,undef,30)'; done`
   (foreground `sleep` is blocked by the harness; use the perl select idiom).
3. Only when the process has exited do you proceed to Step 3 (verify draft) and Step 5
   (update queue / clear `inProgress`) — in the **same** run.

Writing "I'll wait for it to finish" as _text_ does nothing: if your final message is emitted
while the pipeline is alive, the CLI exits (in `-p` mode there is no next turn) and SIGKILLs
the pipeline — stage 1 never flushes a draft (0-byte `1_create.log`) and `inProgress` is left
set, silently blocking every subsequent daily run. This exact failure killed 13 of 18 overnight
runs Jun 12–Jul 1, 2026. A 0-byte create log with **no live process** = orphaned launch, not a
live run.

If the run exits or the session resumes and there is **no draft** plus a zero-byte
`1_create.log`, treat it as a failed launch, not a live in-progress blog: immediately return the
person to the queue with `retryCount + 1`, add a recovery note, and clear `inProgress` before
ending the run. Do this cleanup the same day; do not wait for the 24-hour stale timeout.

**Timeout:** 120 minutes total (the pipeline runs 7 separate `claude -p` stages, plus a
conditional revise-and-regrade loop — stages 8/9 — when the grade lands below 8.5,
discoverability below 7, or lint fails; recent full runs take ~30–60 minutes). The scheduler
(OpenClaw) job timeout must be ≥ this budget, or it will kill the pipeline mid-run; the creator
job's `timeoutSeconds` is set to 7800 (130 min) for this reason.

**Monitor for:**

- Draft file creation: `/src/blog/people/drafts/${name}.md` (after stage 1)
- Per-stage logs in `docs/content-analysis/pipeline-logs/<timestamp>_${name}/`
- The pipeline's final "grade summary" block
- Error messages (the pipeline is run-all-then-report; a stage failure does not stop it)

### Step 3: Verify Results

After the pipeline completes:

1. **Check if draft was created:**

```bash
ls -la /Users/djwayne/9takes/src/blog/people/drafts/${name}.md 2>/dev/null
```

2. **If draft exists:**
   - Log success
   - Proceed to grade capture (Step 4)

3. **If draft does not exist:**
   - Mark as failed
   - Log error
   - Update retry count

### Step 4: Capture the Grade

The pipeline already graded the blog in stage 7 — do **not** run `/grade_blog` again. Read the
grade from the draft frontmatter:

```bash
awk '/^content_quality:/,/graded_at/' /Users/djwayne/9takes/src/blog/people/drafts/${name}.md
```

Capture `overall`, `letter`, and `discoverability`. Also check `production_pretext.status` —
if `blocked`, record the blocker (e.g. `thin_collaborator_testimony`, `missing_empathy_turn`)
and set `needsReview: true`.

### Step 5: Update Queue Status

**If SUCCESS (draft created):**

1. Move blog from `inProgress` to `completed`
2. Add completion metadata:
   - `completedAt`: ISO timestamp
   - `contentGrade`: captured grade
   - `duration`: minutes taken
3. Clear `inProgress`
4. Increment `rateLimit.currentWeekCount` in override.json

**If FAILURE (no draft):**

1. Increment `retryCount` on the blog entry
2. If `retryCount >= 3`:
   - Move to `failed` array with `failedAt` and `error` fields
   - Log: "MOVED TO FAILED: ${name} after 3 retries"
3. If `retryCount < 3`:
   - Keep in queue for next attempt
   - Log: "RETRY ${retryCount}/3: ${name}"
4. Clear `inProgress`
5. Log error details

**If SKIPPED (draft already exists):**

1. Move from `queue` to `skipped` array
2. Add skip metadata:
   - `skippedAt`: ISO timestamp
   - `skipReason`: "draft already exists"
   - `skipDetail`: File path info
3. Log: "SKIPPED: ${name} - draft already exists"

**Write updated queue:**

```bash
cat > /Users/djwayne/9takes/docs/blog-automation/backlog-queue.json << 'EOF'
[updated JSON]
EOF
```

### Step 6: Send Notification

Format and send Telegram notification:

**SUCCESS message:**

```
📚 9takes Daily Blog Creator - $(date +%Y-%m-%d)

✅ SUCCESS

Blog: ${displayName}
Type: ${type}
Grade: ${contentGrade}/10
Duration: ${duration} min
Priority: ${priority}

File: src/blog/people/drafts/${name}.md

Next blog in queue: ${nextBlogName}
```

**FAILURE message:**

```
📚 9takes Daily Blog Creator - $(date +%Y-%m-%d)

⚠️ FAILED

Blog: ${displayName}
Type: ${type}
Retry: ${retryCount}/3

Error: ${errorMessage}

Will retry tomorrow.
```

---

## Error Handling

### Timeout (120 min exceeded)

- Kill the pipeline process
- If a draft was already created by stage 1, treat as PARTIAL: keep the draft, set
  `needsReview: true`, log which stages completed (check the per-stage logs)
- If no draft exists, mark as failed
- Log: "TIMEOUT after 120 minutes"
- Retry tomorrow only if no draft was created

### No Draft Created

- Check logs for error details
- Mark as failed
- Increment retry count
- If retryCount >= 3, move to `failed` array with permanent skip

### Low Grade (< 7.0)

- Still mark as completed
- Add flag: `needsReview: true`
- Log warning: "Low grade - manual review recommended"

### File System Errors

- Log specific error
- Mark as failed
- Do not increment rate limit (not a content issue)

---

## Logging

All activity logged to:

- `/Users/djwayne/9takes/logs/blog-automation/cron-YYYY-MM-DD.log` (orchestrator + pipeline stdout)
- `docs/content-analysis/pipeline-logs/<timestamp>_<Person>/` (per-stage logs, written by the pipeline script)

Log format:

```
[$(date '+%Y-%m-%d %H:%M:%S')] [LEVEL] Message
```

Levels: INFO, WARN, ERROR, SUCCESS

---

## Post-Production Handoff (Optional)

If blog is created successfully and grade >= 7.0, you MAY trigger production:

```bash
cd /Users/djwayne/9takes && claude --chrome --dangerously-skip-permissions "/blog_content_production_people ${name}"
```

**Only do this if:**

- Grade >= 7.0
- No manual review flags
- User has not disabled auto-production in override.json

---

## Summary Output

At end of run, output:

```
=== DAILY BLOG CREATOR SUMMARY ===
Date: ${date}
Status: ${status}
Blog: ${name}
Grade: ${grade}
Duration: ${duration} min
Next Run: Tomorrow 2:00 AM
===================================
```

---

## Critical Rules

1. **NEVER** run if `pause: true` in override.json
2. **NEVER** run if `inProgress` is not null (unless stale > 24h)
3. **ALWAYS** check for existing drafts before selecting from queue
4. **ALWAYS** auto-clear stale inProgress (> 24 hours old)
5. **ALWAYS** respect rate limit (5/week)
6. **ALWAYS** update queue file after selection
7. **ALWAYS** clear `inProgress` after completion (success or failure)
8. **ALWAYS** move skipped items to `skipped` array, not `completed`
9. **NEVER** exceed 120 minute timeout
10. **ALWAYS** log everything
11. **NEVER** end your turn while the pipeline process is alive — launch detached, then hold
    the turn open with real polling tool calls until the PID exits (see Step 2 for the exact
    pattern), then verify the draft and clear `inProgress` in the SAME run. Backgrounding and
    ending the turn orphans it (the failure behind 13 of 18 overnight runs, Jun 12–Jul 1 2026).
12. **ALWAYS** clear same-day failed launches when no draft exists and `1_create.log` is 0 bytes;
    return the person to `queue` with `retryCount + 1` so tomorrow is not blocked.

---

## Example Run

```
[2026-04-03 02:00:15] [INFO] Starting daily blog creator
[2026-04-03 02:00:16] [INFO] Checking override.json - pause: false
[2026-04-03 02:00:17] [INFO] Checking inProgress - null (good)
[2026-04-03 02:00:18] [INFO] Rate limit: 0/5 this week
[2026-04-03 02:00:19] [INFO] Selected: james-clear (Type 1, Priority: 98)
[2026-04-03 02:00:20] [INFO] Executing scripts/run-blog-pipeline.sh james-clear (7 stages)...
[2026-04-03 02:25:45] [INFO] Stage 1 complete — draft created
[2026-04-03 03:05:46] [INFO] Stages 2-7 complete (fresh_eyes, second_pass, cohesion, editor, enrich, grade)
[2026-04-03 03:05:50] [INFO] Grade from frontmatter: 8.7/10 (B+), discoverability 8, rubric v2
[2026-04-03 03:05:51] [SUCCESS] Blog completed - James Clear, Grade 8.7
[2026-04-03 02:28:14] [INFO] Sending notification...
[2026-04-03 02:28:15] [INFO] Daily blog creator complete
```
