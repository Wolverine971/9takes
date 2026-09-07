<!-- docs/growth/founding-circle/01-WEEKLY-QUESTION.md -->

# Weekly question: first four sends

**Created:** 2026-09-06
**Status:** Drafts for DJ's veto. Nothing scheduled, nothing sent.
**Audience:** founding circle (explicit recipient list) plus the last 30 days of welcome-sequence enrollees. Not the general list.
**Mechanism:** `/admin/email-dashboard` draft with an explicit `recipients` list and `scheduled_for` Monday 13:00 UTC (9am ET). The `send-scheduled-emails` cron already drains these every five minutes. No new code.

## Rules for every send

- One question, one link, under 120 words. The link goes straight to the question page, never the homepage.
- The question must pass the five tests in [05-QUESTION-WRITING-STANDARD.md](../question-commenting/05-QUESTION-WRITING-STANDARD.md).
- Never reveal answers to the coming week's question in the recap line.
- Each email carries the same promise the site now makes: DJ replies to every take.
- Subject lines are the question itself, lowercase, no punctuation tricks.

## Question sequence

Weeks 2 to 4 use prompts from the September 4 brainstorm. They do not exist as questions yet; DJ creates each one at `/questions/create` the Friday before (or says the word and the agent inserts it under his account). Week 1 uses the question DJ already wrote on 2026-08-14, which has one answer and needs a jury.

| Week | Question                                                                | Shape               | Exists?                                                            |
| ---- | ----------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------ |
| 1    | What's something you say "I don't mind" about when you actually do?     | hidden behavior     | yes, id 569, `/questions/s-something-say-don-t-mind-when-actually` |
| 2    | What compliment do you immediately argue with?                          | hidden behavior     | no                                                                 |
| 3    | When plans get canceled, what do you do with the suddenly free evening? | small social moment | no                                                                 |
| 4    | What did you love doing before you cared whether you were good at it?   | remembered example  | no                                                                 |

Perspective-spread check (three sincere answers that don't collapse into one moral), done 2026-09-06:

- Week 2: "that I'm calm" (I'm not, I'm managing) / "that I'm smart" (feels like a setup) / "that I'm easygoing" (it means I gave in). Three logics: masking, suspicion, resentment. Pass.
- Week 3: reclaim it for myself / text three people to fill it / lie on the floor relieved. Three logics: recovery, connection, escape. Pass.
- Week 4: drawing / basketball / building things in the garage. The interesting part is the moment they started caring, which differs for every person. Pass.

## Week 1 email

Subject: `what's something you say "i don't mind" about when you actually do?`

> Hey {first name},
>
> First one. Keep it small and true.
>
> **What's something you say "I don't mind" about when you actually do?**
>
> One sentence is a full answer. After you post, you'll see how other people answered, and I'll reply to yours within a day.
>
> {link to question 569}
>
> DJ

## Week 2 email

Subject: `what compliment do you immediately argue with?`

> Hey {first name},
>
> Last week {n} of you answered. The spread was wider than I expected; the same three words meant three different things.
>
> This week:
>
> **What compliment do you immediately argue with?**
>
> Say the compliment and what you say back, out loud or in your head.
>
> {link}
>
> DJ

## Week 3 email

Subject: `when plans get canceled, what do you do with the free evening?`

> Hey {first name},
>
> **When plans get canceled, what do you do with the suddenly free evening?**
>
> Not what you think you should do. What you actually did last time.
>
> {link}
>
> If someone's take from last week stuck with you, go reply to it. That's the whole point of this.
>
> DJ

## Week 4 email

Subject: `what did you love doing before you cared whether you were good at it?`

> Hey {first name},
>
> Last one of the four.
>
> **What did you love doing before you cared whether you were good at it?**
>
> Name the thing, and if you can, the moment you started caring.
>
> {link}
>
> Thank you for doing this. I'll send one more note Friday with what I learned from reading all of it.
>
> DJ

## Recap line rule

The Friday note and the following Monday's opener may quote one take from the previous week with the author's permission (ask in DJ's reply to their take). Never quote anonymous takes by fingerprint; only account holders who said yes.
