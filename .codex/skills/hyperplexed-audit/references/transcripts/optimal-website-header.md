---
title: "I've Found the Optimal Website Header and..."
video_id: zGKNMm4L-r4
url: 'https://www.youtube.com/watch?v=zGKNMm4L-r4'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-06-25
duration: '02:13'
views: 224618
description: |
  Watch as I show you how to recreate the elegantly simple header from Superlist!

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  CodePen: https://cdpn.io/BaYXaOx

  Superlist: https://superlist.com

  Music Credits:

  Beyond The Clouds - StreamBeats - Lofi - Harris Heller
transcribed_date: '2026-06-26'
path: .codex/skills/hyperplexed-audit/references/transcripts/optimal-website-header.md
---

# I've Found the Optimal Website Header and...

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=zGKNMm4L-r4)
- **Duration**: 02:13
- **Upload Date**: 2022-06-25
- **Views**: 224,618

## Transcript

sometimes a simple website header is the most effective clean clear and creative it tells you what's going on and it does so in a way that's engaging to the user we can break down the header from superlist into three parts the background the titles and the slider that moves back and forth revealing each of the halves we can get started on steps one and two by creating a div for each side both containing their respective titles inside of an h2 tag let's give our titles a better color and font family scale up the size and use the margin and width properties to center the text horizontally on the page to center our titles vertically let's set the height of each side to 100 of the viewport and place it in the center using css grid we can use position absolute to set our sides on top of one another and overflow hidden will prevent our text from overlapping when dragging our slider let's give a brighter background color to each of our halves and set the left side on top with a z index of 2. with our titles almost complete we can get started on step 3 the slider let's grab the left side element with git element by id and store it in a variable since our slider is controlled by our mouse we'll create a function to handle the on mouse move event inside of this function all we need to do is calculate the width of the left side as a percentage based on the current position of the mouse once we have this value we can simply assign it to the width attribute on our element finally let's bind our mouse move listeners by calling document.onmousemove and we can even make it work on mobile by doing the same with the ontouchmovelistener jumping back to step 2 we forgot to make one of our title words fancier than the rest let's wrap our target word in a span tag and give it a class of fancy in our styles we'll give this word a fancier font family and increase the size finally let's upgrade our font colors by setting the left side to white and the fancy word to yellow on the right side we'll set the primary color to dark and the accent color to white the next step is about three and a half minutes long which involves this video being over and you watching another video to find out how to create this amazing hover card effect if you made it this far thanks for watching and i hope to see you in the next one [Music]
