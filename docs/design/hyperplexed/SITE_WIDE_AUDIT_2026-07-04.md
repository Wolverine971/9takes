<!-- docs/design/hyperplexed/SITE_WIDE_AUDIT_2026-07-04.md -->

# Site-Wide Audit - 2026-07-04

Scope: broad local scan of the current 9takes workspace across public routes, copy, styling,
performance signals, tests, and loose ends. This is intentionally a rollup doc; focused route audits
should still get their own HyperPlexed audit files.

## Summary

The rendered public UX is generally stable. A local crawl of core routes and sampled detail routes
returned `200`, showed no mobile or desktop horizontal overflow, and exposed coherent route-level
headings. The largest risks are not obvious page crashes; they are verification breakage, content
loose ends, visual drift, and oversized static assets.

## Tier 1 - cheap, high-impact

- Auth headings: `/login` and `/register` both announce the switcher copy `Login / Register`, which
  weakens route identity. Rename the primary H1 on each route and keep cross-navigation secondary.
  -> P6
- Header search tests: `HeaderSearch` now exposes an ARIA combobox, but the test still queries a
  `searchbox`. Update the tests to match the shipped control contract. -> P13
- Comment interaction tests: `Interact` reads `window.matchMedia` for reduced-motion state, while
  the jsdom test setup does not provide it. Add a test shim or defensive component guard. -> P11
- Radius ratchet: `pnpm lint:radius` reported seven off-scale raw radii in blog widgets and
  personality-detail surfaces. Normalize to the two-radius rule. -> P2
- Glass drift: booking, blog index navigation, mental-health navigation, question items, interaction
  surfaces, and personality portrait chrome still use `backdrop-filter` for ordinary UI structure.
  Replace routine glass with V5 stone surfaces and reserve special effects for earned moments.
  -> P11+P13

## Tier 2 - structural within the site

- Smoke tests can hit the wrong app because Playwright reuses `localhost:5173`. Make the web server
  config honor the smoke base URL or stop reusing arbitrary existing servers. -> P13
- Typechecking failed on D3 typings in `LineChart` and `WordCloud`. The lockfile had D3 type entries,
  but the workspace could not resolve them during `pnpm check`. -> verification
- ESLint could not start because `@eslint/js` was not resolvable from `eslint.config.js`. -> verification
- Published content quality needs cleanup: `tech-titans-disruptors.md` is published but still reads
  skeletal, and adjacent series copy was stale. -> content
- `.md.bak` blog files contain `published: true` frontmatter. They may not route today, but they are
  risky for future content importers, search, or sitemap scripts. -> content

## Tier 3 - performance and polish

- Static assets are oversized: `static/` is roughly 653 MB, several blog PNGs are 5-9 MB, and
  `static/9takes-preview.svg` is about 9.8 MB. Compress, resize, and convert heavy media to responsive
  WebP/AVIF where appropriate. -> performance
- Build output is heavy: the local client output was roughly 802 MB, global CSS was about 320 KB, and
  the admin content-board server chunk was about 800 KB. Run a bundle pass after tooling is green.
  -> performance
- Visual verification gap: this audit included rendered route checks for status and overflow, but not
  saved before/after screenshots for every changed surface. Focused screenshots are still owed for
  any surface that receives design changes. -> verification

## Verification Snapshot

- `pnpm build`: pass.
- `pnpm check`: fail, 20 errors and 137 warnings at audit time.
- `pnpm lint`: fail before ESLint starts because `@eslint/js` is not resolvable.
- `pnpm lint:radius`: fail, 7 radius violations at audit time.
- `pnpm test -- --run`: fail, 308 passing and 4 failing tests at audit time.
- Rendered crawl: pass for sampled public routes; no measured horizontal overflow.

## Follow-Up Order

1. Repair verification first: D3 types, ESLint package resolution, smoke-test targeting, stale unit tests.
2. Burn down cheap visual drift: P2 radii, P6 auth copy, and routine `backdrop-filter` surfaces.
3. Clean published content loose ends and risky backup markdown frontmatter.
4. Run an asset compression and bundle-size pass.
5. Schedule focused HyperPlexed audits for `/search`, `/book-session`, blog index/template, and admin
   content-board.

## 2026-07-04 Fix Pass

Status: initial pass shipped.

- [x] P6 auth heading split.
- [x] P11/P13 test fixes for `HeaderSearch` and `Interact`.
- [x] P2/P11/P13 focused visual debt pass for the listed surfaces.
- [x] Re-run targeted checks and record results.

### Fixes Shipped

- `/login` and `/register` now use single-purpose H1 copy and secondary route-switch links.
- `HeaderSearch.spec.ts` now queries the ARIA combobox contract and handles the visible status plus
  screen-reader live region.
- `Interact.svelte` now guards `window.matchMedia`, and `Interact.spec.ts` opens the current
  answer-to-unlock composer before asserting textarea behavior.
- Routine `backdrop-filter` usage was removed from booking panels, blog quick nav, mental-health
  quick nav, question cards, interaction composer surfaces, and the personality-detail portrait
  overlay. Translucent bases were replaced with V5 stone surfaces or a stronger image scrim.

### Post-Fix Verification

- `pnpm check`: pass, 0 errors and 137 warnings.
- `pnpm test`: pass, 72 files and 312 tests.
- `pnpm lint:radius`: pass, 0 violations.
- Targeted Prettier check for changed files: pass.
- `pnpm lint`: still blocked by unrelated Prettier drift in
  `src/blog/pop-culture/tech-titans-disruptors.md`.

---

## 2026-07-09 Full-Site Audit Update

Scope: a fresh repository-wide pass over the public route inventory, shared chrome and primitives,
desktop and 390px rendered pages, accessibility, SEO, crawl controls, production bundles, static
assets, tests, and prior audit carryover. Three independent audit tracks covered performance/SEO,
accessibility/frontend quality, and HyperPlexed UX/visual consistency. No implementation changes
were made during the audit itself.

### Verdict

The audited core routes are strong: `/`, `/questions`, sampled question threads,
`/personality-analysis`, and sampled long-form articles share a distinctive Streetlamp Symposium
identity, expose coherent headings and metadata, and showed no horizontal overflow in the live pass.
The remaining gap between "good" and "exceptional" is systemic rather than decorative: article
loading, shell ownership, accessibility primitives, truthful CTA destinations, global CSS/assets,
and cache/crawler policy.

### Highest-Priority Engineering Findings

1. **Article detail routes import every sibling article on the client.** Related-post construction in
   `pop-culture/[slug]/+page.ts`, `community/[slug]/+page.ts`, and
   `how-to-guides/[slug]/+page.ts` calls every `import.meta.glob()` resolver. A sampled production
   pop-culture article made 123 JavaScript requests, transferred 783 KB / decoded 1.92 MB of JS,
   and produced 1.28 seconds of long tasks. Move related-post selection to server-only raw
   frontmatter and import only the current article component.
2. **The universal stylesheet is too large.** Root `app.scss` pulls Tailwind plus the complete site
   and blog styles onto every route. The production global CSS artifact is 327,251 bytes raw / about
   58 KB gzip; the homepage decoded roughly 348 KB of CSS across all loaded styles. Route-scope
   blog and legacy component styles and keep only tokens, reset, and shared shell rules global.
3. **Public HTML is not edge-cacheable.** Editorial responses are commonly set to
   `private, no-store`, and the root layout performs a universal Supabase `admin_settings` query
   with a possible 1.2-second timeout. Split public cached editorial data from authenticated shell
   data and use an explicit SWR policy where access rules allow it.
4. **Crawler budgets can stop a corpus pass early.** The sitemap contains 681 URLs, while a named
   crawler is capped at 500 protected pages and 1,000 total requests per day. Unknown crawler-like
   agents are hard-blocked. Key intended discovery bots so they can complete the sitemap without
   weakening abuse controls.
5. **Named robots groups reopen private route families.** The wildcard group disallows `/admin`,
   `/login`, `/register`, and `/users`, but named AI crawler groups only declare `Allow: /` and do
   not inherit wildcard disallows. Repeat the private-route exclusions in every named group.
6. **Stable static assets revalidate on every visit.** Hashed `_app` assets are immutable, but stable
   public images are served with `max-age=0, must-revalidate`. Version or hash runtime assets and
   add a deliberate static-asset header policy.
7. **Deployment asset weight remains excessive.** `static/` is roughly 656 MB, 192 files exceed
   1 MB, and 49 exceed 5 MB. Most sampled pages correctly serve WebP, so this is primarily build,
   deploy, and accidental-regression risk. Move source originals out of `static/` and enforce CI
   budgets for runtime images.

### Tier 1 - Cheap, High-Impact

- **Root shell:** exact-path width allowlists leave `/blog`, `/about`, mental-health, and personality
  category/type layouts inside a 896px clamp even when they define 1120-1200px shells; other
  full-width routes retain global gutters. Replace the allowlists with one route-owned shell
  contract. -> P3
- **CTA truthfulness:** the advertised five-minute Enneagram assessment redirects to `/questions`.
  Build the promised test or rename/repoint every test CTA. -> P6
- **CTA truthfulness:** header/home "Book a Session" copy leads to a coaching waitlist. Use
  "Join the coaching waitlist" consistently. -> P6
- **Error recovery:** `+error.svelte` remains raw scaffolding with placeholder copy and weak recovery.
  Ship a V5 error surface with Home, Questions, and Search actions. -> P5+P6+P13
- **Radius regression:** `/corpus-stats` introduced 8px and 6px radii, so the zero-baseline radius
  lint now fails on two declarations. -> P2
- **Header search:** the mobile results panel has no viewport-aware max height or internal scroll.
  -> P1+P13
- **Back navigation:** the shared row still calls `/questions` "Question List" and consumes a full
  strip on nested routes. Rename it and decide where the strip earns its space. -> P6+P8+P11
- **Auth state styling:** login/register hover rules reference undefined `--lamp-bright`, silently
  dropping the intended state. -> P13
- **Form labels:** several public question, comment, email, and suggestion fields rely on placeholder
  text rather than persistent/programmatic labels and durable inline errors. -> P13
- **Contrast:** the danger button's white-on-red text is about 3.76:1. Light-mode semantic status
  colors and most raw Enneagram hues also fail when used as small text. Introduce theme-aware
  semantic/type text roles; reserve raw data hues for fills, stripes, and borders. -> new P?

### Tier 2 - Structural Within The Site

- **Dialogs and navigation:** canonical `Modal` is not reliably named and lacks initial focus,
  focus trapping, background inerting, and focus return. The portaled mobile navigation repeats
  the focus-containment gap. Repair the primitive and reuse it. -> P13
- **Secondary hubs:** `/blog`, personality category/type hubs, and the mental-health hub use separate
  gradient, shadow, card, and icon languages instead of the audited V5 listing grammar. Converge on
  `IndexHero`, `CaseCard`, `SectionKicker`, and one icon family. -> P3+P5+P9+P11
- **Search:** scope cards, query controls, and selects stack into a control wall before results on
  mobile. Keep search first, collapse secondary filters, and expose selected chips. -> P7+P13+P2
- **Article chrome:** long articles can show two fixed sidebars plus an always-open inline TOC.
  Choose one navigation representation per breakpoint and default the mobile TOC closed.
  -> P8+P11+P13
- **Global ornament:** every public route mounts animated particles and large glow blobs, including
  login, search, reading, and conversion pages. Restrict this signature effect to one or two earned
  marketing surfaces. -> P11
- **Coaching surface:** `/book-session` is over-containerized, gives static cards hover elevation,
  and leaks global smooth-scroll/focus rules. Flatten the middle hierarchy and scope route rules.
  -> P4+P11+P13
- **Question hierarchy:** sample perspectives precede the answer-to-unlock explanation and the lock
  state has no direct action. Put the mechanic and action first. -> P4+P6+P8
- **Hydration-only content:** initial comments, links, and AI perspectives are omitted from SSR;
  several request failures become console messages or blank states. Render supplied data on the
  server and add loading/error/retry states. -> P8+P13
- **AI carousel:** the perspective carousel has mismatched target sizes, tiny tab dots, incomplete
  tab semantics, no arrow-key model, and a weak "stereotypes" label. -> P6+P9+P11+P13
- **Landmarks:** several routes add a second `<main>` inside the root layout's main landmark.
  Keep exactly one main landmark per page. -> new P?
- **Legacy public routes:** `/signup` has no title, runs 350 legacy purple confetti particles without
  reduced-motion handling, uses extreme z-index values, and has no current internal caller.
  Redirect/delete it; retire or rebuild the similarly unfinished `/followme`. -> P3+P6+P11+P13
- **Relationship capture:** the homepage ends with coaching only despite reusable email-capture
  components elsewhere. Add one restrained, attributed capture before coaching or in the footer.
  -> P8+P13

### Tier 3 - Polish And Signature

- Do not add another P14-P18 effect yet. Remove global ornament, normalize icons, settle the shell,
  and then allow one earned signature interaction on the homepage or canonical card grid.
  -> P11+P14-P18
- Finish icon convergence after the structural pass. Public routes still mix Lucide, legacy icon
  components, inline SVG, Unicode geometry, and emoji. -> P9

### Accessibility And Frontend Quality Detail

- `Modal` tests currently cover cleanup and scroll locking, not accessible naming, focus placement,
  trapping, inert background, or return focus.
- Popover/menu, question tabs, search scope navigation, and the AI carousel claim partial widget
  semantics without the matching keyboard model. Prefer disclosure/navigation semantics unless the
  full APG interaction is implemented. -> P13
- `EmptyState` and `ErrorState` exist but are effectively styleguide-only; production flows keep
  hand-rolling empty/error behavior. Adopt the primitives. -> P6+P13
- Admin calendar/content dialogs emit explicit Svelte accessibility warnings for unlabeled controls,
  nested interaction, and unfocusable dialogs. Route them through the repaired Modal. -> P13
- Toasts treat success/info as assertive alerts and auto-remove without dismissal. Use `status` for
  noncritical updates and preserve critical alert behavior for actual errors. -> P13

### SEO And Discoverability Baseline

The foundation is strong. Sampled homepage, question, personality, community, how-to, Enneagram,
and mental-health pages had one H1, canonical URLs, indexable robots directives, descriptions, OG
metadata, and parseable JSON-LD. `SEOHead.svelte` covers canonical/alternate, OpenGraph, Twitter,
robots, and JSON-LD. Sitewide Organization, Person, and WebSite schema is present. The generated
sitemap had 681 unique locations, no duplicate URLs, and all sampled image references resolved.
`llms.txt` and `llms-full.txt` are present. An unthrottled nearby production sample measured homepage
LCP around 564 ms and CLS around 0.009; field/mobile CWV still needs confirmation.

### 2026-07-09 Verification Snapshot

- `pnpm build`: pass in 3m 56s; output client directory about 806 MB because runtime assets are copied.
- `pnpm check`: pass, 0 errors and 137 warnings in 43 files.
- `pnpm test`: pass, 72 files and 312 tests.
- `pnpm lint:radius`: fail, two new `/corpus-stats` violations.
- `pnpm lint`: stops on Prettier drift in eight documentation files before ESLint/radius.
- `pnpm test:smoke`: the configured `localhost:5173` web server could not start in the audit
  environment even when an alternate smoke base URL was supplied; the webServer config still owns
  port 5173 independently.
- Live review: desktop homepage plus mobile home, questions, a question thread, an article, a
  personality dossier, search, coaching, login, and legacy signup. Sampled routes showed no
  horizontal overflow. Screenshots were captured in the app but not written to the repository.

### Recommended Execution Order

1. Remove all-sibling client imports from article detail routes.
2. Repair Modal/mobile-nav focus, contrast roles, labels, and durable form errors.
3. Resolve shell ownership, test/coaching CTA truthfulness, the error page, and legacy `/signup`.
4. Route-scope global CSS and create static-asset budgets.
5. Separate cacheable editorial HTML from personalized data; fix crawler budgets and robots groups.
6. Converge secondary hubs, article chrome, coaching density, icons, and global ornament.

---

## 2026-07-09 Implementation Pass 1

Status: highest-priority performance fix shipped in the working tree, with several safe Tier 1
cleanups completed alongside it.

### Fixes Shipped

- **Article detail resolver fan-out removed.** The community, how-to, and pop-culture detail routes
  no longer execute every sibling markdown module resolver in the browser to build related-post
  cards. Server loaders now parse raw frontmatter, cache that metadata for the request process, and
  return the selected related posts with the page data. The universal loaders invoke only the
  resolver for the requested article component. This is the first item in the recommended execution
  order and the largest confirmed route-level performance defect from the audit.
- **Related-post behavior covered by tests.** Added unit coverage for frontmatter loading/caching,
  recency selection, community matching, and pop-culture taxonomy ranking.
- **Coaching CTA copy made truthful.** The homepage and mobile header now say “Join the coaching
  waitlist” instead of promising immediate session booking.
- **Radius regression cleared.** The two `/corpus-stats` declarations now conform to the V5 radius
  scale and the zero-baseline ratchet.
- **Auth hover state repaired.** Login and registration hover rules now use the defined
  `--lamp-deep` token instead of the nonexistent `--lamp-bright` token.

### Production Preview Verification

All three affected article families were opened from a production build. Each rendered the expected
H1, retained six related-article cards, and produced no captured console errors:

| Route sample                                          | Observed script assets | Total observed assets | Related cards |
| ----------------------------------------------------- | ---------------------: | --------------------: | ------------: |
| `/community/what-winning-online-arguments-looks-like` |                     63 |                    85 |             6 |
| `/how-to-guides/ultimate-guide-to-active-listening`   |                     67 |                    90 |             6 |
| `/pop-culture/tech-titans-ai-wars`                    |                     70 |                   103 |             6 |

The pop-culture sample previously issued 123 JavaScript requests in the live audit. The production
preview's 70-script inventory is a strong directional improvement, but it is not a substitute for a
same-environment field trace after deployment; transfer size, long tasks, and LCP should be measured
again on the deployed route.

### Post-Fix Verification

- `pnpm check`: pass, 0 errors and 137 warnings in 43 files.
- `pnpm test`: pass, 73 files and 316 tests.
- Related-post unit suite: pass, 4 tests.
- `pnpm lint:radius`: pass, 0 violations and a zero-item backlog.
- `pnpm build`: pass; Vite production build completed in 3m 3s. The Vercel adapter still reports
  optional Sharp dependency-discovery warnings.
- Production preview: pass for the three affected article families.

### Next Highest-Priority Slice

1. Repair the canonical Modal and mobile-navigation focus model, then add accessible-name, initial
   focus, trap, inert-background, Escape, and focus-return tests. -> P13
2. Introduce theme-aware semantic contrast roles and fix persistent labels and inline form errors.
   -> P13
3. Replace root route-width allowlists with a single route-owned shell contract, then repair the
   misleading assessment CTA and error page. -> P3+P5+P6+P13
4. Route-scope global CSS and establish deploy/static-asset budgets. -> performance

---

## 2026-07-09 Implementation Pass 2

Status: the next P13 accessibility slice is shipped in the working tree.

### Fixes Shipped

- **Shared focus-boundary utility.** Added one reusable contract for focusable-element discovery,
  initial focus, Tab/Shift+Tab wrapping, reference-counted background inerting, and safe focus
  restoration. Modal and mobile navigation now share this behavior instead of maintaining separate
  partial implementations. -> P13
- **Canonical Modal repaired.** Dialogs now expose a reliable accessible name, support visible-heading
  naming through `labelledBy`, accept an optional `initialFocus` selector, move focus inside after
  opening, trap focus, inert the page behind them, keep only the top stacked modal interactive, close
  on Escape when allowed, and restore the opener. Closed portaled dialogs are inert and hidden from the
  accessibility tree. Existing viewport-safe sizing and shared scroll locking remain intact. -> P13
- **Mobile navigation repaired.** The portaled drawer now focuses its close button, traps focus in both
  directions, inerts the background, restores the menu toggle after dismissal, and uses the same shared
  scroll-lock/focus helpers as Modal. The Library control now uses disclosure semantics instead of
  incorrectly claiming a popup menu. -> P13
- **Current Modal consumers named.** Every current canonical Modal usage now supplies a descriptive name
  or visible-heading reference. The flag-comment flow no longer nests a second `role="dialog"` inside the
  canonical dialog. -> P6+P13

### Verification

- `pnpm check`: pass, 0 errors and 126 warnings in 43 files.
- `pnpm test`: pass, 76 files and 331 tests.
- Modal/mobile-navigation regression suite: pass, 5 tests covering accessible naming, initial focus,
  focus wrapping, stacked inert/scroll locks, Escape, unmount cleanup, and focus restoration.
- Targeted ESLint: pass for the primitive, drawer, utility, tests, and updated consumers.
- `pnpm lint:radius`: pass, 0 violations and a zero-item backlog.
- `pnpm build`: pass; Vite completed the production bundles in 3m 28s and the Vercel adapter
  completed with its existing optional Sharp dependency-discovery warnings.
- Live browser verification at 390×844: mobile navigation focused Close on open, wrapped
  Shift+Tab from Close to Login/Register and Tab back to Close, inerted and scroll-locked the page,
  and restored the opener after Escape.
- Live public Modal verification: the question-thread QR dialog exposed the accessible name “Share
  this question,” focused Close, inerted and scroll-locked the page, and restored the Share trigger
  after Escape.
- Screenshots were not added because this slice changes interaction semantics without changing the
  visual treatment.

### Next Highest-Priority Slice

Introduce theme-aware semantic contrast roles, beginning with danger/status text, then fix public
forms that still rely on placeholders instead of persistent labels and durable inline errors. -> P13

---

## 2026-07-09 Implementation Pass 3

Status: the contrast and public-form portion of the P13 accessibility slice is shipped in the
working tree.

### Fixes Shipped

- **Theme-aware semantic contrast roles.** Added explicit success, warning, error, and info text
  roles plus a paired danger surface/on-surface contract for both themes. The measured danger
  pairs are 5.31:1 in dark mode and 6.47:1 in light mode; the light success and warning text roles
  measure 5.48:1 and 7.09:1 on white. A regression test reads the actual SCSS tokens and enforces
  the 4.5:1 floor. -> P13
- **Canonical destructive action repaired.** `Button` and its styleguide reference now use
  `--danger-surface`, `--danger-surface-hover`, and `--text-on-danger` instead of assuming white
  text on the raw error hue. Public status-copy consumers touched by this pass now use semantic
  text roles rather than raw fill/border colors. -> P13
- **Persistent public-form labels and errors.** The reusable article signup, blog-purpose signup,
  Enneagram sidebar signup, personality suggestion form, question creator, main answer composer,
  comment reply composer, and Nine Chorus response now expose visible labels, stable help/error
  IDs, `aria-invalid`/`aria-describedby`, and durable inline validation or API failures. Toasts are
  retained as supplemental feedback rather than the sole error channel. -> P13
- **Primitive adoption and target sizing.** The personality suggestion and question-creation
  primary actions now route through the canonical `Button`; reusable signup and suggestion submit
  targets render at roughly 46px on mobile. -> P13
- **Type color returned to data duty.** Nine Chorus keeps Enneagram hues on borders and subtle fills
  while its small labels use the theme text system, avoiding unreadable type-colored microcopy in
  light mode. -> P2+P13
- **Stacked Modal edge case locked down.** The focus-boundary double-check now explicitly verifies
  that only the top stacked dialog is interactive and that closing it reactivates the previous
  dialog without releasing the page background. -> P13

### Verification

- `pnpm check`: pass with no errors.
- `pnpm test`: pass, 86 files and 394 tests.
- Focus/form/contrast regression suite: pass, 14 tests across Modal, mobile navigation, Interact,
  article signup, personality suggestion, and semantic-token coverage.
- Targeted ESLint: pass with 0 errors; the styleguide remains intentionally ignored by the current
  ESLint configuration.
- `pnpm lint:radius`: pass, 0 violations and a zero-item backlog.
- `pnpm build`: pass; Vite completed the production bundles in 24m 28s while unrelated admin files
  were changing concurrently, and the Vercel adapter completed with the existing optional Sharp
  dependency-discovery warnings.
- Live browser verification: the article signup was checked in dark and light desktop states,
  including its invalid-email alert, then at 390x844 with no horizontal overflow and 46px input and
  submit targets. The Taylor Swift personality page exposed both persistent suggestion labels; its
  form remained 300px wide with 46px submit height and no page overflow at 390px.
- Live screenshots were inspected in the app but not added to the repository.

### Next Highest-Priority Slice

Replace root route-width allowlists with one route-owned shell contract, then repair the global error
page and retire or redirect the misleading legacy `/signup` and `/followme` surfaces. -> P3+P5+P6+P13

---

## 2026-07-09 Implementation Pass 4

Status: the shell-ownership, global recovery, and legacy-route slice is shipped in the working tree.

### Fixes Shipped

- **Route-owned shell contract.** Replaced the root layout's exact-path width allowlist with typed
  `pageShell` data. The default remains the contained reading shell; broad marketing, index,
  search, and questions-index routes opt into the owned shell from their page load, while
  personality-analysis and admin use parent layouts for their broad nested route families. Question
  detail pages deliberately remain in the contained reading shell. -> P3
- **Aligned back navigation.** `BackNavigation` now follows the selected shell width and its stale
  “Question List” label is now the concise “Questions.” -> P3+P6
- **Global V5 recovery surface.** Replaced the placeholder error page with a noindex recovery card
  that distinguishes 404s, avoids leaking raw error details, and offers clear Home, Questions,
  Search, and support routes. The surface uses semantic error tokens and the canonical `Button`
  primitive, with stacked mobile actions and visible focus treatment. -> P5+P6+P13
- **Legacy surfaces retired.** Removed the confetti-heavy `/signup` experiment and unfinished
  `/followme` embed page. Server routes now issue permanent 308 redirects to `/` and `/about`,
  respectively. Neither route had active internal callers or sitemap entries. -> P3+P6+P11+P13
- **Regression coverage.** Added focused tests for shell resolution, error-page semantics, and both
  permanent redirect contracts.

### Verification

- `pnpm check`: pass with 0 errors and the existing 126-warning baseline.
- `pnpm test`: pass, 89 files and 399 tests.
- Targeted ESLint: pass with 0 errors; the root layout remains intentionally ignored by the current
  ESLint configuration.
- `pnpm lint:radius`: pass, 0 violations and a zero-item backlog.
- `pnpm build`: pass; Vite completed the production bundles in 1m 44s and the Vercel adapter
  completed with its existing optional Sharp dependency-discovery warnings.
- Live shell verification at 1280px: `/about`, `/blog`, the mental-health hub, Type 3 personality
  analysis, and `/questions` rendered at the full owned-shell width without overflow; an ordinary
  community article and `/questions/whats-your-biggest-fear` both remained centered at the intended
  896px contained width.
- Live error verification: the 404 recovery page was inspected in dark and light desktop themes
  and at 390x844. The mobile card stayed within 358px, every recovery action used the available
  324px width, and the document had no horizontal overflow.
- Live redirect verification: `/signup` resolved to `/` and `/followme` resolved to `/about`.

### Next Highest-Priority Slice

Route-scope legacy/global CSS and establish explicit deploy and static-asset budgets, beginning
with the blog styles currently shipped to every route. Then separate public cached editorial data
from authenticated shell state so public pages do not inherit the root auth timeout. -> performance

---

## 2026-07-09 Implementation Pass 5

Status: the first global-CSS split and the deploy/runtime-asset budget ratchets are shipped in the
working tree.

### Fixes Shipped

- **Article CSS is no longer global.** Removed `blog.scss` from the root `app.scss` entry and moved
  it behind the shared `TableOfContents` article chrome. All six public long-form templates already
  render that component, so article prose, tables, callouts, and furniture remain available without
  charging home, index, questions, search, about, auth, or coaching routes for those rules.
- **Global CSS reduced.** The root stylesheet fell from 327,362 bytes (319.69 KiB) to 295,502 bytes
  (288.58 KiB), a 31,860-byte / 9.7% raw reduction on every route. Its gzip size is now 53,441
  bytes. The route-scoped article/TOC stylesheet is 33,614 bytes raw / 5,371 bytes gzip and loads
  only with long-form article routes.
- **Build and asset budgets are enforced.** Added `scripts/check-build-budgets.mjs` plus the explicit
  ratchet in `scripts/build-budgets.json`. Production builds now fail when root CSS exceeds 300 KiB,
  client deploy output exceeds 700 MiB, runtime media/font bytes grow beyond the measured baseline,
  the counts above 1 MiB or 5 MiB rise, or a runtime asset exceeds 10 MB. `pnpm check:budgets` can
  run the same check against the latest production output.
- **Deploy budgets are on the real path.** The ordinary `pnpm build` script now runs the budget
  checker after the Vercel adapter, so `build:vercel` inherits the same enforcement instead of
  leaving the ratchet as an optional report.
- **Dead route module removed.** Deleted the comments-only `questions/+page.ts`, eliminating the
  zero-byte route chunk from production builds. The stricter generated type contract exposed an
  anonymous-user mismatch, so the questions server payload now returns `null` instead of
  `undefined`, matching the search component's `User | null` contract.

### Budget Baseline

| Metric                    |    Current |    Maximum |
| ------------------------- | ---------: | ---------: |
| Root/global CSS           | 288.58 KiB | 300.00 KiB |
| Client deploy output      | 678.03 MiB | 700.00 MiB |
| Runtime media and fonts   | 651.75 MiB | 651.75 MiB |
| Runtime assets over 1 MiB |        191 |        191 |
| Runtime assets over 5 MiB |         46 |         46 |
| Largest runtime asset     |   9.53 MiB |   9.54 MiB |

The largest runtime asset remains `static/9takes-preview.svg` at 9.53 MiB. These media limits are
ratchets, not healthy end-state targets: future asset work should lower them as source originals
move out of `static/` and heavy PNGs gain responsive runtime variants.

### Verification

- `pnpm check`: pass with 0 errors and the existing 126-warning baseline.
- `pnpm test`: pass, 89 files and 399 tests.
- Targeted ESLint and Prettier: pass for the budget checker, article-style owner, question payload,
  package scripts, and budget config.
- `pnpm lint:radius`: pass, 0 violations and a zero-item backlog.
- `pnpm build`: pass; Vite completed under concurrent machine load in 6m 49s, the Vercel adapter
  completed with its existing optional Sharp discovery warnings, and every new budget check passed.
- Manifest verification: the homepage, `/blog`, `/questions`, `/search`, `/about`, and
  `/book-session` do not depend on the article stylesheet. Community, how-to, pop-culture,
  Enneagram, mental-health, and personality-analysis article leaves all do.
- Production-preview verification: the homepage loaded six stylesheets without the article bundle.
  A sampled community article loaded `TableOfContents.BypLFNf_.css`, retained its table of contents,
  and computed to the intended 18px reading body, 16px desktop article radius, and 75ch measure.
  At 390x844 it retained 18px body text, used the 10px mobile radius, and had no horizontal overflow.

### Next Highest-Priority Slice

Separate cacheable public/editorial data from authenticated shell state, remove the root
`admin_settings` timeout from anonymous page loads, and establish an explicit SWR policy where
access rules allow it. Then repair crawler completion budgets, repeat private-route exclusions in
named robots groups, and add deliberate cache headers for stable runtime assets. -> performance+SEO

---

## 2026-07-09 Implementation Pass 6

Status: the public-delivery, crawler, robots, and stable-asset cache slice is shipped in the working
tree.

### Fixes Shipped

- **Public editorial HTML is separated from authenticated chrome.** Community, how-to, pop-culture,
  Enneagram, mental-health, and Enneagram-subtopic leaves now render an intentionally public SSR
  shell. A small shared auth context hydrates account/admin chrome from a new private
  `/api/auth-shell` endpoint after the article is interactive. Header, mobile navigation, and
  article signup visibility consume that context instead of forcing the complete article response
  to carry authenticated state.
- **Personalized pages stay private.** Personality-analysis leaves are deliberately excluded from
  the public cache classifier because their answer gate and visible comments depend on the
  authenticated user or fingerprint. Normal personality requests remain `private, no-store`, while
  recognized search-preview GETs retain the existing one-hour edge policy.
- **Anonymous articles no longer inherit `admin_settings`.** The root layout no longer reads the
  demo-mode flag. That dependency moved into route-family layouts for `/questions`, `/account`,
  `/users`, and `/admin`, the only page families that consume the demo table switch. Static
  editorial requests therefore cannot wait on the former 1.2-second root timeout.
- **Explicit SWR contract.** Public editorial responses now use
  `public, max-age=0, s-maxage=300, stale-while-revalidate=86400, stale-if-error=86400`, vary by
  `User-Agent` so the crawler guard keeps its distinct response classes, and do not set the
  anonymous-access cookie. Development remains uncached.
- **Crawler completion budgets now fit the corpus.** The current sitemap contains 681 URLs, 555 of
  which pass through the protected-content guard. Named AI crawler limits now allow one complete
  protected corpus pass: 650 unique / 750 total in ten minutes and 750 unique / 1,500 total per day.
  Unknown crawler user agents remain hard-blocked, and a regression test derives the protected
  count from the real sitemap rather than trusting a stale constant.
- **Named robots groups keep private routes private.** Every named AI/search crawler group now
  repeats the `/account`, `/admin`, `/forgotPassword`, `/login`, `/register`, `/resetPassword`, and
  `/users` exclusions instead of reopening them with a bare `Allow: /`.
- **Stable runtime assets have deliberate browser caches.** Fonts use a one-year immutable policy.
  `/blogs`, `/books`, `/brand`, `/icons`, `/types`, and the 9.53 MiB preview SVG use a one-day browser
  cache with a seven-day stale-revalidation window; non-hashed media is intentionally not marked
  immutable. `vercel.json` now declares the official schema, and tests lock the policy.

### Verification

- `pnpm check`: pass with 0 errors and the existing 126-warning baseline.
- `pnpm test`: pass, 92 files and 408 tests.
- Public-delivery/auth/crawler/mobile-navigation regression subset: pass, 24 tests.
- Targeted ESLint and Prettier: pass; the how-to article template remains intentionally ignored by
  the current ESLint configuration.
- `pnpm lint:radius`: pass, 0 violations and a zero-item backlog.
- `pnpm build`: pass in 1m 16s; the Vercel adapter completed with the existing optional Sharp
  discovery warnings and every build/runtime-asset budget passed.
- Production-preview headers: a normal community article GET returned the five-minute SWR policy,
  `Vary: User-Agent`, and no `Set-Cookie`; a normal personality page remained `private, no-store`;
  a Googlebot personality GET returned the existing one-hour preview policy; `/api/auth-shell`
  returned `private, no-store`; and an unknown `crawler/1.0` request remained a 403.
- Live visual verification: the sampled community article retained its H1, TOC, related articles,
  and signup in the public shell. At 1280px it stayed inside the 851.66px article measure with a
  16px radius. At 390x844 it used 374px without horizontal overflow, kept 18px/29.7px reading text,
  and used the 10px mobile radius. Browser console warnings/errors: none.

### Next Highest-Priority Slice

Reduce deployment asset weight instead of merely ratcheting it: move unused/source originals out
of `static/`, replace the 9.53 MiB preview SVG and the largest runtime PNGs with right-sized delivery
assets, and lower the build-budget baselines as each group lands. Then return to the remaining
surface-convergence work: secondary hubs, article navigation density, coaching hierarchy, icons,
and global ornament. -> performance+P3+P8+P9+P11

---

## 2026-07-10 Implementation Pass 7 - Asset Forensics

Status: the approved no-quality-loss deployment-asset slice is shipped. No image was deleted,
resized, or recompressed; source originals moved byte-for-byte. Detailed findings live in
[`STATIC_ASSET_AUDIT_2026-07-10.md`](./STATIC_ASSET_AUDIT_2026-07-10.md).

### Findings

- **Portraits are not the deployment problem.** The entire famous-person library under
  `static/types/` is 40.58 MiB, only 6.2% of `static/`. Its 418 full WebPs total 23.67 MiB; the
  largest is 169.3 KiB, and none exceeds 200 KiB. The first asset implementation pass will leave
  this category unchanged. -> P10+performance
- **Public source masters dominate the build.** Two hundred one blog PNGs have same-stem WebP
  delivery files, total 518.07 MiB, and have no direct PNG-path references across the 1,506 scanned
  source/script text files. They accounted for 79.4% of `static/` and now live byte-for-byte under
  `source-assets/blogs/`. All current WebP delivery files remain public. -> performance
- **The preview SVG is embedded raster data.** The 9.53 MiB SVG contains four base64 raster images,
  including a 6.36 MiB JPEG. Equivalent 929x1289 PNG and WebP outputs already exist at 728.8 KiB and
  113.3 KiB, and no application/content source references the SVG. Its source now lives outside
  `static/`, and the legacy public URL permanently redirects to the PNG. -> performance
- **Delivery WebPs are a second-phase concern.** No full blog WebP exceeds 1 MiB, though 33 remain
  wider than 2,400px. New responsive candidates should be generated and visually compared rather
  than overwriting existing files. -> P10+performance
- **Exact duplicates are low leverage.** Eight duplicate groups represent only 1.50 MiB and include
  deliberate aliases; they are deferred. -> P6+performance

### Safe Tooling Shipped

- Added `scripts/audit-static-assets.mjs`, a read-only inventory for path/format bytes, raster
  dimensions, source/delivery pairs, direct reference signals, exact hashes, and embedded preview
  payloads. It now verifies the public/source boundary and fails when an archived blog master loses
  its same-stem WebP delivery file.
- Updated `scripts/gen-blog-image-openrouter.mjs` so future lossless PNG masters go to
  `source-assets/blogs/`; only full and thumbnail WebPs enter `static/blogs/`.
- Added build ratchets for the protected portrait library and for zero paired PNG masters in
  `static/`, preventing the 518 MiB regression from returning unnoticed.
- Repaired the mobile smoke runner's known wrong-app reuse bug by giving it an isolated strict port.
  The first clean run then passed all 14 mobile SSR/overflow/console checks.
- Replaced three stale image URLs discovered by the direct-reference crawl with existing,
  semantically matching assets.

### Result

Runtime media/font weight fell from 651.75 MiB to 124.15 MiB, an 80.9% reduction. Client deploy
output fell from 678.03 MiB to 150.43 MiB. Runtime assets over 1 MiB fell from 191 to 17, and those
over 5 MiB fell from 46 to 1. The famous-person library remains byte-for-byte unchanged at 40.58
MiB / 832 files.

### Verification

- All 201 moved PNG masters match their pre-move byte counts and SHA-256 hashes. The archived SVG
  remains 9,989,150 bytes with its original hash.
- `node scripts/audit-static-assets.mjs`: pass; 201 archived masters, zero missing WebP counterparts,
  zero direct legacy references, and zero paired PNG masters still public.
- Production build: pass; all 1,567 public files copied with matching byte counts, with no
  `source-assets/` path in client output.
- Direct asset-reference crawl: pass, 178 references and zero missing files.
- `pnpm test`: pass, 92 files and 409 tests.
- `pnpm test:smoke`: pass, 14 tests on the isolated server.
- `pnpm check`: pass with 0 errors and the existing 126-warning baseline.
- `pnpm lint:radius`: pass, zero violations and a zero-item backlog.
- Lowered build budgets: pass, including 150.43 MiB client output, 124.15 MiB runtime assets,
  40.58 MiB / 832 protected portrait files, and zero public paired PNG masters.

### Next Highest-Priority Slice

Assess the remaining 17 assets over 1 MiB caller-by-caller, beginning with root/brand PNGs that have
existing WebP siblings but excluding server-side social-card inputs. Generate new candidates and
compare at real rendered sizes before any replacement. Keep the famous-person portraits out of that
slice. Then return to secondary-hub convergence, article navigation density, coaching hierarchy,
icons, and global ornament. -> P3+P8+P9+P10+P11+performance

---

## 2026-07-10 Implementation Pass 8 - Large-Asset Caller Review

Status: the conservative caller-by-caller review is shipped in the working tree. No asset was
recompressed, no delivery file was overwritten, and all famous-person portraits remain untouched.

### Fixes Shipped

- **Every remaining large asset is classified.** `scripts/static-asset-policy.json` records the
  caller role and keep/archive decision for every public file over 1 MiB. The read-only asset audit
  and production budget checker now fail if an unreviewed large asset appears or a policy entry
  becomes stale. -> P10+performance
- **Generator and social-card inputs are protected.** `greek_pantheon.png`,
  `philosopher-gathering.png`, and `acrop.png` remain unchanged because social-card/OG or poster
  generation intentionally consumes them. Public brand-handoff masters remain in place as well.
  -> P10
- **Uncertain URLs were retained.** Nine PNG-only blog assets have no repository, sitemap,
  Git-history, or indexed-search caller, but they were not moved because external URLs and historic
  database content cannot be disproved locally. -> P8+performance
- **Four source masters left the deploy tree safely.** Three book-cover PNGs and the original
  founder-profile JPG moved byte-for-byte to `source-assets/`. Same-dimension WebP delivery files
  were already active, and permanent redirects preserve the four former public URLs. -> P10+performance
- **Archive integrity is enforced.** The policy stores each source SHA-256, verifies the delivery
  counterpart and redirect, rejects a reintroduced public master, and rejects new production
  references to the legacy URL.

### Result

Public runtime media fell another 3.21 MiB, from 124.15 MiB to 120.94 MiB. Client deployment output
fell from 150.43 MiB to 147.22 MiB, and assets over 1 MiB fell from 17 to 15. Cumulatively, runtime
media is down 81.4% from the original 651.75 MiB baseline while the 40.58 MiB / 832-file portrait
library remains unchanged.

### Verification

- Production build: pass in 2m 48s plus the Vercel adapter; existing optional Sharp discovery
  warnings remain.
- Redirect/policy regression test: pass, 5 tests.
- `pnpm check`: pass with 0 errors and the existing 126-warning baseline.
- `pnpm test`: pass, 92 files and 410 tests.
- `pnpm lint:radius`: pass, zero violations and a zero-item backlog.
- `node scripts/audit-static-assets.mjs`: pass; 15/15 large assets reviewed and all four archived
  delivery pairs verified.
- Lowered budgets: pass at 147.22 MiB client output, 120.94 MiB runtime media, and 15 assets over
  1 MiB.
- Targeted ESLint, Prettier, `git diff --check`, and individual source-master checksums: pass.

### Next Highest-Priority Slice

Return to the visible surface-convergence backlog rather than making speculative image changes:
secondary hubs, article navigation density, coaching hierarchy, icon consistency, and global
ornament. Start with the `/blog` hub and its shared index grammar. -> P3+P5+P8+P9+P11
