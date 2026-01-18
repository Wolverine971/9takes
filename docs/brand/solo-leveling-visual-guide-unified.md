# 9takes — Solo Leveling Visual Identity

> **The Shadow Monarch's Journey = Your EQ Awakening**
>
> From E-rank social awareness to S-rank emotional intelligence.
> Master the 9 shadows. See what others miss.

_Version: 3.0 (Unified)_
_Updated: 2026-01-17_

---

## 1. Brand Essence

### The Core Metaphor

Solo Leveling's narrative perfectly mirrors the 9takes journey:

| Solo Leveling                             | 9takes                                          |
| ----------------------------------------- | ----------------------------------------------- |
| Sung Jin-woo starts as weakest hunter     | User starts unaware of personality patterns     |
| The System grants power through quests    | Platform reveals insights through participation |
| Shadow extraction = understanding enemies | Understanding types = reading people            |
| Leveling up through challenges            | Growing EQ through perspective-taking           |
| Shadow Monarch commands 9 generals        | User masters 9 personality lenses               |

### Visual Philosophy

1. **Darkness is the canvas** — Near-black backgrounds let energy colors emerge
2. **Purple = Shadow Power** — Primary actions, insights, breakthroughs
3. **Blue = The System** — Information, UI, stats, navigation
4. **Energy glows** — Elements emit light, feel alive
5. **Emergence** — Content rises from shadow into understanding

### Core Tension

**Darkness AND Power** — The void contains immense potential. Quiet until unleashed. Understanding hidden beneath the surface.

---

## 2. Color System

### The Void (Backgrounds)

| Name         | Hex       | RGB        | Usage                        |
| ------------ | --------- | ---------- | ---------------------------- |
| **Abyss**    | `#05050a` | 5, 5, 10   | Primary background, the void |
| **Shadow**   | `#0a0a12` | 10, 10, 18 | Cards, elevated surfaces     |
| **Umbra**    | `#12121c` | 18, 18, 28 | Secondary surfaces, modals   |
| **Penumbra** | `#1a1a28` | 26, 26, 40 | Lighter surfaces, inputs     |

### Text

| Name      | Hex       | Usage                         |
| --------- | --------- | ----------------------------- |
| **Pale**  | `#e8e8f0` | Primary text, high contrast   |
| **Mist**  | `#9898a8` | Secondary text, descriptions  |
| **Faded** | `#585868` | Placeholders, disabled, hints |

### Shadow Power (Purple) — Primary Accent

| Name               | Hex       | Usage                         |
| ------------------ | --------- | ----------------------------- |
| **Monarch Purple** | `#7c3aed` | Primary CTAs, main accent     |
| **Violet Flame**   | `#a855f7` | Hover states, highlights      |
| **Abyssal Violet** | `#5b21b6` | Deep accents, gradient starts |
| **Ethereal**       | `#c084fc` | Glows, energy effects         |

### The System (Blue) — Secondary Accent

| Name               | Hex       | Usage                    |
| ------------------ | --------- | ------------------------ |
| **Interface Blue** | `#3b82f6` | System UI, notifications |
| **Hologram**       | `#60a5fa` | Active states, links     |
| **Data Stream**    | `#93c5fd` | Text highlights, glows   |
| **Deep Code**      | `#1d4ed8` | Darker system elements   |

### Status Colors

| Name            | Hex       | Usage                     |
| --------------- | --------- | ------------------------- |
| **Blood Gate**  | `#dc2626` | Danger, errors, warnings  |
| **Alert**       | `#f87171` | Error highlights          |
| **Hunter Gold** | `#f59e0b` | Achievements, XP, rewards |
| **Gold Glow**   | `#fbbf24` | Gold highlights           |
| **Gate Cyan**   | `#06b6d4` | Portal energy, special    |
| **Rift Teal**   | `#14b8a6` | Success, online status    |

### The 9 Shadow Types

Each Enneagram type has a shadow soldier identity with signature color:

| Type | Shadow Name           | Title           | Hex       | RGB           |
| ---- | --------------------- | --------------- | --------- | ------------- |
| 1    | **The Perfectionist** | Knight of Order | `#a8dadc` | 168, 218, 220 |
| 2    | **The Helper**        | Heart Guardian  | `#ff6b6b` | 255, 107, 107 |
| 3    | **The Achiever**      | Victory Blade   | `#fbbf24` | 251, 191, 36  |
| 4    | **The Individualist** | Soul Weaver     | `#c084fc` | 192, 132, 252 |
| 5    | **The Investigator**  | Mind Phantom    | `#22d3ee` | 34, 211, 238  |
| 6    | **The Loyalist**      | Iron Guard      | `#64748b` | 100, 116, 139 |
| 7    | **The Enthusiast**    | Storm Rider     | `#fb923c` | 251, 146, 60  |
| 8    | **The Challenger**    | War Commander   | `#ef4444` | 239, 68, 68   |
| 9    | **The Peacemaker**    | Harmony Sage    | `#4ade80` | 74, 222, 128  |

---

## 3. CSS Variables

```css
:root {
	/* ===== THE VOID (Backgrounds) ===== */
	--void-abyss: #05050a;
	--void-shadow: #0a0a12;
	--void-umbra: #12121c;
	--void-penumbra: #1a1a28;

	/* ===== TEXT ===== */
	--text-pale: #e8e8f0;
	--text-mist: #9898a8;
	--text-faded: #585868;

	/* ===== SHADOW POWER (Purple) ===== */
	--shadow-monarch: #7c3aed;
	--shadow-flame: #a855f7;
	--shadow-deep: #5b21b6;
	--shadow-ethereal: #c084fc;

	/* ===== THE SYSTEM (Blue) ===== */
	--system-interface: #3b82f6;
	--system-hologram: #60a5fa;
	--system-stream: #93c5fd;
	--system-deep: #1d4ed8;

	/* ===== STATUS ===== */
	--status-danger: #dc2626;
	--status-danger-bright: #f87171;
	--status-gold: #f59e0b;
	--status-gold-bright: #fbbf24;
	--status-cyan: #06b6d4;
	--status-success: #14b8a6;

	/* ===== THE 9 SHADOWS ===== */
	--type-1: #a8dadc;
	--type-2: #ff6b6b;
	--type-3: #fbbf24;
	--type-4: #c084fc;
	--type-5: #22d3ee;
	--type-6: #64748b;
	--type-7: #fb923c;
	--type-8: #ef4444;
	--type-9: #4ade80;

	/* ===== GLOWS ===== */
	--glow-shadow: rgba(124, 58, 237, 0.4);
	--glow-shadow-strong: rgba(124, 58, 237, 0.6);
	--glow-system: rgba(59, 130, 246, 0.4);
	--glow-system-strong: rgba(59, 130, 246, 0.6);
	--glow-gold: rgba(245, 158, 11, 0.4);

	/* ===== TYPOGRAPHY ===== */
	--font-display: 'Rajdhani', 'Inter', sans-serif;
	--font-body: 'Space Grotesk', 'Inter', sans-serif;
	--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

	/* ===== TRANSITIONS ===== */
	--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
	--duration-fast: 150ms;
	--duration-normal: 250ms;
	--duration-slow: 400ms;
}
```

---

## 4. Typography

### Font Stack

| Role                  | Font           | Fallback  | Weight  | Feel               |
| --------------------- | -------------- | --------- | ------- | ------------------ |
| **Display/Headlines** | Rajdhani       | Inter     | 600-700 | Angular, powerful  |
| **Body**              | Space Grotesk  | Inter     | 400-500 | Clean, modern      |
| **System/Data**       | JetBrains Mono | Fira Code | 400-600 | Technical, game UI |

### Type Scale

| Element      | Size    | Weight | Line Height | Letter Spacing |
| ------------ | ------- | ------ | ----------- | -------------- |
| Hero H1      | 48-72px | 700    | 1.1         | -0.02em        |
| Section H2   | 32-40px | 700    | 1.2         | -0.01em        |
| Card H3      | 20-24px | 600    | 1.3         | 0              |
| Body         | 16px    | 400    | 1.6         | 0              |
| Small        | 14px    | 400    | 1.5         | 0              |
| System Label | 11-12px | 600    | 1           | 0.1em          |
| Stat Value   | 24-32px | 700    | 1           | 0              |

### Text Effects

```css
/* Glowing headline */
.text-glow-shadow {
	color: var(--shadow-flame);
	text-shadow:
		0 0 10px rgba(168, 85, 247, 0.6),
		0 0 20px rgba(168, 85, 247, 0.4),
		0 0 30px rgba(168, 85, 247, 0.2);
}

/* Gradient text */
.text-gradient-shadow {
	background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--system-interface) 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

/* System text */
.text-system {
	font-family: var(--font-mono);
	color: var(--system-hologram);
	text-transform: uppercase;
	letter-spacing: 0.1em;
	font-size: 0.75rem;
}
```

---

## 5. Gradients

### Primary Gradients

```css
/* Shadow Energy — Hero sections, primary CTAs */
.gradient-shadow {
	background: linear-gradient(
		135deg,
		var(--shadow-deep) 0%,
		var(--shadow-monarch) 50%,
		var(--shadow-flame) 100%
	);
}

/* System Interface — Cards, panels */
.gradient-system {
	background: linear-gradient(
		135deg,
		var(--system-deep) 0%,
		var(--system-interface) 50%,
		var(--system-hologram) 100%
	);
}

/* Portal — Special elements, dimensional effects */
.gradient-portal {
	background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--status-cyan) 100%);
}

/* Void — Background depth */
.gradient-void {
	background: radial-gradient(ellipse at 50% 0%, var(--void-umbra) 0%, var(--void-abyss) 70%);
}

/* Card surface */
.gradient-card {
	background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
}
```

---

## 6. Glow Effects

Glows are essential — elements should feel like they emit energy.

### Box Shadows

```css
/* Shadow power glow (purple) — primary elements */
.glow-shadow {
	box-shadow:
		0 0 20px rgba(124, 58, 237, 0.3),
		0 0 40px rgba(124, 58, 237, 0.15),
		0 0 60px rgba(124, 58, 237, 0.05);
}

.glow-shadow-intense {
	box-shadow:
		0 0 20px rgba(124, 58, 237, 0.5),
		0 0 40px rgba(124, 58, 237, 0.3),
		0 0 80px rgba(124, 58, 237, 0.15);
}

/* System glow (blue) — info elements */
.glow-system {
	box-shadow:
		0 0 20px rgba(59, 130, 246, 0.3),
		0 0 40px rgba(59, 130, 246, 0.15),
		0 0 60px rgba(59, 130, 246, 0.05);
}

/* Gold glow — achievements, rewards */
.glow-gold {
	box-shadow:
		0 0 15px rgba(245, 158, 11, 0.4),
		0 0 30px rgba(245, 158, 11, 0.2);
}

/* Type-specific glow (use CSS custom property) */
.glow-type {
	box-shadow:
		0 0 20px color-mix(in srgb, var(--type-color) 40%, transparent),
		0 0 40px color-mix(in srgb, var(--type-color) 20%, transparent);
}
```

### Inner Glows (for panels)

```css
.panel-glow {
	box-shadow:
		0 0 30px rgba(124, 58, 237, 0.1),
		inset 0 0 60px rgba(59, 130, 246, 0.05),
		inset 0 1px 0 rgba(59, 130, 246, 0.1);
}
```

---

## 7. Background Treatments

### Void with Ambient Light

```css
.bg-void {
	background: var(--void-abyss);
	position: relative;
}

.bg-void::before {
	content: '';
	position: absolute;
	inset: 0;
	background:
		radial-gradient(ellipse at 20% 20%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
		radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
	pointer-events: none;
}
```

### Grid Pattern

```css
.bg-grid {
	background-image:
		linear-gradient(rgba(124, 58, 237, 0.03) 1px, transparent 1px),
		linear-gradient(90deg, rgba(124, 58, 237, 0.03) 1px, transparent 1px);
	background-size: 50px 50px;
}
```

### Scanlines

```css
.bg-scanlines::after {
	content: '';
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(
		0deg,
		rgba(0, 0, 0, 0.03) 0px,
		rgba(0, 0, 0, 0.03) 1px,
		transparent 1px,
		transparent 3px
	);
	pointer-events: none;
	opacity: 0.5;
}
```

---

## 8. UI Components

### System Window (Card)

```css
.system-window {
	background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
	border: 1px solid rgba(59, 130, 246, 0.2);
	border-radius: 12px;
	box-shadow:
		0 0 20px rgba(59, 130, 246, 0.08),
		inset 0 1px 0 rgba(59, 130, 246, 0.1);
	transition: all var(--duration-normal) var(--ease-out);
}

.system-window:hover {
	border-color: rgba(59, 130, 246, 0.5);
	box-shadow:
		0 0 30px rgba(59, 130, 246, 0.15),
		inset 0 1px 0 rgba(59, 130, 246, 0.15);
	transform: translateY(-4px);
}
```

### Shadow Button (Primary CTA)

```css
.btn-shadow {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.875rem 1.75rem;
	background: linear-gradient(135deg, var(--shadow-deep) 0%, var(--shadow-monarch) 100%);
	border: none;
	border-radius: 8px;
	font-family: var(--font-display);
	font-size: 1rem;
	font-weight: 600;
	color: white;
	cursor: pointer;
	overflow: hidden;
	box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
	transition: all var(--duration-normal) var(--ease-out);
}

.btn-shadow:hover {
	background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-flame) 100%);
	box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
	transform: translateY(-2px);
}

/* Shine effect */
.btn-shadow::after {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
	transition: left var(--duration-slow) ease;
}

.btn-shadow:hover::after {
	left: 100%;
}
```

### System Button (Secondary)

```css
.btn-system {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.875rem 1.75rem;
	background: transparent;
	border: 1px solid rgba(59, 130, 246, 0.4);
	border-radius: 8px;
	font-family: var(--font-display);
	font-size: 1rem;
	font-weight: 600;
	color: var(--system-hologram);
	cursor: pointer;
	transition: all var(--duration-normal) var(--ease-out);
}

.btn-system:hover {
	background: rgba(59, 130, 246, 0.1);
	border-color: var(--system-hologram);
	box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}
```

### System Notification

```css
.system-notification {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%);
	border: 1px solid rgba(59, 130, 246, 0.3);
	border-radius: 6px;
	font-family: var(--font-mono);
	font-size: 0.75rem;
	letter-spacing: 0.1em;
	color: var(--system-hologram);
}

.system-notification .label {
	color: var(--system-stream);
	text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}
```

### Progress/XP Bar

```css
.progress-bar {
	width: 100%;
	height: 8px;
	background: var(--void-penumbra);
	border-radius: 4px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(
		90deg,
		var(--shadow-deep) 0%,
		var(--shadow-monarch) 50%,
		var(--shadow-flame) 100%
	);
	box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
	border-radius: 4px;
	transition: width 500ms var(--ease-out);
}

/* Gold variant for XP */
.progress-fill-gold {
	background: linear-gradient(
		90deg,
		#b45309 0%,
		var(--status-gold) 50%,
		var(--status-gold-bright) 100%
	);
	box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}
```

### Stat Display

```css
.stat-box {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.stat-label {
	font-family: var(--font-mono);
	font-size: 0.625rem;
	font-weight: 600;
	color: var(--text-faded);
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

.stat-value {
	font-family: var(--font-mono);
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--system-hologram);
	text-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}
```

### Type Badge

```css
.type-badge {
	--type-color: var(--shadow-monarch);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 1.75rem;
	height: 1.75rem;
	padding: 0 0.5rem;
	background: color-mix(in srgb, var(--type-color) 15%, transparent);
	border: 1px solid color-mix(in srgb, var(--type-color) 40%, transparent);
	border-radius: 6px;
	font-family: var(--font-mono);
	font-size: 0.75rem;
	font-weight: 700;
	color: var(--type-color);
}
```

### Quest Card

```css
.quest-card {
	display: block;
	padding: 1.5rem;
	background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
	border: 1px solid rgba(59, 130, 246, 0.25);
	border-radius: 12px;
	box-shadow:
		0 0 25px rgba(59, 130, 246, 0.1),
		inset 0 1px 0 rgba(59, 130, 246, 0.1);
	transition: all var(--duration-normal) var(--ease-out);
}

.quest-card:hover {
	border-color: rgba(59, 130, 246, 0.5);
	box-shadow:
		0 0 40px rgba(59, 130, 246, 0.2),
		inset 0 1px 0 rgba(59, 130, 246, 0.15);
	transform: translateY(-4px);
}

.quest-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.quest-label {
	font-family: var(--font-mono);
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--system-hologram);
	letter-spacing: 0.1em;
	text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.quest-reward {
	display: flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.375rem 0.75rem;
	background: rgba(245, 158, 11, 0.1);
	border: 1px solid rgba(245, 158, 11, 0.3);
	border-radius: 4px;
	font-family: var(--font-mono);
	font-size: 0.75rem;
	font-weight: 700;
	color: var(--status-gold-bright);
}
```

---

## 9. Animations

### Core Principles

1. **Energy in motion** — Elements pulse, glow, breathe
2. **Emergence** — Content rises from shadow
3. **Power feedback** — Interactions feel impactful

### Keyframes

```css
/* Pulse glow */
@keyframes pulse-glow {
	0%,
	100% {
		opacity: 1;
		box-shadow: 0 0 20px var(--glow-shadow);
	}
	50% {
		opacity: 0.7;
		box-shadow: 0 0 30px var(--glow-shadow-strong);
	}
}

/* Status indicator */
@keyframes pulse-status {
	0%,
	100% {
		opacity: 1;
		transform: scale(1);
	}
	50% {
		opacity: 0.5;
		transform: scale(0.95);
	}
}

/* Float up (particles) */
@keyframes float-up {
	0% {
		transform: translateY(0) scale(1);
		opacity: 0;
	}
	10% {
		opacity: 0.6;
	}
	90% {
		opacity: 0.6;
	}
	100% {
		transform: translateY(-100vh) scale(0.5);
		opacity: 0;
	}
}

/* Emerge from shadow */
@keyframes emerge {
	from {
		opacity: 0;
		transform: translateY(20px);
		filter: blur(4px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
		filter: blur(0);
	}
}

/* Ring rotation */
@keyframes ring-rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* Center pulse (for enneagram) */
@keyframes center-pulse {
	0%,
	100% {
		transform: scale(1);
		opacity: 0.6;
	}
	50% {
		transform: scale(1.3);
		opacity: 0;
	}
}
```

### Transition Timings

| Property         | Duration | Easing                       |
| ---------------- | -------- | ---------------------------- |
| Color/opacity    | 150ms    | ease                         |
| Transform        | 250ms    | cubic-bezier(0.4, 0, 0.2, 1) |
| Box-shadow       | 200ms    | ease-out                     |
| Width (progress) | 500ms    | ease-out                     |

---

## 10. 9takes-Specific Applications

### The 9 Shadows Grid

Display personality types as shadow soldiers:

```css
.shadow-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;
}

.shadow-card {
	--type-color: var(--shadow-monarch); /* Set per type */
	position: relative;
	background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
	border: 1px solid color-mix(in srgb, var(--type-color) 20%, transparent);
	border-radius: 12px;
	padding: 1rem;
	transition: all var(--duration-normal) var(--ease-out);
}

.shadow-card:hover {
	border-color: color-mix(in srgb, var(--type-color) 50%, transparent);
	box-shadow: 0 0 30px color-mix(in srgb, var(--type-color) 25%, transparent);
	transform: translateY(-4px);
}

.shadow-avatar {
	width: 5rem;
	height: 5rem;
	border-radius: 50%;
	border: 2px solid var(--type-color);
	box-shadow: 0 0 20px color-mix(in srgb, var(--type-color) 40%, transparent);
}
```

### Question/Quest Display

Frame questions as quests:

- **Daily Quest** — Question of the day with XP reward
- **Dungeon Gate** — Article/content with difficulty rank (C/B/A/S)
- **Shadow Extraction** — Unlocking perspectives after giving your take

### Level/Progress System

- **Hunter Level** — User engagement level
- **XP Bar** — Progress toward next level
- **Stats** — INT (insights), PER (perspectives), WIS (wisdom)
- **Achievements** — Badges for milestones

### Give-First Mechanic

Visual representation of the unlock:

1. **Locked state** — Blurred/shadowed content, system border
2. **Input state** — Glowing input field, "Extracting shadow..."
3. **Revealed state** — Content emerges with shadow animation

---

## 11. Do's and Don'ts

### Do

- Use Abyss (#05050a) as primary background
- Apply glows strategically for emphasis
- Use purple for primary actions, blue for system/info
- Let content emerge from darkness
- Use type-specific colors for personality elements
- Add subtle grid/scanline textures
- Make interactions feel powerful

### Don't

- Overuse glow effects (loses impact)
- Use light backgrounds (breaks immersion)
- Use warm colors except for danger/gold
- Add too many competing particle effects
- Forget accessibility (maintain contrast ratios)
- Make everything glow equally

### Accessibility

| Element            | Minimum Contrast              |
| ------------------ | ----------------------------- |
| Body text on Abyss | 4.5:1 (Pale #e8e8f0 = 15:1 ✓) |
| Large text         | 3:1                           |
| Interactive focus  | 3:1 visible indicator         |

Test purple/blue text on dark backgrounds — #a855f7 and #60a5fa both pass on #05050a.

---

## 12. Implementation Checklist

### Page Structure

- [ ] Dark void background with gradient
- [ ] Grid pattern overlay (subtle)
- [ ] Scanlines overlay (very subtle)
- [ ] Floating particle system (optional, performant)

### Typography

- [ ] Load Rajdhani, Space Grotesk, JetBrains Mono
- [ ] Apply display font to headlines
- [ ] Apply mono font to stats/labels
- [ ] Add text glow to key elements

### Components

- [ ] System notification headers
- [ ] Quest cards for questions
- [ ] Shadow cards for 9 types
- [ ] Progress bars with glow
- [ ] Primary (shadow) and secondary (system) buttons

### Interactions

- [ ] Hover glow intensification
- [ ] Transform on hover (translateY)
- [ ] Emerge animation for reveals
- [ ] Button shine effect

---

## 13. Summary

| Aspect               | Direction                                                       |
| -------------------- | --------------------------------------------------------------- |
| **Background**       | Abyss (#05050a), grid overlay, subtle scanlines                 |
| **Primary Accent**   | Monarch Purple (#7c3aed) — CTAs, power, insights                |
| **Secondary Accent** | Interface Blue (#3b82f6) — system, info, navigation             |
| **Status**           | Gold for rewards, red for danger, teal for success              |
| **9 Types**          | Each has unique color identity                                  |
| **Typography**       | Rajdhani (display), Space Grotesk (body), JetBrains Mono (data) |
| **Effects**          | Layered glows, gradients, emergence animations                  |
| **Mood**             | Dark, powerful, game-like, mysterious                           |

---

**Core Tagline**

> _"Awaken your emotional intelligence. Master the 9 shadows."_

**Visual Tagline**

> _"From E-rank to Shadow Monarch. See what others miss."_

---

_Version: 3.0 (Unified)_
_For: 9takes.com_
