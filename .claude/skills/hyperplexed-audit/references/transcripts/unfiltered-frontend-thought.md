---
title: 'The Unfiltered Thought Process of a Frontend Dev'
video_id: oJYFRZ4cj2Q
url: 'https://www.youtube.com/watch?v=oJYFRZ4cj2Q'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-06-30
duration: '04:07'
views: 234180
description: |
  Watch as I explain my typical thought process as I'm recreating something I found on the web for a video.

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  CodePen: https://cdpn.io/wvmvqmx

  Studio9p: https://studio9p.com

  Music Credits:

  Lemon Switchel - StreamBeats - Lofi - Harris Heller
transcribed_date: '2026-07-01'
path: .claude/skills/hyperplexed-audit/references/transcripts/unfiltered-frontend-thought.md
---

# The Unfiltered Thought Process of a Frontend Dev

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=oJYFRZ4cj2Q)
- **Duration**: 04:07
- **Upload Date**: 2022-06-30
- **Views**: 234,180

## Transcript

the following is a depiction of my thought process when recreating something for a video hmm Studio 9p okay uh cool loading thing you got here whoa that is way too complex uh definitely not making that oh let's see you got a menu here oh a couple of links oh fancy hover now we're talking okay let's uh break this down so we got three links great let's start with that all right they're on the page but what now oh well the background color is gross so we can fix that so our links are there but they're next to each other not on top oh yeah okay because of uh display value I think it's in line or something by default I'll switch it to block nice let's put them in the center I'll go ahead and use flex oh and uh gotta set the direction to column oh why is it not centering vertically I don't understand inspect elements oh duh the body doesn't fill the viewport by default we'll set it to 100 viewport height what is happening oh yeah it's not a line item Center if you set Direction column you have to use justify content Center yeah that took way too long I might consider renaming this video to amateur okay some padding would do us some good here font color white font size bigger hmm do I really need to account for screen sizes that small yeah I guess it would be smart to clamp the values okay if I want family next uh Google fonts scroll scroll scroll scroll scroll scroll scroll scroll permanent marker uh yes please underline no thank you wait why is there a scroll bar oh yeah okay body has a margin or padding or something get rid of that borders uh top border white last one has a border bottom that's white gradient in the pseudo element content empty so it shows up and I want it to not affect any other elements so position absolute left zero top zero height one hundo with one hundo linear gradient to the right from transparent to Blue wow that looks absolutely beautiful position relative on the parent fixed multiple colors in the gradient material colors uh blue let's make a root variable light blue another root variable use the new colors and our gradient now uh no gradient by default and the gradient slides in on Hover so with zero on Hover with 100 I need to transition the width let's try uh one second ease into slow 800 milliseconds I'm still too slow 600 nice and the gradient shifts on Mouse move JavaScript we'll need a mouse move listener so we'll Loop over the links add the listeners calculate the mouse position as a decimal looks like the color percentages are constrained within a range so we'll say a minimum value of 80 max value of 100 that gives us a range of 20 that would make the adjustable percent 20 multiplied by the mouse position which I converted to a decimal and then the final value would be the base plus the adjustable how do I update my CSS CSS variable let's give it a go set the value update the CSS you good with this yeah I'm good with this show them another video yeah let's show them another video on how to make a super cool website header in two minutes wait I can do that sure can [Music]
