<!-- .claude/commands/moodboard.md -->

# Moodboard — 9takes Per-Person Art-Direction & POV Pipeline

You lock the **visual vision** for a person _before_ anyone writes an image prompt. The output is a per-person **moodboard doc**: a locked vision palette + a ranked set of **POV moments** (what this person _saw_) + a directed **shot list** (camera, light, style per shot) + finished image prompts with variation/kill guidance. This doc then feeds `/carousel` (and any other 9takes image gen) so the visuals stop being flat.

**The problem this fixes:** `/carousel` is copy-first. It writes the teaching beats, then bolts on image prompts as an afterthought — every photo ends up `type N greek statue ... 50mm ... warm amber`, identical framing, generic. That violates the single most important rule in the decoded iklipse engine:

> **Don't prompt AI. Direct it.** The sequence is **Idea → Reference → Art Direction → Camera → Light → Prompt.** _The prompt comes later than you think._ (`iklipse-only-ai-workflow.md`, 957 comments · `iklipse-dont-prompt-ai.md`, the account's #1 post at 1,476♥.)

This command **is** the missing Art-Direction front-half. It runs _upstream_ of `/carousel`.

## What makes this 9takes-native (the POV engine)

The iklipse decks teach how to direct a generic subject. 9takes adds the part they don't have: **perspective.** We don't shoot portraits _of_ a person. We shoot **what the person sees** — the moments at the back of their memory, the world from behind their eyes, the inner weather of their head. One situation, seen their way. That's the product thesis ("see the emotions behind every take") rendered as an image.

So every moodboard answers, for each shot: _Whose eyes are we behind, and what are they looking at?_

---

## Input

**$ARGUMENTS** — a person's name (`Robert Greene`, `Lady Gaga`), optionally with a focus keyword (`childhood`, `the wound`, `at work`).

If no argument is provided, respond:

```text
Ready to art-direct a 9takes moodboard. Give me a person.

I'll pitch you a locked visual vision (mood / world / light / style tied to their
Enneagram), then we'll mine specific moments from their life and shoot them from
THEIR perspective — what they saw, not a portrait of them. Step by step, you approve
each stage.

Example: /moodboard Robert Greene
```

Then wait.

## Self-sufficiency

This command is **self-sufficient** — every framework it needs (the directing process, the camera→emotion cheat sheet, the lighting and style menus, the per-type anchors, the brand rules, the prompt skeletons) is inlined below. The canonical evidence layer is `docs/ai-image-gen/iklipse-*.md`; the deck engine it feeds is `.claude/commands/carousel.md`. You do not need to read those to run this.

## Pre-Approved Operations

- **Read / Glob / Grep**: all project files (to mine source on the person)
- **WebSearch**: only if the person's biography is thin in-repo and you need real moments
- **Write**: `docs/ai-image-gen/moodboards/<person-slug>-moodboard.md`
- **Bash**: `ls` / `mkdir -p` for the moodboards dir only

## Task Tracking

Create these tasks at the start (TaskCreate/TaskUpdate):

1. Resolve source + mine biography
2. **Gate A** — pitch + lock the Vision palette (eras + signature + per-person accent)
3. **Gate B** — pitch POV moments, user picks the strongest
4. **Gate C** — direct camera/light/style per chosen shot
5. Write prompts + variation/kill guidance
6. **Enrichment pass** — composition-first, then props (§13)
7. **Recognition litmus pass** — would the subject recognize the moment? (§14)
8. **Mirror shot** — the empty frame + the question layer (§15)
9. Write moodboard doc + report

---

# The Frameworks (inlined)

## 1. The directing process (the spine)

Run these in order. Steps 1–4 are the _vision_; do not write a single prompt until they're locked. (Source: `iklipse-dont-prompt-ai.md` — "Camera = 50% of the result," "Same subject ≠ Same result," "Style = Identity.")

1. **Lock the Vision.** Mood · World · Setting · Time/era · Styling.
2. **Direct the Camera.** Angle · distance · lens — chosen to _accentuate_ the shot's point.
3. **Control the Light.** Lighting defines the mood. Direction + quality + source.
4. **Choose the Style.** The visual identity the whole set shares.
5. **Generate Variations.** Per shot: push angle / light / style; one variation isn't direction.
6. **Kill Weak Outputs.** Keep only strong composition, clear feeling, non-generic. AI gives quantity; you supply quality.

## 2. The POV engine (the heart — pick a lens per shot)

Every shot is one of these five **perspective lenses**. Default to lenses 1–4 over the straight portrait; the portrait (lens 5) is the exception, not the rule.

| #   | POV lens                      | What it shows                                                                                                                                       | Feels like                    |
| --- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 1   | **Over-the-shoulder**         | You stand _behind_ them, seeing what they see (their desk, the room, the page).                                                                     | Immersion, complicity         |
| 2   | **Their-eyes (first person)** | The frame _is_ their gaze — no person in shot, just what's in front of them (the notecard under a hand, the closed door, the crowd from the stage). | You become them               |
| 3   | **Memory still**              | A scene from their past, graded _as a memory_ — softer, hazy, time-faded, dreamlike.                                                                | Nostalgia, the wound          |
| 4   | **Inner-world / mindscape**   | A surreal externalization of what's happening inside (multiple selves, a fortress, a map of power, drowning).                                       | The unconscious made visible  |
| 5   | **The witness**               | Them, small, inside a large environment that _is_ their world (lone figure in a vast library; a cushion in an empty room).                          | Solitude, scale, who they are |

The straight eye-level portrait is the thing we're trying to escape. If a shot is just "them looking at camera," redirect it to a POV lens or kill it.

## 3. Moment mining (where POV moments come from)

Pull from, in rough priority of visual charge:

- **The defining wound** (the thing they're still answering — the father, the humiliation, the loss).
- **The origin** (childhood scene, the moment the obsession started).
- **The signature ritual** (the daily thing only they do — the notecards, the meditation, the rehearsal).
- **The arena** (where their work actually happens — study, stage, lab, kitchen, ring).
- **The turn** (the breakdown/breakthrough — stroke, firing, betrayal, the hit).
- **The relationship** (the one or two people who saw the private version).
- **The persona_title + core fear** from their 9takes analysis — the abstract claim that needs a concrete image.

**Rank candidates by:** visual specificity (can I see one frame?) · emotional charge · non-genericness (could _only_ this person own it?) · reveals-their-perspective (does it put me behind their eyes?). Kill anything that's a stock "famous person doing famous thing."

## 4. Camera direction — angle → emotion (the cheat sheet)

Re-skinned from `iklipse-camera-angle-cheat-sheet.md` (the account's most-saved format). Pick the angle that _accentuates the shot's feeling_ — never default to eye level.

| Angle                 | Creates                             | Use when                                      |
| --------------------- | ----------------------------------- | --------------------------------------------- |
| **Eye level**         | trust, relatability, honesty        | you want connection / an unguarded read       |
| **Low angle**         | authority, dominance, power         | the subject should loom; a hero/master beat   |
| **High angle**        | vulnerability, isolation, smallness | they're exposed, defeated, a child            |
| **Bird's-eye / top**  | scale, geometry, overwhelm          | the environment dwarfs them; pattern shots    |
| **Dutch tilt**        | tension, unease, instability        | something is wrong / psychological / unstable |
| **Over-the-shoulder** | immersion, perspective, presence    | **the POV workhorse** — see what they see     |

**Distance:** extreme close-up (a single feature — eye, hand, mouth = obsession/intimacy) · close-up (emotion) · medium (action) · wide (context, loneliness) · extreme wide (the witness, scale).

**Lens (state it):** `24–35mm` wide = environmental, slight distortion, _world_ · `50mm` = natural, honest, the human baseline · `85mm` = compressed, flattering, intimate portrait separation · `100mm macro` = obsessive detail · `telephoto 135mm+` = voyeur compression, watching from outside.

**Maxim:** Camera = 50% of the result. Same subject ≠ same result.

## 5. Light — control the mood

Lighting defines everything (`iklipse-dont-prompt-ai.md`). Specify **direction + quality + source**.

- **Split lighting** (half face lit, half dark) → duality, a hidden self.
- **Rembrandt** (cheek triangle) → classical depth, dignity.
- **Chiaroscuro / low-key** → secrecy, intensity, the wound.
- **Spotlight isolation** → solitude, scrutiny, the lone figure.
- **Backlight / rim** → mystery, separation from the world.
- **Neon side glow** → modern, charged, unstable.
- **High-key / bright** → exposure, truth — reserve for the **one peak slide**.
- **Practical light** (desk lamp, screen glow, candle, single bulb) → intimacy, realism, the private room.
- **Time of day** carries mood: pre-dawn (discipline) · golden hour (memory) · harsh noon (exposure) · blue hour (melancholy) · candlelight/lamp (solitude).

## 6. Style — choose the visual identity

The whole set shares **one** identity so it reads as a deliberate series. Menu (as the _medium/look_, not a render recipe): documentary photograph · film still · faded old photograph · editorial · minimalist · noir · vérité.

**9takes approach (the through-line):** render **real scenes — a moment in time the person actually saw, did, or lived through.** Real people, real rooms, real era detail. Do **NOT** overlay the Greek-statue motif or any stylized marble stand-in — the subject is the _moment_, not a sculpture of the person. (The old Greek-statue style is a separate legacy look; it is **off** for this pipeline.) The set coheres through a shared **palette + lighting mood** (e.g. moody amber, single warm source) and the consistent POV treatment — _not_ a repeated subject. Camera, light, and whose-eyes-we're-behind are the variables per shot.

## 7. Per-type vision anchors (Enneagram → mood / world / light)

Start the Vision pitch from the person's type, then bend it to _their_ specifics.

| Type                | Mood                  | World / palette          | Signature light            | Default arena                        |
| ------------------- | --------------------- | ------------------------ | -------------------------- | ------------------------------------ |
| 1 The Reformer      | controlled, exacting  | clean lines, cool order  | even, hard-edged           | the corrected desk, the workshop     |
| 2 The Helper        | warm, yearning        | soft amber, domestic     | wraparound soft            | the kitchen, the doorway, an embrace |
| 3 The Achiever      | polished, charged     | spotlit stage, glass     | bright key + hard shadow   | the podium, the mirror, the win      |
| 4 The Individualist | melancholy, romantic  | deep blues, candle, rain | low-key, single source     | the reflection, the studio at night  |
| 5 The Investigator  | still, cerebral, cold | books, paper, dim amber  | desk-lamp pool in darkness | the study, the archive, behind glass |
| 6 The Loyalist      | vigilant, tense       | corridors, thresholds    | hard side, long shadows    | the watch-post, the doorway scanned  |
| 7 The Enthusiast    | kinetic, bright       | saturated, motion blur   | high-key, color            | mid-leap, the crowd, the open road   |
| 8 The Challenger    | heavy, commanding     | concrete, low horizon    | dramatic low-key, rim      | the threshold held, the ring         |
| 9 The Peacemaker    | serene, diffuse       | dawn haze, pastel        | soft, sourceless           | the still room, the open field       |

## 8. Brand non-negotiables

- **Amber (Streetlamp V5)** is the accent; dark text on amber fills. **Never red/teal/rose** for primary.
- **Per-person accent (lock it at Gate A):** alongside amber, pick ONE secondary color that is _theirs_ (Chappell = hot pink, Lana/Type 4 = purple). The eventual deck uses it for the cover vibe, eye-bar, and `TYPE N` label. Amber stays primary; the person accent never takes over. Base = black.
- **Real scenes, no statue overlay** (per §6). The subject is the moment the person lived, not a stylized stand-in.
- **Fixed chrome** on any slide that becomes a deck panel: `9takes` top-left · theme tag top-right · `9takes.com` bottom-left.
- **Exactly one bright/high-key slide** per eventual deck — the peak. Everything else is moody.
- **1:1 square**, composition top-weighted — the eventual story deck is **4:5 vertical**, so POV shots generate at 1:1 with the meaning in the upper 4/5 of the frame, then crop to 4:5. (A cover background, if requested, generates at 4:5 directly.)
- **Real over rendered:** describe one believable frame in plain, sensory language. No 3D-render or "make it epic" tails — those produce the generic glossy AI look iklipse mocks.

## 9. Prompt skeletons (only after Gates A–C are locked)

**Photo / POV shots → ChatGPT (GPT Image).** We generate in **ChatGPT**, not Midjourney. ChatGPT wants a **labeled production brief** in natural language, not a keyword string — it follows detailed instructions better than MJ, it just renders flatter (fine for our real-photo look). Describe **one believable frame** of the real moment, as if briefing a photographer who has to shoot it. Build from the locked direction in this skimmable order:

```
Photorealistic [POV LENS framing].
Scene: [where + when + the world detail from the locked era-palette].
Subject: [who is in it / whose eyes, doing or seeing what — always "an anonymous [person]" with NO face shown: turned, distant, obscured, hidden by hair/hands, or out of frame].
Details: [specific real props, textures, era detail; for crowds: "a blurred, undetailed mass," not many faces. If the moment is a real public event, the accurate wardrobe/setting so fans recognize the POV].
Camera: [angle + distance + lens-mm].
Light: [direction + quality + the single dominant source + time of day].
Color & finish: [the era palette; where the amber accent lives; photorealistic with real imperfections + film grain].
Constraints: [no visible face / no facial reflection; anti-yellow-tint line for cold shots; shadow-detail-retained for dark shots; a hard negative list against wrong/invented wardrobe; no on-image text; anonymous, no specific celebrity].
Format: square 1:1 (1024×1024).
```

**Emit every prompt inside a fenced code block (```), so the user can copy-paste it straight into ChatGPT.** No `> ` blockquotes for prompts.

**ChatGPT-specific rules (bake these into the prompt, learned the hard way):**

- **Beat the yellow-tint bias.** GPT Image pushes a global warm cast — which would flatten cold eras into the same gold as warm ones and kill the era contrast. Keep amber as a **local light source only** (window shaft, lamp, bar glow, sign); on every cold shot add an explicit _"do NOT apply a global warm/yellow cast; keep shadows cool grey-blue."_ (A genuinely warm shot — e.g. a vanity-bulb close-up — is the exception: there, amber-as-dominant is correct; say so.)
- **Beat "too dark."** On low-key shots, name the single light source and add _"keep shadow detail visible, not crushed black."_
- **Beat "too many subjects."** Crowds = a _blurred, undetailed mass_; never ask for many distinct rendered faces (GPT's weak spot).
- **Never render the subject's face (hard rule).** AI cannot land a real person's likeness — a rendered face reads as "off" or as a different person, and invites refusals. So **no shot shows the face.** Design every frame so the face is turned away, distant, out of frame, or hidden (by hair, hands, a mask, shadow). Carry identity through **tells** instead: hair, body, wardrobe, setting. Mirrors are dangerous — a reflection will render a face; if you use one, explicitly forbid the facial reflection. If a shot can only work with a clear face, redesign the shot. Never name the person, either.
- **POV recognition via accurate wardrobe + setting.** When a shot is from a real person's POV, fans should be able to recognize _whose_ eyes they're behind — and accurate wardrobe/setting is how. If the moment maps to a real, dateable public event (a specific tour, festival, performance, ceremony), **research the actual costume and venue and match them**; the recognizable outfit + crowd/place is the POV cue. **Never invent wardrobe** (no "gold arm" she never wore). Add a hard **negative list** ruling out the wrong/invented items so GPT doesn't substitute them.
- **Photorealistic + real texture.** Open with "Photorealistic" and request real imperfections (skin pores, fabric wear, dust, film grain) to fight the glossy AI look.
- **Format in words, not flags.** No `--ar`/`--style`; end with _"square 1:1 (1024×1024)."_

**Hard DON'Ts (unchanged):**

- **No Greek statue / marble / sculpture** — render the real person and real scene.
- **No render or "make-it-epic" tails** — no `Unreal Engine`, `Cinematic`, `Global Illumination`, `hyper realistic`, `octane`, `8k`, etc. They produce the generic glossy look. Keep only: the moment, camera, light, era, palette, format.
- Camera, lens, angle, light, and POV **stay** — they're the direction, not decoration.

Every prompt must visibly differ from the others in the set on **at least two** of {POV lens, angle, distance, lens, light, setting}. If two prompts share all of those, one is redundant — kill or redirect it.

**Text-bearing panels** (hook, formula peak, badges, CTA) → `gemini-imagegen` (Nano Banana Pro renders text-in-image cleanly): give it background (amber, or inverted-light for the peak), the exact on-slide text, and the chrome positions. Or mark "Canva (type+shape)." (Photo-set captions are overlaid **after** generation — never ask ChatGPT to render them in-image.)

**Consistency workflow tip (put this in the doc's hand-off):** generate the first shot, approve it, then **upload that frame as a style reference** for the rest so the grain/amber/finish stay consistent. Refine conversationally in ChatGPT — regenerate, don't overload one prompt.

## 10. Variation + kill guidance (per shot)

For each shot, emit the locked prompt **plus a variation axis** — the one knob to spin for 2–3 alternates (e.g. "vary the angle: also try low-angle and bird's-eye" or "vary the light: also try split and backlit"). Then the **kill rule**: keep only the frame where the feeling is unmistakable and the composition is strong; discard the rest. One variation isn't direction; generate, then cut.

## 11. The story layer — why each shot + the overlay caption

A great image still has to _say something_. Every shot carries two **written** layers beside its prompt:

- **The story (why this shot):** 1–3 sentences on what we're trying to say and how it ties to _their perspective_ — why this moment reveals who they are. This is the editorial intent; it seeds the caption and the eventual deck copy.
- **The overlay caption:** the actual on-image text the user drops onto the generated frame (default **bottom-right corner**, small). 2–4 short lines. **Not part of the prompt** — added after generation. Ground every caption in a **real, citable detail** (date, place, number, quote); never invent biography. Aim for the turn where a hard fact lands an emotional truth — e.g. _"The man who wrote the book on power still can't make his own breakfast."_

Mine extra real details for captions from the same sources as the moments (tidbits, the analysis, the FAQs); the more specific the fact, the stronger the caption. If a moment has no citable fact behind it, it's a weak caption candidate — strengthen or cut.

## 12. Eras, per-shot palettes & the shared signature (the core model)

A person is **not one mood across their whole life.** Greene's _still / cerebral / cold-burning_ fits his recluse-and-notecards era — but the man who wrote _The Art of Seduction_ was in a warmer, sensual era; his childhood is a faded-memory era; the 2018 stroke is a blown-out present-day era. A single global palette flattens the timeline. So:

- **Map the person into 3–5 distinct ERAS/facets** first (origin · the wilderness years · the breakthrough/method · a tonal-outlier era · the rupture/present). Each era gets a **one-line mood**. This is the "highlight several things about them" layer.
- **Each shot is a moment inside one era, and carries its OWN mini vision palette** tuned to that era: _Era · Mood · World/palette · Time · Styling/props · Light · Style/finish._ Two shots from different eras should look genuinely different (cold institutional grey vs warm candlelit gold).
- **A thin SHARED SIGNATURE holds the varied palettes together as one 9takes series.** Lock it once and apply to every shot regardless of era:
  - an **amber accent** present in every frame (even cold ones — a warm sliver of light, a lamp, a reflection),
  - the **bottom-right factual caption** treatment (same type, same corner),
  - a **subtle film-grain / real-photograph finish** (the "moment in time," not a render),
  - **1:1**, POV-driven, one dominant light source per frame.

So the per-shot palette is the **variable**; the shared signature is the **constant**. That's what keeps five different eras reading as one deliberate set instead of five unrelated images.

## 13. The enrichment pass (always run after the first prompts are written)

After Step 4 writes the prompts, do a **second pass over every prompt** to make each frame sharper. But enrich the **right layer**, in this priority order — because the wrong kind of "more detail" makes images _worse_.

**Hard-won lesson:** specificity of **props ≠** a better image. Specificity of **composition** does. A test once compared a simple prompt against a prop-stuffed "optimized" one for the same church-pew shot. The simple prompt won easily — because it kept a strong **high angle over rows of pews** with **one girl breaking the pattern** of heads-down children. The "optimized" version added a bulletin, scuffed Mary-Janes, dust motes, a ceiling fan — and collapsed into a flat, eye-level, single-row, hazy stock photo. The props were visible and meaningless; the composition had been lost. So:

**Enrich in this order:**

1. **Composition & angle first (the emotional engine).** Before any prop, ask: _is the camera angle doing the feeling?_ State it strongly — a true high/overhead angle to dwarf, a low angle to loom, an over-the-shoulder to immerse. "Slightly elevated" is too weak; commit.
2. **Pattern, repetition, contrast.** The strongest single device: many figures/objects doing the same thing and **one** that breaks it (rows of heads bowed, one looking away). Build the pattern-break into the composition wherever the moment allows — the eye finds the subject instantly and the meaning lands without a caption.
3. **Then a few real, citable props** — 2–4 max, only ones that _carry_ feeling (a half-finished face, a hand pulling a hood down, chipped polish), never set-dressing for its own sake. Mine from the sources (tidbits, analysis, FAQs); never invent.
4. **Kill the haze.** GPT reads "faded old photograph / dust motes / dreamy / soft" as a soft-focus AI filter. For a crisp, believable result ask for a **cinematic color film still — sharp, high micro-contrast, fine grain — NOT soft, hazy, faded, or dreamy.** Keep a real-photo reference (e.g. Kodak Portra, Gregory Crewdson realism) over "old faded photo."
5. **Verify wardrobe + setting for POV recognition.** If the shot is from the person's POV at a real, dateable event, **research the actual costume and venue** and write them in accurately — the recognizable outfit + crowd/place is what tells the reader whose eyes they're behind. Never invent wardrobe; add a hard **negative list** against the wrong/invented items so GPT doesn't substitute them.
6. **Confirm no face renders.** Re-read each prompt: is the face turned, distant, out of frame, or hidden (hair/hands/mask/shadow)? Any mirror must explicitly forbid a facial reflection. Identity rides on tells (hair, wardrobe, setting), never a likeness.
7. **Re-apply the §9 tool guardrails** — anti-yellow-tint on cold frames, shadow-detail on dark ones, blurred-mass on crowds.

Keep the direction, keep it copy-pasteable, then re-confirm the ≥2-axis difference across every pair still holds.

## 14. The recognition litmus test (the final pass — run it from inside their head)

Before writing the doc, step **out of the art-director's chair and into the subject's** and judge every shot against one question:

> **Would this person recognize this moment in time?** Would it be familiar to them — would they say "yes, that's how it was," the way _they_ remember it or would describe it?

This is the truth test for the whole pipeline. A frame can be beautiful, on-brand, and technically clean and still **fail** — because it's how a stranger imagines the moment, not how the person lived it. Chappell Roan should look at the church-pew shot and feel the specific Willard, Missouri Sunday in her body — the boredom, the heat, the wrongness of being there — not see a generic "kid in a church" stock photo. If she wouldn't recognize herself in it, the shot is wrong no matter how good it looks.

For each shot, interrogate it as them:

- **Setting & era:** Is this _their_ actual room/town/decade — or a generic version? (A 2000s Ozarks church ≠ a 1950s Dust-Bowl chapel, even if both "read church.") Would they recognize the place?
- **Emotional truth:** Does the mood match how _they_ describe this memory — the wound, the thrill, the dread? Not the obvious surface emotion, the real one they've named in their own words.
- **The self in frame (face-free, accurate wardrobe):** No shot shows the face — confirm it's turned, distant, or hidden. Is identity carried by accurate tells they'd recognize: their real hair, their real way of holding themselves, and — for a real event — the **actual outfit and venue** (the recognizable costume + crowd/place is the POV cue), never an invented or generic look?
- **The tell:** Is the one detail that would make them go "_how did you know that?_" present — the specific object, gesture, or light only someone who lived it would include?

If a shot fails the test, name **why** (wrong era, wrong emotion, too staged, too generic, prop-stuffed) and fix the prompt — usually by correcting composition/era/emotion (per §13), not by adding props. Only ship the set once every shot would make the subject nod. State the verdict per shot in the report (e.g. "Shot 1 ✓ — she'd recognize the Willard pew; Shot 4 ✓ — her Lollapalooza 2024 lucha outfit + pink-cowboy-hat crowd, exactly the moment she opened with 'Femininomenon'").

## 15. The mirror shot (the set's final frame — always include it)

Every person set ships **one extra shot that is not about them**: the **Mirror Moment** (canonical spec: `docs/product/the-mirror-moment.md`). It becomes the deck's last slide, where the lens turns off the subject and onto the reader — their pattern becomes a question about **yours**. The recognition litmus (§14) does not apply to this shot; it's for the reader, not the subject.

Rules for the frame:

- **Empty of people.** The subject's space with the subject gone — the vacated vanity stool, the empty desk chair, the notecards with no hand. Absolutely no person, face, or human reflection.
- **Rhyme it against one earlier shot.** Same room/setup as a shot the reader just lived through, now vacated and turned slightly toward the viewer — "this seat is for you."
- **Generous negative space** — the frame carries large centered overlay text later; keep the center clean and uncluttered. Quiet and invitational, not sad or spooky.
- Shared signature still applies (amber sliver, grain, 1:1, one dominant light source) — but **no fact caption** on this shot; the question is the only text.

Rules for the question layer (written beside the prompt, added in Canva, never in-prompt):

- **Bridge line** (small, on top): universal, no subject name — _"We all build something to survive. The hard part is remembering how to take it off."_
- **The mirror question** (large, centered): must trace back to the through-line without needing the subject's story, and must be **near-verbatim to the 9takes question page** it will drive to.
- **The 9takes-only test** — the question must be: non-binary · demands a narrative · about the reader, not the subject · too exposed to answer in public comments (so it drives to 9takes). Fails any one → rewrite.
- **No CTA on this frame** — the silence after the question is the mechanic. Note the **caption bridge** for the deck (_"You just answered that in your head, didn't you? Write it down where it counts. 👇"_) and the landing: **bio link → the question page, not the analysis blog.**

## Step 0 — Resolve source + mine biography

Resolve `$ARGUMENTS` to a person. Gather real material (do **not** invent biography):

1. `docs/instagram/post-ideas/2026-04-29_top-tier-people-tidbits.md` — check for a tidbits block first (richest moment source).
2. `src/blog/people/drafts/<Person>.md` or the published `/personality-analysis/<slug>` — pull `persona_title`, `enneagram`, the wound, the FAQs.
3. `.claude/people/<Person>.md` if present.
4. Only if in-repo material is thin: one WebSearch pass for concrete biographical moments.

Note the Enneagram type and 3–6 concrete, datable moments you can build images from.

## Step 1 — Gate A: Person overview + eras + shared signature

Pitch (≤1 screen), seeded from §7 and §12:

- **Person overview:** type (wing), persona, and 4–6 things worth highlighting about how they see the world.
- **Eras:** 3–5 distinct life eras/facets, each with a one-line **mood** (these are the palettes the shots will draw from). Show the tonal range — include at least one tonal-outlier era (the "spicy"/warm one, the manic one, the broken one).
- **Shared signature:** the thin constant across all shots (§12) — amber accent + bottom-right caption + film-grain finish + 1:1 POV.
- **Per-person accent:** the one secondary color that is _theirs_ (§8), with a one-line why.

Then **stop and ask**: _"Lock the eras + signature + accent, or adjust?"_ Do not proceed until approved.

## Step 2 — Gate B: Pitch POV moments (tagged by era)

Using §2 + §3, pitch **6–9 candidate moments**, each one line, **each tagged with its era**:

> **[Moment name]** — _era: [which]_ — _POV lens [#]_ — "[the single frame: whose eyes, looking at what]" — feeling: [x].

Spread them across the eras so the set isn't all one mood. Rank them. Then **stop and ask**: _"Which do you want? (pick ~5–6, or swap in your own.)"_ Wait for the pick.

## Step 3 — Gate C: Build each shot's mini palette + direction

For each picked moment, write its **own mini vision palette** (tuned to its era) **plus** the POV direction — still no prompt:

> **Shot N — [name]** · _Era:_ [which]
> Palette: Mood [x] · World/palette [x] · Time [x] · Styling/props [x] · Light [x] · Finish [x]
> Direction: POV lens [#] · Camera [angle + distance + lens] · _accentuates:_ [the point]

Confirm: (a) every shot applies the **shared signature**; (b) palettes genuinely differ across eras; (c) at least two of {POV lens, angle, distance, lens, light, setting} differ across every pair. Then **stop and ask**: _"Approve the shot palettes, or adjust any?"_ Wait.

## Step 4 — Write story + overlay caption + prompt per shot

Each shot prompt must encode **its own era-palette** (not a global one), while keeping the shared-signature amber accent. For each approved shot, write all three layers (§11 + §9 + §10):

1. **Story (why this shot)** — 1–3 sentences of editorial intent tied to their perspective.
2. **Overlay caption** — the on-image text (bottom-right), grounded in a real citable fact.
3. **Prompt** — the full ChatGPT production-brief prompt (§9), **inside a fenced code block** so it's copy-pasteable, + variation axis + kill rule.

Text panels get a `gemini-imagegen` brief. Mark which single shot is the **bright peak** candidate.

## Step 5 — Enrichment pass (do NOT skip)

Run §13 over every prompt just written, **in priority order**: composition & angle first (commit to the angle that carries the feeling), then pattern/repetition/contrast (one figure breaking the pattern), then 2–4 real citable props that _carry_ feeling, then kill the haze (crisp cinematic film still, not faded/dreamy), then re-apply the §9 tool guardrails. Props are last and least — do not prop-stuff. Re-confirm the ≥2-axis difference across every pair still holds.

## Step 6 — Recognition litmus pass (the truth test — do NOT skip)

Run §14: step into the **subject's** head and judge every shot against _"Would this person recognize this moment in time — is it how they'd remember or describe it?"_ Check each for right era/place, real emotional truth, an authentic self-in-frame, and the one tell only someone who lived it would include. Fix any shot that fails (usually by correcting composition/era/emotion, not adding props). Carry a one-line per-shot verdict into the report.

## Step 7 — The mirror shot (do NOT skip)

Run §15: design the set's final frame — the subject's space, vacated, rhymed against one earlier shot — plus the question layer (bridge line + mirror question passing the 9takes-only test + caption bridge + question-page landing). Write its full prompt in the same §9 brief shape.

## Step 8 — Write the moodboard doc + report

Write `docs/ai-image-gen/moodboards/<person-slug>-moodboard.md` (template below) using the **enriched, recognition-checked** prompts. Then report — include the per-shot recognition verdicts — and tell the user the next move: `/carousel <Person>` will consume this moodboard's locked vision + shot prompts for its image slides (Story mode). As renders are approved, file them at `docs/ai-image-gen/moodboards/<person-slug>/images/shot-N-<name>.png`; the deck build sheet will live beside them at `<person-slug>/carousel.md`.

---

# Output Template

````markdown
<!-- docs/ai-image-gen/moodboards/<person-slug>-moodboard.md -->

# <Person> — 9takes Moodboard

> Enneagram: <N (wing)> · Persona: <persona_title> · Theme tag: <Reading People / The Nine / ...>
> Source: <tidbits / draft / published analysis>
> Per-person accent: <color + one-line why>

## Status log

- <date> — eras + signature + accent locked
- (append one dated line per revision — never grow a single run-on Status line)

## The through-line

<the single idea the whole set proves about this person — one sentence>

## Person overview

<4–6 bullets highlighting how they see the world — type pattern, wound, the several facets worth showing>

## Eras (each shot draws its palette from one)

| Era                       | Years | Mood (one line) | Palette / light cue |
| ------------------------- | ----- | --------------- | ------------------- |
| <origin>                  | <...> | <...>           | <...>               |
| <wilderness>              | <...> | <...>           | <...>               |
| <breakthrough/method>     | <...> | <...>           | <...>               |
| <tonal outlier / "spicy"> | <...> | <...>           | <...>               |
| <rupture / present>       | <...> | <...>           | <...>               |

## Shared signature (the constant across every shot)

- Amber accent in every frame · bottom-right factual caption · subtle film-grain / real-photo finish · 1:1 · POV-driven · one dominant light source.

## Shot list

| #   | Moment                  | Era   | POV lens       | Camera (angle · dist · lens) | Accentuates                    | Peak?               |
| --- | ----------------------- | ----- | -------------- | ---------------------------- | ------------------------------ | ------------------- |
| 1   | <name>                  | <era> | <#/label>      | <...>                        | <the point>                    | <bright peak ✓ / —> |
| ... |
| N   | The Mirror Moment (§15) | —     | — (the reader) | <...>                        | turns the lens onto the reader | mirror ⚡           |

## Shots (palette + story + caption + prompt)

### Shot 1 — <name> · Era: <which>

**Palette:** Mood <x> · World/palette <x> · Time <x> · Styling/props <x> · Light <x> · Finish <x>
**Why this shot:** <1–3 sentences of editorial intent — how it reveals their perspective>
**Overlay caption** (bottom-right, add after generation): <2–4 short factual lines from real bio>
**ChatGPT prompt** (photorealistic, square) — wrap the prompt in a fenced ``` code block (so it's copy-pasteable), built on the §9 brief:

    Photorealistic <POV LENS framing>.
    Scene: <where + when + era-world detail>.
    Subject: <an anonymous [person], face turned/obscured, doing or seeing what>.
    Details: <named props, textures, period detail; crowds = blurred mass>.
    Camera: <angle + distance + lens-mm>.
    Light: <direction + quality + single dominant source + time of day>.
    Color & finish: <era palette; where the amber accent lives; photorealistic, real imperfections, film grain>.
    Constraints: <anti-yellow-tint if cold; shadow-detail if dark; no on-image text; anonymous, no specific celebrity>.
    Format: square 1:1 (1024×1024).

_Vary: <the one axis to spin>._ · _Kill rule: <keep only the frame where ...>._ · _Refine conversationally in ChatGPT (regenerate; don't overload)._

[...one block per shot...]

### Shot N — The Mirror Moment (this seat is for you) · Era: none — this slide is not about them ⚡

<per §15: the vacated frame rhymed against Shot <X>, palette, why-this-shot, the bridge line + mirror question (near-verbatim to the target question page), the 9takes-only test, the caption bridge, the landing (question page, not blog), and the full ChatGPT prompt in a fenced code block with variation + kill rule. No fact caption — the question is the only text.>

**Text panels (if any) → gemini-imagegen** (requires `GEMINI_API_KEY`; else ChatGPT text-free background + Canva type): <briefs with exact text + chrome>

## Hand-off

Feed to `/carousel <Person>` (Story mode) — it consumes these era-tuned shot prompts for the deck's image slides (no flat re-prompting). The bright peak shot maps to the deck's single inverted/high-key slide; the mirror shot is the deck's final frame.
Generate Shot 1 in ChatGPT first, approve it, then upload it as a style reference for the rest to lock the grain/amber/finish across the set.
File approved renders at `docs/ai-image-gen/moodboards/<person-slug>/images/shot-N-<name>.png` — the deck build sheet lives beside them at `<person-slug>/carousel.md`.
````

Then report to the user:

```text
## Moodboard locked: <Person>

**File:** docs/ai-image-gen/moodboards/<slug>-moodboard.md
**Through-line:** <one line>
**Shots:** <N> POV frames (<count by lens>), peak = shot <X>, mirror = shot <Y> ("<the question>")
**Next:** /carousel <Person> — Story mode; it'll use this vision instead of flat prompts.
```

---

# Go Deeper

Self-sufficient by design. Distilled from:

- `docs/ai-image-gen/iklipse-dont-prompt-ai.md` — the 6-step directing process (the spine of §1).
- `docs/ai-image-gen/iklipse-only-ai-workflow.md` — "the prompt comes last" sequencing.
- `docs/ai-image-gen/iklipse-camera-angle-cheat-sheet.md` — the angle→emotion table (§4).
- `docs/ai-image-gen/iklipse-better-ai-results.md` — "lock the mood, lighting, camera" / the reference test.
- `.claude/commands/carousel.md` — the deck engine this feeds (Story mode is the person-deck consumer).
- `docs/product/the-mirror-moment.md` — the canonical mirror-shot / final-slide mechanic (§15).
- `midjourney-prompt` skill — legacy Greek-statue + other photo templates (fallback only).
- `gemini-imagegen` skill — text-in-image panels (needs `GEMINI_API_KEY`).
