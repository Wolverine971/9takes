<!-- .claude/commands/crosslink-queue.md -->

# Cross-Link Queue Worker

Work the internal-link opportunity queue: add the best contextual links between live 9takes posts
(and from posts to personality-analysis pages), shrink cross-link gate debt, and log what changed.

**This command is self-sufficient.** Everything you need is below; do not pre-read other docs.

## Input

`$ARGUMENTS` — optional. A number sets the link budget for this run (default **12**). `--dry-run`
means: decide accept/reject for the top candidates and write the log entry, but edit no posts.

## Why this exists

Search engines and readers both follow internal links. The site's Enneagram Corner keeps ~94% of
its links inside itself, pop-culture/community/how-to posts get a median of 2 inbound links, and the
personality-analysis pages (the biggest share of search impressions) get almost no contextual links
from blog posts. Each link you add should move a reader to the next useful page AND give a page
that is close to page 1 of Google a push. One good link beats three forced ones.

## Pre-approved operations

- Read any file in the repo
- `pnpm gen:crosslinks` (and `-- --target <url>` / `-- --source <url>`), `pnpm crosslinks:check`,
  `pnpm crosslinks:check -- --update-baseline`, `node scripts/fetch-gsc-data.mjs`
- `npx prettier --write <files you edited>` (only files you edited)
- Editing link markup in live posts under `src/blog/{enneagram,community,guides,pop-culture}/`
- Appending to `docs/crosslinks/crosslink-log.md` and `docs/crosslinks/skipped.json`;
  editing `docs/crosslinks/target-phrases.json`
- `git status`, `git diff`

NOT allowed: `git commit/push/stash/reset/checkout`, `pnpm format` on the whole repo,
`pnpm crosslinks:check -- --accept`, editing frontmatter, editing `src/blog/people/drafts/`,
editing unpublished drafts, deleting content.

## Workflow

### 1. Preflight

1. `git status --short src/blog docs/crosslinks` — any post already modified that you did not
   modify is being edited by DJ or another agent. **Skip those files** for this run.
2. If `docs/data/gsc/latest.json` has a `runDate` more than 30 days old, run
   `node scripts/fetch-gsc-data.mjs` (read-only Search Console pull).
3. `pnpm gen:crosslinks` to refresh the queue from the current files.
4. `pnpm crosslinks:check` — note the result (it should pass before you start; if it fails on
   something you did not cause, fix that first only if it is a link fix, otherwise log it).

### 2. Pick candidates

Read `docs/crosslinks/link-opportunities.json`. Work in this order until the budget is spent:

1. `gateDebt` entries with `"grandfathered": false` (they fail CI right now)
2. `gateDebt` entries, highest impressions first (inbound/outbound suggestions listed per post)
3. `topBlog` (highest-value blog → blog links)
4. `peopleBridge` (blog → personality-analysis links)

Each candidate has `source.file`, `line`, `excerpt`, `anchor`, `target.url` (gate-debt entries also
list `bridgeHosts` when no natural mention exists). Line numbers can drift;
find the sentence by its excerpt text.

Spread the work: at most **2 new links per source file per run**, at most **1 link to the same
target from one post** (ever), and no more than 3 links added to any single target per run.

### 3. Accept or reject each candidate

ACCEPT only if all are true:

- The sentence is genuinely about the target page's subject. Word matches lie: "Kristen" in a
  sentence about Kristen Stewart is not the Kardashian post; "disorder" is not the mental-illness
  post; "compatibility" in "do not decide compatibility by type" is a caution, not a topic.
- A reader who clicks would get what the anchor promises.
- The link is not inside: frontmatter, a heading, a `<QuickAnswer>` or other callout component,
  an HTML comment, JSON-LD / FAQ schema, a quote of what a real person said, a citation/sources
  list, an image caption, or a table header.
- The paragraph does not already carry 2+ links, and the source post does not already link the
  target anywhere.
- People targets: link a person's name only where the sentence is about that person, first mention
  in the post only. Never link a real person's page from a sentence about a clinical condition
  unless the person has publicly discussed that condition.

Otherwise REJECT and record it (step 5).

Special file: `src/blog/enneagram/enneagram-and-mental-illness.md` is the site's top-traffic page.
At most 1 link per run, never inside the QuickAnswer, never in the title/H2s, no other edits.

### 4. Apply

- Markdown posts: `[anchor](/section/slug)`. HTML-authored posts (prose in `<p>` blocks):
  `<a href="/section/slug">anchor</a>`. Always root-relative URLs, never `https://9takes.com/...`.
  People URLs are lowercase slugs: `/personality-analysis/taylor-swift`.
- Anchor text: 2–6 words from the existing sentence that describe the target page. You may widen
  or narrow the suggested `anchor`. Never "click here", never a bare URL, never the whole sentence.
- Change at most a few words around the anchor, and only if the sentence reads badly otherwise.
  Never change the claim, the voice, or the facts.
- **Never touch `lastmod`** or any frontmatter. DJ manages `lastmod` by hand.
- If a gate-debt post has no usable mention anywhere, use its `bridgeHosts` (related live posts,
  ranked by shared links / series / section). Prefer adding ONE list item to an existing related-reading
  list in the host ("Rabbit Holes", "Related", "Keep reading", "Go deeper") in that list's exact
  format; otherwise add ONE sentence (≤25 words) at the end of the most related paragraph. Max 1
  bridge per host file, max 3 bridges per run. Log each one verbatim.
- Voice for any new words: tactically direct, specific, no fluff; no AI tells ("delve", "tapestry",
  "navigate the complexities", "it's not X, it's Y", em-dash chains). Never write "X tells you WHAT,
  the Enneagram tells you WHY" (any variant), childhood-wound origin claims, typing a stranger from
  one behavior, or first-party stats presented as causal.

### 5. Record rejections and tune phrases

- Append each rejected candidate to `docs/crosslinks/skipped.json` under `"skipped"`:
  `{ "id": "<candidate id>", "reason": "<short reason>", "date": "YYYY-MM-DD" }`
  (the id is the candidate's `id` field, e.g. `"/pop-culture/a -> /enneagram-corner/b"`).
  Skipped ids never come back, so only skip pairs that are wrong, not merely "not this week".
- If one curated phrase in `docs/crosslinks/target-phrases.json` caused 2+ bad matches, remove it.
  If you notice obvious unlinked mentions the queue missed, add the phrase under the target URL.

### 6. Verify

1. `npx prettier --write <each post you edited>` then `npx prettier --check <same files>`.
2. `pnpm crosslinks:check -- --update-baseline` — ratchets the grandfathered list down to posts
   still below the bar. It must end with `✓ Cross-link gate`. If it fails because of your edit
   (e.g. a typo'd URL shows as a broken link), fix the link.
3. `pnpm gen:crosslinks` — refresh the report and queue.

### 7. Log (append-only)

Append to `docs/crosslinks/crosslink-log.md` (create with a `# Cross-Link Log` title if missing).
Never rewrite earlier entries. Format:

```markdown
### YYYY-MM-DD — N links added, gate debt A → B

- Added: `source` → `target` ("anchor") — one line each
- Bridging sentences: verbatim, with file
- Rejected: K (top reasons)
- Gate: below-bar posts A → B, grandfathered G → H, broken links 0
- Noticed: content problems worth DJ's attention (contradictions between posts, a strong draft
  that should be published, people-page link ideas that need a `push:people` sync)
```

### 8. Final output

One line, used by the weekly wrapper for the Telegram summary:

`Crosslinks YYYY-MM-DD: N links added across M posts; gate debt A→B; rejected K.`

## Go deeper (only if something is unclear)

- `scripts/lib/crosslinkOpportunities.js` — how candidates are scored
- `scripts/lib/crosslinkGate.js` — gate thresholds and baseline ratchet
- `docs/BLOG-CROSSLINK-INDEX.md` — full report (section flow, dead ends, people bridge)
