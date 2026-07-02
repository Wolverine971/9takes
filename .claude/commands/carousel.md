<!-- .claude/commands/carousel.md -->

# Carousel — 9takes Instagram Teaching-Carousel Factory

You build a complete, design-ready Instagram **teaching carousel** for 9takes, following the decoded @iklipse\_ engine re-skinned for 9takes. The output is a full slide-by-slide deck: beat copy + per-slide image prompts + caption + CTA + a posting/engagement plan — ready for Canva or the admin asset generators with zero further decisions.

This is **not** the same as `/distribute-instagram` (that builds a per-person asset pack of mixed formats). This command builds **one carousel deck** off a named structural engine, for any source: a person, an Enneagram type, a situation, or a blog.

## Input

The user provides: **$ARGUMENTS** — a source, plus an optional mode keyword.

- Source: a person name (`Pedro Pascal`), an Enneagram type (`Type 8`), a situation (`getting passed over for a promotion`), or a blog path (`src/blog/enneagram/enneagram-type-5.md`, `/personality-analysis/Zendaya`).
- Optional mode (last word): `story` | `generative` | `diagnostic` | `lookup` | `gallery`. If omitted, infer it (see §B decision rule).

If no argument is provided, respond:

```text
Ready to build a 9takes carousel. Give me a source — and optionally a mode.

Source can be:
1. A person (e.g., "Chappell Roan")     → Story deck if a moodboard exists
2. An Enneagram type (e.g., "Type 8")  → usually a Lookup deck
3. A situation (e.g., "getting ghosted") → usually a Gallery deck
4. A blog path or URL

Modes: story | generative | diagnostic | lookup | gallery (I'll pick one if you don't).

Example: /carousel Type 8 lookup
```

Then wait for user input.

## Source of Truth

This command is **self-sufficient** — the engine, modes, beats, formula shapes, brand rules, and image-prompt templates are inlined below. You do not need to read any other file to run it. The canonical spec it's distilled from is `docs/ai-image-gen/CAROUSEL-SPEC.md` (consult only for background or edge cases). The evidence layer (decoded source posts) is `docs/ai-image-gen/iklipse-*.md`.

## Pre-Approved Operations

- **Read**: All files in the project
- **Glob/Grep**: Resolve blog files, types, and metadata
- **WebSearch**: Only if a person source needs current context/handles
- **Write**: Create files in `docs/distribution-assets/`
- **Bash**: `ls` commands only

## Task Tracking

Use TaskCreate/TaskUpdate. Create 6 tasks at the start, matching the pipeline:

1. Resolve source + pull metadata
2. Select mode + format
3. Write beat copy (all slides)
4. Generate per-slide image prompts
5. Assemble deck + caption + CTA
6. Engagement plan, write file, report

---

# The Engine (inlined spec)

## A. The one-sentence engine

> **Take something people treat as random, intuitive, or "you either have it or you don't," and prove it runs on nameable rules — then trade a comment for the cheat sheet.**

The revelation is never the topic. It's the reframe from **intuition → system**. 9takes' native territory: reading people feels like a gift, but it runs on nine repeatable lenses. Every deck proves that one sentence.

## B. The five modes (pick exactly one)

| Mode           | Title shape                                 | Lever                   | Body                                        | Formula shape                               |
| -------------- | ------------------------------------------- | ----------------------- | ------------------------------------------- | ------------------------------------------- |
| **Story**      | "[PERSON NAME]" (cover; type revealed late) | Lore + becoming-them    | Cover → tidbits → POV arc → reveal → mirror | (none — the mirror question is the payload) |
| **Generative** | "Why [unexpected thing] **works**"          | Curiosity gap           | How to _build_ it                           | Additive Venn (§D)                          |
| **Diagnostic** | "Why **your** [thing] is shallow/broken"    | Identity fear           | Spot flaw → fix                             | Hierarchical pyramid (§D)                   |
| **Lookup**     | "The [X] cheat sheet — which X = which Y"   | Save-bait               | Enumerated cards                            | Recap table ("SAVE THIS")                   |
| **Gallery**    | "One moment, nine reactions"                | Pick-one identification | Wordless-ish scenes                         | (none — CTA is the payload)                 |

**Decision rule (infer mode if not given):**

- Source is a **person with a locked moodboard** (or a published analysis) → **Story** — the personality-series deck (§C4). This is the default for person sources; it supersedes the plain 2-slide series post.
- Source is a **single type / any taxonomy** → **Lookup**.
- Source is a **situation read multiple ways** → **Gallery**.
- Source framed as a **mistake the viewer makes** → **Diagnostic**.
- Source is a **craft/skill to teach** → **Generative**.

Diagnostic hooks ~3× harder (felt accusation). Lookup wins saves. Gallery wins funnel fit. Story wins the person series (it's the moodboard's native consumer). When genuinely torn, default to **Story** for a person with a moodboard, **Diagnostic** for skills/mistakes, and **Lookup** for types.

## C. Beat structures (★ = mandatory, never skip)

### C1 — Teaching deck (Generative / Diagnostic), 9–13 slides

1. ★ **Hook** — one surprising/accusatory line, 2nd person. `Swipe →` in serif italic.
2. ★ **Recognition + mystery** — "everyone can feel it, nobody can name it." Promises the power to _name_ it. (Strongest beat — never skip.)
3. **Mechanism** _(optional)_ — _why_ the brain/heart responds. Open loop.
4. ★ **Taxonomy / diagnostic grid** — the screenshot-able value. Numbered word-bank or 4-item "what's wrong" grid, each + a one-line symptom. End "most fail in one of these."
5. ★ **Reframe** — kill the obvious misreading, raise stakes to _meaning / being seen_. One quotable antithesis line.
6. ★ **Formula slide** — the visual peak, on an **inverted light/bright frame** (§D).
7. **Proof slides, one per element** — each gets a full-bleed image + a one-line knife (elastic, 1–4 slides).
8. **Guillotine / checklist** _(optional, high value)_ — one subtractive rule or a 3-question pre-flight checklist.
9. ★ **Payoff + CTA** — restate the thesis _with the "because,"_ then the CTA (§F).

### C2 — Lookup (cheat sheet), 15–20 slides

```
1  HOOK     "The [Topic] Cheat Sheet" + italic subhead promising a reference
2  PROBLEM  "Most [outputs] look the same — not because of [scapegoat], but [single choice]"
3  THESIS   "[Technique] = EMOTION"
4..N ENTRY PAIRS per item:
     a) INFO CARD:  #N: NAME / Use when / Best for [chips] / Driven by [chips]
     b) DEMO CARD:  full-bleed image + amber badge "NAME = Emotion"
     (QUICK RULE interstitial every ~2 entries: "Want X? → A. Want Y? → B.")
N+1 RECAP   "SAVE THIS" — whole map as one list, on the light peak slide
N+2 CTA     participation question + comment-bait
```

### C3 — Gallery (one moment, nine reactions), 9–11 slides

```
1   HOOK    the situation, or "[Theme]" + "Look closer →"
2..N SCENES one feeling/reaction per slide, IDENTICAL frame, only number + reaction change
N+1 CTA     "Which one was you? Comment your number."
```

### C4 — Story deck (personality-series person post), 9–11 slides

The proven shape from the Chappell Roan build (`docs/ai-image-gen/moodboards/chappell-roan/carousel.md` — use it as the reference example). Requires a locked moodboard; the deck is its native consumer.

```
1    COVER    persona collage bg (per-person accent color) + face cutout from static/types/
              + name + `[ PERSONALITY ANALYSIS ]` + `TYPE N · THE [ARCHETYPE]`.
              ★ The face appears ONCE, here — then never again.
2    TIDBITS  5–7 fact-checked lore lines (five-test + wound test, per the series north star)
              + lead-in handoff: "But to understand [the pattern], you have to see what they saw →"
3..N POV ARC  the moodboard's POV shots in story order — origin wound → private/love wound →
              the grind → the armor/method → triumph → the cost. Each: full-bleed image,
              face-free, + one overlay fact caption (bottom-third scrim, 1–2 lines).
N+1  REVEAL   ★ the deck's single inverted/amber text slide: "That's Enneagram Type N —
              The [Archetype]. [one-line thesis]."
N+2  MIRROR ⚡ ★ the Mirror Moment (spec: docs/product/the-mirror-moment.md): the moodboard's
              empty-frame mirror shot + bridge line + the mirror question, large-centered.
              NO CTA on this slide — the silence is the mechanic. The CTA lives in the
              caption + bio link → the 9takes QUESTION PAGE titled with the exact question
              (not the analysis blog).
```

**Story-deck specifics (override the teaching-deck defaults):**

- **Arc logic:** the cover is the glossy _persona_; the POV shots are the _real_ story underneath. Stylized → real is the emotional turn. POV runs chronological because slides 1–2 already did the hook.
- **Chrome:** series chrome, not iklipse chrome (§G).
- **Format:** 4:5 vertical (match the existing series slides). POV shots generate 1:1 top-weighted, then crop to 4:5.
- **Caption:** type-first (self-ID hook in the type's vernacular → name the type → person as proof → the type's core struggle → CTA → "Are you a Type N? Tag one"). Pinned first comment carries the blog link.
- The type reveal is withheld until N+1 — tidbits and POV shots build the mystery the reveal pays off.

## D. Formula-slide shapes (the peak slide — pick by relationship)

Always on an **inverted light/bright frame** — the one slide that pops against the moody rest.

- **Venn (equal, overlapping)** → 9takes: **Situation + Type + Emotion → a take that reveals.** (Generative default)
- **Pyramid (ranked priority)** → 9takes: **Emotion > Motive > Behavior.** (Diagnostic default — emotion on top = the thesis)
- **Pipeline (sequence → outcome)** → 9takes: **Notice → Question → Name → Understand.**
- **Inequality (X ≠ Y / A = B)** → 9takes: **More opinions ≠ More understanding; More perspectives = More understanding.**

## E. Hooks ranked (by observed source engagement)

| Pattern                                            | 9takes re-skin                                         |
| -------------------------------------------------- | ------------------------------------------------------ |
| **"Don't X. Y instead."** (top performer, 1,476♥) | Don't judge people. Read them instead.                 |
| "Why [weird thing] works"                          | Why nine answers beat one                              |
| "Why your X looks cheap"                           | Why your read of people is shallow                     |
| "The [X] cheat sheet — which X = which Y"          | The Enneagram cheat sheet: which type feels which fear |
| "Who wins — not who you think"                     | Who actually reads people — not who you think          |
| "What makes people [look]?"                        | What makes a take stop you?                            |

**Caption opener that drove the top performer:** a provocative either/or that implicates the reader — _"Are people complicated, or are you just bad at reading them?"_

## F. CTA menu (ranked)

1. **Participation** ("Which one was most you? Comment your number / your type.") — **9takes default.** Feeds the give-first funnel; recognition is step one of contributing.
2. **Lead-magnet** ("Comment X, we'll _send_ you the cheat sheet.") — most raw comments, but the DM loop may be theater. Use only when explicitly testing it.
3. **Keyword + "we'll post more"** — baseline.

## G. Brand swap + visual system (NON-NEGOTIABLE)

- **Accent is amber (Streetlamp V5), dark text on amber fills. NEVER red/teal/rose for primary** (teal only as a `data-*` accent). iklipse runs cool/blue — we go warm on purpose so it never reads as a clone.
- **Fixed chrome on every slide:** `9takes` top-left · theme tag top-right (`The Nine`, `Reading People`, `Type Decoder`, `Emotional Read Check`) · `9takes.com` bottom-left.
- **Alternating rhythm:** moody full-bleed **photo** ↔ clean **diagram**. **Never two diagram slides back to back.**
- **Exactly one inverted bright slide** = the formula/recap peak ("save this").
- **Type:** heavy condensed sans headlines + **serif italic** reserved for swipe/payoff/subhead only.
- **The `X = Emotion` overlay becomes an amber pill `Type N = [Emotion]`.**
- **Imagery proves the point:** every photo is itself an instance of the rule (a 9takes "emotion" slide shows a real, unguarded face). 1:1 square, text top-weighted to survive the feed crop.
- **Story decks (§C4) use the SERIES chrome instead of the above:** mono name font + amber corner brackets · `9takes` · `THE FULL READ → 9takes.com` · `Analysis by DJ Wayne` — plus a **per-person accent color** locked in the moodboard (e.g. hot pink for Chappell, purple for Lana/Type 4) used for the eye-bar, the `TYPE N · THE [ARCHETYPE]` label, and the cover vibe. Amber stays primary; the person accent never takes over. Base = black. 4:5 vertical.

## H. Format → length

| Format                 | Slides | Mode       | Use for                                  |
| ---------------------- | ------ | ---------- | ---------------------------------------- |
| Story deck (series)    | 9–11   | Story      | Person post with a locked moodboard      |
| Flagship engine        | 12–13  | Generative | Core thesis decks                        |
| Cheat sheet            | 15–20  | Lookup     | Evergreen save-bait (the 9-type decoder) |
| Checklist (FAIL/PASS)  | 7      | Diagnostic | "Are you reading them right?" self-audit |
| Manifesto (antithesis) | 8      | Generative | Quotable couplets (cheapest)             |
| Gallery (pick-one)     | 9–11   | Gallery    | "One moment, nine reactions"             |
| Short trio             | 5      | Generative | Fast filler                              |
| Process w/ menus       | 9      | Generative | "How to read someone," each step a menu  |

## I. Image-prompt templates (emit one per photo slide)

**Photo slides → ChatGPT (GPT Image), labeled production briefs.** We generate in ChatGPT, not Midjourney — it follows a detailed brief far better than a keyword string. **Never use the render tails** (`Unreal Engine`, `Cinematic`, `32k`, `Super-Resolution`, `hyper realistic`, `Global Illumination`, `octane`) — those produce the exact generic glossy-CGI look the decoded engine mocks. Build each prompt in this skimmable brief shape, **inside a fenced code block** so it's copy-pasteable:

```
Photorealistic [framing].
Scene: [where + when + world detail].
Subject: [who/what, doing what — anonymous, no real person's face].
Details: [2–4 real props that carry feeling; crowds = "a blurred, undetailed mass"].
Camera: [angle + distance + lens-mm — DIRECTED per slide off the angle→emotion sheet, never default eye-level].
Light: [direction + quality + the single dominant source].
Color & finish: [palette; where the amber accent lives; film grain, real photograph — NOT a 3D render, NOT CGI, NOT glossy].
Constraints: [anti global warm/yellow cast on cold frames; keep shadow detail, not crushed black; no on-image text].
Format: square 1:1 (1024×1024), composition top-weighted.
```

**Motif rules:**

- **Person/Story decks: never statues, never faces.** Use the moodboard's POV prompts (they're already directed). If a beat has no moodboard shot, write a fresh POV brief in the same style.
- **Type/concept decks may use the Greek-statue-with-emotion motif** — but rendered as a **photographed real marble sculpture** (a museum photograph: true Carrara veining, hairline chips, fine stone dust, Kodak Portra film grain), never a CGI render. Per-type pose anchors:
  - T1 stern focused, meticulously ordering objects · T2 reaching out, warm caring, hands extended · T3 confident on a podium, proud determination · T4 contemplative melancholy, gazing at reflection · T5 hunched over texts, intense curiosity · T6 vigilant protective, scanning surroundings · T7 mid-leap ecstatic, arms wide · T8 commanding stance, fierce jaw · T9 serene meditation, calm acceptance
- **Vary the direction across slides:** every pair of photo prompts must differ on **at least two** of {angle, distance, lens, light, setting}. Nine identical eye-level 50mm frames = flat deck.
- Midjourney remains a fallback only — refine with `/midjourney-prompt` if the user asks for MJ.

**Text-bearing slides** (hook, diagram/taxonomy, formula peak, badges, CTA) → spec for **`gemini-imagegen` (Nano Banana Pro)**, which renders text-in-image cleanly. Give it: background (amber or inverted-light for the peak), the exact on-slide text, and the chrome positions. **Caveat:** `gemini-imagegen` needs `GEMINI_API_KEY` in the environment, which this project does not currently set — when it's absent, generate a **text-free background** in ChatGPT and set the type in **Canva** (this is the proven fallback). Photo-slide captions are always overlaid after generation — never ask the model to render them in-image.

## J. Quality gates (run before writing the file)

- **All ★ beats present** for the chosen mode. If one is missing, the deck fails — add it.
- **Brand non-negotiables hold:** amber only, fixed chrome on every slide, exactly one bright peak slide, no two diagram slides adjacent.
- **Hook passes the copy triad** (Harry Dry): can I visualize it? can I falsify it? could nobody else say this? — 2+ no's → rewrite.
- **The taxonomy/word-bank slide is screenshot-able** — chips, not prose. This is the save-able payload; if it's weak, the deck is weak.
- **Every photo slide proves its own point** (the image is an instance of the claim).
- **CTA is forced-choice/participation**, not "what do you think?" **Exception — Story decks:** the mirror slide carries **no on-slide CTA** (the silence is the mechanic); the participation CTA lives in the caption + bio link to the question page. That passes this gate.
- **Story decks only:** face appears exactly once (cover); every POV slide is face-free; the mirror question passes the 9takes-only test (`docs/product/the-mirror-moment.md`); the bio link targets the **question page**, not the analysis blog.
- **Personality claims hedge** ("my read" / "suggests"); no mental-health diagnosis. Add the disclaimer line in the caption.

---

# Workflow

## Step 1 — Resolve source + metadata

**First, check for a locked moodboard.** If `docs/ai-image-gen/moodboards/<source-slug>-moodboard.md` exists, read it: its **Vision palette**, **per-person accent**, **POV shot list**, and **image prompts** are the art direction for this deck. Use those prompts for the photo slides in Step 4 (do **not** invent flat `type N greek statue ... 50mm` prompts), map its **bright peak shot** to the deck's one inverted/high-key slide, and its **mirror shot** to the final Mirror Moment slide. Also check `docs/ai-image-gen/moodboards/<source-slug>/images/` — shots already generated and filed there are assets in hand, not prompts to re-emit. If no moodboard exists and this is a person source, suggest running `/moodboard <Person>` first for non-flat imagery, then proceed.

Resolve `$ARGUMENTS` in this order:

1. **Enneagram type** (`Type N`) → read `src/blog/enneagram/enneagram-type-N.md` for recognize-by / driven-by / core fear language.
2. **Situation/scenario** (a phrase, no type/person) → no file needed; this is a Gallery source. Generate the nine type-reactions from the engine.
3. **Person** → check `docs/instagram/post-ideas/2026-04-29_top-tier-people-tidbits.md` first; else find the draft in `src/blog/people/drafts/` or the published analysis. Pull Enneagram type + grade from `src/lib/components/molecules/famousTypes.ts` if present.
4. **Blog path/URL** → read it directly.

If multiple matches, ask one clarifying question. If nothing resolves, stop and say so.

## Step 2 — Select mode + format

Apply the §B decision rule (or honor the explicit mode arg). Then pick the format/length from §H. State your pick and the theme tag (§G) in one line before drafting.

## Step 3 — Write beat copy

Write **every slide** in the chosen mode's beat skeleton (§C). Hit all ★ beats. Produce the word-bank/taxonomy slide verbatim and exactly one bright formula/recap peak slide. Use a §E hook pattern. Keep headlines heavy-sans-short; reserve italic for swipe/payoff.

## Step 4 — Generate per-slide image prompts

**If a moodboard was found in Step 1:** pull the photo-slide prompts straight from its shot list — they're already directed (POV lens, camera, light, style) and non-flat. Match each beat to the moment whose feeling fits; the moodboard's bright peak shot becomes the deck's one inverted slide. Only write a fresh §I prompt for a beat the moodboard doesn't cover.

**Otherwise (no moodboard):** for each photo slide, emit a ChatGPT production brief (§I) tuned to that slide's named emotion/type — and vary the camera angle, distance, lens, and lighting across slides so the set isn't flat (don't repeat `50mm` + the same amber light on every frame). For each text-bearing slide, emit a `gemini-imagegen` brief (if `GEMINI_API_KEY` is available) or mark it "ChatGPT background + Canva type" (§I caveat). Every slide gets the fixed chrome (§G — series chrome for Story decks).

## Step 5 — Assemble the deck

Fill the output template below. Run the §J quality gates and revise before writing.

## Step 6 — Engagement plan, write file, report

Add the posting + type-pond engagement plan. Write the file, then report.

---

# Output Template

**Where to write (by mode):**

- **Story deck** → `docs/ai-image-gen/moodboards/<person-slug>/carousel.md`, beside the `images/` dir where the approved renders are filed. Follow the §C4 build-sheet shape (cover composite spec, tidbits block, POV slide table, mirror block, type-first caption, pinned comment) — the Chappell file is the canonical example.
- **All other modes** → `docs/distribution-assets/[source-slug]-carousel.md` using the template below.

```markdown
<!-- docs/distribution-assets/[source-slug]-carousel.md -->

# [Source] — 9takes Carousel

> Mode: [Story/Generative/Diagnostic/Lookup/Gallery] | Format: [name, N slides] | Theme tag: [The Nine / Type Decoder / ...]
> Source: [type / person / situation / blog path] | Anchors Enneagram Type: [N or n/a]
> Formula shape: [Venn/Pyramid/Pipeline/Inequality/none]

## Why this deck works (engine check)

- **The reframe:** [the intuition → system flip this deck proves]
- **Hook pattern used:** [§E pattern]
- **The save-able payload:** [the word-bank/taxonomy slide, one line]
- **★ beats present:** [list them]

---

## Slides

| #   | Role | Headline (heavy sans) | Subhead / body | Visual                                        |
| --- | ---- | --------------------- | -------------- | --------------------------------------------- |
| 1   | Hook | [line]                | _Swipe →_      | [Photo: MJ prompt ref / or gemini text-slide] |
| 2   | ...  | ...                   | ...            | ...                                           |
| ... |

(Every slide carries chrome: `9takes` TL · `[theme tag]` TR · `9takes.com` BL. The bright peak slide is # [X].)

## Image prompts

**Slide [N] (Photo — [emotion/type]):**
```

[full ChatGPT production brief per §I, ending "Format: square 1:1 (1024×1024), composition top-weighted."]

```

_Vary: [one axis]._ · _Kill rule: [keep only the frame where ...]._

**Slide [N] (Text — formula peak):**
gemini-imagegen brief: [background = inverted light; exact on-slide text; chrome positions]. (No `GEMINI_API_KEY`? → ChatGPT text-free background + Canva type.)

[...one block per slide...]

## Caption (90–160 words)

1. Provocative either/or opener that implicates the reader (§E).
2. 2–4 short lines that tease the payload (each ≤2 mobile lines).
3. The reframe in one quotable line.
4. CTA (§F — participation by default).
5. Disclaimer (if any personality claim): _Speculative personality read based on publicly available behavior, not diagnosis._

[full caption]

## CTA + comment keyword

- **On-slide CTA:** [forced-choice/participation line]
- **Keyword (if used):** [WORD]

## Hashtags (12–18, tiered)

[topic 4–6 · enneagram/personality 5–7 · niche discovery 3–5]

## Posting + engagement plan

- **Anchors Type [N]** → engage that type's pop-psych pond this week (per type-pond strategy).
- **Day 1:** post carousel + 1 story (poll on the CTA question).
- **Day 2–3:** reply to every comment in first hour; pin the best counter-read.
- **Day 4–7:** repost the strongest slide as a story; tee up the next deck in the series.

## Quality scorecard (0–2 each)

- Save-able payload: [ ] · Hook (copy triad): [ ] · Reframe sharpness: [ ] · Brand fidelity: [ ] · Funnel fit (CTA): [ ] · Image-proves-point: [ ]
  **Total:** [X]/12 — **Ship if ≥8.**

## Log it

After it ships, add a row to `docs/ai-image-gen/CAROUSEL-SPEC.md` §12 (likes/comments/saves vs source comp).
```

Then report to the user:

```text
## Carousel built: [Source]

**File:** docs/distribution-assets/[source-slug]-carousel.md
**Mode/Format:** [mode] · [format, N slides] · anchors Type [N]
**Save-able payload:** [one line]
**Scorecard:** [X]/12 — [Ship/Revise]

Next: [generate the images (/midjourney-prompt or gemini-imagegen), then build in Canva / asset-generators].
```

---

# Go Deeper

This command is self-sufficient. It's distilled from:

- `docs/ai-image-gen/CAROUSEL-SPEC.md` — the canonical engine (modes, beats, formula shapes, brand swap, worked example, engagement log). Read for background or an edge case the inline spec doesn't cover.
- `docs/ai-image-gen/WORKFLOWS.md` — the production-pipeline spec; this command is Workflow 1.
- `docs/ai-image-gen/iklipse-*.md` — the decoded source posts (the evidence layer).
- `docs/product/the-mirror-moment.md` — the Story deck's closing mechanic (final slide, no CTA, question-page landing).
- `docs/ai-image-gen/moodboards/chappell-roan/carousel.md` — the reference Story-deck build sheet.
- `docs/instagram/personality-series-north-star.md` + `docs/instagram/post-ideas/2026-05-19_personality-series-intro-arc-lineup.md` — the series voice, tidbit five-test + wound test, and type-pond coordination Story decks inherit.
- `midjourney-prompt` skill — legacy templates (fallback only; photo slides target ChatGPT).
- `gemini-imagegen` skill — text-in-image generation for badge/formula/CTA slides (needs `GEMINI_API_KEY`).
