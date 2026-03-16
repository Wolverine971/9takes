<!-- docs/marketing/WELCOME_SEQUENCE_STRATEGY.md -->

# 9takes Welcome Sequence Strategy

_Content and positioning for the post-registration welcome sequence._

**Status:** Working v1 content direction  
**Date:** 2026-03-16  
**Audience:** Newly registered 9takes users  
**Trigger:** Successful account registration  
**Companion doc:** `docs/development/welcome-email-sequence-spec.md`

---

## What This Doc Is

This is the **content strategy and messaging doc** for the welcome sequence.

It is not the source of truth for implementation details like cron design, database shape, or APIs. Those live in `docs/development/welcome-email-sequence-spec.md`.

The older 7-email version was useful brainstorming. This v1 doc narrows that thinking to the actual launch sequence.

---

## Locked Direction

- This sequence is for **real user registrations on 9takes**.
- It is **not** the legacy waitlist re-engagement sequence.
- Historical waitlist membership does not matter here. If someone registers, they get the welcome sequence.
- Delivery runs through the **existing Gmail-based email system**.
- Launch with **4 emails over 10 days**.
- The job of the sequence is not “educate endlessly.” It is:
  - orient the user
  - prove the value quickly
  - get the first contribution
  - either re-engage or cleanly let them go

---

## The Core Product Problem

9takes has a strong mechanic, but it is not self-explanatory on first use.

Most platforms let you consume first and react second.

9takes asks you to:

1. see a question
2. give your take first
3. unlock other perspectives after

That is the product's edge, but it creates first-session friction.

The welcome sequence has to remove that friction without over-explaining the Enneagram or sounding like onboarding software.

---

## Strategic Bets

### 1. Explain the give-first mechanic immediately

New users should understand that the friction is intentional:

- it protects authentic perspective
- it reduces groupthink
- it sharpens pattern recognition

### 2. Prove value before asking for commitment

The user should feel one concrete “oh, that’s useful” moment early in the sequence.

That is why Email 2 exists.

### 3. Ask for one real contribution, not broad platform exploration

The sequence should push toward a first question or a first comment, not a vague “use the product more.”

### 4. Keep the tone personal, clear, and insight-forward

The voice should feel like:

- warm
- observant
- socially intelligent
- lightly provocative

It should not feel:

- academic
- too inside-baseball on Enneagram jargon
- hypey
- automated in a generic SaaS way

---

## v1 Sequence Shape

| Step | Day | Subject                                                     | Job                                            |
| ---- | --- | ----------------------------------------------------------- | ---------------------------------------------- |
| 1    | 0   | Welcome to 9takes — your authentic perspective matters      | Orient the user and explain give-first         |
| 2    | 2   | She's not "acting cold" — here's what Type 5s actually need | Demonstrate value through pattern recognition  |
| 3    | 5   | Your perspective is missing from this conversation          | Ask for first question or first comment        |
| 4    | 10  | How's your 9takes experience going?                         | Re-engage, invite reply, or allow a clean exit |

Why this version:

- It keeps the sequence tight.
- It preserves the strongest ideas from the original brainstorm.
- It avoids overbuilding before you have activation data.

Deferred ideas from the original 7-email brainstorm:

- the broader “social advantage” email
- the personality-analysis deep dive
- the habit-formation email

Those can come back later if the 4-email version performs.

---

## Email 1: Welcome + Why

**Subject:** Welcome to 9takes — your authentic perspective matters  
**Timing:** Immediately after signup  
**Primary job:** Explain the give-first mechanic and make the first action feel easy

### Draft

Hi {{first_name}},

Welcome to 9takes.

You just joined a place built around one simple idea:

**your honest take matters more when it arrives before everyone else's.**

Most platforms train you to absorb the room first and think second.  
You read the comments, feel the vibe, and your original perspective gets shaped before it ever fully forms.

9takes works the other way around:

- you see a question
- you give your take first
- then you unlock the other perspectives

That friction is intentional.

It helps you notice:

- what you actually think
- where your blind spots are
- how differently other people are interpreting the same situation

**Best first move:**  
[Browse current questions]({{questions_url}}) and answer one before reading the room.

Two minutes is enough.

DJocrates  
9takes.com

P.S. If your first take feels a little vulnerable, that usually means you’re doing it right.

### Why this email works

- It explains the core mechanic immediately.
- It reframes friction as a feature.
- It gives the user one simple next step.

---

## Email 2: Pattern Recognition Demo

**Subject:** She's not "acting cold" — here's what Type 5s actually need  
**Timing:** Day 2  
**Primary job:** Show the payoff of the 9takes lens

### Draft

Hi {{first_name}},

She's not "acting cold."

She may just need processing time before she can engage.

That’s the kind of distinction 9takes is built to surface:

**same situation, different internal logic.**

One person reads silence as rejection.  
Another reads it as caution.  
Another reads it as “I need space to think.”

That difference matters.

It changes how you interpret people.  
It changes how you respond to them.  
It changes how much unnecessary judgment you carry into the interaction.

You do **not** need to know all 9 types for this to be useful.

You just need to remember this:

**people are rarely reacting from the same inner pattern you are.**

Want to see the contrast in action?

[Browse a live question]({{questions_url}}) and compare how different people are reading the same social situation.

DJocrates  
9takes.com

### Why this email works

- It creates an immediate “that explains a lot” moment.
- It demonstrates practical value, not theory.
- It keeps the jargon light enough for a new user.

---

## Email 3: Ask for the First Contribution

**Subject:** Your perspective is missing from this conversation  
**Timing:** Day 5  
**Primary job:** Convert passive reading into first engagement

### Draft

Hi {{first_name}},

By now you’ve seen how 9takes works.

Now the important part:

**we need your take in the mix.**

Not because the platform needs filler.  
Because your perspective notices things other people miss.

That is the whole point of the product:

- different people catch different signals
- different types interpret the same event differently
- the conversation gets smarter when more real perspectives show up

If you’re not sure where to start, pick one:

1. [Ask your own question]({{ask_question_url}})
2. [Comment on a live question]({{questions_url}})
3. [Browse more examples first]({{questions_url}})

You do not need the perfect take.

You just need the honest one.

DJocrates  
9takes.com

P.S. The best 9takes users are not the ones with the most personality theory. They’re the ones willing to contribute one real perspective.

### Why this email works

- It creates a sense of missing contribution.
- It gives a clear behavioral ask.
- It lowers the pressure around being “right.”

---

## Email 4: Check-In

**Subject:** How's your 9takes experience going?  
**Timing:** Day 10  
**Primary job:** Recover confused users, re-engage dormant users, and keep the list clean

### Draft

Hi {{first_name}},

You’ve had some time with 9takes now, so here’s the real question:

**is it clicking yet?**

Usually one of three things is true:

1. You’re getting it.  
   You’ve started noticing how differently people interpret the same situation.

2. You’re interested, but a little unsure how to use it.  
   If that’s you, just reply to this email. I read replies.

3. It’s not landing for you.  
   That’s fine too. Not every tool is for every person.

If you’re in bucket 2, here’s the simplest way to use 9takes:

- find a question that feels real
- answer before reading everyone else
- compare what you saw with what they saw

That one pattern is the whole product.

If you want to give it one more real try:

[Browse current questions]({{questions_url}})

DJocrates  
9takes.com

P.S. If it’s not a fit, no hard feelings. Better a clean unsubscribe than inbox clutter.

### Why this email works

- It acknowledges confusion without sounding defensive.
- It opens a human reply path.
- It gracefully handles users who are not going to convert.

---

## Messaging Rules

### Keep

- concrete social examples
- short paragraphs
- direct CTAs
- warm authority
- “understanding beats judgment” energy

### Avoid

- overusing Enneagram labels too early
- sounding like a productivity tool
- explaining too many product surfaces in one email
- abstract claims without one specific example

---

## Measurement

The sequence should be judged primarily on activation, not vanity engagement.

### Primary metrics

- first question rate within 10 days
- first comment rate within 10 days
- day 7 return rate
- unsubscribe rate

### Secondary metrics

- open rate
- click-through rate
- reply rate on Email 4

---

## Implementation Alignment

- Delivery platform: existing Gmail-based sender
- Trigger: successful registration
- Exit conditions:
  - first successful question
  - first successful comment
  - unsubscribe
- Waitlist sequence remains a separate doc and should not shape v1 welcome enrollment logic

If implementation details conflict with this doc, the development spec wins.

---

## Related Documents

- [Welcome Email Sequence Spec](/Users/djwayne/9takes/docs/development/welcome-email-sequence-spec.md)
- [Waitlist Re-engagement Sequence](/Users/djwayne/9takes/docs/marketing/email-sequence-value-prop.md)
- [Email Management System Spec](/Users/djwayne/9takes/docs/development/email-management-system-spec.md)
