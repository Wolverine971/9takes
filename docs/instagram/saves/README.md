<!-- docs/instagram/saves/README.md -->

# Instagram Saves Engine

Lightweight workflow for turning Instagram saves into 9takes content ideas, then into publish-ready assets.

Architecture rationale lives in `docs/instagram/instagram-saves-engine-architecture.md`. Read that first if you're about to change the workflow.

## Folder map

| Folder       | What lives here                                             | Lifecycle                             |
| ------------ | ----------------------------------------------------------- | ------------------------------------- |
| `inbox/`     | Raw save files just captured, awaiting triage               | New                                   |
| `processed/` | Saves that passed triage and (usually) have a matching idea | Kept after `/instagram-saves triage`  |
| `rejected/`  | Saves we said no to                                         | Kept for dedupe; do not delete        |
| `ideas/`     | Content ideas generated from saves                          | Produced by `/instagram-saves ideate` |
| `digests/`   | Optional daily/weekly roll-ups                              | Produced by `/instagram-saves digest` |
| `assets/`    | Publish-ready Instagram asset packs                         | Produced by `/instagram-saves assets` |
| `templates/` | Frontmatter + section templates for save and idea files     | Hand-edited                           |
| `.local/`    | Machine-local config (gitignored)                           | Hand-edited                           |

**State is the folder.** A file in `inbox/` is unprocessed. Dedupe checks all save folders for the shortcode before writing a new one.

## File naming

```
YYYY-MM-DD_<shortcode>.md
```

`<shortcode>` is the Instagram post code from the URL (`instagram.com/p/<shortcode>/` or `instagram.com/reel/<shortcode>/`). Prefix with `ig_` only in the frontmatter `id` field, not the filename.

## Local config

`docs/instagram/saves/.local/config.json` is gitignored. Create it from this shape:

```json
{
	"default_collection": "Content Ideas",
	"allowed_collections": ["Content Ideas", "Personality Reads", "Formats"],
	"capture_account": "9takesdotcom",
	"timezone": "America/New_York",
	"max_items_per_capture": 25
}
```

Never commit Instagram cookies or session data.

## Two capture paths feed the same inbox

| Path                        | Trigger                                           | Curator               | `capture_method`  | `collection`     |
| --------------------------- | ------------------------------------------------- | --------------------- | ----------------- | ---------------- |
| `/instagram-saves capture`  | You bookmarked posts in IG and want to sync them  | You (manual bookmark) | `chrome_assisted` | (actual IG name) |
| `/instagram-warmup` Phase 7 | Agent saw save-worthy posts during a warmup sweep | Agent (rubric-driven) | `warmup_assisted` | `warmup_inline`  |

Both write to `inbox/`. Triage handles them the same way — but the `capture_method` field lets you see at-a-glance whether a save came from your taste or the agent's, which is useful early on while you're calibrating the agent's save bar.

## The command

`.claude/commands/instagram-saves.md` is the entry point. Modes:

- `/instagram-saves capture` — Claude in Chrome reads the active Saved page and writes save files to `inbox/`.
- `/instagram-saves triage` — Score each `inbox/` save; move to `processed/` or `rejected/`.
- `/instagram-saves ideate` — Generate content ideas from processed saves into `ideas/`.
- `/instagram-saves assets` — Convert an approved idea into a publish-ready asset pack.
- `/instagram-saves digest` — Build a roll-up of today's or this week's activity.

All modes share a hard pre-flight account verification step. None of them like, comment, follow, DM, or publish.

## When to add tooling

Don't add scripts or scheduled jobs preemptively. After ~20 real saves, audit what's annoying. If a chore is daily and deterministic, write a TypeScript script under `scripts/` (matching the rest of the repo). Do not introduce Python.

## Workflow map

```text
Path A (manual): You bookmark on Instagram
                  -> /instagram-saves capture
                          \
                           \
Path B (agent): /instagram-warmup Phase 7
                  -> (Filter B selects save-worthy posts during scan)
                          /
                         /
                        v
            docs/instagram/saves/inbox/*.md
                        |
                        v
              /instagram-saves triage
                        |
                        v
       docs/instagram/saves/{processed,rejected}/*.md
                        |
                        v
              /instagram-saves ideate
                        |
                        v
            docs/instagram/saves/ideas/*.md
                        |
                        v
      /instagram-saves assets  (or /distribute-instagram)
                        |
                        v
           docs/instagram/saves/assets/*.md
                        |
                        v
              human review and publish
```

Architecture rationale (including the warmup-feeds-saves flow chart) lives in `docs/instagram/instagram-saves-engine-architecture.md`.
