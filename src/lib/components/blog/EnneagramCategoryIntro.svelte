<!-- src/lib/components/blog/EnneagramCategoryIntro.svelte -->
<script lang="ts">
	import BlogPageHead from './BlogPageHead.svelte';

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
				'Each type operates on a different emotional frequency. Learn the core fears, desires, and blind spots driving behavior—yours and everyone around you.',
			pic: 's-greek-statues-working-in-teams',
			lastmod: '2025-08-15'
		},
		development: {
			title: 'Know Your Pattern. Break Your Pattern.',
			seoTitle: 'Enneagram Personal Development: Growth Strategies by Type | 9takes',
			description:
				'Your type is running the show until you see it. Discover type-specific growth paths, blind spots to watch, and the exact practices that create lasting change.',
			pic: 'Self-awareness-and-Self-understanding',
			lastmod: '2025-08-15'
		},
		relationships: {
			title: 'Why They Do That (A Relationship Decoder)',
			seoTitle: 'Enneagram Relationship Guide: Communication, Conflict & Connection | 9takes',
			description:
				'Stop taking it personally. Their reactions are about their type, not you. Learn to read relationship dynamics and communicate in ways that actually land.',
			pic: 'greek-statues-having-an-intimate-conversation',
			lastmod: '2025-08-15'
		},
		workplace: {
			title: 'Read the Room, Run the Room',
			seoTitle: 'Enneagram at Work: Leadership, Teams & Communication Styles | 9takes',
			description:
				'Every office has patterns. Learn to spot types in meetings, decode what motivates your team, and navigate workplace dynamics like a pro.',
			pic: 'greek-statues-disagreeing',
			lastmod: '2025-08-15'
		},
		resources: {
			title: 'Resources That Actually Work (We Tested Everything)',
			seoTitle: 'Essential Enneagram Resources: Tools, Tests & Training | 9takes',
			description:
				'Cut through the noise. Access the best Enneagram tests, books, tools, and training. Curated resources for serious students of personality psychology.',
			pic: 'greek-dude-reading-book',
			lastmod: '2025-08-15'
		},
		situational: {
			title: 'The Types in the Wild: Real Situations, Real Behaviors',
			seoTitle: 'Real-World Type Behaviors: How Each Type Actually Shows Up | 9takes',
			description:
				'See the types in action. From first dates to job interviews, from parties to panic attacks—understand exactly how each type behaves in real situations.',
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
				hook: 'Learn what drives each one'
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
				hook: 'Read the office dynamics'
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
				hook: 'Deepen your understanding'
			},
			{
				href: '/enneagram-corner/subtopic/relationships',
				label: 'Relationship Growth',
				hook: 'Grow with others'
			},
			{
				href: '/enneagram-corner/subtopic/workplace',
				label: 'Professional Development',
				hook: 'Level up at work'
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
				hook: 'Connect deeper'
			},
			{
				href: '/enneagram-corner/subtopic/workplace',
				label: 'Optimize Career',
				hook: 'Level up professionally'
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
				hook: 'Use in your life'
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

	$: meta = sectionMeta[subsection] || sectionMeta.overview;
	$: links = relatedLinks[subsection] || relatedLinks.overview;

	function formatBlogSlug(title: string) {
		return title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
	}
</script>

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

<header>
	<h1>{meta.title}</h1>
</header>

<main>
	{#if subsection === 'overview'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>You've been running on autopilot your entire life.</strong> Every reaction, every decision,
				every relationship pattern—they're all driven by an invisible operating system you never chose
				to install.
			</p>
			<p>
				The Enneagram reveals this hidden code. It's not just another personality test—it's a map of
				your psychological DNA, showing exactly why you sabotage yourself in predictable ways and
				how to finally break free.
			</p>
			<p class="insight-callout">
				Master this framework, and you'll understand people at levels they don't even understand
				themselves.
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
				Understanding the Enneagram isn't about putting people in boxes—it's about seeing the
				<strong>emotional logic</strong> behind their behavior. Once you see the patterns, you can't
				unsee them.
			</p>
			<p>
				<strong>Start with these articles</strong> to build your foundation. Then pick one person in
				your life—guess their type, watch for the patterns, and notice how your understanding of them
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
				isn't "controlling"—they're driven by a deep need to be good and avoid criticism. A Type 7
				isn't "flaky"—they're running from emotional pain they learned to escape as children.
			</p>
			<p class="insight-callout">
				Know someone's type, and you know what they're optimizing for. That changes everything.
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
				The goal isn't to label people—it's to understand the emotional logic driving their
				behavior. When you see the fear underneath the behavior, frustration often transforms into
				empathy.
			</p>
		</section>
	{:else if subsection === 'development'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>Your type isn't a prison. It's a starting point.</strong> The Enneagram shows you where
				you're stuck—and exactly how to get unstuck.
			</p>
			<p>
				Every type has a predictable growth edge. Type 3s need to stop performing and feel their
				real emotions. Type 9s need to assert what they actually want. Type 6s need to trust their
				own judgment instead of seeking external validation.
			</p>
			<p class="insight-callout">
				The patterns that protected you as a child are now holding you back. Growth means outgrowing
				your survival strategies.
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
				Growth isn't about becoming a different type—it's about <strong
					>expanding beyond your type's automatic responses.</strong
				> You're not broken. You're just running an outdated operating system.
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
				about two different types with two different emotional needs talking past each other.
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
				That gap is where most relationship friction lives. Close it, and connection flows.
			</p>
		</section>
	{:else if subsection === 'workplace'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>Every office is a petri dish of type dynamics.</strong> The "difficult" coworker, the
				micromanaging boss, the team that can't align—these aren't random. They're predictable patterns.
			</p>
			<p>
				Your Type 1 manager isn't being harsh—they have a genuine fear of making mistakes and need
				to feel things are done right. Your Type 7 colleague isn't scattered—they're energized by
				possibilities and drained by routine. Your Type 6 teammate isn't paranoid—they're thinking
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
				Pick one colleague who frustrates you. <strong>Guess their type.</strong> Now reframe their behavior
				through that lens. What fear might be driving them? What do they need to feel safe and effective?
			</p>
			<p>
				Adjust your approach based on that insight. A 5-minute conversation framed for their type
				will accomplish more than an hour of talking past each other.
			</p>
		</section>
	{:else if subsection === 'resources'}
		<section id="introduction" class="intro-section">
			<p class="hook">
				<strong>90% of Enneagram content is garbage.</strong> Surface-level buzzfeed quizzes, Instagram
				infographics that oversimplify, books that contradict each other. We've sorted through it all
				so you don't have to.
			</p>
			<p>
				These are the resources that pass our test: scientifically grounded, practically useful, and
				actually accurate. No fluff, no mysticism, just tools that deliver real psychological
				insight.
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
				<strong>Start with resources that actually deliver results.</strong> We've done the research,
				tested the tools, and validated the frameworks.
			</p>
			<p>
				Our curated collection includes professional-grade assessments, evidence-based books, and
				advanced training programs. Stop wasting time on personality astrology. Get the real tools.
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
				abstract theory—just concrete patterns you'll recognize immediately.
			</p>
			<p class="insight-callout">Learn to read people like a book in any scenario.</p>
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
				Imagine walking into any room and instantly understanding everyone's motivations, fears, and
				likely behaviors. <strong>This isn't mind reading—it's pattern recognition.</strong>
			</p>
			<p>
				Our situational guides train you to spot types in action, predict their responses, and adapt
				your approach accordingly. Whether you're dating, managing, selling, or just trying to
				understand people better, these are your field guides to human behavior.
			</p>
		</section>
	{/if}

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
	/* Brand-aligned Design System */
	:root {
		--brand-purple: #6c5ce7;
		--brand-purple-light: rgba(108, 92, 231, 0.1);
		--brand-purple-dark: #5a4bcf;
		--text-primary: #2d3436;
		--text-secondary: #636e72;
		--surface: white;
		--border-subtle: rgba(0, 0, 0, 0.06);
	}

	/* Typography */
	h1 {
		font-size: clamp(2rem, 5vw, 2.75rem);
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 1.5rem;
		line-height: 1.2;
	}

	h2 {
		font-size: clamp(1.5rem, 3vw, 1.875rem);
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 1.25rem;
	}

	h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	p {
		font-size: 1rem;
		color: var(--text-secondary);
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	/* Intro Section Styling */
	.intro-section {
		margin-bottom: 3rem;
		max-width: 720px;

		.hook {
			font-size: 1.125rem;
			color: var(--text-primary);
			line-height: 1.6;
		}

		.insight-callout {
			margin-top: 1.5rem;
			padding: 1.25rem 1.5rem;
			background: linear-gradient(135deg, var(--brand-purple-light), rgba(108, 92, 231, 0.05));
			border-left: 4px solid var(--brand-purple);
			border-radius: 0 8px 8px 0;
			color: var(--text-primary);
			font-weight: 500;
			font-style: italic;
		}
	}

	/* Action Section (Conclusions) */
	.action-section {
		margin-top: 3rem;
		padding: 2rem;
		background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
		border-radius: 12px;
		border: 1px solid var(--border-subtle);
		max-width: 720px;

		h2 {
			margin-bottom: 1rem;
		}

		p:last-child {
			margin-bottom: 0;
		}
	}

	/* Disable default link arrows */
	a::after {
		display: none !important;
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
		border-radius: 12px;
		overflow: hidden;
		background: linear-gradient(
			135deg,
			var(--darkest-gray, #2d3436) 0%,
			var(--black, #1a1a1a) 100%
		);
		text-decoration: none;
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);

			.card-image {
				transform: scale(1.05);
			}
		}

		&.has-image {
			.card-overlay {
				background: linear-gradient(
					to top,
					rgba(0, 0, 0, 0.85) 0%,
					rgba(0, 0, 0, 0.4) 50%,
					rgba(0, 0, 0, 0.1) 100%
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
		background: linear-gradient(135deg, rgba(42, 45, 52, 0.9) 0%, rgba(24, 25, 26, 0.9) 100%);
	}

	.card-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1.25rem;
		color: white;

		h3 {
			font-size: 1rem;
			font-weight: 600;
			line-height: 1.4;
			margin: 0;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		p {
			font-size: 0.8rem;
			line-height: 1.5;
			opacity: 0.85;
			margin: 0.5rem 0 0;
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
		border-top: 1px solid var(--border-subtle);

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
		background: var(--surface);
		border: 1px solid var(--border-subtle);
		border-radius: 10px;
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		&:hover {
			background: var(--brand-purple-light);
			border-color: rgba(108, 92, 231, 0.2);
			transform: translateY(-2px);

			.related-label {
				color: var(--brand-purple-dark);
			}
		}

		.related-label {
			font-weight: 600;
			color: var(--brand-purple);
			font-size: 1rem;
		}

		.related-hook {
			color: var(--text-secondary);
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
		.blog-grid,
		.nine-types-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
		}

		.blog-card {
			aspect-ratio: 1;
			border-radius: 8px;
		}

		.card-content {
			padding: 0.75rem;

			h3 {
				font-size: 0.8rem;
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

		.action-section {
			padding: 1.5rem;
			border-radius: 12px;
		}

		.related-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		p {
			font-size: 0.9375rem;
		}

		.intro-section .hook {
			font-size: 1rem;
		}

		.intro-section .insight-callout {
			padding: 1rem 1.25rem;
		}
	}

	@media (max-width: 380px) {
		.blog-grid,
		.nine-types-grid {
			gap: 0.4rem;
		}

		.card-content {
			padding: 0.5rem;

			h3 {
				font-size: 0.7rem;
			}
		}
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		:root {
			--text-primary: #f0f0f0;
			--text-secondary: #a0a0a0;
			--surface: #1a1a2e;
			--border-subtle: rgba(255, 255, 255, 0.1);
		}

		.action-section {
			background: linear-gradient(135deg, #1a1a2e 0%, #2d3436 100%);
		}
	}
</style>
