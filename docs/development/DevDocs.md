---

[9takes Docs](https://drive.google.com/drive/u/1/folders/1quQz9oM86Dx6NApiBxDONVpyNDG5foOb)

[long p romps2](https://docs.google.com/document/d/1YLMxaAgG2d7LW4H5caP5wNTF2bRfcduj7Yt9M1JPU-E/edit)

[3 shot p romps](https://docs.google.com/document/d/1m5WBu-mNu0Nx7pgV4FmUMNfwYfQNphnxOxJgIEqsiz4/edit?tab=t.0)

<!-- 9 something -->

## Personality analysis image workflow

Personality analysis portraits use two square WebP derivatives from the original Canva PNG:

- `Person-Name.webp`: full page image, capped at 1200px wide, quality 82.
- `s-Person-Name.webp`: 480px thumbnail, quality 72.

Always create both files directly from the lossless Canva export. Do not create the thumbnail from
the full WebP, and do not use `-size 20000`: `-size` targets encoded bytes, not pixel dimensions.

### Preferred command

From the repository root, pass the Canva export and Enneagram type to the helper:

```bash
./scripts/prepare-personality-image.sh "/path/to/Joe-Biden.png" 2
```

This writes:

```text
static/types/2s/Joe-Biden.webp
static/types/2s/s-Joe-Biden.webp
```

If the Canva filename is not already the desired person slug, provide it as the third argument:

```bash
./scripts/prepare-personality-image.sh "/path/to/canva-export.png" 2 Joe-Biden
```

### Equivalent `cwebp` commands

```bash
cwebp -quiet -preset picture -q 82 -m 6 -mt -sharp_yuv \
  -resize 1200 0 -resize_mode down_only \
  "/path/to/Joe-Biden.png" \
  -o "static/types/2s/Joe-Biden.webp"

cwebp -quiet -preset picture -q 72 -m 6 -mt -sharp_yuv \
  -resize 480 0 -resize_mode down_only \
  "/path/to/Joe-Biden.png" \
  -o "static/types/2s/s-Joe-Biden.webp"
```

Keep the Canva PNG as the editable master, but do not place it in `static/`; only delivery assets
belong in the public static tree.

## Monetization

https://docs.google.com/document/d/1G4U6YqqOpmxc0_hD8u1JIBpwgl0kklmW8znFN3yszqE/edit?tab=t.0

<!-- find missing links
find-markdown.bat C:\Users\djway\Desktop\svelte\9takes\src\blog\people -->

Kylie-Jenner
Michael-B-Jordan
Malcolm-Gladwell
Jordan-Peterson
Andrew-Callaghan

Tara-Yummy
Zohran-Mamdani
Satya-Nadella

src/blog/community/memetic-comments.md
src/blog/people/drafts/Howard-Stern.md
src/blog/people/drafts/Tom-Holland.md
src/blog/people/drafts/Conor-McGregor.md

Miley-Cyrus
src/blog/enneagram/enneagram-connecting-lines.md
src/blog/pop-culture/twitter-x-personality-types-toxic.md
src/blog/enneagram/enneagram-anxiety-management-guide.md

src/blog/enneagram/how-type-8-challengers-actually-succeed.md
src/blog/pop-culture/depp-vs-heard-enneagram-analysis.md

src/blog/pop-culture/influencer-enneagram-types-instagram.md
src/blog/pop-culture/tech-titans-platform-emperors.md
podcaster-personality-map
Tim-Cook
enneagram-types-and-career-choices

fallen-founders-enneagram-analysis
google-leadership-evolution

Act like a normal person who is reading this article and tell me what i missed or left out or what i should expand on or what was overdone or duplicate info that could be trimmed. Review the Gordon Ramsay blog, read it and put your comments as a comment at the bottom of the article

Try to assess it with fresh eyes. Think about what this person is know for and what someone who knows about them would want to have insight into and what should be addressed.

Ok so i added some comments at the bottom of the article Toby Maguire, please assess the comments and see if we should add some more or address some parts based on that feedback. Do more research as needed and make the blog better. Also trim things that are overdone or duplicated so that everything is fresh and well done.

I want you to edit this blog on Noam-Chomsky and use the content-editor agent doc to guide you.

Act like a normal person who is reading these articles and tell me what i missed or what i should expand on or what was overdone or duplicate info that could be trimmed. Review the blogs, read it and put your comments as a comment at the bottom of each article, also tell me how they fit together

path: docs/development/DevDocs.md
---

---

<!-- Reaching out text -->

ok i am working through a few personaliy analysis blogs and updateing them. What i am trying to do is
do into greater detail on people's lore and background so that the blog is and the analysis is deep and
rich.

I'm going to be reaching out to these people, so I want to see how they're going to assess the blog and
what they would notice. I want to be fair, I want to be honest, I just want to portray them in the
right light and respect their lore. And I want to fairly, honestly, and insightfully do my Enneagram
analysis on them.

Right now I am looking at Tim Ferriss's blog. Please assess the blog and see what needs to be updated
and fixed. I want to make it better and more rich.
