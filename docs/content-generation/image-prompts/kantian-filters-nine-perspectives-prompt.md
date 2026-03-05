<!-- docs/content-generation/image-prompts/kantian-filters-nine-perspectives-prompt.md -->

# Midjourney Prompt: Kantian Filters and Nine Perspectives

**Target Blog Post:** `src/blog/community/kantian-filters-and-nine-perspectives.md`  
**Current pic setting:** `kantian-filters-nine-perspectives`  
**Target Filename:** `kantian-filters-nine-perspectives.webp`  
**Thumbnail:** `s-kantian-filters-nine-perspectives.webp`

---

## Concept

Treat this like a physical optics demo in a philosophy classroom: one object, nine viewers, nine actual lenses, nine visible color outcomes.

Use 9takes visual language:

- Greek marble statues + classical architecture
- Deep blue and warm gold palette
- High-detail cinematic realism
- Clear body language showing active interpretation

---

## Primary Prompt (Recommended)

```text
wide cinematic shot, marble philosophy classroom in an ancient greek academy, one bright candle on a stone pedestal at center, nine greek marble bust statues seated in a semicircle around a wooden table, each statue holding a different colored glass lens in front of one eye (red, orange, yellow, green, cyan, blue, violet, smoke gray, clear), each lens casting a matching color patch onto a white plaster wall, notebooks with charcoal sketches and measuring calipers on the table, one instructor statue pointing at the same candle, natural sunset light from tall windows plus warm candlelight, realistic stone and wood textures, museum-quality photography, no floating symbols, no magic effects, no readable text, Unreal Engine, Cinematic, Color Grading, Shot on 50mm lens, Ultra-Wide Angle, Depth of Field, hyper-detailed, 32k, Super-Resolution, Megapixel, Dramatic Cinematic Lighting, Global Illumination, Ray Tracing Global Illumination, elegant, hyper realistic --ar 16:9 --v 6 --style raw --stylize 120
```

---

## Alternative Prompts

### Option A: The Nine Viewports

```text
ancient greek lecture room with a marble owl statue on a center pedestal, nine marble philosopher statues standing in a half-circle, each holding a transparent colored acetate sheet between their eyes and the owl, nine distinct colored light patches visible on the back wall, chalk dust on floor, wooden benches, open scrolls and rulers on desks, instructor statue writing a simple circle diagram on slate board (no words), late afternoon window light, realistic classroom staging, documentary-style composition, no surreal glow, no floating geometry, no readable text, Unreal Engine, Cinematic, Color Grading, Shot on 50mm lens, Depth of Field, hyper-detailed, 32k, Global Illumination, Ray Tracing Global Illumination, elegant, hyper realistic --ar 16:9 --v 6 --style raw --stylize 100
```

### Option B: Kant and the Circle of Filters

```text
close-medium shot in a classical stone lab, one marble Kant statue at center table placing nine labeled but textless glass lenses in a row, eight other philosopher statues lean in and compare what they see through each lens toward the same lit candle in background, fingerprints and dust on glass, worn wood table, brass calipers, wax-sealed notebooks, practical experiment vibe, natural warm light, grounded realism, no fantasy particles, no floating symbols, no text, Unreal Engine, Cinematic, Color Grading, Shot on 70mm lens, Depth of Field, hyper-detailed stone and glass textures, 32k, Super-Resolution, Global Illumination, Ray Tracing Global Illumination, elegant, hyper realistic --ar 16:9 --v 6 --style raw --stylize 90
```

---

## Notes

- Keep every element physically photographable.
- Use one object only (candle or owl) to reduce model confusion.
- Ban abstract add-ons: no floating symbols, no cosmic haze, no magical particles.
- If results drift abstract, lower stylize to `--stylize 60`.

---

## After Generation

1. Export selected image as `static/blogs/kantian-filters-nine-perspectives.webp`.
2. Create thumbnail as `static/blogs/s-kantian-filters-nine-perspectives.webp`.
3. Confirm blog references remain:

```yaml
pic: 'kantian-filters-nine-perspectives'
pic_alt: 'Nine Greek bust statues in a classroom viewing one candle through different colored glass lenses'
```
