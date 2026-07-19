<!-- docs/audits/pop-culture-blog-update-audit-2026-07-19.md -->

# Pop Culture Blog Update Audit

Date: 2026-07-19  
Scope: `src/blog/pop-culture`

## Summary

This was a read-only audit of:

- 54 top-level Markdown files
- 32 published posts
- 18 unpublished drafts
- 4 support files
- 10 nested Epstein research notes

The audit looked for:

- facts that had become stale by July 19, 2026
- claims contradicted by newer reporting
- contradictions between 9takes articles
- incorrect Enneagram wings or growth/stress directions
- unsupported psychological, neurological, medical, political, or legal claims
- drafts that were incomplete or unsafe to publish in their current form
- production notes that might accidentally be visible

No files were changed during the audit. The existing working-tree modification to
`musk-vs-altman-trial-personality-dynamics.md` was treated as user work and left
untouched.

One portfolio-wide issue stood out: 14 of the 32 published posts contained no
external evidence links beyond self-links or canonical URLs. That is not necessarily
a problem for fictional character typing, but it is a serious weakness in posts making
claims about neuroscience, psychology, politics, gender, legal cases, technology
companies, and platform policy.

## Highest-priority updates

### 1. Google Leadership Evolution

File: [`google-leadership-evolution.md`](../../src/blog/pop-culture/google-leadership-evolution.md)

The article's central thesis repeatedly calls Sergey Brin a `5w7`. That wing does not
exist in the standard Enneagram model: Type 5 wings are 4 and 6. The article also says
Type 9 Sundar Pichai could grow into a "6 wing," although Type 9 wings are 8 and 1.

This is structural rather than a one-line correction because the invalid wing is used
to explain Brin's behavior throughout the article. The same mistake has propagated
into the Tech Titans index and Founders vs. Stewards article.

The site's own [`enneagram-wings-complete-guide.md`](../../src/blog/enneagram/enneagram-wings-complete-guide.md)
defines a wing as one of the two adjacent numbers.

### 2. Trump Type 8 vs. Biden Type 2

File: [`trump-type-8-vs-biden-type-2.md`](../../src/blog/pop-culture/trump-type-8-vs-biden-type-2.md)

The whole article is built around Trump as Type 8. The newer U.S. presidents article
and the dedicated Donald Trump profile classify him as Type 3. Because the article's
examples, growth/stress analysis, title, FAQ schema, and political thesis all rely on
Type 8, resolving the contradiction requires a strategic typing decision and likely a
substantial rewrite.

### 3. U.S. Presidents Enneagram Analysis

File: [`us-presidents-enneagram-analysis.md`](../../src/blog/pop-culture/us-presidents-enneagram-analysis.md)

Problems:

- The comparison table says "Iran War era (2025)" even though the war began in 2026.
- The article says the war is in its fourth week despite being dated June 22.
- The war was still active on July 19, making the temporal framing badly stale.

Current source:

- [AP, July 19, 2026: U.S. announces another service member death as Iran war continues](https://apnews.com/article/63996576847424ab5f22887f38037ce8)

### 4. Podcast Bros Enneagram Analysis

File: [`podcast-bros-enneagram-analysis.md`](../../src/blog/pop-culture/podcast-bros-enneagram-analysis.md)

The article says Lex Fridman interviewed Vladimir Putin and that the interview produced
"moments of genuine candor." No such episode appears in Fridman's official catalog.
The companion podcaster article later describes the Putin interview as a plan, creating
an internal contradiction.

The article also includes uncited statistics about loneliness, American parasocial
relationships, Gen Z podcast use, and a supposed psychological transition at the
90-minute point of an interview.

Source checked:

- [Lex Fridman Podcast — official episode catalog](https://lexfridman.com/podcast/)

### 5. Podcaster Personality Map

File: [`podcaster-personality-map.md`](../../src/blog/pop-culture/podcaster-personality-map.md)

The article also describes a completed Lex Fridman–Putin interview, then later calls it
"Putin interview plans." This should be corrected and the surrounding current podcast
deal, biography, and audience claims should be sourced.

### 6. Tech Titans: The AI Wars

File: [`tech-titans-ai-wars.md`](../../src/blog/pop-culture/tech-titans-ai-wars.md)

The article says Meta announced Horizon Worlds would be shut down. Meta reversed the
VR shutdown the following day and retained limited VR support.

The piece also contains a large volume of volatile, sensitive claims about OpenAI,
Anthropic, xAI, Meta, model behavior, safety incidents, investments, layoffs, and
budgets without external source links.

Sources checked:

- [TechCrunch: Meta decides not to shut down Horizon Worlds on VR after all](https://techcrunch.com/2026/03/19/meta-decides-not-to-shut-down-horizon-worlds-on-vr-after-all/)
- [Euronews: Meta U-turns on Horizon Worlds VR shutdown](https://www.euronews.com/2026/03/20/meta-u-turns-on-horizon-worlds-vr-shutdown-after-user-backlash)

### 7. Tech Titans Leadership Styles

File: [`tech-titans-leadership-styles.md`](../../src/blog/pop-culture/tech-titans-leadership-styles.md)

The article says the Musk–Altman case is "Happening now" and currently in federal
court. The linked trial article is already post-verdict. The article also contains
many current business and biographical claims but no external evidence links.

### 8. Epstein Psychology Part 1

File: [`epstein-psychology-part-1.md`](../../src/blog/pop-culture/epstein-psychology-part-1.md)

The article says Type 2 integrates toward Type 8 in health. In the standard Enneagram
model, Type 2 grows toward 4 and moves toward 8 under stress.

It also says Bill and Hillary Clinton were scheduled for late-February depositions.
Those depositions occurred, and the House released the videos. The DOJ Epstein Library
was updated again on July 17, 2026, so the entire current-events section needs a
sensitive legal and factual refresh.

Sources checked:

- [Department of Justice Epstein Library](https://www.justice.gov/epstein)
- [House Oversight releases Bill and Hillary Clinton deposition videos](https://oversight.house.gov/release/oversight-committee-releases-bill-and-hillary-clinton-deposition-videos/)

## Other urgent credibility updates

### Parasocial Relationships

File: [`parasocial-relationships-enneagram-type.md`](../../src/blog/pop-culture/parasocial-relationships-enneagram-type.md)

The article repeatedly says parasocial grief is "neurologically identical" to losing
someone personally known and claims brain imaging proves the same pathways are
activated. No study is cited, and the available research does not support that degree
of certainty. Most relevant research measures self-reported grief, attachment,
parasocial breakup distress, or public expressions of mourning.

The article also makes categorical Enneagram claims even though no clinical research
maps parasocial behavior by Enneagram type. Those sections should be presented as
reflective hypotheses rather than findings.

### Masculinity, Strength, and the Enneagram

File: [`masculinity-strength-and-the-enneagram.md`](../../src/blog/pop-culture/masculinity-strength-and-the-enneagram.md)

This post makes broad evolutionary, biological, gender, mating, age, and attraction
claims without research citations. Examples include asserting what women are
biologically wired to select for and declaring a particular form of emotional
regulation the most attractive form of masculine strength. This is a high reputational
risk and needs evidence, narrower language, and greater variation across people and
cultures.

### Dark Triad Meets the Enneagram

File: [`dark-triad-meets-enneagram.md`](../../src/blog/pop-culture/dark-triad-meets-enneagram.md)

The post assigns Enneagram structures and emotional motives to named murderers and
criminals with no external source links. Its disclaimer helps, but the body often
speaks diagnostically. It needs stronger sourcing and more disciplined separation
between documented facts and speculative interpretation.

The image-generation prompts are enclosed in HTML comments and are not a live
rendering problem.

### Reddit Moderators

File: [`reddit-moderators-type-1-internet.md`](../../src/blog/pop-culture/reddit-moderators-type-1-internet.md)

The article presents Type 1 dominance among volunteer moderators as fact without
evidence. It also predates Reddit's March 2026 moderation limits, which cap a person at
five communities with more than 100,000 weekly visitors.

Source checked:

- [Reddit Help: Moderation limits](https://support.reddithelp.com/hc/en-us/articles/37922094698772-Moderation-limits)

### Influencer Enneagram Types

File: [`influencer-enneagram-types-instagram.md`](../../src/blog/pop-culture/influencer-enneagram-types-instagram.md)

The post classifies MrBeast as Type 3 but describes him as acting through a Type 7
wing, which is impossible for Type 3. It also places Kylie Jenner among Type 3 examples
while the Kardashian article profiles her as Type 9. The unpublished streaming draft
introduces another contradiction by calling MrBeast Type 8.

### Twitter/X Personality Types

File: [`twitter-x-personality-types-toxic.md`](../../src/blog/pop-culture/twitter-x-personality-types-toxic.md)

The article includes specific claims about user concentration, staffing, algorithm
weights, moderation, hate speech, and account deactivations with almost no sourcing.
Much of the evidence is frozen in 2022–24 and needs a 2026 recheck.

### Alex Cooper vs. Alix Earle

File: [`alex-cooper-alix-earle-beef-enneagram-analysis.md`](../../src/blog/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis.md)

The timeline stops in May. Alix Earle has since said the fallout will be addressed in
her forthcoming Netflix reality series.

Source checked:

- [People: Alix Earle says she will address the Alex Cooper feud](https://people.com/alix-earle-reveals-when-she-ll-finally-address-her-feud-with-alex-cooper-12018943)

## Published posts needing a normal update pass

- [`breaking-points-enneagram-analysis.md`](../../src/blog/pop-culture/breaking-points-enneagram-analysis.md):
  says Type 7 goes to Type 1 in growth; Type 1 is its stress direction.
- [`cancel-culture-enneagram-type.md`](../../src/blog/pop-culture/cancel-culture-enneagram-type.md):
  claims cancel culture peaked and declined by 2026 without enough evidence.
- [`epstein-psychology-part-2.md`](../../src/blog/pop-culture/epstein-psychology-part-2.md):
  well sourced but needs the same July legal refresh as Part 1.
- [`ghislaine-maxwell-psychology.md`](../../src/blog/pop-culture/ghislaine-maxwell-psychology.md):
  needs a July legal and document-release refresh.
- [`fallen-founders-enneagram-analysis.md`](../../src/blog/pop-culture/fallen-founders-enneagram-analysis.md):
  release dates, legal statuses, and valuations are volatile.
- [`kardashian-family-enneagram-analysis.md`](../../src/blog/pop-culture/kardashian-family-enneagram-analysis.md):
  Kylie Jenner's Type 9 classification conflicts with the influencer post.
- [`psychology-of-public-shame.md`](../../src/blog/pop-culture/psychology-of-public-shame.md):
  broad psychological mechanisms need stronger sourcing.
- [`tech-titans-disruptors.md`](../../src/blog/pop-culture/tech-titans-disruptors.md):
  current-event-heavy and contains no external evidence links.
- [`tech-titans-enneagram-analysis.md`](../../src/blog/pop-culture/tech-titans-enneagram-analysis.md):
  repeats `5w7` and still calls the existing PayPal Mafia draft "Coming soon."
- [`tech-titans-founders-vs-stewards.md`](../../src/blog/pop-culture/tech-titans-founders-vs-stewards.md):
  repeats `5w7` and needs sources for current company claims.
- [`tech-titans-platform-emperors.md`](../../src/blog/pop-culture/tech-titans-platform-emperors.md):
  volatile platform safety and policy claims are source-free.

## Published posts without an urgent update need

- [`comedy-kings-enneagram-analysis.md`](../../src/blog/pop-culture/comedy-kings-enneagram-analysis.md):
  recently refreshed; source-light but not materially stale.
- [`hollywood-heartthrobs-enneagram-analysis.md`](../../src/blog/pop-culture/hollywood-heartthrobs-enneagram-analysis.md):
  routine biographical sourcing pass eventually.
- [`incel-blackpill-radicalization-enneagram.md`](../../src/blog/pop-culture/incel-blackpill-radicalization-enneagram.md):
  comparatively well sourced and current; one hidden TODO remains.
- [`musk-vs-altman-trial-personality-dynamics.md`](../../src/blog/pop-culture/musk-vs-altman-trial-personality-dynamics.md):
  current as of July 19 and already being edited.
- [`tbpn-john-coogan-jordi-hays-enneagram-dynamic.md`](../../src/blog/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic.md):
  fresh and strongly sourced.
- [`what-enneagram-type-are-most-musicians.md`](../../src/blog/pop-culture/what-enneagram-type-are-most-musicians.md):
  fresh and transparent about methodology.

## Unpublished drafts

### Correct before publication

- [`hormozi-marriage-two-type-3s-enneagram.md`](../../src/blog/pop-culture/hormozi-marriage-two-type-3s-enneagram.md):
  uses the impossible wing `3w8`.
- [`the-office-enneagram-types.md`](../../src/blog/pop-culture/the-office-enneagram-types.md):
  uses `2w7`, `9w4`, a Type 9 with a 7 wing, and other invalid wing combinations.
- [`succession-personality-trap.md`](../../src/blog/pop-culture/succession-personality-trap.md):
  gives Type 3 an 8 wing and Type 5 a 1 wing.
- [`world-leaders-enneagram-personality-dynamics.md`](../../src/blog/pop-culture/world-leaders-enneagram-personality-dynamics.md):
  calls Trump Type 8, conflicting with the current Type 3 position.
- [`onlyfans-creators-enneagram-digital-intimacy.md`](../../src/blog/pop-culture/onlyfans-creators-enneagram-digital-intimacy.md):
  gives unsupported type-based advice about who is psychologically suited to start
  an OnlyFans account.
- [`aoc-and-the-squad-enneagram-types.md`](../../src/blog/pop-culture/aoc-and-the-squad-enneagram-types.md):
  complete draft, but political roles and 2028 speculation need a current check.
- [`depp-vs-heard-enneagram-analysis.md`](../../src/blog/pop-culture/depp-vs-heard-enneagram-analysis.md):
  mostly complete; reverify the legal aftermath and strengthen primary sourcing.

### Unfinished outlines to rebuild from current information

- [`marvel-universe-enneagram-analysis.md`](../../src/blog/pop-culture/marvel-universe-enneagram-analysis.md)
- [`online-gurus-enneagram-analysis.md`](../../src/blog/pop-culture/online-gurus-enneagram-analysis.md)
- [`oscar-contenders-enneagram-analysis.md`](../../src/blog/pop-culture/oscar-contenders-enneagram-analysis.md)
- [`pop-queens-enneagram-analysis.md`](../../src/blog/pop-culture/pop-queens-enneagram-analysis.md)
- [`royal-family-enneagram-analysis.md`](../../src/blog/pop-culture/royal-family-enneagram-analysis.md)
- [`silicon-valley-power-players-enneagram-analysis.md`](../../src/blog/pop-culture/silicon-valley-power-players-enneagram-analysis.md)
- [`streaming-royalty-enneagram-analysis.md`](../../src/blog/pop-culture/streaming-royalty-enneagram-analysis.md):
  also conflicts with the influencer post by calling MrBeast Type 8.
- [`tech-titans-paypal-mafia.md`](../../src/blog/pop-culture/tech-titans-paypal-mafia.md)

### Lower-urgency unpublished material

- [`my-first-million-shaan-sam-enneagram-dynamic.md`](../../src/blog/pop-culture/my-first-million-shaan-sam-enneagram-dynamic.md):
  largely complete; routine current-stat check.
- [`succession-roy-siblings-enneagram-types.md`](../../src/blog/pop-culture/succession-roy-siblings-enneagram-types.md):
  evergreen and comparatively clean.
- [`epstein-web-of-manipulation.md`](../../src/blog/pop-culture/epstein-web-of-manipulation.md):
  appears superseded by Parts 1 and 2; consolidate or archive rather than maintain
  independently.

## Support and research files

The following top-level files are support material rather than publishable articles:

- `incel-exit-post.md`
- `tech-titans-ai-wars-twitter.md`
- `tech-titans-founders-vs-stewards-twitter.md`
- `template.md`

The 10 files in `src/blog/pop-culture/epstien-research` are research notes,
transcripts, source collections, or earlier working drafts:

- `Jeffrey-Epstein-Psychology-Of-The-Web.md`
- `Jeffrey-Epstein-citations.md`
- `Jeffrey-Epstein-luring-tactics.md`
- `Jeffrey-Epstein-research.md`
- `Jeffrey-Epstein.md`
- `breaking-points-summary.md`
- `epstien-connections.md`
- `epstien-pltr.md`
- `epstien-politicians.md`
- `epstien-uk.md`

They were reviewed as supporting material but not scored as publishable blogs.

## Parasocial article remediation research

The first follow-up update focused on
[`parasocial-relationships-enneagram-type.md`](../../src/blog/pop-culture/parasocial-relationships-enneagram-type.md).

### Evidence decisions

1. **Remove the neurological-equivalence claim.** The research located documents
   grief, sadness, shock, reminiscing, memorializing, and parasocial breakup distress.
   It does not establish that parasocial loss activates an identical set of neural
   pathways or is neurologically equivalent to losing someone personally known.

2. **Correct the loneliness framing.** A 2020 meta-analysis synthesizing 120 studies
   found no significant overall relationship between social deficiencies and
   parasocial relationships. The article should not describe parasocial bonds as
   inherently a symptom of loneliness.

3. **Distinguish parasocial interaction from parasocial relationship.** The classic
   1956 concept describes an experience of intimacy at a distance. Later work
   distinguishes an interaction during media use from an enduring bond that persists
   beyond one episode or post.

4. **Treat podcast intimacy as supported but not universal.** A survey of 804 German
   podcast listeners found that perceived host authenticity and attractiveness helped
   predict parasocial ties. As a survey, it does not prove that podcasts are always
   more intimate than television or that listening causes a bond.

5. **Treat monetization evidence as mixed.** A 2025 survey associated stronger
   parasocial relationships with virtual-gifting intentions. A 2026 meta-analysis
   found the pooled relationship large but statistically unstable, while engagement,
   enjoyment, perceived value, and social acceptance were more consistent correlates.

6. **Label the Enneagram mapping as speculation.** No research identified in this
   review validates distinct parasocial patterns by Enneagram type. The type sections
   can remain as explicitly labeled reflection prompts, not predictions, diagnoses, or
   scientific findings.

7. **Do not conflate fandom with dangerous behavior.** Stalking, threats, repeated
   unwanted contact, or a fixed belief in secret reciprocity are safety concerns, not
   an inevitable "extreme" stage of ordinary parasocial attachment.

### Research sources

- Horton, D., & Wohl, R. R. (1956).
  [Mass communication and para-social interaction: Observations on intimacy at a distance](https://doi.org/10.1080/00332747.1956.11023049).
- Tukachinsky, R., Walter, N., & Saucier, C. J. (2020).
  [Antecedents and effects of parasocial relationships: A meta-analysis](https://doi.org/10.1093/joc/jqaa034).
- Chung, S., & Cho, H. (2017).
  [Fostering parasocial relationships with celebrities on social media](https://doi.org/10.1002/mar.21001).
- Schlütz, D., & Hedder, I. (2022).
  [Aural parasocial relations: Host-listener relationships in podcasts](https://doi.org/10.1080/19376529.2020.1870467).
- Liu, L., Dong, Q., Wang, X., Su, C., & Zhu, M. (2025).
  [Unpacking the link between parasocial relationships and gifting in live streaming](https://doi.org/10.1016/j.jretconser.2025.104436).
- Chokpaisan, S., Suwanwong, C., & Thavorn, J. (2026).
  [Virtual gifting as affective monetization: A meta-analysis](https://doi.org/10.1186/s40359-026-04813-x).
- Eyal, K., & Cohen, J. (2006).
  [When good friends say goodbye: A parasocial breakup study](https://doi.org/10.1207/S15506878JOBEM5003_9).
- Cohen, E. L., & Hoffner, C. (2016).
  [Finding meaning in a celebrity's death](https://doi.org/10.1016/j.chb.2016.06.042).
- DeGroot, J. M., & Leith, A. P. (2018).
  [R.I.P. Kutner: Parasocial grief following the death of a television character](https://doi.org/10.1177/0030222815600450).
- Bingaman, J. (2022).
  [Parasocial grieving and the collective mourning of Kobe Bryant on Reddit](https://doi.org/10.1177/0030222820971531).
