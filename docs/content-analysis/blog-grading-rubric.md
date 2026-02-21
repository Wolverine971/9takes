<!-- docs/content-analysis/blog-grading-rubric.md -->

# Blog Quality Grading Rubric

Standardized scoring system for all personality analysis blogs on 9takes. Every blog is scored on 5 dimensions (1-10 scale each), producing an overall score and letter grade. Use this rubric to ensure consistent, fair assessments across all content.

**JSONB column**: `content_quality` on `blogs_famous_people`
**Shape**: `{ hook, enneagram, evidence, writing, originality, overall, letter, graded_at }`

---

## Scoring Dimensions

### 1. Hook (Weight: 1x)

How effectively the opening grabs the reader and establishes the piece's central question.

| Score | Level             | Criteria                                                                                                                                                                                                                                                                                                                                                   |
| ----- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | Opens with a specific, surprising moment that reveals character _and_ creates a question the reader needs answered. The thesis is clear within 3-5 paragraphs. A reader who lands on this page from Google stays. _Examples: Peter Thiel's parachute after 9/11, Blake Lively's Taylor Swift court text, Mikey Madison's acid-trip painting for Tarantino_ |
| 7-8   | **Good**          | Strong opening with a concrete scene or quote. Central tension is stated but may take a few extra paragraphs to crystallize. Reader is engaged but not riveted.                                                                                                                                                                                            |
| 5-6   | **Average**       | Opens with a general observation about the person's fame or career. No specific moment anchors the reader. Central question is vague or absent.                                                                                                                                                                                                            |
| 3-4   | **Below Average** | Generic biographical opening ("X is known for..."). No tension, no question, no scene. Reader could leave after the first paragraph without losing anything.                                                                                                                                                                                               |
| 1-2   | **Poor**          | No hook whatsoever. Reads like a Wikipedia summary from sentence one.                                                                                                                                                                                                                                                                                      |

### 2. Enneagram Integration (Weight: 1x)

How deeply and naturally the Enneagram framework drives the analysis rather than being bolted on.

**Key elements (in order of importance):**

- **Core motivations**: What drives this person at the deepest level? The type's core fear and desire should explain behavior that otherwise seems contradictory.
- **Core emotions**: Each Enneagram center carries a dominant emotion — anger (body/gut types: 8, 9, 1), shame (heart types: 2, 3, 4), and fear (head types: 5, 6, 7). The best blogs sit _inside_ that emotion and show the reader what it feels like. _Example: Greta Thunberg's steady burning anger at imperfection (Type 1), Dax Shepard's lifelong war with shame (Type 7), Chappell Roan's Catholic guilt beneath the strength (Type 8)._ Mention the core emotion only when it reveals something non-obvious — "this software engineer is intellectual" adds nothing; "this comedian's anger drives her comedy" does.
- **Stress/growth arrows**: How the person behaves under pressure (disintegration) and in health (integration). These often produce the most surprising insights. _Example: Chappell Roan's Type 8 moving toward Type 2 people-pleasing in relationships, Doja Cat's Type 7 disintegrating toward Type 1 harsh self-criticism during the Paraguay meltdown._
- **Instinctual variants**: Self-preservation, social, or sexual/one-to-one — woven in when they illuminate something specific, not as a checklist item.
- **Fresh language over Enneagram clichés**: Avoid recycling the same stock phrases for each type. Don't write "that's such a Challenger thing to do" or lean on the archetype names ("the Enthusiast," "the Peacemaker") as descriptive shorthand throughout the piece. Mention the traditional name once for identification, then move on to _person-specific_ language that captures the same psychology in a way unique to this subject. The best blogs invent their own vocabulary for the type's patterns. _Examples of fresh language vs. clichés:_
  - **Type 8 cliché**: "As a Challenger, Dave confronts everyone." → **Fresh** (Dave Portnoy): "The Combustion Engine" — "if I don't get it out, I just combust."
  - **Type 3 cliché**: "She's such an Achiever, always performing." → **Fresh** (Charli XCX): "The sound of something fighting itself." The manifesto. The hamster wheel. The machinery behind the curtain.
  - **Type 7 cliché**: "He's an Enthusiast who avoids pain." → **Fresh** (Dax Shepard): "The only meditation some people can access" (about riding at 140 mph). "The pain-to-motion pipeline."
  - **Type 3 cliché**: "He adapts to every room like a typical Achiever." → **Fresh** (JD Vance): "Who you are depends on who's in the room." "Empathy arrived not as instinct but as intellectual achievement."
  - **Type 9 cliché**: "She's so numb, she disappears, she loses herself." → **Fresh**: Find the specific _way_ this person goes numb, the particular thing they merge with, the unique cost of their disappearing act.

| Score | Level             | Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | The Enneagram _explains something non-obvious_ about the person. A driving contradiction is resolved through the type. Core motivations and core emotions are explored with depth — the reader _feels_ the emotion, not just reads about it. Stress/growth arrows are woven in naturally. Counter-typing is addressed. The language is fresh and person-specific — the traditional type name appears once for identification but the analysis uses its own vocabulary, not recycled Enneagram clichés. _Examples: Dax Shepard's "pain-to-motion pipeline" (not "Enthusiast avoidance"), Charli XCX's "the machinery behind the curtain" (not "Achiever performance"), Greta's "moral mathematics" (not "Reformer idealism")_ |
| 7-8   | **Good**          | Type is clearly identified and supported with behavioral evidence. Some integration of stress/growth arrows. Core emotion is named but not deeply explored. Language mostly avoids clichés but may lean on archetype names or stock phrases occasionally. The analysis goes beyond surface labeling but doesn't achieve the "aha moment" where the framework cracks something open.                                                                                                                                                                                                                                                                                                                                          |
| 5-6   | **Average**       | Type is stated and some behaviors are mapped to it, but the Enneagram feels descriptive rather than explanatory. Core emotions and motivations are absent or generic. Relies on stock Enneagram language ("as a typical Type X," "this is classic Challenger behavior"). Could swap the type label and the observations would still read similarly.                                                                                                                                                                                                                                                                                                                                                                          |
| 3-4   | **Below Average** | Enneagram is mentioned but feels like an afterthought. Behaviors are listed then labeled ("this is very Type X") without deeper analysis. Heavy reliance on archetype names and clichéd descriptions. No counter-typing, no arrows, no exploration of core emotions.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 1-2   | **Poor**          | Type is stated once and never substantiated. Or the typing feels wrong and isn't defended.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### 3. Evidence / Sourcing (Weight: 1x)

The quality and specificity of quotes, anecdotes, testimony, and sourced material.

| Score | Level             | Criteria                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | 90%+ is the subject's own words or testimony from people around them. Direct quotes are specific, dated, and sourced. Multiple sources (interviews, books, podcasts, collaborator testimony). Revenue/metrics are sourced. The person's voice is _heard_, not summarized. _Examples: Paris Hilton (nearly all quotes), Pedro Pascal (NPR, Guardian, Esquire, Men's Health, Vanity Fair), Hasan Piker (direct quotes throughout)_ |
| 7-8   | **Good**          | Solid mix of direct quotes and paraphrase. Key claims are sourced. At least 3-5 specific, attributed quotes. Some co-star/collaborator testimony present.                                                                                                                                                                                                                                                                        |
| 5-6   | **Average**       | Some quotes but heavy on paraphrase. Sources are vague ("in an interview," "she once said"). Key metrics unsourced. Collaborator perspectives missing.                                                                                                                                                                                                                                                                           |
| 3-4   | **Below Average** | Mostly paraphrase with 1-2 generic quotes. No sourced metrics. Reads like the author's interpretation without evidence.                                                                                                                                                                                                                                                                                                          |
| 1-2   | **Poor**          | No direct quotes. No sourced claims. Entirely the author's speculation.                                                                                                                                                                                                                                                                                                                                                          |

### 4. Writing Quality (Weight: 1x)

Prose quality, structure, pacing, visual rhythm, and adherence to the 9takes voice (tactically direct, socially savvy, respectfully provocative).

**Visual rhythm and readability** are critical. The reader's eye needs to glide down the page. Key principles:

- **Vary paragraph length.** Alternate short, punchy lines (1-2 sentences) with longer analytical paragraphs. You earn the right to a dense paragraph by warming the reader up with shorter ones first. _Example from Dave Portnoy: "He bought Barstool back for $1." then "One dollar." then the longer explanation._ _Example from Dax Shepard: "He was high on opioids the entire time." — one sentence, its own paragraph, devastating._
- **Never stack dense paragraphs back-to-back.** Two thick blocks of text in a row exhausts the reader. Break them up with a short punchy line, a bold pull-quote, a bullet list, or a blockquote. The reader will skip a wall of text; they won't skip a sharp one-liner.
- **Use formatting to guide the eye.** **Bold** the key insight in a longer paragraph so a skimmer still gets the point. _Italicize_ internal thoughts or paraphrased quotes. Use blockquotes for direct quotes that deserve to breathe. These aren't decorations — they're navigation aids.
- **Emotional immersion over information delivery.** The best sections make the reader _feel_ something, not just learn something. Paint a scene. Put the reader in the room. _Example from Dax Shepard: "Two addicts who had never used together, sitting stoned in a living room, staring at the water."_ _Example from JD Vance: "A boy on the steps of Ford's Theatre, having screamed and run, waiting for someone to find him."_

| Score | Level             | Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | Distinctive prose with memorable lines. Visual rhythm is excellent — short punchy sentences alternate with longer analytical passages, no back-to-back dense paragraphs. Bold, italics, and blockquotes guide the reader's eye naturally. Emotionally immersive scenes make the reader _feel_, not just understand. Sections flow as narrative, not encyclopedia entries. At least half the sections work as pure storytelling. Ending cuts to black at peak insight — no summary, no CTA. No quote or anecdote appears twice. Confident framing (no hedging). _Examples: "Empathy arrived for Vance not as instinct but as intellectual achievement," "the man who retreats into systems keeps getting pulled toward other people's pain"_ |
| 7-8   | **Good**          | Clean, readable prose. Good section structure. Some memorable lines. Paragraph length varies but may occasionally stack dense blocks. Some use of bold/italics but not consistently guiding the eye. Ending is decent but may summarize slightly. Minor repetition or hedging present.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 5-6   | **Average**       | Competent but unremarkable prose. Dense paragraphs stack without breathing room. Little use of formatting to break up the text. Reads more like a report than a story. Sections feel like bullet points converted to paragraphs. Some hedging. Ending wraps up conventionally.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 3-4   | **Below Average** | Flat or formulaic prose. Heavy repetition. Wall-of-text paragraphs throughout. Over-hedged ("it's possible that," "one could argue"). Sections are interchangeable. No narrative arc. No visual variety.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 1-2   | **Poor**          | Reads like AI slop. Generic phrasing, no voice, no rhythm. Blocky, unformatted text with no visual relief.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### 5. Originality (Weight: 1x)

How fresh the analysis feels — does it say something new, or does it repeat what everyone already knows?

| Score | Level             | Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9-10  | **Exceptional**   | Contains at least one insight the reader genuinely hasn't encountered before. Has a "signature detail" — a specific, small moment that makes the entire analysis click. Public/private gap is explored (who the person is when the performance stops). Childhood-to-adult thread is visible. Would pass the "swap test" — if you replaced the person's name, the analysis would break. _Examples: Peter Thiel's Tolkien naming thread, Satya Nadella's pharmacy moment, Paris Hilton's nightmares stopping after the documentary, Jacob Elordi correcting Wikipedia from "Spanish descent" to "Basque"_ |
| 7-8   | **Good**          | Some original observations alongside well-known material. At least one surprising angle. Private life details present but not deeply explored.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 5-6   | **Average**       | Competent compilation of public knowledge through an Enneagram lens. No surprising insights. Would mostly pass the swap test (too generic).                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 3-4   | **Below Average** | Rehashes what's already widely known. Could be found on any celebrity profile site. No private details. No original framing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 1-2   | **Poor**          | Pure regurgitation. Nothing a reader couldn't get from the person's Wikipedia page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

---

## Overall Score Calculation

**Overall = (Hook + Enneagram + Evidence + Writing + Originality) / 5**

Rounded to one decimal place.

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

**Publication threshold**: 8.5 (B+)

---

## Grading Process

1. Read the blog in full without scoring
2. Score each dimension independently (don't let one dimension pull the others)
3. Calculate the overall score and letter grade
4. Record the JSONB object:

```json
{
	"hook": 8.5,
	"enneagram": 9.0,
	"evidence": 8.0,
	"writing": 8.5,
	"originality": 8.0,
	"overall": 8.4,
	"letter": "B",
	"graded_at": "2026-02-18"
}
```

5. Push to `blogs_famous_people.content_quality` via one of:
   - `node scripts/personBlogParser.js --grades-only --changed` (recommended for graded drafts)
   - Seed script or admin UI (fallback/manual workflows)

---

## Quick Reference: What Separates Each Tier

### Gold Standard (A / A+) blogs have ALL of these:

- One driving thesis that resolves a public contradiction
- The Enneagram explains something non-obvious
- **Core emotions explored with depth** — the reader _feels_ the anger, shame, or fear, not just reads about it
- Direct quotes as evidence, not decoration
- A "signature detail" that makes the whole analysis click
- An ending that cuts to black at peak insight
- Private life details that reveal the person behind the persona
- **Visual rhythm that glides** — short punchy lines alternate with longer analysis, bold/italics guide the eye, no back-to-back dense paragraphs
- **At least one emotionally immersive scene** where the reader is _in the room_ (e.g., Dax's father's deathbed, Charli's SOPHIE grief, Dave Portnoy calling business owners)
- **Stress/growth arrows woven naturally** into the narrative, not listed as theory
- **Fresh, person-specific language** — the type's archetype name appears once; after that, the piece invents its own vocabulary for this person's patterns

### Strong (B+) blogs have MOST of these but may be missing:

- The signature "aha" detail
- Full private-life depth
- The sharpest possible ending
- Deep emotional immersion (moments that make the reader feel, not just understand)
- Consistent visual rhythm (may stack a few dense paragraphs)

### Average (C) blogs typically:

- Have a stated thesis but it doesn't drive the whole piece
- Use the Enneagram to label rather than explain
- Core emotions are named but not explored — no emotional immersion
- Leans on stock Enneagram language ("classic Challenger," "typical Enthusiast") instead of person-specific descriptions
- Paraphrase more than they quote
- Dense paragraphs stack without breathing room
- End with a summary rather than a cut-to-black

### Below threshold (D/F) blogs:

- No central thesis or contradiction
- Enneagram is cosmetic
- Wikipedia-level sourcing
- Flat prose, no voice, wall-of-text formatting
- Nothing original
- No emotional depth — reads like a report about a person, not a window into their psychology

---

## Reference Examples by Score

| Score | Blog            | Why                                                                                                                                                                                    |
| ----- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9.7   | Dave Portnoy    | Best hook in the collection (champagne bottles → voice cracking for strangers). Every section driven by Type 8 vulnerability/strength paradox. Exceptional visual rhythm and evidence. |
| 9.7   | Greta Thunberg  | Selective mutism → global speaker paradox. Core emotion (anger) as both destroyer and engine. Exceptional counter-typing and stress/growth arrow integration.                          |
| 9.6   | Charli XCX      | 50-page manifesto marketed as spontaneous. SOPHIE grief section is devastating emotional immersion. 3w4 analysis is the most sophisticated in the collection.                          |
| 9.6   | Dax Shepard     | "Truth-teller who lies to himself." Father's deathbed scene is one of the most powerful emotional moments. Journal-as-leading-indicator is a structurally original insight.            |
| 9.6   | JD Vance        | Cinematic opening. "Empathy arrived as intellectual achievement" — one of the best lines in any blog. Ford's Theatre ending cuts to black perfectly.                                   |
| 9.5   | Chappell Roan   | Self-identified Type 8. "Force field" vs. "threw away my personality" contradiction. Catholic guilt as moral engine beneath the challenger. Grammy speech as action, not talk.         |
| 9.4   | Blake Lively    | Taylor Swift court text hook. "Ryle You Wait" cocktail as signature detail. Holds "both stories can be true" tension without becoming hit piece or defense.                            |
| 9.0   | Kylie Jenner    | "Built an Empire by Disappearing" thesis, Golden Globes opening, Snapchat crash, strong ending.                                                                                        |
| 8.7   | Jordan Peterson | Comprehensive, strong counter-typing section, pharmacy moment, but less punchy than gold standard.                                                                                     |
| 8.5   | Logan Paul      | At threshold — good "attention into legitimacy" thesis, faith arc, WWE detail, but fewer signature moments.                                                                            |

---

## When to Re-Grade

- After any substantive content revision (not just typo fixes)
- When new sourced material is added (interviews, quotes, events)
- During periodic quality audits (quarterly recommended)
- Always update `graded_at` when re-grading
