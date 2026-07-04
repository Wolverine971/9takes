<!-- .claude/commands/twitter-followup.md -->

# Twitter Followup — @9takesdotcom

Walk DJ through the next batch of follow/unfollow actions for the Psychology Twitter repositioning project. Each session: 5–10 actions, takes ~15 minutes.

**Why this exists:** The audit at `docs/twitter/2026-05-19_engagement-audit/` showed DJ is following the wrong people — celebrities who won't engage and political/finance noise that dilutes his algorithmic signal. This command works the queue at `docs/twitter/follow-tracker.md` until the following list reflects Psychology Twitter, not random.

---

## Source of truth

- **Tracker:** `docs/twitter/follow-tracker.md` — the live queue + completed log + engagement notes. Read it first, write to it last.
- **Audit:** `docs/twitter/2026-05-19_engagement-audit/` — full rationale. Consult if DJ asks "why this account?"

---

## Phase 0: Read the tracker + counters

1. Read `docs/twitter/follow-tracker.md` end-to-end.
2. Navigate to `https://x.com/9takesdotcom` and capture current `following` / `followers` counts.
3. Compute delta vs. last logged counter in the tracker. If `following` dropped or `followers` rose, surface that win to DJ.

---

## Phase 1: Pick the batch

Pick the next 5–10 actions in this priority order:

1. **🔥 P0 follow queue** — unblocked top priority. Always work this first.
2. **Unfollow queue** — equal priority. Cleaning signal is as valuable as adding signal.
3. **🟡 P1 follow queue** — after P0 is empty.
4. **🟢 P2 follow queue** — only if P0 + P1 are exhausted.

Don't let one session be all follows or all unfollows — interleave 3-4 of each. The algorithm reads net direction, not absolutes.

---

## Phase 2: Walk the batch with DJ

For each account in the batch, do this loop:

### If FOLLOW action

1. Open the profile: `https://x.com/<handle>`
2. Capture:
   - Bio (1 line)
   - Last 3 posts (text + engagement: views, likes, replies)
   - Latest post that broke 1K views (the "best recent" exemplar)
3. Show DJ a 4-line summary:
   ```
   @<handle> — <bio one-liner>
   Recent activity: [N posts / week], best post: [X views, Y likes, "[snippet]"]
   Why we want them: [1 line from tracker — paste from "Why" column]
   Follow recommendation: ✅ Strong / ⚠️ Soft / ❌ Skip
   ```
4. **Soft skip rule**: If their last 5 posts are all crypto/politics/off-topic OR their account is private/suspended/inactive (no posts in 30 days), recommend ❌ skip and mark `SKIPPED — [reason]` in the tracker. Don't waste a follow slot.
5. **If strong/soft**, prompt DJ: "Follow @<handle>? (y/n/skip)". On `y`, mark `✅` in the tracker with today's date.

### If UNFOLLOW action

1. Open the profile: `https://x.com/<handle>`
2. Capture: bio + sample of last 3 posts.
3. Show DJ:
   ```
   @<handle> — <bio one-liner>
   Their recent vibe: [1 line]
   Why unfollow: [paste from tracker]
   Risk of unfollow: [Low — off-topic / Medium — sometimes relevant / High — DJ engages with them]
   ```
4. Prompt: "Unfollow @<handle>? (y/n/keep)". On `y`, mark `✅` in the tracker with today's date.

---

## Phase 3: One reply per follow

The follow itself does nothing for engagement. **The follow + a thoughtful reply on one of their recent posts** is what builds the mutual.

For each newly-followed P0 or P1 account this session:

1. Find their best recent post (>200 views in the last 48 hours).
2. Hand it to the `/tweet-reply` workflow (or invoke the `editor` subagent directly) with DJocrates voice + Level 0 visibility unless the tweet explicitly mentions personality/enneagram.
3. Log the reply target in the tracker under "ENGAGEMENT NOTES" with status `Reply queued`.

This is the only step that makes the follow load-bearing. Don't skip it.

---

## Phase 4: Update the tracker + close out

Append a session block to the "SESSION LOG" section of `docs/twitter/follow-tracker.md`:

```markdown
### YYYY-MM-DD — session [N]

- Follows added: X (handles: …)
- Unfollows: Y (handles: …)
- Replies queued: Z (handles: …)
- Counter: [following] following / [followers] followers (delta: +X / -Y vs last session)
- Notes: [anything DJ flagged, accounts skipped + why, accounts to revisit]
```

Update the top-of-file counter to match what was just captured.

---

## Phase 5: Brief DJ

Output a tight summary:

```
Twitter followup — [date]

Done this session:
- Followed: [N] (P0: X, P1: Y, P2: Z)
- Unfollowed: [N]
- Replies queued for next /tweet-reply: [list]

Tracker state:
- P0 follow queue: [X remaining]
- P1 follow queue: [Y remaining]
- P2 follow queue: [Z remaining]
- Unfollow queue: [W remaining]

Counter: [following] following / [followers] followers
Net delta since audit: [+/-X following, +/-Y followers]

Next session priority: [recommend P0 first if anything left, else unfollow, else P1]
```

---

## Guard rails

- **Never unfollow without DJ's explicit `y`.** Following list is a public artifact; don't churn it autonomously.
- **Never follow noise that wasn't in the tracker queue.** If DJ wants to add a new account to the queue, propose it as a new P0/P1/P2 entry in the tracker, then act on the next session.
- **Skip private / suspended / inactive accounts.** Mark `SKIPPED` with reason and date. Don't burn a follow slot.
- **Don't promise mutuals.** "@HeidiPriebe1 will follow you back" — never say this. Say: "If she sees a sharp reply from you, the mutual is possible."

---

## When to graduate from this command

When `docs/twitter/follow-tracker.md` has:

- 0 entries in P0 follow queue
- ≤ 2 entries in P1 follow queue
- 0 entries in unfollow queue

…the project is done. DJ's follow list is now correctly shaped. Switch to `/twitter-warmup` for daily engagement and `/twitter-post` for originals. Leave the tracker as a living log of which accounts engage back.

---

_Last updated: 2026-05-19_
