---
artifact: perspective-verification
schema_version: 1
subject: Nathan-Fielder
draft_sha256: eba28d045ee4d1b73ed58bfb80c47e99bf1225f44d9b4e786136da6120d563be
final_content_sha256: c82bf20af440842738b819f08fedf621c4a15794a5cfcf374409324e2fef2339
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-09-09T19:34:00Z
---

## Verification verdict

The supplied `--draft-sha` matches both `context.json` and the `synthesis.md` frontmatter
(`eba28d04…`). The live draft at `src/blog/people/drafts/Nathan-Fielder.md` has a reader-visible
content hash of `c82bf20a…`, distinct from the frozen `ea7ec77b…`, so the revision is real and this
verification assesses the current text rather than the editor's self-report.

All twelve P0 items pass their acceptance tests against the current text. Eighteen accepted P1 items
resolve as sixteen completed, two deferred with stated reasons (P1-10, RQ-03). All ten `PROTECT-*`
items survive — six byte-identical, four preserved in function under the synthesis's explicit
function-preservation allowance. No new factual assertion was introduced without a source trail: I
independently traced every name the revision added (Angela, Billy Evans, NBC San Diego, ABC7, TheWrap,
Alison Herman / The Ringer, the Variety correction, the TIME 737 sourcing) back to the evidence packet
or the two supervisor research files, and each lands.

I did not conduct new research. Every P0 acceptance test was settleable from the packet, the linked
house Enneagram files (which I re-grepped directly), and the current draft.

One judgment call is recorded rather than counted, in the protected-hit section below: the Dumb
Starbucks punchline that P0-06 instructed the editor not to touch is gone. It is not a numbered
`PROTECT-*` item, the deletion carries a documented source reason that post-dates the synthesis, and
the paragraph's function survives, so it does not open a P0 or add a regression. It is the one item
worth a human look before publication.

Deterministic side-checks run for this verification: reader-visible body **3,757 words** (band
3,200–3,900); **seven** H2 sections; whole-file direct-quote totals at or under 25 words for every
source (highest: GQ/Skeete at 23, TIME at 20); all four Rabbit Hole `/enneagram-corner/` links resolve
to files that contain the paraphrased mechanic.

## P0 resolution check

| ID | Status | Basis |
| --- | ------ | ----- |
| P0-01 | **resolved** | The licence beat is gone. The diagnosis now reads "Look at what he does when a stake appears. Before pitching businesses on television, he had a real business degree." No sentence anywhere places the licence before the aviation project, and it now reads without contradiction alongside "He had told the pilots he worked with about his training as it went." The table's pilot row sits under a "When" column and asserts no issuance date. |
| P0-02 | **resolved** | Prose: "He learned that a jacket he wore while filming came from a company that had paid tribute to a Holocaust denier. He founded Summit Ice in 2015 in response… The obligation came first, and he built the joke around it." Table: "An answer to a Holocaust-denier tribute \| Funded Holocaust education, and then ran through the show." Both place the discovery before the founding. No sentence claims the motive is unstated — the editor removed the Talmud Torah insinuation entirely rather than narrowing it, which satisfies the test more strongly than the minimum repair and leaves PROTECT-03 (the separate parents/causation refusal) intact. |
| P0-03 | **resolved** | Printed string is character-for-character the LA Times wording: "I really am struggling to this day to understand exactly what I experienced in this." The outlet is named in visible body text ("in the wording the Los Angeles Times reported"), and the testimony ledger carries a separate subject-quote record with reporter, date, URL and body locator. |
| P0-04 | **resolved** | "In that 2025 appearance, Rep. Steve Cohen of Tennessee also objected: Fielder's team had presented their meeting as concerning autism and air travel. Fielder answered that the season connected autism masking with pilot communication." The antecedent is explicit, the substantive reply is restored, and "autism" now appears with both an antecedent and a consequent. A reader asked why autism came up answers with the show's masking/pilot-communication argument; nothing supports the "because Fielder is autistic" reading. PROTECT-08's "None of this makes him right about aviation" survives in the same paragraph, undisturbed. |
| P0-05 | **resolved** | "His target was Angela, a participant rehearsing motherhood, whose beliefs, he argued, made her easy to score points off." Restored as narration, not extended quotation — the Variety direct quote stays at 7 words. Skeete's paragraph now opens "A different participant, Kor Skeete…", so his 8/10 no longer reads as a reply to a charge about someone else. "Angela" is sourced: `evidence-packet.md:288` records D'Addario's named primary target as "the woman cast as 'mother' (Angela)". |
| P0-06 | **resolved** | Table cell now reads "A parody defense stated in the shop's FAQ \| Defense untested; closure reported over a health permit." No cell or sentence asserts the parody defence succeeded. The closure is attributed to reporting — "TheWrap reported that the Los Angeles County Health Department closed it that day" — rather than asserted as an administrative record. See the protected-hit section for the punchline sentence, which is a separate observation and not a failure of this test. |
| P0-07 | **resolved** | "a woman he had loved half a century earlier." No year appears for the Frances relationship. |
| P0-08 | **resolved** | "Twenty years on" is deleted; the close reads "The equipment is better, the access is extraordinary, and the last move has not changed…" The unanchored span before Safdie's response is also gone. Every surviving relative span resolves: "since at least 2014," "A year later" (from a stated 2014), "in that finale, in May 2025." The one remaining unanchored span, "half a century earlier," is the repair P0-07 itself prescribed. |
| P0-09 | **resolved** | "NBC San Diego reported an October 16, 2026 theatrical release through A24; the distributor's own page still listed the date as undetermined when checked that September." Year present, past tense, attribution moved off A24 and onto a named outlet the packet carries (`evidence-packet.md:97`, S18). Read with the date set to 2027-06-01 the sentence remains true and the release year is recoverable without leaving it. |
| P0-10 | **resolved** | "In two of those three shows he performs under his own name, playing a version of himself that people cannot agree is a version." No sentence describes the *Curse* role as a version of himself; the evidence base is *Nathan for You* and *The Rehearsal*. "His first scripted fiction" is now "a scripted series," removing the first-ever claim. The narrowing did not propagate into the persona-gap reframe. |
| P0-11 | **resolved** | "On CNN's *The Situation Room* on May 29, 2025, before the Black Q&A, he argued…", against the Q&A dated "a June 2025 Q&A moderated by Jack Black" upstream. "Then" is gone and no connective implies CNN followed the Q&A. |
| P0-12 | **resolved** | "*The Rehearsal* ran two seasons on HBO, in 2022 and 2025" (closed construction, resolves the "two seasons" ambiguity against *Nathan for You*'s stated four), plus "The second season of *The Rehearsal*, in 2025, aimed the apparatus at commercial aviation, and he trained as a pilot to make it" at the head of section 4. A reader with no prior knowledge can name the aviation work, give its year, and place it after *The Curse* (2023) using only the article. |

## Accepted improvements check

**Completed (16).**

- **P1-01** — "He credits his crew with recreating details for participants' experience, including what cameras miss." Execution is no longer assigned to Fielder alone, and the Rabbit Hole's Type 1 counter still rests on "believability to a particular room," consistent with the body.
- **P1-02** — Link swapped to `/enneagram-corner/enneagram-connecting-lines`. Verified directly this session: that file carries "Credentials, productivity, or proximity to powerful people become proof that they are safe" (L186) and "nobody can dismiss me" (L188). Link count unchanged at four `/enneagram-corner/` targets, all resolving to existing files.
- **P1-03** — The film clause is gone from the growth list, which now reads "Fielder abandoning staged material for John Wilson, and building a character around what a performer actually did in the room." *You Can See Everything* is cited for exactly one connecting-line reading, and the close is uncontested.
- **P1-04** — Degree row → "Nothing stated on the record," matching the prose disclaimer instead of contradicting it. Pilot row → "To learn the work, and to be taken seriously," carrying both motives. No cell asserts an intention the prose declines to assert. Five rows and four columns preserved.
- **P1-05** — "In that finale, in May 2025, he flew a real Boeing 737 out of San Bernardino and back." Two clauses, no finale narration, **no passenger count and no statement of who was aboard**. TIME is named in the testimony ledger as the source. Source gate cleared.
- **P1-06** — "…report to federal prison for defrauding investors in Theranos, her blood-testing company." A reader with no prior knowledge can now say why Holmes was going to prison. Nothing imported from the existing 9takes Holmes article.
- **P1-07** — "In this reading, the uncomfortable possibility is that his own judgment will not count when it matters. Somebody outside him has to do the settling." Plain language, no core-fear vocabulary, and the motive is statable without the word "prepare." The close's phrasing is not pre-empted and its final sentence is unchanged.
- **P1-08** — Both halves landed: the sampling limitation is named in visible text ("promotional interviews over-report audience-facing behaviour for anybody"), and a non-self-report anchor is supplied ("Another piece of evidence is an object: Dumb Starbucks' FAQ, presenting the shop's legal position directly to strangers"). PROTECT-09's "it is a reading rather than a proof" was not deleted to make room.
- **P1-09** — TL;DR narrowed to "**Some of** the pushback comes from a critic, a congressman, the FAA and one of his own participants." The "criticism cannot reach on its own" framing is gone. Cohen's editing complaint now appears in the ethics section: "most of the substantive part of the interview he gave, he said, never made the show."
- **P1-11** — "The filmmaker Benny Safdie" at first mention; "Fielder is a comedian known for building things that should not be worth building" in the intro, after the Westwood anecdote closes. Occupation is legible in the first quarter.
- **P1-12** — "Sixes borrow the Three's playbook" deleted; "Under pressure the move is specific: credentials and proximity to competence start functioning as proof of safety" carries it. No term used outside the Rabbit Hole now depends on the Rabbit Hole for its definition.
- **P1-14** — "His own account also resists the planner label. In the Nolan Q&A, he described stumbling into projects he had not really wanted to do… neither can this profile turn every hesitation into proof of the same motive." Paraphrase only, as required by the caption-source bar. The falsifier (PROTECT-10) sits beside it, not replaced.
- **P1-15** — "the plans frequently worked" is gone; the career description now carries no base rate.
- **P1-16** — "said Fielder, an executive producer on the series, spotted when authentic footage risked looking staged…" The reader can now say what he had the power to give away. The ledger records the HBO-page-versus-trade-reporting distinction honestly rather than overclaiming a first-party credit.
- **P1-17** — "and it is not a close call" is deleted; "6w5 is plausible, with the same uncertainty as the core reading," plus the 6w7 discriminator ("a 6w7 discharges discomfort outward through motion and company, and Fielder's humour is built to sit inside it"). No wing claim now carries higher certainty than the core claim, and "Public material does not support a confident full stacking" is retained.
- **P1-18** — Verified by recount, not by report. The stale `FRESH EYES REVIEW` and `SECOND PASS NOTES` blocks are gone; "You've ruined the whole thing for me" and "I felt insecure" return **zero** matches file-wide. Whole-file direct-quote totals counting every occurrence including the ledger: GQ/Skeete 23, TIME 20, Variety 18, CNN/Goglia 18, LA Times 15, Bullseye/Wilson 12, GQ 2014 12, GQ 2015 7. Every source at or under 25.

**Deferred with reason (2).** Both defensible; neither fails the gate.

- **P1-10** — deferred. The passage now says "The second row became a *Nathan for You* episode," which supplies the newcomer context the item was mostly about, but omits the in-show client premise (the rebrand pitched to a struggling coffee-shop owner), so the acceptance test is only half met. The editor's stated reason — declining to assert episode detail not carried in the packet rather than inventing it — is the correct instinct. Restorable in one clause if a source is added.
- **RQ-03** — deferred. Rather than quote Vulture (inaccessible, and constrained by the derived-word cap), the editor removed the unsupported assertion of Fielder's private benevolent purpose, so the fairness repair no longer depends on an unavailable source. The empathy paragraph now hedges ("rehearsal **may be** an offer of a method he finds reassuring… without establishing his private purpose"). Sound tradeoff.

**Also confirmed:** P2-01 was taken ("the evidence is easy to point at" is deleted, removing the contradiction with "it is a reading rather than a proof"). RQ-01, RQ-02 and RQ-04 all shipped — Winter and Herman on the parenting experiment with the minor unnamed, Brody's fake-gas-inspection objection, and the A24 "2026 (TBD)" re-check reflected in the release sentence.

## Protected-hit regression check

**No regressions. Six byte-identical, four preserved in function.**

Byte-identical, confirmed by exact-string grep:

- **PROTECT-03** — "It is not a mechanism, and a profile that pretends otherwise is inventing a childhood wound because the shape of the story wants one."
- **PROTECT-07** — "Whether that is accountability or the most elegant available way of avoiding it is the question the show declines to settle."
- **PROTECT-08** — Goglia's qualification and "None of this makes him right about aviation," both intact despite P0-04 and P0-11 editing the same paragraph.
- **PROTECT-09** — All three hedges present and unaltered: "it is a reading rather than a proof," "He did not rank the two motives, and neither should anyone else," "Public material does not support a confident full stacking."
- **PROTECT-04** — The Westwood opening survives with the errand, the ATM and the walk back restored, and the anecdote is still undated (only the 2024 Q&A is dated), which is what makes it permanent. The close's final sentence — "find somebody who was there, hand them something, and ask them to say it out loud. Only now he is asking a whole theatre, and a theatre is under no obligation to answer" — is unchanged; P0-08 removed only "Twenty years on."
- **PROTECT-06** — The acquisitions ledger survives as a table with five rows and four columns, in dated past tense. P0-06 and P1-04 were cell-level only.

Preserved in function, assessed under the synthesis's stated allowance that "equivalent tighter wording may pass":

- **PROTECT-01 (persona-gap reframe).** Rewritten by the supervising editor, who explicitly asked this verifier to judge rather than presume a pass. The three load-bearing moves all survive: the binary is rejected ("his social difficulty and his preparation are not stacked layers you can peel apart," preceded by "The standard framing makes the awkward man the mask and the competent one the face, or the reverse"); the causal claim is verbatim ("The gap between his preparation and everyone else's is itself the awkwardness"); and the loop closes ("Preparation helps produce the encounter, and then the camera finds it"). Lost: "will be strange in that room. Not because he is performing strangeness." The reframe is thinner and now explicitly framed as the article's reading — which is what the source-grounding repair required — but the insight, not just its subject matter, is intact. **Pass.** Note that the P0-10 row of the resolution log claims this passage was "verified byte-identical," which the later supervisory rewrite superseded; the log row is stale, the text is fine.
- **PROTECT-02 (empathy turn + qualifier).** Also rewritten. The structural requirement — never keep the empathy without the qualifier — holds: "That possibility makes the impulse understandable without establishing his private purpose or clearing the production's methods. A participant still has to live with the encounter and the edit. Generosity and control can occupy the same room." Motive-without-exoneration is intact. Lost: "It is the thing he built to get through a room, and he hands it out because it is what he has," and the named-participant qualifier invoking Skeete and D'Addario, both now generic. The hedge is the price of not asserting private intent, which the same review demanded elsewhere. **Pass**, with the observation that this is the most rhetorical force surrendered anywhere in the revision.
- **PROTECT-05 (Skeete's interrupted sentence).** "I'm still conflicted about certain things, about the episode, the idea" is still printed unfinished and still described as unfinished: "Fielder interrupts with a question there. The unfinished sentence belongs beside the praise." Tighter than "That sentence breaks off there in the original, cut across by Fielder's next question, and it should be allowed to," and the refusal to resolve his ambivalence is unchanged. **Pass.**
- **PROTECT-10 (the falsifier).** Present and rewritten, not removed: "sustained evidence that he prepares equally hard for things nobody will ever see or grade, with no audience to be credible to, would push this toward 5 or 1." The standing bars hold — grep returns no divorce, no net worth, no partner of Fielder named or implied, no clinical diagnosis, no named minor. (Billy Evans is Holmes's partner, not Fielder's; he was in the frozen draft and is carried by packet S17.) **Pass.**

**One at-risk passage lost, recorded and not counted.** P0-06's "At risk" field named "He was taken out by the one credential he had not thought to acquire" as protected by four perspectives and instructed the editor not to touch it. It is deleted; grep returns zero matches. It is not a numbered `PROTECT-*` item, so it does not enter the regression count, and the deletion is not careless: `Nathan-Fielder-editor-countercheck.md:61` records that the sentence "invents a forgotten health permit," and the ABC7 and TheWrap accounts of the Kimmel appearance show Fielder publicly arguing an art gallery needed no permit — which defeats certainty that the permit never occurred to him. The paragraph's function survives in flatter form: "The carefully printed defense and the closure can coexist. Preparation did not settle the argument." A source-grounded correction, correctly reasoned, that costs the section its best sentence. See Remaining work.

## Remaining work

Nothing blocks the gate. Four items for a human, in priority order.

1. **Restore the Dumb Starbucks punchline in a form the record supports.** The current ending — "Preparation did not settle the argument" — is true and dull, and the section lost the irony four perspectives named. The problem with the original was only the assertion that he *forgot*. A version that states the outcome without the mental state keeps the payoff: the trademark defence he had prepared for was never tested, and the thing that closed him was a health permit. One sentence, no new claim.

2. **P1-10, one clause.** "The second row became a *Nathan for You* episode" is accurate but stops short of the in-show premise — the rebrand pitched to a struggling coffee-shop owner — which is what makes the ledger row's intent column honest about whose purpose it describes. Add it if the episode framing can be sourced; leave it deferred if not. Do not infer it.

3. **Cohen's title on second mention.** The first mention is date-bound ("In that 2025 appearance, Rep. Steve Cohen of Tennessee"), which satisfies P1-13. The second, in the ethics section, is bare: "Rep. Cohen's complaint about the aviation season." With US midterms on November 3, 2026 — inside the article's first two months — a possessive without a date anchor is the one durability hole left. Two words fixes it.

4. **RQ-04 re-check before publication, as the editor flagged.** The release sentence currently attributes October 16, 2026 to NBC San Diego and notes A24's page read "undetermined" that September. If A24 confirms before publication the sentence can tighten; if the date moves, the sentence must move with it.

Two smaller notes, neither actionable as a defect. The close's "This project leaves the question open" is present tense and sits outside the anchoring clause "In that room, in September 2026," which the editor placed at the head of the preceding paragraph rather than the final one — correct, since P1-13 forbade touching the final sentence, but it leaves one present-tense clause unanchored. And the P0-10 resolution-log row's byte-identical claim for PROTECT-01 is stale relative to the supervisory rewrite; the text passes on function, the log line does not describe it.
