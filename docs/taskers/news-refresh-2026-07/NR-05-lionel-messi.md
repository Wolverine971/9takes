<!-- docs/taskers/news-refresh-2026-07/NR-05-lionel-messi.md -->

# Tasker: Refresh Lionel Messi (Type 9): DO THIS ONE FIRST

**For:** one agent, independent run
**Owner:** DJ
**Created:** 2026-07-25
**Status:** open
**Related:** [batch README + doctrine](README.md)

---

## 0. What and why

**This is the only page in the batch that is currently wrong rather than merely dated.** Everything else in this queue is stale. This one actively misinforms.

`/personality-analysis/lionel-messi` was edited **2026-07-14**. The World Cup final was **2026-07-19**. The page discusses the tournament and stops five days short of its ending, which means it reads as current and is not. A reader arriving from `messi personality type` today gets a page that is confidently mid-tournament about a tournament that is over.

The stakes: 3,460 impressions, 27 clicks, position 8.8, and Messi is the **second most-searched person on earth** right now. The top query alone (`messi personality type`) carries 1,297 impressions at position 7.7.

Short fix, high certainty, highest urgency. Do it first and alone.

---

## 1. What actually changed (verify each before using)

- **Spain beat Argentina 1–0 after extra time in the 2026 World Cup final, 19 July 2026.**
- **Ferran Torres scored the winner in extra time**, having come on as a substitute.
- **Rodri controlled midfield specifically to keep Messi out of dangerous areas.** This is the tactical detail that matters psychologically, the plan was to isolate him, and it worked.
- Argentina fell one step short of **back-to-back titles**, which no nation has done since Brazil in 1962.
- Messi became the **men's World Cup all-time leading scorer** during the tournament.

So he finished the tournament with the individual record and without the trophy. That split is the entire piece.

---

## 2. The psychology questions this refresh must answer

Type 9. **Gut center, but the 9 is the type that _represses_ the center's anger rather than expressing it.** Core fear: loss, separation, fragmentation, conflict that pulls him apart. Core desire: peace, and to keep the connection intact. **Stress → 6. Integration → 3.**

**A. The core question: what does a 9 do with a loss he cannot get angry about in public?**

An 8 discharges. A 1 converts it to correction. A 9 _numbs_, the anger goes somewhere it cannot be seen, often into stillness, often into a flatness that reads as grace. Watch the post-match footage and the days after with that specifically in mind. Does he look at peace, or does he look absent? Those are different things and only one of them is integration.

**B. Being tactically erased is a 9's core fear made literal.**

Rodri's job was to make Messi not matter. The 9's deepest fear is not losing; it is not counting, being overlooked, dissolved, rendered unnecessary. A midfield plan built entirely around making him irrelevant is that fear executed at the highest level of the sport, in front of the largest audience of his life. This is the strongest single insight available in this piece and it should carry the new section.

**C. Record without trophy: the individual honour a 9 did not ask for.**

He became the all-time leading scorer, which is a Type 3 kind of prize, legible, countable, personal. He lost the thing that was collective. A 9's value system usually runs the other way: the group's result over the individual line. How did he talk about the record? If he deflected it toward the team, that is the type showing itself cleanly. If he did not, that complicates the read and is worth saying.

**D. Stress or integration?**
9 under stress → **6**: anxious, doubting, looking for reassurance, suspicious of what comes next. 9 in integration → **3**: showing up, claiming his own effort, present rather than merged. Which arrow is he running after 19 July? The retirement question, however he handles it, is where this shows.

**E. Add to the story, or subtract from it?**
The existing page's thesis is the boy who hid behind a tree. The 2022 win was the resolution of that arc. This is the sequel where the resolution does not repeat. Where does a 9 put a second ending that does not land? Do not force it into redemption; if the honest read is "unresolved," write it unresolved.

**F. What did it cost him?**
The 9 buys peace by not fighting for his own space. What did that cost in a final where a midfielder was assigned to take his space away?

**G. Inner dialogue.** The sentence he is plausibly saying to himself at the final whistle. In his idiom, which for Messi is short, plain, and undramatic. Do not write a speech.

**H. What would the other eight see?** At minimum the **8** (someone should have been fouled), the **3** (the record is the point, take the win), and the **4** (the loss is the more meaningful ending). This moment splits the types unusually cleanly.

---

## 3. Research assignments

1. **His own post-final words**, primary source, full quote and context. This is the single most important item. A 9's self-report immediately after a loss is the whole ballgame.
2. **Post-match footage**: body language during the medal ceremony and the walk off. Observable behavior, described precisely, is your evidence.
3. **Teammate and Scaloni comments about him specifically** in the days after.
4. **The Rodri tactical plan as reported by match analysts**: how explicitly was "isolate Messi" the instruction? Get a real analyst source, not a highlight recap.
5. **Anything he has said about retirement or international future since 19 July.**
6. **What he said about the scoring record**, separately from the loss. The framing gap between the two is the finding.

---

## 4. Doctrine, condensed

Full version in [the batch README](README.md) §1.

**News is the door. Psychology is the room.** Compress the match report hard. A reader who watched the final should not have to read it again. Two or three sentences of event, then the psychology.

Answer all eight: (1) the feeling underneath, and for a 9 that means asking where the anger went; (2) inner dialogue; (3) whether this is evidence **for, against, or complicating** the Type 9 read, stated in the published text; (4) stress (→6) or integration (→3); (5) arc; (6) cost; (7) what the other eight see; (8) the reader's mirror.

**Observable behavior is evidence. Feelings are interpretation.** "He stood still for eleven seconds before moving, which reads as X": never "he felt X."

No hedge words. No pathology. No moralizing. Do not let the piece become a match report with an Enneagram paragraph stapled on.

---

## 5. Mechanics

**The push is a two-step. The bare command is a DRY RUN and writes nothing.**

Step 1, preview the diff:

```bash
node scripts/personBlogParser.js Lionel-Messi
```

This prints `Dry-run previewing...`, the field-level diff, an expected content hash, and an approval token of the form `--approve-fields=content,description`.

Step 2, apply exactly what you reviewed:

```bash
node scripts/personBlogParser.js Lionel-Messi \
  --apply \
  --expected-content-hash=<hash from step 1> \
  --approve-fields=<token from step 1>
```

Both flags fail closed. A hash mismatch or an approved-field list that does not exactly match the dry-run diff aborts the write, which is the guard against a stale preview overwriting someone else's concurrent edit. `--apply` requires an explicit single person slug and cannot be combined with `--dry-run`.

**If you stop after step 1, nothing has been saved.** The dry run's success message is not a confirmation that the page was updated.

Preserves `lastmod`. **Never `--publish`** on a live page: it is the first-release workflow and rewrites `lastmod`, which breaks DJ's manual-lastmod rule. Never hand-edit `lastmod`.

Zero em-dashes. No quality-comment markers. Valid YAML in FAQ frontmatter.

Do not retitle toward keywords. Tested corpus-wide, keyword titles convert worse.

**Specific to this page:** find and fix every sentence written in the present or future tense about the tournament. The failure mode here is patching the ending onto a page whose earlier paragraphs still say "will." Read the whole thing, not just the section you are adding.

---

## 6. Definition of done

- [ ] No sentence anywhere on the page refers to the 2026 World Cup as ongoing or upcoming.
- [ ] The final result, the extra-time winner, and the Rodri assignment are all present and sourced.
- [ ] The record-without-trophy split is the analytical spine, not a footnote.
- [ ] Question 3 (for / against / complicating) answered in the published copy.
- [ ] Zero em-dashes, no quality markers, valid YAML.
- [ ] `personBlogParser.js Lionel-Messi` runs clean; `lastmod` unchanged.
- [ ] Status updated to `done` with a completion note.
