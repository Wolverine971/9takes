---
title: 'I Redesigned Popular Websites (Rotten Tomatoes & Craigslist)'
video_id: _ugi7Ue7uTQ
url: 'https://www.youtube.com/watch?v=_ugi7Ue7uTQ'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-09-12
duration: '07:56'
views: 266560
timestamps:
  - time: '0:00'
    label: '<Untitled Chapter 1>'
  - time: '0:56'
    label: 'Rotten Tomatoes'
  - time: '3:38'
    label: 'Bottom Bar'
  - time: '4:13'
    label: 'Extra Padding'
  - time: '4:46'
    label: 'Craigslist'
  - time: '6:07'
    label: 'Search Bar'
description: |
  #webdevelopment #webdesign #css

  Attempting to redesign some popular websites. Part 1 includes Rotten Tomatoes and Craigslist.

  The icons I use: https://fontawesome.com/referral?a=755e5ceb4c

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  Watch the shorts here:

  Craigslist Redesign Short: https://youtube.com/shorts/smicZwXD5GI
  Rotten Tomatoes Redesign: https://youtube.com/shorts/5TCkjhG1TVU

  See the code here:

  Craigslist: https://cdpn.io/mdLyRZX
  Rotten Tomatoes: https://cdpn.io/BaxBZjV

  See the Uplabs designs here:

  https://www.uplabs.com/posts/figma-blog-magazin-app-ui-kit
  https://www.uplabs.com/posts/delivery-landing-page-ecb934fe-c7b5-4e49-80fd-5c3f5e8c6017

  Music Credits:

  Singularity - StreamBeats - Lofi - Harris Heller
transcribed_date: '2026-06-26'
path: .claude/skills/hyperplexed-audit/references/transcripts/redesign-rottentomatoes-craigslist.md
---

# I Redesigned Popular Websites (Rotten Tomatoes & Craigslist)

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=_ugi7Ue7uTQ)
- **Duration**: 07:56
- **Upload Date**: 2022-09-12
- **Views**: 266,560

## Timestamps

- 0:00 — <Untitled Chapter 1>
- 0:56 — Rotten Tomatoes
- 3:38 — Bottom Bar
- 4:13 — Extra Padding
- 4:46 — Craigslist
- 6:07 — Search Bar

## Transcript

i've always been one to sort of wing it and see where my mind takes me whether i'm creating something new or redesigning something old i focus on each feature one at a time break them down and see if i can find a good balance between making it look good and making it easy to use i don't use any specific set of design tools or principles to construct my designs but i do however take inspiration from other designs around the web for instance for my rotten tomatoes design i took a lot of inspiration from the google play store app and for my craigslist redesign i was inspired by some creative work i found on uplabs you see i absolutely love the process of being inspired and then taking the chance to use that inspiration to practice my skills and have some fun and one day i decided maybe i could share these experiences with other people and see if i can inspire them too and that's exactly how i want you the viewer to see my channel not as a place for answers but as a place to experience the world of front end development through my lens so why don't we see where that lens can take us today let's start with rotten tomatoes and work our way from top to bottom i know it's important to advertise it's a key part of many online businesses but surely you could find a better place to put an ad than stuffing it above your search bar but i'm not going to help you with that problem because that is not fun to me and one of my goals for today is to have fun so let's admit it all together i don't really like the size of this logo it's too big relative to the search bar and certainly doesn't help make the space feel balanced i also don't like the red background so i'm going to get rid of it and then replace their logo with a tomato i got from fonasum so i personally like a lot of things about the way google designs their uis i know in recent years they've gotten rid of the hamburger menus in their apps and replace them with a clickable profile pic inside of the search bar area but now there's not really enough color up here so let me try making the side borders red next we have a title and a date below that and what happens when i click these tabs okay so the tabs are really just another layer of filters for the page well i really want to clean this area up so maybe one of the ways i could do so would be to remove what appears to be redundant text and the large date surrounded by parentheses feels clumsy so why don't i shrink it down and give it the aesthetic of a subtitle i find it rather confusing that all three of these tabs are filters for the movies page but for some reason this last tab takes me to a separate page for tv shows it just doesn't make sense to be grouped with these other options especially since clicking coming soon from the tv shows page actually takes me back to the movies page there's already a clear path to the tv shows down here so i'm going to get rid of this option and by doing that i would actually remove the need for these tabs on the tv shows page altogether i'd love to be able to reincorporate these three options as part of the title of the page but maybe i could try doing it in a way that's also functional how about a drop down that sits just to the right of the title not bad there's probably a better option but at least it cleared up some of the clutter okay so for the rest of the filters i could honestly just hide the scroll bars with css and be done with them since having three visible scroll bars was actually one of the things that annoyed me the most about looking at this page but since we're in practice land here why don't i see if i can come up with another way i could try hiding them all inside of a single filters button which would expand to show all of the available filters kind of like how they already do it when you click one of them but in this case they'd all be grouped together i still think it'd be cool to have a quick way to see what options i already selected so how about i add some chips below the filter button what about streaming services though i kind of wonder if they should be their own thing let's do a separate menu for them with separate chips for the selected options okay last thing i really want to redesign is this bottom bar it all technically fits okay but i feel like i could declutter it a bit if i really wanted well i already put an account button up here so i can remove that link and i bet i could figure out a way to make some of these options shorter hmm well tv shows could just be tv or maybe shows and i like tv and maybe i could remove the rt part of this label and just call it podcast but that might be misconstrued as podcast reviews i guess in theory there could be some sort of temporary tool tip or something letting people know okay the last thing here is this extra padding i specifically remember running into an issue on certain iphone browsers where anything fixed to the bottom of the screen gets cut off so it could be for that but i'm not 100 sure that is not a very fun issue however and it looks absolutely awful on phones where it's not necessary so i'm just going to delete it well that about wraps up this first design so basically the net result is i turned three horizontally scrolling sections into two horizontally scrolling sections nice on to craigslist this will be a fun one it's basically a blank canvas since it was created 600 years prior to the invention of css i personally love dark themes so i'm gonna make my very first design choice changing the background color to black now again let's work from top to bottom i like the idea of a top bar i just think it could be a bit cleaner i've always wanted to uproot the very foundation of a company by changing their logo so instead of using their peace sign let's use this one instead this whole top bar is actually clickable and reveals options to change the location and select some different categories i think it makes sense to do it this way though i'd like to clean it up by instead stacking this text and making it a clickable button that in theory would reveal some similar options i see they have an account option up in this corner but i think with this new layout it'd be cool to stick a sign in button over here or if they're already signed in it'd be their profile pic i want to keep all the options here essentially the same but just organize them and style them a bit better it'd be cool to add some color but i'm not exactly sure how well i actually really like this design i found on uplabs where they put a block of color behind some of the filters and then transition it into the rest of the page by having this filter overlap the seam what if i tried something similar by using a solid color at the top and fading it out with a gradient at the bottom okay so the first filter is the search bar which would look pretty sleek if it had a semi-transparent background i see we have four possibilities for layouts but i'm going to magically delete one so i can fit three of them in a row here making them visible at all times instead of in a drop down the sort drop down doesn't really have to change except to match our new style and i think the options button could be squeezed in next let's update this last section and alright i'm realizing now that i haven't left room for the save search button and unfortunately i don't exactly see a good spot to fit it without ruining the flow of the filters okay what if i tried putting it after the pagination section which would be fine so long as these numbers don't get too big hang on maybe that means i need to switch it to show page numbers instead but then how do i indicate how many items per page ah how about some additional text down here that could do exactly that now for these gallery results well i've always been a fan of having the image take up all of the available space and then overlapping the info on top that doesn't really make for very readable text so i'll need to darken the area behind it to increase the contrast thinking more about what to do with the price i really like what they've done in this design where they carve out a space for the play button so why don't i go ahead and translate that concept over to my design and i love these thin little icons on the right so how about replacing the favorite button star with a heart button over here okay so what's next well looking at our designs i'd say we've come a long way but the reality is that the journey is never really over there are always ways to improve and get better but it can be difficult to determine how to go about doing so fortunately there's some easy steps you can take that really helped me with this process and if you want to know what they are this is where you want to be [Music]
