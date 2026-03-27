<!-- docs/brand/9takes-style-guide-for-assets.md -->

# 9takes Complete Style Guide for Image Asset Creation

_Use this document when creating Instagram carousels, social graphics, thumbnails, or any visual assets for 9takes._

---

## 1. Brand Identity at a Glance

| Element               | Value                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------- |
| **Brand Name**        | 9takes                                                                                       |
| **Primary Tagline**   | "See the emotions behind every take"                                                         |
| **Secondary Tagline** | "One situation, 9 ways to see it"                                                            |
| **Positioning**       | Decode social dynamics, personality-max your EQ, turn conflict into understanding            |
| **Core Concept**      | The Enneagram framework: 9 personality types, each with a distinct emotional lens            |
| **Aesthetic**         | "Solo Leveling" dark void with system UI feel - scholarly but modern, mystical but practical |

---

## 2. Color Palette

### Primary Brand Colors

| Name                      | Hex       | RGB           | Usage                                       |
| ------------------------- | --------- | ------------- | ------------------------------------------- |
| **Shadow Monarch Purple** | `#7c3aed` | 124, 58, 237  | Primary brand color, CTAs, headers, borders |
| **Purple Light**          | `#a78bfa` | 167, 139, 250 | Hover states, highlights, link text         |
| **Purple Dark**           | `#5b21b6` | 91, 33, 182   | Active states, depth, gradient endpoints    |
| **Purple Glow**           | `#8b5cf6` | 139, 92, 246  | Effects, gradients, accents                 |

### Secondary Colors

| Name               | Hex       | RGB          | Usage                               |
| ------------------ | --------- | ------------ | ----------------------------------- |
| **System Blue**    | `#3b82f6` | 59, 130, 246 | Links, info elements, navigation    |
| **Blue Light**     | `#60a5fa` | 96, 165, 250 | Hover states                        |
| **Awakening Cyan** | `#06b6d4` | 6, 182, 212  | Accent highlights, special elements |
| **Cyan Light**     | `#22d3ee` | 34, 211, 238 | Glows, emphasis                     |

### Background Colors (Dark Theme)

| Name               | Hex       | RGB        | Usage                              |
| ------------------ | --------- | ---------- | ---------------------------------- |
| **Void Abyss**     | `#0a0a0f` | 10, 10, 15 | Main background, slide backgrounds |
| **Void Deep**      | `#12121a` | 18, 18, 26 | Cards, containers, secondary bg    |
| **Void Surface**   | `#1a1a2e` | 26, 26, 46 | Elevated elements, card bodies     |
| **Void Elevated**  | `#252538` | 37, 37, 56 | Modals, dropdowns, accent panels   |
| **Void Highlight** | `#2d2d44` | 45, 45, 68 | Hover backgrounds, subtle dividers |

### Text Colors

| Name               | Hex       | RGB           | Usage                                   |
| ------------------ | --------- | ------------- | --------------------------------------- |
| **Text Primary**   | `#f8fafc` | 248, 250, 252 | Headlines, important text, slide titles |
| **Text Secondary** | `#e2e8f0` | 226, 232, 240 | Body text                               |
| **Text Tertiary**  | `#94a3b8` | 148, 163, 184 | Captions, metadata, small print         |
| **Text Muted**     | `#475569` | 71, 85, 105   | Disabled, placeholders                  |

### Enneagram Type Colors

These are CRITICAL for carousel slides about individual types:

| Type  | Name                     | Hex       | RGB                    |
| ----- | ------------------------ | --------- | ---------------------- |
| **1** | Perfectionist / Reformer | `#3b82f6` | 59, 130, 246 (Blue)    |
| **2** | Helper                   | `#ec4899` | 236, 72, 153 (Pink)    |
| **3** | Achiever                 | `#f59e0b` | 245, 158, 11 (Amber)   |
| **4** | Individualist            | `#8b5cf6` | 139, 92, 246 (Purple)  |
| **5** | Investigator             | `#06b6d4` | 6, 182, 212 (Cyan)     |
| **6** | Loyalist                 | `#22c55e` | 34, 197, 94 (Green)    |
| **7** | Enthusiast               | `#eab308` | 234, 179, 8 (Yellow)   |
| **8** | Challenger               | `#ef4444` | 239, 68, 68 (Red)      |
| **9** | Peacemaker               | `#10b981` | 16, 185, 129 (Emerald) |

### Functional / Accent Colors

| Name            | Hex       | Usage                              |
| --------------- | --------- | ---------------------------------- |
| **Gold Accent** | `#d4af37` | Premium, special, featured content |
| **Success**     | `#10b981` | Positive, confirmation             |
| **Warning**     | `#f59e0b` | Alerts, cautions                   |
| **Error**       | `#ef4444` | Errors, intense emphasis           |

---

## 3. Typography

### Primary Font: Noticia Text (Serif)

All text on the site uses **Noticia Text** - a serif that creates a scholarly, thoughtful feel.

- **Weights available**: Regular (400), Bold (700), Italic, Bold Italic
- **Canva alternatives**: **Lora** or **Playfair Display** (similar serifs)
- **Feel**: Authoritative, classic, intelligent - NOT trendy or casual

### Font Hierarchy

| Element             | Weight  | Desktop Size | Mobile Size |
| ------------------- | ------- | ------------ | ----------- |
| H1 (Slide Title)    | Bold    | 48px         | 32px        |
| H2 (Section Header) | Bold    | 36px         | 24px        |
| H3 (Subhead)        | Bold    | 24px         | 20px        |
| Body                | Regular | 18px         | 16px        |
| Caption / Small     | Regular | 14px         | 12px        |

### Secondary Font: Space Grotesk (Sans-Serif)

Used in CSS as the body font-family. Clean geometric sans-serif.

### Display Font: Rajdhani (Sans-Serif)

Used for display/UI elements. Has a tech/gaming quality.

---

## 4. Visual Effects & Design Patterns

### Gradients

**Primary Gradient (Purple)**:

```
135deg, #7c3aed 0%, #5b21b6 100%
```

**Card Background Gradient**:

```
180deg, #1a1a2e 0%, #12121a 100%
```

**Subtle Purple Tint** (for alternate rows, panels):

```
135deg, rgba(124, 58, 237, 0.06) 0%, transparent 100%
```

### Glow Effects

This is a SIGNATURE design element. Purple glows on dark backgrounds create the "Solo Leveling" aesthetic.

| Effect          | CSS Value                          | When to Use                   |
| --------------- | ---------------------------------- | ----------------------------- |
| **Small Glow**  | `0 0 10px rgba(124, 58, 237, 0.3)` | Subtle hover states           |
| **Medium Glow** | `0 0 20px rgba(124, 58, 237, 0.4)` | Active elements, borders      |
| **Large Glow**  | `0 0 40px rgba(124, 58, 237, 0.5)` | Hero elements, featured items |
| **Blue Glow**   | `0 0 20px rgba(59, 130, 246, 0.4)` | Secondary elements            |
| **Cyan Glow**   | `0 0 20px rgba(6, 182, 212, 0.4)`  | Accent highlights             |
| **Text Glow**   | `0 0 10px rgba(124, 58, 237, 0.5)` | Important text on dark bg     |

### Glass / Frosted Effect

- Background: `rgba(26, 26, 46, 0.8)` with `backdrop-filter: blur(20px)`
- Border: `1px solid rgba(124, 58, 237, 0.2)`
- Creates a floating, ethereal panel on dark backgrounds

### Borders

- Default border: `1px solid #252538` (void-elevated)
- Accent border: `1px solid rgba(124, 58, 237, 0.2)` (glass border)
- Active/hover border: purple glow border
- Border radius: `0.5rem` (8px) default, `0.75rem` (12px) for cards, `0.25rem` (4px) for small elements

### Shadows

All shadows are dark/black-based (NOT light/gray) because of the dark theme:

- Small: `0 1px 3px rgba(0, 0, 0, 0.3)`
- Medium: `0 4px 6px rgba(0, 0, 0, 0.4)`
- Large: `0 10px 15px rgba(0, 0, 0, 0.5)`

---

## 5. Component Design Patterns

### Cards

- Dark background (`#1a1a2e`)
- Subtle border (`rgba(100, 116, 139, 0.3)`)
- Border radius: 12px
- Shadow: `0 0 15px rgba(0, 0, 0, 0.3)`
- On hover: lift up 4-5px, purple glow border, glow shadow

### Buttons (Primary)

- Purple gradient background (`#7c3aed` to `#5b21b6`)
- White text
- Purple glow shadow
- On hover: lighter gradient, lift up 2px, stronger glow

### Buttons (Secondary/Outline)

- Transparent background
- Purple border (`#7c3aed`)
- Purple-light text (`#8b5cf6`)
- On hover: subtle purple fill, lift, glow

### Blockquotes / Pull Quotes

- Left border: 4px solid purple (`#7c3aed`)
- Background: void-surface (`#1a1a2e`)
- Italic text
- Border radius: 0 8px 8px 0

### Timeline Elements

- Vertical purple gradient line
- Purple dot markers on the line
- Key moments get a glowing dot

### Contrast Panels (Side-by-Side)

- Two-column grid
- Left: neutral dark background
- Right: subtle purple tint background
- Uppercase labels with colored bottom borders

---

## 6. Logo & Brand Marks

### Primary Logo

- **File**: `aero.webp` / `aero.png` - blue-tinted logo, used in header/footer
- Use on dark backgrounds

### Secondary Brand Mark

- **Dark Rubix**: `darkRubix.png` - dark cube icon, used on celebrity blog pages

### Logo Variants (available for different contexts)

| Name    | File          | Description         |
| ------- | ------------- | ------------------- |
| Aero    | `aero.png`    | Primary - blue tint |
| Aria    | `aria.png`    | Pink/rose variant   |
| Fresco  | `fresco.png`  | Warm variant        |
| Nimbus  | `nimbus.png`  | Cloud/light variant |
| Oceanic | `oceanic.png` | Teal variant        |
| Polar   | `polar.png`   | Cool/icy variant    |

### Enneagram Symbol

- `enneagram.svg` - the classic 9-pointed enneagram diagram

---

## 7. Brand Voice & Copy Style

### Voice Personality

A sharp 30-something who's done the inner work but isn't pretentious about it. The friend people gravitate to for advice because they actually listen, see patterns others miss, and give direct answers. Psychology background meets street smarts.

**Celebrity equivalent**: Jordan Peterson's psychological insight + Tim Ferriss's tactical approach + Joe Rogan's casual accessibility.

### 5 Voice Attributes

1. **Tactically Direct** - No fluff; actionable info that works
   - Example: "Type 6s signal loyalty through questions - answer them, don't get defensive."
2. **Socially Savvy** - Connect insight to real-world social wins
   - Example: "Read the room: Type 8s respect directness, Type 9s need gentle approach."
3. **Respectfully Provocative** - Challenge comfort zones without shaming
   - Example: "If your social circle always agrees with you, you're missing crucial intel."
4. **Pattern-Recognition Focused** - Show the emotional logic behind behavior
   - Example: "She's not 'being difficult' - Type 1s need things done right the first time."
5. **Results-Driven Coach** - Encouraging but focused on practical outcomes
   - Example: "Try this approach tonight and watch the dynamic shift."

### Writing Rhythm

```
Hook --> Insight --> Action step
```

Every piece of content follows this flow.

### Key Verbs (use these in copy)

Decode, Navigate, Map, Read, Unlock, Resolve

### Preferred Terms

| Use This                                    | Not This                               |
| ------------------------------------------- | -------------------------------------- |
| See the emotions behind every take          | (generic personality tagline)          |
| Give-first unlock / Reveal through response | Comment-first, bias-proof              |
| Personality-maxing                          | Self-improvement, personal development |
| Decode social dynamics                      | Improve relationships                  |
| Open source conflict resolution             | Crowdsourced advice                    |
| Emotional foundation mapping                | EQ tips, personality insights          |

### Do / Don't

| DO                               | DON'T                                     |
| -------------------------------- | ----------------------------------------- |
| Be direct and clear              | Use corporate jargon                      |
| Show patterns and logic          | Make vague claims                         |
| Challenge with respect           | Be preachy or judgmental                  |
| Provide actionable steps         | Give fluffy advice                        |
| Use conversational language      | Sound academic                            |
| Lead with practical benefit      | Lead with theory                          |
| Use em dashes for sharp insights | Use hedging language ("tend to", "might") |
| Write in 2nd person ("you")      | Write generically                         |
| Use numerals ("9 types")         | Spell out numbers                         |

### Social Media Copy Formula

1. **Hook line** (<120 chars, practical benefit or social insight)
2. **2-3 tactical points** (one per line, actionable)
3. **Small experiment CTA** (immediate micro-action)

**Example**:

> Your brain defaults to "they're being difficult" when you don't understand their type.
>
> - Type 1: Needs things done right
> - Type 6: Needs security/reassurance
> - Type 8: Needs directness
>   Small experiment: Next conversation, guess their type first

### Core Philosophies (use as slide copy)

- "Understanding beats judgment. Pattern recognition beats guesswork."
- "Give your take first - authentic perspective comes before influence."
- "The emotions behind someone's opinion matter more than the opinion itself."
- "Nine types of human nature, infinite applications."
- "Ancient wisdom, modern social advantage."

---

## 8. Carousel / Instagram Slide Design Rules

Based on the existing design system, here's how to construct slides:

### Slide Background

- Default: Solid `#0a0a0f` (Void Abyss)
- Alternative: Gradient from `#0a0a0f` to `#12121a`
- For type-specific slides: use the type's color as a subtle accent (10-15% opacity overlay or border glow)

### Slide Text

- Headlines: `#f8fafc` (white), Bold, large
- Body: `#e2e8f0` or `#94a3b8` depending on hierarchy
- Accent words: `#7c3aed` (purple) or the relevant type color
- Quotes: Italic, `#94a3b8`, with purple left border or top/bottom borders

### Slide Accents

- Purple glow borders on key elements
- Type-colored accent bars, dots, or borders for type-specific content
- Glass/frosted panels for text containers over images
- Subtle gradient overlays (purple to transparent)

### Slide Structure

- Keep text minimal - hook on first slide, one idea per subsequent slide
- Use the type number prominently when referencing a specific type
- Include the type color as a visual identifier
- End slides with a CTA or "small experiment"

### Template Color Combos for Canva

**Default slide**:

- Background: `#0a0a0f`
- Text: `#f8fafc`
- Accent: `#7c3aed`

**Type-specific slide**:

- Background: `#0a0a0f`
- Text: `#f8fafc`
- Accent: [that type's color from the table above]
- Border or glow in the type color

**CTA / final slide**:

- Background: gradient `#7c3aed` to `#5b21b6`
- Text: `#ffffff`
- Accent: `#06b6d4` (cyan) or `#d4af37` (gold)

---

## 9. Quick Copy-Paste Color Codes

```
#7c3aed  Purple (Primary)
#a78bfa  Purple Light
#5b21b6  Purple Dark
#8b5cf6  Purple Glow
#3b82f6  Blue (Secondary)
#06b6d4  Cyan (Accent)
#0a0a0f  Background (Void Abyss)
#12121a  Background (Void Deep)
#1a1a2e  Background (Void Surface)
#252538  Background (Void Elevated)
#f8fafc  Text Primary (White)
#e2e8f0  Text Secondary
#94a3b8  Text Tertiary
#d4af37  Gold Accent
#3b82f6  Type 1 (Blue)
#ec4899  Type 2 (Pink)
#f59e0b  Type 3 (Amber)
#8b5cf6  Type 4 (Purple)
#06b6d4  Type 5 (Cyan)
#22c55e  Type 6 (Green)
#eab308  Type 7 (Yellow)
#ef4444  Type 8 (Red)
#10b981  Type 9 (Emerald)
```
