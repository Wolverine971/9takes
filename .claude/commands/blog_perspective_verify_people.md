<!-- .claude/commands/blog_perspective_verify_people.md -->

# Verify Perspective-Review Resolutions

You are the read-only verifier after a perspective-informed edit or revision. You do not grade the article, reopen the full jury, add new editorial preferences, or edit any draft. You check whether accepted trust repairs were actually completed and whether the revision damaged the draft's protected hits.

## Input

```text
/blog_perspective_verify_people <Person> --review-dir=<repo-relative-dir> --draft-sha=<snapshot-sha> --output=<verification-filename>
```

`$ARGUMENTS`

Read:

- the current live draft resolved from `<Person>`
- `context.json` and `draft-reviewed.md`
- `evidence-packet.md`
- all six reviews
- `synthesis.md`
- `editor-resolution.md` and/or `revision-resolution.md` when present

Write exactly `<review-dir>/<output>`. Do not modify any other file.

## Verification method

1. Confirm the synthesis and frozen snapshot SHA match the supplied SHA.
2. Compare the current reader-visible draft with `draft-reviewed.md`.
3. For every P0 item, apply its acceptance test to the current text and label it resolved, unresolved, or needs-human.
4. For every accepted P1 item, confirm completed, rejected-with-reason, deferred-with-reason, or unresolved. A P1 does not fail the gate merely because it was explicitly rejected for a defensible tradeoff.
5. For every `PROTECT-*` item, confirm the passage or its essential function survived. Equivalent tighter wording may pass; deletion of the insight does not.
6. Confirm the revision did not introduce a new factual assertion as part of a repair without a source trail.
7. Use targeted research only when a P0 acceptance test depends on a factual claim that the packet cannot settle. Do not conduct a new general audit.
8. Set `verification_status: pass` only when `open_p0: 0` and `protected_hit_regressions: 0`.

Compute the current reader-visible content hash with the repository utility, not a full-file hash:

```bash
node --input-type=module -e "import {readFileSync} from 'fs'; import {hashReaderVisiblePerspectiveBody} from './scripts/lib/perspectiveReview.js'; console.log(hashReaderVisiblePerspectiveBody(readFileSync('<draft-path>','utf8')))"
```

This hash intentionally ignores frontmatter and editorial HTML comments, which later pipeline stages may change.

## Required output

Begin with parseable YAML frontmatter:

```yaml
---
artifact: perspective-verification
schema_version: 1
subject: <exact context subject>
draft_sha256: <exact frozen snapshot sha>
final_content_sha256: <computed reader-visible hash of current live draft>
verification_status: pass | fail | needs_human
open_p0: <integer>
protected_hit_regressions: <integer>
verified_at: <ISO-8601 timestamp>
---
```

Use these exact H2 headings:

```markdown
## Verification verdict

## P0 resolution check

## Accepted improvements check

## Protected-hit regression check

## Remaining work
```

Reference the synthesis IDs exactly. For each failed item, quote the current passage, state why the acceptance test still fails, and name the minimum remaining action. For a clean section, write `None.`

Report the output path, verification status, open P0 count, and protected-hit regression count, then stop. The deterministic gate script—not your prose declaration—will decide whether the pipeline may finalize the perspective review.
