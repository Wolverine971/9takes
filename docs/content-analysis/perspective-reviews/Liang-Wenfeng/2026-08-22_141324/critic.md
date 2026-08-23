---
artifact: perspective-review
schema_version: 1
subject: Liang-Wenfeng
perspective: critic
draft_sha256: 90cbfd2f54b76bb32e5af49e38cb26a6f8f1984ea949618feb979e2efd8bf728
review_status: complete
trust: strained
value: useful
delight: clear_hit
recommendation: revise
blockers: 1
concerns: 10
reviewed_at: 2026-08-22T19:28:25Z
path: docs/content-analysis/perspective-reviews/Liang-Wenfeng/2026-08-22_141324/critic.md
---

# Critic review: Liang Wenfeng (frozen draft 90cbfd2f…8bf728)

Standpoint: fair-minded skeptic. Central question: has the article earned its sympathetic interpretation? SHA of `draft-reviewed.md` verified against `context.json` and the supplied argument. No other perspective files were read.

## Bottom-line verdict

This draft does more honest work against its own thesis than most 9takes people pieces: it quotes Alexandr Wang and Musk, concedes the GPU-accumulation facts outright, prints the 545% margin disclosure next to the ten-month payback, and leaves the 2023-curiosity-versus-2026-return anomaly unresolved with a stated falsification test. A skeptic reading the catfish section would say the writer has heard the strongest case and not flinched.

The problem is that the falsification test the draft proposes has already fired, and the draft does not know it. DeepSeek announced a "significant" API price increase on August 6, 2026, and moved to peak/off-peak billing effective August 16, with peak rates at double the off-peak rate on DeepSeek's own pricing page as of today. The draft is dated August 22. Its TL;DR says the API is "set to pay back its servers and no more" when "it could charge double," its signature section builds on the ten-month payback, and its closing beat says "If the API price goes up after the IPO, the restraint was a phase." The price went up before the IPO, six days before publication, and the article's pricing claims are all in present tense. That is an already-misleading temporal claim sitting on the exact passage the thesis names as its own test. It is the one blocker.

Beneath it sit ten concerns that share a pattern: the draft repeatedly shows the disconfirming evidence and then frames around it. It quotes "give up some things to exchange for more of other things" and calls that "takes less." It knows Bloomberg's reported reason for the funding pause and writes "The truth cost eleven days. He paid it." It displays the GPU counts he published in a timeline and then says he "has never published" the number of cards. None of these is a factual fabrication; each is a flattering gloss that the draft's own evidence does not support. Fix the blocker, unwind the three or four strongest glosses, and the sympathetic reading will be earned rather than asserted.

## What landed

**CRITIC-H1. The concession paragraph.** Catfish section: "Concede the core of it. The $5.6 million was one training run, stated as such in the V3 paper; High-Flyer had spent about a billion yuan on Fire-Flyer 2 alone. The purported 2026 transcript has him telling investors 'we can buy some non-compliant cards.' A man who presents himself as restrained was, on the evidence, one of the most aggressive accumulators of GPUs in China. Those facts hold, and no personality lens dissolves them." This is a real steelman, not a straw one: it takes the critics' strongest factual claim, confirms it from the subject's own documents, and refuses to let the lens excuse it. It must survive revision unchanged; it is what makes the rest of the piece credible to a skeptic.

**CRITIC-H2. The key-stat box carries its own counter-number.** "10 months — the hardware payback DeepSeek prices its API to, per the purported 2026 transcript; the company's own March 2025 disclosure put its theoretical daily margin at 545%." Placing the 545% figure inside the restraint stat, rather than burying it, is exactly the kind of disclosure a critic expects and rarely gets. Keep the pairing.

**CRITIC-H3. The anomaly left open.** Close of "Four of the 118 points": "Either curiosity is the motive and return-on-attention is the discipline that guards it, or the second sentence is what the first one turns into once the experiment starts paying. The test is simple." Naming a concrete disconfirmer is the most intellectually honest move in the file. It needs updating (see CRITIC-R1), not removal.

**CRITIC-H4. Purported, every time.** Each transcript quote is tagged purported; the intro states that DeepSeek has never confirmed the document and that one investing institution vouched to NBD. The draft never slides from "the document has him say" into "he said." That discipline holds through all eleven tags.

**CRITIC-H5. The Chengdu failures and the 2021 drawdown are in the body, not a footnote.** "spent the next few years applying AI to one field after another and failing at each" and "after its worst drawdown on record, High-Flyer published an apology." A skeptic wants setbacks on the record before the mythology; they are.

## What missed

**CRITIC-M1. "Nobody gets the flattering version."** Close of the catfish section. The promise is that the subject's candor spares no one. But the draft itself hands him a flattering version one section later: the funding pause becomes "what telling investors the truth about the gap with America cost him. He paid it" (TL;DR) and "The truth cost eleven days and no money at all. He had already priced it" (118-points). The reported reason is his frustration that private remarks leaked (CRITIC-C1). The line promises unsparing treatment and the piece then spares him.

**CRITIC-M2. The empathy turn through "originality and imitation."** "Cheap tokens and blunt assessments are what it looks like when a man who spent his twenties failing in a rented room decides the imitation stops with him." For a reader who followed January 2025, the single most-circulated charge against DeepSeek was that it imitated: OpenAI and Microsoft investigated alleged distillation of OpenAI outputs, and the White House AI adviser said there was "substantial evidence" for it. The turn depends on the reader not knowing that, so for the reader who does, it does not land (CRITIC-C6).

**CRITIC-M3. "Walked away from the difference."** Intro: "he built the most mispriced asset in his industry ... and walked away from the difference." The draft's own ending says the market "set it for him: $36 billion." He did not walk away from the difference; he took it in valuation instead of revenue, which is the standard land-grab trade. The intro promises renunciation and the evidence delivers deferral (CRITIC-C2).

## What I expected

- **The strongest case against restraint from inside the same document.** The 118-point transcript contains "If the AI era will produce many trillion-level companies, I think we're one of them" (#117) and the wish to spend 20 billion yuan on procurement. The draft quotes #4, #11, #37, #42, #46, #91–93 and the "greatest return" line, and relegates the procurement wish to the Rabbit Hole and #117 to nowhere. A critic expects the one remark that most directly contradicts "takes less" to appear where the four supportive points do.
- **Disclosure of witness interest.** Luo Yonghao had received V3 access help from Liang before praising him; Zihan Wang is a former DeepSeek researcher who also produced the 2023 interview translation the draft quotes throughout; the hometown teachers are quoted from celebratory local coverage in the week of R1. None of that is disqualifying, and none of it is disclosed.
- **Power context on the funding structure.** Who got equity and who got a lock-up is part of "restraint toward investors."
- **One sentence on what the published model withholds.** The draft builds a "publishes the map" thesis without noting the most widely reported Western criticism of the product: state-aligned refusals in the model and government-device bans in several countries. It is product criticism rather than personality evidence, so I have not numbered it as a concern, but a skeptic will notice the thesis sentence "He does not hide his wealth, his pricing, or his opinion of China's lag" and ask what the product hides.

## What surprised me

- **Welcome:** the timeline's 2026 row quoting the purported "roughly 20,000 H-equivalent cards ... basically all Nvidia" directly under the Oct 2022 ban row. The draft lets the reader do the arithmetic on post-ban accumulation without editorializing. That is braver than most treatments.
- **Welcome:** "He used the money to need less" is a genuinely non-obvious reframe of a billionaire that the evidence (no outside capital until 2026, no sales staff, no consumer products) partly supports.
- **Jarring:** "The machine had done the one thing its owner refuses to do. It reached for more, and the firm said sorry for it in public." The event was a record drawdown of clients' money, and the personal apology in the Chinese press is attributed to High-Flyer's then-CEO, not to Liang. Using it as a founder-virtue beat is the one place the draft's sympathy reads as unearned on its face (CRITIC-C8).
- **Jarring:** the TL;DR bullet "Eleven days: what telling investors the truth ... cost him. He paid it." That is the draft's most quotable line and its least supported.

## Red flags

### CRITIC-R1 (BLOCKER): the draft's own falsification test has already fired, and every pricing claim is in present tense

- **Passages:** Description ("price DeepSeek to a ten-month payback"); TL;DR bullet "**Priced to cost:** DeepSeek's API is set to pay back its servers and no more, per the purported transcript, when it could charge double and lose almost no demand"; 118-points "#91 to #93. The price. DeepSeek's API price is set so that a batch of servers pays for itself in ten months"; key-stat box; the break scene "Indeed there's still room for price cuts"; closing beat "The test is simple. If the API price goes up after the IPO, the restraint was a phase"; Rabbit Hole "A post-IPO price hike is the evidence that would change this call"; ending "a lab that charges ten months of hardware and no more."
- **Reader effect / trust problem:** A reader who checks DeepSeek's pricing page on the day this publishes finds peak/off-peak billing with peak rates at double the off-peak rate, and a notice of a further adjustment effective August 23. Trade press reported on August 6 that DeepSeek warned developers of a "significant" price increase, effective August 16. The article, dated August 22, describes the pre-hike regime as current, presents "could charge double" as a hypothetical when peak pricing is now literally double, and names as its future test an event that has already happened. Once the reader notices, every other present-tense claim in the piece is suspect.
- **Evidence:** DeepSeek API pricing page (api-docs.deepseek.com/quick_start/pricing), fetched 2026-08-22: deepseek-v4-flash input cache-miss $0.22 off-peak / $0.44 peak, output $0.66 / $1.32; deepseek-v4-pro input cache-miss $0.66 / $1.32, output $1.98 / $3.96; peak windows 01:00–04:00 and 06:00–10:00 UTC; "Effective August 23, 2026 (Beijing Time), off-peak rates applying throughout the day on weekends." Secondary: aipricing.guru (announcement August 6, effective August 16 16:00 UTC; pre-hike V4-Flash $0.22/$0.66, V4-Pro $0.66/$1.98); Dataconomy August 6 headline "DeepSeek Warns Developers Of Significant API Price Increases"; Quartz August 13 headline "DeepSeek raising API prices by up to 1,100% starting Aug. 16." I could verify structure and dates at the primary source; I could not fetch Quartz or Dataconomy, so the "1,100%" magnitude (likely the cache-hit tier) is unverified by me and should not be used without checking.
- **Note on fairness:** the hike is readable two ways. Reported context is that V4-Flash usage overwhelmed compute (8 trillion tokens in one day on August 1 per Dataconomy's summary), which makes peak pricing rationing rather than profit-taking and is arguably consistent with the transcript's "demand is inelastic" remark. Off-peak rates appear to equal the prior flat rates. The thesis can survive this. The silence cannot.
- **Minimum viable repair:** (1) Add one dated paragraph at the close of "Four of the 118 points," before or replacing the "test is simple" line: DeepSeek announced a significant price increase on August 6, 2026 and moved to peak/off-peak billing on August 16, with peak at twice the off-peak rate, citing demand that outran compute; then restate the test in terms that remain open (e.g., whether off-peak stays at the old rate, whether the ten-month rule is abandoned after the IPO, or whatever the editor judges still discriminates). (2) Rewrite the TL;DR "Priced to cost" bullet so "could charge double" is not a present-tense hypothetical. (3) Change the Rabbit Hole's "A post-IPO price hike is the evidence that would change this call" to whatever the new test is. (4) Re-check "charges ten months of hardware and no more" in the ending.
- **Expected benefit:** converts the draft's best honesty move from a liability into the piece's most current beat; a critic who arrives knowing about the hike sees the writer got there first.
- **Confidence:** high that the pricing change is real and predates the draft (primary source); medium on magnitude.
- **Acceptance test:** the published body contains an absolute date for the August 2026 price change and the words "peak" or "off-peak" (or an equivalent description), the TL;DR no longer says the API "could charge double" as a hypothetical, and the stated falsification test is one that has not already occurred.

## Specific improvements

### CRITIC-C1. The funding pause is motive-laundered from "frustration" into "the price of candor"

- **Passages:** TL;DR "**Eleven days:** what telling investors the truth about the gap with America cost him. He paid it."; 118-points "The truth cost eleven days and no money at all. He had already priced it."; Rabbit Hole counterarguments "froze his own funding round rather than soften a transcript"; stress-arrow paragraph "The July funding pause reads as the Five pulling the door shut the moment the map leaked" (this last one is labeled as a reading and is fine).
- **Reader effect:** The draft converts a reactive pause into a principled stand, then uses that stand as the decisive Type-5-vs-Type-9 discriminator ("A Nine smooths it; Liang ignores it").
- **Evidence:** Bloomberg, July 25, 2026 (via Yahoo Finance syndication): "The suspension stemmed in part from Liang's frustration over online reports about his comments to investors during his first financing deal." No source reports that he refused to soften anything or that the pause was a stand on candor. The packet flags the same gap (Disputes #4).
- **Minimum viable repair:** State the reported reason once ("Bloomberg reported the pause stemmed partly from his frustration that the remarks had leaked") and drop or hedge "He paid it" / "rather than soften a transcript." If the Type-9 discriminator needs a conflict-escalation example, the 2024 price war and the Li Qiang remark already carry it; the pause does not.
- **Expected benefit:** removes the draft's most quotable unsupported line; the Type 9 counterargument stands on verified behavior.
- **Confidence:** high.
- **Acceptance test:** no sentence in the body or TL;DR asserts the pause was the cost or consequence of candor; the Bloomberg-reported reason appears once.

### CRITIC-C2. "Takes less" reads an explicitly instrumental strategy as renunciation; #117 is omitted

- **Passages:** Title and persona_title ("The Quant Who Takes Less"); intro "walked away from the difference"; diagnosis "taking more from the market turned into a cost"; #11 as quoted: "Sometimes you can give up some things to exchange for more of other things."
- **Reader effect:** The draft quotes the subject saying restraint is a trade for "more of other things," then frames him as a man who wants less. A skeptic reads the same line as the Amazon/Uber playbook stated out loud. The one transcript remark that most directly contradicts "takes less," #117 "If the AI era will produce many trillion-level companies, I think we're one of them," is absent from the draft; the 20-billion-yuan procurement wish appears only in the Rabbit Hole stress paragraph.
- **Evidence:** Packet first-person section C (#117; procurement line; "greatest return"); the draft's own "watermelons behind" quote, which is about deferring to capture bigger prizes.
- **Minimum viable repair:** Put #117 in "Four of the 118 points" (a fifth point, or fold into the anomaly beat) and let the diagnosis say plainly that his restraint is, by his own account, a bet on a larger later take; then argue why that is still Type 5 behavior (guarding the irreplaceable resource, not asceticism) rather than letting "takes less" imply he wants less.
- **Expected benefit:** the thesis stops depending on a reading the subject's own words contradict; the critic's strongest line is inside the tent.
- **Confidence:** high that the omission matters; medium that it changes the type call.
- **Acceptance test:** #117 (or the procurement ambition) appears in the main body, and at least one sentence in the diagnosis or 118-points section acknowledges that the stated purpose of the restraint is a larger eventual return.

### CRITIC-C3. "Priced to cost" and "no more" are euphemisms the draft's own numbers contradict

- **Passages:** TL;DR "**Priced to cost**"; "set to pay back its servers and no more"; ending "charges ten months of hardware and no more"; intro "prices its product to pay back its hardware and declines to charge a yuan more."
- **Reader effect:** A ten-month hardware payback is roughly a 120% annualized return on the servers, and the company's own disclosure (in the draft's key-stat) put theoretical inference margin at 545%, explicitly excluding training and R&D. "Priced to cost" tells the reader the opposite of what the key-stat shows. Combined with CRITIC-R1 the euphemism becomes the piece's weakest spot.
- **Evidence:** Packet CLM-43 (S34: theoretical 545% daily cost-profit margin; "actual revenue substantially lower"); purported #91–92 (payback rule; "not profit-maximizing").
- **Minimum viable repair:** Replace "priced to cost" / "and no more" with the accurate claim: priced to a ten-month hardware payback, which he himself calls not profit-maximizing, on a product whose inference margin the company once put at 545%. Let the reader see that "restraint" here means leaving a 2× on the table, not charging cost.
- **Expected benefit:** the restraint claim becomes precise and survives a finance-literate reader.
- **Confidence:** high.
- **Acceptance test:** the phrase "priced to cost" and the construction "pay back ... and no more" do not appear; the payback rule is described as a return target.

### CRITIC-C4. "Has never published the number of cards" is contradicted by the draft's own timeline

- **Passages:** TL;DR "The one number he has never published is how many GPUs he owns"; catfish "What he has never published is the number of cards in the building ... He publishes the map and hides the engine."
- **Reader effect:** Two sections earlier, the timeline displays "10,000 Nvidia A100s" (his 2023 count and the Fire-Flyer paper) and the purported "roughly 20,000 H-equivalent cards." The reader has just been shown the number the draft says he has never published.
- **Evidence:** Packet CLM-40 (contested); S01, S31, S03.
- **Minimum viable repair:** Narrow the claim to what is true: he has never published an audited current inventory or what he bought after the October 2022 ban, and the only post-ban figure is a purported one.
- **Expected benefit:** the hide/publish split survives in a form a fact-checker can pass.
- **Confidence:** high.
- **Acceptance test:** no sentence says he has "never published" a GPU count; the claim is scoped to post-ban or audited inventory.

### CRITIC-C5. Witness interests are undisclosed

- **Passages:** Diagnosis, Luo Yonghao paragraph; chips and personal-life sections quoting Zihan Wang; epigraph credit "(Zihan Wang translation, ChinaTalk)."
- **Reader effect:** The outside confirmation of the Type 5 reading rests on Luo (had received V3 access help from Liang before the January 2025 meeting, per the packet), and on Zihan Wang (former DeepSeek researcher who is also the translator of the 2023 interview the draft quotes in nine places, and who labels his own money opinion "naive"). The teachers are quoted from celebratory hometown coverage in R1 week. Booth's "self-mythologizing" charge is conceded for the $6M figure but not applied to the self-report on which the whole restraint narrative rests.
- **Evidence:** Packet testimony #2 (Luo), #7 (Wang, "self-labeled naive opinion; speaker is also the 2023 interview's translator"); S20.
- **Minimum viable repair:** One clause each: Luo "whose team Liang had helped with V3 access"; Wang "a former DeepSeek researcher who also translated the 2023 interview." Optionally one sentence in the catfish section granting that the restraint story is, for now, mostly his own telling plus friendly witnesses, and that the behavioral record (pricing, open weights, no outside capital until 2026) is what lets it stand.
- **Expected benefit:** the skeptic cannot accuse the piece of laundering self-mythology through friendly mouths; the behavioral evidence does the work instead.
- **Confidence:** high on the facts; medium on how much it changes a reader's trust.
- **Acceptance test:** Luo's prior help and Wang's dual role are each stated where the witness is introduced.

### CRITIC-C6. The distillation allegation is absent while "imitation stops with him" is the empathy turn

- **Passage:** Catfish close: "Cheap tokens and blunt assessments are what it looks like when a man who spent his twenties failing in a rented room decides the imitation stops with him."
- **Reader effect:** The most-circulated charge against DeepSeek in January 2025 was precisely imitation: OpenAI said it had evidence DeepSeek distilled its models, Microsoft investigated suspected API exfiltration from fall 2024, and the White House AI adviser said there was "substantial evidence." It was never adjudicated and DeepSeek never responded. Building the empathy turn on "originality vs imitation" without mentioning it is the strongest omission in the critics section, and it is the section that claims to give the strongest skeptic a fair hearing.
- **Evidence:** Bloomberg, Jan 28, 2025 ("AI Czar Sacks Says 'Evidence' DeepSeek Leaned on OpenAI's Models"); TechCrunch, Jan 29, 2025 ("Microsoft probing whether DeepSeek improperly used OpenAI's API"); Fortune, Jan 29, 2025. Packet: "Distillation allegations ... never adjudicated; DeepSeek silent; not used in the draft."
- **Minimum viable repair:** One or two sentences in the critics paragraph, attributed and status-marked: the allegation, who made it, that it was never adjudicated and DeepSeek did not respond. Then the "originality and imitation" quote can carry its full irony rather than hiding from it.
- **Expected benefit:** the steelman becomes complete; the empathy turn stops depending on reader ignorance.
- **Confidence:** high.
- **Acceptance test:** the word "distill" (or an equivalent description of the OpenAI/Microsoft allegation) appears in the catfish section with attribution and "never adjudicated" or equivalent.

### CRITIC-C7. Funding-structure power asymmetry and state backing are omitted

- **Passages:** Catfish "He publishes the map and hides the engine, and nobody has ever had to hand him either one"; 118-points "the round was 'carefully selected' for backers 'with the least hostility toward us'"; intro "DeepSeek, which he still controls."
- **Reader effect:** Bloomberg notes the first round "notably drew the backing of the National Artificial Intelligence Industry Investment Fund, one of the vehicles that spearheads Beijing's over-arching endeavors in the sector." Chinese and Western reports (SCMP, Forbes "Here's the catch," BigGo; search-snippet grade, not fetched by me) describe the state fund as the one investor with direct equity and voting rights, while other backers went into a Liang-managed partnership with a five-year lock-up and no votes, and Liang himself put in 20 billion yuan. "Restraint toward investors" and "carefully selected" look different when the selection produced total control plus one state shareholder. The draft treats the Li Qiang and Xi symposiums as personality data (silence, bluntness) and never raises the institutional reading.
- **Evidence:** Bloomberg July 25, 2026 via Yahoo Finance (state fund); packet timeline 2026-06 and S46; Forbes June 17, 2026 and SCMP (snippets).
- **Minimum viable repair:** One sentence naming the state fund as a first-round backer and one on the no-vote partnership structure, placed in the 118-points section beside "carefully selected." Delete or qualify "nobody has ever had to hand him either one."
- **Expected benefit:** the autonomy claim is scoped to what the record supports; a China-literate skeptic does not dismiss the piece as naive.
- **Confidence:** high on the state-fund fact (fetched); medium on structure details (snippets only; verify before use).
- **Acceptance test:** the National AI Fund is named as an investor in the body; the sentence "nobody has ever had to hand him either one" is gone or qualified.

### CRITIC-C8. The 2021 apology is used as a founder-virtue beat for a client-loss event the founder may not have signed

- **Passage:** Chengdu section: "The machine had done the one thing its owner refuses to do. It reached for more, and the firm said sorry for it in public."
- **Reader effect:** The event was a record 10.66% drawdown of clients' money. The packet notes the personal WeChat apology is attributed in Chinese press to High-Flyer's then-CEO, not to Liang, and that who signed the firm's letter is unresolved. Calling Liang "its owner" who "refuses" to reach for more, against his own fund's losses, is sympathy the record does not buy: the fund's AI reaching for more was his design, and the people who absorbed it were clients.
- **Evidence:** Packet CLM-23 and Disputes #13 (S35).
- **Minimum viable repair:** Keep the apology as a fact; drop the "one thing its owner refuses to do" contrast, or rewrite it so the loss belongs to clients and the design to him ("the strategy he had built reached for more, lost a record amount of other people's money, and the firm apologized").
- **Expected benefit:** the setback reads as a setback; the Five reading gains credibility by not needing it.
- **Confidence:** high.
- **Acceptance test:** the apology passage does not attribute the act of apologizing to Liang personally and does not present the drawdown as evidence of his restraint.

### CRITIC-C9. "50 billion yuan" is attributed inside a Bloomberg-sourced sentence Bloomberg did not print

- **Passage:** Intro: "Two days later Bloomberg reported that he had told the next set of backers, lined up to put in another 50 billion yuan, that they would not be signing."
- **Reader effect:** Bloomberg's July 25 report says "at least 10 billion yuan of additional funds ... though the final amount could go higher." The 50-billion figure is from Chinese media via aggregators. A reader who clicks the citation finds a fifth of the number.
- **Evidence:** Bloomberg via Yahoo Finance (fetched); packet CLM-06 and Disputes #2.
- **Minimum viable repair:** Either "at least 10 billion yuan (Bloomberg)" or "a round Chinese media put at 50 billion yuan," not a Bloomberg attribution on the Chinese figure.
- **Expected benefit:** the citation survives a click.
- **Confidence:** high.
- **Acceptance test:** any 50-billion-yuan figure is attributed to Chinese media, and any Bloomberg attribution carries Bloomberg's number.

### CRITIC-C10. "V3, R1, and now V4 have all shipped with open weights under an MIT license" is imprecise

- **Passages:** TL;DR "V3, R1, and V4 all shipped with open weights under an MIT license"; catfish (same claim).
- **Reader effect:** The original V3 (December 2024) weights were released under the DeepSeek Model License; MIT arrived with V3-0324 in March 2025. R1 and V4-Pro are MIT. An open-source-literate reader catches it and downgrades everything else.
- **Evidence:** Packet CLM-39, S33.
- **Minimum viable repair:** "R1, V3 since its March 2025 update, and V4 have all shipped under an MIT license" or simply "with open weights, most under an MIT license."
- **Expected benefit:** removes a cheap catch from the paragraph that carries the publish-the-map half of the thesis.
- **Confidence:** high.
- **Acceptance test:** the licensing sentence is accurate for the December 2024 V3 release.

## Follow-on questions

**CRITIC-Q1. What exactly changed on August 16, and did off-peak rates stay at the prior flat rate?** If off-peak equals the old price and peak is pure rationing for overloaded compute, the restraint thesis survives with a caveat; if cache-hit or off-peak tiers also rose, the ten-month rule is gone. Best sources: DeepSeek's own changelog (api-docs.deepseek.com/updates), the Quartz August 13 piece, and an archived copy of the pricing page from early August.

**CRITIC-Q2. Did DeepSeek or Liang give any public reason for the price change, and does it cite the transcript?** A statement invoking demand exceeding compute would let the draft reframe the hike inside Liang's own "inelastic demand" logic; a statement about revenue ahead of the IPO would change the type evidence. Best source: the notice DeepSeek posted beneath the V4 pricing table on August 6 and any 36Kr/LatePost follow-up.

**CRITIC-Q3. What are the exact terms of the first-round structure (votes, lock-up, which entity the state fund holds)?** If the no-vote partnership is confirmed by a paywalled primary (SCMP July 2026; Forbes June 17), CRITIC-C7 should be stated with specifics; if only aggregators carry it, keep it to the Bloomberg-level fact.

**CRITIC-Q4. Has DeepSeek ever responded to the distillation allegation, and did OpenAI or Microsoft publish findings?** A published finding either way would change CRITIC-C6 from "unadjudicated allegation" to a fact the empathy turn must absorb. Best sources: OpenAI's 2025 policy submissions, Microsoft's statements, Reuters.

**CRITIC-Q5. Who signed the December 27, 2021 apology?** If Liang's name is on it, CRITIC-C8's "owner refuses" can be partially restored; if it was the then-CEO, the beat should move to the firm. Best source: the original High-Flyer WeChat post and 证券时报 December 29, 2021.

## Preserve list

- "Concede the core of it ... Those facts hold, and no personality lens dissolves them." (catfish) — the steelman; the piece's credibility with skeptics depends on it.
- The key-stat pairing of ten-month payback with the 545% disclosure — keep both numbers in one box.
- "Either curiosity is the motive and return-on-attention is the discipline that guards it, or the second sentence is what the first one turns into once the experiment starts paying." (118-points) — keep the structure; update the test.
- The purported-label discipline and the intro's authenticity paragraph (NBD confirmation, DeepSeek silence, "Bloomberg hasn't verified").
- The timeline with the 2022 ban row directly above the 2026 purported 20,000-card row — lets the reader see post-ban accumulation without being told.
- "A man who presents himself as restrained was, on the evidence, one of the most aggressive accumulators of GPUs in China."
- The Chengdu failures and the 2021 drawdown as facts in the body (not as virtue beats, see CRITIC-C8).
- "He used the money to need less." (diagnosis) — the non-obvious reframe that is partly earned by the no-outside-capital record.
- The Rabbit Hole's Type 9 and Type 1 counterarguments, minus the funding-pause discriminator.

## Research log

| #   | Question                                                                                              | Source                                                                                                                                                                                                                                                                                                                                                  | Decision affected                                      |
| --- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | Has DeepSeek raised API prices in 2026 (the draft's own falsification test)?                          | WebSearch "DeepSeek API price increase August 2026" → Dataconomy (Aug 6), Quartz (Aug 13), aipricing.guru, EdenAI, BenchLM headlines                                                                                                                                                                                                                    | Surfaced the hike; triggered the blocker investigation |
| 2   | Verify at primary source                                                                              | https://api-docs.deepseek.com/quick_start/pricing (fetched 2026-08-22): peak/off-peak live, peak = 2× off-peak, Aug 23 weekend adjustment                                                                                                                                                                                                               | CRITIC-R1 confirmed (structure, current state)         |
| 3   | Dates and pre-hike rates                                                                              | https://www.aipricing.guru/news/deepseek-api-price-increase-warning-august-2026/ (announced Aug 6, effective Aug 16 16:00 UTC; pre-hike V4-Flash $0.22/$0.66, V4-Pro $0.66/$1.98). Quartz and Dataconomy returned 403; magnitude ("1,100%") unverified by me                                                                                            | CRITIC-R1 dates; magnitude caveat; CRITIC-Q1           |
| 4   | Bloomberg's stated reason for the July 25 pause; round size; state investors; transcript verification | Bloomberg via https://finance.yahoo.com/technology/ai/articles/deepseek-said-tell-backers-funding-144955175.html: "stemmed in part from Liang's frustration over online reports"; "at least 10 billion yuan"; "notably drew the backing of the National Artificial Intelligence Industry Investment Fund"; "Bloomberg hasn't verified the authenticity" | CRITIC-C1, C7, C9                                      |
| 5   | Distillation allegation record                                                                        | Search snippets only: Bloomberg 2025-01-28 (Sacks "substantial evidence"); TechCrunch 2025-01-29 (Microsoft probe, fall-2024 API activity); Fortune 2025-01-29                                                                                                                                                                                          | CRITIC-C6, M2                                          |
| 6   | First-round structure                                                                                 | Search snippets only: SCMP "secures Liang Wenfeng's grip"; Forbes 2026-06-17 "Here's the catch"; BigGo (state fund ~1B yuan direct, voting rights; others via Hangzhou Chengli LP, 5-year lock-up, zero votes; Liang 20B yuan)                                                                                                                          | CRITIC-C7 (marked snippet-grade); CRITIC-Q3            |
| 7   | Everything else                                                                                       | Evidence packet (claim inventory CLM-23, 39, 40, 43; Disputes #2, #4, #7, #13; first-person section C for #117)                                                                                                                                                                                                                                         | CRITIC-C2, C3, C4, C5, C8, C10                         |

Fetched sources: 3 (DeepSeek pricing page, aipricing.guru, Bloomberg/Yahoo). The extra fetch beyond the packet's guidance was spent on the blocker, as the protocol allows. Items 5 and 6 rest on search-result snippets and are labeled as such wherever used.

## Limits of this review

- I could not fetch Quartz or Dataconomy; the size of the August price increase beyond "peak = 2× off-peak" is unverified by me. The blocker rests on the primary pricing page and the dates, not on the magnitude.
- Funding-structure details (no-vote LP, five-year lock-up, 20-billion-yuan self-investment) come from search snippets of SCMP/Forbes/BigGo, not fetched articles; CRITIC-C7 is stated at the Bloomberg-supported level and flags the rest for verification.
- I did not read the Chinese originals of the 36Kr interviews or the Tencent 118-point edit; quote-fidelity issues are outside this review's competence and belong to other perspectives.
- I did not re-research the Xi-symposium seating ("far end of the long table"), which the packet marks as a footage reading CNN's "front row" may contradict; it is a checkable detail the editor should resolve but not a critic finding.
- Bloomberg's "richest among creators of AI models" scoping is Bloomberg's, and the draft attributes it; a literal reader could object that Musk (xAI) or Zuckerberg (Llama) are richer builders of models. I record this as a preference for "richest founder of an AI-model startup," not a concern.
- The type call itself (Five vs Nine vs One, and the unargued Three/Eight readings the packet notes) is the Enneagram evaluator's lane. My findings bear on whether the sympathetic reading is earned, not on which type is right; several of the concerns (C1, C2) would, if fixed, supply better evidence for whichever type survives.
