---
name: hyperplexed-audit
description: Audit and polish 9takes UI surfaces with the HyperPlexed-derived design playbook. Use when asked to audit, review, redesign, refine, or implement fixes for a Svelte/SvelteKit route, page, component, modal, admin surface, or user flow using the HyperPlexed workflow; when the user invokes /hyperplexed-audit; or when findings should cite P-pattern recipes and update the HyperPlexed tracker.
path: .claude/skills/hyperplexed-audit/SKILL.md
---

# HyperPlexed Audit

Use this skill to run the migrated `/hyperplexed-audit` flow. The goal is not a broad redesign. Audit one surface, region by region, using the HyperPlexed playbook as the rubric and the P-patterns as implementation recipes.

## Load Context

For 9takes, prefer the live repo docs because the tracker and local recipes can change:

- `docs/design/hyperplexed/HYPERPLEXED_DESIGN_PLAYBOOK.md`
- `docs/design/hyperplexed/HYPERPLEXED_FIX_PATTERNS.md`
- `docs/design/hyperplexed/HYPERPLEXED_AUDIT_TRACKER.md`
- `docs/design-system.md`
- `docs/design/2026-06-09-design-audit.md`
- `docs/design/2026-06-11-mobile-audit.md`
- Matching prior audits in `docs/design/hyperplexed/`, `docs/design/`, `docs/audits/`, and `docs/development/`

If those repo docs are missing or the task is outside 9takes, read the bundled equivalents:

- `references/playbook.md` for the original rubric and source video index
- `references/fix-patterns.md` for the original reusable recipe shape
- `references/audit-tracker.md` for tracker structure and backlog modeling
- `references/claude-command.md` for the bundled Claude Code command
- `references/audit-examples/` only when an example audit format is needed
- `references/transcripts/` only when grounding a new heuristic or effect in the source corpus

## Workflow

1. Resolve the target. If the user gives no target, ask for one component, route, page, flow, or file path. For a route, include the `+page.svelte` and its main children.
2. Search for prior art. Look in the HyperPlexed docs, general design/audit folders, and the tracker. If a prior audit exists, stack on it instead of rediscovering the same items.
3. Enumerate regions before judging. Examples: header, hero, sidebar, card list, composer, filter bar, table, footer, modal chrome, empty state.
4. Audit each region in leverage order:
   - Alignment and geometry
   - Even padding and density
   - Labels and microcopy, trying rename before redesign
   - Hierarchy by type, not extra containers
   - Decluttered paths, filters, drawers, and scroll regions
   - Overflow handling for user-supplied strings
   - 9takes V5 token/radius/shadow fit
   - Icon consistency, imagery, and scrims
   - Motion, reduced-motion gating, keyboard access, primitives
   - At most one earned signature delight per surface
5. Present findings tiered by leverage and stop before code edits unless the user has already explicitly approved implementation.

Use this report shape:

```markdown
## Tier 1 - cheap, high-impact (alignment/padding/labels)

- [region] finding -> P#

## Tier 2 - structural within the surface (declutter/hierarchy)

- [region] finding -> P#

## Tier 3 - polish/signature (motion/effects, at most one per surface)

- [region] finding -> P14-P18
```

Every finding must cite a pattern such as `-> P1`, `-> P6+P1`, or `-> new P?` if no recipe fits.

## Applying Fixes

Apply only fixes the user approved in the audit phase. Use the P-recipes directly where they exist:

- P1 overflow-safe rows
- P2 two-radius rule
- P3 shared shell width and padding
- P4 metadata as subtext
- P5 mono micro-labels / SectionKicker
- P6 rename before restyle
- P7 filters button plus selected chips
- P8 do not hide what fits
- P9 fixed icon containers and one icon set
- P10 imagery scrims
- P11 reduced-motion gating
- P12 mobile card fallback for wide tables
- P13 primitives for interactive controls
- P14-P18 signature effects

Respect 9takes conventions: Streetlamp Symposium V5 tokens, Svelte 5 runes in modern files, Tailwind + SCSS, Flowbite only where already established, `Button`/`Modal`/`Callout` atoms where appropriate, and no raw color-name classes or off-scale radii. Do not edit canonical primitives unless the user explicitly asks.

If an approved fix creates a reusable pattern and a second surface will plausibly need it, add the next P-number to `HYPERPLEXED_FIX_PATTERNS.md` with the same finding/recipe shape, include reduced-motion behavior, and cite it from the audit.

## Verification And Docs

After implementation, run the local checks appropriate to the repo. Default for 9takes UI work:

```bash
pnpm check
pnpm lint:radius
pnpm format
```

Use `pnpm lint` for broader styling or multi-file work. State the results. If fixes are visual, note whether live before/after screenshots were captured at desktop and iPhone widths. If not captured, mark that as still owed.

Update docs when the surface warrants it:

- Tracker: add or update the row with shipped fixes, deferred items, P-pattern citations, and verify status.
- Audit doc: create or update `docs/design/hyperplexed/<SURFACE>_AUDIT_<date>.md` for multi-region findings or deferred work. Append to an existing audit instead of creating a duplicate.
- Cross-reference broad audits such as `docs/design/2026-06-09-design-audit.md`, `docs/design/2026-06-11-mobile-audit.md`, and relevant `docs/audits/*` when findings overlap.
