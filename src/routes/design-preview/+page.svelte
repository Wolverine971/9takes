<!-- src/routes/design-preview/+page.svelte -->
<!--
  /design-preview — Streetlamp Symposium mood prototype
  Spec: docs/design/2026-05-01-streetlamp-symposium-mood.md
  Status: NOT PRODUCTION. Scoped styles only. No global token edits.
-->
<script lang="ts">
	let bannerDismissed = $state(false);

	function dismissBanner() {
		bannerDismissed = true;
	}

	// Dossier stat rows (Persona-5 style)
	type StatRow = { label: string; value: number };
	const stats: StatRow[] = [
		{ label: 'INSIGHT', value: 82 },
		{ label: 'DIRECTNESS', value: 100 },
		{ label: 'PATIENCE', value: 31 },
		{ label: 'EMPATHY', value: 56 },
		{ label: 'ANGER', value: 90 }
	];

	// Three-step meetup
	const steps = [
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

	const hookLines = [
		"She's not 'being difficult.' Type 1s need things done right the first time.",
		"He's not 'too intense.' Type 8s test you to see if you'll fold.",
		"Your friend isn't 'flaky.' Type 7s are running from emotional pain."
	];
</script>

<svelte:head>
	<title>Design Preview — Streetlamp Symposium · 9takes</title>
	<meta name="robots" content="noindex, nofollow" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if !bannerDismissed}
	<div class="streetlamp-banner" role="status" aria-live="polite">
		<span class="banner-text">
			<span aria-hidden="true">🚧</span>
			DESIGN PREVIEW — Streetlamp Symposium proposal · 2026-05-01 · not production
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

<div class="streetlamp-preview" class:banner-visible={!bannerDismissed}>
	<!-- ============================================================
	  SECTION 1 — HERO · "The Streetlamp"
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

				<div class="cta-row">
					<a class="cta-primary" href="/questions">
						Read your patterns
						<span aria-hidden="true">→</span>
					</a>
				</div>
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
	  SECTION 3 — DOSSIER CARD · Tech Spec mode demo
	  ============================================================ -->
	<section class="dossier">
		<div class="dossier-pool" aria-hidden="true"></div>

		<header class="dossier-header">
			<span class="mono section-tag">§03 · CASE FILES</span>
			<h2 class="display-md">We don't write personality articles. We compile dossiers.</h2>
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
						{#each stats as stat}
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
	  SECTION 4 — THE MEETUP · Give-first
	  ============================================================ -->
	<section class="meetup">
		<div class="meetup-bg" aria-hidden="true"></div>
		<div class="meetup-pool" aria-hidden="true"></div>

		<header class="meetup-header">
			<span class="mono section-tag">§04 · THE ROOM</span>
			<h2 class="display-md">It's like a 2 AM conversation with people who actually get it.</h2>
			<p class="meetup-sub">
				Drop your situation. Comment first — that's the give-first unlock. Then see how each of the
				9 types reads it.
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
	  SECTION 5 — FOOTER · Quiet
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
		<p class="footer-copy mono">© 2026 9TAKES · STREETLAMP SYMPOSIUM PREVIEW</p>
	</footer>
</div>

<style lang="scss">
	/* =========================================================
	  Scoped tokens for the Streetlamp Symposium preview.
	  Confined to .streetlamp-preview so they cannot leak into
	  the production header/footer or any other route.
	  ========================================================= */
	.streetlamp-preview {
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

		--font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
		--font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
		--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: var(--font-sans);
		min-height: 100vh;
		overflow: hidden;
		position: relative;

		// Reserve room for the sticky banner so the hero doesn't jump under it
		&.banner-visible {
			padding-top: 36px;

			@media (max-width: 640px) {
				padding-top: 56px;
			}
		}

		// Reset some opinionated global styles that can leak in
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
	.streetlamp-banner {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		background: var(--night-mid, #16110d);
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

	/* ---------- subtle paper grain (svg-noise overlay) ---------- */
	.grain {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.05;
		mix-blend-mode: overlay;
		z-index: 1;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.85 0 0 0 0 0.6 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
	}

	/* =========================================================
	  SECTION 1 — HERO
	  ========================================================= */
	.hero {
		position: relative;
		min-height: calc(100vh - 36px);
		padding: 96px 48px 120px;
		background: var(--night-deep);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 64px 24px 80px;
			min-height: auto;
		}
	}

	.hero-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 60% 55% at 18% 8%,
				rgba(245, 158, 11, 0.28) 0%,
				rgba(245, 158, 11, 0.08) 30%,
				transparent 60%
			),
			radial-gradient(ellipse 90% 70% at 22% 12%, rgba(180, 83, 9, 0.18) 0%, transparent 55%);
		z-index: 0;
	}

	.hero-grid {
		position: relative;
		z-index: 2;
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 64px;
		align-items: center;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 32px;
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
		margin-bottom: 40px;
		max-width: 560px;
	}

	.cta-row {
		display: flex;
		gap: 16px;
	}

	.cta-primary {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		background: var(--lamp-glow);
		color: var(--night-deep);
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: 16px;
		letter-spacing: 0.01em;
		padding: 16px 28px;
		border-radius: 2px;
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease,
			background 0.18s ease;
		border: 1px solid rgba(251, 191, 36, 0.5);

		span {
			transition: transform 0.18s ease;
		}

		&:hover {
			background: var(--lamp-light);
			box-shadow:
				0 0 32px rgba(245, 158, 11, 0.4),
				0 0 1px rgba(251, 191, 36, 0.6) inset;
			transform: translateY(-1px);

			span {
				transform: translateX(3px);
			}
		}
	}

	/* ---- hero subject (statue) ---- */
	.hero-subject {
		position: relative;

		@media (max-width: 968px) {
			display: none; // simplified mobile hero per spec
		}
	}

	.subject-frame {
		position: relative;
		aspect-ratio: 4 / 5;
		max-height: 640px;
		margin-left: auto;
		overflow: hidden;
	}

	.statue {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
		filter: contrast(1.18) brightness(1.04) saturate(0.88);
		// Re-tint into warm sodium tones
		mix-blend-mode: screen;
	}

	.subject-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 25% 25%, rgba(245, 158, 11, 0.22) 0%, transparent 55%),
			linear-gradient(135deg, transparent 35%, rgba(10, 8, 7, 0.65) 100%),
			linear-gradient(180deg, transparent 60%, rgba(10, 8, 7, 0.85) 100%);
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

	/* =========================================================
	  SECTION 2 — HOOK
	  ========================================================= */
	.hook {
		background: var(--night-deep);
		padding: 120px 48px;
		border-top: 1px solid rgba(92, 79, 71, 0.25);

		@media (max-width: 768px) {
			padding: 72px 24px;
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
			gap: 40px;
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
		border-bottom: 1px solid var(--stone-warm);

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
	  SECTION 3 — DOSSIER
	  ========================================================= */
	.dossier {
		position: relative;
		background: var(--night-deep);
		padding: 120px 48px;
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 72px 20px;
		}
	}

	.dossier-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 60% 50% at 50% 50%,
			rgba(245, 158, 11, 0.08) 0%,
			transparent 60%
		);
	}

	.dossier-header {
		position: relative;
		z-index: 1;
		max-width: 780px;
		margin: 0 auto 64px;
		text-align: center;
	}

	.dossier-card {
		position: relative;
		z-index: 1;
		max-width: 1040px;
		margin: 0 auto;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		box-shadow: inset 0 1px 0 rgba(245, 158, 11, 0.06);
		padding: 32px 36px;

		@media (max-width: 768px) {
			padding: 20px 18px;
		}
	}

	.dossier-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding-bottom: 24px;
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

	.dossier-body {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 40px;
		padding-top: 28px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 24px;
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
	}

	.dossier-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: contrast(1.2) brightness(0.95) saturate(0.7) sepia(0.18);
	}

	.dossier-image-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 30% 25%, rgba(245, 158, 11, 0.2) 0%, transparent 60%),
			linear-gradient(135deg, transparent 40%, rgba(10, 8, 7, 0.7) 100%);
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
		gap: 20px;
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
		gap: 14px;
		padding: 8px 0;
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
		// Persona-5 segmented look
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
		gap: 16px 24px;
		padding: 16px;
		background: var(--night-mid);
		border: 1px solid var(--stone-mid);

		.mono {
			color: var(--data-cyan);
		}
	}

	.dossier-cta-row {
		margin-top: 8px;
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

	/* =========================================================
	  SECTION 4 — MEETUP
	  ========================================================= */
	.meetup {
		position: relative;
		padding: 120px 48px;
		background: var(--night-mid);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 72px 24px;
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

	.meetup-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 1;
		background:
			radial-gradient(ellipse 70% 60% at 50% 80%, rgba(245, 158, 11, 0.22) 0%, transparent 55%),
			linear-gradient(
				180deg,
				rgba(10, 8, 7, 0.85) 0%,
				rgba(22, 17, 13, 0.7) 50%,
				rgba(10, 8, 7, 0.95) 100%
			);
	}

	.meetup-header {
		position: relative;
		z-index: 2;
		max-width: 780px;
		margin: 0 auto 56px;
		text-align: center;
	}

	.meetup-sub {
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
		margin-top: 20px;
	}

	.steps {
		position: relative;
		z-index: 2;
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 16px;
		}
	}

	.step-card {
		background: rgba(36, 29, 23, 0.85);
		backdrop-filter: blur(2px);
		border: 1px solid var(--stone-edge);
		padding: 28px 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			border-color: var(--lamp-glow);
			box-shadow:
				0 0 24px rgba(245, 158, 11, 0.18),
				inset 0 1px 0 rgba(245, 158, 11, 0.12);
			transform: translateY(-2px);
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
	  SECTION 5 — FOOTER
	  ========================================================= */
	.quiet-footer {
		background: var(--night-deep);
		padding: 72px 24px 56px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		border-top: 1px solid var(--stone-warm);
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
</style>
