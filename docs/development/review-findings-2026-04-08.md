<!-- docs/development/review-findings-2026-04-08.md -->

# Review Findings - 2026-04-08

Review scope: recent work from the prior 24 hours, with emphasis on bugs, unfinished work, and loose ends.

## Findings

### 1. Anonymous signup attribution is broken

- Severity: P1
- Area: Retention / signup attribution
- Summary: Public newsletter signups call `attach_signup_first_touch`, but the new migration only grants that RPC to `authenticated`. Anonymous visitors can sign up successfully, but first-touch attribution silently fails.
- Affected files:
  - `src/routes/email/+page.server.ts`
  - `supabase/migrations/20260408_retention_first_touch_capture.sql`
- Fix status: Fixed in repo via `supabase/migrations/20260408_grant_attach_signup_first_touch_to_anon.sql`; pending migration rollout

### 2. Header search description fallback is double-escaped

- Severity: P2
- Area: Search / header typeahead
- Summary: `HeaderSearch` escapes `description` before returning it from `getResultHeadline`, then escapes it again through `renderHighlight(...)`. Suggestions without a custom `headline` can render HTML entities literally.
- Affected files:
  - `src/lib/components/molecules/HeaderSearch.svelte`
- Fix status: Fixed in repo by returning raw fallback description text and letting `renderHighlight(...)` handle escaping once; regression coverage added in `src/lib/components/molecules/HeaderSearch.spec.ts`

### 3. Entry-surface filter does not affect retention summary totals

- Severity: P2
- Area: Admin analytics / retention dashboard
- Summary: The entry-surface filter updates the retention curve and next-path queries, but the overview query and summary cards still reflect all surfaces. The dashboard becomes internally inconsistent after filtering.
- Affected files:
  - `src/lib/components/admin/RetentionAnalyticsPanel.svelte`
  - `src/routes/api/admin/analytics/cohorts/+server.ts`
  - `supabase/migrations/20260408_retention_first_touch_capture.sql`
- Fix status: Fixed in repo by filtering overview rows in `/api/admin/analytics/cohorts` before returning them to the panel; regression coverage added in `src/lib/server/retentionAnalytics.spec.ts`

## Verification Notes

- Targeted unit tests for touched logic passed during review.
- Full `npm run check` still fails because the repo already has a broader TypeScript / Svelte error backlog, including errors in recently touched scripts.
