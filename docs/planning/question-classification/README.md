<!-- docs/planning/question-classification/README.md -->

# How Jev files 9takes questions under topics

Proposed November 19, 2026 · Built November 22, 2026 · **Not live until the rollout steps at the bottom are run**

A reader browsing Parenting and a reader browsing Youth sports should both find a question about parents pushing children to win. Each topic has one home in the directory and each question sits under as many topics as its wording supports. A question stops at a broad topic when it runs out of specifics.

## What the old hierarchy missed

The live database has 492 AI-generated categories (7, 18, 75, 322 and 70 nodes by level). The tagger sent a chat model the 75 level-three names, asked for up to five strings and matched them back to names.

- **The selection skipped useful distinctions.** Family and Kinship was available while Parenting and Childrearing, Marriage and Partnerships and Sibling Dynamics sat one level deeper, out of reach. Sports and Enneagram had no topic.
- **The directory spent detail unevenly.** Technology, Science, and the Universe had 148 nodes. Two different IDs shared the name Agile Methodologies.
- **Breadth hid bad matches.** "If you had to be trapped somewhere, where would you choose" was tagged Navigating Office Politics. Personal Growth held 48 of the 70 tagged questions.
- **Tags decided visibility.** A question with zero matched tags was flagged, which hides it. Under any classifier that is allowed to say "nothing fits", that would have hidden good questions.

## The directory

80 topics under 7 headings, in [`src/lib/data/questionTaxonomy.json`](../../../src/lib/data/questionTaxonomy.json). Every topic has a key, a label and a one-line scope that Jev reads.

| Heading                           | Topics scored for every question                                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Self & personality                | Identity & self-worth, Emotions & coping, Growth & change, Memories & milestones, Values & purpose, Personality frameworks        |
| Relationships & belonging         | Family & upbringing, Dating & partnerships, Friendship, Community & belonging, Role models & influences, Communication & conflict |
| Work, learning & money            | Careers & working life, Business & leadership, School & skills, Personal finances                                                 |
| Health & everyday life            | Physical & mental health, Habits & routines, Food & home life, Travel & getting around                                            |
| Culture, sports & leisure         | Sports & competition, Arts, books & entertainment, Hobbies & play, Media & online culture                                         |
| Society & public life             | Politics & government, Ethics & justice, Faith & traditions, History & social change, Economics & policy                          |
| Science, technology & environment | Technology & digital tools, Science & discovery, Environment & infrastructure                                                     |

41 niches sit below these. Nineteen came with the proposal (Dating, Stress, Books, Workplace relationships, Enneagram, Parental expectations, Pressure on young athletes and so on). Twenty-two were added on November 22 from what the questions in the three largest topics actually ask, one cluster per Enneagram motive:

| Under                    | Niches added                                                                                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Values & purpose         | Success & enough, Giving & self-sacrifice, Conviction & compromise, Freedom & restlessness, Legacy & life's work, Duty & responsibility, Standards & perfectionism, Knowledge & curiosity |
| Emotions & coping        | Inner peace & calm, Pain, loss & grief, Joy, humor & escape, Strength & control, Safety & trust, Disappointment & falling short                                                           |
| Identity & self-worth    | Being seen & misunderstood, Image & persona, Privacy & what you hold back (both under Authenticity), Proving yourself & competing (under Self-worth)                                      |
| Growth & change          | Reinvention & starting over, Perseverance & giving up                                                                                                                                     |
| Community & belonging    | Fitting in & standing apart                                                                                                                                                               |
| Communication & conflict | Speaking up & keeping the peace                                                                                                                                                           |

A topic only gets a public page once a visible question is filed under it. Add a niche when it would separate two kinds of question a reader would actually look for. Write the scope for a literal reader: "being misread by other people" pulled in any question containing "understand" until it was narrowed to "understand who you really are".

Two edits were made to the November 19 proposal's own topics: **Role models & influences** was added (two visible questions had nowhere to go), and Marriage's scope was narrowed to being married.

## How a question is filed

1. **Jev scores every topic in one request.** Each topic is a named `score` decision with its scope and full path, rated 0 to 3 against four anchors (unrelated, incidental, substantial, central) and read as a 0-100 fit. Scores are independent and can add up to more than 100. Only the question text is sent. [OpenRouter Decisions API](https://openrouter.ai/docs/guides/features/decisions)
2. **A topic fits at 66⅔%**, the "substantial" anchor. 90% and up is a strong match.
3. **A niche replaces its broader topic only when it is strong or fits at least as well.** "What are you afraid to tell your partner" stays under Dating & partnerships (100%) and is not pushed down into a 76% Marriage.
4. **A question keeps its strong topics, up to four. Weaker ones only fill it to three.** For the disagreements question, Communication & conflict (100%) is joined by Friendship (72%) and Family (70%), the two people the author named. For the left-on-read question, three strong topics are kept and the 83% Technology match, where the phone is only the setting, is left out.
5. **Nothing fits → the question is left unfiled** and recorded as an abstention for a person to look at. It stays visible.

The rules live in [`src/lib/server/questionTopics/classify.js`](../../../src/lib/server/questionTopics/classify.js), shared by the cron, the tagger and the CLI.

### What changed from the proposal, and why

- **No drill-down gate.** The proposal scored the two upper levels first and opened a branch only when its parent reached 55%, a threshold it called provisional. Scoring all 57 visible questions both ways showed the gate hiding a fitting topic on 4 of them (all Authenticity & self-presentation, whose parent scored low). Scoring everything costs about $0.0003 a question, so the gate was removed.
- **A selection rule instead of a bare threshold.** Rules 3 and 4 above replaced "keep everything at 66⅔%". On the same scores they fix the two errors the proposal flagged by hand (over-specific Marriage, incidental Technology).
- **Tags no longer decide visibility.** Finishing post-processing is what makes a question visible. Filing topics never changes `flagged`, `tagged` or `removed`.
- **New topic rows instead of remapping 492 IDs.** Topics are new rows marked with `topic_key`. Two legacy rows whose URL a topic would have taken (Dating and Courtship, Elections and Voting) are adopted in place. The other legacy rows stay for history. Their pages 301 to the topic that replaced them once their questions have moved ([redirect map](../../../src/lib/data/questionCategoryRedirects.json)). Category pages had about ten search impressions and no clicks in the last export, so there was no ranking to protect.
- **One stored result per question** (`question_classifications`: scores, topics, the hash of the question text and the hash of the directory, model and rules) instead of a row per score. A changed question or a changed directory makes the stored result stale and the question is re-scored.
- **One writer.** Jev, the owner's picker and the admin tools all go through the `apply_question_topics` database function. It updates the live mapping and the two legacy mapping tables and marks category intros stale in one transaction. Topics an owner or admin picked are never overwritten; Jev's answer is stored beside them.

## What the runs found (November 22, Jev 1.14)

| Check                                              | Before the niches (58 topics)                                                 | With the niches (80 topics)                          |
| -------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------- |
| Pilot checks ([pilot.tsv](pilot.tsv))              | 27/27                                                                         | 52/52 (the 27, plus one question per new niche)      |
| Held-out checks ([holdout.tsv](holdout.tsv))       | 18/19                                                                         | 18/19, the same miss                                 |
| Visible questions (57)                             | 52 filed, 5 unfiled, 1.7 topics each, 41 topic pages                          | 54 filed, 3 unfiled, 1.9 topics each, 52 topic pages |
| Every non-removed question (420)                   | 407 filed, 13 unfiled, 2.1 topics each, $0.14                                 | 415 filed, 5 unfiled, 2.4 topics each, $0.22         |
| Largest topic (questions filed directly under it)  | Values & purpose, 215 of 420                                                  | Values & purpose, 81 of 420 (10 filed there alone)   |
| Full backfill replayed on a local copy of the data | No legacy category holds a live question afterwards; no visibility flag moved | Not replayed again; only the directory file changed  |

The held-out miss is "Where do you get off", filed under Communication at 87%.

The checks name expected and excluded paths that were written before scoring. A check accepts a more specific descendant. The held-out set was held out while the proposal's thresholds were tuned; it has now been looked at, so treat it as a regression set from here on.

Unfiled visible questions: "what are you thinking about these days", "How do you do", "if you had to be trapped somewhere where would you choose". The other two from the first run found a home in the niches: "Whats something you overresearched that no one asked about" (Knowledge & curiosity) and "What's the smallest thing you've turned into a competition?" (Proving yourself & competing).

### The niche pass

The 363 hidden Chorus prompts are inward-looking, and the 58-topic directory was thin exactly there: Values & purpose took 215 of the 420 questions, Emotions & coping 113 and Growth & change 109. Reading those questions showed they cluster around the nine types' core tensions (achieving and still wanting more, giving until nothing is left, speaking up or keeping the peace, needing to stay strong), so the 22 niches above were written from them. Four scoring passes tuned the scopes.

| Filed directly under  | Before | After |
| --------------------- | ------ | ----- |
| Values & purpose      | 215    | 81    |
| Emotions & coping     | 113    | 66    |
| Growth & change       | 109    | 60    |
| Authenticity          | 77     | 29    |
| Identity & self-worth | 61     | 54    |
| Communication         | 54     | 26    |

The largest niches are Conviction & compromise (48), Perseverance & giving up (46) and Success & enough (42).

What is still true:

- **A parent page lists its whole branch.** Values & purpose with its eight niches rolls up to 251 of the 420 questions. That only matters if hidden prompts are ever shown in bulk; the 57 visible questions put 9 on that page.
- **Sports, Faith, History, Economics, Science, Environment, Hobbies, Food and Personal finances hold no questions.** They stay in the directory for questions people will ask; an empty topic has no page.
- **Weak third topics.** The "fill to three" rule sometimes adds a marginal match, for example Being seen & misunderstood at 71% on "What do single people not understand about married people".

## Commands

```sh
pnpm questions:classify                     # questions whose topics are missing or stale
pnpm questions:classify -- --report         # score them, write a local review, change nothing
pnpm questions:classify -- --write          # sync the directory to the database, score, file
pnpm questions:classify -- 81 104 --write   # (re)file specific questions
pnpm questions:classify -- --all --report --evaluate   # score everything and run the checks
pnpm questions:classify -- --scope browse   # only questions readers can see
```

Reports and a side-by-side review (filed today / Jev's topics / fitting topics that were not kept) land in `tmp/question-classification/`, which is git-ignored. Jev answers are cached on disk by exact request.

In production, the tagger files each new question as it is post-processed, and `/api/cron/classify-questions` (hourly) picks up anything missing or stale.

## Rollout

Nothing reader-facing changes until step 3.

1. **Done 2026-11-22: [`20261122170000_question_topics.sql`](../../../supabase/migrations/20261122170000_question_topics.sql).** Additive: two columns on `question_categories`, two on `question_category_tags`, the `question_classifications` table, a snapshot of today's mappings (`question_category_tags_backup_20261122`) and two functions. It is applied to production (206 mappings snapshotted, recorded in `supabase_migrations.schema_migrations`). It had to land **before** the deploy, because admin topic edits call the new function.
2. **Deploy.** Category pages keep working on the old categories. The hourly cron reports an error until step 3 has created the topics.
3. **`pnpm questions:classify -- --write`.** Creates the 80 topic rows, then files every non-removed question. Old category URLs start redirecting as their questions move. Review `tmp/question-classification/corpus-review.md` first (`--report` writes it).
4. **Regenerate category intros** from `/admin/categories` for topics with three or more questions. A topic page is `noindex` and out of the sitemap until it has an intro.

To undo step 3, restore `question_category_tags` from the snapshot table. Legacy categories and their intros are untouched.
