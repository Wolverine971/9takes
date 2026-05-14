---
title: Alix Earle Type 3 → Type 9 retype — remaining work
date: 2026-05-14
owner: DJ
status: in-progress
related:
  - src/blog/people/drafts/Alix-Earle.md
  - src/blog/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis.md
  - src/blog/pop-culture/influencer-enneagram-types-instagram.md
  - docs/marketing/9takes-cluster-strategy.md
path: docs/planning/alix-earle-type-9-retype-handoff-2026-05-14.md
---

# Alix Earle Type 3 → Type 9 retype

On 2026-05-14, the canonical Alix Earle analysis (`src/blog/people/drafts/Alix-Earle.md`)
was updated to type her as **Enneagram 9 (Peacemaker)**, not Type 3 (Achiever).
The beef article was rewritten in the same session. This doc tracks what still needs to happen.

## What was completed this session

### `src/blog/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis.md` — full rewrite

- Frontmatter description rewritten ("Peacemaker who never wanted to fight").
- `picGroup` Earle entry: `enneagramType` 3 → 9, image path `/types/3s/` → `/types/9s/`.
- `lastmod` bumped to 2026-05-14.
- JSON-LD `articleBody`, `description`, keywords ("Type 7 Type 9"), and personality-types FAQ all reflect Type 9.
- QuickAnswer + "Two Types Walk Into a Business Deal" diagnostic rewritten.
- Stress arrow corrected: Earle is **9 → 6** under stress (anxious, scattered, needs someone outside to mobilize the exit), with **9 → 3** as the integration arrow (the Unwell deal and DWTS were both 9-integrating-to-3 under structure).
- Every timeline section (Sep 2023 → May 12 2026) reframed through Type 9 lens.
- Comparison table Earle row updated: "Drifted as the room changed; family mobilized the exit."
- "Earle's Blind Spot" rewritten: susceptible to merger (not prestige); needed her father to extract her.
- Resolution arc: Nine → 3 (claim her own position) instead of Three → 6.

### `src/blog/pop-culture/influencer-enneagram-types-instagram.md` — partial fix

- Alix Earle removed from the **Type 3 Hall of Mirrors** bullet list.
- Alix Earle removed from the **Type 3 Faces** roster.

### `docs/marketing/9takes-cluster-strategy.md` — fixed

- TikTok cluster: "Alix Earle (Type 3)" → "Alix Earle (Type 9)".
- Cluster header updated from "(Types 2, 3, 7)" → "(Types 2, 3, 4, 7, 9)" to reflect actual member types.

---

## Remaining work

### 1. Publish the updated Alix Earle analysis (blocker for the beef post's internal link)

`src/blog/people/drafts/Alix-Earle.md` has `published: false`. The beef post links to
`/personality-analysis/alix-earle` — that link is **broken in production until the draft is published**.

Run:

```bash
pnpm push:people        # parse + push famous-people blog drafts to Supabase
pnpm gen:famous-types   # regenerate famous-types data
pnpm gen:personality-image-map
```

Then flip `published: true` in the admin (`/admin/content-board`) for Alix-Earle, or in the
draft frontmatter before pushing. Verify with:

```bash
pnpm dev
# visit http://localhost:5173/personality-analysis/Alix-Earle
```

### 2. Reindex the beef blog into Supabase FTS

The blog body changed substantially. Search results will surface stale Type 3 language until reindex.

```bash
pnpm index:blogs        # incremental
# or
pnpm index:blogs:force  # rebuild
```

### 3. Add Alix Earle to the Type 9 section of `influencer-enneagram-types-instagram.md`

Removing her from Type 3 is the safe fix; **adding her to Type 9 is the better fix** but
needs nuance the current Type 9 section doesn't have.

The existing Type 9 section is framed around _"Platform fit: low. Type 9s find the attention itself uncomfortable."_
Alix is the highest-grossing creator on the list and the platform's archetypal Type 9 —
which means the section needs an asterisk:

> **The exception**: Alix Earle is the rare Type 9 who turned the merger itself into the product.
> She doesn't curate, doesn't strategize, doesn't perform — she just shows up in the bathroom
> with the camera on. The friend on FaceTime, scaled. Most Nines avoid the spotlight because the
> attention forces a position. Alix's whole format is the absence of a position. The same
> nervous system that makes most Nines avoid Instagram makes her the highest-paid lifestyle
> creator on it.

This rewrite should also touch the **Platform fit** line ("Low — _except for the rare Nine who builds the format around not curating_") to keep the section internally consistent.

### 4. Audit other cross-references

`grep -rn "Alix" docs/ src/blog/` surfaces ~15 files. The vast majority don't assert her
Enneagram type (search analytics, social-ladder maps, blog inventories, outreach docs).
Worth a spot-check pass, but no Type 3 assertions remain after this session except possibly:

- `src/lib/server/personalityCategoryData.ts` — `Alix-Earle` is in `CREATOR_MEDIA_LIFESTYLE_SLUGS`.
  That's an industry/role grouping, not an Enneagram grouping. **No change needed.**

### 5. Republish-trigger checklist when this all ships together

```bash
pnpm gen:famous-types
pnpm gen:personality-image-map
pnpm gen:sitemap
pnpm index:blogs:force          # only if other blog content changed too
pnpm check                      # type-check
```

### 6. Optional: social distribution

The retype is a meaningful narrative pivot. If pushing socials:

- The Today-show "I love everyone" moment is now the central Type 9 evidence — strong TikTok hook.
- The "TJ extracted her from the deal" beat is new and tabloid-friendly.
- Avoid republishing the old Type 3 framing in any Instagram/Twitter scheduled posts —
  spot-check the queue.

---

## Why this retype matters (one-paragraph context for future-me)

The Type 3 reading of Alix Earle was the obvious one — Forbes 30 Under 30, perfect scoreboards,
the "Alix Earle Effect." The Type 9 reading is the better one because it explains _texture_ a
Type 3 reading cannot: the non-curation, the "I have no idea what's going on" reflex she's
been repeating since age 7, the father who mobilized the exit instead of Alix herself, the
"I love everyone" dissolution of the Cooper conflict on national TV. Type 9 → 3 integration
under structure explains the Unwell launch AND the DWTS run as the same psychological move.
The retype tightens the analytical spine of the whole Alix corpus — keep it.
