<!-- docs/content-generation/image-prompts/enneagram-vs-personality-frameworks-prompt.md -->

# Midjourney Prompt: Enneagram vs Personality Frameworks Comparison

**Target Blog Post:** `src/blog/enneagram/enneagram-vs-personality-frameworks-comparison.md`  
**Current pic setting:** `greek-statues-disagreeing`  
**Target Filename:** `greek-statues-disagreeing.webp`  
**Thumbnail:** `s-greek-statues-disagreeing.webp`

---

## Concept

Scholarly debate, not tribal conflict. The image should show classical figures examining evidence from multiple frameworks with intellectual tension and respect. It should feel rigorous, balanced, and research-oriented.

Use the 9takes Greek statue style from `docs/content-generation/midjourney_prompt_templates.md`:

- Marble white statues with gold accents and deep blue environment
- Cinematic, high-detail realism
- Clear emotional expressions (curiosity, skepticism, focus)
- Concrete scene elements (scrolls, carved charts, measuring instruments)

---

## Primary Prompt (Recommended)

```text
greek statues in a formal research debate, one statue presenting a glowing nine-point enneagram symbol on a marble tablet while another statue compares it to a five-column trait chart carved in stone, several scholar statues reviewing scrolls and calipers around a circular table, focused skeptical and curious facial expressions, grand classical forum library with columns and deep blue backdrop, Unreal Engine, Cinematic, marble white and gold accents with deep blue background, portrait Photography, Shot on 50mm lens, Ultra-Wide Angle, Depth of Field, hyper-detailed, beautifully color-coded, insane details, intricate details, beautifully color graded, 32k, Super-Resolution, Megapixel, Dramatic Cinematic Lighting, Global Illumination, Ray Tracing Global Illumination, hypermaximalist, elegant, hyper realistic, super detailed --ar 16:9 --v 6 --style raw
```

---

## Alternative Prompts

### Option A: Scales of Evidence

```text
greek marble statue of a judge-scholar weighing two stone tablets on a golden balance scale, left tablet etched with enneagram geometry and right tablet etched with trait dimensions, nearby statues annotating scrolls and pointing to empirical markers, expressions of critical thinking and measured disagreement, museum tribunal hall with layered depth and deep blue ambient shadows, Unreal Engine, Cinematic, marble white and gold accents with deep blue background, portrait Photography, Shot on 50mm lens, Ultra-Wide Angle, Depth of Field, hyper-detailed, beautifully color-coded, insane details, intricate details, beautifully color graded, 32k, Super-Resolution, Megapixel, Moody Dramatic Lighting, Global Illumination, Ray Tracing Global Illumination, hypermaximalist, elegant, hyper realistic, super detailed --ar 16:9 --v 6 --style raw
```

### Option B: What We Know vs What We Do Not Know

```text
two groups of greek scholar statues facing each other across a marble floor map, left side illuminated around stacked evidence scrolls and measurement tools, right side in softer shadow around incomplete tablets and question marks carved into stone, central mediator statue connecting both sides with open hands, expressions combining confidence and humility, classical academy hall with volumetric light rays and deep blue architecture, Unreal Engine, Cinematic, marble white and gold accents with deep blue background, portrait Photography, Shot on 50mm lens, Ultra-Wide Angle, Depth of Field, hyper-detailed, beautifully color-coded, insane details, intricate details, beautifully color graded, 32k, Super-Resolution, Megapixel, Cinematic Volumetric Lighting, Global Illumination, Ray Tracing Global Illumination, hypermaximalist, elegant, hyper realistic, super detailed --ar 16:9 --v 6 --style raw
```

---

## Notes

- Keep the tone analytical and credible, not mystical.
- Avoid readable text in-scene; rely on symbols and shapes.
- Prioritize facial expression and body posture that communicate evidence-based debate.

---

## After Generation

1. Save hero image as `static/blogs/greek-statues-disagreeing.webp`.
2. Save thumbnail as `static/blogs/s-greek-statues-disagreeing.webp`.
3. Confirm frontmatter remains:

```yaml
pic: 'greek-statues-disagreeing'
pic_alt: 'Greek statues examining evidence and debating personality theory'
```
