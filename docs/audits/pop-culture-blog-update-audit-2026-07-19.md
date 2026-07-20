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

No content files were changed during the initial audit. The existing working-tree
modification to `musk-vs-altman-trial-personality-dynamics.md` was treated as user
work and left untouched. Follow-up remediation began after the audit:

- `parasocial-relationships-enneagram-type.md` — completed July 19, 2026
- `masculinity-strength-and-the-enneagram.md` — completed July 19, 2026
- `dark-triad-meets-enneagram.md` — completed July 19, 2026
- `reddit-moderators-type-1-internet.md` — completed July 19, 2026
- `influencer-enneagram-types-instagram.md` — completed July 19, 2026
- `twitter-x-personality-types-toxic.md` — next in the remediation queue

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

**Status: remediated July 19, 2026.** See the remediation notes and sources at the end
of this report.

### Dark Triad Meets the Enneagram

File: [`dark-triad-meets-enneagram.md`](../../src/blog/pop-culture/dark-triad-meets-enneagram.md)

The post assigns Enneagram structures and emotional motives to named murderers and
criminals with no external source links. Its disclaimer helps, but the body often
speaks diagnostically. It needs stronger sourcing and more disciplined separation
between documented facts and speculative interpretation.

The image-generation prompts are enclosed in HTML comments and are not a live
rendering problem.

**Status: remediated July 19, 2026.** See the remediation notes and sources at the end
of this report.

### Reddit Moderators

File: [`reddit-moderators-type-1-internet.md`](../../src/blog/pop-culture/reddit-moderators-type-1-internet.md)

The article presents Type 1 dominance among volunteer moderators as fact without
evidence. It also predates Reddit's March 2026 moderation limits, which cap a person at
five communities with more than 100,000 weekly visitors.

Source checked:

- [Reddit Help: Moderation limits](https://support.reddithelp.com/hc/en-us/articles/37922094698772-Moderation-limits)

**Status: remediated July 19, 2026.** See the remediation notes and sources at the end
of this report.

### Influencer Enneagram Types

File: [`influencer-enneagram-types-instagram.md`](../../src/blog/pop-culture/influencer-enneagram-types-instagram.md)

The post classifies MrBeast as Type 3 but describes him as acting through a Type 7
wing, which is impossible for Type 3. It also places Kylie Jenner among Type 3 examples
while the Kardashian article profiles her as Type 9. The unpublished streaming draft
introduces another contradiction by calling MrBeast Type 8.

**Status: remediated July 19, 2026.** See the remediation notes and sources at the end
of this report.

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

**Status: remediated July 19, 2026.** The revision removed the unsupported
neurological-equivalence claim, narrowed the loneliness and monetization language,
distinguished parasocial interaction from parasocial relationship, labeled the
Enneagram sections as a non-clinical reflection framework, added a safety distinction
between fandom and dangerous conduct, and incorporated the research below. The
MDsvex/Svelte markup, structured FAQ data, formatting, and stale-claim scan all passed
validation.

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

## Masculinity article remediation research

The second follow-up update focused on
[`masculinity-strength-and-the-enneagram.md`](../../src/blog/pop-culture/masculinity-strength-and-the-enneagram.md).

**Status: remediated July 19, 2026.** The revision replaced the universal "what women
select for" thesis with a narrower discussion of stated preferences, real-life
attraction, relationship capacities, and individual variation. It removed the
unsupported prehistoric division-of-labor narrative, deterministic biological
language, age-based claims, and the assertion that one kind of emotional strength is
universally most attractive. It also reframed the Enneagram sections as non-clinical
reflection prompts and added the research below.

### Evidence decisions

1. **Separate group averages from individual rules.** A preregistered 45-country
   study found average sex differences in some stated mate preferences. Those results
   do not establish what every woman or man wants, do not eliminate cultural or
   individual variation, and do not by themselves establish one exclusively
   biological explanation.

2. **Separate stated preferences from attraction after meeting.** Speed-dating
   research found familiar sex differences in stated ideals but did not find the
   expected sex-differentiated relationship between those ideals and desire for people
   participants actually met.

3. **Reject deterministic attraction forecasts.** Machine-learning models using more
   than 100 traits and preferences could predict some broad actor and partner
   tendencies but could not predict unique desire between two people before they met.
   These studies focused mainly on other-sex attraction and should not be generalized
   into a complete account of queer dating.

4. **Do not treat physique as proof of character.** Exercise can support physical and
   mental health. The cited evidence does not show that a muscular body proves
   discipline, reliability, morality, or relationship readiness.

5. **Discuss emotional regulation as a relationship capacity, not a universal
   attraction trigger.** Research links constructive emotion regulation and perceived
   partner responsiveness with relationship satisfaction. It does not establish that
   emotional regulation is the single most attractive masculine trait.

6. **Treat masculine norms specifically.** A meta-analysis found that conformity to
   some norms—especially self-reliance, power over women, and "playboy" behavior—was
   associated with worse mental-health-related outcomes. That is not evidence that all
   masculinity is harmful or that one alternative masculinity guarantees wellbeing or
   romantic success.

7. **Label the Enneagram mapping as editorial.** No cited study validates the
   article's three-dimension framework or its type-specific reflections. They remain
   prompts for self-examination, not clinical assessments or scientific predictions.

### Research sources

- Walter, K. V., et al. (2020).
  [Sex differences in mate preferences across 45 countries: A large-scale replication](https://doi.org/10.1177/0956797620904154).
- Eastwick, P. W., & Finkel, E. J. (2008).
  [Sex differences in mate preferences revisited](https://doi.org/10.1037/0022-3514.94.2.245).
- Joel, S., Eastwick, P. W., & Finkel, E. J. (2017).
  [Is romantic desire predictable?](https://doi.org/10.1177/0956797617714580).
- Bloch, L., Haase, C. M., & Levenson, R. W. (2014).
  [Emotion regulation predicts marital satisfaction](https://doi.org/10.1037/a0034272).
- Gadassi, R., et al. (2016).
  [Perceived partner responsiveness and marital satisfaction](https://doi.org/10.1007/s10508-014-0448-2).
- Wong, Y. J., Ho, M.-H. R., Wang, S.-Y., & Miller, I. S. K. (2017).
  [Masculine norms and mental-health-related outcomes](https://doi.org/10.1037/cou0000176).
- Munro, N. R., et al. (2026).
  [Effect of exercise on depression and anxiety symptoms](https://doi.org/10.1136/bjsports-2025-110301).

### Validation

- The article passed direct MDsvex preprocessing and Svelte 5 server compilation with
  zero warnings.
- The official Svelte autofixer reported no component issues.
- Prettier, `git diff --check`, and the targeted stale-claim scan passed.
- The full repository `pnpm check` still reports three pre-existing TypeScript errors
  in `scripts/personBlogParser.js` and 140 warnings in unrelated files. It reported no
  diagnostic for the revised article.

## Dark Triad article remediation research

The third follow-up update focused on
[`dark-triad-meets-enneagram.md`](../../src/blog/pop-culture/dark-triad-meets-enneagram.md).

**Status: remediated July 19, 2026.** The revision removed all named-criminal
Enneagram assignments and the unsupported claims about their motives, empathy,
remorse, diagnoses, and inner states. It now distinguishes trait research from
clinical diagnosis, explains the empirical limits of the Enneagram, labels the nine
type sections as hypothetical reflection prompts, and directs readers to assess
observable behavior rather than personality labels.

### Evidence decisions

1. **Restore the Dark Triad's research meaning.** The original 2002 study examined
   subclinical narcissism, Machiavellianism, and psychopathy in a student sample. A
   score on those traits is not a remote clinical diagnosis or proof of abuse,
   criminality, motive, or violence.

2. **Acknowledge overlap and measurement limits.** A 2017 meta-analysis found the
   three traits substantially intercorrelated and associated with multiple negative
   psychosocial outcomes. It also questioned whether the constructs are sufficiently
   distinct and whether common brief measures capture malevolent personality with
   enough complexity.

3. **Do not invent an Enneagram crosswalk.** A systematic review of 104 independent
   Enneagram samples found mixed reliability and validity evidence. It found no
   clustering study that derived the nine types and little support for several
   secondary concepts. Neither that review nor the broader search conducted for this
   update established a validated Dark Triad-by-Enneagram mapping.

4. **Remove true-crime personality typing.** Public records may establish acts and
   outcomes. They do not establish an Enneagram type, Dark Triad score, private motive,
   empathy level, remorse, or the mental process behind a crime.

5. **Make the nine sections explicitly hypothetical.** The revised type sections
   examine possible rationalizations only. Each is paired with observable behaviors
   and an accountability question, and none claims that a type causes or predicts a
   harmful pattern.

6. **Use behavior for safety decisions.** Repeated deception, boundary violations,
   coercive control, threats, retaliation, isolation, and escalation are more useful
   for choosing a response than an Enneagram number or an informal Dark Triad label.
   These examples are practical guidance, not a validated risk-assessment scale.

7. **Correct the Light Triad framing.** The 2019 Light Triad study found a moderate
   negative correlation with the Dark Triad (`r = -0.48`) across four studies with
   1,518 participants. The constructs were not simple opposites, and the correlational
   design did not establish that adopting Light Triad beliefs causes dark traits to
   disappear.

### Research sources

- Paulhus, D. L., & Williams, K. M. (2002).
  [The Dark Triad of personality](<https://doi.org/10.1016/S0092-6566(02)00505-6>).
- Muris, P., Merckelbach, H., Otgaar, H., & Meijer, E. (2017).
  [The malevolent side of human nature](https://doi.org/10.1177/1745691616666070).
- Hook, J. N., Hall, T. W., Davis, D. E., Van Tongeren, D. R., & Conner, M. (2021).
  [The Enneagram: A systematic review](https://doi.org/10.1002/jclp.23097).
- Kaufman, S. B., Yaden, D. B., Hyde, E., & Tsukayama, E. (2019).
  [The Light vs. Dark Triad of personality](https://doi.org/10.3389/fpsyg.2019.00467).

### Validation

- The article passed direct MDsvex preprocessing and Svelte 5 server compilation with
  zero warnings.
- The official Svelte autofixer reported no component issues after one unnecessary
  image-property interpolation was simplified.
- Prettier, `git diff --check`, JSON parsing, metadata consistency checks, and the
  targeted stale-claim scan passed.
- The full repository `pnpm check` still reports three pre-existing TypeScript errors
  in `scripts/personBlogParser.js` and 140 warnings in unrelated files. It reported no
  diagnostic for either revised article.

## Reddit moderators article remediation research

The fourth follow-up update focused on
[`reddit-moderators-type-1-internet.md`](../../src/blog/pop-culture/reddit-moderators-type-1-internet.md).

**Status: remediated July 19, 2026.** The revision removed the unsupported claim that
Type 1s dominate Reddit moderation, the categorical type-by-type motives and burnout
predictions, the outdated concentration framing, and the unrelated Wikipedia and
historical controversy sections. It now separates current Reddit policy, empirical
volunteer-moderation research, and an explicitly editorial Enneagram reflection
framework.

### Evidence decisions

1. **Do not claim a moderator type distribution.** No identified study measured the
   Enneagram types of Reddit moderators. The revised article states that directly and
   does not present Type 1, 5, 6, or 8 dominance as a finding.

2. **Describe the labor as heterogeneous.** Research using private logs from more than
   900 moderators across 126 subreddits found substantial variation across moderators
   and communities and showed that visible actions undercount behind-the-scenes labor.
   That evidence does not support a four-type taxonomy.

3. **Use measured psychological constructs.** A survey of 605 Reddit moderators
   studied fairness, autonomy, belonging, security, competence, institutional
   acceptance, and governance processes. The revision reports its tradeoffs without
   translating those constructs into Enneagram types or treating association as
   causation.

4. **Correct the burnout section.** Research on former Reddit and Facebook Group
   volunteer moderators linked distress and quitting with team conflict, harmful
   behavior by team leads, and insufficient time. It did not establish that Type 1s
   burn out fastest or validate type-specific exit styles.

5. **Update platform concentration policy.** Since March 31, 2026, Reddit has actively
   enforced a limit of five communities with more than 100,000 weekly visitors per
   moderator account, subject to listed exemptions. The revision explains what the
   rule changes and what it does not solve.

6. **Correct the accountability claim.** Moderators retain substantial local
   discretion, and not every subreddit decision has an independent appeal. However,
   Reddit's Moderator Code of Conduct authorizes warnings, moderator removal,
   community restrictions, suspensions, and other enforcement, so "zero oversight"
   was inaccurate.

7. **Keep the Enneagram inward-facing.** The nine-type table is labeled as editorial.
   Each row offers a possible contribution, a strain pattern, and an accountability
   question. It is not a personality assessment, a remote typing method, or a causal
   model of moderator behavior.

8. **Recommend observable safeguards.** The revised guidance focuses on clear rules,
   review for ambiguous cases, reconsideration paths, distributed permissions,
   manageable workloads, team conflict procedures, and skill- and perspective-based
   recruitment.

### Research sources

- Bulat, B., Wang, H., Fujimoto, S., & Frey, S. (2025).
  [The psychology of volunteer moderators](https://doi.org/10.1177/14614448241259028).
- Schöpke-Gonzalez, A. M., Atreja, S., Shin, H. N., Ahmed, N., & Hemphill, L. (2024).
  [Why do volunteer content moderators quit?](https://doi.org/10.1177/14614448221138529).
- Li, H., Hecht, B., & Chancellor, S. (2022).
  [All That's Happening behind the Scenes](https://doi.org/10.48550/arXiv.2205.14529).
- Reddit.
  [Moderator Code of Conduct](https://redditinc.com/policies/moderator-code-of-conduct).
- Reddit Help.
  [Moderation limits](https://support.reddithelp.com/hc/en-us/articles/37922094698772-Moderation-limits).

### Validation

- The article passed direct MDsvex preprocessing and Svelte 5 server compilation with
  zero warnings.
- The official Svelte autofixer reported no component issues.
- Prettier, `git diff --check`, JSON parsing, metadata consistency checks, and the
  targeted stale-claim scan passed.
- The full repository `pnpm check` still reports three pre-existing TypeScript errors
  in `scripts/personBlogParser.js` and 140 warnings in unrelated files. It reported no
  diagnostic for the revised Reddit article.

## Influencer article remediation research

The fifth follow-up update focused on
[`influencer-enneagram-types-instagram.md`](../../src/blog/pop-culture/influencer-enneagram-types-instagram.md).

**Status: remediated July 19, 2026.** The revision removed the unsupported claim that
Type 3s dominate Instagram, the celebrity type assignments, the impossible Type 7
wing assigned to a Type 3, and the deterministic platform-fit, burnout, spending,
negotiation, audience-harm, and exit-style predictions. It now separates platform
ranking mechanics, the limited creator-wellbeing evidence, audience research, and an
explicitly editorial Enneagram reflection framework.

### Evidence decisions

1. **Do not claim an influencer type distribution.** No identified study measured the
   Enneagram types of Instagram creators or established that Type 3s are more common
   or successful. The revised headline and quick answer state that limitation.

2. **Describe ranking through observable signals.** Meta's Feed system card describes
   models that predict viewer actions such as comments, likes, saves, profile taps,
   and viewing, using post attributes and interaction history. Meta publishes separate
   system cards for several Instagram surfaces. This does not support the claim that
   Instagram has one personality or selects creators by Enneagram type.

3. **Separate public strategy from private motive.** A/B testing, high output,
   curation, disclosure, and sponsorships can reflect many motives or a team's standard
   production practices. They do not establish a creator's core type.

4. **Resolve the named-person contradictions.** The revision no longer uses MrBeast,
   Kylie Jenner, or other public figures as proof of a type-platform relationship. It
   explicitly explains that a Type 3 can only have a Type 2 or Type 4 wing, not a Type
   7 wing.

5. **State how thin the creator-wellbeing evidence is.** A 2024 review found very
   little direct evidence about influencers as an occupational group. A 2025
   qualitative study of 12 Swedish creators identified possible tensions involving
   income, authenticity, exposure, sponsorships, negative comments, and
   disconnection, but its authors cautioned against broad generalization.

6. **Do not confuse audience associations with creator causation.** A 2024
   meta-analysis found associations between problematic Instagram use and distress
   across 37 heterogeneous studies with 14,305 participants. It did not establish
   causation or type-specific susceptibility.

7. **Represent influencer health effects narrowly.** A systematic review of 12
   intervention studies found both positive and negative health outcomes. Negative
   effects were most consistent for idealized body imagery and body dissatisfaction,
   while many studies had methodological or generalizability limits.

8. **Keep the Enneagram inward-facing.** The new nine-type table offers one possible
   creative contribution, pressure pattern, and sustainability question for each type.
   It is labeled as editorial and is not a ranking, assessment, or prediction model.

9. **Frame burnout behaviorally and structurally.** The revised article replaces
   type-specific burnout and quitting scripts with observable pressures involving
   distribution volatility, income, exposure, scaled intimacy, harassment, work-life
   boundaries, and identity. Its warning signs are explicitly non-diagnostic.

### Research sources

- Meta.
  [Instagram Feed ranking system card](https://ai.meta.com/tools/system-cards/instagram-feed-ranking/).
- Bray, I., Lerigo-Sampson, M., Morey, Y., & Williams, J. (2024).
  [Mental health of social media influencers](https://doi.org/10.1093/joccuh/uiae045).
- Öberg, C., & Arvidsson, H. (2025).
  [The health paradoxes of social media influencers](https://doi.org/10.1186/s13731-025-00472-1).
- Sepas, A., et al. (2024).
  [Problematic Instagram use, psychological distress, and wellbeing](https://doi.org/10.1089/cyber.2023.0222).
- Powell, J., & Pring, T. (2024).
  [The impact of social media influencers on health outcomes](https://doi.org/10.1016/j.socscimed.2023.116472).

### Validation

- The article passed direct MDsvex preprocessing and Svelte 5 server compilation with
  zero warnings.
- The official Svelte autofixer reported no component issues.
- Prettier, `git diff --check`, JSON parsing, metadata consistency checks, and the
  targeted stale-claim scan passed.
- The full repository `pnpm check` still reports three pre-existing TypeScript errors
  in `scripts/personBlogParser.js` and 140 warnings in unrelated files. It reported no
  diagnostic for the revised influencer article.
