<!-- .claude/commands/blog_refresh_people.md -->

# Blog Refresh (People) — News Into an Existing Analysis

You update a **live, ranking** personality analysis when something has happened to the subject since it was last edited.

This command exists because refreshes were being hand-rolled from taskers, and taskers are written as lists of things to add. The result is measurable: by 2026-07-25 the most-refreshed pages in the corpus were also the longest, `hasan-piker` had reached 8,881 words, and 90 of 391 published pages sat over the length ceiling. Creation has a pipeline with gates. Maintenance had prose and good intentions.

## Input

A person's slug (`Hasan-Piker`), a draft path, or `current draft`, optionally followed by what happened.

`$ARGUMENTS`

## Pre-Approved Operations

- **Read / Glob / Grep**: locating and reading the draft, taskers, and GSC data
- **Edit / Write**: the target draft in `src/blog/people/drafts/` and its durable evidence file at `docs/content-analysis/research/[Person-Name].md`
- **WebSearch / WebFetch**: verifying every factual claim you add
- **Bash**: `grep`, `awk`, `wc`, `ls`, `test`, `node`, `./scripts/blog-lint.sh`, `./scripts/blog-quality-report.mjs`, `./scripts/blog-source-audit.mjs`, `node scripts/personBlogParser.js <Person>` (dry run only)

Never run `personBlogParser.js --apply` or `--publish` from this command. Shipping is a separate, human-approved step.

---

## The main rule

**The personality analysis is the product. News is evidence, and only when it deepens the analysis.**

9takes is not a news outlet. Nobody arrives at this page to find out what happened; they arrive to understand what kind of person this is. An event earns space on the page only if a reader finishes that passage understanding the subject better than they did before it.

Everything below is machinery for enforcing that one sentence.

---

## The admission test

Run **every** candidate news item through this before a single word goes in. Assign it a tier, and write the tier down. You will report these.

**Tier 1 — Deepens.** The event reveals a facet the page has not shown, complicates the type read, or supplies the first real evidence for a claim the page was asserting without it.
→ Earns prose. A subsection, sometimes a section.

**Tier 2 — Confirms.** The event is more evidence for a pattern the page already establishes with other examples.
→ Earns a clause, a bullet in an existing list, or a date in a timeline. **Never a new section.** This is where bloat comes from. A page that has already proven a pattern three times gets nothing from proving it a fourth time in prose.

**Tier 3 — Neither.** It happened, it was covered, it says nothing about who this person is.
→ **It does not go in the blog.** Not compressed, not in a footnote. Out. This is a personality analysis, not a Wikipedia current-events section.

Most news is Tier 2 or Tier 3. If your triage comes back mostly Tier 1, you are grading yourself generously. Redo it and be honest about which events genuinely told you something new.

The tell for a Tier 3 item that snuck in: a paragraph that reports what happened, who objected, and what the subject said back, and never once names a behavior pattern, a feeling underneath, or a cost. That paragraph would sit comfortably in a news roundup. Cut it.

---

## The budget

**Hard ceiling: 4,500 words of prose.** `blog-lint.sh` fails the draft above it.

The ceiling is a bloat alarm rather than a performance target. Per-page variance is enormous and the best-converting page in the corpus runs 4,771 words. What the ceiling reliably catches is accretion: a page that got long by having things added to it rather than by being written that way.

Three operating rules:

1. **If the page is already over 4,500, the refresh must bring it down.** You may not add net words to a page that is already over. Find the cuts first.
2. **If the page is near the ceiling, spend from it deliberately.** Adding 400 words at 4,300 is a decision to cut 200 elsewhere, not an accident to discover at lint time.
3. **If the page is comfortably under, you still do not get to fill the gap.** Headroom is not a quota. A 3,200-word page that says everything worth saying stays 3,200 words.

Deliberate exceptions exist (`BLOG_LINT_WORD_CEILING=<n>`), but the bar is an argument for why this specific page needs the room, recorded in the refresh ledger. Never use it to quiet a page you have not examined.

---

## Step 1: Measure before you touch anything

```bash
./scripts/blog-lint.sh <Person-Name>
node scripts/blog-quality-report.mjs <Person-Name>
node scripts/blog-source-audit.mjs <Person-Name> --fail-on-untagged-load-bearing
```

Record the starting word count from the lint output. That number is your baseline and it goes in the ledger.

Then read the **entire** draft before deciding anything. You cannot judge whether an event is Tier 1 or Tier 2 without knowing what the page already proves. Skipping this step is the single most common cause of a bloated refresh: an agent that has not read the page assumes everything is new.

---

## Step 2: Research and verify

Every factual claim you add needs a real, checkable source. This corpus has a documented history of fabricated citations and has published at least one legal-risk claim.

- Attribute characterizations, never assert them. "The ADL criticized X" is reportable. "X was antisemitic" is not something the page asserts.
- Report legal and legislative status precisely. Introduced is not passed. A subpoena is not a charge. An inquiry is not a finding.
- If you cannot source it, cut it.
- Add real sources to the `citations` frontmatter array.
- Add accepted, verified refresh evidence to `docs/content-analysis/research/[Person-Name].md`, including event date, publication date, URL, source tier, and what it can support. Preserve contrary evidence and rejected/unverified claims so the later perspective jury does not have to rediscover them.

---

## Step 3: Triage, and write the cut list before the add list

Produce two lists, in this order:

**Cuts.** What comes out. Look hardest at:

- Sections that duplicate a quote or anecdote already used elsewhere (the creator spec: quotes appear once)
- Type-theory exposition. The spec ceiling is **4 type-theory paragraphs** outside the diagnosis section and the Rabbit Hole. Count them. Anything over is the cheapest cut on the page.
- Chronological lists of controversies. Three instances that share a mechanism beat six in date order, and cost half the words.
- Colour that does not carry the argument. Test each anecdote: does a reader understand the person better after it, or did they just enjoy it?
- Any prior refresh's Tier 2 material that was given prose when it deserved a clause.

**Adds.** Tier 1 items in full, Tier 2 items as clauses. Tier 3 does not appear on this list.

If the add list is longer than the cut list on a page near the ceiling, you have not finished triaging.

---

## Step 4: Integrate, do not append

The failure mode this command exists to prevent is a sharp new section bolted onto the back of a stale page, leaving two documents stapled together with the argument starting halfway down.

- New material goes **where the argument needs it**, not at the end.
- If the news changes the page's spine, rewire the page around the new spine. Do not leave the old thesis in the first half and the new one in the second.
- If the news does not change the spine, it is evidence, and evidence lives next to the claim it supports.
- Preserve every heading referenced by a `faqs[].anchor`. Changing heading **case** is safe (slugs lowercase); changing heading **words** means updating the FAQ anchor in the same edit.

**Do not let the news reset the thesis.** These pages have a type read that already ranks. You are adding evidence to an existing argument. If the news genuinely contradicts the established type, stop and report it rather than silently re-typing the subject.

---

## Step 5: Answer the depth questions in the published copy

A refresh that only reports is not a refresh. For the material you admitted, the page must answer, in the prose a reader actually sees:

1. **The feeling underneath** — anchored to the center of intelligence (gut 8/9/1 anger, heart 2/3/4 shame, head 5/6/7 fear). "Anger" is not an answer. "Anger that only fires on someone else's behalf" is.
2. **Whether this is evidence for, against, or complicating the type read.** Say it out loud. If every event conveniently confirms, that is motivated reasoning and readers smell it. Name what does not fit.
3. **Stress or integration** — which way is the arrow pointing under this specific pressure. This is the most falsifiable claim the Enneagram permits about a live event.
4. **The cost.** What did this event cost this person that a different type would not have paid?

Keep observation and interpretation visibly separate. Write "he did X," then "which reads as Y." Never "he felt Y."

Date-stamp each event once, then stop saying "recently," "this week," or "currently." The page must still read in twelve months.

---

## Step 6: Verify

```bash
./scripts/blog-lint.sh <Person-Name>
node scripts/blog-quality-report.mjs <Person-Name>
node scripts/blog-source-audit.mjs <Person-Name> --fail-on-untagged-load-bearing
node scripts/personBlogParser.js <Person-Name>   # dry run; confirms lastmod is untouched
```

Hard requirements:

- Body at or under 4,500 words, and not above where it started
- Zero prose em-dashes
- Zero untagged load-bearing quotes
- Valid YAML in FAQ frontmatter (`''` not `\'`; one bad draft fails the whole build)
- Every `faqs[].anchor` resolves to a real heading
- No `<!-- QUALITY GRADE` or `QUALITY_FEEDBACK` comments
- `lastmod` unchanged. **Never** hand-edit it, and never run `--publish` on a live page

**Clear the `content_quality` block.** A refresh invalidates the previous grade, and leaving it anchors the regrade. Removing it is what the pipeline's own `clear_grading_frontmatter()` does before every grade stage. The page needs a fresh `/grade_blog` before it ships.

---

## Step 7: Write the refresh ledger

Append or update this HTML comment in the draft. `blog-lint.sh` exempts comments from the em-dash and prose checks, and `personBlogParser.js` strips them on push, so this never reaches production.

```
<!-- REFRESH LEDGER YYYY-MM-DD
Trigger: what happened / which tasker
Baseline: N words -> M words

ADMITTED
  T1 <event> — what it revealed that the page could not show before
  T2 <event> — folded into <section> as a clause

REJECTED
  T3 <event> — reported everywhere, says nothing about who he is

CUT TO PAY FOR IT
  <section or passage> (N words) — why it was expendable

Spine: unchanged | rewired to "<new spine>"
Type read: unchanged | complicated by <evidence>
-->
```

---

## Step 8: Report

Give the human:

1. Word count before and after, against the 4,500 ceiling
2. The tier triage: what was admitted, what was cut, what was rejected outright and why
3. What complicated the type read. A refresh that only confirms is a weak refresh, and saying so is more useful than pretending otherwise
4. Anything you cut for legal or sourcing reasons
5. Lint, quality-report and source-audit state, with pre-existing failures separated from ones this refresh introduced
6. The exact dry-run hash and approve-fields token for shipping, and the reminder that **nothing has been written to the live DB**

Do not ship. A human approves the push.
