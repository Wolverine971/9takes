---
name: svelte-ui-critique
description: Review a Svelte or SvelteKit route, component, or admin flow for hierarchy, mobile clarity, token usage, state design, and Svelte 5 fit. Use when critiquing product or admin UI before making design changes.
argument-hint: '<route, component, or file path>'
disable-model-invocation: true
---

# Svelte UI Critique

Use this skill for structured UI review. Default to critique only.

Do not edit product files unless the user explicitly asks for implementation after the critique.

If `$ARGUMENTS` is empty, ask for one of:

1. A route
2. A component
3. A file path

Examples:

```text
/svelte-ui-critique src/routes/admin/marketing/+page.svelte
/svelte-ui-critique src/routes/personality-analysis/[slug]/+page.svelte
/svelte-ui-critique src/lib/components/blog/Article.svelte
```

## Read First

Load the minimum relevant context:

- `CLAUDE.md`
- `.claude/commands/design-update.md`
- `docs/brand/README.md`
- `docs/admin-style-audit.md`

If the target is not in admin, also load the most relevant design or CSS guide you can find under `docs/design/` or `docs/development/`.

For the exact output shape, use:

- [template.md](template.md)
- [example-output.md](example-output.md)

## Workflow

### 1. Resolve scope

Figure out whether the user wants:

- a single-file critique
- a route/page critique
- a user flow critique across multiple files

If the request points to a route, read the primary route file plus the most important adjacent components it uses.

### 2. Review the UI through these lenses

#### Information hierarchy

- Is the primary action obvious?
- Do the title, subtitle, and first screen explain the page clearly?
- Is the layout trying to say too many things at once?

#### Mobile behavior

- Does the page still scan cleanly on a narrow screen?
- Are dense tables, cards, filters, or editors likely to break down on mobile?
- Are spacing and text blocks doing too much?

#### Design-token discipline

- Are old tokens or hardcoded hex values still present?
- Is the page aligned with the current token system for its surface?
- Is Flowbite or utility styling fighting the local design language?

#### State clarity

- Are loading, empty, error, and success states obvious?
- Are destructive or high-stakes actions clear?
- Do filters, tabs, or modals create hidden confusion?

#### Svelte 5 fit

- Is the file using runes cleanly where it should?
- Are legacy patterns creating avoidable complexity?
- Is the component structure making state harder to reason about?

### 3. Output findings in priority order

Findings must be concrete. Point to the exact UI or file behavior causing the problem.

Use the supporting template and adapt it to the target.

## Rules

- Findings first. Summary second.
- Prioritize behavior, hierarchy, and clarity over aesthetic preferences.
- Distinguish style drift from actual UX risk.
- For admin surfaces, use `docs/admin-style-audit.md` as the baseline.
- For implementation follow-up, prefer handing off to the existing `design-update` workflow unless the user explicitly wants this skill to continue into edits.

## Save Behavior

Do not write a file unless the user asks or the workflow clearly calls for it.

If saving is useful, default to:

- `docs/design/[slug]-ui-critique.md`
