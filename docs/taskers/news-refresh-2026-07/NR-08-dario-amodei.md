<!-- docs/taskers/news-refresh-2026-07/NR-08-dario-amodei.md -->

# Tasker: Refresh Dario Amodei (Type 5)

**For:** one agent, **run together with [NR-06 Sam Altman](NR-06-sam-altman.md)**
**Owner:** DJ
**Created:** 2026-07-25
**Status:** open
**Related:** [batch README + doctrine](README.md)

---

## 0. What and why

`/personality-analysis/dario-amodei` earns 1,585 impressions at position 7.8, converting 9 clicks. Last edited **2026-03-23**, 124 days ago.

**Run this with NR-06.** Same three events, same six months, opposite types. Collect the research once. The contrast between how a 5 and a 4 handled identical pressure is the most interesting thing either piece has going for it, and you only see it if one agent holds both.

---

## 1. What actually changed (verify each before using)

- **Anthropic is preparing an IPO**, reported at roughly a $1 trillion valuation, on a similar timeline to OpenAI's.
- **He walked back his own signature claim.** Having said AI could eliminate up to 50% of white-collar jobs, he now says automation may **expand** the work people do.
- **G7 summit, Évian-les-Bains, France, June 2026.** He asked G7 leaders to collaborate on advanced AI **following a US export block on Anthropic's latest model**, speaking in front of Trump and other leaders. Altman backed him. He, Altman and Demis Hassabis proposed a technical standards body and a US-led evaluation forum.
- **Anthropic ran attack ads against OpenAI during the Super Bowl.**
- **India AI summit, February 2026:** he and Altman declined to hold hands during a photo op.

**Sourcing note:** IPO reporting is reporting. Attribute it. Do not state the valuation as settled.

---

## 2. The psychology questions this refresh must answer

Type 5. **Head center, core emotion fear.** Core fear: being helpless, depleted, incapable, overwhelmed by demands he cannot meet. Core desire: competence and self-sufficiency, to have enough understanding and enough resources that nothing can drain him. **Stress → 7. Integration → 8.**

**A. The spine: the 5 who kept getting out of the room went to the G7 and asked heads of state for help.**

This is the single strongest observation available and the existing page's title already sets it up. A Type 5's entire strategy is self-sufficiency, withdraw, understand, need nothing from anyone, because needing is how you get depleted. Standing in front of the G7 and **asking for collaboration**, after an export block took something away from him, is the 5 doing the thing the 5 is built not to do.

Type 5 in integration moves to **8**: stepping out of the observatory and into the arena, taking up space, acting instead of preparing. The G7 appearance and the Super Bowl attack ads are both 8-shaped. Is this a 5 integrating, or a 5 cornered hard enough that withdrawal stopped being available? Those look identical from outside. What distinguishes them is whether the move was chosen or forced. Find out.

**B. The retraction is the opposite shape to Altman's. Say so explicitly.**

Both men publicly walked back a major claim in the same window. Altman's was about being wrong. Amodei's was about **the model of the world being wrong**: automation may expand work rather than destroy it. That is a 5 updating a framework, which is the least painful kind of reversal for the type: the ideas are held tightly, the ego is not attached to having been right, because the point was always the accuracy.

Test that. If he has been defensive about the retraction rather than analytical, that complicates the read and belongs in the published text.

**C. Super Bowl attack ads from the most reticent man in AI.**

A Type 5 does not usually buy the loudest advertising slot in America to attack a rival by name. This is either the 8-ward integration arrow again, or a decision made by an organization that has outgrown its founder's temperament. Find out how involved he was. If it was not his call, that is a more interesting finding than if it was.

**D. Stress → 7. What does scattering look like for him?**

A 5 under stress goes to **7**: scattered, over-committed, chasing stimulation, unable to settle. In a year with an IPO, a G7 appearance, an export fight and an ad war, look for evidence of a man doing too many things rather than the deep single thing. That is the failure mode.

**E. The export block is the 5's core fear made literal.**

Something he needed was taken away by a power he could not argue with. That is _depletion by external force_, the exact thing the type's whole architecture exists to prevent. His response, going public and asking for help, is the notable part.

**F. Add to the story, or subtract from it?**
The existing thesis is a man building what he fears. A year of stepping into public conflict either deepens that or replaces it. Say which.

**G. Inner dialogue.** The sentence in his head walking into the G7 room. His idiom is careful, qualified, precise; do not write it stirring.

**H. What would the other eight see?** At minimum the **8** (finally), the **9** (why make enemies), and the **6** (he is right to want a standards body, that is what institutions are for).

**I. The reader's mirror.** The reader is the person who would rather understand a problem alone for another six months than ask one person for help. That is the universal 5 pattern and it is the most relatable thing in the piece.

---

## 3. Research assignments

Shared with NR-06 unless marked.

1. **The G7 Évian-les-Bains session**: what he actually said, transcript or direct quotes, plus the framing of the request. _Shared, and load-bearing for this piece specifically._
2. **The export block**: what was blocked, by whom, on what grounds, when. _Amodei-specific and load-bearing._ Get primary reporting; this is easy to garble.
3. **The full retraction quote on the jobs claim**, in context, with the original claim quoted alongside it. _Amodei-specific._
4. **His degree of involvement in the Super Bowl ads**: did he defend them, distance himself, or not comment? _Amodei-specific and high-value._
5. **The India summit photo op**: footage, both explanations. _Shared._
6. **IPO reporting** and any direct comment from him about taking Anthropic public. _Shared._
7. **Any 2026 statement where he describes the personal cost of the job.** A 5 talking about depletion is the best possible evidence and he is more candid about this than most founders. _Amodei-specific._

---

## 4. Doctrine, condensed

Full version in [the batch README](README.md) §1.

**News is the door. Psychology is the room.** The AI-safety debate is not our beat. A man architecturally built to need nothing, publicly asking for something, is.

Answer all eight: (1) the feeling underneath, head-center fear and specifically the fear of depletion; (2) inner dialogue; (3) evidence **for, against, or complicating** the Type 5 read, in the published text; (4) stress (→7) or integration (→8). And the chosen-versus-cornered distinction is the crux; (5) arc; (6) cost; (7) what the other eight see; (8) the reader's mirror.

**Observable behavior is evidence. Feelings are interpretation.**

No hedge words. No pathology. No moralizing about AI. **Do not let this become an AI-policy piece.**

---

## 5. Mechanics

**The push is a two-step. The bare command is a DRY RUN and writes nothing.**

Step 1, preview the diff:

```bash
node scripts/personBlogParser.js Dario-Amodei
```

This prints `Dry-run previewing...`, the field-level diff, an expected content hash, and an approval token of the form `--approve-fields=content,description`.

Step 2, apply exactly what you reviewed:

```bash
node scripts/personBlogParser.js Dario-Amodei \
  --apply \
  --expected-content-hash=<hash from step 1> \
  --approve-fields=<token from step 1>
```

Both flags fail closed. A hash mismatch or an approved-field list that does not exactly match the dry-run diff aborts the write, which is the guard against a stale preview overwriting someone else's concurrent edit. `--apply` requires an explicit single person slug and cannot be combined with `--dry-run`.

**If you stop after step 1, nothing has been saved.** The dry run's success message is not a confirmation that the page was updated.

Preserves `lastmod`. **Never `--publish`** on a live page: it is the first-release workflow and rewrites `lastmod`, which breaks DJ's manual-lastmod rule. Never hand-edit `lastmod`.

Zero em-dashes. No quality-comment markers. Valid YAML in FAQ frontmatter.

Do not retitle toward keywords. Tested corpus-wide, keyword titles convert worse.

---

## 6. Definition of done

- [ ] The G7 request is the analytical spine, with the chosen-versus-cornered question answered.
- [ ] The export block is sourced precisely, not paraphrased loosely.
- [ ] The Altman contrast is drawn explicitly at least once, same event, opposite type, different response.
- [ ] Question 3 (for / against / complicating) answered in the published copy.
- [ ] No paragraph argues about AI policy rather than about him.
- [ ] Zero em-dashes, no quality markers, valid YAML.
- [ ] `personBlogParser.js Dario-Amodei` runs clean; `lastmod` unchanged.
- [ ] Status updated to `done` with a completion note.
