<!-- docs/product/2026-09-06-engagement-brainstorm-response.md -->

# Engagement brainstorm: response and next step

Date: 2026-09-06. Responds to [2026-09-04-engagement-brainstorm.md](./2026-09-04-engagement-brainstorm.md) with production data and a code trace. Proposal for DJ's decision, not an approved plan.

## The short version

The brainstorm is a good opportunity map, but it was written from a desktop walk-through with no production numbers. The numbers change the priority order. The site already has the one thing the brainstorm asks for: real people showing up and answering sincerely. What it does not have is anyone answering them back, and no way to tell them when someone does.

The single retention event in the whole dataset is this: on 2026-07-16 a new Type 6 user wrote a raw answer about their biggest fear. DJ replied the same day. The user came back 26 days later, found the reply, wrote a 464-character response and answered another question. That is the product thesis working end to end. The 26-day gap exists because logged-in users never receive a reply email, only an in-app bell they have no reason to check.

The mirror case: on 2026-08-10 a new user signed up and answered eight questions in one sitting. Nobody replied. They never returned.

So the priority is not "give the site a host" as a recruiting exercise. It is: reply to every sincere answer within a day, and make sure the person finds out.

## What production says (2026-09-06)

| Measure                                                              | Value                                                        |
| -------------------------------------------------------------------- | ------------------------------------------------------------ |
| Questions visible in browse                                          | 54 (413 live, 359 flagged out by the August editorial reset) |
| Newest question                                                      | 2026-08-14 (23 days old)                                     |
| Human answers, last 30 days                                          | 28                                                           |
| Of those on question 567 (homepage fallback)                         | 10                                                           |
| Give-first gate shown → contribution, last 30 days                   | 270 → 26 (roughly 10%)                                       |
| Logged-in users who commented, last 90 days                          | 5                                                            |
| Welcome-sequence enrollments, last 30 days                           | 17                                                           |
| Reply-email opt-ins, ever                                            | 0                                                            |
| Reply emails sent, ever                                              | 0                                                            |
| DJ replies, last 60 days                                             | 1 ("dang")                                                   |
| People who contributed and returned a later week to contribute again | 1                                                            |

Two different loops are producing opposite quality:

- **Homepage gate loop.** Question 567 ("What's something you do every day to seem fine…") sits behind the give-first gate on the homepage. It draws one to three anonymous answers a week, and most are toll payments: "Pooopin", "Nothing", "Get out of bed", "say I'm good". Nobody from this loop has returned.
- **Welcome-email loop.** Tiny volume (about four signups a week) but it produced every substantive answer in the last 60 days, including the eight-question session and the Type 6 thread.

### Why the reveal teaches people to pay the minimum

After the gate unlocks, human answers render newest-first, ten at a time (`src/routes/questions/[slug]/+page.server.ts:1078`). On question 567 that means the reward for answering is currently "Pooopin" at the top. Each low-effort answer becomes the first thing the next visitor sees, and the next visitor calibrates to it. This is what the brainstorm's "make the reveal earn the contribution" means in practice: choose which three answers a new contributor sees first.

### Why nobody is notified

- Logged-in users: a reply inserts an in-app notification row (`supabase/migrations/20260725_notifications.sql:290`). No email is ever sent. The email-digest preference exists on the account page but nothing reads it.
- Anonymous users: the reply-email tray only appears after a person's first-ever comment site-wide, and the subscription RPC rejects anyone with more than one comment (`Interact.svelte:430`, `20260812234500_comment_reply_subscriptions.sql:88`). Zero people have opted in since it shipped on 2026-08-14, across roughly 30 eligible first answers. Either the tray is not rendering where people actually answer (mobile, homepage) or it converts at zero. This needs one real journey on a phone.
- The reply-notification cron only drains the anonymous outbox. It has never had a row to send.

### Two things the brainstorm did not see

- The question index has no curation signal at all. Browse is `created_at DESC` (`20260813203000_question_editorial_audit.sql:249`). The only editorial mechanism is exclusion. There is no featured, pinned, or rank field.
- The index RPC applies `LIMIT`/`OFFSET` to an aggregate, so page one always returns every question and "load more" has never returned anything. Masked today because there are 54 questions. Fix it while touching the index.
- Two election-year questions ("Who are you voting for next election", "Will Kamala Harris make a good president") are still in browse and still collecting answers. Wrong front door.
- The most-answered question in the site's history is "what were you like as a kid in 3 words" (38 answers). Light, specific, three-second answer. That is the front-door archetype, not 567.

## Response to DJ's pushback, item by item

1. **Give the site a host.** Agree, with a reframe. The founding circle already showed up twice and got no host. Job one is replying within 24 hours to every sincere answer. Job two is recruiting six to ten people for a four-week commitment. Feasibility risk, stated plainly: the Instagram reply leg produced seven sessions of drafted queues and zero posted comments. Hosting will stall the same way unless the reply is a one-tap approval, not a writing task. Design for that from day one.
2. **Curate the front door / starter questions.** Agree. Five light starter questions at the top of `/questions`, chosen by the writing standard, with the election questions flagged out. Cheap.
3. **Make the reveal earn the contribution.** This is the piece DJ said he did not understand. Plain version: pin three contrasting human answers per starter question so the first thing a new contributor sees is worth the answer they just gave. Not the best answers, the most different ones. If a question has fewer than three good human answers, the labeled type-voice AI takes already exist below the humans and can stay there as the floor. Never mix them into the human count.
4. **Connect articles to the reader's life.** Agree with DJ: defer. The Chorus on personality-analysis already does this at a trickle (one contribution in 30 days). Build nothing new here until the core loop retains.
5. **Emotional range / step ladder.** DJ's instinct is right and the data backs it: 567 is a deep question at the front door and it draws shallow answers. Front door should be light and specific. The ladder needs no new system; it is the order of the starter list plus a "next question" suggestion after someone answers.
6. **Recurring editorial formats.** Agree: this is distribution, not product. One format only, the weekly question email to the circle and recent signups, using the sequence engine that already exists.
7. **Make returning worthwhile / notifications.** Confirmed broken in the way that matters. This is the P0.
8. **Private link for two people.** Defer. The cheap version already exists: share the question link, the friend hits the same gate.
9. **Library trails.** Defer. Search-side, not retention.
10. **Visible quality standard.** Fold the product-journey audit (phone submission, reveal, reply, return) into the notification and reveal work. The article side is the blog pipeline's job already.
11. and 12. Later.

## What we would actually do

Success metric, borrowed from the brainstorm because it is the right one: people who contribute in one week and return in a later week to contribute again. Today that number is 1. Target after four weeks: 5.

### Week 1: close the loop (mostly Claude)

| Step | What                                                                                                                                  | Why                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| A    | Reply email for logged-in users when someone replies to their take; one real end-to-end journey on the anonymous tray, on a phone     | The only proven retention event depends on it                                      |
| B    | "Start here" block of five light questions at the top of `/questions`; flag election questions out of browse; fix the pagination bug  | Front door matches the most-answered question in site history, not the deepest one |
| C    | Pin three contrasting answers per starter question                                                                                    | The reveal stops teaching people to pay the minimum                                |
| D    | Host digest: each morning, every new human take from the last 24 hours, with two drafted replies in DJ's voice, one tap to post as DJ | Turns hosting from a writing task into an approval                                 |

### Week 2: add people (DJ + Claude)

| Step | What                                                                                                                                                                                                         |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| E    | Founding-circle tasker: candidate list (the five recent logged-in commenters, coaching waitlist, the two reconciled August humans, friends), invite copy, four-week ask of one answer and one reply per week |
| F    | Weekly question email to the circle and the last 30 days of welcome enrollees, reusing the sequence engine                                                                                                   |

### Lean vs ambitious

- **Lean:** A, B, C, E. The loop closes. DJ replies by hand when he can. Realistic outcome: notifications bring back the people DJ happens to reply to.
- **Ambitious:** all six, with D as the engine and one added promise at the reveal: "DJ reads every take. You'll hear back." At current volume that is under one take a day, so the promise costs about ten minutes a day of approvals. This is the version where the gate stops being a toll and becomes correspondence.

## Forks for DJ to veto

1. **Reply email for logged-in users: default on, or opt-in?** Recommend default on with a one-click conversation unsubscribe (the anonymous path already has one). Opt-in would reproduce the zero we have now.
2. **Who pins the three answers?** Recommend Claude proposes, DJ approves in the same morning digest. Hand-picking fifteen answers is an afternoon; approving fifteen is ten minutes.
3. **Make the "you'll hear back" promise or not.** Only if D ships. A promise without the digest is the Instagram queue again.
4. **Election questions out of browse.** Recommend yes. They still get answers, which is exactly why they are the wrong first impression.

## Evidence

- Snapshot queries: `scripts/db-query.sh` against `questions`, `comments`, `give_first_funnel_events`, `comment_reply_subscriptions`, `reply_notification_outbox`, `question_feature_runs`, `profiles`, `email_sequence_enrollments`, run 2026-09-06.
- Feature run history: one manual run on question 569 (2026-08-14 to 08-21), 23 of 30 target impressions, one answer, ended "ineligible". Homepage has been on fallback question 567 since.
- Code trace: reply tray gating `src/lib/components/molecules/Interact.svelte:430-464`; logged-in notification trigger `supabase/migrations/20260725_notifications.sql:290-307`; cron scope `src/lib/server/replyNotificationDelivery.ts:157`; reveal ordering `src/routes/questions/[slug]/+page.server.ts:1078`; index ordering and pagination `supabase/migrations/20260813203000_question_editorial_audit.sql:249-263`.
- Prior workstream: [docs/growth/question-commenting/STATUS.md](../growth/question-commenting/STATUS.md), frozen at 2026-08-14 with QC-03 through QC-06 "deployed, verification pending". Nothing in that table has moved since.
