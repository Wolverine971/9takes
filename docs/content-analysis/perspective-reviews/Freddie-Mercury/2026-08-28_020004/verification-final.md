---
artifact: perspective-verification
schema_version: 1
subject: Freddie-Mercury
draft_sha256: f0fb9928071271f8faea829e79114be609dd4bb7df81357ac4711d80bbbf7ba8
final_content_sha256: 9ef168474360771cef1499327c05be12fecfb11861a778d650127f9bb51012c1
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-28T07:47:43Z
path: docs/content-analysis/perspective-reviews/Freddie-Mercury/2026-08-28_020004/verification-final.md
---

# Verification: Freddie Mercury (2026-08-28_020004, final — post grade-triggered revision)

## Verification verdict

**Pass.** The frozen snapshot SHA supplied to this pass matches `synthesis.md` and the full-file hash of `draft-reviewed.md` (`f0fb9928…`); the snapshot's reader-visible hash matches `context.json` (`5680c3d0…`). The current live draft's reader-visible hash is `9ef16847…` — changed from `verification-initial.md`'s `d3b9e1d5…` because a grade-triggered revision pass (`revision-resolution.md`, B+ 8.7 below the 9.0 bar) ran after the initial verification passed. This final pass re-verified everything against the current text, with special attention to the revision-pass delta.

A full reader-visible diff of `draft-reviewed.md` against the current draft was enumerated hunk by hunk. Every change maps to (a) a synthesis P0/P1/P2-04 item logged in `editor-resolution.md`, (b) a funding cut the revision brief authorized, or (c) a revision-pass edit logged in `revision-resolution.md` under the PROTECT constraints. No unauthorized edits found. All four P0 acceptance tests pass; all 15 accepted P1 items remain completed; all 10 PROTECT passages survive. The revision pass was a net cut (4,497 → 4,485 words); `BLOG_LINT_CONTRAST_TARGET=0 ./scripts/blog-lint.sh Freddie-Mercury` re-run this pass: **0 fail, 1 warn** (the standing thin-headroom advisory, 4,485/4,500).

**Correction carried per synthesis Conflicts §1 (mandatory for downstream stages):** packet CLM-08's charge that "Every day is Fasching for me" is absent from the Wigg transcript is **wrong**. Re-verified again this pass by direct extraction from `youtube-transcripts/1985-freddie-mercury-david-wigg-munich.md`: the line is present as the caption garble "I live life to the full world. Every day is **flashing** for me," immediately after Mercury's Fasching/carnival discussion. The draft's "he told Wigg" attribution is supported. Do not cut this quote or re-trigger a repair from CLM-08's Fasching half in any later pass; only its gifts-wording half was real, and that is fixed (P0-02).

**Revision-pass source-trail check (method step 6): clean.** The grade-triggered revision introduced exactly two new factual assertions, both attribution pins, both packet-supported: (1) the Mary Austin "I've left you the house… would have been the woman I would have married" and "When he died I felt we'd had a marriage" quotes pinned to "the account she gave OK! magazine in 2000" / "she said in the same interview" — packet First-person §3 and ledger S7 place **both** quotes in the OK! magazine interview (March 17, 2000, date verified in the packet), so the same-interview construction is accurate; (2) "May recalled in Total Guitar" — packet §4 and ledger S9 source the quote to Total Guitar/MusicRadar. Its remaining edits (stress-arrow quarantine, shy-closer de-mechanization, epigraph trim, TL;DR bullet trim, closer variation) rearrange or remove existing content and assert nothing new.

## P0 resolution check

All four resolved; re-tested against the current text after the revision pass.

- **P0-01 — resolved.** The Mary Austin FAQ ends on the estate sentence and the Hutton/rings sentence; grep "holding his hand" → 0 in reader-visible content. No FAQ or body clause places any named person at the moment of death. The body's "He was in the house when Mercury died" (Hutton) stands per the adjudication in `verification-initial.md` Remaining-work #1 — packet Disputes §1 supports house presence via Hutton's memoir; it is not a bedside claim. The revision pass honored the do-not-re-flag instruction and left it untouched.
- **P0-02 — resolved.** Reader-visible grep for "pawned," "wanted the wallet," "treaded," and "extravagant" → 0 (residuals exist only inside editorial HTML comments, which the reader-visible hash ignores and the push pipeline strips). The gifts passage reads transcript-true ("He bought a lot of things for a lot of people and, he admitted, most of them came back to him within a few years"), verified this pass against the transcript line "I buy a lot of shitty things for a lot of people just most most of the times I get them back a few years later"; "shitty" correctly not quoted. **Revision-pass note:** the Rabbit Hole stress-arrow text was rewritten again when the body paragraph was quarantined into it — the merged sentence now reads "gifting a circle whose gifts came back," still pawn-free and transcript-true, and "Munich is that arrow with a street address" (ENNEAGRAM-H4) survives **verbatim** in its new Rabbit Hole location. The Fasching sentence stays with its Wigg attribution (see verdict correction).
- **P0-03 — resolved.** Scene by Scene beat 4 contains exactly one reader-visible occurrence: "On camera the sentence doesn't end there. He adds, 'It's fun.' Believe him; he enjoyed the mask he built. The trouble came when it started collecting all the love." — adjacent to the pretence reading, absorbed rather than ignored (packet CLM-04/S4). The intro excerpt stands per the synthesis's rejected-feedback ruling. Untouched by the revision pass.
- **P0-04 — resolved.** "a trial sung by a jury built from the band's own multitracked voices" — no sentence implies the opera vocals were Mercury's alone; the trial image, locked-room close, and gospel-choir line (PROTECT-09) survive verbatim. Untouched by the revision pass.

## Accepted improvements check

All 15 accepted P1 items remain **completed** in the current text; RQ-01 remains resolved; P2 dispositions conform. The revision pass touched five P1-adjacent zones; each was re-verified:

- **P1-01 completed.** Timing beat unchanged from the verified state: order-agnostic, hedge intact, nothing implies he knew while filming.
- **P1-02 completed.** "David Bowie paid the tribute that stuck"; grep "tribute concert" → 0; testimony ledger reads "wording verified, occasion unpinned (per perspective review, do not attach a venue or date)."
- **P1-03 completed.** Intro: "September 5, 2026, would have been his 80th birthday; his estate booked the party…" Ending: "September 5, 2026: the pretence's 80th birthday party…" and "His statue above Lake Geneva gets its flowers, fist raised, the pose held since 1996." A simulated 2027 cold read finds no sentence implying the gala is upcoming or that the next birthday is the 80th.
- **P1-04 completed.** "as of August 2026, of the 80 musicians profiled on 9takes, 30 are Type 4s…" — stamp intact; concession substance verbatim (PROTECT-06).
- **P1-05 completed.** Grep "outlives" → 0; every comparative in the Live Aid section is sourced and dated.
- **P1-06 completed.** "The verdict stands, and so does the bill: whatever a word from him in 1988 might have moved, other patients paid for not finding out." — still closes the defense paragraph, unanswered; criticism-first structure intact.
- **P1-07 completed.** Counterarguments still carry the Queen-image motive, its answer, and the falsifier ("the wing stands or falls on the withdrawal pattern").
- **P1-08 completed.** "By then AIDS was moving through the Munich scene itself. He came home." — motive-agnostic, nameless; the "shown up unpaid" warmth beat intact.
- **P1-09 completed.** Heading "Sexual 4"; sp-4 endurance "surfaces only at the end, in the uncomplaining illness years Hutton describes" — no self-refutation.
- **P1-10 completed.** Schoolmates' nickname + surname/crest "around 1970"; "Freestone affirmed the result flatly"; inner-thought reads as displacement ("Whoever I am next starts now") with the framing cue "Imagine the first morning's arithmetic."
- **P1-11 completed.** The bricklayer universalizer is quoted and argued past ("Most bricklayers don't build Garden Lodge around theirs") — re-verified against the transcript this pass ("I think everybody has that kind of thing… a brick layer or… in a sweet shop or or a butcher").
- **P1-12 completed.** "In 1976, she later recalled, he told her he was bisexual" — attribution cue intact; no label in draft voice.
- **P1-13 completed.** All appositives present: "Jim Hutton, his partner"; "the band's drummer Roger Taylor and his friend the singer Peter Straker"; "Queen's guitarist Brian May"; "the 2018 biopic _Bohemian Rhapsody_"; the Enneagram gloss and "personality-typing databases have long split." Answer block still extractable (58 words, lint-verified this pass).
- **P1-14 completed.** "the lakeside town where Queen kept their studio" intact in the ending's Montreux sentence (RQ-01 sources logged in the editor resolution).
- **P1-15 completed.** All sub-items hold: "a song, 'Delilah'"; "As many as ten at Garden Lodge"; source card ends "reads like a therapy transcript with jokes" (no "18 minutes"); laugh gloss absent; inner-thought framing cue present.
- **P2-01 deferred (conforming).** Mother Love sentence still absent — the synthesis conditioned it on word-ceiling funding, and while the revision pass widened headroom to 15 words, that pass was grade-scoped, not a license to add deferred P2 content. Conforms.
- **P2-04 completed.** REFRESH TRIGGERS working-notes line present (Mary Austin dependency + post-September-2026 gala tense check).

**Revision-pass items (grade-driven, checked for constraint compliance, not re-scored):** stress-arrow quarantine (H4 sentence verbatim in the Rabbit Hole; distribution ledger correctly updated to 0); shy-closer de-mechanization (bridges into Scene by Scene, no type-mechanics language, no new facts); epigraph trimmed to the scars sentence (not a protected passage — the revision resolution's note that no jury hit covered the epigraph is correct; the "more I open up" line survives in the diagnosis-section quote, so no evidence was lost); OK!/Total Guitar pins (packet-verified above); TL;DR Munich bullet gives up the gifts punchline (trim only). All compliant.

## Protected-hit regression check

None. All ten re-verified against the current draft; the snapshot diff confirms the revision pass edited around, not through, the protected spans:

- **PROTECT-01** — Teeth cold open through "They are the same gesture, made in opposite directions." Verbatim; absent from the diff entirely. The epigraph trim sits above the protected span and was never part of it.
- **PROTECT-02** — Pull-quote, "conducted from behind a wall of 72,000 witnesses," and the "or return his gifts" callback. Verbatim; the revision pass explicitly rejected trimming the callback for this reason.
- **PROTECT-03** — "She was the one person whose love could not be explained by Freddie Mercury…" and "the only ground the fame never flooded." Verbatim.
- **PROTECT-04** — The Freestone laughing paragraph, "The shyness was real and the joy was real. What he rationed was access." Verbatim; the de-mechanized paragraph is the one after it.
- **PROTECT-05** — "The statue is not where he is. One woman knows where he is." / "the last door he ever asked her to hold shut" / "Every audience he ever had is still outside it, singing." Verbatim; the OK!-pin and gala edits touch only adjacent sentences.
- **PROTECT-06** — Base-rate concession substance verbatim with the August-2026 stamp ("One honesty check" compression already sanctioned in the initial verification).
- **PROTECT-07** — "One honest complication" paragraph in main-body position; "Wounded Threes perform harder. Wounded Sevens book the next adventure." Verbatim.
- **PROTECT-08** — "The name came all the way back." Verbatim.
- **PROTECT-09** — "The song is a locked room, and the world sings along to the door" and "'Somebody to Love' is a gospel choir made of three men begging on behalf of one." Verbatim — the revision pass correctly refused to vary the first as a "closer" because this protection requires it.
- **PROTECT-10** — All hedges and silences hold: "If Hutton's dating is right"; no sexuality label in draft voice; matching-rings sentence verbatim; no estate figures, secret-daughter claim, or posthumous clinical claims (diff-confirmed); Wigg source card intact minus "18 minutes"; Rabbit Hole skip-permission line verbatim; Silence criticism-first structure with P1-06 as one clause inside it; closing disclaimer including "pretence anyway" verbatim; date-anchored streaming certification verbatim. No deliberate omission was enriched back in.
- **ENNEAGRAM-H4** (jury keep-note) — "Munich is that arrow with a street address" survives verbatim, relocated to the Rabbit Hole stress/growth section per the grader's quarantine ask; the transcript-confirmed gifts-returned admission still carries it. Relocation with verbatim preservation satisfies the synthesis requirement (the sentence's essential function — anchoring the stress arrow to Munich — is intact where the arrow argument now lives).

## Remaining work

None blocking. Standing notes for later pipeline stages:

1. **Do not re-flag the Hutton "in the house" sentence or the Fasching quote.** Both adjudicated (packet Disputes §1; the "flashing" caption garble re-verified twice). Packet CLM-08's Fasching half is erroneous as written.
2. **Word headroom is now 15 words (4,485/4,500)** after the revision pass's net cut — improved from 3, still thin. The REFRESH TRIGGERS working note (Mary Austin dependency, post-September-2026 gala tense check) governs any future edit.
3. **Optional upgrades only:** Freestone's 1998 memoir could later license a stronger primary for the top-lip teeth quote (packet Disputes §4); P2-01 (Mother Love sentence) remains available if a future pass wants to spend the recovered headroom, with dates verified against the record before insertion.
