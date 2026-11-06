// src/lib/data/enneagramCornerSectionCopy.ts
// Words for each Enneagram Corner section page. Lanes come from
// enneagramCornerTaxonomy.js; this file only holds copy and SEO.
// HTML strings are trusted, static, and rendered with {@html}.
import type { FAQItem } from '$lib/types/faq';

export type CornerSectionCopy = {
	/** H1 text (kept stable for SEO). */
	title: string;
	/** Exact tail of `title` set in the quiet italic voice. */
	titleQuiet: string;
	seoTitle: string;
	description: string;
	/** Hero lede; falls back to `description`. */
	lede?: string;
	pic: string | null;
	/** Opening argument under the hero; pages with their own opener skip it. */
	intro?: { hook: string; body: string[]; insight?: string };
	conclusion: { title: string; body: string[] };
	faqTitle: string;
	faqs: FAQItem[];
};

export const CORNER_SECTION_COPY: Record<string, CornerSectionCopy> = {
	overview: {
		title: 'The Enneagram: Your Operating System Decoded',
		titleQuiet: 'Your Operating System Decoded',
		seoTitle: 'Master the Enneagram: The Complete Psychology Framework | 9takes',
		description:
			'Why millions use the Enneagram to decode human behavior: nine recurring patterns that shape what people notice first, and how to work with yours.',
		pic: 'nine-greek-statues-having-a-conversation-with-their-wings',
		intro: {
			hook: '<strong>Your reactions have a pattern.</strong> The same fights, the same stalls, the same snap judgments: they repeat because your attention keeps going to the same place first.',
			body: [
				"The Enneagram maps those patterns. It's not another personality quiz. It's a map of nine recurring strategies people run under pressure, so you can catch yours in the act instead of replaying it."
			],
			insight: "Once you can read it, you can't unread it — in others or in yourself."
		},
		conclusion: {
			title: 'Your Next Move',
			body: [
				"Understanding the Enneagram isn't about putting people in boxes. It's about seeing the <strong>emotional logic</strong> behind their behavior. Once you see the patterns, you can't unsee them.",
				'<strong>Start with these articles</strong> to build your foundation. Then pick one person in your life, guess their type, watch for the patterns, and notice how your understanding of them shifts.'
			]
		},
		faqTitle: 'Common Questions',
		faqs: [
			{
				question: 'What makes the Enneagram different from other personality tests?',
				answer:
					'The Enneagram focuses on the pattern underneath the behavior, not just the behavior. It maps the core fears and desires that shape where your attention goes first: what you protect, prove, avoid, or prepare for. That depth makes it more useful for personal growth than surface-level behavioral assessments.'
			},
			{
				question: 'How long does it take to learn the Enneagram?',
				answer:
					'You can grasp the basics in a few hours. Truly understanding your own type takes weeks to months of self-observation. Mastering all nine types and their interactions is a lifelong study that deepens with every relationship and experience.'
			},
			{
				question: 'Is the Enneagram accurate?',
				answer:
					'When properly typed, the Enneagram reveals patterns you may not consciously recognize. Accuracy depends on honest self-reflection. Many people mistype initially because they see themselves as they want to be, not as they are under stress.'
			}
		]
	},
	'nine-types': {
		title: '9 Types of Human Nature (And How to Read Each One)',
		titleQuiet: '(And How to Read Each One)',
		seoTitle: 'The 9 Enneagram Types Explained: Core Fears, Desires & Patterns | 9takes',
		description:
			'Each type operates on a different emotional frequency. Learn the core fears, desires, and blind spots driving behavior, yours and everyone around you.',
		pic: 'greek-statues-working-in-teams',
		intro: {
			hook: '<strong>Nine types. Nine completely different ways of seeing the world.</strong> What looks like "being difficult" to one type feels like "being thorough" to another.',
			body: [
				"Each type operates from a core fear and a core desire they're often unaware of. A Type 1 isn't \"controlling,\" they're driven by a deep need to be good and avoid criticism. A Type 7 isn't \"flaky,\" they're running from emotional pain they learned to escape as children."
			],
			insight:
				"Know someone's type, and you know what they're optimizing for. That changes every interaction."
		},
		conclusion: {
			title: 'Put This Into Practice',
			body: [
				'Reading about types is step one. <strong>Spotting them in the wild is the real skill.</strong> Next time you\'re frustrated with someone, pause and ask: "What type pattern am I seeing?"',
				"The goal isn't to label people. It's to understand the emotional logic driving their behavior. When you see the fear underneath the action, frustration often transforms into empathy."
			]
		},
		faqTitle: 'Common Questions',
		faqs: [
			{
				question: 'What are the 9 Enneagram types?',
				answer:
					'The nine types are: Type 1 (Perfectionist), Type 2 (Helper), Type 3 (Achiever), Type 4 (Individualist), Type 5 (Investigator), Type 6 (Loyalist), Type 7 (Enthusiast), Type 8 (Challenger), and Type 9 (Peacemaker). Each has distinct fears, desires, and behavior patterns.'
			},
			{
				question: 'Which Enneagram type is the best?',
				answer:
					'No type is better than another. Each has unique strengths and challenges. Healthy Type 8s and healthy Type 2s are equally valuable. Growth means becoming a healthier version of your type, not trying to become a different type.'
			},
			{
				question: 'Can I be more than one Enneagram type?',
				answer:
					'You have one core type, but you access traits from other types through wings (adjacent types) and lines of integration/disintegration. You might relate to multiple types because of these connections, but your core motivation points to one primary type.'
			}
		]
	},
	development: {
		title: 'Know Your Pattern. Break Your Pattern.',
		titleQuiet: 'Break Your Pattern.',
		seoTitle: 'Enneagram Personal Development: Growth Strategies by Type | 9takes',
		description:
			'Your type runs the show until you see it. Discover type-specific growth paths, blind spots to watch, and the exact practices that create lasting change.',
		pic: 'Self-awareness-and-Self-understanding',
		intro: {
			hook: "<strong>Your type isn't a prison. It's a starting point.</strong> The Enneagram shows you where you're stuck and exactly how to get unstuck.",
			body: [
				'Every type has a predictable growth edge. Type 3s need to stop performing and feel their real emotions. Type 9s need to assert what they actually want. Type 6s need to trust their own judgment instead of seeking external validation.'
			],
			insight:
				'The patterns that protected you as a child now hold you back. Growth means outgrowing your survival strategies.'
		},
		conclusion: {
			title: 'The Real Work Starts Now',
			body: [
				"Growth isn't about becoming a different type. It's about <strong>expanding beyond your type's automatic responses.</strong> You're not broken. You're running an outdated operating system.",
				"Pick one pattern you recognize in yourself. Notice when it shows up. That awareness alone creates space for a different choice. That's where transformation begins."
			]
		},
		faqTitle: 'Common Questions',
		faqs: [
			{
				question: 'How do I grow using the Enneagram?',
				answer:
					"Start by recognizing your type's automatic patterns. Notice when you react from fear rather than choice. Practice moving toward your integration point when healthy. Work on your blind spots. Growth happens through awareness, not through trying to be someone else."
			},
			{
				question: 'What are integration and disintegration lines?',
				answer:
					'Each type connects to two others. Under stress, you take on unhealthy traits of your disintegration type. In growth, you access healthy traits of your integration type. For example, Type 9 disintegrates to 6 (anxious) and integrates to 3 (effective).'
			},
			{
				question: 'How long does Enneagram growth take?',
				answer:
					"Meaningful change requires consistent practice over months and years. You'll notice small shifts within weeks of awareness. Deeper pattern changes take longer. The Enneagram provides direction, but growth speed depends on your commitment to self-observation."
			}
		]
	},
	relationships: {
		title: 'Why They Do That (A Relationship Decoder)',
		titleQuiet: '(A Relationship Decoder)',
		seoTitle: 'Enneagram Relationship Guide: Communication, Conflict & Connection | 9takes',
		description:
			'Stop taking it personally. Their reactions reflect their type, not you. Learn to read relationship dynamics and communicate in ways that actually land.',
		pic: 'greek-statues-having-an-intimate-conversation',
		intro: {
			hook: "<strong>Most relationship fights aren't about what you think they're about.</strong> They're two different types with two different emotional needs talking past each other.",
			body: [
				'Your partner isn\'t being "too emotional" or "too distant." They\'re responding from their type\'s core needs. A Type 2 needs to feel needed. A Type 5 needs space to process. A Type 8 needs respect and directness. Miss these needs, and conflict escalates. Meet them, and connection deepens.'
			],
			insight:
				'The same words mean different things to different types. Learn their language, and watch the dynamic shift.'
		},
		conclusion: {
			title: 'Try This Tonight',
			body: [
				'Think of your last argument with someone close to you. <strong>What did they actually need</strong> in that moment? Validation? Space? Control? Reassurance?',
				'Now consider: did you give them what they needed, or what <em>your</em> type would have wanted? That gap is where most relationship friction lives. Close it, and watch connection flow.'
			]
		},
		faqTitle: 'Common Questions',
		faqs: [
			{
				question: 'Which Enneagram types are most compatible?',
				answer:
					'Any two types can have a successful relationship. Compatibility depends more on health levels than type pairings. That said, certain combinations have predictable dynamics. Understanding both types helps navigate natural friction points.'
			},
			{
				question: 'Why do certain types clash?',
				answer:
					"Types clash when their core fears trigger each other. Type 8's directness threatens Type 9's peace. Type 1's criticism wounds Type 4's sensitivity. Recognizing these patterns transforms conflict from personal attacks into understandable type dynamics."
			},
			{
				question: 'How do I communicate better with different types?',
				answer:
					'Speak to their core need. Give Type 3s recognition. Give Type 5s space. Give Type 2s appreciation. Give Type 6s reassurance. When you address what each type actually needs, communication becomes dramatically more effective.'
			}
		]
	},
	'mental-health': {
		title: 'Mental health, decoded by type.',
		titleQuiet: 'decoded by type.',
		seoTitle: 'Enneagram and Mental Health Hub | 9takes',
		description:
			'Each Enneagram type breaks differently: 7s mask depression with motion, 8s with anger, 9s with shutdown. Guides to anxiety, trauma, and burnout by type.',
		lede: "Anxiety, depression, burnout, and addiction don't show up the same way in everyone. Type 7s outrun depression. Type 8s convert it to anger. Type 9s vanish into it. Knowing the type tells you what you're actually looking at, and what's likely to help.",
		pic: null,
		conclusion: {
			title: 'Match the work to the wiring.',
			body: [
				"Generic mental health advice doesn't account for how your type breaks. These guides do. Pick the angle that fits your pattern."
			]
		},
		faqTitle: 'Mental Health & Enneagram FAQs',
		faqs: [
			{
				question: 'How does the Enneagram relate to mental health?',
				answer:
					'Each Enneagram type has distinct mental health vulnerabilities and coping patterns. Type 1s tend toward anxiety and perfectionism. Type 4s are more prone to depression. Type 6s often struggle with generalized anxiety. Understanding your type helps identify your specific risk factors and tailor treatment approaches.'
			},
			{
				question: 'Can the Enneagram be used in therapy?',
				answer:
					'Many therapists integrate the Enneagram as a tool for self-understanding. It helps clients identify defense mechanisms, relationship patterns, and growth edges. However, it complements rather than replaces clinical diagnosis. Find a therapist trained in both clinical methods and Enneagram applications.'
			},
			{
				question: 'Why do different types experience anxiety differently?',
				answer:
					"Anxiety manifests through each type's core fear. Type 6s fear uncertainty and seek reassurance. Type 1s fear making mistakes. Type 3s fear failure and judgment. Type 5s fear being overwhelmed. Understanding your type's anxiety pattern helps you address the root cause, not just symptoms."
			},
			{
				question: 'How does trauma affect Enneagram types?',
				answer:
					"Trauma can intensify type patterns or push people toward their stress point. Type 9s may dissociate more. Type 8s may become more controlling. Type 2s may over-give to feel safe. Trauma-informed Enneagram work helps identify how your type's coping mechanisms developed and when they no longer serve you."
			},
			{
				question: 'Can knowing my type prevent mental health issues?',
				answer:
					"Self-awareness is protective. Knowing your type's vulnerabilities lets you recognize early warning signs and intervene sooner. Type 7s can watch for avoidance patterns that mask depression. Type 1s can notice when self-criticism becomes destructive. Prevention comes from understanding, not from the label itself."
			},
			{
				question: 'What mental health strengths does each type have?',
				answer:
					"Every type brings unique healing assets. Type 2s build strong support networks. Type 3s set and achieve recovery goals. Type 5s research their conditions thoroughly. Type 9s maintain steady, sustainable progress. Leveraging your type's strengths accelerates healing."
			}
		]
	},
	workplace: {
		title: 'Read the Room, Run the Room',
		titleQuiet: 'Run the Room',
		seoTitle: 'Enneagram at Work: Leadership, Teams & Communication Styles | 9takes',
		description:
			'Every office runs on type dynamics. Learn to spot types in meetings, decode what motivates your team, and navigate workplace politics with precision.',
		pic: 'greek-statues-disagreeing',
		intro: {
			hook: "<strong>Every office runs on type dynamics.</strong> The \"difficult\" coworker, the micromanaging boss, the team that can't align. These aren't random. They're predictable patterns.",
			body: [
				"Your Type 1 manager isn't being harsh. They have a genuine fear of making mistakes and need to feel things are done right. Your Type 7 colleague isn't scattered. They're energized by possibilities and drained by routine. Your Type 6 teammate isn't paranoid. They're thinking through all the ways things could go wrong so you don't have to."
			],
			insight:
				'Read the types in your workplace, and you unlock influence. Know what drives each person, and you know how to lead, collaborate, and navigate office politics.'
		},
		conclusion: {
			title: 'Apply This Tomorrow',
			body: [
				'Pick one colleague who frustrates you. <strong>Guess their type.</strong> Reframe their behavior through that lens. What fear might be driving them? What do they need to feel safe and effective?',
				'Adjust your approach based on that insight. A 5-minute conversation framed for their type accomplishes more than an hour of talking past each other.'
			]
		},
		faqTitle: 'Common Questions',
		faqs: [
			{
				question: 'How can I use the Enneagram at work?',
				answer:
					'Identify the types on your team and adapt your communication style. Recognize that your difficult colleague may have a different type with different needs. Use type knowledge for better delegation, conflict resolution, and meeting facilitation.'
			},
			{
				question: 'Which types make the best leaders?',
				answer:
					"All types can lead effectively in different contexts. Type 8s excel at decisive action. Type 3s drive results. Type 1s ensure quality. Type 9s build consensus. The best leaders understand their type's strengths and develop capacities from other types."
			},
			{
				question: 'How do I manage employees of different types?',
				answer:
					"Give Type 5s autonomy and time. Give Type 7s variety and freedom. Give Type 6s clear expectations and support. Each type needs different management approaches. One-size-fits-all management guarantees you'll fail with most of your team."
			}
		]
	},
	situational: {
		title: 'The Types in the Wild: Real Situations, Real Behaviors',
		titleQuiet: 'Real Situations, Real Behaviors',
		seoTitle: 'Real-World Type Behaviors: How Each Type Actually Shows Up | 9takes',
		description:
			'See the types in action. From first dates to job interviews, from parties to crises, understand exactly how each type behaves when it counts.',
		pic: 'greek-statue-flex',
		intro: {
			hook: '<strong>Theory is useless without application.</strong> You can memorize all nine types, but can you spot them at a party? In a meeting? During a crisis? On a first date?',
			body: [
				"These guides show you exactly how each type behaves in specific, real-world situations. No abstract theory. Just concrete patterns you'll recognize immediately."
			],
			insight: 'Map patterns to real scenarios. Read people accurately when it matters.'
		},
		conclusion: {
			title: "Read the Room You're Already In",
			body: [
				"Knowing the types lets you stop guessing why people do what they do. <strong>It isn't mind reading. It's pattern recognition.</strong>",
				"These situational guides train the eye for context: dating, managing, selling, negotiating, or just trying to understand a coworker who confuses you. Field guides for the rooms you're already standing in."
			]
		},
		faqTitle: 'Common Questions',
		faqs: [
			{
				question: 'How do types behave differently in conflict?',
				answer:
					'Type 8s confront directly. Type 9s avoid and go passive. Type 1s moralize. Type 4s dramatize. Type 5s withdraw to analyze. Knowing these patterns helps you predict responses and choose more effective approaches during disagreements.'
			},
			{
				question: 'How do types handle stress differently?',
				answer:
					'Each type has predictable stress behaviors. Type 3s become image-focused. Type 6s become paranoid. Type 7s become scattered. Type 2s become manipulative. Recognizing stress patterns in yourself and others enables early intervention.'
			},
			{
				question: 'How do types show love differently?',
				answer:
					'Type 2s help and give. Type 5s share knowledge and time. Type 8s protect and provide. Type 4s create meaningful experiences. Understanding how each type expresses love prevents misreading their intentions and feeling unloved when you are loved.'
			}
		]
	},
	resources: {
		title: 'Curated Enneagram Resources (We Vetted Everything)',
		titleQuiet: '(We Vetted Everything)',
		seoTitle: 'Essential Enneagram Resources: Tools, Tests & Training | 9takes',
		description:
			'Skip the noise. Access vetted Enneagram tests, books, tools, and training programs. Curated for serious students of personality psychology.',
		pic: 'greek-dude-reading-book',
		intro: {
			hook: '<strong>Most Enneagram content wastes your time.</strong> Surface-level quizzes that mistype you. Instagram infographics that reduce complex patterns to memes. Books that contradict each other on fundamentals.',
			body: [
				"We've tested dozens of resources and kept only what works: assessments with validated accuracy, books grounded in psychological research, and training programs that produce real results. No mysticism. No astrology-level generalizations."
			]
		},
		conclusion: {
			title: 'Skip the Beginner Mistakes',
			body: [
				'Most people waste months on bad tests, contradictory books, and surface-level content. <strong>Start with resources that actually deliver results.</strong>',
				"These resources include professional-grade assessments, evidence-based books, and training programs with track records. Use what works. Skip what doesn't."
			]
		},
		faqTitle: 'Common Questions',
		faqs: [
			{
				question: 'What is the most accurate Enneagram test?',
				answer:
					'The Riso-Hudson Enneagram Type Indicator (RHETI) and the iEQ9 are considered most reliable. However, no test replaces self-study. Use tests as starting points, then validate through reading descriptions and observing your patterns under stress.'
			},
			{
				question: 'What books should I read to learn the Enneagram?',
				answer:
					"Start with 'The Wisdom of the Enneagram' by Riso and Hudson. For relationships, read 'The Enneagram in Love and Work.' For spiritual growth, try 'The Sacred Enneagram.' Avoid oversimplified Instagram content as your primary source."
			},
			{
				question: 'Are Enneagram certifications worth it?',
				answer:
					'Certifications provide structured learning and professional credibility. The Enneagram Institute and Integrative Enneagram Solutions offer respected programs. If you plan to use the Enneagram professionally, certification demonstrates serious study.'
			}
		]
	}
};
