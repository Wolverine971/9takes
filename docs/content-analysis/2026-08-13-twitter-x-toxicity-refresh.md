<!-- docs/content-analysis/2026-08-13-twitter-x-toxicity-refresh.md -->

# Twitter/X Toxicity Refresh Report

**Tasker:** `docs/taskers/T-32-twitter-x-toxicity-refresh.md`  
**Research and implementation date:** 2026-08-13  
**Page:** `https://9takes.com/pop-culture/twitter-x-personality-types-toxic`  
**Source:** `src/blog/pop-culture/twitter-x-personality-types-toxic.md`  
**Disposition:** Refreshed in place. URL, canonical, publication state, and `lastmod` are unchanged.

## 1. Search and indexation baseline

The page remains a distinct P0 improvement candidate, not a merge, retirement, or technical-fix candidate.

| Signal                      |                      Baseline |
| --------------------------- | ----------------------------: |
| Clean GSC window            | 2026-05-05 through 2026-08-11 |
| Clicks                      |                             1 |
| Impressions                 |                           551 |
| CTR                         |                         0.18% |
| Average position            |                           8.0 |
| Current 28-day impressions  |                             0 |
| Previous 28-day impressions |                            65 |
| Recent trend                |                     Declining |
| Current live response       |                           200 |
| Current robots              |               `index, follow` |
| Current canonical           |              Self-referencing |
| Sitemap state               |                     Submitted |

The repository's top-5,000 page-query export does not include this page in the latest run. A read-only, page-filtered Search Console API query on 2026-08-13 returned the following disclosed rows for the same 98-day window:

| Dimension | Row                                 | Clicks | Impressions | CTR | Position |
| --------- | ----------------------------------- | -----: | ----------: | --: | -------: |
| Query     | `why is twitter x so toxic reasons` |      0 |           2 |  0% |     10.0 |
| Country   | United States                       |      0 |           1 |  0% |      9.0 |
| Country   | Canada                              |      0 |           1 |  0% |     11.0 |
| Device    | Desktop                             |      0 |           2 |  0% |     10.0 |

These are disclosed, page-filtered rows, not a demographic description of all 551 impressions. Search Console suppresses some query-level data for privacy, so the two disclosed impressions do not reconcile to the page total and should not be used to infer the audience mix.

## 2. Current research sources and scope

### Current X product and policy sources

| Source                                                                                                                                       | What it establishes                                                                                                                                                                                                                     | Scope and limitation                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [X, About our approach to recommendations](https://help.x.com/en/rules-and-policies/recommendations)                                         | Current For You and recommendation signals include follows, Topics, likes, reposts, replies, watched media, and network popularity. X says no one signal always has the greatest weight and describes safety filters and user controls. | X's public description of its current product. It is not an independent audit and does not disclose exact production weights.             |
| [X, 2025 Annual Systemic Risk Assessment](https://transparency.x.com/content/dam/transparency-twitter/dsa/2025-x-dsa-sra-summary-report.pdf) | X acknowledges that recommendations may unintentionally elevate sources and reduce pluralistic exposure. It describes eligibility rules, safety models, labels, and user controls.                                                      | Company-authored DSA disclosure covering risks and mitigations. It does not measure how often a specific harmful outcome occurs.          |
| [X, About conversations](https://help.x.com/en/using-x/x-conversations)                                                                      | Public replies, reply controls, reply ranking, visible reply counts, and the fact that quote posts do not inherit reply restrictions.                                                                                                   | Current feature documentation. It establishes affordances, not their psychological effect on every user.                                  |
| [X, How to Repost](https://help.x.com/en/using-x/how-to-repost)                                                                              | Reposts and quote posts share a post with the reposter's followers; quote posts can add commentary.                                                                                                                                     | Current feature documentation. It does not prove that quote posts are usually hostile.                                                    |
| [X, Creator Revenue Sharing](https://help.x.com/en/using-x/creator-revenue-sharing)                                                          | Current eligibility includes five million organic impressions in three months, and verified Home Timeline impressions affect earnings.                                                                                                  | Current monetization rules. X says it rewards quality and meaningful conversation. The documentation does not say anger earns more money. |
| [X, Abuse and Harassment policy](https://help.x.com/en/rules-and-policies/abusive-behavior)                                                  | Targeted harassment is prohibited and enforcement considers context, severity, targeting, and prior violations.                                                                                                                         | Policy dated March 2024. The existence of a policy does not establish complete or uniform enforcement.                                    |

The 2023 public recommendation-system repository was reviewed as historical context but not cited as proof of the current production algorithm. Its old numeric weights were removed from the article.

### Peer-reviewed research

| Source                                                                                                            | Finding retained                                                                                                                                                                                                | Scope limit made visible in the page                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Gauthier et al., Nature, 2026](https://www.nature.com/articles/s41586-026-10098-2)                               | A randomized experiment with 4,965 active US X users found that switching on the algorithmic feed in 2023 affected engagement, content exposure, some political attitudes, and account-following behavior.      | Post-acquisition X, but the intervention ran in 2023. It studied political exposure and attitudes, not toxicity, and cannot identify the exact 2026 system. |
| [Brady et al., Science Advances, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8363141/)                         | In 12.7 million tweets from 7,331 users plus two experiments, social feedback and network norms predicted later expressions of moral outrage.                                                                   | Former Twitter. The outcome was outrage expression, not proof that users felt more outrage or that the algorithm intended it.                               |
| [Brady et al., PNAS, 2017](https://doi.org/10.1073/pnas.1618923114)                                               | Across 563,312 messages about three polarizing topics, each additional moral-emotional word was associated with about 20% more diffusion, especially within ideological networks.                               | Former Twitter, selected moral and political topics. This is not a universal rule for all X content.                                                        |
| [Rathje et al., PNAS, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8256037/)                                    | In 2.7 million posts from US news organizations and members of Congress on Twitter and Facebook, political out-group language was associated with roughly twice as many shares or reposts as in-group language. | Former Twitter plus Facebook, elite US political accounts. Predictive and observational, not proof of a platform-wide causal law.                           |
| [Marwick and boyd, New Media & Society, 2011](https://doi.org/10.1177/1461444810365313)                           | Qualitative Twitter research established context collapse: multiple audiences become one imagined audience.                                                                                                     | Former Twitter and a qualitative sample. The concept is used as a communication mechanism, not a current product measurement.                               |
| [Hickey et al., PLOS One, 2025](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0313293)      | English-language hate content was about 50% higher after the 2022 purchase, and the weekly rate at which that content was liked was about 70% higher.                                                           | Data run from 2022 through June 2023. The authors could not attribute the change to a specific policy, and the result is not a 2026 prevalence estimate.    |
| [Chuai et al., PNAS, 2025](https://doi.org/10.1073/pnas.2503413122)                                               | Engagement with misleading posts fell after a Community Note appeared.                                                                                                                                          | The study period was March through June 2023. Notes were less effective when attached slowly, and the work did not measure all misleading content on X.     |
| [Oldemburgo de Mello et al., Communications Psychology, 2024](https://www.nature.com/articles/s44271-024-00062-z) | In one-week experience sampling, Twitter use was associated within people with more outrage, lower well-being on average, and greater belonging, with substantial individual variation.                         | Data were collected before the X rename. The design could not establish the direction of causality.                                                         |

## 3. Claim-by-claim removals and corrections

The old article contained no external citations. The refresh replaced the unsupported causal and type-demographic frame rather than attaching sources to claims that the sources could not support.

| Previous claim or claim cluster                                                                                                                                       | Classification                                                   | Action                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types 1, 6, and 8 dominate X.                                                                                                                                         | Unsupported Enneagram demographic claim                          | Removed everywhere, including title promise, description, QuickAnswer, body, FAQ, and structured data. The page now states that no validated type census exists.                                                                   |
| Type 8s are "Twitter royalty" and most viral posts carry Type 8 energy.                                                                                               | Unsupported type claim and universal virality claim              | Removed. No user or post is typed from behavior alone.                                                                                                                                                                             |
| Reply guys, quote tweeters, thread creators, and doomscrollers are "usually" named types.                                                                             | Unsupported type-frequency claim                                 | Removed. The new type table describes possible motives and uses conditional language.                                                                                                                                              |
| Twitter is working exactly as designed and is designed to make users angry or hard to quit.                                                                           | Unsupported intent and clinical claim                            | Removed. Current ranking signals, social feedback, and limits are described separately.                                                                                                                                            |
| Character limits force strong positions and remove nuance.                                                                                                            | Overstated current platform claim                                | Corrected. Standard posts are brief, but Premium supports longer posts. The retained claim concerns context loss during circulation, not a universal limit.                                                                        |
| Anonymous accounts enable aggression and map to Types 6 or 8.                                                                                                         | Unsupported causal and type claim                                | Removed.                                                                                                                                                                                                                           |
| Conflict generates more engagement than harmony, therefore the algorithm boosts confrontation in a six-step cycle.                                                    | Overbroad causal chain                                           | Replaced with scoped evidence about moral-emotional language, political out-group language, social feedback, and current recommendation signals. No step is presented as an established current production rule.                   |
| Nuance, uncertainty, peace-seeking, and kindness do not go viral.                                                                                                     | Unsupported universal claim                                      | Removed. Counterevidence and positive uses are now explicit.                                                                                                                                                                       |
| The top 25% of users produce 97% of all tweets, nearly half post fewer than five times monthly, and a 90-9-1 rule applies.                                            | Mixed 2021 US sample finding plus unsupported generalization     | Removed from the page. The 97% statistic was real for a representative sample of US adult Twitter users in a 2021 Pew study, but it did not justify the global "tiny fraction manufactures toxicity" conclusion.                   |
| Lurkers' attention feeds the algorithm in specific ways, with lurking motives assigned by type.                                                                       | Unsupported behavioral and type interpretation presented as fact | Removed.                                                                                                                                                                                                                           |
| BookTwitter, Science Twitter, and Black Twitter inevitably decay because the algorithm cannot support positive communities.                                           | Unsourced community history and deterministic causal claim       | Removed.                                                                                                                                                                                                                           |
| More than 115,000 accounts deactivated in one day after the 2024 election.                                                                                            | Unsourced numerical claim not needed for the search answer       | Removed.                                                                                                                                                                                                                           |
| Hearing a voice makes a person seem more human, but Spaces inevitably recreated mob dynamics.                                                                         | Unlinked research claim plus unsupported X conclusion            | Removed.                                                                                                                                                                                                                           |
| The workforce fell from 8,000 to under 1,500 and specific safety teams were "decimated."                                                                              | Historical staffing claim used as causal proof                   | Removed. Staffing history was not necessary to establish the retained mechanisms.                                                                                                                                                  |
| The 2023 open-source code proved current boosts of 4x for Blue, 30x for likes, and active link suppression.                                                           | Stale source-code inference presented as current production fact | Removed. The report records that open source availability is not proof of 2026 deployment.                                                                                                                                         |
| COVID, crisis, election, and "informational harm" policies were all removed, causing hostility.                                                                       | Unsourced policy history and causal inference                    | Removed. The refresh links current recommendations and current abuse policy instead.                                                                                                                                               |
| Hate speech rose 50%, engagement rose 70%, and transphobic slurs tripled, presented as a current result.                                                              | Partly supported but missing date, method, and causal limit      | Corrected to the PLOS One result: English-language hate content and weekly like rate in data through June 2023, with no specific policy cause established and no claim about 2026 prevalence. The separate slur claim was removed. |
| Moderation changes altered the platform's Enneagram type distribution.                                                                                                | Unsupported type-demographic causal claim                        | Removed.                                                                                                                                                                                                                           |
| Type-specific advice used invented thresholds such as 50,000 followers, 1,000 followers, fewer than 200 follows, or claims that browser access dramatically cuts use. | Unsupported prescriptive specificity                             | Replaced with a five-step process tied to current controls and reader-observable behavior.                                                                                                                                         |
| Variable rewards are addictive; burnout explains changed tolerance; most people either get sucked in or leave.                                                        | Clinical or mental-health language beyond the evidence           | Removed. The retained well-being study includes heterogeneity and a no-causal-direction caveat.                                                                                                                                    |
| Type 8s thrive on drama and Type 3s monetize it.                                                                                                                      | Unsupported type and motive claim                                | Removed from FAQ and JSON-LD.                                                                                                                                                                                                      |
| Account deletion should depend on type.                                                                                                                               | Unsupported type-specific advice                                 | Removed. The new FAQ gives a mechanism-based interruption process.                                                                                                                                                                 |

## 4. Platform mechanics versus Enneagram interpretation

The refreshed page labels three layers rather than blending them:

| Layer                           | What the page now does                                                                                                                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current platform facts          | Links current X documentation for recommendation signals, reply and quote-post behavior, creator revenue rules, moderation policy, and controls.                                                                      |
| Research findings               | Names the sample, period, platform, outcome, and causal limit for each numerical or psychological finding. Former Twitter evidence is labeled as pre-acquisition.                                                     |
| 9takes editorial interpretation | Introduces the Enneagram table with an explicit label and states that no validated dataset shows any type dominates X. Each row is a possible motive plus a self-reflection question, not a demographic or diagnosis. |

The same public conflict can now include multiple motives: correction, protection, status, recognition, context restoration, threat monitoring, novelty, autonomy, or peace. Platform-level incentives explain why the conflict is visible and repeatable. The Enneagram only helps a reader ask why they personally stayed in it.

## 5. Query intent and search-facing changes

The only disclosed page query is a direct explanatory query: `why is twitter x so toxic reasons`. The previous title promised personality types, while the opening blamed three types before explaining the platform. That mismatch likely weakened relevance and trust even though average position showed striking-distance potential.

| Element         | Before                                                                                     | After                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Title           | `Twitter/X Personality Types: Why It's So Toxic`                                           | `Why Is Twitter/X So Toxic? 6 Reasons Conflict Spreads`                                                                 |
| Meta title      | `Why Twitter/X Is So Toxic: The Enneagram Psychology Explained`                            | `Why Is Twitter/X So Toxic? 6 Reasons Conflict Spreads`                                                                 |
| Description     | Claimed Types 8, 1, and 6 dominate Twitter discourse                                       | Names six defensible mechanisms and makes no type-demographic claim                                                     |
| QuickAnswer     | Blamed conflict-prone types and claimed the algorithm rewards conflict better than harmony | Answers with six interacting mechanisms, then states the main algorithm and type limits                                 |
| Body order      | Type stereotypes first, platform claims second                                             | Direct answer, six mechanisms, dated platform changes, separate Enneagram lens, practical interruption, evidence limits |
| FAQ and JSON-LD | Included addiction, type dominance, and unsupported account-deletion advice                | Mirrors the source-backed body and its limitations                                                                      |

The metadata change is justified by the GSC query and the revised page promise. The slug and canonical were not changed.

## 6. Internal-link decisions

| Decision                                                              | Reason                                                                                                                                                    |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Retain all nine Enneagram type links                                  | They support the clearly labeled interpretive table without implying that any type dominates the platform.                                                |
| Add `/pop-culture/psychology-of-public-shame`                         | It is the strongest adjacent explanation of crowd behavior and consequences for a target.                                                                 |
| Retain `/pop-culture/parasocial-relationships-enneagram-type`         | It explains why creator conflicts can feel personally identity-relevant to followers.                                                                     |
| Remove the Elon Musk personality-analysis link                        | The refreshed page discusses an evidence window, not Musk's personality. The link pulled the reader toward a named-person analysis rather than the query. |
| Remove the Tech Titans series link                                    | It was tangential to the searcher's toxicity question.                                                                                                    |
| Do not add the cancel-culture page                                    | The public-shame page covers the mechanism more directly and avoids turning the article into a partisan or controversy-driven link cluster.               |
| Preserve the inbound link from `reddit-moderators-type-1-internet.md` | The target URL is unchanged and the refreshed article remains the relevant next read.                                                                     |

After the refresh, the article has 11 unique internal destinations: nine type pages and two directly related pop-culture pages.

## 7. Before and after quality signals

| Signal                                                  |                         Before |                                 After |
| ------------------------------------------------------- | -----------------------------: | ------------------------------------: |
| External research and platform links in body            |                              0 |                                    13 |
| Literal U+2014 em dashes                                |                             35 |                                     0 |
| Unsupported type-dominance claim                        |                        Present |                               Removed |
| Current X claims separated from former Twitter research |                             No |                                   Yes |
| Numerical findings with sample or date limits           |                             No |                                   Yes |
| Counterevidence and user controls                       |                        Minimal |                    Dedicated sections |
| Practical interruption process                          | Nine stereotype-based tip sets | One five-step mechanism-based process |
| FAQ, QuickAnswer, body, and JSON-LD agreement           |                             No |                                   Yes |
| Approximate source body length                          |              About 2,700 words |                     About 2,700 words |
| URL, canonical, publication state, `lastmod`            |                  Live baseline |                             Unchanged |

The refresh is not a length expansion. It exchanges unsupported specificity for primary sources, visible scope limits, and a clearer search answer.

## 8. Indexation and 28-day measurement plan

### Deployment-day verification

1. Confirm the deployed URL returns 200 without a redirect.
2. Confirm the rendered canonical is `https://9takes.com/pop-culture/twitter-x-personality-types-toxic`.
3. Confirm robots remain `index, follow` and the page remains in the sitemap.
4. Inspect live source for the revised title, description, QuickAnswer, five FAQ entries, and valid FAQPage JSON-LD.
5. Confirm no U+2014 character or internal review marker appears in live source.
6. Record the deployment date. Do not modify `lastmod` to manufacture freshness.

### First 28 days after deployment

Use the full first 28-day post-deploy window and compare it with the immediately preceding 28 days. Allow two days for Search Console lag before exporting.

Track:

- indexing status and last crawl date;
- page clicks, impressions, CTR, and average position;
- disclosed page-query rows, with special attention to `why is twitter x so toxic reasons` and close variants;
- whether impressions return from the zero-impression current baseline;
- desktop versus mobile impressions, without treating privacy-suppressed rows as complete audience data;
- title or snippet rewrites in the live result; and
- any new inbound internal or external links.

The primary recovery signal is not an arbitrary CTR target. It is renewed impressions with stable or improving average position, followed by CTR improvement on direct "why is X toxic" queries. If impressions remain at zero after a full 28-day deployed window and the URL has been recrawled, inspect rendered content, canonical, robots, sitemap processing, and live internal discovery before another editorial rewrite.

Do not submit bulk validation requests, change the slug, merge the page, or add another freshness-only edit during the measurement window.

## 9. Verification

| Check                                                                  | Result                                                      |
| ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| Relevant Prettier check                                                | Passed                                                      |
| FAQPage JSON-LD parse and exact visible FAQ comparison                 | Passed: five questions and five answers match               |
| Protected frontmatter comparison against `HEAD`                        | Passed: `loc`, `published`, and `lastmod` are unchanged     |
| Em-dash and internal-review-marker scan                                | Passed: no matches in the article, report, or tasker        |
| Internal destination check                                             | Passed: all 11 linked 9takes destinations have source files |
| `pnpm check`, with the existing site environment loaded                | Passed: 0 errors and 132 existing warnings                  |
| Production Vite compilation, with the existing site environment loaded | Passed in 27 minutes 29 seconds                             |

The full `pnpm build` command exits after successful production compilation because the repository's protected portrait-library budget is already over by two files and 364.61 KiB. This task did not touch portrait assets. Every other reported build budget passes. The failure is outside the T-32 page scope and is recorded rather than hidden.

## 10. Files and external systems

Changed in this task:

- `src/blog/pop-culture/twitter-x-personality-types-toxic.md`
- `docs/content-analysis/2026-08-13-twitter-x-toxicity-refresh.md`
- `docs/taskers/T-32-twitter-x-toxicity-refresh.md`

External fields changed: none. Google Search Console was queried read-only. No URL Inspection request, indexing submission, CMS update, database write, sitemap change, or production mutation was made.

DJ-gated decisions: none for the source refresh. Deployment and any optional single-URL recrawl request remain operational actions for DJ's release flow.
