---
artifact: perspective-synthesis
schema_version: 1
subject: Frank-Lloyd-Wright
draft_sha256: cae935d9cbcc938f60b3749cf4ab6d36336b184095e5e0136690593fe6359aab
synthesis_status: complete
delight_target: fan
p0_open: 9
p1_accepted: 17
research_required: 6
protected_hits: 14
requires_revision: true
synthesized_at: 2026-08-26T19:45:55Z
path: docs/content-analysis/perspective-reviews/Frank-Lloyd-Wright/2026-08-26_135348/synthesis.md
---

## Executive verdict

Six jurors, one verdict: **revise, do not rebuild**. Every perspective rated value `high` and delight `clear_hit`; five of six rated trust `strained`, and the durability juror — the only one to rate trust `intact` — did so because its lane has almost no surface to fail on. Nobody argued with the Type 7w8 self-preservation call. The Enneagram juror agrees with it outright and asks only for a rebuttal it is missing.

The draft's problem is narrow and consistent: **it is harder on Wright in its scenes than in its summaries.** The narration convicts him out of the external record (the Okura telegram, John Lloyd Wright's book title, the Fellowship's arithmetic), and then the topic sentences, the summarizing clauses, and the conclusion quietly inherit his edits. The failures cluster in three places a reader can check: universal claims that the article itself refutes elsewhere, interiority stated as biography, and compressed timelines doing type-discriminating work.

Nine P0 repairs. All nine are clause-level swaps or deletions, and their net word cost is **negative**, which is what funds the accepted improvements against a body sitting at 4,488/4,500. Not one of them requires abandoning the thesis, the structure, or a single protected passage.

The convergence worth acting on first: **four independent jurors — critic, subject, fan, and unfamiliar — caught the same sentence**, "Wright never named another influence on his work," and the unfamiliar reader caught it on a first pass with zero outside knowledge, because the article contradicts it 252 words earlier. When the newcomer, the expert, the skeptic, and the loyalist all stop at the same word, that is not a research gap. That is the trust break.

Three cross-cutting notes for the editor:

1. **Snapshot integrity.** `draft-reviewed.md` hashes to `362a406e…`, not the contracted `cae935d9…`. All five content jurors independently adjudicated this and reached the same answer: the drift is Prettier emphasis/quote normalization plus a `path:` line rewritten by the label-paths tooling, and a normalized diff against the live draft at freeze is byte-identical. No reviewed passage is in question. The freeze mechanism is nonetheless leaky and should exclude `docs/content-analysis/perspective-reviews/**` from format and label-paths tooling before the next run.
2. **The live draft has moved since the freeze.** A revision pass wrote `src/blog/people/drafts/Frank-Lloyd-Wright.md` at 15:39 local, after the last review completed at 15:31. I diffed it: **P0-01 and the medium half of P1-15 are already repaired live, in exactly the form the jurors specified.** All seven other P0 targets and all remaining P1 targets still match verbatim in the live file. Verify before applying; do not re-apply the two that are done.
3. **The snapshot leaks its own pipeline.** Four jurors disclosed reading the embedded `FRESH EYES REVIEW`, `SECOND PASS NOTES`, and `COHESION PASS` comments and the stale `content_quality: 9.3 / A` before they could know what they were. Their independence held — none of the nine P0s appears in those notes, and two sit inside passages the fresh-eyes pass marked protected — but future runs should strip HTML comments and the grade block from the snapshot.

## P0 — mandatory red-flag repairs

### P0-01 — "Wright never named another influence on his work" is false and the article refutes it 252 words earlier

- **Origin.** CRITIC-B1 (critic), SUBJ-R2 (subject), FAN-R1 (fan), UNFAM-R1 (unfamiliar). Four of six perspectives, three as blockers.
- **Location.** H2 "Why Wright always called Louis Sullivan 'lieber meister'", paragraph 2.
- **Passage.** "Even after Sullivan died broke and alcoholic in a Chicago hotel room in 1924. **Wright never named another influence on his work.** He treated the mentorship the way medieval saints treated relics."
- **Adjudicated problem.** A flat, checkable, false universal, sited inside the article's single most original argument and contradicted by the same article at "Wright credited those blocks for the rest of his life." It is also load-bearing: it is offered as the proof of Sullivan's singular status. A reader who catches it downgrades every claim they cannot check.
- **Evidence and confidence.** Packet CLM-08, status **contradicted**. Wright is standardly described as acknowledging three influences — the Froebel gifts, Sullivan, and the Japanese woodblock print — and wrote in _An Autobiography_, "If Japanese prints were to be deducted from my education, I don't know what direction the whole might have taken" (E-08, S-30). He also published _The Japanese Print: An Interpretation_ (1912). **Confidence: high**, on both internal and external grounds.
- **Minimum repair.** Bound the universal to persons: Wright named three influences — the blocks, the prints, and Sullivan — and only one of the three was a man. Net zero words.
- **Reader benefit.** Removes the article's most checkable falsehood, repairs an internal contradiction, and sharpens the argument the section actually needs — "the only influence with a pulse" is a stronger claim than "the only influence."
- **At risk.** PROTECT-02, the Sullivan reframe-stall passage, sits four lines below. The repair must strengthen the section, not disturb it; do not touch "the thing a Seven cannot reframe is the thing he could not afford to lose" or the "form and function are one" observation.
- **Acceptance test.** Grep reader-visible body for `never named another influence` → zero hits. The replacement is compatible with the Froebel paragraph and asserts no universal that the Japanese-print fact falsifies.
- **Status note.** **Already repaired in the live draft** as "Wright named three influences: Froebel's blocks, Japanese prints, and Sullivan. Only Sullivan was a person." Verify, do not re-apply.

### P0-02 — Three named murder victims are given the wrong occupations

- **Origin.** CRITIC-B3 (critic), SUBJ-R5 (subject), fan "What surprised me" (fan), ENN-Q4 cross-lane flag (enneagram). Four perspectives.
- **Location.** H2 "The grave Frank Lloyd Wright refused to mark", paragraph 1.
- **Passage.** "Mamah died on the lawn. Her two children died with her, along with **three apprentices** and a chore boy of thirteen."
- **Adjudicated problem.** A factual error about four murdered men, in the passage the packet explicitly instructs be handled as history rather than true-crime color. "Apprentices" flattens three working adults into interchangeable studio juniors — the exact reduction the section is otherwise arguing against.
- **Evidence and confidence.** Packet CLM-11, status **partly contradicted**; D-07 marks it settled against "three apprentices." Emil Brodelle, draftsman; Thomas Brunker, foreman; David Lindblom, gardener (Keiran Murphy, Taliesin historian, S-13; corroborated S-02). **Confidence: high.** Weston's age is disputed (13 per Murphy, 14 per Wikipedia), so the number should carry a hedge or go.
- **Minimum repair.** "…along with his draftsman, his foreman, his gardener, and a carpenter's son of thirteen." Same length; the possessives do more thesis work than "apprentices" did.
- **Reader benefit.** Removes a confirmed error and restores four men to their own occupations at the one moment the article claims to be treating them as history.
- **At risk.** PROTECT-03. The repair is one clause in the section's first paragraph; the burial paragraph and the "a marker is an address" reading must not be touched.
- **Acceptance test.** Grep body for `three apprentices` → zero hits. Every 1914 victim descriptor matches Murphy's list. Any age given carries a hedge.

### P0-03 — The article reports an on-camera admission Wright did not make

- **Origin.** SUBJ-R1 (subject, blocker), UNFAM-C11 (unfamiliar, caught unaided). Corroborated by packet E-01 independently.
- **Location.** Intro, paragraph after the brittle-shell quote; and the conclusion, penultimate paragraph.
- **Passage.** Intro: "here he was conceding on camera that the whole thing was load-bearing. **He did not believe it.** He needed _you_ to believe it, out loud, daily…" Conclusion: "**He did not believe he was the greatest.** He needed _you_ to believe it… He saw it. **He told Mike Wallace he saw it.**"
- **Adjudicated problem.** This is not offered as a reading the reader can weigh. It is reported as what a named man said to a named interviewer on a named program, and Wright is made to confess that his life's central claim about himself was false. He did not say that. The claim appears twice, in the two positions that govern how the whole piece reads, and it is the spine of the article.
- **Evidence and confidence.** Packet E-01 is explicit on what the quote _cannot_ support: "that Wright believed the arrogance was _entirely_ performance, that he was conceding his self-assessment was false… The draft's reading is **interpretation** layered on a verified quotation." Wright said "Well, it's a pretty brittle shell" — agreeing arrogance _can_ be defensive and volunteering that his own was thin. In the same interview cycle he said "Any man who really has faith in himself will be dubbed arrogant by his fellows. I think that's what happened to me." A man can hold both that he is the greatest architect alive and that his armor is thin; the draft collapses the two. **Confidence: high.**
- **Minimum repair.** Cut "He told Mike Wallace he saw it." Convert both "He did not believe it" sentences from report to reading, marked as the article's inference — the same treatment the Welsh prophecy already gets (PROTECT-14). Add one clause admitting Wright's counter-framing: he called the arrogance charge what happens to any man with real faith in himself.
- **Reader benefit.** Removes the only claim a Wright-aligned reader would call a misquotation, and gains the more interesting tension the draft is currently flattening — the argument survives and becomes an argument.
- **At risk.** PROTECT-05 (cold-open sequence) ends at "Then he hung up"; the repaired paragraph follows it and must not disturb the beat sequence. PROTECT-11 ("More so. Only more quiet about it.") is untouched.
- **Acceptance test.** No sentence states as fact what Wright privately believed about his own greatness, and none attributes that admission to the Wallace interview. Grep for `did not believe` and `he saw it` — both gone or re-marked as the article's reading. Wright's counter-framing appears once in reader-visible text.

### P0-04 — The Noel timeline is compressed past the record, in the paragraph the type case rests on

- **Origin.** ENN-B1 (enneagram, blocker), SUBJ-R3 (subject, blocker). UNFAM-C4 identifies the same sentence as the article's only passage that reads as unkind to non-subjects.
- **Location.** Diagnosis section, core reframe paragraph; and H2 "The grave Frank Lloyd Wright refused to mark", second-to-last paragraph.
- **Passage.** "When his lover was hatcheted to death in his own dining room, he rebuilt the dining room and **was in love again before the year was out**." And: "**She was living in the rebuilt house within months.**"
- **Adjudicated problem.** Speed of replacement is one of two headline exhibits for the reframe defense and the load-bearing discriminator against Type 4. The record's December 1914 event is _receipt and acknowledgment of a condolence letter_. "In love again" by 31 December 1914 is a claim about a mutual romantic state asserted as biography. The article's competitive pitch is that the aggregators do not show their work; a reader who catches it tightening a timeline to win an argument transfers that suspicion to every other type claim on the page.
- **Evidence and confidence.** Packet CLM-28 grades "inside four months" **accurate** but "She was living in the rebuilt house within months" **not confirmed**, with a competing account placing cohabitation **by 1916** (S-36) and Murphy dating no move at all. The enneagram juror confirmed by grep that "before the year was out" appears in **no** claim-inventory entry — it has never been graded. **Confidence: high** on both clauses as written.
- **Minimum repair.** Two clause-level edits, net zero words. (1) Diagnosis paragraph: he was answering a stranger's condolence letter before the year was out. (2) Mamah section: cut "within months" or give the sourced version — they met within days of the December letter; she was living with him by 1916. Do not delete the beat; the rebuild-and-answer sequence is real and is good Seven evidence. Leave the Type 4 rebuttal's "writing to a new woman inside four months" exactly as written — the packet grades it accurate.
- **Secondary requirement (UNFAM-C4).** While rewriting the diagnosis-section clause, attach a dating and scale marker — 1914, and that Mamah was one of seven killed. At present a mass murder is used as a brisk evidence clause 1,300 words before it is introduced, with a verdict on the man's grief in the same sentence.
- **Reader benefit.** The pattern is unchanged and becomes unassailable; the article stops being more certain about his heart than about his calendar, and stops reading as callous at the moment the newcomer decides whether to trust the writer.
- **At risk.** The Type 4 rebuttal depends on the four-month interval. It survives this repair intact — but see P2-07 for a stronger discriminator that does not depend on a grief clock at all.
- **Acceptance test.** Every sentence describing the Wright–Noel sequence maps to a dated documentary event (letter received, letter answered, residence) in the packet timeline or a CLM entry graded verified. No sentence asserts a mutual emotional state on a date the packet dates only a letter. The first reader-visible mention of Mamah's death carries a date and the fact that she was not the only victim.

### P0-05 — A nine-year-old is assigned a life-organizing decision, in the summing-up position

- **Origin.** SUBJ-R4 (subject, blocker), UNFAM-C11 (unfamiliar, caught unaided).
- **Location.** Conclusion, "What Wright admitted at ninety", the "cost of the Seven's defense" paragraph.
- **Passage.** "The man inside it was a boy in a parsonage who watched his father fail to provide and his mother prophesy, and **decided around age nine that the only safe thing to do was keep building**."
- **Adjudicated problem.** Two failures at once. Unrecoverable interiority stated as biography — no source can establish what Wright decided at nine, or that he decided anything. And the whole life resolved into one childhood wound, in the article's summing-up position, which is the totalizing move the piece avoids everywhere else. The load-bearing inputs (the prophecy, the age-nine Froebel moment) reach us through _An Autobiography_, which this same draft correctly told the reader is where you would expect an origin myth to live. The article applies its own standard in section 2 and abandons it in section 9.
- **Evidence and confidence.** Packet classifies the Froebel material as **attributed**, "all ultimately downstream of Wright's autobiography" (E-07, S-25), and warns structurally that "a claim sourced only to Wright is attributed claim, not verified fact, and evaluators should not let the draft's confident narration convert one into the other." **Confidence: high.**
- **Minimum repair.** Cut the clause. The preceding clause already does the work. If the causal claim is wanted, mark it as the article's reading resting on Wright's own account — the same treatment the prophecy gets.
- **Reader benefit.** The conclusion keeps its emotional landing and stops making a determinist claim the piece has already taught the reader to distrust.
- **At risk.** Nothing. This is a deletion inside a paragraph no juror protects; the paragraph's opening ("The cost of the Seven's defense…") and the Mamah callback are unaffected.
- **Acceptance test.** No sentence attributes a decision, intention, or conclusion to Wright as a child. The conclusion's causal account of his childhood carries the same attribution hedge as the Welsh-prophecy section.

### P0-06 — The porkpie hat's design intent is invented

- **Origin.** SUBJ-C6 (subject), FAN-R5 (fan), UNFAM-C11 (unfamiliar, via packet CLM-19). Three perspectives.
- **Location.** Conclusion, penultimate paragraph.
- **Passage.** "Then he put the hat back on, **the one he had shaped to mirror his own cantilevered roofs**, and went back to work…"
- **Adjudicated problem.** Written as biography, in the article's closing movement, in a piece whose entire subject is a man who improved on the record about himself. The fan juror's line is the decisive one: "A fan will repeat it. When it does not check out, the article has done to Wright what Wright did to the Imperial Hotel." That is a bad irony to be caught in on this specific page, three paragraphs after the Okura telegram.
- **Evidence and confidence.** Packet CLM-19: "**No source states that Wright shaped the hat to mirror his cantilevered roofs.**" The Frank Lloyd Wright Foundation offers "Like the eaves of a well-designed building, Wright's hat completed his personal design" as its _own simile_, not a claim about intent; Meryle Secrest credits Elbert Hubbard as the style's inspiration (S-37). **Confidence: high.**
- **Minimum repair.** Cut to "Then he put the hat back on," — eight words recovered — or keep the image and attribute it as the resemblance others have noticed, not his intention.
- **Reader benefit.** Removes a fabricated intention two sentences from the end, at negative word cost.
- **At risk.** Nothing. PROTECT-06 (the final paragraph's rhyme and last sentence) is the paragraph after this one.
- **Acceptance test.** No sentence states why Wright chose the hat's shape.

### P0-07 — "Forty-five years" rests on the minority account, and names the wrong agent

- **Origin.** SUBJ-C2 (subject), FAN-R6 (fan), UNFAM-Q4 (unfamiliar, flagged out of lane). Three perspectives.
- **Location.** H2 "The grave Frank Lloyd Wright refused to mark", the no-marker paragraph.
- **Passage.** "It stayed bare for **forty-five years**, until after his death, when **his widow Olgivanna set a headstone on it**."
- **Adjudicated problem.** A specific, checkable figure and a named agent, stated flat, in the passage doing the most emotional work in the article and the one every juror protects. The number is only correct under the minority account. It is where a hostile reader will aim.
- **Evidence and confidence.** Packet CLM-10, status **disputed, and the draft's figure is probably wrong**; D-02: "Unresolved, leaning strongly to 1985." Two independent accounts place the marking in 1985, contemporaneous with Wright's exhumation and reinterment at Taliesin West — 71 years, not 45 — against one account supporting marking shortly after April 1959. Olgivanna died 1 March 1985, which strains "his widow set a headstone" under either date. Packet risk assessment: **high**. **Confidence: high that the current phrasing is unsafe; medium on 1985 being correct.**
- **Minimum repair.** Drop the number and the agent: it stayed bare for decades, and was marked only long after his death. The thesis point — Wright's refusal held for a very long time — survives under both accounts and is the only part doing work.
- **Reader benefit.** Removes the one checkable liability from the article's emotional center without touching a word of the writing that makes it work.
- **At risk.** PROTECT-03, which four jurors rank in their top three. This repair is one sentence; Wright's quotation, the shovel, the August light, and the "a marker is an address" reading are all untouched.
- **Acceptance test.** No specific year-count and no named agent for the marking appears unless RQ-04 closes with a primary source. The Wright quotation and the address reading are byte-identical.

### P0-08 — Philip Johnson is assigned an Enneagram type on no evidence, and it is used to impugn his motive

- **Origin.** ENN-C4 (enneagram), CRITIC-C3a (critic), UNFAM-C3 (unfamiliar). Three perspectives, reached independently from three different lanes.
- **Location.** Conclusion, Philip Johnson rebuttal paragraph; repeated in the Rabbit Hole "Counterarguments".
- **Passage.** "Philip Johnson called him the greatest architect of the nineteenth century, and meant it **the way a Type 3 means most things**, as a critique dressed for dinner." And: "**Type 3.** Philip Johnson was the Three in that rivalry."
- **Adjudicated problem.** Four paragraphs after telling the reader that the aggregators type Wright 5w4 "without showing their work," the draft types a different real person in a subordinate clause with no evidence whatsoever, then repeats it as established fact to open a counterargument — and uses it to characterize the motive of the one voice the article designated as its steelman. It is ad hominem by typology aimed at the steelman, and it is the moment the article's technique and its subject's technique become the same technique. The unfamiliar juror adds a second failure: Type 3's only gloss is at 99% of the article, inside the collapsed accordion, i.e. after the reference and behind a click most readers never make.
- **Evidence and confidence.** Packet CLM-17 grades the Johnson _quotation_ verified in substance; **no packet entry, evidence item, or source supports a typing of Johnson.** The Rabbit Hole's actual Type 3 rebuttal about Wright — "Threes adapt the product to the market; Wright watched the market leave for glass boxes and changed nothing" — is, per the packet, "the sharpest counter-typing argument in the piece" and does not need Johnson typed to work. **Confidence: high.**
- **Minimum repair.** Delete both typings; keep both sentences. Conclusion: "…and meant it as a critique dressed for dinner." Rabbit Hole: open the Type 3 entry on the argument itself. Net −12 words.
- **Reader benefit.** Removes the one place where the article does the thing it accuses its competitors of, at zero argumentative cost, and removes the last jargon trip before the ending.
- **At risk.** PROTECT-08, the Johnson concession — "The jab had teeth. Its point was that he belonged to the century before this one" — is the sentence _after_ this one and must survive verbatim. The Type 3 counterargument about Wright stays.
- **Acceptance test.** No person other than the subject is assigned an Enneagram type anywhere in reader-visible text, including the Rabbit Hole. Every Enneagram type number in the body outside the Rabbit Hole is glossed at first use or is Wright's own.

### P0-09 — Research Tower construction dates are wrong, inside the article's best rebuttal

- **Origin.** FAN-R9 (fan), FUTURE-Q5 (future, flagged out of lane). Packet-confirmed.
- **Location.** H2 "What Wright meant when he told a client to move his chair", the Johnson counter-turn paragraph.
- **Passage.** "Johnson came back and commissioned the fourteen-story Research Tower, **built between 1944 and 1951**."
- **Adjudicated problem.** A flat date error inside the passage two jurors name as the article's strongest rebuttal, and the dependent rhetorical claim ("kept writing checks for fifteen years") hangs on the span. Readers who know the Johnson Wax buildings know the tower went up in the late forties.
- **Evidence and confidence.** Packet CLM-14, status **contradicted on the construction dates**: commissioned/designed 1944, built 1947–1950 — groundbreaking 6 Nov 1947, dedication 17 Nov 1950 (S-04, S-17). Neither 1944 nor 1951 is a construction year. The draft's own RESEARCH SOURCES ledger cites Wikipedia's Johnson Wax article for "1944–1951"; that article says 1947–1950. Storey count is genuinely contested (13, 14, 15 all circulate), so "fourteen-story" is defensible but must not be stated as settled. **Confidence: high.**
- **Minimum repair.** "commissioned the Research Tower in 1944; it was dedicated in 1950." Verify "fifteen years" against whichever anchors survive — 1936 Administration Building commission to 1950 dedication supports it.
- **Reader benefit.** Corrects a checkable date without weakening the rhetorical payoff it supports.
- **At risk.** PROTECT-13, "The client took the insult and kept writing checks for fifteen years." Keep the sentence and the sequence; fix only the dates it rests on.
- **Acceptance test.** The sentence gives 1944 as commission/design and 1947–1950 or the 1950 dedication as construction. The "fifteen years" figure is arithmetically supported by the anchors actually printed.

## P1 — accepted high-value improvements

Ranked by value. Word cost is noted because the body sits at 4,488/4,500 and the P0 block runs net negative, which is what pays for these.

### P1-01 — The section that promises the strongest answer to Wright's critics omits the strongest fact against him

- **Origin.** CRITIC-B2 (critic, blocker, highest-impact finding in that review). Lone juror, inside that juror's designated domain.
- **Location.** H2 "What Wright meant when he told a client to move his chair", paragraphs 1 and 3.
- **Passage.** "The leak was weather. The cantilever was the achievement. Complaining was a failure of cantilever-comprehension." → "That is the **strongest available answer** to Wright's critics, and it is not in Wright's voice."
- **Adjudicated problem.** The draft nominates its own rebuttal as the strongest available and it is not close. It defends the cantilever by asserting the cantilever was the achievement, then omits that Fallingwater's cantilever was under-reinforced by design, that Wright rejected his own consulting engineers' correction as a personal insult, that the contractor added steel behind his back, that the slab dropped 1.75 inches the day the formwork came off and deflected to nearly 7 inches by 1994, and that a ~$4M post-tensioning intervention in 2002 arrested it — separate from and prior to the $7M leak project the draft already cites. In the one section explicitly framed as facing the critics, the article selected the client anecdote that flatters. **This is not a demand for condemnation and not a request for a both-sides paragraph; the critic disclaims both.** The added facts are _better_ 7w8 evidence than what they replace: rejecting a correction as a personal insult is the 8 wing, with a documented sixty-year consequence attached.
- **Evidence and confidence.** Fallingwater's own stewards: the terraces' concrete and steel "was overstressed due to errors in the design of their reinforcement." Metzger-Richardson's independent review cracked its test specimen and proposed roughly double Wright's steel; Wright refused. **Confidence: high on the engineering facts and deflection figures** (institutional steward plus independent engineering accounts, converging). **Not packet-covered** — this is the critic's own research, read partly through search summaries. The Wright letter wording reaches the critic through secondary reporting only; see RQ-03.
- **Minimum repair, two tiers.**
  - **Floor (mandatory, free):** the phrase "the strongest available answer" is either earned or removed. If nothing else in this section changes, that superlative comes off.
  - **Full (recommended, ~70 words, funded by P1-06):** one paragraph inside the existing H2, after "The cantilever was the achievement" and before the Johnson turn — his engineers said double the steel, he refused, the contractor added it anyway, the slab sagged the day the props came out and kept sagging until 2002. **Paraphrase Wright's letter; do not quote it** unless RQ-03 closes. Then let the Johnson turn land: it is _more_ impressive, not less, that a client kept writing checks knowing this.
- **Reader benefit.** Converts the piece's weakest section into its strongest, and makes the Johnson payoff earn its billing.
- **At risk.** PROTECT-13. The Johnson counter-turn must stay the section's closing move, not be displaced by the new material. P0-09 edits the same paragraph — sequence them.
- **Acceptance test.** A reader who arrives knowing about the 2002 post-tensioning finds the article got there first. The phrase "strongest available answer" is either earned or gone. The section names at least one Wright failure Wright himself refused to concede.

### P1-02 — Type 8 as core is never addressed, and it is the reading the draft's own showcase evidence invites

- **Origin.** ENN-C1 (enneagram, highest-priority concern), CRITIC "What I expected" — "the most consequential typing omission in the piece." Packet flags the gap explicitly.
- **Location.** Rabbit Hole → "Counterarguments" (currently Type 5 and Type 3 only). Created by the body: the cold open, the whole "move your chair" H2, FAQ #2, the sixty-ton column, the Harlan House contract violation, firing his son over wages.
- **Adjudicated problem.** A reader who knows the system spends the first 400 words watching dominion behavior, then reads a headline claiming Seven-with-an-Eight-wing and is never told why the Eight is the wing rather than the core. The draft answers _which wing_ and never answers _which core_. Because the Eight-flavored material is also the most memorable material, the omission is most visible to exactly the reader the Rabbit Hole exists to serve.
- **Evidence and confidence.** Packet: "Type 8 as core rather than wing. **Not addressed anywhere in the draft**… The discriminating question is whether the underlying motive is appetite and escape (Seven) or control and non-vulnerability (Eight)." The discriminator is already published on 9takes and unused here: `/enneagram-corner/enneagram-harmonic-approaches` places 7 in Positive Outlook ("reframe, distract, minimize") and 8 in Reactive ("Feel it loud and make sure you feel it too"). That lens separates delivery from operating system — "move your chair" is _delivered_ as an Eight would deliver it and _contains_ what only a Seven would say, that the leak is not a problem. **Confidence: high** that the gap is real and material; **high** that the Harmonics lens resolves it.
- **Minimum repair.** One paragraph in the existing "Counterarguments" block beside Type 5 and Type 3, ~70 words, linking `/enneagram-corner/enneagram-harmonic-approaches`. No body change, no main-narrative word cost.
- **Reader benefit.** Closes the piece's largest typing gap, converts its most-quoted anecdote from a liability into thesis evidence, and adds an internal link to an under-linked Enneagram page.
- **At risk.** The Rabbit Hole is where the pipeline quarantines deep wing/subtype/arrow material; adding here does not touch the ≤4 body type-paragraph gate. No protected passage.
- **Acceptance test.** A reader who finishes the Rabbit Hole can state in one sentence why Wright's dominion behavior is a wing rather than a core, and can name the evidence that would have pointed to an Eight core instead.

### P1-03 — The Fellowship is explained with its co-founder written out, and the cult charge is raised and abandoned

- **Origin.** FAN-R2 (fan, blocker), CRITIC-C2 (critic). Two jurors, arriving at the same paragraph from opposite directions.
- **Location.** H2 "The years Wright cut his curtains into handkerchiefs", final two paragraphs.
- **Passage.** "That same year he and Olgivanna founded the Taliesin Fellowship… **Cynics called it a cult.** The accounting was unsentimental…"
- **Adjudicated problem.** Two failures. First, the article raises the most serious characterization of the Fellowship and answers it with an accounting non-sequitur — needing money explains why he _charged_, not why the place ran on communal labor and personal devotion. The critic's framing is exact: "it names an objection, assigns it to a discrediting class of person, and moves on inside the same sentence. It is the one moment where the draft's technique and its subject's technique become the same technique." Second, the paragraph names Olgivanna and then attributes her institution's entire design to Wright's type — while the Fellowship is the draft's _principal evidence for the self-preservation subtype_. The type claim is inflated by the omission.
- **Evidence and confidence.** Olgivanna worked with G.I. Gurdjieff for roughly seven years from 1917; **Edgar Tafel — the apprentice this draft already quotes twice** — wrote that her Gurdjieff experience "did influence the form of the Fellowship and some of the activities envisioned from the beginning" and that she "was the force that kept the Fellowship in working order, from the very start." Friedland & Zellman, _The Fellowship_ (2006), built on unpublished interviews and Wright-archive documents, is the standard critical treatment ("cult of genius"; apprentices "more often as manual laborers than as draftsmen"). **Not packet-covered** — zero hits for Gurdjieff in the packet; this is a genuine research gap, not a disagreement with it. **Confidence: high on the facts; medium on how much of the Fellowship's structure is Gurdjieff versus Wright** — which is exactly why the repair attributes rather than asserts. See RQ-05.
- **Minimum repair.** Two sentences inside the existing paragraph: name Olgivanna's years with Gurdjieff, attribute the influence claim **to Tafel by name**, and let that answer the cult line instead of the accounting. Cut "Cynics called it a cult." Keep the self-pres reading but scope it — Wright supplied the appetite for a compound; Olgivanna supplied the operating system.
- **Reader benefit.** Converts a dodged accusation into the most interesting paragraph in the section, closes the largest fan-visible research hole in the piece, and makes the self-preservation claim more credible by scoping it.
- **At risk.** CRITIC-H4 and PROTECT-09. Keep "he sold the only product still moving, which was proximity to himself" (subject to P1-16) and the unsentimental-accounting sentence as the draft's own reading; keep the curtains detail. The critic explicitly does not ask for that sentence to be softened.
- **Acceptance test.** The Fellowship paragraph names Gurdjieff, dates Olgivanna's involvement, and attributes the influence claim to Tafel by name. "Cynics called it a cult" is answered in the same paragraph or gone. No sentence elsewhere silently absorbs the Fellowship as unqualified self-pres evidence.

### P1-04 — FAQ #3 states the disputed two-hour claim flat and stacks a superlative on it

- **Origin.** ENN-C5 (enneagram), CRITIC-C8 (critic), FAN "What missed". Three perspectives.
- **Location.** `faqs:` entry 3. Body counterpart in H2 "How Fallingwater happened in two hours".
- **Passage.** FAQ #3: "The procrastination-then-flash pattern is **the cleanest Seven work signature in modern biography**." Body: "The legend has been picked apart since… the sprint was performance as much as composition."
- **Adjudicated problem.** The qualification lives in the prose and the unqualified superlative lives in the structured data that feeds FAQPage markup and AI answer surfaces — the claim is strongest exactly where the caveat cannot follow it. The article is arguing with itself in the place most likely to be extracted.
- **Evidence and confidence.** Packet D-01 leaves the two-hour design **unresolved** (Toker documents preliminary sketches and compares the story to the Gettysburg-envelope myth) and supplies the safe formulation: "conclusions drawn from 'nine months with nothing shown to the client, then a finished scheme in one morning' are safe under either account." CLM-06 grades the type claim "interpretation," risk moderate-high. **Confidence: high.**
- **Minimum repair.** Rewrite FAQ #3's final sentence onto the account no historian disputes — nine months with nothing shown, then a finished scheme in one morning — and drop the superlative. The body sentence can stand as written.
- **Reader benefit.** The article's most-extractable type claim stops depending on a fact historians dispute.
- **At risk.** FAN preserve #10 protects the body hedge "The legend has been picked apart since." Keep it; make the FAQ match it, not the reverse.
- **Acceptance test.** No FAQ answer asserts a type conclusion depending on a claim the packet marks disputed, unless the FAQ itself carries the qualification.

### P1-05 — The article's set-piece quotation carries a book-and-year the record does not support

- **Origin.** CRITIC-C9 (critic), SUBJ-C3 (subject). Two perspectives.
- **Location.** Block pull quote in the diagnosis section.
- **Passage.** "Early in life I had to choose between honest arrogance and hypocritical humility…" — Frank Lloyd Wright, _The Future of Architecture_, 1953.
- **Adjudicated problem.** This is the piece's most quotable sentence, given a precise citation it may not have earned. In an article whose thesis is that Wright manufactured a better version of his own record, a manufactured-looking citation is the specific error that costs the most — and the draft's own Vreeland handling proves it knows how to hedge.
- **Evidence and confidence.** Packet D-04: Wikiquote traces the line no further back than a **1981 anthology**; a 1958 Hugh Downs interview is also claimed; the 1953 attribution is **unconfirmed** (also E-04, S-21, CLM-04). **Confidence: high that the attribution is currently unverified; unknown whether it is wrong.**
- **Minimum repair.** Close RQ-01 first. If it confirms, the citation stands as printed. If it cannot be closed in this pass, downgrade honestly: widely attributed to Wright, earliest located printing 1981 — modelled on the Vreeland hedge.
- **Reader benefit.** Protects the piece's most-quoted sentence from being the one that gets it fact-checked, on the exact axis its thesis runs on.
- **At risk.** PROTECT-04's standard. The Vreeland hedge is the model; do not weaken it to make this one look less exceptional.
- **Acceptance test.** No quotation in the piece carries a book-and-year attribution the packet marks unverified.

### P1-06 — The Moses beat is the draft's weakest-sourced quotation and its third consecutive dominion anecdote

- **Origin.** CRITIC-C7 (critic).
- **Location.** H2 "What Wright meant when he told a client to move his chair", final paragraph.
- **Passage.** "Robert Moses, the city's most feared regulator and **Wright's cousin by marriage**, wrote: 'I don't care how many rules you have to break. The Guggenheim must be built.'"
- **Adjudicated problem.** Two issues. Evidentially, the packet located **no primary letter, date, or archive citation**, and the specific family relationship is unresolved — in an article that scrupulously hedges Vreeland, an unlocated quote from a named public official is inconsistent. Structurally, it is the third dominion anecdote in one section, arriving where a reversal should be, and it presents a powerful official instructing that safety codes be broken for a well-connected relative as a triumphant beat — directly beside P1-01, where the engineers turned out to be right.
- **Evidence and confidence.** Packet D-05: stable wording across secondary sources; **no primary source located**; relationship "unresolved at the level of specific genealogy." **Confidence: high on the provenance gap; medium on the framing**, which is a judgment call.
- **Minimum repair.** Cut or compress the beat — ~60 words, which funds P1-01. If retained, attribute as reported rather than quoted, and soften the relationship claim to "related by marriage."
- **Reader benefit.** Removes the shakiest quotation, ends the section on a reversal rather than a third repetition, and pays for the repair the section actually needs.
- **At risk.** The conclusion opens on "Moses got his way." — a bridge the cohesion pass added deliberately. **If the Moses beat is cut, that bridge must be rewritten.** Flag for the editor; the cohesion ledger documents why it exists.
- **Acceptance test.** The Moses line is gone, or carries a hedge equivalent to the Vreeland citation's. The S8→S9 transition still works.

### P1-07 — Certainty language outruns the evidence base the draft itself describes

- **Origin.** ENN-C6 (enneagram), SUBJ-C5 (subject). Two perspectives.
- **Location.** Diagnosis section, opening sentence.
- **Passage.** "Wright is a Self-Preservation Enneagram Type 7 with a strong 8 wing. **The case is straightforward once you know where to look.**"
- **Adjudicated problem.** "Straightforward" is a claim about the _difficulty_ of the call, and the article then spends two counter-typings, a Rabbit Hole, and an unread paywalled corroboration demonstrating that it is not. It sits badly beside P1-02: a case with an unaddressed strongest alternative should not be called straightforward. The overclaim is unnecessary — everything the sentence wants to do is done by the evidence that follows.
- **Evidence and confidence.** Packet CLM-30 grades the type call **hypothesis**: "Nothing in this packet establishes the type as fact, and no evaluator should treat the draft's confidence, its A-grade, or Vreeland's title as establishing it." The packet also catalogues what the Seven hypothesis does not explain — fifty years of Sullivan reverence, sixteen years of Prairie Style iteration, sixteen years on the Guggenheim. **Confidence: high.**
- **Minimum repair.** Replace with a claim about evidence rather than ease — the case rests on documented behavior rather than inference, which is true and is the actual differentiator against the aggregators. Add one clause stating what would weaken the call. The `meta_title` can stay as-is; a title stating a position is normal.
- **Reader benefit.** Certainty becomes proportional, and the sentence starts doing competitive work instead of merely asserting confidence.
- **At risk.** Nothing protected. Keep PROTECT-07, the core-fear gloss, in the paragraph below.
- **Acceptance test.** The diagnosis section states at least one thing the Seven reading does not explain, and no sentence characterizes the typing as easy.

### P1-08 — The core mechanism is contradicted by the two largest facts in Wright's career, and the reconciliation is hidden

- **Origin.** CRITIC-C1 (critic), ENN-C2 (enneagram). Two perspectives, same one-sentence fix.
- **Location.** Diagnosis section; H2 "How Fallingwater happened in two hours"; conclusion; Rabbit Hole.
- **Passage.** "Sevens avoid the slow grind and then deliver in a burst… They are intolerant of the _in-between_." Against: "a building he had spent **sixteen years** fighting for" and the Prairie Style asking him "to keep iterating on one idea for **thirty years**."
- **Adjudicated problem.** Two problems that share a repair. The load-bearing mechanism is contradicted by the draft's own facts and the reconciliation lives in a collapsed `<details>` block. And the growth line to Five is used in three separate places to absorb _all_ Five-looking evidence — the solitary geometric work, the two-hour burst, the long campaigns — which makes the call locally unfalsifiable. A reader who wanted to argue for Five finds there is no evidence the draft would accept. That is the structural failure the whole piece is positioned against, in a more sophisticated costume than the aggregators'.
- **Evidence and confidence.** Packet, "Behavior the Seven hypothesis does not explain well": the Prairie Style ran ~16 years and the Guggenheim occupied 16 years — "Both are hard to square with 'cannot tolerate the in-between.' The draft addresses this only by assigning it to the growth line to Five." **Confidence: high that the triple-use is present; medium-high that one bounding sentence is sufficient.**
- **Minimum repair.** One sentence in the diagnosis section bounding the arrow: state what Five-looking evidence would _not_ be explainable as the growth arrow — sustained conservation of attention _between_ projects, withdrawal that costs him audience, competence hoarded rather than sold — and note the record does not contain it. That reconciles the in-between mechanism and converts an unfalsifiable move into an argument, in one sentence.
- **Reader benefit.** The Type 5 rebuttal stops resting on volume and starts resting on a discriminator, and the article models the epistemics it claims over its competitors.
- **At risk.** ENN preserve #6 — the H3 "Why Frank Lloyd Wright is not a Type 5" must stay at body level and must not be demoted into the Rabbit Hole to buy words.
- **Acceptance test.** The draft states at least one observation that would have counted against Type 7 and for Type 5, and confirms the record does not contain it.

### P1-09 — Four load-bearing terms and three major nouns arrive unglossed or unplaced

- **Origin.** UNFAM-C1, C2, C6, C7, C10 (unfamiliar). Bundled because they are one juror, one class, one repair type, all clause-level.
- **Adjudicated problem.** The draft proves throughout that it knows how to introduce a proper noun before use — "Mies van der Rohe and Le Corbusier, who treated buildings as machines for living in" is a model. It just does not do it consistently, and the gaps land at the worst moments. Positions are measured, not impressionistic.
  - **`growth line`** — used once at 21%, never defined, and it is doing the whole job of reconciling "he looks like a Five" with "he is a Seven." "Wright visited. He never moved in." is elegant and opaque without it. Repair: ~9 words on first use establishing that each type maps to two others it borrows from.
  - **`Usonian`** — sole occurrence, unglossed, at 82%, in the opening sentence of the article's best section. Repair: two or three words of apposition, or delete the clause (it is a résumé beat; the cohesion ledger records the gloss was cut for budget).
  - **`Mann Act`** — unglossed at 62%; the sentence reads as surreal rather than scandalous. Olgivanna also enters mid-arrest with no relationship noun. Repair: four words on the Act, one noun for Olgivanna.
  - **`Taliesin`** — used three times as evidence (TL;DR, diagnosis) before being placed at 44%. Repair: a four-word apposition at the diagnosis-section use — his Wisconsin compound.
  - **TL;DR** — bullets 2, 3, 5 lean on Taliesin (unintroduced), Mamah's murder (uncontextualised), "Self-Preservation Sevens nest" and "the 8 wing" (undefined). It is the element most likely to be opened by exactly this reader and it inverts its own purpose. Repair: three appositions, no new bullets.
- **Evidence and confidence.** Word-offset instrumentation of the reader-visible body, reported per term. **Confidence: high** on each individually.
- **Minimum repair.** ~+17 words total, offset several times over by the P0 deletions.
- **Reader benefit.** The article's stated differentiator becomes parseable by its stated target reader, and the two stalls that sit inside the best sections come out.
- **At risk.** PROTECT-05 — do not add orienting material _inside_ the cold-open beat sequence; attach it to Wright's name or after the hang-up. PROTECT-07 and UNFAM-H3's three-clause subtype line are the models, not targets.
- **Acceptance test.** A reader with no Enneagram background can paraphrase "Wright visited. He never moved in." using only preceding text. `Usonian` is absent or glossed at first use. A reader can state what Wright was accused of and who Olgivanna was to him from the Mann Act sentence alone. First body use of "Taliesin" outside the TL;DR carries a location or category noun. Every proper noun and type term in the TL;DR is glossed in place or appears earlier.

### P1-10 — The closing line adjudicates against the visitors, and against 21 artists the draft never mentions

- **Origin.** CRITIC-C4 (critic).
- **Location.** Final paragraph.
- **Passage.** "…climbed his spiral, looking _at_ the paintings, **which was wrong**, while a building he had spent sixteen years fighting for held them up."
- **Adjudicated problem.** At the emotional peak the draft rules that people looking at art in an art museum were "wrong." In December 1956 twenty-one artists — de Kooning, Motherwell, Gottlieb, Guston, Kline, Avery, Tworkov, Ferber, Lipton among them — published an open letter to the museum's director and trustees arguing the spiral's curved walls and natural light were unsuitable for showing their work, and Wright wrote a reply. The exact constituency the building existed to serve said in print that it did not work, and the article closes by telling them they misunderstood. This is the one place the draft argues Wright's case for him at the moment of maximum reader trust.
- **Evidence and confidence.** Smithsonian Archives of American Art holds the letter and signatory list; the Guggenheim's finding aid records Wright's answer. **Confidence: high.** Not packet-covered; critic's own research.
- **Minimum repair.** Drop "which was wrong" (three words), or concede it in a half-sentence — "which twenty-one painters had told him in print was the whole problem." **Keep the "looking at / living with" echo and the last sentence untouched.**
- **Reader benefit.** The ending keeps its music and stops being the one place the draft argues Wright's case for him. Conceding it lands the thesis _harder_: a man who reframed his critics into people who did not understand him, one more time, at the very end.
- **At risk.** PROTECT-06. Two jurors list the final paragraph on their preserve lists — see Conflicts. This repair removes three words and touches neither the rhyme nor the last sentence. If RQ-06 confirms Wright's reply was itself a reframe, this becomes the article's best closing evidence rather than a concession.
- **Acceptance test.** The final paragraph either drops "which was wrong" or attributes the objection. A reader who knows about the 1956 letter does not finish thinking the article was unaware. The last sentence and the at/with echo are byte-identical.

### P1-11 — Type mechanics phrased as incapacity, converting choices into compulsions

- **Origin.** CRITIC-C6 (critic). Adjacent to SUBJ-R1/R4 and UNFAM-C11, which target the same failure mode elsewhere.
- **Location.** Mamah section; walkout section; conclusion.
- **Passage.** "sitting in that dining room with what had happened there was a condition he **could not survive** holding"; "Sevens **do not** leave one room; they leave several at once"; "The shell held because it **had to**."
- **Adjudicated problem.** The draft's best work observes behavior and infers carefully — CRITIC-H5 sits one paragraph from the first of these. These sentences assert that Wright _could not_ do otherwise, which is a claim about capacity no source can support and which quietly relocates his choices outside his agency. For a subject whose defining acts harmed identifiable people, that is the excuse-making failure mode and the strongest handhold for a reader who wants to dismiss the piece as apologia.
- **Evidence and confidence.** No source establishes capacity claims about a man dead since 1959. **Confidence: high.**
- **Minimum repair.** Swap the modality, not the content: "a condition he did not stay in long enough to feel"; "Wright did not leave one room; he left several." Free.
- **Reader benefit.** Keeps every insight, drops every unsupported claim about what Wright was capable of.
- **At risk.** PROTECT-03. The sentence being repaired is in the paragraph _after_ "a marker is an address"; do not disturb that reading.
- **Acceptance test.** No sentence in the body claims Wright was incapable of an alternative. Type language describes what he did repeatedly, not what he could not do.

### P1-12 — Three women are graded on their adequacy to Wright

- **Origin.** CRITIC-C10 (critic), **partially accepted** — see Rejected feedback for the part declined.
- **Location.** Conclusion, "cost of the Seven's defense" paragraph; walkout section.
- **Passage.** "Catherine, Miriam, and Olgivanna were each **necessary and none of them enough**." And: "Catherine refused a divorce for thirteen years."
- **Adjudicated problem.** "Necessary" and "not enough" are the subject's accounting categories and the draft adopts them without marking them, grading three real women by their sufficiency to a man. Separately, Catherine appears only as the obstacle to Wright's plans rather than as a woman raising six children alone while their father was internationally famous. The draft's _scenes_ are better than this — the John Lloyd Wright paragraph is exactly right — which makes it a summarizing habit rather than a view.
- **Evidence and confidence.** **Medium-high**; part judgment, but the categories are traceably Wright's.
- **Minimum repair.** Name what each woman actually did rather than grading them. Note that Catherine was raising six children through the thirteen years she withheld the divorce. Roughly net-zero words.
- **Reader benefit.** Removes the piece's clearest inherited-from-the-subject framing at no cost to the thesis, which survives better when the costs are visible as people.
- **At risk.** SUBJ-H2 protects "The children were the price, and one of them left a receipt" — that sentence is **not** in scope here and must survive. See Conflicts.
- **Acceptance test.** No sentence grades a person by their adequacy to Wright. Catherine appears at least once as an agent rather than an obstacle. The "children were the price" sentence and the John Lloyd Wright payoff are byte-identical and still adjacent.

### P1-13 — The reader-state prediction is falsified by the page succeeding

- **Origin.** FUTURE-C2 (future).
- **Location.** H3 "Why Frank Lloyd Wright is not a Type 5", first sentence.
- **Passage.** "If you have searched his type before, **you probably arrived holding '5w4.'**"
- **Adjudicated problem.** It asserts what the reader saw before arriving. If this page wins the `frank lloyd wright enneagram type` lane — its one open lane per the entity-gap packet — a growing share of readers arrive holding 7w8 _from this page's own snippet_, and the article opens its counter-typing section by telling them something untrue about themselves. The claim is also increasingly mediated by AI answer surfaces where "what a searcher arrives holding" shifts faster than any ranking.
- **Evidence and confidence.** The future juror verified the 5w4 field is real and unusually _static_ — editorial pages (So Syncd, Sakinorva, MBTI Lounge) rather than vote-churned profiles — so **the underlying 5w4 claim is durable and stays.** Only the reader-state prediction expires. The packet notes its SERP snapshot is "US-only, desktop, unpersonalized, one date" (S-00). **Confidence: high.**
- **Minimum repair.** State the claim instead of predicting the reader: the most common answer online is "5w4," and none of the sites that give it show their work. Net zero words; the rhetorical setup and the "show their work" payoff both survive.
- **Reader benefit.** The competitive framing stops depending on a one-day SERP snapshot and stops being self-defeating on success.
- **At risk.** ENN preserve #6 — the H3's body-level position. Unaffected by this repair. FAQ #1's "Free typology aggregators mostly say 5w4" already passes and needs no change.
- **Acceptance test.** No sentence in the body asserts what the reader searched, saw, or believed before arriving.

### P1-14 — "Gropius and Mies van der Rohe later credited" attributes crediting that is not documented

- **Origin.** FAN-R8 (fan). Packet-confirmed.
- **Location.** H2 "Why Wright walked out on six children for Mamah Borthwick", Wasmuth paragraph.
- **Passage.** "In Berlin he assembled the _Wasmuth Portfolio_, a hundred-odd lithographs that **Gropius and Mies van der Rohe later credited** for shaping the Bauhaus."
- **Adjudicated problem.** "Credited" sounds verifiable while doing unverifiable work: the influence is asserted by historians, not documented as crediting by Gropius or Mies themselves. It is the same class of error as P0-08 — a claim about two named real men's stated views, made on no located evidence. Secondarily, the drawings were substantially reworked in Fiesole in mid-1910, so "in Berlin he assembled" reads as a writer working from a summary.
- **Evidence and confidence.** Packet CLM-21 (S-11, S-28): 100 plates, 66 buildings and projects 1893–1909, Wasmuth, Berlin 1910/1911; Fiesole rework mid-1910; **direct crediting by Gropius and Mies not established.** **Confidence: high.**
- **Minimum repair.** "…a hundred plates that architectural historians credit with shaping the Bauhaus generation." Add "finished in Fiesole" if words allow — thematically useful, since Mamah was there.
- **Reader benefit.** Downgrades one verb to what the record supports and removes an outsider tell.
- **At risk.** Nothing protected.
- **Acceptance test.** The sentence no longer attributes the crediting to Gropius and Mies personally, and does not state the portfolio was assembled solely in Berlin.

### P1-15 — "Live with the waterfall" is rendered as speech and truncated

- **Origin.** SUBJ-C1 (subject). Packet-confirmed.
- **Location.** H2 "How Fallingwater happened in two hours".
- **Passage.** "'I want you to live _with_ the waterfall,' **he told Kaufmann**, 'not look _at_ it.'"
- **Adjudicated problem.** Best attestation is a **1935 letter to the Kaufmann family**: "I want you to live with the waterfall, not just to look at it, but for it to become an integral part of your lives." The draft renders it as dialogue and drops "just," the word that makes Wright's line a both/and. The article's at-versus-with reading is materially sharpened by the cut. In a piece about a man's self-presentation, tightening his sentence to fit the thesis is the wrong small liberty to take.
- **Evidence and confidence.** Packet CLM-13 / E-06 / S-29: **verified wording, disputed medium.** **Confidence: high on the medium; medium on how much the reading depends on "just."**
- **Minimum repair (mandatory).** Attribute to the 1935 letter, not to speech.
- **Restoring "just" is P2-11, not mandatory** — the pipeline's contrast-pair detector is not quote-aware, and a verbatim "not just X, but Y" would count against a ledger currently reporting zero.
- **Reader benefit.** Quote fidelity in the one place where the article's method most resembles its subject's.
- **At risk.** The "live with / look at" reading feeds PROTECT-06's closing rhyme. Attribution change only; the reading is untouched.
- **Acceptance test.** The attribution says letter, not speech, and dates it 1935.
- **Status note.** **Already applied in the live draft**, per its own ledger, dated to the 1935 letter. Verify, do not re-apply.

### P1-16 — "The only product still moving" is stated as complete when a second business was running

- **Origin.** FAN-R3 (fan).
- **Location.** H2 "The years Wright cut his curtains into handkerchiefs".
- **Passage.** "He had **one publicity windfall** in the lean stretch…" and "he sold **the only product still moving**, which was proximity to himself."
- **Adjudicated problem.** Not false, but stated as complete when it is not. Wright was America's foremost dealer in Japanese woodblock prints, sold hundreds to the Metropolitan Museum, and at times earned more from prints than from architecture, with sales repeatedly pulling him back from ruin — running underneath the exact years the draft describes as trapped. A fan reads the poverty account as selectively staged.
- **Evidence and confidence.** Frank Lloyd Wright Foundation, "Frank Lloyd Wright and the Japanese Print": "an admirer, an early and significant collector, and an active dealer across his career." Julia Meech, _The Architect's Other Passion_ (2001) is the standard work. **Not packet-covered.** **Confidence: high on the dealing career; medium on its financial weight in 1926–32 specifically** — so no number.
- **Minimum repair.** Soften "the only product still moving" to a bounded claim — the product he had left that nobody else could supply. That alone resolves the overclaim at zero word cost. Naming the print trade in one sentence is **P2-12**, worth doing if budget allows, because a parallel business run on connoisseurship and appetite is independently good Seven evidence.
- **Reader benefit.** Removes a fan-visible completeness overclaim.
- **At risk.** CRITIC-H4 protects the Fellowship accounting sentence. Soften the universal; keep the arithmetic.
- **Acceptance test.** No sentence in that section asserts the Fellowship was Wright's only remaining source of income. If the print trade is named, no figure is attached to it.

### P1-17 — The 2026 renovation claim has no reader-visible or schema-visible source

- **Origin.** FUTURE-C1 (future, highest-priority concern).
- **Location.** Frontmatter `citations:`. Body reference in H2 "What Wright meant when he told a client to move his chair".
- **Adjudicated problem.** `citations:` feeds `ArticleSources.svelte` (the reader-visible source list) and `personJsonLd.ts` → `node.citation`. Its twelve entries contain no Art Newspaper, Smithsonian, Dezeen or Archinect URL; the renovation sources live only inside the `RESEARCH SOURCES` HTML comment, which never reaches a reader. So the piece names _The Art Newspaper_ in prose as its authority and gives no way to check it. In twelve months this is simultaneously the most doubtable sentence on the page and the least verifiable — an inversion, on a page whose competitive argument is "the aggregators don't show their work."
- **Evidence and confidence.** Consumption verified at `src/lib/components/blog/ArticleSources.svelte:3`, `PeopleBlogPageHead.svelte:95`, `src/lib/utils/personJsonLd.ts:163-167`. **Confidence: high.**
- **Minimum repair.** Add `https://www.theartnewspaper.com/2026/03/16/fallingwater-endemic-leaking-problems-finally-come-to-an-end-frank-lloyd-wright` to `citations:`. One line, no body change.
- **Reader benefit.** The most perishable claim becomes among the best-sourced, and the Person JSON-LD gains the page's only 2026 citation.
- **At risk.** PROTECT-10 — the March 2026 sentence's construction (absolutely dated, reporting the project and a quoted characterization rather than an outcome) must survive verbatim. Change the citation, not the sentence.
- **Acceptance test.** `citations:` contains the Art Newspaper URL and it appears in the rendered `ArticleSources` list.

## P2 — optional opportunities

Ranked. Only P2-01 is likely to pay for itself in this revision.

- **P2-01 — Read one building as evidence for the man.** (SUBJ-C4 + FAN-R4, two jurors.) The persona title is "The Architect Who Designed Himself"; the Froebel section promises the blocks explain the work; and between those points the buildings almost never testify. Broadacre City — arguably the most Self-Preservation-Seven artifact Wright ever produced — exists only as a stress-arrow example inside a collapsed block. The move already exists once and is excellent: "live _with_ the waterfall, not look _at_ it." The obvious second vehicle is the Guggenheim — a museum with no rooms, no stopping points, a continuous ramp — which the closing line already sets up and currently spends as a gag. One paragraph, ~80 words, funded only if P1-06 and the P0 deletions leave room. Highest-value P2 by a distance: it delivers on the persona title, gives the fan a second shareable insight, and puts the argument on the only body of evidence Wright cannot have edited.
- **P2-02 — Julian Carlton's fate, one clause.** (UNFAM-C9.) The loudest question the article creates and does not answer, sited immediately before the burial passage — the best 400 words in the piece. Not a true-crime digression; a single closing clause is what _prevents_ the reader going to find the true-crime version. Under 20 words.
- **P2-03 — The wartime episode.** (CRITIC-C5.) December 1942: Judge Patrick T. Stone accused Wright of persuading Taliesin apprentices to seek conscientious-objector status; Stone had sentenced apprentice Marcus Weston to prison; a 1943 FBI field report recorded 26 Taliesin fellows petitioning the Dodgeville draft board as a group; John H. Howe spent 1943–46 in a Civilian Public Service camp. **Weston himself denied Wright influenced him** — the coercion is alleged, not established, and the denial must travel with the facts. Strongest available evidence that the compound was an ideological enclosure and not just a nest, which is the draft's own subtype claim upgraded. Largest word cost on this list; see RQ mirror in the critic's Q4.
- **P2-04 — Sharpen the SP7 discriminator in the Rabbit Hole.** (ENN-C3.) "Self-pres is the one that builds walls around the good life" is a place-metaphor; the canonical mechanism (Naranjo/Chestnut's "Keepers of the Castle") is a surrogate family of allies in which the Seven holds the privileged position. The Fellowship is a textbook instance and the evidence is already on the page. Roughly no words. Note: the body's "Sexual Sevens chase intensity; Social Sevens build movements" triad is not supported by the internal subtypes page it links — the draft is closer to canonical theory than the page is, so **fix the draft's self-containment, not the draft's accuracy**, and log the internal page for a separate refresh.
- **P2-05 — Restore Philip Johnson's self-aware form.** (CRITIC-C3b.) "The worst thing I ever said about Mr. Wright was that he was the greatest architect of the 19th century" is funnier, better sourced (a traceable 1957 _Pacific Architect and Builder_ trail per packet T-05, versus the current 2016 secondary), and makes the concession that follows land harder.
- **P2-06 — Name Toker in the body concession.** (CRITIC-C8b.) Six words. "The legend has been picked apart since" names no skeptic; naming Franklin Toker signals to a reading fan that the writer knows the literature.
- **P2-07 — A stronger Type 4 discriminator.** (ENN-M2.) The current rebuttal rests on a grief clock, which is the weakest discriminator in the piece. The record has a better one two sections away: a Four's identity is organized _around_ deficiency and longing, and Wright's autobiography systematically deletes deficiency — twelve fallow years became a chrysalis. A Four writes the lack; Wright wrote it out.
- **P2-08 — Name the Seven's passion once.** (ENN-M3.) The draft describes the _defense_ (reframe) at length and never names the _passion_. Gluttony is what makes the reframe compulsory rather than merely characteristic. One naming, once, in the diagnosis section — the reviewer pre-empts the jargon objection and I accept that scoping.
- **P2-09 — Name Silsbee.** (FAN-R7; packet D-09, "the omission is real.") "Walked into the Chicago firm of Adler & Sullivan" is Wright's own version told straight, in the section arguing that Wright's own versions are compositions. One clause. Bonus: Silsbee designed Unity Chapel for the Lloyd Joneses — the chapel whose cemetery receives Mamah two sections later.
- **P2-10 — Date the Foundation building count.** (FUTURE-C3.) "The Frank Lloyd Wright Foundation's count as of 2026 is 1,114 designs and 532 realized, though tallies vary by who is counting." +3 words. Hardening, not rescue. **Keep "though tallies vary by who is counting" — PROTECT-12 rationale.**
- **P2-11 — Restore "just" in the waterfall quote.** (SUBJ-C1, second half.) Correct on quote fidelity; carries a lint interaction (the contrast-pair detector is not quote-aware). Editor's call.
- **P2-12 — Name the Japanese print trade in the lean years.** (FAN-R3, second half.) One sentence, no figure. See P1-16.
- **P2-13 — Archive snapshots / retrieval dates for rot-prone citations.** (FUTURE-C4.) The SC Johnson corporate blog URL is the **sole** support for the cold open. `invention.si.edu` already returned HTTP 403 during packet research — citation-grade unreachability is not hypothetical here. **Partially blocked:** `web.archive.org` is not reachable from this environment, so the archive-capture half is manual. The retrieval-date half can be recorded in the `RESEARCH SOURCES` ledger now at zero cost.

## Research required before deciding

- **RQ-01 — Does _The Future of Architecture_ (1953) contain "Early in life I had to choose between honest arrogance and hypocritical humility"?**
  _Blocks:_ P1-05. _Why it matters:_ if yes, the citation stands as printed and the pull quote needs nothing. If no, the attribution must be rewritten and the corpus should be checked for the same borrowed attribution on other pages. _Source:_ the book itself (Horizon Press, 1953); a full-text search settles it in one lookup. Wikiquote's trail stops at a 1981 anthology and cannot settle it. _Safe default if unresolved:_ hedge to "widely attributed; earliest located printing 1981."

- **RQ-02 — Is "an individualistic spirit who delighted in acting out his own myth" in Edgar Tafel's text, or is it the Dover edition's jacket copy?**
  _Blocks:_ whether "Notice the verb. _Delighted._" can stand. _Why it matters:_ the draft attributes it to a named nine-year apprentice and builds an inference about Wright's _enjoyment_ of the performance on one word of it. If the word is a marketing copywriter's, the inference has no witness — and it is the draft's only direct claim that Wright enjoyed the costume, which the thesis needs. _Source:_ _Years with Frank Lloyd Wright: Apprentice to Genius_ (1979), searchable text. Packet S-31 leaves it unresolved. _Note the conflict:_ the enneagram juror ranks this passage #7 on its preserve list; the subject juror wants the tic dropped and the attribution corrected. _Safe default if unresolved:_ attribute as the book's description rather than Tafel's testimony, and drop "Notice the verb."

- **RQ-03 — What exactly did Wright write to Kaufmann when the Metzger-Richardson report came back, and where is it held?**
  _Blocks:_ whether P1-01's paragraph quotes or paraphrases. _Why it matters:_ a verified archival text would make this the single best 8-wing quote in the article — better than "move your chair," because it has consequences in structural terms. Unverified, the repair must paraphrase. _Source:_ Franklin Toker, _Fallingwater Rising_ (2003); the Kaufmann–Wright correspondence at Avery Library / the Frank Lloyd Wright Foundation Archives. _Safe default:_ paraphrase. **Do not present the letter wording as archival.**

- **RQ-04 — When was Mamah Borthwick's grave marked, and by whom?**
  _Blocks:_ nothing — P0-07's repair (drop the number and the agent) is safe under every account and should proceed regardless. _Why it still matters:_ if 1985 confirms, **seventy-one years** is a materially stronger number for the article's argument than forty-five, and could be restored with a citation. _Source:_ Keiran Murphy (already cited in the packet for the 1914 material and the specialist most likely to have addressed the marker directly); the Unity Chapel cemetery association; Taliesin Preservation archive. Packet D-02, S-19, S-22.

- **RQ-05 — How much of the Taliesin Fellowship's daily form is Gurdjieff, and how much is Wright?**
  _Blocks:_ the scope of P1-03. _Why it matters:_ if the Gurdjieff influence is as structural as Tafel implies, the self-preservation claim needs scoping — the compound instinct is Wright's, the institution's operating design substantially Olgivanna's, and the Fellowship becomes weaker self-pres evidence than the article currently treats it as. If it is decorative, P1-03 shrinks to a one-sentence context add. _Source:_ Friedland & Zellman, _The Fellowship_ (2006); Tafel's _Years with Frank Lloyd Wright_ (1979) for the first-person version — which would also settle RQ-02. _Safe default:_ attribute to Tafel by name rather than asserting.

- **RQ-06 — Did Wright publicly answer the 21 artists' 1956 open letter, and what did he say?**
  _Blocks:_ whether P1-10 is a concession or an upgrade. _Why it matters:_ the Guggenheim finding aid records a Wright answer. If his reply is a reframe — recasting the objection as the artists' failure to understand — it belongs in the conclusion and is the strongest possible final piece of evidence for the thesis, converting a fairness repair into the article's best closing beat. _Source:_ Guggenheim Museum Archives finding aid, "FLW to HFG re: enclosing FLW's answer to 21 artists open letter"; Smithsonian Archives of American Art, letters and clippings relating to the Solomon R. Guggenheim Museum, 1956–1958.

## Conflicts and editorial tradeoffs

**C-1 — The closing verdict: protected by two jurors, indicted by one.**
Fan preserve #4 and unfamiliar preserve #10 both list the final paragraph — including "looking _at_ the paintings, which was wrong" — as must-survive. The critic wants the verdict clause off. _Resolution:_ accepted as P1-10 with a hard boundary. What the fan and unfamiliar jurors actually praise is the _callback mechanics_ — the at/with echo from Fallingwater, the chair from the cold open, the spiral as a room you cannot stop moving through — and the last sentence. None of that is carried by the three words "which was wrong." The repair removes three words and touches neither. If RQ-06 confirms Wright reframed the artists' objection, this stops being a tradeoff entirely and becomes the article's strongest ending.

**C-2 — "The children were the price": the subject juror's hit is the critic's concern.**
SUBJ-H2 preserves it — "The word 'price' does real work — it concedes that someone paid. Most sympathetic personality writing about difficult men fails exactly here." CRITIC-C10 wants it rewritten as accounting-in-Wright's-currency. _Resolution:_ the subject-fairness lane governs, and the subject juror is right that "price" concedes rather than excuses. **Rejected** for that sentence; **accepted** (P1-12) for "necessary and none of them enough," which grades three real women on sufficiency and has no defender.

**C-3 — The Vreeland paragraph: relocate or protect?**
UNFAM-C8 wants it compressed and moved out of the 11–24% abandonment stretch. ENN-H4 and FUTURE-H4 both rank the paywall disclosure among the article's top trust signals, in reader-visible body position. _Resolution:_ **rejected** — see Rejected feedback. The disclosure's value is that a body reader encounters it; moving it to the Rabbit Hole trades a demonstrated trust gain for a modeled retention gain.

**C-4 — Cutting the Moses beat breaks a bridge the cohesion pass built.**
The conclusion opens "Moses got his way." — a deliberate S8→S9 transition documented in the COHESION PASS ledger, replacing a non-sequitur. P1-06 may remove its antecedent. _Resolution:_ the trade is worth it (D-05: no primary source located for the quotation, and it funds P1-01), but **the editor must rewrite that opener in the same pass.** Do not cut Moses and leave the bridge dangling.

**C-5 — The subtype triad is protected by the newcomer and questioned by the expert.**
UNFAM-H3 holds "Sexual Sevens chase intensity; Social Sevens build movements. Self-Pres Sevens build _compounds_" up as the teaching model the rest of the article's jargon should follow. ENN-C3 notes two of the three discriminators are unsupported by the internal subtypes page the draft links. _Resolution:_ the enneagram juror verified the draft is _closer to canonical theory_ than the internal page — so the fix belongs in the Rabbit Hole (P2-04), and the body triad stays. Log `src/blog/enneagram/enneagram-instinctual-subtypes.md` for a separate refresh; it is not this draft's job. **Note:** the live draft has since deleted this triad. If it stays deleted, UNFAM-H3's protection is moot and the Rabbit Hole carries the whole subtype discriminator — which raises P2-04's priority.

**C-6 — Word budget is the binding constraint on every addition.**
Body sits at 4,488 against a 4,500 ceiling (the fan juror measured 4,505 reader-visible). The nine P0 repairs run **net negative** — P0-06 alone recovers eight words, P0-08 twelve. P1-06 frees ~60 more. That is the entire budget for P1-01 (~~70), P1-09 (~~+17), P1-03 (~2 sentences) and P2-01 (~80). **They do not all fit.** Priority order if forced: P1-01 > P1-03 > P1-09 > P2-01. P1-02 costs nothing from the body — it lives in the Rabbit Hole.

**C-7 — `date` / `lastmod` are stale and that is DJ's call, not the editor's.**
FUTURE-C5 correctly observes the draft carries `date`/`lastmod`/`graded_at` of 2026-05-13 after being substantially rebuilt on 2026-08-26, with `changefreq: monthly` and a March 2026 news anchor. Published as-is it ships ~3.5 months stale. **The editor must not change `lastmod`** — it is user-managed by standing rule. Surface at publish time as a decision, not a repair.

**C-8 — The frozen snapshot and the live draft have diverged.**
A revision pass wrote the live draft at 15:39, after the last review at 15:31. P0-01 and P1-15's mandatory half are already fixed live in exactly the specified form. All other P0/P1 targets still match verbatim. **Verify each target string before applying; do not double-apply.** The snapshot's `content_quality: 9.3 / A` block is three months stale and was not adopted by any juror.

## Rejected feedback

- **Relocate or compress the Vreeland corroboration paragraph** (UNFAM-C8). Rejected. Two other jurors independently rank the paywall disclosure — "take it as corroboration of a label and nothing further. We have read only the title and the opening lines" — among the article's top trust signals _because_ it sits in reader-visible body prose. The retention argument is explicitly modeled, not measured, and the reviewer holds it at medium confidence. Moving a trust signal behind an accordion to buy unmeasured retention is the wrong trade on a page whose competitive claim is that it shows its work. The caveat stays where it is, verbatim.
- **Rewrite "The children were the price, and one of them left a receipt"** (CRITIC-C10, first item). Rejected. The subject-fairness juror — whose lane this is — reads "price" as the concession that someone paid, and names it as the place most sympathetic writing about difficult men fails. The critic's underlying concern is real and is accepted where it has no defender (P1-12). Changing this sentence would cost a genuine fairness hit to fix a framing the fairness reviewer independently endorsed.
- **Move the Type 3 counterargument out of the Rabbit Hole into the body** (ENN-P1). Rejected — as its own author recommends. The DISTRIBUTION LEDGER shows the Rabbit Hole is where the pipeline deliberately quarantines deep counter-typing material, the body is at the ≤4 type-paragraph gate limit, and there are 12 words of headroom. This is arguing against the format, not against this draft.
- **Change `date` / `lastmod` to reflect the 2026-08-26 rebuild** (FUTURE-C5). Rejected as a revision action and routed to DJ as a publish-time decision. `lastmod` is user-managed by standing rule; no automated pass may touch it. The observation is correct and worth surfacing; the edit is not the editor's to make.
- **Restructure the walkout section's chronology** (UNFAM-C5). **Deferred**, not rejected. The 1893 → 1909 → 1893 → 1909 double-back is objectively present and the reader effect is credible. But that opener is a bridge the COHESION PASS built deliberately, and its ledger records that building it _removed_ a duplicate 1893 explanation. Reopening a documented structural decision to fix a legibility seam is not worth it in a revision already carrying nine P0s. Revisit at the next refresh with the cohesion ledger in hand.
- **Add a "critics say" both-sides paragraph to the "move your chair" section.** Rejected pre-emptively, and the critic disclaims it explicitly: "I am not asking for condemnation, for a 'critics say' both-sides paragraph, or for the thesis to be softened." P1-01 adds _facts with consequences_ that strengthen the 7w8 case. Anyone implementing it should not reach for balance language.
- **Encyclopedic building coverage, the courtroom "greatest architect in the world" story, and "that's how you can tell it's a roof."** Not requested by any juror, and the fan juror explicitly praises their absence: "That is a writer who knows which Wright stories are load-bearing and which are barnacles." Recorded here so a later pass does not add them back under the banner of P2-01, which asks for _one_ building read as evidence, not a catalogue.
- **Soften "he sold the only product still moving, which was proximity to himself" into euphemism.** Rejected. CRITIC-H4 preserves this as the article naming a revenue model rather than a pedagogy, in its own voice. P1-16 bounds the universal ("only") without touching the unsentimental accounting, and P1-03 explicitly keeps it.

## Protected hits

Ranked by what the article loses if it goes. Every P0/P1 repair above names which of these it sits beside.

- **PROTECT-01 — The Okura telegram paragraph, verbatim**, including "He did not add the missing words 'considerable damage notwithstanding.' Catastrophe converted to marketing copy in one news cycle." _All five content jurors named it._ The only major evidence in the piece that does not depend on Wright's testimony about Wright; the mechanism visible in real time. **If anything is cut for the word ceiling, this is the last line to go.**
- **PROTECT-02 — The Sullivan reframe-stall section, entire**, including "The thing a Seven cannot reframe is the thing he could not afford to lose" and the _form follows function_ → _form and function are one_ observation. Critic H3, subject H4, enneagram H2, fan H1, unfamiliar preserve #7. The article's reason to exist and the least Googleable thing on the page. P0-01's repair sits four lines above it and must strengthen it, not disturb it.
- **PROTECT-03 — The burial passage and the marker reading**, from "So I cut her garden down" through "He would fill the grave with his own hands and then make certain there was nowhere to go back to." Critic H5, subject H5, enneagram H1, fan H3, unfamiliar H4. Keep both paragraphs _together_; severing them turns a felt observation into an assertion. P0-02 and P0-07 each edit one sentence inside this section and nothing else.
- **PROTECT-04 — The Vreeland paywall hedge, verbatim.** "The essay is paywalled, so take it as corroboration of a label and nothing further. We have read only the title and the opening lines." Critic, enneagram H4, future H4. **Do not let a later pass upgrade this to "an independent expert agrees."** It is the model every other citation in the piece should follow.
- **PROTECT-05 — The cold-open sequence through "Then he hung up."** Fan preserve #5, unfamiliar H1. The only thing in the article that works on a reader with zero context, and it buys the patience the diagnosis section spends. Add orienting material _after_ the hang-up or attached to Wright's name — never inside the beat sequence.
- **PROTECT-06 — The final paragraph's "looking _at_ / living _with_" rhyme and last sentence.** "He had finally built a room nobody could ever move their chair out of." Fan preserve #4, unfamiliar H8. P1-10 removes three words from the middle of this paragraph and nothing else.
- **PROTECT-07 — "A Seven's core fear is being trapped: in pain, in limitation, in any state that cannot be escaped through the next thing. The defense is reframe."** Unfamiliar H2. The load-bearing sentence for every newcomer; without it the article is unreadable to its stated audience. If the diagnosis section must be cut for length, cut around this.
- **PROTECT-08 — The Philip Johnson concession.** "The jab had teeth. Its point was that he belonged to the century before this one. He knew it, kept performing anyway, and kept winning." Critic H2. Naming that the strongest critic was substantively right, and that Wright knew it, is what separates analysis from fan writing. P0-08 touches the sentence _before_ this one, not this one.
- **PROTECT-09 — Curtains cut into handkerchiefs.** Fan preserve #9, unfamiliar preserve #6, critic, subject. Concrete, dated, and it does more than any theory sentence near it. _Caveat:_ packet CLM-24 notes the source says "reputedly" and does not attribute it to apprentices — keep the detail, correct the attribution if the words are free.
- **PROTECT-10 — The March 2026 Fallingwater sentence's construction.** Future H1. Absolutely dated, and it reports the _existence of a project_ plus a _quoted characterization_ rather than an outcome — which is why it is as true in 2037 as in 2026. Change the citation (P1-17), not the sentence.
- **PROTECT-11 — "That I'm more so. Only more quiet about it." and its distance from the brittle-shell line.** Fan preserve #6, subject, enneagram. Pulling two admissions from one broadcast and spending them 4,000 words apart is the best structural decision after the cold open. P0-03 does not touch this.
- **PROTECT-12 — John Lloyd Wright and _My Father Who Is on Earth_, unexplained.** Fan H6, subject H2. Two sentences, no commentary, and the abandonment thread set up 1,500 words earlier finally closes. **Do not explain the title.** Also protected: the hedge "though tallies vary by who is counting" on the building count (future preserve #3).
- **PROTECT-13 — "The client took the insult and kept writing checks for fifteen years."** Fan H5, unfamiliar H6. Answers the newcomer's unspoken "was he actually good?" with a commission history instead of an adjective, so the article's defense of Wright is not in the article's own voice. P0-09 fixes the dates inside it; P1-01 must not displace it from the section's closing position.
- **PROTECT-14 — The Welsh-prophecy attribution.** "At least, that is the story her son told" and "a book whose whole subject is self-invention is exactly where you would expect an origin myth to live." Subject H1: "the single most subject-fair move in the draft." This is the **standard** P0-03 and P0-05 must be brought up to, not merely a passage to preserve.

## Revision brief

Ordered, bounded worklist. Estimated total body word delta before P1-01 and P2-01: **negative**.

**Step 0 — Before touching anything.**
Verify each target string in `src/blog/people/drafts/Frank-Lloyd-Wright.md`, not in the snapshot. P0-01 and P1-15's mandatory half are **already applied live**; every other target still matches verbatim. Do not double-apply.

**Step 1 — P0 repairs, in this order.** All clause-level. Net word cost negative.

1. P0-02 — victim occupations → draftsman / foreman / gardener / carpenter's son. (Inside PROTECT-03; touch nothing else in that section yet.)
2. P0-03 — Wallace overreach: cut "He told Mike Wallace he saw it"; mark both "He did not believe it" sentences as the article's reading; add Wright's counter-framing once.
3. P0-04 — Noel timeline: both clauses to the sourced version; attach 1914 and the seven-dead scale marker to the diagnosis-section mention. Leave "inside four months" in the Type 4 rebuttal alone.
4. P0-05 — cut "and decided around age nine that the only safe thing to do was keep building."
5. P0-06 — cut "the one he had shaped to mirror his own cantilevered roofs." (−8 words)
6. P0-07 — drop "forty-five years" and the Olgivanna agent; "bare for decades, marked only long after his death."
7. P0-08 — delete both Philip Johnson typings, keep both sentences. (−12 words)
8. P0-09 — Research Tower: 1944 commissioned, 1950 dedicated; re-check "fifteen years."
9. P0-01 — verify only (already live).

**Step 2 — Research-required decisions that can be safely resolved now.**

- RQ-01 (one lookup in _The Future of Architecture_, 1953) → closes P1-05. If it cannot be closed, apply the Vreeland-style hedge and move on.
- RQ-03 → **do not attempt to resolve; apply the safe default.** P1-01 paraphrases Wright's letter. Never present the wording as archival.
- RQ-04 → optional. P0-07 is safe either way; only pursue if you want to restore "seventy-one years" with a citation.
- RQ-02, RQ-05, RQ-06 → carry forward. Apply their safe defaults (attribute as the book's description; attribute the Gurdjieff claim to Tafel by name; make P1-10 a concession rather than an upgrade).

**Step 3 — Accepted P1 items, in priority order.** Stop when the word budget binds; the ordering is the ranking.

1. P1-06 first — cut/compress the Moses beat and **rewrite the "Moses got his way." opener in the same edit** (C-4). This funds what follows.
2. P1-01 — the cantilever paragraph (or, at minimum, retire "the strongest available answer").
3. P1-02 — the Type 8-as-core rebuttal in the Rabbit Hole. **Costs nothing from the body budget; do this regardless.**
4. P1-03 — Olgivanna/Gurdjieff attribution; cut "Cynics called it a cult."
5. P1-04 — FAQ #3 onto the account no historian disputes.
6. P1-07, P1-08 — certainty proportionality and the bounding sentence. Two sentences, both in the diagnosis section; do them together.
7. P1-09 — the five newcomer glosses (~+17 words).
8. P1-10 — drop "which was wrong."
9. P1-11, P1-12, P1-13, P1-14, P1-15, P1-16 — free or net-zero; batch them.
10. P1-05, P1-17 — the citation repairs (one hedge, one `citations:` line).

**Step 4 — One P2, only if it pays for itself.**
P2-01 — read the Guggenheim spiral as evidence for the man, ~80 words, **only if Steps 1–3 leave the body under 4,500.** It is the one P2 that discharges a promise the article makes in its own persona title. If the budget does not allow it, log it for the next refresh and take P2-02 (Carlton's fate, <20 words) instead.

**Step 5 — Protected-hit regression checks.** Run before declaring done.

- [ ] Okura telegram paragraph byte-identical, including "considerable damage notwithstanding." **(PROTECT-01 — the single most important check on this list.)**
- [ ] Sullivan section: "the thing a Seven cannot reframe…" and "form and function are one" byte-identical; P0-01's sentence is bounded to persons.
- [ ] Burial passage: "So I cut her garden down" → "nowhere to go back to" byte-identical apart from P0-02's clause and P0-07's sentence; the two paragraphs remain adjacent.
- [ ] Vreeland hedge verbatim; not upgraded, not relocated.
- [ ] Cold open through "Then he hung up." unedited; no orienting clause inserted inside the beat sequence.
- [ ] Final paragraph: the at/with rhyme and "a room nobody could ever move their chair out of" byte-identical; only "which was wrong" removed.
- [ ] Core-fear gloss ("A Seven's core fear is being trapped…") verbatim.
- [ ] "The jab had teeth…" verbatim; only the Type 3 clause before it removed.
- [ ] Curtains-into-handkerchiefs present; "More so. Only more quiet about it." present and still ~4,000 words from the brittle-shell line.
- [ ] March 2026 sentence verbatim; only `citations:` changed.
- [ ] John Lloyd Wright book title present and still unexplained; "though tallies vary by who is counting" present.
- [ ] "The client took the insult and kept writing checks for fifteen years." still closes its section.
- [ ] "At least, that is the story her son told" verbatim — and P0-03/P0-05's repairs now meet the same standard.
- [ ] `lastmod` unchanged. Body word count re-measured with `scripts/blog-quality-report.mjs`, not by hand or by ledger.
