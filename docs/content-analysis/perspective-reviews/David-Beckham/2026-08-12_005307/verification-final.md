---
artifact: perspective-verification
schema_version: 1
subject: David-Beckham
draft_sha256: ef21a39480d947899e1e1eda8c5122aeaf406d087389c2a02b9cb45ab236ee99
final_content_sha256: 7268f963163088e0dd8a1018cd3dc94edbdd98269c8bf423add03a6306d8bbff
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-12T06:31:58Z
---

## Verification verdict

The chain verifies. `synthesis.md` carries `draft_sha256: ef21a39…`, which matches the supplied `--draft-sha`, and `shasum -a 256` on `draft-reviewed.md` returns the same value, so the frozen snapshot is the file the jury actually read. `draft-reviewed.md` hashes to `f381c73a…` under `hashReaderVisiblePerspectiveBody`, matching `reader_visible_content_sha256` in `context.json`. The live draft now hashes to `7268f963…`.

This is the second verification of this review. `verification-initial.md` passed the post-editor state at content hash `a7fe2a41…`; `revision-resolution.md` then applied a grade-driven pass on top of it. I re-ran every acceptance test from scratch against the current text rather than diffing against the earlier verdict, because that pass moved two whole section blocks and a structural move can break an item that a targeted edit left alone.

All eleven P0 items pass. All ten accepted P1 items are complete. All ten `PROTECT-*` items survive, fourteen of their load-bearing strings confirmed present by exact-string grep.

The three fixes `revision-resolution.md` claims are real and land where it says. The Ferguson blockquote is out of the diagnosis section and now sits in the father section as reported prose; `scripts/blog-source-audit.mjs` confirms the consequence independently — **1 load-bearing quote, 1 inline, 0 vague, 0 untagged**, both hard gates passing, where the prior state was 1 inline and 1 vague. The 1998 clause reads "he did not plead his case at the time." The commercial-reading hedge reads "Read that way, when it cracked the whole enterprise was on the line."

The two structural moves did not damage anything gate-bearing, and both bridge seams were rewritten rather than left dangling. The old beekeeping slot now closes with "The private version had run for a decade. At 23, the public verdict arrived overnight," which hands off to the 1998 section cleanly. The new slot opens with "He walked into one other arena that will not answer to finished work, and this one he chose," which picks up the estrangement section's "the method has had nothing to offer" rather than the night walk that used to precede it. The closer's "Which leaves the hives" is now two sections from its referent instead of five.

I checked every factual assertion this pass introduced against a source trail and found none floating. The Netflix episode-two release date, Kath Phipps as the named witness for the posted bullets, the 6 November 2018 Melreese referendum date, the October 2021 reporting of the ten-year tourism deal with both figures marked unconfirmed, and the collapse to "*Country Life*'s October 2025 issue" all trace to the draft's revision-pass research note and testimony ledger items 1, 7 and 9. The ledger also records what was *not* asserted: no Ferguson volume, no episode number for Ted's line. The unsourced "fans punched his car window" detail was cut rather than left in.

Two cross-checks beyond the item list, both clean. The frontmatter parses under `gray-matter` (5 FAQs, `lastmod` untouched at 2026-07-13), so the pass did not reintroduce the YAML break that bundles into the build. The six em-dashes in the reader-visible body are all citation attributions in the house format; prose em-dashes remain at zero.

No targeted research was required. No P0 acceptance test turned on a fact the packet could not settle — RQ-01, the one open question that touches a P0-adjacent slot, was resolved by demotion rather than by asserting an unverified volume.

## P0 resolution check

| ID | Status | Acceptance-test result |
| --- | ------ | ---------------------- |
| **P0-01** | resolved | "Charity Shield" occurs once, "mohawk" once, "shaved" once, all in a single telling. "Beanie" and "the reveal was the whole point" return zero hits. No sentence claims a reveal occurred at that fixture. |
| **P0-02** | resolved | "Roy Keane, a man with no taste for sentiment, has described it in terms he uses for almost nothing else" and "Asked, decades on, how he functioned through it." Both quotes verbatim, both cited "in archive shown on *Stick to Football*, October 2023." No sentence describes a physical reaction, a room, or a named questioner. Ledger items 2 and 4 record the transcript line ranges establishing clip playback. |
| **P0-03** | resolved | His own account is present and matches the transcript: "He credits the people around him: a manager, a team, teammates he knew had his back every time he walked out. He also calls the red card his own mistake and says he was punished for it." "He delivered" survives as the article's added observation. The therapist quote is followed by "He does not leave it there: in the same breath he says that talking, these days, is a good thing." The 1998 FAQ carries the same repair; `persona_title` is "Football's Most Practised Idol." No body or frontmatter sentence asserts he offered no explanation. |
| **P0-04** | resolved | Regex sweep for causal-origin constructions returns zero substantive hits (the five matches are "made him strike balls," "made himself the face," and the H2 "The work that makes David Beckham wait"). The passage reads "The transaction is the thing to watch, whatever produced it… Ted did not build a Three. He set the terms a Three would spend a lifetime meeting." The TL;DR "love is earned by delivering" bullet is retained as a lesson. |
| **P0-05** | resolved | The claim is marked as reading throughout — "at least on the commercial reading nobody has ever let go of," "On that reading," and now "Read that way" for the sentence the initial verification flagged. His denial follows in his own words: "Beckham rejects the reading. Asked on the BBC's *Desert Island Discs* in 2017… 'Of course not. We stay together because we love each other.'" Left unresolved, as required. |
| **P0-06** | resolved | Disclosure at first citation in the cold open ("made by his own production company"); his response travels with the heaviest citation ("It is his own company's series; he has said he had no editorial control over it"); the Qatar section converts it to observation ("the four-part Netflix documentary his own company had made"). |
| **P0-07** | resolved | The dated sentence now reads "He told Sky Sports that he had spoken with members of the LGBTQ community who felt safe at the tournament, and that he was proud to have taken part." "Engagement through sport" returns zero hits in body and frontmatter. The Qatar FAQ carries the same repair and opens "As of 2026." |
| **P0-08** | resolved | The rendered blockquote is "…or everything has to be in pairs**...** Everything has to be perfect." Ledger item 5 records the identical rendering, so visible quote and ledger match. |
| **P0-09** | resolved | "Never once" returns zero hits; the `inner-thought` block ends on "has already started slipping." A sweep for unhedged private-mind constructions returns nothing. The block's psychological reach survives. |
| **P0-10** | resolved | "It started before Argentina. Adidas signed him in 1996 and Brylcreem in 1997, when he was 22. What 1998 added was urgency." "It worked like insurance" still appears; "Call it vanity if you like" returns zero hits. Nothing places the diversification after the hunt. |
| **P0-11** | resolved | "Went public with an allegation," plus exactly one sentence of contest: "It has never been settled, and when the series revisited the episode in 2023, Loos said publicly that it cast him as the victim and her as a liar." Not expanded. |

## Accepted improvements check

| ID | Status | Result |
| --- | ------ | ------ |
| **P1-01** | completed | Heading and body both read "Social (so), with a strong Self-Preservation (sp) second." Justification rests on evidence — image management, audience reading, the Alice band, the *Attitude* cover, Real Madrid — with SP retained for the security-and-provision material. The counter-type note is present. No clause rests on vocal manner or reserve, and the paragraph reads without contradiction against "the most image-conscious footballer in England went to Real Madrid." |
| **P1-02** | completed | "The Nine case is stronger than his manner, and manner is the weakest version of it. Ted settled what his son would be at roughly the moment of his birth… That is what merging looks like, and it would explain the calm," answered by "the set of arenas nobody handed him." PROTECT-03 closes the paragraph, so the steelman is not ended by explaining it away. |
| **P1-03** | completed | "That habit returned six league titles, a Champions League and 115 England caps, six of those years as captain." Position stated plainly: "seven years at right back with Beckham in front of him at right midfield." Timeline reads "Retires at Paris Saint-Germain, a champion in his final season." No palmarès paragraph. |
| **P1-04** | completed | "1999, the answer" and "2002, the penalty" present at the existing one-line cadence; "1998, the effigy" cut; block runs 1999 → 2000 → 2001 → 2002 → 2003 → 2013. The 1998 opponent reappears at the moment of recovery and the treble is nameable from the article. |
| **P1-05** | completed | "A contract with Adidas for fifty thousand pounds and spent fifty thousand pounds on a BMW M3" — "boot" and "the same week" both gone. The paps line is attributed to footage: "Filmed being asked about a Gucci jacket, he said…" Keane's "one condition" is now general tolerance. "The flash Cockney" kept. |
| **P1-06** | completed | "Her objection did not change the method, and the method produced what Ted wanted." Sandra gains "thinking it too strict" and "worked as a hairdresser and in nursing homes." CRITIC's protected first half is intact; no sentence in the origin section grades Ted's methods in the article's voice. |
| **P1-07** | completed | "At 51" returns zero hits; "cannot produce this" returns zero hits, replaced by "has not been able to produce this." "Now" is anchored to "Since January 2026." The `description` carries no "still"; the closer's surviving "still" is date-anchored ("In 2023 it was still walking him through his own house at 2am"). The cold open's present-tense routine sits adjacent to its 2023 source. The Qatar FAQ opens "As of 2026." No bare age lacks an adjacent year. |
| **P1-08** | completed | Body carries the counter-case with content, not an address: "The serious case against is Type 9: he spent thirty years executing a plan his father wrote before he could walk. What answers it is everything he went after unasked, starting with the sixteen-year chase for a club of his own." The Rabbit Hole pointer is kept, and the two depths do not restate each other. |
| **P1-09** | completed | "What moved it was recruitment: Jorge and José Mas joined the ownership group in 2017, and on 6 November 2018 about 60 percent of Miami voters approved the Melreese site." A reader cannot come away believing he delivered the stadium alone. |
| **P1-10** | completed | The "predates the sportswashing argument by seventeen years" framing is gone; the record is reported as chronology ("a UNICEF Goodwill Ambassador since 2005, seventeen years before Qatar"). Both dates and the arithmetic survive. The section ends on the Type 3 arc, not on a sentence that functions as a defence. |

Research decisions, checked rather than reopened. **RQ-01** resolved past its safe interim by demotion: the quote is attributed to Ferguson without a volume, which is what the interim required, and it no longer occupies a load-bearing slot. **RQ-02** resolved against the primary transcript, with line ranges in ledger items 2 and 4. **RQ-04** collapsed to "*Country Life*'s October 2025 issue," and ledger item 7 records that "peace" *was* corroborated against contemporaneous coverage — so quoting it rather than paraphrasing is within the interim's terms, which made paraphrase conditional on the quote being unretrievable. **RQ-03** and **RQ-05** correctly took no action; both defaulted to omission.

**P2-01** remains deferred, which the synthesis permits explicitly. P2 items are not gate-bearing.

## Protected-hit regression check

None regressed. All ten re-verified by exact-string grep against the live draft **after** the section reorder, not carried forward from the initial verification.

- **PROTECT-01** — "Whether he planned it or not, a private humiliation had become a photograph on his own terms" present verbatim, with the full Ferguson-boot-to-Alice-band sequence and the Real Madrid close intact. This was the most-protected passage in the jury and it is untouched.
- **PROTECT-02** — Both exclusions present verbatim: "an Enneagram profile should not absorb a mental-health condition into type theory" and "No clean typing explains the audience-free cleaning at 2am. It is excluded from the case for type." P0-08 changed punctuation inside the quotation only.
- **PROTECT-03** — "His reserve remains genuine counterevidence rather than something the Type 3 case gets to explain away" present, still closing the Nine paragraph, and P1-02 has not converted it into an explaining-away.
- **PROTECT-04** — The Brooklyn passage is intact, attributed, separated and unadjudicated, including "no public source can settle what happened in private" and "It does not prove David's motive or his Enneagram type." It now hands off to beekeeping, which does not adjudicate it.
- **PROTECT-05** — Both halves present, tense unchanged: "consent is the one thing no amount of finished work has ever bought him" and "A colony cannot be convinced, out-worked or won over." The prose still ends on "The man who finished everything is being taught the thing his father's method left out," so the ending lands on the cost, not on peace.
- **PROTECT-06** — Ordering unchanged: the June 2002 *Attitude* cover and its verbatim quote precede Human Rights Watch; Lycett shreds that same 2002 cover; his defence is stated, then tested. All three testing sentences verbatim, including "It does not answer the discriminatory laws or labor abuses that human-rights groups documented."
- **PROTECT-07** — "A discount on a future he had not been given yet" and "Sixteen years from clause to Messi: the same boy in the park, on a timeline he could not compress" both verbatim. P1-09's clause and the added referendum date sit in the same paragraph without touching either sentence.
- **PROTECT-08** — "These details appeared in an issue he guest-edited" survives verbatim, and the adjacent paragraph names *Country Life* explicitly, which raises the disclosure rather than duplicating it.
- **PROTECT-09** — Keane's quote and its "a man with no taste for sentiment" setup both present; only the stage direction was removed.
- **PROTECT-10** — "No public source settles what ended it" present; no cause asserted for the separation. The 3w2 wing and both arrow directions (stress to Nine, growth to Six) are unchanged.

Also confirmed against the synthesis's "Do not" list: the "gay icon" quote is absent from reader-visible text (three hits, all inside HTML working-note comments recording the deliberate exclusion); 2026 events appear only in the family section and are not promoted into the type argument; the Type 3 call was not softened; the insurance metaphor is intact.

## Remaining work

No gate-blocking work remains. Four non-blocking items.

1. **RQ-01's underlying question is still open, and the demotion cost some reader-visible attribution.** The source-audit consequence is fully discharged (1 inline, 0 vague, 0 untagged), but in becoming prose the citation went from "— Sir Alex Ferguson, in his autobiography" to a bare "and wrote that." That still satisfies RQ-01's safe interim — attributed to Ferguson, no volume asserted — and a reader is told the source is written. Minimum action when the volume is settled: restore "in *Managing My Life* (1999)" or the 2013 volume against the primary text or a Tier 1–2 outlet with a page or chapter reference. Ledger item 1 records the restore condition.
2. **Ted Beckham's "nothing to work at" is still not pinned to an episode.** The series release date is in the citation and the line and its placement in the Sandra scene are corroborated by contemporaneous coverage, but no episode number is asserted. A human with the series closes this in two minutes; ledger item 9 records it.
3. **The pass executed P2-11, which the synthesis explicitly deferred, and moved the Rabbit Hole as well.** Beekeeping went from H2 position 3 to position 6, and the Rabbit Hole moved from between the marriage and Qatar sections to after the final H2. Both moves are logged in the draft's heading-mix ledger, both bridges were rewritten, and nothing gate-bearing regressed — I verified all ten protected hits after the move rather than before. Two notes for the next pass. The reorder is defensible on its own terms and arguably improves the closer's setup, but it was taken outside the synthesis's scope, so it has not been through a jury. And the Rabbit Hole's new position is a house-convention outlier: of 173 people drafts carrying an `enneagram-rabbit-hole` block, 169 place it before the final H2 and 4 after — now Bella-Hadid, JD-Vance, Mira-Murati and this one. Worth a deliberate call at publish rather than an inherited one.
4. **P2-01 remains the highest-insight edit available and is still unfunded** at 4,490 words against the 4,500 ceiling. Until a refresh cuts first, "shame converted into output" at the end of the Qatar section keeps arriving without the setup P2-01 would give it.
