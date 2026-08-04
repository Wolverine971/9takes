<!-- .claude/commands/blog_perspective_research_people.md -->

# Build the Shared Perspective-Review Evidence Packet

You build the common factual evidence packet for six independent reviews of one 9takes celebrity personality-analysis draft. You do not review, grade, or edit the article. Your job is to give every evaluator the same checkable evidence without giving them the same interpretation.

## Input

The pipeline supplies all three arguments:

```text
/blog_perspective_research_people <Person> --review-dir=<repo-relative-dir> --draft-sha=<sha256>
```

`$ARGUMENTS`

The review directory already contains:

- `context.json`
- `draft-reviewed.md`, the immutable snapshot every evaluator must audit

Write exactly one artifact: `<review-dir>/evidence-packet.md`.

## Pre-approved operations

- Read repository drafts, research notes, transcripts, taskers, and internal Enneagram material
- Search/fetch the web for primary or reputable sources needed to verify the snapshot
- Write only `<review-dir>/evidence-packet.md`
- Do not edit `draft-reviewed.md`, the live draft, or any prior research file

## Governing distinction

The packet is evidence, not consensus. Every entry must be labeled as one of:

- **verified fact** — directly supported by a checkable source
- **attributed claim** — a named person/outlet's claim, not independently established truth
- **interpretation** — a reasoned reading that evaluators may challenge
- **disputed claim** — credible sources conflict
- **unresolved question** — the available evidence does not settle it

The draft's thesis and Enneagram type are hypotheses. Never promote them to facts merely because the article states them confidently.

## Research order

1. Read `context.json` and confirm the supplied subject and SHA match it.
2. Read the entire frozen draft.
3. Reuse existing repository research first:
   - `docs/content-analysis/research/`
   - matching `youtube-transcripts-people/` or transcript research
   - matching taskers and content-analysis files
   - source links already present in the draft
4. Inventory the draft's 5–10 load-bearing claims: facts, quotes, causal claims, psychological claims, and type claims whose failure would weaken the thesis.
5. Research only the gaps needed to make the common packet usable. Prefer first-party and primary sources.
6. Record contradictory evidence and missing evidence. Do not quietly harmonize it.

## Source tiers

- **Tier 1:** the subject's own full interview, speech, writing, memoir, raw transcript; court/government/official record; direct statistics publisher
- **Tier 2:** named collaborator testimony; reputable reported profile; high-authority trade or institutional source
- **Tier 3:** serious criticism, review, analysis, or well-sourced secondary reporting
- **Tier 4:** fan communities, social discussion, wikis, aggregators. These may establish expectations or lead to sources, but never carry a factual correction alone

For every external source, record title/outlet, date or year, URL, tier, and what it supports. Do not invent precise dates, quotes, transcript locators, or URLs.

## Required output

The file must begin with parseable YAML frontmatter:

```yaml
---
artifact: perspective-evidence-packet
schema_version: 1
subject: <exact context.json subject>
draft_sha256: <exact context.json draft_sha256>
packet_status: complete
compiled_at: <ISO-8601 timestamp>
---
```

Use these exact H2 headings:

```markdown
## Identity and scope

Who this person is, aliases, domain, why the article covers them, and the packet's knowledge cutoff.

## Dated timeline

Only events relevant to understanding or checking the article. Separate event date from publication date.

## First-person evidence

The subject's own words. Include context and what each quotation can and cannot support.

## Third-party testimony

Named collaborators, family, peers, rivals, and substantive critics speaking about the subject.

## Public record, accomplishments, failures, and controversies

Balanced context needed by fans and critics. Attribute contested characterizations.

## Enneagram hypothesis evidence

Evidence for the proposed type, evidence against it, closest alternative, discriminating evidence, and behavior the type does not explain. Keep hypothesis separate from theory conclusions.

## Draft claim inventory

Use stable IDs `CLM-01`, `CLM-02`, and so on. For each: exact or short quoted claim, location, claim class, status, supporting source, counterevidence, and risk if wrong.

## Disputes and unresolved questions

State what remains unknown and which conclusions must therefore stay qualified.

## Source ledger

One row per source: ID, tier, source/outlet, date, URL or repository path, material supported, and limitations.

## Research limitations

What could not be found, accessed, independently verified, or safely inferred.
```

## Exit rules

- Do not declare the article good or bad.
- Do not recommend prose changes.
- Do not imitate any future evaluator.
- Do not add facts with no source trail.
- `packet_status: complete` means the packet honestly records its gaps, not that every question was answered.
- Report the artifact path and the largest unresolved evidence gap, then stop.
