<!-- docs/product/2026-09-23-therapy-beta-kit.md -->

# Beta Kit: 1-on-1 Sessions

**Status:** v0 draft for DJ to mark up. Nothing here has been sent or scheduled.
**Idea doc:** [`2026-09-23-therapy-on-steroids.md`](./2026-09-23-therapy-on-steroids.md)

> **This repo is public.** Participant names, emails, recon answers, and session notes never go in this repo. They live in `/admin/consulting` (private DB), DJ's Gmail, and BuildOS.

## 1. The beta group: who's real

Vetted 2026-09-23 against `coaching_waitlist`, its metadata, and `auth.users`:

| Group                           | Count | Evidence                                                                                                                                                                                                                                                                                   |
| ------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Real people**                 | **2** | One signed up Apr 2026 from iPhone with a detailed, specific goal. The other signed up Mar 2025 from Android with a plausible name and no details.                                                                                                                                         |
| Bot wave (Nov 19 – Dec 1, 2025) | 14    | Random-string names ("fJHGFyAJDgAbEKCfse"), the same malformed user agent, rotating hosting-range IPs, and auth accounts created about 60s before each signup with zero activity and no logins. The emails belong to real third parties whose addresses were used by a signup-bombing bot. |
| DJ test rows                    | 2     | localhost + djwayne3                                                                                                                                                                                                                                                                       |

**Do not email the bot-wave addresses.** Those people never signed up, so writing to them is spam and puts 9takes' sending reputation at risk.

**Two people is too few for a beta.** DJ parked recruiting on 2026-09-23 to serve these two well first. When it's time, these are the candidate pools:

- `signups` email list: 126 total, 90 in the last 12 months. These are not vetted yet and need the same bot check first.
- Registered users who've commented: 32 all-time, 13 in the last 12 months.
- Instagram, personal network, the people answering chorus questions (anonymous, so only reachable through an on-page ask).

## 2. The process

1. **Booking page (DJ, about 10 min).** In Google Calendar, go to Create → Appointment schedule.
   - Title: "9takes Beta: Discovery Call". Length: 30 min. Location: Google Meet.
   - Pick availability windows. A couple of US-evening slots also land as mornings in Asia-Pacific.
   - Set a 15 min buffer, a maximum of 2 bookings per day, and a booking window of the next 2–3 weeks.
   - Description: two lines from the email, plus "This is coaching, not therapy or medical care."
   - **Keep the link unlisted and only send it by email.** The waitlist was bot-bombed once already.
2. **Invite.** Send a personal email from DJ's Gmail rather than the site's email system. It's only a handful of people, and the email should read like it came from DJ.
3. **When someone books.** Reply with the recon questions (section 4). In `/admin/consulting`, convert them from waitlist to client (`prospect`) so the session history lives in one private place.
4. **Discovery call (30 min).** Run sheet in section 5.
5. **Deep sessions (60 min).** Use a second appointment schedule, shared only with people who've done a discovery call.
6. **After every session.** Send a "what you figured out" recap within 24h. Log notes in `consulting_sessions`.

## 3. Invite emails (drafts)

`[BOOKING LINK]` is the only placeholder left. The beta is free (DJ, 2026-09-23). Names stay out of this public repo; the named versions are in the BuildOS copy.

### Signup A (Apr 2026, left a detailed goal)

**Subject:** Your 9takes session (finally)

> Hey [First name],
>
> Back in April you signed up for a 1-on-1 session on 9takes and told me what you were working through. I never wrote back. That's on me, and I'm sorry it took this long.
>
> I've spent the time since figuring out what these sessions should be, and they're open now as a small beta.
>
> Here's what I'm going for. Traditional therapy gets treated like something shameful. People process their heaviest stuff behind a closed door, and too often they walk out without getting anywhere. I want to flip that. Going deep on your inner world should feel like leveling up. You should come out stronger and proud of the work you did.
>
> We'll use the Enneagram as a map to help guide us. I'll ask questions, tell you what I hear underneath your answers, and we'll follow the thread wherever it goes. Some sessions might get into heavy stuff. My goal is that you leave every one clearer and more excited about your life than when you came in.
>
> It starts with a 30-minute call so I can hear what's going on now and you can decide if it's for you. It's free. I'm still shaping how I run these, so all I ask is honest feedback on what's working and what isn't.
>
> Grab a time here: [BOOKING LINK]
>
> If none of the times work in your time zone, just reply and we'll find one.
>
> DJ

### Signup B (Mar 2025, no details)

**Subject:** The 9takes coaching sessions are open

> Hey [First name],
>
> A while back you signed up for the 1-on-1 coaching waitlist on 9takes. It took me a long time, but the sessions are open now as a small beta, and you're one of the first people I'm asking.
>
> _[paragraphs 3–6 from Signup A's email, unchanged]_
>
> DJ

### Template for new recruits

Same body. Swap the opener for how DJ knows them: "You've been answering questions on 9takes…", "You signed up for 9takes emails…", or "We've talked about this stuff before…".

## 4. Recon questions (sent after they book)

> Before we talk, a few questions. Answer as long or as short as you like, and skip anything you'd rather not answer.
>
> **About you**
>
> 1. What's going on in your life right now that made you say yes to this?
> 2. What's a pattern you keep running into, something you keep doing even when you know better?
> 3. If these sessions worked, what would be different three months from now?
> 4. Do you know your Enneagram type? How sure are you? (Totally fine if you don't.)
>
> **About the beta** (these help me build it) 5. Have you done therapy, coaching, or journaling before? What did it get right, and what didn't it? 6. How would you feel telling a friend you're doing sessions like this? 7. Is anything off-limits, or something you'd rather not get into?
>
> What time zone are you in?
>
> One heads-up: I use AI to help me prepare for our sessions and to write up your notes afterward. If you'd rather I didn't, just say so and I won't.

Questions 5 and 6 test the thesis directly. Question 5 checks the "too few iterations" critique, and question 6 checks the shame flip.

## 5. Session run sheets (v0 for DJ to mark up)

### Discovery call (30 min)

| Time  | Beat                                                                                                                                                            |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–5   | Who DJ is, what this is (the flip: going deep as leveling up), and what it isn't (not therapy, not medical care). Ask for a yes on using AI for prep and notes. |
| 5–20  | Recon: go through their answers and pick **one** thread to take a layer deeper.                                                                                 |
| 20–25 | One mirror, as a taste: "Here's what I hear underneath that." See if it lands.                                                                                  |
| 25–30 | Do they want to keep going? Book the first deep session. Ask for honest feedback.                                                                               |

### Deep session (60 min)

| Time            | Beat                                                                                                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Before (15 min) | **AI prep.** Their recon plus the last recap go in; a one-page brief comes out. It has what they said in their own words, 2–3 possible patterns phrased as questions (not verdicts), and the thread to pull first.                   |
| 0–5             | Check-in. Energy score (1–10). "What do you want to walk out with today?"                                                                                                                                                            |
| 5–40            | **The rabbit hole.** Ask, they answer, DJ mirrors ("what I hear underneath is…"), they correct or confirm, go a layer deeper. Use the Enneagram as a lens: offer 2–3 type readings of the same behavior and let them pick what fits. |
| 40–50           | **The flip.** What has this pattern been protecting? What would the strong version of you do with it? Whose alarm have you been mistaking for a defect, yours or someone else's?                                                     |
| 50–60           | **The move.** One concrete thing to do before next session, in their words. Energy score again.                                                                                                                                      |
| After (≤24h)    | **The recap.** AI drafts, DJ edits and sends "what you figured out." It's theirs to keep and share. That's the anti-secrecy flip made tangible.                                                                                      |

### Guardrails in the room

- **Crisis.** If someone mentions self-harm or not being safe, drop the plan, ask directly, and point them to 988 (US, call or text) or their local line. Don't keep doing deep work that session.
- **No medical calls.** Medication and diagnoses go back to their doctor.
- **Don't assign origin stories.** Let them tell you where a pattern came from, but don't tell them. The do-not-write list applies in the room too.

## 6. Beta scorecard (draft; is this what "working" means?)

- **Energy delta.** Energy score at the start vs. the end of each session. This is DJ's stated goal: leave energized.
- **The shame flip.** At the next session, ask: "Did you tell anyone about what you worked on?"
- **Pull.** Do they book the next session without being chased?
- **Their words.** One sentence: "What did you figure out?"

## 7. "Talk to DJ" page (built 2026-09-23; migration applied, code not deployed yet)

`/book-session` is no longer a waitlist form. It's now **Talk to DJ**, built from DJ's round-3 answers: note first, details after, private replies only.

**What visitors see**

1. A short bio, a list of "people bring me things like" prompts, and one note box. They can type, or record a voice note of up to 3 minutes that gets transcribed into the box so they can edit it. The note saves the moment they tap **Send to DJ**, even if they leave right after.
2. An optional second step: an email for a private reply, and "I'd like a free 1-on-1 session" (which asks for a first name). Checking the session box also creates a `coaching_waitlist` row, so the existing consulting admin sees them. **Skip. Stay anonymous.** is always available.
3. A thank-you screen that matches their choice. It never promises a reply to an anonymous note.

**What DJ sees:** `/admin/consulting/notes` (a new **Notes** tab). It shows each note with the voice recording playable and the transcript, the email or "Anonymous", and a "Wants a session" badge. DJ replies with text and/or a voice note of their own. The sender gets an email; a voice reply links to a private page at `/talk/reply/[token]`. There are also Archive and Restore buttons.

**Decisions made in the build (veto any)**

- No captcha on the note box, which keeps it as simple as possible. It's protected by a honeypot, a minimum fill time, a user-agent filter, and 5 notes per hour per visitor.
- The site **never auto-emails a visitor-supplied address**. The only mail a visitor gets is DJ's own reply. That shuts down the Nov 2025 signup-bombing pattern.
- Visitor voice recordings are kept (privately, in a new `talk-notes` bucket) so DJ hears their tone, not just the transcript. IPs are stored only as a salted hash, because the notes are meant to be anonymous.
- DJ gets an email for every new note, and another if they ask for a session.
- There's a 988 crisis line under the form, and the FAQ says "coaching, not therapy."
- Site-wide CTAs (header, footer, homepage, About) now say "Talk to DJ" instead of "Join the coaching waitlist".

**To ship**

1. ~~Apply `supabase/migrations/20260923120000_talk_notes.sql` to prod.~~ **Done 2026-09-23.** Verified: the table is live, RLS is on with no policies, anon and authenticated have no access, the private `talk-notes` bucket exists, and the service-role API can see both.
2. Deploy, then send one test note (text + voice) and reply to it from the admin, all the way through.

Code: `src/lib/server/talkNotes.ts` (plus spec), `src/routes/book-session/`, `src/routes/admin/consulting/notes/`, `src/routes/talk/reply/[token]/`, `src/lib/components/admin/TalkNoteCard.svelte`. `VoiceRecorder` gained optional `onaudio`, `maxSeconds`, and `hint` props.
