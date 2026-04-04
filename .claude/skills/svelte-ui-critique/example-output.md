# UI Critique: src/routes/admin/marketing/+page.svelte

## Findings

### P1

- The first screen spends too much vertical space on decorative framing before clarifying the main action. On smaller screens this delays orientation and makes the page feel heavier than it is.

### P2

- Filter and tab states are visually close in weight, which makes it harder to tell whether the user is narrowing data or switching modes.

### P3

- The token usage is mostly aligned, but a few accent treatments still compete with each other instead of establishing one dominant action color.

## Quick Wins

- compress hero spacing
- make the primary action visually dominant
- separate filter controls from mode-switch controls

## Bigger Refactors

- break the first screen into a clearer hierarchy of overview, action, and supporting status

## Token / Pattern Notes

- prefer one accent family per panel cluster
- keep card radii and glow treatments consistent with the admin audit baseline

## Recommended Next Step

- run a small hierarchy pass before any visual polish work
