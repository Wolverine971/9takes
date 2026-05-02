<!-- src/routes/design-preview/v3/+page.svelte -->
<!--
  /design-preview/v3 — Streetlamp Symposium V3 mood prototype
  Spec: docs/design/2026-05-02-streetlamp-symposium-v3.md
  V2 ref: docs/design/2026-05-01-streetlamp-symposium-v2.md
  Status: NOT PRODUCTION. Scoped styles only. No global token edits.
  V3 pivots: drop Fraunces (Inter for everything), diagrammatic above-the-fold,
  time-dynamic open question, no "dossier" in user-facing copy.
-->
<script lang="ts">
	// --- preview chrome state -------------------------------------------------
	let bannerDismissed = $state(false);
	let theme = $state<'dark' | 'light'>('dark');

	$effect(() => {
		if (typeof window === 'undefined') return;
		const stored = localStorage.getItem('9takes-preview-theme-v3');
		if (stored === 'light' || stored === 'dark') {
			theme = stored;
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			theme = 'light';
		}
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		if (typeof window !== 'undefined') {
			localStorage.setItem('9takes-preview-theme-v3', theme);
		}
	}

	function dismissBanner() {
		bannerDismissed = true;
	}

	// --- time-dynamic window for open-question section ------------------------
	function getTimeWindow(): { title: string; kicker: string } {
		const hour = new Date().getHours();
		if (hour >= 5 && hour < 12) {
			return { title: "This morning's open question", kicker: 'MORNING' };
		} else if (hour >= 12 && hour < 17) {
			return { title: "This afternoon's open question", kicker: 'AFTERNOON' };
		} else if (hour >= 17 && hour < 22) {
			return { title: "This evening's open question", kicker: 'EVENING' };
		} else {
			return { title: 'Still open at midnight', kicker: 'LATE' };
		}
	}

	const timeWindow = $state(getTimeWindow());

	// short month-day label for mono kicker (e.g. MAY 02)
	function getDateLabel(): string {
		const months = [
			'JAN',
			'FEB',
			'MAR',
			'APR',
			'MAY',
			'JUN',
			'JUL',
			'AUG',
			'SEP',
			'OCT',
			'NOV',
			'DEC'
		];
		const d = new Date();
		const day = String(d.getDate()).padStart(2, '0');
		return `${months[d.getMonth()]} ${day}`;
	}
	const dateLabel = $state(getDateLabel());

	// --- stub data ------------------------------------------------------------
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
	type Step = { num: string; title: string; body: string };

	const currentQuestion = 'What is something people misunderstand about you?';

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
			typeName: 'The Challenger',
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
			typeName: 'The Individualist',
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
			typeName: 'The Investigator',
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
			typeName: 'The Perfectionist',
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
			typeName: 'The Enthusiast',
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
			typeName: 'The Peacemaker',
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
		{ label: 'PERSONALITY BREAKDOWNS', value: '1,247', annotation: 'growing' },
		{ label: 'EMOTIONAL FRAMES', value: '9', annotation: 'exact' },
		{ label: 'LINEAGE', value: '2,500 yr', annotation: 'plato → now' },
		{ label: 'COMMENTS GATHERED', value: '47,000+', annotation: 'unbiased' }
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
	<title>Design Preview V3 — Streetlamp Symposium · 9takes</title>
	<meta name="robots" content="noindex, nofollow" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if !bannerDismissed}
	<div
		class="streetlamp-banner-v3"
		class:light-banner={theme === 'light'}
		role="status"
		aria-live="polite"
	>
		<span class="banner-text">
			<span aria-hidden="true">🚧</span>
			DESIGN PREVIEW — Streetlamp Symposium v3 · 2026-05-02 · diagrammatic + Inter + time-dynamic
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
	class="streetlamp-preview-v3"
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
	  ABOVE-THE-FOLD — Anatomy of 9takes diagram
	  ============================================================ -->
	<section class="anatomy">
		<div class="grain" aria-hidden="true"></div>
		<div class="anatomy-pool" aria-hidden="true"></div>

		<div class="anatomy-inner">
			<!-- §01 Observation + statue -->
			<div class="anatomy-top">
				<div class="anatomy-text">
					<div class="anatomy-eyebrow">
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

					<p class="mono coords">LAT 37.9755° N · LONG 23.7348° E · 2,500 YR</p>

					<p class="hook-line">
						Frustrated that the same patterns keep playing out — even though you&rsquo;ve read the
						books?
					</p>
				</div>

				<div class="anatomy-subject" aria-hidden="true">
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

			<div class="anatomy-divider" aria-hidden="true"></div>

			<!-- §02 INPUT → §03 MECHANISM → §04 OUTPUT diagram regions -->
			<div class="diagram-row" role="group" aria-label="How 9takes works">
				<div class="diagram-region">
					<span class="mono region-label">§02 · INPUT</span>
					<p class="region-body">
						<strong>ONE SITUATION</strong> from your life or someone else&rsquo;s
					</p>
				</div>

				<div class="diagram-arrow" aria-hidden="true">
					<span class="arrow-glyph">→</span>
				</div>

				<div class="diagram-region">
					<span class="mono region-label">§03 · MECHANISM</span>
					<p class="region-body">
						<strong>GIVE YOUR TAKE</strong> first — before the room can shape it
					</p>
				</div>

				<div class="diagram-arrow" aria-hidden="true">
					<span class="arrow-glyph">→</span>
				</div>

				<div class="diagram-region">
					<span class="mono region-label">§04 · OUTPUT</span>
					<p class="region-body">
						<strong>9 EMOTIONAL READS</strong> of the same situation, one per type
					</p>
				</div>
			</div>

			<div class="anatomy-divider" aria-hidden="true"></div>

			<!-- §05 Where to start (inline annotations, not CTA buttons) -->
			<div class="anatomy-entry">
				<span class="mono region-label region-label--solo">§05 · WHERE TO START</span>
				<ul class="entry-list">
					<li class="entry-item">
						<span class="entry-marker" aria-hidden="true">●─→</span>
						<a href="/community" class="entry-link">
							<span class="mono entry-tag">NEW HERE?</span>
							<span class="entry-text">Start with the 9-minute primer</span>
							<span class="entry-arrow" aria-hidden="true">→</span>
						</a>
					</li>
					<li class="entry-item">
						<span class="entry-marker" aria-hidden="true">●─→</span>
						<a href="/questions" class="entry-link">
							<span class="mono entry-tag">KNOW YOUR TYPE?</span>
							<span class="entry-text">Drop tonight&rsquo;s take</span>
							<span class="entry-arrow" aria-hidden="true">→</span>
						</a>
					</li>
				</ul>
			</div>

			<div class="anatomy-divider" aria-hidden="true"></div>

			<!-- §06 Why trust this -->
			<div class="anatomy-credibility">
				<span class="mono credibility-label">§06 · WHY TRUST THIS</span>
				<p class="mono credibility-line">
					1,247 PERSONALITY BREAKDOWNS · 47,000+ UNBIASED TAKES · 2,500 YR LINEAGE
				</p>
			</div>
		</div>
	</section>

	<!-- ============================================================
	  SECTION 7 — THE HOOK · "We know things"
	  ============================================================ -->
	<section class="hook">
		<div class="hook-grid">
			<div class="hook-left">
				<span class="mono section-tag">§07 · DIAGNOSIS</span>
				<h2 class="display-md">Most people walk around blind to their own patterns.</h2>
			</div>

			<div class="hook-right">
				<ul class="hook-lines">
					{#each hookLines as line}
						<li class="hook-line-row">
							<span class="arrow" aria-hidden="true">→</span>
							<span class="line-body">{line}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- ============================================================
	  SECTION 8 — TIME-DYNAMIC OPEN QUESTION
	  ============================================================ -->
	<section class="open-floor">
		<div class="open-floor-pool" aria-hidden="true"></div>
		<header class="open-floor-header">
			<span class="mono section-tag">§08 · THE FLOOR IS OPEN</span>
			<h2 class="display-md">{timeWindow.title}.</h2>
			<p class="mono open-floor-kicker">
				OPEN · {timeWindow.kicker} · {dateLabel} · 137 RESPONSES
			</p>
			<blockquote class="open-floor-question">
				&ldquo;{currentQuestion}&rdquo;
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
	  SECTION 9 — DIAGRAMMATIC COMPARISON
	  9 perspectives, not 1 generic answer
	  ============================================================ -->
	<section class="comparison">
		<header class="comparison-header">
			<span class="mono section-tag">§09 · WHY 9 NOT 1</span>
			<h2 class="display-md">9 perspectives, not 1 generic answer.</h2>
			<p class="comparison-sub">
				The shape of an answer changes everything. Here is the same question, three places.
			</p>
		</header>

		<div class="comparison-grid">
			<!-- ASK A FRIEND -->
			<div class="comparison-col">
				<span class="mono comparison-label">OPTION A — ASK A FRIEND</span>
				<div class="comparison-diagram comparison-diagram--friend" aria-hidden="true">
					<span class="dot dot--single"></span>
				</div>
				<p class="comparison-caption-strong">one read</p>
				<p class="comparison-caption">
					their type only · biased toward what they already think of you
				</p>
			</div>

			<div class="comparison-divider" aria-hidden="true"></div>

			<!-- ASK REDDIT -->
			<div class="comparison-col">
				<span class="mono comparison-label">OPTION B — ASK REDDIT</span>
				<div class="comparison-diagram comparison-diagram--reddit" aria-hidden="true">
					<span class="dot"></span>
					<span class="dot dot--loud"></span>
					<span class="dot"></span>
				</div>
				<p class="comparison-caption-strong">loud reads</p>
				<p class="comparison-caption">whoever yells first wins · groupthink in a hoodie</p>
			</div>

			<div class="comparison-divider" aria-hidden="true"></div>

			<!-- ASK 9TAKES -->
			<div class="comparison-col">
				<span class="mono comparison-label">OPTION C — ASK 9TAKES</span>
				<div class="comparison-diagram comparison-diagram--9takes" aria-hidden="true">
					<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="enneagram-fig">
						<!-- 9 dots arranged in a circle, connected -->
						{#each Array(9) as _, i}
							{@const angle = (Math.PI * 2 * i) / 9 - Math.PI / 2}
							{@const cx = 60 + Math.cos(angle) * 44}
							{@const cy = 60 + Math.sin(angle) * 44}
							<circle {cx} {cy} r="4.5" class="enn-dot" data-type={i + 1} />
						{/each}
						<!-- triangle 9-3-6 -->
						<polygon points="60,16 98.1,82 21.9,82" fill="none" class="enn-line enn-tri" />
						<!-- hexad 1-4-2-8-5-7-1 -->
						<polyline
							points="86.2,29.5 78.4,103.0 35.5,93.5 33.8,29.5 81.2,103.0 41.6,103.0 86.2,29.5"
							fill="none"
							class="enn-line enn-hex"
						/>
					</svg>
				</div>
				<p class="comparison-caption-strong">9 emotional lenses</p>
				<p class="comparison-caption">on the same situation · give-first keeps it honest</p>
			</div>
		</div>
	</section>

	<!-- ============================================================
	  SECTION 10 — THE LIBRARY
	  ============================================================ -->
	<section class="library">
		<header class="library-header">
			<span class="mono section-tag">§10 · CASE FILES</span>
			<h2 class="display-md">The Library.</h2>
			<p class="library-sub">
				1,247 personality breakdowns. Public figures. Fictional characters. Athletes. Founders. Read
				at the depth you&rsquo;d expect from a real psychologist, not a clickbait listicle.
			</p>
			<p class="mono library-kicker">THE LIBRARY · 1,247 BREAKDOWNS · 9 TYPES · GROWING</p>
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
						<span class="mono library-id">
							№ {d.id} · TYPE {d.type} · {d.typeName.toUpperCase()}
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
				Browse all 1,247 breakdowns
				<span aria-hidden="true">→</span>
			</a>
		</div>
	</section>

	<!-- ============================================================
	  SECTION 11 — BY THE NUMBERS
	  ============================================================ -->
	<section class="compiled">
		<div class="compiled-pool" aria-hidden="true"></div>
		<header class="compiled-header">
			<span class="mono section-tag">§11 · CORPUS</span>
			<h2 class="display-md">By the numbers.</h2>
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
	  SECTION 12 — INSIDE ONE BREAKDOWN · Type 8 zoom
	  ============================================================ -->
	<section class="dossier">
		<div class="dossier-pool" aria-hidden="true"></div>

		<header class="dossier-header">
			<span class="mono section-tag">§12 · DEEP ZOOM</span>
			<h2 class="display-md">Inside one breakdown.</h2>
		</header>

		<article class="dossier-card">
			<div class="dossier-card-top">
				<span class="mono dossier-id">№ 0008 · TYPE 8 · THE CHALLENGER</span>
				<span class="mono dossier-status">
					<span class="status-dot" aria-hidden="true"></span>
					STATUS: ACTIVE · LAST OBSERVED: 2026-05-02
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
							Read the full breakdown
							<span aria-hidden="true">→</span>
						</a>
					</div>
				</div>
			</div>
		</article>
	</section>

	<!-- ============================================================
	  SECTION 13 — HOW A TAKE TURNS INTO 9 READS
	  (renamed from "The Meetup" — V3 leans more diagrammatic)
	  ============================================================ -->
	<section class="meetup">
		<div class="meetup-bg" aria-hidden="true"></div>
		<div class="meetup-pool" aria-hidden="true"></div>

		<header class="meetup-header">
			<span class="mono section-tag">§13 · THE MECHANISM</span>
			<h2 class="display-md">How a take turns into 9 reads.</h2>
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
	  SECTION 14 — FOOTER
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
		<p class="footer-copy mono">© 2026 9TAKES · STREETLAMP SYMPOSIUM V3 PREVIEW</p>
	</footer>
</div>

<style lang="scss">
	/* =========================================================
	  Scoped tokens for the Streetlamp Symposium V3 preview.
	  Confined to .streetlamp-preview-v3 so they cannot leak.
	  Identical color palette to V2; type system replaces serif with Inter.
	  ========================================================= */
	.streetlamp-preview-v3 {
		/* dark mode (default) */
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

		--pool-alpha-strong: 0.28;
		--pool-alpha-mid: 0.18;
		--pool-alpha-soft: 0.08;
		--pool-rgb: 245, 158, 11;
		--pool-deep-rgb: 180, 83, 9;
		--statue-blend: screen;
		--grain-opacity: 0.05;

		--cta-text: var(--night-deep);

		/* V3: Inter for everything; JetBrains Mono for labels */
		--font-display: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
		--font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
		--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: var(--font-body);
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

			--cta-text: #faf8f4;
		}

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

	/* V3 type scale — Inter doing all the work */
	.display-xl {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(40px, 7.4vw, 72px);
		line-height: 1.02;
		letter-spacing: -0.04em;
		color: var(--ink-bright);
	}

	.display-md {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(28px, 4vw, 40px);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--ink-bright);
	}

	.section-tag {
		display: inline-block;
		margin-bottom: 16px;
		color: var(--lamp-glow);
	}

	/* ---------- preview banner ---------- */
	.streetlamp-banner-v3 {
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

	/* ---------- subtle paper grain ---------- */
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
	  ANATOMY — above-the-fold diagram
	  ========================================================= */
	.anatomy {
		position: relative;
		padding: 96px 48px 72px;
		background: var(--night-deep);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 64px 20px 56px;
		}
	}

	.anatomy-pool {
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

	.anatomy-inner {
		position: relative;
		z-index: 2;
		max-width: 1280px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.anatomy-top {
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 56px;
		align-items: center;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}

	.anatomy-text {
		max-width: 680px;
	}

	.anatomy-eyebrow {
		margin-bottom: 22px;

		.mono {
			color: var(--lamp-glow);
		}
	}

	.scale-marker {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 18px;
		margin: 24px 0 14px;
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
		margin-bottom: 28px;
	}

	.hook-line {
		font-family: var(--font-body);
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;
	}

	/* statue, smaller than V2 — embedded in the diagram, not focal */
	.anatomy-subject {
		position: relative;

		@media (max-width: 968px) {
			display: none;
		}
	}

	.subject-frame {
		position: relative;
		aspect-ratio: 4 / 5;
		max-height: 460px;
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

	.streetlamp-preview-v3.light-mode .statue {
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

	.streetlamp-preview-v3.light-mode .subject-vignette {
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

	/* ---- section dividers (scale-marker style) ---- */
	.anatomy-divider {
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--stone-edge) 12%,
			var(--stone-edge) 88%,
			transparent 100%
		);
		opacity: 0.65;
	}

	/* ---- INPUT → MECHANISM → OUTPUT diagram row ---- */
	.diagram-row {
		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		align-items: stretch;
		gap: 16px;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 0;
		}
	}

	.diagram-region {
		border: 1px solid var(--stone-edge);
		padding: 22px 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		background: transparent;
		min-height: 132px;
	}

	.region-label {
		color: var(--lamp-glow);
		font-size: 12px;
	}

	.region-label--solo {
		margin-bottom: 12px;
	}

	.region-body {
		font-family: var(--font-body);
		font-size: 17px;
		line-height: 1.5;
		color: var(--ink-bright);

		strong {
			color: var(--ink-bright);
			font-weight: 700;
			letter-spacing: -0.005em;
		}
	}

	.diagram-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;

		.arrow-glyph {
			font-family: var(--font-mono);
			font-size: 28px;
			color: var(--lamp-glow);
			line-height: 1;
			text-shadow: 0 0 14px var(--lamp-glow-rgba);
		}

		@media (max-width: 968px) {
			min-width: 0;
			padding: 10px 0;

			.arrow-glyph {
				font-size: 22px;
				transform: rotate(90deg);
				display: inline-block;
			}
		}
	}

	/* ---- §05 entry-point bullets (NOT card CTAs) ---- */
	.anatomy-entry {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.entry-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.entry-item {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.entry-marker {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--lamp-glow);
		letter-spacing: 0;
		flex-shrink: 0;
	}

	.entry-link {
		display: inline-flex;
		align-items: baseline;
		gap: 14px;
		padding: 8px 0;
		color: var(--ink-bright);
		font-family: var(--font-body);
		font-size: 17px;
		line-height: 1.4;
		flex-wrap: wrap;
		transition: color 0.18s ease;

		&:hover {
			color: var(--lamp-glow);

			.entry-arrow {
				transform: translateX(4px);
			}
		}
	}

	.entry-tag {
		color: var(--lamp-glow);
		font-size: 11px;
	}

	.entry-text {
		color: var(--ink-bright);
		font-weight: 500;
	}

	.entry-arrow {
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 14px;
		transition: transform 0.18s ease;
	}

	/* ---- §06 credibility line ---- */
	.anatomy-credibility {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.credibility-label {
		color: var(--lamp-glow);
		font-size: 12px;
	}

	.credibility-line {
		color: var(--ink-mid);
		font-size: 12.5px;
		letter-spacing: 0.06em;
		line-height: 1.55;

		@media (max-width: 540px) {
			font-size: 11px;
			letter-spacing: 0.04em;
		}
	}

	/* =========================================================
	  HOOK
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

	.hook-line-row {
		display: grid;
		grid-template-columns: 24px 1fr;
		gap: 12px;
		font-family: var(--font-body);
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
	  OPEN FLOOR (time-dynamic)
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
		font-family: var(--font-display);
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
		letter-spacing: -0.015em;
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
		font-family: var(--font-body);
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-bright);
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

	/* CTA buttons */
	.cta-primary {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		background: var(--lamp-glow);
		color: var(--cta-text);
		font-family: var(--font-body);
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

	.streetlamp-preview-v3.light-mode .cta-primary {
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

	.streetlamp-preview-v3.light-mode .cta-primary--ghost {
		color: var(--lamp-glow);
		border-color: var(--lamp-glow);

		&:hover {
			color: var(--lamp-deep);
			background: var(--lamp-soft);
		}
	}

	/* =========================================================
	  COMPARISON DIAGRAM — 9 perspectives, not 1
	  ========================================================= */
	.comparison {
		padding: 120px 48px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 72px 20px;
		}
	}

	.comparison-header {
		max-width: 820px;
		margin: 0 auto 64px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.comparison-sub {
		font-family: var(--font-body);
		font-size: 16px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;
	}

	.comparison-grid {
		max-width: 1180px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		gap: 32px;
		align-items: stretch;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 32px;
		}
	}

	.comparison-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		padding: 16px 8px;
		text-align: center;
	}

	.comparison-label {
		color: var(--lamp-glow);
		font-size: 11.5px;
	}

	.comparison-divider {
		width: 1px;
		background: var(--stone-edge);
		opacity: 0.6;
		min-height: 200px;

		@media (max-width: 768px) {
			width: 100%;
			height: 1px;
			min-height: 0;
		}
	}

	.comparison-diagram {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 140px;
		padding: 10px;
	}

	.comparison-diagram--friend .dot {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--ink-mid);
	}

	.comparison-diagram--reddit {
		gap: 14px;

		.dot {
			width: 14px;
			height: 14px;
			border-radius: 50%;
			background: var(--ink-mid);
			opacity: 0.7;
		}

		.dot--loud {
			width: 26px;
			height: 26px;
			background: var(--lamp-glow);
			opacity: 0.95;
			box-shadow: 0 0 16px var(--lamp-glow-rgba);
		}
	}

	.comparison-diagram--9takes {
		.enneagram-fig {
			width: 140px;
			height: 140px;
		}

		.enn-dot {
			fill: var(--lamp-glow);
		}

		.enn-line {
			stroke: var(--ink-dim);
			stroke-width: 1.2;
			opacity: 0.55;
		}

		.enn-tri {
			stroke: var(--data-cyan);
			opacity: 0.7;
		}

		.streetlamp-preview-v3.light-mode & .enn-tri {
			stroke: var(--data-teal);
		}
	}

	.comparison-caption-strong {
		font-family: var(--font-body);
		font-size: 17px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--ink-bright);
	}

	.comparison-caption {
		font-family: var(--font-body);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
		max-width: 240px;
	}

	/* =========================================================
	  LIBRARY
	  ========================================================= */
	.library {
		padding: 120px 48px;
		background: var(--night-deep);
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
		font-family: var(--font-body);
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

	.library-id {
		color: var(--type-stripe);
		font-size: 10.5px;
	}

	.library-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 24px;
		line-height: 1.15;
		color: var(--ink-bright);
		letter-spacing: -0.02em;
	}

	.library-subtitle {
		font-family: var(--font-body);
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
	  COMPILED — by the numbers
	  ========================================================= */
	.compiled {
		position: relative;
		padding: 120px 48px;
		background: var(--night-mid);
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
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(36px, 4.5vw, 56px);
		line-height: 1;
		color: var(--ink-bright);
		letter-spacing: -0.03em;
		font-feature-settings: 'tnum';
	}

	.compiled-stat-annotation {
		color: var(--lamp-glow);
		font-size: 10.5px;
		text-transform: lowercase;
		letter-spacing: 0.08em;
	}

	/* =========================================================
	  DOSSIER ZOOM
	  ========================================================= */
	.dossier {
		position: relative;
		background: var(--night-deep);
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

	.streetlamp-preview-v3.light-mode .status-dot {
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

	.streetlamp-preview-v3.light-mode .dossier-image {
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

	.streetlamp-preview-v3.light-mode .dossier-image-vignette {
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

	.streetlamp-preview-v3.light-mode .stat-track {
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

	.streetlamp-preview-v3.light-mode .dossier-annotations {
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
		font-family: var(--font-body);
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

	.streetlamp-preview-v3.light-mode .dossier-link:hover {
		color: var(--lamp-deep);
		border-bottom-color: var(--lamp-deep);
	}

	/* =========================================================
	  MEETUP / Mechanism
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

	.streetlamp-preview-v3.light-mode .meetup-bg {
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

	.streetlamp-preview-v3.light-mode .meetup-pool {
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

	.streetlamp-preview-v3.light-mode .step-card {
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
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 22px;
		line-height: 1.2;
		color: var(--ink-bright);
		letter-spacing: -0.02em;
	}

	.step-body {
		font-family: var(--font-body);
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	/* =========================================================
	  FOOTER
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
		font-family: var(--font-display);
		font-weight: 500;
		font-style: italic;
		font-size: 22px;
		color: var(--ink-mid);
		letter-spacing: -0.015em;
	}

	.footer-nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 10px 14px;
		font-family: var(--font-body);
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
	  Light-mode safety net
	  ========================================================= */
	.streetlamp-preview-v3.light-mode .take-card:hover {
		background: var(--marble-warm);
	}
</style>
