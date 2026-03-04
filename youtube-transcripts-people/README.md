<!-- youtube-transcripts-people/README.md -->

# YouTube Transcripts — Folder Structure & Formatting Guide

This folder contains:

- **Raw transcript dumps** (unstructured, mostly verbatim): `youtube-transcripts-people/_raw/*.raw.md`
- **Transcript writeups** (structured + lightly cleaned): `youtube-transcripts-people/*.md`
- **Multi-transcript analysis docs** (e.g., consolidated analyses): `youtube-transcripts-people/*consolidated-analysis.md`
- **Folder-level synthesis**: `youtube-transcripts-people/consolidated-synthesis.md`

The goal is consistency: predictable filenames, predictable sections, and **bidirectional links** between writeups and any multi-transcript analysis docs that reference them.

---

## Naming Conventions

- Use **kebab-case** and **lowercase**.
- Prefer `primary-person-or-show-<episode-slug>.md`.
- Raw transcripts live in `_raw/` and add a `.raw` suffix:
  - Writeup: `youtube-transcripts-people/<slug>.md`
  - Raw: `youtube-transcripts-people/_raw/<slug>.raw.md`
- If a file’s content does not match the filename (wrong guest/show), **rename it** (and update all internal links).

---

## Linking Rules (Important)

### 1) Raw transcript links (when available)

If `youtube-transcripts-people/_raw/<slug>.raw.md` exists, the writeup **must** link to it using a Markdown link:

- `Raw transcript: [<slug>.raw.md](./_raw/<slug>.raw.md)`

### 2) Bidirectional links for multi-transcript analysis docs

If a multi-transcript analysis doc (e.g. `*-consolidated-analysis.md`) references a transcript writeup, then:

- The analysis doc must link to the transcript writeup.
- The transcript writeup must link back to the analysis doc (in `## Related`).

Use **relative links** (e.g. `./file.md`) and prefer Markdown links over backticked paths.

---

## Standard Template: Transcript Writeup (`youtube-transcripts-people/<slug>.md`)

Start with a filepath comment, then a single `#` title, then these sections (some optional):

```md
<!-- youtube-transcripts-people/<slug>.md -->

# <Title> (YouTube Upload)

## Video Details

- **Speaker(s)**:
- **Source**: <YouTube URL>
- **Channel**:
- **YouTube Upload Date**:
- **Format**:
- **Primary Topics**:

## Related

- Raw transcript: [<slug>.raw.md](./_raw/<slug>.raw.md) <!-- if it exists -->
- Consolidated analysis: [<person>-consolidated-analysis.md](./<person>-consolidated-analysis.md) <!-- if applicable -->

---

## Core Themes

1. ...
2. ...

## Analysis & Key Insights

### What Stands Out

1. ...

## Transcript (Parsed and Lightly Cleaned)

> Notes: Derived from [raw transcript](./_raw/<slug>.raw.md). This section is a structured parse for readability (not a full verbatim transcript).

### 1) ...
```

### “Full transcript” variant

If the intent is to present a mostly-verbatim transcript (with minimal cleanup), use a section like:

- `## Formatted Transcript (Full, Cleaned)`

and explicitly describe the edit level (e.g., whitespace/line-wrapping only).

---

## Standard Template: Multi-Transcript Analysis (`*consolidated-analysis.md`)

These docs should start with a title and a **Sources** list of Markdown links:

```md
<!-- youtube-transcripts-people/<name>-consolidated-analysis.md -->

# Consolidated Analysis: <Name> Across N Episodes

**Sources (local transcript writeups/dumps):**

- [episode-1.md](./episode-1.md)
- [episode-2.md](./episode-2.md)
```

If the analysis uses a table of sources, the **File** column should still use Markdown links.

---

## How to Process a New Raw Transcript (Agent Checklist)

1. Save the raw dump as `youtube-transcripts-people/_raw/<slug>.raw.md`.
2. Create `youtube-transcripts-people/<slug>.md` using the template above.
3. Add `Raw transcript: ...` to `## Related` (if the raw exists).
4. If this transcript belongs in an existing consolidated analysis:
   - Add it to the analysis doc’s **Sources** list (as a Markdown link).
   - Add a backlink from the transcript writeup (`## Related` → consolidated analysis).
5. If you rename any files:
   - Update any `<!-- youtube-transcripts-people/... -->` filepath comments.
   - Update all Markdown links that referenced the old path.
   - If a file has frontmatter with a `path:` field, update it too.
