// src/lib/data/enneagramStressLoops.ts
export type EnneagramTypeNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type StressLoopExample = {
	trigger: string;
	fear: string;
	defense: string;
	backfire: string;
};

export type EnneagramStressLoop = {
	type: EnneagramTypeNumber;
	name: string;
	alarm: string;
	coreFear: string;
	defense: string;
	preventionRule: string;
	backfire: string;
	interrupt: string;
	examples: StressLoopExample[];
};

/**
 * Editorial source of truth for the trigger -> fear -> defense -> backfire
 * model used by the Enneagram types in stress article. The same structured
 * copy can later feed social-card and carousel renderers without scraping HTML.
 */
export const ENNEAGRAM_STRESS_LOOPS: EnneagramStressLoop[] = [
	{
		type: 1,
		name: 'The Perfectionist',
		alarm: 'This may not be good enough.',
		coreFear: 'I may be wrong, bad, or responsible for a preventable failure.',
		defense: 'Correct, perfect, and take responsibility.',
		preventionRule: 'If I make it right, the feared failure cannot happen.',
		backfire: 'Control and criticism create resistance, delay, and more mistakes.',
		interrupt: 'Ask: Does this need to be perfect, or does it need to be finished?',
		examples: [
			{
				trigger: 'Someone submits sloppy work.',
				fear: 'If this is accepted, the whole thing may fail—and I may be responsible.',
				defense: 'Redo it, correct the person, or take control.',
				backfire: 'People disengage, leaving the One with even more to fix.'
			},
			{
				trigger: 'They receive criticism.',
				fear: 'This may prove that I am flawed or wrong.',
				defense: 'Explain, defend, or raise the standard again.',
				backfire: 'Useful feedback gets lost, inviting more criticism.'
			},
			{
				trigger: 'A deadline threatens quality.',
				fear: 'Submitting imperfect work would make me irresponsible.',
				defense: 'Overwork, redo, and refuse to delegate.',
				backfire: 'Exhaustion produces delay, anger, and new errors.'
			}
		]
	},
	{
		type: 2,
		name: 'The Helper',
		alarm: 'I may not be doing enough to matter.',
		coreFear: 'I may be unwanted, unappreciated, or unlovable.',
		defense: 'Give, help, and become indispensable.',
		preventionRule: 'If people need me, they will keep loving me.',
		backfire: 'Unspoken needs turn care into pressure, resentment, and scorekeeping.',
		interrupt: 'Ask for one thing directly before offering one more thing.',
		examples: [
			{
				trigger: 'Their help receives no acknowledgment.',
				fear: 'Maybe I do not matter to this person.',
				defense: 'Give more and hint at how much has been sacrificed.',
				backfire: 'The care feels controlling, so the person pulls away.'
			},
			{
				trigger: 'Someone refuses their help.',
				fear: 'If they do not need me, they may not want me.',
				defense: 'Insist, advise, or step in anyway.',
				backfire: 'The other person feels crowded and creates distance.'
			},
			{
				trigger: 'The Two needs care themselves.',
				fear: 'Asking directly may make me selfish or unlovable.',
				defense: 'Hide the need while continuing to give.',
				backfire: 'The hidden need becomes resentment and emotional debt.'
			}
		]
	},
	{
		type: 3,
		name: 'The Achiever',
		alarm: 'I may not be successful or impressive enough.',
		coreFear: 'I may be worthless or exposed as a failure.',
		defense: 'Achieve, perform, and manage the image.',
		preventionRule: 'If I keep winning, nobody can see me as worthless.',
		backfire: 'Performance replaces identity, while burnout damages the results.',
		interrupt: 'Name what you feel before naming what you accomplished.',
		examples: [
			{
				trigger: 'Someone else outperforms them.',
				fear: 'If I am not winning, maybe I have no value.',
				defense: 'Work harder, compete, and chase a visible win.',
				backfire: 'Burnout damages both performance and relationships.'
			},
			{
				trigger: 'They make a visible mistake.',
				fear: 'People may see me as a failure.',
				defense: 'Hide, spin, or repackage what happened.',
				backfire: 'Image management weakens trust and increases shame.'
			},
			{
				trigger: 'They have nothing productive to do.',
				fear: 'Without accomplishments, I may be nobody.',
				defense: 'Create more goals, work, or visible activity.',
				backfire: 'They lose contact with any value beyond achievement.'
			}
		]
	},
	{
		type: 4,
		name: 'The Individualist',
		alarm: 'Maybe there is nothing distinct or meaningful about me.',
		coreFear: 'I may have no stable identity, significance, or essential value.',
		defense: 'Differentiate, intensify, compare, and protect what feels authentic.',
		preventionRule: 'If I can prove I am distinct, I can prove that I am real.',
		backfire: 'Separation and comparison deepen the feeling of being deficient and unseen.',
		interrupt: 'Let one ordinary, present-tense experience count as real.',
		examples: [
			{
				trigger: 'Their creative work is ignored.',
				fear: 'Maybe I have no real significance.',
				defense: 'Become more different, intense, or inaccessible.',
				backfire: 'The work becomes harder for other people to reach.'
			},
			{
				trigger: 'Someone has the life they want.',
				fear: 'Maybe they possess something essential that I lack.',
				defense: 'Compare, idealize, and dwell on what is missing.',
				backfire: 'Comparison makes their own life feel more deficient.'
			},
			{
				trigger: 'Someone does not understand them immediately.',
				fear: 'Maybe I can never be truly known.',
				defense: 'Withdraw or test whether the person will pursue them.',
				backfire: 'The test creates the disconnection it was meant to disprove.'
			}
		]
	},
	{
		type: 5,
		name: 'The Investigator',
		alarm: 'I may not know enough to handle this.',
		coreFear: 'I may be incapable, depleted, invaded, or overwhelmed.',
		defense: 'Withdraw, understand, prepare, and conserve resources.',
		preventionRule: 'If I know enough and need less, the world cannot overwhelm me.',
		backfire: 'Distance and endless preparation make participation feel even harder.',
		interrupt: 'Enter with what you know now; do not wait to feel completely ready.',
		examples: [
			{
				trigger: 'They are asked an unexpected question.',
				fear: 'I may be exposed as incapable.',
				defense: 'Delay answering and gather more information.',
				backfire: 'They miss the chance to participate, reinforcing inadequacy.'
			},
			{
				trigger: 'Someone makes a strong emotional demand.',
				fear: 'This may consume more energy than I have.',
				defense: 'Withdraw and limit access.',
				backfire: 'The relationship strains and the demands may intensify.'
			},
			{
				trigger: 'A decision contains important unknowns.',
				fear: 'I may act without understanding enough.',
				defense: 'Keep researching and considering possibilities.',
				backfire: 'No decision is made, allowing the problem to grow.'
			}
		]
	},
	{
		type: 6,
		name: 'The Loyalist',
		alarm: 'We may still be at risk.',
		coreFear: 'I may be unsafe, unsupported, betrayed, or unprepared.',
		defense: 'Scan, question, plan, test, and secure support.',
		preventionRule: 'If I anticipate every danger, nothing can catch me unprepared.',
		backfire: 'Checking multiplies uncertainty and testing can damage real support.',
		interrupt: 'Choose the next responsible action without solving every possible future.',
		examples: [
			{
				trigger: 'Instructions are unclear.',
				fear: 'There may be a danger or requirement I missed.',
				defense: 'Ask, check, verify, and seek reassurance.',
				backfire: 'Conflicting answers create even more uncertainty.'
			},
			{
				trigger: 'A trusted person behaves inconsistently.',
				fear: 'My support may disappear when I need it.',
				defense: 'Question, test, and watch the person closely.',
				backfire: 'The testing damages the trust they were trying to secure.'
			},
			{
				trigger: 'A decision carries real risk.',
				fear: 'Something may go wrong that I am not prepared for.',
				defense: 'Build plans and backup plans for every scenario.',
				backfire: 'Planning becomes paralysis, leaving them less ready to act.'
			}
		]
	},
	{
		type: 7,
		name: 'The Enthusiast',
		alarm: 'I may be running out of options.',
		coreFear: 'I may become trapped, deprived, limited, or stuck in pain.',
		defense: 'Escape, reframe, distract, and create more options.',
		preventionRule: 'If another door stays open, pain can never trap me.',
		backfire: 'Avoided feelings and commitments return as larger limits.',
		interrupt: 'Stay with one discomfort long enough to learn what it needs.',
		examples: [
			{
				trigger: 'A painful feeling appears.',
				fear: 'If I stay here, the pain may consume me.',
				defense: 'Distract, joke, plan, or find something exciting.',
				backfire: 'The unfelt emotion returns with more force.'
			},
			{
				trigger: 'A commitment closes other possibilities.',
				fear: 'I may become trapped in the wrong life.',
				defense: 'Keep alternatives open and avoid committing fully.',
				backfire: 'They miss the depth and freedom that commitment can create.'
			},
			{
				trigger: 'An impulsive choice produces consequences.',
				fear: 'Facing this may trap me in pain and limitation.',
				defense: 'Reframe it positively or move to something new.',
				backfire: 'The unaddressed consequences become larger limitations.'
			}
		]
	},
	{
		type: 8,
		name: 'The Challenger',
		alarm: 'Someone may gain power over me.',
		coreFear: 'I may be controlled, violated, betrayed, or placed at someone else’s mercy.',
		defense: 'Become strong, confront, resist, and take control.',
		preventionRule: 'If I hold the power, nobody can use power against me.',
		backfire: 'Preemptive force creates power struggles, isolation, and resistance.',
		interrupt: 'Separate a real threat from the discomfort of not being in charge.',
		examples: [
			{
				trigger: 'Someone tells them what they must do.',
				fear: 'This person may be trying to control me.',
				defense: 'Resist, confront, and reclaim control.',
				backfire: 'The confrontation creates a power struggle that limits freedom.'
			},
			{
				trigger: 'They need help.',
				fear: 'Depending on someone may make me vulnerable to them.',
				defense: 'Refuse help and handle everything alone.',
				backfire: 'Overload and isolation leave them more vulnerable.'
			},
			{
				trigger: 'They notice a possible betrayal.',
				fear: 'If I do not act first, I may be hurt.',
				defense: 'Accuse, attack, or cut the person off.',
				backfire: 'They may destroy a loyal relationship before betrayal occurs.'
			}
		]
	},
	{
		type: 9,
		name: 'The Peacemaker',
		alarm: 'Everything may fall apart if I assert myself.',
		coreFear: 'Conflict may break connection and leave me separated or shut out.',
		defense: 'Accommodate, minimize, delay, and go quiet.',
		preventionRule: 'If I do not create friction, the connection will remain intact.',
		backfire: 'Self-erasure creates resentment, hidden conflict, and weaker connection.',
		interrupt: 'State one real preference before deciding what will keep everyone calm.',
		examples: [
			{
				trigger: 'Someone disagrees with them.',
				fear: 'If I push back, this connection may break.',
				defense: 'Agree, soften, or hide the real opinion.',
				backfire: 'Resentment creates the conflict they were trying to avoid.'
			},
			{
				trigger: 'They must make a choice that affects others.',
				fear: 'Someone may become upset with me.',
				defense: 'Delay, defer, or let someone else decide.',
				backfire: 'Their wishes disappear and others stop consulting them.'
			},
			{
				trigger: 'They feel overlooked.',
				fear: 'Speaking up may create more trouble or rejection.',
				defense: 'Numb the feeling and become even quieter.',
				backfire: 'Others remain unaware, confirming that they do not matter.'
			}
		]
	}
];

export const ENNEAGRAM_STRESS_LOOPS_BY_TYPE = Object.fromEntries(
	ENNEAGRAM_STRESS_LOOPS.map((loop) => [loop.type, loop])
) as Record<EnneagramTypeNumber, EnneagramStressLoop>;
