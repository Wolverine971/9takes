// src/lib/email/welcome-sequence-content.ts
// Canonical copy for the registered-user welcome sequence.

export const WELCOME_SEQUENCE_KEY = 'welcome_sequence';

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
		subject: "You answer before you read. Here's why that matters.",
		preheader: 'Most apps train you to read the room first. 9takes flips the order.',
		htmlContent: `<p>Hi {{first_name}},</p>
<p>Most social apps train you to read the room first. 9takes works in the opposite order.</p>
<ol>
  <li>Pick a question that feels real.</li>
  <li>Answer before seeing the crowd.</li>
  <li>Then compare your read with everyone else's.</li>
</ol>
<p>The value is the gap: what you noticed, what other people noticed, and what everyone assumed too quickly.</p>
<p><a class="button" href="{{questions_url}}">Answer one question</a></p>
<p>Start with the question that gives you an instant opinion. That usually means there is something worth seeing.</p>
<p>Want the longer version of why I built it this way? <a href="https://9takes.com/community/introducing-9takes">Read "Introducing 9takes: Answer First, Then Compare Perspectives."</a></p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

Most social apps train you to read the room first. 9takes works in the opposite order.

1. Pick a question that feels real.
2. Answer before seeing the crowd.
3. Then compare your read with everyone else's.

The value is the gap: what you noticed, what other people noticed, and what everyone assumed too quickly.

Answer one question: {{questions_url}}

Start with the question that gives you an instant opinion. That usually means there is something worth seeing.

Want the longer version of why I built it this way? Read "Introducing 9takes: Answer First, Then Compare Perspectives": https://9takes.com/community/introducing-9takes

DJocrates
9takes.com`
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
<p>A warning though: your "first read" usually isn't yours. A single fake upvote shifts a comment's score by 25%, which is why reading-the-room-first is dangerous. <a href="https://9takes.com/community/memetic-comments">Read "Memetic Comments: Why Your Online Opinions Aren't Really Yours."</a></p>
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

A warning though: your "first read" usually isn't yours. A single fake upvote shifts a comment's score by 25%, which is why reading-the-room-first is dangerous. Read "Memetic Comments: Why Your Online Opinions Aren't Really Yours": https://9takes.com/community/memetic-comments

DJocrates
9takes.com`
	},
	{
		stepNumber: 3,
		subject: '"Why are people so fake?" is a broken question. Here\'s the fix.',
		preheader: 'The shape of the question decides the quality of the answers.',
		htmlContent: `<p>Hi {{first_name}},</p>
<p>A good 9takes question is specific, tense, and not already solved.</p>
<p>Weak question: <em>Why are people so fake?</em></p>
<p>Better question: <em>My friend is warm in person but takes days to reply. What might be going on?</em></p>
<p>The second one gives people something real to work with. They can name different motives, fears, habits, and blind spots without pretending one answer explains everyone.</p>
<p>You can answer a current question for free, then read the comments and compare what other people noticed.</p>
<p>Asking your own question is different. If there is a situation you keep replaying and you want to post it, sign up first.</p>
<p><a class="button" href="{{questions_url}}">Answer a current question</a></p>
<p><a href="https://9takes.com/register">Sign up to ask one</a></p>
<p>This same shift — stop trying to win, start asking questions that can actually be answered — is how online arguments turn into real conversations. <a href="https://9takes.com/community/what-winning-online-arguments-looks-like">Read "What Winning Online Arguments Looks Like."</a></p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

A good 9takes question is specific, tense, and not already solved.

Weak question: Why are people so fake?

Better question: My friend is warm in person but takes days to reply. What might be going on?

The second one gives people something real to work with. They can name different motives, fears, habits, and blind spots without pretending one answer explains everyone.

You can answer a current question for free, then read the comments and compare what other people noticed.

Asking your own question is different. If there is a situation you keep replaying and you want to post it, sign up first.

Answer a current question: {{questions_url}}
Sign up to ask one: https://9takes.com/register

This same shift — stop trying to win, start asking questions that can actually be answered — is how online arguments turn into real conversations. Read "What Winning Online Arguments Looks Like": https://9takes.com/community/what-winning-online-arguments-looks-like

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
<p>The whole product is one loop:</p>
<ol>
  <li>Answer before reading.</li>
  <li>Compare what others saw.</li>
  <li>Name one assumption you were carrying.</li>
</ol>
<p>If that loop helps, run it once more today. If it does not, the unsubscribe link below works immediately. I mean that.</p>
<p><a class="button" href="{{questions_url}}">Run the loop once more</a></p>
<p>Why am I this direct? Because facts alone do not change minds — conversation design does. <a href="https://9takes.com/community/how-minds-change-on-9takes">Read "How Minds Actually Change"</a> for the thinking behind the whole platform.</p>
<p>DJocrates<br />9takes.com</p>`,
		plainText: `Hi {{first_name}},

9takes earns its place in your inbox if it shows up in one of these moments:

- Before you send a text you might regret.
- After a conflict when your version of events feels too clean.
- When you want to see what other people notice before you decide what something means.

The whole product is one loop:

1. Answer before reading.
2. Compare what others saw.
3. Name one assumption you were carrying.

If that loop helps, run it once more today. If it does not, the unsubscribe link below works immediately. I mean that.

Run the loop once more: {{questions_url}}

Why am I this direct? Because facts alone do not change minds — conversation design does. Read "How Minds Actually Change" for the thinking behind the whole platform: https://9takes.com/community/how-minds-change-on-9takes

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
