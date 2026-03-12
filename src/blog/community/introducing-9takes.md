---

title: 'Introducing 9takes: Answer First, Then Compare Perspectives'
description: 'A Q&A platform where you answer before you read, built to surface diverse perspectives with an optional Enneagram lens.'
author: 'DJ Wayne'
date: '2023-04-17'
loc: 'https://9takes.com/community/introducing-9takes'
lastmod: '2026-03-12'
changefreq: 'monthly'
priority: '0.6'
published: true
type: ['inspiration']
blog: true
previewHtml: ''
pic: 'greek-statue-introducing-9takes'
path: src/blog/community/introducing-9takes.md

---

<svelte:head>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "headline": "Introducing 9takes: Answer First, Then Compare Perspectives",
      "description": "A Q&A platform where you answer before you read, built to surface diverse perspectives with an optional Enneagram lens.",
      "author": {
        "@type": "Person",
        "name": "DJ Wayne",
        "sameAs": [
          "https://www.instagram.com/djwayne3/",
          "https://www.youtube.com/@djwayne3",
          "https://www.linkedin.com/in/davidtwayne/",
          "https://twitter.com/djwayne3"
        ]
      },
      "publisher": {
        "@type": "Organization",
        "name": "9takes",
        "logo": {
          "@type": "ImageObject",
          "url": "https://9takes.com/brand/aero.png"
        },
        "sameAs": [
          "https://www.instagram.com/9takesdotcom/",
          "https://twitter.com/9takesdotcom"
        ]
      },
      "datePublished": "2023-04-17",
      "dateModified": "2026-03-12",
      "url": "https://9takes.com/community/introducing-9takes",
      "image": {
        "@type": "ImageObject",
        "url": "https://9takes.com/blogs/greek-statue-introducing-9takes.webp",
        "width": 900,
        "height": 900
      },
      "articleSection": "Technology",
      "keywords": ["9takes platform", "online conversations", "Enneagram", "Q&A platform", "anonymous discussions", "diverse perspectives", "personality types"],
      "isPartOf": {
        "@type": "Blog",
        "name": "9takes Community Blog",
        "url": "https://9takes.com/community"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://9takes.com/community/introducing-9takes"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do I need to know my Enneagram type to use 9takes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The Enneagram lens is optional. You can answer questions, read others' perspectives, and participate fully without ever selecting a type."
          }
        },
        {
          "@type": "Question",
          "name": "Why do I have to answer before I can see other comments?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Because seeing other people's answers first changes yours. Research on social priming shows a single early comment can shift an entire thread's direction. Writing your take first ensures an independent perspective."
          }
        },
        {
          "@type": "Question",
          "name": "Is 9takes anonymous?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You don't need a real name, photo, or social profile. Your personality type gives readers context without exposing your identity."
          }
        },
        {
          "@type": "Question",
          "name": "What kinds of questions work best on 9takes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Questions that don't have a single right answer. The best 9takes questions tap into lived experience, personal values, and emotional truth — the kind of answers that reveal how personality shapes perspective."
          }
        },
        {
          "@type": "Question",
          "name": "How is the Enneagram used on the platform?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When you answer a question, you can optionally tag your response with your Enneagram type. Readers can then filter answers by type, surfacing patterns in how different personality types approach the same question."
          }
        }
      ]
    }
  ]
}
</script>

</svelte:head>

<script>
	import  PopCard  from "$lib/components/atoms/PopCard.svelte";
	import  QuickAnswer  from "$lib/components/blog/callouts/QuickAnswer.svelte";
	import Rubix from "$lib/components/icons/rubix.svelte";
</script>

<QuickAnswer question="What is 9takes?">
**9takes is a Q&A platform where you answer first, then compare perspectives.** Comments are hidden until you contribute your own take — removing the echo chamber effect that plagues every other platform. An optional Enneagram personality lens lets you see *why* people think differently, not just *that* they do. One question, nine ways to see it.
</QuickAnswer>

<div
	style="display: flex;
    justify-content: center;
	margin: 1rem 0;"
>
	 <PopCard
		image={`/blogs/greek-statue-introducing-9takes.webp`}
		showIcon={false}
		tint={false}
		displayText=""
		altText="A Greek statue representing reflection and conversation"
		subtext=""
	/>

</div>

<p class="firstLetter">Where do good conversations happen online?</p>

Where can you get honest, unprimed perspectives without walking into an echo chamber?

On most platforms, the first few comments set the frame. Everyone else reacts, copies, or stays quiet. Research shows a single fake upvote shifts a comment’s final score by 25%. The conversation was over before it started.

9takes flips that default. You write your take first, then you unlock the thread and compare how other people see the same question.

## Why Social Media Isn't Social Anymore

Most feeds reward engagement, not understanding. Engagement loves conflict, so the loudest take wins and the rest of us scroll.

<div>
	<h3 style="margin: 0; color: #f1f5f9;">Two waves of social media.</h3>
	<section class="wave-sections wave-old">
		<h4 style="margin-top: 0; padding-top: 0;">🤖 Old wave 🔄</h4>
		<p><b style="color: #f1f5f9;">The old social media</b> was about staying in touch and sharing cool stuff.</p>
		<ul>
		<li>Users posted to be seen.</li>
		<li>Sharing became broadcasting.</li>
		<li>Reading became lurking.</li>
		<li>The algorithm rewarded sameness, and different viewpoints got filtered out.</li>
		</ul>
		<p style="color: #94a3b8; font-style: italic;">We look connected, and we feel divided.</p>
	</section>
	<section class="wave-sections wave-new">
		<h4 style="margin-top: 0; padding-top: 0;">🎭 New wave ❓</h4>
		<p><b style="color: #f1f5f9;">The new social media</b> is already here — it just doesn't look like a feed.</p>
		<ul>
		<li>Discord servers where strangers become friends over shared interests.</li>
		<li>BeReal pushing authenticity over performance.</li>
		<li>Substack Notes and niche communities built around conversation, not content.</li>
		<li>People choosing smaller, honest spaces over massive audiences.</li>
		</ul>
		<p style="color: #a78bfa;">The pattern: participation over performance, depth over reach.</p>
	</section>
	<p style="color: #e2e8f0;">9takes bets on the same shift — starting with <b style="color: #a78bfa;">questions</b>.</p>
</div>

## Why Questions Are the Key

Posts perform. Questions invite.

If you've ever scrolled past a Twitter thread thinking "I have a take on this but what's the point" — or lurked on Reddit because the top comment already said the safe thing — 9takes is built for you.

A question-centered approach:

- **Sparks curiosity**: A good question makes you lean in.
- **Invites reflection**: You answer with lived experience, not a headline.
- **Creates real interaction**: People disagree without it turning into a fight.

But asking questions online is easy. Getting _good_ answers is the hard part. You want original takes, not echoes. You don't want early answers steering everyone else. You want context for where someone is coming from.

## How 9takes Gets Better Answers

Here's what it actually looks like:

> Someone asks: _"What's the hardest thing about being honest?"_
>
> You think about it. You write your take. You hit submit.
>
> Now the thread opens. You see 30 other answers — and a Type 8 wrote something that catches you off guard. A Type 4 went somewhere deeply personal. A Type 5 reframed the whole question.
>
> You start to notice patterns in how different people approached the same prompt.

Three mechanics make this work:

<span class="point-list" style="margin-top: 1rem;">
<span class="center-svg">
<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" fill="#a78bfa"><path d="M255.6 385.2C231.4 416.6 201.5 432 172 432s-59.4-15.4-83.6-46.8c-9.1-11.9-17.1-25.7-23.5-41.2c9.2 5.1 19.8 8 31.1 8c35.3 0 64-28.7 64-64s-28.7-64-64-64c-19 0-36.1 8.3-47.8 21.4c2-47.8 17.7-89.3 40.2-118.6C112.6 95.4 142.5 80 172 80s59.4 15.4 83.6 46.8c24.1 31.4 40.4 77 40.4 129.2s-16.3 97.7-40.4 129.2zM320 141.8C290 76.1 235 32 172 32C77 32 0 132.3 0 256S77 480 172 480c63 0 118-44.1 148-109.8C350 435.9 405 480 468 480c95 0 172-100.3 172-224s-77-224-172-224c-63 0-118 44.1-148 109.8zm42.8 206.6c6.6 2.3 13.7 3.6 21.2 3.6c35.3 0 64-28.7 64-64s-28.7-64-64-64c-14.8 0-28.5 5-39.3 13.5c3.3-44.4 18.5-83 39.8-110.6C408.6 95.4 438.5 80 468 80s59.4 15.4 83.6 46.8c24.1 31.4 40.4 77 40.4 129.2s-16.3 97.7-40.4 129.2C527.4 416.6 497.5 432 468 432s-59.4-15.4-83.6-46.8c-8.2-10.7-15.5-23.1-21.6-36.7z"/></svg>
</span>
<b style="color: #e2e8f0;">Comments are hidden until you comment.</b>
</span>

Seeing other answers first [primes your thinking](/community/memetic-comments). Hiding them forces an independent take, then lets you compare. The psychology behind why this works — and [why most conversations fail before the first fact lands](/community/how-minds-change-on-9takes) — runs deeper than you'd expect.

<span class="point-list" style="margin-top: 1rem;">
<span class="center-svg">
<Rubix height={'1.5rem'} width={'1.5rem'} />
</span>
<b style="color: #e2e8f0;">A personality lens (the Enneagram).</b>
</span>

The Enneagram maps nine personality types based on core motivations — what drives you, what you fear, how you process the world. It's not astrology. It's a framework for understanding [why different people communicate the way they do](/enneagram-corner/enneagram-communication-styles). On 9takes, you can optionally tag your answer with your type. It gives readers context without forcing a real name. If you don't know your type yet, [start here](/enneagram-corner/beginners-guide-to-determining-your-enneagram-type) or skip it entirely.

<span class="point-list" style="margin-top: 1rem;">
<span class="center-svg">
<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="#a78bfa"><path d="M384 208A176 176 0 1 0 32 208a176 176 0 1 0 352 0zM343.3 366C307 397.2 259.7 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 51.7-18.8 99-50 135.3L507.3 484.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L343.3 366z"/></svg>
</span>
<b style="color: #e2e8f0;">Filter answers by personality type.</b>
</span>

Compare how different types answer the same question. Spot patterns, common ground, and blind spots across all nine perspectives.

## What Makes This Different From Reddit, Quora, or Twitter?

Every Q&A platform claims to value diverse perspectives. Here's how they actually work:

**Reddit** organizes by topic, rewards speed, and buries dissent with downvotes. The first commenter sets the frame and everyone else reacts to it. Deep conversations happen occasionally — despite the design, not because of it. ([Why Reddit can't deliver deep connections](/community/reddit-deep-connections-limitations).)

**Quora** rewards long-form expertise but optimizes for authority, not diversity. You get one "best answer" — usually from whoever has the most followers. Different perspectives get pushed to the bottom.

**Twitter/X** rewards hot takes and engagement bait. The loudest voice wins. Nuance dies in 280 characters.

**9takes** does something none of them do: it forces you to think independently before you see anyone else's answer. Then it shows you how personality shapes perspective. You're not reacting to a thread — you're contributing to a mosaic.

## Go Answer Something

Most questions that matter don't have a single right answer. The point is not to win — it's to see what you're missing.

1. Browse questions at [/questions](/questions) (or ask your own).
2. Write your take first.
3. Read the thread, then filter by personality type if you want.

Pick a question that makes you pause. Write what you actually think, not what sounds right. That's where it starts.

Curious how 9takes came to be? It started with a marriage counselor and a personality test. [Read the origin story](/community/inspiration-for-9takes). And if you're wondering about the design choices, the [Greek vibe is intentional](/community/why-the-greek-vibe).

## Frequently Asked Questions

### Do I need to know my Enneagram type to use 9takes?

No. The Enneagram lens is optional. You can answer questions, read others' perspectives, and participate fully without ever selecting a type. If you're curious, you can [find your type here](/enneagram-corner/beginners-guide-to-determining-your-enneagram-type) — but it's not required.

### Why do I have to answer before I can see other comments?

Because seeing other people's answers first changes yours. Research on social priming shows that a single early comment can shift an entire thread's direction. By writing your take first, you contribute an independent perspective. Then you get to compare it against others — which is where the real insight happens.

### Is 9takes anonymous?

Yes. You don't need a real name, photo, or social profile. Your personality type (if you choose to share it) gives readers context about where you're coming from without exposing your identity. This creates a space where people can be honest without the social consequences that silence most voices on other platforms.

### What kinds of questions work best on 9takes?

Questions that don't have a single right answer. "What's the hardest thing about being honest?" works better than "What year did X happen?" The best 9takes questions tap into lived experience, personal values, and emotional truth — the kind of answers that reveal how personality shapes perspective.

### How is the Enneagram used on the platform?

When you answer a question, you can optionally tag your response with your Enneagram type. Readers can then filter answers by type — seeing how all the Type 8s answered versus the Type 4s, for example. This surfaces patterns in how different personality types approach the same question, giving you insight into perspectives you might never have considered.

<style lang="scss">
	.point-list {
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-wrap: wrap;
		color: #e2e8f0;
	}
	.wave-sections {
		border-radius: 12px;
		margin: 1.5rem 0;
		padding: 1.5rem;
		background: linear-gradient(135deg, #1a1a2e 0%, #16161e 50%, #12121a 100%);
		color: #cbd5e1;
	}

	.wave-old {
		border: 1px solid rgba(100, 116, 139, 0.3);
		border-left: 4px solid #64748b;
	}

	.wave-new {
		border: 1px solid rgba(124, 58, 237, 0.3);
		border-left: 4px solid #7c3aed;
	}

	.wave-sections h4 {
		text-align: center;
		color: #f1f5f9;
	}

	.wave-sections ul {
		color: #cbd5e1;
	}

	.wave-sections li {
		margin: 0.5rem 0;
	}

	@media (max-width: 480px) {
		.wave-sections {
			margin: 0.75rem 0;
			padding: 1rem;
		}
	}
	.center-svg {
		width: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

<!--

# BLOG AUDIT — Grade: B+ (Strongest product manifesto)

WHAT WORKS:

- "Where do good conversations happen online?" — strong hook.
- "Posts perform. Questions invite." — memorable and punchy.
- The 25% fake upvote stat grounds the argument in evidence.
- The scenario walkthrough (someone asks "What's the hardest thing
  about being honest?") makes the platform concrete and compelling.
- Platform comparisons (Reddit/Quora/Twitter) are direct, fair, and
  name what each does well before saying what it can't do.
- Three mechanics section with SVGs is well-structured.

WHAT NEEDS WORK:

1. FAQ SECTION: Every answer restates something already thoroughly
   covered in the body. "Why do I have to answer before I can see
   other comments?" was already explained in detail. A smart reader
   who just finished the article doesn't need this. Either cut the
   FAQ entirely or replace with genuinely NEW questions (e.g.,
   "What happens if someone posts a low-effort answer just to unlock
   the thread?" or "How does moderation work without downvotes?").
2. "TWO WAVES" SECTION: The "new wave" examples (Discord, BeReal,
   Substack Notes) are already years old. A smart reader won't see
   these as "new wave." Either update with genuinely current examples
   or reframe — these aren't "new," they're evidence that the shift
   has already been happening for years and 9takes is the next step.
3. The "old wave" description is slightly reductive. "Sharing became
   broadcasting. Reading became lurking." — these are true but feel
   like things every social media critique says. Add one specific,
   less-obvious observation to stand out.

SUGGESTIONS:

- Cut or heavily trim the FAQ section. If you keep it, replace the
  questions with ones that address real objections/friction: "What if
  I don't know my Enneagram type?" is good (keep that one). Add:
  "What stops people from posting garbage just to see the thread?"
  or "How do you prevent the platform from becoming another echo
  chamber once communities form?"
- In the "Two waves" section, change framing from "new wave" to
  something like "The shift is already happening" — acknowledge these
  aren't predictions, they're evidence. Then position 9takes as
  building on that momentum.
- # The "Go Answer Something" CTA is good. No changes needed.
  -->
