---
title: 'How to take your front-end skills TO THE MOON'
video_id: GHZBa_R93ag
url: 'https://www.youtube.com/watch?v=GHZBa_R93ag'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-08-04
duration: '04:46'
views: 264995
timestamps:
  - time: '0:00'
    label: 'Intro'
  - time: '0:22'
    label: 'Find Inspiration'
  - time: '0:52'
    label: 'Appreciation'
  - time: '1:06'
    label: 'Analyzation'
  - time: '1:24'
    label: 'Deconstruction'
  - time: '1:40'
    label: 'Reconstruction'
  - time: '3:59'
    label: 'Rinse Repeat'
  - time: '4:16'
    label: 'Conclusion'
description: |
  Watch as I explain 5 steps to help you level up your frontend game and walk you through a neat tutorial too. The tutorial design is sourced from the Palette Supply website, link below!

  The icons I use: https://fontawesome.com/referral?a=755e5ceb4c

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  CodePen: https://cdpn.io/VwXXPKJ

  Palette Supply: https://palette.supply

  Inspiration source: https://godly.website

  Other sites used:

  https://staratlas.com

  https://brand.twitch.tv

  https://www.viture.com

  Music Credits:

  Lime Soda - StreamBeats - Lofi - Harris Heller
transcribed_date: '2026-07-01'
path: .codex/skills/hyperplexed-audit/references/transcripts/frontend-skills-to-the-moon.md
---

# How to take your front-end skills TO THE MOON

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=GHZBa_R93ag)
- **Duration**: 04:46
- **Upload Date**: 2022-08-04
- **Views**: 264,995

## Timestamps

- 0:00 — Intro
- 0:22 — Find Inspiration
- 0:52 — Appreciation
- 1:06 — Analyzation
- 1:24 — Deconstruction
- 1:40 — Reconstruction
- 3:59 — Rinse Repeat
- 4:16 — Conclusion

## Transcript

have you ever had the thoughts i'm just not creative enough to be a front-end developer or i have no idea where to even begin if this sounds like you i'm here to let you know that these are entirely valid feelings that everyone has in their journey and there are five steps you can take right now to start improving your frontend skills but you have to do all of them or this won't work step one find inspiration have you ever been browsing the web and come across a site or feature that you thought looked incredible maybe it's a sleek nav menu or a cool hover effect or perhaps it's the whole site that enthralled you and here's a secret for you it doesn't have to just be websites it doesn't even have to be on your phone everywhere we go we're using interfaces that have the potential to inspire if you start paying attention to these interactions more and more eventually you'll begin to realize inspiration can come from anywhere step 2 appreciation take a moment to really appreciate each aspect of the design that drew you in there's a reason why this particular interface caught your eye and taking some time to really engage with it is a key part of the experience step 3 analyzation now it's time to shift your mindset from appreciation to analyzation there are likely several components to the feature you're immersed in and rather than just thinking wow that's cool and moving on ask yourself what are the different elements i'm seeing what are the various interactions that i'm experiencing step four deconstruction big problems like how the heck do i do this are not productive small questions like how do i get some rectangles on the screen and how do i space them apart appropriately or far more manageable step 5 reconstruction now it's time to work through each of the small problems from the deconstruction step one at a time here we've got a bunch of rectangles all contained in another rectangle that's probably roughly 1.5 to 2 times bigger than the screen perhaps they algorithmically determine the sizes and positions but that seems unnecessary let's just take 10 minutes to randomly size and position some divs in a similarly pleasing pattern now it looks like the whole thing pans around as we move the mouse i may not know exactly how to achieve this quite yet but i can tell that when my mouse hits position 0 0 in the upper left corner the panable gallery should also be at 0 0. and when my mouse hits the lower right corner the panable area should do the same so what this says to me is that i need to convert the x and y positions of the mouse from a pixel value to a decimal value so i can shift the position of the gallery by that percentage after storing my gallery element in a variable i'll add a listener to the window to check for mouse movements and grab the mouse's x and y position from the event by dividing the mouse's current x and y position by the width and height of the window respectively i can determine the corresponding decimal values now i just have to multiply these values by the width and height of the gallery update the css to transform the gallery's position by that number of pixels and voila wait no that's the wrong direction multiply by negative one and voila wait no that allows me to pan too far cut out the height and width of the window from my calculation and well that's not very smooth instead animate the position with javascript and voila just like that it's panning correctly my next small problem is getting an image to show up smoothly on hover first i'll add a new image element inside of each tile i'll set the height and width to 100 whoops that looks a bit too stretchy object fit cover oh and border radius inherit transition the opacity and scale on hover and voila what why can i see the background color coming through around the border okay also scale the image a tiny amount on hover and voila just like that a smooth and easy transition from a color to an image so you see once you've done this enough times you never run into any issues at all everything goes perfectly smoothly every time so if you can simply remember the acronym i adder as in oh i can't believe you lost that fish i know i thought i had her then you will have no problem at all remembering these steps that leads me to the actual final step rinse and repeat continue to adopt this perspective shift in your day-to-day life of appreciating and analyzing the various interfaces you see and then practicing recreating the ones you really like eventually you'll start to see some improvements in your ability to design and create your own features and if you still find yourself concerned with not being good enough then i highly recommend watching this video next where i take a deeper look at some of my own web development anxieties and how to overcome them
