---
name: capture-dj-personality-read
description: Interview DJ about why he reads a public figure as a particular personality or Enneagram type, preserve his unguided riff and voice, pressure-test the reasoning, separate observations from interpretations, document AI assistance, and draft a compact reasoning card plus an extended evidence-led section for a 9takes personality-analysis blog. Use when DJ wants to riff on a person, explain how he arrived at a typing, create or revise a "DJ's read" section, prepare a founder-led reasoning video or Reel, or turn his impressions and source observations into publishable structured analysis.
path: .codex/skills/capture-dj-personality-read/SKILL.md
---

# Capture DJ's Personality Read

Turn DJ's lived impressions, pattern recognition, and source observations into a transparent personality argument without replacing his judgment with AI prose.

## Non-negotiable contract

- Let DJ riff before directing him. Ask one open invitation, then wait.
- Treat DJ's vibe as valuable interpretation, not as a verified fact.
- Distinguish what the person demonstrably said or did from what DJ infers.
- Do not diagnose, claim private knowledge, or present a public typing as confirmed fact.
- Do not manufacture quotations, motives, childhood causes, or source details.
- Use AI to organize, challenge, source, and clarify. DJ owns the final read.
- Preserve uncertainty and counterevidence. A persuasive read shows what would falsify it.
- Never edit or publish a personality-analysis blog until DJ approves the reasoning artifact.
- Preserve unrelated work and inspect current repository state before any later file edit.

## Workflow

### 1. Resolve the subject without interrupting the riff

Identify the person, DJ's current type hypothesis, and the intended output if already supplied. Do not require the type before beginning; DJ may discover or revise it through the interview.

If this is a repository-backed run, locate the current person article and any research, transcripts, review artifacts, or source trails. Reading those may inform follow-up questions, but do not feed their conclusions into DJ's opening riff.

Start with one invitation:

> Riff freely on what you notice about [person]. Talk about the moments, patterns, contradictions, energy, or vibes that keep standing out. Do not organize it yet. I will listen first and ask specific questions afterward.

Then wait. Do not ask a list of questions in the same turn.

### 2. Capture the raw read

After the riff, reflect it back in DJ's language using four buckets:

- **Observed receipts:** concrete behavior, wording, decisions, recurring public patterns, or source moments.
- **DJ's interpretations:** what DJ thinks those receipts reveal.
- **Holistic read:** felt sense, energy, contradictions, or vibes that are real inputs to DJ's judgment but not independently verifiable.
- **Open loops:** claims needing an example, source, mechanism, counter-case, or clearer connection to a type.

Ask DJ to correct the reflection before tightening it. Preserve distinctive phrases he may want to say on camera.

### 3. Interview in small adaptive rounds

Read `references/interview-question-bank.md`. Ask three to five questions per round, chosen to close the highest-value open loops. Do not dump the whole question bank.

Use this order unless the riff makes another order more natural:

1. Concrete receipts
2. Interpretation and mechanism
3. Enneagram or personality connection
4. Strongest alternative and counterevidence
5. Confidence and what would change DJ's mind
6. Practical implication or revealing contradiction

Use plain conversational language. Invite another riff when DJ is exploring something important.

### 4. Build the evidence ledger

For each important claim, record:

| Field             | Meaning                                                      |
| ----------------- | ------------------------------------------------------------ |
| Observation       | What is publicly observable or directly sourced              |
| Source            | Link, clip, timestamp, article, or `source needed`           |
| DJ interpretation | What DJ thinks the observation reveals                       |
| Type connection   | Why it supports the proposed type, wing, subtype, or pattern |
| Alternative       | A plausible non-type or alternate-type explanation           |
| Confidence        | Low, medium, or high, with a short reason                    |

Do not upgrade a vibe into an observation. Do not discard a vibe merely because it lacks a citation; label it as DJ's holistic read.

### 5. Run the counter-case

Before drafting, ask the strongest version of:

- What other type best explains this person?
- Which visible behavior is most likely role, status, culture, neurotype, trauma, or media training rather than Enneagram?
- Which fact does the proposed typing explain poorly?
- What evidence would make DJ change his mind?

If the counter-case is weak because evidence is missing, say so. Do not create false balance.

### 6. Document AI's role

Record which work AI performed, such as transcript search, source discovery, evidence clustering, counterargument generation, or prose cleanup. Record which primary sources DJ personally reviewed.

Never say AI verified a psychological conclusion. AI may verify that a source contains a statement; DJ interprets what it means.

### 7. Draft the output

Read `references/reasoning-card-contract.md`. Produce these artifacts in order:

1. **Reasoning snapshot:** proposed type, confidence, one-sentence thesis, strongest alternative.
2. **Compact card copy:** three to five strongest observation-to-interpretation connections.
3. **Extended reasoning section:** the fuller argument, holistic read, counter-case, and what would change DJ's mind.
4. **Evidence ledger:** source-ready claim table with unresolved gaps marked.
5. **AI-method note:** concise disclosure of AI assistance and DJ's role.
6. **Optional founder media output:** only when requested, extract a 30-to-60-second Reel outline and a two-to-four-minute page-video outline from DJ's own phrases.

Use first person where DJ is making a judgment: `I read this as...`, `What keeps standing out to me...`, `The part that makes me hesitate...`.

Avoid clinical certainty. Prefer `reads as`, `suggests`, `my current read`, and `the strongest public evidence I see` over `is`, `proves`, or `reveals the truth`.

### 8. Approval gate

Show the artifact to DJ and ask for corrections to meaning, emphasis, certainty, and voice. Do not implement the card, modify the blog, change the stored type, or publish until he explicitly approves that next action.

## Repository handoff

When DJ approves implementation:

- Inspect `git status --short` and relevant diffs first.
- Use the current 9takes tasker and Svelte instructions before editing UI.
- Store structured reasoning separately from presentation when possible so the same approved material can support the page card, extended section, Reel, source trail, and future AI transparency UI.
- Keep the compact card skimmable. Put nuance, the evidence ledger, and methodology in expandable or deeper sections.
- Preserve `lastmod` and all unrelated parallel work.

## Quality bar

The result succeeds when a skeptical reader can answer:

- What did DJ actually observe?
- What did he infer from it?
- Why does that connect to this type?
- What is the best competing explanation?
- How confident is he and why?
- What did AI do, and what judgment remained DJ's?

If any answer is unclear, continue the interview instead of polishing around the gap.
