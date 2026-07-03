---
title: 'Have You Ever Seen A Hover Effect This EXPLOSIVE 🤯'
video_id: owpaafxvkjU
url: 'https://www.youtube.com/watch?v=owpaafxvkjU'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2023-01-06
duration: '04:09'
views: 337409
description: |
  Watch as I show you how to recreate the fancy hover effect from https://www.nathansmith.design.

  Get Font Awesome Pro: https://fontawesome.com/referral?a=755e5ceb4c

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  Tools used: HTML, CSS, JavaScript

  CodePen: https://cdpn.io/mdjPzgM

  Music Credits:

  Cielo - StreamBeats - Lofi - Harris Heller
transcribed_date: '2026-07-01'
path: .codex/skills/hyperplexed-audit/references/transcripts/explosive-hover-effect.md
---

# Have You Ever Seen A Hover Effect This EXPLOSIVE 🤯

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=owpaafxvkjU)
- **Duration**: 04:09
- **Upload Date**: 2023-01-06
- **Views**: 337,409

## Transcript

need a fact Nathan so neat in fact that I'm going to show people how to make it should be easy enough gonna need some text on the screen oh wait can't see the text color white size bigger font better no margin and uppercase okay I'm a person who does YouTube and codepen and you can find me at hyperplexed now how did you get your text to line up like that uh okay okay I see what you did each word is self-contained the words are grouped into lines and then we'll throw the whole thing in another div now we can use flex on the lines to push the words apart but how did you get all your rows to line up perfectly like that was it just luck I guess we'll have to make our own luck then YouTube and code pinning code pen Nizer you no codependence there we go now let's do a little analysis when I hover one of these fancy words some things go up some go down some go left and right and they all rotate oh and all the other lines disappear well that part seems easiest so let's start there simple enough I'm just reducing the opacity of the text on Hover the exception of the word that's actually being hovered so long as that word was designated as one of the fancy words well shoot I know there's ways to select elements inside of elements and there's ways to select elements that come next but how do I select elements that come before the current element or elements inside of other elements based on what's Happening to this element okay this is confusing literally all I need to do is check if any of the fancy words are being hovered and then hide all the other words how do I do that I've been hearing a lot about this has thing maybe that can help the CSS has selector helps you select elements when they contain other elements that match the selector you pass into has okay so can I say that if text has a fancy word that's being hovered then reduce the opacity of all the words oh except if it's fancy well it's working but what if I had multiple fancy words ah they both highlight which makes sense that's what I told it to do oh duh we just want to exclude the fancy word that's being hovered ah that took forever and I'm not even sure I know what we just did why don't we recap when a fancy word was hovered we needed to hide all the other words CSS can give instructions to items that come next but not so much for things that come before so we opted to use the new has selector to say that if a fancy word was being hovered anywhere in our text hide all the words that are not fancy this was all well and good until we had multiple words marked as fancy at which point we had to further specify to only exclude the fancy word that was actively being hovered now here's where things get interesting we've got all these letters just chilling here and we need a way to control each of their positions independently I've done something similar before so I have an idea if we put each of these letters in their own span tag they'll stay in line with each other but now we can apply some styles to each of them individually I am way too lazy to go through and add a Spam tag around each of these letters so I'm going to spend 10 times as long writing a function to do it for me let's call it enhance because it sounds sophisticated and we'll have it taken an element ID let's speak talking of which let's add an ID to our fancy word and you know what pretty sure this is supposed to be a clickable link so let's make that change at our URL and remove the default underline okay back to enhancing we take in the element ID use it to select the element get the elements text and split it into an array now we can clear out the existing text and then iterate over our array of text creating a span for each letter giving it a class name putting the letter inside of it and then adding the whole thing back inside of the original element and now if we call the function and pass in the ID we get our enhanced element if we change each Letter's display to inline Block they'll still be in line but now we can use the transform property to modify each of their positions for instance to somewhat mirror the original we can shift the first one's position down and to the left and rotate it a few degrees we'll basically repeat this process for the rest of the letters giving each of them their own unique placement now if we update these selectors to only affect the letters on Hover and then add some transition times our effect is essentially complete I suppose we could throw in some of our own customization but I think I'll save that for another video [Music]
