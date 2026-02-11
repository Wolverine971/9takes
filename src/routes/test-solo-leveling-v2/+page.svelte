<!-- src/routes/test-solo-leveling-v2/+page.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	export let data: PageData;
	let innerWidth = 0;
	let loaded = false;
	let observer: IntersectionObserver;

	let sectionsVisible = Array(5).fill(browser ? false : true);

	// 9 personality archetypes with shadow power theme
	const shadowTypes: Record<number, { name: string; title: string; power: string }> = {
		1: { name: 'The Perfectionist', title: 'Knight of Order', power: 'Precision Strike' },
		2: { name: 'The Helper', title: 'Heart Guardian', power: 'Soul Shield' },
		3: { name: 'The Achiever', title: 'Victory Blade', power: 'Relentless Drive' },
		4: { name: 'The Individualist', title: 'Soul Weaver', power: 'Emotional Depth' },
		5: { name: 'The Investigator', title: 'Mind Phantom', power: 'Knowledge Sight' },
		6: { name: 'The Loyalist', title: 'Iron Guard', power: 'Unwavering Defense' },
		7: { name: 'The Enthusiast', title: 'Storm Chaser', power: 'Boundless Energy' },
		8: { name: 'The Challenger', title: 'War Commander', power: 'Domination Aura' },
		9: { name: 'The Peacemaker', title: 'Harmony Sage', power: 'Calm Presence' }
	};

	const featuredArticles = [
		{
			id: '1',
			title: 'How Each Enneagram Type Flexes',
			excerpt: 'Revealing secret needs for recognition',
			image: '/blogs/greek-statue-flex.webp',
			url: '/enneagram-corner/how-each-enneagram-flexes',
			difficulty: 'B-RANK'
		},
		{
			id: '2',
			title: 'Toxic Traits of Each Type',
			excerpt: 'When strengths become weaknesses',
			image: '/blogs/greek-statue-showing-cracks.webp',
			url: '/enneagram-corner/toxic-traits-of-each-enneagram-type',
			difficulty: 'A-RANK'
		},
		{
			id: '3',
			title: 'Workplace Team Building',
			excerpt: 'Leverage personality differences',
			image: '/blogs/greek-statues-working-in-teams.webp',
			url: '/enneagram-corner/enneagram-workplace-team-building',
			difficulty: 'B-RANK'
		},
		{
			id: '4',
			title: 'First Impression Cheat Sheet',
			excerpt: 'Essential approaches for authentic connections',
			image: '/blogs/greek-statue-taking-notes.webp',
			url: '/enneagram-corner/first-impression-cheat-sheet',
			difficulty: 'C-RANK'
		}
	];

	const benefits = [
		{
			title: 'Stress-Test Your Ideas',
			description:
				'Give your take, then unlock 9 different perspectives. Catch blind spots before they catch you.',
			stat: 'INT',
			level: '+15'
		},
		{
			title: 'Escape Your Bubble',
			description:
				'See how 9 personality types read the same situation. Map hidden motives—no more guesswork.',
			stat: 'PER',
			level: '+20'
		},
		{
			title: 'Personality-Max Your Stats',
			description:
				"Know your type's strengths and blind spots. Turn cognitive weaknesses into advantages.",
			stat: 'WIS',
			level: '+25'
		},
		{
			title: 'Level-Up with Coaching',
			description:
				'Ready to go deeper? Book a 1-on-1 session and apply insights directly to your situation.',
			stat: 'ALL',
			level: '+10'
		}
	];

	function getTransition(index: number) {
		return { y: 40, duration: 600, delay: 100 };
	}

	function setupIntersectionObserver() {
		if (!browser || typeof IntersectionObserver === 'undefined') {
			sectionsVisible = Array(5).fill(true);
			return;
		}

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = parseInt(entry.target.getAttribute('data-section-index') || '0');
						if (!isNaN(index) && index >= 0 && index < sectionsVisible.length) {
							sectionsVisible[index] = true;
							sectionsVisible = [...sectionsVisible];
						}
					}
				});
			},
			{ threshold: 0.1, rootMargin: '50px 0px' }
		);

		setTimeout(() => {
			const sections = document.querySelectorAll('.section-observer');
			sections.forEach((section, index) => {
				section.setAttribute('data-section-index', index.toString());
				observer.observe(section);
			});
		}, 100);
	}

	onMount(async () => {
		loaded = true;
		await tick();
		setupIntersectionObserver();
		window.addEventListener(
			'resize',
			() => {
				innerWidth = window.innerWidth;
			},
			{ passive: true }
		);
		return () => {
			if (observer) observer.disconnect();
		};
	});

	const famousByType = Array(9)
		.fill(null)
		.map((_, index) => {
			const typeNumber = index + 1;
			const peopleOfType = data.images.filter((person) => person.type === typeNumber);
			return peopleOfType.length > 0 ? peopleOfType[0] : null;
		});

	// Calculate user "level" based on question responses (mock)
	$: userLevel = 1;
	$: xpProgress = 35;
</script>

<svelte:head>
	<title>9takes | Awaken Your EQ</title>
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
	<div class="void-bg"></div>
	<div class="grid-overlay"></div>
	<div class="scanlines"></div>

	<!-- Floating particles -->
	<div class="particles">
		{#each Array(20) as _, i}
			<div
				class="particle"
				style="--delay: {i * 0.5}s; --x: {Math.random() * 100}%; --duration: {15 +
					Math.random() * 10}s;"
			></div>
		{/each}
	</div>

	<div class="content-wrapper">
		<!-- Hero Section -->
		{#if loaded}
			<section class="hero" in:fly={getTransition(0)}>
				<!-- System Status Bar -->
				<div class="system-bar" in:fade={{ delay: 200, duration: 400 }}>
					<div class="system-bar-left">
						<span class="status-indicator"></span>
						<span class="status-text">SYSTEM ONLINE</span>
					</div>
					<div class="system-bar-right">
						<span class="level-badge">LV.{userLevel}</span>
						<div class="xp-bar">
							<div class="xp-fill" style="width: {xpProgress}%"></div>
						</div>
						<span class="xp-text">{xpProgress}/100 XP</span>
					</div>
				</div>

				<!-- Main Hero Content -->
				<div class="hero-content">
					<div class="hero-badge" in:fade={{ delay: 300, duration: 500 }}>
						<span class="badge-icon">◆</span>
						<span class="badge-text">NEW PLAYER DETECTED</span>
					</div>

					<h1 class="hero-title">
						<span class="title-line">Awaken Your</span>
						<span class="title-glow">Emotional Intelligence</span>
					</h1>

					<p class="hero-subtitle">
						Stress-test your ideas • Escape your bubble • <span class="highlight"
							>Max your personality</span
						>
					</p>

					<p class="hero-description">
						Give your take, digest other perspectives, escape the hive-mind. See how <span
							class="text-shadow">9 personality types</span
						> can see the same scenario differently.
					</p>
				</div>

				<!-- Quest Card -->
				<a href={`/questions/${data.questionOfTheDay?.url}`} class="quest-card">
					<div class="quest-header">
						<div class="quest-type">
							<span class="quest-icon">!</span>
							<span class="quest-label">DAILY QUEST</span>
						</div>
						<div class="quest-reward">
							<span class="reward-icon">★</span>
							<span class="reward-text">+100 EQ</span>
						</div>
					</div>

					<div class="quest-body">
						<h3 class="quest-title">
							{data.questionOfTheDay ? data.questionOfTheDay.question_formatted : 'Loading...'}
						</h3>
					</div>

					<div class="quest-footer">
						<div class="quest-stats">
							<span class="stat-icon">👥</span>
							<span class="stat-value">{data.questionOfTheDay?.comment_count || 0}</span>
							<span class="stat-label">responses</span>
						</div>
						<button class="quest-accept">
							ACCEPT QUEST
							<span class="btn-arrow">→</span>
						</button>
					</div>
				</a>

				<!-- CTA Buttons -->
				<div class="hero-actions">
					<a href="/questions" class="btn-shadow">
						<span class="btn-content">Enter the Arena</span>
						<span class="btn-shine"></span>
					</a>
					<a href="/register" class="btn-system"> Create Profile </a>
				</div>

				<p class="hero-note">Free to join • No personality test required</p>
			</section>
		{:else}
			<div class="hero-placeholder"></div>
		{/if}

		<!-- Shadow Army Section (9 Types) -->
		<div class="section-observer">
			{#if sectionsVisible[0] || !browser}
				<section class="section" in:fly={getTransition(1)}>
					<div class="section-header">
						<div class="section-badge">
							<span class="badge-dot"></span>
							<span>SHADOW ARMY</span>
						</div>
						<h2 class="section-title">Master the 9 Shadows</h2>
						<p class="section-desc">
							Each personality type sees different details. Learn their patterns.
						</p>
					</div>

					<div class="shadow-grid">
						{#each famousByType as person, i}
							{@const typeNum = i + 1}
							{@const typeInfo = shadowTypes[typeNum]}
							<a
								href={person
									? `/personality-analysis/${person.name}`
									: `/enneagram-corner/enneagram-type-${typeNum}`}
								class="shadow-card"
							>
								<div class="card-glow"></div>
								<div class="card-content">
									<!-- Rank Badge -->
									<div class="rank-badge">
										<span class="rank-num">{typeNum}</span>
									</div>

									<!-- Avatar -->
									<div class="avatar-wrapper">
										{#if person}
											<img
												src={person.image || `/types/${typeNum}s/s-${person.name}.webp`}
												alt={person.name}
												class="avatar-img"
												loading={i < 3 ? 'eager' : 'lazy'}
											/>
										{:else}
											<div class="avatar-placeholder">
												<span>{typeNum}</span>
											</div>
										{/if}
										<div class="avatar-ring"></div>
									</div>

									<!-- Info -->
									<div class="card-info">
										<span class="card-title desktop-only">{typeInfo.title}</span>
										<span class="card-name">
											{person ? person.name.split('-').join(' ') : typeInfo.name}
										</span>
									</div>

									<!-- Power indicator -->
									<div class="power-bar desktop-only">
										<div class="power-fill" style="width: {60 + typeNum * 4}%"></div>
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
							Learn the System →
						</a>
					</div>
				</section>
			{/if}
		</div>

		<!-- Dungeon Section (Articles) -->
		<div class="section-observer">
			{#if sectionsVisible[1] || !browser}
				<section class="section" in:fly={getTransition(2)}>
					<div class="section-header">
						<div class="section-badge">
							<span class="badge-dot danger"></span>
							<span>DUNGEON GATES</span>
						</div>
						<h2 class="section-title">Training Grounds</h2>
						<p class="section-desc">
							Perspective gains are earned, not scrolled. Challenge yourself.
						</p>
					</div>

					<div class="dungeon-grid">
						{#each featuredArticles as article, i}
							<a href={article.url} class="dungeon-card">
								<div class="dungeon-image">
									<img src={article.image} alt={article.title} loading="lazy" />
									<div class="dungeon-overlay"></div>
									<span
										class="dungeon-rank"
										class:a-rank={article.difficulty === 'A-RANK'}
										class:b-rank={article.difficulty === 'B-RANK'}
									>
										{article.difficulty}
									</span>
								</div>
								<div class="dungeon-info">
									<h3 class="dungeon-title">{article.title}</h3>
									<p class="dungeon-excerpt desktop-only">{article.excerpt}</p>
								</div>
								<div class="dungeon-enter">
									<span>ENTER</span>
									<span class="enter-arrow">→</span>
								</div>
							</a>
						{/each}
					</div>

					<div class="section-cta">
						<a href="/enneagram-corner" class="btn-system"> More Dungeons → </a>
					</div>
				</section>
			{/if}
		</div>

		<!-- Power Section (Why It Works) -->
		<div class="section-observer">
			{#if sectionsVisible[2] || !browser}
				<section class="power-section" in:fly={getTransition(3)}>
					<div class="power-inner">
						<h2 class="power-title">
							Why the <span class="text-shadow">Enneagram</span> Works
						</h2>

						<p class="power-text">
							Your brain defaults to <span class="text-system">one lens</span>—missing 8 others. The
							Enneagram maps core motivations that drive how people filter reality.
						</p>

						<div class="power-visual">
							<div class="enneagram-ring">
								{#each Array(9) as _, i}
									<div class="ring-node" style="--i: {i}">
										<span>{i + 1}</span>
									</div>
								{/each}
								<div class="ring-center">
									<div class="center-pulse"></div>
									<span class="center-icon">◈</span>
								</div>
							</div>
						</div>

						<p class="power-quote">
							"Digesting new angles burns mental glucose—<br />
							<span class="text-shadow">but that's where the gains live.</span>"
						</p>
					</div>
				</section>
			{/if}
		</div>

		<!-- Stats Section (How It Works) -->
		<div class="section-observer">
			{#if sectionsVisible[3] || !browser}
				<section class="section" in:fly={getTransition(4)}>
					<div class="section-header">
						<div class="section-badge">
							<span class="badge-dot"></span>
							<span>STAT BOOST</span>
						</div>
						<h2 class="section-title">How It Works</h2>
					</div>

					<div class="stat-grid">
						{#each benefits as benefit, i}
							<div class="stat-card">
								<div class="stat-header">
									<div class="stat-icon-box">
										<span class="stat-type">{benefit.stat}</span>
									</div>
									<div class="stat-boost">
										<span class="boost-value">{benefit.level}</span>
									</div>
								</div>
								<h3 class="stat-title">{benefit.title}</h3>
								<p class="stat-desc">{benefit.description}</p>
								<div class="stat-progress">
									<div class="progress-track">
										<div class="progress-fill" style="width: {25 + i * 20}%"></div>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="section-cta">
						<a href="/book-session" class="btn-shadow">
							<span class="btn-content">Level-Up 1-on-1</span>
							<span class="btn-shine"></span>
						</a>
					</div>
				</section>
			{/if}
		</div>

		<!-- Final CTA -->
		{#if !data?.user}
			<div class="section-observer">
				{#if sectionsVisible[4] || !browser}
					<section class="final-cta" in:fly={getTransition(5)}>
						<div class="cta-glow"></div>
						<div class="cta-content">
							<div class="cta-badge">
								<span class="badge-pulse"></span>
								<span>QUEST AVAILABLE</span>
							</div>
							<h2 class="cta-title">Ready to <span class="text-shadow">Awaken</span>?</h2>
							<p class="cta-desc">
								Start stress-testing your takes. Do the work of growing your perspective.
							</p>
							<div class="cta-actions">
								<a href="/questions" class="btn-shadow large">
									<span class="btn-content">Explore & Give Your Takes</span>
									<span class="btn-shine"></span>
								</a>
								<a href="/register" class="btn-system"> Create Hunter Profile </a>
							</div>
						</div>
					</section>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	/* ========================================
	   CSS VARIABLES (from v2 guide)
	   ======================================== */
	:root {
		/* Void (Backgrounds) */
		--void-deep: #05050a;
		--void-shadow: #0a0a12;
		--void-umbra: #12121c;
		--void-penumbra: #1a1a28;

		/* Text */
		--text-primary: #e8e8f0;
		--text-secondary: #9898a8;
		--text-tertiary: #585868;

		/* Shadow Power (Purple) */
		--shadow-primary: #7c3aed;
		--shadow-bright: #a855f7;
		--shadow-deep: #5b21b6;
		--shadow-glow: #c084fc;

		/* System (Blue) */
		--system-primary: #3b82f6;
		--system-bright: #60a5fa;
		--system-glow: #93c5fd;
		--system-deep: #1d4ed8;

		/* Danger */
		--danger: #dc2626;
		--danger-bright: #f87171;

		/* Portal */
		--portal-cyan: #06b6d4;
		--portal-teal: #14b8a6;

		/* Fonts */
		--font-display: 'Rajdhani', sans-serif;
		--font-body: 'Space Grotesk', sans-serif;
		--font-mono: 'JetBrains Mono', monospace;
	}

	/* ========================================
	   BASE & BACKGROUND
	   ======================================== */
	.sl-page {
		position: relative;
		min-height: 100vh;
		background: var(--void-deep);
		color: var(--text-primary);
		font-family: var(--font-body);
		overflow-x: hidden;
	}

	.void-bg {
		position: fixed;
		inset: 0;
		background: radial-gradient(ellipse at 50% 0%, var(--void-umbra) 0%, var(--void-deep) 70%);
		z-index: 0;
	}

	.grid-overlay {
		position: fixed;
		inset: 0;
		background-image:
			linear-gradient(rgba(124, 58, 237, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(124, 58, 237, 0.03) 1px, transparent 1px);
		background-size: 60px 60px;
		z-index: 1;
		pointer-events: none;
	}

	.scanlines {
		position: fixed;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.05) 0px,
			rgba(0, 0, 0, 0.05) 1px,
			transparent 1px,
			transparent 3px
		);
		z-index: 2;
		pointer-events: none;
		opacity: 0.5;
	}

	/* Particles */
	.particles {
		position: fixed;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		overflow: hidden;
	}

	.particle {
		position: absolute;
		width: 3px;
		height: 3px;
		background: var(--shadow-glow);
		border-radius: 50%;
		left: var(--x);
		bottom: -10px;
		opacity: 0.4;
		animation: float-up var(--duration) linear infinite;
		animation-delay: var(--delay);
	}

	@keyframes float-up {
		0% {
			transform: translateY(0) scale(1);
			opacity: 0;
		}
		10% {
			opacity: 0.4;
		}
		90% {
			opacity: 0.4;
		}
		100% {
			transform: translateY(-100vh) scale(0.5);
			opacity: 0;
		}
	}

	.content-wrapper {
		position: relative;
		z-index: 10;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	/* ========================================
	   TYPOGRAPHY UTILITIES
	   ======================================== */
	.text-shadow {
		color: var(--shadow-bright);
		text-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
	}

	.text-system {
		color: var(--system-bright);
		text-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
	}

	.highlight {
		color: var(--shadow-glow);
	}

	/* ========================================
	   HERO SECTION
	   ======================================== */
	.hero {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem 0;
		text-align: center;
	}

	.hero-placeholder {
		height: 100vh;
	}

	/* System Bar */
	.system-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 600px;
		padding: 0.75rem 1rem;
		background: linear-gradient(135deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 8px;
		margin-bottom: 2rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	.system-bar-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-indicator {
		width: 8px;
		height: 8px;
		background: var(--portal-teal);
		border-radius: 50%;
		box-shadow: 0 0 10px var(--portal-teal);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.status-text {
		color: var(--system-bright);
		letter-spacing: 0.1em;
	}

	.system-bar-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.level-badge {
		padding: 0.25rem 0.5rem;
		background: var(--shadow-deep);
		color: var(--shadow-glow);
		border-radius: 4px;
		font-weight: 700;
	}

	.xp-bar {
		width: 80px;
		height: 6px;
		background: var(--void-penumbra);
		border-radius: 3px;
		overflow: hidden;
	}

	.xp-fill {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--shadow-deep) 0%,
			var(--shadow-primary) 50%,
			var(--shadow-bright) 100%
		);
		box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
		transition: width 500ms ease;
	}

	.xp-text {
		color: var(--text-secondary);
	}

	/* Hero Content */
	.hero-content {
		max-width: 800px;
		margin-bottom: 2rem;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
		border: 1px solid rgba(124, 58, 237, 0.3);
		border-radius: 4px;
		margin-bottom: 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.15em;
	}

	.badge-icon {
		color: var(--shadow-bright);
	}

	.badge-text {
		color: var(--text-primary);
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
		color: var(--text-primary);
	}

	.title-glow {
		display: block;
		background: linear-gradient(135deg, var(--shadow-primary) 0%, var(--system-primary) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 0 30px rgba(124, 58, 237, 0.5));
	}

	.hero-subtitle {
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 3vw, 1.5rem);
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.hero-description {
		font-size: 1rem;
		color: var(--text-secondary);
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* Quest Card */
	.quest-card {
		display: block;
		width: 100%;
		max-width: 700px;
		padding: 1.5rem;
		background: linear-gradient(135deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(59, 130, 246, 0.3);
		border-radius: 12px;
		margin-bottom: 2rem;
		text-decoration: none;
		transition: all 200ms ease;
		box-shadow:
			0 0 20px rgba(59, 130, 246, 0.1),
			inset 0 1px 0 rgba(59, 130, 246, 0.1);
	}

	.quest-card:hover {
		border-color: rgba(59, 130, 246, 0.6);
		transform: translateY(-4px);
		box-shadow:
			0 0 40px rgba(59, 130, 246, 0.2),
			inset 0 1px 0 rgba(59, 130, 246, 0.2);
	}

	.quest-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.quest-type {
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
		background: var(--system-deep);
		color: var(--system-bright);
		border-radius: 4px;
		font-weight: 700;
		font-size: 0.875rem;
	}

	.quest-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--system-bright);
		letter-spacing: 0.1em;
		text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
	}

	.quest-reward {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		background: rgba(124, 58, 237, 0.15);
		border: 1px solid rgba(124, 58, 237, 0.3);
		border-radius: 4px;
	}

	.reward-icon {
		color: var(--shadow-bright);
	}

	.reward-text {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--shadow-glow);
	}

	.quest-body {
		padding: 0.5rem 0;
	}

	.quest-title {
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 3vw, 1.5rem);
		font-weight: 600;
		color: var(--text-primary);
		line-height: 1.3;
	}

	.quest-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid rgba(59, 130, 246, 0.1);
	}

	.quest-stats {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.stat-value {
		color: var(--system-bright);
		font-weight: 600;
	}

	.quest-accept {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid rgba(124, 58, 237, 0.5);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--shadow-bright);
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: all 200ms ease;
	}

	.quest-accept:hover {
		background: rgba(124, 58, 237, 0.2);
		border-color: var(--shadow-bright);
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
	}

	.btn-arrow {
		transition: transform 200ms ease;
	}

	.quest-accept:hover .btn-arrow {
		transform: translateX(4px);
	}

	/* Hero Actions */
	.hero-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	@media (min-width: 480px) {
		.hero-actions {
			flex-direction: row;
		}
	}

	.hero-note {
		font-size: 0.875rem;
		color: var(--text-tertiary);
	}

	/* ========================================
	   BUTTONS
	   ======================================== */
	.btn-shadow {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.875rem 1.75rem;
		background: linear-gradient(135deg, var(--shadow-deep) 0%, var(--shadow-primary) 100%);
		border: none;
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: white;
		text-decoration: none;
		overflow: hidden;
		cursor: pointer;
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
		transition: all 200ms ease;
	}

	.btn-shadow:hover {
		background: linear-gradient(135deg, var(--shadow-primary) 0%, var(--shadow-bright) 100%);
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
		transform: translateY(-2px);
	}

	.btn-shadow.large {
		padding: 1rem 2rem;
		font-size: 1.125rem;
	}

	.btn-content {
		position: relative;
		z-index: 1;
	}

	.btn-shine {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
		transition: left 400ms ease;
	}

	.btn-shadow:hover .btn-shine {
		left: 100%;
	}

	.btn-system {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.875rem 1.75rem;
		background: transparent;
		border: 1px solid rgba(59, 130, 246, 0.4);
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--system-bright);
		text-decoration: none;
		cursor: pointer;
		transition: all 200ms ease;
	}

	.btn-system:hover {
		background: rgba(59, 130, 246, 0.1);
		border-color: var(--system-bright);
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
	}

	/* ========================================
	   SECTIONS
	   ======================================== */
	.section {
		padding: 4rem 0;
	}

	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.section-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		background: rgba(124, 58, 237, 0.1);
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: 4px;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: var(--shadow-bright);
	}

	.badge-dot {
		width: 6px;
		height: 6px;
		background: var(--shadow-bright);
		border-radius: 50%;
		box-shadow: 0 0 10px var(--shadow-primary);
	}

	.badge-dot.danger {
		background: var(--danger);
		box-shadow: 0 0 10px var(--danger);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.section-desc {
		font-size: 1rem;
		color: var(--text-secondary);
		max-width: 500px;
		margin: 0 auto;
	}

	.section-cta {
		text-align: center;
		margin-top: 2.5rem;
	}

	/* ========================================
	   SHADOW GRID (9 Types)
	   ======================================== */
	.shadow-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}

	@media (min-width: 768px) {
		.shadow-grid {
			gap: 1.25rem;
		}
	}

	.shadow-card {
		position: relative;
		display: block;
		background: linear-gradient(135deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(124, 58, 237, 0.15);
		border-radius: 12px;
		padding: 1rem;
		text-decoration: none;
		transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
	}

	.shadow-card:hover {
		border-color: rgba(124, 58, 237, 0.5);
		transform: translateY(-4px);
	}

	.card-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.15) 0%, transparent 60%);
		opacity: 0;
		transition: opacity 250ms ease;
	}

	.shadow-card:hover .card-glow {
		opacity: 1;
	}

	.card-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.rank-badge {
		position: absolute;
		top: -0.5rem;
		left: -0.5rem;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--shadow-deep);
		border: 1px solid var(--shadow-primary);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--shadow-glow);
	}

	.avatar-wrapper {
		position: relative;
		margin: 0.5rem 0;
	}

	.avatar-img {
		width: 4rem;
		height: 4rem;
		object-fit: cover;
		border-radius: 50%;
		border: 2px solid var(--shadow-primary);
	}

	@media (min-width: 768px) {
		.avatar-img {
			width: 6rem;
			height: 6rem;
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
		border: 2px solid var(--shadow-primary);
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--shadow-primary);
	}

	@media (min-width: 768px) {
		.avatar-placeholder {
			width: 6rem;
			height: 6rem;
			font-size: 2rem;
		}
	}

	.avatar-ring {
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 1px solid var(--shadow-glow);
		opacity: 0;
		animation: ring-spin 4s linear infinite;
		transition: opacity 250ms ease;
	}

	.shadow-card:hover .avatar-ring {
		opacity: 0.5;
	}

	@keyframes ring-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.card-info {
		margin-top: 0.5rem;
	}

	.card-title {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		font-weight: 600;
		color: var(--shadow-bright);
		letter-spacing: 0.05em;
		margin-bottom: 0.25rem;
	}

	@media (min-width: 768px) {
		.card-title {
			font-size: 0.75rem;
		}
	}

	.card-name {
		font-size: 0.75rem;
		color: var(--text-primary);
		text-transform: capitalize;
	}

	@media (min-width: 768px) {
		.card-name {
			font-size: 0.875rem;
		}
	}

	.power-bar {
		width: 100%;
		height: 4px;
		background: var(--void-penumbra);
		border-radius: 2px;
		margin-top: 0.75rem;
		overflow: hidden;
	}

	.power-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--shadow-deep) 0%, var(--shadow-primary) 100%);
		box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);
	}

	/* ========================================
	   DUNGEON GRID (Articles)
	   ======================================== */
	.dungeon-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.dungeon-grid {
			gap: 1.5rem;
		}
	}

	.dungeon-card {
		display: flex;
		flex-direction: column;
		background: linear-gradient(135deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(59, 130, 246, 0.15);
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		transition: all 250ms ease;
	}

	.dungeon-card:hover {
		border-color: rgba(59, 130, 246, 0.4);
		transform: translateY(-4px);
		box-shadow: 0 0 30px rgba(59, 130, 246, 0.15);
	}

	.dungeon-image {
		position: relative;
		height: 8rem;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.dungeon-image {
			height: 10rem;
		}
	}

	.dungeon-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 400ms ease;
	}

	.dungeon-card:hover .dungeon-image img {
		transform: scale(1.1);
	}

	.dungeon-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 0%, var(--void-deep) 100%);
	}

	.dungeon-rank {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		padding: 0.25rem 0.5rem;
		background: var(--void-shadow);
		border: 1px solid var(--system-deep);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		font-weight: 700;
		color: var(--system-bright);
		letter-spacing: 0.05em;
	}

	.dungeon-rank.a-rank {
		border-color: var(--danger);
		color: var(--danger-bright);
	}

	.dungeon-rank.b-rank {
		border-color: var(--shadow-primary);
		color: var(--shadow-bright);
	}

	.dungeon-info {
		flex: 1;
		padding: 1rem;
	}

	.dungeon-title {
		font-family: var(--font-display);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.dungeon-title {
			font-size: 1.125rem;
		}
	}

	.dungeon-excerpt {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-top: 0.5rem;
	}

	.dungeon-enter {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: rgba(59, 130, 246, 0.05);
		border-top: 1px solid rgba(59, 130, 246, 0.1);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--system-bright);
		letter-spacing: 0.1em;
		transition: all 200ms ease;
	}

	.dungeon-card:hover .dungeon-enter {
		background: rgba(59, 130, 246, 0.1);
	}

	.enter-arrow {
		transition: transform 200ms ease;
	}

	.dungeon-card:hover .enter-arrow {
		transform: translateX(4px);
	}

	/* ========================================
	   POWER SECTION
	   ======================================== */
	.power-section {
		margin: 3rem 0;
		border-radius: 16px;
		background: linear-gradient(
			135deg,
			rgba(124, 58, 237, 0.1) 0%,
			rgba(59, 130, 246, 0.1) 50%,
			var(--void-umbra) 100%
		);
		border: 1px solid rgba(124, 58, 237, 0.2);
		box-shadow:
			0 0 60px rgba(124, 58, 237, 0.1),
			inset 0 0 100px rgba(59, 130, 246, 0.05);
	}

	.power-inner {
		padding: 3rem 1.5rem;
		text-align: center;
	}

	@media (min-width: 768px) {
		.power-inner {
			padding: 4rem 2rem;
		}
	}

	.power-title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 1.5rem;
	}

	.power-text {
		font-size: 1.125rem;
		color: var(--text-secondary);
		max-width: 600px;
		margin: 0 auto 2rem;
		line-height: 1.6;
	}

	.power-visual {
		margin: 2rem 0;
	}

	.enneagram-ring {
		position: relative;
		width: 220px;
		height: 220px;
		margin: 0 auto;
		border: 2px solid rgba(124, 58, 237, 0.2);
		border-radius: 50%;
		box-shadow:
			0 0 30px rgba(124, 58, 237, 0.1),
			inset 0 0 30px rgba(124, 58, 237, 0.05);
	}

	@media (min-width: 768px) {
		.enneagram-ring {
			width: 280px;
			height: 280px;
		}
	}

	.ring-node {
		--angle: calc(var(--i) * 40deg - 90deg);
		position: absolute;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--void-shadow);
		border: 2px solid var(--shadow-primary);
		border-radius: 50%;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--shadow-bright);
		top: 50%;
		left: 50%;
		transform: rotate(var(--angle)) translate(110px) rotate(calc(-1 * var(--angle)));
		box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
		transition: all 250ms ease;
	}

	@media (min-width: 768px) {
		.ring-node {
			transform: rotate(var(--angle)) translate(140px) rotate(calc(-1 * var(--angle)));
		}
	}

	.ring-node:hover {
		background: var(--shadow-deep);
		box-shadow: 0 0 25px rgba(124, 58, 237, 0.5);
		transform: rotate(var(--angle)) translate(110px) rotate(calc(-1 * var(--angle))) scale(1.15);
	}

	@media (min-width: 768px) {
		.ring-node:hover {
			transform: rotate(var(--angle)) translate(140px) rotate(calc(-1 * var(--angle))) scale(1.15);
		}
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
		background: linear-gradient(135deg, var(--shadow-deep) 0%, var(--shadow-primary) 100%);
		border-radius: 50%;
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
	}

	.center-pulse {
		position: absolute;
		inset: -10px;
		border: 2px solid var(--shadow-glow);
		border-radius: 50%;
		animation: center-pulse 2s ease-in-out infinite;
	}

	@keyframes center-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.2);
			opacity: 0;
		}
	}

	.center-icon {
		font-size: 1.5rem;
		color: white;
	}

	.power-quote {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-secondary);
		font-style: italic;
		line-height: 1.6;
	}

	/* ========================================
	   STAT GRID (Benefits)
	   ======================================== */
	.stat-grid {
		display: grid;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.stat-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}
	}

	.stat-card {
		background: linear-gradient(135deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(59, 130, 246, 0.15);
		border-radius: 12px;
		padding: 1.5rem;
		transition: all 250ms ease;
	}

	.stat-card:hover {
		border-color: rgba(59, 130, 246, 0.4);
		box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
	}

	.stat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.stat-icon-box {
		padding: 0.375rem 0.75rem;
		background: var(--system-deep);
		border-radius: 4px;
	}

	.stat-type {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--system-bright);
		letter-spacing: 0.1em;
	}

	.stat-boost {
		padding: 0.25rem 0.5rem;
		background: rgba(124, 58, 237, 0.15);
		border: 1px solid rgba(124, 58, 237, 0.3);
		border-radius: 4px;
	}

	.boost-value {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--shadow-bright);
	}

	.stat-title {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.stat-desc {
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin-bottom: 1rem;
	}

	.stat-progress {
		margin-top: auto;
	}

	.progress-track {
		height: 6px;
		background: var(--void-penumbra);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--shadow-deep) 0%,
			var(--shadow-primary) 50%,
			var(--shadow-bright) 100%
		);
		box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
		transition: width 500ms ease;
	}

	/* ========================================
	   FINAL CTA
	   ======================================== */
	.final-cta {
		position: relative;
		margin: 3rem 0;
		border-radius: 16px;
		background: linear-gradient(
			135deg,
			rgba(124, 58, 237, 0.15) 0%,
			rgba(59, 130, 246, 0.15) 50%,
			var(--void-umbra) 100%
		);
		border: 1px solid rgba(124, 58, 237, 0.3);
		overflow: hidden;
	}

	.cta-glow {
		position: absolute;
		top: -50%;
		left: 50%;
		transform: translateX(-50%);
		width: 200%;
		height: 100%;
		background: radial-gradient(ellipse at center, rgba(124, 58, 237, 0.2) 0%, transparent 60%);
		pointer-events: none;
	}

	.cta-content {
		position: relative;
		padding: 3rem 1.5rem;
		text-align: center;
	}

	@media (min-width: 768px) {
		.cta-content {
			padding: 4rem 2rem;
		}
	}

	.cta-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(124, 58, 237, 0.1);
		border: 1px solid rgba(124, 58, 237, 0.3);
		border-radius: 4px;
		margin-bottom: 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: var(--shadow-bright);
	}

	.badge-pulse {
		width: 8px;
		height: 8px;
		background: var(--shadow-bright);
		border-radius: 50%;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.cta-title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
	}

	.cta-desc {
		font-size: 1rem;
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.cta-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
	}

	@media (min-width: 480px) {
		.cta-actions {
			flex-direction: row;
		}
	}

	/* ========================================
	   UTILITIES
	   ======================================== */
	.desktop-only {
		display: none;
	}

	@media (min-width: 768px) {
		.desktop-only {
			display: block;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.001ms !important;
			transition-duration: 0.001ms !important;
		}
	}
</style>
