<!-- docs/design/hyperplexed/ACCOUNT_AUDIT_2026-09-10.md -->

# Account page audit — 2026-09-10

Scope: `/account`, its dashboard loader, profile and notification settings, and same-type personality recommendations. Implementation was explicitly requested.

Regions: account heading/actions, identity and personal totals, notification activity, recent takes, daily question, community questions, recommended profiles, settings, first-time type selection.

## Tier 1 — alignment, labels, and imagery

- Generic `.card` names inherited global margins, shadows, and hover treatments; headings also inherited global padding. Replaced with locally scoped panel names, explicit heading geometry, and an owned page shell with one 1160px content grid. → P1+P2+P3
- Settings and sign-out competed poorly with profile and content navigation. Added a labeled Lucide settings gear in the account heading, with profile, type, notification, and email controls in a dedicated settings view. The follow-up places a labeled Sign out button beside the gear in the persistent header; the mobile action row keeps its text visible. → P6+P8+P9+P13
- Portrait URLs were built from lowercase article slugs, but production filenames retain canonical capitalization. Use `buildPersonalityImagePath` and `formatPersonalityDisplayName`; retain normalized article links. → P9+P10

## Tier 2 — hierarchy and behavior

- Combined type identity and personal totals into one profile summary. Activity and recent takes occupy the main column; the daily question and community context occupy the supporting column. The phone layout stacks naturally. → P3+P4+P6
- Activity shows the three latest groups initially. Expanding reveals the loaded history, refreshes route data, and brings the newest entries into view. Sort before grouping so input order cannot attach an old timestamp to a recent group. Mark-read behavior is preserved. → P4+P8+P13
- Recommended people now have substantial portraits, readable names and persona titles, and clear profile links. Six desktop columns become three on tablets and two on phones. Missing images retain an initials fallback and the profile link. → P1+P9+P10
- Settings opens with heading focus and returns focus to its trigger. A notification deep link reopens the overview. First-time type selection uses native radio controls. Unsaved type edits do not relabel existing recommendations; cancelling restores the saved type. → P1+P13
- Initialize profile and notification state from server data to prevent a false empty account during hydration. Notification preference saves validate the SvelteKit action result before reporting success. → P6+P13

## Tier 3 — polish

- Restrained amber emphasis on the daily question, unread markers, and actions. Portrait hover motion is disabled under reduced motion. Explicit keyboard focus, stable image dimensions, and overflow-safe text throughout. → P10+P11+P13

## Verification

- Authenticated production page inspected before changes. Desktop before screenshot captured; mobile before screenshot was not captured.
- Local browser checks used a temporary fixture rendering the actual account component and shared site shell; fixture route removed afterward. These are representative account states, not a live authenticated local database session.
- After screenshots inspected at 1440×1000 and 390×844 in dark and light themes, including settings, expanded activity, recommendation portraits, and a first-time account.
- Zero measured horizontal overflow; all six preview portraits loaded; browser error log empty. Expanding activity displayed seven groups with the newest event first and visibly scrolled back to the start of activity.
- 44 focused tests cover account actions, settings focus, activity refresh/order/grouping, saved type consistency, failed saves, and portrait resolution/fallback. Real Type 2, 3, and 8 asset paths checked on disk.
- Svelte autofixer: zero issues. `pnpm check`: zero errors, 154 warnings. Changed-file Prettier and ESLint pass (five existing unused-disable warnings); radius, color, and global CSS lint pass. Repository-wide `pnpm lint` stops at existing formatting failures outside this change; no broad formatting changes applied.

No schema changes or production account writes were needed. No deployment performed.

Sign-out follow-up: existing logout action and loading behavior preserved; 10 account component tests pass and the Svelte analyzer reports zero issues. Fresh screenshots of this small header follow-up were not captured.
