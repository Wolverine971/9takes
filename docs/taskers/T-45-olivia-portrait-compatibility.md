<!-- docs/taskers/T-45-olivia-portrait-compatibility.md -->

# Tasker: Recover the legacy Olivia Rodrigo thumbnail URL

**For:** the agent handling 9takes asset errors from the 2026-10-08 past-day Vercel audit.
**Owner:** DJ
**Created:** 2026-10-08
**Status:** Exact compatibility redirect implemented and checked locally. Deployment and live verification remain.
**Related:** [T-44](T-44-cta-experiment-admin-read-access.md), `vercel.json`, `src/lib/server/personalityImageRedirect.ts`.

## 0. What and why

Verified audit evidence: at **2026-10-07 21:39:02.922 UTC**, `/types/2s/s-Olivia-Rodrigo.png` returned 404 with the homepage as referer. The repository contains `static/types/2s/s-Olivia-Rodrigo.webp` and the full WebP portrait, but no PNG thumbnail.

There is no current source reference to `Olivia-Rodrigo.png` in `src` or `static`. The current homepage renders `HomeLandingV2.svelte`; its four featured portraits are WebP files for other people. `buildPersonalityImagePath()` also emits WebP URLs. The request may be stale markup, a cached document or an external client, but the homepage referer alone cannot establish which. The justified fix is compatibility for this observed URL.

## 1. Required reading

1. `CLAUDE.md` and `docs/taskers/README.md`. This checkout has no `AGENTS.md` or `.agents/skills` directory.
2. `src/routes/+page.svelte`, `src/lib/components/marketing/HomeLandingV2.svelte`, and `src/lib/utils/personalityAnalysis.ts`.
3. `vercel.json`, `src/lib/server/personalityImageRedirect.ts`, and `src/lib/server/publicDelivery.spec.ts`.

## 2. Local change completed

Added one exact permanent Vercel redirect:

```text
/types/2s/s-Olivia-Rodrigo.png
  -> /types/2s/s-Olivia-Rodrigo.webp
```

The existing WebP resolver remains unchanged. Unknown people, unrelated PNG requests, and genuinely missing current assets still fail normally. No image files were generated or modified.

## 3. Release follow-up

After an approved deployment, verify that GET and HEAD on the old PNG path return the permanent redirect, and its WebP destination returns 200 with an image content type. Verify an unrelated missing asset still returns 404. No deployment is authorized by this task.

## Verification checklist

- [x] Source search found no current Olivia PNG reference:

  ```bash
  rg -n 'Olivia-Rodrigo\.png' src static
  rg -n 'types/|\.webp' src/lib/components/marketing/HomeLandingV2.svelte
  ```

  The first command's exit 1 means no matches, as expected.

- [x] Parsed `vercel.json`, checked one exact permanent rule and confirmed the destination exists on disk.
- [x] Existing public delivery and image resolver tests passed in T-44's 76-test run, including unknown-image and unrelated PNG handling.
- [x] `pnpm check`: 0 errors, 21 warnings reproduced exactly by the pre-remediation baseline (see T-44).
- [x] Full `pnpm build` passed, including Vercel compilation, runtime checks and budgets. T-44 records aggregate test/lint/audit failures and baseline evidence.
- [ ] No Vercel deployment, live redirect validation or browser smoke run. T-44 records the production-telemetry risk of the default smoke environment and the generated-file reason for not running `build:vercel`.

Configuration/asset check:

```bash
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
const { redirects } = JSON.parse(readFileSync('vercel.json', 'utf8'));
const matches = redirects.filter(r => r.source === '/types/2s/s-Olivia-Rodrigo.png');
assert.deepEqual(matches, [{
  source: '/types/2s/s-Olivia-Rodrigo.png',
  destination: '/types/2s/s-Olivia-Rodrigo.webp',
  permanent: true
}]);
assert.ok(existsSync('static' + matches[0].destination));
JS
```

## Risks and gotchas

- Vercel redirects are not exercised by the ordinary Vite development server. Local config validation does not prove deployed edge behavior.
- Do not add a blanket PNG-to-WebP rewrite, a generic fallback portrait, or a route that converts unknown assets into HTTP 200.
- Preserve other agents' changes and all blog `lastmod` fields. No commits, pushes or external communications are authorized.

## Definition of done

The exact legacy URL redirects to the existing WebP after an approved release, while unrelated missing assets remain 404s.
