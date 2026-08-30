<!-- docs/product/account-page-roadmap.md -->

# Account page: what shipped, and what it needs to become a real profile

Written 2026-07-25. Answers part 2 of the account-page brief ("figure out what
we need to add for this to be a legit profile page"). Parts 1 (UI) and 3
(notifications) are built — see the status section.

---

## Status: parts 1 and 3 are done

The page went from a profile form plus a stale followed-questions list to eight
sections: identity/type, question of the day, a 7-day community pulse, your own
contribution counts, a notification feed, others who share your type, the
most-answered questions this week, and settings (profile, notification
preferences, follows — follows demoted out of the main flow, since it was the
outdated part).

Notifications ship four kinds, fired by database triggers on existing write
paths so no app code has to remember to send them: someone replied to your take,
someone answered your question, someone else answered a question you answered,
someone liked your take. Anonymity is enforced by the schema — there is no
actor_id column, only a frozen `actor_enneagram`. Preferences are per-kind.

**Migration applied 2026-07-25** and verified: both tables, 3 triggers, 8
functions, 4 RLS policies, 6 indexes, 101 backfilled rows across 28 recipients,
all 4 kinds present, 0 unread (backfill correctly landed as already-read), and
0 actor-identity columns — the anonymity guarantee holds at the schema level.

**Outstanding chore:** `database.types.ts` has not been regenerated, so the
notification call sites still use `(supabase.rpc as any)` casts. `supabase gen
types` needs either a container runtime (podman/docker — neither installed) or
an interactive `supabase login`. Two notes for whoever runs it: the
`SUPABASE_DB_URL` lives in `.env`, not `.env.local`, and its password contains a
`?`, which strict URL parsers read as the start of a query string — percent-
encode it to `%3F` or the CLI rejects the connection string. Also be aware the
CLI prints the password in plaintext on connection failure.

---

## The number that should drive every decision here

Measured read-only against production, 2026-07-25:

| Metric                                       | Value                      |
| -------------------------------------------- | -------------------------- |
| Total profiles                               | 149                        |
| Profiles that have set an Enneagram type     | 16 (11%)                   |
| Profiles that have _ever_ commented or asked | 32 (21%)                   |
| Distinct commenters, last 90 days            | **3**                      |
| Distinct question authors, last 90 days      | **2**                      |
| Comments, last 30 days                       | 24                         |
| Questions created, last 90 days              | 361 (from those 2 authors) |

9takes has **content but not conversation**. 361 questions and a 489-person
corpus against three people talking. This matters because the brief's goal was
"demonstrate that it's a lively community" — and the sections that report
liveliness will, for most of the 149 users, report a quiet room. The 7-day pulse
panel showing "1 new question, 4 takes" is honest and also the least persuasive
thing on the page.

That is not an argument against what got built. The plumbing is right and it had
to exist. It's an argument about **sequencing**: the account page can make
activity visible, but it cannot manufacture activity. Notifications amplify a
signal; right now the signal is near zero.

---

## Decisions

**1. The dead `email_digest` toggle — DECIDED 2026-07-25: hidden.** It was in the
schema, the UI, and the save path with nothing anywhere sending an email, so a
user could switch it on and wait forever. The control is now commented out of
the settings panel; the column, the RPC, and `prefs.email_digest` still
round-trip and default true, so no stored choice was lost. Restore the toggle in
the same change that ships the digest job — not before.

**2. What the pulse panel says when the room is quiet — DECIDED 2026-07-25:
show the opening.** DJ deferred this one. Below the liveliness bar the panel now
reads "N questions still waiting for a first take / Out of 413. Yours would be
the first one on the page," instead of a 7-day counter reading zero.

The reasoning, since this is a voice call worth being able to re-litigate: with
361 of 413 questions (87%) carrying zero takes, the defining fact about 9takes
is not that little happened this week — it's that almost every question is still
open. "Your take would be the first" is therefore the _more_ accurate statement,
not the softer one, and it's the only framing where the backlog reads as an
asset rather than as evidence of abandonment. It also converts the one panel a
user can't act on into the one action the platform is starved of.

The bar itself encodes the product claim rather than an arbitrary number: a week
is worth reporting when **≥8 takes from ≥3 distinct types** landed, because
"nine ways to see it" is the promise — 20 takes from a single type is not a
pulse. Implemented as `isRoomLively()` in `accountDashboard.ts` (unit-tested,
including both boundary directions) and computed server-side, since
`$lib/server` cannot be imported as a value into a component. The panel flips
back to the live pulse on its own once the room clears the bar, so this needs no
revisiting as the community grows.

**3. How public is a public profile? — STILL OPEN.** `/users/[externalId]` exists
and is thin:
type, first name, join date, follows. Making it a real profile means showing
someone's takes — which partially undoes the anonymity the notification schema
deliberately protects. Lean version: profiles stay type-only, no take history.
Ambitious version: an opt-in public "take wall" where a user chooses to attach
their name to their answers, making a handful of visible regulars who give the
place a face. The ambitious one is how a forum grows a culture; it's also a real
reversal of the anonymity promise, so I won't pick it for you.

---

## What to build, in order

### Tier 0 — honesty ✅ done 2026-07-25

The dead `email_digest` toggle is hidden, and the quiet-week panel now shows the
opening rather than a zero counter. Both per the decisions above.

### Tier 1 — close the loop: the digest

This is the highest-leverage item and it is ~90% built. The notifications table
now generates exactly the events a digest needs; `src/lib/email/` has templates,
a sender, sequences and suppression; the cron pattern and `CRON_SECRET` guard
already exist under `src/routes/api/cron/`. What's missing is one job that
selects unread notifications grouped by recipient where `email_digest = true`,
and one template.

Why it matters: the account page is a **pull** surface — it only works on someone
who already came back. Per the email-sequence audit, activated users currently
exit into permanent silence. The digest is the push that makes the account page
reachable at all.

Caveat that follows directly from the numbers: for most users the digest will be
empty. So it should be **event-triggered, not scheduled** — send when a person
has unread notifications, never on a fixed weekly beat that mails "nothing
happened." A digest that only arrives when something actually happened is a signal; a
weekly empty one trains people to ignore it.

### Tier 2 — show people their own words ✅ done 2026-07-25

The "What you've added" panel now lists the reader's five most recent takes
under the counts: the question each answered, the take itself, and what came
back ("3 replies · 2 likes", or "No replies yet"). `loadYourTakes` +
`buildYourTakes` in `accountDashboard.ts`, the assembly split out as a pure
function and unit-tested (orphaned questions, unslugged questions, blank takes,
newest-first ordering, negative like-count clamping).

Implementation note for whoever touches this next: questions are fetched by id
rather than joined, because `comments.parent_id` is polymorphic
(`parent_type` = 'question' | 'comment') and therefore carries no foreign key
for PostgREST to traverse. Verified against production — all of the most active
user's takes resolve to real questions and URLs.

### Tier 3 — reflect the give-first mechanic

The give-first gate is instrumented (`give_first_funnel_events` is live) but the
account page says nothing about it. "Questions you've unlocked" / "questions
still locked" turns the core product mechanic into a visible reason to go answer
something. This is the one item that converts account-page attention directly
into the contribution the platform is starved of.

### Tier 4 — public profile

Per decision 3. Deliberately last: it's the item with a real product-values
tradeoff, and it does nothing for reactivation until there are more than three
people talking.

---

## The honest summary

Parts 1 and 3 of the brief are done and the infrastructure worry was well
founded — it genuinely didn't exist and now does. But the thing that will
actually make 9takes feel lively is not on this page. With 3 active commenters,
the constraint is contribution, not visibility. Tier 1 (digest) and Tier 3
(give-first reflection) are the two items that attack contribution; the rest
make an already-engaged user's experience better, which is worth doing but will
not move the number that's actually stuck.
