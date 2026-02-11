<!-- src/routes/test-solo-leveling-v3/+page.svelte -->
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

	let sectionsVisible = $state(Array(5).fill(browser ? false : true));

	// The 9 Shadow Types with colors from unified guide
	const shadowTypes: Record<number, { name: string; title: string; color: string }> = {
		1: { name: 'The Perfectionist', title: 'Knight of Order', color: '#a8dadc' },
		2: { name: 'The Helper', title: 'Heart Guardian', color: '#ff6b6b' },
		3: { name: 'The Achiever', title: 'Victory Blade', color: '#fbbf24' },
		4: { name: 'The Individualist', title: 'Soul Weaver', color: '#c084fc' },
		5: { name: 'The Investigator', title: 'Mind Phantom', color: '#22d3ee' },
		6: { name: 'The Loyalist', title: 'Iron Guard', color: '#64748b' },
		7: { name: 'The Enthusiast', title: 'Storm Rider', color: '#fb923c' },
		8: { name: 'The Challenger', title: 'War Commander', color: '#ef4444' },
		9: { name: 'The Peacemaker', title: 'Harmony Sage', color: '#4ade80' }
	};

	const featuredArticles = [
		{
			title: 'How Each Enneagram Type Flexes',
			excerpt: 'Revealing secret needs for recognition',
			image: '/blogs/greek-statue-flex.webp',
			url: '/enneagram-corner/how-each-enneagram-flexes',
			rank: 'B'
		},
		{
			title: 'Toxic Traits of Each Type',
			excerpt: 'When strengths become weaknesses',
			image: '/blogs/greek-statue-showing-cracks.webp',
			url: '/enneagram-corner/toxic-traits-of-each-enneagram-type',
			rank: 'A'
		},
		{
			title: 'Workplace Team Building',
			excerpt: 'Leverage personality differences',
			image: '/blogs/greek-statues-working-in-teams.webp',
			url: '/enneagram-corner/enneagram-workplace-team-building',
			rank: 'B'
		},
		{
			title: 'First Impression Cheat Sheet',
			excerpt: 'Essential approaches for authentic connections',
			image: '/blogs/greek-statue-taking-notes.webp',
			url: '/enneagram-corner/first-impression-cheat-sheet',
			rank: 'C'
		}
	];

	const benefits = [
		{
			title: 'Stress-Test Your Ideas',
			description:
				'Give your take, then unlock 9 different perspectives. Catch blind spots before they catch you.',
			stat: 'INT',
			boost: '+15'
		},
		{
			title: 'Escape Your Bubble',
			description:
				'See how 9 personality types read the same situation. Map hidden motives—no more guesswork.',
			stat: 'PER',
			boost: '+20'
		},
		{
			title: 'Personality-Max Your Stats',
			description:
				"Know your type's strengths and blind spots. Turn cognitive weaknesses into advantages.",
			stat: 'WIS',
			boost: '+25'
		},
		{
			title: 'Level-Up with Coaching',
			description:
				'Ready to go deeper? Book a 1-on-1 session and apply insights directly to your situation.',
			stat: 'ALL',
			boost: '+10'
		}
	];

	function getTransition() {
		return { y: 30, duration: 500, delay: 100 };
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

	// Get one person per type
	const famousByType: (FamousPerson | null)[] = Array(9)
		.fill(null)
		.map((_, index) => {
			const typeNumber = index + 1;
			const peopleOfType = data.images.filter((person: FamousPerson) => person.type === typeNumber);
			return peopleOfType.length > 0 ? peopleOfType[0] : null;
		});
</script>

<svelte:head>
	<title>9takes | Awaken Your EQ - Shadow Monarch Edition</title>
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
	<div class="bg-scanlines"></div>

	<!-- Floating particles -->
	<div class="particles" aria-hidden="true">
		{#each Array(15) as _, i}
			<div
				class="particle"
				style="--delay: {i * 0.7}s; --x: {5 + Math.random() * 90}%; --size: {2 +
					Math.random() * 2}px; --duration: {18 + Math.random() * 12}s;"
			></div>
		{/each}
	</div>

	<main class="content">
		<!-- ========== HERO SECTION ========== -->
		{#if loaded}
			<section class="hero" in:fly={getTransition()}>
				<!-- System Status Bar -->
				<div class="status-bar" in:fade={{ delay: 200, duration: 400 }}>
					<div class="status-left">
						<span class="status-dot"></span>
						<span class="status-label">SYSTEM ACTIVE</span>
					</div>
					<div class="status-right">
						<span class="level-badge">LV.1</span>
						<div class="xp-container">
							<div class="xp-bar">
								<div class="xp-fill" style="width: 35%"></div>
							</div>
							<span class="xp-text">35/100</span>
						</div>
					</div>
				</div>

				<!-- Hero Content -->
				<div class="hero-inner">
					<div class="system-notification" in:fade={{ delay: 300, duration: 400 }}>
						<span class="notif-dot"></span>
						<span class="notif-label">NOTIFICATION</span>
						<span class="notif-text">New Player Detected</span>
					</div>

					<h1 class="hero-title">
						<span class="title-main">Awaken Your</span>
						<span class="title-glow">Emotional Intelligence</span>
					</h1>

					<p class="hero-tagline">
						Stress-test your ideas • Escape your bubble •
						<span class="text-gold">Max your personality</span>
					</p>

					<p class="hero-desc">
						Give your take, digest other perspectives, escape the hive-mind. See how
						<span class="text-shadow">9 personality types</span> can see the same scenario differently.
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
							<span class="reward-star">★</span>
							<span class="reward-amount">+100 EQ</span>
						</div>
					</div>
					<h2 class="quest-title">
						{data.questionOfTheDay ? data.questionOfTheDay.question_formatted : 'Loading...'}
					</h2>
					<div class="quest-footer">
						<div class="quest-meta">
							<span class="meta-icon">👥</span>
							<span class="meta-count">{data.questionOfTheDay?.comment_count || 0}</span>
							<span class="meta-label">responses</span>
						</div>
						<span class="quest-cta">
							ACCEPT QUEST
							<span class="cta-arrow">→</span>
						</span>
					</div>
				</a>

				<!-- Hero Buttons -->
				<div class="hero-actions">
					<a href="/questions" class="btn-shadow">
						<span>Enter the Arena</span>
					</a>
					<a href="/register" class="btn-system"> Create Profile </a>
				</div>

				<p class="hero-note">Free to join • No personality test required</p>
			</section>
		{:else}
			<div class="hero-placeholder"></div>
		{/if}

		<!-- ========== SHADOW ARMY (9 Types) ========== -->
		<div class="section-observer">
			{#if sectionsVisible[0] || !browser}
				<section class="section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge">
							<span class="badge-dot"></span>
							<span>SHADOW ARMY</span>
						</div>
						<h2 class="section-title">Master the 9 Shadows</h2>
						<p class="section-desc">
							Each personality type sees different details. Learn their patterns—decode people
							faster.
						</p>
					</header>

					<div class="shadow-grid">
						{#each famousByType as person, i}
							{@const typeNum = i + 1}
							{@const typeInfo = shadowTypes[typeNum]}
							<a
								href={person
									? `/personality-analysis/${person.name}`
									: `/enneagram-corner/enneagram-type-${typeNum}`}
								class="shadow-card"
								style="--type-color: {typeInfo.color}"
							>
								<div class="card-glow"></div>
								<div class="card-inner">
									<div class="type-badge">{typeNum}</div>

									<div class="avatar-container">
										{#if person}
											<img
												src={person.image || `/types/${typeNum}s/s-${person.name}.webp`}
												alt={person.name}
												class="avatar-img"
												loading={i < 3 ? 'eager' : 'lazy'}
											/>
										{:else}
											<div class="avatar-empty">
												<span>{typeNum}</span>
											</div>
										{/if}
										<div class="avatar-ring"></div>
									</div>

									<div class="card-info">
										<span class="info-title">{typeInfo.title}</span>
										<span class="info-name">
											{person ? person.name.split('-').join(' ') : typeInfo.name}
										</span>
									</div>

									<div class="power-bar">
										<div class="power-fill" style="width: {55 + typeNum * 5}%"></div>
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

		<!-- ========== DUNGEON GATES (Articles) ========== -->
		<div class="section-observer">
			{#if sectionsVisible[1] || !browser}
				<section class="section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge danger">
							<span class="badge-dot"></span>
							<span>DUNGEON GATES</span>
						</div>
						<h2 class="section-title">Training Grounds</h2>
						<p class="section-desc">
							Perspective gains are earned, not scrolled. Challenge yourself.
						</p>
					</header>

					<div class="dungeon-grid">
						{#each featuredArticles as article}
							<a href={article.url} class="dungeon-card">
								<div class="dungeon-img">
									<img src={article.image} alt={article.title} loading="lazy" />
									<div class="dungeon-overlay"></div>
									<span
										class="dungeon-rank"
										class:rank-a={article.rank === 'A'}
										class:rank-b={article.rank === 'B'}
										class:rank-c={article.rank === 'C'}
									>
										{article.rank}-RANK
									</span>
								</div>
								<div class="dungeon-content">
									<h3 class="dungeon-title">{article.title}</h3>
									<p class="dungeon-excerpt">{article.excerpt}</p>
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

		<!-- ========== WHY IT WORKS ========== -->
		<div class="section-observer">
			{#if sectionsVisible[2] || !browser}
				<section class="power-section" in:fly={getTransition()}>
					<div class="power-inner">
						<h2 class="power-title">
							Why the <span class="text-shadow">Enneagram</span> Works
						</h2>

						<p class="power-text">
							Your brain defaults to <span class="text-system">one lens</span>—missing 8 others. The
							Enneagram maps core motivations that drive how people filter reality.
						</p>

						<!-- Enneagram Visual -->
						<div class="enneagram-container">
							<div class="enneagram-ring">
								{#each Array(9) as _, i}
									{@const typeColor = shadowTypes[i + 1].color}
									<div class="ring-node" style="--i: {i}; --node-color: {typeColor}">
										<span>{i + 1}</span>
									</div>
								{/each}
								<div class="ring-center">
									<div class="center-pulse"></div>
									<span class="center-symbol">◈</span>
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

		<!-- ========== STAT BOOST (Benefits) ========== -->
		<div class="section-observer">
			{#if sectionsVisible[3] || !browser}
				<section class="section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge">
							<span class="badge-dot"></span>
							<span>STAT BOOST</span>
						</div>
						<h2 class="section-title">How It Works</h2>
					</header>

					<div class="stat-grid">
						{#each benefits as benefit, i}
							<div class="stat-card">
								<div class="stat-header">
									<span class="stat-type">{benefit.stat}</span>
									<span class="stat-boost">{benefit.boost}</span>
								</div>
								<h3 class="stat-title">{benefit.title}</h3>
								<p class="stat-desc">{benefit.description}</p>
								<div class="stat-progress">
									<div class="progress-fill" style="width: {30 + i * 18}%"></div>
								</div>
							</div>
						{/each}
					</div>

					<div class="section-cta">
						<a href="/book-session" class="btn-shadow">
							<span>Level-Up 1-on-1</span>
						</a>
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== FINAL CTA ========== -->
		{#if !data?.user}
			<div class="section-observer">
				{#if sectionsVisible[4] || !browser}
					<section class="final-section" in:fly={getTransition()}>
						<div class="final-glow"></div>
						<div class="final-inner">
							<div class="system-notification">
								<span class="notif-pulse"></span>
								<span class="notif-label">QUEST AVAILABLE</span>
							</div>

							<h2 class="final-title">
								Ready to <span class="text-shadow">Awaken</span>?
							</h2>
							<p class="final-desc">
								Start stress-testing your takes. Do the work of growing your perspective.
							</p>

							<div class="final-actions">
								<a href="/questions" class="btn-shadow lg">
									<span>Explore & Give Your Takes</span>
								</a>
								<a href="/register" class="btn-system"> Create Hunter Profile </a>
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
     CSS VARIABLES (Unified Guide)
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
		--status-danger: #dc2626;
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
			radial-gradient(ellipse at 30% 10%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
			radial-gradient(ellipse at 70% 90%, rgba(59, 130, 246, 0.06) 0%, transparent 50%);
		z-index: 1;
		pointer-events: none;
	}

	.bg-grid {
		position: fixed;
		inset: 0;
		background-image:
			linear-gradient(rgba(124, 58, 237, 0.025) 1px, transparent 1px),
			linear-gradient(90deg, rgba(124, 58, 237, 0.025) 1px, transparent 1px);
		background-size: 50px 50px;
		z-index: 2;
		pointer-events: none;
	}

	.bg-scanlines {
		position: fixed;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.02) 0px,
			rgba(0, 0, 0, 0.02) 1px,
			transparent 1px,
			transparent 3px
		);
		z-index: 3;
		pointer-events: none;
	}

	/* Particles */
	.particles {
		position: fixed;
		inset: 0;
		z-index: 4;
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
			opacity: 0.5;
		}
		95% {
			opacity: 0.5;
		}
		100% {
			transform: translateY(-105vh);
			opacity: 0;
		}
	}

	/* ==========================================
     TEXT UTILITIES
     ========================================== */
	.text-shadow {
		color: var(--shadow-flame);
		text-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
	}

	.text-system {
		color: var(--system-hologram);
		text-shadow: 0 0 12px rgba(96, 165, 250, 0.5);
	}

	.text-gold {
		color: var(--status-gold-bright);
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
		padding: 6rem 0 2rem;
		text-align: center;
	}

	.hero-placeholder {
		height: 100vh;
	}

	/* Status Bar */
	.status-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 550px;
		padding: 0.625rem 1rem;
		background: linear-gradient(135deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 8px;
		margin-bottom: 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
	}

	.status-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-dot {
		width: 7px;
		height: 7px;
		background: var(--status-success);
		border-radius: 50%;
		box-shadow: 0 0 8px var(--status-success);
		animation: pulse-dot 2s ease-in-out infinite;
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

	.status-label {
		color: var(--system-hologram);
		letter-spacing: 0.08em;
	}

	.status-right {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.level-badge {
		padding: 0.2rem 0.4rem;
		background: var(--shadow-deep);
		color: var(--shadow-ethereal);
		border-radius: 4px;
		font-weight: 700;
		font-size: 0.65rem;
	}

	.xp-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.xp-bar {
		width: 60px;
		height: 5px;
		background: var(--void-penumbra);
		border-radius: 3px;
		overflow: hidden;
	}

	.xp-fill {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--shadow-deep) 0%,
			var(--shadow-monarch) 50%,
			var(--shadow-flame) 100%
		);
		box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);
	}

	.xp-text {
		color: var(--text-mist);
		font-size: 0.6rem;
	}

	/* Hero Inner */
	.hero-inner {
		max-width: 750px;
		margin-bottom: 2rem;
	}

	.system-notification {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.875rem;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%);
		border: 1px solid rgba(59, 130, 246, 0.25);
		border-radius: 5px;
		margin-bottom: 1.25rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
	}

	.notif-dot,
	.notif-pulse {
		width: 6px;
		height: 6px;
		background: var(--system-hologram);
		border-radius: 50%;
	}

	.notif-pulse {
		animation: pulse-dot 1.5s ease-in-out infinite;
	}

	.notif-label {
		color: var(--system-stream);
		letter-spacing: 0.1em;
		text-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
	}

	.notif-text {
		color: var(--text-pale);
	}

	.hero-title {
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 7vw, 4rem);
		font-weight: 700;
		line-height: 1.1;
		margin-bottom: 0.875rem;
	}

	.title-main {
		display: block;
		color: var(--text-pale);
	}

	.title-glow {
		display: block;
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--system-interface) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 0 25px rgba(124, 58, 237, 0.4));
	}

	.hero-tagline {
		font-family: var(--font-display);
		font-size: clamp(1rem, 2.5vw, 1.375rem);
		font-weight: 600;
		color: var(--text-mist);
		margin-bottom: 0.75rem;
	}

	.hero-desc {
		font-size: 0.95rem;
		color: var(--text-mist);
		max-width: 550px;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* Quest Card */
	.quest-card {
		display: block;
		width: 100%;
		max-width: 650px;
		padding: 1.25rem;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 12px;
		margin-bottom: 1.75rem;
		text-decoration: none;
		box-shadow:
			0 0 25px rgba(59, 130, 246, 0.08),
			inset 0 1px 0 rgba(59, 130, 246, 0.08);
		transition: all 250ms var(--ease-out);
	}

	.quest-card:hover {
		border-color: rgba(59, 130, 246, 0.45);
		box-shadow:
			0 0 40px rgba(59, 130, 246, 0.15),
			inset 0 1px 0 rgba(59, 130, 246, 0.12);
		transform: translateY(-4px);
	}

	.quest-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.875rem;
	}

	.quest-type {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.quest-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.375rem;
		height: 1.375rem;
		background: var(--system-deep);
		color: var(--system-hologram);
		border-radius: 4px;
		font-weight: 700;
		font-size: 0.8rem;
	}

	.quest-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--system-hologram);
		letter-spacing: 0.08em;
		text-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
	}

	.quest-reward {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.3rem 0.625rem;
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid rgba(245, 158, 11, 0.25);
		border-radius: 4px;
	}

	.reward-star {
		color: var(--status-gold-bright);
		font-size: 0.75rem;
	}

	.reward-amount {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--status-gold-bright);
	}

	.quest-title {
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 2.5vw, 1.375rem);
		font-weight: 600;
		color: var(--text-pale);
		line-height: 1.35;
		margin-bottom: 0.875rem;
	}

	.quest-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 0.875rem;
		border-top: 1px solid rgba(59, 130, 246, 0.1);
	}

	.quest-meta {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--text-mist);
	}

	.meta-count {
		color: var(--system-hologram);
		font-weight: 600;
	}

	.quest-cta {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--shadow-flame);
		letter-spacing: 0.04em;
	}

	.cta-arrow,
	.enter-arrow {
		transition: transform 200ms ease;
	}

	.quest-card:hover .cta-arrow {
		transform: translateX(4px);
	}

	/* Hero Actions */
	.hero-actions {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		margin-bottom: 0.875rem;
	}

	@media (min-width: 480px) {
		.hero-actions {
			flex-direction: row;
		}
	}

	.hero-note {
		font-size: 0.8rem;
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
		padding: 0.8rem 1.5rem;
		background: linear-gradient(135deg, var(--shadow-deep) 0%, var(--shadow-monarch) 100%);
		border: none;
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: white;
		text-decoration: none;
		cursor: pointer;
		overflow: hidden;
		box-shadow: 0 0 18px rgba(124, 58, 237, 0.25);
		transition: all 250ms var(--ease-out);
	}

	.btn-shadow:hover {
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-flame) 100%);
		box-shadow: 0 0 28px rgba(124, 58, 237, 0.45);
		transform: translateY(-2px);
	}

	.btn-shadow.lg {
		padding: 0.9rem 1.75rem;
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
		transition: left 350ms ease;
	}

	.btn-shadow:hover::after {
		left: 100%;
	}

	.btn-system {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.8rem 1.5rem;
		background: transparent;
		border: 1px solid rgba(59, 130, 246, 0.35);
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--system-hologram);
		text-decoration: none;
		cursor: pointer;
		transition: all 250ms var(--ease-out);
	}

	.btn-system:hover {
		background: rgba(59, 130, 246, 0.08);
		border-color: var(--system-hologram);
		box-shadow: 0 0 18px rgba(59, 130, 246, 0.18);
	}

	/* ==========================================
     SECTIONS
     ========================================== */
	.section {
		padding: 3.5rem 0;
	}

	.section-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.section-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.625rem;
		background: rgba(124, 58, 237, 0.08);
		border: 1px solid rgba(124, 58, 237, 0.18);
		border-radius: 4px;
		margin-bottom: 0.875rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		color: var(--shadow-flame);
	}

	.section-badge.danger {
		background: rgba(220, 38, 38, 0.08);
		border-color: rgba(220, 38, 38, 0.18);
		color: var(--status-danger);
	}

	.section-badge.danger .badge-dot {
		background: var(--status-danger);
		box-shadow: 0 0 8px var(--status-danger);
	}

	.badge-dot {
		width: 5px;
		height: 5px;
		background: var(--shadow-flame);
		border-radius: 50%;
		box-shadow: 0 0 8px var(--shadow-monarch);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2.25rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 0.4rem;
	}

	.section-desc {
		font-size: 0.95rem;
		color: var(--text-mist);
		max-width: 480px;
		margin: 0 auto;
	}

	.section-cta {
		text-align: center;
		margin-top: 2.25rem;
	}

	/* ==========================================
     SHADOW GRID (9 Types)
     ========================================== */
	.shadow-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.shadow-grid {
			gap: 1rem;
		}
	}

	.shadow-card {
		--type-color: var(--shadow-monarch);
		position: relative;
		display: block;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid color-mix(in srgb, var(--type-color) 18%, transparent);
		border-radius: 12px;
		padding: 0.875rem;
		text-decoration: none;
		overflow: hidden;
		transition: all 250ms var(--ease-out);
	}

	.shadow-card:hover {
		border-color: color-mix(in srgb, var(--type-color) 45%, transparent);
		box-shadow: 0 0 28px color-mix(in srgb, var(--type-color) 22%, transparent);
		transform: translateY(-4px);
	}

	.card-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at 50% 0%,
			color-mix(in srgb, var(--type-color) 12%, transparent) 0%,
			transparent 60%
		);
		opacity: 0;
		transition: opacity 250ms ease;
	}

	.shadow-card:hover .card-glow {
		opacity: 1;
	}

	.card-inner {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.type-badge {
		position: absolute;
		top: -0.375rem;
		left: -0.375rem;
		width: 1.375rem;
		height: 1.375rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--type-color) 15%, var(--void-abyss));
		border: 1px solid color-mix(in srgb, var(--type-color) 40%, transparent);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--type-color);
	}

	.avatar-container {
		position: relative;
		margin: 0.5rem 0;
	}

	.avatar-img {
		width: 3.75rem;
		height: 3.75rem;
		object-fit: cover;
		border-radius: 50%;
		border: 2px solid var(--type-color);
		box-shadow: 0 0 15px color-mix(in srgb, var(--type-color) 35%, transparent);
	}

	@media (min-width: 640px) {
		.avatar-img {
			width: 5rem;
			height: 5rem;
		}
	}

	.avatar-empty {
		width: 3.75rem;
		height: 3.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--void-penumbra);
		border-radius: 50%;
		border: 2px solid var(--type-color);
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--type-color);
	}

	@media (min-width: 640px) {
		.avatar-empty {
			width: 5rem;
			height: 5rem;
			font-size: 1.5rem;
		}
	}

	.avatar-ring {
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		border: 1px solid var(--type-color);
		opacity: 0;
		animation: ring-spin 5s linear infinite;
		transition: opacity 250ms ease;
	}

	.shadow-card:hover .avatar-ring {
		opacity: 0.4;
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
		margin-top: 0.4rem;
	}

	.info-title {
		display: none;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--type-color);
		letter-spacing: 0.04em;
		margin-bottom: 0.15rem;
	}

	@media (min-width: 640px) {
		.info-title {
			display: block;
		}
	}

	.info-name {
		font-size: 0.7rem;
		color: var(--text-pale);
		text-transform: capitalize;
		line-height: 1.3;
	}

	@media (min-width: 640px) {
		.info-name {
			font-size: 0.8rem;
		}
	}

	.power-bar {
		display: none;
		width: 100%;
		height: 3px;
		background: var(--void-penumbra);
		border-radius: 2px;
		margin-top: 0.625rem;
		overflow: hidden;
	}

	@media (min-width: 640px) {
		.power-bar {
			display: block;
		}
	}

	.power-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--shadow-deep) 0%, var(--type-color) 100%);
		box-shadow: 0 0 6px color-mix(in srgb, var(--type-color) 50%, transparent);
	}

	/* ==========================================
     DUNGEON GRID (Articles)
     ========================================== */
	.dungeon-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.875rem;
	}

	@media (min-width: 640px) {
		.dungeon-grid {
			gap: 1.25rem;
		}
	}

	.dungeon-card {
		display: flex;
		flex-direction: column;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(59, 130, 246, 0.12);
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		transition: all 250ms var(--ease-out);
	}

	.dungeon-card:hover {
		border-color: rgba(59, 130, 246, 0.35);
		box-shadow: 0 0 25px rgba(59, 130, 246, 0.12);
		transform: translateY(-4px);
	}

	.dungeon-img {
		position: relative;
		height: 7rem;
		overflow: hidden;
	}

	@media (min-width: 640px) {
		.dungeon-img {
			height: 9rem;
		}
	}

	.dungeon-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 350ms ease;
	}

	.dungeon-card:hover .dungeon-img img {
		transform: scale(1.08);
	}

	.dungeon-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 30%, var(--void-abyss) 100%);
	}

	.dungeon-rank {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.2rem 0.4rem;
		background: var(--void-shadow);
		border: 1px solid var(--system-deep);
		border-radius: 3px;
		font-family: var(--font-mono);
		font-size: 0.55rem;
		font-weight: 700;
		color: var(--system-hologram);
		letter-spacing: 0.04em;
	}

	.dungeon-rank.rank-a {
		border-color: var(--status-danger);
		color: #f87171;
	}

	.dungeon-rank.rank-b {
		border-color: var(--shadow-monarch);
		color: var(--shadow-flame);
	}

	.dungeon-rank.rank-c {
		border-color: var(--status-success);
		color: var(--status-success);
	}

	.dungeon-content {
		flex: 1;
		padding: 0.75rem;
	}

	@media (min-width: 640px) {
		.dungeon-content {
			padding: 1rem;
		}
	}

	.dungeon-title {
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-pale);
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (min-width: 640px) {
		.dungeon-title {
			font-size: 1rem;
		}
	}

	.dungeon-excerpt {
		display: none;
		font-size: 0.8rem;
		color: var(--text-mist);
		margin-top: 0.375rem;
	}

	@media (min-width: 640px) {
		.dungeon-excerpt {
			display: block;
		}
	}

	.dungeon-enter {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.625rem;
		background: rgba(59, 130, 246, 0.04);
		border-top: 1px solid rgba(59, 130, 246, 0.08);
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--system-hologram);
		letter-spacing: 0.08em;
		transition: background 200ms ease;
	}

	.dungeon-card:hover .dungeon-enter {
		background: rgba(59, 130, 246, 0.08);
	}

	.dungeon-card:hover .enter-arrow {
		transform: translateX(4px);
	}

	/* ==========================================
     POWER SECTION
     ========================================== */
	.power-section {
		margin: 2.5rem 0;
		border-radius: 16px;
		background: linear-gradient(
			135deg,
			rgba(124, 58, 237, 0.08) 0%,
			rgba(59, 130, 246, 0.08) 50%,
			var(--void-umbra) 100%
		);
		border: 1px solid rgba(124, 58, 237, 0.18);
		box-shadow:
			0 0 50px rgba(124, 58, 237, 0.08),
			inset 0 0 80px rgba(59, 130, 246, 0.04);
	}

	.power-inner {
		padding: 2.5rem 1.25rem;
		text-align: center;
	}

	@media (min-width: 640px) {
		.power-inner {
			padding: 3.5rem 1.5rem;
		}
	}

	.power-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2.25rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 1.25rem;
	}

	.power-text {
		font-size: 1rem;
		color: var(--text-mist);
		max-width: 550px;
		margin: 0 auto 1.75rem;
		line-height: 1.6;
	}

	/* Enneagram Ring */
	.enneagram-container {
		margin: 1.75rem 0;
	}

	.enneagram-ring {
		position: relative;
		width: 200px;
		height: 200px;
		margin: 0 auto;
		border: 2px solid rgba(124, 58, 237, 0.18);
		border-radius: 50%;
		box-shadow:
			0 0 25px rgba(124, 58, 237, 0.08),
			inset 0 0 25px rgba(124, 58, 237, 0.04);
	}

	@media (min-width: 640px) {
		.enneagram-ring {
			width: 260px;
			height: 260px;
		}
	}

	.ring-node {
		--angle: calc(var(--i) * 40deg - 90deg);
		--node-color: var(--shadow-monarch);
		position: absolute;
		width: 1.75rem;
		height: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--void-shadow);
		border: 2px solid var(--node-color);
		border-radius: 50%;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--node-color);
		top: 50%;
		left: 50%;
		transform: rotate(var(--angle)) translate(100px) rotate(calc(-1 * var(--angle)));
		box-shadow: 0 0 12px color-mix(in srgb, var(--node-color) 35%, transparent);
		transition: all 250ms ease;
	}

	@media (min-width: 640px) {
		.ring-node {
			transform: rotate(var(--angle)) translate(130px) rotate(calc(-1 * var(--angle)));
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
		width: 3.5rem;
		height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--shadow-deep) 0%, var(--shadow-monarch) 100%);
		border-radius: 50%;
		box-shadow: 0 0 25px rgba(124, 58, 237, 0.45);
	}

	.center-pulse {
		position: absolute;
		inset: -8px;
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
			transform: scale(1.25);
			opacity: 0;
		}
	}

	.center-symbol {
		font-size: 1.25rem;
		color: white;
	}

	.power-quote {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-mist);
		font-style: italic;
		line-height: 1.6;
	}

	/* ==========================================
     STAT GRID (Benefits)
     ========================================== */
	.stat-grid {
		display: grid;
		gap: 0.875rem;
	}

	@media (min-width: 640px) {
		.stat-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.25rem;
		}
	}

	.stat-card {
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(59, 130, 246, 0.12);
		border-radius: 12px;
		padding: 1.25rem;
		transition: all 250ms var(--ease-out);
	}

	.stat-card:hover {
		border-color: rgba(59, 130, 246, 0.35);
		box-shadow: 0 0 25px rgba(59, 130, 246, 0.1);
	}

	.stat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.stat-type {
		padding: 0.25rem 0.5rem;
		background: var(--system-deep);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--system-hologram);
		letter-spacing: 0.08em;
	}

	.stat-boost {
		padding: 0.2rem 0.4rem;
		background: rgba(124, 58, 237, 0.12);
		border: 1px solid rgba(124, 58, 237, 0.25);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--shadow-flame);
	}

	.stat-title {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-pale);
		margin-bottom: 0.375rem;
	}

	.stat-desc {
		font-size: 0.8rem;
		color: var(--text-mist);
		line-height: 1.5;
		margin-bottom: 0.875rem;
	}

	.stat-progress {
		height: 5px;
		background: var(--void-penumbra);
		border-radius: 3px;
		overflow: hidden;
	}

	.stat-progress .progress-fill {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--shadow-deep) 0%,
			var(--shadow-monarch) 50%,
			var(--shadow-flame) 100%
		);
		box-shadow: 0 0 8px rgba(124, 58, 237, 0.45);
	}

	/* ==========================================
     FINAL SECTION
     ========================================== */
	.final-section {
		position: relative;
		margin: 2.5rem 0;
		border-radius: 16px;
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
		top: -50%;
		left: 50%;
		transform: translateX(-50%);
		width: 150%;
		height: 100%;
		background: radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 60%);
		pointer-events: none;
	}

	.final-inner {
		position: relative;
		padding: 2.5rem 1.25rem;
		text-align: center;
	}

	@media (min-width: 640px) {
		.final-inner {
			padding: 3.5rem 1.5rem;
		}
	}

	.final-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2.25rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 0.5rem;
	}

	.final-desc {
		font-size: 0.95rem;
		color: var(--text-mist);
		margin-bottom: 1.75rem;
	}

	.final-actions {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		justify-content: center;
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
