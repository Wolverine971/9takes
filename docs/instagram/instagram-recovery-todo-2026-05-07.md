<!-- docs/instagram/instagram-recovery-todo-2026-05-07.md -->

# Instagram Recovery Todo — As of May 7, 2026

**Account:** @9takesdotcom
**Status:** 10 calendar days of silence (Apr 28 → May 7). 7 consecutive blocked warmup scans.
**Owner:** DJ
**Why this doc exists:** You asked for a clear recap of what to do. This is the action list, in order. Don't try to "catch up" on old drafts — most are dead. Focus is recovery of 3 warm signals + clearing the technical blocker that caused the silence.

---

## Step 1 — Fix the Chrome / Instagram setup (BLOCKING)

Nothing else can happen until this is true. Two things have to be healthy at the same time.

### 1a. Reconnect the Claude browser extension

- [ ] Confirm the Claude Chrome extension is installed (https://claude.ai/chrome)
- [ ] Confirm you're logged into claude.ai in Chrome with the **same account** as Claude Code
- [ ] Restart Chrome (if you just installed or updated the extension, this is required for the bridge to come up)
- [ ] Verify by asking Claude Code to ping the bridge — should not return "Browser extension is not connected"

**Why this is first:** Today's failure (May 7) wasn't an Instagram problem. The Claude ↔ Chrome bridge itself is offline, so no DOM, no URL, no scan possible.

### 1b. Make @9takesdotcom the active Instagram session

The previous shape (May 4, May 6) was that @dj_pew_pew was the live IG session and Instagram only allows one session per Chrome profile. Switching back and forth has been logging the other one out.

- [ ] **Recommended:** Open a **separate Chrome profile or Chrome window** dedicated to @9takesdotcom so it can coexist with @dj_pew_pew without one knocking the other offline
- [ ] In that profile/window, log into Instagram as @9takesdotcom
- [ ] Confirm the top-bar handle shows `9takesdotcom` before doing anything else
- [ ] (Optional) Bookmark `https://instagram.com/9takesdotcom/` in that profile so future scans land in the right place

### 1c. Re-run the warmup

- [ ] Once 1a and 1b are both true, run `/instagram-warmup`
- [ ] First Phase 0a (session-health pre-check) should pass — top-bar handle = `9takesdotcom`
- [ ] If it still fails, the doc generated will tell you which of the three layers (extension, cookie, account) is the new blocker

---

## Step 2 — Recover the 3 warm signals (PRIORITY)

These are people who engaged with you in mid-April and never got a follow-up. They've cooled but aren't dead. Recovery move on each = **fresh comment on their newest post**, voiced as a clean new beat. Do not reference past comments — the gap is too long for "as I said earlier" to read well.

### Priority 1: @enneagrampaths (Melissa Kircher) — ~17 days cool

- [ ] Find Melissa's newest post via the resumed warmup
- [ ] Draft a comment that reads as first-touch on that post
- [ ] **Why she's #1:** liked your Apr 13 Carl reply on Apr 20. Real coach, not algorithmic noise. Highest restoration value of the four.
- [ ] **Avoid recycling:** the Carl-as-4 vs 3 stress argument (already burnt Apr 13 and Apr 20)

### Priority 2: @mindfulmft (Vienna) + commenter `jillypie_hazeleyes` — ~16 days cool

- [ ] Find Vienna's newest post
- [ ] Draft a fresh top-level comment
- [ ] **If `jillypie_hazeleyes` reappears in any comments thread**, like or post a supportive Level-0 reply
- [ ] **Why she's #2:** community-recognition signal (jillypie liked your Apr 19 reply on Apr 21) is worth recovering
- [ ] **Avoid recycling:** "the pretending wasn't dishonesty. it was protection. 'I'm unhappy here' isn't drama" (Apr 19, reserved)

### Priority 3: @enneagramwithjb (Jackie Brewster) — ~15 days cool

- [ ] Find Jackie's newest post
- [ ] Draft a fresh comment, voiced as a new beat
- [ ] **Why she's #3:** anchor peer relationship; 4 weeks of landed comments before silence; she liked your Apr 19/20 reply on Apr 22
- [ ] **Avoid recycling:** "the pattern made perfect sense for the version of you that built it" (Apr 20, reserved); also "autopilot," "catching the pattern," "mid-fire" are burnt

### Priority 4 (lower urgency): @vvanedwards — ~10 days cool

- [ ] No urgent action needed
- [ ] Your Mar 19 anchor comment ("totally different wiring, same result on the surface") remains pinned-by-quality on her original post and is doing passive work
- [ ] If a fresh post fits the 9takes voice naturally, comment. Otherwise hold.

---

## Step 3 — What NOT to do

### Do NOT post the April 23 PM drafts

The 5 drafts in `docs/instagram/daily-engagement/2026-04-23_instagram-replies-pm.md` are stale. All target posts are ~14 days old and aged out. Posting them now would read awkward. The drafts are dead even though the phrasings are reserved.

| Draft                              | Post                                       | Verdict                |
| ---------------------------------- | ------------------------------------------ | ---------------------- |
| @enneagramwithjb DXehACGjj35       | Hornevian triads                           | Aged out — do not post |
| @mindfulmft DXc3repDdAN            | Decision to end relationship               | Aged out — do not post |
| @thesecurerelationship DXcua-jjmP1 | Blaming vs owning                          | Aged out — do not post |
| @enneagrampaths DXb4upElHlQ        | "In Our Own Words" + 2 cmt-level + 2 likes | Aged out — do not post |
| @enneagrampaths DWzFwmGFB2m        | Longings thread (was optional anyway)      | Aged out — do not post |

- [ ] Mark the Apr 23 PM replies doc as `Skipped — aged out` after recovery is underway (so the reconciliation table doesn't keep re-surfacing)

### Do NOT re-queue the Apr 28 candidates

5 posts (@vvanedwards DXp9qlyDq_E, @enneagrampaths DXo6f1ym47n, @mindfulmft DXpjBOQGZc0, @thesecurerelationship DXpoWOAEobv, @enneagramashton DXnJlcfgaNr). All closed and unrecoverable.

### Do NOT use any reserved phrasings

These are already on the avoidance list, but worth restating since this is a recovery moment:

- @enneagramwithjb: "the pattern made perfect sense for the version of you that built it"
- @mindfulmft: "the pretending wasn't dishonesty. it was protection. 'I'm unhappy here' isn't drama"
- @vvanedwards: "totally different wiring, same result on the surface"
- @enneagrampaths: Carl-as-4 vs 3 stress argument

Also overused recently and burnt: "autopilot," "catching the pattern," "mid-fire," "first time the real person gets to be in the room."

---

## Step 4 — Mark the silence period clean

- [ ] After running the recovery warmup (Step 1c), update `docs/instagram/instagram-engagement-targets.md` with a dated snapshot reflecting the 10-day gap (append-only, do not overwrite previous entries)
- [ ] In the affected account profiles (Melissa, Vienna, Jackie), add a single dated note: "Apr 28 → May 7 silence due to browser bridge / wrong-account block. Resumed [date] with fresh post entry, voiced as clean new beat."
- [ ] This keeps the relationship history honest about why there's a gap. Future you will need this context.

---

## Quick-glance order of operations

1. Fix Chrome extension bridge (Step 1a)
2. Make @9takesdotcom active in a separate Chrome profile (Step 1b)
3. Re-run `/instagram-warmup` (Step 1c)
4. Recovery comment on Melissa's newest post (Priority 1)
5. Recovery comment on Vienna's newest post (Priority 2)
6. Recovery comment on Jackie's newest post (Priority 3)
7. Mark Apr 23 PM drafts as `Skipped — aged out`
8. Append silence-period snapshot to engagement targets + 3 affected profiles

---

## Sources this recap is built from

- `docs/instagram/daily-engagement/2026-05-07_instagram-warmup.md` — today's blocked scan, full carryover state
- `docs/instagram/daily-engagement/2026-04-23_instagram-replies-pm.md` — last drafted-but-unposted reply doc
- Open relationship signals from May 7 warmup's "Open relationship signals" table

If any of the priority accounts post something between now and when you run the recovery warmup, the warmup will catch it and queue it normally — no separate manual step needed.

---

**Created:** 2026-05-07
**Next update:** After Chrome bridge is reconnected and the recovery warmup runs successfully
