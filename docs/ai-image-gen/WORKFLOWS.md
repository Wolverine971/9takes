<!-- docs/ai-image-gen/WORKFLOWS.md -->

# 9takes Carousel Workflows — Build Spec

The decoding phase (this folder) is done: 14 @iklipse\_ decks reverse-engineered into a reusable engine, with a brand swap locked. This doc turns that decoded engine into **production workflows** — pipelines that wire existing 9takes tooling into finished carousels at volume.

**Read first:** [`CAROUSEL-SPEC.md`](./CAROUSEL-SPEC.md) — the canonical engine (modes, beats, formula shapes, brand swap, format menu). This doc assumes it.

**The mental model:** a carousel is a transform.

```
Source → Template → Copy → Image prompts → Assembled deck → Post + engagement plan
```

Every stage already has a 9takes tool. None are connected. These workflows connect them.

| Stage                       | Existing tool                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| Source content              | blog corpus, DB people analyses, `docs/instagram/post-ideas/2026-04-29_top-tier-people-tidbits.md` |
| Idea extraction             | `/content-repurposing-engine`                                                                      |
| Carousel copy               | `/distribute-instagram` (predates this decoding — does not yet follow the iklipse beats)           |
| Image prompts               | `midjourney-prompt` skill (73+ proven templates; Greek-statue-with-emotion is canonical)           |
| Image bytes + text-in-image | `gemini-imagegen` skill (Nano Banana Pro — badges, formula slides)                                 |
| Assembly                    | `/admin/asset-generators`, Canva MCP                                                               |
| Distribution + engagement   | `/distribute-instagram`, type-pond strategy, instrumented give-first funnel                        |

---

## Workflow 0 — Consolidate the spec ✅ DONE (2026-06-29)

**Why:** `README.md`, `CAROUSEL-PLAYBOOK.md`, and `_TEMPLATE-9takes-carousel-system.md` overlapped ~80%. Three sources of truth means a command can't reliably inline "the spec." Collapsed to one.

**Result:** [`CAROUSEL-SPEC.md`](./CAROUSEL-SPEC.md) is now the single canonical spec. `CAROUSEL-PLAYBOOK.md` and `_TEMPLATE-9takes-carousel-system.md` reduced to pointer stubs; `README.md` reduced to a folder index that points at the spec.

- **Input:** the three synthesis docs.
- **Output:** `docs/ai-image-gen/CAROUSEL-SPEC.md` — based on `CAROUSEL-PLAYBOOK.md`, with the format menu + hooks table from `_TEMPLATE` and the named templates from `README` folded in. The per-post `source-analysis.md` files remain the evidence layer.
- **Sections the spec contains (a command can inline them verbatim):**
  1. The one-sentence engine.
  2. The four modes — Generative / Diagnostic / Lookup / Gallery — with a "pick one" decision rule.
  3. The canonical beat list (★ = mandatory).
  4. The four formula-slide shapes (Venn / Pipeline / Pyramid / Inequality) + when to pick each.
  5. The visual system + the non-negotiable brand swap (amber Streetlamp, dark-on-amber, Greek-statue imagery, fixed chrome).
  6. The CTA menu (lead-magnet / participation / keyword), ranked.
  7. The format → length table.
- **Definition of done:** README and \_TEMPLATE get reduced to short pointers at `CAROUSEL-SPEC.md` (keep the "how to add a new source" instructions in README). One spec, no drift.
- **Effort:** ~1 session, mechanical.

---

## Workflow 1 — The Carousel Factory (flagship) ✅ BUILT (2026-06-29)

Shipped as `.claude/commands/carousel.md` — a self-sufficient `/carousel <source> [mode]` command with the full engine inlined. Not yet battle-tested on a live run; first run doubles as the Workflow 2 build.

A single self-sufficient slash command that runs the full transform. This is the thing that turns one decode into infinite decks.

- **Command:** `/carousel <person | type | blog-path> [mode]`
  - Modes: `lookup` (cheat sheet), `diagnostic` ("why your X is broken"), `gallery` (one moment / nine reactions), `flagship` (trio → Venn). Default: infer from source (a single type → lookup; a situation → gallery; a "mistake" framing → diagnostic).
- **Self-sufficiency rule:** inline the relevant `CAROUSEL-SPEC.md` sections directly in the command file, the same way `/distribute-instagram` inlines its frameworks. Agents don't reliably read out-linked docs. (See feedback memory: claude-commands-self-sufficient.)

**Pipeline stages**

1. **Resolve source.** Person → check the tidbits file first (`2026-04-29_top-tier-people-tidbits.md`); fall back to the DB analysis / blog text. Type → pull the enneagram blog. Blog path → read it.
2. **Select mode + template** per the spec's decision rule (or honor the explicit arg).
3. **Generate beat copy.** Produce every slide in the canonical beat order, with the mandatory ★ beats present. Emit the word-bank/taxonomy slide verbatim (the save-able payload) and exactly one bright formula/recap peak slide.
4. **Generate image prompts.** For each photo slide, call the `midjourney-prompt` skill brief (Greek-statue-with-emotion) with the slide's named emotion. For text-bearing slides (badges, the formula peak), spec a `gemini-imagegen` brief instead.
5. **Emit assembly spec.** A slide-by-slide table: slide #, role, headline, subhead, image prompt or diagram spec, chrome (`9takes` / theme tag / `9takes.com`). Plus caption, the ranked CTA pick, and the comment-bait keyword.
6. **Emit engagement plan.** Which Enneagram type this deck anchors, and the type-pond to engage that week (ties to the type-pond strategy memory).

- **Output location:** `docs/distribution-assets/<slug>-carousel.md` (matches `/distribute-instagram` convention).
- **Dependencies:** Workflow 0 (the spec to inline). Optionally calls Workflow 4 for the actual image bytes.
- **Definition of done:** running `/carousel <person>` produces a deck a designer (or Canva MCP) can build with zero further decisions.
- **Effort:** ~1–2 sessions to author + tune against 2–3 real runs.

---

## Workflow 2 — The 9-Type Decoder (build once, hand-quality)

The highest-value evergreen asset. Every synthesis doc names it #1, correctly: the Enneagram is _already_ a 9-item taxonomy, so the Lookup Table template is a native fit. Build it gorgeously **once** → it becomes the reusable **skin** for every variant.

- **Format:** Lookup Table / cheat sheet (~20 slides), per the Camera Angle model.
- **Per-type info card:** `TYPE #N — THE [NAME]` / _Recognize by:_ [behavior] / _Driven by:_ [core-motivation chips] / demo image badge `Type N = [core fear or desire]`.
- **Interstitial "quick rule" slides:** every ~2 types — "Want the truth fast? → Ask an 8. Want everyone to feel okay? → Ask a 9."
- **The payload slide:** one light/inverted "SAVE THIS" recap card — all nine `Type = Emotion` lines. This is the screenshot the deck exists to create.
- **CTA:** participation — "Comment your type" (best give-first funnel fit).
- **Why build it by hand first:** it's the brand-proof. Validates the template, the amber system, and the Greek-statue image set before any of it gets automated. Then "The Nine at work / in love / in a crisis" are re-skins of the same deck — change the _Recognize by_ / _Driven by_ lines, keep the chassis.
- **Strategic double-duty:** the type-pond memory flags **no published Type 2 or 9 anchor**. If you'd rather start smaller than a full 9-type deck, a single Type 2 or Type 9 Diagnostic deck fills that gap _and_ shakes out the template.
- **Output:** a finished deck (Canva file via MCP, or asset-gen export) + the reusable template saved as a brand template.
- **Dependencies:** Workflow 4 for the nine demo images.
- **Definition of done:** a published deck + a saved reusable skin for the variant series.

---

## Workflow 3 — Blog → Carousel feeder (highest leverage)

Plug the decoded engine _into_ the blog pipeline so every post you ship daily suggests and drafts its own carousel. Rides volume you're already producing.

- **Where it lives:** extend `/content-repurposing-engine`. Today it mines a blog into a content inventory. Add a step: **match the blog to a carousel mode** (a "mistake" post → diagnostic; a taxonomy post → lookup; a "9 reactions" post → gallery) and hand off to `/carousel`.
- **Pipeline:** blog publish → repurposing engine tags carousel-eligible blogs + recommends a mode → `/carousel` drafts the deck → lands in `docs/distribution-assets/`.
- **Batch mode:** point it at a category (e.g. all of `src/blog/enneagram/`) and fan out one carousel draft per post.
- **Dependencies:** Workflow 1.
- **Definition of done:** publishing a blog auto-produces a carousel draft with no extra prompt. Your blog cadence becomes your carousel cadence.

---

## Workflow 4 — The image-gen quality loop (where "extremely good" lives)

The decks live or die on the Greek-statue-emotion imagery. Generic AI faces = the exact "cheap AI" failure iklipse mocks. This loop enforces the bar.

- **Loop:**
  1. `midjourney-prompt` skill builds the brief for the slide's named emotion (Greek statue, real texture, real feeling — the anti-plastic-skin brief, which is itself on-message).
  2. Generate.
  3. **Vision critique pass:** read the image back — does the face actually carry the _named_ emotion? Is it on-brand amber? Any AI tells (plastic skin, broken hands, dead eyes)?
  4. Regenerate with a tightened brief until it lands (cap at N iterations; log what got dropped).
- **Text-bearing slides:** route to `gemini-imagegen` (Nano Banana Pro handles text-in-image cleanly) — the amber `Type N = Emotion` badges and the formula peak slide.
- **Reusable output:** a curated, on-brand **candid-emotion image set** that slides 3/5/9-type decks all draw from, so you're not regenerating per deck.
- **Dependencies:** none hard; this is the subroutine Workflows 1 and 2 call.
- **Definition of done:** a vetted image library keyed by emotion + a repeatable generate→critique→regenerate loop that other workflows invoke.

---

## Workflow 5 — "One Moment, Nine Reactions" (the funnel weapon)

The strongest differentiator and the best give-first fit. One situation, nine identical-frame slides where only the number + reaction change. It _demos the product mechanic directly_.

- **Format:** Gallery (~9–11 slides). Cover (the situation) → 9 reaction slides → participation CTA.
- **Engine:** freeze one scenario ("You got passed over for the promotion") → nine same-frame slides, `TYPE 1: "This was unfair and I can prove it." … TYPE 9: "It's fine. Probably for the best."`
- **CTA:** "Which one was you? Comment your number." — converts private recognition into a public comment, the first step of the give-first funnel.
- **Why its own engine:** it's wordless-ish + pick-one, a different shape from the teaching decks, and it ties straight to the instrumented give-first wall (`give_first_funnel_events`). Worth instrumenting: does a gallery-deck commenter convert on the give-first gate better than a cold blog visitor?
- **Scenario bank:** maintain a running list of high-recognition situations (breakup text, passed-over promotion, group chat goes quiet, in-laws, the late reply) — each becomes one deck.
- **Dependencies:** Workflow 4 for the consistent same-frame reaction shots (hardest image ask — nine faces, one framing, one lighting).
- **Definition of done:** a repeatable scenario → 9-reaction deck, with funnel instrumentation tagged so we can measure whether it out-converts other entry points.

---

## Recommended sequence

1. **Workflow 0** — consolidate to `CAROUSEL-SPEC.md` (mechanical, unblocks everything).
2. **Workflow 1** — `/carousel` command (the chassis).
3. **Workflow 2** — produce the 9-Type Decoder off it (proves the template + brand).
4. **Workflow 4** — the image quality loop (makes it actually good).
5. **Workflow 3** — the blog feeder (scales it on existing volume).
6. **Workflow 5** — the gallery funnel weapon (the differentiator, once the chassis is proven).

## Cross-cutting notes

- **Brand swap is non-negotiable** on every workflow: amber Streetlamp, dark text on amber, Greek-statue-with-emotion, fixed chrome (`9takes` / theme tag / `9takes.com`). Never red/teal/rose for primary.
- **CTA default:** participation ("comment your type/number") over keyword lead-magnet — it's the better give-first funnel fit even though lead-magnet farms more raw comments.
- **Type-pond tie-in:** every deck anchors one Enneagram type; engage that type's pond the same week. Current gap: no published Type 2 or 9 anchor.
- **Measure the loop:** once a deck ships, log its engagement next to the iklipse source numbers (in [`CAROUSEL-SPEC.md`](./CAROUSEL-SPEC.md) §12) to confirm the pattern transfers. Don't assume — the comment-keyword→DM loop may be engagement theater; test on one deck first.
