<!-- docs/taskers/T-44-cta-experiment-admin-read-access.md -->

# Tasker: Restore authorized CTA experiment totals

**For:** the agent handling the actionable 9takes errors from the 2026-10-08 past-day Vercel audit.
**Owner:** DJ
**Created:** 2026-10-08
**Status:** Implemented and verified locally. Production migration and deployment await explicit approval.
**Related:** [T-45](T-45-olivia-portrait-compatibility.md), [T-41](T-41-growth-audit-loose-ends.md), `supabase/migrations/20261004120000_cta_experiment_events.sql`.

## 0. What and why

Verified audit evidence: at **2026-10-08 03:27:21.453 UTC**, `GET /admin/consulting/__data.json` returned HTTP 200 but logged `CTA experiment results unavailable` for `beta_card_v1`, with `error: [object Object]`. All nine HEAD reads of `cta_experiment_events` returned 403. Deployment: `dpl_CHTggAULDYeTZqCXgLy9rRu5h5QF`, branch `main`. [Vercel source](https://vercel.com/djwayne35gmailcoms-projects/9takes/logs?timeline=pastDay&search=level%3Aerror%2Cwarn&selectedLogId=zs9cf-1791430041179-e2b4acf78b8e&panelState=opened).

The September security migration revoked default privileges for new tables. The October CTA migration enabled RLS and an admin policy, but did not grant `authenticated` table access. RLS cannot supply that missing grant. A local PostgreSQL 16 reproduction with the original migration and the hardened defaults fails with `permission denied for table cta_experiment_events`; the prepared migration resolves it. The follow-up read-only production catalog check confirmed RLS is enabled, only `postgres` and `service_role` have table/sequence grants, no anonymous/authenticated column grants exist, and the only policy is `audit_admin_management` (`ALL`, authenticated, `is_admin()` in both predicates). [Supabase documents the separate grants and RLS layers](https://supabase.com/docs/guides/api/securing-your-api).

The logging defect is separate: Supabase returns plain error objects, and `String(error)` discards their code/message. HEAD failures can also have an empty error body, so HTTP status must survive normalization.

## 1. Required reading

1. `CLAUDE.md` and `docs/taskers/README.md`. This checkout has no `AGENTS.md` or `.agents/skills` directory.
2. `src/lib/server/ctaExperiments.ts` and its adjacent spec.
3. `src/lib/server/adminAuth.ts`, `src/routes/admin/consulting/+page.server.ts`, and the consulting layouts.
4. `supabase/migrations/20260903230508_security_rls_storage_rpc.sql`, especially default privilege revocations.
5. The original CTA migration, the new access migration, and `supabase/tests/cta_experiment_access.sql`.

## 2. Local changes completed

1. Added `supabase/migrations/20261008042926_cta_experiment_admin_read_access.sql`. It retains RLS, removes public/anonymous/authenticated mutation access and sequence access, replaces `FOR ALL` with an admin-only `FOR SELECT` policy using the existing `public.is_admin()`, and grants authenticated SELECT only on `id`, `experiment`, `variant`, and `event`. It explicitly supports service-role INSERT and identity-sequence USAGE while preserving existing service-role privileges. Admins cannot read `created_at`, `surface`, `placement`, `path`, or `fingerprint` with this grant.
2. Kept report reads on the authenticated session client. Added `requireAdmin(locals)` at the page-load boundary, so direct data loads cannot start reporting queries before authorization.
3. Logs now contain validated error codes, fixed sanitized messages and HTTP status where available. Raw messages, details, hints, stack traces, request bodies and visitor fields are excluded. Empty-body 403 responses become `HTTP_403`.
4. Missing/invalid exact counts return the existing unavailable state (`null`), not fabricated zero conversions. Valid zero counts remain zero. Failed telemetry writes still do not break signups.
5. Added route authorization and failure regression tests plus SQL access tests. Database table shapes did not change, so generated database types need no update.

## 3. Approval and remaining production work

**Exact approval needed:** apply only `supabase/migrations/20261008042926_cta_experiment_admin_read_access.sql` to the production Supabase database serving 9takes. This is a persistent permission/policy change, not a project-wide default-grant change. A separate release approval is required to deploy the application changes. Neither is authorized by this remediation task.

**Target:** Supabase project ref `nhjjzcsnmyotyhykbajc`, API `https://nhjjzcsnmyotyhykbajc.supabase.co`. The endpoint was confirmed by `get_project_url`, successful read-only catalog queries against that ref, both local environment URL settings, the CSP in `svelte.config.js`, and `docs/security/CREDENTIAL_ROTATION_GUIDE.md`. Vercel local project metadata identifies `9takes`, project `prj_GWcAEI6ZzEOecc6D8CBoh4clRbDY`, team `team_u1B0wC8esmzKz74z2onl2AUk`. Supabase management `get_project` returned an internal error, and `list_projects` omitted this ref, so organization/ownership metadata could not be re-confirmed through that management connection. Verify dashboard ownership before executing the approved change.

**Material access change:** authenticated admins gain reads of four event columns and accurate counts, which were previously unavailable. Ordinary authenticated users gain query access to those columns but RLS returns no rows; their response can change from permission error to an empty result. Anonymous users retain no SELECT privileges. The existing `is_admin()` implementation checks `profiles.admin` for `auth.uid()`, not user-editable metadata. Service-role INSERT/sequence USAGE already exist in production; these grants are idempotent and do not expand its current access. Existing service-role full privileges are preserved.

**Ownership verification blocker (final browser check):** a separate Chrome tab opened the exact project dashboard, then redirected to `https://supabase.com/dashboard/sign-in?returnTo=%2Fproject%2Fnhjjzcsnmyotyhykbajc`. There was no signed-in Supabase dashboard session. No sign-in, credential inspection, permission expansion or remote write was attempted. Project endpoint/catalog identity is verified; dashboard account/organization ownership remains unverified until the user signs in or the management connection includes this project.

Before applying, recheck the live grants/policies for intervening drift. Do not run a blanket migration push across unrelated pending migrations. After application and deployment, verify an authorized admin's nine exact counts against a SQL aggregate for `beta_card_v1`; confirm anonymous table reads fail, ordinary-user reads expose no rows, and authenticated writes remain denied. Keep the SQL fixture test local; it inserts rows before rollback.

## Verification checklist

- [x] Six targeted Vitest files, 76 tests passed:

  ```bash
  pnpm test src/lib/server/ctaExperiments.spec.ts src/routes/admin/consulting/consulting.page.server.spec.ts src/lib/server/adminAuth.spec.ts src/routes/api/cta-event/cta-event.server.spec.ts src/lib/server/publicDelivery.spec.ts src/lib/server/personalityImageRedirect.spec.ts
  ```

- [x] `pnpm check`: 0 errors, 21 warnings in 8 files. An isolated `/tmp` source copy with the pre-remediation versions of owned sources produced exactly the same 21 warning locations/messages and 0 errors. All eight warning source files are byte-identical to HEAD `d97c307f8`.
- [x] Targeted ESLint passed:

  ```bash
  pnpm exec eslint src/lib/server/ctaExperiments.ts src/lib/server/ctaExperiments.spec.ts src/routes/admin/consulting/+page.server.ts src/routes/admin/consulting/consulting.page.server.spec.ts
  ```

- [x] PostgreSQL 16 in a disposable `/tmp` cluster, private Unix socket only: original migration reproduces the permission failure; final four-column migration passes service-role insertion, anonymous denial, ordinary-user zero visibility, exact admin counts `[2,1,0,0,0,1]`, authenticated INSERT/UPDATE/DELETE/sequence denial, and denial of unnecessary metadata columns including a real fingerprint SELECT attempt. The fixture uses the repo's actual `is_admin()` function with minimal local profiles/auth support, not a complete Supabase stack. The temporary server was stopped.
- [x] `pnpm build` passed, including static budgets, Vite/Vercel compilation, traced runtime-require checks, and final asset budgets. Dependency-tracing warnings were emitted for optional packages such as `ws`, `@react-email/render`, `supports-color`, and alternate sharp binaries; their baseline was not established.
- [x] `pnpm test` completed 265 files / 1,795 passing assertions but **exited 1**, due to an unhandled `process.exit(1)` in `scripts/audit-malformed-links.mjs:115`. That module unconditionally starts its network crawler when imported by its spec. The isolated five-test run reproduces the error. Both script and spec are byte-identical to HEAD `d97c307f8`; the full suite is not green.
- [x] `pnpm lint` **exited 1** on formatting in `docs/blog-automation/backlog-queue.json`, which is byte-identical to HEAD. The new README table's initial formatting issue was fixed, and the repeated aggregate lint identifies only the backlog file.
- [x] Ran every lint stage skipped after Prettier separately: full ESLint passed with 0 errors / 17 warnings; radius, retired colors, global component CSS, and cross-link checks passed. The 17 ESLint warnings match an isolated baseline run exactly, and all seven source files match HEAD.
- [x] CI's `pnpm audit:security` ran after a sandbox DNS retry and **exited 1**: 7 advisories, comprising 3 high (`braces`, `source-map-js`, `sharp`), 2 moderate (`sprintf-js`, `postcss-selector-parser`), and 2 low (`dompurify`). Package manifest and lockfile match HEAD. No dependency changes were attempted in this remediation.
- [x] Read-only live grants/policies verified as described above; no remote mutation.
- [ ] Browser smoke not run: the default local dev server inherits production Supabase settings and protected-page browsing can call `recordSharedContentAccessEvent` from `src/hooks.server.ts`. A seeded isolated backend is not configured. Running with placeholder credentials would not verify the database-backed smoke routes. No frontend component changed in this task.
- [ ] HTTP HEAD integration and production admin totals still need verification after approval. `build:vercel`'s generators were not run because they rewrite generated files, including existing user changes in corpus stats/sitemap; the full `pnpm build` gate did run.

Detailed local outputs are `/tmp/9takes-cta-build.log`, `/tmp/9takes-cta-full-test.log`, `/tmp/9takes-cta-lint.log`, `/tmp/9takes-cta-eslint-all.log`, `/tmp/9takes-cta-baseline-check.log`, `/tmp/9takes-cta-baseline-eslint.log`, `/tmp/9takes-cta-security-audit.log`, and `/tmp/9takes-cta-sql-final.log`.

High dependency advisories from the completed audit, with existing versions preserved:

| Package         | Advisory                                                                                                                                  | Reported fixed version | Relationship to this patch                                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `braces`        | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack-exhaustion denial of service through nested patterns      | `>=3.0.4`              | Existing glob/build dependency; no direct call in changed CTA/redirect code. Exploitability unassessed.                                                          |
| `source-map-js` | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q), event-loop denial of service through indexed source-map offsets | `>=1.2.2`              | Existing PostCSS dependency, including through `sanitize-html`; no direct call in changed code. Transitive reachability and exploitability unassessed.           |
| `sharp`         | [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w), librsvg vulnerability CVE-2026-96889                            | `>=0.35.5`             | Existing image-processing dependency. The new redirect serves an existing static WebP and adds no image-processing operation. Broader exploitability unassessed. |

To rerun the SQL checks against an already prepared **local** test database containing the two CTA migrations and admin/ordinary test profiles:

```bash
psql -X -h "$CTA_TEST_SOCKET" -p 55439 -U "$USER" -d postgres -v ON_ERROR_STOP=1 -f supabase/tests/cta_experiment_access.sql
```

## Risks and gotchas

- Applying only the app patch improves logging and authorization but does not restore missing database grants. Until the migration is applied, the admin report remains unavailable.
- Authenticated non-admin SELECT is filtered to zero rows by RLS; this is a data denial, not necessarily an HTTP 403. The admin page itself rejects non-admin access.
- Do not substitute a service-role report client, grant anonymous access, broaden `is_admin()`, or turn failed counts into zeros.
- Other audit events were predominantly scraper blocks, expected credential failures, and probes. They do not justify disabling protections or converting real failures into success.
- Other agents and DJ have unrelated edits. No stash, bulk reset, commits, pushes, deployments, communications, or production changes were made. Do not change blog `lastmod`.

## Definition of done

Local work is complete when the application and SQL tests above pass. Production completion requires approved migration application and deployment, accurate admin totals, continued non-admin isolation, and no recurring unavailable warning for successful authorized reads.
