<!-- docs/taskers/T-01-fabricated-citations-science-mental-health.md -->

# Tasker: Fabricated Citations in `enneagram-science-mental-health`

**For:** the agent assigned to contain and resolve the fabricated-citation liability on `src/blog/enneagram/mental-health/enneagram-science-mental-health.md`.
**Owner:** DJ
**Created:** 2026-07-15
**Status:** Remediated and republished 2026-07-15. DJ approved the rewrite from zero. The replacement uses eight verified sources, removes the fabricated clinical and neuroscience claims, and includes a public correction note.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §3 (the slop hall of fame, where the fabrications were catalogued) and §9.3 (the bounded DOI blast radius). Cross-reference tasker `T-03` (quality frontmatter is not a publish gate) for the root-cause fix.

---

## 0. What and why

`src/blog/enneagram/mental-health/enneagram-science-mental-health.md` is `published: true` and is the single worst liability on the site.

It cites 23 DOI links resolving to 19 unique DOIs. Three of those were resolved by hand against the live DOI registry on 2026-07-15. **All three are hijacked.** The pattern is consistent and it is worse than a broken link: the DOI is real, it resolves to a real paper in a real journal, and the article attaches that real DOI to a fabricated author name, a fabricated title, and fabricated findings. A reader who clicks the link lands on a legitimate paper about a completely unrelated subject.

| DOI                         | What the article claims                                                                                                                                                                                                                        | What the DOI actually resolves to                                                                                                                                                                                                                     | Verdict                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `10.1093/brain/awab163`     | "Baron-Cohen et al. (2021)" in _Brain_ found 42% increased DLPFC activity, amygdala coupling of r=-0.45, and 8% larger hippocampal volume by Enneagram type (line 304)                                                                         | "Plasma markers predict changes in amyloid, tau, atrophy and cognition in non-demented subjects." Pereira, Janelidze, Stomrud, Palmqvist, van Westen, Dage, Mattsson-Carlgren, Hansson. _Brain_ 144(9):2826-2836, 2021. Alzheimer's blood biomarkers. | **Hijacked.** No Baron-Cohen. No Enneagram. No fMRI of personality types. |
| `10.1093/scan/nsz091`       | "Hook et al. (2019)" Stanford neuroimaging study in _Social Cognitive and Affective Neuroscience_ identified distinct neural signatures for Enneagram types. Cited twice (lines 103 and 187) under a heading "The Stanford fMRI Study (2019)". | "Neurobiological changes during the peripartum period." Cárdenas, Kujawa & Humphreys, Vanderbilt University. _SCAN_ 15(10):1097, 2019/2020. Pregnancy and postpartum brain changes.                                                                   | **Hijacked.** No Hook. Not Stanford. No Enneagram.                        |
| `10.1016/j.jrp.2016.07.004` | "Wagner & Walker (2016)" meta-analysis of 104 studies found moderate to strong reliability (r = 0.72-0.90) across validated Enneagram assessments. Cited 3+ times (lines 102, 296, 340, 418).                                                  | A longitudinal study of endorsement of achievement goals across secondary school years in 6,908 Korean eighth graders.                                                                                                                                | **Hijacked.** Not a meta-analysis. Not about the Enneagram.               |

The auditor additionally reports the following. **These are NOT independently verified. Treat each as an allegation you must confirm or refute in Step 2, not as established fact:**

- A citation attributed to an author who died in 2012.
- A nonexistent "EMHP study" (Enneagram Mental Health Prevalence, claimed n = 4,585, lines 90, 416, 418, 857).
- A nonexistent "E-CAT" instrument (Enneagram Computerized Adaptive Test, line 166).
- A claimed Stanford fMRI lab ("Dr. Christopher Hook's neuroimaging lab", line 109) that does not exist.

The frontmatter self-certifies `quality_grade: 'A+'`, `quality_score: 9.5`, `quality_safety_gate: 'pass'`, graded 2026-02-22. The real grade from the audit is **1/10**. This gap is the root cause and is addressed in Step 5.

**Why this is urgent, in order:**

1. **It is a mental health page.** The article discusses which therapies and which medications suit which Enneagram type. Fabricated neuroscience on a medical-adjacent page is not a content-quality problem, it is a credibility and liability problem.
2. **It runs under DJ's byline.** `author: 'DJ Wayne'`.
3. **9takes has shipped a legal-risk claim before** (the Tobey Maguire incident). The pattern is established, which raises the cost of a second one.

**Blast radius is bounded, and this is the good news. State it clearly and do not let anyone scope-creep this into a corpus sweep.** Verified 2026-07-15:

```
grep -rl "doi\.org" --include="*.md" src/blog/ | grep -v drafts
# => src/blog/enneagram/mental-health/enneagram-science-mental-health.md
# exactly 1 result
```

This is the **only published blog on the entire site that cites a DOI**. This is a bounded 19-DOI job on one file. It is not an open-ended corpus audit.

**Cost of unpublishing, from GSC:** 4 clicks, 6,032 impressions, 0.07% CTR at average position 10.4. That CTR is the worst on the site. Four clicks is the entire cost of taking this page down today.

---

## 1. Required reading

1. `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §3 (the slop hall of fame) and §9.3 (the bounded DOI blast radius). This is the source report.
2. `src/blog/enneagram/mental-health/enneagram-science-mental-health.md`. Read the whole file, including the JSON-LD block at the bottom. Do not skim.
3. `docs/taskers/T-03-*.md` (quality frontmatter is not a gate). Step 5 of this tasker feeds that one.
4. `src/blog/enneagram/mental-health/enneagram-and-mental-illness.md`. The frozen crown-jewel page. Read it only to judge intent match in Step 4. Do not edit it.
5. `.claude/commands/grade_blog.md`. The pipeline that scored this page A+. Required for Step 5.

---

## 2. The work (in order)

### Step 1: Unpublish today (5 minutes, do this first)

Set `published: false` in the frontmatter of `src/blog/enneagram/mental-health/enneagram-science-mental-health.md`.

Do **not** wait for the audit in Step 2. Do **not** wait for a rewrite. The justification is arithmetic: the page earns 4 clicks and carries fabricated neuroscience on a mental-health page under DJ's byline. Four clicks is the entire cost of being wrong about unpublishing. There is no version of this where "leave it up while we investigate" is the right call.

Change exactly one line. Do not touch `lastmod`. Do not touch anything else in the file in this step.

Report to DJ the moment this is done, before starting Step 2.

### Step 2: Resolve all 19 unique DOIs and build the verdict table

This is the deliverable that determines everything downstream. Until this table exists, nobody can honestly say whether the page is salvageable.

**Extract the DOIs:**

```bash
grep -o "doi\.org/10\.[0-9]\{4,\}/[^ )\"]*" \
  src/blog/enneagram/mental-health/enneagram-science-mental-health.md \
  | sort -u
```

This yields 19 unique DOIs out of 23 total citations (four are cited more than once). The known list as of 2026-07-15:

```
10.1016/j.cortex.2020.12.018      10.1038/s41380-020-00982-2
10.1016/j.jpsychires.2019.04.020  10.1038/s41386-020-00912-4
10.1016/j.jpsychires.2020.03.014  10.1038/s41593-021-00977-4
10.1016/j.jrp.2016.07.004         10.1080/10720162.2019.1670301
10.1016/j.neuroimage.2020.116598  10.1093/brain/awab163
10.1016/j.paid.2021.111456        10.1093/scan/nsz091
10.1016/j.psyneuen.2019.104552    10.1097/NMD.0000000000001016
10.1037/ocp0000179                10.1176/appi.ajp.2017.17040423
10.1037/pro0000280                10.1521/pedi_2017_31_302
10.1037/pro0000384
```

**Resolve each one:**

```bash
curl -s "https://api.crossref.org/works/10.1093/brain/awab163" \
  | python3 -c "import sys,json; m=json.load(sys.stdin)['message']; \
    print(m.get('title')); print([a.get('family') for a in m.get('author',[])]); \
    print(m.get('container-title')); print(m.get('issued'))"
```

Crossref is the primary source. If a DOI 404s on Crossref, retry against `https://doi.org/<doi>` with `curl -IL` to see where it redirects, and record the registry that owns it. A DOI that resolves nowhere is its own verdict (fabricated outright rather than hijacked).

For each DOI, compare the resolved title, author list, journal, and year against what the article claims at each citation site. Use `grep -n` to find every line citing that DOI, since four are cited multiple times and the claims may differ between sites.

**Build the table.** One row per unique DOI, in the file:

| DOI | Claimed (author, year, journal, finding) | Actual (title, authors, journal, year) | Verdict |
| --- | ---------------------------------------- | -------------------------------------- | ------- |

Verdict is one of: **Hijacked** (real DOI, unrelated paper, fabricated attribution), **Fabricated** (DOI does not resolve), **Accurate** (claim matches the paper), **Misattributed** (real paper, real topic, but the claim overstates or distorts its findings).

Three rows are already filled in for you in §0. Verify them yourself anyway, then complete the other 16.

**Also verify the four unconfirmed allegations** from §0 in this same pass: the dead-author citation, the EMHP study, the E-CAT instrument, and the Christopher Hook Stanford lab. For each, search for any evidence the entity exists. Record confirmed / refuted / inconclusive with the evidence. Do not carry them forward as fact if you cannot confirm them.

**Deliverable:** the completed table plus a one-line count, for example "17 of 19 hijacked, 2 accurate."

### Step 3: Decide salvage vs delete, based on the table

The table decides this, not instinct. Guidance:

- **If all 19 (or near-all) are hijacked,** the page has no factual spine. There is nothing to salvage, because every load-bearing claim was reverse-engineered from a fake source. Editing it would mean deleting the entire evidence base and keeping the scaffolding, which is a rewrite from zero wearing a corpse's clothes. The honest moves are: delete outright, or rewrite from zero as an honest piece.
- **If a meaningful minority resolve accurately,** scope a rewrite that keeps only the verified claims and deletes the rest. Report the salvageable word count so DJ can judge whether it is worth the hours.

**The honest-rewrite angle, if DJ wants one.** "What the Enneagram research actually says (spoiler: very little)" is a genuinely defensible 9takes piece, and it is defensible _because_ 9takes sells no test. Every competitor in this space has a commercial incentive to overstate the evidence. 9takes does not. That is a real position and it is the opposite of what the current page does.

**Before recommending a rebuild, check for overlap.** `enneagram-criticisms` already occupies adjacent territory. Read it. If it already makes the honest-limitations argument, the right move may be to strengthen that page rather than build a second one that competes with it for the same query.

Present the recommendation to DJ with the table attached. **Do not delete the file without DJ's explicit sign-off.** Unpublishing (Step 1) is reversible and is yours to do. Deleting is not.

### Step 4: Redirect decision (do not default to the obvious one)

Do **not** 301 this URL to `enneagram-and-mental-illness` without checking intent match first.

`enneagram-and-mental-illness` is the highest-traffic page on the site (287 clicks), it is frozen, and it is the crown jewel. Pointing traffic that arrived looking for fabricated neuroscience citations at the best page on the site is a risk, not a win: mismatched intent produces pogo-sticking, and pogo-sticking on the destination is exactly how you damage a page you cannot afford to damage.

Evaluate in this order:

1. Pull the top queries driving the 6,032 impressions on the current URL from GSC.
2. Ask whether `enneagram-and-mental-illness` actually answers those queries. "Is the Enneagram scientifically valid" and "how the Enneagram relates to mental illness" are different intents.
3. If intent matches, propose the 301. If it does not, propose either no redirect (let it 410) or a redirect to `enneagram-criticisms`, which is closer to the validity question.

Note the URL in play, from the `loc` frontmatter: `https://9takes.com/enneagram-corner/mental-health/enneagram-science-mental-health`.

### Step 5: Root cause, or why the grader rewards the appearance of rigor

The `/grade_blog` pipeline gave this page **A+ / 9.5 / safety_gate: pass**. The real grade is 1/10. This is not a near-miss, it is a total inversion, and it happened for a structural reason.

**The grader cannot resolve a citation.** It has no network call, no DOI lookup, no way to check whether a source exists. So it scores the _signals_ of rigor: the density of citations, the presence of DOI links, the author-year format, the named journals, the specific-looking effect sizes (r=-0.45, 42%, 8%). This article is dense with all of them. It scored well **because** it was fabricated: a real research summary would be hedged, sparse, and full of "we don't know," which reads as weaker to a grader measuring the surface texture of rigor.

This means fabrication is not a random failure the grader missed. It is a strategy the grader actively rewards. Any content pipeline with an unverified grader has a gradient pointing toward invention.

**Recommended fix, to hand to `T-03`:** a lint rule that any blog containing a `doi.org` link must have every DOI resolved and logged before it can be published. Concretely:

- Extract DOIs with the `grep -o` pattern from Step 2.
- Resolve each against Crossref.
- Fail the publish gate on any DOI that does not resolve, or that resolves to a paper whose title shares no meaningful terms with the surrounding claim.
- Log the resolution results next to the file so a human can audit them.

The cheap version of this rule catches the fabricated case (DOI does not resolve). The version that would have caught **this** page needs the title-vs-claim comparison, because every DOI here resolves perfectly. Recommend both, and be explicit with DJ that the cheap version alone would have shipped this article.

Write the recommendation into `T-03`. Do not implement the lint rule under this tasker.

---

## 3. Execution record (2026-07-15)

### 3.1 Containment

`published` was changed from `true` to `false`. `lastmod` remains `2025-12-04`. No other line in the article was changed.

### 3.2 DOI verdict table

Method: extracted all 23 DOI links, deduplicated them to 19, resolved every unique DOI against the live Crossref API, and compared the returned title, authors, journal, and year with every citation site in the article. Despite the tasker's earlier statement that four DOIs repeat, the extraction shows that only two repeat: `10.1016/j.jrp.2016.07.004` appears four times and `10.1093/scan/nsz091` appears twice. Those repetitions account for all four links beyond the 19 unique DOIs.

| DOI                                                                                  | Claimed (author, year, journal, finding)                                                                                                                                                         | Actual (title, authors, journal, year)                                                                                                                                                                                            | Verdict      |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| [10.1016/j.cortex.2020.12.018](https://doi.org/10.1016/j.cortex.2020.12.018)         | Gallese et al. (2021), _Cortex_: Type 2 mirror-neuron activation +31%, TPJ activity d = 0.82, limbic-prefrontal coupling r = 0.71.                                                               | “Characterising the hippocampal response to perception, construction and complexity.” McCormick, Dalton, Zeidman & Maguire. _Cortex_, 2021.                                                                                       | **Hijacked** |
| [10.1016/j.jpsychires.2019.04.020](https://doi.org/10.1016/j.jpsychires.2019.04.020) | Coccaro et al. (2019), journal not named: 18% of Type 8s have intermittent explosive disorder.                                                                                                   | “Efficacy of repetitive transcranial magnetic stimulation using a figure-8-coil or an H1-Coil in treatment of major depressive disorder; A randomized clinical trial.” Filipčić et al. _Journal of Psychiatric Research_, 2019.   | **Hijacked** |
| [10.1016/j.jpsychires.2020.03.014](https://doi.org/10.1016/j.jpsychires.2020.03.014) | Wagner (2020), journal not named: Type 1s have 3.2x higher prevalence of obsessive-compulsive symptoms.                                                                                          | “Abstinence and retention outcomes in a smoking cessation program among individuals with co-morbid substance use and mental disorders.” Lima et al. _Journal of Psychiatric Research_, 2020.                                      | **Hijacked** |
| [10.1016/j.jrp.2016.07.004](https://doi.org/10.1016/j.jrp.2016.07.004)               | Wagner & Walker (2016), journal not named: meta-analysis of 104 Enneagram studies with r = 0.72-0.90 reliability; 71% Type 4 depression; 72% Type 6 anxiety; and the EMHP study of 4,585 people. | “Endorsement of achievement goals across secondary school years: Applying a state-trait framework.” Lee. _Journal of Research in Personality_, 2016.                                                                              | **Hijacked** |
| [10.1016/j.neuroimage.2020.116598](https://doi.org/10.1016/j.neuroimage.2020.116598) | Chen et al. (2020), _NeuroImage_, n = 142: Type 1 ACC activation +23%, OFC d = 0.78, and heightened DLPFC-limbic connectivity.                                                                   | “Transcranial direct current stimulation (tDCS) elicits stimulus-specific enhancement of cortical plasticity.” Boroda, Sponheim, Fiecas & Lim. _NeuroImage_, 2020.                                                                | **Hijacked** |
| [10.1016/j.paid.2021.111456](https://doi.org/10.1016/j.paid.2021.111456)             | Sutton (2022), journal not named: IEQ data produced the first Enneagram Computerized Adaptive Test (E-CAT), cutting assessment time by 60%.                                                      | “On a pedestal: High heels and the perceived attractiveness and evolutionary fitness of women.” Wade, Burch, Fisher & Casper. _Personality and Individual Differences_, 2022.                                                     | **Hijacked** |
| [10.1016/j.psyneuen.2019.104552](https://doi.org/10.1016/j.psyneuen.2019.104552)     | Carré & Archer (2020), _Psychoneuroendocrinology_: Type 8 testosterone +40%, enhanced vmPFC power decisions, and amygdala threat response -35%.                                                  | “Exogenous testosterone increases status-seeking motivation in men with unstable low social status.” Losecaat Vermeer et al. _Psychoneuroendocrinology_, 2020.                                                                    | **Hijacked** |
| [10.1037/ocp0000179](https://doi.org/10.1037/ocp0000179)                             | Clark et al. (2020), journal not named: 71% of Type 3s score above a clinical workaholism threshold.                                                                                             | “Why do emotional labor strategies differentially predict exhaustion? Comparing psychological effort, authenticity, and relational mechanisms.” Huppertz et al. _Journal of Occupational Health Psychology_, 2020.                | **Hijacked** |
| [10.1037/pro0000280](https://doi.org/10.1037/pro0000280)                             | Tolk et al. (2020), journal not named: Essential Enneagram Online selections predicted therapy outcomes with 78% accuracy in 456 outpatients.                                                    | “Prejudiced patients: Ethical considerations for addressing patients’ prejudicial comments in psychotherapy.” Mbroh, Najjab, Knapp & Gottlieb. _Professional Psychology: Research and Practice_, 2020.                            | **Hijacked** |
| [10.1037/pro0000384](https://doi.org/10.1037/pro0000384)                             | Thompson & Davis (2021), journal not named: documented cases of Enneagram misuse in therapy.                                                                                                     | “Reframing paradox.” Browning & Hull. _Professional Psychology: Research and Practice_, 2021.                                                                                                                                     | **Hijacked** |
| [10.1038/s41380-020-00982-2](https://doi.org/10.1038/s41380-020-00982-2)             | Liu et al. (2021), journal not named: Type 1s have lower serotonin, elevated norepinephrine under stress, and dysregulated GABA-glutamate balance.                                               | “Tracing the psychopathology of bipolar disorder to the functional architecture of intrinsic brain activity and its neurotransmitter modulation: a three-dimensional model.” Martino & Magioncalda. _Molecular Psychiatry_, 2021. | **Hijacked** |
| [10.1038/s41386-020-00912-4](https://doi.org/10.1038/s41386-020-00912-4)             | Volkow et al. (2021), _Neuropsychopharmacology_: Type 7 dopamine +35%, nucleus accumbens hyperactivation, and reduced pain-network activation.                                                   | “Prelimbic cortex glucocorticoid receptors regulate the stress-mediated inhibition of pain contagion in male mice.” Lidhar et al. _Neuropsychopharmacology_, 2020.                                                                | **Hijacked** |
| [10.1038/s41593-021-00977-4](https://doi.org/10.1038/s41593-021-00977-4)             | Andrews-Hanna et al. (2022), _Nature Neuroscience_: Type 4 DMN activation +38%, amygdala response d = 1.2, and posterior-cingulate hyperactivation.                                              | “Multiplex encoding of context value.” Mejia. _Nature Neuroscience_, 2021.                                                                                                                                                        | **Hijacked** |
| [10.1080/10720162.2019.1670301](https://doi.org/10.1080/10720162.2019.1670301)       | Brown & Palmer (2020), journal not named: 58% of Type 2s meet codependency criteria.                                                                                                             | “The Moderating Role of the Tendency to Blame Others in the Development of Perceived Addiction, Shame, and Depression in Pornography Users.” Volk et al. _Sexual Addiction & Compulsivity_, 2019.                                 | **Hijacked** |
| [10.1093/brain/awab163](https://doi.org/10.1093/brain/awab163)                       | Baron-Cohen et al. (2021), _Brain_: Type 5 DLPFC activation +42%, amygdala coupling r = -0.45, and hippocampal volume +8%.                                                                       | “Plasma markers predict changes in amyloid, tau, atrophy and cognition in non-demented subjects.” Pereira et al. _Brain_, 2021.                                                                                                   | **Hijacked** |
| [10.1093/scan/nsz091](https://doi.org/10.1093/scan/nsz091)                           | Hook et al. (2019), _Social Cognitive and Affective Neuroscience_: a Stanford fMRI study found type-specific brain networks and predicted Enneagram type at 73% accuracy.                        | “Neurobiological changes during the peripartum period: implications for health and behavior.” Cárdenas, Kujawa & Humphreys. _Social Cognitive and Affective Neuroscience_, online 2019.                                           | **Hijacked** |
| [10.1097/NMD.0000000000001016](https://doi.org/10.1097/NMD.0000000000001016)         | Sierra et al. (2019), journal not named: 45% of Type 9s report dissociative symptoms.                                                                                                            | “Religious Belief at the Level of the Brain.” Gaw. _Journal of Nervous & Mental Disease_, 2019.                                                                                                                                   | **Hijacked** |
| [10.1176/appi.ajp.2017.17040423](https://doi.org/10.1176/appi.ajp.2017.17040423)     | Instanes et al. (2018), journal not named: 62% of Type 7s meet ADHD diagnostic criteria.                                                                                                         | “Sensation and Psychiatry: Linking Age-Related Hearing Loss to Late-Life Depression and Cognitive Decline.” Rutherford et al. _American Journal of Psychiatry_, 2018.                                                             | **Hijacked** |
| [10.1521/pedi_2017_31_302](https://doi.org/10.1521/pedi_2017_31_302)                 | Akhtar & Thomson (2018), journal not named: 34% of Type 5s meet subclinical schizoid-trait criteria.                                                                                             | “High Prevalence of Physical Pain Among Treatment-Seeking Individuals With Borderline Personality Disorder.” Heath, Paris, Laporte & Gill. _Journal of Personality Disorders_, 2018.                                              | **Hijacked** |

**Count: 19 of 19 hijacked; 0 fabricated/non-resolving; 0 accurate; 0 merely misattributed.** All three examples in §0 were independently resolved again rather than copied.

### 3.3 Four alleged fabrications

| Allegation                                             | Finding                                                                                                                                                                                                                                                                                                                                                                                                  | Evidence                                                                                                                                                                                               |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Citation attributed to an author who died in 2012      | **Confirmed.** The article attributes a 2023 _Annual Review of Clinical Psychology_ proposal to “Riso & Hudson.” Don Richard Riso died on August 30, 2012, and no matching Annual Reviews paper was found.                                                                                                                                                                                               | The Enneagram Institute's [ten-year remembrance](https://www.enneagraminstitute.com/remembering-don-riso-10-years/) confirms the death date. Exact-title, author, and journal searches found no paper. |
| “Enneagram Mental Health Prevalence” (EMHP), n = 4,585 | **Confirmed as a fabricated attributed study.** No publication matching the exact study name or sample was found in Crossref, PubMed, or general web search. Its purported DOI resolves to Lee's unrelated study of achievement goals.                                                                                                                                                                   | The DOI result is in the table above. The real 2021 [systematic review of 104 independent samples](https://doi.org/10.1002/jclp.23097) does not report this study or these prevalence figures.         |
| “Enneagram Computerized Adaptive Test” (E-CAT)         | **Confirmed as a fabricated named instrument and publication, with a caveat.** No scholarly record for that name or the claimed Sutton (2022) study was found, and the cited DOI is a paper about high heels. Commercial Enneagram assessments using generic computerized-adaptive-test technology do exist, so the narrower fabrication is the named E-CAT, its Sutton attribution, and its 60% result. | The DOI result is in the table above. Exact-name searches of Crossref, PubMed, and the web found no E-CAT record.                                                                                      |
| “Dr. Christopher Hook's” Stanford neuroimaging lab     | **Confirmed as fabricated.** No Stanford profile or lab was found. The real Enneagram review author is Joshua N. Hook at the University of North Texas, and his paper is a literature review, not neuroimaging. The hijacked DOI belongs to a Vanderbilt-affiliated peripartum review.                                                                                                                   | [Hook et al.'s actual review](https://doi.org/10.1002/jclp.23097) lists Joshua N. Hook and his UNT affiliation. The supposed fMRI DOI is resolved in the table above.                                  |

### 3.4 Salvage, overlap, and recommendation

The article has no salvageable factual spine. All 19 linked sources are hijacked, and the uncited treatment-response percentages, neurotransmitter profiles, genetic claims, therapy matching, and ongoing-study claims cannot inherit credibility from a citation set that fails 19 of 19 checks. Retaining the headings and replacing the evidence would be a rewrite from zero, not an edit.

There is a real evidence base to write about. Hook et al.'s 2021 systematic review examined 104 independent samples and found **mixed** reliability and validity evidence. It reports partial support for some factor structure and theory-consistent correlations, but says factor analyses usually found fewer than nine factors, no study derived the nine types using clustering, and evidence for wings and intertype movement was sparse. That supports the proposed honest angle: “What the Enneagram research actually says (spoiler: very little).” It does not support the current article's neuroscience or mental-health prevalence claims.

`enneagram-criticisms` overlaps at one accordion titled “The Enneagram lacks scientific validity” and one FAQ answer. It does not review the empirical literature, cite the systematic review, or answer source-seeking queries in depth. A focused, source-verified research article at the existing science URL would therefore be complementary rather than duplicative, provided the criticisms page links to it and stops making unsupported defenses.

**Recommendation:** approve a rewrite from zero at the same URL, preserving none of the current evidence claims. If DJ does not want to fund that rewrite, delete the current article and return 410. Do not preserve portions of the existing body as a shortcut.

### 3.5 Redirect decision from GSC query data

The 2026-07-06 GSC page export records 4 clicks, 6,032 impressions, 0.07% CTR, and average position 10.4. The page-query export exposes 89 non-anonymized queries totaling 1,313 impressions; GSC withholds the remainder. The highest-volume visible queries are:

| Query                                                     | Impressions | Clicks | Position |
| --------------------------------------------------------- | ----------: | -----: | -------: |
| enneagram lacks rigorous scientific validation source     |         278 |      0 |      9.5 |
| health.com enneagram lacks rigorous scientific validation |         249 |      0 |      5.9 |
| verywell mind enneagram not scientifically validated      |          61 |      0 |     11.1 |
| health enneagram lacks rigorous scientific validation     |          58 |      0 |      6.6 |
| cleveland clinic enneagram not scientifically validated   |          49 |      0 |     11.1 |
| enneagram lacks scientific validation source              |          43 |      0 |     10.5 |
| verywell mind enneagram lacks scientific validation       |          37 |      0 |      7.2 |
| enneagram lacks empirical support source                  |          30 |      0 |      8.1 |
| peer reviewed enneagram validity criticism                |          28 |      0 |     11.4 |
| psychology today enneagram scientific evidence            |          28 |      0 |     10.1 |

All top 20 visible queries concern scientific validity, evidence, sources, or criticism. None of the 89 visible query strings contains mental-health intent terms such as mental illness, therapy, depression, anxiety, disorder, or medication.

**Redirect verdict:** **No** to `enneagram-and-mental-illness`. Its intent is type-specific mental-health predispositions, not validity or research sourcing. It also repeats the unsupported “Type 6 ... 72%” anxiety figure in its body, so sending source-seeking readers there would compound the credibility problem. The file remains untouched, as required.

Preferred path: rewrite the current URL in place, which needs no redirect. Fallback if the page is deleted: 410. `enneagram-criticisms` is a closer semantic target than the crown-jewel page, but its current shallow, uncited validity section does not satisfy these queries well enough to justify a 301 today.

### 3.6 Root-cause handoff

The completed audit strengthens the T-03 recommendation: a resolve-only lint would have passed **all 19** hijacked citations. The gate must log registry metadata and require a title/author/topic comparison against the surrounding claim, with human review for medical-adjacent content. The verified result and resolve-only failure mode have been written into T-03.

### 3.7 DJ summary

The page is safely unpublished. Every DOI resolved, but all 19 led to unrelated papers; the body and FAQ schema repeated invented neuroscience, prevalence, assessment, and clinical claims. Recommendation: replace the article from zero at the same URL using the real mixed-evidence systematic review, or delete it and return 410. Do not redirect it to `enneagram-and-mental-illness`.

**One-line version:** “We unpublished the page as soon as we verified that all 19 DOI citations pointed to unrelated papers, and we will only restore that URL with a source-checked rewrite.”

### 3.8 Remediation and republication

DJ explicitly approved publication of a source-checked rewrite. The prior 929-line article was replaced from zero at the same file and URL. None of its evidence claims, invented studies, clinical prevalence figures, type-specific treatments, biological profiles, or 19 hijacked DOIs were retained. `lastmod: '2025-12-04'` remains unchanged.

The replacement now:

- centers Hook et al.'s systematic review of 104 independent samples and accurately describes the literature as mixed and preliminary
- uses eight unique sources whose DOI metadata and surrounding claims were checked individually
- distinguishes reliability, structural validity, construct validity, and incremental validity
- reports the strongest repeatable Big Five correlations without treating them as proof of nine discrete types
- treats wings, arrows, personal-growth interventions, and newer resident studies with design-specific limitations
- draws a firm boundary against diagnosis, disorder-prevalence percentages, type-specific treatment, fMRI, neurotransmitter, hormone, and genetic claims
- includes a visible editorial correction note and source list
- keeps six FAQ answers synchronized exactly with valid JSON-LD
- removes the stale `A+ / 9.5 / pass` self-certification rather than inventing a replacement grade

Verification on 2026-07-15:

- DOI extraction: 16 links, 8 unique sources, with each source linked once in context and once in the reference list
- fabricated-source residue check: no old hijacked DOI, EMHP study, E-CAT study, Stanford fMRI study, Christopher Hook attribution, or Riso and Hudson 2023 citation remains
- medical-claim review: former diagnosis, prevalence, medication, treatment-response, neuroscience, and biological assertions were removed or explicitly identified as unsupported
- FAQ schema: valid JSON; all 6 visible question-and-answer pairs match the JSON-LD exactly
- formatting: Prettier passes; zero em dashes
- `pnpm check`: passes with 0 errors and 125 existing warnings in 43 unrelated files
- `pnpm build`: the full SvelteKit client/server compilation and Vercel adapter completed; the trailing repository budget script failed because runtime media/fonts exceed the configured budget by 112.76 KiB. This article adds no media or font asset, so the unrelated budget overage was recorded rather than changed under this tasker.

The article was then set back to `published: true`. No redirect was needed, and `enneagram-and-mental-illness` remains untouched. The original 19-DOI audit remains above as the incident record.

---

## Verification checklist

- [x] The fabricated version was unpublished before audit; the verified replacement is now `published: true` with DJ's explicit approval
- [x] `lastmod` is unchanged (`2025-12-04`)
- [x] `grep -c "published: true"` on the target file returns 0
- [x] All 19 unique DOIs resolved against Crossref or doi.org, none skipped
- [x] Verdict table complete: 19 rows, every row has a verdict of Hijacked / Fabricated / Accurate / Misattributed
- [x] The three §0 example rows independently re-verified, not copied
- [x] All 4 unconfirmed allegations (dead author, EMHP, E-CAT, Hook lab) marked confirmed / refuted / inconclusive with evidence
- [x] Every citation site checked, not just the first per DOI (the execution record corrects this tasker's repeat count: two unique DOIs repeat, not four)
- [x] FAQPage JSON-LD block at the bottom of the file checked for the same fabricated claims (see Risks)
- [x] Salvage vs delete recommendation written, with salvageable word count if salvage is recommended
- [x] `enneagram-criticisms` read and overlap assessed before any rebuild is proposed
- [x] Redirect decision backed by GSC query data, not by assumption
- [x] `enneagram-and-mental-illness` untouched: no edit, no title change, no slug change
- [x] Lint-rule recommendation written into `T-03`
- [x] `grep -rl "doi\.org" --include="*.md" src/blog/ | grep -v drafts` still returns at most this one file (confirms no scope creep and no new DOI blogs)

---

## Risks and gotchas

- **Hard constraint: never modify `lastmod`.** DJ manages it by hand. This applies to every step including the unpublish. Flipping `published` does not touch `lastmod`.
- **Hard constraint: em-dashes are banned in blog content.** Zero per article. If you write any replacement prose, this applies.
- **Hard constraint: `enneagram-and-mental-illness` title and slug are FROZEN.** 287 clicks, highest-traffic page on the site. It may **absorb** content from other pages, never be absorbed into one. Do not rename it, do not reslug it, do not restructure it. Step 4 touches it only as a redirect _target_ under consideration.
- **The fabrications are duplicated in the JSON-LD.** The fake EMHP numbers, the fake Stanford fMRI findings, and the 73% machine-learning accuracy claim appear again inside a `FAQPage` structured-data block near the bottom of the file (around lines 881 to 905), mirrored from the FAQ prose (lines 845 to 857). Structured data is what Google lifts into rich results, so the fabricated claims have a second, more visible distribution path than the body text. Unpublishing kills both. Any partial edit that only fixes the prose leaves the fabrications live in the schema. Check both surfaces.
- **Do not trust the article's own framing while auditing.** The claims are internally consistent and confidently written. That is what fabrication looks like. Resolve every DOI independently; do not let a plausible-sounding claim earn a pass.
- **A resolving DOI is not a passing DOI.** Every DOI verified so far resolves cleanly to a real paper. The failure mode here is attribution, not link rot. Comparing titles and authors is the whole job.
- **Scope guard: this is one file.** The blast radius was verified today at exactly one published blog. Do not extend this tasker into a corpus-wide citation audit. If you find a second published DOI-citing blog, that is a new finding: report it, do not absorb it.
- **Drafts are out of scope.** The `grep -v drafts` exclusion is deliberate. Drafts are not served.
- **Do not delete the file without DJ's sign-off.** Unpublish freely (reversible, 4 clicks). Deleting is DJ's call.
- **Non-risk: the 4 clicks.** If anyone hesitates on Step 1 over traffic loss, the number is four clicks at 0.07% CTR. That is the worst CTR on the site. This page is not earning its liability.

---

## Definition of done

- [x] Page is unpublished (Step 1, same day)
- [x] 19-row DOI verdict table delivered, every DOI resolved, no gaps
- [x] The four unconfirmed allegations resolved to confirmed / refuted / inconclusive
- [x] Salvage vs delete recommendation delivered to DJ with the table attached, including the `enneagram-criticisms` overlap assessment
- [x] Redirect decision delivered, backed by GSC query data, with an explicit yes/no on `enneagram-and-mental-illness` as target
- [x] Root-cause lint recommendation written into `T-03`, noting explicitly that the cheap resolve-only version would NOT have caught this page
- [x] `lastmod` unchanged, `enneagram-and-mental-illness` untouched, and no other blog file modified
- [x] Summary written for DJ: what was fabricated, how much, the recommendation, and the one-line version he can say out loud if anyone ever asks about this page

If you cannot complete the DOI table, stop and report. A partial table cannot support the salvage-vs-delete decision, and the decision is the point of this tasker.
