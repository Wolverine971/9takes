<!-- src/routes/about/+page.svelte -->

<script lang="ts">
	import twitter from '$lib/images/twitter.svg';

	let showEmail = $state(false);
</script>

<svelte:head>
	<title>About 9takes - Where You See Through 9 Different Lenses</title>
	<meta
		name="description"
		content="9takes uses the Enneagram to break you out of your perspective bubble. See how 9 personality types answer the same question differently."
	/>
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="author" content="9takes" />
	<link rel="canonical" href="https://9takes.com/about" />
	<link rel="alternate" href="https://9takes.com/about" hreflang="en-US" />
	<link rel="alternate" href="https://9takes.com/about" hreflang="x-default" />

	<!-- Open Graph -->
	<meta property="og:title" content="About 9takes - One Situation, 9 Ways to See It" />
	<meta
		property="og:description"
		content="9takes shows you HOW different personality types see the same situation. Break out of your perspective bubble."
	/>
	<meta property="og:image" content="https://9takes.com/brand/aero.png" />
	<meta property="og:image:alt" content="9takes brand mark" />
	<meta property="og:url" content="https://9takes.com/about" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@djwayne3" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content="About 9takes - See Through 9 Different Lenses" />
	<meta
		name="twitter:description"
		content="500 million people share opinions online every day. Almost none change their minds. 9takes fixes that."
	/>
	<meta name="twitter:image" content="https://9takes.com/brand/aero.png" />
	<meta name="twitter:image:alt" content="9takes brand mark" />

	<!-- Structured Data for Person and Organization -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "DJ Wayne",
			"givenName": "DJ",
			"familyName": "Wayne",
			"jobTitle": "Founder",
			"worksFor": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com",
				"logo": "https://9takes.com/brand/aero.png",
				"sameAs": ["https://twitter.com/djwayne3"]
			},
			"alumniOf": [
				{
					"@type": "EducationalOrganization",
					"name": "United States Marine Corps",
					"alternateName": "USMC"
				}
			],
			"knowsAbout": [
				"Enneagram",
				"Personality Psychology",
				"Emotional Intelligence",
				"Military Intelligence",
				"Software Development",
				"Entrepreneurship",
				"Cognitive Psychology",
				"Perspective Taking"
			],
			"description": "From USMC infantry to tech entrepreneur. Meet DJ Wayne, creator of 9takes, helping people build emotional intelligence through personality psychology.",
			"image": "https://9takes.com/brand/djface.webp",
			"url": "https://9takes.com/about",
			"sameAs": ["https://twitter.com/djwayne3", "https://www.linkedin.com/in/djwayne3"]
		}
	</script>

	<!-- AboutPage Schema -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "AboutPage",
			"name": "About 9takes - One Situation, 9 Ways to See It",
			"description": "9takes uses the Enneagram to show how different personality types see the same situation. Break out of your perspective bubble.",
			"url": "https://9takes.com/about",
			"mainEntity": {
				"@type": "Organization",
				"name": "9takes",
				"founder": {
					"@type": "Person",
					"name": "DJ Wayne"
				},
				"foundingDate": "2022",
				"description": "A platform that reveals how 9 different personality types see the same situation, breaking people out of their perspective bubbles.",
				"url": "https://9takes.com"
			}
		}
	</script>
</svelte:head>

<div class="about-page">
	<!-- Hero Section -->
	<section class="hero">
		<div class="hero-glow"></div>
		<h1>You're Only Seeing <span class="gradient-text">1/9th</span> of Reality</h1>
		<p class="hero-subtitle">
			500 million people share opinions online every day.<br />
			<strong>Almost none change their minds.</strong>
		</p>
	</section>

	<!-- Problem Section -->
	<section class="problem-section">
		<div class="problem-card">
			<h2>The Problem</h2>
			<p>
				Social media turned conversation into performance. Reddit became tribes defending territory.
				Everyone talks. Nobody listens.
			</p>
			<p class="solution">
				9takes flips the script: you share YOUR perspective first, then see how the other
				personality types answered the same question.
			</p>
		</div>
	</section>

	<!-- What Is the Enneagram -->
	<section class="enneagram-explainer">
		<h2 class="section-title">What's the Enneagram?</h2>
		<p class="explainer-intro">
			The Enneagram is a personality system rooted in three core emotions: <strong>anger</strong>,
			<strong>fear</strong>, and <strong>shame</strong>. Everyone experiences all three, but one
			dominates how you process the world. From that core emotion, people develop coping skills that
			map to three intelligence centers:
		</p>

		<div class="centers-grid">
			<div class="center-card">
				<div class="center-icon">&#9679;</div>
				<h3>Body Center</h3>
				<span class="center-types">Types 8, 9, 1</span>
				<p>Process through <strong>anger</strong> and instinct. Act first, think later.</p>
			</div>
			<div class="center-card">
				<div class="center-icon">&#9650;</div>
				<h3>Head Center</h3>
				<span class="center-types">Types 5, 6, 7</span>
				<p>Process through <strong>fear</strong> and analysis. Think first, act later.</p>
			</div>
			<div class="center-card">
				<div class="center-icon">&#9829;</div>
				<h3>Heart Center</h3>
				<span class="center-types">Types 2, 3, 4</span>
				<p>Process through <strong>shame</strong> and image. Feel first, act later.</p>
			</div>
		</div>

		<p class="explainer-link">
			9 types. 3 centers. One framework for understanding why people see the same situation
			completely differently.
			<a href="/enneagram-corner/enneagram-concepts">Learn the full system &rarr;</a>
		</p>
	</section>

	<!-- How It Works -->
	<section class="how-it-works">
		<h2 class="section-title">How It Works</h2>

		<div class="steps-grid">
			<div class="step-card">
				<div class="step-number">1</div>
				<h3>Think First, Read Second</h3>
				<p>Share your take before seeing anyone else's</p>
				<ul>
					<li>No groupthink. No karma farming.</li>
					<li>Your authentic thought, captured clean.</li>
				</ul>
			</div>

			<div class="step-card">
				<div class="step-number">2</div>
				<h3>See WHY They Think That Way</h3>
				<p>Anonymous responses with Enneagram type visible</p>
				<ul>
					<li>Shift from "they're wrong" to "they're wired differently"</li>
				</ul>
			</div>

			<div class="step-card">
				<div class="step-number">3</div>
				<h3>Discover Your Blindspots</h3>
				<p>Real questions, not engagement bait</p>
				<ul>
					<li>Every question shows you 8 angles you missed.</li>
				</ul>
			</div>
		</div>

		<!-- Comparison -->
		<div class="comparison">
			<div class="comparison-item bad">
				<h4>Reddit</h4>
				<p>500 comments saying the same thing</p>
			</div>
			<div class="comparison-item good">
				<h4>9takes</h4>
				<p>9 perspectives showing different truths</p>
			</div>
		</div>
	</section>

	<!-- See It In Action -->
	<section class="example-section">
		<h2 class="section-title">See It In Action</h2>
		<p class="example-intro">Here's what it looks like when one question gets 3 different takes:</p>

		<div class="example-question">
			<div class="example-q-header">
				<span class="example-q-label">Question</span>
			</div>
			<p class="example-q-text">How do you handle conflict at work?</p>
		</div>

		<div class="example-responses">
			<div class="example-response">
				<div class="example-response-header">
					<span class="type-badge body-type">Type 8</span>
					<span class="center-label">Body / Instinct</span>
				</div>
				<p>
					I address it head-on. If something's wrong, I'd rather have an uncomfortable 5-minute
					conversation than let it fester for weeks. Most people avoid conflict because they're
					scared of it. I'm not.
				</p>
			</div>
			<div class="example-response">
				<div class="example-response-header">
					<span class="type-badge head-type">Type 5</span>
					<span class="center-label">Head / Analysis</span>
				</div>
				<p>
					I step back and observe the pattern first. Who's actually upset, and about what? Usually
					the stated problem isn't the real problem. I wait until I've mapped out what's actually
					going on before I say anything.
				</p>
			</div>
			<div class="example-response">
				<div class="example-response-header">
					<span class="type-badge heart-type">Type 2</span>
					<span class="center-label">Heart / Feeling</span>
				</div>
				<p>
					I check in with both sides privately first. People can't hear solutions when they feel
					unheard. Once everyone feels seen, the actual resolution usually comes together fast.
				</p>
			</div>
		</div>

		<p class="example-footer">
			Same question. Three completely different approaches. All valid.
			<a href="/questions" class="example-cta">See real responses &rarr;</a>
		</p>
	</section>

	<!-- Why This Matters -->
	<section class="why-matters">
		<h2 class="section-title">Why This Matters</h2>

		<div class="why-content">
			<p>
				Every platform has groupthink. Algorithms push you toward what you already believe. The
				takes you see are the ones that got the most upvotes — not the most honest ones. Nobody's
				curious about how someone else actually sees the same moment.
			</p>
			<p>
				9takes is a place to <strong>give your real take</strong> first, then see how other
				personality types read the same situation. No performance. No tribes. Just
				<strong>9 different lenses</strong> on the same question.
			</p>
		</div>

		<div class="cta-banner">
			<p class="cta-main">The question isn't whether you have blindspots.</p>
			<p class="cta-sub">It's whether you're willing to find them.</p>
		</div>
	</section>

	<!-- Founder Section -->
	<section class="founder-section">
		<h2 class="section-title">The Story Behind 9takes</h2>

		<div class="founder-grid">
			<div class="founder-story">
				<h3>Why I Built This</h3>
				<ul>
					<li>
						<strong>The problem:</strong> In the Marines, I learned to suppress emotions and push forward.
						Great for combat. Terrible for relationships.
					</li>
					<li>
						<strong>The discovery:</strong> The Enneagram showed me WHY people process reality differently.
						Not better or worse. Different.
					</li>
					<li>
						<strong>The mission:</strong> Build a place where you can actually learn to see through other
						perspectives.
					</li>
					<li>
						<strong>The goal:</strong> Replace judgment with curiosity.
					</li>
				</ul>
			</div>

			<div class="founder-image">
				<div class="image-frame">
					<img src="/brand/djface.webp" alt="DJ Wayne, Founder of 9takes" />
					<span class="founder-name">DJ Wayne, Founder</span>
				</div>
			</div>
		</div>

		<div class="social-links">
			<a href="https://twitter.com/djwayne3" target="_blank" rel="noreferrer" class="social-btn">
				<img src={twitter} alt="Twitter icon" />
				Twitter/X
			</a>
			<a
				href="https://www.linkedin.com/in/djwayne3"
				target="_blank"
				rel="noreferrer"
				class="social-btn"
			>
				<svg fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
					/>
				</svg>
				LinkedIn
			</a>
		</div>
	</section>

	<!-- Start Here CTA -->
	<section class="start-here">
		<h2 class="section-title">Start Here</h2>

		<div class="cta-grid two-col">
			<div class="cta-card primary">
				<h3>See the 9 Perspectives</h3>
				<p>Watch how different types answer real questions</p>
				<a href="/questions" class="cta-button">Browse Questions</a>
			</div>
			<div class="cta-card">
				<h3>Learn the Patterns</h3>
				<p>Understand why people think the way they do</p>
				<a href="/enneagram-corner" class="cta-button secondary">Read the Guides</a>
			</div>
		</div>
		<p class="coaching-hint">
			Want to go deeper? <a href="/book-session">Explore 1-on-1 guidance</a>
		</p>
	</section>

	<!-- Final Quote -->
	<section class="final-quote">
		<p class="quote-main">See through other people's eyes without losing your own vision.</p>
		<p class="quote-sub">That's what 9takes is for.</p>
	</section>

	<!-- Contact -->
	<section class="contact-section">
		<h3>Questions?</h3>
		<p>Reach out. I read everything.</p>

		{#if !showEmail}
			<button type="button" class="contact-btn" onclick={() => (showEmail = true)}>
				Get in Touch
			</button>
		{:else}
			<div class="email-info">
				<p>
					<a href="mailto:dj@9takes.com">dj@9takes.com</a>
				</p>
			</div>
		{/if}
	</section>
</div>

<style lang="scss">
	.about-page {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		color: var(--text-primary);
	}

	/* Section Title */
	.section-title {
		font-size: 1.875rem;
		font-weight: 700;
		color: var(--accent-light);
		text-align: center;
		margin-bottom: 2rem;
	}

	/* Hero Section */
	.hero {
		position: relative;
		text-align: center;
		padding: 3rem 0 4rem;
		margin-bottom: 3rem;
	}

	.hero-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 600px;
		height: 300px;
		background: radial-gradient(ellipse, rgba(45, 212, 191, 0.15) 0%, transparent 70%);
		pointer-events: none;
	}

	.hero h1 {
		position: relative;
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--text-primary);
		margin-bottom: 1.5rem;
		line-height: 1.2;
	}

	.gradient-text {
		background: linear-gradient(
			135deg,
			var(--accent-light) 0%,
			var(--primary-dark) 50%,
			var(--accent-dark) 100%
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-subtitle {
		position: relative;
		font-size: 1.25rem;
		color: var(--text-secondary);
		line-height: 1.6;

		strong {
			color: var(--text-primary);
		}
	}

	/* Problem Section */
	.problem-section {
		margin-bottom: 4rem;
	}

	.problem-card {
		background: var(--bg-surface);
		border: 1px solid rgba(239, 68, 68, 0.4);
		border-radius: 12px;
		padding: 2rem;

		h2 {
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--text-primary);
			margin-bottom: 1rem;
		}

		p {
			font-size: 1.125rem;
			color: var(--neutral-700);
			line-height: 1.7;
			margin-bottom: 1rem;
		}

		.solution {
			color: var(--accent-light);
			font-weight: 600;
			margin-bottom: 0;
		}
	}

	/* How It Works */
	.how-it-works {
		margin-bottom: 4rem;
	}

	.steps-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.step-card {
		background: var(--bg-surface);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 20%, transparent);
		border-radius: 12px;
		padding: 1.5rem;
		transition: all 0.3s ease;

		&:hover {
			border-color: rgba(45, 212, 191, 0.4);
			box-shadow: 0 0 20px rgba(45, 212, 191, 0.1);
		}

		h3 {
			font-size: 1.125rem;
			font-weight: 700;
			color: var(--text-primary);
			margin-bottom: 0.75rem;
		}

		p {
			font-size: 0.9375rem;
			color: var(--text-secondary);
			margin-bottom: 0.75rem;
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				font-size: 0.8125rem;
				color: var(--text-tertiary);
				margin-bottom: 0.25rem;
			}
		}
	}

	.step-number {
		width: 48px;
		height: 48px;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--accent-dark) 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 700;
		color: white;
		margin-bottom: 1rem;
		box-shadow: 0 0 20px rgba(45, 212, 191, 0.4);
	}

	/* Comparison */
	.comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		background: var(--bg-deep);
		border-radius: 12px;
		padding: 1.5rem;
	}

	.comparison-item {
		padding: 1rem;
		border-radius: 8px;

		h4 {
			font-size: 1rem;
			font-weight: 700;
			margin-bottom: 0.5rem;
		}

		p {
			font-size: 0.9375rem;
			margin: 0;
		}

		&.bad {
			background: var(--bg-surface);
			border: 1px solid color-mix(in srgb, var(--error) 50%, transparent);

			h4 {
				color: var(--error);
			}
			p {
				color: var(--text-secondary);
			}
		}

		&.good {
			background: var(--bg-surface);
			border: 1px solid color-mix(in srgb, var(--success) 50%, transparent);

			h4 {
				color: var(--success-text);
			}
			p {
				color: var(--text-secondary);
			}
		}
	}

	/* Enneagram Explainer */
	.enneagram-explainer {
		margin-bottom: 4rem;
	}

	.explainer-intro {
		font-size: 1.0625rem;
		color: var(--neutral-700);
		line-height: 1.7;
		text-align: center;
		max-width: 700px;
		margin: 0 auto 2rem;

		strong {
			color: var(--accent-light);
		}
	}

	.centers-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.center-card {
		background: var(--bg-surface);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 20%, transparent);
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;

		h3 {
			font-size: 1rem;
			font-weight: 700;
			color: var(--text-primary);
			margin-bottom: 0.25rem;
		}

		p {
			font-size: 0.875rem;
			color: var(--text-secondary);
			margin: 0;

			strong {
				color: var(--accent-light);
			}
		}
	}

	.center-icon {
		font-size: 1.5rem;
		color: var(--accent-light);
		margin-bottom: 0.5rem;
	}

	.center-types {
		display: inline-block;
		font-size: 0.75rem;
		color: var(--text-tertiary);
		margin-bottom: 0.75rem;
	}

	.explainer-link {
		text-align: center;
		font-size: 0.9375rem;
		color: var(--text-secondary);

		a {
			color: var(--accent-light);
			text-decoration: none;
			font-weight: 600;

			&:hover {
				color: var(--primary-lightest);
				text-decoration: underline;
			}
		}
	}

	/* Example Section */
	.example-section {
		margin-bottom: 4rem;
	}

	.example-intro {
		text-align: center;
		font-size: 1.0625rem;
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
	}

	.example-question {
		background: var(--bg-deep);
		border: 1px solid rgba(45, 212, 191, 0.3);
		border-radius: 12px 12px 0 0;
		padding: 1.25rem 1.5rem;
	}

	.example-q-header {
		margin-bottom: 0.5rem;
	}

	.example-q-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--accent-light);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.example-q-text {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
	}

	.example-responses {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: color-mix(in srgb, var(--text-tertiary) 10%, transparent);
	}

	.example-response {
		background: var(--bg-surface);
		padding: 1.25rem 1.5rem;

		&:last-child {
			border-radius: 0 0 12px 12px;
		}

		p {
			font-size: 0.9375rem;
			color: var(--neutral-700);
			line-height: 1.6;
			margin: 0;
		}
	}

	.example-response-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.75rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;

		&.body-type {
			background: transparent;
			border: 1.5px solid var(--pillar-gut);
			color: var(--pillar-gut);
		}

		&.head-type {
			background: transparent;
			border: 1.5px solid var(--pillar-head);
			color: var(--pillar-head);
		}

		&.heart-type {
			background: transparent;
			border: 1.5px solid var(--pillar-heart);
			color: var(--pillar-heart);
		}
	}

	.center-label {
		font-size: 0.75rem;
		color: var(--text-tertiary);
	}

	.example-footer {
		text-align: center;
		font-size: 1rem;
		color: var(--text-secondary);
		margin-top: 1.5rem;
	}

	.example-cta {
		display: inline-block;
		margin-left: 0.5rem;
		color: var(--accent-light);
		font-weight: 600;
		text-decoration: none;

		&:hover {
			color: var(--primary-lightest);
			text-decoration: underline;
		}
	}

	/* Why Matters */
	.why-matters {
		margin-bottom: 4rem;
	}

	.why-content {
		max-width: 700px;
		margin: 0 auto 2rem;

		p {
			font-size: 1.0625rem;
			color: var(--neutral-700);
			line-height: 1.7;
			margin-bottom: 1.25rem;

			&:last-child {
				margin-bottom: 0;
			}

			strong {
				color: var(--text-primary);
			}
		}
	}

	.cta-banner {
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--accent-dark) 100%);
		border-radius: 12px;
		padding: 2rem;
		text-align: center;
		box-shadow: 0 0 40px rgba(45, 212, 191, 0.3);

		.cta-main {
			font-size: 1.25rem;
			font-weight: 700;
			color: white;
			margin-bottom: 0.5rem;
		}

		.cta-sub {
			font-size: 1.125rem;
			color: rgba(255, 255, 255, 0.85);
			margin: 0;
		}
	}

	/* Founder Section */
	.founder-section {
		margin-bottom: 4rem;
	}

	.founder-grid {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 2rem;
		align-items: start;
		margin-bottom: 2rem;
	}

	.founder-story {
		background: var(--bg-surface);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 20%, transparent);
		border-radius: 12px;
		padding: 1.5rem;

		h3 {
			font-size: 1.25rem;
			font-weight: 700;
			color: var(--text-primary);
			margin-bottom: 1rem;
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				color: var(--text-secondary);
				margin-bottom: 1rem;
				line-height: 1.6;

				&:last-child {
					margin-bottom: 0;
				}

				strong {
					color: var(--accent-light);
				}
			}
		}
	}

	.founder-image {
		display: flex;
		justify-content: center;
	}

	.image-frame {
		background: linear-gradient(
			135deg,
			var(--accent-dark) 0%,
			var(--primary-dark) 50%,
			var(--accent-dark) 100%
		);
		padding: 3px;
		border-radius: 12px;
		box-shadow: 0 0 30px rgba(45, 212, 191, 0.3);

		img {
			display: block;
			width: 180px;
			height: auto;
			border-radius: 10px;
			background: var(--bg-deep);
		}

		.founder-name {
			display: block;
			text-align: center;
			font-size: 0.875rem;
			color: var(--text-secondary);
			padding: 0.75rem;
			background: var(--bg-deep);
			border-radius: 0 0 10px 10px;
			margin-top: -4px;
		}
	}

	.social-links {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	.social-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: var(--bg-surface);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 30%, transparent);
		border-radius: 8px;
		color: var(--text-primary);
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;

		img,
		svg {
			width: 20px;
			height: 20px;
		}

		img {
			filter: brightness(0) invert(1);
		}

		&:hover {
			background: rgba(45, 212, 191, 0.2);
			border-color: rgba(45, 212, 191, 0.5);
			transform: translateY(-2px);
		}
	}

	/* Start Here */
	.start-here {
		background: linear-gradient(135deg, rgba(45, 212, 191, 0.1) 0%, var(--bg-surface) 100%);
		border: 1px solid rgba(45, 212, 191, 0.2);
		border-radius: 16px;
		padding: 2.5rem 2rem;
		margin-bottom: 3rem;
	}

	.cta-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;

		&.two-col {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.cta-card {
		background: var(--bg-deep);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 15%, transparent);
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

		&.primary {
			border-color: rgba(45, 212, 191, 0.3);
		}

		h3 {
			font-size: 1.125rem;
			font-weight: 700;
			color: var(--text-primary);
			margin-bottom: 0.5rem;
		}

		p {
			font-size: 0.875rem;
			color: var(--text-tertiary);
			margin-bottom: 1.25rem;
		}
	}

	.cta-button {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--accent-dark) 100%);
		border-radius: 8px;
		color: white;
		font-weight: 700;
		text-decoration: none;
		box-shadow: 0 0 20px rgba(45, 212, 191, 0.3);
		transition: all 0.2s ease;

		&.secondary {
			background: transparent;
			border: 2px solid var(--primary-dark);
			box-shadow: none;

			&:hover {
				background: rgba(45, 212, 191, 0.15);
				box-shadow: 0 0 20px rgba(45, 212, 191, 0.2);
			}
		}

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 0 30px rgba(45, 212, 191, 0.5);
		}
	}

	.coaching-hint {
		text-align: center;
		font-size: 0.9375rem;
		color: var(--text-tertiary);
		margin-top: 1.25rem;

		a {
			color: var(--accent-light);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
				color: var(--primary-lightest);
			}
		}
	}

	/* Final Quote */
	.final-quote {
		background: var(--bg-base);
		border: 1px solid rgba(45, 212, 191, 0.3);
		border-radius: 12px;
		padding: 2.5rem 2rem;
		text-align: center;
		margin-bottom: 3rem;
		box-shadow: 0 0 40px rgba(45, 212, 191, 0.15);

		.quote-main {
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--text-primary);
			margin-bottom: 0.5rem;
		}

		.quote-sub {
			font-size: 1.125rem;
			color: var(--text-secondary);
			margin: 0;
		}
	}

	/* Contact */
	.contact-section {
		background: linear-gradient(135deg, var(--bg-deep) 0%, rgba(45, 212, 191, 0.08) 100%);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 20%, transparent);
		border-radius: 12px;
		padding: 2rem;
		text-align: center;

		h3 {
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--accent-light);
			margin-bottom: 0.5rem;
		}

		> p {
			font-size: 1.125rem;
			color: var(--text-secondary);
			margin-bottom: 1.5rem;
		}
	}

	.contact-btn {
		padding: 0.875rem 2rem;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--accent-dark) 100%);
		border: none;
		border-radius: 8px;
		color: white;
		font-size: 1.125rem;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 0 20px rgba(45, 212, 191, 0.3);
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 0 30px rgba(45, 212, 191, 0.5);
		}
	}

	.email-info {
		p {
			font-size: 1.125rem;
			color: var(--text-primary);
			margin-bottom: 0;

			a {
				color: var(--accent-light);
				text-decoration: underline;

				&:hover {
					color: var(--primary-lightest);
				}
			}
		}
	}

	/* Responsive */
	@media (max-width: 768px) {
		.about-page {
			padding: 1.5rem 1rem 3rem;
		}

		.hero h1 {
			font-size: 1.875rem;
		}

		.hero-subtitle {
			font-size: 1.0625rem;
		}

		.section-title {
			font-size: 1.5rem;
		}

		.centers-grid {
			grid-template-columns: 1fr;
		}

		.steps-grid {
			grid-template-columns: 1fr;
		}

		.comparison {
			grid-template-columns: 1fr;
		}

		.founder-grid {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.founder-image {
			order: -1;
		}

		.cta-grid,
		.cta-grid.two-col {
			grid-template-columns: 1fr;
		}

		.start-here {
			padding: 2rem 1.25rem;
		}

		.final-quote {
			padding: 2rem 1.25rem;

			.quote-main {
				font-size: 1.25rem;
			}
		}

		.social-links {
			flex-direction: column;
			align-items: center;
		}

		.social-btn {
			width: 100%;
			max-width: 200px;
			justify-content: center;
		}
	}

	@media (max-width: 480px) {
		.hero h1 {
			font-size: 1.5rem;
		}

		.problem-card {
			padding: 1.5rem;

			h2 {
				font-size: 1.25rem;
			}

			p {
				font-size: 1rem;
			}
		}

		.step-card {
			padding: 1.25rem;
		}

		.example-q-text {
			font-size: 1.0625rem;
		}

		.image-frame img {
			width: 150px;
		}
	}
</style>
