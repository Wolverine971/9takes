<!-- docs/taskers/T-19-dj-personality-reasoning-card-pilot.md -->

# Tasker: Pilot DJ's Evidence-Led Personality Reasoning Card

**For:** Editorial, product-design, and Svelte implementation agent
**Owner:** DJ
**Created:** 2026-08-13
**Status:** Pilot reviewed; structured read retained as editorial source material; public card retired.
**Related:** `.codex/skills/capture-dj-personality-read/SKILL.md`, `src/blog/people/drafts/Elon-Musk.md`, `src/routes/personality-analysis/[slug]/+page.svelte`, `docs/growth/growth-log.md`, `docs/taskers/T-18-people-persona-title-quality-audit.md`

## 0. What and why

9takes personality analyses need a visible layer of original judgment that a reader can understand in seconds. The current corpus often contains substantial research, but DJ's personal reasoning, uncertainty, pattern recognition, and source-review process are not consistently surfaced as a distinct product.

Build a repeatable workflow and one-person pilot that turns DJ's spoken riff into:

1. a compact `DJ's read` card near the top of a personality-analysis page;
2. an extended evidence-led reasoning section;
3. a source-ready evidence ledger;
4. a transparent note explaining how AI assisted and where DJ made the judgment; and
5. optional founder-led video and Reel outlines drawn from DJ's own words.

The pilot person is **Elon Musk**. Do not scale the UI or edit additional people until DJ approves the Elon reasoning artifact and the rendered card.

This work must make one distinction explicit: DJ has original, first-party analysis of public source material. He does not have private or firsthand knowledge of the public figure. Observations, interpretations, holistic vibes, and type connections must remain distinguishable.

### Pilot outcome — 2026-08-15

DJ's review of the rendered Elon page supersedes the original public-card hypothesis. The structured
read is useful for directing the article, preserving uncertainty, and supporting future editorial or
founder-media work, but the standalone card repeats the essay and interrupts the subject-led reading
flow.

- Keep `src/lib/data/djPersonalityReads.ts` as the reviewable reasoning and source ledger.
- Integrate approved judgments into the article's normal prose, with alternatives and uncertainty
  stated where they matter.
- Do not render a second `DJ's read` dashboard inside the published article.
- Treat any older `<DJReadCard />` database marker as editorial-only until the body is next synced.
- Any future public transparency surface needs a new placement and content review; this pilot does not
  authorize a cross-corpus card rollout.

## 1. Required reading

Read completely before acting:

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `.codex/skills/capture-dj-personality-read/SKILL.md`
4. `.codex/skills/capture-dj-personality-read/references/interview-question-bank.md`
5. `.codex/skills/capture-dj-personality-read/references/reasoning-card-contract.md`
6. `src/blog/people/drafts/Elon-Musk.md`
7. Existing Elon Musk research, transcripts, source trails, grading artifacts, and live page output
8. `docs/growth/growth-log.md`, especially the latest personality-analysis engagement and scroll findings
9. `docs/design-system.md` and current personality-analysis visual conventions
10. The current personality-analysis route and its relevant child components

Before inspecting or changing Svelte, load the repository's required Svelte skills. Before design judgment or implementation, use the `hyperplexed-audit` workflow on the proposed card region and cite applicable design patterns.

Run `git status --short` first. Personality-analysis drafts, corpus data, sitemap files, and generation outputs may contain parallel work. Do not modify or normalize unrelated files.

## 2. Editorial contract

### DJ speaks first

Invoke `$capture-dj-personality-read` for Elon Musk. Start with one open invitation and let DJ riff without a prefabricated questionnaire influencing him. Only after the riff should the skill reflect what it heard and ask focused follow-ups in small rounds.

### The reasoning model

Every important point must retain these fields:

| Field                   | Requirement                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Observation             | A public behavior, statement, decision, recurring pattern, or sourced moment                     |
| Source                  | Link, clip, timestamp, document, or an explicit `source needed` marker                           |
| DJ interpretation       | What DJ believes the observation means                                                           |
| Personality connection  | Why it supports the proposed type or pattern                                                     |
| Alternative explanation | Another type, role, context, culture, status, media training, neurotype, or non-type explanation |
| Confidence              | Low, medium, or high, with the reason                                                            |

Preserve DJ's holistic read as a labeled interpretation. Never rewrite a vibe as a verified fact.

### The trust tests

The completed artifact must answer:

1. What did DJ actually notice?
2. What did he infer?
3. Why does that connect to the proposed type?
4. What is the strongest competing explanation?
5. What makes DJ hesitate?
6. What would change his mind?
7. Which primary material did DJ personally review?
8. What did AI do and not do?

## 3. Prioritized people queue

The queue is based on DJ's familiarity, available source material, existing engagement, and fit with a founder-led read. DJ interest can reorder it at any time.

### Pilot

1. **Elon Musk**: DJ's requested first use case and an existing Type 5 analysis with a counterargument section.

### First expansion wave

2. **Tim Ferriss**: DJ has deep familiarity and can contribute a genuinely personal read.
3. **Jordi Hays**: strong existing argument, current source trail, and a page already shaped around competing typings.
4. **Alex Karp**: strong onsite engagement and rich long-form public material.
5. **Robert Greene**: direct fit with an audience interested in motives, power, and hidden interpersonal logic.
6. **Lex Fridman**: extensive long-form source material and a useful public-persona versus underlying-motivation problem.

### Later validation wave

7. **Ryan Gosling**: larger search demand, but public persona and acting roles require careful evidence boundaries.
8. **Meghan Markle**: strong interest, but polarization raises the burden for counterevidence and uncertainty.

### Hold until DJ familiarity or curiosity changes

- Tina Fey
- Marilyn Monroe
- Sky Bri
- Brad Pitt

Do not interpret the hold list as a quality judgment. It reflects DJ's present familiarity and the requirement that this layer originate in his own thinking.

## 4. Work phases

### Phase A: Capture and approve the Elon reasoning artifact

1. Run the skill interview.
2. Preserve the raw riff separately from edited synthesis.
3. Build the evidence ledger and mark every missing source.
4. Run the strongest alternate typing and non-type counter-case.
5. Produce compact-card copy and the extended reasoning section.
6. Produce the AI-method note.
7. Return the complete artifact to DJ for meaning, certainty, and voice corrections.

Do not edit a blog, database row, or component before DJ approves Phase A.

### Phase B: Define storage and placement

Inspect the live and local content paths before choosing storage. Personality-analysis pages are database-backed in production, and local drafts may not match live rows.

Recommend a structured source of truth that:

- preserves the semantic fields in the reasoning-card contract;
- can be keyed by person slug;
- is reviewable in git before publication;
- can support the card, extended section, source trail, AI note, and media scripts without duplicating prose; and
- does not require embedding internal editorial notes in public page source.

Choose the placement by evidence, not by habit. The current hypothesis is immediately after the five-second quick read and before the long narrative, but verify the actual route and mobile flow.

### Phase C: Design the card

The card should feel like a clean editorial reasoning object, not a promotional widget.

It must show without expansion:

- `DJ's read`
- proposed type
- confidence
- one-sentence thesis
- strongest alternative
- three concise reasons
- one honest hesitation

It may expand to show:

- the fuller evidence chain;
- source links or timestamps;
- counterevidence;
- what would change DJ's mind; and
- the AI-method note.

Requirements:

- mobile-first scanning;
- accessible semantic controls and keyboard behavior;
- reduced-motion support;
- no more than one primary action;
- uncertainty visible without requiring a tooltip;
- clear visual distinction between observation and interpretation;
- no decorative complexity that competes with the article thesis; and
- compatibility with current 9takes design tokens.

Create or reuse a component only after checking current patterns. Do not alter global primitives without explicit approval.

### Phase D: Implement only the Elon pilot

After DJ approves the content and card design:

1. Implement the smallest structured-data and component path.
2. Render it only for Elon Musk behind an explicit slug or content-presence gate.
3. Keep the existing long-form article and source trail intact unless DJ separately approves editorial integration.
4. Add only the analytics needed to determine whether readers see and engage with the reasoning layer.
5. Do not push the people draft to production or update Supabase without a separate explicit approval.

Suggested events, subject to the current analytics contract:

- `personality_reasoning_seen`
- `personality_reasoning_expanded`
- `personality_reasoning_source_clicked`
- `personality_reasoning_video_played`

### Phase E: Derive founder media

Use DJ's approved phrases to produce:

- one 30-to-60-second Reel outline;
- one two-to-four-minute page-video outline; and
- one question inviting viewers to give their own take.

Do not create generic scripts that erase DJ's cadence or claim more certainty than the approved artifact.

## 5. Verification checklist

- [ ] `git status --short` was recorded before work.
- [ ] The skill let DJ riff before asking targeted questions.
- [ ] Raw riff, edited synthesis, and sourced evidence remain distinguishable.
- [ ] Every published-facing claim is sourced or clearly labeled as DJ's interpretation.
- [ ] The strongest alternate read and what would change DJ's mind are visible.
- [ ] AI assistance is described accurately and does not claim psychological verification.
- [ ] DJ approved the Elon reasoning artifact before any UI implementation.
- [ ] Required Svelte and design skills were loaded before component work.
- [ ] The card works at desktop and iPhone widths and with keyboard navigation.
- [ ] Any motion respects reduced-motion preferences.
- [ ] Only Elon is enabled in the pilot.
- [ ] No database push, publication, `lastmod` edit, or unrelated file change occurred.
- [ ] `pnpm check` passes after implementation.
- [ ] Targeted lint and formatting checks pass only on touched files.
- [ ] `rg -n $'\u2014' docs/taskers/T-19-dj-personality-reasoning-card-pilot.md` returns no matches.

## 6. Risks and gotchas

- Public behavior can support an interpretation, but it cannot prove a private motive.
- A polished AI synthesis can accidentally replace DJ's meaning. Return to the raw riff when the copy becomes generic.
- Source-rich does not mean interpretation-safe. Separate literal evidence from inferred psychology.
- Personality-analysis production content is database-backed. Never assume editing a local draft updates the live page.
- Internal review markers and research notes must not leak into public output.
- The project has parallel work in people drafts and generated data. Never stash, reset, or bulk-format.
- The first card is a methodology test. Do not create a large rollout queue before DJ reacts to the Elon result.

## 7. Definition of done

The task is done when DJ has approved a sourced Elon Musk reasoning artifact, a clean reusable card is rendered for the Elon pilot only, the extended reasoning and AI-method note are accessible, analytics can read card exposure and engagement, and the same approved riff has yielded a founder-video outline without changing any other person's page.
