---
artifact: perspective-revision-resolution
schema_version: 1
subject: Ms-Rachel
draft_sha256: 8ee388d721b2e6307aa099e626ddcf62566dd50a2cf633a8b95772dc0716c506
resolution_status: complete
resolved_at: 2026-08-20T08:18:49Z
---

This pass ran against a `verification-initial.md` that reported `verification_status: pass`,
`open_p0: 0`, `protected_hit_regressions: 0`. There were therefore no unresolved P0 items and no
protected-hit regressions to reopen. The work list was the verifier's **Remaining work** items plus
the grade sidecar's NEEDS WORK / TO REACH lists, with the lint FAIL first.

## Resolution log

**Verifier remaining-work #1 — word ceiling (the one lint FAIL) — fixed.**
Body went from 5,001 words to 4,494 against the 4,500 ceiling. `blog-lint`: 0 fail, 1 warn (the
structural thin-headroom warn that fires for anything in the 4,050–4,500 band). The verifier named
two options: raise `BLOG_LINT_WORD_CEILING`, or commission a Rabbit-Hole-only reduction. I took a
third path, because neither alone closes 501 words: the Rabbit Hole gave up ~90 (every argument
survives — wing, subtype, both arrows, Type 1, Type 9, the open anomaly, the falsifier), the
controversy chronicle the grader named gave up ~110, and the rest came from de-duplication and
line-level compression across the whole piece. **No PROTECT-listed material was deleted.** All 14
protected hits verified present by exact string match after the cut, along with every P0 and P1
repair string the verification enumerated (31/31).

The editor and verifier were right that the grader's and synthesis's arithmetic was optimistic. The
grader's plan (~250 from Gaza, ~100 from the Rabbit Hole) lands at ~4,650, not under 4,500. The
residual came from redundancy neither pass had costed, principally:

- the epigraph, which repeated verbatim a quote the diagnosis section already carries (creator v2:
  "quotes appear once");
- the intro's Cameo preview, which retold in miniature the beat the founding section tells in full
  (PROTECT-10);
- the intro's NYU / early-childhood training clause, stated again in the childhood section;
- the childhood section's school roll-call, which carries no argument;
- the Mister Rogers wading-pool beat, which restated the paragraph directly above it;
- the Hoffman GMA quote, which is Hoffman speaking about himself and so never counted as testimony
  about the subject (traded for Hailat, who does).

**Verifier remaining-work #2 — `editor-resolution.md` misreports three things — recorded, not
edited.** I did not rewrite the editor's artifact; correcting it is outside this pass's write scope.
Confirming the verifier's reading against the current file:
- P0-13's paragraph does sit *between* the disclaimer and the reframe, not before the pair. Still
  true after this pass; unchanged by it. Flagged again below.
- P0-05's "largest gap is now under six months" is wrong. Feb 2023 → May 2024 is ~14 months. The
  specific hole the clause was written to close is closed.
- "faqs frontmatter is still empty" is stale. Five FAQ pairs are live and I re-checked them against
  the newly compressed body: still consistent, and now also consistent with the Dec 8 quotation and
  the THR-sourced subscriber figure.

**Verifier remaining-work #3 — "Four minutes, one word." unsourced (incomplete P1-15) — fixed.**
Cut. The evidence packet carries no episode or segment length; everything else in that P1-15
addition traces to S-10 and is untouched. The protected P1-15 sentences ("The songs on *Songs for
Littles* are written and arranged by a Broadway associate conductor and recorded with real horn
players. It is a well-made show. The pause is the technology.") are intact in intro paragraph three.

**Verifier remaining-work #4 — "One second. Two. Three." — deliberately retained.**
The verifier marked this "not required for this gate" and the grader scored Hook 9 with it in place.
I nearly broke it by accident: a compression pass removed the intro's in-prose attribution of the
three-to-five-second professional window, which is the sentence that keeps the count from reading as
a measurement of *her* pause. I caught it and reverted, funding the eleven words from throat-clearing
elsewhere. The attribution is back in intro paragraph three and the count still sits at the low end
of a cited window. If a later pass wants it gone, cut the count, not the attribution.

**Verifier remaining-work #5 — inaugural-committee beat had no outlet on the page — fixed.**
Verified independently: NYC Mayor-elect Mamdani named her to the inaugural committee on **December
24, 2025** (ABC7 New York; also Haaretz Dec 25, The Hollywood Reporter, Times of Israel). "ABC7 New
York, December 24, 2025" added to the section source card. The in-prose date stays "In December
2025", per PROTECT-14.

**Verifier remaining-work #6 / RQ-06 — December 2025 primary — upgraded, not closed.**
Also the grader's TO REACH A #5. The Instagram primary was still not retrieved, but the statement is
now **quoted rather than paraphrased**, dated December 8, 2025, and attributed to a named outlet
relaying the post (Middle East Eye, corroborated by Yahoo News and Al Jazeera):

> The group, she wrote on Instagram, "should not be able to try to ruin people's lives, cause them to
> receive threats and need security." Then she stopped arguing the charge and named the cost: "This
> has taken such a toll on me and my family and all I've wanted was to help kids."

The Rabbit Hole's stress-arrow argument now rests on quoted text instead of a summary, and its
reference is re-keyed to "The December 8 statement." Middle East Eye added to the section source card
and to `citations`. RQ-08 (the Washington Post original) remains open by design, with its on-page
disclosure untouched.

**Grader cap — cross-draft sameness — three of four moves varied (TO REACH B+ #1).**
1. *Reader-command imperatives:* all cut. "Sit with the mechanics of that", "Watch it once with the
   sound off", "the first two words are the ones worth reading twice", plus a fourth the grader did
   not catch, "Watch any episode and…" inside the PROTECT-07 paragraph (rewritten to "The sentence
   underneath every episode is…", thesis sentence untouched). A sweep confirms zero remain.
2. *Opening machinery:* the epigraph is gone. The piece now opens cold on the `firstLetter`
   paragraph, which is the machinery the grader flagged minus one of its three components.
3. *TL;DR:* all six bolded-noun-with-colon labels removed; every bullet is now a sentence. Bullet 3
   was also re-aligned to the P0-02 wording ("told she might be getting paid to post about Gaza"
   rather than "funded by a terror group").
4. *Return-to-the-wound close:* **deliberately not varied — see Unresolved decisions.**

**Grader — metronomic section closers — two sections now end ordinary.**
"…and sold it to Netflix." is now "Her most characteristic posture is by now also a production
technique with a Netflix license attached." "Plural. She kept finding it." is cut, so the childhood
section ends on her own quote. I chose these two because every other closer on the grader's list is
either PROTECT-listed (rectangle, Cameo) or an explicit P1 keep ("debts get apologized for" is
P1-06's repair text; "She answered it with somebody else's children" P1-14 says to keep).

**Grader — stale testimony ledger / thin corroboration — fixed both ways (TO REACH B+ #2).**
Tareq Hailat is now in the body, in the founding section where Aron was the only witness:

> Tareq Hailat, who runs the treatment program at the Palestine Children's Relief Fund and has worked
> with her off camera, told the Post the same thing from outside the marriage: "She is in real life
> as she is on screen."

The ledger is re-enumerated to the three quotes that are actually in the body (Aron, Hailat, Hafeez —
Hafeez's row previously quoted a line the body does not use; it now quotes the one it does). Gate
rule is ≥2. Dobrow and the Democracy Now! Hailat quote are moved to a "gathered, not currently in the
body" block so a later pass with word headroom lands them first rather than re-researching them.

**Grader TO REACH A #4 — the two unsourced load-bearing numbers — fixed by sourcing, not dropping.**
- Subscribers/views: "20.2 million subscribers and 16.2 billion views" traced only to Wikipedia (S-01),
  which the packet itself says cannot carry a claim alone. Replaced with the figure a fact-checker can
  open: "By the time The Hollywood Reporter visited her studio in November 2025, the channel had 17.5
  million subscribers, Netflix had called its version of the show the biggest kids launch in the
  platform's history…" (S-10). The Netflix superlative is now attributed to Netflix rather than
  asserted. P1-04's dating and past-tense-at-launch requirements are preserved.
- Capitol Hill: "The Washington Post counted 535 packets…". Spokesman-Review's syndicated copy of the
  Gibson piece (2026-06-11, S-05) added to `citations`. P1-14's figures and its closing line unchanged.

**Ledgers restamped.** TESTIMONY re-enumerated as above. FORMULA FINGERPRINT's similarity stamp
re-run: 0.038 vs Benny-Blanco (was 0.040), trip threshold 0.04 → clear. HEADING MIX unchanged — all
nine H2s survive verbatim, 7 search-intent or hybrid. DISTRIBUTION unchanged — still one type-theory
paragraph outside the diagnosis and the Rabbit Hole. `content_quality` and `lastmod` untouched.

## Protected hits checked

All fourteen verified by exact string match against the post-revision file, not by reading a log.

| ID | Status | Note |
| --- | --- | --- |
| PROTECT-01 | intact, verbatim | both sentences byte-identical; surrounding paragraph untouched |
| PROTECT-02 | intact, verbatim | Aron/Herbie sentence unchanged; only the preceding Herbie gloss was tightened by five words |
| PROTECT-03 | intact | Aron's quote at full length plus the reversal, still one unit; Hailat lands *after* the pair, not between them |
| PROTECT-04 | intact | empathy turn, "None of which makes the criticism wrong.", AAP, Sannes with her disclaimer, Hafeez caveat and the rectangle line all present. Compression here was four words total and touched no critical claim. The criticism is not softened |
| PROTECT-05 | intact | five labeled beats survive; only the "Here is the entire method, in order." throat-clear above them was cut, and two beat bodies lost three words |
| PROTECT-06 | intact | all three hedges verbatim |
| PROTECT-07 | function intact, placement still deviates | thesis verbatim; "Watch any episode and" rewritten to a non-imperative inside the same paragraph. See Unresolved decisions |
| PROTECT-08 | intact | both sentences present. The school roll-call I cut is not part of the protected specifics; the four-item career list that precedes the argument is intact |
| PROTECT-09 | intact | arms-out image present; "She is just on the other side of it." is still the final reader-visible sentence |
| PROTECT-10 | intact | `inner-thought` block and the whole Cameo beat unchanged. The intro's miniature retelling of it was removed, which strengthens rather than threatens the beat |
| PROTECT-11 | intact | "The successor loses to the institution." present; the refusal quote kept; only an eight-word gloss trimmed |
| PROTECT-12 | intact | jargon sweep of the reader-visible body outside the Rabbit Hole: zero hits. Gate sentence present. Every repair stayed inside the quarantine |
| PROTECT-13 | intact, verbatim | anomaly still ends open; falsifier still stated |
| PROTECT-14 | intact | no relative-date conversions. Two absolute dates *added* (December 8, 2025 in prose; December 24, 2025 on the source card) |

## Unresolved decisions

1. **Grader TO REACH A #6 — "break the closer's shape" — rejected, deliberately.** The grader asks
   to let the trolley land "without the mirrored second sentence." That mirrored sentence is
   PROTECT-09, nominated by three perspectives and verified intact one pass ago. Deleting a protected
   hit to break a cadence is the wrong trade, and TO REACH B+ #1 only asks for three of the four
   sameness moves — which the reader-commands, the epigraph and the TL;DR supply. Recorded rather
   than silently dropped; if DJ wants the close re-shaped, that is a decision above this pass.

2. **PROTECT-07 paragraph order, carried forward unchanged.** The run is still disclaimer → P0-13
   objection → reframe, where the synthesis said "do not separate it from the disclaimer." The
   verifier declined to count it as a regression and so do I: the disclaimer's bridge sentence still
   points at the reframe. A human should read those three paragraphs in order before finalizing. No
   edit made.

3. **Headroom is six words.** At 4,494 the draft sits just under the ceiling and inside the lint's
   thin-headroom warn band. Any later addition must cut first or argue
   `BLOG_LINT_WORD_CEILING`. The named cheap cut, if one is ever needed, is the "Both are still about
   somebody else's children" paragraph's Glamour detail in the Rabbit Hole.

4. **RQ-08 open by design.** The Washington Post original was still not retrieved this pass. The Type
   1 discriminator's on-page disclosure ("rests on a single spousal account in one friendly profile")
   is unchanged and still doing its job.

5. **Two dropped quotations, recorded so they are not lost.** Hoffman's GMA line and the Glamour
   podium line ("my sisters are not numbers. They are moons.") were cut for words. Both are verified
   and both are worth restoring if the ceiling is ever raised for this page.

This does not declare the perspective gate passed. `/blog_perspective_verify_people` must rerun
against this draft: the length cut and the Dec 8 quotation are exactly the kind of change the prior
verification said would require one.
