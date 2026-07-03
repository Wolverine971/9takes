---
title: 'I Redesigned Popular Websites (Quora & Steam)'
video_id: ohTsv00c_E4
url: 'https://www.youtube.com/watch?v=ohTsv00c_E4'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2022-10-12
duration: '06:25'
views: 336903
timestamps:
  - time: '0:00'
    label: 'Intro'
  - time: '0:57'
    label: 'Discover Page'
  - time: '2:00'
    label: 'Navigation'
  - time: '3:08'
    label: 'Steam'
  - time: '3:38'
    label: 'Nav Bar'
  - time: '4:10'
    label: 'Featured Section'
  - time: '4:43'
    label: 'Browse Option Cards'
  - time: '5:11'
    label: 'Browse Game'
description: |
  #webdevelopment #webdesign #css

  Attempting to redesign some popular websites. Part 2 includes Quora and Steam.

  The icons I use: https://fontawesome.com/referral?a=755e5ceb4c

  Support the channel: https://ko-fi.com/hyperplexed (accepts PayPal, card, etc).

  Watch the shorts here:

  Quora Redesign Short: https://youtube.com/shorts/Wqe6saEJscA
  Steam Redesign: https://youtube.com/shorts/TmSIIR64yLQ

  See the code here:

  Quora: https://cdpn.io/dyeKgNq
  Steam: https://cdpn.io/jOxMejd

  Music Credits:

  Daze - StreamBeats - Lofi - Harris Heller
transcribed_date: '2026-06-26'
path: .claude/skills/hyperplexed-audit/references/transcripts/redesign-quora-steam.md
---

# I Redesigned Popular Websites (Quora & Steam)

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=ohTsv00c_E4)
- **Duration**: 06:25
- **Upload Date**: 2022-10-12
- **Views**: 336,903

## Timestamps

- 0:00 — Intro
- 0:57 — Discover Page
- 2:00 — Navigation
- 3:08 — Steam
- 3:38 — Nav Bar
- 4:10 — Featured Section
- 4:43 — Browse Option Cards
- 5:11 — Browse Game

## Transcript

me oh my Cora you've got a lot going on here if you're gonna give me seven nav items at the top of your site plus two additional options it better be abundantly clear where they take me I think we need to do a little exploration so I see you have a geometry section on your site no this is my following feed hmm seems like maybe that could just be on the home page oh cool you can have friends on quora now oh okay spaces so this is where I discover what I want to end up on my following feed I feel like I need a little help figuring out your site wait I see we're adding a question here or creating a post so this is a create content button got it alright this may sound crazy but what if instead of a horizontal nav bar we go the Discord route and try a vertical one we can keep the home button first but you've got two different nav items for discovering content or viewing my already discovered content and I don't feel like either of those icons make that very obvious what if we Consolidated these two into one discover page now we can find new topics here and then maybe instead of allocating a whole separate page to them they can just show up in my main feed on the home page okay I think a search icon without any text would suffice and instead of using a question mark for adding content maybe just a plus these last three options are a bit confusingly ordered for my taste I'm used to a profile option being on the end not the biggest deal but what is the world icon for changing my language interesting alright maybe I'm not considering that you could have a lot of multilingual users who need to swap languages frequently very well fortunately with our new side nav bar we've got some more space to work with I figure the options up here are all about interacting with your site's content and the remaining options are more about my own info and preferences so let's do the profile option at the bottom then the notifications and the language selector okay we've cleared up the top area a bit but if I'm being honest phone screens already have a very limited amount of horizontal space to work with so having an always visible side nav seems like a a bad call what if I just had a toggle to open and close it not bad but if I scroll down the page a ways I'm pretty sure the content is going to jump around too much for that hmm well I can't have it always sitting on top of the content oh what if I have it visible at the top and then automatically close when I scroll and then if you retoggle it after scrolling it appears on top so the content no longer shifts it's not really conventional but I like it enough okay the last thing I really want to take a look at is this section the way all this is grouped together makes me think these options are all Associated if I click in any of these Bots it takes me to the add interface but if I click answer it opens up a completely new page interesting I like the aesthetic of this section so I don't want to change too much but I think even just a tiny bit more separation between these options would clear things up because now my brain treats these as three distinct actions rather than all being associated with this input it's crazy how much of a difference better icons can make so I feel like we could easily find some more uniform ones for these buttons on font awesome some to use instead I can literally just search comment and I already see Replacements that make a lot more sense to me I'm feeling pretty good about this design now so good in fact that I think it's high time we move on to steam now you've got a lot more content on your page than I can possibly fit into a 60 second short so we're gonna have to simplify drastically let's take a look around and see what we can find the gist of this page is browsing some curated content as the homepage should be and really a lot of these sections could stick around but for the sake of time I'm gonna pick out the ones I feel are most important and focus on those alright starting from the top let's fix this nav bar first I'm not sure why this button isn't centered vertically but I'd prefer it that way I actually want to move the logo to the left though so let's shift the button over to the right I think a transparent nav bar would be Sleek but we may run into some visibility issues so a partially transparent gradient could help with that I want to use a hamburger icon that's a little bit less basic so how about we upgrade it to basic 2.0 by staggering the bar slightly now it's essentially just a reversed sort icon so if people really find it confusing we could always chop off one of the bars the featured section should probably go next but I want it to be a little more seamless so let's drop the label maximize the image size and then have a border that actually doubles as a way to highlight the active slide I see your additional menu options plus search up here but I feel like it would make more sense to move those into the hamburger menu and then we could make the search always visible here and perhaps instead of such a cramped search bar with an italicized lowercase search placeholder and one of your 50 shades of blue we could opt for something a bit roomier I don't have anything against your Steely blue theme color but I personally enjoy Dark theme so I'm going to switch your background color to Black alright next we've got these browse option cards I think it makes a lot of sense to have some quick options to highlight the different ways to graze your site I don't however enjoy the blue gradient so I'm going to opt for a darkened image in the background with an icon and text label then we can increase the brightness of the active button for any hover effect well I'll be dang that doesn't look half bad last but not least we have the browse game section my primary issue with this section is that it feels a bit cluttered I think a lot of that has to do with the text getting cut off at various lengths and the price being centered doesn't feel quite right especially when you slap a discount percent in price above and below it I also don't like the padding above and below the image it makes it feel unnecessarily squeezed into this space so let's start with sizing the image in a way that makes it feel like it belongs we can keep the title at the top followed by a maximum of three tags let's go with the price next and then I feel like a rating percentage would be nice to know as I'm browsing you've got a couple other key pieces of data that need to be displayed but I'll leave it to you to find space for those coming back around to these tabs at the top I don't like the Blue on Blue the style of the tab tabs or the little scroll Arrow buttons I do however think that replacing these with option chips feels a lot cleaner I can't say it's perfect but for a first draft I can honestly say I'm pretty happy with it there's a few more sites that I've been dying to redesign but since I don't really have time to cover them in this video I'm going to link you to this video next so you can see what I came up with [Music]
