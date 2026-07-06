<!-- docs/css-drift-deferred-decisions-2026-04-08.md -->

# CSS Drift Deferred Decisions

**Date:** 2026-04-08  
**Status:** Saved for follow-up after the first implementation pass.

This note captures the design and structural decisions that were intentionally deferred while fixing semantic mistakes, unifying the current image-card system, and removing shadowed button APIs.

---

## 1. Homepage Gold Accent

### Decision

Should the homepage coaching card keep a warm gold accent, or should it be folded back into the core teal / rose / accent palette?

### Recommendation

Keep it **only if** it becomes a first-class token.

### Why

- A restrained gold can make coaching or premium offers feel warmer and more intentional.
- Right now it reads like a leftover, because Tailwind has `brand.gold` but the SCSS token layer does not.
- If you keep it, add a CSS custom property and define where gold is allowed. If you do not, retheme the coaching block to rose/purple and remove the ambiguity.

---

## 2. Light-Mode Overlay Strategy

### Decision

Should image cards keep dark cinematic overlays in light mode, or should light mode get its own lighter overlay treatment?

### Recommendation

Design a **separate light-mode overlay recipe** later rather than reusing the same dark treatment forever.

### Why

- Dark overlays preserve drama and readability, but they make light mode feel pasted-on.
- A dedicated light treatment will make light mode feel designed instead of token-swapped.
- This needs visual QA and should be handled as a deliberate design pass, not as a cleanup side effect.

---

## 3. How Much Type Color To Use

### Decision

How aggressively should the Enneagram type-color palette show up on type-driven pages?

### Recommendation

Use type colors **sparingly** at first:

- badges
- pills
- dividers
- small section markers

Avoid full rainbow cards unless there is a strong information-design reason.

### Why

- The existing core palette is calmer and more editorial.
- Using all nine colors too broadly risks visual noise.
- Small accents still improve information scent without overwhelming the brand.

---

## 4. Structural Consolidation Plan

### Decision

How far should the content-hub consolidation go?

### Recommendation

Consolidate **`pop-culture` + `how-to-guides` + `community` first**, then evaluate `personality-analysis` separately.

### Why

- Those three pages are the clearest duplication cluster in both layout and styling.
- `personality-analysis` is close enough to share ideas, but different enough that forcing it into the same structure too early could flatten the page or create awkward abstractions.
- The safer order is:
  1. extract a shared category-hub base for the three closer siblings
  2. then decide whether `personality-analysis` becomes a sibling variant or remains separate

### Note To Revisit

> Structurally, consolidate `pop-culture`, `how-to-guides`, and `community`, then decide separately what to do with `personality-analysis`.

---

## 5. Bespoke vs Systemized Brand Moments

### Decision

How bespoke should the homepage, about page, and coaching/promotional surfaces remain after cleanup?

### Recommendation

Keep them **curated but system-backed**.

### Why

- Those pages are where brand tone matters most.
- They should feel more authored than utilitarian hubs.
- The distinction should come from composition, copy pacing, and a small set of sanctioned variants, not from every page inventing new glow, card, or button behavior.

---

## 6. Future Follow-Up Order

### Recommended sequence

1. Finalize the gold-accent decision.
2. Design and QA the light-mode image overlay treatment.
3. Decide the first-pass type-color intensity rules.
4. Extract the shared category-hub base for `pop-culture`, `how-to-guides`, and `community`.
5. Reassess `personality-analysis` after the shared hub base exists.
