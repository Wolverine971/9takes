// src/lib/email/enneagram-type-prompt-content.ts
// Canonical copy for the one-off campaign inviting registered users to add
// their Enneagram type. The sequence remains draft-only until an admin
// explicitly activates it and enrolls an eligible audience.

export const ENNEAGRAM_TYPE_PROMPT_KEY = 'enneagram_type_prompt';
export const ENNEAGRAM_TYPE_PROMPT_EMAIL_BUFFER_DAYS = 7;
export const ENNEAGRAM_TYPE_PROMPT_IMAGE_URL =
	'https://9takes.com/email/enneagram-type-prompt/your-personality-v1.png';

export type EnneagramTypePromptContent = {
	sequenceKey: typeof ENNEAGRAM_TYPE_PROMPT_KEY;
	stepNumber: 1;
	subject: string;
	preheader: string;
	htmlContent: string;
	plainText: string;
};

export type EnneagramTypePromptVariant = {
	id: 'a' | 'b' | 'c';
	label: string;
	angle: string;
	state: 'pilot' | 'candidate';
	content: EnneagramTypePromptContent;
};

export const ENNEAGRAM_TYPE_PROMPT_CONTENT: EnneagramTypePromptContent = {
	sequenceKey: ENNEAGRAM_TYPE_PROMPT_KEY,
	stepNumber: 1,
	subject: 'Why we read people differently',
	preheader: 'One question for your next tense conversation. A note from DJ at 9takes.',
	htmlContent: `<p>Life is hard. It's harder when you don't understand people, and it's even harder if you don't understand yourself.</p>
<p>I'm DJ, the person behind 9takes. You created an account, so I wanted to share the idea behind it.</p>
<p>Learning the Enneagram has helped me see the emotions underneath people's actions, what motivates them, and the worldview they're acting from—including my own.</p>
<p>Next time a conversation gets tense, try asking yourself: <strong>What am I trying to protect right now?</strong> My independence, my connection with someone, or my sense of safety?</p>
<p>On 9takes, you can ask questions anonymously and compare answers by Enneagram type. You share your own take before seeing everyone else's. One question, nine perspectives.</p>
<p>Already know your type? Add it to your profile so people can see the perspective behind your answers.</p>
<p style="margin:20px 0;"><a class="button" href="https://9takes.com/account" style="background-color:#F59E0B;color:#0A0807 !important;border-radius:10px;">Add my type</a></p>
<!-- personality-asset:start -->
<p style="margin:24px 0;"><a href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type" style="text-decoration:none;"><img src="${ENNEAGRAM_TYPE_PROMPT_IMAGE_URL}" width="520" alt="Your personality? Instinctual — anger triad (8, 9, 1). Intellectual — fear triad (7, 6, 5). Emotional — shame triad (2, 3, 4). Explore your Enneagram type." style="display:block;width:100%;max-width:520px;height:auto;border:0;" /></a></p>
<!-- personality-asset:end -->
<p>Your perspective matters, and your take matters.</p>
<p>I'd love to get your takes.</p>
<p>DJ<br />9takes</p>
<p>P.S. Still figuring out your type? <a href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type" style="color:#B45309;">Start with this guide.</a></p>`,
	plainText: `Life is hard. It's harder when you don't understand people, and it's even harder if you don't understand yourself.

I'm DJ, the person behind 9takes. You created an account, so I wanted to share the idea behind it.

Learning the Enneagram has helped me see the emotions underneath people's actions, what motivates them, and the worldview they're acting from—including my own.

Next time a conversation gets tense, try asking yourself: What am I trying to protect right now? My independence, my connection with someone, or my sense of safety?

On 9takes, you can ask questions anonymously and compare answers by Enneagram type. You share your own take before seeing everyone else's. One question, nine perspectives.

Already know your type? Add it to your profile so people can see the perspective behind your answers.

Add my type:
https://9takes.com/account

Your perspective matters, and your take matters.

I'd love to get your takes.

DJ
9takes

P.S. Still figuring out your type? Start with this guide:
https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type`
};

const ENNEAGRAM_TYPE_PROMPT_RECOGNITION_CONTENT: EnneagramTypePromptContent = {
	sequenceKey: ENNEAGRAM_TYPE_PROMPT_KEY,
	stepNumber: 1,
	subject: 'Which Enneagram pattern feels most like you?',
	preheader: 'Start with what your attention manages automatically.',
	htmlContent: `<p>Hi {{first_name}},</p>
<p>Everyone uses anger to protect autonomy, shame to manage connection, and fear to anticipate what comes next. The Enneagram asks a more useful question: which pattern organizes your attention before you even notice it?</p>
<p>If one of the nine types already feels recognizable, add it to your profile.</p>
<p style="margin:20px 0;"><a class="button" href="https://9takes.com/account">Add my type</a></p>
<p>Still narrowing it down? Use the <a href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type">10-minute guide</a>. Your type is the pattern you recognize—not a score a quiz hands you.</p>
<p>DJ<br />9takes</p>`,
	plainText: `Hi {{first_name}},

Everyone uses anger to protect autonomy, shame to manage connection, and fear to anticipate what comes next. The Enneagram asks a more useful question: which pattern organizes your attention before you even notice it?

If one of the nine types already feels recognizable, add it to your profile.

Add my type:
https://9takes.com/account

Still narrowing it down? Use the 10-minute guide:
https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type

Your type is the pattern you recognize—not a score a quiz hands you.

DJ
9takes`
};

const ENNEAGRAM_TYPE_PROMPT_FOUNDER_CONTENT: EnneagramTypePromptContent = {
	sequenceKey: ENNEAGRAM_TYPE_PROMPT_KEY,
	stepNumber: 1,
	subject: 'Do you already know your Enneagram type?',
	preheader: 'One small profile update makes 9takes less generic.',
	htmlContent: `<p>Hi {{first_name}},</p>
<p>I’m trying to make 9takes feel less generic. Right now your profile does not have an Enneagram type, so the site cannot connect your perspective to the other eight.</p>
<p>If you know your type, would you add it? It takes less than a minute.</p>
<p style="margin:20px 0;"><a class="button" href="https://9takes.com/account">Add my type</a></p>
<p>If you do not know yet, there is no pressure. This <a href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type">short guide</a> will help you narrow it down without pretending a quiz can decide for you.</p>
<p>Thanks,<br />DJ</p>`,
	plainText: `Hi {{first_name}},

I’m trying to make 9takes feel less generic. Right now your profile does not have an Enneagram type, so the site cannot connect your perspective to the other eight.

If you know your type, would you add it? It takes less than a minute.

Add my type:
https://9takes.com/account

If you do not know yet, there is no pressure. This short guide will help you narrow it down without pretending a quiz can decide for you:
https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type

Thanks,
DJ`
};

export const ENNEAGRAM_TYPE_PROMPT_VARIANTS: EnneagramTypePromptVariant[] = [
	{
		id: 'a',
		label: 'Variant A',
		angle: 'DJ’s invitation to understand people and share your take',
		state: 'pilot',
		content: ENNEAGRAM_TYPE_PROMPT_CONTENT
	},
	{
		id: 'b',
		label: 'Variant B',
		angle: 'Recognition and curiosity',
		state: 'candidate',
		content: ENNEAGRAM_TYPE_PROMPT_RECOGNITION_CONTENT
	},
	{
		id: 'c',
		label: 'Variant C',
		angle: 'Direct founder note',
		state: 'candidate',
		content: ENNEAGRAM_TYPE_PROMPT_FOUNDER_CONTENT
	}
];

export function getEnneagramTypePromptContent(sequenceKey: string, stepNumber: number) {
	if (sequenceKey !== ENNEAGRAM_TYPE_PROMPT_KEY || stepNumber !== 1) {
		return null;
	}

	return ENNEAGRAM_TYPE_PROMPT_CONTENT;
}
