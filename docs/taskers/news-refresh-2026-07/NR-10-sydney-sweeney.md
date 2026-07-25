<!-- docs/taskers/news-refresh-2026-07/NR-10-sydney-sweeney.md -->

# Tasker: Refresh Sydney Sweeney (Type 3)

**For:** one agent, independent run
**Owner:** DJ
**Created:** 2026-07-25
**Status:** open
**Related:** [batch README + doctrine](README.md)

---

## 0. What and why

`/personality-analysis/sydney-sweeney` earns 3,227 impressions at position 7.6, converting 4 clicks. Last edited **2026-05-19**, 67 days ago.

She has had the most legible reputation arc of anyone in this batch: a full cycle of backlash, refusal to engage, and commercial re-entry, all inside about a year. For a Type 3, the type whose entire architecture is built around image, that is an unusually rich natural experiment, and the current page predates most of it.

Good position already. This is a deepen-and-extend job, not a rescue.

---

## 1. What actually changed (verify each before using)

- **February 2026:** she posted a photo of herself climbing the Hollywood Sign. It drew more than 32 million likes and a controversy over whether she had permission. **The LAPD later confirmed permits had been obtained through HBO's production team.** Report the resolution, not just the accusation.
- **American Eagle campaign backlash**, followed in **April 2026** by a further AE collaboration that referenced the earlier furor directly.
- **Political-belief commentary:** she distanced herself from it in a Cosmopolitan interview in early 2026, saying "None of it is me," and declined to discuss politics.
- **June 2026:** director Sam Levinson publicly defended her _Euphoria_ storyline, discussing the reasoning behind Cassie Howard's arc.
- She has said she **was not prepared for the emotional toll of fame** amid the political controversies, that scrutiny of her body is treated as public property and makes her sad, and has repeated that she has never had work done.
- She hosted _SNL_ and addressed both the Glen Powell rumors and the "Trump-themed party" backlash.

**Neutrality guardrail:** the political controversy is reported, not adjudicated. Attribute every characterization. The page takes no position on her politics or her critics'. Same standard as [NR-03](NR-03-hasan-piker.md).

---

## 2. The psychology questions this refresh must answer

Type 3. **Heart center, core emotion shame.** Core fear: being worthless without achievement; being valued only for output or surface. Core desire: to be genuinely valuable rather than merely admired. **Stress → 9. Integration → 6.**

**A. The spine: "None of it is me" is the most important sentence she has said, and it is a Type 3 sentence.**

The 3's deepest problem is the gap between the image and the person, and the type's characteristic move is to manage the image rather than close the gap. Saying "none of it is me" about a public narrative is simultaneously (a) literally true, (b) a refusal to perform a position she does not hold, and (c) an image-management act. All three at once. That is the piece.

Do not resolve it too cleanly. The ambiguity is the honest finding.

**B. Body-as-product is a Type 3 wound with unusually clear evidence.**

She has said the scrutiny treats her physique as public property and that it makes her sad. That is a rare direct statement of the 3's core injury: being valued for the surface rather than the substance. Almost every 3 experiences a version of this and almost none articulate it. Use her own words as the anchor and connect it outward to the type, not just to celebrity.

**C. The AE re-entry: the 3's answer to shame is to convert it to product.**

Getting backlash from one campaign and then making a second campaign that references the backlash is a textbook 3 move: metabolize the humiliation by turning it into a win. Name the mechanism. Then ask the harder question: does it work? Does converting shame into commerce discharge it, or bank it?

**D. Stress → 9. The tell to look for.**

A 3 under stress goes to **9**: flat, disengaged, numbed out, the machine running with nobody home. Her comment about being unprepared for the emotional toll is the closest thing to evidence. Look for footage or interviews from the worst of the backlash period and describe the demeanour precisely. Withdrawal in a 3 is a bigger signal than in almost any other type, because the type's default is to keep performing.

**E. Integration → 6. The counter-evidence.**

3 to 6 is loyalty over image, saying the unflattering true thing, committing to people who cannot advance her. The admission that she was not prepared, and the refusal to take a marketable political position, both point that way. Weigh them honestly. That is the strongest available argument that she is not a pure image-manager, and the doctrine wants the complication published.

**F. Add to the story, or subtract from it?**
Say whether this year advanced her arc or repeated it.

**G. What did it cost her?** Concrete instance, from her own words where possible.

**H. Inner dialogue.** The sentence in her head reading the AE backlash. Hers is direct and a little weary; do not write it wounded or defiant.

**I. What would the other eight see?** At minimum the **8** (say what you actually think, take the hit), the **4** (the fact that she will not is the whole problem), and the **9** (why engage at all).

**J. The reader's mirror.** The reader is the person who is competent and admired and privately unsure whether any of it is about them. That is the universal 3 ache.

---

## 3. Research assignments

1. **The full Cosmopolitan "None of it is me" quote in context**: question asked, full answer. Load-bearing. Do not work from the pull quote.
2. **Her full statement about the emotional toll of fame.** Second-most important item.
3. **Her statements about body scrutiny**, in full, with dates.
4. **The Hollywood Sign timeline with the permit resolution**, sourced. If you report the accusation without the resolution, that is a factual failure.
5. **The AE campaign copy for both rounds**: what the second one actually said about the first. The mechanism only lands if you quote it.
6. **Any documented instance of her turning down work or money** for a non-career reason. The 6-ward integration evidence.
7. **Footage from the peak-backlash period.** Demeanour, described observably.

---

## 4. Doctrine, condensed

Full version in [the batch README](README.md) §1.

**News is the door. Psychology is the room.** There is a lot of gossip available here and very little of it belongs. The piece is about the gap between a person and an image, using a year in which that gap was unusually visible.

Answer all eight: (1) the feeling underneath, heart-center shame; (2) inner dialogue; (3) evidence **for, against, or complicating** the Type 3 read, in the published text; (4) stress (→9) or integration (→6); (5) arc; (6) cost; (7) what the other eight see; (8) the reader's mirror.

**Observable behavior is evidence. Feelings are interpretation.** Her own statements about her feelings are the exception and the best material you have, quote them rather than paraphrasing.

No hedge words. No pathology. No moralizing, and no politics. **Do not speculate about her body, her appearance, or her relationships.** The piece is about the experience of being reduced to those things; reproducing the reduction would be a self-own.

---

## 5. Mechanics

```bash
node scripts/personBlogParser.js Sydney-Sweeney
```

Preserves `lastmod`. **Never `--publish`** on a live page. Never hand-edit `lastmod`.

Zero em-dashes. No quality-comment markers. Valid YAML in FAQ frontmatter.

Do not retitle toward keywords. Tested corpus-wide, keyword titles convert worse.

At 47,000 characters this is already one of the longest pages in the corpus. **Add selectively and consider cutting.** Do not reflexively extend it.

---

## 6. Definition of done

- [ ] "None of it is me" is the analytical spine, with the ambiguity preserved rather than resolved.
- [ ] Hollywood Sign reported with the permit resolution included.
- [ ] Every political characterization attributed, none asserted.
- [ ] Stress-to-9 and integration-to-6 evidence both searched for and reported either way.
- [ ] Question 3 (for / against / complicating) answered in the published copy.
- [ ] No speculation about her body, appearance, or relationships.
- [ ] Zero em-dashes, no quality markers, valid YAML.
- [ ] `personBlogParser.js Sydney-Sweeney` runs clean; `lastmod` unchanged.
- [ ] Status updated to `done` with a completion note.
