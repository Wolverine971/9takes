<!-- .claude/commands/founder-interview.md -->

<!-- wip -->

# Founder Interview

Interview DJ to capture his founder story, then draft `docs/brand/founder-story.md` — a canonical narrative plus a tagged tidbit bank that plugs into specific surfaces across 9takes.

---

## End state

One file, `docs/brand/founder-story.md`, containing:

1. **The narrative** (800–1200 words, DJ's voice): origin scene → the problem the Enneagram solved for him → why he built 9takes → what it refuses to become → where it's going.
2. **Tidbit bank**: 15–30 quotable fragments, each tagged with its destination(s):
   - `[blog-purpose]` — BlogPurpose component rewrite (2–3 scroll-stopping sentences)
   - `[about-page]` — public About/founder page (300–500 word cut)
   - `[outreach]` — 1–2 line credibility hooks for cold outreach intros
   - `[book-session]` — "who am I" credibility for the coaching page
   - `[bio]` — one-liner social bio variants (IG/X/Quora)
   - `[vision]` — feeds `docs/VISION.md` (origin paragraph, why-Enneagram, red lines)

Context on why this matters: the 2026-06-11 docs audit (`docs/audits/2026-06-11_documentation-audit.md`) found the brand has no founder story anywhere — only pitch-template self-intros. The full destination map and question bank live in `docs/brand/founder-story-brief.md`.

---

## Voice rules (non-negotiable)

- DJ's brand voice: tactically direct, no fluff, pattern-recognition focused (see `docs/brand/brand-style-guide-v2.md`).
- **Scenes beat abstractions.** Never accept "I realized people see things differently." Push for: when, where, who, what was said, what changed.
- Use DJ's actual phrasing wherever possible. His raw words go in the tidbit bank verbatim before any polish.
- No em-dashes in drafted copy destined for blogs. No AI-sounding patterns (it's not just X, it's Y; rule of three pile-ups; "delve").

## Interview flow

1. **Open**: tell DJ the end state (one narrative + tidbit bank, destinations above), then start. If he already pasted his story as `$ARGUMENTS` or in the conversation, skip to step 3 and mine it with follow-ups instead of starting cold.
2. **Ask in batches of 2–3 questions max**, conversational, from this bank (full version in `docs/brand/founder-story-brief.md`):
   - First Enneagram encounter — the actual scene, and what was going on in his life that made it land
   - What he was struggling with that the Enneagram explained when nothing else had
   - His type, how he found it, what was hardest to accept about it
   - Career/skills path before 9takes; how professional pattern-recognition connects to reading people
   - A specific person he completely re-understood through the Enneagram (tell that story)
   - The moment he decided to BUILD instead of just consume; what was missing
   - Where the give-first conviction came from
   - Why famous-people analyses; what happened the first time he wrote one
   - Honest take on Enneagram validity; answer to "astrology for tech bros"; where it breaks down
   - What 9takes refuses to become (red lines)
   - 5-year win condition; what evidence would make him quit
3. **Follow up relentlessly but efficiently.** For every abstract answer, ask for the scene. For every scene, grab dates, names (or roles), and one sensory/concrete detail. For strong phrases DJ uses, note them verbatim for the tidbit bank. 1–2 follow-ups per topic, then move on — total interview should fit in 30–45 minutes.
4. **Tidbit-mining round** (near the end): surprising facts, contrarian opinions he'll defend publicly, failures he's willing to publish, phrases he actually says.
5. **Draft** `docs/brand/founder-story.md`:
   - Frontmatter-style header: date, status `draft-for-DJ-edit`, sources `interview 2026-MM-DD`
   - The narrative (his voice, scenes intact)
   - Tidbit bank: each entry = the fragment + destination tag(s)
   - A "gaps" section listing anything the interview didn't reach
6. **Hand off**: show DJ the draft location, the 3 strongest tidbits, and the recommended first deployment (usually the BlogPurpose rewrite, since the CTA audit flagged it as non-converting). Do NOT auto-update any components or public pages — DJ edits and approves the story first.

## Rules

- Never invent biography. If DJ didn't say it, it doesn't go in.
- If an answer touches something sensitive (family, health, named individuals), ask whether it's publishable, internal-only, or off-record — tag tidbits `[internal-only]` accordingly.
- One session is fine; if DJ runs out of time, write what exists with the gaps section and tell him to rerun `/founder-interview` to continue (read the existing draft first and only fill gaps).

---

_Created: 2026-06-11_
