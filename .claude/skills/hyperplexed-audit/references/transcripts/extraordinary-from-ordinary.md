---
title: 'Building The Extraordinary Using Only The Ordinary'
video_id: jMVhxBB3l0w
url: 'https://www.youtube.com/watch?v=jMVhxBB3l0w'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2023-03-06
duration: '06:36'
views: 345830
description: |
  Watch as I show you how to recreate the futuristic card effect from https://www.sprite.com/zerolimits.

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  Tools used: HTML, CSS, JavaScript

  CodePen: https://cdpn.io/vYzgeYE

  Music licensed by Artlist:

  Lance Conrad - Cannot Be Broken
  Sero - Forgive
transcribed_date: '2026-07-01'
path: .claude/skills/hyperplexed-audit/references/transcripts/extraordinary-from-ordinary.md
---

# Building The Extraordinary Using Only The Ordinary

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=jMVhxBB3l0w)
- **Duration**: 06:36
- **Upload Date**: 2023-03-06
- **Views**: 345,830

## Transcript

Awards site of the month February 2023 we've once again transcended the limitations of a normal website and entered the realm of a full-on three-dimensional experience now undoubtedly most if not all of the impressive visual effects that you see here are built with the robust web Graphics Library also known as webgl but all I brought with me today is plain old CSS in the hopes that I could find something to recreate so sit back and relax because we are going on a little journey of our own I'm going to start by choosing a color they've chosen green and I think I'm gonna go with blue the first thing I want to do is build the frame of my screen so I'll add a div and call it screen I'll tell my screen to be 500 pixels wide and add a border so I can actually see it a lot of modern screens have an aspect ratio of 16x9 but since ours is vertical we can do 9x16 and that feels a little narrow so how about 10 by 16. let's round the corners and give the background a slight tint of blue alright let's ramp things up a bit I see we need to have some horizontal the lines on our screen that are panning vertically in a continual Loop my first thought is to ignore the motion aspect and focus on finding a way to just get some horizontal lines on the screen I know there's a way to do a linear gradient that repeats so I want to start there aha copy this add a new container for it in our screen and then paste the gradient inside of course we can't see it yet so let's give it a size and then chop off the corners with overflow hidden on the screen I'm not going to get into the specifics of linear gradients but more or less we can specify what colors we want and where we want them to start and end in this example if we were using a normal linear gradient we'd be specifying for red to start at 0 and end at 20 and blue to start at 20 and end at 25 but the default behavior of a standard gradient is to continue the final color all the way to the opposite end in the case of a repeating linear gradient however the pattern will stop at the specified position and then repeat itself we can of course swap out the colors and modify the spacing to our liking so now we have our horizontal lines but they're not moving there's a relatively easy solution to this we can create a new animation that pans our background from 0 to negative one hundred percent over a decent length of time hmm interesting it would appear that it's not possible to shift the position of a repeating linear gradient by a percentage presumably because there's no way to fractionalize something that's infinite this was unexpected and so we pivot we recall from an earlier video of mine that it's possible to use a radial gradient to create a repeating pattern I wonder if the same can be done with a standard linear gradient hear me out instead of creating this pattern with a repeating linear gradient we can alternatively switch it to a normal linear gradient which as expected removes the repeating part but if we then change the background size from the default of 100 to say only 9 pixels tall it stops there instead now if you've ever added a background image that isn't big enough to fill its container you'll have noticed that it repeats itself until it does and so our line repeats itself all the way down the length of the screen meaning that we were able to recreate the exact same pattern using a normal linear gradient but what does this do for us well whereas we were unable to animate the position of a repeat linear gradient with a normal linear gradient we can okay I don't really want to mess with finding some HD footage so I'm just going to find a real pretty picture instead I want it to at least be blue so I'm not working against myself here here we go add an image element paste it in the URL it's clearly too large so let's fix the size and make sure the images aspect ratio is maintained hmm I like the image but I almost feel like there's too much variation in the color I wonder if there's a good way to tint it okay what do we have here so mute the colors and then Hue rotate I don't know what degree equals blue hmm oh oh I see hey that's actually not bad I think we should tone it down a bit more by reducing the opacity and hey you know what would be cool what if we could Pan the image around a bit you know like zoom in on it and move it around here let's switch this to what like 300 person oh interesting our image should have zoomed in but it would appear that object fit can't take a percentage value okay so we pivot once again we switch the image tag to a div and call it screen image we'll remove the URL here and add it back as a background image in our CSS now we can change the object fit property which doesn't take a percentage to the background size property which does and now we can create a new animation that moves the position from 0 to 100 over the course of 15 seconds oh I just had another idea what if we did multiple Paths of motion and maybe some could be more zoomed in than others too how would we do that well maybe instead of starting the animation here and ending it here we could break it up into sections so for the first 20 of the animation we could do like this the second 20 like this I am really just winging it here this one could be zoomed in or this one could be zoomed out more now there's no need to be exact here but basically we just have to take whatever approximate starting and ending position we want for each path and translate those values into our animation along with a level of Zoom that looks good and when we do this for all five paths in a row we wind up with what appears to be a movie panning over different sections of our landscape alright now we've got a fake movie playing but where did our scrolling lines go it would appear that the image is pushing them out of view so let's fix that by positioning them absolutely on top left zero top zero whoa okay now they don't know where to stop position relative on the screen should remedy that and you know what I'm going to set the image to Absolute as well so that when we add a new container for some actual content the container can sit on top of both the image and the scrolling lines now we're free to add literally whatever content that we want we can add an accent border around the outside we can do a code pen icon with some white shadow for a effect we can find a cool font for a label and a sub label we can use the after and before pseudo elements to add some fancy glowing shapes if you made it this far I'm glad you're here as an added bonus I'm just going to keep compounding these effects until it no longer makes sense to do so foreign
