---
title: "Bad UI, but it's professional grade"
video_id: -ZHMpxN2jUg
url: 'https://www.youtube.com/watch?v=-ZHMpxN2jUg'
channel: Hyperplexed
channel_url: 'https://www.youtube.com/@Hyperplexed'
upload_date: 2026-06-10
duration: '05:54'
views: 80721
description: |
  Check out Mobbin! https://mobbin.com/?via=hyperplexed

  Demo: https://plinkoinput.com

  Repo: https://github.com/githyperplexed/plinko-input

  Reddit posts:

  https://www.reddit.com/r/badUIbattles/comments/1p6xzil/enter_phone_number_but_by_slingshot/

  https://www.reddit.com/r/badUIbattles/comments/r5g7ee/i_hope_youre_good_at_tanks/

  https://www.reddit.com/r/badUIbattles/comments/s8u3v6/checkboxes_with_a_50_success_rate/
transcribed_date: '2026-06-26'
path: .claude/skills/hyperplexed-audit/references/transcripts/bad-ui-professional-grade.md
---

# Bad UI, but it's professional grade

## Metadata

- **Channel**: [Hyperplexed](https://www.youtube.com/@Hyperplexed)
- **Video**: [Watch on YouTube](https://www.youtube.com/watch?v=-ZHMpxN2jUg)
- **Duration**: 05:54
- **Upload Date**: 2026-06-10
- **Views**: 80,721

## Transcript

This is r/badUIbattles, a place where anyone can post bad UI designs from around the web. The submissions can either be intentionally bad UI, like gamified versions of standard inputs, or unintentional, such as the platform I'm posting this video to. Today, I'm going to be taking three of my favorites and combining them together into a single, professional-grade terrible experience. The rules are simple. I must incorporate at least one element from each of the three candidates. The UI must excel at infuriating the user at whatever it is they're trying to achieve. And the final result must be fully functional and extremely polished. The sort of thing that might win site of the day on evilawards.com. But from a visual and functional perspective, it should be passable on sites known for exceptional UI, such as Linear, Vercel, or the sponsor of today's video, Mobbin. Something I've always struggled with when I'm designing a new UI is knowing where to begin. But Mobbin has solved that issue with their massive, searchable library of mobile app and web screenshots. Say I'm designing an account setup screen and I want to know how the best in the biz would do it. Well, now I can instantly search and find hundreds of great examples. In the age of AI, the barrier is no longer generating the interface, but making it look and function well based on proven, real-world examples certainly is. With Mobbin's new MCP server, I can easily give my agents direct access to their entire database of references. If you want to help support this channel so I can make more videos like this one and get access to the world's largest library of UI/UX references, check out the link in the description below. First up, we have the top submission in all of bad UI battles history. A seemingly innocuous checkbox turns into a randomized Plinko game that reduces your chances of getting your intended result by half. I'm noting the Plinko board as an excellent tool for user frustration. Next up, we have a specialized login form where entering characters requires you to launch a projectile by maneuvering different control bars, much like the classic game of Tanks. And finally, we have a similar concept, a phone number slingshot. Once again, we are firing something at target values, but this time instead of sliders, we get to interact directly with the projectile. I've decided that for our feature, we're going to mirror the character buckets from the tank game. I don't know what they're going to be for just yet, but I want to be different. So, I'm going to put them on the sidewall instead of the bottom. On the opposite side, I want a cannon apparatus that slides back and forth and fires our projectiles. I've had some time to think about it further, and I've decided that I really want this to be something a popular site might actually pick up and use. So, it can't be as high traffic as an actual login form, but maybe they'd consider it for a slightly less frequent flow, such as a one-time code input. So, let's get some character inputs on the screen, and we are immediately going to disable them. For the MVP, all we needed to do is click to fire, and when a target letter is hit, it fills out the corresponding index in the form. This implementation is obviously far too straightforward. So, you know what? I've decided I want to be less different and move things back to a top-down approach, because I'm thinking I want to introduce a physics system now, where the projectile can bounce around within the environment, similar to submission number three. There's sort of a glaring issue with the character slots, however, in that there's not really much interacting to be done. So, what if we switch things up a bit and make the slots more like rounded cups, which makes it significantly more difficult to land a ball in the intended target. But, there's still another problem. If you just position your mouse directly over the center of a cup, you can actually get it to bounce perfectly in place, which kind of defeats the purpose. So, what if we try disabling the cursor? Uh, I guess that works, but it's kind of cheap, and you can still easily re-enable it via dev tools. Oh, duh. We still need to add in some Plinko pegs. So, why don't we just center one directly over the cheap spot for each cup? Okay, that does make it a bit harder, but I can still finagle my way into a specific cup by grazing one of the sides, which is certainly not ideal. So, I'm going to propose that we switch things up again and try inverting the bowls into domes. In theory, it's still possible to bounce a ball directly on top of a dome, but that doesn't really provide much advantage. So, by and large, I think our difficulty issue is solved. I would even go so far as to say that we've crossed the line into complete randomness. If we zoom out to the full-size game, it's now virtually impossible to predict which slot a ball will land in. Stopping now would mean shipping a product that is completely useless. So, my newest proposal is that we dial it back, but that we do so strategically. Because the physics engine we've implemented is deterministic, we can calculate the entire path the ball will take before it ever leaves the cannon, which means that we can assist the user with a guideline. But, how much do we actually give them? On the low end, we have a single vertical path leading to the first point of impact, and on the high end, we could give them the full thing. Since neither of those options make much sense here, I'm thinking we go somewhere in between and give them three. Although, I will say, after trying it out a bit, I still have yet to hit a single target, let alone entering a full code. So, new idea. If the current path is in alignment with the correct target, we highlight the path and associated slot green. Okay, so that makes it extremely easy to know when you're going to hit. It's just incredibly frustrating to actually find a valid line. So, I'm going to declare that we've reached a point of being what I would call frustratingly possible. And I suppose that's a good place to be. So, how would I go about polishing this thing up for the real world? Well, for one, we can display the current code up top along with an option to generate a new code. And in case the user gets stuck, they can request a hint to help them out. In the off chance they endure long enough to enter a correct code, a simple success screen congratulating them is the least we can do. I'll leave a link to the demo site and repo in the description below. Thanks for watching and I'll see you in the next one.
