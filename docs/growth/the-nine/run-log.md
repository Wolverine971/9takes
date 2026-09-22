<!-- docs/growth/the-nine/run-log.md -->

# The Nine — run log

Append-only. Never overwrite a previous entry or snapshot; add a new dated one below.
Newest entries at the top.

---

## 2026-09-22 — Readiness review: corrections to the baseline below

- **Reddit API:** the "create a script app" setup step no longer exists. New credentials need manual approval under Reddit's Responsible Builder Policy (since Nov 2025). Threads get found by hand (Controversial → Today) until access exists.
- **Correction to the baseline's "zero posts" line:** a linked r/alphaandbetausers test ran on 2026-08-31 (`utm_campaign=alpha_beta_answer_first_20260831`). It brought ~8 real visitors to one question page and 2 low-effort takes (7 and 24 characters).
- **Safety filter fixed:** it missed uppercase ages ("(16F)", "(17M)", "(F16)"), "I am 15", "my husband hit me", and "abusive". The spec now has 26 tests, all passing.
- **Success query fixed:** the referrer SQL errored (no `referrer` column). It is replaced by `scorecard.sql`, which counts tagged-bio-link visitors and their takes and excludes admins. Reddit baseline: ~20 visitors a month before this playbook.
- **Account:** DJ has an existing Reddit account, not yet active in these subs. The first 14 days are warm-up.
- **Open:** lean vs ambitious bridge fork (HANDOFF §5), awaiting DJ.

---

## 2026-09-22 — Baseline before anything ships

- **Production baseline** (queried this date, `scripts/db-query.sh`):
  - 422 questions; 57 with any human comment; 365 empty
  - 358 comments all time; 24 in the last 30 days
  - 161 profiles; 6 new in the last 30 days
  - 18 coaching-waitlist rows
  - New unique visitors/week: 4,593 (Sep 14), 4,211 (Sep 7), 4,482 (Aug 31), 4,368 (Aug 24)
  - `/questions` visits in the last 30 days: 198
- **Channel baseline:** X @9takesdotcom at ~35 followers, 319 tweets, <1% engagement, dormant since May 2026. Reddit: zero posts published from the `reddit/` drafts.
- **Decisions locked:** weekly Nine format · unbranded participant on Reddit · Reddit first.
- **Shipped:** `scripts/find-threads.mjs` + spec (24 tests), `venues.json`, this playbook.
- **Not yet done:** Reddit script-app credentials, so the harness has never run against live Reddit. Verified end-to-end against a fixture and the real 410-question corpus only.
- **Next action:** create the unbranded account + script app, then `pnpm nine:find -- --refresh-corpus` and post one comment.

### Entry template

```markdown
## YYYY-MM-DD — <what happened>

- Action: <the one comment / the Monday post / the Friday artifact>
- Link: <permalink>
- Result: <score, replies, profile clicks>
- Takes produced: <number that landed on 9takes>
- Learning: <what changes next time>
```
