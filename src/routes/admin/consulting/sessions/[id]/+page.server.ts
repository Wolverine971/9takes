// src/routes/admin/consulting/sessions/[id]/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

// Type-specific coaching data for session prep
const typeData: Record<
	number,
	{
		name: string;
		coreFear: string;
		coreDesire: string;
		keyPatterns: string[];
		stressArrow: { type: number; behaviors: string[] };
		securityArrow: { type: number; behaviors: string[] };
		suggestedQuestions: string[];
		watchFor: string[];
		coachingTips: string[];
	}
> = {
	1: {
		name: 'The Perfectionist',
		coreFear: 'Being corrupt, defective, or bad',
		coreDesire: 'To be good, balanced, and have integrity',
		keyPatterns: [
			'Harsh inner critic constantly judging self and others',
			'Difficulty relaxing or having fun without guilt',
			"Resentment when others don't meet their standards",
			'Procrastination from fear of imperfection'
		],
		stressArrow: {
			type: 4,
			behaviors: ['Becomes moody and withdrawn', 'Feels misunderstood', "Envies others' freedom"]
		},
		securityArrow: {
			type: 7,
			behaviors: [
				'Becomes spontaneous and joyful',
				'Allows pleasure without guilt',
				'More accepting of imperfection'
			]
		},
		suggestedQuestions: [
			'What would it mean to be "good enough" rather than perfect?',
			'When did you first learn that mistakes were unacceptable?',
			'What does your inner critic sound like? Whose voice is it?',
			"What would you do differently if you knew you couldn't fail?",
			'When do you feel most free from the pressure to be perfect?',
			'How do you distinguish between your standards and imposed standards?'
		],
		watchFor: [
			'Self-righteousness masking shame',
			'Deflecting criticism',
			'Black-and-white thinking'
		],
		coachingTips: [
			'Validate their desire for improvement',
			'Help them see gray areas',
			'Encourage self-compassion over self-criticism'
		]
	},
	2: {
		name: 'The Helper',
		coreFear: 'Being unwanted, unloved, or unneeded',
		coreDesire: 'To be loved, needed, and appreciated',
		keyPatterns: [
			'Difficulty identifying own needs',
			'Over-giving then feeling resentful',
			'Pride in being indispensable',
			'Indirect communication about needs'
		],
		stressArrow: {
			type: 8,
			behaviors: [
				'Becomes controlling and aggressive',
				'Demands recognition',
				'Expresses suppressed anger'
			]
		},
		securityArrow: {
			type: 4,
			behaviors: [
				'Connects with authentic self',
				'Allows vulnerability',
				'Pursues personal creativity'
			]
		},
		suggestedQuestions: [
			'What do YOU want, not what others need from you?',
			'When was the last time you asked for help? How did it feel?',
			'What would happen if you stopped helping for a day?',
			"How do you know when you're giving to get vs. giving freely?",
			'What needs of yours have been on hold?',
			'When did helping become your identity?'
		],
		watchFor: [
			'Martyr complex',
			"Deflecting to others' problems",
			'Hidden expectations for reciprocity'
		],
		coachingTips: [
			'Mirror their needs back to them',
			'Celebrate their self-care',
			'Help them ask directly'
		]
	},
	3: {
		name: 'The Achiever',
		coreFear: 'Being worthless or without inherent value',
		coreDesire: 'To be valuable, admired, and successful',
		keyPatterns: [
			'Identity merged with accomplishments',
			'Image management and adapting to audiences',
			'Difficulty slowing down or being unproductive',
			'Emotional shortcuts and efficiency over depth'
		],
		stressArrow: {
			type: 9,
			behaviors: ['Becomes disengaged and numb', 'Procrastinates', 'Loses motivation']
		},
		securityArrow: {
			type: 6,
			behaviors: [
				'Becomes more loyal and cooperative',
				'Values team over personal glory',
				'Shows vulnerability'
			]
		},
		suggestedQuestions: [
			"Who are you when you're not achieving anything?",
			'What would you do if no one was watching or keeping score?',
			'When did you learn your worth was tied to performance?',
			'What feelings do you run from by staying busy?',
			'Who do you become in different contexts? Which is real?',
			'What would "enough" success look like?'
		],
		watchFor: [
			'Spinning achievements as solutions',
			'Impatience with emotional work',
			'Image management in session'
		],
		coachingTips: ['Slow them down', 'Celebrate being over doing', 'Model authentic vulnerability']
	},
	4: {
		name: 'The Individualist',
		coreFear: 'Having no identity or personal significance',
		coreDesire: 'To be unique, authentic, and find their true self',
		keyPatterns: [
			"Longing for what's missing while dismissing what's present",
			'Emotional intensity and dramatic expression',
			'Feeling fundamentally different from others',
			'Push-pull in relationships'
		],
		stressArrow: {
			type: 2,
			behaviors: [
				'Becomes clingy and people-pleasing',
				"Over-involves in others' lives",
				'Seeks validation externally'
			]
		},
		securityArrow: {
			type: 1,
			behaviors: [
				'Becomes more objective and principled',
				'Takes practical action',
				'Less emotionally reactive'
			]
		},
		suggestedQuestions: [
			"What would be possible if you weren't waiting for something to change?",
			'When you feel most "you," what\'s happening?',
			'What ordinary things might you be overlooking?',
			'How does being different serve you? How does it limit you?',
			'What emotions feel like home vs. which do you avoid?',
			'What would it mean to be like everyone else in some ways?'
		],
		watchFor: ['Romanticizing suffering', 'Comparative envy', 'Rejecting simple solutions'],
		coachingTips: [
			'Validate depth of feeling without indulging drama',
			'Ground in present moment',
			'Celebrate the ordinary'
		]
	},
	5: {
		name: 'The Investigator',
		coreFear: 'Being useless, incapable, or overwhelmed',
		coreDesire: 'To be capable, competent, and understand the world',
		keyPatterns: [
			'Withdrawing to conserve energy',
			'Compartmentalizing emotions from intellect',
			'Minimizing needs to maintain independence',
			'Observing life rather than fully participating'
		],
		stressArrow: {
			type: 7,
			behaviors: [
				'Becomes scattered and escapist',
				'Seeks stimulation over depth',
				'Avoids through activity'
			]
		},
		securityArrow: {
			type: 8,
			behaviors: [
				'Becomes more confident and decisive',
				'Takes action in the world',
				'Engages physically'
			]
		},
		suggestedQuestions: [
			'What would it be like to know enough?',
			'When do you feel most alive in your body?',
			'What are you protecting by staying detached?',
			'What would happen if you let yourself need someone?',
			'How do you distinguish thinking about life from living it?',
			'What emotions feel most foreign to you?'
		],
		watchFor: [
			'Intellectualizing emotions',
			'Withholding to maintain control',
			'Analysis paralysis'
		],
		coachingTips: [
			'Respect their need for space',
			'Connect ideas to embodied experience',
			"Don't push emotional expression"
		]
	},
	6: {
		name: 'The Loyalist',
		coreFear: 'Being without support, security, or guidance',
		coreDesire: 'To have security, support, and certainty',
		keyPatterns: [
			'Scanning for threats and worst-case scenarios',
			"Testing others' loyalty and trustworthiness",
			'Oscillating between doubt and certainty',
			'Either seeking or rebelling against authority'
		],
		stressArrow: {
			type: 3,
			behaviors: [
				'Becomes competitive and image-focused',
				'Tries to prove worth through achievement',
				'Less collaborative'
			]
		},
		securityArrow: {
			type: 9,
			behaviors: [
				'Becomes more relaxed and trusting',
				'Less anxious about outcomes',
				'More accepting'
			]
		},
		suggestedQuestions: [
			'What would you do if you trusted yourself completely?',
			'When has your vigilance protected you? When has it limited you?',
			'Whose voice is the doubting voice in your head?',
			'What does safety actually feel like in your body?',
			'How do you decide who/what to trust?',
			'What would courage without certainty look like?'
		],
		watchFor: [
			"Devil's advocate as avoidance",
			'Projecting their fears onto situations',
			'Seeking reassurance vs. insight'
		],
		coachingTips: [
			'Be consistent and reliable',
			'Acknowledge their concerns before reframing',
			'Build their inner authority'
		]
	},
	7: {
		name: 'The Enthusiast',
		coreFear: 'Being deprived, trapped in pain, or limited',
		coreDesire: 'To be satisfied, content, and have their needs met',
		keyPatterns: [
			'Reframing negatives into positives',
			'Future-focus and planning over present experience',
			'Difficulty with commitment and FOMO',
			'Escapism through activity, ideas, or substances'
		],
		stressArrow: {
			type: 1,
			behaviors: [
				'Becomes critical and perfectionistic',
				'Gets rigid and judgmental',
				'Anger at limitations'
			]
		},
		securityArrow: {
			type: 5,
			behaviors: [
				'Becomes more focused and deep',
				'Comfortable with solitude',
				'Finishes what they start'
			]
		},
		suggestedQuestions: [
			'What are you running from when you run toward the next thing?',
			'What happens when you sit with discomfort instead of escaping it?',
			'What would "enough" feel like?',
			'What deeper satisfaction might be available in commitment?',
			'When did you learn pain was to be avoided at all costs?',
			'What are you afraid will happen if you slow down?'
		],
		watchFor: ['Reframing as avoidance', 'Scattered attention', 'Intellectualizing emotions'],
		coachingTips: [
			'Gently keep them focused',
			'Validate the pain under the positivity',
			'Make depth feel safe'
		]
	},
	8: {
		name: 'The Challenger',
		coreFear: 'Being controlled, harmed, or violated',
		coreDesire: 'To protect themselves, be in control, and determine their own path',
		keyPatterns: [
			'Intensity and directness that can overwhelm others',
			'All-or-nothing, excessive approach',
			'Denial of vulnerability and softer emotions',
			'Taking control to avoid being controlled'
		],
		stressArrow: {
			type: 5,
			behaviors: ['Withdraws and becomes secretive', 'Gets cynical', 'Isolates']
		},
		securityArrow: {
			type: 2,
			behaviors: ['Becomes more caring and open-hearted', 'Shows vulnerability', 'Nurtures others']
		},
		suggestedQuestions: [
			'What would it mean to be soft without being weak?',
			'When did you decide you had to be strong to survive?',
			"What happens when you can't control the situation?",
			'Who has earned the right to see your vulnerability?',
			'What would you do differently if no one could hurt you?',
			"What's under the anger?"
		],
		watchFor: [
			'Testing your strength',
			'Dominating the session',
			'Vulnerability disguised as aggression'
		],
		coachingTips: [
			"Be direct and don't back down",
			'Match their intensity without competing',
			'Earn respect before trust'
		]
	},
	9: {
		name: 'The Peacemaker',
		coreFear: 'Loss, fragmentation, separation, and conflict',
		coreDesire: 'To have inner peace, harmony, and stability',
		keyPatterns: [
			"Merging with others' agendas and losing self",
			'Passive-aggressive expression of anger',
			'Numbing through routines, food, or distractions',
			'Difficulty knowing and stating preferences'
		],
		stressArrow: {
			type: 6,
			behaviors: ['Becomes anxious and reactive', 'Worries more', 'Seeks external guidance']
		},
		securityArrow: {
			type: 3,
			behaviors: [
				'Becomes more energized and focused',
				'Takes initiative',
				'Pursues personal goals'
			]
		},
		suggestedQuestions: [
			'What do YOU want? (Not what would make everyone happy)',
			'When you say "it doesn\'t matter," does it really not matter?',
			'What happens when you express anger directly?',
			'What are you afraid will happen if you rock the boat?',
			"When did you decide your presence didn't matter?",
			"What would it take for your voice to matter as much as others'?"
		],
		watchFor: [
			'Agreeing to avoid conflict',
			'Going along with your suggestions',
			'Rambling to avoid substance'
		],
		coachingTips: [
			'Ask for their opinion repeatedly',
			"Don't let them defer",
			'Validate their importance'
		]
	}
};

export const load: PageServerLoad = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const sessionId = params.id;

	// Fetch session with client and related data
	const { data: session, error: sessionError } = await supabase
		.from('consulting_sessions')
		.select(
			`
			*,
			client:consulting_clients(
				*,
				intake:consulting_intake_forms(*),
				notes:consulting_client_notes(*)
			)
		`
		)
		.eq('id', sessionId)
		.single();

	if (sessionError || !session) {
		throw error(404, 'Session not found');
	}

	// Get previous sessions for this client
	const { data: previousSessions } = await supabase
		.from('consulting_sessions')
		.select(
			`
			*,
			notes:consulting_client_notes(*)
		`
		)
		.eq('client_id', session.client_id)
		.lt('scheduled_at', session.scheduled_at)
		.order('scheduled_at', { ascending: false })
		.limit(5);

	// Get session notes
	const { data: sessionNotes } = await supabase
		.from('consulting_client_notes')
		.select('*')
		.eq('session_id', sessionId)
		.order('created_at', { ascending: false });

	// Get type data for this client
	const clientType = session.client?.enneagram_type;
	const typeInfo = clientType ? typeData[clientType] : null;

	return {
		session,
		previousSessions: previousSessions || [],
		sessionNotes: sessionNotes || [],
		typeInfo,
		allTypeData: typeData
	};
};

export const actions: Actions = {
	// Update session status
	updateStatus: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const status = formData.get('status')?.toString();

		if (!status) {
			return fail(400, { error: 'Status required' });
		}

		const updates: Record<string, any> = {
			status,
			updated_at: new Date().toISOString()
		};

		// Set started_at when moving to in_progress
		if (status === 'in_progress') {
			updates.started_at = new Date().toISOString();
		}

		// Set completed_at when completing
		if (status === 'completed') {
			updates.completed_at = new Date().toISOString();
		}

		const { error: updateError } = await locals.supabase
			.from('consulting_sessions')
			.update(updates)
			.eq('id', params.id);

		if (updateError) {
			return fail(500, { error: 'Failed to update session' });
		}

		return { success: true };
	},

	// Add note during session
	addNote: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const content = formData.get('content')?.toString();
		const noteType = formData.get('noteType')?.toString() || 'observation';
		const title = formData.get('title')?.toString() || null;

		if (!content) {
			return fail(400, { error: 'Note content required' });
		}

		// Get session to find client_id
		const { data: session } = await locals.supabase
			.from('consulting_sessions')
			.select('client_id')
			.eq('id', params.id)
			.single();

		if (!session) {
			return fail(404, { error: 'Session not found' });
		}

		const { error: noteError } = await locals.supabase.from('consulting_client_notes').insert({
			client_id: session.client_id,
			session_id: params.id,
			title,
			content,
			note_type: noteType
		});

		if (noteError) {
			return fail(500, { error: 'Failed to add note' });
		}

		return { success: true };
	},

	// Complete session with summary
	completeSession: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const summary = formData.get('summary')?.toString();
		const nextSteps = formData.get('nextSteps')?.toString();
		const clientProgress = formData.get('clientProgress')?.toString();

		const supabase = locals.supabase;

		// Get session for client_id
		const { data: session } = await supabase
			.from('consulting_sessions')
			.select('client_id')
			.eq('id', params.id)
			.single();

		if (!session) {
			return fail(404, { error: 'Session not found' });
		}

		// Update session status
		const { error: updateError } = await supabase
			.from('consulting_sessions')
			.update({
				status: 'completed',
				completed_at: new Date().toISOString(),
				summary,
				next_steps: nextSteps,
				updated_at: new Date().toISOString()
			})
			.eq('id', params.id);

		if (updateError) {
			return fail(500, { error: 'Failed to complete session' });
		}

		// Add summary as a note if provided
		if (summary) {
			await supabase.from('consulting_client_notes').insert({
				client_id: session.client_id,
				session_id: params.id,
				title: 'Session Summary',
				content: summary + (nextSteps ? `\n\n**Next Steps:**\n${nextSteps}` : ''),
				note_type: 'insight'
			});
		}

		// Update client progress note if provided
		if (clientProgress) {
			await supabase.from('consulting_client_notes').insert({
				client_id: session.client_id,
				session_id: params.id,
				title: 'Progress Update',
				content: clientProgress,
				note_type: 'breakthrough'
			});
		}

		return { success: true };
	},

	// Update session details
	updateSession: async ({ request, params, locals }) => {
		const formData = await request.formData();

		const updates: Record<string, any> = {
			updated_at: new Date().toISOString()
		};

		const meetingLink = formData.get('meetingLink');
		const scheduledAt = formData.get('scheduledAt');
		const duration = formData.get('duration');

		if (meetingLink !== null) {
			updates.meeting_link = meetingLink.toString() || null;
		}
		if (scheduledAt) {
			updates.scheduled_at = new Date(scheduledAt.toString()).toISOString();
		}
		if (duration) {
			updates.duration_minutes = parseInt(duration.toString());
		}

		const { error: updateError } = await locals.supabase
			.from('consulting_sessions')
			.update(updates)
			.eq('id', params.id);

		if (updateError) {
			return fail(500, { error: 'Failed to update session' });
		}

		return { success: true };
	}
};
