<!-- docs/content-analysis/recent-people-header-audit-2026-04-06.md -->

# Recent People Header Audit

**Date:** 2026-04-06  
**Scope:** `src/blog/people/drafts/*.md` with `date`, `lastmod`, or file mtime from 2026-03-29 through 2026-04-06  
**Focus:** Generic H1s, weak SEO front matter (`meta_title`, `persona_title`, `description`), and obviously template-y subheads

## Summary

- Reviewed **96** recent people drafts.
- **8** are shell drafts with placeholder H1s and missing SEO front matter.
- **20** are full drafts with clearly generic H1s that should be rewritten before publish.
- **10** more are not terrible, but still lean too hard on `An Enneagram Type X...` phrasing and would benefit from a second title pass.
- **1** otherwise strong draft has a metadata/subhead issue worth fixing now: `Sabrina-Carpenter.md`.

The main pattern to kill is simple:

- `Name: An Enneagram Analysis`
- `Name: An Enneagram Type X Analysis`
- `Name: An Enneagram Type X Personality Analysis`
- `Name: An Enneagram Type X Deep Dive Into ...`

That phrasing explains the content category, but it does not promise a person-specific psychological insight. It reads like a template, not a headline.

## What Good Titles in This Batch Are Doing

Strong recent examples already in the repo:

- `Frida Kahlo: The Artist Who Hid Her Body and Exposed Her Soul`
- `Alex Karp: The Philosopher Who Builds Weapons`
- `John Lennon: The Wound Behind the Anthem`
- `Rachel McAdams: The Enneagram Behind Hollywood's Most Deliberate Disappearing Act`
- `Mike Majlak: Enneagram Type 7 — The Escape Artist Who Learned to Stay`

Shared traits:

- They lead with a contradiction, wound, coping strategy, or psychological engine.
- They still sound like analysis, but not like a placeholder.
- They let the `meta_title` carry the direct search phrasing while the H1 carries the differentiated hook.
- They make it obvious why this person is worth reading about specifically.

## Priority 1: Shell Drafts

These are not really SEO-optimization candidates yet. They are placeholders with missing SEO front matter and no meaningful section structure. The right move is to finish the article thesis first, then write the H1.

- `src/blog/people/drafts/Adam-Sandler.md`
  Current H1: `Adam Sandler: An Enneagram Analysis`
  Notes: Missing `meta_title`, missing `persona_title`, no H2s, only ~29 words of body copy.
- `src/blog/people/drafts/Anthony-Hopkins.md`
  Current H1: `Anthony Hopkins: An Enneagram Analysis`
  Notes: Same issue set as Adam Sandler.
- `src/blog/people/drafts/Antonio-Banderas.md`
  Current H1: `Antonio Banderas: An Enneagram Analysis`
  Notes: Same issue set as Adam Sandler.
- `src/blog/people/drafts/John-Travolta.md`
  Current H1: `John Travolta: An Enneagram Analysis`
  Notes: Same issue set as Adam Sandler.
- `src/blog/people/drafts/Nelk-Boys.md`
  Current H1: `Nelk Boys: An Enneagram Analysis`
  Notes: Missing `meta_title`, missing `persona_title`, no H2s, only ~30 words of body copy.
- `src/blog/people/drafts/Ninja.md`
  Current H1: `Ninja: An Enneagram Analysis`
  Notes: Same issue set as Adam Sandler.
- `src/blog/people/drafts/Steve-Carell.md`
  Current H1: `Steve Carell: An Enneagram Analysis`
  Notes: Same issue set as Adam Sandler.
- `src/blog/people/drafts/William-Shakespeare.md`
  Current H1: `William Shakespeare: An Enneagram Analysis`
  Notes: Same issue set as Adam Sandler.

## Priority 2: Full Drafts With Clearly Generic H1s

These are the drafts that most directly match the user's complaint. The article bodies are mostly real and often good. The H1 is simply lagging behind the rest of the piece.

- `src/blog/people/drafts/Mindy-Kaling.md`
  Current H1: `Mindy Kaling: An Enneagram Type 3 Analysis`
  Suggested H1: `Mindy Kaling: The Psychology of a Woman Who Can't Stop Producing`
  Notes: Front matter is mostly strong; the description still ends in the generic phrase `an Enneagram Type 3 analysis`.
- `src/blog/people/drafts/Ben-Affleck.md`
  Current H1: `Ben Affleck: An Enneagram Type 3 Personality Analysis`
  Suggested H1: `Ben Affleck: The Achiever Who Keeps Rebuilding the Life He Burns Down`
  Notes: Strong `meta_title`, strong `persona_title`, strong H2s. This is mostly an H1 problem.
- `src/blog/people/drafts/Camila-Cabello.md`
  Current H1: `Camila Cabello: An Enneagram Type 6 Analysis`
  Suggested H1: `Camila Cabello: The Anxiety Engine Behind Pop's Open-Door Confessions`
  Notes: The body has enough specificity to support a much sharper title.
- `src/blog/people/drafts/Hugh-Jackman.md`
  Current H1: `Hugh Jackman: An Enneagram Type 2 Analysis`
  Suggested H1: `Hugh Jackman: The Nicest Man in Hollywood and the Boy Who Still Waits Outside`
  Notes: Description also still uses the template-like `An Enneagram Type 2 analysis` language.
- `src/blog/people/drafts/James-Clear.md`
  Current H1: `James Clear: An Enneagram Type 1 Analysis of the Atomic Habits Author`
  Suggested H1: `James Clear: The Perfectionist Behind Atomic Habits`
  Notes: Search intent is already covered by `Atomic Habits`; the title does not need the full template phrasing.
- `src/blog/people/drafts/John-Mayer.md`
  Current H1: `John Mayer: An Enneagram Type 4 Analysis`
  Suggested H1: `John Mayer: The Virtuoso Who Keeps Sabotaging Intimacy`
  Notes: The current title wastes a strong article on a weak headline.
- `src/blog/people/drafts/Justin-Bieber.md`
  Current H1: `Justin Bieber: An Enneagram Type 3 Personality Analysis`
  Suggested H1: `Justin Bieber: The Child Star Who Became a Product`
  Notes: Internal sections are already much more distinctive than the H1.
- `src/blog/people/drafts/Kate-Hudson.md`
  Current H1: `Kate Hudson: An Enneagram Type 7 Analysis`
  Suggested H1: `Kate Hudson: The Sunshine Strategy Built Around an Absent Father`
  Notes: Description also ends in a template-y `An Enneagram Type 7 analysis`.
- `src/blog/people/drafts/Kendall-Jenner.md`
  Current H1: `Kendall Jenner: An Enneagram Type 6 Analysis`
  Suggested H1: `Kendall Jenner: The Cool-Girl Mask Hiding Fashion's Loudest Anxiety`
  Notes: Strong enough article to support a much more specific promise.
- `src/blog/people/drafts/Khloe-Kardashian.md`
  Current H1: `Khloé Kardashian: An Enneagram Type 2 Personality Analysis`
  Suggested H1: `Khloé Kardashian: The Caretaker Who Loves People Past the Breaking Point`
  Notes: Keep the emotional logic of the piece in the title, not the framework label.
- `src/blog/people/drafts/Kris-Jenner.md`
  Current H1: `Kris Jenner: An In-Depth Enneagram Type 3 Analysis`
  Suggested H1: `Kris Jenner: The Momager Who Turned Abandonment Into an Empire`
  Notes: `In-Depth` makes this sound even more machine-written, not more premium.
- `src/blog/people/drafts/Noam-Chomsky.md`
  Current H1: `Noam Chomsky: An Enneagram Type 1 Analysis`
  Suggested H1: `Noam Chomsky: The Moral Crusade of a Man Who Could Never Let It Go`
  Notes: Strong piece; the H1 should carry the relentlessness the article actually argues for.
- `src/blog/people/drafts/Olivia-Munn.md`
  Current H1: `Olivia Munn: An Enneagram Type 6 Personality Analysis`
  Suggested H1: `Olivia Munn: The Counterpuncher Who Runs Toward the Fire`
  Notes: The body is specific and high-conflict; the H1 is generic and low-voltage.
- `src/blog/people/drafts/Oprah-Winfrey.md`
  Current H1: `Oprah Winfrey: An Enneagram Type 2 Analysis`
  Suggested H1: `Oprah Winfrey: The Psychology Behind the World's Most Trusted Confessor`
  Notes: The current title buries a much stronger emotional and SEO angle.
- `src/blog/people/drafts/Sara-Saffari.md`
  Current H1: `Sara Saffari: An Enneagram Type 3 Personality Analysis`
  Suggested H1: `Sara Saffari: The Reinvention Machine Behind Fitness's Biggest Glow-Up`
  Notes: Good meta and persona; weak H1.
- `src/blog/people/drafts/Sky-Bri.md`
  Current H1: `Sky Bri: An Enneagram Type 2 Analysis`
  Suggested H1: `Sky Bri: The Psychology of a Woman Who Keeps Giving Herself Away`
  Notes: Strong supporting front matter already points at the real angle.
- `src/blog/people/drafts/Steve-Jobs.md`
  Current H1: `Steve Jobs: An Enneagram Type 1 Personality Analysis`
  Suggested H1: `Steve Jobs: The Perfectionist Who Built Beautiful Things and Brutalized People`
  Notes: The present title is much flatter than the actual thesis.
- `src/blog/people/drafts/Tfue.md`
  Current H1: `Tfue's Enneagram Type 7 Personality Analysis`
  Suggested H1: `Tfue: The Escape Artist Who Turned Gaming Into Another Cage`
  Notes: The current version is especially template-like because it does not even sound like a finished headline.
- `src/blog/people/drafts/Tim-Ferriss.md`
  Current H1: `Tim Ferriss: An Enneagram Type 1 Analysis`
  Suggested H1: `Tim Ferriss: The Reformer Who Tried to Optimize His Way Out of Pain`
  Notes: One of the clearer examples of a strong article hiding behind a lazy title.
- `src/blog/people/drafts/Tina-Fey.md`
  Current H1: `Tina Fey: An Enneagram Type 3 Personality Analysis`
  Suggested H1: `Tina Fey: The Strategic Introvert Behind Comedy's Most Relatable Mask`
  Notes: Good metadata already exists. The H1 just needs to catch up.

## Priority 3: Borderline Formulaic, Worth a Second Pass

These are not as bad as the queue above because they at least contain a person-specific phrase. Still, they are leaving originality on the table because the title still leans too hard on `An Enneagram Type X...`.

- `src/blog/people/drafts/Bradley-Martyn.md`
  Current H1: `Bradley Martyn: The Fortress Built on Grief — An Enneagram Type 8 Analysis`
  Suggested direction: Keep `The Fortress Built on Grief`; drop the trailing framework label.
- `src/blog/people/drafts/Dalton-Caldwell.md`
  Current H1: `Dalton Caldwell: An Enneagram Type 6 Analysis of Silicon Valley's Most Devoted Skeptic`
  Suggested direction: Lead with the skeptic/trust angle, not the type label.
- `src/blog/people/drafts/Garry-Tan.md`
  Current H1: `Garry Tan: An Enneagram Type 6 Deep Dive Into Silicon Valley's Most Combative Builder`
  Suggested direction: Lead with earnestness, combativeness, or fear-driven stewardship; drop `Deep Dive`.
- `src/blog/people/drafts/Glen-Powell.md`
  Current H1: `Glen Powell: An Enneagram Type 3 Deep Dive Into Hollywood's Shapeshifter`
  Suggested direction: Build around identity crisis and shapeshifting; the current `meta_title` is already pointing the right way.
- `src/blog/people/drafts/Kyle-Forgeard.md`
  Current H1: `Kyle Forgeard: An Enneagram Type 7 Analysis of NELK's Restless Architect`
  Suggested direction: Lead with restlessness, collapse, or empire-building; lose the template structure.
- `src/blog/people/drafts/Lana-Rhoades.md`
  Current H1: `Lana Rhoades: An Enneagram Type 3 Analysis of the Most-Watched Woman Who Wanted to Disappear`
  Suggested direction: Lead with disappearance / wanting to be unseen. That is the actual hook.
- `src/blog/people/drafts/Marc-Andreessen.md`
  Current H1: `Marc Andreessen: An Enneagram Type 5 Analysis of Tech's Most Restless Mind`
  Suggested direction: Lead with refusal to look inward or fortress-thinking, not the framework.
- `src/blog/people/drafts/Oscar-Isaac.md`
  Current H1: `Oscar Isaac: An Enneagram Type 4 Analysis of Hollywood's Restless Alchemist`
  Suggested direction: Keep the restless-alchemist idea; cut the template opener.
- `src/blog/people/drafts/Patrick-Bet-David.md`
  Current H1: `Patrick Bet-David: An Enneagram Type 3 Analysis of Media's Self-Made Strategist`
  Suggested direction: Lead with shame, empire-building, or the refugee-to-media-boss arc.
- `src/blog/people/drafts/Stephen-A-Smith.md`
  Current H1: `Stephen A. Smith: An Enneagram Type 3 Deep Dive Into Sports Media's Loudest Voice`
  Suggested direction: Lead with volume as self-protection or proving-himself energy; drop `Deep Dive`.

## Metadata / Subhead Cleanup Even Where H1 Is Fine

- `src/blog/people/drafts/Sabrina-Carpenter.md`
  H1 status: Fine. Not urgent to rewrite.
  Problems:
  - Missing `meta_title`
  - H2 set is more template-like than the article quality deserves
  - Examples: `Sabrina Carpenter's Upbringing`, `Rise to Fame`, `How Sabrina Thinks: Personality Quirks and Mental Patterns`
  Recommendation: Keep the H1, add a strong `meta_title`, and rewrite the generic H2s to match the voice and specificity of the body.

## Practical Rewrite Rules for the Next Pass

When fixing these titles, the fastest way to improve quality is:

1. Start from the article's actual thesis, not the person's Enneagram number.
2. Put the person's contradiction, fear, wound, or coping strategy in the H1.
3. Let `meta_title` handle the direct `Why X...` search phrasing.
4. If the H1 can be copied onto 40 other celebrity posts with only the name and type changed, it is not done.
5. If a description ends with `an Enneagram Type X analysis`, rewrite that too.

## Suggested Order of Operations

1. Remove the 8 shell drafts from any active SEO-fix queue until they have real body content.
2. Rewrite the 20 Priority 2 H1s first. That is the cleanest quality win.
3. Then clean the 10 Priority 3 titles by removing leftover template language.
4. Fix `Sabrina-Carpenter.md` metadata and H2s after the title queue is done.

## Not Flagged on Purpose

I did **not** flag every title containing `Enneagram` or `Type` language. A few recent titles already earn their keep because the hook is person-specific enough:

- `Adele: An Enneagram Type 4 Personality Analysis — The Voice That Bleeds`
- `Mike Majlak: Enneagram Type 7 — The Escape Artist Who Learned to Stay`
- `Matt Damon: The Enneagram Type 1 Behind Hollywood's Most Ordinary Extraordinary Man`
- `Rachel McAdams: The Enneagram Behind Hollywood's Most Deliberate Disappearing Act`

Those are still framework-aware, but they do not read like raw placeholders.
