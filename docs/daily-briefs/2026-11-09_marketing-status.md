<!-- docs/daily-briefs/2026-11-09_marketing-status.md -->

# 9takes Marketing Status — 2026-11-09 (Monday, unattended weekly brief)

**BLUF:** Someone got all the way through the coaching loop for the first time: a Bing reader took the test, registered, and joined the beta waitlist. That person is the most valuable lead in a month, and nothing on disk shows a reply. Growth's #1 bet is that DJ writes to them today (10 min). Everything else stalled where DJ's time goes. 0 people pages published this week, the first flat week since the publisher came back. Nine finished passes are blocked only on portraits. Most of DJ's week went to brand and quality work (Cold Light, the Type 6 fairness fix, three adversarial rebuilds), not to the growth bets. The return leg is 0 for a seventh week, and the opt-in that would fix it without DJ's time is unbuilt for a third ask. The Daniela Amodei "live before Nov 9" window passed with no rerun.

## TL;DR

- **Growth data is fresh (gate passed).** The growth-log `### 2026-11-09` audit exited 0 at 10:12. It started at 05:07 and restarted at 07:21.
  - Headline, verbatim: _"the coaching loop turned end to end for the first time (Bing reader -> test -> account -> beta-card waitlist), but takes fell 9 -> 4, the homepage went 0 for 38, and returning contributors were 0 for a seventh week."_
  - Biggest leak, verbatim: _"the return leg, for the seventh straight week. 22 contributors since 10-19 produced 0 returning contributors, 0 of 22 left any way to be reached, and 0 of 4 this week got a reply. The one person who did come back and convert came through content and the test, not through a take."_
- **Growth's bet #1 is DJ-only and dated today:** a personal note to the 11-05 beta lead. They are Type 4, came from Bing to shadow-work, spent 28 minutes, and registered. They signed up before the automated beta-details email existed (committed 11-06 14:01), so they likely got nothing about the beta. The audit couldn't see DJ's outbox; I didn't check Gmail either.
- **0 people publishes; DB flat at 464 published / 155 unpublished (was 149).** The publisher found "No publishable draft" on 6 of 6 mornings (11-03..11-08). The 11-09 log stops at startup with no exit line, its second silent stop after 11-01.
- **Nine passes wait only on portraits.** `--publish-check`, run read-only today: Hunter Schafer 8.6, Chris Olah 8.6, Dominic Fike 8.5, Paul Bettany 8.5, Tom Rhys Harries 8.5, Geoffrey Hinton 8.5, James Talarico 8.5, Ludwig Ahgren 8.5 and Anthony Ippolito 8.3. Each blocks only on `missing_full_image` + `missing_thumbnail_image`. That is nine days of auto-publishing ready to go.
- **Daniela Amodei missed her 11-09 window.** She's still at 8.0, with no rerun since 10-28. The full transcript `dario-and-daniela.md` is still tracked at the repo root of the public repo (2nd ask).
- **Known-bad pages are still live.** The Sam Parr, Shaan Puri and Scott Galloway rebuilds were committed 11-05 but never synced; I checked the DB titles against the draft titles. Per memory, the live Shaan page names his wife and her company, and Galloway's live page has 23 errors. Both need DJ's OK to push.

## The actual work: one lead, nine portraits, one opt-in

The bottleneck isn't the system. It's three DJ-only actions that each take minutes and have now carried over for weeks.

| Artifact                                                                                          | State (observed today unless noted)                                                                                                                                                     | Owner               | Next                                                                      |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------- |
| 11-05 beta lead (Type 4, Bing -> shadow work -> test -> register -> beta card on the type-5 page) | `coaching_waitlist` 20 total; the newest row is 11-06 03:09 UTC, the only one since 11-01. Growth: no talk note, no client row; welcome steps 1-2 sent, 0 opens. DJ's outbox unverified | **DJ**              | Personal email today. Growth's success bar: reply or booked call by 11-16 |
| "Next take" opt-in on `NineChorus` (q573 reveal)                                                  | Not built. 0 of 22 contributors reachable since 10-19. `NineChorus.svelte` changed 11-02, 11-05 and 11-06 (Cold Light), still with no opt-in                                            | **DJ** go           | Third ask in these briefs. Agent build ~1-2 h                             |
| 9 portrait-blocked passes                                                                         | All 9 eligible except images. The publisher ships one a day once a portrait lands                                                                                                       | **DJ** (image step) | Portraits, ~10 min each; agent can prep source shortlists                 |
| Host desk (`host_reply_drafts`)                                                                   | **38 pending / 1 posted lifetime** (re-queried). Growth now defaults replies to retired (c) and downgrades the daily alarm to weekly unless DJ objects                                  | DJ (veto only)      | Object or let the default stand                                           |
| Beta card (`beta_card_v1`)                                                                        | 464 viewers -> 3 opened -> **1 submitted** (first ever). Growth counts 2 of 10 toward 11-15                                                                                             | **DJ**              | Keep, change or reset (4th ask). It will miss 10                          |
| Homepage q203                                                                                     | 38 gate fingerprints -> 0 takes (engaged `/` humans 28 -> 21 -> 16)                                                                                                                     | growth              | Rotate on 11-16 if the 11-09 week is 0 again from >=30 gates              |

## Tooling state (changes only)

- **Pipeline auth expired 11-08.** QTCinderella's 11-08 run died in 3 s on "this login reached its time limit and cannot be renewed." Chris Olah's `research.log` warned on 11-05 to run `claude setup-token` before 11-08.
  - The 11-09 run authenticated, but its research stage hit the timeout at 2,799 s. QTCinderella is on retry 2/3, so retry 3 runs tonight.
  - Unattended jobs still use a session login, so this can recur. The fix is a long-lived `CLAUDE_CODE_OAUTH_TOKEN` (Q9).
- **The 11-09 publisher stopped silently at 05:07:40.** The growth audit started at 05:07:41, then logged a second "Starting" at 07:21. Inferred: the host slept or woke around then and killed the publisher. It cost nothing today, because nothing was publishable.
- **New gates this week, all committed and pushed:**
  - `pnpm controversies:check` in lint (11-07): 27 required entries, 16 open, among them Trump, Musk, Rogan, Clinton and Vance.
  - Enneagram Corner `subtopics` frontmatter is now required by `pnpm test` (11-06).
  - A missing cluster tag now blocks drafts (`missing_cluster_tag`, 11-04).
  - Per memory, the 11-04 contract edit invalidated held runs' stage caches, so a `--resume` on any of the 15 held subjects restarts from research.
- **Cold Light rebrand (11-05) shipped site-wide.** It is dark-only (indigo/lavender/mint, statues); amber is retired. Rollout commits landed 11-05..11-08, and `main` = `origin/main` at `2dc66610b`.
- **Supabase MCP down (10th week).** Data came from read-only `scripts/db-query.sh`.

## Cross-surface status

### Blogs

- **People DB: 464 published / 155 unpublished** (11-02: 464 / 149). Six new unpublished rows: Hinton, Harries, Olah, Talarico, Jay-Z, Ludwig.
- **Nightly v3: 5 complete runs, 4 passes, 1 hold, 2 failures.**
  - Tom Rhys Harries (6): retry 3 of 3 on 11-03 **passed** at 8.5. It's his first clean run after three failures. The fairness review flagged the ADHD attribution, and whether that was fixed is unverified. The queue file still lists him under `failed`.
  - Geoffrey Hinton (1): 8.5, 11-04.
  - Chris Olah (4): 8.6, 11-05. Quotes re-transcribed from audio.
  - Jay-Z (8): **held** at verify-repair, `revise`, 8.4, with no `release.json`. Now in `held`.
  - Ludwig Ahgren (7): 8.5, 11-07.
  - QTCinderella: auth failure 11-08, research timeout 11-09.
- **Manual:** James Talarico (1), 11-05 18:06, passed at 8.5. It's timely after the 11-03 midterms, but memory notes politician pages draw about 0 GSC.
- **Type mix of this week's six subjects:** one typed 6 (Harries). Last week it was 2 of 4.
- **Queue: 7** (QTCinderella, Drew Afualo, Quenlin Blackwell, Amanda Seyfried, Josie Totah, Larry Ellison, Steve Wozniak). About a week of runway. 15 held.
- **DJ's corpus work (memory + git, 11-07):**
  - Type 6 fairness pass: 22 live pages fixed and synced, lastmod preserved.
  - Sam Parr, Shaan Puri and Scott Galloway rebuilt but not synced. Galloway's 8-vs-3 (or 4-vs-6) call is still open.
  - `push:cluster-tags` (151 rows; untagged published people 111 -> 7) still waits on DJ.
- **MDsvex:**
  - Pop-culture: 21 not live (18 `false` + 3 with no flag), unchanged. The oldest is about 329 days.
  - **New dated content window: the Thanksgiving situational series.**
    - Six skeletons sit in `src/blog/guides/drafts/situational/` (11-04/05). All are still beats-only with `[DJ: ...]` slots unfilled.
    - The framing doc wanted posts 1-2 the week of 11-03 (missed), posts 3, 5 and 6 by **11-12**, and post 4 by **11-14**, so they can rank before Thanksgiving (11-26).
  - Enneagram Corner was restructured into section -> subtopic lanes (11-06). Its Friendships lane has 0 posts.

### Distribution and social

- **Parked, unchanged:** Instagram queue RED (0/10 approved, 11/15 copy-ready, 2 design-ready). Last IG session 08-07. No Quora sessions. No Twitter activity. No new distribution packets since 10-04.

### SEO

- **GSC is 21 days stale** (last pull 10-19). The Soft 404 re-inspection and the Jordi Hays CTR read are a week overdue. Per growth, Google entries were flat (439 vs 442) and celebrity landings from Google rose 8%.
- **Crosslinks 11-05: OK.** 12 links across 11 posts, gate debt 0, 150 live posts, 0 broken. New: the people -> people queue is empty while **201 people pages still need links**, so it needs a new way to find candidates. The narcissism contradiction and the leadership-post typing mismatches (Jobs, Bezos, Nadella) are in their 5th week.
- **Anthropic cluster:** Hinton and Olah passed and wait on portraits. Daniela missed her window. Dario's live page is still typed 5 (the 5 -> 6 call is open).

### Growth

- From today's audit, not re-derived:
  - 779 engaged humans (49 returning, #2 of 25), down 5%. Google was flat and direct fell 23%.
  - 4 takes from 4 first-timers, all anonymous. That equals the 25-week median.
  - Celebrity q573: 3/124 (2.4%). Substantive yield matches q118 at 2.4%, and answers are deeper. The depth guardrail (3.5 min) is right on the line.
  - 0 real signups. 1 registration and 1 booking, both from the same beta lead.
- Last week's bets: opt-in **not shipped**, reply call **not made** (now defaulted to retired), 211 not resent.

### Outreach

- No outreach files changed this week. Enneagram Monthly's send is still unrecorded (4th brief).
- The Sam, Shaan and Galloway rebuilds are outreach pretext (memory). The live pages' privacy problems block any re-contact until they're pushed.

### Email and coaching

- Welcome step 1 moved to q574 (11-04): 1 send, 0 opens, 0 takes. A beta-details email was added 11-06.
- 2 sends this week, 0 failures. Signup 211 has gone 35 days without a resend.
- `talk_notes`: 1 lifetime, 0 new. `/book-session` changed only for Cold Light styling.

## What changed since last brief

- **11-02 recommendations:**
  - #1 opt-in: **not approved**.
  - #2 reply call: **not made**; growth now defaults to (c), retired.
  - #3 clear the publish lane before 11-09: **not done**. No Daniela rerun, 0 of 4 portraits, and the pile grew from 4 to 9.
- **11-02 open questions:** none answered on disk (Q1-Q7). The 11-03 reply-test check and the 11-06 Daniela decision both passed with no action.
- **DJ shipped instead (16 commits, all pushed):**
  - Cold Light rebrand.
  - Enneagram Corner taxonomy.
  - Type 6 fairness pass + controversies gate.
  - Three adversarial people rebuilds.
  - Cluster tags made a pipeline requirement.
  - The celebrity starter rotated q118 -> q573 and welcome step 1 moved to q574.
  - The situational series framed.
  - A blog image refresh (11-04).
- **Growth:** the first beta-card submit and the first registration since 10-05. Takes 9 -> 4. Homepage 0/38. Returning contributors 0 for a 7th week.
- **Content:** DB flat at 464. Images-only passes 4 -> 9. Jay-Z held. Pipeline auth expired once.

## Recommendation

**1. Write to the beta lead today (growth bet #1).**

- **Cost and impact:** about 10 minutes, DJ only. It could produce the first booked beta session from organic content. Risk: none.
- **Why first:** it's a 4-day-old lead with 28 minutes of same-day intent who probably never got beta details. Leads cool by the day.
- **First step:** pull the row (`coaching_waitlist`, created 2026-11-06 03:09 UTC) and send a short personal note. Their path: shadow work -> Type 4 -> the type-5 page.

**2. Do the portraits as one batch this week.**

- **Cost and impact:** about 90 minutes of DJ's image time for all nine, or about 30 minutes for the top three. The publisher then ships one a day with no further action, for 9 new pages over about 9 days, against 0 this week. Risk: Fike's 5 and Schafer's 4 minor verify findings ship as-is unless fixed first.
- **Lean:** Hinton, Olah and Talarico first. Hinton and Olah extend the Anthropic cluster now that Daniela's window has passed; Talarico is post-midterm.
- **Ambitious (my pick):** an agent preps a source-photo shortlist and crop notes for all nine (no image generation), so DJ's part is only the extraction step. Do all nine in one sitting.
- **First step:** answer Q4.

**3. Approve the "next take" opt-in at the q573 reveal (growth bet #2, 3rd ask).**

- **Cost and impact:** about 1 minute to decide, about 1-2 h of agent build, about 15 minutes of review. It aims for the first reachable anonymous contributor, using a trigger that fires on other people's takes, so it needs no DJ time. Risk: it could depress posting. Growth's guardrail: celebrity substantive gate -> take stays >=2%.
- **Lean:** drop `ReplyOptInTray` into `NineChorus`.
- **Ambitious (growth's pick and mine):** "email me when the next type answers this," with a weekly cap.
- **Success:** >=1 opt-in and >=1 notified visit within 2 weeks.

**Next in line:**

- The Thanksgiving situational posts: 3, 5 and 6 due 11-12, needing DJ's riffs in the `[DJ: ...]` slots.
- A GSC pull (21 days stale) through `seo-content-strategist`.
- The 211 resend.

## Open questions for DJ

1. **Beta lead:** have you written to them? If not, today. Growth's bar is a reply or booking by 11-16.
2. **Opt-in (3rd ask):** may an agent build it? Lean (the tray in `NineChorus`) or ambitious ("email me when the next type answers this," weekly cap)?
3. **Growth's defaults:** do you object to (a) retiring DJ replies as the return mechanism and downgrading the daily host-digest alarm to weekly, or (b) rotating homepage q203 on 11-16 if it gets 0 takes again?
4. **Portraits:** all nine this week, or the top three (Hinton, Olah, Talarico)? Want agent-prepared source shortlists? Should Fike's and Schafer's minor findings be fixed before their portraits land?
5. **Known-bad live pages:** may the rebuilt Shaan Puri and Sam Parr drafts sync (`--sync --skip-perspective-gate`)? The live Shaan page names his wife. Galloway also needs your type call (8, 3, 4 or 6) before it syncs. Separately: run `push:cluster-tags --write`?
6. **Daniela Amodei, window passed:** rerun against the 7 unreviewed interviews, publish by owner override at 8.0, or drop the deadline? The duo post waits on this.
7. **Transcript in the public repo (2nd ask):** may an agent `git rm` `dario-and-daniela.md` and move it to `~/.cache/9takes-research/daniela-amodei/`? A history rewrite is a separate call.
8. **Thanksgiving series:** will you fill the riffs for posts 3, 5 and 6 by 11-12, or should the series move to next year's window?
9. **Pipeline auth:** will you set a long-lived `CLAUDE_CODE_OAUTH_TOKEN` (`claude setup-token`) for the unattended jobs, so the 11-08 failure can't recur?

Carried, parked unless you say otherwise:

- Beta card goal (4th ask; it will miss 10 by 11-15).
- Enneagram Monthly send (4th ask).
- Signup 211 resend.
- The 16 open controversy-registry gaps.
- The 201 people pages needing a new link-candidate method.
- Typing calls: Dario 5 -> 6, Druski, the Mark-Fischbach duplicate, Greg Brockman's flag drift.
- Leadership-post mismatches and the narcissism contradiction (5th week).
- Jay-Z revise.
- McKenna Grace rerun (~12-01).
- Instagram, Quora, Twitter, The Nine, One Take.

## Evidence and assumptions

- **Observed this run:**
  - Growth log `### 2026-11-09` and `logs/growth-automation/audit-2026-11-09.log` (exit 0, 10:12).
  - `logs/blog-automation/cron-2026-11-03..09` and `publish-people-2026-11-03..09`.
  - Seven pipeline run folders: `verification-*.json` status, `stage-summary.tsv`, `release.json` presence.
  - Read-only `personBlogParser.js <slug> --publish-check --json` for 11 slugs.
  - `backlog-queue.json`, read only. It is modified in the working tree by another process.
  - Read-only `scripts/db-query.sh`: people counts, recent rows, the Daniela/Sam/Shaan/Galloway rows and titles, `host_reply_drafts`, `coaching_waitlist`, `talk_notes`.
  - `check-marketing-content-queue.mjs`; the crosslinks 11-05 log; git log since 11-02; MDsvex flag counts; the situational framing doc and skeletons.
- **Not checked:** Gmail (beta-lead reply, Enneagram Monthly), PostHog, GSC, and live social accounts.
- **Inferred:**
  - That the 11-09 publisher stop is a sleep/wake kill, from the matching 05:07 timestamps.
  - That the beta lead got no beta details, per growth.
  - The roughly one-week queue runway.
- **From memory, not re-verified:**
  - Shaan's and Galloway's live-page errors.
  - That `push:cluster-tags` is unrun.
  - The held-run cache invalidation.
  - The minor-finding counts for Fike and Schafer.
- **Process note:** while looking up the publish-check flag, I ran `node scripts/personBlogParser.js --help` once by mistake. I stopped it within seconds. I then read `main()`: with no recognized flags it takes the dry-run preview path (apply, sync and insert are all false), so nothing was written to the DB. `git status` was unchanged afterward.
- **Untouched:** no drafts, flags, queue files, scripts, or git state.
