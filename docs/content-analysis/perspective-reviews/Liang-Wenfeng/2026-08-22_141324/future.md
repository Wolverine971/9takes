---
artifact: perspective-review
schema_version: 1
subject: Liang-Wenfeng
perspective: future
draft_sha256: 90cbfd2f54b76bb32e5af49e38cb26a6f8f1984ea949618feb979e2efd8bf728
review_status: complete
trust: strained
value: high
delight: clear_hit
recommendation: revise
blockers: 1
concerns: 7
reviewed_at: 2026-08-22T19:30:29Z
path: docs/content-analysis/perspective-reviews/Liang-Wenfeng/2026-08-22_141324/future.md
---

# Future review: Liang Wenfeng (frozen draft 90cbfd2f…8bf728)

Standpoint: a reader opening this page around August 2027, twelve months after the review date. I do not know what happens between now and then. I test which claims are already dated, which are stated in a tense the news cycle will falsify, and what survives if the July–August 2026 events are removed.

SHA check: `draft-reviewed.md` hashes to `90cbfd2f…8bf728`, matching `context.json` and the supplied `--draft-sha`. Only the frozen snapshot was read.

## Bottom-line verdict

The thesis is built to last; the proof is not. The Type 5 argument rests on material that will not move: two 36Kr interviews (2023, 2024), five named or surnamed hometown witnesses, the 2021 High-Flyer apology, the 10,000-GPU purchase, and the open-weights record. Strip every July–August 2026 sentence out of the draft and the diagnosis still stands on its own evidence. That is the right architecture for a page meant to rank for years.

The problem is that the draft's freshest behavioral proof, "priced to cost," is already false in the present tense on the draft's own publish date. DeepSeek's pricing page carried a "significant increase expected" warning from August 6, 2026; the August 13 V4-Pro GA note announced peak/off-peak billing effective August 16; and the live page now lists peak rates at double the off-peak rate, with a further billing-rule change scheduled for August 23. The draft states in six places that DeepSeek prices to a ten-month payback "and no more," that it "declines to charge a yuan more," and that it "could charge double" but does not. It then proposes, as its one falsification test, "If the API price goes up after the IPO, the restraint was a phase." The price went up before the IPO, six days before the draft's date. A reader in 2027 will find this in one search, and it will read as a page that did not know its own subject's news. The evidence packet flagged exactly this risk (unresolved question 8; final research-limitation bullet) and the draft shipped without chasing it.

This is one blocker, and it is repairable in a paragraph: date-anchor the pricing claims, report the August 2026 hike in the draft's own terms, and rewrite the test so it is still open. Everything else is ordinary temporal hygiene: undated July/August references, a funding round narrated as settled while unsigned, an IPO in the future tense, a stake fraction that dilutes, and a personal-life section whose "nobody can find" premise is the kind of claim an IPO prospectus tends to end.

Recommendation: **revise**, not hold. The research for the blocker is already done in this review.

## What landed

**FUTURE-H1. The childhood evidence chain is the durable spine.**

> "using stamps to fund stamps." He sold what he received, bought back in, and "barely spent his father's money." (湛江云媒, January 2025) A child who wanted something and designed a loop so that nobody would have to give it to him.

Why it must survive: every witness here (Mr. Li, Mr. Rong, Yang Yahong, Liang Wenhui, the 2002 吴川报) is dated, named or surnamed, and about events that ended twenty years ago. Nothing in the 2027 news cycle can touch it. This section will read identically in five years.

**FUTURE-H2. The anchor quote is evergreen and first-person.**

> "Verifying whether our hypotheses are correct. If they are, that's immensely satisfying." (36Kr, 2023) Most founders answer that question with a market. He answered it with an experiment.

Why it must survive: the diagnosis is tied to a 2023 interview, not to 2026 coverage. If the purported transcript is repudiated tomorrow, this sentence still carries the type call.

**FUTURE-H3. The transcript is labeled purported at every load-bearing use, and the NBD caveat is stated in the body.**

> DeepSeek has never confirmed the document; an investor in the company told National Business Daily the meeting happened and the content was credible.

Why it must survive: this is what lets the page absorb either future outcome (confirmation or repudiation) with a one-line edit instead of a rewrite. The draft's own second-pass note already says so.

**FUTURE-H4. Net worth is handled with explicit dates and a decay warning.**

> The Bloomberg Billionaires Index put Liang Wenfeng's net worth at about $36 billion in July 2026 … and Fortune cited a Bloomberg figure of $37.9 billion on August 1, 2026. The number moves daily with DeepSeek's valuation.

Why it must survive: this is the model for how every other fragile figure in the draft should be written. "As of August 2026 that is about $38 billion" in the personal-life section does the same thing correctly.

**FUTURE-H5. The unresolved anomaly is placed in the body with a stated test.**

> Either curiosity is the motive and return-on-attention is the discipline that guards it, or the second sentence is what the first one turns into once the experiment starts paying.

Why it must survive: the structure (leave the contradiction open, name the evidence that would change the call) is exactly what makes a personality piece refreshable rather than a time capsule. The test itself must be rewritten (see FUTURE-R1), but the move is right and should stay.

**FUTURE-H6. The critics' section concedes facts rather than news.**

> The $5.6 million was one training run, stated as such in the V3 paper; High-Flyer had spent about a billion yuan on Fire-Flyer 2 alone.

Why it must survive: the concession is anchored to a paper and a disclosed capex figure, not to whichever outlet was loudest that week. The Alexandr Wang / Musk / Booth / Amodei quotes are all dated to 2025 and will read as history, which is what they are.

## What missed

**FUTURE-M1. "Priced to cost" in the present tense.** The promised effect is behavioral proof of restraint. For a reader who checks DeepSeek's pricing page (and the kind of reader who searches "Liang Wenfeng leaked transcript" will), the proof inverts: the company now charges exactly the "double" the draft says it could but does not. Detailed under FUTURE-R1.

**FUTURE-M2. "The truth cost eleven days and no money at all. He had already priced it."** The promised effect is closure. The round was unsigned as of the packet's cutoff (signing "expected late August" per Chinese-media reports via TechNode/BigGo). If it closes lower than $74B, or not at all, "no money at all" is wrong; if it closes at $74B, the sentence is fine but was written before it was true. Detailed under FUTURE-R3.

**FUTURE-M3. "The IPO will hand him a number that updates every morning."** The promised effect is a closing image. It is a prediction. Bloomberg's reporting gives a 2027 target; targets slip. Detailed under FUTURE-R4.

## What I expected

- An explicit "as of" date on the pricing claim, since the packet already warned that DeepSeek's 2026 pricing trajectory was an open question. Not present.
- A year on at least one July/August date per section. The intro establishes "July 2026" once; after that the draft says "on July 23," "from July 23," "in July," "By August 5," "August 6," "August 13" with no year. In the 118-points section and the Rabbit Hole, none of the August references carry a year.
- The round status stated as a status, not a result ("reopened," "targeting," "expected to sign"), given that the draft's own sources say it was unsigned.
- The ending's IPO written conditionally or anchored to the reported target ("the 2027 listing Bloomberg reported he is preparing").
- Present-tense negative claims (no video, no marriage on record, never commented) framed as "as of" statements, because this subject is on an IPO track and prospectuses and roadshows end exactly these kinds of absences.

## What surprised me

**Welcome:** how little of the type argument depends on the leak. I did the removal test: delete intro paragraphs 3–4, the TL;DR "Eleven days" bullet, the whole "Four of the 118 points" section, and the "watermelons" closing, and what remains (cold open, diagnosis on the 2023 quote and Luo Yonghao, childhood, Chengdu, chips, catfish-and-critics, personal life) is a complete, sourced, date-stable Type 5 case. The draft is far more durable than its current-tense hook suggests. The July 2026 material is an appendix that the draft presents as the spine; the fix is mostly tense and framing, not structure.

**Jarring:** the falsification test was already partly triggered when the draft was dated, and the packet said so. A piece that proposes "here is what would change my mind" and then misses that the thing happened six days earlier will lose a 2027 reader's trust faster than a piece that proposed no test at all. The honesty of the move makes the miss more visible, not less.

**Jarring, minor:** the title-level frame ("The Quant Who Takes Less," "Won't Take More") is the most exposed phrase in the draft to the one fact the draft did not check. Peak pricing at 2× is, literally, taking more. The frame can survive (congestion pricing at a compute ceiling is arguable as restraint-by-rationing), but only if the draft argues it rather than not knowing it.

## Red flags

### FUTURE-R1 — BLOCKER — Pricing claims are already dated on the publish date; the falsification test has already partly fired

- **Passages (six present-tense locations plus the test):**
  1. Frontmatter `description`: "price DeepSeek to a ten-month payback and call restraint a strategy?"
  2. Intro ¶4: "describes a lab that prices its product to pay back its hardware and declines to charge a yuan more."
  3. TL;DR bullet 4: "Priced to cost: DeepSeek's API is set to pay back its servers and no more, per the purported transcript, when it could charge double and lose almost no demand."
  4. 118-points §#91–93: "DeepSeek's API price is set so that a batch of servers pays for itself in ten months."
  5. Key-stat label: "the hardware payback DeepSeek prices its API to, per the purported 2026 transcript."
  6. Ending ¶2: "a lab that charges ten months of hardware and no more."
  7. The test, 118-points closing ¶: "The test is simple. If the API price goes up after the IPO, the restraint was a phase." Echoed in Rabbit Hole Counterarguments: "A post-IPO price hike is the evidence that would change this call." And FAQ 7's question: "Why does DeepSeek keep its prices so low?"
- **Reader effect / trust problem:** The draft's only behavioral, checkable, present-day proof of the "takes less" thesis is the API price. A reader who checks finds that DeepSeek (a) posted a "significant increase expected" warning on its pricing page on August 6, 2026, (b) announced peak/off-peak billing in the August 13 V4-Pro GA note, effective August 16, and (c) currently lists peak rates at double off-peak (V4-Pro output $3.96 peak / $1.98 off-peak; V4-Flash output $1.32 / $0.66), with off-peak matching the pre-August-16 list prices reported by third parties, and a further rule change effective August 23. Press reports put the increases at 50% to over 1,100% depending on model, token type, and time of day (Quartz, August 13, 2026). The draft's sentence "it could charge double and lose almost no demand" describes what the company then did, at peak hours, before the draft's date. A 2027 reader sees a page that did not know its subject's pricing moved the week it was written, and that proposed a test already answered.
- **Evidence:** DeepSeek API docs, V4-Pro GA note dated 2026-08-13 (`api-docs.deepseek.com/news/news260813`): "peak and off-peak rates … effective August 16, 2026 at 16:00 UTC … off-peak 50% lower than peak." DeepSeek API pricing page (`api-docs.deepseek.com/quick_start/pricing`, fetched 2026-08-22): the rates above and "Effective 00:00 (Beijing Time) on Sunday, August 23, 2026, we will adjust our peak/off-peak billing rules." Secondary: aipricing.guru (August 6 warning, pre-hike list prices V4-Pro $0.66/$1.98, V4-Flash $0.22/$0.66); Quartz headline "up to 1,100% starting Aug. 16" (page returned 403; headline and search snippet only). Evidence packet, unresolved question 8 and the final research-limitation bullet, which told evaluators not to assume prices stayed flat.
- **What this does not prove:** It does not refute the Type 5 reading. Peak/off-peak pricing with the floor unchanged is consistent with capacity rationing rather than margin-taking, and the purported transcript's own "recover the cost in ten months" rule could survive a hike if hardware costs or demand changed. The reviewer's job here is durability, not typing: the draft must know this happened and say what it means, not pretend the question is still open in its original form.
- **Minimum viable repair:**
  - Convert locations 1–6 to dated, past-or-attributed tense: "As of the purported May 2026 meeting, the rule he described was…"; "priced, through mid-2026, to…".
  - Add one paragraph (best placed as the closing beat of "Four of the 118 points," replacing the current test paragraph) stating the August 2026 facts in the draft's own terms: the August 6 warning on the pricing page, the August 16 peak/off-peak rates at 2× with the floor unchanged, and what a ten-month-payback founder would and would not do under a compute ceiling.
  - Rewrite the test so it is still open after August 2026. Candidates: whether the off-peak floor rises above the pre-hike list price; whether the hike outlives the compute shortage that DeepSeek's own V4-Flash demand created; whether pricing rises again after the listing beyond what capacity explains. Mirror the rewritten test in the Rabbit Hole Counterarguments.
  - Retitle FAQ 7 from "Why does DeepSeek keep its prices so low?" to a question that stays true ("How does Liang Wenfeng say DeepSeek sets its prices?") and add one sentence on the August 2026 change.
  - Consider whether `persona_title` "The Quant Who Takes Less" and `meta_title` "Won't Take More" need a hedge. They can stand if the body argues rationing-as-restraint; they cannot stand on the current body.
- **Expected benefit:** The page's checkable claim becomes correct on publish day and stays correct; the "what would change my mind" move becomes a live commitment instead of a missed one; the title frame is defended rather than exposed.
- **Confidence:** High that the claims are dated (DeepSeek's own pages). Medium on the exact percentage figures (secondary sources disagree on pre-hike prices; Quartz and Dataconomy returned 403).
- **Acceptance test:** (1) No sentence in the body, TL;DR, FAQ, or description asserts present-tense cost-only pricing without an "as of" date. (2) The body contains the words "August 2026" adjacent to "peak" or "price increase." (3) The falsification test names a condition that has not occurred as of the draft's date. (4) `grep -n "after the IPO" draft.md` returns zero hits, or each hit is inside the rewritten, still-open test.

### FUTURE-R2 — CONCERN — "Richest AI founder alive" and the $36B figure sit undated in title-level slots

- **Passages:** `description`: "Why does the richest AI founder alive price DeepSeek…"; Intro ¶2: "called him the richest person alive who has built an AI model"; Ending ¶2: "$36 billion, richest AI-model founder alive."
- **Reader effect:** Rankings of this kind flip with one funding round at Anthropic or OpenAI. The description is what shows in search results for years; a stale superlative there reads as an old page before the reader clicks.
- **Evidence:** Bloomberg 2026-07-14 (packet S06) is the sole basis, and it is a rank at a date. Net worth moved $36B → $37.9B in 18 days within the packet window alone.
- **Minimum viable repair:** In the description, replace the superlative with a dated or rank-free phrase ("a founder worth ~$36B by mid-2026"). In the body, add "in July 2026" at both rank mentions (the intro already has the date one sentence later; the ending does not).
- **Expected benefit:** The SERP snippet stops aging.
- **Confidence:** High.
- **Acceptance test:** Every occurrence of "richest" in the file is within one sentence of a month-year.

### FUTURE-R3 — CONCERN — The second funding round is narrated as resolved while unsigned, with a disputed size and year-less dates

- **Passages:** Intro ¶3: "lined up to put in another 50 billion yuan … The round stayed frozen for eleven days." TL;DR: "Eleven days: what telling investors the truth … cost him. He paid it." 118-points: "By August 5 the round was back on, at a valuation near $74 billion (Bloomberg, August 6). The truth cost eleven days and no money at all. He had already priced it." Rabbit Hole: "The July funding pause reads as the Five pulling the door shut."
- **Reader effect:** "Back on," "no money at all," and "He paid it" assert an outcome. The packet's sources say the round _reopened_ with signing expected late August 2026 (S08, S09); nothing in the packet shows it closed. The 50-billion-yuan figure is Chinese-media (S09), not Bloomberg's (S07 says "at least 10 billion yuan"), but the sentence attributes it to Bloomberg. "Eleven" depends on an August 5 aggregator date versus Bloomberg's August 6. None of these August dates carries a year. In 2027 the reader knows how the round ended; if it ended at a different number, or later, or not at all, three sentences are wrong and one count is off.
- **Evidence:** Packet timeline rows 2026-07-25, 08-05, 08-06; unresolved questions 2, 3, 4. Search on 2026-08-22 (asiafinancial, ventureatlas, BigGo) still describes signing as expected, not done.
- **Minimum viable repair:** Change "the round was back on" to "the round reopened"; drop "and no money at all" or condition it ("at no reported discount"); add "2026" to the first August date in each section; either attribute "50 billion yuan" to Chinese financial media or use Bloomberg's "at least 10 billion yuan"; write "eleven or twelve days, depending on the source" or "under two weeks."
- **Expected benefit:** The passage survives any closing outcome; the Bloomberg attribution stops carrying a number Bloomberg did not print.
- **Confidence:** High on the status; medium on which round size is right.
- **Acceptance test:** No sentence asserts the round closed; every August date in the 118-points section has a year; "50 billion" is attributed to a source that printed it.

### FUTURE-R4 — CONCERN — IPO in the future tense, "still controls," and "roughly four-fifths" will all move within twelve months

- **Passages:** Intro ¶2: "DeepSeek, which he still controls, … begun preparing a 2027 stock listing." Personal-life ¶4: "roughly four-fifths of a company headed for the stock market." Ending ¶3: "The IPO will hand him a number that updates every morning."
- **Reader effect:** In August 2027 one of three things is true: the listing happened (then "will hand him" is stale and the stake is diluted by the ~$8B round plus IPO float), it slipped (then "2027" is wrong), or it was shelved. The stake fraction is already a hedge across 78/81.7/84% figures (packet CLM-50) and dilutes mechanically with the second round.
- **Evidence:** Packet S06 (2027 target), S08 (round at ~$74B post, i.e., ~10% dilution on close), CLM-50.
- **Minimum viable repair:** "the 2027 listing Bloomberg reported he was preparing"; "roughly four-fifths as of mid-2026, before the second round"; ending: "A listing, if it comes on the 2027 schedule Bloomberg reported, will hand him…" or recast the ending on the daily-updating valuation he already has.
- **Expected benefit:** The ending reads as authored with knowledge of its date instead of as a prophecy.
- **Confidence:** High.
- **Acceptance test:** "will hand him" is either removed or inside a conditional clause naming the reported target year; the stake fraction carries an as-of date.

### FUTURE-R5 — CONCERN — The personal-life section's negative claims are exactly the absences an IPO process tends to end

- **Passages:** H2 "Why nobody can find Liang Wenfeng's personal life"; "No video interview with Liang Wenfeng exists"; "In thirteen years as a founder he has sat for two long interviews, both with the same reporter"; "No reputable outlet has established whether he is married"; FAQ "How old…": "No reputable source has published his exact birth date"; "He has not commented on the figures."
- **Reader effect:** These are true as of August 2026 and are well supported by absence (packet CLM-44, CLM-45). But the subject is on a listing track with at least one roadshow ahead, a prospectus that will state age and shareholding, and a second closed-door investor session already leaked once. A 2027 reader may arrive after the first on-camera appearance or after a prospectus gave the birth date. The H2 and the "thirteen years" arithmetic will then read as dated, and the "nobody can find" premise as a page that stopped looking.
- **Evidence:** Packet research limitations (negative claims supported by absence only); Bloomberg 2027 listing target (S06).
- **Minimum viable repair:** Add "as of August 2026" to the section's first sentence and to FAQ 2 and FAQ 3; change "thirteen years" to "from 2013 to 2026"; keep the H2 but make its first paragraph the one that carries the date. Add the prospectus to the refresh list below.
- **Expected benefit:** The section stays honest if any absence ends; the refresh point is pre-marked.
- **Confidence:** High that the claims are fragile; no evidence they have expired yet.
- **Acceptance test:** Each negative claim in this section and the two FAQs is within one sentence of a month-year.

### FUTURE-R6 — CONCERN — Title-level dependence on a purported document, with no in-text "as of" on its status

- **Passages:** `title` and `persona_title` (Takes Less); keyword "Liang Wenfeng restraint is a strategy"; Intro ¶4 "the sentence people now quote back at him: 'Restraint is a strategy.'"; the whole "Four of the 118 points" section.
- **Reader effect:** The draft labels the transcript purported and gives the NBD caveat (FUTURE-H3), which is correct. What it lacks is a date on the silence: "DeepSeek has never confirmed the document" is true as of August 2026 and will be read as a claim about 2027. If DeepSeek confirms, denies, or a speaker-labeled recording surfaces (the company is fundraising from parties who attended), the draft needs one line changed, but only if that line is dated now.
- **Evidence:** Packet unresolved question 1; search on 2026-08-22 finds no DeepSeek statement either way.
- **Minimum viable repair:** "As of August 2026, DeepSeek had neither confirmed nor denied the document." Same in FAQ 8.
- **Expected benefit:** Turns an open-ended negative into a dated one; makes the refresh edit a find-and-replace.
- **Confidence:** High.
- **Acceptance test:** "has never confirmed" / "has not confirmed" appears only with a month-year.

### FUTURE-R7 — CONCERN — Relative-language inventory

- **Passages and the twelve-month problem with each:**
  - Catfish ¶7: "V3, R1, and now V4 have all shipped with open weights under an MIT license." "Now" dates the sentence to the V4 era, and the packet notes the original V3 weights were under the DeepSeek Model License, with MIT arriving with V3-0324 (CLM-39). A 2027 reader will know V5 or later and may know the license nuance.
  - Intro ¶4: "the sentence people now quote back at him." "Now" = July–August 2026.
  - Catfish ¶3: "the largest one-day drop for any company in history." True at the time; any larger drop in the next year (plausible for a multi-trillion-dollar stock) makes it wrong without "at the time."
  - Rabbit Hole Counterarguments: "Among the 74 tech founders and executives on 9takes, 16 type as Fives, the densest concentration in the catalog." The catalog changes monthly; the packet already notes Type 3 leads the bucket at 19 (S44), so "densest concentration" is a different claim from "16 of 74." Fragile and possibly already imprecise.
  - Personal-life ¶1: "thirteen years as a founder" (covered in R5).
  - Timeline item "2026": fine as a dated row; no change.
- **Minimum viable repair:** "V3 (from its March 2025 re-release), R1, and V4"; "the sentence people quoted back at him that summer"; "the largest one-day drop for any company up to that point"; restate the corpus line as a count with a date and drop "densest," or link the live stat and say "at the time of writing."
- **Expected benefit:** Removes every sentence that silently assumes the reader is in 2026.
- **Confidence:** High on the dating; medium on the V3 license nuance (packet-sourced, not re-checked here).
- **Acceptance test:** `grep -n -E "\bnow\b|in history|densest|thirteen years" draft.md` returns zero hits in reader-visible prose, or each hit is inside a direct quotation.

### FUTURE-R8 — CONCERN — The July pause is given a motive the sources do not supply, and later reporting could contradict it

- **Passages:** TL;DR: "Eleven days: what telling investors the truth about the gap with America cost him. He paid it." 118-points close: "The truth cost eleven days." Rabbit Hole: "froze his own funding round rather than soften a transcript."
- **Reader effect:** The draft reads the pause as the price of candor. Bloomberg (S07) and the Chinese reporting (S41) describe frustration that private remarks became public, which is a different motive. This is interpretation, and the draft is entitled to one, but it is stated as fact in the TL;DR. Twelve months out, a prospectus risk-factor, an investor's account, or Liang's own remark could supply the actual reason; "rather than soften a transcript" is the kind of line that then reads as invented.
- **Evidence:** Packet unresolved question 4.
- **Minimum viable repair:** Mark the reading as the draft's: "reads as the price of candor"; "paused the round after the leak rather than, as far as the record shows, softening anything." Keep the Type 5-vs-9 discriminator but attribute it.
- **Expected benefit:** The interpretation survives contradiction as an interpretation.
- **Confidence:** Medium. This is the least temporal of the concerns and is recorded mainly because the TL;DR states it flatly.
- **Acceptance test:** The TL;DR bullet and the 118-points close contain a hedge word ("reads as," "on the record so far") or attribute the motive to a source.

## Specific improvements

**FUTURE-I1 (from R1). Add a dated August 2026 pricing beat and reopen the test.**

- Location: closing paragraph of "Four of the 118 points" (currently "A fifth point…"), plus TL;DR bullet 4, FAQ 7, key-stat label, ending ¶2.
- Reader effect: the page knows what its subject did the week it was written.
- Evidence: DeepSeek api-docs news 2026-08-13; pricing page fetched 2026-08-22; packet unresolved 8.
- Minimum viable repair: as in R1. One new paragraph (~120 words), five tense edits, one FAQ retitle.
- Expected benefit: removes the only claim a casual reader can falsify in one click.
- Confidence: high.
- Acceptance test: R1's four-part test.

**FUTURE-I2 (from R2, R4, R5, R6). One "as of" pass.**

- Location: description; intro ¶2; personal-life ¶1 and ¶4; FAQ 2, 3, 6, 8; ending ¶3.
- Reader effect: every fragile figure and every negative claim reads as a dated observation.
- Evidence: packet CLM-03, 44, 45, 50.
- Minimum viable repair: insert a month-year within one sentence of each; convert the ending's IPO sentence to conditional.
- Expected benefit: the page ages like a dated profile, not like a news story.
- Confidence: high.
- Acceptance test: the per-item tests in R2, R4, R5, R6.

**FUTURE-I3 (from R3). Round status, attribution, and years.**

- Location: intro ¶3; 118-points ¶ beginning "When the document leaked in July."
- Reader effect: no sentence asserts an outcome the sources did not report.
- Evidence: packet unresolved 2–4; S07 vs S09.
- Minimum viable repair: "reopened" for "back on"; drop or condition "no money at all"; fix the 50-billion attribution; add "2026" to the first July and first August in each section.
- Expected benefit: survives any closing outcome.
- Confidence: high.
- Acceptance test: R3's test.

**FUTURE-I4 (from R7). Relative-language sweep.**

- Location: the five passages listed in R7.
- Reader effect: no silent 2026 assumption.
- Evidence: R7.
- Minimum viable repair: the five substitutions in R7.
- Expected benefit: small per item, cumulative in a page built to rank for years.
- Confidence: high.
- Acceptance test: R7's grep.

**FUTURE-I5 (optional, from "What surprised me"). Make the durable core visibly the spine.**

- Location: intro ¶¶2–4.
- Reader effect: a 2027 reader who has forgotten the July 2026 leak still gets the hook.
- Evidence: the removal test described above.
- Minimum viable repair: none required; if the editor is trimming, the July–August material is the safest place to cut because the thesis does not depend on it. Do not cut the Yan Junjie open or the stamp album.
- Expected benefit: lower refresh cost next year.
- Confidence: medium; this is a structural preference, not a defect.
- Acceptance test: the diagnosis section cites no source dated later than 2025 except the purported transcript.

### Twelve-month refresh list (concrete)

Check each of these before the August 2027 refresh, in priority order:

1. **DeepSeek API pricing page** (`api-docs.deepseek.com/quick_start/pricing`): has the off-peak floor risen above the pre-August-16-2026 list price? Did the peak/off-peak split persist after the compute crunch? Any further hike after a listing? Update the test paragraph and FAQ 7.
2. **Second funding round**: did it close, when, at what post-money, and who led (Monolith was "in talks" per Bloomberg, August 6, 2026)? Update intro ¶3, 118-points close, and the "50 billion yuan" attribution.
3. **Listing**: filed? Where (HKEX / STAR)? Listed? If a prospectus exists, harvest: exact birth date (FAQ 2), marital status if disclosed (FAQ 3), exact pre- and post-IPO stake (personal-life ¶4, FAQ 6), and any risk-factor language about the May 2026 meeting (R6, R8).
4. **Transcript status**: any DeepSeek confirmation, denial, or a speaker-labeled recording. One-line edits at intro ¶4, 118-points ¶1, FAQ 8.
5. **First on-camera appearance**: any roadshow, listing-ceremony, or state-media footage. If it exists, rewrite personal-life ¶1 and the working-notes research limitation, and add a demeanor check against the Businessweek description.
6. **Net worth and rank**: refresh the July 2026 / August 2026 figures; check whether "richest AI-model founder" still holds versus Amodei and Brockman.
7. **Model lineup and licenses**: "now V4" → whatever shipped; confirm each named model's license on Hugging Face.
8. **Nvidia one-day-drop record**: still $589B on January 27, 2025?
9. **9takes corpus stat**: re-run `corpus-stats` and restate the count.
10. **Team stability** (#37 is the fear beat): any senior departures reported in the year. If the "only core interest" was tested, the draft has a new paragraph to write, not a correction.

## Follow-on questions

**FUTURE-Q1. Did the August 16, 2026 change raise the floor or only add a peak surcharge?** If off-peak equals the old list price, the hike is defensible as rationing and the "ten-month payback" rule may still hold; if the floor rose, "priced to cost and no more" is over. This decides how the new test paragraph is written. Best source: Wayback Machine captures of `api-docs.deepseek.com/quick_start/pricing` from early August versus late August 2026, plus the Quartz and Dataconomy pieces (both 403 to this reviewer).

**FUTURE-Q2. Does the second round sign by late August 2026, and at what number?** Changes "back on," "no money at all," and the eleven-day count. Best source: Bloomberg or Caixin; Chinese-language 财新 / 晚点 for the yuan figures.

**FUTURE-Q3. Will a listing prospectus publish his birth date, marital status, and exact stake?** Changes FAQ 2, 3, 6 and the "nobody can find" section. Best source: HKEX or Shanghai STAR filing index, 2027.

**FUTURE-Q4. Has DeepSeek made any statement about the May 20, 2026 meeting?** Changes the cold open, 118-points ¶1, and FAQ 8 by one line each. Best source: DeepSeek's official WeChat account and `api-docs.deepseek.com/news`.

**FUTURE-Q5. Was "richest AI-model founder" still true at any later Bloomberg index date?** Changes the description and two body sentences. Best source: Bloomberg Billionaires Index profile page.

## Preserve list

Passages that must survive revision because they are the draft's time-stable core:

- The epigraph: "People may think there's some hidden business logic behind this, but it's mainly driven by curiosity." (36Kr, 2023)
- The Yan Junjie cold open, including the half-hour delay before "I am Liang Wenfeng."
- "Verifying whether our hypotheses are correct. If they are, that's immensely satisfying." and the sentence after it: "Most founders answer that question with a market. He answered it with an experiment."
- The entire childhood section: stamp loop, "finished high-school maths in middle school," 806/900, one school on the form, "Certain."
- "Self-taught, self-funded, self-transported. … Then he disappeared."
- The 2021 apology beat: "The machine had done the one thing its owner refuses to do. It reached for more, and the firm said sorry for it in public."
- The GPU timeline through 2022 and "The stamps had become chips."
- The hiring doctrine quote and Zihan Wang's "a luxury that few fresh graduates would get at any company."
- "We didn't mean to become a catfish" and the football-in-Wuchuan sentence on the $589B day.
- The critics' paragraph and its concession: "Those facts hold, and no personality lens dissolves them."
- "Open source is more of a cultural behavior than a commercial one, and contributing to it earns us respect." and the publish-the-map / hide-the-engine framing (with the card-count sentence softened per packet CLM-40, which is outside this lens).
- "The real gap is the difference between originality and imitation." and the paragraph it anchors.
- The structure of the anomaly paragraph (two sentences, three years apart, left open with a test), even though the test text must change.
- "One strange thing is, the thing you most want to get, you can't get." as the ending's engine.
- The FAQ net-worth answer's "The number moves daily with DeepSeek's valuation."

## Research log

Research questions stated before searching: (Q1) has DeepSeek raised or signaled API price increases in 2026; (Q2) what is the second round's status as of late August 2026; (Q3) has DeepSeek addressed the transcript's authenticity.

| #   | Source                                                                                                                     | Date                                      | What it decided                                                                                                                                                                                                                                                                                                            |
| --- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Evidence packet (`evidence-packet.md`, compiled 2026-08-22)                                                                | read first, in full                       | Supplied the dated timeline, the disputed round-size and restart-date items (R3), stake figures (R4), negative-claim basis (R5), transcript status (R6), V3 license nuance (R7), pause-motive dispute (R8), and the explicit warning on 2026 pricing (unresolved 8; final limitation bullet) that prompted Q1.             |
| 2   | WebSearch "DeepSeek API price increase August 2026"                                                                        | 2026-08-22                                | Surfaced Dataconomy (Aug 6 warning), Quartz (Aug 13: "up to 1,100% starting Aug. 16"), aipricing.guru, edenai, BenchLM. Established that a hike existed and predated the draft. Snippet-grade only.                                                                                                                        |
| 3   | DeepSeek API docs, V4-Pro GA release note `api-docs.deepseek.com/news/news260813`                                          | page dated 2026-08-13; fetched 2026-08-22 | Primary confirmation: peak/off-peak rates effective 2026-08-16 16:00 UTC, off-peak 50% below peak. Decided R1 is a blocker, not a concern.                                                                                                                                                                                 |
| 4   | DeepSeek API pricing page `api-docs.deepseek.com/quick_start/pricing`                                                      | fetched 2026-08-22                        | Primary: current peak/off-peak rates for V4-Pro, V4-Flash, V4-Flash-Vision-Exp; further billing-rule change effective 2026-08-23. Gave the "2× at peak" figure used in R1.                                                                                                                                                 |
| 5   | aipricing.guru, "DeepSeek API price increase warning"                                                                      | 2026-08                                   | Secondary: Aug 6 warning text ("significant increase expected") posted beneath the pricing table; pre-hike list prices (V4-Pro $0.66/$1.98; V4-Flash $0.22/$0.66). Used to infer off-peak = old price. Conflicts with edenai's "current" V4-Flash $0.14/$0.28, so percentages are reported as press figures, not computed. |
| 6   | edenai.co pricing-volatility post                                                                                          | 2026-08                                   | Secondary; only used to note the conflicting pre-hike figures. No new decision.                                                                                                                                                                                                                                            |
| 7   | WebSearch "DeepSeek funding round signed valuation … August 2026" (asiafinancial, ventureatlas, BigGo, PYMNTS)             | 2026-08-22                                | Round reopened ~Aug 6; signing "expected late August"; no source reports a close. Decided R3's "unsigned" status.                                                                                                                                                                                                          |
| 8   | WebSearch "DeepSeek responds leaked transcript … authenticity" (SCMP, Dealroom, startuphub, China Academy, Momentum Works) | 2026-08-22                                | No DeepSeek statement found; NBD institutional confirmation remains the only vouch. Decided R6 is a dated-negative concern, not a blocker.                                                                                                                                                                                 |

Unreachable: Quartz (403), Dataconomy (403). Their claims are carried here as headline/snippet only and labeled as such.

Source count beyond the packet: three primary/secondary fetches for the potential blocker (items 3, 4, 5), two auxiliary (6, 7/8 searches). Within the 2–4 plus-one allowance.

## Limits of this review

- I cannot know events after 2026-08-22. Every "will" in this review is a risk statement, not a prediction; the refresh list is where to look, not what will be found.
- The price-hike percentages are press-reported; two secondary sources disagree on pre-hike V4-Flash prices, and the two most specific articles returned 403. What is primary-sourced is: the August 6 warning existed on DeepSeek's page (via aipricing.guru's description), the August 13 note set peak/off-peak effective August 16 (DeepSeek), and the current page shows peak at 2× off-peak with an August 23 rule change (DeepSeek).
- I did not adjudicate whether peak/off-peak rationing is or is not "restraint." That is the enneagram and critic lanes; this review only establishes that the draft's tense and test are already dated.
- Bloomberg originals were not read (paywall); round figures are via the packet's syndicated copies and aggregator search results.
- I did not read `subject.md`, `fan.md`, `critic.md`, `unfamiliar.md`, or `enneagram.md`, and did not anchor on the fresh-eyes, second-pass, or cohesion notes embedded in the snapshot beyond noting that the second-pass note itself lists the transcript's status as a refresh point.
- The V3 license nuance (R7) and the pause-motive dispute (R8) are packet-derived and not independently re-verified here.
- `lastmod` is user-managed and was not evaluated.
