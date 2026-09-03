<!-- docs/security/2026-09-03-security-audit.md -->
# 9takes security audit — September 3, 2026

This audit found exploitable database access controls, unsafe URL fetching and uploads, and vulnerable dependencies. The database fixes and matching application are now live. Credentials and personal records are deliberately excluded from this report.

**Overall status: the identified critical access-control issues are remediated and verified in production.** All public tables have RLS enabled, private API reads and account exports are denied, and public profile joins still work. Dependency audit results fell from 31 advisories to zero. Managed Postgres patching, SSL enforcement, credential rotation, administrator MFA, and the provider-level checks below remain outstanding; this is not a certification that the whole system is risk-free.

## Scope and evidence

- Reviewed the repository's dependencies, server hooks, authentication and admin guards, API/form handlers, storage uploads, HTML rendering, webhooks, cron authorization, deployment configuration, and existing security documentation.
- Inspected the live `9takes` Supabase project: 102 public tables/views, 204 public non-extension functions, 54 initial policies, storage buckets, grants, and security advisories. The initial snapshot had 52 public tables without RLS.
- Inspected GitHub security settings, Actions permissions, branch protection, and secret-scanning alert locations. Inspected Vercel production configuration and environment variable **names/scopes**, not published values.
- Tested changes with the production build, unit suite, browser checks, and PostgreSQL transactions using anonymous, ordinary authenticated, and administrator roles. Mutation probes rolled back.
- External AWS, Google Cloud, Elasticsearch, and email-provider account policies, historic access logs, backup restoration, and owner MFA enrollment have not been independently verified. This is not evidence that historic exposed data was never accessed.

## Findings and remediation

| Severity | Finding                                                                                                                                    | Remediation and status                                                                                                                                                                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Critical | An ordinary user could update their own `profiles.admin`, escalating into application administration.                                      | **Live containment:** protected-field triggers on real/demo profiles; ownership checked against the authenticated identity. The regression probe rejects privilege escalation while allowing a first-name update.                                                                                            |
| Critical | `get_all_users()` was callable through inherited public privileges and returned authentication/account details.                            | **Live containment:** execution limited to the server role. Existing guarded, paginated admin user APIs remain available.                                                                                                                                                                                    |
| Critical | 52 public tables had RLS disabled despite broad API grants, including private operational/customer data.                                   | **Live:** RLS enabled; public content/reference reads only; self-owned subscriptions and mutations; private/admin data restricted. The live catalog reports zero public tables without RLS.                                                                                                                  |
| High     | Public profile reads exposed email/privilege/attribution columns; comments exposed IP and fingerprint fields.                              | **Live:** public profile views expose explicit display columns; underlying profiles are owner/admin-only; comment column grants and legacy RPC output omit device identifiers. Live HTTP probes confirm private-data denial and working public joins.                                                        |
| High     | Numerous security-definer RPCs were executable by anonymous or ordinary users; mutable function search paths increased risk.               | **Live:** explicit grants, service-only internal functions, RLS-respecting analytics, guarded private retention reports, fixed search paths, and private default grants for future postgres-created objects. No mutable-search-path advisory remains.                                                        |
| High     | Anonymous storage INSERT/UPDATE policies allowed unauthorized uploads or overwrites; no bucket size/MIME restrictions.                     | **Live:** authenticated owner paths, raster MIME allowlist, 10 MiB limits, server-side decoding and PNG re-encoding, and canonical question paths resolved from the database. Anonymous writes fail the live rollback probe.                                                                                 |
| High     | Link previews could follow redirects into internal networks; hostname checks alone did not address DNS rebinding.                          | **Live application fix:** validate protocols/hosts/ports and each redirect; check DNS addresses at socket connection; block private/reserved IPs; disable proxies; cap response size, redirects, and duration. Fetch only after an accepted top-level comment.                                               |
| High     | The dependency audit reported 31 advisories, including 13 high severity.                                                                   | **Updated:** final `pnpm audit` reports **0** vulnerabilities across the installed dependency graph. See the upgrade table below.                                                                                                                                                                            |
| High     | Rate-limit or abuse-protection outages could allow metered operations or submissions through.                                              | **Live application fix:** durable API, auth-protection, question-comment, suggestion, and waitlist checks deny requests when their backing check fails; bounded local counters reduce memory abuse.                                                                                                          |
| High     | Script CSP allowed arbitrary HTTPS scripts, inline scripts, and eval; stored article HTML lacked a final structural sanitizer.             | **Live application fix:** SvelteKit-generated script hashes and explicit script origins, no inline script attributes/eval, sanitized article HTML and component children, restrictive raw-response policies, and private/no-store authenticated responses.                                                   |
| High     | Managed Postgres `15.1.0.41` has outstanding security patches.                                                                             | **Outstanding managed upgrade.** The unused `pgjwt` extension identified by the upgrade UI was removed without CASCADE in the approved migration. The database upgrade and its availability window require separate completion.                                                                              |
| High     | Direct database connections permit non-SSL traffic; no database network allowlist is configured.                                           | **Maintenance approval needed:** the SSL enforcement confirmation explicitly requires a database restart and a few minutes of downtime. It has been prepared but not submitted. The audited direct-connection test client requires SSL. Restrict source networks only after inventorying authorized clients. |
| High     | A database connection string was inadvertently included in an audit-tool error when parsing a password containing reserved URL characters. | **Rotate the database password.** The issue was disclosed during the audit. Subsequent database checks pass credentials only in process environment variables and redact parsing failures. No credential is recorded here.                                                                                   |
| Medium   | Supabase leaked-password protection was disabled; application validation could be bypassed through direct Auth API calls.                  | **Live:** enabled compromised-password rejection and submitted an eight-character provider minimum to match registration/reset forms. Email confirmation and secure email-change confirmation were already enabled; anonymous Auth sign-in was disabled.                                                     |
| Medium   | GitHub security scanning/Dependabot were disabled and Actions defaulted to write access with permission to approve PRs.                    | **Live:** secret scanning, push protection, vulnerability alerts and automated security fixes enabled; Actions defaults now read-only and cannot approve PRs. Repository files add weekly dependency/Actions updates, pinned action SHAs, and a CI security-audit gate.                                      |
| Medium   | Deployment packaging included gigabytes of local research and generated output.                                                            | **Fixed:** `.vercelignore` excludes credentials, agent/configuration directories, caches, local outputs, and research artifacts. The oversized attempt was stopped; the replacement archive is approximately 163 MiB.                                                                                        |
| Medium   | An old Supabase service key remains in Git history (`update_supabase.py`, later `scripts/update_supabase.py`).                             | GitHub alert #1 identifies the locations. In-memory comparison found no match with current configured credentials; a zero-row request using the historical key returned **HTTP 401**. Preserve incident history; current source reads its key from the environment.                                          |

## Dependency changes

| Package        | Before (manifest) | After                  |
| -------------- | ----------------- | ---------------------- |
| SvelteKit      | `^2.69.3`         | `^2.70.3`              |
| Svelte         | `^5.56.5`         | `^5.57.0`              |
| Supabase JS    | `^2.110.5`        | `2.114.0`              |
| Supabase SSR   | `^0.12.3`         | `0.12.5`               |
| Supabase CLI   | `^1.192.5`        | `2.116.0`              |
| Axios          | `^1.18.1`         | `^1.20.0`              |
| Sharp          | `^0.35.3`         | `0.35.4`               |
| ESLint         | `^8.57.1`         | `^10.9.1`              |
| HTML sanitizer | absent            | `sanitize-html 2.17.7` |

Other compatible dependency updates and targeted transitive overrides are recorded in the lockfile, including patched YAML, archive, HTTP, selector-parser, and sanitization packages. Node requires `>=22.13.0 <25`; CI tracks the patched Node 22 release line. Dependency lifecycle scripts remain explicitly allowlisted.

Major migrations such as Vite 8, Tailwind 4, TypeScript 7, Zod 4, and newer Stripe API generations were not substituted blindly. The current resolved graph has no reported advisories; those upgrades need their own compatibility work.

## Validation

- `pnpm audit --json`: **0 critical/high/moderate/low/info vulnerabilities**.
- `pnpm test`: **168 files, 776 tests passed**.
- `pnpm check`: **0 errors**; 132 existing Svelte/CSS/accessibility warnings remain.
- `pnpm build`: **passed**, including production bundle and static/runtime asset budgets.
- The portrait budget was reconciled with an already committed image update: 1,176 unchanged files, approximately 32.48 KiB of prior baseline drift. No portraits were modified.
- Browser: compiled login page rendered and hydrated; theme toggle worked. After promotion, production questions, a populated question discussion, a public profile, and the authenticated administrator dashboard rendered without console errors. The actual production login response used CSP hashes without `unsafe-eval` or inline script permission and had `Cache-Control: private, no-store`.
- PostgreSQL rollback tests: anonymous private-table denial, public article/question/profile availability, private-column denial, internal-RPC denial, ordinary-user ownership, protected profile fields, functional admin reports, and default-deny execution of newly created functions all passed.
- Reusable database probes are saved in `supabase/tests/security_access.sql`; run after the migrations against a seeded database as postgres. They include anonymous storage-write denial and always roll back their mutations.
- Existing atomic-comment analytics, notification, upload, auth, rate-limit, and content-processing tests pass with the application changes.
- Post-rollout HTTP probes passed: anonymous profiles/waitlist/email reads returned no private rows; private comment columns and `get_all_users` returned permission errors; public questions, public profiles, and embedded comment author projections remained available.
- Live security advisors: **0 RLS-disabled tables, 0 mutable function search paths, 0 extensions in public, and no leaked-password-protection warning**. Remaining advisories are 16 intentionally policy-free server tables, two intentionally safe definer profile views, 10 anonymous/25 authenticated definer-function grants requiring continued allowlist review, and the outstanding managed Postgres patch warning.

## Deployment state

The owner approved the pending migrations and paired rollout. All three audit migrations are applied, with local filenames aligned to the recorded remote versions:

- `20260903211149_security_access_controls.sql`
- `20260903230508_security_rls_storage_rpc.sql`
- `20260903230720_security_remaining_function_search_path.sql`

The production-configured Vercel deployment `dpl_6wu7xsYkXGrp9KDmCnqui9MJKtcd` was promoted to **9takes.com** after the comprehensive migration succeeded. Its deployment URL is `https://9takes-hb3ga49gu-djwayne35gmailcoms-projects.vercel.app`. Live SQL, REST, headers, and browser checks passed afterward.

All 30 current local timestamped migrations now match remote history. The 79 legacy date-only files and four undated bootstrap/content scripts were compared against the existing schema, not blindly replayed. Every extracted creation target and all 80 added-column references exist. Exact historical data effects are not asserted; old cleanup deletes, seeds, and grants can conflict with later work. See [migration reconciliation](2026-09-03-migration-reconciliation.md).

No Git commit/push was made and no email was sent by this audit. **Preserve the local application and migration changes in Git before another Git-based deployment**, which could otherwise replace the hardened application with older code. Do not restore broad table grants to resolve any later application error; fix the specific caller using the authenticated client or a narrowly authorized server operation.

## Remaining operational work

1. **Rotate the exposed database password** in the Supabase database settings and update each authorized direct-connection client. Vercel's inspected production environment does not list `SUPABASE_DB_URL`; local scripts use it. Confirm any other database clients before retiring the old password. The computer-use tool requires the owner to enter and submit a new authentication credential.
2. **Complete the managed Postgres upgrade** after checking current backups and approving the provider's downtime/version details. Verify connection pooling, Auth, REST, storage, search indexes, and cron jobs afterward.
   Enable SSL enforcement during the approved maintenance window; its separate confirmation states that it restarts the database. The prepared dashboard dialog was left open for owner review.
3. **Protect `main` and persist this rollout in Git.** The branch is currently unprotected. Require the CI check before merging; define an emergency-maintenance process before enforcing reviews on a solo-maintained repository.
4. **Complete direct Auth API abuse protection.** Supabase-native CAPTCHA remains disabled. Existing application reCAPTCHA does not protect direct provider requests. Integrate a provider-supported CAPTCHA and pass its token through signup/recovery before enabling that switch; simply enabling it would break current forms.
5. **Enroll and enforce administrator MFA**, including GitHub, Vercel, Supabase owners, and application admins. Application enforcement needs a verified enrollment/recovery flow before requiring an elevated assurance level.
6. Review historical Supabase/API logs and admin memberships for unexpected access during the period of exposure. Verify provider-level key scopes, service-account permissions, direct database network restrictions, and a backup restore drill. These require owner/provider evidence beyond the checks completed here.

## Intentional access-control exceptions

- `public_profiles` and `public_profiles_demo` are deliberately read-only definer views with explicit safe column projections and `security_barrier`. Invoker mode would hide other users' public display fields because base rows are owner/admin-only. Never add email, admin flags, IPs, or attribution fields to these views.
- Some tables intentionally have RLS enabled with no client policies; server-only processing requires that denial.
- A small public RPC allowlist serves bounded public reads, anonymous reply-token handling, or telemetry. Definer-function advisories on these require review against the function body, not blanket re-granting or blanket suppression.
- Inline styles remain allowed for existing editorial components; executable inline scripts and event attributes are restricted. Public media hosts remain broader than script origins.

## References

- [Supabase RLS and disabled-policy checks](https://supabase.com/docs/guides/database/database-linter?lint=0007_policy_exists_rls_disabled)
- [Supabase security-definer views](https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view)
- [Supabase extension schema guidance](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public)
- [Supabase password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
- [Supabase API key types and rotation](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase managed Postgres upgrades](https://supabase.com/docs/guides/platform/upgrading)
- [GitHub secret-scanning alert #1](https://github.com/Wolverine971/9takes/security/secret-scanning/1)
