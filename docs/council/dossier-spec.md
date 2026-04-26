<!-- docs/council/dossier-spec.md -->

# Council Dossier Spec

Person profiles stay distilled. Raw research docs preserve the source trail. Dossiers hold the deeper memory layer.

The goal is not to make agents recite more biography. The goal is to help an agent find the right lived experience, relationship, quote, body-of-work artifact, or framework when a question makes that material relevant.

---

## File Location

Dossiers live at:

```text
.claude/people/dossiers/<Name-Kebab>.md
```

The dossier filename should match the person profile filename:

```text
.claude/people/Tim-Ferriss.md
.claude/people/dossiers/Tim-Ferriss.md
```

Templates live at:

```text
.claude/people/dossiers/_template.md
```

Raw research docs live at:

```text
.claude/people/research/<Name-Kebab>.md
```

The raw research template lives at:

```text
.claude/people/research/_template.md
```

---

## Relationship to Other Files

### Person profile

The person profile is the operating profile. It should stay compact and reusable across flows:

- identity
- voice
- bold domains
- humble domains
- signature frameworks
- patterns and tendencies
- source pointer
- gut checks

### Dossier

The dossier is a selective memory index. It should help the agent retrieve specific material only when it clarifies the current question:

- life events
- turning points
- body of work
- obvious vs non-obvious signals
- relationships
- source-backed voice
- works and frameworks
- known distortions
- facts to use sparingly

### Raw research doc

The raw research doc is the source-heavy workspace used to create or update the profile and dossier. It can include source inventory, transcript notes, timeline notes, exact source pointers, open questions, and the Pass 2 comparison against the personality analysis.

The raw research doc is not a runtime prompt artifact. Council and poll agents should read the curated dossier, not the raw research notes.

### Source portrait

The 9takes portrait is the psychology/personality source. It is written for human readers. The raw research doc is written for traceability. The dossier is written for agent retrieval.

When creating a dossier, use a two-pass method:

1. **Pass 1: independent research.** Build the raw research doc from local transcript assets, local research docs, targeted web sources, and any newly pulled YouTube transcripts. Do not use the 9takes personality analysis for interpretation yet.
2. **Pass 2: personality analysis enrichment.** Read the 9takes personality analysis, enrich the dossier with its psychological layer, and comment in the article if independent research reveals conflicts, outdated claims, or unsupported points.

---

## What Belongs in a Dossier

Include an event, relationship, or detail only if it changes how this person would plausibly see a future question.

Good dossier material:

- an event that formed or revealed a durable pattern
- a repeated phrase or rhetorical move that shapes voice
- a relationship that explains trust, conflict, ambition, loyalty, shame, or taste
- a body-of-work artifact that cost real effort and reveals judgment, taste, obsession, or method
- an obvious public anchor that keeps the response recognizable without becoming caricature
- a non-obvious signal, under-discussed detail, or common misread that makes the response fresher and more authentic
- a work, company, book, episode, or project that gives the agent a concrete framework to use
- a distortion the agent should notice in itself while roleplaying the person

Weak dossier material:

- generic biography
- complete resumes, bibliographies, filmographies, or company histories
- awards and accomplishments that do not shape judgment
- trivia
- facts included only because they are interesting
- "obvious" facts that merely repeat what everyone already knows without saying how to use or avoid them
- "non-obvious" claims that are speculative, clever, or unsupported
- long quotations
- anything likely to cause name-dropping

---

## Retrieval Format

Life events should be written as retrieval cards, not prose biography:

```md
### <Year or period> - <event name>

- **Event:** What happened.
- **Why it matters:** What pattern it formed or revealed.
- **Use when the question involves:** Topics where this event should be considered.
- **Response direction:** How this event should shape the answer.
- **Avoid if:** When this detail would be decorative, too heavy, or misleading.
- **Source:** Source file or pointer.
```

This format matters because it tells the agent when to use the memory and when to leave it alone.

Body-of-work entries should be selective. Do not catalog everything the person has made. Include only artifacts that reveal how the person thinks or that future responses may need to draw from:

```md
### <Artifact or body of work> (<type, period>)

- **What it is:** The book, company, film, podcast, campaign, role, institution, or project.
- **Effort/role:** What this person actually poured into it.
- **What it reveals:** The taste, obsession, method, wound, or judgment pattern it exposes.
- **Use when the question involves:** Topics where this artifact should shape the answer.
- **Avoid if:** When mentioning it would be resume-padding, fan service, or too obvious.
- **Source:** Source file or pointer.
```

Obvious vs non-obvious entries should protect against two failure modes:

- caricature: only repeating what everyone already knows
- cleverness: over-indexing on obscure details and losing the recognizable person

Use this format:

```md
## Obvious vs Non-Obvious

### Obvious anchors

- **<Known pattern/story/framework>:** <Why people associate this with the person. How to use it without parody.>

### Non-obvious signals

- **<Subtle pattern/detail/misread>:** <Why it matters. When it should change the answer.>

### Common misreads

- **Misread:** <What people usually get wrong.>
- **Correction:** <The more accurate interpretation.>
```

---

## Prompting Rule

Flows and commands should frame dossiers this way:

```text
If `.claude/people/dossiers/{NAME_KEBAB}.md` exists, read it as a retrieval map, not as material to summarize.
Pull from it only when a life event, body-of-work artifact, obvious/non-obvious signal, relationship, quote, or framework materially clarifies how this person would respond.
Do not name-drop biography as decoration. Do not summarize the timeline.
```

---

## Length Guidance

A strong dossier can be longer than a person profile, but it should still be curated.

Useful target ranges:

- Compact person: 150-250 lines
- Rich public figure: 250-500 lines
- Historical figure or heavily sourced person: 500-800 lines only if the retrieval cards stay useful

If the dossier starts feeling like a second biography, cut it back into retrieval cards.

---

## Pilot Standard

The Tim Ferriss dossier is the pilot. Use it as the calibration artifact before expanding the pattern to the rest of the roster.

The test is simple: does the next Tim response become more specific, more authentic, and more selective without becoming more bloated?
