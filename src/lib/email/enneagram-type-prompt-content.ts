// src/lib/email/enneagram-type-prompt-content.ts
// Canonical copy for the one-off campaign inviting registered users to add
// their Enneagram type. The sequence remains draft-only until an admin
// explicitly activates it and enrolls an eligible audience.

export const ENNEAGRAM_TYPE_PROMPT_KEY = 'enneagram_type_prompt';
export const ENNEAGRAM_TYPE_PROMPT_EMAIL_BUFFER_DAYS = 7;

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
	subject: 'Make 9takes more useful to you',
	preheader: 'Add your Enneagram type in less than a minute.',
	htmlContent: `<p>Hi {{first_name}},</p>
<p>9takes gets more interesting when the same question is answered from nine different perspectives. If we know your Enneagram type, we can place your take in that conversation and show you where the other types see it differently.</p>
<p>If you already know your number, adding it takes less than a minute.</p>
<p style="margin:20px 0;"><a class="button" href="https://9takes.com/account">Add my type</a></p>
<p>Not sure yet? Use the <a href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type">10-minute guide to finding your starting point</a>. No quiz score gets to decide for you—choose the pattern you recognize in yourself.</p>
<p>DJ<br />9takes</p>`,
	plainText: `Hi {{first_name}},

9takes gets more interesting when the same question is answered from nine different perspectives. If we know your Enneagram type, we can place your take in that conversation and show you where the other types see it differently.

If you already know your number, adding it takes less than a minute.

Add my type:
https://9takes.com/account

Not sure yet? Use the 10-minute guide to finding your starting point:
https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type

No quiz score gets to decide for you—choose the pattern you recognize in yourself.

DJ
	9takes`
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
		angle: 'Product payoff',
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
