<!-- docs/design/button-atom-migration-spec.md -->

# Button Atom Migration Spec (2026-05-29)

Authoritative rules for migrating every `.btn` / `.btn-*` button to the canonical
`<Button>` atom. Every migrating agent MUST follow this exactly so 57 files come out
identical in style. Goal: ONE button system. After migration, all local/shared/global
`.btn*` CSS is deleted (the orchestrator deletes the shared/global blocks last).

Atom source: `src/lib/components/atoms/Button.svelte`. Props:
`variant` (`primary`|`secondary`|`ghost`|`danger`, default `primary`),
`size` (`sm`|`md`|`lg`, default `md`), `loading`, `fullWidth`, `href`, `disabled`,
`type`, `onclick`, `icon`/`iconRight` (snippets), `class`. It spreads `...rest`, so
`title`, `aria-*`, `data-*`, `id`, `target`, `rel`, `form`, etc. pass through.

## 1. Import

Add to the file's `<script>` (TS or not), once:

```ts
import { Button } from '$lib/components/atoms';
```

If the file already imports other atoms from `'$lib/components/atoms'`, merge into that import.

## 2. Element → component

- `<button class="btn-primary" …>Label</button>` → `<Button …>Label</Button>`
- `<a class="btn-primary" href="/x" …>Label</a>` → `<Button href="/x" …>Label</Button>`
  (the atom renders an `<a>` when `href` is set)

## 3. Variant mapping (by class)

| Old class                                                       | `variant`                                                                                                                                                                        |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `btn-primary`, `btn-hub-primary`, `btn-pill-primary`, `btn-cta` | `primary` (OMIT the prop — it's the default)                                                                                                                                     |
| `btn-secondary`, `btn-outline`, `btn-hub-secondary`             | `secondary`                                                                                                                                                                      |
| `btn-ghost`                                                     | `ghost`                                                                                                                                                                          |
| `btn-danger`, `btn-delete`, delete/destructive buttons          | `danger`                                                                                                                                                                         |
| bare `btn` (no color class, no inline bg)                       | **`secondary`** (neutral bordered) — UNLESS it has an inline amber bg (`--lamp-glow`) → `primary`, or is clearly a subtle text-only action → `ghost`. Use judgment from context. |

Pill (`btn-pill-primary`, `border-radius:999px` + full width) → `primary` + `fullWidth`.
We intentionally drop the 999px pill radius for the atom's 10px — that is the design intent.

## 4. Size mapping

`btn-sm` → `size="sm"` · `btn-lg` → `size="lg"` · otherwise omit (md is default).

## 5. Full width

If the button had `btn-full`, `w-full`, `width: 100%`, or `display:block` full-width intent → add `fullWidth`.

## 6. Preserve behavior (CRITICAL — never drop these)

- `on:click={fn}` or `onclick={fn}` → `onclick={fn}`
- `type="submit"` / `type="reset"` → keep as `type="submit"` / `type="reset"`
- `disabled={x}` → `disabled={x}`
- `aria-*`, `title`, `id`, `data-*`, `name`, `value`, `form` → keep (they pass through `...rest`)
- `href`, `target`, `rel` (for link-buttons) → keep

## 7. Loading state

If the button manually shows a spinner and/or disables itself while a request runs
(e.g. `{#if saving}<span class="spinner" />{/if}` or `disabled={saving}` plus spinner markup):
→ pass `loading={saving}` and DELETE the manual spinner markup. The atom renders its own
spinner and sets `aria-busy`. Keep the label text as children.

## 8. Icons

- Leading icon + text: use the `icon` snippet —
  `<Button>{#snippet icon()}<svg…/>{/snippet}Label</Button>`
- Trailing icon: `iconRight` snippet.
- Icon-only button: put the icon in children and keep its `aria-label`/`title`.
- If unsure, putting icon + text together inside the default children is acceptable.

## 9. Layout/spacing that lived on the button class

If a button's local style set margin/positioning/grid-area (NOT color/padding/radius —
those come from the atom), preserve it: pass a small utility/scoped class through
`class="…"` (the atom merges it) or an inline `style`. Do NOT recreate the atom's
own background/border/radius/font — let the atom own those.

## 10. Delete the file's local button CSS

After migrating a file's markup, remove that file's `<style>` rules for
`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-hub-*`,
`.btn-pill-*`, `.btn-sm`, `.btn-lg`, and their `:hover`/`:disabled`/`:focus` variants —
EXCEPT a rule that is also used by a non-button element still present, or that only sets
preserved layout (per §9). If a `.btn-*` rule is fully replaced by the atom, delete it.
Leave `.btn-danger`/`.btn-success` color rules ONLY if a non-migrated element needs them
(rare) — otherwise delete.

## 11. Do NOT touch

- `src/lib/components/atoms/Button.svelte`, `LoadingButton.svelte`
- `<code>`/text that merely NAMES a class (docs/styleguide callouts)
- Print/export/canvas ARTIFACT styles in asset-generators (poster/zine/question-print
  output) — only migrate the editor's UI control buttons.
- Anything inside `{@html …}` template-literal email strings.

## 12. After editing

Report per file: instances migrated, any judgment calls (bare `.btn` variant choices,
loading conversions, icons, layout preserved), and anything you left untouched + why.
