<!-- .claude/commands/blog_content_frontmatter_enrich_people.md -->

# Blog Content Frontmatter Enrichment (People)

You are the frontmatter enrichment pass for 9takes celebrity personality analysis drafts. Your job is to fill the rich SEO and Schema.org frontmatter that powers JSON-LD on `/personality-analysis/[slug]` pages.

You do **not** edit the body. You do **not** grade. You only touch frontmatter.

## Input

The user will provide one of:

- A person's slug, like `Albert-Einstein`
- A draft file path
- `current draft`

`$ARGUMENTS`

## Pre-Approved Operations

- **Read**: All files in the project
- **Edit**: The target draft's frontmatter only. Preserve body content, Svelte components, and any HTML review comment blocks.
- **WebSearch**: Wikipedia, Wikidata, IMDb, and authoritative biographical sources
- **Glob/Grep**: Locating the target draft
- **Bash commands**: `grep`, `ls`, `awk`, `test`

## Task Tracking

Use TaskCreate/TaskUpdate to track progress. Keep one task `in_progress` at a time.

---

## Goal

After the editor pass produces the final body, enrich frontmatter with:

- Authoritative entity IDs (Wikipedia, Wikidata QID, IMDb where applicable)
- Biographical data (birth date, birth place, nationality, occupation)
- Schema.org Person fields (`knows_about`, `same_as`)
- SEO keywords
- Source citations drawn from the body
- FAQPage data (`faqs`) — 3–5 question/answer/anchor entries derived from the **final** analysis

These fields are read by `src/routes/personality-analysis/[slug]/+page.server.ts` and rendered as Schema.org Person + FAQPage JSON-LD on every personality-analysis page, plus an on-page `<FAQSection>`. Filling them well is direct SEO and AI-search lift.

---

## Gold Standard Reference

`src/blog/people/drafts/Albert-Einstein.md` is the canonical example of a fully-enriched draft. When uncertain about field shape, format, or depth, match Einstein.

---

## Step 1: Locate the Draft

If the user gave a full path, read it.

If they gave a slug or person name:

1. Search `src/blog/people/drafts/`
2. Find the best match (handle name variations like `D'Amelio` → `DAmelio`)
3. Resolve any ambiguity before editing

Read the full draft, including all frontmatter, the body, and any HTML comment blocks at the top (Testimony Ledger) or bottom (FRESH EYES REVIEW, SECOND PASS NOTES, EDITOR PASS NOTES).

---

## Step 2: Inventory Existing Frontmatter

Identify which of the rich fields are:

- **Filled with a real value** — leave untouched
- **Missing entirely** — must add
- **Present but empty / placeholder** — must fill (e.g. `nationality:` with no value, `wikipedia: '[URL if available]'`, `twitter: ''` are all empty)

You are **additive only**. Never overwrite an existing good value.

**Strict idempotency on `faqs`:** if the draft already has 1 or more FAQ entries with substantive `question`/`answer`/`anchor`, leave the `faqs` list exactly as-is. Do NOT rewrite, expand, or "improve" existing FAQs. Only generate FAQs when the `faqs:` field is missing or empty.

**Exception — templated backfill FAQs (audit 2026-06-10):** a 2026 bulk backfill wrote machine-assembled FAQ answers (telltale: "…with supporting context from [occupation list]" or answers that restate the occupation/type fields instead of the body's analysis). These do NOT count as substantive. If any FAQ answer contains "with supporting context from" or is plainly assembled from frontmatter fields rather than the article, **replace the entire `faqs` block** with freshly generated FAQs per Step 9. The same backfill wrote occupation-copied `knows_about` values (e.g. `'Business Executive'`, `'Manager'`) — replace those with real expertise areas per Step 5 when you see that pattern.

**Strict idempotency on `wikipedia`:** if `wikipedia` already has a URL (even if it points to a tangentially-related entity like the person's show instead of the person), leave it. Flag the mismatch in your GAPS report instead. Do not silently overwrite.

The fields you own:

| Field          | Type            | Required?                        |
| -------------- | --------------- | -------------------------------- |
| `wikipedia`    | string (URL)    | Yes if a Wikipedia page exists   |
| `wikidata_qid` | string (Q-)     | Yes if a Wikidata entity exists  |
| `imdb_id`      | string (nm-)    | Only if person has IMDb presence |
| `birth_date`   | string          | Yes (YYYY-MM-DD)                 |
| `birth_place`  | string          | Yes ("City, Region, Country")    |
| `nationality`  | string OR list  | Yes                              |
| `occupation`   | list            | Yes (2–5 items)                  |
| `knows_about`  | list            | Yes (3–8 items)                  |
| `keywords`     | list            | Yes (5–10 phrases)               |
| `same_as`      | list            | Yes (3–6 authoritative URLs)     |
| `citations`    | list            | Yes (3–8 source URLs from body)  |
| `faqs`         | list of objects | Yes (3–5 Q&A with anchors)       |

Fields the creator already wrote — **do not touch these**:

- `title`, `meta_title`, `persona_title`, `description`
- `author`, `date`, `loc`, `lastmod`, `changefreq`, `priority`, `published`
- `enneagram`, `type`, `person`, `suggestions`
- `production_pretext`, `path`, `content_quality`
- `twitter`, `instagram`, `tiktok` (social handles)

---

## Step 3: Research Entity Identifiers

Use WebSearch to find:

1. **Wikipedia URL** — search the person's name + "wikipedia". Take the canonical English Wikipedia URL.
2. **Wikidata QID** — search "[person name] wikidata" or look at the Wikidata link in the Wikipedia infobox. Format: `Q12345`.
3. **IMDb ID** — only if relevant (actors, filmmakers, musicians with film credits, athletes with documentary presence). Format: `nm0000000`. Skip for pure intellectuals, philosophers, scientists with no film representation.

**Cross-check IMDb IDs.** Before writing an `imdb_id` value, confirm it via at least one of:

- Wikidata property P345 on the person's entity (fetch `https://www.wikidata.org/wiki/Special:EntityData/<QID>.json` and look for `claims.P345`)
- A WebSearch result on the candidate `nm` ID that returns IMDb pages confirming the person's name

If neither source confirms, OMIT `imdb_id` rather than write a guess. A wrong IMDb ID links the person to the wrong individual and breaks Schema.org cross-referencing.

If a category of ID does not exist for this person, omit the field. Do not write `imdb_id: ''`.

---

## Step 4: Pull Biographical Data

From Wikipedia / Wikidata, extract:

- **`birth_date`** — YYYY-MM-DD format. If only year is known historically (rare for modern figures), use YYYY-01-01 and note the limitation in working notes.
- **`birth_place`** — "City, Region, Country" using the political naming at time of birth (e.g. Einstein: `'Ulm, Württemberg, German Empire'`).
- **`nationality`** — string for a single nationality (`'American'`), list for multiple (`['German', 'Swiss', 'American']`). Use lists for naturalized citizens or dual citizenship.
- **`occupation`** — list of 2–5 primary professional roles (`['Theoretical physicist', 'Author']`). Capitalize first letter. Skip honorifics like "Dr.".

---

## Step 5: Construct `knows_about`

This is the Schema.org `Person.knowsAbout` field. List 3–8 areas of genuine expertise or signature contribution. Match the granularity of major Wikipedia category links.

Examples from Einstein: `'Theory of relativity'`, `'Photoelectric effect'`, `'Quantum mechanics'`, `'Mass–energy equivalence'`, `'Brownian motion'`, `'Statistical mechanics'`, `'Cosmology'`.

For a non-scientist (musician, athlete, entrepreneur), pick analogous specificity. Avoid vague entries like `'Music'` — prefer `'Pop songwriting'`, `'Stadium tour production'`, `'Re-recorded masters strategy'`.

---

## Step 6: Construct `same_as`

The `same_as` list links the 9takes person entity to other authoritative descriptions of the same person, for Schema.org cross-referencing. Include in priority order:

1. Wikipedia URL (always if it exists)
2. Wikidata URL (e.g. `https://www.wikidata.org/wiki/Q937`)
3. IMDb URL if applicable
4. Other authoritative entity URLs: Nobel Prize page, official .gov bio, MoMA artist page, Britannica entry, Encyclopedia of Philosophy, official band/team page

Aim for 3–6 items. Quality over quantity. No fan wikis, no social media profiles (those go in `twitter` / `instagram` / `tiktok`).

---

## Step 7: Extract `citations` from the Body

Scan the draft body for inline links and references. Build the `citations` list from authoritative URLs that already appear in the body (Wikipedia, news outlets, official sites, primary source documents). 3–8 items.

If the body has fewer than 3 distinct external citations, that is a content-quality issue — note it in your report but still write what is there. Do not invent citations.

---

## Step 8: Build `keywords`

5–10 SEO phrases the article should rank for. Use the title, meta_title, persona_title, body section headings, and the type analysis as raw material.

Patterns that work (from Einstein):

- `'[Person name] enneagram'`
- `'[Person name] type [N]'`
- `'[Person name] personality'`
- `'[Person name] [wing notation]'` — e.g. `'Einstein 5w4'`
- `'[Personality archetype] enneagram'` — e.g. `'Investigator enneagram'`
- `'[Signature event/topic]'` — e.g. `'Einstein wife contract'`, `'Einstein Mileva Marić'`

Each keyword should be a phrase a real person would search for. Avoid generic single words.

---

## Step 9: Generate `faqs`

This is the highest-leverage field. The blog already exists. Read it. Identify the 3–5 questions a reader most plausibly arrives with or wants answered after reading. Write Q/A/anchor entries that summarize the **actual analysis in the body**.

Each FAQ:

```yaml
- question: 'Plain reader question'
  answer: 'Concise answer (2–4 sentences) that previews the analysis in the body. Specific, sourced where relevant, never generic.'
  anchor: 'kebab-case-slug-for-anchor-link'
```

### Rules

- **First FAQ is always**: `"What is [Person]'s personality type?"` — answer states the type, the wing, and 3–5 signature evidences in one tight paragraph. See Einstein for the template.
- **Other FAQs** mirror the body's strongest sub-questions or controversies. If the body wrestles with a specific contradiction ("Why did Einstein never accept quantum mechanics?"), make that a FAQ.
- **Answers must come from the actual body** — never invent facts. If the body argues a point, the FAQ summarizes it. If the body does not address something, do not write a FAQ for it.
- **Anchor slugs** should match existing H2/H3 anchors in the body when relevant, so the FAQ can deep-link to that section. Otherwise, create a clean kebab-case slug. Check existing headings before writing the anchor.
- **Length**: 2–4 sentences per answer. Long enough to be substantive in a Featured Snippet, short enough to be scannable.
- **No labels in answers**: don't say "Type 5s typically..." — say what _this person_ did. The Distribution Rule from the creator command applies here too.

### Anti-patterns

- Generic FAQs that could apply to anyone of that type (`"What is Type 5?"` — wrong, this is a person's FAQ block, not a typology explainer)
- FAQs whose answers contradict the body
- FAQs with vague anchor slugs that don't link anywhere meaningful
- More than 5 FAQs (dilutes the snippet competition)

---

## Step 10: Write Back to Frontmatter

Edit the draft file. Insert the new fields in this order, immediately after `suggestions:` and before `production_pretext:`:

```yaml
wikipedia: '...'
wikidata_qid: '...'
imdb_id: '...' # only if applicable
birth_date: '...'
birth_place: '...'
nationality: ... # string or list
occupation:
  - '...'
knows_about:
  - '...'
keywords:
  - '...'
same_as:
  - '...'
citations:
  - '...'
faqs:
  - question: '...'
    answer: '...'
    anchor: '...'
```

### Constraints

- **Preserve existing field order** for fields the creator already wrote. Insert new fields without reordering the existing ones beyond the placement specified above.
- **Match YAML style** of the existing frontmatter — if other lists in the file use `['a', 'b']` inline style, follow it; if they use block style with `- ` dashes, follow that. Default to block style for the lists you write since they're multi-line.
- **Quote string values** consistently with the rest of the file (single quotes are the project default).
- **Do not touch the body — under any circumstances.** This includes: do not remove internal links (`[text](/personality-analysis/...)` or `[text](/enneagram-corner/...)`), do not rewrite sentences, do not reformat paragraphs, do not "clean up" anything below the closing `---` of the frontmatter. The body is read-only. Your single output is changes to fields in the frontmatter block.
- **Do not touch HTML comment blocks** (Testimony Ledger at top, FRESH EYES REVIEW / SECOND PASS NOTES / EDITOR PASS NOTES at bottom).
- **Do not touch `production_pretext` or `content_quality`.**
- **NEVER modify `lastmod`.** DJ manages that field manually. Leave it exactly as you found it, even if you write new fields.
- **Insert new fields anywhere in the frontmatter** that produces clean placement. If existing fields (`content_quality`, `path`) are at the end and crowding the preferred position, insert the new fields between `suggestions:` and whichever field came next before — do not append after `content_quality` or `path`.

---

## Step 11: Report

```
Frontmatter enrichment complete: [Person-Name]

Fields filled:
- wikipedia, wikidata_qid, [imdb_id, ]birth_date, birth_place, nationality, occupation, knows_about, keywords, same_as, citations, faqs

Fields already present (preserved):
- [list any rich fields that were already populated]

FAQs generated (N):
1. [first question] → #anchor
2. [second question] → #anchor
...

Issues:
- [list any gaps: e.g. "fewer than 3 external citations found in body — content has thin sourcing"]
- [or "none"]
```

---

## Edge Cases

- **Already fully enriched**: If every field already has a real value, report "no changes — fully enriched" and exit. Idempotency over churn.
- **Historical / pre-Internet figures**: IMDb usually not applicable. Some authoritative `same_as` URLs may come from museum, archive, or university sources instead of typical web entities.
- **Pseudonymous or anonymous figures**: birth_date / birth_place may be unknown. Omit rather than guess. Note in working notes.
- **Person not on Wikipedia**: Rare. If genuinely no Wikipedia page exists, omit `wikipedia` and `wikidata_qid`. Build `same_as` from whatever authoritative sources do exist.
- **Body has zero external links**: Cannot fabricate `citations`. Write what exists, flag the gap in the report.

---

## File References

- Gold standard: `/src/blog/people/drafts/Albert-Einstein.md`
- JSON-LD consumer: `/src/routes/personality-analysis/[slug]/+page.svelte`
- DB column read: `/src/routes/personality-analysis/[slug]/+page.server.ts`
- FAQ section component: `/src/lib/components/blog/FAQSection.svelte` (referenced by `[slug]/+page.svelte`)
- Creator command (writes the base frontmatter you enrich): `/.claude/commands/blog_content_creator_people_v2.md`
- Grader (runs after this stage): `/.claude/commands/grade_blog.md`
- Publish gate: `/.claude/commands/blog_content_publish_people.md`
