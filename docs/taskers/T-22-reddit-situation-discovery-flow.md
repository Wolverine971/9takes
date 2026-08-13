<!-- docs/taskers/T-22-reddit-situation-discovery-flow.md -->

# Tasker: Run Reddit Situation and Interpretation Discovery

**For:** Audience research and community-discovery agent
**Owner:** DJ
**Created:** 2026-08-13
**Status:** Ready for read-only discovery. Posting, messaging, and outreach are not authorized.
**Related:** `docs/taskers/T-21-situations-and-interpretations-product-research.md`, `reddit/README.md`, `docs/growth/growth-log.md`, `docs/quora/question-log.md`

## 0. What and why

Reddit contains natural descriptions of the confusing interpersonal events 9takes wants to help people interpret. Use it as a discovery surface before treating it as a distribution channel.

The goal is to learn:

- how people describe situations in their own words;
- which events produce sharply different interpretations;
- which relationships and emotional tensions recur;
- what information commenters ask for before offering a useful interpretation;
- what makes an answer feel clarifying, reductive, manipulative, or unsafe; and
- which situations could become respectful 9takes prompts, founder-led Reels, or product tests.

This task is read-only. Do not post, comment, vote, follow, message, join communities, collect private information, or promote 9takes.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/taskers/T-21-situations-and-interpretations-product-research.md`
4. `reddit/README.md`
5. Newest relevant entries in `docs/growth/growth-log.md`
6. Existing question categories, question prompts, and strategic-question experiments
7. `docs/quora/question-log.md` for prior audience-language patterns and duplication avoidance

Use current web research because Reddit content, community rules, and platform access change. Record access dates and direct thread URLs. Respect community rules and public-content boundaries.

## 2. Research boundaries

### Include

- Public threads centered on an actual event, interaction, message, conflict, ambiguity, or decision
- Threads where commenters offer meaningfully different interpretations
- Relationship, family, workplace, friendship, identity, social-dynamics, communication, and life-decision contexts
- Both highly engaged threads and ordinary threads with clearer user language
- Comments only to understand interpretive diversity and information needs

### Exclude or handle only as safety research

- Active crises, self-harm, abuse, stalking, coercive control, medical emergencies, or situations requiring professional intervention
- Minors' identifying or sexual content
- Doxxing, deleted material, private communities, leaked content, or attempts to identify anonymous users
- Threads that would require reproducing sensitive personal details
- Posts whose primary job is diagnosis, legal judgment, or emergency advice

Never copy a person's story into 9takes. Abstract patterns and remove identifying details. A future public prompt must be newly written and general enough that the original poster could not reasonably recognize it as a reproduction of their story.

## 3. Sampling plan

Collect a diverse sample of at least 40 public threads from the most recent useful 90-day window, expanding only when a category lacks enough examples. Do not let one large subreddit dominate the sample.

Search across situation families such as:

- ambiguous text messages and being left on read;
- partner asks for space;
- friend suddenly withdraws;
- criticism that felt personal;
- boss praises publicly and criticizes privately;
- boundary interpreted as rejection;
- help interpreted as control;
- silence interpreted as anger;
- social exclusion and belonging;
- family obligation and resentment;
- apology accepted or rejected;
- conflicting memories of the same event;
- advice that sounds caring to one person and dismissive to another;
- public figure behavior interpreted in opposing ways; and
- decisions where values conflict.

Select communities based on relevance and current rules. Do not pre-commit to a fixed subreddit list if better evidence appears elsewhere.

## 4. Capture schema

For every thread, record:

| Field                     | Meaning                                                                          |
| ------------------------- | -------------------------------------------------------------------------------- |
| URL and access date       | Direct public source                                                             |
| Situation family          | Generalized event pattern                                                        |
| Relationship and setting  | Partner, friend, parent, boss, stranger, public event, or other                  |
| User's stated question    | Paraphrased, not copied                                                          |
| Missing context           | What commenters needed to know                                                   |
| Competing interpretations | Two or more materially different readings                                        |
| Emotional tensions        | Rejection, control, shame, duty, autonomy, belonging, fear, competence, or other |
| Helpful answer pattern    | What made a response clarifying or useful                                        |
| Harmful answer pattern    | Diagnosis, certainty, manipulation, projection, cruelty, or unsafe advice        |
| Candidate abstraction     | A de-identified reusable situation prompt                                        |
| Product relevance         | Search, browse, reveal, personal comparison, session, Reel, or none              |
| Safety level              | Low, medium, high, or exclude                                                    |

Do not record usernames, profile histories, locations, employers, screenshots, or unnecessary personal details.

## 5. Analysis

### Situation taxonomy

Cluster the sample by:

- event;
- relationship;
- ambiguity type;
- emotional tension;
- decision required;
- information missing; and
- degree of interpretive disagreement.

Compare this bottom-up taxonomy with current 9takes question categories. Identify where the existing hierarchy helps, where it is too topical or abstract, and where tags or facets would work better than categories.

### Interpretation patterns

Identify recurring contrasts such as:

- rejection versus overwhelm;
- control versus care;
- disrespect versus directness;
- avoidance versus processing time;
- selfishness versus boundary protection;
- incompetence versus different priorities;
- deception versus privacy;
- indifference versus fear; and
- criticism versus attempted improvement.

Do not force every contrast into an Enneagram type. First capture the human interpretive pattern, then note whether personality context might add value.

### Founder response opportunities

Identify ten thread archetypes where DJ could later contribute a useful, non-promotional answer. Draft a response approach, not a post-ready reply, covering:

- what DJ would validate;
- which assumptions he would widen;
- what clarification he would ask;
- which alternative interpretations he could offer; and
- where he should stop and recommend professional or local support.

No replies may be posted from this task.

## 6. Outputs

Create:

1. `docs/research/2026-08-13_reddit-situation-discovery.md`
2. `docs/research/data/2026-08-13_reddit-situation-sample.csv`

The memo must include:

- sample method and limitations;
- situation taxonomy;
- top recurring interpretation contrasts;
- current-category gaps;
- 25 de-identified candidate situation prompts;
- ten founder-response archetypes;
- five founder-led Reel concepts rooted in observed language;
- safety and privacy findings;
- recommendations for T-21 search, browse, and data modeling; and
- a proposed later three-replies-per-week participation experiment that remains DJ-gated.

The CSV must contain the capture schema but no usernames or copied post bodies.

## 7. Verification checklist

- [ ] At least 40 public threads were sampled across multiple relevant communities.
- [ ] Sources and access dates were recorded.
- [ ] No usernames, profile histories, private data, screenshots, or copied post bodies were stored.
- [ ] Every reusable prompt was materially abstracted and de-identified.
- [ ] Safety exclusions were documented and respected.
- [ ] The taxonomy emerged from real language rather than only Enneagram theory.
- [ ] Competing interpretations are genuinely different, not paraphrases.
- [ ] Helpful and harmful answer patterns were both analyzed.
- [ ] Findings feed directly into T-21's search, category, and data-model decisions.
- [ ] No Reddit post, comment, vote, message, follow, join, or promotion occurred.
- [ ] `rg -n $'\u2014' docs/taskers/T-22-reddit-situation-discovery-flow.md docs/research/2026-08-13_reddit-situation-discovery.md` returns no matches.

## 8. Risks and gotchas

- Reddit users are not a representative sample of all relationship or personality contexts.
- High-engagement threads overrepresent dramatic conflict and confident takes.
- Public availability does not make a personal story appropriate to reproduce.
- Comment consensus can be wrong, cruel, diagnostic, or driven by missing context.
- Search results may surface old content despite a requested date range. Verify dates.
- Discovery is not permission to contact or market to the original poster.
- The eventual product must not turn vulnerable disclosures into spectacle.

## 9. Definition of done

The task is done when a privacy-safe sample of real situation language has produced a bottom-up taxonomy, recurring interpretation contrasts, de-identified prompt candidates, founder-response opportunities, and concrete inputs for the situations-and-interpretations product research, with no external action taken.
