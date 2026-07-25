<!-- docs/taskers/news-refresh-2026-07/NR-07-elon-musk.md -->

# Tasker: Refresh Elon Musk (Type 5)

**For:** one agent, independent run
**Owner:** DJ
**Created:** 2026-07-25
**Status:** open
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

```bash
node scripts/personBlogParser.js Elon-Musk
```

Preserves `lastmod`. **Never `--publish`** on a live page. Never hand-edit `lastmod`.

Zero em-dashes. No quality-comment markers. Valid YAML in FAQ frontmatter.

Do not retitle toward keywords. Tested corpus-wide, keyword titles convert worse (0.391% vs 0.585%).

**This page is a candidate for cutting, not just adding.** At 37,000 characters, if the research shows it is long and unspecific, tightening it is a legitimate outcome. Do not add length reflexively.

---

## 6. Definition of done

- [ ] Dated, sourced timeline built for 2026-02-18 onward.
- [ ] Timeline filtered to three to five psychologically load-bearing events, with the discards noted.
- [ ] The performed-8 versus integrated-8 distinction addressed with evidence.
- [ ] Question 3 (for / against / complicating) answered in the published copy.
- [ ] Zero political editorializing; no health speculation; no diagnosis.
- [ ] Rank diagnosis (§3 items 6 to 8) reported in the completion note.
- [ ] Zero em-dashes, no quality markers, valid YAML.
- [ ] `personBlogParser.js Elon-Musk` runs clean; `lastmod` unchanged.
- [ ] Status updated to `done` with a completion note.
