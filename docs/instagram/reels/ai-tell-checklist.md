<!-- docs/instagram/reels/ai-tell-checklist.md -->

# AI-Tell Checklist — Reels Gate

**Purpose:** a Reel does not go to DJ for approval until it clears this. Same job `scripts/blog-lint.sh` does for blog drafts, applied to video.
**Status:** first pass 2026-08-03. Tiers 1 and 2 are scriptable; tier 3 is an eyeball pass.
**Owner:** whoever produced the cut runs it, then records the result on the queue item.

The principle behind every check: **AI-looking is not a quality level, it is a set of specific, nameable habits.** A cheap Reel made by a person does not read as AI. An expensive Reel made from templates does. What follows is the list of habits.

---

## Tier 1 — Copy (scriptable now)

Runs against the VO script, on-screen text cards, and the caption.

| #   | Check                        | Fails when                                                                                                                                                                               | Why it is a tell                                              |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | **Em-dashes**                | Any em-dash in VO script, on-screen text, or caption prose. Quote attributions exempt.                                                                                                   | Already banned repo-wide. The single most reliable LLM tell.  |
| 2   | **Banned phrases**           | Any of: delve, tapestry of, multifaceted, myriad of, It's worth noting, serves as a testament, A closer look reveals, In essence, Moreover, Furthermore, This underscores, rich tapestry | Shared list with `blog-lint.sh`; keep the two in sync.        |
| 3   | **Marketing-voice patterns** | "send this to the ___ in your life", "tag someone who", "drop a ___ below", "here's the thing", "let that sink in", trailing 👇 on a CTA                                                 | Growth-hack cadence. Reads as a template, not a person.       |
| 4   | **Tidy parallel structure**  | Three or more consecutive lines with identical grammatical shape, or a three-item list where every item is the same length                                                               | Machine prose is suspiciously balanced. Humans are lumpy.     |
| 5   | **VO word budget**           | VO word count > 2.2 × duration in seconds                                                                                                                                                | Overstuffed VO forces a rushed read, which sounds synthetic.  |
| 6   | **On-screen card budget**    | More than 7 cards in a 26s cut, or any card over 5 words                                                                                                                                 | Wall-of-text cards are unreadable and read as auto-generated. |
| 7   | **VO/text duplication**      | Any on-screen card repeats more than 2 consecutive words of the VO under it                                                                                                              | Wastes the second channel and looks auto-captioned.           |
| 8   | **Hype verbs**               | unlock, unleash, revolutionize, game-changing, transform your, master your                                                                                                               | Not the 9takes register.                                      |
| 9   | **Verdict language**         | "this is why Type N ___", "the trap of Type N is", any line that resolves the question                                                                                                   | Violates the north star. The post is the question.            |
| 10  | **Boundary line present**    | Caption lacks the editorial-interpretation-not-a-diagnosis line, on any person post                                                                                                      | Required on every personality read.                           |

## Tier 2 — Edit and motion (measurable from the timeline)

| #   | Check                      | Fails when                                                                                                         | Why it is a tell                                                    |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| 11  | **Uniform shot length**    | Standard deviation of clip durations < 15% of the mean. Practically: all clips within a half-second of each other. | Even spacing is the loudest machine signature in an edit.           |
| 12  | **Camera-move count**      | More than one camera move (zoom, push, pull) in a 26s cut                                                          | Ken Burns on every image is the default AI-video look.              |
| 13  | **Uniform move direction** | Every move in the cut is the same direction                                                                        | Batch-applied motion. Nobody hand-edits like that.                  |
| 14  | **Choppy cuts**            | Any clip under 0.8s that is not a deliberate rhythm burst, or more than 12 cuts in 26s                             | Reads as auto-assembled from a script.                              |
| 15  | **Cut placement**          | Cuts land on the music grid rather than on the voice                                                               | Grid-locked cuts feel generated; breath-locked cuts feel human.     |
| 16  | **Card timing**            | Any text card enters within 0.3s of a hard cut                                                                     | Eye cannot re-fixate. Card is functionally invisible.               |
| 17  | **Transition effects**     | Any cross-dissolve, whip, glitch, or stock transition                                                              | Hard cuts only in this series. Stock transitions are template-ware. |
| 18  | **Loop integrity**         | Last frame is not visually identical to first frame                                                                | Kills the loop, and loops are counted views.                        |
| 19  | **CTA card present**       | A closing card that says anything other than the open question                                                     | Ends the loop and reads as an ad.                                   |

## Tier 3 — Human gates (eyeball, cannot be scripted)

| #   | Check                    | Ask                                                                                                                                  |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| 20  | **Frame one has eyes**   | Does the first frame contain a visible human gaze? If the eye bar covers it, is the tradeoff deliberate and logged?                  |
| 21  | **Graphics quality**     | Any low-res upscale, warped type, mismatched kerning, off-brand palette drift, misaligned safe zone. Check at 25% scale on a phone.  |
| 22  | **One handmade element** | Is there at least one thing in this Reel a template could not have produced? A specific crop, a hand-placed annotation, an odd hold. |
| 23  | **Room tone present**    | Play the VO alone. Is there audible room between lines, or has it been gated to digital silence? Silence is a synthetic-voice tell.  |
| 24  | **Delivery register**    | Does it sound like one person telling another person something odd they found out, or like an ad read?                               |
| 25  | **One human artifact**   | Is there a real breath, an imperfect pause, or a slight stumble left in? Perfect takes read as machine.                              |
| 26  | **The turn is a fact**   | Is the reversal an actual piece of evidence, or is it a lesson the narrator states? It must be the former.                           |
| 27  | **Sound-off test**       | Mute it. Does the first second still stop a scroll?                                                                                  |
| 28  | **Stranger test**        | Would someone who has never heard of the Enneagram understand what they just watched?                                                |

---

## Running the gate

Record the result on the queue item before requesting approval:

```
ai_tell_gate:
  tier1: pass | fail (list check numbers)
  tier2: pass | fail (list check numbers)
  tier3: pass | fail (list check numbers)
  waivers: [check #, reason, who approved]
```

A waiver is fine. An unlogged waiver is not. The point of the list is that a choice to break a rule is visible as a choice.

## Build note

Tier 1 is a straightforward port of `scripts/blog-lint.sh` against a script file rather than a blog draft; the banned-phrase array should be extracted so both consume one list. Tier 2 is readable from a CapCut or Premiere XML export (clip durations, transition names, keyframe counts) without touching the video itself. Neither is built yet.

## Maintenance

**This list is append-only in spirit.** Every time a Reel ships and something about it reads as AI to DJ or to a viewer, name the specific habit and add it as a numbered row. The list is only useful if it grows from real failures instead of from theory.
