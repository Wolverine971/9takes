<!-- docs/email-sequences/enneagram-campaign-readiness-2026-09-08.md -->

# Enneagram email campaign readiness — September 8, 2026

## Implementation follow-up — local fixes completed

The fixes below are implemented in the working tree. **They have not been deployed. Production delivery still needs the real mailing address for `EMAIL_FOOTER_ADDRESS`; that value has been requested from DJ.** No campaign has been activated and no recipients have been enrolled or sent an email by this task.

- Logged-out `/account` visitors go to login with their account destination and attribution preserved. Login retains that destination through failed attempts and successful authentication. Return destinations are restricted to `/account` to prevent external redirects.
- Selecting a first type keeps the Save type button visible. The UI checks the server action result before confirming a save and refreshes account data afterward. The hydration comparison cache no longer erases a saved selection with old server data. The account action rejects invalid type values.
- The pilot subject is now **“What do you notice that other people miss?”** The body leads with different interpretations of the same conversation and connects adding a type to comparing perspectives. The single primary account CTA and secondary guide remain.
- The campaign audience uses the delivery suppression RPC and fails closed when it is unavailable. Errored enrollments have their own hold category, removing the four stalled overlaps from the prior 35-person eligible pool.
- The campaign screen shows missing delivery settings, the selected provider, and stopped enrollments in active sequences. The cron checks configuration before claiming work, preserving retries when configuration is missing; it reports stopped enrollments even on otherwise idle runs.

Validation: **67 focused tests passed across 10 files** (login, account rendering and saving, audience exclusions, delivery configuration, cron behavior, email preparation and sending mocks). The Svelte check found no errors; component analysis introduced no new issues relative to the original files. The new read-only production health query returned four stopped enrollments in active sequences.

Preview: [`artifacts/email-campaign/enneagram-type-pilot-preview.html`](../../artifacts/email-campaign/enneagram-type-pilot-preview.html). This is a local preview using a sample recipient, without a configured mailing address or real unsubscribe token; it is not a deliverability test.

To finish production setup once the address is supplied:

1. Set the real address in Vercel production and deploy the reviewed email/account changes, keeping unrelated working-tree changes out of the deployment.
2. Confirm that the deployed logged-out account link reaches login and preserves its return destination, and that the campaign screen reports the configured sender.
3. Review the four welcome enrollments whose last error is the footer configuration failure. Before re-arming each one, confirm its next-step send has no `sent_at` or provider message ID, remains unsuppressed, and is not completed elsewhere. Preserve its current/next step and existing idempotency key; reset failure count and queue only the unsent step.
4. Verify inbox delivery and sender authentication with an authorized test, then recheck the pilot audience before enrollment. The one-off remains a draft until launch.

## Original production audit

Checked against production at approximately 10:28 PM America/New_York (2026-09-09 02:28 UTC), the current Vercel production environment-variable inventory, local implementation, and unauthenticated requests to the live destinations. This was an audit: no messages sent, recipients enrolled, campaign states changed, or production settings changed.

**Verdict: the one-off campaign is built but has never launched, and is not ready to send.** The email delivery setting and the logged-out destination need attention before a pilot. The existing copy is primarily a profile-completion invitation; it is not a multi-email course that helps someone discover their type.

## What exists

| Item                                                       | Verified status                                                                                                  |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `enneagram_type_prompt` / Missing Enneagram Type — One-Off | Draft; one step; zero enrollments; zero send records; last updated August 24                                     |
| Current implemented subject                                | “Make 9takes more useful to you”                                                                                 |
| Current preheader                                          | “Add your Enneagram type in less than a minute.”                                                                 |
| Main action                                                | “Add my type” → `/account`                                                                                       |
| Secondary action                                           | The existing beginner’s guide for readers who are unsure                                                         |
| Other copy options                                         | Recognition/curiosity and direct founder note are drafted; the send-content resolver currently returns Variant A |
| Existing rollout plan                                      | An initial 10-recipient pilot, followed by delivery, click, and saved-type reviews; no pilot has occurred        |

The copy includes HTML and plain text, and the sequence preparation code attaches email attribution. The send path checks suppression and rechecks whether a recipient has added a type or received an email within seven days. These are code observations, not proof of an end-to-end successful delivery.

Campaign screen: [Enneagram campaign](https://9takes.com/admin/enneagram-campaign).

## Current audience

The live database has 160 profiles, of which 139 have an email and lack a valid type (1–9). Applying the current audience priorities with the live suppression RPC gives:

| Classification                                                              | People |
| --------------------------------------------------------------------------- | -----: |
| Suppressed                                                                  |     62 |
| Email unconfirmed, after suppression exclusions                             |     28 |
| Already in an active/processing/paused enrollment, after earlier exclusions |     13 |
| Admin, after earlier exclusions                                             |      1 |
| Pass these eligibility checks                                               |     35 |

These rows are mutually exclusive and total 139. The earlier headline of 76 unsuppressed addresses was not a send-ready audience. Today the corresponding unsuppressed count is 77, but only 35 pass the additional checks.

Four of the 35 have an **errored enrollment in another sequence**. The current audience logic does not hold errored enrollments. As an audit recommendation, review those four before contacting them or restarting their other sequence; excluding them temporarily leaves 31 candidates. One of the 35 uses Yahoo/AOL, which matters because the August review documented a Yahoo authentication rejection. Recalculate before any enrollment.

## Launch blockers and verification gaps

1. **Marketing delivery is blocked by configuration.** `EMAIL_FOOTER_ADDRESS` is absent from the current Vercel production environment-variable inventory. The local value is also empty, contrary to the older report’s statement that a local value was available. The sender rejects marketing mail without it. All four unfinished welcome enrollments remain errored after three failures with `EMAIL_FOOTER_ADDRESS is required for marketing email delivery`. The last recorded successful welcome send was September 1 at 20:30 UTC; the four failed send records are dated September 2–4. Restoring the setting alone will not restart these stopped enrollments.

2. **The primary CTA loses logged-out recipients.** A live unauthenticated GET of `https://9takes.com/account` returned **302 → `/questions`**. The account loader implements this redirect, and the normal login action also redirects to `/questions`. A recipient who clicks “Add my type” while logged out is not taken through sign-in back to the intended task. Preserve the account/type-edit destination through sign-in and verify the saved type afterward.

3. **Mailbox delivery still needs an actual test.** The August 24 review documented Yahoo rejecting mail for failed DKIM. This audit did not send a test message or establish that outbound signing has since been repaired. Vercel lists `RESEND_MARKETING_FROM`, but does not list `EMAIL_MARKETING_PROVIDER` or `RESEND_API_KEY`; current code therefore selects the Gmail path, not Resend. A sender address variable alone does not enable that provider.

4. **The staged three-variant test is not automatic.** Three versions exist in source, but the current resolver uses A. Do not assume that enrolling 30 people will randomize A/B/C. The old August 25 send date and 47-person pool in the launch review are stale.

The [beginner’s guide](https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type), `/enneagram-test`, and both question destinations used by the welcome series returned HTTP 200 during direct live checks. That establishes availability, not completion of the signed-in conversion flow.

## Hook assessment

“Find your Enneagram type” is a reasonable entry point for someone already curious about personality. My editorial judgment is that the more useful promise is **understanding your own reactions and seeing why another person reads the same situation differently**. Learning a number is an intermediate step toward that payoff.

The implemented message does some of this well: it explains that a type connects someone’s perspective to the other eight, keeps one main action, and leaves the guide as a secondary option. Its subject, “Make 9takes more useful to you,” is vague, and the body assumes the reader may already know their number. It should be evaluated as a profile-completion email.

An untested subject direction for that same email is **“What do you notice that other people miss?”**, with a preheader such as “Add your Enneagram type to compare your perspective with the other eight.” This is a copy hypothesis, not a performance-backed winner.

If the intended campaign is a guided discovery journey, the primary action should instead help readers recognize a pattern, then narrow their type, save it, and compare perspectives. That is additional campaign work; the one-off currently supplies only a secondary guide link. The guide also promises a definite result in ten minutes more strongly than the email’s “starting point” language, so align those expectations before using discovery as the lead promise.

## Related sequences

| Sequence                                 | Current status                                                 | Recorded result                                                                                                                          |
| ---------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Welcome: four emails on days 0, 2, 5, 10 | Marked active, but all four unfinished enrollments are errored | 37 total enrollments: 32 completed, 1 exited, 4 errored; 67 sends with a `sent_at`, 3 clicked messages                                   |
| Cold reactivation                        | Active but unused                                              | Zero enrollments and sends                                                                                                               |
| Dormant reactivation                     | Draft/stopped                                                  | 273 sends with a `sent_at`, 1 clicked message, 4 unsubscribed messages                                                                   |
| Older-user reactivation (“Zombies”)      | Paused                                                         | 129 sends with a `sent_at`, 4 clicked messages, 1 unsubscribed message; 16 enrollment rows still marked active under the paused sequence |

These are recorded message counts, not unique people or verified inbox placement. The broader welcome sequence already progresses from a childhood question to practical perspective-taking, a fear question with a typing link, and a check-in. Older waitlist markdown is brainstorming, not the current implemented copy. The separate `email_campaigns` table currently contains no rows; these programs live in the sequence tables.

## Recommended next actions

1. Supply the correct footer address in production, deploy as required, and review/recover the four failed welcome enrollments with duplicate-send checks.
2. Repair and verify the email → sign-in → account/type-save path.
3. Verify sender authentication and inbox delivery with an authorized test before enrolling a small audience.
4. Recheck recipients, review the four errored-enrollment overlaps, and run a 10-person pilot once sending is authorized. Measure saved types within seven days, with clicks as a diagnostic. The full-list three-way test should wait for enough eligible recipients and an explicit assignment mechanism.

## Implementation references

- `src/lib/email/enneagram-type-prompt-content.ts` — implemented email and candidate variants.
- `src/lib/email/sequences.ts` — managed copy selection and attribution.
- `src/lib/server/enneagramCampaignAudience.ts` — audience hold priorities.
- `src/lib/server/emailSequences.ts` — delivery-time eligibility checks.
- `src/lib/email/sender.ts:327` — missing footer setting guard.
- `src/routes/account/+page.server.ts:29` — logged-out redirect.
- `src/routes/login/+page.server.ts:160` — post-login destination.
- `src/lib/email/welcome-sequence-content.ts` — current broader welcome copy.
- `docs/marketing/enneagram-type-prompt-review-2026-08-24.md` — previous copy review and rollout proposal.
