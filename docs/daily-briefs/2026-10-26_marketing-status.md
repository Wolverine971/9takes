<!-- docs/daily-briefs/2026-10-26_marketing-status.md -->

# 9takes Marketing Status — 2026-10-26 (Monday, unattended weekly brief)

**BLUF:** The new asks work, and search keeps rising. The bucket still has no bottom. This week's 7 contributors can't be reached because the surface that produced most of them collects nothing. The 7 older takes that do have an email behind them have waited weeks for a reply. Two DJ moves address the leak: reply to those 7 today, and approve a reply opt-in on celebrity pages. Separately, the people publisher has crashed at startup for 4 days. A ~5-minute Node pin fixes it and ships Sombr, which has been ready since 10-22.

## TL;DR

- **Growth data is fresh (audit 06:00 -> 06:08 today, exit 0; gate passed).** Headline, verbatim: _"record traffic (891 engaged humans) and the new asks worked (1 -> 7 takes, q118 158 -> 4), but all 7 contributors left unreachable, 0 got a reply within 24 h, and none came back."_
- **Biggest leak, verbatim: _"the return leg, not the ask."_** Returning contributors were 0 for a fifth straight week. 0 of 7 contributors left a way to be reached, and 0 of 7 got a reply within 24 h. DJ's one reply (to 760, at 47 h) went to an anonymous fingerprint that never came back. The celebrity `NineChorus` produced 4 of the 7 takes and has no opt-in or email capture.
- **Replies are blocked on DJ for the 5th straight audit.** The desk holds 21 pending and 1 posted lifetime (re-queried today). Seven pending takes have an email behind them: 733, 743 and 749 opted in; 746, 747, 748 and 754 were logged in. The digest alarm fix works (`alarm` true every day), but the outcome hasn't moved.
- **NEW: the people publisher has crashed at startup for 4 days (10-23 -> 10-26, exit 134).** On 10-22 a Homebrew upgrade moved `ada-url` to 4.0.0, which removed `libada.3.dylib`. OpenClaw's cached PATH still puts the broken `node/26.5.0` keg first. Sombr (8.3 Open Case) has passed the publish check since its portrait landed 10-22, and nothing has shipped it.
- **The content engine had its best week in a month.** 7 runs produced 4 passes. DJ published 3 pages by hand, taking the DB from 453 to 456: Josh Hartnett, Inde Navarrette and Ilya Sutskever. Dhar Mann passed this morning (8.6) and needs a portrait. The create queue is down to 3 subjects. Type 6 now accounts for 8 of 19 rows created since 10-01 (42%), against 12% of the live corpus.
- **Outreach moved, and social stays parked.**
  - The Enneagram Monthly package is built (docx plus a script-drawn chart, 10-20). Whether it was sent is unverified.
  - OliveMe, one of the five 10-06 sends, replied 10-22 and agreed to a listing. The listing is now committed on the top-traffic mental-illness guide.
  - Instagram, Quora, Twitter, The Nine and One Take remain parked.

## The actual work: close the return leg

The ask is fixed for now. q118 converts about 6x better than q567, and the homepage is back at the 10-05 level. Growth says to hold both unchanged through 11-01. What hasn't moved in five audits is what happens after someone posts.

| Artifact                                   | State (observed today unless noted)                                                                                                                              | Owner     | Next                                                                                            |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| Host desk (`host_reply_drafts`)            | 21 pending / 1 posted lifetime. One reply this week, outside the desk (764 -> 760 at 47 h); 760's draft still reads `pending`                                    | **DJ**    | Reply to the 7 reachable takes: 733, 743, 749 (opt-ins), then 746, 747, 748, 754 (logged in)    |
| Reply opt-in on the celebrity `NineChorus` | Does not exist. `NineChorus.svelte` produced 4 of 7 takes this week with 0 capture (growth)                                                                      | **DJ** go | Approve growth bet #2, lean or ambitious (Q2)                                                   |
| Reply opt-in tray (homepage, question pgs) | 3 opt-ins lifetime, 0 since 10-01, 0 notified. Whether it was shown is in PostHog only (not queried)                                                             | growth    | Query `reply_opt_in_shown` before reusing the tray as-is                                        |
| Celebrity q118                             | Week 1: 158 gate fps -> 4 takes (2.5%; q567 lifetime 0.43%). Count bar met, rate bar (3%) missed, kill rule not triggered                                        | growth    | Hold unchanged; decide 11-02. Fallback "your read on {person}" still lacks DJ pre-approval (Q3) |
| Homepage one-step v2                       | 28 engaged `/` humans -> 2 takes; bar met                                                                                                                        | growth    | Hold; decide 11-02                                                                              |
| Host digest backlog alarm                  | **Verified:** `alarm` true daily from 10-19, `olderPending` 16 -> 20                                                                                             | done      | The alarm reaches DJ; it doesn't produce replies. Q1 asks for a second replier                  |
| Signup 211 confirmation                    | Not resent (21 days)                                                                                                                                             | eng       | Delegable; fold into growth bet #3                                                              |
| Beta card (`beta_card_v1`)                 | 465 viewers -> 12 opened -> 0 submitted. 0 submits for 2 weeks; 1 of 10 toward 11-15 with 20 days left. `coaching_waitlist`: 0 new rows since 10-19 (last 10-08) | **DJ**    | Keep, change, or reset (Q8, 2nd ask)                                                            |

## Tooling state (changes only)

- **People publisher dead since 10-23 (new failure class).**
  - The 10-20 -> 10-22 runs reported "No publishable draft" (97 -> 99 candidates).
  - The 10-23 -> 10-26 runs died in 0 s: `dyld: Library not loaded: /opt/homebrew/opt/ada-url/lib/libada.3.dylib`, referenced from `/opt/homebrew/Cellar/node/26.5.0/bin/node`.
  - Cause chain (observed): on 10-22 at 12:27, Homebrew installed `ada-url` 4.0.0 (only `libada.4` now), moved `opt/node` to 26.12.1, and pointed `/opt/homebrew/bin/node` at `node@24` 24.22.1. That matches the 10-22 runtime-policy commit `0ee519d4a`. OpenClaw's cached shell snapshot (`~/.openclaw/cache/shell-snapshots/…`) exports a PATH with `/opt/homebrew/Cellar/node/26.5.0/bin` first.
  - Inferred: the 06:00 wrapper (`scripts/daily-blog-publisher.sh:19`, a bare `node`) inherits that PATH.
  - Interactive shells are fine. My read-only `--publish-check` calls ran on 24.22.1.
  - The OpenClaw gateway (pid 812, up since 10-07) holds an old binary in memory. Whether it comes back cleanly on restart is unverified.
- **Dependency and security work (10-20, 10-22):** dependabot bumps (vite 8.3.3, sanitize-html 2.18.0), vulnerable-dependency updates with scoped audit exceptions, the `safeExternalFetch` hardening, and a node-brotli security tasker.
- **v3 pipeline strain is unchanged.** The edit stage hit the 60-turn cap and resumed on 4 of 7 runs. Dhar Mann's verify hit the 100-turn cap and still passed.
- **Weekly Crosslinks (Thu 10-22): OK.** 12 links across 11 posts, gate debt 0 -> 0, 150 live posts, 0 broken. The edits were committed in `53326b8e4`.

## Cross-surface status

### Blogs

- **People DB:** 456 published / 147 unpublished (10-19: 453 / 146). All three publishes were by hand, which hid the dead publisher:
  - Josh Hartnett (6): 10-22 11:49, three minutes after the portrait commit.
  - Inde Navarrette (6): 10-22 14:47.
  - Ilya Sutskever (5): 10-25 15:38.
  - All three are in the sitemap.
- **Nightly v3 create, 7 of 7 nights ran, 4 passes (last week 1):**
  - 10-20 Paapa Essiedu (6): pass, 8.6. Portrait added 10-22. Now `editorial_v3:stale_or_invalid_release`.
  - 10-21 Sombr (3, Open Case): pass, 8.3. Portrait added 10-22. **`--publish-check`: eligible, no blockers.** Unpublished, not in the sitemap.
  - 10-22 Josh Hartnett (6): revise at 8.3, then repaired to 8.5 and passed. Published.
  - 10-23 Olivia Dean (2): `insufficient_evidence`, 8.2, Enneagram 7.5.
  - 10-24 Dan Ives (7): `insufficient_evidence`, 8.0, Enneagram 7.
  - 10-25 Kareem Rahma (7): `insufficient_evidence`, 8.1, Enneagram 7.5.
  - 10-26 Dhar Mann (3): pass, 8.6 (B+). Images only. The draft and run folder are untracked; I did not touch them.
- **Pattern in the three holds:** each fails the Enneagram floor the same way. The rival type (3 in two of them) "fails no specific, sourced discriminator." These are long-record subjects whose evidence is mostly promotional interviews. The gate is doing its job. The cost is that one in three nightly slots went to subjects that could not clear it.
- **Portrait-ready but release-stale:** Paapa Essiedu 8.6, Stella Lefty 8.4 and Ella Beatty 8.2 all got portraits in the 10-22 batch. All three now block on `editorial_v3:stale_or_invalid_release`. Inferred fix (memory): `--phase finalize`.
- **Christopher Abbott:** the portrait exists, but the failed 10-19 run has no `release.json`, so a rerun is needed.
- **Queue:** 3 subjects left (drew-afualo 68, quenlin-blackwell 66, amanda-seyfried 65), so it runs dry around 10-29 (inferred, one a night).
  - Held went from 10 to 13 (Olivia Dean, Dan Ives and Kareem Rahma added).
  - Dakota Johnson moved to `skipped` (resolves last week's Q3).
- **Type 6 skew (counts observed; whether it's bias is unestablished):**
  - 8 of 19 rows created since 10-01 are typed 6 (42%; last week 5 of 15). The live corpus is 56 of 456 (12%).
  - This week's pipeline typings ran 2 of 7.
  - 2 of the 3 hand publishes were 6s, and the 10-22 portrait batch put 10 portraits in `static/types/6s/`.
- **MDsvex:**
  - Pop-culture: 20 not live (17 `published: false` + 3 flagless), unchanged. The oldest, `aoc-and-the-squad`, was 308 days last week.
  - Enneagram: 10 unpublished. Guides: 2. Community: 1.
  - 10-19 accuracy pass (`b88aa3d91`) on six enneagram posts, including depression, parenting, careers, relationships and wings. The depression QuickAnswer was then restored to a direct answer 10-25 (`9b6890bc7`) after the Soft 404 finding.
  - The top-traffic `enneagram-and-mental-illness` guide got the OliveMe listing 10-23 (light-touch, 8 lines).

### Distribution and social

- **Parked:** Instagram, Quora, Twitter, The Nine and One Take.
  - Queue check today: RED, 0/10 approved; 11/15 copy-ready; 2 design-ready.
  - Last Instagram session 08-07. Quora logs end 05-19. No Twitter activity in git.
- **Distribution packets:** 10 unfired, unchanged. The newest is the be-gentle promo set (10-04).

### SEO

- **Fresh this week:**
  - GSC 90-day pull 10-19 (window to 10-17).
  - Growth's 10-25 API pull and readout (T-41 A, now closed): the September spam update did not hit celebrity pages. Clicks per day after it are up 28%. 0 of 433 inspected pages are noindex.
- **3 Soft 404s.** The one that matters is `/enneagram-corner/depression-patterns-by-enneagram-type`: 27 clicks and 4,389 impressions in 30 days. Its QuickAnswer was fixed and shipped 10-25, and Request Indexing was submitted for all three. Re-inspect after 11-01.
- **Due ~11-01:** the Jordi Hays identity-first title snippet/CTR read (memory, entity-gap scout 10-04).

### Growth

- Folded from today's audit (not re-derived):
  - Engaged humans 891 (47 returning), both 26-week highs. Google-referred engaged entries 498 (+29%).
  - Gate -> take: celebrity 158 -> 4, home 57 -> 2, question pages 11 -> 1, blog embeds 15 -> 0. Gate -> take median ~1.6 min.
  - Signups 1 (213, Google -> Shawn Ryan page). Registrations 0, bookings 0.
- Growth's 10-26 bets:
  1. Reply to the 7 reachable takes.
  2. A celebrity opt-in (needs DJ's go).
  3. Hold q118 and homepage v2 through 11-01, decide 11-02, and resend 211.
- 10-19 bets: #1 (read q118) done. #2 (replies) not done. #3 half done (DB yes, PostHog no, 211 not resent).

### Outreach

- **Enneagram Monthly:** the full package exists in `docs/outreach/enneagram-monthly/`.
  - Contents: md source, docx (10-20), Figure 1 drawn by `make-chart.py` (a plotting script, not an image model), and a dated 453-profile snapshot. Committed 10-21.
  - Send status is not recorded in the repo, and Gmail was not inspected.
- **OliveMe Counseling (first reply from the 10-06 batch):** Joanne replied 10-22. She agreed to the listing (California-only therapy) but not to an interview or a reciprocal link. The listing was committed 10-23 and pushed. `docs/outreach/2026-10-23-oliveme-counseling.md` still says "not deployed"; live status is unverified. The doc proposes a 20–30 minute informational call (DJ's choice).
- The 10 other 10-06 drafts were still unsent as of 10-19 (memory). Current status is unverified.

### Email and coaching

- Mail is healthy: 1 send this week (213's confirmation, delivered), 0 welcome sends, and 0 active welcome enrollments because there were 0 registrations. 211 has not been resent.
- No commits this week touched `src/lib/email`, `src/routes/book-session` or the cron routes.
- `coaching_waitlist`: 19 rows total, 0 since 10-19, last 10-08.

## What changed since last brief

- **10-19 recommendations:**
  - #1 desk replies: **not done** (5th audit). One reply went to 760, which was none of the four named.
  - #2 q118 fallback pre-approval: **no answer on record**. Growth now asks for it for the 11-02 decision.
  - #3 Enneagram Monthly: **drafted and packaged** (10-19/20). Sending is unverified.
  - "Next in line," the Ilya Sutskever portrait: **done**, published 10-25.
- **10-19 questions resolved:**
  - Q3: Dakota Johnson moved to `skipped`.
  - Q6: the draft is written, and the chart came from a plotting script that DJ committed. That's an inferred acceptance of chart-by-script.
  - Q7: Ilya is live. Ella Beatty and Stella Lefty got portraits but remain release-stale.
- **Q4 (Type 6 calibration) and Q5 (beta card) were not answered.**
- **Experiments:** q118 week 1 passed the count bar. The homepage v2 bar was met. The digest alarm fix was verified. The beta card went another week at 0.
- **Content:** DB 453 -> 456. v3 passes went from 1 of 7 to 4 of 7. Held went from 10 to 13. The publisher went from "no publishable draft" to crashing at startup.
- **SEO:** T-41 A closed (no hit, 0 noindex). 3 Soft 404s were found, and the depression page's QuickAnswer was fixed.
- **Outreach:** the first reply from the 10-06 batch (OliveMe), now listed on site.
- **Commits:** 18 since 10-19, all pushed (`main` = `origin/main` at `9b6890bc7`). Most carry the message "updates."

## Recommendation

**1. Reply today to the 7 takes that can be reached.** About 15 minutes of DJ time. Expected impact: the first opt-in notification ever served, and the only path left to a returning contributor. The last loop turn on record followed a DJ reply. Visible risk: none.

- **What:** reply to 749, 743 and 733 (email opt-ins), then 754, 746, 747 and 748 (logged in), from `/admin/host-desk`. 733 has no desk row, so reply on its question page.
- **Why:** this is growth's bet #1 and has been the top unexecuted bet for five audits. This week's 7 new contributors can't be reached at all, so these are the only people a reply can reach.
- **Success (growth):** >=1 opt-in notified by 10-27, and >=1 of these people visiting within 7 days.
- **First step:** start with 749. Afterwards, check `email_sends` to confirm whether logged-in authors get a reply email (unverified).

**2. Approve a reply opt-in on celebrity pages (growth bet #2).** About 1 minute to decide. An agent builds it (~1–2 h), and DJ reviews the diff. Expected impact: celebrity pages now supply most takes, and every one of them is currently unreachable by design. Visible risk: the opt-in might depress posting. Growth's guardrail is that celebrity gate -> take stays >=2.5%.

- **Lean:** reuse `ReplyOptInTray` as-is. It has 0 opt-ins from 9 takes on other surfaces since 10-01. Whether it was even shown is unqueried, so the lean version starts with a weak record.
- **Ambitious (my pick):** make the email a give-first payoff, shown at the reveal: "We'll send you the full chorus when all nine types have answered your three words."
- **Why now:** the opt-in sits after the post, so it doesn't change the q118 ask that growth wants held through 11-01.
- **First step:** answer Q2. Then delegate the build, and have `growth-analyst` own the 2-week read (success: >=25% of celebrity contributors opt in).

**3. Pin the publisher to Node 24 (eng, ~5 minutes, delegable).** Expected impact: the next 06:00 run publishes Sombr, the only eligible draft, and the auto-publish valve reopens for the three release-stale pages once they're refreshed. Visible risk: low. The same command already works on 24.22.1.

- **What:** in `scripts/daily-blog-publisher.sh`, replace the bare `node` with `/opt/homebrew/opt/node@24/bin/node`, or put that directory first on PATH. Then refresh OpenClaw's shell snapshot so other jobs stop resolving the broken 26.5.0 keg.
- **Why:** this "publisher Node pin" item has been carried for six briefs. It has escalated from `gen:all` dying after a publish to the publisher never starting.
- **First step:** answer Q4. This is a `scripts/` change, outside the PM's surface.

**Next in line, about 10 minutes of DJ time each:**

- A Dhar Mann portrait (8.6, images-only) in ChatGPT, then `scripts/prepare-personality-image.sh`.
- `--phase finalize` release refreshes for Paapa Essiedu, Stella Lefty and Ella Beatty (inferred fix).
- Send the Enneagram Monthly package if it hasn't gone.

## Open questions for DJ

1. **Replies:** will you clear the 7 reachable takes today? If a daily reply slot won't hold, who else can reply in your voice? (Automatic replies stay off.)
2. **Celebrity opt-in:** may an agent build it? Lean (reuse the tray) or ambitious (the "full chorus" email at the reveal)?
3. **q118 fallback, 3rd ask:** if q118 gets fewer than 3 celebrity contributors this week, may it swap to "your read on {person}" on 11-02 without another check-in?
4. **Publisher Node pin:** may an agent change `daily-blog-publisher.sh` to call Node 24 and refresh the OpenClaw shell snapshot?
5. **Enneagram Monthly:** has the package gone to Jack Labanauskas? If not, is it waiting on your review or just on the send?
6. **Release refreshes and portrait:** may Paapa Essiedu, Stella Lefty and Ella Beatty get `--phase finalize` refreshes? Do you want a portrait prompt for Dhar Mann? (Per your rule, I write the prompt; you generate the image.)
7. **Create queue:** 3 subjects left (dry ~10-29) and 13 held. Refill with a scout run, or point the nightly slots at held reruns? Memory says finishing, not finding, is the bottleneck. A Type 6 calibration check (3rd ask) could ride along with either.
8. **Beta card, 2nd ask:** 1 of 10 with 20 days left, and 0 submits for two weeks. Keep it, change the card, or reset the goal?

Standing and parked unless you say otherwise:

- Instagram, Quora, Twitter, The Nine, One Take.
- Perspective-review backfill (70).
- Typing calls: Dario, Druski, the Mark-Fischbach duplicate, Greg Brockman's flag drift.
- Leadership-post typing mismatches.
- T-44 migration.
- Signup 211 resend (delegable).
- Daniela Amodei, held (queue note: live before 11-09).

## Evidence and assumptions

- **Observed this run:**
  - Growth log `### 2026-10-26`, and `logs/growth-automation/audit-2026-10-26.log` (exit 0, 06:08:02).
  - Read-only `scripts/db-query.sh`: people counts and recent rows, type counts, `host_reply_drafts` by status, `coaching_waitlist`, `email_sends` since 10-19.
  - Read-only `personBlogParser.js --publish-check --json` for six slugs.
  - Cron logs `cron-2026-10-20..26` and `publish-people-2026-10-20..26`; the crosslinks log 10-22.
  - Homebrew Cellar and symlinks, the OpenClaw shell snapshot PATH, and the gateway process.
  - `backlog-queue.json`, read only (it's modified in the working tree by another process).
  - `check-marketing-content-queue.mjs`; git log and stats since 10-19; outreach docs; the sitemap.
- **Not checked:**
  - Gmail (Enneagram Monthly send, outreach follow-ups) and PostHog.
  - The Vercel deployment list, so whether the OliveMe listing is live is unverified.
  - Live social accounts.
  - Whether Inde Navarrette's post-publish 10-22 15:54 pipeline run and 10-23 draft change were synced to the DB.
- **Inferred:**
  - That the publisher inherits the stale PATH from OpenClaw's snapshot. The snapshot and the crash are observed; the link between them is not.
  - That Sombr would have auto-published on 10-23.
  - The queue-dry date, at one subject a night.
  - That `--phase finalize` clears stale releases (memory, not tested this run).
- **Untouched:** no drafts, flags, queue files, scripts, Homebrew, OpenClaw or git state. The untracked Dhar Mann draft and run folder, the growth audit files, and the modified `backlog-queue.json`, crosslink and index files belong to other processes.
