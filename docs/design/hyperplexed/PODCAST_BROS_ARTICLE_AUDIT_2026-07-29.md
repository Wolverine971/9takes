<!-- docs/design/hyperplexed/PODCAST_BROS_ARTICLE_AUDIT_2026-07-29.md -->

# Podcast Bros Article Audit — 2026-07-29

Surface: `/pop-culture/podcast-bros-enneagram-analysis`

Scope: article header, cast image, table of contents, long-form body, mobile table, related-content bridge, and editorial trust.

## Tier 1 — cheap, high-impact

- **Cast image:** six full names collided across portrait boundaries, especially at 390px. Added optional short display labels while preserving full accessible names, capped label overflow, and switched crowded mobile casts to a readable 3×2 portrait grid. → P1+P6
- **Type consistency:** the hero correctly labeled Tim Ferriss Type 1 while the comparison table and analysis called him Type 5. Reconciled the article with the canonical Ferriss profile and rewrote the relevant analysis. → P4+P6
- **Related bridge:** the footer sent readers to Type 7 even though this article centers Type 5 expertise and Type 8 challenge. Corrected the mapping to Type 5 + Type 8. → P4+P6
- **False interview claim:** removed the stated Lex Fridman–Vladimir Putin interview, which does not appear in Fridman's official episode catalog, and added an explicit correction in the article. → P6

## Tier 2 — structural within the surface

- **Act II scanability:** five consecutive bold-led biographies formed a text wall. Promoted each person to an H3 so the network formation section has a legible hierarchy. → P4
- **Evidence discipline:** removed invented or unsupported precision around loneliness, a 90-minute psychological switch, audience demographics, and post-controversy behavior. Replaced it with qualified claims and links to primary/first-party sources where available. → P6
- **Interpretive boundary:** added a method note distinguishing public-behavior Enneagram analysis from clinical assessment and association from causation. → P6
- **Sensitive claims:** attributed the Huberman allegations, noted that portions were disputed, and removed language that presented allegations or inferred audience response as settled fact. → P6

## Tier 3 — polish/signature

- **Motion:** the cast image is already the page's signature moment. No new effect was added; its hover movement now has a reduced-motion fallback. → P11

## Sources checked

- [Lex Fridman Podcast official episode catalog](https://lexfridman.com/podcast/)
- [Tobin & Guadagno (2022), _Why people listen_](https://doi.org/10.1371/journal.pone.0265806)
- [Edison Research, 2025 podcast findings](https://www.edisonresearch.com/top-10-findings-of-2025-from-edison-research/)
- [Tim Ferriss, causes and grants](https://tim.blog/about/causes/)
- [Tim Ferriss, 2024 podcast sabbatical](https://tim.blog/2024/09/16/my-new-rules-for-podcasting-to-keep-things-interesting/)
- [New York Magazine's 2024 Huberman profile](https://nymag.com/intelligencer/article/andrew-huberman-podcast-stanford-joe-rogan.html)
- [Spotify's 2022 platform-rules response](https://newsroom.spotify.com/2022-01-30/spotifys-platform-rules-and-approach-to-covid-19/)

## Verification

- Pre-fix live review: 1440×1000 desktop and 390×844 mobile, dark mode; no page-level horizontal overflow or console errors.
- Post-fix live review: 1440×1000 desktop in dark and light mode plus 390×844 mobile in dark mode; HTTP 200, no page-level horizontal overflow, no console errors, and no clipped cast labels.
- Content checks: Tim Ferriss is consistently Type 1, the related bridge points to Types 5 and 8, the five Act II profiles are real H3 sections, and the article contains 11 external evidence links.
- Automated checks: `pnpm check` passed; the two relevant Vitest files passed (5 tests); `git diff --check` passed; Svelte autofixers reported no findings.
- Repository radius lint is blocked by an unrelated pre-existing `0.875rem` radius in `src/routes/account/+page.svelte:1243`; none of the files changed for this audit introduced a radius violation.
