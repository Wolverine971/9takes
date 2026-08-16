---
artifact: perspective-evidence-packet
schema_version: 1
subject: Simone-Biles
draft_sha256: c562d27c5e2965cb7192e3151184b3ba1d279ac8014c2904144f51f129513eae
packet_status: complete
compiled_at: 2026-08-16T07:11:33Z
path: docs/content-analysis/perspective-reviews/Simone-Biles/2026-08-16_020003/evidence-packet.md
---

<!-- docs/content-analysis/perspective-reviews/Simone-Biles/2026-08-16_020003/evidence-packet.md -->

# Perspective-Review Evidence Packet: Simone Biles

Shared factual substrate for six independent evaluators of the frozen draft
`draft-reviewed.md` (sha256 `c562d27c…29513eae`, verified against `context.json` at compile time).

**This packet does not review the article.** Every entry is labeled `verified fact`,
`attributed claim`, `interpretation`, `disputed claim`, or `unresolved question`. The draft's
thesis (Enneagram Type 6, 6w7) is a **hypothesis** throughout, never a fact.

**Three findings materially change what evaluators can check.** They are stated here so no
evaluator has to rediscover them:

1. **The podcast the draft cites three times reader-facing does not exist under that name.**
   The draft attributes the Aimee Boorman testimony to "_Beyond Medals and Perfection_ podcast."
   The show is **The Art of Excellence**, hosted by Glenn Zweig; "Coaching Simone Biles beyond
   medals and perfection" is the _episode title_ of Ep. 122. The quotes themselves are verbatim
   and the October 2025 date is correct. The misattribution has also been written into
   `scripts/blog-source-audit.mjs` as a registered OUTLET name.
2. **"Nothing further" (line 440) has been overtaken by events.** Biles publicly disclosed a
   medical procedure on **22 July 2026** after the June 2026 hospitalisation. The _cause_ remains
   undisclosed; the _silence_ does not.
3. **Both Landis left World Champions Centre in December 2024.** The draft's habitual present
   tense — "When Biles performs it, Laurent Landi stands on the landing mat" — describes an
   arrangement that ended before the draft's own current-tense window opens.

---

## Identity and scope

**Subject.** Simone Arianne Biles Owens, born **14 March 1997**, Columbus, Ohio. Artistic
gymnast; competes for the United States. Aliases and handles: `@Simone_Biles` (X),
`@simonebiles` (Instagram); married name Owens is used inconsistently in press. Wikidata
`Q7520267` (corrected 2026-08-16 revision pass; the packet previously recorded `Q7520786`, which is a
different entity, and the frontmatter `wikidata_qid`/`same_as` already carry the correct value).
`verified fact`

**Age.** **29** as of the compile date (turns 30 on 14 March 2027). The upstream entity-gap
packet's "30-year-old global icon" is wrong; the research file caught this and the draft
corrected it. `verified fact`

**Domain and standing.** Most decorated gymnast in history by combined Olympic and World
Championship medals: **11 Olympic medals (7 gold, 2 silver, 2 bronze)**, **30 World
Championship medals (23 gold)**, 40 total; **five skills** named after her in the FIG Code of
Points (two vault, one beam, two floor). `verified fact`

**Why the article covers her.** Per the entity-gap packet (`classification: pass`, score 43),
the exact-name SERP is at maximum saturation (Wikipedia, Britannica, Olympics.com, Team USA,
Academy of Achievement, EBSCO) and is unwinnable. The stated target is the **typology modifier
sub-SERP** — `simone biles personality type` / `enneagram` / `mbti` — currently held by thin
aggregators that contradict one another. `attributed claim` (internal strategy document; no
Trends, volume, or backlink data was used at any point in this pipeline, and none is claimed)

**Knowledge cutoff of this packet.** Research current to **16 August 2026**. The three-day
window between the locker post (13 Aug 2026) and compile time is thinly covered by anything
above Tier 4. Anything after 16 Aug 2026 is out of scope.

**Reused repository research.** `docs/content-analysis/research/Simone-Biles.md` (compiled
2026-08-16), `docs/content-analysis/entity-gaps/Simone-Biles.md`, and three full transcripts in
`/tmp/biles-transcripts/` (`oVZywdI2Eoo.txt` 85.9 KB, `-6Z_whbdk-U.txt` 53.9 KB,
`JTk7aM9pKGU.txt` 70.1 KB). All transcript quotations below were re-verified against those
files by direct grep, not accepted from the research file.

---

## Dated timeline

Event date and publication date are separated. Where the draft relies on a _publication_ date to
imply an _event_ date, that is flagged in the claim inventory.

| Event date           | Event                                                                                                                                     | Publication / record                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1997-03-14           | Born, Columbus, Ohio                                                                                                                      | Wikipedia, Britannica, Olympics.com                            |
| 2000 (age 3)         | Biles and three siblings enter foster care in Ohio after biological mother Shanon's addiction                                             | Reported, multiple; her own account on _Call Her Daddy_ (2024) |
| 2003 (age 6)         | Adopted by grandfather Ronald Biles and Nellie Biles, Spring TX. Adria adopted with her; Ashley and Tevin adopted by a great-aunt in Ohio | Reported, multiple                                             |
| 2003 (age 6)         | Discovers gymnastics on a rained-out daycare field trip to Bannon's Gymnastix                                                             | Her own account; Boorman interviews                            |
| 2003–2016            | Coached by Aimee Boorman (~12 years)                                                                                                      | Boorman, _The Art of Excellence_ Ep. 122 (2025-10-12)          |
| 2013                 | Defiant training stretch; Boorman's "safe space to fail" episode; first named skill                                                       | Boorman transcript                                             |
| 2015-10-29           | Wins **third consecutive** World all-around title, Glasgow (score 60.399) — first woman to do so                                          | USA Gymnastics, Team USA, SI, BBC (Oct 2015)                   |
| 2015-10-29 (approx.) | Asks Boorman "did I do it?" after that final                                                                                              | Boorman's recollection, published 2025-10-12                   |
| 2016-08              | Rio Olympics: four golds, bronze on beam                                                                                                  | Olympic record                                                 |
| 2016-09-13           | Fancy Bears/APT28 WADA leak; same-day ADHD self-disclosure (approved TUE, no rules broken)                                                | X/Twitter post                                                 |
| 2018-01              | Publicly discloses she is a Larry Nassar survivor                                                                                         | Reported, multiple                                             |
| 2021-07-27           | Tokyo team final: withdraws after the vault; USA wins silver                                                                              | Olympic record                                                 |
| 2021-07-27           | Charlie Kirk podcast and Piers Morgan tweets attacking her                                                                                | Salon (2021-07-28), Newsweek, Mediaite                         |
| 2021-08-03           | Tokyo beam bronze with a changed, non-twisting dismount                                                                                   | Olympic record                                                 |
| 2021-09-15           | Senate Judiciary Committee testimony                                                                                                      | rev.com transcript                                             |
| 2023-04              | Marries NFL safety Jonathan Owens (met on Raya, March 2020)                                                                               | Reported, multiple                                             |
| 2023-10-01           | Competes the Yurchenko double pike at Worlds, Antwerp — first woman in international competition; skill becomes "Biles II"                | BBC, NBC News, Washington Post, ITV                            |
| 2023-10-08           | Antwerp vault final: 15.266 (6.4 D / 9.366 E / **−0.5 ND** for Laurent Landi on the mat); silver                                          | SI (2023-10-08), Gymnastics Now                                |
| 2023-12-19           | Jonathan Owens's _The Pivot Podcast_ episode posted ("the catch"; had not known who she was)                                              | xoNecole, NBC News, Hollywood Reporter                         |
| 2024-04-17           | _Call Her Daddy_ episode released ("I thought America hated me")                                                                          | Apple Podcasts, TODAY, NBC News                                |
| 2024-07-28           | Paris qualification: aggravates left calf warming up floor; competes all four; tops AA standings (59.566); "as good as I can be"          | SI, Axios, PBS, NBC (2024-07-28)                               |
| 2024-07-30           | Paris **team gold**                                                                                                                       | Olympic record                                                 |
| 2024-08-01           | Paris **all-around gold** (8 years after Rio AA gold)                                                                                     | Olympic record                                                 |
| 2024-08-03           | Paris **vault gold**                                                                                                                      | Olympic record                                                 |
| 2024-08-05           | Paris **beam final: falls, 5th** (13.100) **and floor final: silver** — the same day                                                      | 11Alive, CBS News, Al Jazeera, NBC                             |
| 2024-08-05           | Podium bow to Rebeca Andrade with Jordan Chiles; described as first all-Black gymnastics podium in Olympic history                        | GMA (2024-08-05)                                               |
| 2024-08 (post-final) | CAS voids Chiles's inquiry; bronze reallocated to Ana Bărbosu                                                                             | Olympics.com, CAS                                              |
| 2024-07 / 2024-10    | Netflix _Simone Biles Rising_ Parts 1 and 2                                                                                               | Netflix                                                        |
| 2024-12-10           | Laurent Landi departs World Champions Centre; Cécile Canqueteau-Landi departs for co-head coach role at Georgia                           | GymnasticsCoaching.com (2024-12-15), Wikipedia                 |
| 2026-01-29           | Swiss Federal Supreme Court sends the Chiles medal dispute back to CAS to consider new evidence                                           | CNN (2026-01-29)                                               |
| 2026-03-17           | Owens signs 1-year deal with Indianapolis Colts (ninth NFL season)                                                                        | Colts.com, Spotrac                                             |
| 2026-04-29 / 04-30   | CNN interview published 04-29; Laureus World Sports Awards, Madrid, reported 04-30 — "still at a 50-50"                                   | CNN (2026-04-29)                                               |
| 2026-06-06           | Instagram Story: hospital wristband, "almost dying wasn't on my bingo card earlier this week"                                             | Forbes (2026-06-06), TODAY                                     |
| 2026-07-22           | Undergoes an unnamed medical procedure, accompanied by Owens ("His birthday but he takes me to get my procedure")                         | Forbes (2026-07-23), Olympics.com, TheGrio (2026-07-25)        |
| 2026-08-13           | Instagram Story from her World Champions Centre locker, "Just how I left it"                                                              | NBC New York, Bleacher Report, AOL                             |

---

## First-person evidence

All transcript quotations below were re-verified by grep against the local transcript files.
Filler words are present in the raw transcripts; where the draft removes them, that is noted.

### The internal instrument (via Boorman, second-hand)

> "It's more of a sound. It's more of a whoosh that I hear in my ears…"

**What it can support:** that Biles has described her air awareness as auditory rather than
visual. **What it cannot support:** a verbatim Biles quotation. In the transcript Boorman is
recalling _another_ interview — "one of her more recent interviews… someone asked her about
doing the triple double… And she's like, 'It's more of a sound…'" The wording is Boorman's
recall of a Biles answer given elsewhere, and the transcript's punctuation does not cleanly
close the quotation. The draft handles this correctly by writing "quoted back by her coach."
`attributed claim` — Boorman recalling Biles, `-6Z_whbdk-U.txt`

### Foster care (her own memory of being three)

> "From my knowledge that sometimes during the night or during the day they would take kids out
> and replace them into a different home and that's usually how siblings were separated. So I was
> just so terrified that if I woke up my brother wouldn't be there… Always sneak in and go sleep
> with him."

**Can support:** her present-day account of a childhood fear and a behaviour. **Cannot
support:** that a three-year-old actually reasoned this way at the time, or that the fear
mechanism she describes was the real practice of that home. This is a 27-year-old
autobiographical memory of pre-school-age events, reconstructed in a promotional interview. No
independent corroboration was found. The draft's strongest single scene rests entirely on it.
`attributed claim` — self-report, `oVZywdI2Eoo.txt` (_Call Her Daddy_, 2024-04-17)

> "I have no idea where I would be without being adopted. Unfortunately, I might end up the same
> statistic that other foster kids unfortunately end up… I fear for what my life would have
> looked like." `attributed claim` — self-report

### The therapist exchange

> "I'm like, hey, look, it's Olympic year. Did we figure out why that happened? And she's like,
> Simone, we figured out why this has happened. I was like, are we sure? Are we sure? cuz it
> can't happen again."

**Can support:** that she re-opened a settled therapeutic conclusion in an Olympic year.
**Cannot support:** the _number of years_ elapsed, which the draft supplies from context
("eight years later" — measured from 2015, not from Tokyo). It also cannot establish that the
question was non-rhetorical, which is the load the draft's falsifier places on it.
`attributed claim` — self-report, `oVZywdI2Eoo.txt`

### Tokyo, beat by beat (all _Call Her Daddy_, 2024-04-17, all grep-verified)

> "I'm fighting demons. I'm fighting demons right now, but I'm going to do it for you guys."

> "I knew something was going to go wrong. I couldn't pinpoint what it was or when."

> "I'm not going to tell anybody on the team that. I'm a veteran… they're looking up to me and
> I'm guiding them."

> "As soon as I landed, I was like, 'Oh, America hates me. The world is going to hate me. And I
> can only see what they're saying on Twitter right now.' That was my first thought."

> "If I got hurt on that vault, they couldn't replace me. So if I got hurt, since I'm on every
> event, it's two up two count. We would have never won a medal. But since what happened
> happened, we went to the back. At that point, they could rule it as a mental injury and all of
> that stuff and physical, we got to put Jordan in. People don't know that."

> "That's something that I'll never forgive myself for… I wish I could have been in there with
> them in a way that I was supposed to."

> "Mom, come pick me up, I'm scared."

> "I couldn't even look at Laurent… I felt like I failed him. And I've never said that out loud."

**Critical limitation on the two-up two-count passage:** it is a **retrospective explanation
given roughly 33 months after the event**, in an interview promoting an Olympic comeback. It
cannot establish that the substitution arithmetic was computed in real time in the hallway. The
draft explicitly declines to claim it was — "Whether she ran that in the hallway or assembled it
three years later is not recoverable" — which is the evidentially correct posture and should be
scored as such rather than as hedging. `attributed claim`

### The Owens backlash (all grep-verified, `oVZywdI2Eoo.txt`)

> "So, I thought it was hilarious at first and then they hurt my feelings."

> "One night I… broke down and I'm like, 'Why are you guys talking about my husband like this?'"

> "…that interview had nothing to do with me. It was all for him… but he has to have his moments
> too and I let him have it."

> "Because for me it's like talk about me all you want, but don't come for my family."

All four are verbatim. The draft's compression of the middle quote to "they hurt my feelings…
Why are you guys talking about my husband like this?" splices two adjacent but non-contiguous
sentences under one ellipsis. `verified fact` (wording) / `interpretation` (the ordering the
draft calls "a fixed order")

### Senate Judiciary Committee, 15 September 2021 (rev.com transcript, verbatim)

> "To be clear, I blame Larry Nassar, and I also blame an entire system that enabled and
> perpetrated his abuse."

> "I worked incredibly hard to make sure that my presence could maintain a connection between the
> failures and the competition at Tokyo 2020."

> "That has proven to be an exceptionally difficult burden for me to carry, particularly when
> required to travel to Tokyo, without the support of any of my family."

This is the packet's strongest single piece of evidence: sworn congressional testimony, primary
transcript, and it states a **motive in her own words** rather than requiring inference.
`verified fact`

### Paris 2024

> "Yep. As good as I can be." — to a reporter in the tunnel after qualification, 2024-07-28
> `verified fact` (SI)

> "There was always a part of me that thought, 'What if?' And I think that was my anxiety
> talking." — post-Paris. **The draft renders this as "But that was obviously my anxiety
> talking."** The published wording is "And I think that was my anxiety talking." The
> substitution of "obviously" for "I think" reverses the epistemic register of the sentence
> inside quotation marks. `verified fact` (source wording) / draft wording is `disputed claim`

> "I've accomplished way more than in my wildest dreams." — press conference after finishing
> competition at Paris 2024 `verified fact` (Olympics.com)

> "It was really weird and awkward, not our favorite. None of us liked it." / "Honestly, we do
> better in environments when there's noise going on because it feels most like practice." /
> "Why are they shushing?" — on the silent beam final `verified fact` (NBC Olympics)

> "Jordan was like, 'Should we bow to her?' And I was like, 'absolutely' — it was just the right
> thing to do." / "She's so amazing. She's queen." `verified fact` (Good Morning America,
> 2024-08-05)

### 2026

> "I feel like we're still at a 50-50." / "Mental health plays a big role in it because,
> physically, my coaches will get me in shape." `verified fact` (CNN, 2026-04-29)

> "Whether on the apparatus or in the stands, I still don't know that. But 2028 seems so far
> away, and my body is aging. I felt it in Paris." — L'Équipe. **The second and third sentences
> are omitted from the draft.** In the same interview she describes her body having "literally
> collapsed" after Paris and being "sick for 10 days," and refers to Owens as a **Chicago Bears**
> safety — which dates the interview to his Bears tenure (2024–2025), _not_ to the April 2026
> window the draft's paragraph establishes. `verified fact` (quote) / `disputed claim` (implied
> date)

> "Almost dying wasn't on my bingo card earlier this week… s/o to my close circle who reached
> out, checked in, visited & or sent flowers." — Instagram Story, 2026-06-06 `verified fact`

> "Just how I left it." — Instagram Story from her WCC locker, 2026-08-13 `verified fact`

---

## Third-party testimony

### Aimee Boorman, personal coach ~2003–2016

Source for all four: **The Art of Excellence** podcast with Glenn Zweig, **Ep. 122, "Aimee
Boorman: Coaching Simone Biles beyond medals and perfection," published 12 October 2025**
(59:46). Transcript `-6Z_whbdk-U.txt`. All four grep-verified.

> "…every time that she went up in the air, she knew exactly where the ground was. And I used to
> joke with her about the fact I would ask her if she like looked at the ground or if she looked
> at the beam or she looked at the bars. And she was like, 'No, that's scary. I I don't want to
> look at it. That's scary.' But she always knew where it was. And so… I think only twice in the
> 12 years that I coached her did I ever see her get lost in the air, like not know where she
> was."

> "…one of my most proud moments with Simone in particular, it didn't have to do with the win.
> Um but it was her third world championship that she went to and it was about you know yes she
> did win that allaround but at the end of it she came up to me and you know said did I do it…"

> "I had to allow her and give her a safe space to fail in."

> "…one thing that was normal for Simone was before she competed, she was cheering for other
> people. She was watching the competition for enjoyment purposes, not to scope out her
> competition… she wasn't sitting there in her mind worrying about if she was going to fail
> somehow or if she was going to let somebody down."

**Limitations that apply to all Boorman testimony.** (a) It is a **coach's recollection nine to
twenty-two years after the events**, given on a leadership-and-excellence podcast whose frame is
"great coaching starts with empathy." (b) "Only twice in 12 years" is explicitly hedged — "I
think only twice" — and is a memory estimate, not a record. The draft's `key-stat` block
elevates it to a bare numeral **2** with no hedge. (c) The last clause of the cheering quote —
"if she was going to let somebody down" — is Boorman's _inference about Biles's inner state_,
which the draft then treats as evidence of the Type 6 fear pattern. That is inference stacked on
inference. (d) The "did I do it" anecdote is dated **by context only** ("her third world
championship"); Boorman gives no date. The 2015 identification is sound but is the packet's, not
the source's. `attributed claim`

### Nellie Biles, adoptive mother (Romper, 2021)

> "I knew I had my own barriers because these were not my biological children. You do everything
> that's nurturing, that's mothering, but emotionally, you still have to be there 100%."
> `attributed claim` — accurately quoted in the draft; not independently corroborated

### Laurent Landi and Cécile Canqueteau-Landi, coaches 2017–

> "We saw in her eyes that she wanted to do it for a good reason. It wasn't from the pressure of
> anyone else." — Laurent Landi, Washington Post, May 2021 `attributed claim`

> "It's a very difficult vault, and one mistake can have serious consequences." — Cécile
> Canqueteau-Landi on the Yurchenko double pike, Washington Post, October 2023 `attributed claim`

> "She felt a little something in her calf. That's all." — Cécile Landi, Bercy Arena, 2024-07-28
> `attributed claim`

**Material context the draft does not carry:** both Landis **left World Champions Centre in
December 2024**. Cécile became co-head coach of Georgia; Laurent departed 10 December 2024 after
seven years as WCC head coach. Biles publicly said farewell. `verified fact` (Wikipedia,
GymnasticsCoaching.com, Athlon)

### Chellsie Memmel, USAG high-performance technical lead (Washington Post, Oct 2023)

> "You can stay [on the mat] for Pak salto on bars… Why can't you stay for a double-flipping
> [element] on vault."

Establishes that the spotter deduction is **contested inside the sport as a rules problem**, not
only a personal safety choice. The draft uses the deduction exclusively as psychological
evidence and does not surface this reading. `attributed claim`

### Jonathan Owens, husband (_The Pivot Podcast_, posted 2023-12-19)

Said he was "the catch" in the relationship and that he had not heard of Biles when they matched
on Raya in 2020. Prompted weeks of pile-on including a TikTok trend. Owens later: "I have all my
social media notifications off, so I didn't even know for a while." `verified fact` (NBC News,
xoNecole, Hollywood Reporter)

### Named critics

> "We are raising a generation of weak people like Simone Biles" / "she's also very selfish,
> she's immature and she's a shame to the country" / "totally a sociopath, of course she's a
> sociopath" / "What kind of person skips the gold medal match?" — **Charlie Kirk**, _The Charlie
> Kirk Show_, 27 July 2021 `verified fact` (Salon 2021-07-28, Newsweek, Mediaite)

> "Are 'mental health issues' now the go-to excuse for any poor performance in elite sport? What
> a joke." / "Just admit you did badly, made mistakes, and will strive to do better next time." —
> **Piers Morgan**, 27 July 2021. Salon locates these on **Twitter**, not in a column. The draft
> says Morgan "wrote," which covers a tweet but reads as print. `verified fact` (quote) /
> `unresolved question` (venue precision)

Note for evaluators: Charlie Kirk died in 2025, and a false claim that Biles responded to his
2021 comments after his death circulated afterward (fact-checked by Snopes). The draft makes no
such claim. Flagged only so no evaluator imports the rumour.

---

## Public record, accomplishments, failures, and controversies

**Accomplishments.** 11 Olympic medals (7-2-2); 30 World medals (23 gold); 40 combined, the most
of any gymnast, man or woman. Five named skills. First woman to win three consecutive World
all-around titles (Glasgow, 29 October 2015), surpassing Svetlana Khorkina, whose three were
non-consecutive. First woman to compete a Yurchenko double pike internationally (Antwerp,
1 October 2023). Paris 2024: team, all-around and vault gold; floor silver.
`verified fact`

**Failures and low points.**

- Rio 2016 beam bronze, which she has said she was made "ashamed of" for years.
- Tokyo 2021: withdrew from the team final after the vault and from the all-around, vault, bars
  and floor finals; returned for beam with a modified dismount.
- Paris 2024 beam final: fall, fifth place, 13.100.
- **Her own named low point is not Tokyo** but the return to training: "one step forward, five
  steps back." This is a direct challenge to the article's implicit centre of gravity and
  evaluators should weigh it as such. `attributed claim`

**Controversies.**

- **Tokyo withdrawal.** The Kirk/Morgan attacks above. The strongest _non-partisan_ version of
  the criticism — that four teammates bore the cost of a decision she made — is real and is
  conceded in the draft.
- **2016 WADA leak.** Fancy Bears/APT28 published her therapeutic-use exemption for ADHD
  medication; she held an approved TUE and broke no rules. The research file's handling rule —
  self-disclosure and destigmatisation only, **never clinical evidence for a type** — is
  correct and the draft complies (the material was cut entirely in the second pass).
- **Jordan Chiles's Paris floor bronze.** The podium described in the draft occurred as
  described on 5 August 2024. **Days later CAS voided the inquiry that had lifted Chiles to
  third (filed four seconds past the 60-second limit), reverting her score to 13.666 and
  awarding the bronze to Ana Bărbosu.** The dispute remains live: in January 2026 the Swiss
  Federal Supreme Court referred it back to CAS to consider new evidence. The draft's phrase
  "the first all-Black gymnastics podium in Olympic history" is supported for the ceremony as it
  happened and is how GMA described it at the time; it is silent on the reallocation. The
  research file's instruction was to leave the CAS matter out as "not Biles's story." That is a
  defensible editorial call, not a factual settlement, and it is recorded here rather than
  harmonised. `verified fact` (the reallocation) / `unresolved question` (whether the omission
  misleads)
- **June–July 2026 health.** Hospitalisation 6 June 2026, described by her as near-death;
  procedure 22 July 2026 with Owens present. **Cause never disclosed** in either instance; she
  has said she will explain "sooner or later." No speculation is warranted or possible from
  available sources. `verified fact` (that both happened) / `unresolved question` (cause)

---

## Enneagram hypothesis evidence

The article's claim is **Type 6 (Loyalist), 6w7, social-dominant with a counterphobic charge,
stress line to 3, growth line to 9, stated confidence "high."** This is a **hypothesis**. The
Enneagram is a clustering framework, not a validated diagnostic instrument; nothing below
promotes it.

### Evidence marshalled for Type 6

| Evidence                                                                                          | Class                                           | Strength                                                                                                         |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| "did I do it?" to Boorman after a _third consecutive_ World AA title                              | attributed claim (coach's recall, 10 yrs later) | The stronger of the two pillars, because the result was objectively settled and the interlocutor had no audience |
| "Are we sure? Are we sure?" to her therapist in an Olympic year                                   | attributed claim (self-report)                  | Second pillar; same structure eight years on                                                                     |
| Foster-home hallway account                                                                       | attributed claim (self-report, age-3 memory)    | Vivid; evidentially the weakest of the pillars                                                                   |
| Staying inside USA Gymnastics "to maintain a connection between the failures and the competition" | **verified fact** (sworn testimony)             | **Strongest item in the packet.** Stated motive, primary source, no inference required                           |
| Standing −0.5 spotter deduction, Antwerp 2023                                                     | verified fact                                   | Behaviourally concrete and costly; but see Memmel — insiders read it as a rules dispute too                      |
| Instant deference to coaches' "no" ("Do I get new coaches?" → "oh, you're right")                 | attributed claim (self-report)                  | Fits growth-line reading                                                                                         |
| Suppressing her own alarm to steady younger teammates in Tokyo                                    | attributed claim (self-report)                  | Fits social-6                                                                                                    |
| "my love blanky"; "Mom, come pick me up, I'm scared"                                              | attributed claim (self-report)                  | Emotionally load-bearing; evidentially soft                                                                      |

### Evidence against Type 6 — the Type 3 case

Not weak, and the draft says so. Eleven Olympic medals actively chased across three quadrennia;
the GOAT branding she adopted rather than resisted; a large endorsement portfolio; _Dancing with
the Stars_; total fluency in front of a camera; her own "I've always been an open and honest
book"; her stated need to find out who she is without gymnastics. An Achiever reading absorbs
most of the public record without strain.

### Closest alternative and the discriminating evidence

**Closest alternative: Type 3.** The draft's named tiebreaker is that on two occasions, eight
years apart, she sought **private confirmation from a trusted individual of a result already
objectively measured** — behaviour that fits reassurance-seeking better than image management,
because there was no audience to perform for.

**How strong is the tiebreaker, evidentially?** Both instances are single anecdotes, and
**neither is a primary record of the moment**: one is a coach's decade-old recollection on a
podcast, the other is Biles's own retelling of a therapy session. Neither is falsifiable in the
ordinary sense. The draft states its own falsifier — that the reassurance-seeking is performance
rather than need — which is the right move; evaluators should note that the falsifier as written
**cannot be tested against the available sources**, only argued.

**Second tiebreaker (stronger):** the −0.5 deduction is a _documented, repeated, costly_
behaviour rather than a remembered utterance. Its weakness is that a competing non-psychological
explanation exists on the record (Memmel: the rule itself is wrong).

### Behaviour the Type 6 hypothesis does not explain

- Appetite for and evident enjoyment of the celebrity machine.
- Comic timing and the clapback register ("I'll walk my ass back into America happily").
- Sustained, self-initiated record-chasing across a decade.
- Returning to the site of the worst public failure of her life to do it again, in front of
  everyone.

The draft's reconciliation is 7-wing plus the 6→3 stress line, and it names this as "the softest
seam in the typing." `interpretation` — and note that a 6→3 stress line that explains _the
entire public career_ is doing enough work to be near-unfalsifiable. That is a legitimate
evaluator objection, not a resolved point.

### Competing public typings

| Source               | Typing                                                          | Tier |
| -------------------- | --------------------------------------------------------------- | ---- |
| So Syncd             | **ESFJ** _and_ Enneagram **3w2**                                | 4    |
| Personality Database | crowd-voted **ESFJ** (could not be fetched directly — HTTP 403) | 4    |
| EnneagramUniverse    | **Type 6, the Loyalist**                                        | 4    |

**Correction to the draft's framing.** Line 236 presents "three answers": So Syncd 3w2, PDB
ESFJ, one site Six. So Syncd **also lists ESFJ**. On the MBTI axis the two aggregators _agree_;
the disagreement is confined to the Enneagram axis (3w2 vs 6). The claim that the aggregators
"openly contradict each other" is true but narrower than the draft's sentence implies. All four
sources are Tier 4 and none can carry a factual correction alone; they establish only what the
SERP currently says. `disputed claim`

**No verified MBTI instrument result for Simone Biles was found.** The draft's FAQ says so
explicitly, which is correct.

---

## Draft claim inventory

Locations are line numbers in `draft-reviewed.md`. "Risk" is the consequence if the claim is
wrong, not a review verdict.

**CLM-01 — Source name.** "Boorman recalled the answer on the _Beyond Medals and Perfection_
podcast in October 2025" (L202; also L206, L238, and TESTIMONY LEDGER L127–L128).
_Class:_ citation. _Status:_ **incorrect as stated.** The show is **The Art of Excellence**
(Glenn Zweig), Ep. 122; "coaching Simone Biles beyond medals and perfection" is the episode
title. Confirmed by yt-dlp metadata on `-6Z_whbdk-U` (uploader "The Art of Excellence Podcast
with Glenn Zweig," upload date 20251012) and by glennzweig.com's episode page.
_Supporting source:_ S-01, S-02. _Counterevidence:_ none — no podcast of that name was found.
_Risk:_ three reader-facing italicised references to a non-existent publication on a page whose
entire competitive claim is "nobody shows their work"; a reader who searches the name finds
nothing. The error has also been committed to `scripts/blog-source-audit.mjs` OUTLETS (L298),
so the audit tool will keep grading the misattribution as a clean citation.

**CLM-02 — "only twice in the 12 years."** Cold open and `key-stat` block "2" (L202–L211);
also `description` frontmatter (L5).
_Class:_ fact via testimony. _Status:_ **quotation accurate, framing harder than the source.**
Boorman says "**I think** only twice." _Supporting source:_ S-01 (grep-verified).
_Counterevidence:_ none, but no record exists against which to check a coach's memory.
_Risk:_ low-moderate; the `key-stat` presents a hedged twenty-year recollection as a bare
statistic, and it is the page's headline number and meta description.

**CLM-03 — "did I do it?"** (L238, FAQ L68, TL;DR, Rabbit Hole).
_Class:_ quote + causal/psychological. _Status:_ **quotation verified; date inferred.** Raw
transcript: "at the end of it she came up to me and you know said did I do it." Boorman dates it
only as "her third world championship." The 2015 Glasgow identification is well supported —
Boorman also says "three repeat world champion," and Biles's third _consecutive_ AA title was
29 October 2015, a first for any woman. _Supporting source:_ S-01, S-03, S-04.
_Counterevidence:_ Boorman's phrase "her third world championship **that she went to**" is
literally an appearance count, not a title count; the two happen to coincide here (2013, 2014,
2015), so nothing turns on it. _Risk:_ low. This is the article's load-bearing quote and it
holds.

**CLM-04 — "Are we sure? Are we sure?"** (L242, FAQ L68).
_Class:_ quote + type claim. _Status:_ **verified verbatim.** _Supporting source:_ S-05
(grep-verified). _Counterevidence:_ none. _Risk:_ low on wording. The interpretive load — that
the question is non-rhetorical need rather than conversational emphasis — is unfalsifiable from
the source and the draft's own falsifier depends on it.

**CLM-05 — "Eight years later, preparing for Paris"** (L242).
_Class:_ chronology. _Status:_ **supported**, measured from 2015 (2015→2023). _Note for
evaluators:_ the pre-write memo at L106 says "eight years after **Tokyo**," which would be 2029.
The memo is an HTML comment stripped on publish, so this is an internal inconsistency only, but
it is the kind that migrates into a later refresh. _Risk:_ low now, moderate on reuse.

**CLM-06 — "Her biological mother, Shannon"** (L256).
_Class:_ fact. _Status:_ **spelling disputed.** The predominant spelling in coverage and on
Wikipedia is **Shanon** Biles. _Supporting source:_ S-06. _Risk:_ low but it is a named private
individual, and the page's competitive pitch is source discipline.

**CLM-07 — Foster care and adoption facts** (L256–L266): entered care at three with three
siblings; adopted at six by Ronald and Nellie Biles; Adria with her; "Ashley and Tevin were
adopted separately, in Ohio."
_Class:_ fact. _Status:_ **verified.** More specific, unused: Ashley and Tevin were adopted by a
great-aunt in the Cleveland area; the placement year was 2000. _Supporting source:_ S-06.
_Risk:_ low.

**CLM-08 — The hallway scene as psychological origin** (L258–L266, and the closing callback at
L444).
_Class:_ psychological/causal. _Status:_ `attributed claim` resting on a single self-reported
age-three memory, uncorroborated. The draft's causal chain — the child's verification behaviour
→ the adult's checking pattern → the locker photo — is the spine of the article and the ending's
entire payload. _Counterevidence:_ none found; also no confirmation found. _Risk:_ high if
challenged, because nothing else in the packet can carry the ending if this memory is treated as
unreliable.

**CLM-09 — Tokyo two-up two-count arithmetic** (L334, FAQ L71).
_Class:_ causal. _Status:_ **CORRECTED 2026-08-16 (editor pass) — the rule as previously recorded
here was FALSE.** Tokyo 2020's women's team final was **three-up, three-count**: each team selected
three gymnasts per apparatus and every score counted. No Olympic team final has run two-up
two-count. The prior entry certified the subject's own misstatement (S-05 is the _Call Her Daddy_
transcript, i.e. Biles saying "since I'm on every event, it's two up two count"). Verified against
the primary event record (Wikipedia, _Gymnastics at the 2020 Summer Olympics – Women's artistic team
all-around_): "In the final, each team selected three gymnasts to compete on each apparatus. All
scores on each apparatus were summed to give a final team score," and after the withdrawal "the
three remaining American athletes had to alter their planned lineups and routines." Jordan Chiles
was **already** one of the four team members and competed on all four apparatus in the final; she
did not enter from outside the team. Her account of applying the arithmetic is retrospective. The
draft explicitly declines to date the reasoning (L336). _Supporting source:_ primary event record;
S-05 for her wording only. _Risk:_ low as now written;
the FAQ (L71) is firmer than the body — "She has since explained the timing of the withdrawal in
team terms" — which is still accurate.

**CLM-10 — Kirk and Morgan quotes** (L330).
_Class:_ quote. _Status:_ **all verified**, 27 July 2021. Morgan's line is documented on
Twitter; "wrote" is defensible. _Supporting source:_ S-07. _Risk:_ low.

**CLM-11 — Senate testimony** (L354, L358, L360).
_Class:_ quote. _Status:_ **verified verbatim against the rev.com transcript**, hearing dated
15 September 2021. _Supporting source:_ S-08. _Risk:_ none identified. This is the article's
best-sourced claim.

**CLM-12 — Spotter deduction** (L384): "Under the code his presence alone is an automatic 0.5
deduction, which she paid at the 2023 World Championships in Antwerp."
_Class:_ fact + type claim. _Status:_ **verified** — 15.266 with a −0.5 neutral deduction,
Antwerp vault final, 8 October 2023. _Counterevidence:_ the framing "When Biles performs it,
Laurent Landi stands on the landing mat" is a habitual present that **no longer holds**: Landi
left World Champions Centre on 10 December 2024 and she has not competed since Paris 2024.
Separately, Chellsie Memmel's on-record position frames the deduction as a Code problem, which
weakens its use as pure psychological evidence. _Supporting source:_ S-09, S-10, S-11.
_Risk:_ moderate — the page's single best compressed argument is written in a tense that a
reader who follows the sport will read as out of date.

**CLM-13 — Paris medal ledger** (L396, FAQ L80): team gold 30 July, AA gold 1 August, vault
gold 3 August.
_Class:_ fact. _Status:_ **verified.** "Eight years after the last one" for the AA title is
correct to the month (11 Aug 2016 → 1 Aug 2024). _Risk:_ none.

**CLM-14 — "The last two days"** (L398).
_Class:_ chronology. _Status:_ **imprecise.** The beam final and the floor final were **both on
5 August 2024** — the same day and the same session block. If "the last two days" means vault
(3 Aug) and the final day (5 Aug), the sentence is loose; if it means beam-day and floor-day, it
is wrong. _Supporting source:_ S-12, S-13. _Risk:_ low-moderate; a gymnastics reader will catch
it, and this is the section the second pass added specifically to test the thesis.

**CLM-15 — Calf and "as good as I can be"** (L392).
_Class:_ fact + quote. _Status:_ **verified verbatim**, tunnel remark after qualification,
28 July 2024. The full quote is "Yep. As good as I can be." _Supporting source:_ S-14.
_Risk:_ none.

**CLM-16 — "Her framing in _Simone Biles Rising_: 'It wasn't at a point of weakness, it was a
point of strength.'"** (L394).
_Class:_ quote. _Status:_ **unverified as verbatim.** The _substance_ is well documented — she
did have a therapy session the morning of the Paris all-around final and was uneasy about
disclosing it. But no source located in this pass carries that sentence. The closest documented
wordings are "I think we used to think of therapy as a weakness, and now I think of it as a
strength" and "This was more of a strength thing for me," both from a Hoda Kotb interview, not
the docuseries. **This quote does not appear anywhere in
`docs/content-analysis/research/Simone-Biles.md`** — it entered at the second-pass drafting
stage with no evidence trail behind it. _Supporting source:_ S-15 (substance only).
_Risk:_ high — a quotation attributed to a named Netflix docuseries that the packet cannot
locate, in the section built to test the thesis.

**CLM-17 — "There was always a part of me that thought what if? But that was obviously my
anxiety talking."** (L396).
_Class:_ quote. _Status:_ **wording altered.** Published: "…And **I think** that was my anxiety
talking." The draft's "obviously" converts a hedge into a certainty inside quotation marks.
_Supporting source:_ S-16. _Risk:_ moderate — small change, but it is a direct quotation and it
moves the speaker's confidence in the exact direction the article's argument benefits from.

**CLM-18 — Podium bow, "absolutely," "She's queen," first all-Black gymnastics podium**
(L398, FAQ L80).
_Class:_ fact + quote. _Status:_ **all verified** for 5 August 2024. Chiles proposed the bow;
Biles's full line is "absolutely — it was just the right thing to do." _Counterevidence:_
Chiles's bronze was reallocated to Ana Bărbosu by CAS days later and the dispute is still open
(Swiss Federal Supreme Court → CAS, January 2026). The draft omits this. _Supporting source:_
S-17, S-18, S-19. _Risk:_ moderate — the claim is true of the ceremony; a reader who knows the
medal history may read the silence as either tact or error, and evaluators will differ.

**CLM-19 — Beam final atmosphere** (L398): "silent arena, no music, spectators shushed for
cheering."
_Class:_ fact. _Status:_ **verified** via her own and Suni Lee's comments. _Supporting source:_
S-13. _Risk:_ none. Note the draft's gloss — "which is what she does with an outcome she did not
choose" — is `interpretation`, and an unsympathetic reader can read the same quotes as
excuse-making after a fall.

**CLM-20 — April 2026 CNN "50-50"** (L438, FAQ L86).
_Class:_ fact + quote. _Status:_ **verified.** CNN piece published 29 April 2026; the Laureus
ceremony in Madrid is reported as 30 April 2026. The draft's "In April 2026 she stood at the
Laureus Awards in Madrid and CNN asked about Los Angeles" compresses the two. _Supporting
source:_ S-20. _Risk:_ low.

**CLM-21 — "She told L'Équipe she will be there either way"** (L438; FAQ L86 "she will be in
Los Angeles in some capacity").
_Class:_ quote + interpretation. _Status:_ **quote verified, gloss contested, date blurred.**
The sentence "Whether on the apparatus or in the stands, I still don't know that" is immediately
followed in the same interview by "But 2028 seems so far away, and my body is aging. I felt it
in Paris," and elsewhere by an account of her body having "literally collapsed" after Paris. The
draft's reading of the line as a commitment to attend is one available reading of an ambiguous
(and translated) sentence; the surrounding context leans toward doubt. Separately, the interview
identifies Owens as a **Chicago Bears** safety, dating it to 2024–2025 — before the April 2026
paragraph it sits inside. _Supporting source:_ S-21. _Risk:_ moderate; the FAQ states the gloss
as fact.

**CLM-22 — "Nothing further."** (L440).
_Class:_ fact (currency). _Status:_ **false as of the compile date.** On 22 July 2026 Biles
posted about undergoing a medical procedure with Owens present ("His birthday but he takes me to
get my procedure"), and has said she plans to explain "sooner or later." What remains undisclosed
is the **cause**, not the subsequent existence of updates. _Supporting source:_ S-22, S-23.
_Risk:_ high for a section whose entire function is to be current; it is also the sentence the
draft uses to prove the "open book about the facts, layers about the fear" reading.

**CLM-23 — Locker photo** (L442, FAQ L86): "in August 2026, she posted a picture of her locker at
the World Champions Centre. Two words: 'Just how I left it.'"
_Class:_ fact. _Status:_ **verified**, Instagram Story, 13 August 2026. (The research file noted
Aug 13/14 reporting variance; the sources located here say 13 August.) It was one of a series of
WCC Stories, not a single image. _Supporting source:_ S-24. _Risk:_ low.

**CLM-24 — Career totals and "twenty years above a hard floor"** (L213).
_Class:_ fact. _Status:_ 11 Olympic medals / 30 World medals / five named skills **verified**.
"Twenty years" is a round-down: she began at six in 2003, i.e. ~23 years. _Supporting source:_
S-25. _Risk:_ low.

**CLM-25 — "Owens is in Indianapolis now, ninth NFL season."** (L440).
_Class:_ fact. _Status:_ **verified** — signed 17 March 2026, one year, $1,402,500; ninth season;
previously Houston, Green Bay, Chicago. _Supporting source:_ S-26. _Risk:_ none.

**CLM-26 — Owens "the catch" beat** (L380).
_Class:_ fact + quote. _Status:_ **verified.** Episode posted 19 December 2023; all four Biles
quotes grep-verified verbatim in the _Call Her Daddy_ transcript. The draft's "they hurt my
feelings… Why are you guys talking about my husband like this?" splices two adjacent
non-contiguous sentences under one ellipsis. _Supporting source:_ S-05, S-27. _Risk:_ low.

**CLM-27 — "So Syncd says 3w2. Personality Database crowd-votes ESFJ. One Enneagram site says
Six."** (L236; FAQ L68, L77).
_Class:_ fact about sources. _Status:_ **incomplete.** So Syncd's page lists **ESFJ and 3w2**.
The two aggregators therefore agree on MBTI and differ only on Enneagram. PDB could not be
fetched directly (HTTP 403); its ESFJ crowd-vote is carried on the research file and the
entity-gap packet, both internal. _Supporting source:_ S-28, S-29. _Risk:_ low-moderate; the
"three answers" framing is the setup for the page's whole competitive claim.

**CLM-28 — The Type 6 diagnosis, wing 6w7, so/sx subtype, 6→3 stress, 6→9 growth, "Confidence:
high."** (L234–L250, L409–L432).
_Class:_ type claim. _Status:_ `interpretation` throughout. The subtype is self-described as
"the least certain call here," which matches the research file. See the Enneagram section above
for what supports it, what does not, and where the reconciliation approaches
unfalsifiability. _Risk:_ this is the article's product; it cannot be verified, only argued.

**CLM-29 — "the twisties… a documented proprioceptive phenomenon in gymnastics, not a
psychiatric diagnosis"** (FAQ L74).
_Class:_ definitional. _Status:_ **supported.** The twisties are described in clinical and
sports-medicine coverage as a loss of air sense / proprioceptive feedback, affecting other
aerial sports; it is not a DSM entity. _Supporting source:_ S-30. _Risk:_ low.

**CLM-30 — "a bronze on beam that America told her was a disgrace"** (L288).
_Class:_ interpretation of her own account. _Status:_ her documented statement is "people made me
so ashamed of it in Rio." "America told her was a disgrace" is a rhetorical amplification with no
cited instance behind it. _Risk:_ low-moderate; it is the kind of unsourced amplification the
page's own thesis ("nobody shows their work") invites scrutiny of.

---

## Disputes and unresolved questions

1. **Where the "point of strength" quotation comes from (CLM-16).** The largest unresolved gap
   in the packet. The event is documented; the sentence in quotation marks is not, and it has no
   trail in the repository research file. It may be verbatim from _Simone Biles Rising_, which
   this pass could not audit — the docuseries requires a Netflix session and no transcript
   exists locally. Until it is located, any conclusion resting on it must stay qualified.
2. **Whether Boorman's "did I do it?" is reassurance-seeking or ordinary athlete-coach
   debrief.** Not settleable. The source gives one sentence and Boorman's own gloss (stress
   management, trust, growth), which is not the same reading the article puts on it. Both
   readings survive the evidence.
3. **Whether the two-up two-count reasoning happened in the hallway or was assembled later.**
   Not recoverable. The draft says so.
4. **Whether the article should carry the Chiles/CAS reallocation.** Factually open, editorially
   contested inside the pipeline itself (the research file said leave it out).
5. **The L'Équipe interview's date and its meaning.** Internal evidence dates it to Owens's
   Bears tenure (2024–2025); an exact publication date was not established. Its ambiguous key
   sentence carries two readings.
6. **Instinctual subtype.** so/sx is a reading. The draft says so; the research file says so.
   Nothing available discriminates.
7. **Cause of the June 2026 medical emergency and the July 2026 procedure.** Undisclosed by the
   subject. No responsible inference is available and none should be attempted.
8. **Whether Biles will compete at LA 2028.** Genuinely open; she says so herself. Anything the
   article implies beyond "undecided" is interpretation.
9. **PDB's actual current crowd-vote.** Not directly verifiable in this pass (403). Tier 4
   regardless.

---

## Source ledger

| ID   | Tier | Source / outlet                                                                                                                           | Date                                               | URL or repo path                                                                                                                                     | Supports                                                                                                              | Limitations                                                                                                                          |
| ---- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| S-01 | 1    | _The Art of Excellence_ Ep. 122, "Aimee Boorman: Coaching Simone Biles beyond medals and perfection" (Glenn Zweig) — full auto-transcript | 2025-10-12                                         | `/tmp/biles-transcripts/-6Z_whbdk-U.txt`; https://www.youtube.com/watch?v=-6Z_whbdk-U                                                                | All four Boorman quotes; the "whoosh"; the show's real name                                                           | Auto-transcript, unpunctuated; coach recollection 9–22 yrs after events; promotional frame                                           |
| S-02 | 2    | glennzweig.com episode page for Ep. 122                                                                                                   | 2025                                               | https://glennzweig.com/ep-122-aimee-boorman-coaching-simone-biles-beyond-medals-and-perfection/                                                      | Confirms show name, host, episode number                                                                              | Host's own site                                                                                                                      |
| S-03 | 2    | USA Gymnastics / Team USA, "Biles wins third straight women's World all-around title"                                                     | 2015-10-29                                         | https://www.teamusa.org/News/2015/October/29/Simone-Biles-Is-First-Gymnast-To-Win-Three-Straight-World-All-Around-Titles                             | 2015 Glasgow date, 60.399, first woman with three consecutive AA titles                                               | Federation source                                                                                                                    |
| S-04 | 3    | Sports Illustrated, "Simone Biles wins third world all-around title"                                                                      | 2015-10-23                                         | https://www.si.com/more-sports/2015/10/23/simone-biles-wins-third-world-all-around-title-gold-glasgow-gymnastics                                     | Corroborates the 2015 title                                                                                           | Date on URL precedes final; use S-03 for the date                                                                                    |
| S-05 | 1    | _Call Her Daddy_, "Simone Biles: 'I thought America hated me'" — full auto-transcript                                                     | Released 2024-04-17 (YouTube re-upload 2025-05-09) | `/tmp/biles-transcripts/oVZywdI2Eoo.txt`; https://podcasts.apple.com/us/podcast/simone-biles-i-thought-america-hated-me/id1418960261?i=1000652704211 | Nearly all first-person Tokyo, foster-care, therapy and Owens quotes                                                  | Auto-transcript; promotional interview in a comeback year; retrospective throughout. **YouTube upload date is not the release date** |
| S-06 | 3    | Heavy, Sportskeeda, EURweb on Shanon Biles                                                                                                | 2016–2024                                          | https://heavy.com/sports/olympics/simone-biles-biological-mother-shanon/                                                                             | Spelling "Shanon"; 2000 placement; Ashley/Tevin adopted by a great-aunt                                               | Tier 3 tabloid-adjacent; use only for the spelling flag, not for characterisation                                                    |
| S-07 | 3    | Salon, "Charlie Kirk, Piers Morgan slam Simone Biles…"                                                                                    | 2021-07-28                                         | https://www.salon.com/2021/07/28/charlie-kirk-piers-morgan-slam-simone-biles-shes-a-selfish-sociopath-shame-to-the-country/                          | Kirk and Morgan quotes; Morgan's venue = Twitter                                                                      | Secondary aggregation of a podcast and tweets; Newsweek/Mediaite corroborate                                                         |
| S-08 | 1    | rev.com transcript, Senate Judiciary Committee opening statement                                                                          | Hearing 2021-09-15                                 | https://www.rev.com/transcripts/simone-biles-testimony-on-larry-nassar-abuse-investigation-opening-statement-transcript                              | All three Senate quotes verbatim                                                                                      | Third-party transcript of a public hearing; congressional record is the higher authority                                             |
| S-09 | 2    | Washington Post, "Why Simone Biles gets deduction when coach spots her Yurchenko double pike vault"                                       | 2023-10-01                                         | https://www.washingtonpost.com/sports/olympics/2023/10/01/simone-biles-coach-vault-deduction/                                                        | The −0.5 rule; Cécile Landi and Memmel quotes                                                                         | Paywalled/403 in this pass; content taken from search extraction and corroborated                                                    |
| S-10 | 3    | Sports Illustrated, Antwerp vault final                                                                                                   | 2023-10-08                                         | https://www.si.com/olympics/2023/10/08/simone-biles-silver-vault-fall-yurchenko-double-pike-scoring                                                  | 15.266 = 6.4 D / 9.366 E / −0.5 ND; silver                                                                            | Reported                                                                                                                             |
| S-11 | 3    | GymnasticsCoaching.com, "Laurent Landi leaves WCC"; Wikipedia (Laurent Landi, Cécile Canqueteau-Landi)                                    | 2024-12-15                                         | https://gymnasticscoaching.com/2024/12/15/laurent-landi-leaves-wcc/                                                                                  | Both Landis left WCC December 2024                                                                                    | Trade blog + wiki; adequate for a currency flag, not for a factual correction alone                                                  |
| S-12 | 3    | 11Alive / CBS News / Al Jazeera on the Paris beam final                                                                                   | 2024-08-05                                         | https://www.cbsnews.com/news/simone-biles-slips-off-balance-beam-during-final-to-miss-olympic-medal/                                                 | Fall, 5th, 13.100; same day as floor final                                                                            | Reported                                                                                                                             |
| S-13 | 2    | NBC Olympics, "Silence not golden: Simone Biles and Suni Lee discuss awkward beam final"                                                  | 2024-08                                            | https://www.nbcolympics.com/news/silence-not-golden-simone-biles-and-suni-lee-discuss-awkward-beam-final                                             | The silence quotes; beam final on the Monday                                                                          | Rightsholder outlet                                                                                                                  |
| S-14 | 3    | Sports Illustrated, "Simone Biles Had Blunt Response When Asked If She Was Okay"                                                          | 2024-07-28                                         | https://www.si.com/olympics/simone-biles-olympics-injury                                                                                             | "Yep. As good as I can be"                                                                                            | Reported                                                                                                                             |
| S-15 | 3    | TODAY / SI on _Simone Biles Rising_ Part 2 and the Hoda Kotb interview                                                                    | 2024-10                                            | https://www.today.com/popculture/tv/simone-biles-rising-part-two-netflix-docuseries-rcna167567                                                       | That she had therapy the morning of the AA final and reframed it as strength                                          | **Does not carry the draft's exact sentence.** Docuseries itself not audited                                                         |
| S-16 | 2    | Olympics.com, "Simone Biles: 'After all these years putting the mental work in, it's paid off'"                                           | 2024-08                                            | https://www.olympics.com/en/news/simone-biles-mentasl-work-paid-off-medals-records-paris-olympics                                                    | "…And I think that was my anxiety talking"                                                                            | Rightsholder outlet                                                                                                                  |
| S-17 | 2    | Good Morning America                                                                                                                      | 2024-08-05                                         | https://www.goodmorningamerica.com/living/story/simone-biles-jordan-chiles-bowing-rebeca-andrade-after-112580694                                     | Chiles proposed the bow; "absolutely"; "She's queen"; first all-Black gymnastics podium                               | Reported same-day                                                                                                                    |
| S-18 | 1    | Olympics.com on the CAS ruling                                                                                                            | 2024-08                                            | https://www.olympics.com/en/news/cas-rejects-jordan-chiles-floor-exercise-inquiry-score-increase                                                     | Inquiry voided (4 seconds late); bronze to Bărbosu                                                                    | Official Olympic channel                                                                                                             |
| S-19 | 2    | CNN, Chiles medal dispute returned to CAS                                                                                                 | 2026-01-29                                         | https://www.cnn.com/2026/01/29/sport/olympics-gymnastics-jordan-chiles-medal-dispute                                                                 | Dispute still live in 2026                                                                                            | —                                                                                                                                    |
| S-20 | 2    | CNN, "Simone Biles has left the door open to competing at 2028 Olympics"                                                                  | 2026-04-29                                         | https://www.cnn.com/2026/04/29/sport/simone-biles-2028-olympics-laureus                                                                              | "50-50"; "Mental health plays a big role"; "make these decisions pretty quickly"                                      | cnn.com returned 451 to direct fetch in the earlier research pass                                                                    |
| S-21 | 3    | L'Équipe via US syndication (wkyc/king5/12news et al.), "Simone Biles unsure about 2028 Olympics, says body 'collapsed' after Paris"      | undated in this pass                               | https://www.wkyc.com/article/sports/olympics/simone-biles-undecided-competing-la-olympics-2028/507-be0390d1-3d57-4b2b-9edf-6c5762df4d87              | The apparatus/stands quote plus its omitted context; Owens described as a Bears safety                                | Translated; syndicated; **original publication date not established** (direct fetch timed out)                                       |
| S-22 | 2    | Forbes, "Simone Biles Opens Up About 'Scary' Hospitalization"                                                                             | 2026-06-06                                         | https://www.forbes.com/sites/carolineprice/2026/06/06/simone-biles-opens-up-about-scary-hospitalization/                                             | June hospitalisation, wristband photo, "bingo card" quote, no cause named                                             | Contributor-network reporting on Instagram Stories                                                                                   |
| S-23 | 2    | Forbes / Olympics.com / TheGrio on the July procedure                                                                                     | 2026-07-23 → 2026-07-25                            | https://www.olympics.com/en/news/simone-biles-undergoes-procedure-june-health-scare                                                                  | Procedure on 2026-07-22 with Owens; still no cause disclosed                                                          | Direct fetch of the Olympics.com page timed out; taken from search extraction, corroborated across three outlets                     |
| S-24 | 2    | NBC New York / Bleacher Report / AOL on the WCC Stories                                                                                   | 2026-08-13                                         | https://www.nbcnewyork.com/olympics/2028-los-angeles/simone-biles-teases-gymnastics-comeback-training-gym/6536968/                                   | Locker photo, "Just how I left it," a series of Stories                                                               | Reporting on ephemeral Stories; originals expired                                                                                    |
| S-25 | 1    | Olympics.com, "Simone Biles: All titles, records and medals — complete list"                                                              | 2024                                               | https://www.olympics.com/en/news/simone-biles-all-titles-records-and-medals-complete-list-paris-2024                                                 | 11 Olympic / 30 World / five named skills / 40 combined                                                               | Direct fetch timed out; totals corroborated by CBS News and NBC Olympics                                                             |
| S-26 | 1    | Colts.com + Spotrac                                                                                                                       | 2026-03-17                                         | https://www.colts.com/news/colts-sign-free-agent-s-jonathan-owens-simone-biles                                                                       | Signing date, 1 yr / $1,402,500, ninth season                                                                         | Club source for club facts                                                                                                           |
| S-27 | 2    | NBC News / xoNecole / Hollywood Reporter on the Pivot episode                                                                             | 2023-12-19 onward                                  | https://www.nbcnews.com/pop-culture/pop-culture-news/simone-biles-husband-unbothered-interview-backlash-said-was-catch-marr-rcna131028               | Episode posted 19 Dec 2023; "the catch"; Raya 2020; the pile-on                                                       | Reported                                                                                                                             |
| S-28 | 4    | So Syncd database entry                                                                                                                   | undated                                            | https://www.sosyncd.com/database/simone-biles-personality-type-zodiac-sign-enneagram/                                                                | Lists **ESFJ and 3w2**                                                                                                | Aggregator; no methodology; cannot carry a correction alone                                                                          |
| S-29 | 4    | EnneagramUniverse celebrity page                                                                                                          | undated                                            | https://enneagramuniverse.com/celebrities/simone-biles                                                                                               | Lists Type 6                                                                                                          | Aggregator; agrees with the draft, which is not evidence for it                                                                      |
| S-30 | 2    | Cleveland Clinic + TIME on the twisties                                                                                                   | 2021 / 2024                                        | https://health.clevelandclinic.org/twisties-gymnastics                                                                                               | Twisties = loss of air sense / proprioceptive feedback loop; affects other aerial sports; not a psychiatric diagnosis | Explainer journalism, not primary literature                                                                                         |
| S-31 | 1    | Repository research file                                                                                                                  | 2026-08-16                                         | `docs/content-analysis/research/Simone-Biles.md`                                                                                                     | Quote corpus, handling rules, the ADHD/WADA rule, the 0.5-at-Paris prohibition                                        | Internal; compiled by the same pipeline that produced the draft — **not independent**                                                |
| S-32 | 1    | Repository entity-gap packet                                                                                                              | 2026-08-16                                         | `docs/content-analysis/entity-gaps/Simone-Biles.md`                                                                                                  | SERP composition, target queries, strategy                                                                            | Internal; contains the "30-year-old" age error; no Trends/volume data                                                                |
| S-33 | 1    | _SHIFT Movement Science_ podcast, Aimee Boorman                                                                                           | 2020-11-10                                         | `/tmp/biles-transcripts/JTk7aM9pKGU.txt`                                                                                                             | A second, earlier Boorman interview                                                                                   | **Not used by the draft.** Contains none of the four quoted lines; available for cross-checking Boorman's consistency                |

---

## Research limitations

1. **Netflix _Simone Biles Rising_ was not audited.** Both parts are behind an authenticated
   session and no transcript exists locally. This is the single reason CLM-16 stays unresolved,
   and it is also why the draft's other docuseries-adjacent framing (the therapy-appointment
   beat) could only be corroborated in substance, not in wording.
2. **Direct fetches failed or timed out** on olympics.com (career-totals page, July-procedure
   page), wkyc.com (L'Équipe syndication), and personality-database.com (HTTP 403). Facts from
   those pages are taken from search-result extraction and corroborated across at least two
   independent outlets, except the PDB crowd-vote, which is carried only on internal documents.
   The earlier research pass separately recorded 403/451 blocks on washingtonpost.com, cnn.com
   and nbcnews.com.
3. **The two podcast transcripts are machine-generated**, unpunctuated and unlabelled by speaker.
   In the _Art of Excellence_ transcript, quotation boundaries between Boorman's own voice and
   her recall of Biles's words are ambiguous — this is exactly the failure mode that nearly
   mis-attributed material in a previous people-pipeline run, and it is why the "whoosh" quote is
   classed as attributed rather than verified.
4. **The L'Équipe interview was read only in English syndication.** No original French text and
   no publication date were obtained. Translation drift on the apparatus/stands sentence cannot
   be assessed.
5. **The foster-care account has no independent corroboration and cannot get any.** Child-welfare
   records are sealed; the only witnesses are family. Every downstream reading of that scene
   inherits this limit.
6. **No Google Trends, keyword volume, backlink or ranking data was used** at any point in this
   pipeline. Nothing in the packet supports a claim about search demand or difficulty.
7. **The repository research file and entity-gap packet are not independent sources.** They were
   produced by the same run that produced the draft. Where they are the only support for a claim
   (notably the PDB crowd-vote), that is stated in the ledger rather than laundered into
   corroboration.
8. **The three days between 13 and 16 August 2026 are thinly sourced.** If anything changed in
   the comeback story in that window, this packet would not know.
