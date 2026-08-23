---
artifact: perspective-review
schema_version: 1
subject: Liang-Wenfeng
perspective: fan
draft_sha256: 90cbfd2f54b76bb32e5af49e38cb26a6f8f1984ea949618feb979e2efd8bf728
review_status: complete
trust: strained
value: high
delight: clear_hit
recommendation: revise
blockers: 1
concerns: 7
reviewed_at: 2026-08-22T19:28:39Z
path: docs/content-analysis/perspective-reviews/Liang-Wenfeng/2026-08-22_141324/fan.md
---

# Fan-perspective review: Liang Wenfeng (frozen draft 90cbfd2f…8bf728)

Standpoint: an informed, non-stan follower of DeepSeek and High-Flyer who has read both 36Kr interviews in translation, read the Fred Gao transcript the week it leaked, watches the API pricing page, and knows the LatePost/晚点 anecdotes. Not a Chinese-language native reader; Chinese sources used via the packet and two confirming searches. SHA of `draft-reviewed.md` confirmed against `context.json` and the supplied value before reading.

## Bottom-line verdict

The writer understands this person. The central connection, a quant who got rich taking the difference on mispriced assets and then built the most mispriced asset in his industry and declined the difference, is the one insight I would send to another DeepSeek follower, and the 2021 High-Flyer apology letter read against DeepSeek's pricing is a link I have never seen anyone make. Canon is handled with unusual care: every transcript quote is labeled purported, the $5.6M figure is scoped to the V3 paper's one-run caveat, marital status is stated as not established, and the strongest critics get their exact words.

One thing breaks the spell for anyone who follows the lab closely. The draft is dated August 22, 2026, and its signature section, key-stat box, and ending all state in the present tense that DeepSeek prices its API to a ten-month hardware payback and will not charge double even though it could. DeepSeek raised API prices on August 16, 2026, six days before this date, to a peak/off-peak schedule in which even the off-peak V4-Pro output price is more than double the old flat rate. The draft's own falsification test ("If the API price goes up after the IPO, the restraint was a phase") fired before publication and before any IPO. A fan who got the price-change email reads the ending as written by someone who has not looked at the pricing page in a week. That is a blocker, and it is also the best missing beat: the test he proposed was run, in a form that does not settle the question.

Recommendation: revise. The fix is one paragraph plus tense changes; the thesis survives, and may sharpen.

## What landed

**FAN-H1. The mispricing frame.** "A quant fund exists to find mispriced things and take the difference. Liang got rich doing exactly that. Then he built the most mispriced asset in his industry, a frontier model sold for a fraction of what buyers would pay, and walked away from the difference." This is the sentence that passes the default delight test. I knew High-Flyer and I knew the V2 price; nobody had put them on the same ledger. Must survive revision verbatim; the whole piece hangs on it.

**FAN-H2. The 2021 apology letter as origin story.** "The machine had done the one thing its owner refuses to do. It reached for more, and the firm said sorry for it in public. The lab it announced sixteen months later already had the hardware to run on." Quant followers remember the drawdown letter; connecting "AI tended to take bigger risks to chase more return" to a lab that refuses to take more is new, well-sourced (Jiemian carries the sentence), and correctly attributed to the firm rather than to Liang personally. Keep.

**FAN-H3. "He used the money to need less."** The paragraph from "What makes him a distinctive Five is what he did with the wealth" through "Every appetite the industry runs on, he treats as a leak in the system" is the clearest statement of the pattern and uses his own purported lines (one piece, no overtime, no sales, incomplete products). Keep the paragraph; see FAN-R1 for the tense.

**FAN-H4. The #91–93 scene.** The five-minute break, the on-screen message that a ten-month payback is too much profit, "Indeed there's still room for price cuts," and "many people in the company group cheered" is the scene every reader of the leak remembers, rendered in the right order with the right restraint. The inner-thought ("Those are the ones to keep") is earned by the "carefully selected … least hostility" line that follows it. Keep, with the date-stamp repair in FAN-R1.

**FAN-H5. The critic concession.** "A man who presents himself as restrained was, on the evidence, one of the most aggressive accumulators of GPUs in China. Those facts hold, and no personality lens dissolves them." Alexandr Wang's exact CNBC wording, Musk's one word, Booth's $1.6B, and the purported "non-compliant cards" line are all the real objections, and the draft does not soften them. Admiration and criticism both read as informed.

**FAN-H6. The hiring doctrine in Liang's words.** "Experienced people will tell you how something should be done without hesitation, while those without experience will explore repeatedly…" plus Zihan Wang's "a luxury that few fresh graduates would get at any company." This is the most-quoted DeepSeek culture claim and the draft places it where it explains something (he staffed the lab the way he studied). Keep.

**FAN-H7. "Even the extravagance was frugal."** "NVIDIA GPUs hold their value well … older cards still find buyers. The stamps had become chips." A small, true, characteristic line from the 2023 interview that most coverage skips. Keep.

**FAN-H8. The anomaly left open.** "Three years and roughly $36 billion sit between those two sentences." Leaving curiosity-2023 against greatest-return-2026 unresolved in the body is more honest than most profiles of him, and a fan respects it. Keep the paragraph; its last two sentences need the FAN-R1 repair.

**FAN-H9. The one-school application form.** "Liang listed one, Zhejiang, and when she asked whether he was sure, answered with a single word: 'Certain.'" New to me (羊城晚报, July 2026), and it does more typing work than a paragraph of theory. Keep.

## What missed

**FAN-M1. Present-tense pricing** (see FAN-R1). The description, TL;DR bullet four, the key-stat box, #91–93, the "fifth point" paragraph, and the closing paragraph all assert the ten-month-payback pricing as current fact. It is not, as of August 16, 2026.

**FAN-M2. "Publish the map, hide the engine" lands only half.** The publish half is true and well-argued. The hide half ("What he has never published is the number of cards in the building"; TL;DR: "The one number he has never published is how many GPUs he owns") is false to anyone who has read the Fire-Flyer paper, and the draft's own timeline component prints the counts two sections earlier. See FAN-R2.

**FAN-M3. The football afternoon is over-read.** "On the day the market repriced his industry, he was on a pitch with people who had known him at fourteen, the one place the number did not follow." He was home for Spring Festival (New Year's Day was January 29, 2025); the village put up a welcome arch reading 文锋回乡传佳绩 and tourists posed at the village stone. The number followed him home as an archway. See FAN-R4.

**FAN-M4. The lab reads as a pricing phenomenon, not an engineering one.** A fan admires DeepSeek for MLA, MoE routing, FP8 training, and GRPO, for turning H800 constraints into architecture, which is the point of Zihan Wang's other MIT Technology Review line ("The team loves turning a hardware challenge into an opportunity for innovation," in the packet, not in the draft). The draft never says what the lab invented; "frontier-builder" in the frontmatter is the only hint. See FAN-R7.

## What I expected

- **Open Source Week (February 24–28, 2025).** The draft borrows the Day 6 545% margin stat without naming the week that produced it. Partly met.
- **The V3.2-Exp price cut (September 29, 2025, API prices down 50%+ with DeepSeek Sparse Attention).** This is the one verified, dated, non-purported price cut between V2 and the leak, and the best external evidence for "cheered when prices fall." Not present. The price story rests entirely on V2 (2024) and a purported document.
- **The August 2026 price increase.** Not present; see FAN-R1.
- **Why the lab is technically admired** (hardware-constraint-as-innovation). Not present; see FAN-R7.
- **Spring Festival context for the Wuchuan scene.** Not present; see FAN-R4.
- **The 2019 Golden Bull speech**, the earliest first-person Liang text that quant followers quote ("基金经理就是一堆服务器", the fund manager is a pile of servers). Not present. It is a speech, not an interview, so "two long interviews" stays accurate; but the line would do real work in the chips section, where the draft currently asserts "Quant trading needs a handful of GPUs" against a founder whose stated view of a fund manager is servers.
- **The distillation allegations** (Sacks/OpenAI, January 2025). Absent. The draft's critic section is about compute, which is the stronger objection, and a fan will accept the choice; a one-clause acknowledgement would close the gap an informed reader notices.
- **His name in Chinese once** (梁文锋, commonly mis-written 梁文峰). Preference only.
- **Canon otherwise intact.** Jacobi 2013 with Xu Jin, High-Flyer 2015, 100B-yuan AUM by 2021, Fire-Flyer 2 at 10,000 A100s, V2 at one yuan, R1 on January 20, the $589B day, Li Qiang on January 20, Xi on February 17 with six speakers, V4-Pro in April 2026, the July 14 Bloomberg figures, the July 23 leak, the July 25 pause, the August restart. All correct as far as I can check.

## What surprised me

Welcome:

- The apology-letter link (FAN-H2).
- "Certain" on the application form (FAN-H9).
- The DJI decline told as Liang's own story of failure rather than as trivia.
- The 2024 line about other parents ("basically, they thought studying was useless") used as the one childhood story he has told, which is exactly right.
- Luo Yonghao's "not domesticated" reading placed beside Bloomberg Businessweek's "prolonged silences," two outside witnesses who agree without knowing it.

Jarring or unearned:

- "the one place the number did not follow" against a welcome arch (FAN-R4).
- "Luo Yonghao, the entrepreneur and talk-show host." To anyone who follows Chinese tech he is the Smartisan phone founder who paid off hundreds of millions of yuan in debt by livestream selling; "talk-show host" reads as an outsider's first Google result (FAN-R8).
- A Bloomberg-attributed sentence carrying a number Bloomberg did not print (FAN-R6).

## Red flags

### FAN-R1 (Blocker). The pricing claims are stated in the present tense and are no longer true

- **Passages.** Description: "price DeepSeek to a ten-month payback." TL;DR: "**Priced to cost:** DeepSeek's API is set to pay back its servers and no more, per the purported transcript, when it could charge double and lose almost no demand." Key-stat: "10 months / the hardware payback DeepSeek prices its API to." #91–93: "DeepSeek's API price is set so that a batch of servers pays for itself in ten months." Fifth point: "The test is simple. If the API price goes up after the IPO, the restraint was a phase." Rabbit Hole counterarguments: "A post-IPO price hike is the evidence that would change this call." Closing: "a lab that charges ten months of hardware and no more."
- **Reader effect.** On August 6, 2026 DeepSeek warned developers of a significant price increase; on August 16 it moved the API to peak/off-peak billing. DeepSeek's own pricing page now lists V4-Pro output at $1.98 off-peak / $3.96 peak per million tokens (press accounts give the prior flat rate as $0.87) and V4-Flash output at $0.66 / $1.32 (prior $0.28); cache-miss input roughly tripled at peak. Peak hours are 01:00–04:00 and 06:00–10:00 UTC, i.e., Beijing working hours, and the page states that weekend off-peak applies from Sunday, August 23, 2026. DeepSeek's stated reason, per press: "to allocate resources more reasonably." A developer who pays for the API reads the draft's ending the same week the invoice changed. The draft's own test is framed as future and conditional on the IPO; it fired in the present, pre-IPO. The phrase "could charge double and lose almost no demand" is now an event, not a hypothetical: the cheapest tier more than doubled.
- **Evidence.** DeepSeek API docs pricing page (fetched 2026-08-22); Quartz 2026-08-13, TechTimes 2026-08-17, Dataconomy 2026-08-06 (search-result summaries; pages 403'd on fetch). See Research log.
- **Minimum viable repair.** (a) Move every payback/"no more" sentence to past tense anchored to the May transcript and to the September 2025 V3.2 cut. (b) Add one short paragraph, best placed at the end of the "fifth point" beat, stating the August 16 change with the old/new output prices, the peak hours, and the stated rationale. (c) Rewrite the test. The honest version: the test ran early and came back mixed. A peak/off-peak schedule with weekend discounts is rationing a scarce resource, which is what the transcript says he does (#42: the gap "is mainly in resources"); an off-peak rate above double the old flat rate is the "doubling" he said he would not do. Both readings are his. (d) Update the Rabbit Hole sentence and the FAQ "Why does DeepSeek keep its prices so low?" (the question itself is now dated; answer should say "kept" and note the August change).
- **Expected benefit.** Converts the draft's weakest temporal exposure into its most current beat; keeps the anomaly paragraph honest; protects the title phrase ("Who Takes Less") from an obvious reader rebuttal.
- **Confidence.** High on the fact of the change and the current prices (primary source). Medium on the exact prior flat rates ($0.87 / $0.28), which are from press summaries, not from DeepSeek's page; verify before printing.
- **Acceptance test.** No sentence in the body, TL;DR, key-stat, FAQ, or description states the ten-month-payback pricing as current. The body names August 16, 2026, gives at least the V4-Pro output old/new figures, quotes the stated rationale, and the "test" paragraph acknowledges the test has already produced a result. `grep -n "ten months\|ten-month\|no more" draft` returns only past-tense or dated uses.

### FAN-R2 (Concern). "Never published the number of cards" is contradicted by his own paper and by the draft's timeline

- **Passages.** TL;DR: "The one number he has never published is how many GPUs he owns." Catfish section: "What he has never published is the number of cards in the building, the only asset that cannot be bought back once it is taken away. He publishes the map and hides the engine."
- **Reader effect.** Liang is the arXiv submitter of the Fire-Flyer AI-HPC paper (2408.14158), which documents 10,000 PCIe A100s; he recited the count to 36Kr in 2023; the purported transcript gives "roughly 20,000 H-equivalent cards." The draft's timeline prints all three. An informed reader catches the contradiction in under a minute and downgrades the whole "hide the engine" half of the split, which is the draft's main answer to the open-weights paradox.
- **Evidence.** Packet CLM-24, CLM-40; S31; S01; S03.
- **Minimum viable repair.** Narrow the claim to what is true: no audited inventory of what was bought after the October 2022 controls, and no answer to Alexandr Wang's 50,000 figure. Something like "the post-ban count" rather than "the number."
- **Expected benefit.** The split survives in a defensible form; the TL;DR stops making a checkable false claim.
- **Confidence.** High.
- **Acceptance test.** Neither the TL;DR nor the body says "never published" about GPU counts; the sentence specifies the post-October-2022 inventory or the 50,000 claim.

### FAN-R3 (Concern). The blanket MIT-license claim is wrong for the original V3

- **Passages.** Catfish: "V3, R1, and now V4 have all shipped with open weights under an MIT license." TL;DR: "V3, R1, and V4 all shipped with open weights under an MIT license."
- **Reader effect.** The December 2024 V3 weights shipped under the DeepSeek Model License (code MIT); MIT came with V3-0324 in March 2025. The license switch was a discussed event in open-source circles, and "all … MIT" is the kind of imprecision that tells a reader the writer follows the press, not the model cards.
- **Evidence.** Packet CLM-39; S33 (Hugging Face cards; SiliconANGLE 2025-03-24).
- **Minimum viable repair.** "R1, V3 since its March 2025 update, and V4-Pro have all shipped with open weights under an MIT license," or "everything since March 2025."
- **Expected benefit.** Accuracy where the open-source audience is most literate.
- **Confidence.** High.
- **Acceptance test.** License wording matches the Hugging Face model cards for V3 (original), V3-0324, R1, and V4-Pro.

### FAN-R4 (Concern). The Wuchuan football scene omits Spring Festival and over-reads the visit

- **Passage.** "Liang spent that afternoon in Wuchuan, playing football with his old classmates, according to his middle-school teacher (湛江发布, January 2025). On the day the market repriced his industry, he was on a pitch with people who had known him at fourteen, the one place the number did not follow."
- **Reader effect.** January 27, 2025 was two days before Chinese New Year. Chinese coverage (极目新闻, 凤凰网, 腾讯新闻, late January 2025) reports that he was home for the holiday, that the village erected a welcome arch with the couplet 文锋回乡传佳绩 / 乡村振兴添动力, that tourists came to photograph the village stone, and that he left on the morning of the first day of the new year. "The one place the number did not follow" is the opposite of what the reporting shows. The more characteristic fact is that he went home on the holiday schedule like everyone else and left at first light.
- **Evidence.** 极目新闻 2025-01-31 (packet S17, which the draft already cites for the fellow-villager line), 新浪财经 2025-01-28 (S19), search-result summaries 2026-08-22.
- **Minimum viable repair.** Add "home for Spring Festival" and the arch. Cut "the one place the number did not follow" or invert it.
- **Expected benefit.** Removes a romantic claim an informed reader knows to be false; the replacement beat (arch, one-night stay, gone by morning) is truer to the type claim anyway.
- **Confidence.** High on the holiday and the arch; medium on the exact day-by-day itinerary, which varies between reports.
- **Acceptance test.** The passage mentions Spring Festival; it does not assert that the fame did not reach Wuchuan.

### FAN-R5 (Concern). The cold open asserts a date the source does not give

- **Passage.** "That dinner was in early 2023, before anyone outside Chinese finance knew the name … and was months from founding DeepSeek."
- **Reader effect.** The Tencent News / LatePost piece relaying Yan Junjie's story gives no date. Two of the opening paragraph's three context claims (before anyone knew the name; months from founding) depend on the inferred date. If the dinner was 2024, the scene still works but the framing is wrong, and MiniMax followers are exactly the readers who might know.
- **Evidence.** Packet CLM-02, Dispute 9; S11.
- **Minimum viable repair.** Remove "early 2023" and the "months from founding DeepSeek" clause, or attribute the dating ("the research places the dinner in early 2023"). Keep "before anyone outside Chinese finance knew the name" only if it is true of either year, which it is.
- **Expected benefit.** The hook stops carrying an unverifiable fact.
- **Confidence.** High that the source is undated; no view on the true date.
- **Acceptance test.** The opening paragraphs contain no date the cited source does not contain.

### FAN-R6 (Concern). Bloomberg is credited with a figure it did not print, and "eleven days" is source-dependent

- **Passages.** "Two days later Bloomberg reported that he had told the next set of backers, lined up to put in another 50 billion yuan, that they would not be signing in the coming days. The round stayed frozen for eleven days." Later: "By August 5 the round was back on, at a valuation near $74 billion (Bloomberg, August 6). The truth cost eleven days."
- **Reader effect.** Bloomberg's July 25 report said at least 10 billion yuan of new money at a pre-money of at least 480 billion yuan; the 50-billion-yuan round is from Chinese reports relayed by TechNode/BigGo. Readers who tracked the round know both figures and will notice the attribution slip. "Eleven" depends on the August 5 Chinese-media restart date versus Bloomberg's August 6.
- **Evidence.** Packet CLM-06, CLM-07, Disputes 2 and 3; S07, S08, S09.
- **Minimum viable repair.** Attribute 50 billion yuan to Chinese reports or use Bloomberg's floor; say "about a week and a half" or give both dates.
- **Expected benefit.** Attribution hygiene in the paragraph most likely to be checked by finance readers.
- **Confidence.** High.
- **Acceptance test.** Every number in a Bloomberg-attributed sentence appears in the cited Bloomberg report.

### FAN-R7 (Concern). The lab's engineering, Open Source Week, and the verified September 2025 price cut are missing

- **Passages.** The chips and catfish sections; the key-stat box ("the company's own March 2025 disclosure put its theoretical daily margin at 545%").
- **Reader effect.** A fan admires DeepSeek for what it built under export controls (MLA, MoE, FP8 training, GRPO) and for Open Source Week, which is where the 545% figure comes from. The draft uses the stat and skips the week. More important for the thesis: the September 29, 2025 V3.2-Exp release cut API prices by 50%+ (to about $0.028 per million input tokens) on the strength of a sparse-attention architecture. It is a dated, verified, non-purported price cut that demonstrates "when prices fall … cheered" without leaning on the leaked document, and it sets up the August 2026 reversal (FAN-R1). Without it the price narrative jumps from May 2024 to a purported May 2026 meeting.
- **Evidence.** DeepSeek API docs news 2025-09-29; TechNode 2025-09-30; VentureBeat; the-decoder (search results 2026-08-22). Packet S34 for Open Source Week Day 6; S26 for "turning a hardware challenge into an opportunity."
- **Minimum viable repair.** One sentence in the chips or catfish section on what the lab built under constraint (Zihan Wang's MIT Technology Review line is already in the source set). One dated sentence on the September 2025 cut. Attribute the 545% stat to Open Source Week by name.
- **Expected benefit.** The subject reads as an engineer-founder rather than a discounter; the price timeline becomes continuous and mostly verified; the August 2026 hike has a setup.
- **Confidence.** High on the facts; medium on whether the word ceiling allows all three additions (the second-pass notes say the body sits ten words under the limit; cut before adding).
- **Acceptance test.** The body contains the V3.2 cut with its date, names Open Source Week, and states at least one concrete technical contribution.

### FAN-R8 (Concern). Luo Yonghao is mis-framed and his friendliness is not flagged

- **Passage.** "Luo Yonghao, the entrepreneur and talk-show host, met him in a hotel lobby and came away with the same reading from the outside."
- **Reader effect.** Luo is known as the Smartisan phone founder who repaid his debts by livestream commerce; "talk-show host" is a minor outsider tell. The packet also notes that Liang had helped Luo's team get V3 access before the January 2025 meeting, which makes Luo a friendly witness; the draft presents him as a neutral outside reading.
- **Evidence.** Packet testimony item 2; S12, S13.
- **Minimum viable repair.** "Luo Yonghao, the Smartisan founder turned livestream seller, whose team Liang had helped with model access."
- **Expected benefit.** Correct descriptor; the witness's stake is visible.
- **Confidence.** High.
- **Acceptance test.** Luo's descriptor names Smartisan or livestreaming; the passage discloses the prior help.

Preferences (recorded, not promoted): 梁文锋 once in the body; the description's "richest AI founder alive" tracks Bloomberg's headline but a Jensen Huang follower will object, and the body's "richest person alive who has built an AI model" is the safer phrasing; the 2019 "pile of servers" line in the chips section.

## Specific improvements

1. **Add the August 16, 2026 price change and rewrite the test** (FAN-R1). Location: end of the "fifth point" paragraph in "Four of the 118 points," plus tense edits in the description, TL;DR, key-stat, FAQ, Rabbit Hole, and closing. Effect: removes an already-false present-tense claim at the center of the piece. Evidence: DeepSeek pricing page; August press. Repair: one dated paragraph with old/new output prices, peak hours, stated rationale, and a two-reading verdict. Benefit: the ending becomes current and the anomaly stays honest. Confidence: high. Acceptance: as in FAN-R1.
2. **Narrow "never published" to the post-ban inventory** (FAN-R2). Location: TL;DR bullet three and the catfish paragraph beginning "What the lens adds." Confidence: high. Acceptance: as in FAN-R2.
3. **Fix the MIT claim** (FAN-R3). Location: catfish paragraph and TL;DR bullet three. Confidence: high. Acceptance: as in FAN-R3.
4. **Add Spring Festival and the arch to the football scene** (FAN-R4). Location: catfish section, second paragraph after the $589B sentence. Confidence: high. Acceptance: as in FAN-R4.
5. **Drop or attribute the "early 2023" date** (FAN-R5). Location: intro paragraph two. Confidence: high. Acceptance: as in FAN-R5.
6. **Re-attribute the 50-billion-yuan figure and soften "eleven days"** (FAN-R6). Location: intro paragraph three; 118-points closing paragraph. Confidence: high. Acceptance: as in FAN-R6.
7. **Add the V3.2 cut, name Open Source Week, and one engineering sentence** (FAN-R7). Location: chips section (engineering), catfish section (V3.2 cut), key-stat label (Open Source Week). Cut from elsewhere first; the word ceiling is binding. Confidence: high on facts, medium on fit. Acceptance: as in FAN-R7.
8. **Re-describe Luo Yonghao** (FAN-R8). Location: diagnosis paragraph three. Confidence: high. Acceptance: as in FAN-R8.

## Follow-on questions

**FAN-Q1. What exactly did DeepSeek say on August 6 and August 16, 2026, and did the announcement mention compute shortage, the V4-Pro launch, or the funding round?** Answer changes the verdict on the draft's test: a congestion-rationing rationale keeps the Five reading intact; an explicit revenue or investor rationale supports "the restraint was a phase." Best source: the DeepSeek API docs news item for the change (the docs site indexes items by date slug; the August 21 item is `news260821`), then 36Kr / 晚点 Chinese coverage of the developer reaction.

**FAN-Q2. Did anyone at DeepSeek react publicly to the increase?** The draft's "many people in the company group cheered" when prices fell invites the question of what the same group did when prices rose. A single on-record reaction would be the strongest possible coda. Best source: LatePost / 晚点, Zihan Wang's public channels, DeepSeek GitHub discussions.

**FAN-Q3. When was the Yan Junjie dinner?** Answer changes whether the cold open's "months from founding DeepSeek" survives. Best source: the original 晚点LatePost interview with Zhang Jinjian, or Yan Junjie's own interviews.

**FAN-Q4. Where was Liang seated on February 17, 2025?** The draft says far end of the long table with Jack Ma; CNN places Ma in the front row. Answer changes one checkable visual detail in the catfish section. Best source: the CCTV 新闻联播 segment for that evening.

**FAN-Q5. Was Fire-Flyer 1 built in 2018 or 2019, and did High-Flyer sell direct with no quotas?** Answer changes two timeline entries and one sentence in the Chengdu section. Best source: High-Flyer's own site history page; 2019 Golden Bull coverage.

## Preserve list

- "A quant fund exists to find mispriced things and take the difference. Liang got rich doing exactly that. Then he built the most mispriced asset in his industry … and walked away from the difference." (intro)
- "The machine had done the one thing its owner refuses to do. It reached for more, and the firm said sorry for it in public." (Chengdu)
- "Most people who get rich expand. He used the money to need less." and "Every appetite the industry runs on, he treats as a leak in the system." (diagnosis)
- "Even the extravagance was frugal. … The stamps had become chips." (chips)
- "A man who presents himself as restrained was, on the evidence, one of the most aggressive accumulators of GPUs in China. Those facts hold, and no personality lens dissolves them." (catfish)
- The full #91–93 scene through "many people in the company group cheered," the five-minute break, the on-screen message, and the inner-thought. (118 points)
- "Three years and roughly $36 billion sit between those two sentences." (118 points; keep even after the test paragraph is rewritten)
- "Liang listed one, Zhejiang, and when she asked whether he was sure, answered with a single word: 'Certain.'" (childhood)
- The Yan Junjie cold open, including the half-hour delay.
- The "thing you most want you can't get" close, once the pricing paragraph above it is current.

## Research log

Packet read first. Research questions stated before searching: (1) DeepSeek's API pricing trajectory 2025–2026, because the draft's falsification test depends on it and the packet flagged unverified hike headlines; (2) whether the 2019 Golden Bull speech exists and disturbs "two long interviews / no video"; (3) whether the January 27, 2025 football afternoon was a Spring Festival visit.

| #   | Source                                                                                                                                                           | Date accessed | What it decided                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Web search: "DeepSeek V4 API price increase August 2026" (Quartz 2026-08-13, TechTimes 2026-08-17, Dataconomy 2026-08-06, techjournal.org, GenAI Daily, BenchLM) | 2026-08-22    | Established the August 6 warning, August 16 effective date, prior flat rates ($0.87 V4-Pro output, $0.28 V4-Flash output), new peak/off-peak rates, and the "allocate resources more reasonably" rationale. Direct fetches of Quartz, TechTimes, and Dataconomy returned HTTP 403; figures are from search summaries and corroborated by source 2. Drove FAN-R1.                                                                           |
| 2   | DeepSeek API docs, Models & Pricing page (api-docs.deepseek.com/quick_start/pricing)                                                                             | 2026-08-22    | Primary confirmation of current peak/off-peak prices (V4-Pro output $1.98/$3.96; V4-Flash $0.66/$1.32; cache-miss input $0.66/$1.32 and $0.22/$0.44), peak hours 01:00–04:00 and 06:00–10:00 UTC, weekend off-peak from Sunday August 23, 2026. Drove FAN-R1 confidence to high on current prices. The docs news index did not expose the August 6/16 items by guessed slug; `news260821` is the V4-Flash-Vision-Exp release, not pricing. |
| 3   | Web search: "DeepSeek V3.2-Exp API price cut 50% September 2025" (DeepSeek API docs news 2025-09-29, TechNode, VentureBeat, heise, the-decoder)                  | 2026-08-22    | Confirmed the September 29, 2025 release and 50%+ cut (to ~$0.028/M input). Drove FAN-R7.                                                                                                                                                                                                                                                                                                                                                  |
| 4   | 新浪财经 reproduction of the 2019 Golden Bull speech (finance.sina.com.cn, 2025-02-14) via search and fetch                                                      | 2026-08-22    | Speech exists as text (August 2019, Golden Bull ceremony); no video reference; no personal-motive content; memorable line "基金经理就是一堆服务器." Decided it is an expectation, not a red flag, and that the draft's "two long interviews" and "no video" claims stand.                                                                                                                                                                  |
| 5   | Web search: "梁文锋 2025年1月27日 回乡 春节 踢球" (极目新闻 2025-01-31, 凤凰网, 腾讯新闻 2025-01-31, 新浪财经 2025-01-28)                                        | 2026-08-22    | Confirmed Spring Festival visit, village arch and couplet, tourists at the village stone, departure on New Year's morning. Drove FAN-R4.                                                                                                                                                                                                                                                                                                   |

Community discussion was not used to establish any fact; fan expectations (Open Source Week, V3.2, engineering) come from my own familiarity and are labeled as expectations.

## Limits of this review

- All first-person material was read in English translation; I did not re-read the 36Kr originals or the Chinese transcript edit, so wording-level quote fidelity is taken from the packet.
- The prior flat API prices ($0.87 and $0.28 output) come from press summaries; DeepSeek's page shows only current prices. The editor should confirm the old rates from DeepSeek's own August announcement before printing them.
- I could not open the Quartz, TechTimes, or Dataconomy articles directly (HTTP 403); their content is known from search summaries that agree with one another and with the primary pricing page.
- Xi-symposium seating, the Yan Junjie dinner date, the Fire-Flyer 1 year, and "sold directly" were not resolved; they are carried as follow-on questions.
- The fan standpoint is a proxy. I did not consult fan forums for this pass; the expectations listed are those of an informed follower of the lab's releases and the Chinese-tech press, not a survey of what readers want.
- I did not read `subject.md`, `critic.md`, `unfamiliar.md`, `enneagram.md`, `future.md`, or `synthesis.md`, and did not audit the live draft.
