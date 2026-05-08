---
title: 'Round 2 Handoff: Write the Fallen Founders Blog'
description: 'Self-contained writing brief for the agent producing src/blog/pop-culture/fallen-founders-enneagram-analysis.md. All decisions made. Inline voice rules, pre-written hook + QuickAnswer, section-by-section structure with sourced evidence beats.'
author: 'DJ Wayne'
date: '2026-05-07'
status: 'ready for round 2 author'
audience: 'writing agent (single-shot brief)'
upstream_brief: 'docs/seo/cautionary-tales-founders-blog-brief-2026-05-07.md (background only — this handoff is canonical)'
target_file: 'src/blog/pop-culture/fallen-founders-enneagram-analysis.md'
target_route: '/pop-culture/fallen-founders-enneagram-analysis'
target_word_count: '3200–3800 words'
path: docs/seo/cautionary-tales-founders-handoff-2026-05-07.md
---

# Mission

Write a single pop-culture blog post for `9takes.com/pop-culture/fallen-founders-enneagram-analysis` that answers the survivor-bias gap in `tech-titans-leadership-styles.md`. That blog typed Silicon Valley's successful CEOs and got reader feedback that the framework felt cherry-picked. This blog is the response. It does NOT retrofit a section into the existing piece. It stands up on its own.

**The thesis, in one sentence:**

> "Successful tech founder" and "fraud tech founder" are the same psychological structure — the only difference is whether the underlying tech worked, and whether anyone caught the founder's type before it ran past its limits.

**The four-character cast (all types confirmed via shipped 9takes drafts):**

| #   | Founder           | Type                    | Persona                           | Outcome                                                     | Why they belong                                                                                                        |
| --- | ----------------- | ----------------------- | --------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | Adam Neumann      | **7w8** ("the Realist") | _Capital's Barefoot Prophet_      | No criminal charges. $1.7B exit + $2.5B new company (Flow). | The 7 who slithered out — same type as Branson, no integration brake.                                                  |
| 2   | Elizabeth Holmes  | **3w2** ("the charmer") | _Silicon Valley's Empty Costume_  | 11.25 years at FPC Bryan, TX.                               | The 3w2 who built the founder before the product — patron-collection over substance.                                   |
| 3   | Sam Bankman-Fried | **5w6** (sx/so stack)   | _Crypto's Disembodied Calculator_ | 25 years federal + $11B forfeiture.                         | The 5 who calculated his way into prison — utilitarian arithmetic substituted for ethics.                              |
| 4   | Sam Altman        | **4**                   | (existing — already typed)        | Still aloft. The live experiment.                           | The 4 with all three structural ingredients. Saved by GPT actually working + Microsoft entanglement + employee revolt. |

**The structural insight that organizes the blog:** _Each cautionary founder's disintegration arrow IS the specific shape of their downfall._ Map it explicitly:

| Founder | Stress arrow | What it looks like in the wild                                                                                                                                                                                      |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neumann | 7 → 1        | Manic visionary turns rigid. Yelling at staff, micromanaging, lecturing. The 7 who suddenly sounds like a 1 telling everyone they're doing it wrong.                                                                |
| Holmes  | 3 → 9        | The self disengages under accountability. **600+ "I don't know" answers in deposition.** That's the arrow on the public record.                                                                                     |
| SBF     | 5 → 7        | Math fails, the 5 cannot retreat further into analysis, so it explodes outward into manic 7 chaos: late-stage chaotic acquisitions, Naming Rights Era, the post-collapse media tour during a federal investigation. |
| Altman  | 4 → 2        | Identity-merging with whichever audience he needs in the moment. "Producing the version of himself the room needs." Already covered in the existing musk-vs-altman blog.                                            |

---

# Required Reading (Before You Write)

You **must** read these three personality-analysis drafts before drafting. They are the source material — every type-pin and most evidence beats come from them.

1. `src/blog/people/drafts/Adam-Neumann.md` — A grade 9.0
2. `src/blog/people/drafts/Elizabeth-Holmes.md` — B+ grade 8.9
3. `src/blog/people/drafts/Sam-Bankman-Fried.md` — A grade 9.4

You should also skim these existing 9takes pieces (~5 min):

- `src/blog/pop-culture/tech-titans-leadership-styles.md` — the parent blog this answers. The post-publish reader-review block at the bottom is the explicit gap this blog fills.
- `src/blog/pop-culture/musk-vs-altman-trial-personality-dynamics.md` — already covers Altman's 4-coded "unburdened by truth" pattern in detail. Frame 4 of this blog must NOT re-litigate; link to that piece instead.
- `src/blog/pop-culture/dark-triad-meets-enneagram.md` — the abstract framework sibling. This blog is its named-case-study companion.

Do not read the upstream brief (`docs/seo/cautionary-tales-founders-blog-brief-2026-05-07.md`) unless you need the source-citation list. This handoff is canonical and self-contained.

---

# Where To Write

**File:** `src/blog/pop-culture/fallen-founders-enneagram-analysis.md`

**Frontmatter — drop this in verbatim, fill the dated fields on publish:**

```yaml
---
title: "The Fallen Founders: What Holmes, Neumann, and Bankman-Fried Reveal About Tech's Personality Blind Spot"
meta_title: 'Holmes, Neumann, SBF: The Personality Types Behind Tech Fraud'
description: "Same types that built Apple and Amazon built Theranos and FTX. Holmes (3w2), Neumann (7w8), SBF (5w6) — and Sam Altman (4) is the live experiment. Here's the cautionary-tale pattern tech keeps missing."
author: 'DJ Wayne'
date: '2026-05-XX' # set on publish
loc: 'https://9takes.com/pop-culture/fallen-founders-enneagram-analysis'
lastmod: '2026-05-XX'
changefreq: 'monthly'
priority: '0.6'
published: false # flip to true when DJ approves
type: ['situational']
blog: true
previewHtml: ''
pic: 'fallen-founders-enneagram-analysis-composite'
picGroup:
  - image: '/types/7s/Adam-Neumann.webp'
    text: 'Adam Neumann'
    enneagramType: 7
  - image: '/types/3s/Elizabeth-Holmes.webp'
    text: 'Elizabeth Holmes'
    enneagramType: 3
  - image: '/types/5s/Sam-Bankman-Fried.webp'
    text: 'Sam Bankman-Fried'
    enneagramType: 5
  - image: '/types/4s/Sam-Altman.webp'
    text: 'Sam Altman'
    enneagramType: 4
path: src/blog/pop-culture/fallen-founders-enneagram-analysis.md
---
```

After the frontmatter, open with the standard pop-culture script block (match `tech-titans-leadership-styles.md`):

```svelte
<script>
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import QuickAnswer from '$lib/components/blog/callouts/QuickAnswer.svelte';
	import InsightBox from '$lib/components/blog/callouts/InsightBox.svelte';
</script>
```

---

# Pre-Written: Hook + QuickAnswer

These are anchored. Drop them in, edit lightly for cadence if needed, but keep the structure and evidence intact.

## QuickAnswer (drop in immediately after the script block)

```svelte
<QuickAnswer
	question="What do Adam Neumann, Elizabeth Holmes, and Sam Bankman-Fried have in common psychologically?"
>
	They are three different Enneagram types running the same dynamic: a founder personality without
	an integration mechanism. Neumann is a Type 7w8 — the empire-builder enthusiast who, like Richard
	Branson, can't stop expanding; he walked free because 7s always have the next room cued up. Holmes
	is a Type 3w2 — the achievement engine with the helper wing, who collected Henry Kissinger and
	James Mattis as patrons before the blood-test device worked; she went to prison because the gap
	between her image and her product was 100%. SBF is a Type 5w6 — the systems-mastery rationalist
	who, like Bill Gates or Mark Zuckerberg, builds from first principles; he got 25 years because
	juries hate cold rationalists who explain their fraud with arithmetic. Sam Altman is a Type 4 in
	the same structural position right now — and the only thing keeping him from this list is that GPT
	actually works. Fraud isn't a personality type. Fraud is what happens when any type runs without a
	check.
</QuickAnswer>
```

## Hook (drop in as the opening, after QuickAnswer, with `<p class="firstLetter">`)

```markdown
<p class="firstLetter">A boy in Indianapolis hands his mother $150 from a paper route and says "this is my share of the rent." A nine-year-old girl writes her father a letter saying she wants "to discover something new, something that mankind didn't know was possible to do" — and never specifies a what. A teenager at a Stanford-law dinner table is told that personal responsibility is a philosophical mistake.</p>

Three children. Three sentences. Three later founders. Each sentence is the entire personality, already on the page. Twenty years later, one of them walks free with $2.5 billion in fresh funding. One is in a Texas prison camp until 2032. One is in federal custody until 2049.

Same starting move — _build the founder before the product._ Three different types. Three different prison terms. And a fourth founder, Sam Altman, who learned how to do all three things at once.

This isn't a story about who lied. Every CEO lies. This is a story about which personality types lie in which shapes — and which type the consequences let walk away.
```

> All three opening quotes are real and sourced from the 9takes drafts. The Neumann quote is from his mother Avivit Neumann-Orbach (CTech / Calcalist 2020). The Holmes letter is in Carreyrou's _Bad Blood_ and was widely reproduced in the trial coverage. The SBF dinner-table framing is from his mother Barbara Fried's 2013 essay arguing that personal responsibility had ruined criminal justice — referenced in the SBF draft.

---

# Section-By-Section Structure

Word counts are targets. The total should land between 3,200 and 3,800. Don't pad. If a section runs short and the evidence is tight, ship short.

## §1 — Hook (≈250 words)

Use the pre-written hook above. End the section with the line: _"This isn't a story about who lied. Every CEO lies. This is a story about which personality types lie in which shapes — and which type the consequences let walk away."_ That line is the bridge to §2.

## §2 — The Sentencing Asymmetry Chart (≈200 words + table)

The table is the visual anchor. Put it here, not at the end.

| Founder           | Type | Company peak    | Fraud type                     | Criminal status               | Today                               |
| ----------------- | ---- | --------------- | ------------------------------ | ----------------------------- | ----------------------------------- |
| Adam Neumann      | 7w8  | WeWork — $47B   | Self-dealing, governance fraud | **No criminal charges, ever** | Flow ($2.5B valuation, a16z-backed) |
| Elizabeth Holmes  | 3w2  | Theranos — $9B  | Investor + patient fraud       | Convicted 2022                | FPC Bryan, TX. Release ~late 2032   |
| Sam Bankman-Fried | 5w6  | FTX — $32B      | Customer fund misappropriation | Convicted 2023                | Federal custody. Release 2049       |
| Sam Altman        | 4    | OpenAI — $300B+ | _(none charged — see §6)_      | None                          | CEO, OpenAI                         |

After the table, write ~150 words: the standard read is that this is a story about lawyers, jurisdictions, and which kind of fraud is easier to prosecute. The cleaner read is that it's a story about three different personality types running the same broken founder loop — and a fourth founder still standing. End with the thesis line:

> _Fraud isn't a personality type. Fraud is what happens when any type runs without a check._

## §3 — Frame 1: Adam Neumann, the 7 Who Slithered Out (≈700 words)

**Type-theory pin (one paragraph max):** Type 7w8 ("the Realist"). The Seven's core engine is the avoidance of pain through expansion — _more, more, more, never sit still long enough to feel the previous room cool._ The 8 wing adds dominance: bulldoze co-founders, board members, and norms when they slow the experience down.

**Required evidence beats — use at least 4:**

- **Age 10, $150 to mom:** "I earned $300 from my paper route. This is my share of the rent." (Source: Avivit Neumann-Orbach, Neumann's mother, via CTech / Calcalist 2020.) The boy who couldn't stand to owe his mother $50 grew up to lose other people's billions and reframe it as a learning experience.
- **13 homes by age 22.** The 7's core wound: home was a thing that ended without warning.
- **The Masayoshi Son meeting, 2016 — $4.4B in 12 minutes** after a brief office tour. _This is the receipt for "how does someone fund a real-estate sublease company at $47B?"_ The answer: they don't. They fund a 7 in a 12-minute charm offensive.
- **"Trillionaire / Prime Minister of Israel / President of the world."** Said out loud, on the record. Pure 7w8 grandiosity.
- **Bruce Dunlevie (Benchmark Capital partner) on his bet:** "an indefinable feeling that you couldn't quite put your finger on." (Source: Bookforum / Reeves Wiedeman.) Type 6 investor intoxicated by Type 7 founder energy. _Use this as the evidentiary anchor for one short callout: "This is what 6s sound like when they fund 7s. They don't have a thesis. They have a feeling."_
- **Marc Andreessen on Flow, 2022:** described Neumann as a "visionary leader" who is "revolutionizing" residential real estate. The same VC ecosystem that lit $40B on fire wrote him a fresh $350M check.
- **Stress arrow 7 → 1:** Under pressure, the manic visionary turns rigid and lecturing. Reportedly screamed at staff, micromanaged details, and turned the WeWork all-hands into sermons about how everyone was failing him. _The 7 who suddenly sounds like a Steve Jobs at his worst._

**Type comparison (one paragraph):** Richard Branson is what 7w8 looks like with an integration brake — Virgin Atlantic, Virgin Galactic, the music empire, all real businesses with real revenue. Neumann is what 7w8 looks like without the brake. Same engine. Different substrate.

**Closing micro-section:** "Why he never went to prison." One paragraph. The 7 always has the next room cued up before the current one cools. By the time the SEC's WeWork investigation closed, Neumann was pitching Flow. Theranos was a falsifiable physics claim — once the device was inspected, the lie collapsed. WeWork was a real-estate-arbitrage company with real-estate that exists. The 3's lie is more prosecutable than the 7's because the 3's lie is about a _thing_ and the 7's lie is about a _feeling_.

## §4 — Frame 2: Elizabeth Holmes, the 3w2 Who Built the Founder Before the Product (≈700 words)

> ⚠️ **Wing matters here.** Holmes is **3w2** — the achievement engine with the **helper wing**, not the uniqueness wing (3w4). The dominant story is _patron collection,_ NOT Steve Jobs cosplay. The cosplay is a sub-pattern. Lead with the patrons.

**Type-theory pin:** Type 3w2 ("the charmer"). Achievement-driven core, helper-wing presentation. The 3w2 doesn't just want to be admired — they want to be admired _by the most powerful people they can collect_. Mentors. Generals. Statesmen. The board IS the product image.

**Required evidence beats — use at least 5:**

- **The age-9 letter to her father:** "What I really want out of life is to discover something new, something that mankind didn't know was possible to do." She did not say a what, a field, a person, a problem. The shape was the point. _The personality is already on the page._
- **The desk quote.** Channing Robertson (her Stanford thesis advisor): "You start to realize, you are looking in the eyes of another Bill Gates, or Steve Jobs." (Source: Fortune, 2014.) Holmes kept this quote on her desk _before the company had a working device._ A 3w2 collecting validation from a borrowed authority figure.
- **The patron board.** Henry Kissinger, George Shultz, James Mattis, William Perry, Sam Nunn. Not one with healthcare expertise. Kissinger described her as "ethereal" and "like a member of a monastic order." Mattis: "a revolutionary in the truest sense." Ken Auletta reported the board talked about her "as if she were Beethoven." _3w2 patron collection at industrial scale._
- **John Carreyrou's clinical observation:** "the way she trained her big blue eyes on you without blinking made you feel like the center of the world." That's a 3w2 in interpersonal mode — the helper-wing reading you and giving you back exactly the version of yourself you wanted to feel.
- **Stress arrow 3 → 9:** **600+ "I don't know" answers** in deposition. The single most documented expression of a 3 stress-arrowing to a disengaged 9 on the public record. _When the achievement engine cannot achieve, the 3w2 doesn't lie harder. The self disengages._

**Type comparison (one paragraph, light footnote on Jobs):** Jensen Huang is what 3w2 looks like with a real product — same helper-wing instinct, but Huang's helper-wing built an ecosystem (every winner of the AI war is dependent on Nvidia GPUs) where Holmes's helper-wing built a patron list. Same wing. Different substrate. _One sentence on Jobs: Jobs is read as 1w2 — same helper wing as Holmes. The cosplay was wing recognition. She was reaching for the closest available costume of "person admired for what they made."_

**Closing micro-section — the Theranos-was-physics argument:** Theranos's fraud was technical and falsifiable. The Edison either ran 240 tests on a single drop of blood or it didn't. Once inspected, the lie collapsed. That's why a 3w2 went to prison and a 7w8 didn't — the 3's lie is about a _thing_, the 7's lie is about a _feeling_, and only one of those is physically inspectable.

## §5 — Frame 3: Sam Bankman-Fried, the 5 Who Calculated His Way Into Prison (≈700 words)

**Type-theory pin:** Type 5w6, sexual/social subtype stack. The 5's core defense is to retreat into analysis until the world becomes safe to model. The 6 wing adds tribal loyalty — for SBF, the EA community functioned as security tribe and as moral permission structure simultaneously.

**Required evidence beats — use at least 5:**

- **The Sequoia pitch, September 2022 — League of Legends through a $200M video call.** The Sequoia partners later described it as "one of those your-hair-is-blown-back type of meetings." _Sixty days later, FTX was bankrupt and $8B was missing._ Best possible Frame 3 opener.
- **The Kelsey Piper DM, days after the collapse.** SBF describes ethics — _his entire public framework_ — as "this dumb game we woke westerners play." Asked if his regulatory positioning was "just PR," he says: "Yeah, just PR." This is not a 5 who lost his way. **This is the 5 admitting the framework was a costume.**
- **Caroline Ellison testimony, October 2023:** "Sam directed me to commit these crimes." And: "He said at one point he thought there was a 5% chance he would become president." The 5w6 expected-value brain applied to its own life trajectory.
- **Gary Wang testimony:** "We gave special privileges to Alameda Research to allow it to withdraw unlimited funds [from FTX] and lied about it." The mechanism, on the record.
- **Judge Lewis A. Kaplan at sentencing, March 28, 2024:** "[He] never [said] a word of remorse for the commission of terrible crimes." _This is the courtroom anchor — juries and judges cannot forgive a 5 who refuses to round off._
- **Stress arrow 5 → 7:** When the math stops protecting him, the 5 disintegrates outward into manic 7 chaos — chaotic late-stage acquisitions, Crypto.com Arena naming rights, Tom Brady and Naomi Osaka endorsements, MLB umpire patches, the post-collapse media tour during a federal investigation. _The 5 who could not retreat further into analysis exploded outward instead._

**Type comparison (one paragraph):** Bill Gates is what a 5 looks like with strong moral integration. Mark Zuckerberg is what a 5 looks like with weak moral integration but strong product integration — Facebook actually shipped. SBF is what a 5 looks like when both integrations fail and the only remaining check is a math-based ethics framework that the 5 themselves controls the variables of.

**Closing micro-section — "EA was the costume."** The standard explanation for SBF's fraud is that EA made him do it — that expected-value reasoning corrupted a sincere altruist. The Kelsey Piper DM blows that frame up. He told a reporter, in writing, that the framework was PR. Not a 5 corrupted by EA. _A 5 who picked EA as the most defensible wrapper for what he was already going to do._

## §6 — The Stress Arrow Is the Failure Shape (≈400 words)

**This is the structural payoff section. Make it sing.**

Open with the observation: _the way each of these founders fell is exactly what the Enneagram predicts when their type disintegrates under pressure._ Then walk the table:

> **Type 7 → 1.** Neumann the manic visionary becomes Neumann the rigid lecturer. The screaming-at-staff stories, the all-hands sermons, the micromanagement. The 7 who suddenly sounds like the worst version of a 1 telling everyone they're doing it wrong.
>
> **Type 3 → 9.** Holmes the achievement engine becomes Holmes the disengaged ghost. 600+ "I don't know" answers in deposition isn't a defense strategy. It's a personality structure giving up on itself in real time, on the public record.
>
> **Type 5 → 7.** SBF the analytical retreat becomes SBF the manic outward chaos. Late-stage acquisitions, Crypto.com Arena, Tom Brady ads, the media tour during a federal investigation. The 5 who couldn't go further inward exploded outward instead.
>
> **Type 4 → 2.** Sam Altman the visionary narrative-architect becomes Sam Altman the audience-merging shapeshifter — the version of himself the room needs. Already covered in detail elsewhere. (Link to musk-vs-altman blog here.)

End with the load-bearing line:

> The fraud is not the personality. The fraud is the personality without a check, doing the thing the personality was always going to do under pressure. _Pattern recognition: if you know the type, you know the failure shape before the failure._

## §7 — Frame 4: Sam Altman, the 4 Who Is Still Aloft (≈350 words, link-heavy)

**Critical constraint:** Do NOT re-litigate the November 2023 OpenAI ouster. That's covered exhaustively in the existing `musk-vs-altman-trial-personality-dynamics` blog. Link to it. Stay lean.

What this section needs to do, in ~350 words:

1. **Map the structural ingredients.** Altman has the same gap-between-image-and-substance dynamic that fells 3s and the same narrative-architect grandiosity that defines 4s. The November 2023 board fired him for being "not consistently candid." A former board member coined "unburdened by truth." Mira Murati and Ilya Sutskever were collecting evidence. _All of this is on the public record._
2. **Name the three protections.** He didn't fall because (a) GPT actually works, (b) Microsoft's $13B is too entangled to unwind, (c) ~700 employees revolted within 5 days.
3. **State what the cautionary read is — without predicting.** None of those three protections are durable. If GPT plateaus, if Microsoft renegotiates, if a credible safety incident occurs, the same 4 dynamic that produced November 2023 is available to fuel the next chapter. _Map the latent structure. Do not predict._
4. **Cross-link out.** "[For the deep cut on Altman's 4-coded patterns, see Musk vs Altman.](/pop-culture/musk-vs-altman-trial-personality-dynamics)"

End the section with: _"Sam Altman is not the next Elizabeth Holmes. He is the live experiment in whether a Type 4 with a working product can avoid being one."_

## §8 — The Pattern: Fraud Is Not a Personality Type (≈350 words — closing thesis)

Walk back through the four cases and pin the thesis:

- The same Type 7 that built Virgin built WeWork.
- The same Type 3w2 that built Nvidia's helper-wing ecosystem built Theranos's helper-wing patron board.
- The same Type 5 that built Microsoft and Meta built FTX.
- The same Type 4 that's currently building OpenAI was, in November 2023, fired by his own board for being "unburdened by truth."

The variable is not personality. The variable is **integration** — whether the founder's type is checked by a co-founder, a board, a working product, or their own reflective work. Strip the check, and any type becomes the next perp walk.

End with a brand-voice closer that gives the reader a tactical takeaway. Not "don't trust founders." Something like:

> _The next time you're reading a founder profile, don't ask "is this person trustworthy?" Ask: "what's their type, and what's checking it?" If the answer is "they're a visionary and the only check is their own conviction," you already know how the story ends. You just don't know which prison sentence yet._

(Adjust phrasing; keep the move: pattern-recognition as the takeaway, not moralism.)

## §9 — Rabbit Holes Worth Exploring (≈100 words, bullet list)

Match the format used in `tech-titans-leadership-styles.md` and `silicon-valley-power-players-enneagram-analysis.md`. Bullets:

- **The Andreessen Pattern:** 6s funding 7s. Why does the same VC who funded WeWork fund Flow? The 6's threat-detection brain reads 7 confidence as access to something the 6 is missing.
- **The Holmes-Altman Mirror:** Same image-vs-substance gap, different mechanics. 3w2 patron collection vs. 4 narrative architecture. Why one fell and one didn't.
- **The EA Diaspora Post-SBF.** Did effective altruism cause the fraud, or did the 5w6 pick EA as cover? The Kelsey Piper DM puts a thumb on the scale. What does this mean for the people still wearing the costume?
- **Female founder cautionary cases beyond Holmes.** Charlie Javice (Frank), Ruja Ignatova (OneCoin). Type-coded analysis as a future post.
- **What's the next fraud?** Pattern-spot future cases by personality dynamics, not industry. If you can't name the type and the missing check, you can't predict the failure.

## §10 — Suggested Follow-Up Reads (≈50 words)

Match the format used at the bottom of `tech-titans-leadership-styles.md`:

```html
<div style="text-align: center; margin: 2rem 0;">
	<p>
		<i
			>This post is part of the Tech Titans Through the Enneagram series. See also
			<a href="/pop-culture/tech-titans-leadership-styles">Tech Leadership by Personality Type</a>,
			<a href="/pop-culture/dark-triad-meets-enneagram">Dark Triad Meets Enneagram</a>, and
			<a href="/pop-culture/musk-vs-altman-trial-personality-dynamics"
				>Musk vs Altman: A Type 5 and a Type 4 Walked Into a Federal Courtroom</a
			>.</i
		>
	</p>
</div>
```

---

# Internal Links to Weave (Required)

Use these inline as natural link anchors. Lowercase slugs match the existing pattern.

**Personality-analysis pages (publish before this blog ships so links resolve):**

- `/personality-analysis/adam-neumann`
- `/personality-analysis/elizabeth-holmes`
- `/personality-analysis/sam-bankman-fried`
- `/personality-analysis/sam-altman` _(already live)_
- `/personality-analysis/elon-musk` _(Type 5 contrast — live)_
- `/personality-analysis/mark-zuckerberg` _(Type 5 with product check — live)_
- `/personality-analysis/bill-gates` _(Type 5 with moral integration — live)_
- `/personality-analysis/jensen-huang` _(Type 3 with real product — confirm before linking; if not live, link via name without href)_
- `/personality-analysis/peter-thiel` _(Type 6 — relevant to "why VCs fund 7s and 4s")_

**Pop-culture sister blogs:**

- `/pop-culture/tech-titans-leadership-styles`
- `/pop-culture/musk-vs-altman-trial-personality-dynamics`
- `/pop-culture/dark-triad-meets-enneagram`

**Enneagram corner anchors (use sparingly, once each):**

- `/enneagram-corner/enneagram-type-7` (in §3)
- `/enneagram-corner/enneagram-type-3` (in §4)
- `/enneagram-corner/enneagram-type-5` (in §5)
- `/enneagram-corner/enneagram-type-4` (in §7)

---

# Voice Rules (Inline — Don't Skip)

The brand voice is **tactically direct, respectfully provocative, pattern-recognition focused.** This blog earns sharpness because the targets (Neumann, Holmes, SBF) committed real, large-scale, sentenced harm. Altman has not earned sharpness — he's a structural-pattern observation, not a target. Keep that asymmetry visible in the writing.

**Do:**

- Write like you talk. Read every sentence aloud. If it sounds like an essay, rewrite it.
- Verbs over adjectives: _decode, navigate, map, read, unlock, resolve._
- Em dashes for sharp insights. Minimal parentheses.
- Concrete over abstract. _"600+ 'I don't know' answers in deposition"_ beats _"she displayed avoidance under pressure."_
- Pattern recognition over moralism. The reader should leave with a model, not a verdict.
- Lean on second person where natural. _"You already know how the story ends. You just don't know which prison sentence yet."_

**Don't:**

- No "In conclusion." No "Let's dive in." No "It's important to note." No "Imagine if." No "Picture this."
- Don't moralize about fraud being bad. The reader doesn't need to be told.
- Don't gender-essentialize Holmes. The pattern is type-coded, not gender-coded.
- Don't frame ASD as the cause of SBF's fraud. ASD is context for how the 5 expresses itself. The fraud was a 5's first-principles ethics failure.
- Don't predict Altman's downfall. Map the latent structure. Predictions age badly.
- Don't fawn over Andreessen. The Flow investment is a data point, not a character indictment of a16z.
- Don't claim diagnoses. Use "type pattern" and "behavior cluster," not clinical pathology.
- Don't repeat `dark-triad-meets-enneagram` (the abstract framework piece). This blog is its named-case-study companion.
- Don't repeat `musk-vs-altman-trial-personality-dynamics`. Limit Altman to ~350 words and link out.
- Don't use the "that's the most [type] thing imaginable" tic. Once is fine; the parent blog already overused it.

**The single most important voice constraint:**

> _"Successful tech founder" and "fraud tech founder" are the same psychological structure._ This is the thesis. Every section should reinforce it. Every type comparison should land "same type, different substrate." If a paragraph could appear in any other think-piece about Holmes, cut it.

---

# Pre-Publish Checklist (Run Before Marking `published: true`)

- [ ] Word count between 3,200 and 3,800
- [ ] All four founders have a type-pin in the section header AND in the body
- [ ] Stress arrow section (§6) is its own section, not absorbed into another
- [ ] The thesis line ("fraud isn't a personality type — fraud is what happens when any type runs without a check") appears at least twice — once in §2, once in §8
- [ ] Hook D is intact (the three opening sentences with sourced quotes)
- [ ] QuickAnswer is intact and matches the four-character cast
- [ ] Sentencing chart in §2 has all four founders + types + outcomes
- [ ] Frame 4 (Altman) is ≤ 400 words and links to musk-vs-altman blog
- [ ] At least one direct link to each of: tech-titans-leadership-styles, dark-triad-meets-enneagram, musk-vs-altman-trial-personality-dynamics
- [ ] No predictions about Altman's downfall — only structural mapping
- [ ] No clinical-pathology language (psychopath, narcissist as diagnoses)
- [ ] No "In conclusion" / "Let's dive in" / "It's important to note" / similar AI-flat phrasings
- [ ] All `/personality-analysis/{name}` links resolve at the time of publish (Neumann, Holmes, SBF must be live first)
- [ ] Composite image generated for `pic: fallen-founders-enneagram-analysis-composite`
- [ ] `pnpm gen:personality-image-map` run if Neumann/Holmes/SBF images are new
- [ ] `pnpm index:blogs` after publish
- [ ] Cross-link added in `tech-titans-leadership-styles.md` closing pointing here

---

# What to Hand Back to DJ

After drafting:

1. The full blog file at `src/blog/pop-culture/fallen-founders-enneagram-analysis.md`
2. A 2–4 line summary of any structural choices that deviated from this handoff (e.g. "I cut the rabbit hole on female founders because the section was eating into Frame 3's word budget")
3. A flag for any internal link that didn't resolve at draft time (so DJ can publish the personality-analysis page first)
4. The composite image prompt or asset request, if not already generated

Do not flip `published: true`. Leave it `false`. DJ reviews and publishes.

---

# Source Citations (For Footnotes / Inline Linking If Needed)

The 9takes drafts contain full TESTIMONY LEDGER blocks with sources for every quoted person. Pull from there. The most-likely-needed external citations:

- Avivit Neumann-Orbach (Neumann's mother) interview: CTech / Calcalist 2020
- Channing Robertson on Holmes: Fortune profile, 2014
- Henry Kissinger on Holmes: Time, 2015
- John Carreyrou: _Bad Blood: Secrets and Lies in a Silicon Valley Startup_ (book)
- SBF Kelsey Piper DMs: Vox, November 2022
- Caroline Ellison testimony: U.S. v. Bankman-Fried, October 2023
- Judge Lewis A. Kaplan sentencing remarks: U.S. v. Bankman-Fried, March 28, 2024
- DOJ press release on Holmes 11+ year sentencing: justice.gov/usao-ndca
- a16z Flow announcement, Marc Andreessen blog post: August 2022
- Wikipedia: Removal of Sam Altman from OpenAI

If you need more, the upstream brief (`docs/seo/cautionary-tales-founders-blog-brief-2026-05-07.md`) has a fully-curated source list under §"Sources (For Round 2 Citation)".
