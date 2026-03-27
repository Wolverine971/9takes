---
name: midjourney-prompt
description: >
  Generate Midjourney prompts optimized for 9takes brand imagery. Covers greek statues with emotion,
  cyberpunk/neon aesthetics, tech/hacker themes, philosopher figures, community scenes, personal growth
  transformations, and cinematic styles. Uses proven templates from 73+ successful prompts with proper
  technical parameters, aspect ratios, and style weights.
user-invokable: true
argument-hint: "<concept or blog title>"
allowed-tools: Read, Write, AskUserQuestion
---

# Midjourney Prompt Generator for 9takes

Generate production-ready Midjourney prompts aligned with the 9takes brand. All prompts draw from proven templates derived from 73+ successful generations.

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

| Category | Best For | Key Signal Words |
|----------|----------|-----------------|
| Greek Statues | Personality types, emotional intelligence, psychology | emotion, type, feeling, personality |
| Cyberpunk/Neon | Digital platform, tech-forward, younger audience | modern, digital, tech, platform, app |
| Tech/Hacker | Developer content, analytical types | coding, developer, programmer, tech |
| Philosophers | Educational content, deep insights, authority | wisdom, philosophy, learning, history |
| Community/Group | Social dynamics, relationships, community | group, community, together, social, discussion |
| Personal Growth | Transformation, development, self-improvement | growth, change, journey, progress, transform |
| Cinematic | Hero images, marketing, premium content | hero, premium, marketing, featured |

## Step 3: Build the Prompt

### Template Structures

#### Greek Statues with Emotional Expression
```
[EMOTION/SITUATION] greek statue [ACTION/POSE], [FACIAL_EXPRESSION], [SETTING],
Unreal Engine, Cinematic, [COLOR_SCHEME], portrait Photography, Shot on 50mm lens,
Ultra-Wide Angle, Depth of Field, hyper-detailed, beautifully color-coded,
insane details, intricate details, beautifully color graded, 32k, Super-Resolution,
Megapixel, [LIGHTING_STYLE], Global Illumination, Ray Tracing Global Illumination,
hypermaximalist, elegant, hyper realistic, super detailed
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
[SUBJECT] [ACTION], cyberpunk, cyberpunk style, neon [COLORS],
Unreal Engine, Cinematic, Color Grading, portrait Photography,
Shot on 50mm lens, Ultra-Wide Angle, Depth of Field, hyper-detailed,
beautifully color-coded, insane details, intricate details,
beautifully color graded, [NEON_LIGHTING], Moody Lighting,
Cinematic Lighting, Studio Lighting, Soft Lighting, Volumetric,
Beautiful Lighting, Accent Lighting, Global Illumination,
Ray Tracing Global Illumination, hyper realistic, super detailed
```

#### Tech/Hacker
```
[TECH_SETTING] [CODING_ELEMENTS], hacker, [PROGRAMMING_LANGUAGE],
computers, [TECH_GEAR], dark theme, 8k, cinematic,
[CYBERPUNK_ELEMENTS], moody lighting with neon accents,
powerful atmosphere of intelligence, stealth, and precision,
high detail, realistic textures --ar 16:9 --raw
```

#### Philosophers & Historical Figures
```
[PHILOSOPHER/FIGURE] [CONTEMPLATIVE_ACTION], [CLASSICAL_SETTING],
ancient wisdom meets modern psychology, marble and gold tones,
cinematic composition, Unreal Engine, Cinematic, Color Grading,
portrait Photography, Shot on 50mm lens, Ultra-Wide Angle,
Depth of Field, hyper-detailed, beautifully color-coded,
insane details, intricate details, beautifully color graded,
32k, Super-Resolution, Megapixel, [DRAMATIC_LIGHTING],
Global Illumination, Ray Tracing Global Illumination,
hypermaximalist, elegant, hyper realistic, super detailed
```

#### Community & Group
```
[GROUP_COMPOSITION] [SOCIAL_INTERACTION], [SETTING],
[GROUP_DYNAMIC_DESCRIPTION], [EMOTIONAL_TONE],
[VISUAL_STYLE], [LIGHTING_MOOD], cinematic composition,
Unreal Engine, Cinematic, Color Grading, portrait Photography,
Shot on 50mm lens, Ultra-Wide Angle, Depth of Field,
hyper-detailed, beautifully color-coded, insane details,
intricate details, beautifully color graded,
32k, Super-Resolution, Megapixel, [LIGHTING_STYLE],
Global Illumination, Ray Tracing Global Illumination,
hypermaximalist, elegant, hyper realistic, super detailed
```

#### Personal Growth & Transformation
```
[TRANSFORMATION_SEQUENCE] showing [GROWTH_CONCEPT],
[PROGRESSION_DESCRIPTION], [SYMBOLIC_ELEMENTS],
[EMOTIONAL_JOURNEY], [VISUAL_METAPHOR],
Unreal Engine, Cinematic, Color Grading, Editorial Photography,
Shot on 70mm lens, Depth of Field, DOF, Tilt Blur,
Shutter Speed 1/1000, F/22, White Balance, 32k, Super-Resolution,
Megapixel, [LIGHTING_PROGRESSION], Global Illumination,
Ray Tracing Global Illumination, hypermaximalist, elegant,
hyper realistic, super detailed
```

### Brand Color Palettes

Apply these based on content tone:

| Palette | Colors | Use When |
|---------|--------|----------|
| **Classic 9takes** | Marble white, gold accents, deep blue backgrounds | Authority, education, core content |
| **Growth** | Neon purple, cosmic blue, growth green | Transformation, personal development |
| **Cyberpunk** | Magenta, cyan, electric blue | Tech content, younger audience |

### Lighting Presets

| Mood | Lighting Terms |
|------|---------------|
| **Dramatic** | Halfrear Lighting, Backlight, Contre-Jour |
| **Cinematic** | Cinematic Lighting, Studio Lighting, Moody Lighting |
| **Soft/Warm** | Natural Lighting, Soft Lighting, Volumetric |
| **Neon** | neon glow, Accent Lighting, Beautiful Lighting |

## Step 4: Add Technical Parameters

Always append Midjourney-specific parameters at the end:

| Parameter | Options | Default |
|-----------|---------|---------|
| `--ar` | `16:9` (blog hero), `1:1` (social), `4:9` (vertical), `9:16` (story), `3:2` (photo) | `16:9` |
| `--stylize` | `0-1000` (higher = more artistic) | `200` for realistic, `750` for artistic |
| `--quality` | `1` (standard), `2` (high detail) | `2` |
| `--raw` | No value needed. Reduces Midjourney's default beautification | Include for photorealistic |

## Step 5: Output Format

Present the final prompt in a copyable code block. Always generate **3 prompt variations** so the user has options:

```
### Variation 1: [Brief label]
[Full prompt here] --ar 16:9 --stylize 200 --quality 2

### Variation 2: [Brief label]
[Full prompt here] --ar 16:9 --stylize 750 --quality 2

### Variation 3: [Brief label]
[Full prompt here] --ar 16:9 --stylize 200 --quality 2 --raw
```

After presenting the prompts:
- Note which variation is recommended and why
- Offer to adjust any specific element (emotion, setting, lighting, color palette, aspect ratio)
- If the user wants changes, regenerate only the affected variation

## Rules

1. **Never use generic stock-photo language** - no "diverse group of professionals" or "business meeting"
2. **Always include the full technical parameter chain** - resolution, lighting, rendering engine
3. **Stay on-brand** - greek statues and classical imagery are the 9takes signature aesthetic
4. **Front-load the important elements** - Midjourney weighs early words more heavily
5. **Be specific about expressions and poses** - "face full of curiosity" not just "curious"
6. **Include setting/environment** - grounds the image and adds depth
7. **Match aspect ratio to platform** - don't default to square if it's a blog hero image

## Reference

Full template documentation with all successful examples is at:
`docs/content-generation/midjourney_prompt_templates.md`
