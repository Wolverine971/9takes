<!-- src/blog/enneagram/neurodiversity-vs-personality.review.md -->

# Review Notes: Neurodiversity vs Personality

Extracted from `src/blog/enneagram/neurodiversity-vs-personality.md` page source on 2026-07-15.

---

## RESOLUTION LOG (2026-07-15)

The 2026-04-01 review below is **closed**. Do not re-apply it wholesale; much of it
had already shipped by the time it was re-read. Status of each item:

| #   | Item                        | Status                                                                                                                                                           |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hard statistics             | Already shipped (LifeStance 50% Gen Z + 52% TikTok misinformation)                                                                                               |
| 2   | Engage spectrum model       | Already shipped as its own section; 2026-07-15 pass also reconciled Section 1, which still asserted a hard binary the spectrum section contradicted              |
| 3   | Psyche competitor           | Already shipped (cited + rebutted on the motivation axis)                                                                                                        |
| 4   | Internal cross-links        | Partially applied. Added anxiety guide + shadow work to Related Reading. **Did NOT** add parenting-styles: link count is already 15 and the lint warns above 5   |
| 5   | Name the "missing middle"   | Applied in the "No One Is Normal" section. **Note:** a dedicated `the-missing-middle.md` post exists but is `published: false`, so it is deliberately NOT linked |
| 6   | Type 7 / ADHD example       | Already shipped                                                                                                                                                  |
| 7   | Acknowledge trend positives | Applied, opens "When Everyone's Neurodivergent"                                                                                                                  |
| 8   | Comparison table            | Applied in "Both Can Be True" (responsive, `overflow-x-auto`, dark-mode aware)                                                                                   |
| 9   | SEO / extra FAQ             | Already shipped (the ADHD-vs-personality FAQ is present)                                                                                                         |
| 10  | Minor polish                | Applied via the research-paragraph rewrite                                                                                                                       |

### Defects the review MISSED (found 2026-07-15 by verifying sources)

1. **Wrong citation, live on a published page.** The Enneagram research link pointed at
   `10.1002/jclp.23112`, which is "An explanatory sequential investigation of the working
   alliance as a change process in videoconferencing psychotherapy" — nothing to do with the
   Enneagram. Correct DOI for Hook et al. 2021 is **`10.1002/jclp.23097`**. Fixed.
   (Same hijacked-DOI pattern as `enneagram-science-mental-health`. Worth auditing the section.)
2. **One-sided research claim.** The article cherry-picked the Big Five finding from Hook et al.
   The review's actual headline verdict is _mixed evidence of reliability and validity_: factor
   analyses typically find fewer than nine factors, and wings/type-movement lack support. Now stated honestly.
3. **Ego-development claim conflated and overclaimed.** It read as if it came from the Hook review.
   It actually traces to Daniels et al. 2018, _Journal of Adult Development_ — n=122, self-selected,
   82% women, no randomized control, only one subgroup significant. Now cited separately and hedged.
4. **"Only personality system that..."** overclaim in the JSON-LD FAQ. Removed.
5. Internal review note was rendering into public view-source (lint FAIL). Removed from the `.md`;
   this file is now the only home for it.
6. 33 prose em-dashes (hard rule: zero) and 2 negative-parallelism engines. Both now at zero.

### ERROR IN THE REVIEW ITSELF — do not trust item #1's third bullet

Item #1 claims "Only 3% of videos by licensed professionals contained misinformation vs. 55% by
non-professionals." **This is a misreading.** Yeung et al. 2022 found healthcare providers
uploaded **27.3% misleading** videos (that's 3 _out of 11_ videos, not 3%); non-healthcare
providers were 55.1%. The 52% overall figure the article uses is correct. Never publish the 3%.

---

## Next-Level Review (2026-04-01)

STATUS: Article was significantly improved in the last pass. The "both/and" framing,
softer tone, consolidated sections, and concrete CTAs all landed well. Below is what
would push this from a B to an A.

═══════════════════════════════════════════════════════════════════

1. ADD HARD STATISTICS — THIS IS THE SINGLE BIGGEST UPGRADE
   ═══════════════════════════════════════════════════════════════════

The opening makes claims about the self-diagnosis trend but cites zero data. Three
numbers would transform it from opinion to authority:

- LifeStance Health / Researchscape survey (April 2025, 1,110 U.S. adults):
  "29% of Americans have self-diagnosed mental health conditions based on
  social media content. Among Gen Z, that number is 50%."
  Source: https://lifestance.com/insight/social-media-mental-health-impact-statistics-2025/

- Yeung et al. (2022), Canadian Journal of Psychiatry:
  "52% of ADHD-related TikTok videos contain misinformation. Only 3% of
  videos by licensed professionals contained misinformation vs. 55% by
  non-professionals."
  Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC9659797/

- March 2026 cross-platform study (Euronews/Health):
  "TikTok leads all social platforms in mental health misinformation, with
  conditions involving personal storytelling (like ADHD) especially prone
  to distortion."
  Source: https://www.euronews.com/health/2026/03/20/tiktok-leads-social-media-platforms-in-mental-health-misinformation-study-finds

WHERE TO ADD: The opening paragraph and the "When Everyone's Neurodivergent" section
are the natural homes. Even one stat in the opening ("A 2025 survey found 50% of Gen Z
have self-diagnosed a mental health condition based on social media content") would
immediately change the credibility of the whole piece.

═══════════════════════════════════════════════════════════════════ 2. ENGAGE WITH THE SPECTRUM MODEL — THE SCIENCE ISN'T BINARY
═══════════════════════════════════════════════════════════════════

The article improved by dropping "it's binary," but it still implicitly frames
neurodivergence as a hard line (you have a clinical condition or you don't). The
actual science is dimensional:

- Warrier et al. (2021, Studies in History and Philosophy of Science) showed
  "genetic, phenotypic and endophenotypic continua in autism and ADHD" —
  meaning the traits underlying these conditions are distributed continuously
  across the entire population.

- A 2024 transdiagnostic framework in World Psychiatry views neurodevelopmental
  conditions as "points on a spectrum rather than distinct categories."

- The concept of "Neurodiversity 2.0" (2025 paper) calls for moving beyond
  binary neurotypical/neurodivergent framing entirely.

THIS IS ACTUALLY AN OPPORTUNITY, NOT A THREAT. If traits are on a continuum, then
the line between "neurodivergent trait" and "personality pattern" is genuinely blurry
— which is EXACTLY why people confuse the two. And that confusion is EXACTLY why you
need a framework like the Enneagram that captures the motivational layer the spectrum
model ignores.

Suggested framing for the article:
"Researchers increasingly describe neurodivergent traits as a continuum, not a binary
switch. That's important science. But here's what the continuum model doesn't tell
you: WHY you respond to those traits the way you do. Two people at the same point on
the ADHD spectrum can have completely different emotional strategies, relationship
patterns, and coping mechanisms. That's where the Enneagram picks up where the
spectrum leaves off."

This would go in or after the "Both Can Be True" section.

═══════════════════════════════════════════════════════════════════ 3. ADDRESS THE TOP COMPETITOR HEAD-ON
═══════════════════════════════════════════════════════════════════

The #1 competing article is from Psyche.co (Aeon Media):
"Why we should think of neurodiversity like we do personality"
https://psyche.co/ideas/why-we-should-think-of-neurodiversity-like-we-do-personality

It argues for "cognitive continuity" — that neurodivergent traits exist on the
same continuum as personality traits. This is the OPPOSITE angle from your article.

Rather than ignoring it, engaging with it would strengthen your position:
"Some researchers argue we should think of neurodiversity and personality as the
same continuum. There's merit to that — traits do shade into each other. But that
framework only describes WHAT people do. It doesn't explain WHY a person with
strong ADHD traits becomes a chronic people-pleaser while another becomes a
relentless perfectionist. The Enneagram captures the motivational layer that
continuum models miss entirely."

This positions your article as the next step in the conversation, not an
alternative to it.

═══════════════════════════════════════════════════════════════════ 4. ADD MORE INTERNAL CROSS-LINKS — CONTENT ECOSYSTEM
═══════════════════════════════════════════════════════════════════

The article currently links to 5 internal pages. There are strong opportunities
to add 3-4 more that would boost both SEO and reader depth:

a) /enneagram-corner/anxiety-and-enneagram-types-guide
WHERE: In the "What Makes the Enneagram Different" section, when discussing
stress patterns. Anxiety that looks like ADHD but is actually a personality
pattern is directly on-theme.

b) /enneagram-corner/shadow-work-by-enneagram-type
WHERE: In the "What to Do Next" section. "Looking inward" IS shadow work.
"Start with shadow work for your type" is a more specific action step than
"start looking inward."

c) /enneagram-corner/enneagram-parenting-styles
WHERE: In the section about childhood wounds. "Want to understand how your
childhood created your adult strategies? Start here."

d) /enneagram-corner/enneagram-criticisms
WHERE: Near the research citation. Proactively linking to the criticisms
page signals intellectual honesty and handles the objection before readers
raise it.

Also add to Related Reading section:

- Shadow Work by Enneagram Type (thematic match)
- Anxiety guide (symptom overlap angle)

═══════════════════════════════════════════════════════════════════ 5. NAME THE "MISSING MIDDLE" — THE ARTICLE'S UNSTATED THESIS
═══════════════════════════════════════════════════════════════════

Right now the article argues:

- Clinical neurodivergence is real (get diagnosed if you suspect it)
- Most people aren't neurodivergent (they're normal humans)
- The Enneagram explains personality patterns

What's UNSTATED but implicit is: there's a massive space between "you have a
clinical condition" and "you're fine" where most people actually live. People in
this middle zone are the ones scrolling TikTok, recognizing themselves in symptoms,
and self-diagnosing — because NO ONE is offering them a framework that explains
their struggles without pathologizing them.

The Enneagram IS that framework for the missing middle.

If you name this explicitly — "There's a gap between 'neurodivergent' and 'fine'
where most of us actually live, and nobody's talking about it" — you give readers
a concept to latch onto. That's the kind of framing that gets shared.

This could be a brief new paragraph in the opening, or in the "No One Is Normal"
section.

═══════════════════════════════════════════════════════════════════ 6. ADD A CONCRETE EXAMPLE THAT SHOWS THE OVERLAP
═══════════════════════════════════════════════════════════════════

The article has the Type 9/Type 1 examples, which are good. But it's missing a
concrete example that shows HOW personality patterns get mistaken for
neurodivergence. A vivid scenario would make the argument tangible:

"Consider a Type 7 (the Enthusiast). They chase new ideas constantly, jump between
projects, struggle to follow through, hate routine, and get bored the moment
something stops being novel. Every single one of those behaviors also appears on an
ADHD symptom checklist. But for the Type 7, those behaviors aren't driven by
executive dysfunction — they're driven by a deep fear of being trapped in emotional
pain. The coping strategy looks identical. The engine underneath is completely
different. And the path to change depends entirely on which engine is running."

This makes the abstract distinction viscerally clear. The Type 7/ADHD overlap is
the most documented example (your ADHD article covers it), so it's defensible.

Similarly: Type 5 social withdrawal being mistaken for autism spectrum traits.
Type 4 emotional intensity being mistaken for mood disorders. These are all real
patterns that show WHY the personality layer matters.

═══════════════════════════════════════════════════════════════════ 7. ACKNOWLEDGE WHAT THE TREND GOT RIGHT
═══════════════════════════════════════════════════════════════════

The article currently frames the neurodiversity trend as mostly negative (people
self-diagnosing, diluting real conditions). But the trend also:

- Massively destigmatized ADHD and autism
- Led to late diagnoses for adults (especially women) who were missed as children
- Created community and validation for genuinely neurodivergent people
- Made mental health conversations normal in a way that wasn't true 10 years ago

One paragraph acknowledging the good before critiquing the overcorrection would
make the article feel more fair and harder to dismiss. Something like:

"Credit where it's due: the neurodiversity movement has done real good. Adults who
were missed as children — especially women — are getting diagnosed for the first
time. The stigma around ADHD and autism has dropped dramatically. That matters. The
problem isn't awareness. The problem is when awareness becomes self-diagnosis, and
self-diagnosis becomes identity, and suddenly every human struggle gets reframed
as a brain condition."

This inoculates against the biggest counterargument: "you're just dismissing people
who are finally getting help."

═══════════════════════════════════════════════════════════════════ 8. ADD A COMPARISON TABLE FOR SCANNERS
═══════════════════════════════════════════════════════════════════

Many readers skim. A quick visual comparison table would capture scanners and
make the core argument land in 10 seconds:

| What a diagnosis gives you          | What the Enneagram gives you             |
| ----------------------------------- | ---------------------------------------- |
| Clinical label                      | Core motivation & fear                   |
| Medication access                   | Understanding of WHY you cope this way   |
| Workplace accommodations            | Roadmap for changing patterns            |
| Community of shared experience      | Insight into childhood wound origins     |
| Insurance coverage for treatment    | Type-specific growth path                |
| Explanation of WHAT your brain does | Explanation of WHY you respond as you do |

Then: "The best outcome? Both columns."

This reinforces the "both/and" framing visually and gives something shareable.

═══════════════════════════════════════════════════════════════════ 9. SEO REFINEMENTS
═══════════════════════════════════════════════════════════════════

Current meta description is good. Additional keyword opportunities:

- "neurodiversity self-diagnosis" (growing search volume)
- "is it ADHD or my personality" (question-format, good for featured snippets)
- "enneagram vs diagnosis" (low competition, high intent)
- "TikTok ADHD self-diagnosis" (trending)

The H2s are solid for SEO. Could add one more FAQ to the JSON-LD:
Q: "How do I know if it's ADHD or just my personality?"
A: Brief answer pointing to both professional assessment AND Enneagram typing.

This targets a high-intent question-format search.

═══════════════════════════════════════════════════════════════════ 10. MINOR POLISH
═══════════════════════════════════════════════════════════════════

a) The "What Makes the Enneagram Different" section has three paragraphs after
the dark box. The third paragraph (research citation) feels slightly tacked on.
Could integrate the evidence more naturally: "Think about it: when do most people
examine their childhood coping mechanisms? Usually only in a therapist's office
when something's broken. The Enneagram gives you that depth of insight proactively
— and there's growing evidence it works. A systematic review of 104 empirical
studies found..." (flows better than the current paragraph break)

b) The "From Labels to Leverage" section title is strong but the callout box
("Labels without understanding are just expensive ways to stay stuck") could
use attribution or framing. Is this a quote? A claim? Feels like it wants to
be a pull-quote rather than a standalone assertion.

c) The Related Reading section could benefit from one more entry:

- Shadow Work by Enneagram Type — for readers ready to "look inward"
- Or the anxiety guide — for readers wondering "is my anxiety a condition or
  a personality pattern?"

═══════════════════════════════════════════════════════════════════
PRIORITY ORDER (if you can only do a few):
═══════════════════════════════════════════════════════════════════

1. Add statistics to the opening (#1) — highest ROI, lowest effort
2. Add the Type 7/ADHD overlap example (#6) — makes the argument visceral
3. Name the "missing middle" (#5) — gives readers a concept to share
4. Acknowledge the trend's positives (#7) — inoculates against pushback
5. Engage with spectrum model (#2) — intellectual credibility upgrade
6. Comparison table (#8) — visual anchor for scanners
7. Internal cross-links (#4) — SEO and reader depth
8. Address Psyche competitor (#3) — thought leadership positioning
9. SEO refinements (#9) — incremental gains
10. Minor polish (#10) — quality of life
