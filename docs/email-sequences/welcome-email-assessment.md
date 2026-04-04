<!-- docs/email-sequences/welcome-email-assessment.md -->

# Welcome Email Sequence Assessment

**Date**: 2026-04-03
**Sequence**: `welcome_sequence` (4 emails over ~10 days)
**Trigger**: User registration

**Related files**:

- **Admin tracking page**: [`/admin/welcome-sequence`](../../src/routes/admin/welcome-sequence/+page.svelte) - live delivery metrics, funnel, return visits
- **Email content source**: [`20260316_welcome_email_sequence.sql`](../../supabase/migrations/20260316_welcome_email_sequence.sql) - original migration with all 4 emails
- **Email 2 update migration**: [`20260403_update_welcome_email_2.sql`](../../supabase/migrations/20260403_update_welcome_email_2.sql) - gender-balanced rewrite
- **Sequence processing logic**: [`src/lib/server/emailSequences.ts`](../../src/lib/server/emailSequences.ts)
- **Template rendering**: [`src/lib/email/sequences.ts`](../../src/lib/email/sequences.ts)
- **Index**: [README.md](./README.md)

---

## Sequence Overview

| Step | Subject                                                | Delay     | Purpose                      |
| ---- | ------------------------------------------------------ | --------- | ---------------------------- |
| 1    | Welcome to 9takes - your authentic perspective matters | Immediate | Explain the product mechanic |
| 2    | He thinks she's cold. She thinks he's needy.           | +2 days   | Hook via relatable scenario  |
| 3    | Your perspective is missing from this conversation     | +3 days   | Drive first contribution     |
| 4    | How's your 9takes experience going?                    | +5 days   | Re-engage or clean exit      |

---

## Per-Email Analysis

### Email 1: Welcome (Immediate)

**Subject**: _Welcome to 9takes - your authentic perspective matters_

**What works**:

- Clear explanation of the "give-first" mechanic in 3 bullet points
- Good framing: "Most platforms train you to absorb the room first and think second"
- P.S. line is strong: "If your first take feels a little vulnerable, that usually means you are doing it right" - normalizes discomfort
- CTA is low-commitment ("Two minutes is enough")

**Concerns**:

- "DJocrates" sign-off is distinctive but might confuse new users who don't know who that is. Consider adding a one-line descriptor on the first email: "DJocrates, founder of 9takes" or similar.
- The word "friction" is honest but could feel negative. Consider "That sequence" or "That design" instead.

**Verdict**: Solid. This is the strongest email in the sequence.

---

### Email 2: Dual-perspective hook (+2 days)

**Subject**: _He thinks she's cold. She thinks he's needy._

**Status**: REWRITTEN on 2026-04-03. See [migration](../../supabase/migrations/20260403_update_welcome_email_2.sql).

#### What the old version got wrong

The original ("She's not acting cold - here's what Type 5s actually need") had three problems:

1. **One-sided gendered framing** - assumed a male reader decoding a woman's behavior. Alienated women readers, non-straight readers, and anyone who identified AS the "cold" person.
2. **Premature Type 5 reference** - users 2 days in likely don't know Enneagram types yet. Created a "not for me" reaction.
3. **Good insight buried in narrow scenario** - the core message about different inner patterns was strong but wrapped in something that narrowed rather than broadened the audience.

#### What the new version does

The rewrite presents BOTH sides of the misread:

- **His misread**: He sees her go quiet and thinks she's pulling away.
- **Her misread**: She sees him double-text and thinks he's being clingy.
- **The reveal**: Neither is right. Same moment, different filters.

This works because:

- **Both genders see themselves** - guys recognize the first scenario, girls recognize the second
- **No one is the villain** - both sides are shown making the same kind of mistake (projecting their pattern onto someone else)
- **No Enneagram jargon** - the insight stands on its own without requiring type literacy
- **Reinforces the core value prop** - "people are rarely reacting from the same inner pattern you are" lands harder when you've just shown it from two angles

#### Remaining opportunities

- Could add a line inviting the reader to consider which side they relate to more
- Could personalize with `{{enneagram}}` in a future iteration ("As someone who tends to [type-specific pattern]...")

**Verdict**: Much stronger. The dual framing is the right call.

---

### Email 3: "Your perspective is missing" (+3 days)

**Subject**: _Your perspective is missing from this conversation_

**What works**:

- Strong subject line - creates urgency and personal relevance
- Good value prop: "your perspective notices things other people miss"
- Three clear CTAs (ask, comment, browse) with escalating commitment levels
- P.S. is excellent: "The best 9takes users are not the ones with the most personality theory"

**Concerns**:

- "Not because the platform needs filler" is defensive. Remove the negation; lead with the positive: "Because your perspective catches things other people miss."
- The three options could be more visually distinct. Right now "Comment on a live question" and "Browse more examples first" both link to the same URL (`{{questions_url}}`), which might feel like a trick when they click.

**Verdict**: Strong email. Minor tweaks only.

---

### Email 4: Check-in (+5 days)

**Subject**: _How's your 9takes experience going?_

**What works**:

- The three-bucket framework ("getting it / unsure / not for you") is smart - it gives the user permission to self-sort without guilt
- Inviting replies is good for engagement and feedback
- "That one pattern is the whole product" is a great clarifying line
- Clean unsubscribe P.S. shows respect for inbox

**Concerns**:

- "Is it clicking yet?" could feel slightly pressuring. Consider "Has anything surprised you yet?" - which reframes the check-in as curiosity rather than evaluation.
- "If you are in bucket 2" uses dry numbering. Consider "If that sounds like you" after the second option instead.

**Verdict**: Good closer. The tone shift to conversational/check-in is appropriate for this stage.

---

## Overall Strategy Assessment

### What's working

1. **Pacing is good**: 0 / +2 / +3 / +5 days is a reasonable cadence - not too aggressive, not too spread out.
2. **Progressive asks**: Watch -> Understand -> Contribute -> Reflect. The commitment ladder is well structured.
3. **Consistent voice**: "DJocrates" persona is direct and unpretentious throughout.
4. **Clear product explanation**: By email 3, a reader should understand what 9takes does and why it's different.
5. **Permission to leave**: Email 4's clean exit option reduces spam complaints and builds trust.

### What needs attention

1. **Email 2 has been fixed** (see above). The dual-perspective rewrite addresses the gendered framing issue. Monitor open/click rates on the [admin tracking page](/admin/welcome-sequence) to confirm improvement.

2. **No personalization by Enneagram type**: You have the user's type from signup. None of the emails use it. Imagine if Email 2 said: "As a Type {{enneagram}}, you probably read silence as [type-specific interpretation]." That would demonstrate the product's value directly.

3. **No social proof**: None of the emails mention how many people are on the platform, example responses, or real interactions. Even a vague "Hundreds of people answered this question last week" would help credibility.

4. **All emails link to the same place**: Every CTA goes to `{{questions_url}}` or `{{ask_question_url}}`. Consider linking to a specific popular question so the user lands on something immediately engaging rather than a list page.

5. **No "what other people said" preview**: The product's magic is seeing different perspectives. The emails TELL you this is valuable but never SHOW it. Including 2-3 anonymized one-line takes from different types on the same question would demonstrate the value instantly.

### Remaining priority fixes (ordered)

1. **Add a perspective preview to Email 2 or 3** - Show, don't just tell. Include 2-3 real (anonymized) takes.
2. **Link to a specific question** instead of the questions list in at least one email.
3. **Add one line of social proof** to Email 3 ("Join X people who've already shared their take").
4. **Consider type-personalized content** in Email 2 - even a single sentence using `{{enneagram}}` would be powerful.

---

## Tone and Language Notes

### Strengths

- **Conversational without being sloppy**: The writing reads like a real person, not a marketing template.
- **Confident assertions**: "That friction is intentional" / "That one pattern is the whole product" - these land well.
- **Short paragraphs**: Every email is scannable. Good for mobile.

### Watch for

- **"You do not" vs "you don't"**: The emails inconsistently use formal contractions. Pick one style. The brand voice (tactically direct, socially savvy) suits contractions.
- **Avoid teaching tone**: "You just need to remember that people are rarely reacting from the same inner pattern you are" - this is slightly lecturing. The best lines in the sequence are the ones that describe, not instruct.
- **"DJocrates" needs context on first appearance**: New users don't know this persona. First email should briefly identify who's writing.
