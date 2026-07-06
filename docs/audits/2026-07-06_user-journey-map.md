<!-- docs/audits/2026-07-06_user-journey-map.md -->
# 9takes User Journey Map

Date: 2026-07-06

Purpose: map where visitors can land, what they see, what the current copy asks them to do, and what each path is supposed to lead toward. This is a current-state audit, not an implementation pass.

Primary conversion goals:

- Contribute: answer a question, comment, reply, sort, subscribe, or otherwise participate.
- Register: create an account so the visitor can keep participating beyond the anonymous first answer.
- Subscribe: join the email list.
- Join coaching waitlist: submit the `/book-session` form.
- Explore: move deeper into the library from SEO/social/search traffic.

Source surfaces reviewed:

- Global shell: `src/routes/+layout.svelte`, `src/lib/components/molecules/Header.svelte`, `src/lib/components/molecules/Footer.svelte`
- Homepage: `src/routes/+page.svelte`
- Questions: `src/routes/questions/+page.svelte`, `src/routes/questions/[slug]/+page.svelte`, `src/lib/components/molecules/Interact.svelte`
- Content hubs and detail pages: `src/routes/personality-analysis`, `src/routes/enneagram-corner`, `src/routes/community`, `src/routes/how-to-guides`, `src/routes/pop-culture`
- Capture surfaces: `src/lib/components/blog/NineChorus.svelte`, `src/lib/components/blog/EnneagramCTASidebar.svelte`, `src/lib/components/molecules/Email-Signup.svelte`, `src/routes/api/signups/+server.ts`
- Auth and coaching: `src/routes/register`, `src/routes/login`, `src/routes/book-session`
- Utility/discovery: `src/routes/search`, `src/routes/about`, `src/routes/corpus-stats`, `src/routes/enneagram-test`

## Executive Read

The site currently has three strong ideas:

1. "Give first, then unlock the room" is clear on home, questions, question detail, and NineChorus.
2. SEO/library pages are deep enough to support organic discovery.
3. Coaching waitlist has a complete destination page with UTM-aware server storage.

The main issue is not lack of CTAs. It is path continuity. Visitors can answer, read, search, subscribe, register, or join a waitlist, but the transitions between those states are uneven. The biggest leaks are:

- The "Start the Enneagram test" copy promises a test, but `/enneagram-test` redirects to `/questions`.
- Anonymous users can give one answer, but the next account prompt is mostly implicit or toast-driven.
- Login/register do not preserve the user's original intent or return destination.
- The highest-intent content route, personality-analysis detail, drives strongly into NineChorus but does not mount newsletter or coaching capture.
- Newsletter signups attach first-touch metadata, but the form payload does not carry explicit per-CTA source labels.

## Global Navigation

| Surface                  | Entry point        | Content seen                                                             | CTA/copy                                                                                                            | Intended lead           | Notes                                                                                              |
| ------------------------ | ------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| Desktop header           | Any page           | Logo, search, Library dropdown, theme toggle, login                      | `Log in`; Library links to Questions, Personality Analysis, Pop Culture, Enneagram Corner, How-to Guides, Community | Login or browse library | No desktop coaching CTA. Coaching appears in mobile nav and footer, but not top-level desktop nav. |
| Mobile nav               | Any page on mobile | Home, About, Book a Session, Corpus Stats, expanded Library, auth action | `Login / Register`, `Book a Session`                                                                                | Auth or coaching        | Mobile exposes coaching more directly than desktop.                                                |
| Footer                   | Any page           | Brand line, main links, blog links, coaching connect block               | `Join the coaching waitlist`, `Get in touch`                                                                        | Coaching or contact     | Strong "where to next" catch-all, but bottom-only.                                                 |
| Back button/layout shell | Most detail pages  | Max-width reading shell plus global footer                               | Browser-style back action                                                                                           | Return to previous page | Useful but not a conversion path.                                                                  |

Global brand promise used in footer:

> See the emotions behind every take. One situation, nine ways to see it.

## Core Journey Map

### 1. Homepage

| Item                | Current state                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Likely entry points | Direct, branded search, internal nav logo, social/profile links.                                                                                                         |
| Content seen        | Brand thesis, Enneagram primer, live question-of-the-day/open floor, library preview, coaching section.                                                                  |
| Primary copy        | `See the emotions behind every take.` / `One situation. 9 emotional reads - one per personality type.` / `Drop yours first - anonymously, before you see anyone else's.` |
| Primary CTA         | `Drop your take ->` to a question detail or `/questions`.                                                                                                                |
| Secondary CTAs      | `Start with the 9 in 9 lines`, `Browse all breakdowns ->`, `Book a session`.                                                                                             |
| Intended lead       | Move the visitor into a give-first question, a beginner primer, library reading, or coaching waitlist.                                                                   |
| Conversion role     | Best broad explainer and best first-party funnel into question participation.                                                                                            |
| Risks               | No email capture on the homepage. A visitor who likes the idea but is not ready to answer or book has no light capture.                                                  |

Recommended next tests:

- Add a low-friction "get one question per week" or "get new pattern notes" capture after the open-floor section.
- Track homepage CTA clicks by destination: question detail, `/questions`, primer, PA library, `/book-session`.

### 2. Questions Index

| Item                | Current state                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Likely entry points | Header Library, homepage open-floor, footer, category pages, search.                                                                                               |
| Content seen        | Open question list, search, filters/categories, signup nudge.                                                                                                      |
| Primary copy        | `Drop a situation. Get nine reads.` / `Real situations from real people... anonymously, locked-in, before anyone sees anyone else's take.`                         |
| Primary CTA         | Authenticated: `Drop a question ->` to `/questions/create`; unauthenticated: `Sign up to ask ->` to `/register`.                                                   |
| Secondary CTA       | `Browse open questions`, search/filter, category tree.                                                                                                             |
| Intended lead       | Pick a question and answer; or register to ask a new question.                                                                                                     |
| Conversion role     | Main participation hub.                                                                                                                                            |
| Risks               | The unauthenticated ask path sends to register, but direct `/questions/create` redirects unauthenticated users to login. This creates two different mental models. |

Question index nudge copy:

- `Give first. Then see how the room reads it.`
- `Pick an open question and drop your honest take, anonymously.`
- `Unlock how all 9 personality types read the same situation.`
- `Sort comments by type...`
- CTA: `Sign up to ask anonymously ->`

Recommended next tests:

- Use one consistent auth gate for asking: register-first for new users, login/register switch for existing users, with `returnTo=/questions/create`.
- Let unauthenticated users draft the question first, then ask them to register before submit. This preserves intent better than gating before writing.

### 3. Question Detail

| Item                       | Current state                                                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Likely entry points        | Questions index, question category pages, homepage question-of-day, search, social/shared question links.                                                                                                     |
| Content seen before answer | Question, Interact toolbar, sample perspectives, locked comments state.                                                                                                                                       |
| Primary copy               | `COMMENTS HIDDEN UNTIL YOU ANSWER`; locked copy says visitors can preview samples, but community comments stay locked until they share their own perspective.                                                 |
| Primary CTA                | `Answer to unlock`. Composer placeholder: `Say something real. Share what happened, give an example, or explain why you see it that way.`                                                                     |
| Content seen after answer  | Comments unlocked, AI comments, typed sorting/filtering, comments, articles tab.                                                                                                                              |
| Follow-up CTAs             | `Comment`, `Subscribe`, `Share`, sort/filter comments.                                                                                                                                                        |
| Intended lead              | Anonymous or logged-in contribution first, then deeper participation.                                                                                                                                         |
| Conversion role            | Strongest product mechanic.                                                                                                                                                                                   |
| Risks                      | Anonymous first answer works, but registration after the first action is not a deliberate on-page moment. Repeat comment, reply, subscribe, and other actions rely on "must register or login" toasts/errors. |

Telemetry already exists:

- `gate_shown` is logged on load for gated question pages.
- `contribution` is logged after a question-level comment with a fingerprint.

Recommended next tests:

- After the first anonymous answer unlocks comments, show a contextual account prompt: "Save this take, reply, and keep commenting." CTA: `Create your free account`; secondary: `Keep reading`.
- Add `returnTo` on login/register and return visitors to the exact question/comment state.
- Track `unlock_viewed`, `post_unlock_register_prompt_shown`, `post_unlock_register_click`, `repeat_comment_gate`, `reply_gate`, and `subscribe_gate`.

### 4. Question Categories

| Item                | Current state                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Likely entry points | Questions index filters, search, SEO for category pages.                                                                             |
| Content seen        | Category tree or category detail with live questions only.                                                                           |
| Primary copy        | `Browse by category.` / `Every category with questions waiting underneath.`                                                          |
| Primary CTA         | `Browse open questions ->`, `Ask a question`, question row links.                                                                    |
| Intended lead       | Find a relevant question and enter the give-first detail page.                                                                       |
| Conversion role     | Discovery support for questions.                                                                                                     |
| Risks               | Empty category CTA sends to `/questions/create`, which redirects unauthenticated users to login instead of preserving a drafted ask. |

### 5. Personality Analysis Index

| Item                | Current state                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Likely entry points | SEO, header Library, homepage Library CTA, footer, corpus stats.                                                               |
| Content seen        | Featured/recent public-figure analyses, browse by type/category, embedded signup for unauth users.                             |
| Primary copy        | `See public figures through the patterns that drive them.`                                                                     |
| Primary CTA         | Card clicks into person detail pages.                                                                                          |
| Capture CTA         | `Get the next famous-person read.` with email subscribe form.                                                                  |
| Intended lead       | Read a personality-analysis detail page or join email list.                                                                    |
| Conversion role     | Major organic acquisition surface.                                                                                             |
| Risks               | Hero has no explicit CTA; the implied action is browsing cards. That is fine for SEO visitors, but less direct for conversion. |

### 6. Personality Analysis Detail

| Item                | Current state                                                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Likely entry points | Organic search for famous people, category/type pages, related posts, social.                                                                                                                  |
| Content seen        | Dossier header, portrait, article, type dossier insert, NineChorus, discussion, related posts.                                                                                                 |
| Primary copy        | Case-file/dossier framing around the public figure.                                                                                                                                            |
| Primary CTA         | NineChorus: `Answer and see the nine`; prompt says `Your answer first` and `You answer before you see. That is the whole point.`                                                               |
| Secondary CTAs      | Discussion: `Add your read on {person}`; related analysis; suggested famous person if unauthenticated.                                                                                         |
| Intended lead       | Turn a passive article reader into a question contributor through NineChorus.                                                                                                                  |
| Conversion role     | High-intent SEO-to-product bridge.                                                                                                                                                             |
| Risks               | No newsletter or coaching capture is mounted here. The file references `BookSessionCTA` in comments/import notes, and the component exists with UTM support, but it is not currently rendered. |

NineChorus follow-up copy:

- Header: `ONE QUESTION / NINE WAYS TO ANSWER IT`
- CTA: `Answer and see the nine`
- Reveal section: `HOW THE NINE TYPES ANSWER`
- Share block: `SEE WHAT REAL PEOPLE SAY`
- Link: `See everyone's answers on the question page ->`
- Type/test link: `Find which voice is yours ->` to `/enneagram-test`

Recommended next tests:

- Preserve NineChorus as the primary action, then add a post-reveal registration prompt: "Save your read and join the conversation."
- Reintroduce `BookSessionCTA` below high-intent personality-analysis articles with UTM source/content.
- Consider adding email capture after discussion/related posts for users who do not answer NineChorus.

### 7. Enneagram Corner

| Item                | Current state                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Likely entry points | SEO for Enneagram concepts/types, header/footer, homepage primer, related article links.                               |
| Content seen        | Educational hub, concept/type article cards, category/topic groupings.                                                 |
| Primary copy        | `The Enneagram, decoded.`                                                                                              |
| Primary CTAs        | `Start with the 9 Types`, `Learn the Core Concepts`.                                                                   |
| Detail CTA          | `TestYourTypeCTA`, SuggestionsBlog, floating `EnneagramCTASidebar`, bottom `EmailSignup` for unauth users.             |
| Intended lead       | Learn enough to identify a type, continue reading, or subscribe.                                                       |
| Conversion role     | Beginner education and newsletter capture.                                                                             |
| Risks               | `TestYourTypeCTA` promises a test, but the destination redirects to `/questions`. This is a copy/expectation mismatch. |

### 8. Community, How-to Guides, Pop Culture

| Surface            | Entry point                        | Content seen                                       | CTA/copy                                                              | Intended lead                 | Risks                                                             |
| ------------------ | ---------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------- |
| Community index    | Header/footer, SEO, internal links | Community articles                                 | `The takes of 9takes.` / `Read Latest` / `Answer Questions`           | Read or go to questions       | Good bridge into participation.                                   |
| Community detail   | SEO/internal                       | Article, suggestions, sidebar email, bottom email  | `Get the next community take from 9takes`                             | Subscribe or continue reading | Blog comments use older, less guided comment UX.                  |
| How-to index       | SEO, header/footer                 | Practical guides                                   | `How-to guides.` / `Read Latest Guide` / `Learn the Enneagram`        | Read guide or learn basics    | End CTA sends `Take the Test` to redirect-only `/enneagram-test`. |
| How-to detail      | SEO/internal                       | Guide, suggestions, sidebar email, bottom email    | `Get the next practical guide from 9takes`                            | Subscribe or continue reading | Good coaching fit, but no direct coaching CTA.                    |
| Pop culture index  | SEO, header/footer                 | Culture analyses                                   | `Pop culture, decoded.` / `Start with Latest` / `Browse All Analyses` | Read article                  | Conversion is mostly content continuation.                        |
| Pop culture detail | SEO/internal                       | Article, type/test CTA, suggestions, sidebar email | `Start the Enneagram test`; sidebar `Get new culture reads`           | Test/subscribe/continue       | Same `/enneagram-test` mismatch.                                  |

Recommended next tests:

- Use how-to guides as a stronger coaching bridge. Practical guides often imply an active personal problem.
- On community/pop-culture pages, make the next step depend on intent: question participation for debate-style pages, email capture for browsing pages, coaching for personal-problem pages.

### 9. Search

| Item                | Current state                                                                                                                                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Likely entry points | Header search, direct `/search`, internal discoverability.                                                                                                                                                                        |
| Content seen        | Universal search for library and questions; scope tabs for All, Library, Questions.                                                                                                                                               |
| Primary copy        | `Search the library and the conversations around it.`                                                                                                                                                                             |
| Primary CTA         | `Search`. Result cards link to content/questions.                                                                                                                                                                                 |
| Empty/start copy    | `Start with a name, a topic, or a question.`                                                                                                                                                                                      |
| Intended lead       | Find an article or a question.                                                                                                                                                                                                    |
| Conversion role     | Intent capture and discovery.                                                                                                                                                                                                     |
| Risks               | Search has no conversion-aware zero-result or post-query CTA. If the query is a real-life problem, the best next step may be `Ask this as a question` or coaching; if it is a person/topic, the best next step may be newsletter. |

Recommended next tests:

- Add query-aware empty states:
  - Problem-shaped query: `Ask this as a question`.
  - Person/topic query: `Get new reads on this topic`.
  - Relationship/work query: `Join the coaching waitlist`.
- Track search query category, result clicks, no-result CTAs, and conversion after search.

### 10. About

| Item                | Current state                                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Likely entry points | Header mobile, footer, branded trust checks.                                                                                           |
| Content seen        | Mission, founder story, Enneagram explainer, examples, start-here cards.                                                               |
| Primary copy        | `Built for the moment your first read is not enough.`                                                                                  |
| Primary CTAs        | `Browse Questions`, `Learn the System`; later `Read the Guides`; coaching text link.                                                   |
| Intended lead       | Trust building, then questions or learning.                                                                                            |
| Conversion role     | Founder credibility and mission explanation.                                                                                           |
| Risks               | Good trust page, but coaching CTA is only a text link in a hint. If About is a trust pre-check for coaching, the path can be stronger. |

### 11. Corpus Stats

| Item                | Current state                                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Likely entry points | Header mobile, footer, SEO/data citations, internal links from category/type pages.                                                                              |
| Content seen        | Public dataset, citable claims, type/domain distributions, raw JSON.                                                                                             |
| Primary CTA         | Links into `/personality-analysis/categories`, type galleries, raw JSON.                                                                                         |
| Intended lead       | Authority/citation, then library browse.                                                                                                                         |
| Conversion role     | Trust/authority surface for data-minded visitors and LLM/search ingestion.                                                                                       |
| Risks               | No capture. That is acceptable if the role is authority, but consider a lightweight "get dataset updates" capture if this page starts drawing qualified traffic. |

### 12. Register and Login

| Item                | Register                                                                                                                                                                                                      | Login                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Likely entry points | Questions ask gate, header/mobile nav, toasts/errors, unauthenticated CTAs                                                                                                                                    | Header/mobile nav, confirmation links, gated actions                                |
| Content seen        | Email/password form, password requirements, switch to login                                                                                                                                                   | Email/password form, switch to register                                             |
| Primary copy        | `Register`; SEO description says `Register for a good time`                                                                                                                                                   | `Log in`; SEO description says `Login for a good time`                              |
| Success path        | Shows success and sends user to login after email confirmation                                                                                                                                                | Admin -> `/admin`; normal user -> `/questions`; confirmed signup load redirects `/` |
| Intended lead       | Create account                                                                                                                                                                                                | Return to participation                                                             |
| Risks               | Copy does not explain the product value of registration. No `returnTo` preservation for the action that triggered auth. Post-confirmation can land on `/` or `/questions`, not necessarily the original page. |

Recommended next tests:

- Rewrite auth page copy around concrete value:
  - Register headline: `Create your 9takes account`
  - Support: `Ask anonymously, keep commenting, reply, subscribe, and save your perspective history.`
  - Login support: `Pick up where you left off.`
- Add `returnTo` support through register, confirmation, and login.
- Add event names for auth gates: `ask_question_gate`, `repeat_comment_gate`, `reply_gate`, `subscribe_gate`, `save_take_gate`.

### 13. Coaching Waitlist

| Item                | Current state                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Likely entry points | Homepage coaching section, footer, mobile nav, About text link, direct/UTM links.                                                  |
| Content seen        | Dedicated waitlist page with hero, badges, form, proof-first sections, FAQ-like positioning.                                       |
| Primary copy        | `Decode yourself & the people in your life. 1-on-1 coaching waitlist.`                                                             |
| Primary CTA         | `Join the Waitlist`                                                                                                                |
| Form fields         | First name, email, optional Enneagram type, optional context.                                                                      |
| Success copy        | `You're already/on the waitlist.` / `I will reach out at [email] when the first sessions open.`                                    |
| Intended lead       | Waitlist submission.                                                                                                               |
| Conversion role     | Coaching monetization path.                                                                                                        |
| Strength            | Server stores source, referrer, and UTM metadata for `coaching_waitlist`.                                                          |
| Risks               | Upstream coaching CTAs are sparse. `BookSessionCTA` exists with UTM support but is not mounted in the highest-intent article path. |

Recommended next tests:

- Add coaching CTA to practical and high-intent article detail pages, especially how-to and personality-analysis.
- Give every coaching CTA a source-specific UTM.
- Add route-specific variants:
  - Personality analysis: "Apply this read to the people in your life."
  - How-to: "Bring a live situation to a session."
  - About: "Work through your pattern with DJ."

### 14. Enneagram Test Redirect

| Item                        | Current state                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Likely entry points         | Test CTAs from Enneagram Corner, Pop Culture, How-to, NineChorus reveal, metadata.                                                                     |
| Content seen                | Redirect/meta refresh page: `Enneagram Assessment`, `Redirecting you to our personality-based assessment...`                                           |
| Destination                 | `/questions`                                                                                                                                           |
| Promised CTA copy elsewhere | `Start the Enneagram test`; `Take the free 9takes Enneagram test - five minutes, no email wall, returns your dominant pattern with confidence scores.` |
| Intended lead               | Currently: questions participation. Promised: test/typing result.                                                                                      |
| Risk                        | Highest-priority expectation mismatch. It can reduce trust because the visitor does not get what the CTA promised.                                     |

Recommended next tests:

- Option A: build the test/typing result and make `/enneagram-test` real.
- Option B: rename all CTAs to match reality: `Answer questions to find your type`, `Start with real questions`, or `Compare your perspective`.
- Option C: use a bridge page that explains the give-first assessment method before sending visitors to questions.

## Current Conversion Paths

### Path A: Anonymous Give-First Participation

```text
Home / Questions / Question Category / Search / Shared Question
  -> Question detail
  -> "Answer to unlock"
  -> Anonymous first answer allowed by fingerprint
  -> Comments unlock
  -> Repeat comment / reply / subscribe requires account
  -> Login/Register prompt currently appears as toast/error
```

Best current copy:

- `Answer to unlock`
- `COMMENTS HIDDEN UNTIL YOU ANSWER`
- `Say something real... The best comments are honest and specific.`

Better target path:

```text
Answer first
  -> unlock comments
  -> contextual account prompt
  -> register/login with returnTo
  -> return to the same question unlocked
  -> reply/subscribe/comment again
```

### Path B: SEO Article to Product Mechanic

```text
Organic search for public figure / pop culture / Enneagram topic
  -> Article detail
  -> NineChorus or TestYourTypeCTA or EmailSignup
  -> question participation, test redirect, or email signup
```

Best current copy:

- `Your answer first`
- `Answer and see the nine`
- `Same question. None of them wrong.`

Leaks:

- Personality-analysis detail has a strong NineChorus bridge but no email/coaching backup.
- Test CTA destination mismatch.
- Blog comment UX is less guided than question detail.

### Path C: Newsletter Capture

```text
Content index/detail page
  -> EmailSignup or EnneagramCTASidebar
  -> /api/signups
  -> signups row + first-touch attach by fingerprint
  -> welcome email
```

Current copy variants:

- Generic: `Get 9takes updates in your inbox`
- Personality index: `Get the next famous-person read.`
- Enneagram: `Get Enneagram notes`
- Pop culture: `Get new culture reads`
- Community: `Get the next reader take`
- How-to: `Get practical people guides`

Attribution gap:

- `/api/signups` records email and attaches first-touch metadata by fingerprint.
- The signup payload does not currently accept explicit `source`, `surface`, `cta_id`, or `content_slug`.
- That makes per-CTA optimization harder than it needs to be.

### Path D: Coaching Waitlist

```text
Home / Footer / Mobile nav / About
  -> /book-session
  -> Waitlist form
  -> coaching_waitlist + metadata
  -> admin email + success state
```

Best current copy:

- `Decode yourself & the people in your life. 1-on-1 coaching waitlist.`
- `No payment today`
- `First-round access`
- `Best for live issues`

Leaks:

- Sparse upstream CTAs.
- Desktop header does not expose coaching.
- High-intent articles do not currently mount the UTM-enabled `BookSessionCTA`.

### Path E: Register to Ask

```text
Questions index unauthenticated
  -> "Sign up to ask"
  -> /register
  -> email confirmation
  -> /login
  -> /questions
```

Leak:

- The visitor's original "ask this question" intent is not preserved.
- Auth copy does not explain why registering helps with asking, commenting, saving, or subscribing.

### Path F: Search to Action

```text
/search
  -> query
  -> result card
  -> question or article
```

Leak:

- Search does not convert no-result or problem-shaped queries into asks, coaching, or subscription.

## Copy Ledger

| Copy                                                            | Surface                    | Intended job                            | Actual next step                      |
| --------------------------------------------------------------- | -------------------------- | --------------------------------------- | ------------------------------------- |
| `See the emotions behind every take.`                           | Home, footer theme         | Explain the product thesis              | Move to questions/library/coaching.   |
| `One situation. 9 emotional reads - one per personality type.`  | Home hero                  | Explain give-first value                | `Drop your take ->`.                  |
| `Drop yours first - anonymously, before you see anyone else's.` | Home hero                  | Reduce friction and explain lock        | Question detail.                      |
| `Drop a situation. Get nine reads.`                             | Questions index            | Invite user-generated questions         | Ask/register or browse.               |
| `Answer first to unlock everyone else's takes.`                 | Questions/category pages   | Explain participation rule              | Question detail answer.               |
| `Answer to unlock`                                              | Question detail toolbar    | Primary give-first action               | Opens composer.                       |
| `Say something real...`                                         | Question detail composer   | Improve comment quality                 | Submit answer/comment.                |
| `Get the next famous-person read.`                              | Personality-analysis index | Newsletter capture from PA readers      | `/api/signups`.                       |
| `Answer and see the nine`                                       | NineChorus                 | Convert article reader into participant | API mirror contribution and reveal.   |
| `Find which voice is yours ->`                                  | NineChorus reveal          | Move to typing/test                     | `/enneagram-test`, then `/questions`. |
| `Start the Enneagram test`                                      | TestYourTypeCTA            | Promise test result                     | `/enneagram-test`, then `/questions`. |
| `Join the coaching waitlist`                                    | Footer/book page           | Coaching conversion                     | `/book-session`.                      |
| `Register`                                                      | Auth page                  | Account creation                        | Confirmation email, then login.       |
| `Login / Register`                                              | Mobile nav                 | Account entry                           | `/login`.                             |

## Ranked Audit Findings

1. Fix the `/enneagram-test` promise mismatch.
   - Pattern: P6 label/action match, P13 preserve intent.
   - The CTA says "test" and "confidence scores"; the destination is questions. Either build the test or rename the promise.

2. Add contextual registration after anonymous contribution.
   - Pattern: P8 place the CTA where intent peaks.
   - The best moment to ask for account creation is immediately after unlock, not only when a later action fails.

3. Preserve return destinations through auth.
   - Pattern: P13 state/intent preservation.
   - Add `returnTo` for ask, repeat comment, reply, subscribe, save, and post-email-confirmation paths.

4. Reconnect high-intent articles to coaching.
   - Pattern: P8 high-intent CTA placement.
   - `BookSessionCTA` already exists and builds UTM links, but it is not rendered on personality-analysis detail.

5. Add explicit CTA source attribution to newsletter signups.
   - Pattern: P13 measurement continuity.
   - First-touch fingerprint attribution is useful, but per-component CTA IDs are needed for copy/layout tests.

6. Make search an intent router.
   - Pattern: P7 empty-state usefulness, P8 contextual CTA.
   - No-result and problem-shaped queries should route to ask/coaching/newsletter instead of only showing results.

7. Rewrite auth copy.
   - Pattern: P6 direct, outcome-matched copy.
   - `Register for a good time` and plain `Register` do not explain the value of creating an account.

8. Bring blog comment UX up to question-detail quality.
   - Pattern: P6 clarity, P8 timing.
   - Blog comments currently rely on basic placeholders and toasts. The question composer has better guidance and should be the model.

9. Add light capture on homepage.
   - Pattern: P8 capture at the broadest qualified page.
   - The homepage has answer/coaching/library paths but no newsletter option for visitors who are interested but not ready to act.

10. Standardize ask-question gating.

- Pattern: P13 preserve user effort.
- Let visitors draft first or at least carry `returnTo=/questions/create`; avoid one surface saying register while another redirects to login.

## Better Paths to Test

### SEO Personality Reader

```text
Google: "celebrity enneagram type"
  -> Personality-analysis detail
  -> Read dossier
  -> NineChorus answer
  -> Reveal nine voices
  -> Prompt: "Save your read and join the conversation"
  -> Register with returnTo
  -> Return to same article/question unlocked
  -> Optional coaching CTA below: "Apply this read to someone in your life"
```

### Real-Life Problem Reader

```text
Google/search: relationship, conflict, work, family problem
  -> How-to guide or search results
  -> Practical article
  -> CTA: "Ask this as a question" or "Bring this to a session"
  -> Question create draft or coaching waitlist
```

### Social Question Visitor

```text
Shared question link
  -> Question detail
  -> Answer anonymously
  -> Unlock comments
  -> See typed perspectives
  -> Prompt: "Create an account to reply and get notified"
  -> Register/login with returnTo
```

### Beginner Enneagram Visitor

```text
Home/About/Enneagram Corner
  -> Type primer
  -> "Compare your perspective" instead of "Take the test" unless a real test exists
  -> Questions flow
  -> Optional "save my type/voice" account prompt
```

### Search No-Result Visitor

```text
Search query with no good match
  -> Classify query
  -> Problem query: "Ask this as a question"
  -> Person/topic query: "Get notified when we publish this"
  -> Coaching query: "Join the coaching waitlist"
```

## Measurement Backlog

Already available:

- Page-view analytics include path group, content type/slug, referrer host, UTM fields, click IDs.
- Give-first telemetry records `gate_shown` and `contribution`.
- Coaching waitlist stores source/referrer/UTM metadata.
- Newsletter signup attaches first-touch metadata by fingerprint.

Add next:

- `cta_click` with `cta_id`, `surface`, `path`, `content_slug`, `destination`, `copy_variant`.
- `auth_gate_shown` and `auth_gate_click` with `gate_reason`: ask, repeat_comment, reply, subscribe, save, post_unlock.
- `return_to_started` and `return_to_completed`.
- `newsletter_signup_attempt` with explicit `source`, `surface`, `cta_id`, `content_slug`.
- `book_session_cta_click` with UTM values and source component.
- `test_redirect_seen` for `/enneagram-test`, so the mismatch can be quantified before/after.
- `search_no_result_cta_click`, `search_result_click`, and query intent bucket.

## Suggested Audit Order

1. Fix or rename `/enneagram-test` paths.
2. Design the post-unlock account prompt on question detail and NineChorus reveal.
3. Add `returnTo` support to login/register/confirmation flows.
4. Reintroduce or replace `BookSessionCTA` on high-intent article detail pages.
5. Add explicit source fields to newsletter capture and signup storage.
6. Add search empty-state routing.
7. Rewrite auth page copy and metadata.
8. Decide whether homepage gets email capture, question capture, or both.
