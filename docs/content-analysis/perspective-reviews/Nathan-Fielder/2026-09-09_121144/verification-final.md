---
artifact: perspective-verification
schema_version: 1
subject: Nathan-Fielder
draft_sha256: eba28d045ee4d1b73ed58bfb80c47e99bf1225f44d9b4e786136da6120d563be
final_content_sha256: faa5a3253a90900f0354b46abac86acfa53c7cfefeee77bc48e0dd4ee75b4c14
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-09-09T18:49:06Z
---

## Verification verdict

**Pass.** This is a full re-verification against the post-revision file, not a delta check. The prior
reports (`verification-initial.md`, `verification-supervisor-final.md`) assessed a draft that has since
been changed by the grader-driven revision pass, so every P0 acceptance test, every accepted P1, and all
ten `PROTECT-*` items were re-applied to the current text from scratch.

The supplied frozen SHA `eba28d0…` matches `context.json`, the `synthesis.md` frontmatter, and the actual
bytes of `draft-reviewed.md`. The current live draft is `src/blog/people/drafts/Nathan-Fielder.md`; its
reader-visible content hash, computed with `hashReaderVisiblePerspectiveBody`, is
`faa5a3253a90900f0354b46abac86acfa53c7cfefeee77bc48e0dd4ee75b4c14`.

Reader-visible body is **3,747 words** against the 3,200–3,900 band, down 102 from the frozen draft's
3,849. The revision brief's "target net delta ≤ 0" held: every accepted addition was paid for.

## P0 resolution check

All twelve resolved. Each acceptance test re-applied to the current text.

**P0-01 — resolved.** The aviation beat is gone; the triad is now a pair. Current: "When a stake appears,
he shows up holding a document. Before pitching businesses on television, he had a real business degree."
No sentence anywhere places the licence before the project — the pilot section states the reverse ("The
second season of _The Rehearsal_, in 2025, aimed the apparatus at commercial aviation, and he trained as
a pilot to make it"), and it now reads consistently alongside "He had told the pilots he worked with about
his training as it went." The table's `2025` sits in a "When" column and asserts no issuance date. The
revision's rewritten TL;DR ("A commerce degree, then a commercial pilot's license") states sequence of
acquisition, not precedence over a project, and does not reopen the test.

**P0-02 — resolved.** Prose: "He learned that a jacket he wore while filming came from a company that had
paid tribute to a Holocaust denier. He founded Summit Ice in 2015 in response… The obligation came first,
and he built the joke around it." Table: "An answer to a Holocaust-denier tribute | Funded Holocaust
education, and then ran through the show." Discovery precedes founding in both. "he has not said so" no
longer appears anywhere; the Talmud Torah insinuation was removed rather than narrowed, so no sentence
claims his motive is unstated and none asserts a schooling cause.

**P0-03 — resolved.** The printed string is now `"I really am struggling to this day to understand exactly
what I experienced in this."` — the LA Times wording, restored. The outlet is named in visible body text
("in the wording the [Los Angeles Times reported]"), and the testimony ledger carries the subject-quote
source record with reporter, date, URL, and a note that the 15-word wording appears once.

**P0-04 — resolved.** "In that 2025 appearance, Rep. Steve Cohen of Tennessee also objected: Fielder's
team had presented their meeting as concerning autism and air travel. Fielder answered that the season
connected autism masking with pilot communication." Antecedent fixed (Fielder's team), the answer is
given, and the reader's only available explanation for why autism came up is the show's masking argument.
"None of this makes him right about aviation" survives immediately downstream, untouched.

**P0-05 — resolved.** "His target was Angela, a participant rehearsing motherhood, whose beliefs, he
argued, made her easy to score points off." Restored as narration, not extended quotation; the Variety
direct quote is unchanged at seven words. Skeete is explicitly marked as separate ("A different
participant, Kor Skeete"), and two paragraphs now sit between the charge and his 8/10. Source trail for
the name: evidence packet L288, "D'Addario's named primary target is the woman cast as 'mother' (Angela)."

**P0-06 — resolved.** Table cell: "Defense untested; closure reported over a health permit." Prose:
"TheWrap reported that the Los Angeles County Health Department closed it that day…" and "The trademark
defense went untested; the shop closed over a health permit." No cell or sentence asserts the parody
defence succeeded, and the closure is attributed to reporting. The revision deleted only the trailing
disclaimer "; it gives us no basis to call the omission forgetfulness," which asserts nothing.

**P0-07 — resolved.** "a woman he had loved half a century earlier." No year appears for the Frances
relationship anywhere in the file.

**P0-08 — resolved.** "Twenty years on" is deleted; the close reads "The equipment is better, the access
is extraordinary, and the last move has not changed." Every remaining relative span in the body resolves:
"since at least 2014" and "A year later" against printed dates, "spanning roughly three years" attributed
to A24, and "half a century earlier" is the wording P0-07 mandates.

**P0-09 — resolved.** "NBC San Diego reported an October 16, 2026 theatrical release through A24; the
distributor's own page still listed the date as undetermined when checked that September." Year present,
past tense, not attributed to A24 as its own statement. Read on 2027-06-01 the sentence remains true and
the release year is recoverable without leaving it.

**P0-10 — resolved.** "In two of those three shows he performs under his own name, playing a version of
himself that people cannot agree is a version." The scripted role is excluded from the persona evidence
base, and "his first scripted fiction" is gone ("_The Curse_, in 2023, was a scripted series"). The
narrowing did not propagate into the reframe paragraph — see PROTECT-01 below.

**P0-11 — resolved.** "On [CNN's _The Situation Room_ on May 29, 2025], **before the Black Q&A**, he
argued…" "Then he did the counterphobic thing" is gone. No connective in the section implies CNN followed
the Q&A.

**P0-12 — resolved.** "_The Rehearsal_ ran two seasons on HBO, in 2022 and 2025" closes the run claim and
resolves the "two seasons" ambiguity; "The second season of _The Rehearsal_, in 2025, aimed the apparatus
at commercial aviation" gives "the show" a referent at the head of section 4. A reader can now name the
aviation work, give its year, and place it relative to _The Curse_ (2023).

## Accepted improvements check

**Completed:** P1-01 (crew credit — "He credits his crew with recreating details for participants'
experience"); P1-02 (arrows link swapped to `/enneagram-corner/enneagram-connecting-lines`, which exists
at `src/blog/enneagram/enneagram-connecting-lines.md`); P1-03 (the film is dropped from the growth list,
cited for one connecting-line reading only); P1-04 (degree row → "Nothing stated on the record," pilot row
→ "To learn the work, and to be taken seriously"); P1-05 (737/San Bernardino, two clauses, no passenger
claim, TIME recorded in the ledger); P1-06 (Theranos apposition at first mention); P1-07 (motive stated
plainly — "his own judgment will not count when it matters. Somebody outside him has to do the settling");
P1-08 (source-pool bias conceded — "promotional interviews over-report audience-facing behaviour for
anybody" — plus the non-interview Dumb Starbucks FAQ artifact); P1-09 (TL;DR narrowed to "Some of the
pushback," and Cohen's editing complaint now sits in the ethics section); P1-11 ("the filmmaker Benny
Safdie," "Fielder is a comedian"); P1-12 ("the Three's playbook" deleted); P1-13 (all three limbs —
"His next documentary carried that unresolved question into someone else's household," "Rep. Steve Cohen
of Tennessee" bound to "In that 2025 appearance," and "In that room, in September 2026:" at the head of
the penultimate paragraph); P1-14 (the Nolan self-report added beside the falsifier, paraphrased);
P1-15 ("the plans frequently worked" and the owner-unawareness claim both gone); P1-16 ("an executive
producer on the series," with the HBO/trade/Television Academy distinction recorded in the ledger);
P1-17 ("6w5 is plausible, with the same uncertainty as the core reading").

**P1-18 — completed and not disturbed by the revision.** An exact comparison of every double-quoted string
in the reader-visible body of the frozen and current drafts confirms the third-party quotation payload is
unchanged except for P0-03's mandated restoration. No new direct quotation was introduced anywhere,
including in the two rewritten FAQ answers, which are paraphrase. The ledger now carries five qualifying
excerpts with the count-every-occurrence rule stated.

**P1-10 — deferred with reason, unchanged.** "The second row became a _Nathan for You_ episode" supplies
the newcomer context; episode numbering and the client plot remain omitted rather than invented.

**RQ-01 and RQ-02 — completed.** Winter's parenting-consent account (with staging uncertainty and Herman's
reported grandmother reassurance) and Brody's fake-gas-inspection objection are both in the ethics section,
attributed and dated, with no minor named and no lasting-harm claim. Source trail for Herman:
`docs/content-analysis/research/Nathan-Fielder-criticism-followup.md:21–24`.

**RQ-03 — deferred with reason, unchanged.** The Vulture quotation is not used. The sympathetic reading
stays marked throughout ("a more sympathetic reading," "may be an offer," "can promise," "That
possibility"), and the non-establishment of private purpose now lives in the standing-limits note ("it
cannot establish a private motive"). Not relabelled completed.

**RQ-04 — fixed, pre-publication re-check still owed.** The sentence is reporting-attributed and
date-safe. The obligation to re-check A24's release field immediately before publication carries forward.

## Protected-hit regression check

No regressions. All ten survive; twelve load-bearing strings were grep-checked and each returns exactly
one match.

**PROTECT-01 — preserved on function.** The reframe is compressed but intact: "his social difficulty and
his preparation are not stacked layers you can peel apart. A man who has planned a conversation to the
third decimal place is sharing a room with someone who has not. The gap between his preparation and
everyone else's is itself the awkwardness. Preparation helps produce the encounter, and then the camera
finds it," followed by "That connection makes the familiar choice between a real face and a fake mask
inadequate." The mask/face binary is rejected, the causal loop is stated, the signature sentence is
verbatim, and the mechanism is explicitly the article's reading. P0-10's narrowing did not propagate: the
paragraph names no work.

**PROTECT-02 — preserved on function.** Motive and non-exoneration both survive: "rehearsal may be an
offer of a method he finds reassuring… That possibility makes the impulse understandable. It clears
nothing about the method, and a participant still has to live with the encounter and the edit. Generosity
and control can occupy the same room." The load-bearing second half is never dropped. The adverse material
added upstream by P0-05, P1-09, RQ-01 and RQ-02 did not displace the turn.

**PROTECT-03 — verbatim.** "It is not a mechanism, and a profile that pretends otherwise is inventing a
childhood wound because the shape of the story wants one."

**PROTECT-04 — preserved.** The Westwood opening is compressed and now sourced to the Nolan Q&A, which
dates the telling, not the anecdote; the anecdote itself remains undated, which is the property the
synthesis protects. The callback survives and the final sentence is verbatim: "…and a theatre is under no
obligation to answer." The revision explicitly rejected the grader's request to drop the return-to-cold-open
close on PROTECT-04 grounds.

**PROTECT-05 — preserved.** Skeete's sentence is verbatim and still unfinished; "Fielder interrupts with a
question there. The unfinished sentence belongs beside the praise" retains the description of the
interruption and the refusal to tidy it.

**PROTECT-06 — preserved.** Five rows, four columns, "Nothing stated on the record" intact, no cell
asserting a legal outcome or a disclaimed intention. The form is unchanged; only cells moved.

**PROTECT-07 — verbatim.**

**PROTECT-08 — verbatim, both sentences.** The new interior beat sits two paragraphs upstream of the
CNN/FAA paragraph and does not enter it.

**PROTECT-09 — all three hedges verbatim.** The revision consolidated six *other* paragraph-final hedges
into a single italic standing-limits note; none of the three protected ones was among them.

**PROTECT-10 — preserved.** "What would change our minds: sustained evidence that he prepares equally hard
for things nobody will ever see or grade…" P1-14's disconfirmer was added beside it, not in place of it.
Standing bans re-checked file-wide: no partner named or implied for Fielder, no divorce cause, no net
worth, no clinical diagnosis, no named minor. ("her partner Billy Evans" refers to Holmes and is
pre-existing.)

**New-assertion check (method step 6).** Every factual addition made as part of a repair carries a trail:
the 737 finale (TIME, in the ledger), the Wilson EP credit (TheWrap/Variety plus the Television Academy
2024 entry, in the ledger), the birth date (Wikidata, in the ledger), Angela (packet L288), Herman/The
Ringer (criticism-followup research doc), the ABC7 Kimmel account and the Vanity Fair reenactments note
(both linked or named in text). No new direct quotation was introduced. The revision's new
`inner-thought` block is an editorial rendering of an expectation attributed in the paragraph above it,
rendered without quotation marks and recorded in the FORMULA FINGERPRINT ledger as one of two interior
beats with sources.

## Remaining work

None gating. Three items to carry forward, none of which reopens a P0 or damages a protected hit.

1. **Audit-trail discrepancy: `revision-resolution.md` records a post-revision file sha256 of
   `1e76f341658b20830e1660819559382180742b7df78c6dbc697cd8254f25b072`; the current file hashes to
   `980fbb2d36d559be77a40388d2aebcef5ce78f8b79aa6062b552211d797b5e4f`.** The reader-visible content I
   verified is the current file, and nothing in it contradicts the resolution log — but the recorded hash
   does not identify the file that shipped, so it cannot be used as evidence later. Minimum action:
   recompute and correct the hash line in `revision-resolution.md`, or state what changed after it was
   written. (The perspective gate uses the reader-visible hash, not this one.)

2. **The Dumb Starbucks punchline was deleted, not repaired.** P0-06 instructed "do not touch 'He was
   taken out by the one credential he had not thought to acquire'"; the whole paragraph containing it is
   gone, replaced by "What the stunt shows is an appetite for arguing the rules in public. The trademark
   defense went untested; the shop closed over a health permit." This does not fail the gate — the
   sentence is not a `PROTECT-*` item, P0-06's own acceptance test passes, and `editor-resolution.md`
   records a defensible reason (the phrase asserts a private mental state, the "invented forgotten-permit
   motive," which the packet does not support). But the section lost its climax and no replacement beat
   was written. Minimum action if anyone wants it back: a permit-safe restatement that keeps the irony
   without claiming he forgot — e.g. that he armoured in writing against the fight he expected and was
   closed by the one document nobody had drafted a defence for.

3. **Two carried-forward obligations, unchanged.** The Jack Black Q&A audio verification
   (`70xdc3T3oqk`, 18:21–19:54) remains outstanding and remains the single unlock on quoting the two
   caption-sourced sections; both uploads were re-confirmed on 2026-09-09 to carry automatic captions
   only, so the quotation bar stands. And RQ-04's A24 release-field re-check is owed immediately before
   publication.

One soft observation, not a defect: the new interior beat's "The license is the only sentence that keeps
them in the chair" is a shade stronger than the attributed substrate ("Being a pilot himself could give
those conversations credibility"). It is marked as interior thought, carries no quotation marks, and sits
under the standing-limits note that names inferred motives as inference, so it clears the bar the
synthesis set — but "only" is the one word in it doing work the record does not.
