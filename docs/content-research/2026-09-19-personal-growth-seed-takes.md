<!-- docs/content-research/2026-09-19-personal-growth-seed-takes.md -->

# Personal Growth Seed Takes: The "What Do You Need to Hear" Question (v1 draft)

Question: "When you're stuck, what do you actually need someone to say to you?"
Backing question: not created yet. After DJ creates it, replace the placeholder on the next line with its real slug.
Backing slug: /questions/<replace-with-slug-after-creation>

Host blog: `src/blog/enneagram/enneagram-personal-growth.md` (StrategicQuestion widget goes after the "The advice you give is usually your own medicine" section, before "Where to go next").

## Why this question

The page's two walkaways are (1) understand your own feeling and pattern and (2) realize other people need different advice from you. This question forces (1) before the reveal: to answer, the reader has to name what they actually need. The reveal then delivers (2): nine type-labeled answers that need nine visibly different things. The 9 wants to be asked and waited on, the 6 wants a concrete plan, the 8 wants to be left alone for a day. The reader sees their go-to advice fail most of the room.

Alternate question if DJ prefers something lighter and more venting-shaped: "What's the advice everyone gives you that has never once worked?"

## Same rules as wave 1 (see 2026-07-15-wave1-seed-takes.md)

- Anonymous, type-labeled voices only in the widget reveal. No usernames, no avatars, never posted as comments or fake accounts.
- Seeds are scaffolding. As real answers arrive, the best real take per type replaces its seed (DJ curates).
- Each take is written from a hidden persona (never displayed) with a per-type response profile. Uniform length or polish is an automatic fail.
- No em-dashes (the seed script rejects them).

| Type | Would they even answer this?   | Length           | Texture                                               |
| ---- | ------------------------------ | ---------------- | ----------------------------------------------------- |
| 1    | Yes, wants to get it right     | Medium           | Precise, a little formal, cares who says it           |
| 2    | Answers for other people first | Medium-long      | Warm, catches the deflection, the real need slips out |
| 3    | Yes, fast                      | Short            | Crisp, one crack at the end                           |
| 4    | Eagerly                        | Longest          | Interior, specific about sequence and timing          |
| 5    | Minimally                      | Shortest-ish     | Three flat sentences                                  |
| 6    | Yes, with hedging              | Medium           | Parentheticals, "is that weird?"                      |
| 7    | Joke first, then one real line | Medium-short     | Lowercase, pivots back to fun                         |
| 8    | Barely                         | Shortest         | Blunt, reframes the need as a timeline                |
| 9    | Eventually, trails in and out  | Long, meandering | Self-interrupting, the real answer sneaks out late    |

## Steps to go live (DJ-owned steps marked)

1. **DJ:** edit the nine takes below until each sounds like a real person. Delete anything that sounds like a paraphrase of the blog.
2. **DJ:** create the question on the site's Create Question page under your own account, then post your real answer first so it never sits at zero.
3. Replace the slug placeholder above, then `node scripts/seed-strategic-question.mjs --file=docs/content-research/2026-09-19-personal-growth-seed-takes.md --dry-run`, then run it without `--dry-run`.
4. Add the widget to the blog with the new question's numeric id and slug, `blogSlug="enneagram-personal-growth"`, and a new `campaign` value such as `wave2-growth`.

**DJ: edit freely, then say go.** Nothing touches the database until you approve.

---

**Type 1** _(persona: high school chemistry teacher, mid-40s, grades papers on Sunday nights)_

That it's good enough to stop. Specifically from someone whose standards I respect, because if it comes from someone who never checks anything, it doesn't count. I can tell when I'm being managed. What helps is a person who actually looked at the thing carefully and says "this is done, and it's right." Then I can put it down.

**Type 2** _(persona: pediatric nurse, late 30s, keeps the group chat's birthday list)_

Oh, I'm usually the one saying things to other people, so let me think. For them I'd say "you're doing so much, let someone help." For me? Honestly I think it's "you don't have to fix this for anyone." Or just someone asking what I want and meaning it. That one gets me every time, and it almost never happens.

**Type 3** _(persona: product marketing lead, early 30s, typed this between calls)_

"You don't have to have this figured out by Friday." Nobody says it to me because I look like I already have it figured out. I usually don't.

**Type 4** _(persona: freelance illustrator, late 20s, has journals going back a decade)_

I need someone to let me stay in it for a minute. When I'm stuck it's usually because something hurt and I haven't found the shape of it yet, and people jump straight to solutions, which feels like being told the feeling was a mistake. What actually works is weirdly specific: someone saying "that makes sense, of course you feel that," and then later, not right away, "want to make something out of it?" The first part lets me land. The second part gets me moving. If you skip to the second part I just go further inside.

**Type 5** _(persona: data engineer, 30s, answered in one pass and closed the tab)_

A concrete next step, then silence. No pep talk. Just the step.

**Type 6** _(persona: HR coordinator, late 20s, rereads everything before posting)_

Honestly? "Here's what I'd do." An actual plan, from someone I trust, that I can push against. Not "you'll figure it out" (I won't, I'll spiral) and not "trust yourself" (how??). Once there's a real option on the table I usually end up tweaking it into my own thing and I'm fine. Is that a weird answer? It kind of feels like cheating.

**Type 7** _(persona: event producer, late 20s, typing on a phone at a bar)_

lol what I WANT to hear is "it's not a big deal, let's go get tacos." what I need is someone going "ok but what's actually bugging you" and then not letting me change the subject. which I will try to do. several times. anyway tacos though

**Type 8** _(persona: general contractor, mid-40s, only answered because a friend sent the link)_

Nothing. Give me a day. If I still need something after that I'll ask, and you'll know I mean it.

**Type 9** _(persona: library assistant, 30s, started typing, stopped, came back)_

hm. I think I'd want someone to ask me what I want and then wait? like really wait. because my first answer is always "whatever works" and people take it, which, fair, I said it. but if someone just sat there for a second I think the real thing would come out. I don't know. also maybe a deadline honestly. someone saying "by Thursday." that sounds bad but it helps
