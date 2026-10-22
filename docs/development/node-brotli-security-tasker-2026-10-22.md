<!-- docs/development/node-brotli-security-tasker-2026-10-22.md -->
<!-- doc-status: point-in-time -->

> **Point-in-time document.** Written 2026-10-22; describes the audited state at that moment. Verify current code and deployment evidence before acting.

# 9takes — Node Brotli security tasker

- **Status:** Open; handoff only, remediation not executed.
- **Priority:** P1 — public URL decoding path; production patch unknown
- **Canonical repository:** `/Users/djwayne/9takes`
- **Target:** Node 22.23.4+ within 22.x
- **Deployment scope:** Vercel project 9takes

## Assignment and boundaries

DJ requested this Markdown handoff on 2026-10-22 to give to the project agent. Document creation authorizes **docs only**. Once DJ assigns remediation, prepare scoped repository changes and free local validation within that assignment. This file does not itself authorize installation, commits, pushes, deployment, hosted settings changes, service restarts, database writes, messages, paid calls, credential rotation, SSH-key registration or new access. Those actions remain pending explicit owner authorization where required by the assignment.

Read current repository instructions first, record `git status`, and preserve staged, unstaged and untracked user work. Use the canonical checkout; do not duplicate this task in worktrees or sibling repositories. Do not print/read credential contents or environment secret values. Existing authenticated read-only tooling is appropriate; stop at sign-in, new permissions or access setup.

## Security basis

- **CVE-2026-111497:** Node.js Brotli decoder out-of-bounds write with potential remote code execution, rated high by Node.js.
- Fixed releases announced October 21: **22.23.4, 24.22.1, 26.12.1**. Use these or a later verified patched release in the chosen supported line. EOL lines such as 18/20/23/25 are not safe exemptions merely because omitted from the supported-release advisory.
- [Official Node advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).
- Native fetch/Undici can transparently decode `Content-Encoding: br` through `node:zlib.createBrotliDecompress`; Axios and node-fetch can also do so. [Official Undici implementation](https://raw.githubusercontent.com/nodejs/undici/v7.30.1/lib/web/fetch/index.js).
- A clean `npm audit`, refreshed lockfile, absence of direct Brotli imports, `process.versions.brotli = "1.2.0"`, or a major-only Node setting does **not** prove this fix. The Node security fix was backported without requiring a Brotli version-string change. Verify exact Node patch/vendor evidence.

## Shared Mac prerequisite — coordinate once

The audit executed `/opt/homebrew/bin/node` (resolved to `/opt/homebrew/Cellar/node@24/24.18.0/bin/node`) and found **24.18.0**; `/opt/homebrew/Cellar/node/26.5.0/bin/node` reported **26.5.0**. Both reported Brotli **1.2.0** and were below the fixed releases. These are shared installations, not per-repository dependencies.

Have DJ/the designated machine-runtime owner coordinate a single update to Node 24.22.1+ and, if retained, 26.12.1+. **Do not race other project agents to install/update shared Node or restart processes.** If no patched approved executable is available, prepare/review the project patch and mark runtime validation blocked. Recheck the actual selected executable; a `.nvmrc` edit does not update a binary or running process.

## Audited project evidence

All paths below are relative to this repository root. Findings are a 2026-10-22 snapshot, not a guarantee about future deployments.

- `.nvmrc` is `22`; `engines.node` is `>=22.13.0 <25`; CI selects `22.x`. All permit an unpatched Node 22 executable.
- `svelte.config.js` selects `nodejs22.x`. Authenticated Vercel production inspection found build `22.x` and function `nodejs22.x`, deployment `dpl_9Z6ZfijDb4AAKonS2gBdyCCoyYjF`; exact patches remain unknown.
- `questionComments.ts` enriches URLs from accepted comments through `safeExternalFetch.ts`. Its `axios.get` fetches public URLs without `decompress: false`. Axios 1.20.0's installed HTTP adapter calls `createBrotliDecompress` for Brotli responses. DNS filtering, redirects, timeouts and a 1 MiB body limit do not establish protection from native memory corruption.
- `pnpm-lock.yaml` includes Axios 1.20.0, Undici 6.28.1/7.29.1, node-fetch 2.7.0/3.3.2 and Cheerio 1.2.0. Presence is dependency evidence, not proof every package executes in production.
- This is a SvelteKit server application with static/content pages as well as server functions, not a static-only deployment.

Inspect these files during implementation:

- `CLAUDE.md`
- `package.json`
- `.nvmrc`
- `svelte.config.js`
- `vercel.json`
- `pnpm-lock.yaml`
- `.github/workflows/ci.yml`
- `src/lib/server/safeExternalFetch.ts`
- `src/lib/server/safeExternalFetch.spec.ts`
- `src/lib/server/questionComments.ts`

## Hosted runtime verification

For a confirmed Vercel target, keep supported major selectors such as `nodejs22.x` / `nodejs24.x` and `engines.node: "22.x"` / `"24.x"`. **Do not replace them with arbitrary patch runtime strings.** Vercel manages patch rollouts. Confirm rollout/vendor evidence and obtain exact `process.version` from an existing safe diagnostic or an approved implementation that logs only version metadata. Build `node -v` proves the build runtime, not necessarily the server runtime. [Vercel's official version guidance](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

Do not label deployment metadata containing only `22.x` or `24.x` as fixed. If the provider has not supplied verifiable evidence, leave production status unknown and report the next required owner action. Static assets/browser JavaScript are separate from build tools and Node server functions; serving precompressed assets is not itself Brotli decoding.

## Work order after assignment

1. Recheck `.nvmrc`, engines, CI and the deployed revision; preserve ongoing editorial/generated-content changes.
2. Prepare a same-major Node 22.23.4+ local/CI pin and enforce that minimum. Make the engine policy consistent without inadvertently changing the Vercel build to Node 24 via a broad range. Retain pnpm 11.7.0 and the locked packages unless compatibility requires a reviewed change.
3. Verify Vercel's Node 22 patched runtime availability; retain valid `nodejs22.x` syntax. The accepted-comment URL fetch path makes this a priority even if npm audit is clean.
4. Retain the SSRF protections. Changing Accept-Encoding alone is not a reliable fix, and removing link previews is not required to patch Node. Any temporary decoder mitigation must be separately reviewed and must not be used to close the runtime patch task.
5. Provide the reviewed local diff and results; request owner authorization only for concrete production changes, then verify the actual process patch after rollout.

## Validation and later rollout

- On the coordinated patched Node, run `pnpm check`, focused `pnpm test -- src/lib/server/safeExternalFetch.spec.ts`, and `pnpm build` as appropriate to the runtime/config change. Inspect the existing `check:server-runtime` and build-budget results.
- Use local mocked HTTP responses/benign Brotli fixtures if testing decompression; do not probe production with a malicious CVE payload or fetch an attacker-controlled URL.
- Avoid `gen:all`, indexing, live content enrichment, paid calls and unrelated generators. Vercel's build script may regenerate content; preserve and review existing generated changes.
- After an authorized deployment, verify exact Node 22.23.4+ for server functions and the build, then check public page loading and the link-preview path with a controlled benign URL and no production content mutation unless separately approved.

For local version evidence, this read-only command reports no environment values:

```sh
node -p 'JSON.stringify({node:process.version,brotli:process.versions.brotli,undici:process.versions.undici,execPath:process.execPath})'
```

Use equivalent non-secret version evidence for the **actual** deployed process only through existing authorized access, or after an explicitly authorized deployment of diagnostics. Do not register access, start a shell that exposes environment variables, or run exploit payloads. Record UTC time, command/evidence source, deployment ID, commit, runtime family, exact Node version, and any replicas/route overrides not covered. A successful benign decompression test is a compatibility check, not proof the CVE is fixed.

## Acceptance and handoff

- [ ] Current code/deployment snapshot and pre-existing dirty work are recorded; project paths and package manager are verified.
- [ ] Selected local/build/server Nodes meet the applicable fixed version, with exact executable/vendor evidence rather than a major-only claim.
- [ ] Scope is limited to runtime/config/verification changes required by the assigned remediation; dependency/lockfile churn is justified or absent.
- [ ] Appropriate checks/builds pass on patched Node; pre-existing failures and blocked checks are identified explicitly.
- [ ] Static output, development/build tooling and server functions/processes are classified separately.
- [ ] Proposed production action and rollback plan are concrete; **owner authorization for deployment/settings/restarts/credentials remains pending until explicitly given**.
- [ ] After any later authorized rollout, actual production runtime coverage is verified; unverified hosts, functions, replicas, previews and rollback deployments remain listed as unknown.
- [ ] Comment-link enrichment retains SSRF controls and passes its focused tests on the patched runtime.

Return the scoped diff, validation results, exact-version evidence table, proposed/authorized rollout status and unresolved blockers to DJ. For a blocker, name the exact action/target, reason, completed coverage, and whether it was denied, pending or had an uncertain outcome. Do not claim patch completion from this tasker's creation or from a successful build alone.

---

## Remediation results — 2026-10-22 (16:24–16:55 UTC, project agent)

**Status:** Repo changes made and validated locally, **not committed or deployed**. Production runtime status is unknown until an authorized deploy.

### Correction to the audit above

Vercel **builds on Node 24.x, not 22.x.** Build log for `dpl_9AwCgXGnHhk2rKkdV67qqmYn6cuu` (2026-10-22T15:47:28Z): _"Due to engines.node `>=22.13.0 <25` … the Node.js Version defined in your Project Settings ("22.x") will not apply, Node.js Version "24.x" will be used instead."_ Functions run `nodejs22.x` (adapter setting). Vercel resolves an engines range to the newest major it satisfies.

### Diff (scoped; lockfile unchanged)

| File                                       | Change                                                                                                                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/server/safeExternalFetch.ts`      | Link previews send `Accept-Encoding: identity`, set axios `decompress: false`, and refuse any encoded body. SSRF controls unchanged. This is defense-in-depth, **not** the runtime patch.   |
| `src/lib/server/safeExternalFetch.spec.ts` | Tests for the above, plus a real-axios test on a local server with a benign Brotli body. Its control request proves the spy sees decoder calls; the `decompress: false` request makes zero. |
| `package.json`                             | `engines.node`: `>=22.13.0 <25` → `^22.23.4 \|\| ^24.22.1`. pnpm (`engineStrict`) now refuses unpatched Node on install **and on every `pnpm run`**. Vercel build stays on 24.x, as before. |
| `.nvmrc`                                   | `22` → `22.23.4`                                                                                                                                                                            |
| `.github/workflows/ci.yml`                 | `node-version: '22.x'` → `node-version-file: '.nvmrc'` (a bare `22.x` can reuse an older Node cached on the runner)                                                                         |
| `src/hooks.server.ts`                      | Logs `[runtime] node <version>` once per server instance (prod only; version metadata only)                                                                                                 |
| `CLAUDE.md`                                | Runtime line updated                                                                                                                                                                        |

### Exact-version evidence

| Surface                                                 | Source                                                        | Version                                                                                  | Verdict                                                                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Mac default `node` (`/opt/homebrew/bin/node` → node@24) | local exec                                                    | v24.22.1                                                                                 | Patched. Homebrew upgraded at 16:27Z by someone else, not this agent.                                                   |
| Mac `node` formula                                      | local exec                                                    | v26.12.1                                                                                 | Patched (refused by engines; outside the allowed majors)                                                                |
| Old keg node@24 24.18.0                                 | local exec                                                    | won't launch (missing simdjson dylib)                                                    | Dead binary                                                                                                             |
| Long-running processes started before 16:27Z            | `ps`                                                          | old binaries still loaded in memory                                                      | **Unpatched until restarted:** OpenClaw gateway (pid 812, up since Oct 7) and BuildOS MCP servers (pids 8793, 24747, …) |
| Validation Node                                         | official nodejs.org tarball, SHA256 verified, scratchpad only | v22.23.4 (`process.versions.brotli` reports 1.1.0, so the Brotli string is not evidence) | Patched                                                                                                                 |
| CI                                                      | `.nvmrc`                                                      | 22.23.4 exact                                                                            | Patched once pushed                                                                                                     |
| Vercel build                                            | build log                                                     | 24.x, patch unknown                                                                      | Unknown. The new engines floor fails install if below 24.22.1.                                                          |
| Vercel functions                                        | adapter `nodejs22.x`                                          | 22.x, patch unknown                                                                      | Unknown until the `[runtime] node` log is read after a deploy                                                           |

Only server code fetches attacker-chosen URLs through the link preview (`questionComments.ts` → `fetchPublicHtml`). Other outbound fetches go to fixed, trusted hosts (Turnstile, OpenRouter, own origin, a font URL).
Classification: static assets and browser JS are not affected. Build tooling runs on the Vercel build image (24.x). Server functions run nodejs22.x.

### Validation

- `safeExternalFetch.spec.ts`: 27/27 on **v22.23.4**; also passes on v24.22.1.
- Full `pnpm test` on v24.22.1: 1935/1936. The one failure was a 5s timeout in `RankedComments.spec.ts` under machine load; it passes 10/10 when run alone. Not related to this change.
- `pnpm check`: 0 errors, 21 warnings, none in changed files.
- `pnpm build` on v24.22.1: pass, including `check:server-runtime` and every budget ratchet. `[runtime] node` is present in the built `hooks.server.js`.
- Prettier and ESLint are clean on changed files.

### Proposed rollout (needs DJ authorization)

1. Commit the 7 files above, without the unrelated dirty content, and push to `main` (auto-deploys production).
2. If the Vercel install fails with `ERR_PNPM_UNSUPPORTED_ENGINE`, Vercel's build image isn't patched yet. Production stays on the previous deployment, with no outage. Redeploy once Vercel rolls out 24.22.1, or temporarily relax the floor.
3. After the deploy, run `vercel logs` and look for `[runtime] node`. Every instance must show ≥ v22.23.4. Instances, regions and preview/rollback deployments that weren't seen stay listed as unknown.
4. Rollback: `vercel promote` / `vercel rollback` to `dpl_9AwCgXGnHhk2rKkdV67qqmYn6cuu`, or `git revert` the commit.

### Open owner actions

- **Commit/push/deploy:** pending DJ.
- **Restart long-running Node processes on the Mac** (OpenClaw gateway, BuildOS MCP servers, any dev servers started before 16:27Z): pending DJ. They keep running the unpatched Node until restarted.
- **Vercel function patch:** Vercel-managed. Unverified until step 3.
- **Link-preview check against a controlled benign URL in prod:** not done. It would mean posting a comment, which needs separate approval.
