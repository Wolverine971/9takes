<!-- docs/ai-image-gen/chloedigital-claude-carousel-pipeline.md -->

# Chloé (chloédigital) — Claude-Driven Idea→Carousel Pipeline (Benchmark Note)

> **What this is:** a benchmark note, not a new source decode. Our carousel engine lives in [`CAROUSEL-SPEC.md`](./CAROUSEL-SPEC.md) and was reverse-engineered from finished posts (@iklipse\_). Chloé works the _other_ direction — she's an operator publishing a **prompt pipeline** for getting from one raw idea to a postable carousel inside Claude, fast. This note captures that pipeline and asks: does it sharpen ours?
>
> **Low-confidence flag:** Chloé's site (chloedigital.ai / .com) renders as a JS shell and her full pipeline lives behind her Substack ("The Shift") + IG. Specifics below are reconstructed from her public framing plus the widely-shared Claude-carousel workflow she teaches against. Treat exact wording as paraphrase, not quotation.

## Who she is (1 line)

Founder of chloédigital (creator/brand content-strategy agency, ~decade old), now teaching **"Claude is your copilot"** for ambitious operators, and building a SaaS (Coreli) on Claude. We mine **only** her idea→carousel pipeline + her "make Claude know your business" setup; her broad AI-productivity content is off-axis and skipped.

## The pipeline — one idea → postable carousel

The whole move is: **never let Claude write slides cold.** Outline first, approve the skeleton, _then_ generate. Roughly five beats:

1. **Feed one source.** A single idea, a blog post, or — her efficiency trick — a **10-minute talk you recorded on something you know well**, transcript uploaded. One recording is then spun into _several_ carousels, each on one sub-point, plus matching captions.
2. **Outline before writing.** Ask Claude to lay out the deck as a skeleton: **Slide 1 = hook, Slides 2–8 = the argument/steps, final slide = CTA.** You review the skeleton and fix the order before any prose is written.
3. **Hook slide as a menu.** Ask for **~10 hook options** for Slide 1 — concrete, curiosity-driven, no clickbait, no emojis. Mix formats: a bold claim, a number, a mistake-to-avoid, a question. Pick one.
4. **Body slides, one idea each.** Cut every slide to a single idea; on-slide headline under ~10 words. Claude writes each slide in full only after the skeleton is locked.
5. **Caption that extends the hook + a comment-CTA.** Caption expands the hook and ends in a clear instruction — classically **"comment [keyword] and I'll send it to you."**

## The "configure Claude so it knows your business" setup (high level)

Her copilot framing rests on **Claude Projects** so every chat isn't a blank slate:

- **A persistent workspace (Project)** with **custom/project instructions** Claude reads at the start of every conversation — brand voice, audience, offers, formatting rules.
- **Uploaded reference docs once** (style guide, past top posts, positioning) that live in the Project's "filing cabinet."
- Net effect: the carousel pipeline above runs _inside_ a business-aware Project, so hooks/captions come out on-brand without re-briefing each time.

This maps almost exactly to how 9takes already inlines load-bearing context into `.claude/commands/` — same instinct (persistent context > re-prompting), different surface (her: Claude Projects; us: slash-command files + `CAROUSEL-SPEC.md`).

## What we'd adopt vs. what we already do better

**Adopt / steal:**

- **The hook-menu step (10 options, pick one).** Our spec names hook _shapes_; Chloé's "generate 10, mix formats, choose" is a sharper production move. Cheap to fold into `WORKFLOWS.md` as an explicit step.
- **One transcript → many carousels.** A genuine throughput unlock for us — a single DJ voice-note or blog could seed a week of decks, each on one sub-point. Off-axis to our _decoding_ work but on-axis to production volume.
- **Approve-the-skeleton gate before prose.** We do this informally; making it an explicit checkpoint (outline → human OK → write) reduces wasted full-deck generations.

**Already do better / don't regress:**

- **Structural rigor.** Her shape is the generic "hook → 2–8 build → CTA." Ours is named, decoded engines — **Lookup** (technique→emotion map) and **Judgment** (thesis → mechanism → rules → formula → checklist → payoff → comment-CTA) — derived from posts that actually hit (700♥/641💬). Keep our beat structures; they're more opinionated than hers.
- **Visual/art-direction layer.** Her pipeline is **copy-only**; it stops at slide text + caption. Our system carries the full image layer (moodboards, `/midjourney-prompt`, era-tuned shot lists, the single bright-peak slide). That's our moat — don't let a copy-first pipeline flatten it.
- **Brand non-negotiables.** Her decks inherit a generic Project voice. Ours enforce the amber Streetlamp swap, dark-text-on-amber, comment-CTA discipline (`CAROUSEL-SPEC.md`). Any adopted step must pass through that brand swap, not around it.

**Net:** Chloé sharpens our **front of funnel** (idea intake + hook generation + throughput); we keep our **back of funnel** (decoded structure + art direction + brand). Bolt her hook-menu and transcript-fan-out onto our existing engine; change nothing structural.

---

**Go deeper:** engine → [`CAROUSEL-SPEC.md`](./CAROUSEL-SPEC.md) · production pipeline → [`WORKFLOWS.md`](./WORKFLOWS.md) · folder index → [`README.md`](./README.md)
