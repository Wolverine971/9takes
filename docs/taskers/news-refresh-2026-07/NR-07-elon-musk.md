<!-- docs/taskers/news-refresh-2026-07/NR-07-elon-musk.md -->

# Tasker: Refresh Elon Musk (Type 5)

**For:** one agent, independent run
**Owner:** DJ
**Created:** 2026-07-25
**Status:** done (2026-07-26)
**Related:** [batch README + doctrine](README.md)

---

## 0. What and why

This is the **highest-ceiling and worst-performing page in the batch**, and it is a different problem from the others.

- **2,568 impressions, 3 clicks, position 13.7.** That is the worst position of any major page in the corpus, solidly page two.
- Musk is the **most-searched person on earth**: roughly 4.4 million searches a month.
- Last edited **2026-02-18**, 157 days ago.

Every other tasker in this batch is "the page is stale, freshen it." This one is "the page is not competing." At position 13.7 nobody is reading it regardless of how good it is. The demand is effectively unlimited; the page is the constraint.

Query detail worth noting: `elon musk personality type` sits at **position 27.8** and `elon musk personality` at **40.5**, while `elon musk enneagram type` sits at 9.4. So the page has a foothold on Enneagram-specific queries and is nowhere on the broad personality queries. That is a competitiveness gap, not a freshness gap.

---

## 1. What actually changed: this is a research assignment, not a summary

**Unlike every other tasker in this batch, the events here have not been pre-verified.** The analysis that produced this queue confirmed Musk's search volume and the page's position, but did not establish a timeline of what happened to him after 2026-02-18.

**Do not assume you know.** Do not write from memory. Your first job is to build a dated, sourced timeline of significant events from **2026-02-18 to now**, then decide which of them carry psychological weight. Most will not.

Selection rule: an event belongs in this piece only if it reveals something about how he is wired. Business news, product launches and political noise are only relevant as evidence of a pattern. A funding round is not psychology. A decision made at 3am against everyone's advice might be.

---

## 2. The psychology questions this refresh must answer

Type 5. **Head center, core emotion fear.** Core fear: being helpless, depleted, incapable, overwhelmed by demands. Core desire: competence and self-sufficiency. **Stress → 7. Integration → 8.**

**A. The spine: what does a 5 look like when the withdrawal option is gone?**

The classic 5 retreats to the observatory, conserves resources, and emerges with understanding. Musk is a 5 who built the opposite life: maximum exposure, maximum simultaneous demand, no privacy, no reserve. The interesting question is what happens to a type whose core defense is unavailable to it. The existing page's read is "the psychology behind his chaos": the chaos is the thing to explain, and stress-to-**7** explains a lot of it: scattered, over-committed, chasing the next stimulus, unable to settle on one thing.

Test whether the 2026 timeline shows more scattering or less.

**B. Integration → 8. Where is the difference?**

5 to 8 is the healthy move: acting rather than only theorizing, taking direct responsibility, present in the room. The failure mode that mimics it is the 5 who _performs_ 8, aggression as a substitute for presence. Distinguishing those two in his case is the most valuable analytical work available here, and it is the thing nobody writing about him does.

**C. What does depletion look like for someone who cannot be depleted in public?**

The 5's fear is running out. Look for evidence of the tank being empty: schedule, sleep, the documented pattern of extreme working, anything he has said in 2026 about his own capacity. Observable behavior only, no speculation about his health, and no diagnosis. That is a hard line.

**D. Add to the story, or subtract from it?**
Whatever the 2026 timeline shows, place it on the arc rather than treating it as a new fact. Is he running the same loop at larger scale, or has something changed?

**E. What did it cost him?** The 5 buys self-sufficiency with distance and pays for it in connection. Find the concrete 2026 instance.

**F. Inner dialogue.** The sentence in his head at the moment of the most significant decision in your timeline. His idiom is blunt, funny, and slightly alien; do not write it corporate.

**G. What would the other eight see?** At minimum the **9** (why is any of this necessary), the **1** (this could be done properly), and the **8** (respect for the willingness to act, contempt for the noise).

**H. The reader's mirror.** The reader is the person who takes on more than is survivable because asking for relief feels worse than the load. Land there.

---

## 3. Research assignments

1. **Build the dated timeline, 2026-02-18 to now.** Sourced, primary where possible. This is the whole job and everything else depends on it.
2. **Filter it ruthlessly.** For each event ask: does this reveal how he is wired? Keep three to five. Discard the rest, including things that were enormous news.
3. **Anything he has said in 2026 about his own limits, sleep, workload or capacity.** Highest-value item for a Type 5 read.
4. **Any 2026 instance of him changing his mind publicly**, and how he framed it. 5s update on evidence more readily than most types; if he does not, that complicates the read.
5. **Any 2026 instance of sustained focus on one thing**: the counter-evidence to the stress-to-7 scattering read. Look for it specifically.

### And the separate job: why is this page at 13.7?

This one needs diagnosis, not just writing.

6. **Look at what currently outranks 9takes for `elon musk personality type`.** What are those pages doing structurally? Do not copy their titles, keyword titles test worse corpus-wide, but understand the shape of what wins.
7. **Read the existing page for depth and specificity.** At 37,000 characters it is one of the longest in the corpus. Length is not the problem. Check whether it says anything a reader could not get from ten other pages.
8. **Check internal linking.** How many pages in the corpus link to this one? A page this central to the topic being on page two suggests it is not being supported internally.

Report your findings on 6 to 8 in the completion note even if you cannot fix them in this pass. That diagnosis is worth as much as the refresh.

---

## 4. Doctrine, condensed

Full version in [the batch README](README.md) §1.

**News is the door. Psychology is the room.** With Musk this rule is doing the heaviest lifting in the entire batch, because there is more news about him than anyone alive and almost none of it is psychology. Ruthless filtering is the skill this piece requires.

Answer all eight: (1) the feeling underneath, head-center fear of depletion; (2) inner dialogue; (3) evidence **for, against, or complicating** the Type 5 read, in the published text; (4) stress (→7) or integration (→8), and the performed-8 distinction; (5) arc; (6) cost; (7) what the other eight see; (8) the reader's mirror.

**Observable behavior is evidence. Feelings are interpretation.**

No hedge words. **No pathology. This is the page where that line is most likely to be crossed and it must not be.** No moralizing, and specifically no politics: he is a polarizing figure and the piece takes no side. Same neutrality standard as [NR-03](NR-03-hasan-piker.md).

---

## 5. Mechanics

**The push is a two-step. The bare command is a DRY RUN and writes nothing.**

Step 1, preview the diff:

```bash
node scripts/personBlogParser.js Elon-Musk
```

This prints `Dry-run previewing...`, the field-level diff, an expected content hash, and an approval token of the form `--approve-fields=content,description`.

Step 2, apply exactly what you reviewed:

```bash
node scripts/personBlogParser.js Elon-Musk \
  --apply \
  --expected-content-hash=<hash from step 1> \
  --approve-fields=<token from step 1>
```

Both flags fail closed. A hash mismatch or an approved-field list that does not exactly match the dry-run diff aborts the write, which is the guard against a stale preview overwriting someone else's concurrent edit. `--apply` requires an explicit single person slug and cannot be combined with `--dry-run`.

**If you stop after step 1, nothing has been saved.** The dry run's success message is not a confirmation that the page was updated.

Preserves `lastmod`. **Never `--publish`** on a live page: it is the first-release workflow and rewrites `lastmod`, which breaks DJ's manual-lastmod rule. Never hand-edit `lastmod`.

Zero em-dashes. No quality-comment markers. Valid YAML in FAQ frontmatter.

Do not retitle toward keywords. Tested corpus-wide, keyword titles convert worse (0.391% vs 0.585%).

**This page is a candidate for cutting, not just adding.** At 37,000 characters, if the research shows it is long and unspecific, tightening it is a legitimate outcome. Do not add length reflexively.

---

## 6. Definition of done

- [x] Dated, sourced timeline built for 2026-02-18 onward.
- [x] Timeline filtered to three to five psychologically load-bearing events, with the discards noted.
- [x] The performed-8 versus integrated-8 distinction addressed with evidence.
- [x] Question 3 (for / against / complicating) answered in the published copy.
- [x] Zero political editorializing; no health speculation; no diagnosis.
- [x] Rank diagnosis (§3 items 6 to 8) reported in the completion note.
- [x] Zero em-dashes, no quality markers, valid YAML.
- [x] `personBlogParser.js Elon-Musk` runs clean; `lastmod` unchanged.
- [x] Status updated to `done` with a completion note.

---

## 7. Completion note (2026-07-26)

### What shipped

Rebuilt the page around one spine: a Type 5 whose ordinary withdrawal option is unavailable retreats into another, larger system. A second developmental pass reduced the live parsed body from the original 37,079 characters to 18,412 characters and 2,687 prose words. It removed the duplicate at-a-glance block, research-memo language, repeated type defense, the generic reader-mirror ending, and advanced Enneagram mechanics from the main narrative. The final structure moves from Musk's 2026 admission to the 2017 conference-room collapse, childhood withdrawal, expansion under pressure, three public corrections, present-versus-dominating leadership, relationship cost, and a callback ending. Wing, subtype, arrows, and counterarguments now live in a single 607-word Rabbit Hole. Three direct third-party quotes from Talulah Riley, Kimbal Musk, and Justine Musk satisfy the testimony gate. Five frontmatter FAQs cover broad personality, stress, blind spots, Type 5 versus Type 8, and public mind-changing. Five internal links and fifteen citation URLs are present. The title, meta title, persona title, and `lastmod` were not changed.

Pushed the second pass live through the guarded two-step parser. The reviewed diff was limited to `content`, `faqs`, and `citations`, using expected live hash `ec09600763c00a8bc65182d86eb800f4`. The resulting live hash is `6475b5a71e9b09ee040b9e1bdbd5f9f3`; a follow-up dry run reports no parser-managed field changes. The parser verified `lastmod=2026-02-18` and `published=true` after the write. `blog-lint.sh` reports 0 failures and 0 warnings, the source audit reports no untagged load-bearing quotes, and the same-Type similarity scan is clear at a top score of 0.030 against a 0.040 trip threshold. The stale pre-v2 `content_quality` block was removed locally so the page can be regraded under the current six-dimension rubric.

### Dated timeline and admission tiers

1. **13 March 2026, Tier 1:** after nine of xAI's original eleven co-founders had left, Musk said xAI had not been built right and was being rebuilt from its foundations. This is direct public updating, but the correction named the architecture rather than the leadership relationships. Sources: [Bloomberg](https://www.bloomberg.com/news/articles/2026-03-13/musk-pledges-to-rebuild-xai-as-another-co-founder-departs), [Musk's X post](https://x.com/elonmusk/status/2032201568335044978).
2. **6 May 2026, Tier 1:** Shivon Zilis testified in the OpenAI trial about her relationship with Musk and their four children, including the Austin house where he sometimes stays when visiting them. It gives the concrete 2026 connection cost and also complicates a simple abandonment reading by documenting an ongoing family arrangement. Source: [The Guardian](https://www.theguardian.com/technology/2026/may/06/shivon-zilis-testimony-elon-musk-openai-lawsuit).
3. **12 June 2026, Tier 1 as counter-evidence:** the SpaceX IPO documents presented xAI as an integral pillar and one public infrastructure stack spanning space, connectivity, and AI. The valuation itself was discarded; the corporate convergence matters because it is sustained focus on one thesis, evidence against a one-directional stress-to-7 scattering read. Sources: [SEC prospectus](https://www.sec.gov/Archives/edgar/data/1181412/000162828026036936/spaceexplorationtechnologi.htm), [Nasdaq](https://www.nasdaq.com/newsroom/spacex-ipo-rocket-company-launches-historic-ipo).
4. **13 July 2026, Tier 1:** Musk wrote that he had been clearly wrong about Anthropic and called it the current AI leader, reversing earlier criticism. This is the cleanest evidence that he updates publicly when the competitive evidence changes. Source: [eWeek, with the original post linked](https://www.eweek.com/news/elon-musk-admits-wrong-about-ai/).
5. **23 July 2026, Tier 1 and the central event:** Musk told _The Economist_ he had become too involved in politics and got carried away. Minutes later, when pressed on the human cost of DOGE's speed, he disputed the premise and reduced the result to complaints. That pairing distinguishes strategic correction from relational correction and supplies the performed-8 versus integrated-8 analysis without taking a political position. Sources: [full interview transcript](https://elonmuskarchive.org/video/economist-elon-musk-2026-07-23), [The Guardian's report](https://www.theguardian.com/technology/2026/jul/23/elon-musk-regret-trump-doge-ai).

No reliable post-18-February statement from Musk about sleep, working hours, or physical capacity was found. The page uses only his admission of over-involvement as capacity evidence. No health inference or diagnosis was added.

### Discarded news

- **Tesla Q1 and Q2 earnings, Roadster, robotaxi, and Optimus updates, Tier 3:** large business and product news without new psychological evidence.
- **SpaceX valuation and trillionaire headlines, Tier 3:** scale without mechanism.
- **The OpenAI verdict, Tier 2:** consequential, but it mostly repeats the established public-conflict pattern. Zilis's testimony from the trial carried new relational evidence, so only that entered the page.
- **The Terafab announcement, Tier 2:** confirms simultaneous commitments and the converging AI stack, but the IPO prospectus supplied stronger primary evidence in less space.
- **The proposed Grok-generated _Odyssey_ film, Tier 3:** novelty without useful evidence about motive.

### Why the page was at position 13.7

**SERP shape.** Current results for `elon musk personality type` are dominated by short, exact-answer pages such as [Persona Key](https://www.typesmbti.com/elon-musk-mbti), [Enneagram Universe](https://enneagramuniverse.com/celebrities/elon-musk), [GetPersonality](https://www.getpersonality.com/characters/2c42a167e1f3704ddc/elon-musk-mbti-personality), and [BrainManager](https://brainmanager.io/blog/personality/elon-musk-personality-type). They put the type in the first screen, use scan-friendly tables or trait blocks, and usually answer MBTI plus Enneagram and Big Five intent. Their analysis is generally thinner than 9takes, but their query match and information architecture are clearer. The rewrite adds an exact-answer H2/H3, a compact TL;DR, a direct MBTI context sentence, and broad-query FAQ schema without changing the tested persona title.

**Depth and specificity.** Length was actively hurting the argument. The old draft was distinctive in anecdotes but repeated the same Type 5 claim through separate childhood, mind, first-principles, stress, empire, family, DOGE, blind-spots, and closing sections. Its best distinction, grounded Eight versus broadcast force, was scattered across the page. The rewrite cuts just over half of the original live characters and makes that distinction the center. The evidence that complicates the type read is the 2026 convergence of his companies around one sustained AI-and-space thesis and his three public corrections. Those facts prevent the piece from treating every event as convenient confirmation.

**Internal linking.** Twenty-nine other published pages link to the Elon Musk URL, with 31 total link occurrences. That is substantial support and makes weak internal linking an unlikely primary cause of the rank gap. Anchor distribution and placement could still be audited later, but raw link count is not the missing lever.
