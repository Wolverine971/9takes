<!-- docs/content-analysis/enneagram-blog-grading-rubric.md -->

# Enneagram Blog Quality Grading Rubric

Standardized scoring system for published Enneagram blog content on 9takes. This rubric applies to mixed topics (mental health, overview/foundation, nine-types, relationships, workplace, development, situational) using one shared core model plus category modifiers.

**Coverage**: Published posts where frontmatter has `blog: true` and `published: true` in:

- `src/blog/enneagram/*.md`
- `src/blog/enneagram/mental-health/*.md`

**Excluded**:

- `src/blog/enneagram/first-impression-cheat-sheet.md` (`blog: false`)
- `src/blog/enneagram/blog-optimization-strategies.md` (internal strategy doc)
- all non-primary channel variants and review artifacts: `.review.md`, `.twitter.md`, `.reddit.md`, `.instagram.md`, `.meta.json`

---

## Scoring Dimensions (Core 6)

Score each dimension on a 1-10 scale.

### 1. Framing and Reader Promise

How clearly the opening establishes stakes, audience relevance, and a concrete promise that the article delivers.

- **9-10**: Immediate high-stakes framing, clear promise, and full delivery
- **7-8**: Strong opening and mostly fulfilled promise
- **5-6**: Serviceable framing but vague stakes or partial payoff
- **3-4**: Generic setup, weak promise, poor follow-through
- **1-2**: No meaningful hook or promise

### 2. Enneagram Depth and Accuracy

How well the post uses real Enneagram mechanics (motivation, centers, arrows, wings/instincts where relevant) without stereotype-only labeling.

- **9-10**: Mechanically sound and explanatory; resolves non-obvious patterns
- **7-8**: Mostly accurate with useful depth
- **5-6**: Correct basics but often descriptive rather than explanatory
- **3-4**: Surface labels, weak mechanics
- **1-2**: Substantive inaccuracy or cosmetic Enneagram usage

### 3. Evidence and Credibility

Quality of sourcing and claim support (specificity, source quality, factual discipline).

- **9-10**: Strong sourcing with specific evidence supporting major claims
- **7-8**: Adequate sourcing and mostly supported claims
- **5-6**: Mixed support; several broad/unsupported assertions
- **3-4**: Sparse sourcing; interpretation outweighs evidence
- **1-2**: Largely unsupported claims

### 4. Practical Utility

How actionable and usable the guidance is for readers.

- **9-10**: Highly actionable, type-specific, and immediately usable
- **7-8**: Useful guidance with decent specificity
- **5-6**: Some utility but uneven application
- **3-4**: Mostly abstract; limited reader actionability
- **1-2**: Minimal practical value

### 5. Writing and Structure

Readability, pacing, section architecture, and clarity.

- **9-10**: Clear flow, strong pacing, easy scan/read at length
- **7-8**: Clean structure with minor friction
- **5-6**: Uneven pacing or dense/repetitive sections
- **3-4**: Structural drag and readability issues
- **1-2**: Hard to follow

### 6. Originality and Insight

Freshness of synthesis and resistance to generic/template language.

- **9-10**: Distinctive ideas, specific insight, strong swap-test resistance
- **7-8**: Some novel framing beyond common summaries
- **5-6**: Familiar framing with limited novel insight
- **3-4**: Formulaic and interchangeable
- **1-2**: Generic compilation

---

## Base Overall Formula

`overall_base = average(core_6_scores)` (rounded to 1 decimal)

### Letter Grade Mapping

| Grade  | Score Range | Meaning                                |
| ------ | ----------- | -------------------------------------- |
| **A+** | 9.5-10.0    | Exceptional                            |
| **A**  | 9.0-9.4     | Strong benchmark                       |
| **B+** | 8.5-8.9     | Publication threshold met              |
| **B**  | 8.0-8.4     | Publishable with targeted improvements |
| **C**  | 7.0-7.9     | Needs significant revision             |
| **D**  | 6.0-6.9     | Major rewrite required                 |
| **F**  | Below 6.0   | Not publishable                        |

**Publication threshold**: `8.5` (B+)

---

## Category Modifiers

Modifiers adjust `overall_base` and must be documented with a one-line reason when non-zero.

### 1) Mental-Health Safety Gate (Mandatory)

Applicable category: `mental-health`

Critical checks (all required to pass):

- No diagnostic claims presented as fact
- No prescriptive medication directives without clinician boundary
- Crisis escalation language where applicable (e.g., 988/911)
- Clear educational-not-medical boundary

If any critical check fails:

- `safety_gate = fail`
- Final score is capped at **D (6.9)** regardless of base score

### 2) Research-Heavy Modifier

Applicable to foundation/science-heavy pages with empirical or historical claims.

- If sourcing precision is insufficient for major claims: apply `-0.3` to `-1.0`
- Apply cap at **B (8.4)** when research-heavy support is materially weak

### 3) Multi-Type Template Fatigue Modifier

Applicable when nine-type matrix structures are mechanically repetitive.

- If differentiation is weak and section scaffolding repeats heavily: apply `-0.2` to `-0.8`

### 4) Modifier Transparency

Every non-zero modifier must include a one-line reason in grading logs.

---

## Weakness Tags (Required)

Use one or more as applicable:

- `weak-hook`
- `shallow-enneagram`
- `unsupported-claims`
- `low-utility`
- `template-fatigue`
- `style-friction`
- `safety-boundary-risk`
- `overlap-duplication`

---

## Grading Data Contract

```json
{
	"slug": "string",
	"path": "string",
	"category": "mental-health|foundation|relationships|workplace|development|situational|nine-types",
	"scores": {
		"framing": 0,
		"enneagram_depth": 0,
		"evidence": 0,
		"utility": 0,
		"writing": 0,
		"originality": 0
	},
	"modifier_adjustment": 0,
	"modifier_reason": "string",
	"safety_gate": "pass|fail|n/a",
	"overall": 0,
	"letter": "A+|A|B+|B|C|D|F",
	"publishable": true,
	"weakness_tags": ["string"],
	"rewrite_priority": "none|light|major|rebuild",
	"graded_at": "YYYY-MM-DD"
}
```

---

## Workflow

1. Build in-scope inventory from frontmatter (`blog:true`, `published:true`)
2. Assign one primary category using deterministic precedence:
   - `mental-health` > `nine-types` > `foundation` > `relationships` > `workplace` > `development` > `situational`
3. Score all 6 core dimensions independently
4. Apply category modifiers and safety gate rules
5. Record grading objects in the quality review log
6. Sort category rankings ascending by overall score
7. Mark weakest set per category as:
   - bottom 20% **or** all posts below 8.0, whichever yields more
8. Assign rewrite priority:
   - `light` (8.0-8.4)
   - `major` (7.0-7.9)
   - `rebuild` (<7.0 or safety fail)

---

## Rollout Order

1. Mental Health
2. Foundation (overview + resources)
3. Nine Types
4. Relationships
5. Workplace
6. Development
7. Situational
8. Final cross-category weakest ranking
