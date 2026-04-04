---
name: short-form-video-adapter
description: Adapt a blog, draft, person analysis, or topic into Reels and Shorts concepts with hooks, beat-by-beat scripts, on-screen text, captions, and CTAs. Use when turning long-form 9takes content into short-form video.
argument-hint: '<person, topic, file path, or URL path>'
disable-model-invocation: true
---

# Short-Form Video Adapter

Use this skill to turn one strong 9takes idea into short-form video assets.

If `$ARGUMENTS` is empty, ask for one of:

1. A person name
2. A topic
3. A blog file path
4. A route or URL path

Examples:

```text
/short-form-video-adapter Pete Davidson
/short-form-video-adapter src/blog/people/drafts/Joe-Rogan.md
/short-form-video-adapter /enneagram-corner/why-you-cant-stop-overthinking-enneagram
```

## Read First

Load these references before scripting:

- `docs/brand/README.md`
- `docs/instagram/gen-z-instagram-posting-cheat-sheet-2026.md`
- `docs/instagram/instagram-launch-plan-feb-2026.md`
- `.claude/commands/distribute-instagram.md`

If the source is Twitter-native or you need sharper voice calibration, also load:

- `docs/twitter/voice-and-tone.md`

For the exact output shape, use:

- [template.md](template.md)
- [example-output.md](example-output.md)

## Workflow

### 1. Resolve the source asset

Read the source content and extract:

- the sharpest claim
- the strongest proof moment
- the most debatable or screenshot-worthy framing
- the safest disclaimer boundary

One video should carry one idea. If the source contains multiple ideas, separate them into multiple candidate concepts.

### 2. Generate concept options

Create 3 concept directions:

- safest / clearest
- strongest 9takes POV
- most viral / high-tension

Recommend one and explain why.

### 3. Build the final script

For the chosen concept, produce:

- 3 hook options
- a 30 to 60 second beat-by-beat script
- on-screen text
- shot or visual suggestions
- caption
- CTA
- disclaimer or boundary line

### 4. Keep it falsifiable

Every script should include:

- a concrete scene or behavior
- the interpretation
- at least one proof point
- a boundary condition or counter-signal

## Output Format

Use the supporting template and adapt it to the concept.

## Rules

- No throat-clearing. Open with payoff.
- One video, one claim.
- Replace generic adjectives with observable proof.
- Use 9takes voice, not therapy-account voice and not gossip-account voice.
- Make the first line specific enough that someone could argue with it.
- Keep paragraphs and caption blocks short enough for mobile.

## Save Behavior

Do not write a file unless the user asks or the workflow clearly calls for it.

If saving is useful, default to:

- `docs/distribution-assets/[slug]-short-form-video.md`
