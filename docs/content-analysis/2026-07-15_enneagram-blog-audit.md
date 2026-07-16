<!-- docs/content-analysis/2026-07-15_enneagram-blog-audit.md -->

# Enneagram Corner: Full Corpus Audit

**Date:** 2026-07-15
**Scope:** 99 published Enneagram blogs, each read in full. Includes the 11-post `mental-health/` subdirectory, which holds the section's #3 traffic page. Every consequential verdict was adversarially re-checked by a second agent whose main job was verifying that quoted "slop" actually appears verbatim in the file. GSC window: **2026-04-05 to 2026-07-04** (per `docs/data/gsc/latest.json`; run date 2026-07-06, 90 days).

**Method note (read this before trusting the grades):** 99 audits, 99 verifications, 219 agents total. The verifiers judged **68 of 99** first-pass audits **too harsh** and corrected them upward; 30 were about right, 1 too generous. Post-verification mean grade is **6.83** (raw first-pass mean was 6.08). The verifiers also caught **2 fabricated quotes** in `enneagram-and-adhd-which-types-struggle-most` and `how-to-navigate-early-relationship-stages`, which were struck. Grades below are post-verification. Where a first-pass auditor was harsh, the softer number is used.

---

## 1. Verdict

One blog on this site cites 19 DOIs and every single one is hijacked from a real paper on an unrelated topic, including a citation authored by a man who died in 2012. It is live, marked `published: true`, and it tells readers which therapies and medications suit their type. That is not a quality problem, it is a liability, and it is the single most urgent thing in this report.

Underneath that: the corpus does not have a slop problem so much as a **structure** problem. Sentence-level craft is frequently good and sometimes excellent. The rot is architectural. **47 of 99** blogs are flagged as the same artifact: a genuinely sharp thesis in the first 200 words, then abandoned for a nine-slot template that any Enneagram site on the internet could publish verbatim. The `unique_pass` test fails on **95 of 99 blogs**, and `falsify_pass` fails on **76 of 99**. Not one blog in the entire Enneagram corner uses the give-first mechanic, the nine-types-answering-one-question format, or a single real anonymous answer from the platform. The site's only structural moat is absent from the section it should define.

The corpus also carries **1,586 em-dashes** against a stated zero-per-article ban.

Third finding: the grading pipeline is lying to you. `enneagram-science-mental-health` self-certifies `quality_grade: 'A+'`, `quality_score: 9.5`, `quality_safety_gate: 'pass'`. Its real grade is 1. The grader rewarded fabricated citations as rigor because it never resolves a source. Average inflation across the corpus is 2 to 3.5 points, and at least four `safety_gate: fail` pages are shipping live.

Fourth: negative parallelism ("It's not X, it's Y") is not a tic in this corpus. It is the prose engine. It appears as the thesis line, the section closer, and the final sentence of dozens of these pieces. On some pages it fires once per type section, nine times, like a quota.

---

## 2. The stack rank

Grade is out of 10. Slop is 0 to 10, higher is worse. Fix hours are the auditor's estimate.

### KILL / UNPUBLISH TODAY

| #   | Slug                                              | Grade | Slop  | Verdict        | The problem                                                                                                                                                                                                                                                | Hrs |
| --- | ------------------------------------------------- | ----- | ----- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 1   | `enneagram-science-mental-health`                 | **1** | **9** | **KILL**       | All 19 DOIs are hijacked from real papers on unrelated subjects; the Stanford fMRI lab, the EMHP study, and the E-CAT do not exist; one citation is by a man who died in 2012. Live, on a mental-health topic, telling readers which meds suit their type. | 14  |
| 2   | `enneagram-vs-personality-frameworks-comparison`  | 7.5   | 4     | **KILL** (SEO) | Content is honest and well-sourced. It ranks pos 9.3 on 3,649 impressions and converts 1 click, because the searchers are hunting a competitor's citation, not this page.                                                                                  | n/a |
| 3   | `why-therapy-doesnt-work-the-same-for-every-type` | 7.5   | 4.5   | **UNPUBLISH**  | Its own frontmatter reads D / 6.9 / rebuild / `safety_gate: fail`. It is `published: true`. The publish gate is not enforced.                                                                                                                              | 4   |

### TIER 1: HEAVY REWRITE (fix these first)

| #   | Slug                                                       | Grade | Slop | Verdict | The problem                                                                                                                                                                                                              | Hrs |
| --- | ---------------------------------------------------------- | ----- | ---- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| 4   | `enneagram-strengths-and-weaknesses`                       | 4.5   | 8.5  | heavy   | Nine-slot fill-in template with nine fabricated case studies. The only numbers in it are invented ("productivity doubled", "stress dropped 50%").                                                                        | 6   |
| 5   | `enneagram-criticisms`                                     | 5     | 7.5  | heavy   | Title sells criticisms of the Enneagram; 12 of 17 accordions are a defensive product FAQ about 9takes, most answering with "we're working on it".                                                                        | 4   |
| 6   | `enneagram-team-dynamics`                                  | 5     | 8    | heavy   | Promises a map of all 81 pairings, delivers 11 bullet blocks. An unresolved author TODO ships in the published file.                                                                                                     | 6   |
| 7   | `enneagram-and-religion`                                   | 5.5   | 8    | heavy   | Answers the live question in a 60-word callout, then 3,400 words of Wikipedia catalog. Spends 900 words on a chakra mapping and then disclaims it.                                                                       | 5   |
| 8   | `enneagram-compatibility-guide`                            | 5.5   | 7    | heavy   | Statistical inversion: cites data showing 4 pairings = 73.4% of 457 couples (9x chance) and concludes this proves pairings do not cluster. Exactly backwards.                                                            | 5   |
| 9   | `enneagram-communication-guide`                            | 6     | 7.5  | heavy   | 6,111 words. Eight interchangeable "As we move from the X world to the Y realm" bridges. One `/questions` link is the only 9takes atom in it.                                                                            | 6   |
| 10  | `enneagram-medication-mental-health`                       | 6     | 7    | heavy   | Its own FAQ admits there is no research linking type to medication response, which voids ~5,000 words. Nine invented patient testimonials naming real drugs. 46 em-dashes.                                               | 12  |
| 11  | `enneagram-positive-self-talk`                             | 6     | 7    | heavy   | 8,473 words. 18 invented people with jobs and medical histories. Cites a 66-day habit study and contradicts it 33 lines later. Broken compound-interest math.                                                            | 7   |
| 12  | `enneagram-crisis-management-guide`                        | 6     | 7    | heavy   | Three unsourced clinical claims in a suicide-prevention doc, including "Type 4s have the highest rates of suicidal ideation". Tells you to say "pain is temporary" to a suicidal Type 7. `safety_gate: pass`. It is not. | 6   |
| 13  | `enneagram-instinctual-subtypes`                           | 6     | 6.5  | heavy   | States SP6 is the counterphobic countertype. It is not (that is the Sexual 6, per Naranjo/Chestnut, both cited by name in the article). The error is duplicated into the FAQ JSON-LD.                                    | 4   |
| 14  | `enneagram-trauma-response-guide`                          | 6     | 7    | heavy   | The March safety pass hedged the headings and left the unsourced medical claims (center to autoimmune flares / thyroid / TMJ) intact.                                                                                    | 6   |
| 15  | `enneagram-self-development`                               | 6     | 7    | heavy   | Em-dash purge was run as find/replace with a colon and corrupted the prose: "which core emotion: anger, fear, or shame: resonates most" ships to Google in the JSON-LD.                                                  | 4   |
| 16  | `enneagram-workplace-team-building`                        | 6     | 7.5  | heavy   | Good essay wearing a listicle as a costume. A fabricated efficacy claim is buried in the structured data.                                                                                                                | 6   |
| 17  | `enneagram-addiction-recovery-guide`                       | 6.3   | 7    | heavy   | Zero citations, zero numbers, in 6,000 words on addiction. `safety_gate: fail`, `rewrite_priority: rebuild`, live.                                                                                                       | 8   |
| 18  | `enneagram-therapy-guide`                                  | 6.3   | 6    | heavy   | Safety pass hedged every prescription into "may benefit / often resonates" mush, then left the conclusion claiming the type "predicts exactly how you will sabotage therapy". Both cannot be true.                       | 6   |
| 19  | `first-impression-cheat-sheet`                             | 6     | 6    | heavy   | 527 words, zero falsifiable claims. "Be direct and confident." "Be warm and genuinely interested."                                                                                                                       | 3   |
| 20  | `first-impression-enneagram-playbook`                      | 6     | 7    | heavy   | Its only evidence is a fabricated MIT citation ("11 major decisions in the first 7 seconds"). No such MIT paper.                                                                                                         | 4   |
| 21  | `how-each-enneagram-flexes`                                | 6     | 7    | heavy   | 24 em-dashes. The one original idea shows up at 85% depth doing no structural work.                                                                                                                                      | 4   |
| 22  | `philosophy-psychology-and-the-enneagram`                  | 6     | 7    | heavy   | 925 words, zero citations, frontmatter claims "evidence quality 9.1". There is no evidence in it at all.                                                                                                                 | 3   |
| 23  | `situations-change-emotions-dont`                          | 6     | 6.5  | heavy   | Title promises a paradox, delivers a truism. Props it up with the two most over-quoted lines in self-help, one of them misattributed to Frankl.                                                                          | 3   |
| 24  | `enneagram-communication-styles`                           | 6.5   | 7    | heavy   | All nine sections open with "They're not X. They're Y." Machine-stamped nine times over.                                                                                                                                 | 5   |
| 25  | `enneagram-dating-guide-for-men`                           | 6.5   | 6    | heavy   | 86 lines of raw internal reader critique ship inside the published file, publicly readable in page source. Fabricated first-person anecdote under DJ's byline. 73 em-dashes.                                             | 6   |
| 26  | `enneagram-influences`                                     | 6.5   | 7    | heavy   | The shipped FAQ JSON-LD contradicts the body on the article's central factual question (4th century AD vs. 10th-14th centuries).                                                                                         | 3   |
| 27  | `enneagram-team-diversity`                                 | 6.5   | 6.5  | heavy   | The FAQ JSON-LD describes triads the article never discusses. Structured data summarizes a different article.                                                                                                            | 3.5 |
| 28  | `enneagram-types-in-stress`                                | 6.5   | 6.5  | heavy   | Ships nine correct stress-arrow diagrams and then contradicts them in eight of nine sections. The 3-to-9 image (numbness) sits above "Stressed Type 3s don't slow down. They speed up."                                  | 5   |
| 29  | `how-each-enneagram-type-unwinds`                          | 6.5   | 7    | heavy   | Nine fabricated testimonials are its entire evidence base. Its only number ("3-4 times") is invented and hidden in schema markup.                                                                                        | 4   |
| 30  | `enneagram-parenting-mental-health`                        | 6.5   | 7    | heavy   | Type 5 and Type 9 ship byte-identical warning bullets. The article's own thesis is that each type means something different.                                                                                             | 7   |
| 31  | `toxic-traits-relationships-warning-signs`                 | 6.5   | 6.5  | heavy   | 29 instances of "might". 23 of 27 subsections open with "Type Ns often / may". Unfalsifiable by construction. 19 em-dashes.                                                                                              | 5   |
| 32  | `90-day-personality-maxing-blueprint`                      | 7     | 6    | heavy   | 7,064 words of borrowed frameworks. The one 9takes idea gets one paragraph at line 502. Not indexed. Zero traffic.                                                                                                       | 6   |
| 33  | `attachment-styles-and-enneagram-types`                    | 7     | 5.5  | heavy   | The revision pass stopped halfway. Types 2/4/5/6/8 are rebuilt prose; 1/3/7/9 are still the old emoji-bullet template. The seam is visible. Three contradictory avoidant mappings.                                       | 4   |
| 34  | `enneagram-connecting-lines`                               | 7     | 6    | heavy   | Argues the lines are bidirectional in section two, then reverts to the one-way framing it just called wrong. 30 em-dashes.                                                                                               | 4   |
| 35  | `enneagram-harmonic-approaches`                            | 7     | 7    | heavy   | 51 em-dashes. "Why This Framework Holds Up" is science-cosplay: three clinical mappings, zero citations.                                                                                                                 | 3.5 |
| 36  | `enneagram-leadership`                                     | 7     | 6    | heavy   | Declares "The 72-Hour Rule" and then contradicts it 275 lines later with a 48-hour CTA. Marches through all nine types twelve times.                                                                                     | 4   |
| 37  | `enneagram-test-comparison-2025`                           | 7     | 6.5  | heavy   | Ranks tests "by accuracy" on an invented ordinal scale. Its #1 pick violates the article's own stated avoid rule. Truity is 10 min in one table and 15 in another.                                                       | 4   |
| 38  | `enneagram-type-4`                                         | 7     | 5.5  | heavy   | Flatters instead of diagnoses. "You are whole" is the least falsifiable sentence available. Quotes read as 9takes panel data but come from someone else's YouTube panel.                                                 | 5   |
| 39  | `enneagram-type-9`                                         | 7     | 6    | heavy   | 12 negative-parallelism constructions. Zero 9takes. Psychology Today could run it tomorrow with a byline swap.                                                                                                           | 3   |
| 40  | `enneagram-types-being-ghosted`                            | 7     | 6    | heavy   | Nine hard percentages, zero citations, zero external links in the whole file. Two stats are restated inconsistently between the stats block and the FAQ.                                                                 | 4   |
| 41  | `enneagram-types-in-relationships`                         | 7     | 6    | heavy   | 7,345 words. 84 em-dashes. "9takes" appears exactly once, in the frontmatter URL.                                                                                                                                        | 8   |
| 42  | `how-to-apologize-like-a-pro`                              | 7     | 6.5  | heavy   | States a great falsifiable thesis at line 105 and never delivers it. Covers each type five separate times.                                                                                                               | 4   |
| 43  | `enneagram-dating-guide-for-women`                         | 7     | 6    | heavy   | The FAQ JSON-LD has ZERO overlap with the visible FAQs. Eight orphaned questions about "2025 dating trends" and "StICKing" that appear nowhere in the body. Manual-action exposure.                                      | 5   |
| 44  | `personality-maxing`                                       | 7     | 5    | heavy   | Three 9-row tables of standard Riso-Hudson doctrine. Gym metaphor stated 5 times in 18 lines.                                                                                                                            | 3.5 |
| 45  | `why-dating-apps-are-harder-for-certain-personality-types` | 7     | 6.5  | heavy   | "catches 90% of misrepresentation", "filtered out in 4 seconds", all invented.                                                                                                                                           | 4   |
| 46  | `why-the-next-thing-wont-fix-it-type-7`                    | 7     | 6    | heavy   | Proves its thesis by construction: 17 self-typed survivors, "fulfillment" never defined, and the one counterexample absorbed by rewriting the rule mid-argument.                                                         | 4   |
| 47  | `enneagram-anxiety-complete-guide`                         | 7.1   | 6    | heavy   | Real citations, real research, zero 9takes. A competent Psychology Today article wearing a 9takes URL.                                                                                                                   | 4.5 |
| 48  | `enneagram-anxiety-management-guide`                       | 7.2   | 6    | heavy   | The one original argument is announced as "the most important insight in this entire article" and buried at 90% depth. 34 spaced en-dashes doing the em-dash's job.                                                      | 5   |
| 49  | `enneagram-neurodivergence-guide`                          | 7.5   | 5    | heavy   | 24-cell lookup table, identical sub-headers. The sharpest asset (motivation vs. processing) is stranded in FAQ #2 at line 757. **Note: 141 clicks. Do not break it.**                                                    | 7   |
| 50  | `enneagram-object-relations`                               | 7.5   | 5    | heavy   | 66 em-dashes. ~20 "it isn't X, it's Y" constructions, one at the end of nearly every section.                                                                                                                            | 4   |
| 51  | `enneagram-types-and-career-choices`                       | 7.5   | 5.5  | heavy   | Six fabricated timelines ("By month six", "within two weeks", "By year two") presented as findings. Zero sources.                                                                                                        | 4   |
| 52  | `love-languages-and-enneagram-types`                       | 7.5   | 6    | heavy   | Demolishes Chapman with real peer-reviewed citations for not being research-backed, then asserts 45 completely unsourced type-to-love-language cells. The critique boomerangs. 69 em-dashes.                             | 6   |
| 53  | `how-type-8-challengers-actually-succeed`                  | 7.5   | 6.5  | heavy   | Six patterns are generic success-literature boilerplate. 72 em-dashes.                                                                                                                                                   | 6   |
| 54  | `enneagram-wings-complete-guide`                           | 7.5   | 5    | heavy   | Invents "70/30 split", "60/40 split" as if measured. 54 famous-person type assertions with zero citations, several reputationally live.                                                                                  | 6   |
| 55  | `enneagram-compatibility-matrix`                           | 7.5   | 5    | heavy   | Argues type compatibility does not matter, then spends 4,000 words ranking it. Promises 81 combinations, delivers 45. **10,735 impressions. Highest-value fix on the list.**                                             | 7   |
| 56  | `enneagram-type-2`                                         | 7.5   | 5    | heavy   | Textbook Riso-Hudson/Chestnut with no 9takes in it.                                                                                                                                                                      | 7   |
| 57  | `enneagram-type-8`                                         | 7.5   | 5    | heavy   | The most standard Type 8 framing in the literature. Nothing here is 9takes' to own.                                                                                                                                      | 6   |

**CUT LINE.** Everything below is `light-edit`: grade 6.5 to 8, slop 4 to 6.5. These are real editorial debt but they are not costing you money or credibility this week.

### TIER 2: LIGHT EDIT (defer)

`enneagram-and-mental-illness` (6.5, **287 clicks, frozen, light touch only**), `enneagram-types-working-in-teams` (6.5), `relationship-communication-guide` (6.5), `astrology-and-the-enneagram` (7, **do this one first, see §6**), `beginners-guide-to-determining-your-enneagram-type` (7), `depression-patterns-by-enneagram-type` (7), `enneagram-childhood-stereotypes` (7), `enneagram-concepts` (7), `enneagram-mental-health-flags` (7), `enneagram-personal-growth` (7), `how-each-enneagram-type-manipulates` (7), `enneagram-therapy-resistance-guide` (7), `enneagram-workplace-mental-health` (7), `red-flags-dating-each-enneagram-type` (7), `enneagram-and-adhd-which-types-struggle-most` (7.2, **252 clicks, best page on site**), `enneagram-coach-toolkit` (7.2), `enneagram-type-7` (7.2), `enneagram-online-dating-guide` (7.25), `biggest-compliments-to-give-each-enneagram-type` (7.3), `enneagram-parenting-styles` (7.3), `oversharing-psychology-shame-boundaries` (7.3), `toxic-traits-of-each-enneagram-type` (7.3), `enneagram-stress-number` (7.4), `enneagram-vs-meyers-briggs` (7.4), `enneagram-books-websites-podcasts` (7.5), `enneagram-communication-tips` (7.5), `enneagram-faqs` (7.5), `enneagram-party-planner` (7.5), `enneagram-tldr` (7.5), `enneagram-type-1` (7.5), `enneagram-type-6` (7.5), `enneagram-types-at-party` (7.5), `enneagram-types-on-a-first-date` (7.5), `how-each-enneagram-type-self-sabotages-success` (7.5), `how-to-navigate-early-relationship-stages` (7.5), `neurodiversity-vs-personality` (7.5, **ships 268 lines of internal editor notes to public page source, fix that one thing now**), `shadow-work-by-enneagram-type` (7.5), `why-you-cant-stop-overthinking-enneagram` (7.5), `anxiety-and-enneagram-types-guide` (7.8), `enneagram-type-3` (7.8), `enneagram-type-5` (7.8), `enneagram-social-styles` (8).

### Why the cut line is here

Not by grade. By **exposure**. The cut is: everything that is a legal, medical, or credibility liability, plus everything that is fabricating evidence, plus the two pages with enough traffic that the fix pays for itself in a month. A 6.5 that nobody reads costs you nothing. A 7.5 sitting on 10,735 impressions with a contradicted thesis costs you real money every day. A grade-1 page with 19 fake DOIs on a mental-health topic costs you the site.

---

## 3. The slop hall of fame

Every quote below is verbatim from a live file.

**1. `enneagram-science-mental-health`.** This is not a citation. It is a real neuroscientist's name attached to numbers he never produced, hyperlinked to a paper about Alzheimer's plasma markers.

> [Baron-Cohen et al. (2021)](https://doi.org/10.1093/brain/awab163) in _Brain_ found:
>
> - **Prefrontal Dominance**: 42% increased DLPFC activity during analytical tasks
> - **Amygdala Connectivity**: Reduced coupling with social brain regions (r = -0.45)
> - **Hippocampal Volume**: 8% larger than average (enhanced memory systems)

The article's thesis line is also the #1 AI tell: _"The honest answer isn't that the Enneagram is proven science. It's that it's becoming science."_ Frontmatter: `quality_grade: A+`, `quality_score: 9.5`, `quality_safety_gate: 'pass'`.

**Independently re-verified by resolving the DOIs against the live registry (not taken on the auditor's word):**

| DOI in the article          | What the article claims it proves                                                                             | What the paper actually is                                                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `10.1093/brain/awab163`     | "Baron-Cohen et al. (2021) in _Brain_" on DLPFC activity, amygdala coupling, hippocampal volume by type       | **"Plasma markers predict changes in amyloid, tau, atrophy and cognition in non-demented subjects"** by Pereira, Janelidze, Stomrud et al. Alzheimer's blood biomarkers. No Baron-Cohen. No Enneagram. |
| `10.1093/scan/nsz091`       | "Hook et al. (2019) Stanford neuroimaging study identified distinct neural signatures for Enneagram types"    | **"Neurobiological changes during the peripartum period"** by Cárdenas, Kujawa & Humphreys at **Vanderbilt**. Pregnancy and postpartum brain changes. No Hook. No Stanford. No Enneagram.              |
| `10.1016/j.jrp.2016.07.004` | "Wagner & Walker (2016) meta-analysis of 104 studies, r = 0.72-0.90 reliability across Enneagram assessments" | A longitudinal study of **achievement goals in 6,908 Korean eighth graders**. Not a meta-analysis. Not about the Enneagram.                                                                            |

The pattern is consistent and it is the dangerous kind: the DOIs are **real and they resolve**, which is exactly what makes this survive a spot check. A reader or journalist clicking through lands on a real paper in a real prestigious journal. Only reading the paper reveals the subject is unrelated. Three of three sampled were hijacked, which is why the auditor's claim of 19 of 19 is credible. Assume the whole citation block is fabricated until each one is individually resolved.

**2. `enneagram-strengths-and-weaknesses`.** Sarah does not exist. The 50% does not exist. This is presented with no hedge and no attribution.

> **Real-World Example:** Sarah, a Type 1 operations manager, couldn't delegate because "no one does it right." She started assigning tasks with explicit "done is better than perfect" criteria. Her team's productivity doubled because they weren't waiting for her approval on every detail. The work was "good enough" — and her stress dropped 50%.

**3. `enneagram-medication-mental-health`.** An invented patient, an invented outcome, a real prescription drug, on a page marked `medical: true`.

> _"I saw medication as failure until burnout forced my hand. Wellbutrin was like lifting a weight off my chest. I could still achieve, but without the desperate edge. I'm actually MORE successful now because I'm not running on anxiety. I tell other Type 3s: it's not cheating, it's smart."_ - Anonymous Type 3

**4. `enneagram-positive-self-talk`.** Rachel is a surgeon. Rachel was heading for a heart attack at 38. Rachel is one of eighteen fabricated people in this file.

> _Rachel, Type 3, Surgeon:_
> "The being practice saved my life. Literally. I was heading for a heart attack at 38. Now I measure success by presence, not just procedures. My patients say I'm a better doctor."

**5. `first-impression-enneagram-playbook`.** The only hard number in a section literally titled "The Science Behind Instant Connection." No MIT paper says this. The real thin-slice research is Willis and Todorov at Princeton and it claims nothing like it.

> **MIT research shows:** We make 11 major decisions about someone in the first 7 seconds.

**6. `enneagram-compatibility-guide`.** With 45 possible pairings, chance is 2.22% each. 20.7% is 9.3x chance. Four pairings account for 73.4% of 457 couples. The article reads this and concludes the opposite of what it says.

> **No single pairing exceeded 20.7%.**
>
> If compatibility charts were accurate, we'd expect "highly compatible" pairs to dominate the data. Instead, successful marriages spread across all combinations, with even "challenging" pairings occurring frequently.

**7. `enneagram-criticisms`.** This is the answer the page gives to a criticism of 9takes, on a page titled as criticism of the Enneagram.

> Sustainable platforms require sustainable business models.
>
> As 9takes continues to develop, exploring viable financial approaches that align with its core values remains an ongoing process.
>
> The challenge: balancing necessary revenue generation with preserving the user experience and avoiding models that compromise data privacy or discussion quality.

**8. `neurodiversity-vs-personality`.** This is not a comment in a draft. It is live, in public page source, right now, because MDsvex passes HTML comments straight through. It includes a competitor teardown naming Psyche.co and a full SEO keyword list.

> NEXT_LEVEL_REVIEW (2026-04-01)
>
> STATUS: Article was significantly improved in the last pass. The "both/and" framing,
> softer tone, consolidated sections, and concrete CTAs all landed well. Below is what
> would push this from a B to an A.

**Dishonorable mention, `enneagram-self-development`.** The em-dash purge was run as a find/replace with a colon. This is the result, and the same corruption is duplicated into the FAQPage JSON-LD, so Google is being served it:

> which core emotion: anger, fear, or shame: resonates most

---

## 4. What is actually good

**The number is two.** Two of 99 blogs pass all three substance tests (visualize, falsify, unique): `attachment-styles-and-enneagram-types` and `why-therapy-doesnt-work-the-same-for-every-type`. Both pass on the strength of DJ's voice or borrowed research rather than the 9takes mechanic, and both have disqualifying problems anyway (a half-finished revision whose seam is visible, and a failing safety gate that is nonetheless `published: true`).

**Zero of 99 blogs clear the 8.5 publish gate.** Not one. If the gate were enforced retroactively, the Enneagram corner would be empty.

**Nothing in this corpus scores above 8.0.** The top of the range is `enneagram-social-styles` at exactly 8, and it is the only blog of 99 to reach it. That is a structural ceiling, not bad luck. Note this matches the ceiling documented in the 2026-07-04 pipeline audit: the problem was diagnosed then and has not moved.

That said, there is real writing here and it should survive every rewrite:

- **`enneagram-social-styles` (8).** The 3x3 matrix reframe (read by row for strategy, by column for the want) is a genuine, non-obvious, checkable structural claim that most Hornevian content never makes. Two and Four chase the same prize with opposite playbooks. That is an argument.
- **`enneagram-type-5` (7.8).** The Competency Harmonic section: the Five who vanishes for four days and returns with a brilliant 12-page analysis after the team already shipped a fix. Falsifiable, visualizable, with a real counter-move ("Bring the half-built thing").
- **`enneagram-type-3` (7.8).** The instinctual-subtype work is genuinely expert. "Vanity for having no vanity" on the SP-3 counter-type is real scholarship. The grocery-store-parking-lot vignette (a Three handling hospice logistics flawlessly, then falling apart three weeks later on a random Tuesday) is a scene nobody else in this corpus has written.
- **`enneagram-vs-personality-frameworks-comparison` (7.5).** The best research on the site. It discloses the p=.25 null and the missing control group **against its own interest**, includes the Naranjo fabrication admission, and puts the Enneagram in a table where it does not win. That is the intellectual posture the whole corner should have. It is also the page I am recommending you kill for SEO reasons, which is a genuinely painful call.
- **`depression-patterns-by-enneagram-type` (7).** The type-opener vignettes are the best prose in the corpus this quarter: the 11 PM fourth email rewrite with the aching jaw, the Type 5 who has read 47 studies before the appointment, "Depressed? I went to three parties this week."
- **`enneagram-and-adhd-which-types-struggle-most` (7.2).** The Type 7 diagnostic question ("Can you focus when you genuinely want to, when the stakes are high enough?") with an explicit if-yes/if-no rule is a real falsifiable test. It is also your best-performing page: 252 clicks, 4.84% CTR, position 5.6.
- **`enneagram-and-mental-illness` (6.5).** The grade is mediocre but the "Mental Health Risk Overview by Type" table is genuinely useful, genuinely falsifiable, and almost certainly why this page out-ranks everything else you have (287 clicks). **Do not retitle, reslug, or restructure it.**

**The pattern in what works:** it is always the concrete, observable, checkable stuff. The scenes. The scripts. The tells. The tables with a "Never Do This" column. Never the theory, never the template, never the closing paragraph.

---

## 5. Merge / kill list

First, three things the brief got wrong that you should not spend time on:

- **The mental-health duplicate-URL bug is already fixed** (commit 74ae2440, 2026-05-04). The GSC split you are seeing is a historical artifact of a window that straddles the fix. `enneagram-neurodivergence-guide` (141 clicks) has no flat-URL row at all. Do not re-fix it, do not reverse the direction. The subdirectory is canonical and has two months of consolidation banked.
- **Do not merge the toxic-traits pair.** Both rank (54 clicks and 44 clicks), on different intents.
- **Do not merge ADHD and neurodivergence.** Those are your #2 and #3 pages. They rose together (both roughly tripled impressions), not at each other's expense.

### Kill

| Page                                              | Data                         | Action                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enneagram-science-mental-health`                 | 4 clicks / 6,032 imp / 0.07% | `published: false` **today**. Costs you 4 clicks, removes 19 fabricated DOIs from a mental-health page. Then 301 to the frameworks-comparison page or rebuild from real citations.                                                                                                                                |
| `enneagram-vs-personality-frameworks-comparison`  | 1 click / 3,649 imp / 0.03%  | 410 or kill. The queries ("delphi poll enneagram discredited source", "american psychological association enneagram pseudoscience") are people verifying a competitor's citation. They will never click 9takes because 9takes is not the source they are checking. 9,681 combined impressions producing 5 clicks. |
| `why-therapy-doesnt-work-the-same-for-every-type` | not indexed                  | `published: false`. Its own frontmatter says `safety_gate: fail`.                                                                                                                                                                                                                                                 |

### Merge

| Cluster               | Winner                                                                    | 301 into it                                                                                                                 | Why                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Anxiety**           | `mental-health/enneagram-anxiety-complete-guide` (7 clicks consolidating) | `enneagram-anxiety-management-guide` (not indexed), `anxiety-and-enneagram-types-guide` (0 clicks)                          | Two near-identical articles published three days apart making the same Type-6 argument. Before redirecting, lift the management-guide's buried thesis (each type's anxiety manufactures the outcome it fears) and make it the winner's lede.                |
| **Compatibility**     | `enneagram-compatibility-matrix` (81 clicks / 10,735 imp / pos 11.9)      | `enneagram-compatibility-guide` (0 clicks / 246 imp)                                                                        | The guide has the 457-couple dataset and the better argument. **Fix the inversion first**, then make it the matrix's evidentiary spine.                                                                                                                     |
| **Therapy**           | `mental-health/enneagram-therapy-guide` (3 clicks / 233 imp)              | `enneagram-therapy-resistance-guide`, `why-therapy-doesnt-work-the-same-for-every-type`                                     | The resistance-guide's thesis ("resistance IS the therapy") is the strongest idea in the cluster; anchor the merged page on it.                                                                                                                             |
| **Communication**     | `relationship-communication-guide` (1 click / 2,120 imp / pos 33.9)       | `enneagram-communication-guide` (0 clicks on 6,111 words), `enneagram-communication-styles`, `enneagram-communication-tips` | Winner owns 69% of the cluster's impressions. Pos 33.9 is upside. Absorb communication-tips' scripts. Also: the redirectMap in `[slug]/+page.ts` currently 302s two old comms slugs here. Make them 301s. 302s pass no equity.                              |
| **Teams**             | `enneagram-types-working-in-teams` (3 clicks / 1,450 imp / pos 53.7)      | `enneagram-team-dynamics`, `enneagram-team-diversity`, `enneagram-workplace-team-building`                                  | Merge-and-rebuild, not merge. Pos 53.7 means nothing here ranks. Take workplace-team-building's thesis (the behaviors that annoy you reveal the perspectives you're missing). Keep `workplace-mental-health` separate.                                      |
| **Growth**            | `enneagram-personal-growth` (2 clicks / 958 imp)                          | `enneagram-self-development`, `personality-maxing`, `90-day-personality-maxing-blueprint`                                   | "Personality maxing" is a coined term with no search demand. Salvage self-development's Type 8 confession, which is the one genuinely unrepeatable thing in the cluster.                                                                                    |
| **Dating**            | `enneagram-dating-guide-for-men` (3 clicks / pos 10.4)                    | `enneagram-online-dating-guide`, `how-to-navigate-early-relationship-stages`                                                | **Keep the women's guide separate.** Gendered dating queries are distinct intents. Its problem is indexing, not cannibalization. The online-dating guide is not an Enneagram article (26 of 27 mentions are link slugs) and should not live in this folder. |
| **Frameworks**        | `enneagram-vs-personality-frameworks-comparison`                          | `enneagram-vs-meyers-briggs`                                                                                                | **Superseded by the kill recommendation above.** If you keep the comparison page instead of killing it, this merge applies and the title must say "MBTI" somewhere. Currently it does not, which is why it sits at pos 9.3 with 0.03% CTR.                  |
| **First impressions** | `first-impression-cheat-sheet` (6 clicks / pos 7.8)                       | `first-impression-enneagram-playbook` (not indexed)                                                                         | The cheat-sheet is 527 words; absorb the playbook's body-language specifics. **Delete the fabricated MIT citation, do not carry it over.**                                                                                                                  |
| **Mental illness**    | `enneagram-and-mental-illness` (287 clicks)                               | `enneagram-mental-health-flags` (19 clicks / 950 imp)                                                                       | Flags is a strict subset of the frozen page's intent. This is the one merge the top page should receive.                                                                                                                                                    |
| **Neurodiversity**    | `mental-health/enneagram-neurodivergence-guide` (141 clicks)              | `neurodiversity-vs-personality` (7 clicks)                                                                                  | And strip the 268 lines of internal editor notes from public page source before anything else.                                                                                                                                                              |

Two two-line cleanups while you are in there: `src/blog/enneagram/enneagram-anxiety-management-guide.md:741` and `src/blog/enneagram/drafts/positive-self-talk-outline.md:526` both link to a flat (301'd) mental-health URL.

---

## 6. Highest-leverage fixes

Methodology note first, because it changes everything downstream. **9takes has no non-brand data at position 3.** Only three pages sit at pos ≤4 with ≥100 impressions (/about at 0.55%, /blog at 0.57%, Jenna-Ortega at 1.98%), and the only query at pos ≤3.5 is the brand term "9takes" at 72%. Applying a textbook 10% position-3 CTR to these pages manufactures roughly 700 imaginary clicks. Every number below uses the **site's own proven ceiling of 2.40%**, bracketed by mental-illness (2.35% at pos 8.2) and neurodivergence (2.83% at pos 7.3).

### 1. `astrology-and-the-enneagram` (light-edit, ~4 hrs, +85 to +195 clicks)

This is the single best ROI on the site and it is not close. **The content searchers want already exists and the title hides it.**

- Page: 86 clicks / 11,691 imp / 0.74% / pos 7.7.
- The proof: Google is surfacing your own section jump-links and getting nothing. `#what-enneagram-type-is-your-zodiac-sign` = **1,387 impressions, 0 clicks, pos 7.1.** `#why-each-enneagram-type-matches-its-zodiac-sign` = 1,319 imp, 0 clicks, pos 7.1. `#enneagram-types-and-zodiac-signs-the-complete-correlation-chart` = 987 imp, 1 click.
- Google has read the article, identified the correlation chart as the answer, is offering it directly on the SERP, and nobody clicks.
- Current title: "Astrology vs. the Enneagram: When vs. Why." The queries are "enneagram and astrology", "enneagram zodiac", "taurus enneagram type", "capricorn enneagram". They want a chart. "vs." signals an essay.

**Do:** retitle to "What Enneagram Type Is Your Zodiac Sign? The Complete Correlation Chart". Promote the chart above the fold. Move the honest "the correlations are not statistically real" finding from section 12 of 13 to a framed position near the top, where it becomes the 9takes angle instead of a betrayal at the end. Rewrite the meta description (it currently carries a banned em-dash). Do not touch `lastmod`.

### 2. `enneagram-compatibility-matrix` (light-edit, ~7 hrs, +177 clicks)

- Page: 81 clicks / 10,735 imp / 0.75% / pos 11.9.
- Top query: "enneagram compatibility chart" at **971 impressions, pos 8.0, 1.24%.** The query says _chart_. Your title says _Matrix_.
- "enneagram type compatibility": 680 impressions, **0 clicks**, pos 15.8.
- Anchor rows show the refusal: `#the-complete-compatibility-matrix-all-81-combinations` = 587 imp, 0 clicks, pos 7.8.

**Do:** test "Chart" over "Matrix" in the title. Deliver the chart above the fold. Merge in the compatibility-guide's 457-couple data **with the inversion corrected**, which simultaneously gives the page real evidence and resolves its internal thesis-vs-body war. Also: the page promises 81 combinations and ships 45. Either build the 81 or fix the promise.

### 3. The pattern behind both of the above (+543 clicks combined)

`astrology`, `compatibility-matrix`, and `test-comparison-2025` share one editorial habit: **they debunk the exact thing the searcher came for.** Astrology builds the zodiac apparatus then disowns it. Compatibility-matrix argues compatibility does not matter then ranks it for 4,000 words. Test-comparison buries its actual pick at 85% depth and recommends everything.

Combined: 185 clicks / 30,346 impressions / 0.61%. At 2.40% that is **+543 clicks**.

This is one editorial fix, not three tickets. **New rule: if the title promises a chart, a pick, or a mapping, the page ships it above the fold, and the caveat qualifies it rather than cancelling it.** Add it to the editorial standards.

### 4. `enneagram-wings-complete-guide` is a content gap, not a CTR fix

Do not retitle this page. It ranks fine and its title is honest. But **92.6% of its sampled impressions (226 of 244) are wing-PAIR compatibility queries it never answers**: "enneagram 8w9 and 6w5 compatibility" (45 imp, pos 7.7), "enneagram 6w5 compatibility with 8w9" (24 imp), "enneagram 1w2 and 6w5 compatibility" (22 imp), "4w3 vs 7w6" (12 imp). All at pos 6.5 to 10.0. All zero clicks. Google already thinks you are the best answer and the answer is not on the page. There are 324 wing pairings and the article covers zero of them as pairings.

**Do:** build the missing asset. 6w5 and 8w9 dominate the demand.

### 5. Three "leads" that are ranking failures, not CTR failures

Drop these from any CTR backlog. No title rewrite moves a page from position 33 to position 8.

- `enneagram-types-in-relationships`: pos 32.8. Its demand queries are worse than the page average: "enneagram and love" (591 imp, pos 30.8, 0 clicks), "enneagram type compatibility" (527 imp, pos 66.9), "enneagram and relationships" (499 imp, pos 74.4), "enneagram relationships" (472 imp, pos 82.0). Its 0.15% CTR is exactly what position 30 to 80 looks like. It needs rankings or consolidation into compatibility-matrix, which already outranks it on the same queries.
- `enneagram-instinctual-subtypes`: pos 15.1, top query at pos 37.
- `enneagram-test-comparison-2025`: pos 14.3, "best enneagram test" at pos 35.

### 6. One free structural observation

Across enneagram-corner, **452 anchor jump-link rows carry 59,899 impressions and 4 clicks (0.01%)** versus 90 real pages at 162,538 impressions and 1,610 clicks (0.99%). Google is offering section-level answers on the SERP at scale and your sections are not earning the click. The astrology fix is the pilot for this.

---

## 7. New blogs worth writing

Nine ideas were pressure-tested. Six were killed (§7b). Three survived clean, three survived with corrections. Ranked by confidence x demand.

### Tier A: real demand data, high confidence

**1. Enneagram and Autism: Why Masking Makes You Mistype as a 5, 9, or 1**
`enneagram-and-autism-why-you-keep-mistyping`

_Thesis:_ Autistic people disproportionately test as 5, 9, or 1 regardless of actual type, because every Enneagram test measures self-reported **behavior** while the system types **motivation**, and masking is a lifetime of behavior that is not motivation. The withdrawal reading as 5, the conflict-avoidance reading as 9, and the rule-adherence reading as 1 are masking artifacts. Falsifiable: motivation-based interviews should scatter autistic people across all nine types where tests cluster them on 5/9/1.

_Demand: REAL, and stronger than first estimated._ Autism intent is roughly 416 impressions, not the 288 originally claimed. The overlooked part is the good part: **"which enneagram is most likely to be autistic" pulls 94 impressions at pos 7.6 with ZERO clicks.** That is your thesis, phrased as a search query, earning nothing. "enneagram 5 autism" adds 37 imp, 0 clicks, pos 9.0 (and confirms searchers already make the Type 5 connection). The head term "enneagram and autism" is at 12.24% CTR, pos 5.7, from a page that is not even about it. **The control:** ADHD demand is statistically identical (278 imp) and its dedicated page earns 252 clicks at 4.84%, pos 5.6, your #2 page. Autism has no door.

_9takes angle:_ Masking is invisible outside and obvious inside. Nine anonymous answers to "when did you learn to perform being normal?" shows nine motivations producing near-identical masked behavior. No test-based competitor can produce that.

_Cannibalization check:_ When the ADHD page grew from 1,602 to 5,205 impressions, the neurodivergence guide grew from 1,755 to 4,977 with CTR **rising** 1.82% to 2.83%. They rise together. Directional, not clean (overlapping windows during site growth), but the fear is not supported.

**Lowest-risk, highest-certainty item on this list. Write it first.**

**2. Tritype Compatibility: Your Type Predicts Attraction, Your Tritype Predicts the Fight**
`enneagram-tritype-compatibility`

_Thesis:_ Tritype does not predict attraction better; it predicts what you will fight about, because the head/heart/gut fix order determines which center processes a conflict first. Inverted fix orders are not incompatible in values, they are incompatible in **sequence**: one must feel it before thinking it, the other must think it before feeling it. Falsifiable: mismatched fix order should predict conflict **duration and recurrence**, not frequency.

_Demand: REAL, but the original justification was wrong and I am flagging it._ The pitch claimed "7.23% CTR beats compatibility-matrix's 0.75% by 10x." That comparison is invalid: the page earning 7.23% at pos 6.0 for "tritype compatibility" **IS** compatibility-matrix. It was compared to itself. Most of the gap is just the position curve.

The real case is better than the one that was made. **`enneagram-compatibility-matrix` contains the word "tritype" exactly zero times, and Google ranks it position 6.0 for "tritype compatibility."** A page with none of the term at position 6 is a textbook content gap. And the trend is live: June 11 = 21 impressions; July 6 = 83 impressions. Roughly 4x in four weeks.

_Honest caveat:_ all 7 tritype clicks currently land on the matrix, at the best CTR that page earns anywhere. A tritype post competes head-on with your #1 impression driver. This is direct cannibalization risk, not glancing. Sequence it **after** the matrix fix, and scope it narrowly to fix-order conflict rather than general compatibility.

**3. Which Enneagram Type Is Most Likely to Be a Narcissist? We Checked 382 Real People**
`which-enneagram-type-is-most-narcissistic`

_Thesis:_ The honest answer is Type 3, and it is answerable rather than a matter of opinion: Type 3 is **17.5% of 382 profiled public figures** against ~10% of test-takers. The Achiever is the type most over-selected by the visibility-and-admiration environment that manufactures narcissistic presentation. The provocation is that this is a claim about the **environment**, not the type. Threes are not more narcissistic; they are more likely to end up in the conditions that reward it.

_Demand: REAL._ "which enneagram is most likely to be a narcissist" = 210 impressions, pos 11.4, 1 click. The page absorbing it is `enneagram-and-mental-illness`, which is not about narcissism. The whole "which type is most X" family runs ~581 impressions (narcissist 210, cheat 100, worst 122, manipulative 77, depressed 72).

_The natural experiment nobody spotted:_ in that query family, the two queries **with** a dedicated page rank 6.0 (depressed) and 6.6 (manipulative). The two **without** rank 10.4 (cheat) and 10.9 (worst). Building the page is what moves this query form from 10-11 to 6-7. That is your argument, and it is stronger than the greenfield claim.

_9takes angle:_ Answering requires named, documented public figures typed with written reasoning, plus willingness to say a number out loud. Truity pivots to "which types **attract** narcissists". IEA runs "Can All Enneagram Types Be Narcissistic?". Leslie Hershberger asks "Is One Type More Narcissistic?" and says no. They all hedge because they have certification revenue to protect. You have 382 written analyses and no test to sell. You also already rank #1 for the person-level version (blake lively narcissist pos 1.5, ryan reynolds narcissist pos 1.0, chappell roan narcissist pos 1.0).

_Hard constraints:_ Frame every claim as narcissistic **presentation in a selection environment**, never clinical NPD. Never diagnose a living person. You have already shipped one legal-risk claim (Tobey Maguire) and one grade-1 fabrication disaster on adjacent territory. **Also: the number is 17.5% (67/382), not 17.8%.** Get the one number the whole piece rests on right.

_Cannibalization the pitch missed:_ the live "dark side by type" cluster is ~8,800 impressions (toxic-traits 3,233, toxic-traits-relationships 2,797, manipulates 2,778). None of the three mention infidelity or narcissism-as-ranking, so overlap is manageable, but it is a crowded neighborhood.

### Tier B: judgment calls, no first-party demand data

**4. The Type That Disappears on Camera: Why Investigators Run Tech and Vanish From Screen**
`pop-culture/enneagram-type-5-tech-vs-screen`

_Thesis:_ Type 5's core strategy is minimizing the cost of being perceived, so it floods professions where you build something that gets watched instead of you, and evaporates from professions where the job IS being watched.

_Demand: PARTIAL and honest about it._ There is proven Type 5 celebrity demand ("famous type 5 enneagram", 18 imp, pos 12.8, landing on /personality-analysis/type/5, which itself pulls 2,466 imp at pos 52.1). There is **zero** first-party data for tech-founder or screen-actor type queries. The data quality is certain (+15.50pp vs -5.56pp across n=67 and n=142, verified against `corpus-stats.json`). The traffic is a bet.

_Three corrections before writing:_

- **Tech is not the peak.** `authors-thinkers` is 33.3% Type 5 (+24.96pp, n=21), higher than tech's 23.9%. Comedy is 0.0% Type 5, a second screen-native zero. The real finding is a **monotonic 7-domain gradient ordered by how much the job consists of being looked at**: authors 33.3% > tech 23.9% > politics 10.9% > creator-media 6.1% > film-tv 2.8% > music 0.0% > comedy 0.0%. That is a much stronger result than the proposed 3-point comparison, and it means the current title is built on the runner-up domain.
- **Drop the "Type 5 is not rare" clause.** The corpus is 382 hand-selected figures; it cannot speak to population incidence. Your own `docs/research/enneagram-public-distributions.md` flags this. Reframe as "the rarity stat measures self-report, not incidence."
- **Carry the selection-bias hedge** the musicians post already uses. You chose who to profile.

**5. Why Every Enneagram Site Publishes a Different Type Distribution**
`enneagram-type-distribution-datasets-compared`

_Thesis:_ The published distributions disagree wildly and the disagreement **is** the finding. Each dataset is a sampling fingerprint describing who takes that company's test, not who exists. Every site reports its own numbers as population truth because admitting otherwise devalues the test they sell.

_Demand: REAL but small (~64 non-branded impressions across 17 queries on /corpus-stats)._ Live conquest signal: people search "truity enneagram type distribution percentages" (7 imp, pos 9.4) and land on 9takes. "enneagram type distribution statistics" is 14 imp at **pos 6.0**. This is a defensibility and link-worthiness play, not a volume play. It is the natural authority anchor the other corpus pieces would cite.

_9takes angle:_ You are the only participant with nothing at stake. Every dataset owner in this space is also a vendor. Truity cannot publish a piece arguing Truity's distribution measures Truity's audience. You indict your own sample hardest (382 editorially-chosen public figures is the most biased sample in the comparison), which is what earns standing to indict everyone else's.

_Do not draft until you re-source every figure from `corpus-stats-external.json`._ Four of five thesis numbers in the pitch are wrong, which is a fatal irony for a piece about citation hygiene. Type 9 is 16.5% not 16.2%. Type 5 is 4.6% not 4.8%. **n is 200,000, not ~190k** (189,957 is the superseded figure your own research doc explicitly warns is laundered through HiPeople). The musicians corpus figure is 38.8% not 38.2%. And the Boo claim ("Type 4 is 15% of musicians") has no curated provenance at all. Either add Boo to the source of truth with methodology and n, or drop it. The corrected numbers make the argument **stronger**: 16.5 vs 4.6 is a wider spread than 16.2 vs 4.8.

### Tier C: speculative, ship only if you want the link asset

**6. Zero. The Types That Never Show Up Where You'd Expect Them**
`pop-culture/enneagram-types-missing-from-categories`

_Demand: NONE, first-party, and the proposer said so honestly._ Zero GSC impressions for any absence-shaped query. Nobody searches "which enneagram type is missing from tech." The justification is that a table of zeroes is exactly the shape an AI answer engine lifts verbatim.

_Rebuild the thesis before writing._ "Consistent, not random" fails statistical correction for 3 of its 4 headline examples. Across all 63 cells at Benjamini-Hochberg FDR 0.05, only three survive: Politics T7 (p=.00069), Film & TV T5 (p=.00135), Musicians T5 (p=.00140). **Zero Type 2s in tech, the marquee example, fails (p=.0055).** Zero Type 1 musicians fails (p=.0077).

Worse, the frame is backwards. The strongest signal in your corpus is **Type 7 in Politics at 1 of 55 when 8.4 were expected**, the only cell clearing Bonferroni, and it is not a zero, so the "empty cells are most informative" frame throws away the best result. Six of nine zeros sit in the two smallest domains. Emptiness tracks small n, not incompatibility.

Also a durability problem: at ~5 tech profiles/month and a Type 2 baseline of 6.8%, "zero Type 2s in tech" has a median time-to-falsification of about **two months**. A durable link asset built on the most perishable claim shape available is a structural mismatch.

_If you write it, write it about under-representation, not zeroes, and lead with Type 7 in politics._

### 7b. Killed ideas (considered and rejected)

- **"Which type is most likely to be a narcissist" as a fresh post (v1 framing).** Killed because `pop-culture/dark-triad-meets-enneagram.md` already publishes the exact argument, beat for beat, including "No Type Is Immune (Or Predisposed)", "Same darkness, different doorways", the visibility-artifact claim verbatim, and "Type 9: The Peaceful Monster". The v3 corpus-data version above survives because it answers the question with a number instead of refusing to.
- **"The Free Enneagram Test Problem."** Killed because 9takes' own comparison table refutes the thesis. iEQ9 is gated on price AND email and has the most items (175) and highest accuracy. 9types is free and ungated with 36 items and the lowest rating. The real pattern is the inverse: rigor is expensive, and expensive things get gated. Publishing it would put two 9takes pages in contradiction while one 301s to the other.
- **"Enneagram and Personality Disorders."** Killed on duplication. `enneagram-and-mental-illness` already contains the per-type disorder mapping table with the exact pairs (4/BPD, 5/Schizoid, 1/OCD, 6/Paranoia), and its FAQ JSON-LD already publishes the "type is not the disorder" thesis. Where the new thesis differed, it **contradicted** the hub. 134 impressions is not worth risking a 12,192-impression A+ page. The salvage: a post about "people diagnose the coping strategy because they cannot see the fear" that is NOT organized as a nine-disorder walkthrough.
- **"Why Celebrity Enneagram Lists Are Wrong."** Killed on duplication. `beginners-guide-to-determining-your-enneagram-type` already publishes the thesis and the proof structure ("Same behavior. Completely different reasons."). The salvage is better anyway: build the best-sourced celebrity list on the internet, one that shows its reasoning per pick, as an upgrade to `/personality-analysis/type/N`. That competes for 17,269 impressions instead of 292.
- **"The Enneagram's Most Common Type Is Almost Invisible in Fame."** Killed because the proposer's own falsification test fires against your own data. Comedians are 19.4% Type 9 (**above** the 16.5% population rate) and Film & TV, your largest domain at 37% of the corpus, is 15.5% Type 9 (parity). The aggregate 9-deficit is a composition artifact living in your founder-heavy over-sampling. **The pivot that survives:** fame does not select against Peacemakers, _credit-claiming_ fame does. Nines are everywhere in the fame you get by disappearing into a role, and absent from the fame you get by putting your name on the thing. That keeps the hook and the 1,079-impression striking-distance play.
- **"45% of Comedians Are Type 7."** Killed on duplication. `comedy-kings-enneagram-analysis.md` already runs the 7/9 fault line as its explicit spine ("Same pain. Opposite machinery." / "the two types fall apart in opposite directions"). Also the thesis is circular: Pete Davidson is typed 9 partly **because** he self-erases, so "9s break down by disappearing" restates the typing criterion. The action: add the n=31 / 45.2% / +29.98pp stat to comedy-kings itself, where it hardens an existing argument at zero cannibalization cost.
- **"We Asked One Question and Got 36 Different Answers."** Killed on data. Best question has n_typed ~10, five of nine types absent platform-wide. **Both branches of the either/or are unavailable:** a null result at n=10 cannot falsify the nine-lens premise, it can only report that nobody has answered yet. The real finding is a product one and it matters more than the post did: **type tags require a profile and ~52% of takes have no profile at all (140 NO_TYPE vs 131 typed).** Volume will not fix this. The mechanic has to capture type at answer time or the corpus will grow forever without becoming evidence. Revisit at 20+ typed takes across 7+ types on a single question.

---

## 8. What I would do this week

**Monday morning, before anything else (30 minutes):**

1. `published: false` on `enneagram-science-mental-health`. It costs you 4 clicks and removes 19 fabricated DOIs, a nonexistent Stanford lab, and a citation by a dead man from a live mental-health page. Do not wait for a rewrite.
2. Delete lines 391 to 658 of `neurodiversity-vs-personality.md`. Your internal editor notes, including "would push this from a B to an A" and a competitor teardown naming Psyche.co, are in public page source right now.
3. Delete lines 583 to 668 of `enneagram-dating-guide-for-men.md`. Same problem: 86 lines of raw reader critique, including "Right now it reads like it was written for 2010 dating", shipping publicly.
4. ~~`published: false` on `why-therapy-doesnt-work-the-same-for-every-type`.~~ **RETRACTED on post-audit verification. Do not do this.** See the correction below.

**Monday afternoon (2 hours):**

5. **The `safety_gate` finding was wrong and is corrected here.** Post-audit verification (see §9) found the flags are **stale, not live-failing**. Do not bulk-unpublish on them. The real fix is to stop treating the `quality_*` frontmatter as truth at all: `enneagram-science-mental-health` self-certified A+/9.5/pass while carrying 19 hijacked citations, and `enneagram-coach-toolkit` self-certifies A+/9.5 with "evidence quality 9.6" on an article containing no evidence. The block is wrong in **both** directions.
6. Run a Crossref audit on every blog carrying a DOI. This is the one bug with an unknown blast radius.

**Tuesday to Wednesday (the money):**

7. **Fix `astrology-and-the-enneagram`.** Retitle to the lookup, promote the chart above the fold, move the honest caveat to the top and reframe it as the angle. 4 hours, +85 to +195 clicks, and it pilots the anchor-link fix for 59,899 wasted impressions.
8. **Fix `enneagram-compatibility-matrix`.** "Chart" not "Matrix". Chart above the fold. Merge in the 457-couple data with the inversion corrected. Fix the 81-vs-45 promise. 7 hours, +177 clicks.

**Thursday (compounding):**

9. Ship the merges in dependency order: anxiety, compatibility, communication (converting those two 302s to 301s), teams, growth, first impressions, mental-health-flags into mental-illness, neurodiversity into neurodivergence. Lift the salvage assets **before** each 301: the anxiety mechanism, the 457-couple data, the resistance thesis, the Type 8 confession.
10. Add one line to `docs/brand/` editorial standards: **if the title promises a chart, a pick, or a mapping, ship it above the fold; the caveat qualifies, it does not cancel.** That single rule is worth ~543 clicks across three pages and prevents the next dozen.

**Friday (growth):**

11. Draft **Enneagram and Autism**. Real demand, proven position, a 94-impression zero-click query that is literally your thesis, and a direct control page earning 252 clicks on statistically identical demand.
12. Re-run `fetch-gsc-data.mjs`. The current window closed 2026-07-04 and straddles the May 4 URL fix, which is contaminating every mental-health comparison in this report.

**Explicitly not this week:** the 42 light-edit blogs, the wings-pair content gap (real, but it is a new build), and every Tier B/C new post. None of them are on fire and none of them are making money.

---

## 9. Post-audit corrections (verified 2026-07-15, after the agents finished)

Four claims in this report were checked by hand afterward and did not survive. They are corrected here rather than quietly edited out, because the corrections change what you should do.

### 9.1 The `safety_gate: fail` finding is STALE, not live. Do not bulk-unpublish.

The report said "three (or at least four) `safety_gate: fail` pages are shipping live" and told you to unpublish `why-therapy-doesnt-work-the-same-for-every-type`. **The real count is 8, and the correct action is to unpublish none of them.**

All 8 carry byte-identical quality frontmatter: `quality_grade: 'D'`, `quality_score: 6.9`, `quality_rewrite_priority: 'rebuild'`, `quality_safety_gate: 'fail'`, `quality_graded_at: '2026-02-22'`. Identical scores across 8 distinct articles is a **batch stamp**, not 8 individual judgments. **89 blogs** carry that same 2026-02-22 grading timestamp.

All 8 also carry a `quality_update_note` reading _"Safety edits applied 2026-03-10"_ (disclaimers added, prescriptive language softened). **The safety work was done on March 10. Nobody flipped the flag back to pass.** The flags have been stale for four months.

The 8: `why-therapy-doesnt-work-the-same-for-every-type`, `enneagram-neurodivergence-guide`, `enneagram-medication-mental-health`, `enneagram-addiction-recovery-guide`, `enneagram-workplace-mental-health`, `enneagram-parenting-mental-health`, `enneagram-trauma-response-guide`, `enneagram-therapy-guide`.

**Why this matters more than the original finding:** `enneagram-neurodivergence-guide` is on that list, and it is your **#3 page at 141 clicks**. Acting on the flag would have deleted your third-best page over four-month-old bookkeeping.

The actual lesson is worse than the reported one. The `quality_*` block is wrong in **both** directions at once: it says `A+ / 9.5 / pass` on the page carrying 19 hijacked DOIs, and `D / 6.9 / fail` on eight pages that were remediated a month after the stamp. **It is not a signal. Either wire it to something real or delete the fields.** See tasker `T-03`.

### 9.2 The mental-health duplicate-URL "bug" does not exist

Flagged during scoping as a confirmed live bug splitting authority across two URLs. It is not. Commit `74ae2440` (2026-05-04) added a 301 in `src/routes/enneagram-corner/[slug]/+page.ts` redirecting flat URLs to `/enneagram-corner/mental-health/<slug>`. The canonical tags are correct; both routes pass a full section path to `BlogPageHead`.

The GSC window (Apr 7 to Jul 6) **straddles** the May 4 fix, which is the entire explanation for the split rows. `enneagram-neurodivergence-guide`, which grew after the fix, has **zero** flat-URL rows. Do not re-fix this and do not reverse the redirect direction. This contamination is also why §8 item 12 (re-run `fetch-gsc-data.mjs`) is not optional housekeeping.

### 9.3 The DOI blast radius is bounded, and small

§8 item 6 called the Crossref audit "the one bug with an unknown blast radius." It is now known. **`enneagram-science-mental-health.md` is the only published blog on the entire site that cites a DOI.** It carries 23 DOI links resolving to 19 unique DOIs. No other published file in `src/blog/**` references `doi.org` at all.

That converts an open-ended corpus sweep into a bounded 19-DOI job on a single file. Good news, and it means `T-01` is a couple of hours rather than a project.

### 9.4 Two files leak internal notes, not three

A broader sweep for review-note HTML comments in published files returns a third hit, `pop-culture/incel-blackpill-radicalization-enneagram.md`. It is **benign**: a single-line `<!-- TODO: Link to ... when that post is published -->`, not a reader-critique dump. The two real leaks named in §8 stand. Every other hit is `published: false`.

### 9.5 A corpus-wide source-code leak the audit missed entirely

§8 items 2-3 found two blogs dumping internal editorial notes into public page source. That was correct but badly under-counted. The real number is **88**.

**88 published blog files ship a `QUALITY_FEEDBACK_START` HTML comment into rendered output.** Verified against compiled output, not inferred: `grep -rl "QUALITY_FEEDBACK" .svelte-kit/output/server/chunks/` returns **88 chunks** containing the literal string `<!-- QUALITY_FEEDBACK_START`. MDsvex passes HTML comments through untouched. Invisible on the page, fully readable in view-source and to crawlers.

Each block publishes the article's own letter grade, its strengths, an "Improve next" critique, and weakness tags. Verified tag distribution across the 88:

| Tag                  | Files |
| -------------------- | ----- |
| weak-hook            | 40    |
| template-fatigue     | 24    |
| none                 | 19    |
| style-friction       | 15    |
| unsupported-claims   | 9     |
| low-utility          | 9     |
| safety-boundary-risk | 8     |
| overlap-duplication  | 7     |

**Nine published articles publicly tag themselves `unsupported-claims`. Eight publicly tag themselves `safety-boundary-risk`, and those sit in the mental-health cluster.** Anyone viewing source finds 9takes self-certifying that its own mental-health content carries unsupported claims and safety-boundary risk. Unlike the quality findings, this one is fixable in a single mechanical pass with no editorial judgment required.

The `Graded: 2026-02-22` stamp ties it to the same batch run that wrote the `quality_*` frontmatter (§9.1). One run wrote both a frontmatter block (89 files) and an HTML comment (88 files). Owned by tasker `T-10`; the frontmatter half is `T-03`.

Worst single line found, in `enneagram-dating-guide-for-men.md` at line 45, live in page source:

> `<!-- DJ: swap in your actual Enneagram type and one specific date story in the note below for maximum authenticity. Reader feedback flagged missing author voice as the #1 trust issue in the previous version. -->`

An instruction to manufacture authenticity, published directly above the author's note it refers to.

### 9.6 Two numbers in §5 and §6 do not survive verification

- **The 457-couple study is NOT first-party 9takes data.** `enneagram-compatibility-guide` cites it to an external source (`enneagram-personality.com`, line 104). Merging it into the matrix therefore does not give that page first-party evidence, it gives it a cited external claim. Given §3, provenance is not a footnote here: verify the source resolves and says what the article claims before building a thesis on it, and never launder it into 9takes voice as our own data.
- **The "9x chance" figure is wrong.** 73.4% against a uniform null over 45 pairings is **8.26x**; against a uniform-type-marginal null it is **7.43x**. The 9.3x figure holds only for the single top pairing (20.7 / 2.22), not for the four combined. Also, 73.4% is not quoted in the file; it is the sum of the guide's table (20.7 + 17.9 + 17.5 + 17.3). The arithmetic checks out, but the number is derived and should be presented as such.

### 9.7 The leak in §9.5 has a live cause, and it is still running

§9.5 documents 88 files leaking a `QUALITY_FEEDBACK_START` comment. That marker has no generator; it was a one-off 2026-02-22 batch. Stripping those 88 is final.

**But the behavior was renamed, not fixed.** `.claude/commands/grade_blog.md` line 5 currently instructs, verbatim:

> "...add grades to the file's frontmatter, and **leave actionable reviewer feedback as an HTML comment**."

MDsvex passes HTML comments through to rendered HTML. The command is doing exactly what it was told. **The instruction is the bug.**

The successor marker is `<!-- QUALITY GRADE:`. Verified counts:

| Location                              | Count |
| ------------------------------------- | ----- |
| Draft files carrying it               | 234   |
| **Published, live files carrying it** | **2** |
| Compiled chunks containing it         | 237   |
| Overlap with §9.5's 88 files          | **0** |

The two live pages are `pop-culture/hollywood-heartthrobs-enneagram-analysis.md` and `community/consensus-on-human-nature.md`; both have served chunks in the build (`hollywood-heartthrobs-enneagram-analysis2.js`, `consensus-on-human-nature2.js`). Most of the 237 chunks are people-drafts (`Steve-Martin.js`, `Nancy-Reagan.js` and similar), which are bundled into the build but almost certainly not served, since `/personality-analysis/*` is DB-driven. So the confirmed live exposure is 2 pages. The 234 drafts are a **latent** leak: publishing a draft is a one-line change, and the comment ships with it.

**Consequence for sequencing:** clearing the 88 without fixing the instruction is a treadmill. Tasker `T-11` owns the instruction and must land before or with `T-10`. The lint guard in `T-02` must match the general shape of the leak (an HTML comment containing a grade or reviewer feedback) rather than enumerate markers, because enumeration is precisely how the first rename escaped.

This also reframes §9.5. The corpus does not have a historical leak that was cleaned up and forgotten. It has a **standing practice** of writing internal editorial judgment into files that get served, which has now produced three distinct markers across three runs. That is the finding.
