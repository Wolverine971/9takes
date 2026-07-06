<!-- docs/development/project-cleanup-report-2026-07-06.md -->
# 9takes Project Cleanup Report

Generated: 2026-07-06

## Executive Summary

- Root-level cleanup: moved or archived 26 tracked files/directories out of root-facing clutter.
- Configuration: kept `database.types.ts` at root because imports and `scripts/generate-types.js` currently depend on that location.
- Scripts: archived one scratch script and redirected CSS audit report output into `docs/development/reports/`.
- Documentation: updated references to relocated strategy/outreach docs.
- Deferred: transcript libraries, automation logs, `.DS_Store` cleanup, and deeper dependency/script validation.

## Completed Cleanup

### Root Documents Relocated

| Source                    | Destination                               | Reason                                 |
| ------------------------- | ----------------------------------------- | -------------------------------------- |
| `9takes-strat.md`         | `docs/planning/9takes-strat.md`           | Strategy/planning document             |
| `outreach-plan.md`        | `docs/outreach/outreach-plan.md`          | Outreach priority list                 |
| `cold-outreach-system.md` | `docs/outreach/cold-outreach-system.md`   | Outreach operating-system blueprint    |
| `claude-code-skills.md`   | `docs/project-docs/claude-code-skills.md` | Internal project/AI tooling assessment |

### Root Assets Relocated

Moved tracked source images into `docs/distribution-assets/source-images/`:

- Standalone person/source images: `Asmongold.png`, `Carina-Zavline.png`, `Matt-Smith.png`, `Robert-De-Niro.png`, `Tobey-Maguire.png`, `chappel-vanity.png`
- Batch source folder: `Freshies16 (3)/` -> `docs/distribution-assets/source-images/freshies16/`
- Lana source folder: `Lana Del Rey/` -> `docs/distribution-assets/source-images/lana-del-rey/`

### Agent Artifacts Archived

Moved `agent-files/` to `docs/archives/agents/root-agent-files/`.

Reason: no active references outside historical logs; contents are stale notes plus a generated 2026-01 profile snapshot.

### Scripts Cleanup

| Change                                                                    | Reason                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `scripts/2048.js` -> `docs/archives/scripts/2048.js`                      | Broken scratch/game prototype, not referenced by package scripts or docs |
| `scripts/css-scanner.js` report paths -> `docs/development/reports/`      | Prevents future root-level report output                                 |
| `scripts/unused-css.js` report paths -> `docs/development/reports/`       | Prevents future root-level report output                                 |
| `package.json` `gen:sctx` output -> `docs/archives/sproject-context.json` | Prevents future root-level `sproject-context.json` regeneration          |

## Decisions Made

### `database.types.ts`

Kept at root.

Reason: `app.d.ts`, `src/app.d.ts`, many route/server modules, and `scripts/generate-types.js` import or generate this exact root path. Moving it would require a coordinated import rewrite and generator update.

### SQL Scripts

Kept `scripts/classify-newsletter-signup-spam.sql` and `scripts/quarantine-newsletter-signup-spam.sql`.

Reason: both are referenced from `docs/security/signup-spam-classification-2026-06-19.md`.

## Deferred Items

### Needs Approval or Broader Policy

| Item                                                                                  | Notes                                                                                                                               |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `.DS_Store` files                                                                     | Ignored by `.gitignore`, still present locally in root/docs/supabase/src subdirectories. Safe to delete, but deletion was deferred. |
| `youtube-transcripts/`, `youtube-transcript-research/`, `youtube-transcripts-people/` | 276 files total. These appear to be active content/research libraries, not safe to relocate blindly.                                |
| `logs/`                                                                               | 219 automation logs. Useful for audit history, but likely needs retention/archive policy.                                           |
| `.pnpm-store/`, `.svelte-kit/`, `.vercel/`, `node_modules/`, `test-results/`          | Generated or environment-specific. Mostly ignored or expected local state.                                                          |
| `scripts/css-scanner.js` vs `scripts/unused-css.js`                                   | They overlap, but have different selector models. Consolidation should be a deliberate follow-up.                                   |
| Package script validation                                                             | `package.json` scripts were inspected, but not all scripts were executed.                                                           |
| Unused dependency audit                                                               | Not run in this pass. Requires dependency tooling and more time.                                                                    |

## Current Root Posture

Root now contains expected app/config files plus these review-worthy directories:

- `logs/`
- `youtube-transcript-research/`
- `youtube-transcripts/`
- `youtube-transcripts-people/`

The remaining root files are standard project files or intentionally retained compatibility files.

## Recommended Next Actions

1. Delete ignored `.DS_Store` files after approval.
2. Decide retention policy for `logs/`: keep current month at root, archive older logs under `docs/archives/logs/`, or ignore/delete generated logs.
3. Decide whether transcript directories remain root-level active libraries or move under `docs/research/transcripts/` with command updates.
4. Run package/script validation in batches: `pnpm check`, targeted script smoke tests, then unused dependency audit.
5. Consolidate or document the two CSS audit scripts.
