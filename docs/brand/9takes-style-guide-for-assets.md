<!-- docs/brand/9takes-style-guide-for-assets.md -->

> **Updated 2026-11-05 for Cold Light.** The visual sections below follow
> [`cold-light.md`](./cold-light.md), the canonical visual identity. Templates and Canva setup live
> in [`canva-design-handoff.md`](./canva-design-handoff.md). The previous Solo Leveling purple specs
> (and the Streetlamp amber specs that replaced them) are retired; git history has them.
>
> ⚠️ **MESSAGING ALSO SUPERSEDED (2026-08-13)** — The voice section below predates the
> canonical hierarchy in `docs/brand/messaging-hierarchy.md`. Use the six locked lines there.
> "One situation, 9 ways to see it" and "personality-max your EQ" are retired.

# 9takes Style Guide for Image Assets

_Use this document when creating Instagram carousels, social graphics, thumbnails, or any visual assets for 9takes._

**Agents never generate images.** Write the finished prompt and hand it to DJ; he runs it in ChatGPT on his own subscription. No OpenRouter, Gemini, Canva AI generate or other image APIs.

---

## 1. Brand Identity at a Glance

| Element                 | Value                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------- |
| **Brand Name**          | 9takes                                                                             |
| **Brand promise**       | "See the emotions behind every take."                                              |
| **Product explanation** | "One question, nine perspectives."                                                 |
| **Core formula**        | "Honesty + Curiosity = Clarity."                                                   |
| **Aesthetic**           | **Cold Light.** Hidden until you answer: dark is the unknown, light is the reveal. |
| **Imagery**             | Grey Greek marble statues on black, with one shared indigo tint                    |

---

## 2. Color Palette

Dark only. Mostly dark, a little light.

| Name            | Hex                        | Usage                                                                                    |
| --------------- | -------------------------- | ---------------------------------------------------------------------------------------- |
| **Night**       | `#01010D`                  | Every background. Never pure black.                                                      |
| **Surface**     | `#0C0B22`                  | Cards, panels, text containers                                                           |
| **Raised**      | `#131133`                  | Raised rows, inner boxes                                                                 |
| **Indigo**      | `#6331FB`                  | Statue tint, fills, glows, tags. **Never text** (too dark at 3.3:1).                     |
| **Indigo deep** | `#24127A`                  | Deep fills                                                                               |
| **Lavender**    | `#CFC2FF`                  | The reveal: italic voice lines, highlights, underlined links                             |
| **Mint**        | `#88F9C0`                  | The key: the one "give your take" CTA. Dark `#01010D` text on it. One per slide at most. |
| **Text**        | `#F4F2FF`                  | Headlines                                                                                |
| **Muted**       | `#BDB8DA`                  | Body copy                                                                                |
| **Faint**       | `#8D88AE`                  | Counts, dates, small labels                                                              |
| **Rule**        | `rgba(207, 194, 255, .14)` | Hairline borders                                                                         |

**Never:** amber, orange or warm light (including old social templates), pure black, indigo text,
gradient-drenched backgrounds.

### Enneagram type colors

Use only when an asset is explicitly about one type, as a small data mark (a dot, a number, a thin
bar). Never as a background or button. Values match `docs/design-system.md` §5.

| Type | Hex       | Type | Hex       | Type | Hex       |
| ---- | --------- | ---- | --------- | ---- | --------- |
| 1    | `#6366F1` | 4    | `#A855F7` | 7    | `#FBBF24` |
| 2    | `#F472B6` | 5    | `#0EA5E9` | 8    | `#DC2626` |
| 3    | `#F59E0B` | 6    | `#22C55E` | 9    | `#34D399` |

---

## 3. Typography

Three faces. No fourth.

| Face                        | Role                         | Rules                                                         |
| --------------------------- | ---------------------------- | ------------------------------------------------------------- |
| **Anton**                   | The loud take                | Uppercase only. Headlines 40px and up. Never a full sentence. |
| **Playfair Display italic** | The quiet feeling underneath | Second line of a headline, inner-voice lines. Lavender.       |
| **Archivo**                 | Everything people read       | Body, captions, labels, buttons. Regular to semibold.         |

All three are free Google Fonts and available in Canva.

**Signature pairing:** a loud Anton line, then a quiet Playfair italic line under it.

```
ANSWER BEFORE
THE CROWD
What will they think of me?
```

---

## 4. Imagery

**Statues only, one shared tint.**

- Dry, matte, weathered Greek marble with blank carved eyes
- One light from the upper left on a black background
- Restrained expressions, like real sculpture
- No text inside the image
- No photos of people, places or phones
- Prompts ask for **neutral grey stone**. The indigo tint ramp (`#01010D` → `#160A46` → `#6331FB` → `#BEAAFF` → `#ECE6FF`) is applied afterward with sharp, so every statue matches.

Prompt standard and examples: `docs/design/image-refresh-2026-11-04/README.md` and
`docs/design/homepage-whispering-statues/prompts-emotions.md`.

**Avoid:** hacker clichés (code rain, glitch text, skulls), neon, gold cracks, floating symbols,
warm or orange light.

---

## 5. Shapes, Borders and Effects

- Corners: 4px (badges), 10px (buttons, chips), 16px (cards). Nothing else.
- Borders: 1px hairline in Rule (`rgba(207, 194, 255, .14)`). Borders do the work; shadows are rare.
- Glows: soft indigo only, small and low alpha. No glow chains, no neon.
- Hidden takes: show that they exist (a count, type numbers, blurred rows). **Never show what a take says** on an asset that hasn't asked the viewer to answer first.

---

## 6. Logo & Brand Marks

- **Primary logo:** the nine-mask mark recolored with the statue tint. Master:
  `docs/design/homepage-whispering-statues/logo-nine-mask-statue-tint.png`.
- The amber-lined, warm-cream nine-mask version is retired. So are Aero, Aria, Fresco, Nimbus,
  Oceanic, Polar and the Rubix marks.
- Use on Night backgrounds.
- `enneagram.svg` is still fine for diagrams.

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

### Slide background

- Default: solid Night `#01010D`
- Panels on top: Surface `#0C0B22` with a 1px Rule border
- Statue slides: the tinted statue full-bleed, fading to Night

### Slide text

- Headlines: Anton uppercase, Text `#F4F2FF`
- Voice line under the headline: Playfair Display italic, Lavender `#CFC2FF`
- Body: Archivo, Muted `#BDB8DA`
- Small labels and counts: Archivo uppercase with letter-spacing, Faint `#8D88AE`

### Slide accents

- One mint element at most per slide, and only when it's the action ("Give your take", "Answer first")
- Indigo for tags and fills, with Text `#F4F2FF` on top
- Type color only as a small data mark on type-specific slides

### Slide structure

- Hook on the first slide, one idea per slide after that
- Exactly one bright reveal slide (Lavender/Text on Night) for the payoff
- End with the ritual: answer before the crowd

### Template color combos for Canva

**Default slide:** Night background · Text headline · Lavender italic line · Muted body

**Type-specific slide:** Night background · Text headline · that type's color as a small mark

**CTA / final slide:** Night background · Anton headline · one mint button with Night text

---

## 9. Quick Copy-Paste Color Codes

```
#01010D  Night (background)
#0C0B22  Surface
#131133  Surface raised
#6331FB  Indigo (fills, tint; never text)
#24127A  Indigo deep
#CFC2FF  Lavender (reveal, italic lines, links)
#88F9C0  Mint (the one CTA)
#F4F2FF  Text
#BDB8DA  Text muted
#8D88AE  Text faint
```
