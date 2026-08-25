<!-- docs/marketing/enneagram-type-prompt-review-2026-08-24.md -->
# Enneagram type prompt — independent launch review

Date: 2026-08-24  
Decision: do not send the 137-person blast. Run a deliverability-gated pilot, then three small randomized copy cohorts.

## Production snapshot

- `enneagram_type_prompt`: draft, 0 sends.
- `reactivation_dormant`: stopped on 2026-08-24 after 273 recorded sends, 1 clicked message, 4 unsubscribes, and no verified returns.
- `reactivation_zombies`: paused on 2026-08-24 after 129 recorded sends, 5 clicked messages, 1 unsubscribe, and no verified returns.
- Untyped profiles with an email: 137.
- Conservative audience ready today: 33.
- Eventual clean pool after timing/sequence holds clear: 47.
- Current exclusions overlap: 62 globally suppressed, 54 unconfirmed, 17 in an active or paused sequence, 43 emailed in the previous seven days, 7 with a recorded hard bounce, and 1 admin.

## Independent verdict on the current email

The current draft is thoughtful but unlikely to maximize the action that matters.

What works:

- respectful; it does not pretend a quiz can assign someone a type;
- explains the three centers in language consistent with 9takes;
- has HTML, plain text, tracking attribution, and an unsubscribe footer;
- re-checks suppression, current type, and the seven-day email buffer before sending.

What weakens it:

- the subject is generic and offers no payoff;
- “We noticed…” sounds administrative and slightly surveillant;
- the message asks the reader to process a mini-lesson before giving them a reason to act;
- it has three competing destinations: the guide, account, and questions;
- the primary button goes to the guide even though success is a type saved on the profile;
- it explains the Enneagram but does not explain what becomes better for the reader after adding a type;
- the final “browse a question” ask is unrelated to the campaign goal.

Expected outcome if sent unchanged: some opens, few clicks, and fewer saved types. The email should be shorter, benefit-first, and centered on one primary action.

## Shared experiment rules

All variants use the same destination and layout so copy is the main variable.

- Primary CTA: `Add my type` → `https://9takes.com/account`
- Secondary text link only: the existing beginner’s guide for people who are unsure.
- Primary outcome: a valid profile type (1–9) saved within seven days.
- Secondary outcome: unique primary-CTA click within 48 hours.
- Guardrails: zero complaints, zero known hard bounces, no more than one unsubscribe per 10 recipients, and no sender-authentication failure.
- Do not use opens as the deciding metric; privacy proxies and image blocking make them noisy.
- Keep the same weekday and time across copy cohorts. Do not test timing and copy simultaneously.

## Variant A — product payoff (recommended pilot)

Implementation status: wired as the code-managed `enneagram_type_prompt` send body on 2026-08-24. The sequence remains in draft and has no enrollments.

Subject: **Make 9takes more useful to you**  
Preheader: **Add your Enneagram type in less than a minute.**

> Hi {{first_name}},
>
> 9takes gets more interesting when the same question is answered from nine different perspectives. If we know your Enneagram type, we can place your take in that conversation and show you where the other types see it differently.
>
> If you already know your number, adding it takes less than a minute.
>
> **[Add my type]**
>
> Not sure yet? Use the [10-minute guide to finding your starting point]. No quiz score gets to decide for you—choose the pattern you recognize in yourself.
>
> DJ  
> 9takes

Why it may win: it leads with the reader’s payoff, not the missing database field.

## Variant B — recognition and curiosity

Subject: **Which Enneagram pattern feels most like you?**  
Preheader: **Start with what your attention manages automatically.**

> Hi {{first_name}},
>
> Everyone uses anger to protect autonomy, shame to manage connection, and fear to anticipate what comes next. The Enneagram asks a more useful question: which pattern organizes your attention before you even notice it?
>
> If one of the nine types already feels recognizable, add it to your profile.
>
> **[Add my type]**
>
> Still narrowing it down? Use the [10-minute guide]. Your type is the pattern you recognize—not a score a quiz hands you.
>
> DJ  
> 9takes

Why it may win: it creates a small open loop while preserving the 9takes point of view.

## Variant C — direct founder note

Subject: **Do you already know your Enneagram type?**  
Preheader: **One small profile update makes 9takes less generic.**

> Hi {{first_name}},
>
> I’m trying to make 9takes feel less generic. Right now your profile does not have an Enneagram type, so the site cannot connect your perspective to the other eight.
>
> If you know your type, would you add it? It takes less than a minute.
>
> **[Add my type]**
>
> If you do not know yet, there is no pressure. This [short guide] will help you narrow it down without pretending a quiz can decide for you.
>
> Thanks,  
> DJ

Why it may win: it is candid, human, and has the lowest cognitive load.

## Rollout

### Gate 0 — authentication

Yahoo rejected recent 9takes mail with `550 5.7.9`: SPF passed, but DKIM failed. DNS currently publishes SPF, DMARC, and a `google` DKIM key, but the next send must not rely on DNS presence alone. Confirm that Google Workspace is actively signing outbound mail and complete one end-to-end Yahoo delivery test. Do not classify these authentication blocks as bad recipients.

### Gate 1 — first 10

- Send Variant A to 10 randomly selected ready recipients.
- Mirror the clean-pool provider mix, but exclude Yahoo until the authentication test passes.
- Recommended time: Tuesday, 2026-08-25 at 10:00 AM America/New_York.
- Review delivery failures after 24 hours, clicks after 48 hours, and saved types after seven days.
- Continue only if there are no complaints/authentication failures/hard bounces and at least one click. A saved type is a stronger positive signal than a click.

Decision tree:

- Low/no opens plus no clicks: inspect delivery and subject before changing the body.
- Opens but no clicks: the value proposition or CTA failed; advance C before B.
- Clicks but no saved types: the account destination or profile-edit flow is the bottleneck.
- At least one saved type: proceed to the three-variant cohort test.

### Gate 2 — three variants

- Wait until at least 30 additional clean recipients are eligible.
- Randomly assign 10 each to A, B, and C, stratified by mailbox provider and recent activity.
- Send all three at the same local time on the same weekday.
- Preserve seven clean recipients as a no-email holdout from the eventual 47-person clean pool.
- Treat results as directional, not statistically conclusive. Promote a winner only if the result is supported by saved types, not clicks alone.

### Gate 3 — remaining clean audience

Send the winning version only if the combined test reaches at least a 15% seven-day type-save rate and stays inside the guardrails. Recalculate eligibility immediately before enrollment; never use the original 137-row export as a send list.
