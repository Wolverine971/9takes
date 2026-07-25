<!-- docs/taskers/news-refresh-2026-07/NR-06-sam-altman.md -->

# Tasker: Refresh Sam Altman (Type 4)

**For:** one agent, **run together with [NR-08 Dario Amodei](NR-08-dario-amodei.md)**
**Owner:** DJ
**Created:** 2026-07-25
**Status:** open
**Related:** [batch README + doctrine](README.md)

---

## 0. What and why

`/personality-analysis/sam-altman` earns 2,681 impressions at position 8.8, converting 11 clicks. Last edited **2026-03-01**, 146 days ago.

**Run this with NR-08.** Altman and Amodei appear in the same three events in the same six months. Researching them separately is doing the work twice. Collect once, write two pieces with genuinely different psychological spines. That contrast is itself the most interesting thing available, since they are opposite types responding to identical pressure.

---

## 1. What actually changed (verify each before using)

- **OpenAI is preparing an IPO**, reported at roughly a $1 trillion valuation. Anthropic is reported to be preparing one on a similar timeline and scale.
- **Altman publicly reversed himself on AI and employment.** Having warned in June 2025 that entry-level roles were at serious risk, he said in 2026 that he was **"pretty wrong"** about AI's economic impact.
- **G7 summit, Évian-les-Bains, France, June 2026.** Amodei asked G7 leaders to collaborate on advanced AI following a US export block on Anthropic's latest model, in front of Trump and other leaders. **Altman backed him**: a notable alignment between rivals. Altman and Demis Hassabis proposed a technical standards body and a US-led evaluation forum.
- **India AI summit, February 2026.** Altman and Amodei declined to hold hands during a summit photo op. Altman's explanation: "I just wasn't sure."
- Anthropic ran attack ads against OpenAI during the Super Bowl.

**Sourcing note:** IPO reporting is reporting, not fact. Attribute it ("reported at," "according to"). Do not state a valuation as settled.

---

## 2. The psychology questions this refresh must answer

Type 4. **Heart center, core emotion shame.** Core fear: having no identity or personal significance; being fundamentally ordinary. Core desire: to be authentically and unmistakably himself. **Stress → 2. Integration → 1.**

**A. The spine: "I was pretty wrong" is the most psychologically loaded thing he has said in years. What kind of admission is it?**

For a Type 4 this cuts two ways at once and you have to pick:

- **Integration to 1:** the 4 becoming principled and self-correcting, willing to be plainly wrong in public because accuracy now matters more than image. This is real growth and it looks exactly like this.
- **Or the 4's oldest move:** being the one honest enough to admit it, which is itself a bid for distinction. The 4 that cannot be the most right becomes the most honest about being wrong, and the position is still unique.

Both are consistent with the type. Decide which the evidence supports, argue it, and acknowledge the other reading. This is the heart of the piece.

**B. What does a $1T IPO do to a 4's core fear?**

The 4's fear is being ordinary. An IPO is the ultimate act of becoming ordinary in a specific sense: the company becomes a security, quarterly, legible, owned by strangers, valued by a market rather than by its meaning. Is there evidence he experiences that as loss? A 4 running the most-watched company on earth toward the most standardizing possible outcome is a real tension and almost nobody has written it.

**C. The handshake he would not fake.**

Declining the photo-op handshake, then explaining "I just wasn't sure," is a small event with a lot of type in it. A 4 will not perform a feeling it does not have, even at diplomatic cost, authenticity over optics is the type's signature and its liability. Use it as the compact illustration; it is more useful than any amount of IPO coverage.

**D. Backing his rival at the G7.**

He supported Amodei's position in front of G7 leaders after an export block hit Anthropic, not OpenAI. Read it against Super Bowl attack ads running the other direction. What does it mean when the 4 defends the rival who is attacking him? Stress for a 4 goes to **2**: becoming helpful, needed, over-involved in others' business as a way to secure a place. That is one available read. So is genuine principle. Weigh them.

**E. Add to the story, or subtract from it?**
The existing page's read is a 4 who always ends up leading. A public reversal plus an IPO is either that arc maturing or that arc terminating. Say which.

**F. What did it cost him?** The 4 buys significance with the refusal to be generic and pays for it in exhaustion at scale. Find the concrete instance.

**G. Inner dialogue.** The sentence in his head the moment before saying "pretty wrong" on the record. His idiom is understated and slightly detached; do not write it dramatic.

**H. What would the other eight see?** At minimum the **8** (never concede), the **3** (why hand critics the clip), and the **5** (he did not know, so he said he did not know, this is not complicated).

**I. The reader's mirror.** The reader is the person for whom being wrong feels like an identity threat rather than an information update. That is the useful, universal 4 pattern here.

---

## 3. Research assignments

Shared with NR-08 unless marked.

1. **The full "pretty wrong" quote in context**: venue, date, question asked, what he said immediately before and after. Primary source. _Altman-specific and load-bearing._
2. **The G7 Évian-les-Bains session**: what each of them actually said, ideally transcript or direct quotes. _Shared._
3. **The India summit photo op**: footage, both explanations. _Shared._
4. **The Super Bowl ad campaign**: what the ads actually said, and whether Altman responded publicly. _Shared._
5. **IPO reporting**: best-sourced version, and any direct comment from Altman about taking OpenAI public. _Shared._
6. **Any 2026 statement where he describes how he feels about the job**, as distinct from the technology. A 4's self-description is the highest-value evidence available and it is rare. _Altman-specific._
7. **What he has said about the June 2025 prediction since retracting it**: has he explained the reversal, or only stated it? _Altman-specific._

---

## 4. Doctrine, condensed

Full version in [the batch README](README.md) §1.

**News is the door. Psychology is the room.** There is enormous AI news here and almost none of it belongs in the piece. The reader can get IPO coverage anywhere. What they cannot get is what a public self-reversal costs a man whose identity is built on being singular.

Answer all eight: (1) the feeling underneath, heart-center shame; (2) inner dialogue; (3) evidence **for, against, or complicating** the Type 4 read, in the published text; (4) stress (→2) or integration (→1). This is the central question here; (5) arc; (6) cost; (7) what the other eight see; (8) the reader's mirror.

**Observable behavior is evidence. Feelings are interpretation.**

No hedge words. No pathology. No moralizing about AI. **Do not let this become an AI-policy piece.** If a paragraph is arguing about AI rather than about him, cut it.

---

## 5. Mechanics

**The push is a two-step. The bare command is a DRY RUN and writes nothing.**

Step 1, preview the diff:

```bash
node scripts/personBlogParser.js Sam-Altman
```

This prints `Dry-run previewing...`, the field-level diff, an expected content hash, and an approval token of the form `--approve-fields=content,description`.

Step 2, apply exactly what you reviewed:

```bash
node scripts/personBlogParser.js Sam-Altman \
  --apply \
  --expected-content-hash=<hash from step 1> \
  --approve-fields=<token from step 1>
```

Both flags fail closed. A hash mismatch or an approved-field list that does not exactly match the dry-run diff aborts the write, which is the guard against a stale preview overwriting someone else's concurrent edit. `--apply` requires an explicit single person slug and cannot be combined with `--dry-run`.

**If you stop after step 1, nothing has been saved.** The dry run's success message is not a confirmation that the page was updated.

Preserves `lastmod`. **Never `--publish`** on a live page: it is the first-release workflow and rewrites `lastmod`, which breaks DJ's manual-lastmod rule. Never hand-edit `lastmod`.

Zero em-dashes. No quality-comment markers. Valid YAML in FAQ frontmatter.

Do not retitle toward keywords. Tested corpus-wide, keyword titles convert worse.

**Note:** `src/blog/people/drafts/Sam-Altman-research.md` and `sam-altman-new-yorker-research.md` already exist on disk, plus `docs/sam-altman-new-yorker-integration-analysis.md`. Read them before starting new research; a previous pass may have already collected what you need.

---

## 6. Definition of done

- [ ] The "pretty wrong" reversal is the analytical spine, with both readings weighed and one chosen.
- [ ] The handshake refusal is used as the compact type illustration.
- [ ] Question 3 (for / against / complicating) answered in the published copy.
- [ ] No paragraph argues about AI policy rather than about him.
- [ ] Shared research handed to [NR-08](NR-08-dario-amodei.md).
- [ ] Zero em-dashes, no quality markers, valid YAML.
- [ ] `personBlogParser.js Sam-Altman` runs clean; `lastmod` unchanged.
- [ ] Status updated to `done` with a completion note.
