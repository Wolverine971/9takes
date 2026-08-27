---
artifact: perspective-verification
schema_version: 1
subject: Marcus-Aurelius
draft_sha256: ae7bb1e099eb106f3632101f66368088b49c3b66fd20073a3b5edbb109c9a645
final_content_sha256: 1acddd19cc0fd2b1f7293698f55682e83fef0a2df2efa76f49ec9817d8a04190
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-27T08:11:49Z
path: docs/content-analysis/perspective-reviews/Marcus-Aurelius/2026-08-27_020004/verification-initial.md
---

## Verification verdict

All nine P0 repairs land against their own acceptance tests, and no protected hit regressed.

Snapshot integrity confirmed first: `shasum -a 256` of `draft-reviewed.md` returns
`ae7bb1e0…c9a645`, matching both `context.json` and the `draft_sha256` in `synthesis.md`,
`editor-resolution.md` and the supplied argument. The frozen snapshot's reader-visible hash
(`7617a420…36b5`) matches `context.json`'s `reader_visible_content_sha256`, so the reviews and the
synthesis were written against the same text I diffed. The current draft's reader-visible hash is
`1acddd19…4190`.

The pass is not a formality. I re-checked each P0's underlying source rather than accepting the
editor's self-check: HA _Avidius Cassius_ 14.1–3 and 1.7–8 (packet TP-5), Long _Med._ 8.1 and 5.9,
HA 21.3–5, Eusebius _EH_ 5.1.44 and 5.1.47 (packet CLM-07), Loeb vol. 1 p. 109 (CLM-06), the two
in-repo wing definitions at `src/blog/enneagram/enneagram-type-1.md:138,:140`, and the packet's dated
child list. Two assertions entered the page as part of repairs and are **not** in the evidence packet;
I settled both independently rather than leaving them on the editor's word. Epictetus _Discourses_
3.10 in George Long's translation does end "Blame what is wrong, in what is right rejoice" — fetched
and read whole on Wikisource — and Long's Epictetus was published by George Bell and Sons, London, in
1877, so the new edition-of-record attribution in the diagnosis section is correct. The Commodus 166
date came from the critic's own research log (CRITIC-C4, multiple independent sources), not the
packet, and is arithmetically consistent with the page (Commodus b. 31 August 161, Caesar 12 October
166, aged five).

Two accepted P1s did not land: **P1-01** (the genre objection and a falsifiable falsification clause)
and **P1-02** (Med. 11.18's self-reproach line). Both were deferred with a stated reason — the page
sits at 4,495 body words against the 4,500 ceiling and the two items cost roughly +95 together — and
escalated to DJ as a `BLOG_LINT_WORD_CEILING` exception, which is exactly where the synthesis put the
decision ("that is DJ's call to make, not the editor's — flag it rather than silently exceeding").
Deferred-with-reason does not fail this gate, but it is the first item under Remaining work because
the synthesis rates these the page's answer to its own strongest objection.

`pnpm`-side checks re-run against the current draft: `scripts/blog-lint.sh` returns 0 fail / 2 warn
(4,495 words; thin-headroom warning; one comparative contrast pattern that lives inside a verbatim
Fronto quotation). `scripts/blog-source-audit.mjs` returns 6 load-bearing quotes, 6 inline, 0 vague,
0 untagged — so the two quotations this pass added did not degrade the citation discipline that
PROTECT-08 exists to defend.

## P0 resolution check

**P0-01 — welded hostile witness. Resolved.**
"A philosophical old woman" is absent from reader-visible prose; the three remaining hits are all
inside HTML comments (TESTIMONY LEDGER provenance, REVIEWER NOTES, the frozen fresh-eyes block). The
witness is now one document, one speaker, one date: "In a letter dated to his 175 revolt, in the
Historia Augusta's life of him, Avidius Cassius complains that Marcus 'philosophizes and meditates on
first principles' and 'takes no thought for the state,' and 'wishes to be called merciful and hence
suffers to live men whose manner of life he cannot sanction.'" Both quoted fragments are verbatim
against packet TP-5's transcription of HA _Avidius Cassius_ 14.1–3, and 14.1's own heading dates that
letter after Cassius declared himself emperor — so a reader opening HA _Avidius Cassius_ 14 finds the
page's attribution matching the text's heading. The hedge was widened to name the forgery problem
("its letters are generally judged forgeries"), which the synthesis flagged as the aggravating fact.
TL;DR bullet 7 was replaced rather than deleted ("a rival general's letter accused him of meditating
on virtue while the state went unattended") and TESTIMONY LEDGER item 5 now records the correction.

**P0-02 — the Rusticus referent. Resolved.**
"Marcus found the Stoics through a different teacher, Junius Rusticus, and thanks him for it in the
notebook: 'I am indebted to him for being acquainted with the discourses of Epictetus…'" The name sits
adjacent to the Med. 1.7 quotation and the referent chain can no longer land on Fronto. The repair
also pays forward: the diagnosis section's new P0-06 paragraph opens "The exercise Rusticus handed him
answers it," which only parses because the name is now on the page.

**P0-03 — the closing beat and Med. 8.1 / 5.9. Resolved.**
"That reader had already decided, and never revised" is gone. The closing now carries both the frame
and the turn: "Book 8, in the same 1862 George Long text, opens on the shortfall, plain 'both to many
others and to thyself,' and then turns: 'throw away the thought, How thou shalt seem to others, and be
content if thou shalt live the rest of thy life in such a way as thy nature wills.' He wrote down the
verdict and the permission to stop caring who saw it, and he kept needing both." Med. 5.9 is restored
through "and be content if the greater part of what thou doest is consistent with man's nature," and
the "faster recovery" gloss is replaced by "the correction he kept reissuing was permission to settle
for most of it." The word "everyone" now appears only at "the quality everyone buys it for is calm"
and "power to correct everyone in the empire" — neither stands against "both to many others and to
thyself"; TL;DR bullet 2 and FAQ 1 both read "where others could see it." The repair lands before the
preserved closing sentence, which is untouched. See Remaining work #2 for a residual on the timeline's
framing verb.

**P0-04 — the five days of mourning. Resolved.**
HA 21.5's own explanation is on the page in all three places the synthesis named. Body: "The source is
unreliable and the number may be invented, and it gives its own reason four lines on: the games of
Jupiter were running and he did not want them halted for public mourning. What that does not explain
is the business he took during them, and that is what Fronto had been complaining about for twenty
years." The character inference is now attached to the business he transacted, which is precisely what
the games clause does not cover — the narrower, stronger form the synthesis asked for. TL;DR bullet 6
carries "partly a festival-calendar decision"; FAQ 5 carries "the same passage adds that the games of
Jupiter were then in progress and he did not want them interrupted by public mourning."

**P0-05 — the Lyon paragraph. Resolved.**
"The only detailed account is Eusebius, writing more than a century later" returns zero hits. The
replacement describes the source correctly and carries the inculpatory item: "The detailed account is
a letter the churches of Lyon and Vienne wrote at the time, preserved by Eusebius a century later, and
in it the governor writes to the emperor and waits: 'For Caesar commanded that they should be put to
death, but that any who might deny should be set free.'" That is _EH_ 5.1.44 plus 5.1.47 verbatim
against packet CLM-07. Four counterweights follow in the same breath — no other contemporary source,
the letter names no emperor, Marcus weeks' march away, and Tertullian now carrying the caveat that his
document is widely judged spurious. Nothing is adjudicated in either direction, and PROTECT-10's "It
does not resolve, and it should not be smoothed over" still closes the paragraph verbatim. RQ-01 was
correctly left unresolved; no weighting claim about the rescript's authenticity was made.

**P0-06 — the clincher. Resolved.**
"That last part is what settles it" is deleted. The section now runs: "Every Stoic marked himself in an
empty room, which is the objection this typing has to survive. The exercise Rusticus handed him answers
it. The version Epictetus drilled into students, at Discourses 3.10 in George Long's 1877 translation,
ends 'blame what is wrong, in what is right rejoice.' Marcus ran the blame half for thirty years. The
rejoicing half he wrote out as Book 1, and assigned every item in it to somebody else." Applying the
acceptance test as written — a Stoicism-literate reader can now state what Marcus did that other Stoics
did not, and the honest answer is no longer "he did the exercise" but "he ran only its debit column."
I verified the Long wording directly rather than trusting the citation. PROTECT-14 survives verbatim
as the definition; PROTECT-03's holiday-section Book 1 passage was not cannibalised; no type
vocabulary migrated into the narrative body.

**P0-07 — the Six test. Resolved.**
"Cleanly" returns zero hits. The discriminator now rests on the stake: "The 143 Senate letter is the
test case, and it turns on what he is afraid of. A Six in that position is managing danger. His worry
is not that something bad will happen to him. It is that he may not deserve his own teacher." FAQ 2
now reads "in a reply to a letter from Fronto whose praise he had just called a rhetorical device,"
which is consistent with the letter's opening sentence at Loeb vol. 1 p. 109. The editor also repaired
two sites the synthesis did not list — the timeline's 143 entry ("Fronto sends praise salted with
abuse. Marcus names the technique") and the body line, now "He sees the flattery for what it is and is
moved anyway" — plus the Rabbit Hole's Type 6 counterargument, which had rested on the same refuted
reassurance framing and now reads "danger for a Six, desert for Marcus." Nothing on the page
contradicts the letter's opening sentence. PROTECT-04 survives verbatim in both places.

**P0-08 — the 1w2 call. Resolved.**
The paragraph now names the axis the linked guide actually uses, concedes the fact that cuts against
it, and does not lead with warmth: "The axis is direction. The 1w2 advocate aims the correcting impulse
at people and leaves the bench to fix your case personally; the 1w9 idealist turns it inward and rarely
corrects you at all. On that axis Marcus reads 1w9, and the concession has to be made plainly: his
correcting ran inward. What pulls the call back is that his obligations ran to named people rather than
to principles." Confidence is hedged in the opening line ("it is the least certain judgment on this
page"). "People held at a distance" — the clause that appeared in neither in-repo definition — is gone.
I re-read `src/blog/enneagram/enneagram-type-1.md:138` and `:140`: the rebuilt paragraph is consistent
with what a reader finds after clicking through. PROTECT-12 was not laundered back in; the non-corrector
concession stays in Counterarguments.

**P0-09 — the pre-161 child count. Resolved.**
"Do the subtraction. He buried at least seven of his own children, most of them small, and at least
five before he was ever emperor." The packet's dated child list gives five deaths before March 161
(entries 1, 2, 3, 6, 7) with entry 13 possibly a sixth, so "at least five" is derivable from that list
as a floor and does not assume a different one. "Do the subtraction" and "That is a man counting what
was left" both survive.

## Accepted improvements check

| ID            | Status                   | Note                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-01         | deferred-with-reason     | Not applied. Word ceiling; escalated to DJ as a `BLOG_LINT_WORD_CEILING` exception per the synthesis's own instruction. The Counterarguments block still does not name the self-examining-genre objection, and "What would change our minds" still names a condition its evidence base cannot produce. Remaining work #1.                                                                                                                                                                                                                                                                                                   |
| P1-02         | deferred-with-reason     | Not applied, same reason. Med. 11.18's self-reproach clause is absent. The synthesis prefers this one if only a single item can be afforded. Remaining work #1.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| P1-03         | completed                | Heading "at 22 and at 54"; body "More than thirty years, two languages, two readers, one report"; TL;DR "Three decades on"; FAQ 1 "More than thirty years later"; falsification clause "three decades apart"; timeline "age ~54"; closing "He was fifty-four." All reader-visible statements now agree and match the timeline's endpoints. The editor also caught an unflagged consequence and updated FAQ 2's `anchor:` to `two-archives-one-emperor-marcus-aurelius-at-22-and-at-54`; I re-derived all five FAQ anchors against the current H2 slugs and every one resolves.                                              |
| P1-04         | completed                | All seven edits verified by grep. `[0-9]+ of [0-9]{3} published profiles` returns nothing while `(/corpus-stats)` survives; the empathy turn reads "millions" against the spine's hedged "five to ten million"; "the whole explanation" → "That is the explanation of the beach"; PolitiFact absolute → "that no one has been able to find in the book"; both superlatives now "one of the most…"; "a cabinet of Hadrian's that the biographer calls holy" matches HA 17.4's "a particularly holy cabinet"; "which recur throughout it"; `Gladiator` carries (2000). No edition-of-record attribution was cut to fund them. |
| P1-05         | completed                | "Dio corroborates the auction independently, and records him telling the senate, on a later occasion, the plainest sentence he ever aimed at it." No sentence now asserts that Dio 72.33.2 states the principle of the auction. Dio 72.32.3 is carried verbatim ("on the ground that he was not an open-handed prince"), so the page's most admiring section now holds an adverse contemporary judgment. PROTECT-06's narrative unit untouched.                                                                                                                                                                             |
| P1-06         | completed                | The quotation is now framed as part of "that same confession about gossiping, which he offers as proof that he loves him," followed by "He adds that he could not bear to hear it from anyone else" — which is packet-supported (Loeb vol. 1 p. 207: "But if anyone else found fault with you in my hearing… I could not listen to him"). The frame sits outside the quotation marks and the quoted words are verbatim; I checked this specifically because the editor logs a reverted first attempt that had spliced "Time was" inside the quote. It is clean now.                                                         |
| P1-07         | completed                | Occasion named once at the diagnosis ("He was twenty-five, apologising to Fronto for an exercise he had not written… is the excuse"), matching packet CLM-04. The epigraph is unqualified, as required. The subtype paragraph's Ariston re-quote is gone and Dio 72.6 carries the austerity claim alone.                                                                                                                                                                                                                                                                                                                    |
| P1-08         | completed                | "But the path was set long before the argument got hard. Commodus was made Caesar in October 166, aged five, when nobody could assess his character at all." The constraint argument is kept and scoped with "by then." Date and age check out independently. PROTECT-07 untouched.                                                                                                                                                                                                                                                                                                                                         |
| P1-09         | completed (minimum form) | "built no school of his own." The richer Athens-chairs form was applied and reverted for budget; the acceptance test as written is met.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| P1-10         | completed                | "It runs hotter than that in places, into the language of physical longing, and scholars have argued for two centuries over how to read such language between a Roman student and his tutor." The subject of the dispute is now nameable in one sentence, the article takes no side, and the packet's no-romantic-or-sexual-claim-in-either-direction handling rule holds. The existing pivot is kept verbatim.                                                                                                                                                                                                             |
| P1-11         | completed                | Summary line is now "Wings, subtypes, and the case against this read." No instruction to skip. The block was not moved into the body, so PROTECT-13's one-paragraph cap holds.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| RQ-01         | deferred-with-reason     | Correctly deferred; the synthesis states it does not block P0-05, and the delivered paragraph adjudicates nothing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| RQ-02 / RQ-03 | deferred-with-reason     | Both gate P2 items that were not taken. No Rusticus/Justin Martyr material appears on the page, as instructed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

P2 items: none taken, which the synthesis permits. The one non-prose action was taken — the deferred
Ryan Holiday cross-link moved out of the in-file REVIEWER NOTES into
`docs/content-analysis/entity-gaps/Marcus-Aurelius.md` (FUTURE-C2); that file exists.

## Protected-hit regression check

Zero regressions. Each item checked by literal string match against the current draft, and the two
adjacency-dependent ones checked by reading the surrounding lines rather than by grep alone.

- **PROTECT-01** — present at line 265 and still the paragraph _immediately_ following the debt-ledger
  paragraph at 263. Nothing was inserted between them, so the explanation still does not read as an
  excuse.
- **PROTECT-02** — the Alsium cold open survives in full, including the polecat sentence and "His own
  teacher could not talk him into a beach."
- **PROTECT-03** — "A man who believes every good thing in him is borrowed experiences rest as spending
  money he did not earn…" intact. P0-06 names Book 1 in the diagnosis section without re-narrating this
  passage, which was the live cannibalisation risk.
- **PROTECT-04** — verbatim, and now the load-bearing form of the Six test in both the body and the
  Rabbit Hole.
- **PROTECT-05** — "Nobody writes a numbered protocol for a problem they do not have." Verbatim, still
  in the anger section.
- **PROTECT-06** — "He held a yard sale instead," the two-month `key-stat`, the inventory, the refund
  offer, and the Book 6 "not made into a Caesar" turn all intact. The only change inside the unit is
  P1-04's sourced "holy."
- **PROTECT-07** — the refusal to resolve, the rejection of the HA's retrospective prophecy, and the
  sickroom close ("sent him out of the room at once, in fear that the boy would catch what was killing
  him") all intact. P1-08 strengthened the indictment ahead of them without touching the ambivalence.
- **PROTECT-08** — the highest-risk item in a word-starved pass, and it held. "George Long's 1862
  translation," "printed at page 217 of the 1919 Loeb Classical Library edition," and the epigraph's
  "Loeb Classical Library vol. 1, 1919" all survive. The independent check that matters more than the
  greps: `scripts/blog-source-audit.mjs` reports **6 inline / 0 vague / 0 untagged**, and both
  quotations added by this pass (Epictetus _Disc._ 3.10, Long 1877; Med. 5.9, Long 1862) carry editions
  of record.
- **PROTECT-09** — the Faustina refusal and its FAQ sentence intact. P2-07 was not taken, so no rumour
  was admitted.
- **PROTECT-10** — both sentences verbatim: the Vindobona/Sirmium sentence and "It does not resolve, and
  it should not be smoothed over," the latter still closing the rewritten Lyon paragraph.
- **PROTECT-11** — "A Five builds. This rehearses." intact, and the cosmological concession still
  precedes it. P1-04 changed only the premise quantifier around it.
- **PROTECT-12** — the non-corrector counterargument intact and still in Counterarguments; confirmed by
  reading the rebuilt wing paragraph in full that it did not migrate there as 1w2 evidence.
- **PROTECT-13** — type-theory paragraphs outside the diagnosis section and the Rabbit Hole: still
  exactly one ("This is the least visible thing about Ones…"). P0-06's addition sits inside the
  diagnosis section; P1-11 moved no content into the body. The DISTRIBUTION LEDGER remains accurate.
- **PROTECT-14** — "the standard measures whether you are good at the root, and the marking continues in
  an empty room" plus "With Marcus the room was always empty," verbatim. It survives as the definition;
  only its status as the clincher changed, which is what Conflicts item 3 resolved.
- Also verified present, one occurrence each: "Everything you can buy at an airport with his face on it
  descends from that accident"; "has a war for a return address" (with P1-04's softening, rhythm kept);
  the Epictetus kiss-your-child line and "He did not have to imagine that"; "The easy version of this
  story would be hypocrisy, and it is not available"; and the closing paragraph, "He was fifty-four, and
  he had been at it since he was twenty-five, and he was still marking the same paper."

The pass funded roughly 360 words of repair with cuts, and cuts are where regressions usually hide. The
material removed — the Ariston re-narration and its two re-quotes, the Anicetus and 162 timeline
entries, the "great sleeper" letter, the Book 10 "be such" quotation, and sentence-level tightening —
touches nothing on any preserve list. Two perspectives independently asked for the Ariston repetition
to go.

## Remaining work

1. **P1-01 and P1-02 are open and need DJ, not another editor pass.** The page is at 4,495 of 4,500 body
   words. The two items cost roughly +55 (or +90 with the HA 2.6 addition) and +40. Until one of them
   lands, the Rabbit Hole's closing line — "What would change our minds: evidence that the self-criticism
   was situational. The two archives close that door, three decades apart, saying the same thing." —
   still names a falsification condition that two self-examining archives structurally cannot produce,
   and Med. 11.18's "when thou shalt reproach thyself for anything, for this is an evidence of the diviner
   part within thee being overpowered" is still absent from a page that cites the rest of 11.18. Three
   perspectives raised each. The decision is a `BLOG_LINT_WORD_CEILING` exception for this page with the
   reason recorded in-file, or shipping without them; the synthesis prefers P1-02 if only one is
   affordable. This is a publishing judgment, not a defect, and it does not block the gate.
2. **The timeline still frames a mid-sentence quotation as an opening.** The c. 175 entry reads "Book 8
   begins by conceding the shortfall:" and then quotes from "it is no longer in thy power…". Long's 8.1
   actually opens "This reflection also tends to the removal of the desire of empty fame, that it is no
   longer in thy power…", so the concession is real but is embedded in a therapy against vanity. The
   synthesis's minimum repair specified "Book 8 turns"; the editor wrote "begins by conceding the
   shortfall." This clears the acceptance test — the closing carries the frame and the turn, and no
   instance now presents 8.1 as a fixed, unrevised self-verdict — but it is the same truncation-with-a-
   direction reflex the P0 set exists to correct, in the one spot where it survives. A three-word swap to
   "Book 8 turns on the shortfall:" or "Book 8 concedes:" costs nothing and closes it. Not a P0.
3. **"Cassius' head" is still bare in the Rabbit Hole.** P0-01's minimum repair asked for "Avidius
   Cassius" in full at every mention so the general is never confused with Cassius Dio (UNFAM-C5), and the
   subtype paragraph two screens below opens with "Cassius Dio reports…". The bare form sits in the same
   sentence as "Avidius Cassius raised an army against him in 175," so the referent is locally
   unambiguous and the acceptance test does not require the fix. Worth one word at the next pass.
4. **Editorial comments carry two stale figures.** The FORMULA FINGERPRINT LEDGER still describes the
   bespoke section as "a dated braid… across thirty-three years," and the frozen FRESH EYES block quotes
   the retired "Thirty-three years, two languages, two readers, one report." Neither is reader-visible and
   neither is counted by the content hash, but the ledger is a working document that a later pass will
   read as current. One-line fix.
5. **Word ceiling is a standing constraint on the next refresh, not a defect now.** `blog-lint.sh` warns
   at 4,495/4,500. Any future addition — including P1-09's richer Athens-chairs form, P1-01, P1-02, or
   P2-07's HA-usage criterion — needs a funded cut or a recorded ceiling exception. The named safe cuts
   from the synthesis's ledger have already been spent.
