<!-- docs/taskers/T-09-refresh-gsc-data-window.md -->

# Tasker: Refresh the GSC Data Window (Blocker for T-04 / T-05 / T-07)

**For:** the agent (or DJ) pulling a clean Google Search Console window for 9takes.com.
**Owner:** DJ
**Created:** 2026-07-15
**Status:** Not started. Blocks T-04, T-05, T-07.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §8 item 12, §9.2; taskers T-04 (astrology), T-05 (compatibility matrix), T-07 (merge plan).

---

## 0. What and why

**This is a dependency, not housekeeping. Do this before T-04, T-05, or T-07 act on GSC numbers.**

The current window is stale, but staleness is not the problem. **The window is contaminated.**

Commit `74ae2440` (2026-05-04) added a 301 in `src/routes/enneagram-corner/[slug]/+page.ts` that sends flat `/enneagram-corner/<slug>` URLs to `/enneagram-corner/mental-health/<slug>` whenever the resolved file lives under `/mental-health/`. The current window **straddles that fix**, so the CSVs carry rows for both the flat and the subdirectory URL of the same article, splitting one article's metrics across two rows for a reason that no longer applies.

Verified from `docs/data/gsc/2026-07-06-pages.csv`:

| URL                                                                  | Clicks | Impressions | Pos  |
| -------------------------------------------------------------------- | ------ | ----------- | ---- |
| `/enneagram-corner/enneagram-addiction-recovery-guide`               | 18     | 1,271       | 7.7  |
| `/enneagram-corner/mental-health/enneagram-addiction-recovery-guide` | 18     | 1,627       | 8.5  |
| `/enneagram-corner/enneagram-crisis-management-guide`                | 7      | 523         | 8.5  |
| `/enneagram-corner/mental-health/enneagram-crisis-management-guide`  | 3      | 339         | 10.3 |
| `/enneagram-corner/enneagram-anxiety-complete-guide`                 | 3      | 849         | 11.2 |
| `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide`   | 4      | 877         | 11.7 |

Only **one** file exists on disk per article. Addiction-recovery alone is 36 clicks and 2,898 impressions reported as two weaker pages.

**The proof the fix works:** `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` (141 clicks, 4,977 impressions, 2.83% CTR) has **zero** flat-URL rows. It grew after the fix. That asymmetry says the redirect is working and the data is simply mid-transition.

**Consequence:** every mental-health cluster comparison in the 2026-07-15 audit rests on split rows and therefore **understates** those pages. The mental-health cluster is the best-performing content on the site, so the contamination understates exactly what matters most. T-07 decides which pages get 301'd; doing that on this data risks 301-ing a page whose real numbers are better than they look.

---

## 1. The mechanism (verified 2026-07-15, not guessed)

**Script:** `scripts/fetch-gsc-data.mjs` (exists; no `pnpm` alias, invoke with `node`).

**Auth:** Google **service account** `id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com`, scope `webmasters.readonly`. The key is read from `PRIVATE_gmail_private_key` (env, else `.env.local`, else `.env`). Both `.env` and `.env.local` contain the key locally. Dep `googleapis@^173.0.0` is in `package.json`. Property resolves to `sc-domain:9takes.com`.

**Invocation:**

```bash
node scripts/fetch-gsc-data.mjs --days 69
```

**Window math (the important constraint): the script has no start-date flag.** It computes `end = today - 2` (GSC lag) and `start = end - days`. Run on **2026-07-15**: `end = 2026-07-13`, and `--days 69` yields `start = 2026-05-05`, the day after the redirect fix. **69 is the maximum clean window today.** Anything larger reintroduces contamination. If the run slips a day, add one day to `--days` to hold the same start.

**Output** (stamped with the **run date**, not the window):

- `docs/data/gsc/YYYY-MM-DD-queries.csv` (top 1000 queries)
- `docs/data/gsc/YYYY-MM-DD-pages.csv` (top 1000 pages)
- `docs/data/gsc/YYYY-MM-DD-page-query.csv` (top 5000 page+query pairs)
- `docs/data/gsc/latest.json` (pointer + window metadata; **this file is overwritten**, by design)

Because filenames are run-date stamped, a run today lands as `2026-07-15-*` **alongside** the existing sets. Nothing is clobbered.

**Ground-truth note:** `latest.json` records the current window as **2026-04-05 to 2026-07-04** (runDate 2026-07-06, 90 days). The audit's "Apr 7 to Jul 6" framing is slightly off; use `latest.json`.

---

## 2. Steps

1. Confirm today's date and recompute `--days` so `start >= 2026-05-05`. On 2026-07-15 that is `--days 69`.
2. Run `node scripts/fetch-gsc-data.mjs --days 69` from the repo root.
3. Read the printed window line and confirm it says `from 2026-05-05` (or later). If it does not, stop and fix the day math.
4. Confirm `latest.json` now points at the new files and its `window.startDate` is on or after 2026-05-05.
5. Grep the new pages CSV for flat mental-health URLs (see §3). Expect zero or negligible residual.
6. Re-derive the CTR ceiling (§4) and record it.
7. Report the new window to T-04, T-05, and T-07 so they rebaseline.

**If auth fails**, the script prints an explicit "no access" error listing what the service account can see. Do not attempt to work around missing credentials, do not swap auth methods, and do not hand-build CSVs. Report the error verbatim. DJ can run the fetch himself by typing `! node scripts/fetch-gsc-data.mjs --days 69` in the session so the output lands in context. A manual GSC UI export (Performance → Export → CSV, saved as `YYYY-MM-DD-pages.csv` etc.) is the documented fallback.

---

## 3. The trade-off, stated plainly

A 69-day window is shorter than the 90-day window it replaces. **Absolute clicks and impressions will be smaller.** That is a fair trade: uncontaminated rows beat larger contaminated ones, and no decision in T-04/T-05/T-07 depends on absolute volume rather than relative standing. Do not "fix" the smaller numbers by widening `--days` back toward 90.

Residual check for step 5:

```bash
grep -E "9takes\.com/enneagram-corner/enneagram-(addiction-recovery|anxiety-complete|crisis-management)" \
  docs/data/gsc/2026-07-15-pages.csv
```

Some residual flat-URL rows are expected (Google reports the URL that was live at click time, and the window opens the day after the fix). Judge by magnitude: if flat rows are now a small fraction of their subdirectory counterparts, the transition is settled and the data is usable. If flat rows are still near parity, the redirect is not being honored in production and that is a **new finding to escalate**, not a data problem.

---

## 4. Re-derive the CTR ceiling

The audit's **2.40% CTR ceiling** is the constant behind every click estimate in T-04 and T-05. It was bracketed by two pages in the old window:

- `enneagram-and-mental-illness` at 2.35% (pos 8.2)
- `enneagram-neurodivergence-guide` at 2.83% (pos 7.3)

Also worth flagging: 9takes has **no non-brand data at position 3**, so the ceiling is an extrapolation from position 7 to 8, not a measurement.

Re-derive the ceiling from the new CSVs rather than assuming it carries over. Record the observed CTR of both bracket pages and any newcomer above them. **If the ceiling moved, the T-04 and T-05 estimates move with it** and both taskers must be told.

---

## 5. Verification checklist

- [ ] `docs/data/gsc/2026-07-15-pages.csv`, `-queries.csv`, and `-page-query.csv` exist and are non-empty
- [ ] `latest.json` `window.startDate` is on or after **2026-05-05** and `window.endDate` is today minus 2
- [ ] `latest.json` `files` block points at the new run-date-stamped filenames
- [ ] Flat `/enneagram-corner/<mental-health-slug>` rows are **gone or negligible** relative to their `/mental-health/` counterparts (§3)
- [ ] `2026-06-11-*` and `2026-07-06-*` CSVs are **byte-for-byte intact** (`git status` shows them unmodified)
- [ ] The 2.40% CTR ceiling is re-derived from the new window and either **confirmed or corrected**, with the new figure written down
- [ ] T-04, T-05, and T-07 notified of the new window and the ceiling result

---

## 6. Constraints

- **Do not overwrite or delete** the `2026-06-11-*` and `2026-07-06-*` CSVs. They are the trend baseline and the only record of the pre-fix window. The date-stamped naming means a new pull lands alongside them automatically; the only file that changes is `latest.json`, which is a pointer.
- **Do not run the fetch twice on the same day** expecting two windows. The run-date filename would overwrite the first pull.
- **Other agents and DJ edit this repo in parallel.** No `git stash`, no bulk operations, no wide resets.
- **Do not invent auth.** If credentials fail, report and hand back to DJ (§2).
- **Scope guard.** This tasker refreshes data. It does not act on the data, re-run the audit, or touch any page. Findings that fall out of the pull go to the owning tasker.

---

## 7. Definition of done

- [ ] Clean post-2026-05-05 window pulled; all three CSVs and `latest.json` written
- [ ] Contamination confirmed cleared (or escalated if the redirect is not holding in production)
- [ ] Old CSVs untouched
- [ ] CTR ceiling re-derived and recorded
- [ ] T-04, T-05, T-07 unblocked and notified
