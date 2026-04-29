# Daily Blog Creator - Automated Workflow

You are the automated blog creation orchestrator for 9takes. Your job is to run daily, select the next blog from the queue, execute the content creation workflow, and handle the results.

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

### Step 2: Execute Content Creation

Run the blog content creator command:

```bash
cd /Users/djwayne/9takes && claude --chrome --dangerously-skip-permissions "/blog_content_creator_people ${selectedName}" 2>&1 | tee -a /Users/djwayne/9takes/logs/blog-automation/cron-$(date +%Y-%m-%d).log
```

**Timeout:** 30 minutes (1800 seconds)

**Monitor for:**

- Draft file creation: `/src/blog/people/drafts/${name}.md`
- Completion message
- Error messages

### Step 3: Verify Results

After command completes:

1. **Check if draft was created:**

```bash
ls -la /Users/djwayne/9takes/src/blog/people/drafts/${name}.md 2>/dev/null
```

2. **If draft exists:**
   - Read the frontmatter to get `contentGrade`
   - Log success
   - Proceed to post-processing

3. **If draft does not exist:**
   - Mark as failed
   - Log error
   - Update retry count

### Step 4: Grade the Blog (if created)

If draft was created, run the grade command:

```bash
cd /Users/djwayne/9takes && claude --chrome --dangerously-skip-permissions "/grade_blog ${name}" 2>&1 | tee -a /Users/djwayne/9takes/logs/blog-automation/grade-$(date +%Y-%m-%d).log
```

Capture the grade from output.

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

### Timeout (30 min exceeded)

- Kill the claude process
- Mark as failed
- Log: "TIMEOUT after 30 minutes"
- Retry tomorrow

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

- `/Users/djwayne/9takes/logs/blog-automation/cron-YYYY-MM-DD.log`
- `/Users/djwayne/9takes/logs/blog-automation/grade-YYYY-MM-DD.log`

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
9. **NEVER** exceed 30 minute timeout
10. **ALWAYS** log everything

---

## Example Run

```
[2026-04-03 02:00:15] [INFO] Starting daily blog creator
[2026-04-03 02:00:16] [INFO] Checking override.json - pause: false
[2026-04-03 02:00:17] [INFO] Checking inProgress - null (good)
[2026-04-03 02:00:18] [INFO] Rate limit: 0/5 this week
[2026-04-03 02:00:19] [INFO] Selected: james-clear (Type 1, Priority: 98)
[2026-04-03 02:00:20] [INFO] Executing blog_content_creator_people...
[2026-04-03 02:25:45] [INFO] Draft created successfully
[2026-04-03 02:25:46] [INFO] Running grade_blog...
[2026-04-03 02:28:12] [INFO] Grade: 8.7/10
[2026-04-03 02:28:13] [SUCCESS] Blog completed - James Clear, Grade 8.7
[2026-04-03 02:28:14] [INFO] Sending notification...
[2026-04-03 02:28:15] [INFO] Daily blog creator complete
```
