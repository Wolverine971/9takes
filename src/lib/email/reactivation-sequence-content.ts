// src/lib/email/reactivation-sequence-content.ts
// Canonical copy for the profiles-only reactivation sequence.

export const REACTIVATION_COLD_KEY = 'reactivation_cold';
export const REACTIVATION_DORMANT_KEY = 'reactivation_dormant';
export const REACTIVATION_ZOMBIES_KEY = 'reactivation_zombies';

export const REACTIVATION_SEQUENCE_KEYS = [
	REACTIVATION_COLD_KEY,
	REACTIVATION_DORMANT_KEY,
	REACTIVATION_ZOMBIES_KEY
] as const;

export type ReactivationSequenceKey = (typeof REACTIVATION_SEQUENCE_KEYS)[number];

export type ReactivationBucket = 'cold' | 'dormant' | 'zombies';

export type ReactivationSequenceContent = {
	sequenceKey: ReactivationSequenceKey;
	stepNumber: number;
	subject: string;
	preheader: string;
	htmlContent: string;
	plainText: string;
};

export const REACTIVATION_HERO_URL =
	'https://9takes.com/enneagram-corner/enneagram-and-mental-illness';

// Live question featured in step 3. If it's ever removed or flagged, swap in
// another high-engagement relationship question.
const PARTNER_QUESTION_URL =
	'https://9takes.com/questions/what-are-you-afraid-to-tell-to-your-partner';

// Live homepage question (id 567) featured in every step 1. The quoted answers
// below are real takes from the thread; refresh them if the thread changes.
const MASKING_QUESTION_URL =
	'https://9takes.com/questions/whats-something-every-day-seem-fine-nobody-knows-costing-effort';

const STEP_1_QUESTION_BLOCK_HTML = `<p>The whole platform is one loop: answer a question before you can see anyone else's takes. The value lives in the gap - what you noticed, what other people noticed, what everyone assumed too fast.</p>
<p>Right now one question is pulling the most honest answers on the site:</p>
<p><strong>"What's something you do every day to seem 'fine' that nobody knows is costing you effort?"</strong></p>
<p>One person answered "taking supplements every morning." Another answered "Continuing to be alive." Same question. That range is why 9takes exists.</p>
<p><a class="button" href="${MASKING_QUESTION_URL}">Give your take</a></p>
<p>Your answer unlocks everyone else's. More next week - a personal note about why I built this in the first place.</p>
<p>DJ<br />9takes.com</p>`;

const STEP_1_QUESTION_BLOCK_TEXT = `The whole platform is one loop: answer a question before you can see anyone else's takes. The value lives in the gap - what you noticed, what other people noticed, what everyone assumed too fast.

Right now one question is pulling the most honest answers on the site:

"What's something you do every day to seem 'fine' that nobody knows is costing you effort?"

One person answered "taking supplements every morning." Another answered "Continuing to be alive." Same question. That range is why 9takes exists.

Give your take: ${MASKING_QUESTION_URL}

Your answer unlocks everyone else's. More next week - a personal note about why I built this in the first place.

DJ
9takes.com`;

// Step 2's personal story (the activation blocker) is final as of 2026-06-11.
// Source: docs/brand/founder-story.md (synthesized) + founder-story-brief.md (raw).
// Uses only tidbits cleared for public surfaces (no [needs-ruling] items).
// The admin activation gate accepts this flag in place of a DB copy override.
export const REACTIVATION_STEP_2_FINAL = true;

const YES_URL = '{{re_permission_yes_url}}';
const NO_URL = '{{re_permission_no_url}}';

const STEP_1_BY_SEQUENCE: Record<
	ReactivationSequenceKey,
	Pick<ReactivationSequenceContent, 'subject' | 'preheader' | 'htmlContent' | 'plainText'>
> = {
	[REACTIVATION_COLD_KEY]: {
		subject: "{{first_name}}, you signed up in {{signup_month_year}}. Here's what 9takes is now.",
		preheader: 'And the one question I want your take on.',
		htmlContent: `<p>Hi {{first_name}},</p>
<p>You signed up a couple months back, and I want to use the moment to actually show you what 9takes is - not what it was the day you joined. If this email is a surprise, the unsubscribe link at the bottom works on click one - no guilt, no trick.</p>
${STEP_1_QUESTION_BLOCK_HTML}`,
		plainText: `Hi {{first_name}},

You signed up a couple months back, and I want to use the moment to actually show you what 9takes is - not what it was the day you joined. If this email is a surprise, the unsubscribe link at the bottom works on click one - no guilt, no trick.

${STEP_1_QUESTION_BLOCK_TEXT}`
	},
	[REACTIVATION_DORMANT_KEY]: {
		subject:
			'{{first_name}}, you signed up for 9takes in {{signup_month_year}}. Quick re-introduction.',
		preheader: "It's been a while. One question, and I want your take on it.",
		htmlContent: `<p>Hi {{first_name}},</p>
<p>You signed up for 9takes a while ago. I'll be honest: the product on the day you registered was half of what it is now. And if this email is a surprise, the unsubscribe link at the bottom works on click one - no guilt, no trick.</p>
${STEP_1_QUESTION_BLOCK_HTML}`,
		plainText: `Hi {{first_name}},

You signed up for 9takes a while ago. I'll be honest: the product on the day you registered was half of what it is now. And if this email is a surprise, the unsubscribe link at the bottom works on click one - no guilt, no trick.

${STEP_1_QUESTION_BLOCK_TEXT}`
	},
	[REACTIVATION_ZOMBIES_KEY]: {
		subject: 'You signed up for 9takes back in {{signup_year}}.',
		preheader: 'I owe you a better intro than the silence you got.',
		htmlContent: `<p>Hi {{first_name}},</p>
<p>You signed up for 9takes in {{signup_year}}. That's {{signup_months_ago}} months of me not writing to you, which is on me. Before I start, one line of honesty: if this email is a surprise, the unsubscribe link at the bottom works on click one. No guilt, no trick.</p>
${STEP_1_QUESTION_BLOCK_HTML}`,
		plainText: `Hi {{first_name}},

You signed up for 9takes in {{signup_year}}. That's {{signup_months_ago}} months of me not writing to you, which is on me. Before I start, one line of honesty: if this email is a surprise, the unsubscribe link at the bottom works on click one. No guilt, no trick.

${STEP_1_QUESTION_BLOCK_TEXT}`
	}
};

const SHARED_STEPS: Array<
	Omit<ReactivationSequenceContent, 'sequenceKey'> & {
		stepNumber: 2 | 3 | 4 | 5;
	}
> = [
	{
		stepNumber: 2,
		subject: "9takes wasn't a product idea. it was a pattern.",
		preheader: 'A personal note. 200 words, one reply button.',
		htmlContent: `<p>Hi {{first_name}},</p>
<p>Quick personal note.</p>
<p>9takes started with a fight. My wife and I were newlyweds, having the same argument again, and everything I tried made it worse. When things finally cooled down she said: "DJ, you need to take a personality test." I was humbled enough to actually do it.</p>
<p>Here's what I believed before that: people are the way they are, there's right and wrong, and if you disagree with me, either you don't know the truth or I don't - or you're not being a good person. Simple. And wrong.</p>
<p>The test cracked the door. The Enneagram kicked it open. I'm an 8. My wife is a 7. Our whole problem in one sentence: I didn't fully understand her fear, and she didn't fully understand my anger. I was waving off the thing that runs her ("don't worry about that"), and she was trying to shut down the thing that runs me, which only made it worse. Same fight, two different alarm systems, no map.</p>
<p>I don't need you to believe in the Enneagram. I just want you to notice the pattern once. That's the whole pitch.</p>
<p>If any of that resonates - or you think I'm wrong - hit reply. I read every response.</p>
<p>DJ<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

Quick personal note.

9takes started with a fight. My wife and I were newlyweds, having the same argument again, and everything I tried made it worse. When things finally cooled down she said: "DJ, you need to take a personality test." I was humbled enough to actually do it.

Here's what I believed before that: people are the way they are, there's right and wrong, and if you disagree with me, either you don't know the truth or I don't - or you're not being a good person. Simple. And wrong.

The test cracked the door. The Enneagram kicked it open. I'm an 8. My wife is a 7. Our whole problem in one sentence: I didn't fully understand her fear, and she didn't fully understand my anger. I was waving off the thing that runs her ("don't worry about that"), and she was trying to shut down the thing that runs me, which only made it worse. Same fight, two different alarm systems, no map.

I don't need you to believe in the Enneagram. I just want you to notice the pattern once. That's the whole pitch.

If any of that resonates - or you think I'm wrong - hit reply. I read every response.

DJ
9takes.com`
	},
	{
		stepNumber: 3,
		subject: `"he thinks she's cold. she thinks he's needy."`,
		preheader: "Same moment. Two reads. Which one's yours?",
		htmlContent: `<p>Hi {{first_name}},</p>
<p>Here's the situation people on 9takes keep circling back to.</p>
<p>Two people texting. She replies within the hour, warm but brief. He reads it as cold. Meanwhile, he takes a day to respond because he's actually thinking about what to say. She reads it as needy-in-reverse - why so dramatic about a text.</p>
<p>Both of them are doing the thing they think is considerate. Both of them are sure the other person started it.</p>
<p>This is the shape of most relationship conflict. Not malice. Not even bad communication. Two different internal rulebooks, neither one labeled.</p>
<p>The 9takes move here isn't "who's right." It's: what were each of them scanning for, and what did they assume the other person meant?</p>
<p>There's a live question in the same lane: <strong>"What are you afraid to tell your partner?"</strong> Answer first, then see everyone else's.</p>
<p><a class="button" href="${PARTNER_QUESTION_URL}">Add your take</a></p>
<p>If you've ever been on either side of this one, your read is useful.</p>
<p>DJ<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

Here's the situation people on 9takes keep circling back to.

Two people texting. She replies within the hour, warm but brief. He reads it as cold. Meanwhile, he takes a day to respond because he's actually thinking about what to say. She reads it as needy-in-reverse - why so dramatic about a text.

Both of them are doing the thing they think is considerate. Both of them are sure the other person started it.

This is the shape of most relationship conflict. Not malice. Not even bad communication. Two different internal rulebooks, neither one labeled.

The 9takes move here isn't "who's right." It's: what were each of them scanning for, and what did they assume the other person meant?

There's a live question in the same lane: "What are you afraid to tell your partner?" Answer first, then see everyone else's.

Add your take: ${PARTNER_QUESTION_URL}

If you've ever been on either side of this one, your read is useful.

DJ
9takes.com`
	},
	{
		stepNumber: 4,
		subject: 'Do you still want emails from 9takes?',
		preheader: 'One click either direction.',
		htmlContent: `<p>Hi {{first_name}},</p>
<p>Short one.</p>
<p>You've gotten three emails from me over the last few weeks after a long stretch of nothing. Fair for me to ask where you want this to land.</p>
<p><a class="button" href="${YES_URL}">Yes, keep me on the list</a></p>
<p><a href="${NO_URL}">No, take me off</a></p>
<p>If you say yes, here's what you're opting into: roughly one email every week or two. New questions worth answering. Occasional notes from me. Nothing automated-feeling, nothing daily.</p>
<p>If you say no - no problem. Click once, you're off, we're good.</p>
<p>If you don't click either, I'll take you off the list in a few days to keep things clean.</p>
<p>DJ<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

Short one.

You've gotten three emails from me over the last few weeks after a long stretch of nothing. Fair for me to ask where you want this to land.

Yes, keep me on the list: ${YES_URL}

No, take me off: ${NO_URL}

If you say yes, here's what you're opting into: roughly one email every week or two. New questions worth answering. Occasional notes from me. Nothing automated-feeling, nothing daily.

If you say no - no problem. Click once, you're off, we're good.

If you don't click either, I'll take you off the list in a few days to keep things clean.

DJ
9takes.com`
	},
	{
		stepNumber: 5,
		subject: "You've been unsubscribed from 9takes.",
		preheader: "Easy to reverse if that's wrong.",
		htmlContent: `<p>Hi {{first_name}},</p>
<p>You didn't click yes or no on the last one, so I took you off the list.</p>
<p>No hard feelings. Inbox space is real.</p>
<p>If that was the wrong call, <a href="${YES_URL}">put me back on</a>.</p>
<p>Either way - good luck out there.</p>
<p>DJ<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

You didn't click yes or no on the last one, so I took you off the list.

No hard feelings. Inbox space is real.

If that was the wrong call, put me back on: ${YES_URL}

Either way - good luck out there.

DJ
9takes.com`
	}
];

export const REACTIVATION_SEQUENCE_CONTENT: ReactivationSequenceContent[] =
	REACTIVATION_SEQUENCE_KEYS.flatMap((sequenceKey) => [
		{
			sequenceKey,
			stepNumber: 1,
			...STEP_1_BY_SEQUENCE[sequenceKey]
		},
		...SHARED_STEPS.map((step) => ({
			sequenceKey,
			...step
		}))
	]);

const REACTIVATION_SEQUENCE_CONTENT_BY_KEY_AND_STEP = new Map<string, ReactivationSequenceContent>(
	REACTIVATION_SEQUENCE_CONTENT.map((step) => [`${step.sequenceKey}:${step.stepNumber}`, step])
);

export function isReactivationSequenceKey(value: string): value is ReactivationSequenceKey {
	return REACTIVATION_SEQUENCE_KEYS.includes(value as ReactivationSequenceKey);
}

export function getReactivationStep(
	sequenceKey: string,
	stepNumber: number
): ReactivationSequenceContent | null {
	return REACTIVATION_SEQUENCE_CONTENT_BY_KEY_AND_STEP.get(`${sequenceKey}:${stepNumber}`) ?? null;
}

export function getReactivationSequenceKeyForBucket(
	bucket: ReactivationBucket
): ReactivationSequenceKey {
	switch (bucket) {
		case 'cold':
			return REACTIVATION_COLD_KEY;
		case 'dormant':
			return REACTIVATION_DORMANT_KEY;
		case 'zombies':
			return REACTIVATION_ZOMBIES_KEY;
	}
}
