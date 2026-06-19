<!-- docs/security/signup-spam-classification-2026-06-19.md -->
# Newsletter Signup Spam Classification - 2026-06-19

Scope: `signups.created_at >= 2026-06-14`.

Classification query: `scripts/classify-newsletter-signup-spam.sql`.

## Summary

| Classification              | Count | Recommended action                 |
| --------------------------- | ----: | ---------------------------------- |
| `very_likely_bot_submitted` |    75 | Quarantine/suppress from campaigns |
| `likely_bot_submitted`      |     1 | Manual review before suppressing   |
| `review`                    |     1 | Manual review                      |
| `possibly_real`             |     1 | Do not suppress automatically      |

## Rules

`very_likely_bot_submitted` means the same email hash had either:

- a nearby registration honeypot hit, or
- both a nearby failed login and blocked forgot-password flow.

`likely_bot_submitted` means weaker abuse evidence, such as multiple nearby login failures or a login/register-first path with no scroll and a fast signup.

`possibly_real` means the signup originated from search traffic and had no nearby auth abuse events.

## Manual Review Rows

|  ID | Email                   | Reason                                                                                                                                           |
| --: | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 134 | franferrone@comcast.net | Search/Google first touch on `/personality-analysis/ryan-gosling`, no auth abuse, high scroll. Treat as possibly real.                           |
| 148 | hhull@jor-mac.com       | Internal/content first touch, no auth abuse, no scroll. Review manually.                                                                         |
| 192 | ritzy4214@hotmail.com   | Three failed logins nearby, but no honeypot or forgot-password block. Likely bot-submitted, but keep out of the automated first-pass quarantine. |

## Quarantine Guidance

For the first pass, only suppress the 75 `very_likely_bot_submitted` rows. Do not delete them. Suppression should use `email_unsubscribes` / `unsubscribe_email_direct` with a reason such as `bot_submitted_quarantine_2026-06-19`, so the decision is reversible and visible in email tooling.

Executed on 2026-06-19: `scripts/quarantine-newsletter-signup-spam.sql` suppressed 75 rows with reason `bot_submitted_quarantine_2026-06-19`.

Post-write verification: IDs 134, 148, and 192 remained unsuppressed.
