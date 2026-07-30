<!-- docs/design/hyperplexed/PODCASTER_PERSONALITY_MAP_AUDIT_2026-07-29.md -->

# Podcaster Personality Map Audit — 2026-07-29

Surface: `/pop-culture/podcaster-personality-map`

Scope: article header, cast hero, table of contents, comparison table, long-form body, metadata, social preview, source discipline, and responsive behavior.

## Current verdict

The concept and shared article shell are sound, and Tiers 1–3 plus the factual-sourcing pass are shipped locally. Responsive structure, hierarchy, hero loading, scope, long-form architecture, preview copy, TOC contrast, prose polish, metadata, and source discipline are complete.

## Tier 1 — cheap, high-impact

- [x] **Cast hero:** use explicit short display labels while preserving full image alt text and the group accessible name. → P1+P6
- [x] **Mobile TOC:** keep the inline table of contents collapsed below the desktop breakpoint so it does not insert a full screen of navigation before the article. → P6+P13
- [x] **Heading hierarchy:** replace H2→H4 jumps with H3 host and subsection headings. → P4+P6
- [x] **Social preview:** prefer the article composite over the first cast portrait for Open Graph, Twitter, and Article JSON-LD, with its real 2200×1080 dimensions. → P6+P10
- [x] **Freshness metadata:** update `lastmod` to the date of this remediation pass. → P4+P6

## Accuracy and methodology backlog — urgent

- [x] Reconcile “six Enneagram types” with the five types represented in the table.
- [x] Reconcile “five of the twelve” with the thirteen people listed.
- [x] Rename Brittany Broski's show from “Broski Nation” to **The Broski Report**.
- [x] Replace Dave Portnoy's stale “BFFs / Barstool” show label with **Barstool Sports / One Bite**.
- [x] Remove the false completed Lex Fridman–Vladimir Putin interview claim; the article now describes it as an ambition rather than a published episode.
- [x] Remove the false claim that Shane Gillis has never launched a podcast while consolidating the unsupported “missing types” section.
- [x] Remove the stale Modern Wisdom episode and download counts; the argument no longer depends on a moving audience milestone.
- [x] Remove the stale Brené Brown hiatus example while consolidating the unsupported “missing types” section.
- [x] Remove the stale Marc Maron example while consolidating the unsupported “missing types” section.
- [x] Remove the stale claim that Howard Stern is a video holdout.
- [x] Remove the Joe Rogan contract value and describe Alex Cooper's agreement only as a reported nine-figure deal.
- [x] Replace “the biggest podcasters” with a defensible scope: a curated sample of 13 personality-led long-form and interview hosts, with ranking context and selection limits stated upfront.
- [x] Move the “map, not a diagnosis” caveat directly below the introduction and identify every typing as editorial interpretation based on public behavior.
- [x] Remove the unsupported Andrew Huberman allegations-to-stress-line inference from this article.
- [x] Remove the prescriptive health claims; the Huberman section now names broad episode subjects and explicitly allows that individual protocols may change under further research.
- [x] Soften unsupported neuroscience such as “the 5's nervous system is literally regulated by understanding.”
- [x] Source the surviving numerical, biographical, reputational, and quotation-based claims. Previously flagged Rogan COVID, Cooper split, Stern apology, template-user, and moving audience claims no longer appear; Cooper's current SiriusXM agreement is linked to the company announcement and its reported value to reputable reporting.
- [x] Remove claims that podcasters replace therapists, professors, or priests and explicitly state that a listening queue is not evidence about a listener's mental health.
- [x] Replace loaded and deterministic phrasing, including “every host,” private-motive certainty, “core wound” declarations, and categorical type claims, with attributed or conditional language.
- [x] Explain that the “missing types” pattern may be a consequence of sample selection, especially because the article excludes major true-crime, news, ensemble, and comedy shows.
- [x] Add inline evidence links plus a compact, dated sources/methodology section.

## Post-UI editorial pass

- [x] Tighten the 172-character meta description to 148 characters while retaining the sample size, named-host context, Enneagram keyword, and article promise.
- [x] Link the remaining factual claims to official catalogs, host biographies, company announcements, original episodes, or reputable reporting.
- [x] Remove or narrow details that could not be supported at the same level, including the exact duration of Chris Williamson's nightclub career and the claim that One Bite owners are often present.
- [x] Add a July 29, 2026 freshness note and state that moving audience totals are intentionally omitted outside dated rankings.

## Tier 2 — structural within the surface

- [x] **Comparison table:** one shared dataset now renders an accessible table at tablet/desktop widths and full-width linked cards with identity, type, show, topic gravity, and interview style on phones. → P12
- [x] **Hero loading:** the article opts its above-the-fold six-person cast hero into eager loading while other article groups retain lazy loading. → P10
- [x] **Article architecture:** reduced the draft from roughly 7,350 to about 4,740 words, consolidating Dream Crossovers, Parasocial Flavor, rotation readings, missing-type claims, crisis responses, Rabbit Holes, and repeated conclusions. → P4+P6
- [x] **Method placement:** scope, selection method, typing caveat, source standard, and ranking context now appear before the comparison map. → P4+P6
- [x] **TOC density:** the article sets a 14-entry ceiling; when the full H2/H3 outline exceeds it, the shared TOC keeps the complete H2 spine instead of a partial deep outline. → P4+P8

## Tier 3 — polish/signature

- [x] Increase inactive desktop TOC contrast in light mode with `--ink-mid`, while reserving darker amber and a tinted surface for hover/active states. → P6
- [x] Populate `previewHtml` with a concise summary that adds sample and format context without repeating the description. → P4+P6
- [x] Remove the article's unused `PopCard` import. → P8
- [x] Complete the de-AI copy edit: the article is now roughly 3,940 words, prose em dashes are eliminated, repeated contrast constructions are removed, and private-motive claims are framed as interpretations. → P6
- [x] Do not add another signature effect; the cast hero already supplies the page's visual moment. → P11

## Sources queued for the editorial pass

- [Edison Research — Top 50 Podcasts in the U.S., Q1 2026](https://www.edisonresearch.com/the-top-50-podcasts-in-the-u-s-q1-2026-from-edison-podcast-metrics/)
- [Spotify — 2025 global podcast rankings](https://newsroom.spotify.com/2025-12-03/wrapped-top-artists-songs-albums-podcasts-audiobooks/)
- [Lex Fridman Podcast — official catalog](https://lexfridman.com/podcast/)
- [The Broski Report — Apple Podcasts](https://podcasts.apple.com/us/podcast/the-broski-report-with-brittany-broski/id1687559061)
- [Matt and Shane's Secret Podcast — official site](https://www.shanemgillis.com/mssp)
- [Brené Brown — Unlocking Us is back](https://brenebrown.com/podcast/unlocking-us-is-back/)
- [Marc Maron's WTF finale — AP](https://apnews.com/article/4b06986706fd9dba39bfde2070b8b0c6)
- [Howard Stern — 2026 YouTube rollout](https://www.howardstern.com/news/2026/03/30/video-howard-sterns-greatest-celebrity-interviews-are-headed-to-youtube/)
- [Spotify — Joe Rogan partnership](https://newsroom.spotify.com/2024-02-02/the-art-of-podcasting-with-joe-rogan-and-his-new-multiyear-spotify-partnership/)
- [SiriusXM — Alex Cooper agreement](https://www.siriusxm.com/blog/alex-cooper)

## Verification

- Pre-fix live review: desktop and responsive layouts in light and dark mode; no console errors or page-level horizontal overflow.
- Post-fix live review: 1440×1000 desktop and 390×844 mobile in dark and light themes. Desktop renders the 13-row table; mobile replaces it with 13 full-width linked cards. Both breakpoints have zero page-level or card-level overflow.
- Tier 2 behavior checks: the TOC exposes the complete H2 spine, all six hero portraits use eager loading and complete successfully, the method note appears before the map, and the mobile cast layout renders all six portraits without clipped labels.
- Tier 3 live review: the light desktop TOC renders inactive links in `--ink-mid` and the active section in darker amber on a tinted surface. Active tracking now initializes for SSR-provided headings and updates both the inline and floating TOCs. The revised headline fits at 390×844, where the accordion remains closed in dark and light themes.
- Semantic and metadata checks: article headings now use only H1–H3, `article:modified_time` is `2026-07-29`, and the social image resolves to the 2200×1080 podcaster composite.
- Browser diagnostics: no console errors or warnings.
- Editorial verification: all 20 external evidence URLs were resolved or confirmed through current search results; the dated Edison and Spotify ranking pages, first-party catalogs, host biographies, SiriusXM announcement, and reputable deal/biography reporting support the claims attached to them.
- Automated checks: `pnpm check` passed with 0 errors and 142 existing repository warnings; focused Prettier and `git diff --check` passed. The legacy-mode Svelte analyzer reports only the shared TOC's two pre-existing `{@html}` cautions and store-migration suggestion; server heading text is escaped and the client path builds from `textContent`.
- Repository radius lint remains blocked by an unrelated pre-existing `0.875rem` declaration in `src/routes/account/+page.svelte:1243`; the Tier 2 component's `1rem` radii are on the approved scale.
