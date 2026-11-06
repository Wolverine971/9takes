<!-- docs/design/image-refresh-2026-11-04/README.md -->

# Blog image refresh

The proposed direction is **weathered Greek statues acting out a recognizable human situation**. Stone texture, body language and light should carry the picture. The image should give a reader a reason to connect it to this particular article.

This review covers the 157 distinct hero images used by 159 published non-profile posts in the local Markdown corpus. One post has no `pic`; one image is shared by two posts. Eleven replacements have been generated and connected to their posts locally, including four follow-up revisions on November 5. The remaining replacements are a ranked backlog, not completed artwork. Production has not been deployed.

Open [the visual review](review.html) for before/after pairs, tier filters, article links, reasons and suggested scenes. [The inventory](inventory.json), [assessments](assessments.json) and [generation prompts](prompts.json) preserve the decisions in structured form. Contact sheets preserve the original visual audit.

## Cold Light update (2026-11-05)

DJ approved the Cold Light identity on November 5 ([`docs/brand/cold-light.md`](../../brand/cold-light.md)). Two rules now sit above everything else in this README.

**Statues only.** Every brand image is a Greek marble statue. No photos of people, places or phones. The Cold Light statue standard is:

- Dry, matte, weathered marble with blank carved eyes.
- One light from the upper left on a black background.
- Restrained expressions, like real sculpture.
- No text inside the image.
- No warm, amber or orange light anywhere in the frame.

**One shared tint, applied after.** Prompts ask for neutral grey stone. After DJ saves the file, the image is converted to greyscale and each pixel's brightness is mapped through this ramp with `sharp`, so the whole library looks lit by the same light:

| Stop | Color     | Lands on               |
| ---- | --------- | ---------------------- |
| 0    | `#01010D` | Deepest shadow (Night) |
| 0.30 | `#160A46` | Shadow                 |
| 0.62 | `#6331FB` | Midtones (Indigo)      |
| 0.88 | `#BEAAFF` | Highlights (Lavender)  |
| 1    | `#ECE6FF` | Brightest highlight    |

Don't hand-tint, recolor per type, or add a second accent color. Worked prompts that already meet this standard: [`../homepage-whispering-statues/prompts-emotions.md`](../homepage-whispering-statues/prompts-emotions.md).

**Open for DJ:** the article heroes in this refresh use scenes (courtyards, cafés, offices) and allow modern props. The Cold Light standard says black background and no phones. Until DJ decides whether article heroes keep simple settings, new brand and homepage imagery follows the black-background standard, and article heroes keep their settings but drop all warm light and take the indigo tint.

## The visual standard

- **Material:** dry, matte, physically carved marble or limestone. Irregular pores, small chips, worn edges and a little grime in recesses. Avoid identical crack patterns, uniform dirt, shiny resin and skin painted grey.
- **Light:** one believable dominant source, usually raking side light. Keep detail in the shadows and separation between the subject and background. For new work, the light comes from the upper left. No warm reflected light (retired with Cold Light, 2026-11-05).
- **Color:** charcoal, ash, chalk and muted grey stone in the prompt; the indigo tint ramp is added afterward. No warm accents. Avoid full-frame blue/pink lighting, saturated skies and decorative gold.
- **Composition:** usually one to three principal figures and one readable action. Prefer a close or medium view. Use a larger group only when the article needs relationships within that group. Leave important hands, faces and objects safe for the consuming crop.
- **Setting:** a courtyard, café, library, office, workshop or domestic space can all work. The collection should share material and light, without becoming the same dark room over and over.
- **Props:** modern objects are fine when the article needs them. A phone can be a phone. Avoid floating icons, glowing diagrams, generic chains, random masks and fantasy scenery used as substitutes for an idea.
- **Expression:** communicate through posture, distance, attention and gesture. Faces should still look carved. Avoid exaggerated grimaces and overly perfect duplicated faces.
- **Text:** put titles and explanations in the page. An intentional scene prop can be an exception: the user specifically wants the readable **EMOTIONS** chalkboard retained for the kindergarten article.

The primary material reference is `static/greek_distorted_statue_face.webp`. The two reading images establish useful scene, shadow and light references. They are retained. Their scenes are not a requirement to put a book into every replacement.

## Tiers

| Tier | Decision                  | What qualifies                                                                                                                                                                     |
| ---- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1   | Recreate                  | Major medium or color mismatch, obvious fantasy/AI ornament, or a concept that misses the article. Explicit user feedback overrides the initial triage.                            |
| T2   | Refine or reframe         | A useful scene with overly smooth material, distracting light, weak crop, excessive detail or only a loose topic connection. Preserve the useful idea; an image edit may suffice.  |
| T3   | Retain                    | Material, restraint and readable subject are close enough to the references to keep for now. This is visual triage, not full-resolution anatomy approval.                          |
| E    | Separate editorial system | Identifiable public-figure photographs/composites and the nine type dossiers. Their purpose differs from narrative statue imagery. Review their palette and typography separately. |

Priority is based on visible mismatch and relevance, not the age of the file. No traffic or analytics ranking is implied. Non-hero assets are indexed separately by traceable usage; files with no literal reference are not assumed safe to delete.

## November 5: four follow-up revisions

- **Reflection:** A woman kneels on a dry ledge; her nose, bun and shoulder clasp line up with their inverted counterparts in the pool. The second edit pulled back so her chin clears the water.
- **Freud / Plato:** The opposing profiles and spectacles remain. Both heads and shoulders stay sharp to the edge against a flat gray background.
- **Mercy:** One statue offers another a drinking bowl at a spring. The carved bowl, figures and setting belong together.
- **Empty room:** An empty stool beside an unfinished dice game replaces the TV and sofa. A flask and a set-aside writing tablet connect the other threads of the article to the same ancient household.

Keep the round-two chalkboard, medication conversation (the bottle supplies the focus), and ancient academy. Use one coherent period for a scene; keep a modern prop only when it belongs to the setting and does real work for the article. Avoid edge fades and check recognizable reflected landmarks before delivery.

[Round-three prompts and feedback](round-3.json) · [Four current images](round-3-overview.jpg). These four articles now request new filenames, bypassing cached copies after deployment. Eight Vercel redirects preserve the former hero and thumbnail links. The superseded round-two files are in `previous/round-2/`; the pre-audit originals remain in `originals/`. The other seven refreshed image families keep their existing URLs. Local asset budget passes.

## November 4: seven revisions

| Existing image                                 | Revision                                                                                                          | Tier |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---- |
| `greek-statue-offering-mercy-under-streetlamp` | Two weathered statues share a quiet moment around an offered pastry, with a lowered sign.                         | T1   |
| `medications_and_stress`                       | A patient statue discusses a concern with an attentive clinician; one closed bottle anchors the topic.            | T1   |
| `brain-vs-heart-dichotomy`                     | An intact statue studies a reflection in a stone basin, replacing the split face and circuitry.                   | T1   |
| `emotions-crash-course-kindergarten`           | Keep the EMOTIONS chalkboard, simple chalk faces and alphabet blocks; add Greek stonework and a small bust.       | T2   |
| `empty-room`                                   | Preserve the empty room and chair, simplify the screens and cables, and use worn stone and restrained dawn light. | T2   |
| `enneagram-vs-meyers-briggs`                   | Two philosopher statues compare tablets and papyrus in an ancient Greek academy.                                  | T1   |
| `freud-plato`                                  | Preserve the opposing profiles and Freud’s glasses; replace the red/cyan split with neutral stone.                | T2   |

These revisions used four new generations and three edits through the built-in image tool. [Round two notes](round-2.json) record the user’s preferences and exact prompts. The original mercy, medication and brain/heart images move from T3 to T1; the framework comparison moves from T2 to T1. The chalkboard concept is explicitly approved, overriding the earlier suggestion to remove its text.

Current tier totals are **T1: 43, T2: 46, T3: 37, E: 31**. Eight T1 and three T2 images are replaced locally; 35 T1 and 43 T2 remain queued. Tiers describe the original image’s needed treatment, while status tracks completion.

The mercy and empty-room articles use optional `image_aspect_ratio` metadata so their community hero cards show the full scene. Other community articles retain the existing portrait default.

## First four replacements

| Article              | New scene                                                                                   | Why it fits                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Team diversity       | Three statues propose, examine and listen around one shared plan.                           | The article is about different thinking styles, not a collage of different faces.                                                                    |
| Career choices       | One statue works independently on a ledger; another works through a question with a client. | The revised article compares different working conditions within the same profession.                                                                |
| Coaching toolkit     | A statue notices a crooked stack and pauses before correcting it.                           | This directly stages the Type 1 homework: notice an imperfection without fixing it. It is one example from the article, not a symbol for every type. |
| Instinctual subtypes | Personal resources, awareness of the group and close conversation coexist in one courtyard. | The scene gives each instinct a visible direction of attention. The fortress illustrated none of these clearly.                                      |

The first two rounds shipped locally under the original public filenames. The November 5 round uses versioned delivery URLs as described above. All 22 pre-audit WebPs are archived in `originals/`. Full PNG masters are kept in `source-assets/blogs/` (gitignored), outside the public deployment. Each family has a 1200px-wide hero and a 480px-wide thumbnail. Built-in image generation and editing produced the artwork; the current prompts are in `prompts.json` and round-specific briefs are preserved beside it.

## Choose the scene before writing the prompt

1. Read the opening, central claim and most concrete example in the article. The title alone is insufficient for a final brief.
2. Complete this sentence: **A statue is doing ___ because \___.** If the first blank is only “standing” or “looking thoughtful,” make the scene more specific.
3. Pick one observable moment: withholding a correction, checking for reassurance, turning away during a conversation, accepting help, re-reading the same note, or making room for another opinion.
4. Remove objects that do not explain that moment. Use spatial relationships and gesture before visual symbols.
5. Apply the common material and light direction. Vary location, figure, viewpoint and shot distance across the collection.
6. Inspect the result at full size and at the actual card crop. Reject fused hands, ambiguous gaze, unreadable props, glowing stone and scenes that need a paragraph to decipher.
7. Save a versioned master, generate both delivery sizes, and preserve the previous artwork outside `static/`. For an explicit replacement, reuse the public URL; for a new article or a separate variant, use a new filename and update its `pic`. Check the static asset budget.

## Reusable prompt structure

> Editorial photograph of a life-sized ancient Greek marble statue [specific action] in [simple setting]. The important relationship is [behavior from the article]. [One or two essential props.] Dry matte weathered stone, irregular pores, worn chisel marks and small edge chips; visibly carved eyes and hair. [Shot distance] with clear silhouettes and important gestures safe for the crop. One believable raking light from the upper left, charcoal shadows, ash and chalk highlights, neutral grey stone with no warm light. Natural photographic tonal range. No neon, glossy CGI, floating symbols, magical effects, decorative gold cracks, text or watermark.

Do not reuse the prompt mechanically. All eleven exact prompts and their output paths are in `prompts.json`. The subjects and settings are the variable part; material credibility and restraint are the constant part. For an edit, preserve the user-approved concept and constrain the change to the requested material, color or setting.

## Review scope and next pass

All 157 hero assets were visually triaged on contact sheets. The eleven changed articles were read for their actual narrative and examples; other suggested scenes are provisional briefs based on article titles and descriptions. Read those article bodies before generating their replacements. The separate asset index traces other files to published inline use, draft use or source references where possible; it is not a completed visual review of unused and draft artwork.

The strongest remaining cleanup groups are the blue drafting illustrations (`enneagram-concepts`, `greek-mind`, `greek-sculpture-on-a-laptop`, `greek-statue-introducing-9takes`), the neon relationship images, and the glowing/icon-heavy mental-health imagery. Refresh related groups together so adjacent cards feel coherent, then work through T2. Keep the deliberate photo and dossier systems on a separate track.
