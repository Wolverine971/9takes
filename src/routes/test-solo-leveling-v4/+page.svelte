<!-- src/routes/test-solo-leveling-v4/+page.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import type { FamousPerson } from './+page.server';

	let { data }: { data: PageData } = $props();
	let innerWidth = $state(0);
	let loaded = $state(false);
	let observer: IntersectionObserver | null = null;
	let sectionsVisible = $state(Array(7).fill(browser ? false : true));

	// The 9 Shadow Types with colors
	const shadowTypes: Record<
		number,
		{ name: string; title: string; color: string; coreEmotion: string }
	> = {
		1: {
			name: 'The Perfectionist',
			title: 'Knight of Order',
			color: '#a8dadc',
			coreEmotion: 'Anger'
		},
		2: { name: 'The Helper', title: 'Heart Guardian', color: '#ff6b6b', coreEmotion: 'Shame' },
		3: { name: 'The Achiever', title: 'Victory Blade', color: '#fbbf24', coreEmotion: 'Shame' },
		4: { name: 'The Individualist', title: 'Soul Weaver', color: '#c084fc', coreEmotion: 'Shame' },
		5: { name: 'The Investigator', title: 'Mind Phantom', color: '#22d3ee', coreEmotion: 'Fear' },
		6: { name: 'The Loyalist', title: 'Iron Guard', color: '#64748b', coreEmotion: 'Fear' },
		7: { name: 'The Enthusiast', title: 'Storm Rider', color: '#fb923c', coreEmotion: 'Fear' },
		8: { name: 'The Challenger', title: 'War Commander', color: '#ef4444', coreEmotion: 'Anger' },
		9: { name: 'The Peacemaker', title: 'Harmony Sage', color: '#4ade80', coreEmotion: 'Anger' }
	};

	// Benefits/How it works content
	const benefits = [
		{
			icon: '?',
			title: 'Give Your Take First',
			description:
				'Answer questions before seeing others. Get your authentic perspective without groupthink bias.',
			stat: 'INT',
			boost: '+15'
		},
		{
			icon: '9',
			title: 'See 9 Perspectives',
			description: 'Discover how each personality type approaches the same situation differently.',
			stat: 'PER',
			boost: '+20'
		},
		{
			icon: '!',
			title: 'Spot Your Blind Spots',
			description:
				'Understand your patterns, triggers, and superpowers through the Enneagram lens.',
			stat: 'WIS',
			boost: '+25'
		},
		{
			icon: '*',
			title: 'Decode People',
			description:
				'Learn to read others by understanding the emotional logic behind their behavior.',
			stat: 'CHA',
			boost: '+30'
		}
	];

	function getTransition() {
		return { y: 30, duration: 500, delay: 100 };
	}

	function setupIntersectionObserver() {
		if (!browser || typeof IntersectionObserver === 'undefined') {
			sectionsVisible = Array(7).fill(true);
			return;
		}

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = parseInt(entry.target.getAttribute('data-section-index') || '0');
						if (!isNaN(index) && index >= 0 && index < sectionsVisible.length) {
							sectionsVisible[index] = true;
						}
					}
				});
			},
			{ threshold: 0.1, rootMargin: '50px 0px' }
		);

		setTimeout(() => {
			const sections = document.querySelectorAll('.section-observer');
			sections.forEach((section, idx) => {
				section.setAttribute('data-section-index', idx.toString());
				observer?.observe(section);
			});
		}, 100);
	}

	onMount(() => {
		loaded = true;
		tick().then(() => {
			setupIntersectionObserver();
		});

		const handleResize = () => {
			innerWidth = window.innerWidth;
		};
		window.addEventListener('resize', handleResize, { passive: true });

		return () => {
			observer?.disconnect();
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<svelte:head>
	<title>9takes | See the Emotions Behind Every Take</title>
	<meta name="robots" content="noindex, nofollow" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<svelte:window bind:innerWidth />

<div class="sl-page">
	<!-- Background layers -->
	<div class="bg-void"></div>
	<div class="bg-ambient"></div>
	<div class="bg-grid"></div>

	<!-- Floating particles -->
	<div class="particles" aria-hidden="true">
		{#each Array(12) as _, i}
			<div
				class="particle"
				style="--delay: {i * 0.8}s; --x: {8 + Math.random() * 84}%; --size: {2 +
					Math.random() * 2}px; --duration: {20 + Math.random() * 10}s;"
			></div>
		{/each}
	</div>

	<main class="content">
		<!-- ========== HERO SECTION ========== -->
		{#if loaded}
			<section class="hero" in:fly={getTransition()}>
				<div class="hero-inner">
					<!-- Tagline badge -->
					<div class="tagline-badge" in:fade={{ delay: 200, duration: 400 }}>
						<span class="badge-glow"></span>
						<span class="badge-text">One situation, 9 ways to see it</span>
					</div>

					<h1 class="hero-title">
						<span class="title-line">See the</span>
						<span class="title-glow">Emotions Behind</span>
						<span class="title-line">Every Take</span>
					</h1>

					<p class="hero-desc">
						Decode social dynamics. Personality-max your EQ. Turn conflict into understanding.
					</p>
				</div>

				<!-- Daily Quest Card -->
				<a href={`/questions/${data.questionOfTheDay?.url}`} class="quest-card">
					<div class="quest-header">
						<div class="quest-badge">
							<span class="quest-icon">!</span>
							<span class="quest-label">TODAY'S QUESTION</span>
						</div>
						<div class="quest-responses">
							<span class="response-count">{data.questionOfTheDay?.comment_count || 0}</span>
							<span class="response-label">responses</span>
						</div>
					</div>

					<h2 class="quest-title">
						{data.questionOfTheDay ? data.questionOfTheDay.question_formatted : 'Loading...'}
					</h2>

					<div class="quest-cta">
						<span class="cta-text">Give Your Take</span>
						<span class="cta-arrow">→</span>
					</div>
				</a>

				<!-- Secondary actions -->
				<div class="hero-actions">
					<a href="/questions" class="btn-system">Browse All Questions</a>
				</div>

				<p class="hero-note">Free to join. No personality test required.</p>
			</section>
		{:else}
			<div class="hero-placeholder"></div>
		{/if}

		<!-- ========== 9 TYPES SHOWCASE ========== -->
		<div class="section-observer">
			{#if sectionsVisible[0] || !browser}
				<section class="section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge">
							<span class="badge-dot"></span>
							<span>THE 9 PERSPECTIVES</span>
						</div>
						<h2 class="section-title">Master the 9 Types</h2>
						<p class="section-desc">
							Each personality type sees different details. Learn their patterns, decode people
							faster.
						</p>
					</header>

					<div class="types-grid">
						{#each data.typeRepresentatives as person, i}
							{@const typeNum = person.type}
							{@const typeInfo = shadowTypes[typeNum]}
							<a
								href={person.hasLink
									? `/personality-analysis/${person.name}`
									: `/enneagram-corner/enneagram-type-${typeNum}`}
								class="type-card"
								style="--type-color: {typeInfo.color}"
							>
								<div class="card-bg"></div>
								<div class="card-content">
									<div class="type-number">{typeNum}</div>

									<div class="avatar-wrap">
										{#if person.hasImage}
											<img
												src={`/types/${typeNum}s/s-${person.name}.webp`}
												alt={person.name.split('-').join(' ')}
												class="avatar"
												loading={i < 3 ? 'eager' : 'lazy'}
											/>
										{:else}
											<div class="avatar-placeholder">
												<span>{typeNum}</span>
											</div>
										{/if}
									</div>

									<div class="type-info">
										<span class="type-title">{typeInfo.title}</span>
										<span class="type-name">{typeInfo.name}</span>
									</div>

									<div class="type-meta">
										<span class="meta-label">Core:</span>
										<span class="meta-value">{typeInfo.coreEmotion}</span>
									</div>
								</div>
							</a>
						{/each}
					</div>

					<div class="section-cta">
						<a
							href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
							class="btn-system"
						>
							Find Your Type →
						</a>
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== FEATURED CELEBRITY PROFILES ========== -->
		<div class="section-observer">
			{#if sectionsVisible[1] || !browser}
				<section class="section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge accent">
							<span class="badge-dot"></span>
							<span>PERSONALITY ANALYSIS</span>
						</div>
						<h2 class="section-title">Learn Through Famous Examples</h2>
						<p class="section-desc">
							See how the Enneagram explains why people think, feel, and act the way they do.
						</p>
					</header>

					<div class="profiles-grid">
						{#each data.featuredPeople as featuredPerson}
							{@const typeInfo = shadowTypes[featuredPerson.enneagram]}
							<a
								href={`/personality-analysis/${featuredPerson.person}`}
								class="profile-card"
								style="--type-color: {typeInfo?.color || '#7c3aed'}"
							>
								<div class="profile-image">
									<img
										src={`/types/${featuredPerson.enneagram}s/s-${featuredPerson.person}.webp`}
										alt={featuredPerson.person.split('-').join(' ')}
										loading="lazy"
									/>
									<div class="profile-overlay"></div>
									<span class="profile-type">Type {featuredPerson.enneagram}</span>
								</div>
								<div class="profile-info">
									<h3 class="profile-name">{featuredPerson.person.split('-').join(' ')}</h3>
									<span class="profile-title">{typeInfo?.name || 'Unknown Type'}</span>
								</div>
							</a>
						{/each}
					</div>

					<div class="section-cta">
						<a href="/personality-analysis" class="btn-shadow">
							<span>Explore All Profiles</span>
						</a>
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== HOW IT WORKS ========== -->
		<div class="section-observer">
			{#if sectionsVisible[2] || !browser}
				<section class="section how-section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge">
							<span class="badge-dot"></span>
							<span>HOW IT WORKS</span>
						</div>
						<h2 class="section-title">Level Up Your EQ</h2>
						<p class="section-desc">
							Perspective-taking is the mental gym. Each new viewpoint is a rep.
						</p>
					</header>

					<div class="benefits-grid">
						{#each benefits as benefit, i}
							<div class="benefit-card">
								<div class="benefit-header">
									<div class="benefit-icon">{benefit.icon}</div>
									<div class="benefit-stat">
										<span class="stat-label">{benefit.stat}</span>
										<span class="stat-boost">{benefit.boost}</span>
									</div>
								</div>
								<h3 class="benefit-title">{benefit.title}</h3>
								<p class="benefit-desc">{benefit.description}</p>
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== WHY ENNEAGRAM ========== -->
		<div class="section-observer">
			{#if sectionsVisible[3] || !browser}
				<section class="feature-section" in:fly={getTransition()}>
					<div class="feature-inner">
						<h2 class="feature-title">
							Why the <span class="text-glow">Enneagram</span>?
						</h2>

						<p class="feature-text">
							Your brain defaults to <span class="text-system">one lens</span>, missing 8 others.
							The Enneagram maps the core motivations that drive how people filter reality.
						</p>

						<!-- Enneagram Visual -->
						<div class="enneagram-visual">
							<div class="enneagram-ring">
								{#each Array(9) as _, i}
									{@const typeColor = shadowTypes[i + 1].color}
									<div class="ring-node" style="--i: {i}; --node-color: {typeColor}">
										<span>{i + 1}</span>
									</div>
								{/each}
								<div class="ring-center">
									<div class="center-pulse"></div>
									<span class="center-icon">◈</span>
								</div>
							</div>
						</div>

						<div class="feature-points">
							<div class="point">
								<span class="point-icon">▸</span>
								<span>Not behavior. <strong>Motivation.</strong></span>
							</div>
							<div class="point">
								<span class="point-icon">▸</span>
								<span>Not stereotypes. <strong>Patterns.</strong></span>
							</div>
							<div class="point">
								<span class="point-icon">▸</span>
								<span>Not labels. <strong>Lenses.</strong></span>
							</div>
						</div>
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== COACHING SECTION ========== -->
		<div class="section-observer">
			{#if sectionsVisible[4] || !browser}
				<section class="section" in:fly={getTransition()}>
					<div class="coaching-card">
						<div class="coaching-glow"></div>
						<div class="coaching-content">
							<div class="coaching-badge">
								<span class="badge-icon">★</span>
								<span>1-ON-1 SESSIONS</span>
							</div>

							<h2 class="coaching-title">Ready to Go Deeper?</h2>

							<p class="coaching-desc">
								Apply Enneagram insights directly to your situation. Personalized coaching for
								relationships, career decisions, or personal growth.
							</p>

							<ul class="coaching-features">
								<li>
									<span class="feature-check">✓</span>
									<span>Identify your type with precision</span>
								</li>
								<li>
									<span class="feature-check">✓</span>
									<span>Map your triggers and growth edges</span>
								</li>
								<li>
									<span class="feature-check">✓</span>
									<span>Decode specific relationships or conflicts</span>
								</li>
							</ul>

							<a href="/book-session" class="btn-shadow lg">
								<span>Book a Session</span>
							</a>

							<p class="coaching-note">Join the waitlist for personalized Enneagram coaching</p>
						</div>
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== FINAL CTA ========== -->
		{#if !data?.user}
			<div class="section-observer">
				{#if sectionsVisible[5] || !browser}
					<section class="final-section" in:fly={getTransition()}>
						<div class="final-glow"></div>
						<div class="final-inner">
							<div class="final-badge">
								<span class="badge-pulse"></span>
								<span>START HERE</span>
							</div>

							<h2 class="final-title">
								Begin Your <span class="text-glow">Journey</span>
							</h2>

							<p class="final-desc">Give your take. See 9 perspectives. Build understanding.</p>

							<div class="final-actions">
								<a href="/questions" class="btn-shadow lg">
									<span>Answer Today's Question</span>
								</a>
								<a href="/register" class="btn-system">Create Free Account</a>
							</div>
						</div>
					</section>
				{/if}
			</div>
		{/if}
	</main>
</div>

<style>
	/* ==========================================
	   CSS VARIABLES
	   ========================================== */
	.sl-page {
		/* Void */
		--void-abyss: #05050a;
		--void-shadow: #0a0a12;
		--void-umbra: #12121c;
		--void-penumbra: #1a1a28;

		/* Text */
		--text-pale: #e8e8f0;
		--text-mist: #9898a8;
		--text-faded: #585868;

		/* Shadow Power */
		--shadow-monarch: #7c3aed;
		--shadow-flame: #a855f7;
		--shadow-deep: #5b21b6;
		--shadow-ethereal: #c084fc;

		/* System */
		--system-interface: #3b82f6;
		--system-hologram: #60a5fa;
		--system-stream: #93c5fd;
		--system-deep: #1d4ed8;

		/* Status */
		--status-gold: #f59e0b;
		--status-gold-bright: #fbbf24;
		--status-success: #14b8a6;

		/* Fonts */
		--font-display: 'Rajdhani', sans-serif;
		--font-body: 'Space Grotesk', sans-serif;
		--font-mono: 'JetBrains Mono', monospace;

		/* Transitions */
		--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* ==========================================
	   BASE LAYOUT
	   ========================================== */
	.sl-page {
		position: relative;
		min-height: 100vh;
		background: var(--void-abyss);
		color: var(--text-pale);
		font-family: var(--font-body);
		overflow-x: hidden;
	}

	.content {
		position: relative;
		z-index: 10;
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	/* ==========================================
	   BACKGROUNDS
	   ========================================== */
	.bg-void {
		position: fixed;
		inset: 0;
		background: var(--void-abyss);
		z-index: 0;
	}

	.bg-ambient {
		position: fixed;
		inset: 0;
		background:
			radial-gradient(ellipse at 25% 0%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
			radial-gradient(ellipse at 75% 100%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
		z-index: 1;
		pointer-events: none;
	}

	.bg-grid {
		position: fixed;
		inset: 0;
		background-image:
			linear-gradient(rgba(124, 58, 237, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(124, 58, 237, 0.02) 1px, transparent 1px);
		background-size: 60px 60px;
		z-index: 2;
		pointer-events: none;
	}

	/* Particles */
	.particles {
		position: fixed;
		inset: 0;
		z-index: 3;
		pointer-events: none;
		overflow: hidden;
	}

	.particle {
		position: absolute;
		width: var(--size);
		height: var(--size);
		background: var(--shadow-ethereal);
		border-radius: 50%;
		left: var(--x);
		bottom: -20px;
		opacity: 0;
		animation: particle-rise var(--duration) linear infinite;
		animation-delay: var(--delay);
	}

	@keyframes particle-rise {
		0% {
			transform: translateY(0);
			opacity: 0;
		}
		5% {
			opacity: 0.4;
		}
		95% {
			opacity: 0.4;
		}
		100% {
			transform: translateY(-105vh);
			opacity: 0;
		}
	}

	/* ==========================================
	   TEXT UTILITIES
	   ========================================== */
	.text-glow {
		color: var(--shadow-flame);
		text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
	}

	.text-system {
		color: var(--system-hologram);
		text-shadow: 0 0 15px rgba(96, 165, 250, 0.5);
	}

	/* ==========================================
	   HERO SECTION
	   ========================================== */
	.hero {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5rem 0 3rem;
		text-align: center;
	}

	.hero-placeholder {
		height: 100vh;
	}

	.hero-inner {
		max-width: 700px;
		margin-bottom: 2rem;
	}

	.tagline-badge {
		position: relative;
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: 6px;
		margin-bottom: 1.5rem;
		overflow: hidden;
	}

	.badge-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
		animation: badge-pulse 3s ease-in-out infinite;
	}

	@keyframes badge-pulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}

	.badge-text {
		position: relative;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--shadow-ethereal);
		letter-spacing: 0.05em;
	}

	.hero-title {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 8vw, 4.5rem);
		font-weight: 700;
		line-height: 1.1;
		margin-bottom: 1rem;
	}

	.title-line {
		display: block;
		color: var(--text-pale);
	}

	.title-glow {
		display: block;
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--system-interface) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 0 30px rgba(124, 58, 237, 0.4));
	}

	.hero-desc {
		font-size: clamp(1rem, 2vw, 1.125rem);
		color: var(--text-mist);
		max-width: 500px;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* Quest Card */
	.quest-card {
		display: block;
		width: 100%;
		max-width: 600px;
		padding: 1.5rem;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: 16px;
		margin-bottom: 1.5rem;
		text-decoration: none;
		box-shadow:
			0 0 40px rgba(124, 58, 237, 0.1),
			inset 0 1px 0 rgba(124, 58, 237, 0.1);
		transition: all 300ms var(--ease-out);
	}

	.quest-card:hover {
		border-color: rgba(124, 58, 237, 0.4);
		box-shadow:
			0 0 60px rgba(124, 58, 237, 0.2),
			inset 0 1px 0 rgba(124, 58, 237, 0.15);
		transform: translateY(-4px);
	}

	.quest-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.quest-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.quest-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		background: var(--shadow-deep);
		color: var(--shadow-flame);
		border-radius: 4px;
		font-weight: 700;
		font-size: 0.9rem;
	}

	.quest-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--shadow-flame);
		letter-spacing: 0.08em;
	}

	.quest-responses {
		display: flex;
		align-items: baseline;
		gap: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-mist);
	}

	.response-count {
		color: var(--system-hologram);
		font-weight: 600;
	}

	.quest-title {
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 3vw, 1.5rem);
		font-weight: 600;
		color: var(--text-pale);
		line-height: 1.35;
		margin-bottom: 1rem;
		text-align: left;
	}

	.quest-cta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: linear-gradient(135deg, var(--shadow-deep) 0%, var(--shadow-monarch) 100%);
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: white;
	}

	.cta-arrow {
		transition: transform 200ms ease;
	}

	.quest-card:hover .cta-arrow {
		transform: translateX(4px);
	}

	/* Hero Actions */
	.hero-actions {
		margin-bottom: 1rem;
	}

	.hero-note {
		font-size: 0.85rem;
		color: var(--text-faded);
	}

	/* ==========================================
	   BUTTONS
	   ========================================== */
	.btn-shadow {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.875rem 1.75rem;
		background: linear-gradient(135deg, var(--shadow-deep) 0%, var(--shadow-monarch) 100%);
		border: none;
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: white;
		text-decoration: none;
		cursor: pointer;
		overflow: hidden;
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
		transition: all 250ms var(--ease-out);
	}

	.btn-shadow:hover {
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-flame) 100%);
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
		transform: translateY(-2px);
	}

	.btn-shadow.lg {
		padding: 1rem 2rem;
		font-size: 1.05rem;
	}

	.btn-shadow::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
		transition: left 400ms ease;
	}

	.btn-shadow:hover::after {
		left: 100%;
	}

	.btn-system {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.875rem 1.75rem;
		background: transparent;
		border: 1px solid rgba(59, 130, 246, 0.35);
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--system-hologram);
		text-decoration: none;
		cursor: pointer;
		transition: all 250ms var(--ease-out);
	}

	.btn-system:hover {
		background: rgba(59, 130, 246, 0.08);
		border-color: var(--system-hologram);
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
	}

	/* ==========================================
	   SECTIONS
	   ========================================== */
	.section {
		padding: 4rem 0;
	}

	.section-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.section-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.15);
		border-radius: 4px;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--system-hologram);
	}

	.section-badge.accent {
		background: rgba(124, 58, 237, 0.08);
		border-color: rgba(124, 58, 237, 0.15);
		color: var(--shadow-flame);
	}

	.section-badge.accent .badge-dot {
		background: var(--shadow-flame);
		box-shadow: 0 0 8px var(--shadow-monarch);
	}

	.badge-dot {
		width: 5px;
		height: 5px;
		background: var(--system-hologram);
		border-radius: 50%;
		box-shadow: 0 0 8px var(--system-interface);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 0.5rem;
	}

	.section-desc {
		font-size: 1rem;
		color: var(--text-mist);
		max-width: 500px;
		margin: 0 auto;
	}

	.section-cta {
		text-align: center;
		margin-top: 2.5rem;
	}

	/* ==========================================
	   9 TYPES GRID
	   ========================================== */
	.types-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.types-grid {
			gap: 1rem;
		}
	}

	.type-card {
		--type-color: var(--shadow-monarch);
		position: relative;
		display: block;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid color-mix(in srgb, var(--type-color) 15%, transparent);
		border-radius: 12px;
		padding: 1rem;
		text-decoration: none;
		overflow: hidden;
		transition: all 250ms var(--ease-out);
	}

	.type-card:hover {
		border-color: color-mix(in srgb, var(--type-color) 40%, transparent);
		box-shadow: 0 0 30px color-mix(in srgb, var(--type-color) 20%, transparent);
		transform: translateY(-4px);
	}

	.card-bg {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at 50% 0%,
			color-mix(in srgb, var(--type-color) 10%, transparent) 0%,
			transparent 60%
		);
		opacity: 0;
		transition: opacity 250ms ease;
	}

	.type-card:hover .card-bg {
		opacity: 1;
	}

	.card-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.type-number {
		position: absolute;
		top: -0.5rem;
		left: -0.5rem;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--type-color) 15%, var(--void-abyss));
		border: 1px solid color-mix(in srgb, var(--type-color) 40%, transparent);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--type-color);
	}

	.avatar-wrap {
		margin: 0.5rem 0;
	}

	.avatar {
		width: 4rem;
		height: 4rem;
		object-fit: cover;
		border-radius: 50%;
		border: 2px solid var(--type-color);
		box-shadow: 0 0 15px color-mix(in srgb, var(--type-color) 35%, transparent);
	}

	@media (min-width: 640px) {
		.avatar {
			width: 5rem;
			height: 5rem;
		}
	}

	.avatar-placeholder {
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--void-penumbra);
		border-radius: 50%;
		border: 2px solid var(--type-color);
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--type-color);
	}

	@media (min-width: 640px) {
		.avatar-placeholder {
			width: 5rem;
			height: 5rem;
		}
	}

	.type-info {
		margin-top: 0.5rem;
	}

	.type-title {
		display: none;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--type-color);
		letter-spacing: 0.04em;
		margin-bottom: 0.15rem;
	}

	@media (min-width: 640px) {
		.type-title {
			display: block;
		}
	}

	.type-name {
		font-size: 0.75rem;
		color: var(--text-pale);
	}

	@media (min-width: 640px) {
		.type-name {
			font-size: 0.85rem;
		}
	}

	.type-meta {
		display: none;
		margin-top: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.6rem;
	}

	@media (min-width: 640px) {
		.type-meta {
			display: block;
		}
	}

	.meta-label {
		color: var(--text-faded);
	}

	.meta-value {
		color: var(--type-color);
		font-weight: 600;
	}

	/* ==========================================
	   CELEBRITY PROFILES GRID
	   ========================================== */
	.profiles-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.profiles-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
		}
	}

	.profile-card {
		--type-color: var(--shadow-monarch);
		display: block;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(59, 130, 246, 0.1);
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		transition: all 250ms var(--ease-out);
	}

	.profile-card:hover {
		border-color: color-mix(in srgb, var(--type-color) 35%, transparent);
		box-shadow: 0 0 25px color-mix(in srgb, var(--type-color) 15%, transparent);
		transform: translateY(-4px);
	}

	.profile-image {
		position: relative;
		height: 140px;
		overflow: hidden;
	}

	@media (min-width: 640px) {
		.profile-image {
			height: 180px;
		}
	}

	.profile-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 350ms ease;
	}

	.profile-card:hover .profile-image img {
		transform: scale(1.05);
	}

	.profile-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 40%, var(--void-abyss) 100%);
	}

	.profile-type {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.2rem 0.5rem;
		background: color-mix(in srgb, var(--type-color) 20%, var(--void-shadow));
		border: 1px solid color-mix(in srgb, var(--type-color) 40%, transparent);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		color: var(--type-color);
	}

	.profile-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--void-penumbra);
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 700;
		color: var(--type-color);
	}

	.profile-info {
		padding: 0.875rem;
	}

	.profile-name {
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-pale);
		text-transform: capitalize;
		margin-bottom: 0.15rem;
	}

	@media (min-width: 640px) {
		.profile-name {
			font-size: 1rem;
		}
	}

	.profile-title {
		font-size: 0.75rem;
		color: var(--text-mist);
	}

	/* ==========================================
	   BENEFITS GRID
	   ========================================== */
	.how-section {
		background: linear-gradient(180deg, var(--void-umbra) 0%, var(--void-abyss) 100%);
		border-radius: 20px;
		margin: 1rem 0;
	}

	.benefits-grid {
		display: grid;
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.benefits-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.25rem;
		}
	}

	.benefit-card {
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(59, 130, 246, 0.1);
		border-radius: 12px;
		padding: 1.25rem;
		transition: all 250ms var(--ease-out);
	}

	.benefit-card:hover {
		border-color: rgba(59, 130, 246, 0.3);
		box-shadow: 0 0 25px rgba(59, 130, 246, 0.1);
	}

	.benefit-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.benefit-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: var(--system-deep);
		border-radius: 6px;
		font-family: var(--font-mono);
		font-size: 1rem;
		font-weight: 700;
		color: var(--system-hologram);
	}

	.benefit-stat {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-label {
		padding: 0.2rem 0.4rem;
		background: var(--void-penumbra);
		border-radius: 3px;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		color: var(--system-hologram);
	}

	.stat-boost {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--shadow-flame);
	}

	.benefit-title {
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--text-pale);
		margin-bottom: 0.4rem;
	}

	.benefit-desc {
		font-size: 0.85rem;
		color: var(--text-mist);
		line-height: 1.5;
	}

	/* ==========================================
	   FEATURE SECTION (Why Enneagram)
	   ========================================== */
	.feature-section {
		margin: 2rem 0;
		border-radius: 20px;
		background: linear-gradient(
			135deg,
			rgba(124, 58, 237, 0.08) 0%,
			rgba(59, 130, 246, 0.08) 50%,
			var(--void-umbra) 100%
		);
		border: 1px solid rgba(124, 58, 237, 0.15);
	}

	.feature-inner {
		padding: 3rem 1.5rem;
		text-align: center;
	}

	@media (min-width: 640px) {
		.feature-inner {
			padding: 4rem 2rem;
		}
	}

	.feature-title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 1rem;
	}

	.feature-text {
		font-size: 1rem;
		color: var(--text-mist);
		max-width: 550px;
		margin: 0 auto 2rem;
		line-height: 1.6;
	}

	/* Enneagram Visual */
	.enneagram-visual {
		margin: 2rem 0;
	}

	.enneagram-ring {
		position: relative;
		width: 220px;
		height: 220px;
		margin: 0 auto;
		border: 2px solid rgba(124, 58, 237, 0.15);
		border-radius: 50%;
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.08);
	}

	@media (min-width: 640px) {
		.enneagram-ring {
			width: 280px;
			height: 280px;
		}
	}

	.ring-node {
		--angle: calc(var(--i) * 40deg - 90deg);
		--node-color: var(--shadow-monarch);
		position: absolute;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--void-shadow);
		border: 2px solid var(--node-color);
		border-radius: 50%;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--node-color);
		top: 50%;
		left: 50%;
		transform: rotate(var(--angle)) translate(110px) rotate(calc(-1 * var(--angle)));
		box-shadow: 0 0 12px color-mix(in srgb, var(--node-color) 40%, transparent);
		transition: all 250ms ease;
	}

	@media (min-width: 640px) {
		.ring-node {
			transform: rotate(var(--angle)) translate(140px) rotate(calc(-1 * var(--angle)));
		}
	}

	.ring-node:hover {
		background: color-mix(in srgb, var(--node-color) 15%, var(--void-shadow));
		box-shadow: 0 0 20px color-mix(in srgb, var(--node-color) 50%, transparent);
		z-index: 10;
	}

	.ring-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--shadow-deep) 0%, var(--shadow-monarch) 100%);
		border-radius: 50%;
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
	}

	.center-pulse {
		position: absolute;
		inset: -10px;
		border: 2px solid var(--shadow-ethereal);
		border-radius: 50%;
		animation: center-pulse 2.5s ease-in-out infinite;
	}

	@keyframes center-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.3);
			opacity: 0;
		}
	}

	.center-icon {
		font-size: 1.25rem;
		color: white;
	}

	.feature-points {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 300px;
		margin: 0 auto;
	}

	.point {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.95rem;
		color: var(--text-mist);
	}

	.point-icon {
		color: var(--shadow-flame);
	}

	.point strong {
		color: var(--text-pale);
	}

	/* ==========================================
	   COACHING SECTION
	   ========================================== */
	.coaching-card {
		position: relative;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(245, 158, 11, 0.2);
		border-radius: 20px;
		overflow: hidden;
	}

	.coaching-glow {
		position: absolute;
		top: -50%;
		left: 50%;
		transform: translateX(-50%);
		width: 120%;
		height: 100%;
		background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.1) 0%, transparent 60%);
		pointer-events: none;
	}

	.coaching-content {
		position: relative;
		padding: 2.5rem 1.5rem;
		text-align: center;
	}

	@media (min-width: 640px) {
		.coaching-content {
			padding: 3.5rem 2rem;
		}
	}

	.coaching-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid rgba(245, 158, 11, 0.2);
		border-radius: 4px;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--status-gold-bright);
	}

	.badge-icon {
		font-size: 0.8rem;
	}

	.coaching-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 0.75rem;
	}

	.coaching-desc {
		font-size: 1rem;
		color: var(--text-mist);
		max-width: 500px;
		margin: 0 auto 1.5rem;
		line-height: 1.6;
	}

	.coaching-features {
		list-style: none;
		padding: 0;
		margin: 0 auto 1.5rem;
		max-width: 350px;
		text-align: left;
	}

	.coaching-features li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		font-size: 0.9rem;
		color: var(--text-mist);
	}

	.feature-check {
		color: var(--status-gold-bright);
		font-weight: 700;
	}

	.coaching-note {
		margin-top: 1rem;
		font-size: 0.8rem;
		color: var(--text-faded);
	}

	/* ==========================================
	   FINAL CTA SECTION
	   ========================================== */
	.final-section {
		position: relative;
		margin: 2rem 0 4rem;
		border-radius: 20px;
		background: linear-gradient(
			135deg,
			rgba(124, 58, 237, 0.12) 0%,
			rgba(59, 130, 246, 0.12) 50%,
			var(--void-umbra) 100%
		);
		border: 1px solid rgba(124, 58, 237, 0.25);
		overflow: hidden;
	}

	.final-glow {
		position: absolute;
		top: -40%;
		left: 50%;
		transform: translateX(-50%);
		width: 140%;
		height: 100%;
		background: radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 60%);
		pointer-events: none;
	}

	.final-inner {
		position: relative;
		padding: 3rem 1.5rem;
		text-align: center;
	}

	@media (min-width: 640px) {
		.final-inner {
			padding: 4rem 2rem;
		}
	}

	.final-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: rgba(124, 58, 237, 0.1);
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: 4px;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--shadow-flame);
	}

	.badge-pulse {
		width: 6px;
		height: 6px;
		background: var(--shadow-flame);
		border-radius: 50%;
		animation: pulse-dot 1.5s ease-in-out infinite;
	}

	@keyframes pulse-dot {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	.final-title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 0.5rem;
	}

	.final-desc {
		font-size: 1rem;
		color: var(--text-mist);
		margin-bottom: 1.5rem;
	}

	.final-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	@media (min-width: 480px) {
		.final-actions {
			flex-direction: row;
		}
	}

	/* ==========================================
	   REDUCED MOTION
	   ========================================== */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.001ms !important;
			transition-duration: 0.001ms !important;
		}
	}
</style>
