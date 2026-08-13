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

export const ENNEAGRAM_TYPE_PROMPT_CONTENT: EnneagramTypePromptContent = {
	sequenceKey: ENNEAGRAM_TYPE_PROMPT_KEY,
	stepNumber: 1,
	subject: 'Do you know your Enneagram type?',
	preheader: 'Start with the three emotions behind the nine types.',
	htmlContent: `<p>Hi {{first_name}},</p>
<p>We noticed you haven’t added an Enneagram type to your 9takes profile. If you don’t know it yet, that’s completely normal.</p>
<p>The Enneagram starts with three centers of intelligence, each connected to a core emotion:</p>
<ul>
  <li><strong>Instinctual intelligence</strong> — anger, boundaries, autonomy, and action</li>
  <li><strong>Emotional intelligence</strong> — shame, connection, image, and worth</li>
  <li><strong>Intellectual intelligence</strong> — fear, security, anticipation, and possibility</li>
</ul>
<p>You use all three. Each Enneagram type develops a different strategy for handling those emotional pressures. That strategy can become both a blind spot and something that feels like a superpower.</p>
<p style="margin:20px 0;"><a class="button" href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type">Find your starting point</a></p>
<p>Already know your type? <a href="https://9takes.com/account">Add it to your 9takes profile</a>.</p>
<p>Knowing your type doesn’t mean everyone with that number sees the world exactly as you do. Two Type 5s can disagree completely. But their takes often reveal a recognizable lens—and that’s where the conversation gets interesting.</p>
<p><a href="https://9takes.com/questions">Browse a question and share your take</a> when you’re ready.</p>
<p>DJ<br />9takes.com</p>`,
	plainText: `Hi {{first_name}},

We noticed you haven’t added an Enneagram type to your 9takes profile. If you don’t know it yet, that’s completely normal.

The Enneagram starts with three centers of intelligence, each connected to a core emotion:

- Instinctual intelligence — anger, boundaries, autonomy, and action
- Emotional intelligence — shame, connection, image, and worth
- Intellectual intelligence — fear, security, anticipation, and possibility

You use all three. Each Enneagram type develops a different strategy for handling those emotional pressures. That strategy can become both a blind spot and something that feels like a superpower.

Find your starting point:
https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type

Already know your type? Add it to your 9takes profile:
https://9takes.com/account

Knowing your type doesn’t mean everyone with that number sees the world exactly as you do. Two Type 5s can disagree completely. But their takes often reveal a recognizable lens—and that’s where the conversation gets interesting.

Browse a question and share your take when you’re ready:
https://9takes.com/questions

DJ
9takes.com`
};

export function getEnneagramTypePromptContent(sequenceKey: string, stepNumber: number) {
	if (sequenceKey !== ENNEAGRAM_TYPE_PROMPT_KEY || stepNumber !== 1) {
		return null;
	}

	return ENNEAGRAM_TYPE_PROMPT_CONTENT;
}
