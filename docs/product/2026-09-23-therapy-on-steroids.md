<!-- docs/product/2026-09-23-therapy-on-steroids.md -->

# Therapy on Steroids: Beta Test Idea

**Status:** Idea stage. Captured 2026-09-23, rounds 1–3 of the interview are done, the beta kit is drafted, and the Talk to DJ page is built. DJ is still shaping it.
**Owner:** DJ
**BuildOS mirror:** 9takes › "Therapy on Steroids — Beta Test Idea" (`c695e05a-d0e9-49fb-be9c-808e2423e285`)
**Kin:** [`the-mirror-moment.md`](./the-mirror-moment.md), [`the-chorus-vision.md`](./the-chorus-vision.md), [`../monetization/2026-05-02_decode-a-person-offering.md`](../monetization/2026-05-02_decode-a-person-offering.md)

## The idea, in DJ's words

> One thing I like about the Enneagram is that it's like therapy on steroids, or it's like journaling on steroids. It gives you a framework for the world and allows you to fill in the blanks and do your own therapy.

> I want to ask people questions, see what they say, have it be mirrored back to them, and see where it goes.

> With current therapy, they're very concerned about secrecy. I think that's a problem, and I think it limits the effectiveness of therapy. Also, there are not enough iterations. It costs so much to do a round of therapy, like to do a session, but there's way more value to be had there. I want to have therapy for the common man, and I go deep with this shit.

> This is a big reframe and adjustment for 9takes.

## The pieces

1. **The frame.** The Enneagram gives you a framework, and you fill in the blanks yourself. It works like therapy or journaling, only faster.
2. **The loop.** Ask a question, the person answers, their answer gets mirrored back to them, and you follow where it goes.
3. **The critique of today's therapy.**
   - **Secrecy as shame.** Therapy happens in secret, so going deep feels heavy and shameful. It should feel like leveling up, energizing and something you're proud of. (Clarified in round 1.)
   - **Too few iterations.** Every session costs so much that people get only a few reps, and most of the available value is never reached.
4. **Who it's for.** Therapy for the common man. It goes deep.
5. **The first move.** Turn the `/book-session` coaching waitlist into a **beta user test** of this idea.

## What already exists that this touches

These are facts from the repo, not recommendations.

- **The mirror is already built, one turn deep.** `/api/nine/mirror` takes a give-first answer and reflects its emotional logic back (`generateMirror` in `src/lib/server/nineTakes.ts`), then shows the nine takes. DJ's loop is the multi-turn version of this.
- **The Mirror Moment** ([`the-mirror-moment.md`](./the-mirror-moment.md)) turns the lens onto the reader. Its rule #4 says a good mirror question is "too exposed to answer in public comments." There's no conflict with the secrecy thesis: DJ means "not shameful," not "make it public" (round 1).
- **The beta cohort is 2 people, not 17.** Vetting on 2026-09-23 found that 14 of the 18 `coaching_waitlist` rows are a Nov 2025 signup-bombing bot wave and 2 are DJ test rows. See [`2026-09-23-therapy-beta-kit.md`](./2026-09-23-therapy-beta-kit.md). `/book-session` has had 0 signups since June.
- **"The Decode"** ($150 founding sessions) was proposed 2026-09-18 and is still waiting on DJ's veto. This reframe may replace it.
- **The messaging hierarchy was locked 2026-08-13** ([`../brand/messaging-hierarchy.md`](../brand/messaging-hierarchy.md)). Its personal payoff line, "Stop mistaking someone else's alarm for a defect," is already therapy-shaped. DJ called this a "big reframe," so it's open whether it replaces a level or lives under one.
- **The do-not-write list** (2026-07-15) bans childhood-wound etiology claims, and "do your own therapy" content drifts toward them easily.

## DJ's answers (2026-09-23, round 1)

**Secrecy = therapy's shame problem, not "share everything."**

> Therapy is sort of done in secret, and I'm saying that's a problem with traditional therapy, not that I'm going to be spouting off what everyone does. I want it to be a positive thing, not a negative thing. When people say they're leveling up and they're going through these deep rabbit hole conversations, fleshing out their inner world, that should be a positive, energizing thing, not a heavy, sad, secret, shameful thing. I want them to feel good that they've gone down these paths. I want them to feel like they're stronger.

**Mirroring = DJ, live, in 1-on-1 sessions, with AI assisting.**

**The participant's path:** an email says sessions are open, with a short blurb and a booking link. That leads to a discovery call, then testing, then "go from there." DJ's raw blurb:

> Traditional therapy sucks because it's a shameful thing where people process their trauma and don't get somewhere. We want to flip that. We want to actually make you better, make you understand yourself and others better. We're going to use the Enneagram to help guide us a little bit. My goal at the end of these sessions is for you to feel energized and excited about your life, and I want you to move forward. Yes, we might go over some deep, heavy things... Overall, my goal is to make you a better person, help you become a better person, and talk through whatever you need to talk through.

The worked-up version (email drafts, recon questions, session run sheets, scorecard) is in [`2026-09-23-therapy-beta-kit.md`](./2026-09-23-therapy-beta-kit.md).

## DJ's decisions (2026-09-23, round 2)

- **The beta is free.** In DJ's words: "I'm just seeing if I'm ironing out my process and I'm learning as I go for these free beta people. I want these people to be well served and to do good by them."
- **Recruiting more testers is parked.** Serve the first two well first.
- **No AI tool built into 9takes.** DJ declined the idea of in-product session prep and recap tooling. AI stays DJ's own helper, used off-platform.
- **New thread: voice notes.** In DJ's words: "Maybe there should be a thing for people to leave voice notes to me so that I can process what they're saying and get back to them." This is still open and gets interviewed next. For reference, 9takes already has `VoiceRecorder.svelte` (2-min cap, sends speech to `/api/transcribe`, returns text only, and doesn't store audio). It's used on question answers and the blog StrategicQuestion widget.

## DJ's decisions (2026-09-23, round 3): voice notes → "Talk to DJ"

DJ's vision, in DJ's words: "I should draft up a thing about myself and give some general prompts or guidance for things people can ask me about. I would love for people to just drop me a note, either anonymously or by leaving an email... people can leave just text, or they can leave a voice note, and it gets transcribed... I would respond either with my own voice note or my own text... Maybe when they sign up for the coaching thing, people can leave a voice note... Maybe that's the primary call to action, and the rest of it is filling in their details."

- **Page flow: note first, details after** (picked from 3 mockups). `/book-session` becomes "Talk to DJ".
- **Replies are private only for now** (email). Public answers are a later option.
- Built the same day. See the beta kit, section 7.

## Open questions (still open)

- What's the session rhythm: weekly, biweekly? How many sessions in the beta?
- **Public answers:** later, answer some notes publicly (a feed on the page, or as 9takes questions)?
- What would you need to see to say the beta worked?
- **Naming.** "Therapy" is the honest pitch, but it's a regulated word in many states when an unlicensed person offers it. Check that before it goes on a public page.
- Is it a 9takes product feature, a service DJ runs, or both?

## Guardrails to design around (not decisions)

- **Crisis moments.** A deep, repeated practice will eventually reach someone in real crisis, so the beta needs a plan for that before the first session.
- **Consent.** Participants say yes to AI being used for prep and notes, and their words never land in the public repo.

## Next

Rounds 1–3 of the interview are done. The beta kit is drafted, and the Talk to DJ page is built (not deployed). Next: apply the `talk_notes` migration, deploy, and test end to end. Then DJ marks up the kit, sets up the booking page, and sends the 2 invites.
