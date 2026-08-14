<!-- docs/growth/question-commenting/04-QUESTION-EDITORIAL-AUDIT-2026-08-13.md -->
# Zero-answer question editorial audit — 2026-08-13

## Outcome

The weak-question problem is a generation and publishing-workflow problem, not a random collection
of bad user submissions.

Production contained 413 live questions at audit time:

- 359 had zero human answers.
- 356 of those 359 came from the June 15 Chorus generation batch.
- All 356 were generated with `google/gemini-2.5-flash` from a famous-person profile whose
  Enneagram type was explicitly supplied in the prompt.
- Only three zero-answer questions were organic/older.

The batch created one question per personality profile and published it immediately. The prompt said
"universal," but also asked for the deepest tension in a typed personality profile. That repeatedly
turned a type fixation into a premise about the reader.

### Correction after the first rewrite pass

The first audit reopened 66 zero-answer questions after rewriting their wording. That pass was not good
enough. It removed some obvious type language but retained the same underlying structure: abstract
dilemmas, forced choices, “how do you decide” constructions, and a self-help voice.

Migration `20260813213000_quarantine_failed_question_rewrites.sql` quarantines all 66 again as
`needs_redesign`. Their original and rewritten copy remain preserved. No answered question was changed;
#567 remains live with its 20 human answers. The replacement standard is documented in
`05-QUESTION-WRITING-STANDARD.md`.

Examples:

| ID  | Source profile      | Source type | Failure in the original question                                       |
| --- | ------------------- | ----------- | ---------------------------------------------------------------------- |
| 566 | Will Smith          | 3           | Assumes the reader deliberately built an image.                        |
| 565 | Tyler Cowen         | 5           | Grand, abstract "true cost" language and a Type 5 premise.             |
| 564 | Travis Kalanick     | 8           | Assumes unusual ownership, power, and something significant to defend. |
| 561 | Kourtney Kardashian | 1           | Converts a Type 1 fixation into an assumed moral dilemma.              |

Notably, #564 was generated from a Type 8 source even though it can initially read as Type 1. The
problem is broader than obvious archetype vocabulary: the questions inherit a narrow emotional
starting position and ask everyone else to role-play it.

## Editorial bar

A publishable 9takes question should:

1. Be understood when read aloud once.
2. Start from a recognizable decision, reaction, boundary, or tradeoff.
3. Make several incompatible answers feel reasonable.
4. Be answerable from experience without unusual fame, power, trauma, or success.
5. Avoid assuming a trait, wound, achievement, status, or Enneagram fixation.
6. Sound like a perceptive friend, not a therapist, philosopher, executive coach, or AI.
7. Usually fit in 10–24 words and ask one clean question.

Automatic rejection signals:

- "What is the true cost..."
- "What does one do..."
- "When you have achieved..."
- Premises such as "you always help," "you built an image," "you see what others cannot," or "you
  avoid conflict."
- A famous-person biography disguised as a universal hypothetical.
- A forced emotional conclusion or false binary.
- A near-duplicate of a stronger existing question.

The useful distinction is **specific situation, open interpretation**. Specificity should live in the
situation, not in a presumed personality.

## Initial decisions (superseded for the 66-question rewrite set)

The migration `20260813203000_question_editorial_audit.sql` applies a recoverable three-way review:

- **66 approved:** 64 chorus questions with distinct tensions plus organic questions #115 and #204.
  Their original text remains in `question`; revised public copy is stored in `question_formatted`.
- **292 needs review:** the remaining zero-answer chorus questions are flagged and hidden from public
  question pages, browse/search, personality-profile Chorus widgets, and homepage distribution.
  Their rows, URLs, source profile links, and generated takes are preserved for later salvage.
- **1 rejected:** seasonal organic question #150 is soft-removed.

Question #567 (20 human answers at audit time) and every other answered question remain untouched.

The 66 initially approved zero-answer questions are now quarantined by the corrective migration above.

### Four representative revisions

| ID  | Before                                                                                                                          | Reviewed public copy                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 566 | When you have worked hard to build a certain image, how do you react when that image is suddenly challenged or broken?          | When people misunderstand who you are, do you try to correct them or let their opinion stand?         |
| 565 | What is the true cost of pursuing profound understanding and knowledge above all other things?                                  | What have you sacrificed to understand something more deeply, and was it worth it?                    |
| 564 | When you have built something significant, how do you decide what parts of it are truly yours to defend, and what to let go of? | When something you helped build changes direction, what makes you stay and fight for it or walk away? |
| 561 | When something feels deeply out of line with your principles, how do you decide whether to speak up or let it go?               | When everyone else lets something slide, how do you decide whether to speak up?                       |

## Prevention

`scripts/generate-chorus.mjs` now separates question writing from Enneagram answer generation:

- The question-writing stage receives no source profile, biography, occupation, persona title, or
  Enneagram type. It starts from an ordinary social scene instead.
- It generates one candidate for each of eight different scene seeds, three divergent sample answers
  per candidate, and explicit quality scores.
- Deterministic checks reject decision calculus, forced choices, inflated premises, AI templates, type
  leakage, and malformed questions.
- A separate veto-editor pass rejects questions that merely restate a scene and candidate sets whose
  sample answers change examples without changing emotional logic.
- Question writing and veto review default to `anthropic/claude-sonnet-4`; the lower-cost Flash model is
  reserved for the nine takes after a human approves the question.
- Generation is dry-run by default and performs no database writes.
- Publishing requires one explicit slug plus exact human-reviewed question copy.
- Dry runs do not generate Enneagram takes. The type layer begins only after exact copy is approved.
- Only after copy is supplied does the script generate the nine type-shaped answers and persist the
  approved question.

This preserves the right use of the Enneagram: it shapes the spread of answers after a neutral human
situation is chosen. It no longer shapes the premise everyone is forced to answer.
