<!-- src/routes/about/+page.svelte -->

<script lang="ts">
	import twitter from '$lib/images/twitter.svg';

	let showEmail = $state(false);
</script>

<svelte:head>
	<title>About 9takes - Answer First, See 9 Perspectives</title>
	<meta
		name="description"
		content="9takes uses the Enneagram to help you give your real take first, then compare how nine personality types read the same situation."
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
	<meta property="og:title" content="About 9takes - Answer First, See 9 Perspectives" />
	<meta
		property="og:description"
		content="9takes shows how different Enneagram types read the same situation after you give your own take first."
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
	<meta name="twitter:title" content="About 9takes - Answer First, See 9 Perspectives" />
	<meta
		name="twitter:description"
		content="Give your real take first. Then compare how nine Enneagram types read the same situation."
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
			"name": "About 9takes - Answer First, See 9 Perspectives",
			"description": "9takes uses the Enneagram to show how different personality types see the same situation after you give your own take first.",
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
	<section class="hero">
		<div class="section-badge">
			<span class="badge-dot"></span>
			<span>ABOUT 9TAKES</span>
		</div>
		<h1>Built for the moment your first read is not enough.</h1>
		<p class="hero-subtitle">
			Most online debate rewards the fastest take. 9takes slows the moment down: answer first, then
			compare how other Enneagram types read the same situation.
		</p>
		<div class="hero-actions">
			<a href="/questions" class="btn-primary">Browse Questions</a>
			<a href="/enneagram-corner" class="btn-secondary">Learn the System</a>
		</div>
	</section>

	<section class="opening-grid" aria-label="Why 9takes exists">
		<div class="story-panel problem-panel">
			<h2>The Problem</h2>
			<p>
				Social media turned conversation into performance. Reddit became tribes defending territory.
				Everyone talks. Nobody listens.
			</p>
			<p class="panel-emphasis">
				The takes you see are usually the ones that won the room, not the ones that revealed how
				people actually think.
			</p>
		</div>

		<div class="story-panel mechanic-panel">
			<h2>The Flip</h2>
			<ol class="mechanic-list">
				<li>
					<span>1</span>
					<p>Give your take before the crowd can shape it.</p>
				</li>
				<li>
					<span>2</span>
					<p>Compare answers tagged by Enneagram type.</p>
				</li>
				<li>
					<span>3</span>
					<p>Notice the angles your own wiring tends to miss.</p>
				</li>
			</ol>
		</div>
	</section>

	<section class="example-section">
		<div class="section-kicker">ONE QUESTION, THREE READS</div>
		<h2 class="section-title">How do you handle conflict at work?</h2>

		<div class="example-responses">
			<article class="example-response body-response">
				<div class="example-response-header">
					<span class="type-badge">Type 8</span>
					<span class="center-label">Body / instinct</span>
				</div>
				<p>
					I address it head-on. If something's wrong, I'd rather have an uncomfortable 5-minute
					conversation than let it fester for weeks. Most people avoid conflict because they're
					scared of it. I'm not.
				</p>
			</article>

			<article class="example-response head-response">
				<div class="example-response-header">
					<span class="type-badge">Type 5</span>
					<span class="center-label">Head / analysis</span>
				</div>
				<p>
					I step back and observe the pattern first. Who's actually upset, and about what? Usually
					the stated problem isn't the real problem. I wait until I've mapped out what's actually
					going on before I say anything.
				</p>
			</article>

			<article class="example-response heart-response">
				<div class="example-response-header">
					<span class="type-badge">Type 2</span>
					<span class="center-label">Heart / feeling</span>
				</div>
				<p>
					I check in with both sides privately first. People can't hear solutions when they feel
					unheard. Once everyone feels seen, the actual resolution usually comes together fast.
				</p>
			</article>
		</div>

		<div class="example-footer">
			<p>Same question. Three different emotional lenses. All useful.</p>
			<a href="/questions" class="inline-cta">See real responses</a>
		</div>
	</section>

	<section class="founder-section">
		<div class="founder-copy">
			<div class="section-kicker">THE STORY BEHIND IT</div>
			<h2 class="section-title">Why I built 9takes</h2>
			<div class="founder-story">
				<p>
					In the Marines, I learned to suppress emotions and push forward. Great for combat.
					Terrible for relationships.
				</p>
				<p>
					The Enneagram gave me language for something I kept seeing everywhere: people are not just
					disagreeing about facts. They are processing the same situation through different fears,
					defenses, hopes, and instincts.
				</p>
				<p>
					9takes exists to replace snap judgment with useful curiosity. Give your real take. Then
					look at the same moment through eight other lenses.
				</p>
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
					<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
						/>
					</svg>
					LinkedIn
				</a>
			</div>
		</div>

		<div class="founder-image">
			<img src="/brand/djface.webp" alt="DJ Wayne, Founder of 9takes" />
			<span>DJ Wayne, Founder</span>
		</div>
	</section>

	<section class="enneagram-explainer">
		<div class="section-kicker">THE FRAMEWORK UNDERNEATH</div>
		<h2 class="section-title">The Enneagram tracks emotional patterning.</h2>
		<p class="explainer-intro">
			The Enneagram is rooted in three core emotional centers: <strong>anger</strong>,
			<strong>fear</strong>, and <strong>shame</strong>. Everyone has access to all three, but one
			center usually leads the way.
		</p>

		<div class="centers-grid">
			<article class="center-panel body-center">
				<span class="center-mark">8 / 9 / 1</span>
				<h3>Body Center</h3>
				<p>Instinct, control, autonomy, boundaries, anger.</p>
			</article>
			<article class="center-panel head-center">
				<span class="center-mark">5 / 6 / 7</span>
				<h3>Head Center</h3>
				<p>Risk, certainty, options, planning, fear.</p>
			</article>
			<article class="center-panel heart-center">
				<span class="center-mark">2 / 3 / 4</span>
				<h3>Heart Center</h3>
				<p>Connection, identity, value, image, shame.</p>
			</article>
		</div>

		<p class="explainer-link">
			Nine types. Three centers. One way to understand why the same situation lands so differently.
			<a href="/enneagram-corner/enneagram-concepts">Learn the full system</a>
		</p>
	</section>

	<section class="why-matters">
		<h2 class="section-title">The question is not whether you have blindspots.</h2>
		<p>
			You do. Everyone does. The useful question is whether you can stay curious long enough to find
			them.
		</p>
	</section>

	<section class="start-here">
		<div class="section-kicker">START HERE</div>
		<h2 class="section-title">Pick the path that fits today.</h2>

		<div class="cta-grid">
			<article class="cta-card primary">
				<h3>See the 9 perspectives</h3>
				<p>Answer real questions and compare how different types respond.</p>
				<a href="/questions" class="btn-primary">Browse Questions</a>
			</article>
			<article class="cta-card">
				<h3>Learn the patterns</h3>
				<p>Understand the types, centers, instincts, and blind spots.</p>
				<a href="/enneagram-corner" class="btn-secondary">Read the Guides</a>
			</article>
		</div>
		<p class="coaching-hint">
			For personal guidance applying this work, <a href="/book-session"
				>join the 1-on-1 coaching waitlist</a
			>.
		</p>
	</section>

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
		--about-surface: color-mix(in srgb, var(--bg-surface) 82%, var(--bg-base));
		--about-surface-strong: color-mix(in srgb, var(--bg-surface) 92%, var(--bg-deep));
		--about-border: color-mix(in srgb, var(--primary) 18%, var(--border-color));
		--about-border-strong: color-mix(in srgb, var(--primary) 38%, var(--border-color));
		--about-rose-border: color-mix(in srgb, var(--secondary) 28%, var(--border-color));
		--about-shadow: 0 14px 30px color-mix(in srgb, var(--shadow-color) 42%, transparent);

		max-width: 1120px;
		margin: 0 auto;
		padding: 4rem 1rem 4.5rem;
		color: var(--text-primary);
	}

	.about-page,
	.about-page * {
		letter-spacing: 0;
	}

	.about-page section {
		margin-bottom: 4rem;
	}

	.about-page a,
	.about-page button {
		&:focus-visible {
			outline: 2px solid var(--primary);
			outline-offset: 3px;
		}
	}

	.section-badge,
	.section-kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--primary);
		text-transform: uppercase;
	}

	.section-badge {
		padding: 0.35rem 0.75rem;
		background: var(--primary-subtle);
		border: 1px solid color-mix(in srgb, var(--primary) 18%, transparent);
		border-radius: 4px;
	}

	.badge-dot {
		width: 5px;
		height: 5px;
		background: var(--primary);
		border-radius: 50%;
		box-shadow: 0 0 8px var(--primary);
	}

	.section-title {
		margin: 0 0 1rem;
		font-family: var(--font-display);
		font-size: 2.15rem;
		font-weight: 700;
		line-height: 1.15;
		color: var(--text-primary);
	}

	.hero {
		max-width: 780px;
		margin: 0 auto 4rem;
		padding: 3.25rem 0 1rem;
		text-align: center;
	}

	.hero h1 {
		margin: 0 auto 1rem;
		max-width: 760px;
		font-family: var(--font-display);
		font-size: 3.35rem;
		font-weight: 700;
		line-height: 1.06;
		color: var(--text-primary);
		text-wrap: balance;
	}

	.hero-subtitle {
		max-width: 650px;
		margin: 0 auto;
		font-size: 1.08rem;
		line-height: 1.7;
		color: var(--text-secondary);
		text-wrap: pretty;
	}

	.hero-actions,
	.social-links,
	.example-footer,
	.cta-grid {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.hero-actions,
	.example-footer {
		justify-content: center;
	}

	.hero-actions {
		margin-top: 1.35rem;
	}

	.btn-primary,
	.btn-secondary,
	.contact-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.9rem;
		padding: 0.85rem 1.35rem;
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease,
			box-shadow 180ms ease;
	}

	.btn-primary,
	.contact-btn {
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
		color: var(--text-on-primary);
		box-shadow: 0 10px 24px color-mix(in srgb, var(--primary) 16%, transparent);
	}

	.btn-secondary {
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 25%, transparent);
		background: color-mix(in srgb, var(--bg-deep) 86%, transparent);
		color: var(--text-secondary);
	}

	.btn-primary:hover,
	.btn-secondary:hover,
	.contact-btn:hover {
		transform: translateY(-2px);
	}

	.btn-primary:hover,
	.contact-btn:hover {
		background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
		box-shadow: 0 14px 30px color-mix(in srgb, var(--primary) 22%, transparent);
	}

	.btn-secondary:hover {
		border-color: color-mix(in srgb, var(--primary) 38%, transparent);
		background: var(--primary-subtle);
		color: var(--primary);
	}

	.opening-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
		gap: 1rem;
	}

	.story-panel,
	.example-response,
	.center-panel,
	.cta-card,
	.contact-section,
	.why-matters {
		background: linear-gradient(180deg, var(--about-surface-strong) 0%, var(--about-surface) 100%);
		border: 1px solid var(--about-border);
		border-radius: 8px;
		box-shadow: var(--about-shadow);
	}

	.story-panel {
		padding: 1.5rem;

		h2 {
			margin: 0 0 0.8rem;
			font-family: var(--font-display);
			font-size: 1.55rem;
			font-weight: 700;
			line-height: 1.2;
			color: var(--text-primary);
		}

		p {
			margin: 0;
			font-size: 1rem;
			line-height: 1.65;
			color: var(--text-secondary);
		}
	}

	.problem-panel {
		border-color: var(--about-rose-border);
	}

	.panel-emphasis {
		margin-top: 1rem !important;
		color: color-mix(in srgb, var(--secondary) 72%, var(--text-primary)) !important;
		font-weight: 700;
	}

	.mechanic-list {
		display: grid;
		gap: 0.85rem;
		margin: 0;
		padding: 0;
		list-style: none;

		li {
			display: grid;
			grid-template-columns: 2rem minmax(0, 1fr);
			gap: 0.75rem;
			align-items: center;
		}

		span {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 2rem;
			height: 2rem;
			background: color-mix(in srgb, var(--primary) 18%, var(--bg-deep));
			border: 1px solid color-mix(in srgb, var(--primary) 36%, transparent);
			border-radius: 8px;
			color: var(--primary);
			font-family: var(--font-mono);
			font-size: 0.85rem;
			font-weight: 700;
		}

		p {
			line-height: 1.5;
		}
	}

	.example-section {
		text-align: center;
	}

	.example-responses {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-top: 1.4rem;
		text-align: left;
	}

	.example-response {
		--type-color: var(--primary);
		padding: 1.25rem;
		border-color: color-mix(in srgb, var(--type-color) 32%, var(--border-color));

		p {
			margin: 0;
			font-size: 0.94rem;
			line-height: 1.6;
			color: var(--text-secondary);
		}
	}

	.body-response {
		--type-color: var(--pillar-gut);
	}

	.head-response {
		--type-color: var(--pillar-head);
	}

	.heart-response {
		--type-color: var(--pillar-heart);
	}

	.example-response-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.85rem;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.65rem;
		border: 1px solid color-mix(in srgb, var(--type-color) 60%, transparent);
		border-radius: 6px;
		color: var(--type-color);
		font-family: var(--font-mono);
		font-size: 0.74rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.center-label {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-tertiary);
		text-transform: uppercase;
	}

	.example-footer {
		margin-top: 1.25rem;

		p {
			margin: 0;
			color: var(--text-secondary);
		}
	}

	.inline-cta,
	.explainer-link a,
	.coaching-hint a,
	.email-info a {
		color: var(--primary);
		font-weight: 700;
		text-decoration: none;
	}

	.inline-cta:hover,
	.explainer-link a:hover,
	.coaching-hint a:hover,
	.email-info a:hover {
		color: var(--primary-light);
		text-decoration: underline;
	}

	.founder-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 240px;
		gap: 1.5rem;
		align-items: start;
	}

	.founder-copy {
		min-width: 0;
	}

	.founder-story {
		display: grid;
		gap: 1rem;

		p {
			margin: 0;
			font-size: 1rem;
			line-height: 1.7;
			color: var(--text-secondary);
		}
	}

	.founder-image {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background: var(--about-surface);
		border: 1px solid var(--about-border);
		border-radius: 8px;
		box-shadow: var(--about-shadow);

		img {
			width: 100%;
			aspect-ratio: 4 / 5;
			object-fit: cover;
			background: var(--bg-deep);
		}

		span {
			padding: 0.75rem;
			font-family: var(--font-mono);
			font-size: 0.78rem;
			color: var(--text-secondary);
			text-align: center;
		}
	}

	.social-links {
		margin-top: 1.25rem;
	}

	.social-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 2.65rem;
		padding: 0.65rem 1rem;
		background: color-mix(in srgb, var(--bg-surface) 76%, transparent);
		border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--border-color));
		border-radius: 8px;
		color: var(--text-primary);
		font-size: 0.9rem;
		font-weight: 700;
		text-decoration: none;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease;

		img,
		svg {
			width: 1.1rem;
			height: 1.1rem;
		}

		img {
			filter: brightness(0) saturate(100%) invert(44%) sepia(86%) saturate(511%) hue-rotate(131deg)
				brightness(95%) contrast(91%);
		}
	}

	.social-btn:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--primary) 38%, var(--border-color));
		background: var(--primary-subtle);
	}

	.enneagram-explainer {
		text-align: center;
	}

	.explainer-intro {
		max-width: 720px;
		margin: 0 auto 1.5rem;
		font-size: 1rem;
		line-height: 1.7;
		color: var(--text-secondary);

		strong {
			color: var(--primary);
		}
	}

	.centers-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		text-align: left;
	}

	.center-panel {
		--center-color: var(--primary);
		padding: 1.25rem;
		border-color: color-mix(in srgb, var(--center-color) 28%, var(--border-color));

		h3 {
			margin: 0.45rem 0 0.45rem;
			font-family: var(--font-display);
			font-size: 1.15rem;
			color: var(--text-primary);
		}

		p {
			margin: 0;
			font-size: 0.92rem;
			line-height: 1.55;
			color: var(--text-secondary);
		}
	}

	.body-center {
		--center-color: var(--pillar-gut);
	}

	.head-center {
		--center-color: var(--pillar-head);
	}

	.heart-center {
		--center-color: var(--pillar-heart);
	}

	.center-mark {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--center-color);
	}

	.explainer-link {
		max-width: 720px;
		margin: 1.25rem auto 0;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.why-matters {
		max-width: 760px;
		margin-left: auto;
		margin-right: auto;
		padding: 2rem;
		text-align: center;
		border-color: var(--about-border-strong);

		.section-title {
			margin-bottom: 0.75rem;
		}

		p {
			margin: 0 auto;
			max-width: 560px;
			font-size: 1rem;
			line-height: 1.7;
			color: var(--text-secondary);
		}
	}

	.start-here {
		text-align: center;
	}

	.cta-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		margin-top: 1.25rem;
		text-align: left;
	}

	.cta-card {
		padding: 1.25rem;

		h3 {
			margin: 0 0 0.45rem;
			font-family: var(--font-display);
			font-size: 1.25rem;
			color: var(--text-primary);
		}

		p {
			margin: 0 0 1rem;
			color: var(--text-secondary);
			line-height: 1.55;
		}
	}

	.cta-card.primary {
		border-color: var(--about-border-strong);
	}

	.coaching-hint {
		max-width: 34rem;
		margin: 1.1rem auto 0;
		font-size: 0.9rem;
		line-height: 1.55;
		color: var(--text-tertiary);
	}

	.contact-section {
		max-width: 640px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;

		h3 {
			margin: 0 0 0.4rem;
			font-family: var(--font-display);
			font-size: 1.5rem;
			color: var(--text-primary);
		}

		> p {
			margin: 0 0 1.25rem;
			color: var(--text-secondary);
		}
	}

	.email-info p {
		margin: 0;
		font-size: 1rem;
	}

	@media (max-width: 900px) {
		.about-page {
			padding-top: 3rem;
		}

		.hero h1 {
			font-size: 2.65rem;
		}

		.opening-grid,
		.founder-section {
			grid-template-columns: 1fr;
		}

		.founder-image {
			order: -1;
			width: min(240px, 100%);
			margin: 0 auto;
		}
	}

	@media (max-width: 700px) {
		.about-page {
			padding: 2.25rem 1rem 3.25rem;
		}

		.about-page section {
			margin-bottom: 3rem;
		}

		.hero {
			padding-top: 2rem;
			margin-bottom: 3rem;
		}

		.hero h1 {
			font-size: 2.15rem;
		}

		.hero-subtitle {
			font-size: 0.98rem;
			line-height: 1.65;
		}

		.hero-actions,
		.example-footer,
		.social-links {
			flex-direction: column;
			align-items: stretch;
		}

		.hero-actions .btn-primary,
		.hero-actions .btn-secondary,
		.social-btn,
		.contact-btn {
			width: 100%;
		}

		.section-title {
			font-size: 1.65rem;
		}

		.story-panel,
		.example-response,
		.center-panel,
		.cta-card,
		.contact-section,
		.why-matters {
			padding: 1.15rem;
		}

		.example-responses,
		.centers-grid,
		.cta-grid {
			grid-template-columns: 1fr;
		}

		.example-section,
		.enneagram-explainer,
		.start-here {
			text-align: left;
		}

		.example-footer {
			align-items: flex-start;
		}
	}

	@media (max-width: 420px) {
		.hero h1 {
			font-size: 1.9rem;
		}

		.mechanic-list li {
			grid-template-columns: 1.8rem minmax(0, 1fr);
		}

		.mechanic-list span {
			width: 1.8rem;
			height: 1.8rem;
		}
	}
</style>
