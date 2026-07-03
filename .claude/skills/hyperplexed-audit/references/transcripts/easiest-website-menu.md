---
title: 'The Easiest Website Menu That Will Wow Any User'
video_id: NUeCNvYY_x4
url: 'https://www.youtube.com/watch?v=NUeCNvYY_x4'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-07-13
duration: '02:56'
views: 515329
description: |
  Watch as I show you how to make a website header that WOWS using HTML, CSS, And JavaScript. And the best part is, it'll only take 2.5 minutes!

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  CodePen: https://cdpn.io/bGvejNY

  DNA Capital: http://dnacapital.com

  Music Credits:

  Track: Daydream — Land of Fire [Audio Library Release]
  Music provided by Audio Library Plus
  Watch: https://youtu.be/mjmolfvZscQ
  Free Download / Stream: https://alplus.io/daydream
transcribed_date: '2026-06-26'
path: .claude/skills/hyperplexed-audit/references/transcripts/easiest-website-menu.md
---

# The Easiest Website Menu That Will Wow Any User

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=NUeCNvYY_x4)
- **Duration**: 02:56
- **Upload Date**: 2022-07-13
- **Views**: 515,329

## Transcript

i absolutely love finding website features like this menu design from dna capital that are not only impressively elegant in appearance but incredibly simple to recreate as per usual we'll begin with a div and then one inside that to contain four links our menu needs to fill the viewport and have a display of flex so we can align the items vertically in the center let's set our link color to white increase the font size and apply a better font family we'll stack them on top of each other with a display of block remove the underlines and space them more appropriately with some padding and margin the first step to fancifying our menu is getting the inactive links to fade out on hover let's reduce the opacity of all the links when our menu is hovered then override this change for the currently hovered link by setting its opacity back to 1. next we'll need some sort of pattern or image in the background that we can pan vertically as we hover our links let's add another div inside of our menu called background pattern we can easily create a dotted grid pattern by using a radial gradient background image with a position of 0 and a background size relative to the minimum dimension of the viewport since we want it to sit behind our menu items let's position it absolutely and adjust the z indices accordingly the first step to animating our pattern will occur when we hover any of the links let's reduce the pattern's background size just slightly and bring down the opacity as well remembering to set a transition time on these properties so they change smoothly next we need a way to pan the pattern up and down as we hover over each of our links one thing to note here is that instead of returning the pattern to its default position when our mouse moves away we need it to retain its current position moving over to our javascript let's begin by selecting our menu element we can then select our menu items and convert them to an array so they become iterable let's append a mouse move listener to each item and use them to update an active index data attribute on our menu element we can now use this data attribute in our css to shift the pattern's position accordingly now as is the effect we've achieved is pretty cool but really i think we can do even better what if we added another div for a background image we could add a fitting image from unsplash and then position it absolutely behind everything else how about we increase the default background size to 110v max and reduce the default opacity to 0.15 when we hover we'll bring down the opacity just to touch and reduce the size as well just like our background pattern we can increment the background position based on the active index by ensuring the increment value is different from our background pattern we just so happen to get a parallax effect completely free of charge with all of this in place i think it's safe to say we've created a pretty immersive website menu that is sure to wow even the most reluctant of users let me know how you think i did in the comments and i hope to see you in the next one [Music]
