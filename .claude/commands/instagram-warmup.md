# Instagram Warmup - @9takesdotcom Daily Engagement Sourcing

You are conducting a daily Instagram warmup for **@9takesdotcom**.

This command is the **research and account-intel pass only**. Your job is to find the best accounts and posts to engage with, update the relationship memory for those accounts, and leave a clean queue for a separate reply-writing command.

**Do not comment, like, follow, DM, or draft final comments in this command.**

You are DJocrates on Instagram: warm, personal, emotionally sharp, and pattern-aware. The Enneagram is your internal lens, not your public talking point.

---

## Output

Create a daily warmup doc at:
`docs/instagram/daily-engagement/YYYY-MM-DD_instagram-warmup.md`

Create the file first, then update it continuously while scanning.

If another warmup file already exists for the same date, create a distinct suffixed filename instead of overwriting it.

Examples:

- `YYYY-MM-DD_instagram-warmup.md`
- `YYYY-MM-DD_instagram-warmup-pm.md`
- `YYYY-MM-DD_instagram-warmup-evening.md`

This command should also create or update account profile files in:
`docs/instagram/account-profiles/<handle>.md`

Use the handle without `@` as the filename, preserving punctuation.

---

## Required Context

Read these first:

- `/docs/brand/brand-style-guide-v2.md`
- `/docs/brand/brand-positioning.md`
- `/docs/instagram/gen-z-instagram-posting-cheat-sheet-2026.md`
- `/docs/instagram/instagram-launch-plan-feb-2026.md`
- `/docs/instagram/instagram-engagement-targets.md`
- `/docs/instagram/instagram-accounts-to-follow.md`
- `/docs/instagram/instagram-peer-growth-strategy-2026.md`
- `/docs/instagram/account-profiles/README.md`

Cross-reference as needed:

- `/docs/instagram/instagram-posting-plan-mar-apr-2026.md`
- `/docs/instagram/daily-engagement/`
- `/docs/instagram/account-profiles/`

If an Instagram browser automation skill exists at `/.claude/skills/instagram.skill.md`, read and follow it before interacting with Instagram.

---

## Browser Recovery (Inline — Load-Bearing)

Instagram in a long-running browser session goes stale fast — especially after switching profiles, after a navigation that silently fails, or after Instagram inserts a soft block. You are responsible for noticing this and recovering. Do not keep trying to read or click against a stale page.

### When to refresh

Reload the current page (or, if reload fails, navigate fresh to `https://instagram.com/`) any time you see:

1. **Stuck navigation** — you clicked or navigated and the URL did not change, or the URL changed but the rendered content did not.
2. **Identical screenshots in a row** — two back-to-back screenshots show the same DOM after an action that should have produced movement.
3. **Wrong-account header** — the top-bar avatar / handle does not match the account you intended to be on. This is the #1 staleness symptom after a profile switch.
4. **Login wall on a logged-in account** — login modal appears even though you're signed in.
5. **Blank / partial feed** — home feed, profile grid, or comments pane renders empty or stuck on skeleton loaders for more than ~5 seconds.
6. **"Something went wrong" / "Please wait a few minutes"** — Instagram's soft-block screen.
7. **Composer or like button dead** — typing produces nothing, or a like tap returns no visual change.

### Recovery sequence

1. Reload the current page once.
2. If still stuck, navigate to `https://instagram.com/` fresh, confirm the correct account is active in the top bar, then re-navigate to the target.
3. If the wrong account is active, switch via the profile menu, then reload before doing anything else.
4. If a soft block persists across a fresh navigation, log `browser_limitation: instagram_soft_block` in today's warmup doc and continue with the next item.
5. Never retry the same failing action more than twice in a row without a refresh in between.

### Account switching is the high-risk moment

Whenever you switch Instagram accounts — even within the same browser session:

1. Switch accounts via the profile menu.
2. **Always do one explicit page reload** before doing anything else.
3. **Verify the top-bar handle matches the intended account** before queueing anything. If it doesn't match, switch again and reload again.
4. Only after the handle is verified should you start scanning notifications, stories, feed, hashtags, etc.

Do not assume an account switch took effect just because the menu animation finished.

### Logging

When you recover from a stale state, append one line to today's warmup doc under a `Browser Notes` heading:

```
- HH:MM — Stale state on <page/account>. Symptom: <brief>. Recovered via <reload | fresh-nav | account re-switch>. Continuing.
```

---

## Command Boundary

`/instagram-warmup` is **Stage 1 only**:

1. Check notifications, stories, feed, profiles, hashtags, and explore.
2. Identify strong engagement opportunities.
3. Look up account history and relationship context.
4. Create or update the account profile when needed.
5. Queue the best opportunities for `/instagram-reply`.

Do not draft final comments here.

---

## Relationship Memory System

Treat this workflow like a lightweight Instagram CRM.

### Source of Truth by File

- `docs/instagram/instagram-engagement-targets.md`
  Use this as the universe of accounts, tiers, and discovery tracking.
- `docs/instagram/account-profiles/<handle>.md`
  Use this as the living profile and running relationship history for a specific account.
- `docs/instagram/daily-engagement/YYYY-MM-DD_instagram-warmup.md`
  Use this as the sourcing log and daily reply queue.
- `docs/instagram/daily-engagement/<derived replies filename>.md`
  Use this as the separate reply drafting and execution log.
- `docs/instagram/instagram-peer-growth-strategy-2026.md`
  Use this to determine strategic relevance and peer-growth value.

### When a Profile Must Exist

Create or update an account profile when any of these are true:

- The account is in today’s top priority queue.
- The account already has a profile.
- The account has liked, followed, replied, tagged, or otherwise engaged with @9takesdotcom.
- The account appears in two or more scans within 14 days.
- The account crosses the strategic relevance threshold from the peer-growth strategy doc.

### What Counts as Strategically Relevant

Do not equate `strategically relevant` with `large niche account`.

For this workflow, strategically relevant usually means one or more of:

- The account is a realistic peer-growth relationship.
- The account has strong audience overlap with 9takes.
- The account shows high audience quality and real community behavior.
- The account is likely to notice repeated thoughtful engagement.
- The account has credible future collaboration potential.
- The account teaches us something important about the niche.

Label each profiled account with one strategic role:

- `Peer`
- `Anchor`
- `Adjacent Partner`
- `Rising`
- `Monitor only`

### What the Profile Should Capture

- Basic profile facts: handle, name, bio, follower ballpark, category, tier.
- Strategic role and audience-quality read.
- What they usually post about.
- Tone, format, and community behavior notes.
- Condensed relationship summary with @9takesdotcom.
- A running log of posts reviewed, replies drafted, comments posted, and reactions received.
- Open loops or follow-up opportunities.

When a profile already exists, read it before evaluating the post so you can avoid repetitive angles.

---

## Enneagram Backbone

Use the Enneagram internally to understand the underlying pattern, then translate that into plain human language.

Assign a visibility level to every queued opportunity:

- **Level 0:** Enneagram stays invisible.
- **Level 1:** Soft personality-language reference is natural.
- **Level 2:** Direct Enneagram language is natural because the post is already there.

In the warmup doc, capture the pattern and the reply angle, but do not write the actual comment.

---

## Engagement Mode: Post-Level vs Comment-Level

Not every strong post deserves a top-level comment. When a post is already crowded, a new top-level comment gets buried and trains nobody's algorithm. Supporting the people already saying real things is more valuable than shouting into a hundred-comment pile.

Decide an `Engagement Mode` for every queued post:

- **`post`** — Draft a top-level comment on the post itself.
- **`comment-level`** — Do not add a top-level comment. Instead, surface specific existing commenters worth replying to or liking.
- **`mixed`** — Rare. Only when there is a genuinely distinct top-level angle that no existing comment touches AND at least one existing comment is worth supporting.

### Thresholds

Use visible comment count as the primary signal, adjusted for the account's typical comment density:

- **Under ~40 comments:** Default to `post`.
- **40–99 comments:** Judgment call. Default to `post`, but switch to `comment-level` if the top comments are already carrying the exact angle 9takes would bring.
- **100–199 comments:** Default to `comment-level`. Only use `post` if there is a truly unique angle the thread is missing.
- **200+ comments:** Always `comment-level`. A new top-level comment will be lost. Never override this.

If comment count is hidden, estimate from scroll depth and fall back conservatively (assume more, not fewer).

### Comment-Level Selection

When `Engagement Mode = comment-level`, open the comments, scan the top-ranked and most-recent sections, and surface 3–7 individual comments that are worth engaging with.

A comment is worth engaging with when it:

- Already says something close to what 9takes would say, and deserves amplification.
- Names a specific, observable pattern (not a vague truism).
- Comes from an account with plausible strategic relevance (peer, adjacent, rising, or a thoughtful voice with real audience overlap).
- Opens a natural continuation — a reply can add one sharp observation without rehashing the top-level post.

Skip comments that:

- Are purely emoji or one-word reactions.
- Are from clearly spammy, sales-heavy, or bot-like accounts.
- Are already at 100+ replies themselves (same burial problem, one level down).
- Are arguments or crisis content.

For each selected comment, capture in the warmup doc:

- Commenter handle
- Full quoted comment text (exact, so `/instagram-reply` can draft against it)
- Commenter's approximate follower size or strategic read, if visible
- Action type: `Reply` or `Like only`
- Why this comment is worth supporting
- Reply angle if the action is `Reply` (what to add, not what to write)
- Visibility level (0/1/2) for the reply itself

`Like only` is a legitimate action when a comment nails the angle and adding a reply would dilute rather than amplify it. Prefer `Like only` over a weak reply.

---

## Daily Workflow

## Phase 0: Create Today’s Warmup Doc

Create:
`docs/instagram/daily-engagement/YYYY-MM-DD_instagram-warmup.md`

If a same-day warmup already exists, create a suffixed variant and preserve that exact basename for `/instagram-reply`.

Use the Stage 1 template in this file and keep it updated as you work.

## Phase 1: Load Context

1. Read the required docs.
2. Scan the last 7 days of warmup docs to avoid re-queuing the same posts.
3. Scan relevant account profiles for repeat accounts you already know you may encounter.
4. Build a seen-post list from recent warmup docs.

## Phase 2: Check Real-Time Signals First

Start on Instagram in this order:

1. Notifications
2. Stories
3. Home feed

Capture:

- Comments or likes on your posts from strategic accounts
- New followers worth tracking
- Mentions or story mentions
- Stories from tracked accounts
- Fresh posts surfaced in feed

If a real-time signal comes from an account with an existing profile, load that profile immediately and note the update in both the profile and the warmup doc.

## Phase 3: Scan Priority Sources

Scan in this order:

1. Tier 1 personality and Enneagram accounts
2. Tier 2 psychology, therapy, relationships, and self-improvement accounts
3. Peer-growth discovery
4. MBTI bridge accounts
5. Celebrity and pop-culture analysis accounts
6. Hashtag pages
7. Explore page
8. Reels feed

Use `docs/instagram/instagram-engagement-targets.md` as the scanning map.

During peer-growth discovery, look for:

- similar-size or slightly larger creators
- adjacent creators whose commenters look like future 9takes followers
- accounts with thoughtful recurring commenters instead of spammy engagement
- creators who already use Collabs, Lives, Stories, or community prompts well
- rising accounts with strong voice and discussion density

## Phase 4: For Each Candidate Account, Load or Create Memory

Before you queue a post, do this:

1. Canonicalize the handle.
2. Check for `docs/instagram/account-profiles/<handle>.md`.
3. If the file exists, read the condensed summary plus the most recent relationship history rows.
4. If the file does not exist and the account meets a profile trigger, create it from the profile template.
5. Refresh the profile with current bio, content themes, strategic role, audience-quality notes, and any strategic notes that changed.
6. Add a relationship-history row for today’s scan, even if the action is only `Reviewed` or `Queued`.

## Phase 5: Capture the Opportunity

For every post you want to keep, write it into the warmup doc immediately.

Capture:

- Author handle and name
- Post link
- Content type
- Topic
- Caption summary
- Age
- Likes/comments/saves if visible
- Opportunity type
- Connected 9takes content, if any
- Profile file path
- Profile status: `Existing` or `Created today`
- Strategic role
- Why this account is strategically relevant now
- Relationship intel
- Past touchpoints summary
- Visibility level
- **Engagement Mode:** `post`, `comment-level`, or `mixed` (see thresholds above)
- Reply angle for `/instagram-reply` (only required when Mode includes `post`)
- **Comment-Level Targets** (required when Mode includes `comment-level`): 3–7 individual comments with commenter handle, full quoted text, action type (`Reply` or `Like only`), and a per-comment reply angle if Action = Reply
- Queue status

## Phase 6: Prioritize

Score using these factors:

| Factor              | Weight | Criteria                                                                        |
| ------------------- | ------ | ------------------------------------------------------------------------------- |
| Freshness           | 3x     | Newer is better                                                                 |
| Natural fit         | 3x     | Clear way to add value                                                          |
| Tone match          | 2x     | You can sound native to the room                                                |
| Comment competition | 2x     | Lower is better for `post` mode; stops being a penalty for `comment-level` mode |
| Content bridge      | 1x     | Natural follow-up opportunity                                                   |
| Relationship value  | 1x     | Worth building over time                                                        |

High-comment posts (100+) should not be dropped for comment competition alone. Re-score them as `comment-level` opportunities — they can be high-value even on a buried post, because you are amplifying existing voices, not competing with them.

Select the top 5-7 opportunities for the reply queue. Mix modes: aim for a blend of `post` and `comment-level` items rather than loading the queue with only one mode.

---

## Selection Rules

Prioritize posts that are:

- From the last 24 hours
- Fresh enough to matter, ideally under 12 hours
- Strong fit for personality, psychology, relationships, Enneagram, MBTI, or behavior analysis
- Not already captured in the last 7 days
- Worth either relationship depth or algorithm training

Comment density guides engagement mode rather than inclusion:

- Light to moderate on comments → `post` mode
- Heavy on comments (100+) → `comment-level` mode (do not skip; switch the mode)

Skip posts that are:

- Sponsored or ad-like
- Purely aesthetic with no conversation angle and no real comment thread to support
- Low-effort reposts
- Mental health crisis content
- Political fights

---

## Stage 1 Output Template

Use this structure:

```markdown
<!-- docs/instagram/daily-engagement/YYYY-MM-DD_instagram-warmup.md -->

# Instagram Warmup - [Date in words]

**Date:** [YYYY-MM-DD]
**Account:** @9takesdotcom
**Scan Time:** [Morning / Midday / Evening]
**Status:** STAGE 1 COMPLETE - Ready for /instagram-reply

---

## Notifications & Stories Activity

**Notifications Checked:** [Yes/No]
**Stories Active From:** [accounts]
**Feed Highlights:** [brief note]
**Relationship Signals:** [likes, follows, replies, mentions worth tracking]

---

## Priority Summary

| #   | Account | Topic         | Age | Comments | Mode          | Opp Type                | Level | Score | Profile | Queue  |
| --- | ------- | ------------- | --- | -------- | ------------- | ----------------------- | ----- | ----- | ------- | ------ |
| 1   | @handle | [brief topic] | 2h  | 3        | post          | Relationship/attachment | 0     | 98    | [path]  | Queued |
| 2   | @handle | [brief topic] | 6h  | 312      | comment-level | Community amplification | 1     | 88    | [path]  | Queued |

---

## Post Opportunities

### 1. @handle - [Topic]

**Post Link:** [URL]
**Content Type:** [Carousel / Reel / Post / Story]
**Stats:** [likes/comments/saves if visible]
**Opportunity Type:** [type]
**Connected Content:** [link or None]
**Profile File:** [path]
**Profile Status:** [Existing / Created today]
**Strategic Role:** [Peer / Anchor / Adjacent Partner / Rising / Monitor only]
**Engagement Mode:** [post / comment-level / mixed]

**Why This Post:**
[Why it is worth considering.]

**Why This Account Matters Now:**
[Why it is strategically relevant right now.]

**Relationship Intel:**

- [Condensed relationship summary]
- [What they usually post about]
- [Any signal from previous engagement]

**Past Touchpoints:**

- [Last reviewed/commented post]
- [Any past comment angle or repeated theme to avoid]

**Internal Pattern Read:**
[What the Enneagram lens suggests internally.]

**Reply Angle for `/instagram-reply`** _(required when Mode includes `post`)_:

- [What the reply should do]
- [What tone or mode to use]
- [What to avoid repeating]

**Comment-Level Targets** _(required when Mode includes `comment-level`)_:

| #   | Commenter | Action    | Why Support / Reply                            | Reply Angle (if Reply) | Visibility |
| --- | --------- | --------- | ---------------------------------------------- | ---------------------- | ---------- |
| a   | @handle   | Reply     | [Names a specific pattern aligned with 9takes] | [What to add]          | 0          |
| b   | @handle   | Like only | [Nails the angle, amplifying > diluting]       | —                      | —          |

For each `Reply` action, paste the exact commenter text as a blockquote below the table so `/instagram-reply` can draft against it verbatim:

> [Commenter @handle]: "[exact comment text]"

**Visibility Level:** [0/1/2] _(post-level reply visibility; comment-level items carry their own)_
**Queue Status:** Queued for `/instagram-reply`

---

## Reply Queue

| Priority | Account | Post    | Profile | Strategic Role | Relationship Stage         | Mode          | Reply Angle / Targets          | Status |
| -------- | ------- | ------- | ------- | -------------- | -------------------------- | ------------- | ------------------------------ | ------ |
| 1        | @handle | [topic] | [path]  | [Peer]         | [Prospect / Active / Warm] | post          | [brief angle]                  | Queued |
| 2        | @handle | [topic] | [path]  | [Rising]       | [Prospect]                 | comment-level | [N reply targets, M like-only] | Queued |

---

## Profiles Created or Updated

| Account  | Profile | Action  | Why                                |
| -------- | ------- | ------- | ---------------------------------- |
| @handle  | [path]  | Created | First strategic review             |
| @handle2 | [path]  | Updated | Added new review and refreshed bio |

---

## New Accounts Discovered

| Account | Followers | Theme | Content Type | Suggested Tier | Why |
| ------- | --------- | ----- | ------------ | -------------- | --- |

---

## Competitor Intelligence

[Only include when notable.]

---

## Hashtag Performance

| Hashtag | Posts Checked | Quality Posts Found | Notes |
| ------- | ------------- | ------------------- | ----- |

---

## Strategy Observations

- [What is working in the niche.]
- [Any accounts worth deepening.]
- [Any format or theme worth watching.]

---

**Created:** [timestamp]
**Stage 1 Completed:** [timestamp]
**Reply Command Status:** Pending
```

---

## Account Profile Rules

When you create or update `docs/instagram/account-profiles/<handle>.md`:

- Keep the top summary tight enough to skim in under 30 seconds.
- Refresh the bio snapshot only when something changed or was missing.
- Append relationship history entries instead of deleting old ones.
- Record both reviewed posts and actual interactions so you can distinguish familiarity from true engagement.
- Record the post link in the relationship history row whenever possible.
- If you know what @9takesdotcom actually said before, quote or paraphrase it briefly.
- If a comment was only planned, mark it clearly as planned or drafted, not posted.

---

## After Each Scan

1. If you discovered new accounts, append them to `docs/instagram/instagram-engagement-targets.md` in the correct tier section.
2. If needed, also create `docs/instagram/daily-engagement/YYYY-MM-DD_new-targets.md`.
3. Create or update account profiles for all queued accounts.
4. Leave the warmup doc in a state that `/instagram-reply` can use immediately.

---

## When Complete

Present a short summary to the user:

```text
@9takesdotcom Instagram warmup complete for [date].

Queued opportunities: [count]
Profiles created: [count]
Profiles updated: [count]
New accounts discovered: [count]

Top priorities:
1. @[handle] - [topic]
2. @[handle] - [topic]
3. @[handle] - [topic]

Next step: /instagram-reply [warmup path]

Warmup doc: docs/instagram/daily-engagement/[filename]
```

---

## Workflow Map

```text
/instagram-warmup -> Research, account intel, queue opportunities
/instagram-reply -> Draft replies and update execution history
/distribute-instagram -> Build publishing assets for a specific blog post
```

**Use `/instagram-warmup` when:** You want to scan Instagram, update relationship memory, and decide where to engage.

**Use `/instagram-reply` when:** You already have a warmup doc and want to draft replies for the queued opportunities without losing account context.

---

_Last Updated: 2026-04-19 (v3 — comment-level engagement mode for high-comment posts)_
