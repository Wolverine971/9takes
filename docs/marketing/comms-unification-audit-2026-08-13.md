<!-- docs/marketing/comms-unification-audit-2026-08-13.md -->

# Comms Unification Audit — Findings & Loose Ends

**Status:** Review complete; four forks awaiting DJ ruling (§6)
**Created:** 2026-08-13
**Responds to:** [`9takes-comms-unification-overview.md`](./9takes-comms-unification-overview.md), §"Brief for the reviewing agent"
**Canonical authority:** [`docs/brand/messaging-hierarchy.md`](../brand/messaging-hierarchy.md)
**Method:** Three parallel audits — user-facing surfaces, docs + agent instructions, and product truth verified against the production database (read-only, 2026-08-13).

## Verdict in one paragraph

The unification landed everywhere it was hand-built (manifesto, homepage body, question UI, email templates, enneagram-test, about) and did not land where language is **defaulted or generated**: SEO fallbacks, JSON-LD identity, `llms.txt`, social-card templates, the admin email generator, and the agent toolchain — zero agent-facing files reference the hierarchy, while twelve route agents to the most-superseded brand doc. No competing master concept was found anywhere; the freeze held. The single biggest finding is not messaging at all: **"One question, nine perspectives" is literally true on 11% of question pages — but the missing nine takes already exist in `nine_takes` for 358 of the 364 empty questions.** One data bridge closes ~98% of the promise gap.

## 1. Product-truth audit (production data)

| Promise                               | Verdict                                                                                        | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Answer before the crowd**           | **TRUE mechanically** — but the crowd is usually empty                                         | Gate is server-side for ALL questions (`questions/[slug]/+page.server.ts:132–178`; comments never reach the DOM pre-answer; re-enforced in the sort action). Funnel: 469 `gate_shown` / 29 `contribution`; by fingerprint 233 saw the gate, 18 contributed → **~7.7% conversion** (all 29 contributions since 07-19 — the wall converts now). But only **55/413** questions have ≥1 human answer: on ~87% of questions the gate protects an empty room.                                                                                                                  |
| **One question, nine perspectives**   | **TRUE on 47/413 question pages (11.4%)**; TRUE on all 358 personality-analysis chorus widgets | `comments_ai` by question: 47 with all nine, 2 partial, 364 zero. The June `postProcess()` death is still unfixed (latest `comments_ai` row: 2026-07-25). **The twist: 358 of the 364 empty questions are chorus-backed — their nine takes exist in `nine_takes`** (all 358 subjects have exactly 9), but `/questions/[slug]` only reads `comments_ai` (`+page.server.ts:~1235`). Anyone landing on those pages from browse, search, or an invite link sees zero perspectives before _and_ after answering.                                                              |
| **The reveal is a meaningful moment** | **PARTIAL** — mechanics built, payoff hollow, loops unused                                     | Optimistic unlock + invite card ("Who would answer this differently?") + arrival banner + QR all exist. But post-reveal, AI takes render as a collapsed `<details>` labeled "Compare with nine AI perspectives · Optional · generated examples" beneath a "Community discussion" header that usually holds only the visitor's own answer. Reply-notification return loop: fully wired, **0 subscriptions ever, 0 outbox rows**. Chorus widget shows real use: 22 reader answers, 21 in the last 30 days — currently the only surface reliably delivering the L4 promise. |

**The fix path (small):** (1) bridge or backfill `nine_takes` → question pages for the 358 chorus-backed questions — the content already exists; (2) fix the `void postProcess()` execution context (queue + cron drain, or `@vercel/functions` waitUntil) so new questions stop being born empty; (3) decide whether the reveal should _lead_ with the nine perspectives instead of hiding them behind "Optional · generated examples" (§6, fork 4).

## 2. Inconsistency inventory (user-facing surfaces)

### The one systemic conflict

A pre-freeze variant family — **"Nine ways to see it" / "One situation, 9 ways to see it"** — competes with canonical L4 ("One question, nine perspectives.") across seven surfaces:

| Surface                                                       | Exact string                                                                                                                                           |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Homepage H1 `src/routes/+page.svelte:372`                     | "One question. Nine ways to see it."                                                                                                                   |
| Site-wide meta default `src/lib/components/SEOHead.svelte:37` | "One situation, 9 ways to see it. Anonymous Q&A platform exploring perspectives through personality types."                                            |
| Footer `src/lib/components/molecules/Footer.svelte:67`        | "See the emotions behind every take. One situation, nine ways to see it." (comment says "locked… brand-positioning.md" — locked to the _previous_ doc) |
| Question OG cards `QuestionSocialCardTemplate.svelte:55,70`   | "One question · Nine ways to see it"                                                                                                                   |
| NineChorus widget `NineChorus.svelte:117`                     | "ONE QUESTION · NINE WAYS TO ANSWER IT"                                                                                                                |
| About title `about/+page.svelte:11`                           | "Answer First, See 9 Perspectives"                                                                                                                     |
| Enneagram Corner `enneagram-corner/+page.svelte:164`          | "The same moment, decoded nine different ways."                                                                                                        |

Note: the homepage meta _title_ is already exactly canonical ("One Question, Nine Perspectives | 9takes") while its own H1 is the variant. One ruling resolves all seven (§6, fork 1).

### Severe (defaults and machine-facing identity)

1. **`SEOHead.svelte:36–37`** — the fallback OG/meta description for every page that doesn't override it is the obsolete umbrella + personality-first framing. Highest-leverage single copy fix in the repo.
2. **`/questions` index SEO** (`questions/+page.svelte:258–268`) — generic "Ask Questions Anonymously & Get Answers" framing, personality-first description, and internal vocab shipped in keywords ("give-first system"). Should carry L3/L4.
3. **"Give first. Then see how the room reads it."** as a public headline (`questions/+page.svelte:493`) — internal vocab; public copy should be "Answer before the crowd."
4. **Site-wide JSON-LD identity** (`+layout.svelte:635–636, 673–674`) — Organization/WebSite descriptions are Enneagram-first ("decode social dynamics… using the Enneagram"), predating the hierarchy. This is what SERPs and AI answers quote.
5. **`static/llms.txt`** (dated 07-23, missed by the unification) — same Enneagram-first opening line, no `/manifesto` entry, none of the five canonical lines. Fix `scripts/generate-llms.js` and regenerate.
6. **Admin email generator** (`api/admin/email-dashboard/generate/+server.ts:15`) — LLM prompt hardcodes the retired tagline pair; a copy factory frozen on the old hierarchy.

### Moderate

7. **The manifesto is unreachable from navigation.** No Header or Footer link; only inbound is one About-page button. The best-aligned page on the site is buried one click behind About. (`/manifesto` _is_ in the sitemap and the route is committed.)
8. **About never states its assigned line** — L2 "See the emotions behind every take" appears nowhere on the page (H1 "Built for the moment your first read is not enough" is aligned in spirit; founder story present verbatim).
9. **Personality-analysis index hero** leads with the Enneagram as protagonist ("We read public figures through the Enneagram, the framework that maps 9 emotional patterns…"); surface map assigns L2 with emotions leading.
10. **Book-session** carries no hierarchy level (voice-consistent but unanchored; L2 or L5 is the natural close).

### Already aligned — do not touch

Manifesto page (carries all five levels literally; treat as the reference implementation) · homepage body (kicker "ANSWER BEFORE THE ROOM OPENS", gate copy, meta description packing L3+L4+L2) · question-detail UI ("COMMENTS HIDDEN UNTIL YOU ANSWER", "Post answer and reveal") · email base template footer (exact L2) + welcome step 1 (states the ritual plainly, leads with human questions) · register/login · enneagram-test ("Personality is a door you open from the inside").

## 3. Concept cleanup map

| Classification                            | Docs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Canonical / aligned**                   | `messaging-hierarchy.md`, `brand/README.md` (one nit: still routes "Writing any content" → style-guide-v2), `9takes-manifesto.md`, the unification overview, Lulu playbook, founder-origin-arc, nine-person pilot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Superseded, NOT marked**                | **`brand-style-guide-v2.md`** — the single biggest drift source: no supersession banner, teaches "Personality-Maxing" and "Open Source Conflict Resolution" as _preferred terms_, and is the brand doc 12 commands route to. **`brand-positioning.md`** — half-converted: new locked-hierarchy header, but body still carries the old pillars and its own "use these terms" table. **`canva-design-handoff.md`** — live doc with "Taglines (use these exactly)" incl. the personality-max mission line. **`9takes-style-guide-for-assets.md`** — archive banner scoped to design only; messaging table reads as current. **`founder-story.md` / `founder-story-brief.md`** — the sixth founder-story version, no declared relationship to the manifesto (tidbit bank still uniquely valuable). |
| **Competing**                             | **None found.** The freeze held. Closest is `the-chorus-vision.md` ("north star… the whole company") — sanctioned as product-strategy language but predates the freeze; a one-line hierarchy pointer settles it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Internal / campaign, correctly scoped** | `the-mirror-moment.md`, `one-take-format.md`, strat-notes, cluster/distribution/guerrilla docs, BRAND-KIT (properly archived)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

Founder-story hinge line ("She was afraid of my anger. I was angry at her fear.") lives consistently in 5 places (manifesto doc + page, overview, origin arc, about page). Only `founder-story.md` (06-11 longer version) is unreconciled.

## 4. Agent-instruction drift

**Zero files in `.claude/commands/`, `.claude/agents/`, or `.claude/skills/` reference `messaging-hierarchy.md`.** Twelve commands route to the superseded `brand-style-guide-v2.md` (quora-answer, blog_content_creator_people_v2, deai, copywriting-audit, copywriting-pass, grade_blog, write_amazing_blog, instagram-reply, instagram-saves, instagram-warmup, quora-warmup, founder-interview); three also point at `brand-positioning.md`'s stale body.

Direct offenses:

- `content-repurposing-engine.md:206` — scoring rubric names "personality-maxing" as current positioning.
- `carousel.md:150,287` — instructs **type-first** captions; conflicts with "lead with the human situation." Deliberate type-pond strategy → needs a DJ ruling, not a silent rewrite (§6, fork 2).
- `.claude/agents/michelle-gifford.md:27` — describes 9takes with the retired "One situation, nine ways to see it."
- `9takes-editorial-standards/SKILL.md` — the self-declared editorial source of truth has no hierarchy reference and no lead-with-human-tension rule. **This is the single highest-leverage insertion point** (the editor agent and /deai, /copywriting-pass, /grade_blog, /cohesion-check all defer to it).
- `twitter.md` / `next-tweet.md` ecosystem — built on the "DJocrates: savage, darkly funny" persona (Dec 2025); tension with "understanding over judgment" and "don't villainize the crowd" (§6, fork 3).
- `founder-interview.md` — can regenerate `founder-story.md` with no awareness the manifesto exists; a rerun could fork the founder story again.

Cheapest cure: fix the two source docs (style-guide-v2 banner + positioning body tables) and ~15 files inherit the correction. Per DJ's standing preference, commands should also **inline** the five lines + the lead-with-human-tension rule rather than only linking (agents don't reliably follow out-links).

## 5. Loose ends the overview itself missed

1. **`llms.txt` and JSON-LD identity** — the overview audits "metadata and link previews" but not the machine-identity layer AI search engines quote (§2 items 4–5).
2. **Measurement partially exists already.** §6 of the overview says "create one view" — but `give_first_funnel_events` is live and converting (~7.7%). What's actually missing: UTM/attribution from founder content → question visits; invite-loop data (lives in PostHog, unverified); a 7-day-return metric; and the wall→contribution join to founder-video traffic. Extend, don't build anew.
3. **The reveal demotes the nine takes** ("Optional · generated examples" in a collapsed details element). The overview asks "is the transition obvious?" but not "does the reveal _lead_ with the nine perspectives?" — the L4 promise argues it should.
4. **Episode 1's destination doesn't exist yet.** The batch-shoot plan says publish Episode 1 first, but its destination is the pilot's question page — which requires recruiting and running the pilot. Either re-point Episode 1 at an existing populated conflict question or explicitly sequence pilot → Episode 1. Episode 3 routes to "the current featured question" — no featured-question mechanism exists.
5. **Pilot recruitment channel is unnamed.** The protocol is strong on consent but silent on where nine self-identified typed adults come from (implied: DJ's personal network — with 29 IG followers, that's the realistic channel; naming it makes the task startable).
6. **A human sign-off gate on the marriage story.** The overview asks whether the disclosure is "within the privacy boundary DJ intends" — the cleaner gate is his wife's explicit OK on the manifesto text and Episode 1 script before filming, since the story describes her fear.
7. **No enforcement on the manifesto's editorial mirror.** The doc↔page sync rule ("update both in the same commit") is a convention; a one-line lint (grep both files for the hinge line + five levels) would make drift visible.
8. **Ship-gate discipline.** Repo history shows the failure mode: outreach frozen at 2/12 emails, seven Instagram reply sessions produced zero posted comments. The unification added four more ready-to-film artifacts. The overview's own "film and ship before creating more founder-content infrastructure" deserves teeth: no new comms documents until Episode 1 is filmed and posted.

## 6. Forks for DJ (recommendation first; everything else proceeds without you)

1. **"Nine ways to see it": retire or bless?** Recommend **retire** — replace with "One question, nine perspectives" across all seven surfaces (homepage H1, SEOHead default, footer, OG cards, NineChorus kicker, about title, enneagram-corner). It reads as a second brand line, and the hierarchy exists to end exactly that. Veto if you consider it an approved poetic rendering of L4.
2. **Type-first Instagram captions.** The type-pond strategy deliberately opens captions with the type; the hierarchy says lead with the human tension. Recommend **exempt IG captions explicitly** (a dated note in messaging-hierarchy.md's usage rules) so the conflict is a decision, not drift.
3. **DJocrates Twitter persona.** "Savage, darkly funny" vs "understanding over judgment." Recommend **keep the persona but document the exemption + boundaries** (no dunking on individuals; the architecture, never the crowd, is the target). Veto = retire the persona.
4. **The reveal's center of gravity.** Should the post-answer reveal lead with the nine perspectives (chorus-style, as on personality pages) instead of a usually-empty "Community discussion" with AI takes collapsed as "optional examples"? Recommend **yes** — it's the product's promise, and the chorus widget already proves the pattern (22 real answers). This is a product change, so it's yours to shape.

## 7. Prioritized plan

**P0 — blocks the promise**

- Bridge/backfill `nine_takes` → the 358 chorus-backed question pages; fix `postProcess()` execution context (queue+cron preferred); backfill the ~6 organic empty questions via `pnpm regen:takes`.
- Fix the two source brand docs: supersession banner + preferred-terms purge in `brand-style-guide-v2.md`; body tables in `brand-positioning.md`. (~15 agent files inherit the fix.)

**P1 — weakens coherence**

- `SEOHead.svelte` default description → L4+L2; `/questions` SEO title/description + "Give first" headline → L3; JSON-LD Organization/WebSite descriptions; regenerate `llms.txt` with hierarchy language + `/manifesto`.
- Resolve fork 1 and sweep the seven variant surfaces in one pass.
- Add hierarchy + lead-with-human-tension rule to `9takes-editorial-standards/SKILL.md`; inline the five lines into the top content-producing commands.
- Footer + Library-dropdown link to `/manifesto`.
- Fix the admin email generator prompt.
- Re-point Episode 1's destination (or schedule the pilot first); create/designate a featured question for Episode 3.

**P2 — polish**

- About page adds L2; personality-analysis hero leads with emotions; book-session closes on L2/L5.
- Mark `canva-design-handoff.md` + `9takes-style-guide-for-assets.md` tagline blocks as superseded; declare `founder-story.md`'s relationship to the manifesto (historical + tidbit bank); update `founder-interview.md` to treat the manifesto as canon; fix `michelle-gifford.md:27`; `content-repurposing-engine.md:206`.
- One-line hierarchy pointer in `the-chorus-vision.md`; mirror-sync lint; forks 2–3 documentation.

**Explicitly not recommended:** any change to the frozen hierarchy, any new concept, any visual work. The overview's instinct is confirmed by data — the bottleneck is product proof (§1) and shipped founder content, not more language.

---

## Execution log — 2026-08-13 (same day, DJ approved all recommendations)

**P0 — DONE**

- Backfilled `nine_takes` → `comments_ai` for all 358 chorus-backed questions (3,222 rows; manifest + revert path in `docs/data/backfills/2026-08-13-chorus-comments-ai.json`); regenerated takes for the 7 organic empties via `pnpm regen:takes`. **Production is now 412/413 live questions with all nine perspectives** (the one exception is moderator-flagged q158). `scripts/generate-chorus.mjs` now writes `comments_ai` alongside `nine_takes` so future chorus questions are born complete.
- Built `/api/cron/postprocess-questions` (CRON_SECRET-guarded, registered in `vercel.json` at \*/15): drains non-chorus questions with `tagged != true` through the existing `tagQuestion` pipeline. Create path hardened: image upload now happens in-request (it was silently lost on freeze); tagging is cron-owned. Query verified against production (9 candidates). **Activates on next deploy.**
- `brand-style-guide-v2.md`: supersession banner with the five lines inline; pillars and preferred-terms table rewritten (personality-maxing / OSCR retired). `brand-positioning.md`: body pillars, values, tagline options, and Key Concepts table aligned. The ~15 command files that link these docs now inherit correct guidance.

**P1 — DONE**

- Variant family retired everywhere live: homepage H1, SEOHead default description, Footer, question social-card template (client + server-rendered OG), NineChorus kicker/aria/comment, About title, enneagram-corner descriptor, nineTakesGenerator prompt, accountDashboard comments.
- Machine identity: JSON-LD Organization + WebSite descriptions, `/questions` SEO title/description/keywords + FAQ + "Give first" headline → "Answer before the crowd", `generate-llms.js` + regenerated `llms.txt` (hierarchy language, `/manifesto` listed, preferred-description line for AI engines).
- Agent toolchain: canonical hierarchy + lead-with-human-tension rule inlined into `9takes-editorial-standards/SKILL.md`; michelle-gifford + content-repurposing-engine fixed; fork 2 (IG type-first caption exemption) documented in `messaging-hierarchy.md`; fork 3 (DJocrates boundaries) documented in `docs/twitter/voice-and-tone.md`.
- Footer now links `/manifesto`; admin email generator prompt rebuilt on the hierarchy; founder-arc Episode 1 re-pointed to the live, populated `what-are-you-afraid-to-tell-to-your-partner` question (pilot decoupled); Episode 3 destination made concrete.

**P2 — DONE**

- Messaging-supersession notes: `canva-design-handoff.md`, `9takes-style-guide-for-assets.md`; `founder-story.md` marked historical-source-material deferring to the manifesto; `founder-interview.md` made manifesto-aware; `the-chorus-vision.md` scoped as product-strategy vocabulary. About hero, personality-analysis hero (emotions-first), and book-session close (L5) aligned.

**Still open**

1. **Deploy** — the cron and all copy changes go live on the next push/deploy. DB changes (backfill) are already live.
2. **Fork 4 (reveal leads with the nine)** — approved in direction, not yet built; needs DJ's UI vision before implementation.
3. **Film Episode 1** — the ship gate. Destination is live and populated now.
4. **Pilot recruitment** — protocol ready; channel is DJ's personal network; wife's sign-off on the manifesto/Episode-1 disclosure recommended before filming.
5. Optional: mirror-sync lint (manifesto doc ↔ page), traffic-weighted blog-intro sweep.
