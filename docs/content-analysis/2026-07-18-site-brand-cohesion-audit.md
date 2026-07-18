<!-- docs/content-analysis/2026-07-18-site-brand-cohesion-audit.md -->

# 9takes Site-Wide Brand & Cohesion Audit — 2026-07-18

**Trigger:** homepage redesign shipped (`src/routes/+page.svelte`, "home-reimagined"). This audit measures every other surface against it.
**Method:** five parallel deep audits — core Q&A funnel, content/blog surfaces, conversion & identity, global chrome & design system, route hygiene & journey flow — all findings verified against source with file:line evidence.
**Brand bar used:** Streetlamp Symposium V5 (amber `--lamp-glow` on warm stone, teal as data accent only, Inter + JetBrains Mono kickers), "One question. Nine ways to see it.", give-first mechanic, manifesto voice, post-July-2026 positioning (Enneagram = pattern/clustering map; no "explains WHY" etiology claims).

---

## Executive verdict

The token war is won (~85% of chrome and major surfaces on V5) and the homepage, /questions index, categories, /book-session, /account, and the error page are genuinely on-brand. But the site currently tells its best story only on the homepage. Three systemic breaks:

1. **The product under-delivers the ad.** The homepage demos an open composer, "Post answer and reveal," blurred takes, a nine-color grid, and a mirror read. The real question page hides the composer behind a paywall-flavored "Answer to unlock" button, delivers the reveal as a cramped carousel titled **"Enneagram Takes (stereotypes)"**, and has no mirror at all.
2. **The doorways don't lead to the cathedral.** The give-first bridge exists on exactly one post template (personality-analysis NineChorus) plus ~4 enneagram-corner posts. Community, how-to-guides, pop-culture, and mental-health templates terminate at email capture. The header buries Questions inside a "Library" dropdown — an archive story, not a conversation story.
3. **Everything that faces outward is still the old brand.** New questions mint purple Solo-Leveling social cards; every non-homepage share uses the gray January OG card; a cyan neon particle layer floats above content sitewide (the homepage z-index-shields itself against it); the purged "explains WHY" pitch is still live in five enneagram-corner shell passages _and their FAQPage JSON-LD_.

Plus one non-brand emergency found along the way: an unauthenticated write path into the 9takes Google Calendar.

---

## Surface scorecard

| Surface                               | Verdict                     | One-line reason                                                                                               |
| ------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Homepage `/`                          | ✅ ON-BRAND                 | The anchor. One known bug (duplicate-answer dead end, see P0-2)                                               |
| /questions index                      | ✅ ON-BRAND                 | "Drop a situation. Get nine reads." — but FAQ JSON-LD contradicts "no account / no type needed"               |
| /questions/categories (+[slug])       | ✅ ON-BRAND                 | Full V5; minor meta-copy drift                                                                                |
| /questions/[slug]                     | ⚠️ PARTIAL                  | Chrome right; wall + reveal break the homepage promise (P0)                                                   |
| /questions/create                     | ❌ OFF-BRAND                | Untouched legacy screen; "Spark a Conversation!" voice; mints purple social card                              |
| /search                               | ⚠️ PARTIAL                  | Tokens right; hand-rolled eyebrow, "comments/matches/library" vocabulary drift                                |
| /community                            | ✅ index / ⚠️ post template | Best blog citizen (links /questions both ends); template has no give-first block                              |
| /enneagram-corner                     | ⚠️ PARTIAL                  | Visually migrated; carries the worst etiology violations on the site (P0)                                     |
| /how-to-guides                        | ⚠️ DEAD-END                 | On-brand shell; zero /questions references in the entire section                                              |
| /pop-culture                          | ⚠️ PARTIAL                  | On-voice page; legacy "serial killers & Dark Triad" SEO layer                                                 |
| /personality-analysis                 | ✅ flagship                 | Only section where doorway→cathedral works; but index has no outro/CTA, NineChorus styles on undefined tokens |
| /stories/enneagram-and-mental-illness | ❌ OFF-BRAND + broken       | Purple AMP palette + `var(--lamp-glow)` undefined inside AMP doc                                              |
| /blog hub                             | ⚠️ PARTIAL                  | Competing tagline "One System. Many Lenses."; off the V5 grammar                                              |
| /book-session                         | ✅ ON-BRAND                 | Best voice outside homepage; never bridges to /questions                                                      |
| /enneagram-test                       | ❌ BROKEN PROMISE           | Redirect stub; welcome email + blog CTAs send "take the test" traffic there                                   |
| /about                                | ⚠️ PARTIAL                  | Voice on; purple/rose/sky center palette off; aero.png OG                                                     |
| /login /register                      | ⚠️ PARTIAL                  | Styled right, says nothing; "for a good time" meta copy                                                       |
| /signup                               | ⚠️                          | 308 → `/` (drops account intent; should → /register)                                                          |
| /forgotPassword /resetPassword        | ✅                          | Functional tier, correct                                                                                      |
| /account                              | ✅ ON-BRAND                 | The account value prop lives here — invisible at the register door                                            |
| /account/unsubscribe/[slug]           | ⚠️                          | Legacy glass-card; amber primary on "Yes, unsubscribe" (inverted emphasis)                                    |
| /goodbye /thanks-for-staying          | ✅ voice / ⚠️ execution     | "You are off the list." — but hand-rolled white buttons, "reactivation sequence" jargon                       |
| /intake/[token]                       | ⚠️ PARTIAL                  | Same house, different host: "we/us" vs book-session's "I"; childhood-message prompt near etiology register    |
| +error.svelte                         | ✅ ON-BRAND                 | "Something went sideways" — routes back into the loop                                                         |
| Header/Footer chrome                  | ⚠️                          | V5 tokens ✓; IA tells "Library/archive" story; no persistent answer CTA; coaching invisible on desktop        |
| Welcome email sequence                | ✅ copy                     | Give-first pitch verbatim, zero etiology, zero old taglines — but step 3 sells the nonexistent test           |
| Route hygiene                         | ✅ mostly                   | test-solo-leveling/poopmap dirs are empty (no routes); prototypes noindexed; sitemap is strict allowlist      |

---

## P0 — fix first

1. **Kill `/calendar?/addEvent`** (`src/routes/calendar/+page.server.ts:41-93`). Unauthenticated form action inserts arbitrary events + attendee emails into usersup@9takes.com's Google Calendar via the service-account JWT — an outbound-invite spam/phishing vector. Page body is dev-only but the action is live. Delete the route.
2. **Homepage duplicate-answer dead end.** Visitors who already answered question 567 get `answerRecorded=false` from `/api/nine/mirror` (`api/nine/mirror/+server.ts:109-133`; migration `20260513_harden_question_comment_identity.sql:89` raises on duplicates) → homepage throws "We could not add your answer… Try again" (`+page.svelte:165-167`) and retry can never succeed. Treat duplicate as success (they're already unlocked) or precheck `can_see_comments_3` and render the revealed state.
3. **Rebrand the question social cards** — both generators still paint the purged purple palette: `src/lib/components/questions/QuestionSocialCardTemplate.svelte:71,98,108` (create-flow html2canvas card) and `src/lib/server/socialCards/renderQuestionSocialCard.ts:173-209` (server card). Rebuild on night-deep/amber/Inter with mono footer ("9 TAKES · ANSWER FIRST"); bump `QUESTION_SOCIAL_CARD_VERSION` (`questionSocialCard.ts:6`) to invalidate stored purple cards. Every share of every question is currently off-brand.
4. **Regenerate the default site OG card** (`static/twitter-card-9takes.webp`, referenced by SEOHead defaults) from the streetlamp-nine treatment. Every non-homepage page shares the gray January card.
5. **Rebuild the reveal moment.** `src/lib/components/molecules/AIComments.svelte:44` — retitle "Enneagram Takes (stereotypes)" → "The nine takes"; replace the one-at-a-time carousel with the homepage's nine-grid (TYPE_COLOR_MAP borders, "Community take / AI-seeded" labels). This is the product's one magic moment and currently its weakest screen.
6. **Open the give-first composer by default** on unanswered question pages and port the homepage wall language: blurred real answers, "Other answers stay blurred. Post yours to reveal them.", "no account required", submit = "Post answer and reveal". Files: `Interact.svelte:42,85,565-570`; `QuestionContent.svelte:180-206`.
7. **Purge the etiology copy** (renders on-page AND into FAQPage JSON-LD): `enneagram-corner/+page.svelte:71` ("reveals WHY you act the way you do"), `:81` ("Enneagram explains why"), `:86` ("forms in childhood"), `EnneagramCategoryIntro.svelte:248` ("WHY you do things… formed in childhood"), `:516-523` ("exactly why you sabotage yourself"). Rewrite into notice/pattern framing per the homepage register.
8. **Fix /enneagram-test.** Replace the redirect stub with a real landing page that owns the reframe ("9takes doesn't type you with a checkbox quiz — you find your pattern by answering"). Traffic sources already pointing there: welcome email step 3 (`welcome-sequence-content.ts:16,112,130`), `TestYourTypeCTA.svelte:25`, `NineChorus.svelte:207`, `PeopleSuggestionsSideBar.svelte`.
9. **Retire FloatingParticles from the global layout** (`+layout.svelte:674`; cyan glow at `z-index:25` above content, `FloatingParticles.svelte:62,71-87`), then delete the homepage's defensive `z-index:26; isolation:isolate` shield. Particle effects are on the design system's explicit NOT list.
10. **Put the funnel in the chrome:** persistent top-level Questions link / "Answer a question" CTA in the desktop header, outside the Library dropdown (`Header.svelte:143-208`).
11. **Auth pages: add the value prop, kill the joke copy.** "Login/Register for a good time" meta (`login/+page.svelte:115,120`; `register/+page.svelte:138,143`). One-liner under each title quoting the real account value (take history, type lens, watchlist — all live on /account).
12. **Stories AMP page** (`stories/enneagram-and-mental-illness/+page.svelte:100-268`): purple `#6c5ce7` family live; `var(--lamp-glow)` referenced but never defined inside the AMP doc (broken styles); white text on intended amber CTA. Define V5 tokens in `amp-custom`, purge purple, dark-on-amber.

## P1 — noticeable drift / funnel gaps

13. Strategic-question capability in all MDsvex post templates (community, how-to-guides, pop-culture, mental-health) — component + API exist; wiring + frontmatter rollout (T-12 wave 2). How-to-guides currently has zero /questions references section-wide.
14. Personality-analysis index: add an outro (it ends mid-page at the Type 9 block) with a product CTA; also fix `NineChorus.svelte` styling against undefined tokens (`--night-900/950`, `--ink-50/100`, `--stone-400/500` → cool-gray fallbacks); swap to real V5 vars.
15. /questions FAQ JSON-LD (`questions/+page.svelte:55-68`): remove "account using your Enneagram personality type as your identity" — contradicts no-account answering + "no type knowledge needed". Split the signup nudge: answering is free, asking needs an account (`:471-501`).
16. Rewrite /questions/create to V5 (kicker, ink-bright headline, mechanic-forward lede, Button atom in modal — fixes white-icon-on-amber at `:554-561`).
17. Signup flow seams: `/signup` 308 → `/register` (not `/`); persistent "check your inbox" state post-registration; link the "Must register or login" toasts to /register; add a signup affordance next to header "Log in". Either wire subscription notifications (nothing consumes the `subscriptions` table today) or stop offering subscribe as a benefit.
18. De-purple /about: `.heart-center` uses `--pillar-heart` #a855f7, rose `--secondary` carries emphasis (`about/+page.svelte:354,500-508,577-579`); adopt the homepage's preview triad — and promote `--preview-anger/shame/fear` (`+page.svelte:560-566`) to global tokens in `index.scss` first (chrome audit P1-5) so both pages share one source.
19. Pop-culture SEO layer rewrite (`pop-culture/+page.svelte:98-148`): "Dark Triad, serial killers" title/description/keywords → on-page register.
20. Mental-health hub: mislabeled CTA "Find Your Type" → `/questions` (`mental-health/+page.svelte:405`); soften deterministic hero claims (`:12-14,31`); add funnel blocks to its [slug] template (currently the least-funneled template holding the #3 traffic page). Remove "Decoded the way a real psychologist would" (`enneagram-corner/+page.svelte:384`).
21. design-system.md sync pass (teal-primary table still reads as locked; styleguide "does not exist"; reduced-motion claim stale; document era-frame/composer/deeper-row/center colors + the new hero line).
22. Theme scripts: delete the duplicate in `+layout.svelte:594` (keep app.html's); fix stale theme-color hexes `#0C0A09`→`#0a0807`, `#FAFAF9`→`#faf8f4`.
23. Book-session: add one /questions bridge (signal link or success-state CTA). Intake: voice sweep "we/us"→"I/me"; reword the childhood-message prompt away from etiology register.
24. Unsubscribe: restyle `/account/unsubscribe/[slug]`, flip button emphasis (primary=stay), land on /goodbye-style copy; replace "reactivation sequence" jargon; use Button atom on /goodbye + /thanks-for-staying.
25. /blog hub: kill "One System. Many Lenses."; migrate to shared index shell or retire.
26. /users: fold into /admin/users; verify RLS blocks `updateUserAccount`'s update-by-arbitrary-email (`users/+page.server.ts:67-88`).
27. rss.xml description: locked tagline, fix "9takes-" typo (`rss.xml/+server.ts:23`).
28. Welcome email step 3 + all "Take the test" CTAs: after P0-8 ships, keep; if test page slips, reword to "find your type through the questions".

## P2 — polish & housekeeping (abridged)

- Vocabulary pass: "takes" everywhere (detail tab "Comments", search "comments/matches", SuggestionsBlog "Articles"→"reads"); "Be the first to share your thoughts"→"…your perspective".
- Ratify "nine ways to _answer_ it" (NineChorus) vs "nine ways to _see_ it"; give NineChorus kickers `--font-mono`.
- Delete dead dirs: `test-solo-leveling{,-v2,-v3,-v4}`, `poopmap`, `blog/experiment`, `design-preview` (+v5); schedule `/old-home` 308 via legacyRedirects pattern.
- OG asset sweep: greek_pantheon.png (4 auth pages), aero.png (/about, org JSON-LD) → streetlamp/cube-2026 assets; decide the logo (amber cube family sits unused in static/brand/).
- People pages: FAQPage JSON-LD emitted with no visible FAQ section (`PeopleBlogPageHead.svelte:110-115`) — render or gate.
- PopCard/`.image-card-base` scanline skin: migrate blog-sidebar consumers or quarantine to asset generators.
- Kicker numbering gap on pop-culture (04→06); emoji icons in fallbacks; mobile drawer demote Corpus Stats; title-suffix unification ("- 9takes" vs "| 9takes"); enroll /api/signups waitlist into a sequence; question og:description → give-first hook; consider /book-session link in welcome step 4 / account page; move `/links` + `/comments` under `/api/`; review public exposure of subscriptions on `/users/[externalId]`; Tailwind purple `accent` ramp deletion; `.badge-glow` resting glow; EmptyState/ErrorState adoption; Svelte 4→runes when touching flagged files.

---

## Suggested sequencing

- **Today:** P0-1 (calendar), P0-2 (mirror dead end), P0-11 (auth meta copy) — small, high-stakes.
- **Sprint 1 — "what the world sees":** P0-3/4 (share cards), P0-9 (particles), P0-7 (etiology), P0-12 (stories AMP).
- **Sprint 2 — "keep the homepage's promise":** P0-5/6 (reveal + wall), P0-8 (enneagram-test), P0-10 (chrome CTA), P1-14 (NineChorus tokens + PA outro).
- **Sprint 3 — "wire the doorways":** P1-13 (strategic questions in all templates), P1-15/17 (signup seams), remaining P1s.

Full per-surface evidence lives in the five agent reports summarized above; all file:line references were verified at audit time.
