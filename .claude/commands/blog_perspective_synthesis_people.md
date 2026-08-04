<!-- .claude/commands/blog_perspective_synthesis_people.md -->

# Synthesize the Independent Perspective Jury

You are the adjudicator for six independent perspective reviews of one frozen 9takes people draft. You do not edit the article and you do not reward consensus for its own sake. You determine which findings are substantiated, which changes are worth making, which hits must be protected, and which conflicts require editorial judgment.

## Input

```text
/blog_perspective_synthesis_people <Person> --review-dir=<repo-relative-dir> --draft-sha=<sha256>
```

`$ARGUMENTS`

Read only:

- `context.json`
- `draft-reviewed.md`
- `evidence-packet.md`
- the six complete review documents

Write exactly `<review-dir>/synthesis.md`. Do not edit the frozen or live draft.

## Adjudication rules

1. Re-read every cited passage in the frozen draft. Do not accept a reviewer's characterization without checking it.
2. Separate evidence-backed problems from preferences.
3. Treat a finding as a mandatory P0 repair when it is:
   - objectively verifiable and materially wrong or misleading
   - a quote/context distortion or unsupported sensitive allegation
   - an unfair or totalizing psychological claim that breaks the subject-fairness standard
   - a central Enneagram theory error
   - an omission or incomprehensibility that invalidates the core thesis
   - independently detected by multiple perspectives and confirmed by your reading as a trust break
4. A lone reviewer may still identify a valid P0 inside that reviewer's domain. Convergence is evidence, not a voting requirement.
5. Fan requests for praise, critic requests for condemnation, subject-proxy demands for approval, unfamiliar-reader demands for full biography, and Enneagram-expert demands for more jargon are out of scope.
6. Prefer the minimum repair that resolves the trust problem. Do not turn the brief into six rewrites.
7. Every accepted change must identify what it could accidentally damage.
8. Preserve distinctiveness. The default delight target is the informed fan: the finished piece should make a knowledgeable reader see a familiar fact differently.
9. Do not hide uncertainty. If a factual or ethical decision needs research, classify it as research-required rather than improvising a repair.
10. You may consult at most three additional sources, only to adjudicate a concrete conflict. Log them in the affected item.

## Decision statuses

Every material reviewer finding must end in one of:

- **accept** — include in P0/P1/P2 with a concrete action
- **reject** — identify the finding and explain why it would weaken, bloat, distort, or exceed the article's scope
- **defer** — useful but not worth changing in this revision
- **research_required** — name the exact unresolved question and source needed

Do not silently drop a blocker from any evaluator.

## Required output

Begin with parseable YAML frontmatter:

```yaml
---
artifact: perspective-synthesis
schema_version: 1
subject: <exact context subject>
draft_sha256: <exact snapshot sha>
synthesis_status: complete
delight_target: fan
p0_open: <integer>
p1_accepted: <integer>
research_required: <integer>
protected_hits: <integer>
requires_revision: true | false
synthesized_at: <ISO-8601 timestamp>
---
```

Use these exact H2 headings:

```markdown
## Executive verdict

## P0 — mandatory red-flag repairs

## P1 — accepted high-value improvements

## P2 — optional opportunities

## Research required before deciding

## Conflicts and editorial tradeoffs

## Rejected feedback

## Protected hits

## Revision brief
```

Assign stable IDs `P0-01`, `P1-01`, `P2-01`, `RQ-01`, and `PROTECT-01`.

Every accepted P0/P1 item must include:

- originating review IDs and perspectives
- exact location and quoted passage
- adjudicated problem
- evidence and confidence
- minimum repair
- expected reader benefit
- protected hit or tradeoff at risk
- acceptance test that a verifier can answer pass/fail

For an empty section, write `None.` Never invent work to fill it.

The Revision brief must give the later editor an ordered, bounded worklist:

1. P0 items
2. research-required decisions that can be safely resolved
3. accepted P1 items
4. only the highest-value P2 item if it pays for itself
5. protected-hit regression checks

Report the synthesis path, number of P0 items, number of accepted P1 items, research-required count, and the most important protected hit, then stop.
