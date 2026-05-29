# Instagram Browser Skill

Canonical rules for any command that drives a browser against Instagram (`/instagram-warmup`, `/instagram-reply`, `/distribute-instagram`, etc.).

The most important parts of this skill are also inlined into each command so the command is self-sufficient if this file is missed. If you change something here, mirror the change into the inline blocks in `.claude/commands/instagram-*.md`.

---

## Browser Recovery

Instagram in a long-running browser session goes stale fast — especially after switching profiles, after a navigation that silently fails, or after Instagram inserts a soft block / "something went wrong" page. The agent is responsible for noticing this and recovering, not for ignoring it.

### When to refresh

Hard-refresh the current page (or, when refresh fails, navigate fresh to `https://instagram.com/`) any time you see:

1. **Stuck navigation** — you clicked or navigated and the URL did not change, or the URL changed but the rendered content did not.
2. **Identical screenshots in a row** — two back-to-back screenshots show the same DOM after an action that should have produced movement (scroll, click, account switch).
3. **Wrong-account header** — the top-bar avatar / handle does not match the account you intended to be on. This is the #1 staleness symptom after a profile switch.
4. **Login wall on a logged-in account** — Instagram is showing the login modal even though you're signed in elsewhere in the session.
5. **Blank / partial feed** — the home feed, profile grid, or comments pane renders but is empty, gray, or only shows skeleton loaders for more than ~5 seconds.
6. **"Something went wrong" / "Please wait a few minutes"** — Instagram's soft-block screen.
7. **Comment composer or like button dead** — the input is focused but typing produces nothing, or a like tap returns no visual change.

### Recovery sequence

Use the smallest fix that resolves the symptom; escalate only if needed.

1. **Reload the current page** once and wait for the feed/profile to render.
2. If still stuck, **navigate to `https://instagram.com/`** fresh, confirm the correct account is active in the top bar, then re-navigate to the target post or profile.
3. If the wrong account is active, **switch to the intended account from the profile menu**, then reload before doing anything else.
4. If the soft-block screen persists across a fresh navigation, **stop engaging with that account for this session**. Log it in the warmup or reply doc as `browser_limitation: instagram_soft_block` and continue with the next item.
5. Never retry the same failing action more than twice in a row without a refresh in between. Two stale clicks usually means the third one will be stale too.

### Account switching is the high-risk moment

Whenever you switch from one Instagram account to another — even within the same browser session:

1. Navigate to `https://www.instagram.com/`.
2. Verify the active account from at least two signals:
   - avatar alt text includes `<handle>'s profile picture`
   - profile link points to `/<handle>/`
   - sidebar/top-right widget text shows the intended handle/name
3. If the active account is wrong, use the known-good switch paths below.
4. **Always do one explicit page reload** after switching.
5. **Verify the handle again from two signals** before reading, queueing, saving, drafting, posting, liking, or opening DMs. If it doesn't match, switch again and reload again.
6. If the target handle is not visible in the picker, stop and log `browser_limitation: instagram_account_not_in_picker`.
7. If the target handle appears but a protected route redirects to `/accounts/login/`, stop and log `browser_limitation: instagram_session_logged_out`; DJ must refresh that account's login manually.

Do not assume an account switch took effect just because the menu animation finished.

#### Path A: Settings -> Switch accounts (logged-in session)

Use this when Instagram is already logged into a wrong account and the sidebar "Switch" label is collapsed or has a zero-size hit target.

1. Click the Settings gear in the left sidebar. If the visible text target is collapsed, click the parent link around `svg[aria-label="Settings"]`.
2. In the popup, click the `div[role="button"]` row labeled **Switch accounts**.
3. In the picker overlay, click the target handle row. Handles normally render as `div[role="button"]` rows.
4. Wait for the page to refresh, reload once if needed, then verify from two account signals before acting.

Known 2026-05-21 pattern: logged-in `@9takesdotcom` session can switch to another account by Settings gear -> Switch accounts -> target handle row. The sidebar "Switch" span may have `w=0/h=0`, so the Settings path is the reliable route.

#### Path B: Login/account picker row (logged-out or relabeled picker)

Use this when Chrome lands on the logged-out account picker and the target handle is visible.

1. Confirm the target handle is listed in the picker.
2. Click the text row/span for the target handle, not a nearby blank area.
3. Wait for Instagram to load the home feed.
4. Reload once, then verify from two account signals before acting.

### What to record

When you recover from a stale state, log a single line in the active session doc (warmup or reply) under a `Browser Notes` heading so future passes can see the pattern:

```
- HH:MM — Stale state on <page/account>. Symptom: <brief>. Recovered via <reload | fresh-nav | account re-switch>. Continuing.
```

When you give up on an item due to repeated staleness or a soft block, log it under `research_limitation` / `browser_limitation` and skip to the next queued item — do not pause to ask the user unless the command is in interactive mode and the entire session is blocked.
