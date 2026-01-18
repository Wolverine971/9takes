<!-- src/routes/test-solo-leveling/+page.svelte -->
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

	// Shadow Soldier archetypes for each type
	const shadowTypes = {
		1: { name: 'The Perfectionist Knight', color: '#A8DADC' },
		2: { name: 'The Heart Sentinel', color: '#FF6B6B' },
		3: { name: 'The Achiever Blade', color: '#FFD700' },
		4: { name: 'The Soul Weaver', color: '#9D4EDD' },
		5: { name: 'The Mind Wraith', color: '#00D4FF' },
		6: { name: 'The Loyal Guard', color: '#4A90A4' },
		7: { name: 'The Storm Rider', color: '#FF8C42' },
		8: { name: 'The Commander', color: '#E63946' },
		9: { name: 'The Peacekeeper', color: '#6B9080' }
	};

	const enneagramTypes = {
		1: 'Type 1: The Perfectionist',
		2: 'Type 2: The Helper',
		3: 'Type 3: The Achiever',
		4: 'Type 4: The Individualist',
		5: 'Type 5: The Investigator',
		6: 'Type 6: The Loyalist',
		7: 'Type 7: The Enthusiast',
		8: 'Type 8: The Challenger',
		9: 'Type 9: The Peacemaker'
	};

	const featuredArticles = [
		{
			id: '1',
			title: 'How Each Enneagram Type Flexes: Revealing Secret Needs for Recognition',
			excerpt:
				'Discover the unique ways each Enneagram type shows off their strengths and craves recognition in everyday interactions',
			image: '/blogs/greek-statue-flex.webp',
			url: '/enneagram-corner/how-each-enneagram-flexes'
		},
		{
			id: '2',
			title: 'Toxic Traits of Each Enneagram Type',
			excerpt:
				'Understand the shadow sides of each personality type and how to recognize when strengths turn into weaknesses',
			image: '/blogs/greek-statue-showing-cracks.webp',
			url: '/enneagram-corner/toxic-traits-of-each-enneagram-type'
		},
		{
			id: '3',
			title: 'Workplace Team Building with the Enneagram',
			excerpt:
				'How to leverage personality differences to create stronger teams and improve workplace communication',
			image: '/blogs/greek-statues-working-in-teams.webp',
			url: '/enneagram-corner/enneagram-workplace-team-building'
		},
		{
			id: '4',
			title: 'Enneagram First Impression Cheat Sheet',
			excerpt:
				'Essential approaches, power questions, and key tips for authentic first impressions.',
			image: '/blogs/greek-statue-taking-notes.webp',
			url: '/enneagram-corner/first-impression-cheat-sheet'
		}
	];

	const benefits = [
		{
			title: 'Stress-Test Your Ideas',
			description:
				'Give your take, then unlock 9 different perspectives. Catch blind spots—before they catch you.',
			icon: '⚔️'
		},
		{
			title: 'Escape Your Bubble',
			description:
				'See how 9 personality types read the same situation. Map hidden motives and decode people fast—no more guesswork.',
			icon: '👁️'
		},
		{
			title: 'Personality-Max Your Stats',
			description:
				"Know your type's strengths and blind spots. Turn cognitive weaknesses into competitive advantages through targeted practice.",
			icon: '📈'
		},
		{
			title: 'Level-Up with Coaching',
			description:
				'Ready to go deeper? <a href="/book-session" class="text-system-cyan underline font-semibold hover:text-awakening-violet transition-colors">Book a session</a> and apply insights directly to your situation.',
			icon: '🎯'
		}
	];

	function getTransition(index: number) {
		const duration = 600;
		const delay = 150;
		return { y: 30, duration, delay };
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
			{
				threshold: 0.1,
				rootMargin: '100px 0px'
			}
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
</script>

<svelte:head>
	<title>9takes | Shadow Monarch Edition</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<svelte:window bind:innerWidth />

<!-- Main container with dark background -->
<div class="solo-leveling-page">
	<!-- Animated background particles -->
	<div class="particles-bg"></div>

	<div class="relative z-10 mx-auto w-full max-w-7xl px-4">
		<!-- Hero Section -->
		{#if loaded}
			<section
				class="flex min-h-[90vh] flex-col items-center justify-center py-8 md:py-12"
				in:fly={getTransition(0)}
			>
				<!-- System notification header -->
				<div class="system-notification mb-6" in:fade={{ delay: 300, duration: 500 }}>
					<span class="system-label">SYSTEM</span>
					<span class="system-text">New Player Detected</span>
				</div>

				<div class="mb-8 max-w-4xl text-center">
					<h1 class="hero-title mb-4">
						<span class="title-glow">Awaken</span> Your Emotional Intelligence
					</h1>
					<h2 class="hero-subtitle mb-6">
						Stress-test your ideas • Escape your bubble<br />
						<span class="text-hunter-gold">Max out your Personality</span>
					</h2>
					<p class="text-ghost-white/80 mx-auto max-w-2xl text-base md:text-lg">
						Give your take, digest other perspectives, escape the hive-mind. See how
						<span class="text-shadow-purple font-semibold">9 personality types</span> can see the same
						scenario differently—catch blind spots before they catch you.
					</p>
				</div>

				<!-- Question of the Day - System Panel Style -->
				<a
					href={`/questions/${data.questionOfTheDay?.url}`}
					class="quest-panel mb-8 w-full max-w-3xl"
				>
					<div class="quest-header">
						<span class="quest-label">DAILY QUEST</span>
						<div class="quest-reward">
							<span class="text-hunter-gold text-sm font-bold">+100 EQ XP</span>
						</div>
					</div>
					<h3 class="quest-title my-4">
						{data.questionOfTheDay ? data.questionOfTheDay.question_formatted : 'Loading quest...'}
					</h3>
					<div class="quest-footer">
						<div class="flex items-center gap-3">
							<div class="flex -space-x-2">
								{#if data.questionOfTheDay}
									{#each data.questionOfTheDay.comment_count.toString().split('') as num}
										<div class="stat-orb">
											{num}
										</div>
									{/each}
								{/if}
							</div>
							<span class="text-ghost-white/60 text-sm">hunters responded</span>
						</div>
						<span class="accept-quest">ACCEPT →</span>
					</div>
				</a>

				<!-- CTA Buttons -->
				<div class="mb-4 flex flex-col gap-4 sm:flex-row">
					<a href="/questions" class="btn-monarch">
						<span class="btn-text">Enter the Arena</span>
						<span class="btn-glow"></span>
					</a>
					<a href="/register" class="btn-system"> Create Hunter Profile </a>
				</div>
				<p class="text-ghost-white/50 text-center text-sm">Free to join • No test required</p>
			</section>
		{:else}
			<div class="h-screen"></div>
		{/if}

		<!-- 9 Shadow Soldiers Grid -->
		<div class="section-observer">
			{#if sectionsVisible[0] || !browser}
				<section class="py-12 md:py-16" in:fly={getTransition(1)}>
					<div class="section-header mb-12">
						<div class="system-notification mb-4 inline-block">
							<span class="system-label">SHADOW ARMY</span>
						</div>
						<h2 class="section-title">Master the 9 Shadows</h2>
						<p class="section-subtitle">
							Each personality type sees different details. Learn their patterns—decode people
							faster.
						</p>
					</div>

					<div class="grid grid-cols-3 gap-3 md:gap-6">
						{#each famousByType as person, i}
							{#if person}
								<a href={`/personality-analysis/${person.name}`} class="group">
									<div class="shadow-card" style="--type-color: {shadowTypes[i + 1].color}">
										<div class="shadow-card-inner">
											<!-- Type badge -->
											<div
												class="type-badge"
												style="background: {shadowTypes[i + 1].color}20; border-color: {shadowTypes[
													i + 1
												].color}50; color: {shadowTypes[i + 1].color}"
											>
												{i + 1}
											</div>

											<!-- Avatar -->
											<div class="shadow-avatar-container">
												<div class="shadow-avatar" style="--glow-color: {shadowTypes[i + 1].color}">
													<img
														src={person.image || `/types/${i + 1}s/s-${person.name}.webp`}
														alt={person.name}
														class="h-full w-full object-cover"
														loading={i < 3 ? 'eager' : 'lazy'}
														decoding="async"
													/>
												</div>
												<div
													class="avatar-ring"
													style="border-color: {shadowTypes[i + 1].color}"
												></div>
											</div>

											<!-- Info -->
											<div class="shadow-info">
												<h3
													class="shadow-name desktop-only"
													style="color: {shadowTypes[i + 1].color}"
												>
													{shadowTypes[i + 1].name}
												</h3>
												<p class="shadow-person">
													{person.name.split('-').join(' ')}
												</p>
											</div>
										</div>
									</div>
								</a>
							{:else}
								<a href={`/enneagram-corner/enneagram-type-${i + 1}`} class="group">
									<div
										class="shadow-card shadow-card-empty"
										style="--type-color: {shadowTypes[i + 1].color}"
									>
										<div class="shadow-card-inner">
											<div class="type-badge-large" style="color: {shadowTypes[i + 1].color}">
												{i + 1}
											</div>
											<p class="text-ghost-white/60 mt-2 text-sm">Summon Shadow</p>
										</div>
									</div>
								</a>
							{/if}
						{/each}
					</div>

					<div class="mt-10 text-center">
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

		<!-- Cognitive Drills Section -->
		<div class="section-observer">
			{#if sectionsVisible[1] || !browser}
				<section class="py-12 md:py-16" in:fly={getTransition(2)}>
					<div class="section-header mb-12">
						<div class="system-notification mb-4 inline-block">
							<span class="system-label">TRAINING GROUNDS</span>
						</div>
						<h2 class="section-title">Cognitive Drills</h2>
						<p class="section-subtitle">
							Perspective gains are earned, not scrolled. It takes effort to digest a new
							perspective.
						</p>
					</div>

					<div class="grid grid-cols-2 gap-4 md:gap-6">
						{#each featuredArticles as article, i}
							<a href={article.url} class="group">
								<div class="drill-card">
									<div class="drill-image">
										<img
											src={article.image}
											alt={article.title}
											class="h-full w-full object-cover"
											loading="lazy"
											decoding="async"
										/>
										<div class="drill-overlay"></div>
										<div class="drill-number">{String(i + 1).padStart(2, '0')}</div>
									</div>
									<div class="drill-content">
										<h3 class="drill-title">{article.title}</h3>
										<p class="drill-excerpt desktop-only">{article.excerpt}</p>
									</div>
								</div>
							</a>
						{/each}
					</div>

					<div class="mt-10 text-center">
						<a href="/enneagram-corner" class="btn-system"> More Training Modules → </a>
					</div>
				</section>
			{/if}
		</div>

		<!-- Why It Works Section -->
		<div class="section-observer">
			{#if sectionsVisible[2] || !browser}
				<section class="monarch-panel py-12 md:py-16" in:fly={getTransition(3)}>
					<div class="monarch-panel-inner">
						<div class="section-header mb-8">
							<h2 class="section-title">
								Why the <span class="text-shadow-purple">Enneagram</span> Works
							</h2>
						</div>

						<div class="mx-auto max-w-3xl text-center">
							<p class="text-ghost-white/90 mb-6 text-lg md:text-xl">
								Your brain defaults to <span class="text-system-cyan">one lens</span>—miss 8 others.
								The Enneagram maps core motivations that drive how people filter reality.
							</p>

							<p class="text-hunter-gold mb-8 text-lg font-bold md:text-xl">
								Digesting new angles burns mental glucose—but that's where the gains live.
							</p>

							<!-- Enneagram visual representation -->
							<div class="enneagram-visual">
								<div class="enneagram-circle">
									{#each Array(9) as _, i}
										<div
											class="type-node"
											style="
                        --angle: {i * 40 - 90}deg;
                        --color: {shadowTypes[i + 1].color}
                      "
										>
											<span>{i + 1}</span>
										</div>
									{/each}
									<div class="center-eye">
										<span class="eye-icon">👁️</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			{/if}
		</div>

		<!-- Benefits Section -->
		<div class="section-observer">
			{#if sectionsVisible[3] || !browser}
				<section class="py-12 md:py-16" in:fly={getTransition(4)}>
					<div class="section-header mb-12">
						<div class="system-notification mb-4 inline-block">
							<span class="system-label">SKILL TREE</span>
						</div>
						<h2 class="section-title">How It Works</h2>
					</div>

					<div class="grid gap-4 md:grid-cols-2 md:gap-6">
						{#each benefits as benefit, i}
							<div class="skill-card">
								<div class="skill-icon">{benefit.icon}</div>
								<div class="skill-content">
									<h3 class="skill-title">{benefit.title}</h3>
									<p class="skill-description">{@html benefit.description}</p>
								</div>
								<div class="skill-level">LV.{i + 1}</div>
							</div>
						{/each}
					</div>

					<div class="mt-10 text-center">
						<a href="/book-session" class="btn-monarch">
							<span class="btn-text">Level-Up 1-on-1</span>
							<span class="btn-glow"></span>
						</a>
					</div>
				</section>
			{/if}
		</div>

		<!-- Final CTA Section -->
		{#if !data?.user}
			<div class="section-observer">
				{#if sectionsVisible[4] || !browser}
					<section class="final-cta mb-16 md:mb-24" in:fly={getTransition(5)}>
						<div class="final-cta-inner">
							<div class="system-notification mb-6">
								<span class="system-label">NOTIFICATION</span>
								<span class="system-text">New Quest Available</span>
							</div>

							<h2 class="final-title">
								Ready to <span class="text-shadow-purple">Awaken</span>?
							</h2>
							<p class="final-subtitle">
								Start stress-testing your takes. Do the work of growing your perspective.
							</p>

							<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
								<a href="/questions" class="btn-monarch">
									<span class="btn-text">Explore & Give Your Takes</span>
									<span class="btn-glow"></span>
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
	/* ===== SOLO LEVELING COLOR VARIABLES ===== */
	:global(:root) {
		--void-black: #0a0a0f;
		--shadow-purple: #7b2cbf;
		--monarch-blue: #1b45d7;
		--abyss-navy: #0a1543;
		--system-cyan: #00d4ff;
		--awakening-violet: #9d4edd;
		--crimson-alert: #e63946;
		--hunter-gold: #ffd700;
		--ash-gray: #2d2d3a;
		--stone-gray: #4a4a5a;
		--mist-gray: #9ca3af;
		--ghost-white: #e5e7eb;
	}

	/* Color utility classes */
	.text-shadow-purple {
		color: var(--shadow-purple);
	}
	.text-system-cyan {
		color: var(--system-cyan);
	}
	.text-hunter-gold {
		color: var(--hunter-gold);
	}
	.text-ghost-white {
		color: var(--ghost-white);
	}
	.text-awakening-violet {
		color: var(--awakening-violet);
	}

	/* ===== MAIN CONTAINER ===== */
	.solo-leveling-page {
		background: var(--void-black);
		min-height: 100vh;
		position: relative;
		overflow: hidden;
	}

	/* Animated background */
	.particles-bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background:
			radial-gradient(ellipse at 20% 20%, rgba(123, 44, 191, 0.15) 0%, transparent 50%),
			radial-gradient(ellipse at 80% 80%, rgba(27, 69, 215, 0.1) 0%, transparent 50%),
			radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
		pointer-events: none;
		z-index: 0;
	}

	/* ===== SYSTEM NOTIFICATION ===== */
	.system-notification {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, rgba(27, 69, 215, 0.2) 0%, rgba(123, 44, 191, 0.2) 100%);
		border: 1px solid rgba(0, 212, 255, 0.4);
		border-radius: 4px;
		backdrop-filter: blur(10px);
	}

	.system-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: var(--system-cyan);
		text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
	}

	.system-text {
		font-size: 0.875rem;
		color: var(--ghost-white);
	}

	/* ===== HERO SECTION ===== */
	.hero-title {
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 800;
		color: var(--ghost-white);
		line-height: 1.1;
	}

	.title-glow {
		background: linear-gradient(135deg, var(--shadow-purple) 0%, var(--system-cyan) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 0 30px rgba(123, 44, 191, 0.5));
	}

	.hero-subtitle {
		font-size: clamp(1.25rem, 3vw, 1.75rem);
		font-weight: 600;
		color: var(--ghost-white);
		opacity: 0.9;
	}

	/* ===== QUEST PANEL ===== */
	.quest-panel {
		display: block;
		padding: 1.5rem;
		background: linear-gradient(180deg, var(--abyss-navy) 0%, var(--void-black) 100%);
		border: 1px solid rgba(0, 212, 255, 0.3);
		border-radius: 8px;
		box-shadow:
			0 0 30px rgba(123, 44, 191, 0.2),
			inset 0 0 60px rgba(27, 69, 215, 0.1);
		transition: all 0.3s ease;
	}

	.quest-panel:hover {
		border-color: rgba(0, 212, 255, 0.6);
		box-shadow:
			0 0 40px rgba(123, 44, 191, 0.3),
			inset 0 0 60px rgba(27, 69, 215, 0.15);
		transform: translateY(-2px);
	}

	.quest-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.quest-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: var(--system-cyan);
		text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
	}

	.quest-reward {
		padding: 0.25rem 0.75rem;
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.3);
		border-radius: 4px;
	}

	.quest-title {
		font-size: clamp(1.25rem, 3vw, 1.5rem);
		font-weight: 700;
		color: var(--ghost-white);
		text-align: center;
	}

	.quest-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stat-orb {
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--shadow-purple) 0%, var(--monarch-blue) 100%);
		border: 2px solid var(--void-black);
		border-radius: 50%;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
	}

	.accept-quest {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--system-cyan);
		letter-spacing: 0.05em;
	}

	/* ===== BUTTONS ===== */
	.btn-monarch {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, var(--shadow-purple) 0%, var(--monarch-blue) 100%);
		border: none;
		border-radius: 8px;
		font-size: 1.125rem;
		font-weight: 700;
		color: white;
		text-decoration: none;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.btn-monarch:hover {
		transform: translateY(-2px);
		box-shadow:
			0 6px 25px rgba(123, 44, 191, 0.6),
			0 0 40px rgba(157, 78, 221, 0.3);
	}

	.btn-text {
		position: relative;
		z-index: 1;
	}

	.btn-glow {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s ease;
	}

	.btn-monarch:hover .btn-glow {
		left: 100%;
	}

	.btn-system {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 1rem 2rem;
		background: transparent;
		border: 1px solid rgba(0, 212, 255, 0.5);
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		color: var(--system-cyan);
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.btn-system:hover {
		background: rgba(0, 212, 255, 0.1);
		border-color: var(--system-cyan);
		box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
	}

	/* ===== SECTION HEADERS ===== */
	.section-header {
		text-align: center;
	}

	.section-title {
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 800;
		color: var(--ghost-white);
		margin-bottom: 0.5rem;
	}

	.section-subtitle {
		font-size: 1.125rem;
		color: var(--mist-gray);
		max-width: 600px;
		margin: 0 auto;
	}

	/* ===== SHADOW CARDS ===== */
	.shadow-card {
		position: relative;
		background: linear-gradient(180deg, var(--abyss-navy) 0%, var(--void-black) 100%);
		border: 1px solid var(--ash-gray);
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.shadow-card:hover {
		border-color: var(--type-color, var(--shadow-purple));
		box-shadow: 0 0 30px
			color-mix(in srgb, var(--type-color, var(--shadow-purple)) 30%, transparent);
		transform: translateY(-4px);
	}

	.shadow-card-inner {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.type-badge {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 700;
		border-radius: 4px;
		border: 1px solid;
	}

	.type-badge-large {
		font-size: 2rem;
		font-weight: 800;
		opacity: 0.5;
	}

	.shadow-avatar-container {
		position: relative;
		margin: 0.5rem 0;
	}

	.shadow-avatar {
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
		overflow: hidden;
		border: 2px solid var(--glow-color, var(--shadow-purple));
		box-shadow: 0 0 20px
			color-mix(in srgb, var(--glow-color, var(--shadow-purple)) 40%, transparent);
	}

	@media (min-width: 768px) {
		.shadow-avatar {
			width: 8rem;
			height: 8rem;
		}
	}

	.avatar-ring {
		position: absolute;
		top: -4px;
		left: -4px;
		right: -4px;
		bottom: -4px;
		border-radius: 50%;
		border: 1px solid;
		opacity: 0.3;
		animation: ring-pulse 2s ease-in-out infinite;
	}

	@keyframes ring-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.3;
		}
		50% {
			transform: scale(1.05);
			opacity: 0.5;
		}
	}

	.shadow-info {
		margin-top: 0.5rem;
	}

	.shadow-name {
		font-size: 0.875rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.shadow-person {
		font-size: 0.75rem;
		color: var(--ghost-white);
		text-transform: capitalize;
	}

	@media (min-width: 768px) {
		.shadow-person {
			font-size: 0.875rem;
		}
	}

	.shadow-card-empty {
		min-height: 12rem;
	}

	.shadow-card-empty .shadow-card-inner {
		justify-content: center;
		height: 100%;
	}

	/* ===== DRILL CARDS ===== */
	.drill-card {
		position: relative;
		background: var(--abyss-navy);
		border: 1px solid var(--ash-gray);
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.drill-card:hover {
		border-color: var(--shadow-purple);
		box-shadow: 0 0 30px rgba(123, 44, 191, 0.2);
		transform: translateY(-4px);
	}

	.drill-image {
		position: relative;
		height: 10rem;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.drill-image {
			height: 12rem;
		}
	}

	.drill-image img {
		transition: transform 0.5s ease;
	}

	.drill-card:hover .drill-image img {
		transform: scale(1.1);
	}

	.drill-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 0%, var(--void-black) 100%);
	}

	.drill-number {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--system-cyan);
		text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
	}

	.drill-content {
		padding: 1rem;
	}

	.drill-title {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--ghost-white);
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.drill-title {
			font-size: 1.125rem;
		}
	}

	.drill-excerpt {
		font-size: 0.875rem;
		color: var(--mist-gray);
		margin-top: 0.5rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ===== MONARCH PANEL ===== */
	.monarch-panel {
		margin: 2rem 0;
		border-radius: 16px;
		background: linear-gradient(
			135deg,
			rgba(123, 44, 191, 0.15) 0%,
			rgba(27, 69, 215, 0.15) 50%,
			rgba(10, 21, 67, 0.8) 100%
		);
		border: 1px solid rgba(123, 44, 191, 0.3);
		box-shadow:
			0 0 60px rgba(123, 44, 191, 0.2),
			inset 0 0 100px rgba(27, 69, 215, 0.1);
	}

	.monarch-panel-inner {
		padding: 2rem;
	}

	/* Enneagram Visual */
	.enneagram-visual {
		margin-top: 2rem;
	}

	.enneagram-circle {
		position: relative;
		width: 250px;
		height: 250px;
		margin: 0 auto;
		border: 2px solid rgba(123, 44, 191, 0.3);
		border-radius: 50%;
		box-shadow: 0 0 30px rgba(123, 44, 191, 0.2);
	}

	@media (min-width: 768px) {
		.enneagram-circle {
			width: 300px;
			height: 300px;
		}
	}

	.type-node {
		position: absolute;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--void-black);
		border: 2px solid var(--color);
		border-radius: 50%;
		font-weight: 700;
		color: var(--color);
		box-shadow: 0 0 15px color-mix(in srgb, var(--color) 50%, transparent);
		top: 50%;
		left: 50%;
		transform: rotate(var(--angle)) translate(125px) rotate(calc(-1 * var(--angle)));
	}

	@media (min-width: 768px) {
		.type-node {
			transform: rotate(var(--angle)) translate(150px) rotate(calc(-1 * var(--angle)));
		}
	}

	.center-eye {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--shadow-purple) 0%, var(--monarch-blue) 100%);
		border-radius: 50%;
		box-shadow: 0 0 30px rgba(123, 44, 191, 0.5);
		animation: eye-glow 2s ease-in-out infinite;
	}

	.eye-icon {
		font-size: 1.5rem;
	}

	@keyframes eye-glow {
		0%,
		100% {
			box-shadow: 0 0 30px rgba(123, 44, 191, 0.5);
		}
		50% {
			box-shadow: 0 0 50px rgba(123, 44, 191, 0.8);
		}
	}

	/* ===== SKILL CARDS ===== */
	.skill-card {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.5rem;
		background: linear-gradient(180deg, var(--abyss-navy) 0%, var(--void-black) 100%);
		border: 1px solid var(--ash-gray);
		border-radius: 12px;
		transition: all 0.3s ease;
	}

	.skill-card:hover {
		border-color: var(--shadow-purple);
		box-shadow: 0 0 30px rgba(123, 44, 191, 0.2);
		transform: translateY(-2px);
	}

	.skill-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.skill-content {
		flex: 1;
	}

	.skill-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--ghost-white);
		margin-bottom: 0.5rem;
	}

	.skill-description {
		font-size: 0.875rem;
		color: var(--mist-gray);
		line-height: 1.5;
	}

	.skill-level {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--hunter-gold);
		background: rgba(255, 215, 0, 0.1);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		border: 1px solid rgba(255, 215, 0, 0.3);
	}

	/* ===== FINAL CTA ===== */
	.final-cta {
		border-radius: 16px;
		background: linear-gradient(
			135deg,
			rgba(123, 44, 191, 0.2) 0%,
			rgba(27, 69, 215, 0.2) 50%,
			rgba(10, 21, 67, 0.9) 100%
		);
		border: 1px solid rgba(0, 212, 255, 0.3);
		box-shadow:
			0 0 60px rgba(123, 44, 191, 0.2),
			inset 0 0 100px rgba(27, 69, 215, 0.1);
	}

	.final-cta-inner {
		padding: 3rem 2rem;
		text-align: center;
	}

	.final-title {
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 800;
		color: var(--ghost-white);
		margin-bottom: 0.5rem;
	}

	.final-subtitle {
		font-size: 1.125rem;
		color: var(--mist-gray);
	}

	/* ===== RESPONSIVE HELPERS ===== */
	.desktop-only {
		display: none !important;
	}

	@media (min-width: 768px) {
		.desktop-only {
			display: block !important;
		}
	}

	/* ===== REDUCED MOTION ===== */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.001ms !important;
			transition-duration: 0.001ms !important;
		}
	}
</style>
