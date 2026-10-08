---
title: 'What Enneagram Type Are Most CEOs? Data From 80 Business Profiles'
meta_title: 'What Enneagram Type Are Most CEOs? Type 5, by the Data'
description: "Of 46 founders and CEOs 9takes has profiled, 14 are Type 5, over three times the type's sitewide share. See the counts, the names, and the limits."
author: 'DJ Wayne'
date: '2026-10-07'
loc: 'https://9takes.com/enneagram-corner/what-enneagram-type-are-most-ceos'
lastmod: '2026-10-07'
changefreq: 'monthly'
priority: '0.7'
published: true
type: ['workplace', 'leadership']
blog: true
previewHtml: 'Career guides hand the corner office to Type 8 or Type 3. We counted 80 business profiles. Among the 46 people who built or ran a company, Type 5 shows up most, at 3.6 times its sitewide rate.'
path: src/blog/enneagram/what-enneagram-type-are-most-ceos.md
---

<!--
Keyword target: "what enneagram type are most ceos" (+ "enneagram type of ceos", "most common enneagram type for ceos/founders/entrepreneurs").
SERP checked 2026-10-06: wecreateproblems.com and alidunn.com rank with no data. A Gitnux "Enneagram statistics" roundup states "CEOs 30% Type 3" with no named source.

Data provenance (recompute before citing new numbers):
- Pulled 2026-10-07 from blogs_famous_people, published rows only (451). Read-only via scripts/db-query.sh.
- "Business category" = rows whose `type` array contains techie, entrepreneur or business. Same rule as the
  tech-business domain in scripts/generate-corpus-stats.js, so n=80 and the 20 Threes / 19 Fives match /corpus-stats.
- Groups are hand-classified by primary public role. The full roster in the post body is the classification.
- Baseline ("whole corpus") = all 451 published profiles, the same baseline /corpus-stats uses.
- Sensitivity checks: drop the 7 AI-lab leaders (Amodei, Hassabis, Liang, Yang, Altman, Murati, Wang) -> Fives 10, Threes 10 (n=39).
  Add Vivek Ramaswamy + Jared Kushner to the CEO set -> Fives 14, Threes 13 (n=48). Founder + hired only (n=36) -> Fives 14, Threes 5.
  CEO set + investors (n=61) -> Fives 17, Threes 13. Binomial P(>=14 Fives | n=46, p=38/451) ~ 1.6e-5.

Hero image: none yet (the page renders without `pic`). Prompt for DJ to run in ChatGPT, then
`node scripts/blog-image-variants.mjs what-enneagram-type-are-most-ceos <image>` and set pic: 'what-enneagram-type-are-most-ceos'.
Concept: everyone expects the orator to lead; the line forms at the quiet scholar's door.
Prompt:
A cinematic widescreen 16:9 photograph that fills the entire frame edge to edge (no borders, no letterboxing). Subject: classical Greek marble statues; the crowd is expected to follow the orator, but the line forms at the quiet scholar's door.

A dark marble forum at night. Just left of center in the foreground, a tall marble orator statue in a draped toga stands on a low stone podium, one arm raised mid-speech, chin lifted, addressing rows of empty stone benches. Nobody is listening to him.

Just right of center, a few steps behind him, a narrow stone doorway glows with warm amber lamplight. Through the doorway, a seated marble scholar in a plain hooded robe bends over a bronze geared mechanism like the Antikythera device, completely absorbed, his shoulder half-turned to the forum. Outside his door, a single-file queue of marble statues in togas and simple armor waits patiently, every head turned toward the lit doorway and away from the orator.

Style: realistic weathered Carrara marble with fine veins, hairline cracks and chips, anatomically correct hands with five fingers, cinematic editorial photography, 50mm lens, shallow depth of field, dramatic chiaroscuro, warm amber light spilling from the doorway across a polished black marble floor, deep charcoal shadows, mostly black, white and grey tones with warm amber as the only color. Every figure is fully clothed; no nudity. Keep the orator, the doorway and the scholar inside the middle half of the frame so a square center crop keeps all three. Absolutely no text, letters, words, numbers, signage, logos or watermarks anywhere.
-->

<script>
	import QuickAnswer from '$lib/components/blog/callouts/QuickAnswer.svelte';
	import InsightBox from '$lib/components/blog/callouts/InsightBox.svelte';
</script>

<svelte:head>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What Enneagram type are most CEOs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In 9takes' data, Type 5. Of 46 profiled public figures who built or ran a company, 14 type as Fives (30.4%), against 8.4% across the site's 451 profiles. Type 3 is second with 11 (23.9%). These are 9takes' typings of famous leaders from the public record, not test results from CEOs in general."
      }
    },
    {
      "@type": "Question",
      "name": "Are most CEOs Type 3 or Type 8?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Neither, in this data, though Type 3 comes close. Threes are the second most common type among the 46 company leaders, and they edge out Fives 20 to 19 across all 80 business-category profiles because creators and celebrities with companies skew Three. Eights are 6 of 46 (13.0%), barely above their 10.6% sitewide share."
      }
    },
    {
      "@type": "Question",
      "name": "What Enneagram type are most founders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Type 5. Of the 31 founder-CEOs 9takes has profiled, 13 are Fives (42%), including Bill Gates, Mark Zuckerberg, Larry Page and Elon Musk. Type 3 is next with 5. Most of these founders built tech companies, which likely drives part of the pattern."
      }
    },
    {
      "@type": "Question",
      "name": "Why are so many tech CEOs Type 5?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "One hypothesis: most tech founders start as engineers or researchers, and the Five's habit of withdrawing into a hard problem until they understand it better than anyone fits that first job. The CEO title may follow the engineering. The data shows a cluster in 9takes' editorial typings. It can't prove the cause."
      }
    },
    {
      "@type": "Question",
      "name": "What Enneagram type is least common among CEOs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Type 2. None of the 46 company leaders in 9takes' data type as Twos, where the sitewide rate would predict about three. Sixes and Nines are next, with two each. At this sample size, those small counts are suggestive at most."
      }
    },
    {
      "@type": "Question",
      "name": "Does this mean Type 5s make better CEOs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The data counts who 9takes has profiled. It says nothing about who leads well. The Five column includes Bill Gates and Satya Nadella, and it also includes Sam Bankman-Fried. A type describes where someone's attention goes, not how well they use it."
      }
    }
  ]
}
</script>

</svelte:head>

<QuickAnswer question="What Enneagram type are most CEOs?">
In 9takes' data, <strong>Type 5, the Investigator</strong>. Of the 46 public figures we've profiled who built or ran a company, 14 type as Fives (30.4%), against 8.4% across all 451 profiles on the site. Type 3 comes second with 11 (23.9%), close to its sitewide share of 18%. Widen the count to all 80 business-category profiles, including creators and celebrities with side companies, and Type 3 edges ahead, 20 to 19. These are our typings of famous leaders from the public record. They describe famous CEOs as 9takes reads them, not CEOs in general.
</QuickAnswer>

<p class="firstLetter">Picture a CEO. Most people picture the same one: the loudest voice in the meeting, first to decide, last to back down. Enneagram career guides give that person a number, usually Type 8 or Type 3. <a href="/enneagram-corner/enneagram-types-and-career-choices">Ours</a> lists CEO among the best jobs for an Eight.</p>

One 2026 statistics roundup that ranks for this exact question goes further and states "CEOs 30% Type 3." It names no study behind the number.

We can check part of this. 9takes has published Enneagram profiles of 451 public figures, and 80 of them sit in our [tech, founders and business category](/personality-analysis/categories/tech-business). We sorted those 80 by what they actually do for a living and counted again.

Among the people who built or ran a company, the most common type is the one least likely to be the loudest voice in the meeting.

---

## Who we counted, and who we left out

Our business category is broad on purpose. It holds Jeff Bezos. It also holds Taylor Swift, who runs a very large business, and Ryan Reynolds, who sold a gin brand and a phone company. Counting all 80 as "CEOs" would answer a different question.

So we split them into five groups by primary public role, the thing each person is mainly known for:

<div class="scroll-table">

| Group             | What puts someone here                                                   | Profiles | Most common type                |
| ----------------- | ------------------------------------------------------------------------ | -------: | ------------------------------- |
| Founder-CEOs      | Built the company they ran, from scratch or by assembling it             |       31 | Type 5 (13, 42%)                |
| Hired CEOs        | Ran a company someone else founded                                       |        5 | No repeats: Types 1, 5, 6, 8, 9 |
| Creator-founders  | Founded and ran a company, now best known for a show, podcast or channel |       10 | Type 3 (6, 60%)                 |
| Investors         | Main job is backing or buying other companies                            |       15 | Type 6 (6, 40%)                 |
| Business-adjacent | Business is a sideline to fame that came from somewhere else             |       19 | Type 3 (7, 37%)                 |

</div>

The first three groups make up our CEO set: **46 people who built or ran a company.** Investors and the business-adjacent group get their own sections below.

A few founder-CEOs never held the CEO title itself. Sergey Brin led Google as co-founder and president, James Dyson runs his company as owner, chairman and chief engineer, and Palmer Luckey founded Oculus and co-founded Anduril without being CEO of either. We kept them because each built the company and was its defining leader. Every name and its group is in [the full roster](#the-full-roster) at the end, so you can move anyone you'd file differently and recount.

---

## Type 5 leads among the people who run companies

Here is the CEO set by type, against the whole 451-profile corpus (the same baseline our [corpus stats page](/corpus-stats) uses):

<div class="scroll-table">

| Enneagram type  | CEOs (n=46) | Share | Whole corpus | Difference |
| --------------- | ----------: | ----: | -----------: | ---------: |
| 5 Investigator  |          14 | 30.4% |         8.4% |  +22.0 pts |
| 3 Achiever      |          11 | 23.9% |        18.0% |   +6.0 pts |
| 8 Challenger    |           6 | 13.0% |        10.6% |   +2.4 pts |
| 7 Enthusiast    |           5 | 10.9% |        13.8% |   -2.9 pts |
| 1 Reformer      |           3 |  6.5% |         6.4% |   +0.1 pts |
| 4 Individualist |           3 |  6.5% |        14.4% |   -7.9 pts |
| 6 Loyalist      |           2 |  4.3% |        12.0% |   -7.6 pts |
| 9 Peacemaker    |           2 |  4.3% |        10.0% |   -5.6 pts |
| 2 Helper        |           0 |  0.0% |         6.4% |   -6.4 pts |

</div>

Fives are the outlier. If these 46 had been typed at the corpus's own rates, you'd expect about 4 Fives. There are 14. A simple binomial check puts the odds of 14 or more turning up by chance at well under 1 in 10,000.

Threes are a different story. You'd expect about 8 and there are 11. [Type 3](/enneagram-corner/enneagram-type-3) is already the most common type across our whole corpus, so a pile of Threes in any famous group is close to the default. Among CEOs, the Three count runs only a little above it.

The gap widens when you narrow the set. Count only the 31 founder-CEOs and Fives are 13 of them (42%). Threes drop to 5 (16%), slightly below their sitewide share.

Two smaller numbers deserve a look. Eights, the boardroom stereotype, come in at 6 of 46, barely above their sitewide rate. And not one of the 46 types as a Two.

---

## Who the CEOs are, type by type

Every name links to a full 9takes profile with the evidence behind the typing.

### Type 5: the founders who went into the problem first (14)

[Bill Gates](/personality-analysis/bill-gates) (Microsoft), [Mark Zuckerberg](/personality-analysis/mark-zuckerberg) (Meta), [Larry Page](/personality-analysis/larry-page) and [Sergey Brin](/personality-analysis/sergey-brin) (Google), [Elon Musk](/personality-analysis/elon-musk) (Tesla, SpaceX), [Jack Dorsey](/personality-analysis/jack-dorsey) (Twitter, Block), [Satya Nadella](/personality-analysis/satya-nadella) (Microsoft), [Dario Amodei](/personality-analysis/dario-amodei) (Anthropic), [Demis Hassabis](/personality-analysis/demis-hassabis) (DeepMind), [Liang Wenfeng](/personality-analysis/liang-wenfeng) (DeepSeek), [Yang Zhilin](/personality-analysis/yang-zhilin) (Moonshot AI), [David Friedberg](/personality-analysis/david-friedberg) (The Climate Corporation), [John D. Rockefeller](/personality-analysis/john-d-rockefeller) (Standard Oil) and [Sam Bankman-Fried](/personality-analysis/sam-bankman-fried) (FTX).

Read these profiles side by side and one move repeats: retreat into a hard problem until you understand it better than anyone, then build the company around the answer. Our Gates profile turns on his fear of his brain going dark, which worries him more than losing the fortune. Hassabis walked away from tournament chess, then the games industry, then the Google DeepMind CEO title at 50.

The column also holds the corpus's best-known fraud. A [Type 5](/enneagram-corner/enneagram-type-5) pattern describes where attention goes. It says nothing about whether the person uses it well.

### Type 3: the founders who keep score in public (11)

Five founder-CEOs: [Brian Chesky](/personality-analysis/brian-chesky) (Airbnb), [Bernard Arnault](/personality-analysis/bernard-arnault) (LVMH), [Alexandr Wang](/personality-analysis/alexandr-wang) (Scale AI), [Adam Neumann](/personality-analysis/adam-neumann) (WeWork) and [Elizabeth Holmes](/personality-analysis/elizabeth-holmes) (Theranos). Plus six creator-founders: [Gary Vaynerchuk](/personality-analysis/gary-vee) (VaynerMedia), [Alex Hormozi](/personality-analysis/alex-hormozi) and [Leila Hormozi](/personality-analysis/leila-hormozi) (Acquisition.com), [Patrick Bet-David](/personality-analysis/patrick-bet-david) (PHP Agency, Valuetainment), [Steven Bartlett](/personality-analysis/steven-bartlett) (Social Chain) and [Jordi Hays](/personality-analysis/jordi-hays) (TBPN).

The Three pattern runs on visible proof. Chesky has called the stretch around Airbnb's $100 billion IPO one of the saddest periods of his life, and our profile reads that as the Three's trap: the win arrives, and the feeling it promised doesn't come with it. Neumann and Holmes also anchor our [fallen founders analysis](/pop-culture/fallen-founders-enneagram-analysis), alongside Bankman-Fried.

### Type 8: the boardroom stereotype, at roughly its normal rate (6)

[Jeff Bezos](/personality-analysis/jeff-bezos) (Amazon), [Reed Hastings](/personality-analysis/reed-hastings) (Netflix), [Travis Kalanick](/personality-analysis/travis-kalanick) (Uber), [Rupert Murdoch](/personality-analysis/rupert-murdoch) (News Corp), [Jamie Dimon](/personality-analysis/jamie-dimon) (JPMorgan Chase) and [Sam Parr](/personality-analysis/sam-parr) (The Hustle).

These six fit the picture people carry around. Bezos forwarded customer complaints to his executives with a single character, "?", and let the silence do the rest. Dimon built a career on the fortress balance sheet.

But six of 46 is 13%, close to the 10.6% that Eights hold across the corpus. Outside business, our Eights are comedians, rappers, fighters and civil-rights leaders. The stereotype is right about how Eights lead and wrong about how often the leader is an Eight.

### Type 7: founders who sell and start again (5)

[Palmer Luckey](/personality-analysis/palmer-luckey) (Oculus, Anduril), [John McAfee](/personality-analysis/john-mcafee) (McAfee), and three creator-founders: [Shaan Puri](/personality-analysis/shaan-puri) (My First Million), [Alex Lieberman](/personality-analysis/alex-lieberman) (Morning Brew) and [John Coogan](/personality-analysis/john-coogan) (Soylent, TBPN). Our Lieberman profile starts after he sold Morning Brew at 28 and felt worse, not better.

### The rest: Ones, Fours, Sixes, Nines and no Twos (10)

- **Type 1 (3):** [Steve Jobs](/personality-analysis/steve-jobs) and [Tim Cook](/personality-analysis/tim-cook) (Apple), [James Dyson](/personality-analysis/james-dyson) (Dyson). Cook famously called inventory "fundamentally evil."
- **Type 4 (3):** [Sam Altman](/personality-analysis/sam-altman) (OpenAI), [Alex Karp](/personality-analysis/alex-karp) (Palantir) and [Bryan Johnson](/personality-analysis/bryan-johnson) (Braintree). All three profiles center on someone who never felt like he fit the room he was running.
- **Type 6 (2):** [Jensen Huang](/personality-analysis/jensen-huang) (Nvidia), who still talks about Nvidia as if it were 30 days from going out of business, and [John Ternus](/personality-analysis/john-ternus), Apple's CEO since September 1, 2026.
- **Type 9 (2):** [Sundar Pichai](/personality-analysis/sundar-pichai) (Google) and [Mira Murati](/personality-analysis/mira-murati) (Thinking Machines Lab, formerly OpenAI's CTO).
- **Type 2 (0):** No one. The sitewide rate predicts about three. Across the whole 80-profile category there's a single Two, [Simon Sinek](/personality-analysis/simon-sinek), who is known for writing and speaking about leadership.

---

## Where Type 3 wins: business with a microphone

Here's how a "most CEOs are Threes" answer can come out of the same data. Look at the two groups where business and audience overlap:

- **Creator-founders:** 6 of 10 are Threes. None are Fives.
- **Business-adjacent:** 7 of 19 are Threes, including [Taylor Swift](/personality-analysis/taylor-swift), [Kris Jenner](/personality-analysis/kris-jenner), [Tony Robbins](/personality-analysis/tony-robbins) and [Tyler Perry](/personality-analysis/tyler-perry).

Put everyone back together and you get our full category of 80: Threes at 20 (25.0%), Fives at 19 (23.8%). Count broadly and Threes win by one. Count the 46 who built or ran a company and Fives win by three. Leave out the creator-founders and Fives win 14 to 5.

Two readings fit, and they can both be true. Threes who build companies may be more likely to build an audience too, because visible success is the reward the type chases. Or our typing reads a polished public persona as Type 3, and a weekly show produces a lot of polished public persona. We can't separate the two from inside our own data.

---

## Investors lean Type 6

The 15 investors split another way. Six of them are Sixes: [Peter Thiel](/personality-analysis/peter-thiel), [David Sacks](/personality-analysis/david-sacks), [Ben Horowitz](/personality-analysis/ben-horowitz), [Garry Tan](/personality-analysis/garry-tan), [Joe Lonsdale](/personality-analysis/joe-lonsdale) and [Dalton Caldwell](/personality-analysis/dalton-caldwell). That's 40%, against 12% sitewide. Three more are Fives ([Warren Buffett](/personality-analysis/warren-buffett), [Ray Dalio](/personality-analysis/ray-dalio), [Marc Andreessen](/personality-analysis/marc-andreessen)) and three are Sevens ([Reid Hoffman](/personality-analysis/reid-hoffman), [Paul Graham](/personality-analysis/paul-graham), [Cathie Wood](/personality-analysis/cathie-wood)).

One hypothesis: an investor's whole job is asking what breaks first, and that's the Six's native question. Our Thiel profile opens on the parachute he bought after 9/11. Horowitz wrote the book on the "wartime CEO."

A caution before you repeat it: this cluster is also a social network. Thiel, Sacks and Lonsdale came up through PayPal and Palantir. Tan runs Y Combinator, where Caldwell is a partner. If our writers read one circle a certain way, the circle can show up in the numbers as a type.

---

## Hired CEOs: five people, five types

The smallest group can't carry a pattern, but it's worth a glance. Our five hired CEOs are five different types: Tim Cook (1), Satya Nadella (5), John Ternus (6), Jamie Dimon (8) and Sundar Pichai (9). No Threes.

That spread fits the argument in our [founders vs. stewards analysis](/pop-culture/tech-titans-founders-vs-stewards): boards tend to pick the successor whose type covers the founder's blind spot. If that's right, the hired-CEO chair won't favor one type the way the founder's chair seems to.

---

## What the pattern might mean

Treat this section as hypotheses. The Enneagram sorts people into nine clusters that our typing assumes from the start, and everything here is a pattern inside one editorial dataset.

**The door into the job is a technical problem.** 26 of our 31 founder-CEOs built tech companies, and most of them started as programmers or researchers. Gates and Zuckerberg started as programmers. Page and Brin built a ranking algorithm. Amodei and Hassabis came up through AI research. A Five's habit of withdrawing into a problem until they understand it better than anyone is close to a job description for a technical founder. The type may select for the first job, with the CEO title arriving later.

**Much of the job happens alone.** Strategy memos, models, product reviews and long stretches of reading are CEO work too, and that's where Fives already like to be. Dorsey, in our [tech leadership analysis](/pop-culture/tech-titans-leadership-styles), led largely through absence.

**Eights don't need the title.** Eights are spread across our whole corpus, and business is one arena among many for them. That's why their CEO share looks ordinary even though the Eights who do run companies are impossible to miss.

For how each type tends to lead once they're in the chair, our [guide to Enneagram leadership](/enneagram-corner/enneagram-leadership) covers the strengths and the blind spots type by type.

---

## What this data can't tell you

**Famous CEOs aren't CEOs.** Most CEOs run a dental practice, a regional trucking firm or a 12-person agency. None of them are in here. Our set is people famous enough for readers to search, which filters for giant companies, dramatic stories and, lately, AI.

**We chose who to profile, and we chose a lot of tech.** Seven of the 46 are best known for AI companies: Altman, Amodei, Hassabis, Liang, Murati, Wang and Yang. Drop them and Fives and Threes tie at 10 each. Fives are still three times their sitewide share without them, but "most common" goes from a narrow win to a shared one.

**These are our typings, not test results.** Nobody here took a test for us. Each profile is 9takes' reading of the public record: interviews, decisions, writing. If our writers tend to read privacy and analytic distance as Type 5, engineers will come out as Fives, and we can't rule that out from inside our own numbers. The wider debate about what typing can and can't support is in our look at [the strongest criticisms of the Enneagram](/enneagram-corner/enneagram-criticisms).

**The groups are judgment calls.** Vivek Ramaswamy founded and ran Roivant. Jared Kushner ran his family's real-estate company. Both are Threes, and we filed both under business-adjacent because politics now dominates their public record. Move them into the CEO set and Fives lead by one, 14 to 13.

**Small numbers move.** With 46 people, one retyping shifts a share by about two points. The Five surplus is big enough to survive a few retypings. The gap between Fives and Threes isn't.

<InsightBox tone="info" title="The one-sentence version">
Among the famous company builders 9takes has profiled, Fives are the clear outlier and Threes are the common default; whether Fives are also the single most common type depends on a handful of judgment calls you can check in the roster below.
</InsightBox>

The same caution applies to every Enneagram percentage you'll see quoted. We walk through why the big charts disagree in [how common each Enneagram type is](/enneagram-corner/how-common-is-each-enneagram-type), and our [musicians count](/pop-culture/what-enneagram-type-are-most-musicians) runs the same kind of test on a very different crowd.

---

## How to type a CEO from the outside

The job gets in the way. Every CEO has to make calls and speak in public, so those behaviors tell you little. Look at what the job doesn't force:

1. **Where do they go when nothing is scheduled?** Into a problem, in front of an audience, into a fight, or around the building smoothing things over?
2. **What does a win do to them?** Some go flat after the big exit. Some go straight back to the work. Some go looking for the next opponent.
3. **What do they guard?** Time and privacy, reputation, control, or a safety margin nobody else thinks they need.

Then commit. Pick one CEO you've watched up close, a boss or a founder you follow, and write down a type plus the one behavior that convinced you. Only then open their profile, or ask someone who worked for them, and compare.

Committing first is the rule behind every question on 9takes: [answer before the crowd](/questions), so the crowd's take doesn't quietly become yours.

---

## The full roster

Data pulled October 7, 2026, from the 451 published profiles on 9takes. The business category is every profile tagged tech, entrepreneur or business, the same rule our [corpus stats](/corpus-stats) use, which gives 80 people.

**Founder-CEOs (31)**

- Type 1: James Dyson, Steve Jobs
- Type 3: Adam Neumann, Alexandr Wang, Bernard Arnault, Brian Chesky, Elizabeth Holmes
- Type 4: Alex Karp, Bryan Johnson, Sam Altman
- Type 5: Bill Gates, Dario Amodei, David Friedberg, Demis Hassabis, Elon Musk, Jack Dorsey, John D. Rockefeller, Larry Page, Liang Wenfeng, Mark Zuckerberg, Sam Bankman-Fried, Sergey Brin, Yang Zhilin
- Type 6: Jensen Huang
- Type 7: John McAfee, Palmer Luckey
- Type 8: Jeff Bezos, Reed Hastings, Rupert Murdoch, Travis Kalanick
- Type 9: Mira Murati

**Hired CEOs (5)**

- Type 1: Tim Cook
- Type 5: Satya Nadella
- Type 6: John Ternus
- Type 8: Jamie Dimon
- Type 9: Sundar Pichai

**Creator-founders (10)**

- Type 3: Alex Hormozi, Gary Vaynerchuk, Jordi Hays, Leila Hormozi, Patrick Bet-David, Steven Bartlett
- Type 7: Alex Lieberman, John Coogan, Shaan Puri
- Type 8: Sam Parr

**Investors (15)**

- Type 1: Michael Seibel
- Type 3: Chamath Palihapitiya, Jason Calacanis
- Type 5: Marc Andreessen, Ray Dalio, Warren Buffett
- Type 6: Ben Horowitz, Dalton Caldwell, David Sacks, Garry Tan, Joe Lonsdale, Peter Thiel
- Type 7: Cathie Wood, Paul Graham, Reid Hoffman

**Business-adjacent (19)**

- Type 1: Anna Wintour, Ryan Holiday
- Type 2: Simon Sinek
- Type 3: David Beckham, Jared Kushner, Kris Jenner, Taylor Swift, Tony Robbins, Tyler Perry, Vivek Ramaswamy
- Type 4: [Emma Chamberlain](/personality-analysis/emma-chamberlain)
- Type 5: Lex Fridman, Tyler Cowen
- Type 7: Kate Hudson, Kyle Forgeard, Ryan Reynolds
- Type 8: [Kara Swisher](/personality-analysis/kara-swisher), Scott Galloway
- Type 9: Nate Bargatze

---

## Frequently asked questions

### What Enneagram type are most CEOs?

In 9takes' data, Type 5. Of 46 profiled public figures who built or ran a company, 14 type as Fives (30.4%), against 8.4% across the site's 451 profiles. Type 3 is second with 11 (23.9%). These are 9takes' typings of famous leaders from the public record, not test results from CEOs in general.

### Are most CEOs Type 3 or Type 8?

Neither, in this data, though Type 3 comes close. Threes are the second most common type among the 46 company leaders, and they edge out Fives 20 to 19 across all 80 business-category profiles because creators and celebrities with companies skew Three. Eights are 6 of 46 (13.0%), barely above their 10.6% sitewide share.

### What Enneagram type are most founders?

Type 5. Of the 31 founder-CEOs 9takes has profiled, 13 are Fives (42%), including Bill Gates, Mark Zuckerberg, Larry Page and Elon Musk. Type 3 is next with 5. Most of these founders built tech companies, which likely drives part of the pattern.

### Why are so many tech CEOs Type 5?

One hypothesis: most tech founders start as engineers or researchers, and the Five's habit of withdrawing into a hard problem until they understand it better than anyone fits that first job. The CEO title may follow the engineering. The data shows a cluster in 9takes' editorial typings. It can't prove the cause.

### What Enneagram type is least common among CEOs?

Type 2. None of the 46 company leaders in 9takes' data type as Twos, where the sitewide rate would predict about three. Sixes and Nines are next, with two each. At this sample size, those small counts are suggestive at most.

### Does this mean Type 5s make better CEOs?

No. The data counts who 9takes has profiled. It says nothing about who leads well. The Five column includes Bill Gates and Satya Nadella, and it also includes Sam Bankman-Fried. A type describes where someone's attention goes, not how well they use it.
