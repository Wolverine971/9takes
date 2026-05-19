# Twitter Post — @9takesdotcom (daily original)

Generate one ready-to-post original tweet for @9takesdotcom in one of the 7 audit-validated formats. Optimized for what actually wins in DJ's algorithmic feed (Psychology + Attachment + MBTI K-pop/anime), NOT for the dead `#enneagram` hashtag.

**Why this exists:** The 2026-05-19 engagement audit (`docs/twitter/2026-05-19_engagement-audit/`) identified 7 formats with proven viral mechanics in DJ's adjacent communities. DJ's prior posts (averaging 6–33 views, 0 likes) failed because they used the wrong format (link-card thought-leadership in a graveyard hashtag). This command produces tweets that fit the formats winning in his actual feed.

---

## The 7 winning formats

| #   | Format                                                    | Live exemplar                                                                                                      | Why it works                                                                 |
| --- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 1   | **"According to psychology…"**                            | @sunnkssdseraph: "According to psychology some people will never reach out…" → 1.1M views                          | Universal framing, no jargon, claim of authority                             |
| 2   | **"My therapist told me…"**                               | @heavensbvnny: "my therapist told me, 'stop assuming people are mad at you…'" → 38K views                          | First-person receiving wisdom; relatable; vulnerable                         |
| 3   | **"How to deal with someone with [X]:"**                  | @Theholisticpsyc: "How to deal with someone with an avoidant attachment style:" → 772K views                       | Solution + identity token; tagged people self-identify in replies            |
| 4   | **Type-as-identity one-liner**                            | @anujistired: "my anxious avoidant attachment style is my worst enemy" → 10K views                                 | Confessional + relatable; people quote-tweet to add their own                |
| 5   | **Satirical "Just heal your X" list**                     | @brianmaierhofer: "Just heal your family trauma, regulate your nervous system, break your addictions…" → 57K views | Comedic deconstruction of the self-help genre                                |
| 6   | **"Personality types of [TV / K-pop / anime]"**           | @yuipis18: "What MBTI types everyone in Jujutsu Kaisen might be…" → 873K views                                     | Hijacks existing fandom; fans tag friends to argue                           |
| 7   | **Reply-bait list ("Reply with your type, I'll guess…")** | format used by typology Twitter creators                                                                           | Generates replies (which compound algorithm signal); low effort, high return |

---

## Phase 0: Pick the format

Ask DJ (or pick based on day-of-week rotation):

```
Which format today?
1. According to psychology…
2. My therapist told me…
3. How to deal with [type]:
4. Type-as-identity one-liner
5. Satirical "Just heal your X" list
6. Personality types of [pop culture moment]
7. Reply-bait list

Or: "pick for me" → rotate based on the day:
Mon: #1 (according-to-psychology) — viral reach Monday
Tue: #6 (pop culture types) — week's news in
Wed: #3 (how-to-deal) — midweek utility
Thu: #4 (type-as-identity one-liner) — low effort
Fri: #2 (my therapist told me) — vulnerable Friday
Sat: #5 (satirical list) — weekend humor
Sun: #7 (reply-bait) — Sunday community
```

---

## Phase 1: Find the hook

The format is the container. The hook is the content. Run the appropriate sub-flow:

### For format 1 (According to psychology…)

1. Scan DJ's recent **For You** feed (`https://x.com/home` → For You). Find 1 viral psychology insight ≥50K views.
2. Identify the underlying enneagram pattern.
3. Reframe in universal "According to psychology…" language. **NEVER mention enneagram by name in the tweet itself.**

### For format 2 (My therapist told me…)

1. Pick a real or composite therapeutic insight DJ knows from enneagram work.
2. Make it sound like a remembered moment, not a definition.
3. End with a one-line click or twist.

### For format 3 (How to deal with [X])

1. Pick one enneagram type's pattern most-asked-about in DJ's existing blog traffic (e.g., 8, 4, 9).
2. Translate to descriptive identity: "someone with an avoidant attachment style" → "someone with a fortress emotional style" or "someone who shuts down when criticized."
3. List 3–5 specific behaviors with a one-line reframe each.

### For format 4 (Type-as-identity one-liner)

1. One sentence. One type. Self-deprecating + specific.
2. Examples to ride:
   - "my type 3 brain wakes up at 5am with a to-do list i never agreed to"
   - "being a 5 means having 47 browser tabs and zero of them are the one i was actually working on"
   - "my type 9 personality is just 'sure whatever' three times in a row until i suddenly explode in the car alone"
3. Optional: drop the type number; just describe the behavior. Lets non-typologists relate too.

### For format 5 (Satirical "Just heal your X" list)

1. Take a common enneagram-coaching cliché.
2. Multiply it absurdly per type.
3. Example skeleton:
   > "It's honestly so simple. Just heal your nervous system. Stop avoiding intimacy if you're a 5. Stop performing if you're a 3. Stop weaponizing your sadness if you're a 4. Stop blowing up the room to test loyalty if you're an 8. Stop being 'fine' if you're a 9. Easy."

### For format 6 (Personality types of [pop culture])

1. Check Twitter Trending today (`https://x.com/explore`).
2. Pick one trending TV show / film / album / K-pop comeback / sports moment.
3. Type the main characters/people. Use **both** MBTI AND enneagram if MBTI typing already exists — this hijacks the MBTI search traffic.
   - Example: "Jungkook says he's MBTI ISFP. In enneagram that maps to 9w1 — here's the tell: …"
4. Anime + K-pop overweight: they have 800K-1M view ceilings.

### For format 7 (Reply-bait list)

1. Format: "Reply with your enneagram type, I'll [do X]."
2. X must be tangible and fun. Examples:
   - "I'll guess your breakup texting style"
   - "I'll guess your most-used productivity app"
   - "I'll guess what you'd order at a diner at 2am"
   - "I'll tell you the song lyric you'd put in your bio at 17"
3. Commit to replying to every response in the first 4 hours. **The replies are the engagement** — the post is the bait.

---

## Phase 2: Apply the DJocrates voice

(See `.claude/commands/twitter-warmup.md` "DJocrates Voice Model" section for full rules. Inlined essentials:)

- **Attack + Hug** in every post: uncomfortable specific truth, then mechanism/reframe.
- **Specificity that feels like espionage.** "Type 4s romanticize their seasonal depression because at least it's _theirs_."
- **Cut every filler word.** First line must stand alone.
- **No corporate voice. No "great point!" No em-dashes everywhere.**
- **Lowercase OK** when format suggests it (one-liners especially).

---

## Phase 3: Output 3 variations

Never output just one. Always 3 variations:

```markdown
### Variation A — [hook angle]

[tweet text]
[character count]

### Variation B — [hook angle]

[tweet text]
[character count]

### Variation C — [hook angle]

[tweet text]
[character count]
```

For each, note:

- **Format used:** [1–7]
- **Visibility level:** 0 (no enneagram mention) / 1 (soft reference) / 2 (direct enneagram)
- **Posting recommendation:** Plain text / Image attached / Thread continuation if more depth

---

## Phase 4: Hard rules (kill switches)

A draft is REJECTED and rewritten if any of these are true:

- ❌ Contains a link card to 9takes.com or any external URL (kills reach — proven in audit). Link goes in bio or in a reply, never in the main tweet.
- ❌ Uses `#enneagram` as the _primary_ hook. Hashtag is dead. Use it sparingly at end, never to lead.
- ❌ Opens with "Doing a series on…" or any throat-clearing brand voice. (DJ's Mar 28-29 posts using this got 4-8 views.)
- ❌ More than 1 em-dash in a tweet under 280 chars (voice fail).
- ❌ Uses "tend to," "might," "interesting," "great point," "we at 9takes." Auto-rewrite.
- ❌ Reads like a blog intro (declarative + multi-clause + signposting). Tweets are not blog intros.

---

## Phase 5: Log + queue

Append the chosen variation (or all 3, if DJ wants to A/B over days) to:

`docs/twitter/queue/YYYY-MM-DD_post-queue.md`

Format:

```markdown
### [date+time] — Format [N] — Level [0/1/2]

> [tweet text]
> **Hook:** [what makes this work]
> **Posted:** ☐ pending / ☑ [datetime]
> **Result (24h):** [views] views, [likes] likes, [replies] replies, [RTs] RTs
> **Result (7d):** [same metrics]
```

After 7 days, this queue doubles as the training data for which formats work for DJ specifically.

---

## When complete

Output to DJ:

```
3 variations ready for [date]. Format: [N — name].

Recommended: Variation [A/B/C] because [reason].

Paste-and-post or hand to /next-tweet for scheduling.

Logged in docs/twitter/queue/[file].
```

---

_Last updated: 2026-05-19_
