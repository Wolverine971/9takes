---
artifact: perspective-verification
schema_version: 1
subject: David-Beckham
draft_sha256: ef21a39480d947899e1e1eda8c5122aeaf406d087389c2a02b9cb45ab236ee99
final_content_sha256: a7fe2a41708fdfad8ac2c8744dfee3b95f002c624bbb7fa9902927587cfd11bb
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-12T06:06:42Z
---

## Verification verdict

The synthesis's frozen snapshot SHA matches the supplied `--draft-sha` (`ef21a39…`), and `draft-reviewed.md` hashes to `f381c73a…`, the exact `reader_visible_content_sha256` recorded in `context.json`. The live draft now hashes to `a7fe2a41…`, so the edit landed on the reviewed snapshot rather than on a divergent copy.

All eleven P0 items pass their acceptance tests against the current reader-visible text. All ten accepted P1 items are completed. All ten `PROTECT-*` items survive; the two the revision brief flagged as most at risk — PROTECT-01 (adjacent to the P0-01 deletion) and PROTECT-07 (immediately after the P0-10 rewrite) — are verbatim.

The revision's method matched the synthesis's diagnosis. The failure mode the jury named was unsourced staging, and the repairs are overwhelmingly deletions: the fabricated head-shave reveal is gone, both invented rooms are gone, the invented precision in the spending anecdote is gone. Nothing was over-corrected in the process — "worked like insurance," the Ferguson-boot-to-Alice-band sequence with its hedge, the Brooklyn passage's refusal to adjudicate, and the closer's past perfect are all intact.

I checked every new factual assertion introduced as part of a repair against a source trail and found none floating. Adidas 1996 / Brylcreem 1997 trace to the synthesist's own verification in P0-10; the results clause and 1999/2002 timeline entries trace to the packet's §Accomplishments and the fan review's UEFA/NFM sourcing; the Mas brothers to packet S-12/S-13 via FAN-C6; Sandra's nursing-home work to the packet's family section; the *Desert Island Discs* denial to new ledger item 11; the Loos response to packet S-23; the Studio 99 disclosure and Beckham's no-editorial-control reply to CRITIC-R1's C21Media/Variety research. The one claim the critic could not settle — Fisher Stevens's final cut — was correctly left out rather than stated. No targeted research was required: no P0 acceptance test turned on a fact the packet could not settle.

I ran `scripts/blog-source-audit.mjs` to confirm the RQ-01 consequence the editor self-reported. It is accurate: **2 load-bearing quotes — 1 inline, 1 vague, 0 untagged**, with both hard gates passing (nothing untagged in the epigraph or cold open, no untagged load-bearing quote). The Ferguson quote's demotion to VAGUE is a deliberate, disclosed trade, not a regression introduced by carelessness.

## P0 resolution check

| ID | Status | Acceptance-test result |
| --- | ------ | ---------------------- |
| **P0-01** | resolved | "Charity Shield," "mohawk" and "shaved" each occur once, in one telling. The staged-reveal sentence and the "he staged it with real care" clause it supported are both gone; the sentence now ends at "a second career running alongside the first." No sentence claims a reveal occurred at that fixture. |
| **P0-02** | resolved | Both stage directions stripped, both quotes verbatim. Keane is now "has described it in terms he uses for almost nothing else"; the Neville line is "Asked, decades on, how he functioned through it." No sentence describes a physical reaction, a room, or a named questioner. Citations now read "in archive shown on *Stick to Football*, October 2023," and ledger items 2 and 4 record the transcript line ranges that establish clip playback. |
| **P0-03** | resolved | A reader finishing the section can state his own account and it matches the transcript: "He credits the people around him: a manager, a team, teammates he knew had his back every time he walked out. He also calls the red card his own mistake and says he was punished for it." "He delivered" survives, reframed as the article's added observation ("So he was held up, and he answered anyway…"). The therapist quote now carries its next clause ("in the same breath he says that talking, these days, is a good thing"). The 1998 FAQ carries the same repair. No body or frontmatter sentence asserts he offered no explanation; `persona_title` softened from "Self-Made" to "Most Practised." |
| **P0-04** | resolved | Grepped the reader-visible body: zero sentences assert that a childhood event, parent, or upbringing produced the type. "That is the making of a Three" is gone, replaced by "The transaction is the thing to watch, whatever produced it… Ted did not build a Three. He set the terms a Three would spend a lifetime meeting." The TL;DR "love is earned by delivering" bullet is retained as a lesson, not an etiology. |
| **P0-05** | resolved | "The marriage was never only a marriage. It was the founding act of the brand." is gone. The commercial account is now explicitly a reading ("at least on the commercial reading nobody has ever let go of," "On that reading…"), and his denial follows in his own words. It is not resolved in either direction, which is what the item required. |
| **P0-06** | resolved | Disclosure lands at the first citation (cold open: "made by his own production company"); his response travels with the heaviest-lifting citation ("It is his own company's series; he has said he had no editorial control over it"); and the Qatar section converts the concession into the observation ("the four-part Netflix documentary his own company had made"). A reader who learns about Studio 99 afterwards finds nothing that misled them. |
| **P0-07** | resolved | "that he believed engagement through sport mattered" removed from both the body's "his case" paragraph and the Qatar FAQ. Every position now attributed to the 4 October 2023 statement is in that statement. |
| **P0-08** | resolved | The rendered blockquote is "…or everything has to be in pairs**...** Everything has to be perfect." Ledger item 5 was updated to the identical rendering, so the visible quote and the internal ledger now match. |
| **P0-09** | resolved | "and he has never once tested what happens if he lets it" is cut; the `inner-thought` block ends on "has already started slipping." The block's psychological reach survives. No unhedged sentence outside a quotation states what he has never done in private. |
| **P0-10** | resolved | Causal ordering corrected and the metaphor preserved: "It started before Argentina. Adidas signed him in 1996 and Brylcreem in 1997, when he was 22. What 1998 added was urgency." The dating clause was rewritten to "the man paying the premiums had already been hunted once," so nothing places the policy after the hunt. "worked like insurance" still appears. "Call it vanity if you like" deleted. |
| **P0-11** | resolved | "sold a story" → "went public with an allegation," plus exactly one sentence of contest: "It has never been settled, and when the series revisited the episode in 2023, Loos said publicly that it cast him as the victim and her as a liar." The section was not expanded. |

## Accepted improvements check

| ID | Status | Result |
| --- | ------ | ------ |
| **P1-01** | completed | Inverted to "Social (so), with a strong Self-Preservation (sp) second." Justification rebuilt on evidence (image management, audience-calibrated reinvention, the Alice band, the *Attitude* cover, Real Madrid) with SP retained on security-and-provision material. The counter-type note is present. No clause rests on his vocal manner or reserve, and the paragraph now reads without contradiction against "the most image-conscious footballer in England went to Real Madrid." |
| **P1-02** | completed | The Nine case is restated as a motive objection ("Ted settled what his son would be at roughly the moment of his birth… That is what merging looks like, and it would explain the calm") and answered with self-initiated arenas. PROTECT-03 closes the paragraph, so the steelman is not ended by explaining it away. |
| **P1-03** | completed | "That habit returned six league titles, a Champions League and 115 England caps, six of those years as captain." Position stated plainly ("seven years at right back with Beckham in front of him at right midfield"). "Retires at Paris Saint-Germain." A reader with no football knowledge can now answer "great" and cite something. No palmarès paragraph. |
| **P1-04** | completed | "1999, the answer" and "2002, the penalty" added at the existing one-line cadence; "1998, the effigy" cut as directed; the block re-sorted chronologically. The 1998 opponent reappears at the moment of recovery, and the treble is now nameable from the article. |
| **P1-05** | completed | "boot," "the same week" and "he told them" all removed; the paps line is attributed to footage ("Filmed being asked about a Gucci jacket"); Keane's unsourced "one condition" became his general tolerance. "The flash Cockney" kept. |
| **P1-06** | completed | "the method worked" → "the method produced what Ted wanted." Sandra gains "thinking it too strict" and "worked as a hairdresser and in nursing homes." CRITIC's protected first half ("Her objection did not change the method") is intact, and no sentence in the origin section grades Ted's methods in the article's voice. |
| **P1-07** | completed | "at 51" gone (zero hits). "now" anchored to "Since January 2026." "cannot produce this" scoped to "has not been able to produce this." "still" removed from `description`; the closer's surviving "still" is date-anchored ("In 2023 it was still walking him through his own house at 2am"). The cold open's present-tense routine sits adjacent to its 2023 source date. The Qatar FAQ opens "As of 2026." |
| **P1-08** | completed | The counter-case now has content in the body, not an address: "The serious case against is Type 9: he spent thirty years executing a plan his father wrote before he could walk. What answers it is everything he went after unasked…" The Rabbit Hole pointer is kept, and the two depths do not restate each other. |
| **P1-09** | completed | "What moved it was recruitment: Jorge and José Mas joined the ownership group in 2017, and in November 2018 about 60 percent of Miami voters approved the Melreese site." Funded by cutting "Rival owners and local politics stalled him." A reader cannot come away believing he delivered the stadium alone. |
| **P1-10** | completed | The "predates the sportswashing argument by seventeen years" framing is cut; the record is now reported as chronology ("a UNICEF Goodwill Ambassador since 2005, seventeen years before Qatar"). Both dates and the arithmetic survive, satisfying the three-way protection. The section ends on the Type 3 arc, not on a sentence that functions as a defence. |

Research decisions, checked against the revision brief's Stage 3 rather than re-opened: **RQ-01** applied at its safe interim (attribution now "in his autobiography," volume and year dropped, open question recorded in ledger item 1) — correct per the brief, and the residual research remains open by design. **RQ-02** resolved past the interim against the primary transcript, with line ranges recorded in the ledger; the Neville salary/jeans quote and Beckham's own lines are correctly left with plain live citations. **RQ-04** collapsed to "the October 2025 issue he guest-edited." **RQ-03** and **RQ-05** correctly took no action; both defaulted to omission.

**P2-01** is deferred, which the synthesis permits explicitly ("attempt only if Stage 1 left real room"). P2 items are not gate-bearing. The deferral is logged in the draft's EDITOR PASS NOTES for the next refresh.

## Protected-hit regression check

None regressed. All ten verified by exact-string grep against the live draft.

- **PROTECT-01** — Present verbatim, hedge included: "Whether he planned it or not, a private humiliation had become a photograph on his own terms." P0-01 removed only the unhedged sibling in the preceding paragraph. Confirmed word for word, as the brief required for this at-risk hit.
- **PROTECT-02** — Both exclusions present: "an Enneagram profile should not absorb a mental-health condition into type theory" and "No clean typing explains the audience-free cleaning at 2am. It is excluded from the case for type." P0-08 changed punctuation inside the quotation only.
- **PROTECT-03** — "His reserve remains genuine counterevidence rather than something the Type 3 case gets to explain away" is present and closes the rewritten Nine paragraph.
- **PROTECT-04** — The Brooklyn passage is intact, attributed, separated and unadjudicated, including "no public source can settle what happened in private" and "It does not prove David's motive or his Enneagram type." P0-05 did not weaken it to balance the marriage repair.
- **PROTECT-05** — Both halves present, tense unchanged: "consent is the one thing no amount of finished work has ever bought him" and "A colony cannot be convinced, out-worked or won over." The ending still lands on the cost.
- **PROTECT-06** — Ordering unchanged: the June 2002 *Attitude* cover and its verbatim quote precede Human Rights Watch; Lycett shreds that same cover; his defence is stated, then tested. The three testing sentences survive verbatim, including "It does not answer the discriminatory laws or labor abuses that human-rights groups documented."
- **PROTECT-07** — "a discount on a future he had not been given yet" and "Sixteen years from clause to Messi: the same boy in the park, on a timeline he could not compress" are verbatim. This was the second at-risk hit; P0-10 rewrote the preceding paragraph and P1-09 added a clause in the same paragraph without touching either sentence.
- **PROTECT-08** — "these details appeared in an issue he guest-edited" survives. The editor's recorded trade is sound: the synthesis named the whole sentence as P1-03's funding source while PROTECT-08 protects half of it, so only "His honey has a Golden Beez label" was cut — which also discharges P2-10.
- **PROTECT-09** — Keane's quote and the "a man with no taste for sentiment" setup both survive; only the stage direction was removed.
- **PROTECT-10** — "No public source settles what ended it" is present. The 3w2 wing and both arrow directions (stress to Nine, growth to Six) are unchanged.

Also confirmed against the synthesis's "Do not" list: the "gay icon" quote was **not** re-added (it appears only inside HTML working-notes recording the deliberate exclusion), no 2026 event was promoted into the argument, the Type 3 call was not softened, and the insurance metaphor was not deleted.

## Remaining work

No gate-blocking work remains. Four non-blocking items, logged so the next pass does not rediscover them:

1. **RQ-01 is still open and needs a human or a library.** The Ferguson "relentless application" line now reads "— Sir Alex Ferguson, in his autobiography," which is true under both candidate volumes but drops the piece's load-bearing opening quote from INLINE to VAGUE in `blog-source-audit` (verified: 1 inline, 1 vague, 0 untagged). Both hard gates pass, but a publish check requiring all load-bearing quotes to be INLINE will flag it by design. Minimum remaining action: the text of *Managing My Life* (1999) or *My Autobiography* (2013), or a Tier 1–2 outlet quoting it with a page or chapter reference.
2. **A small residual tension at the 1998 close.** "He did not hide and he did not explain himself" now sits one paragraph after "He does answer, later in the same conversation." The two are reconcilable — the first is about 1998, the second about a 2023 podcast — but a close reader can trip on it. Minimum action, if a later pass wants it: scope the first clause to the period ("He did not hide and he did not plead his case at the time"). Not a P0 failure; P0-03's acceptance test is satisfied as written.
3. **"So when it cracked, the whole enterprise was on the line"** still carries the joint-venture framing forward one sentence past the "On that reading" hedge. P0-05's acceptance test passes — no sentence states as fact what the marriage privately was, and the denial is present — but this is the one clause where the reading briefly speaks in the article's voice.
4. **P2-01 remains the highest-insight edit available and is unfunded.** The draft's own notes record the body at 4,487 words against a 4,500 ceiling. Until a refresh cuts first, "shame converted into output" at the end of the Qatar section keeps arriving without the setup P2-01 would give it.
