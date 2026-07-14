# 9takes Homepage Reimagination — Agent Tasker

**Created:** July 13, 2026  
**Status:** Ready for a parallel design prototype  
**Owner:** DJ / 9takes  
**Implementation target:** `/design-preview/home-reimagined`  
**Production homepage:** Do not change until the preview is approved

---

## 1. Mission

Create a new version of the 9takes homepage that makes the product understandable, emotionally distinctive, and easy to enter.

The current homepage contains many of the right ideas, but they compete for attention. The reimagined version must tell one continuous story:

> A real question can reveal nine different ways of seeing the world. On 9takes, you answer anonymously before seeing the crowd, then unlock other people’s perspectives and begin noticing the emotional patterns behind them.

The homepage should lead with the experience of answering questions. The Enneagram should explain why the answers differ; it should not be a prerequisite for understanding or using the product.

### The one-line product description

> 9takes is a give-first, anonymous Q&A platform where one question reveals many perspectives through the lens of the nine Enneagram types.

### The emotional promise

> Say what you actually think. Then discover what someone else can see that you cannot.

### The story in five beats

1. One situation can look completely different from another point of view.
2. 9takes starts with a question, not a personality lesson.
3. You commit your own anonymous take before the crowd can shape it.
4. Other answers reveal different emotional priorities and strategies.
5. The Enneagram gives language to nine recurring perspectives organized around anger, shame, and fear.

If a section does not advance one of these beats, remove it from this homepage version.

---

## 2. Product truth and claims

Use these ideas consistently in copy and interaction design.

### What 9takes is

- A question-and-answer experience centered on honest, independent takes.
- Anonymous participation that lets the answer matter more than the identity or status of the person posting it.
- A give-first reveal: contribute your perspective before reading the room.
- A place to compare perspectives rather than manufacture consensus.
- An Enneagram-informed way to notice the emotional strategy behind an answer.

### What 9takes is not

- A personality test as the first step.
- A conventional discussion forum dominated by handles, follower counts, and fast consensus.
- A therapy product, diagnosis tool, or claim that every person fits a rigid box.
- A library of disconnected personality articles presented before the core product is clear.
- A promise of perfectly “unbiased” answers.

Anonymity and answering first can reduce status effects and social priming, but they do not make a person free of bias. Prefer language such as **“less influenced by the crowd,” “unfiltered by status,” “independent,”** or **“before you know what everyone else thinks.”**

---

## 3. Audience paths

The page must work for visitors who know the Enneagram and visitors who do not. Do not make either group feel like it arrived at the wrong product.

### Path A — “I do not know the Enneagram”

The visitor should understand:

- No type knowledge is needed.
- The easiest entry point is a real question.
- The product becomes clear by using it, not by studying a diagram.

Working message:

> New to the Enneagram? Good. You do not need a type to use 9takes. Start with a question and notice which answers feel familiar—or completely foreign.

Primary action: **Start with a question** → `/questions`

### Path B — “I know the Enneagram”

The visitor should understand:

- 9takes is where type theory becomes observable in real answers.
- The interesting part is not labeling a person; it is noticing what their answer protects, pursues, or avoids.
- They can compare the nine perspectives, then go deeper into the Enneagram material.

Working message:

> Already know your type? Look beneath the opinion. Notice the emotional strategy shaping what each person sees first.

Primary action: **See the nine perspectives** → an on-page anchor to the perspective section, followed by `/questions`

Secondary deep link: **Enter the Enneagram corner** → `/enneagram-corner`

### Important routing decision

Both paths ultimately converge on questions. The fork changes the explanation, not the core product.

Do not create unsupported query parameters, filters, or routes for this prototype. Use existing routes or page anchors only.

---

## 4. Homepage narrative and section architecture

Limit the page to **five major narrative sections** plus the existing global navigation and footer. The central image and the live question should do more work than explanatory UI.

### Section 1 — Hero: the invitation

**Job:** Establish the world of 9takes, explain the premise in one breath, and send the visitor toward a question.

Working copy:

> **One question. Nine ways to see it.**
>
> Answer anonymously before the crowd can shape your take. Then unlock the other perspectives.

Primary CTA: **Answer today’s question** → `/questions`

Small proof line:

> Anonymous answers · Give first · Reveal through response

Visual direction:

- Use one large, cinematic documentary-style image as the narrative anchor.
- The image shows exactly nine young adults gathering under a streetlamp at night.
- The group feels secretive from a distance but emotionally safe when viewed closely.
- Do not place paragraph copy over visually busy faces. Use an adjacent layout or a controlled text-safe scrim.
- The image must feel essential to the story, not like a mood-board banner.

Do not put a type selector, feature carousel, statistics, article grid, or multiple competing CTAs in the hero.

### Section 2 — Product proof: answer before you read the room

**Job:** Show how 9takes works with one real-looking question instead of a feature diagram.

Use a single question card with a strong, socially interesting prompt. It should feel like a question someone might think about alone at night, not generic engagement bait.

Example prompt options:

- “What do people misunderstand about needing space?”
- “When does protecting someone become controlling them?”
- “What truth do people usually learn too late about friendship?”

Show the sequence compactly:

1. Read the question.
2. Commit an anonymous take.
3. Unlock the other answers.

The interaction in the preview may be illustrative rather than connected to submission APIs. Never imitate a successful submission if no real write occurred. The principal CTA should route to the functioning `/questions` experience.

Working section copy:

> **Read the question before you read the room.**
>
> On 9takes, your answer comes first. Other responses stay out of sight until you contribute, so your take has a chance to be yours.

### Section 3 — Why the answers differ

**Job:** Introduce the Enneagram only after the visitor understands the product.

Working heading and explanation:

> **Why can the same question produce nine different truths?**
>
> The Enneagram is a framework for nine personality patterns. It groups them around three emotional alarm systems—anger, shame, and fear. Each type develops a different relationship with one of those emotions, influencing what it notices, protects, and assumes.

Use three restrained center cards or bands, not nine equally loud profile cards.

#### Anger / instinct — Types 8, 9, 1

Guiding question:

> What needs to be protected, controlled, corrected, or kept at peace?

#### Shame / identity — Types 2, 3, 4

Guiding question:

> What makes me valuable, lovable, successful, or real?

#### Fear / mind — Types 5, 6, 7

Guiding question:

> What will keep me capable, prepared, supported, or free?

Treat these as interpretive prompts, not clinical claims. The visitor should leave this section curious about the motive behind an answer—not convinced that every answer can be mechanically typed.

### Section 4 — The Enneagram fork

**Job:** Let the visitor choose an explanation depth without splitting the product in two.

Use two calm, side-by-side paths on desktop and a vertical sequence on mobile.

#### “I am new to this”

> You do not need to know your type. Start with a question and pay attention to which perspectives surprise you.

CTA: **Start with a question** → `/questions`

#### “I know my type”

> Stop at the opinion, then look one layer deeper: what is this answer trying to protect, prove, avoid, or understand?

CTA: **Explore the Enneagram** → `/enneagram-corner`

Do not present this as a test result fork. It is a depth-of-context fork.

### Section 5 — Final invitation

**Job:** End on curiosity and action, not a feature inventory.

Working copy:

> **What do you see that everyone else misses?**
>
> Add your take, then enter the conversation.

CTA: **Browse the questions** → `/questions`

Below this, use a quiet “Go deeper” row for existing analysis, guides, or library destinations. Keep it visually subordinate to the question CTA.

---

## 5. What to remove or demote

This concept depends as much on subtraction as addition.

Remove from the primary homepage story:

- Large feature inventories.
- A full nine-type library grid.
- Multiple statistical proof sections.
- Coaching or unrelated service promotion.
- Long Enneagram primers before a visitor sees a question.
- Repeated CTAs with different labels but the same urgency.
- Decorative flows that explain mechanics already shown by the question card.
- A lone stone face or a generic person staring at the camera as the hero story.

Preserve deep content through quiet footer or “Go deeper” links. Do not delete existing routes or SEO content as part of this prototype.

---

## 6. Creative direction

### Mood in one sentence

> A late-night, off-the-record conversation with documentary grit: secretive at first glance, vulnerable once you get close.

### Product world

- Young adults reading or answering alone at night should feel as if they have entered a hidden conversation.
- The visual world can feel masculine and streetwise without becoming aggressive, exclusionary, or emotionally closed.
- The vulnerability is the twist. The group looks guarded, but people are genuinely listening.
- There is no leader, podium, teacher, or guru. Attention can temporarily fall on one speaker while everyone remains an equal participant.
- Ancient philosophy may appear as a historical echo: people have always gathered to compare ways of seeing.

### Avoid

- Cyberpunk neon overload.
- Glossy orange-and-teal blockbuster grading.
- Pastel therapy or wellness branding.
- Gang, cult, fraternity, protest, or intimidation cues.
- Masks, weapons, threatening poses, or surveillance imagery.
- A staged corporate diversity campaign aesthetic.
- Perfectly smooth skin, hyper-sharp faces, duplicated bodies, or other obvious AI texture.
- Greek statues used as random decoration without a narrative connection.

---

## 7. Color harmony

The palette should feel like one night scene, not a collection of independent accents.

### Hierarchy

1. **Night charcoal / ink** — the dominant environment.
2. **Marble / warm white** — typography and high-contrast surfaces.
3. **Sodium amber** — the primary action and streetlamp warmth.
4. **Cool teal** — a restrained counterpoint for data, focus, or a small atmospheric edge.
5. **Center colors** — muted and restricted to the anger/shame/fear explanation.

Suggested center behavior:

- Anger: burnt amber or rust.
- Shame: muted clay or dusty rose.
- Fear: deep teal or desaturated cyan.

Use existing semantic tokens wherever possible. If prototype-only tokens are required, define them locally at the preview-page scope. Do not spread new raw color values across production stylesheets.

### Rules

- Retire harsh, isolated yellow from headings and decorative chrome.
- Amber should feel emitted by light or reserved for a meaningful action.
- Teal should not compete with the primary CTA.
- Do not use all nine type colors as general UI decoration.
- Use the type palette only when it encodes actual type data.
- Maintain WCAG AA contrast for body copy, controls, and focus states.

---

## 8. Signature image system

The homepage must work with one excellent modern image. A mirrored ancient image is an optional second beat, not a dependency for the first prototype.

### Image A — Modern gathering

Required content:

- **Exactly nine** clearly countable young adults, roughly ages 18–24.
- A natural mix of young women and men, with varied faces and backgrounds.
- Contemporary streetwear; most wear hoodies with their hoods up.
- Clean, intentional clothes—not disheveled laborers or older workers.
- They stand in a clear circle with equal spacing and unobstructed sightlines.
- One person is speaking; the other eight are looking toward and listening to that person.
- No permanent leader. The speaker is simply holding the moment.
- Empty wet parking lot or overlooked urban space at night.
- One streetlamp creates a warm pool of light.
- The city is only atmospheric context. No train or dominant skyline.

Camera and realism:

- Slightly elevated rooftop/drone perspective, approximately 35–45 degrees downward—not a distant map view.
- Medium-wide framing close enough to read posture and partial expressions.
- A very subtle 2–4 degree Dutch angle is allowed; it should create tension without looking gimmicky.
- Documentary photography, practical lighting, atmospheric haze, wet asphalt texture, mild halation, realistic high-ISO grain, and imperfect focus falloff.
- Faces need pores, asymmetry, believable age, and varied expressions.
- Hands, shoes, hoodie fabric, shadows, and body spacing must survive close inspection.
- The emotional read is attentive and guarded—not cheerful, theatrical, hostile, or therapy-session earnest.

### Image B — Ancient mirror

Only develop this after Image A is approved.

- Recreate the same camera height, lens feel, framing, nine body positions, circle spacing, speaker position, and light placement.
- Replace the parking lot with an ancient Greek setting at night.
- Replace the streetlamp with a brazier, campfire, or oil-lamp source occupying the equivalent position.
- Use nine ancient philosophers or weathered marble figures in active conversational poses.
- Preserve human gesture and listening behavior; avoid a museum lineup.
- The pair should communicate: **this conversation is new, but the human need behind it is ancient.**

If exact mirroring matters, use the approved modern image as an image-to-image composition reference rather than trying to match two independent text generations.

### Initial generation prompt — Image A

> A visceral documentary night photograph for a website hero, showing EXACTLY NINE clearly countable young adults ages 18 to 24 in a clean, equally spaced circle in an empty wet urban parking lot. A natural mix of young women and men with distinct, non-repeated faces and varied backgrounds. Most wear dark contemporary streetwear hoodies with the hoods up. One young person is speaking quietly; the other eight are looking toward that person and genuinely listening. Nobody blocks another person, every full body has its own space, and there is no leader or central authority. Camera is a slightly elevated rooftop or low-drone view looking down 35 to 45 degrees, medium-wide and close enough to read posture and partial facial expressions, with a subtle 3-degree Dutch angle. One practical sodium-vapor streetlamp creates a warm pool of amber light, while very faint cool teal city spill touches the shadows. Thin atmospheric haze, damp asphalt, small imperfect reflections, realistic hoodie fabric, natural hands, worn sneakers, skin pores, facial asymmetry, slight lens bloom, restrained halation, high-ISO 35mm film grain, modest dynamic range, gently underexposed blacks, shallow imperfect focus falloff. The mood is secretive and streetwise at first glance but emotionally safe and vulnerable on closer inspection. They are sharing things they would not say in daylight. No train, no dominant skyline, no cars, no masks, no weapons, no gang posturing, no confrontation, no text or logos, no extra people, no duplicated bodies, no plastic skin, no glossy cinematic blockbuster grade, no cyberpunk neon, no staged fashion campaign, no therapy circle, no perfect AI symmetry. Wide 16:9 composition, photorealistic, observational, caught rather than arranged.

### Image rejection checklist

Reject a candidate if any of the following is true:

- The count is not exactly nine.
- People are clustered irregularly, overlapping, or standing in front of one another.
- The group reads older than the intended audience.
- The streetwear/gritty night identity has disappeared.
- Faces, hands, shoes, or shadows show obvious synthesis defects.
- Everyone has the same face, body, pose, expression, or hoodie.
- The light appears sourceless or the wet ground behaves unrealistically.
- The image feels like a movie poster, fashion ad, game render, or generic AI illustration.
- The scene communicates danger more strongly than listening.
- The crop makes the asset unusable on desktop or mobile.

### Iteration protocol

1. Generate one candidate at a time.
2. Record the prompt and the single intended change for each iteration.
3. Check the count, circle geometry, age, faces, hands, lighting, and crop before judging style.
4. Change one major variable at a time so feedback remains useful.
5. If quality is ambiguous, show DJ the candidate and ask which specific element breaks the illusion.
6. Do not commit an image to the final asset directory until DJ approves it.

Useful feedback dimensions:

- Documentary vs. obviously AI.
- Correct age and street style.
- Circle spacing and exact count.
- Secretive vs. threatening.
- Vulnerable vs. staged.
- Useful homepage composition and crop.

---

## 9. Interaction and visual design rules

- Use one clear primary action per viewport region.
- Show the product with a question before explaining every feature.
- Do not make the visitor decode decorative UI.
- Keep card borders, soft glows, and the restrained navbar treatments that already feel native to 9takes.
- Use glow as emitted light or focus feedback, not as a universal decoration.
- Prefer thin luminous borders and soft falloff over hard yellow outlines.
- Use at most one signature hover or reveal effect per section.
- Every animated or filtered element must work without motion and respect `prefers-reduced-motion`.
- Never put low-contrast text directly over a complex photograph.
- The mobile experience must preserve the story order; do not merely collapse a desktop collage.
- Avoid excessive pills. Reserve them for actual status, filters, or metadata.

---

## 10. Implementation boundaries

### Build location

Create a parallel preview at:

```text
src/routes/design-preview/home-reimagined/+page.svelte
```

Add a page-specific loader only if necessary:

```text
src/routes/design-preview/home-reimagined/+page.server.ts
```

Prototype assets belong under:

```text
static/images/home-reimagined/
```

### Do not modify during the preview phase

- `src/routes/+page.svelte`
- `src/routes/+page.server.ts`
- Production database contents or submission behavior
- Shared brand tokens unless a change is separately justified and approved
- Existing homepage imagery in place

### Data behavior

- Round one may use a clearly local, static fixture for the example question and locked-answer state.
- Prefer existing components when they support the concept cleanly.
- Do not force-fit a component whose visual or interaction assumptions confuse the story.
- Do not invent live counts or fabricated community statistics.
- Any data fetch in the preview must fail gracefully and must not block the page indefinitely.

### Image delivery

- Use responsive image formats and explicit dimensions.
- Provide a desktop crop and a considered mobile crop if one source image cannot carry both.
- Keep the initial hero payload appropriate for a landing page.
- Write alt text that describes the human scene and purpose, not the photographic style keywords.

Suggested alt text:

> Nine young adults in hoodies stand in a circle under a streetlamp at night, listening to one person speak.

---

## 11. Execution phases

### Phase 1 — Narrative wireframe

- Build the five-section page hierarchy with working copy.
- Use image placeholders only long enough to validate layout.
- Confirm that questions remain the primary action throughout.
- Confirm that a visitor can skip the Enneagram explanation and still use the product.

### Phase 2 — Visual prototype

- Apply the night palette, type scale, spacing, borders, and restrained glow.
- Add the approved modern gathering image.
- Build the question proof and the three emotional-center explanation.
- Keep the ancient mirror image optional until the modern image passes review.

### Phase 3 — Responsive and interaction polish

- Test the story at 1440, 1024, 768, and 390 CSS pixels.
- Validate focus states, keyboard navigation, reduced motion, contrast, and image crops.
- Remove any effect that reduces comprehension or performance.
- Capture desktop and mobile screenshots for review.

### Phase 4 — Approval gate

Stop at the preview route. Ask DJ to review:

- Whether the story is finally clear.
- Whether the central image feels authentic.
- Whether the Enneagram explanation arrives at the right moment.
- Whether the page feels like 9takes instead of a generic personality site.
- Whether the preview should replace or inform the production homepage.

Do not merge the preview into the production homepage without explicit approval.

---

## 12. Acceptance criteria

The preview is ready for review when all of the following are true.

### Five-second comprehension

A new visitor can answer:

- What is 9takes? Anonymous, give-first questions and answers.
- What makes it different? You contribute before reading the crowd.
- Why “nine”? The Enneagram describes nine recurring perspectives.
- What should I do next? Answer or browse a question.

### Story

- The page follows one visible line from question → independent answer → revealed perspectives → Enneagram lens.
- Questions are the primary product in the hero, proof section, and final CTA.
- Enneagram knowledge is optional at entry.
- Anger, shame, and fear are explained in plain language without presenting the framework as a diagnosis or proven law.
- No major section functions only as a feature inventory.

### Visual identity

- The hero has one dominant story image.
- The palette feels like a coherent night environment.
- Amber is intentional rather than randomly applied.
- Teal and center colors remain subordinate and meaningful.
- The page feels secretive, streetwise, attentive, and emotionally open—not threatening or wellness-branded.

### Image quality

- Exactly nine people are clearly countable.
- The young-adult age range and hoodie/street style read immediately.
- Circle spacing, faces, hands, shadows, and materials withstand close inspection.
- The photograph looks observed rather than synthetically staged.
- Desktop and mobile crops preserve the speaker/listener relationship.

### UX and engineering

- The page has no horizontal overflow at 390 CSS pixels.
- All actions have visible keyboard focus.
- Text and controls meet WCAG AA contrast.
- Reduced-motion users lose no content or control.
- Images have dimensions, useful alt text, and responsive loading behavior.
- No production homepage or production data path was changed.
- Formatting, Svelte checks, and the relevant project validation commands pass.

---

## 13. Final handoff format

When the prototype is complete, report:

1. The preview route and files created.
2. The final page story in one paragraph.
3. Which existing components were reused.
4. Any new local tokens or assets introduced.
5. Desktop and mobile screenshots.
6. Validation commands and results.
7. Open questions that require DJ’s taste judgment.

Do not call the preview “done” if the central image still has unresolved AI artifacts. Image authenticity is a launch criterion, not optional polish.
