# Warm Tech Spec Theme Plan

## Current State

- **Dark-only** theme with cold "Solo Leveling" aesthetic
- Blue-tinted void blacks (`#0a0a0f`, `#12121a`, `#1a1a2e`)
- Purple primary (`#7c3aed` "shadow monarch")
- Cyan/blue accents (`#06b6d4`, `#3b82f6`)
- No light mode — no toggle exists
- All colors flow through CSS custom properties in `src/scss/index.scss`

---

## Design Direction: "Warm Tech Spec"

**Concept**: A psychologist's leather-bound office meets a modern data dashboard. Analytical and precise, but the colors say "we understand people" instead of "we're in a dungeon."

**60-30-10 Rule**:
- 60% Warm neutrals (backgrounds, surfaces, text)
- 30% Primary brand color (amber/gold)
- 10% Accent colors (terracotta, warm rose)

### Why These Colors for 9takes

- **Amber/Gold** = insight, illumination, understanding — "shining a light" on personality patterns
- **Rose/Terracotta** = human warmth, emotion — fits personality analysis
- **Stone neutrals** = sophisticated, grounded — analytical without being clinical

### Inspiration References

- **Notion** — warm off-white light mode, editorial feel
- **Headspace** — warm orange primary for psychology/wellness
- **Linear** — surface elevation hierarchy (dark mode)
- **Stripe** — warm gradient accents on clean backgrounds

---

## Color Palette

### The Shift

| Element | Cold (Now) | Warm (Proposed) |
|---|---|---|
| Backgrounds | Blue-tinted void blacks | Warm stone/charcoal (brown undertone) |
| Primary | Purple `#7c3aed` | Amber/Gold `#F59E0B` |
| Secondary | Cold blue `#3b82f6` | Warm rose `#F43F5E` |
| Accent | Cyan `#06b6d4` | Terracotta `#EA580C` |
| Glows | Purple neon | Amber warm glow |
| Neutrals | Blue-gray scale | Stone/warm-gray scale |

---

### Dark Mode

#### Backgrounds (Warm Charcoal — Tailwind stone scale, brown undertone)

| Token | Hex | Usage |
|---|---|---|
| `--bg-deepest` | `#0C0A09` | Page background, deepest layer |
| `--bg-deep` | `#1C1917` | Secondary background, sidebars |
| `--bg-surface` | `#292524` | Cards, content containers |
| `--bg-elevated` | `#44403C` | Elevated elements, hover states |
| `--bg-highlight` | `#57534E` | Active states, selections |

#### Primary (Amber/Gold — "illumination")

| Token | Hex | Usage |
|---|---|---|
| `--primary-lightest` | `#FEF3C7` | Subtle backgrounds, badges |
| `--primary-lighter` | `#FDE68A` | Light accents, highlights |
| `--primary-light` | `#FBBF24` | Hover states, secondary buttons |
| `--primary` | `#F59E0B` | Primary buttons, key actions |
| `--primary-dark` | `#D97706` | Pressed states, emphasis |
| `--primary-darker` | `#B45309` | Strong emphasis |
| `--primary-darkest` | `#92400E` | Dark accents |
| `--primary-glow` | `rgba(245, 158, 11, 0.4)` | Glow effects |
| `--primary-subtle` | `rgba(245, 158, 11, 0.12)` | Subtle tints on dark |

#### Secondary (Warm Rose — "human emotion")

| Token | Hex | Usage |
|---|---|---|
| `--secondary-light` | `#FDA4AF` | Light secondary accents |
| `--secondary` | `#F43F5E` | Secondary actions, emotion indicators |
| `--secondary-dark` | `#E11D48` | Secondary emphasis |
| `--secondary-subtle` | `rgba(244, 63, 94, 0.12)` | Subtle tints |

#### Accent (Terracotta — "earthy warmth")

| Token | Hex | Usage |
|---|---|---|
| `--accent-light` | `#FDBA74` | Light accent |
| `--accent` | `#EA580C` | Accent elements, callouts |
| `--accent-dark` | `#C2410C` | Strong accent |
| `--accent-subtle` | `rgba(234, 88, 12, 0.12)` | Subtle tints |

#### Text (Dark Mode)

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#FAFAF9` | Primary text (warm white) |
| `--text-secondary` | `#A8A29E` | Secondary text |
| `--text-tertiary` | `#78716C` | Muted text |
| `--text-muted` | `#57534E` | Disabled/placeholder |
| `--text-on-primary` | `#0C0A09` | Text on amber buttons |

#### Borders & Shadows (Dark Mode)

| Token | Value |
|---|---|
| `--border-color` | `#44403C` |
| `--border-subtle` | `#292524` |
| `--shadow-sm` | `0 1px 3px rgba(12, 10, 9, 0.3)` |
| `--shadow-md` | `0 4px 6px rgba(12, 10, 9, 0.4)` |
| `--shadow-lg` | `0 10px 15px rgba(12, 10, 9, 0.5)` |
| `--glow-sm` | `0 0 10px rgba(245, 158, 11, 0.3)` |
| `--glow-md` | `0 0 20px rgba(245, 158, 11, 0.4)` |
| `--glow-lg` | `0 0 40px rgba(245, 158, 11, 0.5)` |

#### Glass Effects (Dark Mode)

| Token | Value |
|---|---|
| `--glass-color` | `rgba(28, 25, 23, 0.85)` |
| `--glass-border` | `rgba(245, 158, 11, 0.15)` |

---

### Light Mode

#### Backgrounds (Warm Cream/Parchment)

| Token | Hex | Usage |
|---|---|---|
| `--bg-deepest` | `#FAFAF9` | Page background (warm off-white) |
| `--bg-deep` | `#F5F5F4` | Secondary background |
| `--bg-surface` | `#FFFFFF` | Cards, content containers |
| `--bg-elevated` | `#F5F5F4` | Elevated elements |
| `--bg-highlight` | `#FEF3C7` | Highlights, selected (golden) |

#### Primary (Light Mode — darker amber for contrast on white)

| Token | Hex | Usage |
|---|---|---|
| `--primary` | `#D97706` | Primary buttons |
| `--primary-dark` | `#B45309` | Hover/emphasis |
| `--primary-light` | `#F59E0B` | Lighter accents |
| `--primary-subtle` | `rgba(217, 119, 6, 0.08)` | Subtle tints |

#### Text (Light Mode)

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#1C1917` | Primary text (warm near-black) |
| `--text-secondary` | `#57534E` | Secondary text |
| `--text-tertiary` | `#78716C` | Muted text |
| `--text-on-primary` | `#FFFFFF` | Text on amber buttons |

#### Borders (Light Mode)

| Token | Hex |
|---|---|
| `--border-color` | `#E7E5E4` |
| `--border-subtle` | `#F5F5F4` |

---

### Functional/Status Colors (Both Modes)

| Token | Hex | Usage |
|---|---|---|
| `--success` | `#22C55E` | Success states |
| `--warning` | `#EAB308` | Warnings |
| `--error` | `#EF4444` | Errors |
| `--info` | `#F59E0B` | Info (amber, not blue) |

---

### Enneagram Type Colors (Minor Warm Shift)

| Type | Current | Proposed | Note |
|---|---|---|---|
| 1 Perfectionist | `#3b82f6` blue | `#6366F1` indigo | Warmer indigo |
| 2 Helper | `#ec4899` pink | `#F472B6` pink-400 | Softer, warmer |
| 3 Achiever | `#f59e0b` amber | `#F59E0B` amber | Keep as-is |
| 4 Individualist | `#8b5cf6` purple | `#A855F7` purple-500 | Warmer purple |
| 5 Investigator | `#06b6d4` cyan | `#0EA5E9` sky-500 | Warmer sky blue |
| 6 Loyalist | `#22c55e` green | `#22C55E` green | Keep as-is |
| 7 Enthusiast | `#eab308` yellow | `#FBBF24` amber-400 | Brighter, more golden |
| 8 Challenger | `#ef4444` red | `#DC2626` red-600 | Deeper, more commanding |
| 9 Peacemaker | `#10b981` emerald | `#34D399` emerald-400 | Lighter, softer |

---

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `--brand-gold` | `#D4AF37` | Premium brand gold |
| `--brand-amber` | `#F59E0B` | Primary brand |
| `--brand-terracotta` | `#C2410C` | Secondary brand accent |
| `--brand-warm-rose` | `#F43F5E` | Emotion/personality accent |

---

## Implementation Plan

### Phase 1: Warm Dark Mode (Rename + Revalue)

1. Rename CSS variables in `src/scss/index.scss` from `--void-*` / `--shadow-monarch-*` to semantic names (`--bg-*`, `--primary-*`)
2. Set warm dark mode values (stone backgrounds, amber primary)
3. Update glow mixins in `src/scss/_mixins.scss` (purple → amber)
4. Update `src/scss/components.scss` gradients and glow colors

### Phase 2: Light Mode + Toggle

1. Add `:root` (light default) and `.dark` class variable sets in `index.scss`
2. Create `ThemeToggle.svelte` component
3. Add localStorage persistence for theme preference
4. Respect `prefers-color-scheme` media query as default
5. Update `src/app.html` — remove hardcoded `color-scheme: dark`
6. Update `src/routes/+layout.svelte` — remove hardcoded `bg-[#0a0a0f]`, use CSS variables

### Phase 3: Component Cleanup

1. Find and replace hardcoded color values in components (e.g., `bg-[#1a1a2e]`, `text-[#f8fafc]`)
2. Replace with CSS variable references or Tailwind theme classes
3. Update Tailwind config (`tailwind.config.ts`) — swap color scales to warm stone/amber
4. Test all Enneagram type color rendering in both modes

---

## Files to Modify

| File | Changes |
|---|---|
| `src/scss/index.scss` | Core variable rename + revalue, add light/dark sets |
| `src/scss/_mixins.scss` | Glow mixins purple → amber |
| `src/scss/components.scss` | Gradient and glow color updates |
| `tailwind.config.ts` | Color scale swap to stone/amber |
| `src/app.html` | Remove hardcoded dark meta tags |
| `src/routes/+layout.svelte` | Remove hardcoded colors, add theme toggle |
| `src/lib/components/atoms/` | New `ThemeToggle.svelte` component |
| Various components | Replace hardcoded hex values with variables |
