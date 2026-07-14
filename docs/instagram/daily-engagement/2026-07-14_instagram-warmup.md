<!-- docs/instagram/daily-engagement/2026-07-14_instagram-warmup.md -->

# Instagram Warmup - July 14, 2026

**Date:** 2026-07-14
**Account:** @9takesdotcom
**Scan Time:** Morning
**Status:** BLOCKED — `browser_limitation: instagram_account_not_in_picker`. No scanning performed. Not ready for /instagram-reply.

---

## Blocker

The @9takesdotcom Instagram session is **evicted from the shared Chrome profile again**. On load the active account was **`dj_pew_pew`** (DJ Wayne, personal). The "Switch accounts" picker exposes only three accounts and @9takesdotcom is not among them:

- `dj_pew_pew` (active on load today — checkmark)
- `djwayne3`
- `build.os`

No `@9takesdotcom` row is available (verified via screenshot of the "Switch accounts" dialog — the only entries were `dj_pew_pew / djwayne3 / build.os / Log into an Existing Account`; `9takesdotcom` appears nowhere). Warmup cannot proceed: notifications, stories, feed, ponds, profiles, and Filter-B saves all require being signed in as @9takesdotcom, and agents are prohibited from entering the password to re-authenticate.

This is the recurring eviction pattern documented in memory `[[instagram-session-eviction]]`. Note vs. prior observations: **the active account on load today was `dj_pew_pew`** (same as 07-12; 07-13 loaded on `build.os`, 07-11 loaded on `djwayne3`), and the picker's third slot today shows `build.os` (07-13 had shown the numeric `4109800852`). The roster churns between `build.os` / `dj_pew_pew` / `4109800852` in the active/third slots, but the constant across every blocked morning is unchanged: **only the @9takesdotcom cookie is ever the one missing.**

### What DJ needs to do (only DJ can)

1. Open Instagram → profile menu → **Switch accounts → "Log into an Existing Account"**.
2. Sign in as **@9takesdotcom** (each manual re-login has historically held ~24h).
3. Re-run `/instagram-warmup` the **same day** while the session is live.

**Durable fix (still open — this is the bottleneck for the whole IG engagement loop):** give @9takesdotcom its own dedicated Chrome profile/browser, isolated from `dj_pew_pew` / `djwayne3` / `build.os` / `4109800852`, and audit which other device (phone app? other laptop?) keeps re-claiming the login and bumping this session daily. As long as @9takesdotcom shares a profile with these accounts, it will keep getting evicted.

---

## Browser Notes

- 09:xx — Created fresh tab, navigated to instagram.com. Active account on load = `dj_pew_pew` (verified via two signals: right-sidebar widget text `dj_pew_pew / DJ Wayne!` + the "Switch" affordance next to it), not @9takesdotcom.
- 09:xx — Clicked "Switch" → opened Switch accounts picker. Enumerated via screenshot: only `dj_pew_pew` (checkmarked/active), `djwayne3`, `build.os`, plus "Log into an Existing Account". `@9takesdotcom` absent. Logged `browser_limitation: instagram_account_not_in_picker`. Did **not** attempt password entry (prohibited). Closed the dialog (X button). Stopped scan. No engagement, saves, or profile edits performed under the wrong account.

---

## Phases Completed

- Phase 0 (create doc): ✅
- Phase 1 (load context): ✅ — read cluster map, engagement strategy, recent warmup history (07-04 last live, 07-13 last blocked).
- Phase 1b (set this week's pond): ⏸ staged below for the next live run.
- Phases 2–7 (scan / queue / saves): ❌ blocked, not attempted.

## This Week's Pond (staged for the next live run)

Could not re-confirm the active arc post (blocked at the picker before any scanning of the @9takesdotcom grid). Chappell Roan / Type 8 was last confirmed live 2026-07-04. Per `personality-series-engagement-strategy.md` Current Arc, if Robert Greene / Type 5 or Pedro Pascal / Type 6 has shipped since, re-lock the pond next live session. Until confirmed, default to the three evergreen giant ponds:

- **Anxiety / overthinking — Type 6** (`#anxiety #anxiousattachment #overthinking #nervoussystem`)
- **People-pleasing / narcissist-survivor — Type 2** (`#peoplepleaser #boundaries #codependency #empath`)
- **ADHD / dopamine — Type 7** (`#adhd #adhdbrain #dopamine #fomo`)

`active_pond: undetermined — defaulted to evergreen`

Bridges live for all three even without a fresh celebrity post: Type 2 → `/personality-analysis/type/2` or `enneagram-corner/enneagram-type-2`; Type 6 → Pedro Pascal analysis / `type/6`; Type 7 → Kai Cenat analysis / `type/7`; Type 8 → `/personality-analysis/chappell-roan`.

**Carry-over intent for the next live warmup (unchanged from 07-04 → 07-13):**

1. Re-confirm arc post status on the @9takesdotcom grid (Chappell Roan / Type 8 was live 07-04; re-lock the pond if a newer post shipped).
2. **Clear the OWED @enneagrampaths candy reply-to-reply (p/DZkjlfNm-AF)** — Melissa's "how dare you read me (5)" reply has now been unanswered for 5+ weeks across 11+ sessions. Single most damaging open relationship item; verify live and post one of the existing 6/19 drafts first thing.
3. Reliable fresh-pond surface = warm-creator profiles (enneagrampaths, candice, alignedsoulco) + mining their comment threads; hashtag Top-grids and the home feed have been serving stale content.
4. Type-2 and Type-9 evergreen ponds remain the safest high-volume fallback when the arc pond is thin.

---

## Notifications & Stories Activity

**Notifications Checked:** No — blocked before scan.
**Stories Active From:** Not scanned.
**Feed Highlights:** Not scanned.
**Relationship Signals:** Not scanned.

## Priority Summary

None — scan blocked before sourcing.

## Post Opportunities

None.

## Reply Queue

Empty — nothing queued. `/instagram-reply` should not run against this doc.

## Profiles Created or Updated

None.

## New Accounts Discovered

None.

## Saves Captured

None (Phase 7 not reached).

## Hashtag Performance

Not scanned.

---

## Strategy Observations

- **The blocked state is now ~12 of the last 15 mornings** (06-30, 07-02, 07-03, 07-06, 07-07, 07-08, 07-09, 07-10, 07-11, 07-12, 07-13, and now 07-14). Live sessions in the same window: 07-01 and 07-04 only. The signature is identical every time — only the @9takesdotcom cookie is evicted while `dj_pew_pew` / `djwayne3` / `build.os` / `4109800852` persist and rotate through the "active on load" and third slots. Each manual re-login (07-01, 07-04) bought ~24h of access.
- **The "another session/device is re-claiming the login daily" theory remains the best fit** — nothing on the browser side changes between blocked and live days; the eviction is server-side.
- **Durable fix (escalating — this is the whole-loop bottleneck):**
  1. A **dedicated Chrome profile (or separate browser) for @9takesdotcom only**, isolated from the personal/build.os accounts.
  2. **Audit other devices:** check whether the Instagram app on the phone (or another laptop) is signed into @9takesdotcom and re-claiming the session each day. If so, either run warmup on that device's schedule or log the account out there.
- **Immediate ask for DJ:** Instagram in this Chrome profile → account switcher → **"Log into an Existing Account"** → sign in as **9takesdotcom** → re-run `/instagram-warmup` the same day (the window lasts ~24h).

---

**Created:** 2026-07-14 (morning)
**Stage 1 Status:** Blocked — awaiting @9takesdotcom re-login by DJ.
**Reply Command Status:** N/A (nothing queued)
