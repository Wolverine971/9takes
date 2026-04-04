---
name: evidence-led-research
description: Build an evidence log for a public figure, topic, or draft before writing. Use when researching personality analyses, verifying factual claims, collecting quote support, or checking whether a draft has enough source backing.
argument-hint: '<person, topic, or file path>'
context: fork
agent: general-purpose
disable-model-invocation: true
---

# Evidence-Led Research

Use this skill when the job is to gather and validate evidence, not to draft the final piece.

If `$ARGUMENTS` is empty, ask for one of:

1. A person name
2. A topic
3. A file path

Examples:

```text
/evidence-led-research Taylor Swift
/evidence-led-research src/blog/people/drafts/Paris-Hilton.md
/evidence-led-research enneagram and ADHD
```

## Read First

Load the minimum relevant context first:

- `docs/blogs-famous-people/prompts/research-prompt.md`
- `docs/content-analysis/fact-check-priority-2026-02-20.md`
- `docs/brand/README.md`

If the target is a people draft, also search and load:

- `src/blog/people/drafts/[Person].md`
- `youtube-transcripts-people/*review.md`
- `youtube-transcripts-people/*`
- `youtube-transcript-research/*`

If the user passed a file path, read that file before searching elsewhere.

For the exact output shape, use:

- [template.md](template.md)
- [example-output.md](example-output.md)

## Workflow

### 1. Resolve the target

- Direct file path: use it
- Person name: check `src/blog/people/drafts/`, transcript review docs, and related research docs
- Topic: search the repo for drafts, notes, transcripts, and prior analysis

### 2. Build a source stack

Prefer sources in this order:

1. Direct transcripts or primary interviews
2. Official statements, websites, filings, or published first-party materials
3. High-quality reporting with dates and attribution
4. Existing 9takes research docs

For every source, capture:

- source type
- date
- why it is credible
- what it is useful for

### 3. Separate claim types

Label findings before judging them:

- `hard_fact`: dates, numbers, awards, rankings, timelines, business facts
- `direct_quote`: exact words attributed to a person
- `observed_behavior`: specific public actions, clips, patterns, choices
- `interpretive_bridge`: the psychological meaning inferred from the evidence

Do not treat `interpretive_bridge` as fact.

### 4. Verify in priority order

Verify these first:

- unusual numbers
- dates and timelines
- direct quotes
- controversy claims
- rankings, records, or "first/most/biggest" language
- medical, legal, or diagnosis-adjacent claims

If a claim is weak, say so directly. If sources conflict, preserve the conflict instead of smoothing it away.

### 5. Build the evidence log

Use the supporting template and follow its section order exactly.

## Rules

- Never invent citations, dates, or quote wording.
- Keep exact quotes exact. If unsure, paraphrase and mark it as paraphrase.
- Separate fact-checking from Enneagram interpretation.
- Treat transcript-backed evidence as stronger than generic profile summaries.
- If the evidence is thin, say the draft is under-supported.
- ultrathink when sources conflict or the evidence chain is weak.

## Save Behavior

Do not write a file unless the user asks or the workflow clearly calls for it.

If saving is useful, default to:

- `docs/content-research/[slug]-evidence-log.md`
