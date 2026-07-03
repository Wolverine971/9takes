---
title: 'You Need This Hover Effect On Your Site ASAP (CSS / JS)'
video_id: htGfnF1zN4g
url: 'https://www.youtube.com/watch?v=htGfnF1zN4g'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-05-12
duration: '05:09'
views: 490079
timestamps:
  - time: '0:00'
    label: '<Untitled Chapter 1>'
  - time: '0:05'
    label: 'Multi-Card Spanning Hover Effect'
  - time: '0:50'
    label: 'The Glow Effect'
  - time: '3:21'
    label: 'Card Border'
description: |
  #tutorial #codepen

  Watch as I show to how to recreate a sweet hover effect (from linear.app) that can span across multiple cards at the same time!

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  CodePen: https://cdpn.io/MWQeYLW

  Linear: https://linear.app/features

  Tools used: HTML, CSS, JavaScript

  Music Credits:

  Track: Light — Land of Fire [Audio Library Release]
  Music provided by Audio Library Plus
  Watch: https://youtu.be/MZsG5Et16sA
  Free Download / Stream: https://alplus.io/light
transcribed_date: '2026-06-26'
path: .claude/skills/hyperplexed-audit/references/transcripts/hover-effect-asap.md
---

# You Need This Hover Effect On Your Site ASAP (CSS / JS)

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=htGfnF1zN4g)
- **Duration**: 05:09
- **Upload Date**: 2022-05-12
- **Views**: 490,079

## Timestamps

- 0:00 — <Untitled Chapter 1>
- 0:05 — Multi-Card Spanning Hover Effect
- 0:50 — The Glow Effect
- 3:21 — Card Border

## Transcript

whenever i come across amazing effects like this one i really like making it a goal to figure out how they work here we have a multi-card spanning hover effect where not only do you have the glow effect that's following your mouse but the border is lighting up on the current card and on the neighboring cards as well despite what you might think the logic for this effect is actually pretty simple over in our code let's begin by applying some basic styles to our body so it's not so blindingly white in our html let's create a wrapper for our cards and put six card divs inside we'll start by giving our cards a height width and a background color and then using flexbox to space our cards in two rows of three with a gap of eight pixels in between each card let's give our cards a border radius reduce the background opacity add a 1 pixel border and set the cursor to pointer with our cards complete we can start our hover effect by creating the glow effect that appears as you hover over each cart for this we'll use the before pseudo element since it won't require any additional html we'll position it absolutely to the left and top sides and ensure its height and width are equal to that of its parent div for the actual glow effect we're going to use a radial gradient background that emanates from the position specified here we'll set the position attribute on our card div to relative so the before element's position is relative to it instead of the surrounding page with our gradients in place we need to update their origin position as the mouse moves across our cards over in our javascript we'll create a loop to iterate over our cards and append an on mouse move event listener to each one within this listener we'll get our card's position the getboundingclientrect function and use it to calculate the position of our mouse relative to each card now that we have our x and y coordinates we can use them to set custom css properties for each one back in our styles we can update our radial gradient to utilize these properties and now when we hover over our cards they move around as expected one issue to note is that when we leave the cards our radial gradient is still visible since we don't want this to be the case we'll set the default opacity of our before element to zero we'll set its transition duration to 500 milliseconds and then when we hover we'll set the opacity back to one with the glow portion of our effect out of the way let's move on to the border we need to figure out a way to not only highlight the border of the card that is being hovered but also highlight the neighboring cardboards as well since regular borders are pretty limited we're going to leverage a visual trick where we'll make the background color of our card content opaque and expose a tiny 1 pixel wide area around the edge of the content to simulate a border the reason this is useful will be apparent in just a second back in our html let's add a new div inside of our card elements called card content now in our styles if we update our card background color to be much lighter for a moment we can get a better idea of how this is going to work we'll set the height and width of our content divs to be 100 of the height of their parent minus 2 pixels we'll create a new variable for our card color and use it to set our contents background color we'll update the border radius and set the margin to be 1 pixel now when we remove the border attribute from our card div our cards are still left with a 1 pixel wide border let's reduce the card's background color back to what it was before and you can hardly tell a difference from the original border let's go back to our html and add another new div to each of our cards called card border the card border element will be styled identically to our card's before element except for the fact that its radial gradient will be only 400 pixels and its color will be slightly less transparent and this is where our visual trick will come into play we'll first set the z index of our before element to 3 since we want it to be on the very top then we'll set the z index of our cart content to 2 remembering to also set its position to relative so the z index is honored finally we'll set our border element c index to 1 since we want it to appear behind our card content we'll transition our border element to be visible on hover just like the before element and now when we hover over our cards the only portion of the radial gradient that's visible on our border is the one pixel wide area that we created before the only question we have left is how to get the neighboring card's borders to move as well the solution to this is actually pretty simple back in our javascript we'll create a new mouse move listener for the div containing all of our cards in the logic for this listener we'll loop over all six of our cards and then move the logic for setting their mouse positions from our old event listener to here now when we hover anywhere on our cards the mouse positions for all of our cards are being set we can remove the old logic and now back in our styles instead of telling our border element's opacity to change when we hover over an individual card we'll tell it to change when the surrounding div is hovered now watch as we hover and the desired effect is achieved and if we compare it to the original we can see that our recreation is pretty dang close if you enjoyed this content please consider liking the video as well as subscribing and i'll see you in the next one [Music]
