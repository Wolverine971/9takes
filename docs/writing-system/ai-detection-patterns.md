# AI Detection Patterns: What Checkers Look For (and How to Avoid Them)

*Reference guide for keeping 9takes blog content organic and human-sounding.*

---

## How AI Detectors Actually Work

Understanding the mechanics matters more than memorizing a word blacklist. Detectors use layered systems — you can swap out "delve" for something else and still get flagged if the underlying patterns remain.

### Perplexity: The "Predictability Score"

Detectors run your text through their own language model and ask: would an AI have chosen these exact words in this exact order?

- **Low perplexity** = predictable word choices = AI flag
- **High perplexity** = surprising, specific word choices = human signal

"The solution optimizes efficiency and enhances scalability" → very low perplexity. Every word is exactly what a model would pick.

"The solution works like my dad's truck — stubborn until it warms up" → high perplexity. No model generates that.

**Fix:** Use precise, unexpected words. Not random — just the *right* word that happens to be less statistically common than the safe alternative.

### Burstiness: The Variation Score

This measures how much your sentence complexity varies throughout the piece. Not any single sentence — the *rhythm* across the whole document.

Human writing is bursty:
- Short punchy sentence.
- Then a longer one that works through a thought and adds a clause or two before landing.
- Fragment. Like this.
- Back to normal flow.

AI writing is flat:
- Every sentence runs 15-25 words.
- Every paragraph has similar sentence count.
- The complexity stays consistent throughout.
- No spikes. No valleys.

AI writing is flat because the model uses the same statistical prediction process for every single token. There's no cognitive energy that rises and falls.

**Fix:** Deliberately vary sentence length within paragraphs. Mix 5-word sentences with 40-word ones. Use fragments on purpose.

### The Deeper Layers (GPTZero's Full System)

Modern detectors have moved beyond just perplexity + burstiness:

1. Per-sentence AI probability scoring
2. Matching against archives of known AI-generated text
3. "Paraphraser Shield" — distinguishes light Grammarly edits from full AI rewrites
4. ML classifiers trained specifically on GPT-4o, Claude 3, Gemini outputs
5. Semantic coherence analysis
6. Embedding-based pattern comparison

**Bottom line:** You can't just swap vocabulary. The structural and semantic patterns are what detectors now key on.

---

## The Vocabulary Blacklist

These words are statistically overrepresented in AI-generated text. A 2025 Max Planck Institute study confirmed words like "delve," "robust," and "pivotal" spiked 50%+ in published writing after ChatGPT launched. The list will evolve as models update, but the pattern behind it won't.

### Tier 1: Never Use These (The Clearest AI Signals)

**Academic formality cluster:**
- delve / delves / delving
- robust (as in "a robust solution")
- pivotal
- whilst
- aforementioned
- utilize (when "use" works fine)
- cognizant
- augment
- fundamentally
- nevertheless / nonetheless

**Landscape / realm cluster:**
- landscape (as in "the digital landscape")
- realm (as in "in the realm of")
- tapestry (as in "rich tapestry of")
- ecosystem (used generically)
- domain / sphere

**Over-emphasis cluster:**
- crucial
- vital
- essential
- paramount
- invaluable
- noteworthy
- significant (as filler)

**Tech-hype cluster:**
- cutting-edge
- groundbreaking
- revolutionary / revolutionize
- game-changer
- transformative / transform
- paradigm shift
- seamless / seamlessly
- scalable
- optimize / optimization
- leverage (as a verb)
- empower
- unlock (as in "unlock your potential")
- harness (as in "harness the power of")

**Corporate jargon cluster:**
- best practices
- pain points
- synergy
- holistic approach
- core competencies
- risk mitigation
- seamless integration

### Tier 2: Structural Transition Phrases (AI Formula Markers)

These get used mechanically as paragraph openers to simulate flow:

- Furthermore
- Moreover
- Additionally / In addition
- It is worth noting that
- It is important to note that
- It cannot be overstated that
- In conclusion / To summarize / In summary
- First and foremost
- Having said that / That being said / With that in mind
- As a result / Consequently (as paragraph openers)
- On the other hand (used formulaically)

### Tier 3: Sentence-Level Clichés

- "A testament to [X]"
- "In today's [adjective] world/age/landscape"
- "More than ever before"
- "Without further ado"
- "It goes without saying"
- "It's not just about X, it's about Y"
- "Not just X, but also Y" (repeated pattern)
- "At its core"
- "At the end of the day"
- "The fact of the matter is"
- "Plays a crucial role"
- "Gain valuable insights"
- "Evokes a sense of"
- "A treasure trove of"
- "The world of [topic]" as an opener
- "Whether you're a beginner or an expert"
- "In an ever-changing world"

### Tier 4: Chatbot Artifacts (Direct Copy-Paste Tells)

- "I hope this helps" / "I hope you found this useful"
- "Feel free to ask if you have questions"
- "As an AI language model..."
- "As of my last training update / knowledge cutoff"
- `citeturn0search0` (ChatGPT citation artifact)
- Smart/curly quotes where straight quotes are standard

---

## Structural Patterns Detectors Flag

### The Locked Three-Part Template

AI defaults to a rigid academic structure regardless of whether the content needs it:

1. Opening paragraph that restates the title and previews what's coming
2. Body with evenly-spaced headers
3. Lists inside most sections
4. Conclusion that summarizes every point
5. Call-to-action or "engage with us" closer

Real blog posts don't always announce their structure. A human might open in the middle of a story, circle back to context later, end on a single sharp sentence, or structure around a question rather than an argument.

**Fix:** Start in the middle of something. Skip the preview. End without a summary.

### List Overuse

AI converts prose into bullets constantly. Signs:
- 3-5 bullet points in every section
- Lists where items are parallel in structure but not meaning
- Lists used to appear comprehensive rather than to actually help the reader

**Fix:** Ask whether a list is serving the reader or performing thoroughness. If it's the latter, write prose.

### Paragraph Length Band

AI paragraphs consistently run 3-5 sentences, 60-120 words. Every paragraph. Human paragraphs range from one-line punches to ten-sentence deep dives, sometimes in the same section.

**Fix:** Write a one-sentence paragraph sometimes. Write a nine-sentence paragraph sometimes. Don't average out.

### Uniform Sentence Complexity

Readability scores (Gunning Fog Index, Flesch) stay flat throughout an AI document. Human writing shows these scores vary significantly — hard conceptual section, quick anecdote, sarcastic aside, back to analysis.

### Symmetric Headers

AI headers are uniform in length, parallel in structure, and evenly spaced. Human headers vary in length, sometimes ask questions, sometimes are intentionally vague.

---

## Semantic Patterns: The Deeper Problem

This is where detection goes beyond word choice. Semantic analysis looks at *what the text says*, not just *how it says it*.

### Generic Statements That Are True of Everything

AI makes accurate but non-specific claims. Things that are true but apply to any situation.

**AI pattern:** "Communication is essential in any relationship. When people communicate effectively, they build trust and resolve conflicts more easily."

True. Tells you nothing you didn't know. No specific mechanism, no concrete example, no edge case.

**Human pattern:** "My Type 2 sister apologizes in the same breath she explains why it wasn't actually her fault. It took me three years to notice that pattern, and once I did, every apology landed differently."

Specific person. Specific observation. Time-bound realization. Experiential outcome. None of that can be averaged out of training data.

### The Over-Explanation Pattern

AI explains everything at the same depth, including things obvious to the intended audience. This happens because the model has no model of what the reader already knows.

**Fix:** Trust your reader. Explain the hard thing. Skip the obvious thing. The mismatch of depth is itself a human signal.

### Fake vs. Real Hedging

**AI hedging (formulaic):** "It's worth noting that results may vary." / "While this approach has merit, it may not be suitable for everyone."

**Human hedging (authentic):** "I'm not sure this holds everywhere, but with Enneagram 8s specifically, the pattern breaks down when they're cornered publicly — then it's a different animal."

Real hedging is attached to a specific claim. It names the conditions under which the claim might be wrong. AI hedging is content moderation masquerading as nuance.

### Named Entity Deficit

AI text systematically underuses specific people, places, dates, and organizations. When AI does name things, they're either generic ("a leading tech company") or inconsistently integrated.

**Fix:** Name specific people. Reference specific events. Ground the argument in the real world.

### Circular Arguments

AI frequently restates its opening claim in the conclusion using slightly different words, having failed to actually advance the argument. Human writing moves — the reader ends somewhere different from where they started.

**Fix:** Your conclusion should contain something your introduction couldn't have contained. If you can swap intro and outro, the piece isn't going anywhere.

---

## What Human Writing Has That AI Can't Fake

### Episodic Memory

Specific memories are self-consistent, temporally grounded, and emotionally textured in ways statistical generation can't produce. "When I was 23 and broke" is different from "during difficult financial periods." Detectors increasingly look for named entities tied to specific time references as human markers.

### Authentic Opinion

Humans express opinions that might be unpopular, that disagree with their previous statements, or that they partially walk back. AI generates "balanced perspectives" that present both sides without committing to either.

**The tell:** If a piece ends with "both perspectives have merit," it was probably written by an AI.

### Colloquialisms and Subcultural Vocabulary

AI underrepresents informal language, slang, idioms, and domain-specific jargon — these terms have lower predictability in training data. Human writers naturally use in-group vocabulary and regional shorthand.

A 2025 UNESCO analysis called this "AI and the great linguistic flattening" — LLMs converge written language toward a globally legible standard that lacks the texture of any particular human community.

### Non-Linear Argument Structure

Humans sometimes make their most important point in the middle. They circle back to earlier points to recontextualize rather than repeat. They drop threads and pick them up three paragraphs later. They end without resolution sometimes.

AI structures for completeness and closure because those patterns dominate training data.

### Intentional Rule Breaking

Fragments. Starting sentences with And. Starting sentences with But. Ending with a question that doesn't get answered. Parenthetical asides that serve no informational purpose but build voice. Repetition for rhetorical effect. Repetition for rhetorical effect.

AI doesn't reliably generate these because they violate the patterns it's optimized for.

### Uncomfortable Specificity

University College Cork's 2025 study put it clearly: AI can't fully write like a human because humans write with *uncomfortable specificity* — details that are too personal, too idiosyncratic, or too local to have been averaged out of a training corpus.

If a claim is only true of one person, one moment, or one very specific situation, it's almost certainly human.

---

## Quick Checklist Before Publishing

Use this as a final pass. A "yes" on any of these is a flag.

**Vocabulary:**
- [ ] Does the post contain any Tier 1 AI words (delve, robust, pivotal, tapestry, etc.)?
- [ ] Does every section transition with "furthermore," "moreover," or similar?
- [ ] Does any sentence use "it is worth noting that" or "it is important to note"?
- [ ] Is there an "in conclusion" or "to summarize" section?

**Structure:**
- [ ] Does the opening paragraph preview what the post will cover?
- [ ] Does the conclusion restate the introduction?
- [ ] Are all paragraphs roughly the same length (3-5 sentences)?
- [ ] Are all sentences roughly the same length (15-25 words)?
- [ ] Does every section contain a bullet list?

**Semantic:**
- [ ] Does the post make any claims that are true of all situations rather than this specific one?
- [ ] Does any section over-explain something the target reader already knows?
- [ ] Does the hedging say "results may vary" rather than naming specific conditions?
- [ ] Are there fewer than 3 specific named people, events, dates, or places?
- [ ] Does the post end with "both perspectives have merit" or a false balance?

**Voice:**
- [ ] Is there no point where the writer expresses an opinion that could be wrong?
- [ ] Does the post read the same way at the beginning and the end (no cognitive progression)?
- [ ] Are there no fragments, intentional rule breaks, or voice-building asides?

---

## The Deepest Signal

Detectors are ultimately measuring one thing: **evidence of cognitive load**.

The marks of someone actually working through a thought — the slightly awkward transition that got left in, the mid-paragraph pivot, the sentence that restarts, the paragraph that's a bit longer than it should be because the writer was working something out. Perfect polish is itself a detection signal.

AI text is uniformly polished because it has no cognitive load to manage. Human writing carries the texture of a mind at work.

The strongest organic content on 9takes will have:
- Opinions that could be unpopular
- Details that are only true of specific people or moments
- Sentence rhythms that vary dramatically
- Arguments that arrive somewhere different from where they started
- At least one moment where the writer shows their reasoning — including the doubt

---

*Sources: GPTZero methodology docs, Hastewire linguistic analysis, ArXiv 2505.01800 (May 2025 psycholinguistic study), University College Cork AI study (December 2025), UNESCO linguistic flattening analysis, PMC detection studies, Max Planck Institute vocabulary research.*
