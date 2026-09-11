// src/lib/data/homepagePracticeV2.ts
// Snapshot for V2; edits here do not alter the current homepage.
// AI-written editorial examples for a private, browser-only practice exercise.
// These are possible motivations, never participant responses or a type assessment.
export type Perspective = {
	id: number;
	priority: string;
	take: string;
	underneath: string;
	contrast: number;
};

export type PracticeQuestion = {
	id: string;
	question: string;
	hint: string;
	revealTitle: string;
	liveSlug: string | null;
	perspectives: Perspective[];
};

export const practiceQuestions: PracticeQuestion[] = [
	{
		id: 'friendship',
		question: 'What makes someone a good friend?',
		hint: 'A few honest words are enough.',
		revealTitle: 'One friendship. Different things to value.',
		liveSlug: 'whats-criteria-considering-someone-friend',
		perspectives: [
			{
				id: 1,
				priority: 'Honesty',
				take: 'Tell me the truth, even when it would be easier to agree with me.',
				underneath:
					'For this person, being challenged can feel like respect. Easy agreement may leave them wondering what went unsaid.',
				contrast: 9
			},
			{
				id: 2,
				priority: 'Closeness',
				take: 'Notice when I am having a hard day. Sometimes I find it hard to ask for company.',
				underneath:
					'Reaching out without being asked can make care feel personal. Silence might feel like being forgotten.',
				contrast: 5
			},
			{
				id: 3,
				priority: 'Encouragement',
				take: 'Root for what I am building, and remind me I matter when it does not work out.',
				underneath:
					'They value someone who sees both the ambition and the person behind it. Support means more than celebrating a win.',
				contrast: 4
			},
			{
				id: 4,
				priority: 'Being understood',
				take: 'Let me be the complicated version of myself, not just the fun one.',
				underneath:
					'They want room for feelings that are difficult to explain. Being understood may matter more than being cheered up.',
				contrast: 7
			},
			{
				id: 5,
				priority: 'Space',
				take: 'Be comfortable with a week of silence. I want space without losing the friendship.',
				underneath:
					'Room to withdraw can make the connection feel sustainable. Constant contact might feel like another obligation.',
				contrast: 2
			},
			{
				id: 6,
				priority: 'Reliability',
				take: 'Show up when things get awkward, not just when they are easy.',
				underneath:
					'Consistency makes it easier to trust the relationship. A small promise kept may matter more than a grand gesture.',
				contrast: 7
			},
			{
				id: 7,
				priority: 'Possibility',
				take: 'Pull me into something new when I have been living the same week on repeat.',
				underneath:
					'Sharing an experience can be a way of caring. An invitation might offer relief when another serious conversation would not.',
				contrast: 4
			},
			{
				id: 8,
				priority: 'Directness',
				take: 'Say it straight. I can handle disagreement better than being handled.',
				underneath:
					'Candor gives them something real to respond to. Softening everything can feel less trustworthy than an honest difference.',
				contrast: 9
			},
			{
				id: 9,
				priority: 'Steadiness',
				take: 'Let us disagree without making me feel the friendship is on the line.',
				underneath:
					'Knowing the connection can survive tension makes it easier to speak freely. A calm response can create room for honesty.',
				contrast: 1
			}
		]
	},
	{
		id: 'cancelled-plans',
		question: 'A friend cancels dinner at the last minute. What is your first reaction?',
		hint: 'Think of a real first reaction, even a small one.',
		revealTitle: 'Same cancelled dinner. Different stakes.',
		liveSlug: null,
		perspectives: [
			{
				id: 1,
				priority: 'Consideration',
				take: 'I moved things around for this. I wish they had given me more notice.',
				underneath:
					'The disrupted plan matters because it represents effort. Acknowledging that effort could matter more than a replacement dinner.',
				contrast: 9
			},
			{
				id: 2,
				priority: 'Connection',
				take: 'I was really looking forward to seeing them. I would like to know they were, too.',
				underneath:
					'Reassurance that the time together mattered can soften disappointment. Logistics alone may not address what feels lost.',
				contrast: 5
			},
			{
				id: 3,
				priority: 'Momentum',
				take: 'Okay, I can use the evening to finish something. But I hope we actually reschedule.',
				underneath:
					'Making use of the time can restore a sense of direction. Moving on quickly does not necessarily mean they did not care.',
				contrast: 4
			},
			{
				id: 4,
				priority: 'Meaning',
				take: 'I know things happen. I still wonder whether this meant more to me than to them.',
				underneath:
					'The change can raise questions about how the relationship is valued. A personal explanation may land differently from a quick apology.',
				contrast: 7
			},
			{
				id: 5,
				priority: 'Breathing room',
				take: 'Honestly, a quiet evening sounds good. I can miss them and still be relieved.',
				underneath:
					'Relief can reflect depleted energy rather than indifference. The need for solitude can coexist with wanting a friendship.',
				contrast: 2
			},
			{
				id: 6,
				priority: 'Reassurance',
				take: 'Is everything okay? This is not like them.',
				underneath:
					'An unexpected change can create uncertainty. Knowing what happened may matter more than fixing the calendar immediately.',
				contrast: 7
			},
			{
				id: 7,
				priority: 'Options',
				take: 'Disappointing. Maybe someone else is free, or I can finally try that new place.',
				underneath:
					'Finding an alternative keeps the evening open. A quick pivot can be a way to manage disappointment, not deny the friendship.',
				contrast: 4
			},
			{
				id: 8,
				priority: 'Straight answers',
				take: 'Tell me what happened. If you just did not feel like it, I would rather know.',
				underneath:
					'An honest explanation can preserve trust. A vague excuse may feel worse than an uncomfortable truth.',
				contrast: 9
			},
			{
				id: 9,
				priority: 'Ease',
				take: 'No problem, we will find another night. I do not want one dinner to become a fight.',
				underneath:
					'Keeping the relationship easy matters. That can be generous, but it may also leave their own disappointment unspoken.',
				contrast: 1
			}
		]
	}
];

export const faqs = [
	{
		question: 'What is 9takes?',
		answer:
			'9takes is a question-and-answer community for understanding how people see the same situation differently. This page starts with a private exercise using AI-written examples. Live question pages let you add an answer, then read and reply to other people.'
	},
	{
		question: 'What happens to my answer here?',
		answer:
			'This practice keeps your answer in this tab’s memory. It is not posted, sent to an AI, or saved after a refresh. The live question pages are different: submitting there adds your answer to the conversation.'
	},
	{
		question: 'Who wrote the 9 perspectives?',
		answer:
			'These are AI-written examples prepared for this practice using the 9 Enneagram types. They are not answers from community members. Your words do not change the examples or generate a personality assessment.'
	},
	{
		question: 'Do I need to know my Enneagram type?',
		answer:
			'No. Start with what feels familiar or surprising. The Enneagram is a framework for exploring 9 recurring patterns of motivation. One response cannot tell you someone’s type, and the same priority can show up in several types.'
	},
	{
		question: 'Why answer before seeing the perspectives?',
		answer:
			'It gives you a first reaction to compare with the examples, before those examples can influence what you write. You can then notice what you included, what you missed, and what you disagree with.'
	},
	{
		question: 'Can I talk to real people on 9takes?',
		answer:
			'Yes. The live questions have community answers. You can answer without an account, then read and reply to others. The number of answers and represented types varies by question.'
	}
];
