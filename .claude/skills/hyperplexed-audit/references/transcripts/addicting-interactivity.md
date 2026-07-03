---
title: 'THIS Is Addictingly Good Website Interactivity'
video_id: Jt3A2lNN2aE
url: 'https://www.youtube.com/watch?v=Jt3A2lNN2aE'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-09-21
duration: '03:30'
views: 153360
timestamps:
  - time: '0:00'
    label: 'Intro'
  - time: '0:08'
    label: 'Materials'
  - time: '0:37'
    label: 'JavaScript'
  - time: '1:25'
    label: 'Distance'
  - time: '2:16'
    label: 'Index'
  - time: '2:41'
    label: 'Recap'
description: |
  Watch as I show you how to recreate the awesome interactive image gallery effect from https://bridget.pictures in just 200 seconds.

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  Tools used: HTML, CSS, JavaScript

  CodePen: https://cdpn.io/BaxROox

  Stack Overflow Answer:
  https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas

  Music Credits:

  Obsidian - StreamBeats - Lofi - Harris Heller
transcribed_date: '2026-06-26'
path: .claude/skills/hyperplexed-audit/references/transcripts/addicting-interactivity.md
---

# THIS Is Addictingly Good Website Interactivity

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=Jt3A2lNN2aE)
- **Duration**: 03:30
- **Upload Date**: 2022-09-21
- **Views**: 153,360

## Timestamps

- 0:00 — Intro
- 0:08 — Materials
- 0:37 — JavaScript
- 1:25 — Distance
- 2:16 — Index
- 2:41 — Recap

## Transcript

I started this video with the goal of showing you how to recreate this effect as fast as possible I'm too slow for 100 seconds Fire Ship so I'm going to shoot for 200. we need 10 image tags with a class of image an index from 0 to 9 and a status of inactive I'm sourcing all of my images from unsplash give your container a background color make it fill up all of the available space and remove any scroll overflow give your images a size position them absolutely so we can move them around with a mouse and Center them by translating their position the inactive images should be hidden and the active one should be visible let's start the JavaScript logic by storing our list of images in a constant since this effect occurs when we move the mouse we need to listen to Mouse move events the first image that should appear is the one at index 0 in our list we'll store this index in a variable and use it to pass the first image into a new function that will make the image appear in the correct spot let's also pass in the mouse's X and Y position use them to set the left and top position of the image and then change the image's status to active so it gets unhidden by our CSS now we get an image that moves around with our Mouse because we never bump the global index we can easily fix this by incrementing its value after calling the activate function great now we get images that show up in the right spot but since our index eventually gets bumped past the length of our list we end up with an error this is a great use case for the modulus operator because we can use it to wrap our index back around to zero each time we get to the end of the list we're not getting the error anymore but we have a new issue because our Mouse move event fires so often we can only see the image in the front we need to restrict how often an image can appear we could base this on how much time has passed but if you just wait a second and then move your mouse one pixel the same problem still exists so how about we restrict based on distance instead let's declare that you have to move your mouse 100 pixels before the next image can appear JavaScript distance between two points blah blah blah okay there's the answer thank you smart stack Overflow user oh wait thank you even smarter stack Overflow commenter now we need a new variable to track the last position in image appeared which gets updated every time the activate function is called we also need a new function that takes in the mouse's current position and uses our copy and pasted formula to determine the distance to the last position we can use this function to first check if the mouse has moved far enough before activating the next image our image Trail looks good but it's too long as we decided before we need to restrict its length down to five in the same way that we determine the index of our leading image we can determine the index of the next image to deactivate by subtracting the number of images in our trail from the global index and then modding it by the total number of images now after the activate step we can check if the tail image exists and if so set it to inactive which will hide it from view let's recap the mouse moves onto the screen after it's moved 100 pixels the first image appears after another 100 pixels the next image appears so on and so forth until we get to image number six prior to this point our tail image did not exist yet because the index we used was still less than zero at the exact same time that m 6 appears the tail image now exists so it's set to inactive thereby limiting the length of our Trail to 5. when the global index surpasses the number nine which is the last index in our array of images we use the modulus operator to wrap our image indices back around zero the end result is an infinitely looping trail of five images this has been recreating a mouse move image gallery effect in 200 seconds [Music] foreign
