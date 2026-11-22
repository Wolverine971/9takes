---
title: 'Which Enneagram Type Is the Most Successful? Type 3 (but the Richest Are Fives)'
meta_title: 'Which Enneagram Type Is the Most Successful? Type 3, by the Data'
description: 'Type 3 earns the most in an 81,683-person survey and leads our business profiles. At the top of the billionaire list, Fives take over. All 9 types, ranked.'
author: 'DJ Wayne'
date: '2026-11-21'
loc: 'https://9takes.com/enneagram-corner/which-enneagram-type-is-the-most-successful'
lastmod: '2026-11-21'
changefreq: 'monthly'
priority: '0.7'
published: false
type: ['situational']
subtopics: ['ambition', 'leadership']
blog: true
previewHtml: 'Two datasets agree that Type 3 is the most successful Enneagram type on average. Then you look at the ten richest people alive, and five of the seven we have typed are Fives.'
path: src/blog/enneagram/which-enneagram-type-is-the-most-successful.md
article_citations:
  - name: "If You're One of These Enneagram Types, You Are Significantly More Likely to Out-Earn Your Peers"
    author: 'Truity'
    datePublished: '2023-06-26'
    publisher:
      '@type': Organization
      name: 'Truity'
    url: 'https://www.truity.com/blog/if-youre-one-these-enneagram-types-you-are-significantly-more-likely-out-earn-your-peers'
  - name: 'Ranked: The top 10 richest people in the world (November 2026)'
    author: 'Forbes Australia'
    datePublished: '2026-11-03'
    publisher:
      '@type': Organization
      name: 'Forbes Australia'
    url: 'https://www.forbes.com.au/news/billionaires/the-top-10-richest-people-in-the-world-january-2026/'
---

<!--
Keyword target: "which enneagram type is the most successful", "which enneagram makes the most money", "most successful
enneagram type", "richest enneagram type". SERP 2026-11-21: Inc. and Bustle summarize the 2023 Truity income survey; nobody
combines it with typed public figures. Our edge: the corpus (live tokens) + the Forbes top-ten cross-check.

Overlap check: what-enneagram-type-are-most-ceos.md answers "which type runs companies" with a hand-counted, frozen CEO subset
(Type 5 leads among company builders). This page answers a different question (success and money) and links to it for the
founder detail instead of repeating the roster. how-each-enneagram-type-self-sabotages-success.md covers the sabotage side.

Sources fetched 2026-11-21:
- Truity survey page (81,683 adults aged 26 to 45; Type 3 top average income; Type 4 lowest at $54,051; $35,146 gap;
  Threes and Eights 19% Director/Executive vs 10% overall; Fours 15% no current employment vs 8%; Twos and Nines "lower
  income earners"). The page publishes no full nine-type table, so we don't invent one.
- Forbes Australia, top 10 richest as of Nov 1, 2026: Musk, Bezos, Page, Dell, Brin, Zuckerberg, Huang, Ellison, Ballmer,
  Buffett. 9takes profiles 7 of them (not Dell, Ellison, Ballmer). Forbes updates daily; re-check the list before publish.

HERO IMAGE: none yet. Prompt for DJ (run in ChatGPT, then node scripts/blog-image-variants.mjs which-enneagram-type-is-the-most-successful <file>):
Editorial photograph of two life-sized ancient Greek marble statues on a black stage. On the left, an athlete statue stands
on a tall stone victory plinth, chin lifted, one arm raised to an unseen crowd. On the right, half in shadow, a seated
older statue bends over a large stone tablet on his knees, absorbed, ignoring the plinth entirely, a heavy carved chest
of coins at his feet. The important relationship is the visible winner and the quiet one who owns more. Dry matte
weathered stone, irregular pores, worn chisel marks and small edge chips; visibly carved blank eyes and hair. Wide shot,
both figures inside the central half of the frame. One raking light from the upper left on a black background, charcoal
shadows, ash and chalk highlights, neutral grey stone with no warm light. Restrained expressions. No neon, glossy CGI,
floating symbols, gold cracks, text or watermark.
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
      "name": "Which Enneagram type is the most successful?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Type 3. Truity surveyed 81,683 adults aged 26 to 45, and Threes reported the highest average income and were most likely, tied with Eights, to hold a director or executive title. Among the {{corpus.total}} public figures 9takes has typed, Type 3 is the most common type and leads the Business & Money category. Type 8 is the runner-up. Type 4 reported the lowest average income."
      }
    },
    {
      "@type": "Question",
      "name": "Which Enneagram type makes the most money?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "On average, Type 3: Threes reported the highest income in Truity's survey, about $35,000 a year more than Fours. At the very top of the wealth ladder the answer changes. Of the ten richest people on Forbes' November 2026 list, 9takes has profiled seven, and five of those seven are Type 5: Elon Musk, Larry Page, Sergey Brin, Mark Zuckerberg and Warren Buffett."
      }
    },
    {
      "@type": "Question",
      "name": "Which Enneagram type is the least successful?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By income, Type 4. Fours reported the lowest average income in Truity's survey, $54,051 a year, and were more likely than average to report no current employment. But Fours are the most common type among the musicians 9takes has profiled, so by the measure of making art people love, they are among the most successful types there is."
      }
    },
    {
      "@type": "Question",
      "name": "What Enneagram type are most billionaires?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Among the richest people we have typed, Type 5. Five of the seven people from Forbes' November 2026 top ten with 9takes profiles are Fives. Most of them built or backed technology companies, where going deep on one hard problem can compound into enormous equity. It is a small, famous sample, not a study of billionaires in general."
      }
    },
    {
      "@type": "Question",
      "name": "Are Type 3s more successful than Type 8s?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "On average, slightly. Threes reported higher average income than Eights in Truity's survey, and the two types tied at 19% in director or executive roles, against 10% across all types. Eights are the runner-up on almost every measure of success we looked at."
      }
    }
  ]
}
</script>

</svelte:head>

<QuickAnswer question="Which Enneagram type is the most successful?">
<strong>Type 3.</strong> In a Truity survey of 81,683 adults, Threes reported the highest average income and tied with Eights as the most likely to hold an executive title. Among the {{corpus.total}} public figures 9takes has typed, Threes are the most common type ({{corpus.type.3.share}}) and lead our Business & Money category at {{corpus.domain.business.type.3.share}}. <strong>Type 8 is the runner-up. Type 4 reported the lowest income.</strong> One twist: at the very top of the billionaire list, the type that dominates is Five. <!-- corpus-ok: 81,683 is Truity's survey size; corpus figures are live tokens -->
</QuickAnswer>
<!-- corpus-assert: rank.1.type = 3 -->
<!-- corpus-assert: domain.business.top.type = 3 -->

<p class="firstLetter">Two people get the same promotion in the same year. One posts the announcement within the hour, with a photo and a thank-you list. The other forgets to update their LinkedIn for eight months and spends the raise on a better desk chair. Ask anyone which one is "more successful" and they'll point at the first. Check their bank accounts in twenty years and you might point at the second.</p>

That gap is the whole story of this question. "Which Enneagram type is the most successful" and "which Enneagram type makes the most money" sound like one search. The data gives one clear answer for the first and a surprising one for the second.

---

## How we measured "successful"

Success means different things to each type, and we'll get to that. For a pick, we used the things you can count:

1. **Income and job title,** from Truity's 2023 survey of 81,683 adults aged 26 to 45. <!-- corpus-ok: Truity survey figures, not 9takes corpus -->
2. **Who shows up among the famous and the business-famous,** from the {{corpus.total}} public figures we've typed on 9takes, sorted into fields like [Business & Money]({{corpus.domain.business.url}}) and [Tech, Founders & Business]({{corpus.domain.tech-business.url}}).
3. **Who sits at the very top of the wealth ladder,** using Forbes' list of the ten richest people as of November 1, 2026.

The first two agree. The third doesn't, and the disagreement is the most interesting thing on this page.

---

## The pick: Type 3

**The survey.** Truity's survey found that Threes reported the highest average income of the nine types, $35,146 a year more than Fours, the lowest earners. Threes and Eights were each 19% likely to report a director or executive title, against 10% across all types. Only 3% of Threes reported being unemployed, against 8% overall, and 46% said they were "very fulfilled" by their work, against 32% across all types. ([Truity, 2023](https://www.truity.com/blog/if-youre-one-these-enneagram-types-you-are-significantly-more-likely-out-earn-your-peers)) <!-- corpus-ok: Truity survey figures, not 9takes corpus -->

**Our profiles.** Threes are the most common type across all {{corpus.total}} public figures on 9takes, at {{corpus.type.3.share}}. On the [Business & Money shelf]({{corpus.domain.business.url}}), they're {{corpus.domain.business.type.3.share}} of {{corpus.domain.business.total}} profiles, {{corpus.domain.business.type.3.delta}} percentage points above their sitewide share. Among [internet creators]({{corpus.domain.creator-media.url}}), they're {{corpus.domain.creator-media.type.3.share}}. Names include [Taylor Swift](/personality-analysis/taylor-swift), [Bernard Arnault](/personality-analysis/bernard-arnault), [Kris Jenner](/personality-analysis/kris-jenner) and [Alex Hormozi](/personality-analysis/alex-hormozi).

**Why it makes sense.** The Three's core fear is being worthless, and its strategy is to earn worth through visible results. Income and titles are the most visible results there are. Threes read the room for what counts as winning and then go win that, which makes them unusually good at whatever scoreboard is in front of them.

The cost shows up in our profiles too. [Brian Chesky](/personality-analysis/brian-chesky) has called the stretch around Airbnb's IPO one of the saddest periods of his life. That's the Three's trap: the win arrives and the feeling it promised doesn't come with it. Our guide to [how each type sabotages its own success](/enneagram-corner/how-each-enneagram-type-self-sabotages-success) covers that side.

## The runner-up: Type 8

Eights came second on average income in Truity's survey and tied Threes for executive titles. On our [Business & Money shelf]({{corpus.domain.business.url}}) they're {{corpus.domain.business.type.8.share}}, above their sitewide {{corpus.type.8.share}}. [Jeff Bezos](/personality-analysis/jeff-bezos), [Jamie Dimon](/personality-analysis/jamie-dimon) and [Rupert Murdoch](/personality-analysis/rupert-murdoch) are Eights on our site.

The Eight's core fear is being controlled, so it goes after the position where nobody can control it: owner, boss, the one who decides. That lines up with titles and money without the Eight needing applause. Threes want the win seen. Eights want the win to be theirs.

## The twist: the richest people we've typed are Fives

Forbes Australia published its ranking of the ten richest people in the world as of November 1, 2026. We've profiled seven of them:

<div class="scroll-table">

| Rank | Person                                                   | Our typing |
| ---- | -------------------------------------------------------- | ---------- |
| 1    | [Elon Musk](/personality-analysis/elon-musk)             | Type 5     |
| 2    | [Jeff Bezos](/personality-analysis/jeff-bezos)           | Type 8     |
| 3    | [Larry Page](/personality-analysis/larry-page)           | Type 5     |
| 5    | [Sergey Brin](/personality-analysis/sergey-brin)         | Type 5     |
| 6    | [Mark Zuckerberg](/personality-analysis/mark-zuckerberg) | Type 5     |
| 7    | [Jensen Huang](/personality-analysis/jensen-huang)       | Type 6     |
| 10   | [Warren Buffett](/personality-analysis/warren-buffett)   | Type 5     |

</div>

Michael Dell (No. 4), Larry Ellison (No. 8) and Steve Ballmer (No. 9) don't have 9takes profiles yet. Five of the seven we've typed are Fives, and not one is a Three. ([Forbes Australia, November 2026](https://www.forbes.com.au/news/billionaires/the-top-10-richest-people-in-the-world-january-2026/)) <!-- corpus-ok: hand-counted Forbes top ten, not 9takes corpus -->

The same lean shows up across our wider [Tech, Founders & Business]({{corpus.domain.tech-business.url}}) category, where Fives are the most common type at {{corpus.domain.tech-business.type.5.share}}, ahead of Threes at {{corpus.domain.tech-business.type.3.share}}. We broke that down founder by founder in [what Enneagram type most CEOs are](/enneagram-corner/what-enneagram-type-are-most-ceos), so we won't repeat the roster here.
<!-- corpus-assert: domain.tech-business.top.type = 5 -->

**Why the average and the extreme disagree.** Here's our read. The Three optimizes for success that's visible now: the salary, the title, the audience. That's how you win an average. The Five's core fear is being incapable or overwhelmed, so it retreats into one hard problem until it understands it better than anyone. Most of the time that pays like an ordinary job. Occasionally the problem is search, software or capital allocation, and the depth compounds into equity worth hundreds of billions. Averages reward the Three's strategy. The extreme tail rewards the Five's.

A caution: seven famous people is a tiny sample, and a Five who gets this rich gets profiled. Treat it as a striking pattern in a small group, not a law.

## The least successful, by money: Type 4

Fours reported the lowest average income in Truity's survey, $54,051 a year, and 15% reported no current employment, against 8% overall. On our Business & Money shelf, they're {{corpus.domain.business.type.4.share}}. <!-- corpus-ok: Truity survey figures alongside a live token -->

Then look at a different scoreboard. Fours are the most common type among the [musicians we've profiled]({{corpus.domain.music.url}}), at {{corpus.domain.music.type.4.share}}. The Four's core fear is having no identity, so it chases work that feels true to itself, and the market for that work pays a few people a fortune and most people very little. By income, Fours rank last. By making something people play at their weddings and funerals, they might rank first.
<!-- corpus-assert: domain.music.top.type = 4 -->

Twos and Nines also landed among Truity's "lower income earners," and Twos are the rarest type in our corpus ({{corpus.rank.9.name}}, at {{corpus.rank.9.share}}). Still, [Oprah Winfrey](/personality-analysis/oprah-winfrey) and [Dolly Parton](/personality-analysis/dolly-parton) are Twos on our site. A Two's success tends to arrive through other people, which makes it harder to count and easier to underrate.
<!-- corpus-assert: rank.9.type = 2 -->

---

## The nine takes: what success means to each type

Every type is chasing something. Each one's version of success quiets its specific alarm, and each one's version of failure sets it off.

### Type 1: Success is doing it right

**The alarm:** being wrong or corrupt. Ones measure success by whether the work meets the standard, not by who noticed. [Tim Cook](/personality-analysis/tim-cook) once called inventory "fundamentally evil," which is a One describing a supply chain in moral terms. Ones do well wherever precision pays and burn out where it doesn't.

### Type 2: Success is being needed

**The alarm:** being unwanted. Twos succeed through relationships, and their wins often show up on someone else's résumé. [Oprah Winfrey](/personality-analysis/oprah-winfrey) built an empire on making other people feel seen. The risk is a career spent building everyone's success but their own.

### Type 3: Success is the win, seen

**The alarm:** being worthless without results. Covered above. The Three is the type most likely to hit the target and the most likely to wonder afterward why it doesn't feel like more.

### Type 4: Success is being true to yourself

**The alarm:** being ordinary. Fours will turn down the safer, better-paid path to do the work that feels like theirs. [Sam Altman](/personality-analysis/sam-altman), whom we type as a Four, runs one of the most valuable companies in the world, which is a useful reminder that the low average isn't a ceiling.

### Type 5: Success is mastery and independence

**The alarm:** being incapable or drained. Fives want enough resources to never depend on anyone, and they get there by knowing one thing deeply. Covered above: that's how Fives end up at the top of the Forbes list.

### Type 6: Success is security

**The alarm:** being left without support. Sixes build backup plans and safety margins. [Jensen Huang](/personality-analysis/jensen-huang), seventh on Forbes' November list, still talks about Nvidia as if it were 30 days from going out of business. That fear, aimed well, makes a Six the person who sees the crash coming. On our Business & Money shelf, Sixes are the least represented type, at {{corpus.domain.business.type.6.share}}, which may say more about who gets famous for business than about who succeeds at it.
<!-- corpus-assert: domain.business.under.type = 6 -->

### Type 7: Success is freedom and options

**The alarm:** being trapped. Sevens start things, sell them and start again. They're the most common type in our [comedy]({{corpus.domain.comedy.url}}) category, at {{corpus.domain.comedy.type.7.share}}, and second on the Business & Money shelf. [Reid Hoffman](/personality-analysis/reid-hoffman) is a Seven on our site. The risk is leaving before the compounding starts.
<!-- corpus-assert: domain.comedy.top.type = 7 -->
<!-- corpus-assert: domain.business.rank.2.type = 7 -->

### Type 8: Success is control

**The alarm:** being controlled. Covered above. Eights want to own the outcome, and they're the runner-up on almost every measure we checked.

### Type 9: Success is peace

**The alarm:** conflict and separation. Nines often succeed by being the person everyone can work with. [Sundar Pichai](/personality-analysis/sundar-pichai), a Nine on our site, built his path to Google's top job by accumulating consensus rather than fighting for it, as our profile reads it. Nines are the most over-represented type in our [film and TV]({{corpus.domain.film-tv.url}}) category. The risk is a career that drifts toward other people's priorities.
<!-- corpus-assert: domain.film-tv.top.type = 9 -->

---

## The honest "it's complicated"

Every number on this page has limits. Truity's types come from Truity's own test, answered by people who chose to take it, and Truity hasn't published its full method or a nine-type income table. Our types are 9takes' reads of the public record, not test results, and fame is its own filter: we profile people famous enough to be searched, and the Three's polished public persona may get typed as Three more easily. Field matters too. Fours cluster in the arts and Fives in tech, and those fields pay differently for reasons that have nothing to do with personality.

None of that flips the pick. On average income, on executive titles and on who shows up among the business-famous, Type 3 comes out on top. If you mean the biggest fortunes on earth, look at the Fives.

<InsightBox tone="info" title="The short version">
Threes win the average: highest income, the most executive titles (tied with Eights), most common among the famous. Eights come second. Fours earn the least on average and lead our musicians. And at the very top of the wealth ladder, the type you see most is the quiet Five.
</InsightBox>

For which work fits your type rather than which type wins, see [Enneagram types and career choices](/enneagram-corner/enneagram-types-and-career-choices). For how each type leads once it gets there, our [guide to Enneagram leadership](/enneagram-corner/enneagram-leadership) goes type by type.

---

## Sources

- Truity, [If You're One of These Enneagram Types, You Are Significantly More Likely to Out-Earn Your Peers](https://www.truity.com/blog/if-youre-one-these-enneagram-types-you-are-significantly-more-likely-out-earn-your-peers) (June 26, 2023; survey of 81,683 adults aged 26 to 45). <!-- corpus-ok: Truity survey figure -->
- Forbes Australia, [Ranked: The top 10 richest people in the world (November 2026)](https://www.forbes.com.au/news/billionaires/the-top-10-richest-people-in-the-world-january-2026/) (published November 3, 2026; figures as of November 1).
- 9takes, [corpus stats](/corpus-stats) ({{corpus.total}} published profiles, regenerated on every deploy; figures here as of {{corpus.as-of}}).

---

## Your turn

We made the call. You're the data.

**Think we got your type wrong here? Say so in the question below; we revise these pages from what readers tell us.**

Answer this before you read anyone else's take:

**What's your Enneagram type, and what does "successful" actually mean to you: money, recognition, freedom, or something else?**

<!--
StrategicQuestion wiring (for DJ, once the DB question exists; no matching row in `questions` as of 2026-11-21):
1. Create the question on 9takes with the exact text above. Note its numeric id and its url slug (questions.url).
2. Add to the frontmatter:  strategic_question_url: '<questions.url>'
   (src/routes/enneagram-corner/[slug]/+page.server.ts reads this field to record gate_shown impressions for the funnel).
3. Add this line to the script block at the top:  import StrategicQuestion from '$lib/components/blog/StrategicQuestion.svelte';
4. Replace the bold question line above with:
   <StrategicQuestion question="What's your Enneagram type, and what does 'successful' actually mean to you: money, recognition, freedom, or something else?" questionId={ID} questionUrl="<questions.url>" blogSlug="which-enneagram-type-is-the-most-successful" />
   Optional: campaign="superlatives" (the default campaign is 'wave1-masking').
Keep the "Answer this before you read anyone else's take" lead-in; it is the product ritual line.
-->
