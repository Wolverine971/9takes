<!-- docs/taskers/T-41-assets/G-nine-takes/README.md -->

# T-41 item G: nine-take seeds for q118 and q203

**Status (2026-10-03):** drafted, NOT seeded. Waiting on DJ's edit pass and go.

| File                 | Question                                                 | Backing row |
| -------------------- | -------------------------------------------------------- | ----------- |
| `q118-seed-takes.md` | What were you like as a kid in 3 words?                  | id 118      |
| `q203-seed-takes.md` | What are your criteria for considering someone a friend? | id 203      |

Both files already pass `scripts/seed-strategic-question.mjs --dry-run` (nine takes parsed, no em-dashes, backing row found, id matches). The dry run only reads the `questions` row; it returns before the upsert.

## Why these two

Every celebrity page currently asks q567, because `/api/nine/mirror` only accepts answers on a question with exactly nine stored takes in `nine_takes` (`subject_type = 'question'`), and q567 is the only question in `PROVEN_CHORUS_QUESTION_URLS` that has them. Once these two are seeded, `src/lib/server/provenChorusQuestions.ts` rotates them in with no code change: each page starts at `stableSlugHash(slug) % 3`, so roughly a third of pages move to q118 and a third to q203.

## After DJ approves (edit the takes in place first; the italic persona note on each `Type N` line is never stored)

```bash
# 1. Validate again after edits (read-only)
node scripts/seed-strategic-question.mjs --dry-run --file=docs/taskers/T-41-assets/G-nine-takes/q118-seed-takes.md
node scripts/seed-strategic-question.mjs --dry-run --file=docs/taskers/T-41-assets/G-nine-takes/q203-seed-takes.md

# 2. Seed (idempotent upsert into nine_takes; re-running replaces the same row)
node scripts/seed-strategic-question.mjs --file=docs/taskers/T-41-assets/G-nine-takes/q118-seed-takes.md
node scripts/seed-strategic-question.mjs --file=docs/taskers/T-41-assets/G-nine-takes/q203-seed-takes.md
```

Anything written after the Type 9 take becomes part of the Type 9 take (the parser reads to end of file), so keep notes above the `---` line.

## Verify the rotation

1. Rows exist with nine takes each:
   ```bash
   ./scripts/db-query.sh "select subject_slug, jsonb_array_length(takes) n, model, updated_at from nine_takes where subject_type='question' order by updated_at desc"
   ```
2. Pages pick them up. ISR pages refresh on their own within 24 hours. To see it now, refresh a page from each bucket. The token is read from the shell environment, not from `.env`:
   ```bash
   BYPASS_TOKEN=... pnpm revalidate:personality -- billie-eilish barack-obama zendaya
   ```
   `billie-eilish` and `barack-obama` start on q118; `zendaya` starts on q203 (unless a page's own chorus question is public, which wins). Load each page and confirm the mid-article question text changed from the q567 "seem fine" question.
3. Answer once on a test page only if you must, and follow the test-take cleanup in T-41 section 5 (posting fires `notify_on_comment` to everyone who answered that question).
