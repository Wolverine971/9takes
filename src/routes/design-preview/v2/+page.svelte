<!-- src/routes/design-preview/v2/+page.svelte -->
<!--
  /design-preview/v2 — Streetlamp Symposium V2 mood prototype
  Spec: docs/design/2026-05-01-streetlamp-symposium-v2.md
  V1 ref: docs/design/2026-05-01-streetlamp-symposium-mood.md
  Status: NOT PRODUCTION. Scoped styles only. No global token edits.
  Adds: light-mode parity, two-path hero, Tonight's Open Floor, Library, Stats.
-->
<script lang="ts">
	// --- preview chrome state -------------------------------------------------
	let bannerDismissed = $state(false);
	let theme = $state<'dark' | 'light'>('dark');

	$effect(() => {
		if (typeof window === 'undefined') return;
		const stored = localStorage.getItem('9takes-preview-theme-v2');
		if (stored === 'light' || stored === 'dark') {
			theme = stored;
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			theme = 'light';
		}
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		if (typeof window !== 'undefined') {
			localStorage.setItem('9takes-preview-theme-v2', theme);
		}
	}

	function dismissBanner() {
		bannerDismissed = true;
	}

	// --- stub data ------------------------------------------------------------
	type DemoTake = { type: number; name: string; hint: string };
	type OpenFloorTake = {
		type: number;
		typeName: string;
		take: string;
		upvotes: number;
		replies: number;
		timestamp: string;
	};
	type LibraryStub = {
		id: string;
		type: number;
		typeName: string;
		name: string;
		subtitle: string;
		stats: { label: string; value: number }[];
	};
	type StatBlock = { label: string; value: string; annotation: string };
	type Read = { num: string; title: string; href: string };
	type Step = { num: string; title: string; body: string };

	const tonightsQuestion = 'What is something people misunderstand about you?';

	const demoTakes: DemoTake[] = [
		{
			type: 4,
			name: 'Soul Weaver',
			hint: "They think I'm dramatic. I'm trying to feel something real..."
		},
		{
			type: 6,
			name: 'Iron Guard',
			hint: "They think I'm anxious. I'm scanning for the threat they missed..."
		},
		{
			type: 8,
			name: 'War Commander',
			hint: "They think I'm angry. I'm just refusing to fold for fake politeness..."
		}
	];

	const openFloorTakes: OpenFloorTake[] = [
		{
			type: 4,
			typeName: 'The Individualist',
			take: "They think I'm being dramatic. The truth is I'm trying to find something authentic in a moment that feels performative — and watching everyone else play along makes me feel more alone, not less. The drama is the search.",
			upvotes: 47,
			replies: 12,
			timestamp: '23:47'
		},
		{
			type: 6,
			typeName: 'The Loyalist',
			take: "People read my questions as anxiety. They're not — they're load-bearing. I'm checking the structure of what we're about to do because no one else is. The day someone is grateful I asked is the day I trust them.",
			upvotes: 38,
			replies: 9,
			timestamp: '23:51'
		},
		{
			type: 8,
			typeName: 'The Challenger',
			take: "They think I'm angry. I'm not. I'm just refusing to fold to keep things polite when something is actually wrong. The anger they're reading is the absence of the social muting they expected.",
			upvotes: 61,
			replies: 18,
			timestamp: '23:54'
		}
	];

	const libraryStubs: LibraryStub[] = [
		{
			id: '0042',
			type: 8,
			typeName: 'Challenger',
			name: 'Steve Jobs',
			subtitle:
				'The chaos in his decisions makes more sense once you see the Type 8 stress line to 5.',
			stats: [
				{ label: 'INSIGHT', value: 88 },
				{ label: 'DIRECTNESS', value: 99 },
				{ label: 'PATIENCE', value: 14 },
				{ label: 'ANGER', value: 91 }
			]
		},
		{
			id: '0073',
			type: 4,
			typeName: 'Individualist',
			name: 'Frida Kahlo',
			subtitle: 'Why her self-portraits feel inevitable, not performative.',
			stats: [
				{ label: 'INSIGHT', value: 94 },
				{ label: 'DIRECTNESS', value: 71 },
				{ label: 'PATIENCE', value: 42 },
				{ label: 'ANGER', value: 67 }
			]
		},
		{
			id: '0118',
			type: 5,
			typeName: 'Investigator',
			name: 'Marie Curie',
			subtitle: 'A laboratory was the only room where the rules made sense to her.',
			stats: [
				{ label: 'INSIGHT', value: 97 },
				{ label: 'DIRECTNESS', value: 62 },
				{ label: 'PATIENCE', value: 88 },
				{ label: 'ANGER', value: 23 }
			]
		},
		{
			id: '0205',
			type: 1,
			typeName: 'Perfectionist',
			name: 'Hermione Granger',
			subtitle:
				'The original Type 1 archetype, written before the Enneagram entered popular culture.',
			stats: [
				{ label: 'INSIGHT', value: 90 },
				{ label: 'DIRECTNESS', value: 78 },
				{ label: 'PATIENCE', value: 64 },
				{ label: 'ANGER', value: 55 }
			]
		},
		{
			id: '0312',
			type: 7,
			typeName: 'Enthusiast',
			name: 'Anthony Bourdain',
			subtitle:
				'The Type 7 who could not outrun his own pattern. A study in the cost of constant motion.',
			stats: [
				{ label: 'INSIGHT', value: 89 },
				{ label: 'DIRECTNESS', value: 84 },
				{ label: 'PATIENCE', value: 38 },
				{ label: 'ANGER', value: 52 }
			]
		},
		{
			id: '0488',
			type: 9,
			typeName: 'Peacemaker',
			name: 'Mr. Rogers',
			subtitle: 'A masterclass in the Type 9 who chose presence over withdrawal.',
			stats: [
				{ label: 'INSIGHT', value: 86 },
				{ label: 'DIRECTNESS', value: 41 },
				{ label: 'PATIENCE', value: 99 },
				{ label: 'ANGER', value: 12 }
			]
		}
	];

	const corpusStats: StatBlock[] = [
		{ label: 'DOSSIERS COMPILED', value: '1,247', annotation: 'growing' },
		{ label: 'EMOTIONAL FRAMES', value: '9', annotation: 'exact' },
		{ label: 'LINEAGE', value: '2,500 yr', annotation: 'plato → now' },
		{ label: 'COMMENTS GATHERED', value: '47,000+', annotation: 'unbiased' }
	];

	const reads: Read[] = [
		{ num: '01', title: '9 minutes of reading on what 9takes actually is', href: '/community' },
		{
			num: '02',
			title: 'A self-typing primer (find your type without a 200-question quiz)',
			href: '/enneagram-test'
		},
		{
			num: '03',
			title: 'How to use 9takes — the give-first ritual explained',
			href: '/enneagram-corner'
		}
	];

	const hookLines = [
		"She's not 'being difficult.' Type 1s need things done right the first time.",
		"He's not 'too intense.' Type 8s test you to see if you'll fold.",
		"Your friend isn't 'flaky.' Type 7s are running from emotional pain."
	];

	type DossierStat = { label: string; value: number };
	const dossierStats: DossierStat[] = [
		{ label: 'INSIGHT', value: 82 },
		{ label: 'DIRECTNESS', value: 100 },
		{ label: 'PATIENCE', value: 31 },
		{ label: 'EMPATHY', value: 56 },
		{ label: 'ANGER', value: 90 }
	];

	const steps: Step[] = [
		{
			num: '01',
			title: 'Drop your situation',
			body: 'Anonymous. No karma games. Just the situation as you actually see it.'
		},
		{
			num: '02',
			title: 'Give your take first',
			body: 'Comment before reading. The give-first unlock keeps the room honest.'
		},
		{
			num: '03',
			title: 'Unlock 9 perspectives',
			body: 'See how each Enneagram type reads the same moment. Patterns appear.'
		}
	];
</script>

<svelte:head>
	<title>Design Preview V2 — Streetlamp Symposium · 9takes</title>
	<meta name="robots" content="noindex, nofollow" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if !bannerDismissed}
	<div
		class="streetlamp-banner-v2"
		class:light-banner={theme === 'light'}
		role="status"
		aria-live="polite"
	>
		<span class="banner-text">
			<span aria-hidden="true">🚧</span>
			DESIGN PREVIEW — Streetlamp Symposium v2 · 2026-05-01 · not production
		</span>
		<button
			class="banner-dismiss"
			type="button"
			onclick={dismissBanner}
			aria-label="Dismiss preview banner"
		>
			✕
		</button>
	</div>
{/if}

<div
	class="streetlamp-preview-v2"
	class:light-mode={theme === 'light'}
	class:banner-visible={!bannerDismissed}
>
	<button
		class="theme-toggle"
		type="button"
		onclick={toggleTheme}
		aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	>
		{theme === 'dark' ? '☀' : '🌙'}
	</button>

	<!-- ============================================================
	  SECTION 1 — HERO · two-path decision
	  ============================================================ -->
	<section class="hero">
		<div class="grain" aria-hidden="true"></div>
		<div class="hero-pool" aria-hidden="true"></div>

		<div class="hero-grid">
			<div class="hero-text">
				<div class="dossier-eyebrow">
					<span class="mono">§01 · OBSERVATION</span>
				</div>

				<h1 class="display-xl">See the emotions behind every take.</h1>

				<div class="scale-marker" aria-hidden="true">
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick tick--major"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
				</div>

				<p class="mono coords">LAT 37.9755° N · LONG 23.7348° E · ATHENS · 2,500 YR LINEAGE</p>

				<p class="subhead">
					Decode social dynamics. Personality-max your EQ. Turn conflict into understanding.
				</p>
			</div>

			<div class="hero-subject" aria-hidden="true">
				<div class="subject-frame">
					<img
						src="/greek_distorted_statue_face.png"
						alt=""
						class="statue"
						loading="eager"
						decoding="async"
					/>
					<div class="subject-vignette"></div>
					<div class="subject-mono">
						<span class="mono">SUBJECT · MARBLE · CHIAROSCURO</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Two-path decision panels -->
		<div class="path-grid">
			<article class="path-card path-card--newcomer">
				<div class="path-header">
					<span class="mono path-label path-label--amber">I'M NEW</span>
				</div>
				<h2 class="display-md path-title">
					Tired of personality tests that describe you but never help you change?
				</h2>
				<p class="path-intro">
					Start with the orientation. We&rsquo;ll show you the room, the rules, and how to use it.
				</p>

				<span class="mono path-subhead">START WITH:</span>
				<ul class="reads-list">
					{#each reads as read}
						<li class="reads-item">
							<a class="reads-link" href={read.href}>
								<span class="mono reads-num">{read.num}</span>
								<span class="reads-arrow" aria-hidden="true">→</span>
								<span class="reads-title">{read.title}</span>
							</a>
						</li>
					{/each}
				</ul>

				<a class="cta-primary path-cta" href="/community">
					Start the primer
					<span aria-hidden="true">→</span>
				</a>
			</article>

			<article class="path-card path-card--typed">
				<div class="path-header">
					<span class="mono path-label path-label--teal">I KNOW MY TYPE</span>
				</div>
				<h2 class="display-md path-title">
					Ready to see how the other 8 types actually read the same situation you would?
				</h2>
				<p class="path-intro">
					Tonight&rsquo;s floor is open. Drop your take to unlock the others.
				</p>

				<span class="mono path-subhead">TONIGHT'S OPEN FLOOR</span>
				<blockquote class="hero-question">{tonightsQuestion}</blockquote>

				<ul class="demo-list">
					{#each demoTakes as demo}
						<li class="demo-card" style="--type-stripe: var(--type-{demo.type}-color);">
							<div class="demo-card-top">
								<span class="mono demo-card-label">
									TYPE {demo.type} · {demo.name.toUpperCase()} · LOCKED
								</span>
								<span class="mono demo-lock" aria-hidden="true">◇</span>
							</div>
							<p class="demo-hint">{demo.hint}</p>
						</li>
					{/each}
				</ul>

				<a class="cta-primary path-cta path-cta--teal" href="/questions">
					Give your take
					<span aria-hidden="true">→</span>
				</a>
			</article>
		</div>
	</section>

	<!-- ============================================================
	  SECTION 2 — THE HOOK · "We know things"
	  ============================================================ -->
	<section class="hook">
		<div class="hook-grid">
			<div class="hook-left">
				<span class="mono section-tag">§02 · DIAGNOSIS</span>
				<h2 class="display-md">Most people walk around blind to their own patterns.</h2>
			</div>

			<div class="hook-right">
				<ul class="hook-lines">
					{#each hookLines as line}
						<li class="hook-line">
							<span class="arrow" aria-hidden="true">→</span>
							<span class="line-body">{line}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- ============================================================
	  SECTION 3 — TONIGHT'S OPEN FLOOR · proof-of-concept demo
	  ============================================================ -->
	<section class="open-floor">
		<div class="open-floor-pool" aria-hidden="true"></div>
		<header class="open-floor-header">
			<span class="mono section-tag">§03 · THE FLOOR IS OPEN</span>
			<h2 class="display-md">Tonight&rsquo;s Open Floor.</h2>
			<p class="mono open-floor-kicker">OPEN · MAY 1 · 137 RESPONSES SO FAR</p>
			<blockquote class="open-floor-question">
				&ldquo;{tonightsQuestion}&rdquo;
			</blockquote>
		</header>

		<ul class="open-floor-takes">
			{#each openFloorTakes as t}
				<li class="take-card" style="--type-stripe: var(--type-{t.type}-color);">
					<div class="take-card-top">
						<span class="mono take-card-label">
							TYPE {t.type} · {t.typeName.toUpperCase()} · TAKEN AT {t.timestamp}
						</span>
					</div>
					<p class="take-body">{t.take}</p>
					<div class="take-meta">
						<span class="mono">↑ {t.upvotes}</span>
						<span class="mono dot-sep" aria-hidden="true">·</span>
						<span class="mono">{t.replies} REPLIES</span>
						<span class="mono dot-sep" aria-hidden="true">·</span>
						<span class="mono">BY @ANON</span>
					</div>
				</li>
			{/each}
		</ul>

		<div class="open-floor-cta-row">
			<a class="cta-primary" href="/questions">
				Drop your take
				<span aria-hidden="true">→</span>
			</a>
			<p class="mono open-floor-footnote">
				the platform locks responses until you give yours · this preview shows three for the demo
			</p>
		</div>
	</section>

	<!-- ============================================================
	  SECTION 4 — THE LIBRARY · famous-people dossier grid
	  ============================================================ -->
	<section class="library">
		<header class="library-header">
			<span class="mono section-tag">§04 · CASE FILES</span>
			<h2 class="display-md">The Library.</h2>
			<p class="library-sub">
				We compile dossiers on the people you&rsquo;re already curious about. Athletes, founders,
				fictional characters, public figures &mdash; read at the level you&rsquo;d expect from a
				private investigator, not a clickbait personality blog.
			</p>
			<p class="mono library-kicker">THE LIBRARY · 1,247 DOSSIERS · 9 TYPES · GROWING</p>
		</header>

		<div class="library-grid">
			{#each libraryStubs as d}
				<article class="library-card" style="--type-stripe: var(--type-{d.type}-color);">
					<div class="library-image-wrap">
						<div class="library-image-stub" aria-hidden="true">
							<span class="mono">[SUBJECT IMG]</span>
						</div>
					</div>
					<div class="library-card-body">
						<span class="mono library-dossier-id">
							DOSSIER №.{d.id} · TYPE {d.type} · {d.typeName.toUpperCase()}
						</span>
						<h3 class="library-name">{d.name}</h3>
						<p class="library-subtitle">{d.subtitle}</p>
						<div class="library-mini-stats">
							{#each d.stats as s}
								<div class="library-mini-stat">
									<span class="mono mini-stat-label">{s.label}</span>
									<span class="mono mini-stat-value">{s.value}</span>
								</div>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</div>

		<div class="library-cta-row">
			<a class="cta-primary cta-primary--ghost" href="/personality-analysis">
				Browse all 1,247 dossiers
				<span aria-hidden="true">→</span>
			</a>
		</div>
	</section>

	<!-- ============================================================
	  SECTION 5 — WHAT WE'VE COMPILED · corpus stats
	  ============================================================ -->
	<section class="compiled">
		<div class="compiled-pool" aria-hidden="true"></div>
		<header class="compiled-header">
			<span class="mono section-tag">§05 · CORPUS</span>
			<h2 class="display-md">What we&rsquo;ve compiled.</h2>
		</header>

		<div class="compiled-grid">
			{#each corpusStats as s}
				<div class="compiled-stat">
					<span class="mono compiled-stat-label">{s.label}</span>
					<span class="compiled-stat-value">{s.value}</span>
					<span class="mono compiled-stat-annotation">— {s.annotation} —</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- ============================================================
	  SECTION 6 — THE DOSSIER · Type VIII single zoom
	  ============================================================ -->
	<section class="dossier">
		<div class="dossier-pool" aria-hidden="true"></div>

		<header class="dossier-header">
			<span class="mono section-tag">§06 · DEEP ZOOM</span>
			<h2 class="display-md">Inside one dossier.</h2>
		</header>

		<article class="dossier-card">
			<div class="dossier-card-top">
				<span class="mono dossier-id">DOSSIER №.0008 · DECLASSIFIED · TYPE VIII</span>
				<span class="mono dossier-status">
					<span class="status-dot" aria-hidden="true"></span>
					STATUS: ACTIVE · LAST OBSERVED: 2026-05-01
				</span>
			</div>

			<div class="dossier-body">
				<div class="dossier-subject">
					<div class="subject-stack">
						<img
							src="/greek_pantheon.webp"
							alt=""
							class="dossier-image"
							loading="lazy"
							decoding="async"
						/>
						<div class="dossier-image-vignette" aria-hidden="true"></div>
						<div class="corner corner--tl" aria-hidden="true"></div>
						<div class="corner corner--tr" aria-hidden="true"></div>
						<div class="corner corner--bl" aria-hidden="true"></div>
						<div class="corner corner--br" aria-hidden="true"></div>
					</div>
					<p class="mono subject-meta">SPECIMEN · BUST · MARBLE · GREECE · UNDATED</p>
				</div>

				<div class="dossier-content">
					<h3 class="dossier-title display-md">The Challenger.</h3>
					<p class="mono dossier-core">CORE FEAR: Being controlled · CORE DESIRE: Self-mastery</p>

					<div class="stats">
						{#each dossierStats as stat}
							<div class="stat-row">
								<span class="mono stat-label">{stat.label}</span>
								<div class="stat-track" aria-hidden="true">
									<div class="stat-fill" style="width: {stat.value}%"></div>
								</div>
								<span class="mono stat-value">{stat.value}%</span>
							</div>
						{/each}
					</div>

					<aside class="dossier-annotations" aria-label="Cross-references">
						<span class="mono">§3.2 SHADOW TRIAD</span>
						<span class="mono">§4.1 STRESS LINE → 5</span>
						<span class="mono">§4.2 GROWTH LINE → 2</span>
					</aside>

					<div class="dossier-cta-row">
						<a class="dossier-link" href="/personality-analysis">
							Read the full dossier
							<span aria-hidden="true">→</span>
						</a>
					</div>
				</div>
			</div>
		</article>
	</section>

	<!-- ============================================================
	  SECTION 7 — THE MEETUP · give-first
	  ============================================================ -->
	<section class="meetup">
		<div class="meetup-bg" aria-hidden="true"></div>
		<div class="meetup-pool" aria-hidden="true"></div>

		<header class="meetup-header">
			<span class="mono section-tag">§07 · THE ROOM</span>
			<h2 class="display-md">
				It&rsquo;s like a 2 AM conversation with people who actually get it.
			</h2>
			<p class="meetup-sub">
				Drop your situation. Comment first &mdash; that&rsquo;s the give-first unlock. Then see how
				each of the 9 types reads it.
			</p>
		</header>

		<ol class="steps">
			{#each steps as step}
				<li class="step-card">
					<div class="step-num-row">
						<span class="mono step-num">STEP {step.num}</span>
						<span class="step-rule" aria-hidden="true"></span>
					</div>
					<h3 class="step-title">{step.title}</h3>
					<p class="step-body">{step.body}</p>
				</li>
			{/each}
		</ol>
	</section>

	<!-- ============================================================
	  SECTION 8 — FOOTER · quiet
	  ============================================================ -->
	<footer class="quiet-footer">
		<p class="footer-tagline">One situation, 9 ways to see it.</p>
		<nav class="footer-nav" aria-label="Footer">
			<a href="/questions">Questions</a>
			<span class="dot" aria-hidden="true">·</span>
			<a href="/personality-analysis">Personality Analysis</a>
			<span class="dot" aria-hidden="true">·</span>
			<a href="/enneagram-corner">Enneagram Corner</a>
			<span class="dot" aria-hidden="true">·</span>
			<a href="/book-session">Book a Session</a>
		</nav>
		<p class="footer-copy mono">© 2026 9TAKES · STREETLAMP SYMPOSIUM V2 PREVIEW</p>
	</footer>
</div>

<style lang="scss">
	/* =========================================================
	  Scoped tokens for the Streetlamp Symposium V2 preview.
	  Confined to .streetlamp-preview-v2 so they cannot leak.
	  ========================================================= */
	.streetlamp-preview-v2 {
		/* dark mode (default) — same as V1 */
		--night-deep: #0a0807;
		--night-mid: #16110d;
		--stone-warm: #241d17;
		--stone-mid: #3a302a;
		--stone-edge: #5c4f47;

		--lamp-glow: #f59e0b;
		--lamp-deep: #b45309;
		--lamp-light: #fbbf24;
		--lamp-soft: rgba(245, 158, 11, 0.14);
		--lamp-glow-rgba: rgba(245, 158, 11, 0.4);

		--marble-pure: #faf8f4;
		--marble-warm: #ede6da;
		--marble-shadow: #a8a095;

		--data-teal: #0d9488;
		--data-cyan: #5eead4;

		--ink-bright: #faf8f4;
		--ink-mid: #a8a095;
		--ink-dim: #5c4f47;
		--ink-muted: #3a302a;

		/* warm-pool radial alpha (overridden in light mode) */
		--pool-alpha-strong: 0.28;
		--pool-alpha-mid: 0.18;
		--pool-alpha-soft: 0.08;
		--pool-rgb: 245, 158, 11;
		--pool-deep-rgb: 180, 83, 9;
		--statue-blend: screen;
		--grain-opacity: 0.05;

		/* button text on amber CTA — adjusted in light mode */
		--cta-text: var(--night-deep);

		--font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
		--font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
		--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: var(--font-sans);
		min-height: 100vh;
		overflow: hidden;
		position: relative;
		transition:
			background 0.25s ease,
			color 0.25s ease;

		&.banner-visible {
			padding-top: 36px;

			@media (max-width: 640px) {
				padding-top: 56px;
			}
		}

		&.light-mode {
			--night-deep: #faf8f4;
			--night-mid: #f2ebdd;
			--stone-warm: #ffffff;
			--stone-mid: #f5f0e8;
			--stone-edge: #d6ccb8;

			--lamp-glow: #b45309;
			--lamp-deep: #92400e;
			--lamp-light: #d97706;
			--lamp-soft: rgba(180, 83, 9, 0.1);
			--lamp-glow-rgba: rgba(217, 119, 6, 0.18);

			--marble-pure: #ffffff;
			--marble-warm: #faf8f4;
			--marble-shadow: #8b7e6e;

			--data-teal: #0f766e;
			--data-cyan: #14b8a6;

			--ink-bright: #1c1917;
			--ink-mid: #44403c;
			--ink-dim: #78716c;
			--ink-muted: #a8a29e;

			--pool-alpha-strong: 0.14;
			--pool-alpha-mid: 0.08;
			--pool-alpha-soft: 0.04;
			--pool-rgb: 217, 119, 6;
			--pool-deep-rgb: 180, 83, 9;
			--statue-blend: normal;
			--grain-opacity: 0.025;

			/* On light mode, amber CTAs need light text (white/parchment) for contrast */
			--cta-text: #faf8f4;
		}

		/* Reset opinionated global styles that can leak in */
		& :global(p),
		& :global(h1),
		& :global(h2),
		& :global(h3) {
			margin: 0;
		}

		& :global(ul),
		& :global(ol) {
			list-style: none;
			padding: 0;
			margin: 0;
		}

		& :global(a) {
			color: inherit;
			text-decoration: none;
		}

		& :global(blockquote) {
			margin: 0;
		}
	}

	/* ---------- shared utilities ---------- */
	.mono {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.display-xl {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: clamp(40px, 7vw, 72px);
		line-height: 1.02;
		letter-spacing: -0.02em;
		color: var(--ink-bright);
		font-variation-settings: 'opsz' 144;
	}

	.display-md {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: clamp(28px, 4vw, 40px);
		line-height: 1.1;
		letter-spacing: -0.01em;
		color: var(--ink-bright);
		font-variation-settings: 'opsz' 96;
	}

	.section-tag {
		display: inline-block;
		margin-bottom: 16px;
		color: var(--lamp-glow);
	}

	/* ---------- preview banner ---------- */
	.streetlamp-banner-v2 {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		background: #16110d;
		border-bottom: 1px solid rgba(245, 158, 11, 0.35);
		color: #fbbf24;
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 10px 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		box-shadow:
			0 1px 0 rgba(245, 158, 11, 0.2),
			0 6px 20px rgba(0, 0, 0, 0.45);

		&.light-banner {
			background: #fff8ec;
			color: #92400e;
			border-bottom-color: rgba(180, 83, 9, 0.35);
			box-shadow:
				0 1px 0 rgba(180, 83, 9, 0.18),
				0 6px 16px rgba(180, 83, 9, 0.08);

			.banner-dismiss {
				color: #92400e;
				border-color: rgba(180, 83, 9, 0.35);

				&:hover {
					background: rgba(180, 83, 9, 0.1);
				}
			}
		}

		.banner-text {
			text-align: center;
			line-height: 1.4;
		}

		.banner-dismiss {
			background: transparent;
			border: 1px solid rgba(245, 158, 11, 0.35);
			color: #fbbf24;
			width: 22px;
			height: 22px;
			border-radius: 4px;
			cursor: pointer;
			line-height: 1;
			font-size: 11px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			transition: background 0.15s ease;

			&:hover {
				background: rgba(245, 158, 11, 0.14);
			}
		}

		@media (max-width: 640px) {
			padding: 8px 12px;
			font-size: 10px;
			letter-spacing: 0.04em;
		}
	}

	/* ---------- theme toggle ---------- */
	.theme-toggle {
		position: fixed;
		top: 80px;
		right: 24px;
		z-index: 999;
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: var(--stone-warm);
		color: var(--ink-bright);
		border: 1px solid var(--stone-edge);
		font-size: 18px;
		line-height: 1;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition:
			background 0.18s ease,
			border-color 0.18s ease,
			transform 0.18s ease,
			box-shadow 0.18s ease;

		&:hover {
			border-color: var(--lamp-glow);
			box-shadow: 0 0 18px var(--lamp-glow-rgba);
			transform: translateY(-1px);
		}

		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}

		@media (max-width: 640px) {
			top: 68px;
			right: 12px;
			width: 38px;
			height: 38px;
			font-size: 16px;
		}
	}

	/* ---------- subtle paper grain (svg-noise overlay) ---------- */
	.grain {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--grain-opacity);
		mix-blend-mode: overlay;
		z-index: 1;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.85 0 0 0 0 0.6 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
	}

	/* =========================================================
	  SECTION 1 — HERO
	  ========================================================= */
	.hero {
		position: relative;
		padding: 96px 48px 72px;
		background: var(--night-deep);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 64px 20px 56px;
		}
	}

	.hero-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 60% 55% at 18% 8%,
				rgba(var(--pool-rgb), var(--pool-alpha-strong)) 0%,
				rgba(var(--pool-rgb), var(--pool-alpha-soft)) 30%,
				transparent 60%
			),
			radial-gradient(
				ellipse 90% 70% at 22% 12%,
				rgba(var(--pool-deep-rgb), var(--pool-alpha-mid)) 0%,
				transparent 55%
			);
		z-index: 0;
	}

	.hero-grid {
		position: relative;
		z-index: 2;
		max-width: 1280px;
		margin: 0 auto 64px;
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 64px;
		align-items: center;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 32px;
			margin-bottom: 48px;
		}
	}

	.hero-text {
		max-width: 640px;
	}

	.dossier-eyebrow {
		margin-bottom: 24px;

		.mono {
			color: var(--lamp-glow);
		}
	}

	.scale-marker {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 18px;
		margin: 28px 0 16px;
		opacity: 0.7;

		.tick {
			width: 1px;
			height: 8px;
			background: var(--stone-edge);

			&--major {
				height: 16px;
				background: var(--lamp-glow);
				width: 1.5px;
			}
		}
	}

	.coords {
		color: var(--ink-dim);
		margin-bottom: 32px;
	}

	.subhead {
		font-family: var(--font-sans);
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 560px;
	}

	/* ---- hero subject (statue) ---- */
	.hero-subject {
		position: relative;

		@media (max-width: 968px) {
			display: none;
		}
	}

	.subject-frame {
		position: relative;
		aspect-ratio: 4 / 5;
		max-height: 560px;
		margin-left: auto;
		overflow: hidden;
	}

	.statue {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
		filter: contrast(1.18) brightness(1.04) saturate(0.88);
		mix-blend-mode: var(--statue-blend);
	}

	.streetlamp-preview-v2.light-mode .statue {
		filter: contrast(1.05) brightness(1) saturate(1);
	}

	.subject-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.22) 0%, transparent 55%),
			linear-gradient(135deg, transparent 35%, rgba(10, 8, 7, 0.65) 100%),
			linear-gradient(180deg, transparent 60%, rgba(10, 8, 7, 0.85) 100%);
	}

	.streetlamp-preview-v2.light-mode .subject-vignette {
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.08) 0%, transparent 55%),
			linear-gradient(135deg, transparent 60%, rgba(180, 83, 9, 0.06) 100%);
	}

	.subject-mono {
		position: absolute;
		left: 12px;
		bottom: 12px;
		color: var(--ink-mid);

		.mono {
			color: var(--ink-mid);
		}
	}

	/* ---- two-path decision panels ---- */
	.path-grid {
		position: relative;
		z-index: 2;
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 16px;
		}
	}

	.path-card {
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 18px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;

		@media (max-width: 540px) {
			padding: 22px;
		}

		&:hover {
			border-color: var(--lamp-glow);
		}
	}

	.path-card--typed:hover {
		border-color: var(--data-teal);
	}

	.path-header {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.path-label {
		display: inline-block;
		padding: 4px 10px;
		border-radius: 999px;
		background: var(--lamp-soft);
		font-size: 11px;
	}

	.path-label--amber {
		color: var(--lamp-glow);
	}

	.path-label--teal {
		color: var(--data-teal);
		background: rgba(13, 148, 136, 0.12);
	}

	.streetlamp-preview-v2.light-mode .path-label--teal {
		background: rgba(15, 118, 110, 0.12);
	}

	.path-title {
		font-size: clamp(22px, 2.6vw, 30px);
	}

	.path-intro {
		font-family: var(--font-sans);
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	.path-subhead {
		color: var(--ink-dim);
		margin-top: 8px;
	}

	.reads-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.reads-item {
		border-bottom: 1px solid var(--stone-mid);

		&:last-child {
			border-bottom: none;
		}
	}

	.reads-link {
		display: grid;
		grid-template-columns: 28px 18px 1fr;
		align-items: center;
		gap: 10px;
		padding: 12px 0;
		font-family: var(--font-sans);
		font-size: 15px;
		line-height: 1.45;
		color: var(--ink-bright);
		transition:
			color 0.18s ease,
			transform 0.18s ease;

		&:hover {
			color: var(--lamp-glow);

			.reads-arrow {
				transform: translateX(3px);
			}
		}
	}

	.reads-num {
		color: var(--ink-dim);
	}

	.reads-arrow {
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 13px;
		transition: transform 0.18s ease;
	}

	.reads-title {
		color: var(--ink-bright);
	}

	/* hero question + locked demo cards */
	.hero-question {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: clamp(18px, 2vw, 22px);
		line-height: 1.35;
		color: var(--ink-bright);
		padding: 8px 0 8px 16px;
		border-left: 3px solid var(--lamp-glow);
	}

	.demo-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.demo-card {
		--type-stripe: var(--lamp-glow);
		position: relative;
		background: var(--night-mid);
		border: 1px solid var(--stone-edge);
		border-left: 3px solid var(--type-stripe);
		border-radius: 6px;
		padding: 12px 14px 12px 16px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.demo-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.demo-card-label {
		color: var(--type-stripe);
		font-size: 10.5px;
	}

	.demo-lock {
		color: var(--ink-dim);
		font-size: 14px;
	}

	.demo-hint {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 14.5px;
		line-height: 1.45;
		color: var(--ink-mid);
	}

	/* CTA buttons */
	.cta-primary {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		background: var(--lamp-glow);
		color: var(--cta-text);
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 16px;
		letter-spacing: 0.01em;
		padding: 14px 24px;
		border-radius: 6px;
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease,
			background 0.18s ease;
		border: 1px solid rgba(251, 191, 36, 0.5);
		align-self: flex-start;

		span {
			transition: transform 0.18s ease;
		}

		&:hover {
			background: var(--lamp-light);
			box-shadow:
				0 0 32px var(--lamp-glow-rgba),
				0 0 1px rgba(251, 191, 36, 0.6) inset;
			transform: translateY(-1px);

			span {
				transform: translateX(3px);
			}
		}
	}

	.streetlamp-preview-v2.light-mode .cta-primary {
		border-color: rgba(180, 83, 9, 0.55);

		&:hover {
			background: var(--lamp-deep);
		}
	}

	.cta-primary--ghost {
		background: transparent;
		color: var(--lamp-glow);
		border: 1px solid var(--lamp-glow);

		&:hover {
			background: var(--lamp-soft);
			color: var(--lamp-light);
			box-shadow: 0 0 18px var(--lamp-glow-rgba);
		}
	}

	.streetlamp-preview-v2.light-mode .cta-primary--ghost {
		color: var(--lamp-glow);
		border-color: var(--lamp-glow);

		&:hover {
			color: var(--lamp-deep);
			background: var(--lamp-soft);
		}
	}

	.path-cta {
		margin-top: 12px;
	}

	.path-cta--teal {
		background: var(--data-teal);
		border-color: rgba(94, 234, 212, 0.35);

		&:hover {
			background: var(--data-cyan);
			color: var(--night-deep);
			box-shadow: 0 0 32px rgba(94, 234, 212, 0.35);
		}
	}

	.streetlamp-preview-v2.light-mode .path-cta--teal {
		border-color: rgba(15, 118, 110, 0.55);
		color: #faf8f4;

		&:hover {
			background: #115e59;
			color: #faf8f4;
			box-shadow: 0 0 24px rgba(15, 118, 110, 0.3);
		}
	}

	/* =========================================================
	  SECTION 2 — HOOK
	  ========================================================= */
	.hook {
		background: var(--night-deep);
		padding: 96px 48px;
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.hook-grid {
		max-width: 1180px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: start;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 32px;
		}
	}

	.hook-left {
		max-width: 480px;
	}

	.hook-lines {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.hook-line {
		display: grid;
		grid-template-columns: 24px 1fr;
		gap: 12px;
		font-family: var(--font-sans);
		font-size: 18px;
		line-height: 1.5;
		color: var(--ink-bright);
		padding-bottom: 28px;
		border-bottom: 1px solid var(--stone-mid);

		&:last-child {
			border-bottom: none;
			padding-bottom: 0;
		}

		.arrow {
			color: var(--lamp-glow);
			font-weight: 600;
			font-family: var(--font-mono);
		}

		.line-body {
			color: var(--ink-bright);
		}
	}

	/* =========================================================
	  SECTION 3 — TONIGHT'S OPEN FLOOR
	  ========================================================= */
	.open-floor {
		position: relative;
		padding: 120px 48px;
		background: var(--night-deep);
		overflow: hidden;
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 72px 20px;
		}
	}

	.open-floor-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 80% 60% at 50% 0%,
			rgba(var(--pool-rgb), var(--pool-alpha-mid)) 0%,
			transparent 55%
		);
	}

	.open-floor-header {
		position: relative;
		z-index: 1;
		max-width: 820px;
		margin: 0 auto 56px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.open-floor-kicker {
		color: var(--ink-dim);
	}

	.open-floor-question {
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 500;
		font-size: clamp(24px, 3.4vw, 36px);
		line-height: 1.25;
		color: var(--ink-bright);
		padding: 16px 0 16px 24px;
		margin-top: 12px;
		border-left: 3px solid var(--lamp-glow);
		text-align: left;
		max-width: 720px;
		font-variation-settings: 'opsz' 96;
	}

	.open-floor-takes {
		position: relative;
		z-index: 1;
		max-width: 880px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.take-card {
		--type-stripe: var(--lamp-glow);
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-left: 3px solid var(--type-stripe);
		border-radius: 8px;
		padding: 22px 26px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease;

		&:hover {
			border-color: var(--type-stripe);
			border-left-color: var(--type-stripe);
		}

		@media (max-width: 540px) {
			padding: 18px 20px;
		}
	}

	.take-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.take-card-label {
		color: var(--type-stripe);
	}

	.take-body {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-bright);
		font-variation-settings: 'opsz' 96;
	}

	.take-meta {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		padding-top: 8px;
		border-top: 1px dashed var(--stone-mid);

		.mono {
			color: var(--ink-dim);
		}

		.dot-sep {
			color: var(--ink-muted);
		}
	}

	.open-floor-cta-row {
		position: relative;
		z-index: 1;
		max-width: 880px;
		margin: 40px auto 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
		align-items: center;
		text-align: center;
	}

	.open-floor-footnote {
		color: var(--ink-dim);
		text-transform: none;
		letter-spacing: 0.04em;
		font-size: 11.5px;
	}

	/* =========================================================
	  SECTION 4 — THE LIBRARY
	  ========================================================= */
	.library {
		padding: 120px 48px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 72px 20px;
		}
	}

	.library-header {
		max-width: 820px;
		margin: 0 auto 48px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.library-sub {
		font-family: var(--font-sans);
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 720px;
	}

	.library-kicker {
		color: var(--ink-dim);
		margin-top: 4px;
	}

	.library-grid {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 22px;

		@media (max-width: 968px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: 640px) {
			grid-template-columns: 1fr;
		}
	}

	.library-card {
		--type-stripe: var(--lamp-glow);
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease;

		&:hover {
			background: var(--stone-mid);
			border-color: var(--type-stripe);
			transform: translateY(-2px);
		}
	}

	.library-image-wrap {
		position: relative;
		border-bottom: 1px solid var(--stone-edge);
	}

	.library-image-stub {
		aspect-ratio: 4 / 3;
		background: var(--stone-mid);
		background-image: repeating-linear-gradient(
			45deg,
			transparent 0,
			transparent 14px,
			rgba(var(--pool-rgb), 0.04) 14px,
			rgba(var(--pool-rgb), 0.04) 15px
		);
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 3px solid var(--type-stripe);

		.mono {
			color: var(--ink-dim);
			font-size: 11px;
		}
	}

	.library-card-body {
		padding: 18px 20px 22px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.library-dossier-id {
		color: var(--type-stripe);
		font-size: 10.5px;
	}

	.library-name {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: 22px;
		line-height: 1.15;
		color: var(--ink-bright);
		letter-spacing: -0.01em;
		font-variation-settings: 'opsz' 96;
	}

	.library-subtitle {
		font-family: var(--font-sans);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
	}

	.library-mini-stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
		margin-top: 10px;
		padding-top: 12px;
		border-top: 1px dashed var(--stone-mid);
	}

	.library-mini-stat {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.mini-stat-label {
		color: var(--ink-dim);
		font-size: 9.5px;
		letter-spacing: 0.06em;
	}

	.mini-stat-value {
		color: var(--lamp-glow);
		font-size: 13px;
		letter-spacing: 0.04em;
	}

	.library-cta-row {
		max-width: 1280px;
		margin: 40px auto 0;
		text-align: center;
		display: flex;
		justify-content: center;
	}

	/* =========================================================
	  SECTION 5 — WHAT WE'VE COMPILED
	  ========================================================= */
	.compiled {
		position: relative;
		padding: 120px 48px;
		background: var(--night-deep);
		overflow: hidden;
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 72px 20px;
		}
	}

	.compiled-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 80% 60% at 50% 50%,
			rgba(var(--pool-rgb), var(--pool-alpha-mid)) 0%,
			transparent 60%
		);
	}

	.compiled-header {
		position: relative;
		z-index: 1;
		max-width: 820px;
		margin: 0 auto 48px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.compiled-grid {
		position: relative;
		z-index: 1;
		max-width: 1180px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 18px;

		@media (max-width: 968px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: 540px) {
			grid-template-columns: 1fr;
		}
	}

	.compiled-stat {
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		text-align: left;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;

		&:hover {
			border-color: var(--lamp-glow);
		}
	}

	.compiled-stat-label {
		color: var(--ink-dim);
		font-size: 11px;
	}

	.compiled-stat-value {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: clamp(36px, 4.5vw, 56px);
		line-height: 1;
		color: var(--ink-bright);
		letter-spacing: -0.02em;
		font-variation-settings: 'opsz' 144;
		font-feature-settings: 'tnum';
	}

	.compiled-stat-annotation {
		color: var(--lamp-glow);
		font-size: 10.5px;
		text-transform: lowercase;
		letter-spacing: 0.08em;
	}

	/* =========================================================
	  SECTION 6 — DOSSIER DEEP ZOOM (smaller than V1)
	  ========================================================= */
	.dossier {
		position: relative;
		background: var(--night-mid);
		padding: 96px 48px;
		overflow: hidden;
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.dossier-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 60% 50% at 50% 50%,
			rgba(var(--pool-rgb), var(--pool-alpha-soft)) 0%,
			transparent 60%
		);
	}

	.dossier-header {
		position: relative;
		z-index: 1;
		max-width: 720px;
		margin: 0 auto 48px;
		text-align: center;
	}

	.dossier-card {
		position: relative;
		z-index: 1;
		max-width: 920px;
		margin: 0 auto;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		padding: 28px 32px;

		@media (max-width: 768px) {
			padding: 18px 16px;
		}
	}

	.dossier-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding-bottom: 22px;
		border-bottom: 1px solid var(--stone-mid);
		flex-wrap: wrap;
	}

	.dossier-id {
		color: var(--lamp-glow);
	}

	.dossier-status {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--ink-mid);

		.status-dot {
			width: 7px;
			height: 7px;
			border-radius: 50%;
			background: var(--data-cyan);
			box-shadow: 0 0 8px rgba(94, 234, 212, 0.6);
		}
	}

	.streetlamp-preview-v2.light-mode .status-dot {
		box-shadow: 0 0 6px rgba(15, 118, 110, 0.5);
	}

	.dossier-body {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 36px;
		padding-top: 24px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 22px;
		}
	}

	.dossier-subject {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.subject-stack {
		position: relative;
		aspect-ratio: 4 / 5;
		background: var(--night-deep);
		overflow: hidden;
		border-radius: 8px;
	}

	.dossier-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: contrast(1.2) brightness(0.95) saturate(0.7) sepia(0.18);
	}

	.streetlamp-preview-v2.light-mode .dossier-image {
		filter: contrast(1.05) brightness(1) saturate(0.9);
	}

	.dossier-image-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 30% 25%, rgba(var(--pool-rgb), 0.18) 0%, transparent 60%),
			linear-gradient(135deg, transparent 40%, rgba(10, 8, 7, 0.7) 100%);
	}

	.streetlamp-preview-v2.light-mode .dossier-image-vignette {
		background:
			radial-gradient(ellipse at 30% 25%, rgba(var(--pool-rgb), 0.06) 0%, transparent 60%),
			linear-gradient(135deg, transparent 60%, rgba(180, 83, 9, 0.05) 100%);
	}

	.corner {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: var(--lamp-glow);
		border-style: solid;
		border-width: 0;

		&--tl {
			top: 6px;
			left: 6px;
			border-top-width: 1px;
			border-left-width: 1px;
		}
		&--tr {
			top: 6px;
			right: 6px;
			border-top-width: 1px;
			border-right-width: 1px;
		}
		&--bl {
			bottom: 6px;
			left: 6px;
			border-bottom-width: 1px;
			border-left-width: 1px;
		}
		&--br {
			bottom: 6px;
			right: 6px;
			border-bottom-width: 1px;
			border-right-width: 1px;
		}
	}

	.subject-meta {
		color: var(--ink-dim);
	}

	.dossier-content {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.dossier-title {
		margin-bottom: 4px;
	}

	.dossier-core {
		color: var(--ink-mid);
		padding-bottom: 16px;
		border-bottom: 1px dashed var(--stone-mid);
	}

	.stats {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 4px 0;
	}

	.stat-row {
		display: grid;
		grid-template-columns: 110px 1fr 50px;
		align-items: center;
		gap: 16px;

		@media (max-width: 480px) {
			grid-template-columns: 92px 1fr 44px;
			gap: 10px;
		}
	}

	.stat-label {
		color: var(--ink-dim);
	}

	.stat-track {
		height: 10px;
		background: var(--night-mid);
		border: 1px solid var(--stone-mid);
		position: relative;
		overflow: hidden;
		border-radius: 2px;
	}

	.streetlamp-preview-v2.light-mode .stat-track {
		background: var(--marble-warm);
	}

	.stat-fill {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--lamp-deep) 0%,
			var(--lamp-glow) 60%,
			var(--lamp-light) 100%
		);
		box-shadow: 0 0 8px rgba(245, 158, 11, 0.35);
		background-image:
			linear-gradient(90deg, var(--lamp-deep) 0%, var(--lamp-glow) 60%, var(--lamp-light) 100%),
			repeating-linear-gradient(
				90deg,
				transparent 0,
				transparent 9px,
				rgba(10, 8, 7, 0.55) 9px,
				rgba(10, 8, 7, 0.55) 10px
			);
		background-blend-mode: multiply;
	}

	.stat-value {
		color: var(--lamp-glow);
		text-align: right;
	}

	.dossier-annotations {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 20px;
		padding: 14px;
		background: var(--night-mid);
		border: 1px solid var(--stone-mid);
		border-radius: 6px;

		.mono {
			color: var(--data-cyan);
		}
	}

	.streetlamp-preview-v2.light-mode .dossier-annotations {
		background: var(--marble-warm);

		.mono {
			color: var(--data-teal);
		}
	}

	.dossier-cta-row {
		margin-top: 4px;
	}

	.dossier-link {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		color: var(--lamp-glow);
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 16px;
		border-bottom: 1px solid transparent;
		padding-bottom: 2px;
		transition:
			border-color 0.2s ease,
			color 0.2s ease;

		&:hover {
			border-bottom-color: var(--lamp-glow);
			color: var(--lamp-light);
		}
	}

	.streetlamp-preview-v2.light-mode .dossier-link:hover {
		color: var(--lamp-deep);
		border-bottom-color: var(--lamp-deep);
	}

	/* =========================================================
	  SECTION 7 — MEETUP
	  ========================================================= */
	.meetup {
		position: relative;
		padding: 120px 48px;
		background: var(--night-mid);
		overflow: hidden;
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 72px 20px;
		}
	}

	.meetup-bg {
		position: absolute;
		inset: 0;
		background-image: url('/philosopher-gathering.webp');
		background-size: cover;
		background-position: center 30%;
		filter: brightness(0.32) saturate(0.75) contrast(1.1) sepia(0.25);
		opacity: 0.55;
		z-index: 0;
	}

	.streetlamp-preview-v2.light-mode .meetup-bg {
		filter: brightness(1.15) saturate(0.5) contrast(0.95) sepia(0.45);
		opacity: 0.18;
	}

	.meetup-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 1;
		background:
			radial-gradient(
				ellipse 70% 60% at 50% 80%,
				rgba(var(--pool-rgb), var(--pool-alpha-mid)) 0%,
				transparent 55%
			),
			linear-gradient(
				180deg,
				rgba(10, 8, 7, 0.85) 0%,
				rgba(22, 17, 13, 0.7) 50%,
				rgba(10, 8, 7, 0.95) 100%
			);
	}

	.streetlamp-preview-v2.light-mode .meetup-pool {
		background:
			radial-gradient(
				ellipse 70% 60% at 50% 80%,
				rgba(var(--pool-rgb), var(--pool-alpha-soft)) 0%,
				transparent 55%
			),
			linear-gradient(
				180deg,
				rgba(250, 248, 244, 0.85) 0%,
				rgba(242, 235, 221, 0.78) 50%,
				rgba(250, 248, 244, 0.95) 100%
			);
	}

	.meetup-header {
		position: relative;
		z-index: 2;
		max-width: 780px;
		margin: 0 auto 48px;
		text-align: center;
	}

	.meetup-sub {
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-mid);
		margin-top: 16px;
	}

	.steps {
		position: relative;
		z-index: 2;
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 22px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 14px;
		}
	}

	.step-card {
		background: rgba(36, 29, 23, 0.85);
		backdrop-filter: blur(2px);
		border: 1px solid var(--stone-edge);
		border-radius: 12px;
		padding: 24px 22px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			border-color: var(--lamp-glow);
			box-shadow:
				0 0 24px var(--lamp-glow-rgba),
				inset 0 1px 0 rgba(245, 158, 11, 0.12);
			transform: translateY(-2px);
		}
	}

	.streetlamp-preview-v2.light-mode .step-card {
		background: rgba(255, 255, 255, 0.94);

		&:hover {
			box-shadow: 0 0 18px var(--lamp-glow-rgba);
		}
	}

	.step-num-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.step-num {
		color: var(--lamp-glow);
	}

	.step-rule {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, var(--lamp-glow) 0%, transparent 100%);
		opacity: 0.45;
	}

	.step-title {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: 22px;
		line-height: 1.2;
		color: var(--ink-bright);
		letter-spacing: -0.01em;
		font-variation-settings: 'opsz' 96;
	}

	.step-body {
		font-family: var(--font-sans);
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	/* =========================================================
	  SECTION 8 — FOOTER
	  ========================================================= */
	.quiet-footer {
		background: var(--night-deep);
		padding: 72px 24px 56px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		border-top: 1px solid var(--stone-edge);
	}

	.footer-tagline {
		font-family: var(--font-serif);
		font-weight: 500;
		font-style: italic;
		font-size: 22px;
		color: var(--ink-mid);
		letter-spacing: -0.01em;
	}

	.footer-nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 10px 14px;
		font-family: var(--font-sans);
		font-size: 14px;
		color: var(--ink-mid);

		a {
			color: var(--ink-mid);
			transition: color 0.18s ease;

			&:hover {
				color: var(--lamp-glow);
			}
		}

		.dot {
			color: var(--ink-dim);
		}
	}

	.footer-copy {
		color: var(--ink-dim);
		margin-top: 12px;
	}

	/* =========================================================
	  Light-mode override safety net
	  Type colors are global; this just protects readability of
	  the type-stripe accents on white-ish cards.
	  ========================================================= */
	.streetlamp-preview-v2.light-mode .demo-card {
		background: var(--marble-warm);
	}

	.streetlamp-preview-v2.light-mode .take-card:hover {
		background: var(--marble-warm);
	}
</style>
