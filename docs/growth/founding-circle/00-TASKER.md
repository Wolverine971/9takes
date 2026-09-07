<!-- docs/growth/founding-circle/00-TASKER.md -->

# Tasker: Founding Circle

**For:** DJ, plus the agent that assembles the list and drafts the sends.
**Created:** 2026-09-06
**Status:** Ready to run once the reply-email and host-desk migrations are live
**Related:** [engagement response](../../product/2026-09-06-engagement-brainstorm-response.md), [question-commenting workstream](../question-commenting/STATUS.md), [weekly question](./01-WEEKLY-QUESTION.md)

## 0. What and why

Ten committed people who answer one question a week and reply to one other person for four weeks. Not a launch, not a community program. A jury small enough that DJ can reply to every one of them within a day, which is the one thing production data shows brings people back.

Two people already did this on their own and were left alone: one answered seven questions in one sitting on 2026-08-10 and never returned; one got a reply from DJ on 2026-07-16 and came back 26 days later with a long response. Both are on the list below.

Success after four weeks: at least five circle members who contributed in one week and contributed again in a later week. Today the site-wide count of such people is 1.

## 1. The ask (what a member agrees to)

- Answer the weekly question within the week. One sentence is fine.
- Reply to one other person's take each week. Not "great answer"; say what you saw differently.
- Four weeks, then they can stop with no guilt.
- Optional: tell DJ one thing that felt off about the site each week. He will fix it.

What they get: DJ replies to everything they write within a day. They see the same question answered by people who think nothing like them. Their four weeks of answers stay in one place under their account.

## 2. Candidate pool

Emails are not stored in this doc. Fetch with the query in section 6.

| Group                                             | Size      | Notes                                                                                                                                                                                           |
| ------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logged-in commenters, last 180 days               | 8         | All have emails. Priority: the two July/August stars (refs `07d2e6c9`, `d84e8e82`), then `cd399e93` (Type 9, joined 08-26), `9f3eecce`, `77326f68`, `c33ae80e` (Type 4), `ebe4b13e`, `bc01f1b6` |
| Profiles with email, last 90 days, no comment yet | ~7        | Signed up, never answered. Lowest-friction second ask.                                                                                                                                          |
| Coaching waitlist                                 | 18        | Only 1 in the last 180 days; treat as cold. Invite the 3 to 5 most recent.                                                                                                                      |
| DJ's own network                                  | DJ's call | Friends, family, past clients, the two reconciled August humans. Aim for 8 to 10 asks here.                                                                                                     |

Rough math: 30 to 35 asks at a 25 to 30 percent yes-rate yields 8 to 10 members. Send all invites in one 48-hour window so the first weekly question has a full jury.

## 3. Invite copy (DJ's voice, warm not cold)

Subject: `want in on something small?`

> Hey {first name},
>
> I'm putting together a small group, ten people, to actually use 9takes for four weeks. One question a week, answer it in a sentence or a paragraph, then read how nine kinds of people saw the same thing. I reply to every single take myself.
>
> You {answered "{question}" / signed up} back in {month}, and I'd like you in it.
>
> Reply "in" and I'll send the first question {day}.
>
> DJ

Rules: under 100 words, one ask, no link in the first email (the question email carries the link). Personalize the middle line from the query in section 6. For DJ's own network, drop the middle line and say why he thought of them.

Follow-up after 5 days to non-responders, two lines: "Still open. First question goes out {day}. In?"

## 4. Operating rhythm (four weeks)

| Day           | What                                                                                                                 | Who                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Monday 9am ET | Weekly question email to the circle (see 01-WEEKLY-QUESTION.md)                                                      | Scheduled via the email dashboard |
| Daily 9am ET  | Host desk digest: every new take from the last 24 hours with two drafted replies; DJ taps to post                    | Cron + DJ                         |
| Friday        | One-line "what was the most surprising take this week" reply to the whole circle, quoting one member with permission | DJ, drafted by agent              |
| Week 4 Friday | Close-out: thank-you, ask what they'd keep, invite them to stay                                                      | DJ                                |

Nothing in this rhythm requires DJ to write from scratch. Every send has a draft waiting.

## 5. Tracking

Append weekly snapshots here; never overwrite earlier rows.

| Week ending | Members | Answered this week | Replied to someone | Returned from earlier week | DJ reply median (hours) | Notes |
| ----------- | ------- | ------------------ | ------------------ | -------------------------- | ----------------------- | ----- |
|             |         |                    |                    |                            |                         |       |

Canonical SQL for the "returned from earlier week" column is in `sql/circle-return.sql` once the first week has data; until then, count by hand from the host desk.

## 6. Fetch the pool

```sql
-- Run with scripts/db-query.sh. Do not paste the output into the repo.
SELECT p.id, p.email, p.first_name, p.enneagram,
       count(c.id) AS takes, max(c.created_at)::date AS last_take,
       (SELECT left(q.question, 60) FROM comments c2 JOIN questions q ON q.id = c2.parent_id
         WHERE c2.author_id = p.id AND c2.parent_type = 'question' ORDER BY c2.created_at DESC LIMIT 1) AS last_question
FROM profiles p
LEFT JOIN comments c ON c.author_id = p.id AND c.removed IS NOT TRUE
WHERE p.email IS NOT NULL AND p.email <> ''
  AND p.id <> '9ce7ff91-d7f8-4397-b00d-8716e335aaee'
  AND (c.created_at > now() - interval '180 days' OR p.created_at > now() - interval '90 days')
GROUP BY p.id ORDER BY max(c.created_at) DESC NULLS LAST;
```

Check every address against `get_suppressed_emails` before sending. Anyone who unsubscribed from anything is not invited.

## 7. Do not

- Do not send the invite before the reply-email cron and host desk are live. The promise "I reply to every take" has to be true on day one.
- Do not invite more than 12. The point is that DJ can keep up.
- Do not use the reactivation sequence or any broad list for this.
- Do not put circle members' answers in social posts without asking them.
