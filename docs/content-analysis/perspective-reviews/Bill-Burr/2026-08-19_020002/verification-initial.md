---
artifact: perspective-verification
schema_version: 1
subject: Bill-Burr
draft_sha256: c279d288f1395a0b96ec6c208186b19926202e563247907ae81fbfd50b37a55c
final_content_sha256: ecc3eafba9b69b3ed93856f6be26a3d0da392378fdf9cf1ef8e5544b3aaf0311
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-19T08:03:48Z
---

## Verification verdict

The frozen snapshot is confirmed. `synthesis.md` and `editor-resolution.md` both carry
`draft_sha256: c279d288f1395a0b96ec6c208186b19926202e563247907ae81fbfd50b37a55c`, matching the
supplied SHA, and `hashReaderVisiblePerspectiveBody(draft-reviewed.md)` reproduces
`ebc99004…86ce36`, the `reader_visible_content_sha256` recorded in `context.json`. The live draft at
`src/blog/people/drafts/Bill-Burr.md` now hashes to `ecc3eafb…f0311`, so the reader-visible body has
in fact changed.

**All eleven P0 items are resolved. All ten protected hits survive. The gate passes.**

Two things are worth stating plainly, because they cut against the usual pattern in this stage.

First, **the repairs were verified independently, not accepted on the editor's word.** The one
finding whose acceptance test genuinely turned on a fact the packet could not settle — P0-05's
`"was a normal guy"` — was re-researched this session against the NPR full broadcast transcript. The
editor's inversion is correct, and I am recording the retrieved string here so no future pass has to
re-litigate it:

> GROSS: Your father, apparently, you know, from what I've heard you say, had real rage problems -
> real anger problems. BURR: **And I'll tell you this - he was a normal guy. He was normal, like all
> the dad - the dads when I - in my neighborhood when I grew up, the dads were frigging terrifying.
> Terrifying. They were just, you know, buzz-cut lunatics.** This is when I was really young, early
> '70s. Just was - it was a different time. So I don't want to just single out my dad, right? He's
> just the dude I had to deal with…
> — npr.org/transcripts/nx-s1-5311616, fetched 2026-08-19

Nothing was fabricated; `frigging` is the broadcast wording and the packet's `freaking` came from the
shorter GPB syndication (S-06). The draft's revised ordering — normal-guy frame first, terrifying
second — now matches the source. The editor's note telling future passes not to "correct"
frigging → freaking is right and should be honoured.

Second, **the one P0 whose acceptance test extended past its own headline defect was re-checked too.**
P0-05 requires that *every* quoted string in §3 match a retrievable source verbatim, which pulls in
the Frank Murphy blockquote that the packet (CLM-25) had rated "first three sentences unconfirmed."
The editor's RQ-05 trim verifies: the four retained sentences are corroborated verbatim, punctuation
included, as `"That's because Bill's a little pussy! Christ, he falls apart if you just look at him,
alright! He's got no spine! You gotta rub his back during war movies!"` The draft opens the quotation
at "Bill's" rather than "That's because," and the previously uncorroborated "scared of everything /
Susan" payoff now runs outside quotation marks as the article's own characterization. §3 is clean.

Deterministic gates re-run this session: `bash scripts/blog-lint.sh src/blog/people/drafts/Bill-Burr.md`
returns **0 fail, 1 warn** (body 4,489 words against the 4,500 ceiling — under, with the expected
thin-headroom warning). Corpus figures were re-derived from `src/lib/data/corpus-stats.json`
(`generated_at: 2026-08-19T04:46:01.807Z`): comedy n=32, Type 7 = 14 → 43.75%, corpus Type 7 share
0.1429, delta **+29.46pp**, and that delta is in fact the largest of all domain×type gaps (next:
authors-thinkers Type 5 at +26.45pp). Every number printed on the page checks out inside its as-of
stamp.

## P0 resolution check

| ID | Status | Verification |
| --- | --- | --- |
| **P0-01** | **resolved** | `grep "crisis counselor"` returns three hits, all qualified: FAQ 6 ("Per the trailer, Burr plays a crisis counselor"), body L397 ("Per the trailer, Bill Burr plays a crisis counselor"), and one editorial ledger comment (not reader-visible). Zero unqualified occurrences. The invented staging is gone; the closer now reads "Sorkin put the angriest man in comedy in the room where somebody is about to be judged, and handed him the line about how it is going to land." Every action described is Sorkin's, and the one thing attributed to Charlie is speech traceable to the released trailer line about congressional testimony. Survives either RQ-01 outcome. Driveway callback and "that is the job" intact. |
| **P0-02** | **resolved** | §5's Aug 10 2026 cell now opens `He files it as "one of my top three gigs of all fucking time." Inside that: **"I had like fucking dry mouth…"**`. The audience column changed from "Him, a microphone, no audience in the room" to "Unprompted, no interviewer, ten months later" — the no-audience assertion is gone. The paragraph's "with nobody to perform invulnerability for" / "It is the version he gives when nobody is grading him" are replaced by the register claim "With nobody asking and nothing left to defend," which is the synthesis's own prescribed wording. The counterevidence is argued *through*: "He files Riyadh as a career-best night and counts the people standing up in the same breath, and holding both at once is what the type looks like from the inside." Table form intact (PROTECT-03). |
| **P0-03** | **resolved** | The THR quotation is now followed immediately by `Then he dated it: "I was onstage with the mindset of a 6-year-old from 23 to about 37."` and answered in one clause: "Everything below is the case that the wiring outlasted the phase." The bound arrives with its own quote rather than deferred. PROTECT-02 not softened by association. |
| **P0-04** | **resolved** | All four checked against the packet. (1) Driveway: `"…She just made me a sandwich and that was it. But it wasn't a big deal back then."` restored, plus "He tells it as nothing. He also keeps telling it." — names the gap instead of retreating from it. (2) Wall, the non-negotiable one: `Then, unprompted, the correction: "He never did it. It's just an empty threat."` present inline. (3) Helicopter: the previously **unmarked** cut after "L.A. basin." now reads `Living in the L.A. basin. … This place became really claustrophobic`, and the Inquirer 2015 sincere corroboration is added and cited. (4) Psilocybin: "Then the anger came back tenfold, **for about three weeks**." No remaining quotation ends immediately before a de-escalating clause without a mark. |
| **P0-05** | **resolved (finding inverted, independently confirmed)** | See the verdict above. Both disputed strings verify verbatim in the NPR full broadcast transcript, now added to `citations`. Source order corrected. Frank Murphy blockquote independently corroborated after the RQ-05 trim. Every quoted string in §3 traces to a retrievable source: "I love my dad, man…" → S-02 (packet L171), "I'll put you through that wall" + empty-threat qualifier → CLM-22, "Every way that you can be abused" / "he dialed down what was done to him" → CLM-22, appeasement and 12-years quotes → CLM-30/S-03. |
| **P0-06** | **resolved** | `grep "Six seasons"` → zero hits. Body reads "Five seasons on Netflix." Both credit instances read "which he co-created" (intro L162, §3 L242). PROTECT-06 untouched one sentence away. |
| **P0-07** | **resolved** | The negative half is deleted. §4 now closes "He swings hardest when the room turns on people he has decided are his." §5's "and, underneath that, himself" no longer contradicts it, and PROTECT-07's self-grading is no longer quietly overridden. |
| **P0-08** | **resolved** | (1) "Half the internet called it misogyny" → "The reaction split. Deadline filed it under 'raises eyebrows'; plenty of people called it misogyny." — a real outlet is named. (2) "identify who is actually dangerous" → "name who he thinks the real threat is" — the evaluative claim is Burr's, not the article's. (3) "the only variable that changed was whether the room agreed" → "A demographic inside a civil-rights movement is not a class of billionaires. The reflex is the same anyway." — the disanalogy is conceded and the behavioural pattern survives. Bonus: "Gucci-booted" → "Gucci booted", matching the source (CLM-27). The 2020↔2025 pairing is intact. |
| **P0-09** | **resolved** | `grep "ISTP\|ESTP\|Myers\|SunSigns\|personalitylist"` over the whole file → **zero hits**. §1 now reads "The databases that own his search results agree with us wherever they say anything about the Enneagram at all: Boo and So Syncd both file him 6w7. Neither argues from evidence." Both named sources are in the packet ledger (S-39, S-40). The same defect in FAQ 1 was fixed too, which matters because that answer is reader-visible via FAQPage JSON-LD. "None of them argues from evidence" is now the conclusion, not the aside. |
| **P0-10** | **resolved** | All five Ferriss references in prose now carry **2017** (L158, L192, L202, L220, L232; plus undated "he told Ferriss" back-references). "sixteen years" → "**eleven years**", derivable from 2006 and 2017, both printed on the page. PROTECT-02's eight-year span (2017 → 2022 → 2025) is unaffected and still correct; "He has said it three times over eight years" checks out. "Nineteen years in" (1992→2011) also checks. |
| **P0-11** | **resolved** | The Type 6 baseline sentence — the null result, and the one publication falsifies — is cut entirely (`grep "10.7\|9.4%\|420"` → zero hits in the body). The survivor is stamped: "Of the 32 comedians we had profiled **as of August 2026**, Type 7 takes 43.8% against 14.3% across the whole corpus, the widest gap in any category we track." Every corpus-derived figure and the superlative sit inside that as-of scope, and the inference is scoped to profiled comedians. The Rabbit Hole's second unstamped figure is gone ("Fourteen of the 32 comedians profiled here are Sevens" → "the comedians profiled here bear that out"). Figures re-verified against `corpus-stats.json` this session. |

## Accepted improvements check

| ID | Status | Verification |
| --- | --- | --- |
| P1-01 | **completed** | "Bill Burr is an Enneagram Type 6, **counterphobic: the kind that runs at what scares it instead of hiding**." Glossed at first use. The by-domain split is executed in the **open body**, not the Rabbit Hole, so the acceptance test is satisfiable without opening the collapsed block: §6 opens "Philadelphia and Riyadh are the counterphobic half… This is the other half: the same fear with nothing to charge at." |
| P1-02 | **completed** | `<a href="/enneagram-corner/enneagram-type-6">Enneagram Type 6</a>` on first use — the first Enneagram link in the open body (frozen draft had all three behind the accordion). "self-preservation dominant, with a 7 wing" moved out of the lead into the Rabbit Hole. Lint confirms the answer block still extracts at 58 words and internal link count is 6. |
| P1-03 | **completed** | Read as 2027-08-19: "turned 58 in 2026"; "More than a thousand episodes deep"; "since 2007"; "the machinery still runs"; "Nineteen years in"; heading → "The part Bill Burr plays in October **2026**" with the FAQ anchor `the-part-bill-burr-plays-in-october-2026` updated to match, so the deep link does not break; "as of August 2026" on the tour. No sentence states his age wrongly or computes a duration against the publication year. |
| P1-04 | **completed** | "ninety minutes" → "an hour"; "almost every week since May 2007" → "twice a week now, every week since May 2007". |
| P1-05 | **completed** | "The comedian Dom Irrera was one of them; **so was Patrice O'Neal**." in §4, and "the benefit he co-produces each year for Patrice O'Neal's family" once in the Rabbit Hole. Two clauses inside existing sentences, not expanded into a section, as instructed. Lineup fact backed by packet S-12. |
| P1-06 | **completed** | Pull-quote reads "The most feared act of aggression in his career **started as** a rescue." Motive, not outcome; now consistent with PROTECT-07. |
| P1-07 | **completed** | "a Philadelphia crowd on the Jersey side"; "The comedian Dom Irrera"; "The comedian David Cross". A reader without US-Northeast geography can now state whose city was attacked. |
| P1-08 | **deferred, with reason — accepted** | Not completed, and correctly so. The Wayback CDX API returns an empty set for both YouTube IDs (`8NYGbY4Tmkc`, `yHKqkVqa9mc`), so this could not be satisfied by adding an existing URL; creating one requires POSTing to a third-party archiving service, which is an outward-facing action outside the editor command's remit. The editor disclosed this in the resolution log, in the draft's editor note, and in the hand-back rather than silently marking it done. That is the right call and it does not fail the gate — but it does leave the page's two best exhibits resting on a channel the subject controls. Carried to Remaining work. |
| P1-09 | **completed** | "She is the subject of more of his stand-up than anyone alive" → "She has been a subject of his act for a decade, including how strangers react to their interracial marriage." Unmeasurable superlative gone; the marriage context now pre-loads §8, which needs it more after P0-08. Lint confirms 0 comparative contrast patterns. |
| P1-10 | **completed** | "and he does not know he has it" is deleted. The craft reading is conceded first: "The precision is the joke. The joke needed a gauge to already be sitting there, running, readable to a half-point." PROTECT-05's beat is intact and untrimmed. |
| P1-11 | **completed** | "On October 10, 2020, five months into the George Floyd protests, hosting _Saturday Night Live_, he **argued in the monologue that white women had attached themselves to a Black civil-rights moment**." The referent precedes the quotation, described without endorsement. |
| P2-01 | completed (authorised) | §6 retitled "What Bill Burr's fear builds when there is nothing to fight." Heading ledger updated. |
| P2-05 | completed (opportunistic, word-neutral) | TL;DR bullet 1 now points at the strategy rather than the injury. |

**Research items.** RQ-02, RQ-03, RQ-05 and RQ-06 were resolved and each *strengthened* the draft:
RQ-03 restored a genuine safety clause to the third telling ("…where's the place I have the least
chance of being hurt?"), so all three legs of PROTECT-02 now carry their own weight; RQ-06 restored
the silently elided "A boat? More sneakers?" to the Cross quotation, making PROTECT-01's anchor
*more* verbatim than it was when frozen. RQ-01 and RQ-04 remain open and are non-blocking by the
synthesis's own decision rule; both are disclosed in the draft's editor note.

**New assertions introduced by repairs.** All traced to a source trail: the Inquirer 2015 helicopter
line, the NPR broadcast transcript, and the *Drop Dead Years* transcript were each added to
`citations`; the Patrice O'Neal lineup and benefit facts were vouched by the synthesis itself
(packet S-12; Boston Globe 2021). No repair introduced an untraceable factual claim.

## Protected-hit regression check

All ten verified by literal-string grep against the live draft. **Zero regressions.**

| Check | Result |
| --- | --- |
| PROTECT-01 | **Intact.** Both Cross sentences present verbatim. The RQ-06 restoration makes the quotation they anchor closer to verbatim than in the frozen draft. |
| PROTECT-02 | **Intact.** "Three tellings. One motive. Safety." present; three tellings, three formats; span derivable from printed dates (2017 → 2022 → 2025 = eight years) and correct under the P0-10 dating fix. RQ-03 hardened the third leg. |
| PROTECT-03 | **Intact.** The two-date table still exists as a table — `<div class="scroll-table">`, both rows, all four columns. P0-02 was executed by adding to a cell and rewriting the paragraph beneath. |
| PROTECT-04 | **Intact.** "The counterattack arrives before the verdict does." verbatim. (The *following* sentence, "A man who is genuinely unbothered lets criticism land and ignores it," was cut as a contrast-pair construction — that sentence is not protected, and lint confirms 0 strong contrast pairs.) |
| PROTECT-05 | **Intact.** "Nobody asked. There was no scale in play." verbatim, plus the full Rousey quotation. P1-10 worked around the beat, not through it. |
| PROTECT-06 | **Intact.** "The son's name is Bill." verbatim, now sitting on a five-season, co-created credit. It precedes the blockquote, so the RQ-05 trim did not reach it. |
| PROTECT-07 | **Intact.** The full sentence is present verbatim: `"I wasn't a professional," he said on the same show. "What I should have done was I should have kept my head in the game to survive it. So, I came out and threw gas on a fire that was already going."` (The synthesis's shorthand "I threw gas on a fire" is an abbreviation of this, not the draft string.) No longer contradicted, per P0-07 and P1-06. |
| PROTECT-08 | **Intact.** Both "What would change our mind" and "What Type 6 does not fully explain" present and unedited. RQ-04 did not resolve strongly enough to justify touching the falsification clause, which is the correct restraint. |
| PROTECT-09 | **Intact.** "He did not describe wanting the room. He described wanting the room to stand down." verbatim. |
| PROTECT-10 | **Intact.** "He does not present it as an accusation. He presents it as inheritance." verbatim, verified specifically after the P0-04 wall repair that lands in the preceding sentence. |

No protected hit was traded to pay for a lower-priority improvement or for the word ceiling. The
funding came from the synthesis's named cuts (P0-11's null result, P0-09's database sentence, P0-07's
negative half) plus the TL;DR helicopter bullet and Rabbit Hole trims.

## Remaining work

None of the following is a P0 and none blocks the gate. Listed in the order I would take them.

1. **P1-08 — archive the two YouTube citations (needs DJ).** The Riyadh dry-mouth exhibit and the
   Rousey half-point catch — the page's two best pieces of evidence — resolve only to a channel the
   subject controls, and no Wayback snapshot exists for either. Two requests close it:
   `curl -sI "https://web.archive.org/save/https://www.youtube.com/watch?v=8NYGbY4Tmkc"` and the same
   for `yHKqkVqa9mc`, then add the snapshot URLs to `citations`. This is outward-facing, so it stays
   DJ's call.
2. **Post-publish: regenerate `src/lib/data/corpus-stats.json` and re-read §1.** Publishing Burr makes
   the comedy set 33 with 4 Sixes. The stamped figures age correctly, but the Type 7 superlative's
   lead over authors-thinkers Type 5 narrows from 3.01pp to roughly 1.7pp, and "the widest gap in any
   category we track" should be re-checked at the next refresh rather than assumed.
3. **RQ-01 — Charlie's occupation, checkpoint 2026-10-16.** The closer is written to survive either
   the mental-health-counsellor or the crisis-comms-handler reading, so this is a refresh item, not a
   pre-publish one.
4. **RQ-04 — is fear-narration a standing MMP register?** Only partially answered. The same episode
   narrates fear about a gig in India, which supports the register framing §5 now uses, but settling
   it needs a grep across an MMP transcript corpus that does not exist locally. If it turns out to be
   routine, the honest move is to say so in the Rabbit Hole and let PROTECT-08's falsification clause
   fire in public.
5. **RQ-05 residue.** The trimmed blockquote is now fully corroborated, so nothing is broken. But
   "He's scared of everything. Gee, I wonder where he got that from, Susan?" was *dropped rather than
   disproved*; Netflix closed captions for S1 "Bill Murphy's Day Off" would settle whether it can come
   back. Note the editor's resolution log overstates slightly here — it reports the four retained
   sentences as corroborated at the time of the pass, which I confirmed independently, but the packet
   had rated three of them unconfirmed and the corroboration is a Tier 4 wiki plus search snippets,
   not a transcript.
6. **Precision note, low severity.** P1-11 introduced "five months into the George Floyd protests."
   May 26 → October 10, 2020 is about four and a half months. The claim has a source trail and the
   rounding is defensible, but "five months" is the loosest arithmetic remaining on the page, on a page
   whose method is that its arithmetic survives checking. One word ("nearly five months," or drop the
   interval) closes it.
7. **Word headroom.** Body is 4,489 of 4,500. `blog-lint.sh` returns 0 fail with the expected
   thin-headroom warning. Any future addition needs a matching cut, and the ten protected hits are
   not where to find it.

---

**Output:** `docs/content-analysis/perspective-reviews/Bill-Burr/2026-08-19_020002/verification-initial.md`
**Status:** `pass` · **open_p0:** 0 · **protected_hit_regressions:** 0
