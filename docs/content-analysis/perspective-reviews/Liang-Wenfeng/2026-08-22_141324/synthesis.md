---
artifact: perspective-synthesis
schema_version: 1
subject: Liang-Wenfeng
draft_sha256: 90cbfd2f54b76bb32e5af49e38cb26a6f8f1984ea949618feb979e2efd8bf728
synthesis_status: complete
delight_target: fan
p0_open: 6
p1_accepted: 12
research_required: 3
protected_hits: 16
requires_revision: true
synthesized_at: 2026-08-22T19:42:28Z
path: docs/content-analysis/perspective-reviews/Liang-Wenfeng/2026-08-22_141324/synthesis.md
---

# Perspective synthesis: Liang Wenfeng (frozen draft 90cbfd2f…8bf728)

Inputs read: `context.json`, `draft-reviewed.md` (SHA verified: matches context and argument), `evidence-packet.md`, and the six complete reviews (critic, enneagram, fan, future, subject, unfamiliar). Every cited passage was re-read in the frozen draft before adjudication. Three additional sources were consulted, only to settle concrete conflicts; they are logged inside the affected items (P0-01, P0-03, P0-05, P1-03, P1-07).

Jury tallies: six of six recommend revise. Trust: strained ×5, intact ×1 (unfamiliar). Delight: clear_hit ×6. Blockers raised: critic 1, enneagram 1, fan 1, future 1, subject 2, unfamiliar 0. Four of the five single-blocker reviews name the same blocker.

## Executive verdict

The piece is a clear hit for its default target. All six jurors, including the skeptic and the subject proxy, independently name the same core as the thing to protect: a quant who got rich taking the difference on mispriced assets, then built the most mispriced asset in his industry and declined the difference; the "verifying whether our hypotheses are correct" anchor; the stamps-to-chips loop; the investor-asks-him-to-charge-less scene; and a concession paragraph that lets the critics' strongest facts stand. The informed fan says the 2021 apology letter read against DeepSeek's pricing is a link nobody has made. The unfamiliar reader finished with trust intact and could state the thesis without learning the system.

The draft is not publishable as frozen, for one reason that four jurors found independently and the packet had pre-flagged: its own falsification test fired before its date. DeepSeek warned of a "significant" API price increase on August 6, 2026 and began billing peak hours at twice the off-peak rate on August 16 (DeepSeek's own release note, verified here). The draft, dated August 22, states in six places that DeepSeek prices to a ten-month payback "and no more," says it "could charge double" as a hypothetical, and names "a post-IPO price hike" as the evidence that would change the call. The thesis survives the hike (rationing a guarded resource is what an sp-Five does); the silence does not.

Five further P0s are all cheap and all internal to the record the draft already cites: the "never published his GPU count" claim is contradicted three times by the draft's own text; the "greatest return" quote is cut one clause before the sentence that resolves it in the thesis's favor; the funding pause is assigned a noble motive the only reporting contradicts; a purported sanctions-evasion line is folded into "Those facts hold"; and a Bloomberg-attributed figure is one Bloomberg never printed. None requires restructuring. The revision is one rewritten paragraph, roughly thirty sentence-level edits, and about 270 words of cuts to stay under the 4,500-word ceiling.

Distinctiveness is not at risk from any accepted item. Several accepted repairs make the piece sharper for the informed reader than it was: the price hike becomes the most current beat in the piece, the real counterevidence (#117, the 20-billion-yuan procurement wish) replaces a manufactured anomaly, and the Type 6 rival gets the answer the draft's own vocabulary invites.

## P0 — mandatory red-flag repairs

### P0-01. The pricing claims are false in the present tense on the draft's own date, the falsification test has already fired, and "priced to cost" contradicts the key-stat

- **Originating:** CRITIC-R1 (blocker), ENNEAGRAM-R1 (blocker), FAN-R1 (blocker), FUTURE-R1 (blocker), SUBJECT-Q1, UNFAMILIAR-Q1; plus CRITIC-C3, SUBJECT-C6, UNFAMILIAR-R3 (the "priced to cost" euphemism and the unexplained 545%). Packet Disputes #8 and final research-limitation bullet.
- **Location and passages (all re-read in the frozen draft):**
  - `description`: "price DeepSeek to a ten-month payback"
  - Intro ¶4: "describes a lab that prices its product to pay back its hardware and declines to charge a yuan more"
  - TL;DR bullet 4: "**Priced to cost:** DeepSeek's API is set to pay back its servers and no more, per the purported transcript, when it could charge double and lose almost no demand."
  - 118-points, #91–93: "DeepSeek's API price is set so that a batch of servers pays for itself in ten months."
  - Key-stat: "10 months / the hardware payback DeepSeek prices its API to, per the purported 2026 transcript; the company's own March 2025 disclosure put its theoretical daily margin at 545%"
  - 118-points close: "The test is simple. If the API price goes up after the IPO, the restraint was a phase."
  - Rabbit Hole, Counterarguments: "A post-IPO price hike is the evidence that would change this call."
  - Ending ¶2: "a lab that charges ten months of hardware and no more"
  - FAQ 7 question: "Why does DeepSeek keep its prices so low?"
  - Personal-life ¶1 bridge: "Until then, the record to test him against is thin." ("then" = the post-IPO test)
- **Adjudicated problem:** Two defects share these sentences. (a) Temporal: the claims are present tense and the named disconfirmer has occurred, pre-IPO, six days before the draft date. (b) Euphemism: "priced to cost" / "and no more" / "not a yuan more" describe a ten-month hardware payback, which is a return target, not cost; the draft's own key-stat (545% theoretical daily margin) and the subject's own 2024 rule ("we don't subsidize nor make exorbitant profits") both say so. The newcomer read the box as a riddle; the finance-literate reader reads it as the writer not noticing.
- **Evidence and confidence:** Primary, verified in this synthesis: DeepSeek API docs release note dated 2026-08-13 (`api-docs.deepseek.com/news/news260813`): "With the V4 lineup release, we're updating our API pricing and introducing peak and off-peak rates. Off-peak rates are 50% lower than peak, enabling more flexible workload scheduling. New pricing takes effect at 16:00 UTC, Aug 16, 2026." Three jurors independently fetched the live pricing page on 2026-08-22 and agree on current rates (V4-Pro output $1.98 off-peak / $3.96 peak; V4-Flash output $0.66 / $1.32; peak 01:00–04:00 and 06:00–10:00 UTC; weekend off-peak from August 23). The August 6 warning is reported by TechNode, Dataconomy, Quartz, aipricing.guru and EdenAI; DeepSeek's own August 6 wording was not retrieved by anyone (the `news260806` slug does not exist; checked here). Confidence: high that the hike is real, dated, and pre-dates the draft; **unresolved** whether the off-peak floor equals the pre-hike list price (critic and future say yes via aipricing.guru; fan says V4-Pro output more than doubled via press summaries; see RQ-01). The repair below is written to be correct under either outcome.
- **Minimum repair:**
  1. Replace the "test is simple" sentence with one dated paragraph (~100 words) stating: the August 6, 2026 warning of a "significant" increase; peak/off-peak billing from August 16 with peak at twice off-peak, citing DeepSeek's August 13 note and its phrase "enabling more flexible workload scheduling"; and that this happened before any listing. **Do not print pre-hike rates or percentage increases until RQ-01 is answered.**
  2. Re-specify the test from _whether_ to _why_: a rise that tracks the cards (peak-hour rationing while the floor holds; a payback rule recomputed on scarcer hardware) is the Five rationing a guarded resource; a rise after the listing that capacity cannot explain, with the floor moving, is the restraint having been a phase. Mirror the new test in the Rabbit Hole sentence and fix the personal-life "Until then" bridge so it still points at something.
  3. Convert the six present-tense pricing sentences to dated or attributed tense ("through mid-2026," "per the May 2026 transcript," "the rule he described").
  4. Replace "priced to cost" / "and no more" / "a yuan more" with the accurate claim: priced to a ten-month hardware payback, which he himself calls "not profit-maximizing," on a product whose theoretical inference margin the company once put at 545%. Gloss the 545% in the key-stat label: theoretical, if every token had been billed at R1 list price over one day; "actual revenue substantially lower" (Open Source Week, Day 6, March 2025).
  5. Retitle FAQ 7 to something that stays true ("How does Liang Wenfeng say DeepSeek sets its prices?") and add one sentence on the August 2026 change.
  6. Optional, one sentence, if words allow: the September 29, 2025 V3.2-Exp cut (API prices down 50%+ on sparse attention) as the one verified, non-purported price _cut_ between V2 and the leak, so the price line runs May 2024 → Sept 2025 → May 2026 transcript → Aug 2026 hike (FAN-R7).
- **Expected reader benefit:** The page's only one-click-checkable claim becomes correct on publish day; the "what would change my mind" move becomes a live commitment; the title frame ("Takes Less") is defended by argument rather than exposed to a pricing-page screenshot.
- **At risk:** PROTECT-06 (the anomaly structure with a stated falsifier) and PROTECT-12 (the 10-month / 545% pairing). Keep both structures; change only the test's content and the label's gloss. The #91–93 scene (PROTECT-05) is untouched: it is a report of what the transcript says, not a present-tense claim.
- **Acceptance test:** (1) The body contains "August 2026" within one sentence of "peak" or "price increase," and cites DeepSeek's own note. (2) `grep -n "after the IPO\|priced to cost\|and no more\|a yuan more" draft` returns zero hits in reader-visible prose. (3) The stated disconfirmer names a condition that has not occurred as of 2026-08-22. (4) No pre-hike dollar rate or percentage appears unless RQ-01 is closed. (5) The key-stat label explains why 545% and a ten-month payback coexist. (6) FAQ 7's question is no longer "keep its prices so low."

### P0-02. "Never published the number of cards" is contradicted three times by the draft itself

- **Originating:** SUBJECT-R1 (blocker), CRITIC-C4, FAN-R2, ENNEAGRAM-C5, UNFAMILIAR-R2, FUTURE (preserve-list caveat). Packet CLM-40, Disputes #7.
- **Location and passages:** TL;DR bullet 3: "The one number he has never published is how many GPUs he owns." Catfish ¶7: "What he has never published is the number of cards in the building, the only asset that cannot be bought back once it is taken away. He publishes the map and hides the engine." Contradicted by: diagnosis ¶2 ("he recited the count like a lab notebook, from 'a single card in the early days' to '10,000 cards'"), the timeline rows for 2021 ("about 10,000 Nvidia A100s") and 2026 ("Roughly 20,000 H-equivalent cards"), and the Fire-Flyer paper (arXiv 2408.14158, submitter Wenfeng Liang, 10,000 PCIe A100s).
- **Adjudicated problem:** Objectively false, and placed two paragraphs after Alexandr Wang's "They can't talk about it obviously because it's against the export controls," where it reads as corroboration that he conceals hardware. The unfamiliar reader caught it with no outside knowledge. It carries the "hide the engine" half of the draft's best metaphor.
- **Evidence and confidence:** Internal to the draft; packet S01, S31, S03. High.
- **Minimum repair:** Narrow to what is true: no audited or current inventory, and no disclosed count of what was bought after the October 2022 controls; the only post-ban figure is purported, and the transcript's own moderator asked attendees not to circulate "card quantities" (verified in S03 this synthesis). Mirror in the TL;DR bullet. The Alexandr Wang claim then becomes the evidence for the "hide" half instead of sitting beside a false one.
- **Expected reader benefit:** The metaphor survives on a footing a fact-checker can pass; the subject is no longer implied to hide something he put in a paper.
- **At risk:** PROTECT-09 ("He hoards the private resource and gives away the public one" / publish-the-map). Keep the metaphor; only the "never published" clause changes.
- **Acceptance test:** `grep -n "never published" draft` returns zero hits in reader-visible prose, or every hit is scoped to "audited," "current," or "post-2022." The timeline, diagnosis, and catfish paragraphs no longer contradict one another.

### P0-03. "Greatest return" is quoted without the clause that resolves it

- **Originating:** SUBJECT-R2 (blocker; lone reviewer, inside domain); ENNEAGRAM-Q2 (asked the same question from the other side); CRITIC-C2 (the omitted #117 is the real counterevidence); UNFAMILIAR-I7 (the puzzle needs restating at this payoff).
- **Location and passage:** 118-points, closing ¶: "In the purported 2026 transcript the same man describes his habit of mind this way: 'When I want to do something, my habitual thinking is: what has the greatest return for me to do at this moment?' Three years and roughly $36 billion sit between those two sentences. Either curiosity is the motive and return-on-attention is the discipline that guards it, or the second sentence is what the first one turns into once the experiment starts paying." Echoed in Rabbit Hole: "The honest anomaly, curiosity in 2023 against 'greatest return' in 2026, is argued in the body above."
- **Adjudicated problem:** Quote distortion by omission of immediate context. **Verified in this synthesis against S03 (fredgao.com):** the sentence continues, in the same breath, "If I feel doing products has the greatest return right now, I feel I'll go do products; if I feel realizing AGI first has the greatest return right now, then I'll go do AGI first. Obviously, I feel doing products right now doesn't have the greatest return." "Return" is his reason for choosing AGI over products, which is the curiosity reading. "$36 billion sit between those two sentences" makes "return" read as money. The draft's second alternative is manufactured by the cut, in the paragraph the draft presents as its most honest.
- **Evidence and confidence:** High (primary translation read).
- **Minimum repair:** Rewrite the "fifth point" paragraph once, doing three jobs: (1) quote or paraphrase the products-vs-AGI continuation so the reader sees what "return" referred to; (2) keep the two-sentences-three-years-apart structure and the open ending, but substitute honest counterevidence from the same document for the manufactured one: #117 "If the AI era will produce many trillion-level companies, I think we're one of them," the wish to spend "20 billion" yuan on cards "this year," and two funding rounds after 2024's "no financing plans" (CRITIC-C2, SUBJECT-R2's own suggestion); (3) open with one clause restating the puzzle ("the quant who walked away from the difference") so the reader does not scroll back 2,400 words (UNFAMILIAR-I7). The P0-01 pricing paragraph follows directly.
- **Expected reader benefit:** The thesis is tested against real ambition evidence instead of an editing artifact; the critic's strongest line (#117) is inside the tent; the paragraph lands for the skim reader.
- **At risk:** PROTECT-06 (the anomaly structure). Every juror protects the _structure_; only the subject proxy objects to the _content_, and the subject proxy's own repair keeps the structure. Keep "Three years and roughly $36 billion sit between those two sentences" only if the sentences it refers to are the new ones.
- **Acceptance test:** Wherever "greatest return" appears, the products-vs-AGI continuation or an accurate paraphrase follows in the same paragraph. The paragraph names at least one of #117 / the 20-billion procurement wish / the post-2024 rounds as the counterevidence. The Rabbit Hole's "honest anomaly" sentence points at the corrected paragraph.

### P0-04. The funding pause is assigned a motive the only reporting contradicts, and the Rabbit Hole asserts a refusal that never happened

- **Originating:** CRITIC-C1 and CRITIC-M1, SUBJECT-C2 (high), FUTURE-R8, UNFAMILIAR-R4, ENNEAGRAM-C4 (partial). Packet Disputes #4.
- **Location and passages:** TL;DR bullet 5: "**Eleven days:** what telling investors the truth about the gap with America cost him. He paid it." 118-points: "The truth cost eleven days and no money at all. He had already priced it." Rabbit Hole, Counterarguments: "froze his own funding round rather than soften a transcript." Stress arrow: "The July funding pause reads as the Five pulling the door shut the moment the map leaked." (This last is labeled a reading and is acceptable.)
- **Adjudicated problem:** Bloomberg, July 25, 2026 (S07, fetched by critic and subject): "The suspension stemmed in part from Liang's frustration over online reports about his comments to investors." No source reports that anyone asked him to soften anything or that he refused. The draft converts a reactive pause into a principled stand, states it as fact in the TL;DR, and then uses the invented refusal as the decisive Type 5-vs-9 discriminator. The newcomer could not tell from the intro who paused the round or why.
- **Evidence and confidence:** High.
- **Minimum repair:** State Bloomberg's reported reason once in the body ("Bloomberg's sources attributed the pause partly to his frustration that the remarks had leaked"). Hedge "He paid it" / "The truth cost eleven days" to a marked reading or cut. Delete "rather than soften a transcript"; if the 5-vs-9 discriminator needs a third example, the record supports "did not retract or qualify the remarks," and the price war and the Li Qiang remark already carry the point. Make explicit in the intro that he paused the round himself.
- **Expected reader benefit:** The draft's most quotable line stops being its least supported; the Nine counterargument rests on verified behavior; "Nobody gets the flattering version" (catfish close) stops being contradicted one section later.
- **At risk:** PROTECT-14 ("A Nine smooths it; Liang ignores it"). Keep the sentence and the two verified examples; drop or reword the third.
- **Acceptance test:** The body contains Bloomberg's reported reason. No sentence in the body, TL;DR, or Rabbit Hole asserts that he declined to soften, edit, or retract the transcript, or states the pause as the cost of candor without a hedge word.

### P0-05. A purported sanctions-evasion line is folded into "Those facts hold," and the accumulator claim is scoped to China when the same source says the opposite

- **Originating:** SUBJECT-C1 (high; lone reviewer, inside domain). Packet CLM-37 ("legal-risk phrasing"; not in the Tencent 118-point edit). Conflicts with CRITIC-H1's "must survive revision unchanged" (resolved below).
- **Location and passage:** Catfish ¶6: "Concede the core of it. The $5.6 million was one training run, stated as such in the V3 paper; High-Flyer had spent about a billion yuan on Fire-Flyer 2 alone. The purported 2026 transcript has him telling investors 'we can buy some non-compliant cards.' A man who presents himself as restrained was, on the evidence, one of the most aggressive accumulators of GPUs in China. Those facts hold, and no personality lens dissolves them."
- **Adjudicated problem:** "Purported" is cancelled two sentences later by "facts." The reader leaves believing it is established that he admitted to export-control evasion, from a speaker-unlabeled ASR document DeepSeek has not confirmed. **Verified in S03 this synthesis:** the line sits in a passage about Huawei 950 cards that opens "It should be an order of magnitude less than internet giants," so "one of the most aggressive accumulators of GPUs in China" is contradicted by the document being quoted; it is true for a hedge fund in 2021, not for the country.
- **Evidence and confidence:** High on the labeling and the scope; the Chinese original of "non-compliant" is unread (RQ-02).
- **Minimum repair:** Split the sentence so "Those facts hold" binds only to the V3 paper and the Fire-Flyer cost; keep the transcript line with its label in its own sentence, after the "facts" sentence or clearly outside it. Scope the accumulator claim to its comparison class ("for a hedge fund" / "for a company its size"). Do not cut the line; the critic is right that the concession's force depends on not flinching.
- **Expected reader benefit:** The steelman keeps its force without stating an unverified admission of illegality as fact.
- **At risk:** PROTECT-03 (the concession paragraph). The critic wants it unchanged; the subject proxy wants it true. A reorder that leaves every clause in place satisfies both. "A man who presents himself as restrained was, on the evidence, one of the most aggressive accumulators of GPUs [for a fund its size]" keeps the line's bite.
- **Acceptance test:** "Those facts hold" (or its replacement) follows only sentences sourced to the V3 paper and High-Flyer's disclosures. "Non-compliant cards" appears with "purported" in the same sentence and no "fact" language binding to it. The accumulator claim carries a comparison class.

### P0-06. A Bloomberg-attributed figure Bloomberg did not print, and a round narrated as closed while unsigned

- **Originating:** CRITIC-C9, FAN-R6, SUBJECT-C3, FUTURE-R3, UNFAMILIAR-R5 (the two colliding "50 billions"). Packet CLM-06/07, Disputes #2/#3.
- **Location and passages:** Intro ¶3: "Two days later Bloomberg reported that he had told the next set of backers, lined up to put in another 50 billion yuan, that they would not be signing in the coming days. The round stayed frozen for eleven days." 118-points: "By August 5 the round was back on, at a valuation near $74 billion (Bloomberg, August 6). The truth cost eleven days and no money at all."
- **Adjudicated problem:** Bloomberg's July 25 report says "at least 10 billion yuan"; the 50-billion figure is Chinese media via TechNode/BigGo. A reader who clicks the citation finds a fifth of the number. "Back on" and "no money at all" assert an outcome; the packet's sources say the round _reopened_ with signing expected late August. "Eleven" depends on an aggregator's August 5 versus Bloomberg's August 6. The newcomer read "$50 billion" and "50 billion yuan" in adjacent sentences as the same number.
- **Evidence and confidence:** High.
- **Minimum repair:** Attribute 50 billion yuan to "Chinese financial media" or use Bloomberg's floor; add a dollar gloss at first use (≈ $7 billion). "Reopened" for "back on"; drop "and no money at all" (overlaps P0-04). "Under two weeks" or "eleven or twelve days, by source" for "eleven." Add "2026" to the first August date in the 118-points section.
- **Expected reader benefit:** Every number in a Bloomberg sentence survives a click; the passage survives any closing outcome.
- **At risk:** Nothing protected. The "Eleven days" TL;DR bullet is rewritten anyway under P0-04.
- **Acceptance test:** Every figure inside a Bloomberg-attributed sentence appears in the cited Bloomberg report. No sentence asserts the round closed. The intro's yuan figure carries a dollar gloss.

## P1 — accepted high-value improvements

### P1-01. V3's original weights were not MIT

- **Originating:** CRITIC-C10, FAN-R3, SUBJECT-C7(b), FUTURE-R7, UNFAMILIAR-Q5. Packet CLM-39, S33.
- **Location:** Catfish ¶7 and TL;DR bullet 3: "V3, R1, and now V4 have all shipped with open weights under an MIT license."
- **Problem:** December 2024 V3 weights shipped under the DeepSeek Model License; MIT arrived with V3-0324. The open-source-literate reader catches it in the paragraph that carries the publish-the-map half of the thesis.
- **Evidence/confidence:** High (Hugging Face cards via packet).
- **Minimum repair:** "R1, V3 since its March 2025 update, and V4" or "with open weights, MIT-licensed since early 2025."
- **Benefit:** Removes a cheap catch from the thesis paragraph. **At risk:** nothing. **Test:** the licensing sentence is accurate for the December 2024 V3 release.

### P1-02. Xi symposium: restore the designated-speakers fact; drop the unsourced seating

- **Originating:** SUBJECT-C4, UNFAMILIAR-M3, FAN-Q4, CRITIC (limits). Packet CLM-33, Disputes #5.
- **Location:** Catfish ¶4: "The state broadcast shows him at the far end of the long table, the same end as Jack Ma, while Ren Zhengfei, Lei Jun, and four others took turns addressing the president … On camera, the most talked-about founder on earth that month said nothing."
- **Problem:** Six entrepreneurs were designated to speak; neither Liang nor Ma was among them. The cohesion pass cut "Liang was not among the six who spoke" as redundant; it was the fairness qualifier, and without it "said nothing" reads as temperament. "Far end of the long table" is a footage reading no text source confirms; CNN places Ma "in the front row."
- **Minimum repair:** Eight words: "was not among the six designated to speak." Delete the seating clause (or source it from a text account). Net word count negative.
- **Benefit:** The beat (silent founder at the most-circulated image of him) lands without inferring withdrawal. **At risk:** nothing protected. **Test:** the paragraph states the speakers were designated; no seating description remains without a text citation.

### P1-03. The inner-thought invents a physical room

- **Originating:** SUBJECT-C5. **Verified in S03 this synthesis:** "In the Zoom meeting's chat window"; "Everyone can unmute"; "Please, investors, feel free to unmute."
- **Location:** `<p class="inner-thought">They flew here to hand me fifty billion yuan, and the message on the screen says charge less. Good. Those are the ones to keep.</p>`
- **Problem:** The meeting was a video call with a chat window; nobody flew anywhere. An invented room is more intrusive to a subject than an invented thought. The thought itself is anchored by "He had said so out loud" and the "carefully selected … least hostility" line (UNFAMILIAR-H5 protects the convention).
- **Minimum repair:** Fix the setting ("They dialed in to hand me …"; "the message in the chat says charge less"). Keep the thought. Rejected: cutting the inner-thought (the subject proxy's alternative), because the unfamiliar reader names it the one place they felt in the room.
- **Benefit:** Convention kept, false setting removed. **At risk:** PROTECT-05. **Test:** no reference to travel or a physical room in the inner-thought.

### P1-04. Disclose the two friendly witnesses' stakes; fix Luo's descriptor

- **Originating:** CRITIC-C5, FAN-R8. Packet testimony #2, #7.
- **Location:** Diagnosis ¶3: "Luo Yonghao, the entrepreneur and talk-show host"; chips ¶ and personal-life ¶4 quoting Zihan Wang; epigraph credit.
- **Problem:** Luo had received V3 access help from Liang before the January 2025 meeting; "talk-show host" is an outsider's first search result (he is the Smartisan founder who repaid his debts by livestream selling). Zihan Wang is a former DeepSeek researcher who also translated the 2023 interview the draft quotes in nine places, and labels his money opinion "naive." The outside confirmation of the type reading rests on both.
- **Minimum repair:** One clause each: "Luo Yonghao, the Smartisan founder turned livestream seller, whose team Liang had helped with model access"; "Zihan Wang, a former DeepSeek researcher who also translated the 2023 interview." Rejected: disclosure language for the hometown teachers (named/surnamed, already framed as hometown witnesses).
- **Benefit:** The skeptic cannot say self-mythology was laundered through friendly mouths. **At risk:** nothing. **Test:** Luo's prior help and Wang's dual role are stated where each is introduced.

### P1-05. The Wuchuan football afternoon was Spring Festival, and the village put up an arch

- **Originating:** FAN-R4 (verified via 极目新闻 / 新浪财经 / 凤凰网), UNFAMILIAR-I9/Q2 (asked the calendar question unaided).
- **Location:** Catfish ¶3: "On the day the market repriced his industry, he was on a pitch with people who had known him at fourteen, the one place the number did not follow."
- **Problem:** January 27, 2025 was two days before Lunar New Year; he was home for the holiday; the village erected a welcome arch (文锋回乡传佳绩) and tourists photographed the village stone; he left on New Year's morning. "The one place the number did not follow" is the opposite of the reporting.
- **Conflict:** UNFAMILIAR-H8 and FUTURE's preserve list protect the sentence. Resolved for the fix: the fan verified the fact; the replacement beat (home on the holiday schedule like everyone else, played football, gone by first light, the fame arriving as an archway) is truer and at least as good.
- **Minimum repair:** Add "home for Spring Festival"; cut or invert "the one place the number did not follow."
- **Benefit:** A romantic claim an informed reader knows to be false becomes a characteristic one. **At risk:** PROTECT (unfamiliar's felt moment); keep the football sentence itself. **Test:** the passage mentions Spring Festival and does not assert the fame did not reach Wuchuan.

### P1-06. Counterarguments: Six replaces One; Three closed in a sentence; corpus stat made unambiguous

- **Originating:** ENNEAGRAM-C1, C2, C3, M3; FUTURE-R7 (corpus fragility). Packet S44.
- **Location:** Rabbit Hole, Counterarguments: "Type 1 is the secondary case …" through "the densest concentration in the catalog."
- **Problem:** The draft argues in Six vocabulary ("insurance," "fear under the restraint," backers selected for "least hostility," "only core interest," consensus authority, cards bought a year before the ban) and never tests Six. The body's counterevidence (806, "trillion-level companies," 20 billion yuan, richest founder) points at Three, and the Rabbit Hole rebuts the two most passive types instead. "16 type as Fives, the densest concentration in the catalog" reads as "Fives are the largest group," but Threes lead the bucket at 19; the true claim is over-representation (+13.3 pp vs. corpus).
- **Conflict:** CRITIC's preserve list includes "the Type 9 and Type 1 counterarguments." Resolved: One compresses to one sentence (its substance survives), Six takes the paragraph.
- **Minimum repair:** Replace the One paragraph with a Six paragraph using the discriminator the record supplies: security through self-sufficiency, not alliance (declined the DJI friend, listed one university, eleven years without outside capital, and the 2024 interview's total absence of threat language: "Honestly, we don't really care"; "moats created by closed source are temporary"). One sentence closing Three on image-indifference (mistaken for an assistant, no video, no PR, unfinished products, "not domesticated"). Rephrase the corpus line: Fives are over-represented here relative to the catalog; Threes, at 19 of 74, are still the largest group. Net word cost ≈ +25.
- **Benefit:** The rival the draft's own language invites gets answered; a checkable repo fact stops reading wrong and introduces Three honestly. **At risk:** PROTECT-14 (Nine paragraph) untouched. **Test:** Six is named with the self-reliance-vs-alliance discriminator and one dated refusal; Three is named with the image-indifference discriminator; the corpus sentence no longer implies Fives outnumber every other type in the bucket.

### P1-07. Arrows: "a year" is not in the source; financing rounds are not stress evidence

- **Originating:** ENNEAGRAM-C4, SUBJECT-C7(a). Packet CLM-42. **Verified in S03 this synthesis:** "if this year I could spend 20 billion [yuan]."
- **Location:** Rabbit Hole, Stress and Growth Arrows: "by mid-2026 there were two rounds, an IPO track, and a purported wish to spend 20 billion yuan a year on procurement. The July funding pause reads as the Five pulling the door shut the moment the map leaked."
- **Problem:** "A year" is a fidelity error. Raising capital is read as Five-under-stress and pausing the raise as Five-at-home, so no financing behavior could disconfirm. Two rounds and an IPO are what a lab with "one-twentieth of the compute" must do.
- **Minimum repair:** "this year," not "a year." Cut the rounds from the stress paragraph or state that the raise is what the mission requires, not a stress signature. Attribute the pause reading (ties to P0-04). The growth-to-8 examples stand. Net word count negative.
- **Benefit:** The arrows stop being unfalsifiable; the wording matches the source. **At risk:** nothing. **Test:** no "a year" / "annually" attached to the 20-billion figure; the arrows paragraph does not present the rounds as disintegration.

### P1-08. Two robustness sentences: what the call rests on without the transcript, and that privacy is not type evidence

- **Originating:** ENNEAGRAM-C6 and M1. Packet research limitation ("roughly a third of the draft's load-bearing quotations").
- **Location:** Rabbit Hole, Counterarguments (one sentence); personal-life section (one sentence).
- **Problem:** Roughly half the Five evidence and the title phrase come from a document DeepSeek has neither confirmed nor denied; the reader is never told what remains if it is repudiated (curiosity, hypothesis-verification, no KPIs, the piano line, the catfish pricing by arithmetic, the open-weights rationale, all 2023–24 and verified). The personal-life section stacks no video / no spouse / "does not go out much" / no hobbies, none of which discriminates Five from an introverted Six, Nine or One.
- **Minimum repair:** One sentence each. ~40 words.
- **Benefit:** The call is shown robust to its weakest source; the search-intent section stops reading as a fifth pillar of the type case. **At risk:** nothing. **Test:** the Rabbit Hole states the transcript-free case in one sentence; the personal-life section concedes privacy does not discriminate type.

### P1-09. The distillation allegation is absent from the section that claims to give the strongest skeptic a hearing

- **Originating:** CRITIC-C6 and M2; FAN ("What I expected": a one-clause acknowledgement). Packet: "never adjudicated; DeepSeek silent; not used in the draft."
- **Location:** Catfish ¶5 (critics) and ¶8 (empathy turn): "Cheap tokens and blunt assessments are what it looks like when a man who spent his twenties failing in a rented room decides the imitation stops with him."
- **Problem:** The most-circulated charge against DeepSeek in January 2025 was precisely imitation (OpenAI said it had evidence of distillation; Microsoft investigated; the White House AI adviser said "substantial evidence"). Building the empathy turn on "originality vs. imitation" without it depends on the reader not knowing.
- **Minimum repair:** One or two attributed, status-marked sentences in the critics paragraph: who alleged it, that it was never adjudicated, that DeepSeek did not respond. Then the "originality and imitation" quote carries its full irony. ~40 words.
- **Benefit:** The steelman becomes complete; the informed reader sees the writer got there first. **At risk:** PROTECT-03 grows by two sentences; the empathy turn (subject H3) is untouched. **Test:** "distill" or an equivalent description appears in the catfish section with attribution and "never adjudicated" or equivalent.

### P1-10. Newcomer load path: the crash needs its cause; yuan needs dollars; sources need names

- **Originating:** UNFAMILIAR-R1 (ranked first by that juror), R5, R6; the cold-open parenthetical.
- **Location:** Catfish ¶3 ("Eight months later R1 shipped, and on January 27, 2025, Nvidia lost about $589 billion"); catfish ¶5 ("the famous $6 million training figure"); ten yuan figures with zero conversions; "36Kr" sixteen times undefined; seven outlets in Chinese script only; cold-open attribution "(Yan's account, relayed by investor Zhang Jinjian in LatePost, republished by Tencent News, January 2026)."
- **Problem:** The single most important event in his public life is stated as an effect with no cause, and the critics paragraph argues about a number the reader has not been given. The unfamiliar juror considered leaving here. Every general-reader explainer leads with the cheap-training claim and the chip-demand fear; the draft omits what every explainer includes.
- **Minimum repair:** One sentence before the crash (R1 matched the best American models on public benchmarks; the V3 paper put one training run at about $5.6 million; the market concluded the world needed fewer chips). Dollar gloss at first use for the three load-bearing yuan figures (intro 50 billion yuan; 1 billion yuan for Fire-Flyer 2; 3 billion yuan founding stake). "The Chinese tech outlet 36Kr" once; romanize each Chinese outlet at first use with the script in parentheses. Trim the cold-open parenthetical to one clause (the citations list carries the chain). ~+60 words net.
- **Benefit:** The section that carries "why this person matters" becomes self-contained; the Chinese sourcing becomes a visible strength. **At risk:** PROTECT-02 (cold open): trim only the parenthetical, not the scene. **Test:** a reader who has never heard of DeepSeek can say after the catfish section why Nvidia fell and what "$6 million" refers to; no source appears only in a script the English reader cannot read; the three named yuan figures carry dollars.

### P1-11. "As of" and relative-language sweep

- **Originating:** FUTURE-R2, R4, R5, R6, R7 (all concerns). Packet CLM-03, 44, 45, 50.
- **Location:** `description` ("richest AI founder alive"); intro ¶2 and ending ¶2 ("richest"); ending ¶3 ("The IPO will hand him a number"); personal-life ¶4 ("roughly four-fifths of a company headed for the stock market"); personal-life ¶1 and FAQ 2/3 negatives; "DeepSeek has never confirmed the document" (intro, FAQ 8); "the sentence people now quote"; "the largest one-day drop for any company in history"; "thirteen years as a founder."
- **Problem:** Each is true in August 2026 and is the kind of claim a funding round, a prospectus, or a larger market day ends. The description is the SERP snippet for years.
- **Minimum repair:** A month-year within one sentence of every "richest"; the ending's IPO sentence conditional on "the 2027 listing Bloomberg reported he was preparing"; "as of mid-2026, before the second round" on the stake; "as of August 2026" once at the top of the personal-life section and in FAQ 2/3; "As of August 2026, DeepSeek had neither confirmed nor denied" (intro, FAQ 8); "quoted back at him that summer"; "up to that point"; "from 2013 to 2026." Note for the editor: DeepSeek's V4 Preview release note (`news260424`) carries an undated appended line, "please rely only on our official accounts for DeepSeek news. Statements from other channels do not reflect our views," which may or may not post-date the leak; do not cite it as a denial.
- **Benefit:** The page ages like a dated profile, not a news story; the refresh becomes find-and-replace. **At risk:** nothing. **Test:** `grep -n -E "\bnow\b|in history|thirteen years|will hand him" draft` returns zero hits in reader-visible prose outside direct quotation; every "richest" and every "never/has not confirmed" sits within one sentence of a month-year.

### P1-12. Fidelity sweep: the dinner date, the forum post, the investing institution, the Open Source Week credit

- **Originating:** FAN-R5 and UNFAMILIAR-Q4 (dinner date); SUBJECT-C7(c) (Zhihu provenance; NBD wording); FAN-R7 (Open Source Week). Packet CLM-02, Disputes #9; S40; S05; S34.
- **Location:** Intro ¶2: "That dinner was in early 2023 … and was months from founding DeepSeek." Childhood: "A classmate, writing pseudonymously on Zhihu years later." Intro ¶4 and FAQ 8: "an investor in the company told National Business Daily." Key-stat label: "the company's own March 2025 disclosure."
- **Problem:** The Tencent/LatePost source gives no dinner date; "early 2023" is the research memo's inference and two of the opening's three context claims depend on it. The classmate text is a ZJU BBS post by a competition teammate at graduation, reproduced on Zhihu/Sohu. NBD says an investing institution, not a person. The 545% figure comes from Open Source Week and the draft borrows the stat without naming the week.
- **Minimum repair:** Drop "early 2023" and "months from founding DeepSeek" (keep "before anyone outside Chinese finance knew the name," which is true of either year), or attribute the dating. "A teammate's post on a university forum, later reproduced online." "An investing institution." "Open Source Week, March 2025" in the key-stat label. Net word count ≈ 0.
- **Benefit:** The hook stops carrying an unverifiable fact; provenance matches the sources. **At risk:** PROTECT-02; the scene is unchanged. **Test:** the opening contains no date the cited source does not contain; provenance wording matches S40/S05; the key-stat names Open Source Week.

## P2 — optional opportunities

- **P2-01. Hedge the stamp motive; promote rhyme, not cause** (ENNEAGRAM-C7). Intro: "The explanation starts with a stamp album" → "The pattern first shows up in a stamp album"; childhood: "A child who wanted something and designed a loop…" → "reads like a child who…". A surname-only teacher's recollection is the earliest instance of the pattern, not its cause. Zero word cost. **This is the one P2 that pays for itself; do it.**
- **P2-02. Name the National AI Industry Investment Fund once as a first-round backer** (CRITIC-C7, Bloomberg-level fact only), and soften "nobody has ever had to hand him either one" if the editor reads it as an autonomy claim rather than a map/engine claim. Structure details → RQ-03.
- **P2-03. One engineering sentence** (FAN-R7/M4): what the lab built under constraint (MLA, MoE routing, FP8, GRPO), or Zihan Wang's "The team loves turning a hardware challenge into an opportunity for innovation" (MIT Technology Review, already in the source set). The subject reads as an engineer-founder, not a discounter. Only if P1 cuts leave room.
- **P2-04. One clause closing the empathy turn** (UNFAMILIAR-M2): connect "contributor instead of freeriding" to cheap tokens so the reader sees why cutting prices is an act of originality rather than competition.
- **P2-05. TL;DR type bullet self-contained** (UNFAMILIAR-I8): add the object of the leak ("a leak of the attention the knowing needs") or substitute "He used the money to need less." Remaining R6 glosses (AGI, "open weights," "the drone maker DJI," "the filmmaker Truffaut").
- **P2-06. One clause at the apology beat** (light version of CRITIC-C8): "a record drawdown of clients' money." Keeps the protected line; makes the loss belong to clients and the design to him.
- **P2-07. One plain clause that Five is a fear-based type** (ENNEAGRAM-P1), ahead of the #37 fear beat.

## Research required before deciding

### RQ-01. Did the August 16, 2026 change raise the off-peak floor, or only add a peak surcharge? And what did DeepSeek's August 6 notice say?

- **Why it matters:** It decides the wording of the P0-01 paragraph, the weight of the re-specified test's first data point, and whether `persona_title` "The Quant Who Takes Less" / `meta_title` "Won't Take More" stand cleanly (floor held: rationing, title stands) or need the body's argument (floor rose: "taking more" is literal and the body must argue rationing-as-restraint).
- **The conflict:** CRITIC and FUTURE infer off-peak = pre-hike list price from aipricing.guru (pre-hike V4-Pro $0.66/$1.98, V4-Flash $0.22/$0.66, which equal today's off-peak exactly). FAN cites press summaries giving prior flat output rates of $0.87 (V4-Pro) and $0.28 (V4-Flash), which would mean the floor more than doubled. EdenAI's figures conflict with both. DeepSeek's August 13 note says only "updating our API pricing and introducing peak and off-peak rates" (verified here); the August 6 notice text was not retrieved by anyone and the `news260806` slug does not exist.
- **Exact source:** Wayback Machine captures of `api-docs.deepseek.com/quick_start/pricing` from 2026-08-01 to 08-05 versus 08-17 onward; DeepSeek's official WeChat post of August 6; the Quartz (2026-08-13) and Dataconomy (2026-08-06) pieces, which returned 403 to every juror.
- **Until answered:** Print no pre-hike rate and no percentage. State only what is primary-verified: a "significant increase" warning on August 6 (three trade reports), peak at 2× off-peak from August 16 (DeepSeek's note), "enabling more flexible workload scheduling" (DeepSeek's phrase).

### RQ-02. What does "non-compliant cards" say in the Chinese original (合规 / 非合规 or other)?

- **Why it matters:** P0-05 is written as a labeling fix on the assumption the phrase means US export-control compliance, which the surrounding passage supports (Huawei 950 purchase framed as ecosystem support because "we can buy some non-compliant cards"). If the original refers to domestic procurement guidance or certification, the draft is misreading a legal-risk phrase and the line should be cut rather than relabeled.
- **Exact source:** The 42-page Chinese ASR document; or the Tencent Technology 118-point edit if the point survived (the packet says it did not); a native-reader check of the sentence around "华为 950."

### RQ-03. First-round structure: state fund with direct equity and votes; other backers in a Liang-managed partnership with a five-year lock-up and no votes; Liang's own 20-billion-yuan contribution

- **Why it matters:** Only if the editor wants P2-02 to say more than the Bloomberg-verified fact that the National AI Industry Investment Fund backed the first round. The critic's "carefully selected" reading (selection produced total control plus one state shareholder) is a real institutional angle, but every structural detail is search-snippet grade (SCMP, Forbes 2026-06-17, BigGo).
- **Exact source:** SCMP July 2026 (paywalled); Forbes "Here's the catch" 2026-06-17; Qichacha / 企查查 filing for 杭州深度求索 showing the LP vehicle (Hangzhou Chengli per BigGo).
- **Until answered:** Keep P2-02 at the Bloomberg level or skip it.

## Conflicts and editorial tradeoffs

1. **The anomaly paragraph: protect the structure (five jurors) vs. the quote is distorted (subject).** Every juror protects the two-sentences-three-years-apart-left-open move; the subject proxy's verified finding is about the quote, not the move. Resolution (P0-03): keep the structure, restore the continuation, and swap in the genuine ambition evidence from the same document. The paragraph gets stronger, not softer.

2. **The concession paragraph: "must survive unchanged" (critic) vs. "facts" cancels "purported" (subject).** Resolution (P0-05): a reorder that leaves every clause in place and scopes one adjective. The critic's concern is that the steelman not flinch; it does not.

3. **The funding pause as the 5-vs-9 discriminator (enneagram H4) vs. motive-laundered (critic, subject, future, unfamiliar).** Resolution (P0-04): keep "A Nine smooths it; Liang ignores it" on the two verified examples (price war, Li Qiang remark); reword the third to what the record supports (no retraction) or drop it.

4. **The football line: protected felt moment (unfamiliar, future) vs. verified false (fan).** Resolution (P1-05): fix; the true version is at least as characteristic. Keep the sentence, change the claim.

5. **Type 1 paragraph: preserved by the critic vs. replaced by Six (enneagram).** Resolution (P1-06): One compresses to a sentence; Six takes the paragraph. Word-neutral.

6. **Pre-hike pricing floor: critic/future vs. fan.** Unresolved → RQ-01. P0-01 is written to be correct either way and forbids printing old rates until closed. The title frame is deferred to RQ-01 and stands by default.

7. **"He used the money to need less" (protected by critic, fan, unfamiliar) vs. contradicted by $3B self-investment and 20-billion procurement wish (enneagram M2).** Resolution: protect. The draft means "need less of everything except compute"; the next paragraph lists what "less" means (no overtime, no sales, no finished products) and the subtype sentence "He hoards the private resource and gives away the public one" resolves it. No change.

8. **Word ceiling.** Accepted additions total roughly +270 words against ten words of headroom under the 4,500 lint ceiling (which counts the Rabbit Hole and TL;DR). Cut before adding. Cut list, in order of least loss: the Xi seating clause (−12, P1-02); "early 2023 … months from founding" (−10, P1-12); the cold-open parenthetical (−15, P1-10); the One paragraph net of the Six swap (0); the "a year" and rounds-as-stress trims (−20, P1-07); personal-life ¶3 Businessweek description trimmed to the two quoted phrases (−35); Luo Yonghao paragraph trimmed by one sentence (−25); the "When the document leaked in July…" paragraph tightened (−30); intro ¶2–3 tightened (the future juror's removal test shows the July–August material is the safest place to cut; −40); Chengdu "It was a strange kind of fund" paragraph merged into the next (−25); the pseudonymous classmate sentence shortened (−20). That is ≈ −230 before the Rabbit Hole's own trims, which is enough with P2 additions skipped.

## Rejected feedback

- **CRITIC-M3 / part of C2: change "walked away from the difference" because he took the difference in valuation.** Rejected. The ending already answers it ("The market, unable to find the price he declined to set, set it for him"); the intro and ending are a pair. The substance (#117, larger later take) is absorbed by P0-03. FAN-H1 protects the sentence verbatim.
- **CRITIC-C8: rewrite the 2021 apology beat as a client-loss event the founder did not sign.** Rejected as a rewrite; the draft already says "the firm said sorry," which the packet marks safe (CLM-23), and the line is a top hit for fan, unfamiliar, and future. The light clause survives as P2-06. Who signed (CRITIC-Q5, SUBJECT-Q4) matters only if someone wants to strengthen the beat.
- **CRITIC "what the product hides" (state-aligned refusals, government-device bans).** Out of scope; product criticism, not personality evidence. The critic did not number it.
- **CRITIC-C5 for the hometown teachers.** Rejected; named/surnamed witnesses already framed as hometown testimony.
- **ENNEAGRAM-M2: "He used the money to need less" is contradicted.** Rejected; see Conflict 7.
- **ENNEAGRAM-C2 beyond one sentence on Three; any Type 8 case.** Not requested beyond a sentence; the reviewer calls Eight weaker still.
- **SUBJECT-C5 alternative: cut the inner-thought entirely.** Rejected in favor of the setting fix (P1-03); UNFAMILIAR-H5 names it the one place they felt in the room.
- **FAN preferences: 梁文锋 in the body; the 2019 Golden Bull "a fund manager is a pile of servers" line; "richest" rephrasing for Jensen Huang followers.** Deferred. The "richest" superlative is handled by the as-of date (P1-11); Bloomberg's scoping is Bloomberg's and the draft attributes it.
- **FAN-R7 engineering sentence and Open Source Week as a named beat.** Partially accepted (OSW name into the key-stat label, P1-12; V3.2 cut as optional sentence in P0-01); the engineering sentence is P2-03 because the piece is personality, not product, and the ceiling binds.
- **FUTURE-I5: restructure so the durable core is visibly the spine.** Rejected; the reviewer marks it a preference, not a defect. Its removal test is used only as a cut guide.
- **FUTURE-R1's suggestion to hedge `persona_title` / `meta_title`.** Deferred to RQ-01; stands by default once the body argues rationing-as-restraint.
- **FUTURE-R5: retitle the personal-life H2.** Rejected; the H2 answers a search query. The as-of date (P1-11) is the fix.
- **UNFAMILIAR-R6 remainder (AGI, open-weights, DJI, Truffaut glosses) and I8 (TL;DR bullet).** Demoted to P2-05; the unfamiliar reader finished with trust intact and these are friction, not gaps.
- **UNFAMILIAR-R3 alternative: remove the 545% stat.** Rejected; CRITIC-H2 protects the pairing. The gloss (P0-01 item 4) is the fix.
- **FAN-Q5 / packet: Fire-Flyer 1 year (2018 vs 2019), "sold directly."** Deferred; not material, not contested by any juror as a finding.

## Protected hits

- **PROTECT-01.** "Verifying whether our hypotheses are correct. If they are, that's immensely satisfying." (36Kr, 2023) + "Most founders answer that question with a market. He answered it with an experiment." All six jurors. The type call hangs from it and it is the one first-person, verified, evergreen anchor.
- **PROTECT-02.** The Yan Junjie cold open, staged exactly as is, including the half-hour delay before "I am Liang Wenfeng." (fan, future, subject, unfamiliar). Trim only the attribution parenthetical (P1-10) and the inferred date (P1-12).
- **PROTECT-03.** "Concede the core of it … A man who presents himself as restrained was, on the evidence, one of the most aggressive accumulators of GPUs … Those facts hold, and no personality lens dissolves them." + Amodei + "Both can be true of the same lab." (critic H1, fan H5, subject H2, future H6, enneagram H7, unfamiliar). Survives P0-05 as a reorder.
- **PROTECT-04.** "Most people who get rich expand. He used the money to need less." + "A Five feels safe in proportion to how much he has figured out, and guards whatever the figuring requires: time, attention, and in Liang's case, compute." (critic, fan H3, unfamiliar H2/H3). The P1-06 Six paragraph must not replace plain English with framework terms.
- **PROTECT-05.** The #91–93 scene: "Let's rest for five minutes. Let me write quickly," the on-screen message that a ten-month payback is too much profit, "Indeed there's still room for price cuts," "many people in the company group cheered," the inner-thought, and the anchor "He had said so out loud." (fan H4, subject, unfamiliar H5, critic). Only the inner-thought's setting changes (P1-03).
- **PROTECT-06.** The anomaly structure: two of his own sentences three years apart, left open, followed by a stated falsifier, in the body not the accordion. (critic H3, enneagram H3, fan H8, future H5, subject H5, unfamiliar H6). Content repaired by P0-01 and P0-03; structure untouchable.
- **PROTECT-07.** "Even the extravagance was frugal. 'NVIDIA GPUs hold their value well,' he noted, 'and older cards still find buyers.' The stamps had become chips." (enneagram H2, fan H7, future, unfamiliar H10).
- **PROTECT-08.** The whole childhood section: "using stamps to fund stamps," "finished high-school maths in middle school," 806/900, one school on the form, "Certain," "Self-taught, self-funded, self-transported … Then he disappeared." (fan H9, future H1). Every witness is dated and about events twenty years old; nothing in the news cycle can touch it.
- **PROTECT-09.** "He hoards the private resource and gives away the public one." + the publish-the-map / hide-the-engine metaphor (enneagram H6, unfamiliar). Repair only the "never published" clause (P0-02).
- **PROTECT-10.** The purported-label discipline, eleven times in the body, plus the intro's authenticity paragraph (NBD confirmation, DeepSeek silence). (critic H4, future H3, subject, unfamiliar). Date it (P1-11); do not loosen it.
- **PROTECT-11.** "No reputable outlet has established whether he is married," the content farms, the snooker player Liang Wenbo, birth year only, "roughly four-fifths." (subject H4, unfamiliar H7, future H4). Do not let an SEO pass "improve" the wife answer.
- **PROTECT-12.** The key-stat pairing of the ten-month payback with the 545% disclosure in one box. (critic H2). Gloss, do not separate.
- **PROTECT-13.** "The machine had done the one thing its owner refuses to do. It reached for more, and the firm said sorry for it in public. The lab it announced sixteen months later already had the hardware to run on." (fan H2, unfamiliar H9, future). Protected against CRITIC-C8.
- **PROTECT-14.** "A Nine smooths it; Liang ignores it." with the price war and the Li Qiang remark as dated examples. (enneagram H4). Third example reworded per P0-04.
- **PROTECT-15.** "A quant fund exists to find mispriced things and take the difference. Liang got rich doing exactly that. Then he built the most mispriced asset in his industry … and walked away from the difference." (fan H1) and the watermelons close with "He meant users." before the quote is repurposed (subject H6, fan, unfamiliar). Protected against CRITIC-M3.
- **PROTECT-16.** "Cards can be rebought. A fortune can be remade. The people who hold the unwritten vision in their heads cannot be, and from July 23 the document that says so, in his own words, was public." (enneagram H5). The fear beat, person-first.

## Revision brief

Ordered, bounded worklist for the editor. Cut before adding (Conflict 8 cut list). Do not touch `lastmod`. Do not edit the frozen snapshot; edit `src/blog/people/drafts/Liang-Wenfeng.md` only.

**1. P0 items, in this order (they share sentences):**

1. **P0-03 + P0-01 together: rewrite the closing beat of "Four of the 118 points" as one paragraph pair.** First paragraph: restate the puzzle in a clause; quote "greatest return" with its products-vs-AGI continuation; replace the manufactured anomaly with #117 / "20 billion this year" / two rounds after "no financing plans"; leave it open. Second paragraph: the dated August 2026 price beat (August 6 warning; peak at 2× off-peak from August 16 per DeepSeek's August 13 note; "enabling more flexible workload scheduling"; pre-IPO), then the re-specified why-not-whether test. No old rates, no percentages (RQ-01). Mirror the new test in the Rabbit Hole and repoint the personal-life "Until then" bridge.
2. **P0-01 tense and euphemism sweep:** description, intro ¶4, TL;DR bullet 4, #91–93 lead sentence, key-stat label (add the 545% gloss and "Open Source Week, March 2025"), ending ¶2, FAQ 7 retitle + one sentence. Optional V3.2-Exp sentence if the cut list leaves room.
3. **P0-02:** "never published" → "no audited or current count; nothing disclosed since the October 2022 controls; the one 2026 figure is purported and its own moderator asked that card quantities not travel." TL;DR bullet 3 to match. Make the Alexandr Wang claim the "hide" evidence.
4. **P0-04:** Bloomberg's "frustration that the remarks had leaked" once; hedge or cut "He paid it" / "The truth cost eleven days"; delete "rather than soften a transcript"; intro makes explicit he paused it himself; TL;DR bullet 5 rewritten.
5. **P0-05:** reorder the concession paragraph so "Those facts hold" binds to the V3 paper and Fire-Flyer cost; the purported line stands alone with its label; "most aggressive accumulators of GPUs" gets a comparison class.
6. **P0-06:** "50 billion yuan" attributed to Chinese financial media with a dollar gloss (or Bloomberg's "at least 10 billion yuan"); "reopened" for "back on"; drop "and no money at all"; "under two weeks"; "2026" on the first August date in the section.

**2. Research-required decisions that can be safely resolved now:**

- **RQ-01:** one Wayback check of the pricing page (early August vs. after August 17). If the floor held, P0-01's paragraph may add "with the off-peak floor unchanged" and the title stands clean. If it rose, add the old/new output rates and make the body argue rationing-as-restraint explicitly. Either way, close RQ-01 before publish; do not publish with the question open _and_ old rates printed.
- **RQ-02:** a native read of the "非合规" sentence. If it means export compliance, P0-05 as written. If not, cut the line.
- **RQ-03:** skip unless P2-02 is wanted beyond the Bloomberg-level fact.

**3. Accepted P1 items (sentence-level; all twelve):**

P1-01 V3 license → P1-02 Xi designated speakers, seating dropped → P1-03 inner-thought setting (call, chat window) → P1-04 Luo descriptor + V3 access; Zihan Wang dual role → P1-05 Spring Festival + arch → P1-06 Six replaces One; Three closed; corpus stat rephrased → P1-07 "this year"; rounds not stress evidence → P1-08 transcript-free sentence; privacy-not-type sentence → P1-09 distillation allegation, attributed, "never adjudicated" → P1-10 crash cause sentence; three dollar glosses; 36Kr and outlets named; cold-open parenthetical trimmed → P1-11 as-of sweep → P1-12 drop "early 2023"; forum-post provenance; "investing institution"; Open Source Week credit.

**4. The one P2 that pays for itself:** P2-01, the stamp hedge (two words, zero cost, certainty matches evidence).

**5. Protected-hit regression checks (run after every edit above):**

- PROTECT-01, -04, -07, -13, -15, -16 present verbatim (`grep -c` each quoted phrase ≥ 1).
- PROTECT-02: the cold open still has the half-hour delay and "I am Liang Wenfeng."
- PROTECT-03: every clause of the concession paragraph still present, reordered only.
- PROTECT-05: the five-minute break, on-screen message, "Indeed there's still room for price cuts," cheered, inner-thought, "He had said so out loud" all present and in that order.
- PROTECT-06: the anomaly paragraph is in the body, ends open, and names a falsifier that has not yet occurred.
- PROTECT-09: "He hoards the private resource and gives away the public one." present; "publishes the map" present.
- PROTECT-10: "purported" count in body ≥ 10; no transcript quote lost its label.
- PROTECT-12: "10 months" and "545%" still in the same key-stat box.
- PROTECT-14: "A Nine smooths it; Liang ignores it." present with two dated examples.
- Lint: body ≤ 4,500 words; `scripts/blog-source-audit.mjs` still 0 vague / 0 untagged; same-type-similarity scan: the only trips are the mandated-H3 "subj subj" false positive.

Sources consulted for this synthesis beyond the review directory (three, all to settle concrete conflicts): fredgao.com full transcript translation (S03; settled P0-03, P0-05 scope, P1-03 setting, P1-07 wording, the moderator's card-quantities line); `api-docs.deepseek.com/news/news260813` (settled P0-01's primary wording and date); `api-docs.deepseek.com/news/news260424` (no pricing content; surfaced the undated "official accounts" reminder noted under P1-11). `news260806` does not resolve.
