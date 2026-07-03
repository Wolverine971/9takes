---
title: "This Website Effect Shouldn't Be Possible"
video_id: yu0Cm4BqQv0
url: 'https://www.youtube.com/watch?v=yu0Cm4BqQv0'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-06-08
duration: '04:04'
views: 153211
timestamps:
  - time: '0:00'
    label: 'Intro'
  - time: '0:07'
    label: 'Adding Text'
  - time: '0:28'
    label: 'Gradient Animation'
  - time: '0:50'
    label: 'Adding Stars'
  - time: '1:09'
    label: 'Style Stars'
  - time: '1:38'
    label: 'Animating Stars'
  - time: '2:38'
    label: 'Javascript'
  - time: '3:02'
    label: 'DOM Reflow'
description: |
  Watch as I show you how to recreate the magical text effect from Linear's Readme page with HTML, CSS, and a little JS.

  The icons I use: https://fontawesome.com/referral?a=755e5ceb4c

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  CodePen: https://cdpn.io/YzeOLYe

  Linear: https://linear.app/readme

  Reflow Article: https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript

  Reflow Properties: https://gist.github.com/paulirish/5d52fb081b3570c81e3a

  Music Credits:

  Lemon Switchel - StreamBeats - Lofi - Harris Heller
transcribed_date: '2026-07-01'
path: .claude/skills/hyperplexed-audit/references/transcripts/effect-shouldnt-be-possible.md
---

# This Website Effect Shouldn't Be Possible

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=yu0Cm4BqQv0)
- **Duration**: 04:04
- **Upload Date**: 2022-06-08
- **Views**: 153,211

## Timestamps

- 0:00 — Intro
- 0:07 — Adding Text
- 0:28 — Gradient Animation
- 0:50 — Adding Stars
- 1:09 — Style Stars
- 1:38 — Animating Stars
- 2:38 — Javascript
- 3:02 — DOM Reflow

## Transcript

this magical text effect is amazing and while it's cool to know that something exists it's even cooler if you know how it works let's throw a simple h1 tag on the page we'll add some text and give it some basic styles like a font family a color and then center it on the page we'll wrap a few of the words in their own span tag and set the background to a linear gradient using the fancy pants combo of webkit background clip text and text fill color transparent we can get the gradient to show only on our text now let's animate the gradient by simply setting our background size to two hundred percent and creating an animation to pan from zero to negative two hundred percent on repeat we get an infinite looping effect that looks pretty dang sweet on its own note that the starting and ending colors for our gradient are the same we could stop there but that's not what linear did no they took it a step further we need to add some sparkly stars let's move our magic text into its own span tag to give it some separation from our stars don't forget to update the css selector as well we'll add three copies of an svg star that i source from font awesome and nest each of them inside their own span tag the reason for doing this will be apparent shortly step 2 style the stars in our css selector for our magic wrapper span we'll set the display to inline block and the position to relative so our stars will be positioned relative to it rather than the surrounding window we want our stars to be positioned absolutely using css variables for the left and top properties it will be updating randomly with javascript then we'll set our svg's display to block and set the opacity to 70 finally we'll set the fill value on the svg path to violet step 3 animate the stars the first animation will be the scale animation that occurs on the magic star span tag all we need this to do is go from a scale of 0 up to 1 and then back to 0. we want this animation to occur pretty quickly so we'll set the duration to 700 milliseconds we'll set the timing to ease in the animation fill node to forwards so it doesn't reset upon completion the second animation is the rotation animation that will apply directly to our svg for this animation we just need it to rotate from 0 to 180 over the course of one second we'll set the timing function to linear and unlike the scaling animation this one will repeat infinitely now here comes the tricky part we want our stars to be randomly positioned once every second but we also need to stagger each of them by a small amount of time normally i would attempt to create this stagger with an animation delay but of course attempting to align a css animation with a javascript interval based repositioning resulted in all sorts of timing issues that just ended up making it look plain bad so instead we'll do the whole thing with javascript first let's create an index variable starting at 0. let's loop over our star elements and set up a 1000 millisecond interval for each one in this interval function we need to do two things number one set our css left and top variables to random values within a certain range then remember how we set our scale animation to stop after it gets to the end well we need a way to reset it each time the position changes to do this we need to trigger what's called dom reflow now as a warning this trick should only be used sparingly as dom reflow is generally inexpensive operation to trigger this reflow we'll first set our animation to none this will override the animation we set in our css then we'll start the dom reflow by calling one of several properties that can trigger it we don't actually need to use the value we just need to reference it for this to work finally we'll remove our animation override thus causing our animation to be rerun now our animation is working but you'll notice that our stars aren't being staggered to fix this we can simply wrap our interval in a timeout and increment the value for each star finally we don't want to wait for the interval to complete for the first iteration to run so we'll call our animate function directly inside the timeout as well now you can go show your friends how much cooler your text is than theirs if you thought this was interesting and you want to see more like it i'd recommend checking out this magical hover effect next [Music]
