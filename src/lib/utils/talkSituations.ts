// src/lib/utils/talkSituations.ts
//
// The doors on /book-session ("Talk it through", DJ 2026-10-05). The page leads
// with the visitor's situation, not with DJ: they tap the one closest to what's
// going on, the note box opens with a question written for it, and an example
// reply shows what they'd get back before they write a word.
//
// Example replies are illustrative, labeled "Example reply" on the page, and
// written to the do-not-write list: same behavior, different motives, hedged
// ("for some people"), never a type read off one behavior, never a childhood
// cause stated as certain.
//
// Taps and sent notes are counted per situation in cta_experiment_events under
// TALK_SITUATIONS_EXPERIMENT, so /admin/consulting/notes shows which situations
// pull people in. Keep ids stable; renaming one splits its counts.

export const TALK_SITUATIONS_EXPERIMENT = 'talk_situations_v1';

export type TalkSituation = {
	id: string;
	/** The door, in the visitor's own words. */
	label: string;
	hint: string;
	/** The question the note box asks once this door is open. */
	prompt: string;
	helper: string;
	placeholder: string;
	exampleReply: string;
	/** Heavy-topic doors show the 988 line inside the note box, not only at the bottom. */
	showCrisisLine?: boolean;
};

export const TALK_SITUATIONS: readonly TalkSituation[] = [
	{
		id: 'someone',
		label: 'Someone I can’t read',
		hint: 'A partner, boss, parent, or friend',
		prompt: 'Who is it, and what do they do that doesn’t make sense to you?',
		helper: 'Tell me about the last time. What they did, what you did, and how it landed.',
		placeholder: 'My manager goes quiet every time I…',
		exampleReply:
			'Quiet after you push back can mean different things. For some people it’s anger. For others it’s holding back something they can’t take back. Next time, ask what she needs before she answers, and watch whether the quiet changes.'
	},
	{
		id: 'fight',
		label: 'The fight we keep having',
		hint: 'Same argument, different day',
		prompt: 'What’s the fight about on the surface, and what does it feel like underneath?',
		helper: 'Give me the last round: who said what, and what you wished they’d understood.',
		placeholder: 'It starts with the dishes, but really…',
		exampleReply:
			'The dishes sound like the surface. You may be hearing “you don’t care,” while they’re hearing “you’re failing again.” Same fight, two different alarms. Next round, try saying out loud which one you’re hearing before you answer what they said.'
	},
	{
		id: 'pattern',
		label: 'A pattern I keep repeating',
		hint: 'You know better, and still',
		prompt: 'What do you keep doing, and what happens right before you do it?',
		helper: 'The moment before matters most. What were you feeling, or trying to avoid?',
		placeholder: 'Every time things get serious, I…',
		exampleReply:
			'Pulling away right when things get good usually isn’t random. For some people, closeness sets off an alarm about losing themselves. For others, it’s about getting hurt first. You already named the moment it starts. Let’s look at what that moment protects you from.'
	},
	{
		id: 'type',
		label: 'Stuck between two types',
		hint: 'It could go either way',
		prompt: 'Which two types, and what makes you unsure?',
		helper: 'Tell me what you do under stress, and what you’d hate for people to think about you.',
		placeholder: 'I test as a 6, but the 5 description hits too…',
		exampleReply:
			'A lot of people can’t split 6 and 5 by behavior, because both pull back and prepare. The difference is usually why. Many 6s prepare for what could go wrong; many 5s prepare so they won’t run out. Which one sounds like the voice in your head at 2am?'
	},
	{
		id: 'unsaid',
		label: 'Something I haven’t said out loud',
		hint: 'Heavy, or just stuck',
		prompt: 'What have you been carrying?',
		helper: 'Say it however it comes out. You can stay anonymous.',
		placeholder: 'I’ve never told anyone this, but…',
		exampleReply:
			'Thank you for trusting me with that. Saying it is a step a lot of people never take. Before we get to what to do about it, I want to understand what it costs you to keep carrying it. What changes on the days it’s loudest?',
		showCrisisLine: true
	},
	{
		id: 'else',
		label: 'Something else',
		hint: 'Whatever’s on your mind',
		prompt: 'What’s going on?',
		helper: 'Say it the way you’d say it to a friend.',
		placeholder: 'Lately I keep thinking about…',
		exampleReply:
			'You said the job looks fine on paper and still drains you. That gap is worth a look. What the role rewards and what you need to feel useful might be two different things. Which part of your week do you actually look forward to?'
	}
];

const SITUATIONS_BY_ID = new Map(TALK_SITUATIONS.map((situation) => [situation.id, situation]));

export function isTalkSituationId(value: unknown): value is string {
	return typeof value === 'string' && SITUATIONS_BY_ID.has(value);
}

export function talkSituationById(id: string | null | undefined): TalkSituation | null {
	return (id && SITUATIONS_BY_ID.get(id)) || null;
}

/** "451" → "450+": the credential line rounds down so it never overstates. */
export function roundedCorpusCount(published: number): string | null {
	if (!Number.isFinite(published) || published < 10) return null;
	return `${Math.floor(published / 10) * 10}+`;
}
