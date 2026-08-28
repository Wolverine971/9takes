---
artifact: perspective-verification
schema_version: 1
subject: Freddie-Mercury
draft_sha256: f0fb9928071271f8faea829e79114be609dd4bb7df81357ac4711d80bbbf7ba8
final_content_sha256: d3b9e1d58a13b67a71f5ebcddfc733b31323fcd5897ee431da60f8a64b41b218
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-28T07:31:59Z
path: docs/content-analysis/perspective-reviews/Freddie-Mercury/2026-08-28_020004/verification-initial.md
---

# Verification: Freddie Mercury (2026-08-28_020004, initial)

## Verification verdict

**Pass.** The frozen snapshot SHA supplied to this pass matches both `synthesis.md` and the full-file hash of `draft-reviewed.md` (`f0fb9928…`), and the snapshot's reader-visible hash matches `context.json` (`5680c3d0…`). The current live draft's reader-visible hash is `d3b9e1d5…`. A full diff of the reviewed snapshot against the current draft was enumerated line by line: every reader-visible change maps to a synthesis P0/P1 item, the sanctioned P2-04 working-notes edit, or a funding cut the revision brief authorized (TL;DR trims, Wigg-name reductions, childhood/Scene-by-Scene/Munich compression, "Panchgani" dropped from the body while retained in the FAQ). No unauthorized edits found. All four P0 acceptance tests pass against the current text; all 15 accepted P1 items are completed; all 10 PROTECT passages survive verbatim or in synthesis-sanctioned near-verbatim form. `blog-lint.sh` re-run this pass: 0 fail, 1 warn (4,497/4,500 words — the known thin-headroom warning, matching the editor's count).

**Correction carried per synthesis Conflicts §1 (mandatory for downstream stages):** packet CLM-08's charge that "Every day is Fasching for me" is absent from the Wigg transcript is **wrong**. Independently re-verified this pass by direct grep of `youtube-transcripts/1985-freddie-mercury-david-wigg-munich.md`: the line is present as the caption garble "I live life to the full world. Every day is **flashing** for me," immediately following Mercury's Fasching discussion ("fashing over here… I got into that"). The draft's "he told Wigg" attribution is supported. Do not cut this quote in any later pass, and do not re-trigger a repair from CLM-08's Fasching half; only its gifts-wording half was real, and that is fixed (P0-02).

## P0 resolution check

- **P0-01 — resolved.** The Mary Austin FAQ now ends the estate sentence at "largest share of his estate" and closes on the Hutton/rings sentence; "and she was holding his hand when he died" is deleted. Grep for "holding his hand" → 0. No FAQ or body clause places any named person at the moment-of-death bedside; the "How did Freddie Mercury die?" FAQ carries only cause, date, place, and the statement timing. The body's retained "He was in the house when Mercury died" (Hutton) was checked against the acceptance test's intent and the packet: Disputes §1 explicitly supports Hutton's presence per his memoir and Freestone's house presence — this is a sourced location claim, not the invented bedside scene the P0 targeted, and the editor logged the retention deliberately. No Mary bedside claim exists anywhere in frontmatter or body.
- **P0-02 — resolved.** Reader-visible grep for "pawned," "wanted the wallet," "extravagant gifts," and the "treaded exactly" splice → 0 (residual matches sit only inside the EDITOR PASS NOTES HTML comment, which the reader-visible hash ignores and the push pipeline strips). The gifts passage now reads "He bought a lot of things for a lot of people and, he admitted, most of them came back to him within a few years" — verified this pass against the transcript line "I buy a lot of shitty things for a lot of people just most most of the times I get them back a few years later"; "shitty" is correctly not quoted per the rejected-feedback note. The Rabbit Hole stress arrow now reads "a circle whose gifts came back." The Fasching sentence stays with its Wigg attribution, as the acceptance test requires (see verdict correction). ENNEAGRAM-H4's arrow sentence survives verbatim.
- **P0-03 — resolved.** Scene by Scene beat 4 now contains: "On camera the sentence doesn't end there. He adds, 'It's fun.' Believe him; he enjoyed the mask he built. The trouble came when it started collecting all the love." — one occurrence, adjacent to the pretence reading, with prose that absorbs the clause rather than ignoring it (packet CLM-04/S4 wording). The intro occurrence stands as an excerpt per the synthesis's rejected-feedback ruling. Exactly one reader-visible occurrence, as specified.
- **P0-04 — resolved.** The Live Aid clause now reads "a trial sung by a jury built from the band's own multitracked voices." No sentence states or implies the opera vocals were Mercury's alone; the trial image, the locked-room close, and the "Somebody to Love" gospel-choir line (PROTECT-09) all survive verbatim beside the fix.

## Accepted improvements check

All 15 accepted P1 items verified **completed** against the current text; RQ-01 resolved; both P2 dispositions conform to the synthesis.

- **P1-01 completed.** Timing beat is order-agnostic: "Jim Hutton, his partner, later dated… If Hutton's dating is right, the song about a smile that hides 'what I need to say' became, within weeks, the pose he would hold for four years." The concealment-during-promo sentence is gone; the hedge survives; nothing implies he knew while filming.
- **P1-02 completed.** "David Bowie paid the tribute that stuck" — grep "tribute concert" → 0; the testimony ledger now reads "wording verified, occasion unpinned (per perspective review, do not attach a venue or date)."
- **P1-03 completed.** Intro: "September 5, 2026, would have been his 80th birthday; his estate booked the party…" Ending: "September 5, 2026: the pretence's 80th birthday party…" and "His statue above Lake Geneva gets its flowers… the pose held since 1996." Beat 3's "four decades later" echo cut. A simulated 2027 cold read finds no sentence implying the gala is upcoming or the next birthday is the 80th.
- **P1-04 completed.** "as of August 2026, of the 80 musicians profiled on 9takes, 30 are Type 4s…" — stays accurate as the corpus grows; concession substance verbatim (PROTECT-06).
- **P1-05 completed.** "His catalog now outlives every act that shared that stage" deleted; every remaining comparative in the Live Aid section is sourced and dated.
- **P1-06 completed.** The Silence's defense paragraph now closes: "The verdict stands, and so does the bill: whatever a word from him in 1988 might have moved, other patients paid for not finding out." — one conceded, unanswered cost; the next paragraph moves on without rebutting it; criticism-first structure intact (SUBJECT-H2).
- **P1-07 completed.** The counterarguments now carry Freestone's Three-flavored motive ("protecting the image of Queen"), address it (collective product vs. persona-called-pretence), and name the falsifier ("had he answered hurt with image-repair and harder performing instead of retreat, the same facts would read 3w4; the wing stands or falls on the withdrawal pattern").
- **P1-08 completed.** "By then AIDS was moving through the Munich scene itself. He came home." — motive-agnostic, nameless, no individual deaths, the fan-forum detail excluded; the "shown up unpaid" warmth beat intact.
- **P1-09 completed.** Heading trimmed to "Sexual 4"; the absolute replaced with "the self-preservation Four's quiet endurance surfaces only at the end, in the uncomplaining illness years Hutton describes" — no longer contradicts the Hutton brave-face quote; every instinct in the heading is argued.
- **P1-10 completed.** Diagnosis: "a schoolmates' nickname kept for life, then a new surname and a royal crest drawn with his own art-school pen around 1970" (the crest detail predates this revision; only the dating moved). Childhood: "Freestone affirmed the result flatly." Inner-thought reworded to displacement ("Whoever I am next starts now") with the framing cue "Imagine the first morning's arithmetic." No sentence attributes the age-eight renaming to Mercury's initiative; the FAQ's "adopted the surname Mercury around 1970" is consistent.
- **P1-11 completed.** Shy section: "He insisted the barriers were standard issue, everybody's, 'a brick layer or... somebody who's in a sweet shop.' Most bricklayers don't build Garden Lodge around theirs." — verified this pass against the transcript ("everybody has that kind of thing… a brick layer or… in a sweet shop"). Placed in the shy section, one of the two locations the synthesis named; the universalizer is quoted and argued past explicitly. (Note: the diagnosis section's scars-quote use precedes it in page order; the synthesis's location grant covers this placement, so the item is complete as accepted.)
- **P1-12 completed.** "In 1976, she later recalled, he told her he was bisexual" — attribution cue present; still no label assigned by the draft's own voice (PROTECT-10 intact).
- **P1-13 completed.** All first-use introductions present: "Jim Hutton, his partner" (timing beat — his actual first body use), "the band's drummer Roger Taylor and his friend the singer Peter Straker," "Queen's guitarist Brian May," "the 2018 biopic _Bohemian Rhapsody_," and the diagnosis gloss "On the Enneagram's nine-type map of motivation, the Four's engine is identity" plus "personality-typing databases have long split." The answer block remains extractable (58 words, lint-verified).
- **P1-14 completed (RQ-01 resolved).** "the lakeside town where Queen kept their studio" added to the ending's Montreux sentence; the editor logged citable anchors (montreuxriviera.com statue + Queen Studio Experience pages, brianmay.com party guide), which also cover the "pose held since 1996" statue dating.
- **P1-15 completed.** All sub-items verified: "a song, 'Delilah'"; "As many as ten at Garden Lodge"; source card's "It runs 18 minutes and" cut (card now ends "reads like a therapy transcript with jokes"); the "laugh that doesn't quite hold" gloss cut; "personality-typing databases have long split"; inner-thought framing cue present.
- **P2-01 deferred with reason (conforming).** Mother Love sentence not added; the synthesis conditioned it on word-ceiling funding, and post-edit headroom is 3 words. Correctly not taken.
- **P2-04 completed.** REFRESH TRIGGERS line added to the working-notes comment naming the Mary Austin dependency and the post-September-2026 gala tense check. Zero reader-visible cost.
- **New-assertion source-trail check (method step 6): clean.** The repairs introduce four new factual assertions — "It's fun." (packet S4/Louder), the Munich epidemic sentence (critic RQ-A trail, motive-agnostic as constrained), the Montreux studio clause and 1996 statue date (RQ-01 sources), and the Taylor/Straker/May appositives (uncontested record, packet-consistent). Each carries a trail in the editor resolution; nothing unsourced entered as part of a repair.

## Protected-hit regression check

None. All ten verified against the current draft; the snapshot diff confirms none of the protected passages were edited except where the synthesis explicitly sanctioned adjacent changes:

- **PROTECT-01** — Teeth cold open through "They are the same gesture, made in opposite directions." Verbatim; the cold-open paragraphs do not appear in the diff at all.
- **PROTECT-02** — Pull-quote and "conducted from behind a wall of 72,000 witnesses." Verbatim.
- **PROTECT-03** — "She was the one person whose love could not be explained by Freddie Mercury…" and "the only ground the fame never flooded." Verbatim; the P1-12 edit touched only the preceding paragraph.
- **PROTECT-04** — The Freestone laughing paragraph, "The shyness was real and the joy was real. What he rationed was access." Verbatim, untouched in the diff.
- **PROTECT-05** — "The statue is not where he is. One woman knows where he is." / "the last door he ever asked her to hold shut" / "Every audience he ever had is still outside it, singing." Verbatim; P1-03 touched only the gala sentence beside it.
- **PROTECT-06** — Base-rate concession substance verbatim; only the date stamp and a "One more honesty check" → "One honesty check" compression (essential function intact).
- **PROTECT-07** — "One honest complication" paragraph in main-body position and the withdrawal tiebreaker ("Wounded Threes perform harder. Wounded Sevens book the next adventure."). Verbatim.
- **PROTECT-08** — "The name came all the way back." Verbatim.
- **PROTECT-09** — Both song readings verbatim; the P0-04 fix sits beside them.
- **PROTECT-10** — All hedges and silences hold: "If Hutton's dating is right" survives the P1-01 rewording; no sexuality label in draft voice; matching-rings sentence verbatim; no estate figures, secret-daughter claim, or posthumous clinical claims re-entered (diff-confirmed); Wigg source card intact minus its "18 minutes" clause; Rabbit Hole skip-permission line verbatim; the Silence's criticism-first structure intact with P1-06 as one clause inside it; closing disclaimer including "pretence anyway" verbatim; date-anchored streaming certification verbatim. ENNEAGRAM-H4's "Munich is that arrow with a street address" also survives the P0-02 re-sourcing, as the synthesis required.

## Remaining work

None blocking. Three forward notes for later pipeline stages, none of which affects this verification:

1. **Do not re-flag the Hutton "in the house" sentence or the Fasching quote.** Both were adjudicated: house presence is packet-supported (Disputes §1); the Fasching/Wigg attribution is transcript-supported via the "flashing" caption garble (re-verified this pass). Packet CLM-08's Fasching half is erroneous as written.
2. **Word headroom is 3 words (4,497/4,500).** The next refresh must cut before adding — already recorded in the draft's REFRESH TRIGGERS working note, along with the Mary Austin dependency and the post-September-2026 gala tense check.
3. **Optional upgrade only:** Freestone's 1998 memoir could later license a stronger primary for the top-lip teeth quote (packet Disputes §4); the current attributed framing is safe as-is.
