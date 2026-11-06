<!-- docs/brand/cold-light.md -->

# Cold Light: the 9takes visual identity

**Status:** Canonical. Approved by DJ on 2026-11-05.
**Replaces:** Streetlamp Symposium (sodium amber, warm stone, Inter, light + dark), locked 2026-05-04.
**Message:** The words live in [`messaging-hierarchy.md`](./messaging-hierarchy.md). This doc covers how 9takes looks. If the two ever disagree on wording, the hierarchy wins.
**Implementation:** Tokens, components and lint rules live in [`../design-system.md`](../design-system.md). If this doc and the code disagree, this doc is the spec and the code is the bug.

---

## The story: hidden until you answer

Most of the internet lets you watch. You scroll, read the top comment and move on without saying anything.

9takes doesn't let you watch. Every question stays in the dark until you answer it, so you don't know what anyone else said. That's the pull: what are other people thinking, feeling, doing about this?

Be honest first. Then the other takes come into the light, and you get curious about why people see it so differently. That's where clarity comes from.

The feed is built for passive scrolling. 9takes works more like a late-night conversation in a circle: you're in it or you're not. Most people arrive on their phone in the middle of a scroll, so **every screen's first job is to stop the scroll and ask them in.**

| The feed                             | 9takes                             |
| ------------------------------------ | ---------------------------------- |
| Read without saying anything         | Answer before you read             |
| See the winning take first           | Every take stays hidden until then |
| Your opinion forms after the crowd's | Your take is yours, uninfluenced   |
| Scroll on                            | Then the reveal                    |

### Four design principles

1. **Show that something's there.** Counts, types and blurred rows make the hidden part feel real. Never show what a take says before someone answers.
2. **Dark is the unknown.** The page stays mostly dark because most of what's on it is still hidden from you.
3. **Light is the reveal.** When takes open, they come up in lavender and white. Brightness means "now you can see it."
4. **Mint is the key.** The one thing that turns the lights on: give your take.

---

## The formula on screen

**Honesty + Curiosity = Clarity** is the sixth locked messaging line (DJ, 2026-11-05). Every question runs these three steps in order, and each one has a visual job.

| Step          | What happens                                                                   | Visual job                                      |
| ------------- | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| **Honesty**   | You answer first, with no crowd to read and no one to perform for.             | The question sits in the dark. One mint button. |
| **Curiosity** | The other takes open, labeled by type. Same question, nine ways of reading it. | Takes come up in lavender and white.            |
| **Clarity**   | You see the fear, shame or anger under each take, including your own.          | The quiet italic line under the loud take.      |

### Where each locked line shows up

Read the exact wording in [`messaging-hierarchy.md`](./messaging-hierarchy.md). Cold Light is a look, not a slogan; this is where each level lives in it.

| Level               | Where it shows up in Cold Light                         |
| ------------------- | ------------------------------------------------------- |
| Movement belief     | The feed: the passive scroll where one take wins.       |
| Brand promise       | Indigo and the statues: the feeling under the surface.  |
| Product ritual      | Honesty, and the mint button that unlocks the reveal.   |
| Product explanation | Curiosity, and the nine masks in the logo.              |
| Personal payoff     | Clarity, and the quiet italic line under the loud take. |
| Core formula        | The three steps in order, used as an opening headline.  |

---

## Color

Mostly dark, a little light. People use the plain names. Code uses the role names, which describe the job (`--action`, `--surface`), so they still make sense if the story changes again.

### Brand colors

| Plain name   | Hex       | Token              | Meaning                  | Use                                                                                           |
| ------------ | --------- | ------------------ | ------------------------ | --------------------------------------------------------------------------------------------- |
| **Night**    | `#01010D` | `--bg`             | The unknown              | Every background. Almost black with a trace of blue. Never pure `#000`.                       |
| **Indigo**   | `#6331FB` | `--accent`         | What's under the surface | The tint on every statue, glows, fills, selected states. Never text, never focus.             |
| Indigo deep  | `#24127A` | `--accent-deep`    |                          | Deep fills and pressed states.                                                                |
| **Lavender** | `#CFC2FF` | `--highlight`      | What's revealed          | Highlights on the stone, italic inner-voice lines, links (always underlined), focus outlines. |
| **Mint**     | `#88F9C0` | `--action`         | The key                  | Give your take, and the moment your take is in. Nothing decorative is ever mint.              |
| Dark on mint | `#01010D` | `--text-on-action` |                          | Label color on mint buttons.                                                                  |

### Surfaces, text and rules

| Token              | Value                      | Use                                   |
| ------------------ | -------------------------- | ------------------------------------- |
| `--bg`             | `#01010D`                  | Page background                       |
| `--surface`        | `#0C0B22`                  | Cards and panels                      |
| `--surface-raised` | `#131133`                  | Text boxes, hover, raised rows        |
| `--text`           | `#F4F2FF`                  | Headlines and anything that must read |
| `--text-muted`     | `#BDB8DA`                  | Body text                             |
| `--text-faint`     | `#8D88AE`                  | Counts, dates, labels                 |
| `--rule`           | `rgba(207, 194, 255, .14)` | Hairline borders and dividers         |

### Contrast

| Color          | On `--bg` | On `--surface` | On `--surface-raised` | Use for                                                 |
| -------------- | --------- | -------------- | --------------------- | ------------------------------------------------------- |
| Text           | 18.8      | 17.5           | 16.4                  | Anything                                                |
| Lavender       | 12.7      | 11.8           | 11.1                  | Italic lines, links (always underlined), focus outlines |
| Muted          | 10.9      | 10.2           | 9.6                   | Body text                                               |
| Faint          | 6.2       | 5.8            | 5.4                   | Counts, dates, labels                                   |
| Indigo         | 3.3       | 3.1            | 2.9                   | **Never text or focus outlines.** Fills and glows only. |
| Dark on mint   | 16.2      |                |                       | Primary button label                                    |
| Text on indigo | 5.7       |                |                       | Tags and selected states                                |

### Ration the mint

Mint pulls the eye. Aim for **one mint element in view at a time**, meaning what fits on the screen at once. A long post can have more as you scroll if each one earns its place. If two mint things compete in the same view, one of them shouldn't be mint.

---

## Type

The loud take, and the quiet feeling underneath. Two display faces carry the brand promise on every page: the take is loud, and the emotion under it is quiet. A third face handles everything people read and type. Confirmed by DJ on 2026-11-05, replacing Inter.

| Face                        | Token          | Role                                               | Rules                                                                             |
| --------------------------- | -------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Anton**                   | `--font-shout` | The take. What gets said out loud.                 | Uppercase only. Headlines and section titles. 40px and up. Never a full sentence. |
| **Playfair Display italic** | `--font-voice` | The feeling. What's underneath.                    | Second line of a headline, inner-voice lines, emotion questions. Lavender.        |
| **Archivo**                 | `--font-talk`  | The conversation. Everything people read and type. | Takes, buttons, body, forms, labels. 16 to 20px body. Regular to semibold.        |

- Pair the loud line with the quiet one in big headlines: `ANSWER BEFORE THE CROWD` in Anton, then _What will they think of me?_ in Playfair italic.
- Headings under 40px use Archivo semibold, not Anton.
- Small uppercase labels (counts, kickers, metadata) use Archivo with letter-spacing. There is no mono face in Cold Light; a fourth typeface is off the table.
- All three fonts are self-hosted on 9takes so headlines don't jump while loading on phones.

---

## Imagery

**Statues only, one shared tint.** Greek marble statues carry the emotion. Each one is made in plain grey stone, then given the same indigo tint, so the whole library looks like it was lit by the same light.

### The statue standard

- Dry, matte, weathered marble with blank carved eyes.
- One light from the upper left on a black background.
- Restrained expressions, like real sculpture.
- No text inside the image.
- No photos of people, places or phones.
- DJ makes them in ChatGPT on his own subscription. **Agents never generate images.** Agents write the finished prompt and hand it to DJ.

Prompt craft, the material standard and worked examples live in [`../design/image-refresh-2026-11-04/README.md`](../design/image-refresh-2026-11-04/README.md) and [`../design/homepage-whispering-statues/prompts-emotions.md`](../design/homepage-whispering-statues/prompts-emotions.md). Prompts ask for **neutral grey stone**. The color comes later.

### The tint ramp

Applied after generation with `sharp`: convert the image to greyscale, then map each pixel's brightness through this ramp. Shadows go to Night, midtones to Indigo, highlights to Lavender.

| Stop | Color     | Lands on               |
| ---- | --------- | ---------------------- |
| 0    | `#01010D` | Deepest shadow (Night) |
| 0.30 | `#160A46` | Shadow                 |
| 0.62 | `#6331FB` | Midtones (Indigo)      |
| 0.88 | `#BEAAFF` | Highlights (Lavender)  |
| 1    | `#ECE6FF` | Brightest highlight    |

Every statue on the site, in emails and on social uses the same ramp. Don't hand-tint, recolor per type, or add a second accent color to an image.

---

## Logo

The nine-mask mark, recolored with the statue tint (option A, chosen by DJ on 2026-11-05). It's a recolor of the existing mark, not a redraw. The masks already fit the idea: nine faces hiding what's underneath.

- Master file: [`docs/design/homepage-whispering-statues/logo-nine-mask-statue-tint.png`](../design/homepage-whispering-statues/logo-nine-mask-statue-tint.png)
- The amber-lined, warm-cream version is retired.
- Option B (pale stone masks, indigo lines) was considered and not chosen. It pops more at icon size but is less tied to the statues.

---

## Corners

Keep the existing lint-enforced radius scale: **4px** (badges, dots), **10px** (buttons, inputs, chips), **16px** (cards, modals, banners), plus `full` for avatars and pills. `pnpm lint:radius` enforces it.

---

## Rules

### Always

- **Dark only.** No light mode, no theme toggle.
- **Show that takes exist** before someone answers: counts, types, blurred rows.
- **About one mint element per view.**
- **Underline links,** and use lavender for focus outlines.
- **Pair the loud line with the quiet one** in big headlines.
- **Use the existing corner sizes:** 4, 10 and 16px.
- **Host the fonts on 9takes.**

### Never

- **Show what a take says before someone answers,** in previews, share cards or emails.
- **Amber, orange or warm light,** including old social templates.
- **Indigo as text or focus outlines.** It's too dark.
- **Pure black backgrounds.**
- **A fourth typeface,** or Anton in a full sentence.
- **Hacker clichés:** code rain, glitch text, skulls. The mystery is about people, not the dark web.
- **Cruelty.** Honest, never mean.

---

## Decided (2026-11-05)

- **Dark only.** Light mode and the theme toggle get removed.
- **Statues only,** all with the same tint.
- **Logo: recolor A,** the nine masks in the statue tint.
- **"Honesty + Curiosity = Clarity" is the sixth locked messaging line.** Added to the messaging hierarchy.
- **Fonts:** Anton, Playfair Display italic and Archivo replace Inter, hosted on 9takes.
- **Never leak takes** before someone answers. Rule only for now; the audit happens during the screen-by-screen work.
- **Mint:** about one in view at a time, more down a long page if each one earns it.

---

## Changed from Streetlamp Symposium

| Area       | Streetlamp Symposium (retired 2026-11-05)                    | Cold Light                                                                              |
| ---------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Story      | Late-night philosophers lit by one sodium streetlamp         | Hidden until you answer. Dark is the unknown, light is the reveal.                      |
| Background | Warm stone `#0a0807`, brown undertone                        | Night `#01010D`, a trace of blue                                                        |
| Accent     | Sodium amber `#F59E0B` for CTAs, links, kickers, glows       | Split by job: mint for action, lavender for links and focus, indigo for fills and glows |
| Themes     | Dark + light, with a toggle                                  | Dark only                                                                               |
| Type       | Inter + JetBrains Mono                                       | Anton + Playfair Display italic + Archivo                                               |
| Labels     | JetBrains Mono uppercase kickers                             | Archivo uppercase with letter-spacing                                                   |
| Images     | Statues with warm light, philosopher scenes, assorted photos | Grey statues on black, one indigo tint ramp                                             |
| Logo       | Nine masks, amber lines, warm cream                          | Same nine masks in the statue tint                                                      |
| Corners    | 4 / 10 / 16px                                                | Unchanged                                                                               |

### Old role to new role

For anyone migrating a screen or an asset. Match by job, not by hue.

| Streetlamp token                      | Job                  | Cold Light token                                             |
| ------------------------------------- | -------------------- | ------------------------------------------------------------ |
| `--night-deep`                        | Page background      | `--bg`                                                       |
| `--night-mid`, `--stone-warm`         | Cards and panels     | `--surface`                                                  |
| `--stone-mid`                         | Hover, raised rows   | `--surface-raised`                                           |
| `--stone-edge`                        | Hairline borders     | `--rule`                                                     |
| `--ink-bright`                        | Primary text         | `--text`                                                     |
| `--ink-mid`                           | Secondary text       | `--text-muted`                                               |
| `--ink-dim`                           | Captions, labels     | `--text-faint`                                               |
| `--lamp-glow` on a CTA                | Give your take       | `--action` + `--text-on-action`                              |
| `--lamp-glow` on a link or focus ring | Links, focus         | `--highlight`                                                |
| `--lamp-glow` as a glow or kicker     | Decoration, emphasis | `--accent` (fills, glows) or `--text-faint` (labels)         |
| `--data-teal`                         | Data annotations     | No direct replacement. Decide per screen during the rollout. |
