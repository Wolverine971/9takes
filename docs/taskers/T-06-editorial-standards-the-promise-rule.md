<!-- docs/taskers/T-06-editorial-standards-the-promise-rule.md -->

# Tasker: Add the Promise Rule to the Editorial Standards

**For:** the agent assigned to codify the one editorial habit that cost ~543 clicks across three pages.
**Owner:** DJ
**Created:** 2026-07-15
**Status:** Not started. Small and unblocked. One file edit plus two optional follow-ons.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §6.3 (the pattern) and §8 item 10 (the ask). Taskers `T-04` and `T-05` fix the individual offending pages; this one prevents the next dozen.

---

## 0. What and why

The 2026-07-15 corpus audit found one editorial habit repeated across three pages: **the page debunks the exact thing the searcher came for.**

| Page                             | Behavior                                                                                                              | Clicks / Impressions / CTR / Position |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `astrology-and-the-enneagram`    | Builds the full zodiac correlation apparatus, then disowns it in section 12 of 13.                                    | 86 / 11,691 / 0.74% / pos 7.7         |
| `enneagram-compatibility-matrix` | Argues type compatibility does not matter, then ranks it for 4,000 words. Also promises 81 combinations and ships 45. | 81 / 10,735 / 0.75% / pos 11.9        |
| `enneagram-test-comparison-2025` | Ranks tests "by accuracy", buries its actual pick at 85% depth, effectively recommends everything.                    | 18 / 7,920 / 0.23% / pos 14.3         |

Combined: **185 clicks / 30,346 impressions / 0.61% CTR.** At the site's proven 2.40% ceiling that is **+543 clicks**. This is one editorial fix, not three tickets, and it will keep costing on every future page until it is written down.

**Why this belongs in the editorial standards and not an SEO doc.** This is a voice rule, not a metadata rule. It follows directly from two things already in the standards:

1. The house writing rhythm is **Hook → Insight → Action step**. A page that hooks with a chart promise and then withholds the chart has inverted its own rhythm: the reader gets hook, then retraction, then nothing to do.
2. The third substance test asks **"Can nobody else say it?"** Withholding the answer is not an answer to that test. The 9takes angle is the framing, not the refusal.

The rule extends the existing standards. It does not bolt a new concern onto them.

---

## 1. Required reading

1. `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §6.3 and §8 item 10. The source report and the ask.
2. `.claude/skills/9takes-editorial-standards/SKILL.md`. The file you are editing. Read the preamble at line 9: "If a rule here conflicts with an inline rule in a command, THIS FILE WINS." That preamble drives §2 of this tasker.
3. `.claude/agents/editor.md` line 41 and `.claude/commands/blueprint.md` line 152. Both reference "the three substance tests" **by name and by count**. This constrains the insertion point.
4. `docs/brand/README.md` and `docs/brand/brand-style-guide-v2.md`. Read only to confirm the §3 decision. Do not edit them.

---

## 2. The edit

**File:** `.claude/skills/9takes-editorial-standards/SKILL.md`

**Insertion point:** after the "The three substance tests" section (ends at line 29), immediately before `## AI-writing tells (kill on sight)` (line 31).

**Placement decision: a new short section, adjacent to the substance tests. Not a fourth substance test, and not under Formatting & readability.**

Justification, in order:

- **Not a fourth substance test.** The trio is referenced by name and count in at least three places: `.claude/agents/editor.md:41` ("the three substance tests (visualizable, falsifiable, ownable)"), `.claude/commands/blueprint.md:152`, and `.claude/commands/content-repurposing-engine.md:212`. Promoting this to a fourth test would silently falsify all three references and force a rename pass across the toolchain. The cost is real and the benefit is zero.
- **Not under Formatting & readability.** That section governs paragraph length, headings, and bullets. The promise rule is not a layout rule. "Above the fold" is where it bites, but _what you owe the reader_ is the substance question. Filing it under formatting would teach future agents it is cosmetic.
- **Adjacent to the substance tests** puts it where an editor is already asking "does this page earn its claim?" and keeps the trio intact.

**Exact markdown to insert:**

```markdown
## The promise rule

The title is a contract. If it promises a chart, a pick, a mapping, or a ranking, the page ships it above the fold. **The caveat qualifies the promise; it never cancels it.** A page that earns the click and then refuses the answer trains the reader not to click again.

This extends the rhythm and the tests above rather than adding a new concern. **Hook → Insight → Action step** inverts when the hook is a chart promise and the chart never arrives: hook, retraction, nothing to do. And "Can nobody else say it?" is never answered by withholding.

Two corollaries:

- **If the honest finding is that the thing is not real, that finding is the angle, not the retraction.** 9takes sells no test and no birth chart, so it is the only participant in this space that can say "these correlations are not statistically real, here is the chart anyway, and here is what the pattern actually reveals about how people self-describe." Placed at the top and framed, that is a differentiator no competitor can copy. Placed at the bottom and unframed, it reads as a betrayal after 5,000 words. Same sentence, opposite value, determined entirely by position.
- **Do not promise a count you do not ship.** "All 81 combinations" delivering 45 is a trust break, and Google can see it in the anchor text.
```

Do not renumber, retitle, or reword any existing section while making this edit.

---

## 3. Where the rule lives (read before duplicating it anywhere)

**Decision: `.claude/skills/9takes-editorial-standards/SKILL.md` is the single source of truth. Do not copy the rule into `docs/brand/brand-style-guide-v2.md`.**

Audit §8 item 10 says "add one line to `docs/brand/` editorial standards". That phrasing is imprecise and predates the skill file's consolidation. The skill file's own preamble already claims source-of-truth status over every editorial tool, and it is the file the editor agent and the editorial commands actually load. `brand-style-guide-v2.md` is a voice and mechanics guide with no rule-precedence claim and no tooling that reads it.

**The repo has already paid for this exact mistake.** `docs/content-analysis/blog-pipeline-audit-2026-06-10.md` §2.8 documents playbook-versus-command drift: the external playbooks disagreed with the creator command and held up an ending cadence as gold standard that the command explicitly banned. Fix item 8 ("De-dupe playbooks vs. creator command; unify AI-ban lists") closed it on 2026-06-10, and the resolution was source-of-truth headers, not synchronized copies. Forking the promise rule into two docs recreates the same failure with a six-week fuse.

**If a `docs/brand/` pointer is wanted**, add a cross-link only, not the rule text. One line under `brand-style-guide-v2.md` §11 (Content Review Checklist) pointing at the skill file is sufficient and cannot drift. This is optional and DJ's call.

---

## 4. Lint: partial at best, and say so

**Recommendation: do not write a lint rule that claims to enforce this. A WARNING-only heuristic is defensible; an error is not.**

You cannot regex "the page refuses its own promise". The refusal is a semantic relationship between a title and a body, and every mechanical proxy for it is wrong in both directions.

What _is_ checkable: flag any article whose **title** matches `chart|matrix|ranking|best|complete|guide to` **and** whose first ~400 words contain no table (`|` row) and no list element (`^[-*]` or `^\d\.`). That catches the astrology and compatibility-matrix shape. It also fires on legitimate essays and misses the test-comparison failure entirely, since that page has lists and still buries its pick. Ship it as **WARN**, never **FAIL**.

Two constraints on where it can go:

- `scripts/blog-lint.sh` exists but its header states it is "Deterministic lint for 9takes personality-analysis drafts". It is people/drafts-calibrated: it hard-requires `person`, `suggestions`, `production_pretext`, type-section headings, and a Rabbit Hole. Running it against enneagram-corner MDsvex blogs produces false FAILs on nearly every check. A promise-rule check added there would only ever see people drafts, which are not where this problem lives.
- The three offending pages are enneagram-corner blogs. Any check that is supposed to catch them needs a linter that runs on that corpus, and no such linter exists today. Building one is out of scope for this tasker.

**Real enforcement is human review at title-choice time.** State that plainly in any follow-on rather than letting a WARN rule imply coverage it does not have.

---

## 5. Command inlining

The rule should reach the drafting and grading commands, but follow the house convention: **load-bearing context is inlined into `.claude/commands/` files, not out-linked**, because agents do not reliably follow links. The skill file stays canonical; the commands carry the rule text where it is load-bearing.

Inline the rule (or the one-sentence core plus the two corollaries) where a title or an outline is chosen:

- `.claude/commands/write_amazing_blog.md` (§ Writing Quality Standards, near "Be Prescriptive, Not Descriptive")
- `.claude/commands/blueprint.md` (§7, alongside the already-inlined substance tests)
- `.claude/commands/grade_blog.md` (Search & Discoverability, weight 1.5x, already a gate)

Commands that already reference the skill by name (`/deai`, `/copywriting-pass`, `/blog_content_editor_pass_people`, `.claude/agents/editor.md`) need no inlining. They load the file.

This step is a follow-on. The standards edit in §2 is done and useful without it.

---

## 6. Verification checklist

- [ ] `## The promise rule` section exists in `.claude/skills/9takes-editorial-standards/SKILL.md`, positioned between "The three substance tests" and "AI-writing tells"
- [ ] The section contains the contract sentence, the "caveat qualifies, never cancels" clause, and both corollaries (finding-as-angle, count-you-ship)
- [ ] The section ties the rule to **Hook → Insight → Action step** and to the third substance test by name
- [ ] "The three substance tests" heading still says **three**; no test was renumbered
- [ ] `grep -rn "three substance tests" .claude/` still returns `editor.md:41`, `blueprint.md:152`, `content-repurposing-engine.md:212` unbroken
- [ ] `grep -c $'\u2014' .claude/skills/9takes-editorial-standards/SKILL.md` returns the same count as before the edit (the inserted section adds **zero** em-dashes). Use the escape, not a literal, or the check matches its own line.
- [ ] The rule text appears in **exactly one** doc. `grep -rn "caveat qualifies" docs/` returns only this tasker, not `docs/brand/`
- [ ] `astrology-and-the-enneagram`, `enneagram-compatibility-matrix`, and `enneagram-test-comparison-2025` are cross-referenced to `T-04` and `T-05` so the page fixes and the rule stay linked
- [ ] No file other than the SKILL.md was modified by §2

---

## 7. Definition of done

- [ ] Promise rule inserted at the justified location in `.claude/skills/9takes-editorial-standards/SKILL.md`
- [ ] Source-of-truth decision recorded: skill file owns it, `docs/brand/` cross-links at most. No duplication.
- [ ] Lint recommendation recorded as WARN-only with its stated blind spots, or explicitly deferred. Not oversold.
- [ ] Command inlining either done (§5) or filed as a follow-on with the three target files named
- [ ] T-04 and T-05 reference this tasker as the rule that generalizes their page fixes
