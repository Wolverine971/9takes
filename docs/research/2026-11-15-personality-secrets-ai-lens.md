<!-- docs/research/2026-11-15-personality-secrets-ai-lens.md -->
# Where the secrets are: personality psychology through an AI lens

Date: 2026-11-15. Five parallel research agents, each on one angle:

1. Myths everyone repeats
2. Surface-level concepts that run deep
3. Codes AI could crack
4. Guru knowledge vs. research
5. Truths obvious from the aggregate, invisible from N=1

The synthesis comes first. Condensed agent findings with sources follow.

**Confidence note:** most numbers were checked against abstracts or publisher pages. Full texts were read only for Hook et al. 2021. These figures come from secondary or press coverage only:

- Perception Gap ("about 2x")
- Spotlight effect percentages
- MBTI retest flip rate
- Pittenger 2005
- The claim that Enneagram self-typing agrees only about 55% of the time, which is unconfirmed

Verify before quoting any of these in published content.

---

## Synthesis

### The meta-secret

The four research angles that touched on motive reached the same conclusion on their own. The Enneagram's real insight isn't "nine types." It's that a person's motive can't be found by asking them, but it shows up in what they write and in what others see.

- Implicit motives and self-reported motives correlate at only r ≈ .13 (Köllner & Schultheiss 2014, n=6,151). Every Enneagram test is a self-report questionnaire, which is the one method this research says can't reach motive.
- Implicit motives are measured from free text about ambiguous situations. Since 2025, language models score them at expert level (ICC .85–.89, Nilsson et al., JPSP).
- Friends judge evaluative traits better than you judge yourself (Vazire 2010). The Enneagram "passions" (pride, envy, vainglory) are exactly those evaluative traits.
- The same emotion runs on different appraisals (Kuppens). How someone reads the situation explains reactions better than how strongly they react emotionally.

That describes 9takes's format: a free-text answer to a concrete situation, written before seeing the crowd, then compared with other perspectives. **9takes is accidentally the right measurement instrument for the one thing the Enneagram claims and the research can't currently measure.** Nobody has tested whether Enneagram motives show up in natural writing. That is the open problem worth cracking.

### The secrets, ranked

1. **Motive can't be reached by self-report, but it is visible in text.** See above. Leverage: build a motive fingerprint from a user's takes, then show the gap ("you say 3, your takes read affiliation").
2. **Misery has more company than people think.** People underestimate how much negative emotion their peers feel (Jordan 2011). The average person keeps 13 secrets (Slepian 2017). Showing people the hidden distribution changes their behavior (Prentice & Miller 1993; Schroeder & Prentice 1998). That makes the reveal an intervention, not just entertainment. Possible pitch: "See what people actually feel when no one's watching."
3. **Severity and type are separate axes, and the gurus saw this first.** Riso-Hudson's Levels of Development match DSM-5's Level of Personality Functioning and ICD-11's move to a single severity scale. At the severe end, the types converge, as the "g" factor of personality pathology predicts (Sharp et al. 2015). Nobody has tested this directly. It's the best "guru ahead of research" story.
4. **People see the other side about 2x more extreme than it is.** The gap is worst among the most engaged (More in Common 2019; Robinson et al. 1995). This is the measurable form of the movement belief. Leverage: "Predict the Nine," where you guess how other types answered before the reveal and then see your own perception gap.
5. **You contain all nine.** Most variation in behavior happens within one person, not between people (Fleeson 2001). Averages are stable, but the spread is wide. A type works as a center of gravity, not a box. This fits the evidence better than "you are a 4."
6. **The stable unit of personality is an if-then trigger, not an average.** For example: "if corrected by an adult, I lash out" (Shoda, Mischel & Wright 1994). Leverage: write questions as if-then situations, and run a "what sets off each type" series.
7. **People want to be known more than praised.** Self-verification (Swann) explains why naming the uncomfortable core is the hook. It also explains why the Barnum effect makes every type description feel true. The defense against Barnum is contrast between types.

### What everyone gets wrong

| Myth                                          | What the evidence says                                                                                                                                                                                                                                                                                                            |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A childhood wound made you this way           | Memories of maltreatment and documented records agree at only κ=0.19. A record without the memory carries no extra risk. The current story is what predicts outcomes (Danese, JAMA Psych 2019). Shared family environment explains about 0% of adult personality, so siblings routinely end up different types.                   |
| Your type is fixed for life                   | Mean-level traits change across the lifespan. Enneagram interview typing 2.5 years apart agreed at only κ=.48.                                                                                                                                                                                                                    |
| The Enneagram is validated, or it's astrology | Both are wrong. Big Five correlations come out as predicted (9 of 9 studies for Types 1, 5, 7, 8 and 9). But no study recovers nine clusters, expert interviewers agree at κ=.20, and wings and arrows have almost no support. The arrow sequence 1-4-2-8-5-7 comes from the repeating decimal of 1/7, not from observing people. |
| Insight leads to change                       | Wanting to change doesn't predict change. Completing behavioral challenges does. Taking on challenges and then failing them predicts change in the opposite direction (Hudson 2019). Interventions shift traits by d≈.37 in about 24 weeks (Roberts 2017).                                                                        |
| Venting is healthy                            | 154 studies say no. What works is lowering arousal (Kjærvik & Bushman 2024).                                                                                                                                                                                                                                                      |
| Love languages                                | There's little support for a primary language, for exactly five, or for matching (Impett 2024).                                                                                                                                                                                                                                   |
| Attachment styles are four boxes              | Attachment is dimensional (Fraley 2015).                                                                                                                                                                                                                                                                                          |
| Trauma breaks people                          | Resilience is the modal response, about two-thirds of people (Bonanno 2018).                                                                                                                                                                                                                                                      |
| Hard times made me grow                       | Self-reported growth is unrelated to measured growth (Frazier 2009).                                                                                                                                                                                                                                                              |

### What AI could crack now, using 9takes's own assets

| Study                                         | Data needed                                                                                                                | Cost                           | Why it matters                                                                            |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| A. Enneagram-in-Big-Five map                  | Embed the nine types' core fear and desire statements alongside personality-scale items (SurveyBot3000; Wulff & Mata 2025) | ~$0, about 1 day, no users     | Shows whether each type is the Big Five renamed or holds something extra. Flagship chart. |
| B. Reputation vs. words                       | Have models type the ~300 celebrities by name only, then from anonymized quotes                                            | ~$20–50                        | "Does AI know the person, or just the internet's opinion?" Viral either way.              |
| C. AI caricature test                         | Do AI-written type takes vary less, and get classified more easily, than human ones?                                       | Small                          | Honest-brand story, plus a quality check on 9takes's AI takes.                            |
| D. Motive scoring vs. type                    | Off-the-shelf motive models run on typed takes                                                                             | Needs ~300 typed people        | The most Enneagram-native finding available.                                              |
| E/F. Type from text; does type shape answers? | Typed takes                                                                                                                | Needs ~150–1,000+ typed people | The core clustering hypothesis.                                                           |

**Bottleneck:** about 80% of takes have no type (see memory `project_anonymous_takes_no_type`). Studies D–F need a type picker on the answer form.

### Strategic read

The evidence supports 9takes's product premise (perspectives, outside observers, hidden base rates) more strongly than the Enneagram's label premise. Lean into "nine lenses, and you contain all of them" and the hidden distribution. Treat "you are a 4" as a best-fit profile, which still lets people pages commit to a type.

---

## Agent findings (condensed, with sources)

### 1. Myths

- **Childhood wound:**
  - Baldwin, Reuben, Newbury & Danese 2019, JAMA Psychiatry (16 studies, n=25,471, κ=0.19): https://pmc.ncbi.nlm.nih.gov/articles/PMC6551848
  - Danese & Widom 2020, Nature Human Behaviour.
  - Hook 2021 found no studies testing Enneagram etiology.
- **Heritability:** about 0.40 (twin studies 0.47). Shared environment is near zero.
  - Vukasović & Bratko 2015: https://hrcak.srce.hr/en/181130
  - Turkheimer 2000.
- **Change after 30:**
  - Bleidorn et al. 2022, Psych Bulletin.
  - Roberts, Walton & Viechtbauer 2006.
  - Harris et al. 2016 (age 14 to 77, n=174, no significant stability): https://pmc.ncbi.nlm.nih.gov/articles/PMC5144810
  - Gamard 1986: Enneagram interview typing 2.5 years apart, κ=.48.
- **Insight vs. behavior:**
  - Roberts et al. 2017, 207 studies, d=.37.
  - Hudson, Briley, Chopik & Derringer 2018, JPSP.
- **Types vs. dimensions:**
  - Haslam et al. 2012/2020, taxometric meta-analysis: https://pubmed.gov/32493520/
  - Fraley et al. 2015 (attachment).
  - Only 48% of RHETI takers had one clear top type. RHETI and WEPSS agreed on type 42% of the time.
- **Enneagram status:** Hook, Hall, Davis, Van Tongeren & Conner 2021, J Clin Psych, 104 samples: https://pubmed.ncbi.nlm.nih.gov/33332604/
  - Big Five links held in 9 of 9 studies for Types 1, 5, 7, 8 and 9.
  - Test-retest .55–.94.
  - Factor analyses usually found fewer than 9 factors.
  - Expert interviewer agreement κ=.20.
  - Sutton, Allinson & Williams 2013: the Enneagram predicted work outcomes about as well as values and motives.
- **Self vs. others:**
  - Vazire 2010.
  - Connelly & Ones 2010: other-ratings predict performance better than self-ratings (263 samples).
- **Venting:** Kjærvik & Bushman 2024, Clin Psych Review, 154 studies, n≈10,189.
- **Post-traumatic growth:**
  - Frazier et al. 2009, Psych Science: https://pubmed.ncbi.nlm.nih.gov/19515115/
  - Boals 2023.
- **Introverts:**
  - Leikas & Ilmarinen 2017: acting extraverted brings delayed fatigue for everyone.
  - Jacques-Hamilton, Sun & Smillie 2019.
- **Love languages:** Impett, Park & Muise 2024, Current Directions.
- **A claim that sounds like hype but holds up:** traits predict mortality, divorce and career about as well as SES and IQ do (Roberts et al. 2007, PPS).

### 2. Surface-level concepts that run deep

1. **Implicit vs. explicit motives:**
   - Köllner & Schultheiss 2014, r≈.13 (power .04): https://www.frontiersin.org/articles/10.3389/fpsyg.2014.00826/full
   - Brunstein et al. 1998: working on goals that match your implicit motives raises well-being; committing to mismatched goals lowers it.
   - Nilsson et al. 2025, LLM motive coding at ICC .85–.89: https://pubmed.ncbi.nlm.nih.gov/40208739/
2. **Naive realism:**
   - Robinson, Keltner, Ward & Ross 1995.
   - Pronin, Lin & Ross 2002.
   - More in Common perception gap: https://moreincommon.substack.com/p/what-we-get-wrong-about-each-other
3. **If-then signatures:**
   - Shoda, Mischel & Wright 1994.
   - Mischel & Shoda 1995 (CAPS).
   - Kammrath et al. 2005.
4. **Whole Trait Theory:**
   - Fleeson 2001.
   - Fleeson & Jayawickreme 2015: https://pmc.ncbi.nlm.nih.gov/articles/PMC4673017
5. **SOKA:** Vazire 2010 (n=165, four friends each); Vazire & Mehl 2008.
6. **Affect labeling and granularity:**
   - Lieberman et al. 2011: people predict labeling won't help, even after it has helped them. https://pmc.ncbi.nlm.nih.gov/articles/PMC3444304
   - Kircanski et al. 2012 (spider exposure).
   - Kashdan, Barrett & McKnight 2015.
7. **Volitional change:**
   - Stieger et al. 2021 PNAS (n=1,523, PEACH app): d≈.52 increase, −.58 decrease; observers detected the increases. https://www.pnas.org/doi/10.1073/pnas.2017548118
   - Hudson 2019: failed challenges backfire.
8. **Self-verification:**
   - Swann, Stein-Seroussi & Giesler 1992.
   - Swann, De La Ronde & Hixon 1994.
   - Forer 1949.
9. **Interpersonal complementarity:** Sadler et al. 2009, JPSP. Warmth invites warmth; dominance invites submission.

### 3. Codes AI could crack

- **Deep lexical hypothesis:** Cutler & Condon 2022: https://arxiv.org/abs/2203.02092v1
- **Embedding map of 459 scales:** Wulff & Mata 2025, NHB: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12106064/
- **SurveyBot3000** predicts item correlations before anyone answers (Hommel & Arslan): https://rr.peercommunityin.org/articles/rec?id=990
- **Celebrity reputation:** Cao & Kosinski 2024, Sci Rep. GPT-3 embeddings of 226 public figures' names predict how the public sees their Big Five, r=.78–.88. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10954708/
- **Silicon samples:**
  - Argyle et al. 2023.
  - Park et al. 2024: interview-based agents of 1,052 people reproduced their survey answers 85% as well as the people themselves did two weeks later. https://arxiv.org/abs/2411.10109
  - Caricature and flattening risk: Wang, Morgenstern & Dickerson, https://arxiv.org/abs/2402.01908
- **Text-based personality:**
  - Schwartz et al. 2013 (75k Facebook users).
  - Park et al. 2015.
  - Youyou, Kosinski & Stillwell 2015: likes predict personality at r=.56, vs. friends at .49.
  - Peters & Matz 2024: zero-shot LLM, r≈.29–.31. https://arxiv.org/abs/2309.08631v1
  - Ensemble LLM, r≈.42 (NHB 2025).
- **Enneagram from text:**
  - No benchmark yet (Abdelhamid 2024).
  - The PANDORA Reddit dataset has some Enneagram labels (Gjurković 2021).
- **Taxometrics:**
  - Haslam 2020: dimensions outnumber categories about 5:1.
  - Gerlach 2018: 1.5M people needed to find even 4 robust types.
  - Clearer Thinking comparison: Big Five > Enneagram > MBTI-style types.
- **Idiographic models:** Beck & Jackson. Most people's own trait structure doesn't match the Big Five.
- **RL parameters as traits:** low retest reliability, ICC .02–.52 (Schaaf 2023). Skip.

### 4. Gurus vs. research

Tags: (a) gurus ahead of research · (b) research contradicts gurus · (c) the two agree, but almost nobody says so.

1. **Levels of Development ↔ DSM-5 Level of Personality Functioning and ICD-11 severity (c/a):**
   - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9881116/
   - Sharp, Wright & Fowler 2015, "g" factor of personality pathology.
2. **Motive is opaque to the self; others type you better (a).** Köllner & Schultheiss; Vazire.
3. **Nine discrete types (b, strong).** Haslam; Hook.
4. **Horney's movements ↔ the interpersonal circumplex (c).** Carlson et al. 2022, J Pers Assess. The Riso-Hudson "compliant" group means compliant to the superego, which has drifted from Horney's meaning.
5. **Wound or lost "holy idea" as origin (b).** Heritability and non-shared environment. Riso-Hudson put temperament first.
6. **Wings and arrows (b).** The arrow sequence comes from 1/7 geometry. What's true instead: people act out of character under pressure (Fleeson; Mischel).
7. **Instinctual variants ↔ Kenrick et al. 2010 fundamental motives (c).** In Kenrick's model, situations switch motives on. Chronic dominance and stacking, and the 27 subtypes, are untested.
8. **Passions and fixations ↔ Young's schemas; hubristic pride (Tracy & Robins); envy (Smith & Kim) (c).** The schema mapping is the agent's own interpretation and untested.
9. **"Type is fixed; only health changes" (b, weak).** Partly right: rank-order stability holds, but traits move with intervention.
10. **Love languages (b).** Impett 2024.
11. **Attachment and trauma TikTok (b on framing).**
    - Resilience about 65% (Galatzer-Levy, Huang & Bonanno 2018).
    - Concept creep (Haslam 2016).
    - 52% of the top 100 #adhd TikToks were misleading (Yeung 2022).
12. **Peterson's Big Five teaching (c).** Mainstream: DeYoung, Quilty & Peterson 2007.

### 5. Obvious from the aggregate, invisible from N=1

1. **Hidden misery:**
   - Jordan, Monin, Dweck et al. 2011: https://pubmed.ncbi.nlm.nih.gov/21177878/
   - Slepian 2017: 13 secrets on average, 5 never told.
2. **Pluralistic ignorance:** Prentice & Miller 1993; Schroeder & Prentice 1998 (exposing the misperception reduced drinking).
3. **Pessimism about how others see us:**
   - Liking gap: Boothby et al. 2018.
   - Beautiful mess effect: Bruk 2018.
   - Gratitude letters: Kumar & Epley 2018.
   - Deep talk: Kardas, Kumar & Epley 2021.
   - Spotlight effect: Gilovich 2000.
4. **Same emotion, different appraisal:** Kuppens et al.
5. **Perception gap and motivated numeracy:** More in Common 2019; Kahan 2017.
6. **Within-person variance is 62–93% of Big Five behavior:** Fleeson 2001.
7. **Barnum:** Forer 1949. Rated 4.26/5 for accuracy. Contrast beats description.
8. **Evaluative factor:**
   - Pettersson & Turkheimer 2012: the general factor of personality is mostly evaluation.
   - Anusic 2009.
   - Implication: balance how flattering the answer options are in typing quizzes.
9. **Reference-group effect:** Heine et al. 2002 and 2008. National self-reported conscientiousness runs backwards against behavioral measures.
10. **Regression to the mean:**
    - Waitlist depression falls 10–15% (Posternak & Miller 2001).
    - About 53% remit within 12 months (Whiteford 2013).
11. **LLM simulation:** personality is written into language. But models learn from public text, which is the masked, suppressed sample. So anonymous human takes hold the private half that AI can't simulate. That's an argument to keep human takes as the core product and AI takes as scaffolding.
