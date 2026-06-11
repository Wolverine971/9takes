<!-- docs/instagram/instagram-saves-engine-architecture.md -->

# Instagram Saves Engine Architecture (Slim)

_Created: 2026-05-17_
_Revised: 2026-05-18 — slimmed to remove unneeded Python layer; Claude in Chrome + Claude Code handles the workflow end to end._

## Integrated Flow (Warmup feeds Saves)

The saves engine has two upstream capture paths. Both land in the same `inbox/` and feed the same triage → ideate → assets pipeline.

```text
                       ONE INSTAGRAM SESSION, TWO OUTPUTS
                       ══════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│                       /instagram-warmup                                  │
│                       (single browser sweep)                             │
│                                                                          │
│   Pre-flight ─▶ account check ─▶ load CRM + seen-post list ─▶ scan       │
│                                                                          │
│   For each post the agent scrolls past:                                  │
│   ┌─────────────────────────────────────────────────────────────────┐    │
│   │   ┌────────────────────────┐    ┌────────────────────────┐      │    │
│   │   │  FILTER A: engagement  │    │  FILTER B: save bar    │      │    │
│   │   │  "should I comment?"   │    │  "is this a pattern?"  │      │    │
│   │   └─────────┬──────────────┘    └─────────┬──────────────┘      │    │
│   │             │ hit                         │ hit                 │    │
│   └─────────────┼─────────────────────────────┼─────────────────────┘    │
│                 ▼                             ▼                          │
│   ┌──────────────────────────┐    ┌──────────────────────────┐           │
│   │  Reply Queue             │    │  Save Candidates         │           │
│   │  (warmup doc + CRM)      │    │  (Phase 7, inline write) │           │
│   └────────┬─────────────────┘    └─────────────┬────────────┘           │
└────────────┼────────────────────────────────────┼────────────────────────┘
             │                                    │
             ▼                                    ▼
   docs/instagram/                       docs/instagram/saves/inbox/
   daily-engagement/                       YYYY-MM-DD_<shortcode>.md
   YYYY-MM-DD_warmup.md                    (capture_method: warmup_assisted)
             │                                    │
             ▼                                    ▼
   ┌──────────────────────┐           ┌────────────────────────────┐
   │ /instagram-reply     │           │ /instagram-saves triage    │
   │ Draft + post replies │           │ Score, mv to processed/    │
   │ Log to CRM           │           │ or rejected/               │
   └──────────────────────┘           └─────────────┬──────────────┘
                                                    ▼
                                      ┌────────────────────────────┐
                                      │ /instagram-saves ideate    │
                                      │ 3–5 ideas/save → ideas/    │
                                      └─────────────┬──────────────┘
                                                    ▼
                                      ┌────────────────────────────┐
                                      │ /instagram-saves assets    │
                                      │ (or /distribute-instagram) │
                                      │ → assets/                  │
                                      └─────────────┬──────────────┘
                                                    ▼
                                                 PUBLISH

   Parallel path (manual curation, unchanged):
   You bookmark on IG ─▶ /instagram-saves capture ─▶ inbox/
                          (capture_method: chrome_assisted)
```

Two capture paths, one downstream pipeline. The `capture_method` frontmatter field distinguishes agent-curated saves (`warmup_assisted`) from human-curated saves (`chrome_assisted`) at triage time.

## Executive Take

The source workflow (`instagram-poster.md`) has the right conceptual split:

1. Dumb capture.
2. Structured storage.
3. Creative reframing.

What it gets wrong for 9takes: it leans on a Python/Notion/launchd stack to do work that Claude in Chrome plus Claude Code already does natively. The 9takes repo is a Node/TypeScript codebase with one Python file in `scripts/`. Importing a Python toolchain (pydantic, python-frontmatter, beautifulsoup4) to dedupe URLs and move files between folders is out of pattern and out of scale.

The slim architecture:

- **Capture**: Claude in Chrome reads the Instagram Saved page directly, or DJ pastes URLs into a queue file.
- **Storage**: Markdown files in `docs/instagram/saves/{inbox,processed,rejected,ideas,digests,assets}/`. Folder location IS the status. No JSON index.
- **Reframing**: A single `.claude/commands/instagram-saves.md` command with modes (`capture`, `triage`, `ideate`, `assets`, `digest`).
- **Scheduling**: On-demand. Not scheduled until daily use proves a recurring chore exists.

No Python scripts in MVP. Add one only if a deterministic chore proves recurring AND annoying. If we ever do need a script, write it in TypeScript/Node to match the rest of `scripts/`.

## What Lives Where

```text
docs/instagram/saves/
  README.md                    operator notes
  .gitignore                   ignores .local/
  .local/config.json           collection allowlist, capture account (gitignored)
  templates/
    save.md                    raw save frontmatter + sections
    idea.md                    content idea frontmatter + sections
  inbox/                       new captures, awaiting triage
    YYYY-MM-DD_<shortcode>.md
  processed/                   triaged saves that became ideas
  rejected/                    triaged saves we said no to (keep for dedupe)
  digests/                     YYYY-MM-DD digests when we want a roll-up
  ideas/                       content ideas derived from saves
  assets/                      publish-ready asset packs (or link out to docs/distribution-assets/)
```

**State is the folder.** A file in `inbox/` is unprocessed. A file in `processed/` has been triaged and (usually) has a matching `ideas/` file. Dedupe is "does a file with this shortcode already exist in any of these folders?"

## The One Command

`.claude/commands/instagram-saves.md`

Modes:

- `capture` — Claude in Chrome reads the active Instagram Saved page and writes raw save files to `inbox/`. Requires explicit account verification first.
- `triage` — Reads `inbox/`, scores each save, moves to `processed/` (with idea) or `rejected/`.
- `ideate` — Generates 3–5 content ideas per saved post in `inbox/` or `processed/` without an idea yet.
- `assets` — Converts an approved idea into an Instagram asset pack (delegates to `/distribute-instagram` logic).
- `digest` — Builds a Markdown roll-up of today's or this week's inbox. Optional; only run when useful.

All modes share the same hard pre-flight:

1. Read the 9takes voice docs.
2. Verify the active Instagram account matches `capture_account` in `.local/config.json`.
3. Never like, comment, follow, DM, or post.

## Capture Modes Ranked

1. **Claude in Chrome assisted capture** (default once tested).
2. **Manual URL paste** — DJ drops URLs + notes into an inbox-staging file; `capture` reads it and writes proper save files. Lowest risk path for the first 10–20 saves.
3. **Instagram data export import** — only if/when a backfill is needed. Build this script the day you have the export, not before.
4. **Cookie-authenticated web sync** — explicitly out of scope. Account-risky and out of pattern.

## Why No Python

Each Python script the original plan called for, with the actual replacement:

| Proposed Python script       | Slim replacement                                                          |
| ---------------------------- | ------------------------------------------------------------------------- |
| `ingest_manual.py`           | DJ pastes URLs into an inbox file; Claude writes save files               |
| `ingest_chrome_capture.py`   | Claude in Chrome writes save files directly during `capture` mode         |
| `normalize_saves.py`         | Shortcode regex in the command instructions; Claude extracts it inline    |
| `build_digest.py`            | `digest` mode in the command                                              |
| `mark_status.py`             | `mv` via Bash inside the command                                          |
| `validate_saves.py`          | Frontmatter check is a triage subroutine                                  |
| `import_instagram_export.py` | Build only when a backfill happens. TypeScript, not Python.               |
| `saves-index.json`           | Folder-based state; dedupe by checking all save folders for the shortcode |

## Scheduling

On-demand only. Re-evaluate after two weeks of real use. If a chore becomes daily and boring (likely candidate: stale-inbox digest), schedule it then — and prefer scheduled Claude Code over `launchd` so the work stays inside one toolchain.

## What We Build Now

1. Folder structure under `docs/instagram/saves/` (created).
2. `docs/instagram/saves/README.md`.
3. `docs/instagram/saves/templates/save.md` and `idea.md`.
4. `docs/instagram/saves/.local/config.json` (gitignored, hand-edited).
5. `.claude/commands/instagram-saves.md`.

That's it. Run it. Audit pain after 10–20 real saves.

## What We Do NOT Build Yet

- `scripts/instagram_saves/` — anything.
- A JSON index.
- A `launchd` plist.
- A cookie-based sync.
- Skill files. The 9takes pattern is commands under `.claude/commands/`, not skills.

## Risk Register

Unchanged from the original plan — the risks live in the workflow itself, not the toolchain:

| Risk                   | Cause                                | Mitigation                                                    |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------- |
| Wrong account active   | Chrome profile mismatch              | Hard pre-flight account verification; stop on mismatch        |
| Duplicate saves        | Same post in multiple collections    | Dedupe by shortcode across all save folders                   |
| Low-value idea spam    | Capturing everything                 | Triage rubric in the command; reject is a first-class status  |
| Copyright/IP overreach | Reusing creator content too directly | Store references and analysis; create original 9takes content |
| Account restriction    | Automated collection/interactions    | Human-supervised browser capture; no unattended actions       |
| Stale inspiration      | Saves sit unprocessed                | `digest` mode + weekly stale-inbox review                     |

## External References Checked

- Claude Code Chrome docs — https://code.claude.com/docs/en/chrome
- Claude in Chrome Help Center — https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome
- Instagram Terms of Use — https://www.facebook.com/help/instagram/581066165581870
- Meta Accounts Center data tools — https://about.fb.com/news/2023/10/manage-your-information-across-apps/
