---
name: midjourney-prompt
description: >
  Generate Midjourney prompts optimized for 9takes brand imagery. Covers greek statues with emotion,
  cyberpunk/neon aesthetics, tech/hacker themes, philosopher figures, community scenes, personal growth
  transformations, and cinematic styles. Uses proven templates from 73+ successful prompts with proper
  technical parameters, aspect ratios, and style weights.
user-invocable: true
argument-hint: '<concept or blog title>'
allowed-tools: Read, Write, AskUserQuestion
---

# Midjourney Prompt Generator for 9takes

Generate production-ready Midjourney prompts aligned with the 9takes brand. All prompts draw from proven templates derived from 73+ successful generations.

## Model Version (V8.2)

Prompts target the current default model — V8.2, default since July 2026:

- `--quality` was **removed** in V8.x. Never append it. HD output (native 2K) is the default; add `--sd` only for cheap draft passes.
- Detailed prompts work well in V8, but spend the words on concrete visual detail — subject, pose, expression, setting, lighting — not render-engine jargon. The "Unreal Engine, 32k, Super-Resolution, insane details" chains from the V4/V5 era are dead weight now; the historical versions are preserved in the reference doc.

## Usage

```
/midjourney-prompt hero image for Type 5 blog post
/midjourney-prompt community discussion about stress
/midjourney-prompt cyberpunk personality discovery
```

## Step 1: Gather Context

If the user's request is vague, use `AskUserQuestion` to clarify:

1. **Content type** - What is this image for? (blog hero, social media, marketing, educational)
2. **Theme preference** - Any style preference? (greek statue, cyberpunk, philosopher, community, transformation, cinematic)
3. **Aspect ratio** - Where will this be used? (blog hero = 16:9, Instagram = 1:1, Pinterest/story = 9:16)

If the user provides enough context (e.g., a blog title or clear concept), skip straight to generation.

## Step 2: Select Template Category

Match the user's request to the best template category:

| Category        | Best For                                              | Key Signal Words                               |
| --------------- | ----------------------------------------------------- | ---------------------------------------------- |
| Greek Statues   | Personality types, emotional intelligence, psychology | emotion, type, feeling, personality            |
| Cyberpunk/Neon  | Digital platform, tech-forward, younger audience      | modern, digital, tech, platform, app           |
| Tech/Hacker     | Developer content, analytical types                   | coding, developer, programmer, tech            |
| Philosophers    | Educational content, deep insights, authority         | wisdom, philosophy, learning, history          |
| Community/Group | Social dynamics, relationships, community             | group, community, together, social, discussion |
| Personal Growth | Transformation, development, self-improvement         | growth, change, journey, progress, transform   |
| Cinematic       | Hero images, marketing, premium content               | hero, premium, marketing, featured             |

## Step 3: Build the Prompt

### Template Structures

#### Greek Statues with Emotional Expression

```
[EMOTION/SITUATION] greek statue [ACTION/POSE], [FACIAL_EXPRESSION], [SETTING],
[COLOR_SCHEME], cinematic portrait photography, shot on 50mm lens, depth of field,
detailed marble texture, [LIGHTING_STYLE], beautifully color graded, elegant, hyper realistic
```

**Enneagram-specific patterns:**

- Type 1 (Perfectionist): "greek statue with stern focused expression meticulously arranging objects into perfect order"
- Type 2 (Helper): "greek statue reaching out with warm caring expression, hands extended to help"
- Type 3 (Achiever): "greek statue standing confidently on podium, face full of determination and pride"
- Type 4 (Individualist): "greek statue in contemplative melancholic pose, gazing at reflection in water"
- Type 5 (Investigator): "greek statue hunched over ancient texts, face full of intense curiosity and focus"
- Type 6 (Loyalist): "greek statue standing guard with vigilant protective expression, scanning surroundings"
- Type 7 (Enthusiast): "greek statue mid-leap with ecstatic joyful expression, arms spread wide"
- Type 8 (Challenger): "greek statue in powerful commanding stance, jaw set with fierce determination"
- Type 9 (Peacemaker): "greek statue in serene meditation pose, face radiating calm peaceful acceptance"

#### Cyberpunk & Neon

```
[SUBJECT] [ACTION], cyberpunk style, neon [COLORS],
cinematic portrait photography, shot on 50mm lens, depth of field,
[NEON_LIGHTING], moody volumetric lighting, beautifully color graded,
hyper-detailed, hyper realistic
```

#### Tech/Hacker

```
[TECH_SETTING] [CODING_ELEMENTS], hacker, [PROGRAMMING_LANGUAGE],
computers, [TECH_GEAR], dark theme, cinematic,
[CYBERPUNK_ELEMENTS], moody lighting with neon accents,
powerful atmosphere of intelligence, stealth, and precision,
high detail, realistic textures
```

#### Philosophers & Historical Figures

```
[PHILOSOPHER/FIGURE] [CONTEMPLATIVE_ACTION], [CLASSICAL_SETTING],
ancient wisdom meets modern psychology, marble and gold tones,
cinematic composition, portrait photography, shot on 50mm lens,
depth of field, [DRAMATIC_LIGHTING], beautifully color graded,
elegant, hyper realistic, hyper-detailed
```

#### Community & Group

```
[GROUP_COMPOSITION] [SOCIAL_INTERACTION], [SETTING],
[GROUP_DYNAMIC_DESCRIPTION], [EMOTIONAL_TONE],
[VISUAL_STYLE], cinematic composition, shot on 50mm lens,
depth of field, [LIGHTING_MOOD], beautifully color graded,
hyper-detailed, hyper realistic
```

#### Personal Growth & Transformation

```
[TRANSFORMATION_SEQUENCE] showing [GROWTH_CONCEPT],
[PROGRESSION_DESCRIPTION], [SYMBOLIC_ELEMENTS],
[EMOTIONAL_JOURNEY], [VISUAL_METAPHOR],
cinematic editorial photography, shot on 70mm lens, shallow depth of field,
[LIGHTING_PROGRESSION], beautifully color graded, elegant,
hyper realistic, hyper-detailed
```

### Brand Color Palettes

Apply these based on content tone:

| Palette            | Colors                                            | Use When                             |
| ------------------ | ------------------------------------------------- | ------------------------------------ |
| **Classic 9takes** | Marble white, gold accents, deep blue backgrounds | Authority, education, core content   |
| **Growth**         | Neon purple, cosmic blue, growth green            | Transformation, personal development |
| **Cyberpunk**      | Magenta, cyan, electric blue                      | Tech content, younger audience       |

### Lighting Presets

| Mood          | Lighting Terms                                      |
| ------------- | --------------------------------------------------- |
| **Dramatic**  | Halfrear Lighting, Backlight, Contre-Jour           |
| **Cinematic** | Cinematic Lighting, Studio Lighting, Moody Lighting |
| **Soft/Warm** | Natural Lighting, Soft Lighting, Volumetric         |
| **Neon**      | neon glow, Accent Lighting, Beautiful Lighting      |

## Step 4: Add Technical Parameters

Always append Midjourney-specific parameters at the end:

| Parameter   | Options                                                                                     | Default                                 |
| ----------- | ------------------------------------------------------------------------------------------- | --------------------------------------- |
| `--ar`      | `16:9` (blog hero), `1:1` (social), `4:5` (feed portrait), `9:16` (story), `3:2` (photo)    | `16:9`                                  |
| `--stylize` | `0-1000` (higher = more artistic)                                                           | `200` for realistic, `750` for artistic |
| `--raw`     | No value needed. Reduces Midjourney's default beautification                                | Include for photorealistic              |
| `--sd`      | Standard-def output for cheap draft passes; HD (native 2K) is already the V8.1+ default     | Omit (HD)                               |

Optional exploration: `--chaos 0-100` for grid variety, `--weird 0-3000` for offbeat looks. **Never append `--quality` / `--q`** — removed in V8.x; it will error or be ignored.

## Step 5: Output Format

Present the final prompt in a copyable code block. Always generate **3 prompt variations** so the user has options:

```
### Variation 1: [Brief label]
[Full prompt here] --ar 16:9 --stylize 200

### Variation 2: [Brief label]
[Full prompt here] --ar 16:9 --stylize 750

### Variation 3: [Brief label]
[Full prompt here] --ar 16:9 --stylize 200 --raw
```

After presenting the prompts:

- Note which variation is recommended and why
- Offer to adjust any specific element (emotion, setting, lighting, color palette, aspect ratio)
- If the user wants changes, regenerate only the affected variation

## Rules

1. **Never use generic stock-photo language** - no "diverse group of professionals" or "business meeting"
2. **Keep the parameter chain current** - `--ar` + `--stylize`, plus `--raw`/`--sd` when warranted; never `--quality`
3. **Stay on-brand** - greek statues and classical imagery are the 9takes signature aesthetic
4. **Front-load the important elements** - Midjourney weighs early words more heavily
5. **Be specific about expressions and poses** - "face full of curiosity" not just "curious"
6. **Include setting/environment** - grounds the image and adds depth
7. **Match aspect ratio to platform** - don't default to square if it's a blog hero image

## Reference

Full template documentation with all successful examples (including the legacy V4/V5-era render chains) is at:
`docs/content-generation/midjourney_prompt_templates.md`
