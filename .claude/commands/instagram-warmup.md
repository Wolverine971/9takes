<!-- .claude/commands/instagram-warmup.md -->

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

- `/docs/instagram/enneagram-engagement-clusters.md` — **THE FISHING MAP. Load-bearing.** This is the new core of warmup. People don't post "I'm an Enneagram 2"; they post "why do I abandon myself in every relationship." This doc maps that vernacular → type → hashtags → creator clusters. Phase 3 scans BY POND from this doc, not by Enneagram-account tier.
- `/docs/instagram/personality-series-engagement-strategy.md` — **The loop. Load-bearing.** POST → POND → BRIDGE → CAPTURE. Tells you which type's pond is active this week (the "Current Arc" table) so warmup stays in sync with what's being posted.
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

### The shift you must internalize (read before scanning)

The old warmup looked for **Enneagram people** — accounts already in the personality/Enneagram niche. **Stop doing that as the primary move.** The new warmup fishes the **ponds**: people talking about the _ideas_ of the Enneagram in pop-psych vernacular — perfectionism, anxiety, people-pleasing, ADHD, avoidant attachment, "main character energy" — who have **never said the word "Enneagram."** They are the strangers we mirror and route back to a personality-analysis post.

Three rules carried from the cluster doc:

1. **Lead with their language, not ours.** Validate the pattern first; the Enneagram is the deeper map we offer only after we've been useful.
2. **Never diagnose a stranger.** Name the _pattern_, never "you're a Type X." (See [feedback: Instagram comment style].)
3. **The Enneagram is the internal lens, not the public talking point.** (This is why visibility Level 0 is the default in these ponds.)

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

1. Navigate to `https://www.instagram.com/`.
2. Verify the active account from at least two signals: avatar alt text (`9takesdotcom's profile picture`), profile link `/9takesdotcom/`, or sidebar/top-right widget text.
3. If the account is not `@9takesdotcom`, switch accounts using the Instagram skill's account-switching playbook:
   - Preferred logged-in path: Settings gear -> **Switch accounts** -> `9takesdotcom` row (`div[role="button"]`).
   - Fallback logged-out picker path: click the visible `9takesdotcom` account row/span directly.
4. **Always do one explicit page reload** after switching.
5. Verify the same two account signals before scanning notifications, stories, feed, hashtags, saves, or profiles.
6. If `9takesdotcom` is not visible in the picker, stop and log `browser_limitation: instagram_account_not_in_picker`.
7. If `9takesdotcom` appears but `/notifications/` or another protected route redirects to `/accounts/login/`, stop and log `browser_limitation: instagram_session_logged_out`; DJ must refresh the session manually.

Do not assume an account switch took effect just because the menu animation finished.

### Logging

When you recover from a stale state, append one line to today's warmup doc under a `Browser Notes` heading:

```
- HH:MM — Stale state on <page/account>. Symptom: <brief>. Recovered via <reload | fresh-nav | account re-switch>. Continuing.
```

---

## Command Boundary

`/instagram-warmup` is **Stage 1 only**, but it runs **two parallel filters** on every post the agent scrolls past:

- **Filter A — Engagement:** Should we comment / amplify / build relationship here? Hits go to the reply queue for `/instagram-reply`.
- **Filter B — Save:** Is this post a pattern worth building 9takes content off of? Hits get a save file written to `docs/instagram/saves/inbox/` (Phase 7 below).

A post can hit one filter, both filters, or neither. The two filters are independent — do not skip Filter B just because a post failed Filter A (a popular creator's post buried under 800 comments might be a perfect content pattern even though commenting there is dead).

Stage 1 responsibilities:

1. Check notifications, stories, feed, profiles, hashtags, and explore.
2. Run both filters on every promising post.
3. Look up account history and relationship context.
4. Create or update the account profile when needed.
5. Queue the best engagement opportunities for `/instagram-reply`.
6. Write up to `max_saves_per_warmup` save files into `docs/instagram/saves/inbox/`.

Do not draft final comments here. Do not like, save (in IG), follow, or DM during this command — saves are written as local Markdown files only.

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

## Save Bar (Filter B — feeds `docs/instagram/saves/inbox/`)

A post is **save-worthy** (distinct from engagement-worthy) when at least **two** of these signals are clearly present:

| Signal                             | What it means                                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Pattern is named, not vibed        | Post identifies a specific behavioral pattern, framing trick, or format heuristic — not a feeling or aesthetic |
| Format is replicable               | The structure (hook → turn → CTA, carousel skeleton, reel beat) can be remixed into 9takes voice next week     |
| Bridges to existing 9takes content | Pattern maps cleanly to a published blog, person analysis, or Enneagram corner piece without forcing it        |
| Counter-signal available           | You can name what would falsify the claim — meaning it's a real take, not a generic truism                     |

**Hard skip — never write a save file for:**

- Mental-health diagnosis content.
- Sponsored or ad-like content.
- Heavy IP reuse (quote-dump carousels, screenshot compilations of someone else's tweets).
- Political fights.
- Pure aesthetic with no extractable mechanic.

**Cap:** `max_saves_per_warmup` from `.local/config.json` (default 3). If more than the cap qualify, keep the highest-signal ones and list the rest under "Saves Held" in the warmup doc with shortcode + one-line reason, so DJ can manually bookmark them on IG if he wants.

**Filter A vs Filter B — worked examples:**

| Post                                                      | Filter A | Filter B | Why                                                     |
| --------------------------------------------------------- | -------- | -------- | ------------------------------------------------------- |
| Peer (5k followers) just posted a Type 5 reel, 8 comments | hit      | hit      | Comment-worthy and replicable format                    |
| Big creator (300k), 800 comments, sharp pattern read      | skip     | hit      | Engagement is buried; pattern is gold                   |
| Rising peer's coffee aesthetic carousel, no pattern       | hit      | skip     | Worth a relationship-building comment, nothing to remix |
| Random meme account, 2k likes, no audience overlap        | skip     | skip     | Nothing to do                                           |
| Therapy account giving DSM-style diagnoses                | maybe    | skip     | Hard-skip on Filter B regardless of A                   |

The save bar is **stricter** than the engagement bar. When in doubt, skip the save. Triage is the cleanup step, but the saves engine works best when `inbox/` only contains posts you'd actually want to remix.

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

### Phase 1b: Set This Week's Pond (do this before any scanning)

This is the step that keeps warmup in sync with what's being posted. From `personality-series-engagement-strategy.md`:

1. Open the **"Current Arc — Post → Type → Pond coordination"** table. Find the post running **this week** (cross-check against the posting cadence in `post-ideas/2026-05-19_personality-series-intro-arc-lineup.md` if the week is ambiguous).
2. Read off the **active type**, its **pond (their words)**, and its **hashtags to work that week**.
3. If you genuinely cannot determine which post is active this week, default the active pond to the three evergreen giants (below) and log `active_pond: undetermined — defaulted to evergreen` in the warmup doc.
4. Record at the top of today's warmup doc:

```markdown
## This Week's Pond

**Active post / type:** [e.g. Tim Ferriss / Type 1]
**Pond (their words):** [perfectionism · eldest-daughter · inner critic]
**Priority hashtags this week:** [#perfectionism #eldestdaughter #innercritic #recoveringperfectionist]
**Evergreen ponds also worked:** Anxiety (6), People-pleasing/Narcissist-survivor (2), ADHD (7)
```

The **active pond is your first scanning priority in Phase 3.** Everything else is secondary.

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

## Phase 3: Scan the Ponds (pond-first, not account-first)

**This is the revamped core.** Scan by **pond** (vernacular topic clusters), not by "Enneagram accounts." Your scanning map is now `enneagram-engagement-clusters.md`, not the account-tier list. The goal of every scan is to find people talking the _wound vernacular_ and the creators whose comment sections those people live in.

Scan in this priority order:

1. **This Week's Pond first** (from Phase 1b). Work the active type's hashtags and the comment sections of the large creators in that type's "creator/community clusters." This is where the week's post will land, so these are the warmest contacts to surface.
2. **The three evergreen giant ponds** — always worked, every scan, regardless of the active type:
   - **Anxiety / overthinking (Type 6)** — the single largest, safest, highest-volume pond.
   - **People-pleasing / boundaries / "empath vs narcissist" (Type 2)** — huge; fish the narcissist-_survivor_ side, meet them as the over-giver.
   - **ADHD / dopamine / "can't sit still" (Type 7)** — fun, low-risk, young, very online.
3. **Back-door cross-type ponds** (each reaches multiple types at once — see the cluster doc's shortcuts):
   - **Attachment-style** accounts (anxious → 2 & 6; avoidant → 5 & 8; disorganized → 4 & 6).
   - **Trauma-response** accounts (fawn → 2 & 9; freeze → 9 & 5; fight → 8 & 1; flight → 7 & 6).
   - **MBTI** accounts (INTJ/INTP → 5; back-door into the investigator pond).
4. **Peer-growth discovery** (relationship-building, runs alongside the ponds — see below).
5. Notifications/feed follow-ups already surfaced in Phase 2.
6. Explore page + Reels feed, filtered through the pond lens (does this ride a pond's mega-trend?).

### How to find rooms inside a pond

For each pond you work, use the cluster doc's map for that type:

- **Hashtags** — search the type's hashtag set; sort by recent, skim for fresh (<24h) posts with real comment threads.
- **Big-creator comment sections** — the richest rooms. Open a large therapy/psych/ADHD/attachment creator from that pond's "creator/community clusters," then mine the _commenters_ (Engagement Mode `comment-level`) — the strangers in there are the pool, not the creator.
- **Trending "POV: you're the [pattern]" audios** — fast entry points; log which audios are trending per pond (cluster doc, Open gaps).

### Pond engagement discipline (carry into the reply angle you write)

- Match the pond's **engagement angle** from the cluster doc (e.g. Type 1: "the standard moved the second you hit it, didn't it?" — offer relief, not optimization).
- **Visibility Level 0 is the default in ponds.** These strangers have not opted into Enneagram language. Level 1+ only when the post is _already_ personality/typology-coded.
- Never reply "that's Enneagram Type X." Validate their words → add one specific pattern insight → leave the door open.

### Account tiers are now a SECONDARY map (not the primary scan)

`docs/instagram/instagram-engagement-targets.md` is still the **relationship CRM and peer-growth universe** — use it to recognize known accounts, track tiers, and find peers. But it is **no longer the primary scanning map.** You are not "scanning Tier 1 Enneagram accounts" as the main move; you are working ponds and _noticing_ when a Tier 1/2 account shows up in one.

During peer-growth discovery, look for:

- similar-size or slightly larger creators **in the pond clusters** (boundary coaches, ADHD creators, attachment accounts, etc.)
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
- **Pond / Type** — which pond this post/account belongs to and the type it codes for (e.g. `people-pleasing / Type 2`). Use `enneagram-engagement-clusters.md` to map the vernacular → type. This is the field that makes the post part of the loop; do not skip it.
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

| Factor              | Weight | Criteria                                                                            |
| ------------------- | ------ | ----------------------------------------------------------------------------------- |
| **Active-pond fit** | **3x** | **In this week's pond (Phase 1b) gets top weight; evergreen ponds (6/2/7) next.**   |
| Freshness           | 3x     | Newer is better                                                                     |
| Natural fit         | 3x     | Clear way to add value                                                              |
| Tone match          | 2x     | You can sound native to the room (talk their vernacular, not Enneagram)             |
| Comment competition | 2x     | Lower is better for `post` mode; stops being a penalty for `comment-level` mode     |
| Content bridge      | 1x     | Natural follow-up — does it route to the active post / a published person analysis? |
| Relationship value  | 1x     | Worth building over time                                                            |

High-comment posts (100+) should not be dropped for comment competition alone. Re-score them as `comment-level` opportunities — they can be high-value even on a buried post, because you are amplifying existing voices, not competing with them.

Select the top 5-7 opportunities for the reply queue. Mix modes: aim for a blend of `post` and `comment-level` items rather than loading the queue with only one mode.

## Phase 7: Capture Save Candidates (Filter B output)

Run this in parallel with Phases 2–6 as you scroll. Do not treat it as a separate browsing pass — by the time you finish prioritizing the reply queue, you should already know which posts also cleared the Save Bar.

### Pre-flight for Phase 7

1. Confirm `docs/instagram/saves/inbox/`, `processed/`, `rejected/`, and `templates/save.md` all exist. If any are missing, skip Phase 7 and log `phase7_skipped: saves_engine_not_initialized` in the warmup doc's Browser Notes section.
2. Read `docs/instagram/saves/.local/config.json`. Use `max_saves_per_warmup` (default 3 if absent) as the cap.

### Steps

For each post that cleared the Save Bar during the main scan:

1. **Extract the shortcode.** From `https://www.instagram.com/p/<code>/` or `/reel/<code>/` or `/tv/<code>/`, the shortcode is the value between the type segment and the next `/`.
2. **Dedupe.** Search `docs/instagram/saves/{inbox,processed,rejected}/` for any filename containing that shortcode. If a match exists, skip and note `(deduped: already in <folder>)` in the Saves Captured table.
3. **Write the save file.** Copy `docs/instagram/saves/templates/save.md` to `docs/instagram/saves/inbox/YYYY-MM-DD_<shortcode>.md`. Fill frontmatter:
   - `id: 'ig_<shortcode>'`
   - `status: 'new'`
   - `source: 'instagram'`
   - `capture_method: 'warmup_assisted'` ← **must be this exact value** so triage can audit agent-curated saves
   - `captured_at:` ISO 8601 with timezone from config
   - `post_url:` canonical URL
   - `shortcode:` the extracted code
   - `author_handle:` `@handle`
   - `collection: 'warmup_inline'` (these did not come from a real IG collection)
   - `content_type:` `post` / `reel` / `carousel` / `tv`
   - `pillar_guess:` your best guess at which 9takes content pillar this maps to
   - `risk_level:` `normal` / `caution` / `skip` — set to `caution` if the post borders on a hard-skip category but you decided it was still save-worthy
4. **Fill in "Original Context"** with the caption (quote exact text when you can), visible on-screen text, audio/visual notes, and one line on _why_ you saved it. Be specific — "great reel" is useless to future triage.
5. **Fill in "9takes Opportunity"** with: pattern observed (one sentence), audience this lands with, possible format, and any blog/person tie-in.
6. **Leave "Processing Notes"** empty except `Deduped against:` (which folders you checked).
7. **Append to the Saves Captured table** in the warmup doc.
8. **Stop when you hit `max_saves_per_warmup`.** If more posts qualified, list the rest in "Saves Held" with shortcode + one-line reason.

### What does NOT trigger Phase 7

- Posts that cleared only Filter A (engagement) but not Filter B (save bar).
- Posts you already replied to or are _about_ to reply to. Filter B is about the post's content as a pattern, not the relationship.
- Anything in the hard-skip list above, even if the rest of the post is interesting.

### Phase 7 Logging

After Phase 7 completes, append a brief block to today's warmup doc:

```markdown
## Saves Captured

| #   | Shortcode | Author  | Why saved (one line)             | File                                            |
| --- | --------- | ------- | -------------------------------- | ----------------------------------------------- |
| 1   | ABCxyz    | @handle | Falsifiable claim about avoiders | docs/instagram/saves/inbox/2026-05-18_ABCxyz.md |

## Saves Held (over cap)

| Shortcode | Author | Why held                                                |
| --------- | ------ | ------------------------------------------------------- |
| DEFuvw    | @other | Cap reached. Replicable carousel format if you want it. |

## Saves Skipped (hard-skip rules)

| Shortcode | Author | Reason                       |
| --------- | ------ | ---------------------------- |
| GHIrst    | @other | DSM-style diagnosis content. |
```

Only include "Saves Held" and "Saves Skipped" sections when they have content.

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

| #   | Account | Pond / Type       | Topic         | Age | Comments | Mode          | Opp Type                | Level | Score | Profile | Queue  |
| --- | ------- | ----------------- | ------------- | --- | -------- | ------------- | ----------------------- | ----- | ----- | ------- | ------ |
| 1   | @handle | people-pleasing/2 | [brief topic] | 2h  | 3        | post          | Relationship/attachment | 0     | 98    | [path]  | Queued |
| 2   | @handle | anxiety/6         | [brief topic] | 6h  | 312      | comment-level | Community amplification | 1     | 88    | [path]  | Queued |

---

## Post Opportunities

### 1. @handle - [Topic]

**Post Link:** [URL]
**Content Type:** [Carousel / Reel / Post / Story]
**Pond / Type:** [e.g. people-pleasing / Type 2 — or "active pond" / "evergreen 6" / "back-door: anxious attachment"]
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

| Account | Followers | Pond / Type | Theme | Content Type | Suggested Tier | Why |
| ------- | --------- | ----------- | ----- | ------------ | -------------- | --- |

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

## After Each Scan (CAPTURE step of the loop)

1. If you discovered new accounts, append them to `docs/instagram/instagram-engagement-targets.md` in the correct tier section — and **tag each with its pond / type** (e.g. `[pond: people-pleasing / Type 2]`) so the targets doc grows into a per-pond roster, not just a flat tier list. Append-only; never overwrite prior entries.
2. If needed, also create `docs/instagram/daily-engagement/YYYY-MM-DD_new-targets.md`.
3. Create or update account profiles for all queued accounts. Note the pond/type in the profile.
4. Leave the warmup doc in a state that `/instagram-reply` can use immediately.
5. **Close the loop:** the strangers surfaced from this week's active pond are the ones the post is meant to route. Make sure the warmup doc's "This Week's Pond" block and the reply queue point at the same type, so `/instagram-reply` mirrors them in their own vernacular and (only after warmth) bridges them to the richest live destination for that type — the week's celebrity person-analysis when one exists, otherwise the **type page** (`/personality-analysis/type/N`) or the **type educational blog**, both of which are live for all 9 types (including 2 and 9).

---

## When Complete

Present a short summary to the user:

```text
@9takesdotcom Instagram warmup complete for [date].

Queued opportunities: [count]
Profiles created: [count]
Profiles updated: [count]
New accounts discovered: [count]
Saves dropped to inbox/: [count]   ← Phase 7 output
Saves held (over cap): [count]
Saves skipped (hard-skip): [count]

Top reply priorities:
1. @[handle] - [topic]
2. @[handle] - [topic]
3. @[handle] - [topic]

Top saves:
1. <shortcode> @[handle] - [one-line pattern]
2. <shortcode> @[handle] - [one-line pattern]

Next steps:
- /instagram-reply [warmup path]    (engagement path)
- /instagram-saves triage           (content-remix path; only if saves dropped > 0)

Warmup doc: docs/instagram/daily-engagement/[filename]
```

If Phase 7 produced zero saves, omit the "Top saves" block and the `/instagram-saves triage` next-step line. Don't print empty sections.

---

## Workflow Map

```text
/instagram-warmup       -> Research + engagement queue + Filter-B save drops
/instagram-reply        -> Draft replies and update execution history
/instagram-saves triage -> Score warmup-dropped saves; promote or reject
/instagram-saves ideate -> Turn processed saves into content ideas
/instagram-saves assets -> Build publish-ready asset packs
/distribute-instagram   -> Build publishing assets for a specific blog post
```

**Use `/instagram-warmup` when:** You want a single browser sweep that produces both an engagement queue and a fresh batch of save candidates.

**Use `/instagram-reply` when:** You already have a warmup doc and want to draft replies for the queued opportunities without losing account context.

**Use `/instagram-saves triage` when:** Today's warmup dropped saves into `inbox/` (or you bookmarked things manually and ran `/instagram-saves capture`).

---

_Last Updated: 2026-06-18 (v5 — pond-first revamp: warmup now scans BY POND from enneagram-engagement-clusters.md, syncs to this week's active type via personality-series-engagement-strategy.md, tags every opportunity/account with pond+type, and scores active-pond fit. The old "scan Enneagram-account tiers" model is demoted to a secondary CRM map.)_
_v4 — 2026-05-18: Phase 7 Filter-B save bar; warmup feeds docs/instagram/saves/inbox/._
