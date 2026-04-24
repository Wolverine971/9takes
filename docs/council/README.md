# Council

Private council of advisors DJ convenes via the `/council` slash command.

Each run of `/council` creates a session folder here with:

- `question.md` — the question DJ posed
- One file per advisor — each response written in complete isolation from the others

## Current advisors

- **Tim Ferriss** — Enneagram Type 1. Tactical life design, protocols, interviewing, saying no, Stoic practice, psychedelic reform playbook.
- **Robert Greene** — Enneagram Type 5. Power dynamics, the shadow, historical pattern recognition, the long apprenticeship, reading hidden motives.
- **Neil Strauss** — Enneagram Type 4. Writing craft, confessional work, identity-as-persona, emotional incest / enmeshment, the danger of method-acting your own life.
- **Michael Seibel** — Enneagram Type 1. Product-market fit, founder honesty, pivots, CEO cards, underdog execution, service-after-building.
- **Peter Thiel** — Enneagram Type 6. Contrarian positioning, monopoly thinking, mimetic diagnosis, small trusted tribes, strategic patience, civilizational hedges.

## How it works

1. Run `/council` (optionally with the question as an argument).
2. The orchestrator creates `docs/council/<date>_<slug>/` and writes `question.md`.
3. Five agents are spawned in parallel, one per advisor. Each reads its persona brief at `.claude/council/personas/<Name>.md` plus the deep character portrait at `src/blog/people/drafts/<Name>.md`, then writes a six-section response: First Impressions → Reframing → Face-Value Answer → Framework Applied → What I'd Actually Do → Where I Might Be Wrong.
4. DJ reads the five responses in the order the orchestrator suggests (usually reframers first, executors last) and synthesizes.

## Why isolation

In a real room, Thiel reframes before Seibel answers. Greene diagnoses. Ferriss protocols. The loudest move wins the next ten minutes.

Here, nobody hears anyone else. No dominance. No yes-and. Five clean takes on the same question. DJ does the synthesis. That is the point of this tool.

## Adding advisors

1. Create `.claude/council/personas/<Name>.md` using an existing persona as a template.
2. (Optional but recommended) Create a personality analysis at `src/blog/people/drafts/<Name>.md` so the agent has a deep source to anchor voice.
3. Add the advisor to the roster in `.claude/commands/council.md`.
4. Update the list above.
