---
title: 'Have I found the perfect website?'
video_id: nG2IyH43xMU
url: 'https://www.youtube.com/watch?v=nG2IyH43xMU'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-08-25
duration: '06:03'
views: 402458
timestamps:
  - time: '0:00'
    label: 'Intro'
  - time: '0:42'
    label: 'Destructuring'
  - time: '1:01'
    label: 'Navbar'
  - time: '2:58'
    label: 'Main Content'
  - time: '4:28'
    label: 'Navigation Setup'
  - time: '5:29'
    label: 'Navigation Logic'
description: |
  Pick up where we left off: https://youtu.be/6TYkDy54q4E?t=481

  Watch as I show you how to recreate Dylan Brouwer's amazing website which uses the perfect combo of structure and creativity.

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  The icons I use: https://fontawesome.com/referral?a=755e5ceb4c

  Tools used: HTML, CSS, JavaScript

  CodePen: 

  (Warning: this is the fully responsive version, so the code looks pretty different. Might be covering it more in a future vid.)

  https://cdpn.io/oNqVyjo

  Dylan Brouwer: https://www.dylanbrouwer.design/work

  Music Credits:

  Jacket In The Summer - StreamBeats - Lofi - Harris Heller
transcribed_date: '2026-06-26'
path: .claude/skills/hyperplexed-audit/references/transcripts/perfect-website.md
---

# Have I found the perfect website?

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=nG2IyH43xMU)
- **Duration**: 06:03
- **Upload Date**: 2022-08-25
- **Views**: 402,458

## Timestamps

- 0:00 — Intro
- 0:42 — Destructuring
- 1:01 — Navbar
- 2:58 — Main Content
- 4:28 — Navigation Setup
- 5:29 — Navigation Logic

## Transcript

i took my own advice i found a website that inspired me and it can be hard to put your finger on why exactly a particular design speaks to you but something about the creative simplicity while at the same time essentially just being one big grid really resonated with my brain so let's recreate it step one actually you know what let's back up step zero background color let's go ahead and grab the rgb value wait hang on i'm not about stealing let me give it a unique customized value just for me perfect and you know what while we're here let's tell our body content to flex in the vertical direction we'll give it a height of 100 of the viewport remove the default margin and hide any overflow okay step one destructuring the layout like i said before this site is basically just a big grid that being the case there's a clear split here due to the left right navigation buttons at the bottom we have the nav bar at the top and the main content below which is basically just an infinite looping manual carousel of slides step two construct the nav bar let's use a nav element and inside set up four different sections a logo section link section a social section and a contact section inside these sections there's really just a bunch of links some of them with text and some with icons using font awesome as our icon source let's work from left to right we have our logo link followed by two page links three social links and finally a contact link to me based on the age-old adage flexbox for single-dimensional layouts like a row or column and grid for multiple dimensions like rows and columns together it makes the most sense to use flex here so display flex with 100 and a semi-transparent white bottom border whose color we'll store in a variable in the root how about some padding on each of our sections and a display of flex so we can add a gap between the elements and then we'll give them a border on the left side to show a visual split again working from left to right let's give our sections some width the first two sections look to take up about one third each and the last two will grow to share the remaining space this actually brings me to an interesting point when you give an element a width or a height and then add some padding or a border it increases the total amount of space that element takes up in this particular case we don't actually want that to happen because the padding on our section element is causing the first two sections to take up more than one third of the available space so we can fix this issue by changing the box sizing property to border box which takes into account any padding and border when calculating the element's total width and height with that out of the way now we can fix up our links in fact let's default any of the text containing elements to a better font family font weight and set the color to white don't forget to remove the link underlines as well alright almost done with the navbar just need to center the section content oh except for the logo section let's keep it on the left side and increase the logo's font size oh and add a bigger gap on these two sections step 3 construct the main content let's use a main tag and tell it to grow to fill the remaining vertical space inside we'll need an article for each of the slides in our carousel ignoring the last three articles for now let's complete the first article by adding a div for each of the sections we can see the image section description section title section and nav section for the same reason we chose flexbox for the one-dimensional navbar we're going to choose grid for the multi-dimensional slides we need to give our articles a height of 100 and then give the sections a border and size so we can actually see them now we need to tell the grid how we want it to look i could tell the columns to each take up one fractional unit or 50 of the available space but that wouldn't look quite right so let's tell the first column to take up two thirds and the second to take up one third this way we can align them with the navbar's content then we can do the exact same thing for the rows one last tweak we'll make is removing the doubled up borders and placing a left border on the right two sections and a top border on the bottom two sections now we can simply fill up our sections with their respective content for the sake of time i'm not going to show you how to center a background image add a paragraph tag with some padding add an h2 tag and an icon and finally add some buttons with icons inside the only hint i'll provide is to think carefully about whether these sections have one-dimensional or multi-dimensional content inside with one article complete we can simply copy and paste the content to our remaining articles and update the images and text step 4 navigation setup there's a bit of groundwork we need to lay before our left right navigation system is functional first the default position value of static on our slides is not going to work we need to free them from the constraints of the standard domflow by changing their position to absolute this way we can slide them on and off the screen when our buttons are clicked set the main element's position to relative and then set the article's left and top positions to zero you'll notice that all of our slides are now stacked on top of each other next there are a few pieces of data we need to track to get this thing up and running we need to know the index of each slide and we need to keep track of which one is currently active when the page loads up all of the inactive slides need to already be translated 100 to the left so they're neatly hidden off the screen going back to the buttons we added to the nav section earlier we need to handle what happens when they're clicked let's add a couple of on click functions one for the left and one for the right don't forget to do this in all the sections or the subsequent slides won't work step 5 navigation logic for those of you that have already watched my video on how to make the kippo cards you might remember that the logic i used to slide the cards back and forth is almost identical to the logic required to shift these slides you can either click here to watch the whole video or i'll leave a link to the exact timestamp in the description so you can pick up right where we left off if you're still here and you're wondering how in the heck we're gonna make this thing responsive don't worry i've got you covered i actually learned some super cool ways to handle responsiveness for this layout and i can't wait to cover them in the next vid
