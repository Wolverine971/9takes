<!-- docs/daily-briefs/2026-10-12_marketing-status.md -->

# 9takes Marketing Status — 2026-10-12

**Unattended weekly run (Monday cron).** This covers 10-05 -> 10-12; the prior brief is `2026-10-05_marketing-status.md`.

- **The growth freshness gate passed.** The newest entry in `docs/growth/growth-log.md` is `### 2026-10-12`. The audit started 06:00:00 and this brief started 06:11:41, so the Monday chain was on time. Its headline and biggest leak are quoted verbatim below, not re-derived.
- **Data sources.** The Supabase MCP failed to connect (sixth week). DB reads this run were read-only `scripts/db-query.sh` queries: people publish counts, 18 key people rows, rows inserted and published since 10-05, `blogs_famous_people_history` since 10-05, and `email_sends` by sequence (no recipients read). I also made nine read-only GETs to `9takes.com` to confirm ship state.
- **Nothing was changed.** This run touched no draft, publish flag, packet, queue, email, post or git state. Only this brief and `docs/marketing/marketing-log.md` were written.
- **Other sessions' work is in the tree.** `git status` shows uncommitted changes to `docs/blog-automation/backlog-queue.json`, `docs/growth/growth-log.md` (today's audit entry), and the new `maleah-joi-moon` draft with its pipeline log. I read them and touched none.

## TL;DR

- **Growth headline (verbatim, 2026-10-12 audit):** _"comments came back to 6, from six different people, after two weeks at 0 and 2. Half arrived through the new homepage answer box. None of the six got a reply, the desk now holds 15 unposted drafts, and one contributor came back 30 hours later to look at their take and left. Celebrity pages showed the gate to 103 readers and got 1 take, which says "i dont understand this question". Mail is on again after 34 days, and the week's one registrant unsubscribed after the third welcome email."_ Week of 10-05 (v2 RPC): 676 human visitors (22 returning), 6 human comments, 6 contributors (0 returning), 2 real signups, 1 registration, 1 booking.
- **Biggest leak (verbatim):** _"the celebrity gate. It showed q567 to 103 human readers, 91 of them after at least 30 s of reading, and 1 answered, to say the question made no sense. That is 103 of the 131 recorded gate fingerprints for the week. The standing leak under it has not moved: 0 of 6 takes got a reply and 0 contributors returned. Anti-pattern: a local maximum. q567 was chosen for its 17% on the old homepage and reused mid-article, where it converts 1%."_
- **The same two 10-to-15-minute steps are open for a second week, and they are the whole leak.** The easier celebrity questions (q118, q203) are still unapproved, and 0 of the 14 reply drafts written since 10-03 were posted. Growth's new suspicion is that the daily digest never reaches an inbox you read. Mail itself is fixed (on since 10-05).
- **You shipped a large build week: 15 commits, all pushed, the newest verified live.** The new Enneagram test, Google-only answer summaries on question pages, a corpus-wide stale-facts pass (103 live profiles updated 10-06), a CEO page, the celebrity hub, the compatibility calculator, three new posts live (_Artificial_ explainer, The Office, CEOs), Dakota Johnson published, and Doja Cat retyped 7 -> 9 on the live page. The Sam Altman retype was dropped (he stays a 4).
- **Outreach is alive for the first time in two months and got its first editor yes.** 5 of 15 pitches went out 10-06. Enneagram Monthly invited a draft article on 10-09; it is not submitted. Follow-ups on the other sends fall due 10-11 -> 10-13, and 10 drafts are unsent.
- **Content engine: 12 pipeline runs, 3 cleared verify, 1 published.**
  - **One portrait from live:** Ilya Sutskever (8.7) and Stella Lefty (8.4, Open Case format).
  - **Calls waiting on you before anyone syncs:** Dario Amodei 5 -> 6 (second week; the rerun is still `pending`), Druski 8 -> 3 (third week), a Mark Fischbach draft (Type 1) that duplicates the live Markiplier page (Type 7), and a Greg Brockman draft flagged `published: true` while verify says revise.
  - **Still dark:** Instagram 66 days (queue RED 0/10), Quora and Twitter 146 days, One Take 79 days, The Nine 0 actions in 20 days, pop-culture 20 unpublished (oldest 301 days), 10 distribution packets unfired.

## The actual work: the ask is wrong and nobody answers back

Engineering is no longer the constraint anywhere in this loop. Every open item below is either a short DJ step or a small delegable fix.

| Component                                   | State (observed: growth audit + this run)                                                                                                                                                                                                    | Owner / next step                                                                                                                          |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Celebrity mid-article question (live 10-03) | q567 only. **103 readers -> 1 take this week; 124 -> 1 since launch.** 91 of 103 had read 30 s or more; median 4.7 min on the page. The one answer: "i dont understand this question". Rotation never started (`nine_takes` holds q567 only) | **DJ, ~10 min, no code:** approve the q118 / q203 seeds in `docs/taskers/T-41-assets/G-nine-takes/`. Or pick the ambitious version (below) |
| Host digest / desk                          | Ran 7 of 7 days and drafted 6 of 6 takes. `host_reply_drafts`: **15 pending, 1 posted lifetime. 0 of 14 acted since 10-03.** The digest is not in `email_sends`, so delivery is unverified                                                   | **DJ, ~15 min:** reply to 753, 754, 749 and 743 in `/admin/host-desk`. Tell us where the digest lands                                      |
| Reply opt-ins                               | 3 lifetime, 0 served, 0 new from this week's 6 takes. 749 and 743 unanswered at 11 and 23 days                                                                                                                                               | Fires when DJ replies to 749 or 743                                                                                                        |
| Live-take homepage (live 10-03)             | First takes: 3 this week, from 26 engaged visitors. The gate count undercounts: `src/lib/server/homepageLiveTake.ts:132` only records it when a fingerprint cookie already exists                                                            | Eng, ~30 min, delegable, before the 10-17 readout                                                                                          |
| Welcome + confirmation mail                 | **Restored 10-05 19:30 UTC after 34 days.** 13 sent, 1 failed (signup 211's confirmation, not resent). 12 welcome steps: 5 opened, 1 click, 1 unsubscribe                                                                                    | Resend 211. The approved Enneagram type-prompt email has 0 sends since the fix (observed)                                                  |
| Registration                                | The weak-password "Server error" fix is not shipped. 0 hits this week (4 lifetime)                                                                                                                                                           | Eng, ~30 min, delegable                                                                                                                    |
| Beta card ("experimental therapy")          | 621 viewer fingerprints -> 14 opened -> 1 submitted. The submit came from a direct `/book-session` landing; growth infers it is one of your invites. Card on content pages: 13 opens, 0 submits. **1 of 10 by 11-15, 34 days left**          | At this rate readers will not fill the beta; direct invites will                                                                           |

**PM read.** Last week I called the remaining work "a DJ action or a short delegated fix." That is still true, and the two DJ actions did not happen while 15 commits did. I read that as a delivery problem, not a discipline problem:

- **Replies:** six digests went out since 10-03 and no one-tap link was used. Growth could not confirm the digest reaches an inbox you read. The nightly blog job already notifies you on Telegram, so routing the digest there is the cheap test (inferred that you read Telegram; small eng change, needs your yes).
- **Seeds:** the approval sits in a tasker folder. It needs one reply from you, not a session.

## Tooling state

- **Publisher (06:00 OpenClaw):** it published Dakota Johnson on 10-09 (grade 8.6), then died in `pnpm gen:all` with the same Node v26.5.0 engine error as every auto-publish since 08-29. The fix (pin Node 24 in `scripts/daily-blog-publisher.sh`) is unshipped for a fifth brief. Impact is muted because your manual commits regenerate the sitemap and corpus stats (both fresh 10-12). The other mornings: "No publishable draft" on 10-06, 10-07, 10-10, 10-11, 10-12; the 10-08 log stops after two lines with no exit line (run died, cause unknown).
- **Nightly create:** ran 5 of 7 nights. 10-07 and 10-08 skipped because your manual runs held the lock. The wrapper still leaves a finished run in `inProgress` and reconciles it the next night; `maleah-joi-moon` is in that state now (no pipeline process alive).
- **New pipeline failure classes this week** (all observed in logs or memory):
  - **Alias duplicates:** create mode does not detect a live page under a stage name. Mark Fischbach was drafted against live Markiplier.
  - **Research turn cap:** Daniela Amodei's research hit 120 turns and returned `insufficient_evidence`.
  - **Silent failed deploys:** the 10-06 commit that added the _Artificial_ hero tripped the build-budget ratchet, the deploy errored, and the new post 404'd until `6c8696827` raised the budget. Today's newest deploy is live (the moved Doja Cat portrait returns 200 at its new path).
- **Stale v3 release (inferred):** Ben Shelton is back on the publisher's closest list with a new blocker, `editorial_v3:stale_or_invalid_release`. He was images-only on 09-20. The 10-06 stale-facts pass edited 104 drafts, so it may have invalidated releases that were already signed. Not investigated.
- **Weekly Crosslinks (Thu):** OK on 10-08 after three starts. 12 links added across 11 posts; gate at 150 live posts, 0 broken, 0 below the bar.
- **New tools:** `pnpm audit:people-staleness`; an hourly question-summary cron (`api/cron/question-summaries`).

## Cross-surface status

### Growth and email

- Headline and leak are quoted above. Other facts from the 10-12 entry:
  - Comments went 2 -> 6 and contributors 2 -> 6, the most since 09-14. All six were first-timers. Three came through the homepage answer box, two from question pages, one from a celebrity page. Growth calls it a partial recovery, not a trend.
  - Visitors rose to 676, the second-highest of 26 weeks. Returning visitors fell 35 -> 22, the third-lowest; growth reads that as noise until next week (inferred).
  - A second contributor was seen coming back to an unanswered take (fingerprint `2e19451b`, 30 hours after take 753, stayed 28 s, left).
  - The week's one registrant wrote the longest take of the week (457 chars), opened welcome emails 1 to 3, got no reply, and unsubscribed on 10-11. One person, so not a verdict on the sequence.
  - Both real signups came from Google to a people page.
  - Growth's status on last week's bets: #1 not done, #2 half done (mail on; password message and resends not), #3 not done.
- **Email, this run (observed):** every send since 10-05 is `welcome_sequence` or a non-sequence transactional mail. `enneagram_type_prompt` has 0 sends. The campaign was approved and authorized on 09-10 with the footer address as its only blocker, and that cleared 10-05. The 31-eligible count is a month old.
- Full evidence: [`docs/growth/growth-log.md`](../growth/growth-log.md) `### 2026-10-12`.

### Blogs — people

- **DB: 452 published / 139 unpublished** (was 451 / 134). Disk: 549 drafts, 444 `published: true`, 98 `published: false`.
  - **Published:** Dakota Johnson, 10-09 06:00, Type 4, 8.6 B+ (production 200).
  - **Inserted unpublished:** greg-brockman (10-07); mark-fischbach, codie-sanchez, ilya-sutskever, stella-lefty (10-11).
- **The 12 v3 runs since the last brief:**

| Subject                 | Mode    | Verify status                                           | Grade             | State                                                                  |
| ----------------------- | ------- | ------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------- |
| Dakota Johnson (2 runs) | create  | pending, then eligible                                  | 8.6               | **Published 10-09**                                                    |
| Ilya Sutskever          | create  | eligible, release.json                                  | 8.7               | **Blocked on portrait only** (publisher log)                           |
| Stella Lefty            | create  | eligible, release.json                                  | 8.4 (Open Case)   | No portrait files on disk; inferred images-only                        |
| Greg Brockman           | create  | needs_revision                                          | 8.3               | Draft says `published: true`; DB row unpublished; not in sitemap       |
| Codie Sanchez           | create  | needs_revision                                          | 8.3               | Held                                                                   |
| Maleah Joi Moon         | create  | needs_revision (thesis changed in edit, one wrong date) | 8.0               | Uncommitted draft; run finished 10-12 ~04:25                           |
| Daniela Amodei          | create  | insufficient_evidence (research)                        | none              | Held. Queue note: "Must be live before Nov 9"                          |
| Mark Fischbach          | create  | insufficient_evidence                                   | 7.3               | **Duplicate of live Markiplier** (Type 1 draft vs Type 7 live page)    |
| Sam Altman (2nd run)    | refresh | insufficient_evidence                                   | n/a               | Retype dropped. Misquote corrections synced live 10-05; type stays 4   |
| Dario Amodei (2nd run)  | refresh | pending                                                 | n/a               | Draft says 6, live says 5                                              |
| Doja Cat                | refresh | insufficient_evidence, then hand corrections            | 8.1, needs_review | **Synced live 10-11 as Type 9** (was 7); portrait moved; title updated |

- **Typing calls still open** (none synced, live rows unchanged):
  - **Dario Amodei 5 -> 6.** The draft is committed with `published: true`. The 10-08 crosslink run flagged that the CEO roster lists him as a 5. The queue note for his sister records his page's impressions rising 213 -> 3,652 from June to September and an Anthropic investor day reported for 10-14 (from the queue file; not verified by me).
  - **Druski 8 -> 3.** Third week undecided.
- **Doja Cat cascade:** a windowed text check of the 7 files that mention her found no leftover Type 7 wording. The unpublished pop-queens draft and the musicians post both say Type 9.
- **Other live refreshes:** Robert Greene (pushed 10-08 ahead of _The Law of the Sublime_, on sale 11-10) and Troye Sivan (10-08, 8.6).
- **Publisher blockers (10-12):** 89 unpublished candidates. `missing_perspective_review` 71 (flat, ninth brief), `source_standard_failed` 46, `content_quality_below_8.5` 34, `missing_grade_stability_delta` 31, `stale_grade_rubric_v1` 25, `missing_content_quality` 17, missing images 13.
- **Queue:** 17 waiting, 4 held (Austin Abrams, Joseph Zada, Daniela Amodei, Codie Sanchez). Abrams' second press window (_Whalefall_, 10-16 per the queue note) is this Friday.

### Blogs — other categories

- **Live this week (all 200 in production):**
  - `pop-culture/artificial-movie-real-people` (10-06, with hero). Its Altman section says Type 4, which now matches his page.
  - `pop-culture/the-office-enneagram-types` (10-07). **No hero image.**
  - `enneagram-corner/what-enneagram-type-are-most-ceos` (10-07, new). **No hero image.**
  - Both missing heroes already have a finished prompt in a comment at the top of the file for you to run in ChatGPT, then `node scripts/blog-image-variants.mjs <slug> <image>`.
- **Pop-culture:** 20 not live (17 `published: false` plus 3 flagless companion files), down from 22 on the same basis. All 17 real drafts are 3+ months old; the oldest is `aoc-and-the-squad` (2025-12-15, 301 days).
- **Other unpublished drafts:** community 17, enneagram 18, guides 8, topical 1, life-situations 1. Most are 2023-2025 files in `drafts/` folders. No new ones this week.

### SEO

- **Shipped and verified live 10-09 (per the build session's memory note; I re-checked only the URLs listed above):**
  - Question pages now give Google an AI summary of the answers; readers never see it. The build session flagged this as a cloaking gray zone and you accepted it.
  - FAQ structured data is back on 67 posts (a May cleanup script had been stripping it from all 110).
  - Give-first lockdown: answer text is no longer readable through the public API.
  - The new Enneagram test at `/enneagram-test` (200).
- **The 10-06 keyword and outreach map** (`docs/seo/2026-10-06-keyword-and-outreach-map.md`) found that core Enneagram terms are link-limited, not content-limited: about 25k impressions at an average position near 35, for 86 clicks, on a domain rated 19.
- **T-41 A (spam-update and noindex readout) is past its 10-10 gate and not started.** It needs a fresh Search Console pull; the newest data on disk is from 10-03.
- **T-41 C (two-week readout of the homepage and celebrity questions) is due 10-17, this Saturday.**
- **Unverified this run:** whether indexing was requested for the 7 dropped people URLs (a Search Console action only you can take). Two veto-able calls from the build session are also still open per memory: the celebrity hub's front row (Trump first; Putin, Tate and Stalin in the top tens) and the CEO post's "Type 5" headline against the 3/5 split.
- **Jordi Hays:** read the identity-first title around 11-01.

### Outreach

- **First outreach activity since 08-04.** Per memory and `docs/seo/2026-10-06-keyword-and-outreach-map.md`: 15 personalized drafts were prepared 10-06 and you sent 5 that day (Enneagram Universe, USA Today, Empathy Architects, OliveMe, Capacity Building). 10 remain in drafts. Gmail was not inspected this run.
- **Enneagram Monthly said yes to a draft.** `docs/outreach/2026-10-09-enneagram-monthly-preparation.md` (observed): the pitch was a data article on patterns across the public-figure typings. The editor replied 10-09 inviting a draft, with no word limit, Word format, charts welcome and no deadline. The article is not written or submitted. The prep doc's numbers mix 450 and 451 profiles; the corpus is 452 today, so the article needs one dated snapshot.
- **Follow-up window:** your own rule is 5 to 7 days, which puts the 10-06 sends at 10-11 -> 10-13.
- **Career-narrative flag:** a published data article in the field's trade magazine, built from a corpus an agent pipeline maintains, is a story worth telling in FDE interviews. So is the queued Shyam Sankar profile (he coined the term).

### Distribution, social, video

- **Distribution:** 10 packets unfired. The be-gentle promo set is 8 days old. Legacy packets: newest 07-14 (90 days), oldest 02-25 (229 days).
- **Instagram:** last session 08-07 (66 days). The queue check reads **RED**, identical to the last nine checks: approved 0/10, copy-ready 11/15, triaged 19/20, design-ready 2/3, QA 0/2. `queue.json` was last committed 08-08. Only the two reminder crons still fire.
- **Quora / Twitter:** last session and cron log 05-19 (146 days).
- **The Nine:** no run-log entry since 09-22. Growth still lists it as held.
- **One Take:** episode 1 unfilmed, 79 days after the format decision.

### Coaching / beta

- `/book-session` returns 200 and was reworked on 10-06 and 10-07. Numbers are in the table above. T-44 (admin read access to the CTA experiment counts) is fixed locally; its production migration needs your approval.

## What changed since 2026-10-05

- **Shipped and pushed** (`main` matches the local `origin/main` ref at `8c598979e`; the newest commit's asset is live):
  - 10-05: postal address set in all environments; mail restored; address later limited to email footers only. Sam Altman misquote corrections synced.
  - 10-06: `/book-session` beta rework and the "Free 1-on-1" nav offer; keyword and outreach map; _Artificial_ explainer published; stopped-enrollment admin tooling; stale-facts pass (103 live rows changed), display-name fixes, fame-led type hubs; the Enneagram test.
  - 10-07 -> 10-08: Google-only answer summaries, give-first lockdown, FAQ data revived, CEO page, Office post, compatibility calculator, blog-comment fix; Robert Greene and Troye Sivan refreshes; weekly cross-links.
  - 10-09: Dakota Johnson published.
  - 10-11 -> 10-12: Doja Cat retyped live; four new people rows inserted unpublished.
- **Won:**
  - Mail is on after 34 days.
  - Comments recovered to 6, half from the new homepage box.
  - First editor yes from outreach.
  - A second people publish in five days (Dakota Johnson, after Andrew Garfield on 10-05).
  - Pop-culture backlog fell (22 -> 20).
  - Cross-link gate debt is 0.
  - The Altman typing question is closed.
- **Broke or degraded:**
  - Celebrity gate: 103 readers, 1 take.
  - 0 of 6 takes replied; desk backlog 9 -> 15 pending.
  - The week's one registrant unsubscribed.
  - Publisher died after publishing, again.
  - One silent failed deploy (10-06, fixed same day).
  - A duplicate person row and draft (Mark Fischbach).
  - Returning visitors 35 -> 22.
- **Decided (observed from artifacts and memory, not stated to me):**
  - 10-05: PO box shown in emails only.
  - 10-06: you send outreach yourself; question answers are indexable for Google only and never shown before answering; the scored test follows your own design.
  - 10-07: `/book-session` is titled "Experimental Enneagram Therapy: Free Beta 1-on-1".
  - 10-09: readers never see the AI summary of takes, before or after answering.
  - 10-05: Sam Altman stays a 4.
  - 10-11: Doja Cat is a 9.
- **Answers to the 10-05 open questions:**
  - Q2 (postal address): done. The resends are not.
  - Q5 (Altman): closed, stays 4. Dario and Druski: still open.
  - Q6 (_Artificial_ explainer): published 10-06.
  - Not answered: Q1 (desk replies), Q3 (weak-password fix), Q4 (seeds), Q7 (Instagram, perspective backfill, The Nine).

## Recommendation

**1. Change what celebrity readers are asked, before Saturday's readout (growth bet #1).** About 10 minutes of your time.

- **Lean:** approve the q118 and q203 seed sets in `docs/taskers/T-41-assets/G-nine-takes/`, so celebrity pages rotate three questions. No code; the README has the seed and revalidate commands.
- **Ambitious (your pick):** move the on-topic "Add your read on {person}" prompt from the page bottom into the mid-article slot. 318 engaged readers entered on celebrity pages this week; 5% of them is 16 takes. Needs a build.
- **Why:** these readers stay a median 4.7 minutes and the only answer q567 got says it is not understood. Seeding today gives the 10-17 readout five days of rotation; seeding later leaves it able to say only that q567 fails mid-article.
- **Success (growth, 2 weeks after seeding):** at least 3 celebrity contributors a week. Guardrail: median engaged time for gate viewers stays at 4 minutes or more.
- **Risk:** low. At about 35 gate viewers per question per week, only a jump to roughly 10% is readable, so read it per question.

**2. Reply to the four who can notice, and find out where the digest goes (growth bet #2).** About 15 minutes.

- **What:** in `/admin/host-desk`, reply to 753 (came back at 30 hours and left), 754 (the week's registrant), and 749 and 743 (the two email opt-ins). No fallback text.
- **Why:** the only contributor return on record followed a reply from you, and two contributors have now been seen returning to silence.
- **First step:** tell me whether the daily digest reaches an inbox you read. If it does not, the cheap fix is to send it to Telegram with the blog notifications.
- **Success (growth, 2 weeks):** 80% or more of new takes replied within 24 hours, at least one opt-in notification served, and at least one returning contributor.

**3. Send the Enneagram Monthly draft and the follow-ups.** About 30 to 45 minutes of your review and sending, after a writing agent drafts.

- **What:** turn the prep doc into the Word submission (1,200 to 1,500 words, one chart, one dated corpus snapshot). Send follow-ups on the 10-06 pitches inside the 10-11 -> 10-13 window. Send or drop the other 10 drafts.
- **Why:** core terms are link-limited on a domain rated 19, and this is the first editor yes in the log. Invitations decay. This ranks above growth's bet #3 on leverage: that bet is measurement hygiene plus a fix that had no hits this week.
- **First step:** say "draft it." I did not start it; this run was unattended.
- **Risk:** it is an invitation, not a guarantee. Third-party contact details must stay out of this public repo.

Following queue (cheaper to batch, not ranked above):

- (a) **Growth bet #3, delegable, about 45 minutes of engineering, wanted before 10-17:** record the homepage gate in the browser, resend signup 211's confirmation, ship the weak-password message.
- (b) **Two portraits, two publishes:** Ilya Sutskever and Stella Lefty.
- (c) **Typing and duplicate calls before anyone runs a sync** (Open question 4).
- (d) **T-41 A readout**, with a fresh Search Console pull.
- (e) **Pin Node 24** for the 06:00 publisher (about 5 minutes; fifth brief).
- (f) **Hero images** for the Office and CEO posts; the prompts are in the files.
- (g) **T-44 production migration** approval.

## Open questions for DJ

1. Celebrity question: approve the q118 / q203 seeds (lean), build the on-topic "your read on {person}" prompt mid-article (ambitious), or both?
2. Replies: will you reply to 753, 754, 749 and 743 today? Does the daily host digest reach an inbox you read, and do you want it sent to Telegram instead?
3. Enneagram Monthly: should a writing agent draft the article for your review this week? For the chart, may an agent render it from the corpus numbers with a plotting script, or do you make it yourself? (I am asking because of the no-image-generation rule; a script-drawn data chart is not an image model, but it is your rule.)
4. Typing and duplicates. Nothing is synced; I touched none of these files.
   - **Dario Amodei 5 -> 6:** approve, revert the draft, or re-run? The second run is `pending` and the live page and CEO roster both say 5.
   - **Druski 8 -> 3:** third week. Approve or revert?
   - **Mark Fischbach:** the new draft (Type 1, 7.3, verify held) duplicates the live Markiplier page (Type 7), and an unpublished DB row now exists for it. Drop the draft and row, or fold the research into Markiplier?
   - **Greg Brockman:** the draft says `published: true` while verify says revise and the DB row is unpublished. Flip the flag back to `false`?
5. Doja Cat went live as a Type 9 on 10-11 from a run the verifier held (8.1, `needs_review`). Confirm that was your call; nothing to do if so.
6. The Enneagram type-prompt email was approved 09-10, unblocked 10-05, and has 0 sends. Re-run the audience check and send, or hold while the welcome sequence's first unsubscribe is looked at?
7. Daniela Amodei is held on thin evidence, and the queue note says the page must be live before Nov 9. More research budget, or drop her from the cluster?
8. Standing forks (ninth brief): restore or retire Instagram; grandfather or batch-backfill the 71 drafts blocked on perspective review; keep The Nine held. **Proposed default for my reporting only:** from next week I list Instagram, Quora and Twitter as "parked" in one line and stop counting days, unless you say restore.

## Assumptions and limits

- Growth numbers are quoted from the 2026-10-12 growth-log entry, which is uncommitted and was written by today's audit. They are not re-derived. My own `email_sends` count used `created_at` since 10-05 and shows fewer rows than growth's 13; I quote growth's figure and used my query only to confirm that no `enneagram_type_prompt` send exists.
- "Pushed" means local `HEAD` equals the local `origin/main` ref. I did not fetch. The newest commit's moved asset returning 200 in production supports it.
- Outreach send and reply status comes from repo docs and the memory note. Gmail was not opened. "5 sent, 10 unsent" is as of 10-07.
- "Stella Lefty is images-only" is inferred from no portrait files on disk plus the publisher's separate Open Case floor. "Ben Shelton's release went stale because of the 10-06 pass" is inferred and not investigated.
- "You read Telegram" is inferred from the blog jobs delivering there.
- The SEO ship list (answer summaries, FAQ data, lockdown) is from the build session's memory note dated 10-09. I confirmed only that the listed pages return 200.
- The Dario impression figures and the Anthropic investor-day date come from a queue-file note, not from Search Console or a news source.
- I did not run `crosslinks:check` (it can rewrite `baseline.json`), `vercel ls`, or any PostHog query. Instagram, Quora, Twitter and Reddit claims come from the repo and the scheduler; no live account was inspected.
- The OpenClaw list shows the publisher job as `running` 15 minutes after its log recorded an exit; I treated the log as correct.
