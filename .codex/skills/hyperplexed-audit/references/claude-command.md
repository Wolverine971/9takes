---
description: Audit a 9takes UI surface against the HyperPlexed playbook, propose tiered fixes, and apply only approved P-pattern recipes.
argument-hint: '[component, route, or page - e.g. src/routes/questions/+page.svelte]'
path: .codex/skills/hyperplexed-audit/references/claude-command.md
---

# HyperPlexed Audit - 9takes

You are auditing one 9takes surface with HyperPlexed's eye: alignment first, declutter second, hierarchy by type not extra chrome, copy as a design surface, motion restrained and reduced-motion safe. The rubric is the playbook; the fixes are the P-patterns. Audit, propose, wait for DJ, then apply only what is approved.

## Read Before Auditing

| Doc                                                                                   | Role                                                                                     |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `docs/design/hyperplexed/HYPERPLEXED_DESIGN_PLAYBOOK.md`                              | The rubric: taste checklist, interaction/motion principles, 9takes lenses                |
| `docs/design/hyperplexed/HYPERPLEXED_FIX_PATTERNS.md`                                 | The recipes: cite every finding as `-> P#`; add P-numbers when a fix is new and reusable |
| `docs/design/hyperplexed/HYPERPLEXED_AUDIT_TRACKER.md`                                | The rollup: one row per surface, shipped/deferred work, verification state               |
| `docs/design/hyperplexed/*_AUDIT_*.md`                                                | Prior HyperPlexed audits; check first and stack findings instead of duplicating          |
| `docs/design-system.md`                                                               | 9takes V5 source of truth: Streetlamp Symposium, tokens, radius, shadows, atoms          |
| `docs/design/2026-06-09-design-audit.md` and `docs/design/2026-06-11-mobile-audit.md` | Broad prior audits; cross-reference overlapping findings                                 |

If those docs are missing, fall back to `.claude/skills/hyperplexed-audit/references/` for the original playbook, fix patterns, tracker shape, examples, and transcripts.

## If Invoked Without A Target

Ask for one surface: a route, component path, page name, or flow. Otherwise start.

## Process

### 1. Locate And Check Prior Art

- Resolve the target to concrete files. For a route, read the `+page.svelte` plus the main child components it renders.
- Search `docs/design/hyperplexed/`, `docs/design/`, `docs/audits/`, and `docs/development/` for prior audits of the same surface.
- Check the tracker for the surface row. If one exists, stack new findings on existing deferred items.

### 2. Static Audit Region By Region

Do not "audit the page" as one blob. Enumerate regions first: header, hero, filter bar, card grid, table, composer, modal chrome, footer, empty state, etc.

Per region, check in this order:

1. Alignment, geometry, shared edges, and even padding
2. Labels and microcopy; try the rename before the redesign (P6)
3. Hierarchy by type, size, weight, color, and subtext, not extra containers (P4/P5)
4. Decluttered paths, filters, drawers, scroll regions, and duplicate actions (P7/P8)
5. Explicit overflow handling for user-supplied strings (P1)
6. 9takes V5 token fit: `--lamp-*`, `--night-*`, `--stone-*`, `--ink-*`, `--data-teal`, type colors as data only
7. Radius and shadow discipline: `rounded-md` for controls, `rounded-xl` for cards/panels, borders before shadows
8. Icons, imagery, text scrims, and asset fit (P9/P10)
9. Motion, reduced-motion gating, keyboard access, and primitive usage (P11/P13)
10. At most one earned signature delight per surface (P14-P18)

This is a markup/design-system pass first. Start a dev server only when visual confirmation is needed.

### 3. Present Findings And Stop

Report findings tiered by leverage, not by region:

```markdown
## Tier 1 - cheap, high-impact (alignment/padding/labels)

- [region] finding -> P#

## Tier 2 - structural within the surface (declutter/hierarchy)

- [region] finding -> P#

## Tier 3 - polish/signature (motion/effects, at most one per surface)

- [region] finding -> P14-P18
```

Every finding cites a pattern (`-> P#`, `-> P6+P1`, or `-> new P?`). Stop and wait for DJ's approval/input on which fixes to apply. Do not touch product code before that unless DJ already explicitly approved implementation in the prompt.

### 4. Apply Approved Fixes

- Use the P-recipes in `HYPERPLEXED_FIX_PATTERNS.md` directly where they fit.
- If an approved fix has no pattern and a second surface will plausibly need it, add the next P-number to the fix-patterns doc with the same finding/recipe shape and reduced-motion behavior.
- Respect 9takes conventions: Svelte 5 runes when touching modern files, Tailwind + SCSS with V5 tokens, no raw color-name classes, no off-scale radii, and `Button`/`Modal`/`Callout` atoms where appropriate.
- Do not edit canonical primitives (`src/lib/components/atoms/Button.svelte`, `src/lib/components/atoms/Modal.svelte`, `src/lib/components/blog/callouts/Callout.svelte`) unless DJ explicitly asks.

### 5. Verify

Run the local checks that match the change. Default after implementation:

```bash
pnpm check
pnpm lint:radius
pnpm format
```

Use `pnpm lint` instead of the narrower radius check when the fix touches broad styling, scripts, or many files. If the fix is visual, note whether before/after screenshots were captured at desktop and iPhone width. If not captured, mark that as still owed.

### 6. Update Docs

- Tracker: add or update the row in `docs/design/hyperplexed/HYPERPLEXED_AUDIT_TRACKER.md` with shipped fixes, deferred items, P-pattern citations, and verify status.
- Audit doc: if the surface has multi-region findings or deferred work, create/update `docs/design/hyperplexed/<SURFACE>_AUDIT_<date>.md`. Append to an existing audit instead of creating a duplicate.
- Cross-reference broad audits such as `docs/design/2026-06-09-design-audit.md`, `docs/design/2026-06-11-mobile-audit.md`, and relevant `docs/audits/*` when findings overlap.
