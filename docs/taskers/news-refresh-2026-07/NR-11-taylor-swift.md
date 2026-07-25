<!-- docs/taskers/news-refresh-2026-07/NR-11-taylor-swift.md -->

# Tasker: Refresh Taylor Swift (Type 3)

**For:** one agent, independent run
**Owner:** DJ
**Created:** 2026-07-25
**Status:** open
**Related:** [batch README + doctrine](README.md); unblocks the Jack Antonoff publish

---

## 0. What and why

`/personality-analysis/taylor-swift` earns only **311 impressions at position 10.4**: low for the most-searched woman alive, and low _because_ the page is 157 days stale on a subject with the year's largest news cycle.

**Start here: a rewrite already exists on disk and was never merged.**

```
src/blog/people/drafts/Taylor-Swift-updated-sections.md
```

It contains a reworked opening and TL;DR built around _The Life of a Showgirl_ (October 2025) and the Kelce engagement, including her "That's a shockingly offensive thing to say" response to the assumption she would step back from music. It is good material and it stops at the engagement. **It does not know about the wedding.**

So this tasker is: read that file, merge what holds up, then extend through July 2026.

---

## 1. What actually changed (verify each before using)

- **She married Travis Kelce on 3 July 2026** in a private ceremony at Madison Square Garden.
- **Adam Sandler officiated.**
- **No wedding party.** She chose her brother as Man of Honor; Kelce chose his brother Jason as Best Man.
- Both wore custom Christian Dior Haute Couture.
- **They donated $26 million to 20 national charities.**
- Guests included Bradley Cooper, Gigi Hadid, Camila Cabello, Ed Sheeran, Ethan Hawke, Gwen Stefani, Jason Sudeikis, Jimmy Fallon, Jennifer Lopez, Steven Spielberg, Jessica Alba, Tom Brady, Andy Reid, Cooper Kupp, Roger Goodell and Joe Buck.
- Earlier context from the unmerged draft: engagement announced August 2025 with the "Your English teacher and your gym teacher are getting married" post; _The Life of a Showgirl_ released October 2025, written during the Eras Tour and the relationship.

**Sourcing note:** wedding coverage was enormous and much of it was speculative. Several outlets reported dates and venues that turned out to be wrong. Verify every detail against major outlet reporting before use, and drop anything you cannot confirm. Do not report guest-list gossip about who was _not_ invited.

---

## 2. The psychology questions this refresh must answer

Type 3. **Heart center, core emotion shame.** Core fear: being worthless without achievement; being loved for what she produces rather than who she is. Core desire: to be genuinely valuable. **Stress → 9. Integration → 6.**

**A. The spine: the unmerged draft already found it. Can a Type 3 create from contentment?**

That draft's thesis is that _The Life of a Showgirl_ was made from happiness rather than from lack, which is the central question of Type 3 maturity: the type builds its worth on achievement fuelled by a fear of being nothing, and the growth question is whether the engine still runs when the fear quiets. The wedding is the strongest possible test of that thesis and it landed after the draft was written. Finish the argument.

**B. "That's a shockingly offensive thing to say" is the sharpest 3 moment available.**

The assumption that she would step back from music for domesticity, and her reaction to it, gets straight to the type's nerve: the fear that the achievement is negotiable, or that anyone could imagine her without it. That is not offense at sexism alone. It is offense at the suggestion that the work is the removable part. Say so.

**C. A wedding with no wedding party is a decision worth reading.**

She has the largest and most publicly documented friendship network in music, and she chose her brother instead of a bridal party. For a 3, a type that manages a public self with extraordinary skill, that is a choice against the version of the event that would have performed best. **That is 6-ward integration evidence: loyalty and intimacy over image.** It is the best structural detail in the whole story and most coverage treated it as trivia.

**D. MSG: the most private ceremony in the most public building in America.**

She got married in a 20,000-seat arena, privately. Sit with the contradiction rather than resolving it: the 3 who can only find privacy inside the venue she has already conquered. This is the image that carries the piece.

**E. $26 million to 20 charities.**

Read it honestly, both ways. It is genuine generosity at real scale. It is also, for a 3, the kind of act that converts a private event into a public accounting. Both are true; say both.

**F. Stress → 9, integration → 6. Which year is this?**

The unmerged draft argues for integration. Test that against the wedding evidence rather than inheriting it. The no-wedding-party choice supports it. Look for anything that does not.

**G. Add to the story, or subtract from it?**
Her arc has always been transmuting heartbreak into work. If the source material changes, does the arc continue or end? The draft asks this. Answer it.

**H. Inner dialogue.** The sentence in her head walking into MSG on 3 July. Hers is self-aware, funny, and slightly braced; do not write it triumphant.

**I. What would the other eight see?** At minimum the **4** (contentment is the end of the art), the **8** (why explain any of it), and the **2** (the donation is the point).

**J. The reader's mirror.** The reader is the person who does not know who they are when they are not producing. Land there.

---

## 3. Research assignments

1. **Read `src/blog/people/drafts/Taylor-Swift-updated-sections.md` in full first.** Decide what holds up post-wedding, what to merge, what to discard. Do not rewrite from scratch what is already written well.
2. **Wedding facts, verified against major outlets.** Ceremony, officiant, wedding party structure, donation. Drop anything unconfirmed.
3. **Her own words since 3 July**, if any. Highest-value and may not exist. If she has said nothing, that silence is itself worth a sentence.
4. **The full "shockingly offensive" quote in context**: venue, question, full answer.
5. **Anything she has said about the no-wedding-party choice or why MSG.** If nothing, say so and read the choice from the decision itself.
6. **How _The Life of a Showgirl_ was received**, specifically whether critics heard contentment in it. That is the external check on the draft's thesis.

---

## 4. Doctrine, condensed

Full version in [the batch README](README.md) §1.

**News is the door. Psychology is the room.** This is the most gossip-saturated subject in the batch and the discipline matters most here. The guest list is not psychology. The absence of a wedding party is.

Answer all eight: (1) the feeling underneath, heart-center shame; (2) inner dialogue; (3) evidence **for, against, or complicating** the Type 3 read, in the published text; (4) stress (→9) or integration (→6); (5) arc; (6) cost; (7) what the other eight see; (8) the reader's mirror.

**Observable behavior is evidence. Feelings are interpretation.**

No hedge words. No pathology. No moralizing. No speculation about the marriage, family plans, or anyone's private life. **Do not repeat who-was-snubbed coverage**: it is unverifiable, it dates instantly, and it is beneath the format.

---

## 5. Mechanics

**The push is a two-step. The bare command is a DRY RUN and writes nothing.**

Step 1, preview the diff:

```bash
node scripts/personBlogParser.js Taylor-Swift
```

This prints `Dry-run previewing...`, the field-level diff, an expected content hash, and an approval token of the form `--approve-fields=content,description`.

Step 2, apply exactly what you reviewed:

```bash
node scripts/personBlogParser.js Taylor-Swift \
  --apply \
  --expected-content-hash=<hash from step 1> \
  --approve-fields=<token from step 1>
```

Both flags fail closed. A hash mismatch or an approved-field list that does not exactly match the dry-run diff aborts the write, which is the guard against a stale preview overwriting someone else's concurrent edit. `--apply` requires an explicit single person slug and cannot be combined with `--dry-run`.

**If you stop after step 1, nothing has been saved.** The dry run's success message is not a confirmation that the page was updated.

Preserves `lastmod`. **Never `--publish`** on a live page: it is the first-release workflow and rewrites `lastmod`, which breaks DJ's manual-lastmod rule. Never hand-edit `lastmod`.

Zero em-dashes. No quality-comment markers. Valid YAML in FAQ frontmatter.

Do not retitle toward keywords. Tested corpus-wide, keyword titles convert worse.

**When you have merged the updated-sections draft, delete or clearly mark it** so the next agent does not merge it twice. Note in your completion which you did.

**Downstream:** [Jack Antonoff](../../blog-automation/backlog-queue.json) is a ready-to-publish draft (8.9, image made) blocked only on a grade-stability regrade. He is her longtime producer. Cross-link the two once both are live, and flag in your completion note that the Antonoff publish is now editorially unblocked.

---

## 6. Definition of done

- [ ] `Taylor-Swift-updated-sections.md` read, merged where it holds up, and marked or removed so it cannot be merged twice.
- [ ] Wedding facts verified; nothing unconfirmed published; no snub coverage.
- [ ] The no-wedding-party choice used as the integration evidence, not as trivia.
- [ ] The "can a 3 create from contentment" question answered, not just posed.
- [ ] Question 3 (for / against / complicating) answered in the published copy.
- [ ] Zero em-dashes, no quality markers, valid YAML.
- [ ] `personBlogParser.js Taylor-Swift` runs clean; `lastmod` unchanged.
- [ ] Status updated to `done`, noting the Antonoff cross-link opportunity.
