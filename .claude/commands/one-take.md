<!-- .claude/commands/one-take.md -->

# One Take — 9takes on-camera Reel factory

You produce a complete, film-ready **One Take** episode: a falsifiable on-camera personality read of one public figure, plus everything it needs to ship. Script, cold-start variant, caption, jury question, and the follow-on outreach email. DJ films it on a phone in one sitting and posts it to IG Reels.

The series premise: **each video is DJ's one take. The audience owns the other eight.** The CTA is structurally inevitable rather than bolted on.

## Input

The user provides **$ARGUMENTS** — a person's name, optionally with `short` to produce only the 45-second variant.

If no argument is provided, respond exactly:

```text
Who are we posting about?

Give me a name. Works best with someone who already has a 9takes analysis:
  - Fresh research exists for the July 2026 batch (IShowSpeed, Zendaya, Hasan Piker,
    Sabrina Carpenter, Messi, Sam Altman, Elon Musk, Dario Amodei, Kai Cenat,
    Sydney Sweeney, Taylor Swift, MrBeast)
  - Or any of the 489 drafts in src/blog/people/drafts/
  - Or someone brand new, and I'll build the read from scratch

Example: /one-take Kai Cenat
```

Then wait.

## Source of Truth

This command is **self-sufficient**. Every rule, beat, table, and gate is inlined below. You do not need to read another file to run it. Background specs, for edge cases only, are listed at the bottom.

## Pre-Approved Operations

- **Read / Glob / Grep**: anywhere in the project
- **WebSearch / WebFetch**: required, this command cannot run without live research
- **Bash**: `./scripts/db-query.sh` (read-only SQL), `pnpm regen:takes`, `ls`
- **Write**: `docs/marketing/one-take/` only

Do not publish anything, do not push blogs, do not post to social. This command produces files.

---

## Phase 0 — Confirm the subject

Ask who if not given. Once you have a name, say what you're about to do in one line and proceed. Do not ask further permission.

**Reject the subject and say why** if any of these are true:

- They are a private individual, not a public figure.
- The only available read requires commenting on their health, a diagnosis, their finances, or their politics.
- They are in an active crisis where a personality read would be cruel rather than illuminating.

---

## Phase 1 — Gather what 9takes already has

Run these in parallel:

1. `ls docs/taskers/news-refresh-2026-07/` and read any tasker matching the person. These carry pre-scoped psychology questions.
2. `ls src/blog/people/drafts/ | grep -i <name>` and read the draft if it exists.
3. `grep -i "<name>" src/lib/components/molecules/famousTypes.ts` for the established Enneagram type.
4. If the blog is DB-only: `./scripts/db-query.sh "select slug, title, enneagram_type, lastmod from blogs_famous_people where slug ilike '%<slug>%'"`

**Treat all of this as leads, never as sources.** See Phase 3. Internal docs have been wrong before.

If nothing exists for this person, that is fine. Build the read from scratch in Phase 2 and note that there is no published analysis to link.

---

## Phase 2 — Evidence collection

Research the last 12 months. You are hunting for **three to five events that reveal how this person is wired**, not a news summary.

**Selection rule:** an event earns a place only if it shows something about the machinery. A funding round is not psychology. A decision made at 3am against everyone's advice might be.

Search specifically for:

- Anything they have said about **their own limits, capacity, motives, or process**. Highest-value material there is.
- Any moment they **changed their mind publicly**, and how they framed it.
- Any moment **something escaped their control**, and what they said about it. This is usually where the disconfirmer lives.
- **Counter-evidence to the type read.** Look for it deliberately. If you cannot find any, you have not looked hard enough.

Prefer primary sources: their own words in interviews, posts, transcripts. Secondary coverage is acceptable when it quotes them directly and you can name the outlet.

---

## Phase 3 — The verification gate (hard gate)

**No unverified claim reaches a script DJ will say out loud on camera about a living person.**

For every factual assertion that will be spoken:

1. Confirm it against a source you retrieved **in this run**. Not memory, not a tasker, not a draft.
2. Record the URL.
3. If it cannot be confirmed, **cut it.** Not soften it, cut it.

**Internal docs are leads, not sources.** This rule is not theoretical. On episode 1 the tasker was wrong on the prize figure ($11M, actually $15M), asserted a season 3 casting plan that no source supports, and had the central quote backwards. All three would have been spoken on camera.

**When verified facts contradict the internal hypothesis, that is a finding, not a problem.** It usually makes the episode sharper. On episode 1 the "he got more personal" story inverted into "he studied hundreds of faces watching his show and found intimacy underperforming," which was a far better read than the one the tasker proposed.

Produce a fact-check table in the output file with every claim, its verdict, and its source.

---

## Phase 4 — Derive the read

Answer these before writing a word. They are the analytical spine, condensed from the blog doctrine.

**1. What is the feeling underneath?** Anchor to the center of intelligence:

| Center     | Types   | Core emotion |
| ---------- | ------- | ------------ |
| Gut / body | 8, 9, 1 | Anger        |
| Heart      | 2, 3, 4 | Shame        |
| Head       | 5, 6, 7 | Fear         |

"Anger" is not an answer. "Anger routed into work so it never has to be aimed at a person" is.

**2. What is the inner dialogue?** The sentence they are plausibly saying to themselves, in their own idiom. Inferred, never presented as a real quote. Usually the most quotable line you will write.

**3. Evidence for, against, or complicating?** Name what does not fit. Required.

**4. Stress or integration?** The most falsifiable claim the Enneagram allows about a live event:

| Type | Stress → | Integration → |
| ---- | -------- | ------------- |
| 1    | 4        | 7             |
| 2    | 8        | 4             |
| 3    | 9        | 6             |
| 4    | 2        | 1             |
| 5    | 7        | 8             |
| 6    | 3        | 9             |
| 7    | 1        | 5             |
| 8    | 5        | 2             |
| 9    | 6        | 3             |

**5. What did it cost them?** Find the concrete instance.

**6. The reader's mirror.** Who in the audience runs this same pattern at ordinary scale? This becomes beat 5 and the jury question.

---

## Phase 5 — Write the script

Six beats, roughly 85 to 90 seconds, 220 to 240 spoken words.

| Beat                | Time      | Job                                                                      |
| ------------------- | --------- | ------------------------------------------------------------------------ |
| **1. Claim**        | 0 to 6s   | The read stated flat. No preamble, no "hey guys." The claim is the hook. |
| **2. Evidence**     | 6 to 21s  | One specific verifiable behavior. Not a vibe.                            |
| **3. Mechanism**    | 21 to 42s | Why the type predicts this. Where credibility is earned.                 |
| **4. Disconfirmer** | 42 to 61s | "Here's what would prove me wrong." Never cut.                           |
| **5. Mirror**       | 61 to 78s | Lens off them, onto the viewer.                                          |
| **6. Jury**         | 78 to 84s | "That's one take. There's nine. Go add yours. Link in bio."              |

### Beat 4 is the whole format

Stating what would prove you wrong does four jobs at once, which is why nothing else in this format may displace it:

1. **It is the comment engine.** People rush to supply the disconfirming evidence. That is the win condition.
2. **It is the legal and reputational armor.** Filming an assertion about a living person carries more weight than publishing one. Keep it structural, never decorative.
3. **It is the credibility separator.** A falsifiable claim is a different genre from a horoscope.
4. **It is already doctrine.** "If every news event conveniently confirms the type, that is motivated reasoning and readers can smell it."

A disconfirmer must name a **specific observable thing** that would flip the read. "I could be wrong" is not a disconfirmer. "Two contestants fell for each other and he said he doesn't know how you plan for that" is.

### Hard rules

- **Lead with the fear, not the type.** Type is the mechanism, revealed in beat 3, never the cold open.
- **No pathology, no diagnosis**, no speculation about health or finances.
- **No politics.** Political comment volume drowns psychological comment volume.
- **Observable behavior is evidence. Feelings are interpretation.** Say which is which.
- **Zero em-dashes in everything you produce** (script, variant, caption, email, jury question). Commas and periods. This applies to the deliverables, not to your notes in chat.
- **Write for the mouth, not the page.** Contractions, short sentences, no clause stacking. Read it aloud in your head; if you run out of breath, cut it.
- No hedge words, no moralizing, no "in today's world," no "let's dive in."

### Also produce the 45-second cold-start variant

Claim, disconfirmer, mirror, jury. Drop the mechanism beat entirely and move its best line into the caption. This is a live experiment: the account is cold and completion rate drives distribution, so if the full cut lands under 40 percent completion, the short cut becomes the format.

---

## Phase 6 — The jury page

The CTA is dead if it lands on an empty page.

1. **Write the mirror question.** It must be near-verbatim to beat 5 and pass all four tests:
   - Non-binary. No yes/no, no pick-a-number.
   - Demands a narrative. A real answer is a story, not a word.
   - About the reader, not the subject.
   - Too exposed to answer in public comments. That is exactly why it belongs on 9takes, where answers are anonymous and give-first.

2. **Check whether it already exists:**
   `./scripts/db-query.sh "select id, url, question from questions where question ilike '%<keyword>%' and removed is not true"`

3. **If DJ needs to create it,** tell him to create it at `/questions/create`, then get the id.

4. **Generate the nine takes. This is mandatory and currently manual:**
   `pnpm regen:takes -- --id=<id>`

   **Known bug:** takes do not auto-generate. Post-processing on question create is fired as fire-and-forget background work that Vercel kills when the response returns, so every question created since 2026-06-01 has zero takes. Verify with:
   `./scripts/db-query.sh "select count(*) from comments_ai where question_id=<id>"`
   Expect 9. If it is 0, the CTA has nothing to reveal and the episode is not shippable.

5. **Bio link points at the question page, not the blog.** The blog is the doorway, the question page is the room.

---

## Phase 7 — Caption and outreach email

**Caption.** Opens with the single most arresting verified quote or fact from the research, not a summary of the video. Ends with the jury CTA and the question URL. No hashtag spam, three at most.

**Outreach email.** Draft it but mark it **DO NOT SEND YET**. It goes out 7 to 10 days after the Reel ships, once the jury has accumulated real answers, because the vote is the entire ask.

The ask is never "is this correct?" That is supplication. It is:

> I published a read on you and put it to a public vote. [N] people have now weighed in on whether I got it right. Here is what they said. You're the only person who actually knows.

Subject line: 3 to 7 words, under 40 characters, no Enneagram jargon, no fake `Re:`, no supplication. Best form is a signature detail from the piece.

---

## Phase 8 — Output

Write one file: `docs/marketing/one-take/ep-<NN>-<person-slug>.md`

**Episode numbering:** episode 1 is MrBeast and it lives inside `docs/marketing/one-take-format.md` section 5 as the worked reference example. Start new episodes at 02. Check the directory for the highest existing number before choosing.

Sections in order:

1. **Status** — date, person, established type, whether a published analysis exists
2. **Fact check** — every spoken claim, verdict, source URL
3. **The read** — the six Phase 4 answers, brief
4. **Script** — six labeled beats, blockquoted, with the spoken word count
5. **45-second variant**
6. **Jury question** — the question, its id, and confirmed takes count
7. **Caption**
8. **Outreach email** — marked DO NOT SEND YET
9. **Sources** — every URL used

Then report back to DJ in chat with: the claim, the disconfirmer, anything the research contradicted, and whether the jury page is ready. Keep it short. He is going to go film this.

---

## Go deeper

- `docs/marketing/one-take-format.md` — the series spec and why each rule exists
- `docs/product/the-mirror-moment.md` — the CTA mechanic in full
- `docs/taskers/news-refresh-2026-07/README.md` — the eight questions, unabridged
- `docs/outreach/personality-analysis-outreach-playbook.md` — the six gates for the email
