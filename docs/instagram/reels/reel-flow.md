<!-- docs/instagram/reels/reel-flow.md -->

# Reel Flow — @9takesdotcom

**Status:** First pass, 2026-08-03. This is the skeleton. Dress-up (animation, sound design, on-camera) sits on top of it and is deliberately not specified here.
**Baseline:** DJ voiceover. Faceless (no camera), but a real human voice from frame one.
**Defers to:** [`../personality-series-north-star.md`](../personality-series-north-star.md) for what earns a fact a slot.
**Replaces:** the hook/callout/proof/catch/CTA template in [`reel-scripts.md`](reel-scripts.md). That template is a funnel shape borrowed from growth content. It resolves the tension instead of opening it, which is backwards for this series. The three scripts in that file are still useful as raw fact inventories.

---

## The governing idea

The carousel says: _here is the record, arranged._
The Reel says the same thing out loud, with one difference: **the viewer never gets to skim.**

That constraint is the whole design problem. A carousel reader controls pace and can re-read. A Reel viewer gets one pass at whatever speed we choose. So a Reel is not a compressed carousel. It is a different instrument playing the same material, and the thing it is good at is **sequence** — landing facts in an order that builds pressure, then releasing it into a question.

Two spines below. Both end on an open question. Neither ends on a CTA card.

---

## Timing physics (read this before writing any script)

These numbers are the budget. Everything else is taste.

### Voiceover rate

Conversational VO runs about 150 words per minute, but a Reel needs air. Beats have to land in silence. **Plan at 2 words per second of elapsed reel time**, pauses included.

| Duration | VO word budget | What fits                                                                                     |
| -------- | -------------: | --------------------------------------------------------------------------------------------- |
| 10s      |      ~20 words | One fact and one turn. A hook probe, not a post.                                              |
| **26s**  |  **~52 words** | **The full loop: cold open, frame, three evidence beats, turn, question.** This is the spine. |
| 30s      |      ~60 words | Same shape, one extra evidence beat or more air.                                              |
| 60s      |     ~120 words | Only works with a narrative reversal or real thinking-out-loud. See "What earns 60 seconds."  |

### On-screen text rate

**Rule: on-screen text never duplicates the voiceover.** Reading one set of words while hearing a different set collapses comprehension; reading the _same_ words you are hearing wastes the channel. Text carries only what the ear cannot hold:

- numbers, dates, ages, counts
- proper nouns the ear may miss
- short quote fragments in the subject's own words

**Spec: 3 to 5 words per card. Six to seven cards maximum in a 26s Reel.** A card needs 0.3s of dead air after a cut before the eye can re-fixate, so cards cannot sit on top of hard cuts.

### Why 26 seconds is the spine

Below ~20s the curiosity loop cannot close: you can state a fact but not build to a reversal, so the viewer leaves with nothing to save. Above ~35s, without a narrative reason, you are just adding facts, and added facts lower watch-through, which lowers reach. 26s is the shortest window where the record can actually tell its own story.

### What earns 60 seconds

Not more facts. A 60s Reel that is a longer list is strictly worse than a 26s one. Sixty seconds is earned by exactly one of:

1. **A genuine reversal at the midpoint** — the viewer believes X at 0:25 and something at 0:30 makes X wrong. Not a twist for its own sake; the material has to actually contain one.
2. **Thinking out loud** — DJ reasoning through the read in real time, including the part where he is unsure. A blog cannot do this. It is the one thing a voice buys that text never will.

Option 2 is the One Take format (`docs/marketing/one-take-format.md`). Treat 60s as a separate product, not a longer recut. Get 26s working first.

---

## Spine A — THE CASE FILE (person lore)

For the 16 lore carousels in the queue. Source of truth is the person's brief.

**Target: 26s. Five movements.**

| #   | Movement          | Window | Job                                                            |
| --- | ----------------- | ------ | -------------------------------------------------------------- |
| 1   | **Cold open**     | 0–4s   | One specific fact that does not fit the person's public image. |
| 2   | **The frame**     | 4–7s   | Who they are, and the tension. Name lands here, not before.    |
| 3   | **The record**    | 7–18s  | Three dated evidence beats. Irregular rhythm.                  |
| 4   | **The turn**      | 18–23s | The reversal in the evidence, placed on the retention cliff.   |
| 5   | **Open question** | 23–27s | The question, held. Cuts back to the frame-one image. Loops.   |

### Rules that make it not-generic

- **No title card. No logo sting. No "Personality Analysis" intro.** Cold opens are what human-made video does; title cards are what template video does. Brand chrome appears small and late, in movement 2.
- **The cold open is a fact, never a claim.** "He had eighty jobs before he had one" works. "Robert Greene is a textbook Type 5" does not, and it also violates the north star.
- **Rhythm inside the record must be irregular.** Long, short-short, long. Three evenly spaced beats is the single loudest machine-made tell in the edit.
- **The turn is an evidence reversal, not a lesson.** Never "here is the trap of Type N." The old template did this in every script. Show the fact that reverses the picture and let the viewer draw it.
- **Last frame is identical to the first frame.** This is what makes it loop, and loops count as views.
- **No CTA card, no "send this to the Type 8 in your life."** The CTA lives in the caption and pinned comment where it costs no watch-time and reads as a human wrote it.
- **The type label is chrome, not content.** It sits in the corner as a case-file marker. The Reel never argues the type. The blog does that.

### Motion rules

- **One camera move per Reel, maximum.** Use it on the turn so it means something. Every other beat is a static hold or a hard cut. Uniform slow zoom on every image is the number-one reason recut carousels read as AI.
- **Vary the framing, not the movement.** Wide, then a crop into the eyes, then a crop to hands or an object. This creates motion without moving the camera.
- **Cuts land on the voice, not on the music.** Cut on the breath before the next line.

### Worked example: Robert Greene (26s)

Source: `docs/marketing/content-ops/briefs/robert-greene-lore-carousel.md`. Every fact below already passed that brief's fact check.

| Time   | VO (52 words)                                                    | On-screen text          | Visual                                                      | Audio                        |
| ------ | ---------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------- | ---------------------------- |
| 0–4s   | "He had eighty jobs before he had one."                          | `80 JOBS` (enters 1.5s) | Portrait, **static hold**, no zoom. Eyes visible.           | VO dry, room tone. No music. |
| 4–7s   | "Robert Greene. Nobody watched people harder."                   | `TYPE 5` corner chrome  | Hard cut: crop into the eyes.                               | Room tone only.              |
| 7–11s  | "Thirty-seven, broke, suicidal thoughts."                        | `AGE 37`                | Hard cut: wide, portrait small in the frame.                | Low bed enters, barely.      |
| 11–14s | "Then: forty-eight laws, written from thousands of index cards." | `1998`                  | Hard cut: crop to hands or book.                            | Bed holds.                   |
| 14–18s | "August 2018. A stroke. Left side paralyzed."                    | `AUG 17 2018`           | Hard cut: back to wide. Hold longer than feels comfortable. | **Bed drops out.**           |
| 18–23s | "Five years later he is writing about wonder. Not power."        | `"from your chair"`     | **The one move:** slow push in.                             | Single low hit on the cut.   |
| 23–27s | "What makes a man study power that closely?"                     | Question typeset, held  | Cut back to the frame-one image, identical.                 | Bed returns, then hard out.  |

Rhythm check: 4s, 3s, 4s, 3s, 4s, 5s, 4s. Not uniform. The 14–18s beat holds longest and the bed drops, which is the setup for the turn.

**Caption** carries the sourcing, the boundary line ("editorial interpretation, not a diagnosis"), and the link. Lift it from the brief; it is already written and fact-checked.

---

## Spine B — THE GAP (nine takes)

For the concept carousels: "one apology, nine motives," "safety is not universal," "nine ways self-sabotage." This spine demos the product instead of a personality.

**Target: 26s. Four movements.**

| #   | Movement            | Window | Job                                                        |
| --- | ------------------- | ------ | ---------------------------------------------------------- |
| 1   | **The situation**   | 0–4s   | One concrete, universal scenario. Delivered flat.          |
| 2   | **The split**       | 4–16s  | Three reactions, back to back, deliberately contradictory. |
| 3   | **The reveal**      | 16–21s | The count lands. There are nine of these.                  |
| 4   | **The turn inward** | 21–26s | "Which one was yours?" Loops.                              |

### The one rule that makes this work

**Show three. Name nine.**

Showing all nine is a wall of text, gets 2.9 seconds per take, and lands nothing. That is the carousel's job. The Reel's job is to make the viewer feel the _gap_ between two or three reactions and then discover the gap has nine positions.

### Rules

- **The scenario must be small and physical.** "Your partner says we need to talk" beats "conflict in relationships." Specificity is what makes a stranger feel seen.
- **The three reactions must actually contradict.** If they sound like variations, the gap is invisible and the post is worthless. Pick from opposite ends: a 6 reaction, a 3 reaction, a 9 reaction.
- **On-screen, label them by number only. Never name the type.** `01` `04` `09` beside each reaction. The numbers do the product demo silently and create the question "which number am I" without a word of explanation.
- **Do not resolve it.** No "this is why knowing your type matters." The gap is the payload.

### Worked example: "We need to talk" (26s)

| Time   | VO (45 words)                                                      | On-screen text      | Visual                                                    | Audio                      |
| ------ | ------------------------------------------------------------------ | ------------------- | --------------------------------------------------------- | -------------------------- |
| 0–4s   | "Your partner says: we need to talk."                              | `"we need to talk"` | Static. Type only, no face. Black field.                  | VO dry. Silence around it. |
| 4–8s   | "One person hears: what did I do wrong."                           | `01`                | Hard cut. Number enters left.                             | Bed enters.                |
| 8–12s  | "Another hears: finally, we are going to fix this."                | `04`                | Hard cut. Number enters center.                           | Bed holds.                 |
| 12–16s | "Another hears nothing. They already left the room in their head." | `09`                | Hard cut. Number enters right. Hold.                      | **Bed drops.**             |
| 16–21s | "Same five words. Nine different nervous systems."                 | `01–09` fills in    | **The one move:** pull back to reveal all nine positions. | Single hit.                |
| 21–26s | "Which one was yours?"                                             | Question held       | Cut back to frame one, identical.                         | Bed returns, hard out.     |

The pull-back at 16s is the only camera move and it _is_ the reveal. Motion and meaning are the same event, which is what separates designed motion from decorative motion.

---

## Production order

1. **Write VO scripts for all six first, then record once.** Given the session-eviction history and the under-one-hour-a-week constraint, batching the recording is the whole ballgame. Six 26s scripts is about five minutes of finished audio and maybe forty minutes of recording.
2. **Cut against the audio.** Lay the VO first, then place stills to the voice. Never build a visual timeline and try to narrate over it.
3. **Run the AI-tell gate** ([`ai-tell-checklist.md`](ai-tell-checklist.md)) before anything goes to DJ for approval.
4. **Log 24h and 7d numbers** to `docs/marketing/content-ops/performance-log.csv`. It is currently empty. Six Reels with no measurement teaches us exactly what the last ten days taught us.

### VO recording notes (new requirement now that VO is the baseline)

The fastest way to sound AI-generated is to sound like an ad read.

- **Talk to one person, not an audience.** The whole series is one person telling another person something odd they found out.
- **Keep the room.** Do not gate the audio to digital silence between lines. Gated VO with zero room tone is a synthetic-voice tell. Record somewhere small and soft, sit close to the mic, leave the room in.
- **Do not smile through it.** The material is a case file. Flat, curious delivery beats energetic delivery for this series.
- **Keep one flubbed breath or a real pause.** Perfect takes read as machine. One human artifact per Reel is a feature.
- **Read the question at the end slower than feels right.** It is the only line that has to land.

---

## Open items for the dress-up pass (not decided here)

- Animation vocabulary beyond the one-move rule (type-in behavior, number entrances)
- Whether the eye bar comes off for frame one. Current covers put a violet bar over the eyes, which is strong on the grid and costly as a scroll-stopper. Worth an A/B once the spine is stable.
- Music sourcing: trending audio buys reach but fights the case-file tone. Test a bed-only cut against a trending-audio cut on the same script.
- On-camera 60s (One Take) as the separate product.
