<!-- docs/council/README.md -->

# Council

DJ's private roster of voices, convened via slash commands.

---

## The architecture (two layers)

**Person profiles** live at `.claude/people/<Name>.md`. Each profile describes who the person is, their voice, their domains, their frameworks, their patterns. Flow-agnostic.

**Flow behavior layers** live at `.claude/flows/<flow>.md`. Each flow describes how a person responds in that specific context — the response structure, voice rules, principles.

**Raw research docs** live at `.claude/people/research/<Name-Kebab>.md`. They preserve source inventory, transcript notes, independent findings, and comparison notes against the existing 9takes personality analysis. These are for traceability, not runtime prompting.

**Optional dossiers** live at `.claude/people/dossiers/<Name-Kebab>.md`. A dossier is a selective memory map for richer retrieval: life events, turning points, body of work, obvious vs non-obvious signals, relationships, source-backed voice, and facts to use sparingly. It should not bloat the main person profile.

At invocation, an agent reads `person + flow + optional dossier + source material + question`, then writes a response. The same person can be convened across any flow without duplication.

See `docs/council/architecture.md` for the full design and `docs/council/dossier-spec.md` for the dossier format.

---

## Current roster

- **Tim Ferriss** — Enneagram Type 1. Tactical life design, protocols, interviewing, saying no, Stoic practice, psychedelic reform playbook.
- **Robert Greene** — Enneagram Type 5. Power dynamics, the shadow, historical pattern recognition, the long apprenticeship, reading hidden motives.
- **Neil Strauss** — Enneagram Type 4. Writing craft, confessional work, identity-as-persona, emotional incest / enmeshment, the danger of method-acting your own life.
- **Michael Seibel** — Enneagram Type 1. Product-market fit, founder honesty, pivots, CEO cards, underdog execution, service-after-building.
- **Peter Thiel** — Enneagram Type 6. Contrarian positioning, monopoly thinking, mimetic diagnosis, small trusted tribes, strategic patience, civilizational hedges.
- **Kristen Bell** — Enneagram Type 2. Anxiety regulation, remedy boxes, codependency, marriage infrastructure, the Helper wound, refusing to apologize as developmental work.

---

## Flows

### `/council` — deep counsel on a personal situation

Produces a six-section response per person: First Impressions → How I'd Reframe This → The Face-Value Answer → My Framework Applied → What I'd Think, Feel, and Do → Where I Might Be Wrong. 600–1500 words per person. Output at `docs/council/YYYY-MM-DD_<slug>/`.

### `/poll` — ask everyone the same question

Produces a single take per person in their voice. 150–400 words. No reframing, no think/feel/do, no humility section. Output at `docs/polls/YYYY-MM-DD_<slug>/`.

---

## How invocation works

1. Run `/council` or `/poll` (optionally with the question as an argument).
2. The command creates the session folder and writes `question.md`.
3. The command auto-discovers the roster from `.claude/people/*.md` and spawns one agent per person, in parallel.
4. Each agent reads three files: its person profile, the flow behavior layer, and its deep-source blog (if one exists). It writes a response to the session folder.
5. The orchestrator reports back with paths and a short preview of each response.

---

## Why isolation

In a real room, the loudest move wins the next ten minutes. One person reframes before another can answer. Another diagnoses. A third prescribes a protocol. Dominance dynamics distort the signal.

Here, nobody hears anyone else. No reframing-before-the-others. No yes-and. Five clean takes on the same question. DJ does the synthesis. That is the point.

---

## Adding people

Run `/person-add <Name>`. The command looks for an existing personality analysis at `src/blog/people/drafts/<Name>.md`, drafts the profile, previews it for review, and on approval writes to `.claude/people/<Name>.md`.

If no blog exists yet, the command offers three paths: generate one first via `/blog_content_creator_people` (strongest profile), do web research, or build from DJ's own description.

Once added, the person is automatically convened in `/council` and `/poll` on the next run. No roster table to maintain.

---

## File layout

```
.claude/
├── people/                          # Stable person profiles
│   ├── Tim-Ferriss.md
│   ├── Robert-Greene.md
│   ├── Neil-Strauss.md
│   ├── Michael-Seibel.md
│   ├── Peter-Thiel.md
│   ├── research/                    # Raw research trails
│   │   └── _template.md
│   └── dossiers/                    # Optional deeper retrieval maps
│       ├── _template.md
│       └── Tim-Ferriss.md
├── flows/                           # Flow behavior layers
│   ├── council.md
│   └── poll.md
└── commands/
    ├── council.md
    ├── poll.md
    └── person-add.md

docs/
├── council/
│   ├── README.md                    # this file
│   ├── architecture.md              # full design doc
│   └── YYYY-MM-DD_<slug>/           # one folder per council session
└── polls/
    └── YYYY-MM-DD_<slug>/           # one folder per poll session
```
