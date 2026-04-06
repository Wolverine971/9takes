<!-- docs/content-analysis/text-wall-audit-2026-04-06.md -->

# Text Wall Audit — 2026-04-06

Blogs with consecutive large paragraphs (500+ chars each) that create "text walls" — dense blocks with no visual break (heading, list, image, callout, blockquote) between them. Paragraphs with zero inline formatting (no bold, italic, or links) are marked **PLAIN WALL** — these are the worst for readability.

**Completed:** `epstein-psychology-part-1.md` — fixed all 6 zones, now passes cleanly.

---

## Priority 1: High Severity (score 15+)

These files have multiple problem zones or long streaks of consecutive big paragraphs. Fix first.

### 1. `community/societal-ticking-time-bombs.md`

- **Score: 58.4** | 6 zones | Worst streak: 7 paragraphs
- 27 big paragraphs total, 5 plain walls

| Zone | Section                                              | Paras | Plain | Fix Suggestion                                                                                                                                                            |
| ---- | ---------------------------------------------------- | ----- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | "Therapy Actually Works. And They Buried It." (L237) | 2     | 1     | Add bold/italic to the plain P2 about emotional literacy                                                                                                                  |
| 2    | "The Psychology of the Rigged Game" (L269)           | 2     | 0     | Minor — both have formatting. Could add a subheading between them                                                                                                         |
| 3    | **"Everyone Says We're Getting Dumber" (L315)**      | **7** | 0     | **Worst zone.** 7 big paragraphs back-to-back (~5,500 chars). All have formatting but need structural breaks — add 2-3 subheadings or pull out a key stat as a blockquote |
| 4    | "Are People Actually Getting Dumber?" (L373)         | 3     | 0     | Add a subheading between the brain science paragraphs                                                                                                                     |
| 5    | "SSRIs: Learn to Grapple" (L411)                     | 2     | 0     | Minor — both have links. Could pull a key quote into blockquote                                                                                                           |
| 6    | "So What Actually Changes?" (L459)                   | 3     | 1     | Add emphasis to the plain P3 (appears to be editorial notes — may need removal)                                                                                           |

---

### 2. `pop-culture/podcaster-personality-map.md`

- **Score: 37.4** | 5 zones | Worst streak: 4 paragraphs
- 20 big paragraphs total, 4 plain walls

| Zone | Section                                          | Paras | Plain | Fix Suggestion                                                                                                                                     |
| ---- | ------------------------------------------------ | ----- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | "The Experience Collectors: Type 7s" (L130)      | 4     | 0     | Each para starts with a bolded name — reads like a list. Could convert to an actual subheading per person or add a horizontal rule between entries |
| 2    | "The Optimizer: Type 3" (L153)                   | 2     | 0     | Minor — both have italic                                                                                                                           |
| 3    | "The My First Million Dynamic" (L185)            | 2     | 1     | Add emphasis to the plain P2 about Episode 619 conflict                                                                                            |
| 4    | "The Missing Types: Who Doesn't Podcast?" (L227) | 4     | 0     | Each para starts with bolded type name — similar to Zone 1. Could add subheadings per type                                                         |
| 5    | "When the Heat Comes: Crisis Response" (L241)    | 4     | 0     | Each para starts with bolded type name. Could add subheadings per type                                                                             |

---

### 3. `pop-culture/ghislaine-maxwell-psychology.md`

- **Score: 30.0** | 6 zones | Worst streak: 3 paragraphs | **50% plain walls**
- 23 big paragraphs total, 10 plain walls — high ratio of unformatted text

| Zone | Section                                 | Paras | Plain | Fix Suggestion                                                                                                            |
| ---- | --------------------------------------- | ----- | ----- | ------------------------------------------------------------------------------------------------------------------------- |
| 1    | "The Hostage Princess" (L116)           | 3     | 1     | Add emphasis to the plain P2 about Oxford classmate observation                                                           |
| 2    | "The Family Business: Espionage" (L128) | 2     | 0     | Minor — both have bold/links                                                                                              |
| 3    | "The Symbiotic Arrangement" (L170)      | 2     | 1     | Add bold/italic to the plain P1 about "desperate to marry"                                                                |
| 4    | **"The New York Reinvention" (L180)**   | 2     | **2** | **Both paragraphs are plain walls.** Add emphasis and consider a subheading between the narrative and the Type 6 analysis |
| 5    | "The Courtroom Performance" (L262)      | 3     | 1     | Add emphasis to the plain P2 about eroding performance                                                                    |
| 6    | **"Psychology of Enablers" (L315)**     | 2     | **2** | **Both paragraphs are plain walls.** Add bold key phrases and consider a blockquote for the moral conclusion              |

---

### 4. `pop-culture/breaking-points-enneagram-analysis.md`

- **Score: 22.9** | 4 zones | Worst streak: 3 paragraphs
- 12 big paragraphs total, 3 plain walls

| Zone | Section                                           | Paras | Plain | Fix Suggestion                                                       |
| ---- | ------------------------------------------------- | ----- | ----- | -------------------------------------------------------------------- |
| 1    | "Krystal Ball: Making of a Moral Worldview" (L52) | 2     | 1     | Add emphasis to the plain P1 (biographical intro)                    |
| 2    | "Where the Conviction Comes From" (L64)           | 3     | 0     | All have italic. Add a subheading between the 2nd and 3rd paragraphs |
| 3    | "Saagar Enjeti: Policy Wonk" (L76)                | 3     | 1     | Add emphasis to the plain P1 (biographical intro)                    |
| 4    | "How Intellectual Hunger Becomes..." (L88)        | 3     | 1     | Add emphasis to the plain P1                                         |

---

### 5. `pop-culture/tech-titans-leadership-styles.md`

- **Score: 22.3** | 2 zones | Worst streak: 5 paragraphs
- 15 big paragraphs total, 7 plain walls

| Zone | Section                                      | Paras | Plain | Fix Suggestion                                                                                                                           |
| ---- | -------------------------------------------- | ----- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | **"Five 5s, Five Leadership Styles" (L177)** | **5** | 0     | Each para starts with a bolded name/link — reads like entries. Consider adding subheadings per leader (#### Musk, #### Zuckerberg, etc.) |
| 2    | "The Types That Are Missing" (L319)          | 3     | 1     | Add emphasis to the plain P3 about personality monoculture                                                                               |

---

### 6. `pop-culture/tech-titans-ai-wars.md`

- **Score: 19.8** | 2 zones | Worst streak: 4 paragraphs | **50% plain walls**
- 11 big paragraphs total, 8 plain walls

| Zone | Section                                         | Paras | Plain | Fix Suggestion                                                                                                                                              |
| ---- | ----------------------------------------------- | ----- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | **"Why Two Type 5s Look Nothing Alike" (L170)** | 2     | **2** | **Both paragraphs are plain walls** comparing Amodei and Musk. Add bold for names, italic for key contrasts, or convert to a side-by-side comparison format |
| 2    | "The Types Missing From the Table" (L290)       | 4     | 1     | Add emphasis to the plain P1. The other 3 have bold — could add subheadings per hypothetical company type                                                   |

---

### 7. `enneagram/how-type-8-challengers-actually-succeed.md`

- **Score: 19.3** | 4 zones | Worst streak: 3 paragraphs
- 15 big paragraphs total, 3 plain walls

| Zone | Section                                    | Paras | Plain | Fix Suggestion                                                   |
| ---- | ------------------------------------------ | ----- | ----- | ---------------------------------------------------------------- |
| 1    | "Pattern 1: Right Vehicle" (L98)           | 2     | 0     | Minor — both have links                                          |
| 2    | "Pattern 3: Made Work Visible" (L152)      | 2     | 0     | Minor — both have bold/links                                     |
| 3    | "Pattern 4: Connected to a Mission" (L174) | 3     | 0     | All have bold/links. Could add a transition subheading           |
| 4    | "Survivorship Bias Warning" (L238)         | 3     | 1     | Add emphasis to the plain P3 about "you don't have to be famous" |

---

### 8. `pop-culture/epstein-psychology-part-2.md`

- **Score: 18.0** | 3 zones | Worst streak: 4 paragraphs | 0% plain walls
- 10 big paragraphs total, 0 plain walls — all have formatting, just need structural breaks

| Zone | Section                                        | Paras | Plain | Fix Suggestion                                                                                                                                  |
| ---- | ---------------------------------------------- | ----- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | "The Epstein Files: Pattern in Action" (L163)  | 2     | 0     | Minor — both have links                                                                                                                         |
| 2    | "Steve Tisch: What Service Looked Like" (L255) | 2     | 0     | Minor — both have bold/links                                                                                                                    |
| 3    | **"The Institutional Cover" (L271)**           | **4** | 0     | All have links, but 4 in a row (~3,400 chars). Add a subheading between the household manual paragraph and the Harvard/institutional paragraphs |

---

## Priority 2: Moderate Severity (score 3–15)

Single-zone issues or shorter streaks. Lower urgency but still worth fixing.

### 9. `pop-culture/hollywood-heartthrobs-enneagram-analysis.md`

- **Score: 11.4** | 4 zones | Worst streak: 2 paragraphs | 25% plain
- Fix: Add bold/italic emphasis to the 2 plain wall paragraphs (Pascal's counterphobic expression, Chalamet's ambition)

### 10. `pop-culture/incel-exit-post.md`

- **Score: 7.8** | 1 zone | 3 paragraphs | 1 plain
- Section: "The Original Post" (L13) — this is a quoted personal story so heavier formatting may feel unnatural. Add minimal emphasis to the plain P1 opening.

### 11. `pop-culture/podcast-bros-enneagram-analysis.md`

- **Score: 7.4** | 2 zones | Worst streak: 3 | 0% plain
- Zone 1 "Act II: The Network Forms" has 3 paragraphs each starting with a bolded name — could add subheadings per person
- Zone 2 "The Trust Cycle" has 2 paragraphs with bold — minor

### 12. `enneagram/enneagram-vs-personality-frameworks-comparison.md`

- **Score: 6.9** | 2 zones | Worst streak: 3 | 0% plain
- Both zones have bold/italic/links throughout — reads like evidence lists. Could convert to actual bullet lists for scannability.

### 13. `enneagram/mental-health/enneagram-anxiety-complete-guide.md`

- **Score: 5.1** | 1 zone | 3 paragraphs | 0% plain
- Section: "FAQs" — three long FAQ answers back-to-back, all with bold question leads. Could add horizontal rules or `<details>` accordions between FAQs.

### 14. `pop-culture/incel-blackpill-radicalization-enneagram.md`

- **Score: 5.1** | 1 zone | 2 paragraphs | **100% plain**
- Section: "The Hardest Case No One Addresses" (L278) — both paragraphs are completely unformatted. Add bold key phrases and italic for emphasis.

### 15. `community/software-and-hardware-of-the-mind.md`

- **Score: 4.7** | 2 zones | Worst streak: 2 | 0% plain
- Both zones have formatting — minor issues. Could add subheadings between the personality theory paragraphs and the advocates section.

### 16. `pop-culture/tech-titans-founders-vs-stewards.md`

- **Score: 4.6** | 1 zone | 2 paragraphs | **100% plain**
- Section: "The Diplomat's Rise" (L178) — both paragraphs about Pichai are completely unformatted. Add bold/italic emphasis.

### 17. `enneagram/mental-health/enneagram-crisis-management-guide.md`

- **Score: 4.3** | 1 zone | 2 paragraphs | **100% plain**
- Section: "How Crisis Manifests in Type 7s" (L803) — both paragraphs are plain walls. Add bold/italic emphasis.

### 18. `pop-culture/us-presidents-enneagram-analysis.md`

- **Score: 4.2** | 1 zone | 2 paragraphs | **100% plain**
- Section: "Abraham Lincoln and the Type 9" (L85) — both paragraphs are plain walls. Add bold/italic emphasis.

---

## Priority 3: Minor (score < 3.5)

These have a single zone of 2 paragraphs, both with some formatting. Lowest priority.

### 19. `pop-culture/parasocial-relationships-enneagram-type.md`

- **Score: 3.1** | 1 zone | 2 paragraphs | 1 plain
- Section: "Podcasting: The Most Intimate Medium" — add emphasis to the plain P1

### 20. `enneagram/enneagram-type-3.md`

- **Score: 2.2** | 1 zone | 2 paragraphs | 0 plain — minor

### 21. `enneagram/anxiety-and-enneagram-types-guide.md`

- **Score: 2.2** | 1 zone | 2 paragraphs | 0 plain — minor

### 22. `enneagram/enneagram-type-2.md`

- **Score: 2.1** | 1 zone | 2 paragraphs | 0 plain — minor

---

## Summary — Main Blog Sections

| Priority         | Files    | Key Pattern                                                                    |
| ---------------- | -------- | ------------------------------------------------------------------------------ |
| **P1: High**     | 8 files  | Multiple zones, long streaks (3-7 paras), need subheadings + structural breaks |
| **P2: Moderate** | 10 files | 1-2 zones, mostly need bold/italic added to plain walls                        |
| **P3: Minor**    | 4 files  | Single zone, 2 paragraphs, already have some formatting                        |

**P1 Status: All 8 files FIXED.**

---

## People Drafts (`src/blog/people/drafts/`)

**291 files scanned. 190 (65%) clean. 101 (35%) have issues.**

### People Drafts — Severe (score 15+): 14 files

_Note: `david-perrel-thiel-essay.md`, `John-Coogan.md`, and `Clavicular.md` are essays/non-standard formats, not typical people profiles._

| #   | File                          | Score | Zones | Worst Streak | Plain % |
| --- | ----------------------------- | ----- | ----- | ------------ | ------- |
| 1   | `david-perrel-thiel-essay.md` | 177.4 | 15    | 5            | 100%    |
| 2   | `John-Coogan.md`              | 78.1  | 6     | 5            | 77%     |
| 3   | `Clavicular.md`               | 59.7  | 5     | 5            | 86%     |
| 4   | `Tim-Ferriss.md`              | 36.5  | 5     | 5            | 21%     |
| 5   | `JD-Vance.md`                 | 35.6  | 3     | 5            | 77%     |
| 6   | `Peter-Thiel.md`              | 35.5  | 3     | 6            | 18%     |
| 7   | `Sundar-Pichai.md`            | 23.8  | 3     | 3            | 87%     |
| 8   | `Zohran-Mamdani.md`           | 22.8  | 1     | 5            | 60%     |
| 9   | `Andrew-Tate.md`              | 17.8  | 1     | 4            | 100%    |
| 10  | `Sam-Altman.md`               | 17.2  | 3     | 4            | 0%      |
| 11  | `Lana-Rhoades.md`             | 16.0  | 3     | 3            | 71%     |
| 12  | `Tara-Yummy.md`               | 15.6  | 2     | 3            | 60%     |
| 13  | `Noam-Chomsky.md`             | 15.6  | 3     | 3            | 71%     |
| 14  | `Trisha-Paytas.md`            | 15.1  | 3     | 3            | 28%     |

### People Drafts — Moderate (score 5-15): 41 files

| #   | File                      | Score | Zones | Worst Streak | Plain % |
| --- | ------------------------- | ----- | ----- | ------------ | ------- |
| 1   | `Tyler-Cowen.md`          | 13.9  | 2     | 3            | 80%     |
| 2   | `Mikey-Madison.md`        | 13.8  | 1     | 4            | 50%     |
| 3   | `Chamath-Palihapitiya.md` | 13.3  | 3     | 2            | 83%     |
| 4   | `Robert-Greene.md`        | 12.9  | 1     | 4            | 50%     |
| 5   | `Margot-Robbie.md`        | 12.2  | 2     | 4            | 0%      |
| 6   | `Jacob-Elordi.md`         | 12.2  | 3     | 2            | 50%     |
| 7   | `Kylie-Jenner.md`         | 12.1  | 4     | 3            | 0%      |
| 8   | `Matt-Damon.md`           | 11.7  | 1     | 3            | 100%    |
| 9   | `Post-Malone.md`          | 10.3  | 2     | 2            | 100%    |
| 10  | `Howard-Stern.md`         | 10.0  | 2     | 2            | 75%     |
| 11  | `Gavin-Newsom.md`         | 9.6   | 1     | 3            | 100%    |
| 12  | `Leonardo-da-Vinci.md`    | 9.6   | 3     | 2            | 33%     |
| 13  | `Kris-Jenner.md`          | 9.6   | 2     | 2            | 100%    |
| 14  | `Krystal-Ball.md`         | 9.5   | 2     | 3            | 40%     |
| 15  | `James-Dyson.md`          | 9.5   | 2     | 2            | 100%    |
| 16  | `Gigi-Hadid.md`           | 8.9   | 4     | 2            | 0%      |
| 17  | `Adam-Sandler.md`         | 8.8   | 1     | 3            | 66%     |
| 18  | `Patrick-Bet-David.md`    | 8.1   | 2     | 2            | 75%     |
| 19  | `Kate-Hudson.md`          | 7.7   | 2     | 2            | 50%     |
| 20  | `Frida-Kahlo.md`          | 7.7   | 1     | 3            | 33%     |
| 21  | `Reid-Hoffman.md`         | 7.7   | 2     | 2            | 75%     |
| 22  | `Jordan-Peterson.md`      | 7.6   | 2     | 2            | 50%     |
| 23  | `Satya-Nadella.md`        | 7.3   | 1     | 3            | 33%     |
| 24  | `Ben-Affleck.md`          | 7.1   | 1     | 3            | 33%     |
| 25  | `Khloe-Kardashian.md`     | 7.0   | 2     | 2            | 50%     |
| 26  | `Conan-OBrien.md`         | 6.7   | 2     | 2            | 25%     |
| 27  | `Caleb-Hearon.md`         | 6.6   | 1     | 2            | 100%    |
| 28  | `Jack-Black.md`           | 6.6   | 1     | 3            | 33%     |
| 29  | `Jake-Gyllenhaal.md`      | 6.5   | 1     | 3            | 33%     |
| 30  | `Elon-Musk.md`            | 6.3   | 2     | 2            | 25%     |
| 31  | `Alex-Hormozi.md`         | 6.0   | 1     | 2            | 100%    |
| 32  | `Pedro-Pascal.md`         | 5.7   | 1     | 2            | 100%    |
| 33  | `Jared-Leto.md`           | 5.5   | 2     | 2            | 25%     |
| 34  | `Tim-Robinson.md`         | 5.3   | 1     | 2            | 100%    |
| 35  | `Oscar-Isaac.md`          | 5.2   | 1     | 2            | 100%    |
| 36  | `Marc-Andreessen.md`      | 5.2   | 1     | 2            | 100%    |
| 37  | `Jordi-Hays.md`           | 5.2   | 1     | 2            | 100%    |
| 38  | `Hasan-Piker.md`          | 5.1   | 1     | 2            | 100%    |
| 39  | `Alex-Cooper.md`          | 5.1   | 1     | 2            | 100%    |
| 40  | `Charli-xcx.md`           | 5.1   | 1     | 2            | 100%    |
| 41  | `Katy-Perry.md`           | 5.0   | 1     | 2            | 100%    |

### People Drafts — Mild (score < 5): 46 files

Single zone, 2 paragraphs each. Lowest priority. Includes: `Steve-Jobs.md`, `Joe-Biden.md`, `Leila-Hormozi.md`, `Garry-Tan.md`, `James-Charles.md`, `Martin-Luther-King-Jr.md`, `Glen-Powell.md`, `Logan-Paul.md`, `Billie-Eilish.md`, `Ali-Abdaal.md`, `Chris-Hemsworth.md`, `Simon-Sinek.md`, `Jack-Dorsey.md`, `Alexandria-Ocasio-Cortez.md`, `Jelly-Roll.md`, and 31 others.
