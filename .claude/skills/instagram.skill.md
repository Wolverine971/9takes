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

1. Switch accounts via the profile menu.
2. **Always do one explicit page reload** before doing anything else.
3. **Verify the top-bar handle matches the intended account** before reading or queueing anything. If it doesn't match, switch again and reload again.
4. Only after the handle is verified should you start scanning notifications, stories, feed, etc.

Do not assume an account switch took effect just because the menu animation finished.

### What to record

When you recover from a stale state, log a single line in the active session doc (warmup or reply) under a `Browser Notes` heading so future passes can see the pattern:

```
- HH:MM — Stale state on <page/account>. Symptom: <brief>. Recovered via <reload | fresh-nav | account re-switch>. Continuing.
```

When you give up on an item due to repeated staleness or a soft block, log it under `research_limitation` / `browser_limitation` and skip to the next queued item — do not pause to ask the user unless the command is in interactive mode and the entire session is blocked.
