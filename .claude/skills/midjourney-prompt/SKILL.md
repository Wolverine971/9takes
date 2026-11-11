---
name: midjourney-prompt
description: Write image prompts for 9takes blog heroes and illustrations using the Cold Light statue specification. Use for /midjourney-prompt or a request for an image prompt; add Midjourney parameters only when that is the requested generator. Social cards and OG cards use the brand-card renderer.
argument-hint: '<concept, blog title, or requested generator>'
path: .claude/skills/midjourney-prompt/SKILL.md
---

# 9takes image prompts

Keep `/midjourney-prompt` as the existing command name. The default deliverable is a finished, generator-neutral prompt DJ can run in a separate ChatGPT chat. An explicit Midjourney request gets a Midjourney variant.

## Read the current specification

- `docs/brand/cold-light.md`: canonical visual identity and statue treatment.
- `docs/brand/messaging-hierarchy.md`: canonical message and context.
- `CLAUDE.md`, Common Tasks: image-production rules and output routing.

Historical prompt collections, including `docs/content-generation/midjourney_prompt_templates.md`, are examples only. Their neon, gold, warm-light, and cyberpunk palettes do not override Cold Light.

## Route the deliverable

- Blog hero or editorial illustration: write the prompt below. Agents do not call image-generation APIs or drive ChatGPT in a browser; DJ runs the finished prompt himself.
- Social card, carousel text card, or OG/link-preview card: use the existing brand-card renderer and presets (`pnpm brand:card -- --list`, `src/lib/brand/brandCardPresets.ts`). Do not generate a text card with an image model.
- Existing image supplied by DJ: follow the local asset pipeline. For a blog hero, `node scripts/blog-image-variants.mjs <slug> <image>` builds the variants; use `pic: '<slug>'`.

## Compose the prompt

Infer the subject, use, and aspect ratio from the request. Ask only when a missing choice materially affects the result. Use a concrete pose or scene that communicates the article's emotional tension without caricaturing a personality type.

The base image must show:

- Dry, matte, weathered grey Greek marble with visible stone texture.
- Blank carved eyes and a restrained expression.
- One light from the upper left and a black background.
- Neutral grey stone, no text, no warm light, no neon or metallic gold.

The local image pipeline applies the indigo tint afterward; do not request a baked-in purple tint. Read the current specification for framing and any target-specific exceptions.

Example structure:

```text
A weathered Greek marble statue [concrete pose expressing the situation],
[restrained expression and framing]. Dry matte neutral-grey stone with visible
chisel marks and blank carved eyes. A single light from the upper left reveals
the form against a black background. [Composition and crop for the intended use].
No lettering, no warm lighting, no neon, no gold, no colored tint.
```

Return one finished prompt in a copyable block, followed by the intended aspect ratio and a short rationale. Offer distinct alternatives only when the user requests options or the concept benefits from them.

## Explicit Midjourney requests

Check [Midjourney's current version documentation](https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version) and parameter compatibility before adding version-dependent flags. If current documentation is unavailable, give the generator-neutral prompt and label unverified parameters instead of guessing.

Keep parameters separate from the descriptive prompt. Use the target aspect ratio; add stylization or raw-mode flags only when supported and helpful. Do not hardcode a permanently "current" model version or carry old render-engine keyword chains into new prompts.
