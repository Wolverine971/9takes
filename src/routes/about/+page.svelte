<!-- src/routes/about/+page.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import twitter from '$lib/images/twitter.svg';

	let showEmail = false;
</script>

<svelte:head>
	<title>About 9takes - Where You See Through 9 Different Lenses</title>
	<meta
		name="description"
		content="9takes uses the Enneagram to break you out of your perspective bubble. See how 9 personality types answer the same question differently."
	/>
	<meta name="author" content="9takes" />
	<link rel="canonical" href="https://9takes.com/about" />

	<!-- Open Graph -->
	<meta property="og:title" content="About 9takes - One Situation, 9 Ways to See It" />
	<meta
		property="og:description"
		content="9takes shows you HOW different personality types see the same situation. Break out of your perspective bubble."
	/>
	<meta property="og:image" content="https://9takes.com/brand/aero.png" />
	<meta property="og:url" content="https://9takes.com/about" />
	<meta property="og:type" content="website" />

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
			"image": "https://9takes.com/brand/djface.png",
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
		<div class="hero-glow" />
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
				9takes flips the script: you share YOUR perspective first, then see how 8 other personality
				types answered the same question.
			</p>
		</div>
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
					<li>Context changes everything.</li>
				</ul>
			</div>

			<div class="step-card">
				<div class="step-number">3</div>
				<h3>Discover Your Blindspots</h3>
				<p>Real questions, not engagement bait</p>
				<ul>
					<li>Every question shows you 8 angles you missed.</li>
					<li>That's the value.</li>
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

	<!-- Why This Matters -->
	<section class="why-matters">
		<h2 class="section-title">Why This Matters</h2>

		<div class="benefits-grid">
			<div class="benefit-card" style="--accent: #3b82f6;">
				<h3>Relationships</h3>
				<p>Most fights are perspective clashes, not value differences</p>
			</div>
			<div class="benefit-card" style="--accent: #8b5cf6;">
				<h3>Work</h3>
				<p>The best teams combine multiple thinking styles</p>
			</div>
			<div class="benefit-card" style="--accent: #10b981;">
				<h3>Self-Awareness</h3>
				<p>You can't see your own blindspots without other lenses</p>
			</div>
			<div class="benefit-card" style="--accent: #f59e0b;">
				<h3>Decisions</h3>
				<p>Better choices come from considering more angles</p>
			</div>
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
					<img src="/brand/djface.png" alt="DJ Wayne, Founder of 9takes" />
					<span class="founder-name">DJ Wayne, Founder</span>
				</div>
			</div>
		</div>

		<div class="social-links">
			<a href="https://twitter.com/djwayne3" target="_blank" rel="noreferrer" class="social-btn">
				<img src={twitter} alt="" />
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

	<!-- Roadmap -->
	<section class="roadmap">
		<h2 class="section-title">Where This Is Going</h2>

		<div class="timeline">
			<div class="timeline-item">
				<div class="timeline-marker">1</div>
				<div class="timeline-content">
					<h3>Now</h3>
					<p>Help individuals see what they've been missing</p>
				</div>
			</div>
			<div class="timeline-item">
				<div class="timeline-marker">2</div>
				<div class="timeline-content">
					<h3>Next</h3>
					<p>Change how teams and couples resolve conflict</p>
				</div>
			</div>
			<div class="timeline-item">
				<div class="timeline-marker">3</div>
				<div class="timeline-content">
					<h3>Eventually</h3>
					<p>Make perspective-taking a skill everyone practices</p>
				</div>
			</div>
			<div class="timeline-item highlight">
				<div class="timeline-marker glow">*</div>
				<div class="timeline-content">
					<h3>The End Game</h3>
					<p>Normalize looking through multiple lenses before deciding</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Start Here CTA -->
	<section class="start-here">
		<h2 class="section-title">Start Here</h2>

		<div class="cta-grid">
			<div class="cta-card">
				<h3>See the 9 Perspectives</h3>
				<p>Watch how different types answer real questions</p>
				<a href="/questions" class="cta-button">Browse Questions</a>
			</div>
			<div class="cta-card">
				<h3>Learn the Patterns</h3>
				<p>Understand why people think the way they do</p>
				<a href="/enneagram-corner" class="cta-button">Read the Guides</a>
			</div>
			<div class="cta-card">
				<h3>Get Personal Help</h3>
				<p>1-on-1 coaching to work through your blindspots</p>
				<a href="/book-session" class="cta-button">Book a Session</a>
			</div>
		</div>
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
			<button type="button" class="contact-btn" on:click={() => (showEmail = true)}>
				Get in Touch
			</button>
		{:else}
			<div class="email-info">
				<p>
					<strong>Questions & Coaching:</strong>
					<a href="mailto:dj@9takes.com">dj@9takes.com</a>
				</p>
				<p>
					<strong>Support:</strong>
					<a href="mailto:userSup@9takes.com">userSup@9takes.com</a>
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
		color: #e2e8f0;
	}

	/* Section Title */
	.section-title {
		font-size: 1.875rem;
		font-weight: 700;
		color: #a78bfa;
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
		background: radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
		pointer-events: none;
	}

	.hero h1 {
		position: relative;
		font-size: 2.5rem;
		font-weight: 800;
		color: #f1f5f9;
		margin-bottom: 1.5rem;
		line-height: 1.2;
	}

	.gradient-text {
		background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #6d28d9 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-subtitle {
		position: relative;
		font-size: 1.25rem;
		color: #94a3b8;
		line-height: 1.6;

		strong {
			color: #f1f5f9;
		}
	}

	/* Problem Section */
	.problem-section {
		margin-bottom: 4rem;
	}

	.problem-card {
		background: linear-gradient(135deg, rgba(127, 29, 29, 0.3) 0%, rgba(154, 52, 18, 0.2) 100%);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 12px;
		padding: 2rem;

		h2 {
			font-size: 1.5rem;
			font-weight: 700;
			color: #f1f5f9;
			margin-bottom: 1rem;
		}

		p {
			font-size: 1.125rem;
			color: #cbd5e1;
			line-height: 1.7;
			margin-bottom: 1rem;
		}

		.solution {
			color: #a78bfa;
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
		background: #16161e;
		border: 1px solid rgba(100, 116, 139, 0.2);
		border-radius: 12px;
		padding: 1.5rem;
		transition: all 0.3s ease;

		&:hover {
			border-color: rgba(124, 58, 237, 0.4);
			box-shadow: 0 0 20px rgba(124, 58, 237, 0.1);
		}

		h3 {
			font-size: 1.125rem;
			font-weight: 700;
			color: #f1f5f9;
			margin-bottom: 0.75rem;
		}

		p {
			font-size: 0.9375rem;
			color: #94a3b8;
			margin-bottom: 0.75rem;
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				font-size: 0.8125rem;
				color: #64748b;
				margin-bottom: 0.25rem;
			}
		}
	}

	.step-number {
		width: 48px;
		height: 48px;
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 700;
		color: white;
		margin-bottom: 1rem;
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
	}

	/* Comparison */
	.comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		background: #0f0f14;
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
			background: rgba(127, 29, 29, 0.3);
			border: 1px solid rgba(239, 68, 68, 0.3);

			h4 {
				color: #f87171;
			}
			p {
				color: rgba(252, 165, 165, 0.8);
			}
		}

		&.good {
			background: rgba(6, 78, 59, 0.3);
			border: 1px solid rgba(16, 185, 129, 0.3);

			h4 {
				color: #34d399;
			}
			p {
				color: rgba(167, 243, 208, 0.8);
			}
		}
	}

	/* Why Matters */
	.why-matters {
		margin-bottom: 4rem;
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.benefit-card {
		background: rgba(var(--accent-rgb, 139, 92, 246), 0.1);
		border-left: 4px solid var(--accent);
		border-radius: 0 8px 8px 0;
		padding: 1.25rem;

		h3 {
			font-size: 1rem;
			font-weight: 700;
			color: var(--accent);
			margin-bottom: 0.5rem;
		}

		p {
			font-size: 0.9375rem;
			color: #94a3b8;
			margin: 0;
		}
	}

	.cta-banner {
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		border-radius: 12px;
		padding: 2rem;
		text-align: center;
		box-shadow: 0 0 40px rgba(124, 58, 237, 0.3);

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
		background: #16161e;
		border: 1px solid rgba(100, 116, 139, 0.2);
		border-radius: 12px;
		padding: 1.5rem;

		h3 {
			font-size: 1.25rem;
			font-weight: 700;
			color: #f1f5f9;
			margin-bottom: 1rem;
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				color: #94a3b8;
				margin-bottom: 1rem;
				line-height: 1.6;

				&:last-child {
					margin-bottom: 0;
				}

				strong {
					color: #a78bfa;
				}
			}
		}
	}

	.founder-image {
		display: flex;
		justify-content: center;
	}

	.image-frame {
		background: linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #6d28d9 100%);
		padding: 3px;
		border-radius: 12px;
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.3);

		img {
			display: block;
			width: 180px;
			height: auto;
			border-radius: 10px;
			background: #12121a;
		}

		.founder-name {
			display: block;
			text-align: center;
			font-size: 0.875rem;
			color: #94a3b8;
			padding: 0.75rem;
			background: #12121a;
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
		background: #1a1a2e;
		border: 1px solid rgba(100, 116, 139, 0.3);
		border-radius: 8px;
		color: #e2e8f0;
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
			background: rgba(124, 58, 237, 0.2);
			border-color: rgba(124, 58, 237, 0.5);
			transform: translateY(-2px);
		}
	}

	/* Roadmap */
	.roadmap {
		margin-bottom: 4rem;
	}

	.timeline {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 500px;
		margin: 0 auto;
	}

	.timeline-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.timeline-marker {
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		background: rgba(124, 58, 237, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: #a78bfa;

		&.glow {
			background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
			color: white;
			box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
		}
	}

	.timeline-content {
		padding-top: 0.25rem;

		h3 {
			font-size: 1rem;
			font-weight: 700;
			color: #f1f5f9;
			margin-bottom: 0.25rem;
		}

		p {
			font-size: 0.9375rem;
			color: #94a3b8;
			margin: 0;
		}
	}

	/* Start Here */
	.start-here {
		background: linear-gradient(135deg, rgba(88, 28, 135, 0.2) 0%, #16161e 100%);
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: 16px;
		padding: 2.5rem 2rem;
		margin-bottom: 3rem;
	}

	.cta-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.cta-card {
		background: #0f0f14;
		border: 1px solid rgba(100, 116, 139, 0.15);
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

		h3 {
			font-size: 1.125rem;
			font-weight: 700;
			color: #f1f5f9;
			margin-bottom: 0.5rem;
		}

		p {
			font-size: 0.875rem;
			color: #64748b;
			margin-bottom: 1.25rem;
		}
	}

	.cta-button {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		border-radius: 8px;
		color: white;
		font-weight: 700;
		text-decoration: none;
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
		}
	}

	/* Final Quote */
	.final-quote {
		background: #0a0a0f;
		border: 1px solid rgba(124, 58, 237, 0.3);
		border-radius: 12px;
		padding: 2.5rem 2rem;
		text-align: center;
		margin-bottom: 3rem;
		box-shadow: 0 0 40px rgba(124, 58, 237, 0.15);

		.quote-main {
			font-size: 1.5rem;
			font-weight: 700;
			color: #f1f5f9;
			margin-bottom: 0.5rem;
		}

		.quote-sub {
			font-size: 1.125rem;
			color: #94a3b8;
			margin: 0;
		}
	}

	/* Contact */
	.contact-section {
		background: linear-gradient(135deg, #12121a 0%, rgba(88, 28, 135, 0.15) 100%);
		border: 1px solid rgba(100, 116, 139, 0.2);
		border-radius: 12px;
		padding: 2rem;
		text-align: center;

		h3 {
			font-size: 1.5rem;
			font-weight: 700;
			color: #a78bfa;
			margin-bottom: 0.5rem;
		}

		> p {
			font-size: 1.125rem;
			color: #94a3b8;
			margin-bottom: 1.5rem;
		}
	}

	.contact-btn {
		padding: 0.875rem 2rem;
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		border: none;
		border-radius: 8px;
		color: white;
		font-size: 1.125rem;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
		}
	}

	.email-info {
		p {
			font-size: 1.125rem;
			color: #e2e8f0;
			margin-bottom: 0.75rem;

			&:last-child {
				margin-bottom: 0;
			}

			strong {
				color: #f1f5f9;
			}

			a {
				color: #a78bfa;
				text-decoration: underline;
				margin-left: 0.5rem;

				&:hover {
					color: #c4b5fd;
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

		.steps-grid {
			grid-template-columns: 1fr;
		}

		.comparison {
			grid-template-columns: 1fr;
		}

		.benefits-grid {
			grid-template-columns: 1fr;
		}

		.founder-grid {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.founder-image {
			order: -1;
		}

		.cta-grid {
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

		.image-frame img {
			width: 150px;
		}
	}
</style>
