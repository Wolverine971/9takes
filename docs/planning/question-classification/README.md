# How Jev should classify 9takes questions

November 19, 2026 · Hierarchy proposal and local preview

A reader browsing Parenting and a reader browsing Youth sports should both find a question about parents pushing children to win. Give each topic one home in the directory and each question as many relevant paths as its wording supports. Stop wherever the question runs out of specifics.

## What the current hierarchy misses

The live database has 492 categories. Starting at the root, there are 7, 18, 75, 322 and 70 nodes at successive levels. Following parent IDs reaches all 492, and their stored levels agree with their actual depths. The problem is the vocabulary and how the classifier uses it. Both the single and bulk taggers send the 75 level-three names, ask a chat model for up to five strings, and match those strings against category names. The configured balanced JSON model list starts with Kimi. There are no per-topic scores in the mapping table. [Current taggers](../../../src/utils/server/openai.ts) · [Model configuration](../../../src/utils/server/smart-llm-service.ts)

- **The selection skips useful distinctions.** Family and Kinship is available, while Parenting and Childrearing, Marriage and Partnerships, and Sibling Dynamics sit one level deeper. Sports and Enneagram lack their own topics.
- **The directory spends detail unevenly.** Technology, Science, and the Universe has 148 nodes. Mobile App Development appears twice under Software Development. Two different IDs also share the name Agile Methodologies. Stable keys and full paths let Jev distinguish similar labels.
- **Breadth hides bad matches.** The question about a high-school graduate who wants to become a politician has five existing tags, including Diplomacy. The question about being trapped somewhere is tagged Navigating Office Politics. The old mappings include author edits as well as AI output, so those examples describe the stored results.
- **Coverage depends on the denominator.** Of 419 non-removed questions, 55 have a category mapping. The category page's visibility filter admits 56 questions, and 50 of those have mappings. All 47 unflagged ordinary questions have a mapping. Of the 363 flagged questions, 356 are unanswered Chorus prompts. Bulk tagging through the old path would also touch unrelated question data. [Category page filter](../../../src/routes/questions/categories/%5Bslug%5D/+page.server.ts) · [Chorus lifecycle](../../../src/routes/api/cron/tag-chorus-questions/+server.ts)

## Proposed top two levels

| Parent                            | Topics Jev evaluates on the first pass                                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Self & personality                | Identity & self-worth, Emotions & coping, Growth & change, Memories & milestones, Values & purpose, Personality frameworks |
| Relationships & belonging         | Family & upbringing, Dating & partnerships, Friendship, Community & belonging, Communication & conflict                    |
| Work, learning & money            | Careers & working life, Business & leadership, School & skills, Personal finances                                          |
| Health & everyday life            | Physical & mental health, Habits & routines, Food & home life, Travel & getting around                                     |
| Culture, sports & leisure         | Sports & competition, Arts, books & entertainment, Hobbies & play, Media & online culture                                  |
| Society & public life             | Politics & government, Ethics & justice, Faith & traditions, History & social change, Economics & policy                   |
| Science, technology & environment | Technology & digital tools, Science & discovery, Environment & infrastructure                                              |

The proposed directory has 57 nodes. All 7 parents and 31 second-level topics have a definition. The remaining 19 nodes let us test more specific assignments, including Dating, Stress, Books, Workplace relationships and Enneagram. Two fourth-level topics exercise the family-and-sports example. They can stay available to the classifier while a public page waits for enough questions to be worth browsing. Add a niche when it would separate two kinds of question a reader would actually look for. Keep general questions on the broader topic. [Full hierarchy and definitions](taxonomy.tsv)

## Scoring and drill-down

1. Send the submitted question and a named Jev `score` decision for every level-one and level-two topic. Each decision uses the category definition and its full path. Jev rates the topic from 0 to 3 using four anchors — unrelated, incidental, substantial, central. Multiply by 100/3 for a **topic fit** percentage. Scores are independent and can add up to more than 100%. Store Jev's confidence in the rubric judgment separately. [OpenRouter Decisions API](https://openrouter.ai/docs/guides/features/decisions)
2. Open every level-two branch scoring at least **55%**. Evaluate its immediate children together. Repeat for qualifying level-three nodes. A strong second-level topic can open even if its broad root scores poorly. Unvisited nodes have no score. Three or four qualifying branches can all advance on the same pass.
3. Keep the deepest node in each qualifying path at **66⅔%** or above, the “substantial” anchor. A second-level topic can stand on its own. Sort terminal matches by fit and derive their ancestors when browsing. A question under two siblings counts once in their shared parent. Root-only evidence or an empty result goes to review.
4. Treat **90% and up as strong suggestions** and **66⅔% to below 90% as secondary suggestions** in the review. Both bands matter. For the real question about disagreements with close friends or family, Jev gave Communication & conflict 100%, Friendship 71% and Family & upbringing 70%. A 72% cutoff lost both people the author explicitly wanted to discuss. A forced winner would lose them too.

Question form can become a separate filter if readers want to browse advice, hypotheticals or personal stories. A hypothetical about marriage still belongs near other questions about marriage.

## What the preview found

Jev 1.14 scored all 56 questions eligible for category browse plus four synthetic controls. It proposed at least one path on 48 of the 56 and abstained on eight. The final 60 inputs took 105 distinct request evaluations including drill-down, with about $0.016 in reported model charges to produce those answers. A cached replay reproduced the matches. The 55% routing threshold is provisional. This pilot measured the retained labels, and a deeper exhaustive comparison would be needed to quantify missed branches.

| Question                                                                                                         | Jev's result, rounded                                                                                                           | Editorial read                                               |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| How much pressure should parents put on their children to win at competitive sports?                             | Pressure on young athletes 100%, Parental expectations 99%, Ethics & justice 78%, Family roles & dynamics 74%                   | Keep both strong paths. The last two are weaker suggestions. |
| A father calls from a soccer game to apologize for missing a wedding. How can his child say they are still hurt? | Communication & conflict 100%, Family & upbringing 99%, Emotions & coping 92%                                                   | The game is scenery. Sports did not qualify.                 |
| What tips do you have for a recent high-school grad who wants to become a politician?                            | Politics & government 100%, Careers & working life 99%                                                                          | A career path into politics belongs under both topics.       |
| What was your job in your family growing up?                                                                     | Family roles & dynamics 99%, Memories & milestones 91%                                                                          | “Job” describes a family role. Careers stayed out.           |
| What do you do with your phone when a friend leaves you on read but keeps posting?                               | Media & online culture 99%, Communication & conflict 98%, Friendship 96%, Technology & digital tools 85%, Emotions & coping 82% | The phone is the setting. Drop the technology suggestion.    |
| Where do you get off?                                                                                            | Communication & conflict 89%                                                                                                    | The wording is ambiguous enough to leave unclassified.       |

I specified expected and excluded paths before scoring the evaluation set. A check accepts a more specific descendant of an expected topic. The pilot set informed threshold selection. A second set of 19 real questions was held out during tuning. These checks cover named boundaries. They do not establish precision for every suggested tag. For example, Jev inferred Marriage & long-term partnership from a question that only says “partner.” [Pilot checks](pilot.tsv) · [Held-out checks](holdout.tsv)

| Minimum fit, using the same routed branches | Pilot cases passing all their checks | Held-out cases passing all their checks | Expected held-out paths found | Explicitly unwanted held-out outcomes |
| ------------------------------------------- | -----------------------------------: | --------------------------------------: | ----------------------------: | ------------------------------------: |
| 66⅔%                                        |                                27/27 |                                   17/19 |                         18/18 |                                     2 |
| 72%                                         |                                26/27 |                                   17/19 |                         18/18 |                                     2 |
| 90%                                         |                                25/27 |                                   18/19 |                         17/18 |                                     0 |

Seven of the eight abstentions have existing tags. Review them for real gaps before retiring those tags. “Who do you look up to and why?” is a candidate for a role-models topic. “How do you do” is a reasonable abstention. The pilot used submitted question text only. For questions with author-provided context, test whether that context helps distinguish a subject from the intended audience.

## Running the preview

From the repository root, run the following for a local review of the current browse cohort. It includes the four synthetic controls and evaluates both sets of checks. The full report contains every evaluated key, its fit and confidence, the retained paths, the model, the taxonomy hash and the input question hashes. The model receives only the submitted question text and the rubric.

```sh
node scripts/preview-question-classification.mjs --scope browse --evaluate --output tmp/question-classification/review-scores.json
```

The same runner accepts `--input questions.json` for an array of objects with `id` and `question`. For the future corpus preview use `--scope corpus` in place of `--scope browse` and give it its own output file. Corpus scope includes every non-removed row, including flagged and dormant questions. Both modes read Supabase and write results locally. Jev responses are cached by model and exact request. [Preview runner](../../../scripts/preview-question-classification.mjs)

## Moving reviewed scores into the product

1. **Resolve the editorial boundaries.** Review strong and secondary suggestions separately, with more examples of incidental technology, sports metaphors, ambiguous prompts and over-specific relationship labels. Check a sample of dormant Chorus prompts separately because that population dominates the full corpus. Re-score all candidate descendants on a sample to test the 55% gate. Pin the reviewed taxonomy, model, prompt and thresholds for the backfill.
2. **Map existing IDs and URLs.** Reuse semantically equivalent categories, including Family and Kinship (26), Parenting and Childrearing (108), and Friendships (28). Map splits such as Personal Growth (57) question by question. Inventory every currently linked category URL, its intro and incoming links. Reparent equivalent IDs while retaining their slugs, and provide a redirect when consolidating equivalent pages. Keep unmatched legacy pages available until their disposition is reviewed.
3. **Stage scores by version.** Record the question ID and input hash, category key, model and rubric version, fit, confidence and whether a path was proposed. Keep evaluations separate from accepted membership. Capture existing assignments before the first switch. Current mappings lack provenance, so treat differences as proposals and record future owner edits as explicit overrides. A retry should reuse completed decisions, and a changed question or override should invalidate a stale proposal.
4. **Switch all writers and readers together.** Use one category-only operation for bulk, normal postprocessing and Chorus. Apply reviewed matches and both live and legacy mapping rows in one transaction per question, then refresh affected category intros. Preserve moderation, Chorus visibility, answer generation and SEO metadata independently. Check the owner editor's level-three restriction, direct-only category filters, ancestor rollups and the unpaginated mapping reads used by category pages and sitemap generation. Validate a parent and both sibling pages end to end, including duplicate counts, before activating the new version. [Category editor and writers](../../../src/routes/questions/%5Bslug%5D/+page.server.ts) · [Public category tree](../../../src/lib/server/questionCategoryTree.ts)
