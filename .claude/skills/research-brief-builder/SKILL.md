---
name: research-brief-builder
description: Turn messy notes, source files, research logs, or a topic into a concise writing brief with claim-evidence structure, open questions, angle selection, and a ready-to-write outline. Use after research and before drafting.
argument-hint: '<person, topic, file path, or notes>'
disable-model-invocation: true
---

# Research Brief Builder

Use this skill to convert research into a draft-ready brief.

If `$ARGUMENTS` is empty, ask for one of:

1. A person name
2. A topic
3. A file path
4. A bundle of notes to structure

Examples:

```text
/research-brief-builder Taylor Swift
/research-brief-builder src/blog/people/drafts/Pedro-Pascal.md
/research-brief-builder docs/content-research/taylor-swift-evidence-log.md
```

## Read First

Load the minimum relevant context:

- `docs/brand/README.md`
- `docs/writing-system/01-content-creation-workflow.md`
- `docs/writing-system/02-blog-optimization-framework.md`

If this is a people-analysis workflow, also load:

- `.claude/commands/blog_content_creator_people.md`
- `docs/blogs-famous-people/prompts/research-prompt.md`

If an evidence log exists, use that before re-researching.

## Workflow

### 1. Resolve the input bundle

Read the target materials and identify:

- what the piece is trying to argue
- who it is for
- what evidence is already solid
- what still feels muddy or unsupported

### 2. Choose one dominant angle

The brief must answer:

- what is the core claim?
- why would a reader care now?
- what makes this angle sharper than a generic profile?

Kill side quests. If the input contains three possible essays, pick the strongest one and demote the others to optional supporting angles.

### 3. Build a claim-evidence spine

List the non-negotiable claims that the final draft should be built around.

For each claim, capture:

- the evidence that supports it
- the strongest quote or example
- the risk level if overstated
- what kind of section it belongs in

### 4. Expose the weak points

Explicitly surface:

- unsupported claims
- missing scenes or quotes
- factual risks
- places where the narrative jumps ahead of the evidence

### 5. Produce a draft-ready brief

Use this format:

```markdown
# Research Brief: [Target]

## Brief Thesis

- One-sentence argument

## Reader + Job

- Who this is for
- What they want answered

## Dominant Angle

- Why this angle wins
- What angles were rejected

## Claim-Evidence Spine

| Claim | Best evidence | Best quote/example | Risk level | Section use |

## Open Questions

- ...

## Section Blueprint

1. Hook
2. Type/angle declaration
3. Evidence section 1
4. Evidence section 2
5. Counter-signal or ambiguity section
6. Takeaway / broader meaning

## Source Deployment Plan

- Which quote/example belongs in which section

## Red Flags

- what to verify
- what to soften
- what to cut

## Next Step

- ready to draft / needs more research
```

## Rules

- A brief is not a draft. Do not waste space polishing prose.
- Optimize for clarity, sequencing, and evidence density.
- If the input is messy, make the structure cleaner than the notes.
- If the evidence is thin, the brief should say "needs more research" instead of pretending it is ready.
- Prefer one sharp thesis over a broad but mushy summary.

## Save Behavior

Do not write a file unless the user asks or the workflow clearly calls for it.

If saving is useful, default to:

- `docs/content-research/[slug]-brief.md`
