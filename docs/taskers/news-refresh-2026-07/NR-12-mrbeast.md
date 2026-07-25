<!-- docs/taskers/news-refresh-2026-07/NR-12-mrbeast.md -->

# Tasker: Refresh MrBeast (Type 8)

**For:** one agent, independent run
**Owner:** DJ
**Created:** 2026-07-25
**Status:** open
**Related:** [batch README + doctrine](README.md)

---

## 0. What and why

`/personality-analysis/mr-beast` earns 1,532 impressions at position 9.9 and converts **one click**. That is the worst conversion rate of any high-impression page in the corpus.

Last edited **2026-02-19**, 156 days ago.

The single click is the thing to sit with. Everything else in this batch converts badly; this one essentially does not convert at all. Demand exists, the page appears, and nobody chooses it. Treat that as a signal about the page, not only about the position.

---

## 1. What actually changed (verify each before using)

- **Beast Games season 2 premiered 7 January 2026 on Prime Video**, themed "strong vs smart," with the first three episodes at launch and weekly releases through the **25 February** finale.
- **Tyler Lucas won, taking $5,105,000.** More than $11 million in prizes was given out across the ten weeks.
- **Season 3 will cast one contestant from every country on earth.**
- **June 2026:** Moose Toys launched _MrBeast: The Ultimate Game_, his first board game.
- **May 2026:** a live Beast Games taping at Dowdy-Ficklen Stadium in Greenville.
- He has discussed a possible _Survivor_ crossover and wanting a Beast Games movie, and has said **season 2 got more personal**.

**That last one is the lead.** "More personal" from MrBeast, about a format built on scale, is the most psychologically loaded thing on this list. Find the full quote.

---

## 2. The psychology questions this refresh must answer

Type 8. **Gut center, core emotion anger.** Core fear: being controlled, being harmed, being made vulnerable. Core desire: self-protection through strength, and protection of the people he has decided are his. **Stress → 5. Integration → 2.**

**A. The spine: "more personal" is the 8-to-2 arrow, if it is real.**

Type 8 integrates to **2**: the armored builder becomes openly protective and caring, and lets the caring show rather than routing it through provision. A man whose entire format is scale, spectacle and numbers saying his show got _more personal_ is either that arrow, or a content strategy. Find the quote, read the context, decide.

The existing page's title is about him building even when it is breaking him. This is the natural next chapter and it either confirms or complicates that thesis.

**B. Giving away $11 million is not generosity until you ask what it protects.**

An 8's giving is real and is also a form of control, provision keeps you in the position of the one who provides, which is the position of not needing. Ask what the prize structure does for him psychologically, not just for contestants. This is the observation that separates a 9takes piece from a creator-economy explainer.

**C. Season 3's every-country plan: what is the number _for_?**

Every escalation raises the same question. The 8's fear is being small and controllable. Is the scale a business strategy, a compulsion, or a defense? Ask it plainly. Escalation that never terminates is worth naming as a pattern rather than reporting as ambition.

**D. Stress → 5. The withdrawal is the story nobody covers.**

An 8 under stress goes to **5**: isolating, cutting off, going cold, conserving. For MrBeast, that would look like disappearing from his own content, delegating the visible role, or a documented stretch of absence. Look for it specifically. He has been publicly candid about burnout in the past, which makes this searchable.

**E. What did it cost him?**
The existing thesis says the building is breaking him. Test it against 2026 evidence rather than repeating it. If he looks better than he did two years ago, say so. That is the more interesting finding and the doctrine requires the complication in the published text.

**F. A board game is a strange artifact for this psychology.**

A physical object, finished, unchangeable, sitting on a shelf. Everything else he makes is escalating and ephemeral. Small detail, worth one good paragraph.

**G. Inner dialogue.** The sentence in his head the day season 2 wrapped. His idiom is flat, practical and metric-driven; do not write it emotional.

**H. What would the other eight see?** At minimum the **4** (the scale is the absence of a self), the **9** (why does anything need to be this big), and the **2** (if he means it, the caring is the whole point).

**I. The reader's mirror.** The reader is the person who takes care of everyone by providing and has never once asked for anything. That is the universal 8 pattern under the spectacle.

### And one more thing: diagnose the single click

Before you write, read the page as a stranger who searched `mrbeast personality type`. Does the opening deliver anything they could not guess? A page at position 9.9 with one click is failing at the promise, not only at the rank. Report what you find in the completion note even if you do not fix it all in this pass.

---

## 3. Research assignments

1. **The full "more personal" quote in context**: the Deadline interview or wherever it originated. Load-bearing.
2. **Any 2026 statement about burnout, workload, or his own limits.** Directly tests the existing thesis.
3. **Any documented 2026 stretch where he was absent from his own content** or handed the visible role to someone else. The stress-to-5 evidence.
4. **How he talks about the contestants in season 2** versus season 1. If the show got more personal, the language about people should have changed.
5. **The season 3 every-country announcement in his own words**: how he justifies it.
6. **Any 2026 evidence of him choosing less rather than more.** The counter-evidence. Look for it specifically.

---

## 4. Doctrine, condensed

Full version in [the batch README](README.md) §1.

**News is the door. Psychology is the room.** Prize totals and premiere dates are not the piece. A man who cannot stop making things bigger, saying the thing got more personal, is.

Answer all eight: (1) the feeling underneath, gut-center anger and what the building protects against; (2) inner dialogue; (3) evidence **for, against, or complicating** the Type 8 read, in the published text; (4) stress (→5) or integration (→2), the "more personal" quote is the crux; (5) arc; (6) cost; (7) what the other eight see; (8) the reader's mirror.

**Observable behavior is evidence. Feelings are interpretation.**

No hedge words. **No pathology, burnout is not a diagnosis and the piece does not make one.** No moralizing about creator culture. No speculation about his health or his finances.

---

## 5. Mechanics

**The push is a two-step. The bare command is a DRY RUN and writes nothing.**

Step 1, preview the diff:

```bash
node scripts/personBlogParser.js Mr-Beast
```

This prints `Dry-run previewing...`, the field-level diff, an expected content hash, and an approval token of the form `--approve-fields=content,description`.

Step 2, apply exactly what you reviewed:

```bash
node scripts/personBlogParser.js Mr-Beast \
  --apply \
  --expected-content-hash=<hash from step 1> \
  --approve-fields=<token from step 1>
```

Both flags fail closed. A hash mismatch or an approved-field list that does not exactly match the dry-run diff aborts the write, which is the guard against a stale preview overwriting someone else's concurrent edit. `--apply` requires an explicit single person slug and cannot be combined with `--dry-run`.

**If you stop after step 1, nothing has been saved.** The dry run's success message is not a confirmation that the page was updated.

Confirm the exact draft filename before running. The slug is `mr-beast` and the draft file may differ in case or hyphenation.

Preserves `lastmod`. **Never `--publish`** on a live page: it is the first-release workflow and rewrites `lastmod`, which breaks DJ's manual-lastmod rule. Never hand-edit `lastmod`.

Zero em-dashes. No quality-comment markers. Valid YAML in FAQ frontmatter.

Do not retitle toward keywords. Tested corpus-wide, keyword titles convert worse.

---

## 6. Definition of done

- [ ] The "more personal" quote found, sourced, and used as the analytical crux.
- [ ] The existing "building is breaking him" thesis tested against 2026 evidence rather than repeated.
- [ ] Stress-to-5 evidence searched for and reported either way.
- [ ] Question 3 (for / against / complicating) answered in the published copy.
- [ ] Single-click diagnosis reported in the completion note.
- [ ] Zero em-dashes, no quality markers, valid YAML.
- [ ] Parser runs clean; `lastmod` unchanged.
- [ ] Status updated to `done` with a completion note.
