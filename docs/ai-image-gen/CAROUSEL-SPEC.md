<!-- docs/ai-image-gen/CAROUSEL-SPEC.md -->

# 9takes Carousel Spec — the canonical engine

**This is the single source of truth** for 9takes Instagram teaching carousels. It is the compiled intersection of 14 analyzed @iklipse\_ decks (the `iklipse-*.md` files + `iklipse-*/source-analysis.md` subfolders in this folder), re-skinned into a reusable 9takes system.

Commands that build carousels (e.g. `/carousel`) should **inline the relevant sections of this file verbatim** — agents don't reliably read out-linked docs. The per-post `source-analysis.md` files remain the evidence layer; this file is the codified engine. Supersedes the former `CAROUSEL-PLAYBOOK.md` and `_TEMPLATE-9takes-carousel-system.md`.

---

## 1. The one-sentence engine

> **Take something people treat as random, intuitive, or "you either have it or you don't," and prove it runs on nameable rules — then trade a comment for the cheat sheet.**

The revelation is never the topic. It's the reframe from **intuition → system**. That is exactly 9takes' native territory: reading people feels like a gift, but it runs on nine repeatable lenses. iklipse keeps the subject and moves the _camera_; 9takes keeps the moment and moves the _mind_. Same revelation, pointed at psychology instead of optics.

---

## 2. The four modes (pick one per deck)

Mode = the rhetorical stance and emotional lever. It decides the title shape, the body, and the formula-slide shape. Pick exactly one.

| Mode           | Title shape                                | Emotional lever                   | Body                                  | Formula shape                          | Source model            |
| -------------- | ------------------------------------------ | --------------------------------- | ------------------------------------- | -------------------------------------- | ----------------------- |
| **Generative** | "Why [unexpected thing] **works**"         | Curiosity gap                     | How to _build_ it                     | Additive (A + B + C →)                 | Weird AI, Story Formula |
| **Diagnostic** | "Why **your** [thing] is broken / shallow" | Identity fear ("looking amateur") | Spot the flaw → here's the fix        | Hierarchical (pyramid, priority order) | Cheap AI                |
| **Lookup**     | "The [X] cheat sheet — which X = which Y"  | Completionism / save-bait         | Enumerated reference cards            | Recap table ("SAVE THIS")              | Camera Angle            |
| **Gallery**    | "One moment, nine reactions"               | Identification / pick-one         | Wordless-ish scenes, one feeling each | (none — the CTA is the payload)        | AI and Emotions         |

**Decision rule (for a command inferring mode from a source):**

- Source is a **single Enneagram type** or any taxonomy → **Lookup**.
- Source is a **situation/scenario** read multiple ways → **Gallery**.
- Source framed as a **mistake the viewer is making** ("you've been misreading people") → **Diagnostic**.
- Source is a **craft/skill to teach** ("how a take reveals someone") → **Generative**.

**Engagement note:** Diagnostic hooks ~3× harder than Generative (the "Cheap AI" deck pulled ~1.8K comments vs ~640). For 9takes, Diagnostic is usually the stronger pick because **"you've been misreading people"** is a real, felt accusation. Lookup wins on _saves_; Gallery wins on _funnel fit_ (see §7).

---

## 3. Beat structures

Three skeletons. Generative and Diagnostic share the teaching-deck beat list; Lookup and Gallery have their own. ★ = mandatory beat — never skip.

### 3a. Teaching deck (Generative / Diagnostic) — the 9-beat engine

Slide count flexes 9–13 by expanding the proof beats (#7).

1. ★ **Hook / curiosity-gap title** — one surprising or accusatory line. Second person beats third. `Swipe →` in serif italic.
2. ★ **Recognition + mystery** — "everyone can feel it, nobody can name it." Promises the viewer the power to _name_ it. (Strongest single beat across both source decks — never skip.)
3. **Mechanism** _(optional)_ — _why the brain/heart responds_. Open-loop framing ("people engage with questions, not images").
4. ★ **Taxonomy / diagnostic grid** — the screenshot-able value. A numbered word-bank or a 4-item "what's wrong" grid, each item + a one-line symptom. End with "most fail in one of these."
5. ★ **Reframe** — kill the obvious misreading, raise the stakes to _meaning / being seen_. One quotable antithesis line.
6. ★ **Formula slide** — the visual peak, on an **inverted light/bright frame**. Venn, pyramid, or equation (§4). Compresses the whole deck into one save-able image.
7. **Proof slides, one per element** — each taxonomy/formula element gets a full-bleed image + a one-line knife. The elastic part (1–4 slides).
8. **Guillotine / checklist** _(optional, high-value)_ — one subtractive rule ("if it doesn't add meaning, cut it") or a 3-question pre-flight checklist. Signals taste; gives a 10-second takeaway.
9. ★ **Payoff + CTA** — restate the thesis _with the "because,"_ then the CTA (§6).

### 3b. Lookup (cheat sheet)

~15–20 slides. The value is the comprehensive reference; the recap is the payload.

```
1.  HOOK     "The [Topic] Cheat Sheet" + italic subhead promising a reference
2.  PROBLEM  "Most [outputs] look the same — not because of [scapegoat], but because [single choice]"
3.  THESIS   "[Technique] = EMOTION"
4..N ENTRY PAIRS, repeated per item:
     a) INFO CARD:  #N: NAME / Use when / Best for [chips] / Creates [chips]
     b) DEMO CARD:  full-bleed image + badge "NAME = Emotion"
     (insert a QUICK RULE interstitial every ~2 entries: "Want X? → A. Want Y? → B.")
N+1 RECAP    "SAVE THIS FORMULA" — the whole map as one list, on the light peak slide
N+2 CTA      participation question + comment-bait
```

### 3c. Gallery (one moment, nine reactions)

~9–11 slides. Wordless-ish; the caption can carry the argument.

```
1.   HOOK    the situation, or "[Theme]" + "Look closer →"
2..N SCENES  one feeling/reaction per slide, identical frame, only the number + reaction change
N+1  CTA     "Which one was you? Comment your number." (pick-one → public comment)
```

---

## 4. The formula slide — four shapes (pick by relationship)

The "save this" peak slide is the most-screenshotted asset. Choose the shape by how the elements relate. Always on an **inverted light/bright frame** — the one slide that pops against the moody rest.

- **Venn (equal, overlapping)** — Weird AI: Contrast + Meaning + Symbol; Story: Character + Conflict + Curiosity. → 9takes: **Situation + Type + Emotion → a take that reveals.**
- **Pipeline (sequence → outcome)** — Marketing: Tools → Distribution → … → Growth. → 9takes: **Notice → Question → Name → Understand.**
- **Pyramid (ranked priority)** — Cheap AI: Emotion > Lighting > Skin. → 9takes: **Emotion > Motive > Behavior** (emotion on top = literally the 9takes thesis).
- **Inequality (X ≠ Y / A = B)** — AI Mistake: More prompts ≠ Better work; Better thinking = Better work. → 9takes: **More opinions ≠ More understanding; More perspectives = More understanding.**

Generative → Additive (Venn). Diagnostic → Hierarchical (Pyramid). Lookup → the recap table is its "formula." Gallery → no formula slide.

---

## 5. Hooks that worked (ranked by observed engagement)

| Hook pattern                                  | Example (iklipse)                   | Likes       | 9takes re-skin                                         |
| --------------------------------------------- | ----------------------------------- | ----------- | ------------------------------------------------------ |
| **"Don't X. Y instead."**                     | Don't Prompt AI. Direct it instead. | **1,476 ★** | Don't judge people. Read them instead.                 |
| **"Why [weird thing] works"**                 | Why Weird AI Works                  | 705         | Why nine answers beat one                              |
| **"Why your X looks cheap"**                  | Why Your AI Looks Cheap             | 664         | Why your read of people is shallow                     |
| **"[Topic] cheat sheet — which X = which Y"** | Camera Angle Cheat Sheet            | 523         | The Enneagram cheat sheet: which type feels which fear |
| **"Who wins — not who you think"**            | Who Wins With AI                    | 231         | Who actually reads people — not who you think          |
| **"What makes people [look]?"**               | What Makes People Look?             | 136         | What makes a take stop you?                            |

**Caption opener that drove the top performer:** a **provocative either/or that implicates the reader** — "Is AI getting stupid, or are you just briefing it badly?" → _"Are people complicated, or are you just bad at reading them?"_

---

## 6. The save-able payload + the CTA menu

### Word-banks / option-menus (the thing people screenshot)

Every strong deck's real value is a **taxonomy slide**. The Enneagram is _already_ a 9-item taxonomy, so this is our highest-leverage asset.

- iklipse "Creates: Trust · Relatability · Authenticity" (per angle) → 9takes **"Type 6 — Driven by: Security · Doubt · Loyalty."**
- Build the canonical **9-type → core fear / core desire recap card** ("SAVE THIS") first — guaranteed-save reference, the single highest-value asset.

### CTAs, ranked

1. **Participation** ("Which one was most you? Comment your number / your type.") — **default for 9takes.** Turns recognition into a comment and feeds the give-first funnel; recognition is the first step toward contributing.
2. **Lead-magnet** ("Comment X, we'll _send_ you the [checklist/cheat sheet].") — farms the most raw comments (iklipse's higher-converting decks use it), but the DM loop may be engagement theater. **Test before committing** (§7).
3. **Keyword + "we'll post more"** — baseline.

---

## 7. Visual system + brand swap (non-negotiable)

The part that makes 9 images read as one object.

- **Fixed chrome on every slide:** wordmark top-left, theme tag top-right, URL bottom-left. This is what turns a slideshow into a recognizable _format_.
  - 9takes: `9takes` · theme tag (`The Nine`, `Reading People`, `Type Decoder`, `Emotional Read Check`) · `9takes.com`
- **Alternating rhythm:** moody full-bleed **photo** slides ↔ clean **diagram** slides. Photos carry emotion; diagrams carry logic. **Never two diagram slides back to back.**
- **Exactly one inverted bright slide** for the formula/recap = the visual peak and the "save this" moment.
- **Type pairing:** heavy condensed sans headline + **serif italic** subhead, consistently. Italic reserved for swipe / payoff / subhead moments only.
- **On-theme imagery proves the point:** every photo is itself an instance of the rule (a 9takes "emotion" slide shows a real, unguarded face).
- **1:1 square, text top-weighted** so it survives the feed crop.

### Brand swap (hard rules)

- **Accent is amber (Streetlamp V5), dark text on amber fills.** **Never red / teal / rose for primary** (teal only as a `data-*` accent). iklipse runs cool/blue/black — we go warm on purpose so it never reads as a clone.
- **The `X = Emotion` overlay becomes an amber pill `Type N = [Emotion]`.**
- **Example imagery is the 9takes Greek-statue-with-emotion motif** (use the `midjourney-prompt` skill, tuned for exactly this) instead of stock photography. For the "raw read > generated read" decks, use deliberately candid, unpolished, real emotion — the medium proving the message.

---

## 8. Format → length menu (match length to idea)

| Format                     | Slides | Mode       | Use for                                                        |
| -------------------------- | ------ | ---------- | -------------------------------------------------------------- |
| **Flagship engine**        | 12–13  | Generative | Core thesis decks (Situation + Type + Emotion)                 |
| **Cheat sheet**            | 15–20  | Lookup     | Evergreen save-bait reference (the 9-type decoder)             |
| **Checklist (FAIL/PASS)**  | 7      | Diagnostic | "Are you reading them right?" self-audit                       |
| **Manifesto (antithesis)** | 8      | Generative | Quotable "Readers X / Others Y" couplets (cheapest to produce) |
| **Gallery (pick-one)**     | 9–11   | Gallery    | "One moment, nine reactions" (best funnel fit)                 |
| **Short trio**             | 5      | Generative | Fast filler between flagships                                  |
| **Process w/ menus**       | 9      | Generative | Step-by-step "how to read someone," each step a menu           |

---

## 9. Worked example — the 9takes instantiation (Diagnostic mode)

**Theme:** _Why you keep misreading people._ The inversion: iklipse teaches you to make images _feel_ human; 9takes teaches you to actually _understand_ humans. Same "Quality Check" framing, applied to emotional intelligence. Note **Emotion → Emotion** is the deliberate bridge that makes it homage, not copy.

| #   | Type                          | Headline                                         | Subhead / body                                                                                                                                                                                                                                     |
| --- | ----------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Photo (conflicted face)       | **This is WHY YOU KEEP MISREADING PEOPLE.**      | _Swipe →_                                                                                                                                                                                                                                          |
| 2   | Photo (looking away)          | **Everyone can feel when they've been misread.** | _They just can't say why. →_                                                                                                                                                                                                                       |
| 3   | Diagram (4 amber rings)       | **4 things that make a take shallow.**           | **One lens** — you only see it your way. · **Snap reaction** — you answer before you understand. · **Fix-it mode** — you solve instead of feel. · **Surface words** — you hear what's said, not what's meant. → _Most takes fail in one of these._ |
| 4   | Photo (unguarded laugh)       | **Real takes make people feel seen.**            | _Shallow takes feel generic, not personal._                                                                                                                                                                                                        |
| 5   | Diagram (amber pyramid)       | **The depth formula.**                           | top→base: **Emotion** (the feeling under the take) · **The Nine Lenses** (one situation, nine ways to see it) · **Give-First** (share before you see). _These three separate a reaction from a read._                                              |
| 6   | Photo (single raw expression) | **Emotion**                                      | _If you miss the feeling, you miss the person._                                                                                                                                                                                                    |
| 7   | Photo (many faces)            | **The Nine Lenses**                              | _One situation. Nine ways to see it. You're using one._                                                                                                                                                                                            |
| 8   | Photo (hands, exchange)       | **Give-First**                                   | _You don't get to see their take until you've shared yours._                                                                                                                                                                                       |
| 9   | CTA (amber gradient)          | **Now you know how to actually read people.**    | **Comment your type** — and tell us which of the four you're guilty of.                                                                                                                                                                            |

---

## 10. The 9takes suite — first decks to build (priority order)

1. **The 9-type decoder cheat sheet** (Lookup) — one card per type (recognize by / driven by / core fear) + "SAVE THIS" 9-type recap. _Highest-value, evergreen, save-bait. Build first — it's the brand-proof and the reusable skin for variants ("The Nine at work / in love / in a crisis")._
2. **"One moment, nine reactions"** (Gallery) — same situation read 9 ways, "comment your number." _Best funnel fit; it IS the product._
3. **"The 3-part formula for reading anyone"** (Flagship + Venn) — Character (their type) + Conflict (what they're up against) + Curiosity (the part they hide) → understanding. _Strongest structural lift, from the Story Formula deck._
4. **"Don't judge people. Read them instead."** (Process + menus) — the #1-performing hook + the provocative either/or caption.
5. **"Why your read of people is shallow"** (Diagnostic + pyramid) — 4 tells → Emotion > Motive > Behavior.
6. **"Who actually reads people — not who you think"** (Manifesto) — antithesis couplets; cheapest to produce.

**Type-pond tie-in:** every deck anchors one Enneagram type; engage that type's pond the same week. Current gap: no published Type 2 or 9 anchor — a Type 2 or 9 deck does double duty.

---

## 11. Production paths

- **Canva (repeatable suite):** the pure type+shape slides (hook, diagram, formula, CTA) build once as a reusable brand template. Photo slides reuse a consistent candid-emotion image set + headline/subhead overlay. (Canva MCP, or `/admin/asset-generators`.)
- **Midjourney (photo slides):** use the `midjourney-prompt` skill (tuned to the 9takes Greek-statue look). Brief for _real texture, real feeling_ — the anti-"plastic skin," itself on-message.
- **Gemini / Nano Banana Pro (text-bearing slides):** the `gemini-imagegen` skill handles text-in-image cleanly — the amber `Type N = Emotion` badges and the formula peak slide.

---

## 12. Engagement log — track ships vs source numbers

Log every shipped 9takes deck here next to its source's numbers, to confirm the pattern transfers. **Don't assume the format works for us — measure it.**

| 9takes deck              | Mode | Date | Likes | Comments | Saves | Source comp |
| ------------------------ | ---- | ---- | ----- | -------- | ----- | ----------- |
| _(first ship goes here)_ |      |      |       |          |       |             |

**Open questions to resolve with the first ships:**

- Is the **comment-keyword → DM cheat sheet** loop a real growth driver, or engagement theater? Test the participation CTA vs lead-magnet CTA head-to-head on two decks.
- Does a **Gallery-deck commenter** convert on the give-first gate better than a cold blog visitor? (Tie to `give_first_funnel_events`.)
- Watch for a **fifth mode** beyond the four here (e.g. tier-list, myth-bust) and add it to §2 if a future source uses one.

---

## 13. How to extend

1. To analyze a new source: create `docs/ai-image-gen/<slug>/source-analysis.md` (or `iklipse-<slug>.md`), transcribe slide-by-slide, capture the beat skeleton + any word-bank verbatim + the CTA keyword.
2. If it reveals a new recurring beat, mode, or formula shape, fold it into the relevant section **here** — keep this file the intersection, don't duplicate transcriptions into it.
3. Update `README.md`'s sources table.
