<!-- docs/content-analysis/blog-flow-audit-2026-05-17.md -->

# Blog Flow Audit — 2026-05-17

Audit of DJ's personality-analysis blog creation/review flow. Covers what the current flow looks like, what's working, what's missing, and a tiered plan to 10x it.

---

## Current Flow (Documented)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    9TAKES PERSONALITY-BLOG PIPELINE                  │
│                         (DJ's current manual flow)                   │
└─────────────────────────────────────────────────────────────────────┘

   [STAGE 1: CREATE]                       Same session
   ┌──────────────────────────────────────────┐
   │ /blog_content_creator_people_v2 <person> │
   │   • web research                          │
   │   • type analysis                         │
   │   • drafts markdown                       │
   │   • saves to src/blog/people/drafts/      │
   └─────────────────────┬────────────────────┘
                         │
                         ▼
   [STAGE 2: FRESH-EYES REVIEW]         NEW terminal · 0 context
   ┌──────────────────────────────────────────┐
   │ Manual copy-pasted prompt:                │
   │ "read as a normal person, comment at      │
   │  the bottom of the article…"              │
   │   • reads article                         │
   │   • appends comment block at bottom       │
   └─────────────────────┬────────────────────┘
                         │
                         ▼
   [STAGE 3: ADDRESS COMMENTS]          NEW terminal · 0 context
   ┌──────────────────────────────────────────┐
   │ Manual copy-pasted prompt:                │
   │ "assess my comments, research as needed,  │
   │  trim duplication, improve the blog"      │
   │   • edits draft in place                  │
   └─────────────────────┬────────────────────┘
                         │
                         ▼
   [STAGE 4: GRADE]                          Same / new session
   ┌──────────────────────────────────────────┐
   │ /grade_blog <person>                      │
   │   • scores 5 dimensions (1-10)            │
   │   • writes content_quality frontmatter    │
   │   • leaves reviewer comment block         │
   │   • publish gate at >= 8.5                │
   └──────────────────────────────────────────┘
                         │
                         ▼
              [Loop back if < 8.5?  — NOT EXPLICIT]
```

---

## The Big Finding (Read This First)

**You are running steps 2 and 3 as raw natural-language prompts when you have already built proper commands for them.**

- Stage 2 (your "fresh eyes" prompt) → `/blog_content_fresh_eyes_people` already exists
- Stage 3 (your "assess comments and improve" prompt) → `/blog_content_second_pass_people` already exists

And those commands are **strictly better** than your ad-hoc prompts because they encode:

- a structured comment block (`FRESH EYES REVIEW`, `SECOND PASS NOTES`) that survives across passes instead of getting clobbered
- explicit lenses (formula-fingerprint, critic pressure, current-tense anchor, ambivalences not smoothed)
- an AI-language ban (em-dashes, "this underscores," "tapestry," etc.) on the second pass so revisions don't re-introduce slop
- a "reject the bad fresh-eyes notes" rule — your manual prompt blindly addresses everything

You're paying a tax in quality and consistency by hand-writing prompts that are weaker than your own commands. **First-order 10x: stop typing the prompts. Use the commands.**

There are also **two stages you don't run at all** that are sitting on disk:

- `/cohesion-check` — structural through-line audit; catches "this section serves a different argument than the title promised"
- `/blog_content_editor_pass_people` — final de-AI polish (rhythm, em-dashes, "this shows/highlights/underscores" patterns)

These exist because past-you decided they were needed. They aren't optional taste — your `grade_blog.md` rubric explicitly penalizes the exact things those passes fix (formula fingerprint, AI tells, weak transitions).

---

## What's Good About Your Flow

1. **The 0-context fresh-eyes pass is the right instinct.** Reading with no priors is how you catch what an actual Google-landing reader sees. Don't change this principle.
2. **Single-direction artifacts.** Comments at the bottom of the file are persistent and reviewable. Better than ephemeral chat.
3. **Hard publish gate at 8.5.** Forces quality before anything goes live. Most content systems don't have this.
4. **Calibration anchors in the grader.** "Thiel = 9.5, Cavill = 7" is real calibration, not vibes.
5. **The creator command's quality bar is genuinely high.** Subtractive principle, distribution rule, formula-fingerprint prevention — that's a real editorial system, not prompt fluff.

---

## What's Missing or Weak

### 1. No loop. The flow is linear; quality work is iterative.

Today: create → review → fix → grade → done. If the grade is 8.2, what happens? Implicit "do another pass" but no triggering. A blog that scored 8.0 on the first try should automatically route to another fresh-eyes + second-pass cycle, not be left in limbo.

### 2. The fresh-eyes reader is always the same persona.

You ask "act like a normal person." But Greta Thunberg's audience, Peter Thiel's audience, and Gracie Abrams' audience are different. A reader who already knows Thiel from VC Twitter wants different things than a teen who knows Abrams from TikTok. **One generic "normal reader" misses persona-specific gaps.**

### 3. No strategic-growth dimension in the rubric.

Your stated goal: _get readers curious about themselves and others → drive them to 9takes._ The rubric scores: Hook, Enneagram, Evidence, Writing, Originality.

**None of those measure the conversion mechanism.** A blog can score 9.5 on craft and not nudge a single reader to take the test, comment on a question, or self-reflect. You are optimizing for "great essay," not "great essay that pulls the reader into the platform's give-first loop." Those overlap but aren't identical.

### 4. No "trend pull" on which person to write about.

You pick the subject; your command researches them. But the highest ROI blog is one written _the week someone is trending_. No step asks "is this person spiking in search/news/social this week?" — even though you'd published Anthony-Bourdain and Jane-Goodall recently, both evergreen rather than newsjack picks.

### 5. The flow is single-threaded per blog.

Each blog goes through one fresh-eyes + one second-pass. But your `/council` command exists. You could run multiple reviewers in parallel (skeptic, superfan, type-curious newcomer, SEO bot) and synthesize. You don't.

### 6. No measurement after publish.

Once a blog ships at 8.5+, you have no feedback loop. Did it rank? Did readers click through to `/enneagram-test` or `/questions`? Did dwell time correlate with the "signature detail" sections or skip them? Without this, your editorial improvements are blind — you're tuning the engine without a dyno.

### 7. The grader has no memory of what worked.

You have calibration anchors (Thiel, Doja, Cavill) listed in `grade_blog.md`. But nothing forces the grader to compare a new draft _against the actual text_ of the closest anchor. It anchors on remembered impression, which drifts.

### 8. Two stage names in your CLAUDE skills are nearly identical and confusing.

`blog_content_creator_people.md` vs `blog_content_creator_people_v2.md`. You use v2. The fact that v1 is still sitting there means an agent (or future-you) could grab the wrong one. Same risk on `blog_content_publish_people` vs `blog_content_publish_pop_culture`.

### 9. AI tells re-enter on the second pass.

Your second-pass command has an AI-language ban, but your **manual** second-pass prompt does not. So when you skip the command and type the prompt yourself, the model is free to re-introduce em-dashes, "this underscores," and the contrast-pair phrasing the rubric penalizes — and then the grader dings you for it. You've created a closed loop where you fix it, the model re-adds it, the grader catches it, and you don't know why.

---

## The 10x Plan

Three tiers, in order of effort-to-payoff.

### Tier 1 — Free, do today

1. **Stop typing fresh-eyes prompts. Use `/blog_content_fresh_eyes_people <person>`.**
2. **Stop typing second-pass prompts. Use `/blog_content_second_pass_people <person>`.**
3. **Insert `/cohesion-check` between second-pass and grade.** Catches structural drift that prose-level passes miss.
4. **Insert `/blog_content_editor_pass_people` before grade.** Strips AI tells your grader is about to penalize.
5. **Delete `blog_content_creator_people.md` v1** (or rename to `_archive_v1.md`) so it can't be invoked by accident.

Revised flow becomes:

```
create_v2 → fresh_eyes → second_pass → cohesion-check → editor_pass → grade
                                                                       │
                                                                       ▼
                                                          if < 8.5: loop back to
                                                          fresh_eyes with the
                                                          grader's feedback as input
```

### Tier 2 — One afternoon of work

6. **Add a 6th rubric dimension: Self-Reflection Hook (1-10).**
   Scores: does the blog include at least 2-3 moments where the reader sees themselves? E.g., "If you've ever rewritten a contract to feel safe before signing it, you are reading about your own Type 3." This is the missing growth link — and it's measurable. Update `grade_blog.md` and `blog-grading-rubric.md` together.

7. **Add a persona-rotation flag to fresh-eyes.**
   `/blog_content_fresh_eyes_people <person> --persona skeptic` or `--persona superfan` or `--persona type-curious-newbie`. Run two passes with different personas; the second-pass command already handles multiple comment blocks if you adjust the structure (`FRESH EYES REVIEW (skeptic)`, `FRESH EYES REVIEW (superfan)`).

8. **Add a "calibration anchor diff" step inside grade_blog.**
   When grading, the grader should `Read` the actual full text of the closest anchor blog and explicitly compare. "This draft's hook is weaker than Doja-Cat's because…" Stops anchor drift cold.

9. **Add a `/blog_audit_published <person>` command.**
   Runs against published blogs (not drafts), pulls Vercel/PostHog data if accessible, and asks: "did this blog produce signups / question-engagement?" Even without analytics access, the command can flag blogs whose grade was 9+ but that are clearly underperforming on the platform's internal traffic. You already have `src/lib/analytics/` infrastructure to support this.

### Tier 3 — Project-level, biggest payoff

10. **Pre-create stage: trend pull.**
    Build a `/blog_pick_next_person` command. It scans Google Trends, recent news (use `WebSearch`), Reddit r/popculturechat (you already have a `2026-05-14_pickup-brief.md`), and Quora hot questions, then returns 3 candidates ranked by _(search interest spike × type-coverage gap × 9takes audience overlap)_. Two of those signals you can compute right now — the third needs your judgment. The output is a person + a one-paragraph timing rationale. This is the real 10x — writing the right blog beats writing a perfect blog about the wrong person.

11. **Parallel reviewers with `/council`.**
    Run fresh-eyes from 4 reviewer personas in parallel via the council pattern. Synthesizer agent merges the 4 comment blocks into one prioritized FRESH EYES REVIEW. This is closer to how Stratechery or The Profile actually get reviewed — multiple smart readers, not one generic one.

12. **Tie blog ID to Q&A seed.**
    For every published personality blog, auto-draft a corresponding 9takes question that the blog naturally leads into. ("Martha Stewart turned humiliation into a billion-dollar comeback. What was the moment you turned your worst public failure into something useful?") Link blog → question with a tracked CTA. Now you can measure conversion per blog, and you have a built-in distribution flywheel: blog drives question views, question give-first gate drives signups.

---

## Are You Achieving Your Stated Goal?

You said the purpose is:

> readers reflect on themselves → get curious about 9takes → grow the platform.

**Honest answer: partially.** The blogs are well-crafted personality analyses. They satisfy the upstream half — "interesting essay about a famous person." But the downstream half — "this made me curious about my own type → I clicked something → I gave a take" — is not measured, not optimized for, and not even in your rubric.

The biggest single thing missing is the **reader-to-platform bridge**. A 9.5 blog about Jane Goodall that doesn't generate a single click to `/enneagram-test` or `/questions` is a beautiful piece of orphan content. The whole point of 9takes is the give-first Q&A. Your blogs should be **funnels into that mechanic**, not standalone essays that happen to live on the same domain.

Tier 2 item #6 (Self-Reflection Hook in the rubric) and Tier 3 item #12 (blog → Q&A seed) are the two changes that close that loop. **If you only do two things from this whole audit, do those.**

---

## Quick-Reference Action List

| #   | Action                                                          | Tier | Time     |
| --- | --------------------------------------------------------------- | ---- | -------- |
| 1   | Use `/blog_content_fresh_eyes_people` instead of manual prompt  | 1    | now      |
| 2   | Use `/blog_content_second_pass_people` instead of manual prompt | 1    | now      |
| 3   | Insert `/cohesion-check` before grade                           | 1    | now      |
| 4   | Insert `/blog_content_editor_pass_people` before grade          | 1    | now      |
| 5   | Archive `blog_content_creator_people.md` v1                     | 1    | 5 min    |
| 6   | Add Self-Reflection Hook dimension to rubric                    | 2    | 30 min   |
| 7   | Add persona-rotation flag to fresh-eyes                         | 2    | 1 hr     |
| 8   | Add calibration anchor diff to grade_blog                       | 2    | 1 hr     |
| 9   | Build `/blog_audit_published` command                           | 2    | 2 hr     |
| 10  | Build `/blog_pick_next_person` (trend pull)                     | 3    | half day |
| 11  | Parallel reviewers via `/council`                               | 3    | half day |
| 12  | Auto-seed Q&A questions from each published blog                | 3    | half day |
