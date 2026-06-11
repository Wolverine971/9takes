<!-- docs/content-analysis/blog-grading-rubric.md -->

# Blog Quality Grading Rubric (v2)

Standardized scoring system for all personality-analysis blogs on 9takes. **Rubric v2 (2026-05-29)**
reorients grading around what actually drives traffic, after a full-corpus analysis
(`personality-analysis-performance-deep-dive-2026-05-29.md`) showed the old grade barely correlated with
real traffic (r=0.11; hook sub-score r=0.02) while organic-search capture correlated 0.71.

**JSONB column**: `content_quality` on `blogs_famous_people`
**Shape (v2)**: `{ hook, enneagram, evidence, writing, originality, discoverability, overall, letter, rubric_version, graded_at }`

## What changed in v2 and why

- **New dimension: Search & Discoverability.** The single biggest controllable on-page lever we were
  not grading at all. This is the part of "quality" that maps to the next traffic wave (search + AI
  answer engines).
- **Weighted overall, not a flat average.** Evidence, Originality, and Discoverability are weighted
  highest because they're what differentiate a blog that ranks from generic celebrity-profile filler.
  **Hook is weighted lowest** (0.5×) — it had essentially zero correlation with traffic. A great hook
  still helps the reader who lands; it just shouldn't dominate the score.
- **Enneagram Integration is now about accessibility, not typology debate.** Wings, instinctual
  subtypes, stress/growth _mechanics_, and counter-typing **belong in the `<details class="enneagram-rabbit-hole">`
  accordion — not the main body.** The grader no longer rewards (and actively penalizes) insider
  typology bleeding into the narrative, and it checks that the rabbit hole _exists_ and holds that depth.
- **The grade is a floor + a differentiation signal, not a traffic prediction.** Subject search-demand
  (handled upstream by `/find-surging-people`) and index age drive traffic more than craft. Grade for
  publishability and discoverability; choose subjects for demand.

---

## Scoring Dimensions

Each scored 1–10. Weights are applied in the overall calculation (see below).

### 1. Evidence / Sourcing — **Weight: 1.5×**

The quality and specificity of quotes, anecdotes, testimony, and sourced material. Highest-weighted
because specific, citable evidence is what separates us from AI-generated celebrity filler — and it's
exactly what AI answer engines quote (the AEO bet).

| Score | Level             | Criteria                                                                                                                                                                                                                                                                                                                   |
| ----- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | 90%+ is the subject's own words or testimony from people around them. Direct quotes are specific, dated, and sourced. Multiple sources (interviews, books, podcasts, collaborator testimony). Revenue/metrics sourced. The person's voice is _heard_, not summarized. _Examples: Paris Hilton, Pedro Pascal, Hasan Piker._ |
| 7-8   | **Good**          | Solid mix of direct quotes and paraphrase. Key claims sourced. 3-5 specific, attributed quotes. Some collaborator testimony.                                                                                                                                                                                               |
| 5-6   | **Average**       | Some quotes but heavy on paraphrase. Sources vague ("in an interview"). Key metrics unsourced.                                                                                                                                                                                                                             |
| 3-4   | **Below Average** | Mostly paraphrase with 1-2 generic quotes. No sourced metrics.                                                                                                                                                                                                                                                             |
| 1-2   | **Poor**          | No direct quotes. No sourced claims. Pure speculation.                                                                                                                                                                                                                                                                     |

### 2. Originality — **Weight: 1.5×**

How fresh the analysis feels — does it say something new, and does it pass the swap test? Highest-weighted
because differentiation is what earns links, shares, and durable rankings.

| Score | Level             | Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | At least one insight the reader genuinely hasn't encountered. A "signature detail" — a small specific moment that makes the whole analysis click. Public/private gap explored. Childhood-to-adult thread visible. Faces a real critic/skeptical pressure point. Includes a current-tense or legacy-now anchor. Passes the swap test — replace the name and the analysis breaks. _Examples: Peter Thiel's Tolkien thread, Satya Nadella's pharmacy moment, Paris Hilton's nightmares stopping after the documentary._ |
| 7-8   | **Good**          | Some original observations alongside known material. At least one surprising angle. Private details present but not deeply explored.                                                                                                                                                                                                                                                                                                                                                                                 |
| 5-6   | **Average**       | Competent compilation of public knowledge through an Enneagram lens. No surprising insights. Mostly fails the swap test (too generic).                                                                                                                                                                                                                                                                                                                                                                               |
| 3-4   | **Below Average** | Rehashes widely known info. No private details. No original framing.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 1-2   | **Poor**          | Pure regurgitation. Nothing beyond Wikipedia.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

### 3. Search & Discoverability — **Weight: 1.5× — NEW in v2**

Is this blog built to be _found_ and to _answer the query_? This is the on-page lever that most directly
feeds the 0.71-correlated search channel and the growing AI-answer channel. The grader assesses the
frontmatter and structure, not just the prose.

**What to check:**

- **Search-intent titling.** Does `title` / `meta_title` / `persona_title` match how people actually
  search this person (`[Person] enneagram`, `[Person] personality type`, `what type is [Person]`)? Is the
  person's name early and exact? `meta_title` 35–65 chars; `description` 120–170 chars and CTR-worthy.
- **The answer is clear, early, and extractable.** The "What is [Person]'s personality type?" section
  gives a direct, skimmable answer a reader _or an AI engine_ can lift in one block. No burying the type.
- **AEO structure.** Real FAQ schema (`faqs`) built from genuine search-intent questions; specific,
  quotable, citable claims; `same_as` / entity metadata present. Headings use search-intent phrasing
  where natural (not keyword-stuffed, but discoverable).
- **Scannability for the landing reader.** A Google visitor can get the payoff without reading 4,000
  words — TL;DR, clear H2s, the type answer up top.

| Score | Level             | Criteria                                                                                                                                                                                                                                                        |
| ----- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | Title/meta/description nail search intent and are length-optimal. Type answer is direct, early, and quotable. Strong FAQ schema on real questions. Entity metadata complete. An AI engine could cite this cleanly; a Google visitor gets the answer in seconds. |
| 7-8   | **Good**          | Solid search-intent titling and a clear answer. FAQ present. Minor length or phrasing misses.                                                                                                                                                                   |
| 5-6   | **Average**       | Generic or clever-but-unsearchable title. Answer present but buried or vague. Thin/missing FAQ. Metadata gaps.                                                                                                                                                  |
| 3-4   | **Below Average** | Title doesn't match how anyone searches the person. No clear extractable answer. No FAQ schema. Description missing or wrong length.                                                                                                                            |
| 1-2   | **Poor**          | Undiscoverable. No search-intent signal anywhere; the type answer is absent or unfindable.                                                                                                                                                                      |

### 4. Enneagram Integration — **Weight: 1.0×**

How deeply and naturally the Enneagram drives the analysis **while keeping the main body accessible to a
general reader.** In v2 this dimension rewards _clarity and person-first insight_, not typology debate.

**Where the typology depth goes (important):** Wings, instinctual subtypes, stress/growth _mechanics_,
and counter-typing cases belong **inside the `<details class="enneagram-rabbit-hole">` accordion**, not
the main narrative. Casual readers scroll past; power readers and long-tail/AI queries
(`[Person] 5w6`, `[Person] sx/so`, `[Person] integration to 8`) get served there.

**Reward in the body:** core motivation/fear that resolves a real contradiction; the center's core
emotion _felt_, not just named (anger/shame/fear), when it reveals something non-obvious; fresh,
person-specific language (archetype name appears once for ID, then the piece invents its own vocabulary).

**Emotional interior check (required for 9-10).** The Enneagram's engine is emotion and motivation —
"see the emotions behind every take." After reading, the answer to all three must be yes:

1. **Felt interior:** Can the reader answer _what this person fears, wants, and feels_ — in the
   person's own vocabulary (sourced from their quotes), not the textbook type description?
2. **Empathy turn:** Does at least one widely criticized or mocked behavior become _understandable_
   through its motivation — without being excused? (The critic-pressure anchor brings the judgment;
   the empathy turn resolves it.)
3. **Interior beat:** Is at least one moment rendered from _inside_ the person's feeling — the reader
   briefly being them, not observing them?

**Penalize:** wing/subtype/arrow _mechanics_ in the body; 3+ adjacent type-vs-type comparisons outside
the diagnosis section; stock clichés ("classic Challenger," "typical Enthusiast"); a type stated but
never substantiated. **Do not award credit for insider typology in the body — that belongs in the rabbit
hole.** A missing rabbit hole when wing/subtype/arrow analysis is warranted caps this dimension at 8.
**A piece that stays entirely behavioral — pattern named, fear never felt — also caps this dimension
at 8**, no matter how sharp the pattern analysis is.

| Score | Level             | Criteria                                                                                                                                                                                                                                                                                                                |
| ----- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | The Enneagram explains something non-obvious; a driving contradiction resolves through the type. Core motivation/emotion explored with depth — the reader _feels_ it. Language is fresh and person-specific. The body stays accessible; all wing/subtype/arrow/counter-typing depth lives in a well-formed rabbit hole. |
| 7-8   | **Good**          | Type clearly identified with behavioral evidence; goes beyond labeling. Core emotion named. Body mostly accessible. Rabbit hole present but thin, OR slight typology bleed into the body.                                                                                                                               |
| 5-6   | **Average**       | Type stated and mapped but descriptive, not explanatory. Stock language. Could swap the label and observations still read similarly. Typology mechanics scattered in the body instead of quarantined.                                                                                                                   |
| 3-4   | **Below Average** | Enneagram feels bolted on; behaviors listed then labeled. Heavy cliché. Body bogged in type-vs-type debate. No rabbit hole.                                                                                                                                                                                             |
| 1-2   | **Poor**          | Type stated once, never substantiated, or the typing feels wrong and undefended.                                                                                                                                                                                                                                        |

### 5. Writing Quality — **Weight: 1.0×**

Prose, structure, pacing, visual rhythm, and 9takes voice (tactically direct, socially savvy,
respectfully provocative). **In v2 this dimension absorbs the opening/hook** as one component among many.

**Visual rhythm matters:** vary paragraph length (short punchy lines between longer analysis); never
stack dense paragraphs back-to-back; use **bold**, _italics_, and blockquotes to guide the eye;
emotional immersion over information delivery (put the reader in the room).

| Score | Level             | Criteria                                                                                                                                                                                                                                                                                                                                          |
| ----- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | Distinctive prose, memorable lines. A strong specific opening that earns the read. Excellent visual rhythm; formatting guides the eye; emotionally immersive scenes. Sections flow as narrative. Ending cuts to black at peak insight — no summary, no CTA. No repeated quote/anecdote. Confident framing. No visible house-template fingerprint. |
| 7-8   | **Good**          | Clean, readable, good structure, some memorable lines. Decent opening. Occasional dense stacking or mild hedging. Template visible but not distracting.                                                                                                                                                                                           |
| 5-6   | **Average**       | Competent but unremarkable. Report-like. Dense paragraphs stack. Generic opening. Conventional ending. Visible contrast-pair / counter-typing architecture.                                                                                                                                                                                       |
| 3-4   | **Below Average** | Flat or formulaic. Wall-of-text. Over-hedged. Generic "X is known for…" opening. Template shows before the insight.                                                                                                                                                                                                                               |
| 1-2   | **Poor**          | AI slop. No voice, no rhythm, unformatted blocks.                                                                                                                                                                                                                                                                                                 |

### 6. Hook — **Weight: 0.5×**

How effectively the opening grabs the reader and frames the central question. **Weighted lowest in v2**
(near-zero traffic correlation), but still scored: a good hook helps the landing reader stay.

| Score | Level             | Criteria                                                                                                                                                                                                                                           |
| ----- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | Opens on a specific, surprising moment that reveals character _and_ creates a question. Thesis clear within 3-5 paragraphs. A Google-landing reader stays. _Examples: Peter Thiel's parachute after 9/11, Blake Lively's Taylor Swift court text._ |
| 7-8   | **Good**          | Strong concrete scene or quote; central tension stated within a few paragraphs.                                                                                                                                                                    |
| 5-6   | **Average**       | General observation about fame/career. No specific moment. Vague central question.                                                                                                                                                                 |
| 3-4   | **Below Average** | Generic biographical opening. No tension, no scene.                                                                                                                                                                                                |
| 1-2   | **Poor**          | Wikipedia summary from sentence one.                                                                                                                                                                                                               |

### Formula Fingerprint Checks (apply across Writing + Enneagram)

Brand-level writing risks, not minor preferences:

- **Repeated contrast-pair engines** ("not X but Y," "less X than Y," "looked like X, was really Y"):
  > 2 main-body uses caps Writing at 8; if it drives the whole piece, cap at 6.
- **Counter-typing ladders in the body**: 3+ adjacent alternate-type comparisons outside the diagnosis
  section or rabbit hole caps Enneagram Integration and Writing at 8.
- **Ducked critic pressure**: an obvious controversy/critique avoided caps Originality at 8 (7 if it
  reads sanitized).
- **Missing current-tense anchor**: a living figure with no event/project/shift from the last 24 months
  caps Originality at 8. Historical figures need a present-day legacy stake instead.
- **Ending swap-test failure**: if the final paragraph could close other 9takes posts by swapping the
  name/type, cap Writing at 8.

---

## Overall Score Calculation (v2 weighted)

```
Overall = ( Evidence×1.5 + Originality×1.5 + Discoverability×1.5
          + Enneagram×1.0 + Writing×1.0 + Hook×0.5 ) / 7.0
```

Rounded to one decimal. (Total weight = 1.5+1.5+1.5+1.0+1.0+0.5 = 7.0 — divide by 7.0 so the
result stays on the 1–10 scale. An earlier version of this doc said 6.0, which would inflate
every score; a straight-9s blog would compute to 10.5.)

> **Note:** v2 overalls are **not directly comparable** to v1 (flat-average) overalls. Always write
> `rubric_version: 2` and `graded_at`. Treat a v1-graded blog as needing a re-grade before comparison.

### Letter Grade Mapping

| Grade  | Score Range | Meaning                                                |
| ------ | ----------- | ------------------------------------------------------ |
| **A+** | 9.5-10.0    | Best in collection. Publish and promote.               |
| **A**  | 9.0-9.4     | Gold standard. Ready to publish.                       |
| **B+** | 8.5-8.9     | Strong. Publication threshold met.                     |
| **B**  | 8.0-8.4     | Good but needs targeted improvements.                  |
| **C**  | 7.0-7.9     | Average. Needs significant revision before publishing. |
| **D**  | 6.0-6.9     | Below average. Major rewrite needed.                   |
| **F**  | Below 6.0   | Not publishable. Start over or archive.                |

**Publication threshold**: 8.5 (B+). A blog **cannot** reach B+ with Discoverability < 7 — discoverability
is a gate, not just a weighted input. A beautifully written, undiscoverable blog is not publication-ready.

---

## Grading Process

1. Read the blog in full without scoring.
2. Score each of the 6 dimensions independently (don't let one pull the others).
3. **Check the rabbit hole explicitly:** does typology depth (wings/subtypes/arrows/counter-typing) live
   in `<details class="enneagram-rabbit-hole">` rather than the body? Adjust Enneagram Integration
   accordingly.
4. **Check discoverability against frontmatter:** title/meta_title/description lengths and search-intent
   match, FAQ schema presence, clear early type answer.
5. Compute the weighted overall and letter grade. Apply the Discoverability < 7 → can't-be-B+ gate.
6. Record the JSONB object:

```json
{
	"hook": 8.0,
	"enneagram": 8.5,
	"evidence": 9.0,
	"writing": 8.5,
	"originality": 8.5,
	"discoverability": 8.0,
	"overall": 8.5,
	"letter": "B+",
	"rubric_version": 2,
	"graded_at": "2026-05-29"
}
```

7. Push to `blogs_famous_people.content_quality` via:
   - `node scripts/personBlogParser.js --grades-only --changed` (recommended for graded drafts)
   - Seed script or admin UI (fallback/manual workflows)

---

## Quick Reference: What separates the tiers in v2

### Gold Standard (A / A+):

- One driving thesis that resolves a public contradiction (Originality + Enneagram).
- **Discoverable:** search-intent title, clean extractable type answer, real FAQ schema, citable evidence.
- Direct quotes as structural evidence, not decoration (Evidence).
- A signature detail that makes the analysis click; passes the swap test (Originality).
- Body stays accessible; **all wing/subtype/arrow depth lives in a well-formed rabbit hole** (Enneagram).
- Visual rhythm that glides; an ending that cuts to black (Writing).

### Strong (B+): most of the above, may miss the sharpest aha, deepest emotional immersion, or perfect titling — but Discoverability ≥ 7.

### Average (C): labels rather than explains the type; paraphrase over quotes; clever-but-unsearchable title; typology scattered in the body; conventional ending.

### Below threshold (D/F): no thesis, cosmetic Enneagram, Wikipedia sourcing, undiscoverable, flat prose.

---

## Reference Examples (craft anchors — re-grade under v2 before trusting the overall)

| Craft level | Blog           | Why (dimension highlights)                                                                                    |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| Top         | Dave Portnoy   | Best hook in collection; Type 8 paradox drives every section; exceptional evidence + rhythm.                  |
| Top         | Greta Thunberg | Selective-mutism→global-speaker paradox; core emotion as engine; exceptional counter-typing (in rabbit hole). |
| Top         | Charli XCX     | Manifesto-as-spontaneity thesis; SOPHIE grief immersion; sophisticated 3w4 depth (rabbit hole).               |
| High        | JD Vance       | "Empathy as intellectual achievement"; Ford's Theatre cut-to-black ending.                                    |
| Threshold   | Logan Paul     | Good thesis + faith arc but fewer signature moments.                                                          |

---

## When to Re-Grade

- After any substantive content revision (not just typos).
- When new sourced material is added.
- **When migrating a v1 grade to v2** (most of the corpus — v1 overalls are stale under the new weights).
- During periodic quality audits (quarterly).
- Always update `graded_at` and set `rubric_version: 2`.
