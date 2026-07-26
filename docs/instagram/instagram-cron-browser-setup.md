# Instagram Cron ↔ Chrome Profile Setup (Canonical Mapping)

_Created 2026-07-26 after the account-switching investigation. This is the machine-level source of truth for which Instagram account lives in which Chrome profile and which cron job drives it. The warmup commands in all three repos reference this file._

## Root cause this architecture fixes

Through July 2026, all three daily Instagram warmups ran in **one shared Chrome profile** holding four Instagram accounts (`dj_pew_pew`, `9takesdotcom`, `djwayne3`, `build.os`). Each morning the jobs forced 2–3 account switches in that one cookie jar. Instagram treats this churn as suspicious: accounts got **evicted from the switch-accounts picker entirely** (not just logged out), requiring full password re-login that no agent can perform. Result: 20+ blocked 9takes runs in 23 days; @djwayne3 logged out since ~07-20.

Separately, the OpenClaw cron jobs used **agentTurn payloads** (an LLM wrapper interpreting "Execute in terminal: …"). The wrapper killed the claude process ~5 minutes in (real warmups take 20–40 min) and then re-announced **stale summaries from the shared append-log** as fresh "COMPLETED" results — so Telegram reported success on days that were actually blocked or dead. Same disease `nightly-blog-cron.sh` was built to cure (13/18 overnight failures).

**The fix, in two halves:**

1. **One Chrome profile per Instagram account.** No account ever switches again; agents only verify.
2. **Deterministic command-payload cron jobs** running `scripts/instagram-warmup-cron.sh` in each repo — truthful exit codes, per-day logs, 45-min timeouts, 1-hour spacing.

## The mapping

| Brand   | IG account      | Chrome profile dir | Profile display name   | Cron job (OpenClaw)       | Schedule (ET) | Wrapper script                                              | Telegram        |
| ------- | --------------- | ------------------ | ---------------------- | ------------------------- | ------------- | ----------------------------------------------------------- | --------------- |
| 9takes  | `@9takesdotcom` | `Profile 2`        | "9takes.com"           | 9takes Instagram Warmup   | 8:00 daily    | `/Users/djwayne/9takes/scripts/instagram-warmup-cron.sh`    | -1003724832638  |
| BuildOS | `@djwayne3`     | `Default`          | "djwayne35"            | BuildOS Instagram Warmup  | 9:00 daily    | `/Users/djwayne/buildos-platform/scripts/instagram-warmup-cron.sh` | -1003985535162  |
| Cadre   | `@dj_pew_pew`   | `Profile 5`        | "thecadretraining.com" | The Cadre Instagram Warmup| 10:00 daily   | `/Users/djwayne/thecadre/scripts/instagram-warmup-cron.sh`  | -1003920049308  |

**BuildOS is the sanctioned exception to one-account-per-profile** (DJ's call, 2026-07-26): it runs in `Default` ("djwayne35") — DJ's main profile, shared with his personal Instagram accounts — because the Claude extension is already installed there. The warmup may switch to `@djwayne3` *within that profile*; if @djwayne3's session proves flaky there (same eviction pattern as before), the fallback is moving it to a dedicated profile.

Other profiles on this machine: `Profile 1` ("djwayne3"), `Profile 3` (also "9takes.com"), and `Profile 4` (also "thecadretraining.com") are unused; 9takes and Cadre automation stays OUT of `Default`.

## One-time setup checklist (DJ — ~10 min, only you can do this)

The cron jobs will stay blocked with a `🔑 ACTION NEEDED` Telegram message until this is done, once per profile:

**Profile 2 — "9takes.com"** (Claude extension already installed ✓)
1. Open Chrome → profile switcher → "9takes.com".
2. Click the Claude extension icon → confirm it's signed in; allow `instagram.com` in its site permissions.
3. Go to instagram.com → log in as `@9takesdotcom` → **check "Save login info"**.

**Default — "djwayne35"** (Claude extension already installed ✓ — this is DJ's main profile)
1. Open Chrome → profile switcher → "djwayne35".
2. Click the Claude extension icon → confirm it's signed in; allow `instagram.com` in its site permissions.
3. Go to instagram.com → log in as `@djwayne3` → **check "Save login info"**. (@djwayne3 dropped out of this profile's account picker on 2026-07-21, so it needs the full "Log into an Existing Account" path.)

**Profile 5 — "thecadretraining.com"** (Claude extension installed ✓ 2026-07-26)
1. Open Chrome → profile switcher → "thecadretraining.com".
2. Install the Claude extension, sign in, allow `instagram.com`.
3. Go to instagram.com → log in as `@dj_pew_pew` → **check "Save login info"**. (Add `@thecadre.training` as a second saved account in THIS profile if brand-account actions are ever needed — that's the one sanctioned two-account profile.)

**Optional but recommended:** in each profile, run one interactive `claude --chrome` session from the matching repo and let the extension's connect prompt name the browser ("9takes", "djwayne35", "Cadre"). Named browsers make `select_browser` matching unambiguous — the BuildOS command looks for a name containing `djwayne35`.

**Hygiene:** don't log the brand accounts into other desktop browsers/profiles; phone apps are fine. Multi-desktop sessions are the leading suspect for the "evicted from picker" flapping.

## How a nightly run works now

1. OpenClaw fires the job (command payload, `timeoutSeconds` 2700, no agent wrapper).
2. The wrapper script opens the brand's Chrome profile window (wakes the extension), then runs `claude --chrome --dangerously-skip-permissions "/instagram-warmup"` with output to `logs/instagram-warmup/warmup-YYYY-MM-DD.log` in that repo.
3. The `/instagram-warmup` command's Phase -1 selects the brand's browser via `list_connected_browsers`/`select_browser`, verifies the account (never switches), and runs — or emits the `🔑 ACTION NEEDED` blocked summary.
4. The script prints a truthful status header + log tail to stdout; OpenClaw announces that to the brand's Telegram group. Nonzero exit = job status error (no more false "COMPLETED"s).

## Troubleshooting

- **"claude exited 0 but produced no output"** → the profile's Chrome window wasn't open or the extension wasn't connected. Open the profile, check the extension, re-run: `openclaw cron run --id <jobId>`.
- **`browser_limitation: *_chrome_profile_not_connected`** → extension not installed/signed-in in that profile, or the profile window is closed.
- **`browser_limitation: instagram_session_logged_out`** → re-login in that profile with "Save login info" checked.
- Job IDs: 9takes `4c57e65b…`, BuildOS `167b60db…`, Cadre `3e4ec512…` — `openclaw cron list` for status, `openclaw cron runs --id <id>` for history.
