<!-- docs/content-analysis/pipeline-audit-2026-07-04/fingerprint-report.md -->
# 9takes People-Pipeline Formula Fingerprint Audit

Read-only mechanical text analysis. Corpus: `src/blog/people/drafts/*.md` (469 files total). Focus set: 17 of the ~18 named "recent full-pipeline" subjects (Maisy-Stella has no draft file anywhere in the repo — dropped from all counts below; n=17, not 18).

---

## 0. Calibration notes (from full reads of Steve-Martin, Zac-Efron, Mira-Murati)

Every draft in the recent cohort follows this exact skeleton, byte-for-byte structurally identical:

1. **Frontmatter** — `title`, `meta_title`, `persona_title`, `description`, `enneagram`, `faqs[]` (always exactly 5, **FAQ #1 is verbatim "What is [Name]'s personality type?" in 17/17 drafts — 100%**), `content_quality` rubric block (hook/enneagram/evidence/writing/originality/discoverability/overall/letter).
2. **HTML-comment QA ledgers** immediately after frontmatter, before any visible content: `QUALITY GRADE`, `TESTIMONY LEDGER`, `HEADING MIX LEDGER`, `DISTRIBUTION LEDGER`, `FORMULA FINGERPRINT LEDGER`, then later `FRESH EYES REVIEW`, `SECOND PASS NOTES`, `EDITOR PASS NOTES`, `REVISION PASS NOTES`. **The pipeline already runs a self-audit for exactly the fingerprint problem this task investigates** — the `FORMULA FINGERPRINT LEDGER` explicitly counts "contrast-pair sentence engines" and caps them (Steve-Martin's ledger: "3, all load-bearing and deliberately kept"; Mira-Murati's: "2"). This is strong evidence the pipeline operators already know about and are actively (partially) mitigating this exact issue — but the ledgers themselves prove the fixes are per-draft and manual, not systemic, so the tics still leak through (see §2, §5).
3. **Epigraph**: `> "quote" — Name, _Source_, Year` blockquote. **17/17 (100%)**.
4. **Cold open**: `<p class="firstLetter">...</p>` first paragraph, always a concrete scene. **17/17 (100%)**.
5. **TL;DR accordion**: `<details><summary class="accordion">TL;DR: Why [Name] Is an Enneagram Type N</summary><div class="panel"><ul><li><b>Label:</b> text</li>...</ul></div></details>`, always 4–5 bullets. **17/17 (100%)** — see §3 for label reuse.
6. **Diagnosis H2**: `## What Is/is [Name]'s Personality Type?` — verbatim template modulo capitalization. **17/17 (100%)**, and per the ledgers this is explicitly flagged "required structural," so it's a deliberate template, not an accident.
7. **Rabbit Hole**: `<details class="enneagram-rabbit-hole"><summary class="accordion">🐇 Enneagram Rabbit Hole: Wings, Subtypes &amp; Connecting Lines for [Name]</summary>` containing Wing / Instinctual Subtype / Stress-Growth Arrows / Counterarguments subsections. **17/17 (100%)**.
8. **Two-column contrast panel** (`<div class="contrast-panel"><div><strong>What the world saw</strong>...</div><div><strong>What was underneath</strong>...</div></div>`): present in only **7/17** — not universal, but where used it clusters hard (Rose-Blackpink 7×, Nick-Offerman 6×, Brendan-Fraser 5× in one draft each — a device some drafts lean on heavily, others skip entirely).
9. **Closing**: no fixed markup, but a codified narrative rule — the ledgers literally grade an "Ending swap-test: pass/fail." Checked manually on the 6 newest: **6/6 (100%)** return to the opening's central image/number (see §3).

---

## 1. Per-draft tic counts (body text, HTML comments stripped)

Regexes: literal phrases case-insensitive; contrast-pair regexes `[Nn]ot [^.]{3,60}, (but|it was|it's)`, `wasn'?t [^.]{3,60}[.;] [Ii]t was`, `looked like`; sentence-initial imperatives `^(Watch|Notice|Look at)`.

| draft                        | The tell | Sit with | Read that | the machinery | the wound | the mask | scar tissue | "the body" | not-X-it-was-Y | wasn't-X.It-was-Y | looked like | Watch/Notice/Look-at (imper.) | **TOTAL** |
| ---------------------------- | -------- | -------- | --------- | ------------- | --------- | -------- | ----------- | ---------- | -------------- | ----------------- | ----------- | ----------------------------- | --------- |
| Steve-Martin                 | 0        | 0        | 0         | 0             | 0         | 0        | 0           | 5\*        | 0              | 1                 | 0           | 0                             | 6         |
| Tobey-Maguire                | 1        | 0        | 0         | 0             | 0         | 1        | 0           | 0          | 0              | 0                 | 0           | 0                             | 2         |
| Jeff-Goldblum                | 0        | 0        | 0         | 1             | 1         | 0        | 0           | 0          | 0              | 0                 | 0           | 1                             | 3         |
| Rose-Blackpink               | 1        | 1        | 0         | 0             | 1         | 2        | 0           | 1          | 1              | 0                 | 0           | 0                             | 7         |
| Zac-Efron                    | 1        | 0        | 0         | 1             | 1         | 0        | 0           | 8\*        | 2              | 1                 | 1           | 0                             | 15        |
| Alex-Warren                  | 2        | 1        | 1         | 1             | 2         | 0        | 0           | 0          | 0              | 0                 | 0           | 0                             | 7         |
| Mira-Murati                  | 2        | 2        | 1         | 0             | 0         | 0        | 0           | 0          | 0              | 0                 | 0           | 0                             | 5         |
| Jim-Carrey                   | 1        | 1        | 2         | 0             | 0         | 0        | 0           | 1          | 0              | 0                 | 1           | 0                             | 6         |
| Brendan-Fraser               | 1        | 0        | 1         | 0             | 0         | 0        | 0           | 3\*        | 1              | 0                 | 1           | 0                             | 7         |
| Matt-Smith                   | 1        | 0        | 1         | 0             | 1         | 0        | 2           | 1          | 0              | 0                 | 0           | 1                             | 7         |
| Susan-Sarandon               | 1        | 1        | 0         | 0             | 2         | 0        | 0           | 1          | 1              | 0                 | 0           | 0                             | 6         |
| John-Goodman                 | 2        | 0        | 0         | 0             | 0         | 0        | 0           | 0          | 0              | 0                 | 0           | 1                             | 3         |
| Nick-Offerman                | 1        | 1        | 0         | 0             | 0         | 0        | 0           | 0          | 0              | 0                 | 0           | 2                             | 4         |
| Olivia-Wilde                 | 0        | 1        | 0         | 0             | 0         | 0        | 0           | 0          | 0              | 0                 | 2           | 0                             | 3         |
| Jason-Sudeikis               | 1        | 0        | 1         | 0             | 0         | 0        | 0           | 0          | 0              | 0                 | 0           | 2                             | 4         |
| Kurt-Russell                 | 0        | 0        | 0         | 0             | 0         | 0        | 0           | 0          | 2              | 0                 | 0           | 1                             | 3         |
| Hailee-Steinfeld             | 0        | 0        | 1         | 0             | 0         | 0        | 0           | 0          | 0              | 0                 | 0           | 1                             | 3         |
| **Column total (17 drafts)** | **15**   | **8**    | **8**     | **3**         | **8**     | **3**    | **2**       | **20**     | **7**          | **2**             | **5**       | **8**                         | —         |

\* "the body" hits for Steve-Martin/Zac-Efron/Brendan-Fraser are mostly **topical** (literally about the subject's physical body — Baywatch physique, panic-attack physiology, weight loss) rather than the generic psychological tic "read/watch the body." Treat this column as noisy/weak signal, not a fingerprint.

**Corpus-wide file counts (all 469 drafts, any Enneagram type) for the same top phrases** confirm these aren't isolated to the recent 17:

| phrase          | files containing it (of 469) | % of corpus |
| --------------- | ---------------------------- | ----------- |
| "The tell"      | 94                           | 20%         |
| "core wound"    | 78                           | 17%         |
| "the mask"      | 56                           | 12%         |
| "the machinery" | 32                           | 7%          |
| "Sit with that" | 23                           | 5%          |
| "hypervigilan-" | 18                           | 4%          |
| "scar tissue"   | 9                            | 2%          |
| "earned every"  | 3                            | 0.6%        |
| "cut to black"  | 3                            | 0.6%        |

**"The tell" is the single most-repeated construction in the entire corpus**: 1 in 5 of all 469 drafts uses the exact rhetorical move "`___ is the tell`" to introduce the diagnostic beat (confirmed constructions: "The way he said it is the tell," "The tell is the blankness," "What he says about it is the tell," "that opacity is itself the tell," "The order is the tell," "What he did after it ended is the tell," "because it is the tell" — 7 of these 8 quoted instances are from 7 _different_ recent-cohort drafts: Jim-Carrey, John-Goodman ×2, Mira-Murati, Tobey-Maguire, Rose-Blackpink, Susan-Sarandon).

---

## 2. Sentence-engine constructions found (with actual quotes)

**"X is the tell" (7 of 17 recent drafts, 41%)** — near-identical rhetorical move used to flag the diagnostic beat:

- Jim-Carrey: _"The way he said it is the tell: 'I have enough. I've done enough. I am...'"_
- John-Goodman (used twice in one draft): _"The tell is the blankness..."_ / _"What he says about it is the tell."_
- Mira-Murati: _"that opacity is itself the tell."_
- Tobey-Maguire: _"What he did after it ended is the tell."_
- Rose-Blackpink: _"The order is the tell."_
- Susan-Sarandon: _"because it is the tell."_

**Sentence-initial "Watch..." imperative (6 of 17 drafts, 35%, 8 total uses)**:
Hailee-Steinfeld, Jason-Sudeikis (×2), Jeff-Goldblum, John-Goodman, Kurt-Russell, Matt-Smith, Nick-Offerman (×2) — e.g. "Watch how Sudeikis talks about himself...", "Watch what Goodman is loyal to...", "Watch where he points himself.", "Watch what the surprise is protecting."

**Counter-typing paragraph reused near-verbatim across two unrelated drafts** — Alex-Warren (Type 3) and Zac-Efron (Type 9) both dismiss the Type-4 counter-case with the same construction:

- Alex-Warren: _"The 4 preserves the wound; Warren keeps trying to convert it into reassurance and resolution."_
- Zac-Efron: _"The 4 romanticizes the wound and wants to be seen as special, while Efron minimizes himself..."_

**Contrast-pair engine ("not X, it was Y")** — confirmed present but the pipeline's own `FORMULA FINGERPRINT LEDGER` is already tracking and capping it per-draft (e.g., Steve-Martin's editor pass explicitly cut it from ~8 uses down to 3 "load-bearing" ones, logged in the file's own revision history). This is the one tic category where self-correction is visibly working — the count in the table above (7 "not…it was" + 2 "wasn't…It was" = 9 total across 17 drafts) is post-editing, i.e., the _residual_ after active suppression.

---

## 3. Structural furniture: TL;DR label reuse (the most damning single finding)

Extracted verbatim `<li><b>Label:</b>` text from every TL;DR accordion in the 17 drafts:

| draft            | bullet 1                          | bullet 2                           | bullet 3                             | bullet 4                                 | bullet 5                       |
| ---------------- | --------------------------------- | ---------------------------------- | ------------------------------------ | ---------------------------------------- | ------------------------------ |
| Jeff-Goldblum    | **The type:**                     | The contradiction:                 | The engine:                          | The wound:                               | The turn:                      |
| Alex-Warren      | **The type:**                     | The contradiction:                 | The childhood engine:                | The tell:                                | The growth edge:               |
| Mira-Murati      | **The type:**                     | The core tension:                  | The core fear, in her own words:     | The tell:                                | The turn:                      |
| John-Goodman     | **The type:**                     | The childhood:                     | The pattern:                         | The cost:                                | The turn:                      |
| Nick-Offerman    | **The type:**                     | The pattern:                       | The contradiction:                   | The ethic:                               | —                              |
| Olivia-Wilde     | **The type:**                     | The core tension:                  | The childhood thread:                | Under pressure:                          | The unresolved part:           |
| Kurt-Russell     | **The type:**                     | "I don't work":                    | The merge:                           | The 8 wing:                              | The cost:                      |
| Tobey-Maguire    | Core type:                        | The childhood:                     | The loyalty:                         | The two faces:                           | —                              |
| Jim-Carrey       | Core type:                        | The childhood:                     | The pattern:                         | The turn:                                | The line:                      |
| Jason-Sudeikis   | The Peacekeeper:                  | The straight man by choice:        | Kindness as a system:                | The buried anger:                        | The cost:                      |
| Susan-Sarandon   | The wound that became the engine: | The pattern, repeated for decades: | The childhood tell:                  | The part the folders miss:               | —                              |
| Matt-Smith       | Type 7, the Enthusiast.           | The wound came early.              | He collects exits.                   | He shrugs off disaster.                  | The tell:                      |
| Steve-Martin     | The engineered wild man:          | Mastery, then exit:                | The withheld approval:               | Feeling, let out late:                   | —                              |
| Zac-Efron        | Type 9, the Peacemaker:           | The body he fled:                  | The engineer's son on a stage:       | The line that gives him away:            | The way back:                  |
| Rose-Blackpink   | Type 4, the Individualist:        | vampirehollie:                     | The plane at fifteen:                | "Number One Girl":                       | The APT. paradox:              |
| Brendan-Fraser   | The core skill is self-erasure:   | Harm goes inward, not outward:     | The disappearance was the diagnosis: | The comeback required the hardest thing: | —                              |
| Hailee-Steinfeld | The Achiever's bill:              | Prepared past the point of need:   | The disappearing act:                | Stress looks like numbness:              | Security looks like belonging: |

**Verdict: verbatim label reuse is real and heavy, not a coincidence.**

- **"The type:"** used as the literal, unmodified first bullet in **7 of 17 drafts (41%)**: Jeff-Goldblum, Alex-Warren, Mira-Murati, John-Goodman, Nick-Offerman, Olivia-Wilde, Kurt-Russell.
- **"Core type:"** (functionally identical variant) in 2 more (Tobey-Maguire, Jim-Carrey) → **9/17 (53%) share the same opening-bullet label.**
- **"The tell:"** reused verbatim in 3 drafts (Alex-Warren, Mira-Murati, Matt-Smith) plus a near-variant "The childhood tell:" in Susan-Sarandon.
- **"The turn:"** reused verbatim in 3 drafts (Jeff-Goldblum, Mira-Murati, John-Goodman).
- **"The cost:"** reused verbatim in 3 drafts (John-Goodman, Jason-Sudeikis, Kurt-Russell).
- **"The pattern:"** reused verbatim in 3 drafts (Jim-Carrey, John-Goodman, Nick-Offerman).
- **"The contradiction:"** reused verbatim in 2 (Jeff-Goldblum, Nick-Offerman); **"The core tension:"** in 2 (Mira-Murati, Olivia-Wilde) — functionally the same slot.
- **A fixed 4–5-slot Mad Libs skeleton — [Type] → [Childhood/Contradiction] → [Pattern/Engine/Tell] → [Turn/Cost/Growth] — accounts for at least 10 of the 17 TL;DRs** (Jeff-Goldblum, Alex-Warren, Mira-Murati, John-Goodman, Nick-Offerman, Olivia-Wilde, Kurt-Russell, Tobey-Maguire, Jim-Carrey, Susan-Sarandon). Only 7 of 17 (Steve-Martin, Zac-Efron, Rose-Blackpink, Brendan-Fraser, Matt-Smith, Jason-Sudeikis, Hailee-Steinfeld) have fully person-specific labels with no generic slot word.
- **The pipeline's own audit trail catches this in real time**: Zac-Efron's `REVISION PASS NOTES` states verbatim: _"De-formula'd the TL;DR: replaced the generic type/contradiction/childhood-engine/tell/growth-edge skeleton (reused near-verbatim from Alex-Warren) with Efron-specific labels."_ This is a direct written admission, inside the repo, that one draft's TL;DR was caught copying another's skeleton — and the fact that 9 _other_ drafts in the same 17-file cohort still carry that exact skeleton means the fix is applied per-draft, reactively, not structurally.

**Closing-returns-to-opening check (6 newest: Steve-Martin, Tobey-Maguire, Jeff-Goldblum, Rose-Blackpink, Zac-Efron, Alex-Warren) — 6/6 (100%) confirmed:**

- Steve-Martin: opens on the arena/arrow-through-the-head; closes _"But go back to the arena. Twenty thousand people, the arrow through the head..."_
- Tobey-Maguire: opens at the poker table ("bark like a seal" scene); closes _"He plays cards now. He owns the table."_
- Jeff-Goldblum: opens with a boy writing a secret on fogged shower glass, then wiping it away; closes _"The steam is gone. The reflex that wiped it away runs the show... exactly what to keep behind the glass."_
- Rose-Blackpink: opens on the secret "vampirehollie" second self; closes on _"whether the real one... is the same person they keep saying they love."_
- Zac-Efron: opens on the engineered Baywatch body; closes _"in a body he chose this time, still listening for the answer."_
- Alex-Warren: opens on "ten non-consecutive weeks at No. 1"; closes _"The scoreboard can hit ten weeks at No. 1... none of it reaches the seat he is really performing for."_
  This is clearly a codified rubric item (the ledgers literally log "Ending swap-test: pass"), not an accident — but it means the corpus has a second universal template (open-on-image → diagnose → close-on-same-image) layered on top of the TL;DR skeleton and the identical H2 ("What Is X's Personality Type?").

---

## 4. Same-type clustering

Frontmatter `enneagram:` extracted from all 17:

| Type  | Count       | Drafts                                                                                            |
| ----- | ----------- | ------------------------------------------------------------------------------------------------- |
| **9** | **7 (41%)** | Zac-Efron, Mira-Murati, Brendan-Fraser, John-Goodman, Nick-Offerman, Jason-Sudeikis, Kurt-Russell |
| 7     | 3           | Jeff-Goldblum, Jim-Carrey, Matt-Smith                                                             |
| 3     | 3           | Alex-Warren, Olivia-Wilde, Hailee-Steinfeld                                                       |
| 5     | 1           | Steve-Martin                                                                                      |
| 6     | 1           | Tobey-Maguire                                                                                     |
| 4     | 1           | Rose-Blackpink                                                                                    |
| 8     | 1           | Susan-Sarandon                                                                                    |

**7 of the last 17 full-pipeline profiles (41%) are the identical Enneagram type (9).** This is the single biggest clustering risk in the recent cohort — nearly every other subject picked for the pipeline recently reads as a Peacemaker.

### Type 9 cluster (n=7) — persona/archetype vocabulary

| draft          | persona_title                          | description opening                                                                                             |
| -------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Zac-Efron      | "Hollywood's **Gentle Escape Artist**" | "Everyone envies the Baywatch body... fled Hollywood to **escape** it. Why Zac Efron keeps **disappearing**..." |
| Mira-Murati    | "AI's Center of Gravity"               | "Why did the calmest woman in AI dodge the one question..."                                                     |
| Brendan-Fraser | "The Giant Who **Went Quiet**"         | "Why did Brendan Fraser **vanish** from Hollywood at the peak of his fame?"                                     |
| John-Goodman   | "Hollywood's **Vanishing** Everyman"   | "...spent 30 years drinking to **quiet** a self he could not bear to face."                                     |
| Nick-Offerman  | "Hollywood's Tender Woodsman"          | "Why does the man who played TV's gruffest stoic cry so easily?"                                                |
| Jason-Sudeikis | "Comedy's **Reluctant Peacekeeper**"   | "Why does the kindest man on television keep his own anger so hidden?"                                          |
| Kurt-Russell   | "Hollywood's Unbothered Holdout"       | "...refuse to call acting work, and never marry Goldie Hawn?"                                                   |

**6 of 7 Type-9 descriptions open with an identical "Why does/did [subject] [surprising behavior]?" contradiction-hook** — but this pattern is actually corpus-wide (13 of 17 recent drafts regardless of type use it), so it's a general house formula, not type-specific.

**What is type-specific**: the disappear/vanish/escape/quiet vocabulary cluster is heavily concentrated in Type 9 frontmatter — "Vanishing," "Went Quiet," "Escape Artist," "vanish," "disappearing," "quiet" appear in 5 of 7 Type-9 persona_titles/descriptions. Thematically defensible (Type 9's core fear is fragmentation/loss of self), but it means five different celebrities are being sold with near-synonymous elevator pitches.

**"Escape Artist" reused as a verbatim persona-title noun phrase in 3 of 17 drafts, across two different Enneagram types**: Zac-Efron ("Hollywood's Gentle **Escape Artist**," Type 9), Jim-Carrey ("Comedy's **Escape Artist**," Type 7), Matt-Smith ("TV's Restless **Escape Artist**," Type 7). This is the clearest single case of the exact same epithet being assigned to three different people.

### Type 9 cluster — H2 heading overlap

All 7 open with the identical required H2 (`## What Is/is [Name]'s Personality Type?`). Beyond that required heading, thematic overlap is heavy:

- "disappear(s)": John-Goodman _"Why John Goodman Disappears Into Every Cast"_, Nick-Offerman _"How a Minooka farm boy learned to disappear into the work"_.
- "apart": Mira-Murati _"How a Country That Fell Apart Built the Calmest Woman in AI"_, Brendan-Fraser _"How Brendan Fraser Falls Apart, and How He Comes Back"_, Nick-Offerman _"...a marriage built to never be apart"_.
- Drinking-to-forget/numb headings independently in two drafts: John-Goodman _"What John Goodman Was Drinking to Forget"_ / Zac-Efron _"The years Zac Efron drank to disappear"_ (adjacent section: "Why Zac Efron hated the Baywatch body").

### Type 9 cluster — closing-paragraph similarity (most similar pairs, quoted)

Every one of the 7 Type-9 closings resolves on the same beat: **quiet self-erasure almost-but-not-quite giving way to self-possession**, phrased in hushed, restraint-coded diction ("quiet," "quietly," "still," "without ever raising his voice"):

- **John-Goodman** vs **Nick-Offerman** (closest pair): Goodman — _"...only now learning that he was always allowed to live in one [a home]."_ Offerman — _"...the separate, wanting, oversized self goes quiet and there is only the work, the grain, and a man who would rather build you a table than tell you how good he is at building it."_ Both closings are explicitly "a man who spent decades erasing himself finally permits a small, private self-acknowledgment" — same shape, same restraint-as-virtue moral.
- **Kurt-Russell** vs **Jason-Sudeikis**: Russell — _"...to want the work and not the credit, the love and not the ownership, and to hold that line for sixty years without ever raising his voice about it."_ Sudeikis — _"...the thing about the bad play is that it remembers you even when you have decided to forget it."_ Both end on quiet, permanent self-denial as the character's defining, admirable trait, framed as something the type "chooses" rather than suffers.
- **Zac-Efron**: _"...still listening for the answer."_ **Brendan-Fraser**: _"...he finally let a roomful of strangers be his."_ Both end on a fragile, first-time act of being truly seen/known, immediately hedged (Efron: "still listening," not "found"; Fraser: "for six minutes," not permanently).

Seven distinct celebrities, seven different life stories — and every single closing paragraph resolves on the identical emotional note (restrained self-erasure edging toward, but not fully reaching, self-possession), in near-identical hushed diction. This is the strongest evidence in the corpus that Enneagram type is driving prose outcome more than the individual biography is.

---

## 5. Corpus-wide phrase concentration by type (Mad Libs risk, all 469 files)

Frontmatter `enneagram:` parsed for 457 of 469 files (12 had no parseable field). File counts per type: T1=30, T2=27, T3=85, T4=64, T5=38, T6=48, T7=66, T8=47, T9=52.

**% of that type's files containing the phrase** (top 4 phrases by corpus-wide frequency):

| phrase          | T1  | T2  | T3      | T4      | T5  | T6  | T7  | T8  | T9      |
| --------------- | --- | --- | ------- | ------- | --- | --- | --- | --- | ------- |
| "core wound"    | 17% | 37% | 20%     | **44%** | 5%  | 6%  | 6%  | 9%  | 10%     |
| "the mask"      | 3%  | 11% | **20%** | **20%** | 5%  | 15% | 11% | 2%  | 8%      |
| "The tell"      | 17% | 11% | 18%     | 23%     | 8%  | 17% | 14% | 28% | **29%** |
| "the machinery" | 10% | 4%  | 7%      | 8%      | 13% | 4%  | 9%  | 2%  | 6%      |

**"core wound" is a Type-4 tic, full stop**: it appears in **44% of all Type-4 drafts** (28 of 64) vs. 5–6% of Type-5 and Type-6 drafts — an 8–9× concentration. Thematically explicable (Type 4 = "the wound" archetype) but it means nearly half of all Individualist profiles in the corpus reach for the identical noun phrase.

**"the mask" concentrates in Type 3 and Type 4 alike** (20% each) vs. 2–5% in Type 1, Type 5, Type 8 — a 4–10× gap, confirming "mask" is reserved almost exclusively for the image-conscious/identity-focused types.

**"The tell" is the one phrase that is NOT type-concentrated** — it ranges 8–29% across all 9 types with no sharp cutoff, meaning it's a genuine house-wide rhetorical habit rather than a type-specific Mad Libs slot (consistent with §1/§2 findings above).

---

## Files/paths referenced

- Draft corpus: `/Users/djwayne/9takes/src/blog/people/drafts/*.md` (469 files)
- Focus-set bodies (HTML comments stripped) used for tic counting: `/private/tmp/claude-501/-Users-djwayne-9takes/ace42d2a-2cf9-416d-9700-8a51e7e5b754/scratchpad/bodies/*.body.md`
- Scripts used: `tic_count.py`, `tic_context.py` in the same scratchpad directory
