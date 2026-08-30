---
artifact: perspective-verification
schema_version: 1
subject: David-Beckham
draft_sha256: ef21a39480d947899e1e1eda8c5122aeaf406d087389c2a02b9cb45ab236ee99
final_content_sha256: f77ecb3aa0d37252e6b38756803d96eda8d7c2a9bf08d5d10a2500cf70276d03
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-12T17:45:44Z
path: docs/content-analysis/perspective-reviews/David-Beckham/2026-08-12_005307/verification-evidence-final.md
---

## Verification verdict

The chain verifies. `synthesis.md` carries `draft_sha256: ef21a39…`, matching the supplied `--draft-sha`, and `shasum -a 256 draft-reviewed.md` returns the same value, so the frozen snapshot is the file the jury read. `draft-reviewed.md` hashes to `f381c73a…` under `hashReaderVisiblePerspectiveBody`, matching `reader_visible_content_sha256` in `context.json`. The live draft at `src/blog/people/drafts/David-Beckham.md` now hashes to `f77ecb3a…`, which differs from both the snapshot and from the two earlier verification runs (`7268f963…` at 06:31Z, `535a9a97…` at 17:34Z), so this is a fresh content state and none of the earlier judgments carry forward.

All eleven P0 items pass their acceptance tests against the current reader-visible text. All ten `PROTECT-*` items survive, including the three that failed the 17:34Z run — the 2002 Argentina penalty timeline entry, PROTECT-07's "a discount on a future he had not been given yet," and both sentences of PROTECT-10's separation restraint are present again. All ten accepted P1 items are completed or completed-with-residual; none is unresolved and none was silently dropped. The reader-visible body fell from 4,467 to 3,877 words, a 13 percent compression, and the compression is where the residual risk sits: several repairs survive in tighter wording than the synthesis specified, and three repairs added dated attributions that go beyond what the evidence packet records. Those are itemised in Remaining work. Under the gate's own terms — `open_p0: 0`, `protected_hit_regressions: 0` — this passes.

The revision also executed one thing the synthesis explicitly deferred: P2-11, the beekeeping reorder. The section moved from position 3 to position 6 and the Rabbit Hole moved to after the final H2 (recorded in the heading-mix ledger). Neither move damages a protected hit — PROTECT-05's closer now sits two sections from the material it pays off rather than five — so it is logged rather than flagged.

## P0 resolution check

**P0-01 — 2000 Charity Shield told twice: resolved.** The line-264 telling is gone; `grep` for "reveal was the whole point" and "shaved his head in 2000" returns zero. The event appears exactly once, in the corrected form: _"he hid a mohawk under a beanie before the 2000 Charity Shield until Ferguson saw it in the changing room and ordered him to shave. Beckham found clippers at Wembley and did it before walking onto the pitch: 'Manager always rules.'"_ No sentence claims a reveal occurred at that fixture. Acceptance test met. (One date attached to this repair is contested — see Remaining work item 1.)

**P0-02 — staged scenes: resolved.** Both stage directions are gone and every quote survives. Keane: _"Roy Keane, a man with no taste for sentiment, has described it in terms he uses for almost nothing else."_ Neville: _"Asked, decades on, how he functioned through it…"_ No sentence describes a physical reaction, a room, or a named questioner. Both quotations are now cited as _"in archive shown on Stick to Football, October 2023,"_ which claims only the venue where the footage was shown, and the testimony ledger (items 2 and 4) records the transcript line ranges that settled RQ-02.

**P0-03 — Beckham's own explanation restored: resolved.** _"Later in the same conversation he credits a manager, a team and teammates who had his back. He also calls the red card his own mistake."_ The therapist blockquote is now followed by _"He does not leave it there: in the same breath he says that talking, these days, is a good thing."_ "He delivered" survives as the article's added observation rather than a vacuum-filler: _"So he was held up, and he answered anyway in the only language that had ever bought him safety."_ FAQ 2 carries the same correction. `persona_title` moved from `Football's Self-Made Idol` to `Football's Most Practised Idol`, satisfying the frontmatter half. No body or frontmatter sentence asserts he offered no explanation.

**P0-04 — type causation: resolved.** _"Ted did not build a Three; he set the terms a Three would spend a lifetime meeting."_ The sentence now denies the causal claim outright. `grep` for "the making of a Three" returns zero. The protected TL;DR bullet survives as a lesson (_"He learned that love is earned by delivering"_), not a type origin. Zero hits for any sentence asserting a childhood event or parent produced the type.

**P0-05 — marriage-as-brand: resolved.** _"Matching purple outfits, two thrones and an OK! exclusive made the wedding look like a merger. On that commercial reading, Posh and Becks were a joint venture. Beckham rejects it."_ followed by the dated _Desert Island Discs_ denial. "The founding act of the brand" and "the most valuable thing either of them would ever build" are both gone. The reading is marked as a reading and left unresolved. The Brooklyn passage was not weakened to balance it.

**P0-06 — Studio 99 disclosure: resolved.** First citation, in the lede: _"In the 2023 Netflix series Beckham, made by his own production company…"_ His response travels with the 1998 section: _"It is his own company's series; he has said he had no editorial control over it."_ The Qatar section reinforces it (_"the four-part Netflix documentary his own company had made"_). PROTECT-08's _Country Life_ disclosure survives as the model rather than being deleted for consistency.

**P0-07 — Qatar attribution: resolved.** _"He told Sky Sports that he had spoken with members of the LGBTQ community who felt safe at the tournament, and that he was proud to have taken part."_ The unsupported middle element is gone from both the body and FAQ 4. `grep` for "engagement through sport" returns zero across the whole file. Every position attributed to the 4 October 2023 statement is present in S-17.

**P0-08 — OCD ellipsis: resolved.** The rendered blockquote now reads _"…everything has to be in pairs... Everything has to be perfect."_ Testimony ledger item 5 records the match explicitly. Rendered quote and internal ledger agree.

**P0-09 — unfalsifiable lifetime negative: resolved.** The clause "and he has never once tested what happens if he lets it" is gone; the `inner-thought` block now ends on _"something he cannot name has already started slipping."_ The block's psychological reach survives as marked interpretation, which is the scope the synthesis specified.

**P0-10 — insurance causation: resolved.** _"The endless deals and walking-billboard fame began before Argentina: Adidas signed him in 1996 and Brylcreem in 1997. What 1998 added was urgency… It worked like insurance for a man who had already been hunted once."_ No sentence claims the multi-arena career began as a response to 1998; the 1997 Brylcreem date falsifies nothing in the passage; "worked like insurance" still appears. "Call it vanity if you like" is gone.

**P0-11 — Loos sourcing: resolved.** _"In 2004 former assistant Rebecca Loos alleged an affair; Beckham called the claims 'ludicrous.' It remains unsettled. When the series revisited it in 2023, Loos told CNN that it cast him as the victim and her as a liar."_ "Sold a story" is gone, the allegation is marked contested from both directions, and it stayed at one sentence rather than expanding into a section.

## Accepted improvements check

**P1-01 — subtype: completed.** Heading now reads _"Social (so), with a strong Self-Preservation (sp) second."_ The justification rests on the Alice band, the _Attitude_ cover and Madrid; security and provision carry the SP second; the counter-type problem is disclosed (_"self-preservation Three is often described as hiding accomplishments"_). No clause rests on his vocal manner or reserve. Readable immediately after the Madrid sentence without contradiction.

**P1-02 — Nine steelman: completed.** _"Type 9 has the stronger countercase. Ted chose the plan and David executed it for thirty years, a pattern consistent with merging. Yet nobody assigned him the Miami club, fashion house or Attitude cover."_ Merged-agenda case named; self-initiated arenas named as the answer. PROTECT-03 was not converted into an explaining-away.

**P1-03 — career results: completed with residual.** _"Official Premier League, UEFA and England records give the return: six league titles, a Champions League and 115 England caps, 59 of them as captain."_ A reader with no football knowledge can now answer "great" and cite it. No timeline entry names an unestablished city — the "Retires in Paris" entry was cut entirely rather than fixed. Residual: the minimum repair also asked for his position stated plainly, and the body never states it. The only positional reference is the 1999 timeline entry's _"centre midfield in the Champions League final"_ — accurate for that match but an emergency role, so a stranger's only cue about where he played is his least typical position. Non-blocking; the acceptance test itself is met.

**P1-04 — timeline: completed.** _"1999, the answer"_ (treble, centre midfield, both injury-time goals from his corners) and _"2002, the penalty"_ (Argentina again, Simeone on the pitch) are both present at the existing one-line cadence. "1998, the effigy" was cut as the funding source. The section's opponent reappears at the moment of recovery, and the treble is nameable from the article.

**P1-05 — unsourced precision: completed.** "Boot deal," "the same week," "he told them" (dressing-room) and Keane's "on one condition" are all gone. The spending anecdote is now attributed: _"In archive shown on The Overlap's Stick to Football in October 2023, Beckham recalled signing a £50,000 Adidas contract and spending £50,000 on a BMW M3."_ The paps line is correctly labelled: _"In the same archival footage, asked about a Gucci jacket, he said…"_ "The flash Cockney" survives as instructed.

**P1-06 — Ted's parenting: completed.** _"Her objection did not change the method, and the method produced what Ted wanted."_ CRITIC's protected first half is verbatim; only the verdict clause changed to an outcome. Sandra gained both the extra clause (_"thinking it too strict"_) and her fuller occupation (_"worked as a hairdresser and in nursing homes"_). No sentence grades the method in the article's voice.

**P1-07 — durability bundle: completed with residual.** "At 51" is gone (zero hits). The closer is date-anchored: _"In 2023 it was still walking him through his own house at 2am."_ "Now" is anchored: _"Since January 2026 that claim has faced its hardest public test."_ The permanent incapacity is scoped to a capability: _"cannot produce another adult's consent."_ FAQ 4 opens _"As of 2026."_ "Still" is gone from the meta description. Residual: the description still asks _"So why does he clean the house at 2am?"_ — a present-tense habitual claim about a private routine with no adjacent source date, which is the acceptance test's stricter half. The minimum repair as written was applied in full, and the description sits outside the reader-visible hash.

**P1-08 — counter-case in the body: completed.** _"Ted settled what his son would be before he could walk, and David executed that plan at world-class level for thirty years. That is the substance of the Type 9 objection. The arenas David pursued without an assignment… weigh more heavily for Type 3."_ A reader who never opens the Rabbit Hole can state the Nine case and the reason it was rejected. Written as one unit with P1-02, so the material is not stated twice at different depths; FAQ 5 was rewritten to match.

**P1-09 — Inter Miami: completed.** _"Jorge and José Mas joined the ownership group in 2017; The Real Deal reported that roughly 60 percent of Miami voters approved the Melreese site on 6 November 2018."_ No reader can now conclude he delivered the stadium alone. PROTECT-07's closing line survives verbatim in the same paragraph.

**P1-10 — Qatar self-resolution: completed.** `grep` for "predates the sportswashing" returns zero. UNICEF 2005 and the 7 Fund 2015 both survive with their dates, satisfying the FUTURE and SUBJECT halves of the three-way conflict. The section's last paragraph reports the knighthood and reads it as a Type 3 arc rather than deploying it against the criticism, and the criticism is explicitly left standing two sentences earlier (_"The achievements do not rebut the Qatar criticism"_).

## Protected-hit regression check

All ten survive. Zero regressions.

- **PROTECT-01 — intact.** The Ferguson boot, the Alice band and _"Whether he planned it or not, a private humiliation had become a photograph on his own terms"_ are all present. The Alice-band detail is now sourced to two dated _Guardian_ reports rather than narrated, which strengthens rather than damages it.
- **PROTECT-02 — intact.** The father section's _"an Enneagram profile should not absorb a mental-health condition into type theory"_ is verbatim. The Rabbit Hole exclusion survives in tighter wording: _"The audience-free cleaning is excluded from the type case and may be a separate mental-health matter."_ The exclusion's function is fully preserved.
- **PROTECT-03 — intact.** _"His reserve remains counterevidence the Type 3 case cannot explain away"_ — tightened from "genuine counterevidence rather than something the Type 3 case gets to explain away," same assertion, and P1-02 did not convert it into an explaining-away.
- **PROTECT-04 — intact.** Brooklyn's allegation, AP's dating, the absent detailed response and Victoria's April 2026 WSJ account remain separate and unadjudicated, with _"no public source can settle what happened in private"_ and _"It proves neither David's motive nor his type."_ Not trimmed as redundant hedging.
- **PROTECT-05 — intact.** _"Results can answer a stadium; repair between adults requires another person's consent, and consent is the one thing no amount of finished work has ever bought him."_ Past perfect unchanged. The colony _"cannot be convinced, out-worked or won over"_ survives, and the piece still ends on the cost.
- **PROTECT-06 — intact, with one clause noted.** Ordering is unchanged: June 2002 _Attitude_ cover and verbatim quote, then HRW, then Lycett shredding that same cover, then his defence, then what it does not answer. The testing sentences survive compressed — _"The answer left the documented discriminatory laws and labor abuses untouched. Critics were being asked to accept access and optimism as accountability."_ The third clause, _"it does not show how a paid ambassadorship improved either problem,"_ was not carried over. I judged the essential function preserved (the answer is still tested and the criticism still survives the section) rather than counting a regression, and I am naming the deleted clause so a human can disagree.
- **PROTECT-07 — restored and intact.** Both _"a discount on a future he had not been given yet"_ and _"Sixteen years from clause to Messi: the same boy in the park, on a timeline he could not compress"_ are verbatim. This was one of the two regressions in the 17:34Z run.
- **PROTECT-08 — intact.** _"The commercial Beckham remains visible: these details appeared in an issue he guest-edited."_
- **PROTECT-09 — intact.** _"Roy Keane, a man with no taste for sentiment,"_ followed by the inhumane / 99.9 percent quotation. Only the stage direction was removed.
- **PROTECT-10 — restored and intact.** _"Ted and Sandra separated in 2002 after thirty-three years, during the stretch when their son's fame was most total. No public source settles what ended it."_ Both sentences present; no cause asserted. This was the second 17:34Z regression. 3w2 remains a hypothesis, and the stress-to-Nine and growth-to-Six lines are unchanged and still qualified.

The synthesis "Do not" list also holds: the untraceable "gay icon" quotation appears only in the non-visible working notes as a recorded exclusion; the retired Ferguson "relentless application" quotation appears only in the testimony ledger as retired evidence; zero hits for Football Leaks or triad vocabulary; no 2026 event is promoted into proof of type; the Type 3 call is not softened.

## Remaining work

Three source-trail items and two residuals. None blocks the gate; items 1 and 2 should be settled before publication because they are the same class of defect that got the Ferguson quotation pulled.

1. **The Sky Sports date on the P0-01 repair conflicts with the packet.** The body asserts _"As Beckham told Sky Sports on 16 May 2019."_ The evidence packet dates that exact article — S-06, `skysports.com/football/news/11667/11721274/`, the same URL now in `citations` — to **2021**, and the synthesis repeats "(Sky Sports 2021)" when quoting _"I was too scared to even show him."_ The draft's own working notes assert 16 May 2019 without naming what settled it. A precise date on a load-bearing repair that the packet dates differently is a miscitation risk. **Minimum action:** confirm the publication date against the article itself, or drop the day-and-month and cite "Sky Sports" with the year the packet supports.

2. **A named witness was added with no external source trail.** _"United receptionist Kath Phipps recalled opening letters containing bullets and calling the police"_ replaced the snapshot's unattributed _"Someone posted bullets to Manchester United."_ Phipps appears nowhere in the evidence packet and carries no testimony-ledger entry; the only trail is a working note saying the detail comes "from coverage of the same Netflix series." Attributing a specific recollection to a named living person needs a citable source. **Minimum action:** add the outlet or the episode to the ledger, or revert to the unnamed formulation.

3. **RQ-04 was resolved by collapsing the dates but not by paraphrasing.** The synthesis's fallback was to collapse to "the October 2025 guest-edited issue" _and_ paraphrase "peace" rather than quote it. The draft collapsed the dates correctly but still quotes _"peace"_ directly. Ledger item 7 records the quotation as corroborated by contemporaneous coverage of the same issue rather than verified verbatim, which is a defensible landing but not the handling the synthesis specified. **Minimum action:** paraphrase, or upgrade the ledger entry to a verbatim verification.

4. **P1-03 residual — his playing position is never stated.** The synthesis asked for it plainly, both "right flank" and "striker of a football" were removed, and nothing replaced them. The only positional cue a stranger gets is the 1999 timeline's "centre midfield," which was a one-off emergency role. **Minimum action:** one clause naming right midfield, funded from anywhere in the brand section.

5. **P1-07 residual — the meta description.** _"So why does he clean the house at 2am?"_ is a present-tense habitual claim about a private routine whose only source is 2023, on the surface most likely to be lifted into a search snippet. The instructed repair (drop "still") was applied; the acceptance test's stricter half is not met. **Minimum action:** none required by the gate; if touched, anchor it the way the closer now is.

Two items the synthesis left open remain open by design and need no action: the Ferguson volume and page (RQ-01, quotation stays excluded and bears no claim) and Gary Neville's original archival venue (RQ-02, the article claims only where the footage was shown).
