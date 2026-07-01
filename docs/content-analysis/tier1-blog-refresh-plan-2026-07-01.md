<!-- docs/content-analysis/tier1-blog-refresh-plan-2026-07-01.md -->

# Tier 1 Personality-Analysis Refresh — Plan & Analysis

**Date:** 2026-07-01
**Owner:** DJ (via Claude Code ultracode workflow)
**Scope:** Rebuild the 6 highest-priority outdated `/personality-analysis` blogs to current 9takes standard.

---

## 1. How the priority list was built

Source of truth: `src/lib/components/molecules/famousTypes.ts` (auto-generated index of every published
people blog). Each entry carries `lastmod` and `contentGrade`. I treated the file as an index and scored on
two axes:

1. **Staleness** — `lastmod` age **and** whether the blog ever received a `contentGrade`. A `null` grade
   means it predates the current quality pipeline (v2 rubric), so it never passed the modern discoverability
   / evidence / emotional-layer bars.
2. **Current relevance / virality** — my judgment of the person's live search demand and cultural moment
   (aligned with the finding in `project_personality_analysis_traffic_drivers`: search demand + recency drive
   traffic, grade does not).

**Findings across 372 published blogs:** 27 have **no content grade at all**, and 3 are genuinely ancient
(2023). Everything dated 2026-01 onward already carries an 8.0–9.7 grade and is <6 months old, so it is _not_
outdated. The real problem set is the ungraded, thin, pre-pipeline blogs — crossed with who is hot right now.

---

## 2. The ranked list (full context in chat)

### 🔴 Tier 1 — update now (this plan)

| #   | Person              | slug                  | Type | live `lastmod` | live size | Why now                                                                                                                               |
| --- | ------------------- | --------------------- | ---- | -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Kendrick Lamar      | `kendrick-lamar`      | 4    | 2025-12        | 1,430 w   | **Peak moment.** Super Bowl LIX halftime, _GNX_, "Not Like Us" 5-Grammy sweep, Drake beef. Live blog predates ALL of it. Highest ROI. |
| 2   | Friedrich Nietzsche | `friedrich-nietzsche` | 5    | 2023-07        | 1,054 w   | Oldest + thinnest in the library. Philosophy = perennial traffic.                                                                     |
| 3   | Bob Dylan           | `bob-dylan`           | 4    | 2025-04        | 2,258 w   | _A Complete Unknown_ biopic surge; thin blog not capitalizing.                                                                        |
| 4   | Nikola Tesla        | `nikola-tesla`        | 4    | 2025-12        | 1,396 w   | Massive perennial search; ungraded, thin.                                                                                             |
| 5   | Nicole Kidman       | `nicole-kidman`       | 4    | 2025-06        | 2,132 w   | Very active (_Babygirl_, _Nine Perfect Strangers_ S2); ungraded.                                                                      |
| 6   | Tom Hardy           | `tom-hardy`           | 8    | 2026-01        | 3,404 w   | Already a strong modern draft but **never graded**. Finish + grade only.                                                              |

### 🟠 Tier 2 (next) — evergreen legends, ungraded

ruth-bader-ginsburg (2023), charlie-puth (2023), prince, elton-john, tom-hanks, morgan-freeman,
joaquin-phoenix, zayn-malik, agatha-christie.

### 🟡 Tier 3 — old but cooled

ellen-degeneres, queen-elizabeth-ii, jimmy-carter, nancy-reagan, mr-rogers, demi-lovato, jimmy-fallon.

---

## 3. Architecture reality

`/personality-analysis` is **DB-driven** (`blogs_famous_people`), not MDsvex. The 5 oldest Tier 1 blogs had
**no local draft file** — they live only as production DB rows. The entire `blog_content_*` pipeline operates
on draft files in `src/blog/people/drafts/`.

**Phase A (done):** exported the 5 live rows from the DB into draft skeletons
(`Kendrick-Lamar.md`, `Friedrich-Nietzsche.md`, `Bob-Dylan.md`, `Nikola-Tesla.md`, `Nicole-Kidman.md`),
preserving slug, `loc`, Enneagram type, and existing entity metadata. Tom Hardy already had a draft.
Baseline lint on the skeletons: 11 FAILs each (em-dashes, zero ledgers, no FAQs) — confirms rebuild need.

---

## 4. Execution pipeline (per person, run as a Workflow)

Each blog flows independently through 4 stages (`pipeline`, no barriers). Every stage reads the relevant
`blog_content_*` command and enforces its rules.

| Stage          | Command(s) applied                                                                                   | What happens                                                                                                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. **Rebuild** | `blog_content_creator_people_v2` (→ _Update Existing Draft_ workflow)                                | Fresh web research on 2024–2026 developments; rewrite/expand body to standard (~2,800–3,400 w); build the 4 hard-gate ledgers, the Enneagram rabbit hole, furniture. Tom Hardy = light current-events refresh only. Preserve type/slug/loc. |
| 2. **Review**  | `blog_content_fresh_eyes_people` → `blog_content_second_pass_people`                                 | Fresh-eyes reader-response notes, then substantive second-pass revision (targeted research, cut duplication, sharpen contradictions + emotional layer).                                                                                     |
| 3. **Polish**  | `blog_content_editor_pass_people` + `9takes-editorial-standards`                                     | De-AI line edit; break formula fingerprint; **run `./scripts/blog-lint.sh` until 0 FAIL**.                                                                                                                                                  |
| 4. **Grade**   | `blog_content_frontmatter_enrich_people` → `grade_blog` → `blog_content_revision_pass_people` (loop) | Enrich frontmatter (faqs, keywords, same_as, meta lengths); grade on v2 rubric; if `overall < 8.5` or `discoverability < 7`, revise + re-grade (≤2 loops). Write `content_quality` with `rubric_version: 2`.                                |

### Publish gate (v2)

A blog is publish-ready only when: `overall ≥ 8.5`, `rubric_version: 2`, `discoverability ≥ 7`, lint clean,
both images present (all 6 already have images).

### Deliberate stop before publish

Publishing overwrites **live, indexed SEO pages** — outward-facing and hard to reverse. The workflow takes
drafts to production-ready + graded and **stops**. DJ reviews, then runs the publish step per blog:

```bash
node scripts/personBlogParser.js [Person-Name] --publish
```

(Or `/blog_content_publish_people [Person-Name]`.) `lastmod` is DJ-managed and is not touched by the pipeline.

---

## 5. Guardrails

- Preserve each person's Enneagram **type**, **slug**, and **`loc`** (URL) — never re-type or re-slug a live
  SEO page unilaterally; flag if a type looks wrong instead.
- Other agents/DJ edit this repo in parallel — only the 6 target draft files are touched. No `git` resets, no
  `gen:all` (that runs at publish).
- Verify claims with real sourcing; the Evidence dimension is weighted highest.

---

## 6. Status log

- 2026-07-01 — Analysis complete; 5 skeletons exported from DB; plan written; workflow launched for all 6.
- 2026-07-01 — Workflow finished (24 agents). **All 6 drafts publish-ready**, verified independently
  (lint 0-fail, rubric v2, overall ≥8.5, discoverability ≥7). Awaiting DJ publish approval.

  | Person              | Overall     | Disc | Lint  |
  | ------------------- | ----------- | ---- | ----- |
  | Kendrick Lamar      | **9.0 (A)** | 9    | clean |
  | Nikola Tesla        | 8.9 (B+)    | 9    | clean |
  | Friedrich Nietzsche | 8.8 (B+)    | 9    | clean |
  | Nicole Kidman       | 8.8 (B+)    | 8    | clean |
  | Bob Dylan           | 8.7 (B+)    | 8.5  | clean |
  | Tom Hardy           | 8.5 (B+)    | 8    | clean |

  Benign warnings: `published:true` vs `production_pretext.status:draft` (resolves at publish);
  Tom-Hardy has 7 internal links (spec 2–5) — trim 2 before publish if desired. Optional lift to A:
  Nietzsche/Dylan/Tesla/Kidman are Evidence-limited (8–8.5); 1–2 more named-collaborator quotes each → ~9.0.

  Publish (per blog, on approval):

  ```bash
  node scripts/personBlogParser.js Kendrick-Lamar --publish
  node scripts/personBlogParser.js Friedrich-Nietzsche --publish
  node scripts/personBlogParser.js Bob-Dylan --publish
  node scripts/personBlogParser.js Nikola-Tesla --publish
  node scripts/personBlogParser.js Nicole-Kidman --publish
  node scripts/personBlogParser.js Tom-Hardy --publish
  ```

---

## 7. Tier 2 — completed 2026-07-01 (36-agent workflow)

All 9 evergreen ungraded legends rebuilt from thin DB-only content (RBG was 690 words) to publish-ready.
Verified independently: lint 0-fail, rubric v2, overall ≥8.5, discoverability ≥7. **Awaiting DJ publish.**

| Person              | Type | Overall  | Disc | Lint  |
| ------------------- | ---- | -------- | ---- | ----- |
| Ruth Bader Ginsburg | 1    | 8.9 (B+) | 9    | clean |
| Tom Hanks           | 6    | 8.9 (B+) | 8.5  | clean |
| Agatha Christie     | 5    | 8.9 (B+) | 8.5  | clean |
| Prince              | 4    | 8.8 (B+) | 8    | clean |
| Joaquin Phoenix     | 4    | 8.8 (B+) | 8.5  | clean |
| Charlie Puth        | 4    | 8.7 (B+) | 8.5  | clean |
| Morgan Freeman      | 1    | 8.7 (B+) | 8.5  | clean |
| Zayn Malik          | 4    | 8.7 (B+) | 8    | clean |
| Elton John          | 4    | 8.6 (B+) | 8.5  | clean |

Benign warning on all: `published:true` vs `production_pretext.status:draft` (resolves at publish).
No type-doubt flags. Optional lift-to-A: most are Evidence-capped at 8.5 (named sources not inline-linked);
one dated collaborator quote each → ~9.0.

Publish (per blog, on approval):

```bash
node scripts/personBlogParser.js Ruth-Bader-Ginsburg --publish
node scripts/personBlogParser.js Charlie-Puth --publish
node scripts/personBlogParser.js Prince --publish
node scripts/personBlogParser.js Elton-John --publish
node scripts/personBlogParser.js Tom-Hanks --publish
node scripts/personBlogParser.js Morgan-Freeman --publish
node scripts/personBlogParser.js Joaquin-Phoenix --publish
node scripts/personBlogParser.js Agatha-Christie --publish
node scripts/personBlogParser.js Zayn-Malik --publish
```

---

## 8. Tier 3 — completed 2026-07-01 (28-agent workflow)

All 7 legacy / cooled-demand figures rebuilt from thin DB-only content (Jimmy Carter was 798 words) to
publish-ready. For deceased figures the "current-tense anchor" became a present-day legacy stake. Verified
independently: lint 0-fail, rubric v2, overall ≥8.5, discoverability ≥7. **Awaiting DJ publish + lastmod bump.**

| Person             | Type | Overall  | Disc | Lint  |
| ------------------ | ---- | -------- | ---- | ----- |
| Ellen DeGeneres    | 6    | 8.9 (B+) | 8.5  | clean |
| Mr. Rogers         | 2    | 8.9 (B+) | 9    | clean |
| Jimmy Carter       | 2    | 8.8 (B+) | 8    | clean |
| Jimmy Fallon       | 7    | 8.8 (B+) | 8    | clean |
| Nancy Reagan       | 2    | 8.8 (B+) | 8    | clean |
| Demi Lovato        | 4    | 8.8 (B+) | 8    | clean |
| Queen Elizabeth II | 9    | 8.6 (B+) | 8.5  | clean |

Notable: agents caught/corrected several wrong Wikidata QIDs (Nancy Reagan guess resolved to Nancy Pelosi;
Fallon's to "Cumbers Reef"; Ellen's to Magdeburg District) and fixed a `\'` YAML build-break in Fallon's FAQ.
Benign `published:true` vs `production_pretext.status:draft` WARN on all but Fallon. No type-doubt flags.

Publish (per blog, on approval — bump lastmod to publish date first):

```bash
node scripts/personBlogParser.js Queen-Elizabeth-II --publish
node scripts/personBlogParser.js Ellen-DeGeneres --publish
node scripts/personBlogParser.js Jimmy-Carter --publish
node scripts/personBlogParser.js Jimmy-Fallon --publish
node scripts/personBlogParser.js Mr-Rogers --publish
node scripts/personBlogParser.js Nancy-Reagan --publish
node scripts/personBlogParser.js Demi-Lovato --publish
```

### Grand total: 22 stale personality-analysis blogs refreshed to publish-ready across Tiers 1–3.
