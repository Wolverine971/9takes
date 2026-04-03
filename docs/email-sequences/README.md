<!-- docs/email-sequences/README.md -->
# Email Sequences

All documentation related to automated email sequences for 9takes.

## Documents

| Document                                                     | Purpose                                             |
| ------------------------------------------------------------ | --------------------------------------------------- |
| [welcome-email-assessment.md](./welcome-email-assessment.md) | Copy analysis, strategy review, and rewrite history |

## Admin Tools

| Tool                                                                              | Purpose                                                     |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [`/admin/welcome-sequence`](../../src/routes/admin/welcome-sequence/+page.svelte) | Per-step delivery metrics, enrollment funnel, return visits |
| [`/admin/email-dashboard`](../../src/routes/admin/email-dashboard/+page.svelte)   | Full email system: sends, drafts, scheduling, analytics     |

## Source Files

| File                                                                                                                       | Purpose                                  |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [`supabase/migrations/20260316_welcome_email_sequence.sql`](../../supabase/migrations/20260316_welcome_email_sequence.sql) | Schema, functions, and seed content      |
| [`supabase/migrations/20260403_update_welcome_email_2.sql`](../../supabase/migrations/20260403_update_welcome_email_2.sql) | Email 2 rewrite (gender-balanced)        |
| [`src/lib/email/sequences.ts`](../../src/lib/email/sequences.ts)                                                           | Template rendering and token replacement |
| [`src/lib/server/emailSequences.ts`](../../src/lib/server/emailSequences.ts)                                               | Enrollment, send processing, suppression |
| [`src/lib/server/emailAdminSequences.ts`](../../src/lib/server/emailAdminSequences.ts)                                     | Admin dashboard data queries             |

## Current Sequence: `welcome_sequence`

4 emails triggered on user registration:

1. **Welcome** (immediate) - Explains the give-first mechanic
2. **Dual-perspective hook** (+2 days) - "He thinks she's cold. She thinks he's needy."
3. **Call to contribute** (+3 days) - "Your perspective is missing"
4. **Check-in** (+5 days) - Three-bucket self-sort with clean exit option
