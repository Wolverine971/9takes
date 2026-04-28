---
title: "Welcome Sequence Audit — Through Sam McKenna's 'Show Me You Know Me' Lens"
date: 2026-04-27
status: review
scope: welcome-sequence (live), reactivation-sequence (in progress, NOT YET LIVE)
auditor: DJ + Claude
source_method: Sam McKenna (Sam Sales) — https://www.youtube.com/watch?v=ydsMxs2yeos
related_files:
  - src/lib/email/welcome-sequence-content.ts
  - src/lib/email/reactivation-sequence-content.ts
  - youtube-transcripts/2024-10-01-sam-mckenna-cold-email-43-percent-open-rate-ANALYSIS.md
path: docs/email-sequences/welcome-sequence-audit-2026-04-27-sam-mckenna.md
---

# Welcome + Reactivation Email Audit

> **Note:** The reactivation sequence is **not finished yet** — findings on it are framed as "to fix before going live," not "live problems."
>
> The welcome sequence **is live** — its findings are higher priority.

## Sam McKenna's principles, applied to our context

Sam is selling cold B2B to executives. We're sending opt-in welcome / reactivation emails. Some of her rules translate, some don't.

| Sam's principle                             | Applies to us? | How                                                                                                               |
| ------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| Subject specificity ("show me you know me") | ✅ partial     | Can't hand-craft per recipient, but can use _signup behavior_ (date, source) the way she uses fraternity/hometown |
| Subject + preheader = preview text          | ✅ fully       | Both columns matter; we should write them as a unit                                                               |
| Pre-empt the objection in the body          | ✅ fully       | The objection here is "why am I getting this?" or "what's in this for me?"                                        |
| Longer body when the length is earned       | ✅ fully       | Already mostly doing this                                                                                         |
| "Show me you know me" hooks                 | ✅ partial     | Use signup date / source — that _is_ knowing them                                                                 |
| No calendar links in CTA                    | ➖ N/A         | We don't book calls in welcome emails                                                                             |
| Make-no-sense-to-anyone-else subject        | ❌             | Sam's rule for 1:1 prospecting; doesn't fit broadcast email                                                       |

---

## Subject-line scorecard

### Welcome Sequence (`welcome-sequence-content.ts`) — LIVE

| #   | Subject                                                           | Grade  | Notes                                                                            |
| --- | ----------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| 1   | `You answer before you read. Here's why that matters.`            | **B+** | Pattern-interrupt is good; "Here's why that matters" is a tired marketing phrase |
| 2   | `The 3 questions I ask before I decide someone's being rude`      | **A-** | Strong. Curiosity + framework promise                                            |
| 3   | `"Why are people so fake?" is a broken question. Here's the fix.` | **A**  | Quoted hook works; "Here's the fix" is the only soft spot                        |
| 4   | `If 9takes isn't useful in these 3 moments, unsubscribe.`         | **A+** | Best subject in the entire set. Use this as the template.                        |

### Reactivation Sequence (`reactivation-sequence-content.ts`) — DRAFT

| #         | Subject                                                                              | Grade  | Notes                                                                                                 |
| --------- | ------------------------------------------------------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------- |
| Cold-1    | `{{first_name}}, you signed up in {{signup_month_year}}. Here's what 9takes is now.` | **A**  | Closest thing to Sam-style — uses signup-date as the personalization hook                             |
| Dormant-1 | `You signed up for 9takes in {{signup_month_year}}. Quick re-introduction.`          | **A-** | Solid; consider adding `{{first_name}}` for parity with Cold-1                                        |
| Zombies-1 | `You signed up for 9takes back in {{signup_year}}.`                                  | **A**  | "back in" carries the time-distance emotion well                                                      |
| Shared-2  | `why I'm obsessed with this`                                                         | **C+** | ⚠️ **Weakest subject in the set.** "this" has no antecedent. Could come from any newsletter on earth. |
| Shared-3  | `"he thinks she's cold. she thinks he's needy."`                                     | **A**  | Strong quoted hook                                                                                    |
| Shared-4  | `Do you still want emails from 9takes?`                                              | **A**  | Direct, honest, respectful                                                                            |
| Shared-5  | `You've been unsubscribed from 9takes.`                                              | **A**  | Functional; works                                                                                     |

---

## 🚨 Must-fix before reactivation goes live

### 1. Placeholder still embedded in Reactivation Shared Step 2 body

`src/lib/email/reactivation-sequence-content.ts:168` and `:181`:

```html
<p>
	<em>DJ note: replace this paragraph with the concrete story before activating the campaign.</em>
</p>
```

This will go out as italicized text to every reactivation recipient if any of the three reactivation sequences are activated.

**Action:** Either fill in the concrete story or delete the placeholder line. Do not ship the campaign with this in.

---

## Recommended subject-line rewrites

### A. Reactivation Shared Step 2 — `why I'm obsessed with this` → ?

The current subject fails Sam's specificity test. You couldn't tell from the subject alone what the email is about, even as someone who signed up. Options:

- `why I built 9takes — the actual story, not the pitch deck version`
- `the conversation I overheard that turned into 9takes` _(if the real story has a moment like this)_
- `200 words on why I keep doing this` _(echoes the preheader)_
- **`9takes wasn't a product idea. it was a pattern.`** ← my pick

**Why my pick:** pattern-interrupt, telegraphs the actual content of the email, matches the lowercase voice already used in steps 2 and 3.

### B. Welcome Step 1 — kill the "Here's why that matters" tail

**Current:** `You answer before you read. Here's why that matters.`

**Options:**

- `You answer before you read. The order is the whole product.` ← my pick
- `You answer before you read it. Here's the trick that makes that work.`

**Why my pick:** declarative, specific, drops the limp marketing tail.

### C. Welcome Step 3 — kill the "Here's the fix" tail

**Current:** `"Why are people so fake?" is a broken question. Here's the fix.`

**Options:**

- `"Why are people so fake?" is the wrong question.` ← my pick
- `"Why are people so fake?" — the broken question we keep asking.`

**Why my pick:** full stop. Curiosity is in the contradiction itself, not in a promised payoff.

---

## Body-level findings

### What's already working

- **Welcome Step 4 is a Sam-grade email end-to-end.** The "unsubscribe if not useful" subject + preheader pre-empts the objection, the body re-frames value via three specific moments, the close is non-presumptuous. Use this as the template for any future email writing.
- **Reactivation Cold/Dormant/Zombies Step 1** all use `{{signup_month_year}}` or `{{signup_year}}` — that _is_ the show-me-you-know-me move, applied to broadcast.
- **Zombies Step 1's pre-emption** — _"if this email is a surprise, the unsubscribe link at the bottom works on click one"_ — exact match for Sam's pre-empt-the-objection principle.

### What could be sharper

- **Welcome Step 1 doesn't pre-empt any objection.** A new signup's first thought is _"what is this and why am I here?"_ The current first sentence is conceptual ("Reading the room feels like wisdom…"). Consider opening with something like _"You just signed up for 9takes. Here's what you actually opted into…"_ before going into the philosophy.
- **Reactivation Cold Step 1 could pre-empt better.** Cold (vs. zombies) doesn't have the "unsubscribe on click one" line. Re-engaged users from 2-3 months ago might be just as confused. Consider porting that line over.
- **CTAs are mostly fine** — no calendar-link presumption issues anywhere. The "Run the loop" / "Answer one live question" CTAs are low-friction and pass Sam's test.

### First-name personalization in subjects

Only **Reactivation Cold Step 1** currently uses `{{first_name}}` in the subject. The most leverage from `{{first_name}}` is on the _first_ email someone receives in a sequence. Worth testing on:

- Welcome Step 1 — e.g. `{{first_name}}, you answer before you read.`
- Reactivation Dormant Step 1 — already proposed above

---

## Summary of recommended actions

| Priority                        | Action                                                          | File:line                                    |
| ------------------------------- | --------------------------------------------------------------- | -------------------------------------------- |
| 🚨 P0 (reactivation pre-launch) | Delete or replace the "DJ note" placeholder                     | `reactivation-sequence-content.ts:168, :181` |
| ⭐ P1 (welcome live)            | Rewrite Welcome Step 1 subject — drop "Here's why that matters" | `welcome-sequence-content.ts:17`             |
| ⭐ P1 (welcome live)            | Rewrite Welcome Step 3 subject — drop "Here's the fix"          | `welcome-sequence-content.ts:90`             |
| ⭐ P1 (reactivation pre-launch) | Rewrite Reactivation Shared Step 2 subject                      | `reactivation-sequence-content.ts:161`       |
| P2 (welcome live)               | Add `{{first_name}}` to Welcome Step 1 subject                  | `welcome-sequence-content.ts:17`             |
| P2 (reactivation pre-launch)    | Add `{{first_name}}` to Dormant Step 1 subject for parity       | `reactivation-sequence-content.ts:77`        |
| P2 (reactivation pre-launch)    | Port "unsubscribe on click one" line into Cold Step 1 body      | `reactivation-sequence-content.ts:42, :56`   |
| P3 (welcome live)               | Add an objection-pre-empt opener to Welcome Step 1 body         | `welcome-sequence-content.ts:19, :31`        |

---

## Suggested batching

- **Batch 1 (live welcome sequence — ship now):** P1 subject rewrites (Welcome 1 + Welcome 3) + P2 first-name on Welcome 1. Single commit, low risk, immediately improves open rates.
- **Batch 2 (reactivation pre-launch — before activation):** P0 placeholder fix + P1 Shared Step 2 subject rewrite + P2 dormant first-name + P2 cold-step pre-empt line. All needed before the campaign turns on.
- **Batch 3 (welcome polish — optional):** P3 body rewrite of Welcome Step 1 opener.

---

## Source

- **Method:** Sam McKenna's "Show Me You Know Me®" cold-email framework
- **Video:** https://www.youtube.com/watch?v=ydsMxs2yeos (9:19, Apollo channel, 350K views)
- **Full extracted analysis:** [`youtube-transcripts/2024-10-01-sam-mckenna-cold-email-43-percent-open-rate-ANALYSIS.md`](../../youtube-transcripts/2024-10-01-sam-mckenna-cold-email-43-percent-open-rate-ANALYSIS.md)
