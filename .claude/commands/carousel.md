<!-- .claude/commands/carousel.md -->

# Carousel — 9takes Instagram Teaching-Carousel Factory

You build a complete, design-ready Instagram **teaching carousel** for 9takes, following the decoded @iklipse\_ engine re-skinned for 9takes. The output is a full slide-by-slide deck: beat copy + per-slide image prompts + caption + CTA + a posting/engagement plan — ready for Canva or the admin asset generators with zero further decisions.

This is **not** the same as `/distribute-instagram` (that builds a per-person asset pack of mixed formats). This command builds **one carousel deck** off a named structural engine, for any source: a person, an Enneagram type, a situation, or a blog.

## Input

The user provides: **$ARGUMENTS** — a source, plus an optional mode keyword.

- Source: a person name (`Pedro Pascal`), an Enneagram type (`Type 8`), a situation (`getting passed over for a promotion`), or a blog path (`src/blog/enneagram/enneagram-type-5.md`, `/personality-analysis/Zendaya`).
- Optional mode (last word): `generative` | `diagnostic` | `lookup` | `gallery`. If omitted, infer it (see §B decision rule).

If no argument is provided, respond:

```text
Ready to build a 9takes carousel. Give me a source — and optionally a mode.

Source can be:
1. An Enneagram type (e.g., "Type 8")  → usually a Lookup deck
2. A situation (e.g., "getting ghosted") → usually a Gallery deck
3. A person (e.g., "Zendaya")           → usually Diagnostic/Generative
4. A blog path or URL

Modes: generative | diagnostic | lookup | gallery (I'll pick one if you don't).

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

## B. The four modes (pick exactly one)

| Mode           | Title shape                               | Lever                   | Body                | Formula shape               |
| -------------- | ----------------------------------------- | ----------------------- | ------------------- | --------------------------- |
| **Generative** | "Why [unexpected thing] **works**"        | Curiosity gap           | How to _build_ it   | Additive Venn (§D)          |
| **Diagnostic** | "Why **your** [thing] is shallow/broken"  | Identity fear           | Spot flaw → fix     | Hierarchical pyramid (§D)   |
| **Lookup**     | "The [X] cheat sheet — which X = which Y" | Save-bait               | Enumerated cards    | Recap table ("SAVE THIS")   |
| **Gallery**    | "One moment, nine reactions"              | Pick-one identification | Wordless-ish scenes | (none — CTA is the payload) |

**Decision rule (infer mode if not given):**

- Source is a **single type / any taxonomy** → **Lookup**.
- Source is a **situation read multiple ways** → **Gallery**.
- Source framed as a **mistake the viewer makes** → **Diagnostic**.
- Source is a **craft/skill to teach** → **Generative**.

Diagnostic hooks ~3× harder (felt accusation). Lookup wins saves. Gallery wins funnel fit. When genuinely torn, default to **Diagnostic** for people/skills and **Lookup** for types.

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

## H. Format → length

| Format                 | Slides | Mode       | Use for                                  |
| ---------------------- | ------ | ---------- | ---------------------------------------- |
| Flagship engine        | 12–13  | Generative | Core thesis decks                        |
| Cheat sheet            | 15–20  | Lookup     | Evergreen save-bait (the 9-type decoder) |
| Checklist (FAIL/PASS)  | 7      | Diagnostic | "Are you reading them right?" self-audit |
| Manifesto (antithesis) | 8      | Generative | Quotable couplets (cheapest)             |
| Gallery (pick-one)     | 9–11   | Gallery    | "One moment, nine reactions"             |
| Short trio             | 5      | Generative | Fast filler                              |
| Process w/ menus       | 9      | Generative | "How to read someone," each step a menu  |

## I. Image-prompt templates (emit one per photo slide)

**Photo slides → Midjourney, Greek-statue-with-emotion motif** (the canonical 9takes look). Build each prompt as:

```
[EMOTION] greek statue [POSE tied to the slide], [FACIAL_EXPRESSION], [SETTING],
Unreal Engine, Cinematic, warm amber color scheme, portrait Photography, Shot on 50mm lens,
Depth of Field, hyper-detailed, beautifully color graded, 32k, Super-Resolution,
[LIGHTING], Global Illumination, hyper realistic, super detailed --ar 1:1
```

Per-type pose anchors (use when the slide names a type):

- T1 stern focused, meticulously ordering objects · T2 reaching out, warm caring, hands extended · T3 confident on a podium, proud determination · T4 contemplative melancholy, gazing at reflection · T5 hunched over texts, intense curiosity · T6 vigilant protective, scanning surroundings · T7 mid-leap ecstatic, arms wide · T8 commanding stance, fierce jaw · T9 serene meditation, calm acceptance

For the brief: push **real texture, real feeling** (the anti-"plastic skin" — itself on-message). Note at the bottom of each prompt: _"Refine with `/midjourney-prompt` if needed."_

**Text-bearing slides** (hook, diagram/taxonomy, formula peak, badges, CTA) → spec for **`gemini-imagegen` (Nano Banana Pro)**, which renders text-in-image cleanly. Give it: background (amber or inverted-light for the peak), the exact on-slide text, and the chrome positions. Or hand these to Canva as pure type+shape slides.

## J. Quality gates (run before writing the file)

- **All ★ beats present** for the chosen mode. If one is missing, the deck fails — add it.
- **Brand non-negotiables hold:** amber only, fixed chrome on every slide, exactly one bright peak slide, no two diagram slides adjacent.
- **Hook passes the copy triad** (Harry Dry): can I visualize it? can I falsify it? could nobody else say this? — 2+ no's → rewrite.
- **The taxonomy/word-bank slide is screenshot-able** — chips, not prose. This is the save-able payload; if it's weak, the deck is weak.
- **Every photo slide proves its own point** (the image is an instance of the claim).
- **CTA is forced-choice/participation**, not "what do you think?"
- **Personality claims hedge** ("my read" / "suggests"); no mental-health diagnosis. Add the disclaimer line in the caption.

---

# Workflow

## Step 1 — Resolve source + metadata

**First, check for a locked moodboard.** If `docs/ai-image-gen/moodboards/<source-slug>-moodboard.md` exists, read it: its **Vision palette**, **POV shot list**, and **image prompts** are the art direction for this deck. Use those prompts for the photo slides in Step 4 (do **not** invent flat `type N greek statue ... 50mm` prompts), and map its **bright peak shot** to the deck's one inverted/high-key slide. If no moodboard exists and this is a person source, suggest running `/moodboard <Person>` first for non-flat imagery, then proceed.

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

**Otherwise (no moodboard):** for each photo slide, emit a Midjourney prompt (§I) tuned to that slide's named emotion/type — but vary the camera angle, distance, lens, and lighting across slides so the set isn't flat (don't repeat `50mm` + the same amber light on every frame). For each text-bearing slide, emit a `gemini-imagegen` brief or mark it "Canva (type+shape)." Every slide gets the fixed chrome (§G).

## Step 5 — Assemble the deck

Fill the output template below. Run the §J quality gates and revise before writing.

## Step 6 — Engagement plan, write file, report

Add the posting + type-pond engagement plan. Write the file, then report.

---

# Output Template

Write to `docs/distribution-assets/[source-slug]-carousel.md` using this structure:

```markdown
<!-- docs/distribution-assets/[source-slug]-carousel.md -->

# [Source] — 9takes Carousel

> Mode: [Generative/Diagnostic/Lookup/Gallery] | Format: [name, N slides] | Theme tag: [The Nine / Type Decoder / ...]
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
`[full Midjourney prompt, --ar 1:1]`
_Refine with /midjourney-prompt if needed._

**Slide [N] (Text — formula peak):**
gemini-imagegen brief: [background = inverted light; exact on-slide text; chrome positions].

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
- `midjourney-prompt` skill — full Greek-statue + other templates for the photo slides.
- `gemini-imagegen` skill — text-in-image generation for badge/formula/CTA slides.
