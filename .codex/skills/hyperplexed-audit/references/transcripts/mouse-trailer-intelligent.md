---
title: 'The Mouse Trailer With Intelligent Features'
video_id: CZIJKkwc8l8
url: 'https://www.youtube.com/watch?v=CZIJKkwc8l8'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-07-21
duration: '03:38'
views: 160860
timestamps:
  - time: '0:00'
    label: 'Intro'
  - time: '0:15'
    label: 'Creating the trailer'
  - time: '0:43'
    label: 'Tracking mouse movements'
  - time: '1:10'
    label: 'Animation'
  - time: '1:46'
    label: 'Content'
  - time: '2:13'
    label: 'Icon'
description: |
  Watch as I show you how to create a really cool mouse trailer that has some pretty smart features (HTML, CSS, JavaScript).

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  CodePen: https://cdpn.io/abYJQxP

  Monopo Saigon: https://monopo.vn

  Mouse trailer clips from the beginning:

  https://codepen.io/gotoandplaynowtoo/pen/JRqwqx
  https://codepen.io/rachsmith/pen/XKyvWV
  https://codepen.io/maaarj/pen/YZReoK
  https://codepen.io/matze/pen/PPJxyr
  https://codepen.io/shorelle/pen/NvpRLM
  https://codepen.io/matteobruni/pen/abdpbBY

  Music Credits:

  Pixel Sunrise - StreamBeats - Lofi - Harris Heller
transcribed_date: '2026-07-01'
path: .codex/skills/hyperplexed-audit/references/transcripts/mouse-trailer-intelligent.md
---

# The Mouse Trailer With Intelligent Features

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=CZIJKkwc8l8)
- **Duration**: 03:38
- **Upload Date**: 2022-07-21
- **Views**: 160,860

## Timestamps

- 0:00 — Intro
- 0:15 — Creating the trailer
- 0:43 — Tracking mouse movements
- 1:10 — Animation
- 1:46 — Content
- 2:13 — Icon

## Transcript

mouse trailers historically useless but nonetheless fun for some and miserable for others if you're still here after seven seconds i'm going to assume you're the former and want to know how to create this one inspired by manopo saigon which is a little more intelligent than you might expect the journey to our mouse trailer will begin with a div let's give it a size and background color round the corners and set the position to fixed so it doesn't interfere with any other elements on the screen we'll zero out the starting point and set the z index really high so it's always the top most element on the screen we want the pointer event set to none so our clicks and hovers pass through to the content underneath we'll hide the trailer by default with an opacity of zero and then transition it to one when the mouse enters the screen in our javascript we can retrieve our trailer element and store it in a variable we'll listen for any mouse movements and grab the corresponding x and y positions since we want our mouse trailer to be centered when it stops we can offset these positions by half the width and height of our trailer now it would be easy enough to simply translate the trailer's position to the mouse's position but that seems rather boring instead it would be more interesting if our mouse trailer actually lagged behind by a short distance if you've ever discovered the native animation api like i did just the other day you already know that we can easily animate any element on the screen by calling the dot animate function on the element that you've selected let's take that same translation that we just did and add it to a keyframes object we'll pass it in as the first argument and use the second options parameter to set a duration of 1000 milliseconds by default when our animation completes our trailer will revert back to the state it was in prior to the animation beginning but we can override this behavior by telling the animation to instead retain the state reached at the end now we have an annoying little circle following our cursor around but if i'm being honest it's still pretty dumb let's see if we can smarten it up a bit to better demonstrate what's happening why don't we first add some content that we can interact with how about a couple of divs with background images sourced from unsplash we'll center them on the screen and give them a neat effect on hover so we can tell when they're being interacted with what we'd ideally like to happen is for our trailer to give us some information about the type of content we're hovering over we can achieve this in the form of an icon at its center let's add an icon element inside of our trailer and default it to an upward pointing arrow sourced from fon awesome back in our mousemove listener let's move the animation logic to its own function we can determine whether or not our mouse is currently inside of an interactable element by calling the closest function on our event target which searches back up the dom tree to find a reference to an element with a given class if this element exists we can be certain a relevant interaction is occurring we can pass this boolean into our animation function and use it to modify the scale of our trailer accordingly let's add a data type attribute on each of our interactable elements and then use them to determine the appropriate icon for our trailer when the interacting boolean is set to true we can update the icon class using a switch statement defaulting to a link icon if there are no other matches our trailer can now tell us what the content type is but you'll notice our icon is still present even when our mouse moves away to fix this we can set another custom data attribute on our trailer that matches the values set on our interactables now in our styles we have a way to modify our icon opacity based on whether or not this data type value is set so what do you think is our mouse trailer incredibly useful or the worst thing to ever exist thanks for watching and i hope to see you in the next one [Music]
