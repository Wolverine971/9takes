<!-- docs/instagram/daily-engagement/2026-07-12_instagram-warmup.md -->

# Instagram Warmup - July 12, 2026

**Date:** 2026-07-12
**Account:** @9takesdotcom
**Scan Time:** Morning
**Status:** BLOCKED — `browser_limitation: instagram_account_not_in_picker`

---

## Blocker

The @9takesdotcom Instagram session is **evicted from the shared Chrome profile again**. The "Switch accounts" picker exposes only three accounts and @9takesdotcom is not among them:

- `dj_pew_pew` (DJ Wayne! — active on load today)
- `djwayne3`
- `build.os`

No `@9takesdotcom` row is available. Warmup cannot proceed: notifications, stories, feed, ponds, profiles, and Filter-B saves all require being signed in as @9takesdotcom, and agents are prohibited from entering the password to re-authenticate.

This is the recurring eviction pattern documented in memory `[[instagram-session-eviction]]` — warmup has now been blocked on the large majority of recent mornings. Note vs. prior observation: the active account on load today was `dj_pew_pew` and the picker set is `dj_pew_pew / djwayne3 / build.os` (previously the numeric `4109800852` appeared instead of `dj_pew_pew`); still no 9takesdotcom either way.

### What DJ needs to do (only DJ can)

1. Open Instagram → profile menu → **Switch accounts → "Log into an Existing Account"**.
2. Sign in as **@9takesdotcom** (each manual re-login has historically held ~24h).
3. Re-run `/instagram-warmup` the **same day** while the session is live.

**Durable fix (still open):** give @9takesdotcom its own dedicated Chrome profile/browser and audit which other device keeps claiming the login and bumping this session. As long as @9takesdotcom shares a profile with dj_pew_pew / djwayne3 / build.os, it will keep getting evicted.

---

## Browser Notes

- 08:xx — Navigated to instagram.com. Active account on load = `dj_pew_pew` (personal, OSINT/military feed), not @9takesdotcom.
- 08:xx — Opened Switch accounts picker. Enumerated via screenshot + DOM: only `dj_pew_pew`, `djwayne3`, `build.os`. `@9takesdotcom` absent. Logged `browser_limitation: instagram_account_not_in_picker`. Did not attempt password entry (prohibited). Stopped scan.

---

## Phases Completed

- Phase 0 (create doc): ✅
- Phase 1 (load context): ✅ — read cluster map, engagement strategy, profiles README, recent warmup history.
- Phase 1b (set this week's pond): ⏸ recorded below for the next live run.
- Phases 2–7 (scan / queue / saves): ❌ blocked, not attempted.

## This Week's Pond (staged for the next live run)

Per `personality-series-engagement-strategy.md` Current Arc, no single post is unambiguously flagged for the week of 2026-07-12, so default to the three evergreen giant ponds until the active post is confirmed:

- **Anxiety / overthinking — Type 6** (`#anxiety #anxiousattachment #overthinking #nervoussystem`)
- **People-pleasing / narcissist-survivor — Type 2** (`#peoplepleaser #boundaries #codependency #empath`)
- **ADHD / dopamine — Type 7** (`#adhd #adhdbrain #dopamine #fomo`)

`active_pond: undetermined — defaulted to evergreen`

Bridges live for all three even without a fresh celebrity post: Type 2 → `/personality-analysis/type/2` or `enneagram-corner/enneagram-type-2`; Type 6 → Pedro Pascal analysis / `type/6`; Type 7 → Kai Cenat analysis / `type/7`.

---

**Created:** 2026-07-12
**Stage 1 Status:** Blocked — awaiting @9takesdotcom re-login by DJ.
**Reply Command Status:** N/A (nothing queued)
