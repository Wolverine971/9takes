<!-- .codex/skills/capture-dj-personality-read/references/reasoning-card-contract.md -->

# Reasoning Card Contract

The reasoning artifact has two presentation depths backed by one structured evidence ledger. Its first-person labels are permitted inside an explicitly framed card or internal artifact; they are not default headings for the surrounding profile.

## Compact card

The card must answer the first five-second questions without pretending the case is simpler than it is.

```markdown
[Card eyebrow: DJ's read]

**Likely type:** [type, optional wing/subtype]
**Confidence:** [low / medium / high]
**Strongest alternative:** [type or non-type explanation]

[One-sentence thesis in DJ's voice.]

[Card label: Why this type fits]

1. **[Plain-language pattern]**
   [One concrete observation] -> [DJ's interpretation] -> [type connection]
2. **[Plain-language pattern]**
   [One concrete observation] -> [DJ's interpretation] -> [type connection]
3. **[Plain-language pattern]**
   [One concrete observation] -> [DJ's interpretation] -> [type connection]

**What makes me hesitate:** [Best counterevidence in one or two sentences.]
```

Presentation requirements:

- Keep `DJ's read` inside the card container. Do not paste it into the article as a normal markdown heading.
- Make the type, confidence, thesis, and strongest alternative visible without expansion.
- Keep the collapsed card concise enough to skim on mobile.
- Use direct labels, strong spacing, and minimal decoration.
- Do not hide uncertainty behind a tooltip.
- Let readers expand into the reasoning, sources, counter-case, and AI-method note.
- Do not put more than one primary action inside the card.

## Published reasoning section

Use this order:

1. **[Person]'s revealing pattern**: translate DJ's holistic read into a subject-led thesis and clearly frame it as interpretation.
2. **The public evidence**: three to seven evidence-led claims.
3. **Why the evidence points to this type**: the underlying motivation, defense, attention, or emotional pattern.
4. **The strongest alternate read**: make the best competing case fairly.
5. **What evidence would change the case**: falsifiability and missing evidence.
6. **How the analysis was made**: sources reviewed and the bounded role AI played.

## Evidence ledger schema

```yaml
person: ''
proposed_type: ''
wing_or_subtype: ''
confidence: 'low|medium|high'
thesis: ''
strongest_alternative: ''
holistic_read: ''
claims:
  - label: ''
    observation: ''
    source: ''
    dj_interpretation: ''
    type_connection: ''
    alternative_explanation: ''
    confidence: 'low|medium|high'
counterevidence: []
what_would_change_djs_mind: []
ai_assistance:
  source_discovery: false
  transcript_search: false
  evidence_clustering: false
  counterargument_generation: false
  prose_cleanup: false
dj_reviewed_sources: []
unresolved_gaps: []
```

The final storage format may change during implementation. Preserve these semantic fields even if the code uses TypeScript, JSON, database columns, or markdown frontmatter.

## Voice rules

- Preserve DJ's memorable phrases in the raw artifact, explicit reasoning card, or founder media when accurate.
- Keep the public article's heading, subtitle, dek, and ordinary narrative focused on the person or observed pattern. Never lead them with DJ, the author, `I`, or `my read`.
- Use first-person judgment only inside an explicitly labeled card or method note where authorship is relevant. Do not use it as the structure of the published argument.
- Translate `What keeps standing out to me` into a subject-led heading such as `How Elon Musk turns uncertainty into a map`.
- Keep observation and interpretation in separate sentences when ambiguity is possible.
- State vibes as vibes.
- Avoid diagnostic language and deterministic claims.
- Avoid generic Enneagram exposition that does not advance the argument about this person.

## AI-method note examples

Short:

> AI helped search transcripts, organize source moments, and pressure-test alternate typings. I reviewed the cited material and made the final interpretation.

When DJ has not reviewed every primary source:

> AI helped locate and organize the source material. I reviewed the evidence cited in this section; the personality interpretation is my own current read.

Never claim that AI validated or objectively confirmed the person's type.
