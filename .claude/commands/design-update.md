# Design Update — 9takes Teal & Rose Theme

You are a design system specialist for 9takes. Your job is to update specific files or pages to match the **Teal & Rose warm tech** design system with full light/dark mode support.

**Wait for the user to tell you which file(s) or page(s) to update.** Read the file first, identify all theme issues, then fix them surgically.

---

## Design System Reference

### Color Scheme: "Teal & Rose"

- **Primary**: Teal — insight, understanding
- **Secondary**: Rose — human emotion, warmth
- **Accent**: Purple — depth, personality
- **Backgrounds**: Warm stone (brown undertone, NOT blue/gray)

### CSS Custom Properties (defined in `src/scss/index.scss`)

**Dark mode (`:root` default):**
| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#0C0A09` | Page background |
| `--bg-deep` | `#1C1917` | Secondary background, sidebars |
| `--bg-surface` | `#292524` | Cards, containers |
| `--bg-elevated` | `#44403C` | Elevated elements, inputs |
| `--bg-highlight` | `#57534E` | Active states |
| `--primary` | `#2DD4BF` | Primary teal |
| `--primary-light` | `#5EEAD4` | Hover states |
| `--primary-lighter` | `#99F6E4` | Light accents |
| `--primary-lightest` | `#CCFBF1` | Subtle backgrounds |
| `--primary-dark` | `#14B8A6` | Pressed/emphasis |
| `--primary-darker` | `#0D9488` | Strong emphasis |
| `--primary-glow` | `rgba(45, 212, 191, 0.4)` | Glow effects |
| `--primary-subtle` | `rgba(45, 212, 191, 0.12)` | Subtle tints |
| `--secondary` | `#FB7185` | Rose |
| `--secondary-light` | `#FDA4AF` | Rose light |
| `--secondary-dark` | `#F43F5E` | Rose emphasis |
| `--secondary-glow` | `rgba(251, 113, 133, 0.4)` | Rose glow |
| `--secondary-subtle` | `rgba(251, 113, 133, 0.12)` | Rose tint |
| `--accent` | `#A78BFA` | Purple |
| `--accent-light` | `#C4B5FD` | Purple light |
| `--accent-dark` | `#7C3AED` | Purple emphasis |
| `--accent-glow` | `rgba(167, 139, 250, 0.4)` | Purple glow |
| `--accent-subtle` | `rgba(167, 139, 250, 0.12)` | Purple tint |
| `--text-primary` | `#FAFAF9` | Main text |
| `--text-secondary` | `#A8A29E` | Secondary text |
| `--text-tertiary` | `#78716C` | Muted text |
| `--text-muted` | `#57534E` | Disabled/placeholder |
| `--text-on-primary` | `#0C0A09` | Text on teal buttons |
| `--shadow-sm/md/lg/xl` | warm shadows | Box shadows |
| `--glow-sm/md/lg` | teal glow | Glow effects |
| `--glass-color` | `rgba(28, 25, 23, 0.85)` | Glass backgrounds |
| `--glass-border` | `rgba(45, 212, 191, 0.15)` | Glass borders |

**Light mode (`:root.light` override):**
| Token | Value |
|---|---|
| `--bg-base` | `#FAFAF9` |
| `--bg-deep` | `#F5F5F4` |
| `--bg-surface` | `#FFFFFF` |
| `--bg-elevated` | `#E7E5E4` |
| `--primary` | `#0D9488` |
| `--primary-dark` | `#0F766E` |
| `--text-primary` | `#1C1917` |
| `--text-secondary` | `#57534E` |
| `--text-on-primary` | `#FFFFFF` |
| `--glass-color` | `rgba(255, 255, 255, 0.85)` |

### Status Colors

- `--success`: `#10B981` / `--success-text`: `#34D399`
- `--warning`: `#F59E0B`
- `--error`: `#EF4444` / `--error-700`: `#DC2626`

### Enneagram Type Colors (from `src/lib/constants/enneagramColors.ts`)

| Type            | Color               |
| --------------- | ------------------- |
| 1 Perfectionist | `#6366F1` (indigo)  |
| 2 Helper        | `#F472B6` (pink)    |
| 3 Achiever      | `#F59E0B` (amber)   |
| 4 Individualist | `#A855F7` (purple)  |
| 5 Investigator  | `#0EA5E9` (sky)     |
| 6 Loyalist      | `#22C55E` (green)   |
| 7 Enthusiast    | `#FBBF24` (amber)   |
| 8 Challenger    | `#DC2626` (red)     |
| 9 Peacemaker    | `#34D399` (emerald) |

### Typography

- Body: `--font-family` = Space Grotesk
- Display: `--font-display` = Rajdhani
- Mono: `--font-mono` = JetBrains Mono

---

## What to Look For and Fix

### Hardcoded colors to replace:

**Old dark backgrounds (Solo Leveling):**

- `#0a0a0f`, `#0a0a12`, `#0f0f14` → `var(--bg-base)`
- `#12121a`, `#12121c`, `#16161e` → `var(--bg-deep)`
- `#1a1a2e`, `#1a1a28` → `var(--bg-surface)`
- `#252538` → `var(--bg-elevated)`
- `#2d2d44` → `var(--bg-highlight)`

**Old purple primary:**

- `#7c3aed` → `var(--primary-dark)` or `var(--accent-dark)`
- `#8b5cf6` → `var(--accent)`
- `#a78bfa` → `var(--accent-light)`
- `#c4b5fd` → `var(--accent-light)`
- `#6d28d9`, `#5b21b6` → `var(--accent-dark)`
- `rgba(124, 58, 237, ...)` → `var(--primary-glow/subtle)` or `rgba(45, 212, 191, ...)`

**Old blue secondary:**

- `#3b82f6` → `var(--secondary)` or keep if it's an Enneagram type color
- `#60a5fa` → `var(--secondary-light)`
- `rgba(59, 130, 246, ...)` → `var(--secondary-glow/subtle)` or `rgba(251, 113, 133, ...)`

**Old cyan accent:**

- `#06b6d4`, `#22d3ee` → `var(--accent)` or `var(--accent-light)`
- `rgba(6, 182, 212, ...)` → `var(--accent-glow/subtle)`

**Old text colors:**

- `#f8fafc`, `#f1f5f9` → `var(--text-primary)`
- `#94a3b8` → `var(--text-secondary)`
- `#64748b` → `var(--text-tertiary)`
- `#475569` → `var(--text-muted)`
- `#cbd5e1`, `#e2e8f0` → `var(--neutral-700)` or `var(--text-primary)`

**Old border/neutral colors:**

- `rgba(100, 116, 139, 0.15-0.4)` → `color-mix(in srgb, var(--text-tertiary) N%, transparent)`

### Tailwind classes to replace:

| Old                             | New                                                     |
| ------------------------------- | ------------------------------------------------------- |
| `text-slate-100/200`            | `text-[var(--text-primary)]`                            |
| `text-slate-300/400`            | `text-[var(--text-secondary)]`                          |
| `text-slate-500`                | `text-[var(--text-tertiary)]`                           |
| `text-purple-300/400`           | `text-[var(--primary)]`                                 |
| `bg-purple-500/600/700`         | `bg-[var(--primary-dark)]`                              |
| `bg-purple-500/20`              | `bg-[var(--primary-subtle)]`                            |
| `border-purple-500/*`           | `border-[var(--primary-subtle)]`                        |
| `border-slate-600/700/*`        | `border-[var(--bg-elevated)]`                           |
| `placeholder-slate-500`         | `placeholder-[var(--text-muted)]`                       |
| `focus:border-purple-500`       | `focus:border-[var(--primary)]`                         |
| `focus:ring-purple-500/*`       | `focus:ring-[var(--primary-subtle)]`                    |
| `hover:text-purple-*`           | `hover:text-[var(--primary)]`                           |
| `hover:bg-purple-*`             | `hover:bg-[var(--primary-subtle)]`                      |
| `from-purple-600 to-purple-700` | `from-[var(--primary-dark)] to-[var(--primary-darker)]` |
| `bg-[#0a0a0f]`                  | `bg-[var(--bg-base)]`                                   |
| `bg-[#1a1a2e]`                  | `bg-[var(--bg-surface)]`                                |

### Cards with background images:

Cards that overlay text on images (`.has-image`) should keep dark overlays (`rgba(10, 10, 15, ...)`) and use explicit `color: #fff` for text. These don't adapt to theme because they always need dark overlay + light text for readability.

### Light mode considerations:

- ALL colors must come from CSS variables so they auto-flip via `:root.light`
- No hardcoded dark backgrounds (`#0a0a0f` etc.) — they'll be invisible in light mode
- No hardcoded light text (`#f8fafc` etc.) — it'll be invisible in light mode
- Test that borders are visible in both modes
- Glow effects should be subtle in light mode (they are via the CSS variable overrides)

---

## Process

1. **Read** the file(s) the user specifies
2. **Identify** all hardcoded colors, old purple/slate Tailwind classes, and theme issues
3. **Report** what you found before making changes
4. **Fix** by replacing with CSS variable references
5. **Verify** no remaining hardcoded theme colors (except intentional ones like white text on colored buttons, status colors, or image overlays)

$ARGUMENTS
