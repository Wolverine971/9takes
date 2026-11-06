<!-- docs/design/cold-light-rollout/README.md -->

# Cold Light rollout — guardrails

Three tools keep each screen clean once it has been moved to Cold Light. Run them from the repo root.

## 1. Style ratchet — `scripts/style-ratchet.mjs`

Counts style debt **per file**. A file's count may only go down. The baseline is `scripts/style-ratchet-baseline.json`.

| Metric        | What counts                                                                                                                                | Where                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| `hex`         | raw `#rgb` / `#rrggbb` / `#rrggbbaa`                                                                                                       | `<style>`, `.scss`, `.css`  |
| `rgb`         | `rgb()` / `rgba()` / `hsl()` / `hsla()` with no `var()` inside                                                                             | `<style>`, `.scss`, `.css`  |
| `fontSize`    | `font-size:` values that aren't `var(...)`, a SCSS variable or a keyword (`inherit`, `1em`, `100%`, …)                                     | same, **except admin**      |
| `important`   | `!important`                                                                                                                               | same                        |
| `legacyToken` | uses of `--lamp-*`, `--night-*`, `--stone-*`, `--data-teal*`, `--data-cyan`, `--ink-*`, `--marble-*`, `--pool-*` (definitions don't count) | whole file, incl. `.ts/.js` |
| `twLegacy`    | Tailwind `{bg,text,border,ring,from,…}-{primary,amber,yellow,orange}-NNN`                                                                  | whole file, incl. `.ts/.js` |
| `amber`       | known amber hex values (`#f59e0b` family) and amber `r, g, b` triples                                                                      | whole file, incl. `.ts/.js` |

- **Admin is left out of `fontSize`.** About 990 literal font sizes live in `src/routes/admin/**`, and admin only gets new colors in this rebrand, so counting them would only add noise. Every other metric still covers admin.
- **Token files may define literal colors.** Lines like `--x: #abc` in `src/scss/index.scss` and `src/scss/_tokens*.scss` don't count toward `hex`, `rgb` or `amber`.
- Comments are stripped. Skipped: `*.spec.*`, `*.test.*`, `*.d.ts`, `src/blog/**` and `src/lib/data/**`.

```bash
node scripts/style-ratchet.mjs                       # gate: exit 1 if any file's count went up, or a new file has debt
node scripts/style-ratchet.mjs --report src/routes/questions src/lib/components/questions   # one screen's files, now vs baseline
node scripts/style-ratchet.mjs --top 20              # worst files
node scripts/style-ratchet.mjs --update              # lock in wins (and re-baseline after a deliberate move)
node scripts/style-ratchet.mjs --json                # current counts as JSON
```

Run `--update` after each screen lands so the lower counts become the new ceiling. If you skip it, a later edit can quietly climb back up to the old number. Moving debt from one file to another shows up as a regression. Re-baseline on purpose and say why in the commit.

## 2. Token contrast — `scripts/check-token-contrast.mjs`

This script reads the top-level `:root { … }` tokens in `src/scss/index.scss`. It resolves `var()` chains and blends `rgba` over `--bg`. Any contract token that's missing falls back to the contract value and is flagged `fallback`. Then it checks WCAG contrast:

- `--text`, `--text-muted`, `--text-faint` and `--highlight` on `--bg`, `--surface` and `--surface-raised`: **≥ 4.5**
- `--text-on-action` on `--action`: **≥ 4.5**. `--text` on `--accent`: **≥ 4.5**
- `--focus` on all three surfaces: **≥ 3** (non-text UI)
- `--accent` on `--bg` must stay **< 4.5**. The violet accent is for fills, never for text.
- Some rows are info only and never fail: mint as text, text on `--accent-deep`, and `--rule` on `--surface`.

```bash
node scripts/check-token-contrast.mjs            # exit 1 on any failed required pair
```

## 3. Before/after screenshots — `scripts/rebrand-shots.mjs`

This script uses Playwright and visits 19 representative public routes one at a time: home, questions list and detail, people hub and one person, each MDsvex section index and one post from each, `/enneagram-test`, `/book-session`, `/about`, `/login`, `/register` and a 404. It shoots each route at **390×844 @2x** and **1440×900**, full page, capped at 16,000 device px.

On the phone size it also checks three things:

- **h-scroll:** whether the page scrolls sideways (`document.scrollWidth > innerWidth`)
- **clipped overflow:** elements whose right edge runs past the viewport. `.app-wrapper { overflow-x: hidden }` can hide these from h-scroll. Elements inside sideways scrollers like carousels are exempt.
- **taps < 44:** tappable elements in the first screen smaller than 44×44. Inline links in running text are exempt.

It never logs in or submits forms. It blocks analytics and tracking requests (PostHog, GA, `/api/analytics`, `/api/track`, Vercel insights) so runs don't pollute 9takes data. If a cookie banner appears, it only clicks an explicit decline button.

```bash
# before (production still shows the old design until deploy)
node scripts/rebrand-shots.mjs capture --base https://9takes.com --out <dir>/before
# after (local dev or a preview deploy); --only limits routes, --viewports phone limits sizes
node scripts/rebrand-shots.mjs capture --base http://127.0.0.1:5173 --out <dir>/after --only home,questions
# side-by-side contact sheet + phone-check deltas
node scripts/rebrand-shots.mjs compare <dir>/before <dir>/after --out <dir>/compare
open <dir>/compare/index.html
```

Each capture dir holds `<route>--<phone|desktop>.png`, `summary.json` and a one-run `index.html`. The route list is `ROUTES` at the top of the script. The real slugs in it were checked against production on 2026-11-05. The 2026-11-05 BEFORE baseline lives in the session scratchpad under `rebrand/before/`. Copy it somewhere permanent if you need it after this session.

## Per-screen "done" checklist

A screen counts as done only when every box is ticked for the files that render it.

- [ ] `node scripts/style-ratchet.mjs --report <screen's files>`: counts went **down**. Target `hex`, `rgb`, `legacyToken`, `twLegacy` and `amber` = 0. `fontSize` uses the `--font-*` and type-scale tokens. Then run `--update`.
- [ ] `node scripts/style-ratchet.mjs` passes, so nothing else regressed.
- [ ] `node scripts/check-token-contrast.mjs` passes.
- [ ] Phone at 390: **no horizontal scroll** and no clipped overflow, according to `rebrand-shots` checks.
- [ ] Tap targets in the first screen are **≥ 44×44**, apart from inline text links.
- [ ] **One mint (`--action`) per view.** Only the primary action is mint. Everything else is ghost, outline or text.
- [ ] **No amber anywhere.** Check the ratchet `amber` / `twLegacy` = 0 and look at the screenshot: no warm orange in glows, gradients, images or charts.
- [ ] `--accent` violet is never used for text (contrast 3.3:1). Use `--highlight` for violet-tinted text.
- [ ] Before/after contact sheet reviewed at phone and desktop sizes.
- [ ] `pnpm check`, `pnpm lint`, `pnpm test` and `pnpm build` are green.
