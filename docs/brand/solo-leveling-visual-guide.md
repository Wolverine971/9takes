<!-- docs/brand/solo-leveling-visual-guide.md -->

# 9takes — Solo Leveling Visual Style Guide

_Updated: January 2026_

> **Visual Identity Concept**: The Shadow Monarch's journey from E-rank hunter to ultimate power mirrors our users' journey from social confusion to emotional mastery. Dark, powerful, transformative.

---

## 1. Color Palette

### Primary Colors

| Name              | Hex       | RGB          | Usage                                         |
| ----------------- | --------- | ------------ | --------------------------------------------- |
| **Void Black**    | `#0A0A0F` | 10, 10, 15   | Primary background, dominant color            |
| **Shadow Purple** | `#7B2CBF` | 123, 44, 191 | Primary accent, CTAs, highlights              |
| **Monarch Blue**  | `#1B45D7` | 27, 69, 215  | Secondary accent, links, interactive elements |
| **Abyss Navy**    | `#0A1543` | 10, 21, 67   | Cards, containers, secondary backgrounds      |

### Secondary Colors

| Name                 | Hex       | RGB          | Usage                                          |
| -------------------- | --------- | ------------ | ---------------------------------------------- |
| **System Cyan**      | `#00D4FF` | 0, 212, 255  | Notifications, system messages, success states |
| **Awakening Violet** | `#9D4EDD` | 157, 78, 221 | Hover states, gradients, emphasis              |
| **Crimson Alert**    | `#E63946` | 230, 57, 70  | Errors, warnings, urgent actions               |
| **Hunter Gold**      | `#FFD700` | 255, 215, 0  | Achievements, premium features, highlights     |

### Neutrals

| Name            | Hex       | RGB           | Usage                              |
| --------------- | --------- | ------------- | ---------------------------------- |
| **Ash Gray**    | `#2D2D3A` | 45, 45, 58    | Borders, dividers, subtle elements |
| **Stone Gray**  | `#4A4A5A` | 74, 74, 90    | Secondary text, disabled states    |
| **Mist Gray**   | `#9CA3AF` | 156, 163, 175 | Placeholder text, hints            |
| **Ghost White** | `#E5E7EB` | 229, 231, 235 | Primary text on dark backgrounds   |
| **Pure White**  | `#FFFFFF` | 255, 255, 255 | Headlines, emphasis text           |

### Gradient Systems

```css
/* Primary Shadow Gradient - for hero sections, major CTAs */
background: linear-gradient(135deg, #7b2cbf 0%, #1b45d7 50%, #0a1543 100%);

/* Awakening Glow - for hover states, active elements */
background: linear-gradient(180deg, #9d4edd 0%, #7b2cbf 100%);

/* Abyss Fade - for card backgrounds, containers */
background: linear-gradient(180deg, #0a1543 0%, #0a0a0f 100%);

/* System Interface - for notification panels, tooltips */
background: linear-gradient(135deg, rgba(27, 69, 215, 0.15) 0%, rgba(123, 44, 191, 0.15) 100%);
border: 1px solid rgba(0, 212, 255, 0.3);
```

---

## 2. Thematic Connections

### Solo Leveling → 9takes Parallels

| Solo Leveling                      | 9takes Application                      | Visual Expression                            |
| ---------------------------------- | --------------------------------------- | -------------------------------------------- |
| **E-rank to Shadow Monarch**       | Social confusion → EQ mastery           | Dark-to-light gradients, leveling animations |
| **System Interface notifications** | Give-first unlock reveals               | Blue glowing panels, notification aesthetics |
| **Shadow extraction**              | Understanding personality patterns      | Purple aura effects around content           |
| **Hunter rankings (E→S)**          | User progression, expertise levels      | Rank badges with color progression           |
| **Glowing purple eyes**            | Moment of insight, "seeing" the pattern | Purple highlight on key reveals              |
| **Dark aesthetic with power**      | Confidence without arrogance            | Dark UI with strategic bright accents        |

### The 9 Types as Shadow Soldiers

Each Enneagram type could have a shadow soldier-inspired visual identity:

| Type   | Shadow Archetype             | Signature Color Accent    |
| ------ | ---------------------------- | ------------------------- |
| Type 1 | **The Perfectionist Knight** | Ice Blue `#A8DADC`        |
| Type 2 | **The Heart Sentinel**       | Warm Coral `#FF6B6B`      |
| Type 3 | **The Achiever Blade**       | Hunter Gold `#FFD700`     |
| Type 4 | **The Soul Weaver**          | Deep Violet `#9D4EDD`     |
| Type 5 | **The Mind Wraith**          | System Cyan `#00D4FF`     |
| Type 6 | **The Loyal Guard**          | Steel Blue `#4A90A4`      |
| Type 7 | **The Storm Rider**          | Electric Orange `#FF8C42` |
| Type 8 | **The Commander**            | Blood Crimson `#E63946`   |
| Type 9 | **The Peacekeeper**          | Sage Green `#6B9080`      |

---

## 3. UI Component Styling

### System Interface Aesthetic

Inspired by Sung Jin-woo's system UI, create a distinctive "notification panel" style:

```css
/* System Panel - for reveals, notifications, important info */
.system-panel {
	background: rgba(10, 21, 67, 0.95);
	border: 1px solid rgba(0, 212, 255, 0.4);
	border-radius: 4px;
	box-shadow:
		0 0 20px rgba(123, 44, 191, 0.3),
		inset 0 0 60px rgba(27, 69, 215, 0.1);
	backdrop-filter: blur(10px);
}

/* System Header - "NOTIFICATION" style headers */
.system-header {
	font-family: 'Inter', sans-serif;
	font-weight: 700;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	color: #00d4ff;
	text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

/* Glow Text - for important reveals */
.glow-text {
	color: #ffffff;
	text-shadow:
		0 0 5px rgba(157, 78, 221, 0.8),
		0 0 10px rgba(123, 44, 191, 0.6),
		0 0 20px rgba(123, 44, 191, 0.4);
}
```

### Button Styles

```css
/* Primary CTA - Shadow Monarch power */
.btn-primary {
	background: linear-gradient(135deg, #7b2cbf 0%, #1b45d7 100%);
	color: #ffffff;
	border: none;
	box-shadow: 0 4px 15px rgba(123, 44, 191, 0.4);
	transition: all 0.3s ease;
}

.btn-primary:hover {
	box-shadow:
		0 6px 25px rgba(123, 44, 191, 0.6),
		0 0 30px rgba(157, 78, 221, 0.3);
	transform: translateY(-2px);
}

/* Secondary - System interface style */
.btn-secondary {
	background: transparent;
	color: #00d4ff;
	border: 1px solid rgba(0, 212, 255, 0.5);
	transition: all 0.3s ease;
}

.btn-secondary:hover {
	background: rgba(0, 212, 255, 0.1);
	border-color: #00d4ff;
	box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}
```

### Card Components

```css
/* Content Card - like quest panels */
.card {
	background: linear-gradient(180deg, #0a1543 0%, #0a0a0f 100%);
	border: 1px solid rgba(45, 45, 58, 0.8);
	border-radius: 8px;
	transition: all 0.3s ease;
}

.card:hover {
	border-color: rgba(123, 44, 191, 0.5);
	box-shadow: 0 0 30px rgba(123, 44, 191, 0.2);
}

/* Featured/Highlighted Card */
.card-featured {
	border: 1px solid rgba(123, 44, 191, 0.6);
	box-shadow:
		0 0 20px rgba(123, 44, 191, 0.15),
		inset 0 0 40px rgba(27, 69, 215, 0.05);
}
```

---

## 4. Typography

### Font Stack

```css
/* Headlines - Sharp, powerful */
font-family:
	'Inter',
	'SF Pro Display',
	-apple-system,
	sans-serif;

/* Body - Clean, readable */
font-family:
	'Inter',
	'SF Pro Text',
	-apple-system,
	sans-serif;

/* System/UI - Monospace accents for "system" elements */
font-family: 'JetBrains Mono', 'SF Mono', monospace;
```

### Type Scale

| Element         | Size    | Weight | Style                                        |
| --------------- | ------- | ------ | -------------------------------------------- |
| H1 (Hero)       | 48-64px | 800    | Uppercase optional, letter-spacing: -0.02em  |
| H2 (Section)    | 32-40px | 700    | Normal case                                  |
| H3 (Card title) | 24px    | 600    | Normal case                                  |
| Body            | 16px    | 400    | 1.6 line-height                              |
| Caption         | 14px    | 500    | Uppercase for labels, letter-spacing: 0.05em |
| System text     | 12-14px | 500    | Monospace, uppercase, letter-spacing: 0.1em  |

---

## 5. Iconography & Visual Elements

### Design Principles

1. **Sharp edges over rounded** - Mirrors the manhwa's precise linework
2. **Glow effects** - Subtle outer glow on active/important elements
3. **Depth through shadow** - Multiple shadow layers create dimension
4. **Minimal but powerful** - Clean interfaces with strategic visual impact

### Suggested Icon Themes

- **Geometric shapes** - Hexagons, sharp triangles, crystalline forms
- **Shadow motifs** - Silhouettes, ghost effects, smoke wisps
- **Power symbols** - Crowns, swords, shields for ranking
- **Eye iconography** - Representing "seeing" patterns and insights
- **Leveling indicators** - Progress bars, rank badges, XP-style elements

### Animation Guidelines

```css
/* Subtle glow pulse - for active elements */
@keyframes glow-pulse {
	0%,
	100% {
		box-shadow: 0 0 20px rgba(123, 44, 191, 0.3);
	}
	50% {
		box-shadow: 0 0 30px rgba(123, 44, 191, 0.5);
	}
}

/* Shadow emergence - for reveals */
@keyframes shadow-emerge {
	from {
		opacity: 0;
		transform: translateY(10px);
		filter: blur(4px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
		filter: blur(0);
	}
}

/* System notification slide */
@keyframes system-slide {
	from {
		transform: translateX(-100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}
```

---

## 6. Application Examples

### Homepage Hero

```
Background: Void Black (#0A0A0F)
Accent gradient behind headline: Shadow Gradient
Headline: Pure White with subtle purple glow
Subhead: Ghost White (#E5E7EB)
CTA Button: Primary gradient with glow
```

### Question Cards

```
Background: Abyss Navy (#0A1543) gradient to Void Black
Border: Ash Gray (#2D2D3A)
Title: Ghost White
Meta text: Stone Gray
Type badge: Respective type color
Hover: Purple border glow
```

### Give-First Unlock Reveal

```
Panel: System Interface gradient with cyan border
Header: "REVEAL UNLOCKED" in System Cyan, monospace
Content: Fades in with shadow-emerge animation
Glow effect: Purple aura around newly visible content
```

### Profile/Ranking Display

```
Rank badge: Color based on level (Bronze→Silver→Gold→Purple→Cyan)
Username: Ghost White
Stats: System Cyan accents
Progress bar: Purple gradient fill on dark track
```

---

## 7. Do's and Don'ts

### Do

- Use dark backgrounds as the dominant visual
- Apply glow effects strategically for emphasis
- Create depth with layered shadows
- Use purple/blue accents to draw attention
- Implement subtle animations for system-like feel
- Keep interfaces clean with strategic impact points

### Don't

- Overuse glow effects (looks cheap)
- Make text hard to read against dark backgrounds
- Use more than 2-3 accent colors simultaneously
- Forget accessibility (contrast ratios still matter)
- Make everything glow (defeats the purpose)
- Ignore the power of negative space

---

## 8. Accessibility Notes

While embracing dark aesthetics, maintain readability:

| Element               | Minimum Contrast Ratio                       |
| --------------------- | -------------------------------------------- |
| Body text on dark bg  | 4.5:1 (Ghost White on Void Black = 15.7:1 ✓) |
| Large headlines       | 3:1                                          |
| Interactive elements  | 3:1 for focus indicators                     |
| Accent colors on dark | Test each combination                        |

Purple on dark can be tricky - always test `#9D4EDD` on `#0A0A0F` for sufficient contrast.

---

## 9. Integration with Brand Voice

The Solo Leveling visual identity reinforces 9takes brand attributes:

| Brand Attribute                 | Visual Expression                                             |
| ------------------------------- | ------------------------------------------------------------- |
| **Tactically Direct**           | Clean layouts, sharp edges, no visual fluff                   |
| **Pattern-Recognition Focused** | System interface reveals, highlighted insights                |
| **Respectfully Provocative**    | Dark powerful aesthetic challenges boring psychology sites    |
| **Results-Driven**              | Level-up imagery, progress indicators, achievement badges     |
| **Personality-Maxing**          | Shadow soldier archetypes for each type, growth visualization |

---

## 10. Resources & References

### Solo Leveling Visual Research

- [Adobe Color - Solo Leveling Theme](https://color.adobe.com/-leveling-color-theme-19902787/)
- [Anime Colors - Sung Jin-woo Shadow Monarch](https://www.anime-colors.com/solo-leveling-series/sung-jin-woo-shadow-monarch)
- [Solo Leveling Wiki - Visual References](https://solo-leveling.fandom.com/wiki/Sung_Jinwoo)
- [Behance - Solo Leveling UI Projects](https://www.behance.net/search/projects/solo%20leveling%20ui)
- [Dribbble - Solo Leveling Designs](https://dribbble.com/tags/solo-leveling)
- [Figma - Solo Leveling Game Interface](https://www.figma.com/community/file/1459229789167769742/solo-leveling)

### Key Visual Inspiration Points

1. **System notification panels** - Blue glowing windows with sharp edges
2. **Shadow Monarch transformation** - Purple aura, glowing eyes
3. **Ashborn's aesthetic** - Purple flame hair, armor scales
4. **Hunter ranking system** - Color-coded progression
5. **Manhwa art style** - Clean linework, dramatic lighting contrasts

---

**Core Visual Philosophy**

_"Power emerges from shadow. Understanding grows from darkness into light."_

_"Your journey from E-rank social awareness to S-rank emotional intelligence starts here."_

_"See what others miss. Master the shadows of human nature."_
