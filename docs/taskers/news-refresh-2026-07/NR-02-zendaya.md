<!-- docs/taskers/news-refresh-2026-07/NR-02-zendaya.md -->

# Tasker: Refresh Zendaya (Type 6)

**For:** one agent, independent run
**Owner:** DJ
**Created:** 2026-07-25
**Status:** draft done, awaiting DB push
**Related:** [batch README + doctrine](README.md)

---

## 0. What and why

`/personality-analysis/zendaya` is the **oldest stale page in the top tier**: last edited **2026-01-17**, 189 days ago. It earns 3,452 impressions at position 9.0 and converts 18 clicks.

In those 189 days she got married in secret, released five projects, and announced she is disappearing. The page knows about none of it.

This one has the strongest psychological spine in the batch. The events are not just news. They are a Type 6 running both of her arrows in the same calendar year, in public, in sequence.

---

## 1. What actually changed (verify each before using)

- **She married Tom Holland, privately, and did not announce it.** Her stylist Law Roach said on a red carpet in March 2026 that "the wedding has already happened." Holland later confirmed it himself, mentioning his grandmother's worry that she had not been invited once photos circulated, and that everyone close to them was in fact there.
- Serving as a witness at another couple's wedding, she **signed the certificate with her legal name, Coleman**, which fed the speculation cycle further.
- **Five 2026 releases:** _The Drama_ (3 April), _Euphoria_ season 3 (12 April), Christopher Nolan's _The Odyssey_ (17 July), the fourth Holland-led _Spider-Man_ (31 July), and _Dune: Part Three_.
- **She has said she is taking a break and "going into hiding"** after the release slate clears.

**Sourcing note:** the marriage was confirmed by Holland in his own words. Attribute it to him. Do not build on the stylist's red-carpet remark as the primary source, and do not speculate about a date or venue that has not been confirmed.

---

## 2. The psychology questions this refresh must answer

Type 6. **Head center, core emotion fear.** Core fear: being without support or guidance, unable to survive on her own. Core desire: security, and people she can actually trust. **Stress → 3. Integration → 9.**

**A. The spine: she ran the stress arrow all the way down, then chose the integration arrow on purpose.**

This is the finding, and it is unusually clean. Type 6 under stress moves to **3**: relentless output, image management, worth proved through work, motion as anxiety management. **Five major releases in one calendar year** is that arrow at full extension. Then she announces a retreat, and Type 6 in integration moves to **9**: settled, at rest, no longer scanning for threat.

Test it against the evidence rather than assuming it. Does the retreat read as 9-ward peace, or as a 6 exhausted into shutdown? Those look similar from outside and are not the same thing. What she says about _why_ she is stopping is the tell.

**B. A secret wedding is a 6's security strategy, executed perfectly.**

The 6's core fear is being without support. Marriage is the largest support structure available. She built it entirely outside the view of the crowd whose attention she cannot control. Ask directly: for a 6, is a public wedding a celebration or an exposure? Everyone who mattered was there. Nobody who did not was. That is not shyness; it is a threat model.

**C. The trust question, the most 6 thing about her.**

Type 6 sorts the world into people who are safe and people who are not, and the sorting is the type's central labour. Her documented long-term loyalty to the same small circle, Law Roach chief among them, is worth examining, especially since it was Roach who let the secret slip. What does a 6 do when the trusted inner circle is the source of the leak? If she has said anything about it, that is the best material in the piece.

**D. Add to the story, or subtract from it?**
The existing page's read is a 6 who manages exposure with extraordinary discipline. Marrying secretly and then withdrawing at peak visibility both confirm it. So ask the harder version: **is there anything in this year that does not fit?** A 6 who takes on Nolan's _Odyssey_ and a _Spider-Man_ in the same year is also taking enormous professional risk, which is not obviously a security-seeking move. Say so. The doctrine requires the complication to appear in the published text.

**E. What did it cost her?**
The 6 buys safety with vigilance and pays for it in rest. Five projects and a marriage she could not acknowledge is a year with no off switch. The retreat is the invoice.

**F. Inner dialogue.** The sentence she is plausibly telling herself the week _Spider-Man_ opens and the break begins. Hers is measured and self-aware; do not write it panicked.

**G. What would the other eight see?** At minimum the **3** (why hide the win), the **7** (why stop), and the **8** (announce it or do not, but stop managing it). The secret-wedding decision splits types hard and is a natural fit for the nine-takes turn.

**H. The reader's mirror.** The reader here is the person who keeps their good news quiet because attention feels like risk. Land on them.

---

## 3. Research assignments

1. **Holland's actual confirmation quote**, in full, primary source. This is the load-bearing fact of the refresh.
2. **Her own words about the break**: the full quote, in context. Whether she frames it as rest, fear, or completion determines whether this is the 9 arrow or exhaustion. Do not guess.
3. **Anything she has said about the Roach leak.** High value, may not exist. If it does not, say so explicitly.
4. **Her own framing of the five-project year** in 2026 press. Look for whether she describes it as chosen or as momentum she could not stop.
5. **The Odyssey and Spider-Man press cycles**, specifically her demeanour under promotional obligation. A 6 doing forced public exposure is legible in the footage.
6. **Any on-record moment where she describes fear or anxiety directly.** She has historically been unusually candid about this. Recent examples are gold.

---

## 4. Doctrine, condensed

Full version in [the batch README](README.md) §1.

**News is the door. Psychology is the room.** The wedding is gossip until you make it a security decision. Compress the event reporting hard.

Answer all eight: (1) the feeling underneath, tied to the head center and fear; (2) inner dialogue; (3) evidence **for, against, or complicating** the Type 6 read, in the published text. And the complication here is real, so use it; (4) stress (→3) and integration (→9), both, in sequence; (5) arc; (6) cost; (7) what the other eight see; (8) the reader's mirror.

**Observable behavior is evidence. Feelings are interpretation.**

No hedge words. No pathology. Do not turn a fear-based type into an anxiety disorder. No moralizing about the secrecy. Write so it reads in twelve months.

---

## 5. Mechanics

```bash
node scripts/personBlogParser.js Zendaya
```

Preserves `lastmod`. **Never `--publish`** on a live page. Never hand-edit `lastmod`.

Zero em-dashes. No quality-comment markers. Valid YAML in FAQ frontmatter.

Do not retitle toward keywords. Tested corpus-wide, keyword titles convert worse.

Because this page is 189 days old, **read the whole thing before editing**. There will be sentences about her relationship status and her upcoming slate that are now false, not just incomplete.

---

## 6. Definition of done

- [x] No sentence on the page describes her as unmarried or the 2026 slate as upcoming.
- [x] The stress-arrow-then-integration-arrow spine is the organizing idea, sourced.
- [x] The complication (professional risk-taking does not fit a pure security read) appears in the published copy.
- [x] Zero em-dashes, no quality markers, valid YAML.
- [x] `personBlogParser.js Zendaya` runs clean; `lastmod` unchanged.
- [x] Status updated with a completion note.
- [ ] **DB push not run.** Awaiting DJ. Command in §7 below.

---

## 7. Completion note (2026-07-25)

**What changed.** Draft rewritten at `src/blog/people/drafts/Zendaya.md`, 27,922 to 38,358 chars. Removed the stale "2025-2026: The Strategic Next Moves" section and the `<!-- QUALITY GRADE:` block. Added four sections and moved one:

- **The Secret Wedding** — the full March-to-July sequence, plus a nine-takes turn (3, 7, 8, 4, 2) on the secrecy decision.
- **The Year of Endings** — the five-release calendar, her own framing of it, Euphoria's series finale, the Oscar snub folded in from the deleted section.
- **The Part That Does Not Fit** — the risk complication and its resolution.
- **Going Into Hiding** — the arrow question, tested rather than assumed.
- **What the Vigilance Costs** + **What This Looks Like In You** — cost accounting, inferred inner-dialogue line, and the reader mirror (the piece previously had no mirror turn).
- Moved the Law Roach loyalty section up to follow the retreat section and extended it with the leak.
- Frontmatter: the "Are Zendaya and Tom Holland engaged?" FAQ was factually wrong and is now "married," with the three-stage confirmation sourced. Added a "Why is Zendaya taking a break?" FAQ. `lastmod` untouched (still 2026-01-17).

**The spine, as the evidence actually supports it.** The tasker's hypothesis (stress arrow to 3 at full extension, then integration arrow to 9) survives, but not in the shape it was proposed. Two corrections came out of the research:

1. **Five releases in nine months is not the stress arrow.** She corrected the scale herself in Vogue Brasil (May 2026): 2026 "was only less intense than last year, when I was filming all these releases." The work was done in 2025; 2026 stacked the _exposure_, not the output. The 3-arrow is legible instead in the promotional year: two overlapping global press tours across seven cities between 22 June and 20 July. Promotion is the part with no completion state, and it is the part a Six cannot prepare her way out of. That is where the piece puts the arrow.
2. **The retreat reads as the 9 arrow, on her language.** Every quote about stopping is completion language, not exhaustion language: "wrapping up chapters with some characters I've grown with, of finishing their journey in a really beautiful way" (Vogue Brasil); "closure"/"I think so, yeah" on Euphoria ending (Drew Barrymore Show, April); "Oh girl, nothing. Just mind my business" (Fandango, late March). Nothing describes recovery or escape. **But it is not clean:** she was announced in the Shrek 5 voice cast in June 2026 for a 30 June 2027 release, which means she booked the end of the break before starting it. A Nine rests without a return date. That complication is in the published copy.

**What complicated the type read.** The tasker flagged that Nolan's _Odyssey_ plus a Marvel tentpole plus a trilogy finale is not obviously a security-seeking move. The research resolved it with her own selection criterion, which is the opposite of what a safety read predicts: "It's important that the work is exciting, but also a little scary, like, a little healthy fear about whether or not I'll be able to embody the character is always good" (Vogue Brasil, May 2026). She screens _for_ fear. The piece says so, names the fact that "she's a Six so she seeks safety" explains everything and therefore nothing, and narrows the claim: what she avoids is risk without a structure around it. A Nolan set is frightening inside a container with an end date; a wedding announcement is frightening with no container. **The type read holds, but only in the narrower form.** No re-typing needed.

**Research answers, per §3.**

1. **Holland's confirmation** — Esquire (UK), published 16 June 2026, on the viral AI wedding photos. Asked whether he had to tell relatives the images were not real: "No, because they were all there." Then "That's all you'll get on that." Grandmother detail confirmed.
2. **Her own words on the break** — Fandango, late March 2026, with _The Drama_ castmates: "I'm disappearing for a little bit. I'm going to have to go into hiding for just a little bit." / "Oh girl, nothing. Just mind my business, you know? And stay to myself." Framing is completion, not fear. See spine note above.
3. **Anything she has said about the Roach leak — NO EVIDENCE FOUND.** She has never publicly addressed it. This turned out to be more useful than a quote would have been, because the _behavior_ is on the record: Roach styled her through both the Odyssey and Spider-Man press tours four months later, including flying a Schiaparelli look from a Paris runway to London by private jet. No statement, no distance, no replacement. Her mother Claire Stoermer posted the clip of him leaking it to her own Instagram Stories, captioned "The laugh…". The piece reads the silence as a threat model working as designed rather than as forgiveness.
4. **Her framing of the five-project year** — Vogue Brasil, May 2026. See spine note. She describes it as endings, not as momentum.
5. **Odyssey / Spider-Man press demeanour** — two tours run concurrently; Spider-Man through Berlin (22 Jun), Rome (23), Paris (24), London (25), New York (17 Jul), Mexico City (20 Jul); Odyssey through London (6 Jul), Mumbai, Paris, New York premiere (14 Jul). Method-dressed as Athena throughout the Odyssey run. Their first press tour as a married couple.
6. **On-record fear** — the Vogue Brasil "healthy fear" quote is the best recent one and it is load-bearing. The 2024 anxiety material already in the piece was left in place.

**Bonus finding not in the tasker, now the spine of the wedding section.** She acknowledged the marriage four separate times in public before ever saying it, and every acknowledgment was a _gesture_ rather than a statement: flashing both ring fingers when Marsai Martin asked for a sign at the Essence Black Women in Hollywood Awards (12 March); signing a stranger's marriage certificate "Coleman" at a Vegas chapel as a _Drama_ promo stunt (14 March); deflecting to the AI photos on Kimmel; and finally "You're too late!" to a fan who proposed at the Mexico City Spider-Man event (20 July). Not one was quotable as an announcement. She never hid the fact, she refused to be the one who handed it over. The cost line the piece lands on: Roach announced it, her mother posted about it, Holland confirmed it, and **Zendaya was the fourth person to speak publicly about her own wedding.**

**Mechanics / verification.**

- Dry run clean. Diff touches exactly two fields: `content` and `faqs`. Protected fields (`date`, `loc`, `lastmod`, `published`, `enneagram`, `type`, `person`) preserved by code and RPC.
- Zero em-dashes outside HTML comments (verified with `perl -0777 -pe 's/<!--.*?-->//gs' | grep -c` = 0).
- No `QUALITY GRADE` / `QUALITY_FEEDBACK` markers. YAML valid (lint parses 6 FAQ pairs).
- `blog-lint.sh`: 9 FAIL, all pre-existing creator-v2 scaffolding this older draft predates (`production_pretext`, rabbit-hole block, four ledger comments, extractable type-answer block, `meta_title` 66 chars). Documented as pre-existing by the 2026-07-08 pass note at the bottom of the draft. Not addressed here; a news refresh is the wrong pass for a structural rework, and `meta_title` was left alone deliberately given the do-not-retitle rule.
- Contrast-pair counter: down to **1 strong**, and that one is inside a direct Holland quote ("It's not my moment, it's her moment"), so it is a false positive on our prose. Three of my own contrast pairs were caught and rewritten.

**To push (not yet run):**

```bash
node scripts/personBlogParser.js Zendaya --apply \
  --expected-content-hash=6f267a81e20f2993ccc36b07b3c086d1 \
  --approve-fields=content,faqs
```

**For the next agent.** The `--expected-content-hash` above is the _live DB_ hash as of 2026-07-25. If anyone else pushes Zendaya first, re-run the bare dry run to get the current one. Two facts to watch as they age: _Dune: Part Three_ is December 2026 and is written without a day because sources disagreed (16 vs 18); and the retreat itself is unresolved until we see whether she actually goes quiet after 31 July. If she does not, the 9-arrow read in "Going Into Hiding" is the paragraph to revisit.
