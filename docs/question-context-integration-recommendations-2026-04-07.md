<!-- docs/question-context-integration-recommendations-2026-04-07.md -->

# Question Context Integration Recommendations

Date: 2026-04-07

## Core Problem

You want richer context on question pages for clarity and SEO, but a visible second field beside the main question box feels unnatural. Most people expect to ask a question in one box, not fill out a mini form.

That instinct is right.

The goal should be:

- preserve the natural “ask one question” interaction
- still capture structured supporting detail
- render that supporting detail as part of the question, not as detached metadata

## Recommended Model

Treat a question as two layers of the same thing:

1. the main question
2. the supporting detail that explains what the question means

The user should experience this as one composed thought, not two unrelated inputs.

## Best UX Recommendation

### Use a one-box composer first, then an optional “add detail” step

This is the best fit for 9takes.

Why:

- it preserves the current norm of typing into a single question box
- it keeps the top of the flow lightweight
- it lets you collect context only when it helps
- it fits your existing confirmation modal well

### How it should work

#### Step 1: Keep the main composer as one textarea

Do not lead with two equal textareas.

The first screen should still feel like:

- “What’s your question?”

Users can type:

- just the question
- the question plus a little background
- a more conversational paragraph

#### Step 2: On submit, structure the content before final creation

When the user clicks `Launch Your Question`, the review step should help separate:

- `Question`
- `Background` or `More detail`

This can happen in two ways:

#### Option A: Progressive disclosure

In the confirm modal, show:

- the question preview
- a quiet optional section like `Add a little more detail (optional)`

This is the simplest version.

#### Option B: Smart split from one input

If the user typed more than one sentence, or typed a question plus explanation, auto-suggest:

- `Question: How do you handle stress?`
- `Background: I’ve been juggling work and family lately and I’m curious how other people think about it.`

Then let the user edit both before posting.

This is the strongest version if you want context without making the initial ask flow feel heavier.

## My Recommended Product Pattern

If I were choosing for 9takes, I would do this:

### Pattern: One main box + optional detail in the confirmation step

Flow:

1. User types naturally into one question box
2. On `Launch Your Question`, the modal asks:
   - `Is this the question you want people to see?`
   - `Want to add a sentence or two of background?`
3. If the user already typed extra detail, auto-fill the background field
4. Final saved structure is still:
   - `question`
   - `context`

This keeps the interface normal while still giving you structured SEO-friendly data.

## What To Call It

Do not call the field `Context` in the product UI.

That sounds internal and abstract.

Better labels:

- `Add background`
- `Add more detail`
- `What should people know?`
- `Why are you asking?`
- `Anything else that would help people answer?`

Best default choice:

- `Add a little more detail (optional)`

That feels natural and low-pressure.

## When To Encourage It

Do not force everyone to fill it out.

Instead, encourage it when the question is broad, vague, or easy to misread.

Examples:

- `How do you handle stress?`
- `What should I do?`
- `How do you know if it’s worth it?`
- `What do you think about this?`

Prompt copy:

- `This question could use a little background so people understand what you mean.`
- `A sentence or two of detail can help people give better answers.`

## How It Should Be Displayed On The Question Page

This matters as much as collection.

The context should not feel like a sidebar note or hidden metadata field.

It should appear as part of the question itself.

### Recommended display pattern

At the top of the page:

- `H1`: the question
- directly underneath: the supporting detail

This supporting detail should be styled as a subhead or deck, not as a separate card floating elsewhere.

### Best visual hierarchy

1. Question as the dominant headline
2. Context immediately below in smaller, readable body copy
3. Then interaction and discussion blocks

This keeps the whole thing feeling like one coherent prompt.

### Good examples

#### Short context

Question:

`How do you handle stress?`

Displayed context:

`I’m especially curious about what people do when stress comes from work and family at the same time.`

This can just live directly under the question with no label.

#### Longer context

Question:

`What is the key to a good marriage?`

Displayed context:

`I’m not asking for a generic answer. I’m interested in what actually holds up during hard seasons, not just when things are easy.`

For longer context, you can add a small label:

- `Background`

But even then, it should still sit directly beneath the question.

## What Not To Do

### 1. Do not put context in a separate side panel

That makes it feel secondary and weak for both users and crawlers.

### 2. Do not hide it behind an accordion by default

If it is important for understanding the question, it should be visible in the main content.

### 3. Do not make the user think in database fields

The UI should not feel like:

- Question
- Context
- Tags
- SEO details

The user should feel like they are just clarifying their thought.

### 4. Do not let AI rewrite the core question without review

AI can help split and clean the input, but the user should remain in control of the final visible question.

## Best Content Model

Internally, I would store:

- `question_raw`
- `question_formatted`
- `context`

Meaning:

- `question_raw`: what the user originally typed
- `question_formatted`: cleaned visible question
- `context`: supporting detail shown below the question

If the user types everything into one box, you can still derive the last two fields from the raw input.

## SEO Implication

For SEO, this is the important rule:

The context should be visible on-page as part of the main content near the question headline.

That means:

- not hidden
- not below the fold if possible
- not only in JSON-LD
- not only in meta description

If it is important enough to improve search relevance, it should be important enough to show users immediately.

## Recommended UI Copy

### Initial composer

Placeholder:

`Ask a thought-provoking question. If you want, you can add more detail in the next step.`

### Confirmation step

Supporting prompt:

`Want to add a little more detail so people understand the angle you mean?`

Field label:

`Background (optional)`

Helper text:

`One or two sentences is enough.`

## Recommended Display Copy

If context exists:

- show it directly below the question
- if under roughly 180 to 220 characters, show all of it
- if longer, show a strong excerpt plus `Show more`

If no context exists:

- do nothing
- do not render empty labels

## Practical Recommendation For 9takes

If you want the cleanest path:

1. Keep the current single question textarea
2. Add optional detail capture in the confirmation modal
3. If the user typed multiple sentences, suggest splitting them into question + background
4. Render the background directly beneath the question on the detail page
5. Use that same visible background for metadata support

That gives you:

- better UX
- better SEO
- cleaner structured content
- no awkward “two-box form” feeling at the start

## Strongest Single Recommendation

Do not introduce a full second textarea in the initial ask screen.

Instead:

- keep one natural composer
- collect detail in the next step
- display that detail directly under the question as part of the same prompt

That is the most natural way to integrate context without breaking the feel of the product.
