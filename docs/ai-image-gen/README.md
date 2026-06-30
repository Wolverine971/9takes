<!-- docs/ai-image-gen/README.md -->

# AI Image-Gen Carousel Playbook

A working library for decoding high-performing Instagram carousels and porting their structure into 9takes assets. Each subfolder / `iklipse-*.md` file holds one analyzed source post. This README is the **folder index**.

> **The canonical engine lives in [`CAROUSEL-SPEC.md`](./CAROUSEL-SPEC.md)** — modes, beat structures, formula shapes, brand swap, format menu, worked example, build priorities, engagement log. That is the single source of truth a build command inlines. **[`WORKFLOWS.md`](./WORKFLOWS.md)** is the production-pipeline build spec.
>
> The `source-analysis.md` / `iklipse-*.md` files are the **evidence layer**. This README just indexes them.

## Sources decoded so far

| Folder                              | Post                                      | Engine type                                                    | Engagement                           |
| ----------------------------------- | ----------------------------------------- | -------------------------------------------------------------- | ------------------------------------ |
| `iklipse-weird-ai-carousel/`        | @iklipse\_ "Why Weird AI Works"           | Judgment / checklist (build to a rule)                         | 700♥ · 641💬                        |
| `iklipse-camera-angle-cheat-sheet/` | @iklipse\_ "The Camera Angle Cheat Sheet" | Lookup table (technique → emotion map)                         | 522♥ · 375💬                        |
| `vssn-ai/`                          | @vssn.ai (engine, not one post)           | Comment-CTA → auto-DM saves engine + "AI is a camera" doctrine | 44.8K followers; sample post 9,450💬 |

The two `iklipse-*` folders are @iklipse\_ (verified AI-image education) teaching two _different_ carousel **shapes** — keep them distinct. `vssn-ai/` is a different kind of source: not a deck structure but a **distribution engine** + caption skeleton (the comment-keyword → auto-DM mechanic). See its source-analysis for where each piece belongs.

**Benchmark / reference notes (not full decodes):**

- [`chloedigital-claude-carousel-pipeline.md`](./chloedigital-claude-carousel-pipeline.md) — @chloedigital.ai's idea→carousel pipeline in Claude; what we'd adopt vs. already do better.
- [`moodboards/valeria-kokur-typography-moodboard.md`](./moodboards/valeria-kokur-typography-moodboard.md) — @valeriakokur display-type / letterform mood reference for cover slides + posters (take the craft, keep the amber).

---

## The engine

The shared DNA, the named templates (Lookup / Judgment), the 9takes port, and the non-negotiable brand swap have all been consolidated into **[`CAROUSEL-SPEC.md`](./CAROUSEL-SPEC.md)** — go there for the actual spec. This README is now just the index of decoded sources + how to add more.

---

## How to add a new source

1. Create `docs/ai-image-gen/<handle-or-slug>/source-analysis.md`.
2. Follow the existing files' structure: full slide-by-slide transcription → reusable skeleton → visual/production DNA → transferable insight → notes for this playbook.
3. Update the **Sources decoded** table above. If the post reveals a new recurring beat, mode, or formula shape, fold it into the relevant section of [`CAROUSEL-SPEC.md`](./CAROUSEL-SPEC.md) — keep the spec the _intersection_; don't duplicate per-post transcriptions into it.
