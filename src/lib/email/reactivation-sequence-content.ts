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

const YES_URL = '{{re_permission_yes_url}}';
const NO_URL = '{{re_permission_no_url}}';

const STEP_1_BY_SEQUENCE: Record<
	ReactivationSequenceKey,
	Pick<ReactivationSequenceContent, 'subject' | 'preheader' | 'htmlContent' | 'plainText'>
> = {
	[REACTIVATION_COLD_KEY]: {
		subject: "{{first_name}}, you signed up in {{signup_month_year}}. Here's what 9takes is now.",
		preheader:
			"One situation, nine ways to see it. Here's the best thread we've had since you joined.",
		htmlContent: `<p>Hi {{first_name}},</p>
<p>You signed up a couple months back, and I want to use the moment to actually show you what 9takes is - not what it was the day you joined.</p>
<p>Here's the loop the whole platform runs on:</p>
<ol>
  <li>Pick a question that feels real.</li>
  <li>Answer before seeing what anyone else thinks.</li>
  <li>Compare your read with other people's.</li>
</ol>
<p>The value is the gap - what you noticed, what other people noticed, what everyone assumed too fast.</p>
<p>The piece I'd start with: <a href="{{hero_url}}">Enneagram and Mental Illness</a>. It's the most-read thing on 9takes and the cleanest example of why I care about this work.</p>
<p><a class="button" href="{{questions_url}}">Answer one live question</a></p>
<p>More next week - a personal note about why I built this in the first place.</p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

You signed up a couple months back, and I want to use the moment to actually show you what 9takes is - not what it was the day you joined.

Here's the loop the whole platform runs on:

1. Pick a question that feels real.
2. Answer before seeing what anyone else thinks.
3. Compare your read with other people's.

The value is the gap - what you noticed, what other people noticed, what everyone assumed too fast.

The piece I'd start with: Enneagram and Mental Illness. It's the most-read thing on 9takes and the cleanest example of why I care about this work.
{{hero_url}}

Answer one live question: {{questions_url}}

More next week - a personal note about why I built this in the first place.

DJocrates
9takes.com`
	},
	[REACTIVATION_DORMANT_KEY]: {
		subject: 'You signed up for 9takes in {{signup_month_year}}. Quick re-introduction.',
		preheader: "It's been a while. Here's what it's become.",
		htmlContent: `<p>Hi {{first_name}},</p>
<p>You signed up for 9takes a while ago. I'll be honest: the product on the day you registered was half of what it is now. Here's the short version of what changed.</p>
<p>Here's the loop the whole platform runs on:</p>
<ol>
  <li>Pick a question that feels real.</li>
  <li>Answer before seeing what anyone else thinks.</li>
  <li>Compare your read with other people's.</li>
</ol>
<p>The value is the gap - what you noticed, what other people noticed, what everyone assumed too fast.</p>
<p>The piece I'd start with: <a href="{{hero_url}}">Enneagram and Mental Illness</a>. It's the most-read thing on 9takes and the cleanest example of why I care about this work.</p>
<p><a class="button" href="{{questions_url}}">Answer one live question</a></p>
<p>More next week - a personal note about why I built this in the first place.</p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

You signed up for 9takes a while ago. I'll be honest: the product on the day you registered was half of what it is now. Here's the short version of what changed.

Here's the loop the whole platform runs on:

1. Pick a question that feels real.
2. Answer before seeing what anyone else thinks.
3. Compare your read with other people's.

The value is the gap - what you noticed, what other people noticed, what everyone assumed too fast.

The piece I'd start with: Enneagram and Mental Illness. It's the most-read thing on 9takes and the cleanest example of why I care about this work.
{{hero_url}}

Answer one live question: {{questions_url}}

More next week - a personal note about why I built this in the first place.

DJocrates
9takes.com`
	},
	[REACTIVATION_ZOMBIES_KEY]: {
		subject: 'You signed up for 9takes back in {{signup_year}}.',
		preheader: 'I owe you a better intro than the silence you got.',
		htmlContent: `<p>Hi {{first_name}},</p>
<p>You signed up for 9takes in {{signup_year}}. That's {{signup_months_ago}} months of me not writing to you, which is on me. Before I start, one line of honesty: if this email is a surprise, the unsubscribe link at the bottom works on click one. No guilt, no trick.</p>
<p>Here's the loop the whole platform runs on:</p>
<ol>
  <li>Pick a question that feels real.</li>
  <li>Answer before seeing what anyone else thinks.</li>
  <li>Compare your read with other people's.</li>
</ol>
<p>The value is the gap - what you noticed, what other people noticed, what everyone assumed too fast.</p>
<p>The piece I'd start with: <a href="{{hero_url}}">Enneagram and Mental Illness</a>. It's the most-read thing on 9takes and the cleanest example of why I care about this work.</p>
<p><a class="button" href="{{questions_url}}">Answer one live question</a></p>
<p>More next week - a personal note about why I built this in the first place.</p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

You signed up for 9takes in {{signup_year}}. That's {{signup_months_ago}} months of me not writing to you, which is on me. Before I start, one line of honesty: if this email is a surprise, the unsubscribe link at the bottom works on click one. No guilt, no trick.

Here's the loop the whole platform runs on:

1. Pick a question that feels real.
2. Answer before seeing what anyone else thinks.
3. Compare your read with other people's.

The value is the gap - what you noticed, what other people noticed, what everyone assumed too fast.

The piece I'd start with: Enneagram and Mental Illness. It's the most-read thing on 9takes and the cleanest example of why I care about this work.
{{hero_url}}

Answer one live question: {{questions_url}}

More next week - a personal note about why I built this in the first place.

DJocrates
9takes.com`
	}
};

const SHARED_STEPS: Array<
	Omit<ReactivationSequenceContent, 'sequenceKey'> & {
		stepNumber: 2 | 3 | 4 | 5;
	}
> = [
	{
		stepNumber: 2,
		subject: "why I'm obsessed with this",
		preheader: 'A personal note. 200 words, one reply button.',
		htmlContent: `<p>Hi {{first_name}},</p>
<p>Quick personal note.</p>
<p>The reason 9takes exists is pattern-recognition, not a product idea. I spent years watching people I loved - friends, family, myself - misread each other with total confidence. Same moment, two completely different internal movies playing. Both people certain they saw it clearly. Both wrong about the other's read.</p>
<p>The Enneagram is the first lens I found that actually decoded the pattern. Not "what personality are you." More like: what are you protecting, what are you scanning for, what assumption are you making about the other person's motive that isn't true.</p>
<p>I don't need you to believe in the Enneagram. I just want you to notice the pattern once. That's the whole pitch.</p>
<p><em>DJ note: replace this paragraph with the concrete story before activating the campaign.</em></p>
<p>If any of that resonates - or disagrees with how you see things - hit reply. I read every response.</p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

Quick personal note.

The reason 9takes exists is pattern-recognition, not a product idea. I spent years watching people I loved - friends, family, myself - misread each other with total confidence. Same moment, two completely different internal movies playing. Both people certain they saw it clearly. Both wrong about the other's read.

The Enneagram is the first lens I found that actually decoded the pattern. Not "what personality are you." More like: what are you protecting, what are you scanning for, what assumption are you making about the other person's motive that isn't true.

I don't need you to believe in the Enneagram. I just want you to notice the pattern once. That's the whole pitch.

DJ note: replace this paragraph with the concrete story before activating the campaign.

If any of that resonates - or disagrees with how you see things - hit reply. I read every response.

DJocrates
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
<p>This is the shape of 80% of relationship conflict. Not malice. Not even bad communication. Two different internal rulebooks, neither one labeled.</p>
<p>The 9takes move here isn't "who's right." It's: what were each of them scanning for, and what did they assume the other person meant?</p>
<p><a class="button" href="{{questions_url}}">Read the full thread and add your take</a></p>
<p>If you've ever been on either side of this one, your read is useful.</p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

Here's the situation people on 9takes keep circling back to.

Two people texting. She replies within the hour, warm but brief. He reads it as cold. Meanwhile, he takes a day to respond because he's actually thinking about what to say. She reads it as needy-in-reverse - why so dramatic about a text.

Both of them are doing the thing they think is considerate. Both of them are sure the other person started it.

This is the shape of 80% of relationship conflict. Not malice. Not even bad communication. Two different internal rulebooks, neither one labeled.

The 9takes move here isn't "who's right." It's: what were each of them scanning for, and what did they assume the other person meant?

Read the full thread and add your take: {{questions_url}}

If you've ever been on either side of this one, your read is useful.

DJocrates
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
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

Short one.

You've gotten three emails from me over the last few weeks after a long stretch of nothing. Fair for me to ask where you want this to land.

Yes, keep me on the list: ${YES_URL}

No, take me off: ${NO_URL}

If you say yes, here's what you're opting into: roughly one email every week or two. New questions worth answering. Occasional notes from me. Nothing automated-feeling, nothing daily.

If you say no - no problem. Click once, you're off, we're good.

If you don't click either, I'll take you off the list in a few days to keep things clean.

DJocrates
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
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

You didn't click yes or no on the last one, so I took you off the list.

No hard feelings. Inbox space is real.

If that was the wrong call, put me back on: ${YES_URL}

Either way - good luck out there.

DJocrates
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
