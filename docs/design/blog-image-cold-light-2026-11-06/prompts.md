<!-- docs/design/blog-image-cold-light-2026-11-06/prompts.md -->

# Blog hero replacements for Cold Light (2026-11-06)

These are the replacement prompts for the 16 published blog heroes that the Cold Light image audit marked **replace**: tinting won't save the subject (photos of living people, cartoon or collage art, text or logos baked in, fantasy scenery). The other heroes are tinted with `scripts/cold-light-tint.mjs`. The contact-sheet data is at `sheet.json` in the image-lane scratchpad.

DJ generates these in ChatGPT on his own subscription. **Agents never generate images.** The prompts follow `docs/brand/cold-light.md` (Imagery) and `docs/design/image-refresh-2026-11-04/README.md`. Article heroes keep a simple stone setting, but every prompt drops warm light and asks for **neutral grey stone**. The indigo tint is added afterward with sharp.

They're ordered by priority: traffic first (GSC, Jul–Oct 2026), then how off-brand the current image is.

**How to run them:** use one ChatGPT chat per batch of four or five, so the material and light carry over. Attach `static/greek_distorted_statue_face.webp` to the first prompt as the material reference, and add "Match the attached image's stone exactly." to that first prompt.

**After you save each one** (the ChatGPT download can stay in ~/Downloads):

```
node scripts/blog-image-variants.mjs <slug> ~/Downloads/<file>.png
node scripts/cold-light-tint.mjs static/blogs/<slug>.webp static/blogs/<slug>.webp
node scripts/cold-light-tint.mjs static/blogs/s-<slug>.webp static/blogs/s-<slug>.webp
```

The variants script writes the neutral grey master to `source-assets/blogs/<slug>.png` and the webp pair to `static/blogs/`. The tint step colors only the two delivery files, so the master stays grey. Then set `pic: '<slug>'` in the post. Each slug below is a new filename, so cached copies of the old image don't linger after deploy.

## 1. enneagram-and-mental-illness

<a id="enneagram-and-mental-illness"></a>

**Post:** [The Enneagram and Mental Illness](https://9takes.com/enneagram-corner/enneagram-and-mental-illness) · **Replaces:** `static/blogs/greek-statue-2-sided-mask.webp` · **Why:** Top-traffic post (363 clicks, 29.6k impressions Jul–Oct). The split grin-mask with red/cyan gels sensationalizes mental illness (Nov-4 audit T1). Tint fixes the color, not the subject. The tinted stopgap is in the preview set.

**Save as:** `source-assets/blogs/greek-statues-quiet-confiding.png` (slug `greek-statues-quiet-confiding`)

```
Editorial photograph of two life-sized ancient Greek marble statues seated side by side on a plain stone bench under a quiet colonnade. The figure on the left, a man in a draped himation, sits with his head lowered and his forearms on his knees, hands loosely clasped, speaking quietly as if admitting something he has carried for a long time. The figure on the right, a woman, has turned her body toward him and leans in slightly, listening, one hand resting on the bench between them, not touching him. The emotion is restrained: weight, not drama. No masks, no cracks, no symbols.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: worn stone columns and a plain wall softly falling into near-black behind them. No sky.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statues-quiet-confiding <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statues-quiet-confiding.webp static/blogs/greek-statues-quiet-confiding.webp` and the same for `s-greek-statues-quiet-confiding.webp`.

## 2. enneagram-neurodivergence-guide

<a id="enneagram-neurodivergence-guide"></a>

**Post:** [Enneagram and Neurodivergence: ADHD, Autism, and Motivation](https://9takes.com/enneagram-corner/mental-health/enneagram-neurodivergence-guide) · **Replaces:** `static/blogs/greek-statue-playing-with-toys.webp` · **Why:** Second-highest traffic of the replace set (102 clicks, 11.4k impressions Jul–Oct). Rainbow toy clutter stereotypes neurodivergence. The post is about masking being mistyped as 5, 9 or 1.

**Save as:** `source-assets/blogs/greek-statue-lowering-the-mask.png` (slug `greek-statue-lowering-the-mask`)

```
Editorial photograph of a life-sized ancient Greek marble statue of a young woman seated alone at a plain stone table. In one hand she holds a smooth, blank carved stone mask, lowered to chest height and turned away from her, as if she has just taken it off after a long day. Her real carved face is calm and tired, eyes downcast toward an uncarved wax tablet lying flat on the table. Shoulders drop slightly with relief. One mask only, plain and expressionless, the only prop besides the tablet.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: a bare stone room with one small window, background falling to near-black.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statue-lowering-the-mask <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statue-lowering-the-mask.webp static/blogs/greek-statue-lowering-the-mask.webp` and the same for `s-greek-statue-lowering-the-mask.webp`.

## 3. why-you-cant-stop-overthinking-enneagram

<a id="why-you-cant-stop-overthinking-enneagram"></a>

**Post:** [Why You Can't Stop Overthinking](https://9takes.com/enneagram-corner/why-you-cant-stop-overthinking-enneagram) · **Replaces:** `static/blogs/greek-statue-overthinking-spiral.webp` · **Why:** Steady search page (~1,000 impressions Jul–Oct). A statue pasted onto a Starry-Night swirl with clocks: collage, no concrete thought loop.

**Save as:** `source-assets/blogs/greek-statue-rereading-at-night.png` (slug `greek-statue-rereading-at-night`)

```
Editorial photograph of a life-sized ancient Greek marble statue of a man seated at a stone table late at night, rereading the same small wax tablet he is holding close, brow tight, one hand pressed to his temple. On the table and on the floor beside him lie several more wax tablets set face-down and pushed aside, earlier drafts of the same thought. The room is still; he is the only thing awake. Restrained, sculptural worry, no grimace.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. The single light is cool moonlight entering from a high window at the upper left. Simple stone room, background falling to near-black.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statue-rereading-at-night <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statue-rereading-at-night.webp static/blogs/greek-statue-rereading-at-night.webp` and the same for `s-greek-statue-rereading-at-night.webp`.

## 4. enneagram-childhood-stereotypes

<a id="enneagram-childhood-stereotypes"></a>

**Post:** [9 Childhood Stereotypes Based on the Enneagram](https://9takes.com/enneagram-corner/enneagram-childhood-stereotypes) · **Replaces:** `static/blogs/greek-statue-babies.webp` · **Why:** Search page (15 clicks, 820 impressions Jul–Oct). Neon cherubs running on glowing tiles look like a cartoon.

**Save as:** `source-assets/blogs/greek-child-statues-in-the-courtyard.png` (slug `greek-child-statues-in-the-courtyard`)

```
Editorial photograph of three small ancient Greek marble statues of children, about six to eight years old, in a quiet stone courtyard, each already running their own pattern. On the left, a girl kneels and lines up pebbles in a perfectly straight row. In the middle, a boy holds out a fig to the third child, watching her face for approval. On the right, a girl sits apart with her back against the wall, absorbed in an uncarved wax tablet on her knees. Real child proportions, not cherubs: no wings, no toys, no glow.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: worn courtyard paving and a plain stone wall, edges falling into near-black.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-child-statues-in-the-courtyard <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-child-statues-in-the-courtyard.webp static/blogs/greek-child-statues-in-the-courtyard.webp` and the same for `s-greek-child-statues-in-the-courtyard.webp`.

## 5. mbti-vs-enneagram

<a id="mbti-vs-enneagram"></a>

**Post:** [Why MBTI Failed and What to Use Instead](https://9takes.com/community/mbti-vs-enneagram) · **Replaces:** `static/blogs/the-MBTI-sucks.webp` · **Why:** Most off-brand image in the set: the slogan sign ("the MBTI sucks") does the explaining, set in bright sunlit ruins.

**Save as:** `source-assets/blogs/greek-statue-setting-aside-the-box.png` (slug `greek-statue-setting-aside-the-box`)

```
Editorial photograph of a life-sized ancient Greek marble statue of a bearded man seated on worn temple steps. With one hand he sets a small closed stone box down on the step beside him, deliberately, without looking at it. His attention has already moved to a long scroll unrolled across his knees, which shows only a faint carved branching path with no writing. Expression: quiet, focused interest, as if he finally found something useful.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: the steps and the base of two columns, background falling to near-black. No sky, no ruins on fire, no bright daylight.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statue-setting-aside-the-box <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statue-setting-aside-the-box.webp static/blogs/greek-statue-setting-aside-the-box.webp` and the same for `s-greek-statue-setting-aside-the-box.webp`.

## 6. enneagram-concepts

<a id="enneagram-concepts"></a>

**Post:** [Enneagram Concepts: The Personality Box You're Living In](https://9takes.com/enneagram-corner/enneagram-concepts) · **Replaces:** `static/blogs/enneagram-concepts.webp` · **Why:** Search page (557 impressions Jul–Oct). A light-background flat-lay of blue figurines and sketches reads as clip art and washes out to lavender when tinted.

**Save as:** `source-assets/blogs/greek-statue-open-doorway.png` (slug `greek-statue-open-doorway`)

```
Editorial photograph of a life-sized ancient Greek marble statue of a young man standing inside a narrow, plain stone enclosure, a small cell with a single doorway. He has just noticed that the heavy stone door stands open, and he looks at the gap with his head slightly turned and one hand resting on the doorframe, not yet stepping through. The emotion is recognition, quiet and a little uneasy: the box was never locked.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: rough stone walls; beyond the doorway only soft grey light and darkness, no landscape.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statue-open-doorway <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statue-open-doorway.webp static/blogs/greek-statue-open-doorway.webp` and the same for `s-greek-statue-open-doorway.webp`.

## 7. why-the-greek-vibe

<a id="why-the-greek-vibe"></a>

**Post:** [Why the Greek vibe?](https://9takes.com/community/why-the-greek-vibe) · **Replaces:** `static/blogs/neoclassical-metropolis.webp` · **Why:** Brand-story page. A watercolor modern street with a car and no statues; it explains nothing about the agora.

**Save as:** `source-assets/blogs/greek-statues-agora-asking-questions.png` (slug `greek-statues-agora-asking-questions`)

```
Editorial photograph of a small group of five life-sized ancient Greek marble statues gathered in a stone agora. An older bearded man in the center asks a question with one open hand raised, palm up. The others answer in their own ways: one leans in to reply, one rubs his chin and considers, one turns to the person beside him, and one waits with arms folded, unconvinced. Different postures, one conversation, nobody shouting.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: worn paving and a single stoa colonnade behind them, background falling into near-black.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statues-agora-asking-questions <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statues-agora-asking-questions.webp static/blogs/greek-statues-agora-asking-questions.webp` and the same for `s-greek-statues-agora-asking-questions.webp`.

## 8. enneagram-dating-guide-for-men

<a id="enneagram-dating-guide-for-men"></a>

**Post:** [Enneagram Dating Guide for Men](https://9takes.com/enneagram-corner/enneagram-dating-guide-for-men) · **Replaces:** `static/blogs/male-greek-statue-on-a-date.webp` · **Why:** The woman in the current image is photographic, a living person, not stone (412 impressions Jul–Oct).

**Save as:** `source-assets/blogs/greek-statues-date-he-listens.png` (slug `greek-statues-date-he-listens`)

```
Editorial photograph of two life-sized ancient Greek marble statues on a quiet date at a small round stone café table. She has just said something real: her eyes are lowered toward the cup in her hands and her shoulders are slightly drawn in. Across from her, he has stopped mid-gesture and lets his hands rest on the table; he leans in a little and simply listens, not fixing anything. Two simple stone cups. Restrained and intimate.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: a dim stone-walled café corner, background soft and near-black, no bokeh lights.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statues-date-he-listens <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statues-date-he-listens.webp static/blogs/greek-statues-date-he-listens.webp` and the same for `s-greek-statues-date-he-listens.webp`.

## 9. enneagram-dating-guide-for-women

<a id="enneagram-dating-guide-for-women"></a>

**Post:** [Enneagram Dating Guide for Women](https://9takes.com/enneagram-corner/enneagram-dating-guide-for-women) · **Replaces:** `static/blogs/female-greek-statue-on-a-date.webp` · **Why:** The woman in the current image is photographic, a living person, not stone.

**Save as:** `source-assets/blogs/greek-statues-date-she-decides.png` (slug `greek-statues-date-she-decides`)

```
Editorial photograph of two life-sized ancient Greek marble statues at a small round stone café table. In the foreground, a woman sits back in her chair with her chin resting on one hand, studying the man across from her with a calm, measured, slightly unconvinced look: she is deciding, not performing. He is mid-story, leaning forward with one hand raised, trying a little too hard. Two simple stone cups.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: a dim stone-walled café corner, background soft and near-black, no bokeh lights.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statues-date-she-decides <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statues-date-she-decides.webp static/blogs/greek-statues-date-she-decides.webp` and the same for `s-greek-statues-date-she-decides.webp`.

## 10. how-each-enneagram-type-unwinds

<a id="how-each-enneagram-type-unwinds"></a>

**Post:** [How Each Enneagram Type Unwinds](https://9takes.com/enneagram-corner/how-each-enneagram-type-unwinds) · **Replaces:** `static/blogs/greek-statues-at-the-beach.webp` · **Why:** Sunglasses statues on a packed candy-colored beach: a novelty AI postcard.

**Save as:** `source-assets/blogs/greek-statues-unwinding-at-the-shore.png` (slug `greek-statues-unwinding-at-the-shore`)

```
Editorial photograph of three life-sized ancient Greek marble statues unwinding in three different ways on a quiet rough-stone shore. One lies back on a flat rock with eyes closed and arms loose. One walks slowly along the waterline, hands clasped behind his back. One sits upright on a boulder reading an uncarved scroll. Nobody is looking at anyone; each has found their own way to recharge.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Overcast, cool grey light from the upper left; flat dark water and pale rocks, the horizon dissolving into charcoal haze. No sun, no sunset, no umbrellas.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statues-unwinding-at-the-shore <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statues-unwinding-at-the-shore.webp static/blogs/greek-statues-unwinding-at-the-shore.webp` and the same for `s-greek-statues-unwinding-at-the-shore.webp`.

## 11. situations-change-emotions-dont

<a id="situations-change-emotions-dont"></a>

**Post:** [The Stress Paradox: Why Emotional Patterns Outlast Situations](https://9takes.com/enneagram-corner/situations-change-emotions-dont) · **Replaces:** `static/blogs/greek-statue-stress-paradox.webp` · **Why:** A statue in a cosmic orange/blue vortex: fantasy spectacle standing in for the idea.

**Save as:** `source-assets/blogs/greek-statue-same-reaction-new-room.png` (slug `greek-statue-same-reaction-new-room`)

```
Editorial photograph of a life-sized ancient Greek marble statue of a woman in a freshly unpacked stone room: a traveling bag and a rolled sleeping mat still sit by the doorway. On the table in front of her, a small clay cup has tipped over. Her reaction is too big for the mishap: shoulders hunched, both hands pressed flat on the table, jaw tight, eyes shut. Same old reaction, new room. Restrained and sculptural, not a scream.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: plain stone walls and one doorway, background falling into near-black.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statue-same-reaction-new-room <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statue-same-reaction-new-room.webp static/blogs/greek-statue-same-reaction-new-room.webp` and the same for `s-greek-statue-same-reaction-new-room.webp`.

## 12. why-therapy-doesnt-work-the-same-for-every-type

<a id="why-therapy-doesnt-work-the-same-for-every-type"></a>

**Post:** [Why Therapy Doesn't Work the Same for Every Personality Type](https://9takes.com/enneagram-corner/why-therapy-doesnt-work-the-same-for-every-type) · **Replaces:** `static/blogs/greek-statue-therapy-couch.webp` · **Why:** A handwritten sign ("Tell me about your mother") and a red leather couch make it a joke.

**Save as:** `source-assets/blogs/greek-statues-therapy-guarded.png` (slug `greek-statues-therapy-guarded`)

```
Editorial photograph of two life-sized ancient Greek marble statues seated facing each other in two simple stone chairs in a quiet room, mid-session. The client, a man, sits with his arms crossed tightly and his body angled half away, talking but guarded. The therapist, an older woman, sits calmly with an uncarved wax tablet resting closed on her knee, leaning slightly toward him, patient and attentive. The protective habit has followed him into the room.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: a bare stone room with one small window; background falling to near-black.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statues-therapy-guarded <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statues-therapy-guarded.webp static/blogs/greek-statues-therapy-guarded.webp` and the same for `s-greek-statues-therapy-guarded.webp`.

## 13. productivity-systems-by-enneagram-type

<a id="productivity-systems-by-enneagram-type"></a>

**Post:** [Productivity Systems by Enneagram Type](https://9takes.com/how-to-guides/productivity-systems-by-enneagram-type) · **Replaces:** `static/blogs/organized-workspace-personality-types.webp` · **Why:** A 3x3 grid of modern office photos with no statue and no action.

**Save as:** `source-assets/blogs/greek-statue-arranging-own-workspace.png` (slug `greek-statue-arranging-own-workspace`)

```
Editorial photograph of a life-sized ancient Greek marble statue of a man at a wide stone work table. With one hand he pushes aside a tall, rigid stack of identical wax tablets; with the other he draws a single open scroll and a stylus toward himself, arranging the table around the one task he is actually doing. His expression is relieved focus. A few simple tools, uncluttered, all legible.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: a stone workshop wall with a few shelves, background falling into near-black.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statue-arranging-own-workspace <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statue-arranging-own-workspace.webp static/blogs/greek-statue-arranging-own-workspace.webp` and the same for `s-greek-statue-arranging-own-workspace.webp`.

## 14. incel-blackpill-radicalization-enneagram

<a id="incel-blackpill-radicalization-enneagram"></a>

**Post:** [The Blackpill Downward Spiral: How Pain Becomes Fate](https://9takes.com/pop-culture/incel-blackpill-radicalization-enneagram) · **Replaces:** `static/blogs/shattered-mirror-dark.webp` · **Why:** The figure is a photographic modern young man, not a statue, under cyan god rays.

**Save as:** `source-assets/blogs/greek-statue-by-the-broken-mirror.png` (slug `greek-statue-by-the-broken-mirror`)

```
Editorial photograph of a life-sized ancient Greek marble statue of a young man seated on worn stone stairs in an empty hall, knees drawn up, forearms resting on them, head bowed. Beside him a tall stone-framed mirror leans against the wall with a long crack through it. Within his reach on the step, unnoticed, sits a small loaf of bread wrapped in cloth that someone left for him: one small piece of counter-evidence. Quiet, heavy, not theatrical.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: plain stone stairs and wall, background falling to near-black. No god rays.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statue-by-the-broken-mirror <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statue-by-the-broken-mirror.webp static/blogs/greek-statue-by-the-broken-mirror.webp` and the same for `s-greek-statue-by-the-broken-mirror.webp`.

## 15. psychology-of-public-shame

<a id="psychology-of-public-shame"></a>

**Post:** [The Anatomy of Public Shame](https://9takes.com/pop-culture/psychology-of-public-shame) · **Replaces:** `static/blogs/psychology-of-public-shame.webp` · **Why:** Words carved into the floor (STOCKS, SCARLET LETTER, TIMELINE) and floating screens turn it into a diagram.

**Save as:** `source-assets/blogs/greek-statue-exposed-in-the-square.png` (slug `greek-statue-exposed-in-the-square`)

```
Editorial photograph of a life-sized ancient Greek marble statue of a man standing alone in the middle of a small stone square, head bowed, arms at his sides, fully exposed. Around the edges of the square, six other statues turn toward him: some point, two lean together to whisper, one covers her mouth. Nobody touches him; the distance is the punishment. Restrained expressions, no shouting.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: worn paving and plain walls, edges falling into near-black.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statue-exposed-in-the-square <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statue-exposed-in-the-square.webp static/blogs/greek-statue-exposed-in-the-square.webp` and the same for `s-greek-statue-exposed-in-the-square.webp`.

## 16. twitter-x-personality-types-toxic

<a id="twitter-x-personality-types-toxic"></a>

**Post:** [Why Is Twitter/X So Toxic?](https://9takes.com/pop-culture/twitter-x-personality-types-toxic) · **Replaces:** `static/blogs/twitter-x-toxic-arena-battle.webp` · **Why:** Twitter bird and X logos plus speech-bubble icons make it a busy infographic (381 impressions in June).

**Save as:** `source-assets/blogs/greek-statues-pile-on.png` (slug `greek-statues-pile-on`)

```
Editorial photograph of two life-sized ancient Greek marble statues arguing on a low stone platform, each pointing at the other, faces tight, one step from shouting. On the steps below them, a crowd of smaller statues has picked sides, and more of them repeat the same pointing gesture the further back they stand, so the gesture spreads through the crowd. No logos, no speech bubbles, no screens.

Dry matte weathered grey marble on every figure: fine irregular pores, worn chisel marks, a few small edge chips, a little charcoal grime in recesses. Every figure is visibly carved stone, no living skin. Solid carved stone eyes with no irises, pupils or wet highlights. Natural five-fingered hands.

One believable raking light from the upper left, cool and neutral, natural falloff, detail kept in the charcoal shadows. Ash, chalk and charcoal palette only: no warm, amber, orange or golden light anywhere, no candles or fire, no colored gels, no neon. Simple setting: plain stone steps and a dark wall, background falling into near-black.

Horizontal 3:2 article hero. Keep faces, hands and the key object inside the central 60% of the frame so a square crop still works. No text, letters, logos, symbols or watermark anywhere, including on props.
```

**After you save it:** `node scripts/blog-image-variants.mjs greek-statues-pile-on <image>`, then `node scripts/cold-light-tint.mjs static/blogs/greek-statues-pile-on.webp static/blogs/greek-statues-pile-on.webp` and the same for `s-greek-statues-pile-on.webp`.

## If one comes back off

- **Warm or golden light crept in:** "Remove all warm light. Neutral grey stone, cool raking light from the upper left, charcoal shadows. Keep everything else."
- **Too theatrical:** "Make the expressions more restrained and sculptural, closer to a real Hellenistic marble. Keep everything else."
- **A figure looks like a living person:** "Every figure must be visibly carved, weathered marble, with solid stone eyes and no skin tones. Keep the composition."
- **Looks plastic or CGI:** "More weathering: dry matte stone, visible pores and chisel marks, no gloss."
- **Text or symbols appeared on a prop:** "Remove all writing, letters and symbols. Props are blank."
