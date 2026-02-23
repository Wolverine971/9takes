# Distribute - Celebrity Blog Distribution Asset Generator

You are tasked with creating a comprehensive distribution plan for a 9takes celebrity personality analysis blog. When invoked with a person's name, you generate ready-to-use outreach assets: Twitter/X threads, Reddit posts, email pitches, fan account targets, and a direct outreach message.

## Input

The user provides: **$ARGUMENTS** (a person's name, e.g., "Theo Von", "Pedro Pascal")

If no name is provided, respond:

```
Ready to create a distribution plan. Give me a person's name and I'll:

1. Read their blog and extract the best hooks
2. Research their fan communities and reachable accounts
3. Generate Twitter threads, Reddit posts, email pitches, and DM templates
4. Create a full distribution asset file

Example: /distribute Theo Von
```

Then wait for the person's name.

## Pre-Approved Operations

- **Read**: All files in the project
- **WebSearch**: Research fan accounts, subreddits, newsletters, podcasts about the person
- **Glob/Grep**: Searching for files and content
- **Write**: Creating files in `docs/distribution-assets/`
- **Edit**: Updating `docs/distribution-assets/LAUNCH-CHECKLIST.md`
- **Bash**: `ls` commands only

## Task Tracking

Use TaskCreate/TaskUpdate to track progress through the workflow. Create 6 tasks at the start:

1. Look up person metadata & read blog
2. Extract hooks, quotes, and signature details
3. Research fan communities & outreach targets
4. Generate distribution assets
5. Write distribution file
6. Update launch checklist

---

# Workflow

## Step 1: Look Up the Person

### 1a. Find in famousTypes.ts

Read `src/lib/components/molecules/famousTypes.ts` and find the person. Extract:

- **Enneagram type** (which number key they're under: 1-9)
- **contentGrade** (the score)
- **lastmod** (last updated date)
- **personaTitle** (if exists)
- **link** (whether published)
- **hasImage**

If the person is NOT found, tell the user and ask if they want to proceed anyway (they may have an unpublished draft).

### 1b. Read the Blog

Try to read the blog content in this order:

1. `src/blog/people/drafts/[Person-Name].md` (most common location)
2. Try name variations if not found (e.g., "D'Amelio" → "DAmelio", "Charli xcx" → "Charli-xcx")

If no blog is found, stop and tell the user.

### 1c. Extract Key Information from the Blog

Read the full blog and identify:

- **The hook moment**: The most surprising, specific, vulnerable, or revealing anecdote (this becomes Tweet 1 and the Reddit opener)
- **3-5 best direct quotes**: The person's own words that reveal their inner world
- **The "signature detail"**: A small, specific moment that makes the entire personality analysis click
- **The childhood/origin pattern**: What shaped them
- **The contradiction**: The public/private gap or internal tension
- **The breaking point**: Health crisis, career failure, relationship collapse — where the mask slipped
- **The Enneagram "aha"**: The moment where the type explains something non-obvious

**Quality gate**: If contentGrade is below 8.0 (B), warn the user:

```
⚠️ Content grade is [X] ([letter]). Distribution works best with B+ (8.5+) content.
Consider upgrading the blog first with: /grade_blog [Person]
Proceed anyway? (The distribution file will note areas to strengthen.)
```

Wait for confirmation before continuing.

---

## Step 2: Research Fan Communities & Outreach Targets

Launch parallel research sub-agents using the Task tool to investigate:

### 2a. Reddit Communities (WebSearch)

Search for: `"[Person Name]" site:reddit.com subreddit`

Find:

- **Dedicated subreddit** (r/[PersonName] or similar)
- **Relevant niche subreddits** (e.g., r/popheads for musicians, r/startups for founders, r/movies for actors)
- **r/Enneagram** — always included
- Note subscriber counts and activity level if visible

### 2b. Twitter/X Fan Accounts (WebSearch)

Search for: `"[Person Name]" fan account site:twitter.com OR site:x.com`

Find:

- **3-5 major fan accounts** with handles
- **The person's official handle**
- **Related media accounts** that cover them (e.g., podcast clip accounts, entertainment news)

### 2c. Newsletters, Podcasts & Media Outlets (WebSearch)

Search for: `"[Person Name]" personality OR psychology OR profile newsletter OR podcast`

Find:

- **2-4 relevant newsletters or publications** that cover this person or their industry
- **Contact info** (email, contact form URL, or Substack reply)
- **Relevant podcast hosts** who've discussed this person

### 2d. Platform Presence

Determine where this person is most active and reachable:

- Twitter/X (active? engages with fans?)
- Instagram (DMs open?)
- TikTok (comment section accessible?)
- YouTube (community tab?)
- LinkedIn (for business/tech figures)
- Personal website/contact form

### 2e. Categorize the Person

Determine their **outreach tier**:

- **Tier A: Direct Reachable** — Under 2M followers, active on social, known to respond to interesting content (most podcasters, smaller creators, tech founders, politicians)
- **Tier B: Fan Community Route** — Major celebrity, 2M+ followers, unlikely to see a DM but has massive fan communities (A-list actors, major musicians, top politicians)
- **Tier C: Hybrid** — Big name but known to engage on specific platforms (e.g., Elon on X, Dave Portnoy on X)

---

## Step 3: Generate Distribution Assets

Using the blog content, extracted hooks, and research, generate the following sections. Follow the **exact format** used in the existing distribution files (see Reference Examples below).

### Section A: Twitter/X Thread (6 tweets)

**Structure:**

- **Tweet 1 (Hook)**: The most surprising, specific moment from the blog. Must be concrete — a scene, a quote, a contradiction. NOT "Did you know [Person] is interesting?" End with 🧵
- **Tweet 2**: Expand on the contradiction or origin story. Include a direct quote if possible.
- **Tweet 3**: The turning point, breaking moment, or signature detail. This should be the emotional peak.
- **Tweet 4**: The Enneagram insight — what drives them underneath. Include their own words.
- **Tweet 5**: The most revealing quote from the blog — the one that stops someone scrolling.
- **Tweet 6**: CTA — "I wrote a full personality analysis of [Person] through the Enneagram framework — [one-line description of the central tension]. Full analysis: [LINK]"

**Tweet quality rules:**

- Each tweet must stand alone as interesting content (not just a thread connector)
- Use the person's own words, not your summary
- Specific > general. "He studied which shoulder kids carried their bags on" > "He was observant as a child"
- No hashtags in the thread itself (hashtags go in the separate section)

### Section B: Reddit Posts (2-3)

**Post 1: r/Enneagram**

- Title format: `Type [X] Case Study: [Person] — [Hook phrase]`
- Body: 300-500 words. Lead with context on who the person is, then present 4-6 bullet points of Enneagram evidence. Include: stress/growth arrows, wing analysis, counter-typing consideration, at least 2 direct quotes. End with link and discussion prompt: "What type do you think [Person] is? I'd love to hear counterarguments."

**Post 2: Person-specific or fan subreddit**

- Title format: `The psychology behind why [Person's specific trait/behavior] — a personality analysis`
- Body: 250-400 words. Frame it for fans, not Enneagram nerds. Lead with an observation fans would recognize ("Why does [Person]'s [thing] hit different?"). Explain through personality patterns without heavy jargon. End with link and discussion prompt.

**Post 3 (optional): Interest-based subreddit**

- Only include if there's a clear topical subreddit (r/startups, r/movies, r/hiphopheads, etc.)
- Frame around the industry angle, not the personality framework

### Section C: Email Pitches (3-5)

For each target identified in Step 2c, write a personalized email pitch:

**Format:**

```
### To: [Person/Outlet] ([contact info])

\`\`\`
Subject: [Specific, relevant subject line — reference their content]

Hi [Name],

[1 sentence: why you're reaching out to THEM specifically — reference something they published]

[2-3 sentences: the core insight from your analysis that THEIR audience would care about]

[1 sentence: what makes this analysis different from typical celebrity coverage]

Full piece: [LINK]

[1 sentence: offer — happy to adapt, provide quotes, collaborate]

DJ Wayne
9takes.com
\`\`\`
```

**Always include:**

1. **2-3 industry-relevant outlets** (newsletters, publications, podcasts)
2. **1 direct pitch to the person** (if reachable — contact form, DM, or email)
3. **1 cross-cutting Enneagram outlet** (from the standard list below)

**Standard cross-cutting outlets:**

- Enneagram Universe: enneagramuniverse.com/celebrities
- Truity Blog: truity.com/blog
- Psychology Junkie: psychologyjunkie.com

### Section D: Direct Outreach Message

If the person is Tier A or Tier C (reachable), write a tailored DM/message:

**Format:**

```
### Direct Message to [Person] (via [Platform])

[2-3 sentence message: tell them you wrote a personality profile, reference one specific insight that would intrigue THEM specifically, link, no pressure]
```

**Tone calibration by person type:**

- **Podcasters/media**: Frame as "content they could react to" — "Mapped your interview patterns through the Enneagram..."
- **Tech/business**: Frame as "framework for understanding yourself" — "I decoded your decision-making patterns..."
- **Comedians**: Keep it light — "Wrote a personality profile that explains why your comedy works. Not a roast, but you might want to roast it"
- **Musicians/actors**: Frame as emotional insight — "I wrote a deep analysis of what drives you underneath the public image..."
- **Politicians/activists**: Frame as analytical — "I mapped the personality patterns behind your political approach..."

### Section E: Fan Account Outreach (Tier B & C only)

If the person is too big to DM directly, list specific fan accounts to target:

```
### Fan Account Targets

| Platform | Account/Community | Followers/Members | Approach |
|----------|------------------|-------------------|----------|
| Reddit   | r/[subreddit]    | [count]           | Post personality analysis |
| X        | @[fan_account]   | [count]           | Tag with thread link |
| TikTok   | @[fan_account]   | [count]           | Comment with link |
| Tumblr   | [tag/community]  | —                 | Post in tag |
| Discord  | [server name]    | [count]           | Share in relevant channel |
```

### Section F: Platform-Specific Hashtags

```
**Twitter:** #[PersonName] #[NicheTag] #Enneagram #[IndustryTag] #[TypeTag]
**Reddit tags/flairs:** [Note required flairs for each subreddit]
**TikTok:** #[PersonName] #personalitytype #enneagram #[niche]
```

---

## Step 4: Write the Distribution File

Write the complete distribution asset to:

```
docs/distribution-assets/[person-name-lowercase]-distribution.md
```

File format:

```markdown
<!-- docs/distribution-assets/[person-name]-distribution.md -->

# [Person Name] - Distribution Assets

> Enneagram Type: [X] | Content Grade: [X.X] ([Letter]) | Last Updated: [Date]
> Blog URL: /personality-analysis/[Person-Name]
> Outreach Tier: [A/B/C] — [one-line reason]

## Twitter/X Thread

[Generated thread]

---

## Reddit Posts

[Generated posts]

---

## Email Pitches

[Generated pitches]

---

## Direct Outreach

[Generated DM or fan account targets]

---

## Platform-Specific Hashtags

[Generated hashtags]

---

## Distribution Checklist

- [ ] Twitter thread posted (8-10 AM EST)
- [ ] Reddit r/Enneagram post (Day 2-3)
- [ ] Reddit fan/niche subreddit post (Day 3-4)
- [ ] Email pitches sent (Day 4-7)
- [ ] Direct outreach / fan account tagging (Day 8-14)
- [ ] Reactive posts when person is in the news (Ongoing)
```

---

## Step 5: Update Launch Checklist

Edit `docs/distribution-assets/LAUNCH-CHECKLIST.md`:

1. Add the person to the **Launch Order** table
2. Add their email contacts to the **Quick Reference: Email Contacts** section
3. Add their file to the **Files Created** tree

---

## Step 6: Report to User

Present a summary:

```
## Distribution Plan Created: [Person Name]

**File:** docs/distribution-assets/[person-name]-distribution.md

**Blog:** [Grade] ([Score]) | Type [X] | [personaTitle or "No persona title"]

### Assets Generated:
- Twitter/X thread (6 tweets) — Hook: "[first line of tweet 1]..."
- Reddit posts: [list subreddits]
- Email pitches: [list targets]
- [Direct DM template / Fan account targets]: [list]

### Recommended Launch Timing:
- [Based on content freshness and current events relevance]

### ⚠️ Pre-Launch Checks:
- [ ] Blog is live at 9takes.com/personality-analysis/[Person]
- [ ] Replace all [LINK] placeholders with actual URL
- [ ] Review and personalize email pitches
- [ ] Check subreddit rules before posting
```

---

# Reference Examples

The following existing distribution files define the quality standard. Match their specificity, emotional depth, and format:

- `docs/distribution-assets/shawn-ryan-distribution.md` — Best example for podcasters/military
- `docs/distribution-assets/chris-williamson-distribution.md` — Best example for media/podcasters
- `docs/distribution-assets/john-coogan-distribution.md` — Best example for tech/startup founders
- `docs/distribution-assets/benson-boone-distribution.md` — Best example for musicians/entertainers

When generating new assets, read at least 2 of these files to calibrate the tone, specificity, and depth of the output.

---

# Quality Rules

1. **Specificity over generality.** "He reconstructed the scene like a crime analyst — hot garage door, running car, reclined seat" > "He had a dark period."
2. **Their words, not yours.** Use direct quotes as structural material, not decoration.
3. **Each piece must stand alone.** A Reddit post should work even if the reader never clicks the link.
4. **Platform-native writing.** Twitter threads read like Twitter. Reddit posts read like Reddit. Emails read like emails. Don't write the same content in three formats.
5. **The hook is everything.** If Tweet 1 and the Reddit title don't stop someone scrolling, the rest doesn't matter.
6. **Authenticity over marketing.** Position as "I write personality analyses" not "Check out my site." The analysis IS the value — the site is just where it lives.
7. **Discussion prompts, not CTAs.** End Reddit posts with genuine questions, not "Subscribe to my newsletter."
