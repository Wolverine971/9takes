# Daily people publishing

DJ authorized two new people per day on November 17, 2026, approved the exact Hunter Schafer and Ludwig Ahgren questions, and authorized automated quality checks for future questions. The policy and those exact strings are in `daily-publisher.json`. This authorization supersedes the individual-question human approval step in the older publishing guide for this workflow.

The Codex project automation runs daily at 6 AM America/New_York. The former OpenClaw job `d3f1bb84-ca73-4034-af80-22ab00ec3061` must remain disabled so there is only one scheduler.

```sh
# Read-only candidate check (writes an audit log locally).
node scripts/publish-people-daily.mjs

# Prepare complete discussions, publish the remaining daily slots, refresh data.
bash scripts/daily-blog-publisher.sh
```

The limit is two distinct first publications per New York calendar day. Both release events and canonical `first_published_at` timestamps count, including manual publications. Retries fill only the remaining slots. An atomic local lock prevents overlapping scheduled processes. Previously published profiles are excluded.

The existing parser enforces editorial release, grade, source, and portrait requirements. The daily wrapper also rejects known unresolved portrait rights and requires the exact local full and thumbnail image bytes to be deployed publicly. Install only approved portraits, keep their source credits and licenses, generate image variants, accept the measured portrait budget, and deploy those assets before publication. Do not generate replacements or change Enneagram typing during this operational release job.

Before a profile becomes public, its discussion question must exist with approved editorial metadata and nine complete perspectives in both `nine_takes` and `comments_ai`. Future questions use the existing response-first generation and separate veto-review calls: every review dimension must score at least four, all vetoes must pass, and the selected wording must not duplicate another question. A failure blocks publication. Exact approved questions bypass question generation, but still receive all nine answer perspectives.

After publishing, the wrapper regenerates site data without formatting unrelated work, attempts an ISR refresh, verifies the public profile shows the exact discussion question and its backing question page loads, and writes a report to `logs/blog-automation/daily-publish-*.json`. A shortage of eligible candidates exits nonzero with blockers; never lower gates to fill the quota.

The automation must finish the production deployment after running the wrapper: commit and push only this run's selected draft publication metadata and task-owned generated changes. Preserve unrelated staged and unstaged work. Vercel's production build regenerates the personality image map, alignment, famous types, corpus statistics, sitemap, and LLM index. Verify the production deployment is Ready and the released profiles appear in the public listing and sitemap. If deployment or refresh fails after database publication, repair that release on retry; do not publish extra people.

Publishing is expressly authorized. Do not send email or social posts. Report the two public profile links and any blocker, without exposing credentials.
