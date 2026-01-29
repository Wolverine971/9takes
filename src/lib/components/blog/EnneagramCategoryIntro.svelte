<!-- src/lib/components/blog/EnneagramCategoryIntro.svelte -->
<script lang="ts">
	import BlogPageHead from './BlogPageHead.svelte';
	import FAQSection from './FAQSection.svelte';
	import type { FAQItem } from '$lib/types/faq';
	import { buildFAQSchema } from '$lib/utils/schema';

	export let subsection: string;
	export let blogs: any;

	const slug = `enneagram-corner/subtopic/${subsection}`;

	// Section metadata for consistent SEO and display
	const sectionMeta: Record<
		string,
		{
			title: string;
			seoTitle: string;
			description: string;
			pic: string;
			lastmod: string;
		}
	> = {
		overview: {
			title: 'The Enneagram: Your Operating System Decoded',
			seoTitle: 'Master the Enneagram: The Complete Psychology Framework | 9takes',
			description:
				'Discover why millions use the Enneagram to decode human behavior. From childhood wounds to adult patterns, master the system that transforms self-understanding.',
			pic: '',
			lastmod: '2025-08-15'
		},
		'nine-types': {
			title: '9 Types of Human Nature (And How to Read Each One)',
			seoTitle: 'The 9 Enneagram Types Explained: Core Fears, Desires & Patterns | 9takes',
			description:
				'Each type operates on a different emotional frequency. Learn the core fears, desires, and blind spots driving behavior, yours and everyone around you.',
			pic: 's-greek-statues-working-in-teams',
			lastmod: '2025-08-15'
		},
		development: {
			title: 'Know Your Pattern. Break Your Pattern.',
			seoTitle: 'Enneagram Personal Development: Growth Strategies by Type | 9takes',
			description:
				'Your type runs the show until you see it. Discover type-specific growth paths, blind spots to watch, and the exact practices that create lasting change.',
			pic: 'Self-awareness-and-Self-understanding',
			lastmod: '2025-08-15'
		},
		relationships: {
			title: 'Why They Do That (A Relationship Decoder)',
			seoTitle: 'Enneagram Relationship Guide: Communication, Conflict & Connection | 9takes',
			description:
				'Stop taking it personally. Their reactions reflect their type, not you. Learn to read relationship dynamics and communicate in ways that actually land.',
			pic: 'greek-statues-having-an-intimate-conversation',
			lastmod: '2025-08-15'
		},
		workplace: {
			title: 'Read the Room, Run the Room',
			seoTitle: 'Enneagram at Work: Leadership, Teams & Communication Styles | 9takes',
			description:
				'Every office runs on type dynamics. Learn to spot types in meetings, decode what motivates your team, and navigate workplace politics with precision.',
			pic: 'greek-statues-disagreeing',
			lastmod: '2025-08-15'
		},
		resources: {
			title: 'Curated Enneagram Resources (We Vetted Everything)',
			seoTitle: 'Essential Enneagram Resources: Tools, Tests & Training | 9takes',
			description:
				'Skip the noise. Access vetted Enneagram tests, books, tools, and training programs. Curated for serious students of personality psychology.',
			pic: 'greek-dude-reading-book',
			lastmod: '2025-08-15'
		},
		situational: {
			title: 'The Types in the Wild: Real Situations, Real Behaviors',
			seoTitle: 'Real-World Type Behaviors: How Each Type Actually Shows Up | 9takes',
			description:
				'See the types in action. From first dates to job interviews, from parties to crises, understand exactly how each type behaves when it counts.',
			pic: 'greek-statue-flex',
			lastmod: '2025-08-15'
		}
	};

	// Related subsections for each category
	const relatedLinks: Record<string, { href: string; label: string; hook: string }[]> = {
		overview: [
			{
				href: '/enneagram-corner/subtopic/nine-types',
				label: 'Study All 9 Types',
				hook: 'Map what drives each one'
			},
			{
				href: '/enneagram-corner/subtopic/development',
				label: 'Apply to Your Growth',
				hook: 'Break your patterns'
			},
			{
				href: '/enneagram-corner/subtopic/relationships',
				label: 'Decode Relationships',
				hook: 'Stop taking it personally'
			},
			{
				href: '/enneagram-corner/subtopic/workplace',
				label: 'Navigate Work',
				hook: 'Read office dynamics'
			}
		],
		'nine-types': [
			{
				href: '/enneagram-corner/subtopic/overview',
				label: 'Core Theory',
				hook: 'Understand the system'
			},
			{
				href: '/enneagram-corner/subtopic/development',
				label: 'Growth Paths',
				hook: 'Apply it to yourself'
			},
			{
				href: '/enneagram-corner/subtopic/relationships',
				label: 'Relationship Dynamics',
				hook: 'See type interactions'
			},
			{
				href: '/enneagram-corner/subtopic/workplace',
				label: 'Types at Work',
				hook: 'Spot them in meetings'
			}
		],
		development: [
			{
				href: '/enneagram-corner/subtopic/overview',
				label: 'Foundation First',
				hook: 'Master the basics'
			},
			{
				href: '/enneagram-corner/subtopic/nine-types',
				label: 'Know Each Type',
				hook: 'Decode all patterns'
			},
			{
				href: '/enneagram-corner/subtopic/relationships',
				label: 'Relationship Growth',
				hook: 'Grow alongside others'
			},
			{
				href: '/enneagram-corner/subtopic/workplace',
				label: 'Professional Development',
				hook: 'Unlock career growth'
			}
		],
		relationships: [
			{
				href: '/enneagram-corner/subtopic/overview',
				label: 'Learn the System',
				hook: 'Build your foundation'
			},
			{
				href: '/enneagram-corner/subtopic/nine-types',
				label: 'Understand Their Type',
				hook: 'Know what drives them'
			},
			{
				href: '/enneagram-corner/subtopic/development',
				label: 'Grow Together',
				hook: 'Break unhealthy patterns'
			},
			{
				href: '/enneagram-corner/subtopic/workplace',
				label: 'Work Relationships',
				hook: 'Navigate colleagues'
			}
		],
		workplace: [
			{
				href: '/enneagram-corner/subtopic/overview',
				label: 'Master the Basics',
				hook: 'Start with theory'
			},
			{
				href: '/enneagram-corner/subtopic/nine-types',
				label: 'Type Your Team',
				hook: 'Identify who you work with'
			},
			{
				href: '/enneagram-corner/subtopic/development',
				label: 'Leadership Growth',
				hook: 'Develop yourself'
			},
			{
				href: '/enneagram-corner/subtopic/relationships',
				label: 'Office Dynamics',
				hook: 'Navigate the politics'
			}
		],
		resources: [
			{
				href: '/enneagram-corner/subtopic/overview',
				label: 'Start With Theory',
				hook: 'Build foundation first'
			},
			{
				href: '/enneagram-corner/subtopic/nine-types',
				label: 'Study All Types',
				hook: 'Know every pattern'
			},
			{
				href: '/enneagram-corner/subtopic/development',
				label: 'Apply to Growth',
				hook: 'Put tools to work'
			},
			{
				href: '/enneagram-corner/subtopic/relationships',
				label: 'Transform Relationships',
				hook: 'Connect with clarity'
			},
			{
				href: '/enneagram-corner/subtopic/workplace',
				label: 'Optimize Career',
				hook: 'Navigate professional life'
			}
		],
		situational: [
			{
				href: '/enneagram-corner/subtopic/overview',
				label: 'Learn the Psychology',
				hook: 'Understand the why'
			},
			{
				href: '/enneagram-corner/subtopic/nine-types',
				label: 'Know All Types',
				hook: 'Recognize each one'
			},
			{
				href: '/enneagram-corner/subtopic/development',
				label: 'Apply to Yourself',
				hook: 'Use in your own life'
			},
			{
				href: '/enneagram-corner/subtopic/relationships',
				label: 'Navigate Relationships',
				hook: 'Handle any dynamic'
			},
			{
				href: '/enneagram-corner/subtopic/workplace',
				label: 'Excel Professionally',
				hook: 'Read workplace situations'
			}
		]
	};

	// FAQ data per subsection
	const sectionFAQs: Record<string, FAQItem[]> = {
		overview: [
			{
				question: 'What makes the Enneagram different from other personality tests?',
				answer:
					'The Enneagram focuses on WHY you do things, not just what you do. It maps your core fears, desires, and unconscious motivations formed in childhood. This depth makes it more useful for personal growth than surface-level behavioral assessments.'
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
		],
		'nine-types': [
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
		],
		development: [
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
		],
		relationships: [
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
		],
		workplace: [
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
		],
		resources: [
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
		],
		situational: [
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
	};

	$: meta = sectionMeta[subsection] || sectionMeta.overview;
	$: links = relatedLinks[subsection] || relatedLinks.overview;
	$: faqs = sectionFAQs[subsection] || sectionFAQs.overview;
	$: faqSchema = JSON.stringify(buildFAQSchema(faqs));

	function formatBlogSlug(title: string) {
		return title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
	}
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${faqSchema}</script>`}
</svelte:head>

<BlogPageHead
	data={{
		title: meta.seoTitle,
		description: meta.description,
		slug: slug,
		author: 'DJ Wayne',
		date: '2024-05-09',
		loc: `https://9takes.com/enneagram-corner/subtopic/${subsection}`,
		lastmod: meta.lastmod,
		blog: true,
		pic: meta.pic
	}}
	{slug}
/>

<header class="hero">
	<h1>{meta.title}</h1>
</header>

<main class="main-content">
	{#if subsection === 'overview'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>You've been running on autopilot your entire life.</strong> Every reaction, every decision,
				every relationship pattern: all driven by an invisible operating system you never chose to install.
			</p>
			<p>
				The Enneagram reveals this hidden code. It's not another personality quiz. It's a map of
				your psychological wiring, showing exactly why you sabotage yourself in predictable ways and
				how to finally break free.
			</p>
			<p class="insight-callout">
				Master this framework, and you'll read people before they finish their first sentence.
			</p>
		</section>

		<section id="article-list">
			<h2>Explore the Fundamentals</h2>
			<div class="blog-grid">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
						class="blog-card"
						class:has-image={eBlog.pic}
						data-tag={`h-blog-${formatBlogSlug(eBlog.title)}`}
					>
						{#if eBlog.pic}
							<div
								class="card-image"
								style={`background-image: url(/blogs/s-${eBlog.pic}.webp);`}
							></div>
						{/if}
						<div class="card-overlay"></div>
						<div class="card-content">
							<h3>{eBlog.title}</h3>
							{#if eBlog.description}
								<p>{eBlog.description}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section id="conclusion" class="action-section">
			<h2>Your Next Move</h2>
			<p>
				Understanding the Enneagram isn't about putting people in boxes. It's about seeing the
				<strong>emotional logic</strong> behind their behavior. Once you see the patterns, you can't
				unsee them.
			</p>
			<p>
				<strong>Start with these articles</strong> to build your foundation. Then pick one person in
				your life, guess their type, watch for the patterns, and notice how your understanding of them
				shifts.
			</p>
		</section>
	{:else if subsection === 'nine-types'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>Nine types. Nine completely different ways of seeing the world.</strong> What looks like
				"being difficult" to one type feels like "being thorough" to another.
			</p>
			<p>
				Each type operates from a core fear and a core desire they're often unaware of. A Type 1
				isn't "controlling," they're driven by a deep need to be good and avoid criticism. A Type 7
				isn't "flaky," they're running from emotional pain they learned to escape as children.
			</p>
			<p class="insight-callout">
				Know someone's type, and you know what they're optimizing for. That changes every
				interaction.
			</p>
		</section>

		<section id="article-list">
			<h2>Deep Dives Into Each Type</h2>
			<div class="blog-grid nine-types-grid">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
						class="blog-card"
						class:has-image={eBlog.pic}
						data-tag={`h-blog-${formatBlogSlug(eBlog.title)}`}
					>
						{#if eBlog.pic}
							<div
								class="card-image"
								style={`background-image: url(/blogs/s-${eBlog.pic}.webp);`}
							></div>
						{/if}
						<div class="card-overlay"></div>
						<div class="card-content">
							<h3>{eBlog.title}</h3>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section id="conclusion" class="action-section">
			<h2>Put This Into Practice</h2>
			<p>
				Reading about types is step one. <strong
					>Spotting them in the wild is the real skill.</strong
				>
				Next time you're frustrated with someone, pause and ask: "What type pattern am I seeing?"
			</p>
			<p>
				The goal isn't to label people. It's to understand the emotional logic driving their
				behavior. When you see the fear underneath the action, frustration often transforms into
				empathy.
			</p>
		</section>
	{:else if subsection === 'development'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>Your type isn't a prison. It's a starting point.</strong> The Enneagram shows you where
				you're stuck and exactly how to get unstuck.
			</p>
			<p>
				Every type has a predictable growth edge. Type 3s need to stop performing and feel their
				real emotions. Type 9s need to assert what they actually want. Type 6s need to trust their
				own judgment instead of seeking external validation.
			</p>
			<p class="insight-callout">
				The patterns that protected you as a child now hold you back. Growth means outgrowing your
				survival strategies.
			</p>
		</section>

		<section id="article-list">
			<h2>Growth Strategies by Type</h2>
			<div class="blog-grid">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
						class="blog-card"
						class:has-image={eBlog.pic}
						data-tag={`h-blog-${formatBlogSlug(eBlog.title)}`}
					>
						{#if eBlog.pic}
							<div
								class="card-image"
								style={`background-image: url(/blogs/s-${eBlog.pic}.webp);`}
							></div>
						{/if}
						<div class="card-overlay"></div>
						<div class="card-content">
							<h3>{eBlog.title}</h3>
							{#if eBlog.description}
								<p>{eBlog.description}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section id="conclusion" class="action-section">
			<h2>The Real Work Starts Now</h2>
			<p>
				Growth isn't about becoming a different type. It's about <strong
					>expanding beyond your type's automatic responses.</strong
				> You're not broken. You're running an outdated operating system.
			</p>
			<p>
				Pick one pattern you recognize in yourself. Notice when it shows up. That awareness alone
				creates space for a different choice. That's where transformation begins.
			</p>
		</section>
	{:else if subsection === 'relationships'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>Most relationship fights aren't about what you think they're about.</strong> They're
				two different types with two different emotional needs talking past each other.
			</p>
			<p>
				Your partner isn't being "too emotional" or "too distant." They're responding from their
				type's core needs. A Type 2 needs to feel needed. A Type 5 needs space to process. A Type 8
				needs respect and directness. Miss these needs, and conflict escalates. Meet them, and
				connection deepens.
			</p>
			<p class="insight-callout">
				The same words mean different things to different types. Learn their language, and watch the
				dynamic shift.
			</p>
		</section>

		<section id="article-list">
			<h2>Relationship Dynamics Decoded</h2>
			<div class="blog-grid">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
						class="blog-card"
						class:has-image={eBlog.pic}
						data-tag={`h-blog-${formatBlogSlug(eBlog.title)}`}
					>
						{#if eBlog.pic}
							<div
								class="card-image"
								style={`background-image: url(/blogs/s-${eBlog.pic}.webp);`}
							></div>
						{/if}
						<div class="card-overlay"></div>
						<div class="card-content">
							<h3>{eBlog.title}</h3>
							{#if eBlog.description}
								<p>{eBlog.description}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section id="conclusion" class="action-section">
			<h2>Try This Tonight</h2>
			<p>
				Think of your last argument with someone close to you. <strong
					>What did they actually need</strong
				> in that moment? Validation? Space? Control? Reassurance?
			</p>
			<p>
				Now consider: did you give them what they needed, or what <em>your</em> type would have wanted?
				That gap is where most relationship friction lives. Close it, and watch connection flow.
			</p>
		</section>
	{:else if subsection === 'workplace'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>Every office runs on type dynamics.</strong> The "difficult" coworker, the micromanaging
				boss, the team that can't align. These aren't random. They're predictable patterns.
			</p>
			<p>
				Your Type 1 manager isn't being harsh. They have a genuine fear of making mistakes and need
				to feel things are done right. Your Type 7 colleague isn't scattered. They're energized by
				possibilities and drained by routine. Your Type 6 teammate isn't paranoid. They're thinking
				through all the ways things could go wrong so you don't have to.
			</p>
			<p class="insight-callout">
				Read the types in your workplace, and you unlock influence. Know what drives each person,
				and you know how to lead, collaborate, and navigate office politics.
			</p>
		</section>

		<section id="article-list">
			<h2>Workplace Strategies</h2>
			<div class="blog-grid">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
						class="blog-card"
						class:has-image={eBlog.pic}
						data-tag={`h-blog-${formatBlogSlug(eBlog.title)}`}
					>
						{#if eBlog.pic}
							<div
								class="card-image"
								style={`background-image: url(/blogs/s-${eBlog.pic}.webp);`}
							></div>
						{/if}
						<div class="card-overlay"></div>
						<div class="card-content">
							<h3>{eBlog.title}</h3>
							{#if eBlog.description}
								<p>{eBlog.description}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section id="conclusion" class="action-section">
			<h2>Apply This Tomorrow</h2>
			<p>
				Pick one colleague who frustrates you. <strong>Guess their type.</strong> Reframe their behavior
				through that lens. What fear might be driving them? What do they need to feel safe and effective?
			</p>
			<p>
				Adjust your approach based on that insight. A 5-minute conversation framed for their type
				accomplishes more than an hour of talking past each other.
			</p>
		</section>
	{:else if subsection === 'resources'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>Most Enneagram content wastes your time.</strong> Surface-level quizzes that mistype
				you. Instagram infographics that reduce complex patterns to memes. Books that contradict each
				other on fundamentals.
			</p>
			<p>
				We've tested dozens of resources and kept only what works: assessments with validated
				accuracy, books grounded in psychological research, and training programs that produce real
				results. No mysticism. No astrology-level generalizations.
			</p>
		</section>

		<section id="resource-categories">
			<h2>Curated Resources</h2>
			<div class="blog-grid">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
						class="blog-card"
						class:has-image={eBlog.pic}
						data-tag={`h-blog-${formatBlogSlug(eBlog.title)}`}
					>
						{#if eBlog.pic}
							<div
								class="card-image"
								style={`background-image: url(/blogs/s-${eBlog.pic}.webp);`}
							></div>
						{/if}
						<div class="card-overlay"></div>
						<div class="card-content">
							<h3>{eBlog.title}</h3>
							{#if eBlog.description}
								<p>{eBlog.description}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section id="conclusion" class="action-section">
			<h2>Skip the Beginner Mistakes</h2>
			<p>
				Most people waste months on bad tests, contradictory books, and surface-level content.
				<strong>Start with resources that actually deliver results.</strong>
			</p>
			<p>
				These resources include professional-grade assessments, evidence-based books, and training
				programs with track records. Use what works. Skip what doesn't.
			</p>
		</section>
	{:else if subsection === 'situational'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>Theory is useless without application.</strong> You can memorize all nine types, but
				can you spot them at a party? In a meeting? During a crisis? On a first date?
			</p>
			<p>
				These guides show you exactly how each type behaves in specific, real-world situations. No
				abstract theory. Just concrete patterns you'll recognize immediately.
			</p>
			<p class="insight-callout">
				Map patterns to real scenarios. Read people accurately when it matters.
			</p>
		</section>

		<section id="situation-categories">
			<h2>Types in Action</h2>
			<div class="blog-grid">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
						class="blog-card"
						class:has-image={eBlog.pic}
						data-tag={`h-blog-${formatBlogSlug(eBlog.title)}`}
					>
						{#if eBlog.pic}
							<div
								class="card-image"
								style={`background-image: url(/blogs/s-${eBlog.pic}.webp);`}
							></div>
						{/if}
						<div class="card-overlay"></div>
						<div class="card-content">
							<h3>{eBlog.title}</h3>
							{#if eBlog.description}
								<p>{eBlog.description}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section id="conclusion" class="action-section">
			<h2>Become a Human Behavior Expert</h2>
			<p>
				Picture walking into any room and immediately reading everyone's motivations, fears, and
				likely behaviors. <strong>This isn't mind reading. It's pattern recognition.</strong>
			</p>
			<p>
				These situational guides train you to spot types in action, predict their responses, and
				adapt your approach accordingly. Dating, managing, selling, negotiating. These are your
				field guides to human behavior.
			</p>
		</section>
	{/if}

	<!-- FAQ Section -->
	<FAQSection {faqs} title="Common Questions" />

	<section id="related-subsections">
		<h2>Where to Go Next</h2>
		<div class="related-grid">
			{#each links as link}
				<a href={link.href} class="related-card">
					<span class="related-label">{link.label}</span>
					<span class="related-hook">{link.hook}</span>
				</a>
			{/each}
		</div>
	</section>
</main>

<style lang="scss">
	/* Solo Leveling Dark Theme */

	/* Hero Section */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 1.5rem;
		text-align: center;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 400px;
			height: 200px;
			background: radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
			pointer-events: none;
		}
	}

	h1 {
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		letter-spacing: -0.02em;
		position: relative;
		background: linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 0;
	}

	h2 {
		font-size: 1.375rem;
		font-weight: 600;
		color: #f1f5f9;
		margin: 0 0 1.25rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;

		&::before {
			content: '';
			width: 3px;
			height: 1.25rem;
			background: linear-gradient(180deg, #7c3aed 0%, #a78bfa 100%);
			border-radius: 2px;
		}
	}

	h3 {
		font-size: 1rem;
		font-weight: 600;
		color: #e2e8f0;
	}

	p {
		font-size: 1rem;
		color: #94a3b8;
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	/* Intro Section Styling */
	.intro-section {
		margin-bottom: 2.5rem;
		max-width: 800px;

		.hook {
			font-size: 1.125rem;
			color: #e2e8f0;
			line-height: 1.6;

			strong {
				color: #f1f5f9;
			}
		}

		p {
			strong {
				color: #e2e8f0;
			}
		}

		.insight-callout {
			margin-top: 1.5rem;
			padding: 1.25rem 1.5rem;
			background: linear-gradient(
				135deg,
				rgba(124, 58, 237, 0.15) 0%,
				rgba(124, 58, 237, 0.05) 100%
			);
			border-left: 3px solid #7c3aed;
			border-radius: 0 0.75rem 0.75rem 0;
			color: #e2e8f0;
			font-weight: 500;
			font-style: italic;
		}
	}

	/* Action Section (Conclusions) */
	.action-section {
		margin-top: 2.5rem;
		padding: 2rem;
		background: linear-gradient(135deg, #1a1a2e 0%, #12121a 100%);
		border-radius: 1rem;
		border: 1px solid rgba(124, 58, 237, 0.2);
		max-width: 800px;
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: -50%;
			right: -20%;
			width: 200px;
			height: 200px;
			background: radial-gradient(ellipse, rgba(124, 58, 237, 0.1) 0%, transparent 70%);
			pointer-events: none;
		}

		h2 {
			margin-bottom: 1rem;
		}

		p {
			position: relative;

			strong {
				color: #a78bfa;
			}

			em {
				color: #cbd5e1;
			}
		}

		p:last-child {
			margin-bottom: 0;
		}
	}

	/* Blog Grid */
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.nine-types-grid {
		grid-template-columns: repeat(3, 1fr);
	}

	/* Blog Cards */
	.blog-card {
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: 0.75rem;
		overflow: hidden;
		background: #16161e;
		text-decoration: none;
		transition: all 0.25s ease;
		border: 1px solid rgba(100, 116, 139, 0.15);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-3px);
			border-color: rgba(124, 58, 237, 0.3);
			box-shadow:
				0 8px 24px rgba(0, 0, 0, 0.3),
				0 0 0 1px rgba(124, 58, 237, 0.1);

			&::before {
				opacity: 1;
			}

			.card-image {
				transform: scale(1.05);
			}

			.card-content h3 {
				color: #a78bfa;
			}
		}

		&.has-image {
			.card-overlay {
				background: linear-gradient(
					to top,
					rgba(10, 10, 15, 0.95) 0%,
					rgba(10, 10, 15, 0.6) 40%,
					rgba(10, 10, 15, 0.3) 100%
				);
			}
		}
	}

	.card-image {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		transition: transform 0.4s ease;
	}

	.card-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(22, 22, 30, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%);
	}

	.card-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1rem;
		color: white;

		h3 {
			font-size: 0.9375rem;
			font-weight: 600;
			line-height: 1.4;
			margin: 0;
			color: #e2e8f0;
			transition: color 0.2s ease;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		p {
			font-size: 0.75rem;
			line-height: 1.5;
			color: #94a3b8;
			margin: 0.375rem 0 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}

	/* Related Subsections */
	#related-subsections {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(100, 116, 139, 0.15);

		h2 {
			margin-bottom: 1.5rem;
		}
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.related-card {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1.25rem;
		background: #16161e;
		border: 1px solid rgba(100, 116, 139, 0.15);
		border-radius: 0.75rem;
		text-decoration: none;
		transition: all 0.25s ease;

		&:hover {
			background: rgba(124, 58, 237, 0.1);
			border-color: rgba(124, 58, 237, 0.3);
			transform: translateY(-2px);

			.related-label {
				color: #a78bfa;
			}
		}

		.related-label {
			font-weight: 600;
			color: #7c3aed;
			font-size: 1rem;
			transition: color 0.2s ease;
		}

		.related-hook {
			color: #64748b;
			font-size: 0.875rem;
		}
	}

	/* Section spacing */
	section {
		margin-bottom: 2.5rem;
	}

	/* Responsive */
	@media (max-width: 900px) {
		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.nine-types-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: 1.5rem 1rem 1rem;
		}

		.main-content {
			padding: 1rem 1rem 0;
		}

		h2 {
			font-size: 1.125rem;
		}

		.blog-grid,
		.nine-types-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.625rem;
		}

		.blog-card {
			aspect-ratio: 1;
			border-radius: 0.5rem;
		}

		.card-content {
			padding: 0.625rem;

			h3 {
				font-size: 0.75rem;
				-webkit-line-clamp: 2;
				line-clamp: 2;
			}

			p {
				display: none;
			}
		}

		.intro-section,
		.action-section {
			max-width: 100%;
		}

		.intro-section .hook {
			font-size: 1rem;
		}

		.intro-section .insight-callout {
			padding: 1rem 1.25rem;
			font-size: 0.9375rem;
		}

		.action-section {
			padding: 1.5rem;
			border-radius: 0.75rem;
		}

		.related-grid {
			grid-template-columns: 1fr;
		}

		#related-subsections {
			margin-top: 2rem;
			padding-top: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		p {
			font-size: 0.9375rem;
		}
	}

	@media (max-width: 380px) {
		.hero {
			padding: 1.25rem 1rem 0.75rem;
		}

		.blog-grid,
		.nine-types-grid {
			gap: 0.5rem;
		}

		.card-content {
			padding: 0.5rem;

			h3 {
				font-size: 0.6875rem;
			}
		}

		.related-card {
			padding: 1rem;

			.related-label {
				font-size: 0.9375rem;
			}

			.related-hook {
				font-size: 0.8125rem;
			}
		}
	}
</style>
