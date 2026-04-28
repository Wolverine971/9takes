---
title: '7 UI/UX mistakes that SCREAM you''re a beginner'
video_id: AH_ugxmLeUM
url: 'https://www.youtube.com/watch?v=AH_ugxmLeUM'
channel: Kole Jain
upload_date: 2025-06-07
duration: '7:17'
views: 371854
transcribed_date: '2026-04-27'
path: youtube-transcripts/2025-06-07-kole-jain-7-ui-ux-mistakes-beginner.md
---

# 7 UI/UX mistakes that SCREAM you're a beginner

## Metadata
- **Channel**: Kole Jain
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=AH_ugxmLeUM)
- **Duration**: 7:17
- **Upload Date**: 2025-06-07
- **Views**: 371,854

## Timestamps
- 0:00 — Intro
- 0:23 — Mistake 1: User flow
- 1:06 — Mistake 2: Overusing effects
- 1:54 — Mistake 3: Spacing
- 2:47 — Mistake 4: Inconsistent components
- 3:32 — Mistake 5: Icons
- 4:54 — Mistake 6: Redundant elements
- 5:30 — Mistake 7: Interactive feedback
- 6:19 — Bonus Mistake 8: Charts
- 6:56 — Outro

## Transcript

[0:00] I've spent years making bad designs, so I can tell you exactly what makes something look like it was made by a beginner. By the end of this video, you'll be able to spot those mistakes instantly and fix them just as fast. We'll look at real examples, before and afters, and easy ways to improve a UI without starting from scratch. We're going to redesign this simple recipe app one mistake at a time until it looks polished and production ready.

[0:23] **Mistake number one, user flow.** Let's start with something that quietly ruins your UX, user flow. Here's our allergy screen with six preset options, but no search bar if someone's allergic to something else. We also don't have a skip button either. What if the user doesn't have any allergies? These are things you will miss if you don't plan out your flow, but users, they'll feel it instantly. So, even something as simple as sketching boxes on paper helps you catch major gaps early on. And it's not just all about big stuff. Little touches like a filter icon on the search bar or a save button up top go a long way. The most commonly missed elements: navigation links, hidden states, and dynamic interactions like button hovers or micro interactions.

[1:06] **Mistake number two, overusing effects.** Early on, I was addicted to visual effects. Shadows, glows, gradients, you name it. But the truth, overusing them can make your designs feel cluttered and amateur. Let's start with the gradient here. It's blue and green, and it's just not working. If you really need a gradient, stick to variations of the same color, like a darker or lighter green. But honestly, this would look way cleaner with no gradient at all. And that's usually the case. Now, let's talk drop shadows for a second. These Figma defaults are way too harsh. Instead of just lowering opacity, I change the entire shadow color, usually to a light gray, and increase the blur significantly. Or once again, remove the shadow completely. Because most of the time, less visual noise equals a better design.

[1:54] **Mistake number three, spacing.** Most beginner UIs are packed way too tight, like my old app design. So, I'll use two tools here, grids and auto layout to make it so much better. First, we'll set up a three column grid for this screen and two column grid here with these measurements. Now, just align elements to the grid as closely as possible. If something needs to break the grid slightly, like these elements, just leave it as is if it still feels balanced. Next, for stack content like this, increase the vertical spacing to let things breathe and group naturally, especially on mobile screens, you'll need more space than you think. Now, check out these cards and chips. The layouts are pretty wonky. Perfect time to use auto layout. Turn off vertical trim for pixel perfect control and adjust spacing like this. Repeat this across your UI to keep spacing consistent and clean, which is a perfect segue into the next mistake most designers make.

[2:47] **Mistake number four, inconsistent components like spacing.** This one kills me since it's just so easy to fix. You'll notice throughout our design, we have all sorts of different corner radiuses and components like this back and skip button that are exactly the same but designed differently, which just makes the design feel amateur. Instead, let's make a few changes. First, we'll make the two search bars identical other than the prompting text. We'll set the corner radius of all smaller components to be 10 pixels. This is an important one that most designers miss. And of course, we'll update the skip button and back button to match in size, corner radius, and style. Being consistent means using styles for colors, variables for measurements, and components for UI elements to really bring your design together.

[3:32] **Mistake number five, icons.** I think people underestimate how much good icons do for a design and how detrimental bad icons are. First of all, we have no icons on these cards here, which forces users to read more and slows down the browsing process. Let's add in some good icons and replace the save text. Then up above, we have icons, but they're mismatched in fill, line width, and style. We can fix this by using the same library of icons like flat icons. On their website, select interface icons and then sort by stroke, width, and corner to get some consistent results. Make sure when you download to grab SVG for the best results. If you want to choose a Figma plugin instead, I like feather icons and phosphor icons. Finally, we have a fair amount of icons down here without labels. If the icons are well known enough, like the house, bookmark, and user, then you don't need to have anything, but for these two, a tool tip pop-up could make the onboarding process much smoother. Just try not to have bizarre icons everywhere. Finally, this is a very pro tip, but interestingly, it is okay to have different styles of icons in the same design, but only if they're visually separate. For example, these navbar icons are slightly different than the food icons, and those are different than our recipe icons, but it all works together since they're in separate areas of our design and used for different things.

[4:54] **Mistake number six, redundant elements.** Having redundant elements is actually a really common mistake, especially as the trend of having stuff everywhere takes over. Looking at this screen, we can get rid of this arrow since we'll be able to swipe on mobile. And same idea down below. We can also get rid of this arrow since it's really just visual clutter and dim down the color of the button. You could probably argue that these arrows aren't needed either, but we are going to keep those. Finally, the stroke on these elements is really not needed. If you are worried about contrast ratios, dimming it down significantly is a good option, too, but we'll just rip them straight out.

[5:30] **Mistake number seven, interactive feedback.** We've covered overusing effects. So, now let's cover the underuse of different interactive effects. For example, if we're navigating through our flow, but it takes a split second longer for the next screen to load, it looks like we haven't even clicked on the button at all. But if we make it grayed out when we click on it, we've added some interaction and it shows the user that the next screen is coming. Even better, we could add a loading wheel if it's really taking a long time. Another good example is clicking on this save icon. Filling it in is a great first step, but we could also add a red dot to our save tab. So, when we click on the icon, we get it filled in and it's clear to the user that there's a new recipe added to the save tab. We've actually made an entire video just about interactive feedback and micro interactions, so check out that video afterwards to see some really smooth animations.

[6:19] **Bonus mistake number eight, charts.** This is a bonus tip since it has nothing to do with our recipe app, but charts are so often messed up by overdesigning the thing that I thought I should make a point to mention it. I have two charts here. Which one do you think I got from Dribbble? The one on the right. Yes. And it's basically impossible to read without any vertical axis. And even if we had a vertical axis, it's hard to tell where the bar ends with a rounded top. And then there are 16 bars here, but only 7 days of the week. Why would you do that? Whereas the one on the left is simple, definitely less aesthetic, but conveys so much more useful information to the user.

[6:56] And that is everything you'll need to start spotting and correcting beginner mistakes. The Figma file with the mistakes and the full app is in the link in description. Other than that, thank you so much for watching and I'll see you in the next one.
