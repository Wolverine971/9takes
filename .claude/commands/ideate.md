<!-- .claude/commands/ideate.md -->

# Ideate — Scene-to-Image Workshop (direct, don't prompt)

You take a **scene** the user describes — a half-formed picture in their head — and **workshop it** into a finished, copy-pasteable image prompt (or a directed series of them). The job is to get the **idea, tone, mood, and emotion** right _before_ a single prompt is written. The output is a per-scene **ideation doc**: a locked concept + emotional truth + a directed shot (or shot set) + finished prompts with variation/kill guidance.

**The problem this fixes:** people describe a scene, then paste it straight into an image tool and pray. The result looks average because the prompt was making the decisions. The fix is the decoded iklipse engine:

> **Don't prompt AI. Direct it.** The sequence is **Idea → Reference → Art Direction → Camera → Light → Prompt.** _The prompt comes later than you think._ (`iklipse-only-ai-workflow.md`, 957 comments · `iklipse-dont-prompt-ai.md`, the account's #1 post.)

And one more, the part most people skip:

> **A pretty image with nothing happening fails.** Every strong image carries **Character + Conflict + Curiosity** — someone to care about, something at stake, something left unanswered. _"Curiosity outperforms clarity every single time."_ (`iklipse-3-step-story-formula.md`.)

This command **is** that front-half, run as a conversation.

## How this differs from `/moodboard`

- **`/moodboard`** is _person-anchored_: input is a name, you mine their biography into eras and shoot _what they saw_. It always wears the 9takes brand.
- **`/ideate`** is _concept-anchored_: input is a **scene/idea**, and you workshop what it's actually _about_ before directing it. The 9takes brand layer is **adaptive** — applied only when the scene is a 9takes asset (see §13). They share the same directing spine, light/camera/style menus, prompt skeleton, and enrichment pass.

---

## Input

**$ARGUMENTS** — a described scene, in whatever shape the user has it: a sentence (`a man on a rooftop at 3am, can't sleep`), a feeling (`the loneliness of being the only one still awake`), a fragment (`empty diner, one cup of coffee`), or a longer paragraph. Vague is fine — sharpening it is the work.

If no argument is provided, respond:

```text
Describe a scene and we'll workshop it into an image — or a series.

Give me whatever you've got: a sentence, a feeling, a fragment. We'll sharpen
what it's actually ABOUT (the idea + the emotion), decide one image or a set,
then direct the mood, light, and camera before writing a single prompt. You
approve each step.

Example: /ideate a man on a rooftop at 3am who can't sleep
```

Then wait.

## Self-sufficiency

This command is **self-sufficient** — every framework it needs (the directing spine, the idea interrogation, the story test, the reference layer, the camera/light/style menus, the prompt skeleton, the adaptive brand rules, the enrichment pass) is inlined below. The canonical evidence layer is `docs/ai-image-gen/iklipse-*.md`; the person-anchored sibling is `.claude/commands/moodboard.md`. You do not need to read those to run this.

## Pre-Approved Operations

- **Read / Glob / Grep**: all project files (to pull brand cues, reference scenes, or related source)
- **WebSearch**: only if the scene references a real place/era/event you need concrete detail on
- **Write**: `docs/ai-image-gen/scenes/<scene-slug>.md`
- **Bash**: `ls` / `mkdir -p` for the `scenes/` dir only

## Task Tracking

Create these at the start (TaskCreate/TaskUpdate):

1. Read the scene back + set brand scope (§13)
2. **Gate A** — sharpen the idea (concept + emotional truth + story test)
3. **Gate B** — lock concept + decide single image vs series (+ series shape)
4. **Gate C** — lock the vision (reference feel + mood/world/light/style)
5. **Gate D** — direct camera/POV per frame
6. Write prompt(s) + variation/kill + optional caption
7. **Enrichment pass** (§14)
8. Write the scene doc + report

This is a **workshop**, not a march. Inside any gate, if the idea wants to move, iterate _before_ advancing — pitch, push, pull, re-pitch. The gate closes only when the user says it's right.

---

# The Frameworks (inlined)

## 1. The directing spine (the order of operations)

Run in order. Steps 1–5 are the _vision_; do not write a prompt until they're locked. (Source: `iklipse-only-ai-workflow.md`, `iklipse-dont-prompt-ai.md`.)

1. **Idea** — what are you trying to _say_? (§2) The concept + the emotional truth.
2. **Reference** — what should it _feel_ like? (§10) The mood target.
3. **Art Direction** — what should it _look_ like? World, palette, styling, era.
4. **Camera** — how should it be _seen_? (§7) Angle, distance, lens, POV.
5. **Light** — the mood-maker. (§8) Direction, quality, source, time.
6. **Prompt** — tell the tool what you've _already decided_. (§11)

The prompt isn't making the decisions. It's transcribing them.

## 2. The idea interrogation (what is this image ABOUT?)

A scene is a setting; an _idea_ is what the setting means. Most described scenes are settings. Your first job is to find the idea underneath. Ask (out loud, in the workshop):

- **What are you trying to say?** Force a one-sentence concept. "A man on a rooftop at 3am" is a setting; "the specific loneliness of being the only person awake while the city sleeps" is an idea.
- **What's the emotional truth?** Name the single dominant feeling the image must land. One word, then a sharper phrase. (Not "sad" — "the calm after you've already given up.")
- **Whose moment is this?** Even a landscape implies a witness. Is there a person? Whose feeling are we inside?
- **What's the one detail that would make it _true_?** The tell that proves it's a real moment, not a stock image (the cold coffee, the phone face-down, the one lit window across the street).

Pitch the user **2–3 sharper readings** of their scene — different ideas the same setting could carry — and let them pick or steer. This is where a flat scene becomes a strong one.

## 3. The story test — Character + Conflict + Curiosity (every image must pass)

A pretty image with nothing happening fails. Run every scene through the trio (`iklipse-3-step-story-formula.md`):

- **Character** — someone (or something) to care about. The viewer should ask _"who is this?"_ Not just a person — a person who feels like they matter to this frame.
- **Conflict** — something wrong, changing, or at stake. Doesn't need action: a difficult decision, a problem, a risk, an emotional struggle, a mystery. The viewer should ask _"what's going on here?"_
- **Curiosity** — something left unanswered. Show enough to understand the scene; hide enough to make them wonder. The viewer should ask _"what happened before / what happens next?"_

**The gut-check (do this before locking any concept):**

> Who is the character? · What's at stake? · What question does the frame plant? · What's left unanswered?

If you can't answer those, the scene has no story yet — push it until you can. _Curiosity outperforms clarity._ For a **series**, the trio runs across the set: the conflict can build, and the curiosity is what pulls the viewer from frame to frame.

## 4. The emotional-truth lock (the thing the whole image serves)

Before art direction, lock **one** emotional truth in a single phrase. Everything downstream — light, angle, palette, the one detail — gets chosen because it _serves that feeling_. If a choice doesn't serve it, cut the choice. ("Get the emotion right" means: pick the emotion first, then let it veto everything else.) For a series, lock the **arc** of feeling (e.g. _numbness → a crack → release_) so the set moves instead of repeating.

## 5. Single image vs series (decide early, it changes everything)

Ask, at Gate B: **is this one frame, or a set?** A series is right when the idea has _movement_ — a before/after, an escalation, a turn, or multiple facets of one feeling. Pick the **series shape**:

| Shape                          | What it is                                                | Best for                                                                |
| ------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Narrative sequence**         | beats of one event in time (before → during → after)      | a moment that _turns_; tension that resolves                            |
| **Emotional arc**              | same subject/scene, the feeling shifting frame to frame   | interiority; a state changing (numb → break → calm)                     |
| **Variations on a theme**      | one concept, different settings/subjects, one shared mood | a feeling that shows up everywhere (e.g. "3am" across lives)            |
| **Nine reads (9takes-native)** | one situation, nine type-reactions, identical frame       | the give-first product mechanic as images (ties to `/carousel` gallery) |
| **Wordless gallery**           | single-emotion scenes, "which felt most real?"            | emotional resonance + a pick-one payoff (`iklipse-ai-and-emotions.md`)  |

A series needs a **shared signature** (the constant) and a **per-frame variable** (§13, §12-style) so it reads as one deliberate set, not N unrelated images.

## 6. POV lenses (optional — pick when a scene has a clear vantage)

Not every scene is a POV shot, but the strongest emotional images often are. If the scene implies a viewpoint, pick a lens:

| #   | Lens                          | What it shows                                     | Feels like                                      |
| --- | ----------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| 1   | **Over-the-shoulder**         | you stand behind them, seeing what they see       | immersion, complicity                           |
| 2   | **Their-eyes (first person)** | the frame _is_ their gaze — no person in shot     | you become them                                 |
| 3   | **Memory still**              | a scene graded as memory — soft, hazy, time-faded | nostalgia, the wound                            |
| 4   | **Inner-world / mindscape**   | a surreal externalization of an inner state       | the unconscious made visible                    |
| 5   | **The witness**               | a small figure inside a large environment         | solitude, scale                                 |
| 6   | **Straight scene**            | a directed third-person frame of the moment       | classic; the default when no vantage is implied |

## 7. Camera — angle → emotion (the cheat sheet)

From `iklipse-camera-angle-cheat-sheet.md` (the account's most-saved format). Pick the angle that _accentuates the feeling_ — never default to eye level by accident.

| Angle                 | Creates                             | Use when                                   |
| --------------------- | ----------------------------------- | ------------------------------------------ |
| **Eye level**         | trust, relatability, honesty        | you want connection / an unguarded read    |
| **Low angle**         | authority, dominance, power         | the subject should loom                    |
| **High angle**        | vulnerability, isolation, smallness | they're exposed, defeated, small           |
| **Bird's-eye / top**  | scale, geometry, overwhelm          | the environment dwarfs them; pattern shots |
| **Dutch tilt**        | tension, unease, instability        | something is wrong / psychological         |
| **Over-the-shoulder** | immersion, presence                 | see what they see                          |

**Distance:** extreme close-up (a single feature = obsession/intimacy) · close-up (emotion) · medium (action) · wide (context, loneliness) · extreme wide (scale, the witness).

**Lens (state it):** `24–35mm` wide = environmental, slight distortion, _world_ · `50mm` = natural, honest, the human baseline · `85mm` = compressed, flattering, intimate separation · `100mm macro` = obsessive detail · `135mm+` telephoto = voyeur compression, watching from outside.

**Maxim:** Camera = 50% of the result. Same subject ≠ same result.

## 8. Light — control the mood (lighting defines everything)

Specify **direction + quality + source + time**.

- **Split** (half lit, half dark) → duality, a hidden self.
- **Rembrandt** (cheek triangle) → classical depth, dignity.
- **Chiaroscuro / low-key** → secrecy, intensity, the wound.
- **Spotlight isolation** → solitude, scrutiny.
- **Backlight / rim** → mystery, separation from the world.
- **Neon side glow** → modern, charged, unstable.
- **High-key / bright** → exposure, truth (reserve for a peak).
- **Practical light** (lamp, screen glow, candle, single bulb) → intimacy, realism, the private room.
- **Time of day:** pre-dawn (discipline) · golden hour (memory) · harsh noon (exposure) · blue hour (melancholy) · 3am lamp/screen (insomnia, solitude).

## 9. Style / medium — choose one visual identity

The image (or whole set) shares **one** identity so it reads deliberate. Menu (the _medium/look_, not a render recipe): documentary photograph · cinematic film still · faded old photograph · editorial · minimalist · noir · vérité · dreamlike/memory.

**Default to real over rendered:** describe one believable frame in plain, sensory language. **No** `Unreal Engine / octane / 8k / hyper realistic / make-it-epic` tails — those produce the generic glossy AI look iklipse mocks. Keep only: the moment, camera, light, palette, format.

## 10. Reference — "what should it feel like" (and the one-question test)

Before art-directing, name the **feel target** in words: a comparable film look, a photographer's mood, a lighting reference, a palette. Good references have: _clear composition · strong lighting · consistent mood · intentional camera angle · recognizable style_ (`iklipse-better-ai-results.md`). You're not pasting a reference image — you're stating the mood the prompt should aim at, in language.

**The Reference Test, applied to the concept:** before locking a direction, ask — _"Would I save this image?"_ If the described frame wouldn't earn a save, it's not strong enough yet. Push it.

## 11. The prompt skeleton (only after Gates A–D are locked)

**Default target: ChatGPT (GPT Image).** It follows a **labeled production brief** in natural language better than a keyword string — describe **one believable frame** as if briefing a photographer who has to shoot it.

```
Photorealistic [POV / framing].
Scene: [where + when + the world detail].
Subject: [who is in it / whose eyes, doing or seeing what].
Details: [specific real props, textures, the one true detail; crowds = "a blurred, undetailed mass," not many faces].
Camera: [angle + distance + lens-mm].
Light: [direction + quality + the single dominant source + time of day].
Color & finish: [the palette; where any accent lives; photorealistic with real imperfections + film grain].
Constraints: [anti-yellow-tint for cold shots; shadow-detail for dark shots; no on-image text].
Format: [aspect ratio in words, e.g. square 1:1 (1024×1024) or 4:5 portrait].
```

**Emit every prompt inside a fenced code block (```), so it copy-pastes straight into the tool.** No `> ` blockquotes for prompts.

**ChatGPT-specific rules (baked in, learned the hard way):**

- **Beat the yellow-tint bias.** GPT Image pushes a global warm cast that flattens cold scenes. On any cold/neutral shot add _"do NOT apply a global warm/yellow cast; keep shadows cool grey-blue."_ A genuinely warm scene is the exception — say amber-as-dominant is correct there.
- **Beat "too dark."** On low-key shots name the single light source and add _"keep shadow detail visible, not crushed black."_
- **Beat "too many subjects."** Crowds = a _blurred, undetailed mass_; never request many distinct rendered faces.
- **Photorealistic + real texture.** Open with "Photorealistic"; request real imperfections (skin pores, fabric wear, dust, film grain) to fight the glossy AI look.
- **Format in words, not flags.** No `--ar`/`--style` for ChatGPT; end with the ratio spelled out.

**Other targets (switch only if the user asks):**

- **Midjourney** → keyword + params string ending `--ar W:H`; more stylized/glossy, less literal.
- **`gemini-imagegen` (Nano Banana Pro)** → for any **text-in-image** panel: give it background, the exact on-image text, and positions. (Captions over a photo set are overlaid _after_ generation — never ask ChatGPT to render them in-image.)

**For a series:** every prompt must visibly differ from the others on **at least two** of {POV/framing, angle, distance, lens, light, setting} — unless the shape is deliberately identical-frame (Nine reads / wordless gallery), where only the named subject-feeling changes and everything else is locked.

## 12. Variation + kill guidance (per frame)

For each frame, emit the locked prompt **plus a variation axis** — the one knob to spin for 2–3 alternates ("vary the angle: also try low and bird's-eye"; "vary the light: also try split and backlit"). Then the **kill rule**: keep only the frame where the feeling is unmistakable and the composition is strong; discard the rest. AI gives quantity; you supply quality. _Refine conversationally in the tool — regenerate; don't overload one prompt._ Generate the strongest frame first, approve it, then **upload it as a style reference** for the rest so grain/palette/finish stay consistent across a series.

## 13. The brand layer — ADAPTIVE (set it at Step 0)

The directing method above is universal. The **9takes brand constraints** apply **only when the scene is a 9takes asset** (a carousel slide, a personality-analysis image, social content). Decide at Step 0 by asking — or infer from the scene/source. Two modes:

**Brand: ON (9takes asset)** — apply all of:

- **Amber (Streetlamp V5)** accent present in every frame; dark text on amber fills. **Never red/teal/rose** for primary (teal only as a `data-*` accent). [See `moody-portrait-prompt.md` for the canonical amber-rim look.]
- **Real scenes, no statue overlay.** The subject is the moment, not a stylized stand-in.
- **Anonymity** if a real public figure is implied: _"an anonymous [person]"_, face turned/distant/obscured — beats likeness drift + celebrity refusals.
- **Fixed chrome** if it becomes a deck panel: `9takes` top-left · theme tag top-right · `9takes.com` bottom-left.
- **1:1 square** (or 4:5), composition top-weighted to survive the feed crop.
- For a series → carry the moodboard shared-signature discipline (amber accent + consistent finish + one dominant light per frame).

**Brand: OFF (general creative)** — drop amber/chrome/anonymity. Keep everything that makes an image good: the idea, the story test, real-over-rendered, the camera/light/style discipline, the tool guardrails. The user supplies any palette; you don't force one.

If unsure which mode, **ask one line at Step 0**: _"Is this a 9takes asset (amber + brand rules on), or a general creative image?"_

## 14. The enrichment pass (always run after the first prompts are written)

The first draft gets the moment, camera, and light right but is almost always **under-specified on concrete sensory detail**. After the prompts are written, do a **second pass over every one** and pull in 2–4 more real details — _not_ a rewrite; same composition, just more specific. For each prompt ask:

- **What real, specific detail am I missing?** Named props, textures, period detail, one human tell (chipped polish, a half-finished cigarette, a phone face-down, breath fogging the glass). Specific beats generic every time.
- **Where will the tool fail this shot?** Add the matching §11 guardrail (anti-yellow on cold, shadow-detail on dark, blurred-mass on crowds).
- **Is the world detail unmistakably _this_ scene?** So in a series two frames never blur together.
- **Does one subtle tell carry the feeling?** One precise detail often says more than three adjectives.

Then re-confirm the ≥2-axis difference across every pair (for a varied series) still holds.

---

# Workshop (step-wise, with gates)

## Step 0 — Read the scene back + set brand scope

Reflect the scene in your own words so the user hears how it landed, then **set the brand mode (§13)** — ask the one-line question if it's not obvious. Pull any in-repo cues if the scene references a real place/era. Do **not** invent facts about real events; WebSearch only if you need concrete detail.

## Step 1 — Gate A: Sharpen the idea

Using §2 + §3 + §4, pitch (≤1 screen):

- **2–3 sharper readings** of their scene — different _ideas_ the same setting could carry, each one line.
- For the lead reading: the **emotional truth** (one phrase) + the **story-test answers** (character / conflict / curiosity).

Then **stop and ask**: _"Which idea are we chasing — or should we bend one?"_ Iterate here until the idea is sharp. Don't proceed on a flat concept.

## Step 2 — Gate B: Lock concept + single vs series

Restate the locked **concept + emotional truth** in two lines. Then decide **one image or a series** (§5). If a series: name the **shape**, the **per-frame variable**, the **shared signature**, and the **count** (default 3–6). **Stop and ask** to confirm before directing.

## Step 3 — Gate C: Lock the vision

For the single frame (or for the set + each frame), lock the art-direction layer — still no prompt:

- **Reference feel** (§10) — the mood target in words; run the "would I save this?" test.
- **Mood · World/palette · Time · Styling/props · Light · Style/finish** (§8, §9).
- For a series: the **shared signature** (the constant) + how each frame's palette **varies**.

**Stop and ask**: _"Approve the vision, or adjust?"_

## Step 4 — Gate D: Direct camera/POV per frame

For each frame, write the direction (§6, §7):

> **Frame N — [name]** · POV/framing [lens] · Camera [angle + distance + lens-mm] · _accentuates:_ [the feeling].

Confirm: (a) angle/light/lens each chosen to serve the emotional truth; (b) for a varied series, ≥2 of {POV, angle, distance, lens, light, setting} differ across every pair. **Stop and ask** before writing prompts.

## Step 5 — Write story + (optional) caption + prompt per frame

For each frame write:

1. **Why this frame** — 1–3 sentences of intent tied to the emotional truth.
2. **Overlay caption** _(only if wanted / if brand-ON deck panel)_ — on-image text, added after generation; ground it in something real, never invented.
3. **Prompt** — the full §11 production brief, **inside a fenced code block**, + variation axis + kill rule.

Mark which frame is the **peak** (the one bright/high-key frame if brand-ON, or the emotional climax of a series).

## Step 6 — Enrichment pass (do NOT skip)

Run §14 over every prompt: pull in 2–4 more real, specific details per prompt + the matching tool guardrail. Same composition, just more specific. Re-confirm the ≥2-axis difference (for a varied series) still holds. This pass is what makes the set feel directed instead of described.

## Step 7 — Write the scene doc + report

Write `docs/ai-image-gen/scenes/<scene-slug>.md` (template below) using the **enriched** prompts. Then report, and offer the next move: generate the first frame, approve it, upload as a style reference for the rest. If it became a 9takes series that could be a deck, note `/carousel` can consume it.

---

# Output Template

````markdown
<!-- docs/ai-image-gen/scenes/<scene-slug>.md -->

# <Scene title> — 9takes Ideation

> Brand: <ON (9takes asset) / OFF (general creative)> · Output: <single image / series of N (shape)>
> Target tool: <ChatGPT GPT Image / Midjourney / gemini-imagegen>
> Status: VISION LOCKED <date>

## The idea (what this says)

<the one-sentence concept — what the image is ABOUT, not just the setting>

## Emotional truth

<the single dominant feeling, one phrase — the thing every choice serves. For a series: the arc.>

## Story test

- **Character:** <who we care about>
- **Conflict:** <what's wrong / changing / at stake>
- **Curiosity:** <what's left unanswered>

## Reference feel

<the mood target in words — a look/palette/lighting reference. Passes "would I save this?">

## Vision

<single frame: Mood · World/palette · Time · Styling/props · Light · Style/finish>
<series: the shared signature (constant) + a per-frame palette table>

## Frame list

| #   | Frame  | POV/framing | Camera (angle · dist · lens) | Accentuates   | Peak?   |
| --- | ------ | ----------- | ---------------------------- | ------------- | ------- |
| 1   | <name> | <lens>      | <...>                        | <the feeling> | <✓ / —> |
| ... |

## Frames (story + caption + prompt)

### Frame 1 — <name>

**Why this frame:** <1–3 sentences tied to the emotional truth>
**Overlay caption** (if any, add after generation): <real, grounded text — bottom-right>
**Prompt** — wrap in a fenced ``` code block (copy-pasteable), built on the §11 brief:

    Photorealistic <POV / framing>.
    Scene: <where + when + world detail>.
    Subject: <who / whose eyes, doing or seeing what>.
    Details: <named props, textures, the one true detail; crowds = blurred mass>.
    Camera: <angle + distance + lens-mm>.
    Light: <direction + quality + single dominant source + time of day>.
    Color & finish: <palette; any accent; photorealistic, real imperfections, film grain>.
    Constraints: <anti-yellow-tint if cold; shadow-detail if dark; no on-image text>.
    Format: <square 1:1 (1024×1024) / 4:5 portrait / etc.>.

_Vary: <the one axis to spin>._ · _Kill rule: <keep only the frame where ...>._ · _Refine conversationally (regenerate; don't overload)._

[...one block per frame...]

## Hand-off

Generate Frame <peak or 1> first, approve it, then upload it as a style reference for the rest to lock the grain/palette/finish across the set.
<if a 9takes series that could be a deck: "Feed to /carousel — it can consume these directed frames as image slides.">
````

Then report to the user:

```text
## Scene workshopped: <title>

**File:** docs/ai-image-gen/scenes/<slug>.md
**Idea:** <one line>
**Emotion:** <the locked feeling>
**Output:** <single image / series of N (shape)> · brand <ON/OFF>
**Next:** generate Frame 1 in <tool>, approve, then use it as the style reference for the rest.
```

---

# Go Deeper

Self-sufficient by design. Distilled from:

- `docs/ai-image-gen/iklipse-only-ai-workflow.md` — "the prompt comes last" directing sequence (the spine of §1).
- `docs/ai-image-gen/iklipse-3-step-story-formula.md` — Character + Conflict + Curiosity (§3).
- `docs/ai-image-gen/iklipse-dont-prompt-ai.md` — "direct, don't prompt"; camera/light as the result.
- `docs/ai-image-gen/iklipse-camera-angle-cheat-sheet.md` — the angle→emotion table (§7).
- `docs/ai-image-gen/iklipse-better-ai-results.md` — references as the foundation + the "would I save this?" test (§10).
- `docs/ai-image-gen/iklipse-ai-and-emotions.md` — the wordless-gallery / pick-one series shape (§5).
- `docs/ai-image-gen/moody-portrait-prompt.md` — the canonical amber-rim brand look (§13).
- `.claude/commands/moodboard.md` — the person-anchored sibling pipeline.
- `gemini-imagegen` skill — text-in-image panels.
