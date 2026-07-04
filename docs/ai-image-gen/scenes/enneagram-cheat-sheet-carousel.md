<!-- docs/ai-image-gen/scenes/enneagram-cheat-sheet-carousel.md -->

# The Enneagram Cheat Sheet — Carousel — 9takes Dial-In

> Brand: ON (9takes asset) · Engine: Lookup Table (`CAROUSEL-SPEC.md`, Template A) · Source pattern: `iklipse-camera-angle-cheat-sheet.md`
> Target tool: ChatGPT (GPT Image) for image slides · `/carousel` for chrome + text slides
> Status: DIAL-IN — set signature + type→emotion→angle table + anchor lineup LOCKED 2026-06-30 · pilot (8·4·6) pending

## The idea (what this says)

iklipse's most-saved format mapped **camera angle → emotion**. We map **personality type → the emotion it creates in a room**. Same lookup-table dopamine ("save this and you never have to think about it again"), pointed at people instead of cameras. The deck's thesis is the product thesis: _one situation, nine ways to see it_ — here rendered as nine real humans who each turn the same world into a different feeling.

**Why this beats a generic "9 types" deck:** every example slide is a **real, analyzed persona** (we have 430 typed). Recognition drives saves + comments, each slide cross-promotes its `/personality-analysis` blog, and the moodboard engine keeps the images specific instead of nine identical statues. (Decision log: anchor-per-type chosen over abstract-scenes and the greek-statue motif, 2026-06-30.)

## The substance — type → emotion → angle (LOCKED)

The lookup table is the value. Each type ships a **badge** (the emotion it creates) and a **camera angle** that embodies it (re-skinned from the camera-angle cheat sheet). The example image is a moodboarded POV moment of that type's **anchor**.

| Type             | Persona feel               | Creates (badge) | Camera angle                  | Anchor (verified)                      | Alt              |
| ---------------- | -------------------------- | --------------- | ----------------------------- | -------------------------------------- | ---------------- |
| 1 Reformer       | the clenched perfectionist | **Restraint**   | eye-level, rigid symmetry     | **Anna Wintour**                       | Steve Jobs       |
| 2 Helper         | the over-giver             | **Reach**       | over-the-shoulder, leaning in | **Princess Diana**                     | Dolly Parton     |
| 3 Achiever       | the performer              | **Image**       | low angle (admire)            | **Cristiano Ronaldo**                  | Taylor Swift     |
| 4 Individualist  | the romantic               | **Longing**     | high angle, isolated          | **Vincent van Gogh**                   | Lana Del Rey     |
| 5 Investigator   | the watcher                | **Distance**    | wide / witness                | **Robert Greene** _(moodboard exists)_ | Marie Curie      |
| 6 Loyalist       | the scanner                | **Vigilance**   | dutch tilt                    | **Eminem**                             | Marilyn Monroe   |
| 7 Enthusiast     | the escaper                | **Motion**      | kinetic tilt                  | **Robin Williams**                     | Anthony Bourdain |
| **8 Challenger** | the force                  | **Control**     | low angle                     | **Chappell Roan** _(DONE)_             | Beyoncé          |
| 9 Peacemaker     | the merger                 | **Ease**        | soft eye-level                | **Keanu Reeves**                       | Barack Obama     |

_Anchor selection criteria: high recognition · a documented wound/origin (fuels the POV moment) · visually distinct from the others in the set (era, medium, palette) · face-free-friendly silhouette. All nine confirmed against their `enneagram:` frontmatter; alts are pre-vetted swaps if an anchor's render won't land._

## The set signature (the constant that makes 9 images read as ONE cheat sheet)

This is the lock that prevents nine moodboards from drifting into nine different looks:

- **Amber is the only warm light source** in every frame (a lamp, a window shaft, stage glow), against cool grey-blue shadow — even in the cold/quiet types. No global warm grade. _(Same rule that held the Chappell set together; protects emotional contrast across very different moods.)_
- **One `Type N = [Emotion]` badge** per example slide, lower-third, amber pill — the recurring brand tic that ties every image to the lookup table.
- Photoreal · fine film grain · real texture · **face-free or face-generic** (POV, turned, distant, obscured; identity carried by tells — silhouette, wardrobe, setting) · 1:1 square.
- Deck chrome (added in `/carousel`, never in-prompt): `9takes` top-left · series tag top-right (working: **"The Nine Angles"**) · `9takes.com` bottom-left.
- **One bright/high-key peak** in the deck = the Type 8 / Chappell Lollapalooza frame (Shot 4). Every other example slide is moodier so the peak pops.

Brand guard: amber Streetlamp, dark text on amber — **never red/teal/rose** for primary (iklipse runs cool/blue; we go warm on purpose so it never reads as a clone).

## Deck structure (Template A — Lookup Table)

```
1.  COVER       "The Enneagram Cheat Sheet" + subhead "Learn which type creates which emotion."
2.  HOOK        "Most people read a room the same way — not because they're wrong, but because they only have one lens."
3.  THESIS      "PERSONALITY = PERSPECTIVE. The same moment is a threat, a duty, or an opportunity — depending on who's in the room."
4..21 ENTRY PAIRS x9, each:
      a) TEACH card:  TYPE N — THE [NAME] / Leans in when: ___ / Drawn to: [chips] / Creates: [chips]
      b) EXAMPLE card: moodboarded anchor POV + amber badge "Type N = [Emotion]"
    (QUICK RULE interstitials every ~3 types: "Want the truth fast? → Ask an 8. Want everyone to feel okay? → Ask a 9.")
22. RECAP       "SAVE THIS FORMULA" — all nine Type = Emotion lines on one slide (the screenshot the deck exists to make)
23. CTA         "What's your number? Comment your type and we'll decode how it reads a crisis." (keyword comment-bait → vssn-ai auto-DM mechanic)
```

Worked proof — the **Type 8 example slide already exists**: Chappell Roan Shot 4 (Lollapalooza, commanding ~80k from her own POV, fringed sleeve + mic) + amber badge `Type 8 = Control`. No new work; it doubles as the deck's bright peak.

## Pilot before committing to all 9

Stress-test the set signature across the widest mood gap before generating eight more:

| Pilot | Type          | Anchor           | Why it's in the pilot                                                                                      |
| ----- | ------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| 1     | **8** (gut)   | Chappell Roan    | DONE — the bright/loud peak. Baseline.                                                                     |
| 2     | **4** (heart) | Vincent van Gogh | The cold/quiet/melancholy opposite end — does the amber-only rule survive a high-angle, desaturated frame? |
| 3     | **6** (head)  | Eminem           | The tense/dutch-tilt case — does the signature hold under instability + a recognizable but face-free POV?  |

If the signature holds across bright-8 / quiet-4 / tense-6 (and all three centers), the remaining six are safe to produce. If not, we fix the signature once, here, before it multiplies into nine.

## Hand-off

1. Run **`/moodboard <anchor>`** per type (start with the pilot: Van Gogh, then Eminem). Each moodboard produces the anchor's POV shot list; pick the ONE frame that best embodies the type's badge emotion + locked angle as the cheat-sheet example slide. Reuse: Chappell (Shot 4) and Robert Greene (existing moodboard doc) are already sourced.
2. Generate each example in ChatGPT; **upload the approved Chappell Shot 4 as the style reference** for every subsequent anchor so grain/amber/finish stay identical across the set.
3. Feed all nine + this structure to **`/carousel`** — it writes the teach/quick-rule/recap/CTA text slides and lays the fixed chrome + amber `Type N = [Emotion]` badges over the images.

**Cross-link payoff:** each example slide's caption points to that persona's `/personality-analysis` page — the cheat sheet becomes a doorway into nine blogs at once.
