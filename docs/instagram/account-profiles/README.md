# Instagram Account Profiles

This directory is the relationship-memory layer for Instagram.

Use one markdown file per account:

`docs/instagram/account-profiles/<handle>.md`

Use the handle without `@` as the filename.

---

## What Lives Where

- `docs/instagram/instagram-engagement-targets.md`
  The master universe of accounts and tiers.
- `docs/instagram/account-profiles/<handle>.md`
  The living profile, condensed intel, and running history for one account.
- `docs/instagram/daily-engagement/YYYY-MM-DD_instagram-warmup.md`
  The sourcing doc and reply queue for one scan.
- `docs/instagram/daily-engagement/YYYY-MM-DD_instagram-replies.md`
  The drafted replies and execution notes for one scan.

---

## When To Create A Profile

Create a profile when:

- An account is queued for reply.
- An account has already interacted with @9takesdotcom.
- An account is strategically important enough to revisit.
- An account has shown up repeatedly across scans.

Do not wait for a perfect relationship history. Start the file as soon as the account matters.

---

## Update Rules

The profile is a living document.

- Keep the top summary short and current.
- Append new relationship-history rows instead of deleting old ones.
- Mark whether an interaction was only reviewed, queued, drafted, or actually posted.
- If you know the exact comment that was posted, record it.
- Refresh the bio snapshot when it changes or when it was missing.
- Use the profile to avoid repetitive engagement angles.

---

## Recommended Status Language

For `Relationship Status`:

- `Prospect`
- `Warm`
- `Active`
- `Monitor only`

For `Action` or `Status` rows in the history table:

- `Reviewed`
- `Queued`
- `Drafted`
- `Commented`
- `Story reply`
- `DM`
- `Liked our comment`
- `Followed us`

---

## File Template

Use:
`docs/instagram/account-profiles/_template.md`

The key idea is simple:

1. A fast one-screen summary at the top
2. A current profile snapshot
3. A running relationship log
4. Open loops and best next angles

---

## Daily Workflow

1. Run `/instagram-warmup`
   It should load or create profiles, refresh intel, and queue opportunities.
2. Run `/instagram-reply`
   It should read the profiles before drafting replies.
3. After replies are actually posted, update the profile with the exact comment if known.
4. Use the profile next time to avoid repeating yourself.

---

_Last Updated: 2026-04-06_
