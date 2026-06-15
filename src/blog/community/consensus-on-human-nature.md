---
title: 'The Consensus on Human Nature'
meta_title: 'The 3 Parts of Human Nature: Plato to the Enneagram'
description: "Plato, Hume, Freud, and modern neuroscience keep finding the same three forces in human nature: thinking, feeling, and instinct. 'Rational vs. emotional' misses two."
author: 'DJ Wayne'
date: '2023-05-13'
loc: 'https://9takes.com/community/consensus-on-human-nature'
lastmod: '2026-02-21'
changefreq: 'monthly'
priority: '0.6'
published: true
type: ['idea']
blog: true
previewHtml: ''
pic: 'greeks-debating-human-nature'
path: src/blog/community/consensus-on-human-nature.md
content_quality:
  hook: 8
  enneagram: 8
  evidence: 9
  writing: 9
  originality: 8.5
  discoverability: 9
  overall: 8.7
  letter: 'B+'
  rubric_version: 2
  graded_at: '2026-06-14'
---

<!-- QUALITY GRADE: B+ (8.7) — rubric v2 (ADAPTED: idea-essay, not a person analysis)
Evidence: 9 | Originality: 8.5 | Discoverability: 9 | Enneagram: 8 | Writing: 9 | Hook: 8

NOTE: This is a community idea-essay, not a celebrity personality blog. Person-specific
dimensions (Hook-on-a-moment, Enneagram emotional-interior check) were adapted to the essay form.
The `content_quality` block is inert for community blogs (the JSONB column lives on
`blogs_famous_people`); it's recorded here as a quality marker only.

ELEVATION PASS (2026-06-14): research-backed upgrade from B (8.0) to B+ (8.7).
DISCOVERABILITY 7 -> 9:
- Added `meta_title` ("The 3 Parts of Human Nature: Plato to the Enneagram", 51 chars) — front-loads
  the head term while the H1 keeps the editorial title. BlogPageHead consumes meta_title for <title>.
- Replaced the hand-rolled BlogPosting JSON-LD (a DUPLICATE — BlogPageHead.svelte already emits
  BlogPosting + BreadcrumbList for every community post) with FAQPage structured data (8 Q&As on
  real search queries), mirrored by a visible "## Frequently asked questions" section (schema ==
  visible, required for rich-result eligibility).
- Added a search-intent H2 + extractable answer block ("The three dimensions of human nature:
  thinking, feeling, and instinct") right after the thesis.
- Keyword-echoed 3 editorial H2s (Hume / Kahneman / the four-tradition convergence) without losing
  the voice line. Updated description to lead with "thinking, feeling, instinct" + a curiosity hook.
EVIDENCE 8 -> 9 (verified by research-analyst agent + web sources):
- FIXED a likely fabrication: the "blue pen vs. black pen" deliberation is not in Descartes' Error;
  replaced with Damasio's verified appointment-date anecdote.
- Added 3 verbatim, sourced quotes at the marquee moments: Damasio's "I never saw a tinge of
  emotion..." and "reduction in emotion may constitute an equally important source of irrational
  behavior," plus Pinker's own instrumental definition ("a kit of cognitive tools") — which turns
  Pinker into a witness for the thesis.
- Hedged two contested claims: attributed Pinker's "decline in violence" to him (Taleb/historians
  dispute it); flagged spirit->superego as the looser of the three Plato/Freud mappings.
SYSTEM INTEGRATION: 6 new contextual outbound links (mbti-vs-enneagram, software-and-hardware-of-
the-mind, overthinking/head, oversharing/heart, instinctual-subtypes/gut, enneagram-tldr) + 3
bidirectional backlinks added FROM philosophy-psychology-and-the-enneagram, enneagram-concepts, and
mbti-vs-enneagram.

STILL HOLDING IT BELOW A: Enneagram Integration is 8 (idea-essay — names the alarms fear/shame/anger
but renders no single person's felt interior, which is correct for the genre, not a flaw to fix).
Hook 8 and Originality 8.5 are the remaining ceiling; the core synthesis is unchanged, just better
sourced. To push toward A would mean a sharper single-sentence thesis up top and one more genuinely
novel turn — optional, not needed for publication.
-->

<script>
	const pinkerVideoUrl = "https://www.youtube.com/embed/qdzNKQwkp-Y?clip=Ugkx11XnGz8VeWrGta-a6JkOjd8jug3kSFB3&clipt=EOjvARjzygM";
	const hubermanVideoUrl = "https://www.youtube.com/embed/tLRCS48Ens4?si=Jt2NsKputVcqcHfy&start=1221";
</script>

<svelte:head>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the three parts of human nature?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Human nature runs on three dimensions: intellect (thinking), emotion (feeling), and instinct (gut). Thinkers who never met, working in different centuries with different tools, keep landing on the same three. Anyone who reduces people to 'rational vs. irrational' is measuring one of the three and calling it the whole."
      }
    },
    {
      "@type": "Question",
      "name": "Are humans rational or emotional?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Both, and the question is built wrong. Reason ranks options, but emotion decides which outcomes matter in the first place, so logic has nothing to aim at without it. The neuroscientist Antonio Damasio proved this with a patient named Elliot, who kept his IQ but lost his emotions after brain surgery and could no longer make a simple decision. Pure reason does not produce a better decision-maker. It produces an engine with no wheels."
      }
    },
    {
      "@type": "Question",
      "name": "How does the Enneagram relate to Plato and Freud?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "They describe the same three forces under different names. Plato's reason, spirit, and appetite map onto Freud's ego, superego, and id, which map onto the Enneagram's head, heart, and gut centers. The Enneagram then goes one step further: it describes nine distinct patterns of how people rank those three dimensions. Personality, in this view, is not about being rational or irrational. It is about which dimension runs point in your inner life."
      }
    },
    {
      "@type": "Question",
      "name": "What did Hume mean by 'reason is the slave of the passions'?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hume was describing the org chart, not insulting thinking. Reason is brilliant staff, but it does not set the agenda. You do not reason your way into caring about something. You care first, and then reason goes to work on how to get it."
      }
    },
    {
      "@type": "Question",
      "name": "Is the triune brain real?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "As anatomy, no. Modern neuroscientists like Lisa Feldman Barrett have shown the brain did not evolve in tidy stacked layers, and 'you don't have a lizard brain' is now its own genre of takedown. But the functional grouping survives. Cognition, emotion, and drive remain distinct, interacting systems in current neuroscience. The map was wrong about the geography and right about who lives there."
      }
    },
    {
      "@type": "Question",
      "name": "What are the three centers of the Enneagram?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Enneagram organizes its nine types into three centers, each running on one dimension of human nature and one signature alarm. The head center (types 5, 6, 7) runs on thinking and manages fear. The heart center (types 2, 3, 4) runs on feeling and manages shame. The gut center (types 8, 9, 1) runs on instinct and manages anger."
      }
    },
    {
      "@type": "Question",
      "name": "What is wrong with Kahneman's System 1 and System 2?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nothing, except it only divides one dimension. Both systems describe thinking: deliberate reasoning gets a system, fast intuition gets a system, and emotion and instinct get folded into System 1 mostly as sources of bias. A cognitive scientist built a model out of the dimension cognitive science measures best, and the other two thirds of human nature show up in it mainly as noise. That is a demonstration of why we keep needing a three-part model."
      }
    },
    {
      "@type": "Question",
      "name": "Why do people assume rationality is all of human nature?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Because the rational mind is the part we can see. You have direct access to your conscious thoughts and can articulate your logic on demand, while the other two dimensions do not take interview questions. And notice who keeps insisting rationality is the whole story: usually people for whom thinking is the dominant channel, describing their own strongest dimension and assuming it comes standard in everyone."
      }
    }
  ]
}
</script>

</svelte:head>

<div style="display: flex; justify-content: center; margin: 2rem 0; text-align: center;">
<img loading="lazy" title="Google definition of human nature" src="/blogs/human-nature.webp" alt="Google's human nature definition" />
</div>

<figure title="9takes's human nature definition">
    <blockquote>
    "The descriptions of how people think, feel, and act. These descriptions are studied within psychology and philosophy."
    </blockquote>
    <figcaption style="margin-left: 80%">-<cite>9takes definition</cite></figcaption>
</figure>

<p class="firstLetter">Everyone talks about "human nature" like it's a settled question. It isn't.</p>

Twenty-four hundred years of philosophy and psychology, and the field is still split over the basics. One camp says humans are rational beings who occasionally glitch. The other camp says rationality is a thin crust over something much older and much less polite.

Here's the argument this post makes: beneath that fight, there is a quiet consensus. Thinkers who never met, working in different centuries with different tools, keep arriving at the same model. Human nature has **three dimensions: the intellect, the emotions, and the instincts.** The people who reduce us to "rational vs. irrational" are measuring one of the three and calling it the whole.

Trace the pattern and you'll find it everywhere.

## The three dimensions of human nature: thinking, feeling, and instinct

Human nature has three dimensions, not two. There is the **intellect** (thinking: planning, language, the inner narrator), the **emotions** (feeling: identity, attachment, what is worth wanting), and the **instincts** (gut: territory, boundaries, action). The long fight over whether people are "rational" or "emotional" is really a fight over which of the three you've decided to ignore. Across Plato, Hume, Freud, modern neuroscience, and the Enneagram, the same three keep surfacing.

## Plato is to Aristotle as Freud is to Pinker

<!--
Image concept: rationality versus layered human nature.
Scene: marble classroom split into two study zones, one side orderly with geometry tools and clean diagrams, the other side crowded with masks, mirrored water, layered anatomy sketches, and unfinished notes.
Props: compasses, scrolls, busts, theater masks, brain sketches, stacked books, half-open curtain, measuring tools.
Lighting: crisp white light on the rational side, deeper amber shadow on the layered side.
Midjourney prompt:
split marble classroom scene with a Greek scholar statue standing between two study zones, left side orderly with geometry tools, clean diagrams, stacked scrolls, bright white light, right side layered with theater masks, mirrored water bowl, anatomy sketches, unfinished notes, half-open curtain, deeper amber shadow, editorial still life photography, realistic stone paper and brass textures, no readable text --ar 16:9 --v 6 --style raw --q 2 --stylize 125
-->

There's a recurring split in how great thinkers approach human nature. Some look at people and see layered complexity. Others see one defining trait, rationality, and treat everything else as noise.

**Plato** saw layers. His "Tripartite Soul" described three forces in constant negotiation: reason, spirit (emotion and social passion), and appetite (instinct and desire). In the _Phaedrus_, he pictured the soul as a charioteer straining to steer two horses, one noble and one wild. The charioteer is real. So are the horses.

**Aristotle**, his student, simplified. He granted that humans were social and that character mattered, but for him rationality was _the_ defining feature, the thing that separated us from animals. Everything else was supporting cast.

Two thousand years later, the same split reappeared with new names.

**Freud** rebuilt the layered view. His id, ego, and superego described three forces pulling at every person, with the conscious, rational mind as the visible tip of a much larger structure. Underneath sat drives, emotions, and moral pressures that most people never examine.

**Steven Pinker**, the modern cognitive scientist, mirrors Aristotle. In his book _Rationality_, Pinker argues that human reasoning built science, medicine, and democracy, and that the path forward requires more of the same. His evidence is real. The question is whether it's the whole picture.

The Aristotle-Pinker position offers something seductive: a clean operating manual. Be rational. Think clearly. Every human problem becomes solvable with better arguments.

Plato and Freud kept noticing the cases the manual can't explain. Why do brilliant people torch their own marriages? Why do you replay an embarrassing moment from eight years ago at 2 a.m.? Why does a crowd do things no individual member would defend the next morning? If rationality ran the show, none of that would happen.

## The philosopher who called the whole fight in 1739: Hume on reason and the passions

David Hume wrote the most famous sentence in this entire debate: "Reason is, and ought only to be, the slave of the passions."

Hume's point concerned the org chart, not the value of thinking. Reason is brilliant staff, but it doesn't set the agenda. You don't reason your way into caring about something. You care first, and then reason goes to work on how to get it.

Three hundred years later, that sentence reads less like provocation and more like a lab finding. We'll get to the lab in a minute.

## Plato and Freud, side by side

The parallels between Plato and Freud aren't vague. They map directly onto each other:

<div
    style="display: flex;
    justify-content: center;
    margin: 2rem 0;"
>

| Plato                                                                                                          | Emoji | Freud                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------ |
| **Reason-** rational, logical, and concerned with the most profound and abstract matters                       | 🧠    | **Ego-** operates on the reality principle, responsible for decision-making and problem-solving                          |
| **Spirit-** associated with emotions, passions, and desires related to social standing and honor               | ❤️    | **Superego-** moral part of the psyche, internalizes societal rules, moral standards, and values                         |
| **Appetite-** all the primal, fundamental drives such as hunger, thirst, sexual desire, and other bodily urges | 💪    | **Id-** instinctual part of the mind, operates on the pleasure principle, seeking immediate satisfaction of basic drives |

</div>

Two frameworks separated by millennia, arriving at the same architecture. The appetite-id and reason-ego pairings are the tightest; spirit-superego is the looser fit, but the three-part architecture is what repeats. That should get our attention.

But most modern discourse doesn't start here. It starts with rationality.

## The appeal of "just be rational"

Steven Pinker represents the best version of this argument. In _Rationality_, he traces how human reasoning produced extraordinary results: the scientific method, democratic institutions, and what he argues is a centuries-long decline in violence. Here he is making the case:

<div class="iframe-container">
<iframe width="100%" height="315" loading="lazy" src={pinkerVideoUrl} title="Pinker's call for rationality" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

_In this clip, Pinker argues that the world is sliding toward chaos and that rationality is the cure: human progress happened because we learned to reason, and the path forward requires more of the same._

Pinker's argument is persuasive because it's partly true. Rationality _is_ powerful. He even defines it instrumentally, as "a kit of cognitive tools" for attaining goals, which quietly concedes the point: reason serves ends it does not choose. That is Hume's org chart in a cognitive scientist's vocabulary. The trouble starts when it gets treated as the only dimension of human nature that matters.

When rationality becomes the whole framework, every human problem gets reduced to a knowledge gap. People disagree with you? They must be misinformed. Someone made a bad decision? They were being irrational. Society isn't improving fast enough? People need to think more clearly.

Plato, Hume, and Freud all understood what this framing misses: **the rational mind isn't operating alone.** It never was. There are forces underneath it, emotional drives and unconscious patterns, that shape behavior in ways pure logic can't reach.

## Why we default to the rational mind

Freud argued that a significant portion of our mental processes happens outside conscious awareness. The unconscious, in his model, holds repressed memories, desires, and unresolved conflicts that steer our thoughts and behavior from below.

So why do discussions of human nature keep fixating on the rational part? Because the rational mind is the part we can see. We have direct access to our conscious thoughts and can articulate our logic on demand.

The other two dimensions don't take interview questions. It is easier to critique someone's logic than to critique their instincts, because logic is the only part that shows its work.

<div style="text-align: center; display: flex; flex-direction: column; align-items: center; margin: 2rem 0;">
<img loading="lazy" src="/blogs/structural-iceberg.svg" alt="Freud's conscious iceburg" title="Freud's conscious iceburg" style="max-width: 400px;" />

By <a class="external-link" target="_blank" rel="noreferrer" href="//commons.wikimedia.org/wiki/User:Historicair" title="User:Historicair">historicair</a> - <span style="border:1px dotted #FC0;padding:0 4px"><a href="https://commons.wikimedia.org/wiki/File:Structural-Iceberg.svg" class="extiw" title="en:File:Structural-Iceberg.svg">Structural-Iceberg.svg</a></span> by <a class="external-link extiw" target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/User:Jordangordanier"  title="en:User:Jordangordanier">Jordangordanier</a>, Public Domain, <a href="https://commons.wikimedia.org/w/index.php">Link</a>

</div>

### Modern neuroscience kept the iceberg

[Andrew Huberman](https://www.youtube.com/@hubermanlab) and psychiatrist Dr. Paul Conti discuss this exact iceberg model on the Huberman Lab podcast. Their point: what we're consciously aware of, our rational thoughts, sits on top of a vast unconscious structure that drives most of our behavior. The conscious mind doesn't run the show nearly as much as we think it does.

<div class="iframe-container" >
<iframe width="100%" height="315" loading="lazy" src={hubermanVideoUrl} title="Huberman and Conti on the iceberg model of consciousness" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

Huberman and Conti built their own version of the iceberg (<a class="external-link" target="_blank" rel="noreferrer" href="https://hubermanlab.com/wp-content/uploads/2023/09/The-Iceberg-Model.pdf">view the full PDF here</a>) that breaks the layers of consciousness into clinical terms. The takeaway matches what Plato and Freud arrived at: rational thought is real and valuable, and it is only the visible tip of a much larger structure.

## The man who lost his emotions, and then his decisions

If you want the single strongest piece of evidence against "rationality is the whole story," it comes from a patient, not a philosopher.

In the 1980s, neuroscientist Antonio Damasio met a man he called Elliot. Surgeons had removed a tumor from Elliot's frontal lobe, and the operation damaged the region connecting reasoning to emotion. His IQ stayed intact. His memory stayed intact. He passed every cognitive test they gave him. The surgery had done one thing: it flattened his emotions. "I never saw a tinge of emotion in my many hours of conversation with him," Damasio wrote: "no sadness, no impatience, no frustration."

According to the Aristotle-Pinker model, Elliot should have become the perfect decision maker. Pure reason, zero emotional interference.

Instead, his life collapsed. He would spend half an hour weighing two possible dates for a single appointment, checking the weather, prior commitments, even the drive there, and still not decide. Choosing a restaurant became an endless cost-benefit analysis that never reached a verdict. He lost his job, then his marriage, then his savings, while reasoning flawlessly the entire time.

Damasio's conclusion, published in _Descartes' Error_, was blunt: "reduction in emotion may constitute an equally important source of irrational behavior." Emotion is what assigns value. Logic can rank options once something says which outcomes matter, and that something is emotional. Remove the feeling, and reason spins without traction, like an engine with no wheels.

Hume's org chart, confirmed in a clinic.

## Two systems is still one dimension: the limits of Kahneman's System 1 and System 2

The most popular modern model of the mind is Daniel Kahneman's System 1 and System 2: fast, automatic intuition versus slow, deliberate reasoning. It's brilliant work, and notice what it actually divides. Both systems are descriptions of _thinking_. Deliberation gets a system. Intuition gets a system. Emotion and instinct get folded into System 1 mostly as sources of bias, errors for slow thinking to catch.

From inside the thinking center, that's exactly how the other two dimensions look: like malfunctions. A cognitive scientist built a model out of the dimension cognitive science measures best, and the other two thirds of human nature appear in it mainly as noise.

That isn't a refutation of the three-part model. It's a demonstration of why we keep needing one.

## The pattern that won't go away: Plato, Freud, neuroscience, and the Enneagram agree

<!--
Image concept: four traditions discovering the same three-part pattern.
Scene: long stone study table with four workstations for Plato, Freud, neuroscience, and the Enneagram, each station arranged differently but all built around the same three colored tokens.
Props: parchment scrolls, quill, small brain model, carved stone enneagram disc, three colored glass pieces, calipers, oil lamps.
Lighting: museum study-room light, grounded and scholarly.
Midjourney prompt:
long stone study table in a museum-like library, four distinct workstations representing Plato, Freud, neuroscience, and the Enneagram, each arranged with different tools yet all centered around the same three colored glass tokens, parchment scrolls, quill, small brain model, carved stone enneagram disc, brass calipers, oil lamps, grounded scholarly atmosphere, balanced natural window light, photorealistic editorial photography, no readable text --ar 16:9 --v 6 --style raw --q 2 --stylize 100
-->

Step back and the convergence is hard to dismiss. Plato described three forces in ancient Athens. Freud rediscovered them in turn-of-the-century Vienna (he knew his Plato, so count that one as influence if you like). Neuroscientist Paul MacLean formalized a three-layer "triune brain" in the 1960s. Jonathan Haidt's moral psychology found intuition driving the elephant while reasoning rides on top. And the Enneagram, which developed through an entirely separate lineage, arrived at the same structure through its three [intelligence centers](/enneagram-corner/enneagram-concepts).

One honest caveat. MacLean's triune brain has taken real damage as _anatomy_: modern neuroscientists like Lisa Feldman Barrett have shown the brain didn't evolve in tidy stacked layers, and "you don't have a lizard brain" is now its own genre of takedown. Fair enough. But the functional grouping survives the autopsy. Cognition, emotion, and drive remain distinct, interacting systems in current neuroscience. The map was wrong about the geography and right about who lives there.

<div
    style="display: flex;
    justify-content: center;
    margin: 2rem 0;"
>

| Dimension       | Plato    | Freud    | Neuroscience (functional) | Enneagram            |
| --------------- | -------- | -------- | ------------------------- | -------------------- |
| **Thinking** 🧠 | Reason   | Ego      | Cognition                 | Head center (fear)   |
| **Feeling** ❤️  | Spirit   | Superego | Emotion / affect          | Heart center (shame) |
| **Instinct** 💪 | Appetite | Id       | Drive / arousal           | Gut center (anger)   |

</div>

It's not as if nobody tried other numbers. Descartes split human nature into two, mind and body. The Big Five uses five traits. The Myers-Briggs uses four dichotomies. Those are useful [taxonomies of _traits_](/community/mbti-vs-enneagram). The recurring three describes something different: [the machinery itself](/community/software-and-hardware-of-the-mind). When observers start from first principles and ask "what forces are actually operating inside a person," they keep landing on three.

The [Enneagram maps directly onto these ancient frameworks](/enneagram-corner/philosophy-psychology-and-the-enneagram), and then goes a step further. It describes nine distinct patterns of how people rank the three dimensions. Some lead with thinking and manage fear. Some lead with feeling and manage shame. Some lead with instinct and manage anger. Personality, in this view, isn't about being rational or irrational. It's about which dimension runs point in your inner life.

## The three dimensions, up close

"Thinking, feeling, instinct" sounds obvious until you look at what each one actually covers: what it's brilliant at, what its signature alarm is, and how it fails.

### The intellect: the simulator

This is the dimension that models things that don't exist yet. Language, planning, doubt, the inner narrator running scenarios at 3 a.m. Science, contracts, and calendars all live here. No other animal can sign a lease.

Its signature alarm is **fear**. A mind whose job is anticipating the future lives next door to anxiety, because most imaginable futures contain something that can go wrong. In the Enneagram, the [head types (5, 6, and 7)](/enneagram-corner/why-you-cant-stop-overthinking-enneagram) organize their entire inner life around this channel and its alarm.

Its failure mode: analysis that never reaches a decision, mistaking the model for the world, and treating emotion as corrupted data. Elliot is the case study for where that last one ends.

### The emotions: the valuer

This dimension handles identity, attachment, and significance. It reads rooms, tracks relationships, and answers the one question logic can't compute: _what's worth wanting?_ Damasio's patients prove the point. Valuing is emotional work, and without it, reasoning has nothing to aim at.

Its signature alarm is **shame**: the gap between who you are and who you need to be seen as. The [heart types (2, 3, and 4)](/enneagram-corner/oversharing-psychology-shame-boundaries) live closest to this channel.

Its failure mode: image management. Performing a self instead of having one, and outsourcing your identity to the audience's reaction.

### The instincts: the first responder

This dimension is the body's intelligence. Territory, boundaries, gut knowing, action. It's also the fastest of the three: your hand leaves the hot stove before the story of "the stove is hot" reaches your conscious mind, because the reflex arc routes through the spine and skips the boardroom entirely.

Its signature alarm is **anger**, the response to a boundary crossed. The [gut types (8, 9, and 1)](/enneagram-corner/enneagram-instinctual-subtypes) run on this channel.

Its failure mode: responding at full force to situations that needed ten percent, steamrolling people who process slower, and mistaking control for safety.

Pull any one of these out and the other two misfire. The variation between people isn't about having different equipment. We all have all three. The variation is in the ranking: which channel leads, which assists, and which one gets ignored until it forces the issue. That ranking, far more than "smart vs. dumb" or "rational vs. emotional," is what we casually call personality.

## What this actually means

If human nature really does run on three dimensions, the implications are practical.

**"Just think rationally" is the right tool for about a third of human problems.** A relationship dying of unprocessed shame won't be argued back to life. A gut-level refusal to change won't dissolve under a syllogism. The right tool depends on which dimension the problem lives in.

**We talk past each other by channel, not just by topic.** When someone who leads with thinking argues with someone who leads with feeling, they aren't merely disagreeing. They're processing the same reality through different machinery. Neither one is broken.

**Self-knowledge takes more than introspection-by-logic.** The parts of the iceberg below the waterline don't answer interview questions. You have to study your emotional patterns and your instinctive reactions the way you'd study a language you don't speak yet.

And notice who keeps insisting that rationality is the whole of human nature: usually people for whom thinking is the dominant channel. They're describing their own strongest dimension and assuming it comes standard in everyone. Plato would have recognized the move. The charioteer, asked to describe the chariot, left out the horses.

The three-part model keeps showing up because different observers keep examining the same animal. So the interesting question is no longer whether human nature has these three dimensions. The interesting question is personal: which one do you trust, which one do you suppress, and what are the other two doing while you're not watching?

There are [nine common answers](/enneagram-corner/enneagram-tldr) to that question. The [Enneagram's nine types](/enneagram-corner/enneagram-concepts) are nine ways of ranking the same three forces. And if you want to watch the three channels react to the same situation in real time, ask a question on [9takes](/questions) and read what comes back. Someone will analyze it. Someone will feel it. And someone will already be acting on it.

## Frequently asked questions

**What are the three parts of human nature?**

Human nature runs on three dimensions: intellect (thinking), emotion (feeling), and instinct (gut). Thinkers who never met, working in different centuries with different tools, keep landing on the same three. Anyone who reduces people to "rational vs. irrational" is measuring one of the three and calling it the whole.

**Are humans rational or emotional?**

Both, and the question is built wrong. Reason ranks options, but emotion decides which outcomes matter in the first place, so logic has nothing to aim at without it. The neuroscientist Antonio Damasio proved this with a patient named Elliot, who kept his IQ but lost his emotions after brain surgery and could no longer make a simple decision. Pure reason does not produce a better decision-maker. It produces an engine with no wheels.

**How does the Enneagram relate to Plato and Freud?**

They describe the same three forces under different names. Plato's reason, spirit, and appetite map onto Freud's ego, superego, and id, which map onto the Enneagram's head, heart, and gut centers. The Enneagram then goes one step further: it describes nine distinct patterns of how people rank those three dimensions. Personality, in this view, is not about being rational or irrational. It is about which dimension runs point in your inner life.

**What did Hume mean by "reason is the slave of the passions"?**

Hume was describing the org chart, not insulting thinking. Reason is brilliant staff, but it does not set the agenda. You do not reason your way into caring about something. You care first, and then reason goes to work on how to get it.

**Is the triune brain real?**

As anatomy, no. Modern neuroscientists like Lisa Feldman Barrett have shown the brain did not evolve in tidy stacked layers, and "you don't have a lizard brain" is now its own genre of takedown. But the functional grouping survives. Cognition, emotion, and drive remain distinct, interacting systems in current neuroscience. The map was wrong about the geography and right about who lives there.

**What are the three centers of the Enneagram?**

The Enneagram organizes its nine types into three centers, each running on one dimension of human nature and one signature alarm. The head center (types 5, 6, 7) runs on thinking and manages fear. The heart center (types 2, 3, 4) runs on feeling and manages shame. The gut center (types 8, 9, 1) runs on instinct and manages anger.

**What is wrong with Kahneman's System 1 and System 2?**

Nothing, except it only divides one dimension. Both systems describe thinking: deliberate reasoning gets a system, fast intuition gets a system, and emotion and instinct get folded into System 1 mostly as sources of bias. A cognitive scientist built a model out of the dimension cognitive science measures best, and the other two thirds of human nature show up in it mainly as noise. That is a demonstration of why we keep needing a three-part model.

**Why do people assume rationality is all of human nature?**

Because the rational mind is the part we can see. You have direct access to your conscious thoughts and can articulate your logic on demand, while the other two dimensions do not take interview questions. And notice who keeps insisting rationality is the whole story: usually people for whom thinking is the dominant channel, describing their own strongest dimension and assuming it comes standard in everyone.
