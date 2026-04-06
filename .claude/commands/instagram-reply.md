# Instagram Reply - @9takesdotcom Reply Drafting

You are drafting Instagram replies for **@9takesdotcom** based on a completed warmup queue.

This command is the **reply-writing and execution-notes pass**. It reads the warmup doc, reads the account profiles for the queued accounts, drafts comments, and records what was drafted so the relationship history stays useful over time.

If the user later confirms which replies were actually posted, update the related docs and account profiles from `Drafted` to `Posted`.

---

## Input

The user can provide:

- A date like `2026-04-06`
- A warmup doc path
- Nothing

If no argument is provided, use the most recent completed warmup doc in:
`docs/instagram/daily-engagement/`

The source warmup doc should be:
`docs/instagram/daily-engagement/YYYY-MM-DD_instagram-warmup.md`

Create the reply doc at:
`docs/instagram/daily-engagement/YYYY-MM-DD_instagram-replies.md`

---

## Required Reading

Read these first:

- The source warmup doc
- `/docs/brand/brand-style-guide-v2.md`
- `/docs/brand/brand-positioning.md`
- `/docs/instagram/gen-z-instagram-posting-cheat-sheet-2026.md`
- `/docs/instagram/account-profiles/README.md`

Then read the account profile for every queued account listed in the warmup doc.

---

## Command Boundary

`/instagram-reply` should:

1. Read the reply queue from the warmup doc.
2. Read each queued account profile.
3. Draft 2-3 reply options per queued post.
4. Avoid repeating old angles or phrasing from past interactions.
5. Write a separate replies doc.
6. Update account histories with `Drafted` notes.
7. If the user confirms actual posting, record the exact comment and mark it `Posted`.

Do not change the warmup sourcing decisions unless there is a clear error.

---

## Memory-Aware Reply Rules

Treat the account profile like a mini CRM before you draft anything.

For each queued post:

- Check what @9takesdotcom has already said to this account.
- Check what themes you have already commented on.
- Avoid repeating the same reframe, phrasing, or emotional posture.
- If prior comments were all value-heavy, consider a lighter or more casual option.
- If the account has responded well to a certain tone, keep that in mind.
- If the relationship is brand new, avoid sounding overfamiliar.

When profile history and today’s post suggest a natural continuation, use that continuity.

---

## Enneagram Backbone

Use Enneagram understanding internally to produce precise, human comments.

Visibility levels from the warmup doc still apply:

- **Level 0:** No Enneagram mention.
- **Level 1:** Soft personality-language reference is fine.
- **Level 2:** Direct type language is fine.

---

## Comment Crafting Rules

### Core Principles

1. Most comments should not mention Enneagram directly.
2. Be a community member first, never a brand strategist in the comments.
3. Add one sharp observation, not a mini-essay.
4. Match the author’s tone, vocabulary, and energy.
5. Keep comments short enough to feel typed on a phone.

### Modes

Draft with a mix of:

- **Value:** One sharp insight or reframe
- **Cheerleader:** Pure energy, quick and specific
- **Casual:** Human, present, lightly personal

Do not produce three value comments in a row for the same post.

### Constraints

- 1-2 sentences preferred, 3 max
- No hashtags
- Minimal emoji, only if natural
- Avoid preachy phrasing
- Avoid “genuinely curious”
- Avoid opening every option with praise
- Never sound like a brand account

---

## Workflow

## Step 1: Resolve the Warmup Doc

Use the provided date or path. If none is given, find the latest completed warmup doc.

## Step 2: Create the Replies Doc

Create:
`docs/instagram/daily-engagement/YYYY-MM-DD_instagram-replies.md`

## Step 3: Draft Per Queued Opportunity

For each queued item:

1. Read the account profile.
2. Pull the relationship intel and past touchpoints.
3. Note repetition risks.
4. Draft 2-3 comment options with different modes.
5. Update the replies doc immediately.
6. Add a `Drafted` row to the account profile history if one does not already exist for this post.

## Step 4: Record Execution State

If the user has not confirmed posting yet:

- Mark each item `Drafted - Pending Posting`

If the user confirms a specific comment was posted:

- Record the exact comment in the replies doc
- Update the account profile history to `Posted`
- Update `Last Engaged` and any open loops

---

## Reply Doc Template

Use this structure:

```markdown
<!-- docs/instagram/daily-engagement/YYYY-MM-DD_instagram-replies.md -->

# Instagram Replies - [Date in words]

**Date:** [YYYY-MM-DD]
**Account:** @9takesdotcom
**Source Warmup:** [path]
**Status:** DRAFTS READY

---

## Queue Summary

| # | Account | Topic | Profile | Relationship Note | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | @handle | [topic] | [path] | [brief context] | Drafted |

---

## Reply Drafts

### 1. @handle - [Topic]

**Post Link:** [URL]
**Profile File:** [path]
**Visibility Level:** [0/1/2]

**Relationship Intel:**
- [summary]
- [last touchpoint]

**Do Not Repeat:**
- [previous angle or phrasing to avoid]

**Suggested Comment Option 1 (mode: value - [angle]):**
> [comment]

**Suggested Comment Option 2 (mode: casual - [angle]):**
> [comment]

**Suggested Comment Option 3 (mode: cheerleader - [angle]):**
> [comment]

**Product mention?** [Yes/No]
**Story reply opportunity?** [Yes/No]
**Execution Status:** Drafted - Pending Posting
**If Posted, Record Exact Comment Here:** Pending

---

## Execution Plan

- [Recommended order]
- [Timing window]
- [Spacing between comments]
- [Any product mention rules]
- [Follow-up opportunities]

---

## CRM Updates

| Account | Profile | Update |
| --- | --- | --- |
| @handle | [path] | Added drafted reply record |

---

**Created:** [timestamp]
**Execution Status:** Pending manual posting
```

---

## When Complete

Present a short summary to the user:

```text
Instagram replies ready for [date].

Drafted replies: [count]
Accounts covered: [count]
Profiles updated: [count]

Start with:
1. @[handle] - [topic]
2. @[handle] - [topic]
3. @[handle] - [topic]

Replies doc: docs/instagram/daily-engagement/[filename]
```

---

## Workflow Map

```text
/instagram-warmup -> Find opportunities, update account memory, build queue
/instagram-reply  -> Draft replies, avoid repetition, record execution notes
```

_Last Updated: 2026-04-06_
