<!-- docs/distribution-assets/LAUNCH-CHECKLIST.md -->

# Master Launch Checklist

> Copy this for each blog. Check off items as you go.

---

## Pre-Launch (Before Publish Day)

- [ ] Blog is finalized and reviewed
- [ ] Publish via admin content-board (`/admin/content-board/personality-analysis/`)
- [ ] Verify live at `9takes.com/personality-analysis/[Person]`
- [ ] Run blog indexing: `node scripts/index-blogs-to-supabase.js`
- [ ] Copy distribution assets from `docs/distribution-assets/[person]-distribution.md`
- [ ] Customize email pitches with specific [LINK] URLs
- [ ] Prepare Twitter thread in drafts
- [ ] Prepare Instagram carousel copy + caption from distribution file
- [ ] Confirm Instagram bio link points to the target blog URL
- [ ] Prepare Instagram story poll question and follow-up story text

---

## Launch Order

| Priority | Person                  | Blog URL                                 | Twitter Thread        | Instagram Assets          | Reddit (Enneagram)           | Reddit (Fan Sub)                          | Emails                                                        |
| -------- | ----------------------- | ---------------------------------------- | --------------------- | ------------------------- | ---------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| 1        | Shawn Ryan              | `/personality-analysis/Shawn-Ryan`       | See distribution file | Carousel + Stories + Reel | r/Enneagram, r/ShawnRyanShow | r/Military, r/JoeRogan                    | Task & Purpose, SOFREP, Coffee or Die                         |
| 2        | Chris Williamson        | `/personality-analysis/Chris-Williamson` | See distribution file | Carousel + Stories + Reel | r/Enneagram                  | r/DecodingTheGurus, r/IntellectualDarkWeb | Jay Clouse, Aporia, Chris directly                            |
| 3        | John Coogan             | `/personality-analysis/John-Coogan`      | See distribution file | Carousel + Stories + Reel | r/Enneagram                  | r/startups (with mod approval)            | Startup Spells, Cyber Patterns, HackerNoon, John directly     |
| 4        | Benson Boone            | `/personality-analysis/Benson-Boone`     | See distribution file | Carousel + Stories + Reel | r/Enneagram                  | r/bensonboone, r/popheads                 | Switched on Pop, Psychology Junkie, Honey POP, @BooneAccess   |
| 5        | Tech Titans: Disruptors | `/pop-culture/tech-titans-disruptors`    | See distribution file | Carousel + Stories + Reel | r/Enneagram                  | r/startups, r/technology, r/Entrepreneur  | The Diff, Not Boring, Eric Newcomer, Big Think, Farnam Street |

---

## Per-Person Launch Sequence

### Day 1 (Publish Day)

- [ ] Publish blog on 9takes.com
- [ ] Post Twitter/X thread (8-10 AM EST)
- [ ] Post Instagram carousel (11 AM-1 PM EST or 7-9 PM EST)
- [ ] Share carousel to Instagram Story with link sticker
- [ ] Share in 9takes newsletter (if applicable)

### Days 2-3

- [ ] Post to r/Enneagram (Tue-Thu morning)
- [ ] Post to person-specific subreddit (different day)
- [ ] Engage with Twitter replies, quote-tweet with new hook
- [ ] Post Instagram Story poll ("Does this read resonate?" style)
- [ ] Post 24-hour follow-up Story with one insight + link reminder

### Days 4-7

- [ ] Send 3-5 personalized email pitches
- [ ] Post Instagram Reel (optional but recommended)
- [ ] Share in one Enneagram Facebook group
- [ ] Post in Personality Database comments for the person

### Days 8-14

- [ ] Repost Twitter thread with new angle
- [ ] Repost carousel or share top quote as Story for second wave reach
- [ ] Share in Discord communities (Benson Boone Discord, etc.)
- [ ] Post in secondary forums (Personality Cafe, Typology Central)
- [ ] Tag person directly on Twitter if analysis is respectful

### Ongoing

- [ ] When person is in the news, create reactive tweets connecting to analysis
- [ ] Create reactive Instagram Story/Reel linking the news moment back to the analysis
- [ ] Comment on related content across platforms
- [ ] Update blog if new events validate analysis, then redistribute

---

## Spacing Guide

Stagger launches by **5-7 days minimum** per person:

```
Week 1:  Publish Shawn Ryan → Thread → Instagram carousel → r/Enneagram
Week 2:  Publish Chris Williamson → Thread → Instagram carousel → r/Enneagram → Shawn Ryan emails
Week 3:  Publish John Coogan → Thread → Instagram carousel → r/Enneagram → Chris emails
Week 4:  Publish Benson Boone → Thread → Instagram carousel → r/Enneagram → John emails
Week 5+: Secondary distribution for all (stories, reels, forums, Discord, guest posts)
```

---

## Quick Reference: Email Contacts

### Shawn Ryan Targets

- Task & Purpose: tips@taskandpurpose.com
- SOFREP: sofrep.com (use contact form)
- Coffee or Die: coffeeordie.com (use contact form)
- Havok Journal: havokjournal.com (accepts guest contributions)
- Shawn Ryan: @ShawnRyan762 DM or vigilanceelite.com

### Chris Williamson Targets

- Jay Clouse: creatorscience.com (use contact form)
- Aporia Magazine: aporiamagazine.com (Substack reply)
- Courtney Kocak: podcastbestie.substack.com
- Podcast Notes: podcastnotes.org (use contact form)
- Chris directly: chriswillx.com/contact or @ChrisWillx DM on X

### John Coogan Targets

- Startup Spells: startupspells.com (Beehiiv reply)
- Cyber Patterns: cyberpatterns.xyz (Substack reply)
- HackerNoon: contribute.hackernoon.com or Stories@HackerNoon.com
- John directly: @johncoogan DM

### Benson Boone Targets

- Switched on Pop: booking@switchedonpop.com
- Psychology Junkie: psychologyjunkie.com (use contact form)
- The Honey POP: thehoneypop.com (use contact form)
- @BooneAccess: accessbensonboone@gmail.com

### Tech Titans: Disruptors Targets

- The Diff (Byrne Hobart): thediff.co (Substack reply) or @ByrneHobart DM on X
- Not Boring (Packy McCormick): notboring.co or @packyM DM on X
- Eric Newcomer: newcomer.co or @eric_newcomer DM on X
- Big Think: bookings@bigthink.com
- Shane Parrish (Farnam Street): fs.blog contact form or @ShaneAParrish on X

### Cross-Cutting (All Posts)

- Enneagram Universe: enneagramuniverse.com/celebrities
- Truity Blog: truity.com/blog
- Brain Manager: brainmanager.io

---

## Files Created

```
docs/
├── marketing/blog-distribution-strategy.md # Original strategy doc (includes Instagram playbook)
├── blog-distribution-research.md          # Channel research findings
└── distribution-assets/
    ├── LAUNCH-CHECKLIST.md                # This file
    ├── shawn-ryan-distribution.md         # Twitter, Reddit, email, Instagram assets
    ├── chris-williamson-distribution.md   # Twitter, Reddit, email, Instagram assets
    ├── john-coogan-distribution.md        # Twitter, Reddit, email, Instagram assets
    ├── benson-boone-distribution.md       # Twitter, Reddit, email, Instagram assets
    └── tech-titans-disruptors-distribution.md # Twitter, Reddit, email, Instagram assets (group analysis)
```
