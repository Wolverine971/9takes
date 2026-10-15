// src/lib/components/blog/superpowers/superpowerData.ts
//
// Copy for the Enneagram strengths and weaknesses post
// (src/blog/enneagram/enneagram-strengths-and-weaknesses.md): the superpower
// each emotion builds, each type's superpower and kryptonite labels, and the
// shared scenes for the "same moment, nine superpowers" picker.
//
// Emotion names, colors and the type split come from the Enneagram test copy
// bank. DJ's triad map is deliberate: uses it 8 / 4 / 6, pushes it down
// 1 / 2 / 7, doesn't notice it 9 / 3 / 5. Do not "correct" it.
//
// `anchor` is the slug of the type's H3 in the post. Rename a heading there and
// the anchor here has to change with it.

import type { Emotion, TestType } from '$lib/enneagramTest/content';

export type Intelligence = { name: string; line: string };

export const INTELLIGENCE: Record<Emotion, Intelligence> = {
	anger: {
		name: 'Instinctual intelligence',
		line: 'Feels what’s right in the body and acts on it.'
	},
	shame: {
		name: 'Emotional intelligence',
		line: 'Picks up what people feel, often before they do.'
	},
	fear: {
		name: 'Intellectual intelligence',
		line: 'Thinks it through and spots problems and options early.'
	}
};

export type TypePower = { anchor: string; power: string; kryptonite: string };

export const TYPE_POWERS: Record<TestType, TypePower> = {
	8: {
		anchor: 'type-8-strengths-and-weaknesses-the-power-read-vs-the-bulldozer',
		power: 'The power read',
		kryptonite: 'The bulldozer'
	},
	1: {
		anchor: 'type-1-strengths-and-weaknesses-seeing-whats-off-vs-losing-the-plot',
		power: 'Seeing what’s off',
		kryptonite: 'Losing the plot'
	},
	9: {
		anchor: 'type-9-strengths-and-weaknesses-settling-the-room-vs-going-numb',
		power: 'Settling the room',
		kryptonite: 'Going numb'
	},
	4: {
		anchor: 'type-4-strengths-and-weaknesses-naming-the-real-feeling-vs-needing-the-drama',
		power: 'Naming the real feeling',
		kryptonite: 'Needing the drama'
	},
	2: {
		anchor: 'type-2-strengths-and-weaknesses-the-radar-vs-the-ledger',
		power: 'The radar',
		kryptonite: 'The ledger'
	},
	3: {
		anchor: 'type-3-strengths-and-weaknesses-reading-the-room-vs-switching-off',
		power: 'Reading the room',
		kryptonite: 'Switching off'
	},
	6: {
		anchor: 'type-6-strengths-and-weaknesses-the-what-if-engine-vs-the-loop',
		power: 'The what-if engine',
		kryptonite: 'The loop'
	},
	7: {
		anchor: 'type-7-strengths-and-weaknesses-plan-b-through-z-vs-emotional-procrastination',
		power: 'Plan B through Z',
		kryptonite: 'Emotional procrastination'
	},
	5: {
		anchor: 'type-5-strengths-and-weaknesses-the-x-ray-vs-the-microscope',
		power: 'The X-ray',
		kryptonite: 'The microscope'
	}
};

/** What one type does in a shared scene: what the superpower catches, the move at its best, and the same wiring overdone. */
export type SceneRead = { notices: string; move: string; kryptonite: string };

export type Scene = {
	id: string;
	label: string;
	setup: string;
	reads: Record<TestType, SceneRead>;
};

export const SCENES: Scene[] = [
	{
		id: 'launch',
		label: 'The launch breaks',
		setup:
			'Checkout goes down an hour before the client demo. Twelve people are in the Slack channel and nobody is typing.',
		reads: {
			8: {
				notices: 'Nobody is in charge. Twelve people are waiting for permission.',
				move: '“Roll it back. Everyone else, off the channel. I’ll call the client.”',
				kryptonite: 'Talks over the engineer who is trying to say the rollback will make it worse.'
			},
			1: {
				notices: 'The payment config skipped a step on the release checklist.',
				move: 'Finds the bad line in four minutes and fixes it cleanly.',
				kryptonite: 'At 2:58 is still drafting the message about who skipped the step.'
			},
			9: {
				notices: 'Two leads are one message away from blaming each other.',
				move: 'Gets them both on a call and slows it down: “What do we know for sure?”',
				kryptonite: 'Says “whatever you all think” while sitting on the fix the whole time.'
			},
			4: {
				notices: 'The client will forgive a bug. They won’t forgive spin.',
				move: 'Writes the client note that says what broke in plain words.',
				kryptonite: 'Decides the outage proves the whole project was doomed and says so in DMs.'
			},
			2: {
				notices: 'The junior dev who shipped the change has gone silent and is panicking.',
				move: 'DMs them: “You’re okay. Walk me through what you changed.”',
				kryptonite:
					'Spends the hour propping everyone up, gets none of their own work done, and resents that nobody noticed.'
			},
			3: {
				notices: 'How this will look to the client and the VP on the 3 o’clock.',
				move: 'Rebuilds the demo around the parts that work and owns the fix timeline.',
				kryptonite: 'Tells the VP “totally under control” when it isn’t.'
			},
			6: {
				notices: 'Saw this coming. Flagged the payment dependency two weeks ago.',
				move: 'Has the backup ready: the staging build they kept warm just in case.',
				kryptonite:
					'Spends the hour on “I said this would happen” and three new what-ifs instead of shipping the backup.'
			},
			7: {
				notices: 'The demo doesn’t have to be checkout.',
				move: 'Pitches showing the new dashboard instead and makes it sound like the plan all along.',
				kryptonite:
					'Is mentally on next quarter’s project. Nobody can find them for the post-mortem.'
			},
			5: {
				notices: 'Reads the logs while everyone else talks.',
				move: 'Quiet for 40 minutes, then one line: “It’s the cache. Clear it.” It works.',
				kryptonite:
					'Knew it was the cache at minute 10 and kept checking alone instead of saying so.'
			}
		}
	},
	{
		id: 'quiet',
		label: 'Your partner comes home quiet',
		setup:
			'They say they’re fine. They are clearly not fine. Dinner is on the table and the TV is off.',
		reads: {
			8: {
				notices: 'Something happened. The body clocks it before anyone talks.',
				move: '“Something’s up. Tell me straight. I’m not going anywhere.”',
				kryptonite: 'Pushes for the answer like a cross-examination, and they shut down harder.'
			},
			1: {
				notices: 'They didn’t text back at lunch, and they always text back.',
				move: 'Asks one clear question, then actually waits.',
				kryptonite: 'Turns the evening into notes on how they should communicate better.'
			},
			9: {
				notices: 'The tension in the room before a word is said.',
				move: 'Sits next to them with no agenda until they’re ready.',
				kryptonite:
					'Decides it’s probably nothing and puts a show on. Three weeks later it’s a fight.'
			},
			4: {
				notices: 'That “fine” was the saddest word they’ve said all week.',
				move: '“You don’t have to be okay right now.” Then stays in it with them.',
				kryptonite: 'Makes it about the two of them: “Is this about us?”'
			},
			2: {
				notices: 'They skipped lunch, and their shoulders are up by their ears.',
				move: 'Food appears, phones go away, and the question comes gently.',
				kryptonite: 'Fusses so hard that the partner ends up reassuring them about it.'
			},
			3: {
				notices: 'That “fine” sounds exactly like a client who’s about to walk.',
				move: 'Clears the evening, asks, and listens without pitching a solution.',
				kryptonite: 'At home the radar is off. Nods, says “that sucks,” checks email.'
			},
			6: {
				notices: 'Runs the list fast: work, family, or something I did?',
				move: 'Asks the question nobody else would think of, and it’s the right one.',
				kryptonite: 'Decides it’s about them and asks “are we okay?” four times before dessert.'
			},
			7: {
				notices: 'The mood dropped the second they walked in.',
				move: 'Lightens it just enough to get them talking, then stays for the heavy part.',
				kryptonite: 'Pitches a weekend trip to fix it. The thing that happened never gets said.'
			},
			5: {
				notices: 'Their pattern: quiet usually means they need about an hour.',
				move: 'Gives the hour, then asks one specific question instead of “how are you?”',
				kryptonite: 'Watches them like a nature documentary. “Huh.” Zero reaction.'
			}
		}
	},
	{
		id: 'trip',
		label: 'The group trip falls apart',
		setup:
			'A week out, the rental cancels, two people drop, and the group chat turns passive-aggressive.',
		reads: {
			8: {
				notices: 'Who is actually still in, and who is about to bail.',
				move: '“I’m booking the cabin tonight. In or out by 9.”',
				kryptonite: 'Books it without asking and calls anyone who hesitates flaky.'
			},
			1: {
				notices: 'Nobody ever confirmed who owed what for the deposit.',
				move: 'Builds the spreadsheet: dates, costs, who owes what.',
				kryptonite: 'Corrects everyone’s math in the group chat, in public.'
			},
			9: {
				notices: 'Two friends are mad at each other, and it’s leaking into the logistics.',
				move: 'Calls each of them separately and lowers the temperature.',
				kryptonite: 'Says “I’m good with whatever,” then quietly doesn’t come.'
			},
			4: {
				notices: 'This trip matters because it’s the last one before Sam moves away.',
				move: 'Says so in the chat, and suddenly everyone remembers why they cared.',
				kryptonite: 'Takes the dropouts personally, as proof nobody values the group like they do.'
			},
			2: {
				notices: 'Who is quietly embarrassed they can’t afford the new plan.',
				move: 'Finds a cheaper place without making it about anyone.',
				kryptonite: 'Covers someone’s share, then brings it up at every dinner for a year.'
			},
			3: {
				notices: 'Which version of the trip will get everyone excited again.',
				move: 'Pitches the new plan with photos and a deadline. It’s back on within the hour.',
				kryptonite: 'Makes the weekend about the content and spends it chasing the shot.'
			},
			6: {
				notices: 'Everyone says they’re fine with the new plan. Nobody is.',
				move: 'Says so with a joke that gets the whole chat laughing, and then honest.',
				kryptonite: 'Finds a problem with every replacement until the trip dies.'
			},
			7: {
				notices: 'A cancelled trip means room for a better one.',
				move: 'Drops three new options in the chat in ten minutes. One of them is great.',
				kryptonite:
					'Floats eleven options, commits to none, and books a different trip with other friends by Friday.'
			},
			5: {
				notices: 'Exactly what each option costs per person.',
				move: 'Posts one message with the numbers, and the argument ends.',
				kryptonite: 'Is quietly relieved it’s off and lets the thread die.'
			}
		}
	}
];
