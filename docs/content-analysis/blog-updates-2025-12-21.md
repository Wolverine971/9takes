<!-- docs/content-analysis/blog-updates-2025-12-21.md -->

# Blog Updates Required - December 21, 2025 (Final Audit v2)

This document lists all celebrity blogs that have changes requiring Supabase updates.

---

## Summary

| Category                                 | Count |
| ---------------------------------------- | ----- |
| **New Blogs to Publish (INSERT)**        | 5     |
| **Already Published (UPDATE content)**   | 10    |
| **Major Content Updates**                | 5     |
| **Substantial Changes (update lastmod)** | 38    |
| **Single-Word Only (NO lastmod)**        | 6     |
| **Format/Suggestions Only (No lastmod)** | 5     |
| **Total Files Changed**                  | 69    |

---

## NEW BLOGS TO PUBLISH (INSERT to `blogs_famous_people`)

These are new blogs that need to be added to the database AND published. They have `link: false` in famousTypes.ts.

| Person           | Type | Published | hasImage | Notes       |
| ---------------- | ---- | --------- | -------- | ----------- |
| Andrew-Huberman  | 5    | **true**  | true     | Publish now |
| Bella-Hadid      | 4    | **true**  | true     | Publish now |
| George-RR-Martin | 5    | **true**  | true     | Publish now |
| Post-Malone      | 9    | **true**  | true     | Publish now |
| Tony-Robbins     | 3    | **true**  | true     | Publish now |

**After INSERT:** Run `pnpm gen:famous-types` to update famousTypes.ts with `link: true`.

---

## ALREADY PUBLISHED BLOGS (Need Content UPDATE Only)

These blogs are already in the database with `link: true` in famousTypes.ts. They only need content updates.

| Person         | Type | Already Published | Action Needed            |
| -------------- | ---- | ----------------- | ------------------------ |
| Druski         | 8    | Yes (2025-04-02)  | UPDATE content + lastmod |
| Henry-Cavill   | 2    | Yes (2025-05-02)  | UPDATE content + lastmod |
| IShowSpeed     | 8    | Yes (2025-03-26)  | UPDATE content + lastmod |
| Jake-Paul      | 3    | Yes (2025-04-10)  | UPDATE content + lastmod |
| Jenna-Ortega   | 3    | Yes (2025-12-03)  | UPDATE content + lastmod |
| Johnny-Depp    | 4    | Yes (2025-04-07)  | UPDATE content + lastmod |
| Kai-Cenat      | 7    | Yes (2025-03-26)  | UPDATE content + lastmod |
| Marilyn-Monroe | 6    | Yes (2025-03-04)  | UPDATE content + lastmod |
| Michelle-Obama | 1    | Yes (2025-04-08)  | UPDATE content + lastmod |
| Olivia-Rodrigo | 2    | Yes (2025-03-15)  | UPDATE content + lastmod |

---

## MAJOR CONTENT UPDATES (Update lastmod + content + titles)

These blogs have significant content rewrites and require full updates.

### 1. Jared-Leto

- **Update lastmod:** YES (2025-12-21)
- **Update jsonld_snippet:** YES (has JSON-LD)
- **Changes:**
  - New description
  - Added QuickAnswer component
  - Added PopCard component
  - Major content expansion and restructuring
  - Added 2025 updates (Tron: Ares, Masters of the Universe, Seasons Tour)
  - New FAQ section with JSON-LD
  - Added comparison table

### 2. Jeff-Bezos

- **Update lastmod:** YES (2025-12-21)
- **Update jsonld_snippet:** NO (no JSON-LD)
- **Changes:**
  - New meta_title: "Why Jeff Bezos Thinks in Centuries (His Personality Explained)"
  - New description
  - Added QuickAnswer component
  - Major content expansion, then streamlined for conciseness
  - Added 2025 updates (marriage, mother's death, Blue Origin Mars mission)
  - Changed type from 'celebrity' to 'techie'
  - Added suggestions: Elon-Musk, Bill-Gates, Mark-Zuckerberg, Steve-Jobs

### 3. Peter-Thiel

- **Update lastmod:** YES (2025-12-21)
- **Update jsonld_snippet:** NO (no JSON-LD)
- **Changes:**
  - New meta_title: "Is Peter Thiel Paranoid? His Type 6 Personality Explained"
  - New description
  - Added QuickAnswer component
  - Streamlined and restructured content for conciseness

### 4. Tucker-Carlson

- **Update lastmod:** YES (2025-12-21)
- **Update jsonld_snippet:** YES (has JSON-LD)
- **Changes:**
  - New meta_title: "Why Tucker Carlson Doesn't Trust Anyone (His Psychology Explained)"
  - New description
  - Added QuickAnswer component
  - Major content expansion
  - Added 2025 updates (Tucker Carlson Network, Trump admin influence, Nick Fuentes controversy)
  - Updated suggestions: removed Vladimir-Putin, added Jordan-Peterson
  - Removed PopCard component (now uses QuickAnswer instead)
  - JSON-LD already present

### 5. Jordan-Peterson

- **Update lastmod:** YES (2025-12-21)
- **Update jsonld_snippet:** NO (no JSON-LD)
- **Changes:**
  - New meta_title: "Why Is Jordan Peterson So Polarizing? His Personality Explained"
  - New description
  - Added QuickAnswer component
  - Restructured TL;DR section
  - Enhanced and streamlined content

---

## SUBSTANTIAL CONTENT CHANGES (Update lastmod)

These blogs have em-dash (—) standardization throughout OR multiple wording changes. These warrant a lastmod update.

| Person                        | Update lastmod | Changes                                  |
| ----------------------------- | -------------- | ---------------------------------------- |
| Abraham-Lincoln               | YES            | Em-dash → commas/colons throughout       |
| Alexandria-Ocasio-Cortez      | YES            | Em-dash → commas throughout              |
| Alexis-Bledel                 | YES            | Em-dash → commas throughout              |
| Ariana-Grande                 | YES            | Em-dash → commas/colons throughout       |
| Bill-Gates                    | YES            | Wording + suggestions format + socials   |
| Bobbi-Althoff                 | YES            | Em-dash → commas throughout (extensive)  |
| Cillian-Murphy                | YES            | Em-dash → commas throughout              |
| Cristiano-Ronaldo             | YES            | Em-dash → commas throughout              |
| Dave-Portnoy                  | YES            | Em-dash throughout + word replacement    |
| Doja-Cat                      | YES            | Em-dash → commas/colons throughout       |
| Donald-Trump                  | YES            | Multiple word replacements               |
| Drake                         | YES            | Em-dash → colons/periods throughout      |
| George-H-W-Bush               | YES            | Wording + twitter format                 |
| Greta-Thunberg                | YES            | Wording + suggestions added              |
| Gwyneth-Paltrow               | YES            | Em-dash → commas/colons throughout       |
| Hozier                        | YES            | Wording + removed empty svelte:head      |
| J.K.-Rowling                  | YES            | Em-dash → commas + suggestions expanded  |
| Jennifer-Garner               | YES            | Wording + social handles format          |
| Jocko-Willink                 | YES            | Wording + disclaimer added               |
| Joe-Biden                     | YES            | Em-dash → commas + suggestions added     |
| Kamala-Harris                 | YES            | Wording + suggestions/social format      |
| Malcolm-Gladwell              | YES            | Em-dash throughout (extensive)           |
| Matthew-McConaughey           | YES            | "quintessentially" → "pure" (2x)         |
| Michael-B-Jordan              | YES            | Em-dash → commas/colons throughout       |
| Millie-Bobby-Brown            | YES            | Em-dash → commas throughout              |
| Palmer-Luckey                 | YES            | Em-dash throughout + description update  |
| Pokimane                      | YES            | Em-dash → commas/colons throughout       |
| Ronald-Reagan                 | YES            | Wording + suggestions added              |
| Sam-Altman                    | YES            | Em-dash → commas/colons throughout       |
| Scarlett-Johansson            | YES            | Wording changes (2x)                     |
| Shane-Gillis                  | YES            | Em-dash → commas/colons throughout       |
| Sydney-Sweeney                | YES            | Social handles + em-dash standardization |
| Taylor-Swift                  | YES            | Em-dash → commas/periods throughout      |
| Taylor-Swift-updated-sections | YES            | Em-dash → commas/periods throughout      |
| Tim-Robinson                  | YES            | Wording changes (2x)                     |
| Tom-Cruise                    | YES            | Wording changes                          |
| Vladimir-Putin                | YES            | Em-dash → commas throughout              |
| Zendaya                       | YES            | Em-dash → commas/colons throughout       |

---

## SINGLE-WORD CHANGES ONLY (NO lastmod update)

These blogs have only a single word replacement ("quintessential" → "classic"). Too minor to warrant a lastmod update.

| Person        | Change                       | Push to DB? |
| ------------- | ---------------------------- | ----------- |
| Alex-Cooper   | "quintessential" → "classic" | Yes         |
| Grimes        | "quintessentially" → "pure"  | Yes         |
| Hailey-Bieber | "quintessential" → "classic" | Yes         |
| Pedro-Pascal  | "quintessential" → "classic" | Yes         |
| Sundar-Pichai | "quintessential" → "classic" | Yes         |
| Xi-Jinping    | "quintessential" → "classic" | Yes         |

---

## FORMAT/SUGGESTIONS ONLY (NO lastmod update)

These blogs only have minimal metadata changes that don't require lastmod updates.

| Person         | Changes                                 | Push to DB?            |
| -------------- | --------------------------------------- | ---------------------- |
| Amy-Poehler    | Suggestions expanded + disclaimer added | YES - suggestions only |
| Ashby          | Instagram/TikTok format + disclaimer    | YES - suggestions only |
| James-Charles  | Social handles format only              | Optional               |
| Justin-Trudeau | Social handles format only              | Optional               |
| Kristen-Bell   | Social handles format only              | Optional               |

---

## JSON-LD Updates Required

Only these 2 blogs have JSON-LD that needs to be pushed to `jsonld_snippet`:

1. **Jared-Leto** - Full FAQ schema with 5 questions
2. **Tucker-Carlson** - Full FAQ schema with personality questions

---

## Quick Push Checklist

### Priority 1: New Blogs to Publish (INSERT with published=true)

- [ ] **Andrew-Huberman** (Type 5)
- [ ] **Bella-Hadid** (Type 4)
- [ ] **George-RR-Martin** (Type 5)
- [ ] **Post-Malone** (Type 9)
- [ ] **Tony-Robbins** (Type 3)

**After INSERT:** `pnpm gen:famous-types`

### Priority 2: Already Published - Content Updates Only (PATCH)

- [ ] Druski
- [ ] Henry-Cavill
- [ ] IShowSpeed
- [ ] Jake-Paul
- [ ] Jenna-Ortega
- [ ] Johnny-Depp
- [ ] Kai-Cenat
- [ ] Marilyn-Monroe
- [ ] Michelle-Obama
- [ ] Olivia-Rodrigo

### Priority 3: Major Rewrites (PATCH with full fields)

- [ ] Jared-Leto (+ jsonld_snippet)
- [ ] Jeff-Bezos
- [ ] Peter-Thiel
- [ ] Tucker-Carlson (+ jsonld_snippet)
- [ ] Jordan-Peterson

### Priority 4: Substantial Changes (PATCH content + lastmod)

- [ ] Abraham-Lincoln
- [ ] Alexandria-Ocasio-Cortez
- [ ] Alexis-Bledel
- [ ] Ariana-Grande
- [ ] Bill-Gates
- [ ] Bobbi-Althoff
- [ ] Cillian-Murphy
- [ ] Cristiano-Ronaldo
- [ ] Dave-Portnoy
- [ ] Doja-Cat
- [ ] Donald-Trump
- [ ] Drake
- [ ] George-H-W-Bush
- [ ] Greta-Thunberg
- [ ] Gwyneth-Paltrow
- [ ] Hozier
- [ ] J.K.-Rowling
- [ ] Jennifer-Garner
- [ ] Jocko-Willink
- [ ] Joe-Biden
- [ ] Kamala-Harris
- [ ] Malcolm-Gladwell
- [ ] Matthew-McConaughey
- [ ] Michael-B-Jordan
- [ ] Millie-Bobby-Brown
- [ ] Palmer-Luckey
- [ ] Pokimane
- [ ] Ronald-Reagan
- [ ] Sam-Altman
- [ ] Scarlett-Johansson
- [ ] Shane-Gillis
- [ ] Sydney-Sweeney
- [ ] Taylor-Swift
- [ ] Taylor-Swift-updated-sections
- [ ] Tim-Robinson
- [ ] Tom-Cruise
- [ ] Vladimir-Putin
- [ ] Zendaya

### Priority 5: Suggestions/Format Only (PATCH suggestions, no lastmod)

- [ ] Amy-Poehler
- [ ] Ashby
- [ ] James-Charles (optional)
- [ ] Justin-Trudeau (optional)
- [ ] Kristen-Bell (optional)

### Priority 6: Single-Word Only (Optional, no lastmod)

- [ ] Alex-Cooper (optional)
- [ ] Grimes (optional)
- [ ] Hailey-Bieber (optional)
- [ ] Pedro-Pascal (optional)
- [ ] Sundar-Pichai (optional)
- [ ] Xi-Jinping (optional)

---

## Change Summary

### Em-Dash Standardization (Primary Change)

The majority of punctuation changes involve converting em-dashes (—) to more readable alternatives:

| Original Pattern        | New Pattern                                |
| ----------------------- | ------------------------------------------ |
| `word—explanation`      | `word, explanation` or `word: explanation` |
| `word—and more text`    | `word. And more text.`                     |
| `word—classic behavior` | `word, classic behavior`                   |

### Word Replacements

| Original         | Replacement                   |
| ---------------- | ----------------------------- |
| quintessential   | classic, textbook, pure, core |
| quintessentially | purely, truly, definitively   |

---

## Field Update Reference

### For new blogs (INSERT):

```python
payload = {
    "person": "Andrew-Huberman",
    "published": True,
    "content": content,
    "lastmod": "2025-12-21",
    # ... all other fields from frontmatter
}
```

### For content updates (PATCH):

```python
payload = {
    "content": content,
    "lastmod": "2025-12-21",
}
```

### For major rewrites (PATCH):

```python
payload = {
    "content": content,
    "lastmod": "2025-12-21",
    "title": "new title",
    "meta_title": "new meta_title",
    "description": "new description",
}
```

### For blogs with JSON-LD (Jared-Leto, Tucker-Carlson):

```python
payload = {
    "content": content,
    "lastmod": "2025-12-21",
    "jsonld_snippet": jsonld_content,  # Extract from <script type="application/ld+json">
}
```

---

_Generated: 2025-12-21 (Final Audit v2 - Cross-referenced with famousTypes.ts)_
