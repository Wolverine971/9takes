<!-- docs/growth/question-commenting/03-QC-02-EMAIL-CLOSEOUT-2026-08-12.md -->

# QC-02 Email Attribution and Reactivation Closeout

**Measured:** 2026-08-12  
**Sources:** read-only production database aggregates, current email code, and live PostHog schema  
**Privacy:** no email address, profile ID, fingerprint, token, IP address, or user agent is included

## Welcome sequence finding

Welcome Email 1 remains the pattern worth preserving. Across all immutable sequence-tagged sends currently available, step 1 has:

- 8 recipients sent.
- 2 tracked clickers.
- 3 commenters and 12 confirmed comments within 24 hours of the send.
- 4 questions answered per commenter within that window.

The apparent difference from the frozen pilot baseline is explained by its July 19 cutoff. The all-time report finds one earlier July 16 recipient who posted two comments shortly after Welcome Email 1. Within the pilot window, the report reproduces the two known journeys and ten comments from July 28 and August 10.

Welcome step 2 currently has one commenter with four comments inside 24 hours. Treat that as last-touch association, not proof that step 2 caused the comments.

The connected Gmail mailbox does not contain the service-account-sent welcome messages, so message bodies were verified from the canonical sequence content and immutable production send records rather than Gmail search.

## Attribution implementation

Every code-managed welcome step now supplies:

- `utm_source=welcome`
- `utm_medium=email`
- `utm_campaign=welcome-sequence`
- `utm_content=welcome_sequence_step_<n>_link_<n>`

The shared sender applies these values to both HTML and plain-text first-party links while preserving caller-supplied UTM values and existing click redirects. The template-shell brand link remains a direct `https://9takes.com` link. It is intentionally excluded from sequence-link and campaign-conversion conclusions because the shell is added after content links are rewritten.

## Reactivation inventory

Immutable sequence-tagged sends currently show:

| Sequence | Sends to date | Unique clickers | Unsubscribers | Bounced sends | Comments within 7 days |
| -------- | ------------: | --------------: | ------------: | ------------: | ---------------------: |
| Dormant  |           202 |               1 |             4 |             4 |                      0 |
| Zombies  |            68 |               1 |             1 |             5 |                      0 |
| Cold     |             0 |               0 |             0 |             0 |                      0 |

The weak zombies assist described in the frozen baseline occurred 12 days after its click and is deliberately outside this report's seven-day attribution window.

There are 75 active reactivation recipients remaining: 53 dormant and 22 zombies. If every active enrollment finishes, the current cadence will generate 131 more sends: 79 dormant and 52 zombies.

## Closeout options

Observed tagged-send rates imply roughly one additional click and two to three additional unsubscribes if all 131 remaining sends continue. The observed seven-day comment rate implies zero attributable comments; that is a planning estimate, not a guarantee.

| Option                                                         | Remaining recipients allowed to finish | Expected future sends | Expected clicks | Expected unsubscribes | Expected attributable comments within 7 days | Tradeoff                                                                                          |
| -------------------------------------------------------------- | -------------------------------------: | --------------------: | --------------: | --------------------: | -------------------------------------------: | ------------------------------------------------------------------------------------------------- |
| 1. Enforce no new enrollment; finish current enrollments       |                                     75 |                   131 |         about 1 |             about 2–3 |                           0 at observed rate | Preserves the promise to current recipients and creates a durable stop on list expansion.         |
| 2. Stop active recipients now                                  |                                      0 |                     0 |               0 |                     0 |                                            0 | Protects send volume immediately but interrupts the re-permission/sunset flow for 75 people.      |
| 3. Continue current cadence with a policy of no new enrollment |                                     75 |                   131 |         about 1 |             about 2–3 |                           0 at observed rate | Same exposure as option 1, but depends on operator memory instead of an enforced enrollment gate. |

## Recommendation

Choose option 1: prevent any new broad reactivation enrollment while the already-enrolled population finishes. Do not use `reactivation_cold` as new experiment inventory. If bounce or complaint monitoring worsens, option 2 becomes the safety override.

No sequence or enrollment state was changed during this task. DJ approval is required before implementing any closeout option.

## Reproducibility and remaining production gate

Run [`sql/2026-08-12-email-sequence-comment-attribution.sql`](./sql/2026-08-12-email-sequence-comment-attribution.sql) through `./scripts/db-query.sh` for the sequence-step report and current closeout inventory.

After deployment, send one controlled test welcome message and verify:

1. The final MIME HTML and plain-text destinations contain the welcome sequence/step attribution.
2. A controlled click writes its final destination to `email_tracking_events`.
3. The landing reaches `page_analytics_visits` and PostHog with the welcome campaign.
4. The qualified question impression and any confirmed comment preserve `campaign=welcome-sequence`.
