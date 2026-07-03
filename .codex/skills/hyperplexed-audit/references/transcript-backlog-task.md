<!-- .codex/skills/hyperplexed-audit/references/transcript-backlog-task.md -->

# Task: Pull + Analyze the 7 Missing Tier-2 Transcripts

> **STATUS 2026-07-01: §1–§3 DONE.** All 7 transcripts pulled (no IP block), playbook §0/§1/§2/§4
> updated, P16 (spotlight `:has()`) + P17 (forgiving shared indicator) added, P15 extended with the
> context-aware trailer variant, memory updated. §4 command: see `.claude/commands/hyperplexed-audit.md`.

> Self-contained pickup doc. Goal: finish the Hyperplexed source corpus by transcribing the 7
> deferred Tier-2 effect tutorials, fold what they teach into the
> [playbook](./HYPERPLEXED_DESIGN_PLAYBOOK.md) §2 and
> [`HYPERPLEXED_FIX_PATTERNS.md`](./HYPERPLEXED_FIX_PATTERNS.md), **then** build the
> `/hyperplexed-audit` command (step 4 — deliberately blocked until the corpus is complete so the
> command's rubric isn't missing material). Created 2026-07-01.

---

## 1. The 7 videos (IDs resolved from the channel 2026-07-01)

| Slug (filename)               | Video ID      | Title                                               | Duration |
| ----------------------------- | ------------- | --------------------------------------------------- | -------- |
| `how-to-slay-with-css`        | `XffXBuqvWYI` | How to Slay with CSS                                | 6:03     |
| `frontend-skills-to-the-moon` | `GHZBa_R93ag` | How to take your front-end skills TO THE MOON       | 4:47     |
| `extraordinary-from-ordinary` | `jMVhxBB3l0w` | Building The Extraordinary Using Only The Ordinary  | 6:37     |
| `unfiltered-frontend-thought` | `oJYFRZ4cj2Q` | The Unfiltered Thought Process of a Frontend Dev    | 4:08     |
| `mouse-trailer-intelligent`   | `CZIJKkwc8l8` | The Mouse Trailer With Intelligent Features         | 3:38     |
| `explosive-hover-effect`      | `owpaafxvkjU` | Have You Ever Seen A Hover Effect This EXPLOSIVE 🤯 | 4:09     |
| `effect-shouldnt-be-possible` | `yu0Cm4BqQv0` | This Website Effect Shouldn't Be Possible           | 4:04     |

URL form: `https://www.youtube.com/watch?v=<ID>`.

**Optional watchlist** (spotted on the channel, not in the original selection — grab only if the 7
go smoothly and they look substantive): `joDhIH6Xumw` (Twitch's ultimate CSS hover effect),
`5a8NyGLlorI` (I Gave a Website Logo Superpowers), `PkADl0HubMY` (Award-winning animation in 20
lines of CSS), `CqndlPZkjqY` (You Don't Need A Lot Of Pixels To Be Classy). The polyrhythm,
particle-art, AI-tracker, and parody videos stay intentionally skipped (entertainment, not design
lessons).

## 2. How to pull (landmines learned 2026-06-26)

- Use the **`youtube-transcript` skill** (`/youtube-transcript`), one video at a time —
  **sequential, ≤2 parallel max**. The YouTube timed-text endpoint **blocks the IP for 6–24h** when
  hammered; that's exactly how these 7 got deferred the first time. If a pull starts failing with
  empty transcripts, STOP and retry hours later — don't burn the remaining budget.
- Save to `./transcripts/<slug>.md` using the slugs above (playbook §4 already references them).
- Match the existing file format exactly (see any file in `./transcripts/`): YAML frontmatter
  (`title`, `video_id`, `url`, `channel`, `channel_url`, `upload_date`, `duration`, `views`,
  `timestamps` if available, `description`, `transcribed_date`, `path`), then the `# Title`,
  `## Metadata`, `## Timestamps` (if any), and `## Transcript` sections — transcript as one prose block.

## 3. Analysis pass (after all 7 land)

Read the 7 new transcripts against the current playbook and extract **only what's new** — the
corpus already covers the redesign-judgment core; these are effect tutorials, so expect §2-type
material:

1. **Playbook §2 (interaction & motion):** new named principles or generalizable primitives (the
   bar: is it reusable like the "magic slider," or one-off like a specific gradient?). Also check
   for §1 taste rules — his asides while building often contain judgment calls.
2. **`HYPERPLEXED_FIX_PATTERNS.md`:** any effect worth having as a BuildOS recipe gets the next
   P-number (P16+), same When/Recipe shape, Svelte 5 + Inkprint tokens, reduced-motion no-op
   mandatory. Expected candidates: the intelligent mouse trailer (likely extends P15), the
   explosive hover, whatever "shouldn't be possible" turns out to be.
3. **Playbook §4 (video index):** move the 7 slugs from the "Not yet transcribed" paragraph into
   the Tier-2 list; delete the paragraph if nothing remains deferred.
4. **Memory:** update `project_hyperplexed_design_playbook` (transcript count 13→20, deferred list
   cleared or shortened).

**Definition of done:** 7 transcript files in `./transcripts/`, playbook §2/§4 updated, any new
P-patterns added, memory updated.

## 4. Then: build the `/hyperplexed-audit` command (blocked on §1–3)

Decision already made with DJ (2026-07-01): this is a **command** (named user-triggered workflow),
not a skill — `.claude/commands/hyperplexed-audit.md`. Requirements agreed:

- **Input:** a component or page (path or name), e.g. `/hyperplexed-audit BrainDumpModal`.
- **Flow:** (1) audit the surface region-by-region against playbook §1–§2 (static markup pass,
  same method as the existing audits); (2) present findings tiered by leverage, each citing its
  fix pattern (`→ P#`); (3) **stop and wait for DJ's approval/input** on which fixes to apply;
  (4) apply approved fixes using the P-recipes; (5) verify (`svelte-check` + Prettier); (6) update
  [`HYPERPLEXED_AUDIT_TRACKER.md`](./HYPERPLEXED_AUDIT_TRACKER.md) — add/update the surface's row,
  note deferred items — and write/update the audit doc if the surface warrants one.
- **Wired to:** the playbook (rubric), fix patterns (recipes, and add new P-numbers when a fix
  doesn't match), tracker (row per surface + backlog + in-repo exemplar list), and the existing
  audit docs (check for a prior audit of the same surface first — stack, don't duplicate).
- Match the voice/format of existing commands in `.claude/commands/` (see `fix-bug.md`,
  `design-update.md` for the closest shapes).
