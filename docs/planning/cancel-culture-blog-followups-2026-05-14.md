<!-- docs/planning/cancel-culture-blog-followups-2026-05-14.md -->

# Cancel Culture Blog — Follow-Ups (2026-05-14)

**File:** `src/blog/pop-culture/cancel-culture-enneagram-type.md`
**Status:** Published 2026-05-11. Major rewrite shipped this session.
**Slug:** `/pop-culture/cancel-culture-enneagram-type`

## What shipped

Reviewer's full punch-list addressed in one pass:

- Justine Sacco anchors the opener (replacing generic "the tweet was three years old" hypothetical).
- Real-name anchors added: Hasan Minhaj (Type 3), Roseanne + Joe Rogan (Type 8 split outcomes).
- Type 9 promise from the Quick Answer now delivered via dedicated "Cancelled for Silence" section.
- Six cancelled-type sections (3, 8, 4, 1, 7, 9) — was three (3, 8, 4).
- New section: **The Platform Makes It Possible** (algorithm, screenshots, context collapse, anonymous accounts).
- New section: **The In-Group Always Lights the Match** (load-bearing insight that was missing).
- New section: **Are We Past Peak Cancel?** (2026 vibe-shift acknowledgment).
- Type 2 "weaponizes victimhood" line now unpacked: "the helper becomes the prosecutor."
- All 9 type names internally linked.
- Disclaimer strengthened from "speculative" to "psychological pattern analysis, not clinical diagnosis."
- Word count: 2251 → 2122 net (3 new sections added; aggressive de-duplication of the original's 5 type-by-type lists).
- Hero image: `twitter-toxic-psychology.webp` (best existing thematic match; reuses the asset from `twitter-x-personality-types-toxic.md`).
- Schema updated: `dateModified`, `wordCount`, `articleBody` summary, `image.url`.

## Open follow-ups (not blocking publish, do when ready)

### 1. Unique hero image (low priority)

The post currently shares its hero with `twitter-x-personality-types-toxic.md`. The frontmatter still carries a custom `mjPrompt` (tribunal scene: marble statue surrounded by smartphone-holding hands, red/blue mob colors, 16:9, stylize 200) ready to render.

When run, save the output as `cancel-culture-psychology.webp` in `/static/blogs/` and:

- Update `pic:` from `twitter-toxic-psychology` → `cancel-culture-psychology`
- Update schema `image.url` to match
- Generate `s-cancel-culture-psychology.webp` if the build pipeline needs the small variant

The schema's earlier `image.url` already pointed at `cancel-culture-psychology.webp` before we re-routed it, so the original intent was a unique image.

### 2. Distribution packets (not built)

No assets in `docs/distribution-assets/` for this post yet. When ready to fire:

- Instagram: `/distribute-instagram` against this slug
- Twitter: short thread version (Sacco hook + in-group insight + past-peak observation)
- Quora: cancel-culture and Enneagram are both active Quora topics — `/quora-answer` can pull from this piece
- Newsletter: fits a "pop-culture pattern" send

### 3. Cross-linking (manual or via `pnpm gen:crosslinks`)

Worth bidirectional links between this and:

- `twitter-x-personality-types-toxic.md` (same hero, overlapping subject — natural twin posts)
- `reddit-moderators-type-1-internet.md` (Reddit mods are the Type 1 cancellation infantry; piece references the exact same dynamic)
- `incel-blackpill-radicalization-enneagram.md` (in-group/out-group radicalization theme)
- `dark-triad-meets-enneagram.md` (the weaponization framing in this post echoes that piece's structure)

### 4. Pipeline housekeeping

If `/blog_content_publish_pop_culture` was **not** run (file flipped to `published: true` manually):

- `pnpm gen:sitemap` — sitemap needs the new URL
- `pnpm index:blogs` — Supabase FTS index needs the new content
- `pnpm gen:crosslinks` — internal cross-link report refresh

If the command **was** run, all three are already handled — skip.

### 5. SEO watch (after 2–4 weeks)

Target queries to monitor:

- "cancel culture psychology"
- "who gets cancelled"
- "enneagram cancel culture"
- "cancel culture personality types"
- "in-group cancellation"

Justine Sacco appearing in the opener should help with the long-tail "Justine Sacco cancel culture analysis" queries.

## What the reader-review HTML comment said (now resolved)

The full reviewer punch-list lived as an HTML comment at the bottom of the markdown file. It was removed during the rewrite since every item was addressed. Preserved in the git history (commits leading up to and including the rewrite) if anyone needs to reconstruct the original critique.
