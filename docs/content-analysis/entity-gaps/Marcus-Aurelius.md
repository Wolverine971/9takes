---
person: 'Marcus-Aurelius'
audited_at: '2026-08-27'
classification: 'pass'
recommended_action: 'pass'
score: 33
biography_intent: true
personal_wikipedia: true
source_gate: 'pass'
path: docs/content-analysis/entity-gaps/Marcus-Aurelius.md
---

# Emerging Entity Gap Packet: Marcus Aurelius

**Verdict in one line:** Marcus Aurelius is not an Emerging Entity Gap — his exact-name SERP is
the single most fortified biography SERP this command has audited, defended simultaneously by
Wikipedia, Britannica, the Stanford Encyclopedia of Philosophy, Yale University Press, and
Ryan Holiday's Daily Stoic — but the backlog's actual rationale (stoicism internal-link cluster)
targets a different, genuinely weak SERP, and the source record contains a real ownable
contradiction that the popular Stoicism industry does not lead with. This packet scores the
entity-gap model honestly (PASS, 33/100, essentially identical to [Carl Jung's 34](Carl-Jung.md))
and then specifies what the page must and must not attempt if the pipeline proceeds.

**Read this first if you are the writer:** the single highest-value section here is
[Content requirements](#content-requirements) and the same-type collision warning about
[Ryan Holiday](Ryan-Holiday.md). The scorecard is a routing decision, not a writing brief.

## Why now

- **Backlog status:** `marcus-aurelius` is the current `inProgress` queue item (priority 43,
  added 2026-07-18, started 2026-08-27T06:00:00Z), rationale: _"Stoicism wave keeps him in
  evergreen demand; historical figures perform and he pairs with Ryan Holiday for a stoicism
  internal-link cluster."_ `strategicValue: self-improvement-cluster`.
- **No existing 9takes page.** Confirmed against `blogs_famous_people` and
  `src/blog/people/drafts/` on 2026-08-27. There is no indexed URL to protect or retrofit; this
  is a create-or-skip decision.
- **Catalyst: none current.** Demand is **saturated-evergreen**, not emerging. The wave is real
  but old — the nearest concrete catalysts are both roughly two years stale: Donald Robertson's
  _Marcus Aurelius: The Stoic Emperor_ (Yale University Press, Ancient Lives series, 2024) and
  the late-2024 _Gladiator II_ release cycle. Searches on 2026-08-27 surfaced no 2026 film,
  series, book, or anniversary event driving a new spike.
- **Demand evidence is directional only.** No trend tool was used. Reported secondary figures
  found during the audit — a 28% Covid-spring spike in Penguin Random House _Meditations_ sales,
  a rise from ~16,000 to ~100,000 copies between 2012 and 2019, r/Stoicism growing from a few
  hundred subscribers in 2012 to 600,000+ by 2024, and a claimed ~600% five-year rise in search
  interest — come from secondary write-ups (Paideia Institute, Vice, TIME) and are recorded here
  as **reported claims, not verified measurements**. Do not restate any of them as 9takes data,
  and do not put them in the draft without re-sourcing to the original.
- **Local GSC demand: zero.** Grep of `docs/data/gsc/2026-08-13-queries.csv` and
  `-page-query.csv` (window 2026-05-05 → 2026-08-11) for `aurelius|marcus|stoic|meditations`
  returned no rows. Expected with no page; says nothing about market demand.

## Exact-name SERP map

Checked **2026-08-27, US-localized, via WebSearch.** Queries run: `Marcus Aurelius`,
`Marcus Aurelius biography`, `Marcus Aurelius personality type`, `Marcus Aurelius enneagram type`,
`Marcus Aurelius wife Faustina son Commodus family`, `"who was Marcus Aurelius" daily stoic`,
`Marcus Aurelius 2026 new book film series documentary`,
`Marcus Aurelius letters to Fronto correspondence primary source personality`.

**`Marcus Aurelius` / `Marcus Aurelius biography` — result-type composition:**

| Result                                                         | Type                                           |
| -------------------------------------------------------------- | ---------------------------------------------- |
| Wikipedia: Marcus Aurelius                                     | personal Wikipedia (extensive)                 |
| Britannica: _Marcus Aurelius \| Biography, Meditations, Facts_ | dedicated authoritative biography              |
| Stanford Encyclopedia of Philosophy: Marcus Aurelius           | dedicated authoritative scholarly reference    |
| HISTORY.com: _Biography, Meditations & Death_                  | dedicated authoritative biography              |
| Biography.com: _Emperor of Rome, Meditations_                  | dedicated authoritative biography              |
| Yale University Press: _Who Was Marcus Aurelius?_              | publisher-authored dedicated biography         |
| EBSCO Research Starters: Marcus Aurelius                       | library-grade reference biography              |
| Daily Stoic: _Who Is Marcus Aurelius?_ (+ quotes, habits)      | dedicated popular biography, huge topical site |
| Birley, _Marcus Aurelius: A Biography_ (Routledge)             | book/commerce for the standard academic life   |
| Wikipedia: _Philosophy of Marcus Aurelius_, _Meditations_      | additional dedicated encyclopedic coverage     |
| Wikipedia: _Marcus Aurelius (name)_, _Aurelius (disambig.)_    | minor navigational noise                       |

**The command's five questions:**

1. **Dedicated substantial biographies in the top ten: seven or more**, spanning encyclopedic,
   academic, popular, and commercial registers simultaneously.
2. **Personal Wikipedia: yes** — plus two spin-out articles (_Meditations_, _Philosophy of Marcus
   Aurelius_) that independently occupy the first page.
3. **Strong publisher owning general biography intent: several at once.** Britannica and
   Wikipedia own the encyclopedic lane; SEP and Yale UP own the scholarly lane; and critically,
   **Daily Stoic owns the popular self-help lane** — the exact register a 9takes page would
   otherwise compete in.
4. **Would a reader need multiple searches after the current results: no.** Every identity, life,
   and fact query resolves on the first result.
5. **Can 9takes offer the strongest general-interest page: no.** Not now, not at any budget. This
   is a 1,900-year-old fortress with active commercial defenders.

**The one weak SERP found:** the typology long-tail. `Marcus Aurelius personality type` and
`Marcus Aurelius enneagram type` return **sakinorva**, **personality-database**, **Boo.world**,
**getpersonality.com**, **personalitylist.com**, a **worldsocionics Blogspot** post, and a
Psychology Junkie listicle that uses his quotes to illustrate _other_ types. No authoritative
owner, no dedicated reasoning, thin UGC voting. This is the only lane where a 9takes page could
plausibly be the best result — and it is exactly the backlog's cluster rationale.

**Existing hobbyist consensus to be aware of (and not to simply echo):** Enneagram **1w2**, MBTI
**INFJ**, Socionics **EII**. These are crowd-vote artifacts with no visible argument behind them.
Landing on 1 is defensible; landing on 1 _because the internet already says 1_ is not.

Backlink data: **unknown** — not checked, no tool available. None is claimed.

## Biography-intent map

Intent breadth is genuinely large. Every family below is already answered authoritatively
elsewhere, so these are things the page must **satisfy in passing** for reader completeness, not
things it can **target** for ranking.

**Core identity**

- Who was Marcus Aurelius — Roman emperor 161–180 AD, last of the "Five Good Emperors," last
  emperor of the Pax Romana, Stoic philosopher.
- What _Meditations_ is — a private notebook, titled by him something closer to _To Himself_,
  written in koine Greek roughly 170–180 during the northern campaigns, **never intended for
  publication**. This fact is load-bearing for the whole page; see Content requirements.
- Why he still matters — the most-quoted figure of the modern Stoicism revival.

**Life and career**

- Born 26 April 121 in Rome; adopted into the succession by Antoninus Pius at Hadrian's
  arrangement; consul in 140; emperor from 161, initially as co-emperor with Lucius Verus.
- Reign shaped by the Parthian campaign, the Antonine Plague, the northern/Marcomannic wars, and
  the revolt of Avidius Cassius in the east.
- Educated intensively in rhetoric under Marcus Cornelius Fronto; turned toward philosophy, most
  influenced by Epictetus's _Discourses_.
- Died 17 March 180 at Vindobona (modern Vienna) or Sirmium — **sources differ on the location;
  do not pick one silently.**

**Fact queries** (answerable and safe)

- **Age at death:** 58 (121–180).
- **Wife:** Faustina the Younger, married 145; she was about 15, he about 24 — an age gap the
  page should state plainly and not editorialize into a modern judgment.
- **Children:** at least 12 by Faustina; six survived her — five daughters plus Commodus.
  Named daughters include Lucilla, Cornificia Faustina Minor, Fadilla, Vibia Aurelia Sabina.
- **Successor:** Commodus, his son — the break in the adoptive-succession pattern, and the single
  most-searched judgment question about his life.
- **Co-emperor:** Lucius Verus (d. 169).

## Source inventory

Source depth is **exceptional in the first person and contested in the third**. Both halves
matter.

**First-person (two independent registers — this is the whole opportunity)**

1. **_Meditations_** — a private, self-addressed philosophical drill book. Arguably the single
   best first-person psychological document available for any subject in the 9takes corpus.
   Register: austere, self-correcting, repetitive, disciplinary.
2. **The correspondence with Fronto** — recovered from a palimpsest in the 19th century; the
   Loeb Classical Library edition (Haines) is public-domain and transcribed on Wikisource.
   Register: **warm, effusive, anxious, chatty, physically complaining, openly longing.** Modern
   scholarship treats it as the first real look at his private life; the affectionate and
   near-amatory language of the early letters is a live scholarly discussion.

Candidate lines found in the Wikisource Loeb text, attributed to **Marcus** (not Fronto) —
**every one of these must be re-verified verbatim against the Loeb/Wikisource text and given a
book-and-letter citation before it enters the draft; they were surfaced by an extraction pass,
not read in full context:**

- _"This day seems, and will seem, longer than a spring day, and the coming night more tedious"_
  (to Fronto, c. 140–143)
- _"I am still nervous in mind and a little depressed, lest I shall have said something in the
  Senate"_ (to Fronto, 143)
- _"It is so cold in my room that I can scarcely put my hand outside the bed-clothes"_
  (to Fronto, c. 140–143)

**Named third-party (ancient — all require handling)**

- **Fronto's own letters** — the other side of the correspondence, and useful precisely because
  Fronto's register differs.
- **Cassius Dio** — near-contemporary, but the relevant books survive only in Byzantine epitome.
- **_Historia Augusta_** — the source of many colorful Marcus/Faustina/Commodus anecdotes and
  **notoriously unreliable**; treat every claim sourced only to it as a claim about what was
  _said_, not what happened.
- **Galen** — court physician, contemporary medical witness.

**Modern scholarship (safe to cite, use for interpretation)**

- Anthony R. Birley, _Marcus Aurelius: A Biography_ (Routledge) — the standard academic life.
- Donald J. Robertson, _How to Think Like a Roman Emperor_ (2019) and _Marcus Aurelius: The Stoic
  Emperor_ (Yale UP, Ancient Lives, 2024) — the bridge between the letters and the psychology.
- Stanford Encyclopedia of Philosophy entry — for anything philosophical.

**Source gate: PASS**, comfortably. Two substantive first-person sources (well beyond the
two-source floor), multiple named third-party sources, and a signature contradiction. The one
current source tied to a catalyst is the weakest leg, because there is no current catalyst.

## Protected strengths

N/A — no existing page.

## Content requirements

If the pipeline proceeds under the cluster rationale, these are binding.

### The thesis: the drill book is not a personality description

The modern Stoicism industry reads _Meditations_ as a portrait of a serene man. The Fronto
letters show what the serenity was **built against**: an affectionate, anxious, socially attached
young man who could not stop missing his teacher, who lay awake dreading what he had said in the
Senate, who complained about the cold in his bedroom. _Meditations_ is not a description of that
man's temperament. It is the same man, decades later, still running reps against it — writing
_to himself_, in private, in a language that was not his native one, in a war camp, still telling
himself the same handful of things because they had not yet taken.

The ownable line: **he never published the manual, and he never finished needing it.** That is
what makes him a Type 1 rather than a serene sage — the inner corrector never shut up, and he
wrote its output down for ten years.

### The Ryan Holiday collision — read this before writing a word

`src/blog/people/drafts/Ryan-Holiday.md` exists (currently `published: false`), is typed
**Enneagram 1**, and is titled **"The Rule He Can't Keep."** Its `knows_about` already lists
Marcus Aurelius. These two pages are meant to be an internal-link cluster, which means a same-type
sameness failure would be maximally visible — two Type 1 Stoicism pages arguing the same shape,
linked to each other.

**They must not run the same essay.** The distinction is available and real:

- **Holiday's page is hypocrisy-shaped.** A public teacher preaches a rule, is caught on camera
  breaking it. The gap is between what he tells others and what he does.
- **Marcus's page must be the opposite shape.** He taught no one. _Meditations_ was never
  addressed to a reader. There is no hypocrisy to catch, because there was no audience. The gap
  is between **the discipline and the temperament it was applied to** — and the letters are not
  an exposé, they are the evidence of what the discipline was for.

Frame it explicitly if useful: Holiday is the man who sells the rule and can't keep it; Marcus is
the man who never sold anything and never stopped practicing. If the draft finds itself writing
"but privately, he was a hypocrite," it has collapsed into the Holiday essay — stop and rebuild.

Cross-link both directions. Add `Ryan-Holiday` to Marcus's `suggestions`. Note that the Holiday
page is **not yet published**, so the link will be dead until it ships — flag, do not silently
publish a broken internal link.

### Page mechanics

- H1 stays **Marcus Aurelius**.
- SEO title: name + distinctive, falsifiable thesis. Not "the philosopher king." Something that
  can be argued with — the claim that the calm was a practice, not a trait, is falsifiable and
  the letters are the evidence.
- Open by establishing who he is and why he matters **before** assuming the reader is already in
  the Stoicism subculture. A large share of arriving readers will know him only from _Gladiator_
  or from an Instagram quote card.
- Give a real life/career spine — succession, co-emperorship, plague, the northern wars, Avidius
  Cassius, Commodus — not a resume dump and not a quote garland.
- Answer the fact queries above concisely and in prose or FAQ metadata. Age, wife, children,
  death, successor.
- Personality analysis is the **differentiator layered on top of a satisfying general-interest
  profile**, not a replacement for it.
- Canonical URL, citations, author identity, and `wikipedia`/`wikidata_qid` frontmatter correct.
- **Do not pretend to be an encyclopedia.** The page cannot out-Britannica Britannica and should
  not try. Its only defensible claim is the reading of the two archives against each other.

### Where the search value actually is

Target the typology long-tail (`marcus aurelius personality type`, `marcus aurelius enneagram`,
`marcus aurelius enneagram 1`, `was marcus aurelius an introvert`) and the psychology-of-the-
letters lane, which no strong publisher owns. Do **not** build the page's title, description, or
structure around `marcus aurelius biography`. That query is unwinnable and chasing it will
produce a worse page.

## Claims to avoid or qualify

- **Do not claim Marcus was a hypochondriac.** The health-complaint letters clustered in
  _Ad M. Caesarem_ book 5 are substantially **Fronto's** complaints, and scholarship notes they
  irritated more than they moved. Marcus's own physical complaints are milder and more domestic.
  Getting this backwards would be a load-bearing factual error, and it is the most likely error
  this draft will make.
- **The affectionate/amatory language of the early Fronto letters** is genuinely contested
  scholarly territory regarding its nature and its Roman epistolary conventions. Report it as
  what it is — an unguarded emotional register, discussed by scholars — and do not make a
  romantic or sexual claim in either direction.
- **Faustina's alleged infidelity and the gladiator rumor** trace to Cassius Dio and the
  _Historia Augusta_. Attribute as ancient rumor or omit. Never state as fact. Never build a
  psychological read of Marcus on top of it.
- **Faustina's suicide (175 CE)** is a rumor from the same unreliable stratum. Same handling.
- **Commodus.** The "he ruined everything by picking his son" verdict is a real historiographical
  debate, not a settled fact, and the _Gladiator_ films have contaminated public understanding of
  it. If the page touches the succession, mark clearly where film fiction ends.
- **Death location** — Vindobona vs. Sirmium is genuinely disputed. Say so.
- **No diagnostic language.** No retroactive claims of anxiety disorder, depression, ulcers, or
  opium dependence — the last of these circulates widely online from thin _Historia Augusta_ and
  Galen readings. Enneagram type is a pattern read, not a diagnosis; standard do-not-write list
  and no-etiology rules apply in full.
- **No invented quotations.** _Meditations_ is one of the most heavily misquoted texts on the
  internet; a large share of circulating "Marcus Aurelius quotes" are fabricated or are
  Seneca/Epictetus. Every quote must be pinned to a book-and-section reference in a named
  translation. Assume any quote first encountered on a quote site is fake until pinned.
- **Do not restate the sales/Reddit/search-interest figures** from Why now as 9takes findings.

## Baseline and 28-day prediction

N/A — no existing page. If a page ships under the cluster rationale, the honest expectation is
slow and mostly non-attributable: **zero exact-name ranking** against this SERP, with whatever
search traffic arrives coming through the typology long-tail over months, plus internal-linking
value to the Stoicism/self-improvement cluster that GSC will not directly credit. **Do not judge
this page by exact-name metrics**, and do not treat flat exact-name impressions at 28 days as
failure. If measurement is wanted, track the typology query family and the Ryan Holiday ↔ Marcus
Aurelius internal-link path, not `marcus aurelius`.

## Scorecard and caveats

| Dimension                                                       |      Score | Basis                                                                                                   |
| --------------------------------------------------------------- | ---------: | ------------------------------------------------------------------------------------------------------- |
| Demand trajectory                                               |      10/20 | Huge and durable but saturated-evergreen; nearest catalysts ~2 years stale; evidence directional only   |
| Exact-name SERP weakness                                        |       1/25 | Personal Wikipedia + 7 authoritative dedicated biographies across all registers, incl. Daily Stoic      |
| Biography-intent breadth                                        |      13/15 | Broad, real, multi-family — every family already answered authoritatively elsewhere                     |
| Source depth                                                    |      14/15 | Two independent first-person archives (_Meditations_ + Fronto); ancient third-party record is contested |
| 9takes angle and niche fit                                      |       9/10 | "The drill book is not the personality" is ownable and under-served by the Stoicism industry            |
| Timing / index advantage                                        |       1/10 | No indexed URL, no early-mover window; ~1,900 years late                                                |
| Entity clarity                                                  |        5/5 | Unambiguous; name/disambiguation pages are trivial noise                                                |
| **Subtotal**                                                    |     **53** |                                                                                                         |
| Penalty: personal Wikipedia + several authoritative biographies |        −20 |                                                                                                         |
| **Total**                                                       | **33/100** | **PASS — below 45**                                                                                     |

Caveats: SERPs checked **2026-08-27, US-localized, via WebSearch**; composition varies by locale,
device, and personalization. No backlink, keyword-volume, or Trends data was available and none is
claimed; the sales and search-interest figures in Why now are **reported secondary claims**, not
measurements. The candidate prefilter (`emerging-entity-gap-candidates.mjs`) does not surface
Marcus Aurelius at all, since it scores existing pages only.

The PASS applies strictly to the Emerging Entity Gap model — owning general biography intent. It
is **not** a ruling on the backlog's stoicism-cluster rationale, which targets a different and
genuinely weak SERP (the typology long-tail) plus internal-linking value. That decision belongs to
the pipeline and DJ, and the Content requirements section above is written for it. Precedent:
[Carl Jung](Carl-Jung.md) scored 34/100 PASS on 2026-08-13 under the same model and the pipeline
proceeded on the hub rationale; that page is now published.

---

## Deferred production to-do: Ryan Holiday cross-link (moved here 2026-08-27)

Moved out of the draft's in-file `REVIEWER NOTES` comment by the perspective editor pass
(synthesis FUTURE-C2: a to-do buried in an HTML comment gets done when someone rereads the
comment, not when the blocker clears).

**Blocked on:** `src/blog/people/drafts/Ryan-Holiday.md` is `published: false` and
`famousTypes.ts` has `ryan-holiday link: false`, so an inline `/personality-analysis/ryan-holiday`
link would render dead.

**Do when Holiday ships:**

1. Add an inline body link from Marcus Aurelius to `/personality-analysis/ryan-holiday`
   (stoicism cluster, two-way).
2. Add `Marcus-Aurelius` to Ryan Holiday's `suggestions` frontmatter at the same time.
3. Marcus already carries `Ryan-Holiday` in `suggestions`, so only the inline link is missing.

**Do not** collapse the two pages onto one argument. Holiday's page is hypocrisy-shaped (a public
teacher breaking his own rule on camera); this page is built on the opposite shape, since Marcus
taught nobody and published nothing. The word "hypocrisy" appears once on the Marcus page, in the
intro, explicitly to rule that reading out.
