// src/lib/email/welcome-sequence-content.ts
// Canonical copy for the registered-user welcome sequence.
//
// Each step has one job:
//   1 (day 0):  get the first answer - lowest-friction live question, direct link
//   2 (day 2):  give a portable tool they can use off-platform
//   3 (day 5):  show real divergence on one question - the Enneagram hook
//   4 (day 10): ask for their question + honest unsubscribe close

export const WELCOME_SEQUENCE_KEY = 'welcome_sequence';

// Live question threads featured in the sequence. If one of these is ever
// removed or flagged, swap in another high-engagement evergreen question.
const KID_QUESTION_URL = 'https://9takes.com/questions/what-were-you-like-as-a-kid-in-3-words';
const FEAR_QUESTION_URL = 'https://9takes.com/questions/whats-your-biggest-fear';
const ENNEAGRAM_TEST_URL = 'https://9takes.com/enneagram-test';

export type WelcomeSequenceContent = {
	stepNumber: number;
	subject: string;
	preheader: string;
	htmlContent: string;
	plainText: string;
};

export const WELCOME_SEQUENCE_CONTENT: WelcomeSequenceContent[] = [
	{
		stepNumber: 1,
		subject: '{{first_name}}, what were you like as a kid? Three words.',
		preheader: "Answer first. Then see what everyone else said. That's the whole platform.",
		htmlContent: `<p>Hi {{first_name}},</p>
<p>Welcome to 9takes. One rule here: you answer first, then you see everyone else's takes. No lurking, no reading the room before you commit.</p>
<p>So let's skip the tour and start with a live one:</p>
<p><strong>"What were you like as a kid? Three words."</strong></p>
<p>A few dozen people have answered so far. One borrowed their grandma's line: "never a child." Another went "cute, weird, crazy." Same question, completely different people looking back at you.</p>
<p><a class="button" href="${KID_QUESTION_URL}">Drop your three words</a></p>
<p>Takes about two minutes. The moment you answer, every other take unlocks.</p>
<p>DJocrates<br />9takes.com</p>
<p>P.S. If your three words feel a little too honest, you're doing it right.</p>`,
		plainText: `Hi {{first_name}},

Welcome to 9takes. One rule here: you answer first, then you see everyone else's takes. No lurking, no reading the room before you commit.

So let's skip the tour and start with a live one:

"What were you like as a kid? Three words."

A few dozen people have answered so far. One borrowed their grandma's line: "never a child." Another went "cute, weird, crazy." Same question, completely different people looking back at you.

Drop your three words: ${KID_QUESTION_URL}

Takes about two minutes. The moment you answer, every other take unlocks.

DJocrates
9takes.com

P.S. If your three words feel a little too honest, you're doing it right.`
	},
	{
		stepNumber: 2,
		subject: "The 3 questions I ask before I decide someone's being rude",
		preheader: 'Use this once today. It changes what you hear.',
		htmlContent: `<p>Hi {{first_name}},</p>
<p>Here is a 9takes move you can use even when you are not on 9takes.</p>
<p>Before you decide someone is being rude, needy, dramatic, cold, or careless, ask:</p>
<ol>
  <li>What did they think was happening?</li>
  <li>What were they trying to protect?</li>
  <li>What did I assume too quickly?</li>
</ol>
<p>Same moment. Different read. That is where the real conversation starts.</p>
<p>Try it on a live question. Answer first, then look for the assumption you did not realize you were making.</p>
<p><a class="button" href="{{questions_url}}">Try the loop</a></p>
<p>Fair warning: your "first read" usually isn't yours. A single fake upvote shifts a comment's score by 25%, which is why reading the room first is dangerous. <a href="https://9takes.com/community/memetic-comments">Read "Memetic Comments: Why Your Online Opinions Aren't Really Yours"</a>.</p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

Here is a 9takes move you can use even when you are not on 9takes.

Before you decide someone is being rude, needy, dramatic, cold, or careless, ask:

1. What did they think was happening?
2. What were they trying to protect?
3. What did I assume too quickly?

Same moment. Different read. That is where the real conversation starts.

Try it on a live question. Answer first, then look for the assumption you did not realize you were making.

Try the loop: {{questions_url}}

Fair warning: your "first read" usually isn't yours. A single fake upvote shifts a comment's score by 25%, which is why reading the room first is dangerous. Read "Memetic Comments: Why Your Online Opinions Aren't Really Yours": https://9takes.com/community/memetic-comments

DJocrates
9takes.com`
	},
	{
		stepNumber: 3,
		subject: 'Three people answered "What\'s your biggest fear." Zero overlap.',
		preheader: 'Public embarrassment. The group chat dying. Never finding out. Which is yours?',
		htmlContent: `<p>Hi {{first_name}},</p>
<p>There's a question on 9takes that proves the whole premise: <strong>"What's your biggest fear?"</strong></p>
<p>Real answers, side by side:</p>
<ul>
  <li>"Public embarrassment."</li>
  <li>"Losing my friends and the group chat dying."</li>
  <li>"Never achieving/discovering what I am capable of."</li>
</ul>
<p>None of these people are wrong. They're just running different alarm systems. That's the Enneagram in one screenshot: nine types, nine different core fears, and you can usually spot yours in a list like this faster than in any quiz.</p>
<p>Add yours first. Then see where it lands next to everyone else's.</p>
<p><a class="button" href="${FEAR_QUESTION_URL}">Answer "What's your biggest fear?"</a></p>
<p>Want to know which of the nine fears is driving you? <a href="${ENNEAGRAM_TEST_URL}">Take the test</a> after you answer. Your gut response to this question is half the typing work already.</p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

There's a question on 9takes that proves the whole premise: "What's your biggest fear?"

Real answers, side by side:

- "Public embarrassment."
- "Losing my friends and the group chat dying."
- "Never achieving/discovering what I am capable of."

None of these people are wrong. They're just running different alarm systems. That's the Enneagram in one screenshot: nine types, nine different core fears, and you can usually spot yours in a list like this faster than in any quiz.

Add yours first. Then see where it lands next to everyone else's.

Answer "What's your biggest fear?": ${FEAR_QUESTION_URL}

Want to know which of the nine fears is driving you? Take the test after you answer: ${ENNEAGRAM_TEST_URL}
Your gut response to this question is half the typing work already.

DJocrates
9takes.com`
	},
	{
		stepNumber: 4,
		subject: "If 9takes isn't useful in these 3 moments, unsubscribe.",
		preheader: "I'd rather lose you than waste your inbox.",
		htmlContent: `<p>Hi {{first_name}},</p>
<p>9takes earns its place in your inbox if it shows up in one of these moments:</p>
<ul>
  <li>Before you send a text you might regret.</li>
  <li>After a conflict when your version of events feels too clean.</li>
  <li>When you want to see what other people notice before you decide what something means.</li>
</ul>
<p>And here's the move most people miss: if there's a situation you keep replaying in your head - a text, a fight, a weird interaction that won't settle - that's not a sign to ruminate. That's a question.</p>
<p><a class="button" href="{{ask_question_url}}">Post it as a question</a></p>
<p>You'll get reads on it you did not think of. That's the entire point of nine takes.</p>
<p>If none of this is useful, the unsubscribe link below works immediately. I mean that.</p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

9takes earns its place in your inbox if it shows up in one of these moments:

- Before you send a text you might regret.
- After a conflict when your version of events feels too clean.
- When you want to see what other people notice before you decide what something means.

And here's the move most people miss: if there's a situation you keep replaying in your head - a text, a fight, a weird interaction that won't settle - that's not a sign to ruminate. That's a question.

Post it as a question: {{ask_question_url}}

You'll get reads on it you did not think of. That's the entire point of nine takes.

If none of this is useful, the unsubscribe link below works immediately. I mean that.

DJocrates
9takes.com`
	}
];

const WELCOME_SEQUENCE_CONTENT_BY_STEP = new Map(
	WELCOME_SEQUENCE_CONTENT.map((step) => [step.stepNumber, step])
);

export function getManagedSequenceContent(
	sequenceKey: string,
	stepNumber: number
): WelcomeSequenceContent | null {
	if (sequenceKey !== WELCOME_SEQUENCE_KEY) {
		return null;
	}

	return WELCOME_SEQUENCE_CONTENT_BY_STEP.get(stepNumber) ?? null;
}
