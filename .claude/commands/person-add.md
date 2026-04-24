# Person: Add

Create a raw research doc at `.claude/people/research/<Name-Kebab>.md`, a person profile at `.claude/people/<Name-Kebab>.md`, and, when the source material is rich enough, a companion dossier at `.claude/people/dossiers/<Name-Kebab>.md`.

The raw research doc is the source-heavy workspace. The profile is flow-agnostic and distilled — it describes who the person is, not how they behave in a specific flow. The dossier is the deeper retrieval map — life events, body of work, obvious/non-obvious signals, relationships, source-backed voice, and facts to use sparingly.

Once added, the person is automatically included in `/council`, `/poll`, and any future flow.

---

## Input

- **With args (`$ARGUMENTS`)**: treat as the person's full name (e.g., "Rick Rubin", "Marcus Aurelius", "Christopher Nolan"). If DJ gave extra context after the name, capture it.
- **Without args**: ask _"Who should we add?"_ and wait for DJ's response.

**Name normalization**: display name stays as given; kebab-case version for file paths.

Examples:

- "Rick Rubin" → `Rick-Rubin`
- "Marcus Aurelius" → `Marcus-Aurelius`
- "Oprah" → `Oprah`
- "Jean-Luc Godard" → `Jean-Luc-Godard`

---

## Workflow

### 1. Check existing output paths

Target paths:

- Research: `.claude/people/research/<Name-Kebab>.md`
- Profile: `.claude/people/<Name-Kebab>.md`
- Dossier: `.claude/people/dossiers/<Name-Kebab>.md`

If either file already exists, read the existing file before doing anything else and ask DJ whether to:

1. update the existing file
2. replace it
3. skip that artifact and only create the missing one
4. create a variant under a different name

Never overwrite an existing research doc, profile, or dossier without DJ's explicit confirmation.

### 2. Set up source paths and templates

Look for `src/blog/people/drafts/<Name-Kebab>.md`.

If the file exists, record it as the existing 9takes personality analysis. You may inspect frontmatter and metadata, but do **not** use the article's interpretive content for Pass 1. The personality analysis is the psychology/personality layer for Pass 2, not the first source of truth.

Also read:

- `docs/council/dossier-spec.md`
- `.claude/people/research/_template.md`
- `.claude/people/dossiers/_template.md`
- `youtube-transcripts-people/README.md`
- one existing person profile at `.claude/people/*.md`
- one existing dossier at `.claude/people/dossiers/*.md` if one exists

If the file does not exist, ask DJ:

> "I don't see a personality analysis for **<display name>** in `src/blog/people/drafts/`. Three options:
>
> 1. **Run `/blog_content_creator_people` first** to generate a deep analysis. The profile and dossier will be much stronger — I can come back after.
> 2. **Proceed with web research** — I'll pull from public interviews, books, biographies, podcasts, official bios, and long profiles. Thinner than a 9takes portrait, but usable if the sources are good.
> 3. **Proceed with what you tell me** — describe who they are in your own words, and I'll build a profile. I will usually skip the dossier unless you give enough concrete source material.
>
> Which do you want?"

Wait for DJ's choice. If (1), stop and point him at the blog creator. If (2), use WebSearch/WebFetch to gather material and keep a source list. If (3), interview DJ briefly.

### 3. Pass 1 — build independent source inventory and raw research doc

Create `.claude/people/research/<Name-Kebab>.md` from `.claude/people/research/_template.md`.

Pass 1 is independent research. Do not use the existing 9takes personality analysis for interpretation yet.

Build a source inventory in the raw research doc:

- **Local transcript assets**: search `youtube-transcripts-people/` for the person, name variants, and obvious related people (spouse, cofounder, creative partner, frequent collaborator). Include transcript writeups, raw dumps, consolidated analyses, and review/fact-check docs.
- **Local research and review docs**: include `*-consolidated-analysis.md`, `*-review.md`, fact-check files, and related person drafts when they contain useful relationship context. Mark related person drafts as secondary, not primary.
- **Existing personality analysis path**: record it, but mark it "held for Pass 2."
- **Targeted web sources**: use official bios, official project pages, long-form interviews, podcast pages, book/film/company pages, reputable profiles, and recent news only where relevant.
- **New YouTube transcript candidates**: if a specific YouTube interview or podcast appears unusually insight-rich and is not already local, use the `youtube-transcript` skill at `/Users/djwayne/.claude/skills/youtube-transcript`.

When pulling a new YouTube transcript:

1. Follow `youtube-transcripts-people/README.md`.
2. Save the raw dump as `youtube-transcripts-people/_raw/<slug>.raw.md`.
3. Create a structured writeup at `youtube-transcripts-people/<slug>.md`.
4. Add the raw transcript link in `## Related`.
5. If the transcript belongs in a consolidated analysis, update the analysis source list and add a backlink from the writeup.
6. Record the transcript work in the raw research doc's `## Transcript Work Log`.

Extract Pass 1 notes into the raw research doc:

- timeline / life events
- body of work
- voice / repeated language
- relationships / institutions
- frameworks / methods
- obvious anchors
- non-obvious signals
- common misreads
- open questions / gaps

Every important note should have a source pointer. Use local file paths when available. Use URLs for web sources.

### 4. Decide source quality from Pass 1

Before drafting, classify the source material:

- **Rich source**: multiple long interviews, transcript set, book-length source, strong local research docs, or 5+ strong public sources. Create research doc, profile, and dossier.
- **Medium source**: enough to identify voice, frameworks, and several life/work patterns, but not enough for a full retrieval map. Create profile and either a compact starter dossier or ask DJ whether to skip dossier for now.
- **Thin source**: DJ description only, short bios, Wikipedia-level facts, or weak web snippets. Create profile only. Create only a small research note if useful. Do not fake a dossier.

If source quality is medium or thin, say so plainly in the preview. A weak dossier creates confident noise.

### 5. Pass 2 — enrich with the personality analysis and check for conflicts

After Pass 1 notes exist, read the existing 9takes personality analysis if one exists.

Use the personality analysis for:

- psychological thesis
- Enneagram/personality layer
- wound and motivation pattern
- interpretive language
- original insights
- explanatory synthesis

Compare the independent research against the personality analysis:

- Does Pass 1 evidence support the article's thesis?
- Does the article overstate anything?
- Is anything outdated?
- Are there factual conflicts?
- Are there new facts or transcript-backed details that should enrich the dossier?
- Does the article contain a psychological insight the dossier should absorb?

Update the raw research doc's `## Pass 2 - Personality Analysis Comparison` with:

- alignment
- enrichment pulled into the dossier
- tensions / conflicts / outdated claims
- blog comments added

If Pass 1 identifies a conflict, outdated point, or unsupported claim in the personality analysis, do **not** silently resolve it. Add a concise HTML comment near the relevant section of `src/blog/people/drafts/<Name-Kebab>.md`:

```md
<!-- DOSSIER-CHECK:
Independent dossier pass found possible tension with this claim.
Issue: <specific mismatch>
Evidence: <local transcript / source path / URL>
Recommendation: verify, soften, update, or address as an interesting contradiction.
-->
```

Only add comments for real issues. Do not pepper the article with comments for minor wording preferences.

### 6. Gather profile ingredients

Every profile needs:

- **One-line identity** — a short signature phrase. The `persona_title` field from the blog frontmatter often works.
- **One-paragraph biographical capsule** — age, formative beats, career highlights, central wound or struggle. Specific, not generic.
- **Voice and speaking style** — cadence, phrases they actually use, phrases they would never use, rhetorical tics.
- **Be BOLD on** — 6–10 specific domains where they have earned authority. Specific ("startup product-market fit diagnosis"), not generic ("leadership").
- **Be HUMBLE on** — 4–7 specific domains where their wound shows up, where their lens distorts, or where they lack authority.
- **Signature frameworks** — the named tools, laws, formulas, diagnostic questions, or rituals this person actually uses. Reference them by name.
- **Patterns and tendencies** — factual descriptions of their defaults, wounds, and biases. Reframed as character facts, not behavior instructions. (E.g., "You reach for a protocol fast. Sometimes the situation calls for presence." — factual.)
- **Source material** pointer — `src/blog/people/drafts/<Name-Kebab>.md` if it exists, or "No deep-source blog. Draw from the profile above." if it doesn't.
- **Gut checks before submitting** — 4–6 character-specific principles, written in second person. These are flow-agnostic authenticity checks for this specific person.

The profile should synthesize Pass 1 evidence and Pass 2 personality interpretation. It should not simply compress the 9takes article.

### 7. Gather final dossier ingredients

Only create a dossier if there is enough source material to make it useful. A dossier is a retrieval map, not a longer bio.

Every dossier should include:

- **Purpose** — state that the dossier is a retrieval map, not biography.
- **Life Event Map** — high-signal timeline cards only. Each card needs event, why it matters, when to use, response direction, when to avoid, and source.
- **Turning Points** — moments where the person's operating system changed.
- **Body of Work** — books, movies, companies, podcasts, campaigns, roles, institutions, or projects where the person poured real effort. Include only artifacts that reveal judgment, taste, obsession, method, wound, or worldview.
- **Obvious vs Non-Obvious**:
  - **Obvious anchors**: the public stories, phrases, frameworks, roles, and patterns people already associate with them. Use these to stay recognizable without becoming parody.
  - **Non-obvious signals**: subtle details, under-discussed patterns, quiet contradictions, or things they only mention occasionally that should make responses fresher.
  - **Common misreads**: what people usually get wrong about this person, plus the more accurate correction.
- **Source-Backed Voice** — cadence, rhetorical moves, phrases, and things never to force.
- **Relationship Map** — family, collaborators, mentors, rivals, audiences, institutions, and what those relationships reveal.
- **Works and Frameworks** — named tools, frameworks, methods, creative principles, decision rules, or repeatable lenses.
- **Known Distortions** — where this person's lens predictably bends reality.
- **Use Sparingly** — powerful facts that become melodramatic, corny, invasive, or repetitive if used too often.
- **Retrieval Notes** — topic-specific reminders for what to pull when a future question comes in.
- **Source Index** — raw research doc, transcript paths, local research paths, personality analysis path, and public sources used.

Body of work is not a resume. Do not catalog every book, film, role, company, or credit. Select the pieces that change how the person would answer.

Obvious vs non-obvious is not a cleverness contest. Non-obvious signals must be supported by source material. If a "non-obvious" read is speculative, leave it out or mark it as low confidence.

The dossier should be assembled in this order:

1. Pass 1 evidence and pattern discovery
2. Pass 2 personality enrichment
3. final pruning for retrieval usefulness

### 8. Draft the profile

Use any existing profile at `.claude/people/*.md` as a structural template.

**Required sections in this order:**

1. `# <Display Name> — Person Profile`
2. `## One-line identity`
3. `## Who you are in one paragraph`
4. `## Voice and speaking style`
5. `## Be BOLD on these domains`
6. `## Be HUMBLE on these domains`
7. `## Signature frameworks to reach for`
8. `## Patterns and tendencies`
9. `## Source material`
10. `## Gut checks before submitting`

**Hard rules for the draft:**

- **Second person throughout** ("You are...", not "He is..."). The agent roleplays as this person.
- **No flow-specific content.** The profile must be useful to council, poll, and any future flow. No references to "counsel," "sections," "DJ's situation," specific response structures, or specific flows.
- **No Enneagram theory exposition.** Naming a probable type is fine if DJ's source does; teaching head/heart/gut centers or what types mean is not.
- **No cross-person references.** The person does not know who else is on the roster.
- **Be specific.** No filler like "expert in leadership." Name the actual domains.

Write the draft to `.claude/people/<Name-Kebab>.md` for review. Do not update the roster yet.

### 9. Draft the dossier, if source quality supports it

Use `.claude/people/dossiers/_template.md` and the Tim Ferriss dossier as structural references.

**Required sections in this order:**

1. `# <Display Name> - Dossier`
2. `## Purpose`
3. `## Life Event Map`
4. `## Turning Points`
5. `## Body of Work`
6. `## Obvious vs Non-Obvious`
7. `## Source-Backed Voice`
8. `## Relationship Map`
9. `## Works and Frameworks`
10. `## Known Distortions`
11. `## Use Sparingly`
12. `## Retrieval Notes`
13. `## Source Index`

**Hard rules for the dossier:**

- Write in second person where describing the person directly. The agent roleplays as this person.
- Every life-event card and body-of-work card must include an `Avoid if` line.
- Every major card should include a source line.
- Do not summarize the person's entire life.
- Do not include trivia.
- Do not add complete bibliography, filmography, company history, or resume sections.
- Do not include long quotations.
- Include fewer, stronger cards rather than many weak ones.

Length target:

- Rich source: ~200–500 lines.
- Medium source: ~100–250 lines, clearly marked as a starter dossier.
- Thin source: skip dossier.

Ensure `.claude/people/dossiers/` exists. Write the dossier to `.claude/people/dossiers/<Name-Kebab>.md` only if creating it. If skipping, do not create an empty placeholder.

### 10. Preview before finalizing

Show DJ:

1. The one-line identity
2. The one-paragraph capsule
3. The BOLD list
4. The HUMBLE list
5. Raw research status:
   - research path
   - source quality (rich / medium / thin)
   - local transcript count
   - new transcript count
   - web source count
   - open gaps
6. Personality analysis comparison:
   - aligned points
   - enrichment pulled into dossier
   - conflicts / outdated claims / blog comments, if any
7. Dossier status:
   - created: show the life-event count, body-of-work entries, obvious anchors, non-obvious signals, common misreads, and use-sparingly list
   - skipped: say why, and what source material would make it worth adding later
   - starter: say what is missing and what should be verified later

Ask: _"Want me to lock this in, adjust first, or skip the dossier for now?"_

If DJ says adjust, do it, preview again. If DJ says lock it in, proceed.

If DJ asks to skip a newly drafted dossier after preview, remove it only after confirming that he wants the draft deleted.

### 11. Update the human-readable roster

Open `docs/council/README.md`. Find the "Current roster" section. Add a new bullet:

- **<Display Name>** — <short domain description, 1 sentence>.

This is for DJ's reference only. The commands auto-discover from `.claude/people/`, so no other file needs updating.

### 12. Report back to DJ

```
New person added: <Display Name>

- Research: .claude/people/research/<Name-Kebab>.md
- Profile:  .claude/people/<Name-Kebab>.md
- Dossier:  .claude/people/dossiers/<Name-Kebab>.md | skipped: <reason>
- Source:   <blog path | web research | DJ direct>
- Roster:   updated in docs/council/README.md

Identity: <one-line identity>

Bold on:
  - <one representative domain>
  - <another>

Humble on:
  - <one representative limit>

Dossier:
  - Source quality: <rich | medium | thin>
  - Local transcripts: <count>
  - New transcripts: <count>
  - Web sources: <count>
  - Life events: <count or skipped>
  - Body of work: <count or skipped>
  - Non-obvious signals: <count or skipped>
  - Blog comments added: <count>

Will be convened in the next /council or /poll run.
```

---

## Rules

- **Never overwrite an existing profile without DJ's explicit confirmation.** If `.claude/people/<Name-Kebab>.md` already exists, read it first and ask DJ whether to update, replace, or create a variant under a different name.
- **Never overwrite an existing research doc without DJ's explicit confirmation.** If `.claude/people/research/<Name-Kebab>.md` already exists, read it first and ask DJ whether to update, replace, skip, or create a variant.
- **Never overwrite an existing dossier without DJ's explicit confirmation.** If `.claude/people/dossiers/<Name-Kebab>.md` already exists, read it first and ask DJ whether to update, replace, skip, or create a variant.
- **Do not include Enneagram theory exposition in the profile.** Naming a probable type is fine. Teaching center theory is not.
- **If source material is thin, flag it.** A weak profile produces weak responses. Prefer suggesting `/blog_content_creator_people` first.
- **If source material is thin, skip the dossier.** Do not fill a dossier with Wikipedia facts or generic public summaries.
- **Do independent research before reading the personality analysis for interpretation.** The personality analysis is Pass 2, not Pass 1.
- **Create a raw research trail.** Any substantial dossier must be traceable back to `.claude/people/research/<Name-Kebab>.md` and original sources.
- **Use transcript assets first.** If local transcript writeups or consolidated analyses exist, use them before web summaries.
- **Only pull new YouTube transcripts when they are likely to add real insight.** Do not pull transcripts just to increase source count.
- **Keep profiles at roughly the length of existing ones** (~100–160 lines). Don't pad. Don't truncate if the source has real depth.
- **Keep dossiers selective.** Body of work is not a resume. Obvious anchors are not parody cues. Non-obvious signals must be supported.

---

_Last updated: 2026-04-24_
