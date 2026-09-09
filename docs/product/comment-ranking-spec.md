<!-- docs/product/comment-ranking-spec.md -->

# Comment ranking: the default order on a question page

**Status:** v2 approved by DJ 2026-09-07 (browser ranking, 100-take fetch cap, nine-take threshold, blind view increments). Decisions 4 to 8 in section 9 stand as recommended unless DJ says otherwise. Phases 2 and 3 implemented 2026-09-07; database migration applied to 9takes 2026-09-07. Phase 2 is deployed and verified live 2026-09-08; Ranked remains off pending the observation gate. The verification found a missing-cookie permission-check edge case, fixed locally and awaiting redeployment. Phase 4 remains an experiment backlog. See [deployment verification](comment-ranking-verification-2026-09-08.md).
**Owner:** DJ
**Replaces:** the separate "Three takes that don't agree" block (removed 2026-09-07). Curation survives as a backend boost only.

## 1. What this is for

When someone answers a question, the comments they see next are the reward. Today the default order is newest-first, which means the reward is whatever was typed last, including one-word toll answers. The one number that matters for this system: **the first screen of comments after the reveal should be worth the answer the person just gave, and every sincere comment should get its turn on that screen.**

Two goals, in priority order:

1. **Fair exposure.** Every comment above the quality floor gets seen in roughly equal proportion over time. No comment is left behind because it was posted at the wrong hour.
2. **Quality first within a turn.** Among comments that are owed the same amount of exposure, the better ones lead.

Likes are a signal, not a ladder. A comment that has already collected several likes has been validated and no longer needs the top slot; it yields the front to comments that have not had their turn yet.

This is one list. There is no separate curated section, no "read these first" label. The order is the product.

Two constraints from DJ that shape everything below:

- **It must not slow the page down.** So the browser orders the takes, from one fetch, and view counting never touches the render path.
- **It must not kick in on small questions.** Under nine takes everything fits on one screen and nobody is left behind, so there is nothing to rotate. The tenth take turns the ranking on.

## 2. Vocabulary

| Term       | Meaning                                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Take       | A top-level comment on a question. Replies to comments are not ranked by this system; they stay chronological under their parent.                                                                            |
| View       | One qualified impression of a take: the card was at least half visible for at least one continuous second, the discussion was unlocked, and the viewer is not the author. Counted once per browser per take. |
| Viewer key | The logged-in user id, or the anonymous fingerprint the site already uses for give-first.                                                                                                                    |
| Boost      | An editorial flag set in `/admin/questions`. Today it is `questions.pinned_comment_ids`. It gives a take a head start; it does not exempt it from rotation.                                                  |
| Round      | How many turns of exposure a take has already had: `floor(effective_views / T)`.                                                                                                                             |
| T          | The turn size, in views. Starts at 5.                                                                                                                                                                        |
| Threshold  | The take count at which ranking turns on: 9. Below it, the order is boosted, then most liked, then newest.                                                                                                   |
| Floor      | Takes below the quality floor (one word, under 3 characters, or moderated down) rank after every take above the floor, always. They are still shown.                                                         |

## 3. The ranking rule

### 3.0 Under nine takes

If the question has nine or fewer top-level takes, skip everything else in this section. Order:

```
1. boosted takes, in curated order
2. like_count descending
3. created_at descending   (newest first among the unliked)
```

Nine takes fit on one screen. Every one of them is seen by everyone who unlocks, so exposure is already equal and the only job is to put the best first. Views are still counted below the threshold (section 4), so the rounds are already meaningful the day the tenth take lands.

### 3.1 Ten takes and up

For each take on the question, compute:

```
effective_views = views + LIKE_WEIGHT * likes            LIKE_WEIGHT = 3
round           = floor(effective_views / T)             T = 5
quality         = boost_bonus + like_rate + reply_bonus  (see 3.3)
```

Then order:

```
1. above-floor takes before below-floor takes
2. round ascending          (fewest turns first: this is the rotation)
3. quality descending       (best first within a turn)
4. created_at ascending     (older first; a stable tiebreak so the order is deterministic)
```

The viewer's own take is not part of this list; it renders where it does today, at the top under their name.

### 3.2 Why this produces what DJ described

- **"Once a comment gets 5 views it goes to the back of the line until the rest get 5 views."** That is round 0 to round 1. A take at 5 views sits behind every take with fewer than 5, and comes forward again only when the others have also reached 5. Then the bar is 10, then 15. Rounds are the "5 becomes 10 becomes 15" mechanic with no extra state.
- **"Predetermined good comments get top priority."** Boost adds to quality, so boosted takes lead round 0 on a fresh question. They still rotate: after 5 views they are round 1 like everyone else. Boost is a head start, not a pin.
- **"Liked comments go to the back of the pack when they have multiple likes."** A like counts as three views of exposure. A take with 3 likes and 4 real views has 13 effective views: round 2. It has been seen and validated; it yields the front to takes still in round 0 or 1. Within its own round it still leads, because its like rate is high.
- **"I don't want any comments left behind."** Round ascending guarantees that a take with zero views is ahead of every take with five, no matter how good the five-view takes are. The only takes that wait are the ones below the floor, and they still appear at the end.
- **"Rank from high quality to low quality."** Inside each round, yes. Across rounds, exposure wins. That is the trade the two goals require, and it is the right trade for a small community where being seen is the retention event.

### 3.3 Quality inside a round

```
boost_bonus = 1.0 if boosted else 0        (a boosted take leads its round)
like_rate   = (likes + 1) / (views + 6)    (smoothed: a fresh take starts at 0.17,
                                            1 like on 2 views is 0.25, 5 likes on 10 views is 0.38)
reply_bonus = min(replies, 3) * 0.05       (a take that started a thread earned something)
```

The smoothing keeps a take with 1 like on 1 view (0.29) from outranking a take with 8 likes on 20 views (0.35). The boost bonus is deliberately larger than anything likes can produce, so a boosted take always leads whatever round it is in. What the boost does not do is skip the line: after five views it is round 1 and waits behind every take that has not had its turn. Editorial choice decides who goes first within a turn; exposure decides whose turn it is.

### 3.4 The floor

A take is below the floor when any of these is true:

- fewer than 3 characters
- no alphanumeric character
- a single word of 12 characters or fewer ("Nothing", "Pooopin", "lol")
- the host desk marked it low effort and DJ did not post a reply to it

Below-floor takes keep their round and quality ordering among themselves. They are never hidden. If a below-floor take collects a like, it is still below the floor; the floor is about the text, not the reception. DJ can lift one manually from `/admin/questions` by boosting it, which sets `boost_bonus` and overrides the floor.

### 3.5 Worked example

Question 118, "what were you like as a kid in 3 words," has 35 takes, 9 of them with likes (11 likes total) and 3 boosted (375, 372, 661); two bare links that were never answers were removed on September 6. Take T = 5.

**Day 0, nobody has viewed anything.** Every take is round 0. Boosted three lead (quality 1.17 each, tiebreak by created_at). Then the nine liked takes by like rate, then the rest by created_at ascending, then any below-floor takes.

**After the first 5 answerers.** Each answerer saw the first screen, roughly the top 8 to 10 takes. Those now have 5 views and are round 1. The boosted three, plus the top liked ones, drop behind the ~25 takes still at 0 views. The next answerer sees a screen led by takes that have never been seen. This is the rotation.

**A take gets a like during round 0.** Say take 579 ("curious, compassionate, approval-seeking") gets 1 like on its 2nd view. Effective views: 2 + 3 = 5. It is now round 1, and leaves the front early. That is the intended behavior: the like already did the job the exposure was for.

**After ~20 answerers.** Every above-floor take has had at least one turn. The first ones back at the front are the ones with the fewest effective views, so the takes that did not earn likes on their first turn get a second chance before the ones that did. Over 50 answerers, exposure counts converge toward equal, with liked takes slightly behind.

### 3.6 Turn size: fixed 5 or a percentage?

Start with a fixed T = 5. At current traffic (a question gets a few views a week), a percentage of the question's total views is a noise figure; 5 is legible and the rotation is visible to DJ in the admin.

The percentage variant to test in phase 4: `T = max(5, ceil(mean_effective_views_on_question))`. With that rule, a take is at the front if it is below the average exposure, which is the "equal proportions" goal stated directly. It self-scales as a question gets busier, so a popular question with 500 views does not need 100 turns to reach the back of the list.

## 4. Counting views

The rule that keeps this fast: **the page never computes anything from views.** It reads one integer column per take, `comments.view_count`. Counting happens after the fact, in a beacon, and costs the reader nothing.

### 4.1 What counts

A view is recorded when all of these hold:

- the discussion is unlocked for the viewer (they answered, or they are logged in and already answered before)
- the take's card was at least 50% inside the viewport for at least 1,000 ms without interruption
- the viewer is not the take's author (checked in the browser by user id or fingerprint, and again on the server)
- this browser has not already counted this take

Scrolling past at speed does not count. Opening the page and leaving does not count. Reloading five times counts once.

### 4.2 Client

An `IntersectionObserver` on each rendered take card with `threshold: 0.5`. On enter, start a 1 s timer; on leave before it fires, cancel. When it fires, push the take id into a batch. The batch is sent every 2 seconds, and on `pagehide` via `navigator.sendBeacon`, to `POST /api/comments/views` as `{ questionId, commentIds: [] }`.

Dedupe lives in the browser: `localStorage` keeps a set of counted take ids per question (capped at 500 ids per question, oldest dropped). Once counted, a take is never sent again from that browser. That is the "once per viewer" rule, implemented where it is free.

### 4.3 Server

`POST /api/comments/views`:

- Rate limited per viewer key through the existing `api_rate_limit_events` limiter: 30 requests per minute, at most 40 ids per request.
- Validates that every id is a top-level, non-removed take on `questionId` and that the viewer is not its author.
- Runs one statement: `UPDATE comments SET view_count = view_count + 1 WHERE id = ANY($ids)`.

No table, no unique index, no join at read time. A page with 38 takes produces at most 38 increments over the whole visit, in one or two requests.

### 4.4 What this gives up, and when to change it

A blind increment can be inflated by someone clearing storage, using two browsers, or scripting the endpoint. The consequence is bounded: an inflated take rotates to the back sooner, on one question, which is the mildest possible failure. If that ever shows up in the admin readout, add a `comment_views (comment_id, viewer_key)` table with `ON CONFLICT DO NOTHING` behind the same endpoint. The client and the ranking do not change; only the increment does. That is the only reason to build the table, so it is not built first.

### 4.5 Storage

```sql
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
```

That is the whole migration. `view_count` is already in the row the page fetches, so reading it adds nothing.

## 5. Serving the order

### 5.1 In the browser, from one fetch

The page load fetches every top-level take on the question in one query, newest first, capped at 100. The cap is a safety rail, not a design limit: the most-answered question has 35 takes, the corpus adds about 30 a month, and the average take is 107 characters (95th percentile 479). With the profile and like joins that is about 500 bytes per take, so a full 100 is roughly 50 KB raw and about 12 KB over the wire, which is an ordinary page. The browser then:

1. runs `rankTakes(takes, options)` once, a pure function in `src/lib/components/questions/commentRanking.ts` with its own spec
2. renders the first 10
3. reveals the next 10 on scroll from memory, with no request

This replaces the current shape, which fetches the newest 10, sorts those in the browser, and pages the rest by date. It also fixes the standing bug where the "likes" sort only ever ranked the newest ten.

If a question ever exceeds the cap, the first 100 are ranked in the browser and the rest are paged by date from the server, excluding ids already shown. No question is anywhere near this. The DOM stays small regardless: 10 cards render at a time.

### 5.2 The order is frozen for the visit

Ranking runs once per page load. Likes and views that arrive while someone is reading do not reshuffle the list under them. A like the reader gives updates that card's count, not its position. The next load re-ranks. This is the rule that keeps the list from feeling alive in the wrong way.

### 5.3 The sort control

The toolbar keeps its options and gains one. All of them run in the browser over the fetched set, so switching is instant and the server sort action goes away.

| Option               | Order                                        |
| -------------------- | -------------------------------------------- |
| **Ranked** (default) | this spec (section 3.0 or 3.1 by take count) |
| Newest               | created_at desc                              |
| Oldest               | created_at asc                               |
| Likes                | like_count desc, then ranked                 |

Views are counted under every sort. The chosen sort is remembered for the session, not the account.

### 5.4 Before the gate unlocks

The three blurred previews shown before someone answers are AI takes today. Once views are flowing, use the top three of the ranked human list instead, still blurred. Out of scope for the first pass; noted so the preview and the reveal do not drift apart.

## 6. Admin

`/admin/questions` already has the curation panel. It becomes the boost panel, plus a per-take readout:

- boost order (the existing three-id list; consider lifting the cap to five once views exist)
- for each take: views, likes, replies, round, quality, below-floor flag, and its current rank
- a "reset views" button per question for testing (sets `view_count` to 0 on that question's takes; service role, audit-logged)

`/admin/host-desk` gains one column: rank of the take at the time it was posted, so DJ can see whether replies land on takes that are getting seen.

## 7. What to measure

Per question, weekly:

| Measure                   | What good looks like                                                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Exposure spread           | After 50 qualified views, every above-floor take has at least 1 view, and the most-viewed take has at most 3× the views of the least-viewed.                                  |
| First-screen floor rate   | Share of first-screen slots (top 8) occupied by below-floor takes: 0.                                                                                                         |
| Like rate by round        | Likes per view for takes on their first turn versus later turns. If later turns earn as many likes as first turns, rotation is surfacing good takes that newest-first buried. |
| Answer length on starters | Median characters of new takes on the five starters, before and after. The reveal is the teacher.                                                                             |

Canonical SQL for these goes in `docs/growth/question-commenting/sql/` when phase 3 ships.

## 8. Rollout

| Phase               | What                                                                                                                                                                | Gate                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1 · done 2026-09-07 | Separate section removed. Boosted takes lead the one list, then newest.                                                                                             | Shipped.                                                                                                                  |
| 2 · views           | `view_count` column, the increment endpoint, the browser observer with local dedupe. No change to ordering yet.                                                     | One week of data on the five starters. Confirm views per take look like real reading, not every take on the page at once. |
| 3 · ranked default  | Fetch all takes in one query; `rankTakes` in the browser with the nine-take threshold; "Ranked" as the default sort; the server sort action retired; admin readout. | Exposure spread and first-screen floor rate look right on the starters for two weeks.                                     |
| 4 · tune            | Try the percentage turn size, LIKE_WEIGHT 2 versus 3, boost cap 5, human previews before the gate, and the per-viewer views table only if inflation shows up.       | Decide from the measures in section 7, not from feel.                                                                     |

Phase 2 is one column and one endpoint. Phase 3 is one pure function, one query change, and the observer wiring. Nothing here needs new infrastructure, and nothing runs on the render path except a sort of a few dozen objects.

## 9. Decisions for DJ

1. **Decided 2026-09-07: ranking runs in the browser from one fetch of all takes, capped at 100.** DJ's only requirement is that it is never slow; 100 is about 12 KB over the wire for a question three times bigger than the biggest one today.
2. **Decided 2026-09-07: threshold is nine.** Under nine: boosted, then most liked, then newest. The tenth take turns rotation on.
3. **Decided 2026-09-07: views are a blind increment with browser-side dedupe; no per-viewer table.** Cheapest possible, and the failure mode is mild. The table is the phase 4 fallback, not the starting point.
4. **T = 5 fixed to start, percentage in phase 4.** Veto if you want the percentage from day one.
5. **A like counts as three views.** This is the lever that sends validated takes to the back. Two is gentler, five is aggressive.
6. **Below-floor takes stay visible, at the end.** Alternative: hide them behind a "show short answers" toggle. I recommend visible; hiding is a moderation decision and this is a ranking system.
7. **The viewer's own take stays out of the ranked list** and keeps rendering under their name at the top.
8. **The order is frozen per visit.** Re-rank on the next load, never mid-read.

## 10. Implementation and rollout operations (2026-09-07)

- Applied `supabase/migrations/20260907175553_comment_ranking.sql` to the 9takes database (`nhjjzcsnmyotyhykbajc`) at 2026-09-07 17:55:53 UTC. Verified the columns, service-only functions, rank trigger, audit RLS, and live take/ranking RPCs on question 118 (35 takes). Deployment was confirmed live on 2026-09-08; the earliest retained production view batch is 2026-09-07 20:00:52 UTC.
- Keep `PRIVATE_COMMENT_RANKING_ENABLED=false` (also the default when unset). Live public controls show Default, and the admin panel confirms collection mode. Views are collected; the default remains boosted then newest. Sorting and local paging use the complete fetched set during this phase.
- After a week of plausible starter impressions, set `PRIVATE_COMMENT_RANKING_ENABLED=true` and redeploy to enable Ranked, including the nine-take threshold. Turning it off returns to the previous default while retaining view counts. The actual activation date, not the implementation date, is the answer-length baseline.
- `/admin/questions` → Boosts and exposure shows the proposed ranked positions in both modes. Save boosts and reload answers to refresh their metrics. Reset views is an explicit two-step admin operation, written transactionally to `comment_view_reset_audit`. Browser dedupe remains intact; use a fresh test browser or remove that question's `9takes:comment-views:<id>` localStorage entry when testing another impression after a reset.
- `/admin/host-desk` can set or clear a persistent low-effort flag. A posted host reply clears the moderation penalty; the text floor still applies until boosted. The rank at reply is captured transactionally for future posts from both admin and signed digest links; historical posts show a dash because their past exposure cannot be reconstructed.
- Weekly SQL and snapshot instructions are in `docs/growth/question-commenting/sql/comment-ranking-README.md`.

Implementation details: the one take fetch is a service-only `get_question_take_data` RPC. It returns the newest 100 plus the viewer's own takes outside the cap, with public profile/like data, an `is_own` boolean and a moderation boolean. It never returns fingerprints, IPs or host draft text. Only unlocked requests call it. Overflow uses a `(created_at, id)` cursor, and duplicates are dropped in the browser. The 10-card initial page grows by ten on scroll; already-read cards remain mounted so the list does not move while reading.

The view counter itself adds only `comments.view_count`; supporting SQL also supplies atomic increment/reset functions, a private reset audit, and two fields on the existing host-draft table. No per-viewer view table or phase 4 tuning has been added. `get_question_take_ranking` is for admin history and reports; public rendering ranks in the browser. The exact formulas in section 3 take precedence over the illustrative day-zero prose (liked takes can already be in later rounds at zero real views).

Validation: pure ranking and visibility timer tests, endpoint and page-load regressions, Svelte component flow tests, type checking and production build. `scripts/tests/comment-ranking-db.mjs` executes the migration in an isolated PostgreSQL WASM runtime, including role permissions, ownership/gate rejection, deduped increments, cursor boundaries, cap/own-take handling, moderation, rank snapshots and transactional reset auditing. Install `@electric-sql/pglite` in a temporary directory and pass its `dist/index.js` path to run it without adding a runtime dependency to the app.
