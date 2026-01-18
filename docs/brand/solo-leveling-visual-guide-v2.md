# Solo Leveling Inspired Visual Brand

> **Purpose:** A visual brand system inspired by the aesthetic of Solo Leveling (나 혼자만 레벨업). For use on a separate project.
>
> **Created:** 2026-01-17

---

## Source Aesthetic

**Solo Leveling** is a Korean manhwa/anime with a distinctive visual language:

- **Shadow Monarch** — Sung Jin-Woo commands an army of shadows
- **The System** — Blue holographic UI windows, game-like interfaces
- **Dungeons & Portals** — Glowing gates, otherworldly spaces
- **Power emergence** — Dark to overwhelming strength
- **Leveling up** — Constant progression, breaking limits

---

## Brand Essence

This aesthetic works for brands about:

- Power and progression
- Gaming / tech / leveling systems
- Emergence from obscurity
- Dark elegance with energy
- Breaking through limitations

**Core Tension:** Darkness AND Power

- Deep shadows that contain immense energy
- Quiet until unleashed
- The system underneath the surface

---

## Color Palette

### Primary Colors (The Void)

| Role                      | Name     | Hex       | Usage                        |
| ------------------------- | -------- | --------- | ---------------------------- |
| **Background (deep)**     | Abyss    | `#05050a` | Primary background, the void |
| **Background (elevated)** | Shadow   | `#0a0a12` | Cards, elevated surfaces     |
| **Surface**               | Umbra    | `#12121c` | Secondary surfaces           |
| **Surface (light)**       | Penumbra | `#1a1a28` | Lighter surfaces, modals     |

### Text Colors

| Role               | Name  | Hex        | Usage                    |
| ------------------ | ----- | ---------- | ------------------------ |
| **Primary text**   | Pale  | `#e8e8f0`  | Main text, high contrast |
| **Secondary text** | Mist  | `#9898a8`  | Muted text, descriptions |
| **Tertiary text**  | Faded | `#5858688` | Placeholders, disabled   |

### Accent Colors (The Power)

**Purple/Violet — Shadow Energy**

| Role                 | Name           | Hex       | Usage                        |
| -------------------- | -------------- | --------- | ---------------------------- |
| **Shadow (primary)** | Monarch Purple | `#7c3aed` | Primary accent, shadow power |
| **Shadow (bright)**  | Violet Flame   | `#a855f7` | Hover states, highlights     |
| **Shadow (deep)**    | Abyssal Violet | `#5b21b6` | Deep accents, gradients      |
| **Shadow (glow)**    | Ethereal       | `#c084fc` | Glows, energy effects        |

**Blue — The System**

| Role                 | Name           | Hex       | Usage                     |
| -------------------- | -------------- | --------- | ------------------------- |
| **System (primary)** | Interface Blue | `#3b82f6` | System UI, notifications  |
| **System (bright)**  | Hologram       | `#60a5fa` | Active states, selections |
| **System (glow)**    | Data Stream    | `#93c5fd` | Glows, text highlights    |
| **System (deep)**    | Deep Code      | `#1d4ed8` | Darker system elements    |

**Red — Danger/Power Spike**

| Role                | Name       | Hex       | Usage              |
| ------------------- | ---------- | --------- | ------------------ |
| **Danger**          | Blood Gate | `#dc2626` | Warnings, critical |
| **Danger (bright)** | Alert      | `#f87171` | Error states       |

### Portal/Energy Colors

| Role            | Name | Hex       | Usage                  |
| --------------- | ---- | --------- | ---------------------- |
| **Portal Blue** | Gate | `#06b6d4` | Cyan portal energy     |
| **Portal Teal** | Rift | `#14b8a6` | Teal dimensional tears |

---

## Color Philosophy

1. **Darkness is the canvas** — Near-black backgrounds let energy colors pop
2. **Purple = shadow power** — The signature color, used for primary actions
3. **Blue = the system** — Information, UI, stats, notifications
4. **Energy glows** — Colors should feel like they emit light
5. **High contrast** — Text and elements punch through the dark

---

## Gradient Systems

### Shadow Energy Gradient

```css
background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #a855f7 100%);
```

### System Interface Gradient

```css
background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%);
```

### Portal Gradient

```css
background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
```

### Void Gradient (Background)

```css
background: radial-gradient(ellipse at center, #12121c 0%, #05050a 100%);
```

---

## Glow Effects

Glows are essential to this aesthetic. Elements should feel like they emit energy.

### Purple Glow (Shadow)

```css
box-shadow:
	0 0 20px rgba(124, 58, 237, 0.4),
	0 0 40px rgba(124, 58, 237, 0.2),
	0 0 60px rgba(124, 58, 237, 0.1);
```

### Blue Glow (System)

```css
box-shadow:
	0 0 20px rgba(59, 130, 246, 0.4),
	0 0 40px rgba(59, 130, 246, 0.2),
	0 0 60px rgba(59, 130, 246, 0.1);
```

### Text Glow

```css
text-shadow:
	0 0 10px rgba(124, 58, 237, 0.8),
	0 0 20px rgba(124, 58, 237, 0.4);
```

---

## Iconography & Visual Motifs

### Primary: Shadow Soldiers

The shadow army aesthetic:

- Silhouettes with glowing eyes/edges
- Figures emerging from darkness
- Smoke/shadow particle effects

### Secondary: System Windows

The game-like interface:

- Holographic panels with blue borders
- Stats, levels, progress bars
- Floating UI elements
- Scanline/digital noise effects

### Tertiary: Portals & Gates

Dimensional energy:

- Circular portal shapes
- Energy rings
- Rift/tear effects
- Swirling particles

### Detail Elements

- **Runes/glyphs** — Mysterious symbols
- **Particle effects** — Floating energy motes
- **Cracks with light** — Energy breaking through
- **Geometric patterns** — Hexagons, angular shapes

---

## Typography Direction

### Philosophy

- **Sharp and modern** — Angular, tech-forward
- **High contrast** — Bold weights for impact
- **System-like** — Monospace for stats/data

### Recommended Stack

| Role            | Font                                 | Feel                          |
| --------------- | ------------------------------------ | ----------------------------- |
| **Headings**    | Clash Display, Orbitron, or Rajdhani | Angular, powerful, futuristic |
| **Body**        | Inter, Space Grotesk, or Exo 2       | Clean, modern, readable       |
| **System/Data** | JetBrains Mono, Fira Code            | Technical, game UI            |
| **Display**     | Bebas Neue, Anton                    | Impact headlines              |

### Type Effects

- Glow on important text
- Gradient fills on headlines
- Animated reveal effects
- Glitch effects for emphasis

---

## Animation & Interaction

### Core Principles

1. **Energy in motion** — Things should pulse, glow, breathe
2. **Emergence** — Elements rise from shadow
3. **Power feedback** — Interactions feel impactful

### Hover States

| Element | Effect                               |
| ------- | ------------------------------------ |
| Buttons | Glow intensifies, slight pulse       |
| Cards   | Border glows, shadow expands         |
| Links   | Text glow, underline energy effect   |
| Icons   | Pulse animation, brightness increase |

### Transitions

| Property    | Duration | Easing                       |
| ----------- | -------- | ---------------------------- |
| Glow/shadow | 200ms    | ease-out                     |
| Transform   | 250ms    | cubic-bezier(0.4, 0, 0.2, 1) |
| Color       | 150ms    | ease                         |

### Special Effects

- **Particle systems** — Floating energy motes
- **Pulse animations** — Rhythmic glow on key elements
- **Reveal animations** — Content emerging from shadow
- **Glitch effects** — Subtle digital distortion

---

## UI Component Patterns

### System Window (Card)

```css
.system-window {
	background: linear-gradient(135deg, #0a0a12 0%, #12121c 100%);
	border: 1px solid rgba(59, 130, 246, 0.3);
	border-radius: 8px;
	box-shadow:
		0 0 20px rgba(59, 130, 246, 0.1),
		inset 0 1px 0 rgba(59, 130, 246, 0.1);
}

.system-window:hover {
	border-color: rgba(59, 130, 246, 0.6);
	box-shadow:
		0 0 30px rgba(59, 130, 246, 0.2),
		inset 0 1px 0 rgba(59, 130, 246, 0.2);
}
```

### Shadow Button (Primary CTA)

```css
.shadow-button {
	background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%);
	color: #fff;
	border: none;
	border-radius: 6px;
	padding: 12px 24px;
	font-weight: 600;
	box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
	transition: all 200ms ease;
}

.shadow-button:hover {
	background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
	box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
	transform: translateY(-2px);
}
```

### Progress Bar (Level/XP)

```css
.progress-bar {
	background: #12121c;
	border-radius: 4px;
	overflow: hidden;
	height: 8px;
}

.progress-fill {
	background: linear-gradient(90deg, #5b21b6 0%, #7c3aed 50%, #a855f7 100%);
	height: 100%;
	box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
	transition: width 500ms ease;
}
```

### Stat Display

```css
.stat {
	font-family: 'JetBrains Mono', monospace;
	color: #60a5fa;
	text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.stat-label {
	color: #5858688;
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

.stat-value {
	font-size: 24px;
	font-weight: 700;
}
```

---

## Background Treatments

### Void with Particles

```css
.void-bg {
	background: radial-gradient(ellipse at center, #12121c 0%, #05050a 100%);
	position: relative;
}

/* Add floating particle effect with JS/CSS animation */
```

### Grid Pattern (Subtle)

```css
.grid-bg {
	background-image:
		linear-gradient(rgba(124, 58, 237, 0.03) 1px, transparent 1px),
		linear-gradient(90deg, rgba(124, 58, 237, 0.03) 1px, transparent 1px);
	background-size: 40px 40px;
}
```

### Scanlines (Subtle)

```css
.scanlines::after {
	content: '';
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(
		0deg,
		rgba(0, 0, 0, 0.1) 0px,
		rgba(0, 0, 0, 0.1) 1px,
		transparent 1px,
		transparent 2px
	);
	pointer-events: none;
}
```

---

## CSS Variables

```css
:root {
	/* Void */
	--void-deep: #05050a;
	--void-shadow: #0a0a12;
	--void-umbra: #12121c;
	--void-penumbra: #1a1a28;

	/* Text */
	--text-primary: #e8e8f0;
	--text-secondary: #9898a8;
	--text-tertiary: #585868;

	/* Shadow Power (Purple) */
	--shadow-primary: #7c3aed;
	--shadow-bright: #a855f7;
	--shadow-deep: #5b21b6;
	--shadow-glow: #c084fc;

	/* System (Blue) */
	--system-primary: #3b82f6;
	--system-bright: #60a5fa;
	--system-glow: #93c5fd;
	--system-deep: #1d4ed8;

	/* Danger */
	--danger: #dc2626;
	--danger-bright: #f87171;

	/* Portal */
	--portal-cyan: #06b6d4;
	--portal-teal: #14b8a6;

	/* Glows */
	--glow-shadow: rgba(124, 58, 237, 0.4);
	--glow-system: rgba(59, 130, 246, 0.4);
}
```

---

## Usage Guidelines

### When to Use Purple (Shadow)

- Primary CTAs
- Key highlights
- Power/strength indicators
- Main brand moments

### When to Use Blue (System)

- Information display
- Navigation
- Stats and data
- Secondary actions

### When to Use Both

- Gradients for premium elements
- Portal/dimensional effects
- Hero sections

### What to Avoid

- Too many competing glows
- Overuse of particle effects (performance)
- Light backgrounds (breaks the mood)
- Warm colors (clashes with the cold palette)

---

## Summary

| Aspect           | Direction                                                   |
| ---------------- | ----------------------------------------------------------- |
| **Palette**      | Deep void blacks, purple shadow energy, blue system accents |
| **Mood**         | Dark, powerful, mysterious, game-like                       |
| **Effects**      | Glows, gradients, particles, emergence                      |
| **Typography**   | Angular, modern, monospace for data                         |
| **Interactions** | Pulse, glow intensify, emerge from shadow                   |

---

## Reference

- **Solo Leveling** (manhwa/anime)
- **Valorant** UI
- **Destiny 2** menus
- **Cyberpunk** aesthetics
- **Gaming interfaces** in general

---

_Version: 1.0_
_Created: 2026-01-17_
