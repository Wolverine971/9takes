---
title: 'This Website Feature Demands It Of You'
video_id: kySGqoU7X-s
url: 'https://www.youtube.com/watch?v=kySGqoU7X-s'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2023-02-16
duration: '02:59'
views: 223626
description: |
  Watch as I show you how to recreate the glowy blob effect from https://poppr.be.

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  Tools used: HTML, CSS, JavaScript

  CodePen: https://cdpn.io/KKBjvbG

  Music licensed by Artlist:

  - Ziv Moran - Long Strokes
  - Yehezkel Raz - Flight of the Inner Bird - Instrumental Version
  - Sero - Think of Mind
transcribed_date: '2026-06-26'
path: .claude/skills/hyperplexed-audit/references/transcripts/website-feature-demands.md
---

# This Website Feature Demands It Of You

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=kySGqoU7X-s)
- **Duration**: 02:59
- **Upload Date**: 2023-02-16
- **Views**: 223,626

## Transcript

sometimes I find myself wondering what is it truly that makes something resonate so significantly with us maybe there's just no way to actually describe it call it an ineffable wait what is that what is following my mouse around are you serious oh I can't believe it are you telling me that this whole time it was just a big blurry blob in the background well played popper.com or dot b well you know why we're here since I like taking things one step at a time I'm just gonna get something on the screen that I can see let's call it a blob and give it a color of white a height of 500 and let's just make it a square at first the very first thing I need my Square to do is follow my mouse so in layman's terms it'd be something like hey Mr blob get over here you see this uh GPS tracker I've attached to my mouse pointer here I'm giving you the exact coordinates so run along now drop drop okay now I want you the one who's watching this video to reflect on what just happened we're obviously not done yet we've barely even started but what I want you to recognize is that in creating this crude version of our final product we've demonstrated that even the complex things are just a collection of simple things that have been strung together so if you find yourself in a situation where something seems too complex remember that a good place to start is to ask yourself what are the simple things it's made up of all right why don't we Center our square and round it into a circle that's just two more things and we're already a lot closer I can see that our blob needs to be multi-colored so I'm gonna go with a linear gradient from left to right starting with green and ending with purple even when we're not moving the blob it's clear there's some inherent motion what if I create an animation that just rotates from zero degrees to 360 and then tell my blob to do that over the course of 20 seconds there's still a glaring difference between our two blobs and I think it has to do with the fact that the original doesn't snap to the mouse quite so instantaneously we need ours to chill out and lag behind a bit fortunately there exists a built-in API that makes this insanely easy we can just swap out.style for DOT animate and pass in our two properties then we just have to tell it how long to take and not to reset the properties at the end it feels like our blob is not only rotating but also morphing its shape so what if we just scale up the size at the halfway point of our animation it still seems like there's something different oh yeah why don't we go ahead and blur this thing let's see what happens when we apply a blur directly to the blob hmm close but I'm not a fan of the weird concentric circles I'm seeing as a byproduct how about instead we try throwing in a second div that we'll call blur we'll make it take off the whole screen and position it absolutely on top of the blob with our new invisible layer we can simply tell everything behind it to blur at this point all we're really missing is the super cool text effect we learned about in the last video [Music] thank you [Music]
